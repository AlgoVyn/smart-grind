# Basic Calculator Ii

## Problem Description

Given a string `s` which represents an expression, evaluate this expression and return its value. The integer division should truncate toward zero.

You may assume that the given expression is always valid. All intermediate results will be in the range of `[-231, 231 - 1]`.

**Note:** You are not allowed to use any built-in function which evaluates strings as mathematical expressions, such as `eval()`.

## Examples

**Example 1:**

**Input:**
```python
s = "3+2*2"
```

**Output:**
```
7
```

**Example 2:**

**Input:**
```python
s = " 3/2 "
```

**Output:**
```
1
```

**Example 3:**

**Input:**
```python
s = " 3+5 / 2 "
```

**Output:**
```
5
```

## Constraints

- `1 <= s.length <= 3 * 105`
- `s` consists of integers and operators ('+', '-', '*', '/') separated by some number of spaces.
- `s` represents a valid expression.
- All the integers in the expression are non-negative integers in the range `[0, 231 - 1]`.
- The answer is guaranteed to fit in a 32-bit integer.

## Solution

```python
class Solution:
    def calculate(self, s: str) -> int:
        stack = []
        num = 0
        op = '+'
        for i in range(len(s)):
            if s[i].isdigit():
                num = num * 10 + int(s[i])
            if (not s[i].isdigit() and s[i] != ' ') or i == len(s) - 1:
                if op == '+':
                    stack.append(num)
                elif op == '-':
                    stack.append(-num)
                elif op == '*':
                    stack[-1] *= num
                elif op == '/':
                    stack[-1] = int(stack[-1] / num)  # integer division towards zero
                op = s[i]
                num = 0
        return sum(stack)
```

## Explanation

This problem evaluates a string expression with basic arithmetic operations (+, -, *, /) without parentheses, handling operator precedence.

We use a stack to store intermediate results. Iterate through the string, building multi-digit numbers. When encountering an operator or reaching the end, apply the previous operator:

- For + and -, push the number with the appropriate sign to the stack.
- For * and /, modify the last element in the stack by multiplying or dividing by the current number.

Finally, sum all elements in the stack for the result.

## Time Complexity
**O(N)** as we process each character once.

## Space Complexity
**O(N)** in the worst case for the stack.

This approach correctly handles precedence by evaluating * and / immediately while deferring + and -.
