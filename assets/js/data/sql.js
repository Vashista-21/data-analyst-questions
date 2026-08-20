DAQ.registerTopic({
  id: 'sql',
  group: 'prep',
  name: 'SQL',
  icon: '\uD83D\uDDC4\uFE0F',
  blurb: 'Filtering, joins, aggregation, window functions and the classic analyst round-one queries.',
  questions: [
    /* ---------------------------- EASY ---------------------------- */
    {
      id: 'sql-e1',
      difficulty: 'easy',
      prompt: 'What is the difference between <code>WHERE</code> and <code>HAVING</code>? When would you be forced to use <code>HAVING</code>?',
      hint: 'Think about the order in which SQL processes a query: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY.',
      concepts: [
        { label: 'WHERE filters individual rows before grouping', any: ['before group', 'before aggregat', 'row level', 'filters rows', 'individual rows', 'pre aggregation'], required: true },
        { label: 'HAVING filters groups after aggregation', any: ['after group', 'after aggregat', 'filters groups', 'group level', 'on the aggregated', 'post aggregation'], required: true },
        { label: 'HAVING can reference aggregate functions such as COUNT or SUM', any: ['aggregate function', 'count', 'sum', 'avg', 'aggregate'] },
        { label: 'WHERE runs earlier, so filtering there is cheaper', any: ['faster', 'cheaper', 'performance', 'efficient', 'fewer rows', 'less data'] }
      ],
      approach: `<p>Answer this through the <strong>logical order of execution</strong> rather than by memorising a rule. SQL resolves a query as
        <code>FROM &rarr; WHERE &rarr; GROUP BY &rarr; HAVING &rarr; SELECT &rarr; ORDER BY</code>.</p>
      <ol>
        <li><code>WHERE</code> sits before <code>GROUP BY</code>, so it can only see raw column values of single rows.</li>
        <li><code>HAVING</code> sits after <code>GROUP BY</code>, so it can see aggregates such as <code>COUNT(*)</code> or <code>SUM(amount)</code>.</li>
        <li>That is why <code>WHERE COUNT(*) &gt; 5</code> fails but <code>HAVING COUNT(*) &gt; 5</code> works.</li>
      </ol>
      <p>Close with the practical point: push every row-level condition into <code>WHERE</code> so fewer rows reach the grouping step, and keep only genuine aggregate conditions in <code>HAVING</code>.</p>`,
      answer: `<p><strong>WHERE</strong> filters rows before aggregation; <strong>HAVING</strong> filters the grouped result after aggregation.</p>
      <pre>SELECT department, COUNT(*) AS headcount
FROM employees
WHERE status = 'active'        -- row-level filter, runs first
GROUP BY department
HAVING COUNT(*) &gt; 5;          -- group-level filter, runs after</pre>
      <p>You are forced into <code>HAVING</code> whenever the condition depends on an aggregate. Because <code>WHERE</code> reduces the data earlier, it is the cheaper place to filter whenever the condition is row-level.</p>`
    },
    {
      id: 'sql-e2',
      difficulty: 'easy',
      prompt: 'Write a query to find the <strong>second highest salary</strong> from an <code>employees</code> table. What happens if two people share the top salary?',
      context: 'employees(emp_id, name, department, salary, manager_id)',
      hint: 'DENSE_RANK handles ties the way an interviewer expects; LIMIT 1 OFFSET 1 does not.',
      concepts: [
        { label: 'Rank with DENSE_RANK, or use a nested MAX / LIMIT-OFFSET', any: ['dense rank', 'row number', 'rank', 'max', 'limit', 'offset'], required: true },
        { label: 'Exclude the highest salary from the candidate set', any: ['less than', 'offset 1', 'not in', 'exclude', '2', 'second'] },
        { label: 'DENSE_RANK or DISTINCT handles duplicate top salaries', any: ['dense rank', 'distinct', 'duplicate', 'ties', 'tie'] },
        { label: 'Return NULL when a second distinct salary does not exist', any: ['null', 'no second', 'does not exist', 'empty', 'nothing'] }
      ],
      approach: `<p>Interviewers use this to see whether you think about <strong>ties</strong> and <strong>empty results</strong>, not whether you can sort.</p>
      <ol>
        <li>The safe answer is <code>DENSE_RANK()</code>: equal salaries share a rank, so rank 2 really is the second highest distinct salary.</li>
        <li><code>ROW_NUMBER()</code> or <code>LIMIT 1 OFFSET 1</code> returns the second <em>row</em>, which is wrong when the top salary is duplicated.</li>
        <li>Say what happens when everyone earns the same: a correlated subquery with <code>MAX</code> yields <code>NULL</code>, while <code>LIMIT/OFFSET</code> returns no row at all.</li>
      </ol>`,
      answer: `<pre>-- Preferred: tie-safe
SELECT DISTINCT salary
FROM (
  SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
  FROM employees
) ranked
WHERE rnk = 2;

-- Classic alternative, returns NULL when there is no second salary
SELECT MAX(salary) AS second_highest
FROM employees
WHERE salary &lt; (SELECT MAX(salary) FROM employees);</pre>
      <p>With two people at the top, <code>DENSE_RANK</code> still gives the correct second distinct salary, whereas <code>ROW_NUMBER</code>/<code>OFFSET 1</code> would wrongly return the duplicated top value.</p>`
    },
    {
      id: 'sql-e6',
      difficulty: 'easy',
      prompt: 'What is the difference between <code>UNION</code> and <code>UNION ALL</code>? Which should be your default, and what must be true of the two queries?',
      hint: 'One of them does extra work you often do not want.',
      concepts: [
        { label: 'UNION removes duplicate rows, UNION ALL keeps every row', any: ['removes duplicate', 'deduplicat', 'distinct', 'keeps duplicate', 'all rows', 'eliminates duplicate'], required: true },
        { label: 'UNION ALL is faster because it skips the dedupe sort', any: ['faster', 'cheaper', 'no sort', 'performance', 'less work', 'expensive'], required: true },
        { label: 'Both need the same number of columns in the same order with compatible types', any: ['same number of column', 'compatible', 'matching column', 'same order', 'data type'], required: true },
        { label: 'UNION stacks rows, whereas a JOIN adds columns side by side', any: ['stack', 'vertical', 'adds column', 'side by side', 'on top of'] },
        { label: 'Default to UNION ALL unless duplicates must genuinely be removed', any: ['default', 'unless', 'by default', 'only use union when', 'prefer union all'] }
      ],
      approach: `<p>The whole answer hinges on the hidden cost of deduplication.</p>
      <ol>
        <li><code>UNION</code> removes duplicate rows across the combined result. To do that the engine must sort or hash everything, which is real work on large tables.</li>
        <li><code>UNION ALL</code> simply stacks the rows and keeps duplicates, so it is materially faster.</li>
        <li>Both require the same number of columns, in the same order, with compatible data types. Column names come from the first query.</li>
        <li>State the default clearly: use <code>UNION ALL</code> unless you have a specific reason to deduplicate, and be aware that <code>UNION</code> silently collapses legitimately repeated rows, which can quietly understate counts.</li>
      </ol>
      <p>Round it off by contrasting with a join: <code>UNION</code> stacks rows vertically, a join adds columns side by side.</p>`,
      answer: `<p><code>UNION</code> removes duplicate rows; <code>UNION ALL</code> keeps every row. Because deduplication requires a sort or hash of the whole result, <code>UNION ALL</code> is significantly faster.</p>
      <pre>-- Keeps duplicates, faster: the usual choice
SELECT user_id, 'app' AS channel FROM app_orders
UNION ALL
SELECT user_id, 'web' AS channel FROM web_orders;

-- Deduplicates across both sets
SELECT user_id FROM app_orders
UNION
SELECT user_id FROM web_orders;</pre>
      <p>Both queries must return the same number of columns, in the same order, with compatible data types; the output takes its column names from the first query. Default to <code>UNION ALL</code> and reach for <code>UNION</code> only when removing duplicates is the actual requirement, since it can otherwise collapse rows that were legitimately repeated and understate your counts.</p>`
    },
    {
      id: 'sql-e7',
      difficulty: 'easy',
      prompt: 'How does SQL treat <code>NULL</code>? Explain the difference between <code>COUNT(*)</code> and <code>COUNT(column)</code>, and why <code>NOT IN</code> returns nothing when the list contains a NULL.',
      hint: 'NULL means unknown, and comparing anything to unknown gives unknown.',
      concepts: [
        { label: 'NULL means unknown, so comparisons return unknown rather than true', any: ['unknown', 'never equal', 'not equal to', 'three valued', 'missing value'], required: true },
        { label: 'Test with IS NULL and IS NOT NULL, never with = NULL', any: ['is null', 'is not null', 'cannot use', 'equals null'], required: true },
        { label: 'COUNT(*) counts rows while COUNT(column) skips NULLs', any: ['counts rows', 'skips', 'ignores null', 'excludes null', 'non null'], required: true },
        { label: 'SUM and AVG ignore NULLs, which changes the average denominator', any: ['avg', 'average', 'denominator', 'ignore', 'sum'], required: true },
        { label: 'NOT IN with a NULL yields no rows; use NOT EXISTS instead', any: ['not exists', 'no rows', 'empty', 'anti join', 'left join'], required: true },
        { label: 'COALESCE and NULLIF substitute or create NULLs deliberately', any: ['coalesce', 'nullif', 'ifnull', 'isnull', 'substitut'] }
      ],
      approach: `<p>Everything follows from one idea: <code>NULL</code> is not a value, it is <strong>unknown</strong>.</p>
      <ol>
        <li>Any comparison with unknown is unknown, not true, which is why <code>= NULL</code> never matches and you must write <code>IS NULL</code> or <code>IS NOT NULL</code>.</li>
        <li><code>COUNT(*)</code> counts rows; <code>COUNT(column)</code> counts non-null values, so the two differ exactly by the number of NULLs. The same applies to <code>AVG</code>, which ignores NULLs and therefore divides by fewer rows than you may expect.</li>
        <li>The <code>NOT IN</code> trap: if the subquery returns a NULL, every comparison evaluates to unknown, so no row can qualify and the query silently returns nothing. <code>NOT EXISTS</code> or a <code>LEFT JOIN ... IS NULL</code> anti-join behaves correctly.</li>
        <li>Close with the tools: <code>COALESCE</code> to substitute a default, <code>NULLIF</code> to turn a sentinel value such as 0 back into NULL, typically to avoid divide-by-zero.</li>
      </ol>`,
      answer: `<p><code>NULL</code> means unknown, so any comparison with it yields unknown rather than true. That is why you test with <code>IS NULL</code> / <code>IS NOT NULL</code> and never with <code>= NULL</code>.</p>
      <pre>-- COUNT(*) counts rows; COUNT(col) skips NULLs
SELECT COUNT(*)        AS all_rows,       -- 100
       COUNT(phone)    AS with_phone,     -- 63
       AVG(rating)     AS avg_rating      -- ignores NULL ratings entirely
FROM users;

-- Trap: returns zero rows if any excluded_id is NULL
SELECT * FROM users
WHERE user_id NOT IN (SELECT excluded_id FROM blocklist);

-- Safe equivalent
SELECT u.* FROM users u
WHERE NOT EXISTS (SELECT 1 FROM blocklist b WHERE b.excluded_id = u.user_id);</pre>
      <p><code>SUM</code> and <code>AVG</code> also ignore NULLs, so an average silently divides by the non-null count. Use <code>COALESCE(value, 0)</code> to substitute a default and <code>NULLIF(denominator, 0)</code> to protect a division.</p>`
    },
    {
      id: 'sql-e8',
      difficulty: 'easy',
      prompt: 'From <code>orders(order_id, order_date, status, amount)</code>, return one row per day with <strong>separate columns</strong> for completed, cancelled and refunded order counts.',
      context: 'orders(order_id, order_date, status, amount)  -- status: completed | cancelled | refunded',
      hint: 'Put a CASE inside the aggregate rather than filtering in WHERE.',
      concepts: [
        { label: 'Use CASE inside an aggregate: conditional aggregation', any: ['case', 'conditional aggregation', 'case when'], required: true },
        { label: 'SUM(CASE WHEN ... THEN 1 ELSE 0 END) or COUNT with CASE', any: ['then 1', 'else 0', 'sum case', 'count case', 'sum of case'], required: true },
        { label: 'GROUP BY the date so there is one row per day', any: ['group by'], required: true },
        { label: 'This pivots rows into columns without a PIVOT operator', any: ['pivot', 'into columns', 'cross tab', 'wide'], required: true },
        { label: 'Filtering status in WHERE would give one status, not three columns', any: ['where', 'cannot filter', 'only one', 'lose the other', 'instead of'] }
      ],
      approach: `<p>The trap is reaching for <code>WHERE status = ...</code>, which can only ever produce one status. You need all three on the same row, so the condition must live <em>inside</em> the aggregate.</p>
      <ol>
        <li>Group by the reporting dimension, here <code>order_date</code>.</li>
        <li>For each output column, write a <code>CASE</code> that returns 1 for the status you want and 0 otherwise, then <code>SUM</code> it. <code>COUNT(CASE WHEN ... THEN 1 END)</code> works too, because <code>COUNT</code> ignores NULLs.</li>
        <li>Name this pattern: <strong>conditional aggregation</strong>, which is how you pivot rows into columns in plain SQL without a vendor-specific <code>PIVOT</code> operator.</li>
        <li>Mention that the same trick computes conditional sums, for example completed revenue alongside refunded revenue in one pass.</li>
      </ol>`,
      answer: `<pre>SELECT order_date,
       SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) AS completed,
       SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) AS cancelled,
       SUM(CASE WHEN status = 'refunded'  THEN 1 ELSE 0 END) AS refunded,
       SUM(CASE WHEN status = 'completed' THEN amount END)   AS completed_revenue
FROM orders
GROUP BY order_date
ORDER BY order_date;</pre>
      <p>This is <strong>conditional aggregation</strong>: the condition sits inside the aggregate, so one pass produces several columns. Filtering with <code>WHERE status = 'completed'</code> instead would keep only one status and make the other two columns impossible.</p>
      <p>In PostgreSQL the modern equivalent is <code>COUNT(*) FILTER (WHERE status = 'completed')</code>, which reads more clearly and does the same work.</p>`
    },

    /* --------------------------- MEDIUM --------------------------- */
    {
      id: 'sql-m1',
      difficulty: 'medium',
      prompt: 'Find all duplicate email addresses in <code>users(user_id, email, created_at)</code>, and then write the query that keeps only the earliest record for each email.',
      context: 'users(user_id, email, created_at)',
      hint: 'GROUP BY + HAVING finds them; ROW_NUMBER identifies which copy to keep.',
      concepts: [
        { label: 'GROUP BY email with HAVING COUNT(*) > 1 to detect duplicates', any: ['group by', 'having'], required: true },
        { label: 'COUNT to measure how many times each email appears', any: ['count'], required: true },
        { label: 'ROW_NUMBER partitioned by email to rank copies', any: ['row number', 'partition by', 'rank'] },
        { label: 'Order by created_at so the earliest row is kept as rn = 1', any: ['created at', 'order by', 'earliest', 'oldest', 'min'] },
        { label: 'Delete or filter rows where rn > 1', any: ['rn 1', 'greater than 1', 'delete', '1'] }
      ],
      approach: `<p>Split it into detection and deduplication, because they need different tools.</p>
      <ol>
        <li><strong>Detect:</strong> group by the candidate key and keep groups with <code>COUNT(*) &gt; 1</code>.</li>
        <li><strong>Dedupe:</strong> a group-by cannot tell you <em>which</em> row to keep, so switch to <code>ROW_NUMBER() OVER (PARTITION BY email ORDER BY created_at)</code>. Row number 1 is the survivor.</li>
        <li>Filter <code>rn = 1</code> for a clean view, or delete <code>rn &gt; 1</code> to fix the table. Add <code>user_id</code> as a tiebreaker so the ordering is deterministic when timestamps are equal.</li>
        <li>Worth mentioning: emails should be normalised with <code>LOWER(TRIM(email))</code> before comparison, otherwise near-duplicates escape.</li>
      </ol>`,
      answer: `<pre>-- 1. Which emails are duplicated?
SELECT LOWER(TRIM(email)) AS email, COUNT(*) AS copies
FROM users
GROUP BY LOWER(TRIM(email))
HAVING COUNT(*) &gt; 1;

-- 2. Keep only the earliest record per email
WITH ranked AS (
  SELECT user_id, email, created_at,
         ROW_NUMBER() OVER (
           PARTITION BY LOWER(TRIM(email))
           ORDER BY created_at, user_id
         ) AS rn
  FROM users
)
SELECT user_id, email, created_at
FROM ranked
WHERE rn = 1;      -- swap to "DELETE ... WHERE rn &gt; 1" to clean the table</pre>`
    },
    {
      id: 'sql-m6',
      difficulty: 'medium',
      prompt: 'Explain <code>ROW_NUMBER</code>, <code>RANK</code> and <code>DENSE_RANK</code> with a tie. Then use <code>LAG</code> to show each employee\'s salary gap to the next highest earner in their department.',
      context: 'employees(emp_id, name, department, salary)',
      hint: 'Take salaries 100, 100, 90 and write out what each function returns.',
      concepts: [
        { label: 'ROW_NUMBER always gives unique numbers, breaking ties arbitrarily', any: ['row number', 'unique', 'arbitrar', 'no ties', '1 2 3'], required: true },
        { label: 'RANK gives ties the same number then skips, producing 1, 1, 3', any: ['rank', 'skip', '1 1 3', 'gap in the number', 'leaves a gap'], required: true },
        { label: 'DENSE_RANK gives ties the same number without skipping: 1, 1, 2', any: ['dense rank', 'does not skip', 'no gap', '1 1 2', 'without skipping'], required: true },
        { label: 'All are window functions needing OVER with PARTITION BY and ORDER BY', any: ['over', 'partition by', 'order by', 'window'], required: true },
        { label: 'LAG and LEAD read the previous or next row in the window', any: ['lag', 'lead', 'previous row', 'next row', 'preceding'], required: true },
        { label: 'Window functions cannot be filtered in WHERE, so wrap them in a CTE', any: ['cte', 'subquery', 'outer query', 'cannot filter', 'after where'] }
      ],
      approach: `<p>Answer the first half with a concrete tie, because the difference is invisible in prose.</p>
      <ol>
        <li>Take salaries 100, 100, 90 ordered descending. <code>ROW_NUMBER</code> returns 1, 2, 3 and picks arbitrarily between the tied rows. <code>RANK</code> returns 1, 1, 3, skipping 2 because two rows occupied first place. <code>DENSE_RANK</code> returns 1, 1, 2, with no gap.</li>
        <li>Choosing between them is a business decision: use <code>ROW_NUMBER</code> when you need exactly N rows, <code>DENSE_RANK</code> when tied records deserve the same rank, and <code>RANK</code> when the gap after a tie is meaningful, as in competition scoring.</li>
        <li>For the second half, <code>LAG(salary) OVER (PARTITION BY department ORDER BY salary DESC)</code> pulls the previous row's salary onto the current row, so the gap is a simple subtraction. The top earner in each department has no previous row and correctly returns <code>NULL</code>.</li>
        <li>Mention the mechanic worth knowing: window functions are evaluated after <code>WHERE</code>, so filtering on one requires a CTE or subquery.</li>
      </ol>`,
      answer: `<p>With salaries 100, 100, 90 ordered descending: <code>ROW_NUMBER</code> gives <strong>1, 2, 3</strong> and breaks the tie arbitrarily; <code>RANK</code> gives <strong>1, 1, 3</strong>, skipping 2; <code>DENSE_RANK</code> gives <strong>1, 1, 2</strong> with no gap.</p>
      <pre>SELECT name, department, salary,
       ROW_NUMBER()  OVER (PARTITION BY department ORDER BY salary DESC) AS rn,
       RANK()        OVER (PARTITION BY department ORDER BY salary DESC) AS rnk,
       DENSE_RANK()  OVER (PARTITION BY department ORDER BY salary DESC) AS dense_rnk,
       LAG(salary)   OVER (PARTITION BY department ORDER BY salary DESC) AS next_highest,
       LAG(salary)   OVER (PARTITION BY department ORDER BY salary DESC) - salary AS gap_to_next
FROM employees
ORDER BY department, salary DESC;</pre>
      <p><code>LAG</code> reads the previous row within the partition and <code>LEAD</code> reads the next, so the gap is a subtraction rather than a self-join. The highest earner in each department has no preceding row, so <code>gap_to_next</code> is correctly <code>NULL</code>.</p>
      <p>Remember that window functions are computed after <code>WHERE</code>, so any filter on the ranking has to happen in an outer query or CTE.</p>`
    },
    {
      id: 'sql-m3',
      difficulty: 'medium',
      prompt: 'Write a query that returns daily revenue plus a <strong>running (cumulative) total</strong> of revenue by date from <code>orders(order_id, order_date, amount, status)</code>.',
      context: 'orders(order_id, order_date, amount, status)',
      hint: 'SUM() becomes a running total the moment you give it an ORDER BY inside OVER().',
      concepts: [
        { label: 'Aggregate daily revenue first with SUM and GROUP BY date', any: ['group by', 'sum', 'daily'], required: true },
        { label: 'Windowed SUM(...) OVER (ORDER BY date) for the cumulative figure', any: ['over', 'window', 'sum over', 'cumulative', 'running'], required: true },
        { label: 'ORDER BY inside OVER defines the accumulation sequence', any: ['order by'], required: true },
        { label: 'Optionally state the frame: ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW', any: ['unbounded preceding', 'current row', 'rows between', 'frame'] },
        { label: 'Filter out cancelled/refunded orders so revenue is real', any: ['status', 'completed', 'cancel', 'refund', 'where'] }
      ],
      approach: `<p>Do it in two layers: collapse to one row per day, then accumulate across those days.</p>
      <ol>
        <li>Layer 1 is a plain <code>GROUP BY order_date</code> with <code>SUM(amount)</code>. Filter to valid orders in <code>WHERE</code> first.</li>
        <li>Layer 2 uses the same <code>SUM</code> as a window function. Adding <code>ORDER BY order_date</code> inside <code>OVER()</code> changes it from a single total into a running total.</li>
        <li>Default framing is <code>RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code>, which is what you want. Spelling the frame out shows you know it exists, and it also protects you when duplicate dates would otherwise be lumped together by <code>RANGE</code>.</li>
      </ol>`,
      answer: `<pre>WITH daily AS (
  SELECT order_date, SUM(amount) AS revenue
  FROM orders
  WHERE status = 'completed'
  GROUP BY order_date
)
SELECT order_date,
       revenue,
       SUM(revenue) OVER (
         ORDER BY order_date
         ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
       ) AS running_revenue
FROM daily
ORDER BY order_date;</pre>`
    },
    {
      id: 'sql-m4',
      difficulty: 'medium',
      prompt: 'Compute <strong>month-over-month revenue growth percentage</strong> from <code>orders(order_id, order_date, amount)</code>.',
      context: 'orders(order_id, order_date, amount)',
      hint: 'LAG gives you the previous row inside the same result set.',
      concepts: [
        { label: 'Bucket rows into months with DATE_TRUNC / TO_CHAR / EXTRACT', any: ['date trunc', 'to char', 'extract', 'month', 'format'], required: true },
        { label: 'Aggregate monthly revenue with SUM and GROUP BY', any: ['sum', 'group by'], required: true },
        { label: 'LAG(revenue) OVER (ORDER BY month) for the previous month', any: ['lag', 'previous month', 'self join', 'lead'], required: true },
        { label: 'Growth = (current - previous) / previous * 100', any: ['100', 'percent', 'divide', 'current previous', 'prev'], required: true },
        { label: 'Guard against divide-by-zero and NULL for the first month', any: ['null', 'nullif', 'zero', 'first month', 'divide by'] }
      ],
      approach: `<p>Three steps: bucket, aggregate, compare to the previous bucket.</p>
      <ol>
        <li><code>DATE_TRUNC('month', order_date)</code> keeps the value as a real date so sorting stays correct across years, unlike a raw month number.</li>
        <li>Aggregate to one row per month.</li>
        <li><code>LAG(revenue) OVER (ORDER BY month)</code> pulls the previous month onto the same row, which is cleaner than self-joining on <code>month - 1</code>.</li>
        <li>Divide with <code>NULLIF(prev, 0)</code> so a zero-revenue month returns <code>NULL</code> instead of erroring, and note the first month is legitimately <code>NULL</code>.</li>
      </ol>`,
      answer: `<pre>WITH monthly AS (
  SELECT DATE_TRUNC('month', order_date) AS month,
         SUM(amount) AS revenue
  FROM orders
  GROUP BY DATE_TRUNC('month', order_date)
),
compared AS (
  SELECT month, revenue,
         LAG(revenue) OVER (ORDER BY month) AS prev_revenue
  FROM monthly
)
SELECT month, revenue, prev_revenue,
       ROUND(100.0 * (revenue - prev_revenue) / NULLIF(prev_revenue, 0), 2) AS mom_growth_pct
FROM compared
ORDER BY month;</pre>
      <p>If some months have no orders at all, join against a generated month spine first so gaps show as 0 rather than silently disappearing.</p>`
    },
    {
      id: 'sql-m5',
      difficulty: 'medium',
      prompt: 'Find all employees who earn more than their manager. The manager is another row in the same table.',
      context: 'employees(emp_id, name, salary, manager_id)  -- manager_id references emp_id',
      hint: 'Join the table to itself and alias both copies.',
      concepts: [
        { label: 'Self join the employees table with two aliases', any: ['self join', 'join employees', 'same table', 'two alias', 'alias'], required: true },
        { label: 'Join condition e.manager_id = m.emp_id', any: ['manager id', 'emp id', 'on e', 'manager_id'], required: true },
        { label: 'Compare e.salary > m.salary', any: ['salary', 'greater', 'more than', '>'], required: true },
        { label: 'INNER JOIN drops employees with no manager, which is usually correct here', any: ['inner', 'null', 'no manager', 'ceo', 'left join'] }
      ],
      approach: `<p>The trick is simply to treat one table as two: an employee copy and a manager copy.</p>
      <ol>
        <li>Alias the table twice, for example <code>e</code> for the employee and <code>m</code> for the manager.</li>
        <li>The relationship is <code>e.manager_id = m.emp_id</code>, which is what makes it a self join.</li>
        <li>The business rule then becomes a simple predicate: <code>e.salary &gt; m.salary</code>.</li>
        <li>Call out the edge case: an <code>INNER JOIN</code> silently excludes anyone whose <code>manager_id</code> is <code>NULL</code>, such as the CEO. That is fine here because someone without a manager cannot out-earn one.</li>
      </ol>`,
      answer: `<pre>SELECT e.name AS employee,
       e.salary AS employee_salary,
       m.name AS manager,
       m.salary AS manager_salary
FROM employees e
JOIN employees m ON e.manager_id = m.emp_id
WHERE e.salary &gt; m.salary;</pre>`
    },

    /* ---------------------------- HARD ---------------------------- */
    {
      id: 'sql-h1',
      difficulty: 'hard',
      prompt: 'Write a query for <strong>month 1 retention</strong>: of the users who signed up in a given month, what percentage came back and transacted in the following month?',
      context: 'users(user_id, signup_date)\ntransactions(txn_id, user_id, txn_date, amount)',
      hint: 'Build a signup cohort, then LEFT JOIN activity in the next month and count distinct returners.',
      concepts: [
        { label: 'Define a signup cohort month per user', any: ['cohort', 'signup', 'date trunc', 'month'], required: true },
        { label: 'LEFT JOIN activity so users who never returned are still counted', any: ['left join', 'null', 'all users', 'outer join'], required: true },
        { label: 'Match activity to cohort month + 1 (interval / date_add / months_between)', any: ['1 month', 'interval', 'date add', 'add months', 'next month', 'month 1', 'datediff'], required: true },
        { label: 'COUNT(DISTINCT user_id) so repeat transactions are not double counted', any: ['count distinct', 'distinct'], required: true },
        { label: 'Retention = returning users / cohort size, cast to avoid integer division', any: ['divide', 'percent', '100', 'cast', 'ratio'] }
      ],
      approach: `<p>Retention questions are really cohort questions, so build the cohort first and only then look for activity.</p>
      <ol>
        <li><strong>Cohort:</strong> one row per user with <code>DATE_TRUNC('month', signup_date)</code> as the cohort month. The denominator is <code>COUNT(DISTINCT user_id)</code> of that cohort.</li>
        <li><strong>Activity:</strong> reduce transactions to distinct user-months so a user who bought 40 times counts once.</li>
        <li><strong>Join:</strong> <code>LEFT JOIN</code> from cohort to activity where the activity month equals cohort month + 1 interval. A <code>LEFT JOIN</code> is essential; an inner join would shrink the denominator and inflate retention.</li>
        <li><strong>Rate:</strong> divide distinct returners by cohort size, multiplying by <code>100.0</code> so integer division does not truncate to zero.</li>
      </ol>
      <p>Add the practical caveat that the newest cohort is incomplete: it has not had a full following month yet, so it must be excluded from trend charts.</p>`,
      answer: `<pre>WITH cohort AS (
  SELECT user_id, DATE_TRUNC('month', signup_date) AS cohort_month
  FROM users
),
activity AS (
  SELECT DISTINCT user_id, DATE_TRUNC('month', txn_date) AS active_month
  FROM transactions
)
SELECT c.cohort_month,
       COUNT(DISTINCT c.user_id) AS cohort_size,
       COUNT(DISTINCT a.user_id) AS retained_m1,
       ROUND(100.0 * COUNT(DISTINCT a.user_id) / COUNT(DISTINCT c.user_id), 2) AS retention_m1_pct
FROM cohort c
LEFT JOIN activity a
  ON a.user_id = c.user_id
 AND a.active_month = c.cohort_month + INTERVAL '1 month'
GROUP BY c.cohort_month
ORDER BY c.cohort_month;</pre>
      <p>Generalise to month N by replacing the interval with <code>N</code> months, or by computing a month offset and pivoting into a triangle chart.</p>`
    },
    {
      id: 'sql-h6',
      difficulty: 'hard',
      prompt: 'A dashboard query that used to return in 3 seconds now takes 4 minutes, and nobody changed the SQL. How do you diagnose it, and what would you change?',
      hint: 'Read the plan before touching the query.',
      concepts: [
        { label: 'Read the execution plan with EXPLAIN or EXPLAIN ANALYZE', any: ['explain', 'execution plan', 'query plan', 'analyze', 'plan'], required: true },
        { label: 'Look for full table scans where an index should be used', any: ['full scan', 'table scan', 'seq scan', 'index', 'sequential'], required: true },
        { label: 'Keep predicates sargable: no functions wrapped around the filtered column', any: ['sargable', 'function on the column', 'wrap', 'cannot use the index', 'left side', 'date trunc on the column'], required: true },
        { label: 'Reduce the data touched: filter early, select only needed columns, prune partitions', any: ['select', 'only the columns', 'filter early', 'partition', 'prune', 'fewer rows'], required: true },
        { label: 'Data volume growth and stale statistics change the plan over time', any: ['statistic', 'stale', 'grew', 'volume', 'more data', 'over time'], required: true },
        { label: 'Watch for join fan-out and accidental cross joins', any: ['fan out', 'cross join', 'duplicate', 'join key', 'cartesian'] },
        { label: 'For dashboards, pre-aggregate into a summary table rather than tuning forever', any: ['pre aggregat', 'materiali', 'summary table', 'aggregate table', 'incremental'] }
      ],
      approach: `<p>Nothing changed in the SQL, so something changed <em>around</em> it. Diagnose before you optimise.</p>
      <ol>
        <li><strong>Read the plan:</strong> <code>EXPLAIN ANALYZE</code> shows estimated versus actual rows. A large gap means the optimiser is working from stale statistics and has probably switched to a worse plan as the table grew.</li>
        <li><strong>Find the expensive step:</strong> look for a full table scan on a large table, a nested loop over millions of rows, or a spill to disk during a sort or hash.</li>
        <li><strong>Check sargability:</strong> a predicate like <code>WHERE DATE(created_at) = '2026-01-01'</code> or <code>WHERE UPPER(email) = ...</code> wraps the column in a function, so the index cannot be used. Rewrite as a range: <code>created_at &gt;= '2026-01-01' AND created_at &lt; '2026-01-02'</code>.</li>
        <li><strong>Reduce what is touched:</strong> filter before joining rather than after, select only the needed columns instead of <code>SELECT *</code>, and make sure partitioned or clustered tables actually prune, which requires filtering on the partition key directly.</li>
        <li><strong>Check the joins:</strong> a duplicated key on one side causes fan-out, which both inflates results and explodes runtime.</li>
        <li><strong>Then structural fixes:</strong> add or correct an index on the filter and join columns, refresh statistics, and for a dashboard that runs constantly, pre-aggregate into a summary table refreshed incrementally rather than recomputing from raw events on every load.</li>
      </ol>`,
      answer: `<p>Start with <code>EXPLAIN ANALYZE</code> and compare estimated with actual rows. A big discrepancy usually means <strong>stale statistics</strong> and a plan that flipped as data volume grew, which explains a query degrading without an edit.</p>
      <pre>-- Not sargable: the function blocks the index
WHERE DATE(created_at) = '2026-01-01'

-- Sargable rewrite: an index range scan
WHERE created_at &gt;= '2026-01-01'
  AND created_at &lt;  '2026-01-02'</pre>
      <p>Then work down the list: look for full table scans on large tables and index the filter and join columns; filter before joining rather than after; select only the columns you need instead of <code>SELECT *</code>; filter on the partition key so partition pruning actually happens; and check for join fan-out from a duplicated key, which inflates both the result and the runtime.</p>
      <p>Finally, be honest about the architecture. A dashboard query scanning raw events on every page load will keep regressing as data grows, so the durable fix is a <strong>pre-aggregated summary table</strong> refreshed incrementally, with the dashboard reading that instead.</p>`
    },
    {
      id: 'sql-h3',
      difficulty: 'hard',
      prompt: 'Find the <strong>longest streak of consecutive days</strong> each user logged in, from <code>logins(user_id, login_date)</code>.',
      context: 'logins(user_id, login_date)  -- may contain multiple rows per user per day',
      hint: 'Subtract a row number from the date: consecutive dates collapse to the same constant.',
      concepts: [
        { label: 'Deduplicate to one row per user per day first', any: ['distinct', 'dedup', 'one row per day', 'group by'], required: true },
        { label: 'ROW_NUMBER per user ordered by date', any: ['row number', 'partition by', 'rank'], required: true },
        { label: 'Gaps-and-islands: date minus row number gives a constant group key', any: ['minus', 'subtract', 'date row number', 'island', 'group key', 'interval', 'difference'], required: true },
        { label: 'GROUP BY that key and COUNT to get each streak length', any: ['group by', 'count'], required: true },
        { label: 'MAX of the streak lengths per user', any: ['max', 'longest', 'greatest'], required: true }
      ],
      approach: `<p>This is the classic <strong>gaps and islands</strong> problem, and the interviewer wants to hear that phrase.</p>
      <ol>
        <li><strong>Clean:</strong> multiple logins in a day would break the arithmetic, so reduce to distinct <code>(user_id, login_date)</code> pairs.</li>
        <li><strong>Key:</strong> number each user's days in order, then compute <code>login_date - rn</code> (as an interval in days). Consecutive dates increase in lockstep with the row number, so every date inside one unbroken run produces the identical value. A missing day shifts the value and starts a new island.</li>
        <li><strong>Measure:</strong> group by <code>(user_id, grp)</code> and <code>COUNT(*)</code> to get the length of each island.</li>
        <li><strong>Reduce:</strong> take <code>MAX(streak)</code> per user, and optionally return the start and end dates with <code>MIN</code>/<code>MAX</code> of the date.</li>
      </ol>`,
      answer: `<pre>WITH days AS (
  SELECT DISTINCT user_id, login_date FROM logins
),
keyed AS (
  SELECT user_id, login_date,
         login_date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date)) * INTERVAL '1 day' AS grp
  FROM days
),
streaks AS (
  SELECT user_id, grp,
         COUNT(*)       AS streak_len,
         MIN(login_date) AS streak_start,
         MAX(login_date) AS streak_end
  FROM keyed
  GROUP BY user_id, grp
)
SELECT user_id, MAX(streak_len) AS longest_streak
FROM streaks
GROUP BY user_id
ORDER BY longest_streak DESC;</pre>
      <p>In MySQL use <code>DATE_SUB(login_date, INTERVAL rn DAY)</code>; in BigQuery use <code>DATE_SUB(login_date, INTERVAL rn DAY)</code> as well. The logic is identical, only the date arithmetic differs.</p>`
    },
    {
      id: 'sql-h4',
      difficulty: 'hard',
      prompt: 'A funnel table logs events <code>view &rarr; add_to_cart &rarr; checkout &rarr; purchase</code>. Write a query returning, per step, the number of distinct users and the step-to-step conversion rate.',
      context: 'events(event_id, user_id, event_name, event_time, session_id)',
      hint: 'Count distinct users per step, then use LAG or a pivot to divide by the previous step.',
      concepts: [
        { label: 'COUNT(DISTINCT user_id) per step, not raw event counts', any: ['count distinct', 'distinct'], required: true },
        { label: 'Order the steps explicitly with a CASE mapping', any: ['case', 'step order', 'order', 'mapping', 'array position'], required: true },
        { label: 'Conversion between steps via LAG or a self join / pivot', any: ['lag', 'self join', 'pivot', 'previous step', 'divide'], required: true },
        { label: 'Enforce sequence: later steps should only count users who did the earlier one', any: ['sequence', 'event time', 'timestamp', 'before', 'after', 'ordered', 'min time'] },
        { label: 'Overall conversion = last step / first step', any: ['overall', 'first step', 'total conversion', 'end to end'] }
      ],
      approach: `<p>Two traps here: counting events instead of users, and letting SQL sort your steps alphabetically.</p>
      <ol>
        <li><strong>Users, not events:</strong> a single user can fire <code>view</code> fifty times, so every step must use <code>COUNT(DISTINCT user_id)</code>.</li>
        <li><strong>Explicit ordering:</strong> map each event name to a step number with <code>CASE</code>, because <code>add_to_cart</code> would otherwise sort before <code>view</code>.</li>
        <li><strong>Step-to-step rate:</strong> once you have one row per step, <code>LAG(users) OVER (ORDER BY step_no)</code> gives the previous step and the division is trivial. Guard it with <code>NULLIF</code>.</li>
        <li><strong>Strictness:</strong> a loose funnel counts anyone who did the step at any time. A strict funnel requires the earlier step to have happened first, which you enforce by comparing <code>MIN(event_time)</code> per step per user. Say which one you are building and why.</li>
      </ol>`,
      answer: `<pre>WITH steps AS (
  SELECT user_id,
         CASE event_name
           WHEN 'view'         THEN 1
           WHEN 'add_to_cart'  THEN 2
           WHEN 'checkout'     THEN 3
           WHEN 'purchase'     THEN 4
         END AS step_no,
         event_name
  FROM events
  WHERE event_name IN ('view','add_to_cart','checkout','purchase')
),
per_step AS (
  SELECT step_no, event_name, COUNT(DISTINCT user_id) AS users
  FROM steps
  GROUP BY step_no, event_name
)
SELECT event_name,
       users,
       LAG(users) OVER (ORDER BY step_no) AS prev_users,
       ROUND(100.0 * users / NULLIF(LAG(users) OVER (ORDER BY step_no), 0), 2) AS step_conversion_pct,
       ROUND(100.0 * users / NULLIF(FIRST_VALUE(users) OVER (ORDER BY step_no), 0), 2) AS from_top_pct
FROM per_step
ORDER BY step_no;</pre>
      <p>For a strict funnel, first collapse to <code>MIN(event_time)</code> per user per step and require each step's timestamp to be greater than the previous step's.</p>`
    },
    {
      id: 'sql-h5',
      difficulty: 'hard',
      prompt: 'Your daily revenue dashboard suddenly double-counts revenue after a new join was added to the query. How do you debug a query that is inflating rows, and how do you prevent it?',
      hint: 'Fan-out from a one-to-many join is the usual culprit.',
      concepts: [
        { label: 'Suspect join fan-out: one-to-many join duplicating the fact rows', any: ['fan out', 'one to many', 'duplicate rows', 'many to many', 'multiplies', 'duplicat'], required: true },
        { label: 'Check the grain / uniqueness of the join key on each side', any: ['grain', 'granularity', 'unique', 'primary key', 'count distinct', 'duplicate key'], required: true },
        { label: 'Compare row counts and totals before and after the join', any: ['row count', 'before and after', 'compare', 'count', 'total'], required: true },
        { label: 'Fix by pre-aggregating the many-side to the right grain before joining', any: ['pre aggregat', 'aggregate before', 'subquery', 'cte', 'group by', 'rollup'], required: true },
        { label: 'Alternatives: COUNT(DISTINCT), EXISTS, or window dedupe instead of a join', any: ['exists', 'count distinct', 'distinct', 'semi join', 'row number', 'dedup'] },
        { label: 'Add a data test asserting one row per key', any: ['test', 'assert', 'unique test', 'dbt', 'validation', 'check'] }
      ],
      approach: `<p>Treat it as a grain problem and be systematic rather than guessing.</p>
      <ol>
        <li><strong>Reproduce the inflation:</strong> run the query with and without the new join and compare both row count and revenue total. If revenue scaled by roughly an integer factor, it is fan-out.</li>
        <li><strong>Find the offending key:</strong> on the newly joined table, run <code>SELECT key, COUNT(*) FROM t GROUP BY key HAVING COUNT(*) &gt; 1</code>. If the key is not unique, every fact row is multiplied by the number of matches.</li>
        <li><strong>Fix at the right layer:</strong> pre-aggregate the many-side to one row per key in a CTE, then join. Never patch it with <code>SELECT DISTINCT</code>, which hides the bug and breaks legitimately duplicated rows.</li>
        <li><strong>Alternatives:</strong> if the join only exists to filter, use <code>EXISTS</code> (a semi-join, which cannot fan out). If you only need a count, <code>COUNT(DISTINCT order_id)</code> survives duplication.</li>
        <li><strong>Prevent recurrence:</strong> document the grain of every model, add a uniqueness test on the join key, and reconcile the dashboard total against the source of truth.</li>
      </ol>`,
      answer: `<pre>-- 1. Confirm the many-side is not unique
SELECT order_id, COUNT(*) AS copies
FROM order_items
GROUP BY order_id
HAVING COUNT(*) &gt; 1;

-- 2. Broken: order.amount is repeated once per item
SELECT o.order_date, SUM(o.amount) AS revenue
FROM orders o
JOIN order_items i ON i.order_id = o.order_id
GROUP BY o.order_date;

-- 3. Fixed: aggregate the many-side to the order grain first
WITH items AS (
  SELECT order_id, COUNT(*) AS item_count
  FROM order_items
  GROUP BY order_id
)
SELECT o.order_date,
       SUM(o.amount)      AS revenue,
       SUM(i.item_count)  AS items
FROM orders o
LEFT JOIN items i ON i.order_id = o.order_id
GROUP BY o.order_date;</pre>
      <p>Summary: the join changed the grain of the result from one row per order to one row per order-item, so the additive measure was counted repeatedly. Restore the grain before aggregating, and add a uniqueness test so the regression is caught automatically next time.</p>`
    }
  ]
});
