# Subsets Ii

## Problem Description
[Link to problem](https://leetcode.com/problems/subsets-ii/)

Given an integer array nums that may contain duplicates, return all possible subsets (the power set).
The solution set must not contain duplicate subsets. Return the solution in any order.
 
Example 1:
Input: nums = [1,2,2]
Output: [[],[1],[1,2],[1,2,2],[2],[2,2]]
Example 2:
Input: nums = [0]
Output: [[],[0]]

 
Constraints:

1 <= nums.length <= 10
-10 <= nums[i] <= 10


## Solution

```python
from typing import List

def subsetsWithDup(nums: List[int]) -> List[List[int]]:
    nums.sort()
    result = []

    def backtrack(start: int, path: List[int]):
        result.append(path[:])
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i - 1]:
                continue
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()

    backtrack(0, [])
    return result
```

## Explanation
To generate all unique subsets from nums with duplicates, use backtracking with sorting.

1. Sort nums to group duplicates together.
2. Use backtrack function: add current path to result, then for each i from start to end:
   - If i > start and nums[i] == nums[i-1], skip to avoid duplicates.
   - Append nums[i] to path, recurse with i+1, then pop.
3. Start backtrack with start=0, empty path.

This ensures no duplicate subsets.

**Time Complexity:** O(2^n * n), 2^n subsets, each up to n size.
**Space Complexity:** O(2^n * n), for result, plus O(n) recursion.
