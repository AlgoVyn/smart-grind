// --- SIDEBAR RENDERERS MODULE ---
import { Topic } from '../types';
import { state } from '../state';
import { data } from '../data';
import { updateUrlParameter, scrollToTop } from '../utils';
import { AlgorithmCategory } from '../data/algorithms-data';
import { SQLCategory } from '../data/sql-data';
import { ICONS } from './icons';
import { toggleMobileMenu } from '../ui/ui-navigation';

type ViewType = 'topic' | 'algorithm' | 'sql' | 'all';

const NAV_HELPERS: Record<string, (_id: string) => Promise<void>> = {
    topic: async (id) => {
        setActiveState('topic', id);
        updateUrlParameter('category', id === 'all' ? null : id);
        const { renderers } = await import('../renderers');
        await renderers.renderMainView(id);
        renderers.updateStats();
    },
    algorithm: async (id) => {
        setActiveState('algorithm', id);
        updateUrlParameter('algorithms', id === 'all' ? null : id);
        const { renderers } = await import('../renderers');
        await renderers.renderAlgorithmsView(id);
        renderers.updateStats();
    },
    sql: async (id) => {
        setActiveState('sql', id);
        updateUrlParameter('sql', id === 'all' ? null : id);
        const { renderers } = await import('../renderers');
        await renderers.renderSQLView(id);
        renderers.updateStats();
    },
    all: async (_id) => {
        setActiveState('all', null);
        updateUrlParameter('category', null);
        updateUrlParameter('algorithms', null);
        updateUrlParameter('sql', null);
        const { renderers } = await import('../renderers');
        await renderers.renderCombinedView();
        renderers.updateStats();
    },
};

const setActiveState = (type: ViewType, id: string | null, clearValue: '' | null = '') => {
    // Clear all active states
    state.ui.activeTopicId = '';
    state.ui.activeAlgorithmCategoryId = null;
    state.ui.activeSQLCategoryId = null;
    (state.ui as { activeAlgorithmCategoryId: string | null }).activeAlgorithmCategoryId =
        clearValue;
    (state.ui as { activeSQLCategoryId: string | null }).activeSQLCategoryId = clearValue;

    // Set new active state
    if (type === 'topic') state.ui.activeTopicId = id || '';
    if (type === 'algorithm')
        (state.ui as { activeAlgorithmCategoryId: string | null }).activeAlgorithmCategoryId =
            id || '';
    if (type === 'sql')
        (state.ui as { activeSQLCategoryId: string | null }).activeSQLCategoryId = id || '';

    // Update UI classes
    document
        .querySelectorAll(
            '.sidebar-link, .sidebar-algorithm-category, .sidebar-sql-category, .sidebar-all-content'
        )
        .forEach((el) => el.classList.remove('active'));

    if (id && type !== 'all') {
        const selector =
            type === 'topic'
                ? `[data-topic-id="${id}"]`
                : type === 'algorithm'
                  ? `[data-category-id="${id}"].sidebar-algorithm-category`
                  : `[data-sql-category-id="${id}"].sidebar-sql-category`;
        const el = document.querySelector(selector);
        if (el) {
            el.classList.add('active');
        } else if (type === 'topic') {
            // Fallback to first sidebar-link for topics
            document.querySelector('.sidebar-link')?.classList.add('active');
        }
    } else if (type === 'all') {
        document.querySelector('.sidebar-all-content')?.classList.add('active');
    }
};

const navigate = async (type: ViewType, id: string) => {
    await NAV_HELPERS[type]?.(id);
    scrollToTop();
    if (window.innerWidth < 768) toggleMobileMenu();
};

const createCollapsibleSection = (id: string, title: string, expanded: boolean) => {
    const container = document.createElement('div');
    container.className = 'sidebar-collapsible-section';
    container.id = id;

    const header = document.createElement('button');
    header.type = 'button';
    header.className =
        'sidebar-section-header w-full flex items-center justify-between cursor-pointer';
    header.dataset['testid'] = 'sidebar-section-header';
    header.innerHTML = `
        <div class="flex items-center gap-2">
            <svg aria-hidden="true" class="sidebar-chevron w-4 h-4 text-theme-muted transition-transform duration-200 ${expanded ? 'rotate-90' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
            <span class="sidebar-section-title">${title}</span>
        </div>`;

    const content = document.createElement('div');
    content.className = `sidebar-section-content ${expanded ? '' : 'hidden'}`;

    header.onclick = () => {
        const isExpanded = !content.classList.contains('hidden');
        content.classList.toggle('hidden');
        header.querySelector('.sidebar-chevron')?.classList.toggle('rotate-90', !isExpanded);
    };

    container.appendChild(header);
    container.appendChild(content);
    return { container, content };
};

const calcProgressHTML = (total: number, solved: number): string => {
    const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
    const pctClass = pct === 100 ? 'text-green-400' : 'text-theme-muted';
    return `<div class="flex items-center gap-3 shrink-0">
        <span class="sidebar-stat-total text-[10px] font-mono text-theme-muted">${total}</span>
        <span class="sidebar-stat-pct text-[10px] ${pctClass} font-mono min-w-[24px] text-right">${pct}%</span>
    </div>`;
};

const getPatternStats = (topicId: string): { total: number; solved: number } => {
    const uniqueIds = new Set<string>();
    let solved = 0;

    const topics =
        topicId === 'all' ? data.topicsData : data.topicsData.filter((t) => t.id === topicId);

    topics.forEach((topic) => {
        topic.patterns.forEach((pattern) => {
            pattern.problems.forEach((prob) => {
                const id = typeof prob === 'string' ? prob : prob.id;
                if (id.startsWith('sql-') || uniqueIds.has(id)) return;
                uniqueIds.add(id);
                if (state.problems.get(id)?.status === 'solved') solved++;
            });
        });
    });

    return { total: uniqueIds.size, solved };
};

const getTopicIcon = (topicId: string): string =>
    ICONS.topicIcons[topicId as keyof typeof ICONS.topicIcons] || ICONS.topicIcons.default;

type ButtonConfig = {
    id: string;
    title: string;
    icon: string;
    total: number;
    solved: number;
    isActive: boolean;
    className: string;
    dataset: Record<string, string>;
};

const createSidebarButton = (config: ButtonConfig): HTMLButtonElement => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `${config.className} ${config.isActive ? 'active' : ''} w-full text-left px-3 py-3 text-sm font-medium text-theme-base transition-colors flex justify-between items-center group cursor-pointer`;
    Object.entries(config.dataset).forEach(([key, value]) => {
        btn.dataset[key] = value;
    });

    btn.innerHTML = `
        <span class="flex items-center min-w-0 flex-1 overflow-hidden">
            ${config.icon}
            <span class="truncate ml-2 sidebar-btn-text">${config.title}</span>
        </span>
        ${calcProgressHTML(config.total, config.solved)}`;

    return btn;
};

const countSolved = (ids: Iterable<string>): number => {
    let count = 0;
    for (const id of ids) {
        if (state.problems.get(id)?.status === 'solved') count++;
    }
    return count;
};

const getAlgorithmStats = (
    category: AlgorithmCategory | 'all'
): { total: number; solved: number } => {
    const uniqueIds = new Set<string>();
    const categories = category === 'all' ? data.algorithmsData : [category];
    categories.forEach((c) => c.algorithms.forEach((a) => uniqueIds.add(a.id)));
    return { total: uniqueIds.size, solved: countSolved(uniqueIds) };
};

const getSQLStats = (category: SQLCategory | 'all'): { total: number; solved: number } => {
    const uniqueIds = new Set<string>();
    const categories = category === 'all' ? data.sqlData : [category];
    categories.forEach((cat) => {
        cat.topics.forEach((t) => {
            t.patterns.forEach((p) => {
                p.problems.forEach((prob) => uniqueIds.add(prob.id));
            });
        });
    });
    return { total: uniqueIds.size, solved: countSolved(uniqueIds) };
};

const getAllContentStats = (): { total: number; solved: number } => {
    const uniqueIds = new Set<string>();

    // Pattern problems
    data.topicsData.forEach((t) => {
        t.patterns.forEach((p) => {
            p.problems.forEach((prob) => {
                const id = typeof prob === 'string' ? prob : prob.id;
                if (!id.startsWith('sql-')) uniqueIds.add(id);
            });
        });
    });

    // Algorithm problems
    data.algorithmsData.forEach((c) => c.algorithms.forEach((a) => uniqueIds.add(a.id)));

    // SQL problems
    data.sqlData.forEach((c) => {
        c.topics.forEach((t) => {
            t.patterns.forEach((p) => p.problems.forEach((prob) => uniqueIds.add(prob.id)));
        });
    });

    return { total: uniqueIds.size, solved: countSolved(uniqueIds) };
};

export const sidebarRenderers = {
    renderSidebar: () => {
        const topicList = state.elements.topicList;
        if (!topicList) return;

        const fragment = document.createDocumentFragment();

        // All Content button
        const isAllActive =
            !state.ui.activeTopicId &&
            !state.ui.activeAlgorithmCategoryId &&
            !state.ui.activeSQLCategoryId;
        const allStats = getAllContentStats();
        const allBtn = createSidebarButton({
            id: 'all-content',
            title: 'All Content',
            icon: '<svg aria-hidden="true" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>',
            total: allStats.total,
            solved: allStats.solved,
            isActive: isAllActive,
            className: 'sidebar-all-content mb-4',
            dataset: { allContent: 'true' },
        });
        allBtn.onclick = () => navigate('all', '');
        fragment.appendChild(allBtn);

        // Determine which sections should be expanded based on active category
        const isPatternActive = !!state.ui.activeTopicId;
        const isAlgorithmActive = !!state.ui.activeAlgorithmCategoryId;
        const isSQLActive = !!state.ui.activeSQLCategoryId;

        // Patterns Section - expanded if a pattern is active
        const patternsSection = createCollapsibleSection(
            'patterns-section',
            'Patterns',
            isPatternActive
        );
        fragment.appendChild(patternsSection.container);

        const allProblemsStats = getPatternStats('all');
        const allProblemsBtn = createSidebarButton({
            id: 'all-problems',
            title: 'All Problems',
            icon: '',
            total: allProblemsStats.total,
            solved: allProblemsStats.solved,
            isActive: state.ui.activeTopicId === 'all',
            className: 'sidebar-link',
            dataset: { topicId: 'all' },
        });
        allProblemsBtn.onclick = () => navigate('topic', 'all');
        patternsSection.content.appendChild(allProblemsBtn);

        data.topicsData.forEach((topic: Topic) => {
            const stats = getPatternStats(topic.id);
            const btn = createSidebarButton({
                id: topic.id,
                title: topic.title,
                icon: getTopicIcon(topic.id),
                total: stats.total,
                solved: stats.solved,
                isActive: state.ui.activeTopicId === topic.id,
                className: 'sidebar-link',
                dataset: { topicId: topic.id },
            });
            btn.onclick = () => navigate('topic', topic.id);
            patternsSection.content.appendChild(btn);
        });

        // Algorithms Section - expanded if an algorithm category is active
        const algorithmsSection = createCollapsibleSection(
            'algorithms-section',
            'Algorithms',
            isAlgorithmActive
        );
        fragment.appendChild(algorithmsSection.container);

        const allAlgoStats = getAlgorithmStats('all');
        const allAlgoBtn = createSidebarButton({
            id: 'all-algorithms',
            title: 'All Algorithms',
            icon: ICONS.topicIcons.algorithms,
            total: allAlgoStats.total,
            solved: allAlgoStats.solved,
            isActive: state.ui.activeAlgorithmCategoryId === 'all',
            className: 'sidebar-algorithm-category',
            dataset: { categoryId: 'all' },
        });
        allAlgoBtn.onclick = () => navigate('algorithm', 'all');
        algorithmsSection.content.appendChild(allAlgoBtn);

        data.algorithmsData.forEach((category: AlgorithmCategory) => {
            const stats = getAlgorithmStats(category);
            const btn = createSidebarButton({
                id: category.id,
                title: category.title,
                icon: ICONS.getAlgorithmCategoryIcon(category.id),
                total: stats.total,
                solved: stats.solved,
                isActive: state.ui.activeAlgorithmCategoryId === category.id,
                className: 'sidebar-algorithm-category',
                dataset: { categoryId: category.id },
            });
            btn.onclick = () => navigate('algorithm', category.id);
            algorithmsSection.content.appendChild(btn);
        });

        // SQL Section - expanded if a SQL category is active
        const sqlSection = createCollapsibleSection('sql-section', 'SQL', isSQLActive);
        fragment.appendChild(sqlSection.container);

        const allSqlStats = getSQLStats('all');
        const allSqlBtn = createSidebarButton({
            id: 'all-sql',
            title: 'All SQL',
            icon: ICONS.topicIcons.sql || ICONS.topicIcons.database,
            total: allSqlStats.total,
            solved: allSqlStats.solved,
            isActive: state.ui.activeSQLCategoryId === 'all',
            className: 'sidebar-sql-category',
            dataset: { sqlCategoryId: 'all' },
        });
        allSqlBtn.onclick = () => navigate('sql', 'all');
        sqlSection.content.appendChild(allSqlBtn);

        data.sqlData.forEach((category: SQLCategory) => {
            const stats = getSQLStats(category);
            const btn = createSidebarButton({
                id: category.id,
                title: category.title,
                icon: ICONS.getSQLCategoryIcon(category.id),
                total: stats.total,
                solved: stats.solved,
                isActive: state.ui.activeSQLCategoryId === category.id,
                className: 'sidebar-sql-category',
                dataset: { sqlCategoryId: category.id },
            });
            btn.onclick = () => navigate('sql', category.id);
            sqlSection.content.appendChild(btn);
        });

        topicList.innerHTML = '';
        topicList.appendChild(fragment);
    },

    // Backward-compatible exports
    setActiveTopic: (id: string | null) => setActiveState('topic', id, null),
    setActiveAlgorithmCategory: (id: string | null) => setActiveState('algorithm', id, ''),
    setActiveSQLCategory: (id: string | null) => setActiveState('sql', id, ''),
    setActiveAllButton: (isActive: boolean) => {
        if (isActive) {
            document.querySelector('.sidebar-all-content')?.classList.add('active');
        } else {
            document
                .querySelectorAll('.sidebar-all-content')
                .forEach((el) => el.classList.remove('active'));
        }
    },
    createAllContentButton: () => {
        const stats = getAllContentStats();
        const isActive =
            !state.ui.activeTopicId &&
            !state.ui.activeAlgorithmCategoryId &&
            !state.ui.activeSQLCategoryId;
        return createSidebarButton({
            id: 'all-content',
            title: 'All Content',
            icon: '<svg aria-hidden="true" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>',
            total: stats.total,
            solved: stats.solved,
            isActive,
            className: 'sidebar-all-content mb-4',
            dataset: { allContent: 'true' },
        });
    },
    createCollapsibleSection,
    createTopicButton: (id: string, title: string) => {
        const stats = getPatternStats(id);
        return createSidebarButton({
            id,
            title,
            icon: getTopicIcon(id),
            total: stats.total,
            solved: stats.solved,
            isActive:
                state.ui.activeTopicId === id || (state.ui.activeTopicId === 'all' && id === 'all'),
            className: 'sidebar-link',
            dataset: { topicId: id },
        });
    },
    createAlgorithmCategoryButton: (category: AlgorithmCategory) => {
        const stats = getAlgorithmStats(category);
        return createSidebarButton({
            id: category.id,
            title: category.title,
            icon: ICONS.getAlgorithmCategoryIcon(category.id),
            total: stats.total,
            solved: stats.solved,
            isActive: state.ui.activeAlgorithmCategoryId === category.id,
            className: 'sidebar-algorithm-category',
            dataset: { categoryId: category.id },
        });
    },
    createAlgorithmAllButton: () => {
        const stats = getAlgorithmStats('all');
        return createSidebarButton({
            id: 'all-algorithms',
            title: 'All Algorithms',
            icon: ICONS.topicIcons.algorithms,
            total: stats.total,
            solved: stats.solved,
            isActive: state.ui.activeAlgorithmCategoryId === 'all',
            className: 'sidebar-algorithm-category',
            dataset: { categoryId: 'all' },
        });
    },
    createSQLCategoryButton: (category: SQLCategory) => {
        const stats = getSQLStats(category);
        return createSidebarButton({
            id: category.id,
            title: category.title,
            icon: ICONS.getSQLCategoryIcon(category.id),
            total: stats.total,
            solved: stats.solved,
            isActive: state.ui.activeSQLCategoryId === category.id,
            className: 'sidebar-sql-category',
            dataset: { sqlCategoryId: category.id },
        });
    },
    createSQLAllButton: () => {
        const stats = getSQLStats('all');
        return createSidebarButton({
            id: 'all-sql',
            title: 'All SQL',
            icon: ICONS.topicIcons.sql || ICONS.topicIcons.database,
            total: stats.total,
            solved: stats.solved,
            isActive: state.ui.activeSQLCategoryId === 'all',
            className: 'sidebar-sql-category',
            dataset: { sqlCategoryId: 'all' },
        });
    },
    getTopicIcon,
    _getPatternStats: getPatternStats,
    _generateProgressHTML: calcProgressHTML,
};
