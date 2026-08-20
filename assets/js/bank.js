/* Question bank registry.
 *
 * Every file in assets/js/data/ calls DAQ.registerTopic() once. To add a topic,
 * drop in a new file with the same shape and load it from index.html.
 */
window.DAQ = window.DAQ || {};

DAQ.topics = [];

/* Dashboard groups, rendered in this order. A topic declares which group it
   belongs to with `group: '<id>'`; anything unassigned falls into the last one. */
DAQ.groups = [
  {
    id: 'navi',
    label: 'Navi interview questions',
    note: 'Questions reported from real Navi interview rounds, with worked solutions.'
  },
  {
    id: 'prep',
    label: 'Concepts and questions to prepare for Navi interview',
    note: 'The areas Navi leans on hardest: SQL, metric cases and root cause, data design and partitioning.'
  },
  {
    id: 'rest',
    label: 'Rest of the topics',
    note: 'General analyst interview ground worth keeping sharp.'
  }
];

DAQ.groupFor = function (topic) {
  const known = DAQ.groups.some(function (group) { return group.id === topic.group; });
  return known ? topic.group : DAQ.groups[DAQ.groups.length - 1].id;
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
