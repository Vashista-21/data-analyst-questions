DAQ.registerTopic({
  id: 'python-pandas',
  name: 'Python & Pandas',
  icon: '\uD83D\uDC0D',
  blurb: 'Selection, joins, groupby, time series and the pandas traps that come up in take-home rounds.',
  questions: [
    /* ---------------------------- EASY ---------------------------- */
    {
      id: 'py-e1',
      difficulty: 'easy',
      prompt: 'Explain the difference between <code>.loc</code> and <code>.iloc</code>, and what happens with <code>df.loc[0:2]</code> versus <code>df.iloc[0:2]</code>.',
      hint: 'One is label-based and inclusive; the other is position-based and exclusive.',
      concepts: [
        { label: '.loc selects by label / index value and boolean masks', any: ['loc', 'label', 'index value', 'name'], required: true },
        { label: '.iloc selects by integer position', any: ['iloc', 'position', 'integer', 'positional'], required: true },
        { label: '.loc slicing is inclusive of the end label', any: ['inclusive', 'includes the end', 'both end', 'end label'], required: true },
        { label: '.iloc slicing excludes the end position, like normal Python slicing', any: ['exclusive', 'excludes', 'not include', 'like python', 'up to'], required: true },
        { label: 'df.loc[0:2] returns 3 rows while df.iloc[0:2] returns 2', any: ['3 row', 'three row', '2 row', 'two row', 'extra row', 'one more'] }
      ],
      approach: `<p>Anchor on the two axes: what you are indexing <em>by</em>, and whether the slice end is included.</p>
      <ol>
        <li><code>.loc</code> is label-based. It accepts index labels, column names and boolean masks, and it is the correct choice for filtering.</li>
        <li><code>.iloc</code> is position-based. It only accepts integers and works like NumPy indexing, which matters when the index is not a clean range.</li>
        <li>The gotcha is slice semantics: <code>.loc[0:2]</code> includes label 2, returning three rows, while <code>.iloc[0:2]</code> stops before position 2, returning two rows.</li>
        <li>Point out where this bites: after filtering or sorting, the index is no longer aligned with position, so <code>.loc[0]</code> and <code>.iloc[0]</code> can return completely different rows. Use <code>reset_index(drop=True)</code> when you need them to agree.</li>
      </ol>`,
      answer: `<p><code>.loc</code> selects by <strong>label</strong> and is <strong>inclusive</strong> of the slice end; <code>.iloc</code> selects by <strong>integer position</strong> and is <strong>exclusive</strong>, like standard Python slicing.</p>
      <pre>df = pd.DataFrame({'x': [10, 20, 30, 40]})

df.loc[0:2]    # labels 0,1,2 -> 3 rows
df.iloc[0:2]   # positions 0,1 -> 2 rows

df.loc[df.x &gt; 15]          # boolean mask: use .loc
df.loc[df.x &gt; 15, 'x'] = 0 # safe assignment, avoids chained indexing</pre>
      <p>After filtering or sorting, label and position diverge, so the two accessors can return different rows for the same number. Call <code>reset_index(drop=True)</code> if you want them realigned.</p>`
    },
    {
      id: 'py-e2',
      difficulty: 'easy',
      prompt: 'A dataframe has missing values in a numeric column and a categorical column. Walk through how you would decide what to do with them.',
      hint: 'Understand why the values are missing before choosing a fill strategy.',
      concepts: [
        { label: 'First quantify the missingness with isna().sum() and its share', any: ['isna', 'isnull', 'sum', 'percentage', 'how many', 'count of missing', 'proportion'], required: true },
        { label: 'Understand why data is missing (random versus systematic)', any: ['why', 'random', 'mcar', 'mar', 'systematic', 'reason', 'root cause', 'pattern'], required: true },
        { label: 'Numeric: median for skewed data, mean only if symmetric', any: ['median', 'mean', 'fillna'], required: true },
        { label: 'Categorical: fill with mode or an explicit "Unknown" category', any: ['mode', 'unknown', 'missing category', 'most frequent', 'other'], required: true },
        { label: 'Dropping rows or columns is valid when missingness is small or the column is mostly empty', any: ['drop', 'dropna', 'remove', 'delete'], required: true },
        { label: 'Add a missing-indicator flag so the pattern is not lost', any: ['indicator', 'flag', 'was missing', 'boolean column', 'new column'] },
        { label: 'Do not impute using information from the test set (leakage)', any: ['leak', 'test set', 'train only', 'fit on train', 'pipeline'] }
      ],
      approach: `<p>Diagnose before you impute. The mechanism of missingness dictates the correct treatment.</p>
      <ol>
        <li><strong>Quantify:</strong> <code>df.isna().mean().sort_values(ascending=False)</code> gives the share missing per column, which decides whether this is a nuisance or a structural problem.</li>
        <li><strong>Diagnose the mechanism:</strong> is it missing at random, or does it encode something? Income missing because high earners skip the question is informative missingness, and blindly filling with the median destroys that signal.</li>
        <li><strong>Numeric:</strong> median for skewed distributions, mean only when roughly symmetric. Group-wise imputation (median within segment) is usually better than a global value. For time series, <code>ffill</code> respects ordering.</li>
        <li><strong>Categorical:</strong> mode when missingness is rare and clearly random, otherwise an explicit <code>"Unknown"</code> level so the model or report can treat it as its own group.</li>
        <li><strong>Dropping:</strong> reasonable when under roughly 5% of rows and plausibly random, or when a column is largely empty and adds nothing.</li>
        <li><strong>Preserve the signal:</strong> add a boolean <code>col_was_missing</code> flag whenever missingness might be predictive.</li>
        <li><strong>Avoid leakage:</strong> compute imputation statistics on training data only, inside a pipeline, never on the full dataset before splitting.</li>
      </ol>`,
      answer: `<pre>df.isna().mean().sort_values(ascending=False)   # share missing per column

# numeric: group-aware median, plus a missingness flag
df['income_missing'] = df['income'].isna().astype(int)
df['income'] = df['income'].fillna(df.groupby('city')['income'].transform('median'))

# categorical: explicit level rather than a guessed mode
df['channel'] = df['channel'].fillna('Unknown')

# drop only when sparse and plausibly random
df = df.dropna(subset=['user_id'])</pre>
      <p>The decision rule: quantify the missingness, work out whether it is random or informative, use median/"Unknown" as robust defaults, keep a missing-indicator when the pattern itself carries signal, and fit imputations on training data only to avoid leakage.</p>`
    },
    {
      id: 'py-e3',
      difficulty: 'easy',
      prompt: 'Given <code>orders(order_id, user_id, city, amount, order_date)</code>, produce per-city total revenue, order count and average order value, sorted by revenue.',
      context: 'orders: order_id, user_id, city, amount, order_date',
      hint: 'A single groupby with named aggregations does all three at once.',
      concepts: [
        { label: 'groupby on city', any: ['groupby', 'group by'], required: true },
        { label: 'agg with multiple aggregations in one pass', any: ['agg', 'aggregate', 'named agg'], required: true },
        { label: 'sum for revenue and count/nunique for orders', any: ['sum', 'count', 'nunique', 'size'], required: true },
        { label: 'mean for average order value', any: ['mean', 'average', 'avg'], required: true },
        { label: 'sort_values descending on revenue', any: ['sort values', 'sort', 'descending', 'ascending false'], required: true },
        { label: 'reset_index to get a flat dataframe', any: ['reset index', 'as index', 'flat'] }
      ],
      approach: `<p>Do it in one pass with named aggregation, which keeps column names clean and avoids a MultiIndex you then have to flatten.</p>
      <ol>
        <li>Group by the dimension: <code>city</code>.</li>
        <li>Use <code>.agg()</code> with keyword arguments so each output column is explicitly named.</li>
        <li>Count orders with <code>nunique</code> on <code>order_id</code> rather than <code>count</code>, so duplicated rows do not inflate the count.</li>
        <li><code>reset_index()</code> to return a normal dataframe, then sort descending on revenue.</li>
      </ol>`,
      answer: `<pre>summary = (
    orders
    .groupby('city')
    .agg(
        revenue=('amount', 'sum'),
        orders=('order_id', 'nunique'),
        aov=('amount', 'mean'),
    )
    .reset_index()
    .sort_values('revenue', ascending=False)
)</pre>
      <p>Named aggregation avoids a MultiIndex on the columns, and <code>nunique</code> protects the order count if the dataframe contains duplicate rows from an upstream join.</p>`
    },
    {
      id: 'py-e4',
      difficulty: 'easy',
      prompt: 'How do you find and remove duplicate rows in pandas, keeping the most recent record per user?',
      hint: 'Sort first, then drop_duplicates with a subset and a keep rule.',
      concepts: [
        { label: 'duplicated() to inspect duplicates before deleting', any: ['duplicated', 'value counts', 'inspect', 'check', 'find'], required: true },
        { label: 'drop_duplicates with subset to define what "duplicate" means', any: ['drop duplicates', 'subset'], required: true },
        { label: 'sort_values on the timestamp before dropping', any: ['sort values', 'sort', 'order by'], required: true },
        { label: 'keep="last" or "first" to control which row survives', any: ['keep', 'last', 'first'], required: true },
        { label: 'Alternative: groupby idxmax on the timestamp', any: ['idxmax', 'groupby', 'transform', 'max', 'rank'] }
      ],
      approach: `<p>Always inspect first, because "duplicate" is a business definition, not a technical one.</p>
      <ol>
        <li><strong>Inspect:</strong> <code>df.duplicated(subset=['user_id']).sum()</code> tells you the scale, and viewing a few duplicated groups tells you whether they are genuine duplicates or legitimate repeated events.</li>
        <li><strong>Define the key:</strong> <code>subset</code> declares which columns constitute identity. Without it, pandas requires every column to match, which usually misses real duplicates.</li>
        <li><strong>Order deliberately:</strong> <code>drop_duplicates</code> keeps the first or last row <em>as the dataframe is currently ordered</em>, so sort by timestamp first or the survivor is arbitrary.</li>
        <li><strong>Alternative:</strong> <code>idxmax</code> on the timestamp within each group is more explicit about intent and does not depend on sort order.</li>
      </ol>`,
      answer: `<pre># how bad is it?
df.duplicated(subset=['user_id']).sum()

# keep the most recent row per user
latest = (
    df.sort_values('updated_at')
      .drop_duplicates(subset=['user_id'], keep='last')
)

# equivalent, order-independent
latest = df.loc[df.groupby('user_id')['updated_at'].idxmax()]</pre>
      <p><code>drop_duplicates</code> depends on current row order, so sorting is part of the logic rather than a cosmetic step. The <code>idxmax</code> version states the rule explicitly and is safer in a pipeline where upstream ordering may change.</p>`
    },
    {
      id: 'py-e5',
      difficulty: 'easy',
      prompt: 'What is the difference between <code>merge</code>, <code>join</code> and <code>concat</code> in pandas, and when do you use each?',
      hint: 'Two combine on keys, one stacks along an axis.',
      concepts: [
        { label: 'merge combines on columns/keys with SQL-style join types', any: ['merge', 'on key', 'column', 'sql', 'join type'], required: true },
        { label: 'join is index-based and is a convenience wrapper on merge', any: ['join', 'index', 'wrapper', 'convenience'], required: true },
        { label: 'concat stacks dataframes along rows or columns', any: ['concat', 'stack', 'append', 'axis'], required: true },
        { label: 'merge supports how = inner, left, right, outer', any: ['inner', 'left', 'right', 'outer', 'how'], required: true },
        { label: 'Use concat for same-schema data such as monthly files', any: ['same schema', 'same column', 'monthly', 'union', 'multiple files', 'stack'] },
        { label: 'Check shape / use validate to catch unintended row multiplication', any: ['shape', 'validate', 'row count', 'one to one', 'one to many', 'check'] }
      ],
      approach: `<p>Separate them by <em>how</em> rows are matched: by key, by index, or not at all.</p>
      <ol>
        <li><code>merge</code>: relational join on one or more columns, with <code>how</code> controlling inner/left/right/outer. This is the workhorse.</li>
        <li><code>join</code>: the same operation but keyed on the index by default. Convenient after <code>set_index</code>, and it is implemented on top of merge.</li>
        <li><code>concat</code>: stacking rather than matching. <code>axis=0</code> unions rows (monthly files with identical schema), <code>axis=1</code> glues columns side by side using index alignment.</li>
        <li>Always verify the result: check <code>shape</code> before and after, and pass <code>validate='m:1'</code> so pandas raises if the join key is unexpectedly non-unique. Silent fan-out is the most common source of inflated metrics.</li>
      </ol>`,
      answer: `<pre># merge: relational join on a key column
df = orders.merge(users, on='user_id', how='left', validate='m:1')

# join: index-based convenience
df = orders.set_index('user_id').join(users.set_index('user_id'), how='left')

# concat: stack same-schema frames
all_months = pd.concat([jan, feb, mar], ignore_index=True)   # rows
side_by_side = pd.concat([features, labels], axis=1)         # columns</pre>
      <p><strong>merge</strong> matches on columns, <strong>join</strong> matches on the index, <strong>concat</strong> stacks without matching keys. Use <code>validate</code> and compare row counts before and after so a one-to-many key does not silently duplicate your rows and inflate every downstream aggregate.</p>`
    },

    /* --------------------------- MEDIUM --------------------------- */
    {
      id: 'py-m1',
      difficulty: 'medium',
      prompt: 'For each user, find their top 3 highest-value orders in pandas. Then explain why <code>apply</code> is a poor choice at scale.',
      hint: 'Rank within group with groupby transform, or use sort + groupby head.',
      concepts: [
        { label: 'sort_values then groupby().head(3)', any: ['sort values', 'head', 'groupby'], required: true },
        { label: 'Or rank within group using groupby rank / transform', any: ['rank', 'transform', 'nlargest', 'row number'], required: true },
        { label: 'apply runs a Python function per group, which is slow', any: ['slow', 'python loop', 'per group', 'overhead', 'not vectoris', 'not vectoriz'], required: true },
        { label: 'Vectorised operations run in C and are far faster', any: ['vectoris', 'vectoriz', 'c level', 'numpy', 'faster', 'built in'], required: true },
        { label: 'Handle ties explicitly with a rank method', any: ['tie', 'method', 'dense', 'first', 'min'], required: true },
        { label: 'nlargest is a readable alternative for top-N per group', any: ['nlargest', 'nsmallest'] }
      ],
      approach: `<p>Give the vectorised solution first, then explain the cost model behind <code>apply</code>.</p>
      <ol>
        <li><strong>Simplest:</strong> sort descending by amount, then <code>groupby('user_id').head(3)</code>. Because <code>head</code> respects the current order, this is a top-3-per-group in two operations.</li>
        <li><strong>More explicit:</strong> compute a rank with <code>groupby('user_id')['amount'].rank(method='first', ascending=False)</code> and filter <code>rank &lt;= 3</code>. This mirrors SQL's <code>ROW_NUMBER()</code> and makes the tie policy visible.</li>
        <li><strong>Why not apply:</strong> <code>groupby.apply(lambda g: g.nlargest(3, 'amount'))</code> is readable but invokes the Python interpreter once per group, materialising a new frame each time. With 100,000 users that is 100,000 Python calls plus 100,000 concatenations, typically an order of magnitude or more slower than the vectorised path.</li>
        <li><strong>Ties:</strong> decide explicitly. <code>method='first'</code> caps output at exactly 3 rows; <code>method='min'</code> or <code>'dense'</code> keeps all tied rows, which can return more than 3.</li>
      </ol>`,
      answer: `<pre># Option 1: sort then take the head of each group
top3 = (orders
        .sort_values(['user_id', 'amount'], ascending=[True, False])
        .groupby('user_id')
        .head(3))

# Option 2: explicit rank, mirrors SQL ROW_NUMBER()
orders['rnk'] = orders.groupby('user_id')['amount'].rank(method='first', ascending=False)
top3 = orders[orders['rnk'] &lt;= 3]

# Readable but slow at scale
top3 = orders.groupby('user_id', group_keys=False).apply(lambda g: g.nlargest(3, 'amount'))</pre>
      <p><code>apply</code> is slow because it calls a Python function once per group and builds an intermediate object each time, so cost scales with the number of groups rather than being handled in vectorised C code. On wide data with many groups the sort-and-head or rank approaches are typically an order of magnitude faster. Choose the rank method deliberately, since it decides whether ties can push the output above three rows per user.</p>`
    },
    {
      id: 'py-m2',
      difficulty: 'medium',
      prompt: 'Explain <code>pivot_table</code> versus <code>groupby</code>, and when reshaping with <code>melt</code> is the right move.',
      hint: 'Long versus wide, and who the output is for.',
      concepts: [
        { label: 'groupby produces long-format aggregated output', any: ['long', 'groupby', 'tidy', 'one row per group', 'stacked'], required: true },
        { label: 'pivot_table spreads a dimension across columns (wide format)', any: ['wide', 'pivot', 'columns', 'cross tab', 'matrix'], required: true },
        { label: 'pivot_table handles aggregation and can fill missing combinations', any: ['aggfunc', 'fill value', 'fillna', 'aggregat', 'margins', 'missing combination'], required: true },
        { label: 'melt converts wide back to long for plotting or modelling', any: ['melt', 'unpivot', 'wide to long', 'stack'], required: true },
        { label: 'Long format is better for further computation; wide is better for reading', any: ['reading', 'presentation', 'human', 'excel', 'report', 'further analysis', 'downstream'], required: true },
        { label: 'pivot fails on duplicate index/column pairs while pivot_table aggregates them', any: ['duplicate', 'pivot table vs pivot', 'aggregates', 'error', 'raise'] }
      ],
      approach: `<p>Frame it as a data-shape question tied to the consumer of the output.</p>
      <ol>
        <li><code>groupby().agg()</code> returns <strong>long</strong> data: one row per group combination. This is the right shape for further computation, joins and plotting libraries.</li>
        <li><code>pivot_table</code> returns <strong>wide</strong> data: it aggregates and then spreads one dimension across columns. It is the right shape for humans reading a table, for example month down the rows and city across the columns.</li>
        <li><code>pivot_table</code> adds practical conveniences: <code>aggfunc</code> for the aggregation, <code>fill_value</code> for empty combinations, and <code>margins=True</code> for row and column totals. Plain <code>pivot</code> does no aggregation and raises on duplicate index/column pairs.</li>
        <li><code>melt</code> is the inverse: it collapses many columns into key-value pairs. Use it when data arrives wide (one column per month, a common spreadsheet export) and you need long data for grouping, joining or seaborn-style plotting.</li>
        <li>Rule of thumb: compute in long form, present in wide form.</li>
      </ol>`,
      answer: `<pre># long: good for computation
long = orders.groupby(['month', 'city'], as_index=False)['amount'].sum()

# wide: good for reading
wide = orders.pivot_table(index='month', columns='city', values='amount',
                          aggfunc='sum', fill_value=0, margins=True)

# back to long for plotting or modelling
tidy = wide.reset_index().melt(id_vars='month', var_name='city', value_name='revenue')</pre>
      <p><code>groupby</code> aggregates into long format; <code>pivot_table</code> aggregates and spreads into wide format with <code>aggfunc</code>, <code>fill_value</code> and optional margins; <code>melt</code> converts wide back to long. Note that <code>pivot</code> (without <code>_table</code>) cannot handle duplicate index/column pairs and will raise, whereas <code>pivot_table</code> aggregates them. Compute in long form, present in wide form.</p>`
    },
    {
      id: 'py-m3',
      difficulty: 'medium',
      prompt: 'You have daily transactions and need a <strong>7-day rolling average of revenue per user</strong>, where some users have missing days. How do you do it correctly?',
      hint: 'Missing days must become zero rows before the window is applied.',
      concepts: [
        { label: 'Convert the date column to datetime and sort', any: ['to datetime', 'datetime', 'sort', 'parse date'], required: true },
        { label: 'Missing days must be filled in, otherwise the window spans uneven time', any: ['missing day', 'gap', 'reindex', 'fill', 'asfreq', 'resample', 'complete date', 'spine'], required: true },
        { label: 'Aggregate to one row per user per day first', any: ['groupby', 'per day', 'daily', 'aggregate', 'sum'], required: true },
        { label: 'rolling(7) applied within each user group', any: ['rolling', 'groupby', 'per user', 'window'], required: true },
        { label: 'Use a time-based window ("7D") or reindexed rows for correctness', any: ['7d', 'time based', 'on date', 'offset', 'freq'], required: true },
        { label: 'min_periods controls how the first days are treated', any: ['min periods', 'first day', 'partial window', 'nan'] }
      ],
      approach: `<p>The trap is that <code>rolling(7)</code> counts <em>rows</em>, not days. With missing days, a 7-row window can span three weeks and the metric is silently wrong.</p>
      <ol>
        <li><strong>Normalise types:</strong> parse dates with <code>pd.to_datetime</code> and sort by user and date.</li>
        <li><strong>Aggregate to the daily grain:</strong> one row per user per day, summing revenue.</li>
        <li><strong>Fill the calendar:</strong> reindex each user onto a complete date range, filling revenue with 0. A day with no transaction genuinely contributes zero revenue, so it must appear as a row; dropping it would overstate the average.</li>
        <li><strong>Roll within the user:</strong> apply <code>rolling(7)</code> per user group so windows never cross user boundaries.</li>
        <li><strong>Alternative:</strong> a time-based window (<code>rolling('7D', on='date')</code>) respects calendar gaps without reindexing, but it treats missing days as absent rather than as zeros, which answers a subtly different question. Say which definition you want.</li>
        <li><strong>Edge behaviour:</strong> <code>min_periods=1</code> produces values from day one on a partial window; the default requires a full 7 observations and returns NaN before that. Pick based on whether the first week should be reported.</li>
      </ol>`,
      answer: `<pre>df['date'] = pd.to_datetime(df['date'])

# 1. one row per user per day
daily = df.groupby(['user_id', 'date'], as_index=False)['amount'].sum()

# 2. complete the calendar per user so gaps become zero-revenue days
full_range = pd.date_range(daily['date'].min(), daily['date'].max(), freq='D')
daily = (daily
    .set_index('date')
    .groupby('user_id')['amount']
    .apply(lambda s: s.reindex(full_range, fill_value=0))
    .rename_axis(['user_id', 'date'])
    .reset_index())

# 3. rolling mean within each user
daily['rev_7d_avg'] = (daily
    .groupby('user_id')['amount']
    .transform(lambda s: s.rolling(7, min_periods=1).mean()))</pre>
      <p>The critical step is filling missing days with zeros before rolling, because <code>rolling(7)</code> counts rows rather than calendar days and would otherwise average across an inconsistent time span. A time-based <code>rolling('7D', on='date')</code> avoids reindexing but treats absent days as missing rather than zero, which is a different metric definition and should be stated explicitly.</p>`
    },
    {
      id: 'py-m4',
      difficulty: 'medium',
      prompt: 'What causes <code>SettingWithCopyWarning</code>, and how do you write code that never triggers it?',
      hint: 'Chained indexing means pandas cannot tell whether you have a view or a copy.',
      concepts: [
        { label: 'Caused by chained indexing (two consecutive indexing operations)', any: ['chain', 'two step', 'double index', 'df df', 'consecutive'], required: true },
        { label: 'Pandas cannot guarantee whether the intermediate is a view or a copy', any: ['view', 'copy', 'ambiguous', 'cannot guarantee', 'may or may not'], required: true },
        { label: 'The assignment may silently fail to modify the original dataframe', any: ['silently', 'not modify', 'no effect', 'lost', 'does not update', 'may fail'], required: true },
        { label: 'Fix with a single .loc call for both selection and assignment', any: ['loc', 'single', 'one step', 'combined'], required: true },
        { label: 'Use .copy() when you intentionally want an independent slice', any: ['copy', 'explicit', 'independent'], required: true },
        { label: 'It is a warning about ambiguity, not necessarily a bug in that line', any: ['warning', 'not always', 'ambigu', 'false alarm', 'sometimes fine'] }
      ],
      approach: `<p>Explain the mechanism rather than the ritual fix, because the interviewer wants to know you understand views versus copies.</p>
      <ol>
        <li><strong>Cause:</strong> chained indexing, such as <code>df[df.x &gt; 0]['y'] = 1</code>. The first operation returns a new object which may be a view onto <code>df</code> or an independent copy, decided by internal memory layout. The assignment then targets that intermediate.</li>
        <li><strong>Consequence:</strong> if the intermediate was a copy, the write lands on a temporary object that is immediately discarded, so <code>df</code> is unchanged with no error raised. That silent failure is exactly what the warning is protecting you from.</li>
        <li><strong>Fix:</strong> do selection and assignment in one <code>.loc</code> call, <code>df.loc[df.x &gt; 0, 'y'] = 1</code>, which pandas can resolve unambiguously against the original object.</li>
        <li><strong>When slicing intentionally:</strong> call <code>.copy()</code> explicitly so downstream mutation cannot affect the parent frame, and the intent is documented.</li>
        <li><strong>Nuance worth adding:</strong> the warning is heuristic and sometimes fires on code that is actually fine, but it should never be suppressed. It signals ambiguity, and ambiguity in mutation is a bug waiting to appear after an unrelated upstream change.</li>
      </ol>`,
      answer: `<pre># triggers the warning; may silently not modify df
df[df['amount'] &gt; 100]['flag'] = 1

# correct: one .loc for selection + assignment
df.loc[df['amount'] &gt; 100, 'flag'] = 1

# correct: explicit independent slice
high = df[df['amount'] &gt; 100].copy()
high['flag'] = 1</pre>
      <p>The warning comes from <strong>chained indexing</strong>: the first index returns an object that may be a view or a copy, so pandas cannot guarantee the subsequent assignment reaches the original dataframe. If it was a copy, the write is silently discarded. Use a single <code>.loc</code> for in-place modification, or <code>.copy()</code> when you deliberately want a separate frame. Never suppress the warning, since it flags genuine ambiguity about whether your mutation takes effect.</p>`
    },
    {
      id: 'py-m5',
      difficulty: 'medium',
      prompt: 'A 5 GB CSV will not fit in memory on your laptop. How do you analyse it in pandas?',
      hint: 'Read less, store it smaller, or process it in pieces.',
      concepts: [
        { label: 'Read only the columns you need with usecols', any: ['usecols', 'only the columns', 'select column', 'subset of column'], required: true },
        { label: 'Process in chunks with chunksize and aggregate incrementally', any: ['chunk', 'chunksize', 'iterat', 'batch', 'piece'], required: true },
        { label: 'Downcast dtypes: int32/float32 and category for low-cardinality strings', any: ['dtype', 'downcast', 'int32', 'float32', 'category', 'categor'], required: true },
        { label: 'Convert to a columnar format such as Parquet for repeated analysis', any: ['parquet', 'columnar', 'feather', 'orc', 'compress'], required: true },
        { label: 'Filter rows early so only relevant data is retained', any: ['filter', 'where', 'query', 'subset of row', 'early'], required: true },
        { label: 'Consider out-of-core / SQL engines: Dask, Polars, DuckDB, or a database', any: ['dask', 'polars', 'duckdb', 'spark', 'database', 'sql', 'warehouse'], required: true }
      ],
      approach: `<p>Three levers: read less, represent it smaller, or never hold it all at once. Then escalate tooling if none are enough.</p>
      <ol>
        <li><strong>Read less:</strong> <code>usecols</code> and explicit <code>dtype</code> often cut memory by more than half, since a typical analysis needs a handful of columns. Use <code>nrows</code> first to inspect the schema cheaply.</li>
        <li><strong>Represent it smaller:</strong> pandas defaults to int64/float64 and object strings. Downcasting numerics and converting low-cardinality strings to <code>category</code> frequently reduces footprint several-fold. Parse dates rather than keeping them as objects.</li>
        <li><strong>Chunk it:</strong> iterate with <code>chunksize</code>, filter and aggregate each chunk, and concatenate only the small results. This works for any aggregation that composes, which covers most reporting.</li>
        <li><strong>Change the storage format:</strong> convert once to Parquet. It is columnar and compressed, so subsequent reads pull only the needed columns and are dramatically faster than re-parsing CSV.</li>
        <li><strong>Escalate tooling:</strong> if the work genuinely needs the whole dataset at once, use DuckDB to query the file with SQL directly, Polars for a faster out-of-core dataframe, or Dask/Spark for distribution. Loading it into a warehouse and doing the aggregation in SQL is usually the pragmatic answer at work.</li>
      </ol>`,
      answer: `<pre># 1. read only what you need, with tight dtypes
cols = ['user_id', 'order_date', 'city', 'amount']
dtypes = {'user_id': 'int32', 'city': 'category', 'amount': 'float32'}

# 2. chunked aggregation
totals = []
for chunk in pd.read_csv('orders.csv', usecols=cols, dtype=dtypes,
                         parse_dates=['order_date'], chunksize=1_000_000):
    chunk = chunk[chunk['amount'] &gt; 0]
    totals.append(chunk.groupby('city', observed=True)['amount'].sum())

revenue = pd.concat(totals).groupby(level=0).sum()

# 3. convert once, query cheaply afterwards
pd.read_csv('orders.csv', usecols=cols, dtype=dtypes).to_parquet('orders.parquet')

# 4. or let a query engine handle it
# duckdb.query("SELECT city, SUM(amount) FROM 'orders.csv' GROUP BY city").df()</pre>
      <p>Order of attack: restrict columns and downcast dtypes, process in chunks with incremental aggregation, convert to Parquet for repeat work, and escalate to DuckDB, Polars, Dask or the warehouse when the analysis truly needs the full dataset in one pass.</p>`
    },

    /* ---------------------------- HARD ---------------------------- */
    {
      id: 'py-h1',
      difficulty: 'hard',
      prompt: 'Write pandas code to build a <strong>monthly cohort retention table</strong> from <code>users(user_id, signup_date)</code> and <code>events(user_id, event_date)</code>.',
      context: 'users: user_id, signup_date\nevents: user_id, event_date',
      hint: 'Cohort month, activity month, month offset, then pivot and divide by cohort size.',
      concepts: [
        { label: 'Derive cohort month from signup date (to_period or dt.to_period("M"))', any: ['to period', 'cohort month', 'signup month', 'dt.to', 'month'], required: true },
        { label: 'Derive activity month from event date', any: ['activity month', 'event month', 'period', 'month of event'], required: true },
        { label: 'Compute a month offset / period number between the two', any: ['offset', 'period number', 'month index', 'difference', 'minus', 'n'], required: true },
        { label: 'Count distinct users per cohort per offset with nunique', any: ['nunique', 'distinct', 'unique user'], required: true },
        { label: 'Pivot cohorts to rows and offsets to columns', any: ['pivot', 'unstack', 'pivot table'], required: true },
        { label: 'Divide each row by its month-0 cohort size to get retention rates', any: ['divide', 'cohort size', 'month 0', 'div', 'percentage', 'rate'], required: true },
        { label: 'Note that recent cohorts are incomplete and must be read carefully', any: ['incomplete', 'recent cohort', 'partial', 'triangle', 'not enough time', 'censor'] }
      ],
      approach: `<p>Cohort tables are always the same five steps. Do them in order and the pivot falls out.</p>
      <ol>
        <li><strong>Cohort label:</strong> one per user, from signup month. Compute it on <code>users</code> so it does not depend on activity.</li>
        <li><strong>Activity label:</strong> reduce events to distinct user-months, since a user active 40 times in a month must count once.</li>
        <li><strong>Offset:</strong> join activity to cohort and compute <code>activity_month &minus; cohort_month</code> in months. Period arithmetic gives an integer directly, which avoids day-count bugs.</li>
        <li><strong>Matrix:</strong> group by (cohort, offset) with <code>nunique</code> on user_id, then pivot cohorts to rows and offsets to columns.</li>
        <li><strong>Normalise:</strong> divide every row by its offset-0 value to convert counts into retention rates.</li>
        <li><strong>Interpretation caveat:</strong> the lower-right of the matrix is empty because recent cohorts have not aged. Never compare a 1-month-old cohort's month-3 retention to an older cohort's, and never average down a column that mixes complete and incomplete cohorts.</li>
      </ol>`,
      answer: `<pre>users['cohort'] = users['signup_date'].dt.to_period('M')
events['month'] = events['event_date'].dt.to_period('M')

# distinct user-months of activity, joined to the cohort label
activity = (events[['user_id', 'month']]
            .drop_duplicates()
            .merge(users[['user_id', 'cohort']], on='user_id', how='inner'))

activity['offset'] = (activity['month'] - activity['cohort']).apply(lambda x: x.n)

counts = (activity
          .groupby(['cohort', 'offset'])['user_id']
          .nunique()
          .unstack(fill_value=0))

retention = counts.div(counts[0], axis=0).round(3)   # rows = cohort, cols = month offset</pre>
      <p>The two details that matter: deduplicate activity to user-months before counting so heavy users do not distort the numerator, and normalise each row by its own month-0 size. Remember that recent cohorts are structurally incomplete, so read the table along rows (a single cohort ageing) rather than averaging down columns.</p>`
    },
    {
      id: 'py-h2',
      difficulty: 'hard',
      prompt: 'Sessionise a clickstream: given <code>events(user_id, event_time)</code>, assign a session id where a gap of more than 30 minutes starts a new session.',
      context: 'events: user_id, event_time (timestamp)',
      hint: 'Diff within user, flag large gaps, then cumulative-sum the flags.',
      concepts: [
        { label: 'Sort by user and timestamp before any diff', any: ['sort', 'order by', 'sort values'], required: true },
        { label: 'Compute the gap to the previous event within each user with groupby diff/shift', any: ['diff', 'shift', 'previous', 'lag', 'groupby'], required: true },
        { label: 'Flag gaps greater than the 30 minute threshold', any: ['30', 'threshold', 'gap', 'greater', 'timedelta'], required: true },
        { label: 'cumsum the boolean flag to generate session numbers', any: ['cumsum', 'cumulative', 'running sum'], required: true },
        { label: 'Treat the first event of each user as a new session', any: ['first event', 'nat', 'null', 'fillna', 'na', 'first row'], required: true },
        { label: 'Combine user id with the session counter to make a globally unique id', any: ['unique', 'concat', 'combine', 'user id session', 'astype str'], required: true },
        { label: 'Aggregate afterwards for session-level metrics such as duration and event count', any: ['duration', 'agg', 'session length', 'count', 'metrics'] }
      ],
      approach: `<p>This is the pandas equivalent of gaps-and-islands, and the <code>cumsum</code> of a boolean is the whole trick.</p>
      <ol>
        <li><strong>Sort:</strong> by <code>user_id</code> then <code>event_time</code>. Every subsequent step depends on ordering.</li>
        <li><strong>Gap:</strong> <code>groupby('user_id')['event_time'].diff()</code> gives the time since the previous event for that user, and NaT for their first event.</li>
        <li><strong>Flag:</strong> a new session starts when the gap exceeds 30 minutes, or when the gap is NaT (the user's first event). Both conditions collapse into one boolean.</li>
        <li><strong>Number:</strong> <code>cumsum()</code> of that boolean within the user increments only at session boundaries, so every event inside a session shares the same counter.</li>
        <li><strong>Identify:</strong> concatenate <code>user_id</code> with the counter for a globally unique session id, which matters once you join to other tables.</li>
        <li><strong>Then aggregate:</strong> session-level duration, event count and entry/exit pages come from a single groupby on the new id. Mention that a maximum session length cap is often applied too, since idle tabs can otherwise create implausibly long sessions.</li>
      </ol>`,
      answer: `<pre>events = events.sort_values(['user_id', 'event_time'])

gap = events.groupby('user_id')['event_time'].diff()
new_session = gap.isna() | (gap &gt; pd.Timedelta(minutes=30))

events['session_no'] = new_session.groupby(events['user_id']).cumsum()
events['session_id'] = events['user_id'].astype(str) + '-' + events['session_no'].astype(str)

sessions = events.groupby('session_id').agg(
    user_id=('user_id', 'first'),
    started_at=('event_time', 'min'),
    ended_at=('event_time', 'max'),
    events=('event_time', 'size'),
)
sessions['duration_min'] = (sessions['ended_at'] - sessions['started_at']).dt.total_seconds() / 60</pre>
      <p>The mechanism: <code>diff</code> gives per-user inter-event gaps, a boolean marks gaps over the threshold (plus each user's first event, where the gap is NaT), and <code>cumsum</code> of that boolean turns the flags into consecutive session numbers. In production you would also cap maximum session duration, since an idle tab can otherwise produce a multi-hour "session".</p>`
    },
    {
      id: 'py-h3',
      difficulty: 'hard',
      prompt: 'You must reconcile two dataframes of the same report from different pipelines: same schema, but revenue totals differ by 2%. Write the approach you would code.',
      hint: 'Compare grain, keys and values in that order, and quantify each source of difference.',
      concepts: [
        { label: 'Compare row counts and key uniqueness on both sides first', any: ['row count', 'shape', 'unique', 'duplicate', 'nunique', 'grain'], required: true },
        { label: 'Identify keys present in one side only using set operations or an outer merge', any: ['outer merge', 'indicator', 'set difference', 'anti join', 'isin', 'left only', 'missing key'], required: true },
        { label: 'Merge on the key and compare values row by row', any: ['merge', 'join', 'compare', 'difference', 'delta'], required: true },
        { label: 'Rank differences by magnitude to find where the 2% sits', any: ['sort', 'largest', 'top', 'magnitude', 'rank', 'contribut'], required: true },
        { label: 'Check dtype, rounding, currency and timezone/date-boundary differences', any: ['dtype', 'round', 'float', 'currency', 'timezone', 'time zone', 'date boundary', 'precision'], required: true },
        { label: 'Check filter and status logic such as cancelled or refunded orders', any: ['filter', 'status', 'cancel', 'refund', 'test order', 'exclusion', 'business logic'], required: true },
        { label: 'Aggregate the reconciliation by dimension to localise the discrepancy', any: ['by dimension', 'by city', 'by date', 'by segment', 'group', 'slice', 'localis', 'localiz'], required: true },
        { label: 'Document the resolution and add an automated reconciliation check', any: ['document', 'test', 'automat', 'monitor', 'assert', 'alert'] }
      ],
      approach: `<p>Reconciliation is a decomposition exercise: explain the 2% as a sum of named causes, never as a vague "pipeline difference".</p>
      <ol>
        <li><strong>Establish the grain:</strong> compare <code>shape</code> and key uniqueness on both sides. If one side has duplicate keys, the difference is likely fan-out rather than value drift, and that changes the whole investigation.</li>
        <li><strong>Compare key sets:</strong> outer merge with <code>indicator=True</code> and split into left-only, right-only and both. Quantify how much revenue sits in each bucket immediately, because missing rows and differing values are separate problems needing separate fixes.</li>
        <li><strong>Compare values on shared keys:</strong> compute the per-key delta, then sort by absolute delta. Usually a handful of rows or one dimension accounts for most of the gap, which turns a vague 2% into a concrete lead.</li>
        <li><strong>Test the usual suspects:</strong> float precision and rounding order, dtype coercion, currency conversion or FX rate dates, timezone handling that pushes late-night orders into a different day, and duplicate handling.</li>
        <li><strong>Compare business logic:</strong> definitions diverge far more often than arithmetic. Are cancellations, refunds, test accounts, taxes, shipping and internal orders treated identically? Recompute one side with the other's filter to confirm.</li>
        <li><strong>Localise by dimension:</strong> aggregate the delta by date, city and channel. A gap concentrated on one date suggests a late-arriving or reprocessed batch; spread evenly suggests a systematic definition or rounding difference.</li>
        <li><strong>Close it out:</strong> report the 2% as an itemised breakdown, agree the source of truth, and add an automated reconciliation test so the next divergence is caught before a stakeholder finds it.</li>
      </ol>`,
      answer: `<pre>key = ['order_date', 'city']

# 1. grain and key integrity
print(a.shape, b.shape, a.duplicated(key).sum(), b.duplicated(key).sum())

# 2. which keys exist on only one side, and how much revenue is involved
cmp = a.merge(b, on=key, how='outer', suffixes=('_a', '_b'), indicator=True)
print(cmp.groupby('_merge')[['revenue_a', 'revenue_b']].sum())

# 3. where do shared keys disagree, ranked by impact
both = cmp[cmp['_merge'] == 'both'].copy()
both['delta'] = both['revenue_a'].fillna(0) - both['revenue_b'].fillna(0)
print(both.reindex(both['delta'].abs().sort_values(ascending=False).index).head(20))

# 4. localise: is it one date, one city, or spread evenly?
print(both.groupby('order_date')['delta'].sum().sort_values())</pre>
      <p>Sequence: verify grain and key uniqueness, split keys into left-only/right-only/both and price each bucket, rank per-key deltas to find concentration, then test the standard causes (rounding and float precision, dtype coercion, currency and FX dates, timezone date boundaries) and the business-logic definitions (cancellations, refunds, test accounts, tax and shipping). Report the 2% as an itemised list of named causes, agree a source of truth, and add an automated reconciliation check so the next drift is caught by a test rather than by a stakeholder.</p>`
    },
    {
      id: 'py-h4',
      difficulty: 'hard',
      prompt: 'A daily pandas job that used to take 5 minutes now takes 2 hours. Describe how you would find and fix the bottleneck.',
      hint: 'Measure before optimising, and look at joins, apply and dtypes.',
      concepts: [
        { label: 'Profile first to locate the slow step rather than guessing', any: ['profil', 'measure', 'timeit', 'time each', 'cprofile', 'log timing', 'benchmark'], required: true },
        { label: 'Check whether data volume grew, changing the complexity regime', any: ['data grew', 'volume', 'row count', 'size', 'growth', 'more data'], required: true },
        { label: 'Look for row-wise apply / iterrows / Python loops', any: ['apply', 'iterrows', 'loop', 'itertuples', 'row wise'], required: true },
        { label: 'Look for accidental cross joins or fan-out inflating row counts', any: ['cross join', 'fan out', 'duplicate', 'many to many', 'explod', 'row count after join'], required: true },
        { label: 'Check memory pressure and swapping, and reduce dtypes', any: ['memory', 'swap', 'ram', 'dtype', 'category', 'downcast', 'spill'], required: true },
        { label: 'Avoid repeated concat in a loop, which is quadratic', any: ['concat in a loop', 'quadratic', 'append in loop', 'build list', 'o n2'], required: true },
        { label: 'Vectorise, use merge instead of lookups, and set indexes for repeated joins', any: ['vectoris', 'vectoriz', 'merge', 'map', 'set index', 'numpy where', 'built in'], required: true },
        { label: 'Consider pushing aggregation to SQL / DuckDB / Polars, or incremental processing', any: ['sql', 'duckdb', 'polars', 'warehouse', 'incremental', 'push down', 'spark', 'dask'], required: true }
      ],
      approach: `<p>The discipline is measure, then attack the largest term. A 24&times; regression is almost always a complexity change rather than uniformly slower code.</p>
      <ol>
        <li><strong>Profile:</strong> add timing around each stage or run cProfile. Never optimise from intuition, because the slow line is frequently not the suspicious-looking one.</li>
        <li><strong>Check the inputs:</strong> compare row counts to last month. Linear growth cannot explain 24&times;, so look for something with worse-than-linear behaviour: a join whose output exploded, or memory pressure tipping the process into swap, where performance falls off a cliff.</li>
        <li><strong>Audit the joins:</strong> log row counts before and after every merge. A key that became non-unique upstream turns a 1:1 join into a fan-out, multiplying rows and making every downstream step slower. This is the single most common cause and often produces wrong numbers too.</li>
        <li><strong>Kill row-wise Python:</strong> replace <code>iterrows</code> and <code>apply(axis=1)</code> with vectorised expressions, <code>np.where</code>, <code>map</code> on a dict, or a merge. Replace <code>df = pd.concat([df, chunk])</code> inside a loop with appending to a list and concatenating once, since the in-loop version is quadratic.</li>
        <li><strong>Reduce memory:</strong> downcast numerics, convert low-cardinality strings to <code>category</code>, and drop unused columns early. If the process is swapping, memory reduction gives a step-change rather than an incremental gain.</li>
        <li><strong>Move work to the right engine:</strong> push filters and aggregations into SQL so only the reduced result reaches pandas, or use DuckDB/Polars. Make the job incremental so it processes yesterday's partition instead of full history.</li>
        <li><strong>Prevent recurrence:</strong> log stage timings and row counts on every run so the next regression is visible on day one, and assert expected row counts after each join.</li>
      </ol>`,
      answer: `<p><strong>Diagnose in order:</strong></p>
      <ol>
        <li><strong>Profile</strong> each stage (timers or cProfile) to find where the 2 hours actually goes.</li>
        <li><strong>Compare input volumes</strong> to the historical baseline. A 24&times; slowdown implies a complexity change, not linear growth.</li>
        <li><strong>Log row counts around every merge.</strong> A key that lost uniqueness upstream converts a 1:1 join into a fan-out, inflating rows and corrupting metrics at the same time.</li>
        <li><strong>Check memory:</strong> if the process is swapping, throughput collapses. Downcast dtypes, use <code>category</code>, and drop unused columns early.</li>
      </ol>
      <p><strong>Fix:</strong> replace <code>iterrows</code>/<code>apply(axis=1)</code> with vectorised operations, <code>np.where</code>, dict <code>map</code> or merges; collect chunks in a list and <code>concat</code> once instead of concatenating in a loop; set indexes for repeated joins; push filtering and aggregation into SQL/DuckDB/Polars so pandas only receives reduced data; and make the job incremental over daily partitions.</p>
      <p><strong>Prevent recurrence:</strong> emit stage timings and post-join row counts on every run, and assert expected row counts so the next regression fails loudly instead of silently doubling runtime.</p>`
    },
    {
      id: 'py-h5',
      difficulty: 'hard',
      prompt: 'Write a reusable function that flags outliers in a numeric column, supporting both the IQR and z-score methods, and explain when each is appropriate.',
      hint: 'IQR is robust and distribution-free; z-scores assume roughly normal data.',
      concepts: [
        { label: 'IQR method: below Q1 - 1.5*IQR or above Q3 + 1.5*IQR', any: ['iqr', 'quartile', 'q1', 'q3', '1.5'], required: true },
        { label: 'Z-score method: absolute standardised distance above a threshold such as 3', any: ['z score', 'zscore', 'standard deviation', 'sigma', '3'], required: true },
        { label: 'IQR is robust because quartiles are not distorted by extremes', any: ['robust', 'not affected', 'resistant', 'percentile based', 'skew'], required: true },
        { label: 'Z-scores assume approximate normality and are themselves distorted by outliers', any: ['normal', 'assume', 'distort', 'inflate', 'breaks down', 'masking'], required: true },
        { label: 'Handle groups separately when the metric has segments', any: ['groupby', 'per group', 'per segment', 'by city', 'within group'], required: true },
        { label: 'Flag rather than delete, and investigate before removing', any: ['flag', 'do not delete', 'investigate', 'keep', 'label', 'winsor', 'cap'], required: true },
        { label: 'Robust alternative: modified z-score using median and MAD', any: ['mad', 'median absolute', 'modified z', 'robust z'] }
      ],
      approach: `<p>Write it as a small, testable function with the method as a parameter, then explain the statistical tradeoff.</p>
      <ol>
        <li><strong>Interface:</strong> take a dataframe, a column, a method and a threshold, and return a boolean Series. Returning a flag rather than a filtered frame keeps the caller in control of what happens to the outliers.</li>
        <li><strong>IQR:</strong> bounds at Q1 &minus; k&sdot;IQR and Q3 + k&sdot;IQR with k = 1.5. Because quartiles are order statistics, extreme values barely shift them, so the method is robust and needs no distributional assumption.</li>
        <li><strong>Z-score:</strong> flag |x &minus; &mu;| / &sigma; &gt; 3. This is only meaningful for roughly symmetric, light-tailed data, and it has a self-defeating property: outliers inflate &sigma;, which can mask the very points you are hunting (the masking effect).</li>
        <li><strong>Robust middle ground:</strong> the modified z-score using the median and MAD keeps the z-score's interpretability without being distorted by the outliers.</li>
        <li><strong>Segment awareness:</strong> a value that is extreme overall may be normal within its city or plan tier, so support group-wise application via <code>groupby().transform()</code>.</li>
        <li><strong>Policy, not just detection:</strong> flag and investigate rather than delete. Genuine extreme values (a bulk corporate order) carry information; only clear data errors should be dropped, and capping or winsorising is usually preferable for modelling.</li>
      </ol>`,
      answer: `<pre>def flag_outliers(df, col, method='iqr', threshold=None, by=None):
    """Return a boolean Series marking outliers in df[col]."""
    s = df[col]

    def _flag(x):
        if method == 'iqr':
            k = 1.5 if threshold is None else threshold
            q1, q3 = x.quantile(0.25), x.quantile(0.75)
            iqr = q3 - q1
            return (x &lt; q1 - k * iqr) | (x &gt; q3 + k * iqr)
        if method == 'zscore':
            k = 3 if threshold is None else threshold
            sd = x.std(ddof=0)
            return (x - x.mean()).abs() &gt; k * sd if sd else pd.Series(False, index=x.index)
        if method == 'mad':                      # robust modified z-score
            k = 3.5 if threshold is None else threshold
            med = x.median()
            mad = (x - med).abs().median()
            return (0.6745 * (x - med).abs() &gt; k * mad) if mad else pd.Series(False, index=x.index)
        raise ValueError(f'unknown method: {method}')

    return df.groupby(by)[col].transform(_flag).astype(bool) if by else _flag(s)


orders['is_outlier'] = flag_outliers(orders, 'amount', method='iqr', by='city')</pre>
      <p><strong>When to use which:</strong> IQR for skewed or unknown distributions, since quartiles are unaffected by extremes; z-score only when data is approximately normal, remembering that outliers inflate &sigma; and can mask themselves; modified z-score (median/MAD) when you want z-score semantics with robustness. Apply within groups when segments have different scales, and <em>flag</em> rather than delete: extreme values are often real and informative, so investigate first and prefer capping over removal for modelling.</p>`
    }
  ]
});
