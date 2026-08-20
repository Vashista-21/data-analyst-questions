DAQ.registerTopic({
  id: 'guesstimates',
  group: 'rest',
  name: 'Guesstimates',
  icon: '\uD83D\uDCD0',
  blurb: 'Market sizing and back-of-the-envelope estimation with stated assumptions and a sanity check.',
  questions: [
    /* ---------------------------- EASY ---------------------------- */
    {
      id: 'gs-e1',
      difficulty: 'easy',
      prompt: 'Estimate the number of <strong>smartphones sold in India in a year</strong>. Show your structure and commit to a number.',
      hint: 'Work from installed base divided by replacement cycle, then add first-time buyers.',
      numeric: { value: 1.5e8, display: '150 million (about 15 crore) units a year', tolerance: 4 },
      concepts: [
        { label: 'Start from India\'s population, around 1.4 billion', any: ['1.4 billion', '140 crore', '1.4bn', '1400 million', 'population'], required: true },
        { label: 'Estimate smartphone users / penetration rather than total people', any: ['penetration', 'users', 'smartphone user', 'owners', 'percent', 'adoption'], required: true },
        { label: 'Divide the installed base by a replacement cycle of 2-3 years', any: ['replacement', 'upgrade', 'cycle', '3 year', '2 year', 'every', 'lifespan'], required: true },
        { label: 'Add first-time buyers / new users entering the market', any: ['first time', 'new user', 'growth', 'new buyer', 'addition'] },
        { label: 'State assumptions explicitly as you go', any: ['assume', 'assumption', 'let us say', 'lets say', 'roughly', 'approximately'], required: true },
        { label: 'Sanity check against a known benchmark', any: ['sanity', 'check', 'benchmark', 'reported', 'known', 'compare', 'reasonable'] }
      ],
      approach: `<p>The reliable structure for any durable good is <strong>installed base &divide; replacement cycle + new adopters</strong>.</p>
      <ol>
        <li><strong>Population:</strong> 1.4 billion people.</li>
        <li><strong>Smartphone owners:</strong> penetration is roughly 50&ndash;55% of the population once you exclude young children and low-income non-users, so about 700 million users.</li>
        <li><strong>Replacement:</strong> Indian users hold a phone for roughly 3 years on average (longer at the budget end, shorter at the premium end). That gives 700M / 3 &asymp; 230 million replacement units.</li>
        <li><strong>Adjust for reality:</strong> a meaningful share of replacements happen through second-hand phones rather than new purchases, so scale the new-phone share down to roughly 60&ndash;65%, giving about 140&ndash;150 million.</li>
        <li><strong>New adopters:</strong> add roughly 10&ndash;20 million first-time buyers a year.</li>
        <li><strong>Answer:</strong> approximately <strong>150 million units a year</strong>.</li>
      </ol>
      <p>Sanity check: this matches the widely reported figure of 145&ndash;160 million smartphone shipments a year in India, so the structure holds.</p>`,
      answer: `<p><strong>&asymp; 150 million (15 crore) smartphones a year.</strong></p>
      <pre>Population                 1,400 M
Smartphone penetration     ~50%      -> 700 M users
Replacement cycle          ~3 years  -> 233 M replacements
Share bought new (not used) ~65%     -> ~150 M
First-time buyers          +10-20 M
Answer                     ~150-160 M units / year</pre>
      <p>Anything in the 100&ndash;250 million range is defensible provided the logic and assumptions are stated. What loses marks is jumping to a number without the installed-base-over-replacement-cycle structure.</p>`
    },
    {
      id: 'gs-e2',
      difficulty: 'easy',
      prompt: 'Estimate the number of <strong>app-based cab rides (Uber + Ola) taken in Bangalore on a weekday</strong>.',
      hint: 'Supply side is easier here: number of drivers times trips per driver per day.',
      numeric: { value: 1e6, display: '1 million (about 10 lakh) rides a day', tolerance: 4 },
      concepts: [
        { label: 'Anchor on Bangalore population, roughly 13 million', any: ['13 million', '1.3 crore', '12 million', '10 million', '1 crore', 'population'], required: true },
        { label: 'Estimate the addressable share who can afford app cabs', any: ['afford', 'income', 'segment', 'percent', 'share', 'urban', 'penetration'], required: true },
        { label: 'Use a supply-side cross-check: drivers times trips per driver', any: ['driver', 'supply side', 'trips per driver', 'per driver', 'cars', 'fleet'], required: true },
        { label: 'Assume trips per user per day / frequency', any: ['frequency', 'per day', 'trips per', 'rides per', 'per user', 'daily'], required: true },
        { label: 'State assumptions explicitly', any: ['assume', 'assumption', 'let us say', 'lets say', 'roughly', 'approximately'], required: true },
        { label: 'Cross-check the demand and supply estimates against each other', any: ['cross check', 'sanity', 'both side', 'compare', 'reconcile', 'consistent'] }
      ],
      approach: `<p>Estimate it twice, from demand and from supply, and reconcile. Interviewers reward the cross-check.</p>
      <p><strong>Demand side</strong></p>
      <ol>
        <li>Bangalore population &asymp; 13 million.</li>
        <li>Working-age population who commute &asymp; 55% &rarr; 7 million.</li>
        <li>Share who can afford app cabs at least occasionally &asymp; 25% &rarr; 1.8 million potential riders.</li>
        <li>Average frequency: most use cabs a few times a week, not daily. Say 0.3 rides per potential rider per day &rarr; roughly 550,000 rides. Add airport, business and tourist demand and round toward 0.6&ndash;1 million.</li>
      </ol>
      <p><strong>Supply side</strong></p>
      <ol>
        <li>Active app-cab drivers in Bangalore &asymp; 80,000&ndash;100,000.</li>
        <li>Working drivers on a given day &asymp; 70% &rarr; 60,000&ndash;70,000.</li>
        <li>Trips per active driver per day &asymp; 12&ndash;15.</li>
        <li>60,000 &times; 15 &asymp; <strong>900,000 rides</strong>.</li>
      </ol>
      <p>The two methods land within the same order of magnitude, so commit to roughly <strong>1 million rides a day</strong>, and note that autos and bike taxis would add substantially on top.</p>`,
      answer: `<p><strong>&asymp; 1 million (10 lakh) app-cab rides on a weekday in Bangalore.</strong></p>
      <pre>Supply-side (primary)
  Active drivers            ~90,000
  Driving on a given day    70%      -> 63,000
  Trips per driver per day  ~14
  Rides                     ~880,000

Demand-side (cross-check)
  Population                13 M
  Commuting adults          55%      -> 7 M
  Can afford app cabs       25%      -> 1.8 M riders
  Rides per rider per day   ~0.4     -> ~700,000</pre>
      <p>Both routes give several hundred thousand to a million, so 0.7&ndash;1 million is the defensible answer. Mentioning that bike taxis and autos sit outside this estimate shows you scoped the question.</p>`
    },
    {
      id: 'gs-e3',
      difficulty: 'easy',
      prompt: 'Estimate the number of <strong>food delivery orders placed per day in India</strong> across all platforms.',
      hint: 'Only urban, internet-enabled, higher-income households order online.',
      numeric: { value: 3e6, display: '3 million (about 30 lakh) orders a day', tolerance: 4 },
      concepts: [
        { label: 'Narrow from total population to urban population', any: ['urban', 'city', 'tier 1', 'metro', 'town'], required: true },
        { label: 'Apply an income / affordability filter', any: ['income', 'afford', 'middle class', 'disposable', 'sec a', 'class'], required: true },
        { label: 'Estimate ordering frequency per user (orders per month or week)', any: ['frequency', 'per month', 'per week', 'orders per', 'once a', 'times a'], required: true },
        { label: 'Convert frequency into a per-day figure', any: ['per day', 'divide by 30', 'daily', '30', '7'], required: true },
        { label: 'State assumptions explicitly', any: ['assume', 'assumption', 'let us say', 'lets say', 'roughly'], required: true },
        { label: 'Sanity check against platform-level figures', any: ['sanity', 'check', 'benchmark', 'swiggy', 'zomato', 'reported', 'compare'] }
      ],
      approach: `<p>Funnel from population down to active orderers, then multiply by frequency.</p>
      <ol>
        <li><strong>Urban population:</strong> 35% of 1.4 billion &asymp; 490 million.</li>
        <li><strong>Serviceable cities:</strong> delivery is concentrated in roughly the top 500 cities, covering maybe 60% of urban India &rarr; 300 million.</li>
        <li><strong>Affordability:</strong> a delivered meal costs ₹250&ndash;400, so restrict to the top income tier, roughly 20% &rarr; 60 million potential customers.</li>
        <li><strong>Active users:</strong> perhaps half have ever ordered and remain active &rarr; 30 million monthly active orderers.</li>
        <li><strong>Frequency:</strong> average 3 orders per month &rarr; 90 million orders per month.</li>
        <li><strong>Per day:</strong> 90M / 30 &asymp; <strong>3 million orders a day</strong>.</li>
      </ol>
      <p>Sanity check: Swiggy and Zomato each report roughly 2&ndash;2.5 million daily orders, so a 3&ndash;5 million total including smaller players is the right order of magnitude.</p>`,
      answer: `<p><strong>&asymp; 3 million (30 lakh) orders a day.</strong></p>
      <pre>Population                    1,400 M
Urban share            35%  -> 490 M
In serviceable cities  60%  -> 300 M
Can afford delivery    20%  -> 60 M
Active orderers        50%  -> 30 M MAU
Orders per user / month ~3  -> 90 M / month
Per day                     -> ~3 M</pre>
      <p>Structure matters more than the exact figure: population &rarr; urban &rarr; serviceable &rarr; affordable &rarr; active &rarr; frequency. Close by noting the number is highly concentrated in the top 8&ndash;10 cities.</p>`
    },
    {
      id: 'gs-e4',
      difficulty: 'easy',
      prompt: 'Estimate how many <strong>cups of tea are consumed in Mumbai in a day</strong>.',
      hint: 'Segment the population by how much tea they drink instead of using one flat average.',
      numeric: { value: 3e7, display: '30 million (3 crore) cups a day', tolerance: 4 },
      concepts: [
        { label: 'Anchor on Mumbai population, around 20 million', any: ['20 million', '2 crore', '21 million', '18 million', 'population'], required: true },
        { label: 'Segment into heavy, moderate and non tea drinkers', any: ['segment', 'heavy', 'moderate', 'non drinker', 'group', 'split', 'buckets'], required: true },
        { label: 'Exclude children and non tea drinkers (coffee drinkers)', any: ['children', 'kids', 'exclude', 'coffee', 'do not drink', 'non tea'], required: true },
        { label: 'Assume cups per person per day for each segment', any: ['cups per', 'per person', 'per day', 'average'], required: true },
        { label: 'Add commercial / roadside stall consumption as a cross-check', any: ['stall', 'tapri', 'chai shop', 'vendor', 'office', 'commercial', 'restaurant'] },
        { label: 'State assumptions explicitly', any: ['assume', 'assumption', 'let us say', 'lets say', 'roughly'], required: true }
      ],
      approach: `<p>The differentiator here is <strong>segmentation</strong>. A single average cup count is the weak answer; splitting the population by drinking behaviour is the strong one.</p>
      <ol>
        <li><strong>Population:</strong> Mumbai metropolitan area &asymp; 20 million.</li>
        <li><strong>Remove non-drinkers:</strong> children under 10 (about 15%) and adults who drink only coffee or nothing (about 20% of the rest). That leaves roughly 13&ndash;14 million tea drinkers.</li>
        <li><strong>Segment by intensity:</strong>
          <ul>
            <li>Heavy (office workers, drivers, labourers, stall regulars) &asymp; 30% of drinkers &rarr; 4M at 4 cups/day = 16M cups.</li>
            <li>Moderate &asymp; 50% &rarr; 7M at 2 cups/day = 14M cups.</li>
            <li>Light &asymp; 20% &rarr; 2.7M at 1 cup/day = 2.7M cups.</li>
          </ul>
        </li>
        <li><strong>Total:</strong> roughly 33 million cups, so commit to <strong>about 30 million cups a day</strong>.</li>
      </ol>
      <p>Cross-check from the supply side: Mumbai plausibly has 30,000&ndash;50,000 tea stalls serving 200&ndash;300 cups a day, which is 6&ndash;15 million cups from stalls alone, with the rest made at home. Consistent.</p>`,
      answer: `<p><strong>&asymp; 30 million (3 crore) cups a day.</strong></p>
      <pre>Mumbai population              20 M
Less children/non-drinkers      -> ~13.5 M tea drinkers
  Heavy    30%  4.0 M x 4 cups = 16.0 M
  Moderate 50%  6.8 M x 2 cups = 13.6 M
  Light    20%  2.7 M x 1 cup  =  2.7 M
Total                           ~32 M cups/day

Supply cross-check: 40,000 stalls x 250 cups = 10 M cups from stalls</pre>
      <p>Segmenting by consumption intensity, then validating with a supply-side estimate, is what makes this answer interview-grade.</p>`
    },
    {
      id: 'gs-e5',
      difficulty: 'easy',
      prompt: 'Estimate the number of <strong>ATMs in India</strong>.',
      hint: 'Either work from bank branches per ATM, or from cash withdrawals per ATM per day.',
      numeric: { value: 2.5e5, display: '250,000 (about 2.5 lakh) ATMs', tolerance: 4 },
      concepts: [
        { label: 'Approach via bank branches and ATMs per branch', any: ['branch', 'bank', 'per branch'], required: true },
        { label: 'Or approach via population served per ATM', any: ['per atm', 'population per', 'people per', 'per capita', 'per 1000', 'served'], required: true },
        { label: 'Account for the difference between urban and rural density', any: ['urban', 'rural', 'city', 'village', 'density', 'metro'], required: true },
        { label: 'Use a transaction-based cross-check (withdrawals per ATM per day)', any: ['transaction', 'withdrawal', 'per day', 'cross check', 'usage', 'cash'], required: true },
        { label: 'State assumptions explicitly', any: ['assume', 'assumption', 'let us say', 'lets say', 'roughly'], required: true }
      ],
      approach: `<p>Two independent routes; use one as the estimate and one as the check.</p>
      <p><strong>Route 1: branch-based</strong></p>
      <ol>
        <li>India has roughly 150,000 bank branches across public, private and cooperative banks.</li>
        <li>Average ATMs per branch is a little over 1, since urban branches have 2&ndash;3 and rural branches often share one, plus many off-site ATMs exist.</li>
        <li>150,000 &times; 1.6 &asymp; <strong>240,000 ATMs</strong>.</li>
      </ol>
      <p><strong>Route 2: population-based</strong></p>
      <ol>
        <li>Roughly 1 ATM per 5,000&ndash;6,000 people nationally, with urban areas much denser and rural areas much sparser.</li>
        <li>1.4 billion / 5,500 &asymp; 255,000 ATMs.</li>
      </ol>
      <p>Both give about <strong>250,000</strong>. A transaction cross-check supports it: at roughly 100 withdrawals per ATM per day, 250,000 ATMs handle 25 million withdrawals daily, which is the right scale for a cash-heavy economy that is still digitising.</p>`,
      answer: `<p><strong>&asymp; 250,000 (2.5 lakh) ATMs.</strong></p>
      <pre>Route 1: 150,000 bank branches x ~1.6 ATMs  ->  ~240,000
Route 2: 1,400 M people / ~5,500 per ATM    ->  ~255,000
Cross-check: 250,000 ATMs x 100 withdrawals/day = 25 M withdrawals/day</pre>
      <p>Mention the trend for credit: ATM count has plateaued and is slowly declining in metros because of UPI, while it still grows in semi-urban and rural areas.</p>`
    },

    /* --------------------------- MEDIUM --------------------------- */
    {
      id: 'gs-m1',
      difficulty: 'medium',
      prompt: 'Estimate the <strong>daily revenue of a single Starbucks outlet</strong> in a metro Indian mall.',
      hint: 'Seats times turns times ticket size, split across peak and off-peak hours.',
      numeric: { value: 1.5e5, display: '₹1.5 lakh (about ₹150,000) a day', tolerance: 4 },
      concepts: [
        { label: 'Estimate capacity: seats or counter throughput', any: ['seats', 'capacity', 'tables', 'counter', 'throughput'], required: true },
        { label: 'Split the day into peak and off-peak hours', any: ['peak', 'off peak', 'hours', 'morning', 'evening', 'lunch'], required: true },
        { label: 'Apply an occupancy or utilisation rate', any: ['occupancy', 'utilis', 'utiliz', 'full', 'percent', 'fill'], required: true },
        { label: 'Assume an average ticket size / bill per customer', any: ['ticket', 'average bill', 'per customer', 'aov', 'spend', 'price'], required: true },
        { label: 'Include takeaway / delivery on top of dine-in', any: ['takeaway', 'take away', 'delivery', 'to go', 'walk in'] },
        { label: 'State assumptions explicitly', any: ['assume', 'assumption', 'let us say', 'lets say', 'roughly'], required: true },
        { label: 'Sanity check against costs, rent or a monthly revenue figure', any: ['sanity', 'rent', 'cost', 'monthly', 'break even', 'profit', 'check'] }
      ],
      approach: `<p>Retail F&amp;B sizing is always <strong>capacity &times; turns &times; occupancy &times; ticket size</strong>, built hour by hour rather than with one flat average.</p>
      <ol>
        <li><strong>Capacity:</strong> a mall Starbucks has roughly 40 seats and operates about 13 hours (9am&ndash;10pm).</li>
        <li><strong>Peak hours:</strong> about 5 hours (lunch, late afternoon, evening) at 80% occupancy with roughly a 1-hour dwell time &rarr; 40 &times; 0.8 &times; 5 &asymp; 160 customers.</li>
        <li><strong>Off-peak hours:</strong> about 8 hours at 25% occupancy &rarr; 40 &times; 0.25 &times; 8 &asymp; 80 customers.</li>
        <li><strong>Takeaway and delivery:</strong> add roughly 30% on top &rarr; total &asymp; 310 customers a day.</li>
        <li><strong>Ticket size:</strong> a coffee is ₹250&ndash;350 and many customers add food, so the average bill is about ₹450, with roughly 1.3 customers per bill &rarr; effectively ₹450&ndash;500 per paying group. Using ₹480 per transaction on about 240 transactions gives about ₹115,000; using ₹450 across 310 customers gives about ₹140,000.</li>
        <li><strong>Answer:</strong> roughly <strong>₹1.3&ndash;1.5 lakh per day</strong>, so about ₹45 crore... no: about ₹4.5&ndash;5 crore a year.</li>
      </ol>
      <p>Sanity check with economics: ₹1.5 lakh a day is roughly ₹45 lakh a month. Mall rent plus staff plus COGS for an outlet like this runs ₹30&ndash;35 lakh a month, which leaves a plausible margin. If the estimate had come out at ₹5 lakh a day, the implied profit would be unrealistic for the format.</p>`,
      answer: `<p><strong>&asymp; ₹1.5 lakh (₹150,000) a day, roughly ₹4.5&ndash;5 crore a year.</strong></p>
      <pre>Seats                       40
Peak hours    5 h x 80%  -> 160 customers
Off-peak      8 h x 25%  ->  80 customers
Takeaway/delivery +30%   ->  ~310 customers/day
Average spend per customer  ~₹450-480
Daily revenue               ~₹1.3-1.5 lakh
Monthly                     ~₹40-45 lakh
Sanity: rent + staff + COGS ~₹30-35 lakh/month -> plausible margin</pre>
      <p>The cost-based sanity check is what separates a strong answer here: it proves the number is economically viable rather than merely arithmetically consistent.</p>`
    },
    {
      id: 'gs-m2',
      difficulty: 'medium',
      prompt: 'Estimate the number of <strong>paid Netflix subscribers in India</strong>.',
      hint: 'Households, not people, and remember password sharing and cheap mobile plans.',
      numeric: { value: 1e7, display: '10 million (about 1 crore) paid subscriptions', tolerance: 5 },
      concepts: [
        { label: 'Work in households rather than individuals', any: ['household', 'family', 'homes', 'per household'], required: true },
        { label: 'Filter to households with broadband / smart TV / streaming capability', any: ['broadband', 'internet', 'smart tv', 'streaming', 'connected', 'wifi'], required: true },
        { label: 'Apply an affordability filter for a ₹200-650 monthly plan', any: ['afford', 'income', 'price', 'plan', 'arpu', '199', '649', 'premium'], required: true },
        { label: 'Account for competition from cheaper OTT platforms', any: ['competition', 'hotstar', 'jio', 'prime', 'amazon', 'cheaper', 'bundle', 'competitor'], required: true },
        { label: 'Account for account sharing reducing paid accounts', any: ['sharing', 'shared', 'password', 'multiple user', 'per account'], required: true },
        { label: 'State assumptions explicitly', any: ['assume', 'assumption', 'let us say', 'lets say', 'roughly'], required: true }
      ],
      approach: `<p>Netflix is a household product in a market where it is the premium option, so the funnel must end with an affordability and competition filter.</p>
      <ol>
        <li><strong>Households:</strong> 1.4 billion people at about 4.5 per household &asymp; 310 million households.</li>
        <li><strong>Streaming-capable:</strong> households with reliable broadband or a good mobile data plan plus a smart TV or capable phone &asymp; 30% &rarr; 90 million.</li>
        <li><strong>Willing to pay for any OTT:</strong> maybe 40% of those &rarr; 36 million paying households, which matches the known scale of the Indian OTT market.</li>
        <li><strong>Netflix's share:</strong> Netflix is the most expensive major service and competes with Hotstar and Prime (often bundled with telecom or e-commerce). Give it roughly 20&ndash;25% of paying households and adjust for the fact that many households consume it through a shared account &rarr; about 8&ndash;10 million paid accounts.</li>
        <li><strong>Answer:</strong> roughly <strong>10 million paid subscriptions</strong>, covering more viewers than that because of sharing.</li>
      </ol>
      <p>Sanity check against revenue: 10 million accounts at an average ₹350 per month is roughly ₹4,200 crore a year, which is consistent with the reported scale of Netflix's India business.</p>`,
      answer: `<p><strong>&asymp; 10 million (1 crore) paid subscriptions.</strong></p>
      <pre>Population 1,400 M / 4.5 per household  -> 310 M households
Streaming-capable            30%         ->  90 M
Pay for any OTT              40%         ->  36 M
Netflix share of paying HH   ~25%        ->   9 M
Adjust for sharing                       -> ~8-10 M paid accounts
Revenue sanity: 10 M x ₹350 x 12         -> ~₹4,200 crore/year</pre>
      <p>Key insight to voice: India's OTT market is large in users but low in ARPU, so Netflix's premium pricing caps its subscriber count well below Hotstar's.</p>`
    },
    {
      id: 'gs-m3',
      difficulty: 'medium',
      prompt: 'Estimate the number of <strong>Domino\'s pizzas sold in India per day</strong>.',
      hint: 'Store count times orders per store per day times pizzas per order.',
      numeric: { value: 4e5, display: '400,000 (about 4 lakh) pizzas a day', tolerance: 4 },
      concepts: [
        { label: 'Start from the number of outlets in India', any: ['store', 'outlet', 'restaurant', 'branches', 'locations'], required: true },
        { label: 'Estimate orders per store per day', any: ['orders per store', 'per store', 'per outlet', 'orders per day', 'transactions'], required: true },
        { label: 'Convert orders to pizzas using items per order', any: ['per order', 'pizzas per', 'items per', 'basket', 'average order'], required: true },
        { label: 'Split peak versus off-peak or weekday versus weekend', any: ['peak', 'weekend', 'weekday', 'dinner', 'lunch', 'off peak'], required: true },
        { label: 'State assumptions explicitly', any: ['assume', 'assumption', 'let us say', 'lets say', 'roughly'], required: true },
        { label: 'Sanity check against known revenue or capacity limits', any: ['sanity', 'revenue', 'check', 'capacity', 'kitchen', 'benchmark', 'per store revenue'] }
      ],
      approach: `<p>Supply-side sizing works best for a chain, because store count is knowable and per-store throughput is boundable.</p>
      <ol>
        <li><strong>Outlets:</strong> Domino's operates roughly 1,800&ndash;2,000 stores in India, the largest QSR footprint in the country. Take 1,900.</li>
        <li><strong>Orders per store per day:</strong> think in blocks. Peak dinner (7&ndash;10pm) is roughly 60&ndash;80 orders, lunch peak roughly 40, and the remaining hours roughly 40&ndash;60 combined. Call it 150 orders per store per day, higher on weekends.</li>
        <li><strong>Pizzas per order:</strong> average basket is 1.3&ndash;1.5 pizzas plus sides. Use 1.4.</li>
        <li><strong>Total:</strong> 1,900 &times; 150 &times; 1.4 &asymp; <strong>400,000 pizzas a day</strong>.</li>
      </ol>
      <p>Capacity sanity check: 150 orders across roughly 14 operating hours is about 11 orders an hour, well inside what one oven and a small crew can deliver, so the number is physically plausible. Revenue check: 150 orders at about ₹600 per order is ₹90,000 a day per store, roughly ₹27 lakh a month, which is the right scale for a QSR outlet of that size.</p>`,
      answer: `<p><strong>&asymp; 400,000 (4 lakh) pizzas a day.</strong></p>
      <pre>Stores in India                ~1,900
Orders per store per day        ~150   (dinner 70, lunch 40, rest 40)
Pizzas per order               ~1.4
Pizzas per day                 ~400,000

Capacity check: 150 orders / 14 h  = 11 per hour -> feasible
Revenue check : 150 x ₹600         = ₹90,000/day/store</pre>
      <p>Two checks, one on kitchen capacity and one on revenue per store, are what make the estimate credible rather than arbitrary.</p>`
    },
    {
      id: 'gs-m4',
      difficulty: 'medium',
      prompt: 'Estimate the number of <strong>school teachers in India</strong>.',
      hint: 'Children of school age, enrolment rate, then the pupil-teacher ratio.',
      numeric: { value: 9.5e6, display: '9-10 million (about 1 crore) teachers', tolerance: 4 },
      concepts: [
        { label: 'Estimate the school-age population (roughly ages 5-17)', any: ['school age', 'age', '5 to', '6 to', 'children', 'kids', 'years old'], required: true },
        { label: 'Apply an enrolment rate rather than assuming everyone attends', any: ['enrol', 'enroll', 'attend', 'dropout', 'drop out', 'gross enrolment', 'ger'], required: true },
        { label: 'Use a pupil-teacher ratio of roughly 25-30', any: ['pupil teacher', 'student teacher', 'ratio', 'per teacher', '30', '25'], required: true },
        { label: 'Differentiate primary and secondary, or rural and urban ratios', any: ['primary', 'secondary', 'rural', 'urban', 'differ', 'higher', 'segment'], required: true },
        { label: 'State assumptions explicitly', any: ['assume', 'assumption', 'let us say', 'lets say', 'roughly'], required: true }
      ],
      approach: `<p>This is a straight ratio chain: age cohort &rarr; enrolled students &rarr; teachers via the pupil-teacher ratio.</p>
      <ol>
        <li><strong>School-age population:</strong> ages 5&ndash;17 is about 13 single-year cohorts. With roughly 23&ndash;25 million births a year and some mortality, take about 22 million per cohort &rarr; 13 &times; 22M &asymp; 285 million children. That is about 20% of the population, which is a reasonable share for India's age pyramid.</li>
        <li><strong>Enrolment:</strong> near-universal at primary level but falling at secondary. Blended enrolment of roughly 85% &rarr; about 245 million enrolled students.</li>
        <li><strong>Pupil-teacher ratio:</strong> official norms target 30:1 at primary and 35:1 at upper primary; reality is worse in rural government schools and better in private schools. Use a blended 26:1.</li>
        <li><strong>Teachers:</strong> 245M / 26 &asymp; <strong>9.4 million teachers</strong>.</li>
      </ol>
      <p>Sanity check: that is roughly 0.7% of the population and one of the largest occupational groups in the country, which matches the widely quoted figure of about 9.5 million school teachers.</p>`,
      answer: `<p><strong>&asymp; 9&ndash;10 million (about 1 crore) school teachers.</strong></p>
      <pre>Cohort size (per year of age)     ~22 M
School ages 5-17 (13 cohorts)     ~285 M children
Enrolment rate           ~85%  -> ~245 M students
Pupil-teacher ratio      ~26:1 -> ~9.4 M teachers</pre>
      <p>Strengthen the answer by splitting the ratio: primary at 30:1 with more students and secondary at 20:1 with fewer, which lands in the same range and shows you know enrolment declines with grade level.</p>`
    },
    {
      id: 'gs-m5',
      difficulty: 'medium',
      prompt: 'A quick-commerce company wants to launch 10-minute grocery delivery in a new city of 5 million people. Estimate the number of <strong>dark stores</strong> it needs.',
      hint: 'Work backwards from the delivery radius that a 10-minute promise allows.',
      numeric: { value: 60, display: '50-70 dark stores', tolerance: 4 },
      concepts: [
        { label: 'The 10-minute promise implies a small delivery radius of roughly 2 km', any: ['radius', '2 km', '1.5 km', '3 km', 'distance', 'km'], required: true },
        { label: 'Convert radius into coverage area per store', any: ['area', 'square km', 'sq km', 'coverage', 'circle', 'pi r'], required: true },
        { label: 'Estimate serviceable city area rather than total area', any: ['serviceable', 'city area', 'dense', 'not the whole', 'coverage area', 'built up'], required: true },
        { label: 'Cross-check with demand: orders per day per store capacity', any: ['orders per store', 'capacity', 'demand', 'orders per day', 'throughput', 'utilis', 'utiliz'], required: true },
        { label: 'Account for overlap and phased rollout in dense areas', any: ['overlap', 'phase', 'launch', 'dense', 'priorit', 'gradual', 'high demand'], required: true },
        { label: 'State assumptions explicitly', any: ['assume', 'assumption', 'let us say', 'lets say', 'roughly'], required: true }
      ],
      approach: `<p>Answer it from two directions, geography and demand, then take the binding constraint.</p>
      <p><strong>Geography</strong></p>
      <ol>
        <li>A 10-minute promise allows roughly 6&ndash;7 minutes of riding, which in city traffic (20&ndash;25 km/h) is about a 2 km radius.</li>
        <li>Usable coverage per store is not the full circle because of roads and one-ways, so take about 8&ndash;10 km&sup2; per store rather than &pi;r&sup2; = 12.5 km&sup2;.</li>
        <li>A 5 million-person city might span 400&ndash;500 km&sup2;, but quick commerce only targets dense, higher-income neighbourhoods, say 50% of it &rarr; roughly 225 km&sup2;.</li>
        <li>225 / 9 &asymp; <strong>25 stores</strong> for area coverage.</li>
      </ol>
      <p><strong>Demand</strong></p>
      <ol>
        <li>5M people at 4.5 per household &asymp; 1.1M households; target the top 25% &rarr; 280,000 addressable households.</li>
        <li>Assume 20% become active and order 4 times a month &rarr; 56,000 &times; 4 / 30 &asymp; 7,500 orders a day at maturity.</li>
        <li>A dark store handles roughly 800&ndash;1,000 orders a day comfortably, so demand alone needs 8&ndash;10 stores.</li>
      </ol>
      <p><strong>Reconcile:</strong> coverage is the binding constraint, not demand, which is exactly why quick commerce is capital intensive. To cover the dense half of the city you need roughly 25&ndash;30 stores at launch, and 50&ndash;70 once you extend to the full serviceable footprint with overlap for peak-hour resilience. Launch phased: start with the 10 densest micro-markets where both constraints bind together.</p>`,
      answer: `<p><strong>&asymp; 25&ndash;30 dark stores for a phased dense launch, 50&ndash;70 for full serviceable coverage.</strong></p>
      <pre>Geography (binding constraint)
  10-min promise -> ~2 km radius -> ~9 km2 usable per store
  Serviceable city area ~225 km2 -> ~25 stores

Demand
  1.1 M households, top 25% = 280 K addressable
  20% active x 4 orders/month -> ~7,500 orders/day
  ~900 orders/store/day       -> ~8-10 stores

Coverage, not demand, sets the store count -> launch 25-30, scale to 50-70</pre>
      <p>The insight worth stating: in quick commerce the constraint is geographic coverage rather than order volume, which is why early stores run below capacity and unit economics depend on order density rising over time.</p>`
    },

    /* ---------------------------- HARD ---------------------------- */
    {
      id: 'gs-h1',
      difficulty: 'hard',
      prompt: 'Estimate the number of <strong>WhatsApp messages sent in India per day</strong>.',
      hint: 'Segment users by intensity, and remember group messages multiply delivered messages.',
      numeric: { value: 2.5e10, display: '20-30 billion messages a day', tolerance: 5 },
      concepts: [
        { label: 'Estimate WhatsApp users in India, roughly 500 million', any: ['500 million', '50 crore', '500m', '400 million', 'users'], required: true },
        { label: 'Segment users into heavy, moderate and light senders', any: ['segment', 'heavy', 'moderate', 'light', 'power user', 'buckets', 'split'], required: true },
        { label: 'Assume messages sent per user per day for each segment', any: ['messages per', 'per user', 'per day', 'average'], required: true },
        { label: 'Distinguish messages sent from messages delivered in groups', any: ['group', 'delivered', 'recipient', 'multiplier', 'sent vs', 'fan out'], required: true },
        { label: 'Exclude inactive users from the daily active base', any: ['active', 'dau', 'inactive', 'daily active', 'not all'], required: true },
        { label: 'Sanity check the final number against a global benchmark', any: ['sanity', 'global', 'benchmark', '100 billion', 'check', 'compare', 'reported'] },
        { label: 'State assumptions explicitly', any: ['assume', 'assumption', 'let us say', 'lets say', 'roughly'], required: true }
      ],
      approach: `<p>Two things make this a hard question: the user base must be reduced to daily actives, and you must decide whether you are counting messages <em>sent</em> or messages <em>delivered</em>.</p>
      <ol>
        <li><strong>User base:</strong> India has roughly 500 million WhatsApp users, the platform's largest market.</li>
        <li><strong>Daily actives:</strong> WhatsApp has unusually high engagement, so take about 80% &rarr; 400 million DAU.</li>
        <li><strong>Segment by intensity:</strong>
          <ul>
            <li>Heavy (students, group admins, business users) 15% &rarr; 60M at 150 messages/day = 9.0B</li>
            <li>Moderate 50% &rarr; 200M at 50 messages/day = 10.0B</li>
            <li>Light 35% &rarr; 140M at 10 messages/day = 1.4B</li>
          </ul>
        </li>
        <li><strong>Sent total:</strong> roughly 20 billion messages sent per day.</li>
        <li><strong>Delivered:</strong> group messages fan out to many recipients. If a meaningful share of messages go to groups averaging 8&ndash;10 members, delivered messages could be 3&ndash;5&times; the sent count, so 60&ndash;100 billion deliveries. State clearly which definition your final number uses.</li>
        <li><strong>Answer:</strong> approximately <strong>20&ndash;30 billion messages sent per day</strong> in India.</li>
      </ol>
      <p>Sanity check: WhatsApp has publicly cited roughly 100 billion messages a day globally. India holding 20&ndash;30% of that is consistent with India being its largest market by users, so the estimate hangs together.</p>`,
      answer: `<p><strong>&asymp; 20&ndash;30 billion messages sent per day</strong> (60&ndash;100 billion if you count group deliveries).</p>
      <pre>Users in India                 ~500 M
Daily active            80%  -> ~400 M DAU
  Heavy    15%   60 M x 150 =  9.0 B
  Moderate 50%  200 M x  50 = 10.0 B
  Light    35%  140 M x  10 =  1.4 B
Messages sent                 ~20 B / day
Group fan-out (x3-5)          ~60-100 B delivered

Global benchmark ~100 B/day; India as largest market -> 20-30% share fits</pre>
      <p>Explicitly separating "sent" from "delivered", and validating against the global benchmark, is what turns this from a guess into an estimate.</p>`
    },
    {
      id: 'gs-h2',
      difficulty: 'hard',
      prompt: 'Estimate the <strong>annual size of the used-car market in India</strong>, in units and in rupee value.',
      hint: 'Anchor on new-car sales, then use the used-to-new ratio and average resale price.',
      numeric: { value: 4.5e6, display: '4-5 million units a year, roughly ₹2.5-3.5 lakh crore', tolerance: 4 },
      concepts: [
        { label: 'Anchor on annual new car sales, roughly 4 million', any: ['new car', '4 million', '40 lakh', 'new vehicle', 'annual sales', 'anchor'], required: true },
        { label: 'Apply a used-to-new ratio (India is a little above 1:1)', any: ['ratio', 'used to new', '1.3', '1.4', 'times new', 'multiple'], required: true },
        { label: 'Consider the installed base of cars and how often each changes hands', any: ['installed base', 'total cars', 'stock', 'ownership', 'changes hands', 'turnover', 'holding period'], required: true },
        { label: 'Multiply units by an average used-car price', any: ['price', 'value per', 'ticket size', 'lakh per'], required: true },
        { label: 'Distinguish organised from unorganised / peer-to-peer transactions', any: ['organis', 'organiz', 'unorganis', 'unorganiz', 'peer to peer', 'informal', 'dealer', 'c2c'], required: true },
        { label: 'Cross-check the two methods against each other', any: ['cross check', 'sanity', 'both', 'compare', 'reconcile', 'consistent'], required: true },
        { label: 'State assumptions explicitly', any: ['assume', 'assumption', 'let us say', 'lets say', 'roughly'], required: true }
      ],
      approach: `<p>Estimate units twice, then convert to value. Anchoring on new-car sales is the fastest route because that number is well known.</p>
      <p><strong>Method 1: used-to-new ratio</strong></p>
      <ol>
        <li>New passenger vehicle sales in India are roughly 4 million a year.</li>
        <li>Mature markets run 2&ndash;3 used cars per new car; India is lower but has crossed parity, so use about 1.2&times; &rarr; <strong>4.8 million used-car transactions</strong>.</li>
      </ol>
      <p><strong>Method 2: installed base turnover</strong></p>
      <ol>
        <li>Installed base of passenger cars &asymp; 35&ndash;40 million.</li>
        <li>An average owner sells every 7&ndash;8 years, so annual turnover is 1/8 of the base &rarr; roughly 4.5&ndash;5 million transactions.</li>
      </ol>
      <p>Both methods land at about <strong>4.5&ndash;5 million units</strong>, which is a genuine cross-validation rather than a repeat of the same assumption.</p>
      <p><strong>Value</strong></p>
      <ol>
        <li>Average used-car transaction price &asymp; ₹5&ndash;6 lakh (hatchbacks dominate volume, SUVs pull the average up).</li>
        <li>4.5M &times; ₹5.5 lakh &asymp; <strong>₹2.5 lakh crore</strong> (roughly $30 billion) of transaction value.</li>
        <li>Organised players (dealers, OEM-certified, online platforms) handle perhaps 20&ndash;25% of units, so the organised opportunity is about 1 million units and ₹50,000&ndash;60,000 crore. That split is usually the real point of the question.</li>
      </ol>`,
      answer: `<p><strong>&asymp; 4.5&ndash;5 million units a year, worth roughly ₹2.5&ndash;3 lakh crore (about $30 billion).</strong></p>
      <pre>Method 1: new car sales 4 M x used-to-new 1.2  -> 4.8 M units
Method 2: base 38 M cars / 8-year holding       -> 4.7 M units
Average used-car price                          -> ~₹5.5 lakh
Market value 4.7 M x ₹5.5 lakh                  -> ~₹2.6 lakh crore
Organised share ~22%                            -> ~1 M units, ~₹55,000 crore</pre>
      <p>Two independent routes agreeing, plus the organised-versus-unorganised split, is what makes this answer complete. The split is also where the business insight sits: the total market is huge but the addressable organised slice is a fifth of it.</p>`
    },
    {
      id: 'gs-h3',
      difficulty: 'hard',
      prompt: 'A food delivery company operates in Bangalore. Estimate the number of <strong>delivery partners it needs on a Saturday evening peak</strong>.',
      hint: 'Peak orders per hour divided by deliveries one rider can complete per hour, then adjust for availability.',
      numeric: { value: 2.2e4, display: '20,000-25,000 riders logged in at peak', tolerance: 4 },
      concepts: [
        { label: 'Estimate total daily orders in the city first', any: ['daily orders', 'orders per day', 'total orders', 'city orders'], required: true },
        { label: 'Find the peak-hour share of daily orders', any: ['peak', 'share of orders', 'peak hour', 'percent of orders', 'concentrat', 'dinner'], required: true },
        { label: 'Estimate deliveries per rider per hour from trip time', any: ['per rider', 'per hour', 'trip time', 'delivery time', 'minutes per', 'throughput'], required: true },
        { label: 'Include pickup, waiting and return time, not just riding time', any: ['pickup', 'wait', 'restaurant', 'return', 'idle', 'total time'], required: true },
        { label: 'Adjust for rider availability, utilisation and no-shows', any: ['availab', 'utilis', 'utiliz', 'no show', 'buffer', 'log in', 'logged in', 'not all riders'], required: true },
        { label: 'Add a buffer for demand spikes, rain and batching effects', any: ['buffer', 'spike', 'rain', 'surge', 'batching', 'safety', 'cushion'], required: true },
        { label: 'State assumptions explicitly', any: ['assume', 'assumption', 'let us say', 'lets say', 'roughly'], required: true }
      ],
      approach: `<p>This is a capacity planning question, so drive it from peak-hour throughput rather than daily averages. Averages hide the problem: staffing for the mean fails every Saturday.</p>
      <ol>
        <li><strong>City orders:</strong> Bangalore is a top-2 market. Assume the platform does roughly 600,000&ndash;700,000 orders a day citywide across all platforms and its own share puts it at about 400,000 orders a day. Take 400,000.</li>
        <li><strong>Peak concentration:</strong> food delivery is extremely peaked. Roughly 30% of daily orders arrive in the 7&ndash;10pm window, and about 12&ndash;14% land in the single busiest hour &rarr; roughly 52,000 orders in the peak hour.</li>
        <li><strong>Rider throughput:</strong> a delivery involves 5 minutes to the restaurant, 5&ndash;8 minutes waiting for food, 15 minutes riding to the customer, and repositioning. Realistically 22&ndash;25 minutes per delivery, so about 2.4 deliveries per rider per hour at peak.</li>
        <li><strong>Riders actively delivering:</strong> 52,000 / 2.4 &asymp; 21,700.</li>
        <li><strong>Adjust for utilisation:</strong> not every logged-in rider is on a trip at every moment; peak utilisation of 85% means logged-in supply must be about 25,500. Then account for the fact that only 70&ndash;80% of riders who accept a shift actually log in, so the roster you need to schedule is roughly 32,000&ndash;36,000.</li>
        <li><strong>Answer:</strong> roughly <strong>22,000&ndash;25,000 riders delivering at peak</strong>, needing a scheduled pool of about 33,000.</li>
      </ol>
      <p>Sanity check: this implies each rider completes 15&ndash;20 deliveries across a full shift, which matches the observed 15&ndash;18 per rider per day, and total riders needed is a plausible fraction of the platform's citywide fleet. Batching two orders from the same restaurant cluster is the main lever that reduces this requirement by 10&ndash;20%.</p>`,
      answer: `<p><strong>&asymp; 22,000&ndash;25,000 delivery partners on the road at Saturday peak</strong> (a scheduled pool of roughly 33,000).</p>
      <pre>Daily orders in Bangalore              ~400,000
Peak-hour share            ~13%     ->  ~52,000 orders in the peak hour
Time per delivery  5 + 6 + 15 min   ->  ~25 min -> 2.4 deliveries/rider/hour
Riders on trips        52,000 / 2.4 ->  ~21,700
Peak utilisation       85%          ->  ~25,500 logged in
Show-up rate           75%          ->  ~34,000 scheduled
Batching saves 10-20%               ->  ~20,000-23,000 effective need</pre>
      <p>The mark of a strong answer here is planning on the peak hour rather than the daily average, and separating "riders needed on trips" from "riders that must be scheduled" via utilisation and show-up rates.</p>`
    },
    {
      id: 'gs-h4',
      difficulty: 'hard',
      prompt: 'Estimate the <strong>annual revenue of a single multiplex</strong> (5 screens) in an Indian metro, including food and beverage.',
      hint: 'Seats times shows times occupancy times ticket price, then add F&B spend per head and ads.',
      numeric: { value: 2.6e8, display: '₹25-30 crore a year', tolerance: 4 },
      concepts: [
        { label: 'Capacity: screens times seats per screen', any: ['screens', 'seats', 'capacity', 'per screen'], required: true },
        { label: 'Shows per screen per day', any: ['shows', 'show per', 'per day', 'showtimes', 'slots'], required: true },
        { label: 'Occupancy rate well below 100%, varying by day and slot', any: ['occupancy', 'fill', 'percent full', 'utilis', 'utiliz', 'weekend', 'weekday'], required: true },
        { label: 'Average ticket price', any: ['ticket price', 'atp', 'per ticket', 'price per'], required: true },
        { label: 'Food and beverage spend per head, a high-margin second revenue line', any: ['f b', 'food', 'beverage', 'popcorn', 'spend per head', 'concession'], required: true },
        { label: 'Advertising / sponsorship revenue as a third stream', any: ['advertis', 'ads', 'sponsor', 'screen advertising'], required: true },
        { label: 'Account for seasonality driven by big releases', any: ['seasonal', 'release', 'blockbuster', 'holiday', 'festival', 'lean period'], required: true },
        { label: 'State assumptions explicitly', any: ['assume', 'assumption', 'let us say', 'lets say', 'roughly'], required: true }
      ],
      approach: `<p>Build the three revenue lines separately: tickets, F&amp;B, advertising. Occupancy is where most candidates go wrong, because the intuitive number is far too high.</p>
      <ol>
        <li><strong>Capacity:</strong> 5 screens &times; 200 seats &times; 4 shows a day = 4,000 seat-slots a day.</li>
        <li><strong>Occupancy:</strong> annual average occupancy for Indian multiplexes is only about 25&ndash;30%, because weekday morning and afternoon shows run nearly empty while weekend evenings sell out. Use 28% &rarr; roughly 1,100 tickets a day, or about 400,000 admissions a year.</li>
        <li><strong>Seasonality:</strong> revenue is extremely lumpy. A handful of big releases and festival holidays deliver a disproportionate share of admissions, with long lean periods in between, which is exactly why the annual average occupancy looks so low. Any monthly estimate must be built on the release calendar rather than on a flat run rate.</li>
        <li><strong>Ticket revenue:</strong> average ticket price in a metro &asymp; ₹250 (blended across recliners, weekday discounts and premium formats) &rarr; 400,000 &times; ₹250 &asymp; <strong>₹10 crore</strong>.</li>
        <li><strong>F&amp;B:</strong> spend per head &asymp; ₹130&ndash;150, and it is the highest-margin line &rarr; 400,000 &times; ₹140 &asymp; <strong>₹5.6 crore</strong>.</li>
        <li><strong>Advertising and other:</strong> on-screen ads, sponsorships and convenience fees add roughly 10&ndash;15% of ticket revenue &rarr; about <strong>₹1.5 crore</strong>.</li>
        <li><strong>Total gross:</strong> roughly ₹17 crore. Note that a large share of ticket revenue is passed to distributors (typically 45&ndash;50% in week one, declining afterwards) plus GST, so net revenue to the exhibitor is materially lower than gross.</li>
        <li><strong>Answer:</strong> approximately <strong>₹17&ndash;20 crore gross a year</strong> for a 5-screen metro multiplex, and ₹25&ndash;30 crore for a larger, better-located property with higher pricing and occupancy.</li>
      </ol>`,
      answer: `<p><strong>&asymp; ₹17&ndash;20 crore gross a year for a typical 5-screen metro multiplex</strong> (₹25&ndash;30 crore for a premium, high-footfall property).</p>
      <pre>Capacity   5 screens x 200 seats x 4 shows  = 4,000 seat-slots/day
Occupancy  ~28% (weekday mornings near empty) = ~1,100 tickets/day
Admissions                                    = ~400,000 / year
Tickets    400,000 x ₹250                     = ₹10.0 crore
F&B        400,000 x ₹140                     = ₹5.6 crore
Ads/other  ~12% of ticket revenue             = ₹1.5 crore
Gross revenue                                 = ~₹17 crore
Less distributor share (~45% of tickets) and GST -> net is materially lower</pre>
      <p>Two things earn credit here: using a realistically low annual occupancy of 25&ndash;30%, and separating gross from net by naming the distributor share. Add that revenue is highly seasonal, since a few big releases and festival holidays carry a disproportionate share of annual admissions, so monthly figures must be built on the release calendar rather than a flat run rate.</p>`
    },
    {
      id: 'gs-h5',
      difficulty: 'hard',
      prompt: 'A payments app wants to know the <strong>annual UPI transaction volume in India</strong>, and how much of it is peer-to-merchant. Estimate both.',
      hint: 'Users times transactions per user per month, then split P2P versus P2M by typical usage.',
      numeric: { value: 1.5e11, display: '150 billion transactions a year, roughly 60% peer-to-merchant', tolerance: 5 },
      concepts: [
        { label: 'Estimate UPI users, roughly 350-400 million', any: ['350 million', '400 million', '35 crore', '40 crore', 'users', 'user base'], required: true },
        { label: 'Estimate transactions per active user per month', any: ['per user', 'per month', 'transactions per', 'frequency', 'per day'], required: true },
        { label: 'Segment users by intensity rather than one flat average', any: ['segment', 'heavy', 'moderate', 'light', 'buckets', 'split', 'power user'], required: true },
        { label: 'Split peer-to-peer versus peer-to-merchant transactions', any: ['p2p', 'p2m', 'peer to peer', 'merchant', 'split', 'share'], required: true },
        { label: 'Note that P2M dominates in count while P2P dominates in value', any: ['count', 'value', 'ticket size', 'small ticket', 'average value', 'volume vs value'], required: true },
        { label: 'Sanity check against a monthly NPCI-scale benchmark', any: ['sanity', 'npci', 'benchmark', 'monthly', 'billion per month', 'check', 'reported'], required: true },
        { label: 'State assumptions explicitly', any: ['assume', 'assumption', 'let us say', 'lets say', 'roughly'], required: true }
      ],
      approach: `<p>Build the count from users and frequency, then split by transaction type, and finally sanity-check against the monthly scale everyone in payments quotes.</p>
      <ol>
        <li><strong>Users:</strong> roughly 350&ndash;400 million people transact on UPI. Take 375 million.</li>
        <li><strong>Segment by intensity:</strong>
          <ul>
            <li>Heavy (urban, uses UPI for everything including ₹20 payments) 20% &rarr; 75M at 60 transactions/month = 4.5B</li>
            <li>Moderate 45% &rarr; 170M at 20 transactions/month = 3.4B</li>
            <li>Light 35% &rarr; 130M at 6 transactions/month = 0.8B</li>
          </ul>
        </li>
        <li><strong>Monthly total:</strong> about 8.7 billion transactions a month.</li>
        <li><strong>Annual:</strong> 8.7B &times; 12 &asymp; <strong>105&ndash;150 billion transactions a year</strong> allowing for growth through the year.</li>
        <li><strong>P2P vs P2M split:</strong> small-ticket merchant payments (kirana, autos, tea stalls, QR codes) dominate transaction <em>counts</em>. Assume roughly 60% P2M by count &rarr; about 90 billion merchant transactions a year.</li>
        <li><strong>The value inversion:</strong> P2M average ticket is small (₹100&ndash;200) while P2P transfers average much higher (₹1,500&ndash;2,500), so P2P still leads on rupee value even though P2M leads on count. Saying this explicitly is the insight the interviewer wants.</li>
      </ol>
      <p>Sanity check: NPCI-reported UPI volumes are of the order of 15&ndash;18 billion transactions a month, so the true annual figure is nearer 180&ndash;200 billion. My bottom-up estimate of 105&ndash;150 billion is the right order of magnitude, and the gap tells me my per-user frequency assumption is conservative for heavy users, which is exactly where I would tighten the model.</p>`,
      answer: `<p><strong>&asymp; 150 billion UPI transactions a year, with roughly 60% (about 90 billion) peer-to-merchant by count.</strong></p>
      <pre>UPI users                            ~375 M
  Heavy    20%   75 M x 60/month = 4.5 B
  Moderate 45%  170 M x 20/month = 3.4 B
  Light    35%  130 M x  6/month = 0.8 B
Monthly transactions                 ~8.7 B
Annual (with in-year growth)         ~105-150 B
P2M share by count      ~60%         ->  ~90 B merchant transactions
Ticket size: P2M ~₹150 vs P2P ~₹2,000 -> P2P leads on value, P2M on count

Benchmark: NPCI reports ~15-18 B/month, so the real figure is ~180-200 B/year</pre>
      <p>Strong answers do three things here: segment users instead of averaging, separate count from value when splitting P2P and P2M, and explicitly reconcile the bottom-up estimate with the published benchmark rather than hiding the gap.</p>`
    }
  ]
});
