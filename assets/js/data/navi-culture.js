/* Navi cultural fit round. The topic carries a `brief`, shown from the card and
   from the Brief button during the quiz, summarising the company, its businesses
   and the six Navi OS values as published on navi.com/our-values, plus how to
   frame why you want to join. Model answers are worked examples of structure;
   the specifics in an interview must be the candidate's own. */
DAQ.registerTopic({
  id: 'navi-culture',
  group: 'navi',
  name: 'Navi Cultural Fit',
  icon: '\uD83E\uDDED',
  blurb: 'The values round: what Navi is and sells, the six Navi OS principles, why you want to join, and behavioural answers on ownership, urgency, detail, integrity and prioritisation.',
  brief: `
  <h4>The 60-second version</h4>
  <p>Navi is a Bengaluru-based financial services company on a mission to <strong>make finance simple, accessible and affordable for a billion Indians</strong>. It was founded in <strong>2018 by Sachin Bansal and Ankit Agarwal</strong>, is digital-first with no branch network, and builds its own technology so its products work at scale and at low cost.</p>
  <div class="fact-grid">
    <div class="fact"><span>Founded</span>2018, by Sachin Bansal (Flipkart co-founder) and Ankit Agarwal</div>
    <div class="fact"><span>Mission</span>Finance that is simple, accessible and affordable for a billion Indians</div>
    <div class="fact"><span>Approach</span>Customer-first, tech-first, built in-house to work at scale</div>
    <div class="fact"><span>Legal entity</span>Navi Limited, formerly Navi Technologies Limited</div>
  </div>

  <h4>What Navi actually sells</h4>
  <ul>
    <li><strong>Loans</strong> — personal loans and home loans, approved and disbursed through the app. This is the core lending business and where credit risk matters most.</li>
    <li><strong>Insurance</strong> — health insurance, sold digitally rather than through agents.</li>
    <li><strong>Mutual funds</strong> — low-cost index funds through Navi AMC.</li>
    <li><strong>UPI and digital gold</strong> — high-volume payments that drive engagement and bring customers into the app regularly.</li>
  </ul>
  <div class="key"><strong>Why the mix matters in an interview:</strong> lending earns money slowly and can lose it later, so it lives or dies on credit quality; UPI is huge volume, thin margin and instant. If you can say that out loud, you sound like someone who understands the business rather than someone who read the website.</div>

  <h4>Where the analytics team sits</h4>
  <p>The central analytics team bridges business teams and data, across five verticals: <strong>Business and Product Analytics, Credit and Credit Risk Analytics, Collections and Biz-fin Analytics, Self-Serve and Automation</strong>. For a Data Analyst I the work is KPI visibility, essential reports and dashboards, automation for operational efficiency, and data modelling so other teams can self-serve.</p>

  <h4>The Navi OS: the six values they will score you on</h4>
  <ol>
    <li><span class="value-name">Start with the Customer.</span> Understand and fulfil customer needs, both stated and unstated, taking insights directly from customers. Impacting their lives meaningfully is what counts.</li>
    <li><span class="value-name">Master the Details.</span> Go deep, measure what matters, sweat the small stuff. Their line is that <em>strategy is a commodity and execution is a craft</em>.</li>
    <li><span class="value-name">Act with Urgency.</span> Big outcomes need velocity: don't wait for a perfect plan, experiment and iterate, and when you get it wrong, correct it, reflect and move on.</li>
    <li><span class="value-name">Own the Outcome.</span> Behave like a shareholder treating Navi's time and money as your own, do the right thing when nobody is watching, prioritise ruthlessly, be resilient, and own the result good or bad. No task is too big or too small.</li>
    <li><span class="value-name">Build for a Decade, Not a Day.</span> Think scale, be audacious on goals and rigorous where decisions are irreversible. They prize intrinsics — integrity, intelligence, agency — over tenure.</li>
    <li><span class="value-name">Win as One.</span> Collaboration over individual glory, organisation goals over personal ones, feedback given and taken with grace, open debate followed by commitment once a call is made.</li>
  </ol>
  <div class="key"><strong>The two that carry the most weight</strong> are <strong>Start with the Customer</strong> and <strong>Own the Outcome</strong>. Almost every behavioural question is really asking one of them: did you think about the person on the other side of the number, and did you carry the problem through to a result instead of handing it off?</div>

  <h4>Why you want to join Navi</h4>
  <p>Pick three reasons and make them specific to Navi, not to any fintech:</p>
  <ul>
    <li><strong>Scale of the problem.</strong> Credit and insurance for a billion Indians, most of whom have thin or no credit history, is a genuinely hard data problem rather than an incremental one.</li>
    <li><strong>Breadth of the central analytics role.</strong> Sitting across lending, credit risk, collections and product means seeing the whole business early in a career, instead of one narrow slice.</li>
    <li><strong>Ownership early.</strong> It is a high-agency environment where analysts are handed real problems and judged on outcomes rather than activity, which is how you want to learn.</li>
    <li><strong>The work matches what you already like doing.</strong> Turning messy data into dashboards people actually use, and automating the reporting nobody should be doing by hand.</li>
  </ul>
  <div class="key"><strong>Say what you would do, not just what you admire.</strong> Naming a Navi product you use, what you noticed about it, and the metric you would want to look at first is worth more than any amount of enthusiasm about the mission.</div>

  <h4>What this round is really testing, and what sinks candidates</h4>
  <ul>
    <li><strong>Structure.</strong> Answer behavioural questions as situation, what you did, what happened, with a number attached. Rambling reads as unclear thinking.</li>
    <li><strong>Ownership language.</strong> Say what <em>you</em> did. Constant "we" makes it impossible to tell what you contributed.</li>
    <li><strong>Honesty.</strong> Own a real mistake and what changed afterwards. A failure story with no failure in it is the most common weak answer.</li>
    <li><strong>Homework.</strong> Not knowing what Navi sells, or thinking it is only a loan app, is fatal in a values round.</li>
    <li><strong>Questions for them.</strong> Have two ready about the team, the metrics they own, or how success is measured in the first six months.</li>
  </ul>`,
  questions: [
    /* ---------------------------- EASY ---------------------------- */
    {
      id: 'nc-e1',
      difficulty: 'easy',
      prompt: '<strong>Why do you want to join Navi?</strong>',
      hint: 'Three specific reasons, at least one that could only be said about Navi, and end on what you would contribute.',
      concepts: [
        { label: 'Connects to the mission of simple, accessible, affordable finance at scale', any: ['mission', 'billion indian', 'accessible', 'affordable', 'simple', 'financial inclusion', 'underserved'], required: true },
        { label: 'Shows specific knowledge of Navi products or business', any: ['loan', 'upi', 'insurance', 'mutual fund', 'digital gold', 'app', 'product', 'lending'], required: true },
        { label: 'Names why the analytics role itself appeals, not just the company', any: ['analytics', 'dashboard', 'data', 'role', 'central team', 'reporting', 'automation', 'kpi'], required: true },
        { label: 'Values ownership and pace, matching how Navi works', any: ['ownership', 'own', 'agency', 'fast', 'pace', 'impact', 'autonomy', 'urgency'], required: true },
        { label: 'Explains what you bring, not only what you want', any: ['i bring', 'i can', 'my experience', 'i have built', 'contribute', 'skills'], required: true },
        { label: 'Grounded in something concrete: a product used, a number, an observation', any: ['i use', 'i noticed', 'for example', 'when i', 'my own', 'personally'] }
      ],
      approach: `<p>This question is scored on whether your reasons are specific to Navi. Use three reasons and a closing line about contribution, in under ninety seconds.</p>
      <ol>
        <li><strong>Reason one, the problem.</strong> Lending, insurance and investing for a billion Indians, many with thin credit files, is a hard data problem rather than an incremental one. Say why that appeals to you specifically.</li>
        <li><strong>Reason two, the role.</strong> The central analytics team sits across business, credit risk, collections and product, so an analyst sees the whole business early. Name the parts of the job description you actually want: KPI visibility, dashboards people use, automation, data modelling.</li>
        <li><strong>Reason three, how Navi works.</strong> High ownership from the start and outcomes over activity. Say that plainly, and if you have evidence that you work well that way, attach it.</li>
        <li><strong>Make one point unmistakably about Navi.</strong> Mention a product you use, what you noticed as a user, and the first metric you would want to see. That single sentence separates you from every candidate who read the careers page.</li>
        <li><strong>Close on contribution:</strong> one line on the SQL, dashboarding and automation you have done and where it fits this team.</li>
        <li><strong>Avoid:</strong> praising the founder, calling it a great brand, or saying anything that would be equally true of any fintech. Enthusiasm without specifics reads as a default answer.</li>
      </ol>`,
      answer: `<p><em>Structure to adapt with your own details.</em></p>
      <p>"Three reasons. First, the mission: making finance simple, accessible and affordable for a billion Indians is a hard problem, because a lot of those customers have thin or no credit history, so the decisions have to come from data rather than from precedent. That is the kind of analytics I want to do. Second, the role. The central analytics team works across business and product, credit risk, collections and automation, so as an analyst I would see how the whole business connects instead of one narrow slice, and the work described is exactly what I enjoy: building the reports and dashboards people rely on, and automating the manual reporting around them. Third, how Navi works. High ownership early and being judged on outcomes rather than activity is how I learn fastest.</p>
      <p>Concretely, I use Navi for UPI, and what struck me is how much of the experience depends on things an analyst would watch, like payment success rate by bank. If I joined, that is the sort of metric I would want to understand first, by segment rather than in aggregate.</p>
      <p>What I bring is a year of SQL and dashboard work, comfort with messy data, and a habit of automating anything I have had to repeat twice. I think that fits a team whose job is to give the business visibility it can trust."</p>`
    },
    {
      id: 'nc-e2',
      difficulty: 'easy',
      prompt: '<strong>What do you know about Navi?</strong> Cover what it does, who founded it, and how it makes money.',
      hint: 'Products, business model, founders, and the one distinction between lending and payments economics.',
      concepts: [
        { label: 'Digital-first financial services company based in Bengaluru', any: ['digital', 'app', 'fintech', 'financial services', 'bengaluru', 'bangalore', 'no branch'], required: true },
        { label: 'Founded in 2018 by Sachin Bansal and Ankit Agarwal', any: ['2018', 'sachin bansal', 'ankit agarwal', 'founder', 'flipkart'], required: true },
        { label: 'Names the product range: loans, insurance, mutual funds, UPI, digital gold', any: ['loan', 'insurance', 'mutual fund', 'upi', 'digital gold', 'personal loan', 'home loan'], required: true },
        { label: 'States the mission of affordable, accessible finance for a billion Indians', any: ['mission', 'billion', 'accessible', 'affordable', 'simple'], required: true },
        { label: 'Explains revenue: interest on lending, premiums, fund fees', any: ['interest', 'premium', 'fee', 'spread', 'revenue', 'margin', 'earns'], required: true },
        { label: 'Notes that lending revenue carries credit risk, unlike payments', any: ['credit risk', 'default', 'risk', 'loss', 'repay', 'npa'], required: true },
        { label: 'Mentions in-house technology enabling low cost and scale', any: ['in house', 'own tech', 'technology', 'scale', 'low cost', 'automat', 'tech first'] }
      ],
      approach: `<p>Keep it to about a minute, structured as what it is, what it sells, how it earns, and one insight that shows you thought about it.</p>
      <ol>
        <li><strong>What it is:</strong> a Bengaluru-based, digital-first financial services company founded in 2018 by Sachin Bansal, who co-founded Flipkart, and Ankit Agarwal. No branch network; everything runs through the app.</li>
        <li><strong>What it sells:</strong> personal and home loans, health insurance, low-cost index mutual funds through Navi AMC, plus UPI and digital gold.</li>
        <li><strong>How it earns:</strong> mostly interest income on lending, plus insurance premiums and fund management fees. UPI drives engagement and frequency rather than direct margin.</li>
        <li><strong>The mission framing:</strong> making finance simple, accessible and affordable for a billion Indians, pursued by building technology in-house so unit costs stay low enough to serve customers a traditional lender would not.</li>
        <li><strong>The insight that lands:</strong> lending revenue arrives with credit risk attached and only proves itself over months, while a UPI transaction settles instantly at thin margin. So the business is really about underwriting quality, and analytics has to read risk by cohort rather than in aggregate.</li>
        <li>If you use the app, say so and name something you noticed. Firsthand observation beats recitation.</li>
      </ol>`,
      answer: `<p>"Navi is a digital-first financial services company based in Bengaluru, founded in 2018 by Sachin Bansal, who co-founded Flipkart, and Ankit Agarwal. There is no branch network: the products are delivered through the app, and the technology is built in-house so it can operate at low cost and scale.</p>
      <p>The product range is personal and home loans, health insurance, low-cost index mutual funds through its AMC, plus UPI and digital gold. Revenue comes mainly from interest income on lending, with insurance premiums and fund fees alongside, while UPI mostly drives engagement and frequency rather than margin.</p>
      <p>The mission is making finance simple, accessible and affordable for a billion Indians, which matters because a large share of those customers have thin credit histories, so lending to them well depends on data rather than on traditional documentation.</p>
      <p>The part I find most interesting is that the two halves behave differently. A UPI transaction succeeds or fails in seconds and its margin is known immediately, whereas a loan is revenue today and possible default months later, so the real question in lending is credit quality by cohort rather than volume. That is also why the analytics function is central rather than a reporting afterthought."</p>`
    },
    {
      id: 'nc-e3',
      difficulty: 'easy',
      prompt: 'Navi\'s first value is <strong>Start with the Customer</strong>. What does that mean day to day for a data analyst who mostly builds dashboards and reports?',
      hint: 'Translate the value into concrete analyst behaviour, including the customer behind the number.',
      concepts: [
        { label: 'Remember the metric represents real customers, not just rows', any: ['real customer', 'real people', 'behind the number', 'not just a number', 'actual user', 'human'], required: true },
        { label: 'Start from the decision or question the dashboard must answer', any: ['decision', 'question', 'what will they do', 'purpose', 'use case', 'action'], required: true },
        { label: 'Treat internal stakeholders as users and design for their workflow', any: ['stakeholder', 'internal', 'user of the dashboard', 'their workflow', 'ask them', 'requirement'], required: true },
        { label: 'Segment rather than average, because averages hide affected customers', any: ['segment', 'average hides', 'not aggregate', 'cut by', 'break down', 'distribution'], required: true },
        { label: 'Surface customer pain in the data: failures, rejections, complaints, friction', any: ['failure', 'reject', 'complaint', 'friction', 'drop off', 'pain', 'error'], required: true },
        { label: 'Seek unstated needs, not just what was requested', any: ['unstated', 'not asked', 'beyond the request', 'underlying', 'real need', 'what they actually'], required: true },
        { label: 'Accuracy is a customer issue when numbers drive decisions about them', any: ['accuracy', 'correct', 'trust', 'wrong number', 'quality', 'reliab'] }
      ],
      approach: `<p>The trap is answering with slogans. Translate the value into behaviours somebody could observe in your work.</p>
      <ol>
        <li><strong>Start with the honest link:</strong> an analyst rarely meets a customer, but every row is one. A rejection rate is people who did not get a loan; a payment failure is someone whose rent did not go through. Saying that shows the value is real to you rather than recited.</li>
        <li><strong>Design from the decision.</strong> Before building, ask what decision the dashboard supports and what someone would do differently based on it. That prevents the pretty dashboard nobody opens.</li>
        <li><strong>Treat stakeholders as users too:</strong> ask how they will use it, when they look at it, and what they currently do by hand, then design to that workflow.</li>
        <li><strong>Segment rather than average.</strong> A 98% success rate looks fine until you see one bank at 70%. Customer-first analysis means looking for the group having a bad experience instead of reporting the comfortable mean.</li>
        <li><strong>Deliberately surface pain:</strong> failure reasons, rejection causes, drop-off points, repeated complaints. Reporting only the healthy metrics is not customer-first.</li>
        <li><strong>Go after the unstated need.</strong> If someone asks for a weekly report, ask what they are trying to catch; often they want an alert rather than a report. Navi words this as fulfilling stated and unstated needs.</li>
        <li><strong>Close on accuracy:</strong> when numbers drive decisions affecting customers, a wrong number is a customer problem, which is why validation is part of caring rather than pedantry.</li>
      </ol>`,
      answer: `<p>"For an analyst it starts with remembering that every row is a real customer. A rejection rate is people who did not get credit they may have needed, and a payment failure is someone whose transfer did not go through, so I try to talk about the metric in those terms rather than as a number that moved.</p>
      <p>Practically, it changes three things. First, I start from the decision: before building anything I ask what the dashboard is for and what someone would do differently because of it, which is also how I treat internal stakeholders as users and design around their actual workflow rather than a list of requested charts. Second, I segment instead of averaging. An overall success rate of 98% can hide one bank at 70%, and the customer-first version of that analysis is the one that finds the group having a bad experience. Third, I make sure the uncomfortable numbers are visible, so failure reasons, rejection causes and drop-off points sit on the dashboard next to the healthy metrics.</p>
      <p>The other part is looking for the unstated need. If someone asks for a weekly report, I ask what they are hoping to catch, because quite often they want an alert when something breaks rather than another report to read. And I treat accuracy as a customer issue: if a number drives a decision about customers, getting it wrong affects them, so validating it is part of the job rather than an extra."</p>`
    },
    {
      id: 'nc-e4',
      difficulty: 'easy',
      prompt: '<strong>Tell me about yourself.</strong> How would you structure a two-minute answer for this round?',
      hint: 'Present, past, why here. Finish pointed at Navi rather than trailing off.',
      concepts: [
        { label: 'Open with current role and scope in one or two lines', any: ['currently', 'right now', 'present role', 'at the moment', 'i work as'], required: true },
        { label: 'Give two or three concrete achievements with numbers', any: ['number', 'quantif', 'percent', 'reduced', 'built', 'automat', 'impact', 'metric'], required: true },
        { label: 'Name the relevant skills: SQL, Excel, a BI tool', any: ['sql', 'excel', 'tableau', 'power bi', 'python', 'dashboard'], required: true },
        { label: 'Show a coherent narrative rather than a resume readout', any: ['story', 'narrative', 'thread', 'why i moved', 'progress', 'led me'], required: true },
        { label: 'End by connecting to this role at Navi', any: ['which is why', 'navi', 'this role', 'brings me', 'fits'], required: true },
        { label: 'Keep it professional and time-bounded, around two minutes', any: ['two minute', '90 second', 'concise', 'short', 'brief', 'not too long'], required: true },
        { label: 'Show a trait Navi cares about: ownership, detail, urgency', any: ['ownership', 'own', 'detail', 'urgency', 'initiativ', 'end to end'] }
      ],
      approach: `<p>Use present, past, why here. It is the easiest structure to keep under two minutes and it ends where you want the conversation to go.</p>
      <ol>
        <li><strong>Present, about thirty seconds:</strong> your current role, who you work with and what you own. Scope, not job title.</li>
        <li><strong>Past, about sixty seconds:</strong> two or three achievements with numbers attached, chosen because they resemble this job. Reporting, dashboards, automation and data quality work are the relevant ones here, and name the tools: SQL, Excel, Tableau or Power BI.</li>
        <li><strong>Show a trait, not just tasks.</strong> Pick achievements that demonstrate ownership or attention to detail, since those are the values being scored, and say briefly what you did rather than what the team did.</li>
        <li><strong>Why here, about thirty seconds:</strong> the thread connecting your experience to this role, ending on Navi specifically. Never end on "that's about it".</li>
        <li><strong>Keep the narrative coherent.</strong> One reason for each move, so it sounds like a direction rather than a list of jobs. Do not walk through your resume chronologically; they have read it.</li>
        <li><strong>Rehearse the length.</strong> Two minutes maximum. Overrunning here costs you goodwill for the rest of the interview.</li>
      </ol>`,
      answer: `<p><em>Structure to fill with your own facts.</em></p>
      <p><strong>Present:</strong> "I currently work as an analyst supporting the operations and finance teams, where I own the daily and weekly reporting that the leadership review runs on, working directly with about four stakeholders."</p>
      <p><strong>Past, with numbers:</strong> "Two things I would pick out. I rebuilt a set of manual Excel reports into a single dashboard in Power BI, which removed roughly a day of manual work each week and meant everyone was finally looking at the same definition of the metric. And I found a data quality issue where duplicated rows were inflating a volume metric by about eight percent, traced it to the upstream extract, and added a check so it could not recur silently. Day to day I work in SQL and Excel, with Power BI for the reporting layer, and I use Python when data needs wrangling before it is usable."</p>
      <p><strong>Why here:</strong> "The thread is that I like owning a number end to end, from the pipeline through to the person making a decision with it, and automating the parts that should not be manual. That is why this role appealed: the central analytics team at Navi does exactly that across lending, risk and product, and I would rather learn in an environment where analysts are given real ownership early."</p>`
    },
    {
      id: 'nc-e5',
      difficulty: 'easy',
      prompt: 'Which of the <strong>Navi OS values resonates most with you</strong>, and which would stretch you the most? Be honest.',
      hint: 'Pick one you can prove with an example, and name a real growth area rather than a humblebrag.',
      concepts: [
        { label: 'Names a specific Navi value correctly', any: ['start with the customer', 'master the details', 'act with urgency', 'own the outcome', 'build for a decade', 'win as one'], required: true },
        { label: 'Explains what the value means in your own words', any: ['means', 'to me', 'understand', 'interpret', 'in practice'], required: true },
        { label: 'Backs the choice with a concrete example from your work', any: ['for example', 'when i', 'in my role', 'i once', 'last', 'i had to'], required: true },
        { label: 'Names a genuine stretch area without disguising a strength', any: ['stretch', 'harder', 'work on', 'improve', 'less natural', 'struggle', 'not my strength'], required: true },
        { label: 'Says what you are doing about the growth area', any: ['working on', 'i now', 'i have started', 'trying to', 'deliberately', 'habit'], required: true },
        { label: 'Shows awareness that speed and detail can pull against each other', any: ['tension', 'trade off', 'balance', 'pull against', 'conflict', 'versus'] },
        { label: 'Stays authentic rather than claiming to embody all of them', any: ['honest', 'genuinely', 'not all', 'truthfully', 'admit'] }
      ],
      approach: `<p>They are testing self-awareness. An answer where every value is a strength scores worse than an honest one.</p>
      <ol>
        <li><strong>Pick the value you can prove.</strong> Master the Details is a natural choice for an analyst, since accuracy is the job, but only if you have a story of catching something real.</li>
        <li><strong>Define it in your own words</strong> before the example, so it does not sound copied from the careers page. For Master the Details, their framing is that strategy is a commodity and execution is a craft.</li>
        <li><strong>Give the example in three sentences:</strong> the situation, what you specifically did, the outcome with a number if you have one.</li>
        <li><strong>Then name a real stretch.</strong> Act with Urgency is the honest answer for many careful analysts, because shipping something imperfect feels wrong. Say that plainly instead of picking a fake weakness.</li>
        <li><strong>Show the tension is understood:</strong> detail and speed genuinely pull against each other, and the resolution is deciding which decisions are reversible enough to move fast on.</li>
        <li><strong>Close with the action you are taking:</strong> a specific habit, such as sharing a rough cut within a day and labelling it provisional. Growth areas without a response sound like resignation.</li>
      </ol>`,
      answer: `<p>"The one that resonates most is Master the Details. To me it means the credibility of an analyst rests entirely on whether people can trust the number, and that strategy is easy to talk about while execution is where the craft actually is. For example, I was preparing a monthly report and noticed the volume was about eight percent higher than the operations team's own count. Rather than publishing with a caveat, I traced it to duplicated rows from a changed upstream extract, fixed the join, and added a row-count check so it would fail loudly next time. It delayed the report by half a day and avoided a wrong number reaching leadership.</p>
      <p>The one that would stretch me is Act with Urgency. My instinct is to validate thoroughly before I show anything, and in a fast environment that can become a way of holding work back. I have realised the two are in tension and the resolution is judging how reversible the decision is: if someone needs a directional read for a conversation today, a rough cut clearly labelled as provisional is more useful than a perfect number tomorrow. So I have started sharing early versions with the assumptions written down, and reserving the full validation for numbers that get published or drive an irreversible decision. It is deliberate rather than natural for me, which is why I would call it the stretch."</p>`
    },

    /* --------------------------- MEDIUM --------------------------- */
    {
      id: 'nc-m1',
      difficulty: 'medium',
      prompt: '<strong>Own the Outcome:</strong> tell me about a time you took ownership of something beyond your formal responsibility. What happened?',
      hint: 'Situation, what you personally did, result with a number, and why you did not just escalate it.',
      concepts: [
        { label: 'Sets up the situation briefly and concretely', any: ['situation', 'context', 'we had', 'i was working', 'the problem was', 'at the time'], required: true },
        { label: 'Explains that it was outside your remit or nobody owned it', any: ['not my', 'outside', 'nobody owned', 'no one was', 'beyond my role', 'not assigned'], required: true },
        { label: 'Uses I rather than we when describing your actions', any: ['i did', 'i built', 'i took', 'i decided', 'i spoke', 'i fixed'], required: true },
        { label: 'Describes concrete actions rather than intentions', any: ['built', 'fixed', 'wrote', 'set up', 'coordinated', 'automated', 'traced'], required: true },
        { label: 'States the outcome with a number or clear business effect', any: ['result', 'outcome', 'percent', 'hours', 'saved', 'reduced', 'prevented', 'impact'], required: true },
        { label: 'Shows follow-through to a durable fix, not just firefighting', any: ['follow through', 'permanent', 'documented', 'handed over', 'so it would not', 'root cause', 'lasting'], required: true },
        { label: 'Explains the judgement: why act rather than escalate and wait', any: ['rather than', 'could have escalated', 'judgement', 'decided to', 'instead of waiting', 'why i'], required: true },
        { label: 'Reflects on what you learned or would do differently', any: ['learned', 'next time', 'takeaway', 'in hindsight', 'would do'] }
      ],
      approach: `<p>Navi describes ownership as behaving like a shareholder, doing the right thing when nobody is watching, and owning the result good or bad. Choose a story where you did something inconvenient because it needed doing.</p>
      <ol>
        <li><strong>Pick the right story.</strong> Best is a problem sitting in a gap between teams that you picked up. A broken report nobody maintained, a data issue upstream of you, a manual process quietly costing hours.</li>
        <li><strong>Situation in two sentences.</strong> Enough context for the stakes to be clear, no more.</li>
        <li><strong>Say explicitly that it was not your job,</strong> because that is the whole point of the question, and mention that the easy option was to flag it and move on.</li>
        <li><strong>Actions in first person.</strong> "I traced", "I rebuilt", "I spoke to". If everything is "we", the interviewer cannot score you, and this is the most common way strong stories fail.</li>
        <li><strong>Outcome with a number:</strong> hours saved, error avoided, decision unblocked. If you have no number, give the concrete consequence instead.</li>
        <li><strong>Show the durable fix.</strong> Ownership means it stayed fixed: a check added, documentation written, a proper owner agreed. Firefighting alone is a weaker answer.</li>
        <li><strong>Add the judgement.</strong> Say why you acted rather than waiting, and acknowledge you kept people informed rather than going rogue, which also covers Win as One.</li>
      </ol>`,
      answer: `<p><em>Example shape; use your own situation.</em></p>
      <p><strong>Situation:</strong> "Our weekly business review depended on a report that pulled from an operations spreadsheet maintained by another team. It broke whenever their file format changed, which was roughly monthly, and because it was not owned by anyone in particular the usual outcome was that the review ran with stale numbers.</p>
      <p><strong>Why me:</strong> It was not my report and not my remit, and the easy option was to flag it in the meeting again. But I was the one people asked when the number looked wrong, so I decided to fix it properly rather than wait for someone to be assigned.</p>
      <p><strong>Action:</strong> I traced every break to the same cause, an unstable manual export, then spoke to the operations lead and agreed a fixed column format. I rewrote the ingestion to validate that format and fail with a clear message instead of loading silently, moved the transformation into SQL so it was reproducible, and documented it so it was not dependent on me.</p>
      <p><strong>Result:</strong> The report stopped breaking, we removed about three hours of weekly rework, and the review ran on current numbers. Two months later the format changed again and the check caught it the same morning rather than during the meeting.</p>
      <p><strong>Reflection:</strong> What I learned was to fix the process rather than the symptom, and to agree an owner as part of the fix. In hindsight I should have raised it earlier instead of absorbing the rework for a few weeks first."</p>`
    },
    {
      id: 'nc-m2',
      difficulty: 'medium',
      prompt: '<strong>Act with Urgency:</strong> describe a time you had to deliver with incomplete data or a tight deadline. How did you decide what was good enough?',
      hint: 'Show a deliberate trade-off with stated assumptions, not corner-cutting.',
      concepts: [
        { label: 'Describes real time pressure or missing information', any: ['deadline', 'urgent', 'short notice', 'incomplete', 'missing data', 'same day', 'few hours'], required: true },
        { label: 'Scoped down deliberately to what answered the decision', any: ['scope', 'narrow', 'cut', 'minimum', 'enough to', 'prioritis', 'prioritiz', 'focused on'], required: true },
        { label: 'Stated assumptions and caveats rather than hiding them', any: ['assumption', 'caveat', 'flagged', 'told them', 'directional', 'provisional', 'labelled'], required: true },
        { label: 'Distinguished reversible decisions from irreversible ones', any: ['reversib', 'irreversib', 'high stakes', 'directional', 'depends on the decision', 'how risky'], required: true },
        { label: 'Did the minimum validation needed for confidence in the direction', any: ['sanity check', 'quick check', 'validated', 'cross check', 'order of magnitude', 'sense check'], required: true },
        { label: 'Delivered on time and followed up with the fuller analysis', any: ['on time', 'delivered', 'followed up', 'later', 'then refined', 'came back'], required: true },
        { label: 'Communicated proactively rather than going quiet', any: ['communicat', 'told', 'update', 'flagged early', 'informed', 'kept them'], required: true },
        { label: 'Shows the outcome and what the speed enabled', any: ['result', 'decision', 'enabled', 'in time', 'impact', 'outcome'] }
      ],
      approach: `<p>Navi's wording is that they do not wait for perfect plans, iterate quickly, and correct mistakes rather than avoid them. Show speed with judgement, since reckless speed scores badly too.</p>
      <ol>
        <li><strong>Set up genuine pressure:</strong> a decision needed today, or data that was incomplete and would not be complete in time.</li>
        <li><strong>Show the scoping decision.</strong> Name what you cut and why: the one number the decision actually turned on, delivered instead of the full analysis. This is the core of the answer.</li>
        <li><strong>State the assumptions out loud.</strong> Speed is only acceptable when the caveats travel with the number, so say you labelled it directional and listed what you had assumed.</li>
        <li><strong>Apply the reversibility test.</strong> Fast and rough is right for a reversible or directional call, and wrong for something published or irreversible. Saying that shows the judgement is principled.</li>
        <li><strong>Keep the minimum validation:</strong> an order-of-magnitude check, a comparison against a known total. Fast should still not be wrong.</li>
        <li><strong>Communicate while working:</strong> tell people early what they will get and when, rather than going silent and delivering a surprise.</li>
        <li><strong>Close the loop:</strong> you delivered in time, the decision was made, and you followed up with the fuller version, ideally noting whether it confirmed the quick read.</li>
      </ol>`,
      answer: `<p><em>Example shape; use your own situation.</em></p>
      <p><strong>Situation:</strong> "A stakeholder needed to decide by the end of the day whether to pause a campaign that looked like it was underperforming. The full attribution data would not be complete for another two days, because conversions were still arriving.</p>
      <p><strong>Decision on scope:</strong> Rather than attempting the complete analysis, I asked what the decision actually turned on, which was whether performance was materially below the alternative use of that spend. That let me cut the scope to one comparison on the data I already had, which I could do in about two hours.</p>
      <p><strong>How I handled the gaps:</strong> I used the partial data with an explicit assumption about how many late conversions to expect, based on the previous month's lag curve, and I sanity-checked the total against the finance number so I knew I was not out by an order of magnitude. I sent it labelled clearly as directional, with the assumptions listed and a note on which way the estimate was likely to be biased. I also told the stakeholder in the morning what they would get and when, so nobody was waiting in the dark.</p>
      <p><strong>Result:</strong> They made the call the same day. When the full data landed two days later, the conclusion held, and I sent the confirmed version rather than leaving the provisional number as the last word.</p>
      <p><strong>The principle I apply:</strong> speed depends on reversibility. This was a reversible decision they could revisit within days, so a directional answer with stated assumptions was the right trade. Had it been a number going into a regulatory report, I would have pushed back on the deadline instead."</p>`
    },
    {
      id: 'nc-m3',
      difficulty: 'medium',
      prompt: '<strong>Master the Details:</strong> tell me about a mistake you made in your analysis. How was it caught, and what changed afterwards?',
      hint: 'A real mistake, owned plainly, with a systemic fix. Not a disguised success story.',
      concepts: [
        { label: 'Describes a real, specific error rather than a trivial one', any: ['i made', 'my mistake', 'i got it wrong', 'error', 'incorrect', 'i missed', 'wrong number'], required: true },
        { label: 'Owns it without blaming others or the data', any: ['my fault', 'i should have', 'i own', 'on me', 'my responsibility', 'no excuse'], required: true },
        { label: 'Explains the root cause honestly', any: ['because', 'root cause', 'reason', 'due to', 'i had assumed', 'i did not check'], required: true },
        { label: 'States the consequence and who was affected', any: ['consequence', 'impact', 'affected', 'decision', 'stakeholder', 'reported', 'result'], required: true },
        { label: 'Raised it proactively rather than hoping it went unnoticed', any: ['told them', 'i told', 'raised it', 'flagged', 'immediately', 'proactiv', 'i informed', 'owned up', 'noticed it myself', 'same morning'], required: true },
        { label: 'Fixed it quickly and corrected the record', any: ['corrected', 'fixed', 'reissued', 'republish', 'restated', 'resolved'], required: true },
        { label: 'Put a systemic check in place so it cannot silently recur', any: ['check', 'test', 'validation', 'process', 'reconcil', 'so it cannot', 'automat', 'peer review'], required: true },
        { label: 'Shows the lasting habit change rather than just a lesson stated', any: ['now i always', 'since then', 'habit', 'i changed', 'standard', 'every time'], required: true }
      ],
      approach: `<p>This question is scored on honesty and on whether the fix was systemic. A story where nothing actually went wrong is the weakest possible answer.</p>
      <ol>
        <li><strong>Choose a real mistake</strong> with a real consequence, but one you resolved. A wrong number that reached a stakeholder, a metric defined differently from how the business meant it, a join that duplicated rows.</li>
        <li><strong>Own it in the first sentence.</strong> No blaming the source system, the deadline or a colleague. Navi's framing is owning the result good or bad, and this is where that is tested.</li>
        <li><strong>Give the honest root cause:</strong> usually an unverified assumption, a skipped check, or not confirming a definition before building.</li>
        <li><strong>State the consequence plainly,</strong> including who was affected. Understating it reads as evasion.</li>
        <li><strong>Show that you raised it,</strong> ideally before anyone else noticed. Self-reporting an error is the strongest signal in the whole answer, and it is exactly "do the right thing when no one is watching".</li>
        <li><strong>Then the systemic fix.</strong> "I was more careful afterwards" is weak. A reconciliation check, an automated test, a definition agreed and documented, peer review on published numbers: something that would catch it without depending on your memory.</li>
        <li><strong>End on the habit that stuck,</strong> such as always reconciling a new number against an existing source before publishing.</li>
      </ol>`,
      answer: `<p><em>Example shape; use your own situation.</em></p>
      <p><strong>The mistake:</strong> "Early in my current role I published a weekly performance number that was about twelve percent too high. It went into a review deck and was quoted in a meeting before anyone questioned it. That was my error: I had joined a transactions table to a status table without realising the status table had multiple rows per transaction, so the join duplicated rows and inflated the total.</p>
      <p><strong>Root cause, honestly:</strong> I assumed the grain of a table I had not used before instead of checking it, and I did not reconcile my output against any existing source. Both would have caught it in five minutes.</p>
      <p><strong>What I did:</strong> I noticed it myself the following week while building something adjacent, and rather than quietly correcting it going forward I flagged it the same morning to my manager and to the stakeholder who had used the figure, explained what was wrong and by how much, and sent the corrected series with a short note on the cause. It was uncomfortable, but they were making resourcing decisions off the trend and needed to know.</p>
      <p><strong>The fix:</strong> Beyond correcting the report, I added a row-count check comparing input and output rows so any accidental fan-out fails the build instead of loading silently, and I now reconcile every new metric against an existing owned source before it is published for the first time. Since then I also check the grain of any table I have not worked with before, in writing, as a first step. The habit came directly from that mistake."</p>`
    },
    {
      id: 'nc-m4',
      difficulty: 'medium',
      prompt: '<strong>Win as One:</strong> tell me about a time you disagreed with a stakeholder or a senior colleague. How did you handle it?',
      hint: 'Debate with evidence, then commit to the decision even if it goes against you.',
      concepts: [
        { label: 'Describes a genuine disagreement, not a misunderstanding', any: ['disagree', 'different view', 'pushed back', 'i thought', 'conflict', 'opposed'], required: true },
        { label: 'Sought to understand their reasoning first', any: ['understand', 'asked', 'listened', 'their reason', 'why they', 'context'], required: true },
        { label: 'Argued with data and evidence rather than opinion', any: ['data', 'evidence', 'numbers', 'showed', 'analysis', 'proof'], required: true },
        { label: 'Raised it directly and privately rather than escalating first', any: ['directly', 'privately', 'one on one', 'spoke to them', 'not in front', 'went to them'], required: true },
        { label: 'Kept it about the problem, not the person', any: ['not personal', 'about the problem', 'respect', 'professional', 'the issue', 'objective'], required: true },
        { label: 'Committed fully once the decision was made', any: ['commit', 'went with', 'supported', 'once decided', 'disagree and commit', 'backed'], required: true },
        { label: 'Prioritised the organisation goal over being right', any: ['bigger picture', 'org', 'team goal', 'not about being right', 'business', 'over my own'], required: true },
        { label: 'Reflects on the outcome, including if you were wrong', any: ['outcome', 'turned out', 'i was wrong', 'they were right', 'learned', 'in the end'] }
      ],
      approach: `<p>Navi's wording is open debate but commitment once a decision is made. Show both halves, because candidates usually show only one.</p>
      <ol>
        <li><strong>Pick a real disagreement with something at stake:</strong> a metric definition, a conclusion drawn from your analysis, a priority call.</li>
        <li><strong>Start by understanding them.</strong> Say you asked why they held their view first, since often the disagreement dissolves into different assumptions or context you did not have.</li>
        <li><strong>Bring evidence, not volume.</strong> Show the data, the definitions, the counterexample. As an analyst your credibility is that your position is checkable.</li>
        <li><strong>Handle it well socially:</strong> raise it directly with them and in private rather than contradicting them in a meeting or escalating over their head, and keep it about the problem rather than the person.</li>
        <li><strong>Then the crucial half: commit.</strong> If the decision went against you, you supported it properly rather than sulking or quietly hedging. Say so explicitly, because this is the part being scored.</li>
        <li><strong>Show the org came first.</strong> Sometimes the right move is accepting a definition you find imperfect because consistency across teams matters more than your preference.</li>
        <li><strong>Be willing to have been wrong.</strong> A story where you turned out to be mistaken and said so is stronger than one where you were vindicated.</li>
      </ol>`,
      answer: `<p><em>Example shape; use your own situation.</em></p>
      <p><strong>Situation:</strong> "A stakeholder wanted to report active users on a definition that counted anyone who opened the app, while I thought it should require a completed action, because the looser definition was showing growth that I did not believe was real engagement.</p>
      <p><strong>How I approached it:</strong> First I asked why they preferred it, and learned they needed consistency with a number already being reported upward, which was a legitimate reason I had not known. Then I made my case with evidence rather than opinion: I produced both series side by side and showed that the gap between them was widening, which meant the trend people were reading was partly definitional rather than behavioural. I did that directly with them beforehand rather than raising it in the review, because the point was to get the number right, not to be seen disagreeing.</p>
      <p><strong>The decision:</strong> We agreed to keep their definition as the headline for continuity, and to add the stricter one alongside it as an engagement measure, with both documented so nobody confused them. That was not exactly my position, but it served the organisation better than forcing a redefinition mid-quarter, and once it was decided I built it that way properly and used their definition consistently rather than continuing to argue in footnotes.</p>
      <p><strong>Reflection:</strong> Two things. Understanding their constraint changed my proposal, so asking first was worth more than arguing better. And when the two series were tracked together, the divergence became visible enough that they raised the redefinition themselves a quarter later, which was a better outcome than winning the argument at the time."</p>`
    },
    {
      id: 'nc-m5',
      difficulty: 'medium',
      prompt: 'Why should we hire you for this role, and <strong>what questions do you have for us?</strong>',
      hint: 'Match yourself to the job description explicitly, then ask two questions that show you thought about the work.',
      concepts: [
        { label: 'Maps your skills directly to the requirements of this role', any: ['sql', 'excel', 'tableau', 'power bi', 'dashboard', 'requirement', 'job description', 'matches'], required: true },
        { label: 'Gives evidence rather than adjectives', any: ['for example', 'i built', 'i automated', 'number', 'percent', 'evidence', 'in my role'], required: true },
        { label: 'Shows understanding of what the analytics team actually does', any: ['central analytics', 'kpi', 'reporting', 'automation', 'data model', 'stakeholder', 'visibility', 'credit risk'], required: true },
        { label: 'Acknowledges gaps honestly with a learning plan', any: ['gap', 'less experience', 'learning', 'newer to', 'not yet', 'developing'], required: true },
        { label: 'Frames value in terms of business impact, not tasks', any: ['impact', 'decision', 'business', 'outcome', 'value', 'help the team'], required: true },
        { label: 'Asks a question about the team, metrics or priorities', any: ['what does', 'how does the team', 'which metric', 'priorit', 'first six months', 'success look'], required: true },
        { label: 'Asks something that shows genuine thought about the work', any: ['data platform', 'etl', 'stack', 'self serve', 'stakeholder', 'vertical', 'automation', 'tooling'], required: true },
        { label: 'Avoids asking only about salary, leave or promotion', any: ['not just', 'later', 'appropriate', 'avoid', 'after'] }
      ],
      approach: `<p>Two halves, both scored. The first is a focused match to the role; the second signals whether you actually want this job.</p>
      <ol>
        <li><strong>Structure the pitch as three matches</strong> against the job description: the tooling, meaning SQL, Excel and a BI tool; the work, meaning KPI reporting, dashboards and automation; and the working style, meaning ownership and stakeholder handling.</li>
        <li><strong>Attach evidence to each,</strong> with a number where possible. Adjectives like detail-oriented carry nothing without an example.</li>
        <li><strong>Show you understand the team,</strong> that it is central analytics serving business, credit risk, collections and product, so the value is visibility other teams can trust and self-serve from.</li>
        <li><strong>Name a gap honestly</strong> and how you are closing it. For an entry-level role, admitting less exposure to formal data modelling while showing you have read into it is more credible than claiming everything.</li>
        <li><strong>Frame value as impact:</strong> not "I build dashboards" but "I make the number reliable enough that people stop arguing about it and start deciding".</li>
        <li><strong>Then ask two real questions.</strong> Good ones: which vertical this role sits closest to, what the team's biggest data gap is today, what success looks like in the first six months, how much of the work is automation versus new analysis, and what the platform and ETL stack looks like.</li>
        <li><strong>Leave compensation and leave policy for HR.</strong> Asking those first in a values round reads as indifference to the work.</li>
      </ol>`,
      answer: `<p>"Three reasons, mapped to what the role needs. On tools, the day-to-day here is SQL, Excel and a BI layer, which is exactly what I work in: I have built and now maintain the weekly reporting for my current team in SQL and Power BI, and I use Python when data needs cleaning before it is usable. On the work itself, the parts described as KPI visibility and automation are what I have actually done, for instance replacing a manual Excel process with a dashboard that removed about a day of work a week and gave everyone one definition of the metric. On working style, I am used to owning a number end to end and dealing with stakeholders directly, including telling someone their favourite figure was wrong.</p>
      <p>Where I am lighter is formal data modelling. I have designed practical schemas for reporting rather than a warehouse from scratch, so I would be learning that early, and it is part of why the role interests me. What I think I bring is less about producing charts and more about making numbers people trust enough to decide on, which for a central analytics team is the whole point.</p>
      <p>Two questions from my side. First, which of the verticals would this role sit closest to, business and product analytics or credit and risk, and how much movement is there between them? Second, what does success look like for someone in this seat in the first six months, and how much of the work today is building new visibility versus automating reporting that already exists? I would also be interested in what the data platform and ETL setup looks like, since that shapes how much of the job is self-serve enablement."</p>`
    },

    /* ---------------------------- HARD ---------------------------- */
    {
      id: 'nc-h1',
      difficulty: 'hard',
      prompt: '<strong>Build for a Decade, Not a Day:</strong> describe a time you had to choose between a quick fix and a durable solution. How did you decide, and how did you justify it?',
      hint: 'The strong answer shows a criterion for choosing, and that you sometimes correctly chose the quick fix.',
      concepts: [
        { label: 'Describes a real trade-off between speed and durability', any: ['quick fix', 'short term', 'proper solution', 'durable', 'long term', 'shortcut', 'trade off'], required: true },
        { label: 'Names the criterion used to decide, not just the choice', any: ['criterion', 'how i decided', 'depends on', 'because', 'i asked whether', 'framework'], required: true },
        { label: 'Considers how often the thing will be used or repeated', any: ['how often', 'repeat', 'recurring', 'one off', 'frequency', 'again', 'temporary'], required: true },
        { label: 'Considers reversibility and cost of getting it wrong', any: ['reversib', 'irreversib', 'cost of', 'risk', 'hard to change', 'stakes'], required: true },
        { label: 'Counts the maintenance and rework cost of the shortcut', any: ['maintenance', 'tech debt', 'rework', 'debt', 'cost later', 'keeps breaking'], required: true },
        { label: 'Communicated the trade-off to stakeholders rather than deciding silently', any: ['told', 'explained', 'communicat', 'stakeholder', 'agreed', 'transparent', 'flagged'], required: true },
        { label: 'Sometimes the quick fix is genuinely correct', any: ['sometimes', 'quick fix was right', 'not always', 'depends', 'correct to', 'temporary was'], required: true },
        { label: 'Made the shortcut explicit and time-bounded if taken', any: ['time bound', 'documented', 'revisit', 'deadline to fix', 'flagged as temporary', 'ticket'], required: true },
        { label: 'States the outcome and whether the choice proved right', any: ['outcome', 'result', 'proved', 'looking back', 'held up', 'paid off'], required: true }
      ],
      approach: `<p>Navi's framing is thinking at scale, being audacious on goals and rigorous where decisions are irreversible. Show a decision rule rather than a preference for doing things properly.</p>
      <ol>
        <li><strong>Set up a real fork:</strong> a request you could satisfy in an afternoon with a manual extract, or in a week with a modelled, automated version.</li>
        <li><strong>State your criterion before the choice.</strong> Frequency: will this be asked again? Reversibility: how expensive is it to change later? Blast radius: how many people or decisions depend on it?</li>
        <li><strong>Count the real cost of the shortcut,</strong> which is rarely the build time. It is the recurring manual effort, the risk of a silent error, and the fact that shortcuts become load-bearing.</li>
        <li><strong>Communicate rather than deciding alone.</strong> Present both options with their costs and let the stakeholder weigh in. Silently spending a week on the elegant version when a day was needed is its own failure.</li>
        <li><strong>Show that you sometimes choose fast, correctly.</strong> A one-off number for a single decision should not become a modelled pipeline; over-engineering is a real failure mode and admitting it makes the answer credible.</li>
        <li><strong>When you do take the shortcut, make it explicit:</strong> label it temporary, raise a ticket, set a date to revisit. Undocumented shortcuts are how a reporting layer rots.</li>
        <li><strong>Close on the outcome,</strong> including whether your call proved right in hindsight.</li>
      </ol>`,
      answer: `<p><em>Example shape; use your own situation.</em></p>
      <p><strong>Situation:</strong> "A business team asked for a view combining data from two systems that had never been joined. I could produce it in an afternoon with a manual extract and some lookups, or spend around a week defining the mapping properly, modelling it and automating the refresh.</p>
      <p><strong>How I decided:</strong> I asked three questions. Would this be needed repeatedly, or was it a one-off? How reversible was the choice, meaning how costly would it be to redo later? And how many decisions would depend on it? Here the answer was clear: it was going into a recurring monthly review, several teams would use it, and the joining logic was genuinely non-obvious, so a manual version would have to be repeated every month by someone who might get the mapping subtly wrong. The maintenance cost, not the build cost, decided it.</p>
      <p><strong>What I did:</strong> I did both, deliberately. I delivered the manual version that week so the immediate decision was not blocked, told the stakeholder explicitly that it was a temporary cut with a documented risk of inconsistency, and agreed a two-week window to build the durable version. That way they got speed without the shortcut quietly becoming permanent.</p>
      <p><strong>Result:</strong> The automated version has run monthly since with no rework, and because the mapping is documented, two other teams have used it without re-deriving it.</p>
      <p><strong>The honest other half:</strong> I have also got this wrong in the opposite direction, building a properly modelled solution for something that turned out to be a genuine one-off, which was time spent for nothing. So my rule now is that the durable version is justified by repetition, dependency or irreversibility, and if none of those hold, the quick answer is the correct answer, as long as it is labelled as temporary and has a date to revisit."</p>`
    },
    {
      id: 'nc-h2',
      difficulty: 'hard',
      prompt: 'A senior stakeholder asks you to <strong>present only the favourable cut of the data</strong> for a leadership review, leaving out a segment that looks bad. What do you do?',
      hint: 'This is the integrity question. Refuse the misleading framing without turning it into a confrontation.',
      concepts: [
        { label: 'Recognises this as an integrity issue, not just a formatting preference', any: ['integrity', 'honest', 'mislead', 'ethic', 'not right', 'wrong to', 'principle'], required: true },
        { label: 'Does not simply comply with a misleading presentation', any: ['would not', 'cannot', 'refuse', 'push back', 'not comfortable', 'decline'], required: true },
        { label: 'Seeks to understand their motivation first, assuming good faith', any: ['understand', 'why', 'ask them', 'their concern', 'good faith', 'maybe they', 'reason'], required: true },
        { label: 'Distinguishes legitimate focus and simplification from omission that misleads', any: ['difference', 'legitimate', 'focus', 'simplif', 'context', 'relevant', 'versus'], required: true },
        { label: 'Offers a constructive alternative: include it with context or a plan', any: ['alternative', 'include it with', 'context', 'plan', 'framing', 'appendix', 'alongside'], required: true },
        { label: 'Raises it privately with them before escalating', any: ['privately', 'directly', 'first speak', 'one on one', 'before escalat', 'them first'], required: true },
        { label: 'Notes that omission usually surfaces later and costs more', any: ['come out', 'surface', 'later', 'found out', 'worse', 'credibility', 'discover'], required: true },
        { label: 'Would escalate through the right channel if pressure continued', any: ['escalat', 'my manager', 'raise it', 'someone else', 'channel', 'go to'], required: true },
        { label: 'Anchors on customers and the decision being made', any: ['customer', 'decision', 'business', 'they need to know', 'right decision', 'risk'], required: true },
        { label: 'Does the right thing even when nobody would notice', any: ['no one would', 'even if', 'nobody watching', 'would not be caught', 'regardless'] }
      ],
      approach: `<p>Navi lists doing the right thing when no one is watching under Own the Outcome. The answer must be firm on the principle and skilled on the delivery, since a candidate who is righteous but unworkable also fails.</p>
      <ol>
        <li><strong>Name the line.</strong> Choosing what to emphasise is normal; removing a segment so the picture reads better than reality is misleading, and I would not present it that way.</li>
        <li><strong>Assume good faith and ask why.</strong> Often the motivation is legitimate: the segment is tiny, or already known and being worked on, or the review has ten minutes. Understanding that shapes the solution.</li>
        <li><strong>Draw the distinction explicitly:</strong> simplifying for an audience is fine, and so is putting detail in an appendix. Omitting something that would change the conclusion is not.</li>
        <li><strong>Offer the constructive path,</strong> which usually resolves it: include the segment with context and, if there is one, the mitigation plan. That is often better for the stakeholder, because presenting a problem with a plan beats being asked about it later without one.</li>
        <li><strong>Handle it privately first.</strong> Raise it one to one rather than in the room or by escalating immediately, so they can change position without losing face.</li>
        <li><strong>Use the practical argument, not just the moral one:</strong> bad numbers surface eventually, and the cost then is credibility, both theirs and the analysis's.</li>
        <li><strong>Say where your line is.</strong> If pressure continued, I would decline to put my name to a misleading slide and would raise it with my manager. State that calmly rather than dramatically.</li>
        <li><strong>Anchor on the customer and the decision:</strong> if the hidden segment is a group having a bad experience, hiding it means the business does not fix it, which fails Start with the Customer as much as it fails integrity.</li>
      </ol>`,
      answer: `<p>"I would not present it that way, and I would try to solve it with them rather than turn it into a confrontation.</p>
      <p>First I would ask why, assuming good faith, because the reason often changes the answer. If the segment is genuinely immaterial, or the issue is already known and being actively fixed, or the review is ten minutes long, those are legitimate reasons to simplify, and I would be happy to put detail in an appendix and focus the main slide. What I would not do is leave out something that would change the conclusion a reader draws. That is the line for me: choosing emphasis is normal, omitting a fact that alters the decision is misleading.</p>
      <p>So I would offer the alternative, which is usually better for them anyway: include the weak segment with context, its size, and what is being done about it. Presenting a problem with a plan is far stronger than being asked about it in the room with no answer, and it protects their credibility rather than risking it. I would raise all of this privately with them first, not in the meeting and not by going over their head, so they can shift position easily.</p>
      <p>If they insisted, I would be straightforward: I would not put my name to an analysis I believe misleads, and I would tell them I was going to raise it with my manager, so nothing happens behind their back. Two reasons I would hold that line even if nobody would ever notice. The practical one is that these things surface later, and the cost when they do is trust in every number we produce. The more important one is that the segment is customers having a worse experience, and if leadership does not see it, nobody fixes it. That is the opposite of starting with the customer."</p>`
    },
    {
      id: 'nc-h3',
      difficulty: 'hard',
      prompt: 'Three stakeholders each want their request done today and all call it urgent. You can finish one. <strong>How do you decide and how do you communicate it?</strong>',
      hint: 'Prioritise on impact and deadline, then over-communicate. Silence is the real failure here.',
      concepts: [
        { label: 'Gets the real deadline and the decision behind each request', any: ['deadline', 'when do you need', 'what decision', 'why', 'what happens if', 'driving'], required: true },
        { label: 'Prioritises on impact and consequence of delay, not on who asked loudest', any: ['impact', 'consequence', 'cost of delay', 'not who', 'loudest', 'seniority', 'business value'], required: true },
        { label: 'Distinguishes genuinely urgent from habitually urgent', any: ['genuinely', 'really urgent', 'habit', 'always urgent', 'actually', 'test'], required: true },
        { label: 'Looks for a smaller version that unblocks a decision quickly', any: ['smaller', 'partial', 'quick answer', 'minimum', 'directional', 'first cut', 'unblock'], required: true },
        { label: 'Checks whether a request is already answered or can be self-served', any: ['already exists', 'existing', 'self serve', 'point them', 'reuse', 'dashboard already'], required: true },
        { label: 'Communicates the trade-off transparently, with what and when', any: ['tell them', 'tell all', 'i tell', 'let them know', 'communicat', 'transparent', 'by when', 'what they are getting', 'expectation', 'update', 'inform'], required: true },
        { label: 'Says no clearly rather than going quiet or over-promising', any: ['say no', 'clear', 'not today', 'cannot', 'rather than', 'over promis', 'honest'], required: true },
        { label: 'Escalates to a manager to arbitrate genuine conflicts', any: ['manager', 'escalat', 'arbitrat', 'lead', 'decide between', 'help me prioritis'], required: true },
        { label: 'Addresses the recurring cause, such as automation or self-serve', any: ['recurring', 'pattern', 'automat', 'self serve', 'prevent', 'root cause', 'next time'], required: true }
      ],
      approach: `<p>Navi's ownership value explicitly includes prioritising ruthlessly and being a source of clarity in chaos. Show a triage method plus adult communication.</p>
      <ol>
        <li><strong>Get the facts before choosing.</strong> Ask each person what decision the output feeds, the true deadline, and what happens if it comes tomorrow. Urgent often means "on my mind today", and this question usually resolves the conflict on its own.</li>
        <li><strong>Rank on consequence, not volume or seniority.</strong> A number blocking a regulatory filing or a same-day decision on live spend beats a nice-to-have for a deck next week, whoever asked.</li>
        <li><strong>Look for the cheap wins first.</strong> One request may already be answered by an existing dashboard, and another may need only a directional cut rather than the full analysis. Frequently two of the three can be handled in an hour, which changes the whole picture.</li>
        <li><strong>Decide, then communicate immediately.</strong> Tell all three what you are doing, in what order, and when they will get theirs. People accept waiting far better than they accept uncertainty, and going quiet is the actual failure mode here.</li>
        <li><strong>Say no clearly.</strong> "Not today, but by eleven tomorrow" is respectful; a vague "I'll try" that misses is worse for everyone.</li>
        <li><strong>Escalate a genuine tie</strong> rather than guessing. If two are truly critical and mutually exclusive, that is a prioritisation call for the manager who owns both, and bringing it to them with options is ownership, not weakness.</li>
        <li><strong>Then fix the pattern.</strong> If the same ad-hoc requests recur, the durable answer is a self-serve dashboard or an automated report, which is precisely what the analytics team is for.</li>
      </ol>`,
      answer: `<p>"First I would get the facts rather than picking. I would go back to each of them with the same three questions: what decision does this feed, when do you genuinely need it, and what happens if it lands tomorrow morning. In my experience that alone resolves most of it, because urgent frequently means it is top of mind rather than time-critical.</p>
      <p>Then I would rank on consequence of delay rather than on who asked most forcefully or who is most senior. Something blocking a same-day decision, a filing or live spend outranks an input to a deck for next week. I would also check the cheap options before assuming I can only do one: it is common that one request is already answered by an existing report I can point them to, and that another needs only a directional first cut rather than the full analysis, so realistically I can often unblock two of the three quickly and do the heavy one properly.\n</p>
      <p>Whatever I decide, I would tell all three straight away: what I am doing first, what they are getting and when. Being clear that something is coming tomorrow at eleven is far better received than silence or a vague promise I might miss, and going quiet under pressure is the thing that actually damages trust. If two are genuinely critical and mutually exclusive, I would not silently guess whose work matters more; I would take it to my manager with the trade-off laid out and a recommendation, since that is a prioritisation call for whoever owns both.</p>
      <p>Afterwards I would look at whether this recurs. If the same ad-hoc requests keep arriving, the real fix is a self-serve dashboard or an automated report so nobody has to queue for me at all, which is a better use of my time than being the bottleneck three people are waiting on."</p>`
    },
    {
      id: 'nc-h4',
      difficulty: 'hard',
      prompt: 'Navi is a <strong>high-agency environment</strong>: you may be handed an ambiguous problem with little guidance. Tell me how you would operate in your first ninety days, and how you handle being stuck.',
      hint: 'Show a method for turning ambiguity into a scoped problem, plus a sensible rule for when to ask for help.',
      concepts: [
        { label: 'Clarifies the problem and success criteria before starting work', any: ['clarify', 'what does success', 'define the problem', 'scope', 'understand the ask', 'criteria'], required: true },
        { label: 'Invests early in learning the data, systems and definitions', any: ['learn the data', 'understand the data', 'explore', 'definition', 'schema', 'pipeline', 'how things work'], required: true },
        { label: 'Builds relationships with stakeholders and finds who owns what', any: ['stakeholder', 'relationship', 'who owns', 'talk to', 'meet', 'context from'], required: true },
        { label: 'Breaks ambiguity into a small first deliverable to get traction', any: ['break', 'smaller', 'first version', 'start with', 'incremental', 'quick win', 'scope down'], required: true },
        { label: 'Writes down assumptions and validates them rather than guessing', any: ['assumption', 'write down', 'validate', 'confirm', 'check with', 'document'], required: true },
        { label: 'Shows early work for feedback instead of disappearing', any: ['early', 'show', 'feedback', 'iterate', 'draft', 'check in', 'not disappear'], required: true },
        { label: 'Has a rule for time-boxing before asking for help', any: ['time box', 'timebox', 'two hours', 'a day', 'before asking', 'rule', 'how long'], required: true },
        { label: 'Asks for help with context and options, not a blank question', any: ['with context', 'what i tried', 'options', 'specific question', 'here is what', 'not just stuck'], required: true },
        { label: 'Delivers something concrete and useful within the period', any: ['deliver', 'shipped', 'by the end', 'something useful', 'first 90', 'impact'], required: true },
        { label: 'Owns the outcome without waiting to be told what to do next', any: ['without being told', 'proactiv', 'initiativ', 'own', 'do not wait', 'agency'], required: true }
      ],
      approach: `<p>Two things are being tested: whether you can create your own structure, and whether you know when to ask. Getting stuck silently for a week is the failure mode they are screening for.</p>
      <ol>
        <li><strong>Convert ambiguity into a written problem statement.</strong> Restate the ask, what success looks like, who the output is for, and what is out of scope, then confirm it with whoever gave it to you. That single document prevents most wasted work.</li>
        <li><strong>Front-load learning in the first weeks:</strong> the tables, how they are populated, how the business defines its key metrics, and where existing reports already answer things. In a lending business, also learn the lifecycle vocabulary, because misusing it costs you credibility.</li>
        <li><strong>Map the people:</strong> who owns which data, which stakeholders consume what, who to ask about upstream systems. Much of the context in an analytics role is social rather than technical.</li>
        <li><strong>Scope down to a first deliverable</strong> within a couple of weeks. Something small and correct beats a large plan, builds trust and surfaces the questions you did not know to ask.</li>
        <li><strong>Write assumptions down and get them checked</strong> rather than guessing silently. Most bad analysis comes from an unvalidated assumption, not from bad SQL.</li>
        <li><strong>Show work early and often,</strong> even rough, so feedback arrives before you have built a week on a wrong premise.</li>
        <li><strong>Have an explicit rule for being stuck:</strong> time-box it, say a couple of hours on a technical blocker or a day on an ambiguity, then ask, with what you tried, what you think the options are and a recommendation. That is asking for a decision rather than for rescue, and it is what high agency looks like from the outside.</li>
        <li><strong>Aim to deliver something real in ninety days,</strong> such as an automated report or a dashboard replacing manual work, and to have picked up ownership of an area without being asked.</li>
      </ol>`,
      answer: `<p>"My first move with an ambiguous problem is to write it down and get it confirmed: what the question really is, what success looks like, who will use the output and what is out of scope. Ambiguity usually means the requester has not fully framed it either, so a short written statement is the fastest way to find that out before I spend a week going the wrong way.</p>
      <p>In the first few weeks I would spend deliberate time on three things: the data, meaning which tables exist, how they are populated and where they are unreliable; the definitions, meaning how the business actually defines its core metrics, which in a lending context includes the lifecycle vocabulary from application through disbursal to delinquency; and the people, meaning who owns which system and who consumes which report. A lot of an analyst's useful context is social rather than technical, and knowing who to ask is half the job.</p>
      <p>Then I would scope down to a first deliverable inside two or three weeks rather than planning something large. Something small and correct builds trust, and it surfaces the questions I did not know to ask. Throughout, I write my assumptions down and get them checked instead of guessing, and I show rough work early so feedback comes before I have built on a wrong premise.</p>
      <p>On being stuck, I have a rule, because the failure mode is going quiet for a week. I time-box it: a couple of hours on a technical blocker, about a day on an ambiguity. Then I ask, but with context: here is what I am trying to do, here is what I have tried, here are the two options I see and the one I would pick. That way I am asking for a decision or a steer rather than for rescue, which respects the other person's time and still moves the problem forward.</p>
      <p>By ninety days I would want something concrete delivered, ideally a report or dashboard that replaced manual work, and to have taken ownership of one area without needing to be told to. That is the part I actually want from a high-agency environment."</p>`
    },
    {
      id: 'nc-h5',
      difficulty: 'hard',
      prompt: 'Your dashboard shows the business hitting target, but you notice a segment where <strong>customers are clearly being served badly</strong> and nobody has asked about it. What do you do, and how do you make anyone care?',
      hint: 'This is Start with the Customer plus Own the Outcome: quantify it, tie it to money, and bring a recommendation.',
      concepts: [
        { label: 'Verifies the finding before raising it', any: ['verify', 'validate', 'check', 'confirm', 'make sure', 'double check', 'is it real'], required: true },
        { label: 'Quantifies the size: customers affected and business exposure', any: ['how many', 'quantif', 'size', 'number of customer', 'volume', 'material', 'exposure'], required: true },
        { label: 'Explains why the aggregate hid it, such as averages or mix', any: ['average', 'aggregate', 'hid', 'mask', 'mix', 'small share', 'diluted'], required: true },
        { label: 'Raises it proactively even though nobody asked', any: ['nobody asked', 'proactiv', 'unprompted', 'on my own', 'without being asked', 'raise it'], required: true },
        { label: 'Translates the customer harm into business impact or risk', any: ['revenue', 'churn', 'cost', 'complaint', 'risk', 'regulat', 'business impact', 'money'], required: true },
        { label: 'Identifies the likely cause rather than only reporting the symptom', any: ['cause', 'why', 'diagnos', 'root', 'segment by', 'investigat', 'hypothes'], required: true },
        { label: 'Takes it to the person who can act, with a recommendation', any: ['owner', 'who can fix', 'recommend', 'proposal', 'action', 'take it to', 'suggest'], required: true },
        { label: 'Makes it visible and monitored so it cannot be forgotten', any: ['dashboard', 'monitor', 'alert', 'add it', 'track', 'visible', 'recurring report'], required: true },
        { label: 'Persists appropriately if it is deprioritised', any: ['persist', 'follow up', 'come back', 'again', 'not drop it', 'keep raising'], required: true },
        { label: 'Accepts a legitimate decision not to act now, and documents it', any: ['legitimate', 'accept', 'priorit', 'document', 'their call', 'commit', 'trade off'] }
      ],
      approach: `<p>This is the question that separates a reporter from an analyst. The work is not spotting it; it is making a busy organisation act on something it did not ask about.</p>
      <ol>
        <li><strong>Verify first.</strong> Before telling anyone, confirm it is real: check the pipeline, the definition, the segmentation logic, and whether the pattern holds over time rather than for one day. Raising a false alarm about customer harm burns credibility fast.</li>
        <li><strong>Quantify it in customer terms:</strong> how many customers, how often, and how badly. "Two percent of users" means nothing; "roughly eleven thousand customers a month whose payments fail on first attempt" is impossible to ignore.</li>
        <li><strong>Explain why nobody saw it.</strong> Usually the aggregate is healthy and the segment is small relative to the whole, so the average hid it. That framing is also an argument for changing how the metric is reported.</li>
        <li><strong>Translate to business impact.</strong> Attach money or risk: lost transactions, higher servicing cost, complaint volume, churn among affected customers, or regulatory exposure if it touches fair treatment. Customer harm alone can lose to a roadmap; customer harm with a number attached usually does not.</li>
        <li><strong>Do the diagnosis before escalating.</strong> Segment it down to a likely cause, whether one bank, one app version, one policy rule or one geography, so you arrive with a hypothesis rather than a complaint.</li>
        <li><strong>Take it to whoever can act,</strong> with a specific recommendation and the smallest next step, and copy your manager so it is visible rather than a private crusade.</li>
        <li><strong>Make it permanent:</strong> add the segment cut to the dashboard, or an alert, so the issue cannot quietly return once attention moves on. That is the durable version of caring about it.</li>
        <li><strong>Handle deprioritisation like an adult.</strong> If they weigh it against other work and decide not now, that can be a legitimate call, and I would document it and revisit with updated numbers rather than either dropping it or escalating aggressively. If it grows, the trend becomes the argument.</li>
      </ol>`,
      answer: `<p>"I would treat it as a real finding and work it properly rather than mentioning it in passing.\n</p>
      <p>First, verify. I would check that it is not a data artefact, so the pipeline, the metric definition and my segmentation logic, and confirm the pattern holds over several weeks rather than one bad day. Raising customer harm that turns out to be a join error costs credibility I would need later.</p>
      <p>Then quantify it in human terms and in money. Not two percent of users, but how many customers a month, how often it happens to them, and what it costs: failed transactions, extra support contacts, the servicing cost, and the churn or lost volume among those affected. I would also be able to explain why nobody noticed, which is usually that the segment is small relative to the whole so the aggregate stayed healthy and the average hid it. That is itself an argument for reporting that metric by segment rather than in total.</p>
      <p>Before escalating I would do the diagnosis, cutting it down to a likely cause such as one issuing bank, one app version, one policy rule or one city, so I arrive with a hypothesis and a proposed next step rather than a problem. Then I would take it to whoever can actually fix it, with a recommendation and the smallest useful action, keeping my manager in the loop so it is visible work rather than a private campaign. And I would add the segment to the dashboard or set up an alert, so if it is not fixed immediately it cannot quietly disappear from view.</p>
      <p>If they hear it and still prioritise something else, that can be a legitimate call and I would not treat it as a fight. I would document the decision and the numbers, keep the monitor running, and come back with updated figures if it grows, because at that point the trend argues for itself. What I would not do is stay silent because nobody asked. If a group of customers is being served badly and the reporting hides it, surfacing that is exactly the job."</p>`
    }
  ]
});
