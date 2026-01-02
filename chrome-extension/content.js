(async () => {
  const SUBMISSION_QUERY = `
    query($slug: String!) {
      submissionList(offset: 0, limit: 20, questionSlug: $slug) {
        submissions {
          statusDisplay
          timestamp
        }
      }
    }
  `;

  const loadRatings = async () => {
    try {
      const cached = await chrome.storage.local.get('ratings');
      if (cached.ratings) {
        return cached.ratings;
      }
      const response = await fetch(chrome.runtime.getURL('ratings.txt'));
      const text = await response.text();
      const ratings = text.split('\n').slice(1).reduce((acc, line) => {
        const parts = line.split('\t');
        if (parts.length >= 5) {
          acc[parts[3]] = parseFloat(parts[0]);
        }
        return acc;
      }, {});
      await chrome.storage.local.set({ ratings });
      return ratings;
    } catch (error) {
      console.error('Error loading ratings:', error);
      return {};
    }
  };

  const findDifficultyElement = () =>
    document.querySelector('.text-difficulty-easy, .text-difficulty-medium, .text-difficulty-hard') ||
    Array.from(document.querySelectorAll('*')).find(el => ['Easy', 'Medium', 'Hard'].includes(el.textContent.trim()));

  const getSyncStorage = keys => new Promise(resolve => chrome.storage.sync.get(keys, resolve));
  const setSyncStorage = obj => new Promise(resolve => chrome.storage.sync.set(obj, resolve));

  const findSubmitButton = () =>
    document.querySelector('button[data-cy="submit-code-btn"]') ||
    document.querySelector('.submit-btn') ||
    Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.trim() === 'Submit');

  const updateProblemPage = (ratings, slug) => {
    const rating = ratings[slug];
    if (rating === undefined) return;
    const difficultyElement = findDifficultyElement();
    if (difficultyElement) {
      difficultyElement.textContent = Math.round(rating);
    }
  };

  const checkSubmissions = async (slug) => {
    try {
      const response = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: SUBMISSION_QUERY, variables: { slug } }),
      });
      const data = await response.json();
      const submissions = data?.data?.submissionList?.submissions;
      if (!submissions) return;

      const { solvedProblems = [], openedProblems = [] } = await getSyncStorage(['solvedProblems', 'openedProblems']);
      const openedEntry = openedProblems.find(o => o.slug === slug);
      if (solvedProblems.some(p => p.slug === slug) || !openedEntry) return;

      for (const sub of submissions) {
        if (sub.statusDisplay === 'Accepted' && sub.timestamp * 1000 > openedEntry.openedAt) {
          solvedProblems.push({ slug, solvedAt: Date.now() });
          const updatedOpened = openedProblems.filter(o => o.slug !== slug);
          await setSyncStorage({ solvedProblems, openedProblems: updatedOpened });
          break;
        }
      }
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const updateProblemsPage = (ratings) => {
    const allPs = document.querySelectorAll('p[class*="text-sd-"]');
    allPs.forEach(p => {
      const text = p.textContent.trim();
      if (['Easy', 'Med.', 'Hard'].includes(text)) {
        const link = p.closest('a[href*="/problems/"]');
        if (link) {
          const problemSlug = link.getAttribute('href').split(/\/|\?/)[2];
          const problemRating = ratings[problemSlug];
          if (problemRating !== undefined) {
            p.textContent = Math.round(problemRating);
          }
        }
      }
    });
  };

  const ratings = await loadRatings();
  const path = window.location.pathname;
  const updateRatings = () => updateProblemsPage(ratings);
  const observer = new MutationObserver(updateRatings);
  observer.observe(document.body, { childList: true, subtree: true });

  if (path.includes('/problems/')) {
    const slug = path.split('/')[2];
    updateProblemPage(ratings, slug);

    const submitButton = findSubmitButton();
    if (submitButton) {
      submitButton.addEventListener('click', () => {
        setTimeout(() => checkSubmissions(slug), 5000);
      });
    }
  }

  if (path.includes('/problemset') || path.includes('/problem-list')) {
    updateRatings();
  }
})();