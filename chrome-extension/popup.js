(async () => {
  const { parseProblems, calculateCurrentRating, getFilteredProblems } = SmartGrindRatings;

  const loadTags = async () => {
    const response = await fetch(chrome.runtime.getURL('tags.txt'));
    const text = await response.text();
    return text.split('\n').filter(t => t.trim()).map(t => t.trim());
  };

  // Cache is version-stamped so dataset updates shipped with a new extension
  // version actually reach existing users (storage.local persists across
  // updates; without the stamp users kept stale ratings forever)
  const EXTENSION_VERSION = chrome.runtime.getManifest().version;

  const loadProblemsAndTags = async () => {
    const cached = await chrome.storage.local.get('datasetCache');
    if (cached.datasetCache?.version === EXTENSION_VERSION && cached.datasetCache.data) {
      return cached.datasetCache.data;
    }
    const [problemsResponse, tags] = await Promise.all([
      fetch(chrome.runtime.getURL('ratings.txt')),
      loadTags()
    ]);
    const problemsText = await problemsResponse.text();
    const problems = parseProblems(problemsText);
    const data = { problems, tags };
    await chrome.storage.local.set({ datasetCache: { version: EXTENSION_VERSION, data } });
    return data;
  };

  // The solved/opened collections live in storage.local (they overflow the
  // 8KB-per-item storage.sync quota at ~100-150 entries); legacy sync data is
  // migrated on first read. Mirrors the helpers in content.js.
  const getCollection = async (key) => {
    const local = await chrome.storage.local.get(key);
    if (local[key]) return local[key];

    const legacy = await chrome.storage.sync.get(key);
    if (Array.isArray(legacy[key])) {
      // Normalize old string-array format to objects
      const migrated = legacy[key].map((entry) =>
        typeof entry === 'string' ? { slug: entry, solvedAt: Date.now() } : entry
      );
      await chrome.storage.local.set({ [key]: migrated });
      return migrated;
    }
    return [];
  };

  const populateTagDropdown = (tags) => {
    const tagSelect = document.getElementById('tagSelect');
    tags.forEach(tag => {
      const option = document.createElement('option');
      option.value = tag;
      option.textContent = tag;
      tagSelect.appendChild(option);
    });
  };

  const loadSettings = async () => {
    const settings = await chrome.storage.sync.get(['minRating', 'maxRating', 'selectedTag']);
    if (settings.minRating !== undefined) {
      document.getElementById('minRating').value = settings.minRating;
    }
    if (settings.maxRating !== undefined) {
      document.getElementById('maxRating').value = settings.maxRating;
    }
    if (settings.selectedTag !== undefined) {
      document.getElementById('tagSelect').value = settings.selectedTag;
    }
  };

  const trackOpenedProblem = async (slug) => {
    const openedProblems = await getCollection('openedProblems');
    const existing = openedProblems.find(o => o.slug === slug);
    if (!existing) {
      openedProblems.push({ slug, openedAt: Date.now() });
      // Bound growth: entries are pruned by the content script once a problem
      // is solved, but unsolved entries could accumulate forever
      const bounded = openedProblems.slice(-500);
      await chrome.storage.local.set({ openedProblems: bounded });
    }
  };

  // parseFloat('') and parseFloat('0') differ: an explicit 0 must be kept,
  // only non-numeric input falls back to the default
  const parseRating = (value, fallback) => {
    const parsed = parseFloat(value);
    return Number.isFinite(parsed) ? parsed : fallback;
  };

  try {
    const { problems, tags } = await loadProblemsAndTags();
    populateTagDropdown(tags);
    const solvedProblems = await getCollection('solvedProblems');

    const currentRating = calculateCurrentRating(problems, solvedProblems);
    document.getElementById('currentRating').textContent = `Current Rating: ${currentRating}`;
    await loadSettings();

    document.getElementById('randomBtn').addEventListener('click', async () => {
      try {
        const minRating = parseRating(document.getElementById('minRating').value, 0);
        const maxRating = parseRating(document.getElementById('maxRating').value, 3000);
        const selectedTag = document.getElementById('tagSelect').value;
        if (minRating > maxRating) {
          alert('Min rating cannot be greater than max rating');
          return;
        }
        await chrome.storage.sync.set({ minRating, maxRating, selectedTag });
        const filtered = getFilteredProblems(problems, minRating, maxRating, selectedTag);
        if (filtered.length === 0) {
          alert('No problems found matching criteria');
          return;
        }
        const randomProblem = filtered[Math.floor(Math.random() * filtered.length)];
        await trackOpenedProblem(randomProblem.slug);
        window.open(`https://leetcode.com/problems/${randomProblem.slug}/`, '_blank');
      } catch (error) {
        console.error('Error selecting random problem:', error);
        alert('An error occurred while selecting a problem');
      }
    });
  } catch (error) {
    console.error('Error loading problems:', error);
  }
})();
