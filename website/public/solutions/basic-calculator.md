# Basic Calculator

## Problem Description

[LeetCode Link: Basic Calculator](https://leetcode.com/problems/basic-calculator/)

Given a string `s` representing a valid expression, implement a basic calculator to evaluate it, and return the result of the evaluation.

**Note:** You are not allowed to use any built-in function which evaluates strings as mathematical expressions, such as `eval()`.

---

## Examples

**Example 1:**

**Input:**
```python
s = "1 + 1"
```

**Output:**
```python
2
```

**Example 2:**

**Input:**
```python
s = " 2-1 + 2 "
```

**Output:**
```python
3
```

**Example 3:**

**Input:**
```python
s = "(1+(4+5+2)-3)+(6+8)"
```

**Output:**
```python
23
```

---

## Constraints

- `1 <= s.length <= 3 * 105`
- `s` consists of digits, '+', '-', '(', ')', and ' '.
- `s` represents a valid expression.
- '+' is not used as a unary operation (i.e., "+1" and "+(2 + 3)" is invalid).
- '-' could be used as a unary operation (i.e., "-1" and "-(2 + 3)" is valid).
- There will be no two consecutive operators in the input.
- Every number and running calculation will fit in a signed 32-bit integer.

---

## Pattern: Stack-Based Expression Evaluation

This problem follows the **Stack-Based Expression Evaluation** pattern, commonly used in problems that involve evaluating mathematical expressions with parentheses and operators.

### Core Concept

- **Stack for parentheses**: Stores previous results and signs when encountering '(' 
- **Sign tracking**: Maintains current sign to apply to following numbers
- **State restoration**: Restore previous state when exiting parentheses

### When to Use This Pattern

This pattern is applicable when:
1. Evaluating expressions with parentheses
2. Handling operator precedence
3. Processing nested expressions

### Alternative Patterns

| Pattern | Description |
|---------|-------------|
| Recursive Descent | Parse expression with recursion |
| Shunting Yard | Convert to postfix notation |
| Built-in eval | Not allowed in interviews |

---

## Intuition

The key insight for this problem is using a **stack-based approach** to handle parentheses and maintain the current sign:

1. **Sign Tracking**: Keep track of the current sign (+1 or -1) that applies to the next number

2. **Stack for Parentheses**: When we encounter '(', we need to save the current result and sign, then start fresh for the sub-expression

3. **State Restoration**: When we encounter ')', we apply the saved sign to the sub-expression result and add it to the saved previous result

4. **Number Parsing**: Handle multi-digit numbers by accumulating digits

**Example walkthrough:**
For `s = "(1+(4+5+2)-3)+(6+8)"`:
- Start: result=0, sign=1
- '(' → push (0, 1), reset result=0, sign=1
- Parse 1: result=1
- '+' → sign=1
- '(' → push (1, 1), reset result=0
- Parse 4,5,2: result=11
- ')' → result = 11*1 + 1 = 12
- '-' → sign=-1
- 3 → result = 12 + (-1)*3 = 9
- ')' → result = 9*1 + 0 = 9
- '+' → sign=1
- '(' → push (9, 1), reset result=0
- Parse 6,8: result=14
- ')' → result = 14*1 + 9 = 23

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Stack-Based Evaluation (Optimal)** - O(N) time with stack
2. **Recursive Approach** - Alternative using recursion

---

## Approach 1: Stack-Based Evaluation (Optimal)

### Code Implementation

````carousel
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

<!-- slide -->
```cpp
#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    int calculate(string s) {
        stack<int> st;
        int result = 0;
        int num = 0;
        int sign = 1;
        
        for (int i = 0; i < s.length(); i++) {
            char c = s[i];
            
            if (isdigit(c)) {
                num = 0;
                while (i < s.length() && isdigit(s[i])) {
                    num = num * 10 + (s[i] - '0');
                    i++;
                }
                result += sign * num;
                i--; // adjust for the outer loop increment
            } else if (c == '+') {
                sign = 1;
            } else if (c == '-') {
                sign = -1;
            } else if (c == '(') {
                st.push(result);
                st.push(sign);
                result = 0;
                sign = 1;
            } else if (c == ')') {
                result *= st.top(); st.pop();
                result += st.top(); st.pop();
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.Stack;

class Solution {
    public int calculate(String s) {
        Stack<Integer> stack = new Stack<>();
        int result = 0;
        int num = 0;
        int sign = 1;
        
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            
            if (Character.isDigit(c)) {
                num = 0;
                while (i < s.length() && Character.isDigit(s.charAt(i))) {
                    num = num * 10 + (s.charAt(i) - '0');
                    i++;
                }
                result += sign * num;
                i--; // adjust for the outer loop increment
            } else if (c == '+') {
                sign = 1;
            } else if (c == '-') {
                sign = -1;
            } else if (c == '(') {
                stack.push(result);
                stack.push(sign);
                result = 0;
                sign = 1;
            } else if (c == ')') {
                result *= stack.pop();
                result += stack.pop();
            }
        }
        
        return result;
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
    let result = 0;
    let num = 0;
    let sign = 1;
    
    for (let i = 0; i < s.length; i++) {
        const c = s[i];
        
        if (!isNaN(c) && c !== ' ') {
            num = 0;
            while (i < s.length && !isNaN(s[i]) && s[i] !== ' ') {
                num = num * 10 + parseInt(s[i]);
                i++;
            }
            result += sign * num;
            i--; // adjust for the outer loop increment
        } else if (c === '+') {
            sign = 1;
        } else if (c === '-') {
            sign = -1;
        } else if (c === '(') {
            stack.push(result);
            stack.push(sign);
            result = 0;
            sign = 1;
        } else if (c === ')') {
            result *= stack.pop();
            result += stack.pop();
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N) - each character is processed once |
| **Space** | O(N) - worst case for deeply nested parentheses |

---

## Explanation

To evaluate the basic calculator expression, we use a stack-based approach to handle parentheses and maintain the current result and sign.

We initialize variables: `result` to accumulate the current sum, `num` for the current number, `sign` for the current operation (+ or -), and a stack to store intermediate results and signs when encountering parentheses.

We iterate through each character in the string:
- If it's a digit, we parse the full number and add it to the result with the current sign.
- If it's '+' or '-', we update the sign.
- If it's '(', we push the current result and sign onto the stack, reset result to 0, and set sign to 1.
- If it's ')', we multiply the current result by the sign from the stack (pop), then add the previous result from the stack (pop).

This handles nested expressions correctly. Spaces are ignored as they are not processed.

---

## Time Complexity
**O(N)** where N is the length of the string, as we process each character once.

---

## Space Complexity
**O(N)** in the worst case due to the stack for deeply nested parentheses.

---

---

## Approach 2: Recursive Evaluation

### Algorithm
This approach uses recursion to handle parentheses. Each recursive call processes a sub-expression until a closing parenthesis or end of string.

### Why It Works
When we encounter '(', we recursively process the sub-expression. When we encounter ')', we return the result of that sub-expression. The sign is passed down through recursion.

### Code Implementation

````carousel
```python
class Solution:
    def calculate(self, s: str) -> int:
        self.i = 0
        return self._parse(s)
    
    def _parse(self, s: str) -> int:
        result = 0
        num = 0
        sign = 1
        
        while self.i < len(s):
            c = s[self.i]
            
            if c.isdigit():
                num = 0
                while self.i < len(s) and s[self.i].isdigit():
                    num = num * 10 + int(s[self.i])
                    self.i += 1
                result += sign * num
            elif c == '+':
                sign = 1
                self.i += 1
            elif c == '-':
                sign = -1
                self.i += 1
            elif c == '(':
                self.i += 1
                num = self._parse(s)  # Recursively parse sub-expression
                result += sign * num
            elif c == ')':
                self.i += 1
                return result
            else:
                # Skip spaces
                self.i += 1
        
        return result
```

<!-- slide -->
```cpp
class Solution {
private:
    int i = 0;
    
    int parse(const string& s) {
        int result = 0;
        int num = 0;
        int sign = 1;
        
        while (i < s.length()) {
            char c = s[i];
            
            if (isdigit(c)) {
                num = 0;
                while (i < s.length() && isdigit(s[i])) {
                    num = num * 10 + (s[i] - '0');
                    i++;
                }
                result += sign * num;
            } else if (c == '+') {
                sign = 1;
                i++;
            } else if (c == '-') {
                sign = -1;
                i++;
            } else if (c == '(') {
                i++;
                num = parse(s);
                result += sign * num;
            } else if (c == ')') {
                i++;
                return result;
            } else {
                i++; // skip spaces
            }
        }
        
        return result;
    }
    
public:
    int calculate(string s) {
        i = 0;
        return parse(s);
    }
};
```

<!-- slide -->
```java
class Solution {
    private int i;
    
    private int parse(String s) {
        int result = 0;
        int num = 0;
        int sign = 1;
        
        while (i < s.length()) {
            char c = s.charAt(i);
            
            if (Character.isDigit(c)) {
                num = 0;
                while (i < s.length() && Character.isDigit(s.charAt(i))) {
                    num = num * 10 + (s.charAt(i) - '0');
                    i++;
                }
                result += sign * num;
            } else if (c == '+') {
                sign = 1;
                i++;
            } else if (c == '-') {
                sign = -1;
                i++;
            } else if (c == '(') {
                i++;
                num = parse(s);
                result += sign * num;
            } else if (c == ')') {
                i++;
                return result;
            } else {
                i++; // skip spaces
            }
        }
        
        return result;
    }
    
    public int calculate(String s) {
        i = 0;
        return parse(s);
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
    let i = 0;
    
    const parse = (s) => {
        let result = 0;
        let num = 0;
        let sign = 1;
        
        while (i < s.length) {
            const c = s[i];
            
            if (!isNaN(c) && c !== ' ') {
                num = 0;
                while (i < s.length && !isNaN(s[i]) && s[i] !== ' ') {
                    num = num * 10 + parseInt(s[i]);
                    i++;
                }
                result += sign * num;
            } else if (c === '+') {
                sign = 1;
                i++;
            } else if (c === '-') {
                sign = -1;
                i++;
            } else if (c === '(') {
                i++;
                num = parse(s);
                result += sign * num;
            } else if (c === ')') {
                i++;
                return result;
            } else {
                i++; // skip spaces
            }
        }
        
        return result;
    };
    
    return parse(s);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N) - each character is processed once |
| **Space** | O(D) - recursion depth equals max parentheses nesting |

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| [Basic Calculator II](/solutions/basic-calculator-ii.md) | 227 | Extended with * and / operators |
| [Expression Add Operators](/solutions/expression-add-operators.md) | 282 | Add any operators |
| [Different Ways to Add Parentheses](/solutions/different-ways-to-add-parentheses.md) | 2419 | All evaluation results |
| [Validate Stack Sequences](/solutions/validate-stack-sequences.md) | 946 | Stack manipulation |
| [Decode String](/solutions/decode-string.md) | 394 | Similar bracket handling |

---

## Video Tutorial Links

1. **[Basic Calculator - LeetCode 224](https://www.youtube.com/watch?v=XC2zI3jLMSk)** by NeetCode
2. **[Basic Calculator II](https://www.youtube.com/watch?v=XC2zI3jLMSk)** by NeetCode
3. **[Stack Based Calculator](https://www.youtube.com/watch?v=_24nGryz2X4)** by Back to Back SWE
3. **[Expression Evaluation](https://www.youtube.com/watch?v=3yXK怪hM0eM)** by Nick White

---

## Summary

The **Basic Calculator** problem demonstrates the **stack-based expression evaluation** pattern:

- **Stack for parentheses**: Stores previous results and signs when encountering '(' 
- **Sign tracking**: Maintains current sign to apply to following numbers
- **Number parsing**: Handles multi-digit numbers by accumulating digits
- **Efficiency**: O(N) time, O(N) space for worst case

Key insights:
1. Use stack to save state when entering parentheses
2. Restore state when exiting parentheses
3. Handle both '+' and '-' as sign operators
4. Multi-digit numbers require accumulation

This pattern extends to:
- Basic Calculator II (with * and /)
- Expression evaluation with variables
- More complex parsers

---

## Common Pitfalls

### 1. Not Handling Multi-digit Numbers
**Issue:** Only processing single-digit numbers instead of multi-digit integers.

**Solution:** Use a while loop to accumulate digits: `num = num * 10 + int(s[i])`.

### 2. Stack Order Confusion
**Issue:** Popping from stack in wrong order when handling ')'.

**Solution:** Remember sign is pushed first, then result. Pop in reverse order: result then sign.

### 3. Not Resetting After Parentheses
**Issue:** Not resetting result and sign after encountering '('.

**Solution:** After pushing to stack, reset result = 0 and sign = 1 for new sub-expression.

### 4. Ignoring Spaces
**Issue:** Not handling spaces in the input string.

**Solution:** Skip spaces in the loop (they don't affect the calculation).

---

## Follow-up Questions

### Q1: How would you add multiplication and division support?

**Answer:** Add a layer to handle operator precedence. Use a second stack for operators or evaluate multiplication/division immediately when encountered.

### Q2: How would you handle unary operators?

**Answer:** Track whether last token was an operator to determine if current '-' is unary. Update sign accordingly.

### Q3: Can you solve this without a stack using a recursive approach?

**Answer:** Yes, use recursion to handle parentheses. Each recursive call processes a sub-expression until ')' or end of string.

### Q4: How would you handle variables in the expression?

**Answer:** Use a dictionary to store variable values. When encountering a letter, look up the variable in the dictionary.

### Q5: How would you optimize for space complexity?

**Answer:** For expressions without nested parentheses, you can solve in O(1) space by processing sequentially without a stack.
