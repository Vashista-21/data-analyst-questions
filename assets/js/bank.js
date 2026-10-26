/* Question bank registry.
 *
 * Every file in assets/js/data/ calls DAQ.registerTopic() once. To add a topic,
 * drop in a new file with the same shape and load it from index.html.
 */
window.DAQ = window.DAQ || {};

DAQ.topics = [];

/* Dashboard groups, rendered in this order. A topic declares which group it
   belongs to with `group: '<id>'`; anything unassigned falls into FALLBACK_GROUP.
   The current target company sits on top; earlier company prep sits last. */
DAQ.groups = [
  {
    id: 'khatabook',
    label: 'Khatabook data analyst prep',
    note: 'Start here. Questions reported from Khatabook analyst rounds with worked solutions, and the culture round with a company brief.'
  },
  {
    id: 'prep',
    label: 'Concepts and questions to prepare for Khatabook interview',
    note: 'What the Khatabook Central Analytics loop leans on: SQL and query optimisation, merchant metric cases and root cause, pipelines and fact tables, experiments and statistics.'
  },
  {
    id: 'rest',
    label: 'Rest of the topics',
    note: 'General analyst interview ground worth keeping sharp.'
  },
  {
    id: 'navi',
    label: 'Other company prep: Navi',
    note: 'Navi interview questions and cultural fit from the earlier prep round, kept for reference.'
  }
];

const FALLBACK_GROUP = 'rest';

DAQ.groupFor = function (topic) {
  const known = DAQ.groups.some(function (group) { return group.id === topic.group; });
  return known ? topic.group : FALLBACK_GROUP;
};

DAQ.topicsInGroup = function (groupId) {
  return DAQ.topics.filter(function (topic) { return DAQ.groupFor(topic) === groupId; });
};

DAQ.countsFor = function (topic) {
  return ['easy', 'medium', 'hard'].reduce(function (acc, level) {
    acc[level] = topic.questions.filter(function (q) { return q.difficulty === level; }).length;
    return acc;
  }, {});
};

/* Registering the same id twice appends to the existing topic instead of
   creating a duplicate card, so one topic can be split across several files.
   Metadata is taken from whichever file supplies it, since load order differs
   between the browser and the validator. */
const METADATA = ['group', 'name', 'icon', 'blurb'];

DAQ.registerTopic = function (topic) {
  const existing = DAQ.getTopic(topic.id);
  const target = existing || Object.assign({}, topic, { questions: [] });

  METADATA.forEach(function (field) {
    if (topic[field] !== undefined) target[field] = topic[field];
  });

  const questions = (topic.questions || []).map(function (question, index) {
    return Object.assign({}, question, {
      topicId: topic.id,
      id: question.id || topic.id + '-' + (index + 1)
    });
  });
  target.questions = target.questions.concat(questions);
  target.questions.forEach(function (question) { question.topicName = target.name; });

  if (!existing) DAQ.topics.push(target);
};

DAQ.getTopic = function (id) {
  return DAQ.topics.filter(function (topic) { return topic.id === id; })[0] || null;
};

DAQ.questionsFor = function (topicId, difficulty) {
  const topic = DAQ.getTopic(topicId);
  if (!topic) return [];
  if (!difficulty || difficulty === 'all') return topic.questions.slice();
  return topic.questions.filter(function (question) { return question.difficulty === difficulty; });
};
