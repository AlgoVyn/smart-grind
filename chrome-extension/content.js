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

  // AI provider configurations
  const _aiProviders = {
    chatgpt: {
      mobileIntent: 'intent://chat.openai.com#Intent;scheme=https;package=com.openai.chatgpt;S.browser_fallback_url=https%3A%2F%2Fchatgpt.com%2F;end',
      desktopUrl: 'https://chatgpt.com/?q='
    },
    aistudio: {
      mobileIntent: 'intent://aistudio.google.com#Intent;scheme=https;package=com.google.ai.apps.aistudio;S.browser_fallback_url=https%3A%2F%2Faistudio.google.com;end',
      desktopUrl: 'https://aistudio.google.com/prompts/new_chat?prompt='
    },
    grok: {
      mobileIntent: 'intent://grok.com#Intent;scheme=https;package=com.xai.grok;S.browser_fallback_url=https%3A%2F%2Fgrok.com;end',
      desktopUrl: 'https://grok.com/?q='
    }
  };

  // Helper to build AI URL
  const _buildAIUrl = (provider, encodedPrompt) => {
    const config = _aiProviders[provider];
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      const fallbackParam = encodeURIComponent(`${config.desktopUrl}${encodedPrompt}`);
      return config.mobileIntent.replace(/S\.browser_fallback_url=[^;]+/, `S.browser_fallback_url=${fallbackParam}`);
    } else {
      return config.desktopUrl + encodedPrompt;
    }
  };

  // AI helper
  const askAI = async (problemName, provider) => {
    const aiPrompt = `Explain the solution for LeetCode problem: "${problemName}". Provide the detailed problem statement, examples, intuition, multiple approaches with code, and time/space complexity analysis. Include related problems, video tutorial links and followup questions.`;
    const encodedPrompt = encodeURIComponent(aiPrompt);

    const url = _buildAIUrl(provider, encodedPrompt);

    if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      window.location.href = url;
    } else {
      window.open(url, '_blank');
    }
  };

  // Generate AI buttons HTML
  const generateAIButtons = () => `
    <div class="flex items-center bg-gray-800 rounded-lg border border-gray-600">
      <button class="p-2 rounded-l-lg hover:bg-gray-700 text-gray-300 hover:text-green-500 transition-colors border-r border-gray-600" data-action="ask-chatgpt" title="Ask ChatGPT">
        <svg fill="currentColor" class="w-4 h-4" viewBox="0 0 24 24">
          <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"/>
        </svg>
      </button>
      <button class="p-2 hover:bg-gray-700 text-gray-300 hover:text-blue-400 transition-colors border-r border-gray-600" data-action="ask-aistudio" title="Ask AI Studio">
        <svg class="w-4 h-4" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g clip-path="url(#clip0)" fill-rule="evenodd" clip-rule="evenodd"><path d="M211.648 89.515h-76.651A57.707 57.707 0 0077.291 147.2v242.389a57.707 57.707 0 0057.706 57.707h242.411a57.707 57.707 0 0057.707-57.707V288.128l34.624-23.744v125.227a92.35 92.35 0 01-92.331 92.33H134.997a92.349 92.349 0 01-92.33-92.33v-242.39A92.336 92.336 0 0169.702 81.92a92.33 92.33 0 0165.295-27.05h96.96l-20.309 34.645z"/><path d="M380.16 0c3.093 0 5.717 2.219 6.379 5.248a149.328 149.328 0 0040.533 74.325 149.332 149.332 0 0074.347 40.555c3.029.661 5.248 3.285 5.248 6.4a6.574 6.574 0 01-5.248 6.357 149.338 149.338 0 00-74.326 40.555 149.338 149.338 0 00-40.789 75.413 6.334 6.334 0 01-6.144 5.078 6.334 6.334 0 01-6.144-5.078 149.338 149.338 0 00-40.789-75.413 149.326 149.326 0 00-75.414-40.79 6.338 6.338 0 01-5.077-6.144c0-2.987 2.133-5.547 5.077-6.144a149.336 149.336 0 0075.414-40.79 149.354 149.354 0 0040.554-74.325A6.573 6.573 0 01380.16 0z"/></g><defs><clipPath id="clip0"><path fill="#fff" d="M0 0h512v512H0z"/></clipPath></defs></svg>
      </button>
      <button class="p-2 rounded-r-lg hover:bg-gray-700 text-gray-300 hover:text-purple-400 transition-colors" data-action="ask-grok" title="Ask Grok">
        <svg fill="currentColor" fill-rule="evenodd" class="w-4 h-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.27 15.29l7.978-5.897c.391-.29.95-.177 1.137.272.98 2.369.542 5.215-1.41 7.169-1.951 1.954-4.667 2.382-7.149 1.406l-2.711 1.257c3.889 2.661 8.611 2.003 11.562-.953 2.341-2.344 3.066-5.539 2.388-8.42l.006.007c-.983-4.232.242-5.924 2.75-9.383.06-.082.12-.164.179-.248l-3.301 3.305v-.01L9.267 15.292M7.623 16.723c-2.792-2.67-2.31-6.801.071-9.184 1.761-1.763 4.647-2.483 7.166-1.425l2.705-1.25a7.808 7.808 0 00-1.829-1A8.975 8.975 0 005.984 5.83c-2.533 2.536-3.33 6.436-1.962 9.764 1.022 2.487-.653 4.246-2.34 6.022-.599.63-1.199 1.259-1.682 1.925l7.62-6.815"></path></svg>
      </button>
    </div>
  `;

  // Inject AI buttons on problem page
  const injectAIButtons = (problemName) => {
    if (document.querySelector('.smartgrind-ai-buttons')) return;

    const topBtns = document.getElementById('ide-top-btns');
    if (topBtns) {
      const container = document.createElement('div');
      container.className = 'smartgrind-ai-buttons';
      container.innerHTML = generateAIButtons();
      topBtns.appendChild(container);

      container.addEventListener('click', (e) => {
        const action = e.target.closest('button')?.dataset.action;
        if (action && action.startsWith('ask-')) {
          const provider = action.replace('ask-', '');
          askAI(problemName, provider);
        }
      });
    }
  };

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

    // Inject AI buttons after a short delay to ensure page is loaded
    setTimeout(() => {
      injectAIButtons(slug.replace(/-/g, ' '));
    }, 2000);
  }

  if (path.includes('/problemset') || path.includes('/problem-list')) {
    updateRatings();
  }
})();