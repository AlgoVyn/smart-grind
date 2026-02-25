// --- AI INTEGRATION MODULE ---
// AI assistant integration for problem and algorithm help

import { state } from '../state';

/**
 * AI provider configurations with desktop and mobile URLs
 */
const AI_PROVIDERS = {
    chatgpt: {
        desktopUrl: 'https://chatgpt.com/?q=',
        mobileIntent:
            'intent://chat.openai.com#Intent;scheme=https;package=com.openai.chatgpt;S.browser_fallback_url=https%3A%2F%2Fchatgpt.com%2F;end',
    },
    aistudio: {
        desktopUrl: 'https://aistudio.google.com/prompts/new_chat?prompt=',
        mobileIntent:
            'intent://aistudio.google.com#Intent;scheme=https;package=com.google.ai.apps.aistudio;S.browser_fallback_url=https%3A%2F%2Faistudio.google.com;end',
    },
    grok: {
        desktopUrl: 'https://grok.com/?q=',
        mobileIntent:
            'intent://grok.com#Intent;scheme=https;package=com.xai.grok;S.browser_fallback_url=https%3A%2F%2Fgrok.com;end',
    },
} as const;

type AIProvider = keyof typeof AI_PROVIDERS;

/**
 * Detects if the current device is mobile
 * @returns true if mobile device detected
 */
const isMobileDevice = (): boolean => {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Generates AI prompt based on content type
 * @param name - The name of the problem or algorithm
 * @param type - Whether this is a 'problem' or 'algorithm'
 * @returns Generated prompt string
 */
const generatePrompt = (name: string, type: 'problem' | 'algorithm'): string => {
    if (type === 'algorithm') {
        return `Explain the "${name}" algorithm/technique. Provide a detailed explanation of the core concept, when to use it, step-by-step approach, template code in multiple languages, time/space complexity analysis, common variations, and 3-5 practice problems that use this technique with brief explanations of how to apply it. Include video tutorial links if available.`;
    }
    return `Explain the solution for LeetCode problem: "${name}". Provide the detailed problem statement, examples, intuition, multiple approaches with code, and time/space complexity analysis. Include related problems, video tutorial links and followup questions with brief answers without code.`;
};

/**
 * Opens an AI assistant with a pre-filled prompt for a coding problem or algorithm.
 * Supports ChatGPT, Google AI Studio, and Grok with mobile app deep linking.
 * Saves the preferred AI provider to localStorage for future use.
 * @param name - The name of the coding problem or algorithm to ask about
 * @param provider - The AI service provider to use
 * @param type - Whether this is a 'problem' or 'algorithm'
 * @returns Promise resolving when navigation is initiated
 * @example
 * // Open ChatGPT with pre-filled prompt about Two Sum problem
 * await askAI('Two Sum', 'chatgpt', 'problem');
 * // Open ChatGPT with pre-filled prompt about Two Pointers algorithm
 * await askAI('Two Pointers', 'chatgpt', 'algorithm');
 */
export const askAI = async (
    name: string,
    provider: AIProvider,
    type: 'problem' | 'algorithm' = 'problem'
): Promise<void> => {
    const isMobile = isMobileDevice();
    const aiPrompt = generatePrompt(name, type);
    const encodedPrompt = encodeURIComponent(aiPrompt);

    // Save preference
    localStorage.setItem('preferred-ai', provider);
    state.ui.preferredAI = provider;

    const config = AI_PROVIDERS[provider];
    const fallbackUrl = `${config.desktopUrl}${encodedPrompt}`;

    const url = isMobile
        ? config.mobileIntent.replace(
              /S\.browser_fallback_url=[^;]+/,
              `S.browser_fallback_url=${encodeURIComponent(fallbackUrl)}`
          )
        : fallbackUrl;

    if (isMobile) {
        window.location.href = url;
    } else {
        window.open(url, '_blank');
    }
};
