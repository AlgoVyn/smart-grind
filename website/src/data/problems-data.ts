// --- PROBLEMS DATA MODULE ---
// Static LeetCode problem data organized by topic and pattern
// This file contains only data - no logic

import { Topic } from '../types';

// Total number of unique problems in the dataset
export const TOTAL_UNIQUE_PROBLEMS = 438;

export const PROBLEMS_DATA: Topic[] = [
    {
        id: 'two-pointers',
        title: 'Two Pointer Patterns',
        patterns: [
            {
                name: 'Two Pointers - Converging (Sorted Array Target Sum)',
                problems: [
                    {
                        id: 'container-with-most-water',
                        name: 'Container With Most Water',
                        url: 'https://leetcode.com/problems/container-with-most-water/',
                    },
                    { id: '3sum', name: '3Sum', url: 'https://leetcode.com/problems/3sum/' },
                    {
                        id: '3sum-closest',
                        name: '3Sum Closest',
                        url: 'https://leetcode.com/problems/3sum-closest/',
                    },
                    { id: '4sum', name: '4Sum', url: 'https://leetcode.com/problems/4sum/' },
                    {
                        id: 'two-sum-ii-input-array-is-sorted',
                        name: 'Two Sum II - Input Array Is Sorted',
                        url: 'https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/',
                    },
                    {
                        id: 'intersection-of-two-arrays',
                        name: 'Intersection of Two Arrays',
                        url: 'https://leetcode.com/problems/intersection-of-two-arrays/',
                    },
                    {
                        id: 'boats-to-save-people',
                        name: 'Boats to Save People',
                        url: 'https://leetcode.com/problems/boats-to-save-people/',
                    },
                    {
                        id: 'squares-of-a-sorted-array',
                        name: 'Squares of a Sorted Array',
                        url: 'https://leetcode.com/problems/squares-of-a-sorted-array/',
                    },
                    {
                        id: '3sum-smaller',
                        name: '3Sum Smaller',
                        url: 'https://leetcode.com/problems/3sum-smaller/',
                    },
                ],
            },
            {
                name: 'Two Pointers - Fast & Slow (Cycle Detection)',
                problems: [
                    {
                        id: 'linked-list-cycle',
                        name: 'Linked List Cycle',
                        url: 'https://leetcode.com/problems/linked-list-cycle/',
                    },
                    {
                        id: 'happy-number',
                        name: 'Happy Number',
                        url: 'https://leetcode.com/problems/happy-number/',
                    },
                    {
                        id: 'find-the-duplicate-number',
                        name: 'Find the Duplicate Number',
                        url: 'https://leetcode.com/problems/find-the-duplicate-number/',
                    },
                    {
                        id: 'is-subsequence',
                        name: 'Is Subsequence',
                        url: 'https://leetcode.com/problems/is-subsequence/',
                    },
                ],
            },
            {
                name: 'Two Pointers - Fixed Separation (Nth Node from End)',
                problems: [
                    {
                        id: 'remove-nth-node-from-end-of-list',
                        name: 'Remove Nth Node From End of List',
                        url: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/',
                    },
                    {
                        id: 'middle-of-the-linked-list',
                        name: 'Middle of the Linked List',
                        url: 'https://leetcode.com/problems/middle-of-the-linked-list/',
                    },
                    {
                        id: 'delete-the-middle-node-of-a-linked-list',
                        name: 'Delete the Middle Node of a Linked List',
                        url: 'https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/',
                    },
                ],
            },
            {
                name: 'Two Pointers - In-place Array Modification',
                problems: [
                    {
                        id: 'remove-duplicates-from-sorted-array',
                        name: 'Remove Duplicates from Sorted Array',
                        url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/',
                    },
                    {
                        id: 'remove-element',
                        name: 'Remove Element',
                        url: 'https://leetcode.com/problems/remove-element/',
                    },
                    {
                        id: 'sort-colors',
                        name: 'Sort Colors',
                        url: 'https://leetcode.com/problems/sort-colors/',
                    },
                    {
                        id: 'remove-duplicates-from-sorted-array-ii',
                        name: 'Remove Duplicates from Sorted Array II',
                        url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array-ii/',
                    },
                    {
                        id: 'move-zeroes',
                        name: 'Move Zeroes',
                        url: 'https://leetcode.com/problems/move-zeroes/',
                    },
                    {
                        id: 'string-compression',
                        name: 'String Compression',
                        url: 'https://leetcode.com/problems/string-compression/',
                    },
                    {
                        id: 'sort-array-by-parity',
                        name: 'Sort Array By Parity',
                        url: 'https://leetcode.com/problems/sort-array-by-parity/',
                    },
                    {
                        id: 'move-pieces-to-obtain-a-string',
                        name: 'Move Pieces to Obtain a String',
                        url: 'https://leetcode.com/problems/move-pieces-to-obtain-a-string/',
                    },
                    {
                        id: 'separate-black-and-white-balls',
                        name: 'Separate Black and White Balls',
                        url: 'https://leetcode.com/problems/separate-black-and-white-balls/',
                    },
                ],
            },
            {
                name: 'Two Pointers - String Comparison with Backspaces',
                problems: [
                    {
                        id: 'backspace-string-compare',
                        name: 'Backspace String Compare',
                        url: 'https://leetcode.com/problems/backspace-string-compare/',
                    },
                    {
                        id: 'crawler-log-folder',
                        name: 'Crawler Log Folder',
                        url: 'https://leetcode.com/problems/crawler-log-folder/',
                    },
                    {
                        id: 'removing-stars-from-a-string',
                        name: 'Removing Stars From a String',
                        url: 'https://leetcode.com/problems/removing-stars-from-a-string/',
                    },
                ],
            },
            {
                name: 'Two Pointers - Expanding From Center (Palindromes)',
                problems: [
                    {
                        id: 'longest-palindromic-substring',
                        name: 'Longest Palindromic Substring',
                        url: 'https://leetcode.com/problems/longest-palindromic-substring/',
                    },
                    {
                        id: 'palindromic-substrings',
                        name: 'Palindromic Substrings',
                        url: 'https://leetcode.com/problems/palindromic-substrings/',
                    },
                ],
            },
            {
                name: 'Two Pointers - String Reversal',
                problems: [
                    {
                        id: 'reverse-words-in-a-string',
                        name: 'Reverse Words in a String',
                        url: 'https://leetcode.com/problems/reverse-words-in-a-string/',
                    },
                    {
                        id: 'reverse-string',
                        name: 'Reverse String',
                        url: 'https://leetcode.com/problems/reverse-string/',
                    },
                    {
                        id: 'reverse-vowels-of-a-string',
                        name: 'Reverse Vowels of a String',
                        url: 'https://leetcode.com/problems/reverse-vowels-of-a-string/',
                    },
                    {
                        id: 'reverse-string-ii',
                        name: 'Reverse String II',
                        url: 'https://leetcode.com/problems/reverse-string-ii/',
                    },
                ],
            },
        ],
    },
    {
        id: 'sliding-window',
        title: 'Sliding Window Patterns',
        patterns: [
            {
                name: 'Sliding Window - Fixed Size (Subarray Calculation)',
                problems: [
                    {
                        id: 'moving-average-from-data-stream',
                        name: 'Moving Average from Data Stream',
                        url: 'https://leetcode.com/problems/moving-average-from-data-stream/',
                    },
                    {
                        id: 'maximum-average-subarray-i',
                        name: 'Maximum Average Subarray I',
                        url: 'https://leetcode.com/problems/maximum-average-subarray-i/',
                    },
                    {
                        id: 'calculate-compressed-mean',
                        name: 'Calculate Compressed Mean',
                        url: 'https://leetcode.com/problems/calculate-compressed-mean/',
                    },
                    {
                        id: 'find-the-power-of-k-size-subarrays-i',
                        name: 'Find the Power of K-Size Subarrays I',
                        url: 'https://leetcode.com/problems/find-the-power-of-k-size-subarrays-i/',
                    },
                    {
                        id: 'find-x-sum-of-all-k-long-subarrays-i',
                        name: 'Find X-Sum of All K-Long Subarrays I',
                        url: 'https://leetcode.com/problems/find-x-sum-of-all-k-long-subarrays-i/',
                    },
                ],
            },
            {
                name: 'Sliding Window - Variable Size (Condition-Based)',
                problems: [
                    {
                        id: 'longest-substring-without-repeating-characters',
                        name: 'Longest Substring Without Repeating Characters',
                        url: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
                    },
                    {
                        id: 'minimum-window-substring',
                        name: 'Minimum Window Substring',
                        url: 'https://leetcode.com/problems/minimum-window-substring/',
                    },
                    {
                        id: 'minimum-size-subarray-sum',
                        name: 'Minimum Size Subarray Sum',
                        url: 'https://leetcode.com/problems/minimum-size-subarray-sum/',
                    },
                    {
                        id: 'contains-duplicate-ii',
                        name: 'Contains Duplicate II',
                        url: 'https://leetcode.com/problems/contains-duplicate-ii/',
                    },
                    {
                        id: 'longest-repeating-character-replacement',
                        name: 'Longest Repeating Character Replacement',
                        url: 'https://leetcode.com/problems/longest-repeating-character-replacement/',
                    },
                    {
                        id: 'subarray-product-less-than-k',
                        name: 'Subarray Product Less Than K',
                        url: 'https://leetcode.com/problems/subarray-product-less-than-k/',
                    },
                    {
                        id: 'fruit-into-baskets',
                        name: 'Fruit Into Baskets',
                        url: 'https://leetcode.com/problems/fruit-into-baskets/',
                    },
                    {
                        id: 'max-consecutive-ones-iii',
                        name: 'Max Consecutive Ones III',
                        url: 'https://leetcode.com/problems/max-consecutive-ones-iii/',
                    },
                    {
                        id: 'longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit',
                        name: 'Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit',
                        url: 'https://leetcode.com/problems/longest-continuous-subarray-with-absolute-diff-less-than-or-equal-to-limit/',
                    },
                    {
                        id: 'longest-subarray-of-1s-after-deleting-one-element',
                        name: "Longest Subarray of 1's After Deleting One Element",
                        url: 'https://leetcode.com/problems/longest-subarray-of-1s-after-deleting-one-element/',
                    },
                    {
                        id: 'minimum-operations-to-reduce-x-to-zero',
                        name: 'Minimum Operations to Reduce X to Zero',
                        url: 'https://leetcode.com/problems/minimum-operations-to-reduce-x-to-zero/',
                    },
                    {
                        id: 'frequency-of-the-most-frequent-element',
                        name: 'Frequency of the Most Frequent Element',
                        url: 'https://leetcode.com/problems/frequency-of-the-most-frequent-element/',
                    },
                    {
                        id: 'maximum-sum-of-distinct-subarrays-with-length-k',
                        name: 'Maximum Sum of Distinct Subarrays With Length K',
                        url: 'https://leetcode.com/problems/maximum-sum-of-distinct-subarrays-with-length-k/',
                    },
                    {
                        id: 'take-k-of-each-character-from-left-and-right',
                        name: 'Take K of Each Character From Left and Right',
                        url: 'https://leetcode.com/problems/take-k-of-each-character-from-left-and-right/',
                    },
                    {
                        id: 'continuous-subarrays',
                        name: 'Continuous Subarrays',
                        url: 'https://leetcode.com/problems/continuous-subarrays/',
                    },
                    {
                        id: 'maximum-beauty-of-an-array-after-applying-operation',
                        name: 'Maximum Beauty of an Array After Applying Operation',
                        url: 'https://leetcode.com/problems/maximum-beauty-of-an-array-after-applying-operation/',
                    },
                    {
                        id: 'find-longest-special-substring-that-occurs-thrice-i',
                        name: 'Find Longest Special Substring That Occurs Thrice I',
                        url: 'https://leetcode.com/problems/find-longest-special-substring-that-occurs-thrice-i/',
                    },
                    {
                        id: 'maximum-good-subarray-sum',
                        name: 'Maximum Good Subarray Sum',
                        url: 'https://leetcode.com/problems/maximum-good-subarray-sum/',
                    },
                    {
                        id: 'maximum-frequency-of-an-element-after-performing-operations-i',
                        name: 'Maximum Frequency of an Element After Performing Operations I',
                        url: 'https://leetcode.com/problems/maximum-frequency-of-an-element-after-performing-operations-i/',
                    },
                    {
                        id: 'maximum-frequency-of-an-element-after-performing-operations-ii',
                        name: 'Maximum Frequency of an Element After Performing Operations II',
                        url: 'https://leetcode.com/problems/maximum-frequency-of-an-element-after-performing-operations-ii/',
                    },
                ],
            },
            {
                name: 'Sliding Window - Monotonic Queue for Max/Min',
                problems: [
                    {
                        id: 'sliding-window-maximum',
                        name: 'Sliding Window Maximum',
                        url: 'https://leetcode.com/problems/sliding-window-maximum/',
                    },
                    {
                        id: 'shortest-subarray-with-sum-at-least-k',
                        name: 'Shortest Subarray with Sum at Least K',
                        url: 'https://leetcode.com/problems/shortest-subarray-with-sum-at-least-k/',
                    },
                    {
                        id: 'jump-game-vi',
                        name: 'Jump Game VI',
                        url: 'https://leetcode.com/problems/jump-game-vi/',
                    },
                ],
            },
            {
                name: 'Sliding Window - Character Frequency Matching',
                problems: [
                    {
                        id: 'two-sum',
                        name: 'Two Sum',
                        url: 'https://leetcode.com/problems/two-sum/',
                    },
                    {
                        id: 'find-all-anagrams-in-a-string',
                        name: 'Find All Anagrams in a String',
                        url: 'https://leetcode.com/problems/find-all-anagrams-in-a-string/',
                    },
                    {
                        id: 'permutation-in-string',
                        name: 'Permutation in String',
                        url: 'https://leetcode.com/problems/permutation-in-string/',
                    },
                ],
            },
        ],
    },
    {
        id: 'arrays-hashing',
        title: 'Array/Matrix Manipulation Patterns',
        patterns: [
            {
                name: 'Array/Matrix - In-place Rotation',
                problems: [
                    {
                        id: 'rotate-image',
                        name: 'Rotate Image',
                        url: 'https://leetcode.com/problems/rotate-image/',
                    },
                    {
                        id: 'rotate-array',
                        name: 'Rotate Array',
                        url: 'https://leetcode.com/problems/rotate-array/',
                    },
                    {
                        id: 'transpose-matrix',
                        name: 'Transpose Matrix',
                        url: 'https://leetcode.com/problems/transpose-matrix/',
                    },
                ],
            },
            {
                name: 'Array/Matrix - Spiral Traversal',
                problems: [
                    {
                        id: 'spiral-matrix',
                        name: 'Spiral Matrix',
                        url: 'https://leetcode.com/problems/spiral-matrix/',
                    },
                    {
                        id: 'spiral-matrix-ii',
                        name: 'Spiral Matrix II',
                        url: 'https://leetcode.com/problems/spiral-matrix-ii/',
                    },
                    {
                        id: 'spiral-matrix-iii',
                        name: 'Spiral Matrix III',
                        url: 'https://leetcode.com/problems/spiral-matrix-iii/',
                    },
                    {
                        id: 'spiral-matrix-iv',
                        name: 'Spiral Matrix IV',
                        url: 'https://leetcode.com/problems/spiral-matrix-iv/',
                    },
                ],
            },
            {
                name: 'Array/Matrix - Set Matrix Zeroes (In-place Marking)',
                problems: [
                    {
                        id: 'set-matrix-zeroes',
                        name: 'Set Matrix Zeroes',
                        url: 'https://leetcode.com/problems/set-matrix-zeroes/',
                    },
                    {
                        id: 'game-of-life',
                        name: 'Game of Life',
                        url: 'https://leetcode.com/problems/game-of-life/',
                    },
                    {
                        id: 'diagonal-traverse',
                        name: 'Diagonal Traverse',
                        url: 'https://leetcode.com/problems/diagonal-traverse/',
                    },
                ],
            },
            {
                name: 'Array - Product Except Self (Prefix/Suffix Products)',
                problems: [
                    {
                        id: 'product-of-array-except-self',
                        name: 'Product of Array Except Self',
                        url: 'https://leetcode.com/problems/product-of-array-except-self/',
                    },
                    {
                        id: 'longest-mountain-in-array',
                        name: 'Longest Mountain in Array',
                        url: 'https://leetcode.com/problems/longest-mountain-in-array/',
                    },
                    {
                        id: 'minimum-penalty-for-a-shop',
                        name: 'Minimum Penalty for a Shop',
                        url: 'https://leetcode.com/problems/minimum-penalty-for-a-shop/',
                    },
                ],
            },
            {
                name: 'Array - Plus One (Handling Carry)',
                problems: [
                    {
                        id: 'plus-one',
                        name: 'Plus One',
                        url: 'https://leetcode.com/problems/plus-one/',
                    },
                    {
                        id: 'multiply-strings',
                        name: 'Multiply Strings',
                        url: 'https://leetcode.com/problems/multiply-strings/',
                    },
                    {
                        id: 'add-to-array-form-of-integer',
                        name: 'Add to Array-Form of Integer',
                        url: 'https://leetcode.com/problems/add-to-array-form-of-integer/',
                    },
                    {
                        id: 'add-binary',
                        name: 'Add Binary',
                        url: 'https://leetcode.com/problems/add-binary/',
                    },
                ],
            },
            {
                name: 'Array - Merge Sorted Array (In-place from End)',
                problems: [
                    {
                        id: 'merge-sorted-array',
                        name: 'Merge Sorted Array',
                        url: 'https://leetcode.com/problems/merge-sorted-array/',
                    },
                    {
                        id: 'squares-of-a-sorted-array',
                        name: 'Squares of a Sorted Array',
                        url: 'https://leetcode.com/problems/squares-of-a-sorted-array/',
                    },
                ],
            },
            {
                name: 'Array - Cyclic Sort',
                problems: [
                    {
                        id: 'first-missing-positive',
                        name: 'First Missing Positive',
                        url: 'https://leetcode.com/problems/first-missing-positive/',
                    },
                    {
                        id: 'missing-number',
                        name: 'Missing Number',
                        url: 'https://leetcode.com/problems/missing-number/',
                    },
                    {
                        id: 'find-the-duplicate-number',
                        name: 'Find the Duplicate Number',
                        url: 'https://leetcode.com/problems/find-the-duplicate-number/',
                    },
                    {
                        id: 'find-all-duplicates-in-an-array',
                        name: 'Find All Duplicates in an Array',
                        url: 'https://leetcode.com/problems/find-all-duplicates-in-an-array/',
                    },
                    {
                        id: 'find-all-numbers-disappeared-in-an-array',
                        name: 'Find All Numbers Disappeared in an Array',
                        url: 'https://leetcode.com/problems/find-all-numbers-disappeared-in-an-array/',
                    },
                ],
            },
        ],
    },
    {
        id: 'linked-lists',
        title: 'Linked List Manipulation Patterns',
        patterns: [
            {
                name: 'Linked List - In-place Reversal',
                problems: [
                    {
                        id: 'remove-duplicates-from-sorted-list',
                        name: 'Remove Duplicates from Sorted List',
                        url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-list/',
                    },
                    {
                        id: 'reverse-linked-list',
                        name: 'Reverse Linked List',
                        url: 'https://leetcode.com/problems/reverse-linked-list/',
                    },
                    {
                        id: 'reverse-linked-list-ii',
                        name: 'Reverse Linked List II',
                        url: 'https://leetcode.com/problems/reverse-linked-list-ii/',
                    },
                    {
                        id: 'reverse-nodes-in-k-group',
                        name: 'Reverse Nodes in k-Group',
                        url: 'https://leetcode.com/problems/reverse-nodes-in-k-group/',
                    },
                    {
                        id: 'palindrome-linked-list',
                        name: 'Palindrome Linked List',
                        url: 'https://leetcode.com/problems/palindrome-linked-list/',
                    },
                    {
                        id: 'remove-duplicates-from-sorted-list-ii',
                        name: 'Remove Duplicates from Sorted List II',
                        url: 'https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/',
                    },
                ],
            },
            {
                name: 'Linked List - Merging Two Sorted Lists',
                problems: [
                    {
                        id: 'merge-two-sorted-lists',
                        name: 'Merge Two Sorted Lists',
                        url: 'https://leetcode.com/problems/merge-two-sorted-lists/',
                    },
                    {
                        id: 'merge-k-sorted-lists',
                        name: 'Merge k Sorted Lists',
                        url: 'https://leetcode.com/problems/merge-k-sorted-lists/',
                    },
                ],
            },
            {
                name: 'Linked List - Addition of Numbers',
                problems: [
                    {
                        id: 'add-two-numbers',
                        name: 'Add Two Numbers',
                        url: 'https://leetcode.com/problems/add-two-numbers/',
                    },
                    {
                        id: 'plus-one-linked-list',
                        name: 'Plus One Linked List',
                        url: 'https://leetcode.com/problems/plus-one-linked-list/',
                    },
                ],
            },
            {
                name: 'Linked List - Intersection Detection',
                problems: [
                    {
                        id: 'intersection-of-two-linked-lists',
                        name: 'Intersection of Two Linked Lists',
                        url: 'https://leetcode.com/problems/intersection-of-two-linked-lists/',
                    },
                    {
                        id: 'minimum-index-sum-of-two-lists',
                        name: 'Minimum Index Sum of Two Lists',
                        url: 'https://leetcode.com/problems/minimum-index-sum-of-two-lists/',
                    },
                ],
            },
            {
                name: 'Linked List - Reordering / Partitioning',
                problems: [
                    {
                        id: 'swap-nodes-in-pairs',
                        name: 'Swap Nodes in Pairs',
                        url: 'https://leetcode.com/problems/swap-nodes-in-pairs/',
                    },
                    {
                        id: 'rotate-list',
                        name: 'Rotate List',
                        url: 'https://leetcode.com/problems/rotate-list/',
                    },
                    {
                        id: 'partition-list',
                        name: 'Partition List',
                        url: 'https://leetcode.com/problems/partition-list/',
                    },
                    {
                        id: 'reorder-list',
                        name: 'Reorder List',
                        url: 'https://leetcode.com/problems/reorder-list/',
                    },
                    {
                        id: 'odd-even-linked-list',
                        name: 'Odd Even Linked List',
                        url: 'https://leetcode.com/problems/odd-even-linked-list/',
                    },
                ],
            },
        ],
    },
    {
        id: 'stacks',
        title: 'Stack Patterns',
        patterns: [
            {
                name: 'Stack - Valid Parentheses Matching',
                problems: [
                    {
                        id: 'valid-parentheses',
                        name: 'Valid Parentheses',
                        url: 'https://leetcode.com/problems/valid-parentheses/',
                    },
                    {
                        id: 'longest-valid-parentheses',
                        name: 'Longest Valid Parentheses',
                        url: 'https://leetcode.com/problems/longest-valid-parentheses/',
                    },
                    {
                        id: 'minimum-add-to-make-parentheses-valid',
                        name: 'Minimum Add to Make Parentheses Valid',
                        url: 'https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/',
                    },
                    {
                        id: 'minimum-remove-to-make-valid-parentheses',
                        name: 'Minimum Remove to Make Valid Parentheses',
                        url: 'https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/',
                    },
                    {
                        id: 'minimum-number-of-swaps-to-make-the-string-balanced',
                        name: 'Minimum Number of Swaps to Make the String Balanced',
                        url: 'https://leetcode.com/problems/minimum-number-of-swaps-to-make-the-string-balanced/',
                    },
                ],
            },
            {
                name: 'Stack - Monotonic Stack',
                problems: [
                    {
                        id: 'remove-k-digits',
                        name: 'Remove K Digits',
                        url: 'https://leetcode.com/problems/remove-k-digits/',
                    },
                    {
                        id: 'next-greater-element-i',
                        name: 'Next Greater Element I',
                        url: 'https://leetcode.com/problems/next-greater-element-i/',
                    },
                    {
                        id: 'next-greater-element-ii',
                        name: 'Next Greater Element II',
                        url: 'https://leetcode.com/problems/next-greater-element-ii/',
                    },
                    {
                        id: 'daily-temperatures',
                        name: 'Daily Temperatures',
                        url: 'https://leetcode.com/problems/daily-temperatures/',
                    },
                    {
                        id: 'online-stock-span',
                        name: 'Online Stock Span',
                        url: 'https://leetcode.com/problems/online-stock-span/',
                    },
                    {
                        id: 'sum-of-subarray-minimums',
                        name: 'Sum of Subarray Minimums',
                        url: 'https://leetcode.com/problems/sum-of-subarray-minimums/',
                    },
                    {
                        id: 'maximum-width-ramp',
                        name: 'Maximum Width Ramp',
                        url: 'https://leetcode.com/problems/maximum-width-ramp/',
                    },
                    {
                        id: 'final-prices-with-a-special-discount-in-a-shop',
                        name: 'Final Prices With a Special Discount in a Shop',
                        url: 'https://leetcode.com/problems/final-prices-with-a-special-discount-in-a-shop/',
                    },
                    {
                        id: 'find-the-most-competitive-subsequence',
                        name: 'Find the Most Competitive Subsequence',
                        url: 'https://leetcode.com/problems/find-the-most-competitive-subsequence/',
                    },
                ],
            },
            {
                name: 'Stack - Expression Evaluation (RPN/Infix)',
                problems: [
                    {
                        id: 'evaluate-reverse-polish-notation',
                        name: 'Evaluate Reverse Polish Notation',
                        url: 'https://leetcode.com/problems/evaluate-reverse-polish-notation/',
                    },
                    {
                        id: 'basic-calculator',
                        name: 'Basic Calculator',
                        url: 'https://leetcode.com/problems/basic-calculator/',
                    },
                    {
                        id: 'basic-calculator-ii',
                        name: 'Basic Calculator II',
                        url: 'https://leetcode.com/problems/basic-calculator-ii/',
                    },
                    {
                        id: 'basic-calculator-iii',
                        name: 'Basic Calculator III',
                        url: 'https://leetcode.com/problems/basic-calculator-iii/',
                    },
                ],
            },
            {
                name: 'Stack - Simulation / Backtracking Helper',
                problems: [
                    {
                        id: 'simplify-path',
                        name: 'Simplify Path',
                        url: 'https://leetcode.com/problems/simplify-path/',
                    },
                    {
                        id: 'decode-string',
                        name: 'Decode String',
                        url: 'https://leetcode.com/problems/decode-string/',
                    },
                    {
                        id: 'asteroid-collision',
                        name: 'Asteroid Collision',
                        url: 'https://leetcode.com/problems/asteroid-collision/',
                    },
                ],
            },
            {
                name: 'Stack - Min Stack Design',
                problems: [
                    {
                        id: 'min-stack',
                        name: 'Min Stack',
                        url: 'https://leetcode.com/problems/min-stack/',
                    },
                    {
                        id: 'maximum-frequency-stack',
                        name: 'Maximum Frequency Stack',
                        url: 'https://leetcode.com/problems/maximum-frequency-stack/',
                    },
                ],
            },
            {
                name: 'Stack - Largest Rectangle in Histogram',
                problems: [
                    {
                        id: 'largest-rectangle-in-histogram',
                        name: 'Largest Rectangle in Histogram',
                        url: 'https://leetcode.com/problems/largest-rectangle-in-histogram/',
                    },
                    {
                        id: 'maximal-rectangle',
                        name: 'Maximal Rectangle',
                        url: 'https://leetcode.com/problems/maximal-rectangle/',
                    },
                ],
            },
        ],
    },
    {
        id: 'heaps',
        title: 'Heap (Priority Queue) Patterns',
        patterns: [
            {
                name: 'Heap - Top K Elements (Selection/Frequency)',
                problems: [
                    {
                        id: 'kth-largest-element-in-an-array',
                        name: 'Kth Largest Element in an Array',
                        url: 'https://leetcode.com/problems/kth-largest-element-in-an-array/',
                    },
                    {
                        id: 'top-k-frequent-elements',
                        name: 'Top K Frequent Elements',
                        url: 'https://leetcode.com/problems/top-k-frequent-elements/',
                    },
                    {
                        id: 'sort-characters-by-frequency',
                        name: 'Sort Characters By Frequency',
                        url: 'https://leetcode.com/problems/sort-characters-by-frequency/',
                    },
                    {
                        id: 'relative-ranks',
                        name: 'Relative Ranks',
                        url: 'https://leetcode.com/problems/relative-ranks/',
                    },
                    {
                        id: 'kth-largest-element-in-a-stream',
                        name: 'Kth Largest Element in a Stream',
                        url: 'https://leetcode.com/problems/kth-largest-element-in-a-stream/',
                    },
                    {
                        id: 'k-closest-points-to-origin',
                        name: 'K Closest Points to Origin',
                        url: 'https://leetcode.com/problems/k-closest-points-to-origin/',
                    },
                    {
                        id: 'last-stone-weight',
                        name: 'Last Stone Weight',
                        url: 'https://leetcode.com/problems/last-stone-weight/',
                    },
                    {
                        id: 'take-gifts-from-the-richest-pile',
                        name: 'Take Gifts From the Richest Pile',
                        url: 'https://leetcode.com/problems/take-gifts-from-the-richest-pile/',
                    },
                ],
            },
            {
                name: 'Heap - Two Heaps for Median Finding',
                problems: [
                    {
                        id: 'find-median-from-data-stream',
                        name: 'Find Median from Data Stream',
                        url: 'https://leetcode.com/problems/find-median-from-data-stream/',
                    },
                    {
                        id: 'finding-mk-average',
                        name: 'Finding MK Average',
                        url: 'https://leetcode.com/problems/finding-mk-average/',
                    },
                ],
            },
            {
                name: 'Heap - K-way Merge',
                problems: [
                    {
                        id: 'merge-k-sorted-lists',
                        name: 'Merge k Sorted Lists',
                        url: 'https://leetcode.com/problems/merge-k-sorted-lists/',
                    },
                    {
                        id: 'find-k-pairs-with-smallest-sums',
                        name: 'Find K Pairs with Smallest Sums',
                        url: 'https://leetcode.com/problems/find-k-pairs-with-smallest-sums/',
                    },
                    {
                        id: 'kth-smallest-element-in-a-sorted-matrix',
                        name: 'Kth Smallest Element in a Sorted Matrix',
                        url: 'https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/',
                    },
                    {
                        id: 'smallest-range-covering-elements-from-k-lists',
                        name: 'Smallest Range Covering Elements from K Lists',
                        url: 'https://leetcode.com/problems/smallest-range-covering-elements-from-k-lists/',
                    },
                ],
            },
            {
                name: 'Heap - Scheduling / Minimum Cost (Greedy with Priority Queue)',
                problems: [
                    {
                        id: 'meeting-rooms-ii',
                        name: 'Meeting Rooms II',
                        url: 'https://leetcode.com/problems/meeting-rooms-ii/',
                    },
                    {
                        id: 'reorganize-string',
                        name: 'Reorganize String',
                        url: 'https://leetcode.com/problems/reorganize-string/',
                    },
                    {
                        id: 'minimum-cost-to-hire-k-workers',
                        name: 'Minimum Cost to Hire K Workers',
                        url: 'https://leetcode.com/problems/minimum-cost-to-hire-k-workers/',
                    },
                    {
                        id: 'furthest-building-you-can-reach',
                        name: 'Furthest Building You Can Reach',
                        url: 'https://leetcode.com/problems/furthest-building-you-can-reach/',
                    },
                    {
                        id: 'maximum-average-pass-ratio',
                        name: 'Maximum Average Pass Ratio',
                        url: 'https://leetcode.com/problems/maximum-average-pass-ratio/',
                    },
                    {
                        id: 'single-threaded-cpu',
                        name: 'Single-Threaded CPU',
                        url: 'https://leetcode.com/problems/single-threaded-cpu/',
                    },
                    {
                        id: 'the-number-of-the-smallest-unoccupied-chair',
                        name: 'The Number of the Smallest Unoccupied Chair',
                        url: 'https://leetcode.com/problems/the-number-of-the-smallest-unoccupied-chair/',
                    },
                    {
                        id: 'meeting-rooms-iii',
                        name: 'Meeting Rooms III',
                        url: 'https://leetcode.com/problems/meeting-rooms-iii/',
                    },
                ],
            },
        ],
    },
    {
        id: 'trees',
        title: ' Tree Traversal Patterns',
        patterns: [
            {
                name: 'Tree BFS - Level Order Traversal',
                problems: [
                    {
                        id: 'binary-tree-level-order-traversal',
                        name: 'Binary Tree Level Order Traversal',
                        url: 'https://leetcode.com/problems/binary-tree-level-order-traversal/',
                    },
                    {
                        id: 'binary-tree-zigzag-level-order-traversal',
                        name: 'Binary Tree Zigzag Level Order Traversal',
                        url: 'https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/',
                    },
                    {
                        id: 'binary-tree-right-side-view',
                        name: 'Binary Tree Right Side View',
                        url: 'https://leetcode.com/problems/binary-tree-right-side-view/',
                    },
                    {
                        id: 'find-largest-value-in-each-tree-row',
                        name: 'Find Largest Value in Each Tree Row',
                        url: 'https://leetcode.com/problems/find-largest-value-in-each-tree-row/',
                    },
                    {
                        id: 'maximum-level-sum-of-a-binary-tree',
                        name: 'Maximum Level Sum of a Binary Tree',
                        url: 'https://leetcode.com/problems/maximum-level-sum-of-a-binary-tree/',
                    },
                ],
            },
            {
                name: 'Tree DFS - Recursive Preorder Traversal',
                problems: [
                    {
                        id: 'same-tree',
                        name: 'Same Tree',
                        url: 'https://leetcode.com/problems/same-tree/',
                    },
                    {
                        id: 'symmetric-tree',
                        name: 'Symmetric Tree',
                        url: 'https://leetcode.com/problems/symmetric-tree/',
                    },
                    {
                        id: 'construct-binary-tree-from-preorder-and-inorder-traversal',
                        name: 'Construct Binary Tree from Preorder and Inorder Traversal',
                        url: 'https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/',
                    },
                    {
                        id: 'flatten-binary-tree-to-linked-list',
                        name: 'Flatten Binary Tree to Linked List',
                        url: 'https://leetcode.com/problems/flatten-binary-tree-to-linked-list/',
                    },
                    {
                        id: 'invert-binary-tree',
                        name: 'Invert Binary Tree',
                        url: 'https://leetcode.com/problems/invert-binary-tree/',
                    },
                    {
                        id: 'binary-tree-paths',
                        name: 'Binary Tree Paths',
                        url: 'https://leetcode.com/problems/binary-tree-paths/',
                    },
                    {
                        id: 'smallest-string-starting-from-leaf',
                        name: 'Smallest String Starting From Leaf',
                        url: 'https://leetcode.com/problems/smallest-string-starting-from-leaf/',
                    },
                ],
            },
            {
                name: 'Tree DFS - Recursive Inorder Traversal',
                problems: [
                    {
                        id: 'binary-tree-inorder-traversal',
                        name: 'Binary Tree Inorder Traversal',
                        url: 'https://leetcode.com/problems/binary-tree-inorder-traversal/',
                    },
                    {
                        id: 'validate-binary-search-tree',
                        name: 'Validate Binary Search Tree',
                        url: 'https://leetcode.com/problems/validate-binary-search-tree/',
                    },
                    {
                        id: 'binary-search-tree-iterator',
                        name: 'Binary Search Tree Iterator',
                        url: 'https://leetcode.com/problems/binary-search-tree-iterator/',
                    },
                    {
                        id: 'kth-smallest-element-in-a-bst',
                        name: 'Kth Smallest Element in a BST',
                        url: 'https://leetcode.com/problems/kth-smallest-element-in-a-bst/',
                    },
                    {
                        id: 'find-mode-in-binary-search-tree',
                        name: 'Find Mode in Binary Search Tree',
                        url: 'https://leetcode.com/problems/find-mode-in-binary-search-tree/',
                    },
                    {
                        id: 'minimum-absolute-difference-in-bst',
                        name: 'Minimum Absolute Difference in BST',
                        url: 'https://leetcode.com/problems/minimum-absolute-difference-in-bst/',
                    },
                ],
            },
            {
                name: 'Tree DFS - Recursive Postorder Traversal',
                problems: [
                    {
                        id: 'maximum-depth-of-binary-tree',
                        name: 'Maximum Depth of Binary Tree',
                        url: 'https://leetcode.com/problems/maximum-depth-of-binary-tree/',
                    },
                    {
                        id: 'balanced-binary-tree',
                        name: 'Balanced Binary Tree',
                        url: 'https://leetcode.com/problems/balanced-binary-tree/',
                    },
                    {
                        id: 'binary-tree-maximum-path-sum',
                        name: 'Binary Tree Maximum Path Sum',
                        url: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/',
                    },
                    {
                        id: 'binary-tree-postorder-traversal',
                        name: 'Binary Tree Postorder Traversal',
                        url: 'https://leetcode.com/problems/binary-tree-postorder-traversal/',
                    },
                    {
                        id: 'house-robber-iii',
                        name: 'House Robber III',
                        url: 'https://leetcode.com/problems/house-robber-iii/',
                    },
                    {
                        id: 'find-leaves-of-binary-tree',
                        name: 'Find Leaves of Binary Tree',
                        url: 'https://leetcode.com/problems/find-leaves-of-binary-tree/',
                    },
                    {
                        id: 'diameter-of-binary-tree',
                        name: 'Diameter of Binary Tree',
                        url: 'https://leetcode.com/problems/diameter-of-binary-tree/',
                    },
                    {
                        id: 'all-nodes-distance-k-in-binary-tree',
                        name: 'All Nodes Distance K in Binary Tree',
                        url: 'https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/',
                    },
                    {
                        id: 'delete-nodes-and-return-forest',
                        name: 'Delete Nodes And Return Forest',
                        url: 'https://leetcode.com/problems/delete-nodes-and-return-forest/',
                    },
                    {
                        id: 'height-of-binary-tree-after-subtree-removal-queries',
                        name: 'Height of Binary Tree After Subtree Removal Queries',
                        url: 'https://leetcode.com/problems/height-of-binary-tree-after-subtree-removal-queries/',
                    },
                ],
            },
            {
                name: 'Tree - Lowest Common Ancestor (LCA) Finding',
                problems: [
                    {
                        id: 'lowest-common-ancestor-of-a-binary-search-tree',
                        name: 'Lowest Common Ancestor of a Binary Search Tree',
                        url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/',
                    },
                    {
                        id: 'lowest-common-ancestor-of-a-binary-tree',
                        name: 'Lowest Common Ancestor of a Binary Tree',
                        url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/',
                    },
                ],
            },
            {
                name: 'Tree - Serialization and Deserialization',
                problems: [
                    {
                        id: 'serialize-and-deserialize-binary-tree',
                        name: 'Serialize and Deserialize Binary Tree',
                        url: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/',
                    },
                    {
                        id: 'subtree-of-another-tree',
                        name: 'Subtree of Another Tree',
                        url: 'https://leetcode.com/problems/subtree-of-another-tree/',
                    },
                    {
                        id: 'find-duplicate-subtrees',
                        name: 'Find Duplicate Subtrees',
                        url: 'https://leetcode.com/problems/find-duplicate-subtrees/',
                    },
                ],
            },
        ],
    },
    {
        id: 'graphs',
        title: 'Graph Traversal Patterns (DFS & BFS)',
        patterns: [
            {
                name: 'Graph DFS - Connected Components / Island Counting',
                problems: [
                    {
                        id: 'surrounded-regions',
                        name: 'Surrounded Regions',
                        url: 'https://leetcode.com/problems/surrounded-regions/',
                    },
                    {
                        id: 'number-of-islands',
                        name: 'Number of Islands',
                        url: 'https://leetcode.com/problems/number-of-islands/',
                    },
                    {
                        id: 'pacific-atlantic-water-flow',
                        name: 'Pacific Atlantic Water Flow',
                        url: 'https://leetcode.com/problems/pacific-atlantic-water-flow/',
                    },
                    {
                        id: 'number-of-provinces',
                        name: 'Number of Provinces',
                        url: 'https://leetcode.com/problems/number-of-provinces/',
                    },
                    {
                        id: 'max-area-of-island',
                        name: 'Max Area of Island',
                        url: 'https://leetcode.com/problems/max-area-of-island/',
                    },
                    {
                        id: 'flood-fill',
                        name: 'Flood Fill',
                        url: 'https://leetcode.com/problems/flood-fill/',
                    },
                    {
                        id: 'keys-and-rooms',
                        name: 'Keys and Rooms',
                        url: 'https://leetcode.com/problems/keys-and-rooms/',
                    },
                    {
                        id: 'number-of-enclaves',
                        name: 'Number of Enclaves',
                        url: 'https://leetcode.com/problems/number-of-enclaves/',
                    },
                    {
                        id: 'number-of-closed-islands',
                        name: 'Number of Closed Islands',
                        url: 'https://leetcode.com/problems/number-of-closed-islands/',
                    },
                    {
                        id: 'count-sub-islands',
                        name: 'Count Sub Islands',
                        url: 'https://leetcode.com/problems/count-sub-islands/',
                    },
                    {
                        id: 'detonate-the-maximum-bombs',
                        name: 'Detonate the Maximum Bombs',
                        url: 'https://leetcode.com/problems/detonate-the-maximum-bombs/',
                    },
                ],
            },
            {
                name: 'Graph BFS - Connected Components / Island Counting',
                problems: [
                    {
                        id: '01-matrix',
                        name: '01 Matrix',
                        url: 'https://leetcode.com/problems/01-matrix/',
                    },
                    {
                        id: 'rotting-oranges',
                        name: 'Rotting Oranges',
                        url: 'https://leetcode.com/problems/rotting-oranges/',
                    },
                    {
                        id: 'shortest-path-in-binary-matrix',
                        name: 'Shortest Path in Binary Matrix',
                        url: 'https://leetcode.com/problems/shortest-path-in-binary-matrix/',
                    },
                ],
            },
            {
                name: 'Graph DFS - Cycle Detection (Directed Graph)',
                problems: [
                    {
                        id: 'course-schedule',
                        name: 'Course Schedule',
                        url: 'https://leetcode.com/problems/course-schedule/',
                    },
                    {
                        id: 'course-schedule-ii',
                        name: 'Course Schedule II',
                        url: 'https://leetcode.com/problems/course-schedule-ii/',
                    },
                    {
                        id: 'find-eventual-safe-states',
                        name: 'Find Eventual Safe States',
                        url: 'https://leetcode.com/problems/find-eventual-safe-states/',
                    },
                    {
                        id: 'all-paths-from-source-lead-to-destination',
                        name: 'All Paths from Source Lead to Destination',
                        url: 'https://leetcode.com/problems/all-paths-from-source-lead-to-destination/',
                    },
                ],
            },
            {
                name: "Graph BFS - Topological Sort (Kahn's Algorithm)",
                problems: [
                    {
                        id: 'course-schedule-ii',
                        name: 'Course Schedule II',
                        url: 'https://leetcode.com/problems/course-schedule-ii/',
                    },
                    {
                        id: 'alien-dictionary',
                        name: 'Alien Dictionary',
                        url: 'https://leetcode.com/problems/alien-dictionary/',
                    },
                    {
                        id: 'minimum-height-trees',
                        name: 'Minimum Height Trees',
                        url: 'https://leetcode.com/problems/minimum-height-trees/',
                    },
                    {
                        id: 'sequence-reconstruction',
                        name: 'Sequence Reconstruction',
                        url: 'https://leetcode.com/problems/sequence-reconstruction/',
                    },
                    {
                        id: 'parallel-courses',
                        name: 'Parallel Courses',
                        url: 'https://leetcode.com/problems/parallel-courses/',
                    },
                    {
                        id: 'largest-color-value-in-a-directed-graph',
                        name: 'Largest Color Value in a Directed Graph',
                        url: 'https://leetcode.com/problems/largest-color-value-in-a-directed-graph/',
                    },
                    {
                        id: 'parallel-courses-iii',
                        name: 'Parallel Courses III',
                        url: 'https://leetcode.com/problems/parallel-courses-iii/',
                    },
                    {
                        id: 'find-all-possible-recipes-from-given-supplies',
                        name: 'Find All Possible Recipes from Given Supplies',
                        url: 'https://leetcode.com/problems/find-all-possible-recipes-from-given-supplies/',
                    },
                    {
                        id: 'build-a-matrix-with-conditions',
                        name: 'Build a Matrix With Conditions',
                        url: 'https://leetcode.com/problems/build-a-matrix-with-conditions/',
                    },
                ],
            },
            {
                name: 'Graph - Deep Copy / Cloning',
                problems: [
                    {
                        id: 'clone-graph',
                        name: 'Clone Graph',
                        url: 'https://leetcode.com/problems/clone-graph/',
                    },
                    {
                        id: 'find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance',
                        name: 'Find the City With the Smallest Number of Neighbors at a Threshold Distance',
                        url: 'https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/',
                    },
                    {
                        id: 'copy-list-with-random-pointer',
                        name: 'Copy List with Random Pointer',
                        url: 'https://leetcode.com/problems/copy-list-with-random-pointer/',
                    },
                    {
                        id: 'clone-n-ary-tree',
                        name: 'Clone N-ary Tree',
                        url: 'https://leetcode.com/problems/clone-n-ary-tree/',
                    },
                ],
            },
            {
                name: "Graph - Shortest Path (Dijkstra's Algorithm)",
                problems: [
                    {
                        id: 'network-delay-time',
                        name: 'Network Delay Time',
                        url: 'https://leetcode.com/problems/network-delay-time/',
                    },
                    {
                        id: 'swim-in-rising-water',
                        name: 'Swim in Rising Water',
                        url: 'https://leetcode.com/problems/swim-in-rising-water/',
                    },
                    {
                        id: 'path-with-maximum-probability',
                        name: 'Path with Maximum Probability',
                        url: 'https://leetcode.com/problems/path-with-maximum-probability/',
                    },
                    {
                        id: 'path-with-minimum-effort',
                        name: 'Path With Minimum Effort',
                        url: 'https://leetcode.com/problems/path-with-minimum-effort/',
                    },
                    {
                        id: 'number-of-ways-to-arrive-at-destination',
                        name: 'Number of Ways to Arrive at Destination',
                        url: 'https://leetcode.com/problems/number-of-ways-to-arrive-at-destination/',
                    },
                    {
                        id: 'second-minimum-time-to-reach-destination',
                        name: 'Second Minimum Time to Reach Destination',
                        url: 'https://leetcode.com/problems/second-minimum-time-to-reach-destination/',
                    },
                    {
                        id: 'minimum-weighted-subgraph-with-the-required-paths',
                        name: 'Minimum Weighted Subgraph With the Required Paths',
                        url: 'https://leetcode.com/problems/minimum-weighted-subgraph-with-the-required-paths/',
                    },
                    {
                        id: 'minimum-obstacle-removal-to-reach-corner',
                        name: 'Minimum Obstacle Removal to Reach Corner',
                        url: 'https://leetcode.com/problems/minimum-obstacle-removal-to-reach-corner/',
                    },
                    {
                        id: 'minimum-time-to-visit-a-cell-in-a-grid',
                        name: 'Minimum Time to Visit a Cell In a Grid',
                        url: 'https://leetcode.com/problems/minimum-time-to-visit-a-cell-in-a-grid/',
                    },
                    {
                        id: 'find-the-safest-path-in-a-grid',
                        name: 'Find the Safest Path in a Grid',
                        url: 'https://leetcode.com/problems/find-the-safest-path-in-a-grid/',
                    },
                ],
            },
            {
                name: 'Graph - Shortest Path (Bellman-Ford / BFS+K)',
                problems: [
                    {
                        id: 'cheapest-flights-within-k-stops',
                        name: 'Cheapest Flights Within K Stops',
                        url: 'https://leetcode.com/problems/cheapest-flights-within-k-stops/',
                    },
                    {
                        id: 'shortest-path-with-alternating-colors',
                        name: 'Shortest Path with Alternating Colors',
                        url: 'https://leetcode.com/problems/shortest-path-with-alternating-colors/',
                    },
                ],
            },
            {
                name: 'Graph - Union-Find (Disjoint Set Union - DSU)',
                problems: [
                    {
                        id: 'number-of-islands',
                        name: 'Number of Islands',
                        url: 'https://leetcode.com/problems/number-of-islands/',
                    },
                    {
                        id: 'graph-valid-tree',
                        name: 'Graph Valid Tree',
                        url: 'https://leetcode.com/problems/graph-valid-tree/',
                    },
                    {
                        id: 'number-of-islands-ii',
                        name: 'Number of Islands II',
                        url: 'https://leetcode.com/problems/number-of-islands-ii/',
                    },
                    {
                        id: 'number-of-connected-components-in-an-undirected-graph',
                        name: 'Number of Connected Components in an Undirected Graph',
                        url: 'https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/',
                    },
                    {
                        id: 'number-of-provinces',
                        name: 'Number of Provinces',
                        url: 'https://leetcode.com/problems/number-of-provinces/',
                    },
                    {
                        id: 'redundant-connection',
                        name: 'Redundant Connection',
                        url: 'https://leetcode.com/problems/redundant-connection/',
                    },
                    {
                        id: 'accounts-merge',
                        name: 'Accounts Merge',
                        url: 'https://leetcode.com/problems/accounts-merge/',
                    },
                    {
                        id: 'sentence-similarity-ii',
                        name: 'Sentence Similarity II',
                        url: 'https://leetcode.com/problems/sentence-similarity-ii/',
                    },
                    {
                        id: 'most-stones-removed-with-same-row-or-column',
                        name: 'Most Stones Removed with Same Row or Column',
                        url: 'https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/',
                    },
                    {
                        id: 'largest-component-size-by-common-factor',
                        name: 'Largest Component Size by Common Factor',
                        url: 'https://leetcode.com/problems/largest-component-size-by-common-factor/',
                    },
                    {
                        id: 'regions-cut-by-slashes',
                        name: 'Regions Cut By Slashes',
                        url: 'https://leetcode.com/problems/regions-cut-by-slashes/',
                    },
                    {
                        id: 'the-earliest-moment-when-everyone-become-friends',
                        name: 'The Earliest Moment When Everyone Become Friends',
                        url: 'https://leetcode.com/problems/the-earliest-moment-when-everyone-become-friends/',
                    },
                ],
            },
            {
                name: 'Strongly Connected Components (Kosaraju / Tarjan)',
                problems: [
                    {
                        id: 'course-schedule-ii',
                        name: 'Course Schedule II',
                        url: 'https://leetcode.com/problems/course-schedule-ii/',
                    },
                    {
                        id: 'number-of-provinces',
                        name: 'Number of Provinces',
                        url: 'https://leetcode.com/problems/number-of-provinces/',
                    },
                    {
                        id: 'critical-connections-in-a-network',
                        name: 'Critical Connections in a Network',
                        url: 'https://leetcode.com/problems/critical-connections-in-a-network/',
                    },
                    {
                        id: 'maximum-employees-to-be-invited-to-a-meeting',
                        name: 'Maximum Employees to Be Invited to a Meeting',
                        url: 'https://leetcode.com/problems/maximum-employees-to-be-invited-to-a-meeting/',
                    },
                ],
            },
            {
                name: 'Bridges & Articulation Points (Tarjan low-link)',
                problems: [
                    {
                        id: 'critical-connections-in-a-network',
                        name: 'Critical Connections in a Network',
                        url: 'https://leetcode.com/problems/critical-connections-in-a-network/',
                    },
                    {
                        id: 'longest-cycle-in-a-graph',
                        name: 'Longest Cycle in a Graph',
                        url: 'https://leetcode.com/problems/longest-cycle-in-a-graph/',
                    },
                ],
            },
            {
                name: 'Minimum Spanning Tree (Kruskal / Prim / DSU + heap)',
                problems: [
                    {
                        id: 'connecting-cities-with-minimum-cost',
                        name: 'Connecting Cities With Minimum Cost',
                        url: 'https://leetcode.com/problems/connecting-cities-with-minimum-cost/',
                    },
                    {
                        id: 'min-cost-to-connect-all-points',
                        name: 'Min Cost to Connect All Points',
                        url: 'https://leetcode.com/problems/min-cost-to-connect-all-points/',
                    },
                    {
                        id: 'optimize-water-distribution-in-a-village',
                        name: 'Optimize Water Distribution in a Village',
                        url: 'https://leetcode.com/problems/optimize-water-distribution-in-a-village/',
                    },
                    {
                        id: 'find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree',
                        name: 'Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree',
                        url: 'https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/',
                    },
                ],
            },
            {
                name: 'Bidirectional BFS (BFS optimization for known source & target)',
                problems: [
                    {
                        id: 'word-ladder',
                        name: 'Word Ladder',
                        url: 'https://leetcode.com/problems/word-ladder/',
                    },
                    {
                        id: 'word-ladder-ii',
                        name: 'Word Ladder II',
                        url: 'https://leetcode.com/problems/word-ladder-ii/',
                    },
                    {
                        id: 'bus-routes',
                        name: 'Bus Routes',
                        url: 'https://leetcode.com/problems/bus-routes/',
                    },
                ],
            },
        ],
    },
    {
        id: 'binary-search',
        title: 'Binary Search Patterns',
        patterns: [
            {
                name: 'Binary Search - On Sorted Array/List',
                problems: [
                    {
                        id: 'search-insert-position',
                        name: 'Search Insert Position',
                        url: 'https://leetcode.com/problems/search-insert-position/',
                    },
                    { id: 'sqrtx', name: 'Sqrt(x)', url: 'https://leetcode.com/problems/sqrtx/' },
                    {
                        id: 'search-a-2d-matrix',
                        name: 'Search a 2D Matrix',
                        url: 'https://leetcode.com/problems/search-a-2d-matrix/',
                    },
                    {
                        id: 'first-bad-version',
                        name: 'First Bad Version',
                        url: 'https://leetcode.com/problems/first-bad-version/',
                    },
                    {
                        id: 'guess-number-higher-or-lower',
                        name: 'Guess Number Higher or Lower',
                        url: 'https://leetcode.com/problems/guess-number-higher-or-lower/',
                    },
                    {
                        id: 'single-element-in-a-sorted-array',
                        name: 'Single Element in a Sorted Array',
                        url: 'https://leetcode.com/problems/single-element-in-a-sorted-array/',
                    },
                    {
                        id: 'binary-search',
                        name: 'Binary Search',
                        url: 'https://leetcode.com/problems/binary-search/',
                    },
                    {
                        id: 'kth-missing-positive-number',
                        name: 'Kth Missing Positive Number',
                        url: 'https://leetcode.com/problems/kth-missing-positive-number/',
                    },
                ],
            },
            {
                name: 'Binary Search - Find Min/Max in Rotated Sorted Array',
                problems: [
                    {
                        id: 'search-in-rotated-sorted-array',
                        name: 'Search in Rotated Sorted Array',
                        url: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
                    },
                    {
                        id: 'search-in-rotated-sorted-array-ii',
                        name: 'Search in Rotated Sorted Array II',
                        url: 'https://leetcode.com/problems/search-in-rotated-sorted-array-ii/',
                    },
                    {
                        id: 'find-minimum-in-rotated-sorted-array',
                        name: 'Find Minimum in Rotated Sorted Array',
                        url: 'https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/',
                    },
                    {
                        id: 'find-peak-element',
                        name: 'Find Peak Element',
                        url: 'https://leetcode.com/problems/find-peak-element/',
                    },
                    {
                        id: 'peak-index-in-a-mountain-array',
                        name: 'Peak Index in a Mountain Array',
                        url: 'https://leetcode.com/problems/peak-index-in-a-mountain-array/',
                    },
                    {
                        id: 'find-in-mountain-array',
                        name: 'Find in Mountain Array',
                        url: 'https://leetcode.com/problems/find-in-mountain-array/',
                    },
                ],
            },
            {
                name: 'Binary Search - On Answer / Condition Function',
                problems: [
                    {
                        id: 'split-array-largest-sum',
                        name: 'Split Array Largest Sum',
                        url: 'https://leetcode.com/problems/split-array-largest-sum/',
                    },
                    {
                        id: 'minimize-max-distance-to-gas-station',
                        name: 'Minimize Max Distance to Gas Station',
                        url: 'https://leetcode.com/problems/minimize-max-distance-to-gas-station/',
                    },
                    {
                        id: 'koko-eating-bananas',
                        name: 'Koko Eating Bananas',
                        url: 'https://leetcode.com/problems/koko-eating-bananas/',
                    },
                    {
                        id: 'capacity-to-ship-packages-within-d-days',
                        name: 'Capacity To Ship Packages Within D Days',
                        url: 'https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/',
                    },
                    {
                        id: 'minimum-number-of-days-to-make-m-bouquets',
                        name: 'Minimum Number of Days to Make m Bouquets',
                        url: 'https://leetcode.com/problems/minimum-number-of-days-to-make-m-bouquets/',
                    },
                    {
                        id: 'minimum-limit-of-balls-in-a-bag',
                        name: 'Minimum Limit of Balls in a Bag',
                        url: 'https://leetcode.com/problems/minimum-limit-of-balls-in-a-bag/',
                    },
                    {
                        id: 'minimized-maximum-of-products-distributed-to-any-store',
                        name: 'Minimized Maximum of Products Distributed to Any Store',
                        url: 'https://leetcode.com/problems/minimized-maximum-of-products-distributed-to-any-store/',
                    },
                    {
                        id: 'maximum-candies-allocated-to-k-children',
                        name: 'Maximum Candies Allocated to K Children',
                        url: 'https://leetcode.com/problems/maximum-candies-allocated-to-k-children/',
                    },
                ],
            },
            {
                name: 'Binary Search - Find First/Last Occurrence',
                problems: [
                    {
                        id: 'find-first-and-last-position-of-element-in-sorted-array',
                        name: 'Find First and Last Position of Element in Sorted Array',
                        url: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/',
                    },
                    {
                        id: 'find-k-closest-elements',
                        name: 'Find K Closest Elements',
                        url: 'https://leetcode.com/problems/find-k-closest-elements/',
                    },
                ],
            },
            {
                name: 'Binary Search - Median / Kth across Two Sorted Arrays',
                problems: [
                    {
                        id: 'median-of-two-sorted-arrays',
                        name: 'Median of Two Sorted Arrays',
                        url: 'https://leetcode.com/problems/median-of-two-sorted-arrays/',
                    },
                    {
                        id: 'find-k-th-smallest-pair-distance',
                        name: 'Find K-th Smallest Pair Distance',
                        url: 'https://leetcode.com/problems/find-k-th-smallest-pair-distance/',
                    },
                    {
                        id: 'kth-smallest-element-in-a-sorted-matrix',
                        name: 'Kth Smallest Element in a Sorted Matrix',
                        url: 'https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/',
                    },
                ],
            },
        ],
    },
    {
        id: 'backtracking',
        title: 'Backtracking Patterns',
        patterns: [
            {
                name: 'Backtracking - Subsets (Include/Exclude)',
                problems: [
                    {
                        id: 'letter-combinations-of-a-phone-number',
                        name: 'Letter Combinations of a Phone Number',
                        url: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/',
                    },
                    {
                        id: 'combinations',
                        name: 'Combinations',
                        url: 'https://leetcode.com/problems/combinations/',
                    },
                    {
                        id: 'subsets',
                        name: 'Subsets',
                        url: 'https://leetcode.com/problems/subsets/',
                    },
                    {
                        id: 'subsets-ii',
                        name: 'Subsets II',
                        url: 'https://leetcode.com/problems/subsets-ii/',
                    },
                ],
            },
            {
                name: 'Backtracking - Permutations',
                problems: [
                    {
                        id: 'next-permutation',
                        name: 'Next Permutation',
                        url: 'https://leetcode.com/problems/next-permutation/',
                    },
                    {
                        id: 'permutations',
                        name: 'Permutations',
                        url: 'https://leetcode.com/problems/permutations/',
                    },
                    {
                        id: 'permutation-sequence',
                        name: 'Permutation Sequence',
                        url: 'https://leetcode.com/problems/permutation-sequence/',
                    },
                ],
            },
            {
                name: 'Backtracking - Combination Sum',
                problems: [
                    {
                        id: 'combination-sum',
                        name: 'Combination Sum',
                        url: 'https://leetcode.com/problems/combination-sum/',
                    },
                    {
                        id: 'combination-sum-ii',
                        name: 'Combination Sum II',
                        url: 'https://leetcode.com/problems/combination-sum-ii/',
                    },
                ],
            },
            {
                name: 'Backtracking - Parentheses Generation',
                problems: [
                    {
                        id: 'generate-parentheses',
                        name: 'Generate Parentheses',
                        url: 'https://leetcode.com/problems/generate-parentheses/',
                    },
                    {
                        id: 'remove-invalid-parentheses',
                        name: 'Remove Invalid Parentheses',
                        url: 'https://leetcode.com/problems/remove-invalid-parentheses/',
                    },
                ],
            },
            {
                name: 'Backtracking - Word Search / Path Finding in Grid',
                problems: [
                    {
                        id: 'word-search',
                        name: 'Word Search',
                        url: 'https://leetcode.com/problems/word-search/',
                    },
                    {
                        id: 'word-search-ii',
                        name: 'Word Search II',
                        url: 'https://leetcode.com/problems/word-search-ii/',
                    },
                    {
                        id: 'check-if-word-can-be-placed-in-crossword',
                        name: 'Check if Word Can Be Placed In Crossword',
                        url: 'https://leetcode.com/problems/check-if-word-can-be-placed-in-crossword/',
                    },
                ],
            },
            {
                name: 'Backtracking - N-Queens / Constraint Satisfaction',
                problems: [
                    {
                        id: 'sudoku-solver',
                        name: 'Sudoku Solver',
                        url: 'https://leetcode.com/problems/sudoku-solver/',
                    },
                    {
                        id: 'n-queens',
                        name: 'N-Queens',
                        url: 'https://leetcode.com/problems/n-queens/',
                    },
                ],
            },
            {
                name: 'Backtracking - Palindrome Partitioning',
                problems: [
                    {
                        id: 'palindrome-partitioning',
                        name: 'Palindrome Partitioning',
                        url: 'https://leetcode.com/problems/palindrome-partitioning/',
                    },
                    {
                        id: 'palindrome-partitioning-ii',
                        name: 'Palindrome Partitioning II',
                        url: 'https://leetcode.com/problems/palindrome-partitioning-ii/',
                    },
                    {
                        id: 'pseudo-palindromic-paths-in-a-binary-tree',
                        name: 'Pseudo-Palindromic Paths in a Binary Tree',
                        url: 'https://leetcode.com/problems/pseudo-palindromic-paths-in-a-binary-tree/',
                    },
                ],
            },
        ],
    },
    {
        id: 'dp',
        title: 'Dynamic Programming (DP) Patterns',
        patterns: [
            {
                name: 'DP - 1D Array (Fibonacci Style)',
                problems: [
                    {
                        id: 'climbing-stairs',
                        name: 'Climbing Stairs',
                        url: 'https://leetcode.com/problems/climbing-stairs/',
                    },
                    {
                        id: 'decode-ways',
                        name: 'Decode Ways',
                        url: 'https://leetcode.com/problems/decode-ways/',
                    },
                    {
                        id: 'house-robber',
                        name: 'House Robber',
                        url: 'https://leetcode.com/problems/house-robber/',
                    },
                    {
                        id: 'house-robber-ii',
                        name: 'House Robber II',
                        url: 'https://leetcode.com/problems/house-robber-ii/',
                    },
                    {
                        id: 'house-robber-iii',
                        name: 'House Robber III',
                        url: 'https://leetcode.com/problems/house-robber-iii/',
                    },
                    {
                        id: 'fibonacci-number',
                        name: 'Fibonacci Number',
                        url: 'https://leetcode.com/problems/fibonacci-number/',
                    },
                    {
                        id: 'delete-and-earn',
                        name: 'Delete and Earn',
                        url: 'https://leetcode.com/problems/delete-and-earn/',
                    },
                    {
                        id: 'min-cost-climbing-stairs',
                        name: 'Min Cost Climbing Stairs',
                        url: 'https://leetcode.com/problems/min-cost-climbing-stairs/',
                    },
                ],
            },
            {
                name: "DP - 1D Array (Kadane's Algorithm for Max/Min Subarray)",
                problems: [
                    {
                        id: 'maximum-subarray',
                        name: 'Maximum Subarray',
                        url: 'https://leetcode.com/problems/maximum-subarray/',
                    },
                    {
                        id: 'maximum-sum-circular-subarray',
                        name: 'Maximum Sum Circular Subarray',
                        url: 'https://leetcode.com/problems/maximum-sum-circular-subarray/',
                    },
                    {
                        id: 'maximum-score-of-spliced-array',
                        name: 'Maximum Score Of Spliced Array',
                        url: 'https://leetcode.com/problems/maximum-score-of-spliced-array/',
                    },
                    {
                        id: 'maximum-absolute-sum-of-any-subarray',
                        name: 'Maximum Absolute Sum of Any Subarray',
                        url: 'https://leetcode.com/problems/maximum-absolute-sum-of-any-subarray/',
                    },
                    {
                        id: 'maximum-product-subarray',
                        name: 'Maximum Product Subarray',
                        url: 'https://leetcode.com/problems/maximum-product-subarray/',
                    },
                ],
            },
            {
                name: 'DP - 1D Array (Coin Change / Unbounded Knapsack Style)',
                problems: [
                    {
                        id: 'coin-change',
                        name: 'Coin Change',
                        url: 'https://leetcode.com/problems/coin-change/',
                    },
                    {
                        id: 'combination-sum-iv',
                        name: 'Combination Sum IV',
                        url: 'https://leetcode.com/problems/combination-sum-iv/',
                    },
                    {
                        id: 'coin-change-ii',
                        name: 'Coin Change II',
                        url: 'https://leetcode.com/problems/coin-change-ii/',
                    },
                ],
            },
            {
                name: 'DP - 1D Array (0/1 Knapsack Subset Sum Style)',
                problems: [
                    {
                        id: 'partition-equal-subset-sum',
                        name: 'Partition Equal Subset Sum',
                        url: 'https://leetcode.com/problems/partition-equal-subset-sum/',
                    },
                    {
                        id: 'target-sum',
                        name: 'Target Sum',
                        url: 'https://leetcode.com/problems/target-sum/',
                    },
                ],
            },
            {
                name: 'DP - 1D Array (Word Break Style)',
                problems: [
                    {
                        id: 'word-break',
                        name: 'Word Break',
                        url: 'https://leetcode.com/problems/word-break/',
                    },
                    {
                        id: 'word-break-ii',
                        name: 'Word Break II',
                        url: 'https://leetcode.com/problems/word-break-ii/',
                    },
                ],
            },
            {
                name: 'DP - 2D Array (Longest Common Subsequence - LCS)',
                problems: [
                    {
                        id: 'longest-common-subsequence',
                        name: 'Longest Common Subsequence',
                        url: 'https://leetcode.com/problems/longest-common-subsequence/',
                    },
                    {
                        id: 'shortest-common-supersequence',
                        name: 'Shortest Common Supersequence',
                        url: 'https://leetcode.com/problems/shortest-common-supersequence/',
                    },
                    {
                        id: 'minimum-insertion-steps-to-make-a-string-palindrome',
                        name: 'Minimum Insertion Steps to Make a String Palindrome',
                        url: 'https://leetcode.com/problems/minimum-insertion-steps-to-make-a-string-palindrome/',
                    },
                ],
            },
            {
                name: 'DP - 2D Array (Edit Distance / Levenshtein Distance)',
                problems: [
                    {
                        id: 'edit-distance',
                        name: 'Edit Distance',
                        url: 'https://leetcode.com/problems/edit-distance/',
                    },
                    {
                        id: 'delete-operation-for-two-strings',
                        name: 'Delete Operation for Two Strings',
                        url: 'https://leetcode.com/problems/delete-operation-for-two-strings/',
                    },
                    {
                        id: 'minimum-ascii-delete-sum-for-two-strings',
                        name: 'Minimum ASCII Delete Sum for Two Strings',
                        url: 'https://leetcode.com/problems/minimum-ascii-delete-sum-for-two-strings/',
                    },
                ],
            },
            {
                name: 'DP - 2D Array (Unique Paths on Grid)',
                problems: [
                    {
                        id: 'unique-paths',
                        name: 'Unique Paths',
                        url: 'https://leetcode.com/problems/unique-paths/',
                    },
                    {
                        id: 'unique-paths-ii',
                        name: 'Unique Paths II',
                        url: 'https://leetcode.com/problems/unique-paths-ii/',
                    },
                    {
                        id: 'minimum-path-sum',
                        name: 'Minimum Path Sum',
                        url: 'https://leetcode.com/problems/minimum-path-sum/',
                    },
                    {
                        id: 'triangle',
                        name: 'Triangle',
                        url: 'https://leetcode.com/problems/triangle/',
                    },
                    {
                        id: 'maximal-square',
                        name: 'Maximal Square',
                        url: 'https://leetcode.com/problems/maximal-square/',
                    },
                    {
                        id: 'minimum-falling-path-sum',
                        name: 'Minimum Falling Path Sum',
                        url: 'https://leetcode.com/problems/minimum-falling-path-sum/',
                    },
                    {
                        id: 'count-square-submatrices-with-all-ones',
                        name: 'Count Square Submatrices with All Ones',
                        url: 'https://leetcode.com/problems/count-square-submatrices-with-all-ones/',
                    },
                ],
            },
            {
                name: 'DP - Interval DP',
                problems: [
                    {
                        id: 'burst-balloons',
                        name: 'Burst Balloons',
                        url: 'https://leetcode.com/problems/burst-balloons/',
                    },
                    {
                        id: 'remove-boxes',
                        name: 'Remove Boxes',
                        url: 'https://leetcode.com/problems/remove-boxes/',
                    },
                ],
            },
            {
                name: 'DP - Catalan Numbers',
                problems: [
                    {
                        id: 'unique-binary-search-trees-ii',
                        name: 'Unique Binary Search Trees II',
                        url: 'https://leetcode.com/problems/unique-binary-search-trees-ii/',
                    },
                    {
                        id: 'unique-binary-search-trees',
                        name: 'Unique Binary Search Trees',
                        url: 'https://leetcode.com/problems/unique-binary-search-trees/',
                    },
                    {
                        id: 'different-ways-to-add-parentheses',
                        name: 'Different Ways to Add Parentheses',
                        url: 'https://leetcode.com/problems/different-ways-to-add-parentheses/',
                    },
                ],
            },
            {
                name: 'DP - Longest Increasing Subsequence (LIS)',
                problems: [
                    {
                        id: 'longest-increasing-subsequence',
                        name: 'Longest Increasing Subsequence',
                        url: 'https://leetcode.com/problems/longest-increasing-subsequence/',
                    },
                    {
                        id: 'russian-doll-envelopes',
                        name: 'Russian Doll Envelopes',
                        url: 'https://leetcode.com/problems/russian-doll-envelopes/',
                    },
                    {
                        id: 'minimum-number-of-removals-to-make-mountain-array',
                        name: 'Minimum Number of Removals to Make Mountain Array',
                        url: 'https://leetcode.com/problems/minimum-number-of-removals-to-make-mountain-array/',
                    },
                    {
                        id: 'longest-increasing-subsequence-ii',
                        name: 'Longest Increasing Subsequence II',
                        url: 'https://leetcode.com/problems/longest-increasing-subsequence-ii/',
                    },
                ],
            },
            {
                name: 'DP - Stock problems',
                problems: [
                    {
                        id: 'best-time-to-buy-and-sell-stock',
                        name: 'Best Time to Buy and Sell Stock',
                        url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
                    },
                    {
                        id: 'best-time-to-buy-and-sell-stock-ii',
                        name: 'Best Time to Buy and Sell Stock II',
                        url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/',
                    },
                    {
                        id: 'best-time-to-buy-and-sell-stock-iii',
                        name: 'Best Time to Buy and Sell Stock III',
                        url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/',
                    },
                    {
                        id: 'best-time-to-buy-and-sell-stock-iv',
                        name: 'Best Time to Buy and Sell Stock IV',
                        url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/',
                    },
                    {
                        id: 'best-time-to-buy-and-sell-stock-with-cooldown',
                        name: 'Best Time to Buy and Sell Stock with Cooldown',
                        url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/',
                    },
                ],
            },
        ],
    },
    {
        id: 'greedy',
        title: 'Greedy Patterns',
        patterns: [
            {
                name: 'Greedy - Interval Merging/Scheduling',
                problems: [
                    {
                        id: 'merge-intervals',
                        name: 'Merge Intervals',
                        url: 'https://leetcode.com/problems/merge-intervals/',
                    },
                    {
                        id: 'insert-interval',
                        name: 'Insert Interval',
                        url: 'https://leetcode.com/problems/insert-interval/',
                    },
                    {
                        id: 'employee-free-time',
                        name: 'Employee Free Time',
                        url: 'https://leetcode.com/problems/employee-free-time/',
                    },
                    {
                        id: 'interval-list-intersections',
                        name: 'Interval List Intersections',
                        url: 'https://leetcode.com/problems/interval-list-intersections/',
                    },
                    {
                        id: 'divide-intervals-into-minimum-number-of-groups',
                        name: 'Divide Intervals Into Minimum Number of Groups',
                        url: 'https://leetcode.com/problems/divide-intervals-into-minimum-number-of-groups/',
                    },
                ],
            },
            {
                name: 'Greedy - Jump Game Reachability/Minimization',
                problems: [
                    {
                        id: 'jump-game-ii',
                        name: 'Jump Game II',
                        url: 'https://leetcode.com/problems/jump-game-ii/',
                    },
                    {
                        id: 'jump-game',
                        name: 'Jump Game',
                        url: 'https://leetcode.com/problems/jump-game/',
                    },
                ],
            },
            {
                name: 'Greedy - Buy/Sell Stock',
                problems: [
                    {
                        id: 'best-time-to-buy-and-sell-stock',
                        name: 'Best Time to Buy and Sell Stock',
                        url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
                    },
                    {
                        id: 'best-time-to-buy-and-sell-stock-ii',
                        name: 'Best Time to Buy and Sell Stock II',
                        url: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/',
                    },
                ],
            },
            {
                name: 'Greedy - Gas Station Circuit',
                problems: [
                    {
                        id: 'gas-station',
                        name: 'Gas Station',
                        url: 'https://leetcode.com/problems/gas-station/',
                    },
                    {
                        id: 'maximize-the-topmost-element-after-k-moves',
                        name: 'Maximize the Topmost Element After K Moves',
                        url: 'https://leetcode.com/problems/maximize-the-topmost-element-after-k-moves/',
                    },
                ],
            },
            {
                name: 'Greedy - Task Scheduling (Frequency Based)',
                problems: [
                    {
                        id: 'task-scheduler',
                        name: 'Task Scheduler',
                        url: 'https://leetcode.com/problems/task-scheduler/',
                    },
                    {
                        id: 'reorganize-string',
                        name: 'Reorganize String',
                        url: 'https://leetcode.com/problems/reorganize-string/',
                    },
                    {
                        id: 'distant-barcodes',
                        name: 'Distant Barcodes',
                        url: 'https://leetcode.com/problems/distant-barcodes/',
                    },
                ],
            },
            {
                name: 'Greedy - Sorting Based',
                problems: [
                    {
                        id: 'assign-cookies',
                        name: 'Assign Cookies',
                        url: 'https://leetcode.com/problems/assign-cookies/',
                    },
                    { id: 'candy', name: 'Candy', url: 'https://leetcode.com/problems/candy/' },
                    {
                        id: 'queue-reconstruction-by-height',
                        name: 'Queue Reconstruction by Height',
                        url: 'https://leetcode.com/problems/queue-reconstruction-by-height/',
                    },
                    {
                        id: 'two-city-scheduling',
                        name: 'Two City Scheduling',
                        url: 'https://leetcode.com/problems/two-city-scheduling/',
                    },
                ],
            },
        ],
    },
    {
        id: 'bit-manipulation',
        title: 'Bit Manipulation Patterns',
        patterns: [
            {
                name: 'Bitwise XOR - Finding Single/Missing Number',
                problems: [
                    {
                        id: 'single-number',
                        name: 'Single Number',
                        url: 'https://leetcode.com/problems/single-number/',
                    },
                    {
                        id: 'single-number-ii',
                        name: 'Single Number II',
                        url: 'https://leetcode.com/problems/single-number-ii/',
                    },
                    {
                        id: 'missing-number',
                        name: 'Missing Number',
                        url: 'https://leetcode.com/problems/missing-number/',
                    },
                    {
                        id: 'find-the-difference',
                        name: 'Find the Difference',
                        url: 'https://leetcode.com/problems/find-the-difference/',
                    },
                ],
            },
            {
                name: 'Bitwise AND - Counting Set Bits (Hamming Weight)',
                problems: [
                    {
                        id: 'number-of-1-bits',
                        name: 'Number of 1 Bits',
                        url: 'https://leetcode.com/problems/number-of-1-bits/',
                    },
                    {
                        id: 'power-of-two',
                        name: 'Power of Two',
                        url: 'https://leetcode.com/problems/power-of-two/',
                    },
                    {
                        id: 'total-hamming-distance',
                        name: 'Total Hamming Distance',
                        url: 'https://leetcode.com/problems/total-hamming-distance/',
                    },
                ],
            },
            {
                name: 'Bitwise DP - Counting Bits Optimization',
                problems: [
                    {
                        id: 'counting-bits',
                        name: 'Counting Bits',
                        url: 'https://leetcode.com/problems/counting-bits/',
                    },
                    {
                        id: 'parallel-courses-ii',
                        name: 'Parallel Courses II',
                        url: 'https://leetcode.com/problems/parallel-courses-ii/',
                    },
                    {
                        id: 'count-triplets-that-can-form-two-arrays-of-equal-xor',
                        name: 'Count Triplets That Can Form Two Arrays of Equal XOR',
                        url: 'https://leetcode.com/problems/count-triplets-that-can-form-two-arrays-of-equal-xor/',
                    },
                ],
            },
            {
                name: 'Bitwise Operations - Power of Two/Four Check',
                problems: [
                    {
                        id: 'power-of-two',
                        name: 'Power of Two',
                        url: 'https://leetcode.com/problems/power-of-two/',
                    },
                    {
                        id: 'power-of-four',
                        name: 'Power of Four',
                        url: 'https://leetcode.com/problems/power-of-four/',
                    },
                ],
            },
        ],
    },
    {
        id: 'string-manipulation',
        title: 'String Manipulation Patterns',
        patterns: [
            {
                name: 'String - Palindrome Check (Two Pointers / Reverse)',
                problems: [
                    {
                        id: 'palindrome-number',
                        name: 'Palindrome Number',
                        url: 'https://leetcode.com/problems/palindrome-number/',
                    },
                    {
                        id: 'valid-palindrome',
                        name: 'Valid Palindrome',
                        url: 'https://leetcode.com/problems/valid-palindrome/',
                    },
                    {
                        id: 'valid-palindrome-ii',
                        name: 'Valid Palindrome II',
                        url: 'https://leetcode.com/problems/valid-palindrome-ii/',
                    },
                ],
            },
            {
                name: 'String - Anagram Check (Frequency Count/Sort)',
                problems: [
                    {
                        id: 'group-anagrams',
                        name: 'Group Anagrams',
                        url: 'https://leetcode.com/problems/group-anagrams/',
                    },
                    {
                        id: 'valid-anagram',
                        name: 'Valid Anagram',
                        url: 'https://leetcode.com/problems/valid-anagram/',
                    },
                ],
            },
            {
                name: 'String - Roman to Integer Conversion',
                problems: [
                    {
                        id: 'roman-to-integer',
                        name: 'Roman to Integer',
                        url: 'https://leetcode.com/problems/roman-to-integer/',
                    },
                    {
                        id: 'integer-to-roman',
                        name: 'Integer to Roman',
                        url: 'https://leetcode.com/problems/integer-to-roman/',
                    },
                ],
            },
            {
                name: 'String - String to Integer (atoi)',
                problems: [
                    {
                        id: 'string-to-integer-atoi',
                        name: 'String to Integer (atoi)',
                        url: 'https://leetcode.com/problems/string-to-integer-atoi/',
                    },
                    {
                        id: 'valid-number',
                        name: 'Valid Number',
                        url: 'https://leetcode.com/problems/valid-number/',
                    },
                ],
            },
            {
                name: 'String - Multiply Strings (Manual Simulation)',
                problems: [
                    {
                        id: 'multiply-strings',
                        name: 'Multiply Strings',
                        url: 'https://leetcode.com/problems/multiply-strings/',
                    },
                    {
                        id: 'add-strings',
                        name: 'Add Strings',
                        url: 'https://leetcode.com/problems/add-strings/',
                    },
                    {
                        id: 'add-binary',
                        name: 'Add Binary',
                        url: 'https://leetcode.com/problems/add-binary/',
                    },
                ],
            },
            {
                name: 'String Matching - Naive / KMP / Rabin-Karp',
                problems: [
                    {
                        id: 'find-the-index-of-the-first-occurrence-in-a-string',
                        name: 'Find the Index of the First Occurrence in a String',
                        url: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/',
                    },
                    {
                        id: 'shortest-palindrome',
                        name: 'Shortest Palindrome',
                        url: 'https://leetcode.com/problems/shortest-palindrome/',
                    },
                    {
                        id: 'repeated-string-match',
                        name: 'Repeated String Match',
                        url: 'https://leetcode.com/problems/repeated-string-match/',
                    },
                    {
                        id: 'rotate-string',
                        name: 'Rotate String',
                        url: 'https://leetcode.com/problems/rotate-string/',
                    },
                    {
                        id: 'find-beautiful-indices-in-the-given-array-ii',
                        name: 'Find Beautiful Indices in the Given Array II',
                        url: 'https://leetcode.com/problems/find-beautiful-indices-in-the-given-array-ii/',
                    },
                ],
            },
            {
                name: 'String - Repeated Substring Pattern Detection',
                problems: [
                    {
                        id: 'repeated-substring-pattern',
                        name: 'Repeated Substring Pattern',
                        url: 'https://leetcode.com/problems/repeated-substring-pattern/',
                    },
                    {
                        id: 'find-the-index-of-the-first-occurrence-in-a-string',
                        name: 'Find the Index of the First Occurrence in a String',
                        url: 'https://leetcode.com/problems/find-the-index-of-the-first-occurrence-in-a-string/',
                    },
                    {
                        id: 'repeated-string-match',
                        name: 'Repeated String Match',
                        url: 'https://leetcode.com/problems/repeated-string-match/',
                    },
                ],
            },
        ],
    },
    {
        id: 'design',
        title: 'Design Patterns',
        patterns: [
            {
                name: 'Design (General/Specific)',
                problems: [
                    {
                        id: 'lru-cache',
                        name: 'LRU Cache',
                        url: 'https://leetcode.com/problems/lru-cache/',
                    },
                    {
                        id: 'min-stack',
                        name: 'Min Stack',
                        url: 'https://leetcode.com/problems/min-stack/',
                    },
                    {
                        id: 'implement-stack-using-queues',
                        name: 'Implement Stack using Queues',
                        url: 'https://leetcode.com/problems/implement-stack-using-queues/',
                    },
                    {
                        id: 'implement-queue-using-stacks',
                        name: 'Implement Queue using Stacks',
                        url: 'https://leetcode.com/problems/implement-queue-using-stacks/',
                    },
                    {
                        id: 'flatten-2d-vector',
                        name: 'Flatten 2D Vector',
                        url: 'https://leetcode.com/problems/flatten-2d-vector/',
                    },
                    {
                        id: 'encode-and-decode-strings',
                        name: 'Encode and Decode Strings',
                        url: 'https://leetcode.com/problems/encode-and-decode-strings/',
                    },
                    {
                        id: 'find-median-from-data-stream',
                        name: 'Find Median from Data Stream',
                        url: 'https://leetcode.com/problems/find-median-from-data-stream/',
                    },
                    {
                        id: 'flatten-nested-list-iterator',
                        name: 'Flatten Nested List Iterator',
                        url: 'https://leetcode.com/problems/flatten-nested-list-iterator/',
                    },
                    {
                        id: 'moving-average-from-data-stream',
                        name: 'Moving Average from Data Stream',
                        url: 'https://leetcode.com/problems/moving-average-from-data-stream/',
                    },
                    {
                        id: 'design-snake-game',
                        name: 'Design Snake Game',
                        url: 'https://leetcode.com/problems/design-snake-game/',
                    },
                    {
                        id: 'logger-rate-limiter',
                        name: 'Logger Rate Limiter',
                        url: 'https://leetcode.com/problems/logger-rate-limiter/',
                    },
                    {
                        id: 'design-hit-counter',
                        name: 'Design Hit Counter',
                        url: 'https://leetcode.com/problems/design-hit-counter/',
                    },
                    {
                        id: 'design-phone-directory',
                        name: 'Design Phone Directory',
                        url: 'https://leetcode.com/problems/design-phone-directory/',
                    },
                    {
                        id: 'insert-delete-getrandom-o1',
                        name: 'Insert Delete GetRandom O(1)',
                        url: 'https://leetcode.com/problems/insert-delete-getrandom-o1/',
                    },
                    {
                        id: 'all-oone-data-structure',
                        name: 'All O`one Data Structure',
                        url: 'https://leetcode.com/problems/all-oone-data-structure/',
                    },
                    {
                        id: 'lfu-cache',
                        name: 'LFU Cache',
                        url: 'https://leetcode.com/problems/lfu-cache/',
                    },
                    {
                        id: 'design-compressed-string-iterator',
                        name: 'Design Compressed String Iterator',
                        url: 'https://leetcode.com/problems/design-compressed-string-iterator/',
                    },
                    {
                        id: 'design-circular-queue',
                        name: 'Design Circular Queue',
                        url: 'https://leetcode.com/problems/design-circular-queue/',
                    },
                    {
                        id: 'design-circular-deque',
                        name: 'Design Circular Deque',
                        url: 'https://leetcode.com/problems/design-circular-deque/',
                    },
                    {
                        id: 'design-search-autocomplete-system',
                        name: 'Design Search Autocomplete System',
                        url: 'https://leetcode.com/problems/design-search-autocomplete-system/',
                    },
                    {
                        id: 'design-hashmap',
                        name: 'Design HashMap',
                        url: 'https://leetcode.com/problems/design-hashmap/',
                    },
                    {
                        id: 'range-module',
                        name: 'Range Module',
                        url: 'https://leetcode.com/problems/range-module/',
                    },
                    {
                        id: 'rle-iterator',
                        name: 'RLE Iterator',
                        url: 'https://leetcode.com/problems/rle-iterator/',
                    },
                    {
                        id: 'time-based-key-value-store',
                        name: 'Time Based Key-Value Store',
                        url: 'https://leetcode.com/problems/time-based-key-value-store/',
                    },
                    {
                        id: 'snapshot-array',
                        name: 'Snapshot Array',
                        url: 'https://leetcode.com/problems/snapshot-array/',
                    },
                    {
                        id: 'tweet-counts-per-frequency',
                        name: 'Tweet Counts Per Frequency',
                        url: 'https://leetcode.com/problems/tweet-counts-per-frequency/',
                    },
                    {
                        id: 'product-of-the-last-k-numbers',
                        name: 'Product of the Last K Numbers',
                        url: 'https://leetcode.com/problems/product-of-the-last-k-numbers/',
                    },
                    {
                        id: 'design-a-stack-with-increment-operation',
                        name: 'Design a Stack With Increment Operation',
                        url: 'https://leetcode.com/problems/design-a-stack-with-increment-operation/',
                    },
                    {
                        id: 'design-most-recently-used-queue',
                        name: 'Design Most Recently Used Queue',
                        url: 'https://leetcode.com/problems/design-most-recently-used-queue/',
                    },
                    {
                        id: 'detect-squares',
                        name: 'Detect Squares',
                        url: 'https://leetcode.com/problems/detect-squares/',
                    },
                    {
                        id: 'stock-price-fluctuation',
                        name: 'Stock Price Fluctuation',
                        url: 'https://leetcode.com/problems/stock-price-fluctuation/',
                    },
                    {
                        id: 'design-a-text-editor',
                        name: 'Design a Text Editor',
                        url: 'https://leetcode.com/problems/design-a-text-editor/',
                    },
                    {
                        id: 'smallest-number-in-infinite-set',
                        name: 'Smallest Number in Infinite Set',
                        url: 'https://leetcode.com/problems/smallest-number-in-infinite-set/',
                    },
                ],
            },
            {
                name: 'Tries',
                problems: [
                    {
                        id: 'implement-trie-prefix-tree',
                        name: 'Implement Trie (Prefix Tree)',
                        url: 'https://leetcode.com/problems/implement-trie-prefix-tree/',
                    },
                    {
                        id: 'design-add-and-search-words-data-structure',
                        name: 'Design Add and Search Words Data Structure',
                        url: 'https://leetcode.com/problems/design-add-and-search-words-data-structure/',
                    },
                    {
                        id: 'longest-word-in-dictionary',
                        name: 'Longest Word in Dictionary',
                        url: 'https://leetcode.com/problems/longest-word-in-dictionary/',
                    },
                    {
                        id: 'replace-words',
                        name: 'Replace Words',
                        url: 'https://leetcode.com/problems/replace-words/',
                    },
                    {
                        id: 'word-squares',
                        name: 'Word Squares',
                        url: 'https://leetcode.com/problems/word-squares/',
                    },
                    {
                        id: 'design-search-autocomplete-system',
                        name: 'Design Search Autocomplete System',
                        url: 'https://leetcode.com/problems/design-search-autocomplete-system/',
                    },
                    {
                        id: 'prefix-and-suffix-search',
                        name: 'Prefix and Suffix Search',
                        url: 'https://leetcode.com/problems/prefix-and-suffix-search/',
                    },
                ],
            },
        ],
    },
];
