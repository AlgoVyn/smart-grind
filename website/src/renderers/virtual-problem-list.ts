// --- VIRTUAL PROBLEM LIST RENDERER ---
// Integrates virtual scrolling with problem list rendering

import { VirtualScroller, shouldVirtualize, estimateItemHeight } from '../utils/virtual-scroll';
import { Problem } from '../types';
import { problemCardRenderers } from './problem-cards';
import { state } from '../state';
import { shouldShowProblem, getToday } from '../utils';

interface ProblemListItem {
    type: 'problem' | 'pattern-header' | 'topic-header';
    data: Problem | string;
    height: number;
}

export class VirtualProblemList {
    private container: HTMLElement | null = null;
    private scroller: VirtualScroller | null = null;
    private items: ProblemListItem[] = [];
    private problemMap: Map<string, Problem> = new Map();

    /**
     * Initialize virtual problem list
     */
    init(container: HTMLElement, problems: Problem[]): boolean {
        // Clean up any existing scroller
        this.cleanup();

        // If not enough items, don't virtualize
        if (!shouldVirtualize(problems.length)) {
            return false;
        }

        this.container = container;
        this.prepareItems(problems);

        // Create scroller with average item height
        const avgHeight =
            this.items.reduce((sum, item) => sum + item.height, 0) / this.items.length;

        this.scroller = new VirtualScroller(
            this.items.length,
            {
                itemHeight: avgHeight,
                overscan: 3,
                containerHeight: container.clientHeight || 600,
            },
            (index, element) => this.renderItem(index, element),
            (element) => this.cleanupItem(element)
        );

        // Set up container
        container.innerHTML = '';
        container.style.position = 'relative';
        container.style.overflow = 'auto';

        // Attach scroller
        const scrollContainer = (container.closest('.overflow-y-auto') as HTMLElement) || container;
        this.scroller.attach(container, scrollContainer);

        return true;
    }

    /**
     * Update the list with new problems
     */
    update(problems: Problem[]): void {
        if (!this.scroller || !this.container) {
            return;
        }

        this.prepareItems(problems);
        this.scroller.setTotalItems(this.items.length);
    }

    /**
     * Clean up and destroy
     */
    cleanup(): void {
        if (this.scroller) {
            this.scroller.detach();
            this.scroller = null;
        }
        this.items = [];
        this.problemMap.clear();
        this.container = null;
    }

    /**
     * Scroll to a specific problem
     */
    scrollToProblem(problemId: string): void {
        const index = this.items.findIndex(
            (item) => item.type === 'problem' && (item.data as Problem).id === problemId
        );
        if (index !== -1 && this.scroller) {
            this.scroller.scrollToIndex(index, 'smooth');
        }
    }

    private prepareItems(problems: Problem[]): void {
        this.items = [];
        this.problemMap.clear();

        // Group problems by topic and pattern for structure
        const searchQuery = state.ui.searchQuery.toLowerCase().trim();
        const today = getToday();

        problems.forEach((problem) => {
            if (shouldShowProblem(problem, state.ui.currentFilter, searchQuery, today)) {
                this.items.push({
                    type: 'problem',
                    data: problem,
                    height: estimateItemHeight('problem-card'),
                });
                this.problemMap.set(problem.id, problem);
            }
        });
    }

    private renderItem(index: number, element: HTMLElement): void {
        const item = this.items[index];
        if (!item) return;

        element.innerHTML = '';
        element.className = 'virtual-list-item';

        if (item.type === 'problem') {
            const problem = item.data as Problem;
            const card = problemCardRenderers.createProblemCard(problem);
            element.appendChild(card);
        }
    }

    private cleanupItem(element: HTMLElement): void {
        // Clean up any event listeners or references
        element.innerHTML = '';
    }
}

// Global instance for the application
export const virtualProblemList = new VirtualProblemList();
