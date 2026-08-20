/* Questions reported from Navi Technologies analyst interviews (business
   analyst, data analyst and financial analyst loops): SQL written live, lending
   and UPI case studies, guesstimates and puzzles. Lending vocabulary is used
   deliberately, since that is the domain the interviewers work in. */
DAQ.registerTopic({
  id: 'navi',
  group: 'navi',
  name: 'Navi Interview Questions',
  icon: '\uD83C\uDFE6',
  blurb: 'Reported from real Navi rounds: live SQL on transactions and loan books, UPI and lending cases, dashboard design, credit risk judgement, guesstimates and puzzles.',
  questions: [
    /* ---------------------------- EASY ---------------------------- */
    {
      id: 'nv-e1',
      difficulty: 'easy',
      prompt: 'Navi runs personal loans, home loans, health insurance, mutual funds and UPI in one app. If you joined as an analyst, <strong>which metrics would you say the business runs on</strong>, and why is a lending metric different from a UPI metric?',
      hint: 'Lending earns over months and can lose money after the fact; payments earn per transaction and are settled immediately.',
      concepts: [
        { label: 'Lending funnel metrics: application, approval, disbursal and conversion', any: ['approval', 'disburs', 'application', 'funnel', 'sanction'], required: true },
        { label: 'Credit risk metrics: default rate, delinquency, NPA, credit cost', any: ['default', 'delinquen', 'npa', 'credit cost', 'loss', 'risk'], required: true },
        { label: 'Unit economics: interest income, net interest margin, cost of acquisition', any: ['interest', 'margin', 'nim', 'cac', 'unit econom', 'revenue per'], required: true },
        { label: 'UPI and payments metrics: transaction volume, success rate, latency', any: ['success rate', 'transaction volume', 'tpv', 'throughput', 'failure', 'latency'], required: true },
        { label: 'Lending outcomes appear with a lag and can reverse, payments settle immediately', any: ['lag', 'season', 'later', 'months', 'immediate', 'reverse', 'vintage'], required: true },
        { label: 'Engagement and cross-sell across products in a single app', any: ['cross sell', 'engagement', 'retention', 'multi product', 'same customer', 'mau'] },
        { label: 'Regulatory and compliance constraints on lending metrics', any: ['regulat', 'rbi', 'complian', 'audit'] }
      ],
      approach: `<p>The interviewer wants to see that you understand a lending business is not an e-commerce funnel. Split the answer by product family, then name the structural difference.</p>
      <ol>
        <li><strong>Lending funnel:</strong> app opens to applications started, KYC completion, approval rate, approval to disbursal conversion, disbursed volume and average ticket size. Each step has a different owner and a different failure mode.</li>
        <li><strong>Credit risk:</strong> first payment default, 30 and 90 day delinquency, NPA and credit cost as a share of the book, always cut by disbursal vintage. This is what makes lending analytics distinctive.</li>
        <li><strong>Unit economics:</strong> interest income, net interest margin, acquisition cost per disbursed loan, collection cost and risk-adjusted contribution per loan.</li>
        <li><strong>UPI and payments:</strong> transaction count and value, payment success rate by gateway and bank, failure reasons, latency, and monthly transacting users. Payments are high volume, low margin and settle instantly.</li>
        <li><strong>The structural difference:</strong> a UPI transaction is judged within seconds and its revenue is known immediately, while a loan disbursed today may look excellent for six months and then default. So payments metrics are monitored in real time, and lending metrics must be read on seasoned cohorts. Optimising disbursal volume without a risk guardrail is how lending businesses lose money.</li>
        <li>Add cross-sell and engagement, since the strategic value of a super app is the same customer using several products, and note that regulatory reporting constrains how some lending metrics are defined.</li>
      </ol>`,
      answer: `<p>I would group them by product. On <strong>lending</strong>: the funnel from application to KYC to approval rate to disbursal conversion, disbursed value and average ticket size; then credit quality, meaning first payment default, 30 and 90 day delinquency, NPA and credit cost, always read by disbursal vintage; then unit economics, meaning interest income, net interest margin, acquisition cost per disbursed loan and risk-adjusted contribution. On <strong>UPI and payments</strong>: transaction count and value, payment success rate segmented by gateway and issuing bank, failure reason mix, latency and monthly transacting users. Across the app, engagement and cross-sell, because one customer using several products is the reason to run a super app.</p>
      <p>The important difference is timing and reversibility. A UPI transaction succeeds or fails in seconds and its revenue is immediate, so payment metrics are monitored live and an incident is visible the same hour. A loan is revenue now and possible loss much later, so its true quality only emerges as the cohort seasons over months. That means lending metrics have to be compared at equal cohort age rather than in aggregate, and volume targets like disbursals or approval rate always need a risk guardrail attached, otherwise the business can look like it is growing while it is actually buying losses.</p>`
    },
    {
      id: 'nv-e2',
      difficulty: 'easy',
      prompt: 'Reported at Navi: <strong>how do NULL values behave in joins</strong>, and when is a LEFT JOIN safer than an INNER JOIN?',
      hint: 'NULL is not a value, it is the absence of one, so it never equals anything, not even another NULL.',
      concepts: [
        { label: 'NULL never equals NULL, so join keys that are NULL never match', any: ['never equal', 'not equal', 'does not match', 'null = null', 'unknown', 'no match'], required: true },
        { label: 'Rows with NULL keys are silently dropped by an INNER JOIN', any: ['drop', 'lost', 'excluded', 'disappear', 'silently', 'missing row'], required: true },
        { label: 'LEFT JOIN preserves all left rows, filling unmatched columns with NULL', any: ['left join', 'preserve', 'keeps all', 'retain', 'fills with null'], required: true },
        { label: 'A WHERE filter on the right table after a LEFT JOIN turns it back into an inner join', any: ['where', 'turns it into', 'becomes an inner', 'filter', 'undo', 'on clause'], required: true },
        { label: 'Use IS NULL rather than = NULL, or COALESCE to make keys comparable', any: ['is null', 'coalesce', 'ifnull', 'isnull', 'nvl'], required: true },
        { label: 'Aggregates ignore NULLs, and COUNT(column) differs from COUNT(*)', any: ['count(*)', 'count(', 'ignore', 'aggregate', 'average', 'skip'] },
        { label: 'Check for NULL keys before joining as a data quality step', any: ['data quality', 'check', 'audit', 'validate', 'profil', 'before joining'] }
      ],
      approach: `<p>Answer the mechanics, then the practical trap, because the trap is what they are testing.</p>
      <ol>
        <li><strong>Mechanics:</strong> NULL means unknown, so any comparison with it evaluates to unknown rather than true. <code>NULL = NULL</code> is not true, which means a row whose join key is NULL matches nothing.</li>
        <li><strong>Consequence:</strong> an INNER JOIN silently drops those rows. If ten percent of your loan records have a NULL customer id, your report quietly loses ten percent of the book with no error raised.</li>
        <li><strong>LEFT JOIN:</strong> keeps every row from the left table and fills the right side with NULLs when there is no match, which is what you want when the left table is the population you must report on.</li>
        <li><strong>The classic mistake:</strong> writing a LEFT JOIN and then filtering on a right-table column in the WHERE clause. Because unmatched rows have NULL there, the filter removes them and you are back to an inner join. Put that condition in the ON clause instead.</li>
        <li><strong>Handling:</strong> test with <code>IS NULL</code>, never <code>= NULL</code>, and use COALESCE when a sentinel value is genuinely meaningful. Remember aggregates skip NULLs, so <code>COUNT(col)</code> and <code>COUNT(*)</code> differ, and an average silently changes its denominator.</li>
        <li>Say that you profile key columns for NULLs before joining, because in practice a NULL key usually signals an upstream data quality problem worth fixing rather than coding around.</li>
      </ol>`,
      answer: `<p>NULL represents an unknown, so comparisons with it are never true: <code>NULL = NULL</code> does not match. That means any row whose join key is NULL matches nothing, and an INNER JOIN drops it silently with no warning. If a meaningful share of rows has a NULL key, a report can lose a large slice of the population and still look correct.</p>
      <p>A LEFT JOIN is safer whenever the left table defines the population you are obliged to report on, for example every disbursed loan, because it keeps all left rows and returns NULLs for the missing right-side columns, making the gap visible instead of invisible. The trap to avoid is filtering on a right-table column in the WHERE clause after a LEFT JOIN, since unmatched rows hold NULL there and get removed, silently converting it back to an inner join. That condition belongs in the ON clause.</p>
      <p>Practically, I test with <code>IS NULL</code> rather than <code>= NULL</code>, use COALESCE where a default is genuinely correct, and remember that aggregates ignore NULLs so <code>COUNT(column)</code> and <code>COUNT(*)</code> disagree and averages change denominator. Before joining large tables I profile the key columns for NULLs and duplicates, because a NULL join key is usually an upstream data quality issue rather than something to paper over.</p>`
    },
    {
      id: 'nv-e3',
      difficulty: 'easy',
      prompt: 'Reported at Navi: explain the difference between a <strong>window function and GROUP BY</strong>. When would you use one over the other?',
      hint: 'One collapses rows, the other keeps them.',
      concepts: [
        { label: 'GROUP BY collapses rows into one row per group', any: ['collaps', 'one row per', 'reduces', 'aggregates rows', 'fewer rows'], required: true },
        { label: 'A window function keeps every row and adds the aggregate alongside it', any: ['keeps every row', 'retain', 'same number of rows', 'alongside', 'does not collapse', 'per row'], required: true },
        { label: 'OVER with PARTITION BY defines the window the calculation runs across', any: ['over', 'partition by', 'window', 'frame'], required: true },
        { label: 'Use windows for ranking, running totals, and row-versus-group comparisons', any: ['rank', 'running total', 'row_number', 'cumulative', 'compare', 'share of', 'lag', 'lead'], required: true },
        { label: 'Use GROUP BY for summary reporting where detail is not needed', any: ['summary', 'report', 'total per', 'aggregate report', 'roll up'], required: true },
        { label: 'Windows are evaluated after WHERE and GROUP BY, so they cannot be filtered in WHERE', any: ['after', 'cannot filter', 'where', 'subquery', 'qualify', 'cte', 'order of execution'] }
      ],
      approach: `<p>Lead with the one-line distinction, then give a concrete lending example of each, then the execution-order detail that separates a good answer from a memorised one.</p>
      <ol>
        <li><strong>GROUP BY collapses.</strong> Fifty thousand transactions become one row per customer. The detail is gone.</li>
        <li><strong>A window function does not collapse.</strong> Every transaction row is returned, with an extra column carrying the aggregate over its window, so you can compare a row against its own group.</li>
        <li><strong>Syntax:</strong> <code>SUM(amount) OVER (PARTITION BY customer_id ORDER BY txn_date)</code>. PARTITION BY chooses the group, ORDER BY makes it a running calculation.</li>
        <li><strong>When windows win:</strong> ranking loans per customer, running balance, each transaction as a share of the customer monthly total, month-on-month change with LAG, or picking the latest record per key. Doing these with GROUP BY needs a self join and is slower and harder to read.</li>
        <li><strong>When GROUP BY wins:</strong> plain summary output, such as disbursed amount per city per month, where nobody needs the underlying rows.</li>
        <li><strong>The detail worth adding:</strong> window functions are evaluated after WHERE and GROUP BY, so you cannot filter on one in the WHERE clause. Wrap it in a CTE or subquery and filter outside, which is exactly how top-N-per-group is written.</li>
      </ol>`,
      answer: `<p>GROUP BY collapses rows: you get one output row per group and the individual rows are gone. A window function keeps every row and adds the aggregate next to it, computed over the window you define with <code>OVER (PARTITION BY ... ORDER BY ...)</code>. So the real question is whether you still need row-level detail in the output.</p>
      <p>I reach for a window function whenever a row has to be compared with its own group: ranking each customer loans with ROW_NUMBER or RANK, running totals of repayments, each transaction as a percentage of that customer monthly spend, month-on-month movement with LAG, or selecting the most recent row per key. All of that is possible with GROUP BY plus a self join, but it is longer and usually slower. I use GROUP BY when the output really is a summary, such as total disbursal by city and month, where the detail rows serve no purpose.</p>
      <p>One execution-order detail matters in practice: windows are computed after WHERE and GROUP BY, so you cannot filter on a window result in the WHERE clause. You put the window in a CTE or subquery and filter in the outer query, which is exactly the pattern for top-N per group.</p>`
    },
    {
      id: 'nv-e4',
      difficulty: 'easy',
      prompt: 'Reported at Navi: distinguish <strong>ROW_NUMBER, RANK and DENSE_RANK</strong>, and show the PARTITION BY pattern for "the latest transaction per customer".',
      hint: 'They differ only in how they treat ties, and that difference decides which one is correct for deduplication.',
      concepts: [
        { label: 'ROW_NUMBER gives a unique sequential number with no ties', any: ['row_number', 'unique', 'no ties', 'sequential', 'arbitrary'], required: true },
        { label: 'RANK leaves gaps after ties', any: ['rank', 'gap', 'skips', '1 1 3'], required: true },
        { label: 'DENSE_RANK leaves no gaps after ties', any: ['dense_rank', 'no gap', 'consecutive', '1 1 2'], required: true },
        { label: 'PARTITION BY restarts the numbering per group', any: ['partition by', 'per customer', 'restart', 'each group', 'resets'], required: true },
        { label: 'Filter the numbered result in an outer query or CTE where rn = 1', any: ['rn = 1', 'where rn', 'outer query', 'cte', 'subquery', '= 1'], required: true },
        { label: 'ROW_NUMBER is the correct choice for deduplication because it guarantees one row', any: ['dedup', 'one row', 'exactly one', 'duplicate', 'guarantee'], required: true },
        { label: 'A deterministic tie-breaker in ORDER BY makes results reproducible', any: ['tie break', 'deterministic', 'second column', 'reproducib', 'stable', 'id desc'] }
      ],
      approach: `<p>Define the three by their tie behaviour, then write the pattern, then say why the choice matters for correctness rather than style.</p>
      <ol>
        <li><strong>ROW_NUMBER:</strong> 1, 2, 3, 4 with no ties ever. Two equal values still get different numbers, chosen arbitrarily unless you add a tie-breaker.</li>
        <li><strong>RANK:</strong> equal values share a rank and the next rank skips: 1, 1, 3.</li>
        <li><strong>DENSE_RANK:</strong> equal values share a rank and the next rank does not skip: 1, 1, 2.</li>
        <li><strong>The pattern:</strong> number the rows inside a CTE, then filter outside, because a window result cannot be filtered in WHERE.
<pre>WITH ranked AS (
  SELECT t.*,
         ROW_NUMBER() OVER (PARTITION BY customer_id
                            ORDER BY txn_date DESC, txn_id DESC) AS rn
  FROM transactions t
)
SELECT * FROM ranked WHERE rn = 1;</pre></li>
        <li><strong>Why ROW_NUMBER here:</strong> deduplication needs exactly one row per customer. RANK or DENSE_RANK would return two rows if a customer had two transactions with the identical timestamp, quietly breaking a downstream join.</li>
        <li><strong>Add a tie-breaker</strong> such as <code>txn_id DESC</code> so the result is deterministic and the same query returns the same row on every run.</li>
      </ol>`,
      answer: `<p>All three number rows within a partition and differ only on ties. ROW_NUMBER always produces a unique sequence, 1, 2, 3, even for equal values. RANK gives tied rows the same number and then skips, producing 1, 1, 3. DENSE_RANK gives tied rows the same number without skipping, producing 1, 1, 2.</p>
      <p>For the latest transaction per customer I number inside a CTE and filter outside, because a window function cannot be referenced in WHERE:</p>
      <pre>WITH ranked AS (
  SELECT t.*,
         ROW_NUMBER() OVER (PARTITION BY customer_id
                            ORDER BY txn_date DESC, txn_id DESC) AS rn
  FROM transactions t
)
SELECT * FROM ranked WHERE rn = 1;</pre>
      <p>PARTITION BY restarts the numbering for each customer and the ORDER BY decides which row is number one. ROW_NUMBER is the right function for this because deduplication requires exactly one row per customer; RANK or DENSE_RANK would return two rows for a customer with two transactions at the identical timestamp, which then silently fans out any downstream join. I include a second ORDER BY column such as the transaction id so ties resolve deterministically and the query is reproducible.</p>`
    },
    {
      id: 'nv-e5',
      difficulty: 'easy',
      prompt: 'Reported at Navi: write SQL to find the <strong>store with the highest average order value</strong> from an orders table, and say what you would clarify before writing it.',
      hint: 'AOV is a ratio, so decide the numerator, the denominator and which rows qualify before you type.',
      concepts: [
        { label: 'AOV is total revenue divided by order count', any: ['sum', 'divided by', 'count', 'total revenue', 'per order', 'avg'], required: true },
        { label: 'GROUP BY the store, then order the aggregate descending', any: ['group by', 'order by', 'desc', 'per store'], required: true },
        { label: 'Return the top row with LIMIT, or a window function for ties', any: ['limit 1', 'limit', 'top 1', 'rank', 'fetch first'], required: true },
        { label: 'Clarify which orders qualify: cancelled, refunded, test orders', any: ['cancel', 'refund', 'test', 'status', 'exclude', 'valid order'], required: true },
        { label: 'Clarify the time window and a minimum order threshold to avoid tiny stores winning', any: ['time', 'period', 'month', 'minimum', 'threshold', 'having', 'at least'], required: true },
        { label: 'AVG(amount) at order grain equals SUM/COUNT only if one row per order', any: ['grain', 'one row per order', 'line item', 'duplicate', 'avg(', 'item level'] }
      ],
      approach: `<p>Interviewers at Navi ask this live, and the credit goes to whoever clarifies before coding. Ask two questions, write the query, then defend it against the small-store trap.</p>
      <ol>
        <li><strong>Clarify the rows:</strong> do cancelled, failed and refunded orders count, and are test or internal orders excluded? AOV changes materially depending on the answer.</li>
        <li><strong>Clarify the grain:</strong> is one row one order, or one line item? If it is line items, <code>AVG(amount)</code> silently computes the average item value, not order value, so you must aggregate to order level first.</li>
        <li><strong>The query</strong> at order grain:
<pre>SELECT store_id,
       SUM(order_amount) / COUNT(DISTINCT order_id) AS aov
FROM orders
WHERE order_status = 'completed'
  AND order_date >= '2026-01-01'
GROUP BY store_id
HAVING COUNT(DISTINCT order_id) >= 50
ORDER BY aov DESC
LIMIT 1;</pre></li>
        <li><strong>Explain the HAVING.</strong> Without a minimum order count, a store with one expensive order wins, which is the trap in the question. A volume threshold makes the answer meaningful.</li>
        <li><strong>Mention ties.</strong> LIMIT 1 hides them; if ties matter, rank with <code>RANK() OVER (ORDER BY aov DESC)</code> and return everything ranked one.</li>
        <li>If the table is line-item grain, aggregate to orders in a CTE first and then average, and say so, because this is exactly where candidates lose the point.</li>
      </ol>`,
      answer: `<p>Before writing I would clarify two things: which orders count, meaning whether cancelled, failed, refunded, test and internal orders are excluded, and what the grain of the table is, since one row per line item rather than per order changes the maths entirely. I would also confirm the time window.</p>
      <p>At order grain:</p>
      <pre>SELECT store_id,
       SUM(order_amount) / COUNT(DISTINCT order_id) AS aov
FROM orders
WHERE order_status = 'completed'
  AND order_date >= '2026-01-01'
GROUP BY store_id
HAVING COUNT(DISTINCT order_id) >= 50
ORDER BY aov DESC
LIMIT 1;</pre>
      <p>The HAVING clause is the part that matters: without a minimum volume, a store with a single large order tops the list and the answer is useless, so I set a threshold appropriate to the business. If ties are possible I would replace LIMIT with <code>RANK() OVER (ORDER BY aov DESC)</code> in a CTE and return every row ranked first. If the table is line-item grain, I would first aggregate to one row per order in a CTE and then compute the average, because <code>AVG(amount)</code> straight off line items gives average item value and quietly answers a different question.</p>`
    },

    /* --------------------------- MEDIUM --------------------------- */
    {
      id: 'nv-m1',
      difficulty: 'medium',
      prompt: 'Reported at Navi: write SQL for the <strong>top 3 customers by transaction volume for each month</strong>.',
      hint: 'Top N per group is always aggregate, then rank inside the group, then filter outside.',
      concepts: [
        { label: 'Aggregate to one row per customer per month first', any: ['group by', 'per customer per month', 'aggregate first', 'sum', 'monthly total'], required: true },
        { label: 'Truncate the date to a month bucket', any: ['date_trunc', 'date_format', 'month', 'year', 'to_char', 'extract'], required: true },
        { label: 'Rank within each month using PARTITION BY the month', any: ['partition by', 'over', 'window', 'rank', 'row_number', 'dense_rank'], required: true },
        { label: 'Filter the rank in an outer query or CTE, not in WHERE', any: ['cte', 'subquery', 'outer', 'where rn', '<= 3', 'qualify'], required: true },
        { label: 'Clarify whether volume means count of transactions or total value', any: ['count', 'value', 'amount', 'volume mean', 'clarify', 'definition'], required: true },
        { label: 'Choose the ranking function deliberately for tie behaviour', any: ['tie', 'row_number', 'dense_rank', 'rank', 'more than 3'] }
      ],
      approach: `<p>This is the canonical top-N-per-group pattern. Say the three steps out loud as you write them, and clarify the ambiguous word in the question.</p>
      <ol>
        <li><strong>Clarify "volume".</strong> Count of transactions or sum of amounts? In a payments context it usually means value, but ask rather than assume, and name your choice in the output column.</li>
        <li><strong>Step one, aggregate:</strong> one row per customer per month.</li>
        <li><strong>Step two, rank inside the month:</strong> PARTITION BY the month bucket, ORDER BY the aggregate descending.</li>
        <li><strong>Step three, filter outside</strong> the CTE, since a window result cannot appear in WHERE.
<pre>WITH monthly AS (
  SELECT DATE_TRUNC('month', txn_date) AS txn_month,
         customer_id,
         SUM(amount) AS total_value
  FROM transactions
  WHERE status = 'success'
  GROUP BY 1, 2
), ranked AS (
  SELECT monthly.*,
         DENSE_RANK() OVER (PARTITION BY txn_month
                            ORDER BY total_value DESC) AS rnk
  FROM monthly
)
SELECT txn_month, customer_id, total_value
FROM ranked
WHERE rnk &lt;= 3
ORDER BY txn_month, rnk;</pre></li>
        <li><strong>Justify the function.</strong> DENSE_RANK returns all customers tied at third place, which is usually what a business wants for a leaderboard. ROW_NUMBER would force exactly three and drop a genuine tie arbitrarily. Say which behaviour you chose and why.</li>
        <li>In MySQL 5.7 or another engine without window functions, mention the correlated-subquery or self-join alternative, since Navi candidates often report MySQL.</li>
      </ol>`,
      answer: `<p>First I would clarify whether volume means transaction count or transacted value, then write it in three steps: aggregate to customer and month, rank within each month, filter the rank outside.</p>
      <pre>WITH monthly AS (
  SELECT DATE_TRUNC('month', txn_date) AS txn_month,
         customer_id,
         SUM(amount) AS total_value
  FROM transactions
  WHERE status = 'success'
  GROUP BY 1, 2
), ranked AS (
  SELECT monthly.*,
         DENSE_RANK() OVER (PARTITION BY txn_month
                            ORDER BY total_value DESC) AS rnk
  FROM monthly
)
SELECT txn_month, customer_id, total_value
FROM ranked
WHERE rnk &lt;= 3
ORDER BY txn_month, rnk;</pre>
      <p>The PARTITION BY restarts the ranking for every month, and the filter sits in the outer query because window functions are evaluated after WHERE. I chose DENSE_RANK so that customers genuinely tied at third all appear, which is what a leaderboard normally wants; ROW_NUMBER would return exactly three rows and silently discard a tie, so the choice should be deliberate rather than habitual. I also filter to successful transactions, since including failed or reversed ones would overstate volume. On an older MySQL without window functions I would use a correlated subquery counting how many customers beat each row within the same month, and keep those with fewer than three.</p>`
    },
    {
      id: 'nv-m2',
      difficulty: 'medium',
      prompt: 'Reported at Navi: find the <strong>second-highest disbursement amount</strong> from a loans table <strong>without using LIMIT</strong>.',
      hint: 'The constraint is the whole question: they want to see if you know more than one way to express "second".',
      concepts: [
        { label: 'Use a window ranking function and filter for rank 2', any: ['dense_rank', 'row_number', 'rank', 'over', 'window'], required: true },
        { label: 'Or use a subquery for the max below the overall max', any: ['subquery', 'max', 'less than', 'nested', 'not in', 'where amount <'], required: true },
        { label: 'Or use a correlated subquery counting distinct greater values', any: ['correlated', 'count', 'distinct', 'greater'], required: true },
        { label: 'Decide whether duplicates count, which selects DENSE_RANK over ROW_NUMBER', any: ['duplicat', 'distinct', 'tie', 'dense_rank', 'same amount'], required: true },
        { label: 'Handle the edge case where no second value exists', any: ['edge case', 'null', 'empty', 'only one', 'no second', 'return nothing'], required: true },
        { label: 'Note OFFSET or TOP are engine-specific alternatives to LIMIT', any: ['offset', 'top', 'fetch', 'engine', 'dialect'] }
      ],
      approach: `<p>Give two clean solutions, then the edge case. The constraint on LIMIT is a hint that they want the window-function answer and a check that you understand duplicates.</p>
      <ol>
        <li><strong>Window version, preferred:</strong>
<pre>WITH ranked AS (
  SELECT loan_id, disbursed_amount,
         DENSE_RANK() OVER (ORDER BY disbursed_amount DESC) AS rnk
  FROM loans
)
SELECT loan_id, disbursed_amount
FROM ranked
WHERE rnk = 2;</pre></li>
        <li><strong>Subquery version</strong>, useful on engines without window functions:
<pre>SELECT MAX(disbursed_amount)
FROM loans
WHERE disbursed_amount &lt; (SELECT MAX(disbursed_amount) FROM loans);</pre></li>
        <li><strong>Explain the duplicate decision.</strong> If three loans share the highest amount, is the second highest the same value or the next distinct one? DENSE_RANK gives the next distinct value, ROW_NUMBER gives the second row of the tied group. The subquery version answers "next distinct value" by construction. State which the business wants.</li>
        <li><strong>Edge cases:</strong> a table with one distinct amount returns NULL from the subquery form and no rows from the window form. Say which behaviour you prefer and why, because that difference matters in a pipeline.</li>
        <li>Mention that OFFSET, TOP or FETCH FIRST would also work but are dialect-specific, so the window version is the portable answer.</li>
      </ol>`,
      answer: `<p>The clean way is a window function:</p>
      <pre>WITH ranked AS (
  SELECT loan_id, disbursed_amount,
         DENSE_RANK() OVER (ORDER BY disbursed_amount DESC) AS rnk
  FROM loans
)
SELECT loan_id, disbursed_amount
FROM ranked
WHERE rnk = 2;</pre>
      <p>And without window functions, a nested aggregate:</p>
      <pre>SELECT MAX(disbursed_amount)
FROM loans
WHERE disbursed_amount &lt; (SELECT MAX(disbursed_amount) FROM loans);</pre>
      <p>The decision worth voicing is how duplicates are treated. If several loans share the top amount, DENSE_RANK returns the next distinct amount while ROW_NUMBER returns the second row within the tied group, and those are different answers to different questions. The nested-aggregate version always gives the next distinct value. I would also flag the edge case where only one distinct amount exists: the subquery returns NULL and the window version returns no rows, which matters if this feeds a downstream job that cannot handle either. A correlated subquery counting distinct larger values is a third option, and OFFSET or TOP would work too but are dialect-specific, which is presumably why LIMIT was ruled out.</p>`
    },
    {
      id: 'nv-m3',
      difficulty: 'medium',
      prompt: 'Reported at Navi: given a repayments table, find <strong>customers who have missed two or more consecutive monthly instalments</strong>.',
      hint: 'Consecutive means you need the previous row in the customer timeline, which is exactly what LAG gives you.',
      concepts: [
        { label: 'Order each customer instalments by month within a partition', any: ['partition by', 'order by', 'per customer', 'timeline', 'over'], required: true },
        { label: 'Use LAG to look at the previous instalment status', any: ['lag', 'previous', 'prior row', 'lead', 'self join'], required: true },
        { label: 'Flag rows where the current and previous instalment are both missed', any: ['both', 'and', 'current and previous', 'two in a row', 'consecutive'], required: true },
        { label: 'Define missed precisely: unpaid, partially paid, or paid after due date', any: ['definition', 'unpaid', 'partial', 'due date', 'what counts', 'status'], required: true },
        { label: 'Beware missing rows: a skipped month may not exist in the table at all', any: ['missing row', 'no row', 'gap', 'calendar', 'absent', 'schedule table'], required: true },
        { label: 'Generalise with gaps and islands for runs of arbitrary length', any: ['gaps and islands', 'island', 'run', 'streak', 'group by difference', 'consecutive count'] }
      ],
      approach: `<p>This is a gaps-and-islands question dressed in lending language. Nail the definition first, because the trap is rows that do not exist.</p>
      <ol>
        <li><strong>Define missed.</strong> Fully unpaid, partially paid, or paid late? In collections these are different states, so state the assumption: instalment status is one row per customer per scheduled month with a status column.</li>
        <li><strong>The trap:</strong> if a missed month produces no row rather than a row with status "missed", LAG compares two paid months either side of a gap and finds nothing. So I would build from the <em>schedule</em> table, which has a row per due instalment, and left join actual payments onto it.</li>
        <li><strong>The LAG solution</strong> for exactly two in a row:
<pre>WITH flagged AS (
  SELECT customer_id, due_month,
         CASE WHEN status = 'missed' THEN 1 ELSE 0 END AS missed,
         LAG(CASE WHEN status = 'missed' THEN 1 ELSE 0 END)
           OVER (PARTITION BY customer_id ORDER BY due_month) AS prev_missed
  FROM instalments
)
SELECT DISTINCT customer_id
FROM flagged
WHERE missed = 1 AND prev_missed = 1;</pre></li>
        <li><strong>Generalise to runs of any length</strong> with the gaps-and-islands trick: number the missed rows per customer and subtract that number from the month index. Consecutive misses share a constant difference, so grouping on it gives each streak and its length, and you filter for length two or more. That is the version to reach for if they ask for three or more.</li>
        <li><strong>Sanity check the output</strong> against known delinquency counts, since this query effectively reproduces a bucket the risk team already reports and disagreeing with them is a finding in itself.</li>
      </ol>`,
      answer: `<p>First I would pin the definition of missed, since unpaid, partly paid and paid-late are different states in collections, and I would flag the real trap: if a missed instalment produces no row rather than a row marked missed, any comparison with the previous row silently steps over the gap. So I would drive the query from the instalment schedule, which has one row per due month, left joined to actual payments.</p>
      <p>For two consecutive misses, LAG is the direct answer:</p>
      <pre>WITH flagged AS (
  SELECT customer_id, due_month,
         CASE WHEN status = 'missed' THEN 1 ELSE 0 END AS missed,
         LAG(CASE WHEN status = 'missed' THEN 1 ELSE 0 END)
           OVER (PARTITION BY customer_id ORDER BY due_month) AS prev_missed
  FROM instalments
)
SELECT DISTINCT customer_id
FROM flagged
WHERE missed = 1 AND prev_missed = 1;</pre>
      <p>For an arbitrary run length I would use gaps and islands: number the missed instalments per customer in date order, subtract that sequence from the month index, and consecutive misses fall into groups with a constant difference. Grouping on customer and that difference gives every streak with its length, so filtering for length two or more, or three or more, needs no rewrite. I would then reconcile the counts against the delinquency buckets the risk team already publishes, because a mismatch means either my definition or theirs is wrong and that is worth knowing before anyone acts on it.</p>`
    },
    {
      id: 'nv-m4',
      difficulty: 'medium',
      prompt: 'Reported at Navi: a query on a large transactions table is <strong>running slowly</strong>. Walk through how you would diagnose and optimise it.',
      hint: 'Read the plan before changing anything, and reduce the rows scanned before tuning anything clever.',
      concepts: [
        { label: 'Read the execution plan first with EXPLAIN', any: ['explain', 'execution plan', 'query plan', 'analyze', 'profil'], required: true },
        { label: 'Look for full table scans and whether indexes are used', any: ['full table scan', 'index', 'scan', 'seek', 'not using'], required: true },
        { label: 'Filter early and use partition pruning to cut rows scanned', any: ['partition', 'prune', 'filter early', 'where', 'date range', 'reduce rows'], required: true },
        { label: 'Avoid functions on indexed columns which prevent index use', any: ['function on', 'sargable', 'cast', 'date(', 'wrap', 'prevents the index', 'left side'], required: true },
        { label: 'Select only needed columns instead of SELECT *', any: ['select *', 'only the columns', 'projection', 'fewer columns'], required: true },
        { label: 'Reduce data before joining and check join order and key types', any: ['before joining', 'pre aggregate', 'join order', 'data type', 'mismatch', 'aggregate first'], required: true },
        { label: 'Check for skew, spill and stale statistics', any: ['skew', 'spill', 'statistic', 'analyze table', 'distribution', 'hot key'] },
        { label: 'Consider a pre-aggregated or materialised table for repeated queries', any: ['materiali', 'summary table', 'aggregate table', 'pre comput', 'cache'] }
      ],
      approach: `<p>Interviewers want a method, not a list of tricks. Measure, then reduce rows, then tune.</p>
      <ol>
        <li><strong>Read the plan.</strong> EXPLAIN or EXPLAIN ANALYZE first: which step dominates, how many rows are estimated versus actually returned, and is it a full scan, a hash join or a nested loop over millions of rows. A large gap between estimated and actual rows usually means stale statistics.</li>
        <li><strong>Cut the rows scanned first,</strong> since that dominates everything else. Restrict the date range, exploit partitioning so the engine prunes to a few days instead of years, and push filters as early as possible.</li>
        <li><strong>Make predicates index-friendly.</strong> Wrapping an indexed column in a function, as in <code>DATE(txn_ts) = '2026-01-01'</code> or an implicit cast between a string and an integer key, stops the index being used. Rewrite as a range filter on the raw column.</li>
        <li><strong>Reduce width and volume.</strong> Replace <code>SELECT *</code> with the columns actually needed, and aggregate or filter inside a CTE before joining, so the join runs on thousands of rows rather than hundreds of millions.</li>
        <li><strong>Check the joins.</strong> Confirm keys are the same data type, look for accidental fan-out that multiplies rows, and prefer joining on the partition or distribution key so the engine can avoid a shuffle.</li>
        <li><strong>Then consider structural fixes:</strong> an index on the real filter and join columns, refreshed statistics, and a pre-aggregated summary table if this query runs on a schedule for a dashboard. For a query that thousands of dashboard loads hit daily, materialising the aggregate is usually the right answer rather than micro-tuning.</li>
        <li><strong>Measure again</strong> and quote the before and after, since an optimisation nobody timed is an opinion.</li>
      </ol>`,
      answer: `<p>I would start with EXPLAIN or EXPLAIN ANALYZE rather than guessing, and identify which operation dominates the cost, how many rows it touches, and whether estimated and actual row counts diverge, which points at stale statistics. Then I would attack the biggest lever first, which is almost always the number of rows scanned: tighten the time window, make sure the filter lets the engine prune partitions instead of reading the whole history, and push filters as early as possible.</p>
      <p>Next I would check that predicates can use indexes. Wrapping an indexed column in a function or comparing mismatched data types silently disables the index, so <code>DATE(txn_ts) = '2026-01-01'</code> becomes a range filter on the raw timestamp. I would replace <code>SELECT *</code> with only the needed columns, and pre-aggregate or filter inside a CTE before joining so joins operate on a much smaller set. On the joins themselves I would verify key data types match, watch for fan-out that multiplies rows unintentionally, and where possible join on the partition or distribution key to avoid a shuffle. I would also look for skew, since one hot customer or merchant key can serialise an otherwise parallel query.</p>
      <p>Only after that would I consider structural changes: adding an index that matches the real filter and join columns, refreshing statistics, or building a pre-aggregated summary table if this is a scheduled or dashboard query rather than a one-off. Finally I would re-measure and report the before and after runtime, because the point is a demonstrated improvement rather than a list of applied tricks.</p>`
    },
    {
      id: 'nv-m5',
      difficulty: 'medium',
      prompt: 'Reported at Navi: <strong>design a dashboard to track the health of a new personal loan product</strong>. What goes on it, and what do you deliberately leave off?',
      hint: 'Follow the money through the lifecycle, and remember the newest cohorts cannot show their true risk yet.',
      concepts: [
        { label: 'Start from the audience and the decisions the dashboard must support', any: ['audience', 'who', 'decision', 'action', 'stakeholder', 'purpose'], required: true },
        { label: 'Funnel section: applications, approval rate, disbursal conversion, ticket size', any: ['funnel', 'approval', 'disburs', 'application', 'ticket size', 'conversion'], required: true },
        { label: 'Risk section: early delinquency and default by disbursal cohort or vintage', any: ['default', 'delinquen', 'cohort', 'vintage', 'fpd', 'risk', 'npa'], required: true },
        { label: 'Unit economics: yield, credit cost, acquisition cost, contribution per loan', any: ['unit econom', 'margin', 'yield', 'cac', 'profit', 'credit cost', 'contribution'], required: true },
        { label: 'Operational health: pipeline freshness, KYC and payment failures, TAT', any: ['operational', 'tat', 'turnaround', 'failure', 'kyc', 'freshness', 'sla'], required: true },
        { label: 'Segment cuts and a clear time grain with comparisons against target', any: ['segment', 'cut by', 'city', 'channel', 'time grain', 'daily', 'target', 'forecast'], required: true },
        { label: 'Leave off vanity metrics and anything nobody would act on', any: ['vanity', 'leave off', 'exclude', 'not include', 'clutter', 'no action'], required: true },
        { label: 'Cohort immaturity must be shown honestly, not hidden', any: ['immature', 'season', 'not yet', 'lag', 'caveat', 'incomplete'], required: true }
      ],
      approach: `<p>Structure the dashboard as the loan lifecycle, and win the question on two points: cohort-based risk, and what you refuse to put on it.</p>
      <ol>
        <li><strong>Start with the audience.</strong> A daily operating dashboard for the product and risk team is a different object from a weekly leadership view. Assume the former, state the assumption, and design for the decisions: keep scaling, tighten policy, or fix an operational break.</li>
        <li><strong>Row one, volume and funnel:</strong> applications, KYC completion, approval rate, approval to disbursal conversion, disbursed count and value, average ticket size and tenure, each against target and last week.</li>
        <li><strong>Row two, risk by vintage:</strong> first payment default and 30 and 90 day delinquency plotted by disbursal cohort at equal months on book. This is the row that keeps the product honest, and plotting by vintage rather than in aggregate is the single most important design decision.</li>
        <li><strong>Row three, economics:</strong> yield, expected credit loss, acquisition cost per disbursed loan and risk-adjusted contribution per loan, so growth and profitability are visible together.</li>
        <li><strong>Row four, operations:</strong> application turnaround time, KYC and bureau-call failure rates, repayment collection success rate by method, plus data freshness so nobody trusts a stale tile.</li>
        <li><strong>Cuts and grain:</strong> daily with week and month toggles, segmented by acquisition channel, city tier, customer segment and risk band, because every decision here is made at segment level.</li>
        <li><strong>What I leave off:</strong> total registered users and other vanity counts, page-level clickstream nobody acts on, and any aggregate default rate that mixes cohorts of different ages, which flatters a growing book and is genuinely misleading. I would also annotate immature cohorts explicitly rather than let a reader treat a two-week-old number as real.</li>
      </ol>`,
      answer: `<p>I would design it as the loan lifecycle, for a named audience. Assuming a daily operating view for the product and risk teams, the decisions it must support are whether to keep scaling, whether to tighten credit policy, and whether something operational is broken.</p>
      <p>The first section is the funnel: applications, KYC completion, approval rate, approval to disbursal conversion, disbursed count and value, average ticket size and tenure, each against target and prior period. The second section is risk by vintage: first payment default and 30 and 90 day delinquency, plotted by disbursal cohort at equal months on book. Plotting risk by cohort rather than in aggregate is the most important choice on the whole dashboard, because a fast-growing book dilutes its own default rate and looks safer than it is. The third section is unit economics: yield, expected credit loss, acquisition cost per disbursed loan and risk-adjusted contribution, so nobody celebrates volume that loses money. The fourth is operational health: application turnaround time, KYC and bureau failure rates, repayment collection success by method, and a data freshness indicator. Everything is cut by channel, city tier, customer segment and risk band, at a daily grain with weekly and monthly toggles.</p>
      <p>I would deliberately leave off vanity metrics such as total registered users, granular clickstream nobody would act on, and above all any single blended default rate across cohorts of different ages. I would also label immature cohorts clearly, because the honest statement early in a product launch is that the risk number does not exist yet, and a dashboard that hides that leads to confident and wrong decisions.</p>`
    },

    /* ---------------------------- HARD ---------------------------- */
    {
      id: 'nv-h1',
      difficulty: 'hard',
      prompt: 'Reported at Navi: from a loan repayments table, calculate the <strong>rolling 30-day default rate</strong>. Define it, then write it.',
      hint: 'The hard part is not the window syntax, it is deciding the numerator, the denominator and the as-of date.',
      concepts: [
        { label: 'Define the numerator and denominator explicitly before writing SQL', any: ['numerator', 'denominator', 'define', 'definition', 'what counts'], required: true },
        { label: 'Default needs a threshold: days past due such as 30 or 90 DPD', any: ['dpd', 'days past due', 'threshold', '30 day', '90 day', 'overdue'], required: true },
        { label: 'Rolling window over dates, not over rows', any: ['range between', 'rows between', 'interval', 'rolling', '30 preceding', 'window frame'], required: true },
        { label: 'Use a date spine or calendar table so days with no activity still appear', any: ['calendar', 'date spine', 'generate_series', 'all dates', 'missing days'], required: true },
        { label: 'Amount-weighted versus count-based default rate answer different questions', any: ['amount', 'weighted', 'count based', 'value', 'by number'], required: true },
        { label: 'Denominator must reflect loans at risk, not the whole book', any: ['at risk', 'eligible', 'outstanding', 'exposure', 'due in', 'active loans'], required: true },
        { label: 'Cohort immaturity: recent disbursals cannot have defaulted yet', any: ['immature', 'season', 'recent', 'cannot have', 'lag', 'vintage', 'not yet'], required: true },
        { label: 'Verify against the risk team published numbers', any: ['reconcil', 'verify', 'risk team', 'cross check', 'compare with', 'validate'] }
      ],
      approach: `<p>Every candidate can write a window frame. The differentiator is defining the metric, because "default rate" is ambiguous in three separate ways.</p>
      <ol>
        <li><strong>Fix the definition.</strong> Numerator: loans that crossed the delinquency threshold, say 30 days past due, within the window. Denominator: loans at risk in that window, meaning loans with an instalment due, not the entire book. Using the whole book as denominator dilutes the rate as the book grows and is the most common error.</li>
        <li><strong>Choose count or value.</strong> A count-based rate answers "how many customers went bad", an amount-weighted rate answers "how much money is at risk". Risk teams typically want both; state which you are producing.</li>
        <li><strong>Build a date spine</strong> so every calendar day appears even when nothing happened, otherwise the rolling window silently spans a different number of real days.</li>
        <li><strong>Window over an interval, not a row count:</strong>
<pre>WITH daily AS (
  SELECT due_date,
         COUNT(DISTINCT CASE WHEN days_past_due &gt;= 30
                             THEN loan_id END) AS defaulted,
         COUNT(DISTINCT loan_id)               AS at_risk
  FROM instalments
  GROUP BY due_date
)
SELECT due_date,
       SUM(defaulted) OVER w * 1.0 / NULLIF(SUM(at_risk) OVER w, 0)
         AS rolling_30d_default_rate
FROM daily
WINDOW w AS (ORDER BY due_date
             RANGE BETWEEN INTERVAL '29 days' PRECEDING AND CURRENT ROW);</pre>
        RANGE over an interval is what makes it a true 30-day window; ROWS BETWEEN 29 PRECEDING would count 30 rows, which is wrong the moment a date is missing. NULLIF guards against dividing by zero on quiet days.</li>
        <li><strong>State the vintage caveat.</strong> Loans disbursed in the last month cannot have reached 30 DPD, so a rolling rate over a growing book trends down for purely mechanical reasons. If the question is about credit quality rather than portfolio monitoring, the right answer is a vintage curve at equal months on book, and I would say so.</li>
        <li><strong>Reconcile</strong> the output against the risk team official delinquency reporting before anyone uses it, since regulatory definitions may differ from the intuitive one.</li>
      </ol>`,
      answer: `<p>I would define the metric before writing anything. The numerator is loans crossing a stated delinquency threshold, for example 30 days past due, inside the window. The denominator is loans genuinely at risk in that window, meaning those with an instalment due, not the whole portfolio, because using the total book dilutes the rate mechanically as the book grows. I would also ask whether they want a count-based rate, which measures how many borrowers went bad, or an amount-weighted rate, which measures exposure.</p>
      <p>Then I would aggregate to daily grain over a calendar spine so days with no activity still exist, and use a range-based window frame:</p>
      <pre>WITH daily AS (
  SELECT due_date,
         COUNT(DISTINCT CASE WHEN days_past_due &gt;= 30
                             THEN loan_id END) AS defaulted,
         COUNT(DISTINCT loan_id)               AS at_risk
  FROM instalments
  GROUP BY due_date
)
SELECT due_date,
       SUM(defaulted) OVER w * 1.0 / NULLIF(SUM(at_risk) OVER w, 0)
         AS rolling_30d_default_rate
FROM daily
WINDOW w AS (ORDER BY due_date
             RANGE BETWEEN INTERVAL '29 days' PRECEDING AND CURRENT ROW);</pre>
      <p>RANGE over an interval is deliberate: <code>ROWS BETWEEN 29 PRECEDING</code> counts thirty rows rather than thirty days and silently drifts whenever a date is missing. NULLIF prevents division by zero on days with nothing due.</p>
      <p>The caveat I would state out loud is cohort immaturity. Loans disbursed within the last month cannot yet be 30 days past due, so on a growing book this rolling rate falls for arithmetic reasons rather than because credit quality improved. It is a fine operational monitor, but if the real question is whether underwriting is getting better or worse, the correct answer is a vintage curve comparing cohorts at the same months on book. I would also reconcile my output against the risk team published delinquency numbers, since regulatory definitions of default often differ from the intuitive one.</p>`
    },
    {
      id: 'nv-h2',
      difficulty: 'hard',
      prompt: 'Reported at Navi: the <strong>UPI payment success rate drops 5% overnight</strong> with no release. Diagnose it, and decide what you would do inside an hour.',
      hint: 'Failures carry reason codes, and an external partner is the prime suspect when nothing shipped.',
      concepts: [
        { label: 'Confirm the drop is real: check attempt volume and both client and server logging', any: ['is it real', 'logging', 'pipeline', 'attempt volume', 'instrument', 'verify', 'data issue'], required: true },
        { label: 'Break the payment flow into steps to find where the loss happens', any: ['step', 'funnel', 'stage', 'collect request', 'callback', 'authoris', 'authoriz'], required: true },
        { label: 'Group failures by error or decline reason code', any: ['error code', 'reason code', 'decline', 'failure reason', 'response code', 'rc'], required: true },
        { label: 'Segment by issuing bank, PSP, handle and payment method', any: ['bank', 'issuer', 'psp', 'gateway', 'handle', 'vpa', 'npci'], required: true },
        { label: 'No release points at an external dependency: bank downtime or NPCI level issue', any: ['external', 'bank downtime', 'npci', 'third party', 'partner', 'no deploy', 'outage'], required: true },
        { label: 'Check config, feature flags and certificate or credential expiry', any: ['config', 'feature flag', 'certificate', 'credential', 'expiry', 'token', 'key rotation'], required: true },
        { label: 'Rank hypotheses by affected volume rather than by interest', any: ['rank', 'priorit', 'volume', 'contribution', 'biggest', 'share of'], required: true },
        { label: 'Act reversibly: reroute or failover, escalate to the partner, then verify recovery', any: ['reroute', 'failover', 'switch', 'escalat', 'rollback', 'retry', 'verify', 'monitor'], required: true },
        { label: 'Quantify customer and revenue impact during the window', any: ['quantif', 'impact', 'lost', 'affected users', 'revenue', 'how many'] }
      ],
      approach: `<p>Treat it as an incident. The absence of a release is the strongest clue in the question: it redirects suspicion to dependencies and config rather than to your own code.</p>
      <ol>
        <li><strong>Ten minutes of validation.</strong> Are attempts normal? If attempts collapsed too, the problem is upstream of payments. Does both client and server logging show it? A one-sided drop suggests instrumentation. Confirm the pipeline is not partially loaded.</li>
        <li><strong>Decompose the flow:</strong> intent or collect request created, sent to PSP, NPCI routing, issuer authorisation, callback received, order marked paid. Success rate is a chain and exactly one link will own the loss.</li>
        <li><strong>Read the reason codes.</strong> Compare the distribution of decline and error codes against the same hour yesterday. This usually solves it outright: a spike in issuer timeouts, invalid VPA, insufficient funds or a specific NPCI response code each point somewhere different.</li>
        <li><strong>Segment on the payments dimensions:</strong> issuing bank, PSP, UPI handle, app version, geography and hour. If the loss concentrates in two banks, it is bank-side downtime; if it is one PSP across all banks, it is your provider; if it is spread evenly, suspect something central such as NPCI or your own config.</li>
        <li><strong>Since nothing shipped,</strong> check what changes without a deploy: feature flags, config or rate-limit changes, certificate and credential expiry, key rotation, a partner-side release, a scheduled bank maintenance window, and month-end or salary-day load spikes causing timeouts.</li>
        <li><strong>Rank by contribution:</strong> affected volume times the drop in each segment, so effort follows lost transactions.</li>
        <li><strong>Act reversibly within the hour:</strong> reroute or failover to an alternate PSP if one provider is degraded, tune retry behaviour, or disable a suspect flag; escalate to the bank or PSP with the reason-code evidence when it is their side; and communicate a status with what is known, ruled out and next steps. In an incident, a justified reroute beats a perfect diagnosis.</li>
        <li><strong>Then verify recovery</strong> on the same chart, quantify failed transactions and affected customers during the window, and add an alert on success rate by bank and PSP so the next occurrence is caught in minutes rather than by a dashboard glance.</li>
      </ol>`,
      answer: `<p>I would run it as an incident. First a quick validation pass: are attempt volumes normal, does the drop appear in both client and server logging, and is the data pipeline complete. If attempts fell too, the problem sits upstream of payments entirely; if only one logging source moved, it may be measurement.</p>
      <p>Then I would decompose the UPI flow into collect request created, sent to PSP, NPCI routing, issuer authorisation, callback received and order marked paid, and find which link is losing transactions. In parallel I would compare the distribution of decline and error reason codes against the same hour on previous days, which usually identifies the layer immediately, and segment by issuing bank, PSP, handle, app version, geography and hour. The pattern is diagnostic: concentration in a couple of banks means bank-side downtime, concentration in one PSP across all banks means the provider, and an even spread points at something central such as NPCI routing or our own configuration.</p>
      <p>Because no release shipped, I would specifically check the things that change without a deploy: feature flags and config, rate limits, certificate or credential expiry and key rotation, a partner-side release, scheduled bank maintenance, and load spikes around salary or month-end dates causing timeouts. I would rank candidates by affected volume times the drop in each segment so effort follows lost payments.</p>
      <p>Within the hour I would recommend the most reversible action the evidence supports: failover or reroute to an alternate PSP if one provider is degraded, adjust retries, or disable a suspect flag, and escalate to the bank or PSP with reason-code evidence when the failure is on their side. I would send a short status covering what is confirmed, what is ruled out, the leading hypothesis and the next update time. Afterwards, verify recovery on the same chart, quantify the failed transactions, affected customers and revenue during the window, and add alerting on success rate segmented by bank and PSP so this is detected automatically next time.</p>`
    },
    {
      id: 'nv-h3',
      difficulty: 'hard',
      prompt: 'Reported at Navi: you are asked to <strong>evaluate the risk of lending to a new customer segment</strong> with little internal history. Which data points do you prioritise, and how do you decide?',
      hint: 'You are being asked to make a decision under thin data, so the design of the experiment matters as much as the variables.',
      concepts: [
        { label: 'Bureau data: credit score, existing obligations, enquiry velocity, past delinquency', any: ['bureau', 'cibil', 'credit score', 'obligation', 'enquir', 'past delinquen', 'history'], required: true },
        { label: 'Ability to repay: income, employment stability, debt to income or FOIR', any: ['income', 'employment', 'debt to income', 'foir', 'dti', 'affordab', 'salary'], required: true },
        { label: 'Alternative and behavioural data where bureau history is thin', any: ['alternative data', 'bank statement', 'cash flow', 'utility', 'device', 'app usage', 'thin file', 'upi'], required: true },
        { label: 'Willingness to pay signals distinct from ability to pay', any: ['willingness', 'intent', 'behaviour', 'repayment history', 'discipline'], required: true },
        { label: 'Find a proxy population or lookalike segment already on the book', any: ['proxy', 'lookalike', 'similar', 'existing segment', 'analog', 'comparable'], required: true },
        { label: 'Limit exposure with a controlled pilot: small tickets, capped volume, test and control', any: ['pilot', 'test', 'small ticket', 'cap', 'limit exposure', 'champion challenger', 'control group'], required: true },
        { label: 'Define the decision metric as risk-adjusted profitability, not approval or default alone', any: ['risk adjusted', 'profit', 'unit econom', 'expected loss', 'margin', 'not just default'], required: true },
        { label: 'Account for the lag: define early risk indicators and pre-set stop rules', any: ['fpd', 'early indicator', 'lag', 'season', 'stop rule', 'kill', 'threshold', 'monitor'], required: true },
        { label: 'Watch selection bias and reject inference', any: ['selection bias', 'reject inference', 'survivor', 'only approved', 'biased sample'] },
        { label: 'Respect regulatory and fairness constraints on variables used', any: ['regulat', 'fair', 'complian', 'discriminat', 'rbi', 'permissible', 'legal'] }
      ],
      approach: `<p>Two halves: which variables predict repayment, and how you learn safely when you have no history. The second half is what senior candidates add.</p>
      <ol>
        <li><strong>Separate ability from willingness.</strong> Ability: income and its stability, employment type, existing EMI obligations and debt-to-income or FOIR. Willingness: past repayment behaviour, bureau delinquency history, and enquiry velocity, which flags someone shopping desperately for credit across lenders.</li>
        <li><strong>Bureau first, then alternatives.</strong> Score, vintage of credit history, current obligations, DPD history, write-offs and settlements. For a thin-file segment, supplement with permissible alternative data: bank statement cash flows, salary credit regularity, UPI transaction patterns, and device or app signals, subject to consent and regulation.</li>
        <li><strong>Find a proxy.</strong> With no internal history, the fastest honest read is a lookalike population already on the book that resembles the new segment on the observable dimensions, and reading its vintage curves. State clearly that it is an approximation.</li>
        <li><strong>Design a controlled pilot rather than a launch.</strong> Small ticket sizes, shorter tenures, a hard cap on total exposure, and a randomised or champion-challenger structure so the segment performance can be compared against an equivalent control. This converts an unanswerable question into a measurable one at bounded cost.</li>
        <li><strong>Pre-define the decision.</strong> The metric is risk-adjusted contribution per loan: yield minus expected credit loss minus acquisition and servicing cost. A segment with a higher default rate can still be a good business at the right price, which is why default rate alone is the wrong lens.</li>
        <li><strong>Handle the lag.</strong> Final losses take months, so define early indicators, first payment default and 30 DPD at equal months on book, with pre-agreed stop rules that pause the pilot automatically if a threshold breaks. Deciding thresholds in advance is what prevents an argument later.</li>
        <li><strong>Name the biases.</strong> You only observe repayment for applicants you approved, so the sample is selected; reject inference or a deliberately small random approval slice mitigates it. Also confirm every variable used is permissible and fair, since some correlates are legally off limits regardless of predictive power.</li>
      </ol>`,
      answer: `<p>I would split the variables into ability and willingness to repay. Ability: declared and verified income, income stability, employment type, existing EMI obligations and the resulting debt-to-income or FOIR. Willingness: bureau repayment history including DPD, write-offs and settlements, credit history vintage, and enquiry velocity, since a burst of applications across lenders is a strong negative signal. For a segment with thin bureau files I would add permissible alternative data such as bank statement cash flows, regularity of salary credits, UPI transaction patterns and device signals, within consent and regulatory limits.</p>
      <p>With little internal history, the method matters more than the variable list. First I would find a lookalike population already on the book that resembles the new segment on observable dimensions and read its vintage curves as an approximation, stating that caveat plainly. Then rather than launching, I would design a controlled pilot: small tickets, shorter tenure, a hard cap on aggregate exposure, and a champion-challenger or randomised structure so the new segment can be compared against an equivalent control instead of against the portfolio average.</p>
      <p>The decision metric is risk-adjusted contribution per loan, meaning yield minus expected credit loss minus acquisition and servicing cost. A riskier segment can be perfectly good business if priced for it, so judging on default rate alone would reject profitable growth. Because losses season slowly, I would pre-define early indicators such as first payment default and 30 DPD at equal months on book, together with stop rules that pause the pilot automatically when a threshold is breached, agreed before launch rather than debated after.</p>
      <p>Finally I would name the traps: performance is only observed for approved applicants, so the sample is selected and needs reject inference or a small random approval slice to correct; and every variable must be checked for regulatory permissibility and fairness, because some highly predictive correlates are not legally usable.</p>`
    },
    {
      id: 'nv-h4',
      difficulty: 'hard',
      prompt: 'Reported at Navi: <strong>estimate the number of UPI transactions in Bengaluru on a typical Monday.</strong> State your assumptions.',
      hint: 'Population, then smartphone and UPI adoption, then transactions per active user per day, then a Monday adjustment.',
      numeric: { value: 3.5e7, display: 'roughly 30 to 40 million (about 3 to 4 crore) UPI transactions a day', tolerance: 4 },
      concepts: [
        { label: 'Start from Bengaluru population, around 13 to 14 million', any: ['13 million', '14 million', '1.3 crore', '1.4 crore', 'population', '12 million'], required: true },
        { label: 'Apply smartphone and bank account penetration to get eligible users', any: ['smartphone', 'penetration', 'bank account', 'eligible', 'adult', 'adoption'], required: true },
        { label: 'Apply UPI adoption to reach active UPI users', any: ['upi user', 'adoption', 'active user', 'share of', 'percent'], required: true },
        { label: 'Assume transactions per active user per day', any: ['per user per day', 'transactions per', 'per day', 'frequency', '3', '4', '5'], required: true },
        { label: 'Adjust for Monday being a working day with higher commercial activity', any: ['monday', 'working day', 'weekday', 'higher', 'commut', 'office'], required: true },
        { label: 'Bengaluru skews high on digital adoption relative to national average', any: ['skew', 'tech', 'metro', 'above average', 'higher adoption', 'urban'], required: true },
        { label: 'Sanity check against national UPI volumes', any: ['national', 'india', 'sanity', 'cross check', 'billion', 'nationwide', 'total upi'], required: true },
        { label: 'State a range and the assumption the answer is most sensitive to', any: ['range', 'sensitiv', 'assumption', 'uncertain', 'depends on'] }
      ],
      approach: `<p>Guesstimates are graded on structure and stated assumptions, not on hitting a number. Build top down, then sanity check against a figure you already know.</p>
      <ol>
        <li><strong>Population:</strong> Bengaluru urban is roughly 13 to 14 million people. Take 13 million.</li>
        <li><strong>Eligible adults:</strong> about 75% are of transacting age, so roughly 10 million.</li>
        <li><strong>Digital access:</strong> Bengaluru is India most digitally advanced large city, so assume around 80% have a smartphone and bank account, giving about 8 million.</li>
        <li><strong>UPI adoption among those:</strong> roughly 75% actively use UPI, giving about 6 million active UPI users.</li>
        <li><strong>Frequency:</strong> an active user makes perhaps 5 transactions on a working day, counting auto and metro fares, tea and lunch, groceries, a delivery app and a peer transfer. That gives about 30 million transactions.</li>
        <li><strong>Monday adjustment:</strong> Mondays are full working days with commuting and office spend, so nudge up perhaps 15%, landing near 35 million, and add merchant and business-to-business flows to reach the upper end of the range.</li>
        <li><strong>Sanity check:</strong> India processes on the order of 500 to 600 million UPI transactions daily. Bengaluru is about 1% of the population but far above average in digital adoption, so 5 to 7% of national volume is plausible, which is 25 to 40 million. The two approaches agree, which is the part interviewers actually reward.</li>
        <li><strong>Close with the sensitivity:</strong> the answer hinges almost entirely on transactions per user per day. At 3 it is 20 million, at 8 it is 50 million, so I would quote 30 to 40 million and name that assumption as the one to firm up.</li>
      </ol>`,
      answer: `<p>Building it top down: Bengaluru has roughly 13 million people, of whom about 75% are of transacting age, giving 10 million adults. Bengaluru is unusually digital for an Indian city, so I would assume around 80% have a smartphone and bank account, leaving 8 million, and that about 75% of those are active UPI users, so roughly 6 million active users.</p>
      <p>An active user on a working day probably makes about 5 UPI payments across commute, food, groceries, a delivery app and a peer transfer, giving roughly 30 million transactions. Monday is a full working day with commuting and office-adjacent spending, so I would adjust up by around 15% and allow for merchant and business flows, landing at approximately <strong>30 to 40 million transactions</strong>, call it 35 million.</p>
      <p>As a cross-check, India processes on the order of 500 to 600 million UPI transactions per day. Bengaluru holds about 1% of the population but indexes far above average on digital payments, so 5 to 7% of national volume is reasonable, which is 25 to 40 million. The two independent routes agree, which gives me confidence in the order of magnitude.</p>
      <p>The number is most sensitive to transactions per active user per day: at 3 the estimate falls to around 20 million and at 8 it rises to 50 million. So I would quote a range rather than a point, and say that if precision mattered I would firm up that single assumption first, ideally from our own UPI usage data.</p>`
    },
    {
      id: 'nv-h5',
      difficulty: 'hard',
      prompt: 'Reported at Navi: <strong>how would you copy or move a very large dataset</strong>, for example a billion-row transactions table, from one system to another without breaking anything?',
      hint: 'Never one giant statement. Think chunks, idempotency and a reconciliation step.',
      concepts: [
        { label: 'Clarify the requirement: one-off migration or ongoing replication, and downtime tolerance', any: ['one off', 'ongoing', 'replicat', 'downtime', 'requirement', 'clarify', 'sync'], required: true },
        { label: 'Chunk the transfer by partition, date range or key range instead of one statement', any: ['chunk', 'batch', 'partition', 'date range', 'key range', 'slice', 'incremental'], required: true },
        { label: 'Make each chunk idempotent and safely re-runnable after failure', any: ['idempot', 're run', 'rerun', 'retry', 'resume', 'checkpoint', 'restart'], required: true },
        { label: 'Bulk load and unload rather than row-by-row inserts', any: ['bulk', 'copy command', 'export', 'parquet', 'unload', 'file', 'batch insert', 'row by row'], required: true },
        { label: 'Do a full historical backfill, then a delta catch-up for rows changed during it', any: ['backfill', 'delta', 'catch up', 'incremental', 'changed since', 'cdc', 'watermark'], required: true },
        { label: 'Reconcile after loading: row counts, checksums and control totals', any: ['reconcil', 'row count', 'checksum', 'control total', 'validate', 'verify', 'audit'], required: true },
        { label: 'Protect the source: throttle, run off-peak, or read from a replica or snapshot', any: ['throttle', 'off peak', 'replica', 'snapshot', 'load on the source', 'rate limit', 'production impact'], required: true },
        { label: 'Handle late-arriving and mutable rows with an updated-at watermark', any: ['late arriv', 'updated_at', 'watermark', 'mutable', 'changes after', 'soft delete'], required: true },
        { label: 'Plan cutover and rollback, keeping the old system readable until verified', any: ['cutover', 'rollback', 'dual write', 'keep the old', 'switch', 'fallback'], required: true },
        { label: 'Consider compression, schema and type mapping between systems', any: ['compress', 'schema', 'data type', 'mapping', 'encoding', 'format'] }
      ],
      approach: `<p>The trap answer is a single INSERT ... SELECT that runs for six hours, locks the source and fails at 90% with no way to resume. Structure the answer around chunking, idempotency and verification.</p>
      <ol>
        <li><strong>Clarify first:</strong> a one-off migration or continuous replication? How much downtime is acceptable? Are rows immutable, or can old rows be updated? Does the target need to be queryable during the move? Those answers change the design completely.</li>
        <li><strong>Chunk it.</strong> Split by natural partition, usually date, or by primary key range, and move one chunk at a time with a checkpoint table recording which chunks are done. That gives restartability, bounded transactions, and a progress number you can report.</li>
        <li><strong>Make chunks idempotent.</strong> Each chunk should be safe to re-run: overwrite that partition, or delete-then-insert its key range, or upsert on primary key. Idempotency is what lets a failed run be retried without producing duplicates, which is the single most important property.</li>
        <li><strong>Use bulk paths.</strong> Export to a columnar format such as Parquet on object storage and bulk load it, rather than row-by-row inserts. Compress in transit, and drop or disable indexes on the target during load, rebuilding them afterwards.</li>
        <li><strong>Two phases:</strong> a historical backfill of everything up to a watermark, then a delta phase for rows created or modified since, using an updated-at column, change data capture or a log. Repeat the delta until it is small enough to apply within the downtime budget, then cut over.</li>
        <li><strong>Protect production.</strong> Read from a replica or a consistent snapshot rather than the primary, throttle concurrency, and run heavy phases off-peak so the transfer does not degrade the live system.</li>
        <li><strong>Reconcile before trusting.</strong> Row counts per partition, sums of key numeric columns as control totals, min and max of the key range, plus checksums or hashes on a sample. Also compare a few full rows to catch type and precision drift such as timestamps losing timezone or decimals rounding.</li>
        <li><strong>Plan the cutover and the rollback:</strong> keep the source readable and authoritative until reconciliation passes, dual-write or dual-read briefly if the system is live, and document how to revert. Finish by monitoring the new pipeline for the first few cycles.</li>
      </ol>`,
      answer: `<p>I would not attempt it as one statement. First I would clarify the requirement: one-off migration or ongoing replication, how much downtime is tolerable, whether historical rows are immutable or can be updated, and whether the target must be queryable during the move.</p>
      <p>Then I would chunk the transfer, normally by date partition or primary key range, with a checkpoint table recording completed chunks so the job is restartable and its progress is visible. Every chunk must be idempotent, whether by overwriting that partition, deleting and reinserting its key range, or upserting on primary key, because that is what makes a failed run safe to retry without creating duplicates. I would move data over bulk paths, exporting to a compressed columnar format such as Parquet and bulk loading it rather than inserting row by row, and I would disable or drop target indexes during the load and rebuild them after.</p>
      <p>The transfer itself runs in two phases: a full historical backfill up to a watermark, then a delta phase picking up rows created or modified since, driven by an updated-at column or change data capture, repeated until the remaining delta is small enough to apply inside the downtime budget. Throughout, I would read from a replica or consistent snapshot and throttle concurrency so production is not degraded, running the heaviest phases off-peak.</p>
      <p>Before anyone trusts the target I would reconcile: row counts per partition, control totals on key numeric columns, min and max of the key range, checksums on samples, and a full-row comparison for a handful of records to catch type and precision drift such as timezone loss or decimal rounding. For cutover I would keep the source authoritative and readable until reconciliation passes, dual-read or dual-write briefly if the system is live, document the rollback path, and monitor the new pipeline for its first several cycles before declaring the migration done.</p>`
    }
  ]
});
