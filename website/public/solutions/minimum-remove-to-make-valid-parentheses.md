# Minimum Remove To Make Valid Parentheses

## Problem Description

Given a string `s` of `'('`, `')'` and lowercase English characters. Your task is to remove the minimum number of parentheses (`'('` or `')'`, in any positions) so that the resulting parentheses string is valid and return any valid string.

Formally, a parentheses string is valid if and only if:

- It is the empty string, contains only lowercase characters, or
- It can be written as `AB` (A concatenated with B), where A and B are valid strings, or
- It can be written as `(A)`, where A is a valid string

**LeetCode Link:** [LeetCode 1249 - Minimum Remove to Make Valid Parentheses](https://leetcode.com/problems/minimum-remove-to-make-valid-parentheses/)

---

## Examples

### Example 1

**Input:**
```python
s = "lee(t(c)o)de)"
```

**Output:**
```python
"lee(t(c)o)de"
```

**Explanation:**
`"lee(t(co)de)"`, `"lee(t(c)ode)"` would also be accepted.

### Example 2

**Input:**
```python
s = "a)b(c)d"
```

**Output:**
```python
"ab(c)d"
```

### Example 3

**Input:**
```python
s = "))(("
```

**Output:**
```python
""
```

**Explanation:**
An empty string is also valid.

---

## Constraints

- `1 <= s.length <= 10^5`
- `s[i]` is either `'('`, `')'`, or lowercase English letter

---

## Pattern: Stack-based Parentheses Validation

This problem uses the **Stack** pattern to track unmatched parentheses. First pass finds mismatched ')', second pass handles remaining '('.

---

## Intuition

The key insight for this problem is understanding that valid parentheses must have matching pairs in the correct order. We need to identify two types of invalid parentheses:

1. **Unmatched closing ')':** When we encounter a ')' but there's no matching '(' before it
2. **Unmatched opening '(':** When we're done processing and there are '(' left in the stack without matching ')'

### Key Observations

1. **Stack Tracks Indices**: Instead of storing characters, we store indices. This allows us to mark which characters need to be removed.

2. **Two-Pass Approach**: A single pass isn't enough because:
   - First pass catches excess ')' (unmatched closing)
   - Second pass handles remaining '(' (unmatched opening)

3. **Set for O(1) Lookup**: Using a set to store indices to remove provides O(1) lookup when building the result.

4. **Character Preservation**: Lowercase letters are always valid and should never be removed.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Stack-based Two-Pass** - Optimal solution
2. **Balanced String Builder** - Alternative approach

---

## Approach 1: Stack-based Two-Pass (Optimal)

### Algorithm Steps

1. **First pass**: Iterate through the string
   - For '(' : push index onto stack
   - For ')' : if stack not empty, pop (found match); else add index to remove set

2. **Second pass**: Add remaining stack indices (unmatched '(') to remove set

3. **Build result**: Exclude all indices in remove set

### Why It Works

The stack keeps track of unmatched '(' indices. When we see a ')', if there's an unmatched '(' available, we pop it (they match). If the stack is empty, this ')' has no matching '(' and must be removed. At the end, any '(' remaining in the stack have no matching ')'.

### Code Implementation

````carousel
```python
class Solution:
    def minRemoveToMakeValid(self, s: str) -> str:
        """
        Remove minimum parentheses to make the string valid.
        
        Uses a stack to track indices of unmatched '('.
        Time: O(n), Space: O(n)
        """
        stack = []
        to_remove = set()
        
        # First pass: find unmatched ')'
        for i, c in enumerate(s):
            if c == '(':
                stack.append(i)
            elif c == ')':
                if stack:
                    stack.pop()
                else:
                    to_remove.add(i)
        
        # Add remaining unmatched '(' to remove set
        to_remove.update(stack)
        
        # Build result string excluding removed indices
        result = []
        for i, c in enumerate(s):
            if i not in to_remove:
                result.append(c)
        
        return ''.join(result)
```

<!-- slide -->
```cpp
#include <string>
#include <unordered_set>
#include <stack>
#include <vector>
using namespace std;

class Solution {
public:
    string minRemoveToMakeValid(string s) {
        stack<int> st;
        unordered_set<int> toRemove;
        
        // First pass: find unmatched ')'
        for (int i = 0; i < s.length(); i++) {
            if (s[i] == '(') {
                st.push(i);
            } else if (s[i] == ')') {
                if (!st.empty()) {
                    st.pop();
                } else {
                    toRemove.insert(i);
                }
            }
        }
        
        // Add remaining unmatched '(' to remove set
        while (!st.empty()) {
            toRemove.insert(st.top());
            st.pop();
        }
        
        // Build result string
        string result;
        for (int i = 0; i < s.length(); i++) {
            if (toRemove.find(i) == toRemove.end()) {
                result += s[i];
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public String minRemoveToMakeValid(String s) {
        Stack<Integer> stack = new Stack<>();
        Set<Integer> toRemove = new HashSet<>();
        
        // First pass: find unmatched ')'
        for (int i = 0; i < s.length(); i++) {
            char c = s.charAt(i);
            if (c == '(') {
                stack.push(i);
            } else if (c == ')') {
                if (!stack.isEmpty()) {
                    stack.pop();
                } else {
                    toRemove.add(i);
                }
            }
        }
        
        // Add remaining unmatched '(' to remove set
        while (!stack.isEmpty()) {
            toRemove.add(stack.pop());
        }
        
        // Build result string
        StringBuilder result = new StringBuilder();
        for (int i = 0; i < s.length(); i++) {
            if (!toRemove.contains(i)) {
                result.append(s.charAt(i));
            }
        }
        
        return result.toString();
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {string}
 */
var minRemoveToMakeValid = function(s) {
    const stack = [];
    const toRemove = new Set();
    
    // First pass: find unmatched ')'
    for (let i = 0; i < s.length; i++) {
        if (s[i] === '(') {
            stack.push(i);
        } else if (s[i] === ')') {
            if (stack.length > 0) {
                stack.pop();
            } else {
                toRemove.add(i);
            }
        }
    }
    
    // Add remaining unmatched '(' to remove set
    while (stack.length > 0) {
        toRemove.add(stack.pop());
    }
    
    // Build result string
    let result = '';
    for (let i = 0; i < s.length; i++) {
        if (!toRemove.has(i)) {
            result += s[i];
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n), single pass through string plus result building |
| **Space** | O(n), for stack and remove set |

---

## Approach 2: Balanced String Builder (Alternative)

### Algorithm Steps

1. **First pass**: Build string without unmatched ')'
   - Use a stack to track '(' indices
   - Skip characters that need removal

2. **Second pass**: Process the string from step 1 in reverse to handle remaining '('

### Why It Works

By processing in two directions, we handle both types of imbalances - too many closing and too many opening parentheses.

### Code Implementation

````carousel
```python
class Solution:
    def minRemoveToMakeValid(self, s: str) -> str:
        """
        Alternative: Balanced string builder approach.
        """
        # First pass: remove excess ')'
        s1 = []
        balance = 0
        
        for c in s:
            if c == '(':
                balance += 1
                s1.append(c)
            elif c == ')':
                if balance > 0:
                    balance -= 1
                    s1.append(c)
            else:
                s1.append(c)
        
        # Second pass: remove excess '(' from end
        s2 = []
        balance = 0
        
        for c in reversed(s1):
            if c == ')':
                balance += 1
                s2.append(c)
            elif c == '(':
                if balance > 0:
                    balance -= 1
                    s2.append(c)
            else:
                s2.append(c)
        
        return ''.join(reversed(s2))
```

<!-- slide -->
```cpp
#include <string>
#include <algorithm>
using namespace std;

class Solution {
public:
    string minRemoveToMakeValid(string s) {
        string s1;
        int balance = 0;
        
        // First pass: remove excess ')'
        for (char c : s) {
            if (c == '(') {
                balance++;
                s1 += c;
            } else if (c == ')') {
                if (balance > 0) {
                    balance--;
                    s1 += c;
                }
            } else {
                s1 += c;
            }
        }
        
        // Second pass: remove excess '(' from end
        string s2;
        balance = 0;
        
        for (auto it = s1.rbegin(); it != s1.rend(); ++it) {
            char c = *it;
            if (c == ')') {
                balance++;
                s2 += c;
            } else if (c == '(') {
                if (balance > 0) {
                    balance--;
                    s2 += c;
                }
            } else {
                s2 += c;
            }
        }
        
        reverse(s2.begin(), s2.end());
        return s2;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String minRemoveToMakeValid(String s) {
        // First pass: remove excess ')'
        StringBuilder s1 = new StringBuilder();
        int balance = 0;
        
        for (char c : s.toCharArray()) {
            if (c == '(') {
                balance++;
                s1.append(c);
            } else if (c == ')') {
                if (balance > 0) {
                    balance--;
                    s1.append(c);
                }
            } else {
                s1.append(c);
            }
        }
        
        // Second pass: remove excess '(' from end
        StringBuilder s2 = new StringBuilder();
        balance = 0;
        
        for (int i = s1.length() - 1; i >= 0; i--) {
            char c = s1.charAt(i);
            if (c == ')') {
                balance++;
                s2.append(c);
            } else if (c == '(') {
                if (balance > 0) {
                    balance--;
                    s2.append(c);
                }
            } else {
                s2.append(c);
            }
        }
        
        return s2.reverse().toString();
    }
}
```

<!-- slide -->
```javascript
var minRemoveToMakeValid = function(s) {
    // First pass: remove excess ')'
    let s1 = [];
    let balance = 0;
    
    for (const c of s) {
        if (c === '(') {
            balance++;
            s1.push(c);
        } else if (c === ')') {
            if (balance > 0) {
                balance--;
                s1.push(c);
            }
        } else {
            s1.push(c);
        }
    }
    
    // Second pass: remove excess '(' from end
    let s2 = [];
    balance = 0;
    
    for (let i = s1.length - 1; i >= 0; i--) {
        const c = s1[i];
        if (c === ')') {
            balance++;
            s2.push(c);
        } else if (c === '(') {
            if (balance > 0) {
                balance--;
                s2.push(c);
            }
        } else {
            s2.push(c);
        }
    }
    
    return s2.reverse().join('');
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n), two passes through string |
| **Space** | O(n), for intermediate strings |

---

## Comparison of Approaches

| Aspect | Stack Two-Pass | Balanced Builder |
|--------|----------------|------------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(n) | O(n) |
| **Implementation** | Clear and intuitive | Slightly more complex |
| **LeetCode Optimal** | ✅ | ✅ |

**Best Approach:** Approach 1 (Stack Two-Pass) is recommended for its clarity and directness.

---

## Common Pitfalls

- **Set vs list for removal**: Using a set provides O(1) lookup but list concatenation works too
- **Two-pass required**: Single pass isn't enough - must handle both ')' excess and '(' excess
- **Character handling**: Only parentheses need validation, lowercase letters are always valid
- **Not handling empty stack**: Always check if stack is empty before popping
- **Index vs character storage**: Store indices in stack, not characters, to identify removal positions

---

## Related Problems

Based on similar themes (Stack, Parentheses, String Validation):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Valid Parentheses | [Link](https://leetcode.com/problems/valid-parentheses/) | Basic parentheses validation |
| Longest Valid Parentheses | [Link](https://leetcode.com/problems/longest-valid-parentheses/) | Find longest valid substring |
| Minimum Insertions to Balance a String | [Link](https://leetcode.com/problems/minimum-insertions-to-balance-a-string/) | Similar string balancing |
| Score of Parentheses | [Link](https://leetcode.com/problems/score-of-parentheses/) | Calculate parentheses score |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

1. **[NeetCode - Minimum Remove to Make Valid Parentheses](https://www.youtube.com/watch?v=00moW_a6kjE)** - Clear explanation with visual examples
2. **[LeetCode 1249 - Solution Walkthrough](https://www.youtube.com/watch?v=8YT2S2WYUkw)** - Detailed walkthrough
3. **[Stack Pattern Tutorial](https://www.youtube.com/watch?v=WTzjTskDFMg)** - Understanding stack-based solutions

---

## Follow-up Questions

### Q1: How would you modify the solution to return all possible valid strings?

**Answer:** Instead of returning just one result, collect all valid combinations. This can be done by tracking which characters can potentially be removed and generating all valid permutations, but this would be O(2^n) in the worst case.

---

### Q2: What if we needed to minimize the number of insertions instead of removals?

**Answer:** This is a similar problem - "Minimum Insertions to Balance a String". The approach would be similar but instead of marking for removal, you'd track insertions needed to balance.

---

### Q3: Can you solve this using a different data structure?

**Answer:** Yes, you could use a linked list or array-based approach where you physically remove characters by adjusting indices, but the stack-based approach is cleaner and more intuitive.

---

### Q4: How would you handle other types of brackets (like {} or [])?

**Answer:** You'd need separate stacks for each bracket type, or use a single stack that stores both the character and its position. The logic extends naturally to multiple bracket types.

---

### Q5: What edge cases should you test?

**Answer:**
- Empty string
- String with no parentheses
- String with only opening parentheses
- String with only closing parentheses
- String already valid
- String with all invalid parentheses
- String with lowercase letters mixed in

---

## Summary

The **Minimum Remove to Make Valid Parentheses** problem demonstrates the power of the **Stack** pattern for handling balanced parentheses validation.

Key takeaways:
1. Use a stack to track unmatched '(' indices
2. Two-pass approach handles both excess ')' and excess '('
3. Set provides O(1) lookup for removal
4. Time complexity is O(n), space is O(n)

This problem is essential for understanding stack-based string manipulation and forms the foundation for more complex bracket matching problems.

### Pattern Summary

This problem exemplifies the **Stack** pattern, characterized by:
- Using LIFO (Last In First Out) to match pairs
- Tracking positions for later reference
- Two-pass processing for comprehensive validation
- Linear time and space complexity

For more details on this pattern and its variations, see the **[Stack Pattern](/patterns/stack)**.
