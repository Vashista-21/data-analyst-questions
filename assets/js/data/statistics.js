DAQ.registerTopic({
  id: 'statistics',
  name: 'Statistics & Probability',
  icon: '\uD83D\uDCC8',
  blurb: 'Distributions, CLT, confidence intervals, test selection, Bayes and the classic sampling traps.',
  questions: [
    /* ---------------------------- EASY ---------------------------- */
    {
      id: 'st-e1',
      difficulty: 'easy',
      prompt: 'When would you report the <strong>median</strong> instead of the <strong>mean</strong>? Give a concrete analytics example.',
      hint: 'Think about what a single extreme value does to each statistic.',
      concepts: [
        { label: 'The mean is sensitive to outliers and skew', any: ['outlier', 'skew', 'extreme', 'sensitive', 'pulled', 'distort'], required: true },
        { label: 'The median is robust because it depends on rank, not magnitude', any: ['robust', 'middle', 'rank', 'resistant', 'not affected', 'less affected'], required: true },
        { label: 'Use the median for skewed distributions like income, revenue or latency', any: ['income', 'salary', 'revenue', 'latency', 'price', 'house', 'session'], required: true },
        { label: 'Use the mean when the distribution is symmetric or when totals matter', any: ['symmetric', 'normal', 'total', 'sum', 'additive', 'aggregate'] },
        { label: 'Reporting both, or percentiles, is often the right answer', any: ['both', 'percentile', 'p90', 'p95', 'distribution', 'histogram', 'quartile'] }
      ],
      approach: `<p>Answer with the mechanism first, then a business example, then the practical recommendation.</p>
      <ol>
        <li>The mean uses every value's magnitude, so one extreme observation drags it. The median only cares about ordering, so it barely moves.</li>
        <li>Any heavy-tailed metric therefore needs the median: income, order value, session duration, API latency, house prices.</li>
        <li>The mean is still correct when the distribution is roughly symmetric, and it is necessary whenever the metric must be additive: total revenue is mean &times; count, and medians do not aggregate that way.</li>
        <li>Best practice in real reporting is to show both, plus percentiles. Latency dashboards use p50, p95 and p99 precisely because the mean hides the tail that users actually complain about.</li>
      </ol>`,
      answer: `<p>Use the <strong>median</strong> when the distribution is skewed or contains outliers, because it is rank-based and robust. Use the <strong>mean</strong> when the distribution is roughly symmetric, or when you need an additive quantity such as total revenue.</p>
      <p>Example: if 99 users spend ₹500 and one spends ₹5,00,000, the mean spend is about ₹5,500 and describes nobody, while the median stays at ₹500 and describes typical behaviour. For capacity planning on latency you would report p50 and p95 rather than the mean, since the mean can look healthy while 5% of requests time out.</p>`
    },
    {
      id: 'st-e2',
      difficulty: 'easy',
      prompt: 'Explain variance and standard deviation, and why analysts usually quote the standard deviation.',
      hint: 'What are the units of each?',
      concepts: [
        { label: 'Variance is the average squared deviation from the mean', any: ['squared', 'square', 'average of', 'deviation', 'mean'], required: true },
        { label: 'Standard deviation is the square root of the variance', any: ['square root', 'root', 'sqrt'], required: true },
        { label: 'Standard deviation is in the same units as the data, so it is interpretable', any: ['same unit', 'unit', 'interpret', 'original scale', 'rupees', 'comparable'], required: true },
        { label: 'Both measure spread / dispersion around the centre', any: ['spread', 'dispersion', 'variability', 'deviation', 'how far', 'scatter'], required: true },
        { label: 'Variance is additive for independent variables, which is why the maths uses it', any: ['additive', 'add', 'independent', 'sum of variance', 'maths', 'math'] }
      ],
      approach: `<p>Define both, then explain the division of labour: variance for mathematics, standard deviation for communication.</p>
      <ol>
        <li>Variance is the mean of squared deviations from the mean. Squaring removes signs so deviations do not cancel, but it also squares the units: revenue in rupees gives a variance in rupees squared, which is meaningless to a stakeholder.</li>
        <li>Standard deviation is the square root, which restores the original units. "Average order value is ₹800 with a standard deviation of ₹200" is immediately interpretable.</li>
        <li>Variance survives in the mathematics because it is additive for independent variables, which is what makes standard error, ANOVA and power calculations work.</li>
        <li>Mention the sample-versus-population detail: dividing by n&minus;1 (Bessel's correction) makes the sample variance an unbiased estimator.</li>
      </ol>`,
      answer: `<p><strong>Variance</strong> = average squared deviation from the mean. <strong>Standard deviation</strong> = its square root.</p>
      <p>Analysts quote the standard deviation because it is expressed in the same units as the data and can be read directly against the mean, whereas variance is in squared units. Variance remains the working quantity in statistics because variances of independent variables add, which underpins standard errors and power calculations. For samples, divide by n&minus;1 rather than n so the estimate is unbiased.</p>`
    },
    {
      id: 'st-e3',
      difficulty: 'easy',
      prompt: 'What is a normal distribution, what does the 68-95-99.7 rule say, and how would you check whether your data is normal?',
      hint: 'Sigma bands, plus a visual check before any formal test.',
      concepts: [
        { label: 'Symmetric bell-shaped distribution defined by mean and standard deviation', any: ['bell', 'symmetric', 'mean and standard', 'two parameter', 'gaussian'], required: true },
        { label: 'Mean = median = mode at the centre', any: ['mean median', 'median mode', 'same', 'centre', 'center', 'equal'] },
        { label: '68% within 1 sd, 95% within 2 sd, 99.7% within 3 sd', any: ['68', '95', '99.7', 'sigma', 'standard deviation'], required: true },
        { label: 'Check visually with a histogram and a Q-Q plot', any: ['histogram', 'q q', 'qq', 'plot', 'visual', 'chart'], required: true },
        { label: 'Formal tests exist (Shapiro-Wilk, Kolmogorov-Smirnov) but are over-sensitive at large n', any: ['shapiro', 'kolmogorov', 'anderson', 'formal test', 'sensitive', 'large sample'] },
        { label: 'Check skewness and kurtosis as summary diagnostics', any: ['skew', 'kurtosis'] }
      ],
      approach: `<p>Define, quantify, then diagnose. The diagnosis step is what interviewers actually probe.</p>
      <ol>
        <li>The normal distribution is symmetric and bell-shaped, fully described by its mean and standard deviation, with mean = median = mode.</li>
        <li>The empirical rule: roughly 68% of observations lie within &plusmn;1&sigma;, 95% within &plusmn;2&sigma; and 99.7% within &plusmn;3&sigma;. This is why 3&sigma; is a common outlier and control-chart threshold.</li>
        <li>To check normality, start visually: a histogram for shape and a Q-Q plot, which is far more informative because deviations at the tails show up as departures from the diagonal.</li>
        <li>Formal tests like Shapiro&ndash;Wilk work at small n but reject almost everything at large n because they detect trivial deviations, so treat them as one input rather than a verdict.</li>
        <li>Close with the practical point: most analyst methods need the sampling distribution of the mean to be normal, not the raw data, and the CLT usually delivers that at large n.</li>
      </ol>`,
      answer: `<p>A normal distribution is a symmetric bell curve fully specified by its mean and standard deviation, with mean = median = mode. Under the <strong>68-95-99.7 rule</strong>, about 68%, 95% and 99.7% of values fall within one, two and three standard deviations of the mean.</p>
      <p>To assess normality: plot a histogram, then a Q-Q plot (the most useful single check, since tail departures are obvious), and look at skewness and kurtosis. Shapiro&ndash;Wilk or Kolmogorov&ndash;Smirnov can supplement, but at large n they flag immaterial deviations, so they should not override the visual read. Note that for inference about means, what matters is the normality of the sampling distribution, which the CLT provides at sufficient sample size.</p>`
    },
    {
      id: 'st-e4',
      difficulty: 'easy',
      prompt: 'Ice cream sales and drowning deaths are strongly correlated. Explain what is happening and what you would need to establish causation.',
      hint: 'Name the third variable, then list what an experiment gives you that observational data does not.',
      concepts: [
        { label: 'Correlation does not imply causation', any: ['correlation does not', 'not causation', 'not causal', 'no causation', 'neither cause', 'common cause', 'does not cause'], required: true },
        { label: 'A confounder (temperature / summer) drives both', any: ['confound', 'temperature', 'summer', 'season', 'weather', 'third variable', 'lurking'], required: true },
        { label: 'Other explanations: reverse causality, selection bias, coincidence', any: ['reverse', 'selection', 'coincidence', 'spurious', 'chance'], required: true },
        { label: 'A randomised experiment establishes causation', any: ['random', 'experiment', 'a b test', 'rct', 'controlled trial'], required: true },
        { label: 'If experimentation is impossible, use quasi-experimental methods', any: ['quasi', 'difference in difference', 'instrumental', 'regression discontinuity', 'matching', 'propensity', 'causal inference', 'control for'] }
      ],
      approach: `<p>Identify the confounder immediately, then generalise to a checklist, then say how you would prove causation.</p>
      <ol>
        <li>The confounder is temperature. Hot weather increases both ice cream consumption and swimming, and swimming causes drownings. Ice cream and drowning are both effects of a common cause.</li>
        <li>Generalise: a correlation can arise from a confounder, reverse causality, selection bias in how the data was collected, or pure chance when you test enough pairs of variables.</li>
        <li>The gold standard for causation is randomisation, because it breaks the link between treatment and every confounder, observed or not.</li>
        <li>When you cannot randomise, use quasi-experimental designs: difference-in-differences, instrumental variables, regression discontinuity, or matching on observed covariates. Be explicit that these rest on assumptions that must be argued, not assumed.</li>
        <li>Bonus credit for mentioning supporting criteria: a plausible mechanism, correct temporal order, and a dose-response relationship.</li>
      </ol>`,
      answer: `<p>Temperature is the confounder: hot weather independently raises ice cream sales and swimming activity, and swimming causes drownings. The two outcomes share a common cause, so neither causes the other.</p>
      <p>In general, a correlation can be produced by a confounder, reverse causality, selection bias, or coincidence from testing many variable pairs. To establish causation you want a <strong>randomised experiment</strong>, since randomisation balances all confounders. Where randomisation is impossible, use quasi-experimental methods (difference-in-differences, instrumental variables, regression discontinuity, matching) and state their assumptions, supported by a plausible mechanism, correct time ordering and a dose-response pattern.</p>`
    },
    {
      id: 'st-e5',
      difficulty: 'easy',
      prompt: 'You need to survey 2,000 users out of 5 million. Compare simple random, stratified and convenience sampling, and say which you would choose.',
      hint: 'Which method guarantees small but important segments are represented?',
      concepts: [
        { label: 'Simple random sampling gives every user an equal chance', any: ['equal chance', 'random', 'equally likely', 'simple random'], required: true },
        { label: 'Stratified sampling divides the population into strata and samples within each', any: ['stratif', 'strata', 'subgroup', 'segment', 'layer'], required: true },
        { label: 'Stratification guarantees representation of small but important segments', any: ['small segment', 'representation', 'guarantee', 'minority', 'rare', 'underrepresent', 'ensure'], required: true },
        { label: 'Convenience sampling is biased and not generalisable', any: ['convenience', 'bias', 'not generalis', 'not generaliz', 'unrepresentative', 'self select'], required: true },
        { label: 'Stratified sampling also reduces variance for the same sample size', any: ['variance', 'precision', 'efficient', 'lower error', 'tighter'] },
        { label: 'Watch out for non-response bias whichever method you use', any: ['non response', 'nonresponse', 'response rate', 'who answers', 'refus', 'survivor'] }
      ],
      approach: `<p>Compare the three on bias and precision, then commit to one with a reason tied to the business question.</p>
      <ol>
        <li><strong>Simple random:</strong> unbiased and easy to analyse, but with 2,000 out of 5 million a segment that is 1% of users appears only about 20 times, which is too thin to analyse.</li>
        <li><strong>Stratified:</strong> split the population on variables that matter (plan tier, platform, geography, tenure), then sample within each stratum. You can allocate proportionally, or oversample small strata and reweight afterwards. This guarantees coverage and reduces variance when strata differ from each other.</li>
        <li><strong>Convenience:</strong> whoever is easiest to reach, such as an in-app banner shown to today's active users. Cheap but biased toward engaged users, which is fatal if the question is about churn or dissatisfaction.</li>
        <li><strong>Choice:</strong> stratified, with proportional allocation for headline numbers and oversampling of key small segments, then weight back to population shares.</li>
        <li>Close on the risk that dominates real surveys: non-response bias. Even a perfect sampling frame is undone if only enthusiasts respond, so plan for follow-ups and compare respondent profiles against the population.</li>
      </ol>`,
      answer: `<p><strong>Simple random:</strong> every user equally likely; unbiased but small segments get too few observations at n = 2,000. <strong>Stratified:</strong> partition by meaningful variables and sample within each stratum; guarantees representation and reduces variance. <strong>Convenience:</strong> easiest-to-reach users; cheap and systematically biased toward engaged users.</p>
      <p>I would use <strong>stratified sampling</strong> on plan tier, platform, geography and tenure, allocating proportionally for headline estimates and oversampling small-but-important strata, then reweighting to population shares. Whatever the design, I would monitor non-response bias by comparing respondent composition against the population, since that is usually a bigger threat to validity than the sampling method itself.</p>`
    },

    /* --------------------------- MEDIUM --------------------------- */
    {
      id: 'st-m1',
      difficulty: 'medium',
      prompt: 'State the Central Limit Theorem and explain why it lets you run a t-test on heavily skewed revenue data.',
      hint: 'The CLT is about the distribution of the sample mean, not the data.',
      concepts: [
        { label: 'The sampling distribution of the mean approaches normal as n grows', any: ['sampling distribution', 'distribution of the mean', 'sample mean', 'approaches normal', 'becomes normal', 'tends to normal'], required: true },
        { label: 'It holds regardless of the shape of the underlying population', any: ['regardless', 'any distribution', 'whatever the', 'population shape', 'even if skewed', 'not normal'], required: true },
        { label: 'Standard error shrinks as sigma over root n', any: ['standard error', 'root n', 'sqrt', 'square root of n', 'divided by'], required: true },
        { label: 'Inference is about the mean, so the raw data need not be normal', any: ['not the raw data', 'about the mean', 'concerns the mean', 'of the mean', 'individual', 'inference', 'do not need', 'need not'], required: true },
        { label: 'Heavier skew needs a larger n before the approximation holds', any: ['larger n', 'larger the n', 'heavier the tail', 'heavy tail', 'more data', 'depends on n', 'skew requires', 'bigger sample', 'slower'], required: true },
        { label: 'Requires independent observations and finite variance', any: ['independent', 'iid', 'finite variance', 'assumption'] }
      ],
      approach: `<p>The core insight to communicate is that the CLT is a statement about a <em>statistic</em>, not about the data.</p>
      <ol>
        <li><strong>Statement:</strong> for independent observations with finite variance, the distribution of the sample mean tends to a normal distribution with mean &mu; and standard deviation &sigma;/&radic;n as n increases, whatever the shape of the population.</li>
        <li><strong>Why it rescues the t-test:</strong> the t-test's assumption is normality of the sampling distribution of the mean (or of the difference in means), not of individual observations. Revenue per user can be violently skewed while the mean of 50,000 users is very close to normal.</li>
        <li><strong>The caveat that earns credit:</strong> convergence speed depends on skew and kurtosis. Mildly skewed data may need only n &asymp; 30&ndash;50; revenue with a whale tail may need tens of thousands, and if a single user can move the mean noticeably, the approximation is not safe.</li>
        <li><strong>Practical response:</strong> cap or winsorise the tail, bootstrap the confidence interval to avoid relying on the approximation, and check the two arms' variances rather than assuming equality (use Welch's t-test by default).</li>
      </ol>`,
      answer: `<p><strong>CLT:</strong> for independent draws with finite variance, the sampling distribution of the sample mean converges to a normal distribution with standard error &sigma;/&radic;n, regardless of the population's shape.</p>
      <p>A t-test on skewed revenue is therefore valid at large n because the test concerns the <em>mean</em>, whose sampling distribution is approximately normal even though individual revenues are not. The caveat is convergence speed: the heavier the tail, the larger the n required, and if one user can visibly shift the mean, the approximation is unreliable. In that case winsorise the tail, use a bootstrap confidence interval, and prefer Welch's t-test so unequal variances are handled correctly.</p>`
    },
    {
      id: 'st-m2',
      difficulty: 'medium',
      prompt: 'Your model estimates a 3.2% lift with a 95% confidence interval of [&minus;0.4%, 6.8%]. Interpret this precisely for a business stakeholder.',
      hint: 'The interval crosses zero, and there is a right and wrong way to describe what 95% refers to.',
      concepts: [
        { label: 'The interval includes zero, so the result is not statistically significant at 5%', any: ['includes zero', 'contains zero', 'crosses zero', 'not significant', 'cannot rule out no effect'], required: true },
        { label: 'Correct frequentist reading: 95% of such intervals would contain the true value', any: ['95 of such', 'repeated', 'long run', 'procedure', 'if we repeated', 'would contain'], required: true },
        { label: 'It is not a 95% probability that the true value is in this interval', any: ['not a 95 probability', 'not the probability', 'common misinterpret', 'incorrect to say', 'is not'], required: true },
        { label: 'The plausible range spans a small loss to a meaningful gain', any: ['range', 'plausible', 'could be', 'from a loss', 'as low as', 'as high as'], required: true },
        { label: 'The decision depends on whether the downside is tolerable, not only on significance', any: ['decision', 'tolerable', 'downside', 'risk', 'business', 'cost', 'worth'], required: true },
        { label: 'A wider interval signals insufficient sample size / power', any: ['wide', 'more data', 'sample size', 'power', 'underpower', 'precision'], required: true }
      ],
      approach: `<p>Give the technically correct interpretation, then translate it into the decision the stakeholder actually faces.</p>
      <ol>
        <li><strong>Point estimate:</strong> our best single estimate is a 3.2% lift.</li>
        <li><strong>Range:</strong> the data are consistent with anything from a 0.4% decline to a 6.8% gain. Because zero is inside the interval, we cannot reject "no effect" at the 5% level.</li>
        <li><strong>Precise meaning of 95%:</strong> it describes the procedure. If we repeated this experiment many times and built an interval each time, about 95% of those intervals would contain the true effect. It is not a 95% probability statement about this particular interval, which is a Bayesian claim requiring a prior.</li>
        <li><strong>Business translation:</strong> the upside is meaningful and the downside is small. If a 0.4% decline is affordable and the change is cheap and reversible, shipping can be rational despite non-significance. If the metric is revenue at scale, that downside may be unacceptable.</li>
        <li><strong>What to do:</strong> the interval is wide relative to the effect, which means the test is underpowered. Collect more data to tighten it, or reduce variance, rather than declaring victory on the 3.2% point estimate.</li>
      </ol>`,
      answer: `<p>Our best estimate is a <strong>3.2% lift</strong>, and the data are consistent with anywhere between a <strong>0.4% decline and a 6.8% gain</strong>. Since the interval contains zero, the result is not statistically significant at the 5% level: we cannot rule out that the true effect is nothing.</p>
      <p>Technically, the 95% refers to the method, not this interval: if the experiment were repeated many times, about 95% of the intervals constructed this way would contain the true effect. It is incorrect to say there is a 95% probability the true lift lies in this particular range.</p>
      <p>For the decision: the plausible downside is small and the upside is material, so a cheap and reversible change may still be worth shipping, while a revenue-critical change is not. Either way the interval is wide, which means we are underpowered and should extend the test or reduce variance rather than treating 3.2% as established.</p>`
    },
    {
      id: 'st-m3',
      difficulty: 'medium',
      prompt: 'You must compare a metric across four groups. Explain how you choose the right statistical test, and why running six pairwise t-tests is a problem.',
      hint: 'Metric type, number of groups, paired or not, then the multiple comparison issue.',
      concepts: [
        { label: 'Choice depends on the metric type: continuous versus categorical', any: ['continuous', 'categorical', 'proportion', 'metric type', 'numeric', 'binary'], required: true },
        { label: 'ANOVA (or Kruskal-Wallis) compares means across more than two groups', any: ['anova', 'kruskal', 'f test'], required: true },
        { label: 'Chi-square test for categorical / proportion comparisons', any: ['chi square', 'chi squared', 'chi2', 'proportion test', 'z test for proportion'], required: true },
        { label: 'Paired versus independent samples changes the test', any: ['paired', 'independent', 'repeated measure', 'same users', 'within'], required: true },
        { label: 'Six pairwise tests inflate the family-wise error rate', any: ['family wise', 'inflate', 'multiple compar', 'false positive', 'error rate', '26'], required: true },
        { label: 'Follow a significant ANOVA with corrected post-hoc tests (Tukey, Bonferroni)', any: ['post hoc', 'tukey', 'bonferroni', 'correct', 'adjust', 'holm'], required: true },
        { label: 'Check assumptions: normality of residuals, equal variance, independence', any: ['assumption', 'normality', 'equal variance', 'homogeneity', 'levene', 'independence', 'welch'] }
      ],
      approach: `<p>Give a decision rule, then handle the multiple-comparison trap quantitatively.</p>
      <ol>
        <li><strong>Decision rule.</strong> Continuous metric, 2 independent groups &rarr; Welch's t-test. Continuous, more than 2 groups &rarr; one-way ANOVA, or Kruskal&ndash;Wallis if assumptions fail badly. Categorical or proportions &rarr; chi-square test of independence, or a z-test for two proportions. Same users measured repeatedly &rarr; paired t-test or repeated-measures ANOVA.</li>
        <li><strong>Why not six t-tests:</strong> with 4 groups there are 6 pairs. At &alpha; = 0.05 each, the chance of at least one false positive is 1 &minus; 0.95<sup>6</sup> &asymp; 26%, so you are five times more likely than advertised to find a spurious difference.</li>
        <li><strong>Correct sequence:</strong> run the omnibus ANOVA first to ask "is there any difference at all?", and only if it is significant proceed to post-hoc pairwise comparisons with Tukey's HSD, Holm or Bonferroni, which control the family-wise error rate.</li>
        <li><strong>Check assumptions:</strong> ANOVA assumes independent observations, roughly normal residuals and comparable variances. Use Levene's test or a residual plot; if variances differ, use Welch's ANOVA.</li>
        <li>Finish with the practical point: report effect sizes and intervals per group, since with large n a significant ANOVA can reflect a difference too small to act on.</li>
      </ol>`,
      answer: `<p><strong>Test selection:</strong> continuous metric with 2 groups &rarr; Welch's t-test; continuous with 4 groups &rarr; one-way ANOVA (Kruskal&ndash;Wallis if assumptions fail); proportions &rarr; chi-square or two-proportion z-test; repeated measurements on the same users &rarr; paired t-test or repeated-measures ANOVA.</p>
      <p><strong>Why six pairwise t-tests fail:</strong> 4 groups give 6 pairs, and at &alpha; = 0.05 each the family-wise false positive probability is 1 &minus; 0.95<sup>6</sup> &asymp; 26%. The nominal 5% guarantee no longer holds.</p>
      <p><strong>Correct approach:</strong> run the omnibus ANOVA, and only on a significant result proceed to post-hoc comparisons with Tukey HSD, Holm or Bonferroni. Verify independence, residual normality and variance homogeneity (Welch's ANOVA when variances differ), and report effect sizes alongside p-values so statistically significant but trivial differences are not over-read.</p>`
    },
    {
      id: 'st-m4',
      difficulty: 'medium',
      prompt: 'A test for a disease is 99% accurate. The disease affects 1 in 1,000 people. A random person tests positive. What is the probability they have the disease, and what is the lesson?',
      hint: 'Work with counts on a population of 100,000 rather than juggling formulas.',
      concepts: [
        { label: 'Apply Bayes theorem / condition on the positive test', any: ['bayes', 'conditional', 'posterior', 'p a given b', 'given a positive'], required: true },
        { label: 'Use the base rate of 1 in 1000 (prior probability)', any: ['base rate', 'prior', '1 in 1000', '0.1', 'prevalence'], required: true },
        { label: 'False positives from the healthy majority dominate the positives', any: ['false positive', 'healthy', 'dominate', 'more false', '999', 'majority'], required: true },
        { label: 'Answer is roughly 9-10%, far lower than intuition suggests', any: ['9', '10', '0.09', '0.1', 'roughly 9', 'about 10'], required: true },
        { label: 'Lesson: with a rare condition, precision is low even with an accurate test', any: ['rare', 'base rate fallacy', 'precision', 'lesson', 'intuition', 'low prevalence'], required: true },
        { label: 'Practical fix: retest, or use a second independent confirmatory test', any: ['retest', 'second test', 'confirm', 'follow up', 'sequential'] }
      ],
      approach: `<p>Do it with counts on a concrete population, which is faster and much clearer to explain out loud than the formula.</p>
      <ol>
        <li>Take 100,000 people. Prevalence 1/1,000 means 100 are sick and 99,900 are healthy.</li>
        <li>Of the 100 sick, a 99% sensitive test flags 99 as positive.</li>
        <li>Of the 99,900 healthy, a 1% false positive rate flags 999 as positive.</li>
        <li>Total positives = 99 + 999 = 1,098, of whom 99 are genuinely sick.</li>
        <li>P(disease | positive) = 99 / 1,098 &asymp; <strong>9%</strong>.</li>
      </ol>
      <p>The lesson is the <strong>base rate fallacy</strong>: when a condition is rare, the healthy population is so much larger that its false positives swamp the true positives, so a highly accurate test still yields low precision. Practically, this is why screening programmes retest positives with a second, independent test: the posterior from the first test becomes the prior for the second, which pushes the probability up sharply.</p>
      <p>The same arithmetic applies directly to analytics work: fraud models, anomaly alerts and churn flags on rare events all produce mostly false alarms unless precision is designed for explicitly.</p>`,
      answer: `<p><strong>&asymp; 9%.</strong></p>
      <pre>Population              100,000
Sick (1 in 1,000)           100  -> 99 test positive   (99% sensitivity)
Healthy                  99,900  -> 999 test positive  (1% false positive)
Total positives           1,098
P(sick | positive) = 99 / 1,098 = 9.0%</pre>
      <p>The lesson is the base rate fallacy: with a rare condition, false positives drawn from the huge healthy group outnumber true positives, so even a 99% accurate test has low precision. The remedy is a second independent confirmatory test, which uses the first result's posterior as its prior. The identical logic governs fraud detection, anomaly alerting and any rare-event model in analytics.</p>`
    },
    {
      id: 'st-m5',
      difficulty: 'medium',
      prompt: 'A hotel chain finds that guests who use the mobile app have 30% higher lifetime value. Marketing wants to push app installs to raise LTV. What is wrong with this reasoning?',
      hint: 'Who chooses to install an app?',
      concepts: [
        { label: 'Selection bias: engaged, loyal guests self-select into the app', any: ['selection', 'self select', 'engaged', 'loyal', 'already', 'who choose'], required: true },
        { label: 'Reverse causality: high value causes app use, not the other way round', any: ['reverse', 'other way', 'causality direction', 'because they', 'high value users'], required: true },
        { label: 'Correlation is confounded by frequency / tenure / segment', any: ['confound', 'frequency', 'tenure', 'business travel', 'segment', 'third variable'], required: true },
        { label: 'Test it with a randomised experiment / encouragement design', any: ['random', 'experiment', 'a b test', 'rct', 'encouragement', 'randomised', 'randomized'], required: true },
        { label: 'Or use quasi-experimental methods with pre-period matching', any: ['matching', 'propensity', 'difference in difference', 'pre period', 'control for', 'quasi'], required: true },
        { label: 'The relevant quantity is incremental LTV from installing, not the LTV gap', any: ['incremental', 'causal effect', 'uplift', 'lift', 'true effect', 'not the gap'], required: true }
      ],
      approach: `<p>Name the bias, argue the direction of causality, then propose a design that would actually answer the question.</p>
      <ol>
        <li><strong>The comparison is between different kinds of guests, not different treatments.</strong> Guests who install a loyalty app tend to be frequent travellers who were already high value. The 30% gap largely reflects who they were before the app.</li>
        <li><strong>Reverse causality is plausible:</strong> repeat visits create the motivation to install, so high LTV causes installation rather than the reverse.</li>
        <li><strong>Confounders:</strong> tenure, trip frequency, business versus leisure, city, and loyalty-tier membership all correlate with both app use and spend.</li>
        <li><strong>What would settle it:</strong> a randomised encouragement design. Randomly select guests to receive an app-install prompt and compare LTV across the randomised groups, not across installers versus non-installers. That measures the causal effect of the intervention marketing can actually deploy.</li>
        <li><strong>If randomisation is unavailable:</strong> match installers to similar non-installers on pre-install behaviour (bookings, spend, tenure) and use difference-in-differences around the install date. The pre-period check is essential: if the two groups already diverged before installation, the gap is selection, not effect.</li>
        <li><strong>Reframe the ask:</strong> the decision needs incremental LTV per induced install versus the cost of driving installs, not the raw LTV difference.</li>
      </ol>`,
      answer: `<p>The 30% gap is almost certainly selection bias plus reverse causality rather than a causal effect. Guests who install a hotel app are disproportionately frequent, loyal, high-value travellers, and it is their existing behaviour that drives both the install and the spend. Tenure, trip frequency and traveller type confound the comparison.</p>
      <p>To answer the actual question, run a <strong>randomised encouragement experiment</strong>: randomise who receives an install prompt and compare outcomes between the randomised groups. Where that is impossible, match installers to statistically similar non-installers on pre-install behaviour and apply difference-in-differences around the install date, verifying that the groups tracked each other <em>before</em> installation.</p>
      <p>The number marketing needs is incremental LTV per induced install measured against acquisition cost, not the observational LTV gap.</p>`
    },

    /* ---------------------------- HARD ---------------------------- */
    {
      id: 'st-h1',
      difficulty: 'hard',
      prompt: 'A new landing page has a higher conversion rate than the old one on desktop and on mobile separately, but a lower overall conversion rate. Explain how this is possible and what you would report.',
      hint: 'Look at how traffic mix differs between the variants.',
      concepts: [
        { label: 'This is Simpson\'s paradox', any: ['simpson'], required: true },
        { label: 'Caused by different traffic composition / weighting across segments', any: ['composition', 'mix', 'weight', 'proportion of traffic', 'distribution of', 'more mobile', 'unequal split'], required: true },
        { label: 'Segments have very different baseline conversion rates', any: ['baseline', 'different rate', 'desktop converts', 'mobile converts', 'lower converting', 'segment rate'], required: true },
        { label: 'Unequal segment allocation between variants indicates a randomisation or SRM problem', any: ['randomis', 'randomiz', 'srm', 'sample ratio', 'allocation', 'assignment', 'bug'], required: true },
        { label: 'Fix by stratifying / computing a weighted or segment-adjusted estimate', any: ['stratif', 'weighted', 'adjust', 'post stratif', 'control for', 'standardis', 'standardiz'], required: true },
        { label: 'Report the segment-level results with the reason for the aggregate reversal', any: ['report both', 'segment level', 'explain', 'transparen', 'per segment'], required: true }
      ],
      approach: `<p>Explain the mechanism with numbers, then diagnose it as a design defect rather than a statistical curiosity.</p>
      <ol>
        <li><strong>Mechanism:</strong> desktop converts far better than mobile. If the new page received a much larger share of mobile traffic, its aggregate rate is dragged down by the mix even though it beats the old page within each device. The aggregate is a weighted average, and the weights differ.</li>
        <li><strong>Concrete illustration:</strong> Old page: desktop 100/1,000 = 10%, mobile 20/1,000 = 2%, overall 120/2,000 = 6%. New page: desktop 33/300 = 11%, mobile 51/1,700 = 3%, overall 84/2,000 = 4.2%. Better on both devices, worse overall.</li>
        <li><strong>Diagnosis:</strong> in a properly randomised experiment, device mix should be nearly identical across arms. A large imbalance is a red flag for a sample ratio mismatch, a device-dependent redirect, or a bug in assignment. That is now the primary investigation.</li>
        <li><strong>Correct estimate:</strong> compute the effect within each stratum and combine with fixed weights (the overall population device mix), which is post-stratification/standardisation. That removes the mix effect and gives the answer to "what happens if we ship this to everyone?"</li>
        <li><strong>Reporting:</strong> lead with the segment-level results and the weighted overall estimate, and explicitly explain why the naive aggregate reverses, so nobody in the room quotes the misleading number later.</li>
      </ol>`,
      answer: `<p>This is <strong>Simpson's paradox</strong>: the aggregate rate is a traffic-weighted average, and the variants received different traffic mixes. Desktop converts much better than mobile, so a variant loaded with mobile traffic can win within every device and still lose overall.</p>
      <pre>Old: desktop 100/1,000 = 10%   mobile 20/1,000 = 2%   overall 120/2,000 = 6.0%
New: desktop  33/  300 = 11%   mobile 51/1,700 = 3%   overall  84/2,000 = 4.2%</pre>
      <p>Because randomisation should have produced near-identical device mixes, the imbalance itself is the headline finding: I would check for a sample ratio mismatch, a device-specific redirect or an assignment bug before trusting any lift.</p>
      <p>For reporting, present the segment-level results plus a post-stratified estimate that reweights both variants to the population device mix, and state plainly why the unadjusted aggregate reverses.</p>`
    },
    {
      id: 'st-h2',
      difficulty: 'hard',
      prompt: 'You fit a linear regression of revenue on marketing spend across channels and get a large negative coefficient on TV spend, which contradicts the business. How do you diagnose it?',
      hint: 'Correlated predictors, omitted variables and reverse causality all produce sign flips.',
      concepts: [
        { label: 'Multicollinearity between channels destabilises coefficients; check VIF', any: ['multicollinear', 'collinear', 'vif', 'correlated predictor', 'correlated feature'], required: true },
        { label: 'Coefficients are partial effects, conditional on the other predictors', any: ['partial', 'holding', 'controlling for', 'conditional', 'all else equal', 'ceteris'], required: true },
        { label: 'Omitted variable bias: seasonality, promotions, price, competitor activity', any: ['omitted', 'confound', 'seasonal', 'promotion', 'price', 'competitor', 'missing variable'], required: true },
        { label: 'Reverse causality / endogeneity: budgets are set based on expected revenue', any: ['reverse', 'endogen', 'budget is set', 'simultaneity', 'feedback', 'decided based'], required: true },
        { label: 'Adstock / lag effects mean TV impact is delayed, not same-period', any: ['adstock', 'lag', 'carryover', 'delayed', 'decay', 'time shift'], required: true },
        { label: 'Check residuals, outliers, influential points and functional form', any: ['residual', 'outlier', 'influential', 'leverage', 'non linear', 'log', 'diminishing', 'saturation'], required: true },
        { label: 'Remedies: regularisation, aggregation, MMM structure, or a geo experiment', any: ['ridge', 'regularis', 'regulariz', 'lasso', 'mmm', 'media mix', 'geo experiment', 'holdout', 'incrementality'], required: true }
      ],
      approach: `<p>Treat a nonsensical sign as a diagnostic signal about the model, and work from data quality outward to identification.</p>
      <ol>
        <li><strong>Multicollinearity first.</strong> Marketing channels move together because budgets rise and fall as a block. With highly correlated predictors, coefficients become unstable and can flip sign while overall fit stays good. Compute VIFs and inspect the correlation matrix; VIF above 5&ndash;10 makes individual coefficients uninterpretable.</li>
        <li><strong>Remember what the coefficient means.</strong> It is the partial effect of TV holding all other channels constant, which may be a region of the data that barely exists if TV and digital always move together.</li>
        <li><strong>Omitted variables.</strong> Seasonality, promotions, pricing, distribution and competitor spend drive revenue and correlate with media plans. Leaving them out loads their effect onto whichever channel correlates with them.</li>
        <li><strong>Reverse causality.</strong> Budgets are often cut in strong periods and raised in weak ones, or set as a share of expected revenue, which mechanically induces negative correlation.</li>
        <li><strong>Dynamics and shape.</strong> TV works with a lag and carryover, so a same-period specification is misspecified. Use adstock transformations, and model diminishing returns with a log or saturation curve rather than assuming linearity.</li>
        <li><strong>Data mechanics.</strong> Plot residuals, look for influential points via Cook's distance, check for a few unusual campaign weeks driving the coefficient, and confirm the aggregation level and units are consistent.</li>
        <li><strong>Remedies and the honest conclusion.</strong> Use regularisation or a properly specified media-mix model with adstock, saturation and control variables, and validate out of sample. Most importantly, observational spend data usually cannot identify channel-level causal effects; the credible answer is a geo-based holdout experiment measuring incrementality directly.</li>
      </ol>`,
      answer: `<p>A sign that contradicts the business is a model diagnosis problem, not a finding. My sequence:</p>
      <ol>
        <li><strong>Multicollinearity:</strong> channels move together, so check VIF and the correlation matrix. High collinearity makes individual coefficients unstable and prone to sign flips even with good overall fit.</li>
        <li><strong>Interpretation:</strong> the coefficient is TV's effect <em>holding other channels fixed</em>, a scenario that may hardly exist in the data.</li>
        <li><strong>Omitted variables:</strong> add seasonality, promotions, price, distribution and competitor activity, since their effect otherwise loads onto correlated channels.</li>
        <li><strong>Endogeneity:</strong> budgets are frequently set in response to expected or observed revenue, which can induce a negative relationship mechanically.</li>
        <li><strong>Dynamics:</strong> apply adstock/carryover transforms and a saturation (log or Hill) curve, because TV's effect is lagged and non-linear.</li>
        <li><strong>Diagnostics:</strong> residual plots, Cook's distance for influential campaign periods, and consistency of units and aggregation.</li>
      </ol>
      <p>Remedies are regularisation and a properly specified media-mix model with out-of-sample validation, but the honest conclusion is that observational spend data rarely identifies causal channel effects. To answer the business question I would run a <strong>geo holdout experiment</strong> and measure TV incrementality directly.</p>`
    },
    {
      id: 'st-h3',
      difficulty: 'hard',
      prompt: 'Explain the bias-variance tradeoff, and how you would tell whether a churn model that scores 95% on training data and 71% on holdout is suffering from bias or variance.',
      hint: 'Compare training and validation error, not just the validation number.',
      concepts: [
        { label: 'Bias is error from oversimplifying; variance is sensitivity to the training sample', any: ['bias is', 'variance is', 'oversimplif', 'too simple', 'sensitiv', 'noise in the training'], required: true },
        { label: 'High bias shows as poor performance on both train and test (underfitting)', any: ['underfit', 'both', 'poor on train', 'high train error', 'low training'], required: true },
        { label: 'High variance shows as a large train-test gap (overfitting)', any: ['overfit', 'gap', 'large difference', 'memoris', 'memoriz', 'high on train'], required: true },
        { label: 'The 95/71 split indicates overfitting / high variance', any: ['overfit', 'variance', 'gap', '24', 'memoris', 'memoriz'], required: true },
        { label: 'Use learning curves to diagnose which regime you are in', any: ['learning curve', 'curve', 'plot error', 'vs training size', 'diagnos'], required: true },
        { label: 'Fix variance with more data, regularisation, fewer features, simpler model, early stopping', any: ['more data', 'regularis', 'regulariz', 'fewer feature', 'simpler', 'prun', 'early stopping', 'dropout', 'cross validation'], required: true },
        { label: 'Check for leakage and non-random splits before blaming variance', any: ['leakage', 'leak', 'split', 'time based', 'temporal', 'random split', 'target leak'], required: true }
      ],
      approach: `<p>Define the tradeoff crisply, then use the two error numbers as a diagnostic rather than a verdict.</p>
      <ol>
        <li><strong>Definitions:</strong> bias is systematic error from a model too simple to capture the real relationship; variance is error from the model fitting quirks of the particular training sample. Total error decomposes into bias&sup2; + variance + irreducible noise, and model complexity trades one against the other.</li>
        <li><strong>Diagnostic rule:</strong> look at both numbers together. High train error and similar test error means high bias (underfitting). Low train error with much worse test error means high variance (overfitting).</li>
        <li><strong>This case:</strong> 95% train versus 71% holdout is a 24-point gap, which is the classic high-variance signature. The model has memorised training-specific patterns.</li>
        <li><strong>Confirm with learning curves:</strong> plot train and validation error against training set size. Converging curves at a poor level indicates bias; a persistent gap that narrows as data grows indicates variance and tells you more data will help.</li>
        <li><strong>Rule out the boring explanations first,</strong> because they are more common than genuine variance: target leakage (a feature encoding the outcome), a random split on time-ordered churn data (which leaks the future), duplicate rows spanning both splits, and class imbalance making accuracy misleading. For churn, split by time and evaluate with AUC/PR-AUC and recall at a business-relevant threshold rather than raw accuracy.</li>
        <li><strong>Fixes for variance:</strong> more training data, stronger regularisation (L1/L2, tree depth limits, min samples per leaf), fewer or better features, ensembling/bagging, early stopping, and model selection by cross-validation instead of a single split.</li>
      </ol>`,
      answer: `<p><strong>Bias</strong> is error from a model too simple for the underlying relationship; <strong>variance</strong> is error from over-fitting the particular training sample. Complexity trades them off, and total error is bias&sup2; + variance + irreducible noise.</p>
      <p>The diagnosis comes from comparing both errors: similar and poor on train and test means high bias; strong on train and much weaker on holdout means high variance. A 95% versus 71% split is a 24-point gap, so this model is <strong>overfitting (high variance)</strong>. I would confirm with learning curves, where a persistent but narrowing gap as data grows is the variance signature.</p>
      <p>Before treating it as variance, I would rule out target leakage, a random rather than time-based split on churn data, duplicate rows across splits, and accuracy being misleading under class imbalance. Then I would address variance with more data, stronger regularisation, feature reduction, bagging or early stopping, selecting the model by cross-validation and evaluating with PR-AUC and recall at a business-relevant threshold.</p>`
    },
    {
      id: 'st-h4',
      difficulty: 'hard',
      prompt: 'A subscription business reports that customers acquired through paid ads churn less than organic customers. Give at least three explanations before accepting that paid acquisition produces better customers.',
      hint: 'Survivorship, measurement windows, and who each channel actually reaches.',
      concepts: [
        { label: 'Selection: the channels reach structurally different populations', any: ['different population', 'selection', 'audience', 'targeting', 'who they reach', 'segment', 'demographic'], required: true },
        { label: 'Ad targeting optimises toward users who already look like retainers', any: ['targeting', 'lookalike', 'optimis', 'optimiz', 'algorithm', 'retarget', 'high intent'], required: true },
        { label: 'Survivorship bias and unequal tenure across cohorts', any: ['survivor', 'tenure', 'cohort', 'older', 'age of', 'time in', 'left censor'], required: true },
        { label: 'Definition and measurement differences: churn window, attribution rules', any: ['definition', 'attribution', 'window', 'measure', 'last click', 'misattribut', 'how churn is defined'], required: true },
        { label: 'Promotional or contractual differences such as discounts and annual plans', any: ['discount', 'promo', 'offer', 'annual', 'contract', 'trial', 'plan', 'lock in'], required: true },
        { label: 'Confounding by geography, device or product mix', any: ['geograph', 'country', 'device', 'product mix', 'plan mix', 'confound'], required: true },
        { label: 'Test properly with a geo/budget holdout or incrementality experiment', any: ['holdout', 'geo', 'experiment', 'incrementality', 'random', 'lift test', 'switch off'], required: true }
      ],
      approach: `<p>The question is testing whether you can generate competing explanations before accepting a flattering conclusion. Give several, then say how to resolve it.</p>
      <ol>
        <li><strong>Selection on population.</strong> Organic signups include curiosity-driven and free-tier users who were never likely to stay, while paid campaigns are aimed at narrowly defined high-intent audiences. The channels are not sampling the same population.</li>
        <li><strong>Algorithmic targeting.</strong> Ad platforms optimise delivery toward users who resemble existing converters and retainers. The channel is <em>selecting</em> good customers rather than <em>creating</em> them, so the retention advantage is baked in before the ad is served.</li>
        <li><strong>Survivorship and tenure mismatch.</strong> If paid campaigns are newer, those cohorts have had less time to churn. Comparing lifetime churn rates across cohorts of unequal age always favours the younger cohort. The fix is cohort-aligned survival analysis at matched tenure, such as churn by day 90.</li>
        <li><strong>Attribution and definitions.</strong> Last-click attribution often credits paid for users who were already organic-intent, which moves the best organic users into the paid bucket. Also verify churn is defined identically, since different plan types have different cancellation mechanics.</li>
        <li><strong>Offer and plan differences.</strong> Paid funnels frequently push annual plans or discounted trials. Annual plans cannot churn monthly, which mechanically depresses measured churn independent of customer quality.</li>
        <li><strong>Confounding by mix.</strong> Geography, device and product mix differ by channel and each independently drives retention.</li>
        <li><strong>Resolution.</strong> Compare cohorts at equal tenure with survival curves, match on observable characteristics, and settle causality with a geo-level or budget-holdout incrementality test: switch paid spend off in randomly selected regions and measure the retention and revenue difference in customers actually gained.</li>
      </ol>`,
      answer: `<p>At least six alternative explanations before accepting the causal story:</p>
      <ol>
        <li><strong>Population selection:</strong> organic includes low-intent, curiosity signups; paid targets narrowly defined high-intent audiences.</li>
        <li><strong>Algorithmic targeting:</strong> ad platforms optimise toward lookalikes of existing retainers, so the channel selects good customers rather than producing them.</li>
        <li><strong>Tenure/survivorship mismatch:</strong> newer paid cohorts have had less time to churn; lifetime churn comparisons across unequal-age cohorts are biased.</li>
        <li><strong>Attribution artefacts:</strong> last-click can reclassify already-intent organic users as paid.</li>
        <li><strong>Offer and plan differences:</strong> paid funnels often push annual or discounted plans, which mechanically lowers measured monthly churn.</li>
        <li><strong>Mix confounding:</strong> geography, device and plan mix differ by channel and independently affect retention.</li>
      </ol>
      <p>To resolve it: compare survival curves at matched tenure (for example day-90 churn) within like-for-like plan types, match on observable characteristics, and run a <strong>geo or budget holdout incrementality test</strong> so the comparison is between randomised markets rather than between self-selected channels.</p>`
    },
    {
      id: 'st-h5',
      difficulty: 'hard',
      prompt: 'You have 10,000 daily metrics on an automated anomaly-detection dashboard, alerting at p &lt; 0.01. The team says it is too noisy. Diagnose the problem quantitatively and propose a design.',
      hint: 'How many alerts does pure noise generate per day at that threshold?',
      concepts: [
        { label: 'At p < 0.01 across 10,000 metrics you expect about 100 false alerts per day', any: ['100', 'expect', 'false alert', 'by chance', '1 percent of 10000', 'false positive'], required: true },
        { label: 'Multiple comparisons across metrics and across days compound the problem', any: ['multiple compar', 'multiple test', 'every day', 'compound', 'family wise', 'repeated'], required: true },
        { label: 'Control the false discovery rate (Benjamini-Hochberg) instead of per-test alpha', any: ['false discovery', 'fdr', 'benjamini', 'hochberg', 'q value'], required: true },
        { label: 'Add a practical significance / minimum effect size threshold, not just significance', any: ['effect size', 'practical', 'minimum', 'magnitude', 'threshold', 'material'], required: true },
        { label: 'Require persistence: alert only if the anomaly repeats across intervals', any: ['persist', 'consecutive', 'sustained', 'two days', 'repeat', 'duration'], required: true },
        { label: 'Model seasonality and trend so expected variation is not flagged', any: ['seasonal', 'trend', 'day of week', 'baseline', 'forecast', 'expected'], required: true },
        { label: 'Tier metrics by importance and route alerts by severity', any: ['tier', 'priorit', 'severity', 'important metric', 'critical', 'group', 'hierarch'], required: true },
        { label: 'Measure alert precision and tune against it', any: ['precision', 'measure', 'feedback', 'track', 'label', 'evaluate', 'tune'], required: true }
      ],
      approach: `<p>Lead with arithmetic to prove the noise is structural, not a tuning accident, then design a system that controls it on several axes.</p>
      <ol>
        <li><strong>Quantify:</strong> at &alpha; = 0.01 with 10,000 metrics, pure noise produces about 100 alerts every day even when nothing is wrong. Over a week that is 700 false alerts, so the dashboard is guaranteed to be ignored. Tightening &alpha; alone just trades false alarms for missed incidents.</li>
        <li><strong>Control FDR, not per-test error.</strong> Apply Benjamini&ndash;Hochberg across the day's metrics so you control the expected proportion of false discoveries among alerts. That is the right target for a screening system, and it adapts to how many real anomalies exist.</li>
        <li><strong>Require practical significance.</strong> Alert only when the deviation exceeds a materiality threshold as well as a statistical one; on high-volume metrics a 0.2% deviation is detectable and irrelevant.</li>
        <li><strong>Require persistence.</strong> Demand that the anomaly appears in consecutive intervals, or use a CUSUM/EWMA-style detector. Genuine incidents persist, noise usually does not, and this cuts alert volume dramatically at little cost in detection latency.</li>
        <li><strong>Model the expected pattern.</strong> Deseasonalise with day-of-week and holiday effects and remove trend before testing residuals, so predictable Monday spikes stop firing.</li>
        <li><strong>Reduce the metric surface.</strong> Tier metrics into critical, important and diagnostic. Page only on tier 1, digest the rest, and deduplicate correlated metrics so one incident produces one alert rather than fifty.</li>
        <li><strong>Close the loop.</strong> Log every alert with an eventual label, track precision and recall, and tune thresholds against measured precision. An alerting system without a measured precision target cannot be improved, only argued about.</li>
      </ol>`,
      answer: `<p><strong>The arithmetic first:</strong> at p &lt; 0.01 across 10,000 metrics, noise alone yields roughly <strong>100 false alerts per day</strong>. The dashboard is behaving exactly as designed; the design is wrong.</p>
      <p>Proposed system:</p>
      <ol>
        <li><strong>Benjamini&ndash;Hochberg FDR control</strong> across the daily metric set instead of a fixed per-metric &alpha;, targeting a stated false discovery rate.</li>
        <li><strong>Materiality threshold:</strong> require the deviation to exceed a business-relevant magnitude, not merely be statistically detectable.</li>
        <li><strong>Persistence rule:</strong> fire only when the anomaly repeats across consecutive intervals, or use EWMA/CUSUM detectors.</li>
        <li><strong>Seasonality and trend adjustment</strong> so expected weekly and holiday patterns are not flagged.</li>
        <li><strong>Metric tiering and deduplication:</strong> page on tier-1 metrics only, digest the rest, and collapse correlated metrics so one incident yields one alert.</li>
        <li><strong>Measured precision:</strong> label alert outcomes, track precision and recall, and tune thresholds against a target precision such as 80%.</li>
      </ol>
      <p>The framing to leave with the team: alerting is a precision-recall tradeoff, and without controlling the false discovery rate the system's precision falls with every metric added.</p>`
    }
  ]
});
