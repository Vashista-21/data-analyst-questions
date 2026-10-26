/* ETL/ELT, dbt and Airflow: the pipeline side of a data analyst role, as asked
   for in Khatabook Central Analytics job posts (dbt, Airflow, Airbyte, fact
   tables, reporting automation, reconciliation with finance). Examples use a
   merchant ledger whose entries are created offline and synced later. */
DAQ.registerTopic({
  id: 'data-pipelines',
  group: 'prep',
  name: 'ETL/ELT Pipelines, dbt & Airflow',
  icon: '\uD83D\uDEE0\uFE0F',
  blurb: 'ETL vs ELT, dbt models, tests and incremental builds, Airflow DAGs, idempotent backfills, CDC ingestion, reconciliation with finance, failure runbooks and automating manual reports.',
  questions: [
    /* ---------------------------- EASY ---------------------------- */
    {
      id: 'pl-e1',
      difficulty: 'easy',
      prompt: 'What is the difference between <strong>ETL and ELT</strong>, and why do most modern analytics stacks use ELT?',
      hint: 'The difference is where the transformation happens, and what you keep.',
      concepts: [
        { label: 'ETL transforms data before loading it into the warehouse', any: ['transform before', 'before loading', 'before it lands'], required: true },
        { label: 'ELT loads raw data first and transforms inside the warehouse', any: ['load raw', 'inside the warehouse', 'loads raw'], required: true },
        { label: 'Cheap, scalable cloud warehouse compute and storage made ELT practical', any: ['cloud', 'cheap storage', 'scalable', 'columnar'], required: true },
        { label: 'Keeping raw data lets you reprocess when logic changes', any: ['reprocess', 'replay', 'rebuild', 'raw layer'], required: true },
        { label: 'Transformations become versioned SQL, typically in dbt', any: ['dbt', 'version control', 'git'], required: true },
        { label: 'ETL still fits when sensitive data must be masked before landing, or for heavy non-SQL processing', any: ['pii', 'mask', 'sensitive', 'non sql'], required: true }
      ],
      approach: `<p>Define both by where the T happens, then explain why the industry moved, then give the case where ETL still wins.</p>
      <ol>
        <li><strong>ETL:</strong> extract, transform before loading on a separate server or tool, then load only the cleaned result. The warehouse never sees raw data.</li>
        <li><strong>ELT:</strong> extract, load raw into the warehouse, then transform inside the warehouse with SQL.</li>
        <li><strong>Why ELT won:</strong> cloud warehouses with columnar storage made storage cheap and compute scalable, so transforming in place is fast. Keeping the raw layer means when a business rule changes or a bug is found, you reprocess history instead of re-extracting it.</li>
        <li><strong>Engineering benefit:</strong> transformations become SQL in version control, reviewed and tested, which is what dbt provides.</li>
        <li><strong>When ETL still makes sense:</strong> PII or sensitive data that must be masked before it lands anywhere, heavy non-SQL processing such as parsing documents, or legacy systems.</li>
      </ol>`,
      answer: `<p>The difference is where the transformation happens. In ETL, data is extracted, transformed before loading on a separate tool or server, and only the cleaned result is loaded into the warehouse. In ELT, data is extracted and we load raw data into the warehouse first, then transform inside the warehouse with SQL.</p>
      <p>Most modern stacks use ELT because cloud warehouses with columnar storage made storage cheap and compute scalable, so transforming in place is fast and simple. Keeping a raw layer is the big advantage: when a business rule changes or a bug is found, you can reprocess or rebuild history from the raw data instead of extracting it again. It also means transformations live as SQL in version control, reviewed and tested, which is exactly what dbt is for.</p>
      <p>ETL still makes sense when sensitive data such as PII must be masked before it lands anywhere, when processing is heavy non SQL work like parsing documents, or in legacy setups.</p>`
    },
    {
      id: 'pl-e2',
      difficulty: 'easy',
      prompt: 'What is <strong>dbt</strong>, what problems does it solve, and what does it <em>not</em> do?',
      hint: 'Models, ref, materialisations, tests, docs. And who extracts and schedules?',
      concepts: [
        { label: 'dbt handles the transform step using SQL select statements called models', any: ['select statement', 'models', 'transform step'], required: true },
        { label: 'ref and source build a dependency graph and lineage', any: ['ref function', 'lineage', 'dependency graph'], required: true },
        { label: 'Materialisations: view, table, incremental, ephemeral', any: ['materiali', 'ephemeral'], required: true },
        { label: 'Built-in tests: unique, not null, accepted values, relationships', any: ['not null', 'accepted values', 'relationships'], required: true },
        { label: 'Documentation, version control, code review and CI', any: ['documentation', 'code review', 'version control'], required: true },
        { label: 'It does not extract, load or schedule: Airbyte and Airflow do that', any: ['does not extract', 'airflow', 'airbyte'], required: true },
        { label: 'Jinja and macros for reusable logic', any: ['jinja', 'macro'] }
      ],
      approach: `<p>Describe dbt as software engineering practice applied to SQL transformations.</p>
      <ol>
        <li><strong>What it is:</strong> a tool for the transform step of ELT. Each model is a SQL select statement in a file; dbt wraps it in the DDL to build a view or table.</li>
        <li><strong>Dependencies:</strong> models reference each other with the ref function and raw tables with source, so dbt builds a dependency graph, runs models in the right order and shows lineage.</li>
        <li><strong>Materialisations:</strong> view, table, incremental and ephemeral, chosen per model.</li>
        <li><strong>Tests:</strong> unique, not null, accepted values and relationships out of the box, plus custom SQL tests.</li>
        <li><strong>Engineering hygiene:</strong> version control in git, code review, CI, and auto-generated documentation. Jinja and macros remove copy-pasted SQL.</li>
        <li><strong>What it does not do:</strong> it does not extract or load data (Airbyte or Fivetran do) and does not schedule itself (Airflow or dbt Cloud does).</li>
      </ol>`,
      answer: `<p>dbt handles the transform step of ELT. Each model is a SQL select statement in a file, and dbt turns it into a view or table in the warehouse. Models reference each other through the ref function and raw tables through source, so dbt builds a dependency graph, runs everything in the right order and shows lineage from source to dashboard.</p>
      <p>It solves the problems of SQL scattered across dashboards and scripts: logic is defined once, kept in version control, goes through code review and CI, and generates documentation automatically. Each model chooses a materialisation, meaning view, table, incremental or ephemeral, and dbt ships tests such as unique, not null, accepted values and relationships, plus custom tests, so data quality checks run with every build. Jinja and macros let you reuse logic rather than copy it.</p>
      <p>What it does not do: dbt does not extract or load data, which is the job of tools like Airbyte, and it does not schedule itself, which is usually Airflow or dbt Cloud.</p>`
    },
    {
      id: 'pl-e3',
      difficulty: 'easy',
      prompt: 'What is <strong>Apache Airflow</strong>? Explain DAGs, tasks and operators, and what Airflow should <em>not</em> be used for.',
      hint: 'Airflow is the conductor, not the orchestra.',
      concepts: [
        { label: 'Airflow orchestrates and schedules workflows defined as DAGs', any: ['orchestrat', 'directed acyclic'], required: true },
        { label: 'Tasks, operators and the dependencies between them', any: ['operator', 'upstream', 'downstream'], required: true },
        { label: 'Scheduler, retries, alerting and SLAs', any: ['retries', 'retry', 'sla', 'alert'], required: true },
        { label: 'Logical date and backfills', any: ['logical date', 'execution date', 'backfill'], required: true },
        { label: 'Heavy data processing belongs in the warehouse or dbt, not in Airflow workers', any: ['not in airflow', 'push the work', 'in the warehouse', 'not process data'], required: true },
        { label: 'Sensors wait for external conditions', any: ['sensor'] }
      ],
      approach: `<p>Define the vocabulary, then the operational features, then the boundary.</p>
      <ol>
        <li><strong>Airflow</strong> is an orchestrator: it schedules and monitors workflows defined in Python as DAGs, directed acyclic graphs of tasks.</li>
        <li><strong>Task and operator:</strong> a task is one step; an operator is the template for it, such as running SQL, triggering a dbt build or calling an API. Dependencies define upstream and downstream order.</li>
        <li><strong>Operations:</strong> the scheduler triggers runs on a schedule, failed tasks get retries with backoff, and alerts and SLAs flag failures or lateness. Sensors wait for external conditions such as a file landing or an upstream DAG finishing.</li>
        <li><strong>Logical date:</strong> each run processes a data interval identified by its logical (execution) date, which is what makes backfills possible.</li>
        <li><strong>Boundary:</strong> Airflow should not process data itself. Pulling millions of rows into a worker's memory is fragile. Push the work into the warehouse or dbt and let Airflow trigger and monitor it.</li>
      </ol>`,
      answer: `<p>Airflow is an orchestrator: it schedules, runs and monitors workflows defined in Python as DAGs, directed acyclic graphs of tasks. A task is one step, an operator is the template for a type of step, such as running a SQL query, triggering a dbt build or calling an API, and dependencies define which tasks are upstream and downstream of each other.</p>
      <p>The scheduler triggers DAG runs on a schedule; failed tasks get retries with backoff; alerts and SLAs notify the team when something fails or runs late; and sensors wait for external conditions like an upstream load finishing. Each run is tied to a logical date, also called the execution date, representing the data interval it processes, which is what makes backfill of past dates straightforward.</p>
      <p>What Airflow should not be used for is heavy data processing. Pulling large datasets into a worker's memory with pandas is fragile and slow. The right pattern is to push the work into the warehouse or dbt and have Airflow trigger it and monitor it, so the work happens in the warehouse and not in Airflow.</p>`
    },
    {
      id: 'pl-e4',
      difficulty: 'easy',
      prompt: 'Compare a <strong>full refresh</strong> with an <strong>incremental load</strong>. When would you choose each?',
      hint: 'Simplicity and correctness against cost and speed, plus what incremental loads quietly miss.',
      concepts: [
        { label: 'Full refresh rebuilds the whole table each run: simple and correct but expensive', any: ['full refresh', 'whole table'], required: true },
        { label: 'Incremental processes only new or changed rows', any: ['only new', 'changed rows', 'new or changed'], required: true },
        { label: 'Incremental needs a reliable watermark such as updated_at, and a unique key', any: ['watermark', 'updated at', 'unique key'], required: true },
        { label: 'Late or changed records need a lookback window', any: ['lookback', 'late arriv'], required: true },
        { label: 'Incremental loads miss hard deletes', any: ['hard delete'], required: true },
        { label: 'Choose by table size and cost: small dimensions full refresh, large facts incremental with periodic rebuilds', any: ['small dimension', 'periodic full', 'table size', 'cost'], required: true }
      ],
      approach: `<p>Give the trade-off, then the hidden failure modes of incremental.</p>
      <ol>
        <li><strong>Full refresh:</strong> drop and rebuild the whole table each run. Simple, always consistent with the source, but cost and runtime grow with history.</li>
        <li><strong>Incremental:</strong> process only new or changed rows since the last run and merge them in. Fast and cheap at scale.</li>
        <li><strong>What incremental needs:</strong> a reliable watermark, usually updated_at or a sync timestamp, and a unique key so changed rows overwrite rather than duplicate.</li>
        <li><strong>What it misses:</strong> late arriving rows (an offline entry synced three days later) unless you use a lookback window, and hard deletes, which leave no row to pick up.</li>
        <li><strong>Choice:</strong> small dimensions get a full refresh; large facts are incremental with a lookback and a periodic full rebuild, for example weekly, to correct drift.</li>
      </ol>`,
      answer: `<p>A full refresh rebuilds the whole table on every run. It is simple and always consistent with the source, but its cost and runtime grow with history. An incremental load processes only new or changed rows since the last run and merges them into the existing table, which is far cheaper at scale.</p>
      <p>Incremental loads need a reliable watermark, typically updated at or a sync timestamp, and a unique key so changed rows overwrite their old version rather than duplicating. They also have blind spots: late arriving records, such as an entry made offline and synced days later, are missed unless the filter uses a lookback window, and a hard delete in the source leaves nothing to pick up, so deleted rows survive in the warehouse.</p>
      <p>So I choose by table size and cost: small dimensions get a full refresh because it is cheap and removes a class of bugs, while large fact tables are incremental with a lookback window and a periodic full rebuild, for example weekly, to correct any drift.</p>`
    },
    {
      id: 'pl-e5',
      difficulty: 'easy',
      prompt: 'Which <strong>data quality tests</strong> would you put on a payments fact table before a dashboard reads it?',
      hint: 'Grain, keys, values, relationships, freshness, volume, and agreement with finance.',
      concepts: [
        { label: 'Uniqueness on the grain key', any: ['unique', 'grain'], required: true },
        { label: 'Not null on keys and critical columns', any: ['not null'], required: true },
        { label: 'Accepted values and ranges: status enums, no negative amounts', any: ['accepted values', 'negative', 'range'], required: true },
        { label: 'Referential integrity: every merchant_id exists in the merchant dimension', any: ['referential', 'relationships', 'orphan'], required: true },
        { label: 'Freshness: the latest data is recent enough', any: ['freshness', 'stale'], required: true },
        { label: 'Volume anomaly checks on row counts', any: ['row count', 'volume', 'anomal'], required: true },
        { label: 'Reconciliation of totals with finance or the gateway', any: ['reconcil', 'control total', 'finance'] },
        { label: 'Severity: some tests block publishing, others warn', any: ['severity', 'warn', 'block'] }
      ],
      approach: `<p>Walk the layers of what can go wrong, then say how failures are handled.</p>
      <ol>
        <li><strong>Grain:</strong> payment_id is unique, so one row per payment.</li>
        <li><strong>Keys:</strong> payment_id, merchant_id, amount and created_at are not null.</li>
        <li><strong>Values:</strong> accepted values on status (success, failed, refunded), no negative amounts except on refund rows, timestamps in a plausible range.</li>
        <li><strong>Relationships:</strong> every merchant_id exists in the merchant dimension, so there are no orphan rows that disappear in joins.</li>
        <li><strong>Freshness:</strong> the latest record is recent, so a stale table is caught before someone reads yesterday's number as today's.</li>
        <li><strong>Volume:</strong> row count and total amount within a band of the same weekday in recent weeks, which catches partial loads.</li>
        <li><strong>Reconciliation:</strong> daily totals match the gateway settlement or finance within tolerance.</li>
        <li><strong>Severity:</strong> grain and freshness failures block publishing; softer anomalies warn and alert.</li>
      </ol>`,
      answer: `<p>I would test the grain first: payment_id must be unique, so the table has exactly one row per payment. Then not null on keys and critical columns, meaning payment_id, merchant_id, amount and created_at. Then accepted values on status, no negative amounts outside refund rows, and timestamps in a plausible range. Then relationships: every merchant_id must exist in the merchant dimension, because orphan rows silently vanish in inner joins.</p>
      <p>On top of the row-level tests I would add a freshness check, so a stale table is caught before someone reads yesterday's number as today's, and a volume check comparing row count and total amount against the same weekday in recent weeks, which catches partial loads. For a payments table I would also reconcile daily totals with the gateway settlement report or finance within an agreed tolerance.</p>
      <p>Finally I would set severity: a failure on grain, keys or freshness should block publishing so the dashboard shows stale-but-correct data rather than fresh-but-wrong data, while volume anomalies warn and alert someone to look.</p>`
    },

    /* --------------------------- MEDIUM --------------------------- */
    {
      id: 'pl-m1',
      difficulty: 'medium',
      prompt: 'Write a <strong>dbt incremental model</strong> for merchant ledger entries. Entries can be created offline and synced days later, and merchants can edit or delete them.',
      context: 'raw.ledger_entries(entry_id, merchant_id, amount, entry_type, created_at, updated_at, synced_at, is_deleted)\n-- created_at: device time of the entry; synced_at: server time the latest version arrived',
      hint: 'Which timestamp tells you a row is new to the warehouse? Not the one the merchant typed.',
      concepts: [
        { label: 'Incremental materialisation with a unique key', any: ['unique key', 'unique_key'], required: true },
        { label: 'is_incremental() block filtering on a watermark from the existing table', any: ['is incremental', 'from this'], required: true },
        { label: 'Filter on synced_at, not created_at, because offline entries arrive late', any: ['synced at', 'not created at'], required: true },
        { label: 'Lookback overlap so nothing near the boundary is missed', any: ['lookback', 'overlap'], required: true },
        { label: 'Merge or upsert strategy so edits overwrite the old version', any: ['merge', 'upsert'], required: true },
        { label: 'Carry soft deletes through as a flag and filter downstream', any: ['soft delete', 'is deleted'], required: true },
        { label: 'Tests and a periodic full refresh', any: ['full refresh', 'tests'] }
      ],
      approach: `<p>The trap is filtering on created_at. An entry typed on Monday offline and synced on Thursday has an old created_at and would be skipped forever.</p>
<pre>{{ config(
    materialized = 'incremental',
    unique_key = 'entry_id',
    incremental_strategy = 'merge'
) }}

SELECT entry_id, merchant_id, amount, entry_type,
       created_at, updated_at, synced_at, is_deleted
FROM {{ source('raw', 'ledger_entries') }}

{% if is_incremental() %}
WHERE synced_at &gt; (SELECT MAX(synced_at) - INTERVAL '3' DAY FROM {{ this }})
{% endif %}</pre>
      <ol>
        <li><strong>unique_key with merge:</strong> an edited entry arrives as a new version with the same entry_id and overwrites the old row instead of duplicating it (an upsert).</li>
        <li><strong>Watermark on synced_at:</strong> the server time the latest version arrived. That captures late offline syncs and edits. Filtering on created_at would miss both.</li>
        <li><strong>Lookback overlap:</strong> subtracting a few days from the max re-reads a window, covering clock skew and rows committed slightly out of order. The merge makes the overlap harmless.</li>
        <li><strong>Soft deletes:</strong> keep is_deleted as a column so deletions propagate, and filter them in downstream marts. Hard deletes would need CDC.</li>
        <li><strong>Safety:</strong> unique and not null tests on entry_id, and a scheduled full refresh to correct drift.</li>
      </ol>`,
      answer: `<p>The key decision is the watermark. Because entries can be created offline and synced days later, I filter on synced_at, the server time the latest version arrived, not created_at, which is device time and can be days old when the row first appears:</p>
<pre>{{ config(
    materialized = 'incremental',
    unique_key = 'entry_id',
    incremental_strategy = 'merge'
) }}

SELECT entry_id, merchant_id, amount, entry_type,
       created_at, updated_at, synced_at, is_deleted
FROM {{ source('raw', 'ledger_entries') }}

{% if is_incremental() %}
WHERE synced_at &gt; (SELECT MAX(synced_at) - INTERVAL '3' DAY FROM {{ this }})
{% endif %}</pre>
      <p>The is_incremental block only applies after the first build and reads the current maximum from this, the existing table. The unique key with a merge strategy makes it an upsert, so an edited entry overwrites its previous version instead of creating a duplicate. Subtracting three days creates a lookback overlap that covers clock skew and out-of-order commits; the merge makes reprocessing those rows harmless. Deletions arrive as soft deletes, so I keep is_deleted as a column and filter it out in downstream marts rather than here; true hard deletes would need CDC. I would add unique and not null tests on entry_id and schedule a periodic full refresh to correct any drift.</p>`
    },
    {
      id: 'pl-m2',
      difficulty: 'medium',
      prompt: 'What does it mean for an Airflow task to be <strong>idempotent</strong>, and how do you run a <strong>backfill</strong> for the last 90 days safely?',
      hint: 'Running the same date twice should change nothing. Then think about load on the warehouse.',
      concepts: [
        { label: 'Idempotent: rerunning the task for the same interval gives the same result', any: ['idempot', 'same result'], required: true },
        { label: 'Overwrite the partition or delete-then-insert, never blind append', any: ['overwrite', 'delete then insert', 'blind append'], required: true },
        { label: 'Use the logical date or data interval, never now() or current date', any: ['logical date', 'data interval', 'current date'], required: true },
        { label: 'Backfill with catchup or the backfill command, throttled with max active runs', any: ['backfill', 'max active runs', 'throttl'], required: true },
        { label: 'Transformations are deterministic and independent of run order', any: ['deterministic', 'run order'], required: true },
        { label: 'Validate after the backfill: row counts and comparison with the old output', any: ['validat', 'row count', 'compare'], required: true }
      ],
      approach: `<p>Idempotency is what makes retries and backfills boring instead of dangerous.</p>
      <ol>
        <li><strong>Definition:</strong> a task is idempotent if running it again for the same interval gives the same result, with no duplicates and no side effects.</li>
        <li><strong>How:</strong> each run overwrites its own partition (INSERT OVERWRITE for that date) or does delete then insert for its date range. A blind append duplicates data on every retry.</li>
        <li><strong>Dates:</strong> use the run's logical date or data interval, never now() or current date. Otherwise a backfill run for 1 March processes today's data.</li>
        <li><strong>Deterministic:</strong> the same inputs give the same outputs, with no dependence on run order or on the previous run's state, so days can run in parallel.</li>
        <li><strong>Backfill:</strong> use catchup or the airflow dags backfill command for the date range, with max active runs set low so 90 parallel runs do not swamp the warehouse, and run off-peak.</li>
        <li><strong>Validate:</strong> compare row counts and key totals per day with the old output, and spot-check a few days before announcing it.</li>
      </ol>`,
      answer: `<p>A task is idempotent if running it again for the same interval gives the same result: no duplicates, no double counting, no side effects. In practice that means each run writes only its own slice and replaces it, either by overwriting the date partition or by delete then insert for that date range, instead of a blind append that duplicates data on every retry. It also means the task uses the run's logical date or data interval rather than now() or current date, otherwise a backfill run for March would quietly process today's data, and that the transformation is deterministic and does not depend on run order or on state left by a previous run.</p>
      <p>With that in place, a 90-day backfill is just the same task run for 90 logical dates, using catchup or the airflow dags backfill command for the range. I would throttle it with max active runs so it does not swamp the warehouse, run it off-peak, and process in chunks so a failure is easy to resume. Afterwards I would validate by comparing row counts and key totals per day with the previous output and spot-checking a few days before telling anyone the history has changed.</p>`
    },
    {
      id: 'pl-m3',
      difficulty: 'medium',
      prompt: 'Explain the <strong>staging, intermediate and marts</strong> layering in a dbt project. Why bother?',
      hint: 'Each layer has one job, and dashboards only ever read the last one.',
      concepts: [
        { label: 'Staging: one model per source table, renaming, casting, light cleaning', any: ['staging', 'rename', 'cast'], required: true },
        { label: 'Intermediate: joins and reusable business logic', any: ['intermediate', 'business logic'], required: true },
        { label: 'Marts: facts and dimensions built for consumption by BI', any: ['mart', 'fact', 'dimension'], required: true },
        { label: 'Why: logic in one place, reuse, easier debugging and lineage', any: ['one place', 'reuse', 'debug'], required: true },
        { label: 'BI tools read only from marts, never from raw tables', any: ['only from marts', 'never from raw', 'never raw'], required: true },
        { label: 'Naming conventions such as stg_, int_, fct_, dim_', any: ['stg', 'fct', 'naming'], required: true }
      ],
      approach: `<p>Describe each layer's single job, then the payoff.</p>
      <ol>
        <li><strong>Staging (stg_):</strong> one model per source table. Rename columns to a standard, cast types, convert timezones, light cleaning. No joins, no business logic. If an upstream team renames a column, this is the only place that changes.</li>
        <li><strong>Intermediate (int_):</strong> joins and reusable business logic, such as deduplicating entries to the latest version or computing merchant-week activity.</li>
        <li><strong>Marts (fct_, dim_):</strong> facts and dimensions at a declared grain, built for consumption by BI tools and analysts.</li>
        <li><strong>Why:</strong> each rule is defined in one place and reused, debugging follows lineage layer by layer, and a source change touches one staging model instead of twenty dashboards.</li>
        <li><strong>Rule:</strong> dashboards read only from marts, never from raw or staging tables, so every number comes from tested, documented logic.</li>
      </ol>`,
      answer: `<p>Each layer has a single job. Staging models, named stg_, map one to one with source tables: they rename columns, cast types, standardise timezones and do light cleaning, with no joins or business logic. Intermediate models, named int_, hold joins and reusable business logic, for example deduplicating ledger entries to their latest version or computing merchant activity per week. Marts are the fact and dimension tables, named fct_ and dim_, at a declared grain and built for consumption by BI tools and analysts.</p>
      <p>The payoff is that every business rule lives in one place and gets reused rather than copied into many queries, debugging follows the lineage layer by layer, and when an upstream team renames a column only one staging model changes instead of every dashboard. The rule that makes it work is that dashboards read only from marts, never from raw or staging tables, so every published number comes from tested, documented logic. Consistent naming conventions make the layer of any model obvious at a glance.</p>`
    },
    {
      id: 'pl-m4',
      difficulty: 'medium',
      prompt: 'A daily Airflow DAG <strong>fails at 3am</strong>, and a leadership dashboard reads its output at 9am. What do you do now, and what do you change so it hurts less next time?',
      hint: 'Triage, protect the readers, fix safely, then prevent.',
      concepts: [
        { label: 'Triage: read the logs, find the failed task and the affected downstream assets', any: ['logs', 'triage', 'failed task'], required: true },
        { label: 'Tell dashboard users early: stale-data banner or heads-up', any: ['banner', 'heads up', 'notify'], required: true },
        { label: 'Fix and rerun safely, relying on idempotent tasks', any: ['rerun', 'idempot', 'clear the task'], required: true },
        { label: 'Never publish partial or wrong data: fail loudly, stale but correct', any: ['partial', 'fail loudly', 'stale but correct'], required: true },
        { label: 'Prevent: retries with backoff, timeouts, alerts, SLAs, sensors', any: ['backoff', 'timeout', 'sla', 'sensor'], required: true },
        { label: 'Write a short postmortem with the root cause', any: ['postmortem', 'post mortem', 'root cause'], required: true }
      ],
      approach: `<p>Two jobs: protect the people reading the number, then make the pipeline more robust.</p>
      <ol>
        <li><strong>Triage:</strong> read the logs, identify the failed task and the error type (upstream data late, schema change, warehouse timeout, credential expiry), and list the affected downstream tables and dashboards.</li>
        <li><strong>Protect readers:</strong> notify the dashboard owners early and show a stale-data banner with the last good date. Leadership acting on yesterday's number unaware is worse than a visible delay.</li>
        <li><strong>Never publish partial data:</strong> if only half the input landed, the job should fail loudly rather than write a partial day. Stale but correct beats fresh but wrong.</li>
        <li><strong>Fix and rerun:</strong> fix the cause, then clear the task and rerun; idempotent tasks make that safe.</li>
        <li><strong>Prevent:</strong> retries with backoff for transient errors, timeouts so hung tasks fail fast, sensors to wait for upstream data instead of failing on it, alerts to the on-call channel, and an SLA that pages before 9am, not after.</li>
        <li><strong>Postmortem:</strong> a short write-up of the root cause and the fix, so the same failure does not recur.</li>
      </ol>`,
      answer: `<p>First, triage: read the logs, find the failed task and the error, whether upstream data arrived late, a schema change, a warehouse timeout or an expired credential, and list which downstream tables and dashboards depend on it. Second, protect the readers: notify the dashboard owners with a heads up and show a stale-data banner with the last good date, because leadership unknowingly acting on yesterday's number is worse than a visible delay. If only part of the input arrived, the job must fail loudly rather than publish a partial day: stale but correct beats fresh but wrong.</p>
      <p>Then fix the cause and rerun by clearing the failed task; because tasks are idempotent, rerunning is safe and produces no duplicates. Once the data is correct, remove the banner and confirm with the owners.</p>
      <p>To prevent a repeat, I would add retries with backoff for transient errors, timeouts so hung tasks fail fast, sensors that wait for upstream data instead of failing when it is late, alerts to an on-call channel, and an SLA that fires early enough to fix things before 9am. Finally, a short postmortem with the root cause and the change made.</p>`
    },
    {
      id: 'pl-m5',
      difficulty: 'medium',
      prompt: 'Finance says collections through Khatabook QR in the warehouse do not match the <strong>payment gateway\'s settlement report</strong>. How do you build a reconciliation?',
      hint: 'Same transactions, different clocks and different definitions. Match on a reference, classify the breaks, automate.',
      concepts: [
        { label: 'Understand timing: transaction time versus settlement date (T+1), and cut-offs', any: ['settlement date', 't+1', 'cut off'], required: true },
        { label: 'Match row by row on a shared reference: gateway transaction id or UTR', any: ['utr', 'reference id', 'gateway transaction id'], required: true },
        { label: 'Classify breaks: missing on either side, amount mismatch, status mismatch, duplicates', any: ['missing on', 'amount mismatch', 'status mismatch'], required: true },
        { label: 'Account for refunds, reversals, fees and chargebacks', any: ['refund', 'reversal', 'chargeback', 'fee'], required: true },
        { label: 'Compare control totals within a tolerance', any: ['control total', 'tolerance'], required: true },
        { label: 'Automate daily, track ageing of unresolved breaks, with a finance owner', any: ['ageing', 'aging', 'automat', 'owner'], required: true },
        { label: 'Watch timezones: UTC storage versus IST business days', any: ['timezone', 'ist', 'utc'] }
      ],
      approach: `<p>Reconciliation with finance is a named responsibility in Khatabook analyst job posts. Show a repeatable process, not a one-off investigation.</p>
      <ol>
        <li><strong>Understand both sources:</strong> the warehouse records a payment at transaction time; the gateway reports by settlement date, often T+1, with its own cut-off. Totals for "Monday" can legitimately differ.</li>
        <li><strong>Match on a reference,</strong> the gateway transaction id or UTR, with a full outer join so unmatched rows on either side surface.</li>
        <li><strong>Classify breaks:</strong> missing on our side (webhook lost), missing on theirs (not settled yet), amount mismatch, status mismatch (success for us, failed for them), and duplicates.</li>
        <li><strong>Known adjustments:</strong> refunds, reversals, gateway fees or MDR netted off, and chargebacks. Model them explicitly instead of treating them as noise.</li>
        <li><strong>Control totals</strong> on count and amount per day within an agreed tolerance as a headline check.</li>
        <li><strong>Timezones:</strong> storage in UTC versus IST business days shifts late-evening payments across days.</li>
        <li><strong>Automate:</strong> run daily, publish a breaks table with ageing, and give each break category an owner in finance or engineering.</li>
      </ol>`,
      answer: `<p>I would start by understanding the two sources. The warehouse records a QR payment at transaction time, while the gateway reports by settlement date, usually T+1 with its own cut off, so daily totals can differ even when nothing is wrong. Timezones matter too: if we store UTC but report IST days, late-evening payments shift across dates.</p>
      <p>Then I would reconcile row by row rather than comparing totals: a full outer join on the gateway transaction id or UTR, so unmatched rows on either side appear. Each break gets classified: missing on our side, often a lost webhook; missing on theirs, often not settled yet; amount mismatch; status mismatch, such as success for us and failed for them; and duplicates. Known adjustments are modelled explicitly: refunds, reversals, gateway fees netted off the settlement, and chargebacks.</p>
      <p>On top of that, a control total check on count and amount per day within an agreed tolerance gives finance a headline. Finally I would automate it to run daily, publish a breaks table with ageing so old unresolved breaks stand out, and assign each break category an owner in finance or engineering, so reconciliation becomes a routine control rather than a monthly fire drill.</p>`
    },

    /* ---------------------------- HARD ---------------------------- */
    {
      id: 'pl-h1',
      difficulty: 'hard',
      prompt: 'Design the pipeline and warehouse tables for a <strong>merchant ledger</strong> where entries are created offline on the phone, synced later, and can be edited or deleted. Leadership wants daily outstanding receivables per merchant.',
      hint: 'Keep every version, build current state from it, separate device time from server time, and snapshot the balance.',
      concepts: [
        { label: 'Ingest every change with CDC or an append-only change log, including updates and deletes', any: ['cdc', 'change data capture', 'change log'], required: true },
        { label: 'Keep raw history immutable so you can replay', any: ['immutable', 'replay'], required: true },
        { label: 'Build current state by taking the latest version per entry_id', any: ['latest version', 'row_number', 'current state'], required: true },
        { label: 'Separate device event time from server sync time; device clocks can be wrong', any: ['device clock', 'server time', 'sync time'], required: true },
        { label: 'Model edits and soft deletes as versions and flags', any: ['soft delete', 'version'], required: true },
        { label: 'Daily balance snapshot fact per merchant for outstanding receivables', any: ['snapshot', 'outstanding'], required: true },
        { label: 'Lookback and restatement for late syncs', any: ['lookback', 'restat'], required: true },
        { label: 'Tests and reconciliation: balances equal the sum of entries', any: ['sum of entries', 'reconcil'], required: true }
      ],
      approach: `<p>This is Khatabook's own data model in miniature. Interviewers want history, correctness under late data, and a balance that can be trusted.</p>
      <ol>
        <li><strong>Ingest:</strong> CDC from the app database (or an append-only change log from the sync service) so every insert, edit and delete arrives as an event with the server sync time.</li>
        <li><strong>Raw layer:</strong> immutable history of every version. If a parsing bug corrupts a curated table, you replay from here.</li>
        <li><strong>Current state:</strong> <code>int_ledger_entries_current</code>, the latest version per entry_id using ROW_NUMBER over sync time, with is_deleted carried as a flag.</li>
        <li><strong>Two clocks:</strong> created_at is device time, which is when the business event happened but can be wrong if the phone clock is off; synced_at is server time and drives incremental loads. Business reporting uses created_at, clamped or flagged when it is in the future or implausibly old.</li>
        <li><strong>Edits and deletes:</strong> each edit is a new version; soft deletes are versions with is_deleted true. Never mutate history in place.</li>
        <li><strong>Balance:</strong> <code>fct_merchant_receivables_daily</code>, a periodic snapshot with one row per merchant per day holding outstanding receivables (credit given minus payments received to date). Balances are semi-additive: sum across merchants, never across days.</li>
        <li><strong>Late data:</strong> an entry for Monday synced on Thursday changes Monday's to Wednesday's balances, so rebuild the last N days nightly with N set from the observed sync-lag distribution, and publish a restatement policy.</li>
        <li><strong>Trust:</strong> tests that each snapshot's balance equals the sum of entries to date, uniqueness on merchant and date, and reconciliation against the balance the app shows the merchant.</li>
      </ol>`,
      answer: `<p>I would ingest with CDC from the app database, or an append-only change log from the sync service, so every insert, edit and delete arrives as an event stamped with server sync time. The raw layer keeps that history immutable, which means any curated table can be rebuilt by replay if logic changes or a bug is found.</p>
      <p>From the raw history I would build a current state model: the latest version per entry_id using ROW_NUMBER ordered by sync time, carrying is_deleted as a soft delete flag rather than dropping rows. Edits are simply new versions; nothing is mutated in place. There are two clocks to keep apart. Device time, created_at, is when the business event happened and drives reporting, but device clocks can be wrong, so future or implausibly old values are flagged. Server time, the sync time, drives incremental processing.</p>
      <p>For leadership's question I would build a daily periodic snapshot fact with one row per merchant per day holding outstanding receivables, credit given minus payments received to date. It is semi-additive: summing across merchants is fine, summing across days is not. Because an entry dated Monday can sync on Thursday, the nightly job rebuilds a lookback window of recent days sized from the observed sync lag, and older changes follow a published restatement policy.</p>
      <p>To make the balance trustworthy I would test that each snapshot equals the sum of entries to date, that merchant and date is unique, and reconcile a sample against the balance the app shows the merchant, since that is the number the merchant sees.</p>`
    },
    {
      id: 'pl-h2',
      difficulty: 'hard',
      prompt: 'You are setting up ingestion from the production Postgres database into the warehouse with a tool like Airbyte. Compare <strong>query-based batch extraction with log-based CDC</strong>, and explain what can go wrong with each.',
      hint: 'What does each method see when a row is deleted? And who pays for the reads?',
      concepts: [
        { label: 'Batch extraction queries rows by updated_at: simple but misses hard deletes and depends on updated_at being maintained', any: ['updated at', 'hard delete'], required: true },
        { label: 'Log-based CDC reads the WAL or binlog and captures every change, including deletes', any: ['wal', 'binlog', 'log based'], required: true },
        { label: 'Protect production: read from a replica, watch replication slot growth', any: ['replica', 'replication slot'], required: true },
        { label: 'Handle schema drift: new, renamed or retyped columns', any: ['schema drift', 'renamed', 'new column'], required: true },
        { label: 'Initial snapshot then stream; dedupe by primary key and log position', any: ['initial snapshot', 'log position', 'lsn', 'dedup'], required: true },
        { label: 'Monitor sync lag and reconcile row counts with the source', any: ['sync lag', 'row count', 'reconcil'], required: true }
      ],
      approach: `<p>Compare on completeness, load on the source and operational risk.</p>
      <ol>
        <li><strong>Query-based batch:</strong> select rows where updated_at is above the last watermark. Simple and works anywhere, but it misses hard deletes entirely, misses rows whose updated_at is not maintained by the application, and can miss rows committed late within a window.</li>
        <li><strong>Log-based CDC:</strong> reads the database's write-ahead log (Postgres WAL) or MySQL binlog, so it captures every insert, update and delete in order, with low latency and no heavy queries.</li>
        <li><strong>Source load:</strong> batch scans hit production, so read from a replica. CDC is light, but an unconsumed Postgres replication slot makes the WAL grow until disk fills, which is a production incident. Monitor it.</li>
        <li><strong>Schema drift:</strong> new columns, renamed columns and type changes upstream. Decide whether the tool propagates, ignores or fails on them, and keep a staging layer as a buffer.</li>
        <li><strong>Correctness:</strong> CDC starts with an initial snapshot then streams changes; at-least-once delivery means duplicates, so dedupe on primary key plus log position (LSN) and keep the latest.</li>
        <li><strong>Monitor:</strong> sync lag, row counts against the source and daily reconciliation of key tables.</li>
      </ol>`,
      answer: `<p>Query-based batch extraction selects rows where updated at is greater than the last watermark. It is simple and works on any database, but it has blind spots: a hard delete leaves no row to select, so deleted records live on in the warehouse; it depends on the application maintaining updated at on every change; and rows committed late inside a window can slip past. It also runs scans against the database, so it should read from a replica rather than the primary.</p>
      <p>Log-based CDC reads the write-ahead log, the WAL in Postgres or the binlog in MySQL, so it sees every insert, update and delete in commit order with low latency and very little query load. Its risks are operational: in Postgres, if the replication slot is not consumed, for example because the connector is down, the WAL keeps growing until the disk fills, so slot size needs an alert. CDC begins with an initial snapshot and then streams changes; delivery is usually at least once, so I would dedupe on primary key plus log position, the LSN, keeping the latest version.</p>
      <p>Both need a schema drift policy for new, renamed or retyped columns, deciding whether to propagate, ignore or fail, with a staging layer absorbing the change. And both need monitoring: sync lag, row counts compared with the source, and a daily reconciliation of key tables. For a ledger where edits and deletes matter, I would choose CDC.</p>`
    },
    {
      id: 'pl-h3',
      difficulty: 'hard',
      prompt: 'A dbt model that builds the daily merchant activity mart now takes <strong>two hours</strong> and keeps growing. How do you diagnose and fix it?',
      hint: 'Measure which step is slow, then reduce the data each run touches before tuning SQL.',
      concepts: [
        { label: 'Measure first: model timings, query plan, bytes scanned', any: ['query plan', 'bytes scanned', 'explain', 'timing'], required: true },
        { label: 'Make it incremental so each run processes only recent data', any: ['incremental'], required: true },
        { label: 'Partition and cluster the target and source so filters prune', any: ['partition', 'prun', 'cluster'], required: true },
        { label: 'Select only needed columns and pre-aggregate before joining', any: ['pre aggregate', 'before joining', 'needed columns'], required: true },
        { label: 'Fix materialisation: chains of views recomputed every run, materialise heavy intermediates', any: ['chain of views', 'materialis', 'ephemeral'], required: true },
        { label: 'Find fan-out joins and DISTINCT used to hide duplicates', any: ['fan out', 'distinct'], required: true },
        { label: 'Check skew and expensive window functions', any: ['skew', 'window function'] }
      ],
      approach: `<p>Measure, then cut the data touched, then tune.</p>
      <ol>
        <li><strong>Measure:</strong> dbt run timings show which model is slow; the query plan and bytes scanned show which step inside it dominates.</li>
        <li><strong>Incremental:</strong> a daily activity mart rarely needs to recompute three years every night. Make it incremental with a lookback, so each run touches days, not years.</li>
        <li><strong>Pruning:</strong> partition the target and sources by date and cluster by merchant_id, and make sure filters are written on the partition column directly so the engine can prune.</li>
        <li><strong>Less data:</strong> select needed columns instead of SELECT *, and pre-aggregate the large table to merchant-day before joining it to anything.</li>
        <li><strong>Materialisation:</strong> a chain of views upstream is recomputed inside this query every run; materialise heavy intermediate models as tables, and avoid ephemeral models for large logic.</li>
        <li><strong>Correctness smells:</strong> a fan out join multiplying rows, hidden with DISTINCT at the end, is both slow and fragile. Fix the join grain instead.</li>
        <li><strong>Engine specifics:</strong> skew on a few huge merchants, and window functions over very large partitions.</li>
      </ol>`,
      answer: `<p>I would measure before changing anything: dbt run timings to confirm which model is slow, then its query plan and bytes scanned to find the dominant step. The usual biggest win is making the model incremental: a daily activity mart rarely needs to recompute years of history every night, so processing only recent days with a lookback turns hours into minutes.</p>
      <p>Next I would make sure the engine reads as little as possible: partition the target and source tables by date, cluster by merchant_id, and write filters directly on the partition column so it can prune. Inside the SQL I would select only needed columns rather than SELECT *, and pre-aggregate the large entries table to merchant-day before joining it to dimensions. I would also check materialisation: if the model sits on a chain of views, every upstream view is recomputed inside this query each run, so heavy intermediate models should be materialised as tables, and large logic should not be ephemeral.</p>
      <p>I would look for correctness smells that are also performance problems, especially a fan out join multiplying rows and a DISTINCT at the end hiding it; fixing the join grain removes both the waste and the fragility. Finally, I would check for skew from a few very large merchants and expensive window functions over huge partitions, then re-measure and record the before and after runtime.</p>`
    },
    {
      id: 'pl-h4',
      difficulty: 'hard',
      prompt: 'The operations team builds a <strong>daily MIS report by hand in Excel</strong>, taking two people half a day. You are asked to automate it. Walk through how you do it end to end.',
      hint: 'Requirements and definitions first, a parallel run before switching, and a pipeline that refuses to publish bad data.',
      concepts: [
        { label: 'Gather requirements: who uses it, which decisions, exact metric definitions', any: ['requirement', 'who uses', 'definition'], required: true },
        { label: 'Build it as dbt models on certified sources', any: ['dbt', 'certified source'], required: true },
        { label: 'Schedule with Airflow after upstream loads, with dependencies', any: ['airflow', 'schedul'], required: true },
        { label: 'Quality checks gate publishing; fail loudly', any: ['quality check', 'gate', 'fail loudly'], required: true },
        { label: 'Run it in parallel with the manual report and reconcile differences before switching', any: ['parallel', 'side by side', 'reconcile'], required: true },
        { label: 'Deliver where users work: dashboard, email or Slack, and check adoption', any: ['slack', 'email', 'adoption'], required: true },
        { label: 'Document it, hand it over and measure time saved', any: ['document', 'time saved', 'hours saved'], required: true }
      ],
      approach: `<p>Reporting automation is in Khatabook's analyst job posts. The technical part is easy; the parallel run and the definitions are where these projects succeed or fail.</p>
      <ol>
        <li><strong>Requirements:</strong> who uses it, which decisions it drives, when they need it, and the exact definition of every number, including the manual adjustments people make in Excel without writing them down.</li>
        <li><strong>Build:</strong> dbt models on certified sources, one model per report section, with the hidden Excel logic made explicit and reviewed.</li>
        <li><strong>Schedule:</strong> an Airflow task that runs after upstream loads finish, using dependencies or sensors rather than a fixed clock time.</li>
        <li><strong>Quality gate:</strong> freshness, row count and control total checks that must pass before publishing. If they fail, fail loudly and send a delay notice rather than a wrong report.</li>
        <li><strong>Parallel run:</strong> two to three weeks side by side with the manual version. Reconcile every difference; most will be definition gaps rather than bugs.</li>
        <li><strong>Deliver:</strong> where users already work, such as a dashboard plus an email or Slack summary, and check adoption.</li>
        <li><strong>Close:</strong> documentation, an owner and runbook, then measure the time saved and report it.</li>
      </ol>`,
      answer: `<p>I would start with requirements: who uses the report, which decisions it drives, when they need it, and the exact definition of every number, including the manual adjustments people make in Excel without writing them down, because those hidden rules are where automation projects fail.</p>
      <p>Then I would build it as dbt models on certified sources, one model per section of the report, with the hidden Excel logic made explicit and reviewed. An Airflow task would schedule it to run once its upstream loads finish, using dependencies rather than a fixed clock time. Before anything is published, a quality check gate runs freshness, row count and control total tests; if any fail, the pipeline fails loudly and sends a delay notice instead of a wrong report.</p>
      <p>Before switching over, I would run the automated and manual versions in parallel, side by side, for two to three weeks and reconcile every difference, most of which will be definition gaps. Delivery goes where users already work, for example a dashboard plus a short email or Slack summary, and I would check adoption after the switch. Finally I would document the logic and runbook, hand over ownership clearly, and measure the time saved, in this case about two person half-days every day, which is the number that justifies the work.</p>`
    },
    {
      id: 'pl-h5',
      difficulty: 'hard',
      prompt: 'An engineering team <strong>renamed a column and added a new status value</strong> in the payments service. Several dashboards silently broke. Fix the immediate problem and design the process so it does not happen again.',
      hint: 'Lineage for the blast radius, then contracts, tests and CI so the break shows up before production.',
      concepts: [
        { label: 'Use lineage to find every affected model and dashboard', any: ['lineage', 'downstream', 'affected'], required: true },
        { label: 'Fix forward in staging and notify affected users', any: ['notify', 'fix forward', 'communicat'], required: true },
        { label: 'Agree data contracts with producing teams', any: ['data contract', 'contract'], required: true },
        { label: 'Source tests that detect schema changes and new enum values', any: ['accepted values', 'schema change', 'source test'], required: true },
        { label: 'CI: build and test changed models on every pull request (slim CI)', any: ['pull request', 'slim ci', 'slim build'], required: true },
        { label: 'Staging layer absorbs renames in one place', any: ['staging', 'one place'], required: true },
        { label: 'Clear owners and alerts', any: ['owner', 'alert', 'on call'] }
      ],
      approach: `<p>Two parts: contain the blast radius, then make silent breakage loud and early.</p>
      <ol>
        <li><strong>Immediate:</strong> use dbt lineage to list every downstream model and dashboard reading the column. Fix forward in the staging model, mapping the new column name back to the standard name and handling the new status explicitly. Notify affected users and restate any wrong days.</li>
        <li><strong>Why it was silent:</strong> a renamed column often becomes NULL rather than an error, and an unexpected status falls into an ELSE branch and disappears from totals.</li>
        <li><strong>Data contracts:</strong> agree with producing teams which fields are relied on, their types and allowed values, and that breaking changes need notice.</li>
        <li><strong>Source tests:</strong> accepted values on status, not null on critical columns, and schema change detection on sources, so a new enum value or missing column fails the build instead of silently shifting numbers.</li>
        <li><strong>CI:</strong> slim CI runs dbt build on changed models and their children on every pull request, catching breaks before merge.</li>
        <li><strong>Staging as buffer:</strong> because only staging touches sources, future renames are fixed in one place.</li>
        <li><strong>Ownership:</strong> named owners for key sources and alerts to an on-call channel.</li>
      </ol>`,
      answer: `<p>For the immediate problem I would use dbt lineage to list every downstream model and dashboard that reads the affected column, then fix forward in the staging model: map the renamed column back to our standard name and handle the new status value explicitly, deciding with the business whether it counts as success or failure. I would notify affected users, rebuild the impacted models and restate any days that were wrong. It was silent because a renamed column tends to arrive as NULL rather than raising an error, and a new status falls into an ELSE branch and quietly drops out of totals.</p>
      <p>To stop it recurring, I would agree data contracts with the producing team covering the fields we rely on, their types and allowed values, and a notice period for breaking changes. On our side, source tests would include accepted values on status, not null on critical columns and schema change detection, so a new enum value or missing column fails the build loudly instead of silently shifting numbers. CI would run a slim build of changed models and their children on every pull request, and the payments team could run our source tests in their own CI. Because only the staging layer reads sources, future renames are fixed in one place. Finally, each key source gets a named owner and alerts to an on-call channel.</p>`
    }
  ]
});
