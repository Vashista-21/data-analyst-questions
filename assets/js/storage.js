/* Per-name progress persistence backed by localStorage. */
window.DAQ = window.DAQ || {};

DAQ.storage = (function () {
  const PREFIX = 'daq.profile.';
  const LAST_KEY = 'daq.lastProfile';
  const SCHEMA = 1;

  function slugify(name) {
    return String(name).trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-_]/g, '');
  }

  function available() {
    try {
      localStorage.setItem('daq.probe', '1');
      localStorage.removeItem('daq.probe');
      return true;
    } catch (err) {
      return false;
    }
  }

  function blank(name) {
    return {
      schema: SCHEMA,
      name: String(name).trim(),
      slug: slugify(name),
      createdAt: Date.now(),
      updatedAt: Date.now(),
      points: 0,
      streak: 0,
      bestStreak: 0,
      badges: {},
      answers: {}
    };
  }

  function load(slug) {
    try {
      const raw = localStorage.getItem(PREFIX + slug);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      parsed.answers = parsed.answers || {};
      parsed.badges = parsed.badges || {};
      return parsed;
    } catch (err) {
      return null;
    }
  }

  function save(profile) {
    if (!profile || !profile.slug) return;
    profile.updatedAt = Date.now();
    try {
      localStorage.setItem(PREFIX + profile.slug, JSON.stringify(profile));
      localStorage.setItem(LAST_KEY, profile.slug);
    } catch (err) {
      /* storage full or blocked: keep the session running in memory */
    }
  }

  function loadOrCreate(name) {
    const slug = slugify(name);
    if (!slug) return null;
    const existing = load(slug);
    if (existing) {
      existing.name = String(name).trim() || existing.name;
      return existing;
    }
    const fresh = blank(name);
    save(fresh);
    return fresh;
  }

  function list() {
    const out = [];
    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key || key.indexOf(PREFIX) !== 0) continue;
      const profile = load(key.slice(PREFIX.length));
      if (profile) out.push(profile);
    }
    return out.sort((a, b) => (b.updatedAt || 0) - (a.updatedAt || 0));
  }

  function remove(slug) {
    try {
      localStorage.removeItem(PREFIX + slug);
      if (localStorage.getItem(LAST_KEY) === slug) localStorage.removeItem(LAST_KEY);
    } catch (err) { /* ignore */ }
  }

  function resetProgress(profile) {
    const fresh = blank(profile.name);
    fresh.createdAt = profile.createdAt;
    save(fresh);
    return fresh;
  }

  return { slugify, available, blank, load, save, loadOrCreate, list, remove, resetProgress };
})();
