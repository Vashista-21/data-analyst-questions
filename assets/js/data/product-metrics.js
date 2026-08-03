DAQ.registerTopic({
  id: 'product-metrics',
  name: 'Product Metrics & Cases',
  icon: '\uD83D\uDCCA',
  blurb: 'Metric definition, funnels, retention, diagnosing sudden drops and structured product case answers.',
  questions: [
    /* ---------------------------- EASY ---------------------------- */
    {
      id: 'pm-e1',
      difficulty: 'easy',
      prompt: 'Define DAU, MAU and the DAU/MAU ratio. What does a DAU/MAU of 0.15 tell you about a product?',
      hint: 'The ratio approximates how many days a month the average user shows up.',
      concepts: [
        { label: 'DAU = unique users active in a day, MAU = unique users active in 30 days', any: ['unique', 'daily active', 'monthly active', 'distinct'], required: true },
        { label: 'DAU/MAU measures stickiness or engagement frequency', any: ['sticki', 'engagement', 'frequency', 'how often'], required: true },
        { label: '0.15 means the average monthly user is active about 4-5 days a month', any: ['4', '5', 'days a month', '4.5', 'few days'], required: true },
        { label: 'Interpretation depends on the product category / expected frequency', any: ['depends', 'category', 'type of product', 'benchmark', 'compare', 'context'], required: true },
        { label: 'Activity must be defined by a meaningful action, not an app open', any: ['define active', 'meaningful', 'action', 'what counts', 'app open', 'definition'] }
      ],
      approach: `<p>Define precisely, convert the ratio into something human, then refuse to judge it without context.</p>
      <ol>
        <li><strong>DAU</strong> is unique users performing a qualifying action in one day; <strong>MAU</strong> is unique users doing so in a 28 or 30 day window. Both depend entirely on how "active" is defined, so state that definition first.</li>
        <li><strong>DAU/MAU</strong> is stickiness. Multiply by 30 for an intuitive reading: 0.15 means the average monthly user is active roughly 4&ndash;5 days a month.</li>
        <li><strong>Judgement needs a benchmark:</strong> for a messaging app or social feed, 0.15 is poor because the expected use case is daily. For a food-delivery app, an OTA or a tax product, 0.15 may be entirely healthy since natural frequency is low.</li>
        <li><strong>Caveats worth adding:</strong> the ratio is an average and hides a bimodal population of power users and near-dormant users, so look at the distribution of active days rather than the mean. It also moves for the wrong reasons: a marketing burst inflates MAU and mechanically depresses the ratio.</li>
      </ol>`,
      answer: `<p><strong>DAU</strong> = unique users taking a qualifying action in a day. <strong>MAU</strong> = unique users doing so over a 28&ndash;30 day window. <strong>DAU/MAU</strong> is stickiness: the share of monthly users present on an average day.</p>
      <p>0.15 implies the average monthly user is active about 4&ndash;5 days a month. Whether that is good depends entirely on the product's natural frequency: it would be weak for a messaging or social product built on daily use, and perfectly healthy for food delivery, travel or a finance app used a few times a month.</p>
      <p>Two caveats: the ratio averages over a bimodal population, so examine the distribution of active days per user; and it falls mechanically when a marketing campaign inflates MAU, which is not a genuine engagement decline.</p>`
    },
    {
      id: 'pm-e2',
      difficulty: 'easy',
      prompt: 'How would you define retention for a food delivery app, and why is the definition itself a decision?',
      hint: 'N-day, unbounded and rolling retention answer different questions.',
      concepts: [
        { label: 'Retention = share of a cohort still active after a period', any: ['cohort', 'still active', 'come back', 'return', 'share of users'], required: true },
        { label: 'Anchor on a cohort with a start event such as first order', any: ['cohort', 'first order', 'signup', 'anchor', 'start'], required: true },
        { label: 'N-day retention: active exactly on day N', any: ['n day', 'day 7', 'day 30', 'exactly', 'on that day'], required: true },
        { label: 'Unbounded or bracket retention: active on or after day N', any: ['unbounded', 'on or after', 'rolling', 'bracket', 'window', 'any time'], required: true },
        { label: 'Match the window to the product\'s natural purchase frequency', any: ['frequency', 'natural', 'weekly', 'monthly', 'cadence', 'how often'], required: true },
        { label: 'Define the qualifying action: order placed, not app opened', any: ['order', 'action', 'meaningful', 'app open', 'define active', 'transaction'], required: true }
      ],
      approach: `<p>Show that you know several definitions exist and pick one deliberately based on frequency.</p>
      <ol>
        <li><strong>Anchor the cohort:</strong> group users by the week or month of their first order, since first order is the meaningful start of the relationship rather than install or signup.</li>
        <li><strong>Choose the qualifying action:</strong> for food delivery it should be a completed order. App opens overstate retention badly because people browse without ordering.</li>
        <li><strong>Choose the shape of the definition:</strong>
          <ul>
            <li><em>N-day</em>: active exactly on day N. Too strict for a product used weekly, and it produces noisy sawtooth charts.</li>
            <li><em>Unbounded</em>: active on or after day N. Good for measuring long-run survival.</li>
            <li><em>Bracket/rolling</em>: active within week 4, month 2 and so on. Usually the right choice for food delivery because it matches natural cadence.</li>
          </ul>
        </li>
        <li><strong>Recommendation:</strong> weekly-bracket retention on completed orders, reported by monthly acquisition cohort, with month-1 and month-3 as headline numbers.</li>
        <li><strong>Why the definition is a decision:</strong> the same data yields wildly different retention curves under different definitions, so it drives target setting and investment. Fix it once, document it, and never compare numbers across definitions.</li>
      </ol>`,
      answer: `<p>Retention is the share of an acquisition cohort still performing the qualifying action after a given period. For food delivery I would define it as: cohort = users by month of <strong>first completed order</strong>; qualifying action = <strong>a completed order</strong> (not an app open); shape = <strong>bracket retention</strong> (ordered at least once within month 1, month 2, and so on).</p>
      <p>The choice matters because N-day retention (active exactly on day N) is too strict for a product used weekly and produces noisy curves, while unbounded retention (active on or after day N) flatters the numbers by counting a single late order. Bracket windows aligned to natural purchase frequency give the most actionable read.</p>
      <p>Since the same underlying data can produce very different curves under each definition, the definition itself sets targets and investment decisions. It should be fixed once, documented, and never mixed across reports.</p>`
    },
    {
      id: 'pm-e3',
      difficulty: 'easy',
      prompt: 'A signup funnel is: landing page &rarr; form start &rarr; OTP verified &rarr; profile complete. Overall conversion is 12%. How do you find where to focus?',
      hint: 'Step conversion plus the size of the population at each step.',
      concepts: [
        { label: 'Compute step-to-step conversion, not just end-to-end', any: ['step', 'each stage', 'stage wise', 'between step', 'step conversion'], required: true },
        { label: 'Find the biggest absolute drop-off in users, not just the worst rate', any: ['biggest drop', 'absolute', 'largest', 'volume', 'number of users', 'where most'], required: true },
        { label: 'Weigh opportunity by traffic volume at that step', any: ['volume', 'traffic', 'opportunity', 'size', 'impact', 'how many users'], required: true },
        { label: 'Segment by device, channel, geography and new versus returning', any: ['segment', 'device', 'channel', 'geograph', 'browser', 'os', 'source'], required: true },
        { label: 'Distinguish tracking issues from real drop-off', any: ['tracking', 'instrument', 'logging', 'event missing', 'data issue', 'measurement'], required: true },
        { label: 'Benchmark each step against internal history or known standards', any: ['benchmark', 'historic', 'baseline', 'compare', 'previous', 'trend'] }
      ],
      approach: `<p>Move from "where is the worst rate" to "where is the biggest recoverable loss", which are different questions.</p>
      <ol>
        <li><strong>Build the step table:</strong> distinct users at each step, step-to-step conversion and cumulative conversion. The 12% is a product of four rates and tells you nothing on its own.</li>
        <li><strong>Rank by absolute loss:</strong> a step that converts 60% on 100,000 users loses 40,000 people; a step that converts 30% on 5,000 users loses 3,500. The worse <em>rate</em> is the second, but the bigger <em>prize</em> is the first.</li>
        <li><strong>Estimate the ceiling:</strong> for each step, model the overall conversion gain from a realistic improvement, so prioritisation is by expected impact rather than by which number looks ugliest.</li>
        <li><strong>Segment the worst step:</strong> device, OS, browser, acquisition channel, geography and new versus returning. Funnel problems are usually concentrated: OTP failures cluster on specific carriers, and form abandonment clusters on small screens.</li>
        <li><strong>Rule out measurement:</strong> before designing a fix, confirm the events fire reliably. A step that looks catastrophic is frequently an event that does not log on one platform, and OTP steps are especially prone to this because of app backgrounding.</li>
        <li><strong>Then form a hypothesis and test it,</strong> rather than shipping a redesign of the whole funnel at once.</li>
      </ol>`,
      answer: `<p>Break the 12% into its component step conversions and rank the steps by the <strong>absolute number of users lost</strong>, not by the worst percentage. A 60% step on high traffic destroys more value than a 30% step on low traffic.</p>
      <pre>Landing -> form start   : 40%   (60,000 of 100,000 lost)
Form start -> OTP       : 50%   (20,000 lost)
OTP -> profile complete : 60%   (8,000 lost)
Overall                 : 12%</pre>
      <p>Then estimate the overall conversion gain from a realistic improvement at each step so prioritisation is impact-weighted, and segment the worst step by device, OS, channel and geography, since funnel losses are usually concentrated (OTP failures by carrier, form abandonment on small screens).</p>
      <p>Before designing any fix, validate instrumentation: an apparently catastrophic step is often an event that fails to fire on one platform, which is especially common around OTP flows where the app is backgrounded.</p>`
    },
    {
      id: 'pm-e4',
      difficulty: 'easy',
      prompt: 'What makes a good <strong>north star metric</strong>? Propose one for a ride-hailing app and explain what you rejected.',
      hint: 'It should capture delivered customer value, move with product work, and resist gaming.',
      concepts: [
        { label: 'Reflects delivered customer value, not just company revenue', any: ['customer value', 'user value', 'value delivered', 'benefit', 'outcome'], required: true },
        { label: 'Leading rather than purely lagging, and movable by product work', any: ['lead', 'lagging', 'actionable', 'influence', 'movable', 'respond', 'product can'], required: true },
        { label: 'Hard to game and resistant to vanity inflation', any: ['game', 'vanity', 'manipul', 'inflat', 'perverse'], required: true },
        { label: 'Simple, understandable and consistently measurable', any: ['simple', 'understand', 'clear', 'measurable', 'consistent', 'one metric'], required: true },
        { label: 'Proposal such as completed rides per active rider per month', any: ['completed ride', 'rides per', 'per rider', 'per user', 'weekly ride', 'trips per'], required: true },
        { label: 'Rejects raw counts like app opens, downloads or gross bookings alone', any: ['app open', 'download', 'install', 'gross booking', 'revenue alone', 'reject', 'signup'], required: true }
      ],
      approach: `<p>State the criteria, propose one metric, then show your reasoning by naming what you rejected and why.</p>
      <ol>
        <li><strong>Criteria:</strong> it should represent value actually delivered to the customer, respond to product changes, be hard to game, be understandable across the company, and correlate with long-run revenue.</li>
        <li><strong>Proposal:</strong> <em>completed rides per active rider per month</em>. Completion means the customer got the value they wanted, and normalising per rider means the metric cannot be inflated purely by marketing spend.</li>
        <li><strong>What I rejected:</strong>
          <ul>
            <li><em>Downloads or signups</em>: pure vanity, disconnected from value and trivially bought.</li>
            <li><em>App opens or session count</em>: a broken app that forces retries increases them.</li>
            <li><em>Gross bookings</em>: grows with price rises and surge, which can coexist with a worsening customer experience.</li>
            <li><em>Ride requests</em>: ignores whether a driver was found, which is exactly the failure mode the product must fix.</li>
          </ul>
        </li>
        <li><strong>Supporting metrics:</strong> no single number is enough, so pair it with supply-side and quality guardrails such as request-to-completion rate, ETA accuracy, cancellation rate and driver earnings per online hour. In a marketplace both sides must be healthy for the north star to be trustworthy.</li>
      </ol>`,
      answer: `<p>A good north star metric captures <strong>delivered customer value</strong>, moves in response to product work, resists gaming, is simple enough for the whole company to align on, and leads revenue rather than merely restating it.</p>
      <p><strong>Proposal:</strong> completed rides per active rider per month. Completion proves value was delivered, and the per-rider normalisation prevents marketing spend from inflating it.</p>
      <p><strong>Rejected:</strong> downloads and signups (vanity, purchasable, no value signal); app opens or sessions (a broken app inflates them); gross bookings (rises with price and surge even as experience degrades); ride requests (ignores whether a driver was actually found).</p>
      <p>Because it is a two-sided marketplace, I would pair it with guardrails on request-to-completion rate, cancellations, ETA accuracy and driver earnings per online hour, since rider value cannot be sustained if supply economics break.</p>`
    },
    {
      id: 'pm-e5',
      difficulty: 'easy',
      prompt: 'Explain LTV and CAC, and how you would judge whether a subscription business has healthy unit economics.',
      hint: 'Ratio, payback period, and the assumptions hidden inside LTV.',
      concepts: [
        { label: 'CAC = total acquisition spend divided by customers acquired', any: ['cac', 'acquisition cost', 'spend divided', 'cost per customer', 'marketing spend'], required: true },
        { label: 'LTV = margin per period times expected lifetime, or ARPU times gross margin over churn', any: ['ltv', 'lifetime value', 'arpu', 'churn', 'margin', 'lifetime'], required: true },
        { label: 'Use contribution margin, not revenue, inside LTV', any: ['margin', 'gross margin', 'contribution', 'not revenue', 'cost of serv'], required: true },
        { label: 'LTV/CAC of roughly 3x is a common health benchmark', any: ['3', 'ratio', 'three', 'benchmark', '3x'], required: true },
        { label: 'CAC payback period matters for cash flow, ideally under 12 months', any: ['payback', 'months', '12', 'cash', 'recover'], required: true },
        { label: 'LTV is an assumption-heavy forecast, sensitive to the churn estimate', any: ['assumption', 'estimate', 'forecast', 'sensitive', 'churn assumption', 'uncertain'], required: true },
        { label: 'Compute per channel and per cohort, since blended figures hide bad channels', any: ['per channel', 'by channel', 'cohort', 'blended', 'segment', 'paid vs organic'] }
      ],
      approach: `<p>Define both carefully, give the two standard tests, then attack the assumptions, which is where the real insight sits.</p>
      <ol>
        <li><strong>CAC:</strong> fully loaded acquisition spend (media, promotions, sales salaries, tooling) divided by customers acquired in the same period. Excluding salaries and discounts is the most common way CAC gets understated.</li>
        <li><strong>LTV:</strong> for subscriptions, LTV &asymp; ARPU &times; gross margin &divide; monthly churn rate. It must use contribution margin, since revenue that costs 70% to serve is not worth its face value.</li>
        <li><strong>Test 1, ratio:</strong> LTV/CAC around 3&times; is the usual benchmark. Below 1&times; you lose money per customer; far above 3&times; often signals underinvestment in growth rather than excellence.</li>
        <li><strong>Test 2, payback:</strong> months to recover CAC from contribution margin. Under 12 months is generally healthy, because a great ratio with a 3-year payback still starves the business of cash.</li>
        <li><strong>Interrogate the assumptions:</strong> LTV is a forecast, and dividing by churn assumes a constant hazard rate, which overstates value because early churn is always higher. Prefer cohort-based cumulative margin curves over a single formula.</li>
        <li><strong>Disaggregate:</strong> compute both by channel and cohort. A blended 3&times; can hide paid channels running at 1&times; and being subsidised by organic, which is exactly the decision the numbers exist to inform.</li>
      </ol>`,
      answer: `<p><strong>CAC</strong> = fully loaded acquisition spend (media, promotions, sales salaries, tooling) &divide; customers acquired. <strong>LTV</strong> &asymp; ARPU &times; gross margin &divide; churn rate, using contribution margin rather than revenue.</p>
      <p>Two health checks: <strong>LTV/CAC &asymp; 3&times;</strong> (below 1&times; loses money per customer; far above 3&times; may mean underinvesting in growth), and <strong>CAC payback under about 12 months</strong>, because a strong ratio with slow payback still creates a cash crunch.</p>
      <p>The important caveat: LTV is a forecast, and the ARPU/churn formula assumes a constant churn hazard, which overstates value since early-life churn is higher. I would use cohort-level cumulative contribution curves instead, and compute both metrics <strong>per channel and per cohort</strong>, since a blended 3&times; frequently conceals paid channels running near break-even and subsidised by organic acquisition.</p>`
    },

    /* --------------------------- MEDIUM --------------------------- */
    {
      id: 'pm-m1',
      difficulty: 'medium',
      prompt: 'DAU dropped 15% overnight. Walk through how you would diagnose it in the first hour.',
      hint: 'Rule out measurement first, then segment aggressively before theorising about users.',
      concepts: [
        { label: 'First verify the data: pipeline failure, logging change, duplicate or missing events', any: ['pipeline', 'logging', 'data issue', 'etl', 'tracking', 'instrument', 'is the data', 'measurement'], required: true },
        { label: 'Check whether the metric definition or a dashboard filter changed', any: ['definition', 'filter', 'dashboard', 'query change', 'metric change', 'logic'], required: true },
        { label: 'Segment by platform, app version, geography and channel to localise it', any: ['platform', 'app version', 'geograph', 'country', 'device', 'os', 'segment', 'channel'], required: true },
        { label: 'Check internal causes: releases, deploys, experiments, config or pricing changes', any: ['release', 'deploy', 'experiment', 'config', 'rollout', 'change log', 'push', 'pricing'], required: true },
        { label: 'Check external causes: outage, holiday, competitor, seasonality, news event', any: ['outage', 'holiday', 'competitor', 'seasonal', 'external', 'weather', 'festival', 'network'], required: true },
        { label: 'Split new versus returning users to separate acquisition from engagement', any: ['new versus', 'new vs', 'returning', 'acquisition', 'existing user', 'new user'], required: true },
        { label: 'Compare against the same weekday last week rather than yesterday', any: ['last week', 'same day', 'week over week', 'yoy', 'day of week', 'baseline'], required: true },
        { label: 'Communicate early with what is known, unknown and next steps', any: ['communicat', 'stakeholder', 'update', 'inform', 'escalat', 'status'] }
      ],
      approach: `<p>Work outside-in: is the number real, is it localised, and only then why did users change behaviour. Most overnight 15% drops are measurement or release issues.</p>
      <ol>
        <li><strong>Is the drop real? (10 minutes)</strong> Check pipeline run status and freshness, event volumes at the raw layer, and whether any tracking or SDK change shipped. Confirm no dashboard filter, metric definition or query changed. A partial data load is the single most common cause.</li>
        <li><strong>Compare against the right baseline.</strong> Use the same weekday last week and the same period last year, not yesterday, so weekly seasonality and holidays are not mistaken for incidents.</li>
        <li><strong>Localise it. (20 minutes)</strong> Slice by platform, app version, OS, geography, acquisition channel and user tenure. A drop concentrated in one dimension is almost always technical: one app version pointing at a broken endpoint, one region behind a CDN failure, one channel whose campaigns were paused.</li>
        <li><strong>Check what we did.</strong> Review deploys, feature-flag changes, experiment ramps, pricing or paywall changes, push and email campaigns and their timing. Correlate the exact hour of the drop with the change log.</li>
        <li><strong>Check what happened to us.</strong> Infrastructure or third-party outages (auth providers, payment gateways), app store issues, holidays, major news or sports events, and competitor promotions.</li>
        <li><strong>Split new versus returning.</strong> A fall in new users points to acquisition, marketing or the store listing; a fall in returning users points to product, notifications or a broken login. This single cut usually decides which team owns the investigation.</li>
        <li><strong>Communicate.</strong> Within the hour, share what is confirmed, what is still unknown, the current leading hypothesis and the next check, with a time for the next update. Silence during an incident is worse than an incomplete answer.</li>
      </ol>`,
      answer: `<p><strong>Hour one, in order:</strong></p>
      <ol>
        <li><strong>Validate the data:</strong> pipeline/job status, raw event volumes, SDK or tracking releases, and any change to the metric definition or dashboard filters. Partial loads and logging changes cause most overnight cliffs.</li>
        <li><strong>Use the right baseline:</strong> same weekday last week and same period last year, not yesterday.</li>
        <li><strong>Localise by segment:</strong> platform, app version, OS, geography, channel, tenure. Concentration in one slice implies a technical root cause.</li>
        <li><strong>Check internal changes:</strong> deploys, feature flags, experiment ramps, paywall or pricing changes, campaign schedules, matched to the hour of the drop.</li>
        <li><strong>Check external causes:</strong> infrastructure or third-party outages, app store problems, holidays, major events, competitor activity.</li>
        <li><strong>Split new versus returning users</strong> to separate an acquisition problem from an engagement or access problem.</li>
      </ol>
      <p>Then communicate a short status: confirmed facts, open questions, leading hypothesis, next check and next update time. If it is real and product-caused, quantify the affected population and recommend rollback rather than waiting for a complete root cause.</p>`
    },
    {
      id: 'pm-m2',
      difficulty: 'medium',
      prompt: 'A PM wants to launch a "saved payment methods" feature. Define how you would measure success before launch.',
      hint: 'Hypothesis, primary metric, secondary metrics, guardrails, and the measurement design.',
      concepts: [
        { label: 'Start from an explicit hypothesis linking the feature to user behaviour', any: ['hypothesis', 'because', 'expect', 'if we', 'assumption'], required: true },
        { label: 'One primary metric such as checkout completion or repeat purchase rate', any: ['primary', 'checkout completion', 'conversion', 'repeat purchase', 'one metric', 'success metric'], required: true },
        { label: 'Adoption metrics: share of users who save a card and reuse it', any: ['adoption', 'save rate', 'usage', 'reuse', 'penetration', 'share of users'], required: true },
        { label: 'Efficiency metrics: time to checkout, steps, payment failure rate', any: ['time to', 'speed', 'faster', 'steps', 'failure rate', 'latency', 'friction'], required: true },
        { label: 'Guardrails: fraud, chargebacks, refunds, support tickets, trust and security complaints', any: ['fraud', 'chargeback', 'refund', 'support', 'trust', 'security', 'complaint', 'guardrail'], required: true },
        { label: 'Measure with a randomised A/B test on triggered users', any: ['a b test', 'experiment', 'random', 'control', 'trigger', 'exposed'], required: true },
        { label: 'Segment new versus repeat buyers, since value differs sharply', any: ['new versus', 'new vs', 'repeat', 'returning', 'segment', 'first time'], required: true },
        { label: 'Define the measurement window to allow repeat behaviour to appear', any: ['window', 'weeks', 'long enough', 'horizon', '30 day', 'duration'] }
      ],
      approach: `<p>Never start from a metric list. Start from the causal story, and derive metrics from it so each one has a purpose.</p>
      <ol>
        <li><strong>Hypothesis:</strong> re-entering card details is friction, especially on mobile, so saving a payment method should raise checkout completion and shorten time to purchase, with the largest effect on repeat buyers.</li>
        <li><strong>Primary metric:</strong> checkout completion rate among users who reach payment. For the durable business case, repeat purchase rate within 30 days is the better primary, since the mechanism is meant to compound on the second and third purchase.</li>
        <li><strong>Adoption funnel:</strong> percentage offered the save option, percentage who save, and percentage who reuse a saved card on a later purchase. If adoption is low, no downstream movement is possible and the feature needs a UX fix rather than more measurement.</li>
        <li><strong>Efficiency diagnostics:</strong> median time from payment page to success, number of steps, and payment failure rate. These explain <em>why</em> the primary metric moved.</li>
        <li><strong>Guardrails:</strong> fraud rate, chargebacks, disputed transactions, refunds, support contacts about payments, and any rise in security complaints or account-deletion requests. Stored payment credentials shift the risk profile, so trust metrics are not optional.</li>
        <li><strong>Design:</strong> randomised A/B test analysed on triggered users (those who actually reached checkout) to avoid dilution, run long enough for repeat purchases to occur, powered on the primary metric. Segment new versus repeat buyers and by device, since the friction removed is largest on mobile.</li>
        <li><strong>Pre-commit the decision rule:</strong> ship if the primary metric improves by at least the MDE with no guardrail breach beyond the agreed tolerance. Writing that down before launch prevents post-hoc metric shopping.</li>
      </ol>`,
      answer: `<p><strong>Hypothesis:</strong> re-entering card details is a major source of checkout friction, so saving payment methods should lift checkout completion and repeat purchase rate, most strongly for repeat buyers on mobile.</p>
      <ul>
        <li><strong>Primary:</strong> checkout completion rate among users reaching payment; repeat purchase rate within 30 days for the durable business case.</li>
        <li><strong>Adoption:</strong> share offered the option, share who save a card, share who reuse it later.</li>
        <li><strong>Diagnostics:</strong> time from payment page to success, steps to complete, payment failure rate.</li>
        <li><strong>Guardrails:</strong> fraud and chargeback rate, disputed transactions, refunds, payment-related support tickets, security complaints and account deletions.</li>
      </ul>
      <p><strong>Design:</strong> randomised A/B test analysed on triggered users to avoid dilution, powered on the primary metric, run long enough for repeat purchases to materialise, with segmentation by new versus repeat buyer and by device.</p>
      <p><strong>Decision rule, agreed before launch:</strong> ship if the primary metric clears the MDE and no guardrail degrades beyond its stated tolerance. Because stored credentials change the risk profile, a fraud or trust regression should block the launch even with a strong conversion win.</p>`
    },
    {
      id: 'pm-m3',
      difficulty: 'medium',
      prompt: 'Explain cohort analysis and why an aggregate retention number can hide the fact that a product is improving.',
      hint: 'Mix shifts across cohorts move the aggregate independently of quality.',
      concepts: [
        { label: 'Cohorts group users by a shared start period', any: ['cohort', 'group by signup', 'start period', 'acquisition month', 'joined'], required: true },
        { label: 'Aggregate metrics mix cohorts of different ages and quality', any: ['mix', 'blend', 'different age', 'aggregate hides', 'average', 'composition'], required: true },
        { label: 'A growth surge floods the base with young users and drags the average down', any: ['new user', 'influx', 'growth', 'young cohort', 'surge', 'dilut', 'acquisition', 'fills'], required: true },
        { label: 'Reading across a row shows one cohort ageing; reading down a column compares cohorts at equal maturity', any: ['row', 'column', 'across', 'down', 'same age', 'equal tenure', 'compare cohort'], required: true },
        { label: 'Cohort curves separate product improvement from acquisition mix change', any: ['product improve', 'acquisition mix', 'separate', 'isolate', 'channel mix', 'quality of users'], required: true },
        { label: 'Recent cohorts are incomplete, so avoid comparing unequal maturity', any: ['incomplete', 'partial', 'recent cohort', 'not aged', 'censor'], required: true }
      ],
      approach: `<p>Explain the structure, then give a concrete numeric scenario where aggregate and cohort views disagree. The example is what makes the answer land.</p>
      <ol>
        <li><strong>Structure:</strong> a cohort is a group sharing a start period, usually acquisition month. The retention table puts cohorts on rows and months since acquisition on columns, so each cell is "share of cohort X still active in month N".</li>
        <li><strong>Reading rules:</strong> across a row is one cohort ageing; down a column compares different cohorts at the <em>same</em> maturity. Only the column comparison tells you whether the product is getting better.</li>
        <li><strong>Why the aggregate misleads:</strong> overall retention is a weighted average across cohorts of different ages. A successful marketing push floods the base with month-0 users, who always retain worst, so the aggregate falls even if every individual cohort improved. The reverse also happens: pausing acquisition ages the base and makes the aggregate look better while the product is unchanged.</li>
        <li><strong>Worked example:</strong> Jan cohort retains 30% at month 3, Feb 32%, Mar 35%. Each cohort is better than the last. But if March acquisition was 5&times; the size of January's, the blended retention number falls, and a naive reading concludes the product is deteriorating.</li>
        <li><strong>Also isolate acquisition mix:</strong> cohort curves let you separate product improvement from a shift toward cheaper, lower-intent channels. Segment cohorts by channel, otherwise you cannot tell which effect you are looking at.</li>
        <li><strong>Caveat:</strong> recent cohorts are structurally incomplete, so never compare a cohort's month-6 retention until it exists, and be explicit about which cells are still filling.</li>
      </ol>`,
      answer: `<p><strong>Cohort analysis</strong> groups users by a shared start period (usually acquisition month) and tracks each group's behaviour by months since acquisition, so cohorts sit on rows and tenure on columns.</p>
      <p>An aggregate retention number is a weighted average across cohorts of different ages, so <strong>mix changes move it independently of product quality</strong>. If acquisition triples, the base fills with month-0 users who always retain worst, and blended retention falls even when every cohort improved:</p>
      <pre>Cohort   Size    Month-3 retention
Jan      10 K    30%
Feb      15 K    32%
Mar      50 K    35%      <- each cohort better than the last
Blended retention still falls, because March dominates the mix</pre>
      <p>Reading across a row shows one cohort ageing; reading down a column compares cohorts at equal maturity, which is the only fair test of whether the product improved. Segment cohorts by channel to separate product improvement from a shift toward lower-intent acquisition, and mark recent cohorts as incomplete so unequal maturity is never compared.</p>`
    },
    {
      id: 'pm-m4',
      difficulty: 'medium',
      prompt: 'Leadership asks for a single dashboard for a two-sided marketplace. Which metrics do you include, and how do you structure it?',
      hint: 'Both sides plus the matching quality between them, organised in a hierarchy.',
      concepts: [
        { label: 'Cover both sides: demand and supply health separately', any: ['both side', 'demand', 'supply', 'buyer', 'seller', 'rider', 'driver', 'two side'], required: true },
        { label: 'Include liquidity / matching quality between the sides', any: ['liquidity', 'match', 'fill rate', 'utilis', 'utiliz', 'unfulfilled', 'no supply', 'search to fill'], required: true },
        { label: 'Structure as a hierarchy: north star, then drivers, then diagnostics', any: ['hierarch', 'north star', 'driver', 'diagnostic', 'tier', 'layer', 'top level'], required: true },
        { label: 'Show trend against a comparable baseline, not just point values', any: ['trend', 'week over week', 'baseline', 'time series', 'compare', 'last week'], required: true },
        { label: 'Segment by geography or city, since marketplaces are local', any: ['city', 'geograph', 'local', 'market', 'region', 'segment'], required: true },
        { label: 'Include quality and trust metrics: ratings, cancellations, complaints', any: ['rating', 'cancel', 'complaint', 'quality', 'trust', 'nps', 'refund'], required: true },
        { label: 'Include unit economics such as contribution margin per transaction', any: ['unit econom', 'margin', 'take rate', 'cac', 'contribution', 'cost per'], required: true },
        { label: 'Keep it small and opinionated, with drill-downs rather than everything on one page', any: ['small', 'few metric', 'not too many', 'drill', 'focused', 'opinionated', 'limit'], required: true }
      ],
      approach: `<p>Design the dashboard as a hierarchy, not a wall of tiles. The organising insight is that marketplaces fail on <em>matching</em>, which neither side's metrics reveal alone.</p>
      <ol>
        <li><strong>Tier 1, north star:</strong> one metric of delivered value, for example completed transactions, plus GMV and contribution margin. Three numbers, with trend against the same weekday or week last period.</li>
        <li><strong>Tier 2, demand health:</strong> active buyers, new versus repeat split, sessions to purchase, buyer retention by cohort, and conversion from search to transaction.</li>
        <li><strong>Tier 3, supply health:</strong> active sellers or providers, new supply onboarded, utilisation per provider, earnings per active hour, and supply churn. Supply is usually the slower, more fragile side and deserves equal space.</li>
        <li><strong>Tier 4, liquidity and matching:</strong> the metrics that only exist between the sides, and the most important ones on the page. Fill rate, search-to-match rate, unfulfilled demand (searches with no available supply), time to match, and cancellation rate by side. A marketplace can show healthy buyer and seller counts while failing to match them, and only these metrics expose that.</li>
        <li><strong>Tier 5, quality and trust:</strong> ratings, complaint and refund rate, repeat rate after a bad experience. Marketplaces die from trust erosion long before demand collapses.</li>
        <li><strong>Cut by city:</strong> marketplaces are local, and national averages hide markets that are structurally broken. Provide a per-market view with the same hierarchy.</li>
        <li><strong>Discipline:</strong> around 10&ndash;12 metrics on the front page with clear owners and drill-downs beneath. A dashboard that shows everything gets read as though it shows nothing.</li>
      </ol>`,
      answer: `<p>Structure it as a hierarchy rather than a metric wall:</p>
      <ol>
        <li><strong>North star (3 tiles):</strong> completed transactions, GMV, contribution margin, each with trend versus a comparable prior period.</li>
        <li><strong>Demand health:</strong> active buyers, new versus repeat, search-to-transaction conversion, buyer retention by cohort.</li>
        <li><strong>Supply health:</strong> active providers, new supply added, utilisation, earnings per active hour, supply churn.</li>
        <li><strong>Liquidity and matching (the critical layer):</strong> fill rate, time to match, unfulfilled demand where no supply was available, cancellations by side.</li>
        <li><strong>Quality and trust:</strong> ratings, complaints, refunds, repeat rate after a poor experience.</li>
      </ol>
      <p>Everything segmented <strong>by city</strong>, because marketplaces are local and national averages conceal broken markets.</p>
      <p>The key design argument: a marketplace can show healthy buyer and seller counts while failing to match them, so liquidity metrics are what make the dashboard diagnostic rather than descriptive. I would cap the front page at roughly 10&ndash;12 metrics with owners and drill-downs, since an exhaustive dashboard is read as carefully as no dashboard.</p>`
    },
    {
      id: 'pm-m5',
      difficulty: 'medium',
      prompt: 'Distinguish vanity metrics from actionable metrics with examples, and explain how a metric can be actionable and still be harmful as a target.',
      hint: 'Goodhart\'s law: optimising a proxy corrupts the proxy.',
      concepts: [
        { label: 'Vanity metrics look good but do not inform decisions', any: ['vanity', 'look good', 'feel good', 'no decision', 'not actionable', 'cumulative'], required: true },
        { label: 'Examples: total signups, downloads, cumulative registered users, page views', any: ['signup', 'download', 'registered user', 'page view', 'total user', 'install'], required: true },
        { label: 'Actionable metrics are rate or cohort based and tied to a decision', any: ['rate', 'cohort', 'per user', 'conversion', 'decision', 'ratio', 'normalis', 'normaliz'], required: true },
        { label: 'Goodhart\'s law: a measure used as a target stops being a good measure', any: ['goodhart', 'target', 'gam', 'optimis', 'optimiz', 'perverse', 'stops being'], required: true },
        { label: 'Example of gaming: session count rising because the product is broken', any: ['broken', 'gam', 'perverse', 'clickbait', 'notification', 'spam', 'retry', 'confus'], required: true },
        { label: 'Mitigate with paired metrics and guardrails', any: ['pair', 'guardrail', 'counter metric', 'balance', 'both', 'quality metric'], required: true },
        { label: 'Cumulative counts always rise and so cannot signal problems', any: ['cumulative', 'always up', 'monotonic', 'never falls', 'total'], required: true }
      ],
      approach: `<p>Give the distinction, then the deeper point: actionability is necessary but not sufficient, because targets change behaviour.</p>
      <ol>
        <li><strong>Vanity metrics</strong> are usually cumulative totals that can only rise, so they never signal a problem and never imply an action: total registered users, total downloads, cumulative page views, social media followers.</li>
        <li><strong>Actionable metrics</strong> are rates, ratios or cohort-based measures that can fall, that map to a specific decision, and that respond to product work: week-1 retention by cohort, activation rate, checkout conversion, orders per active user, CAC payback by channel.</li>
        <li><strong>The subtler failure, Goodhart's law:</strong> once a measure becomes a target, people optimise the measure rather than the underlying goal. Session count is genuinely diagnostic, but if a team is paid on it, they can hit it with aggressive notifications, or it can rise because a bug forces users to retry. Time-in-app rises when navigation gets confusing.</li>
        <li><strong>Mitigation:</strong> pair every target with a counter-metric that captures the harm the optimisation would cause. Sessions paired with task success rate; notification-driven opens paired with unsubscribe and uninstall rate; conversion paired with refund rate. Prefer a small number of value-based metrics over many proxy metrics, and keep guardrails owned by someone who is not incentivised on the primary target.</li>
        <li><strong>Practical test:</strong> ask "if this number doubled and nothing else changed, would customers be better off?" If yes, it is a value metric. If it could double through spam, bugs or accounting choices, it needs a guardrail before it becomes a goal.</li>
      </ol>`,
      answer: `<p><strong>Vanity metrics</strong> are typically cumulative and monotonically rising, so they cannot signal problems or imply actions: total signups, total downloads, cumulative page views, follower counts. <strong>Actionable metrics</strong> are rates, ratios or cohort measures that can decline and are tied to a decision: week-1 retention by cohort, activation rate, checkout conversion, orders per active user, CAC payback by channel.</p>
      <p>The harder point is <strong>Goodhart's law</strong>: a good measure can become a bad target. Session count is diagnostic, but as a goal it can be hit with notification spam, or it can rise because a bug forces retries. Time-in-app increases when navigation becomes confusing. The metric is still measuring something real; it has just stopped measuring what you care about.</p>
      <p>Mitigation is to pair each target with a counter-metric capturing the likely abuse (sessions with task success rate, opens with uninstall rate, conversion with refund rate), keep guardrails owned outside the team incentivised on the target, and prefer a few value-based metrics to many proxies. Useful test: if this number doubled with nothing else changing, would customers genuinely be better off?</p>`
    },

    /* ---------------------------- HARD ---------------------------- */
    {
      id: 'pm-h1',
      difficulty: 'hard',
      prompt: 'Revenue is up 8% quarter on quarter, but the CEO is worried. Build the analysis that tells her whether this growth is healthy.',
      hint: 'Decompose the growth, then test whether its components are durable.',
      concepts: [
        { label: 'Decompose revenue into users x frequency x price/AOV', any: ['decompos', 'users x', 'frequency', 'aov', 'price', 'volume', 'break down', 'components'], required: true },
        { label: 'Separate growth from new users versus existing users', any: ['new user', 'existing user', 'new versus', 'new vs', 'cohort', 'acquisition'], required: true },
        { label: 'Distinguish price-led from volume-led growth', any: ['price', 'volume', 'price increase', 'rate', 'mix', 'discount'], required: true },
        { label: 'Check retention and cohort quality of recent cohorts', any: ['retention', 'cohort quality', 'churn', 'repeat', 'ltv'], required: true },
        { label: 'Check whether growth was bought: CAC, discounts, marketing spend, payback', any: ['cac', 'discount', 'marketing spend', 'promo', 'subsid', 'payback', 'incentive'], required: true },
        { label: 'Check contribution margin, not just top-line revenue', any: ['margin', 'contribution', 'profit', 'unit econom', 'cost'], required: true },
        { label: 'Control for seasonality and one-off events', any: ['seasonal', 'one off', 'one time', 'quarter', 'festival', 'campaign', 'comparable'], required: true },
        { label: 'Judge durability: would growth continue if spend were held flat?', any: ['durab', 'sustain', 'organic', 'flat spend', 'continue', 'repeatab'], required: true }
      ],
      approach: `<p>Growth is only meaningful once decomposed. The analysis should end with a statement about durability, not a number.</p>
      <ol>
        <li><strong>Decompose the identity:</strong> revenue = active users &times; transactions per user &times; average order value. Compute each factor's contribution to the 8%. This one step usually resolves the CEO's concern, because "8% from AOV while users fell" is a fundamentally different business than "8% from user growth".</li>
        <li><strong>Split by user vintage:</strong> how much came from new users acquired this quarter versus existing users spending more? Growth carried entirely by new users is fragile, because it must be re-bought every quarter.</li>
        <li><strong>Price versus volume:</strong> if AOV drove the growth, determine whether it came from a price increase, a mix shift toward expensive items, or reduced discounting. Price-led growth is real but has a demand-elasticity ceiling and can quietly suppress volume; check units sold and conversion for the offsetting damage.</li>
        <li><strong>Cohort quality:</strong> compare recent cohorts against older ones at matched tenure on retention and cumulative spend. If the new cohorts retain worse, this quarter's revenue is borrowing from future quarters.</li>
        <li><strong>Was it bought?</strong> Pull marketing spend, promotional and discount cost, CAC and payback by channel. Revenue up 8% with acquisition spend up 25% is a deterioration disguised as growth.</li>
        <li><strong>Margin, not revenue:</strong> recompute the trend on contribution margin. Growth in low-margin categories, or growth funded by discounts and free delivery, can raise revenue while reducing profit.</li>
        <li><strong>Comparability:</strong> normalise for seasonality, quarter length, festive timing, one-off enterprise deals and any accounting or recognition changes. Compare year on year as well as quarter on quarter.</li>
        <li><strong>Conclude on durability:</strong> answer the question "if we held spend and pricing flat next quarter, what would growth be?" Healthy growth shows rising or stable cohort quality, growth from existing users, flat or improving CAC payback and margin growth at least matching revenue growth.</li>
      </ol>`,
      answer: `<p>I would decompose before judging, then test durability.</p>
      <ol>
        <li><strong>Revenue identity:</strong> active users &times; transactions per user &times; AOV, attributing the 8% to each factor. User-led, frequency-led and price-led growth have completely different implications.</li>
        <li><strong>New versus existing users:</strong> growth concentrated in newly acquired users must be re-bought every quarter; growth from existing users indicates genuine product-market fit.</li>
        <li><strong>Price versus volume:</strong> if AOV drove it, check whether units and conversion fell, since price-led growth can mask demand contraction.</li>
        <li><strong>Cohort quality:</strong> compare recent cohorts to older ones at matched tenure on retention and cumulative spend. Worse cohorts mean the quarter borrowed from the future.</li>
        <li><strong>Cost of growth:</strong> marketing spend, discounts and promotions, CAC and payback by channel. Revenue +8% on spend +25% is a decline in disguise.</li>
        <li><strong>Margin:</strong> repeat the trend on contribution margin, since mix shifts and discounting can raise revenue while destroying profit.</li>
        <li><strong>Comparability:</strong> adjust for seasonality, festive timing, quarter length and one-off deals; check year on year too.</li>
      </ol>
      <p><strong>Verdict framing:</strong> growth is healthy if it comes substantially from existing users and improving cohorts, with stable or better CAC payback and margin growing at least as fast as revenue. It is unhealthy if it is bought with discounts, concentrated in one-off deals, or price-led while volume erodes. The deliverable answer to the CEO is what growth would be next quarter with spend and pricing held flat.</p>`
    },
    {
      id: 'pm-h2',
      difficulty: 'hard',
      prompt: 'Your recommendation model increases click-through by 12% but 30-day retention falls by 2%. How do you investigate and what do you recommend?',
      hint: 'Short-term engagement metrics and long-term value can diverge; find the mechanism.',
      concepts: [
        { label: 'Recognise a proxy metric diverging from long-term value', any: ['proxy', 'short term', 'long term', 'diverg', 'misalign', 'surrogate', 'engagement vs'], required: true },
        { label: 'Hypothesis: clickbait or low-quality recommendations drive clicks but disappoint', any: ['clickbait', 'low quality', 'disappoint', 'sensational', 'misleading', 'quality of recommendation', 'regret'], required: true },
        { label: 'Check post-click quality: dwell time, completion, bounce, satisfaction', any: ['dwell', 'completion', 'bounce', 'watch time', 'read time', 'satisfaction', 'time spent after'], required: true },
        { label: 'Check diversity and filter bubble / narrowing of recommendations', any: ['diversity', 'filter bubble', 'narrow', 'variety', 'repetit', 'same content', 'novelty'], required: true },
        { label: 'Segment the effect by user type and check heterogeneity', any: ['segment', 'heterogen', 'new user', 'heavy user', 'cohort', 'by user'], required: true },
        { label: 'Verify the retention drop is real and adequately powered', any: ['significan', 'power', 'confidence interval', 'is it real', 'noise', 'ci'], required: true },
        { label: 'Retention matters more than CTR for business value, so do not ship as is', any: ['retention matter', 'do not ship', 'not ship', 'prioritis', 'prioritiz', 'long term value', 'ltv'], required: true },
        { label: 'Fix the objective function: add quality/satisfaction signals or multi-objective training', any: ['objective', 'loss function', 'reward', 'multi objective', 'penalis', 'penaliz', 'optimis for', 'retrain', 'label'], required: true }
      ],
      approach: `<p>This is the canonical proxy-metric failure. The interviewer wants the mechanism, an assessment of relative importance, and a fix at the objective level rather than a patch.</p>
      <ol>
        <li><strong>Confirm both effects are real.</strong> Check significance and confidence intervals for the 2% retention drop. Retention is noisier and slower than CTR, so verify it is powered rather than dismissing it as noise, and verify there is no SRM.</li>
        <li><strong>Form the mechanism hypothesis:</strong> the model was trained to maximise clicks, so it learned to surface content with high click appeal and low satisfaction. Users click more, get less value, and slowly disengage. CTR is a proxy; retention is closer to real value.</li>
        <li><strong>Test it with post-click quality metrics:</strong> dwell time or completion rate per click, immediate bounce-back rate, scroll depth, explicit signals like saves, shares, ratings and "not interested" clicks. A rise in clicks with falling dwell time and rising bounces confirms clickbait.</li>
        <li><strong>Check catalogue effects:</strong> measure recommendation diversity and coverage. Aggressive click optimisation collapses onto a narrow band of popular items, so the feed becomes repetitive and stops surfacing the long tail that keeps users returning.</li>
        <li><strong>Segment:</strong> new users may benefit while heavy users are harmed, or vice versa. Also look at time dynamics, since a novelty-driven CTR bump that decays while retention damage persists is a decisive pattern.</li>
        <li><strong>Recommendation:</strong> do not ship. Retention compounds into lifetime value while CTR does not, and a 2% retention loss is very likely worth more than a 12% CTR gain. Quantify both in revenue terms to make the tradeoff explicit rather than rhetorical.</li>
        <li><strong>The real fix is the objective function:</strong> retrain against a multi-objective target that includes satisfaction signals (completion, dwell, explicit feedback, return visits), penalise negative feedback, add diversity constraints, and validate against a longer-horizon holdout. Then re-test, with retention as the primary metric and CTR demoted to a diagnostic.</li>
      </ol>`,
      answer: `<p><strong>Diagnosis:</strong> this is a proxy metric diverging from value. The model optimises clicks, so it learns to surface high-appeal, low-satisfaction content; users click more and value the product less.</p>
      <ol>
        <li><strong>Validate both results:</strong> confidence intervals and power on the retention drop (it is the noisier metric), plus an SRM check.</li>
        <li><strong>Test the mechanism</strong> with post-click quality: dwell time and completion per click, immediate bounce-backs, saves and shares, and "not interested" signals.</li>
        <li><strong>Check diversity and coverage:</strong> click optimisation tends to collapse recommendations onto popular items, making the feed repetitive.</li>
        <li><strong>Segment</strong> by user tenure and examine the effect over time; a decaying CTR gain alongside persistent retention damage is decisive.</li>
      </ol>
      <p><strong>Recommendation: do not ship.</strong> Retention compounds into LTV whereas CTR does not, so I would quantify both in revenue terms and expect the 2% retention loss to outweigh the 12% CTR gain.</p>
      <p><strong>Fix at the objective level:</strong> retrain with a multi-objective loss that includes satisfaction and return-visit signals, penalise negative feedback, add diversity constraints, and re-test with retention as the primary metric and CTR relegated to a diagnostic.</p>`
    },
    {
      id: 'pm-h3',
      difficulty: 'hard',
      prompt: 'You must set next quarter\'s target for weekly active users. Describe how you would produce a number you can defend.',
      hint: 'Build a bottom-up model of inflows and outflows rather than extrapolating a line.',
      concepts: [
        { label: 'Model WAU as a flow: new users plus resurrected minus churned', any: ['flow', 'new user', 'resurrect', 'churn', 'inflow', 'outflow', 'reactivat'], required: true },
        { label: 'Use a bottom-up model rather than extrapolating the trend line', any: ['bottom up', 'build up', 'not extrapolat', 'driver based', 'components'], required: true },
        { label: 'Base assumptions on historical retention curves by cohort', any: ['retention curve', 'cohort', 'historical', 'survival', 'decay'], required: true },
        { label: 'Account for seasonality and known calendar events', any: ['seasonal', 'holiday', 'festival', 'calendar', 'event', 'exam', 'quarter'], required: true },
        { label: 'Incorporate committed marketing spend and channel efficiency', any: ['marketing', 'spend', 'budget', 'channel', 'cac', 'campaign'], required: true },
        { label: 'Include planned product launches with explicit and conservative impact estimates', any: ['launch', 'roadmap', 'planned feature', 'product change', 'release', 'initiative'], required: true },
        { label: 'Produce a range with base, upside and downside scenarios', any: ['range', 'scenario', 'base case', 'upside', 'downside', 'best case', 'confidence'], required: true },
        { label: 'Document assumptions and back-test the model on past quarters', any: ['document', 'assumption', 'back test', 'validate', 'historical accuracy', 'track error'], required: true }
      ],
      approach: `<p>A defensible target is a model with named assumptions, not a number. Build it as a flow so every input has an owner who can be challenged.</p>
      <ol>
        <li><strong>Use the flow identity:</strong> WAU<sub>t</sub> = WAU<sub>t&minus;1</sub> + new + resurrected &minus; churned. Every forecast reduces to predicting those three flows, and expressing it this way immediately shows which lever each team controls.</li>
        <li><strong>Estimate each flow from history:</strong> new users from committed marketing spend divided by CAC per channel, plus the organic baseline; churn from historical weekly retention curves applied to each cohort by age (recent cohorts churn faster, so a single blended rate understates outflow); resurrection from observed win-back rates and any planned reactivation campaigns.</li>
        <li><strong>Layer seasonality:</strong> apply historical weekly indices for holidays, festive periods, exam seasons or weather effects rather than assuming a smooth quarter.</li>
        <li><strong>Add the roadmap explicitly and conservatively:</strong> for each planned launch, state the expected impact, the reach and the confidence, ideally anchored on measured effects from comparable past launches. Apply a haircut for slippage, since roadmaps ship late.</li>
        <li><strong>Produce scenarios, not a point:</strong> base, upside and downside, with the driver assumptions that separate them (channel efficiency, launch timing, churn drift). This converts the conversation from "is the number right" to "which assumptions do we believe".</li>
        <li><strong>Back-test:</strong> run the model on the previous two or three quarters and report its historical error. A model with a known &plusmn;5% error band is defensible; an unvalidated one is an opinion.</li>
        <li><strong>Close the loop:</strong> commit to the base case, track actual versus forecast weekly by flow, and attribute variance to specific inputs so the model improves rather than being rebuilt from scratch each quarter.</li>
      </ol>`,
      answer: `<p>I would build a driver-based flow model rather than extrapolate the trend:</p>
      <pre>WAU(t) = WAU(t-1) + new + resurrected - churned

new         = committed spend / CAC per channel + organic baseline
churned     = cohort-level weekly retention curves applied by cohort age
resurrected = historical win-back rate + planned reactivation campaigns
x seasonality index (festivals, holidays, exam periods)
+ roadmap impact, per launch, with reach x effect x confidence, haircut for slippage</pre>
      <p>Then produce <strong>base, upside and downside scenarios</strong> whose differences are traceable to named assumptions (channel efficiency, launch timing, churn drift), so the discussion becomes about assumptions rather than about the number.</p>
      <p>Two things make it defensible: <strong>back-testing</strong> the model on the last two or three quarters and reporting its historical error band, and applying cohort-age-specific churn instead of one blended rate, since recent cohorts churn faster and a blended rate systematically understates outflow. I would commit to the base case, then track actual versus forecast weekly by flow and attribute variance to specific inputs.</p>`
    },
    {
      id: 'pm-h4',
      difficulty: 'hard',
      prompt: 'A super-app has payments, food delivery, travel and investments. Design the metric framework leadership should run the business on.',
      hint: 'One company-level metric, per-business metrics, and the cross-sell metrics that justify the super-app strategy.',
      concepts: [
        { label: 'One company-level north star reflecting cross-business engagement', any: ['north star', 'company level', 'one metric', 'top level', 'overall'], required: true },
        { label: 'Per-business primary metrics because the businesses have different natural frequencies', any: ['per business', 'each business', 'frequency', 'different', 'vertical', 'line of business'], required: true },
        { label: 'Cross-sell metrics: users with 2+ products, product adoption sequence', any: ['cross sell', 'multi product', '2 product', 'two or more', 'adoption', 'attach rate', 'sequence'], required: true },
        { label: 'The super-app thesis requires proving multi-product users are more valuable and retain better', any: ['thesis', 'more valuable', 'retain better', 'ltv', 'stickier', 'justif', 'incremental'], required: true },
        { label: 'Beware selection bias when comparing multi-product to single-product users', any: ['selection', 'confound', 'causal', 'self select', 'not causal', 'bias'], required: true },
        { label: 'Unit economics and contribution margin per business, since they differ hugely', any: ['margin', 'unit econom', 'profitab', 'take rate', 'contribution', 'cost to serve'], required: true },
        { label: 'Shared platform metrics: onboarding, KYC, trust, app performance, support', any: ['kyc', 'onboarding', 'platform', 'app performance', 'trust', 'support', 'shared', 'login'], required: true },
        { label: 'Guardrails on regulatory, fraud and trust risks, especially for finance', any: ['regulat', 'complian', 'fraud', 'risk', 'trust', 'rbi', 'security'], required: true }
      ],
      approach: `<p>The framework must answer the strategic question, which is whether being a super-app creates value beyond running four separate businesses. Build it in layers around that.</p>
      <ol>
        <li><strong>Company north star:</strong> monthly transacting users, plus contribution margin per transacting user. It works across businesses of very different frequency, rewards genuine transactions over app opens, and pairs volume with value so growth cannot be bought without showing up in margin.</li>
        <li><strong>Per-business primaries,</strong> because natural frequency differs by an order of magnitude: payments &rarr; transactions per user per month and success rate; food delivery &rarr; monthly orders per user and repeat rate; travel &rarr; bookings per year and conversion, given very low frequency and high AOV; investments &rarr; monthly SIP or funded accounts and AUM retention. Judging travel by payments-like frequency would produce nonsense.</li>
        <li><strong>Cross-sell layer, the reason the super-app exists:</strong> share of users with 2+ and 3+ products, the sequence in which products are adopted (typically payments as the acquisition wedge), time to second product, and retention and LTV by product count. If multi-product users are not measurably more valuable and stickier, the strategy is not working and the framework should say so.</li>
        <li><strong>Guard against the obvious analytical trap:</strong> multi-product users being more valuable is largely selection, since engaged users adopt more products. To claim causality, use randomised cross-sell prompts or compare matched cohorts before and after second-product adoption. This distinction is what separates a credible framework from a self-congratulatory one.</li>
        <li><strong>Unit economics per business:</strong> payments is low-margin and high-frequency, investments has high LTV and low frequency, food delivery has thin per-order margins. Contribution margin and CAC payback must be reported per business, and cross-sell should be credited with the acquisition cost it saves.</li>
        <li><strong>Shared platform metrics:</strong> onboarding and KYC completion, login success, app size, crash rate, latency, support contacts per transaction. These are common failure points that damage every business at once, so they belong at company level rather than inside one vertical.</li>
        <li><strong>Guardrails:</strong> fraud and chargeback rates, regulatory and compliance breaches, mis-selling indicators in investments, complaint volumes and app store ratings. In a regulated financial super-app a compliance failure can end a business line, so these must be first-class metrics, not footnotes.</li>
      </ol>`,
      answer: `<p><strong>Layer 1, company north star:</strong> monthly transacting users plus contribution margin per transacting user. Comparable across verticals with very different frequency, and it pairs volume with value.</p>
      <p><strong>Layer 2, per-business primaries</strong> (frequencies differ by an order of magnitude): payments &rarr; transactions per user and success rate; food &rarr; monthly orders per user and repeat rate; travel &rarr; annual bookings and conversion; investments &rarr; funded accounts, monthly SIPs and AUM retention.</p>
      <p><strong>Layer 3, cross-sell, which is the super-app thesis:</strong> share of users with 2+ and 3+ products, adoption sequence, time to second product, and retention and LTV by product count. If multi-product users are not more valuable and stickier, the strategy is not delivering.</p>
      <p><strong>Critical caveat:</strong> multi-product users look better largely because engaged users adopt more products. To make a causal claim, use randomised cross-sell prompts or matched pre/post comparisons around second-product adoption.</p>
      <p><strong>Layer 4, unit economics per business,</strong> since payments is thin-margin and high-frequency while investments is high-LTV and low-frequency; credit cross-sell with the CAC it avoids.</p>
      <p><strong>Layer 5, shared platform:</strong> onboarding and KYC completion, login success, crash rate, latency, support contacts per transaction, which affect every vertical simultaneously.</p>
      <p><strong>Guardrails:</strong> fraud and chargebacks, compliance breaches, mis-selling signals, complaints and store ratings. In a regulated financial super-app these are first-class metrics because a compliance failure can shut down a business line outright.</p>`
    },
    {
      id: 'pm-h5',
      difficulty: 'hard',
      prompt: 'Support tickets are up 40% but every product metric looks stable. How do you reconcile these and decide whether there is a real problem?',
      hint: 'Normalise the ticket count, then work out whether product metrics simply cannot see the problem.',
      concepts: [
        { label: 'Normalise tickets per active user or per transaction, not the raw count', any: ['per user', 'per transaction', 'normalis', 'normaliz', 'rate', 'per order', 'not raw'], required: true },
        { label: 'Check whether ticket volume grew because usage grew', any: ['usage grew', 'more user', 'growth', 'denominator', 'volume of user'], required: true },
        { label: 'Check for changes in support channels, categorisation or routing', any: ['channel', 'categoris', 'categoriz', 'routing', 'tagging', 'new chat', 'easier to contact', 'ivr', 'taxonomy'], required: true },
        { label: 'Categorise tickets to find which issue type is driving the increase', any: ['categor', 'topic', 'reason', 'driver', 'cluster', 'text', 'theme'], required: true },
        { label: 'Product metrics may be too aggregate or lagging to detect it', any: ['aggregate', 'lagging', 'average hides', 'too coarse', 'small segment', 'not sensitive', 'mask'], required: true },
        { label: 'Segment by platform, app version, geography and user tenure', any: ['platform', 'app version', 'geograph', 'segment', 'device', 'tenure', 'cohort'], required: true },
        { label: 'Tickets are a leading indicator; retention damage may appear later', any: ['leading indicator', 'early warning', 'later', 'lagging metric', 'before', 'predict'], required: true },
        { label: 'Quantify the cost: support cost per ticket plus churn risk of affected users', any: ['cost', 'support cost', 'churn risk', 'quantif', 'impact', 'revenue at risk'], required: true }
      ],
      approach: `<p>Treat the discrepancy itself as the finding. Either the tickets are an artefact, or the product metrics are blind, and you must determine which.</p>
      <ol>
        <li><strong>Normalise first:</strong> convert to tickets per 1,000 active users and per 1,000 transactions. If usage grew 40%, the ticket rate is flat and there is no issue. This single step resolves a large share of such alarms.</li>
        <li><strong>Check the measurement of support itself:</strong> a new in-app chat entry point, a more visible help button, changed IVR routing, a revised ticket taxonomy, or deduplication turned off will all inflate counts without any change in user experience. Compare contact rate by channel over time.</li>
        <li><strong>Categorise the increase:</strong> break tickets down by reason and find where the growth is concentrated. Cluster free-text where tags are unreliable. "Payment failed" concentrated on one app version is a completely different problem from a diffuse rise in "how do I" questions, which may simply mean a confusing new UI.</li>
        <li><strong>Explain why product metrics are silent.</strong> The usual reasons: the affected group is a small share of users, so an aggregate average absorbs it; the metric is a rate that a workaround preserves (users still complete the task, just painfully); the damage shows up in retention only weeks later; or the failure occurs outside the instrumented happy path, so no event captures it.</li>
        <li><strong>Segment product metrics along the ticket dimensions.</strong> If tickets cluster on one app version, geography or payment method, compute conversion, success rate and latency for exactly that slice. This is where the "stable" metric usually cracks and reveals the real regression.</li>
        <li><strong>Treat tickets as a leading indicator.</strong> Support contact is a costly action, so a rise means real friction even when behaviour has not yet changed. Check whether ticket-raising users show subsequently worse retention than matched non-contacting users; that converts anecdote into a quantified risk.</li>
        <li><strong>Decide with numbers:</strong> quantify support cost per ticket times incremental tickets, plus expected churn value of affected users. Recommend a fix if a specific cause is identified, better instrumentation if the failure is invisible to telemetry, and no action only if the rate is flat after normalisation and the cause is a support-side change.</li>
      </ol>`,
      answer: `<p><strong>Step 1, normalise:</strong> tickets per 1,000 active users and per 1,000 transactions. If usage grew proportionally, the contact rate is flat and there is no problem.</p>
      <p><strong>Step 2, check support-side changes:</strong> new in-app chat entry points, a more prominent help button, IVR or routing changes, taxonomy changes, or disabled deduplication all inflate volume without any user-experience change.</p>
      <p><strong>Step 3, categorise:</strong> find which reason codes are growing, clustering free text if tags are unreliable. A concentrated "payment failed" spike is a different problem from diffuse "how do I" questions.</p>
      <p><strong>Step 4, explain the silence in product metrics.</strong> Typically: the affected cohort is small and averages absorb it; users complete the task via a painful workaround so the rate metric holds; the retention damage lags by weeks; or the failure happens off the instrumented path so nothing logs it.</p>
      <p><strong>Step 5, re-cut product metrics along the ticket dimensions</strong> (app version, platform, geography, payment method). This is usually where an apparently stable metric reveals a localised regression.</p>
      <p><strong>Decision:</strong> tickets are a leading indicator, because contacting support is costly for users. I would compare retention of contacting users against matched non-contacting users to quantify risk, then size the impact as incremental support cost plus churn value at risk. Fix if a cause is identified; invest in instrumentation if the failure is invisible to telemetry; take no action only if the normalised rate is flat and the cause is a support-side change.</p>`
    }
  ]
});
