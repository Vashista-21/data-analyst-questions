/* Khatabook culture-fit, business-head and behavioural rounds. The topic carries
   a `brief` summarising the company, its products, how it makes money, the
   analytics team and the interview loop. Khatabook does not publish a formal
   values framework the way Navi does, so the traits listed are drawn from
   founder interviews, job posts and candidate reports. Model answers are worked
   examples of structure; the specifics in an interview must be the candidate's own. */
DAQ.registerTopic({
  id: 'khatabook-culture',
  group: 'khatabook',
  name: 'Khatabook Cultural Fit & Business Round',
  icon: '\uD83E\uDD1D',
  blurb: 'The culture, business-head and behavioural rounds: what Khatabook is and sells, how it makes money, why you want to join, merchant empathy, stakeholder conflicts, integrity with lending partners and your first 90 days.',
  brief: `
  <h4>The 60-second version</h4>
  <p>Khatabook is a Bengaluru-based fintech building <strong>digital tools for India's small merchants</strong>, the kirana stores, wholesalers and small businesses that make up most of the country's roughly 6.3 crore MSMEs. It started in <strong>January 2019</strong> by digitising the <em>bahi khata</em>, the red notebook in which shopkeepers track credit (udhaar) given to customers and payments received (jama), and has since grown into a business-management and financial-services platform.</p>
  <div class="fact-grid">
    <div class="fact"><span>Started</span>January 2019 (company incorporated 2018), Bengaluru</div>
    <div class="fact"><span>Co-founders</span>Ravish Naresh (CEO, earlier a co-founder of Housing.com), Jaideep Poonia, Dhanesh Kumar, Ashish Sonone, Vaibhav Kalpe</div>
    <div class="fact"><span>Mission</span>Empower merchants by simplifying their business; "every business has the right to be digital"</div>
    <div class="fact"><span>Scale</span>5 crore+ downloads, around 8 million+ monthly active merchants, 10+ Indian languages</div>
  </div>
  <p>Backed by Sequoia Capital India (now Peak XV), Tribe Capital, B Capital and others; it raised about $100 million in 2021. Check the latest figures the day before the interview and never quote a number you are unsure of.</p>

  <h4>What Khatabook actually sells</h4>
  <ul>
    <li><strong>Khatabook app</strong> — the free core: digital ledger for udhaar and jama, payment reminders over SMS and WhatsApp, Khatabook QR and payment links to collect via UPI, cards and wallets, GST and non-GST billing, inventory and business reports. Works offline and in regional languages.</li>
    <li><strong>Merchant lending</strong> — collateral-free working-capital loans of roughly ₹10,000 to ₹5 lakh over 3 to 24 months, offered to eligible merchants through <strong>RBI-registered NBFC partners</strong>, with an option to repay in easy daily instalments (EDI). This is the main growth bet.</li>
    <li><strong>Biz Analyst</strong> — acquired in 2021 for about $10 million; a paid app that connects to Tally to give distributors and traders mobile business intelligence, outstanding reports and sales tools.</li>
    <li><strong>Pagarkhata</strong> — staff attendance and salary management for small businesses.</li>
  </ul>
  <div class="key"><strong>Good to know:</strong> Khatabook shut down its MyStore e-commerce product in 2021 to focus. Mentioning that it consolidated around bookkeeping, lending and SaaS shows you understand its strategy, not just its app.</div>

  <h4>How it makes money</h4>
  <ul>
    <li><strong>Bookkeeping stays free.</strong> It is the acquisition and engagement engine: the habit that brings merchants back every week.</li>
    <li><strong>Financial services.</strong> Lending through NBFC partners earns fees and a share of economics; the ledger and collections history is what makes merchants with thin credit files assessable at all.</li>
    <li><strong>SaaS subscriptions.</strong> Biz Analyst and premium business tools sold to larger merchants and distributors.</li>
    <li><strong>The financial picture.</strong> Media reports put FY24 revenue from operations at about ₹103 crore with a net loss of about ₹116 crore, down from the year before. Several rounds of layoffs between 2022 and 2023 were explicitly about reaching profitability. Expect a lean, cost-conscious team that values impact per person.</li>
  </ul>
  <div class="key"><strong>The insight that lands:</strong> the free ledger is a data asset. Years of entries, reminders and QR collections describe how a small business actually runs, which is exactly what a lender lacks for a kirana with no formal financial statements. But entries are self-reported, so verified collections matter more than typed entries. Saying that shows you understand both the opportunity and the risk.</div>

  <h4>Where the analytics team sits</h4>
  <p>Data at Khatabook has two streams: <strong>business analytics</strong> and <strong>machine learning</strong>. The <strong>Central Analytics</strong> team is lean and horizontal, serving product, growth, lending, operations and finance. Recent Data Analyst posts (1–3 years) ask for:</p>
  <ul>
    <li><strong>Strong SQL and query optimisation</strong>, the most consistently tested skill.</li>
    <li><strong>ETL/ELT tools</strong> such as dbt, Airflow and Airbyte, and building and managing <strong>fact tables</strong>.</li>
    <li><strong>BI tools</strong>: Tableau, Power BI or QlikView dashboards for KPIs.</li>
    <li><strong>Reporting automation</strong> and <strong>reconciling financial data with Finance</strong>.</li>
    <li>Bonus: Python, R or Spark; statistics and experiment analysis.</li>
  </ul>

  <h4>The interview loop</h4>
  <ol>
    <li><span class="value-name">Screening</span> — technical analysis plus a business case; a knockout round. Some roles use an online SQL test or a take-home dataset instead.</li>
    <li><span class="value-name">Second technical round</span> — advanced SQL (window functions, CTEs, optimisation), statistics and a mini case.</li>
    <li><span class="value-name">Analytics case round</span> — merchant engagement, churn, metric drops, north star, A/B tests, lending.</li>
    <li><span class="value-name">Business-head round</span> — how you think about the business, prioritisation, stakeholders.</li>
    <li><span class="value-name">Culture-fit round</span> — the questions in this topic.</li>
  </ol>

  <h4>What they screen for</h4>
  <p>Khatabook does not publish a formal values list like Navi's. These traits come up repeatedly in what the founders say and what candidates report:</p>
  <ol>
    <li><span class="value-name">Merchant empathy.</span> Users are small shopkeepers, many not digitally fluent, often on low-end phones with patchy network. Solutions that assume high digital literacy fail.</li>
    <li><span class="value-name">Ownership.</span> Lean teams where people design their own workstreams around a larger objective and carry problems to a result.</li>
    <li><span class="value-name">Resilience and agility.</span> The CEO names these as core: hyper-growth and slowdown both happen, and people must adapt without losing pace.</li>
    <li><span class="value-name">Comfort with messy data.</span> Sparse, self-reported, offline-synced data. Work with what exists rather than waiting for perfect data.</li>
    <li><span class="value-name">Business framing.</span> Connect every analysis to a decision and lead with the "so what" for non-technical stakeholders.</li>
    <li><span class="value-name">Collaboration and learning.</span> Brainstorming with peers, because the problems are unusual and different perspectives help.</li>
  </ol>

  <h4>Why you want to join Khatabook</h4>
  <ul>
    <li><strong>The users.</strong> Building for crores of small merchants, many using a business app for the first time, is a real problem with visible impact.</li>
    <li><strong>The data problem.</strong> Turning ledger and collections behaviour into credit decisions for businesses with no formal financials is genuinely hard and new.</li>
    <li><strong>The role.</strong> Central Analytics touches product, lending, operations and finance, and owns pipelines and fact tables as well as dashboards, so you build foundations rather than just pull numbers.</li>
    <li><strong>Lean and ownership-heavy.</strong> High impact per person, close to decisions.</li>
  </ul>
  <div class="key"><strong>Do your homework:</strong> install the app, add a customer, record an udhaar entry and send yourself a reminder. One honest observation from using it, plus the metric you would want to look at first, beats any amount of enthusiasm.</div>

  <h4>What sinks candidates</h4>
  <ul>
    <li>No numbers in your stories, or "we" with no "I".</li>
    <li>Not being able to explain every decision in your own projects, or what you would do differently.</li>
    <li>Proposing solutions that assume tech-savvy, English-speaking, always-online users.</li>
    <li>Jumping to "the data shows X causes Y" without checking data quality or confounders.</li>
    <li>Any flexibility on integrity, especially with numbers shared with lending partners.</li>
  </ul>
  <p><strong>Questions to ask them:</strong> which metrics does Central Analytics own end to end? What does the data stack look like day to day? What is the hardest analytical question the team is working on now? What does a strong first 90 days look like?</p>`,
  questions: [
    /* ---------------------------- EASY ---------------------------- */
    {
      id: 'kc-e1',
      difficulty: 'easy',
      prompt: '<strong>Why do you want to join Khatabook?</strong>',
      hint: 'Three reasons that could only be said about Khatabook, one observation from using the app, and a line on what you bring.',
      concepts: [
        { label: 'Connects to the mission of digitising India\'s small merchants', any: ['msme', 'small merchant', 'kirana', 'small business'], required: true },
        { label: 'Shows specific product knowledge: ledger, reminders, QR, billing, lending', any: ['ledger', 'khata', 'reminder', 'qr', 'lending', 'billing'], required: true },
        { label: 'Explains why the Central Analytics role appeals', any: ['central analytics', 'pipeline', 'fact table', 'dashboard'], required: true },
        { label: 'Names the data problem: merchants with little digital footprint, ledger data enabling credit', any: ['digital footprint', 'thin financial record', 'credit decision', 'data problem'], required: true },
        { label: 'Values a lean, ownership-heavy team', any: ['lean', 'ownership', 'impact per person'], required: true },
        { label: 'Says what you bring', any: ['i bring', 'i have built', 'my experience', 'contribute'], required: true },
        { label: 'Grounded in an observation from using the app', any: ['i installed', 'i tried', 'i noticed', 'using the app'] }
      ],
      approach: `<p>Scored on specificity. If a sentence would be equally true of any fintech, cut it.</p>
      <ol>
        <li><strong>The users.</strong> Crores of small merchants, many using a business app for the first time. Say why building for them matters to you.</li>
        <li><strong>The data problem.</strong> The ledger turns informal businesses into something measurable; turning entries and collections into credit decisions for businesses with a thin financial record is new and hard.</li>
        <li><strong>The role.</strong> Central Analytics owns pipelines and fact tables as well as dashboards, across product, lending and finance. Name the JD items you want: SQL, dbt, Airflow, automated reporting.</li>
        <li><strong>How they work.</strong> A lean team with high ownership and impact per person.</li>
        <li><strong>One observation</strong> from installing the app and recording an entry, plus the first metric you would want to see.</li>
        <li><strong>Close with what you bring.</strong></li>
      </ol>`,
      answer: `<p><em>Structure to adapt with your own details.</em></p>
      <p>"Three reasons. First, the users: Khatabook builds for India's small merchants and kirana owners, many of whom are using a business app for the first time, and the impact is concrete because faster collection of udhaar is real money for a small shop. Second, the data problem: the ledger makes informal businesses measurable, and using entries, reminders and QR collections to support credit decisions for merchants with a thin financial record is a genuinely new data problem. Third, the role: Central Analytics owns pipelines and fact tables as well as dashboards, across product, lending and finance, so I would be building foundations rather than just pulling numbers, in a lean team with real ownership.</p>
      <p>Before this interview I installed the app, added a customer and sent myself a reminder. I noticed how much the reminder flow depends on WhatsApp delivery, so one of the first things I would want to understand is reminder-to-payment conversion by channel and language.</p>
      <p>What I bring is strong SQL, experience building automated reports and the habit of reconciling numbers before anyone relies on them. I have built dashboards that teams used daily, and I think I can contribute quickly to a team whose job is reliable, decision-ready data."</p>`
    },
    {
      id: 'kc-e2',
      difficulty: 'easy',
      prompt: '<strong>What do you know about Khatabook?</strong> Cover what it does, who started it, and how it makes money.',
      hint: 'Origin, products, scale, monetisation, and one insight about why the free ledger matters.',
      concepts: [
        { label: 'Bengaluru, started in 2019, co-founded by Ravish Naresh and team', any: ['ravish naresh', '2019', 'bengaluru'], required: true },
        { label: 'Started as a digital bahi khata for udhaar and jama', any: ['bahi khata', 'udhaar', 'digital ledger', 'jama'], required: true },
        { label: 'Product range: reminders, QR, billing, inventory, Biz Analyst, Pagarkhata, loans', any: ['biz analyst', 'pagarkhata', 'gst', 'inventory'], required: true },
        { label: 'Monetisation: free bookkeeping, SaaS subscriptions, lending via NBFC partners', any: ['subscription', 'saas', 'nbfc'], required: true },
        { label: 'Scale: crores of downloads, millions of monthly active merchants, many languages', any: ['crore', 'million', 'languages'], required: true },
        { label: 'Insight: ledger data as a credit signal, and the push to profitability', any: ['profitab', 'credit signal', 'data asset', 'underwrit'], required: true }
      ],
      approach: `<p>About a minute: what it is, what it sells, how it earns, one insight.</p>
      <ol>
        <li><strong>What:</strong> a Bengaluru fintech started in 2019 by Ravish Naresh, previously a Housing.com co-founder, with his co-founders, digitising the bahi khata in which shopkeepers track udhaar and jama.</li>
        <li><strong>Products:</strong> the free ledger with reminders, QR collections, GST billing and inventory; merchant loans through NBFC partners with daily-instalment repayment; Biz Analyst, acquired in 2021, for Tally users; Pagarkhata for staff and salary.</li>
        <li><strong>Scale:</strong> 5 crore+ downloads, around 8 million+ monthly active merchants, 10+ languages.</li>
        <li><strong>Money:</strong> bookkeeping stays free; revenue comes from SaaS subscriptions and financial services, mainly lending distribution. It has been cutting losses on a push to profitability.</li>
        <li><strong>Insight:</strong> the ledger is a data asset and a credit signal for businesses lenders cannot otherwise assess, but it is self-reported, so verified collections matter.</li>
      </ol>`,
      answer: `<p>"Khatabook is a Bengaluru fintech started in 2019 by Ravish Naresh, who earlier co-founded Housing.com, along with his co-founders. It began by digitising the bahi khata, the notebook in which shopkeepers record udhaar given to customers and jama received, and the app spread fast: it has over 5 crore downloads, around 8 million monthly active merchants and works in more than ten languages.</p>
      <p>Today the free app covers the digital ledger, payment reminders over SMS and WhatsApp, collections through Khatabook QR and payment links, GST billing and inventory. Around it are merchant loans through RBI-registered NBFC partners with daily-instalment repayment, Biz Analyst, acquired in 2021, which gives Tally users business reports on mobile, and Pagarkhata for staff and salary management.</p>
      <p>Bookkeeping stays free because it drives engagement; revenue comes from SaaS subscriptions such as Biz Analyst and from financial services, mainly lending. The company has been narrowing losses on a push to profitability. What I find most interesting is that the free ledger is a data asset: it describes how a small business actually runs, which is a credit signal lenders do not otherwise have. The challenge is that entries are self-reported, so verified collections carry more weight than typed entries, and that is where analytics matters most."</p>`
    },
    {
      id: 'kc-e3',
      difficulty: 'easy',
      prompt: 'Reported at Khatabook: <strong>walk me through a time you turned raw data into a business decision that had a measurable impact.</strong>',
      hint: 'STAR, with most of the time on what you did and a number at the end.',
      concepts: [
        { label: 'Brief situation and the business question', any: ['situation', 'business question', 'the problem was'], required: true },
        { label: 'Your specific actions, in first person', any: ['i pulled', 'i built', 'i wrote', 'i found', 'my part'], required: true },
        { label: 'The insight and how you validated it', any: ['insight', 'validated', 'checked', 'found that'], required: true },
        { label: 'The decision that changed because of it', any: ['decision', 'decided', 'changed'], required: true },
        { label: 'A measurable result', any: ['%', 'result', 'saved', 'reduced', 'increased'], required: true },
        { label: 'What you learned or would do differently', any: ['learned', 'differently', 'next time'] }
      ],
      approach: `<p>This is the most reported Khatabook behavioural question. Roughly 15% situation, 15% task, 55% action, 15% result.</p>
      <ol>
        <li><strong>Situation:</strong> one or two sentences. What was the business question?</li>
        <li><strong>Action, in first person:</strong> what data you pulled, how you cleaned it, what analysis you ran, what you found. Say "I", not "we".</li>
        <li><strong>Validation:</strong> how you checked the insight before anyone acted on it.</li>
        <li><strong>Decision:</strong> what someone did differently because of you.</li>
        <li><strong>Result:</strong> a number, such as a percentage, hours saved or rupees.</li>
        <li><strong>Learning:</strong> one line on what you would do differently. Interviewers probe this, because people who did not do the work cannot answer it.</li>
      </ol>`,
      answer: `<p><em>Structure to adapt with your own details.</em></p>
      <p>"The situation was that our support team was overwhelmed and the business question was whether to hire more agents. I pulled six months of ticket data, joined it with app events and wrote the categorisation logic myself. I found that 30% of tickets came from users stuck on one verification screen after a specific app version. I validated it by checking that the spike started on that release date and that the same users had failed attempts in the event logs.</p>
      <p>I presented this to the product lead with the evidence, and the team decided to fix the screen instead of hiring. The result was that ticket volume fell by about 25% within a month and the hiring plan was cut from five agents to two. What I learned was to look for one dominant cause before accepting that a problem needs more resources; next time I would also set up an alert on that category so we catch similar spikes within days."</p>`
    },
    {
      id: 'kc-e4',
      difficulty: 'easy',
      prompt: 'Khatabook\'s users are small merchants, many not tech-savvy, often on low-end phones and patchy network. <strong>How does that change the way you analyse data and build dashboards?</strong>',
      hint: 'Think about the data itself (offline, self-reported) and the conclusions you draw (literacy, language, seasonality).',
      concepts: [
        { label: 'Offline and intermittent connectivity: entries sync late, separate event and sync time', any: ['offline', 'sync', 'connectivity'], required: true },
        { label: 'Low digital literacy: metrics around simple core actions, do not assume features are discovered', any: ['literacy', 'tech savvy', 'first time', 'simple'], required: true },
        { label: 'Language and regional segmentation', any: ['language', 'regional', 'vernacular'], required: true },
        { label: 'Seasonality: festivals, harvests, month-end cycles', any: ['festival', 'harvest', 'season'], required: true },
        { label: 'Ground numbers in qualitative input: field visits, support calls', any: ['field', 'support call', 'qualitative', 'talk to merchants'], required: true },
        { label: 'Messy data: self-reported entries, edits, deletes, duplicates', any: ['self reported', 'messy', 'duplicate', 'edited'], required: true },
        { label: 'Dashboards for internal users stay simple and decision-first', any: ['decision first', 'decision', 'ops team', 'field team'] }
      ],
      approach: `<p>Interviewers are testing merchant empathy. Translate it into concrete analytical habits.</p>
      <ol>
        <li><strong>The data is different.</strong> The app works offline, so entries sync late: count by event time with a lookback, and treat today as provisional. Entries are self-reported, edited and deleted, so the data is messy and needs explicit cleaning rules.</li>
        <li><strong>The users are different.</strong> Many are first-time smartphone business users with lower digital literacy. Low adoption of a feature may mean "never discovered" rather than "not wanted", so measure discovery separately.</li>
        <li><strong>Segment by language and region,</strong> because experience in Hindi, Tamil and Marathi can differ completely.</li>
        <li><strong>Seasonality</strong> from festivals, harvests and month-end credit cycles moves merchant behaviour more than most product changes. Compare like with like.</li>
        <li><strong>Qualitative grounding:</strong> field visits, sales and support calls, and talking to merchants explain what numbers cannot.</li>
        <li><strong>Internal dashboards:</strong> keep them simple and decision-first, especially for ops and field teams who need one clear number and an action.</li>
      </ol>`,
      answer: `<p>"It changes both the data and the conclusions. On the data side, the app works offline, so entries sync late; I would count activity by event time with a lookback window and label same-day numbers as provisional, otherwise every morning looks like a drop. Entries are also self-reported and can be edited or deleted, so the data is messy and I would write explicit rules for duplicates, edits and test accounts before trusting any metric.</p>
      <p>On the conclusions side, many merchants are first-time business app users with lower digital literacy, so if a feature has low adoption I would separate "never discovered it" from "tried and left", because the fixes are completely different, and I would anchor engagement on simple core actions like recording an entry rather than on complex feature usage. I would segment by language and region, since the experience in Hindi and in Tamil can differ, and adjust for seasonality from festivals, harvests and month-end credit cycles before calling any trend.</p>
      <p>I would also ground the numbers in qualitative input from field visits, support calls and talking to merchants directly. And dashboards for internal teams, especially ops and field teams, should be simple and decision-first: one clear number, its trend, and what to do when it moves."</p>`
    },
    {
      id: 'kc-e5',
      difficulty: 'easy',
      prompt: '<strong>Tell me about yourself</strong>, then pick one project from your resume and walk me through it in depth.',
      hint: 'Two minutes for the intro. For the project, they will ask why you made each decision and what you would change.',
      concepts: [
        { label: 'Present role and domain in one line', any: ['currently', 'right now', 'at present'], required: true },
        { label: 'One or two projects with numbers', any: ['project', '%', 'impact'], required: true },
        { label: 'Explains your decisions and trade-offs in the project', any: ['trade off', 'i chose', 'decided to', 'why i'], required: true },
        { label: 'Says what you would do differently', any: ['differently', 'next time', 'redo'], required: true },
        { label: 'Ties back to this role: SQL, pipelines, dashboards', any: ['this role', 'khatabook', 'central analytics'], required: true },
        { label: 'Keeps the intro to about two minutes', any: ['two minutes', '2 minutes', 'concise'] }
      ],
      approach: `<p>Khatabook interviewers go deep on past projects and probe every claim. Prepare the intro and one project you can defend line by line.</p>
      <ol>
        <li><strong>Intro, about two minutes:</strong> what you do currently, one or two projects with numbers, the skills you bring (SQL, dashboards, pipelines, stakeholder work), and why this role now.</li>
        <li><strong>Project walkthrough:</strong> the business problem, the data, your design decisions and the trade-offs you made (why this table grain, why incremental, why that chart), the result, and what you would do differently.</li>
        <li><strong>Expect probes:</strong> "why not X?", "what broke?", "how did you validate it?". If you cannot answer, it reads as work you did not own.</li>
        <li><strong>Tie it back</strong> to Khatabook's Central Analytics work.</li>
      </ol>`,
      answer: `<p><em>Structure to adapt with your own details.</em></p>
      <p>"I am currently a data analyst at a consumer app, working mainly with SQL, dbt and Tableau. My main project was replacing a manual weekly sales report with an automated pipeline, which saved the team about 10 hours a week, and I also built a churn dashboard that the growth team uses to target win-back campaigns, which lifted reactivation by around 8%. I am looking for this role because Khatabook's Central Analytics work, owning fact tables, pipelines and dashboards across product and lending, is exactly the direction I want to grow in, and I want to do it for users where the impact is visible.</p>
      <p>On the automation project in depth: the problem was that three people stitched together exports every Monday and the numbers often disagreed with finance. I chose to build a daily fact table at order grain in dbt rather than a weekly summary, because the grain let other teams reuse it; the trade-off was a longer build. I decided to run the old and new reports side by side for three weeks and reconciled every difference before switching. If I did it again, I would involve finance earlier, because half the differences were definition questions rather than bugs, and I would add freshness alerts from day one instead of after the first failure."</p>`
    },

    /* --------------------------- MEDIUM --------------------------- */
    {
      id: 'kc-m1',
      difficulty: 'medium',
      prompt: 'Reported at Khatabook: <strong>three stakeholders each push a different KPI</strong>, and you can only focus on one this quarter. How do you decide?',
      hint: 'Not "whoever is most senior". Understand, quantify, connect to the north star, make the trade-off visible.',
      concepts: [
        { label: 'Understand what decision or goal sits behind each KPI', any: ['behind each', 'what decision', 'optimising for', 'understand'], required: true },
        { label: 'Connect each KPI to the north star or metric tree', any: ['north star', 'metric tree'], required: true },
        { label: 'Quantify the size of the opportunity for each with data', any: ['quantif', 'size of', 'estimate'], required: true },
        { label: 'Look for conflicts and guardrails between them', any: ['conflict', 'guardrail', 'cannibal'], required: true },
        { label: 'Make the trade-off visible and align with the shared manager instead of choosing silently', any: ['visible', 'escalat', 'shared manager', 'align'], required: true },
        { label: 'Commit, communicate, and revisit with data', any: ['commit', 'communicat', 'revisit'], required: true }
      ],
      approach: `<p>Khatabook's business-head round loves this. Show a process that is fair, data-driven and transparent.</p>
      <ol>
        <li><strong>Understand</strong> what each stakeholder is optimising for and which decision their KPI supports. Often two KPIs are proxies for the same goal.</li>
        <li><strong>Connect to the north star.</strong> Place each KPI on the metric tree under weekly active merchants or revenue. The one with the clearest causal path usually wins.</li>
        <li><strong>Quantify</strong> the opportunity: if each moved by a realistic amount, what happens to the north star? Rough sizing beats opinions.</li>
        <li><strong>Check conflicts:</strong> does pushing loan applications hurt portfolio quality? Does pushing reminders raise spam complaints? Add guardrails.</li>
        <li><strong>Make it visible:</strong> present the comparison to all three and to the shared manager rather than deciding quietly or by seniority.</li>
        <li><strong>Commit and communicate</strong> what is deprioritised and when it will be revisited, then review with data at the end of the quarter.</li>
      </ol>`,
      answer: `<p>"I would first understand what each stakeholder is optimising for and what decision their KPI supports, because sometimes two of them are proxies for the same underlying goal. Then I would place each KPI on the metric tree under the north star, for example weekly active merchants or revenue, and quantify the opportunity: if each KPI moved by a realistic amount based on past data, how much would the north star move? That turns a debate into an estimate.</p>
      <p>I would also check for conflicts: pushing loan applications could hurt portfolio quality, and pushing reminder volume could raise spam complaints, so whichever we pick needs guardrails. Then I would make the trade-off visible: share the comparison with all three stakeholders and our shared manager, recommend one, and let the decision be made openly rather than by whoever is most senior or loudest.</p>
      <p>Once decided, I would commit fully, communicate clearly to the other two what is deprioritised and when we will revisit it, and at the end of the quarter review with data whether the choice paid off."</p>`
    },
    {
      id: 'kc-m2',
      difficulty: 'medium',
      prompt: 'Reported at Khatabook: tell me about a time you <strong>pushed back on a senior stakeholder\'s assumption using data</strong>.',
      hint: 'Understand their view, bring evidence privately, propose a cheap test, and commit if overruled.',
      concepts: [
        { label: 'Understood the assumption and why they held it', any: ['why they', 'their reasoning', 'understand'], required: true },
        { label: 'Brought data or evidence', any: ['data', 'evidence', 'analysis'], required: true },
        { label: 'Raised it privately and respectfully first', any: ['privately', 'one on one', 'respectful'], required: true },
        { label: 'Proposed a test or cheap way to settle it', any: ['test', 'pilot', 'experiment'], required: true },
        { label: 'Outcome with a number', any: ['result', 'outcome', '%'], required: true },
        { label: 'Willing to disagree and commit if overruled', any: ['commit', 'overruled', 'disagree and commit'], required: true }
      ],
      approach: `<p>The interviewer wants evidence over status, delivered without ego.</p>
      <ol>
        <li><strong>Understand first:</strong> what did they believe, and why? Their experience might contain information your data lacks.</li>
        <li><strong>Bring evidence,</strong> framed around their goal rather than around being right.</li>
        <li><strong>Privately and respectfully first,</strong> not by correcting them in a big meeting.</li>
        <li><strong>Propose a cheap test</strong> that settles it.</li>
        <li><strong>Outcome</strong> with a number, whichever way it went.</li>
        <li><strong>If overruled, commit</strong> and say so.</li>
      </ol>`,
      answer: `<p><em>Structure to adapt with your own details.</em></p>
      <p>"Our head of growth believed a discount campaign was driving most new activations and wanted to double its budget. I wanted to understand why he believed it, and it was because activations rose in the weeks the campaign ran. When I looked at the data, the same rise appeared in regions where the campaign had not run, and it lined up with a festival season, so the analysis suggested most of the lift was seasonal.</p>
      <p>I asked for a short one on one rather than raising it in the review, and was respectful about it: I showed the regional comparison and said I might be missing something. I proposed a cheap test, running the campaign in half the eligible cities for two weeks with the rest as control. The test showed an incremental lift of about 3%, much smaller than assumed, and the budget increase was cut to a quarter of the plan. He thanked me afterwards. If the test had gone his way I would have committed fully; the point was to get to the right answer, not to win the argument."</p>`
    },
    {
      id: 'kc-m3',
      difficulty: 'medium',
      prompt: 'Reported at Khatabook: how would you build a <strong>prioritisation framework for a backlog that has both merchant-requested features and internally identified gaps</strong>?',
      hint: 'Score impact against effort, tie impact to the north star, and do not let the loudest request win.',
      concepts: [
        { label: 'Score impact against effort, for example RICE or ICE', any: ['rice', 'impact', 'effort', 'reach', 'confidence'], required: true },
        { label: 'Define impact through the north star metric', any: ['north star'], required: true },
        { label: 'Weigh merchant requests by how many merchants and which segments, not loudness', any: ['how many merchants', 'loudest', 'segment'], required: true },
        { label: 'Treat compliance, data quality and tech debt as must-dos or risk reduction', any: ['compliance', 'tech debt', 'must do', 'data quality'], required: true },
        { label: 'Use evidence: usage data, support tickets, churn reasons', any: ['support ticket', 'usage data', 'churn reason'], required: true },
        { label: 'Measure after shipping and revisit the framework', any: ['measure', 'revisit', 'after shipping'], required: true }
      ],
      approach: `<p>Show a framework, then show judgement about where frameworks fail.</p>
      <ol>
        <li><strong>Score impact against effort,</strong> for example RICE: reach, impact, confidence, effort. A simple 2x2 also works.</li>
        <li><strong>Define impact</strong> as expected movement in the north star (weekly active merchants) or a key input to it, so every item is scored on the same scale.</li>
        <li><strong>Merchant requests:</strong> weight by how many merchants ask and which segments they come from, not by who is loudest. A request from 50 wholesalers may matter less than a silent pain point for lakhs of kiranas.</li>
        <li><strong>Internal gaps:</strong> compliance and regulatory items are must-dos. Data quality and tech debt are scored as risk reduction and as enablers of future work.</li>
        <li><strong>Evidence:</strong> usage data, support tickets, churn reasons and sales feedback raise confidence scores.</li>
        <li><strong>Close the loop:</strong> measure impact after shipping and revisit scores, so the framework learns.</li>
      </ol>`,
      answer: `<p>"I would score every item on impact against effort using something like RICE, meaning reach, impact, confidence and effort, so merchant requests and internal gaps sit on the same scale. Impact would be defined through the north star, weekly active merchants or a key input like activation or collections, so we are not comparing apples with oranges.</p>
      <p>For merchant requests, I would weigh how many merchants ask and which segments they come from rather than who is loudest, since a request from a few vocal wholesalers can matter less than a silent pain point affecting lakhs of kiranas. Evidence from usage data, support tickets, churn reasons and field sales raises the confidence score. Internal gaps are handled slightly differently: compliance and regulatory items are must-dos regardless of score, while data quality and tech debt are scored as risk reduction and as enablers that make later work cheaper.</p>
      <p>Finally I would measure the actual impact after shipping and revisit the scoring every quarter, because a framework whose estimates are never checked becomes a ritual rather than a tool."</p>`
    },
    {
      id: 'kc-m4',
      difficulty: 'medium',
      prompt: 'Tell me about a time you had to <strong>deliver an analysis with messy or incomplete data</strong>.',
      hint: 'Quantify the mess, decide what is good enough for the decision, state caveats, and fix the source afterwards.',
      concepts: [
        { label: 'Profiled and quantified the data problems first', any: ['profil', 'quantif', 'how much'], required: true },
        { label: 'Decided what was good enough for the decision', any: ['good enough', 'directional', 'precision'], required: true },
        { label: 'Documented assumptions and caveats', any: ['assumption', 'caveat', 'document'], required: true },
        { label: 'Validated against an independent source', any: ['validat', 'reconcil', 'cross check'], required: true },
        { label: 'Fixed the problem upstream for the long term', any: ['upstream', 'at source', 'long term'], required: true },
        { label: 'Result', any: ['result', 'delivered', '%'] }
      ],
      approach: `<p>Khatabook data is sparse, self-reported and offline-synced, so they want people who can work with what exists.</p>
      <ol>
        <li><strong>Profile and quantify:</strong> how many rows are missing, duplicated or suspicious, and in which segments?</li>
        <li><strong>Good enough for what?</strong> A go or no-go decision needs direction, not decimal precision. Match effort to the decision.</li>
        <li><strong>Document assumptions and caveats</strong> right next to the numbers.</li>
        <li><strong>Validate</strong> against an independent source, such as finance totals or a manual sample.</li>
        <li><strong>Fix upstream</strong> afterwards so the next analysis does not repeat the work.</li>
      </ol>`,
      answer: `<p><em>Structure to adapt with your own details.</em></p>
      <p>"We needed to know whether a referral programme was worth continuing, but referral codes were missing for a large share of signups. I first profiled the data and quantified it: about 35% of signups had no code, concentrated in older app versions where the field was optional. The decision was continue or stop, so directional accuracy was good enough rather than precision.</p>
      <p>I used the 65% with codes, checked that their mix of regions and channels looked like the whole population, and documented the assumption that missing-code users behaved similarly, with a caveat and a range in the deck. I validated the total referral payouts against the finance ledger, which matched within 2%. The programme was continued with a lower reward. Afterwards I worked with engineering to make the field mandatory and added a test that alerts if the missing rate rises above 5%, which fixed the problem upstream so the next analysis did not need the workaround."</p>`
    },
    {
      id: 'kc-m5',
      difficulty: 'medium',
      prompt: 'You found that merchants who never send a reminder in their first month churn twice as fast. <strong>Explain this to a non-technical business head</strong> in two minutes.',
      hint: 'Lead with the so-what, say how sure you are, recommend a decision, and keep detail in reserve.',
      concepts: [
        { label: 'Lead with the headline or so-what', any: ['so what', 'headline', 'lead with', 'bottom line'], required: true },
        { label: 'Make a recommendation and say what decision is needed', any: ['recommend', 'decision'], required: true },
        { label: 'Plain language, few numbers, one chart', any: ['plain language', 'one chart', 'jargon'], required: true },
        { label: 'State confidence honestly: correlation, not yet causation', any: ['correlation', 'causation', 'how sure', 'confidence'], required: true },
        { label: 'Keep detail in an appendix and be ready for questions', any: ['appendix', 'backup', 'questions'], required: true },
        { label: 'Propose a test to confirm', any: ['test', 'experiment', 'pilot'] }
      ],
      approach: `<p>Candidates report being asked to present to a hypothetical non-technical stakeholder. Structure: headline, evidence, confidence, recommendation, appendix.</p>
      <ol>
        <li><strong>Headline first:</strong> the so-what in one sentence.</li>
        <li><strong>Evidence:</strong> one chart, plain language, no jargon like "hazard ratio".</li>
        <li><strong>Confidence:</strong> this is correlation. Merchants who send reminders might simply be more engaged, so say how sure you are.</li>
        <li><strong>Recommendation and decision needed:</strong> a nudge experiment, with the cost and timeline.</li>
        <li><strong>Appendix:</strong> definitions, cohorts and segment cuts, ready for questions.</li>
      </ol>`,
      answer: `<p>"Here is the bottom line: new merchants who never send a payment reminder in their first month leave us at twice the rate of those who do, so getting more new merchants to send that first reminder could be one of our biggest retention levers.</p>
      <p>This one chart shows it: by the third month, about 60% of merchants who sent a reminder are still active, against about 30% of those who did not. In plain language, the reminder is when a merchant first sees the app getting their money back.</p>
      <p>How sure am I? This is a correlation, not proven causation: merchants who send reminders may simply be more engaged to begin with. So I recommend a decision to run a small test: show a reminder nudge to half of new merchants for four weeks and compare retention. It needs about a week of product work, and if it works it could lift new-merchant retention meaningfully. The definitions, cohorts and segment cuts are in the appendix and I am happy to take questions on any of them."</p>`
    },

    /* ---------------------------- HARD ---------------------------- */
    {
      id: 'kc-h1',
      difficulty: 'hard',
      prompt: 'Khatabook has run lean on a path to profitability. <strong>Tell me about a time priorities changed abruptly or resources were cut, and how you still delivered.</strong>',
      hint: 'The founders talk about resilience and agility. Show re-planning, scope cuts, automation and clear communication, without complaining.',
      concepts: [
        { label: 'Describes an abrupt change: reprioritisation, cut or shift', any: ['priorities changed', 'shift', 'reprioriti', 'was cut'], required: true },
        { label: 'Re-planned quickly and cut scope deliberately', any: ['scope', 'mvp', 'minimum'], required: true },
        { label: 'Automated or reused to do more with less', any: ['automat', 'reuse', 'template', 'self serve'], required: true },
        { label: 'Communicated trade-offs and reset expectations', any: ['communicat', 'trade off', 'expectation'], required: true },
        { label: 'Outcome with numbers', any: ['result', '%', 'hours'], required: true },
        { label: 'Shows resilience and agility rather than complaint', any: ['resilien', 'agil', 'adapt'], required: true }
      ],
      approach: `<p>Khatabook's CEO has said he hires for resilience and agility because hyper-growth and slowdowns both happen. This question checks you thrive in that.</p>
      <ol>
        <li><strong>The change:</strong> a team cut, a reprioritisation, a deadline pulled in.</li>
        <li><strong>Re-plan:</strong> what is the minimum that still serves the decision? Cut scope deliberately and say what you dropped.</li>
        <li><strong>Leverage:</strong> automate or reuse so the work scales without more people.</li>
        <li><strong>Communicate:</strong> reset expectations and make trade-offs visible early.</li>
        <li><strong>Result</strong> with numbers.</li>
        <li><strong>Tone:</strong> adaptable and constructive. Complaining about the company or management sinks the answer.</li>
      </ol>`,
      answer: `<p><em>Structure to adapt with your own details.</em></p>
      <p>"Midway through a quarter our analytics team was cut from four people to two after a restructuring, and the priorities changed so that leadership reporting became our main job while the backlog of ad hoc requests stayed. I listed every recurring deliverable with its users and the decision it fed, and cut scope: we kept a minimum set of eight reports and retired eleven that nobody had opened in a month, telling owners why.</p>
      <p>Then I automated the three heaviest reports with scheduled queries and a template dashboard, and built a small self serve view for the most common ad hoc questions. I communicated the trade-offs to stakeholders in one note: what they would still get, what was gone and how to request exceptions, so expectations were reset before anyone was surprised.</p>
      <p>As a result we cut manual reporting time by about 12 hours a week and ad hoc requests fell by roughly 40% because of the self serve view. What I took from it is that resilience is mostly about adapting fast and choosing deliberately what not to do, rather than trying to do everything with fewer people."</p>`
    },
    {
      id: 'kc-h2',
      difficulty: 'hard',
      prompt: 'Before a review with an NBFC lending partner, a manager asks you to <strong>leave a poorly performing loan cohort out of the portfolio dashboard</strong> "so the numbers look cleaner". What do you do?',
      hint: 'Non-negotiable on integrity, but constructive: offer context, root cause and a remediation plan.',
      concepts: [
        { label: 'Calmly declines to misrepresent the portfolio', any: ['will not', 'cannot', 'not comfortable', 'non negotiable'], required: true },
        { label: 'Explains why: the NBFC partner relies on the data, trust and regulation', any: ['nbfc', 'partner', 'trust', 'regulat'], required: true },
        { label: 'Offers an alternative: full picture with context and a remediation plan', any: ['context', 'remediation', 'full picture', 'alternative'], required: true },
        { label: 'Investigates the root cause of the bad cohort', any: ['root cause', 'why the cohort', 'driver'], required: true },
        { label: 'Escalates if pressed', any: ['escalat', 'compliance', 'leadership'], required: true },
        { label: 'Documents the conversation and decision', any: ['document', 'in writing', 'email'] }
      ],
      approach: `<p>This tests integrity with real stakes. Khatabook's lending runs through NBFC partners who carry the loans on their books and decide future capital based on portfolio data. Misleading them is a trust and regulatory issue, not a presentation choice.</p>
      <ol>
        <li><strong>Decline calmly.</strong> No lecture, no accusation; assume the manager is under pressure.</li>
        <li><strong>Explain why:</strong> the partner relies on the data to price and allocate capital, they will see the cohort in their own books anyway, and getting caught destroys trust far more than a bad cohort does.</li>
        <li><strong>Offer a better alternative:</strong> show the full picture with context. Isolate the cohort, explain what drove it, show that newer cohorts are better if true, and present a remediation plan.</li>
        <li><strong>Find the root cause</strong> so the context is real: a channel, a policy change, a geography.</li>
        <li><strong>Escalate</strong> to leadership or compliance if pressed.</li>
        <li><strong>Document</strong> the decision.</li>
      </ol>`,
      answer: `<p>"I would calmly tell the manager that I am not comfortable removing the cohort, because it would misrepresent the portfolio. I would explain why: the NBFC partner relies on this data to decide pricing and how much capital to give us, they see the loans in their own books, so they will find the cohort anyway, and losing their trust would cost us far more than one bad cohort. There is also a regulatory angle, since lending data shared with a regulated partner must be accurate.</p>
      <p>Then I would offer an alternative that achieves what the manager actually wants, which is a credible review. I would investigate the root cause of the bad cohort, for example a specific acquisition channel or a loosened policy in one month, show the full picture with that cohort isolated and explained, show whether newer cohorts have improved, and attach a remediation plan describing what has already changed. Presented like that, a bad cohort with a clear diagnosis often increases a partner's confidence.</p>
      <p>If I were still pressed to exclude it, I would escalate to leadership or compliance, and I would document the conversation and the decision in an email so there is a clear record."</p>`
    },
    {
      id: 'kc-h3',
      difficulty: 'hard',
      prompt: 'Tell me about a <strong>mistake you made with data that reached stakeholders</strong>. What happened and what did you change?',
      hint: 'A real mistake, raised by you immediately, with impact, fix, root cause and a guardrail.',
      concepts: [
        { label: 'Raised it immediately and owned it', any: ['immediately', 'raised it', 'owned', 'myself'], required: true },
        { label: 'Quantified the impact and which decisions were affected', any: ['impact', 'which decisions', 'quantif'], required: true },
        { label: 'Fixed it and sent a correction', any: ['correct', 'fixed', 'reissued'], required: true },
        { label: 'Found the root cause', any: ['root cause', 'why it happened'], required: true },
        { label: 'Added a guardrail: test, reconciliation, review or alert', any: ['test', 'reconcil', 'review', 'alert', 'guardrail'], required: true },
        { label: 'No blame on others', any: ['my mistake', 'no blame', 'did not blame'] }
      ],
      approach: `<p>The most common weak answer is a failure story with no real failure. Pick a genuine one.</p>
      <ol>
        <li><strong>What happened,</strong> plainly.</li>
        <li><strong>You raised it yourself,</strong> immediately, before anyone else noticed if possible.</li>
        <li><strong>Impact:</strong> which numbers were wrong, by how much, and which decisions relied on them.</li>
        <li><strong>Fix and correction:</strong> corrected numbers sent to the same audience.</li>
        <li><strong>Root cause</strong> and the <strong>guardrail</strong> you added so it cannot recur.</li>
        <li><strong>No blame</strong> on the data, the engineers or the timeline.</li>
      </ol>`,
      answer: `<p><em>Structure to adapt with your own details.</em></p>
      <p>"I sent a weekly report showing a 15% jump in active users, and two days later I noticed the jump started exactly when I had changed a join. It was my mistake: a join to a device table had duplicated users with two phones. I raised it immediately with my manager and the report audience the same morning, before anyone else noticed.</p>
      <p>I quantified the impact: the true increase was 3%, and one decision relied on it, a team planning to scale a campaign based on the jump. I sent the corrected numbers to the same list with a short explanation and spoke to that team directly so they could pause the scale-up. The root cause was that I had added a join without checking row counts before and after. Since then I added a test that compares distinct user counts against the source table on every run, and I ask a peer to review any change to a report's core logic. I would rather catch my own errors than have someone else find them."</p>`
    },
    {
      id: 'kc-h4',
      difficulty: 'hard',
      prompt: 'You join Khatabook\'s Central Analytics team as a Data Analyst. <strong>What do you do in your first 90 days?</strong>',
      hint: 'Learn, reconcile, own, deliver. Write things down throughout.',
      concepts: [
        { label: 'First 30 days: learn the business, data model, metric definitions and people', any: ['first 30', 'data model', 'definitions', 'stakeholders'], required: true },
        { label: 'Reconcile one key metric end to end against the source of truth', any: ['reconcil', 'end to end', 'source of truth'], required: true },
        { label: 'Days 30 to 60: own a report or fact table, fix its quality, automate a manual report', any: ['own something', 'automat', 'fact table', 'manual report'], required: true },
        { label: 'Days 60 to 90: deliver an analysis that changes a decision', any: ['changes a decision', 'decision', 'analysis'], required: true },
        { label: 'Document definitions and write down assumptions', any: ['document', 'write down', 'assumption'], required: true },
        { label: 'Align with the manager on success and ask for feedback', any: ['feedback', 'success', 'manager'], required: true }
      ],
      approach: `<p>Show you will add value early without breaking things.</p>
      <ol>
        <li><strong>First 30 days:</strong> learn the business (ledger, payments, lending, SaaS), the data model, metric definitions and the stakeholders. Reconcile one key metric, such as monthly active merchants or disbursals, end to end against the source of truth.</li>
        <li><strong>Days 30 to 60:</strong> own a recurring report or fact table: fix its data quality, add tests, and automate a manual report.</li>
        <li><strong>Days 60 to 90:</strong> deliver one analysis that changes a decision.</li>
        <li><strong>Throughout:</strong> document definitions, write down assumptions and confirm them, agree with the manager what success looks like, and ask for feedback at 30 and 60 days.</li>
      </ol>`,
      answer: `<p>"In the first 30 days I would learn the business across ledger, payments, lending and SaaS, the data model and the metric definitions, and meet the main stakeholders to understand which decisions they make with our data. As a concrete exercise I would reconcile one key metric, say monthly active merchants or loan disbursals, end to end from the source of truth to the dashboard, which teaches the pipeline faster than any documentation.</p>
      <p>From day 30 to 60 I would own something: a recurring report or a fact table. I would fix its data quality issues, add tests and freshness checks, and automate any manual report steps around it so the team gets time back.</p>
      <p>From day 60 to 90 I would deliver one analysis that changes a decision, for example on activation or collections, presented with a clear recommendation. Throughout, I would document definitions as I learn them, write down assumptions and confirm them rather than waiting for perfect clarity, agree with my manager early on what success looks like, and ask for feedback at 30 and 60 days."</p>`
    },
    {
      id: 'kc-h5',
      difficulty: 'hard',
      prompt: 'You discover that <strong>"active merchant" is defined differently by product, growth and lending teams</strong>, and leadership has been seeing three different numbers for months. Nobody asked you to fix it. What do you do?',
      hint: 'Ownership without being asked, a technical fix in the data layer, and a careful rollout.',
      concepts: [
        { label: 'Quantify the discrepancy and which decisions it affects', any: ['quantif', 'discrepancy', 'decisions'], required: true },
        { label: 'Bring the owners together and agree one definition, with variants named explicitly', any: ['owners', 'agree', 'one definition'], required: true },
        { label: 'Encode it once in a certified dbt model or semantic layer', any: ['dbt', 'certified', 'semantic layer', 'single source'], required: true },
        { label: 'Communicate the change, restate history and annotate dashboards', any: ['restat', 'annotat', 'announce', 'communicat'], required: true },
        { label: 'Take ownership proactively rather than waiting to be asked', any: ['ownership', 'proactive', 'without being asked'], required: true },
        { label: 'Prevent recurrence: data dictionary, documentation and tests', any: ['dictionary', 'documentation', 'test'], required: true }
      ],
      approach: `<p>This combines ownership with Central Analytics' actual job: a single, trusted source of truth.</p>
      <ol>
        <li><strong>Quantify:</strong> how different are the three numbers, and which decisions used which one?</li>
        <li><strong>Own it proactively</strong>, without being asked, but with your manager informed.</li>
        <li><strong>Bring the owners together.</strong> Usually each definition is reasonable for its use, for example any app open, any entry, or an entry plus collection. Agree one headline definition and name the variants explicitly (active_entry, active_collection), rather than forcing one number to serve every purpose.</li>
        <li><strong>Encode once</strong> in a certified dbt model or semantic layer that every dashboard reads.</li>
        <li><strong>Roll out carefully:</strong> communicate the change, restate history on the new definition, annotate dashboards with the change date.</li>
        <li><strong>Prevent recurrence:</strong> a data dictionary, documentation and tests that fail if a dashboard computes the metric independently.</li>
      </ol>`,
      answer: `<p>"I would take ownership of it proactively, telling my manager what I had found, rather than waiting to be asked, because three versions of the same headline metric quietly erode trust in all our numbers. First I would quantify the discrepancy: how far apart the three numbers are, why, and which decisions have been made on which version.</p>
      <p>Then I would bring the owners from product, growth and lending together. Usually each definition is reasonable for its own purpose: any app open, any ledger entry, or an entry plus a collection. The goal is to agree on one definition for the headline active merchant number and name the variants explicitly, for example active by entry and active by collection, instead of forcing one number to serve every purpose.</p>
      <p>Technically, I would encode each definition once in a certified dbt model or semantic layer, the single source that every dashboard reads. I would communicate the change before it happens, restate history on the new definition so trends stay comparable, and annotate dashboards with the change date. To prevent recurrence I would add it to a data dictionary with documentation and owners, and add tests that flag dashboards computing the metric on their own."</p>`
    }
  ]
});
