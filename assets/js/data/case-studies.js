DAQ.registerTopic({
  id: 'case-studies',
  name: 'Metric Drops & Root Cause',
  icon: '\uD83D\uDCC9',
  blurb: 'Second-round case rounds: a metric moved and nobody knows why. Data validation, segmentation, contribution analysis, mix shifts, dashboard mismatches, impact sizing and the leadership update.',
  questions: [
    /* ---------------------------- EASY ---------------------------- */
    {
      id: 'cs-e1',
      difficulty: 'easy',
      prompt: 'The orders dashboard shows daily orders down <strong>15%</strong> versus yesterday. Before you form a single business hypothesis, what do you check to confirm the drop is even real?',
      hint: 'Roughly a third of production metric anomalies are measurement failures, not behaviour changes.',
      concepts: [
        { label: 'Confirm the drop is real before hypothesising a business cause', any: ['is it real', 'is the drop real', 'real', 'confirm', 'verify', 'validat'], required: true },
        { label: 'Check the data pipeline: ETL failure, partial day, late-arriving events', any: ['pipeline', 'etl', 'logging', 'ingest', 'partial day', 'late data', 'refresh', 'freshness'], required: true },
        { label: 'Check whether the metric definition, filter or source table changed', any: ['definition', 'filter', 'source table', 'schema', 'dedup', 'query change'], required: true },
        { label: 'Compare against the correct baseline: same weekday, week over week, year over year, forecast', any: ['day of week', 'same weekday', 'week over week', 'year over year', 'forecast', 'baseline', 'seasonal'], required: true },
        { label: 'Cross-check correlated metrics to see whether only this one metric moved', any: ['sessions', 'logins', 'other metric', 'correlated', 'cross check', 'related metric', 'gmv'] },
        { label: 'Only after validation, segment the metric to localise the drop', any: ['segment', 'slice', 'breakdown', 'localis', 'localiz'] }
      ],
      approach: `<p>The single most common way candidates fail this question is jumping straight to "maybe a competitor launched". Spend the first part of your answer on measurement, because a 15% drop that turns out to be a two-hour reporting lag is not a business problem at all.</p>
      <ol>
        <li><strong>Is the day complete?</strong> Check whether the pipeline has finished loading. A partial day, a failed ETL job, a delayed Airflow DAG or late-arriving events all produce a clean-looking artificial drop on the most recent bar.</li>
        <li><strong>Did logging change?</strong> A new app release that silently dropped an SDK event, a renamed event, a schema change or a tightened bot filter will cut the metric without any user behaviour changing.</li>
        <li><strong>Did the definition change?</strong> Ask whether the query, the filter, the dedup rule or the source table behind the tile was edited. Check the dashboard version history and whether someone left a filter applied.</li>
        <li><strong>Is the comparison fair?</strong> Compare like with like: same weekday, week over week and year over year, and against forecast rather than against yesterday. Orders on a Monday against a Sunday is not a finding, it is a day of week effect.</li>
        <li><strong>Do neighbouring metrics agree?</strong> If orders fell 15% but sessions, logins and payment attempts are flat, that pattern points at measurement. If the whole funnel moved together, the drop is more likely real.</li>
        <li><strong>Then localise.</strong> Only once the number survives those checks do you start to segment and hunt for a cause.</li>
      </ol>`,
      answer: `<p>First I would establish that the number is real rather than an artefact. I would check that the day is complete and the pipeline actually finished, since a failed or delayed ETL load, a partial day or late-arriving events produce a drop that disappears the next morning. I would check whether logging changed: a new app version that dropped an event, a renamed event, a schema change or a stricter bot filter all reduce a metric without any user behaviour changing. I would confirm the metric definition, the filter and the source table behind the tile are unchanged, and look at the dashboard edit history.</p>
      <p>Then I would make sure the comparison is fair. I would compare the same weekday, look week over week and year over year, and compare against forecast rather than against yesterday alone, because day of week and seasonal patterns explain a lot of apparent drops.</p>
      <p>Finally I would sanity check neighbouring metrics. If sessions, logins and payment attempts are flat while orders alone fell, that asymmetry points at instrumentation; if the whole funnel moved together, the change is probably real. Only after the number survives all of that would I start to segment and localise the drop and look for a business cause.</p>`
    },
    {
      id: 'cs-e2',
      difficulty: 'easy',
      prompt: 'Give me a structured checklist of the <strong>categories</strong> of cause for any unexpected metric move, and explain how you use a change log to narrow them down.',
      hint: 'Four buckets that do not overlap, then align the timing of the drop with things that happened.',
      concepts: [
        { label: 'Data and instrumentation issues as one bucket', any: ['instrument', 'data issue', 'logging', 'pipeline', 'tracking', 'measurement'], required: true },
        { label: 'Internal product or business changes: release, pricing, campaign, experiment ramp', any: ['release', 'deploy', 'pricing', 'campaign', 'experiment', 'internal', 'product change'], required: true },
        { label: 'External factors: seasonality, holidays, competitor, outage, policy or OS change', any: ['seasonal', 'holiday', 'competitor', 'external', 'outage', 'policy', 'macro'], required: true },
        { label: 'User or traffic mix changes: acquisition channel, cohort quality, geography mix', any: ['mix', 'channel', 'acquisition', 'cohort', 'traffic'], required: true },
        { label: 'Align the timing of the drop with the change log, deploys and incident timeline', any: ['timeline', 'timing', 'change log', 'deploy', 'incident', 'when did'], required: true },
        { label: 'A sudden cliff implies a discrete event, a gradual slope implies drift', any: ['cliff', 'sudden', 'gradual', 'slope', 'drift', 'step change'] },
        { label: 'Keep the buckets mutually exclusive so the search is exhaustive', any: ['mece', 'mutually exclusive', 'exhaustive', 'structur', 'no overlap'] }
      ],
      approach: `<p>Interviewers are scoring structure here, not cleverness. Offer four non-overlapping buckets, then show how timing evidence eliminates most of them quickly.</p>
      <ol>
        <li><strong>Data and instrumentation:</strong> pipeline failure, logging or tracking bug, definition change, deduplication error, timezone shift. Always checked first.</li>
        <li><strong>Internal changes:</strong> a code deploy or app release, a pricing or fee change, an experiment ramped to a larger share of traffic, a marketing campaign that ended, an operational change such as fewer delivery partners.</li>
        <li><strong>External factors:</strong> seasonality and holidays, a competitor promotion, a third-party or gateway outage, an app store or OS policy change, weather or macro events.</li>
        <li><strong>User and traffic mix:</strong> the composition of who arrives changed, for example a paid channel scaled up and brought lower-intent traffic, or the geography mix shifted.</li>
        <li><strong>Use the timeline as the filter.</strong> Pin down exactly when the drop started, to the hour if possible, then line it up against the deploy log, experiment ramp log, campaign calendar and incident channel. A sudden cliff at 14:05 almost always maps to a discrete event such as a deploy; a gradual slope over three weeks points to drift, competition or cohort quality instead.</li>
        <li>Keeping the buckets mutually exclusive matters because it lets you say what you have ruled out, which is what makes the investigation credible.</li>
      </ol>`,
      answer: `<p>I use four mutually exclusive buckets. First, <strong>data and instrumentation</strong>: pipeline failure, a logging or tracking bug, a definition change, duplicate rows, a timezone shift. Second, <strong>internal changes</strong>: a deploy or app release, a pricing change, an experiment ramp, a campaign that ended, an operational change. Third, <strong>external factors</strong>: seasonality, holidays, a competitor promotion, a third-party outage, an OS or app store policy change. Fourth, <strong>traffic and user mix</strong>: the acquisition channel mix or cohort quality changed, so the same funnel now converts differently.</p>
      <p>The change log is what turns that list into an investigation. I pin down when the drop started as precisely as the data allows, then align that timing against deploys, experiment ramps, the campaign calendar and the incident timeline. A sudden cliff implies a discrete event and I look for something that happened at that exact moment. A gradual slope implies drift, competitive pressure or a slow change in who is arriving, so I look at cohorts rather than at deploys.</p>
      <p>Because the buckets do not overlap, I can report what has been eliminated rather than only what I suspect, which is usually the difference between a confident answer and a guess.</p>`
    },
    {
      id: 'cs-e3',
      difficulty: 'easy',
      prompt: 'You have confirmed a 15% drop is real. Which <strong>dimensions</strong> do you segment by, and why do you rank segments by absolute contribution rather than by percentage change?',
      hint: 'A 60% drop in a segment that is 1% of volume is not your 15%.',
      concepts: [
        { label: 'Segment by platform, app version and device', any: ['platform', 'app version', 'ios', 'android', 'device', 'web'], required: true },
        { label: 'Segment by geography or market', any: ['geograph', 'country', 'city', 'region', 'market'], required: true },
        { label: 'Segment by user type: new versus returning, tenure, cohort', any: ['new user', 'new versus', 'returning', 'tenure', 'cohort', 'first time'], required: true },
        { label: 'Segment by acquisition channel or traffic source', any: ['channel', 'source', 'organic', 'paid', 'campaign'] },
        { label: 'Rank segments by absolute contribution to the total drop, not by percentage', any: ['absolute', 'contribution', 'volume', 'weight', 'share of the drop', 'size of the segment'], required: true },
        { label: 'Concentrated in one segment implies a specific technical or local cause', any: ['concentrat', 'isolated', 'one segment', 'specific', 'localis', 'localiz'] },
        { label: 'Broad-based across all segments implies a global cause such as data, pricing or seasonality', any: ['broad', 'across all', 'everywhere', 'global', 'all segments'] }
      ],
      approach: `<p>Segmentation is how you convert "orders are down" into "orders are down for Android users on version 8.2 in Indonesia", which is a sentence an engineer can act on.</p>
      <ol>
        <li><strong>The standard cuts:</strong> platform and app version, geography, new versus returning users and tenure, acquisition channel, device type, and hour of day. For a payments or checkout metric, add payment method and gateway.</li>
        <li><strong>Rank by contribution, not by percentage.</strong> Compute each segment absolute change and what share of the total drop it explains. A segment that fell 60% but represents 1% of volume contributes almost nothing; a segment that fell 18% and carries half your volume is the story. Percentage-only ranking sends people chasing tiny segments.</li>
        <li><strong>Read the shape of the result.</strong> If the drop is concentrated in one or two segments, suspect a specific cause: a broken release on one app version, a gateway failing in one country, a bug on one device class. If it is broad-based and roughly proportional everywhere, suspect a global cause such as an instrumentation change, a pricing change or seasonality.</li>
        <li><strong>Watch for the sum check.</strong> The contributions of your segments should add up to the total drop. If they do not, your dimension is missing something, usually a null or "other" bucket that hides the real cause.</li>
        <li>Stop when the segment is actionable and the arithmetic accounts for the bulk of the drop, rather than slicing indefinitely until you find noise.</li>
      </ol>`,
      answer: `<p>I would cut the metric by platform and app version, geography, new versus returning users and tenure, acquisition channel, device type and hour of day, adding payment method and gateway if the metric is a checkout or payments metric.</p>
      <p>For each segment I compute the absolute change and the share of the total drop it explains, then rank on that. Ranking by percentage change is misleading because a small segment can post a huge percentage move while contributing almost nothing to the headline number; the drop lives where the volume is, so contribution weighted by segment size is what identifies the cause. I also check that segment contributions sum to the total drop, since a gap usually means a null or "other" bucket is hiding something.</p>
      <p>The pattern itself is diagnostic. A drop concentrated in one segment points to a specific technical or local cause such as a broken app version or a failing regional gateway. A broad-based drop spread proportionally across all segments points to a global cause such as an instrumentation change, a pricing change or seasonality. I stop slicing once the finding is actionable and the arithmetic explains most of the move.</p>`
    },
    {
      id: 'cs-e4',
      difficulty: 'easy',
      prompt: 'How do you decide whether a 15% single-day drop is a <strong>real signal or normal noise</strong>? Be specific about what you would compute.',
      hint: 'Compare the move against the metric own historical variability, not against your intuition.',
      concepts: [
        { label: 'Compare the move against historical day-to-day variability, standard deviation or a control band', any: ['standard deviation', 'variance', 'variabilit', 'control chart', 'band', 'sigma', 'z score'], required: true },
        { label: 'Account for day of week and seasonal patterns before judging', any: ['day of week', 'weekday', 'weekend', 'seasonal', 'holiday'], required: true },
        { label: 'Check the denominator: small samples swing more, so low-volume metrics look volatile', any: ['sample size', 'small', 'denominator', 'volume', 'low traffic', 'noisy'], required: true },
        { label: 'Distinguish a one-day blip from a sustained shift over several days', any: ['sustained', 'one day', 'single day', 'persist', 'trend', 'multiple days', 'next day'], required: true },
        { label: 'Compare against forecast or a confidence interval rather than the previous point', any: ['forecast', 'confidence interval', 'expected range', 'predict', 'prior weeks'] },
        { label: 'Quantify the business impact to decide whether it deserves investigation at all', any: ['impact', 'revenue', 'material', 'worth', 'priorit'] }
      ],
      approach: `<p>Turn a vague "is 15% a lot?" into arithmetic. The honest answer depends entirely on how noisy the metric normally is.</p>
      <ol>
        <li><strong>Establish the normal range.</strong> Take the same weekday over the last eight to twelve weeks, compute the mean and standard deviation of the day-to-day change, and see where a 15% drop sits. If daily swings routinely reach twelve percent, a fifteen percent move is barely outside the noise band; if the metric usually moves two percent, it is a screaming anomaly.</li>
        <li><strong>Control for the calendar.</strong> Adjust for day of week, paydays, festivals and holidays before drawing conclusions. Many "drops" are just Sunday.</li>
        <li><strong>Check the denominator.</strong> A conversion rate computed on two hundred sessions is inherently volatile, so I would look at the volume behind the metric and, for a rate, compute a confidence interval to see whether the two days are even distinguishable.</li>
        <li><strong>Wait for persistence where you can.</strong> A single-day blip that reverts is usually noise or a transient incident; a drop that holds for three consecutive days at the same level is a genuine step change. Set a control chart or anomaly alert so this judgement stops being manual.</li>
        <li><strong>Size it in money.</strong> Even a real drop may not warrant a deep investigation if the volume is trivial, so I quantify the impact before spending a week on it.</li>
      </ol>`,
      answer: `<p>I would benchmark the move against the metric own history rather than against intuition. I take the same weekday over the past eight to twelve weeks, compute the mean and the standard deviation of daily changes, and see how many standard deviations a 15% drop represents. A metric whose daily swings routinely reach twelve percent has not really done anything unusual; a metric that normally moves two percent has.</p>
      <p>Before judging, I control for day of week, holidays and pay cycles, and I compare against forecast or an expected range rather than against the single previous point. I also check the denominator, because a rate built on a small sample size is volatile by construction, so for a rate I would compute a confidence interval and ask whether the two days are statistically distinguishable at all.</p>
      <p>Finally I look at persistence. A single day dip that reverts the next day is usually noise or a transient incident, while a drop sustained over several consecutive days is a step change that deserves a root cause investigation. I would also put a control chart or anomaly threshold in place so this is monitored automatically, and I would quantify the revenue impact to decide whether the anomaly is even material enough to prioritise.</p>`
    },
    {
      id: 'cs-e5',
      difficulty: 'easy',
      prompt: 'Conversion rate fell 15% but the <strong>total number of conversions went up</strong>. Explain how that happens and how you would confirm it.',
      hint: 'A ratio has two moving parts, and only one of them is the thing people usually talk about.',
      concepts: [
        { label: 'A ratio metric has a numerator and a denominator that must be examined separately', any: ['numerator', 'denominator', 'ratio', 'two part'], required: true },
        { label: 'The denominator grew faster than the numerator, so the rate fell while the count rose', any: ['denominator grew', 'traffic', 'sessions', 'grew faster', 'more visitors', 'increase in traffic'], required: true },
        { label: 'Usually caused by a mix shift towards lower-intent traffic', any: ['mix', 'lower intent', 'quality', 'channel', 'paid', 'campaign'], required: true },
        { label: 'Confirm by plotting numerator and denominator separately over time', any: ['plot', 'separate', 'trend both', 'chart', 'look at both'], required: true },
        { label: 'Segment the rate by channel or source to show each segment rate is stable', any: ['segment', 'by channel', 'by source', 'within each', 'per channel'] },
        { label: 'This is not necessarily bad: judge against the business goal and absolute outcomes', any: ['not bad', 'not necessarily', 'depends', 'goal', 'absolute', 'healthy'] }
      ],
      approach: `<p>This is a test of whether you instinctively decompose ratio metrics. Answer the mechanics first, then the diagnosis, then the judgement call.</p>
      <ol>
        <li><strong>The mechanics:</strong> conversion rate is conversions divided by sessions. If sessions rise 40% and conversions rise 20%, the rate falls even though the business gained conversions. Nothing is broken in the numerator.</li>
        <li><strong>The likely cause:</strong> a mix shift. A marketing push, a discount campaign, a viral post or a new paid channel brought a wave of lower-intent visitors. They inflate the denominator and convert at a lower rate, which drags the blended average down.</li>
        <li><strong>How to confirm:</strong> plot the numerator and denominator separately on the same timeline. If conversions are flat or rising while sessions spike, the diagnosis is settled in one chart.</li>
        <li><strong>Prove the mix story:</strong> segment conversion rate by channel or source. If each channel own rate is stable and only the weights changed, this is composition, not degradation. That is a mix shift, and in its extreme form it becomes Simpson paradox.</li>
        <li><strong>Make the judgement explicit:</strong> a falling rate with rising conversions is not automatically bad. If the extra traffic is cheap, it may be profitable. If it is expensive paid traffic, cost per acquisition matters more than the rate. Recommend judging on absolute outcomes and unit economics, and monitoring rate per channel rather than blended.</li>
      </ol>`,
      answer: `<p>Conversion rate is a ratio, so it can fall for two entirely different reasons: the numerator dropped, or the denominator grew faster than the numerator. Here the count of conversions rose, so the numerator is healthy and the denominator, sessions or visitors, must have grown faster. That is arithmetic rather than a problem.</p>
      <p>The usual driver is a mix shift: a campaign, a discount push or a new paid channel brought a surge of lower-intent traffic that converts below the existing average, dragging the blended rate down. To confirm it I would plot the numerator and denominator separately on one timeline, which normally settles the question immediately, then segment conversion rate by channel and source. If each individual channel rate is stable and only the channel weights changed, the drop is composition, not degradation.</p>
      <p>I would then be explicit that this is not necessarily bad. More conversions at a lower rate can be a good trade if the incremental traffic is cheap, and a bad one if it is expensive paid traffic, so the decision depends on cost per acquisition and unit economics rather than on the rate alone. I would recommend tracking the rate per channel alongside absolute conversions so a mix shift is never mistaken for a funnel regression again.</p>`
    },

    /* --------------------------- MEDIUM --------------------------- */
    {
      id: 'cs-m1',
      difficulty: 'medium',
      prompt: 'Daily active users are down <strong>8% over three weeks</strong>, as a gradual slide rather than a cliff. Structure the investigation, and say why the gradual shape changes your approach.',
      hint: 'Decompose the active user base into the flows that create it before looking for a villain.',
      concepts: [
        { label: 'A gradual slope points away from a single discrete event such as a deploy', any: ['gradual', 'slope', 'not a cliff', 'no single event', 'drift', 'sudden'], required: true },
        { label: 'Decompose actives into new, retained and resurrected users', any: ['new user', 'retained', 'retention', 'resurrect', 'reactivat', 'churn', 'decompos'], required: true },
        { label: 'Check acquisition volume and quality: campaign spend, channel mix', any: ['acquisition', 'install', 'signup', 'campaign', 'spend', 'channel', 'marketing'], required: true },
        { label: 'Check retention curves by signup cohort to see whether newer cohorts are worse', any: ['cohort', 'retention curve', 'by signup', 'd1', 'd7', 'd30'], required: true },
        { label: 'Consider a slow-rolling release, staged rollout or experiment ramp', any: ['staged', 'gradual rollout', 'ramp', 'rollout', 'version adoption', 'slow roll'] },
        { label: 'Consider external drift: seasonality, competitor, market saturation', any: ['seasonal', 'competitor', 'external', 'saturat', 'market'] },
        { label: 'Quantify which component explains most of the 8% before recommending action', any: ['quantif', 'contribution', 'explains', 'how much of', 'attribut'], required: true }
      ],
      approach: `<p>The shape of the curve is the first clue. A cliff maps to an event; a slope maps to a flow that is slowly changing, so the right tool is decomposition rather than a deploy hunt.</p>
      <ol>
        <li><strong>Read the shape.</strong> Three weeks of gradual decline rules out most single events, unless the event itself ramped gradually: a staged rollout, an app version that users adopted slowly, or an experiment scaled up in steps. Those are the exceptions worth checking explicitly.</li>
        <li><strong>Decompose the base.</strong> Actives on any day are new users plus retained existing users plus resurrected dormant users, minus churn. Chart each flow separately. A slide caused by falling acquisition looks nothing like one caused by weakening retention, and the fixes live in different teams.</li>
        <li><strong>If acquisition is the driver:</strong> check installs and signups, marketing spend and channel mix, app store ranking and any campaign that ended. Also check cohort quality, because cheaper traffic often retains worse.</li>
        <li><strong>If retention is the driver:</strong> build retention curves by signup cohort. If cohorts from three weeks ago onward have worse D1 and D7 retention than earlier ones, something changed in onboarding or the early experience. If all cohorts including old ones dropped simultaneously, the change affected the whole product, not just new users.</li>
        <li><strong>Check the calendar and the market.</strong> Compare year over year for the same weeks to separate seasonality from decay, and look for a competitor launch or promotion.</li>
        <li><strong>Quantify.</strong> Attribute how much of the eight percent each component explains, so the recommendation is proportionate. If retention of new cohorts accounts for six of the eight points, that is the whole story and the rest is noise.</li>
      </ol>`,
      answer: `<p>The gradual shape matters. A cliff points to a discrete event such as a deploy or an outage, whereas a slope over three weeks points to a flow that is changing slowly, so I would not start by hunting a single deploy. The exceptions I would still check are a staged rollout, slow app version adoption and an experiment ramp, all of which produce a gradual signature.</p>
      <p>I would decompose active users into new users, retained existing users and resurrected dormant users, and chart each flow separately, because the diagnosis and the owner differ completely. If acquisition is the driver I would look at installs and signups, marketing spend, channel mix and any campaign that ended, plus the quality of incoming cohorts. If retention is the driver I would build retention curves by signup cohort and compare D1, D7 and D30 across weeks: newer cohorts retaining worse implicates onboarding or the early experience, while all cohorts dropping at once implicates a product-wide change.</p>
      <p>Alongside that I would compare year over year for the same weeks to separate seasonality from genuine decay and check for competitor activity. Then I would quantify how much of the eight points each component contributes, so the recommendation matches the size of the cause rather than the loudest hypothesis.</p>`
    },
    {
      id: 'cs-m2',
      difficulty: 'medium',
      prompt: 'Revenue is <strong>flat</strong> month on month, but order volume grew 10%. Build the decomposition that tells you what actually happened.',
      hint: 'Write revenue as a product of factors, then find which factor moved the other way.',
      concepts: [
        { label: 'Write revenue as a multiplicative decomposition, for example users times orders per user times AOV', any: ['users', 'orders per user', 'aov', 'average order value', 'multipl', 'metric tree', 'decompos'], required: true },
        { label: 'If volume rose and revenue is flat, average order value must have fallen', any: ['aov fell', 'average order value', 'basket', 'price', 'ticket size'], required: true },
        { label: 'Check discounts, promotions, coupons and fee changes', any: ['discount', 'promo', 'coupon', 'cashback', 'fee', 'pricing'], required: true },
        { label: 'Check product or category mix shifting towards cheaper items', any: ['mix', 'category', 'cheaper', 'product mix', 'composition'], required: true },
        { label: 'Check refunds, cancellations and gross versus net revenue definitions', any: ['refund', 'cancel', 'gross', 'net', 'chargeback'] },
        { label: 'Quantify each factor contribution rather than naming a suspect', any: ['contribution', 'quantif', 'how much', 'attribut', 'explains'], required: true },
        { label: 'Decide whether it is healthy: new cheaper segment may be strategic', any: ['healthy', 'strateg', 'depends', 'new segment', 'trade off', 'tradeoff'] }
      ],
      approach: `<p>This is a metric tree question. The moment you write revenue as a product, the answer becomes a search over a small number of factors.</p>
      <ol>
        <li><strong>Build the tree:</strong> revenue equals active users times orders per user times average order value, or equivalently orders times AOV. Since orders rose ten percent and revenue is flat, AOV must have fallen by roughly nine percent. State that arithmetic explicitly, because it converts a vague question into one specific thing to explain.</li>
        <li><strong>Decompose AOV further:</strong> AOV equals items per order times average item price, net of discounts. Chart all three. Are people buying fewer items, cheaper items, or the same basket with a bigger discount applied?</li>
        <li><strong>Check the commercial levers:</strong> a new coupon, a cashback campaign, a free-delivery threshold change, a fee or pricing change, or a shift in the discount mix. Promotions are the single most common cause of volume up and revenue flat, and they are often run by a team that did not tell analytics.</li>
        <li><strong>Check mix:</strong> segment by category, city and customer segment. Growth concentrated in a cheap category or a low-ticket geography lowers blended AOV without any single order changing. Also check new versus returning, since new users typically place smaller first orders.</li>
        <li><strong>Check the definition:</strong> confirm you are comparing like with like on gross versus net revenue, and check whether refunds, cancellations or chargebacks rose.</li>
        <li><strong>Quantify and judge:</strong> attribute the shortfall across discount, item mix and customer mix, then say whether it is healthy. Acquiring a lower-ticket but profitable segment can be strategic; funding flat revenue with unsustainable discounts is not.</li>
      </ol>`,
      answer: `<p>I would start from a metric tree: revenue equals orders times average order value, and orders can be broken into active users times orders per user. Given orders grew ten percent while revenue stayed flat, average order value must have fallen by about nine percent, so AOV is the thing to explain.</p>
      <p>I would decompose AOV into items per order and average item price net of discounts, then chart each. From there I would check the commercial levers first, since a new coupon, cashback campaign, changed free-delivery threshold or a pricing and fee change is the most common explanation for volume up with revenue flat. Next I would check mix: segmenting by category, city and new versus returning users often shows that growth came from a cheaper category or from new users placing smaller first orders, which lowers blended AOV even though no individual behaviour worsened. I would also verify the revenue definition is consistent on gross versus net and check whether refunds and cancellations increased.</p>
      <p>Rather than naming one suspect, I would quantify how much of the gap each factor contributes, then make a judgement. If the lower AOV comes from a genuinely new and profitable customer segment, flat revenue with ten percent more orders can be a healthy trade; if it is funded by discounts with no retention benefit, it is buying volume at the cost of margin and should stop.</p>`
    },
    {
      id: 'cs-m3',
      difficulty: 'medium',
      prompt: 'Overall conversion dropped from 5.0% to 4.6%, yet conversion <strong>improved in every single segment</strong> you look at. What is going on, and how do you resolve it for a stakeholder?',
      hint: 'The segment rates are not the only thing that changed.',
      concepts: [
        { label: 'This is Simpson paradox, driven by a shift in segment weights', any: ['simpson', 'paradox', 'mix shift', 'weight', 'composition'], required: true },
        { label: 'The overall rate is a weighted average of segment rates', any: ['weighted average', 'weight', 'blended', 'aggregate of'], required: true },
        { label: 'Traffic moved towards a segment with a structurally lower conversion rate', any: ['shift', 'more traffic', 'lower converting', 'towards', 'proportion'], required: true },
        { label: 'Resolve by standardising: recompute with the previous period mix held constant', any: ['standardis', 'standardiz', 'hold the mix', 'constant', 'counterfactual', 'reweight', 'same mix'], required: true },
        { label: 'Report both the like-for-like view and the actual blended number', any: ['like for like', 'both', 'report both', 'two numbers', 'actual'], required: true },
        { label: 'Identify why the mix changed, since that is the real business question', any: ['why the mix', 'cause of the mix', 'campaign', 'channel', 'acquisition', 'source'] },
        { label: 'A mix shift can be intentional and still requires a decision', any: ['intentional', 'deliberate', 'strateg', 'decision', 'not necessarily bad'] }
      ],
      approach: `<p>Name the phenomenon, show the arithmetic, then give the stakeholder one number they can act on.</p>
      <ol>
        <li><strong>Name it:</strong> this is Simpson paradox. The aggregate rate is a weighted average of segment rates, so it can move in the opposite direction to every component if the weights change enough.</li>
        <li><strong>Show the mechanism with numbers:</strong> suppose desktop converts at 8% and mobile at 3%. With a 50/50 split the blended rate is 5.5%. If both improve to 8.5% and 3.2% but traffic shifts to 20/80, the blended rate becomes about 4.3%. Every segment improved and the total fell.</li>
        <li><strong>Find the weight change:</strong> chart the traffic share of each segment across the two periods next to each segment conversion rate. Usually a campaign, a channel scaling up, an app store feature or a geography expansion moved the mix.</li>
        <li><strong>Standardise to separate the two effects:</strong> recompute this period conversion using last period segment weights. That gives a like-for-like rate answering "did our funnel get better?", and the difference from the actual rate is the mix effect. This is exactly the same decomposition as rate versus mix in revenue analysis.</li>
        <li><strong>Report both numbers:</strong> the funnel improved on a like-for-like basis by X, and the mix shift cost Y, netting to the observed drop. Do not hide the blended number, because that is what leadership sees, but do not let it be misread as a product regression either.</li>
        <li><strong>Push to the real question:</strong> why did the mix change, was it deliberate, and is the new traffic worth having? That is the decision, not the paradox.</li>
      </ol>`,
      answer: `<p>This is Simpson paradox. The overall conversion rate is a weighted average of segment rates, so if traffic shifts towards a segment with a structurally lower rate, the blended number can fall even when every segment improves. For example, if desktop converts at 8% and mobile at 3%, both improving slightly while traffic moves from a 50/50 split to 20/80 mobile will drag the blended rate down by more than the improvements add.</p>
      <p>To resolve it I would chart each segment traffic share alongside its conversion rate for both periods to expose the weight change, then standardise: recompute the current period conversion using the previous period segment mix. That like-for-like rate answers whether the funnel itself improved, and the gap between it and the actual rate is the mix effect. I would present both, saying the funnel improved by so much on a constant mix while the mix shift cost so much, netting to the observed drop.</p>
      <p>Then I would move the conversation to the real question: what changed the mix, usually a campaign, a channel scaling up or a geography expansion, and whether that new traffic is worth having. A mix shift can be entirely intentional, but it still forces a decision about whether the cheaper traffic pays for itself, and it argues for monitoring conversion per segment rather than only the blended rate.</p>`
    },
    {
      id: 'cs-m4',
      difficulty: 'medium',
      prompt: 'Finance reports 1.20M orders for last month; your product dashboard shows 1.15M. Both are "correct". How do you <strong>reconcile</strong> them, and what do you do afterwards?',
      hint: 'Work down from definition to row level, in that order.',
      concepts: [
        { label: 'Start by comparing metric definitions: what counts as an order', any: ['definition', 'what counts', 'cancel', 'test order', 'internal', 'gross', 'net', 'status'], required: true },
        { label: 'Check timezone, date boundary and the timestamp used', any: ['timezone', 'utc', 'date boundary', 'cut off', 'cutoff', 'created at', 'timestamp'], required: true },
        { label: 'Check refresh timing and late-arriving or restated data', any: ['refresh', 'snapshot', 'late', 'restat', 'as of', 'reload', 'lag'], required: true },
        { label: 'Check duplicates and join fan-out inflating one number', any: ['duplicat', 'fan out', 'fanout', 'join', 'grain', 'one to many'], required: true },
        { label: 'Check the source tables and grain differ, then reconcile at row level with a key', any: ['source table', 'row level', 'order id', 'key', 'anti join', 'except', 'minus'], required: true },
        { label: 'Quantify the gap into named buckets so the difference is fully explained', any: ['bucket', 'quantif', 'explain the gap', 'account for', 'breakdown of the difference'] },
        { label: 'Afterwards establish one certified source of truth and document definitions', any: ['source of truth', 'certif', 'document', 'data dictionary', 'single definition', 'governance'], required: true }
      ],
      approach: `<p>The temptation is to defend your number. The senior move is to explain the gap precisely and then remove the ambiguity permanently.</p>
      <ol>
        <li><strong>Definitions first.</strong> Ask what each side counts. Finance typically counts net revenue-recognised orders excluding cancellations, refunds, test and internal accounts, and may include only paid orders. Product usually counts all placed orders. A four percent gap is exactly the size of a cancellation rate.</li>
        <li><strong>Time next.</strong> Compare timezone, the date boundary and which timestamp anchors the row: order created, payment captured or invoice issued. Finance often uses a local or fiscal calendar while the dashboard uses UTC, which alone shifts month boundaries.</li>
        <li><strong>Refresh and restatement.</strong> Check when each number was computed. Late-arriving events, backfills and restated rows mean a report run on the first of the month differs from the same report run a week later. Pin both to the same as-of time.</li>
        <li><strong>Then row level.</strong> Pull both order-id sets and do an anti join in both directions. The rows present in one and missing in the other tell you the cause directly, and duplicates from a join fan-out show up immediately as an inflated count on one side.</li>
        <li><strong>Quantify the bridge.</strong> Present it as a reconciliation: 1.20M finance, minus 38k cancellations, minus 9k test accounts, plus 2k late arrivals, equals 1.15M product. The gap is not "explained" until the buckets add up.</li>
        <li><strong>Then fix the system.</strong> Agree one certified source of truth per metric, document the definition in a data dictionary, build both reports from the same certified model or semantic layer, and add an automated reconciliation check that alerts when the two diverge beyond a threshold.</li>
      </ol>`,
      answer: `<p>I would work from definition down to row level. First, what counts as an order on each side: finance usually excludes cancellations, refunds, test and internal accounts and may count only paid or revenue-recognised orders, while a product dashboard normally counts every order placed, and that difference alone is often the entire gap. Second, timezone and date boundary, including which timestamp anchors the row, since a UTC dashboard and a local or fiscal calendar cut the month differently. Third, refresh timing, because late-arriving events, backfills and restated rows mean the same query run on two dates gives two answers, so I would pin both to the same as-of moment.</p>
      <p>Then I would go to the row level and anti join the two order id sets in both directions. The rows that appear in one and not the other name the cause immediately, and duplicates created by a join fan-out at the wrong grain surface as an inflated count on one side. I would present the result as a bridge, listing each bucket with its size so the difference is fully accounted for rather than merely attributed.</p>
      <p>Afterwards I would remove the ambiguity: agree a single certified source of truth per metric, document the definition in a data dictionary, rebuild both reports on the same certified model so the logic cannot drift, and add an automated reconciliation check that alerts when the two figures diverge beyond a tolerance. Reconciling once is useful; making the mismatch impossible is the actual deliverable.</p>`
    },
    {
      id: 'cs-m5',
      difficulty: 'medium',
      prompt: 'Payment success rate dropped from 92% to 78% overnight on a UPI flow. Localise the failure and decide what you recommend within the hour.',
      hint: 'Failures come with reason codes. Use them before you use intuition.',
      concepts: [
        { label: 'Break the payment flow into steps and find which step fails', any: ['step', 'funnel', 'stage', 'initiat', 'attempt', 'callback', 'where in the flow'], required: true },
        { label: 'Group failures by error or decline reason code', any: ['error code', 'reason code', 'decline', 'failure reason', 'error message', 'response code'], required: true },
        { label: 'Segment by payment method, gateway, PSP and issuing bank', any: ['gateway', 'psp', 'bank', 'issuer', 'payment method', 'provider'], required: true },
        { label: 'Segment by app version, platform and geography to catch a client-side bug', any: ['app version', 'platform', 'ios', 'android', 'geograph', 'device'], required: true },
        { label: 'Correlate the exact start time with deploys, config changes and third-party incidents', any: ['deploy', 'release', 'config', 'timeline', 'incident', 'status page', 'third party'], required: true },
        { label: 'Rank hypotheses by affected volume times drop size', any: ['rank', 'priorit', 'volume', 'contribution', 'biggest', 'impact'], required: true },
        { label: 'Recommend a reversible action such as rollback or rerouting traffic, then verify recovery', any: ['rollback', 'revert', 'reroute', 'failover', 'switch', 'disable', 'monitor', 'verify'], required: true }
      ],
      approach: `<p>A fourteen point drop in payment success is an incident, not an analysis project. Structure the hour around localising fast and recommending something reversible.</p>
      <ol>
        <li><strong>Confirm it is real, briefly.</strong> Check that attempt volume is normal and that the drop appears in both client and server logging. If attempts collapsed too, the problem may be upstream of payments entirely.</li>
        <li><strong>Split the flow into steps:</strong> intent created, request sent to the gateway, authentication or PIN step, bank authorisation, callback received, order marked paid. Success rate is a chain, and one step will own the loss. A drop in received callbacks with healthy authorisations is a very different bug from failures at the bank.</li>
        <li><strong>Read the reason codes.</strong> Group failures by error and decline code and compare the distribution today against yesterday. This usually solves the case outright: a spike in a single code such as a timeout, an invalid VPA or an issuer decline points straight at the layer that broke.</li>
        <li><strong>Segment the obvious dimensions:</strong> payment method and gateway or PSP, issuing bank, app version, platform and geography. If the loss is concentrated in one gateway or one bank, it is external; if it is concentrated in one app version, engineering shipped it.</li>
        <li><strong>Align the timeline.</strong> Get the drop start time to the minute and compare it against the deploy log, config and feature-flag changes, gateway status pages and the incident channel. Overnight timing with no deploy often means a partner-side change.</li>
        <li><strong>Rank by contribution:</strong> affected volume times the drop within each segment, so the recommendation targets the biggest block of lost payments rather than the most interesting one.</li>
        <li><strong>Recommend a reversible action:</strong> roll back the release or feature flag if it maps to a deploy, reroute traffic to an alternate gateway if one provider is failing, escalate to the partner with the evidence if it is their side. Then verify recovery on the same chart and quantify the payments lost during the window.</li>
      </ol>`,
      answer: `<p>I would first check that attempt volume is normal and that both client and server logging show the drop, so I know the metric is real and the problem is inside payments rather than upstream. Then I would decompose the flow into steps, from intent created through the gateway request, authentication, bank authorisation and callback to the order being marked paid, and find which step is losing users, since each step implies a different owner.</p>
      <p>Next I would group failures by error and decline reason code and compare the distribution against the previous day. A spike concentrated in one code, whether a timeout, an invalid VPA or an issuer decline, usually identifies the broken layer immediately. Alongside that I would segment by gateway or PSP, issuing bank, payment method, app version, platform and geography. Concentration in one gateway or bank points to an external partner, while concentration in one app version points to a client-side release. I would pin the drop start time to the minute and align it with the deploy log, config and feature-flag changes, gateway status pages and the incident channel.</p>
      <p>I would rank candidate causes by affected volume times the drop within that segment so effort follows lost payments rather than curiosity. Within the hour I would recommend the most reversible action the evidence supports: roll back the release or flag if it maps to a deploy, reroute or failover to an alternate gateway if one provider is degraded, or escalate to the partner with the reason-code evidence if it is their side. In an incident, a justified rollback beats a perfect causal proof. Then I would verify recovery on the same chart, quantify the payments and revenue lost during the window, and add an alert on success rate by gateway so the next occurrence is caught in minutes.</p>`
    },

    /* ---------------------------- HARD ---------------------------- */
    {
      id: 'cs-h1',
      difficulty: 'hard',
      prompt: 'You find a bug in app version 8.2 that breaks checkout, and version 8.2 is used by <strong>12% of users</strong>. Orders are down 15% overall. Is the bug the explanation? Show your reasoning.',
      hint: 'Check whether the size of the cause can arithmetically produce the size of the effect.',
      concepts: [
        { label: 'Test whether the size of the cause can produce the size of the effect', any: ['size of the cause', 'arithmetic', 'add up', 'magnitude', 'explain the full', 'account for', 'cannot explain', 'not explain', 'too small', 'sufficient', 'big enough', 'whole story'], required: true },
        { label: 'Contribution equals affected share times the drop within the affected group', any: ['affected share', 'times', 'contribution', 'multipl', '12', 'weighted'], required: true },
        { label: 'Even a total collapse in 12% of users caps the overall effect near 12 points', any: ['maximum', 'at most', 'cap', 'upper bound', 'cannot exceed', '12 point'], required: true },
        { label: 'Check the unaffected segment: if it also fell, a second cause exists', any: ['unaffected', 'other version', 'rest of', 'control', 'also fell', 'flat'], required: true },
        { label: 'Quantify the residual and keep investigating it rather than closing the case', any: ['residual', 'remaining', 'unexplained', 'second cause', 'keep investigat', 'partially'], required: true },
        { label: 'Avoid confirmation bias from stopping at the first plausible cause', any: ['confirmation bias', 'first plausible', 'stop', 'anchor', 'jump to conclusion', 'premature'], required: true },
        { label: 'Verify by measuring recovery after the fix ships', any: ['after the fix', 'recovery', 'verify', 'hotfix', 'monitor', 'validate the fix'] }
      ],
      approach: `<p>This question separates analysts who find a cause from analysts who verify that the cause is sufficient. The tool is simple arithmetic on contributions.</p>
      <ol>
        <li><strong>Set an upper bound.</strong> If version 8.2 carries 12% of orders and checkout were completely broken for all of them, the overall drop could be at most about 12 points. The observed drop is 15, so the bug cannot be the whole story even in the worst case.</li>
        <li><strong>Compute the actual contribution.</strong> Contribution equals the affected share times the drop within the affected group. If orders inside 8.2 fell 60%, the contribution is 0.12 times 0.60, about 7.2 points. That leaves roughly 8 points unexplained, more than half the problem.</li>
        <li><strong>Look at the unaffected group.</strong> Trend orders for every other version. If they are flat, the residual must come from somewhere the version dimension cannot see, so I would re-segment on geography, channel and payment method. If they also fell, there is a second, broader cause running at the same time, which is common when one incident masks another.</li>
        <li><strong>Name the bias.</strong> The failure mode here is stopping at the first plausible cause because it feels like a win. State the residual explicitly in the writeup so the investigation stays open.</li>
        <li><strong>Watch for interaction effects.</strong> Also check whether 8.2 adoption itself changed during the window, since a rollout that grew mid-period changes the weight and therefore the contribution day by day.</li>
        <li><strong>Confirm after the fix.</strong> When the hotfix ships, the recovery should be about the size you predicted. If orders recover only 7 points, your arithmetic was right and the rest of the gap is real and still unaddressed.</li>
      </ol>`,
      answer: `<p>I would test whether the magnitude of the cause can arithmetically produce the magnitude of the effect. Version 8.2 is 12% of users, so even if checkout were completely broken for every one of them, the overall drop could not exceed roughly 12 points. Since orders fell 15%, the bug cannot account for the full effect even in the worst case, and that conclusion is available before any further analysis.</p>
      <p>To size the actual contribution I multiply the affected share by the drop within the affected group. If orders inside 8.2 fell 60%, the contribution is about 7.2 points, leaving roughly 8 points unexplained. I would then trend the unaffected versions. If they are flat, the residual is hiding in a dimension I have not cut yet, so I would re-segment by geography, channel and payment method. If they also fell, a second and broader cause is running concurrently, which happens more often than people expect because a dramatic finding tends to stop the search.</p>
      <p>The failure mode to avoid is confirmation bias: closing the case on the first plausible cause. I would state the residual explicitly so the investigation stays open, check whether 8.2 adoption changed during the window since that shifts the weight day by day, and then verify against reality once the hotfix ships. If recovery is about seven points rather than fifteen, the arithmetic was right and the remaining gap is a real problem that still needs an owner.</p>`
    },
    {
      id: 'cs-h2',
      difficulty: 'hard',
      prompt: 'A feature was A/B tested and won with a <strong>+5% lift</strong> on conversion. After the full rollout, conversion is down 15%. Reconcile the experiment with reality.',
      hint: 'Either the original result was not what it seemed, or it did not generalise to everyone.',
      concepts: [
        { label: 'Question the original result: peeking, multiple comparisons, sample ratio mismatch', any: ['peek', 'multiple compar', 'sample ratio', 'srm', 'false positive', 'p hack', 'underpowered'], required: true },
        { label: 'Novelty or primacy effects that fade or reverse after launch', any: ['novelty', 'primacy', 'fade', 'wore off', 'short term', 'temporar'], required: true },
        { label: 'The experiment population differs from the full population, so the effect does not generalise', any: ['generalis', 'generaliz', 'population', 'heterogene', 'subset', 'only tested on', 'segment differ'], required: true },
        { label: 'Interference, network effects or cannibalisation between groups or surfaces', any: ['interference', 'network effect', 'cannibalis', 'cannibaliz', 'spillover', 'two sided'], required: true },
        { label: 'Engineering or scale differences between the test build and the production rollout', any: ['implementation', 'engineering', 'scale', 'latency', 'performance', 'infrastructure', 'different code'], required: true },
        { label: 'Confounding with time: seasonality or a concurrent change during rollout', any: ['seasonal', 'concurrent', 'same time', 'confound', 'another change', 'time period'], required: true },
        { label: 'Keep a holdback group so post-launch effects remain measurable', any: ['holdback', 'holdout', 'keep a control', 'reverse experiment', 'back test', 'ramp down'], required: true },
        { label: 'Apply Twyman law: a surprising result is more likely an error than a discovery', any: ['twyman', 'surprising', 'too good', 'suspicious', 'sceptic', 'skeptic'] }
      ],
      approach: `<p>Hold two possibilities open: the original win was never real, or it was real for the tested population and did not survive contact with everyone else. Then say how you would tell which.</p>
      <ol>
        <li><strong>Audit the original test.</strong> Was the decision made by peeking at an early significant reading? Was it one of many metrics tested without correction? Was there a sample ratio mismatch indicating broken assignment? Was it underpowered, so the 5% was a noisy point estimate whose confidence interval spanned zero? Recheck the primary metric with the pre-declared analysis and look at the interval, not just the p-value.</li>
        <li><strong>Consider novelty and primacy.</strong> Regular users often engage with anything new, inflating early lift, and the effect decays. Conversely primacy makes habituated users perform worse at first. Compare the treatment effect by week within the original test; a decaying curve is the tell.</li>
        <li><strong>Question generalisation.</strong> Experiments frequently run on a subset: one platform, one geography, logged-in users, a small ramp bucket. If the effect was heterogeneous and the tested slice was the friendliest one, rollout to everyone can be net negative. Recompute the original effect by segment to look for signs it was negative somewhere.</li>
        <li><strong>Look for interference.</strong> In marketplaces and social products the control group is affected by the treatment through shared supply, ranking or notification budgets, which biases the measured lift. Cannibalisation across surfaces does the same: the feature wins locally and takes volume from elsewhere, so the local metric rises while the global one falls.</li>
        <li><strong>Check implementation and scale.</strong> The rollout code path, caching behaviour and latency at 100% traffic are not identical to a small experiment bucket. A feature that adds two hundred milliseconds at full load can lose more conversion than it gains.</li>
        <li><strong>Rule out coincidence.</strong> Confirm nothing else changed during rollout, since a concurrent release, pricing change or seasonal shift can produce a drop the feature is being blamed for. Segment the post-launch drop the same way you would any other incident.</li>
        <li><strong>Decide with a reversible test.</strong> The cleanest resolution is to ramp down: hold back a random slice, or reverse the rollout as an experiment, and measure. That converts an argument into a measurement.</li>
        <li>Frame the whole answer with Twyman law: the more surprising the contradiction, the more likely something is broken in measurement rather than in the world.</li>
      </ol>`,
      answer: `<p>Two families of explanation, and I would test both. First, the original win may not have been real: a decision made by peeking at an early reading, one metric among many without correction, an underpowered test whose confidence interval spanned zero, or a sample ratio mismatch indicating broken randomisation. I would rerun the pre-declared primary analysis and look at the interval rather than the p-value.</p>
      <p>Second, the effect may have been real but not generalisable. Novelty effects inflate early lift and fade, so I would plot the treatment effect by week inside the original test and look for decay. Experiments often run on a friendly subset, one platform or geography or logged-in users only, so I would recompute the effect by segment to see whether it was heterogeneous and possibly negative for groups that were excluded. In a marketplace or social product I would check interference and cannibalisation, where the control group is contaminated through shared supply or ranking, or the feature wins locally while taking volume from another surface so the global metric falls.</p>
      <p>I would also check the mundane explanations: the production implementation and its latency at full scale are not identical to a small bucket, and something else may simply have changed during rollout, so I would segment the post-launch drop as I would any incident and confirm no concurrent release, pricing change or seasonal shift is responsible.</p>
      <p>The way to settle it is a reversible measurement: keep or create a holdback group, or ramp the feature down as an experiment, and read the difference. Throughout I would apply Twyman law, that a surprising result is more often a measurement error than a discovery, and treat both the original +5% and the current -15% with equal suspicion until one of them survives scrutiny.</p>`
    },
    {
      id: 'cs-h3',
      difficulty: 'hard',
      prompt: 'Day-7 retention has fallen for new users only, and nobody ran an experiment. How do you get a <strong>causal</strong> read on what caused it, and what are the limits of your answer?',
      hint: 'Look for something that split users into treated and untreated without you planning it.',
      concepts: [
        { label: 'Build cohorts by signup date and compare retention curves across cohorts', any: ['cohort', 'signup', 'retention curve', 'by week', 'd7'], required: true },
        { label: 'Pin the onset to a cohort boundary and align it with releases or changes', any: ['onset', 'boundary', 'which cohort', 'timing', 'release', 'change log', 'when'], required: true },
        { label: 'Use difference-in-differences against an unaffected comparison group', any: ['difference in difference', 'diff in diff', 'did', 'comparison group', 'control group', 'unaffected'], required: true },
        { label: 'Exploit a staged or geo rollout as a natural experiment', any: ['natural experiment', 'staged', 'phased', 'geo', 'rollout', 'quasi'], required: true },
        { label: 'Consider regression discontinuity around the release cutoff', any: ['regression discontinu', 'rdd', 'cutoff', 'threshold', 'sharp'], required: true },
        { label: 'Check pre-trends and confounders such as acquisition mix changing at the same time', any: ['pre trend', 'parallel trend', 'confound', 'acquisition mix', 'channel', 'cohort quality'], required: true },
        { label: 'Match cohorts on observable characteristics to make them comparable', any: ['match', 'propensity', 'comparable', 'like for like', 'control for', 'adjust'] },
        { label: 'State assumptions and limits: this is observational, so propose a confirmatory experiment', any: ['assumption', 'limitation', 'observational', 'cannot prove', 'confirm with an experiment', 'caveat'], required: true }
      ],
      approach: `<p>Without a randomised test you are looking for a source of variation you did not create. Say what design you would use, what identifying assumption it rests on, and how you would check that assumption.</p>
      <ol>
        <li><strong>Localise in time first.</strong> Build weekly signup cohorts and plot D1, D7 and D30 retention. Find the first cohort that broke. That boundary date is your most valuable clue, because it converts an open question into "what changed on or around that date", which you check against release notes, onboarding changes, experiment ramps, campaign starts and pricing changes.</li>
        <li><strong>Find the natural experiment.</strong> The best case is that the suspected change did not hit everyone at once. A staged rollout, a geography-by-geography launch, an app version users adopt at different times or a server-side flag enabled progressively all give you treated and untreated users at the same calendar time.</li>
        <li><strong>Difference-in-differences.</strong> Compare the change in D7 retention before and after, for the affected group against an unaffected comparison group. This differences out anything common to both, such as seasonality. Its identifying assumption is parallel trends, which I would test by plotting several pre-periods and confirming the two groups moved together before the change.</li>
        <li><strong>Regression discontinuity where the cutoff is sharp.</strong> If a release went live at a precise timestamp, compare users who signed up in the hours immediately before and after. Those users are near-identical in every respect except exposure, which makes the comparison strong, though it only measures a very short-run effect.</li>
        <li><strong>Rule out the biggest confounder: who is arriving.</strong> New-user retention falling is frequently an acquisition story rather than a product story. A campaign scaling up, a channel mix shift or an app store feature brings lower-intent users who retain worse, with the product completely unchanged. I would segment retention by channel and by geography and recompute holding the acquisition mix constant. If retention within each channel is stable and only the weights moved, the cause is cohort quality.</li>
        <li><strong>Make cohorts comparable.</strong> Where the groups differ on observables, match or reweight on device, geography, channel and first-session behaviour so I am not comparing different populations and calling the difference an effect.</li>
        <li><strong>State the limits plainly.</strong> Every one of these designs rests on an untestable assumption, and none of them is as good as a randomised test. I would give the effect with its uncertainty, name the assumption it depends on, and propose the confirmatory experiment: hold back or revert the suspected change for a random slice of new users and measure D7 directly.</li>
      </ol>`,
      answer: `<p>I would start by localising the onset. Weekly signup cohorts with D1, D7 and D30 retention curves show which cohort first broke, and that boundary date is the lever: I align it against release notes, onboarding changes, experiment ramps, campaign starts and pricing changes to build a short list of candidate causes.</p>
      <p>Then I look for variation I did not create. If the suspected change rolled out in stages, by geography, or through an app version that users adopted at different times, I have treated and untreated users at the same calendar time and can run a difference-in-differences: the change in D7 retention for the affected group minus the change for an unaffected comparison group, which differences out seasonality and anything else common to both. That rests on a parallel-trends assumption, so I would plot several pre-periods to confirm the groups moved together beforehand. Where a release has a sharp go-live timestamp, a regression discontinuity comparing users who signed up just before and just after is even cleaner, at the cost of only measuring a short-run effect.</p>
      <p>The confounder I would work hardest to eliminate is acquisition mix. New-user retention falling is very often a change in who is arriving rather than a change in the product: a campaign scaling up or a channel mix shift brings lower-intent users who retain worse with nothing broken at all. So I would segment retention by channel and geography and recompute holding the acquisition mix constant, and where groups differ on observables I would match or reweight on device, geography, channel and first-session behaviour.</p>
      <p>I would be explicit about the limits. These are observational designs resting on assumptions that cannot be fully verified, so I would report the estimated effect with its uncertainty, name the assumption each estimate depends on, and recommend the confirmatory step: revert or hold back the suspected change for a random slice of new users and measure D7 retention directly. That converts a defensible inference into evidence.</p>`
    },
    {
      id: 'cs-h4',
      difficulty: 'hard',
      prompt: 'You have localised the 15% drop but a full fix will take two weeks of engineering time. Leadership asks whether it is worth prioritising. Build the case.',
      hint: 'Convert the metric move into money, compare it against the cost of acting, and state your assumptions.',
      concepts: [
        { label: 'Convert the metric drop into a business quantity such as revenue or orders lost', any: ['revenue', 'orders lost', 'money', 'rupees', 'gmv', 'monet', 'business impact'], required: true },
        { label: 'Size it with an explicit chain: affected users times conversion times value', any: ['times', 'multipl', 'chain', 'affected users', 'per user', 'aov', 'assumption'], required: true },
        { label: 'Annualise or project over the expected duration rather than quoting one day', any: ['run rate', 'annual', 'per month', 'duration', 'until fixed', 'ongoing', 'cumulative'], required: true },
        { label: 'Compare against the cost of the fix: engineering time and opportunity cost', any: ['cost of the fix', 'engineering', 'opportunity cost', 'two weeks', 'effort', 'roi'], required: true },
        { label: 'Consider a cheap interim mitigation while the real fix is built', any: ['mitigat', 'workaround', 'interim', 'stopgap', 'partial fix', 'rollback', 'short term'], required: true },
        { label: 'Consider non-revenue costs: trust, churn, support load, compliance risk', any: ['trust', 'churn', 'support', 'reputation', 'complian', 'risk', 'long term'], required: true },
        { label: 'State assumptions and give a range or sensitivity rather than false precision', any: ['assumption', 'range', 'sensitiv', 'best case', 'worst case', 'uncertain', 'estimate'], required: true },
        { label: 'Recommend prevention: monitoring, alerting and data quality checks', any: ['alert', 'monitor', 'data quality', 'prevent', 'guardrail', 'anomaly detection', 'check'], required: true }
      ],
      approach: `<p>Leadership is making a resource allocation decision, so the deliverable is a number with a stated confidence, not an analysis. Build the estimate transparently enough that they can challenge one assumption without discarding the whole thing.</p>
      <ol>
        <li><strong>Build the impact chain.</strong> Affected users per day, times the conversion or order rate they lost, times average order value, times margin if the conversation is about profit. Write every input on the slide so each one can be argued with individually.</li>
        <li><strong>Project over the right horizon.</strong> A daily number is easy to dismiss. Multiply by the expected duration until the fix lands, and give a run rate, for example lost orders per day, over two weeks, and annualised if the leak is permanent. That reframes "15%" as a concrete sum of money.</li>
        <li><strong>Price the alternative.</strong> Two engineering weeks has a cost and, more importantly, an opportunity cost of whatever those engineers would otherwise ship. Compare like with like, in money over the same horizon.</li>
        <li><strong>Offer a cheaper option.</strong> Almost always there is an interim mitigation: roll back, disable a flag, reroute traffic, patch the worst-affected segment only, or run a win-back campaign for affected users. Presenting a staged plan, mitigate now and fix properly next sprint, is usually what gets approved.</li>
        <li><strong>Add the costs that do not show up in revenue.</strong> Churn from users who hit a broken checkout, elevated support volume, app store reviews, trust damage and any compliance or regulatory exposure. These often dominate for payment and account issues, and they compound with time.</li>
        <li><strong>Be honest about uncertainty.</strong> Give a range with explicit best and worst case, and show which assumption the answer is most sensitive to. A defensible band beats a precise number nobody believes.</li>
        <li><strong>Close on prevention.</strong> Ask for the monitoring alongside the fix: an anomaly alert on the metric segmented by the dimension that broke, data quality checks on the pipeline, and a dashboard tile with an expected range. The recurrence cost is part of the business case.</li>
      </ol>`,
      answer: `<p>I would convert the drop into money before arguing about priority. The chain is explicit: affected users per day, times the conversion they lost, times average order value, times margin if the discussion is about profit, with every assumption written down so leadership can challenge an input rather than the conclusion. I would then project it over the relevant horizon, quoting a daily run rate, the cumulative loss over the two weeks until a fix lands, and an annualised figure if the leak would otherwise persist.</p>
      <p>Against that I would price the alternative: two engineering weeks costs real money, but the opportunity cost of what those engineers would otherwise ship usually matters more, so I would compare both in money over the same horizon. I would also present a cheaper interim option, because a staged plan tends to be what gets approved: roll back or disable the flag, reroute affected traffic, patch only the worst segment, and run a win-back for users who hit the broken flow, while the full fix is scheduled properly.</p>
      <p>I would include the costs that never appear in a revenue calculation: churn among users who hit a broken checkout, elevated support volume, app store reviews and trust damage, plus any compliance risk, since for payment issues these often exceed the direct loss and grow the longer the issue lives. I would give the whole thing as a range with best and worst case and flag which assumption the estimate is most sensitive to, rather than a single false-precision figure.</p>
      <p>Finally I would attach prevention to the request: an anomaly alert on this metric segmented by the dimension that failed, data quality checks on the upstream pipeline, and an expected range on the dashboard tile. The cost of the same incident recurring undetected belongs in the business case, and it is usually the argument that wins the resourcing.</p>`
    },
    {
      id: 'cs-h5',
      difficulty: 'hard',
      prompt: 'It is 4pm. The drop is confirmed, the root cause is only <strong>partly</strong> known, and leadership wants an update in an hour. How do you structure it, and what do you deliberately leave out?',
      hint: 'They need a decision-ready summary, not your investigation log.',
      concepts: [
        { label: 'Lead with the headline: what moved, by how much, since when', any: ['headline', 'lead with', 'what moved', 'how much', 'since when', 'top line', 'bottom line'], required: true },
        { label: 'State the scope quantified: who and what is affected', any: ['scope', 'who is affected', 'quantif', 'segment', 'how many users', 'impact'], required: true },
        { label: 'State confidence and what has been ruled out, separating fact from hypothesis', any: ['confiden', 'ruled out', 'eliminat', 'fact', 'hypothes', 'know versus', 'certain'], required: true },
        { label: 'Give ranked hypotheses with the next checks and an ETA for each', any: ['rank', 'next step', 'eta', 'by when', 'priorit', 'next check'], required: true },
        { label: 'Name the decision or the ask: rollback, resourcing, external communication', any: ['decision', 'ask', 'recommend', 'rollback', 'approval', 'need from you', 'action'], required: true },
        { label: 'Leave out SQL, table names and investigation chronology', any: ['sql', 'table', 'query', 'chronolog', 'technical detail', 'how i found', 'jargon'], required: true },
        { label: 'Avoid false certainty and avoid blaming a team before evidence is in', any: ['false certaint', 'do not overstate', 'blame', 'speculat', 'premature', 'overclaim', 'honest'], required: true },
        { label: 'Commit to a follow-up cadence and a written summary afterwards', any: ['follow up', 'next update', 'cadence', 'by tomorrow', 'written', 'postmortem', 'post mortem'], required: true }
      ],
      approach: `<p>Communication questions are graded on whether you can be useful under uncertainty. The structure below front-loads the decision and keeps the unknowns explicit rather than hidden.</p>
      <ol>
        <li><strong>Headline in one or two sentences.</strong> Orders are down 15% versus forecast since Tuesday 2pm, concentrated in Android checkout, costing roughly a defined amount per day. Nothing else goes first.</li>
        <li><strong>Scope, quantified.</strong> Who is affected and how many: the segment, the share of volume, the share of the total drop it explains. This tells leadership whether it is a niche bug or a business-wide problem.</li>
        <li><strong>Separate what is known from what is suspected.</strong> Three columns in effect: confirmed facts, ruled out, and open hypotheses. Being able to say the pipeline and the metric definition are clean is itself valuable, because it stops others relitigating it.</li>
        <li><strong>Ranked hypotheses with owners, next checks and ETAs.</strong> Most likely cause, what evidence would confirm or kill it, who is checking, and by when. This shows the investigation is converging rather than wandering.</li>
        <li><strong>The ask.</strong> State the decision you need: approval to roll back, an engineer for the evening, whether to notify customers or pause a campaign. An update with no ask wastes the meeting.</li>
        <li><strong>What I deliberately leave out:</strong> SQL, table and column names, the chronology of how I found things, dead ends, and technical jargon. Also no precise causal claim I cannot support, and no naming of the team whose deploy is suspected before the evidence is in, because that turns an incident review into a defensive argument. Detail goes in an appendix for whoever wants it.</li>
        <li><strong>Close with cadence.</strong> Commit to the next update time and a written summary, then a postmortem with prevention once it is resolved. Under time pressure, an honest partial answer with a clear next step earns far more trust than a confident wrong one.</li>
      </ol>`,
      answer: `<p>I would open with the headline: what moved, by how much, against what baseline, since when, and the approximate cost per day. Second, the scope quantified, naming the affected segment, its share of volume and the share of the total drop it explains, so leadership immediately knows whether this is niche or business-wide.</p>
      <p>Third, I would separate fact from hypothesis explicitly: what is confirmed, what has been ruled out, and what remains open. Saying that the pipeline and the metric definition are verified clean has real value because it stops the room relitigating settled ground. Fourth, ranked hypotheses, each with the check that would confirm or eliminate it, an owner and an ETA, which demonstrates the investigation is converging. Fifth, the ask: the decision I need from them, whether that is approval to roll back, an engineer for the evening, pausing a campaign, or a call on customer communication. An update without an ask wastes the hour.</p>
      <p>I would deliberately leave out the SQL, the table and column names, the chronology of how I got here and the dead ends, along with any jargon that needs explaining. I would also avoid false certainty, giving a confidence level rather than overstating a partial finding, and I would not name the team whose deploy is suspected before the evidence is in, because that turns an incident into a defensive argument. Those details belong in an appendix.</p>
      <p>I would close by committing to a follow-up cadence, the next update time and a written summary, with a postmortem and prevention measures once it is resolved. Under time pressure an honest partial answer with a clear next step and a named decision builds far more credibility than a confident conclusion that has to be retracted tomorrow.</p>`
    }
  ]
});
