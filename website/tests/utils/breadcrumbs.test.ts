// --- BREADCRUMB UTILITIES TESTS ---
// Tests for breadcrumb navigation functionality

// Mock the data module
jest.mock('../../src/data', () => ({
    data: {
        topicsData: [
            { id: 'two-pointers', title: 'Two Pointers Pattern', patterns: [] },
            { id: 'trees', title: 'Tree Patterns', patterns: [] },
            { id: 'arrays-hashing', title: 'Arrays & Hashing Patterns', patterns: [] },
        ],
    },
}));

import { updateBreadcrumbs } from '../../src/utils';

// Mock DOM elements
const createMockElement = () => ({
    classList: {
        add: jest.fn(),
        remove: jest.fn(),
        contains: jest.fn().mockReturnValue(false),
    },
    innerHTML: '',
});

describe('Breadcrumb Utilities - updateBreadcrumbs', () => {
    let mockBreadcrumbNav: any;
    let mockBreadcrumbList: any;

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        
        mockBreadcrumbNav = createMockElement();
        mockBreadcrumbList = { innerHTML: '' };
        
        // Mock document.getElementById
        document.getElementById = jest.fn((id: string) => {
            if (id === 'breadcrumb-nav') return mockBreadcrumbNav;
            if (id === 'breadcrumb-list') return mockBreadcrumbList;
            return null;
        });
    });

    it('should hide breadcrumb nav when no items provided', () => {
        updateBreadcrumbs([]);
        
        expect(mockBreadcrumbNav.classList.add).toHaveBeenCalledWith('hidden');
        expect(mockBreadcrumbNav.classList.remove).not.toHaveBeenCalled();
    });

    it('should show breadcrumb nav and render items correctly', () => {
        const items = [
            { label: 'Home', href: '/smartgrind/' },
            { label: 'Patterns', href: '/smartgrind/' },
            { label: 'Two Pointers Pattern' },
        ];
        
        updateBreadcrumbs(items);
        
        expect(mockBreadcrumbNav.classList.remove).toHaveBeenCalledWith('hidden');
        expect(mockBreadcrumbList.innerHTML).toContain('Home');
        expect(mockBreadcrumbList.innerHTML).toContain('Patterns');
        expect(mockBreadcrumbList.innerHTML).toContain('Two Pointers Pattern');
        expect(mockBreadcrumbList.innerHTML).toContain('aria-current="page"');
    });

    it('should include links for non-last items', () => {
        const items = [
            { label: 'Home', href: '/smartgrind/' },
            { label: 'Two Pointers Pattern' },
        ];
        
        updateBreadcrumbs(items);
        
        expect(mockBreadcrumbList.innerHTML).toContain('href="/smartgrind/"');
        expect(mockBreadcrumbList.innerHTML).toContain('hover:text-brand-400');
    });

    it('should escape HTML in labels to prevent XSS', () => {
        const items = [
            { label: '<script>alert("xss")</script>' },
        ];
        
        updateBreadcrumbs(items);
        
        expect(mockBreadcrumbList.innerHTML).not.toContain('<script>');
        expect(mockBreadcrumbList.innerHTML).toContain('&lt;script&gt;');
    });

    it('should handle missing DOM elements gracefully', () => {
        document.getElementById = jest.fn().mockReturnValue(null);
        
        // Should not throw
        expect(() => updateBreadcrumbs([{ label: 'Home' }])).not.toThrow();
    });

    it('should render separator between items', () => {
        const items = [
            { label: 'Home', href: '/' },
            { label: 'Patterns', href: '/patterns' },
            { label: 'Two Pointers' },
        ];
        
        updateBreadcrumbs(items);
        
        // Should have separators between items
        expect(mockBreadcrumbList.innerHTML).toContain('/');
    });

    it('should mark last item as current page', () => {
        const items = [
            { label: 'Home', href: '/' },
            { label: 'Two Pointers' },
        ];
        
        updateBreadcrumbs(items);
        
        expect(mockBreadcrumbList.innerHTML).toContain('aria-current="page"');
    });

    it('should not add href to last item', () => {
        const items = [
            { label: 'Home', href: '/' },
            { label: 'Two Pointers' },
        ];
        
        updateBreadcrumbs(items);
        
        // Last item should not have a link
        const lastLinkMatches = mockBreadcrumbList.innerHTML.match(/Two Pointers.*?<\/li>/);
        expect(lastLinkMatches).toBeTruthy();
    });
});
