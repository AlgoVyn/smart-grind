# Basic Calculator

## Problem Description

Given a string `s` representing a valid expression, implement a basic calculator to evaluate it, and return the result of the evaluation.

**Note:** You are not allowed to use any built-in function which evaluates strings as mathematical expressions, such as `eval()`.

## Examples

**Example 1:**

**Input:**
```python
s = "1 + 1"
```

**Output:**
```
2
```

**Example 2:**

**Input:**
```python
s = " 2-1 + 2 "
```

**Output:**
```
3
```

**Example 3:**

**Input:**
```python
s = "(1+(4+5+2)-3)+(6+8)"
```

**Output:**
```
23
```

## Constraints

- `1 <= s.length <= 3 * 105`
- `s` consists of digits, '+', '-', '(', ')', and ' '.
- `s` represents a valid expression.
- '+' is not used as a unary operation (i.e., "+1" and "+(2 + 3)" is invalid).
- '-' could be used as a unary operation (i.e., "-1" and "-(2 + 3)" is valid).
- There will be no two consecutive operators in the input.
- Every number and running calculation will fit in a signed 32-bit integer.

## Solution

```python
class Solution:
    def calculate(self, s: str) -> int:
        stack = []
        result = 0
        num = 0
        sign = 1  # 1 for +, -1 for -

        i = 0
        while i < len(s):
            if s[i].isdigit():
                num = 0
                while i < len(s) and s[i].isdigit():
                    num = num * 10 + int(s[i])
                    i += 1
                result += sign * num
                continue
            elif s[i] == '+':
                sign = 1
            elif s[i] == '-':
                sign = -1
            elif s[i] == '(':
                stack.append(result)
                stack.append(sign)
                result = 0
                sign = 1
            elif s[i] == ')':
                result *= stack.pop()  # sign
                result += stack.pop()  # previous result
            i += 1

        return result
```

## Explanation

To evaluate the basic calculator expression, we use a stack-based approach to handle parentheses and maintain the current result and sign.

We initialize variables: `result` to accumulate the current sum, `num` for the current number, `sign` for the current operation (+ or -), and a stack to store intermediate results and signs when encountering parentheses.

We iterate through each character in the string:
- If it's a digit, we parse the full number and add it to the result with the current sign.
- If it's '+' or '-', we update the sign.
- If it's '(', we push the current result and sign onto the stack, reset result to 0, and set sign to 1.
- If it's ')', we multiply the current result by the sign from the stack (pop), then add the previous result from the stack (pop).

This handles nested expressions correctly. Spaces are ignored as they are not processed.

## Time Complexity
**O(N)** where N is the length of the string, as we process each character once.

## Space Complexity
**O(N)** in the worst case due to the stack for deeply nested parentheses.
