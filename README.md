# Data Analyst Interview Prep

An interview-style practice site for data analyst roles. Enter a name, pick a topic, answer in your own words, and get graded on the concepts you covered rather than on exact wording. Progress, points, streaks and badges are saved per name in the browser.

Live site: `https://vashista-21.github.io/data-analyst-questions/`

## What is in it

Six topics, 15 questions each (5 easy, 5 medium, 5 hard) — 90 questions in total.

| Topic | Focus |
| --- | --- |
| SQL | Filtering, joins, aggregation, window functions, cohort and funnel queries |
| A/B Testing | Hypotheses, power, sample size, peeking, SRM, interference, ship decisions |
| Guesstimates | Market sizing and back-of-the-envelope estimation with sanity checks |
| Statistics & Probability | Distributions, CLT, confidence intervals, test selection, Bayes, sampling traps |
| Python & Pandas | Selection, joins, groupby, time series, sessionisation, performance |
| Product Metrics & Cases | Metric definition, funnels, retention, diagnosing drops, structured cases |

Every question includes a grading rubric, a **model answer**, and a **how to approach it** explanation that is shown after you submit (whether you were right or wrong) and via the "See the answer" button.

## Features

- **Name-based login.** No account, no server. Progress is stored in `localStorage` under a key derived from your name, and saved names are listed on the login screen for one-click resume.
- **Free-text grading.** Answers are matched against a concept rubric, so different phrasing, different clause order and extra commentary still score. Verdicts are correct / partially correct / needs work, with a list of what you covered and what you missed.
- **Ballpark checking for guesstimates.** Numeric answers are parsed including Indian and Western scales (`2.5 crore`, `15 lakh`, `1.5 billion`, `3,50,000`) and accepted within an order-of-magnitude tolerance.
- **Rewards on screen.** Points by difficulty (easy 10 / medium 20 / hard 30), streak bonuses, levels, confetti, toasts and badges.
- **Interview feel.** Per-question timer, one primary answer box, difficulty filter, set summary with retry-what-you-missed, and no points for questions where you revealed the answer first.
- **Export / import progress** as JSON, since `localStorage` is per browser.

## Running locally

No build step and no dependencies. Serve the folder over HTTP:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly from the filesystem also works, since the scripts are plain (non-module) files.

## Deploying on GitHub Pages

1. Push to `main`.
2. In the repository, go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
4. Save. The site publishes at `https://<user>.github.io/data-analyst-questions/` within a minute or two.

`.nojekyll` is included so GitHub serves the `assets/` folder as-is.

## Adding or editing questions

Each topic is one file in `assets/js/data/`. A question looks like this:

```js
{
  id: 'sql-e6',
  difficulty: 'easy',                  // easy | medium | hard
  prompt: 'Question text, HTML allowed.',
  context: 'optional schema or data snippet, shown in a mono block',
  hint: 'optional nudge shown behind the Hint button',
  concepts: [                          // the grading rubric
    { label: 'Shown to the user as covered/missed',
      any: ['phrasings', 'that count as covering it'],
      required: true,                  // core points; most must be present to score "correct"
      weight: 1 },                     // optional, defaults to 1
  ],
  numeric: { value: 1.5e8, display: '150 million units', tolerance: 4 },  // guesstimates only
  approach: '<p>How to think about it, shown after submitting.</p>',
  answer: '<p>Model answer.</p>',
}
```

Rules that keep grading sane:

- Write `any` phrases in **lowercase without punctuation**. The grader normalises input the same way, so `group by` matches `GROUP BY` and `dense rank` matches `DENSE_RANK()`.
- Mark 2–4 concepts as `required`. These are the points an answer cannot omit; a verdict of "correct" needs at least 75% of them plus 70% of total rubric weight.
- Keep 4–8 concepts per question. Too few makes grading coarse, too many makes it noisy.
- For guesstimates, set `numeric` so the final number is checked for being in the right ballpark.

To add a whole new topic, copy a file in `assets/js/data/`, change the `id`/`name`/`icon`/`blurb`, and add a `<script>` tag for it in `index.html`.

## Validating changes

A structural check runs the banks in Node, verifies each topic has 5 easy / 5 medium / 5 hard, that ids are unique, that rubrics are usable, and that every model answer grades as correct against its own rubric:

```bash
node tools/validate.js
```

## Project structure

```
index.html                     views: login, dashboard, quiz, summary
assets/css/styles.css
assets/js/storage.js           per-name progress in localStorage
assets/js/evaluator.js         free-text and numeric grading
assets/js/rewards.js           points, levels, badges, confetti, toasts
assets/js/bank.js              topic registry
assets/js/app.js               controller and UI wiring
assets/js/data/*.js            question banks, one file per topic
tools/validate.js              structural + grading checks
```

## Scoring

| Verdict | Points | Notes |
| --- | --- | --- |
| Correct | full (10 / 20 / 30) | plus a streak bonus of 2 per consecutive correct, capped at 20 |
| Partially correct | 40% | |
| Needs work | 0 | |
| Answer revealed before submitting | 0 | the question still shows feedback, it just cannot score |

Points are awarded once per question, and improving a previous verdict tops up the difference. A level is 150 points.
