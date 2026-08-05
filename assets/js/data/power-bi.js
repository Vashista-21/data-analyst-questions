DAQ.registerTopic({
  id: 'power-bi',
  name: 'Power BI',
  icon: '\uD83D\uDCCA',
  blurb: 'Power Query versus DAX, filter context and CALCULATE, star schemas, time intelligence, RLS and model performance.',
  questions: [
    /* ---------------------------- EASY ---------------------------- */
    {
      id: 'pbi-e1',
      difficulty: 'easy',
      prompt: 'What is the difference between <strong>Power Query (M)</strong> and <strong>DAX</strong>, and where should a transformation live?',
      hint: 'One runs at refresh, the other runs when a user clicks a slicer.',
      concepts: [
        { label: 'Power Query is the ETL layer that shapes data at refresh', any: ['power query', 'etl', 'refresh', 'shape', 'transform', 'load'], required: true },
        { label: 'DAX is the analytics layer evaluated at query time', any: ['dax', 'query time', 'when the user', 'analytic', 'calculation language'], required: true },
        { label: 'Transformations belong as far upstream as possible', any: ['upstream', 'source', 'warehouse', 'as early', 'far up'], required: true },
        { label: 'Reshaping such as unpivot, merge and type changes belongs in Power Query', any: ['unpivot', 'merge', 'data type', 'remove column', 'clean'], required: true },
        { label: 'DAX is for aggregation and business logic, not reshaping', any: ['aggregation', 'business logic', 'measure', 'not reshap', 'expensive'] }
      ],
      approach: `<p>Separate them by <strong>when they run</strong>, then give the rule of thumb.</p>
      <ol>
        <li><strong>Power Query (M)</strong> is the ETL layer. It runs at refresh: removing columns, changing types, unpivoting, merging queries, filtering rows. The result is what gets loaded into the model.</li>
        <li><strong>DAX</strong> is the analytics layer. It runs at query time, whenever a user touches a slicer or opens a page, and computes aggregations in the current filter context.</li>
        <li>State the rule interviewers want: do work as far <strong>upstream</strong> as possible. Best in the source database or warehouse, next best in Power Query, last resort in DAX.</li>
        <li>Reason: upstream work happens once per refresh and can fold into a source query, whereas DAX reshaping happens on every interaction and hides logic inside measures.</li>
      </ol>`,
      answer: `<p><strong>Power Query (M)</strong> is the ETL layer, executed at refresh, and is where you clean and reshape: removing columns, changing data types, unpivoting, merging queries, filtering rows. <strong>DAX</strong> is the analytics layer, executed at query time in the current filter context, and is where aggregation and business logic live.</p>
      <p>The rule of thumb is to push every transformation as far <strong>upstream</strong> as it can go — into the source or warehouse first, Power Query second, DAX last. Upstream work runs once per refresh and can fold back into the source query; DAX reshaping runs on every user interaction and buries logic where nobody can find it.</p>`
    },
    {
      id: 'pbi-e2',
      difficulty: 'easy',
      prompt: 'What is the difference between a <strong>calculated column</strong> and a <strong>measure</strong>? Which should be your default?',
      hint: 'One is stored at refresh, the other is computed on demand.',
      concepts: [
        { label: 'A calculated column is evaluated row by row at refresh and stored in the model', any: ['calculated column', 'row by row', 'refresh', 'stored', 'materialis', 'row context'], required: true },
        { label: 'A measure is evaluated at query time in the current filter context', any: ['measure', 'query time', 'filter context', 'on demand', 'when the user'], required: true },
        { label: 'Columns consume memory and increase model size', any: ['memory', 'model size', 'storage', 'consumes', 'bigger'], required: true },
        { label: 'Only a column can be used as a slicer, axis or relationship key', any: ['slicer', 'axis', 'relationship', 'filter by', 'group by'], required: true },
        { label: 'Default to measures for anything aggregated', any: ['default', 'prefer measure', 'measures for', 'wherever possible'] }
      ],
      approach: `<p>Contrast them on <strong>when they are computed</strong> and <strong>whether they are stored</strong>, then give a decision rule.</p>
      <ol>
        <li>A <strong>calculated column</strong> is evaluated row by row at refresh, in row context, and materialised into the model. It costs memory and does not react to slicers, because it is already fixed by the time a user opens the report.</li>
        <li>A <strong>measure</strong> is evaluated at query time in the current filter context. It stores nothing and responds to every slicer, filter and visual.</li>
        <li><strong>Decision rule:</strong> measures for anything aggregated; a calculated column only when you need the value as a slicer, an axis, a grouping, or a relationship key.</li>
        <li>Bonus point: if you need a column, prefer creating it upstream or in Power Query rather than DAX, so the engine can compress it better.</li>
      </ol>`,
      answer: `<p>A <strong>calculated column</strong> is computed row by row at refresh and stored in the model, so it consumes memory and cannot respond to slicers. A <strong>measure</strong> is computed at query time in the current filter context, stores nothing, and reacts to every user interaction.</p>
      <p><strong>Default to measures</strong> for anything aggregated. Use a calculated column only when you need the value as a slicer, an axis, a grouping or a relationship key — cases where the value must physically exist in a row. When you do need one, creating it upstream or in Power Query usually compresses better than creating it in DAX.</p>`
    },
    {
      id: 'pbi-e3',
      difficulty: 'easy',
      prompt: 'Compare <strong>Import</strong> and <strong>DirectQuery</strong> storage modes. When would you use a composite model?',
      hint: 'Where does the data physically sit, and who executes the query?',
      concepts: [
        { label: 'Import loads compressed data into the in-memory VertiPaq engine', any: ['import', 'in memory', 'vertipaq', 'compressed', 'loaded'], required: true },
        { label: 'Import is fastest and supports the full range of DAX and M', any: ['fastest', 'full dax', 'performance', 'all functions', 'no restriction'], required: true },
        { label: 'DirectQuery leaves data at the source and queries it live', any: ['directquery', 'direct query', 'at the source', 'live', 'no data stored'], required: true },
        { label: 'DirectQuery gives current data but is slower and loads the source', any: ['current', 'real time', 'slower', 'load on the source', 'latency'], required: true },
        { label: 'Composite models mix modes, with dual tables and aggregations', any: ['composite', 'mix', 'dual', 'aggregation table', 'both'] }
      ],
      approach: `<p>Compare on four axes: where the data sits, speed, freshness, and functional limits.</p>
      <ol>
        <li><strong>Import:</strong> data is loaded and compressed into the in-memory VertiPaq engine. It is the fastest option and supports the full range of DAX and M, but data is only as current as the last refresh and the model must fit in memory.</li>
        <li><strong>DirectQuery:</strong> nothing is stored; every visual generates a query against the source. Data is current and size is unlimited, but performance depends on the source, the source carries the load, and some DAX and M functions are unavailable.</li>
        <li><strong>Composite:</strong> mix both in one model. Dimension tables can be set to dual mode so they serve imported and DirectQuery queries alike, and aggregation tables let common summary queries hit an imported cache while detail falls through to the source.</li>
      </ol>
      <p>Close with the default: import unless data volume or a genuine real-time requirement forces otherwise.</p>`,
      answer: `<p><strong>Import</strong> loads data into the compressed in-memory VertiPaq engine: fastest, full DAX and M support, but as fresh as the last refresh and limited by memory. <strong>DirectQuery</strong> stores nothing and queries the source live: always current and unlimited in size, but slower, restricted in the functions available, and it puts load on the source system.</p>
      <p>A <strong>composite model</strong> mixes them. Set shared dimension tables to <strong>dual</strong> mode so they can serve both, and build <strong>aggregation</strong> tables so common summary queries are answered from an imported cache while detailed drill-through falls through to DirectQuery. Default to import unless volume or a real-time requirement genuinely rules it out.</p>`
    },
    {
      id: 'pbi-e4',
      difficulty: 'easy',
      prompt: 'Why is a <strong>star schema</strong> the recommended model in Power BI, and what does relationship cardinality and cross-filter direction mean?',
      hint: 'One fact table in the middle, dimensions filtering into it.',
      concepts: [
        { label: 'A star schema has a central fact table surrounded by dimension tables', any: ['star schema', 'fact table', 'dimension table', 'central'], required: true },
        { label: 'Dimensions filter the fact table through one-to-many relationships', any: ['one to many', 'filter', 'propagat', 'flows', 'from the dimension'], required: true },
        { label: 'The engine and DAX are optimised for this shape', any: ['optimis', 'optimiz', 'vertipaq', 'performance', 'designed for', 'faster'], required: true },
        { label: 'Cross-filter direction controls which way filters propagate', any: ['direction', 'single', 'both', 'cross filter', 'propagat'], required: true },
        { label: 'A flat wide table or a snowflake is usually worse', any: ['flat', 'wide table', 'snowflake', 'single table', 'normalis', 'normaliz'] }
      ],
      approach: `<p>Explain the shape, then why the engine prefers it, then the two relationship properties.</p>
      <ol>
        <li><strong>Shape:</strong> one central fact table holding events and measures, surrounded by dimension tables holding descriptive attributes, joined one-to-many from dimension to fact.</li>
        <li><strong>Why:</strong> DAX filter propagation and the VertiPaq engine are built for exactly this. Dimensions filter the fact table, measures aggregate the fact table, and repeated text compresses into the small dimension tables instead of the huge fact table.</li>
        <li><strong>Cardinality:</strong> one-to-many is the normal case; many-to-many should be rare and usually signals a missing dimension or bridge table.</li>
        <li><strong>Cross-filter direction:</strong> single means filters flow only from the one side to the many side, which is what you want. Both directions creates ambiguity, slows queries and can undermine row-level security.</li>
      </ol>`,
      answer: `<p>A <strong>star schema</strong> puts one fact table at the centre with dimension tables around it, related one-to-many from dimension to fact. Filters propagate from the dimensions into the fact table, and measures aggregate the fact table.</p>
      <p>It is recommended because the VertiPaq engine and DAX filter propagation are designed for that shape: repeated text compresses into small dimension tables, filters take a single unambiguous path, and query plans stay simple. A flat wide table wastes compression and blocks reuse; a snowflake adds hops for no benefit in most models.</p>
      <p><strong>Cardinality</strong> describes how the keys match, normally one-to-many. <strong>Cross-filter direction</strong> controls which way filters travel: keep it single wherever you can, because both-directions filtering creates ambiguous paths, slows things down, and can weaken row-level security.</p>`
    },
    {
      id: 'pbi-e5',
      difficulty: 'easy',
      prompt: 'Why does a model need a dedicated <strong>date table</strong>, and what is wrong with relying on Power BI\'s automatic date hierarchy?',
      hint: 'Time intelligence functions have requirements, and auto date/time has a hidden cost.',
      concepts: [
        { label: 'Time intelligence functions require a contiguous date table with no gaps', any: ['contiguous', 'no gaps', 'continuous', 'every date', 'complete'], required: true },
        { label: 'It must cover full years and be marked as a date table', any: ['full year', 'mark as date', 'marked as', 'whole year', 'complete year'], required: true },
        { label: 'One shared date table filters multiple fact tables consistently', any: ['shared', 'multiple fact', 'consistent', 'one date table', 'conformed'], required: true },
        { label: 'Auto date/time creates a hidden date table per date column and bloats the model', any: ['auto date', 'hidden', 'per date column', 'bloat', 'model size', 'every date column'], required: true },
        { label: 'A custom date table supports fiscal calendars and custom periods', any: ['fiscal', 'custom period', 'week', 'financial year', 'holiday'] }
      ],
      approach: `<p>Give the functional reason first, then the cost of the automatic alternative.</p>
      <ol>
        <li><strong>Requirement:</strong> functions like <code>TOTALYTD</code>, <code>SAMEPERIODLASTYEAR</code> and <code>DATEADD</code> need a date table that is contiguous, has no gaps, covers whole years, and is marked as a date table so the engine knows to remove filters on it correctly.</li>
        <li><strong>Consistency:</strong> one shared date dimension lets several fact tables be filtered by the same calendar, which is what makes cross-fact comparisons possible.</li>
        <li><strong>Cost of auto date/time:</strong> Power BI silently creates a hidden date table for every date column in the model. In a model with a dozen date columns that is a dozen hidden tables, which inflates file size and refresh time for no benefit.</li>
        <li><strong>Flexibility:</strong> only a custom table can carry a fiscal calendar, ISO weeks, holiday flags or a custom reporting period.</li>
      </ol>`,
      answer: `<p>Time intelligence functions require a proper date dimension: <strong>contiguous, no gaps, covering full years</strong>, and marked as a date table. Without that, <code>TOTALYTD</code> and <code>SAMEPERIODLASTYEAR</code> return wrong or blank results. One shared date table also lets several fact tables be filtered by the same calendar consistently.</p>
      <p>The automatic date hierarchy is the wrong substitute because Power BI creates a <strong>hidden date table for every date column</strong> in the model. A dozen date columns means a dozen hidden tables, which inflates model size and refresh time. Turning auto date/time off and building one date table is a standard first optimisation, and it is also the only way to support a fiscal calendar, ISO weeks or holiday flags.</p>`
    },

    /* --------------------------- MEDIUM --------------------------- */
    {
      id: 'pbi-m1',
      difficulty: 'medium',
      prompt: 'What does <code>CALCULATE</code> do, and what is <strong>context transition</strong>?',
      hint: 'It is the only function that can change filter context.',
      concepts: [
        { label: 'CALCULATE evaluates an expression in a modified filter context', any: ['modif', 'filter context', 'changes the context', 'alters'], required: true },
        { label: 'It is the only function that can change filter context', any: ['only function', 'the only', 'unique', 'core function'], required: true },
        { label: 'Its filter arguments replace existing filters on the same column by default', any: ['replace', 'overwrite', 'same column', 'override', 'keepfilters'], required: true },
        { label: 'Context transition turns the current row into an equivalent filter context', any: ['context transition', 'row into', 'row context', 'transition'], required: true },
        { label: 'That is why CALCULATE behaves differently inside an iterator or column', any: ['iterator', 'sumx', 'calculated column', 'inside', 'differently'], required: true },
        { label: 'KEEPFILTERS intersects instead of replacing', any: ['keepfilters', 'intersect', 'instead of replacing', 'combine'] }
      ],
      approach: `<p>Cover the two things it does, because most candidates only know the first.</p>
      <ol>
        <li><strong>Modifies filter context:</strong> <code>CALCULATE(expression, filter1, filter2)</code> evaluates the expression under a changed set of filters. By default each filter argument <em>replaces</em> any existing filter on the same column, which is why <code>CALCULATE([Sales], Product[Colour] = "Red")</code> ignores a red/blue slicer selection. Wrap in <code>KEEPFILTERS</code> to intersect instead.</li>
        <li><strong>Context transition:</strong> when <code>CALCULATE</code> runs inside a row context — an iterator such as <code>SUMX</code>, or a calculated column — it converts the current row into an equivalent filter context. This is why a bare <code>SUM</code> and a <code>CALCULATE(SUM(...))</code> behave completely differently in the same place.</li>
        <li>Add the practical note: any measure referenced inside an iterator is implicitly wrapped in <code>CALCULATE</code>, so context transition happens whether or not you typed it.</li>
      </ol>`,
      answer: `<p><code>CALCULATE</code> evaluates an expression in a <strong>modified filter context</strong>, and it is the only DAX function that can change filter context. Its filter arguments replace existing filters on the same column by default; <code>KEEPFILTERS</code> makes them intersect instead.</p>
      <pre>Red Sales = CALCULATE ( [Total Sales], Product[Colour] = "Red" )

// Intersects with the user's slicer instead of overriding it
Red Sales Kept = CALCULATE ( [Total Sales], KEEPFILTERS ( Product[Colour] = "Red" ) )</pre>
      <p><strong>Context transition</strong> is the second, deeper behaviour: inside a row context — an iterator like <code>SUMX</code>, or a calculated column — <code>CALCULATE</code> converts the current row into an equivalent filter context. That is why <code>CALCULATE(SUM(Sales[Amount]))</code> inside an iterator returns the value for the current row rather than the whole table. Any measure referenced inside an iterator is implicitly wrapped in <code>CALCULATE</code>, so the transition happens whether or not you wrote it.</p>`
    },
    {
      id: 'pbi-m2',
      difficulty: 'medium',
      prompt: 'What is the difference between <code>SUM</code> and <code>SUMX</code>, and when must you use the iterator?',
      hint: 'One aggregates a stored column; the other evaluates an expression row by row.',
      concepts: [
        { label: 'SUM aggregates a single existing column', any: ['single column', 'existing column', 'one column', 'stored column', 'aggregat'], required: true },
        { label: 'SUMX iterates a table row by row and evaluates an expression', any: ['iterat', 'row by row', 'expression', 'walks', 'each row'], required: true },
        { label: 'Use SUMX when the value does not exist as a column, such as quantity times price', any: ['quantity', 'price', 'multiply', 'does not exist', 'row level calculation'], required: true },
        { label: 'Summing the parts separately then multiplying gives the wrong answer', any: ['wrong', 'incorrect', 'not the same', 'differs', 'multiplying the totals'], required: true },
        { label: 'A calculated column is the memory-versus-CPU alternative', any: ['calculated column', 'trade off', 'memory', 'materialis', 'alternative'] }
      ],
      approach: `<p>Explain the mechanical difference, then give the canonical example that proves why it matters.</p>
      <ol>
        <li><code>SUM</code> aggregates one stored column. It is a pure aggregator and cannot see an expression.</li>
        <li><code>SUMX</code> is an iterator: it walks a table row by row, evaluates the expression in row context, and sums the results.</li>
        <li><strong>The example:</strong> revenue is quantity times price, but there is no revenue column. <code>SUM(Qty) * SUM(Price)</code> is badly wrong — it multiplies two grand totals. <code>SUMX(Sales, Sales[Qty] * Sales[Price])</code> multiplies within each row first, which is the correct grain.</li>
        <li>Mention the alternative: materialising a revenue calculated column trades memory for CPU. On a very large fact table that can be the better choice, but the modern default is the iterator plus a good model.</li>
      </ol>`,
      answer: `<p><code>SUM</code> aggregates one existing column. <code>SUMX</code> is an <strong>iterator</strong>: it walks a table row by row, evaluates an expression in row context, and sums the results.</p>
      <pre>-- Wrong: multiplies two grand totals
Revenue Wrong = SUM ( Sales[Qty] ) * SUM ( Sales[Price] )

-- Right: multiplies within each row, then sums
Revenue = SUMX ( Sales, Sales[Qty] * Sales[Price] )</pre>
      <p>You must use the iterator whenever the value you are summing does not exist as a stored column, because summing the parts separately and multiplying afterwards gives a completely different, incorrect number. The alternative is a calculated column holding the row-level product, which trades model memory for query CPU — occasionally worth it on very large fact tables.</p>`
    },
    {
      id: 'pbi-m3',
      difficulty: 'medium',
      prompt: 'Explain <code>ALL</code>, <code>ALLSELECTED</code> and <code>REMOVEFILTERS</code>, and write a percent-of-total measure.',
      hint: 'The difference is whether slicers outside the visual still apply.',
      concepts: [
        { label: 'ALL removes all filters from the specified table or columns', any: ['removes all', 'ignores', 'all filters', 'entire table', 'grand total'], required: true },
        { label: 'ALLSELECTED respects outer filters such as slicers and page filters', any: ['allselected', 'slicer', 'outer', 'respects', 'visible', 'what the user selected'], required: true },
        { label: 'REMOVEFILTERS is the clearer modern synonym for ALL as a filter modifier', any: ['removefilters', 'synonym', 'same as all', 'clearer', 'modern'], required: true },
        { label: 'Percent of total divides the measure by the same measure with filters removed', any: ['divide', 'denominator', 'same measure', 'percent of total', 'share'], required: true },
        { label: 'Use DIVIDE rather than the division operator to handle divide by zero', any: ['divide', 'divide by zero', 'blank', 'error'], required: true }
      ],
      approach: `<p>Frame the three functions as answering one question: <strong>which filters should the denominator ignore?</strong></p>
      <ol>
        <li><code>ALL</code> removes every filter from the named table or columns, giving the grand total across the whole model regardless of what the user selected.</li>
        <li><code>ALLSELECTED</code> removes filters coming from inside the visual but respects outer filters — slicers, page and report filters — so it gives the total of what the user is currently looking at.</li>
        <li><code>REMOVEFILTERS</code> is the newer, clearer name for <code>ALL</code> used as a filter modifier; it does the same thing but reads unambiguously.</li>
        <li>Then write the measure, and justify <code>DIVIDE</code>: it returns blank instead of erroring when the denominator is zero.</li>
        <li>Say which you would pick: <code>ALLSELECTED</code> for a visual sitting next to slicers, because users expect percentages to add to 100% of what they can see.</li>
      </ol>`,
      answer: `<p><code>ALL</code> strips every filter from the named table or columns, so the denominator is the grand total of the whole model. <code>ALLSELECTED</code> strips filters from within the visual but respects outer filters such as slicers and page filters, so the denominator is the total of what the user has selected. <code>REMOVEFILTERS</code> is the modern, clearer synonym for <code>ALL</code> when used as a filter modifier.</p>
      <pre>% of Visible Total =
DIVIDE (
    [Total Sales],
    CALCULATE ( [Total Sales], ALLSELECTED ( Product[Category] ) )
)

% of Grand Total =
DIVIDE (
    [Total Sales],
    CALCULATE ( [Total Sales], REMOVEFILTERS ( Product ) )
)</pre>
      <p>Use <code>DIVIDE</code> rather than <code>/</code> so a zero or blank denominator returns blank instead of an error. For a visual sitting beside slicers, <code>ALLSELECTED</code> is normally the right choice, because users expect the percentages in front of them to add up to 100%.</p>`
    },
    {
      id: 'pbi-m4',
      difficulty: 'medium',
      prompt: 'Write measures for <strong>year-to-date sales</strong> and <strong>year-over-year growth</strong>, and state what the model needs for them to work.',
      hint: 'Time intelligence is only as good as the date table behind it.',
      concepts: [
        { label: 'A proper date table marked as a date table is required', any: ['date table', 'mark as date', 'marked as', 'calendar'], required: true },
        { label: 'Use TOTALYTD or DATESYTD for year to date', any: ['totalytd', 'datesytd', 'ytd', 'year to date'], required: true },
        { label: 'Use SAMEPERIODLASTYEAR or DATEADD for the prior period', any: ['sameperiodlastyear', 'dateadd', 'parallelperiod', 'prior year', 'last year'], required: true },
        { label: 'Growth = (current - prior) / prior, using DIVIDE', any: ['divide', 'minus', 'current', 'prior', 'growth'], required: true },
        { label: 'Store the prior year in a VAR and reuse it for readability and speed', any: ['var', 'variable', 'reuse', 'readab'], required: true },
        { label: 'Incomplete current periods distort the comparison', any: ['incomplete', 'partial', 'current month', 'to date', 'distort', 'not comparable'] }
      ],
      approach: `<p>Lead with the model requirement, because the measures are trivial once it is right.</p>
      <ol>
        <li><strong>Prerequisite:</strong> a contiguous date table covering full years, related to the fact table, and marked as a date table. Without it, time intelligence silently misbehaves.</li>
        <li><strong>YTD:</strong> <code>TOTALYTD</code> is the shorthand; <code>CALCULATE</code> with <code>DATESYTD</code> is the explicit version and is easier to extend to a fiscal year end.</li>
        <li><strong>Prior year:</strong> <code>SAMEPERIODLASTYEAR</code> shifts the current selection back one year. <code>DATEADD</code> is the general form when you need months or quarters.</li>
        <li><strong>Growth:</strong> subtract and divide with <code>DIVIDE</code>, storing the prior-year value in a <code>VAR</code> so it is evaluated once and the formula stays readable.</li>
        <li><strong>Caveat worth raising:</strong> comparing a partial current month against a full month last year understates growth, so either compare like-for-like periods or label the chart clearly.</li>
      </ol>`,
      answer: `<pre>Sales YTD = TOTALYTD ( [Total Sales], 'Date'[Date] )

-- Explicit form, easy to shift to a fiscal year end
Sales YTD Fiscal =
CALCULATE ( [Total Sales], DATESYTD ( 'Date'[Date], "31/03" ) )

Sales LY = CALCULATE ( [Total Sales], SAMEPERIODLASTYEAR ( 'Date'[Date] ) )

YoY Growth % =
VAR PriorYear = CALCULATE ( [Total Sales], SAMEPERIODLASTYEAR ( 'Date'[Date] ) )
RETURN
    DIVIDE ( [Total Sales] - PriorYear, PriorYear )</pre>
      <p>The model needs a contiguous date table covering full years, related to the fact table and <strong>marked as a date table</strong>; without that these functions return wrong or blank values. Storing the prior year in a <code>VAR</code> evaluates it once and keeps the formula readable, and <code>DIVIDE</code> protects against a zero or blank base.</p>
      <p>One caveat to raise unprompted: an incomplete current period compared against a full prior period understates growth, so either restrict both sides to the same day count or label the visual clearly.</p>`
    },
    {
      id: 'pbi-m5',
      difficulty: 'medium',
      prompt: 'Why are <strong>bi-directional relationships</strong> and <strong>many-to-many</strong> discouraged, and what should you use instead?',
      hint: 'Think about ambiguity, performance and security.',
      concepts: [
        { label: 'Bi-directional filtering creates ambiguous filter paths in a model', any: ['ambigu', 'multiple path', 'unclear', 'circular', 'which path'], required: true },
        { label: 'It degrades query performance', any: ['performance', 'slower', 'expensive', 'degrad', 'cost'], required: true },
        { label: 'It can undermine row-level security by propagating filters unexpectedly', any: ['row level security', 'rls', 'security', 'leak', 'expose'], required: true },
        { label: 'Prefer single direction and enable the reverse per measure with CROSSFILTER', any: ['crossfilter', 'single direction', 'per measure', 'one direction'], required: true },
        { label: 'Resolve many-to-many with a bridge table of unique keys', any: ['bridge', 'dimension table', 'unique', 'distinct', 'intermediate'], required: true }
      ],
      approach: `<p>Give three concrete costs, then the alternatives, so it does not sound like cargo-cult advice.</p>
      <ol>
        <li><strong>Ambiguity:</strong> once filters can travel both ways, a model with several related tables can have more than one path between two tables. The engine either blocks the relationship or picks a path you did not intend.</li>
        <li><strong>Performance:</strong> bi-directional propagation expands the filter work the engine must do on every query.</li>
        <li><strong>Security:</strong> this is the answer that stands out. Filters propagating back up a chain can reach tables that row-level security assumed were unreachable, exposing rows a role should not see.</li>
        <li><strong>Instead:</strong> keep relationships single-direction and turn on the reverse only inside the specific measure that needs it, using <code>CROSSFILTER</code>. For a genuine many-to-many, introduce a bridge table holding the distinct keys and relate both sides to it one-to-many.</li>
      </ol>`,
      answer: `<p>Three reasons. <strong>Ambiguity:</strong> bi-directional filtering can create more than one filter path between two tables, so the engine either refuses the relationship or resolves it in a way you did not intend. <strong>Performance:</strong> propagating filters in both directions adds work to every query. <strong>Security:</strong> filters travelling back up a chain can reach tables that row-level security assumed were protected, which can expose rows a role should never see.</p>
      <pre>-- Keep the relationship single-direction, enable the reverse only where needed
Customers With Sales =
CALCULATE (
    DISTINCTCOUNT ( Customer[CustomerKey] ),
    CROSSFILTER ( Sales[CustomerKey], Customer[CustomerKey], BOTH )
)</pre>
      <p>For a real many-to-many, build a <strong>bridge table</strong> containing the distinct keys and relate both tables to it one-to-many, rather than declaring a many-to-many relationship. That keeps the star shape, keeps filter paths unambiguous, and leaves row-level security predictable.</p>`
    },

    /* ---------------------------- HARD ---------------------------- */
    {
      id: 'pbi-h1',
      difficulty: 'hard',
      prompt: 'Implement <strong>row-level security</strong> so 200 regional managers each see only their region. Compare static and dynamic RLS, and say where RLS does not protect you.',
      hint: 'One role driven by the logged-in user beats 200 hard-coded roles.',
      concepts: [
        { label: 'Static RLS hard-codes a filter per role and does not scale', any: ['static', 'hard code', 'per role', 'does not scale', 'one role per'], required: true },
        { label: 'Dynamic RLS uses USERPRINCIPALNAME against a user mapping table', any: ['userprincipalname', 'username', 'mapping table', 'dynamic', 'user table'], required: true },
        { label: 'One role plus a mapping table scales to any number of users', any: ['one role', 'single role', 'scales', 'any number', 'hundreds'], required: true },
        { label: 'RLS does not apply to workspace members with edit rights or the dataset owner', any: ['workspace', 'edit', 'owner', 'admin', 'does not apply', 'bypass'], required: true },
        { label: 'Test with View as role before publishing', any: ['view as', 'test', 'verify', 'impersonat'], required: true },
        { label: 'RLS filters rows, not columns or measures; that needs object-level security', any: ['object level', 'ols', 'columns', 'not columns', 'measures'] }
      ],
      approach: `<p>Design it, then be explicit about the limits, which is where strong candidates separate themselves.</p>
      <ol>
        <li><strong>Static:</strong> create a role with a DAX filter such as <code>[Region] = "South"</code> and assign users to it. Fine for three regions, unworkable for 200 managers.</li>
        <li><strong>Dynamic:</strong> add a security table mapping each user's email to the regions they may see, relate it to the dimension, and define one role filtering that table with <code>USERPRINCIPALNAME()</code>. One role covers everyone, and access changes become data changes.</li>
        <li><strong>Propagation:</strong> the security table must filter through to the fact table. Check the relationship direction, and be careful that a bi-directional relationship elsewhere does not open a path around the filter.</li>
        <li><strong>Limits to state:</strong> RLS does not apply to workspace members with edit rights or to the dataset owner, so it is not a substitute for workspace permissions. It filters rows only — hiding a column or a measure requires object-level security. And it does not stop someone exporting the rows they are legitimately allowed to see.</li>
        <li><strong>Test:</strong> use "View as role" with specific user principal names, including a manager with two regions and one with none, before publishing.</li>
      </ol>`,
      answer: `<p><strong>Static RLS</strong> defines a hard-coded filter per role, which does not scale past a handful of groups. <strong>Dynamic RLS</strong> uses one role plus a mapping table:</p>
      <pre>-- UserRegion(user_email, region), related to the Region dimension

-- Role filter applied to UserRegion
[user_email] = USERPRINCIPALNAME ()</pre>
      <p>The filter flows from the mapping table into the dimension and on into the fact table, so one role serves 200 managers and access changes become a data refresh rather than a model change.</p>
      <p><strong>Where RLS does not protect you:</strong> it is ignored for workspace members with edit rights and for the dataset owner, so it is not a replacement for workspace permissions; it filters <em>rows</em>, so hiding a sensitive column or measure needs object-level security instead; a bi-directional relationship elsewhere in the model can create a path around the filter; and users can still export the rows they are entitled to see. Always verify with <strong>View as role</strong>, including a manager with multiple regions and one with none, before publishing.</p>`
    },
    {
      id: 'pbi-h2',
      difficulty: 'hard',
      prompt: 'A report page takes 30 seconds to render. Describe how you would find the bottleneck and the fixes you would consider.',
      hint: 'Performance Analyzer first, then DAX Studio to split storage engine from formula engine.',
      concepts: [
        { label: 'Use Performance Analyzer to find which visual and which phase is slow', any: ['performance analyzer', 'which visual', 'measure first', 'profile', 'dax query time'], required: true },
        { label: 'Separate the DAX query time from visual rendering time', any: ['query time', 'render', 'visual display', 'other', 'split'], required: true },
        { label: 'Use DAX Studio to compare storage engine and formula engine time', any: ['dax studio', 'storage engine', 'formula engine', 'server timings', 'scan'], required: true },
        { label: 'Formula-engine-heavy measures often mean row-by-row iteration', any: ['iterat', 'row by row', 'formula engine', 'callback', 'single threaded'], required: true },
        { label: 'Reduce visuals per page and avoid high-cardinality distinct counts', any: ['too many visual', 'number of visual', 'distinct count', 'cardinality', 'fewer'], required: true },
        { label: 'Fix the model: star schema, single-direction filters, fewer columns', any: ['star schema', 'single direction', 'model', 'remove column', 'relationship'], required: true },
        { label: 'Rewrite measures using variables and set-based DAX', any: ['variable', 'var', 'rewrite', 'set based', 'simplif'] }
      ],
      approach: `<p>Measure before changing, and separate report problems from model problems.</p>
      <ol>
        <li><strong>Performance Analyzer:</strong> record the page refresh and read the breakdown per visual — DAX query, visual display, and other. That tells you whether one measure is slow or the page simply has too many visuals, each of which issues its own query.</li>
        <li><strong>DAX Studio:</strong> copy the slow query and look at server timings. A high <strong>storage engine</strong> share points at scanning too much data, so fix the model: reduce cardinality, remove unused columns, and make sure the shape is a star. A high <strong>formula engine</strong> share points at the measure iterating row by row, so rewrite it.</li>
        <li><strong>Common culprits:</strong> distinct counts on high-cardinality columns, measures that iterate large fact tables, bi-directional or many-to-many relationships, complex visuals with many data points, and calculated columns doing work that belongs upstream.</li>
        <li><strong>Report-level fixes:</strong> fewer visuals per page, avoid showing thousands of rows in a table, apply filters to reduce the initial query, and turn off unnecessary interactions between visuals.</li>
        <li><strong>Verify:</strong> re-record after each change so the improvement is attributable rather than assumed.</li>
      </ol>`,
      answer: `<p>Start with <strong>Performance Analyzer</strong> to see which visual is slow and whether the time is in the DAX query or in rendering. Twenty visuals each issuing their own query is a different problem from one slow measure.</p>
      <p>Then take the slow query into <strong>DAX Studio</strong> and read the server timings. A large <strong>storage engine</strong> share means too much data is being scanned, which is a model problem: reduce column cardinality, drop unused columns, split high-cardinality keys, and make sure the model is a clean star. A large <strong>formula engine</strong> share means the measure is being evaluated row by row, which is a DAX problem: introduce variables so repeated sub-expressions are evaluated once, replace nested iterators with set-based expressions, and avoid distinct counts on high-cardinality columns where an approximate or pre-aggregated alternative works.</p>
      <p>Report-level levers: fewer visuals per page, avoid large table visuals, filter down the default state, and disable unneeded cross-visual interactions. Structural levers: fix bi-directional and many-to-many relationships, and move heavy calculated columns upstream. Re-measure after each change so you know which fix actually paid.</p>`
    },
    {
      id: 'pbi-h3',
      difficulty: 'hard',
      prompt: 'A dataset refresh has grown to four hours and sometimes times out. How do you fix it?',
      hint: 'Incremental refresh and query folding are the two big levers.',
      concepts: [
        { label: 'Configure incremental refresh with RangeStart and RangeEnd parameters', any: ['incremental refresh', 'rangestart', 'rangeend', 'partition'], required: true },
        { label: 'Only recent partitions reload while history stays cached', any: ['recent', 'only the last', 'history', 'partition', 'archive'], required: true },
        { label: 'Preserve query folding so filters run at the source', any: ['query folding', 'fold', 'at the source', 'native query', 'pushed down'], required: true },
        { label: 'Steps such as Table.Buffer or custom M can break folding', any: ['table.buffer', 'buffer', 'breaks folding', 'custom', 'index column'], required: true },
        { label: 'Remove unused columns and rows early to cut volume', any: ['unused column', 'remove column', 'fewer rows', 'filter early', 'reduce'], required: true },
        { label: 'Check the on-premises data gateway throughput and resources', any: ['gateway', 'on premises', 'network', 'throughput', 'resource'], required: true },
        { label: 'Push heavy transformation into the warehouse or a dataflow', any: ['warehouse', 'upstream', 'dataflow', 'view', 'source system'] }
      ],
      approach: `<p>Attack volume first, then folding, then infrastructure.</p>
      <ol>
        <li><strong>Volume:</strong> a full refresh of all history every night is usually the root cause. Configure <strong>incremental refresh</strong> with <code>RangeStart</code> and <code>RangeEnd</code> parameters so only the recent window reloads while older partitions stay cached. Remove unused columns and filter rows as early in the query as possible.</li>
        <li><strong>Folding:</strong> check in Power Query whether "View Native Query" is available at each step. If folding breaks partway, everything after that point is processed locally and incremental refresh cannot push its date filter to the source. Common breakers are <code>Table.Buffer</code>, added index columns, and some custom M functions. Reorder steps so folding survives as long as possible.</li>
        <li><strong>Upstream:</strong> move heavy joins and aggregations into the warehouse as a view, or into a dataflow that several datasets can reuse, so the work happens once rather than per dataset.</li>
        <li><strong>Infrastructure:</strong> check the on-premises data gateway for CPU, memory and network throughput, since a saturated gateway makes every dataset slow, and confirm the capacity has memory headroom for the refresh.</li>
        <li><strong>Verify:</strong> compare refresh duration before and after, and monitor it over time rather than assuming the fix holds as data grows.</li>
      </ol>`,
      answer: `<p><strong>Incremental refresh</strong> is the primary fix: define <code>RangeStart</code> and <code>RangeEnd</code> date/time parameters, filter the fact table by them in Power Query, and set the policy to archive several years but refresh only the last few days. Historical partitions then stay cached and each refresh touches a fraction of the data.</p>
      <p>For that to work, <strong>query folding must survive</strong>, so the date filter is executed at the source rather than after loading everything. Check "View Native Query" step by step; <code>Table.Buffer</code>, added index columns and some custom M break folding, and everything after the break is processed locally. Reorder or remove those steps, and remove unused columns and rows as early as possible.</p>
      <p>Beyond the dataset: push heavy joins and aggregations upstream into a warehouse view or a shared dataflow so the work happens once, and check the <strong>on-premises data gateway</strong> for CPU, memory and network throughput, since a saturated gateway slows every dataset behind it. Measure the refresh duration before and after, and keep monitoring it as volumes grow.</p>`
    },
    {
      id: 'pbi-h4',
      difficulty: 'hard',
      prompt: 'Your PBIX is 2 GB and barely opens. What actually drives model size, and how do you reduce it?',
      hint: 'VertiPaq compresses columns, so cardinality is the thing that matters.',
      concepts: [
        { label: 'VertiPaq is columnar, so size is driven by column cardinality not row count', any: ['cardinality', 'column', 'not row', 'distinct value', 'columnar', 'compress'], required: true },
        { label: 'Remove columns the report does not use', any: ['remove column', 'unused', 'drop column', 'fewer column'], required: true },
        { label: 'Split or truncate high-cardinality columns such as datetime and GUID keys', any: ['datetime', 'split', 'truncat', 'guid', 'timestamp', 'separate the time'], required: true },
        { label: 'Turn off auto date/time to remove hidden date tables', any: ['auto date', 'hidden', 'date hierarchy', 'off'], required: true },
        { label: 'Replace row-level detail with aggregated tables where possible', any: ['aggregat', 'summar', 'grain', 'rollup', 'less detail'], required: true },
        { label: 'Use VertiPaq Analyzer or DAX Studio to find the biggest columns', any: ['vertipaq analyzer', 'dax studio', 'measure', 'analyz', 'find the biggest'], required: true },
        { label: 'Avoid storing calculated columns that could be computed upstream', any: ['calculated column', 'upstream', 'power query', 'source'] }
      ],
      approach: `<p>Start from how the engine stores data, because that dictates every fix.</p>
      <ol>
        <li><strong>Principle:</strong> VertiPaq stores data column by column and compresses each column by its distinct values. Model size therefore tracks <strong>cardinality</strong> far more than row count. Ten million rows of a low-cardinality column costs almost nothing; one million distinct timestamps is expensive.</li>
        <li><strong>Measure first:</strong> run VertiPaq Analyzer, through DAX Studio or an external tool, to list columns by size. The result is usually dominated by two or three columns.</li>
        <li><strong>Cut columns:</strong> remove anything the report does not use. Unused surrogate keys, free-text notes and audit columns are the usual offenders.</li>
        <li><strong>Cut cardinality:</strong> split a datetime into a date column and a time column, since the pair compresses far better than the combination; round or truncate values that do not need full precision; and avoid GUID keys where an integer surrogate would do.</li>
        <li><strong>Cut hidden weight:</strong> turn off auto date/time to remove the hidden date table generated for every date column.</li>
        <li><strong>Cut grain:</strong> if the report only ever shows daily totals by store, store daily totals by store rather than every transaction, or add an aggregation table on top of the detail.</li>
      </ol>`,
      answer: `<p>VertiPaq is a <strong>columnar</strong> engine that compresses each column according to its distinct values, so model size is driven by <strong>cardinality</strong>, not row count. That reframes the whole problem: the fix is almost never "fewer rows".</p>
      <p>Diagnose with <strong>VertiPaq Analyzer</strong> in DAX Studio, which lists columns by memory footprint; two or three columns usually account for most of the file. Then work through the levers: remove columns the report does not use, especially unused keys and free-text fields; split high-cardinality <code>datetime</code> columns into separate date and time columns, which compress dramatically better together than apart; reduce numeric precision where full precision is meaningless; replace GUID keys with integer surrogates; and turn off <strong>auto date/time</strong> so Power BI stops generating a hidden date table per date column.</p>
      <p>If the model is still too big, change the grain: store the aggregate the report actually shows, or keep the detail in DirectQuery with an imported aggregation table on top. Finally, move calculated columns upstream into Power Query or the warehouse, since DAX-created columns compress worse than columns loaded from the source.</p>`
    },
    {
      id: 'pbi-h5',
      difficulty: 'hard',
      prompt: 'A measure shows the same value on every row of a table visual instead of breaking down by product. Walk through how you debug it.',
      hint: 'Either the filter does not reach the fact table, or the measure removes it.',
      concepts: [
        { label: 'The symptom means filter context is not reaching the fact table', any: ['filter context', 'not reaching', 'does not propagat', 'not filtering', 'same value'], required: true },
        { label: 'Check whether a relationship exists and is active', any: ['relationship', 'missing', 'inactive', 'active', 'not related'], required: true },
        { label: 'Check the relationship direction and cardinality', any: ['direction', 'cardinality', 'one to many', 'wrong way', 'many side'], required: true },
        { label: 'Check whether the measure uses ALL or REMOVEFILTERS and strips the filter', any: ['all', 'removefilters', 'strips', 'ignores', 'removes the filter'], required: true },
        { label: 'Check the visual is grouping by a column from the related dimension', any: ['dimension', 'wrong table', 'grouping', 'column from', 'disconnected'], required: true },
        { label: 'Isolate by testing a simple SUM in the same visual', any: ['simple', 'test', 'isolate', 'plain sum', 'basic measure'], required: true },
        { label: 'Inactive relationships need USERELATIONSHIP inside CALCULATE', any: ['userelationship', 'inactive', 'activate'] }
      ],
      approach: `<p>Treat it as a filter propagation problem and bisect it rather than rewriting the measure blindly.</p>
      <ol>
        <li><strong>Isolate:</strong> drop a plain <code>SUM</code> of the fact column into the same visual. If it also repeats, the problem is the model, not the measure. If the simple version breaks down correctly, the problem is inside your DAX.</li>
        <li><strong>If it is the model:</strong> check that a relationship exists between the dimension and the fact table, that it is <strong>active</strong> rather than dashed, that cardinality is one-to-many from dimension to fact, and that the filter direction points into the fact table. Also confirm the column you are grouping by comes from the related dimension and not from a disconnected table or the fact table itself.</li>
        <li><strong>If it is the measure:</strong> look for <code>ALL</code>, <code>REMOVEFILTERS</code> or <code>ALLEXCEPT</code>, which deliberately strip filters — exactly what you want in a percent-of-total denominator and exactly what breaks a breakdown when applied to the numerator.</li>
        <li><strong>If the relationship is intentionally inactive</strong>, for example a second date relationship, activate it inside the measure with <code>USERELATIONSHIP</code> in <code>CALCULATE</code>.</li>
        <li><strong>Confirm:</strong> once fixed, verify the rows now sum to the total, since a breakdown that does not reconcile to the grand total signals a remaining filter problem.</li>
      </ol>`,
      answer: `<p>A repeated value on every row means the visual's <strong>filter context is not reaching the fact table</strong>, or the measure is deliberately removing it.</p>
      <p>Bisect first: put a plain <code>SUM(Sales[Amount])</code> in the same visual. If that also repeats, the fault is in the model; if it breaks down correctly, the fault is in the measure.</p>
      <p><strong>Model checks:</strong> does a relationship exist between the product dimension and the fact table, is it active rather than inactive, is the cardinality one-to-many from dimension to fact, and does the filter direction point into the fact table? Also confirm the visual is grouping by a column from the related dimension rather than a disconnected table.</p>
      <p><strong>Measure checks:</strong> look for <code>ALL</code>, <code>REMOVEFILTERS</code> or <code>ALLEXCEPT</code>, which strip the very filter you want. They belong in a denominator, not in the numerator of a breakdown.</p>
      <pre>-- If the relationship is intentionally inactive, activate it in the measure
Sales by Ship Date =
CALCULATE ( [Total Sales], USERELATIONSHIP ( Sales[ShipDate], 'Date'[Date] ) )</pre>
      <p>Once fixed, check that the rows reconcile to the grand total; a breakdown that does not add up means filter context is still going astray.</p>`
    }
  ]
});
