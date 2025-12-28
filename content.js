(async () => {
  const response = await fetch(chrome.runtime.getURL('ratings.txt'));
  const text = await response.text();
  const lines = text.split('\n');
  const ratings = {};
  for (let i = 1; i < lines.length; i++) {
    const parts = lines[i].split('\t');
    if (parts.length >= 5) {
      const rating = parseFloat(parts[0]);
      const slug = parts[3];
      ratings[slug] = rating;
    }
  }

  const path = window.location.pathname;
  if (path.includes('/problems/')) {
    const slug = path.split('/')[2];
    const rating = ratings[slug];
    if (rating !== undefined) {
      // Find the difficulty element
      const difficultyElement = document.querySelector('.text-difficulty-easy, .text-difficulty-medium, .text-difficulty-hard') ||
                                Array.from(document.querySelectorAll('*')).find(el => el.textContent.trim() === 'Easy' || el.textContent.trim() === 'Medium' || el.textContent.trim() === 'Hard');
      if (difficultyElement) {
        difficultyElement.textContent = Math.round(rating);
      }
    }

    const checkSolved = async () => {
      await checkSubmissions();
    };

    const checkSubmissions = async () => {
      const query = `
        query {
          submissionList(offset: 0, limit: 20, questionSlug: "${slug}") {
            submissions {
              statusDisplay
              timestamp
            }
          }
        }
      `;
      try {
        const response = await fetch('https://leetcode.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query }),
        });
        const data = await response.json();
        if (data && data.data && data.data.submissionList && data.data.submissionList.submissions) {
          const submissions = data.data.submissionList.submissions;
          chrome.storage.sync.get(['solvedProblems', 'openedProblems'], (result) => {
            const solved = result.solvedProblems || [];
            const opened = result.openedProblems || [];
            const openedEntry = opened.find(o => o.slug === slug);
            if (!solved.includes(slug) && openedEntry) {
              for (let sub of submissions) {
                if (sub.statusDisplay === 'Accepted') {
                  const submissionTime = sub.timestamp * 1000; // timestamp is in seconds
                  if (submissionTime > openedEntry.openedAt) {
                    solved.push(slug);
                    const updatedOpened = opened.filter(o => o.slug !== slug);
                    chrome.storage.sync.set({ solvedProblems: solved, openedProblems: updatedOpened });
                    break;
                  }
                }
              }
            }
          });
        }
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    // Check after submit
    const submitButton = document.querySelector('button[data-cy="submit-code-btn"]') || Array.from(document.querySelectorAll('button')).find(btn => btn.textContent.trim() === 'Submit') || document.querySelector('.submit-btn');
    if (submitButton) {
      submitButton.addEventListener('click', () => {
        setTimeout(() => checkSolved(), 5000); // Check 5 seconds after submit
      });
    }
  }

  // Update problemset or problem-list page
  if (path.includes('/problemset') || path.includes('/problem-list')) {
    const updateRatings = () => {
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
    // Update immediately and observe
    updateRatings();
    const observer = new MutationObserver(updateRatings);
    observer.observe(document.body, { childList: true, subtree: true });
  }
})();