# Combination Sum Ii

## Problem Description
Given a collection of candidate numbers (candidates) and a target number (target), find all unique combinations in candidates where the candidate numbers sum to target.
Each number in candidates may only be used once in the combination.
Note: The solution set must not contain duplicate combinations.

---

## Examples

**Example 1:**

**Input:**
```python
candidates = [10,1,2,7,6,1,5], target = 8
```

**Output:**
```python
[
[1,1,6],
[1,2,5],
[1,7],
[2,6]
]
```

**Example 2:**

**Input:**
```python
candidates = [2,5,2,1,2], target = 5
```

**Output:**
```python
[
[1,2,2],
[5]
]
```

---

## Constraints

- `1 <= candidates.length <= 100`
- `1 <= candidates[i] <= 50`
- `1 <= target <= 30`

---

## Solution

```python
from typing import List

class Solution:
    def combinationSum2(self, candidates: List[int], target: int) -> List[List[int]]:
        candidates.sort()
        result = []
        
        def backtrack(start, path, current_sum):
            if current_sum == target:
                result.append(path[:])
                return
            if current_sum > target:
                return
            for i in range(start, len(candidates)):
                if i > start and candidates[i] == candidates[i - 1]:
                    continue
                path.append(candidates[i])
                backtrack(i + 1, path, current_sum + candidates[i])
                path.pop()
        
        backtrack(0, [], 0)
        return result
```

---

## Explanation
To find all unique combinations of candidates that sum to target, where each candidate is used at most once and there are no duplicate combinations, we sort the candidates and use backtracking with pruning for duplicates.

We sort the candidates to handle duplicates easily. In the backtrack function, if the current sum equals target, we add the path to result. If greater, we return. Otherwise, we iterate from the start index, skipping duplicates by checking if the current candidate is the same as the previous one and i > start.

For each valid candidate, we append it to the path, recurse with the next index and updated sum, then backtrack.

---

## Time Complexity
Exponential in the worst case, but constrained by small input sizes (candidates <= 100, target <= 30).

---

## Space Complexity
**O(target)** for the recursion stack and path.
