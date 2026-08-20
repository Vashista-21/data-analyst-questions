/* Data partitioning: the second area HR flagged for the Navi loop. Covers the
   window-function versus table-partition confusion interviewers use as a filter,
   pruning, partition key choice, skew, incremental loads and repartitioning. */
DAQ.registerTopic({
  id: 'data-partitioning',
  group: 'prep',
  name: 'Data Partitioning',
  icon: '\uD83E\uDDE9',
  blurb: 'Partitioning for scale: pruning, choosing a partition key and granularity, range versus hash, small files, clustering, skew, incremental loads and partition overwrite, plus repartitioning a huge table safely.',
  questions: [
    /* ---------------------------- EASY ---------------------------- */
    {
      id: 'dp-e1',
      difficulty: 'easy',
      prompt: 'What is <strong>table partitioning</strong> and why does it matter? How is it different from an index?',
      hint: 'One lets the engine skip reading data entirely; the other helps it find rows within what it reads.',
      concepts: [
        { label: 'Partitioning splits one logical table into physical segments by a key', any: ['split', 'divide', 'segment', 'physical', 'sub table', 'chunk', 'logical table'], required: true },
        { label: 'Queries filtering on the partition key skip irrelevant partitions', any: ['skip', 'prune', 'only read', 'avoid scanning', 'less data', 'eliminat'], required: true },
        { label: 'Less data scanned means faster and cheaper queries', any: ['faster', 'cheaper', 'cost', 'performance', 'less i/o', 'scan less'], required: true },
        { label: 'Partitions can be dropped or reloaded independently for maintenance', any: ['drop', 'reload', 'maintenance', 'retention', 'delete old', 'independent', 'archive'], required: true },
        { label: 'An index helps locate rows inside data that is still read', any: ['index', 'lookup', 'locate', 'pointer', 'seek', 'within'], required: true },
        { label: 'Partitioning is coarse-grained physical layout, indexing is a fine-grained structure', any: ['coarse', 'fine', 'layout', 'structure', 'complement', 'both'], required: true },
        { label: 'Partitioning only helps if queries filter on the partition key', any: ['only if', 'must filter', 'depends on the query', 'no benefit', 'wrong key'] }
      ],
      approach: `<p>Define it, then justify it with the two benefits, then draw the distinction from indexing clearly, because interviewers use that as the discriminating follow-up.</p>
      <ol>
        <li><strong>What it is:</strong> one logical table stored as several physical segments chosen by a partition key, most often a date. Queries still address the table normally.</li>
        <li><strong>Benefit one, pruning:</strong> a query filtered to last week reads only those partitions. On a five-year transactions table that is a hundredfold reduction in data scanned, which on a per-byte engine is also a hundredfold cost reduction.</li>
        <li><strong>Benefit two, maintenance:</strong> partitions are independent units. Deleting last year is a metadata drop instead of a giant DELETE; reloading a single bad day means overwriting one partition rather than rebuilding the table.</li>
        <li><strong>Versus an index:</strong> an index is a lookup structure that helps find specific rows within data the engine still has to consider, and it costs storage plus write overhead to maintain. Partitioning changes the physical layout so entire ranges of data are never touched at all.</li>
        <li><strong>They are complements.</strong> Partition by date to cut the search space to a day, then index or cluster within it to find one customer quickly.</li>
        <li><strong>The catch:</strong> partitioning only pays off when queries filter on the partition key. A table partitioned by date, queried only by customer id, scans everything and you have added complexity for nothing.</li>
      </ol>`,
      answer: `<p>Partitioning stores one logical table as multiple physical segments divided by a partition key, usually a date. Consumers query the table as normal, but the engine can skip whole partitions that cannot match the filter, which is called partition pruning. On a table holding several years of transactions, a query restricted to one week reads a tiny fraction of the data, so it is dramatically faster and, on engines that bill by bytes scanned, dramatically cheaper.</p>
      <p>The second benefit is maintenance. Partitions are independent units, so enforcing retention means dropping a partition as a metadata operation rather than running an enormous DELETE, and fixing a bad day means overwriting one partition rather than rebuilding the whole table.</p>
      <p>An index is a different tool: it is an auxiliary structure that helps the engine locate specific rows inside data it is still reading, and it costs storage and write overhead to keep current. Partitioning is coarse-grained physical organisation that avoids reading data at all; indexing is fine-grained navigation within what is read. They work together, so you might partition by date to narrow to a day and then cluster or index on customer to find one account inside it. The important caveat is that partitioning only helps queries that filter on the partition key, so choosing a key nobody filters on adds complexity with no benefit.</p>`
    },
    {
      id: 'dp-e2',
      difficulty: 'easy',
      prompt: 'A candidate says "I use partitioning all the time, like PARTITION BY in my window functions." Is that the same thing? Explain the difference.',
      hint: 'Same word, completely different layer: one is query logic, the other is storage.',
      concepts: [
        { label: 'They are unrelated concepts that share a keyword', any: ['not the same', 'different', 'unrelated', 'confus', 'coincidence', 'same word'], required: true },
        { label: 'PARTITION BY in a window function is a logical grouping inside a query', any: ['window', 'logical', 'group', 'within the query', 'over', 'row level'], required: true },
        { label: 'Table partitioning is physical storage organisation', any: ['physical', 'storage', 'on disk', 'file', 'layout', 'segment'], required: true },
        { label: 'Window PARTITION BY does not reduce data scanned', any: ['does not reduce', 'no pruning', 'still reads', 'no performance', 'same data'], required: true },
        { label: 'Table partitioning enables pruning and cheaper queries', any: ['prune', 'skip', 'less data', 'faster', 'cheaper', 'performance'], required: true },
        { label: 'Table partitioning is defined in DDL, window partitioning in the SELECT', any: ['ddl', 'create table', 'defined in the query', 'select', 'schema', 'design time'], required: true }
      ],
      approach: `<p>Say clearly that they are unrelated, then define each in its own layer, then explain why the confusion has practical consequences.</p>
      <ol>
        <li><strong>Not the same thing at all.</strong> They share a keyword and nothing else, and interviewers use this question specifically to see whether a candidate has only ever written SQL or has also designed storage.</li>
        <li><strong>Window PARTITION BY:</strong> a logical instruction inside a single query, telling a window function which group each row belongs to when computing a rank or running total. It exists only for the duration of that query and does not change how anything is stored.</li>
        <li><strong>Table partitioning:</strong> a physical property declared when the table is created, deciding which files or segments rows are written into. It persists, affects every query, and is what enables the engine to skip data.</li>
        <li><strong>Performance:</strong> a window PARTITION BY does not reduce the data read; it may even add a sort or shuffle. Table partitioning is precisely the thing that reduces data read.</li>
        <li><strong>Where each lives:</strong> table partitioning is in the DDL and is a design decision that is expensive to change later; window partitioning is in the SELECT and is free to change per query.</li>
        <li><strong>One honest link:</strong> if a window function partitions by the same column the table is partitioned on, the engine may parallelise more neatly. That is a side effect, not the same feature.</li>
      </ol>`,
      answer: `<p>No, they are unrelated concepts that unfortunately share a keyword. <code>PARTITION BY</code> inside a window function is logical grouping within a single query: it tells the window function which rows form each group when calculating a rank, running total or lag. It exists only while that query runs and changes nothing about storage.</p>
      <p>Table partitioning is physical. It is declared in the DDL and determines which files or storage segments rows are written into, typically by date. It persists, affects every query against the table, and is what allows the engine to prune, meaning skip entire partitions that cannot satisfy the filter and therefore read far less data.</p>
      <p>The practical difference is performance. A window <code>PARTITION BY</code> does not reduce the volume scanned and may add a sort or shuffle on top. Table partitioning is exactly the mechanism that reduces the volume scanned and hence runtime and cost. There is one incidental connection: if a window function partitions on the same column the table is physically partitioned by, the engine may parallelise more cleanly because related rows are already co-located. That is a side benefit rather than the same feature, and confusing the two is a signal that someone has written a lot of SQL but never designed a table for scale.</p>`
    },
    {
      id: 'dp-e3',
      difficulty: 'easy',
      prompt: 'Distinguish <strong>horizontal and vertical partitioning</strong>, and both from <strong>sharding</strong>.',
      hint: 'Rows versus columns, and then whether the pieces live on different machines.',
      concepts: [
        { label: 'Horizontal partitioning splits rows into subsets with the same columns', any: ['horizontal', 'rows', 'row wise', 'subset of rows', 'same column'], required: true },
        { label: 'Vertical partitioning splits columns across tables sharing a key', any: ['vertical', 'column', 'split columns', 'fewer column', 'same key'], required: true },
        { label: 'Sharding distributes partitions across separate nodes or databases', any: ['shard', 'across node', 'different server', 'distribut', 'separate database', 'machine'], required: true },
        { label: 'Horizontal partitioning is the common case in analytics, usually by date', any: ['date', 'common', 'usually', 'analytic', 'time based', 'most'], required: true },
        { label: 'Vertical partitioning helps when only some columns are queried or are sensitive', any: ['wide table', 'rarely used column', 'sensitive', 'pii', 'hot column', 'cold'], required: true },
        { label: 'Sharding targets scale beyond one machine and adds cross-shard complexity', any: ['scale', 'beyond one', 'cross shard', 'complex', 'join across', 'capacity'], required: true },
        { label: 'Columnar storage already gives much of the vertical benefit automatically', any: ['columnar', 'column store', 'parquet', 'already', 'automatic'] }
      ],
      approach: `<p>Rows, columns, machines. Give the analytics-relevant note for each.</p>
      <ol>
        <li><strong>Horizontal:</strong> split by rows. Every partition has the same columns but holds a subset of records, such as one partition per day. This is what "partitioning" almost always means in an analytics context.</li>
        <li><strong>Vertical:</strong> split by columns. One table becomes two joined on the key, for instance frequently queried numeric columns in one and a large JSON blob or sensitive PII columns in another. It reduces the width read and lets sensitive columns be permissioned separately.</li>
        <li><strong>Sharding:</strong> horizontal partitioning where the partitions live on different nodes or database instances. The motivation is capacity: a single machine cannot hold the data or serve the traffic.</li>
        <li><strong>Trade-off on sharding:</strong> queries spanning shards need a coordinator, cross-shard joins and transactions get expensive, and rebalancing when a shard grows hot is genuinely hard. Analysts usually meet sharding as the reason a source system cannot answer a simple aggregate query.</li>
        <li><strong>Modern nuance:</strong> in a columnar warehouse, vertical partitioning is largely unnecessary because the format already reads only the requested columns. It survives for permission boundaries and for isolating very large payload columns.</li>
      </ol>`,
      answer: `<p>Horizontal partitioning splits a table by rows: every partition keeps the same columns but holds a subset of records, such as one partition per transaction date. That is what partitioning normally means in analytics. Vertical partitioning splits by columns: one table becomes two joined on a shared key, for example keeping frequently queried numeric columns apart from a bulky JSON payload or from sensitive PII, which reduces the width read and allows separate access control.</p>
      <p>Sharding is horizontal partitioning where the pieces live on different nodes or database instances. The driver is scale beyond a single machine, whether in storage or in throughput. The cost is complexity: queries that span shards need coordination, cross-shard joins and transactions become expensive, and rebalancing a shard that grows hot is a hard operational problem. Analysts most often encounter it as the reason a production system cannot serve a simple portfolio-wide aggregate.</p>
      <p>One modern nuance: in a columnar warehouse using a format like Parquet, vertical partitioning is largely redundant, since the storage engine already reads only the requested columns. It persists mainly for permission boundaries and for isolating very large payload columns from otherwise narrow tables.</p>`
    },
    {
      id: 'dp-e4',
      difficulty: 'easy',
      prompt: 'A table is partitioned by <code>dt</code> (as YYYYMMDD), but a colleague query still scans everything. Give the likely reasons <strong>pruning fails</strong> and how you would write it instead.',
      hint: 'Anything that stops the engine evaluating the partition filter before reading also stops pruning.',
      concepts: [
        { label: 'Wrapping the partition column in a function prevents pruning', any: ['function', 'cast', 'date(', 'substr', 'wrap', 'convert', 'expression on'], required: true },
        { label: 'Filtering on a different column than the partition key gives no pruning', any: ['different column', 'not the partition', 'other column', 'timestamp column', 'wrong column'], required: true },
        { label: 'Comparing a string partition to a non-matching type or format breaks it', any: ['type', 'string', 'format', 'mismatch', 'implicit', 'yyyymmdd'], required: true },
        { label: 'A filter applied after a join or in the outer query may not push down', any: ['push down', 'after the join', 'outer query', 'subquery', 'not pushed', 'view'], required: true },
        { label: 'Non-deterministic or dynamic predicates can prevent static pruning', any: ['non determin', 'dynamic', 'subquery in the filter', 'current_date', 'variable', 'runtime'], required: true },
        { label: 'Write a literal range filter directly on the partition column', any: ['literal', 'between', 'range', 'directly on dt', 'dt >=', 'explicit'], required: true },
        { label: 'Verify with EXPLAIN or the bytes-scanned metric', any: ['explain', 'plan', 'bytes scanned', 'verify', 'check', 'partitions read'], required: true }
      ],
      approach: `<p>List the causes in likelihood order, give the rewrite, then insist on verifying rather than assuming.</p>
      <ol>
        <li><strong>A function on the partition column.</strong> <code>WHERE CAST(dt AS DATE) = '2026-08-01'</code> or <code>SUBSTR(dt, 1, 6) = '202608'</code> forces the engine to evaluate every partition value, so it reads everything. Filter on the raw column instead.</li>
        <li><strong>Filtering a different column.</strong> Using <code>WHERE txn_timestamp &gt;= ...</code> when the table is partitioned on <code>dt</code> gives the engine nothing to prune with, even though the two are semantically related. Filter on <code>dt</code> as well, or on both.</li>
        <li><strong>Type or format mismatch.</strong> If <code>dt</code> is a string of YYYYMMDD, comparing it to a date literal or to <code>'2026-08-01'</code> either fails to prune or silently matches nothing. Compare in the same format: <code>dt BETWEEN '20260801' AND '20260807'</code>.</li>
        <li><strong>Predicate placement.</strong> A filter applied in an outer query, after a join, or on top of a view or CTE may not be pushed down to the scan on some engines. Put the partition filter in the innermost scan of the partitioned table.</li>
        <li><strong>Dynamic predicates.</strong> A filter derived from a subquery, or a non-deterministic expression, can prevent static pruning because the value is unknown at planning time. Materialise the bound first or pass in a literal.</li>
        <li><strong>The rewrite:</strong> a literal range directly on the partition column, then check the plan. Run EXPLAIN or look at bytes scanned or partitions read before and after, because pruning is easy to believe in and easy to lose.</li>
      </ol>`,
      answer: `<p>The most common cause is a function or cast applied to the partition column: something like <code>CAST(dt AS DATE) = '2026-08-01'</code> or <code>SUBSTR(dt,1,6) = '202608'</code> forces the engine to compute an expression for every partition, so it cannot eliminate any of them. The second is filtering on a different column, such as the event timestamp, when the table is partitioned on <code>dt</code>; the two are semantically linked but the planner cannot exploit that, so a filter on <code>dt</code> must be present too. The third is a type or format mismatch, comparing a YYYYMMDD string partition against a date literal or a hyphenated string, which either scans everything or quietly returns nothing.</p>
      <p>Beyond the predicate itself, placement matters: a filter sitting in an outer query, applied after a join, or layered over a view or CTE may not be pushed down to the scan on some engines, so the partition filter belongs in the innermost scan of the partitioned table. And a predicate whose value comes from a subquery or a non-deterministic expression can defeat static pruning because the planner does not know the value at plan time, in which case I would resolve the bound first and pass a literal.</p>
      <p>So I would rewrite it as an explicit literal range on the partition column, for example <code>WHERE dt BETWEEN '20260801' AND '20260807'</code>, keeping any timestamp filter as an additional condition rather than a replacement. Then I would verify with EXPLAIN or by comparing bytes scanned and partitions read before and after, since pruning is easy to assume and easy to lose to a small rewrite.</p>`
    },
    {
      id: 'dp-e5',
      difficulty: 'easy',
      prompt: 'How do you <strong>choose a partition key and granularity</strong> for a large transactions table? What makes a bad choice?',
      hint: 'The key should match how the data is queried and how it is loaded, and produce partitions of a sensible size.',
      concepts: [
        { label: 'Choose the column that most queries filter on, usually a date', any: ['most queries', 'filter on', 'date', 'query pattern', 'access pattern', 'commonly used'], required: true },
        { label: 'Align with how data is loaded so incremental writes touch few partitions', any: ['load', 'incremental', 'write pattern', 'daily batch', 'ingest', 'append'], required: true },
        { label: 'Target a sensible partition size, not too many tiny partitions', any: ['size', 'too many', 'tiny', 'small file', 'granular', 'hundreds of mb', 'balance'], required: true },
        { label: 'Avoid very high cardinality keys such as customer or transaction id', any: ['high cardinal', 'customer id', 'user id', 'unique', 'too many partition', 'transaction id'], required: true },
        { label: 'Avoid keys with severe skew that create hot partitions', any: ['skew', 'hot', 'uneven', 'imbalance', 'one big partition'], required: true },
        { label: 'Avoid mutable columns, since changing the value moves the row', any: ['mutable', 'changes', 'update', 'status', 'moves the row', 'immutable'], required: true },
        { label: 'Consider a secondary key such as country or product only if it is always filtered', any: ['second', 'sub partition', 'composite', 'nested', 'country', 'two level'], required: true }
      ],
      approach: `<p>Three criteria, then the anti-patterns, which is where the marks are.</p>
      <ol>
        <li><strong>Match the query pattern.</strong> Partition on what filters appear in nearly every query. For transactions that is almost always the event date, since analysts, dashboards and pipelines all bound by time.</li>
        <li><strong>Match the load pattern.</strong> A daily batch writing into a date partition touches exactly one partition, which keeps loads cheap and idempotent. Partitioning by something orthogonal to how you load means every run rewrites many partitions.</li>
        <li><strong>Size sensibly.</strong> Aim for partitions large enough to be efficient, on the order of hundreds of megabytes to a few gigabytes on most engines. Daily works for high volume, monthly for lower volume; hourly on a small table produces thousands of tiny files and makes queries slower, not faster.</li>
        <li><strong>Anti-pattern one, high cardinality:</strong> partitioning by customer id or transaction id creates millions of partitions. Metadata operations dominate, planning slows to a crawl and some engines simply fail.</li>
        <li><strong>Anti-pattern two, skew:</strong> a key where one value holds most of the data, such as country in a business that is 95% domestic, gives you one enormous partition and many empty ones, so pruning helps almost nobody.</li>
        <li><strong>Anti-pattern three, mutability:</strong> partitioning on something that changes, like loan status, means a status update physically moves the row between partitions. Partition keys should be immutable facts such as the date an event occurred.</li>
        <li><strong>Sub-partitioning:</strong> only add a second level, for example date then country, when queries reliably filter on both. Otherwise use clustering within the date partition instead of another partition level.</li>
      </ol>`,
      answer: `<p>I would pick the key on three criteria. First, the query pattern: partition on the column nearly every query filters on, which for a transactions table is almost always the event date. Second, the load pattern: a daily batch should write into a single partition, which keeps ingestion cheap and makes reruns idempotent. Third, resulting size: partitions want to be large enough to be efficient, roughly hundreds of megabytes to a few gigabytes each, so daily suits high volume while monthly suits a smaller table.</p>
      <p>The bad choices are more instructive. A high-cardinality key such as customer id or transaction id creates millions of partitions, so metadata and planning costs dominate and some engines fail outright. A skewed key, like country in a business that is overwhelmingly domestic, produces one enormous partition and many trivial ones, so pruning buys almost nothing for most queries. And a mutable column such as loan status is wrong in principle, because updating the status physically relocates the row between partitions; partition keys should be immutable facts like the date the event occurred.</p>
      <p>Granularity that is too fine is its own failure: hourly partitions on a modest table generate thousands of small files, and the overhead of opening them can make queries slower than no partitioning at all. If queries genuinely always filter on a second dimension, a two-level scheme such as date then country can help, but otherwise I would keep one partition level and use clustering or sorting within the partition instead.</p>`
    },

    /* --------------------------- MEDIUM --------------------------- */
    {
      id: 'dp-m1',
      difficulty: 'medium',
      prompt: 'Compare <strong>range, list and hash partitioning</strong>. Give a case where hash partitioning is the right answer and explain what you give up.',
      hint: 'Hash spreads data evenly but destroys any notion of order.',
      concepts: [
        { label: 'Range partitioning splits by ordered intervals, typically dates', any: ['range', 'interval', 'date', 'ordered', 'between', 'time'], required: true },
        { label: 'List partitioning assigns explicit discrete values to partitions', any: ['list', 'discrete', 'explicit', 'enumerated', 'category', 'region'], required: true },
        { label: 'Hash partitioning distributes rows by a hash of the key', any: ['hash', 'modulo', 'evenly', 'distribut', 'bucket'], required: true },
        { label: 'Hash gives even distribution and avoids hot partitions', any: ['even', 'balanced', 'avoid skew', 'uniform', 'no hot'], required: true },
        { label: 'Hash loses range pruning: you cannot skip partitions for a range query', any: ['lose', 'cannot prune', 'no range', 'all partitions', 'scan everything', 'point lookup only'], required: true },
        { label: 'Hash suits high-cardinality keys used for equality lookups and joins', any: ['equality', 'point lookup', 'join key', 'high cardinal', 'customer id', 'distribut key'], required: true },
        { label: 'Range suits time-series data and retention by dropping old partitions', any: ['time series', 'retention', 'drop old', 'archive', 'chronolog'], required: true },
        { label: 'Composite schemes combine range with hash or list sub-partitions', any: ['composite', 'combine', 'sub partition', 'both', 'two level'] }
      ],
      approach: `<p>Define the three, then answer the "when is hash right" question properly, since that is where candidates usually generalise badly.</p>
      <ol>
        <li><strong>Range:</strong> ordered intervals, such as one partition per day or month. The default for anything time-series, because it prunes range filters and makes retention a partition drop.</li>
        <li><strong>List:</strong> explicit values per partition, such as one per country or product line. Useful when the set is small, stable and always filtered on, and when you want physical separation for residency or access reasons.</li>
        <li><strong>Hash:</strong> a hash of the key modulo N buckets. It cares nothing for meaning, only even distribution.</li>
        <li><strong>Where hash is right:</strong> distributing a huge table by a high-cardinality key that is used for equality lookups and joins, typically customer id. It guarantees balanced partitions, avoids the hot partition a skewed list scheme would create, and, crucially in a distributed engine, co-locates rows with the same key so a join on that key needs no shuffle.</li>
        <li><strong>What you give up:</strong> range pruning. "Give me last week" has to touch every hash bucket, because neighbouring dates land in unrelated buckets. You also lose cheap retention, since deleting old data becomes a row-level DELETE rather than dropping a partition, and changing the bucket count usually forces a full rewrite.</li>
        <li><strong>The usual answer in practice</strong> is composite: range partition by date for pruning and retention, then hash or cluster by customer id within the partition for lookup and join performance. That captures both benefits, and saying so is what distinguishes a real design answer.</li>
      </ol>`,
      answer: `<p>Range partitioning divides data into ordered intervals, almost always dates, and is the default for time-series tables because it prunes range filters efficiently and makes retention as cheap as dropping a partition. List partitioning assigns explicit discrete values to partitions, such as one per country or product, and works when the value set is small, stable and reliably filtered on. Hash partitioning applies a hash function to the key and distributes rows across a fixed number of buckets, caring only about even spread.</p>
      <p>Hash is the right answer when the natural key is high cardinality and used for equality lookups and joins rather than ranges, most commonly customer id on a very large table. It guarantees balanced partitions where a list scheme would create a hot one, and in a distributed engine it co-locates all rows for a given key, so a join on that key can run locally instead of triggering a shuffle across the cluster.</p>
      <p>What you give up is range pruning and cheap lifecycle management. A query for last week must touch every bucket, because consecutive dates hash to unrelated places, so time-based analytics gets worse rather than better. Retention becomes a row-level delete instead of a partition drop, and changing the number of buckets generally means rewriting the entire table since every row rehashes.</p>
      <p>In practice the answer is usually composite: range partition by date to keep pruning and retention, then hash or cluster on customer id within each partition to get lookup and join locality. That combination is what most large production tables actually use.</p>`
    },
    {
      id: 'dp-m2',
      difficulty: 'medium',
      prompt: 'A team partitions an hourly by <code>customer_id</code> as well as date, and queries get slower. Explain the <strong>small files problem</strong> and how you would fix it.',
      hint: 'Every partition and every file carries fixed overhead, and thousands of tiny reads beat any pruning benefit.',
      concepts: [
        { label: 'Too many partitions creates huge numbers of tiny files', any: ['too many', 'tiny', 'small file', 'thousands', 'millions of file', 'over partition'], required: true },
        { label: 'Each file and partition has fixed metadata and open cost', any: ['overhead', 'metadata', 'open', 'fixed cost', 'per file', 'listing'], required: true },
        { label: 'Query planning slows because the metadata catalogue must be listed', any: ['planning', 'catalog', 'listing', 'metastore', 'plan time', 'enumerat'], required: true },
        { label: 'Columnar formats lose compression and statistics efficiency in tiny files', any: ['compression', 'statistic', 'row group', 'columnar', 'less efficient', 'parquet'], required: true },
        { label: 'Fix by reducing partition granularity and dropping the high-cardinality key', any: ['reduce granular', 'coarser', 'daily instead', 'remove customer', 'drop the key', 'fewer partition'], required: true },
        { label: 'Use clustering, bucketing or sorting within the partition instead', any: ['cluster', 'bucket', 'sort', 'within the partition', 'z order', 'instead of partition'], required: true },
        { label: 'Run compaction to merge small files into larger ones', any: ['compact', 'merge', 'optimize', 'rewrite', 'coalesce', 'consolidat'], required: true },
        { label: 'Control writer parallelism so each task writes fewer, larger files', any: ['writer', 'parallel', 'repartition before write', 'number of files', 'coalesce', 'task'] }
      ],
      approach: `<p>Explain the mechanics of the overhead, then give the structural fix and the operational fix. Emphasise that this is over-partitioning, not partitioning being bad.</p>
      <ol>
        <li><strong>Do the arithmetic.</strong> Hourly times customer id is 24 partitions a day multiplied by however many customers appear, so millions of partitions in a year, each holding a handful of rows in its own file.</li>
        <li><strong>Why that is slow:</strong> every file has a fixed cost to list, open and read a footer, and every partition adds metadata. With a million tiny files the engine spends nearly all its time on overhead and almost none reading data, so total runtime rises even though bytes scanned fell.</li>
        <li><strong>Planning cost:</strong> the catalogue or metastore has to enumerate matching partitions before the query even starts, and at millions of entries that step alone can dominate. It also strains the metastore for every other user.</li>
        <li><strong>Format cost:</strong> columnar formats rely on reasonably large row groups for compression and for min/max statistics that enable skipping. Tiny files compress poorly and their statistics stop being useful, so you lose the benefits the format was chosen for.</li>
        <li><strong>Structural fix:</strong> partition by date only, at daily granularity, and remove customer id as a partition key entirely. Then get customer lookup performance with clustering, bucketing or sorting inside the partition, which prunes at file or row-group level without multiplying partitions.</li>
        <li><strong>Operational fix:</strong> compact the existing mess by rewriting each partition into a few large files, and control writer parallelism so each run produces a handful of appropriately sized files rather than one per task. Then monitor average file size per partition as a standing health metric.</li>
      </ol>`,
      answer: `<p>Partitioning by hour and customer id multiplies out to an enormous number of partitions, twenty-four per day times every customer seen, so within a year there are millions of partitions each holding a few rows in its own small file. That is over-partitioning, and it makes queries slower for four separate reasons.</p>
      <p>Every file carries a fixed cost to list, open and read its footer, and every partition adds catalogue metadata, so with millions of tiny files the engine spends most of its time on overhead rather than on reading data. Query planning suffers before execution even begins, because the metastore has to enumerate matching partitions, and at that scale the listing step alone can dominate runtime while also degrading the metastore for everyone else. Columnar formats make it worse still: they depend on reasonably large row groups for compression and for the min/max statistics that let the engine skip data, and tiny files compress badly and produce statistics too granular to help.</p>
      <p>The structural fix is to partition by date alone, at daily granularity, and stop using customer id as a partition key. To keep customer lookups fast I would cluster, bucket or sort by customer id within each daily partition, which gives file-level and row-group-level skipping without multiplying partition count. Operationally I would compact the existing table by rewriting each partition into a small number of large files, and control writer parallelism, repartitioning or coalescing before write so each run emits a few appropriately sized files instead of one per task. Then I would track average file size and file count per partition as an ongoing health metric, since small files creep back in as ingestion patterns change.</p>`
    },
    {
      id: 'dp-m3',
      difficulty: 'medium',
      prompt: 'Explain <strong>bucketing or clustering</strong> and how it differs from partitioning. When would you use both together?',
      hint: 'Partitioning decides which folders exist; clustering decides how rows are arranged inside them.',
      concepts: [
        { label: 'Partitioning creates separate physical partitions with a directory or metadata entry each', any: ['separate', 'directory', 'folder', 'metadata', 'physical partition', 'discrete'], required: true },
        { label: 'Bucketing or clustering organises rows within a partition by a key', any: ['within', 'inside the partition', 'organis', 'organiz', 'sort', 'arrange', 'co locat'], required: true },
        { label: 'Clustering suits high-cardinality keys that would be terrible partition keys', any: ['high cardinal', 'customer id', 'too many', 'bad partition key', 'many distinct'], required: true },
        { label: 'It enables file or block level skipping using min max statistics', any: ['skip', 'min max', 'statistic', 'block', 'row group', 'file level', 'prune within'], required: true },
        { label: 'Bucketing on a join key allows joins without a shuffle', any: ['join', 'shuffle', 'co locat', 'sort merge', 'bucket join', 'same bucket'], required: true },
        { label: 'Common pattern: partition by date, cluster by customer or account', any: ['partition by date', 'cluster by customer', 'both', 'combine', 'typical'], required: true },
        { label: 'Clustering degrades as data is appended and needs periodic maintenance', any: ['degrad', 'maintenance', 're cluster', 'reorganis', 'reorganiz', 'optimize', 'over time'], required: true }
      ],
      approach: `<p>Frame it as two levels of the same idea: partitioning chooses what to read, clustering chooses how little of that you have to read.</p>
      <ol>
        <li><strong>Partitioning:</strong> a coarse split into physically separate units, each with its own directory or metadata entry. Pruning happens at partition level and is decided at planning time.</li>
        <li><strong>Bucketing or clustering:</strong> within a partition, rows are hashed into a fixed number of buckets or sorted by a key, so rows with similar values sit in the same file or block. It adds no partitions and no metadata explosion.</li>
        <li><strong>Why it exists:</strong> high-cardinality columns like customer id make terrible partition keys but excellent clustering keys. You get the lookup benefit without millions of partitions.</li>
        <li><strong>How the saving happens:</strong> columnar files store min/max statistics per file and row group. If data is clustered by customer id, a query for one customer touches a small number of blocks and the engine skips the rest, which is pruning one level below the partition.</li>
        <li><strong>Join benefit:</strong> if two tables are bucketed the same way on the join key, matching rows are already co-located, so the engine can do a sort-merge or bucket join without shuffling data across the cluster. On large joins that is often the single biggest win available.</li>
        <li><strong>The standard combination:</strong> partition by event date for pruning and retention, cluster by customer or account id for lookups and joins. That is what most large fact tables should look like.</li>
        <li><strong>The catch:</strong> clustering decays as new data lands out of order, so it needs periodic re-clustering or optimise operations, and bucket counts are awkward to change later since they usually imply a rewrite. Plan the bucket count against expected growth.</li>
      </ol>`,
      answer: `<p>Partitioning is a coarse physical split: each partition is a separate unit with its own directory or metadata entry, and pruning eliminates whole partitions at planning time. Bucketing or clustering works one level down, organising rows inside each partition by hashing them into a fixed number of buckets or sorting on a key so that similar values are physically adjacent. It creates no new partitions, so it adds no metadata overhead.</p>
      <p>That is exactly why it exists. High-cardinality columns such as customer id are terrible partition keys, since partitioning by them produces millions of tiny partitions, but they are ideal clustering keys. Because columnar formats keep min and max statistics per file and row group, clustered data lets the engine skip most blocks when filtering on that key, which is effectively pruning below the partition level. The other major benefit is joins: if two tables are bucketed identically on the join key, matching rows are already co-located, so the engine can join without shuffling data across the cluster, which is frequently the largest single performance gain on big joins.</p>
      <p>So the standard pattern is to use both: partition by event date for time pruning and cheap retention, and cluster or bucket by customer or account id for point lookups and joins. The caveat is maintenance. Clustering decays as new rows arrive out of order, so it needs periodic re-clustering or optimise runs, and the bucket count is difficult to change afterwards because rehashing implies rewriting the table, so it should be chosen with expected growth in mind.</p>`
    },
    {
      id: 'dp-m4',
      difficulty: 'medium',
      prompt: 'One partition takes ten times longer than the others and a job keeps failing on it. Explain <strong>data skew</strong> in a partitioned or distributed setting, and how you would fix it.',
      hint: 'Parallel work finishes when the slowest task finishes, so one fat key sets the runtime.',
      concepts: [
        { label: 'Skew means data is unevenly distributed across partitions or keys', any: ['skew', 'uneven', 'imbalance', 'hot', 'one key', 'not uniform'], required: true },
        { label: 'Total runtime is bound by the slowest task, so parallelism is wasted', any: ['slowest', 'straggler', 'long tail', 'bound by', 'waits', 'idle'], required: true },
        { label: 'Common causes: null or default keys, one dominant customer or merchant, one hot date', any: ['null', 'default', 'unknown', 'dominant', 'large customer', 'merchant', 'hot date', 'sale'], required: true },
        { label: 'Diagnose by counting rows per partition or key to find the heavy values', any: ['count per', 'group by', 'distribution', 'row count', 'top keys', 'profil'], required: true },
        { label: 'Salting spreads a hot key across multiple buckets', any: ['salt', 'random suffix', 'spread', 'split the key', 'add a random'], required: true },
        { label: 'Broadcast the small side of a join to avoid shuffling on a skewed key', any: ['broadcast', 'map side', 'small table', 'avoid shuffle', 'replicate'], required: true },
        { label: 'Isolate and process the heavy keys separately, then union the results', any: ['separate', 'isolat', 'split the job', 'handle separately', 'union', 'two path'], required: true },
        { label: 'Engine features such as adaptive execution or skew hints can help', any: ['adaptive', 'aqe', 'skew join', 'hint', 'engine feature', 'automatic'] },
        { label: 'Filter or fix null and placeholder keys upstream as a data quality issue', any: ['upstream', 'data quality', 'fix the null', 'exclude', 'placeholder', 'clean'], required: true }
      ],
      approach: `<p>Explain why skew is disproportionately damaging, then diagnose, then give the fixes in order of how often they work.</p>
      <ol>
        <li><strong>Why it hurts so much:</strong> a distributed job finishes when its slowest task finishes. If one partition holds ten times the rows, all other workers sit idle waiting, so you pay for a large cluster and get the throughput of one machine. The fat task is also the one that runs out of memory and fails, then retries and fails again.</li>
        <li><strong>Diagnose it:</strong> count rows and bytes per partition, and count rows per join key. The distribution usually shows a handful of values holding most of the data. In payments and lending the usual suspects are a null or "unknown" key, a single very large merchant or corporate customer, and one hot date such as a sale or a salary day.</li>
        <li><strong>Fix one, the data quality answer.</strong> If the hot key is NULL or a placeholder such as -1 or 'UNKNOWN', that is a data issue. Filter it, route it separately, or fix it upstream. This is remarkably often the entire problem.</li>
        <li><strong>Fix two, salting.</strong> Append a small random suffix to the hot key so it spreads across many buckets, aggregate at that finer grain, then re-aggregate to remove the salt. This directly converts one huge task into many small ones.</li>
        <li><strong>Fix three, broadcast the small side.</strong> If the skew shows up on a join and one input is small, broadcasting it removes the shuffle entirely, so the skewed key stops being a bottleneck.</li>
        <li><strong>Fix four, isolate the whales.</strong> Split the job: process the handful of heavy keys with their own logic and parallelism, process everything else normally, and union the results. Slightly more code, and often the most reliable fix for a persistent fat key.</li>
        <li><strong>Then use the engine.</strong> Adaptive query execution or explicit skew join hints can split heavy partitions automatically, and repartitioning by a better distribution key may remove the problem at the source. I would also monitor per-partition volume so skew is caught by a check rather than by a failing job at 3am.</li>
      </ol>`,
      answer: `<p>Skew means the data is distributed unevenly across partitions or keys, so one unit of work is far larger than the rest. It is disproportionately damaging because a parallel job only finishes when its slowest task finishes: every other worker idles while the fat task grinds on, so you pay for a big cluster and get roughly single-machine throughput. That same oversized task is also the one that exhausts memory and fails, which explains the repeated failures.</p>
      <p>I would diagnose it by counting rows and bytes per partition and per join key to identify the heavy values. In payments and lending data the usual causes are a null or placeholder key acting as a bucket for everything unmapped, one very large merchant or corporate customer, and a single hot date such as a sale or salary day.</p>
      <p>The fixes, in the order I would try them: first, if the hot key is NULL or a sentinel such as UNKNOWN, treat it as a data quality problem and filter, reroute or fix it upstream, since that alone often resolves the whole issue. Second, salt the hot key by appending a small random suffix so it spreads across many buckets, aggregate at that grain, then re-aggregate to strip the salt. Third, if the skew appears in a join and one side is small, broadcast the small side to eliminate the shuffle entirely. Fourth, isolate the heavy keys and process them in a separate path with their own parallelism, unioning the results, which is usually the most reliable answer for a permanently fat key.</p>
      <p>Alongside those, engine features such as adaptive query execution or explicit skew join hints can split oversized partitions automatically, and repartitioning on a better distribution key may remove the imbalance at source. I would then monitor rows per partition as a routine check, so skew is detected by a data quality test rather than by a job failing overnight.</p>`
    },
    {
      id: 'dp-m5',
      difficulty: 'medium',
      prompt: 'Design the <strong>incremental daily load</strong> for a partitioned fact table so that reruns and backfills are safe. What exactly does "idempotent" mean here?',
      hint: 'The same run executed twice must leave the table in the same state as running it once.',
      concepts: [
        { label: 'Idempotent means rerunning produces the same result, with no duplicates', any: ['same result', 'no duplicate', 'twice', 'again', 'same state', 'safe to rerun'], required: true },
        { label: 'Insert-only appends are not idempotent and duplicate on retry', any: ['append', 'insert only', 'duplicate', 'not idempot', 'retry creates'], required: true },
        { label: 'Overwrite the whole partition, or delete then insert its range', any: ['overwrite', 'insert overwrite', 'delete then insert', 'replace the partition', 'truncate partition'], required: true },
        { label: 'Or use MERGE and upsert on a unique business key', any: ['merge', 'upsert', 'on conflict', 'unique key', 'primary key'], required: true },
        { label: 'Partition by event date so a rerun targets one deterministic partition', any: ['event date', 'business date', 'partition by date', 'deterministic', 'target partition'], required: true },
        { label: 'Backfill by looping over partitions with the same parameterised job', any: ['backfill', 'loop', 'parameter', 'same job', 'per partition', 'date parameter'], required: true },
        { label: 'A watermark or high-water mark identifies changed source rows', any: ['watermark', 'high water', 'updated_at', 'changed since', 'last run', 'cdc'], required: true },
        { label: 'Write atomically so readers never see a half-loaded partition', any: ['atomic', 'staging', 'swap', 'transaction', 'partial', 'temp table', 'all or nothing'], required: true },
        { label: 'Log run metadata and validate row counts after each load', any: ['audit', 'log', 'run table', 'row count', 'validate', 'reconcil', 'metadata'], required: true }
      ],
      approach: `<p>Define idempotency, show why the naive approach breaks it, then give the design and the operational scaffolding.</p>
      <ol>
        <li><strong>Definition:</strong> running the job for a given date twice, or five times, leaves the table exactly as it would be after one successful run. That property is what makes retries, late data and backfills routine instead of dangerous.</li>
        <li><strong>Why append fails:</strong> a job that inserts yesterday rows and dies halfway, then reruns, inserts the surviving rows a second time. Nothing errors, and the table now double counts, which is the most common cause of a mysteriously inflated metric.</li>
        <li><strong>The design:</strong> partition by event date, and make each run replace its target partition rather than add to it. Either <code>INSERT OVERWRITE</code> that partition, or delete the date range then insert within a single transaction. The unit of work equals the unit of storage, which is what makes the whole thing simple.</li>
        <li><strong>Where a key exists,</strong> MERGE or upsert on a unique business key is an alternative that also handles updated rows, at the cost of being slower and needing a genuinely unique key, which is worth verifying rather than assuming.</li>
        <li><strong>Selecting source rows:</strong> read by event date for the target partition, and keep a watermark on updated_at or ingestion time so late-arriving or modified rows are picked up. Reprocess a trailing lookback window of several days rather than only yesterday, since lateness is normal.</li>
        <li><strong>Backfill for free:</strong> because the job is parameterised by date and idempotent, a backfill is just a loop over dates, run in parallel where the engine allows. No separate backfill script, which is the whole point.</li>
        <li><strong>Make writes atomic:</strong> stage to a temporary location and swap, or use a transactional table format, so a reader never sees a partially written partition. A dashboard reading a half-loaded partition looks exactly like a real business crash.</li>
        <li><strong>Instrument it:</strong> log each run with its date, row counts in and out, and duration, then assert expected volume and uniqueness after load, so a bad run is caught before anybody builds a report on it.</li>
      </ol>`,
      answer: `<p>Idempotent means that running the load for a given date once or many times leaves the table in exactly the same state. That property is what turns retries, late data and backfills from risky operations into routine ones.</p>
      <p>A plain append is not idempotent: if the job inserts yesterday rows, fails halfway and is rerun, the rows that made it through are inserted again. Nothing raises an error and the table quietly double counts, which is one of the most common causes of an inexplicably inflated metric.</p>
      <p>So I would partition by event date and make each run replace its target partition rather than add to it, either with <code>INSERT OVERWRITE</code> for that partition or by deleting the date range and inserting inside one transaction. Aligning the unit of work with the unit of storage is what keeps this simple. Where a genuinely unique business key exists, MERGE or upsert is an alternative that also handles updated rows, though it is slower and depends on that key really being unique, which I would verify rather than assume.</p>
      <p>For selecting source rows I would filter by event date for the target partition and maintain a watermark on updated_at or ingestion time to catch late-arriving and modified records, reprocessing a trailing window of several days rather than only yesterday. Because the job is parameterised by date and idempotent, a backfill needs no separate code: it is a loop over dates, parallelised where the engine allows.</p>
      <p>Two operational details complete it. Writes should be atomic, staging to a temporary location and swapping, or using a transactional table format, so no reader ever sees a half-written partition, since a dashboard reading a partial partition looks identical to a genuine business collapse. And each run should log its date, input and output row counts and duration, with post-load assertions on expected volume and uniqueness, so a bad load is caught before anyone reports on it.</p>`
    },

    /* ---------------------------- HARD ---------------------------- */
    {
      id: 'dp-h1',
      difficulty: 'hard',
      prompt: 'A 10 TB transactions table is partitioned by <code>customer_id</code> and everything is slow. You must <strong>repartition it by date with no downtime</strong>. How?',
      hint: 'Build the new table beside the old one and move readers over only after verifying it.',
      concepts: [
        { label: 'Do not migrate in place: build a new table with the correct scheme', any: ['new table', 'beside', 'parallel', 'shadow', 'copy', 'not in place'], required: true },
        { label: 'Backfill in chunks by date range with checkpoints', any: ['chunk', 'batch', 'by date', 'range', 'checkpoint', 'incremental', 'piece'], required: true },
        { label: 'Dual write or keep both tables in sync during the transition', any: ['dual write', 'both table', 'in sync', 'keep writing', 'parallel load', 'catch up'], required: true },
        { label: 'Reconcile row counts and control totals before switching readers', any: ['reconcil', 'row count', 'control total', 'checksum', 'verify', 'compare'], required: true },
        { label: 'Switch consumers behind a view or alias so the cutover is one atomic change', any: ['view', 'alias', 'synonym', 'swap', 'rename', 'abstraction', 'pointer'], required: true },
        { label: 'Keep the old table until confidence is established, enabling rollback', any: ['keep the old', 'rollback', 'retain', 'fall back', 'do not drop'], required: true },
        { label: 'Throttle the backfill so production load is not degraded', any: ['throttle', 'off peak', 'rate limit', 'resource', 'concurrency', 'production impact'], required: true },
        { label: 'Add clustering on customer_id so existing lookups do not regress', any: ['cluster', 'bucket', 'sort by customer', 'do not regress', 'lookup', 'keep performance'], required: true },
        { label: 'Communicate with consumers and validate their queries against the new table', any: ['consumer', 'communicat', 'stakeholder', 'test their quer', 'downstream', 'notify'], required: true },
        { label: 'Plan for late-arriving data landing in already-migrated partitions', any: ['late', 'after migration', 'delta', 'catch up', 'changed rows', 'watermark'] }
      ],
      approach: `<p>The answer is a migration plan, not a command. Emphasise reversibility, verification and not regressing the existing workload.</p>
      <ol>
        <li><strong>Understand before moving.</strong> Confirm from query logs that most queries filter by date, and check what still filters by customer id, because those queries must not regress. Design the target as partitioned by date and clustered or bucketed by customer id, which serves both patterns.</li>
        <li><strong>Build alongside.</strong> Create the new table with the correct scheme rather than attempting an in-place change. Ten terabytes cannot be reorganised atomically, and a failed in-place migration leaves you with neither table usable.</li>
        <li><strong>Backfill in chunks.</strong> Copy one date range at a time with a checkpoint table recording completed ranges, so the job is restartable and its progress is reportable. Throttle concurrency and run heavy phases off-peak, and read from a replica or snapshot if the source also serves live traffic.</li>
        <li><strong>Keep the two in sync.</strong> While backfilling history, point the daily pipeline at both tables, or run a small delta job that replays anything written since each range was copied, driven by an ingestion or updated_at watermark. Handle late-arriving rows landing in already-migrated partitions the same way.</li>
        <li><strong>Reconcile properly.</strong> Compare total row counts, counts and sums per date partition, min and max keys, and checksums on samples. Then have the main consumers run their real queries against the new table and confirm the numbers match. Reconciliation is the gate, not a formality.</li>
        <li><strong>Cut over atomically.</strong> Consumers should reference a view or alias rather than the physical table, so the switch is a single pointer change and the rollback is the same change in reverse. If they reference the table directly, this migration is the moment to introduce that indirection.</li>
        <li><strong>Keep the old table</strong> read-only for an agreed period, long enough to cover month-end reporting, before dropping it. Retaining ten terabytes for a few weeks is far cheaper than discovering an unmigrated dependency after deletion.</li>
        <li><strong>Communicate throughout:</strong> tell downstream owners the timeline, what changes for them, and what to check. A silent repartition that changes query performance characteristics generates more incident noise than the original problem.</li>
      </ol>`,
      answer: `<p>I would treat this as a migration with a rollback path rather than an in-place operation. First, confirm from query logs that most queries really do filter by date, and identify the ones that still filter by customer id, because those must not regress. That points at the target design: partitioned by event date for pruning and retention, clustered or bucketed by customer id so point lookups and joins stay fast.</p>
      <p>Then build the new table alongside the old one. Ten terabytes cannot be reorganised atomically, and a half-finished in-place migration leaves nothing usable, so I would backfill in chunks by date range with a checkpoint table recording completed ranges, making the job restartable and its progress visible. I would throttle concurrency, run the heavy phases off-peak and read from a replica or snapshot if the source serves live traffic, so production is not degraded.</p>
      <p>During the transition the two tables have to stay in sync, either by pointing the daily pipeline at both or by running a delta job driven by an ingestion or updated_at watermark that replays anything written since each range was copied. The same mechanism handles late-arriving rows that land in partitions already migrated.</p>
      <p>Before switching anyone over I would reconcile: total and per-partition row counts, control totals on amounts, min and max keys, checksums on samples, and then have the main consumers run their actual queries against the new table and confirm the results match. The cutover itself should be a single pointer change, with consumers referencing a view or alias rather than the physical table, so rollback is the same change reversed; if that indirection does not exist yet, this migration is the right moment to introduce it.</p>
      <p>Finally I would keep the old table read-only for an agreed period covering at least one month-end cycle before dropping it, since retaining the storage briefly is far cheaper than discovering an unmigrated dependency afterwards, and I would keep downstream owners informed of the timeline and what to verify, because an unannounced repartition generates more incident traffic than the original slowness.</p>`
    },
    {
      id: 'dp-h2',
      difficulty: 'hard',
      prompt: 'Two teams query the same table with <strong>conflicting patterns</strong>: risk always filters by date, and support always looks up a single customer across all history. Design a partitioning strategy that serves both.',
      hint: 'You do not have to serve both patterns from one physical layout.',
      concepts: [
        { label: 'One partition key cannot optimise for two orthogonal access patterns', any: ['cannot', 'conflict', 'orthogonal', 'one key', 'trade off', 'both at once'], required: true },
        { label: 'Partition by date and cluster by customer as the first attempt', any: ['partition by date', 'cluster', 'bucket', 'sort by customer', 'within'], required: true },
        { label: 'Clustering enables block level skipping for customer lookups', any: ['skip', 'min max', 'block', 'row group', 'statistic', 'file level'], required: true },
        { label: 'Or maintain a second table or materialised view keyed for the other pattern', any: ['second table', 'materiali', 'duplicate', 'copy', 'another table', 'secondary'], required: true },
        { label: 'Or use a lookup index table mapping customer to partitions', any: ['index table', 'lookup table', 'mapping', 'which partition', 'pointer', 'inverted'], required: true },
        { label: 'Storage duplication is usually cheaper than slow queries', any: ['storage is cheap', 'cheaper than', 'duplicat', 'worth', 'cost of storage'], required: true },
        { label: 'Quantify each pattern frequency and cost before deciding', any: ['how often', 'frequenc', 'quantif', 'measure', 'query log', 'volume of queries', 'sla'], required: true },
        { label: 'Support lookups may be better served by an operational store than the warehouse', any: ['operational', 'oltp', 'key value', 'serving', 'not the warehouse', 'application database', 'low latency'], required: true },
        { label: 'Consistency and maintenance cost of a second copy must be managed', any: ['consisten', 'sync', 'maintenance', 'two copies', 'drift', 'pipeline cost'], required: true }
      ],
      approach: `<p>State honestly that one layout cannot be optimal for both, then work through the options in increasing cost, and choose based on measured usage.</p>
      <ol>
        <li><strong>Frame the conflict.</strong> Risk wants date pruning across all customers; support wants one customer across all dates. Those are orthogonal, and no single partition key optimises both. Pretending otherwise is the wrong answer.</li>
        <li><strong>Measure first.</strong> Pull query logs: how many queries of each type, what latency each needs, and what each currently costs. Risk may run a thousand queries a day where support runs fifty, and that ratio decides the design.</li>
        <li><strong>Option one, one table done well:</strong> partition by date, cluster or bucket by customer id. The clustering means a customer lookup still skips most blocks within each partition using min/max statistics, so it is far better than a full scan even though it must touch every partition. For many workloads this is sufficient and is where I would start.</li>
        <li><strong>Option two, a purpose-built second copy:</strong> a materialised table keyed or clustered by customer id, holding just the columns support needs. Storage is cheap relative to analyst and support time, so duplicating a subset is usually a good trade. The cost is a pipeline to keep it current and the risk of the two drifting, so it must have an owner and reconciliation.</li>
        <li><strong>Option three, an index table:</strong> a small mapping of customer id to the partitions where that customer appears. The lookup query reads the map, then reads only those partitions. This works especially well when customers are concentrated in time, such as a loan customer active for a few months rather than years.</li>
        <li><strong>Question the venue.</strong> A single-customer lookup with low latency is an operational access pattern, not an analytical one. If support needs sub-second responses, the right answer may be a key-value or OLTP store keyed by customer, fed from the warehouse, rather than tuning the analytical table at all.</li>
        <li><strong>Decide and document:</strong> optimise the physical table for the dominant pattern, serve the secondary pattern with a derived structure, and write down which object is intended for which use so nobody accidentally scans the wrong one and files a performance complaint.</li>
      </ol>`,
      answer: `<p>I would start by saying plainly that one partition key cannot be optimal for both patterns, because date pruning across all customers and single-customer lookups across all dates are orthogonal. Then I would measure before designing: from query logs, how many queries of each type run, what latency each needs and what each costs today. If risk runs hundreds of queries a day and support runs a handful, the physical layout should favour risk.</p>
      <p>My first design would be one table partitioned by event date and clustered or bucketed by customer id. Clustering means a customer lookup still benefits from min and max statistics at file and row-group level, so although it has to touch every partition it skips most blocks within them, which is dramatically better than a full scan. For a lot of workloads that is enough.</p>
      <p>If it is not, I would serve the second pattern with a derived structure rather than compromising the main table. Either a materialised copy clustered by customer id containing only the columns support needs, accepting the storage cost because storage is far cheaper than slow queries and wasted staff time, or a small index table mapping customer id to the partitions where that customer appears, so the lookup reads the map and then only the relevant partitions. The index approach works particularly well when customers are concentrated in time, which is typical for loans.</p>
      <p>I would also question the venue for the support use case. A low-latency single-customer lookup is an operational access pattern, and if the requirement is sub-second it belongs in a key-value or OLTP store fed from the warehouse rather than in an analytical table at all. Whichever route is chosen, the second copy needs an owner, a refresh pipeline and reconciliation against the source so the two cannot drift, and I would document which object is intended for which access pattern so nobody points a full scan at the wrong one and reports it as a performance problem.</p>`
    },
    {
      id: 'dp-h3',
      difficulty: 'hard',
      prompt: 'Transactions are partitioned by <strong>processing date</strong>, but a reconciliation needs them by <strong>transaction date</strong>, and events can arrive days late. Explain the problem and how you would fix the design.',
      hint: 'Partitioning by when you received data means a business day is scattered across many partitions.',
      concepts: [
        { label: 'Processing date and event date are different clocks', any: ['processing', 'event time', 'business date', 'two clock', 'arrival', 'ingestion'], required: true },
        { label: 'Partitioning by processing date scatters one business day across partitions', any: ['scatter', 'spread across', 'many partition', 'multiple partition', 'not contiguous'], required: true },
        { label: 'Business-date queries then cannot prune and must scan everything', any: ['cannot prune', 'full scan', 'no pruning', 'scan all', 'expensive'], required: true },
        { label: 'Repartition by event date so business queries prune correctly', any: ['partition by event', 'repartition', 'business date partition', 'transaction date'], required: true },
        { label: 'Keep processing or ingestion time as a column for auditability and deltas', any: ['keep', 'column', 'retain', 'audit', 'watermark', 'delta', 'incremental'], required: true },
        { label: 'Loads must rewrite affected past partitions, so they must be idempotent', any: ['idempot', 'overwrite', 'rewrite', 'past partition', 'restat', 'rerun'], required: true },
        { label: 'Use a lookback window sized from the observed lateness distribution', any: ['lookback', 'window', 'distribution of lateness', 'how late', 'trailing', 'n days'], required: true },
        { label: 'Numbers for closed days will change, so restatement policy must be agreed', any: ['change', 'restat', 'closed period', 'cut off', 'policy', 'communicat', 'finance'], required: true },
        { label: 'Late data usually breaks reconciliation and finance reporting first', any: ['reconcil', 'finance', 'report', 'mismatch', 'settlement', 'audit'], required: true }
      ],
      approach: `<p>Diagnose the mismatch, quantify the damage, then fix the layout and the process around it, including the human agreement about restatements.</p>
      <ol>
        <li><strong>Name the two clocks.</strong> Processing date is when we received or loaded the record; transaction or event date is when it happened in the business. They coincide only when nothing is ever late, which is never true.</li>
        <li><strong>Why the current layout hurts:</strong> a single business day now lives smeared across several processing-date partitions, so a reconciliation for one day either scans the whole table or requires a wide, unbounded date range. Pruning is effectively lost for exactly the query that matters most, and finance sees numbers that keep moving.</li>
        <li><strong>The fix in layout:</strong> partition by transaction date, so a business day is one contiguous unit and reconciliation prunes to a single partition. Keep processing or ingestion timestamp as a regular column, because it is essential for auditing, for incremental extraction and for explaining why a number changed.</li>
        <li><strong>The consequence to accept:</strong> late data now writes into past partitions, so loads must be idempotent, rebuilding an affected partition rather than appending. That is exactly the partition-overwrite pattern and it is why idempotency is not optional here.</li>
        <li><strong>Size the lookback empirically.</strong> Measure the distribution of lateness, meaning processing date minus transaction date, then reprocess a trailing window covering the bulk of it, perhaps seven days, with a targeted backfill mechanism for the rare longer tail. Guessing this window is how late data silently goes missing.</li>
        <li><strong>Agree the restatement policy,</strong> which is the part people forget. Once past partitions can be rewritten, a closed day total can change, and finance must know whether figures freeze after a cut-off with corrections shown as restatements, or every published number carries an as-of timestamp. This is a policy decision, not a technical one.</li>
        <li><strong>Instrument it:</strong> monitor lateness as a metric with alerting when it exceeds the lookback window, and keep a reconciliation report comparing warehouse totals to the settlement source per business date, so a gap is detected by a check rather than by an auditor.</li>
      </ol>`,
      answer: `<p>The root problem is that two different clocks are being conflated. Processing date is when we received the record; transaction date is when it happened in the business. Partitioning on processing date means a single business day is smeared across several partitions, so the reconciliation query for one day either scans the entire table or needs an unbounded date range, and pruning is lost precisely for the most important query. It also means finance sees a day total that keeps changing as stragglers arrive without an obvious explanation.</p>
      <p>The fix is to partition by transaction date so each business day is one contiguous unit and reconciliation prunes to a single partition, while keeping processing or ingestion timestamp as an ordinary column, since it is needed for auditing, for incremental extraction watermarks and for explaining movements. The consequence is that late-arriving data now writes into past partitions, so every load must be idempotent, rebuilding the affected partition rather than appending to it, which is exactly the partition-overwrite pattern.</p>
      <p>I would size the reprocessing window from evidence rather than intuition, measuring the distribution of processing date minus transaction date and reprocessing a trailing window that covers the bulk of it, with a targeted backfill path for the rare long tail. Guessing that window is how late records quietly go missing.</p>
      <p>The part that is easy to overlook is the agreement with finance. Once past partitions can be rewritten, a closed day total can legitimately change, so the policy has to be explicit: either figures freeze after a cut-off and later corrections appear as restatements, or every published figure carries the timestamp it was computed at. Alongside that I would monitor lateness as a metric with an alert when it exceeds the lookback window, and run a standing reconciliation of warehouse totals against the settlement source per business date, so a discrepancy is found by a check rather than by an audit.</p>`
    },
    {
      id: 'dp-h4',
      difficulty: 'hard',
      prompt: 'You must enforce a policy that transaction data older than seven years is deleted, and that a specific customer data can be erased on request. How does <strong>partitioning help, and where does it fail</strong>?',
      hint: 'Time-based deletion is trivially easy with partitions; per-customer deletion is the opposite.',
      concepts: [
        { label: 'Time-based retention is cheap: drop whole partitions as a metadata operation', any: ['drop partition', 'metadata', 'cheap', 'instant', 'no scan', 'delete partition'], required: true },
        { label: 'Row-level deletion by customer cuts across every partition', any: ['across', 'every partition', 'cuts across', 'all partition', 'orthogonal', 'scattered'], required: true },
        { label: 'Per-customer erasure requires rewriting many files or partitions', any: ['rewrite', 'expensive', 'copy on write', 'rewrite the file', 'costly', 'immutable file'], required: true },
        { label: 'Transactional table formats support row-level deletes with delete files', any: ['iceberg', 'delta', 'hudi', 'transactional', 'delete file', 'merge on read', 'row level delete'], required: true },
        { label: 'Tokenisation or crypto-shredding lets you erase by destroying the key', any: ['token', 'crypto', 'encrypt', 'destroy the key', 'shred', 'vault', 'pseudonym'], required: true },
        { label: 'Keep PII in a separate small table so erasure touches one place', any: ['separate table', 'isolate', 'pii table', 'one place', 'vault', 'split'], required: true },
        { label: 'Deletion must propagate to backups, copies, exports and downstream systems', any: ['backup', 'downstream', 'copies', 'export', 'propagat', 'derived table', 'everywhere'], required: true },
        { label: 'Regulatory retention can conflict with erasure requests', any: ['conflict', 'regulat', 'must retain', 'legal', 'rbi', 'obligation', 'cannot delete'], required: true },
        { label: 'Log deletions for audit evidence that the policy was executed', any: ['audit', 'log', 'evidence', 'proof', 'record of deletion', 'certif'], required: true }
      ],
      approach: `<p>Split the question in two, because the two policies pull in opposite directions. Then give the design that makes the hard one tractable.</p>
      <ol>
        <li><strong>Retention is where partitioning shines.</strong> With date partitions, deleting data older than seven years is dropping partitions: a metadata operation, no scan, no rewrite, seconds rather than hours. Automate it as a scheduled job with a dry-run report, and treat it as one of the strongest arguments for partitioning by date at all.</li>
        <li><strong>Per-customer erasure is the opposite.</strong> A customer transactions are spread across every date partition, so erasure is orthogonal to the layout. On immutable file formats you cannot delete a row in place; you must rewrite every file containing that customer, which for a long-tenured customer can mean touching thousands of partitions.</li>
        <li><strong>Do not repartition by customer</strong> to solve it. That would wreck every analytical query and create millions of partitions, trading a rare operation against the daily workload.</li>
        <li><strong>Option one, transactional table formats.</strong> Iceberg, Delta or Hudi support row-level deletes through delete files and merge-on-read, so erasure becomes a DELETE statement with compaction later. This is the mainstream answer now and I would design for it.</li>
        <li><strong>Option two, crypto-shredding.</strong> Encrypt per-customer sensitive fields with a per-customer key held in a key vault; erasure is destroying the key, which renders the data unreadable without rewriting a single file. It is the only approach that scales cleanly, though it requires the deletion definition to accept unreadable rather than physically absent.</li>
        <li><strong>Option three, isolate PII.</strong> Keep identifying attributes in one small dimension keyed by a surrogate id, with fact tables holding only that id. Erasure then means deleting one row in one small table, leaving behind non-identifiable transaction records. This is the cleanest design and should be chosen at the start rather than retrofitted.</li>
        <li><strong>Then handle the rest of the estate:</strong> deletion has to propagate to derived tables, extracts, BI caches, backups and anything shared with third parties. A DELETE on the fact table alone is not compliance, and the backup question in particular needs a documented answer.</li>
        <li><strong>Acknowledge the conflict.</strong> Financial regulation often mandates retaining transaction records for a fixed period, which can override an erasure request, so the policy must define what is deleted, what is anonymised and what is legally retained. And every deletion needs an audit log proving it happened, since being unable to evidence compliance is itself a failure.</li>
      </ol>`,
      answer: `<p>These two requirements pull in opposite directions. Time-based retention is exactly what partitioning is good for: with date partitions, removing anything older than seven years is dropping partitions, a metadata operation that needs no scan and no rewrite, so it runs in seconds and is easy to schedule and audit.</p>
      <p>Per-customer erasure is the opposite case, because one customer transactions are scattered across every date partition, so the request cuts orthogonally through the layout. On immutable file formats a row cannot be deleted in place, so compliance means rewriting every file that contains that customer, which for a long-standing customer can touch thousands of partitions. The wrong fix is repartitioning by customer, which would destroy analytical performance and create millions of partitions to serve a rare operation.</p>
      <p>There are three good answers. A transactional table format such as Iceberg, Delta or Hudi supports row-level deletes via delete files and merge-on-read, so erasure becomes a DELETE with compaction afterwards; this is what I would design for today. Crypto-shredding is the most scalable: encrypt per-customer sensitive fields with a per-customer key and erase by destroying the key, which makes the data unreadable without rewriting any files, provided the policy accepts unreadable rather than physically removed. Best of all is isolating identity from the start, keeping PII in one small dimension keyed by a surrogate id while facts hold only the id, so erasure deletes a single row and leaves non-identifiable transaction history intact.</p>
      <p>Whichever route, deletion has to propagate across the whole estate: derived tables, extracts, BI caches, backups and any data shared with third parties, since deleting from the main fact table alone is not compliance and backups in particular need a documented position. I would also flag that financial regulation frequently mandates retaining transaction records for a defined period, which can lawfully override an erasure request, so the policy must state what is deleted, what is anonymised and what is retained under obligation. Finally, every deletion needs an audit log, because being unable to evidence that the policy was executed is itself a compliance failure.</p>`
    },
    {
      id: 'dp-h5',
      difficulty: 'hard',
      prompt: 'A join between two large partitioned tables is slow and shuffle-heavy. Explain how <strong>partitioning affects distributed joins</strong>, and what you would change.',
      hint: 'The expensive part is moving matching rows onto the same machine; layout decides how much moving is needed.',
      concepts: [
        { label: 'A shuffle redistributes rows across the network so matching keys meet', any: ['shuffle', 'redistribut', 'network', 'exchange', 'move data', 'same node'], required: true },
        { label: 'Shuffle is expensive: network, serialisation and disk spill', any: ['expensive', 'network', 'spill', 'serialis', 'serializ', 'disk', 'cost'], required: true },
        { label: 'Co-locating or bucketing both tables on the join key avoids the shuffle', any: ['co locat', 'bucket', 'same key', 'distribution key', 'avoid the shuffle', 'aligned', 'partition on the join key'], required: true },
        { label: 'Broadcasting a small table removes the shuffle entirely', any: ['broadcast', 'small table', 'map side', 'replicate', 'send to every'], required: true },
        { label: 'Prune both sides first so less data enters the join', any: ['prune', 'filter first', 'before the join', 'reduce', 'push down', 'less data'], required: true },
        { label: 'Skew on the join key creates stragglers even with a good layout', any: ['skew', 'straggler', 'hot key', 'uneven', 'one task'], required: true },
        { label: 'Pre-aggregate before joining when detail is not needed', any: ['pre aggregate', 'aggregate first', 'summaris', 'summariz', 'collapse', 'reduce rows'], required: true },
        { label: 'Partitioning by date does not help a join on customer id', any: ['different key', 'date does not help', 'not the join key', 'mismatch', 'still shuffles'], required: true },
        { label: 'Denormalising or materialising the joined result avoids repeating the work', any: ['denormalis', 'denormaliz', 'materiali', 'pre join', 'wide table', 'store the result'], required: true },
        { label: 'Read the plan and measure shuffle volume rather than guessing', any: ['explain', 'plan', 'measure', 'shuffle bytes', 'metrics', 'profil'], required: true }
      ],
      approach: `<p>Explain the mechanism first, because every remedy follows from it, then give the options in order of impact.</p>
      <ol>
        <li><strong>The mechanism:</strong> to join, rows with the same key must be on the same machine. If they are not, the engine shuffles, hashing every row by the join key and sending it across the network. That costs network bandwidth, serialisation, and disk when partitions spill, and it is usually the dominant cost in a large join.</li>
        <li><strong>The common trap:</strong> both tables partitioned by date but joined on customer id. Date partitioning does nothing for that join, because rows for one customer are spread everywhere, so a full shuffle happens regardless. Partition pruning and join locality are different problems.</li>
        <li><strong>Fix one, prune harder.</strong> Filter both sides as early as possible so less data enters the join at all. Halving both inputs quarters the shuffle. Confirm predicates push down to both scans rather than being applied after the join.</li>
        <li><strong>Fix two, broadcast if you can.</strong> If one side is small after filtering, broadcast it to every node and the shuffle disappears. Check the threshold your engine uses and whether stale statistics are stopping it from choosing this plan automatically.</li>
        <li><strong>Fix three, co-locate.</strong> Bucket or distribute both tables on the join key with the same bucket count, so matching rows already live together and the engine can do a bucketed or co-located join with no exchange. In a warehouse with distribution keys, aligning them on the common join key is the equivalent move. This is the structural fix for a join that runs constantly.</li>
        <li><strong>Fix four, pre-aggregate.</strong> If the join feeds an aggregate, aggregate each side to the join grain first so you shuffle thousands of rows instead of billions.</li>
        <li><strong>Handle skew separately.</strong> Even with perfect co-location, one dominant key makes one task run forever, so salt the hot key, isolate the heavy keys, or rely on adaptive execution to split them.</li>
        <li><strong>Consider not joining at all.</strong> If this join runs many times a day, materialise the joined result as a wide table and let consumers read it. Do the expensive work once on a schedule rather than repeatedly at query time. Throughout, read the plan and measure shuffle bytes before and after, since join tuning without measurement is guesswork.</li>
      </ol>`,
      answer: `<p>The mechanism is what matters. To join, rows sharing a key must sit on the same machine, so if they do not, the engine shuffles: it hashes every row by the join key and moves it across the network. That costs bandwidth, serialisation and, when partitions exceed memory, disk spill, and in a large join it is typically the dominant cost. The frequent trap is assuming date partitioning helps: if both tables are partitioned by date but joined on customer id, rows for one customer are scattered across every partition and a full shuffle happens anyway, because pruning and join locality are separate problems.</p>
      <p>I would work through the fixes in order of impact. First, prune harder so less data enters the join, filtering both sides as early as possible and confirming the predicates actually push down to the scans rather than being applied afterwards; halving both inputs quarters the shuffle. Second, broadcast the smaller side if it is small enough after filtering, which removes the shuffle entirely, and check whether stale statistics are preventing the optimiser from choosing that plan. Third, the structural fix: bucket or distribute both tables on the join key with matching bucket counts so rows are already co-located and the engine can join without an exchange, which is the right investment for a join that runs constantly. Fourth, if the join feeds an aggregation, pre-aggregate each side to the join grain so the shuffle moves thousands of rows rather than billions.</p>
      <p>Skew needs handling separately, because even a perfectly co-located join is held up by one dominant key, so I would salt the hot key, process heavy keys in their own path, or rely on adaptive execution to split oversized partitions. And I would question whether the join needs to happen repeatedly at all: if it runs many times a day, materialising the joined result as a wide table does the expensive work once on a schedule instead of on every query. Throughout, I would read the execution plan and compare shuffle bytes before and after each change, since join tuning without measurement is guesswork.</p>`
    }
  ]
});
