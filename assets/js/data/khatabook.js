/* Questions reported from Khatabook analyst loops (data analyst, business
   analyst and product analyst): live SQL on ledger and payment tables, merchant
   engagement and churn cases, experiment design, merchant lending, and a
   guesstimate. Merchant vocabulary (khata, udhaar, kirana, collections) is used
   deliberately, since that is the domain the interviewers work in. */
DAQ.registerTopic({
  id: 'khatabook',
  group: 'khatabook',
  name: 'Khatabook Interview Questions',
  icon: '\uD83D\uDCD2',
  blurb: 'Reported from Khatabook analyst rounds: SQL on ledger and payment tables, kirana engagement and churn cases, north star, onboarding experiments, merchant lending and a guesstimate.',
  questions: [
    /* ---------------------------- EASY ---------------------------- */
    {
      id: 'kb-e1',
      difficulty: 'easy',
      prompt: 'Reported at Khatabook: our core users are kirana owners. <strong>How would you define and track "engagement"</strong> for this audience?',
      hint: 'Start from the one action that proves the merchant got value, then pick a cadence that matches how a shop actually runs.',
      concepts: [
        { label: 'Anchor engagement on the core action, recording a ledger entry, not app opens', any: ['ledger entr', 'core action', 'not app open', 'records an entry', 'recording an entry'], required: true },
        { label: 'Choose a cadence that matches how merchants work, usually weekly', any: ['weekly', 'cadence', 'per week'], required: true },
        { label: 'Measure depth: active days per week, entries per active day, customers managed', any: ['depth', 'entries per', 'active days', 'customers managed', 'intensity'], required: true },
        { label: 'Include outcome actions: reminders sent, money collected through QR or payment links', any: ['reminder', 'collected', 'qr', 'payment link', 'recover'], required: true },
        { label: 'Segment by business type, city tier, tenure and language', any: ['segment', 'city tier', 'business type', 'tenure', 'language'], required: true },
        { label: 'Allow for seasonality, festivals, offline sync and shared devices', any: ['season', 'festival', 'offline', 'sync', 'shared device', 'staff'] },
        { label: 'Validate the definition against retention or monetisation', any: ['retention', 'validate', 'predict', 'monetis', 'loan eligib'] }
      ],
      approach: `<p>The trap is answering "DAU and MAU". For a ledger app, opening the app proves nothing; the merchant gets value when a transaction is written down and later collected.</p>
      <ol>
        <li><strong>Pick the core action.</strong> A merchant is engaged when they record a ledger entry: credit given (udhaar), payment received, or a bill raised. App opens and screen views are supporting signals, not the definition.</li>
        <li><strong>Pick the cadence.</strong> A kirana sells every day but does not necessarily write every sale; many merchants log credit customers a few times a week. A weekly active merchant, someone with at least one entry in the week, is more stable than daily and less forgiving than monthly.</li>
        <li><strong>Add depth.</strong> Active days per week, entries per active day and number of customers managed separate a merchant who logs one entry from one who runs the shop on the app.</li>
        <li><strong>Add outcomes.</strong> Reminders sent and money collected through Khatabook QR or payment links are the value moments: the merchant recovered udhaar faster. These are the actions most linked to retention.</li>
        <li><strong>Segment.</strong> Business type, city tier, tenure and language, because a pharmacy, a wholesaler and a tea stall have very different natural frequencies.</li>
        <li><strong>Watch the traps.</strong> Festival and harvest seasonality, offline entries that sync days later, and a shop where the owner and staff share one phone.</li>
        <li><strong>Validate.</strong> Check that merchants above the threshold actually retain better at 60 and 90 days. If they do not, the definition is wrong.</li>
      </ol>`,
      answer: `<p>I would anchor engagement on the core action rather than on app opens: a merchant is engaged when they record a ledger entry, whether credit given, payment received or a bill raised, because that is the moment the app replaces the paper bahi khata. The headline metric would be weekly active merchants, meaning merchants with at least one entry in the week, since a weekly cadence matches how many shops log credit customers and is less noisy than daily.</p>
      <p>Under that I would track depth, meaning active days per week, entries per active day and number of customers managed, and outcome actions, meaning reminders sent and money collected through Khatabook QR or payment links, because recovering udhaar faster is the real value and is usually the strongest predictor of retention. Everything is segmented by business type, city tier, tenure and language, since a wholesaler and a tea stall have different natural frequencies.</p>
      <p>Two cautions. Seasonality around festivals and harvests moves the number for reasons unrelated to the product, and the app works offline, so entries can sync days later; I would count by entry date and allow a lookback before calling a week final. Finally I would validate the definition by checking that merchants above the threshold retain better at 60 and 90 days than those below it, because a definition that does not predict retention is not measuring engagement.</p>`
    },
    {
      id: 'kb-e2',
      difficulty: 'easy',
      prompt: 'Reported at Khatabook: explain the difference between a <strong>leading and a lagging indicator</strong>. Give one example of each from a payments product.',
      hint: 'One tells you what already happened; the other moves early enough for you to act on it.',
      concepts: [
        { label: 'A lagging indicator measures an outcome after the fact', any: ['lagging', 'after the fact', 'already happened'], required: true },
        { label: 'A leading indicator moves earlier and predicts the outcome', any: ['leading', 'predict', 'moves earlier', 'ahead of'], required: true },
        { label: 'Lagging payments example: monthly collected value, TPV, revenue, monthly churn', any: ['tpv', 'payment volume', 'collected value', 'revenue', 'monthly churn'], required: true },
        { label: 'Leading payments example: QR activation, first payment in the first week, success rate', any: ['qr activation', 'first payment', 'success rate', 'first week', 'activation'], required: true },
        { label: 'Leading indicators are actionable but must be validated against the outcome', any: ['validate', 'correlat', 'actionable', 'causal'], required: true },
        { label: 'A leading metric targeted alone can be gamed, so pair it with the outcome', any: ['gamed', 'goodhart', 'pair it', 'guardrail', 'counter metric'] }
      ],
      approach: `<p>Define both crisply, give a payments pair that connects, then add the nuance that separates a good answer: leading indicators have to earn their place.</p>
      <ol>
        <li><strong>Lagging:</strong> measures an outcome after the fact. It is what the business ultimately cares about, but by the time it moves the cause is weeks old. Examples: monthly collected value through Khatabook QR, total payment volume (TPV), payments revenue, monthly merchant churn.</li>
        <li><strong>Leading:</strong> moves earlier and predicts the outcome, so you can act on it. Examples: share of new merchants who activate their QR and receive a first payment in the first week, payment success rate, weekly merchants sending payment links.</li>
        <li><strong>Connect the pair.</strong> If first-week QR activation falls today, collected value next quarter will fall too. That causal story is what makes it leading rather than merely early.</li>
        <li><strong>Validate it.</strong> A leading indicator is a hypothesis until historical cohorts show it correlates with the outcome, and ideally an experiment shows that moving it moves the outcome. Being actionable is the point.</li>
        <li><strong>Pair it.</strong> If the team is targeted only on QR activations, they can push activations nobody uses. Track the lagging outcome alongside so the leading metric cannot be gamed.</li>
      </ol>`,
      answer: `<p>A lagging indicator measures an outcome after the fact: it is what the business ultimately cares about, but by the time it moves, the cause is already weeks old. A leading indicator moves earlier and predicts that outcome, so the team can act while there is still time to change it.</p>
      <p>In a payments product, a lagging indicator would be monthly collected value through Khatabook QR, total payment volume, or monthly merchant churn. A leading indicator would be the share of newly onboarded merchants who activate their QR and receive a first payment in the first week, or payment success rate, because a merchant whose first few collections succeed becomes a habitual user and a merchant whose first attempts fail usually goes back to cash.</p>
      <p>The nuance is that a leading indicator is only useful if it genuinely predicts the outcome, so I would validate it on historical cohorts and ideally confirm with an experiment that moving it moves the result; that is what makes it actionable rather than just early. And I would always pair it with the lagging outcome, because a team targeted only on QR activations can generate activations that never turn into payments.</p>`
    },
    {
      id: 'kb-e3',
      difficulty: 'easy',
      prompt: 'Reported at Khatabook: write SQL to find <strong>merchants who recorded entries in one week but made zero entries the following week</strong>.',
      context: 'ledger_entries(entry_id, merchant_id, entry_type, amount, created_at, is_deleted)',
      hint: 'Get one row per merchant per active week first, then look for the absence of the next week.',
      concepts: [
        { label: 'Bucket entries into weeks with DATE_TRUNC', any: ['date_trunc', 'date trunc'], required: true },
        { label: 'Reduce to distinct merchant-weeks before comparing', any: ['distinct', 'one row per merchant per week', 'merchant week'], required: true },
        { label: 'Anti-join to the following week with NOT EXISTS or LEFT JOIN plus IS NULL', any: ['not exists', 'is null', 'anti join'], required: true },
        { label: 'Match the following week with an interval of 7 days', any: ['interval', '7 day', 'following week'], required: true },
        { label: 'Exclude the current incomplete week so nobody looks falsely inactive', any: ['incomplete', 'current week', 'partial week'], required: true },
        { label: 'Exclude deleted or test entries and define what counts', any: ['is deleted', 'deleted', 'test merchants', 'what counts'] },
        { label: 'LAG or LEAD over active weeks is an alternative to spot gaps', any: ['lead over', 'gap'] }
      ],
      approach: `<p>Interviewers grade the decomposition: active weeks first, then absence of the next week, then the edge case that makes everyone look churned.</p>
      <ol>
        <li><strong>Define the activity.</strong> Ask whether deleted entries and test merchants count. Assume not.</li>
        <li><strong>One row per merchant per week</strong>, using <code>DATE_TRUNC('week', created_at)</code> and DISTINCT.</li>
        <li><strong>Anti-join to the following week</strong> with NOT EXISTS (or LEFT JOIN and IS NULL), matching on the same merchant and <code>wk + INTERVAL '7' DAY</code>.</li>
        <li><strong>Exclude the current incomplete week.</strong> Without this, every merchant active last week appears silent this week simply because the week is not finished. That is the bug interviewers are waiting for.</li>
      </ol>
<pre>WITH merchant_weeks AS (
  SELECT DISTINCT merchant_id,
         DATE_TRUNC('week', created_at) AS wk
  FROM ledger_entries
  WHERE is_deleted = FALSE
    AND created_at &lt; DATE_TRUNC('week', CURRENT_DATE)
)
SELECT a.merchant_id, a.wk AS active_week
FROM merchant_weeks a
WHERE a.wk &lt; DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '7' DAY
  AND NOT EXISTS (
    SELECT 1 FROM merchant_weeks b
    WHERE b.merchant_id = a.merchant_id
      AND b.wk = a.wk + INTERVAL '7' DAY
  );</pre>
      <p>An alternative is LEAD over each merchant's active weeks and keeping rows where the next active week is more than seven days later, which also tells you how long the gap lasted.</p>`,
      answer: `<p>I would first confirm what counts as an entry, assuming deleted entries and test merchants are excluded, then build one row per merchant per active week and anti-join it to the following week:</p>
<pre>WITH merchant_weeks AS (
  SELECT DISTINCT merchant_id,
         DATE_TRUNC('week', created_at) AS wk
  FROM ledger_entries
  WHERE is_deleted = FALSE
    AND created_at &lt; DATE_TRUNC('week', CURRENT_DATE)
)
SELECT a.merchant_id, a.wk AS active_week
FROM merchant_weeks a
WHERE a.wk &lt; DATE_TRUNC('week', CURRENT_DATE) - INTERVAL '7' DAY
  AND NOT EXISTS (
    SELECT 1 FROM merchant_weeks b
    WHERE b.merchant_id = a.merchant_id
      AND b.wk = a.wk + INTERVAL '7' DAY
  );</pre>
      <p>The DISTINCT collapses many entries into one merchant-week, and NOT EXISTS returns weeks with no matching following week; a LEFT JOIN with IS NULL on the right side does the same. The two date filters handle the current incomplete week: entries from the week in progress are ignored, and the last complete week is not tested because its following week is not over yet, otherwise every merchant would look inactive. LEAD over active weeks is an alternative that also gives the length of each gap. Because the app works offline and entries can sync late, I would run this a couple of days after the week closes.</p>`
    },
    {
      id: 'kb-e4',
      difficulty: 'easy',
      prompt: 'Find merchants who have <strong>added at least one customer to their khata but have never sent a payment reminder</strong>. Give two correct ways to write it, and explain the trap in a third.',
      context: 'customers(customer_id, merchant_id, added_at)\nreminders(reminder_id, merchant_id, customer_id, channel, sent_at)',
      hint: '"Did A but never B" is an anti-join. One of the obvious ways silently returns nothing.',
      concepts: [
        { label: 'NOT EXISTS with a correlated subquery', any: ['not exists'], required: true },
        { label: 'LEFT JOIN then filter IS NULL on the right side', any: ['left join'], required: true },
        { label: 'NOT IN is the trap', any: ['not in'], required: true },
        { label: 'A single NULL in the NOT IN list makes the query return no rows', any: ['returns no rows', 'returns nothing', 'any null', 'single null'], required: true },
        { label: 'Return each merchant once with DISTINCT or EXISTS', any: ['distinct', 'each merchant once'], required: true },
        { label: 'Clarify the time window and which channels count as a reminder', any: ['time window', 'channel', 'ever', 'definition'] },
        { label: 'Use the result: these merchants are the audience for a reminder nudge', any: ['nudge', 'audience', 'campaign', 'opportunity'] }
      ],
      approach: `<p>This is the "did A but never B" pattern. Show two correct anti-joins and name the NOT IN trap, because that is what is being tested.</p>
      <ol>
        <li><strong>NOT EXISTS</strong>, usually the clearest and NULL-safe:
<pre>SELECT DISTINCT c.merchant_id
FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM reminders r
  WHERE r.merchant_id = c.merchant_id
);</pre></li>
        <li><strong>LEFT JOIN with IS NULL</strong>:
<pre>SELECT DISTINCT c.merchant_id
FROM customers c
LEFT JOIN reminders r ON r.merchant_id = c.merchant_id
WHERE r.reminder_id IS NULL;</pre></li>
        <li><strong>The trap: NOT IN.</strong> <code>WHERE merchant_id NOT IN (SELECT merchant_id FROM reminders)</code> looks fine, but if any row in the subquery has a NULL merchant_id, the comparison becomes unknown for every row and the query returns nothing, with no error.</li>
        <li><strong>DISTINCT</strong> because a merchant has many customers; without it each merchant repeats once per customer.</li>
        <li><strong>Clarify scope:</strong> ever, or in the last 30 days? Do SMS and WhatsApp reminders both count?</li>
        <li><strong>Say why it matters:</strong> merchants with customers but no reminders have udhaar to recover and have not discovered the feature, which makes them the audience for an in-app nudge.</li>
      </ol>`,
      answer: `<p>Two correct versions. NOT EXISTS:</p>
<pre>SELECT DISTINCT c.merchant_id
FROM customers c
WHERE NOT EXISTS (
  SELECT 1 FROM reminders r
  WHERE r.merchant_id = c.merchant_id
);</pre>
      <p>And a LEFT JOIN with an IS NULL filter on the right side:</p>
<pre>SELECT DISTINCT c.merchant_id
FROM customers c
LEFT JOIN reminders r ON r.merchant_id = c.merchant_id
WHERE r.reminder_id IS NULL;</pre>
      <p>DISTINCT returns each merchant once, since a merchant has many customers. The trap is NOT IN: <code>merchant_id NOT IN (SELECT merchant_id FROM reminders)</code> returns no rows at all if any single NULL appears in the subquery, because every comparison then evaluates to unknown, and nothing warns you. I would also clarify the definition, meaning whether "never" means ever or within a time window, and whether every channel counts. The result is directly useful: merchants who have credit customers but have never sent a reminder are the obvious audience for a nudge, since they have money to recover and have not found the feature that helps them recover it.</p>`
    },
    {
      id: 'kb-e5',
      difficulty: 'easy',
      prompt: 'Reported at Khatabook: if you had to pick <strong>one north-star metric for the bookkeeping product</strong>, what would it be and why? Say what you rejected.',
      hint: 'It should capture value delivered to the merchant, lead to revenue, and be hard to inflate.',
      concepts: [
        { label: 'Proposes weekly active merchants recording entries, or a close variant', any: ['weekly active merchant', 'weekly transacting', 'merchants who record', 'recording entries'], required: true },
        { label: 'Explains it captures value delivered to the merchant and habit', any: ['value', 'habit', 'delivered'], required: true },
        { label: 'Rejects downloads, installs and registered users as vanity', any: ['download', 'install', 'registered', 'vanity'], required: true },
        { label: 'Rejects total amount recorded because a few large merchants dominate and it can be inflated', any: ['dominat', 'inflat', 'large merchants', 'skew'], required: true },
        { label: 'Connects to monetisation: engaged merchants are the base for lending and subscriptions', any: ['lending', 'loan', 'subscription', 'monetis'], required: true },
        { label: 'Pairs it with input metrics and counter-metrics', any: ['input metric', 'counter metric', 'guardrail', 'driver'], required: true },
        { label: 'Chooses the activity threshold by validating against retention', any: ['threshold', 'at least', 'retention'] }
      ],
      approach: `<p>Propose one metric, defend it against three tests, and name what you rejected. The rejection list is half the marks.</p>
      <ol>
        <li><strong>Proposal:</strong> weekly active merchants recording entries, meaning merchants with entries on at least a set number of days in the week, threshold chosen by checking which level best predicts 90-day retention.</li>
        <li><strong>Test one, value:</strong> a recorded entry is the moment the merchant gets value, replacing the paper khata. Repeated weekly, it is a habit.</li>
        <li><strong>Test two, money:</strong> engaged merchants are the base for everything Khatabook monetises: lending eligibility relies on consistent ledger history, and paid billing or Biz Analyst subscriptions sell to merchants already running their shop on the app.</li>
        <li><strong>Test three, hard to game:</strong> it needs repeated real behaviour, not one event.</li>
        <li><strong>Rejected:</strong> downloads, installs and registered users (vanity, they only grow); DAU of app opens (activity without value); total amount recorded (a few large wholesalers dominate, and one inflated entry moves it).</li>
        <li><strong>Pair it:</strong> input metrics the teams can move (new merchant activation, reminders sent, QR collections) and counter-metrics such as uninstalls and support complaints.</li>
      </ol>`,
      answer: `<p>I would choose weekly active merchants recording entries: merchants who record entries on at least a set number of days in a week, with the threshold chosen by testing which level best predicts 90-day retention. It passes the three tests I would apply. It captures value delivered, because a recorded entry is the moment the app replaces the paper khata and doing it every week is a habit. It leads to revenue, because engaged merchants are the base for monetisation: lending eligibility depends on a consistent ledger history, and paid subscriptions sell to merchants who already run their shop on the app. And it is hard to inflate, since it needs repeated real behaviour.</p>
      <p>I rejected downloads, installs and registered users as vanity metrics that only go up; DAU based on app opens, which counts activity without value; and total amount recorded, which a handful of large wholesalers dominate and a single mistyped entry can inflate.</p>
      <p>A north star needs a tree under it, so I would pair it with input metrics individual teams can move, such as new merchant activation, reminders sent and QR collections, and with counter-metrics such as uninstalls and support complaints so that pushing the number never comes at the merchant's expense.</p>`
    },

    /* --------------------------- MEDIUM --------------------------- */
    {
      id: 'kb-m1',
      difficulty: 'medium',
      prompt: 'Return <strong>month-over-month growth in total ledger value recorded, per city tier</strong>, for the last 12 complete months.',
      context: 'ledger_entries(entry_id, merchant_id, amount, created_at, is_deleted)\nmerchants(merchant_id, city, city_tier, signup_date)',
      hint: 'Aggregate to tier-month, then LAG within each tier. Think about months that are missing and the month in progress.',
      concepts: [
        { label: 'Aggregate to one row per tier per month first', any: ['group by', 'date_trunc', 'one row per tier'], required: true },
        { label: 'LAG partitioned by tier and ordered by month', any: ['lag ledger', 'lag within', 'lag over'], required: true },
        { label: 'PARTITION BY the tier so growth never crosses tiers', any: ['partition by'], required: true },
        { label: 'Growth as (current minus previous) divided by previous, guarded with NULLIF', any: ['nullif', 'divide by zero'], required: true },
        { label: 'Only complete months: exclude the month in progress', any: ['complete month', 'month in progress', 'incomplete'], required: true },
        { label: 'Missing months make LAG compare the wrong months, so use a calendar spine', any: ['missing month', 'calendar', 'spine'], required: true },
        { label: 'Value is skewed, so also report active merchants or median value', any: ['skew', 'median', 'active merchants', 'per merchant'] }
      ],
      approach: `<p>The standard pattern is aggregate, then LAG, then divide. The marks are in the edges: incomplete months, missing months and a skewed measure.</p>
      <ol>
        <li><strong>Aggregate first</strong> to one row per tier per month. The join to merchants is many-to-one, so it does not fan out.</li>
        <li><strong>LAG within the tier</strong> with PARTITION BY city_tier ORDER BY month, so January of Tier-2 is never compared to December of Tier-1.</li>
        <li><strong>Guard the division</strong> with NULLIF so a month with zero value returns NULL instead of an error.</li>
        <li><strong>Complete months only:</strong> the month in progress always shows a fake decline.</li>
        <li><strong>Missing months:</strong> LAG takes the previous row, not the previous month. If a small tier has a gap, it silently compares against two months ago. A calendar spine cross joined with tiers fixes it.</li>
      </ol>
<pre>WITH monthly AS (
  SELECT m.city_tier,
         DATE_TRUNC('month', e.created_at) AS mon,
         SUM(e.amount) AS ledger_value
  FROM ledger_entries e
  JOIN merchants m ON m.merchant_id = e.merchant_id
  WHERE e.is_deleted = FALSE
    AND e.created_at &gt;= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '13' MONTH
    AND e.created_at &lt;  DATE_TRUNC('month', CURRENT_DATE)
  GROUP BY 1, 2
)
SELECT city_tier, mon, ledger_value,
       (ledger_value - LAG(ledger_value) OVER w) * 100.0
         / NULLIF(LAG(ledger_value) OVER w, 0) AS mom_growth_pct
FROM monthly
WINDOW w AS (PARTITION BY city_tier ORDER BY mon)
ORDER BY city_tier, mon;</pre>
      <p>Thirteen months are pulled so the first of the twelve reported months has a previous month. Because ledger value is heavily skewed by a few wholesalers, I would show active merchants and median value per merchant next to it.</p>`,
      answer: `<p>I would aggregate to one row per city tier per month over complete months only, then use LAG within each tier:</p>
<pre>WITH monthly AS (
  SELECT m.city_tier,
         DATE_TRUNC('month', e.created_at) AS mon,
         SUM(e.amount) AS ledger_value
  FROM ledger_entries e
  JOIN merchants m ON m.merchant_id = e.merchant_id
  WHERE e.is_deleted = FALSE
    AND e.created_at &gt;= DATE_TRUNC('month', CURRENT_DATE) - INTERVAL '13' MONTH
    AND e.created_at &lt;  DATE_TRUNC('month', CURRENT_DATE)
  GROUP BY 1, 2
)
SELECT city_tier, mon, ledger_value,
       (ledger_value - LAG(ledger_value) OVER w) * 100.0
         / NULLIF(LAG(ledger_value) OVER w, 0) AS mom_growth_pct
FROM monthly
WINDOW w AS (PARTITION BY city_tier ORDER BY mon)
ORDER BY city_tier, mon;</pre>
      <p>PARTITION BY keeps the comparison inside each tier, NULLIF avoids divide by zero, and the upper date bound excludes the month in progress, which would otherwise show a fake drop. I pull thirteen months so the first reported month has a predecessor. One subtle issue: LAG returns the previous row, not the previous calendar month, so a missing month in a small tier silently compares against two months earlier; I would build a calendar spine cross joined with tiers and left join the aggregates onto it. Finally, ledger value is skewed by a few large merchants, so I would report active merchants and median value per merchant alongside it.</p>`
    },
    {
      id: 'kb-m2',
      difficulty: 'medium',
      prompt: 'Flag <strong>payments more than 2 standard deviations above that merchant\'s own average</strong>, as a first pass for fraud or data errors. Write it, then critique it.',
      context: 'payments(payment_id, merchant_id, amount, status, created_at)',
      hint: 'Per-merchant statistics, joined back to each row. Then ask whether a mean and standard deviation suit money data at all.',
      concepts: [
        { label: 'Compute per-merchant AVG and STDDEV', any: ['stddev', 'standard deviation'], required: true },
        { label: 'Join the statistics back or use a window OVER (PARTITION BY merchant_id)', any: ['join back', 'partition by', 'over ('], required: true },
        { label: 'Filter on a z-score above 2', any: ['z score', 'two standard deviations', '2 standard deviations'], required: true },
        { label: 'Require a minimum number of payments per merchant', any: ['minimum', 'at least', 'sample size'], required: true },
        { label: 'Money is skewed, so prefer log amounts, median and MAD, or percentiles', any: ['skew', 'median', 'log amount', 'percentile', 'robust'], required: true },
        { label: 'The outlier inflates its own standard deviation, so use trailing history', any: ['inflat', 'trailing', 'historical', 'leave one out'] },
        { label: 'Output is candidates for review, not proof of fraud', any: ['review', 'not proof', 'candidate', 'false positive'] }
      ],
      approach: `<p>Write the straightforward version, then show you know why it is weak. The critique is what scores at Khatabook, where transaction analysis and fraud cases come up often.</p>
<pre>WITH stats AS (
  SELECT payment_id, merchant_id, amount,
         AVG(amount)    OVER (PARTITION BY merchant_id) AS avg_amt,
         STDDEV(amount) OVER (PARTITION BY merchant_id) AS sd_amt,
         COUNT(*)       OVER (PARTITION BY merchant_id) AS n
  FROM payments
  WHERE status = 'success'
)
SELECT payment_id, merchant_id, amount,
       (amount - avg_amt) / NULLIF(sd_amt, 0) AS z_score
FROM stats
WHERE n &gt;= 30
  AND amount &gt; avg_amt + 2 * sd_amt;</pre>
      <ol>
        <li><strong>Mechanics:</strong> per-merchant mean and standard deviation via window functions (or a CTE joined back), then a z-score filter. Two standard deviations is the threshold asked for.</li>
        <li><strong>Minimum sample:</strong> with five payments the standard deviation is meaningless, so require at least 30.</li>
        <li><strong>Skew:</strong> payment amounts are right-skewed, so a normal-distribution rule flags many legitimate large payments. Use log amounts, or median and MAD, or a per-merchant 99th percentile, which are robust.</li>
        <li><strong>Self-inflation:</strong> a single huge payment raises the standard deviation it is judged against. Computing stats on trailing historical payments only, excluding the current one, fixes that and also makes the check usable in real time.</li>
        <li><strong>Interpretation:</strong> the output is candidates for review, not proof of fraud. Festival stock-ups and wholesale orders are legitimate spikes, so measure the false positive rate before alerting anyone.</li>
      </ol>`,
      answer: `<p>A first version using window functions:</p>
<pre>WITH stats AS (
  SELECT payment_id, merchant_id, amount,
         AVG(amount)    OVER (PARTITION BY merchant_id) AS avg_amt,
         STDDEV(amount) OVER (PARTITION BY merchant_id) AS sd_amt,
         COUNT(*)       OVER (PARTITION BY merchant_id) AS n
  FROM payments
  WHERE status = 'success'
)
SELECT payment_id, merchant_id, amount,
       (amount - avg_amt) / NULLIF(sd_amt, 0) AS z_score
FROM stats
WHERE n &gt;= 30
  AND amount &gt; avg_amt + 2 * sd_amt;</pre>
      <p>This computes each merchant's mean and standard deviation, which a CTE joined back would do equally well, and keeps payments with a z score above two, provided the merchant has at least 30 payments, since a standard deviation from five points is meaningless.</p>
      <p>Then the critique. Payment amounts are right-skewed, so a rule built for a normal distribution flags many legitimate large payments; I would use log amounts, or median and MAD, or a per-merchant percentile, which are more robust. A single extreme payment also inflates the very standard deviation it is compared against, so I would compute statistics on trailing historical payments that exclude the current one, which also makes the rule usable in real time. And the output is a list of candidates for review rather than proof of fraud, because festival stock-ups and wholesale orders are genuine spikes; I would measure the false positive rate on a labelled sample before anyone acts on it.</p>`
    },
    {
      id: 'kb-m3',
      difficulty: 'medium',
      prompt: 'Reported at Khatabook: a feature shows <strong>strong adoption in Tier-1 cities but almost none in Tier-2 and Tier-3 towns</strong>. What would you investigate?',
      hint: 'Rule out measurement and rollout first, then walk the adoption funnel, then the merchant context.',
      concepts: [
        { label: 'Check the denominator and definition are the same across tiers', any: ['denominator', 'same definition', 'eligible'], required: true },
        { label: 'Rule out rollout, config or app-version differences', any: ['rollout', 'feature flag', 'app version', 'config'], required: true },
        { label: 'Walk the funnel: aware, tried, repeated, to find where it breaks', any: ['funnel', 'aware', 'discover', 'tried', 'repeat'], required: true },
        { label: 'Language, literacy and localisation', any: ['language', 'literacy', 'localis', 'vernacular'], required: true },
        { label: 'Device and connectivity: low-end Android, storage, patchy network', any: ['low end', 'android', 'connectivity', 'network', 'storage'], required: true },
        { label: 'Business mix: the feature may not fit the merchant types common in smaller towns', any: ['business mix', 'business type', 'relevan'], required: true },
        { label: 'Talk to merchants: field visits, calls, support tickets', any: ['field visit', 'talk to merchants', 'calls', 'support ticket', 'qualitative'], required: true },
        { label: 'Turn the leading hypothesis into a pilot or experiment', any: ['experiment', 'pilot'] }
      ],
      approach: `<p>Go from cheap to expensive: measurement, then rollout, then funnel, then context, then field research. Each step can end the investigation.</p>
      <ol>
        <li><strong>Measurement.</strong> Is adoption computed on the same denominator in each tier, for example eligible active merchants rather than all registered users? Smaller towns have more dormant registrations, which deflates a ratio on total users. Are events firing on older app versions?</li>
        <li><strong>Rollout.</strong> Was the feature behind a feature flag or config released city by city, or only on newer app versions that smaller towns adopt slowly?</li>
        <li><strong>Funnel.</strong> Of eligible merchants per tier: how many saw the entry point, tried it once, repeated it. "Never discovered" and "tried and abandoned" have different fixes.</li>
        <li><strong>Language and literacy.</strong> Is the feature localised in the vernacular languages merchants use? Does it depend on typing English or reading long text?</li>
        <li><strong>Device and connectivity.</strong> Low-end Android phones, low storage and patchy network can make a heavy flow fail. Cut adoption by device class and network type.</li>
        <li><strong>Business mix.</strong> Tier-1 merchants skew towards businesses that need GST invoices or inventory, while smaller towns have more small kiranas extending credit to neighbours. The feature may simply be less relevant, and comparing within the same business type removes the mix effect.</li>
        <li><strong>Talk to merchants.</strong> Field visits, calls and support tickets from Tier-2 and Tier-3 users usually explain in an afternoon what dashboards cannot.</li>
        <li><strong>Close with a pilot</strong> of the leading fix, such as a vernacular walkthrough or a lighter flow, in a few towns against a control.</li>
      </ol>`,
      answer: `<p>I would work from cheap checks to expensive ones. First, measurement: confirm adoption uses the same definition and denominator in every tier, ideally eligible active merchants, because smaller towns have more dormant registrations and a ratio on all users would understate them; and check events fire on older app versions. Second, rollout: whether the feature flag or config differed by city, or whether it shipped only on new app versions that smaller towns adopt slowly.</p>
      <p>If the gap is real, I would walk the funnel per tier: how many eligible merchants were aware of the entry point, how many tried it once and how many repeated. Then the merchant context: whether the feature is localised in vernacular languages and works for merchants with lower literacy; whether it struggles on low-end Android phones with little storage or on patchy network; and whether business mix explains it, since Tier-1 skews towards merchants who need GST invoices or inventory while smaller towns have more small kiranas extending udhaar. Comparing adoption within the same business type removes that mix effect.</p>
      <p>Alongside the data I would talk to merchants through field visits, calls and support tickets, which usually explains the gap faster than dashboards. I would finish by turning the leading hypothesis, for example a vernacular walkthrough or a lighter flow, into a pilot in a few towns against a control so the fix is measured rather than assumed.</p>`
    },
    {
      id: 'kb-m4',
      difficulty: 'medium',
      prompt: 'Reported at Khatabook: describe how you would set up an <strong>A/B test for a new onboarding flow aimed at first-time app users</strong>.',
      hint: 'Decide what "onboarded" means before anything else, then the unit, the sample size and the guardrails.',
      concepts: [
        { label: 'Primary metric is activation: first ledger entry within a set window', any: ['activation', 'first ledger entry', 'first entry'], required: true },
        { label: 'Randomise new installs at user or device level', any: ['randomi'], required: true },
        { label: 'Guardrails: later retention, uninstalls, sign-up completion, support contacts', any: ['guardrail', 'uninstall', 'day 30', 'd30'], required: true },
        { label: 'Size it from the baseline and a minimum detectable effect', any: ['sample size', 'power', 'minimum detectable', 'mde', 'baseline'], required: true },
        { label: 'Run whole weeks and do not stop early on peeking', any: ['whole weeks', 'full week', 'peek'], required: true },
        { label: 'Check sample ratio mismatch and instrumentation', any: ['sample ratio', 'srm', 'instrument'] },
        { label: 'Pre-register segment cuts: language, tier, device', any: ['pre regist', 'segment', 'heterogen'] }
      ],
      approach: `<p>Structure it as hypothesis, metric, unit, size, duration, guardrails, analysis. The metric definition is where most candidates are vague.</p>
      <ol>
        <li><strong>Hypothesis:</strong> the new flow helps first-time users record their first entry sooner, for example by pre-filling a sample customer or showing a vernacular video.</li>
        <li><strong>Primary metric: activation</strong>, the share of new installs who record their first ledger entry within 24 hours or 7 days. Not "completed onboarding screens", which the new flow can trivially inflate.</li>
        <li><strong>Unit:</strong> randomise each new install at user or device level, at first launch, before they see either flow. Never by city or by week, which confounds the comparison.</li>
        <li><strong>Size:</strong> from the baseline activation rate and the minimum detectable effect worth shipping, compute the sample size for 80% power. Khatabook gets enough installs that this is usually days, not months.</li>
        <li><strong>Duration:</strong> run whole weeks to cover weekday and weekend behaviour, decide the end date in advance, and do not peek and stop on the first significant day.</li>
        <li><strong>Guardrails:</strong> day 30 retention (a flow that pushes a fake first entry activates users who never return), uninstalls, OTP and sign-up completion, and support contacts.</li>
        <li><strong>Analysis:</strong> check sample ratio mismatch and instrumentation first, then the primary metric with a confidence interval, then pre-registered segments such as language, city tier and device class, because a flow can win in Hindi and lose in Tamil.</li>
      </ol>`,
      answer: `<p>The hypothesis would be that the new flow helps first-time users reach value faster. The primary metric is activation: the share of new installs who record their first ledger entry within 24 hours, with a 7-day version as a secondary metric. I would not use "completed onboarding", because the new flow can make completion trivially easy without anyone getting value.</p>
      <p>I would randomise each new install at user or device level on first launch, before either flow is shown, never by city or by time period, since that confounds the result with location or seasonality. From the baseline activation rate and the minimum detectable effect worth shipping, I would compute the sample size needed for 80% power, then run whole weeks so weekday and weekend behaviour are both covered, with the end date fixed in advance so nobody stops early after peeking.</p>
      <p>Guardrails would be day 30 retention, because a flow that pushes a throwaway first entry can activate users who never return, along with uninstalls, OTP and sign-up completion, and support contacts. In the analysis I would first check for sample ratio mismatch and that instrumentation fires equally in both arms, then read the primary metric with its confidence interval, and then look at pre-registered segments such as language, city tier and device class, because an onboarding flow can help Hindi-speaking users and hurt Tamil-speaking ones.</p>`
    },
    {
      id: 'kb-m5',
      difficulty: 'medium',
      prompt: 'Reported at Khatabook: we want to <strong>reduce merchant churn</strong>. What data would you pull first, and how would you segment the problem?',
      hint: 'Churn is a definition before it is a number, and early churn and late churn are different problems.',
      concepts: [
        { label: 'Define churn for the product cadence, and separate it from dormancy or seasonal pauses', any: ['define churn', 'no entry', 'dormant', 'seasonal pause'], required: true },
        { label: 'Read churn by signup cohort and tenure', any: ['cohort', 'tenure'], required: true },
        { label: 'Segment by business type, city tier, acquisition channel and language', any: ['business type', 'acquisition channel', 'city tier'], required: true },
        { label: 'Study behaviour before churn to find leading signals', any: ['before churn', 'declin', 'leading signal', 'early warning'], required: true },
        { label: 'Separate early churn (never activated) from late churn (lost value)', any: ['early churn', 'never activated', 'late churn'], required: true },
        { label: 'Collect reasons: exit surveys, calls, uninstall feedback', any: ['survey', 'reasons', 'uninstall feedback', 'calls'], required: true },
        { label: 'Prioritise segments by size and recoverability, and test interventions with a holdout', any: ['holdout', 'intervention', 'recoverab'], required: true },
        { label: 'Avoid false churn from reinstalls, new devices and offline sync', any: ['reinstall', 'new device', 'false churn', 'offline'] }
      ],
      approach: `<p>Define, size, segment, explain, act. Do not start with a model; start with what churn means for a merchant.</p>
      <ol>
        <li><strong>Define churn.</strong> For a weekly product, "no entry for 30 days" is a reasonable start. Separate it from dormancy and seasonal pauses: a merchant who sells crackers or school uniforms is quiet for months by design.</li>
        <li><strong>Pull data:</strong> signup and activation dates, weekly entry counts, feature usage (reminders, QR, billing), acquisition channel, business type, city tier, language, app version and device, support tickets and uninstall events.</li>
        <li><strong>Cohort it.</strong> Churn curves by signup cohort and tenure show whether newer cohorts churn faster and when most churn happens.</li>
        <li><strong>Split early from late churn.</strong> Early churn, merchants who never activated, is an onboarding problem. Late churn, merchants who used the app for months then stopped, is a value or competition problem. Different owners, different fixes.</li>
        <li><strong>Segment</strong> by business type, city tier, acquisition channel and language, and rank segments by absolute churned merchants, not by rate alone.</li>
        <li><strong>Behaviour before churn.</strong> Compare the last eight weeks of churned and retained merchants: declining active days, never sending a reminder, no QR collections. These become early warning signals.</li>
        <li><strong>Reasons:</strong> exit surveys, calls to a sample of churned merchants and uninstall feedback. Numbers say who, merchants say why.</li>
        <li><strong>Act:</strong> prioritise segments by size times recoverability, and test interventions, such as a reminder nudge for merchants whose activity is declining, against a holdout so the effect is measured.</li>
        <li><strong>Avoid false churn:</strong> reinstalls, a new device or late offline sync can make an active merchant look churned.</li>
      </ol>`,
      answer: `<p>I would start by defining churn for the product's cadence, for example no entry in 30 days, and separating it from dormancy and seasonal pauses, since some merchants are quiet for months by design. I would also make sure reinstalls, new devices and late offline sync are not creating false churn.</p>
      <p>The first data pull would be signup and activation dates, weekly entry counts, feature usage such as reminders, QR collections and billing, acquisition channel, business type, city tier, language, app version, support tickets and uninstall events. From that I would build churn curves by signup cohort and tenure to see when churn happens and whether newer cohorts are worse. The key split is early churn, merchants who never activated, which is an onboarding problem, versus late churn, merchants who used the app for months and stopped, which is a value or competition problem.</p>
      <p>Then I would segment by business type, city tier, acquisition channel and language, ranking segments by the number of churned merchants rather than rate alone, and compare behaviour before churn: declining active days, never sending a reminder, no collections. Those become early warning signals. To understand why, I would run exit surveys, calls with a sample of churned merchants and read uninstall feedback.</p>
      <p>Finally I would prioritise segments by size times recoverability and test interventions, for example a targeted nudge when activity starts declining, against a holdout group so we know what actually reduced churn.</p>`
    },

    /* ---------------------------- HARD ---------------------------- */
    {
      id: 'kb-h1',
      difficulty: 'hard',
      prompt: 'Reported at Khatabook: the dashboard shows <strong>active merchants dropped 20% this morning</strong>. Walk through your investigation step by step, keeping in mind the app works offline.',
      hint: 'In an offline-first app, "today" is always incomplete for a while. Separate when the entry happened from when it reached the server.',
      concepts: [
        { label: 'Offline-first app: entries sync late, so compare by event time and sync time', any: ['offline', 'sync', 'event time', 'late arriv'], required: true },
        { label: 'Check pipeline completeness and freshness before anything else', any: ['pipeline', 'freshness', 'partial load', 'incomplete'], required: true },
        { label: 'Compare against the same weekday and the same hour last weeks', any: ['same weekday', 'same hour', 'same day last week', 'baseline'], required: true },
        { label: 'Check releases, app version, crashes and Android OS', any: ['release', 'app version', 'crash', 'android'], required: true },
        { label: 'Check external causes: OTP or SMS provider, Play Store, network outage, festival or bandh', any: ['otp', 'sms provider', 'festival', 'bandh', 'outage', 'play store'], required: true },
        { label: 'Segment by state, language, app version and device, and rank by contribution', any: ['contribution', 'segment', 'state'], required: true },
        { label: 'Communicate status: confirmed, ruled out, next update', any: ['ruled out', 'status update', 'next update'], required: true },
        { label: 'Prevent: alert on sync lag and freshness, and report by event date with restatement', any: ['alert', 'restat', 'sync lag'] }
      ],
      approach: `<p>A morning drop is most often a measurement problem, and an offline-first app makes that even more likely. Prove the drop is real before forming business hypotheses.</p>
      <ol>
        <li><strong>Is the data complete?</strong> Did last night's pipeline finish, is any partition partially loaded, is the freshness timestamp current? A partial load looks exactly like a 20% drop.</li>
        <li><strong>Offline sync.</strong> Khatabook lets merchants record entries without internet and syncs later. If the dashboard counts by server receipt time, or counts today before slow-syncing devices have uploaded, the latest hours always look low. Compare event time with sync time and check whether sync lag spiked.</li>
        <li><strong>Right baseline.</strong> Compare to the same weekday and the same hour over the last four weeks, not to yesterday's full day. "This morning" against a full day is a guaranteed false alarm.</li>
        <li><strong>If real, what changed?</strong> An app release or new app version (crash rate, sync bug), an Android OS update, a login OTP or SMS provider failure, a Play Store issue, a regional network outage, a festival, bank holiday or bandh in a large state.</li>
        <li><strong>Segment</strong> by state, language, app version, device and acquisition channel, and rank segments by contribution to the drop. Concentration in one app version points to a release; concentration in one state points to a local event; an even spread points to data or a central service.</li>
        <li><strong>Communicate early:</strong> a short status update covering what is confirmed, what is ruled out and when the next update comes.</li>
        <li><strong>Prevent:</strong> alert on pipeline freshness and sync lag, label today's numbers as provisional, report by event date with a restatement window.</li>
      </ol>`,
      answer: `<p>I would first prove the drop is real, because in an offline-first app a morning drop is very often measurement. Step one is data completeness: did the overnight pipeline finish, is any partition a partial load, is the freshness timestamp current. Step two is offline sync: merchants can record entries without internet and those entries arrive later, so if the dashboard counts by sync time, or counts today before devices have uploaded, the latest hours always look low. I would compare event time against sync time and check whether sync lag spiked. Step three is the baseline: compare with the same weekday and the same hour over recent weeks rather than with yesterday's full day.</p>
      <p>If the drop survives that, I would look for what changed: a release or new app version causing crashes or a sync bug, an Android OS update, a login OTP or SMS provider failure, a Play Store problem, a regional network outage, or a festival, bank holiday or bandh in a large state. In parallel I would segment by state, language, app version, device and channel, ranking segments by contribution to the drop; one app version points to a release, one state to a local event, and an even spread to data or a central service.</p>
      <p>Within the first hour I would send a status update covering what is confirmed, what is ruled out and when the next update comes. Afterwards I would add alerts on pipeline freshness and sync lag, label same-day numbers as provisional, and report by event date with a restatement window so this cannot cause a false alarm again.</p>`
    },
    {
      id: 'kb-h2',
      difficulty: 'hard',
      prompt: 'Khatabook offers working-capital loans through NBFC partners to merchants "displaying good credit behaviour". <strong>How would you use ledger and payments data to decide which merchants to pre-approve?</strong>',
      hint: 'A ledger is self-reported. Separate what the merchant typed from what money actually moved, and prove the signal predicts repayment before trusting it.',
      concepts: [
        { label: 'Ledger entries are self-reported and can be manipulated, so weight verified signals', any: ['self reported', 'manipulat', 'verified'], required: true },
        { label: 'Verified cash flow: collections through Khatabook QR, payment links and UPI', any: ['qr', 'payment link', 'verified cash flow', 'upi'], required: true },
        { label: 'Stability: tenure, consistent active weeks, regular entry patterns', any: ['tenure', 'consisten', 'regular'], required: true },
        { label: 'Receivables health: outstanding udhaar, recovery rate, customer concentration', any: ['receivable', 'recovery rate', 'concentration', 'udhaar'], required: true },
        { label: 'Combine with bureau data and the NBFC partner credit policy', any: ['bureau', 'nbfc', 'partner policy', 'lender'], required: true },
        { label: 'Backtest on loans already disbursed: does the signal predict repayment by vintage and DPD?', any: ['backtest', 'vintage', 'dpd'], required: true },
        { label: 'Launch as a controlled pilot: small tickets, exposure caps, stop rules', any: ['pilot', 'small ticket', 'stop rule', 'exposure cap'], required: true },
        { label: 'Selection bias: repayment is only observed for approved merchants', any: ['selection bias', 'reject inference', 'only observed'] },
        { label: 'Consent and RBI digital lending rules on data use', any: ['consent', 'rbi', 'digital lending'] }
      ],
      approach: `<p>This is Khatabook's most distinctive analytics problem: the ledger is a rich behavioural record of businesses with thin credit files, but it is typed in by the borrower. The answer needs signals, validation and a safe launch.</p>
      <ol>
        <li><strong>Trust hierarchy.</strong> Self-reported ledger entries can be manipulated once merchants learn they drive loan offers. Verified cash flow, meaning money actually collected through Khatabook QR, payment links and UPI, is much harder to fake and should carry more weight.</li>
        <li><strong>Stability signals:</strong> tenure on the app, consistency of active weeks, regular entry patterns over months rather than a sudden burst before applying.</li>
        <li><strong>Receivables health:</strong> outstanding udhaar relative to collections, recovery rate of credit given, days to collect, and customer concentration. A merchant whose income depends on three customers is riskier than one with three hundred.</li>
        <li><strong>External data:</strong> bureau score and existing obligations, plus the NBFC partner's own credit policy, since the partner carries the loan on its book and sets the final rules.</li>
        <li><strong>Validate before trusting.</strong> Backtest each signal on loans already disbursed: does it separate merchants who repaid from those who went 30+ DPD, read by vintage at equal months on book?</li>
        <li><strong>Launch safely:</strong> a pilot with small ticket sizes and short tenures, an exposure cap, and pre-agreed stop rules on early delinquency. EDI (daily instalment) repayment gives a very early read on repayment behaviour.</li>
        <li><strong>Name the traps:</strong> selection bias (repayment is only observed for merchants who were approved) and consent and RBI digital lending rules on what data may be used.</li>
      </ol>`,
      answer: `<p>I would start from a trust hierarchy. Ledger entries are self-reported, and once merchants learn that entries drive loan offers they can be manipulated, so I would weight verified signals more heavily: money actually collected through Khatabook QR, payment links and UPI, which is verified cash flow. Behind that come stability signals, meaning tenure on the app, consistent active weeks and regular entry patterns over months rather than a burst just before applying. Then receivables health: outstanding udhaar relative to collections, recovery rate, days to collect and customer concentration, since a business dependent on three customers is fragile.</p>
      <p>Those would be combined with bureau data and the NBFC partner's credit policy, because the partner carries the loan and sets final eligibility. Before trusting any signal, I would backtest it on loans already disbursed and check whether it separates merchants who repaid from those who reached 30+ DPD, comparing vintages at equal months on book.</p>
      <p>The launch would be a pilot: small ticket sizes, short tenures, a hard exposure cap and stop rules agreed in advance on early delinquency. Daily instalment repayment gives a very early read on behaviour. I would also name the two traps: selection bias, since repayment is only observed for approved merchants and needs reject inference or a small exploration slice, and consent and RBI digital lending rules on what data may be used and how it must be disclosed.</p>`
    },
    {
      id: 'kb-h3',
      difficulty: 'hard',
      prompt: 'Write SQL for a <strong>weekly cohort retention table</strong>: for each signup week, the share of merchants who recorded at least one entry in week 0, 1, 2 and so on after signing up.',
      context: 'merchants(merchant_id, signup_date)\nledger_entries(entry_id, merchant_id, created_at, is_deleted)',
      hint: 'Cohort, week offset, distinct actives, divided by the full cohort size. Then deal with cells that cannot exist yet.',
      concepts: [
        { label: 'Cohort merchants by signup week', any: ['signup week', 'cohort week'], required: true },
        { label: 'Compute the week offset since signup with DATE_DIFF', any: ['date_diff', 'week offset', 'weeks since'], required: true },
        { label: 'Count distinct active merchants per cohort and week', any: ['count distinct', 'distinct merchant'], required: true },
        { label: 'Divide by full cohort size, including merchants who never recorded anything', any: ['cohort size', 'full cohort', 'never recorded'], required: true },
        { label: 'Mask cells recent cohorts have not reached, so they do not read as zero', any: ['not reached', 'incomplete', 'censor', 'mask'], required: true },
        { label: 'Distinguish classic retention from unbounded (rolling) retention', any: ['classic retention', 'unbounded', 'rolling retention'], required: true },
        { label: 'Present as a triangle or heatmap', any: ['triangle', 'heatmap', 'pivot'] }
      ],
      approach: `<p>Cohort retention questions test three things: the right denominator, the week offset, and how you treat cells that cannot exist yet.</p>
<pre>WITH cohorts AS (
  SELECT merchant_id, DATE_TRUNC('week', signup_date) AS cohort_week
  FROM merchants
),
cohort_size AS (
  SELECT cohort_week, COUNT(*) AS merchants
  FROM cohorts
  GROUP BY 1
),
activity AS (
  SELECT DISTINCT c.cohort_week, e.merchant_id,
         DATE_DIFF('week', c.cohort_week,
                   DATE_TRUNC('week', e.created_at)) AS week_n
  FROM ledger_entries e
  JOIN cohorts c ON c.merchant_id = e.merchant_id
  WHERE e.is_deleted = FALSE
)
SELECT a.cohort_week, a.week_n, s.merchants AS cohort_size,
       COUNT(DISTINCT a.merchant_id) * 1.0 / s.merchants AS retention
FROM activity a
JOIN cohort_size s ON s.cohort_week = a.cohort_week
WHERE DATE_ADD('week', a.week_n, a.cohort_week) &lt; DATE_TRUNC('week', CURRENT_DATE)
GROUP BY a.cohort_week, a.week_n, s.merchants
ORDER BY 1, 2;</pre>
      <ol>
        <li><strong>Denominator:</strong> cohort size comes from the merchants table, so merchants who never recorded anything are included. Dividing by merchants with any activity is the most common error and inflates every number.</li>
        <li><strong>Week offset:</strong> DATE_DIFF in weeks between the cohort week and the activity week, so week 0 is the signup week.</li>
        <li><strong>Count distinct</strong> merchants per cell, not entries.</li>
        <li><strong>Incomplete cells:</strong> the filter drops cells whose week has not finished. Without it, the latest cohorts show 0% in weeks they have not reached, which looks like a collapse. In the pivoted triangle those cells should be blank, not zero.</li>
        <li><strong>Definition:</strong> this is classic retention (active in exactly week N). Unbounded or rolling retention (active in week N or later) is always higher; say which one leadership is reading.</li>
        <li>Pivot it into a triangle heatmap: reading down a column shows whether newer cohorts retain better at the same age.</li>
      </ol>`,
      answer: `<p>I would cohort merchants by signup week, compute each activity's week offset, count distinct active merchants per cell and divide by the full cohort size:</p>
<pre>WITH cohorts AS (
  SELECT merchant_id, DATE_TRUNC('week', signup_date) AS cohort_week
  FROM merchants
),
cohort_size AS (
  SELECT cohort_week, COUNT(*) AS merchants
  FROM cohorts
  GROUP BY 1
),
activity AS (
  SELECT DISTINCT c.cohort_week, e.merchant_id,
         DATE_DIFF('week', c.cohort_week,
                   DATE_TRUNC('week', e.created_at)) AS week_n
  FROM ledger_entries e
  JOIN cohorts c ON c.merchant_id = e.merchant_id
  WHERE e.is_deleted = FALSE
)
SELECT a.cohort_week, a.week_n, s.merchants AS cohort_size,
       COUNT(DISTINCT a.merchant_id) * 1.0 / s.merchants AS retention
FROM activity a
JOIN cohort_size s ON s.cohort_week = a.cohort_week
WHERE DATE_ADD('week', a.week_n, a.cohort_week) &lt; DATE_TRUNC('week', CURRENT_DATE)
GROUP BY a.cohort_week, a.week_n, s.merchants
ORDER BY 1, 2;</pre>
      <p>The denominator is the full cohort from the merchants table, so merchants who never recorded anything count against retention; dividing by merchants with any activity is the classic mistake. The final filter drops cells whose week is incomplete or not reached yet, because otherwise recent cohorts show zero in weeks that have not happened and the table looks like a collapse; in the pivoted triangle those cells should be blank. This is classic retention, meaning active in exactly week N; unbounded or rolling retention, active in week N or any later week, is always higher, so I would label which one is shown. I would present it as a triangle heatmap so reading down a column compares cohorts at the same age.</p>`
    },
    {
      id: 'kb-h4',
      difficulty: 'hard',
      prompt: 'Leadership believes the <strong>payment reminder feature (SMS/WhatsApp) increases collections</strong>, based on the fact that reminded customers pay faster. How do you test whether that is true?',
      hint: 'Who decides which customers get reminded? That choice is the confounder.',
      concepts: [
        { label: 'The naive comparison suffers from selection bias: engaged merchants remind, and they pick which customers', any: ['selection bias', 'confound', 'self select', 'choose which'], required: true },
        { label: 'Define the outcome: share of outstanding recovered within 7 or 14 days, days to collect', any: ['recovered within', 'days to collect', 'recovery rate'], required: true },
        { label: 'Best answer: a randomised experiment with a holdout', any: ['randomi', 'holdout'], required: true },
        { label: 'Choose the unit carefully to avoid spillover between customers of one merchant', any: ['spillover', 'interference', 'unit of randomi', 'merchant level'], required: true },
        { label: 'Quasi-experimental fallback: difference in differences, matching or regression discontinuity', any: ['difference in differences', 'matching', 'propensity', 'regression discontinuity'], required: true },
        { label: 'Measure incrementality, not just a timing shift of payments that would happen anyway', any: ['incremental', 'paid anyway', 'timing shift', 'pull forward'], required: true },
        { label: 'Guardrails: opt-outs, spam complaints, WhatsApp blocks, merchant-customer relationship', any: ['opt out', 'spam', 'block', 'relationship'], required: true },
        { label: 'Measurement gap: cash payments recorded manually versus collections through the app', any: ['cash', 'recorded manually', 'outside the app'] }
      ],
      approach: `<p>The question is a correlation-versus-causation trap. Name the bias, define the outcome, design the experiment, and have a fallback if an experiment is not possible.</p>
      <ol>
        <li><strong>Why the evidence is weak.</strong> Merchants who send reminders are more engaged and organised, and they choose which customers to remind, usually ones they expect to pay. Both create selection bias: reminded customers might pay faster with or without the reminder.</li>
        <li><strong>Outcome:</strong> share of outstanding balance recovered within 7 or 14 days, and days to collect, measured per customer balance.</li>
        <li><strong>Experiment:</strong> for automatic reminders, randomise which eligible balances get a reminder, with a holdout that does not. If merchants send reminders manually, randomise a prompt that encourages them.</li>
        <li><strong>Unit:</strong> customers of the same merchant share a shopkeeper, and a merchant who sees reminders working may chase other customers personally. That spillover argues for randomising at merchant level, accepting a larger sample.</li>
        <li><strong>Incrementality:</strong> reminders might only move a payment from day 10 to day 3 without changing total recovery. Measure both speed and recovered amount at 30 to 60 days, which separates real recovery from a timing shift.</li>
        <li><strong>Guardrails:</strong> customer opt-outs, spam complaints, WhatsApp block rates, and whether the merchant-customer relationship suffers, measured as repeat purchases by that customer.</li>
        <li><strong>Without an experiment:</strong> difference in differences around the feature launch or a reminder-limit change, propensity matching of reminded and unreminded balances on amount, age and customer history, or regression discontinuity if auto-reminders trigger at a balance threshold. State the assumptions each relies on.</li>
        <li><strong>Measurement gap:</strong> collections through the app are observed directly; cash payments are only visible if recorded manually, so recovery is undercounted unevenly.</li>
      </ol>`,
      answer: `<p>The current evidence suffers from selection bias. Merchants who send reminders are more engaged, and they choose which customers to remind, often the ones they already expect to pay, so reminded customers could pay faster with or without the reminder. Before designing anything I would define the outcome as the share of outstanding balance recovered within 7 and 14 days, plus days to collect, measured per customer balance.</p>
      <p>The best answer is a randomised experiment with a holdout: for automatic reminders, randomly withhold reminders for a share of eligible balances; for manual reminders, randomise a prompt that encourages merchants to send them. The unit of randomisation matters: customers of the same merchant interact through the shopkeeper, so spillover is likely, which argues for randomising at merchant level even though it needs a larger sample. I would measure incrementality and not just speed, because a reminder that moves a payment from day 10 to day 3 without changing the total is a timing shift, not extra money recovered; looking at recovered amount at 30 to 60 days separates the two. Guardrails would be opt-outs, spam complaints, WhatsApp block rates and repeat purchases by reminded customers, since nagging a customer can damage the merchant's relationship.</p>
      <p>If an experiment is not possible, I would use difference in differences around the launch or a policy change, propensity matching of reminded and unreminded balances on amount, age and customer history, or regression discontinuity if reminders trigger at a threshold, stating the assumptions each depends on. One measurement caveat: collections through the app are observed directly, while cash payments only appear if recorded manually, so recovery is undercounted and not evenly.</p>`
    },
    {
      id: 'kb-h5',
      difficulty: 'hard',
      prompt: 'Guesstimate: <strong>how many kirana stores are there in India?</strong> State your assumptions and sanity-check the answer.',
      hint: 'Split urban and rural, estimate people served per store, then cross-check against a number you know about MSMEs.',
      numeric: { value: 1.2e7, display: 'roughly 1.2 to 1.3 crore (12 to 13 million) kirana stores', tolerance: 4 },
      concepts: [
        { label: 'Start from India population of around 145 crore', any: ['145 crore', '140 crore', '1.45 billion', '1.4 billion', 'population'], required: true },
        { label: 'Split urban and rural, since density differs', any: ['urban', 'rural'], required: true },
        { label: 'Assume people or households served per store', any: ['people per store', 'households', 'served by'], required: true },
        { label: 'Define what counts as a kirana', any: ['define', 'definition', 'exclude', 'paan'], required: true },
        { label: 'Commit to a final number with a range', any: ['crore', 'million'], required: true },
        { label: 'Sanity check against roughly 6.3 crore MSMEs', any: ['msme', 'sanity', 'cross check'], required: true },
        { label: 'Rural estimate via villages', any: ['village'] },
        { label: 'Name the most sensitive assumption', any: ['sensitiv', 'depends on'] }
      ],
      approach: `<p>Define the unit, build top down with an urban and rural split, then cross-check. Interviewers reward the structure and the sanity check, not the exact number.</p>
      <ol>
        <li><strong>Define:</strong> neighbourhood general and grocery stores selling daily essentials. Exclude paan and cigarette kiosks, chemists and modern trade chains.</li>
        <li><strong>Population:</strong> about 145 crore, roughly 36% urban (52 crore) and 64% rural (93 crore).</li>
        <li><strong>Urban:</strong> lanes are dense and most households buy daily within walking distance, so assume one kirana per about 80 people, roughly 18 households. That gives about 65 lakh urban stores.</li>
        <li><strong>Rural via villages:</strong> about 6.4 lakh villages averaging around 1,450 people. Assume 8 to 9 small shops per average village, about one per 160 people because rural buying is less frequent and some happens at weekly markets. That gives about 55 lakh rural stores.</li>
        <li><strong>Total:</strong> 65 lakh plus 55 lakh is about 1.2 crore, so quote 1.2 to 1.3 crore.</li>
        <li><strong>Sanity check:</strong> India has about 6.3 crore MSMEs, a figure Khatabook itself cites. Retail is the largest share of micro-enterprises, so kiranas being about a fifth of all MSMEs is plausible.</li>
        <li><strong>Sensitivity:</strong> the answer depends on people per urban store. At 60 the total rises towards 1.4 crore; at 120 it falls towards 1 crore.</li>
      </ol>`,
      answer: `<p>I would define a kirana as a neighbourhood grocery or general store selling daily essentials, excluding paan kiosks, chemists and modern retail chains. India has about 145 crore people, roughly 52 crore urban and 93 crore rural.</p>
      <p>For urban India, most households buy daily essentials within walking distance and lanes are dense, so I would assume one kirana per about 80 people, roughly 18 households, which gives about 65 lakh urban stores. For rural India I would go via villages: about 6.4 lakh villages averaging roughly 1,450 people, with perhaps 8 to 9 small shops in an average village, about one per 160 people because rural purchases are less frequent and some happen at weekly markets. That gives about 55 lakh rural stores. Together that is roughly <strong>1.2 crore kirana stores</strong>, and I would quote a range of 1.2 to 1.3 crore, about 12 to 13 million.</p>
      <p>As a sanity check, India has about 6.3 crore MSMEs, which Khatabook itself cites, and retail is the largest group of micro-enterprises, so kiranas being around a fifth of all MSMEs is plausible. The estimate is most sensitive to people per urban store: at 60 it rises towards 1.4 crore and at 120 it falls towards 1 crore, so that depends on the assumption I would firm up first.</p>`
    }
  ]
});
