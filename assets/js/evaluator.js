/* Free-text answer grading.
 *
 * Answers are never compared literally. Each question carries a rubric of
 * "concepts", and every concept lists the phrasings that count as covering it.
 * The score is the share of rubric weight the candidate covered, so different
 * wording, different clause order and extra commentary all still grade well.
 */
window.DAQ = window.DAQ || {};

DAQ.evaluator = (function () {
  const CORRECT_AT = 0.7;
  const PARTIAL_AT = 0.4;
  const REQUIRED_COVERAGE_AT = 0.75;

  const SCALES = {
    hundred: 1e2, thousand: 1e3, k: 1e3,
    lakh: 1e5, lakhs: 1e5, lac: 1e5, lacs: 1e5,
    million: 1e6, mn: 1e6, m: 1e6,
    crore: 1e7, crores: 1e7, cr: 1e7,
    billion: 1e9, bn: 1e9, b: 1e9,
    trillion: 1e12, tn: 1e12
  };

  /* Collapses casing, punctuation and spacing so rubric phrases can be plain
     lowercase text: "GROUP BY" and "group_by" both become "group by". */
  function normalize(text) {
    return String(text || '')
      .toLowerCase()
      .replace(/[_\-]+/g, ' ')
      .replace(/[^a-z0-9.%\s]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function wordCount(normalized) {
    return normalized ? normalized.split(' ').filter(Boolean).length : 0;
  }

  function matchesPhrase(normalized, phrase) {
    const needle = normalize(phrase);
    if (!needle) return false;
    return normalized.indexOf(needle) !== -1;
  }

  function conceptHit(normalized, concept) {
    const phrases = concept.any || [concept.label];
    return phrases.some((phrase) => matchesPhrase(normalized, phrase));
  }

  /* Pulls quantities out of raw text, understanding Indian and Western scales:
     "1.5 crore", "20L", "3,50,000", "45 million" all resolve to a number. */
  function extractNumbers(rawText) {
    const cleaned = String(rawText || '')
      .toLowerCase()
      .replace(/(\d),(?=\d)/g, '$1')
      .replace(/[₹$]/g, ' ');
    const pattern = /(\d+(?:\.\d+)?)\s*(hundred|thousand|lakhs|lakh|lacs|lac|crores|crore|million|billion|trillion|cr|mn|bn|tn|k|m|b)?\b/g;
    const found = [];
    let match = pattern.exec(cleaned);
    while (match) {
      const base = parseFloat(match[1]);
      const scale = match[2] ? SCALES[match[2]] || 1 : 1;
      if (!Number.isNaN(base)) found.push(base * scale);
      match = pattern.exec(cleaned);
    }
    return found;
  }

  /* Guesstimates are judged on being in the right ballpark, not on exactness. */
  function checkNumeric(spec, rawText) {
    const numbers = extractNumbers(rawText);
    if (!numbers.length) return { stated: false, ok: false, closest: null };
    const tolerance = spec.tolerance || 5;
    let best = null;
    numbers.forEach((value) => {
      if (value <= 0) return;
      const ratio = value > spec.value ? value / spec.value : spec.value / value;
      if (best === null || ratio < best.ratio) best = { value: value, ratio: ratio };
    });
    if (!best) return { stated: false, ok: false, closest: null };
    return { stated: true, ok: best.ratio <= tolerance, closest: best.value, ratio: best.ratio };
  }

  function evaluate(question, answerText) {
    const normalized = normalize(answerText);
    const concepts = question.concepts || [];
    const matched = [];
    const missed = [];
    let gained = 0;
    let total = 0;
    let requiredMissing = 0;

    const tooShort = wordCount(normalized) < 2;
    let requiredTotal = 0;

    concepts.forEach((concept) => {
      const weight = concept.weight || 1;
      total += weight;
      if (concept.required) requiredTotal += 1;
      const hit = !tooShort && conceptHit(normalized, concept);
      if (hit) {
        gained += weight;
        matched.push(concept.label);
      } else {
        missed.push(concept.label);
        if (concept.required) requiredMissing += 1;
      }
    });

    /* Required concepts are the core of the answer, but demanding every single
       one makes long rubrics unpassable, so ask for most of them. */
    const requiredCovered = requiredTotal - requiredMissing;
    const requiredCoverage = requiredTotal > 0 ? requiredCovered / requiredTotal : 1;

    let score = total > 0 ? gained / total : 0;
    const numeric = question.numeric ? checkNumeric(question.numeric, answerText) : null;

    if (numeric) {
      if (numeric.ok) score = Math.min(1, score + 0.1);
      else score = Math.min(score, 0.65);
    }

    let verdict;
    if (tooShort) {
      verdict = 'incorrect';
      score = 0;
    } else if (score >= CORRECT_AT && requiredCoverage >= REQUIRED_COVERAGE_AT) {
      verdict = 'correct';
    } else if (score >= PARTIAL_AT) {
      verdict = 'partial';
    } else {
      verdict = 'incorrect';
    }

    return {
      verdict: verdict,
      score: Math.round(score * 100) / 100,
      matched: matched,
      missed: missed,
      requiredMissing: requiredMissing,
      requiredCoverage: Math.round(requiredCoverage * 100) / 100,
      numeric: numeric,
      empty: tooShort
    };
  }

  return { evaluate, normalize, extractNumbers, CORRECT_AT, PARTIAL_AT };
})();
