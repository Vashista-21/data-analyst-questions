DAQ.registerTopic({
  id: 'ab-testing',
  group: 'rest',
  name: 'A/B Testing',
  icon: '\uD83E\uDDEA',
  blurb: 'Hypotheses, p-values, power, sample size, peeking, sample ratio mismatch and shipping decisions.',
  questions: [
    /* ---------------------------- EASY ---------------------------- */
    {
      id: 'ab-e1',
      difficulty: 'easy',
      prompt: 'What is an A/B test, and why is <strong>random assignment</strong> the part that makes it work?',
      hint: 'What does randomisation do to all the variables you did not think of?',
      concepts: [
        { label: 'Two or more variants are compared: control versus treatment', any: ['control', 'treatment', 'variant', 'two group', 'group b', 'version'], required: true },
        { label: 'Users are randomly assigned to variants', any: ['random'], required: true },
        { label: 'Randomisation balances known and unknown confounders', any: ['confound', 'bias', 'balanc', 'comparable', 'similar', 'unknown', 'selection'], required: true },
        { label: 'It allows a causal claim, not just a correlation', any: ['causal', 'causat', 'cause', 'correlation'] },
        { label: 'Only one change is isolated so the effect is attributable', any: ['one change', 'single change', 'isolat', 'only difference', 'same time'] }
      ],
      approach: `<p>Define it in one line, then spend your answer on <em>why randomisation</em> matters, because that is the actual question.</p>
      <ol>
        <li>An A/B test is a controlled experiment: users are split into a control group that sees the current experience and a treatment group that sees the change, and you compare a pre-declared metric.</li>
        <li>Random assignment makes the two groups statistically equivalent on <strong>everything</strong>, including variables you never measured such as device quality, tenure or intent.</li>
        <li>Because the only systematic difference between the groups is the treatment, a difference in the metric can be attributed to the treatment. That is what upgrades the result from correlation to causation.</li>
        <li>Contrast with a before/after comparison, which is confounded by seasonality, marketing pushes and product releases happening at the same time.</li>
      </ol>`,
      answer: `<p>An A/B test randomly splits users into a <strong>control</strong> group (existing experience) and one or more <strong>treatment</strong> groups (the change), then compares a pre-declared primary metric between them.</p>
      <p>Randomisation is the engine of the method: it makes the groups comparable in expectation on every attribute, observed or not, so the treatment becomes the only systematic difference. Without it, the groups differ by self-selection and you can no longer separate the effect of the change from the effect of who ended up in which group. A pre/post comparison fails for the same reason, since time itself carries seasonality and other launches.</p>`
    },
    {
      id: 'ab-e2',
      difficulty: 'easy',
      prompt: 'Define the null and alternative hypotheses for a checkout-conversion test, and state precisely what a <strong>p-value of 0.03</strong> means.',
      hint: 'A p-value is a probability about the data given the null, not about the hypothesis given the data.',
      concepts: [
        { label: 'Null hypothesis: no difference between control and treatment', any: ['no difference', 'no effect', 'equal', 'same', 'h0', 'null'], required: true },
        { label: 'Alternative hypothesis: there is a difference', any: ['alternative', 'h1', 'difference exists', 'is a difference', 'not equal', 'higher', 'increase'], required: true },
        { label: 'p-value = probability of data this extreme assuming the null is true', any: ['assuming the null', 'if the null', 'given the null', 'null is true', 'as extreme', 'extreme'], required: true },
        { label: 'It is NOT the probability that the null or the hypothesis is true', any: ['not the probability', 'does not mean', 'misinterpret', 'common mistake', 'is not'] },
        { label: '0.03 < 0.05 so you reject the null at the 5% level', any: ['reject', '0.05', 'significant'] }
      ],
      approach: `<p>State the hypotheses in metric terms first, then give the textbook-precise definition of a p-value and immediately kill the common misreading.</p>
      <ol>
        <li><strong>H&#8320;:</strong> conversion rate of treatment equals conversion rate of control (the difference is zero).</li>
        <li><strong>H&#8321;:</strong> the two conversion rates differ (two-sided), or treatment is higher (one-sided, which you should only use with a strong prior justification).</li>
        <li><strong>p = 0.03</strong> means: if the null were true, there is a 3% chance of observing a difference at least as extreme as the one you saw, purely from sampling noise.</li>
        <li>It is <em>not</em> a 3% chance that the null is true, and <em>not</em> a 97% chance the feature works. Those are statements about hypotheses, which frequentist p-values cannot make.</li>
        <li>Finish with the decision: 0.03 &lt; 0.05, so you reject the null, and you then report the effect size and confidence interval because significance alone says nothing about magnitude.</li>
      </ol>`,
      answer: `<p><strong>H&#8320;:</strong> CR<sub>treatment</sub> &minus; CR<sub>control</sub> = 0. <strong>H&#8321;:</strong> CR<sub>treatment</sub> &minus; CR<sub>control</sub> &ne; 0.</p>
      <p>A p-value of 0.03 is the probability of seeing a difference at least as large as the observed one <em>assuming the null hypothesis is true</em>. Since 0.03 is below a 0.05 threshold, you reject the null and call the result statistically significant.</p>
      <p>It does not mean there is a 3% chance the null is true, nor a 97% chance the treatment works, and it says nothing about how big the effect is. Always pair it with the point estimate and its confidence interval.</p>`
    },
    {
      id: 'ab-e3',
      difficulty: 'easy',
      prompt: 'Explain Type I and Type II errors in the context of shipping a product feature. Which is worse, and what controls each?',
      hint: 'One ships a useless feature, the other kills a good one.',
      concepts: [
        { label: 'Type I error: false positive, rejecting a true null', any: ['type i', 'type 1', 'false positive', 'reject a true null', 'no real effect'], required: true },
        { label: 'Type II error: false negative, failing to detect a real effect', any: ['type ii', 'type 2', 'false negative', 'fail to reject', 'miss a real'], required: true },
        { label: 'Alpha controls Type I error, typically 0.05', any: ['alpha', 'significance level', '0.05', '5'], required: true },
        { label: 'Beta / power controls Type II error, power = 1 - beta, typically 80%', any: ['beta', 'power', '80', '0.8', '1 beta'], required: true },
        { label: 'Which is worse depends on the cost of the decision', any: ['depends', 'cost', 'risk', 'context', 'trade off', 'tradeoff'] }
      ],
      approach: `<p>Map both errors onto real product consequences, because that is what makes the answer sound senior.</p>
      <ol>
        <li><strong>Type I (false positive):</strong> the test says the feature works when it does not. You ship engineering complexity and maintenance cost for zero gain, and the "win" later evaporates.</li>
        <li><strong>Type II (false negative):</strong> the test misses a real improvement. You discard a good idea, which is an invisible cost nobody gets blamed for.</li>
        <li><strong>Controls:</strong> &alpha; sets the false positive rate (0.05 by convention). Power = 1 &minus; &beta; sets your ability to catch a true effect (0.80 by convention), and you buy power with sample size, longer runtime, lower-variance metrics or a larger minimum detectable effect.</li>
        <li><strong>Which is worse:</strong> refuse the false dichotomy and tie it to cost. For an irreversible, expensive or trust-sensitive change, a false positive is worse, so tighten &alpha;. For a cheap, reversible tweak in a fast experimentation programme, a false negative is worse, so raise power or relax &alpha;.</li>
      </ol>`,
      answer: `<p><strong>Type I</strong> is a false positive: you conclude the feature helped when it did not, and you ship for nothing. Its rate is set by &alpha;, usually 0.05.</p>
      <p><strong>Type II</strong> is a false negative: a real improvement exists but the test does not detect it, so you abandon a good feature. Its rate is &beta;, and 1 &minus; &beta; is power, usually targeted at 80%.</p>
      <p>Neither is universally worse. Weigh the cost of each mistake: irreversible or expensive changes justify a stricter &alpha;, while cheap reversible changes in a high-velocity roadmap justify prioritising power. The two are traded against each other at fixed sample size, which is why sample size is the real lever.</p>`
    },
    {
      id: 'ab-e4',
      difficulty: 'easy',
      prompt: 'What is a <strong>minimum detectable effect (MDE)</strong>, and why must you decide it before the experiment starts?',
      hint: 'It links business relevance to the sample size you need.',
      concepts: [
        { label: 'MDE is the smallest effect the test is designed to detect reliably', any: ['smallest', 'minimum effect', 'smallest effect', 'detect', 'lift'], required: true },
        { label: 'It should be set by business relevance, not statistics', any: ['business', 'worth', 'meaningful', 'material', 'roi', 'practical'], required: true },
        { label: 'Smaller MDE requires a much larger sample size', any: ['sample size', 'larger sample', 'more users', 'more traffic', 'longer'], required: true },
        { label: 'Fixing it upfront prevents post-hoc rationalising of the result', any: ['before', 'upfront', 'pre declar', 'post hoc', 'in advance', 'avoid bias'] },
        { label: 'It feeds the power calculation together with alpha, power and baseline variance', any: ['power', 'alpha', 'baseline', 'variance', 'calculation'] }
      ],
      approach: `<p>Define it, then explain the two things it controls: feasibility and honesty.</p>
      <ol>
        <li>The MDE is the smallest true effect your design can detect with the chosen &alpha; and power. Anything smaller will usually come back non-significant even if it is real.</li>
        <li>Set it from the business side: what lift would actually justify building and maintaining this? A 0.1% conversion lift may be worth chasing at scale and worthless for a small product.</li>
        <li>Sample size scales roughly with 1/MDE&sup2;, so halving the MDE quadruples the traffic you need. This is the conversation that tells you whether the experiment is even feasible.</li>
        <li>Committing upfront prevents the failure mode where a flat result gets re-described as "we were only looking for a big effect" afterwards, and it lets you distinguish "no effect" from "underpowered".</li>
      </ol>`,
      answer: `<p>The MDE is the smallest difference between variants that the experiment is powered to detect, given your &alpha;, target power and baseline variance.</p>
      <p>It has to be chosen upfront for three reasons: it determines the required sample size (which scales with roughly 1/MDE&sup2;, so small MDEs are expensive), it forces an explicit business judgement about what lift is worth shipping, and it protects the analysis from post-hoc reinterpretation. When a test comes back flat, the MDE is also what lets you say "we can rule out effects larger than X" rather than the unsupported "the feature does nothing".</p>`
    },
    {
      id: 'ab-e5',
      difficulty: 'easy',
      prompt: 'You are asked to test a new "Buy now" button. Which metrics would you declare before launch, and why do you need <strong>guardrail metrics</strong>?',
      hint: 'One primary metric, a few secondary ones, and a few things you refuse to break.',
      concepts: [
        { label: 'One pre-declared primary metric tied to the hypothesis', any: ['primary metric', 'one metric', 'north star', 'success metric', 'primary'], required: true },
        { label: 'Secondary / diagnostic metrics to explain the mechanism', any: ['secondary', 'diagnostic', 'supporting', 'funnel', 'ctr', 'click'], required: true },
        { label: 'Guardrail metrics protect against harm elsewhere', any: ['guardrail', 'harm', 'protect', 'regress', 'not break', 'counter metric'], required: true },
        { label: 'Examples of guardrails: latency, refunds, cancellations, support tickets, retention', any: ['latency', 'page load', 'refund', 'cancel', 'return rate', 'support', 'retention', 'churn', 'crash'] },
        { label: 'Avoid metric proliferation, which inflates false positives', any: ['multiple', 'many metrics', 'false positive', 'p hacking', 'correction', 'cherry pick'] }
      ],
      approach: `<p>Structure the answer as one primary, a few secondary, a few guardrails, and then explain the failure mode guardrails prevent.</p>
      <ol>
        <li><strong>Primary:</strong> purchase conversion rate per exposed user. Singular, pre-declared, and directly tied to the hypothesis that reducing checkout friction increases purchases.</li>
        <li><strong>Secondary:</strong> button click-through rate, add-to-cart rate, checkout completion rate, revenue per user. These explain <em>why</em> the primary moved and catch a broken mechanism.</li>
        <li><strong>Guardrails:</strong> page latency, refund and cancellation rate, average order value, support-ticket volume, and retention. A one-click button can easily raise purchases while raising regret purchases and refunds, which is a net loss.</li>
        <li>Note the discipline point: every extra metric you test is another chance of a spurious significant result, so keep the list short, declare it in advance, and treat secondary findings as directional rather than conclusive.</li>
      </ol>`,
      answer: `<p><strong>Primary:</strong> purchase conversion per exposed user, declared before launch.</p>
      <p><strong>Secondary/diagnostic:</strong> button CTR, add-to-cart rate, checkout completion, revenue per user, so you can explain the mechanism behind any movement.</p>
      <p><strong>Guardrails:</strong> latency, refund and cancellation rate, average order value, support contacts and retention.</p>
      <p>Guardrails exist because a feature can win on the primary metric while damaging the business: a frictionless buy button may increase purchases and simultaneously increase accidental orders, refunds and support load. Guardrails turn "did it win?" into "did it win without breaking anything?" Keeping the metric list short and pre-declared also limits the multiple-comparison problem that comes from scanning dozens of metrics for a win.</p>`
    },

    /* --------------------------- MEDIUM --------------------------- */
    {
      id: 'ab-m1',
      difficulty: 'medium',
      prompt: 'Which inputs determine the <strong>sample size</strong> of an experiment, and how does each one push the number up or down?',
      hint: 'Four levers: baseline, effect size, variance, and the two error rates.',
      concepts: [
        { label: 'Baseline conversion rate / metric mean', any: ['baseline', 'current rate', 'base rate', 'mean'], required: true },
        { label: 'Minimum detectable effect: smaller MDE means much larger n', any: ['mde', 'minimum detectable', 'effect size', 'lift'], required: true },
        { label: 'Metric variance or standard deviation', any: ['variance', 'standard deviation', 'sd', 'spread', 'noisy', 'noise'], required: true },
        { label: 'Significance level alpha', any: ['alpha', 'significance level', '0.05'], required: true },
        { label: 'Statistical power (1 - beta)', any: ['power', 'beta', '80'], required: true },
        { label: 'One-sided versus two-sided test and number of variants', any: ['one sided', 'two sided', 'tailed', 'variants', 'arms', 'correction'] },
        { label: 'n scales with variance / MDE squared', any: ['squared', 'square', 'quadrupl', 'inverse square', '1 mde'] }
      ],
      approach: `<p>Give the mental model, then walk each lever with its direction of effect.</p>
      <ol>
        <li>For a comparison of two proportions, n per arm &asymp; <code>2 &sdot; (z<sub>&alpha;/2</sub> + z<sub>&beta;</sub>)&sup2; &sdot; p(1&minus;p) / MDE&sup2;</code>. Everything below is just reading that formula.</li>
        <li><strong>Baseline rate:</strong> sets <code>p(1&minus;p)</code>. Rates near 50% are noisiest and need the most traffic; very low rates need a lot too because the absolute effect is tiny.</li>
        <li><strong>MDE:</strong> in the denominator and squared. Halving the effect you want to catch multiplies sample size by four. This is the dominant lever.</li>
        <li><strong>Variance:</strong> in the numerator. Revenue-type metrics with heavy tails need far more traffic than binary metrics, which is why capping outliers or using CUPED helps.</li>
        <li><strong>&alpha;:</strong> stricter (0.01) means larger n. <strong>Power:</strong> higher (90% vs 80%) means larger n.</li>
        <li><strong>Design:</strong> more variants split traffic and require multiple-comparison correction, so each arm needs more users; a one-sided test needs fewer but is rarely worth the assumption.</li>
      </ol>`,
      answer: `<p>Sample size per arm is driven by <code>n &asymp; 2(z<sub>&alpha;/2</sub> + z<sub>&beta;</sub>)&sup2; &sdot; &sigma;&sup2; / MDE&sup2;</code>:</p>
      <ul>
        <li><strong>Baseline rate / metric mean</strong> &rarr; determines variance for proportions, <code>p(1&minus;p)</code>.</li>
        <li><strong>MDE</strong> &rarr; inverse-square relationship, the strongest lever; smaller MDE, dramatically more traffic.</li>
        <li><strong>Variance</strong> &rarr; noisier metrics need more users; reduce it by capping outliers, using ratios per user, or CUPED.</li>
        <li><strong>&alpha;</strong> &rarr; stricter significance needs more users.</li>
        <li><strong>Power</strong> &rarr; going from 80% to 90% needs roughly 30% more users.</li>
        <li><strong>Number of variants and sidedness</strong> &rarr; more arms split traffic and require correction, raising the per-arm requirement.</li>
      </ul>
      <p>In practice you also divide by daily eligible traffic to convert n into runtime, and round the runtime up to whole weeks to cover weekly seasonality.</p>`
    },
    {
      id: 'ab-m2',
      difficulty: 'medium',
      prompt: 'Your test has been running 3 days, the treatment is up 4% and p = 0.04. The PM wants to ship today. What is your response?',
      hint: 'Continuously checking a growing dataset destroys the false positive rate.',
      concepts: [
        { label: 'This is peeking / early stopping, which inflates the false positive rate', any: ['peek', 'early stop', 'inflate', 'false positive', 'multiple look', 'repeated test'], required: true },
        { label: 'The test should run to its pre-computed sample size or duration', any: ['sample size', 'pre computed', 'planned', 'full duration', 'predetermined', 'run the test'], required: true },
        { label: 'Cover full weekly cycles to capture day-of-week seasonality', any: ['week', 'day of week', 'seasonal', 'weekend', 'cycle'], required: true },
        { label: 'Early results are unstable and often regress toward zero', any: ['unstable', 'regress', 'noisy', 'fluctuat', 'volatile', 'shrink'], required: true },
        { label: 'Valid ways to stop early: sequential testing, alpha spending, Bayesian methods', any: ['sequential', 'alpha spending', 'group sequential', 'bayesian', 'always valid'] },
        { label: 'Novelty effect can make early treatment numbers look better than steady state', any: ['novelty', 'primacy', 'new experience', 'wear off', 'wears off'] }
      ],
      approach: `<p>Do not just say no. Explain the statistical reason, name the legitimate alternative, and offer a decision path.</p>
      <ol>
        <li><strong>Name the problem:</strong> a fixed-horizon p-value is only valid if you look once, at the planned sample size. Checking daily and stopping at the first p &lt; 0.05 can push the real false positive rate to 20&ndash;30%.</li>
        <li><strong>Explain the dynamics:</strong> early in a test the estimate is dominated by noise and by the most active users who enter first. Day-3 effects routinely shrink toward zero. Novelty effects also inflate early treatment numbers.</li>
        <li><strong>Seasonality:</strong> three days cannot represent a weekly cycle; weekday and weekend users behave differently, so run in whole weeks.</li>
        <li><strong>Offer the legitimate option:</strong> if the business genuinely needs the ability to stop early, switch the analysis to a sequential design with alpha spending, or a Bayesian approach with a pre-agreed decision rule. Both are valid for continuous monitoring; the fixed-horizon test is not.</li>
        <li><strong>Give a path:</strong> keep the test running to plan, share the confidence interval rather than a bare p-value, and if there is real urgency, ship behind a flag to a small share while the test completes.</li>
      </ol>`,
      answer: `<p>I would not ship on day 3. Repeatedly checking a fixed-horizon test and stopping at the first significant reading is peeking, and it inflates the false positive rate well beyond the nominal 5% because every extra look is another chance for noise to cross the threshold.</p>
      <p>Three days also cannot cover a full weekly cycle, early estimates are dominated by the most active users and are unstable, and novelty effects tend to flatter the treatment before behaviour settles.</p>
      <p>The correct options are: run to the pre-computed sample size in whole weeks, or if we need early-stopping ability, adopt a sequential/group-sequential design with alpha spending or a Bayesian rule agreed before launch. I would also report the confidence interval on the 4% lift, since a wide interval makes the shipping risk obvious to the PM.</p>`
    },
    {
      id: 'ab-m3',
      difficulty: 'medium',
      prompt: 'A test shows no significant change on the primary metric, but one of 12 tracked metrics is significant at p = 0.04 in a single user segment. Would you call it a win?',
      hint: 'How many false positives do you expect from 12 metrics at alpha = 0.05?',
      concepts: [
        { label: 'Multiple comparisons inflate the chance of a spurious significant result', any: ['multiple compar', 'multiple test', 'family wise', 'inflate', 'false positive', 'chance'], required: true },
        { label: 'With 12 tests at alpha 0.05 you expect roughly one false positive by chance', any: ['12', 'one false', 'expect', '0.6', '46', 'by chance'], required: true },
        { label: 'Corrections: Bonferroni or Benjamini-Hochberg FDR', any: ['bonferroni', 'benjamini', 'hochberg', 'fdr', 'correct', 'adjust'], required: true },
        { label: 'Segment-level findings are post-hoc unless pre-registered', any: ['post hoc', 'pre registered', 'pre declar', 'cherry pick', 'p hacking', 'fishing', 'subgroup'], required: true },
        { label: 'The primary metric decides the ship call', any: ['primary metric', 'primary', 'pre declared metric', 'decision metric'], required: true },
        { label: 'Treat it as a hypothesis to be confirmed in a follow-up test', any: ['follow up', 'replicat', 'confirm', 'new test', 'next experiment', 'validate'] }
      ],
      approach: `<p>Answer with arithmetic first, then the governance rule, then a constructive next step.</p>
      <ol>
        <li><strong>Quantify the noise:</strong> at &alpha; = 0.05 with 12 independent metrics, the chance of at least one false positive is 1 &minus; 0.95<sup>12</sup> &asymp; 46%. Slicing by segment multiplies the number of implicit tests further, so a single p = 0.04 is exactly what pure noise looks like.</li>
        <li><strong>Apply the rule:</strong> the pre-declared primary metric governs the decision. It did not move, so the test is not a win.</li>
        <li><strong>Correct properly:</strong> if secondary metrics must be interpreted, control the error rate with Bonferroni for a small confirmatory set, or Benjamini&ndash;Hochberg FDR when screening many metrics. Under either correction, p = 0.04 will almost certainly not survive.</li>
        <li><strong>Be useful:</strong> the segment finding is a hypothesis, not a result. If it is mechanistically plausible, pre-register it as the primary metric of a properly powered follow-up test on that segment.</li>
        <li><strong>Also check power:</strong> confirm the flat primary metric was not simply underpowered, by reporting its confidence interval against the MDE.</li>
      </ol>`,
      answer: `<p>No. With 12 metrics at &alpha; = 0.05 the probability of at least one spurious significant result is about 46%, and cutting by segment adds many more implicit comparisons, so a lone p = 0.04 is the expected behaviour of noise rather than evidence.</p>
      <p>The decision belongs to the pre-declared primary metric, which did not move. Any secondary reading should be adjusted with Bonferroni (small confirmatory sets) or Benjamini&ndash;Hochberg FDR (metric screening), and p = 0.04 will very likely fail both.</p>
      <p>The constructive move is to treat the segment result as a hypothesis: if there is a plausible mechanism, run a properly powered follow-up with that segment and metric pre-registered as primary. I would also report the primary metric's confidence interval so we can distinguish "no effect" from "underpowered".</p>`
    },
    {
      id: 'ab-m4',
      difficulty: 'medium',
      prompt: 'What are <strong>novelty</strong> and <strong>primacy</strong> effects, how do you detect them, and how do you design around them?',
      hint: 'Plot the treatment effect over time and split by new versus tenured users.',
      concepts: [
        { label: 'Novelty: users engage more simply because the change is new, then it fades', any: ['novelty', 'new', 'curiosity', 'fades', 'wears off', 'temporary'], required: true },
        { label: 'Primacy / change aversion: existing users initially perform worse due to relearning', any: ['primacy', 'change aversion', 'learning', 'relearn', 'habit', 'worse at first', 'used to'], required: true },
        { label: 'Detect by plotting the treatment effect by day / over time', any: ['over time', 'by day', 'daily effect', 'trend', 'time series', 'plot'], required: true },
        { label: 'Compare new users versus existing users separately', any: ['new user', 'existing user', 'tenure', 'segment', 'cohort'], required: true },
        { label: 'Mitigate by running longer until the effect stabilises', any: ['run longer', 'longer duration', 'stabil', 'steady state', 'more weeks'], required: true },
        { label: 'Use a long-term holdback to measure the durable effect', any: ['holdback', 'holdout', 'long term', 'back test', 'reverse test'] }
      ],
      approach: `<p>Define both, then give a concrete detection method and a concrete design fix. Interviewers want the diagnostic, not just the vocabulary.</p>
      <ol>
        <li><strong>Novelty:</strong> the treatment wins early because it is new and users poke at it. The lift decays toward zero as curiosity fades, so shipping on week-1 data overstates the benefit.</li>
        <li><strong>Primacy (change aversion):</strong> tenured users are slower or unhappier at first because their muscle memory is broken. The treatment looks bad early and improves as users adapt, so you risk killing a genuinely better design.</li>
        <li><strong>Detection:</strong> plot the daily or weekly treatment effect. A monotone decay toward zero suggests novelty; a negative effect that recovers suggests primacy. Then split by tenure: if new users show a flat effect while existing users show the decay or recovery, that is strong confirmation, since novelty and primacy can only apply to people with a prior habit.</li>
        <li><strong>Design fixes:</strong> run long enough for the effect to plateau, base the decision on the stabilised period, evaluate new-user cohorts separately as a clean read, and keep a long-term holdback group to measure the durable effect weeks or months after launch.</li>
      </ol>`,
      answer: `<p><strong>Novelty effect:</strong> a temporary lift caused by the change being new; the effect decays once curiosity is exhausted. <strong>Primacy effect / change aversion:</strong> a temporary drop caused by existing users having to relearn a familiar flow; the effect recovers as they adapt.</p>
      <p><strong>Detection:</strong> plot the treatment effect by day or week and look for a decaying or recovering trend rather than a flat line, then segment by user tenure. New users have no prior habit, so a difference between new and existing users is the signature of both effects.</p>
      <p><strong>Design:</strong> run the test long enough to reach a plateau and decide on the stabilised window; read new-user cohorts as the unbiased view; and keep a long-term holdback after launch to confirm the effect is durable rather than a novelty artefact.</p>`
    },
    {
      id: 'ab-m5',
      difficulty: 'medium',
      prompt: 'Your metric is <strong>revenue per user</strong>, which is heavily skewed by a few whales. What breaks, and how do you analyse it properly?',
      hint: 'Think about variance, the t-test assumptions and what a single outlier does to the mean.',
      concepts: [
        { label: 'Heavy skew inflates variance, which destroys power', any: ['variance', 'power', 'noisy', 'skew', 'underpower', 'sensitiv'], required: true },
        { label: 'A few outliers can drive or hide the entire observed effect', any: ['outlier', 'whale', 'extreme', 'single user', 'few users'], required: true },
        { label: 'Cap / winsorise / log-transform the metric', any: ['cap', 'winsor', 'clip', 'log', 'trim', 'transform'], required: true },
        { label: 'Use variance reduction such as CUPED with pre-period revenue', any: ['cuped', 'variance reduction', 'covariate', 'pre period', 'pre experiment'], required: true },
        { label: 'Decompose into conversion rate times average order value', any: ['decompos', 'conversion', 'aov', 'average order', 'split the metric', 'break the metric'], required: true },
        { label: 'Bootstrap or non-parametric tests, or check with a rank/median-based view', any: ['bootstrap', 'non parametric', 'mann whitney', 'rank', 'median', 'permutation'] },
        { label: 'CLT still applies with large n, so a t-test is not automatically invalid', any: ['central limit', 'clt', 'large sample', 'large n', 'still valid'] }
      ],
      approach: `<p>Separate two different issues: whether the test is <em>valid</em> and whether it is <em>sensitive enough to be useful</em>.</p>
      <ol>
        <li><strong>Validity:</strong> with tens of thousands of users per arm, the Central Limit Theorem means the sampling distribution of the mean is roughly normal, so a t-test is usually still valid. Skew alone does not invalidate it.</li>
        <li><strong>Sensitivity:</strong> the real damage is variance. Since n scales with &sigma;&sup2;, a long tail can make the experiment hopelessly underpowered, and a single whale landing in one arm can create or mask an apparent effect.</li>
        <li><strong>Reduce the variance:</strong> winsorise or cap revenue at a high percentile (declared in advance), or analyse a capped metric alongside the raw one. Apply CUPED using each user's pre-experiment revenue as a covariate, which commonly cuts variance substantially without bias.</li>
        <li><strong>Decompose:</strong> revenue per user = conversion rate &times; average order value. Conversion is binary and low-variance, so it often reveals the mechanism clearly while raw revenue stays noisy.</li>
        <li><strong>Verify robustness:</strong> bootstrap the difference in means for a confidence interval that does not lean on normality, and sanity-check with a rank-based test. If conclusions flip once whales are capped, say so explicitly rather than picking the flattering version.</li>
      </ol>`,
      answer: `<p>Skew does not usually break validity at large n thanks to the CLT, but it destroys <strong>power</strong>, because required sample size scales with variance and a handful of whales dominate the variance. It also makes results fragile: one outlier in one arm can manufacture or hide the effect.</p>
      <p>Practical treatment: pre-declare a cap or winsorisation at a high percentile; apply <strong>CUPED</strong> with pre-experiment revenue as the covariate to strip out predictable user-level variation; decompose the metric into conversion rate &times; AOV so the low-variance component can be read cleanly; and confirm with a bootstrap confidence interval or a rank-based test.</p>
      <p>Report both the raw and the capped result. If they disagree, that fragility is itself the finding and the decision should not rest on a few users.</p>`
    },

    /* ---------------------------- HARD ---------------------------- */
    {
      id: 'ab-h1',
      difficulty: 'hard',
      prompt: 'Your experiment was configured 50/50 but the data shows 52% control and 48% treatment on 400,000 users. Walk through how you would handle this <strong>sample ratio mismatch</strong>.',
      hint: 'A chi-square test on the split, then work through assignment, logging and filtering as candidate causes.',
      concepts: [
        { label: 'Recognise it as sample ratio mismatch (SRM)', any: ['sample ratio mismatch', 'srm', 'ratio mismatch', 'imbalance', 'unequal split'], required: true },
        { label: 'Test the split statistically with a chi-square / binomial test', any: ['chi square', 'chi squared', 'binomial', 'test the split', 'p value'], required: true },
        { label: 'At this scale a 52/48 split is far too large to be chance', any: ['too large', 'not chance', 'cannot be random', 'highly significant', 'impossible'], required: true },
        { label: 'Do not trust or report the results until it is explained', any: ['do not trust', 'be trusted', 'not reliable', 'invalid', 'stop', 'not report', 'block the decision', 'debug first'], required: true },
        { label: 'Check the randomisation unit and bucketing/hashing logic', any: ['randomis', 'randomiz', 'bucket', 'hash', 'assignment', 'unit'], required: true },
        { label: 'Check differential logging, redirects, latency, crashes or bot filtering', any: ['logging', 'instrument', 'redirect', 'latency', 'crash', 'bot', 'tracking', 'telemetry'], required: true },
        { label: 'Check the analysis-side filters and join keys for asymmetric exclusion', any: ['filter', 'join', 'exclusion', 'pipeline', 'dedup', 'query'] }
      ],
      approach: `<p>SRM is a trust question. Establish that it is real, refuse to read the results, then diagnose in a fixed order from assignment through logging to analysis.</p>
      <ol>
        <li><strong>Confirm it is not chance:</strong> run a chi-square goodness-of-fit or binomial test against the expected 50/50. With 400k users, the standard error on the split share is about 0.08 percentage points, so a 2-point deviation is astronomically unlikely. It is a real defect.</li>
        <li><strong>Freeze the read-out:</strong> an SRM means the two groups are no longer exchangeable, so any lift may be selection bias. Communicate that the experiment is not decision-grade until explained; do not "adjust" and ship.</li>
        <li><strong>Assignment layer:</strong> inspect the hashing and bucketing, salt reuse across overlapping experiments, and whether the randomisation unit matches the analysis unit (user vs session vs device). Users switching devices or logging in mid-flow can leak across arms.</li>
        <li><strong>Delivery and logging layer:</strong> this is the most common culprit. If the treatment adds a redirect, extra latency, a larger bundle or a crash path, some treatment users never fire the exposure event and vanish from the data, which biases the survivors toward healthier sessions. Compare exposure timing, error rates and crash rates by arm.</li>
        <li><strong>Analysis layer:</strong> look for asymmetric filters, bot exclusion rules, deduplication, or joins that drop rows for only one arm.</li>
        <li><strong>Resolve:</strong> fix the root cause and rerun. If you must salvage something, sanity-check invariant pre-exposure metrics for balance and treat any surviving analysis as directional only.</li>
      </ol>`,
      answer: `<p>52/48 on 400k users is a textbook <strong>sample ratio mismatch</strong>. The expected standard error on the split is roughly 0.08pp, so a 2pp deviation is many standard errors out; a chi-square test will return an essentially zero p-value. It is a bug, not luck.</p>
      <p>The results cannot be trusted, because unequal delivery implies the groups differ in ways beyond the treatment. Diagnosis order:</p>
      <ol>
        <li><strong>Assignment:</strong> hashing/salt collisions, overlapping experiments, randomisation unit different from analysis unit, re-bucketing on login.</li>
        <li><strong>Delivery and telemetry:</strong> treatment-only redirects, added latency, bundle size, crashes or ad-blocked events causing missing exposure logs. Check crash and error rates per arm.</li>
        <li><strong>Analysis:</strong> asymmetric filters, bot rules, dedupe logic or lossy joins.</li>
      </ol>
      <p>Fix the cause, validate that pre-exposure invariant metrics are balanced, and rerun the experiment before making any decision.</p>`
    },
    {
      id: 'ab-h2',
      difficulty: 'hard',
      prompt: 'You are testing a referral feature on a social app where users interact with each other. Why does standard user-level randomisation fail, and what would you do instead?',
      hint: 'Treatment leaks from treated users to their control friends.',
      concepts: [
        { label: 'Network interference / spillover violates independence (SUTVA)', any: ['interference', 'spillover', 'network effect', 'sutva', 'independen', 'leak', 'contaminat'], required: true },
        { label: 'Control users are affected by treated users, biasing the estimate toward zero', any: ['control is affected', 'bias', 'underestimate', 'toward zero', 'dilut', 'contaminated control'], required: true },
        { label: 'Cluster randomisation: randomise groups/communities instead of users', any: ['cluster', 'group level', 'community', 'graph cluster', 'randomise clusters', 'randomize clusters'], required: true },
        { label: 'Alternatives: geo-based split, ego-clusters, or switchback / time-based design', any: ['geo', 'city', 'region', 'ego', 'switchback', 'time based', 'market level'], required: true },
        { label: 'Clustering reduces effective sample size and needs variance adjustment', any: ['effective sample', 'fewer units', 'power', 'variance', 'icc', 'cluster robust', 'intra cluster'], required: true },
        { label: 'Measure spillover explicitly with a multi-level or saturation design', any: ['saturation', 'multi level', 'two stage', 'dose', 'exposure level', 'measure spillover'] }
      ],
      approach: `<p>Start from the assumption that breaks, show which direction the bias runs, then trade off designs on bias versus power.</p>
      <ol>
        <li><strong>The violated assumption:</strong> standard analysis assumes one user's outcome depends only on their own assignment (SUTVA). A referral feature deliberately pushes treated users to invite others, so control users receive invites and behave differently than a true control.</li>
        <li><strong>Direction of bias:</strong> the control group is partially treated, which shrinks the measured gap and usually <em>understates</em> the true effect. In viral loops it can also inflate control engagement enough to reverse the sign of a secondary metric.</li>
        <li><strong>Cluster randomisation:</strong> randomise at a level that contains most interactions, for example graph communities detected by clustering the social graph, or geographies. Interactions then mostly stay inside a single arm, so leakage is small.</li>
        <li><strong>Cost:</strong> the unit of inference becomes the cluster, not the user. Effective sample size collapses toward the number of clusters, and correlated behaviour within a cluster (measured by the intra-cluster correlation) inflates variance. You must analyse with cluster-robust standard errors or aggregate to cluster means, and expect to need many more users for the same power.</li>
        <li><strong>Other designs:</strong> geo or market-level tests for strong network products; ego-cluster designs that treat a user plus their immediate neighbourhood; switchback / time-sliced designs where the whole market flips between arms, which handles marketplace interference too.</li>
        <li><strong>Measure the spillover:</strong> a saturation design that varies the treated fraction across clusters (say 25%, 50%, 75%) lets you estimate the direct effect and the spillover effect separately, which is exactly what a referral feature is supposed to produce.</li>
      </ol>`,
      answer: `<p>User-level randomisation assumes no interference between units. A referral feature breaks that by design: treated users invite control users, so the control group is partially treated. The measured difference then understates the true effect, and network-mediated metrics can even move in the wrong direction.</p>
      <p><strong>Preferred design:</strong> cluster randomisation, where clusters are graph communities (or geographies as a coarse proxy) so most interactions remain within one arm. Analyse at the cluster level or with cluster-robust standard errors, and remember the effective sample size is closer to the number of clusters than the number of users, so power drops and the test needs more traffic and time.</p>
      <p><strong>Alternatives:</strong> geo/market-level tests, ego-cluster designs, or switchback designs for marketplace-style interference. To quantify virality rather than just detect it, use a saturation design that varies the treated share per cluster, which separates the direct effect from the spillover effect.</p>`
    },
    {
      id: 'ab-h3',
      difficulty: 'hard',
      prompt: 'Results are in: engagement +6% (significant), revenue per user &minus;1.5% (not significant), 7-day retention flat. Leadership wants a ship/no-ship recommendation. What do you say?',
      hint: 'Distinguish "no evidence of harm" from "evidence of no harm", and tie it to the OEC.',
      concepts: [
        { label: 'Non-significant revenue is not proof of no harm; check the confidence interval', any: ['confidence interval', 'not proof', 'absence of evidence', 'underpower', 'power', 'ci'], required: true },
        { label: 'Compare the revenue CI against a tolerable-loss threshold', any: ['threshold', 'tolerable', 'how much', 'bound', 'worst case', 'lower bound', 'material'], required: true },
        { label: 'Decide against a pre-declared OEC / primary metric hierarchy', any: ['oec', 'primary metric', 'pre declared', 'north star', 'hierarchy', 'trade off', 'tradeoff'], required: true },
        { label: 'Check whether the engagement gain is quality engagement or just noise/clicks', any: ['quality', 'meaningful', 'mechanism', 'shallow', 'clickbait', 'diagnos', 'segment', 'funnel'], required: true },
        { label: 'Retention needs a longer horizon than 7 days to be conclusive', any: ['longer', 'horizon', 'long term', '28', '30 day', 'holdback', 'holdout'], required: true },
        { label: 'Recommend a concrete path: extend, power for revenue, or staged rollout with monitoring', any: ['extend', 'rerun', 'staged', 'phased', 'rollout', 'monitor', 'holdback', 'ramp'], required: true }
      ],
      approach: `<p>The trap is treating "not significant" as "no effect". Convert every number into a decision-relevant statement, then give one clear recommendation with conditions.</p>
      <ol>
        <li><strong>Interpret the revenue result properly:</strong> ask for the confidence interval. If it spans, say, &minus;4% to +1%, the test cannot rule out a materially damaging revenue loss, and on a large revenue base that potential loss can dwarf the engagement gain. "Not significant" here likely means "underpowered for revenue", since revenue is far noisier than engagement.</li>
        <li><strong>Set the bar in advance:</strong> the guardrail question is not "is revenue significantly down?" but "can we exclude a loss bigger than we are willing to accept?" That is a non-inferiority framing, and it needs a pre-agreed tolerance.</li>
        <li><strong>Interrogate the engagement win:</strong> +6% of what? Sessions and clicks can rise because the feature is confusing or the layout forces extra navigation. Look at the funnel, session depth, and whether the gain concentrates in a segment, to establish that it is quality engagement rather than churn-inducing friction.</li>
        <li><strong>Retention horizon:</strong> flat 7-day retention is weak evidence either way; the harm from lower revenue per user or degraded quality typically shows up at 28 days or later.</li>
        <li><strong>Recommendation:</strong> do not do a full ship on this evidence. Either extend the test (or rerun) with revenue powered as a guardrail to the agreed tolerance, or ship as a staged rollout at a small share with a long-term holdback and automated guardrail monitoring, with an explicit rollback rule.</li>
      </ol>`,
      answer: `<p>My recommendation is <strong>not a straight ship</strong> on this evidence, and the reason is that a non-significant revenue reading is not evidence of no harm.</p>
      <ol>
        <li><strong>Get the revenue confidence interval.</strong> Revenue is high variance, so the test is probably underpowered on it. If the interval's lower bound implies a loss larger than we are willing to accept, the engagement win does not compensate. The right framing is non-inferiority: can we exclude a loss beyond an agreed tolerance?</li>
        <li><strong>Validate the engagement gain.</strong> Confirm through the funnel and session quality that +6% reflects genuine value rather than extra clicks caused by friction or a confusing layout.</li>
        <li><strong>Extend the horizon.</strong> Flat 7-day retention is inconclusive; quality damage typically surfaces at 28 days or beyond.</li>
        <li><strong>Path forward:</strong> either extend/rerun powered for the revenue guardrail, or approve a staged rollout at a small traffic share with a long-term holdback, automated guardrail alerts and a pre-agreed rollback rule.</li>
      </ol>
      <p>Underlying principle: the decision belongs to the pre-declared OEC and guardrail tolerances, not to whichever metric happened to reach significance.</p>`
    },
    {
      id: 'ab-h4',
      difficulty: 'hard',
      prompt: 'You only have enough traffic for a 2-week test but need to detect a 1% lift on a noisy metric. How do you increase sensitivity without extending the runtime?',
      hint: 'Variance reduction, better randomisation units, and trigger-based analysis.',
      concepts: [
        { label: 'CUPED / regression adjustment using pre-experiment covariates', any: ['cuped', 'covariate', 'regression adjust', 'pre experiment', 'pre period', 'control variate'], required: true },
        { label: 'Cap or winsorise outliers and consider transformed metrics', any: ['cap', 'winsor', 'outlier', 'clip', 'trim', 'transform', 'log'], required: true },
        { label: 'Trigger analysis: only analyse users who could actually be affected', any: ['trigger', 'exposed', 'eligible', 'affected users', 'dilut', 'only users who'], required: true },
        { label: 'Choose a more sensitive proxy metric closer to the change', any: ['proxy', 'surrogate', 'closer metric', 'sensitiv', 'leading indicator', 'funnel metric'], required: true },
        { label: 'Stratified sampling or post-stratification to remove known variation', any: ['stratif', 'block', 'post stratif', 'match'], required: true },
        { label: 'Use paired / within-user designs like switchback where valid', any: ['switchback', 'paired', 'within user', 'crossover', 'interleav'] },
        { label: 'Accept explicit trade-offs: relax alpha or reduce variants rather than fake precision', any: ['alpha', 'one sided', 'fewer variants', 'trade off', 'tradeoff', 'accept more risk', 'reduce arms'] }
      ],
      approach: `<p>Sensitivity has three levers: reduce variance, remove dilution, or change what you measure. Work through them in that order, and be honest that some options trade risk for speed.</p>
      <ol>
        <li><strong>Variance reduction (best value):</strong> apply CUPED, using each user's pre-experiment value of the same metric as a covariate. Because the pre-period is unaffected by treatment, the adjustment is unbiased, and for metrics with strong week-to-week correlation it commonly removes a large share of variance, which is equivalent to buying extra traffic for free. Regression adjustment on other pre-period covariates does the same job.</li>
        <li><strong>Tame the tail:</strong> pre-declare capping or winsorisation, since a handful of extreme users can dominate the variance of revenue-like metrics.</li>
        <li><strong>Remove dilution with trigger analysis:</strong> if only 20% of users ever reach the surface you changed, including the rest shrinks the effect fivefold. Analyse only triggered/eligible users, and then convert the triggered effect back to an overall impact for the business narrative.</li>
        <li><strong>Move the metric closer to the change:</strong> a step-level conversion is far less noisy than revenue per user. Use the sensitive proxy as primary and keep the business metric as a guardrail, stating the assumption that links them.</li>
        <li><strong>Design changes:</strong> stratify or post-stratify on strong predictors such as platform and tenure; drop unnecessary variants so all traffic goes into the comparison that matters; use within-user or switchback designs when the change is safe to alternate.</li>
        <li><strong>Explicit trade-offs, not hidden ones:</strong> if all of that is not enough, say so, and offer a documented choice: accept a higher &alpha;, accept lower power with a wider interval, or set a larger MDE. What you must not do is peek until significance appears.</li>
      </ol>`,
      answer: `<p>Increase sensitivity rather than runtime:</p>
      <ol>
        <li><strong>CUPED / regression adjustment</strong> with the pre-experiment value of the metric as a covariate. Unbiased, and typically the single biggest variance reduction available.</li>
        <li><strong>Cap or winsorise outliers</strong> (pre-declared) so a few extreme users stop driving the variance.</li>
        <li><strong>Trigger analysis:</strong> restrict to users actually exposed to the changed surface, which removes dilution, then translate back to overall impact for the business read.</li>
        <li><strong>Pick a more sensitive primary metric</strong> nearer the change (step conversion instead of revenue per user), keeping the business metric as a guardrail.</li>
        <li><strong>Stratify or post-stratify</strong> on platform, geography and tenure, and cut unnecessary variants so all traffic serves the key comparison.</li>
        <li><strong>Within-user or switchback designs</strong> where the change can safely alternate, since paired comparisons remove between-user variance.</li>
      </ol>
      <p>If the target is still out of reach, make the trade-off explicit: raise the MDE, accept a higher &alpha;, or accept lower power with a clearly reported interval. The one unacceptable option is monitoring until the p-value dips below 0.05.</p>`
    },
    {
      id: 'ab-h5',
      difficulty: 'hard',
      prompt: 'The overall test result is flat, but treatment wins on Android and loses on iOS by similar magnitudes. How do you investigate, and what do you recommend?',
      hint: 'Heterogeneous treatment effects, plus a check that the segmentation is legitimate and not just noise.',
      concepts: [
        { label: 'This is a heterogeneous treatment effect that cancels in the average', any: ['heterogen', 'cancel', 'offset', 'average hides', 'opposite direction', 'mask'], required: true },
        { label: 'Test the interaction formally rather than eyeballing two p-values', any: ['interaction', 'formal test', 'statistical test', 'significance of the difference', 'model'], required: true },
        { label: 'Verify the segment was pre-registered or treat it as exploratory', any: ['pre registered', 'pre declar', 'post hoc', 'exploratory', 'multiple compar', 'cherry pick'], required: true },
        { label: 'Look for a mechanism: platform-specific bug, UI rendering, latency, version coverage', any: ['bug', 'implementation', 'rendering', 'ui', 'latency', 'crash', 'version', 'mechanism', 'root cause'], required: true },
        { label: 'Check that platform segments are not confounded by user mix', any: ['confound', 'user mix', 'composition', 'demographic', 'different users', 'baseline differ'], required: true },
        { label: 'Recommend: fix and rerun, or platform-targeted rollout with a confirmatory test', any: ['fix', 'rerun', 'platform specific', 'ship on android', 'targeted rollout', 'confirmatory', 'follow up'], required: true }
      ],
      approach: `<p>Two competing explanations must be separated: a real platform-specific effect, or noise plus a post-hoc slice. Investigate mechanism before recommending anything.</p>
      <ol>
        <li><strong>Is the difference real?</strong> Do not compare two subgroup p-values. Fit a model with a treatment &times; platform interaction term and test that term. Two "significant in opposite directions" subgroups frequently fail a proper interaction test.</li>
        <li><strong>Was the slice legitimate?</strong> Platform is usually a pre-registered segmentation, which makes this credible. If it was discovered while scanning many cuts, apply multiple-comparison discipline and treat it as a hypothesis.</li>
        <li><strong>Hunt for a mechanism, because a real interaction almost always has one:</strong> check for an iOS-specific implementation defect, layout or rendering differences, added latency, crash or error rates by arm and platform, SDK/app-version coverage, and whether the feature even rendered correctly on iOS. Verify exposure counts per platform for a platform-level SRM.</li>
        <li><strong>Rule out confounding:</strong> iOS and Android populations differ in geography, income and tenure. Check whether the interaction survives controlling for user mix, or whether "iOS" is really a proxy for a different segment.</li>
        <li><strong>Recommendation, conditional on the finding:</strong> if it is an iOS bug, fix it and rerun, because the true effect is likely positive on both. If the interaction is real, well-powered and mechanistically explained, a platform-targeted rollout is legitimate: ship on Android, hold iOS, and run a confirmatory iOS-only test on a redesigned variant. If the interaction fails formal testing, the honest read is that the test is flat and needs more power, not a subgroup victory lap.</li>
      </ol>`,
      answer: `<p>The overall flat result is an average of opposing effects, so the first question is whether that split is real.</p>
      <ol>
        <li><strong>Test it formally:</strong> model the outcome with a treatment &times; platform interaction and test the interaction term, rather than comparing two subgroup p-values.</li>
        <li><strong>Check the provenance of the slice:</strong> platform is typically pre-registered and credible; if it was found by scanning many segments, correct for multiple comparisons and treat it as exploratory.</li>
        <li><strong>Find the mechanism:</strong> iOS-specific implementation defects, rendering or layout issues, latency, crashes, app-version coverage, and per-platform exposure counts for a platform-level SRM. A real interaction with no mechanism is usually noise.</li>
        <li><strong>Rule out confounding:</strong> confirm the effect is about the platform rather than about the different user mix each platform attracts.</li>
      </ol>
      <p><strong>Recommendation:</strong> if it is an iOS defect, fix and rerun. If the interaction is genuine, well powered and explained, ship to Android only and run a confirmatory iOS test on a revised design. If the interaction does not survive formal testing, report the experiment as flat and underpowered instead of claiming a subgroup win.</p>`
    }
  ]
});
