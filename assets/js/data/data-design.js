/* Data design and modelling: the "data designing" ground HR flagged for the
   Navi loop. Warehouse modelling, grain, keys, slowly changing dimensions,
   event schema design and designing for data quality. Examples lean on lending
   and payments so the vocabulary matches the interview. */
DAQ.registerTopic({
  id: 'data-design',
  group: 'prep',
  name: 'Data Design & Modelling',
  icon: '\uD83E\uDDF1',
  blurb: 'Warehouse design questions: OLTP versus OLAP, facts and dimensions, grain, star schemas, surrogate keys, slowly changing dimensions, event schemas, point-in-time correctness and designing for data quality.',
  questions: [
    /* ---------------------------- EASY ---------------------------- */
    {
      id: 'dd-e1',
      difficulty: 'easy',
      prompt: 'Explain the difference between <strong>OLTP and OLAP</strong> systems, and why analysts are not simply given a connection to the production database.',
      hint: 'One is optimised for writing single rows quickly, the other for reading millions.',
      concepts: [
        { label: 'OLTP handles many small transactional reads and writes', any: ['oltp', 'transaction', 'write', 'insert', 'single row', 'operational'], required: true },
        { label: 'OLAP handles large analytical reads and aggregations', any: ['olap', 'analytic', 'aggregat', 'read', 'scan', 'reporting'], required: true },
        { label: 'OLTP is normalised, OLAP is usually denormalised for query simplicity', any: ['normalis', 'normaliz', 'denormal', 'star', 'schema differ'], required: true },
        { label: 'Row storage suits OLTP, columnar storage suits OLAP', any: ['row store', 'column', 'columnar', 'storage format', 'compression'], required: true },
        { label: 'Analytical queries on production would degrade or lock the live system', any: ['degrade', 'lock', 'slow down', 'production impact', 'contention', 'outage', 'load'], required: true },
        { label: 'A warehouse keeps history, while OLTP often only holds current state', any: ['history', 'current state', 'overwrite', 'point in time', 'snapshot', 'audit'], required: true },
        { label: 'Separation also gives consistent business definitions and access control', any: ['definition', 'single source', 'governance', 'access', 'permission', 'certified'] }
      ],
      approach: `<p>Answer with the purpose of each system, then the three consequences: schema, storage and history. Finish with the operational reason analysts are kept off production.</p>
      <ol>
        <li><strong>OLTP</strong> serves the application: thousands of tiny reads and writes per second, each touching one or a few rows, with strict consistency. A loan disbursal or a UPI payment lands here.</li>
        <li><strong>OLAP</strong> serves analysis: a few large queries that scan millions of rows and aggregate them, where latency of seconds is acceptable but throughput over huge scans matters.</li>
        <li><strong>Schema:</strong> OLTP is normalised to avoid update anomalies and keep writes cheap. OLAP is deliberately denormalised, typically into a star schema, so analysts write fewer joins and the engine scans less.</li>
        <li><strong>Storage:</strong> OLTP uses row storage because it fetches whole records; OLAP uses columnar storage, which reads only the needed columns and compresses far better, which is why the same query can be orders of magnitude faster.</li>
        <li><strong>History:</strong> production tables usually hold current state and overwrite in place. A warehouse keeps history, so you can answer what a customer credit limit was on the day a loan was approved. That capability alone justifies the separate system.</li>
        <li><strong>Why not query production:</strong> a single unindexed analytical scan can consume the resources the live application needs, causing latency or an outage, and long-running reads can hold locks. Add governance: the warehouse carries agreed definitions and controlled access to sensitive fields.</li>
      </ol>`,
      answer: `<p>OLTP systems run the application. They handle a high rate of small transactional reads and writes, are normalised so writes stay cheap and consistent, and typically use row-based storage because each query fetches whole records. OLAP systems exist for analysis: fewer, much larger queries that scan and aggregate millions of rows, modelled in a denormalised star schema and stored column by column so only the needed columns are read and compression is far more effective.</p>
      <p>Analysts are kept off production for three reasons. First, load: one heavy analytical scan can consume the capacity the live service needs, degrading latency or causing an outage, and long reads can create lock contention. Second, history: operational tables usually hold only current state and overwrite in place, so they cannot answer what a customer credit limit or risk band was on the day a decision was made, whereas a warehouse preserves that history. Third, governance: the warehouse holds agreed metric definitions and controlled access to sensitive columns, so two teams asking the same question get the same number.</p>`
    },
    {
      id: 'dd-e2',
      difficulty: 'easy',
      prompt: 'What is the difference between a <strong>fact table and a dimension table</strong>, and what does the <strong>grain</strong> of a fact table mean? Why is grain the first thing you decide?',
      hint: 'Grain is the sentence that says exactly what one row represents.',
      concepts: [
        { label: 'Fact tables hold measurable events with numeric measures', any: ['fact', 'measure', 'numeric', 'event', 'metric', 'transaction'], required: true },
        { label: 'Dimension tables hold descriptive context used to slice facts', any: ['dimension', 'descriptive', 'attribute', 'context', 'slice', 'filter by'], required: true },
        { label: 'Facts are long and narrow, dimensions are short and wide', any: ['long', 'narrow', 'wide', 'many rows', 'fewer rows', 'grows'], required: true },
        { label: 'Grain is the precise definition of what a single fact row represents', any: ['one row', 'single row', 'what a row', 'level of detail', 'grain is'], required: true },
        { label: 'Grain must be declared before choosing keys and measures', any: ['first', 'before', 'decide', 'declare', 'starting point'], required: true },
        { label: 'Mixed grain causes double counting when facts are aggregated', any: ['double count', 'mixed', 'duplicate', 'wrong total', 'inflate', 'fan out'], required: true },
        { label: 'Prefer the most atomic grain available, since it can be rolled up later', any: ['atomic', 'lowest', 'finest', 'most detailed', 'roll up', 'aggregate later'] }
      ],
      approach: `<p>Define both, then spend the answer on grain, because that is the part that separates people who have modelled from people who have read about modelling.</p>
      <ol>
        <li><strong>Fact table:</strong> the measurements of a business process. One row per event, with numeric measures such as amount, and foreign keys to dimensions. It grows forever and is long and narrow.</li>
        <li><strong>Dimension table:</strong> the context you filter and group by, such as customer, product, branch, date. Wide with many descriptive attributes, comparatively few rows, and changing slowly.</li>
        <li><strong>Grain:</strong> a sentence stating exactly what one row is. "One row per loan instalment due date" or "one row per UPI transaction attempt". If you cannot write that sentence, the model is not designed yet.</li>
        <li><strong>Why first:</strong> the grain determines the primary key, which dimensions can attach, and which measures are additive. Choose it wrong and every downstream query is either wrong or awkward.</li>
        <li><strong>The failure it prevents:</strong> mixing grains in one table, for example loan-level rows and instalment-level rows together, makes any SUM double count. Most "the dashboard numbers are wrong" incidents trace back to a grain mistake or a join that silently changed the grain.</li>
        <li><strong>Rule of thumb:</strong> model at the most atomic grain the source allows, because you can always aggregate up but you can never recover detail you did not keep.</li>
      </ol>`,
      answer: `<p>A fact table records the measurements of a business process: one row per event, holding numeric measures plus foreign keys to dimensions. It is long and narrow and grows continuously, for example one row per UPI transaction. A dimension table holds the descriptive context you slice by, such as customer, product, city or date. Dimensions are wide, relatively small and change slowly.</p>
      <p>The grain is the precise statement of what a single fact row represents, such as "one row per loan instalment due" or "one row per payment attempt". It is the first decision because everything else follows from it: the primary key, which dimensions can legitimately join, and which measures are additive across which dimensions.</p>
      <p>Getting it wrong is the most common cause of wrong numbers. If a table mixes loan-level and instalment-level rows, every SUM double counts, and a join that quietly changes the grain has the same effect. So I state the grain in one sentence before writing any DDL, and I model at the most atomic grain the source supports, since aggregates can always be derived later while lost detail cannot be recovered.</p>`
    },
    {
      id: 'dd-e3',
      difficulty: 'easy',
      prompt: 'Compare <strong>star and snowflake schemas</strong>. Which would you choose for an analytics warehouse and why?',
      hint: 'The difference is whether dimensions are normalised, and it trades joins against redundancy.',
      concepts: [
        { label: 'Star has a central fact table joined to denormalised dimensions', any: ['star', 'central fact', 'denormal', 'single level', 'one join'], required: true },
        { label: 'Snowflake normalises dimensions into sub-dimension tables', any: ['snowflake', 'normalis', 'normaliz', 'sub dimension', 'hierarch', 'multiple table'], required: true },
        { label: 'Star means fewer joins, simpler queries and better read performance', any: ['fewer join', 'simpler', 'faster', 'performance', 'easier to query'], required: true },
        { label: 'Snowflake reduces redundancy and storage but adds join complexity', any: ['redundan', 'storage', 'complex', 'more join', 'duplication'], required: true },
        { label: 'Star is standard for BI because storage is cheap and clarity matters', any: ['standard', 'prefer', 'bi tool', 'cheap', 'recommend', 'usually'], required: true },
        { label: 'Very large or volatile hierarchies can justify snowflaking', any: ['large dimension', 'hierarch', 'volatile', 'changes often', 'exception', 'sometimes'] },
        { label: 'BI tools and semantic layers assume a star-like model', any: ['bi tool', 'power bi', 'tableau', 'semantic', 'model expects'] }
      ],
      approach: `<p>Describe both shapes, state the trade-off in one line, then commit to a recommendation with the exception.</p>
      <ol>
        <li><strong>Star:</strong> one fact table surrounded by flat dimensions, each one join away. A city column lives directly on the customer dimension.</li>
        <li><strong>Snowflake:</strong> dimensions are normalised into hierarchies, so customer points to city, which points to state, which points to country, each its own table.</li>
        <li><strong>The trade-off:</strong> star duplicates descriptive text for simpler, faster reads; snowflake removes duplication at the cost of more joins and more complexity for every consumer.</li>
        <li><strong>Recommendation:</strong> star, for an analytics warehouse. Storage is the cheapest thing in the stack, columnar compression handles repeated strings extremely well, and analyst time and query clarity are expensive. Fewer joins also mean fewer chances to get a join wrong.</li>
        <li><strong>The exception:</strong> a genuinely huge dimension, or a hierarchy that changes often and is maintained by another team, can justify snowflaking that branch. Product hierarchies in retail are the classic case.</li>
        <li><strong>Practical point:</strong> BI tools and semantic layers are built assuming a star, so snowflaking usually means fighting the tool. Many teams snowflake in the raw layer and present a star to consumers, which is the best of both.</li>
      </ol>`,
      answer: `<p>In a star schema a central fact table joins directly to flat, denormalised dimension tables, so every attribute is one join away. In a snowflake schema those dimensions are normalised into hierarchies of sub-dimension tables, so customer points to city, city to state, and so on.</p>
      <p>The trade-off is redundancy against joins. Star duplicates descriptive values but keeps queries short and fast; snowflake eliminates that duplication at the cost of more joins and more complexity for everyone who queries it. For an analytics warehouse I would choose star as the default. Storage is cheap, columnar compression handles repeated strings very efficiently, and the real costs are analyst time and query mistakes, both of which rise with join count. BI tools and semantic layers also assume a star-shaped model, so snowflaking tends to mean working against the tool.</p>
      <p>The exception is a very large dimension, or a hierarchy that changes frequently and is owned elsewhere, where normalising that one branch avoids repeated wide updates. A common compromise is to keep normalised structures in the raw or staging layer and expose a star to consumers, which gives maintainability upstream and simplicity downstream.</p>`
    },
    {
      id: 'dd-e4',
      difficulty: 'easy',
      prompt: 'Explain <strong>normalisation</strong> up to third normal form, and why analytics deliberately <strong>denormalises</strong>.',
      hint: 'Normalisation optimises for correct writes; analytics optimises for cheap reads.',
      concepts: [
        { label: 'First normal form: atomic values, no repeating groups', any: ['1nf', 'first normal', 'atomic', 'repeating group', 'single value'], required: true },
        { label: 'Second normal form: no partial dependency on part of a composite key', any: ['2nf', 'second normal', 'partial depend', 'composite key', 'whole key'], required: true },
        { label: 'Third normal form: no transitive dependency between non-key columns', any: ['3nf', 'third normal', 'transitive', 'non key', 'depends on another column'], required: true },
        { label: 'Normalisation removes redundancy and update anomalies', any: ['redundan', 'anomal', 'update in one place', 'consistency', 'duplication'], required: true },
        { label: 'Denormalisation reduces joins to make analytical reads faster and simpler', any: ['fewer join', 'faster read', 'simpler', 'performance', 'query speed'], required: true },
        { label: 'Analytics data is append-only history, so update anomalies matter less', any: ['append', 'immutable', 'history', 'rarely updated', 'read heavy', 'no updates'], required: true },
        { label: 'Denormalisation costs storage and requires pipeline discipline to stay consistent', any: ['storage', 'consisten', 'pipeline', 'rebuild', 'cost', 'discipline'] }
      ],
      approach: `<p>Define the three forms crisply with one example each, then explain why the warehouse breaks the rules on purpose.</p>
      <ol>
        <li><strong>1NF:</strong> every column holds a single atomic value. A column containing "loan1, loan2" or a repeating group of phone1, phone2, phone3 violates it.</li>
        <li><strong>2NF:</strong> in 1NF, and no non-key column depends on only part of a composite key. In a table keyed by (loan_id, instalment_no), storing customer_name violates it, since the name depends only on the loan.</li>
        <li><strong>3NF:</strong> in 2NF, and no non-key column depends on another non-key column. Storing city and city_state together violates it, because state is determined by city rather than by the key.</li>
        <li><strong>Purpose:</strong> each fact lives in exactly one place, so an update cannot leave contradictory copies. That is essential when an application is writing constantly.</li>
        <li><strong>Why analytics denormalises:</strong> warehouse data is mostly append-only history that is written once and read thousands of times, so update anomalies barely arise, while every join costs time and adds a chance of error. Flattening attributes onto a dimension, or pre-joining a wide reporting table, makes queries shorter and faster.</li>
        <li><strong>The honest cost:</strong> more storage, and consistency now depends on the pipeline rebuilding derived tables correctly rather than on the schema enforcing it, so you replace database constraints with tests and reconciliation.</li>
      </ol>`,
      answer: `<p>First normal form requires atomic values with no repeating groups, so no comma-separated lists or phone1, phone2, phone3 columns. Second normal form additionally forbids partial dependencies on part of a composite key: in a table keyed by loan and instalment number, the customer name belongs elsewhere because it depends only on the loan. Third normal form additionally forbids transitive dependencies between non-key columns, so if state is determined by city rather than by the key, it belongs in a city table. The purpose is that every fact is stored once, so updates cannot create contradictory copies.</p>
      <p>Analytics denormalises deliberately because its workload is the opposite. Warehouse tables are largely append-only history, written once and read constantly, so the update anomalies that normalisation prevents rarely occur. Meanwhile every join costs compute and creates an opportunity to get the grain wrong. Flattening descriptive attributes onto dimensions, or materialising a wide pre-joined table, makes queries simpler for analysts and cheaper for the engine, and columnar compression absorbs most of the storage penalty.</p>
      <p>The cost is real though: more storage, and consistency now depends on pipelines rebuilding derived tables correctly rather than on the schema enforcing it. That is why a denormalised warehouse needs automated tests, reconciliation and clear ownership in place of the constraints you gave up.</p>`
    },
    {
      id: 'dd-e5',
      difficulty: 'easy',
      prompt: 'Distinguish <strong>natural, surrogate, primary and foreign keys</strong>. Why do warehouse dimensions usually get a surrogate key?',
      hint: 'Business identifiers change and get reused; a warehouse needs something that never does.',
      concepts: [
        { label: 'Natural or business key comes from the real world', any: ['natural', 'business key', 'real world', 'pan', 'email', 'account number', 'source system'], required: true },
        { label: 'Surrogate key is a meaningless generated identifier', any: ['surrogate', 'generated', 'meaningless', 'sequence', 'identity', 'no business meaning'], required: true },
        { label: 'Primary key uniquely identifies a row', any: ['primary key', 'unique', 'identifies a row'], required: true },
        { label: 'Foreign key references the primary key of another table', any: ['foreign key', 'reference', 'points to', 'relationship'], required: true },
        { label: 'Surrogate keys let a dimension hold multiple historical versions of one entity', any: ['multiple version', 'history', 'scd', 'type 2', 'more than one row', 'version'], required: true },
        { label: 'They insulate the warehouse from source system changes, reuse or reformatting', any: ['insulat', 'source change', 'reuse', 'reformat', 'decouple', 'independen'], required: true },
        { label: 'Integer surrogate keys join faster and store smaller than long natural keys', any: ['integer', 'faster join', 'smaller', 'performance', 'narrow', 'compact'] },
        { label: 'Keep the natural key on the dimension for traceability and reconciliation', any: ['keep the natural', 'retain', 'traceab', 'reconcil', 'still store', 'lineage'] }
      ],
      approach: `<p>Define the four terms in one line each, then make the case for surrogate keys with the slowly-changing-dimension argument, which is the real reason.</p>
      <ol>
        <li><strong>Natural key:</strong> an identifier that exists in the business, such as a PAN, a loan account number or an email address.</li>
        <li><strong>Surrogate key:</strong> a generated integer or hash with no business meaning, owned entirely by the warehouse.</li>
        <li><strong>Primary key:</strong> the column or columns that uniquely identify a row in a table. <strong>Foreign key:</strong> a column referencing another table primary key.</li>
        <li><strong>The main reason for surrogates:</strong> a dimension that tracks history needs several rows for the same real-world entity, one per version. The natural key repeats across those rows, so it cannot be the primary key. The surrogate key identifies the version, which is what makes Type 2 history possible at all.</li>
        <li><strong>Insulation:</strong> source systems change. Identifiers get reformatted, reissued after closure, or the company migrates to a new core system. A surrogate key means those upheavals do not ripple into every fact table.</li>
        <li><strong>Performance:</strong> a four or eight byte integer joins faster and compresses better than a long composite or string key repeated across a billion fact rows.</li>
        <li><strong>Always keep the natural key</strong> as an attribute on the dimension, so rows can be traced back to the source and reconciled against it.</li>
      </ol>`,
      answer: `<p>A natural or business key is an identifier that exists in the real world, such as a loan account number or PAN. A surrogate key is a meaningless value generated by the warehouse, typically an integer sequence or hash. A primary key is whatever uniquely identifies a row in a table, and a foreign key is a column in one table that references another table primary key.</p>
      <p>Warehouse dimensions get surrogate keys mainly because dimensions must hold history. If a customer risk band changes, a Type 2 dimension keeps both the old and new versions as separate rows, so the natural key appears more than once and cannot serve as the primary key. The surrogate key identifies a specific version of the entity, and the fact row stores the surrogate that was current when the event happened, which is what lets you reproduce the world as it looked at that moment.</p>
      <p>Two supporting reasons: surrogate keys insulate the warehouse from source system changes such as reformatted, reissued or migrated identifiers, so those changes do not ripple into every fact table; and a narrow integer key joins faster and compresses better than a long string or composite key repeated across billions of fact rows. I would still keep the natural key as an attribute on the dimension so every row can be traced back to its source and reconciled.</p>`
    },

    /* --------------------------- MEDIUM --------------------------- */
    {
      id: 'dd-m1',
      difficulty: 'medium',
      prompt: 'Explain <strong>slowly changing dimensions</strong>, types 1, 2 and 3. How would you implement Type 2 for a customer dimension where the risk band changes over time?',
      hint: 'Type 2 is about being able to answer "what was true at the time", not "what is true now".',
      concepts: [
        { label: 'Type 1 overwrites the old value, keeping no history', any: ['type 1', 'overwrite', 'no history', 'replace', 'update in place'], required: true },
        { label: 'Type 2 adds a new row per change, preserving full history', any: ['type 2', 'new row', 'history', 'version', 'insert'], required: true },
        { label: 'Type 3 adds a column for the previous value only', any: ['type 3', 'new column', 'previous value', 'prior', 'one change'], required: true },
        { label: 'Type 2 needs validity dates and a current-record flag', any: ['valid from', 'valid_to', 'effective', 'start date', 'end date', 'is_current', 'current flag'], required: true },
        { label: 'The surrogate key identifies the version, the natural key identifies the entity', any: ['surrogate', 'natural key', 'version key', 'business key'], required: true },
        { label: 'Facts store the surrogate key current at event time so history is reproducible', any: ['at the time', 'event time', 'point in time', 'as of', 'stores the surrogate', 'reproduc'], required: true },
        { label: 'Choose per attribute based on whether history changes a decision', any: ['per attribute', 'depends', 'which attribute', 'decision', 'need history', 'business question'], required: true },
        { label: 'Type 2 grows the dimension, so avoid it on rapidly changing attributes', any: ['grow', 'explod', 'rapidly changing', 'size', 'volume', 'mini dimension'] }
      ],
      approach: `<p>Define the three types, then implement Type 2 concretely, then close on the design judgement of when to use which.</p>
      <ol>
        <li><strong>Type 1:</strong> overwrite. Simple, and correct for genuine corrections such as a misspelled name, but history is destroyed.</li>
        <li><strong>Type 2:</strong> insert a new row for the changed version and close the old one. Full history, at the cost of a larger dimension and slightly harder queries.</li>
        <li><strong>Type 3:</strong> add a "previous value" column. Cheap, but only remembers one change, so it is a niche solution.</li>
        <li><strong>Implementing Type 2</strong> for risk band: the dimension gets customer_sk as surrogate primary key, customer_id as natural key, the attributes, plus valid_from, valid_to and is_current. On a change, close the existing row by setting valid_to to the change timestamp and is_current to false, then insert a new row with a fresh surrogate key, valid_from at the change time, valid_to as null or a far-future date, and is_current true.</li>
        <li><strong>The critical part:</strong> fact rows store the surrogate key that was current when the event occurred. So a loan disbursed in March permanently points at the March version of the customer, and you can answer "what risk band did we approve this against" a year later. If facts stored the natural key instead, every historical report would silently be recomputed against today attributes.</li>
        <li><strong>Judgement:</strong> choose per attribute rather than per table. Risk band, credit limit and city drive decisions, so they warrant Type 2. Correcting a typo in a name is Type 1. An attribute that changes daily would explode the dimension, so it belongs in a fact table or a mini-dimension instead.</li>
      </ol>`,
      answer: `<p>Type 1 overwrites the old value and keeps no history, which is right for correcting errors. Type 2 inserts a new row for each change so the full history is preserved. Type 3 adds a column holding the previous value, which remembers only one change and is rarely worth it.</p>
      <p>For a customer dimension tracking risk band I would implement Type 2 with a surrogate primary key, the natural customer id, the descriptive attributes, and three control columns: valid_from, valid_to and is_current. When the risk band changes, the pipeline closes the existing row by setting its valid_to to the change timestamp and is_current to false, then inserts a new row with a new surrogate key, valid_from set to the change time, valid_to null or a far-future sentinel, and is_current true. Current-state queries filter on is_current, and historical queries filter where the event timestamp falls between valid_from and valid_to.</p>
      <p>The part that makes it work is that fact rows carry the surrogate key that was current at event time. A loan disbursed in March keeps pointing at the March version of that customer, so a year later you can still say which risk band the approval was actually made against. If the fact stored only the natural key, every historical report would be silently recomputed against today attributes, which is the exact failure Type 2 exists to prevent.</p>
      <p>I would make the choice attribute by attribute rather than for the whole table: history matters for risk band, credit limit and location because decisions depend on them, while a corrected spelling is Type 1. An attribute that changes very frequently would explode the dimension row count, so it belongs in a fact table or a separate mini-dimension.</p>`
    },
    {
      id: 'dd-m2',
      difficulty: 'medium',
      prompt: 'Describe the three types of fact table: <strong>transaction, periodic snapshot and accumulating snapshot</strong>. Give a lending example of each and say which measures are additive.',
      hint: 'Some measures can be summed across every dimension, some only across some of them, and some never.',
      concepts: [
        { label: 'Transaction fact: one row per event, at the atomic grain', any: ['transaction fact', 'one row per event', 'atomic', 'per transaction', 'append'], required: true },
        { label: 'Periodic snapshot: one row per entity per period, capturing state', any: ['periodic', 'snapshot', 'per day', 'per month', 'balance', 'state at'], required: true },
        { label: 'Accumulating snapshot: one row per process instance, updated as it progresses', any: ['accumulating', 'milestone', 'updated', 'pipeline', 'process', 'one row per loan', 'lifecycle'], required: true },
        { label: 'Fully additive measures can be summed across all dimensions', any: ['additive', 'sum across', 'fully additive', 'can be summed'], required: true },
        { label: 'Semi-additive measures such as balances cannot be summed over time', any: ['semi additive', 'balance', 'cannot sum over time', 'not over time', 'point in time'], required: true },
        { label: 'Non-additive measures such as ratios must be recomputed from components', any: ['non additive', 'ratio', 'percentage', 'rate', 'recompute', 'average of averages'], required: true },
        { label: 'Snapshots answer state questions that transaction facts answer only expensively', any: ['state', 'expensive', 'replay', 'as of', 'easier', 'balance at'], required: true }
      ],
      approach: `<p>Name each type with a lending example, then handle additivity, which is the follow-up question that catches people out.</p>
      <ol>
        <li><strong>Transaction fact:</strong> one row per event at the finest grain. Example: one row per repayment received, or per UPI transaction. Append-only and immutable.</li>
        <li><strong>Periodic snapshot:</strong> one row per entity per period, recording state. Example: daily loan outstanding balance per loan, or month-end portfolio position. Rows are predictable in number and ideal for balance and trend reporting.</li>
        <li><strong>Accumulating snapshot:</strong> one row per instance of a process with several milestones, updated in place as it advances. Example: one row per loan application holding applied_at, kyc_completed_at, approved_at, disbursed_at, first_emi_at, plus durations between them. Perfect for funnel and turnaround analysis.</li>
        <li><strong>Fully additive:</strong> repayment amount, disbursed amount, transaction value. Sum them across customer, city, product and time freely.</li>
        <li><strong>Semi-additive:</strong> balances and outstanding principal. Summing across customers on a given day is meaningful; summing the same loan balance across 30 days is nonsense. Use an average or a period-end value over time instead. This is the classic reason a snapshot fact needs care.</li>
        <li><strong>Non-additive:</strong> rates and ratios such as default rate or approval rate. Never average an average; store the numerator and denominator and recompute the ratio at whatever level is being viewed.</li>
        <li><strong>Why snapshots exist:</strong> deriving yesterday balance for every loan by replaying every transaction since origination is expensive and error prone, so you materialise it daily. Snapshots trade storage for query simplicity and speed.</li>
      </ol>`,
      answer: `<p>A <strong>transaction fact</strong> has one row per event at the atomic grain, such as one row per repayment received or per UPI transaction; it is append-only. A <strong>periodic snapshot</strong> has one row per entity per period recording state, such as daily outstanding balance per loan or a month-end portfolio position. An <strong>accumulating snapshot</strong> has one row per process instance, updated as milestones complete: one row per loan application carrying applied, KYC completed, approved, disbursed and first EMI timestamps, along with the durations between them, which makes funnel and turnaround analysis trivial.</p>
      <p>On additivity, repayment and disbursal amounts are fully additive and can be summed across every dimension including time. Balances are semi-additive: summing outstanding balance across loans on a single day is meaningful, but summing one loan balance across thirty days is meaningless, so over time you take a period-end or average value. Ratios such as default rate or approval rate are non-additive; averaging them across segments gives the wrong answer, so the fact should store the numerator and denominator and the ratio should be computed at whatever grain is being displayed.</p>
      <p>Snapshots exist because reconstructing state from transactions is expensive and fragile. Replaying every payment since origination to get yesterday balance for every live loan is a heavy query, so materialising it daily trades cheap storage for fast, simple and consistent reporting.</p>`
    },
    {
      id: 'dd-m3',
      difficulty: 'medium',
      prompt: 'Design the warehouse model for a <strong>personal loan lifecycle</strong>, from application to closure. Name your tables, state each grain, and say how you would support both funnel and repayment analysis.',
      hint: 'Two different questions need two different fact tables, sharing dimensions.',
      concepts: [
        { label: 'Separate fact tables for the application funnel and for repayments', any: ['separate fact', 'two fact', 'application fact', 'repayment fact', 'different grain'], required: true },
        { label: 'State the grain of each fact table explicitly', any: ['grain', 'one row per', 'level of detail'], required: true },
        { label: 'Accumulating snapshot for the application funnel with milestone timestamps', any: ['accumulating', 'milestone', 'timestamp', 'applied', 'approved', 'disbursed', 'funnel'], required: true },
        { label: 'Transaction fact for repayments plus a daily loan snapshot for balances', any: ['repayment', 'transaction fact', 'snapshot', 'balance', 'daily', 'outstanding'], required: true },
        { label: 'Shared conformed dimensions: customer, date, product, channel, branch or city', any: ['dimension', 'customer', 'date', 'product', 'channel', 'conform'], required: true },
        { label: 'Type 2 customer dimension so decisions can be reproduced as at approval time', any: ['type 2', 'scd', 'as at', 'point in time', 'history', 'at approval'], required: true },
        { label: 'Model the instalment schedule to detect missed instalments', any: ['schedule', 'instalment', 'installment', 'emi', 'due date', 'expected'], required: true },
        { label: 'Cohort or vintage attributes on the loan to support risk curves', any: ['vintage', 'cohort', 'disbursal month', 'months on book', 'mob'], required: true },
        { label: 'Not every application becomes a loan, so keys must allow the funnel drop-off', any: ['not every', 'reject', 'drop off', 'no loan', 'null', 'unmatched'] }
      ],
      approach: `<p>Interviewers want to see you split by business process rather than build one giant table. Two processes, two facts, shared dimensions.</p>
      <ol>
        <li><strong>fct_loan_application</strong> — accumulating snapshot, grain: one row per application. Columns: application id, customer key, product key, channel key, decision outcome, and timestamps for applied, KYC done, bureau pulled, decisioned, approved, disbursed, plus derived durations. This answers every funnel and turnaround question in one scan.</li>
        <li><strong>dim_loan</strong> — one row per disbursed loan, with terms: principal, rate, tenure, disbursal date, and importantly the vintage attributes such as disbursal month, so risk curves by cohort are a simple group by.</li>
        <li><strong>fct_instalment_schedule</strong> — grain: one row per loan per scheduled instalment, with due date and expected amount. This is what makes missed instalments detectable, since a missing payment leaves an unmatched schedule row rather than no row at all.</li>
        <li><strong>fct_repayment</strong> — transaction fact, grain: one row per payment received, with amount, method, and the instalment it settles. Fully additive.</li>
        <li><strong>fct_loan_daily_snapshot</strong> — periodic snapshot, grain: one row per loan per day, with outstanding principal, days past due and delinquency bucket. This makes portfolio and DPD reporting cheap instead of requiring a replay of all payments.</li>
        <li><strong>Dimensions:</strong> dim_customer as Type 2 so an approval can be reproduced against the attributes that were true at decision time; plus dim_date, dim_product, dim_channel and dim_geography, conformed so both fact tables can be sliced identically.</li>
        <li><strong>Two design points to voice:</strong> most applications never become loans, so the application fact must stand alone with a nullable loan key rather than being buried inside a loan table; and separating repayment transactions from the daily snapshot is deliberate, because one answers "what was paid" and the other answers "what was owed", which are different grains and must not be mixed.</li>
      </ol>`,
      answer: `<p>I would model two business processes separately and share dimensions between them.</p>
      <p><strong>Funnel side.</strong> <code>fct_loan_application</code> as an accumulating snapshot, one row per application, holding the customer, product and channel keys, the decision outcome, and milestone timestamps for applied, KYC complete, bureau pull, decision, approval and disbursal, plus the durations between them. Because most applications never become loans, this table stands on its own with a nullable loan key, which is what lets you measure rejection and drop-off honestly.</p>
      <p><strong>Servicing side.</strong> <code>dim_loan</code> with one row per disbursed loan carrying principal, rate, tenure, disbursal date and vintage attributes such as disbursal month. <code>fct_instalment_schedule</code> at one row per loan per scheduled instalment with due date and expected amount, which is essential because a missed payment must appear as an unmatched schedule row rather than as no row at all. <code>fct_repayment</code> as a transaction fact, one row per payment received, fully additive. And <code>fct_loan_daily_snapshot</code> as a periodic snapshot, one row per loan per day with outstanding principal, days past due and delinquency bucket, so portfolio and DPD reporting does not require replaying every payment since origination.</p>
      <p><strong>Dimensions</strong> are conformed across both facts: <code>dim_customer</code> as Type 2 so a decision can be reproduced against the attributes true at approval time, plus date, product, channel and geography. That combination supports funnel analysis from the application fact, repayment behaviour from the transaction fact, balance and delinquency reporting from the snapshot, and vintage risk curves by grouping the snapshot on disbursal cohort and months on book. Keeping repayments and the daily snapshot separate is deliberate, since one records what was paid and the other what was owed, and mixing those grains is how double counting starts.</p>`
    },
    {
      id: 'dd-m4',
      difficulty: 'medium',
      prompt: 'How do you model a <strong>many-to-many relationship</strong> in a dimensional model, and how do you prevent the <strong>fan-out double counting</strong> it causes?',
      hint: 'A bridge table solves the modelling problem and creates the arithmetic problem.',
      concepts: [
        { label: 'Use a bridge or junction table between the two entities', any: ['bridge', 'junction', 'link table', 'associat', 'mapping table'], required: true },
        { label: 'Joining through the bridge multiplies fact rows, inflating sums', any: ['multipl', 'fan out', 'fanout', 'inflate', 'double count', 'duplicate rows'], required: true },
        { label: 'Detect it by comparing row counts or totals before and after the join', any: ['row count', 'before and after', 'compare', 'check the total', 'detect'], required: true },
        { label: 'Aggregate to the correct grain before joining', any: ['aggregate first', 'before joining', 'pre aggregate', 'cte', 'collapse'], required: true },
        { label: 'Or use an allocation factor so weights sum to one', any: ['allocation', 'weight', 'factor', 'apportion', 'split', 'sums to 1'], required: true },
        { label: 'Or use COUNT DISTINCT and distinct-aware measures', any: ['count distinct', 'distinct', 'sum distinct', 'de duplicat'], required: true },
        { label: 'Document whether the measure is allowed to be sliced by that dimension', any: ['document', 'not allowed', 'cannot slice', 'semantic', 'guard', 'label'], required: true }
      ],
      approach: `<p>Give the modelling answer, then the arithmetic trap, then the three ways out. The trap is the real content.</p>
      <ol>
        <li><strong>The model:</strong> a bridge table at the grain of the relationship. A customer holding several products, or a loan with multiple co-applicants, becomes a bridge with one row per pairing, keyed by both foreign keys.</li>
        <li><strong>The trap:</strong> joining a fact through that bridge multiplies rows. A loan of 100,000 with two co-applicants becomes two rows of 100,000, and portfolio value doubles. Nothing errors; the report is simply wrong.</li>
        <li><strong>Detect it:</strong> compare fact row count and the sum of a known measure before and after the join. If either changes, the join altered the grain. I make this a habit on every many-to-many join.</li>
        <li><strong>Fix one, aggregate first:</strong> collapse the fact to the required grain in a CTE, then join. Best when you do not actually need per-member detail.</li>
        <li><strong>Fix two, allocation factors:</strong> store a weight on the bridge that sums to one per fact, so the two co-applicants carry 0.5 each. Sums then stay correct at any slice, at the cost of agreeing a business rule for the split.</li>
        <li><strong>Fix three, distinct-aware measures:</strong> use COUNT DISTINCT on the fact key, or in a semantic layer define the measure so it deduplicates. This is how tools handle it, and it works for counts more naturally than for sums.</li>
        <li><strong>Then document it.</strong> Some measures should simply never be sliced by the many-to-many dimension, and saying so in the semantic layer or data dictionary prevents a plausible-looking but wrong query.</li>
      </ol>`,
      answer: `<p>The modelling answer is a bridge or junction table at the grain of the relationship itself: one row per pairing, holding the foreign keys of both entities and any attributes of the relationship. A loan with several co-applicants, or a customer holding several products, is modelled that way rather than by stuffing repeated columns onto either side.</p>
      <p>The problem it creates is fan-out. Joining a fact table through the bridge multiplies fact rows by the number of matches, so a loan of one lakh with two co-applicants becomes two rows of one lakh and the portfolio total doubles. No error is raised, which is what makes it dangerous. I detect it by comparing the fact row count and the sum of a known measure before and after the join; if either changes, the grain changed.</p>
      <p>There are three ways out. Aggregate the fact to the required grain in a CTE before joining, which is cleanest when per-member detail is not needed. Or put an allocation factor on the bridge that sums to one per fact row, so two co-applicants each carry a weight of 0.5 and sums remain correct at every slice, provided the business agrees the split rule. Or use distinct-aware measures, counting distinct fact keys or defining the measure in the semantic layer so it deduplicates.</p>
      <p>Finally I would document which measures may not be sliced by that dimension at all. Some questions genuinely have no additive answer across a many-to-many relationship, and stating that in the semantic layer stops someone writing a query that looks reasonable and returns a number that is quietly double.</p>`
    },
    {
      id: 'dd-m5',
      difficulty: 'medium',
      prompt: 'A super app has lending, payments, insurance and investments, each with its own team and tables. Explain <strong>conformed dimensions</strong> and how you would build a single customer view across products.',
      hint: 'The hard part is not the join, it is agreeing what "customer" and "active" mean across four teams.',
      concepts: [
        { label: 'A conformed dimension is shared with identical meaning across fact tables', any: ['conform', 'shared', 'same meaning', 'consistent', 'reused across'], required: true },
        { label: 'It enables drill-across: comparing metrics from different processes by the same dimension', any: ['drill across', 'compare', 'across product', 'same dimension', 'side by side'], required: true },
        { label: 'Requires a single customer identity resolved across systems', any: ['identity', 'single id', 'master', 'resolution', 'match', 'mdm', 'one customer id'], required: true },
        { label: 'Identity resolution is hard: different identifiers, duplicates, no shared key', any: ['duplicat', 'different id', 'fuzzy', 'phone', 'pan', 'email', 'no common key'], required: true },
        { label: 'Definitions must be agreed and governed, not just technically joined', any: ['definition', 'agree', 'governance', 'dictionary', 'contract', 'stakeholder', 'ownership'], required: true },
        { label: 'Facts stay at their own grain; do not merge them into one table', any: ['own grain', 'separate fact', 'do not merge', 'keep separate', 'per process'], required: true },
        { label: 'Compare across facts by aggregating each to the shared dimension first', any: ['aggregate each', 'to the same grain', 'then join', 'separately', 'union', 'conform first'], required: true },
        { label: 'Consent and data sharing rules may restrict cross-product joins', any: ['consent', 'regulat', 'complian', 'privacy', 'permission', 'restrict', 'legal'] }
      ],
      approach: `<p>Define conformed dimensions, then spend most of the answer on the two hard parts: identity and definitions. The technical join is the easy bit.</p>
      <ol>
        <li><strong>Definition:</strong> a conformed dimension is one shared dimension used by multiple fact tables with identical keys and meaning. One dim_customer, one dim_date, one dim_geography, used by lending, payments, insurance and investments alike.</li>
        <li><strong>Why it matters:</strong> it enables drill-across, meaning you can put lending revenue next to payment volume for the same customer segment and trust the comparison. Without it, every cross-product question becomes a bespoke reconciliation.</li>
        <li><strong>Hard part one, identity.</strong> Each product may key on its own identifier: a loan account, a UPI handle, a policy number, a folio. You need a master customer id resolved across them, ideally issued centrally at signup, otherwise inferred from strong identifiers such as PAN or verified phone, with a documented matching hierarchy and a plan for duplicates and for one person appearing as two customers.</li>
        <li><strong>Hard part two, definitions.</strong> "Active customer" means a transaction in 30 days to payments, a live loan to lending, and an in-force policy to insurance. A single customer view is worthless until those are reconciled into either one agreed definition or clearly named product-specific ones. This is governance work, not modelling work, and it is where these projects actually fail.</li>
        <li><strong>Keep facts separate.</strong> Do not merge four processes into one table. Each keeps its own grain and joins to the conformed dimension; cross-product questions are answered by aggregating each fact to the customer or segment level first and then combining, which avoids fan-out entirely.</li>
        <li><strong>Then add the guardrails:</strong> a data dictionary with owners per definition, a certified single source of truth, and checks that the customer counts in each product reconcile to the master dimension. Also confirm consent and regulatory rules permit the cross-product join, since in financial services that is not automatic.</li>
      </ol>`,
      answer: `<p>A conformed dimension is a dimension shared by several fact tables with exactly the same keys and meaning, so lending, payments, insurance and investments all join to one <code>dim_customer</code>, one <code>dim_date</code> and one <code>dim_geography</code>. That is what makes drill-across possible: you can show lending revenue beside payment volume for the same segment and trust that the segment means the same thing on both sides.</p>
      <p>Two things make it hard, and neither is the join. First, identity: each product tends to key on its own identifier, whether a loan account, UPI handle, policy number or folio, so you need a master customer id, ideally issued centrally at signup and otherwise resolved from strong identifiers such as PAN or a verified phone number, with an explicit matching hierarchy and a documented approach to duplicates. Second, definitions: active means a recent transaction to payments, a live loan to lending, and an in-force policy to insurance, so a single customer view means nothing until those are reconciled into one agreed definition or clearly separated named ones. That is governance work with named owners, and it is where these initiatives usually stall.</p>
      <p>Structurally I would keep each fact table at its own grain rather than merging products into one table, and answer cross-product questions by aggregating each fact to the customer or segment level first and then combining, which sidesteps fan-out. Around it I would put a data dictionary with an owner per definition, a certified customer dimension as the single source of truth, and reconciliation checks that each product customer count ties back to the master. I would also confirm that consent and regulatory rules actually permit joining data across products, since in financial services cross-use of customer data is constrained regardless of technical feasibility.</p>`
    },

    /* ---------------------------- HARD ---------------------------- */
    {
      id: 'dd-h1',
      difficulty: 'hard',
      prompt: 'A risk model is trained on a table joining loans to customer attributes. Explain <strong>point-in-time correctness</strong>, why a naive join leaks, and how you would design the tables to make leakage impossible.',
      hint: 'If you join to current attributes, you are telling the model things that had not happened yet.',
      concepts: [
        { label: 'Point-in-time correct means using only values knowable at the decision moment', any: ['point in time', 'as of', 'at the time', 'knowable', 'available then', 'decision time'], required: true },
        { label: 'Joining to current attributes leaks future information into training', any: ['leak', 'future', 'current value', 'after the fact', 'hindsight', 'target leakage'], required: true },
        { label: 'Leakage inflates offline accuracy and collapses in production', any: ['inflat', 'optimistic', 'too good', 'production', 'degrade', 'does not generalis', 'overstate'], required: true },
        { label: 'Use Type 2 history with validity ranges and join on the event timestamp', any: ['type 2', 'valid_from', 'valid_to', 'effective date', 'as of join', 'between'], required: true },
        { label: 'Store the feature values used at decision time immutably in a snapshot', any: ['snapshot', 'store the feature', 'immutable', 'feature store', 'record what', 'freeze'], required: true },
        { label: 'Beware attributes updated by the outcome itself, such as risk flags set after default', any: ['updated by', 'consequence', 'after default', 'derived from the outcome', 'circular', 'flag set'], required: true },
        { label: 'Respect data availability lag: a value existed but was not yet loaded', any: ['lag', 'availab', 'arrived later', 'latency', 'not yet loaded', 'delay'], required: true },
        { label: 'Validate by reproducing a historical decision exactly', any: ['reproduc', 'replay', 'backtest', 'audit', 'recreate', 'verify'], required: true }
      ],
      approach: `<p>This is the most senior question in data design for a lending company. Define it, show the leak, then design it away rather than relying on discipline.</p>
      <ol>
        <li><strong>Definition:</strong> a point-in-time correct dataset contains, for each training row, only the values that were actually knowable at the moment of the decision being modelled.</li>
        <li><strong>The naive leak:</strong> joining <code>loans</code> to <code>dim_customer</code> on customer id picks up today attributes. If that dimension now says risk_band = 'high' or has a delinquency flag set <em>because</em> the loan defaulted, the model is being handed the answer. Offline AUC looks superb and production performance collapses.</li>
        <li><strong>The structural fix:</strong> keep customer attributes as Type 2 history with valid_from and valid_to, then join on the decision timestamp: <code>ON c.customer_id = l.customer_id AND l.decision_ts &gt;= c.valid_from AND l.decision_ts &lt; c.valid_to</code>. That is an as-of join and it makes hindsight impossible by construction.</li>
        <li><strong>The stronger fix:</strong> at decision time, write the exact feature vector used into an immutable decision snapshot table keyed by application. Then training reads what the model actually saw, with no reconstruction and no argument. This is what a feature store gives you, and it also makes decisions auditable for regulators.</li>
        <li><strong>The subtle traps.</strong> First, attributes mutated by the outcome, such as a collections flag or a recovery status, are pure leakage and must be excluded by review, not just by timestamps. Second, availability lag: a bureau score dated the first of the month may not have landed in the warehouse until the fifth, so a timestamp-correct join can still use data that was not actually available. Model on ingestion time as well as event time where that gap matters.</li>
        <li><strong>Validate empirically:</strong> pick historical applications and reproduce the decision exactly from the warehouse. If you cannot regenerate the same inputs, the design is not point-in-time correct yet. A feature whose importance is suspiciously dominant is usually leakage rather than insight.</li>
      </ol>`,
      answer: `<p>Point-in-time correctness means every row of the training set contains only values that were genuinely knowable at the moment of the decision being modelled. The naive join breaks this: joining loans to the customer dimension on customer id alone attaches today attributes to a decision made a year ago, so if the risk band or a delinquency flag was updated because that loan later went bad, the model is being told the outcome. Offline accuracy looks excellent and production performance collapses, which is the signature of target leakage.</p>
      <p>The structural fix is to hold customer attributes as Type 2 history with valid_from and valid_to and perform an as-of join on the decision timestamp, so each loan sees the version of the customer that was current when it was decided. The stronger fix is to stop reconstructing history altogether: at decision time, write the exact feature vector the model consumed into an immutable snapshot keyed by application id. Training then reads what actually happened rather than a best-effort recreation, which is also what makes the decision auditable later.</p>
      <p>Two subtleties matter beyond timestamps. Attributes that are mutated as a consequence of the outcome, such as collections status or recovery flags, leak regardless of correct validity ranges, so they need excluding by review of what each column means. And data availability lag is separate from event time: a bureau score dated the first may not have landed until the fifth, so a technically timestamp-correct join can still use data that was not available to the decision. Where that gap is material I would model on ingestion time as well.</p>
      <p>I would validate by taking historical applications and reproducing their decisions exactly from the warehouse. If the inputs cannot be regenerated, the design is not yet point-in-time correct. And when a single feature dominates importance implausibly, I would treat it as suspected leakage until proven otherwise rather than as a modelling win.</p>`
    },
    {
      id: 'dd-h2',
      difficulty: 'hard',
      prompt: 'Design the <strong>event schema</strong> for UPI transactions feeding both real-time monitoring and the warehouse. Cover identifiers, duplicates, ordering and schema evolution.',
      hint: 'Assume every event will arrive twice, out of order, and with a new field next quarter.',
      concepts: [
        { label: 'Model state changes as separate events with a stable transaction identifier', any: ['event per state', 'state change', 'transaction id', 'stable id', 'initiated', 'lifecycle', 'status event'], required: true },
        { label: 'Include an idempotency or event key so duplicates can be deduplicated', any: ['idempot', 'event id', 'dedup', 'duplicate', 'unique key', 'at least once'], required: true },
        { label: 'Distinguish event time from ingestion or processing time', any: ['event time', 'processing time', 'ingestion time', 'occurred at', 'received at', 'two timestamp'], required: true },
        { label: 'Assume at-least-once delivery and out-of-order arrival', any: ['at least once', 'out of order', 'reorder', 'ordering', 'late', 'exactly once'], required: true },
        { label: 'Use a sequence number or version to resolve the latest state', any: ['sequence', 'version', 'monotonic', 'latest', 'ordering key', 'status precedence'], required: true },
        { label: 'Design for schema evolution: additive changes, versioning, a registry', any: ['schema evolution', 'additive', 'backward compat', 'version', 'registry', 'optional field', 'avro', 'protobuf'], required: true },
        { label: 'Serve real time from the stream and analytics from a curated layer', any: ['stream', 'real time', 'raw layer', 'curated', 'batch', 'lambda', 'two path', 'medallion'], required: true },
        { label: 'Keep the raw immutable event log so history can be reprocessed', any: ['immutable', 'raw log', 'replay', 'reprocess', 'append only', 'source of truth'], required: true },
        { label: 'Avoid PII in the payload or tokenise it for compliance', any: ['pii', 'token', 'mask', 'sensitive', 'encrypt', 'complian', 'vpa'] }
      ],
      approach: `<p>Design defensively. The interviewer is checking whether you know that streams duplicate, reorder and change shape.</p>
      <ol>
        <li><strong>Event granularity:</strong> emit one event per state change rather than one mutable row: initiated, sent to PSP, authorised, failed, reversed, settled. All share a stable <code>txn_id</code>, and each carries its own <code>event_id</code>, <code>status</code> and reason code.</li>
        <li><strong>Identifiers:</strong> <code>event_id</code> as an idempotency key so re-delivery is harmless, <code>txn_id</code> to stitch the lifecycle, plus <code>customer_id</code>, <code>psp</code>, <code>bank</code> and <code>method</code> as dimensions to segment by later.</li>
        <li><strong>Two timestamps, always:</strong> <code>event_ts</code> for when it happened at source and <code>ingest_ts</code> for when we received it. Without both you cannot distinguish a genuine failure spike from a pipeline delay, which is the first question in every incident.</li>
        <li><strong>Duplicates and ordering:</strong> assume at-least-once delivery, so dedupe on <code>event_id</code> within a window and make every consumer idempotent. Assume out-of-order arrival, so never take "last row wins" literally; resolve current state by a monotonic sequence number or by explicit status precedence, because a stale success arriving after a reversal must not overwrite it.</li>
        <li><strong>Schema evolution:</strong> a registry with explicit versions, additive-only changes, optional fields with defaults and no reuse of field meanings. A format such as Avro or Protobuf enforces compatibility so a producer cannot break every consumer, and a version on each event lets old data stay readable.</li>
        <li><strong>Two serving paths:</strong> the stream powers real-time monitoring on success rate by bank and PSP with second-level latency; the warehouse ingests the same events into an immutable raw layer, then a curated transaction fact at one row per transaction with final status, plus a lifecycle fact at one row per event for funnel and latency analysis.</li>
        <li><strong>Keep the raw log immutable and replayable,</strong> so a logic bug can be fixed by reprocessing rather than by patching aggregates, and keep PII out of the payload or tokenised, since VPAs and account identifiers are sensitive and the log will be retained for a long time.</li>
      </ol>`,
      answer: `<p>I would model the transaction as a series of immutable state-change events rather than one mutable row: initiated, sent to PSP, authorised, failed, reversed, settled. Each shares a stable <code>txn_id</code> for stitching the lifecycle and carries its own <code>event_id</code>, status and reason code, along with dimensional fields such as customer, PSP, issuing bank and payment method so the data can be segmented during an incident.</p>
      <p>Every event carries two timestamps: <code>event_ts</code> for when it occurred at source and <code>ingest_ts</code> for when we received it. That pair is what lets you tell a real failure spike apart from a pipeline delay, which is the first thing anyone asks when a metric moves. I would assume at-least-once delivery, so <code>event_id</code> acts as an idempotency key and consumers dedupe within a window and remain idempotent on replay. I would also assume out-of-order arrival, so current state is resolved by a monotonic sequence number or explicit status precedence rather than by last-write-wins, otherwise a delayed success event can overwrite a reversal.</p>
      <p>For schema evolution I would use a schema registry with versioned, additive-only changes, optional fields with defaults, and a strict rule against reusing or repurposing field names. A binary format such as Avro or Protobuf enforces backward compatibility so a producer change cannot break every consumer, and stamping a schema version on each event keeps old partitions readable.</p>
      <p>On serving, the same stream feeds two paths. Real-time monitoring consumes it directly for success rate by bank and PSP within seconds. The warehouse lands the events in an immutable raw layer, then builds a curated transaction fact at one row per transaction with final status for reporting, plus a lifecycle fact at one row per event for funnel and latency analysis. Keeping the raw log append-only and replayable means a logic error is fixed by reprocessing rather than by patching aggregates, and I would keep PII such as VPAs out of the payload or tokenised, since this log is retained a long time and sits under financial data regulation.</p>`
    },
    {
      id: 'dd-h3',
      difficulty: 'hard',
      prompt: 'You are designing a new warehouse layer that finance will use for regulatory reporting. How do you <strong>design for data quality</strong> so errors are caught before a report is published?',
      hint: 'Quality is a property of the pipeline design, not something you check afterwards.',
      concepts: [
        { label: 'Validate at ingestion and fail fast rather than loading bad data silently', any: ['ingestion', 'fail fast', 'reject', 'quarantine', 'at the boundary', 'before loading'], required: true },
        { label: 'Automated tests on uniqueness, not-null, accepted values and referential integrity', any: ['unique', 'not null', 'accepted value', 'referential', 'test', 'assertion', 'constraint'], required: true },
        { label: 'Reconcile totals against the source system, not just internal consistency', any: ['reconcil', 'source system', 'control total', 'tie back', 'against the source', 'agree with'], required: true },
        { label: 'Freshness and completeness checks with alerting and SLAs', any: ['freshness', 'complete', 'sla', 'alert', 'on time', 'row count', 'expected volume'], required: true },
        { label: 'Anomaly detection on distributions, not only on hard rules', any: ['anomaly', 'distribution', 'drift', 'unexpected', 'volume change', 'statistical'], required: true },
        { label: 'Data contracts with upstream producers and schema change notification', any: ['contract', 'producer', 'upstream', 'schema change', 'agreement', 'notify', 'ownership'], required: true },
        { label: 'Layered architecture: raw immutable, cleaned, curated and certified', any: ['layer', 'raw', 'staging', 'curated', 'certified', 'medallion', 'bronze'], required: true },
        { label: 'Idempotent reprocessing so a bad load can be fixed by rerunning', any: ['idempot', 'rerun', 'reprocess', 'replay', 'backfill', 'restat'], required: true },
        { label: 'Block publication on failure and make lineage and ownership explicit', any: ['block', 'circuit break', 'stop the report', 'gate', 'lineage', 'owner', 'do not publish'], required: true }
      ],
      approach: `<p>Regulatory reporting raises the stakes: a wrong number is a compliance event, not an embarrassment. Argue for quality as an architectural property with gates.</p>
      <ol>
        <li><strong>Validate at the boundary.</strong> Check schema, types, ranges and mandatory fields at ingestion, and quarantine bad records into a rejects table with a reason rather than dropping them or letting them through. Silent coercion of a bad value is worse than a failed load.</li>
        <li><strong>Layer the warehouse:</strong> raw immutable landing, a cleaned and conformed layer, then a curated certified layer that finance consumes. Only the certified layer is published, and each promotion between layers is a gate that must pass tests.</li>
        <li><strong>Test the invariants automatically</strong> on every run: primary key uniqueness, not-null on required columns, accepted values for status enumerations, referential integrity to dimensions, non-negative amounts, and no future-dated transactions. These are cheap and catch most real breakages.</li>
        <li><strong>Reconcile externally, not just internally.</strong> Tie control totals to the source of record: count and sum of disbursals against the loan management system, settlement totals against bank statements. Internally consistent numbers that disagree with the source system are exactly the failure mode regulatory reporting cannot tolerate.</li>
        <li><strong>Monitor freshness, completeness and distribution.</strong> Declare an SLA per table, alert when data is late or row counts fall outside an expected band, and add anomaly detection on distributions to catch the subtler class of problem where the schema is valid but a category has vanished or a mean has shifted.</li>
        <li><strong>Push responsibility upstream</strong> with data contracts: agreed schemas and semantics with the producing team, notification before breaking changes, and a named owner. Most warehouse quality incidents originate in a source change nobody announced.</li>
        <li><strong>Make failure recoverable and visible.</strong> Every model must be idempotent so a bad load is fixed by rerunning a partition rather than by manual patching, and a failed test must block publication and page an owner instead of producing a report with a warning nobody reads. Maintain lineage so the blast radius of a broken source is known immediately, and version the certified outputs so a restatement is explicit and auditable.</li>
      </ol>`,
      answer: `<p>I would treat quality as part of the architecture rather than a checking step at the end. Validation happens at the boundary: schema, types, ranges and mandatory fields are checked at ingestion, and records that fail go to a quarantine table with a reason code rather than being silently coerced or dropped. The warehouse itself is layered, with a raw immutable landing zone, a cleaned and conformed layer, and a curated certified layer that finance consumes, where each promotion is a gate that has to pass its tests.</p>
      <p>On every run I would assert the invariants automatically: primary key uniqueness, not-null on required fields, accepted values for status columns, referential integrity to dimensions, non-negative amounts and no future-dated events. Alongside those, reconciliation against the source of record rather than only internal consistency, tying disbursal counts and sums back to the loan management system and settlement totals to bank statements, because a set of internally consistent numbers that disagrees with the source system is precisely the failure regulatory reporting cannot survive.</p>
      <p>I would declare a freshness and completeness SLA per table with alerting when data is late or volumes fall outside an expected band, and add distribution-level anomaly detection to catch the subtler failures where every row is technically valid but a category has disappeared or an average has shifted. Upstream, I would put data contracts in place with the producing teams covering schema and semantics, advance notice of breaking changes and a named owner, since most incidents start with an unannounced source change.</p>
      <p>Finally, failures must be recoverable and loud. Every model is idempotent so a bad load is corrected by rerunning the affected partition rather than by hand-patching, a failed test blocks publication and pages an owner instead of emitting a report with a caveat nobody reads, lineage makes the blast radius of a broken source immediately visible, and certified outputs are versioned so any restatement is explicit and auditable.</p>`
    },
    {
      id: 'dd-h4',
      difficulty: 'hard',
      prompt: 'Finance asks for outstanding loan book value by city, month and product, over three years. Design the model, and explain the <strong>semi-additive</strong> problem you have to solve.',
      hint: 'You cannot sum a balance across time, so decide what "the month value" even means.',
      concepts: [
        { label: 'Outstanding balance is semi-additive: additive across entities, not across time', any: ['semi additive', 'not across time', 'additive across', 'cannot sum over', 'balance'], required: true },
        { label: 'Choose an explicit convention: period-end, average or daily average balance', any: ['period end', 'month end', 'average', 'closing', 'convention', 'last day'], required: true },
        { label: 'Model as a periodic snapshot fact at one row per loan per day or month', any: ['snapshot', 'one row per loan per', 'daily', 'monthly', 'periodic'], required: true },
        { label: 'Daily grain then aggregating is more flexible but much larger', any: ['daily grain', 'storage', 'size', 'volume', 'flexib', 'larger', 'billions'], required: true },
        { label: 'Never average an average across cities or products', any: ['average of average', 'weight', 'do not average', 'recompute', 'wrong'], required: true },
        { label: 'City and product must be captured as at the snapshot date, not current values', any: ['as at', 'point in time', 'type 2', 'at the time', 'current value', 'historical attribute'], required: true },
        { label: 'Pre-aggregate to month for a three-year dashboard rather than scanning daily', any: ['pre aggregate', 'monthly table', 'materiali', 'summary', 'performance', 'aggregate table'], required: true },
        { label: 'Handle closed, written-off and restructured loans explicitly', any: ['closed', 'written off', 'write off', 'restructur', 'zero balance', 'npa', 'exclude'], required: true },
        { label: 'Agree the definition with finance and reconcile to their books', any: ['agree', 'finance', 'reconcil', 'definition', 'sign off', 'tie'], required: true }
      ],
      approach: `<p>The modelling is routine; the semi-additive decision is the question. Lead with that, then design around it.</p>
      <ol>
        <li><strong>Name the problem.</strong> Outstanding balance is a level, not a flow. Summing across loans on one date is valid; summing one loan across the 30 dates of a month gives thirty times the balance, which is meaningless. So "outstanding for March" is undefined until a convention is chosen.</li>
        <li><strong>Choose the convention with finance:</strong> month-end closing balance, which is what statutory reporting normally uses; average daily balance, which is what interest income tracks and is less distorted by month-end movements; or both, clearly labelled. Get this agreed and written down, because the numbers differ materially and both are defensible.</li>
        <li><strong>The model:</strong> <code>fct_loan_daily_snapshot</code> at one row per active loan per day, carrying outstanding principal, DPD bucket, and foreign keys to loan, customer, product and city as at that date. Daily grain gives full flexibility, including average daily balance and any as-of date, at the cost of size, so for a large book I would keep daily for a rolling window and month-end snapshots for deep history.</li>
        <li><strong>Point-in-time attributes.</strong> City and product must be the values at the snapshot date, not today values, otherwise a customer who moved cities retroactively rewrites three years of geography reporting. That means resolving them through Type 2 dimensions at snapshot build time.</li>
        <li><strong>Aggregation rules.</strong> Across cities and products on one date, sum. Across time, apply the agreed convention: pick the month-end row, or average the dailies weighted by days. Never average pre-computed averages, and expose the measure in the semantic layer so it aggregates correctly by construction rather than relying on each analyst to remember.</li>
        <li><strong>Serving:</strong> for a three-year by-city-by-product dashboard, pre-aggregate to a monthly table at city, product and month grain. Scanning billions of daily rows on every dashboard load is unnecessary when the required grain is known.</li>
        <li><strong>Edge cases and sign-off:</strong> decide explicitly how closed, written-off, restructured and non-performing loans are treated, since each materially changes the total, then reconcile the output to finance own books before it is published, because on this metric their number is the authority.</li>
      </ol>`,
      answer: `<p>The core issue is that outstanding balance is semi-additive: it is a level rather than a flow. Summing it across loans, cities and products on a single date is valid, but summing one loan balance across the days of a month multiplies it by the number of days and means nothing. So "outstanding for March" has no definition until we choose a convention, and I would agree that with finance explicitly: month-end closing balance, which statutory reporting usually wants, or average daily balance, which corresponds to how interest income accrues and is less distorted by month-end timing, or both clearly labelled. The two differ materially and both are legitimate, so the decision must be documented rather than assumed.</p>
      <p>Structurally I would build a periodic snapshot fact at one row per active loan per day, holding outstanding principal and delinquency bucket, with keys to loan, customer, product and city resolved as at the snapshot date rather than to current values. That last point matters: if a customer city is taken from today dimension, someone relocating silently rewrites three years of geographic reporting. Daily grain gives the most flexibility, including average daily balance and arbitrary as-of dates, so for a large book I would keep daily snapshots for a rolling window and month-end snapshots for older history to control size.</p>
      <p>The aggregation rules follow from the semi-additivity: sum freely across entities within a date, and across time apply the agreed convention by selecting the month-end row or averaging dailies weighted by days. Averages must never be averaged across cities or products; the measure should be defined in the semantic layer so it aggregates correctly by construction rather than depending on each analyst remembering.</p>
      <p>For serving a three-year dashboard I would pre-aggregate to a monthly fact at city, product and month grain rather than scanning daily rows on every load. And I would settle the edge cases in writing: how closed, written-off, restructured and non-performing loans are counted, each of which moves the headline number, then reconcile the result against finance own books before publishing, since for this metric theirs is the authoritative version.</p>`
    },
    {
      id: 'dd-h5',
      difficulty: 'hard',
      prompt: 'Your daily pipeline sometimes receives <strong>records for previous days</strong>, and dimension attributes occasionally arrive after the facts that reference them. Design the model and pipeline so both are handled correctly.',
      hint: 'Late data is normal, so the design has to make restating a past day a routine operation.',
      concepts: [
        { label: 'Separate event time from processing time and partition by event date', any: ['event time', 'processing time', 'event date', 'partition by', 'business date', 'arrival'], required: true },
        { label: 'Make loads idempotent so a day can be safely rebuilt', any: ['idempot', 'rebuild', 'overwrite the partition', 'rerun', 'replay', 'delete insert'], required: true },
        { label: 'Reprocess a lookback window rather than only the latest day', any: ['lookback', 'window', 'last n days', 'rolling', 'trailing', 'reprocess'], required: true },
        { label: 'Use a watermark on updated_at or ingestion time to find changed rows', any: ['watermark', 'updated_at', 'high water', 'changed since', 'cdc', 'ingest'], required: true },
        { label: 'Late-arriving dimensions need an inferred or placeholder member', any: ['placeholder', 'inferred', 'unknown member', 'dummy', 'late arriving dimension', 'stub'], required: true },
        { label: 'Never drop facts whose dimension is missing; keep them and backfill the key', any: ['do not drop', 'keep the fact', 'backfill', 'update later', 'resolve later', 'orphan'], required: true },
        { label: 'Handle out-of-order updates by sequence or version, not last write wins', any: ['out of order', 'sequence', 'version', 'last write', 'precedence', 'ordering'], required: true },
        { label: 'Communicate restatements: numbers for closed periods can legitimately change', any: ['restat', 'change after', 'communicat', 'version', 'as of report', 'audit', 'expect'], required: true },
        { label: 'Monitor lateness so the lookback window stays appropriate', any: ['monitor', 'measure the lag', 'distribution of lateness', 'how late', 'alert', 'tune'], required: true }
      ],
      approach: `<p>Design for lateness as the normal case. The test is whether restating yesterday is a routine, safe operation or a manual incident.</p>
      <ol>
        <li><strong>Two clocks, always.</strong> Store event time, meaning when the transaction occurred, and ingestion time, when we received it. Partition facts by event date so a record belonging to Monday lands in Monday partition regardless of when it arrives, which keeps business reporting correct by construction.</li>
        <li><strong>Idempotent loads.</strong> Every run rebuilds whole partitions rather than blindly appending: overwrite that event date, or delete and reinsert its key range, or upsert on primary key. Idempotency is what makes reprocessing safe and turns late data from an incident into a rerun.</li>
        <li><strong>Rolling lookback.</strong> Instead of processing only yesterday, reprocess a trailing window, say the last seven days, chosen by measuring the actual distribution of lateness rather than guessing. Anything later than the window is handled by a targeted backfill of the affected partitions, using an updated_at or ingestion watermark to find what changed.</li>
        <li><strong>Late-arriving dimensions:</strong> when a fact references a dimension member that has not arrived, do not drop the fact and do not silently inner join it away. Insert an inferred placeholder row in the dimension carrying the natural key with attributes marked unknown, point the fact at it, and let the real attributes update that row when they arrive. The fact stays countable from the first moment and the totals never move because of a join.</li>
        <li><strong>Out-of-order updates:</strong> resolve state by sequence number or version rather than last write wins, so a stale record arriving after a newer one cannot overwrite it. For Type 2 dimensions, inserting history out of order also means recalculating validity ranges around the inserted row rather than just appending.</li>
        <li><strong>Then manage expectations.</strong> If late data is real, a closed period legitimately changes, so decide the policy: a cut-off after which figures are frozen and corrections are shown as restatements, or fully as-of reporting where every published number carries the date it was computed. Finance in particular needs this agreed rather than discovered.</li>
        <li><strong>Monitor lateness itself</strong> as a metric, so the lookback window and freshness SLAs are tuned to reality and a change in upstream behaviour is visible before it corrupts a report.</li>
      </ol>`,
      answer: `<p>I would separate the two clocks and partition on the business one. Each fact carries event time, when the transaction actually happened, and ingestion time, when we received it, and the table is partitioned by event date so a record belonging to Monday lands in Monday partition no matter when it arrives. Then every load is idempotent: runs rebuild whole partitions by overwrite, delete-and-reinsert or upsert on key, so reprocessing is always safe and late data becomes a rerun rather than an incident.</p>
      <p>Rather than processing only the latest day, the pipeline reprocesses a trailing lookback window, sized from the measured distribution of lateness instead of a guess, with anything beyond that handled as a targeted backfill of the affected partitions driven by an updated_at or ingestion watermark.</p>
      <p>For late-arriving dimensions, the rule is never to drop the fact and never to let an inner join quietly discard it. When a fact references a dimension member that has not yet arrived, I insert an inferred placeholder row holding the natural key with attributes marked unknown, point the fact at that surrogate key, and update the row in place when the real attributes appear. That way counts and sums are correct immediately and do not shift later purely because a join started matching. Out-of-order updates are resolved by sequence number or version rather than last write wins, so a stale record cannot overwrite a newer one, and inserting history into a Type 2 dimension out of order means recalculating the validity ranges around it rather than simply appending.</p>
      <p>Because late data genuinely changes closed periods, the policy has to be explicit: either a cut-off after which figures are frozen and later corrections are published as restatements, or as-of reporting where every number carries the timestamp it was computed at. Finance needs that agreed up front rather than discovered when a total moves. Finally I would monitor lateness itself as a metric so the lookback window and freshness SLAs track reality and a shift in upstream behaviour surfaces before it corrupts a report.</p>`
    }
  ]
});
