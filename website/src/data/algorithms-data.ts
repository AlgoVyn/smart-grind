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
            {
                id: 'algo-stack',
                name: 'Stack (LIFO Data Structure)',
                url: 'https://leetcode.com/problems/valid-parentheses/',
            },
            {
                id: 'algo-difference-array',
                name: 'Difference Array',
                url: 'https://leetcode.com/problems/range-addition/',
            },
            {
                id: 'algo-heap-sort',
                name: 'Heap Sort',
                url: 'https://leetcode.com/problems/sort-an-array/',
            },
            {
                id: 'algo-monotonic-deque',
                name: 'Monotonic Deque',
                url: 'https://leetcode.com/problems/sliding-window-maximum/',
            },
            {
                id: 'algo-bubble-sort',
                name: 'Bubble Sort',
                url: 'https://leetcode.com/problems/sort-an-array/',
            },
            {
                id: 'algo-insertion-sort',
                name: 'Insertion Sort',
                url: 'https://leetcode.com/problems/sort-an-array/',
            },
            {
                id: 'algo-selection-sort',
                name: 'Selection Sort',
                url: 'https://leetcode.com/problems/sort-an-array/',
            },
            {
                id: 'algo-merge-sort',
                name: 'Merge Sort',
                url: 'https://leetcode.com/problems/sort-an-array/',
            },
            {
                id: 'algo-quick-sort',
                name: 'Quick Sort',
                url: 'https://leetcode.com/problems/sort-an-array/',
            },
            {
                id: 'algo-count-inversions',
                name: 'Count Inversions',
                url: 'https://leetcode.com/problems/global-and-local-inversions/',
            },
            {
                id: 'algo-interleaving-placement',
                name: 'Interleaving Placement',
                url: 'https://leetcode.com/problems/wiggle-sort/',
            },
            {
                id: 'algo-at-most-to-equal',
                name: 'At Most To Equal',
                url: 'https://leetcode.com/problems/partition-to-k-equal-sum-subsets/',
            },
            {
                id: 'algo-left-to-right-state-transition',
                name: 'Left To Right State Transition',
                url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
            },
            {
                id: 'algo-quick-select',
                name: 'Quick Select',
                url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
            },
            {
                id: 'algo-binary-answer',
                name: 'Binary Answer (Search on Answer)',
                url: 'https://leetcode.com/problems/koko-eating-bananas/',
            },
            {
                id: 'algo-reverse-polish-notation',
                name: 'Reverse Polish Notation (Postfix)',
                url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
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
            {
                id: 'algo-tree-ring-order-traversal',
                name: 'Tree Ring Order Traversal (年轮遍历)',
                url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
            },
            {
                id: 'algo-tree-diameter',
                name: 'Tree Diameter',
                url: 'https://leetcode.com/problems/diameter-of-binary-tree/',
            },
            {
                id: 'algo-avl-tree',
                name: 'AVL Tree (Self-Balancing BST)',
                url: 'https://leetcode.com/problems/insert-into-a-binary-search-tree/',
            },
            {
                id: 'algo-treap',
                name: 'Treap (Tree + Heap)',
                url: 'https://leetcode.com/problems/insert-into-a-binary-search-tree/',
            },
        ],
    },
    {
        id: 'strings',
        title: 'String Algorithms',
        algorithms: [
            {
                id: 'algo-kmp',
                name: 'KMP (Knuth-Morris-Pratt)',
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
                id: 'algo-z-algorithm',
                name: 'Z Algorithm',
                url: 'https://leetcode.com/problems/implement-strstr/',
            },
            {
                id: 'algo-aho-corasick',
                name: 'Aho-Corasick (Multi-pattern Matching)',
                url: 'https://leetcode.com/problems/multi-search/',
            },
            {
                id: 'algo-string-processing',
                name: 'String Processing Techniques',
                url: 'https://leetcode.com/problems/string-compression/',
            },
            {
                id: 'algo-palindrome',
                name: 'Palindrome Algorithms',
                url: 'https://leetcode.com/problems/valid-palindrome/',
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
            {
                id: 'algo-bidirectional-bfs',
                name: 'Bidirectional BFS',
                url: 'https://leetcode.com/problems/word-ladder/',
            },
            {
                id: 'algo-kosaraju',
                name: "Kosaraju's Algorithm (SCC)",
                url: 'https://leetcode.com/problems/critical-connections-in-a-network/',
            },
            {
                id: 'algo-bridge-finding',
                name: 'Bridge Finding',
                url: 'https://leetcode.com/problems/critical-connections-in-a-network/',
            },
            {
                id: 'algo-bipartite-check',
                name: 'Bipartite Check',
                url: 'https://leetcode.com/problems/is-graph-bipartite/',
            },
            {
                id: 'algo-eulerian-path',
                name: 'Eulerian Path/Circuit',
                url: 'https://leetcode.com/problems/reconstruct-itinerary/',
            },
            {
                id: 'algo-max-bipartite-matching',
                name: 'Maximum Bipartite Matching',
                url: 'https://leetcode.com/problems/maximum-matching-of-players-with-trainers/',
            },
            {
                id: 'algo-2sat',
                name: '2-SAT (Satisfiability)',
                url: 'https://leetcode.com/problems/course-schedule-iv/',
            },
            {
                id: 'algo-component-coloring',
                name: 'Component Coloring',
                url: 'https://leetcode.com/problems/bicoloring/',
            },
            {
                id: 'algo-johnson',
                name: "Johnson's Algorithm (All Pairs Shortest Path)",
                url: 'https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/',
            },
            {
                id: 'algo-spfa',
                name: 'SPFA (Shortest Path Faster Algorithm)',
                url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/',
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
            {
                id: 'algo-bitmask-dp',
                name: 'Bitmask DP',
                url: 'https://leetcode.com/problems/maximum-compatibility-score-sum/',
            },
            {
                id: 'algo-digit-dp',
                name: 'Digit DP',
                url: 'https://leetcode.com/problems/numbers-at-most-n-given-digit-set/',
            },
            {
                id: 'algo-dp-on-trees',
                name: 'DP on Trees',
                url: 'https://leetcode.com/problems/house-robber-iii/',
            },
            {
                id: 'algo-bounded-knapsack',
                name: 'Bounded Knapsack',
                url: 'https://leetcode.com/problems/combination-sum-iv/',
            },
            {
                id: 'algo-unbounded-knapsack',
                name: 'Unbounded Knapsack',
                url: 'https://leetcode.com/problems/coin-change/',
            },
            {
                id: 'algo-dp-on-subsets',
                name: 'DP on Subsets',
                url: 'https://leetcode.com/problems/maximum-compatibility-score-sum/',
            },
            {
                id: 'algo-dp-with-sorting',
                name: 'DP with Sorting',
                url: 'https://leetcode.com/problems/russian-doll-envelopes/',
            },
            {
                id: 'algo-k-subset-partitioning',
                name: 'K-Subset Partitioning',
                url: 'https://leetcode.com/problems/partition-to-k-equal-sum-subsets/',
            },
            {
                id: 'algo-prefix-state-map',
                name: 'Prefix State Map DP',
                url: 'https://leetcode.com/problems/subarray-sums-divisible-by-k/',
            },
            {
                id: 'algo-selective-state-dp',
                name: 'Selective State DP',
                url: 'https://leetcode.com/problems/greatest-sum-divisible-by-three/',
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
            {
                id: 'algo-bin-packing',
                name: 'Bin Packing',
                url: 'https://leetcode.com/problems/maximum-units-on-a-truck/',
            },
            {
                id: 'algo-regret-greedy',
                name: 'Regret Greedy',
                url: 'https://leetcode.com/problems/advantage-shuffle/',
            },
            {
                id: 'algo-interval-scheduling-maximization',
                name: 'Interval Scheduling Maximization',
                url: 'https://leetcode.com/problems/maximum-number-of-events-that-can-be-attended/',
            },
        ],
    },
    {
        id: 'backtracking',
        title: 'Backtracking',
        algorithms: [
            {
                id: 'algo-backtracking',
                name: 'Backtracking',
                url: 'https://leetcode.com/problems/subsets/',
            },
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
                id: 'algo-extended-euclidean',
                name: 'Extended Euclidean Algorithm',
                url: 'https://leetcode.com/problems/check-if-it-is-a-good-array/',
            },
            {
                id: 'algo-sieve-eratosthenes',
                name: 'Sieve of Eratosthenes',
                url: 'https://leetcode.com/problems/count-primes/',
            },
            {
                id: 'algo-linear-sieve',
                name: "Linear Sieve (Euler's Sieve)",
                url: 'https://leetcode.com/problems/count-primes/',
            },
            {
                id: 'algo-modular-exponentiation',
                name: 'Modular Exponentiation',
                url: 'https://leetcode.com/problems/powx-n/',
            },
            {
                id: 'algo-modular-inverse',
                name: 'Modular Inverse',
                url: 'https://leetcode.com/problems/find-the-value-of-the-partition/',
            },
            {
                id: 'algo-ncr-binomial',
                name: 'Binomial Coefficients (nCr)',
                url: 'https://leetcode.com/problems/unique-paths/',
            },
            {
                id: 'algo-catalan-numbers',
                name: 'Catalan Numbers',
                url: 'https://leetcode.com/problems/unique-binary-search-trees/',
            },
            {
                id: 'algo-inclusion-exclusion',
                name: 'Inclusion-Exclusion Principle',
                url: 'https://leetcode.com/problems/number-of-ways-to-form-a-target-string-given-a-dictionary/',
            },
            {
                id: 'algo-matrix-exponentiation',
                name: 'Matrix Exponentiation',
                url: 'https://leetcode.com/problems/fibonacci-number/',
            },
            {
                id: 'algo-chinese-remainder',
                name: 'Chinese Remainder Theorem',
                url: 'https://leetcode.com/problems/chalk-replacement/',
            },
            {
                id: 'algo-miller-rabin',
                name: 'Miller-Rabin Primality Test',
                url: 'https://leetcode.com/problems/prime-palindrome/',
            },
            {
                id: 'algo-fft-ntt',
                name: 'Fast Fourier Transform (FFT/NTT)',
                url: 'https://leetcode.com/problems/closest-subsequence-sum/',
            },
            {
                id: 'algo-game-theory-nim',
                name: 'Game Theory (Nim / Grundy Numbers)',
                url: 'https://leetcode.com/problems/cat-and-mouse-ii/',
            },
            {
                id: 'algo-karatsuba',
                name: 'Karatsuba Multiplication',
                url: 'https://leetcode.com/problems/multiply-strings/',
            },
            {
                id: 'algo-fast-pow',
                name: 'Fast Pow (Binary Exponentiation)',
                url: 'https://leetcode.com/problems/powx-n/',
            },
            {
                id: 'algo-get-digits',
                name: 'Get Digits (Digit Extraction)',
                url: 'https://leetcode.com/problems/numbers-with-same-consecutive-differences/',
            },
            {
                id: 'algo-median-minimizes-sum-of-absolute-deviations',
                name: 'Median Minimizes Sum of Absolute Deviations',
                url: 'https://leetcode.com/problems/best-position-for-a-service-centre/',
            },
            {
                id: 'algo-mode',
                name: 'Mode (Most Frequent Element)',
                url: 'https://leetcode.com/problems/find-mode-in-binary-search-tree/',
            },
            {
                id: 'algo-prime-number',
                name: 'Prime Number (Primality Testing)',
                url: 'https://leetcode.com/problems/count-primes/',
            },
            {
                id: 'algo-round-up',
                name: 'Round Up (Ceiling Division)',
                url: 'https://leetcode.com/problems/concatenation-of-consecutive-binary-numbers/',
            },
            {
                id: 'algo-stars-and-bars',
                name: 'Stars and Bars (Combinatorics)',
                url: 'https://leetcode.com/problems/number-of-ways-to-form-a-target-string-given-a-dictionary/',
            },
            {
                id: 'algo-sum-of-sequence',
                name: 'Sum of Sequence (Arithmetic/Geometric)',
                url: 'https://leetcode.com/problems/missing-number-in-arithmetic-progression/',
            },
            {
                id: 'algo-factorial',
                name: 'Factorial',
                url: 'https://leetcode.com/problems/factorial-trailing-zeroes/',
            },
            {
                id: 'algo-factorization',
                name: 'Prime Factorization',
                url: 'https://leetcode.com/problems/2-keys-keyboard/',
            },
            {
                id: 'algo-lcm',
                name: 'LCM (Least Common Multiple)',
                url: 'https://leetcode.com/problems/ugly-number-ii/',
            },
            {
                id: 'algo-date',
                name: 'Date Algorithms',
                url: 'https://leetcode.com/problems/day-of-the-week/',
            },
            {
                id: 'algo-geometry',
                name: 'Computational Geometry Basics',
                url: 'https://leetcode.com/problems/erect-the-fence/',
            },
            {
                id: 'algo-component-count',
                name: 'Connected Component Count',
                url: 'https://leetcode.com/problems/number-of-provinces/',
            },
            {
                id: 'algo-meet-in-middle',
                name: 'Meet in the Middle',
                url: 'https://leetcode.com/problems/closest-subsequence-sum/',
            },
            {
                id: 'algo-gray-code',
                name: 'Gray Code',
                url: 'https://leetcode.com/problems/gray-code/',
            },
            {
                id: 'algo-tsp',
                name: 'Traveling Salesman Problem',
                url: 'https://leetcode.com/problems/find-the-shortest-superstring/',
            },
            {
                id: 'algo-convex-hull',
                name: 'Convex Hull (Graham Scan)',
                url: 'https://leetcode.com/problems/erect-the-fence/',
            },
            {
                id: 'algo-minmax',
                name: 'Minimax Algorithm',
                url: 'https://leetcode.com/problems/predict-the-winner/',
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
                id: 'algo-heavy-light-decomposition',
                name: 'Heavy Light Decomposition',
                url: 'https://leetcode.com/problems/kth-ancestor-of-a-tree-node/',
            },
            {
                id: 'algo-persistent-segment-tree',
                name: 'Persistent Segment Tree',
                url: 'https://leetcode.com/problems/range-sum-query-mutable/',
            },
            {
                id: 'algo-dinic',
                name: "Dinic's Algorithm (Max Flow)",
                url: 'https://leetcode.com/problems/maximum-number-of-accepted-invitations/',
            },
            {
                id: 'algo-lru-cache',
                name: 'LRU Cache',
                url: 'https://leetcode.com/problems/lru-cache/',
            },
            {
                id: 'algo-discretization',
                name: 'Coordinate Compression (Discretization)',
                url: 'https://leetcode.com/problems/range-sum-query-mutable/',
            },
            {
                id: 'algo-divide-and-conquer',
                name: 'Divide and Conquer',
                url: 'https://leetcode.com/problems/construct-quad-tree/',
            },
            {
                id: 'algo-hungarian',
                name: 'Hungarian Algorithm (Assignment Problem)',
                url: 'https://leetcode.com/problems/maximum-number-of-accepted-invitations/',
            },
            {
                id: 'algo-io-optimization',
                name: 'IO Optimization (Fast IO)',
                url: 'https://codeforces.com/problemset/problem/4/A',
            },
            {
                id: 'algo-lazy-propagation',
                name: 'Lazy Propagation (Segment Tree)',
                url: 'https://leetcode.com/problems/range-sum-query-mutable/',
            },
            {
                id: 'algo-line-sweep',
                name: 'Line Sweep Algorithm',
                url: 'https://leetcode.com/problems/rectangle-area-ii/',
            },
            {
                id: 'algo-offline-query',
                name: 'Offline Query Processing',
                url: 'https://leetcode.com/problems/process-queries/',
            },
            {
                id: 'algo-p-and-np',
                name: 'P vs NP Theory',
                url: 'https://leetcode.com/problems/partition-to-k-equal-sum-subsets/',
            },
            {
                id: 'algo-randomized-algorithms',
                name: 'Randomized Algorithms',
                url: 'https://leetcode.com/problems/random-pick-with-blacklist/',
            },
            {
                id: 'algo-reservoir-sampling',
                name: 'Reservoir Sampling',
                url: 'https://leetcode.com/problems/linked-list-random-node/',
            },
            {
                id: 'algo-sqrt-decomposition',
                name: "Sqrt Decomposition (Mo's Algorithm)",
                url: 'https://leetcode.com/problems/range-sum-query-mutable/',
            },
        ],
    },
];

// Total number of unique algorithms
export const TOTAL_UNIQUE_ALGORITHMS = ALGORITHMS_DATA.reduce(
    (total, category) => total + category.algorithms.length,
    0
);
