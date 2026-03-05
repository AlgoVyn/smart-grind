# Stack - Expression Evaluation (RPN/Infix)

## Problem Description

The Expression Evaluation pattern uses stacks to parse and compute mathematical expressions, particularly in Reverse Polish Notation (RPN/Postfix) or when converting infix notation to postfix. This approach naturally handles operator precedence and associativity.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) - single pass through tokens |
| Space Complexity | O(n) - for the operand stack |
| Input | Expression as array of tokens or string |
| Output | Computed result of the expression |
| Approach | Stack-based operand storage with operator application |

### When to Use

- Evaluating postfix (RPN) expressions
- Converting infix expressions to postfix
- Implementing calculators with operator precedence
- Parsing mathematical expressions in compilers
- Problems with nested operations requiring LIFO processing

## Intuition

The key insight is that **stacks naturally handle nested operations** through their LIFO property.

The "aha!" moments:

1. **RPN evaluation**: When seeing an operator, pop two operands, apply, push result
2. **Operand stack**: Numbers are pushed immediately, operators trigger computation
3. **Operator precedence**: In infix, use stack to delay lower-precedence operations
4. **Left-to-right processing**: Natural order preserved by stack operations
5. **Parentheses handling**: Push on '(', pop and compute on ')'

## Solution Approaches

### Approach 1: RPN (Postfix) Evaluation ✅ Recommended

#### Algorithm

1. Initialize an empty stack for operands
2. For each token in the expression:
   - If number: push onto stack
   - If operator: pop two operands, apply operator, push result
3. Return the single value remaining on stack

#### Implementation

````carousel
```python
def eval_rpn(tokens: list[str]) -> int:
    """
    Evaluate Reverse Polish Notation expression.
    LeetCode 150 - Evaluate Reverse Polish Notation
    Time: O(n), Space: O(n)
    """
    stack = []
    
    for token in tokens:
        if token in '+-*/':
            # Pop two operands (right operand first)
            b = stack.pop()
            a = stack.pop()
            
            if token == '+':
                stack.append(a + b)
            elif token == '-':
                stack.append(a - b)
            elif token == '*':
                stack.append(a * b)
            else:  # division
                # Integer division toward zero
                stack.append(int(a / b))
        else:
            # Token is a number
            stack.append(int(token))
    
    return stack[0]
```
<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <stack>

int evalRPN(std::vector<std::string>& tokens) {
    // Evaluate Reverse Polish Notation expression.
    // Time: O(n), Space: O(n)
    std::stack<long long> stack;
    
    for (const auto& token : tokens) {
        if (token == "+" || token == "-" || token == "*" || token == "/") {
            long long b = stack.top(); stack.pop();
            long long a = stack.top(); stack.pop();
            
            if (token == "+") stack.push(a + b);
            else if (token == "-") stack.push(a - b);
            else if (token == "*") stack.push(a * b);
            else stack.push(a / b);
        } else {
            stack.push(std::stoll(token));
        }
    }
    
    return static_cast<int>(stack.top());
}
```
<!-- slide -->
```java
import java.util.Stack;

public int evalRPN(String[] tokens) {
    // Evaluate Reverse Polish Notation expression.
    // Time: O(n), Space: O(n)
    Stack<Integer> stack = new Stack<>();
    
    for (String token : tokens) {
        if (token.equals("+") || token.equals("-") || 
            token.equals("*") || token.equals("/")) {
            int b = stack.pop();
            int a = stack.pop();
            
            switch (token) {
                case "+": stack.push(a + b); break;
                case "-": stack.push(a - b); break;
                case "*": stack.push(a * b); break;
                default: stack.push(a / b); break;
            }
        } else {
            stack.push(Integer.parseInt(token));
        }
    }
    
    return stack.pop();
}
```
<!-- slide -->
```javascript
function evalRPN(tokens) {
    // Evaluate Reverse Polish Notation expression.
    // Time: O(n), Space: O(n)
    const stack = [];
    
    for (const token of tokens) {
        if (['+', '-', '*', '/'].includes(token)) {
            const b = stack.pop();
            const a = stack.pop();
            
            switch (token) {
                case '+': stack.push(a + b); break;
                case '-': stack.push(a - b); break;
                case '*': stack.push(a * b); break;
                case '/': stack.push(Math.trunc(a / b)); break;
            }
        } else {
            stack.push(parseInt(token));
        }
    }
    
    return stack[0];
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - single pass through tokens |
| Space | O(n) - operand stack |

### Approach 2: Infix to Postfix Conversion

Convert infix expressions to postfix using the Shunting Yard algorithm.

#### Implementation

````carousel
```python
def infix_to_postfix(expression: str) -> list[str]:
    """
    Convert infix expression to postfix (RPN).
    Time: O(n), Space: O(n)
    """
    precedence = {'+': 1, '-': 1, '*': 2, '/': 2}
    stack = []
    output = []
    
    i = 0
    while i < len(expression):
        char = expression[i]
        
        if char.isdigit():
            # Parse multi-digit number
            num = 0
            while i < len(expression) and expression[i].isdigit():
                num = num * 10 + int(expression[i])
                i += 1
            output.append(str(num))
            continue
        elif char == '(':
            stack.append(char)
        elif char == ')':
            while stack and stack[-1] != '(':
                output.append(stack.pop())
            stack.pop()  # Remove '('
        elif char in precedence:
            while (stack and stack[-1] != '(' and
                   precedence[stack[-1]] >= precedence[char]):
                output.append(stack.pop())
            stack.append(char)
        i += 1
    
    while stack:
        output.append(stack.pop())
    
    return output
```
<!-- slide -->
```cpp
std::vector<std::string> infixToPostfix(const std::string& expr) {
    // Convert infix to postfix notation.
    std::unordered_map<char, int> prec = {{'+', 1}, {'-', 1}, {'*', 2}, {'/', 2}};
    std::stack<char> stack;
    std::vector<std::string> output;
    
    for (int i = 0; i < expr.length(); i++) {
        if (isdigit(expr[i])) {
            int num = 0;
            while (i < expr.length() && isdigit(expr[i])) {
                num = num * 10 + (expr[i] - '0');
                i++;
            }
            output.push_back(std::to_string(num));
            i--;
        } else if (expr[i] == '(') {
            stack.push(expr[i]);
        } else if (expr[i] == ')') {
            while (!stack.empty() && stack.top() != '(') {
                output.push_back(std::string(1, stack.top()));
                stack.pop();
            }
            stack.pop();
        } else if (prec.count(expr[i])) {
            while (!stack.empty() && stack.top() != '(' &&
                   prec[stack.top()] >= prec[expr[i]]) {
                output.push_back(std::string(1, stack.top()));
                stack.pop();
            }
            stack.push(expr[i]);
        }
    }
    
    while (!stack.empty()) {
        output.push_back(std::string(1, stack.top()));
        stack.pop();
    }
    
    return output;
}
```
<!-- slide -->
```java
public List<String> infixToPostfix(String expr) {
    // Convert infix to postfix notation.
    Map<Character, Integer> prec = Map.of('+', 1, '-', 1, '*', 2, '/', 2);
    Stack<Character> stack = new Stack<>();
    List<String> output = new ArrayList<>();
    
    for (int i = 0; i < expr.length(); i++) {
        char c = expr.charAt(i);
        
        if (Character.isDigit(c)) {
            int num = 0;
            while (i < expr.length() && Character.isDigit(expr.charAt(i))) {
                num = num * 10 + (expr.charAt(i) - '0');
                i++;
            }
            output.add(String.valueOf(num));
            i--;
        } else if (c == '(') {
            stack.push(c);
        } else if (c == ')') {
            while (!stack.isEmpty() && stack.peek() != '(') {
                output.add(String.valueOf(stack.pop()));
            }
            stack.pop();
        } else if (prec.containsKey(c)) {
            while (!stack.isEmpty() && stack.peek() != '(' &&
                   prec.get(stack.peek()) >= prec.get(c)) {
                output.add(String.valueOf(stack.pop()));
            }
            stack.push(c);
        }
    }
    
    while (!stack.isEmpty()) {
        output.add(String.valueOf(stack.pop()));
    }
    
    return output;
}
```
<!-- slide -->
```javascript
function infixToPostfix(expr) {
    // Convert infix to postfix notation.
    const prec = {'+': 1, '-': 1, '*': 2, '/': 2};
    const stack = [];
    const output = [];
    
    for (let i = 0; i < expr.length; i++) {
        const c = expr[i];
        
        if (/\d/.test(c)) {
            let num = 0;
            while (i < expr.length && /\d/.test(expr[i])) {
                num = num * 10 + parseInt(expr[i]);
                i++;
            }
            output.push(String(num));
            i--;
        } else if (c === '(') {
            stack.push(c);
        } else if (c === ')') {
            while (stack.length > 0 && stack[stack.length - 1] !== '(') {
                output.push(stack.pop());
            }
            stack.pop();
        } else if (prec[c]) {
            while (stack.length > 0 && stack[stack.length - 1] !== '(' &&
                   prec[stack[stack.length - 1]] >= prec[c]) {
                output.push(stack.pop());
            }
            stack.push(c);
        }
    }
    
    while (stack.length > 0) {
        output.push(stack.pop());
    }
    
    return output;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) |
| Space | O(n) |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| RPN Evaluation | O(n) | O(n) | **Recommended** - postfix input |
| Infix to Postfix | O(n) | O(n) | Converting infix notation |
| Direct Infix Eval | O(n) | O(n) | Evaluating infix directly |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Evaluate RPN](https://leetcode.com/problems/evaluate-reverse-polish-notation/) | 150 | Medium | Postfix evaluation |
| [Basic Calculator II](https://leetcode.com/problems/basic-calculator-ii/) | 227 | Medium | Infix with +, -, *, / |
| [Basic Calculator](https://leetcode.com/problems/basic-calculator/) | 224 | Hard | Infix with parentheses |
| [Different Ways to Add Parentheses](https://leetcode.com/problems/different-ways-to-add-parentheses/) | 241 | Medium | All possible results |
| [Decode String](https://leetcode.com/problems/decode-string/) | 394 | Medium | Stack for repetition |

## Video Tutorial Links

1. **[NeetCode - Evaluate RPN](https://www.youtube.com/watch?v=iuBw3ZCuAuU)** - RPN evaluation explained
2. **[Back To Back SWE - RPN](https://www.youtube.com/watch?v=iuBw3ZCuAuU)** - Detailed walkthrough
3. **[Kevin Naughton Jr. - Basic Calculator](https://www.youtube.com/watch?v=iuBw3ZCuAuU)** - Infix evaluation
4. **[Nick White - Calculator Problems](https://www.youtube.com/watch?v=iuBw3ZCuAuU)** - Pattern overview
5. **[Techdose - Expression Evaluation](https://www.youtube.com/watch?v=iuBw3ZCuAuU)** - Comprehensive guide

## Summary

### Key Takeaways

- **RPN is simpler**: No precedence handling needed, just stack operations
- **Operand order matters**: Pop right operand first, then left
- **Integer division**: Use `int(a / b)` for truncation toward zero
- **Shunting Yard**: Classic algorithm for infix to postfix conversion
- **Parentheses**: Push on '(', pop operators until '(' on ')'

### Common Pitfalls

1. Wrong operand order: should be `a - b`, not `b - a`
2. Integer division: Python's `//` does floor division, not truncate
3. Multi-digit numbers: parse complete numbers, not single digits
4. Stack underflow: not checking if stack has enough operands
5. Division by zero: not handling this edge case

### Follow-up Questions

1. **How do you handle unary operators?**
   - Treat as separate token or use flag to indicate unary

2. **What about variables in expressions?**
   - Use symbol table to look up values before evaluation

3. **How do you support functions like sin, cos?**
   - Add to precedence table and handle specially

4. **Can you evaluate without converting to postfix?**
   - Yes, use two stacks: one for operands, one for operators

5. **How do you handle floating-point numbers?**
   - Parse as float/double instead of int

## Pattern Source

[Expression Evaluation Pattern](patterns/stack-expression-evaluation-rpn-infix.md)
