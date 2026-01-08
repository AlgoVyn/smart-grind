# Combinations

## Problem Description
[Link to problem](https://leetcode.com/problems/combinations/)

Given two integers n and k, return all possible combinations of k numbers chosen from the range [1, n].
You may return the answer in any order.
 
Example 1:

Input: n = 4, k = 2
Output: [[1,2],[1,3],[1,4],[2,3],[2,4],[3,4]]
Explanation: There are 4 choose 2 = 6 total combinations.
Note that combinations are unordered, i.e., [1,2] and [2,1] are considered to be the same combination.

Example 2:

Input: n = 1, k = 1
Output: [[1]]
Explanation: There is 1 choose 1 = 1 total combination.

 
Constraints:

1 <= n <= 20
1 <= k <= n


## Solution

```python
from typing import List

class Solution:
    def combine(self, n: int, k: int) -> List[List[int]]:
        result = []
        
        def backtrack(start, path):
            if len(path) == k:
                result.append(path[:])
                return
            for i in range(start, n + 1):
                path.append(i)
                backtrack(i + 1, path)
                path.pop()
        
        backtrack(1, [])
        return result
```

## Explanation
To generate all combinations of k numbers from 1 to n, we use backtracking.

We define a backtrack function that takes the current starting number and the current path. If the path length equals k, we add a copy of the path to the result.

Otherwise, we iterate from the start number to n, append each number to the path, recurse with the next start (i+1 to avoid duplicates), and backtrack by popping the number.

We start the backtracking from 1 with an empty path.

Time complexity: O(C(n, k) * k), where C(n, k) is the number of combinations, as we generate each combination and copy it. Space complexity: O(k) for the recursion stack and path, plus O(C(n, k) * k) for the result.
