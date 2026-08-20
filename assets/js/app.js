/* Application controller: login, dashboard, quiz flow, rewards and persistence. */
(function () {
  const storage = DAQ.storage;
  const evaluator = DAQ.evaluator;
  const rewards = DAQ.rewards;

  const el = (id) => document.getElementById(id);
  const questionIndex = {};
  DAQ.topics.forEach((topic) => {
    topic.questions.forEach((question) => { questionIndex[question.id] = question; });
  });

  let profile = null;
  let session = null;
  let timerId = null;
  let questionStartedAt = 0;

  /* ---------------- boot ---------------- */

  function init() {
    if (!storage.available()) {
      el('login-error').textContent = 'This browser blocks local storage, so progress cannot be saved. Practice still works.';
      el('login-error').hidden = false;
    }
    renderSavedProfiles();
    bindEvents();
  }

  function bindEvents() {
    el('login-form').addEventListener('submit', onLogin);
    el('logout-btn').addEventListener('click', logout);
    el('home-btn').addEventListener('click', showDashboard);
    el('quiz-back').addEventListener('click', showDashboard);
    el('summary-home-btn').addEventListener('click', showDashboard);

    el('submit-btn').addEventListener('click', submitAnswer);
    el('reveal-btn').addEventListener('click', revealAnswer);
    el('hint-btn').addEventListener('click', toggleHint);
    el('next-btn').addEventListener('click', () => moveTo(session.index + 1));
    el('prev-btn').addEventListener('click', () => moveTo(session.index - 1));
    el('retry-wrong-btn').addEventListener('click', retryMissed);

    el('answer-input').addEventListener('keydown', (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
        event.preventDefault();
        submitAnswer();
      }
    });

    el('difficulty-filter').addEventListener('click', (event) => {
      const chip = event.target.closest('.chip');
      if (!chip) return;
      Array.from(el('difficulty-filter').children).forEach((node) => node.classList.remove('is-active'));
      chip.classList.add('is-active');
      renderTopics();
    });

    el('badges-btn').addEventListener('click', openBadges);
    el('badge-close').addEventListener('click', () => { el('badge-modal').hidden = true; });
    el('badge-modal').addEventListener('click', (event) => {
      if (event.target === el('badge-modal')) el('badge-modal').hidden = true;
    });

    el('reset-btn').addEventListener('click', resetProgress);
    el('export-btn').addEventListener('click', exportProgress);
    el('import-btn').addEventListener('click', () => el('import-file').click());
    el('import-file').addEventListener('change', importProgress);
  }

  /* ---------------- login ---------------- */

  function renderSavedProfiles() {
    const saved = storage.list();
    const wrap = el('profile-list-wrap');
    const list = el('profile-list');
    list.innerHTML = '';
    if (!saved.length) {
      wrap.hidden = true;
      return;
    }
    wrap.hidden = false;
    saved.forEach((item) => {
      const pill = document.createElement('div');
      pill.className = 'profile-pill';

      const go = document.createElement('button');
      go.className = 'go';
      go.textContent = item.name + ' \u00B7 ' + (item.points || 0) + ' pts';
      go.addEventListener('click', () => enter(item.name));

      const del = document.createElement('button');
      del.className = 'del';
      del.textContent = '\u2715';
      del.title = 'Delete saved progress';
      del.addEventListener('click', () => {
        if (!window.confirm('Delete saved progress for ' + item.name + '?')) return;
        storage.remove(item.slug);
        renderSavedProfiles();
      });

      pill.appendChild(go);
      pill.appendChild(del);
      list.appendChild(pill);
    });
  }

  function onLogin(event) {
    event.preventDefault();
    const name = el('login-name').value.trim();
    if (!storage.slugify(name)) {
      el('login-error').textContent = 'Please enter a name using letters or numbers.';
      el('login-error').hidden = false;
      return;
    }
    el('login-error').hidden = true;
    enter(name);
  }

  function enter(name) {
    profile = storage.loadOrCreate(name);
    if (!profile) profile = storage.blank(name);
    el('view-login').hidden = true;
    el('app-shell').hidden = false;
    el('greeting').textContent = 'Hello, ' + profile.name;
    el('user-chip').textContent = profile.name.charAt(0).toUpperCase();
    updateTopbar();
    showDashboard();
  }

  function logout() {
    persist();
    profile = null;
    session = null;
    stopTimer();
    el('app-shell').hidden = true;
    el('view-login').hidden = false;
    el('login-name').value = '';
    renderSavedProfiles();
  }

  function persist() {
    if (profile) storage.save(profile);
  }

  /* ---------------- dashboard ---------------- */

  function selectedDifficulty() {
    const active = el('difficulty-filter').querySelector('.chip.is-active');
    return active ? active.dataset.difficulty : 'all';
  }

  function answerFor(id) {
    return (profile && profile.answers[id]) || null;
  }

  function topicStats(topic) {
    let correct = 0;
    let partial = 0;
    let attempted = 0;
    topic.questions.forEach((question) => {
      const record = answerFor(question.id);
      if (!record || !record.verdict) return;
      attempted += 1;
      if (record.verdict === 'correct') correct += 1;
      else if (record.verdict === 'partial') partial += 1;
    });
    return { correct, partial, attempted, total: topic.questions.length };
  }

  function showDashboard() {
    stopTimer();
    session = null;
    el('view-dashboard').hidden = false;
    el('view-quiz').hidden = true;
    el('view-summary').hidden = true;
    renderTopics();
    updateTopbar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderTopics() {
    const grid = el('topic-grid');
    const difficulty = selectedDifficulty();
    grid.innerHTML = '';

    DAQ.groups.forEach((group) => {
      const topics = DAQ.topicsInGroup(group.id);
      if (!topics.length) return;

      const head = document.createElement('div');
      head.className = 'topic-group-head';
      head.innerHTML =
        '<h3 class="topic-group-title">' + group.label + '</h3>' +
        (group.note ? '<p class="topic-group-note">' + group.note + '</p>' : '');
      grid.appendChild(head);

      topics.forEach((topic) => renderTopicCard(topic, difficulty, grid));
    });

    renderSummaryStats();
  }

  function renderTopicCard(topic, difficulty, grid) {
    const stats = topicStats(topic);
    const setSize = DAQ.questionsFor(topic.id, difficulty).length;
    const counts = DAQ.countsFor(topic);

    const card = document.createElement('button');
    card.className = 'topic-card';
    card.innerHTML =
      '<div class="topic-card-top">' +
        '<span class="topic-icon">' + topic.icon + '</span>' +
        '<span class="topic-name">' + topic.name + '</span>' +
      '</div>' +
      '<p class="topic-blurb">' + topic.blurb + '</p>' +
      '<div class="topic-tags">' +
        '<span class="pill pill-easy">' + counts.easy + ' easy</span>' +
        '<span class="pill pill-medium">' + counts.medium + ' medium</span>' +
        '<span class="pill pill-hard">' + counts.hard + ' hard</span>' +
      '</div>' +
      '<div class="topic-bar"><div class="topic-fill" style="width:' + (stats.total ? (stats.correct / stats.total) * 100 : 0) + '%"></div></div>' +
      '<div class="topic-foot">' +
        '<span>' + stats.correct + ' of ' + stats.total + ' solved</span>' +
        '<span>Start ' + setSize + ' question' + (setSize === 1 ? '' : 's') + ' \u2192</span>' +
      '</div>';
    card.addEventListener('click', () => startSession(topic.id, difficulty));
    grid.appendChild(card);
  }

  function renderSummaryStats() {
    let correct = 0;
    let attempted = 0;
    Object.keys(profile.answers).forEach((id) => {
      const record = profile.answers[id];
      if (!record || !record.verdict) return;
      attempted += 1;
      if (record.verdict === 'correct') correct += 1;
    });
    el('sum-solved').textContent = correct;
    el('sum-accuracy').textContent = attempted ? Math.round((correct / attempted) * 100) + '%' : '0%';
    el('sum-best').textContent = profile.bestStreak || 0;
  }

  function updateTopbar() {
    if (!profile) return;
    const info = rewards.levelInfo(profile.points || 0);
    el('stat-points').textContent = profile.points || 0;
    el('stat-streak').textContent = profile.streak || 0;
    el('stat-level').textContent = 'Lv ' + info.level;
    el('level-fill').style.width = info.percent + '%';
    el('badge-count').textContent = Object.keys(profile.badges || {}).length;
  }

  /* ---------------- quiz ---------------- */

  function startSession(topicId, difficulty, onlyIds) {
    const topic = DAQ.getTopic(topicId);
    if (!topic) return;
    let questions = DAQ.questionsFor(topicId, difficulty);
    if (onlyIds && onlyIds.length) {
      questions = topic.questions.filter((question) => onlyIds.indexOf(question.id) !== -1);
    }
    if (!questions.length) {
      rewards.toast('No questions in that selection', 'bad');
      return;
    }
    session = {
      topicId: topicId,
      topicName: topic.name,
      difficulty: difficulty || 'all',
      questions: questions,
      index: 0,
      earned: 0
    };
    el('view-dashboard').hidden = true;
    el('view-summary').hidden = true;
    el('view-quiz').hidden = false;
    renderQuestion();
  }

  function currentQuestion() {
    return session.questions[session.index];
  }

  function renderQuestion() {
    const question = currentQuestion();
    const record = answerFor(question.id);

    el('quiz-topic').textContent = session.topicName;
    const badge = el('quiz-difficulty');
    badge.textContent = question.difficulty;
    badge.className = 'pill pill-' + question.difficulty;
    el('quiz-counter').textContent = 'Question ' + (session.index + 1) + ' of ' + session.questions.length;
    el('quiz-progress').style.width = ((session.index) / session.questions.length) * 100 + '%';

    el('question-id').textContent = question.id;
    el('question-points').textContent = '+' + rewards.BASE_POINTS[question.difficulty] + ' pts';
    el('question-prompt').innerHTML = question.prompt;

    const context = el('question-context');
    if (question.context) {
      context.textContent = question.context;
      context.hidden = false;
    } else {
      context.hidden = true;
    }

    el('answer-input').value = record && record.lastAnswer ? record.lastAnswer : '';
    el('feedback').hidden = true;
    el('hint-box').hidden = true;
    el('hint-btn').hidden = !question.hint;
    el('prev-btn').disabled = session.index === 0;
    el('next-btn').textContent = session.index === session.questions.length - 1 ? 'Finish \u2192' : 'Next \u2192';

    el('answer-input').focus();
    startTimer();
  }

  function moveTo(index) {
    if (!session) return;
    if (index < 0) return;
    if (index >= session.questions.length) {
      finishSession();
      return;
    }
    session.index = index;
    renderQuestion();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function toggleHint() {
    const question = currentQuestion();
    const box = el('hint-box');
    if (!question.hint) return;
    box.textContent = 'Hint: ' + question.hint;
    box.hidden = !box.hidden;
  }

  function submitAnswer() {
    const question = currentQuestion();
    const text = el('answer-input').value;
    const result = evaluator.evaluate(question, text);

    if (result.empty) {
      rewards.toast('Write an answer first', 'bad');
      return;
    }

    const record = profile.answers[question.id] || { attempts: 0, awarded: 0 };
    record.attempts += 1;
    record.lastAnswer = text;
    record.score = result.score;
    record.verdict = result.verdict;
    record.ts = Date.now();
    record.seconds = (record.seconds || 0) + Math.round((Date.now() - questionStartedAt) / 1000);
    profile.answers[question.id] = record;

    if (result.verdict === 'correct') {
      profile.streak = (profile.streak || 0) + 1;
      profile.bestStreak = Math.max(profile.bestStreak || 0, profile.streak);
    } else if (result.verdict === 'incorrect') {
      profile.streak = 0;
    }

    let delta = 0;
    if (!record.revealed) {
      const candidate = rewards.basePoints(question.difficulty, result.verdict) +
        rewards.streakBonus(profile.streak || 0, result.verdict);
      delta = Math.max(0, candidate - (record.awarded || 0));
      record.awarded = Math.max(record.awarded || 0, candidate);
      profile.points = (profile.points || 0) + delta;
      session.earned += delta;
    }

    renderFeedback(question, result, delta);
    checkBadges();
    updateTopbar();
    persist();

    if (result.verdict === 'correct') {
      rewards.confetti.burst(profile.streak >= 3 ? 130 : 80);
      if (delta > 0) rewards.pointsPop(delta, el('stat-points'));
      const streakNote = profile.streak > 1 ? ' \u00B7 ' + profile.streak + ' in a row' : '';
      rewards.toast('Correct! +' + delta + ' points' + streakNote, 'good');
    } else if (result.verdict === 'partial') {
      if (delta > 0) rewards.pointsPop(delta, el('stat-points'));
      rewards.toast('Partly there \u00B7 +' + delta + ' points', 'gold');
    } else {
      rewards.toast('Not quite \u2014 read the approach below', 'bad');
    }
  }

  function renderFeedback(question, result, delta) {
    const verdictLabels = { correct: 'Correct', partial: 'Partially correct', incorrect: 'Needs work' };
    const badge = el('verdict-badge');
    badge.textContent = verdictLabels[result.verdict] + (delta ? '  +' + delta + ' pts' : '');
    badge.className = 'verdict verdict-' + result.verdict;

    el('match-fill').style.width = Math.round(result.score * 100) + '%';
    el('match-score').textContent = Math.round(result.score * 100) + '% covered';

    fillConcepts(el('matched-list'), result.matched, 'hit', 'Nothing from the checklist yet');
    fillConcepts(el('missed-list'), result.missed, 'miss', 'You covered everything');

    let approach = question.approach;
    if (result.numeric) {
      const target = question.numeric.display || String(question.numeric.value);
      const note = result.numeric.stated
        ? (result.numeric.ok
            ? '<strong>Your number is in the accepted range.</strong> A defensible benchmark is around ' + target + '.'
            : '<strong>Your number is outside the accepted range.</strong> A defensible benchmark is around ' + target + ', and interviewers accept anything within roughly the same order of magnitude.')
        : '<strong>You did not commit to a final number.</strong> Always close a guesstimate with one, around ' + target + ' here.';
      approach = '<p>' + note + '</p>' + approach;
    }

    el('approach-text').innerHTML = approach;
    el('model-answer').innerHTML = question.answer;
    el('feedback').hidden = false;
  }

  function fillConcepts(list, labels, className, emptyText) {
    list.innerHTML = '';
    if (!labels.length) {
      const li = document.createElement('li');
      li.className = 'none';
      li.textContent = emptyText;
      list.appendChild(li);
      return;
    }
    labels.forEach((label) => {
      const li = document.createElement('li');
      li.className = className;
      li.textContent = (className === 'hit' ? '\u2713 ' : '\u2022 ') + label;
      list.appendChild(li);
    });
  }

  function revealAnswer() {
    const question = currentQuestion();
    const record = profile.answers[question.id] || { attempts: 0, awarded: 0 };
    if (!record.verdict) {
      record.revealed = true;
      profile.answers[question.id] = record;
      persist();
    }
    el('approach-text').innerHTML = question.approach;
    el('model-answer').innerHTML = question.answer;
    if (!record.verdict) {
      el('verdict-badge').textContent = 'Answer revealed';
      el('verdict-badge').className = 'verdict verdict-partial';
      el('match-fill').style.width = '0%';
      el('match-score').textContent = 'no points for revealed questions';
      fillConcepts(el('matched-list'), [], 'hit', 'Submit an attempt to get graded');
      fillConcepts(el('missed-list'), (question.concepts || []).map((c) => c.label), 'miss', '');
    }
    el('feedback').hidden = false;
    if (el('feedback').scrollIntoView) el('feedback').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ---------------- timer ---------------- */

  function startTimer() {
    stopTimer();
    questionStartedAt = Date.now();
    el('quiz-timer').textContent = '00:00';
    timerId = setInterval(() => {
      const elapsed = Math.floor((Date.now() - questionStartedAt) / 1000);
      const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
      const ss = String(elapsed % 60).padStart(2, '0');
      el('quiz-timer').textContent = mm + ':' + ss;
    }, 1000);
  }

  function stopTimer() {
    if (timerId) clearInterval(timerId);
    timerId = null;
  }

  /* ---------------- summary ---------------- */

  function finishSession() {
    stopTimer();
    const counts = { correct: 0, partial: 0, incorrect: 0, unattempted: 0 };
    session.questions.forEach((question) => {
      const record = answerFor(question.id);
      const verdict = record && record.verdict ? record.verdict : 'unattempted';
      counts[verdict] += 1;
    });

    el('summary-title').textContent = session.topicName + ' set complete';
    el('summary-subtitle').textContent = 'You worked through ' + session.questions.length +
      ' questions. Revisit anything below to try again with a tighter answer.';
    el('res-correct').textContent = counts.correct;
    el('res-partial').textContent = counts.partial;
    el('res-wrong').textContent = counts.incorrect + counts.unattempted;
    el('res-points').textContent = session.earned;

    const list = el('summary-list');
    list.innerHTML = '';
    session.questions.forEach((question, index) => {
      const record = answerFor(question.id);
      const verdict = record && record.verdict ? record.verdict : 'unattempted';
      const row = document.createElement('button');
      row.className = 'summary-row';
      row.innerHTML =
        '<span class="dot dot-' + verdict + '"></span>' +
        '<span class="pill pill-' + question.difficulty + '">' + question.difficulty + '</span>' +
        '<span class="txt">' + question.prompt.replace(/<[^>]+>/g, '') + '</span>';
      row.addEventListener('click', () => {
        el('view-summary').hidden = true;
        el('view-quiz').hidden = false;
        session.index = index;
        renderQuestion();
      });
      list.appendChild(row);
    });

    el('retry-wrong-btn').hidden = counts.incorrect + counts.unattempted + counts.partial === 0;
    el('view-quiz').hidden = true;
    el('view-summary').hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (counts.correct === session.questions.length) rewards.confetti.burst(180);
  }

  function retryMissed() {
    const ids = session.questions
      .filter((question) => {
        const record = answerFor(question.id);
        return !record || record.verdict !== 'correct';
      })
      .map((question) => question.id);
    startSession(session.topicId, session.difficulty, ids);
  }

  /* ---------------- badges ---------------- */

  function award(id) {
    if (profile.badges[id]) return;
    profile.badges[id] = Date.now();
    const meta = rewards.badgeMeta(id) || {};
    rewards.toast('Badge unlocked: ' + (meta.name || id), 'gold');
    rewards.confetti.burst(140);
  }

  function checkBadges() {
    const correctIds = Object.keys(profile.answers).filter((id) => profile.answers[id].verdict === 'correct');
    if (correctIds.length >= 1) award('first-solve');
    if ((profile.bestStreak || 0) >= 5) award('streak-5');
    if ((profile.bestStreak || 0) >= 10) award('streak-10');
    if ((profile.points || 0) >= 500) award('points-500');
    if ((profile.points || 0) >= 1500) award('points-1500');

    const hardCorrect = correctIds.filter((id) => questionIndex[id] && questionIndex[id].difficulty === 'hard');
    if (hardCorrect.length >= 5) award('hard-5');

    let topicsWithScore = 0;
    DAQ.topics.forEach((topic) => {
      const stats = topicStats(topic);
      if (stats.correct > 0) topicsWithScore += 1;
      if (stats.correct === stats.total) award('topic-' + topic.id);
    });
    if (topicsWithScore === DAQ.topics.length) award('all-rounder');

    rewards.badgeCatalogue = rewards.catalogue(DAQ.topics);
    updateTopbar();
  }

  function openBadges() {
    const grid = el('badge-grid');
    grid.innerHTML = '';
    rewards.catalogue(DAQ.topics).forEach((badge) => {
      const earned = Boolean(profile.badges[badge.id]);
      const tile = document.createElement('div');
      tile.className = 'badge-tile' + (earned ? ' earned' : '');
      tile.innerHTML =
        '<span class="badge-emoji">' + badge.emoji + '</span>' +
        '<span class="badge-name">' + badge.name + '</span>' +
        '<span class="badge-desc">' + badge.desc + '</span>';
      grid.appendChild(tile);
    });
    el('badge-modal').hidden = false;
  }

  /* ---------------- progress utilities ---------------- */

  function resetProgress() {
    if (!window.confirm('Reset all points, badges and answers for ' + profile.name + '?')) return;
    profile = storage.resetProgress(profile);
    updateTopbar();
    renderTopics();
    rewards.toast('Progress reset', 'bad');
  }

  function exportProgress() {
    const blob = new Blob([JSON.stringify(profile, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data-analyst-progress-' + profile.slug + '.json';
    link.click();
    URL.revokeObjectURL(url);
  }

  function importProgress(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!parsed || !parsed.name) throw new Error('bad file');
        parsed.slug = storage.slugify(parsed.name);
        parsed.answers = parsed.answers || {};
        parsed.badges = parsed.badges || {};
        storage.save(parsed);
        profile = parsed;
        el('greeting').textContent = 'Hello, ' + profile.name;
        el('user-chip').textContent = profile.name.charAt(0).toUpperCase();
        updateTopbar();
        renderTopics();
        rewards.toast('Progress imported for ' + profile.name, 'good');
      } catch (err) {
        rewards.toast('That file could not be read', 'bad');
      }
      event.target.value = '';
    };
    reader.readAsText(file);
  }

  init();
})();
