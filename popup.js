(async () => {
  const parseProblems = (text) => {
    const lines = text.split('\n');
    const problems = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split('\t');
      if (parts.length >= 7) {
        const rating = parseFloat(parts[0]);
        const id = parts[1];
        const title = parts[2];
        const slug = parts[3];
        const contest = parts[4];
        const tagsStr = parts[6];
        const problemTags = tagsStr ? tagsStr.split(',').map(t => t.trim()) : [];
        problems.push({ rating, id, title, slug, contest, tags: problemTags });
      }
    }
    return problems;
  };

  const loadTags = async () => {
    const response = await fetch(chrome.runtime.getURL('tags.txt'));
    const text = await response.text();
    return text.split('\n').filter(t => t.trim()).map(t => t.trim());
  };

  const loadProblemsAndTags = async () => {
    const cached = await chrome.storage.local.get(['problems', 'tags']);
    if (cached.problems && cached.tags) {
      return { problems: cached.problems, tags: cached.tags };
    }
    const [problemsResponse, tags] = await Promise.all([
      fetch(chrome.runtime.getURL('ratings.txt')),
      loadTags()
    ]);
    const problemsText = await problemsResponse.text();
    const problems = parseProblems(problemsText);
    await chrome.storage.local.set({ problems, tags });
    return { problems, tags };
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

  const calculateCurrentRating = (problems, solvedProblems) => {
    if (solvedProblems.length === 0) return '--';

    // Sort by recency (most recent first)
    const sortedSolved = [...solvedProblems].sort((a, b) => b.solvedAt - a.solvedAt);

    // Calculate recency-weighted EMA
    const alpha = 0.2;
    let ema = problems.find(p => p.slug === sortedSolved[0].slug)?.rating || 0;
    for (let i = 1; i < sortedSolved.length; i++) {
      const rating = problems.find(p => p.slug === sortedSolved[i].slug)?.rating || 0;
      ema = alpha * rating + (1 - alpha) * ema;
    }

    // Apply Bayesian smoothing
    const globalAvg = problems.reduce((sum, p) => sum + p.rating, 0) / problems.length;
    const confidence = Math.min(solvedProblems.length / 100, 1);
    const bayesianRating = confidence * ema + (1 - confidence) * globalAvg;

    return Math.round(bayesianRating);
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

  const getFilteredProblems = (problems, minRating, maxRating, selectedTag) => {
    let filtered = problems.filter(p => p.rating >= minRating && p.rating <= maxRating);
    if (selectedTag) {
      filtered = filtered.filter(p => p.tags.includes(selectedTag));
    }
    return filtered;
  };

  const trackOpenedProblem = async (slug) => {
    const { openedProblems = [] } = await chrome.storage.sync.get(['openedProblems']);
    const existing = openedProblems.find(o => o.slug === slug);
    if (!existing) {
      openedProblems.push({ slug, openedAt: Date.now() });
      await chrome.storage.sync.set({ openedProblems });
    }
  };

  try {
    const { problems, tags } = await loadProblemsAndTags();
    populateTagDropdown(tags);
    let { solvedProblems = [] } = await chrome.storage.sync.get(['solvedProblems']);

    // Migrate old format (array of slugs) to new format (array of objects)
    if (solvedProblems.length > 0 && typeof solvedProblems[0] === 'string') {
      solvedProblems = solvedProblems.map(slug => ({ slug, solvedAt: Date.now() }));
      await chrome.storage.sync.set({ solvedProblems });
    }

    const currentRating = calculateCurrentRating(problems, solvedProblems);
    document.getElementById('currentRating').textContent = `Current Rating: ${currentRating}`;
    await loadSettings();

    document.getElementById('randomBtn').addEventListener('click', async () => {
      try {
        const minRating = parseFloat(document.getElementById('minRating').value) || 0;
        const maxRating = parseFloat(document.getElementById('maxRating').value) || 3000;
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
        chrome.tabs.create({ url: `https://leetcode.com/problems/${randomProblem.slug}/` });
      } catch (error) {
        console.error('Error selecting random problem:', error);
        alert('An error occurred while selecting a problem');
      }
    });
  } catch (error) {
    console.error('Error loading problems:', error);
  }
})();