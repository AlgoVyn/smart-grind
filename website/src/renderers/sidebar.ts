// --- SIDEBAR RENDERERS MODULE ---
// Sidebar rendering functions

import { Topic } from '../types';
import { state } from '../state';
import { data } from '../data';
import { updateUrlParameter, scrollToTop, getUniqueProblemsForTopic } from '../utils';
import { AlgorithmCategory } from '../data/algorithms-data';

export const sidebarRenderers = {
    // Render sidebar navigation (consolidated click handlers)
    renderSidebar: () => {
        const topicList = state.elements['topicList'];
        if (topicList) {
            // Use DocumentFragment for batch DOM insertion (performance optimization)
            const fragment = document.createDocumentFragment();

            // Helper for topic navigation
            const navigateToTopic = async (topicId: string) => {
                sidebarRenderers.setActiveTopic(topicId);
                sidebarRenderers.setActiveAlgorithmCategory(null);
                // Only update URL once - set category path (clears algorithm path automatically)
                updateUrlParameter('category', topicId === 'all' ? null : topicId);
                const { renderers } = await import('../renderers');
                await renderers.renderMainView(topicId);
                scrollToTop();
            };

            // Helper for algorithm category navigation
            const navigateToAlgorithmCategory = async (categoryId: string) => {
                sidebarRenderers.setActiveTopic(null);
                sidebarRenderers.setActiveAlgorithmCategory(categoryId);
                // Only update URL once - set algorithm path (clears category path automatically)
                updateUrlParameter('algorithms', categoryId === 'all' ? null : categoryId);
                const { renderers } = await import('../renderers');
                await renderers.renderAlgorithmsView(categoryId);
                scrollToTop();
            };

            // Determine which sections should be expanded based on active view
            const algorithmsExpanded = !!state.ui.activeAlgorithmCategoryId;
            const patternsExpanded = !state.ui.activeAlgorithmCategoryId;

            // ===========================================
            // ALGORITHMS SECTION (collapsible)
            // ===========================================
            const algorithmsSection = sidebarRenderers.createCollapsibleSection(
                'algorithms-section',
                'Algorithms',
                algorithmsExpanded
            );
            fragment.appendChild(algorithmsSection.container);

            // "All Algorithms" Link
            const allAlgorithmsBtn = sidebarRenderers.createAlgorithmAllButton();
            allAlgorithmsBtn.onclick = () => navigateToAlgorithmCategory('all');
            algorithmsSection.content.appendChild(allAlgorithmsBtn);

            // Algorithm category buttons
            data.algorithmsData.forEach((category: AlgorithmCategory) => {
                const btn = sidebarRenderers.createAlgorithmCategoryButton(category);
                btn.onclick = () => navigateToAlgorithmCategory(category.id);
                algorithmsSection.content.appendChild(btn);
            });

            // ===========================================
            // PATTERNS SECTION (collapsible)
            // ===========================================
            const patternsSection = sidebarRenderers.createCollapsibleSection(
                'patterns-section',
                'Patterns',
                patternsExpanded
            );
            fragment.appendChild(patternsSection.container);

            // "All Problems" Link
            const allBtn = sidebarRenderers.createTopicButton('all', 'All Problems');
            allBtn.onclick = () => navigateToTopic('all');
            patternsSection.content.appendChild(allBtn);

            // Topic buttons
            data.topicsData.forEach((topic: Topic) => {
                const btn = sidebarRenderers.createTopicButton(topic.id, topic.title);
                btn.onclick = () => navigateToTopic(topic.id);
                patternsSection.content.appendChild(btn);
            });

            // Batch append all at once (single reflow)
            topicList.innerHTML = '';
            topicList.appendChild(fragment);
        }
    },

    // Create a collapsible section with header and content
    createCollapsibleSection: (id: string, title: string, expanded: boolean) => {
        const container = document.createElement('div');
        container.className = 'sidebar-collapsible-section';
        container.id = id;

        // Create header
        const header = document.createElement('button');
        header.type = 'button';
        header.className =
            'sidebar-section-header w-full flex items-center justify-between cursor-pointer';
        header.innerHTML = `
            <div class="flex items-center gap-2">
                <svg class="sidebar-chevron w-4 h-4 text-theme-muted transition-transform duration-200 ${expanded ? 'rotate-90' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
                <span class="sidebar-section-title">${title}</span>
            </div>
        `;

        // Create content container
        const content = document.createElement('div');
        content.className = `sidebar-section-content ${expanded ? '' : 'hidden'}`;

        // Toggle functionality
        header.onclick = () => {
            const isExpanded = !content.classList.contains('hidden');
            content.classList.toggle('hidden');
            const chevron = header.querySelector('.sidebar-chevron');
            if (chevron) {
                chevron.classList.toggle('rotate-90', !isExpanded);
            }
        };

        container.appendChild(header);
        container.appendChild(content);

        return { container, content };
    },

    // Helper to generate progress stats HTML
    _generateProgressHTML: (total: number, solved: number): string => {
        const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
        const pctClass = pct === 100 ? 'text-green-400' : 'text-theme-muted';
        return `
            <div class="flex items-center gap-3 shrink-0">
                <span class="text-[10px] font-mono text-theme-muted bg-dark-800 px-2 py-0.5 rounded border border-transparent">${total}</span>
                <span class="text-[10px] ${pctClass} font-mono min-w-[24px] text-right">${pct}%</span>
            </div>
        `;
    },

    // Create a topic button for sidebar
    createTopicButton: (topicId: string, title: string) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isActive =
            state.ui.activeTopicId === topicId || (!state.ui.activeTopicId && topicId === 'all');
        btn.className = `sidebar-link ${isActive ? 'active' : ''} w-full text-left px-5 py-3 text-sm font-medium text-theme-base transition-colors border-r-2 border-transparent flex justify-between items-center group cursor-pointer`;
        btn.dataset['topicId'] = topicId;

        const stats = getUniqueProblemsForTopic(topicId);
        btn.innerHTML = `
            <span class="truncate mr-2">${title}</span>
            ${sidebarRenderers._generateProgressHTML(stats.total, stats.solved)}
        `;

        return btn;
    },

    // Create an algorithm category button (simple button, not collapsible)
    createAlgorithmCategoryButton: (category: AlgorithmCategory) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isActive = state.ui.activeAlgorithmCategoryId === category.id;
        btn.className = `sidebar-algorithm-category ${isActive ? 'active' : ''} w-full text-left px-5 py-3 text-sm font-medium text-theme-base transition-colors flex justify-between items-center group cursor-pointer`;
        btn.dataset['categoryId'] = category.id;

        // Calculate progress for this category
        const solved = category.algorithms.filter(
            (algo) => state.problems.get(algo.id)?.status === 'solved'
        ).length;

        btn.innerHTML = `
            <span class="truncate mr-2">${category.title}</span>
            ${sidebarRenderers._generateProgressHTML(category.algorithms.length, solved)}
        `;

        return btn;
    },

    // Create "All Algorithms" button for sidebar
    createAlgorithmAllButton: () => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isActive = state.ui.activeAlgorithmCategoryId === 'all';
        btn.className = `sidebar-algorithm-category ${isActive ? 'active' : ''} w-full text-left px-5 py-3 text-sm font-medium text-theme-base transition-colors border-r-2 border-transparent flex justify-between items-center group cursor-pointer`;
        btn.dataset['categoryId'] = 'all';

        // Calculate progress for all algorithms
        const { total, solved } = data.algorithmsData.reduce(
            (acc, category) => {
                category.algorithms.forEach((algo) => {
                    acc.total++;
                    if (state.problems.get(algo.id)?.status === 'solved') {
                        acc.solved++;
                    }
                });
                return acc;
            },
            { total: 0, solved: 0 }
        );

        btn.innerHTML = `
            <span class="truncate mr-2">All Algorithms</span>
            ${sidebarRenderers._generateProgressHTML(total, solved)}
        `;

        return btn;
    },

    // Set active topic in sidebar
    setActiveTopic: (topicId: string | null) => {
        document.querySelectorAll('.sidebar-link').forEach((l) => l.classList.remove('active'));
        if (topicId) {
            const activeBtn =
                document.querySelector(`[data-topic-id="${topicId}"]`) ||
                document.querySelector('.sidebar-link:first-child'); // All problems
            if (activeBtn) activeBtn.classList.add('active');
        }
        state.ui.activeTopicId = topicId || 'all';
    },

    // Set active algorithm category in sidebar
    setActiveAlgorithmCategory: (categoryId: string | null) => {
        document
            .querySelectorAll('.sidebar-algorithm-category')
            .forEach((l) => l.classList.remove('active'));
        if (categoryId) {
            const activeBtn = document.querySelector(
                `[data-category-id="${categoryId}"].sidebar-algorithm-category`
            );
            if (activeBtn) activeBtn.classList.add('active');
        }
        state.ui.activeAlgorithmCategoryId = categoryId;
        // Clear active topic when viewing algorithms
        if (categoryId) {
            state.ui.activeTopicId = '';
        }
    },
};
