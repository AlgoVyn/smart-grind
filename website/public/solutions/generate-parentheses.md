# Generate Parentheses

## Problem Description
Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.
 
Example 1:
Input: n = 3
Output: ["((()))","(()())","(())()","()(())","()()()"]
Example 2:
Input: n = 1
Output: ["()"]

 
Constraints:

1 <= n <= 8
## Solution

```python
from typing import List

class Solution:
    def generateParenthesis(self, n: int) -> List[str]:
        res = []
        def backtrack(s, left, right):
            if len(s) == 2 * n:
                res.append(s)
                return
            if left < n:
                backtrack(s + '(', left + 1, right)
            if right < left:
                backtrack(s + ')', left, right + 1)
        backtrack('', 0, 0)
        return res
```

## Explanation
This problem requires generating all combinations of well-formed parentheses for n pairs.

Use backtracking: start with empty string, track number of open and close parentheses used.

At each step, add '(' if open < n, add ')' if close < open.

When string length reaches 2n, add to result.

This ensures all combinations are valid.

**Time Complexity:** O(4^n / sqrt(n)), the number of valid parentheses sequences (Catalan number).

**Space Complexity:** O(4^n / sqrt(n)) for the result list, O(n) for the recursion stack.
