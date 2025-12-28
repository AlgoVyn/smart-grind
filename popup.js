(async () => {
  const response = await fetch(chrome.runtime.getURL('ratings.txt'));
  const text = await response.text();
  const lines = text.split('\n');
  const problems = [];
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split('\t');
    if (parts.length >= 5) {
      const rating = parseFloat(parts[0]);
      const id = parts[1];
      const title = parts[2];
      const slug = parts[3];
      const contest = parts[4];
      problems.push({ rating, id, title, slug, contest });
    }
  }

  // Calculate current rating
  chrome.storage.sync.get(['solvedProblems'], (result) => {
    const solvedSlugs = result.solvedProblems || [];
    const solvedRatings = problems.filter(p => solvedSlugs.includes(p.slug)).map(p => p.rating);
    if (solvedRatings.length > 0) {
      const avgRating = solvedRatings.reduce((a, b) => a + b, 0) / solvedRatings.length;
      document.getElementById('currentRating').textContent = `Current Rating: ${Math.round(avgRating)}`;
    } else {
      document.getElementById('currentRating').textContent = 'Current Rating: --';
    }
  });

  // Load stored ratings
  chrome.storage.sync.get(['minRating', 'maxRating'], (result) => {
    if (result.minRating !== undefined) {
      document.getElementById('minRating').value = result.minRating;
    }
    if (result.maxRating !== undefined) {
      document.getElementById('maxRating').value = result.maxRating;
    }
  });

  document.getElementById('randomBtn').addEventListener('click', () => {
    const minRating = parseFloat(document.getElementById('minRating').value) || 0;
    const maxRating = parseFloat(document.getElementById('maxRating').value) || 3000;
    // Save ratings
    chrome.storage.sync.set({ minRating: minRating.toString(), maxRating: maxRating.toString() });
    const filtered = problems.filter(p => p.rating >= minRating && p.rating <= maxRating);
    if (filtered.length > 0) {
      const random = filtered[Math.floor(Math.random() * filtered.length)];
      // Store opened problem
      chrome.storage.sync.get(['openedProblems'], (result) => {
        const opened = result.openedProblems || [];
        const existing = opened.find(o => o.slug === random.slug);
        if (!existing) {
          opened.push({slug: random.slug, openedAt: Date.now()});
          chrome.storage.sync.set({ openedProblems: opened });
        }
      });
      chrome.tabs.create({ url: `https://leetcode.com/problems/${random.slug}/` });
    } else {
      alert('No problems found matching criteria');
    }
  });
})();