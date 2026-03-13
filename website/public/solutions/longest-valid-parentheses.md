# Longest Valid Parentheses

## Problem Description

Given a string containing just the characters `'('` and `')'`, return the length of the longest valid (well-formed) parentheses substring.

---

## Examples

### Example

**Input:** `s = "()"`

**Output:** `2`

**Explanation:** The longest valid parentheses substring is `"()"`.

### Example 2

**Input:** `s = "(()"`

**Output:** `2`

**Explanation:** The longest valid parentheses substring is `"()"`.

### Example 3

**Input:** `s = ")()())"`

**Output:** `4`

**Explanation:** The longest valid parentheses substring is `"()()"`.

### Example 4

**Input:** `s = ""`

**Output:** `0`

---

## Constraints

- `0 <= s.length <= 3 * 10^4`
- `s[i]` is `'('` or `')'`.

---

## LeetCode Link

[LeetCode Problem 32: Longest Valid Parentheses](https://leetcode.com/problems/longest-valid-parentheses/)

---

## Pattern: Stack - Boundary Tracking

This problem demonstrates the **Stack** pattern with boundary tracking. The key is using a stack to track indices of unmatched parentheses.

### Core Concept

- **Stack Storage**: Store indices of unmatched opening brackets
- **Boundary Marker**: Use -1 as initial base for calculations
- **Valid Length**: Current index - stack top gives valid length
- **Reset Point**: When stack empties, reset base to current index

---

## Intuition

The key insight is using a stack to track the **boundaries** of valid parentheses:

> The stack stores indices of unmatched parentheses, and the distance between current position and stack top gives the length of valid substring.

### Key Observations

1. **Boundary Tracking**: The stack keeps track of indices that couldn't be matched
2. **Reset Mechanism**: When we can't form more valid substrings, reset the base
3. **Two Passes**: Some solutions require scanning from both directions
4. **Space Optimization**: Can also solve with O(1) space using two counters

### Why Stack Works

The stack algorithm works because:
1. Stack keeps track of unmatched '(' positions
2. When ')' matches, we calculate length from last valid position
3. Empty stack means no valid substring ends at current position
4. Reset base when we can't form more valid parentheses

---

## Multiple Approaches with Code

We'll cover two approaches:
1. **Stack-based** - Classic solution with O(n) time
2. **Two Counters** - O(1) space solution

---

## Approach 1: Stack-based Solution

### Algorithm Steps

1. Initialize stack with -1 (base index)
2. Iterate through each character:
   - If '(', push index onto stack
   - If ')', pop from stack
     - If stack becomes empty, push current index as new base
     - Otherwise, calculate length: current index - stack top
3. Return maximum length found

### Why It Works

The -1 initial base acts as a boundary marker. When we pop and the stack is not empty, the distance from current index to new top gives valid substring length.

### Code Implementation

````carousel
```python
class Solution:
    def longestValidParentheses(self, s: str) -> int:
        """
        Find longest valid parentheses substring using stack.
        
        Args:
            s: String containing only '(' and ')'
            
        Returns:
            Length of longest valid parentheses substring
        """
        stack = [-1]  # Initialize with -1 as base
        max_len = 0
        
        for i, c in enumerate(s):
            if c == '(':
                stack.append(i)
            else:
                # Pop matched '('
                stack.pop()
                if not stack:
                    # No match, push current index as new base
                    stack.append(i)
                else:
                    # Calculate valid length
                    max_len = max(max_len, i - stack[-1])
        
        return max_len
```

<!-- slide -->
```cpp
class Solution {
public:
    int longestValidParentheses(string s) {
        stack<int> st;
        st.push(-1);  // Base index
        int max_len = 0;
        
        for (int i = 0; i < s.length(); i++) {
            if (s[i] == '(') {
                st.push(i);
            } else {
                st.pop();
                if (st.empty()) {
                    st.push(i);
                } else {
                    max_len = max(max_len, i - st.top());
                }
            }
        }
        
        return max_len;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int longestValidParentheses(String s) {
        Stack<Integer> stack = new Stack<>();
        stack.push(-1);  // Base index
        int max_len = 0;
        
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '(') {
                stack.push(i);
            } else {
                stack.pop();
                if (stack.isEmpty()) {
                    stack.push(i);
                } else {
                    max_len = Math.max(max_len, i - stack.peek());
                }
            }
        }
        
        return max_len;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {number}
 */
var longestValidParentheses = function(s) {
    const stack = [-1];
    let maxLen = 0;
    
    for (let i = 0; i < s.length; i++) {
        if (s[i] === '(') {
            stack.push(i);
        } else {
            stack.pop();
            if (stack.length === 0) {
                stack.push(i);
            } else {
                maxLen = Math.max(maxLen, i - stack[stack.length - 1]);
            }
        }
    }
    
    return maxLen;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through string |
| **Space** | O(n) - Stack can grow to n |

---

## Approach 2: Two Counters (O(1) Space)

### Algorithm Steps

1. Scan left to right:
   - Track open and close counts
   - When open == close, calculate length
   - When close > open, reset counts
2. Scan right to left (to catch edge cases):
   - Track open and close counts
   - When open == close, calculate length
   - When open > close, reset counts
3. Return maximum length

### Why It Works

The two-pass approach catches all valid substrings. The first pass handles cases starting with '(', the second pass handles cases starting with ')'.

### Code Implementation

````carousel
```python
class Solution:
    def longestValidParentheses(self, s: str) -> int:
        """
        Find longest valid parentheses using two passes - O(1) space.
        """
        max_len = 0
        left = right = 0
        
        # Left to right pass
        for c in s:
            if c == '(':
                left += 1
            else:
                right += 1
            
            if left == right:
                max_len = max(max_len, 2 * right)
            elif right > left:
                left = right = 0
        
        left = right = 0
        
        # Right to left pass
        for c in reversed(s):
            if c == '(':
                left += 1
            else:
                right += 1
            
            if left == right:
                max_len = max(max_len, 2 * left)
            elif left > right:
                left = right = 0
        
        return max_len
```

<!-- slide -->
```cpp
class Solution {
public:
    int longestValidParentheses(string s) {
        int max_len = 0;
        int left = 0, right = 0;
        
        // Left to right
        for (char c : s) {
            if (c == '(') left++;
            else right++;
            
            if (left == right) {
                max_len = max(max_len, 2 * right);
            } else if (right > left) {
                left = right = 0;
            }
        }
        
        left = right = 0;
        
        // Right to left
        for (int i = s.length() - 1; i >= 0; i--) {
            if (s[i] == '(') left++;
            else right++;
            
            if (left == right) {
                max_len = max(max_len, 2 * left);
            } else if (left > right) {
                left = right = 0;
            }
        }
        
        return max_len;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int longestValidParentheses(String s) {
        int maxLen = 0;
        int left = 0, right = 0;
        
        // Left to right
        for (int i = 0; i < s.length(); i++) {
            if (s.charAt(i) == '(') left++;
            else right++;
            
            if (left == right) {
                maxLen = Math.max(maxLen, 2 * right);
            } else if (right > left) {
                left = right = 0;
            }
        }
        
        left = right = 0;
        
        // Right to left
        for (int i = s.length() - 1; i >= 0; i--) {
            if (s.charAt(i) == '(') left++;
            else right++;
            
            if (left == right) {
                maxLen = Math.max(maxLen, 2 * left);
            } else if (left > right) {
                left = right = 0;
            }
        }
        
        return maxLen;
    }
}
```

<!-- slide -->
```javascript
var longestValidParentheses = function(s) {
    let maxLen = 0;
    let left = 0, right = 0;
    
    // Left to right
    for (const c of s) {
        if (c === '(') left++;
        else right++;
        
        if (left === right) {
            maxLen = Math.max(maxLen, 2 * right);
        } else if (right > left) {
            left = right = 0;
        }
    }
    
    left = right = 0;
    
    // Right to left
    for (let i = s.length - 1; i >= 0; i--) {
        if (s[i] === '(') left++;
        else right++;
        
        if (left === right) {
            maxLen = Math.max(maxLen, 2 * left);
        } else if (left > right) {
            left = right = 0;
        }
    }
    
    return maxLen;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Two passes |
| **Space** | O(1) - Only counters |

---

## Comparison of Approaches

| Aspect | Stack | Two Counters |
|--------|-------|--------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(n) | O(1) |
| **Implementation** | Simple | Moderate |

**Best Approach:** Use stack for clarity, two counters for O(1) space.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Amazon, Microsoft
- **Difficulty**: Hard
- **Concepts Tested**: Stack, String Manipulation, Dynamic Programming

### Learning Outcomes

1. **Stack Applications**: Master stack for boundary tracking
2. **Space Optimization**: Learn to reduce space complexity
3. **Edge Cases**: Handle various string patterns

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Valid Parentheses | [Link](https://leetcode.com/problems/valid-parentheses/) | Basic validation |
| Minimum Add to Make Parentheses Valid | [Link](https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/) | Minimum additions |

---

## Video Tutorial Links

1. **[NeetCode - Longest Valid Parentheses](https://www.youtube.com/watch?v=3MDBXcBYBc)** - Clear explanation
2. **[Longest Valid - LeetCode 32](https://www.youtube.com/watch?v=3MDBXcBYBc)** - Detailed walkthrough

---

## Follow-up Questions

### Q1: How would you find the actual substring, not just its length?

**Answer:** Track the starting position along with the maximum length, then extract the substring.

---

### Q2: Can you solve this using dynamic programming?

**Answer:** Yes, use DP where dp[i] = length of valid substring ending at i.

---

### Q3: How would you handle other types of brackets?

**Answer:** Extend the solution to handle [], {} by using a stack that stores all bracket types.

---

## Common Pitfalls

### 1. Not Initializing Stack with -1
**Issue**: Starting with empty stack causes incorrect length calculations.

**Solution**: Initialize stack with `-1` as base index.

### 2. Not Handling Empty Stack After Pop
**Issue**: Accessing stack[-1] when stack might be empty after pop.

**Solution**: Check `if stack:` before accessing stack[-1].

### 3. Forgetting to Reset Base
**Issue**: Not updating base when stack becomes empty.

**Solution**: Push current index to stack when it becomes empty.

### 4. Wrong Length Calculation
**Issue**: Using wrong formula for valid length.

**Solution**: Length = i - stack[-1] (not i - stack[-1] - 1).

---

## Summary

The **Longest Valid Parentheses** problem demonstrates the **Stack** pattern with boundary tracking.

### Key Takeaways

1. **Stack Initialization**: Start with -1 as base index for boundary tracking
2. **Index Storage**: Store indices, not characters, for length calculations
3. **Boundary Reset**: When stack empties, reset base to current index
4. **Single Pass**: O(n) time with O(n) space, or O(1) space with two passes

### Pattern Summary

This problem exemplifies the **Stack - Boundary Tracking** pattern, characterized by:
- Using stack to store indices/positions for reference
- Tracking boundaries for valid segments
- Resetting when no more valid segments can form

For more details on this pattern, see the **[Stack Pattern](/patterns/stack)**.

---

## Additional Resources

- [LeetCode Problem 32](https://leetcode.com/problems/longest-valid-parentheses/) - Official problem page
- [Stack - GeeksforGeeks](https://www.geeksforgeeks.org/stack-data-structure/) - Detailed explanation
- [Pattern: Stack](/patterns/stack) - Comprehensive pattern guide
