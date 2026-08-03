/* Structural validation of the question banks and the answer evaluator.
 * Run with: node tools/validate.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
/* Mimic a browser global: `window` is the global object itself, so
   `window.DAQ = ...` creates the global `DAQ` the scripts rely on. */
const sandbox = { console };
sandbox.window = sandbox;
vm.createContext(sandbox);

function run(relPath) {
  const code = fs.readFileSync(path.join(root, relPath), 'utf8');
  vm.runInContext(code, sandbox, { filename: relPath });
}

run('assets/js/evaluator.js');
run('assets/js/bank.js');

const dataDir = path.join(root, 'assets/js/data');
fs.readdirSync(dataDir).filter((f) => f.endsWith('.js')).forEach((f) => run('assets/js/data/' + f));

const DAQ = sandbox.window.DAQ;
const errors = [];
const ids = new Set();

DAQ.topics.forEach((topic) => {
  const counts = { easy: 0, medium: 0, hard: 0 };
  if (!topic.id || !topic.name || !topic.icon || !topic.blurb) errors.push(`topic ${topic.id}: missing metadata`);

  topic.questions.forEach((q) => {
    const where = `${q.id}`;
    if (ids.has(q.id)) errors.push(`${where}: duplicate id`);
    ids.add(q.id);

    if (!['easy', 'medium', 'hard'].includes(q.difficulty)) errors.push(`${where}: bad difficulty`);
    else counts[q.difficulty] += 1;

    ['prompt', 'approach', 'answer'].forEach((field) => {
      if (!q[field] || String(q[field]).trim().length < 20) errors.push(`${where}: ${field} missing or too short`);
    });

    if (!Array.isArray(q.concepts) || q.concepts.length < 3) errors.push(`${where}: needs at least 3 rubric concepts`);
    (q.concepts || []).forEach((c, i) => {
      if (!c.label) errors.push(`${where}: concept ${i} has no label`);
      if (c.any && (!Array.isArray(c.any) || !c.any.length)) errors.push(`${where}: concept "${c.label}" has empty any[]`);
    });

    const required = (q.concepts || []).filter((c) => c.required).length;
    if (required === 0) errors.push(`${where}: no required concepts`);

    if (q.numeric && (typeof q.numeric.value !== 'number' || !q.numeric.display)) {
      errors.push(`${where}: numeric spec incomplete`);
    }

    // The model answer must grade as correct against its own rubric.
    const plain = String(q.answer).replace(/<[^>]+>/g, ' ') + ' ' + String(q.approach).replace(/<[^>]+>/g, ' ');
    const graded = DAQ.evaluator.evaluate(q, plain);
    if (graded.verdict !== 'correct') {
      errors.push(`${where}: own model answer grades as "${graded.verdict}" (${graded.score}) missing: ${graded.missed.join(' | ')}`);
    }

    // An empty answer must never grade as correct.
    if (DAQ.evaluator.evaluate(q, '').verdict !== 'incorrect') errors.push(`${where}: empty answer not marked incorrect`);
    if (DAQ.evaluator.evaluate(q, 'i do not know').verdict === 'correct') errors.push(`${where}: junk answer graded correct`);
  });

  ['easy', 'medium', 'hard'].forEach((d) => {
    if (counts[d] !== 5) errors.push(`topic ${topic.id}: expected 5 ${d}, found ${counts[d]}`);
  });
});

const total = DAQ.topics.reduce((n, t) => n + t.questions.length, 0);
console.log(`topics: ${DAQ.topics.length}, questions: ${total}`);
DAQ.topics.forEach((t) => console.log(`  ${t.id.padEnd(15)} ${t.questions.length} questions`));

if (errors.length) {
  console.log(`\n${errors.length} problem(s):`);
  errors.forEach((e) => console.log('  - ' + e));
  process.exit(1);
}
console.log('\nAll checks passed.');
