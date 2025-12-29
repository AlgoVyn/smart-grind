(async () => {
  // Load problems with caching
  let problems = [];
  let tags = [];
  try {
    const cached = await chrome.storage.local.get(['problems', 'tags']);
    if (cached.problems && cached.tags) {
      problems = cached.problems;
      tags = cached.tags;
    } else {
      const response = await fetch(chrome.runtime.getURL('ratings.txt'));
      const text = await response.text();
      const lines = text.split('\n');
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
      const tagsResponse = await fetch(chrome.runtime.getURL('tags.txt'));
      const tagsText = await tagsResponse.text();
      tags = tagsText.split('\n').filter(t => t.trim()).map(t => t.trim());
      await chrome.storage.local.set({ problems, tags });
    }
  } catch (error) {
    console.error('Error loading problems:', error);
  }

  // Populate tag dropdown
  const tagSelect = document.getElementById('tagSelect');
  tags.forEach(tag => {
    const option = document.createElement('option');
    option.value = tag;
    option.textContent = tag;
    tagSelect.appendChild(option);
  });

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

  // Load stored ratings and tag
  chrome.storage.sync.get(['minRating', 'maxRating', 'selectedTag'], (result) => {
    if (result.minRating !== undefined) {
      document.getElementById('minRating').value = result.minRating;
    }
    if (result.maxRating !== undefined) {
      document.getElementById('maxRating').value = result.maxRating;
    }
    if (result.selectedTag !== undefined) {
      document.getElementById('tagSelect').value = result.selectedTag;
    }
  });

  document.getElementById('randomBtn').addEventListener('click', () => {
    try {
      const minRating = parseFloat(document.getElementById('minRating').value) || 0;
      const maxRating = parseFloat(document.getElementById('maxRating').value) || 3000;
      const selectedTag = document.getElementById('tagSelect').value;
      if (minRating > maxRating) {
        alert('Min rating cannot be greater than max rating');
        return;
      }
      // Save ratings and tag
      chrome.storage.sync.set({ minRating: minRating.toString(), maxRating: maxRating.toString(), selectedTag });
      let filtered = problems.filter(p => p.rating >= minRating && p.rating <= maxRating);
      if (selectedTag) {
        filtered = filtered.filter(p => p.tags.includes(selectedTag));
      }
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
    } catch (error) {
      console.error('Error selecting random problem:', error);
      alert('An error occurred while selecting a problem');
    }
  });
})();