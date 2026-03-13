# Basic Calculator III

## Problem Description

Implement a basic calculator that can evaluate a string expression containing integers, `+`, `-`, `*`, `/`, parentheses, and handle operator precedence.

**Link to problem:** [Basic Calculator III - LeetCode 772](https://leetcode.com/problems/basic-calculator-iii/)

---

## Pattern: Stack - Expression Evaluation

This problem exemplifies the **Stack - Expression Evaluation** pattern. The key insight is to use a stack to handle operator precedence and parentheses while evaluating the expression.

### Core Concept

The fundamental steps are:
1. Process the expression character by character
2. Use a stack to store numbers and handle precedence
3. For multiplication and division, apply immediately
4. For addition and subtraction, store with signs
5. Handle parentheses by recursively evaluating subexpressions

---

## Examples

### Example

**Input:**
```
s = "3+2*2"
```

**Output:**
```
7
```

### Example 2

**Input:**
```
s = " 3/2 "
```

**Output:**
```
1
```

### Example 3

**Input:**
```
s = " 3+5 / 2 "
```

**Output:**
```
5
```

### Example 4

**Input:**
```
s = "(1+(4+5+2)-3)+(6+8)"
```

**Output:**
```
23
```

---

## Constraints

- `1 <= s.length <= 10^5`
- `s` represents a valid expression
- `'+', '-', '*', '/'` operators
- `'('` and `')'` for grouping
- Operands and results fit in 32-bit signed integers

---

## Intuition

The key insight is:

1. **Operator Precedence**: `*` and `/` have higher precedence than `+` and `-`
2. **Stack for Precedence**: When we see `*` or `/`, we apply them immediately to the last number
3. **Sign-Based Approach**: For `+` and `-`, we push to stack with appropriate signs
4. **Parentheses**: Recursively evaluate subexpressions

### Why Stack Works

The stack allows us to:
- Store intermediate results
- Handle operator precedence by deferring `+` and `-`
- Apply `*` and `/` immediately to the previous number

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Stack-Based (Optimal)** - O(n) time, O(n) space
2. **Recursive Descent Parser** - O(n) time, O(n) space

---

## Approach 1: Stack-Based Expression Evaluation (Optimal)

This is the most efficient approach using a stack to handle operator precedence.

### Algorithm Steps

1. Initialize empty stack, current number = 0, current operator = '+'
2. Iterate through each character:
   - If digit: build the number
   - If operator or '(': process previous operator
   - If ')': evaluate subexpression until matching '('
3. At end, sum all values in stack
4. Return the result

### Code Implementation

````carousel
```python
class Solution:
    def calculate(self, s: str) -> int:
        """
        Evaluate basic arithmetic expression with +, -, *, / and parentheses.
        
        Args:
            s: Expression string
            
        Returns:
            Calculated result
        """
        def apply_op(stack, op, num):
            """Apply operator to the stack."""
            if op == '+':
                stack.append(num)
            elif op == '-':
                stack.append(-num)
            elif op == '*':
                stack[-1] *= num
            elif op == '/':
                # Integer division towards zero
                stack[-1] = int(stack[-1] / num)
        
        stack = []
        num = 0
        op = '+'
        i = 0
        
        while i < len(s):
            char = s[i]
            
            if char.isdigit():
                # Build the number
                num = num * 10 + int(char)
            elif char in '+-*/':
                # Apply previous operator
                apply_op(stack, op, num)
                op = char
                num = 0
            elif char == '(':
                # Find matching closing parenthesis
                # Count parentheses to handle nesting
                start = i
                count = 1
                j = i + 1
                while j < len(s) and count > 0:
                    if s[j] == '(':
                        count += 1
                    elif s[j] == ')':
                        count -= 1
                    j += 1
                
                # Recursively calculate subexpression
                num = self.calculate(s[start + 1:j - 1])
                i = j - 1  # Update index
            elif char == ')':
                # End of subexpression
                apply_op(stack, op, num)
                break
            
            i += 1
        
        # Apply last operator if any
        if num != 0 or (op == '+' and i == len(s)):
            apply_op(stack, op, num)
        
        return sum(stack)
```

<!-- slide -->
```cpp
class Solution {
public:
    int calculate(string s) {
        vector<long long> stack;
        long long num = 0;
        char op = '+';
        
        auto applyOp = [&](long long n) {
            if (op == '+') stack.push_back(n);
            else if (op == '-') stack.push_back(-n);
            else if (op == '*') stack.back() *= n;
            else if (op == '/') stack.back() = (int)(stack.back() / n);
        };
        
        for (int i = 0; i < s.length(); i++) {
            char c = s[i];
            
            if (isdigit(c)) {
                num = num * 10 + (c - '0');
            } else if (c == '+' || c == '-' || c == '*' || c == '/') {
                applyOp(num);
                op = c;
                num = 0;
            } else if (c == '(') {
                // Find matching ')'
                int j = i;
                int count = 1;
                while (j < s.length() && count > 0) {
                    j++;
                    if (s[j] == '(') count++;
                    else if (s[j] == ')') count--;
                }
                
                // Recursively calculate subexpression
                num = calculate(s.substr(i + 1, j - i - 1));
                i = j;
            } else if (c == ')') {
                applyOp(num);
                break;
            }
        }
        
        applyOp(num);
        
        return accumulate(stack.begin(), stack.end(), 0);
    }
};
```

<!-- slide -->
```java
class Solution {
    public int calculate(String s) {
        Deque<Long> stack = new LinkedList<>();
        long num = 0;
        char op = '+';
        
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            
            if (Character.isDigit(c)) {
                num = num * 10 + (c - '0');
            } else if (c == '+' || c == '-' || c == '*' || c == '/') {
                applyOp(stack, op, num);
                op = c;
                num = 0;
            } else if (c == '(') {
                // Find matching ')'
                int j = i;
                int count = 1;
                while (j < s.length() && count > 0) {
                    j++;
                    if (s.charAt(j) == '(') count++;
                    else if (s.charAt(j) == ')') count--;
                }
                
                // Recursively calculate subexpression
                num = calculate(s.substring(i + 1, j));
                i = j;
            } else if (c == ')') {
                applyOp(stack, op, num);
                break;
            }
        }
        
        applyOp(stack, op, num);
        
        return stack.stream().mapToLong(Long::longValue).sum() > Integer.MAX_VALUE ? 
               (int)stack.stream().mapToLong(Long::longValue).sum() : 
               (int)stack.stream().mapToLong(Long::longValue).sum();
    }
    
    private void applyOp(Deque<Long> stack, char op, long num) {
        if (op == '+') stack.add(num);
        else if (op == '-') stack.add(-num);
        else if (op == '*') stack.add(stack.pollLast() * num);
        else if (op == '/') stack.add(stack.pollLast() / num);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {number}
 */
var calculate = function(s) {
    const stack = [];
    let num = 0;
    let op = '+';
    
    const applyOp = (n) => {
        if (op === '+') stack.push(n);
        else if (op === '-') stack.push(-n);
        else if (op === '*') stack.push(stack.pop() * n);
        else if (op === '/') stack.push(Math.trunc(stack.pop() / n));
    };
    
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        
        if (!isNaN(c)) {
            num = num * 10 + parseInt(c);
        } else if (c === '+' || c === '-' || c === '*' || c === '/') {
            applyOp(num);
            op = c;
            num = 0;
        } else if (c === '(') {
            // Find matching ')'
            let j = i;
            let count = 1;
            while (j < s.length && count > 0) {
                j++;
                if (s[j] === '(') count++;
                else if (s[j] === ')') count--;
            }
            
            // Recursively calculate subexpression
            num = calculate(s.slice(i + 1, j));
            i = j;
        } else if (c === ')') {
            applyOp(num);
            break;
        }
    }
    
    applyOp(num);
    
    return stack.reduce((a, b) => a + b, 0);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each character is processed once |
| **Space** | O(n) - Stack stores at most n/2 numbers |

---

## Approach 2: Using Two Stacks (Numbers and Operators)

This approach uses separate stacks for numbers and operators.

### Code Implementation

````carousel
```python
class Solution:
    def calculate_two_stacks(self, s: str) -> int:
        """Using two stacks approach."""
        num_stack = []
        op_stack = []
        num = 0
        
        def apply():
            """Apply top operator to top two numbers."""
            if not op_stack or not num_stack:
                return
            b = num_stack.pop()
            a = num_stack.pop()
            op = op_stack.pop()
            
            if op == '+':
                num_stack.append(a + b)
            elif op == '-':
                num_stack.append(a - b)
            elif op == '*':
                num_stack.append(a * b)
            elif op == '/':
                num_stack.append(int(a / b))
        
        def precedence(op):
            """Return operator precedence."""
            if op in '()':
                return 0
            if op in '+-':
                return 1
            if op in '*/':
                return 2
            return 0
        
        s = s.replace(' ', '')  # Remove spaces
        
        i = 0
        while i < len(s):
            c = s[i]
            
            if c.isdigit():
                num = num * 10 + int(c)
            elif c == '(':
                op_stack.append(c)
            elif c == ')':
                while op_stack and op_stack[-1] != '(':
                    apply()
                op_stack.pop()  # Remove '('
            elif c in '+-*/':
                # Apply operators with higher precedence
                while op_stack and precedence(op_stack[-1]) >= precedence(c):
                    apply()
                op_stack.append(c)
            
            # Handle last number
            if (not c.isdigit() or i == len(s) - 1) and num != 0 or (c in '+-*/' and not s[i+1:].lstrip().isdigit() if i < len(s)-1 else False):
                pass
            
            # Actually add number when we see operator or parenthesis or end
            if not c.isdigit() or i == len(s) - 1:
                num_stack.append(num)
                num = 0
            
            i += 1
        
        # Apply remaining operators
        while op_stack:
            apply()
        
        return num_stack[-1] if num_stack else 0
```

<!-- slide -->
```cpp
class Solution {
public:
    int calculate(string s) {
        vector<long long> numStack;
        vector<char> opStack;
        long long num = 0;
        
        auto apply = [&]() {
            if (numStack.size() < 2 || opStack.empty()) return;
            long long b = numStack.back(); numStack.pop_back();
            long long a = numStack.back(); numStack.pop_back();
            char op = opStack.back(); opStack.pop_back();
            
            if (op == '+') numStack.push_back(a + b);
            else if (op == '-') numStack.push_back(a - b);
            else if (op == '*') numStack.push_back(a * b);
            else if (op == '/') numStack.push_back(a / b);
        };
        
        auto precedence = [&](char op) {
            if (op == '+' || op == '-') return 1;
            if (op == '*' || op == '/') return 2;
            return 0;
        };
        
        for (int i = 0; i < s.length(); i++) {
            char c = s[i];
            
            if (isdigit(c)) {
                num = num * 10 + (c - '0');
            } else if (c == '(') {
                opStack.push_back(c);
            } else if (c == ')') {
                while (!opStack.empty() && opStack.back() != '(') apply();
                opStack.pop_back();
            } else if (c == '+' || c == '-' || c == '*' || c == '/') {
                while (!opStack.empty() && precedence(opStack.back()) >= precedence(c)) {
                    apply();
                }
                opStack.push_back(c);
            }
            
            // Add number when we hit operator or end
            if ((!isdigit(c) && c != ' ') || i == s.length() - 1) {
                if (num != 0 || isdigit(c)) {
                    numStack.push_back(num);
                    num = 0;
                }
            }
        }
        
        while (!opStack.empty()) apply();
        
        return numStack.empty() ? 0 : (int)numStack.back();
    }
};
```

<!-- slide -->
```java
class Solution {
    public int calculate(String s) {
        Deque<Long> numStack = new ArrayDeque<>();
        Deque<Character> opStack = new ArrayDeque<>();
        long num = 0;
        
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            
            if (Character.isDigit(c)) {
                num = num * 10 + (c - '0');
            } else if (c == '(') {
                opStack.push(c);
            } else if (c == ')') {
                while (!opStack.isEmpty() && opStack.peek() != '(') {
                    apply(numStack, opStack);
                }
                opStack.pop();
            } else if (c == '+' || c == '-' || c == '*' || c == '/') {
                while (!opStack.isEmpty() && precedence(opStack.peek()) >= precedence(c)) {
                    apply(numStack, opStack);
                }
                opStack.push(c);
            }
            
            if (!Character.isDigit(c) && c != ' ' || i == s.length() - 1) {
                if (num != 0 || Character.isDigit(c)) {
                    numStack.push(num);
                    num = 0;
                }
            }
        }
        
        while (!opStack.isEmpty()) {
            apply(numStack, opStack);
        }
        
        return numStack.isEmpty() ? 0 : (int)(long)numStack.peek();
    }
    
    private void apply(Deque<Long> numStack, Deque<Character> opStack) {
        if (numStack.size() < 2 || opStack.isEmpty()) return;
        long b = numStack.pollLast();
        long a = numStack.pollLast();
        char op = opStack.pollLast();
        
        if (op == '+') numStack.addLast(a + b);
        else if (op == '-') numStack.addLast(a - b);
        else if (op == '*') numStack.addLast(a * b);
        else if (op == '/') numStack.addLast(a / b);
    }
    
    private int precedence(char op) {
        if (op == '+' || op == '-') return 1;
        if (op == '*' || op == '/') return 2;
        return 0;
    }
}
```

<!-- slide -->
```javascript
var calculate = function(s) {
    const numStack = [];
    const opStack = [];
    let num = 0;
    
    const apply = () => {
        if (numStack.length < 2 || opStack.length === 0) return;
        const b = numStack.pop();
        const a = numStack.pop();
        const op = opStack.pop();
        
        if (op === '+') numStack.push(a + b);
        else if (op === '-') numStack.push(a - b);
        else if (op === '*') numStack.push(a * b);
        else if (op === '/') numStack.push(Math.trunc(a / b));
    };
    
    const precedence = (op) => {
        if (op === '+' || op === '-') return 1;
        if (op === '*' || op === '/') return 2;
        return 0;
    };
    
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        
        if (!isNaN(c)) {
            num = num * 10 + parseInt(c);
        } else if (c === '(') {
            opStack.push(c);
        } else if (c === ')') {
            while (opStack.length > 0 && opStack[opStack.length - 1] !== '(') {
                apply();
            }
            opStack.pop();
        } else if (c === '+' || c === '-' || c === '*' || c === '/') {
            while (opStack.length > 0 && precedence(opStack[opStack.length - 1]) >= precedence(c)) {
                apply();
            }
            opStack.push(c);
        }
        
        if (!isNaN(c) && c !== ' ' || i === s.length - 1) {
            if (num !== 0 || !isNaN(c)) {
                numStack.push(num);
                num = 0;
            }
        }
    }
    
    while (opStack.length > 0) {
        apply();
    }
    
    return numStack.length > 0 ? numStack[numStack.length - 1] : 0;
};
```
````

---

## Comparison of Approaches

| Aspect | Single Stack | Two Stacks |
|--------|--------------|------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(n) | O(n) |
| **Implementation** | Simpler | More explicit |
| **Understanding** | Sign-based | Operator precedence |

**Best Approach:** Both approaches have similar complexity. The single stack approach is more commonly used.

---

## Why This Problem is Important

This problem demonstrates:
1. **Operator precedence**: Understanding how to handle different operator priorities
2. **Stack usage**: Classic stack application for expression evaluation
3. **Parentheses handling**: Recursive evaluation of nested expressions
4. **Integer division**: Careful handling of division towards zero

---

## Related Problems

### Same Pattern (Expression Evaluation)

| Problem | LeetCode Link | Difficulty | Description |
|---------|---------------|------------|-------------|
| [Basic Calculator](https://leetcode.com/problems/basic-calculator/) | 224 | Hard | With parentheses and +/- |
| [Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii/) | 227 | Medium | Without parentheses |
| [Evaluate Reverse Polish Notation](https://leetcode.com/problems/evaluate-reverse-polish-notation/) | 150 | Medium | Postfix notation |

### Similar Concepts

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| [Expression Add Operators](https://leetcode.com/problems/expression-add-operators/) | 282 | Hard | Backtracking |
| [Different Ways to Add Parentheses](https://leetcode.com/problems/different-ways-to-add-parentheses/) | 241 | Medium | Recursive parsing |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Basic Calculator III](https://www.youtube.com/watch?v=3DQk6Mkm5H8)** - Clear explanation

2. **[Basic Calculator III - Explanation](https://www.youtube.com/watch?v=3DQk6Mkm5H8)** - Detailed walkthrough

3. **[Expression Evaluation](https://www.youtube.com/watch?v=hwZjwZ8z0qk)** - Stack-based approach

---

## Follow-up Questions

### Q1: How would you handle unary operators (+/-)?

**Answer:** You'd need to track whether the current position expects a number (start of expression or after '(' or operator). Handle unary '+' by doing nothing, unary '-' by negating the number.

---

### Q2: What if you need to support exponentiation (**)?

**Answer:** Add '**' with higher precedence than '*' and '/'. Apply it similarly to how we handle other operators.

---

### Q3: How would you implement this without recursion for parentheses?

**Answer:** Use a stack to track parenthesis positions. When encountering ')', pop back to the matching '(' and evaluate that subexpression.

---

### Q4: What about floating-point numbers?

**Answer:** Use float/double instead of int, and handle decimal points similarly to digits (multiply by 10.0 instead of 10).

---

### Q5: How would you handle modulo operator?

**Answer:** Add '%' with same precedence as '*' and '/'. Apply the modulo operation similarly.

---

### Q6: What edge cases should be tested?

**Answer:**
- Empty expression (return 0)
- Single number
- Multiple parentheses (nested)
- Consecutive operators
- Division by zero (not possible per constraints)
- Large numbers

---

### Q7: How does integer division differ in various languages?

**Answer:** Python uses floor division (towards -∞), C++/Java use truncation (towards zero). Make sure to handle correctly.

---

## Common Pitfalls

### 1. Integer Division
**Issue**: Not handling division correctly (truncation vs floor).

**Solution**: Use `int(a / b)` for truncation towards zero in Python, or `a / b` in C++/Java.

### 2. Parentheses Nesting
**Issue**: Not handling deeply nested parentheses.

**Solution**: Use recursion or count parentheses carefully.

### 3. Operator Precedence
**Issue**: Not applying '*' and '/' before '+' and '-'.

**Solution**: Use stack to defer '+' and '-', apply '*' and '/' immediately.

### 4. Consecutive Operators
**Issue**: Not handling expressions like "1-(-2)".

**Solution**: Handle unary operators or preprocess to handle double negatives.

---

## Summary

The **Basic Calculator III** problem demonstrates stack-based expression evaluation:

- **Stack approach**: Handles operator precedence correctly
- **Parentheses**: Recursive evaluation of subexpressions
- **Division**: Careful handling of integer division

Key takeaways:
- **Operator precedence**: Use stack to defer low-precedence operators
- **Parentheses**: Recursively evaluate or use stack
- **Sign-based**: For '+' and '-', push with signs

This problem is essential for understanding expression parsing and evaluation.

### Pattern Summary

This problem exemplifies the **Stack - Expression Evaluation** pattern, characterized by:
- Handling operator precedence with stack
- Deferred computation for low-precedence operators
- Recursive or iterative parentheses handling

For more details on expression evaluation, see the **[Expression Evaluation](/algorithms/expression-evaluation)** section.
