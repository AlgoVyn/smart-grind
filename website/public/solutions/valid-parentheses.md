# Valid Parentheses

## Problem Statement

LeetCode Problem 20: Valid Parentheses

Given a string `s` containing just the characters `'('`, `')'`, `'{'`, `'}'`, `'['`, and `']'`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order (last-in, first-out).
3. Every close bracket has a corresponding open bracket of the same type.

### Examples

Here are some examples to illustrate the problem:

- **Input:** `s = "()"`<br>
  **Output:** `true`<br>
  **Explanation:** A simple matched pair of parentheses.

- **Input:** `s = "()[]{}"`<br>
  **Output:** `true`<br>
  **Explanation:** All three types of brackets are opened and closed in the correct order without nesting issues.

- **Input:** `s = "(]"`<br>
  **Output:** `false`<br>
  **Explanation:** The opening parenthesis is not closed by a matching closing parenthesis; instead, it's mismatched with a closing bracket.

- **Input:** `s = "([])"`<br>
  **Output:** `true`<br>
  **Explanation:** The brackets are properly nested: square brackets inside parentheses, and both pairs are correctly closed.

- **Input:** `s = "([)]"`<br>
  **Output:** `false`<br>
  **Explanation:** The closing parenthesis attempts to close the opening bracket, violating the correct nesting order.

### Constraints

- `1 <= s.length <= 10^4`
- `s` consists only of the characters `'('`, `')'`, `'{'`, `'}'`, `'['`, and `']'`.

### Intuition

The key insight is that brackets follow a "last opened, first closed" rule, which naturally aligns with a stack data structure (LIFO: Last In, First Out). As we iterate through the string:

- When we encounter an opening bracket (`(`, `{`, or `[`), we push it onto the stack, anticipating a matching close later.
- When we encounter a closing bracket (`)`, `}`, or `]`), we check if the stack is non-empty and if the top of the stack matches the corresponding opening bracket. If it does, we pop the opening bracket from the stack; otherwise, the string is invalid.
- After processing the entire string, the stack should be empty if all brackets were properly matched and closed.

This approach ensures we handle both matching types and correct order. Mismatches in type or order (e.g., closing a bracket before its pair) will fail the checks.

If the string has an odd length, it can't be valid (unpaired bracket), but we don't need a separate check since the stack will handle it.

---

## Approach 1: Stack with Mapping Dictionary (Primary and Efficient)

Use a stack to track opening brackets and a dictionary to map closing brackets to their opening counterparts. This is the optimal approach with O(n) time complexity.

### Implementation

````carousel
```python
class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        mapping = {')': '(', '}': '{', ']': '['}
        
        for char in s:
            if char in mapping:  # It's a closing bracket
                if stack and stack[-1] == mapping[char]:
                    stack.pop()
                else:
                    return False
            else:  # It's an opening bracket
                stack.append(char)
        
        return not stack  # Stack should be empty for validity
```
<!-- slide -->
```java
import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        java.util.Map<Character, Character> mapping = new java.util.HashMap<>();
        mapping.put(')', '(');
        mapping.put('}', '{');
        mapping.put(']', '[');
        
        for (char c : s.toCharArray()) {
            if (mapping.containsKey(c)) { // It's a closing bracket
                if (!stack.isEmpty() && stack.peek() == mapping.get(c)) {
                    stack.pop();
                } else {
                    return false;
                }
            } else { // It's an opening bracket
                stack.push(c);
            }
        }
        
        return stack.isEmpty();
    }
}
```
<!-- slide -->
```cpp
#include <stack>
#include <unordered_map>
#include <string>

class Solution {
public:
    bool isValid(std::string s) {
        std::stack<char> stack;
        std::unordered_map<char, char> mapping = {
            {')', '('},
            {'}', '{'},
            {']', '['}
        };
        
        for (char c : s) {
            if (mapping.count(c)) { // It's a closing bracket
                if (!stack.empty() && stack.top() == mapping[c]) {
                    stack.pop();
                } else {
                    return false;
                }
            } else { // It's an opening bracket
                stack.push(c);
            }
        }
        
        return stack.empty();
    }
};
```
<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    const stack = [];
    const mapping = {')': '(', '}': '{', ']': '['};
    
    for (const char of s) {
        if (mapping[char]) { // It's a closing bracket
            if (stack.length > 0 && stack[stack.length - 1] === mapping[char]) {
                stack.pop();
            } else {
                return false;
            }
        } else { // It's an opening bracket
            stack.push(char);
        }
    }
    
    return stack.length === 0;
};
```
````

### Explanation Step-by-Step

1. Initialize an empty stack and a mapping dictionary for quick lookups of matching pairs.
2. Iterate through each character in `s`.
3. If it's a closing bracket, check if the stack's top matches the expected opening (via mapping). Pop if yes; return `false` if no or stack is empty.
4. If it's an opening bracket, push it onto the stack.
5. After iteration, return `true` only if the stack is empty (all openings were closed properly).

### Complexity Analysis

- **Time Complexity:** O(n) - We iterate through the string once, with O(1) operations per character (push/pop/check).
- **Space Complexity:** O(n) - In the worst case, the stack holds all characters (e.g., all opening brackets).

This is the optimal approach and widely used in interviews.

---

## Approach 2: Stack with Conditional Checks (Without Dictionary)

Similar to Approach 1, but use if-elif statements instead of a dictionary for matching. This can be slightly more verbose but avoids hash map overhead (negligible in practice).

### Implementation

````carousel
```python
class Solution:
    def isValid(self, s: str) -> bool:
        stack = []
        
        for char in s:
            if char in '({[':  # Opening brackets
                stack.append(char)
            else:  # Closing brackets
                if not stack:
                    return False
                top = stack.pop()
                if (char == ')' and top != '(') or \
                   (char == '}' and top != '{') or \
                   (char == ']' and top != '['):
                    return False
        
        return not stack
```
<!-- slide -->
```java
import java.util.Stack;

class Solution {
    public boolean isValid(String s) {
        Stack<Character> stack = new Stack<>();
        
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else {
                if (stack.isEmpty()) return false;
                char top = stack.pop();
                if ((c == ')' && top != '(') || 
                    (c == '}' && top != '{') || 
                    (c == ']' && top != '[')) {
                    return false;
                }
            }
        }
        
        return stack.isEmpty();
    }
}
```
<!-- slide -->
```cpp
#include <stack>
#include <string>

class Solution {
public:
    bool isValid(std::string s) {
        std::stack<char> stack;
        
        for (char c : s) {
            if (c == '(' || c == '{' || c == '[') {
                stack.push(c);
            } else {
                if (stack.empty()) return false;
                char top = stack.top();
                stack.pop();
                if ((c == ')' && top != '(') || 
                    (c == '}' && top != '{') || 
                    (c == ']' && top != '[')) {
                    return false;
                }
            }
        }
        
        return stack.empty();
    }
};
```
<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    const stack = [];
    
    for (const char of s) {
        if (char === '(' || char === '{' || char === '[') {
            stack.push(char);
        } else {
            if (stack.length === 0) return false;
            const top = stack.pop();
            if ((char === ')' && top !== '(') || 
                (char === '}' && top !== '{') || 
                (char === ']' && top !== '[')) {
                return false;
            }
        }
    }
    
    return stack.length === 0;
};
```
````

### Explanation Step-by-Step

1. Initialize an empty stack.
2. For each character: Push if opening; otherwise, pop the top and check if it matches the expected opening using conditionals.
3. Return `true` if the stack is empty at the end.

### Complexity Analysis

- **Time Complexity:** O(n) - Same as above.
- **Space Complexity:** O(n) - Same stack usage.

This is a minor variation, useful if you prefer avoiding dictionaries for simplicity in interviews.

---

## Approach 3: Recursive String Reduction

This approach mimics the "find and replace" logic. If a string is valid, it must contain at least one adjacent pair of matching parentheses (like `()`, `[]`, or `{}`). We remove that pair and solve for the remaining string. This is simple but inefficient for large strings.

### Implementation

````carousel
```python
def isValid(s: str) -> bool:
    # Base Case: An empty string is valid
    if len(s) == 0:
        return True
    
    # Try to find an adjacent matching pair
    if "()" in s:
        return isValid(s.replace("()", "", 1))  # Remove one pair and recurse
    elif "[]" in s:
        return isValid(s.replace("[]", "", 1))
    elif "{}" in s:
        return isValid(s.replace("{}", "", 1))
    else:
        # No matching pairs found, but string is not empty -> Invalid
        return False
```
<!-- slide -->
```java
class Solution {
    public boolean isValid(String s) {
        if (s.isEmpty()) return true;
        
        if (s.contains("()")) {
            return isValid(s.replaceFirst("\\(\\)", ""));
        } else if (s.contains("[]")) {
            return isValid(s.replaceFirst("\\[\\]", ""));
        } else if (s.contains("{}")) {
            return isValid(s.replaceFirst("\\{\\}", ""));
        } else {
            return false;
        }
    }
}
```
<!-- slide -->
```cpp
#include <string>
#include <iostream>

class Solution {
public:
    bool isValid(std::string s) {
        if (s.empty()) return true;
        
        size_t pos;
        if ((pos = s.find("()")) != std::string::npos) {
            return isValid(s.substr(0, pos) + s.substr(pos + 2));
        } else if ((pos = s.find("[]")) != std::string::npos) {
            return isValid(s.substr(0, pos) + s.substr(pos + 2));
        } else if ((pos = s.find("{}")) != std::string::npos) {
            return isValid(s.substr(0, pos) + s.substr(pos + 2));
        } else {
            return false;
        }
    }
};
```
<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    if (s.length === 0) return true;
    
    if (s.includes("()")) {
        return isValid(s.replace("()", ""));
    } else if (s.includes("[]")) {
        return isValid(s.replace("[]", ""));
    } else if (s.includes("{}")) {
        return isValid(s.replace("{}", ""));
    } else {
        return false;
    }
};
```
````

### Complexity Analysis

- **Time Complexity:** O(n²) due to repeated string searching and slicing.
- **Space Complexity:** O(n²) because each recursive call creates a new string in memory.

This approach is not recommended for large inputs but demonstrates the recursive pattern.

---

## Approach 4: Recursive Stack Simulation (Optimal Time)

In this approach, we use the **System Call Stack** to act as our data structure instead of an explicit `list`. We use an iterator or a shared index to move through the string. This avoids an explicit stack but uses the call stack instead.

### Implementation

````carousel
```python
def isValid(s: str) -> bool:
    # Use an iterator so all recursive calls share the same progress through the string
    it = iter(s)
    
    def helper(expected=None):
        try:
            while True:
                # Get the next character from the iterator
                char = next(it)
                
                # If we encounter an opening bracket, recurse
                if char == '(':
                    if not helper(')'): return False
                elif char == '[':
                    if not helper(']'): return False
                elif char == '{':
                    if not helper('}'): return False
                
                # If we encounter a closing bracket
                else:
                    # Check if it matches what the parent call is looking for
                    return char == expected
                    
        except StopIteration:
            # If we reach the end of the string, it's valid ONLY IF 
            # we weren't expecting a specific closing bracket.
            return expected is None

    return helper()
```
<!-- slide -->
```java
import java.util.Iterator;
import java.util.NoSuchElementException;

class Solution {
    public boolean isValid(String s) {
        Iterator<Character> it = new Iterator<>() {
            private int index = 0;
            
            @Override
            public boolean hasNext() {
                return index < s.length();
            }
            
            @Override
            public Character next() {
                if (!hasNext()) throw new NoSuchElementException();
                return s.charAt(index++);
            }
        };
        
        return helper(it, null);
    }
    
    private boolean helper(Iterator<Character> it, Character expected) {
        while (it.hasNext()) {
            char c = it.next();
            
            if (c == '(') {
                if (!helper(it, ')')) return false;
            } else if (c == '[') {
                if (!helper(it, ']')) return false;
            } else if (c == '{') {
                if (!helper(it, '}')) return false;
            } else {
                return c == expected;
            }
        }
        
        return expected == null;
    }
}
```
<!-- slide -->
```cpp
#include <iostream>
#include <string>

class Solution {
private:
    bool helper(const std::string& s, int& index, char expected) {
        while (index < s.length()) {
            char c = s[index++];
            
            if (c == '(') {
                if (!helper(s, index, ')')) return false;
            } else if (c == '[') {
                if (!helper(s, index, ']')) return false;
            } else if (c == '{') {
                if (!helper(s, index, '}')) return false;
            } else {
                return c == expected;
            }
        }
        
        return expected == '\0';
    }
    
public:
    bool isValid(std::string s) {
        int index = 0;
        return helper(s, index, '\0');
    }
};
```
<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function(s) {
    let index = 0;
    
    const helper = (expected) => {
        while (index < s.length) {
            const char = s[index++];
            
            if (char === '(') {
                if (!helper(')')) return false;
            } else if (char === '[') {
                if (!helper(']')) return false;
            } else if (char === '{') {
                if (!helper('}')) return false;
            } else {
                return char === expected;
            }
        }
        
        return expected === null;
    };
    
    return helper(null);
};
```
````

### How it works step-by-step for `s = "([])"`:

1. `isValid` calls `helper(null)`.
2. `helper` sees `(` → calls `helper(')')`.
3. New `helper` sees `[` → calls `helper(']')`.
4. Deepest `helper` sees `]` → matches `expected`, returns `true`.
5. Middle `helper` resumes, sees `)` → matches `expected`, returns `true`.
6. Top `helper` finishes string, returns `true`.

### Complexity Analysis

- **Time Complexity:** O(n) - Each character is processed exactly once.
- **Space Complexity:** O(n) - In the worst case, the call stack depth equals the nesting depth.

---

## Comparison of Approaches

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|-----------------|------------------|----------|
| Stack + Mapping Dictionary | O(n) | O(n) | **Recommended** - Most efficient and readable |
| Stack + Conditional Checks | O(n) | O(n) | Good when avoiding hash maps |
| Recursive String Reduction | O(n²) | O(n²) | Educational only - inefficient |
| Recursive Stack Simulation | O(n) | O(n) | Interesting alternative approach |

---

## Related Problems

Here are some LeetCode problems that build on similar concepts (stack usage, parentheses validation, or generation):

- [Generate Parentheses (Medium)](https://leetcode.com/problems/generate-parentheses/) - Generate all valid combinations of n pairs of parentheses.
- [Longest Valid Parentheses (Hard)](https://leetcode.com/problems/longest-valid-parentheses/) - Find the length of the longest valid parentheses substring.
- [Remove Invalid Parentheses (Hard)](https://leetcode.com/problems/remove-invalid-parentheses/) - Remove the minimum number of invalid parentheses to make the string valid.
- [Check If Word Is Valid After Substitutions (Medium)](https://leetcode.com/problems/check-if-word-is-valid-after-substitutions/) - Validate a string based on substitution rules similar to parentheses.
- [Check if a Parentheses String Can Be Valid (Medium)](https://leetcode.com/problems/check-if-a-parentheses-string-can-be-valid/) - Determine if a string with wildcards can become valid.
- [Move Pieces to Obtain a String (Medium)](https://leetcode.com/problems/move-pieces-to-obtain-a-string/) - Involves matching positions similar to bracket pairing.

---

## Video Tutorial Links

For visual explanations, here are some recommended YouTube tutorials:

- [Valid Parentheses (LeetCode 20) | Full solution with visuals and animations | Stack Data Structure](https://www.youtube.com/watch?v=TaWs8tIrnoA) - Includes animations for better understanding of the stack process.
- [Valid Parentheses - LeetCode 20 - Python](https://www.youtube.com/watch?v=yLPYrNDp26w) - Focuses on discovery-based problem-solving in Python.
- [LeetCode 20. Valid Parentheses Solution Explained - Java](https://www.youtube.com/watch?v=9kmUaXrjizQ) - Java implementation with step-by-step explanation.
- [Valid Parentheses - Leetcode 20 - Stacks (Python)](https://www.youtube.com/watch?v=7-_V-ufnF4c) - Concise Python solution with stack emphasis.

---

## Follow-up Questions

1. **How would you find the position of the first invalid bracket?**
   
   **Answer:** Modify the stack approach to store indices along with the brackets. When a mismatch is found, return the current index. If stack is empty when encountering a closing bracket, return that index. After processing, if stack is not empty, the first invalid position is the index of the first unclosed bracket.

2. **Can this problem be solved without a stack?**
   
   **Answer:** Yes, using counters for each bracket type can work for simple cases, but it fails to verify correct order. For example, ")( " would pass counters but is invalid. A better alternative is using the recursive approach (Approach 4) which uses the call stack instead of an explicit stack.

3. **How would you optimize for space complexity?**
   
   **Answer:** The stack-based approaches already use O(n) space which is optimal for this problem. For the half-reversal technique (used in palindrome problems), we can't apply it here since we need to verify the entire nesting structure, not just symmetry.

4. **What if you need to count minimum insertions needed to make the string valid?**
   
   **Answer:** Use dynamic programming. Create a 2D DP table where `dp[i][j]` represents the minimum insertions needed for substring `s[i:j+1]`. For each character, check if it matches with any character in the substring. This is similar to the "minimum insertions to form a palindrome" problem but with bracket matching instead of character matching.

5. **How would you handle Unicode brackets (like 「」, 『』)?**
   
   **Answer:** Extend the mapping dictionary to include all bracket pairs you need to support. The algorithm remains the same - you just need to ensure your mapping includes all opening and closing Unicode bracket characters. This works because the stack approach is generic for any matching pair symbols.

6. **How would you validate brackets in expressions with operators (e.g., `a + (b * c) - {d / [e]}`)?**
   
   **Answer:** The same algorithm works! The bracket validation only cares about the brackets themselves, not what's inside them. Simply ignore non-bracket characters (letters, operators, numbers) during iteration. Only push opening brackets and check closing brackets against the stack.

7. **How would you modify the solution to work with a stream of characters instead of a complete string?**
   
   **Answer:** Use a lazy validation approach. Process characters as they arrive, maintaining the stack. At the end of the stream, the stack must be empty for validity. You can also provide incremental validation - return false immediately when a mismatch is detected, or allow users to check partial validity at any point.

---

## LeetCode Link

[Valid Parentheses - LeetCode](https://leetcode.com/problems/valid-parentheses/)

