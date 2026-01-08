# Basic Calculator Iii

## Problem Description
[Link to problem](https://leetcode.com/problems/basic-calculator-iii/)

## Solution

```python
class Solution:
    def calculate(self, s: str) -> int:
        def compute(op, a, b):
            if op == '+':
                return a + b
            elif op == '-':
                return a - b
            elif op == '*':
                return a * b
            elif op == '/':
                return a // b  # integer division towards zero
        
        stack = []
        num = 0
        op = '+'
        i = 0
        while i < len(s):
            if s[i].isdigit():
                num = num * 10 + int(s[i])
            elif s[i] in '+-*/':
                self.apply_op(stack, op, num)
                op = s[i]
                num = 0
            elif s[i] == '(':
                # find matching )
                count = 1
                j = i + 1
                while j < len(s) and count > 0:
                    if s[j] == '(':
                        count += 1
                    elif s[j] == ')':
                        count -= 1
                    j += 1
                sub = self.calculate(s[i+1:j-1])
                num = sub
                i = j - 1
            i += 1
        self.apply_op(stack, op, num)
        return sum(stack)
    
    def apply_op(self, stack, op, num):
        if op == '+':
            stack.append(num)
        elif op == '-':
            stack.append(-num)
        elif op == '*':
            stack[-1] *= num
        elif op == '/':
            stack[-1] = stack[-1] // num
```

## Explanation

This problem requires evaluating a string expression with basic arithmetic operations and parentheses, handling operator precedence.

We use a stack to store intermediate results. Iterate through the string, building numbers. When encountering an operator, apply the previous operator to the current number and push to stack. For parentheses, recursively evaluate the subexpression.

The apply_op method handles the operations: for + and -, push the number with appropriate sign; for * and /, modify the last element in the stack.

Finally, sum the stack for the result.

Time complexity is O(N) as we process each character once. Space complexity is O(N) due to the stack and recursion.

This approach correctly handles precedence and parentheses.
