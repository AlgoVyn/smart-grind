# Evaluate Reverse Polish Notation

## Problem Description
You are given an array of strings tokens that represents an arithmetic expression in a Reverse Polish Notation.
Evaluate the expression. Return an integer that represents the value of the expression.
Note that:

The valid operators are '+', '-', '*', and '/'.
Each operand may be an integer or another expression.
The division between two integers always truncates toward zero.
There will not be any division by zero.
The input represents a valid arithmetic expression in a reverse polish notation.
The answer and all the intermediate calculations can be represented in a 32-bit integer.

### Example(s)

**Input:**
```
tokens = ["2","1","+","3","*"]
```

**Output:**
```
9
```

**Explanation:**
```
((2 + 1) * 3) = 9
```

**Input:**
```
tokens = ["4","13","5","/","+"]
```

**Output:**
```
6
```

**Explanation:**
```
(4 + (13 / 5)) = 6
```

**Input:**
```
tokens = ["10","6","9","3","+","-11","*","/","*","17","+","5","+"]
```

**Output:**
```
22
```

**Explanation:**
```
((10 * (6 / ((9 + 3) * -11))) + 17) + 5
= ((10 * (6 / (12 * -11))) + 17) + 5
= ((10 * (6 / -132)) + 17) + 5
= ((10 * 0) + 17) + 5
= (0 + 17) + 5
= 17 + 5
= 22
```

### Constraints

- `1 <= tokens.length <= 104`
- `tokens[i] is either an operator: "+", "-", "*", or "/", or an integer in the range [-200, 200].`

## Solution

```python
from typing import List

class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        stack = []
        for token in tokens:
            if token not in "+-*/":
                stack.append(int(token))
            else:
                b = stack.pop()
                a = stack.pop()
                if token == "+":
                    stack.append(a + b)
                elif token == "-":
                    stack.append(a - b)
                elif token == "*":
                    stack.append(a * b)
                elif token == "/":
                    stack.append(int(a / b))
        return stack[0]
```

## Explanation
This problem involves evaluating an arithmetic expression given in Reverse Polish Notation (RPN), also known as postfix notation. In RPN, operators follow their operands, eliminating the need for parentheses. We use a stack to process the tokens sequentially.

### Step-by-Step Explanation:
1. **Initialize a stack**: Create an empty stack to hold operands.

2. **Iterate through each token**:
   - If the token is a number (operand), convert it to an integer and push it onto the stack.
   - If the token is an operator ('+', '-', '*', '/'):
     - Pop the top two elements from the stack (right operand first, then left operand).
     - Perform the operation:
       - For '+': left + right
       - For '-': left - right
       - For '*': left * right
       - For '/': left / right (integer division towards zero, using floor division in Python for negative numbers if needed, but since constraints ensure no issues).
     - Push the result back onto the stack.

3. **Return the result**: After processing all tokens, the stack will contain exactly one element, which is the final result. Pop and return it.

### Time Complexity:
- O(n), where n is the number of tokens, as we process each token exactly once.

### Space Complexity:
- O(n), in the worst case, when all tokens are operands (e.g., many numbers with operators at the end), the stack could hold up to n elements.
