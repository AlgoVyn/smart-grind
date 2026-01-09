# Different Ways To Add Parentheses

## Problem Description
Given a string expression of numbers and operators, return all possible results from computing all the different possible ways to group numbers and operators. You may return the answer in any order.
The test cases are generated such that the output values fit in a 32-bit integer and the number of different results does not exceed 104.
 
Example 1:

Input: expression = "2-1-1"
Output: [0,2]
Explanation:
((2-1)-1) = 0 
(2-(1-1)) = 2

Example 2:

Input: expression = "2*3-4*5"
Output: [-34,-14,-10,-10,10]
Explanation:
(2*(3-(4*5))) = -34 
((2*3)-(4*5)) = -14 
((2*(3-4))*5) = -10 
(2*((3-4)*5)) = -10 
(((2*3)-4)*5) = 10

 
Constraints:

1 <= expression.length <= 20
expression consists of digits and the operator '+', '-', and '*'.
All the integer values in the input expression are in the range [0, 99].
The integer values in the input expression do not have a leading '-' or '+' denoting the sign.
## Solution

```python
from typing import List
from functools import lru_cache

class Solution:
    def diffWaysToCompute(self, expression: str) -> List[int]:
        @lru_cache(None)
        def compute(expr):
            if expr.isdigit():
                return [int(expr)]
            res = []
            for i, char in enumerate(expr):
                if char in '+-*':
                    left = compute(expr[:i])
                    right = compute(expr[i+1:])
                    for l in left:
                        for r in right:
                            if char == '+':
                                res.append(l + r)
                            elif char == '-':
                                res.append(l - r)
                            elif char == '*':
                                res.append(l * r)
            return res
        return compute(expression)
```

## Explanation
The solution uses memoized recursion. For each operator in the expression, split into left and right subexpressions, compute all possible results for each, then combine them with the operator.

If the expression is a number, return it as a list.

Time complexity: Exponential but memoized, acceptable since n<=20.

Space complexity: O(n) for memo.
