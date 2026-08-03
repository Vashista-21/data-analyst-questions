DAQ.registerTopic({
  id: 'sql',
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
      id: 'sql-e3',
      difficulty: 'easy',
      prompt: 'Explain the difference between <code>INNER JOIN</code>, <code>LEFT JOIN</code> and <code>FULL OUTER JOIN</code>, and give one analytics situation where a LEFT JOIN is essential.',
      hint: 'Which rows survive when there is no match on the other side?',
      concepts: [
        { label: 'INNER JOIN keeps only rows that match on both sides', any: ['inner', 'both', 'matching rows', 'intersection', 'only match'], required: true },
        { label: 'LEFT JOIN keeps all left rows and fills NULLs for missing matches', any: ['all rows from the left', 'all left', 'left table', 'null', 'unmatched'], required: true },
        { label: 'FULL OUTER JOIN keeps unmatched rows from both sides', any: ['full outer', 'both sides', 'union of', 'all rows from both'] },
        { label: 'Use case: keep users with zero orders / find missing records', any: ['zero', 'no orders', 'never', 'missing', 'null check', 'anti join', 'churn', 'without'] }
      ],
      approach: `<p>Frame it as "which side is allowed to have nothing on the other side".</p>
      <ol>
        <li><code>INNER JOIN</code>: intersection. Any row without a partner disappears, which silently drops data and is the most common analyst bug.</li>
        <li><code>LEFT JOIN</code>: every row of the left table survives; unmatched right columns come back as <code>NULL</code>.</li>
        <li><code>FULL OUTER JOIN</code>: both sides survive, unmatched columns are <code>NULL</code> on either side.</li>
      </ol>
      <p>Give a concrete analytics example: counting orders per user. With an <code>INNER JOIN</code>, users with zero orders vanish and your conversion rate is inflated. A <code>LEFT JOIN</code> from users to orders keeps them, and <code>WHERE o.order_id IS NULL</code> turns it into an anti-join that isolates non-buyers.</p>`,
      answer: `<p><strong>INNER</strong> = matches only. <strong>LEFT</strong> = all left rows plus matches, NULLs where nothing matched. <strong>FULL OUTER</strong> = every row from both tables.</p>
      <pre>-- Orders per user, keeping users who never ordered
SELECT u.user_id, COUNT(o.order_id) AS orders
FROM users u
LEFT JOIN orders o ON o.user_id = u.user_id
GROUP BY u.user_id;

-- Anti-join: users who never ordered
SELECT u.user_id
FROM users u
LEFT JOIN orders o ON o.user_id = u.user_id
WHERE o.order_id IS NULL;</pre>
      <p>Note <code>COUNT(o.order_id)</code> rather than <code>COUNT(*)</code>: it counts 0 for non-buyers instead of 1.</p>`
    },
    {
      id: 'sql-e4',
      difficulty: 'easy',
      prompt: 'From <code>employees(emp_id, name, department, salary)</code>, return every department with more than 5 employees along with its average salary, highest paid department first.',
      context: 'employees(emp_id, name, department, salary)',
      hint: 'Aggregate, then filter the aggregate, then order it.',
      concepts: [
        { label: 'GROUP BY department', any: ['group by'], required: true },
        { label: 'COUNT to get headcount and AVG for average salary', any: ['count', 'avg', 'average'], required: true },
        { label: 'HAVING COUNT(*) > 5 to filter the groups', any: ['having'], required: true },
        { label: 'ORDER BY the average salary descending', any: ['order by', 'desc', 'descending', 'sort'] }
      ],
      approach: `<p>This is a mechanical question, so the interviewer is checking clause order and whether you filter the aggregate in the right place.</p>
      <ol>
        <li>Group by the dimension you are reporting on: <code>department</code>.</li>
        <li>Compute both aggregates in the same pass: <code>COUNT(*)</code> and <code>AVG(salary)</code>.</li>
        <li>Filter on the aggregate with <code>HAVING</code>, never <code>WHERE</code>.</li>
        <li>Sort with <code>ORDER BY</code>, and alias the aggregate so the output is readable.</li>
      </ol>`,
      answer: `<pre>SELECT department,
       COUNT(*)            AS headcount,
       ROUND(AVG(salary),2) AS avg_salary
FROM employees
GROUP BY department
HAVING COUNT(*) &gt; 5
ORDER BY avg_salary DESC;</pre>
      <p>Most engines let you reuse the alias in <code>ORDER BY</code>; inside <code>HAVING</code> you generally repeat the aggregate expression.</p>`
    },
    {
      id: 'sql-e5',
      difficulty: 'easy',
      prompt: 'Compare <code>DELETE</code>, <code>TRUNCATE</code> and <code>DROP</code>. Which can be rolled back, and which resets identity columns?',
      hint: 'Two of them are DDL, one is DML.',
      concepts: [
        { label: 'DELETE is DML, row-by-row, supports WHERE and is transactional', any: ['delete', 'where', 'dml', 'row by row', 'rollback'], required: true },
        { label: 'TRUNCATE removes all rows quickly and cannot take a WHERE clause', any: ['truncate', 'all rows', 'no where', 'faster', 'quick'], required: true },
        { label: 'DROP removes the table structure itself', any: ['drop', 'structure', 'schema', 'table itself', 'definition'], required: true },
        { label: 'DELETE logs each row and keeps identity/auto-increment; TRUNCATE resets it', any: ['auto increment', 'identity', 'reset', 'log', 'sequence'] }
      ],
      approach: `<p>Sort the three commands on two axes: <strong>what is removed</strong> and <strong>how recoverable it is</strong>.</p>
      <ol>
        <li><code>DELETE</code> is DML. It removes selected rows, fires triggers, writes a log entry per row, and can be rolled back inside a transaction.</li>
        <li><code>TRUNCATE</code> is DDL in most engines. It deallocates pages instead of deleting rows, so it is far faster, takes no <code>WHERE</code>, and typically resets auto-increment.</li>
        <li><code>DROP</code> removes the table object itself, so columns, indexes and constraints go with it.</li>
      </ol>
      <p>Mention the caveat that rollback behaviour is engine dependent: PostgreSQL can roll back <code>TRUNCATE</code>, MySQL with InnoDB cannot.</p>`,
      answer: `<table>
      <tr><td><strong>DELETE</strong></td><td>DML, per-row, <code>WHERE</code> allowed, triggers fire, rollback-able, keeps identity counter and table structure.</td></tr>
      <tr><td><strong>TRUNCATE</strong></td><td>DDL-style bulk removal of all rows, no <code>WHERE</code>, minimal logging, usually resets auto-increment, structure stays.</td></tr>
      <tr><td><strong>DROP</strong></td><td>Removes the table definition, data, indexes and constraints entirely.</td></tr>
      </table>
      <p>Rule of thumb: <code>DELETE</code> when you need conditions or recoverability, <code>TRUNCATE</code> to reload a staging table fast, <code>DROP</code> when the table should no longer exist.</p>`
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
      id: 'sql-m2',
      difficulty: 'medium',
      prompt: 'For each department, return the top 2 highest paid employees. Explain why <code>GROUP BY</code> with <code>LIMIT</code> cannot solve this.',
      context: 'employees(emp_id, name, department, salary)',
      hint: 'You need a per-group ranking, which is exactly what a windowed PARTITION BY gives you.',
      concepts: [
        { label: 'Use a window function such as DENSE_RANK or ROW_NUMBER', any: ['dense rank', 'row number', 'rank', 'window'], required: true },
        { label: 'PARTITION BY department so ranking restarts per group', any: ['partition by'], required: true },
        { label: 'ORDER BY salary DESC inside the window', any: ['order by salary', 'salary desc', 'descending', 'order by'], required: true },
        { label: 'Filter rank <= 2 in an outer query or CTE', any: ['2', 'where rnk', 'outer query', 'cte', 'subquery'] },
        { label: 'LIMIT applies to the whole result, not per group', any: ['whole result', 'entire result', 'not per group', 'global', 'once', 'overall'] }
      ],
      approach: `<p>This is the standard "top N per group" pattern, and the reasoning matters as much as the query.</p>
      <ol>
        <li><code>LIMIT</code> truncates the final result set once, so it can only ever give you 2 rows in total, not 2 per department.</li>
        <li>A window function ranks rows <em>inside</em> partitions, so the counter restarts for every department.</li>
        <li>Window functions cannot be filtered in <code>WHERE</code> (they are computed after it), so wrap the ranking in a CTE or subquery and filter outside.</li>
        <li>Choose the ranking function deliberately: <code>ROW_NUMBER</code> gives exactly 2 rows even on ties, <code>DENSE_RANK</code> keeps everybody tied at second place. State which behaviour you want.</li>
      </ol>`,
      answer: `<pre>WITH ranked AS (
  SELECT emp_id, name, department, salary,
         DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) AS rnk
  FROM employees
)
SELECT department, name, salary
FROM ranked
WHERE rnk &lt;= 2
ORDER BY department, salary DESC;</pre>
      <p><code>GROUP BY department ... LIMIT 2</code> fails because <code>LIMIT</code> is applied once to the entire output after grouping, so it returns two departments rather than two employees per department. Use <code>ROW_NUMBER</code> instead of <code>DENSE_RANK</code> if you must cap the output at exactly two rows per department.</p>`
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
      id: 'sql-h2',
      difficulty: 'hard',
      prompt: 'Calculate the <strong>median</strong> salary per department without using a built-in median function.',
      context: 'employees(emp_id, department, salary)',
      hint: 'Rank ascending and descending; the median sits where the two ranks meet.',
      concepts: [
        { label: 'ROW_NUMBER partitioned by department, ordered by salary', any: ['row number', 'partition by', 'rank'], required: true },
        { label: 'Use COUNT per partition to know where the middle is', any: ['count', 'total rows', 'n'], required: true },
        { label: 'Average the two middle values when the count is even', any: ['even', 'avg', 'average', 'two middle', 'both'], required: true },
        { label: 'Handle odd counts by taking the single middle row', any: ['odd', 'middle', 'exact'], required: true },
        { label: 'PERCENTILE_CONT(0.5) is the built-in alternative worth naming', any: ['percentile cont', 'percentile disc', 'percentile'] }
      ],
      approach: `<p>The clean trick is symmetry: number the rows ascending and descending, and the median is where the two numbers are within one of each other.</p>
      <ol>
        <li>Window twice per department: <code>ROW_NUMBER() ... ORDER BY salary</code> and <code>ORDER BY salary DESC</code>, plus <code>COUNT(*) OVER (PARTITION BY department)</code>.</li>
        <li>For an odd count the median row satisfies <code>rn_asc = rn_desc</code>. For an even count the two middle rows satisfy <code>ABS(rn_asc - rn_desc) = 1</code>.</li>
        <li>Both cases are covered by keeping rows where <code>rn_asc BETWEEN cnt/2.0 AND cnt/2.0 + 1</code> and then taking <code>AVG(salary)</code>, which averages one row for odd counts and two for even.</li>
        <li>Finish by naming <code>PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary)</code> as what you would ship in production.</li>
      </ol>`,
      answer: `<pre>WITH ranked AS (
  SELECT department, salary,
         ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary)      AS rn_asc,
         COUNT(*)     OVER (PARTITION BY department)                      AS cnt
  FROM employees
)
SELECT department,
       AVG(salary) AS median_salary
FROM ranked
WHERE rn_asc BETWEEN cnt / 2.0 AND cnt / 2.0 + 1
GROUP BY department;

-- Production version
SELECT department,
       PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY salary) AS median_salary
FROM employees
GROUP BY department;</pre>
      <p>The <code>BETWEEN</code> window picks exactly the middle row when the count is odd and both middle rows when it is even, so a single <code>AVG</code> handles both cases.</p>`
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
