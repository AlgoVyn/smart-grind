// --- ALGORITHMS DATA MODULE ---
// Algorithm data organized by category
// This file contains only data - no logic

import { ProblemDef } from '../types';

// Algorithm definition (same as ProblemDef - just id, name, url)
export type AlgorithmDef = ProblemDef;

export interface AlgorithmCategory {
    id: string;
    title: string;
    algorithms: AlgorithmDef[];
}

export const ALGORITHMS_DATA: AlgorithmCategory[] = [
    {
        id: 'arrays-strings',
        title: 'Arrays & Strings',
        algorithms: [
            {
                id: 'algo-two-pointers',
                name: 'Two Pointers',
                url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
            },
            {
                id: 'algo-sliding-window',
                name: 'Sliding Window',
                url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
            },
            {
                id: 'algo-prefix-sum',
                name: 'Prefix Sum',
                url: 'https://leetcode.com/problems/range-sum-query-immutable/',
            },
            {
                id: 'algo-binary-search',
                name: 'Binary Search',
                url: 'https://leetcode.com/problems/binary-search/',
            },
            {
                id: 'algo-kadanes-algorithm',
                name: "Kadane's Algorithm",
                url: 'https://leetcode.com/problems/maximum-subarray/',
            },
            {
                id: 'algo-dutch-national-flag',
                name: 'Dutch National Flag',
                url: 'https://leetcode.com/problems/sort-colors/',
            },
            {
                id: 'algo-merge-intervals',
                name: 'Merge Intervals',
                url: 'https://leetcode.com/problems/merge-intervals/',
            },
            {
                id: 'algo-monotonic-stack',
                name: 'Monotonic Stack',
                url: 'https://leetcode.com/problems/daily-temperatures/',
            },
            {
                id: 'algo-rotate-array',
                name: 'Rotate Array In-Place',
                url: 'https://leetcode.com/problems/rotate-array/',
            },
            {
                id: 'algo-cyclic-sort',
                name: 'Cyclic Sort',
                url: 'https://leetcode.com/problems/missing-number/',
            },
        ],
    },
    {
        id: 'linked-list',
        title: 'Linked List',
        algorithms: [
            {
                id: 'algo-fast-slow-pointers',
                name: 'Fast & Slow Pointers',
                url: 'https://leetcode.com/problems/linked-list-cycle/',
            },
            {
                id: 'algo-reverse-linked-list',
                name: 'Reverse Linked List',
                url: 'https://leetcode.com/problems/reverse-linked-list/',
            },
            {
                id: 'algo-merge-sorted-lists',
                name: 'Merge Two Sorted Lists',
                url: 'https://leetcode.com/problems/merge-two-sorted-lists/',
            },
            {
                id: 'algo-detect-cycle',
                name: 'Detect Cycle',
                url: 'https://leetcode.com/problems/linked-list-cycle-ii/',
            },
            {
                id: 'algo-middle-node',
                name: 'Middle Node',
                url: 'https://leetcode.com/problems/middle-of-the-linked-list/',
            },
        ],
    },
    {
        id: 'trees-bsts',
        title: 'Trees & BSTs',
        algorithms: [
            {
                id: 'algo-dfs-preorder',
                name: 'DFS Preorder',
                url: 'https://leetcode.com/problems/binary-tree-preorder-traversal/',
            },
            {
                id: 'algo-dfs-inorder',
                name: 'DFS Inorder',
                url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/',
            },
            {
                id: 'algo-dfs-postorder',
                name: 'DFS Postorder',
                url: 'https://leetcode.com/problems/binary-tree-postorder-traversal/',
            },
            {
                id: 'algo-bfs-level-order',
                name: 'BFS Level Order',
                url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
            },
            {
                id: 'algo-bst-insert',
                name: 'BST Insert',
                url: 'https://leetcode.com/problems/insert-into-a-binary-search-tree/',
            },
            {
                id: 'algo-lca',
                name: 'Lowest Common Ancestor',
                url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/',
            },
            {
                id: 'algo-recover-bst',
                name: 'Recover BST',
                url: 'https://leetcode.com/problems/recover-binary-search-tree/',
            },
            {
                id: 'algo-serialize-tree',
                name: 'Serialize Tree',
                url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
            },
            {
                id: 'algo-trie',
                name: 'Trie (Prefix Tree)',
                url: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
            },
        ],
    },
    {
        id: 'graphs',
        title: 'Graphs',
        algorithms: [
            {
                id: 'algo-graph-dfs',
                name: 'Graph DFS',
                url: 'https://leetcode.com/problems/number-of-islands/',
            },
            {
                id: 'algo-graph-bfs',
                name: 'Graph BFS',
                url: 'https://leetcode.com/problems/word-ladder/',
            },
            {
                id: 'algo-topological-sort',
                name: 'Topological Sort',
                url: 'https://leetcode.com/problems/course-schedule/',
            },
            {
                id: 'algo-union-find',
                name: 'Union-Find',
                url: 'https://leetcode.com/problems/number-of-provinces/',
            },
            {
                id: 'algo-kruskals',
                name: "Kruskal's Algorithm",
                url: 'https://leetcode.com/problems/connecting-cities-with-minimum-cost/',
            },
            {
                id: 'algo-prims',
                name: "Prim's Algorithm",
                url: 'https://leetcode.com/problems/min-cost-to-connect-all-points/',
            },
            {
                id: 'algo-dijkstras',
                name: "Dijkstra's Algorithm",
                url: 'https://leetcode.com/problems/network-delay-time/',
            },
            {
                id: 'algo-bellman-ford',
                name: 'Bellman-Ford',
                url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/',
            },
            {
                id: 'algo-floyd-warshall',
                name: 'Floyd-Warshall',
                url: 'https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/',
            },
            {
                id: 'algo-a-star',
                name: 'A* Search',
                url: 'https://leetcode.com/problems/shortest-path-in-binary-matrix/',
            },
        ],
    },
    {
        id: 'dynamic-programming',
        title: 'Dynamic Programming',
        algorithms: [
            {
                id: 'algo-knapsack-01',
                name: '0/1 Knapsack',
                url: 'https://leetcode.com/problems/partition-equal-subset-sum/',
            },
            {
                id: 'algo-coin-change',
                name: 'Coin Change',
                url: 'https://leetcode.com/problems/coin-change/',
            },
            {
                id: 'algo-lcs',
                name: 'Longest Common Subsequence',
                url: 'https://leetcode.com/problems/longest-common-subsequence/',
            },
            {
                id: 'algo-lis',
                name: 'Longest Increasing Subsequence',
                url: 'https://leetcode.com/problems/longest-increasing-subsequence/',
            },
            {
                id: 'algo-edit-distance',
                name: 'Edit Distance',
                url: 'https://leetcode.com/problems/edit-distance/',
            },
            {
                id: 'algo-matrix-path-dp',
                name: 'Matrix Path DP',
                url: 'https://leetcode.com/problems/unique-paths/',
            },
            {
                id: 'algo-partition-equal-subset',
                name: 'Partition Equal Subset',
                url: 'https://leetcode.com/problems/partition-equal-subset-sum/',
            },
            {
                id: 'algo-house-robber',
                name: 'House Robber',
                url: 'https://leetcode.com/problems/house-robber/',
            },
            {
                id: 'algo-climbing-stairs',
                name: 'Climbing Stairs',
                url: 'https://leetcode.com/problems/climbing-stairs/',
            },
            {
                id: 'algo-word-break',
                name: 'Word Break',
                url: 'https://leetcode.com/problems/word-break/',
            },
        ],
    },
    {
        id: 'greedy',
        title: 'Greedy',
        algorithms: [
            {
                id: 'algo-activity-selection',
                name: 'Activity Selection',
                url: 'https://leetcode.com/problems/maximum-length-of-pair-chain/',
            },
            {
                id: 'algo-interval-scheduling',
                name: 'Interval Scheduling',
                url: 'https://leetcode.com/problems/non-overlapping-intervals/',
            },
            {
                id: 'algo-huffman-encoding',
                name: 'Huffman Encoding',
                url: 'https://leetcode.com/problems/construct-string-with-repeat-limit/',
            },
            {
                id: 'algo-gas-station',
                name: 'Gas Station',
                url: 'https://leetcode.com/problems/gas-station/',
            },
        ],
    },
    {
        id: 'backtracking',
        title: 'Backtracking',
        algorithms: [
            { id: 'algo-subsets', name: 'Subsets', url: 'https://leetcode.com/problems/subsets/' },
            {
                id: 'algo-permutations',
                name: 'Permutations',
                url: 'https://leetcode.com/problems/permutations/',
            },
            {
                id: 'algo-combinations',
                name: 'Combinations',
                url: 'https://leetcode.com/problems/combinations/',
            },
            {
                id: 'algo-combination-sum',
                name: 'Combination Sum',
                url: 'https://leetcode.com/problems/combination-sum/',
            },
            {
                id: 'algo-word-search-grid',
                name: 'Word Search',
                url: 'https://leetcode.com/problems/word-search/',
            },
            {
                id: 'algo-n-queens',
                name: 'N-Queens',
                url: 'https://leetcode.com/problems/n-queens/',
            },
            {
                id: 'algo-sudoku-solver',
                name: 'Sudoku Solver',
                url: 'https://leetcode.com/problems/sudoku-solver/',
            },
        ],
    },
    {
        id: 'bit-manipulation',
        title: 'Bit Manipulation',
        algorithms: [
            {
                id: 'algo-xor-trick',
                name: 'XOR Trick',
                url: 'https://leetcode.com/problems/single-number/',
            },
            {
                id: 'algo-count-bits',
                name: 'Count Bits',
                url: 'https://leetcode.com/problems/counting-bits/',
            },
            {
                id: 'algo-subset-generation-bits',
                name: 'Subset Generation with Bits',
                url: 'https://leetcode.com/problems/subsets/',
            },
        ],
    },
    {
        id: 'heap-priority-queue',
        title: 'Heap / Priority Queue',
        algorithms: [
            {
                id: 'algo-kth-largest',
                name: 'Kth Largest Element',
                url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
            },
            {
                id: 'algo-merge-k-lists',
                name: 'Merge K Sorted Lists',
                url: 'https://leetcode.com/problems/merge-k-sorted-lists/',
            },
            {
                id: 'algo-sliding-window-maximum',
                name: 'Sliding Window Maximum',
                url: 'https://leetcode.com/problems/sliding-window-maximum/',
            },
        ],
    },
    {
        id: 'math-number-theory',
        title: 'Math & Number Theory',
        algorithms: [
            {
                id: 'algo-gcd-euclidean',
                name: 'GCD (Euclidean)',
                url: 'https://leetcode.com/problems/greatest-common-divisor-of-array/',
            },
            {
                id: 'algo-sieve-eratosthenes',
                name: 'Sieve of Eratosthenes',
                url: 'https://leetcode.com/problems/count-primes/',
            },
            {
                id: 'algo-modular-exponentiation',
                name: 'Modular Exponentiation',
                url: 'https://leetcode.com/problems/powx-n/',
            },
            {
                id: 'algo-karatsuba',
                name: 'Karatsuba Multiplication',
                url: 'https://leetcode.com/problems/multiply-strings/',
            },
        ],
    },
    {
        id: 'advanced',
        title: 'Advanced',
        algorithms: [
            {
                id: 'algo-segment-tree',
                name: 'Segment Tree',
                url: 'https://leetcode.com/problems/range-sum-query-mutable/',
            },
            {
                id: 'algo-fenwick-tree',
                name: 'Fenwick Tree (BIT)',
                url: 'https://leetcode.com/problems/range-sum-query-mutable/',
            },
            {
                id: 'algo-sparse-table',
                name: 'Sparse Table',
                url: 'https://leetcode.com/problems/range-sum-query-immutable/',
            },
            {
                id: 'algo-kmp',
                name: 'KMP String Matching',
                url: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/',
            },
            {
                id: 'algo-rabin-karp',
                name: 'Rabin-Karp',
                url: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/',
            },
            {
                id: 'algo-manachers',
                name: "Manacher's Algorithm",
                url: 'https://leetcode.com/problems/longest-palindromic-substring/',
            },
            {
                id: 'algo-union-by-rank',
                name: 'Union by Rank + Path Compression',
                url: 'https://leetcode.com/problems/accounts-merge/',
            },
            {
                id: 'algo-tarjans',
                name: "Tarjan's Algorithm",
                url: 'https://leetcode.com/problems/critical-connections-in-a-network/',
            },
            {
                id: 'algo-binary-lifting',
                name: 'Binary Lifting',
                url: 'https://leetcode.com/problems/kth-ancestor-of-a-tree-node/',
            },
            {
                id: 'algo-lru-cache',
                name: 'LRU Cache',
                url: 'https://leetcode.com/problems/lru-cache/',
            },
        ],
    },
];

// Total number of unique algorithms
export const TOTAL_UNIQUE_ALGORITHMS = ALGORITHMS_DATA.reduce(
    (total, category) => total + category.algorithms.length,
    0
);
