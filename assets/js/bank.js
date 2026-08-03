/* Question bank registry.
 *
 * Every file in assets/js/data/ calls DAQ.registerTopic() once. To add a topic,
 * drop in a new file with the same shape and load it from index.html.
 */
window.DAQ = window.DAQ || {};

DAQ.topics = [];

DAQ.registerTopic = function (topic) {
  const questions = (topic.questions || []).map(function (question, index) {
    return Object.assign({}, question, {
      topicId: topic.id,
      topicName: topic.name,
      id: question.id || topic.id + '-' + (index + 1)
    });
  });
  DAQ.topics.push(Object.assign({}, topic, { questions: questions }));
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
