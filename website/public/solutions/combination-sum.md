# Combination Sum

## Problem Description
Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order.
The same number may be chosen from candidates an unlimited number of times. Two combinations are unique if the frequency of at least one of the chosen numbers is different.
The test cases are generated such that the number of unique combinations that sum up to target is less than 150 combinations for the given input.

---

## Examples

**Example 1:**

**Input:**
```python
candidates = [2,3,6,7], target = 7
```

**Output:**
```python
[[2,2,3],[7]]
```

**Explanation:**
2 and 3 are candidates, and 2 + 2 + 3 = 7. Note that 2 can be used multiple times.
7 is a candidate, and 7 = 7.
These are the only two combinations.

**Example 2:**

**Input:**
```python
candidates = [2,3,5], target = 8
```

**Output:**
```python
[[2,2,2,2],[2,3,3],[3,5]]
```

**Example 3:**

**Input:**
```python
candidates = [2], target = 1
```

**Output:**
```python
[]
```

---

## Constraints

- `1 <= candidates.length <= 30`
- `2 <= candidates[i] <= 40`
- All elements of candidates are distinct.
- `1 <= target <= 40`

---

## Solution

```python
from typing import List

class Solution:
    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:
        candidates.sort()
        result = []
        
        def backtrack(start, path, current_sum):
            if current_sum == target:
                result.append(path[:])
                return
            if current_sum > target:
                return
            for i in range(start, len(candidates)):
                path.append(candidates[i])
                backtrack(i, path, current_sum + candidates[i])
                path.pop()
        
        backtrack(0, [], 0)
        return result
```

---

## Explanation
To find all unique combinations of candidates that sum to target, where each candidate can be used unlimited times, we use backtracking.

We sort the candidates for potential optimization, though not strictly necessary here. In the backtrack function, if the current sum equals target, we add the path to result. If greater, we return.

Otherwise, we iterate from the start index, append the candidate, recurse with the same index (to allow reuse), and backtrack.

This ensures combinations are unique based on frequencies, and order doesn't matter since we sort implicitly through the process.

---

## Time Complexity
Exponential, but constrained by small inputs (candidates <= 30, target <= 40, <150 combinations).

---

## Space Complexity
**O(target)** for the recursion stack and path.
