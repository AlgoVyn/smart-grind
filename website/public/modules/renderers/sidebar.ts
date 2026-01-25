// --- SIDEBAR RENDERERS MODULE ---
// Sidebar rendering functions

import { Topic } from '../types.js';

export const sidebarRenderers = {
    // Render sidebar navigation (consolidated click handlers)
    renderSidebar: () => {
        const topicList = window.SmartGrind.state.elements.topicList;
        topicList.innerHTML = '';

        // Helper for topic navigation
        const navigateToTopic = (topicId: string) => {
            window.SmartGrind.renderers.setActiveTopic(topicId);
            window.SmartGrind.utils.updateUrlParameter('category', topicId === 'all' ? null : topicId);
            window.SmartGrind.renderers.renderMainView(topicId);
            window.SmartGrind.utils.scrollToTop();
        };

        // "All Problems" Link
        const allBtn = window.SmartGrind.renderers.createTopicButton('all', 'All Problems');
        allBtn.onclick = () => navigateToTopic('all');
        topicList.appendChild(allBtn);

        // Topic buttons
        window.SmartGrind.data.topicsData.forEach((topic: Topic) => {
            const btn = window.SmartGrind.renderers.createTopicButton(topic.id, topic.title);
            btn.onclick = () => navigateToTopic(topic.id);
            topicList.appendChild(btn);
        });
    },

    // Create a topic button for sidebar
    createTopicButton: (topicId: string, title: string) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        const isActive = window.SmartGrind.state.ui.activeTopicId === topicId || (!window.SmartGrind.state.ui.activeTopicId && topicId === 'all');
        btn.className = `sidebar-link ${isActive ? 'active' : ''} w-full text-left px-5 py-3 text-sm font-medium text-theme-base hover:text-theme-bold hover:bg-dark-800 transition-colors border-r-2 border-transparent flex justify-between items-center group cursor-pointer`;
        btn.dataset['topicId'] = topicId;

        // Calculate progress
        const stats = window.SmartGrind.utils.getUniqueProblemsForTopic(topicId);
        const pct = stats.total > 0 ? Math.round((stats.solved / stats.total) * 100) : 0;

        btn.innerHTML = `
            <span class="truncate mr-2">${title}</span>
            <div class="flex items-center gap-3 shrink-0">
                <span class="text-[10px] font-mono text-theme-muted bg-dark-800 group-hover:bg-dark-900 px-2 py-0.5 rounded border border-transparent group-hover:border-theme transition-all">${stats.total}</span>
                <span class="text-[10px] ${pct === 100 ? 'text-green-400' : 'text-theme-muted group-hover:text-theme-base'} font-mono min-w-[24px] text-right transition-colors">${pct}%</span>
            </div>
        `;

        return btn;
    },

    // Set active topic in sidebar
    setActiveTopic: (topicId: string) => {
        document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
        const activeBtn = document.querySelector(`[data-topic-id="${topicId}"]`) ||
            document.querySelector('.sidebar-link:first-child'); // All problems
        if (activeBtn) activeBtn.classList.add('active');
        window.SmartGrind.state.ui.activeTopicId = topicId;
    }
};