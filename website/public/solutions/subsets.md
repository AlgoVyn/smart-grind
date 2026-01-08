# Subsets

## Problem Description
[Link to problem](https://leetcode.com/problems/subsets/)

Given an integer array nums of unique elements, return all possible subsets (the power set).
The solution set must not contain duplicate subsets. Return the solution in any order.
 
Example 1:

Input: nums = [1,2,3]
Output: [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]

Example 2:

Input: nums = [0]
Output: [[],[0]]

 
Constraints:

1 <= nums.length <= 10
-10 <= nums[i] <= 10
All the numbers of nums are unique.


## Solution

```python
from typing import List

class Solution:
    def subsets(self, nums: List[int]) -> List[List[int]]:
        result = []
        def backtrack(start, path):
            result.append(path[:])
            for i in range(start, len(nums)):
                path.append(nums[i])
                backtrack(i + 1, path)
                path.pop()
        backtrack(0, [])
        return result
```

## Explanation
To solve the subsets problem, we need to generate all possible subsets of the given array. This can be done using backtracking, which explores all combinations by deciding whether to include each element or not.

We initialize an empty result list to store all subsets. The backtrack function takes the current start index and the current path (the subset being built).

At each step in backtrack:
- We add a copy of the current path to the result, representing a valid subset.
- Then, for each element from the start index to the end of the array, we add the element to the path, recurse with the next index (i+1), and then remove the element (backtrack) to try other combinations.

This ensures all possible subsets are generated. Since the array has unique elements, there are no duplicate subsets.

Time Complexity: O(2^n), where n is the number of elements, as there are 2^n subsets, and each subset is copied to the result.

Space Complexity: O(2^n * n), for storing all subsets in the result list, and O(n) for the recursion stack.
