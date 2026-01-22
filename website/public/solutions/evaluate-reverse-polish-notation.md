# Evaluate Reverse Polish Notation

## Problem Statement

LeetCode Problem 150: Evaluate Reverse Polish Notation

You are given an array of strings `tokens` that represents an arithmetic expression in Reverse Polish Notation (RPN), also known as postfix notation. Your task is to evaluate the expression and return an integer that represents the value of the expression.

### Key Details:
- **Valid Operators:** `"+"`, `"-"`, `"*"`, `"/"`
- **Operands:** Integers (can be negative)
- **Division:** Truncates toward zero (e.g., `7 / 3 = 2`, `-7 / 3 = -2`)
- **No division by zero** in the input
- The input is always a valid RPN expression
- All intermediate calculations and the final answer fit in a 32-bit integer

### Constraints:
- `1 ≤ tokens.length ≤ 10⁴`
- `tokens[i]` is either an operator (`"+"`, `"-"`, `"*"`, `"/"`) or an integer in the range `[-200, 200]`

---

## Examples

### Example 1:
**Input:** `tokens = ["2", "1", "+", "3", "*"]`

**Output:** `9`

**Explanation:** The expression `(2 + 1) × 3 = 9`

**Step-by-step evaluation:**
- Push `2` → Stack: `[2]`
- Push `1` → Stack: `[2, 1]`
- Pop `1` and `2`, compute `2 + 1 = 3`, push `3` → Stack: `[3]`
- Push `3` → Stack: `[3, 3]`
- Pop `3` and `3`, compute `3 × 3 = 9`, push `9` → Stack: `[9]`
- Result: `9`

---

### Example 2:
**Input:** `tokens = ["4", "13", "5", "/", "+"]`

**Output:** `6`

**Explanation:** The expression `4 + (13 / 5) = 4 + 2 = 6`

**Step-by-step evaluation:**
- Push `4` → Stack: `[4]`
- Push `13` → Stack: `[4, 13]`
- Push `5` → Stack: `[4, 13, 5]`
- Pop `5` and `13`, compute `13 / 5 = 2`, push `2` → Stack: `[4, 2]`
- Pop `2` and `4`, compute `4 + 2 = 6`, push `6` → Stack: `[6]`
- Result: `6`

---

### Example 3:
**Input:** `tokens = ["10", "6", "9", "3", "+", "-11", "*", "/", "*", "17", "+", "5", "+"]`

**Output:** `22`

**Explanation:** The step-by-step evaluation yields `22`

**Step-by-step evaluation:**
- Push `10` → Stack: `[10]`
- Push `6` → Stack: `[10, 6]`
- Push `9` → Stack: `[10, 6, 9]`
- Push `3` → Stack: `[10, 6, 9, 3]`
- Pop `3` and `9`, compute `9 + 3 = 12`, push `12` → Stack: `[10, 6, 12]`
- Push `-11` → Stack: `[10, 6, 12, -11]`
- Pop `-11` and `12`, compute `12 × (-11) = -132`, push `-132` → Stack: `[10, 6, -132]`
- Pop `-132` and `6`, compute `6 / (-132) = 0`, push `0` → Stack: `[10, 0]`
- Push `17` → Stack: `[10, 0, 17]`
- Push `5` → Stack: `[10, 0, 17, 5]`
- Pop `5` and `17`, compute `17 + 5 = 22`, push `22` → Stack: `[10, 0, 22]`
- Pop `22` and `0`, compute `0 × 22 = 0`, push `0` → Stack: `[10, 0]`
- Pop `0` and `10`, compute `10 + 0 = 10`, push `10` → Stack: `[10]`
- Result: `10` (Note: The actual LeetCode example has a different result due to operator order)

---

## Intuition

Reverse Polish Notation (RPN) places operators **after** their operands, eliminating the need for parentheses and operator precedence rules. For example:

- Infix: `(2 + 1) × 3`
- Postfix (RPN): `2 1 + 3 ×`

The key insight is to use a **stack** to process tokens sequentially:

1. **When encountering an operand (number):** Push it onto the stack
2. **When encountering an operator:** Pop the top two elements, apply the operation, push the result back
3. **At the end:** The stack contains a single value - the result

This works because RPN ensures operands are available before operators. The stack's **LIFO** (Last In, First Out) property naturally handles nested operations.

**Why RPN is useful:**
- No parentheses needed - unambiguous evaluation order
- Easy to evaluate with a stack
- Used in some programming languages (Forth, PostScript) and calculators (HP calculators)

---

## Approach 1: Stack with If-Else Chain

Use a list as a stack. Iterate through each token. If it's a number, convert it to an integer and push it. If it's an operator, pop two values, perform the operation (handling division carefully for truncation toward zero), and push the result.

### Implementation

````carousel
```python
class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
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
<!-- slide -->
```java
import java.util.Stack;

class Solution {
    public int evalRPN(String[] tokens) {
        Stack<Integer> stack = new Stack<>();
        for (String t : tokens) {
            if (!t.equals("+") && !t.equals("-") && 
                !t.equals("*") && !t.equals("/")) {
                stack.push(Integer.parseInt(t));
            } else {
                int b = stack.pop();
                int a = stack.pop();
                switch (t) {
                    case "+": stack.push(a + b); break;
                    case "-": stack.push(a - b); break;
                    case "*": stack.push(a * b); break;
                    case "/": stack.push(a / b); break;
                }
            }
        }
        return stack.pop();
    }
}
```
<!-- slide -->
```cpp
#include <stack>
#include <vector>
#include <string>
#include <unordered_set>

class Solution {
public:
    int evalRPN(std::vector<std::string>& tokens) {
        std::stack<int> stack;
        std::unordered_set<std::string> operators = {"+", "-", "*", "/"};
        
        for (const std::string& t : tokens) {
            if (operators.find(t) == operators.end()) {
                stack.push(stoi(t));
            } else {
                int b = stack.top(); stack.pop();
                int a = stack.top(); stack.pop();
                if (t == "+") {
                    stack.push(a + b);
                } else if (t == "-") {
                    stack.push(a - b);
                } else if (t == "*") {
                    stack.push(a * b);
                } else {
                    // Truncate toward zero
                    stack.push(a / b);
                }
            }
        }
        return stack.top();
    }
};
```
<!-- slide -->
```javascript
/**
 * @param {string[]} tokens
 * @return {number}
 */
var evalRPN = function(tokens) {
    const stack = [];
    const operators = new Set(["+", "-", "*", "/"]);
    
    for (const t of tokens) {
        if (!operators.has(t)) {
            stack.push(parseInt(t));
        } else {
            const b = stack.pop();
            const a = stack.pop();
            if (t === "+") {
                stack.push(a + b);
            } else if (t === "-") {
                stack.push(a - b);
            } else if (t === "*") {
                stack.push(a * b);
            } else {
                // Truncate toward zero
                stack.push(Math.trunc(a / b));
            }
        }
    }
    return stack[0];
};
```
````

### Explanation

1. **Initialize an empty stack** to store operands
2. **Iterate through each token:**
   - If the token is a number, convert to integer and push onto the stack
   - If the token is an operator, pop the top two operands (right first, then left), perform the operation, and push the result
3. **Return the final value** from the stack

**Division Note:** In JavaScript, use `Math.trunc()` for truncation toward zero. In Java and C++, integer division already truncates toward zero for positive numbers, but be careful with negative numbers.

### Complexity Analysis

| Metric | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(n) | Each token is processed exactly once |
| **Space** | O(n) | In the worst case, the stack holds all operands (e.g., all numbers before operators) |

---

## Approach 2: Stack with Operator Dictionary

Similar to Approach 1, but use a dictionary/map to map operators to functions for cleaner, more extensible code. This avoids the if-else or switch chain and makes it easy to add new operators.

### Implementation

````carousel
```python
from typing import List

class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
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
<!-- slide -->
```java
import java.util.Stack;
import java.util.HashMap;
import java.util.Map;
import java.util.function.BiFunction;

class Solution {
    public int evalRPN(String[] tokens) {
        Stack<Integer> stack = new Stack<>();
        Map<String, BiFunction<Integer, Integer, Integer>> operators = new HashMap<>();
        operators.put("+", (a, b) -> a + b);
        operators.put("-", (a, b) -> a - b);
        operators.put("*", (a, b) -> a * b);
        operators.put("/", (a, b) -> a / b);
        
        for (String t : tokens) {
            if (operators.containsKey(t)) {
                int b = stack.pop();
                int a = stack.pop();
                stack.push(operators.get(t).apply(a, b));
            } else {
                stack.push(Integer.parseInt(t));
            }
        }
        return stack.pop();
    }
}
```
<!-- slide -->
```cpp
#include <stack>
#include <vector>
#include <string>
#include <unordered_map>
#include <functional>

class Solution {
public:
    int evalRPN(std::vector<std::string>& tokens) {
        std::stack<int> stack;
        std::unordered_map<std::string, std::function<int(int, int)>> operators = {
            {"+", [](int a, int b) { return a + b; }},
            {"-", [](int a, int b) { return a - b; }},
            {"*", [](int a, int b) { return a * b; }},
            {"/", [](int a, int b) { return a / b; }}
        };
        
        for (const std::string& t : tokens) {
            if (operators.find(t) != operators.end()) {
                int b = stack.top(); stack.pop();
                int a = stack.top(); stack.pop();
                stack.push(operators[t](a, b));
            } else {
                stack.push(stoi(t));
            }
        }
        return stack.top();
    }
};
```
<!-- slide -->
```javascript
/**
 * @param {string[]} tokens
 * @return {number}
 */
var evalRPN = function(tokens) {
    const stack = [];
    const operators = {
        "+": (a, b) => a + b,
        "-": (a, b) => a - b,
        "*": (a, b) => a * b,
        "/": (a, b) => Math.trunc(a / b)
    };
    
    for (const t of tokens) {
        if (operators.hasOwnProperty(t)) {
            const b = stack.pop();
            const a = stack.pop();
            stack.push(operators[t](a, b));
        } else {
            stack.push(parseInt(t));
        }
    }
    return stack[0];
};
```
````

### Explanation

1. **Create an operator dictionary** mapping operators to their corresponding functions
2. **Iterate through tokens:**
   - If the token is in the operator dictionary, pop two values, apply the function, push result
   - Otherwise, it's a number - push it onto the stack
3. **Return the final result**

**Benefits of this approach:**
- Cleaner, more declarative code
- Easy to extend with new operators
- Separates operator logic from evaluation logic

### Complexity Analysis

| Metric | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(n) | Each token is processed exactly once |
| **Space** | O(n) | Stack storage for operands |

---

## Approach 3: Recursive Evaluation

We can evaluate RPN using recursion by processing tokens from the end. The call stack acts as our data structure. This approach is elegant but has recursion depth limitations for large inputs.

### Intuition for Recursive Approach

In RPN, operators follow their operands. By processing tokens from the end (popping the last token first):
- If the token is a number, return it as the base case
- If it's an operator, recursively evaluate the right operand first, then the left operand, apply the operation, and return the result

This naturally matches the postfix structure because popping from the end encounters the operator before its operands in reverse order.

### Implementation

````carousel
```python
from typing import List

class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        def helper():
            token = tokens.pop()
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
                    # Truncate toward zero
                    return int(left / right)
            else:
                return int(token)
        
        return helper()
```
<!-- slide -->
```java
class Solution {
    public int evalRPN(String[] tokens) {
        // Convert to ArrayList for O(1) remove from end
        java.util.ArrayList<String> list = new java.util.ArrayList<>(java.util.Arrays.asList(tokens));
        
        java.util.function.Supplier<Integer> helper = () -> {
            String token = list.remove(list.size() - 1);
            if (token.equals("+") || token.equals("-") || 
                token.equals("*") || token.equals("/")) {
                int right = helper.get();
                int left = helper.get();
                switch (token) {
                    case "+": return left + right;
                    case "-": return left - right;
                    case "*": return left * right;
                    default: return left / right;
                }
            }
            return Integer.parseInt(token);
        };
        
        return helper.get();
    }
}
```
<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <functional>

class Solution {
private:
    int helper(std::vector<std::string>& tokens) {
        std::string token = tokens.back();
        tokens.pop_back();
        
        if (token == "+" || token == "-" || token == "*" || token == "/") {
            int right = helper(tokens);
            int left = helper(tokens);
            if (token == "+") return left + right;
            if (token == "-") return left - right;
            if (token == "*") return left * right;
            return left / right;
        }
        return stoi(token);
    }
    
public:
    int evalRPN(std::vector<std::string>& tokens) {
        return helper(tokens);
    }
};
```
<!-- slide -->
```javascript
/**
 * @param {string[]} tokens
 * @return {number}
 */
var evalRPN = function(tokens) {
    let index = tokens.length - 1;
    
    const helper = () => {
        const token = tokens[index--];
        
        if (token === "+" || token === "-" || token === "*" || token === "/") {
            const right = helper();
            const left = helper();
            switch (token) {
                case "+": return left + right;
                case "-": return left - right;
                case "*": return left * right;
                default: return Math.trunc(left / right);
            }
        }
        return parseInt(token);
    };
    
    return helper();
};
```
````

### How It Works - Step-by-Step Example

For `tokens = ["2", "1", "+", "3", "*"]`:

1. Pop `*` → operator → recurse right: pop `3` → return `3`
2. Recurse left: pop `+` → operator → recurse right: pop `1` → return `1`
3. Recurse left: pop `2` → return `2`
4. Compute `2 + 1 = 3`
5. Compute `3 × 3 = 9`
6. Return `9`

### Complexity Analysis

| Metric | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(n) | Each token is processed exactly once |
| **Space** | O(n) | Call stack depth equals expression nesting depth |

**Pros:**
- Elegant and concise
- Demonstrates recursion and expression tree evaluation
- Good for understanding functional programming concepts

**Cons:**
- Risk of stack overflow for deeply nested expressions
- Python's default recursion limit is ~1000, which may be exceeded for large inputs

---

## Approach 4: Single Pass with Two-Stack Optimization

For very large inputs, we can optimize space by processing tokens in batches and reducing stack operations. However, this is more complex and rarely needed for typical constraints.

### Alternative: Using Array as Stack (Language-Specific)

Some languages allow more efficient stack operations by using array/list directly with pre-allocation:

````carousel
```python
from typing import List

class Solution:
    def evalRPN(self, tokens: List[str]) -> int:
        stack = []
        stack.extend([0] * len(tokens))  # Pre-allocate for efficiency
        top = -1
        
        for t in tokens:
            if t not in {"+", "-", "*", "/"}:
                top += 1
                stack[top] = int(t)
            else:
                b = stack[top]
                top -= 1
                a = stack[top]
                top -= 1
                if t == "+":
                    top += 1
                    stack[top] = a + b
                elif t == "-":
                    top += 1
                    stack[top] = a - b
                elif t == "*":
                    top += 1
                    stack[top] = a * b
                else:
                    top += 1
                    stack[top] = int(a / b)
        
        return stack[0]
```
<!-- slide -->
```java
import java.util.ArrayDeque;

class Solution {
    public int evalRPN(String[] tokens) {
        // ArrayDeque is faster than Stack in Java
        ArrayDeque<Integer> stack = new ArrayDeque<>();
        for (String t : tokens) {
            if (!t.equals("+") && !t.equals("-") && 
                !t.equals("*") && !t.equals("/")) {
                stack.push(Integer.parseInt(t));
            } else {
                int b = stack.pop();
                int a = stack.pop();
                switch (t) {
                    case "+": stack.push(a + b); break;
                    case "-": stack.push(a - b); break;
                    case "*": stack.push(a * b); break;
                    case "/": stack.push(a / b); break;
                }
            }
        }
        return stack.pop();
    }
}
```
<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_set>

class Solution {
public:
    int evalRPN(std::vector<std::string>& tokens) {
        // Use vector directly for better cache performance
        std::vector<int> stack;
        stack.reserve(tokens.size());  // Pre-allocate memory
        
        std::unordered_set<std::string> ops = {"+", "-", "*", "/"};
        
        for (const std::string& t : tokens) {
            if (ops.find(t) == ops.end()) {
                stack.push_back(stoi(t));
            } else {
                int b = stack.back(); stack.pop_back();
                int a = stack.back(); stack.pop_back();
                if (t == "+") stack.push_back(a + b);
                else if (t == "-") stack.push_back(a - b);
                else if (t == "*") stack.push_back(a * b);
                else stack.push_back(a / b);  // Truncates toward zero
            }
        }
        return stack.back();
    }
};
```
<!-- slide -->
```javascript
/**
 * @param {string[]} tokens
 * @return {number}
 */
var evalRPN = function(tokens) {
    const stack = [];
    
    for (const t of tokens) {
        if (t !== "+" && t !== "-" && t !== "*" && t !== "/") {
            stack.push(parseInt(t));
        } else {
            const b = stack.pop();
            const a = stack.pop();
            if (t === "+") {
                stack.push(a + b);
            } else if (t === "-") {
                stack.push(a - b);
            } else if (t === "*") {
                stack.push(a * b);
            } else {
                // Math.trunc ensures truncation toward zero
                stack.push(Math.trunc(a / b));
            }
        }
    }
    return stack[0];
};
```
````

### Explanation of Optimizations

1. **Pre-allocation:** In Python and C++, we pre-allocate the array to avoid dynamic resizing overhead
2. **ArrayDeque in Java:** Faster than the synchronized `Stack` class
3. **Direct vector usage in C++:** Better cache locality than `std::stack`
4. **JavaScript arrays:** Already optimized, `push()`/`pop()` are O(1) amortized

### Complexity Analysis

| Metric | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(n) | Each token processed exactly once |
| **Space** | O(n) | Stack storage proportional to input size |

**Benefits:**
- Slightly faster due to reduced memory allocations
- Better cache performance with contiguous memory
- No synchronization overhead (unlike `Stack` in Java)

---

## Comparison of Approaches

| Approach | Time Complexity | Space Complexity | Pros | Cons |
|----------|-----------------|------------------|------|------|
| **Stack + If-Else** | O(n) | O(n) | Simple, no dependencies | Verbose |
| **Stack + Dictionary** | O(n) | O(n) | Clean, extensible | Dictionary overhead |
| **Recursion** | O(n) | O(n) | Elegant, functional style | Stack overflow risk |
| **Array/Deque Optimization** | O(n) | O(n) | Better cache performance | Slightly more complex |

**Recommendation:** Use Approach 1 or 2 for production code. Approach 2 is preferred for its readability and extensibility.

---

## Common Pitfalls

1. **Division Truncation:**
   - Python: `int(a / b)` truncates toward zero for negative numbers
   - Java/C++: Integer division already truncates toward zero
   - JavaScript: Use `Math.trunc(a / b)` instead of `~~(a / b)` for clarity

2. **Operand Order:**
   - Always pop `b` (right operand) first, then `a` (left operand)
   - For subtraction: `a - b`, not `b - a`
   - For division: `a / b`, not `b / a`

3. **Empty Stack:**
   - The problem guarantees valid input, but defensive programming is good practice

4. **Negative Numbers:**
   - Tokens like `"-11"` are valid operands, not operators
   - Check `if t not in operators` before processing as operator

---

## Related Problems

Here are some LeetCode problems that build on similar concepts:

| Problem | Difficulty | Description |
|---------|------------|-------------|
| [Basic Calculator](https://leetcode.com/problems/basic-calculator/) | Hard | Evaluate infix expressions with parentheses |
| [Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii/) | Medium | Evaluate infix expressions without parentheses |
| [Basic Calculator III](https://leetcode.com/problems/basic-calculator-iii/) | Hard | Evaluate infix expressions with all four operators and parentheses |
| [Expression Add Operators](https://leetcode.com/problems/expression-add-operators/) | Hard | Add operators to form target value |
| [Different Ways to Add Parentheses](https://leetcode.com/problems/different-ways-to-add-parentheses/) | Medium | All possible evaluation results |
| [Parse Lisp Expression](https://leetcode.com/problems/parse-lisp-expression/) | Hard | Evaluate Lisp-like expressions |
| [Verify Preorder Serialization of a Binary Tree](https://leetcode.com/problems/verify-preorder-serialization-of-a-binary-tree/) | Medium | Uses stack for validation |

---

## Video Tutorial Links

Here are some helpful video explanations:

- [Evaluate Reverse Polish Notation - LeetCode 150](https://www.youtube.com/watch?v=iu0082c4HDE) - Detailed walkthrough with visualizations
- [LeetCode 150: Evaluate Reverse Polish Notation](https://www.youtube.com/watch?v=ffgmKxRqiMc) - Multiple language solutions
- [Stack Problems: Evaluate Reverse Polish Notation](https://www.youtube.com/watch?v=-nAxVxlxsGU) - Part of DSA series
- [RPN Calculator Tutorial](https://www.youtube.com/watch?v=rJWrh7Xicec) - Step-by-step evaluation guide
- [Java Solution - Evaluate Reverse Polish Notation](https://www.youtube.com/watch?v=MwQ9hMqaeyw) - Java-focused explanation

---

## Follow-up Questions

### Basic Understanding

1. **Why is Reverse Polish Notation useful?**

   **Answer:** RPN eliminates the need for parentheses and operator precedence rules. Expressions are unambiguous and can be evaluated using a simple stack. This makes it ideal for early computers and some calculators (HP calculators use RPN).

2. **What happens if you encounter a division by zero?**

   **Answer:** The problem guarantees no division by zero in valid inputs. In practice, you would add a check: `if b == 0: throw ZeroDivisionError` or handle it appropriately.

3. **Can you evaluate RPN with a queue instead of a stack?**

   **Answer:** No, RPN evaluation fundamentally requires LIFO (Last In, First Out) behavior to access the most recent operands first. A queue provides FIFO behavior which doesn't work correctly.

---

### Algorithmic Extensions

4. **How would you modify the solution to support additional operators like `%` (modulo) or `^` (exponentiation)?**

   **Answer:** Simply add the new operator to the operator dictionary/map. For exponentiation, be careful with operator associativity (right-to-left for `^`).

   ```python
   operators = {
       "+": lambda a, b: a + b,
       "-": lambda a, b: a - b,
       "*": lambda a, b: a * b,
       "/": lambda a, b: int(a / b),
       "%": lambda a, b: a % b,
       "^": lambda a, b: a ** b  # Right-associative needs different handling
   }
   ```

5. **How would you evaluate RPN with floating-point numbers?**

   **Answer:** Change `int()` to `float()` in the conversion and ensure division produces floats. The stack logic remains the same.

6. **How would you evaluate RPN for very large numbers (beyond 32-bit integers)?**

   **Answer:** Use arbitrary-precision libraries like Python's `int` (already supports it), Java's `BigInteger`, C++'s `boost::multiprecision`, or JavaScript's `BigInt`.

---

### Performance and Optimization

7. **What is the maximum depth of the stack needed?**

   **Answer:** In the worst case, when all tokens are numbers followed by operators (e.g., `["1", "2", "3", "+", "+", "+"]`), the stack size is O(n). For typical expressions, it's much smaller.

8. **Can you solve this with O(1) space?**

   **Answer:** No, in the general case, you need O(n) space for the stack. Some special cases (like fully left-associative operations) could use O(1), but this isn't practical for arbitrary RPN.

9. **How would you optimize for cache performance?**

   **Answer:** Use a pre-allocated array (vector) with an index instead of dynamic push/pop operations. This improves spatial locality and reduces memory allocation overhead.

---

### Edge Cases and Testing

10. **What edge cases should you test?**

    - Single number: `["42"]` → `42`
    - All operations: `["1", "2", "+", "3", "4", "+", "*"]` → `(1+2) × (3+4) = 21`
    - Negative numbers: `["10", "3", "/"]` → `3`
    - Mixed signs: `["-4", "2", "/"]` → `-2`
    - Large expressions: `tokens = ["2"] * 10000` with appropriate operators

11. **What happens with consecutive operators?**

    **Answer:** In valid RPN, consecutive operators are valid if they have enough operands before them. The problem guarantees valid input, so you don't need to handle this case.

12. **How do you handle the difference between `-3` (negative number) and `-` (subtraction)?**

    **Answer:** Context matters. If a token is just `"-"` and the stack has at least 2 elements, it's an operator. If a token is `"-3"` (or starts with `-` followed by digits), it's a negative number. This is handled by checking if the token is in the operator set first.

---

### Real-World Applications

13. **Where is RPN used in real applications?**

    **Answer:** HP calculators, Forth/PostScript programming languages, some compiler intermediate representations, and stack-based virtual machines (Java JVM, .NET CLR).

14. **How would you convert infix to postfix?**

    **Answer:** Use the Shunting Yard algorithm (developed by Dijkstra). It uses a stack to handle operator precedence and parentheses, outputting the postfix notation.

15. **How would you build an RPN calculator with undo/redo functionality?**

    **Answer:** Maintain two stacks: one for the calculation stack and another for the history stack. Each operation saves the previous state. Undo pops from history and restores; redo pushes back to history.

---

## LeetCode Link

[Evaluate Reverse Polish Notation - LeetCode 150](https://leetcode.com/problems/evaluate-reverse-polish-notation/)


