DAQ.registerTopic({
  id: 'tableau',
  name: 'Tableau',
  icon: '\uD83D\uDCC8',
  blurb: 'Pills and filters, joins versus blending, LOD expressions, table calculations and dashboard performance.',
  questions: [
    /* ---------------------------- EASY ---------------------------- */
    {
      id: 'tb-e1',
      difficulty: 'easy',
      prompt: 'What is the difference between a <strong>dimension</strong> and a <strong>measure</strong>? And what do the blue and green pills actually mean?',
      hint: 'Blue versus green is a different distinction from dimension versus measure.',
      concepts: [
        { label: 'Dimensions are qualitative fields that slice the data', any: ['dimension', 'qualitative', 'categorical', 'slice'], required: true },
        { label: 'Measures are numeric fields that get aggregated', any: ['measure', 'aggregat', 'numeric', 'quantitative'], required: true },
        { label: 'Blue is discrete and creates headers or panes', any: ['discrete', 'blue', 'header'], required: true },
        { label: 'Green is continuous and creates an axis', any: ['continuous', 'green', 'axis'], required: true },
        { label: 'A date can be used as either discrete or continuous', any: ['date can', 'month', 'timeline', 'either', 'both ways'] }
      ],
      approach: `<p>Answer this as <strong>two separate distinctions</strong>, because interviewers ask it to see whether you conflate them.</p>
      <ol>
        <li><strong>Dimension vs measure</strong> is about the role of the field. Dimensions are qualitative and slice the view: category, city, order date. Measures are numeric and get aggregated: sales, profit, quantity.</li>
        <li><strong>Blue vs green</strong> is about discrete vs continuous. A blue discrete pill produces headers and separate panes. A green continuous pill produces an axis.</li>
        <li>Show that they are independent with a date: discrete <code>MONTH(Order Date)</code> gives twelve headers that pool every year together, while continuous gives a real timeline across years. The same field, two completely different charts.</li>
      </ol>`,
      answer: `<p>A <strong>dimension</strong> is a qualitative field that slices the data, such as category or city. A <strong>measure</strong> is a numeric field that gets aggregated, such as sales or profit.</p>
      <p>Colour is a different axis of meaning: <strong>blue = discrete</strong>, which draws headers and panes, and <strong>green = continuous</strong>, which draws an axis. Measures are usually green and dimensions usually blue, but that is a default, not a rule; you can convert either way.</p>
      <p>The clearest proof is a date field. Discrete <code>MONTH(Order Date)</code> gives twelve month headers with all years pooled together, which is what you want for seasonality. Continuous month gives one unbroken timeline, which is what you want for a trend. Same field, same data, completely different chart.</p>`
    },
    {
      id: 'tb-e2',
      difficulty: 'easy',
      prompt: 'Compare a <strong>live connection</strong> with an <strong>extract</strong>. When would you choose each?',
      hint: 'Think about data freshness, speed, and load on the source system.',
      concepts: [
        { label: 'Live queries the source directly and always shows current data', any: ['live', 'real time', 'current data', 'fresh', 'queries the source'], required: true },
        { label: 'An extract is a compressed columnar snapshot stored by Tableau', any: ['extract', 'snapshot', 'hyper', 'compressed', 'stored'], required: true },
        { label: 'Extracts are much faster and take load off the source database', any: ['faster', 'performance', 'load off', 'reduces load', 'speed'], required: true },
        { label: 'Extracts are only as fresh as the last refresh, so they need a schedule', any: ['refresh', 'stale', 'schedule', 'not current', 'as fresh as'] },
        { label: 'Extracts work offline and support features some sources lack', any: ['offline', 'without a connection', 'portable', 'packaged'] }
      ],
      approach: `<p>Frame it as a trade of <strong>freshness against speed and load</strong>.</p>
      <ol>
        <li><strong>Live</strong> sends a query to the source for every interaction, so the data is always current and nothing is stored by Tableau. The dashboard is only as fast as the source, and every user interaction is load on a production database.</li>
        <li><strong>Extract</strong> pulls the data into Tableau's compressed columnar <code>.hyper</code> format. It is dramatically faster on slow sources, works offline, and shields the source from dashboard traffic.</li>
        <li>State the cost honestly: an extract is a snapshot, so it is only as fresh as its last refresh and needs a refresh schedule.</li>
      </ol>
      <p>Finish with the practical default: use extracts for most dashboards, especially against transactional databases, and reserve live connections for a genuinely real-time need on a warehouse fast enough to serve it.</p>`,
      answer: `<p><strong>Live</strong> queries the source on every interaction, so the data is always current, but the dashboard inherits the source's speed and puts load on it.</p>
      <p><strong>Extract</strong> is a compressed columnar snapshot (<code>.hyper</code>) stored by Tableau. It is far faster, works offline, and takes load off the source database, but it is only as fresh as the last refresh, so it needs a refresh schedule.</p>
      <p>Default to extracts for most reporting. Choose live when the business genuinely needs up-to-the-minute data, when the source is a fast warehouse, or when the data volume is too large to extract sensibly.</p>`
    },
    {
      id: 'tb-e3',
      difficulty: 'easy',
      prompt: 'What is the difference between a <strong>group</strong> and a <strong>set</strong> in Tableau?',
      hint: 'One is a static bucket; the other is a membership test that can recompute.',
      concepts: [
        { label: 'A group combines members into a larger static bucket', any: ['group', 'combine', 'bucket', 'static', 'merge'], required: true },
        { label: 'A set is a binary in / out classification of members', any: ['set', 'in or out', 'in out', 'membership', 'binary', 'two categories'], required: true },
        { label: 'Computed sets are dynamic and recalculate as data changes', any: ['dynamic', 'recalculat', 'top 10', 'top n', 'condition', 'changes'], required: true },
        { label: 'Sets can be used in calculations and combined with one another', any: ['calculation', 'combine', 'combined set', 'union', 'intersect'] }
      ],
      approach: `<p>Contrast them on <strong>what they produce</strong> and <strong>whether they update</strong>.</p>
      <ol>
        <li>A <strong>group</strong> merges several members of one dimension into a bigger bucket, for example five cities into "South". It is static: a new city does not join the group by itself.</li>
        <li>A <strong>set</strong> splits members into just two categories, in and out. A constant set is a fixed list, but a <strong>computed set</strong> is defined by a condition or a top N rule and recalculates as the data changes.</li>
        <li>Add the capability difference: sets can be referenced inside calculated fields, combined with other sets, and used for in/out analysis, which is how you build "top 10 customers versus everyone else" comparisons.</li>
      </ol>`,
      answer: `<p>A <strong>group</strong> combines dimension members into one larger, static bucket, such as rolling five cities into "South". New members do not join automatically.</p>
      <p>A <strong>set</strong> is a binary in / out classification. A computed set is dynamic: "top 10 customers by sales" recalculates as the data changes, and a condition-based set re-evaluates the same way.</p>
      <p>Sets are also more powerful downstream. You can use them inside a calculation, show them as in/out on a shelf to compare a segment against everyone else, and build combined sets with union or intersection logic. Use a group to tidy up messy labels, and a set when membership is a question the data should answer.</p>`
    },
    {
      id: 'tb-e4',
      difficulty: 'easy',
      prompt: 'What is a <strong>parameter</strong>, and how is it different from a filter?',
      hint: 'A parameter does nothing on its own until something consumes it.',
      concepts: [
        { label: 'A filter restricts the data and is bound to a field', any: ['filter', 'restrict', 'removes rows', 'excludes', 'bound to a field'], required: true },
        { label: 'A parameter is a single user-supplied value independent of the data', any: ['parameter', 'single value', 'user input', 'independent'], required: true },
        { label: 'A parameter has no effect until a calculation, filter or reference line uses it', any: ['calculation', 'reference line', 'no effect', 'until', 'consume', 'used in'], required: true },
        { label: 'Parameters enable swap-the-measure or threshold controls', any: ['swap', 'switch', 'threshold', 'top n', 'what if', 'scenario'] },
        { label: 'A parameter accepts one value at a time, unlike a multi-select filter', any: ['one value', 'single select', 'not multi', 'multi select', 'only one'] }
      ],
      approach: `<p>The core idea: a filter acts on the data, a parameter acts on your <strong>logic</strong>.</p>
      <ol>
        <li>A filter is attached to a field and removes rows or members from the view.</li>
        <li>A parameter is a standalone control holding one user-supplied value. On its own it changes nothing at all.</li>
        <li>It becomes powerful when a calculated field, a filter, a set, or a reference line consumes it. That is how you build a measure swapper, a dynamic top N, or a what-if threshold.</li>
        <li>Note the limitation: a parameter holds a single value, so multi-select needs a real filter or several parameters.</li>
      </ol>`,
      answer: `<p>A <strong>filter</strong> is bound to a field and restricts which data appears. A <strong>parameter</strong> is a single user-supplied value that is independent of the data and has no effect until a calculation, filter, set or reference line uses it.</p>
      <pre>// Measure swapper driven by a string parameter
CASE [Select Measure]
  WHEN "Sales"    THEN SUM([Sales])
  WHEN "Profit"   THEN SUM([Profit])
  WHEN "Quantity" THEN SUM([Quantity])
END</pre>
      <p>Typical uses are swapping the displayed measure, driving a dynamic top N, and setting a what-if threshold on a reference line. The main limitation is that a parameter holds one value at a time, so genuine multi-select still needs a filter.</p>`
    },
    {
      id: 'tb-e5',
      difficulty: 'easy',
      prompt: 'Name the different <strong>types of filters</strong> in Tableau and say what each one acts on.',
      hint: 'They differ by where in the pipeline they are applied.',
      concepts: [
        { label: 'Extract and data source filters limit the data before it reaches the workbook', any: ['extract filter', 'data source filter', 'before', 'limit the data', 'reduce the data'], required: true },
        { label: 'Context filters create a temporary subset that later filters work on', any: ['context filter', 'temporary', 'subset', 'context'], required: true },
        { label: 'Dimension filters act on members and measure filters act after aggregation', any: ['dimension filter', 'measure filter', 'after aggregation', 'aggregated'], required: true },
        { label: 'Table calculation filters hide marks without changing the calculation', any: ['table calc', 'hide', 'without removing', 'late', 'last'] },
        { label: 'They are applied in a fixed order, which changes the result', any: ['order', 'sequence', 'pipeline', 'hierarchy', 'applied in'] }
      ],
      approach: `<p>List them <strong>in pipeline order</strong> rather than at random, because the order is the actual insight.</p>
      <ol>
        <li><strong>Extract filters</strong> limit what goes into the extract at all.</li>
        <li><strong>Data source filters</strong> apply to every worksheet using that source, and are the usual place for security or scope rules.</li>
        <li><strong>Context filters</strong> materialise a temporary subset, so everything after them sees only that subset.</li>
        <li><strong>Dimension filters</strong> keep or drop members; <strong>measure filters</strong> run after aggregation, so they filter on aggregate values.</li>
        <li><strong>Table calculation filters</strong> apply last and only hide marks, leaving the calculation itself untouched.</li>
      </ol>`,
      answer: `<p>In the order Tableau applies them: <strong>extract filters</strong> limit what enters the extract, <strong>data source filters</strong> apply to every sheet on that source, <strong>context filters</strong> create a temporary subset for everything downstream, <strong>dimension filters</strong> keep or remove members, <strong>measure filters</strong> run after aggregation so they can filter on <code>SUM</code> or <code>AVG</code>, and <strong>table calculation filters</strong> apply last and only hide marks.</p>
      <p>The order matters in practice. A dimension filter does not shrink a <code>FIXED</code> level of detail expression, but a context filter does. A table calc filter hides a row without changing a running total, whereas a dimension filter would recompute it.</p>`
    },

    /* --------------------------- MEDIUM --------------------------- */
    {
      id: 'tb-m1',
      difficulty: 'medium',
      prompt: 'What is the difference between a <strong>calculated field</strong> and a <strong>table calculation</strong>?',
      hint: 'One runs in the database, the other runs on what is already in the view.',
      concepts: [
        { label: 'A calculated field is evaluated in the underlying data before aggregation', any: ['calculated field', 'database', 'row level', 'before aggregation', 'underlying data', 'pushed'], required: true },
        { label: 'A table calculation runs on the aggregated result already in the view', any: ['table calculation', 'table calc', 'after', 'aggregated result', 'in the view', 'query result'], required: true },
        { label: 'Table calcs depend on Compute Using: addressing and partitioning', any: ['compute using', 'addressing', 'partition', 'direction'], required: true },
        { label: 'Examples: running total, percent of total, rank, moving average, INDEX', any: ['running total', 'percent of total', 'rank', 'moving average', 'index', 'window'] },
        { label: 'A table calc only sees what is in the view, so filtering changes it', any: ['only sees', 'in the view', 'filter', 'changes the result', 'depends on the view'] }
      ],
      approach: `<p>Separate them by <strong>where the computation happens</strong>.</p>
      <ol>
        <li>A <strong>calculated field</strong> becomes part of the query. It is evaluated in the underlying data, row by row, before aggregation, so it behaves like a database expression.</li>
        <li>A <strong>table calculation</strong> is computed by Tableau afterwards, on the aggregated result already in the view. That is why running total, percent of total, rank, moving average and <code>INDEX()</code> are table calcs.</li>
        <li>Because it works on the view, it needs a direction: <strong>Compute Using</strong> sets the addressing (which fields it moves along) and partitioning (which fields restart it). Getting this wrong is the single most common source of wrong numbers.</li>
        <li>Consequence worth stating: a table calc only sees rows present in the view, so filtering a row out changes the result, while a dimension filter would have removed it before a calculated field ever ran.</li>
      </ol>`,
      answer: `<p>A <strong>calculated field</strong> is pushed into the query and evaluated on the underlying data before aggregation. A <strong>table calculation</strong> is computed after the query, on the aggregated result already in the view.</p>
      <pre>// Calculated field: row-level, evaluated in the database
IF [Profit] &lt; 0 THEN "Loss" ELSE "Profit" END

// Table calculation: operates on the aggregated view
RUNNING_SUM(SUM([Sales]))
SUM([Sales]) / TOTAL(SUM([Sales]))</pre>
      <p>Table calcs need a direction, set through <strong>Compute Using</strong>, which controls addressing (the fields it moves along) and partitioning (the fields that restart it). Because they only see what is in the view, filtering a row out changes the result, whereas a row-level calculated field never sees the filtered rows in the first place.</p>`
    },
    {
      id: 'tb-m2',
      difficulty: 'medium',
      prompt: 'Explain the difference between a <strong>join</strong>, a <strong>data blend</strong> and a <strong>relationship</strong>. Which would you reach for by default today?',
      hint: 'Think about the grain of the result and when the aggregation happens.',
      concepts: [
        { label: 'A join combines tables at row level into one flat result before aggregation', any: ['join', 'row level', 'flat', 'single table', 'before aggregation'], required: true },
        { label: 'Joining tables of different grain duplicates measures (fan-out)', any: ['duplicate', 'fan out', 'inflat', 'double count', 'granularity', 'grain'], required: true },
        { label: 'Blending aggregates each source separately then combines at the view level', any: ['blend', 'aggregated', 'view level', 'linking field', 'separately'], required: true },
        { label: 'Blending is a left join from the primary source on linking fields', any: ['primary', 'secondary', 'left join', 'linking'] },
        { label: 'Relationships keep tables at their own grain and generate the right query per view', any: ['relationship', 'noodle', 'own grain', 'own granularity', 'logical layer', 'per view'], required: true }
      ],
      approach: `<p>Compare them on <strong>when the aggregation happens</strong> relative to the combination.</p>
      <ol>
        <li><strong>Join:</strong> tables are combined at row level into one flat result before any aggregation. If the two sides have different grain, the one-side measures repeat, which silently inflates sums. This fan-out is the classic Tableau data bug.</li>
        <li><strong>Blend:</strong> Tableau queries each source separately, aggregates each, then combines the results at the view level with a left join from the primary source on the linking fields. That makes it possible across different data sources, but the secondary source is always aggregated and cannot drive the grain.</li>
        <li><strong>Relationship:</strong> the logical layer added in 2020.2. Tables stay at their own granularity and Tableau writes the appropriate query for each view, so measures do not duplicate.</li>
      </ol>
      <p>Default answer: use relationships, drop to a physical join when you genuinely need one flat grain, and blend only when the data lives in sources that cannot be modelled together.</p>`,
      answer: `<p><strong>Join</strong> flattens tables at row level before aggregation, so mixing grains duplicates measures — the fan-out problem that inflates revenue. <strong>Blending</strong> queries each source separately, aggregates each one, then left-joins the aggregates at the view level using linking fields, which is why the secondary source can never set the grain. <strong>Relationships</strong> keep every table at its own granularity and let Tableau generate the correct query per view, avoiding duplication without manual pre-aggregation.</p>
      <p>Today the default is relationships. Use a physical join when you truly need a single flat table, for example for a row-level calculation that spans both tables, and use blending only across sources that cannot sit in one model.</p>`
    },
    {
      id: 'tb-m3',
      difficulty: 'medium',
      prompt: 'What is a <strong>context filter</strong>, and give two situations where you genuinely need one.',
      hint: 'It materialises a temporary subset before the rest of the pipeline runs.',
      concepts: [
        { label: 'A context filter creates a temporary subset before other filters run', any: ['temporary', 'subset', 'before other', 'first', 'materialis', 'materializ'], required: true },
        { label: 'Everything downstream sees only the context, including FIXED LODs', any: ['fixed', 'level of detail', 'downstream', 'lod', 'sees only'], required: true },
        { label: 'It makes a top N filter operate within the filtered subset', any: ['top n', 'top 10', 'within', 'recalculat', 'ranked'], required: true },
        { label: 'Percent of total and similar totals then reflect the subset', any: ['percent of total', 'total', 'denominator', 'share'] },
        { label: 'It has a cost, so do not add context filters everywhere', any: ['cost', 'performance', 'expensive', 'overhead', 'slow', 'temporary table'] }
      ],
      approach: `<p>Explain it as <strong>promoting a filter earlier in the pipeline</strong>.</p>
      <ol>
        <li>Normally dimension filters run after <code>FIXED</code> LODs and independently of top N sets. A context filter runs before both, creating a temporary subset that everything downstream sees.</li>
        <li><strong>Case one, top N:</strong> a "top 10 products" filter normally ranks across all data, so filtering to one region still shows the global top 10 with gaps. Put the region filter in context and the top 10 recalculates within that region.</li>
        <li><strong>Case two, FIXED LODs:</strong> a <code>FIXED</code> expression ignores dimension filters by design. If you need the filter to shrink the LOD, promote it to context.</li>
        <li>Mention the trade-off: Tableau materialises the context, which costs time, so it is not a free thing to sprinkle everywhere.</li>
      </ol>`,
      answer: `<p>A <strong>context filter</strong> is applied before the rest of the filter pipeline. Tableau materialises a temporary subset of the data, and every later step — dimension filters, top N sets, <code>FIXED</code> level of detail expressions, percent of total — sees only that subset.</p>
      <p>Two cases where you need it. First, <strong>top N within a selection</strong>: a top 10 products filter ranks globally, so filtering to one region leaves gaps; putting the region filter in context makes the top 10 recalculate inside the region. Second, <strong>making a filter reach a FIXED LOD</strong>, since <code>FIXED</code> ignores ordinary dimension filters and only respects context filters and higher.</p>
      <p>The cost is real work at query time, so use context filters deliberately rather than by default.</p>`
    },
    {
      id: 'tb-m4',
      difficulty: 'medium',
      prompt: 'When would you use a <strong>dual axis</strong> versus a <strong>combined (blended) axis</strong>, and why does synchronising axes matter?',
      hint: 'Two measures on the same scale versus two measures on different scales.',
      concepts: [
        { label: 'Dual axis overlays two marks cards with independent axes', any: ['dual axis', 'two axes', 'independent', 'overlay', 'separate axis'], required: true },
        { label: 'Each dual axis measure gets its own mark type and formatting', any: ['mark type', 'bar and line', 'formatting', 'own mark', 'different chart'], required: true },
        { label: 'Combined axis puts measures on one shared axis via Measure Values', any: ['combined axis', 'blended axis', 'measure values', 'shared axis', 'same axis'], required: true },
        { label: 'Synchronise the axes when the measures share units, or the chart misleads', any: ['synchron', 'same scale', 'mislead', 'comparable', 'same unit'], required: true },
        { label: 'Unsynchronised axes can be legitimate for different units such as sales and rate', any: ['different unit', 'percentage', 'rate', 'cannot synchron', 'not comparable'] }
      ],
      approach: `<p>Decide by asking whether the two measures share a unit.</p>
      <ol>
        <li><strong>Combined axis</strong> (dragging one measure onto the other's axis, using Measure Values) puts both on a single shared scale. Correct when they are the same unit, for example sales this year versus last year.</li>
        <li><strong>Dual axis</strong> creates two independent axes and two marks cards, so each measure can have its own mark type and formatting. This is how you build the bar-and-line combo chart.</li>
        <li><strong>Synchronising</strong> forces both axes onto the same scale. If the measures share units and you do not synchronise, the chart is actively misleading: a smaller number can appear taller than a larger one.</li>
        <li>Say when unsynchronised is fine: genuinely different units, such as revenue in currency against conversion rate in percent, where a shared scale would be meaningless. Then label both axes clearly.</li>
      </ol>`,
      answer: `<p>Use a <strong>combined axis</strong> when the measures share a unit and belong on one scale, such as this year versus last year sales. Use a <strong>dual axis</strong> when you need two independent axes and two marks cards, which is what lets you draw revenue as bars and margin percentage as a line on the same chart.</p>
      <p><strong>Synchronise the axes</strong> whenever the two measures are the same unit. Without it the two scales are set independently and a smaller value can be drawn taller than a larger one, which misleads every reader. Leaving them unsynchronised is legitimate only when the units genuinely differ, for example currency against a percentage, and then both axes need clear labels.</p>`
    },
    {
      id: 'tb-m5',
      difficulty: 'medium',
      prompt: 'What are <strong>dashboard actions</strong>, and how would you use them to make a dashboard explorable rather than just a wall of charts?',
      hint: 'Filter, highlight, parameter, set and URL actions, each triggered by hover, select or menu.',
      concepts: [
        { label: 'Filter actions pass a selection from one sheet as a filter to others', any: ['filter action', 'pass', 'selection', 'drives', 'filters other'], required: true },
        { label: 'Highlight actions emphasise related marks without removing data', any: ['highlight', 'emphasis', 'without removing', 'keeps context', 'dim'], required: true },
        { label: 'Parameter and set actions let a click change a calculation or membership', any: ['parameter action', 'set action', 'change a calculation', 'membership', 'click'], required: true },
        { label: 'Actions are triggered on hover, select or menu', any: ['hover', 'select', 'menu', 'trigger', 'on click'] },
        { label: 'Design for overview first, then detail on demand', any: ['overview', 'detail on demand', 'drill', 'summary first', 'progressive'] }
      ],
      approach: `<p>Give the mechanics briefly, then spend most of the answer on <strong>design intent</strong>, which is what separates a strong candidate.</p>
      <ol>
        <li><strong>Filter action:</strong> a selection in one sheet becomes a filter on others, which is the standard master-detail pattern.</li>
        <li><strong>Highlight action:</strong> emphasises related marks while keeping everything visible, so the user keeps context instead of losing the comparison.</li>
        <li><strong>Parameter and set actions:</strong> a click writes a value into a parameter or changes set membership, which lets a click reshape a calculation, swap a measure, or drive a "compare selection against the rest" view.</li>
        <li><strong>URL action:</strong> jumps to an external system with the selected value.</li>
        <li>Tie it to structure: build overview first and detail on demand, so the landing view answers "is anything wrong" and the actions let someone drill into "where and why" without a separate report.</li>
      </ol>`,
      answer: `<p><strong>Filter actions</strong> pass a selection from one sheet as a filter to others. <strong>Highlight actions</strong> emphasise related marks without removing anything, so context survives. <strong>Parameter actions</strong> and <strong>set actions</strong> write a clicked value into a parameter or change set membership, which means a click can change a calculation, swap a measure, or compare the selection against everything else. <strong>URL actions</strong> hand off to another system. Each can trigger on hover, select or menu.</p>
      <p>The design principle is overview first, then detail on demand: the landing view should answer whether anything needs attention, and actions should carry the user into where and why. Prefer select over hover for anything that changes several sheets, since hover-driven dashboards feel unstable, and always give the user a clear way back to the unfiltered state.</p>`
    },

    /* ---------------------------- HARD ---------------------------- */
    {
      id: 'tb-h1',
      difficulty: 'hard',
      prompt: 'Explain <strong>LOD expressions</strong> (<code>FIXED</code>, <code>INCLUDE</code>, <code>EXCLUDE</code>). Give a real analytics case for <code>FIXED</code>, and say whether dimension filters affect it.',
      hint: 'A FIXED LOD is computed before dimension filters but after context filters.',
      concepts: [
        { label: 'LOD expressions compute an aggregate at a granularity different from the view', any: ['level of detail', 'granularity', 'different level', 'lod'], required: true },
        { label: 'FIXED uses only the named dimensions and ignores the view', any: ['fixed', 'ignores the view', 'only the dimension', 'named dimension'], required: true },
        { label: 'INCLUDE adds dimensions to the view level, EXCLUDE removes them', any: ['include', 'exclude', 'adds', 'removes'], required: true },
        { label: 'Real case: customer acquisition date or total spend per customer', any: ['cohort', 'first purchase', 'acquisition', 'per customer', 'customer id', 'min order date'], required: true },
        { label: 'Dimension filters do not affect FIXED; promote them to context filters', any: ['context filter', 'dimension filter', 'does not affect', 'ignores filter', 'before'], required: true },
        { label: 'FIXED enables two-stage aggregation, such as counting customers per spend tier', any: ['two stage', 'aggregate of an aggregate', 'tier', 'bucket', 'count of customers', 'average of'] }
      ],
      approach: `<p>Define the three keywords quickly, then spend the time on a real case and the filter interaction, which is what the interviewer is actually probing.</p>
      <ol>
        <li><strong>Definition:</strong> a level of detail expression computes an aggregate at a granularity independent of the view. <code>FIXED</code> uses only the dimensions you name and ignores what is on the shelves. <code>INCLUDE</code> adds dimensions to the view's level. <code>EXCLUDE</code> removes them.</li>
        <li><strong>Case:</strong> cohort analysis. <code>{FIXED [Customer ID] : MIN([Order Date])}</code> pins each customer's first purchase date no matter how the view is sliced, so you can plot revenue by acquisition cohort. Similarly <code>{FIXED [Customer ID] : SUM([Sales])}</code> gives lifetime spend, which you can then bucket into tiers and count customers per tier — a two-stage aggregation that a plain <code>SUM</code> cannot express.</li>
        <li><strong>Filters:</strong> dimension filters do <em>not</em> affect a <code>FIXED</code> LOD, because it is computed earlier in the order of operations. If a filter must shrink it, promote the filter to a <strong>context filter</strong>. <code>INCLUDE</code> and <code>EXCLUDE</code> are computed after dimension filters, so they do respond.</li>
      </ol>`,
      answer: `<p><strong>LOD expressions</strong> compute an aggregate at a granularity different from the view. <code>FIXED</code> uses only the dimensions named and ignores the view; <code>INCLUDE</code> adds dimensions to the view's level; <code>EXCLUDE</code> removes them.</p>
      <pre>// Each customer's acquisition date, regardless of how the view is sliced
{ FIXED [Customer ID] : MIN([Order Date]) }

// Lifetime spend per customer, then bucketed into tiers
{ FIXED [Customer ID] : SUM([Sales]) }

// Average order value per customer, added to whatever the view shows
{ INCLUDE [Order ID] : SUM([Sales]) }</pre>
      <p>The cohort case is the standard one: pin the first purchase date per customer with <code>FIXED</code>, then plot retention or revenue by that cohort month even while the view is sliced by product or region.</p>
      <p>On filters: a dimension filter does <strong>not</strong> affect a <code>FIXED</code> LOD, because <code>FIXED</code> is evaluated before dimension filters in the order of operations. To make a filter apply, promote it to a <strong>context filter</strong>. <code>INCLUDE</code> and <code>EXCLUDE</code> run after dimension filters and therefore do respond to them normally.</p>`
    },
    {
      id: 'tb-h2',
      difficulty: 'hard',
      prompt: 'Walk through Tableau\'s <strong>order of operations</strong>, and use it to explain two bugs analysts hit repeatedly.',
      hint: 'Extract, data source, context, FIXED, dimension, INCLUDE/EXCLUDE, measure, table calc.',
      concepts: [
        { label: 'Extract and data source filters run first', any: ['extract', 'data source filter', 'first'], required: true },
        { label: 'Context filters run before FIXED LODs', any: ['context', 'before fixed', 'context filter'], required: true },
        { label: 'Dimension filters run after FIXED but before INCLUDE and EXCLUDE', any: ['dimension filter', 'after fixed', 'include', 'exclude'], required: true },
        { label: 'Measure filters run after aggregation, table calcs run last', any: ['measure filter', 'after aggregation', 'table calc', 'last'], required: true },
        { label: 'Bug one: a FIXED LOD appears to ignore a filter', any: ['ignores', 'fixed', 'not affected', 'still shows', 'unchanged'], required: true },
        { label: 'Bug two: a table calculation changes when rows are filtered out', any: ['table calc', 'changes', 'running total', 'percent of total', 'filtered out', 'recomput'] }
      ],
      approach: `<p>Recite the pipeline, then immediately cash it out as two concrete bugs — the interviewer wants applied understanding, not a memorised list.</p>
      <ol>
        <li><strong>The order:</strong> extract filters, data source filters, context filters, <code>FIXED</code> LODs, dimension filters, <code>INCLUDE</code>/<code>EXCLUDE</code> LODs, measure filters, table calculations, table calc filters, then trend lines and forecasts.</li>
        <li><strong>Bug one:</strong> "my <code>FIXED</code> total ignores the region filter." Correct behaviour: <code>FIXED</code> is computed before dimension filters. Fix by promoting the filter to context, or by restructuring so the dimension is inside the LOD.</li>
        <li><strong>Bug two:</strong> "my percent of total changed when I filtered out a category." Also correct behaviour: table calculations operate on what remains in the view, so removing rows changes the denominator. Fix by filtering with a table calc filter, which hides marks without recomputing, or by anchoring the total with a <code>FIXED</code> LOD.</li>
      </ol>
      <p>The general lesson to state: in Tableau, "the filter is not working" almost always means the filter is working exactly as designed, at a different stage than you assumed.</p>`,
      answer: `<p><strong>Order:</strong> extract filters &rarr; data source filters &rarr; context filters &rarr; <code>FIXED</code> LODs &rarr; dimension filters &rarr; <code>INCLUDE</code>/<code>EXCLUDE</code> LODs &rarr; measure filters (after aggregation) &rarr; table calculations &rarr; table calc filters &rarr; trend lines and forecasts.</p>
      <p><strong>Bug one — the FIXED LOD that ignores a filter.</strong> A quick filter on region does not change <code>{FIXED [Customer ID] : SUM([Sales])}</code>, because dimension filters run after <code>FIXED</code>. The fix is to add the filter to context, which moves it earlier in the pipeline.</p>
      <p><strong>Bug two — the table calculation that changes when you filter.</strong> Percent of total and running total operate on the rows still present in the view, so excluding a category silently changes the denominator. The fix is a table calculation filter, which hides marks without recomputing, or anchoring the denominator with a <code>FIXED</code> LOD so it no longer depends on the view.</p>
      <p>The general rule: when a filter "does not work", it is usually working correctly at a different stage than you assumed.</p>`
    },
    {
      id: 'tb-h3',
      difficulty: 'hard',
      prompt: 'A dashboard takes 40 seconds to load. How do you diagnose it, and what are the levers to fix it?',
      hint: 'Separate a slow data source from a slow workbook before changing anything.',
      concepts: [
        { label: 'Use Performance Recorder to see where the time actually goes', any: ['performance recorder', 'measure first', 'profile', 'diagnos', 'workbook performance'], required: true },
        { label: 'Separate slow queries from slow rendering and layout', any: ['query', 'rendering', 'layout', 'compute', 'where the time'], required: true },
        { label: 'Switch to an extract and aggregate it to the needed grain', any: ['extract', 'aggregate', 'hyper', 'rollup', 'pre aggregat'], required: true },
        { label: 'Reduce the number of marks and the number of sheets per dashboard', any: ['marks', 'number of sheets', 'fewer', 'too many', 'reduce'], required: true },
        { label: 'Cut quick filters, especially high-cardinality relevant-values filters', any: ['quick filter', 'relevant values', 'cardinality', 'each filter', 'own query'], required: true },
        { label: 'Push heavy calculations upstream and avoid nested calcs and custom SQL', any: ['upstream', 'warehouse', 'materialis', 'nested', 'custom sql', 'database'] },
        { label: 'Hide unused fields and limit the data to what the dashboard needs', any: ['unused fields', 'hide', 'limit the data', 'remove columns', 'fewer columns'] }
      ],
      approach: `<p>Insist on measuring before changing anything, then work down a ranked list of levers.</p>
      <ol>
        <li><strong>Measure:</strong> run Performance Recorder and read where the seconds go — executing query, geocoding, computing layout, or rendering. A slow query and a slow render need completely different fixes.</li>
        <li><strong>If it is the data:</strong> move from live to an extract, and aggregate the extract to the grain the dashboard actually shows. Filter the extract to the needed date range, hide unused fields, and push complex calculations upstream into the warehouse so Tableau reads a prepared column.</li>
        <li><strong>If it is the workbook:</strong> reduce marks, since tens of thousands of marks is a rendering cost no data tuning will solve. Cut the number of sheets on the dashboard, avoid high-cardinality quick filters set to "only relevant values" because each one fires its own query, and prefer context or parameter-driven filters.</li>
        <li><strong>Calculations:</strong> deeply nested calculated fields, string comparisons and row-level LODs across large tables are expensive. Materialise them in the extract or upstream.</li>
        <li><strong>Verify:</strong> re-record after each change so you know which lever paid off, and set a target such as under five seconds.</li>
      </ol>`,
      answer: `<p>Start with <strong>Performance Recorder</strong> and find whether the time is query execution, computing layout, or rendering. Everything after that depends on the answer.</p>
      <p><strong>Data-side levers:</strong> switch live to an extract; aggregate the extract to the grain the dashboard displays; filter it to the required date range; hide unused fields; and push complex or nested calculations upstream into the warehouse so they are read rather than computed.</p>
      <p><strong>Workbook-side levers:</strong> reduce the number of marks, because tens of thousands of marks is a rendering problem; put fewer sheets on one dashboard; remove high-cardinality quick filters, especially those set to "only relevant values", since each fires its own query; replace them with context filters or parameter-driven filters; and avoid custom SQL that the engine cannot optimise.</p>
      <p>Re-record after each change so you can attribute the improvement, and keep a target in mind, typically under five seconds for an executive dashboard.</p>`
    },
    {
      id: 'tb-h4',
      difficulty: 'hard',
      prompt: 'You publish one sales dashboard for 200 regional managers, and each must see only their own region. How do you implement and test this?',
      hint: 'An entitlement table joined to the data, filtered by the logged-in user.',
      concepts: [
        { label: 'Row-level security driven by the logged-in user', any: ['row level security', 'rls', 'user filter', 'logged in', 'per user'], required: true },
        { label: 'Use an entitlement or user-to-region mapping table joined to the data', any: ['entitlement', 'mapping table', 'lookup table', 'user table', 'permission table'], required: true },
        { label: 'Filter with USERNAME(), USERPRINCIPALNAME or ISMEMBEROF rather than hard-coded lists', any: ['username', 'userprincipalname', 'ismemberof', 'fullname', 'function'], required: true },
        { label: 'Apply it as a data source filter so it cannot be removed on a sheet', any: ['data source filter', 'cannot be removed', 'every sheet', 'enforced'], required: true },
        { label: 'Publish with the data source and prevent web edit or download from bypassing it', any: ['permission', 'download', 'web edit', 'published data source', 'bypass'] },
        { label: 'Test by impersonating users, and confirm totals change per user', any: ['test', 'impersonat', 'view as', 'verify', 'check'] }
      ],
      approach: `<p>Answer in the order you would actually build it, and make clear that hard-coded filters do not scale to 200 people.</p>
      <ol>
        <li><strong>Model:</strong> create an entitlement table mapping each username to the regions they may see, and join or relate it to the sales data on region.</li>
        <li><strong>Filter:</strong> build a calculated field comparing the entitlement row to the logged-in user, using <code>USERNAME()</code>, <code>USERPRINCIPALNAME()</code> or <code>ISMEMBEROF()</code> for group-based rules, and set it to True.</li>
        <li><strong>Enforce:</strong> apply that as a <strong>data source filter</strong> on a published data source, not a worksheet filter, so no sheet or web edit can drop it. Set permissions so users cannot download the data or edit the workbook in ways that bypass the rule.</li>
        <li><strong>Test:</strong> use the impersonation feature to view as several specific users, including someone with two regions and someone with none, and confirm both the marks and the totals change.</li>
        <li><strong>Maintain:</strong> the entitlement table is data, so it can be refreshed from HR or an access system rather than edited by hand, and access reviews become a table query instead of a workbook audit.</li>
      </ol>`,
      answer: `<p>Use <strong>row-level security driven by an entitlement table</strong> rather than 200 hard-coded filters or 200 copies of the workbook.</p>
      <pre>-- entitlements(username, region), related to sales on region

// Calculated field, set to True as a data source filter
USERNAME() = [Username]
// or, for group-based access
ISMEMBEROF("Region - " + [Region])</pre>
      <p>Apply the filter on a <strong>published data source</strong> as a data source filter so every worksheet inherits it and it cannot be removed on a sheet. Then set permissions so users cannot download the underlying data or web-edit around it, since a security rule that only exists in one workbook is not a security rule.</p>
      <p>Test by impersonating specific users, including one with multiple regions and one with none, and verify the totals change and not just the visible rows. Because entitlements live in a table, access can be refreshed from an HR or IAM system and reviewed with a query.</p>`
    },
    {
      id: 'tb-h5',
      difficulty: 'hard',
      prompt: 'Your percent-of-total and running-total numbers change whenever a user filters the dashboard, and stakeholders say the report is wrong. Diagnose it and give the fix.',
      hint: 'Table calculations see only what is in the view.',
      concepts: [
        { label: 'Table calculations operate only on the rows present in the view', any: ['only', 'in the view', 'what remains', 'visible', 'after filtering'], required: true },
        { label: 'Filtering rows out changes the denominator or the accumulation', any: ['denominator', 'total changes', 'recomput', 'accumulation', 'changes'], required: true },
        { label: 'Check addressing and partitioning in Compute Using', any: ['compute using', 'addressing', 'partition', 'direction'], required: true },
        { label: 'Fix with a table calc filter, which hides marks without recomputing', any: ['table calc filter', 'hide', 'without recomput', 'lookup', 'does not remove'], required: true },
        { label: 'Or anchor the denominator with a FIXED LOD so it ignores the filter', any: ['fixed', 'level of detail', 'anchor', 'lod', 'independent of the view'], required: true },
        { label: 'Agree with stakeholders whether the total should be of everything or of the selection', any: ['agree', 'stakeholder', 'define', 'intended', 'of the selection', 'requirement'] }
      ],
      approach: `<p>First establish that this is usually correct behaviour being read as a bug, then decide which behaviour the business actually wants.</p>
      <ol>
        <li><strong>Diagnose:</strong> table calculations are computed on the aggregated result already in the view. Filter a category out and it is gone from the denominator, so every percentage shifts. A running total restarts its accumulation over the surviving rows for the same reason.</li>
        <li><strong>Check the direction:</strong> confirm Compute Using is set deliberately. Wrong addressing and partitioning produce numbers that look plausible but accumulate across the wrong dimension, which is a real bug rather than a filtering artefact.</li>
        <li><strong>Decide the requirement:</strong> should percent of total mean "share of everything" or "share of what I selected"? These are different reports and only the stakeholder can choose.</li>
        <li><strong>Fix for share of everything:</strong> anchor the denominator with a <code>FIXED</code> LOD, which is computed before dimension filters, or filter using a table calculation filter, which hides marks without removing them from the calculation.</li>
        <li><strong>Fix for share of selection:</strong> keep the current behaviour and label the chart explicitly, for example "% of selected categories", so nobody reads it as a global share.</li>
      </ol>`,
      answer: `<p>This is almost always correct behaviour, misread. <strong>Table calculations run on the rows present in the view</strong>, so a dimension filter removes rows from the denominator and every percentage moves. Running totals shift for the same reason.</p>
      <p>Two things to check first: that <strong>Compute Using</strong> (addressing and partitioning) is set deliberately rather than left on Table Across, and what stakeholders actually want the total to mean — share of everything, or share of the current selection.</p>
      <pre>// Share of the current view (default table calc behaviour)
SUM([Sales]) / TOTAL(SUM([Sales]))

// Share of everything, unaffected by dimension filters
SUM([Sales]) / SUM({ FIXED : SUM([Sales]) })</pre>
      <p>For "share of everything", anchor the denominator with a <code>FIXED</code> LOD, which is computed before dimension filters, or filter with a <strong>table calculation filter</strong> so marks are hidden without being removed from the calculation. For "share of selection", keep the behaviour and label the chart explicitly so it cannot be misread.</p>`
    }
  ]
});
