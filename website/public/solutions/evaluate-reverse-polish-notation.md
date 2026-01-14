## Evaluate Reverse Polish Notation

### Problem Statement

You are given an array of strings `tokens` that represents an arithmetic expression in Reverse Polish Notation (RPN, also known as postfix notation). Your task is to evaluate the expression and return an integer that represents the value of the expression.

- **Input**: An array of strings `tokens`.
- **Output**: An integer representing the evaluated value.
- **Key Details**:
  - Valid operators are "+", "-", "*", and "/".
  - Each operand is an integer or another expression.
  - Division between two integers truncates toward zero (e.g., 13 / 5 = 2, -13 / 5 = -2).
  - No division by zero.
  - The input is always a valid RPN expression.
  - All intermediate calculations and the final answer fit in a 32-bit integer.

**Constraints**:
- 1 ≤ tokens.length ≤ 10⁴
- tokens[i] is either an operator ("+", "-", "*", "/") or an integer in [-200, 200].

### Examples

**Example 1**:
```
Input: tokens = ["2", "1", "+", "3", "*"]
Output: 9
Explanation: ((2 + 1) * 3) = 9
```

**Example 2**:
```
Input: tokens = ["4", "13", "5", "/", "+"]
Output: 6
Explanation: (4 + (13 / 5)) = 6
```

**Example 3**:
```
Input: tokens = ["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]
Output: 22
Explanation: Step-by-step evaluation yields 22, as shown in the problem.
```

### Intuition

Reverse Polish Notation places operators after their operands, eliminating the need for parentheses and operator precedence rules. For example, the infix expression "(2 + 1) * 3" becomes "2 1 + 3 *" in RPN.

The key insight is to use a stack to process the tokens sequentially:
- When you encounter an operand (number), push it onto the stack.
- When you encounter an operator, pop the top two elements (the second popped is the left operand, the first popped is the right operand), apply the operation, and push the result back.
- At the end, the stack contains a single value: the result.

This works because RPN ensures operands are available before operators. The stack naturally handles the last-in-first-out order needed for nested operations.

### Approach 1: Stack with If-Else Chain
Use a list as a stack. Iterate through each token. If it's a number, convert it to an integer and push it. If it's an operator, pop two values, perform the operation (handling division carefully for truncation), and push the result.

**Python Code**:
```python
def evalRPN(tokens):
    stack = []
    for t in tokens:
        if t not in {"+", "-", "*", "/"}:
            stack.append(int(t))
        else:
            b = stack.pop()
            a = stack.pop()
            if t == "+":
                stack.append(a + b)
            elif t == "-":
                stack.append(a - b)
            elif t == "*":
                stack.append(a * b)
            else:
                # Truncate toward zero for division
                stack.append(int(a / b))
    return stack[0]
```

- **Time Complexity**: O(n), where n is the length of tokens, as we process each token once.
- **Space Complexity**: O(n), in the worst case when the stack holds all operands (e.g., all numbers before operators).

### Approach 2: Stack with Operator Dictionary
Similar to Approach 1, but use a dictionary to map operators to lambda functions for cleaner code. This avoids the if-else chain.

**Python Code**:
```python
def evalRPN(tokens):
    stack = []
    operators = {
        "+": lambda a, b: a + b,
        "-": lambda a, b: a - b,
        "*": lambda a, b: a * b,
        "/": lambda a, b: int(a / b)  # Truncate toward zero
    }
    for t in tokens:
        if t in operators:
            b = stack.pop()
            a = stack.pop()
            stack.append(operators[t](a, b))
        else:
            stack.append(int(t))
    return stack[0]
```

- **Time Complexity**: O(n), same as above.
- **Space Complexity**: O(n), same as above.

Both approaches are efficient and optimal for the constraints. Approach 2 is slightly more elegant and extensible if more operators are added.

### Approach 3: Recursion
We can evaluate Reverse Polish Notation (RPN) using recursion, though it's not the most practical approach for large inputs due to potential recursion depth limits in languages like Python (default limit is around 1000, and with n up to 10^4, it could cause a stack overflow in worst-case scenarios). The iterative stack-based method is preferred for efficiency and safety, but recursion works by leveraging the call stack to mimic the operand stack implicitly.

#### Intuition for Recursive Approach
In RPN, the expression is postfix, so operators follow their operands. By processing the tokens from the end (popping the last token first):
- If the token is a number, return it as the base case.
- If it's an operator, recursively evaluate the right operand first (next pop), then the left operand (subsequent pop), apply the operation, and return the result.
This order naturally matches the postfix structure because popping from the end encounters the operator before its operands in reverse.

The recursion builds an implicit expression tree, where each operator call evaluates its sub-expressions recursively.

#### Recursive Approach with Code
We'll modify the tokens list in place by popping from the end (O(1) operation in Python lists). This avoids passing indices or copying the list.

**Python Code**:
```python
def evalRPN(tokens):
    def helper():
        if not tokens:
            raise ValueError("Invalid RPN expression")
        
        token = tokens.pop()  # Pop from the end
        if token in {"+", "-", "*", "/"}:
            right = helper()  # Recurse for right operand first
            left = helper()   # Then left operand
            if token == "+":
                return left + right
            elif token == "-":
                return left - right
            elif token == "*":
                return left * right
            else:
                # Truncate toward zero for division
                return int(left / right)  # Handles negative correctly in Python 3
        else:
            return int(token)
    
    return helper()
```

- **How it works with Example 1** (`["2", "1", "+", "3", "*"]`):
  - Pop "*": operator → recurse right: pop "3" → return 3
  - Recurse left: now tokens `["2", "1", "+"]` → pop "+": operator → recurse right: pop "1" → return 1
  - Recurse left: pop "2" → return 2
  - Compute 2 + 1 = 3 (left for "*")
  - Compute 3 * 3 = 9

This correctly evaluates the expression. You could also use a dictionary for operators (like in the earlier iterative Approach 2) inside the helper for cleaner code.

#### Time and Space Complexity
- **Time Complexity**: O(n), as each token is processed exactly once (popped and evaluated).
- **Space Complexity**: O(n) in the worst case due to recursion depth. For balanced expressions, it's O(log n), but for skewed ones (e.g., a long chain like "1 2 + 3 + 4 + ..."), it can reach O(n), risking stack overflow for large n.

#### Pros and Cons
- **Pros**: Elegant and concise; demonstrates how recursion can simulate a stack. Useful for understanding expression trees or postfix evaluation in functional programming.
- **Cons**: Risk of recursion depth exceeded (e.g., Python's `sys.getrecursionlimit()` is 1000 by default—use `sys.setrecursionlimit(10**5)` as a hack, but it's unsafe and not allowed in LeetCode). Iterative is better for production or large inputs.

### Related Problems
- [Basic Calculator](https://leetcode.com/problems/basic-calculator/) (Hard): Evaluates infix expressions with parentheses.
- [Expression Add Operators](https://leetcode.com/problems/expression-add-operators/) (Hard): Adds operators to a string to reach a target value.
- Other similar problems include:
  - [Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii/): Handles infix without parentheses.
  - [Polish Notation Conversion](https://leetcode.com/problems/convert-to-reverse-polish-notation/) (not exact, but related to infix-to-postfix).

### Video Tutorial Links
Here are some helpful video explanations:
- [Evaluate Reverse Polish Notation - Leetcode 150 - Python](https://www.youtube.com/watch?v=iu0082c4HDE): A detailed walkthrough with drawings and code.
- [Evaluate Reverse Polish Notation (RPN) - Leetcode 150](https://www.youtube.com/watch?v=ffgmKxRqiMc): Multi-language solutions (Python, Java, etc.).
- [HOW TO Evaluate Reverse Polish Notation - Leetcode 150](https://www.youtube.com/watch?v=rJWrh7Xicec): Step-by-step evaluation guide.
- [Leetcode 150 Evaluate Reverse Polish Notation (Java)](https://www.youtube.com/watch?v=MwQ9hMqaeyw): Java-focused explanation.
- [150. Evaluate Reverse Polish Notation | Stack](https://www.youtube.com/watch?v=-nAxVvlxsGU): Part of a DSA series with stack emphasis.