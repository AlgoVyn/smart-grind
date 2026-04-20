// --- TOP PROBLEMS DATA ---
// Top 100 most popular LeetCode problems for SEO
// Used by SSR function to generate individual problem pages

export interface TopProblem {
    id: string;
    slug: string;
    title: string;
    difficulty: 'Easy' | 'Medium' | 'Hard';
    category: string;
    categoryType: 'c' | 'a' | 's';
    description: string;
    topics: string[];
    companies: string[];
}

export const TOP_PROBLEMS: TopProblem[] = [
    // Arrays & Hashing - Most Popular
    {
        id: '1',
        slug: 'two-sum',
        title: 'Two Sum',
        difficulty: 'Easy',
        category: 'arrays-hashing',
        categoryType: 'c',
        description:
            'Given an array of integers and a target, return indices of two numbers that add up to target. The classic starting problem for coding interviews.',
        topics: ['Array', 'Hash Table', 'Two Pointers'],
        companies: ['Amazon', 'Google', 'Facebook', 'Apple', 'Microsoft'],
    },
    {
        id: '217',
        slug: 'contains-duplicate',
        title: 'Contains Duplicate',
        difficulty: 'Easy',
        category: 'arrays-hashing',
        categoryType: 'c',
        description:
            'Determine if an array contains any duplicates. A fundamental hash set problem testing basic array traversal skills.',
        topics: ['Array', 'Hash Table', 'Sorting'],
        companies: ['Amazon', 'Google', 'Facebook'],
    },
    {
        id: '238',
        slug: 'product-of-array-except-self',
        title: 'Product of Array Except Self',
        difficulty: 'Medium',
        category: 'arrays-hashing',
        categoryType: 'c',
        description:
            'Return an array where each element is the product of all other elements without using division. Tests prefix/suffix product patterns.',
        topics: ['Array', 'Prefix Sum'],
        companies: ['Amazon', 'Facebook', 'Microsoft', 'Apple'],
    },
    {
        id: '53',
        slug: 'maximum-subarray',
        title: 'Maximum Subarray',
        difficulty: 'Medium',
        category: 'arrays-hashing',
        categoryType: 'c',
        description:
            "Find the contiguous subarray with the largest sum. The classic Kadane's algorithm problem and most asked array question.",
        topics: ['Array', 'Dynamic Programming', 'Divide and Conquer'],
        companies: ['Amazon', 'LinkedIn', 'Google', 'Facebook', 'Microsoft'],
    },
    {
        id: '152',
        slug: 'maximum-product-subarray',
        title: 'Maximum Product Subarray',
        difficulty: 'Medium',
        category: 'arrays-hashing',
        categoryType: 'c',
        description:
            'Find the contiguous subarray with the maximum product. Similar to Maximum Subarray but requires tracking both min and max.',
        topics: ['Array', 'Dynamic Programming'],
        companies: ['Amazon', 'LinkedIn', 'Google', 'Facebook'],
    },
    {
        id: '15',
        slug: '3sum',
        title: '3Sum',
        difficulty: 'Medium',
        category: 'two-pointers',
        categoryType: 'c',
        description:
            'Find all unique triplets in the array which gives the sum of zero. The most popular two pointers problem asked at every FAANG.',
        topics: ['Array', 'Two Pointers', 'Sorting'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple'],
    },
    {
        id: '11',
        slug: 'container-with-most-water',
        title: 'Container With Most Water',
        difficulty: 'Medium',
        category: 'two-pointers',
        categoryType: 'c',
        description:
            'Find two lines that together with the x-axis form a container that holds the most water. Classic two pointers optimization.',
        topics: ['Array', 'Two Pointers', 'Greedy'],
        companies: ['Amazon', 'Facebook', 'Google', 'Goldman Sachs'],
    },
    {
        id: '121',
        slug: 'best-time-to-buy-and-sell-stock',
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'Easy',
        category: 'arrays-hashing',
        categoryType: 'c',
        description:
            'Find the maximum profit from buying and selling stock once. The most fundamental dynamic programming / array problem.',
        topics: ['Array', 'Dynamic Programming'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple', 'Goldman Sachs'],
    },
    {
        id: '33',
        slug: 'search-in-rotated-sorted-array',
        title: 'Search in Rotated Sorted Array',
        difficulty: 'Medium',
        category: 'binary-search',
        categoryType: 'c',
        description:
            'Search for a target in a rotated sorted array in O(log n) time. The quintessential binary search modification problem.',
        topics: ['Array', 'Binary Search'],
        companies: ['Amazon', 'Facebook', 'Google', 'LinkedIn', 'Microsoft'],
    },
    {
        id: '153',
        slug: 'find-minimum-in-rotated-sorted-array',
        title: 'Find Minimum in Rotated Sorted Array',
        difficulty: 'Medium',
        category: 'binary-search',
        categoryType: 'c',
        description:
            'Find the minimum element in a rotated sorted array. Tests understanding of binary search boundary conditions.',
        topics: ['Array', 'Binary Search'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft'],
    },
    // Binary Search
    {
        id: '4',
        slug: 'median-of-two-sorted-arrays',
        title: 'Median of Two Sorted Arrays',
        difficulty: 'Hard',
        category: 'binary-search',
        categoryType: 'c',
        description:
            'Find the median of two sorted arrays with O(log(m+n)) complexity. One of the hardest and most prestigious binary search problems.',
        topics: ['Array', 'Binary Search', 'Divide and Conquer'],
        companies: ['Amazon', 'Google', 'Facebook', 'Microsoft', 'Apple'],
    },
    {
        id: '704',
        slug: 'binary-search',
        title: 'Binary Search',
        difficulty: 'Easy',
        category: 'binary-search',
        categoryType: 'c',
        description:
            'Implement basic binary search to find target in sorted array. The foundation of all binary search problems.',
        topics: ['Array', 'Binary Search'],
        companies: ['Amazon', 'Google', 'Facebook'],
    },
    // Sliding Window
    {
        id: '3',
        slug: 'longest-substring-without-repeating-characters',
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'Medium',
        category: 'sliding-window',
        categoryType: 'c',
        description:
            'Find the length of the longest substring without repeating characters. The most popular sliding window problem.',
        topics: ['String', 'Sliding Window', 'Hash Table'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Adobe'],
    },
    {
        id: '424',
        slug: 'longest-repeating-character-replacement',
        title: 'Longest Repeating Character Replacement',
        difficulty: 'Medium',
        category: 'sliding-window',
        categoryType: 'c',
        description:
            'Find the length of the longest substring with same letters after replacing at most k characters. Advanced sliding window.',
        topics: ['String', 'Sliding Window', 'Hash Table'],
        companies: ['Amazon', 'Facebook', 'Google', 'Uber'],
    },
    {
        id: '76',
        slug: 'minimum-window-substring',
        title: 'Minimum Window Substring',
        difficulty: 'Hard',
        category: 'sliding-window',
        categoryType: 'c',
        description:
            'Find the minimum window substring containing all characters of target string. The hardest and most comprehensive sliding window problem.',
        topics: ['String', 'Sliding Window', 'Hash Table'],
        companies: ['Amazon', 'Facebook', 'Google', 'LinkedIn', 'Uber'],
    },
    // Linked List
    {
        id: '206',
        slug: 'reverse-linked-list',
        title: 'Reverse Linked List',
        difficulty: 'Easy',
        category: 'linked-lists',
        categoryType: 'c',
        description:
            'Reverse a singly linked list iteratively and recursively. The most fundamental linked list operation asked in every interview.',
        topics: ['Linked List', 'Recursion'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple'],
    },
    {
        id: '141',
        slug: 'linked-list-cycle',
        title: 'Linked List Cycle',
        difficulty: 'Easy',
        category: 'linked-lists',
        categoryType: 'c',
        description:
            "Detect if a linked list has a cycle using Floyd's Tortoise and Hare algorithm. Classic two pointers on linked list.",
        topics: ['Linked List', 'Two Pointers'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft'],
    },
    {
        id: '21',
        slug: 'merge-two-sorted-lists',
        title: 'Merge Two Sorted Lists',
        difficulty: 'Easy',
        category: 'linked-lists',
        categoryType: 'c',
        description:
            'Merge two sorted linked lists into one sorted list. Tests basic linked list manipulation and pointer operations.',
        topics: ['Linked List', 'Recursion'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple'],
    },
    {
        id: '23',
        slug: 'merge-k-sorted-lists',
        title: 'Merge k Sorted Lists',
        difficulty: 'Hard',
        category: 'linked-lists',
        categoryType: 'c',
        description:
            'Merge k sorted linked lists into one sorted list. Combines linked lists with heap/priority queue or divide and conquer.',
        topics: ['Linked List', 'Heap', 'Divide and Conquer'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Uber'],
    },
    {
        id: '19',
        slug: 'remove-nth-node-from-end-of-list',
        title: 'Remove Nth Node From End of List',
        difficulty: 'Medium',
        category: 'linked-lists',
        categoryType: 'c',
        description:
            'Remove the nth node from the end of a linked list in one pass. Tests two pointers with fixed separation pattern.',
        topics: ['Linked List', 'Two Pointers'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft'],
    },
    // Trees
    {
        id: '226',
        slug: 'invert-binary-tree',
        title: 'Invert Binary Tree',
        difficulty: 'Easy',
        category: 'trees',
        categoryType: 'c',
        description:
            'Invert a binary tree by swapping left and right children. The famous problem that was asked to Max Howell (Homebrew author) at Google.',
        topics: ['Tree', 'DFS', 'BFS'],
        companies: ['Google', 'Facebook', 'Amazon', 'Microsoft', 'Apple'],
    },
    {
        id: '104',
        slug: 'maximum-depth-of-binary-tree',
        title: 'Maximum Depth of Binary Tree',
        difficulty: 'Easy',
        category: 'trees',
        categoryType: 'c',
        description:
            'Find the maximum depth of a binary tree. The most fundamental tree problem testing recursive thinking.',
        topics: ['Tree', 'DFS', 'BFS'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'LinkedIn'],
    },
    {
        id: '543',
        slug: 'diameter-of-binary-tree',
        title: 'Diameter of Binary Tree',
        difficulty: 'Easy',
        category: 'trees',
        categoryType: 'c',
        description:
            'Find the length of the longest path between any two nodes in a tree. Tests post-order traversal pattern.',
        topics: ['Tree', 'DFS', 'Recursion'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft'],
    },
    {
        id: '124',
        slug: 'binary-tree-maximum-path-sum',
        title: 'Binary Tree Maximum Path Sum',
        difficulty: 'Hard',
        category: 'trees',
        categoryType: 'c',
        description:
            'Find the maximum path sum in a binary tree where path can start and end at any node. Advanced tree DP problem.',
        topics: ['Tree', 'DFS', 'Dynamic Programming'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple'],
    },
    {
        id: '98',
        slug: 'validate-binary-search-tree',
        title: 'Validate Binary Search Tree',
        difficulty: 'Medium',
        category: 'trees',
        categoryType: 'c',
        description:
            'Determine if a binary tree is a valid BST. Tests understanding of BST properties and in-order traversal.',
        topics: ['Tree', 'DFS', 'BST'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'LinkedIn'],
    },
    {
        id: '230',
        slug: 'kth-smallest-element-in-a-bst',
        title: 'Kth Smallest Element in a BST',
        difficulty: 'Medium',
        category: 'trees',
        categoryType: 'c',
        description:
            'Find the kth smallest element in a BST. Can be solved with in-order traversal or augmented BST.',
        topics: ['Tree', 'BST', 'DFS'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft'],
    },
    {
        id: '102',
        slug: 'binary-tree-level-order-traversal',
        title: 'Binary Tree Level Order Traversal',
        difficulty: 'Medium',
        category: 'trees',
        categoryType: 'c',
        description:
            'Return the level order traversal of a binary tree. The fundamental BFS tree problem asked in every interview.',
        topics: ['Tree', 'BFS'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple', 'LinkedIn'],
    },
    {
        id: '297',
        slug: 'serialize-and-deserialize-binary-tree',
        title: 'Serialize and Deserialize Binary Tree',
        difficulty: 'Hard',
        category: 'trees',
        categoryType: 'c',
        description:
            'Design an algorithm to serialize and deserialize a binary tree. Tests tree traversal and string manipulation.',
        topics: ['Tree', 'Design', 'BFS', 'DFS'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'LinkedIn', 'Uber'],
    },
    {
        id: '235',
        slug: 'lowest-common-ancestor-of-a-binary-search-tree',
        title: 'Lowest Common Ancestor of a Binary Search Tree',
        difficulty: 'Medium',
        category: 'trees',
        categoryType: 'c',
        description:
            'Find the lowest common ancestor of two nodes in a BST. Leverages BST property for efficient solution.',
        topics: ['Tree', 'BST'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'LinkedIn'],
    },
    {
        id: '236',
        slug: 'lowest-common-ancestor-of-a-binary-tree',
        title: 'Lowest Common Ancestor of a Binary Tree',
        difficulty: 'Medium',
        category: 'trees',
        categoryType: 'c',
        description:
            'Find the lowest common ancestor of two nodes in a binary tree. Tests recursive tree traversal and backtracking.',
        topics: ['Tree', 'DFS'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'LinkedIn', 'Apple'],
    },
    // Dynamic Programming
    {
        id: '70',
        slug: 'climbing-stairs',
        title: 'Climbing Stairs',
        difficulty: 'Easy',
        category: 'dp',
        categoryType: 'c',
        description:
            'Count the number of ways to climb stairs taking 1 or 2 steps at a time. The Fibonacci introduction to DP.',
        topics: ['Dynamic Programming', 'Memoization'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple'],
    },
    {
        id: '198',
        slug: 'house-robber',
        title: 'House Robber',
        difficulty: 'Medium',
        category: 'dp',
        categoryType: 'c',
        description:
            'Find the maximum money you can rob without robbing adjacent houses. Classic DP with state transition.',
        topics: ['Dynamic Programming'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'LinkedIn'],
    },
    {
        id: '213',
        slug: 'house-robber-ii',
        title: 'House Robber II',
        difficulty: 'Medium',
        category: 'dp',
        categoryType: 'c',
        description:
            'House robber on a circular street where first and last house are adjacent. Tests DP with two scenarios.',
        topics: ['Dynamic Programming'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft'],
    },
    {
        id: '5',
        slug: 'longest-palindromic-substring',
        title: 'Longest Palindromic Substring',
        difficulty: 'Medium',
        category: 'string-manipulation',
        categoryType: 'c',
        description:
            'Find the longest palindromic substring. Can be solved with expand around center or DP approach.',
        topics: ['String', 'Dynamic Programming', 'Two Pointers'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Goldman Sachs'],
    },
    {
        id: '647',
        slug: 'palindromic-substrings',
        title: 'Palindromic Substrings',
        difficulty: 'Medium',
        category: 'string-manipulation',
        categoryType: 'c',
        description:
            'Count the number of palindromic substrings. Tests expand around center technique.',
        topics: ['String', 'Dynamic Programming'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft'],
    },
    {
        id: '1143',
        slug: 'longest-common-subsequence',
        title: 'Longest Common Subsequence',
        difficulty: 'Medium',
        category: 'dp',
        categoryType: 'c',
        description:
            'Find the longest common subsequence of two strings. The classic 2D DP problem that tests DP fundamentals.',
        topics: ['String', 'Dynamic Programming'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple'],
    },
    {
        id: '72',
        slug: 'edit-distance',
        title: 'Edit Distance',
        difficulty: 'Hard',
        category: 'dp',
        categoryType: 'c',
        description:
            'Find the minimum number of operations to convert one string to another. The hardest classic DP problem.',
        topics: ['String', 'Dynamic Programming'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple', 'Uber'],
    },
    {
        id: '322',
        slug: 'coin-change',
        title: 'Coin Change',
        difficulty: 'Medium',
        category: 'dp',
        categoryType: 'c',
        description:
            'Find the fewest number of coins needed to make up an amount. Classic unbounded knapsack DP problem.',
        topics: ['Dynamic Programming'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Goldman Sachs', 'Apple'],
    },
    {
        id: '300',
        slug: 'longest-increasing-subsequence',
        title: 'Longest Increasing Subsequence',
        difficulty: 'Medium',
        category: 'dp',
        categoryType: 'c',
        description:
            'Find the length of the longest increasing subsequence. Classic DP with binary search optimization.',
        topics: ['Array', 'Dynamic Programming', 'Binary Search'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'LinkedIn'],
    },
    {
        id: '139',
        slug: 'word-break',
        title: 'Word Break',
        difficulty: 'Medium',
        category: 'dp',
        categoryType: 'c',
        description:
            'Determine if a string can be segmented into dictionary words. Classic DP with hash set optimization.',
        topics: ['String', 'Dynamic Programming', 'Hash Table'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple'],
    },
    {
        id: '91',
        slug: 'decode-ways',
        title: 'Decode Ways',
        difficulty: 'Medium',
        category: 'dp',
        categoryType: 'c',
        description:
            'Count the number of ways to decode a digit string to letters. Tricky DP with edge cases.',
        topics: ['String', 'Dynamic Programming'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Goldman Sachs'],
    },
    // Graphs
    {
        id: '200',
        slug: 'number-of-islands',
        title: 'Number of Islands',
        difficulty: 'Medium',
        category: 'graphs',
        categoryType: 'c',
        description:
            'Count the number of islands in a 2D grid. The most fundamental graph/BFS/DFS problem asked everywhere.',
        topics: ['Array', 'BFS', 'DFS', 'Union Find'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple', 'Goldman Sachs'],
    },
    {
        id: '133',
        slug: 'clone-graph',
        title: 'Clone Graph',
        difficulty: 'Medium',
        category: 'graphs',
        categoryType: 'c',
        description:
            'Create a deep copy of a connected undirected graph. Tests BFS/DFS traversal and hash map usage.',
        topics: ['Graph', 'BFS', 'DFS', 'Hash Table'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'LinkedIn'],
    },
    {
        id: '207',
        slug: 'course-schedule',
        title: 'Course Schedule',
        difficulty: 'Medium',
        category: 'graphs',
        categoryType: 'c',
        description:
            'Determine if you can finish all courses given prerequisites. The classic topological sort / cycle detection problem.',
        topics: ['Graph', 'DFS', 'BFS', 'Topological Sort'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple', 'Uber'],
    },
    {
        id: '210',
        slug: 'course-schedule-ii',
        title: 'Course Schedule II',
        difficulty: 'Medium',
        category: 'graphs',
        categoryType: 'c',
        description:
            'Return the ordering of courses to finish all courses. Topological sort returning the actual ordering.',
        topics: ['Graph', 'DFS', 'BFS', 'Topological Sort'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple'],
    },
    {
        id: '695',
        slug: 'max-area-of-island',
        title: 'Max Area of Island',
        difficulty: 'Medium',
        category: 'graphs',
        categoryType: 'c',
        description: 'Find the maximum area of an island in a 2D grid. DFS/BFS with area tracking.',
        topics: ['Array', 'DFS', 'BFS'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft'],
    },
    {
        id: '417',
        slug: 'pacific-atlantic-water-flow',
        title: 'Pacific Atlantic Water Flow',
        difficulty: 'Medium',
        category: 'graphs',
        categoryType: 'c',
        description:
            'Find cells where water can flow to both Pacific and Atlantic oceans. Multi-source BFS/DFS problem.',
        topics: ['Array', 'BFS', 'DFS'],
        companies: ['Amazon', 'Facebook', 'Google', 'Goldman Sachs'],
    },
    {
        id: '323',
        slug: 'number-of-connected-components-in-an-undirected-graph',
        title: 'Number of Connected Components',
        difficulty: 'Medium',
        category: 'graphs',
        categoryType: 'c',
        description:
            'Count connected components in an undirected graph. Basic graph traversal application.',
        topics: ['Graph', 'DFS', 'BFS', 'Union Find'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'LinkedIn'],
    },
    {
        id: '269',
        slug: 'alien-dictionary',
        title: 'Alien Dictionary',
        difficulty: 'Hard',
        category: 'graphs',
        categoryType: 'c',
        description:
            'Derive the order of letters in an alien dictionary. Graph construction and topological sort.',
        topics: ['Graph', 'Topological Sort', 'String'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Uber'],
    },
    // Backtracking
    {
        id: '78',
        slug: 'subsets',
        title: 'Subsets',
        difficulty: 'Medium',
        category: 'backtracking',
        categoryType: 'c',
        description:
            'Return all possible subsets of a set. The fundamental backtracking / subset generation problem.',
        topics: ['Array', 'Backtracking', 'Bit Manipulation'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple'],
    },
    {
        id: '39',
        slug: 'combination-sum',
        title: 'Combination Sum',
        difficulty: 'Medium',
        category: 'backtracking',
        categoryType: 'c',
        description:
            'Find all unique combinations that sum to target. Classic backtracking with unlimited choices.',
        topics: ['Array', 'Backtracking'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple', 'Uber'],
    },
    {
        id: '40',
        slug: 'combination-sum-ii',
        title: 'Combination Sum II',
        difficulty: 'Medium',
        category: 'backtracking',
        categoryType: 'c',
        description:
            'Find combinations with duplicates in input. Backtracking with sorting and duplicate skipping.',
        topics: ['Array', 'Backtracking'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft'],
    },
    {
        id: '46',
        slug: 'permutations',
        title: 'Permutations',
        difficulty: 'Medium',
        category: 'backtracking',
        categoryType: 'c',
        description:
            'Return all possible permutations of a list. Classic backtracking with swapping or visited array.',
        topics: ['Array', 'Backtracking'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple', 'LinkedIn'],
    },
    {
        id: '47',
        slug: 'permutations-ii',
        title: 'Permutations II',
        difficulty: 'Medium',
        category: 'backtracking',
        categoryType: 'c',
        description:
            'Return all unique permutations with duplicates. Backtracking with duplicate handling.',
        topics: ['Array', 'Backtracking'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft'],
    },
    {
        id: '17',
        slug: 'letter-combinations-of-a-phone-number',
        title: 'Letter Combinations of a Phone Number',
        difficulty: 'Medium',
        category: 'backtracking',
        categoryType: 'c',
        description:
            'Return all letter combinations from phone digits. Classic backtracking mapping problem.',
        topics: ['String', 'Backtracking'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple', 'Uber'],
    },
    {
        id: '22',
        slug: 'generate-parentheses',
        title: 'Generate Parentheses',
        difficulty: 'Medium',
        category: 'backtracking',
        categoryType: 'c',
        description:
            'Generate all combinations of well-formed parentheses. Backtracking with open/close count tracking.',
        topics: ['String', 'Backtracking', 'Dynamic Programming'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple', 'Goldman Sachs'],
    },
    {
        id: '79',
        slug: 'word-search',
        title: 'Word Search',
        difficulty: 'Medium',
        category: 'backtracking',
        categoryType: 'c',
        description: 'Search for a word in a 2D board. Backtracking with DFS on grid.',
        topics: ['Array', 'Backtracking', 'DFS'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Snapchat'],
    },
    {
        id: '51',
        slug: 'n-queens',
        title: 'N-Queens',
        difficulty: 'Hard',
        category: 'backtracking',
        categoryType: 'c',
        description:
            'Place n queens on an n×n chessboard so no two queens attack. The classic backtracking problem.',
        topics: ['Backtracking'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple'],
    },
    // Heap
    {
        id: '295',
        slug: 'find-median-from-data-stream',
        title: 'Find Median from Data Stream',
        difficulty: 'Hard',
        category: 'heaps',
        categoryType: 'c',
        description:
            'Design a data structure that supports adding numbers and finding median. Dual heap pattern.',
        topics: ['Heap', 'Design'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple', 'LinkedIn'],
    },
    {
        id: '347',
        slug: 'top-k-frequent-elements',
        title: 'Top K Frequent Elements',
        difficulty: 'Medium',
        category: 'heaps',
        categoryType: 'c',
        description:
            'Return the k most frequent elements. Can be solved with heap or bucket sort approach.',
        topics: ['Array', 'Hash Table', 'Heap'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple'],
    },
    {
        id: '703',
        slug: 'kth-largest-element-in-a-stream',
        title: 'Kth Largest Element in a Stream',
        difficulty: 'Easy',
        category: 'heaps',
        categoryType: 'c',
        description:
            'Design a class to find kth largest element in a stream. Min heap of size k pattern.',
        topics: ['Heap', 'Design'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft'],
    },
    {
        id: '215',
        slug: 'kth-largest-element-in-an-array',
        title: 'Kth Largest Element in an Array',
        difficulty: 'Medium',
        category: 'heaps',
        categoryType: 'c',
        description:
            'Find the kth largest element in an unsorted array. Can use heap, quickselect, or sorting.',
        topics: ['Array', 'Heap', 'Divide and Conquer', 'Quickselect'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple', 'LinkedIn'],
    },
    // Design
    {
        id: '146',
        slug: 'lru-cache',
        title: 'LRU Cache',
        difficulty: 'Medium',
        category: 'design',
        categoryType: 'c',
        description:
            'Design a Least Recently Used cache with O(1) operations. Combines hash map with doubly linked list.',
        topics: ['Design', 'Hash Table', 'Linked List'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple', 'Uber', 'LinkedIn'],
    },
    {
        id: '380',
        slug: 'insert-delete-getrandom-o1',
        title: 'Insert Delete GetRandom O(1)',
        difficulty: 'Medium',
        category: 'design',
        categoryType: 'c',
        description:
            'Design a data structure with O(1) insert, delete, and getRandom. Hash map with dynamic array.',
        topics: ['Design', 'Hash Table', 'Array'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Uber'],
    },
    {
        id: '155',
        slug: 'min-stack',
        title: 'Min Stack',
        difficulty: 'Medium',
        category: 'design',
        categoryType: 'c',
        description:
            'Design a stack that supports push, pop, top, and retrieving minimum element in constant time.',
        topics: ['Design', 'Stack'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple', 'Goldman Sachs'],
    },
    // Stack
    {
        id: '20',
        slug: 'valid-parentheses',
        title: 'Valid Parentheses',
        difficulty: 'Easy',
        category: 'stacks',
        categoryType: 'c',
        description:
            'Determine if string with brackets is valid. The most fundamental stack problem asked everywhere.',
        topics: ['String', 'Stack'],
        companies: [
            'Amazon',
            'Facebook',
            'Google',
            'Microsoft',
            'Apple',
            'LinkedIn',
            'Goldman Sachs',
        ],
    },
    {
        id: '739',
        slug: 'daily-temperatures',
        title: 'Daily Temperatures',
        difficulty: 'Medium',
        category: 'stacks',
        categoryType: 'c',
        description:
            'Find days until a warmer temperature for each day. Classic monotonic decreasing stack.',
        topics: ['Array', 'Stack'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple'],
    },
    {
        id: '84',
        slug: 'largest-rectangle-in-histogram',
        title: 'Largest Rectangle in Histogram',
        difficulty: 'Hard',
        category: 'stacks',
        categoryType: 'c',
        description:
            'Find largest rectangular area in a histogram. The hardest monotonic stack problem.',
        topics: ['Array', 'Stack'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple', 'Uber'],
    },
    // Greedy
    {
        id: '55',
        slug: 'jump-game',
        title: 'Jump Game',
        difficulty: 'Medium',
        category: 'greedy',
        categoryType: 'c',
        description:
            'Determine if you can reach the last index from the first. Classic greedy with maximum reach.',
        topics: ['Array', 'Greedy', 'Dynamic Programming'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple', 'Adobe'],
    },
    {
        id: '45',
        slug: 'jump-game-ii',
        title: 'Jump Game II',
        difficulty: 'Medium',
        category: 'greedy',
        categoryType: 'c',
        description:
            'Find the minimum number of jumps to reach the last index. Greedy BFS approach.',
        topics: ['Array', 'Greedy'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft'],
    },
    {
        id: '435',
        slug: 'non-overlapping-intervals',
        title: 'Non-overlapping Intervals',
        difficulty: 'Medium',
        category: 'greedy',
        categoryType: 'c',
        description:
            'Find minimum number of intervals to remove for non-overlapping set. Classic interval scheduling.',
        topics: ['Array', 'Greedy', 'Sorting'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple'],
    },
    // Interval
    {
        id: '57',
        slug: 'insert-interval',
        title: 'Insert Interval',
        difficulty: 'Medium',
        category: 'greedy',
        categoryType: 'c',
        description:
            'Insert a new interval into non-overlapping intervals and merge if necessary. Interval manipulation.',
        topics: ['Array', 'Sorting'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'LinkedIn'],
    },
    {
        id: '56',
        slug: 'merge-intervals',
        title: 'Merge Intervals',
        difficulty: 'Medium',
        category: 'greedy',
        categoryType: 'c',
        description:
            'Merge all overlapping intervals into non-overlapping intervals. Sorting and interval tracking.',
        topics: ['Array', 'Sorting'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple', 'Uber'],
    },
    // Bit Manipulation
    {
        id: '136',
        slug: 'single-number',
        title: 'Single Number',
        difficulty: 'Easy',
        category: 'bit-manipulation',
        categoryType: 'c',
        description:
            'Find the single number that appears only once. Classic XOR bit manipulation problem.',
        topics: ['Array', 'Bit Manipulation'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple'],
    },
    {
        id: '191',
        slug: 'number-of-1-bits',
        title: 'Number of 1 Bits',
        difficulty: 'Easy',
        category: 'bit-manipulation',
        categoryType: 'c',
        description:
            'Count the number of 1 bits in an unsigned integer. Basic bit manipulation and shifting.',
        topics: ['Bit Manipulation'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple'],
    },
    // Math
    {
        id: '7',
        slug: 'reverse-integer',
        title: 'Reverse Integer',
        difficulty: 'Medium',
        category: 'bit-manipulation',
        categoryType: 'c',
        description: 'Reverse digits of a 32-bit signed integer. Handle overflow cases.',
        topics: ['Math'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft', 'Apple'],
    },
    {
        id: '9',
        slug: 'palindrome-number',
        title: 'Palindrome Number',
        difficulty: 'Easy',
        category: 'math-number-theory',
        categoryType: 'a',
        description:
            'Determine if an integer is a palindrome without converting to string. Reverse half approach.',
        topics: ['Math'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft'],
    },
    // SQL
    {
        id: 'sql-175',
        slug: 'combine-two-tables',
        title: 'Combine Two Tables',
        difficulty: 'Easy',
        category: 'sql-joins',
        categoryType: 's',
        description:
            'Write a SQL query to combine two tables using LEFT JOIN. The most basic SQL interview question.',
        topics: ['SQL', 'JOIN'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft'],
    },
    {
        id: 'sql-176',
        slug: 'second-highest-salary',
        title: 'Second Highest Salary',
        difficulty: 'Medium',
        category: 'sql-subqueries',
        categoryType: 's',
        description:
            'Find the second highest salary from the Employee table. Tests subqueries and LIMIT/OFFSET.',
        topics: ['SQL', 'Subquery'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft'],
    },
    {
        id: 'sql-180',
        slug: 'consecutive-numbers',
        title: 'Consecutive Numbers',
        difficulty: 'Medium',
        category: 'sql-window-functions',
        categoryType: 's',
        description:
            'Find all numbers that appear at least three times consecutively. Tests LAG/LEAD window functions.',
        topics: ['SQL', 'Window Function'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft'],
    },
    {
        id: 'sql-185',
        slug: 'department-top-three-salaries',
        title: 'Department Top Three Salaries',
        difficulty: 'Hard',
        category: 'sql-window-functions',
        categoryType: 's',
        description:
            'Find the top three salaries in each department. Advanced window function with DENSE_RANK.',
        topics: ['SQL', 'Window Function'],
        companies: ['Amazon', 'Facebook', 'Google', 'Microsoft'],
    },
    {
        id: 'sql-262',
        slug: 'trips-and-users',
        title: 'Trips and Users',
        difficulty: 'Hard',
        category: 'sql-aggregation',
        categoryType: 's',
        description:
            'Calculate cancellation rate for trips. Complex SQL with JOINs, aggregations, and date filtering.',
        topics: ['SQL', 'Aggregation', 'JOIN'],
        companies: ['Uber', 'Lyft', 'Amazon'],
    },
];

// Helper function to get problem by slug
export const getProblemBySlug = (slug: string): TopProblem | undefined => {
    return TOP_PROBLEMS.find((p) => p.slug === slug);
};

// Helper function to get all problem slugs
export const getAllProblemSlugs = (): string[] => {
    return TOP_PROBLEMS.map((p) => p.slug);
};
