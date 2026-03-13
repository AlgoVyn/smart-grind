# Minimum Add to Make Parentheses Valid

## Problem Description

A parentheses string is valid if and only if:

- It is an empty string
- It can be written as `AB` (concatenation of two valid strings)
- It can be written as `(A)` where `A` is a valid string

You are given a parentheses string `s`. In one move, you can **insert a parenthesis at any position**.

Return the **minimum number of moves** required to make `s` valid.

---

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `s = "())"` | `1` |

**Explanation:** Insert `'('` at the beginning to make `"(() )"`.

**Example 2:**

| Input | Output |
|-------|--------|
| `s = "((("` | `3` |

**Explanation:** Insert `')'` at the end three times to make `"((()))"`.

---

## Constraints

- `1 <= s.length <= 1000`
- `s[i]` is either `'('` or `')'`

---

## Pattern: Stack-based Parentheses Validation

This problem is a classic example of the **Stack-based Parentheses Validation** pattern. The pattern involves tracking the balance of opening and closing parentheses to determine the minimum insertions needed.

### Core Concept

The fundamental idea is using a **balance counter** to track unmatched opening parentheses:
- Increment balance for `'('`
- Decrement balance for `')'`
- When balance goes negative, we need to insert an opening parenthesis
- At the end, remaining balance indicates how many closing parentheses are needed

---

## Intuition

The key insight is that we only need to track the current "balance" of unmatched opening parentheses:

1. **Unmatched closing**: When we see a `')'` but have no unmatched `'('`, we need to insert one
2. **Unmatched opening**: After processing all characters, any remaining `'('` need a `')'`

This is much simpler than using an actual stack since we only care about the count, not the positions.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Balance Counter (Optimal)** - O(n) time, O(1) space
2. **Stack-based** - O(n) time, O(n) space
3. **Two-pass Counter** - O(n) time, O(1) space

---

## Approach 1: Balance Counter (Optimal)

This is the most efficient approach with O(1) extra space. We use a simple counter to track the balance of parentheses.

### Algorithm Steps

1. Initialize `ans = 0` (total insertions needed) and `bal = 0` (current balance)
2. Iterate through each character:
   - If `'('`: increment `bal`
   - If `')'`: decrement `bal`
     - If `bal < 0`: we have unmatched `')'`, need to insert `'('` → `ans += 1`, reset `bal = 0`
3. After loop: `bal` holds unmatched `'('`, each needs `')'` → `ans += bal`
4. Return `ans`

### Code Implementation

````carousel
```python
class Solution:
    def minAddToMakeValid(self, s: str) -> int:
        """
        Track balance of opening parentheses.
        Returns the minimum insertions needed.
        
        Args:
            s: String containing only '(' and ')' characters
            
        Returns:
            Minimum number of insertions needed to make string valid
        """
        ans = 0      # Total insertions needed
        bal = 0      # Current balance of '(' minus ')'
        
        for c in s:
            if c == '(':
                bal += 1
            else:  # c == ')'
                bal -= 1
                if bal < 0:
                    # Need to insert '(' before this ')'
                    ans += 1
                    bal = 0  # Reset balance after insertion
        
        # Remaining '(' need closing ')'
        ans += bal
        return ans
```

<!-- slide -->
```cpp
class Solution {
public:
    /**
     * Track balance of opening parentheses.
     * Returns the minimum insertions needed.
     */
    int minAddToMakeValid(string s) {
        int ans = 0;      // Total insertions needed
        int bal = 0;      // Current balance of '(' minus ')'
        
        for (char c : s) {
            if (c == '(') {
                bal++;
            } else {  // c == ')'
                bal--;
                if (bal < 0) {
                    // Need to insert '(' before this ')'
                    ans++;
                    bal = 0;  // Reset balance after insertion
                }
            }
        }
        
        // Remaining '(' need closing ')'
        ans += bal;
        return ans;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minAddToMakeValid(String s) {
        int ans = 0;      // Total insertions needed
        int bal = 0;      // Current balance of '(' minus ')'
        
        for (char c : s.toCharArray()) {
            if (c == '(') {
                bal++;
            } else {  // c == ')'
                bal--;
                if (bal < 0) {
                    // Need to insert '(' before this ')'
                    ans++;
                    bal = 0;  // Reset balance after insertion
                }
            }
        }
        
        // Remaining '(' need closing ')'
        ans += bal;
        return ans;
    }
}
```

<!-- slide -->
```javascript
/**
 * Track balance of opening parentheses.
 * Returns the minimum insertions needed.
 * 
 * @param {string} s - String containing only '(' and ')' characters
 * @return {number} - Minimum number of insertions needed
 */
var minAddToMakeValid = function(s) {
    let ans = 0;      // Total insertions needed
    let bal = 0;      // Current balance of '(' minus ')'
    
    for (const c of s) {
        if (c === '(') {
            bal++;
        } else {  // c === ')'
            bal--;
            if (bal < 0) {
                // Need to insert '(' before this ')'
                ans++;
                bal = 0;  // Reset balance after insertion
            }
        }
    }
    
    // Remaining '(' need closing ')'
    ans += bal;
    return ans;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through the string |
| **Space** | O(1) - Only two integer variables used |

---

## Approach 2: Stack-based Approach

This approach uses an actual stack data structure to track unmatched parentheses. While less space-efficient, it provides a clear mental model.

### Algorithm Steps

1. Create an empty stack
2. For each character:
   - If `'('`: push onto stack
   - If `')'`: 
     - If stack top is `'('`: pop (they match)
     - Else: push `')'` (unmatched closing)
3. Stack size = minimum insertions needed

### Code Implementation

````carousel
```python
class Solution:
    def minAddToMakeValid_stack(self, s: str) -> int:
        """
        Use stack to track unmatched parentheses.
        
        Args:
            s: String containing only '(' and ')' characters
            
        Returns:
            Minimum number of insertions needed
        """
        stack = []
        
        for c in s:
            if c == '(':
                stack.append(c)
            else:  # c == ')'
                if stack and stack[-1] == '(':
                    stack.pop()  # Match found
                else:
                    stack.append(c)  # Unmatched closing
        
        return len(stack)
```

<!-- slide -->
```cpp
class Solution {
public:
    int minAddToMakeValid(string s) {
        /**
         * Use stack to track unmatched parentheses.
         */
        vector<char> stack;
        
        for (char c : s) {
            if (c == '(') {
                stack.push_back(c);
            } else {  // c == ')'
                if (!stack.empty() && stack.back() == '(') {
                    stack.pop_back();  // Match found
                } else {
                    stack.push_back(c);  // Unmatched closing
                }
            }
        }
        
        return stack.size();
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minAddToMakeValid(String s) {
        /**
         * Use stack to track unmatched parentheses.
         */
        Stack<Character> stack = new Stack<>();
        
        for (char c : s.toCharArray()) {
            if (c == '(') {
                stack.push(c);
            } else {  // c == ')'
                if (!stack.isEmpty() && stack.peek() == '(') {
                    stack.pop();  // Match found
                } else {
                    stack.push(c);  // Unmatched closing
                }
            }
        }
        
        return stack.size();
    }
}
```

<!-- slide -->
```javascript
/**
 * Use stack to track unmatched parentheses.
 * 
 * @param {string} s - String containing only '(' and ')' characters
 * @return {number} - Minimum number of insertions needed
 */
var minAddToMakeValid = function(s) {
    const stack = [];
    
    for (const c of s) {
        if (c === '(') {
            stack.push(c);
        } else {  // c === ')'
            if (stack.length > 0 && stack[stack.length - 1] === '(') {
                stack.pop();  // Match found
            } else {
                stack.push(c);  // Unmatched closing
            }
        }
    }
    
    return stack.length;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through the string |
| **Space** | O(n) - Stack can hold up to n characters |

---

## Approach 3: Two-Pass Counter

This approach uses two passes: first to handle unmatched closing parentheses, then to handle unmatched opening parentheses.

### Algorithm Steps

1. **First pass (left to right)**: Count unmatched closing parentheses
   - Use a counter, increment for `'('`, decrement for `')'`
   - When counter goes negative, increment result and reset counter
2. **Second pass (right to left)**: Count unmatched opening parentheses
   - Use a counter, increment for `')'`, decrement for `'('`
   - When counter goes negative, increment result and reset counter
3. Return the sum of both passes

### Code Implementation

````carousel
```python
class Solution:
    def minAddToMakeValid_twopass(self, s: str) -> int:
        """
        Two-pass approach to count both types of unmatched parentheses.
        
        Args:
            s: String containing only '(' and ')' characters
            
        Returns:
            Minimum number of insertions needed
        """
        # First pass: handle unmatched ')'
        ans = 0
        bal = 0
        for c in s:
            if c == '(':
                bal += 1
            else:
                bal -= 1
                if bal < 0:
                    ans += 1
                    bal = 0
        
        # Second pass: handle unmatched '(' (reverse direction)
        bal = 0
        for c in reversed(s):
            if c == ')':
                bal += 1
            else:
                bal -= 1
                if bal < 0:
                    ans += 1
                    bal = 0
        
        return ans
```

<!-- slide -->
```cpp
class Solution {
public:
    int minAddToMakeValid(string s) {
        // First pass: handle unmatched ')'
        int ans = 0;
        int bal = 0;
        for (char c : s) {
            if (c == '(') {
                bal++;
            } else {
                bal--;
                if (bal < 0) {
                    ans++;
                    bal = 0;
                }
            }
        }
        
        // Second pass: handle unmatched '(' (reverse direction)
        bal = 0;
        for (int i = s.length() - 1; i >= 0; i--) {
            char c = s[i];
            if (c == ')') {
                bal++;
            } else {
                bal--;
                if (bal < 0) {
                    ans++;
                    bal = 0;
                }
            }
        }
        
        return ans;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minAddToMakeValid(String s) {
        // First pass: handle unmatched ')'
        int ans = 0;
        int bal = 0;
        for (char c : s.toCharArray()) {
            if (c == '(') {
                bal++;
            } else {
                bal--;
                if (bal < 0) {
                    ans++;
                    bal = 0;
                }
            }
        }
        
        // Second pass: handle unmatched '(' (reverse direction)
        bal = 0;
        for (int i = s.length() - 1; i >= 0; i--) {
            char c = s.charAt(i);
            if (c == ')') {
                bal++;
            } else {
                bal--;
                if (bal < 0) {
                    ans++;
                    bal = 0;
                }
            }
        }
        
        return ans;
    }
}
```

<!-- slide -->
```javascript
/**
 * Two-pass approach to count both types of unmatched parentheses.
 * 
 * @param {string} s - String containing only '(' and ')' characters
 * @return {number} - Minimum number of insertions needed
 */
var minAddToMakeValid = function(s) {
    // First pass: handle unmatched ')'
    let ans = 0;
    let bal = 0;
    for (const c of s) {
        if (c === '(') {
            bal++;
        } else {
            bal--;
            if (bal < 0) {
                ans++;
                bal = 0;
            }
        }
    }
    
    // Second pass: handle unmatched '(' (reverse direction)
    bal = 0;
    for (let i = s.length - 1; i >= 0; i--) {
        const c = s[i];
        if (c === ')') {
            bal++;
        } else {
            bal--;
            if (bal < 0) {
                ans++;
                bal = 0;
            }
        }
    }
    
    return ans;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Two passes through the string |
| **Space** | O(1) - Only two integer variables used |

---

## Comparison of Approaches

| Aspect | Balance Counter | Stack-based | Two-Pass |
|--------|----------------|-------------|----------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(1) | O(n) | O(1) |
| **Implementation** | Simple | Moderate | Moderate |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ✅ Yes |
| **Best For** | Space-constrained | Understanding | Both directions |

**Best Approach:** The balance counter approach (Approach 1) is optimal with O(n) time and O(1) space complexity, making it the preferred solution.

---

## Why Balance Counter is Optimal for This Problem

The balance counter approach is optimal because:

1. **Single Pass**: Only one traversal through the string needed
2. **Constant Space**: Only two integer variables required
3. **Intuitive**: Directly models the problem's requirements
4. **Efficient**: No data structure overhead
5. **Industry Standard**: Widely used solution for this problem

The key insight is that we don't need to know the exact positions of unmatched parentheses, only the count. When the balance goes negative, we know there's an unmatched closing parenthesis that needs a matching opening parenthesis inserted before it.

---

## Related Problems

Based on similar themes (parentheses validation, stack-based problems):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Valid Parentheses | [Link](https://leetcode.com/problems/valid-parentheses/) | Check if parentheses are valid |
| Balanced Strings | [Link](https://leetcode.com/problems/balanced-string/) | Count balanced substrings |
| Minimum Insertions to Balance | [Link](https://leetcode.com/problems/minimum-insertions-to-balance-a-parentheses-string/) | Similar problem |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Longest Valid Parentheses | [Link](https://leetcode.com/problems/longest-valid-parentheses/) | Find longest valid substring |
| Remove Invalid Parentheses | [Link](https://leetcode.com/problems/remove-invalid-parentheses/) | Remove minimum invalid |
| Minimum Add to Make Parentheses Valid II | [Link](https://leetcode.com/problems/minimum-add-to-make-parentheses-valid-ii/) | With both '(' and ')' |

### Pattern Reference

For more detailed explanations of the Stack-based Parentheses pattern and its variations, see:
- **[Stack-based Parentheses Validation Pattern](/patterns/stack-parentheses-validation)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Balance Counter Approach

- [NeetCode - Minimum Add to Make Parentheses Valid](https://www.youtube.com/watch?v=0lGNeO7xW7k) - Clear explanation
- [Balance Counter Technique](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=8jP8CCrj8cI) - Official explanation

### Stack-based Approaches

- [Stack vs Counter](https://www.youtube.com/watch?v=vOS1QSXKq2Y) - Comparison
- [Parentheses Problems Overview](https://www.youtube.com/watch?v=1AJ4ldc2E1Q) - Complete guide

---

## Follow-up Questions

### Q1: What is the difference between this problem and "Valid Parentheses"?

**Answer:** "Valid Parentheses" checks if a string is already valid (returns boolean), while this problem calculates the minimum insertions needed to make it valid. This problem is essentially finding how far the string is from being valid.

---

### Q2: How would you modify to handle both '(' and ')' as well as '[' and ']'?

**Answer:** Use a mapping to track matching pairs and maintain separate counters (or a stack) for each type. The same balance counter principle applies but with multiple counters.

---

### Q3: Can you solve it in a single line using regex?

**Answer:** While possible with complex regex, it's not efficient. The balance counter is O(n) and much simpler. Regex-based solutions would require pattern matching that doesn't scale well.

---

### Q4: How would you track the actual insertions needed (not just count)?

**Answer:** When balance goes negative, record the position. When the loop ends, the remaining balance tells you how many closing brackets to add at the end. You can then construct the valid string by inserting at recorded positions.

---

### Q5: What if we could also delete characters, not just insert?

**Answer:** This becomes a different problem (like "Remove Invalid Parentheses"). You'd need a BFS or DFS approach to try both insertions and deletions to find the minimum operations.

---

### Q6: How would you extend it to find one valid string (not just count)?

**Answer:** Keep track of where insertions are needed. For unmatched closing `')'`, insert `'('` before it. For remaining `'('` at the end, add `')'` after them.

---

### Q7: What edge cases should be tested?

**Answer:**
- Empty string
- Already valid string
- Only opening parentheses
- Only closing parentheses
- Alternating pattern ")("
- Multiple consecutive unmatched

---

## Common Pitfalls

### 1. Resetting Balance
**Issue**: Forgetting to reset balance to 0 after inserting for unmatched closing.

**Solution**: After incrementing ans for an unmatched ')', reset bal to 0 since the insertion "uses up" that closing parenthesis.

### 2. End Balance
**Issue**: Not adding the remaining balance at the end.

**Solution**: After processing all characters, ans += bal to account for unmatched opening parentheses.

### 3. Order of Operations
**Issue**: Checking balance before processing the character.

**Solution**: Process the character first, then check if balance went negative.

---

## Summary

The **Minimum Add to Make Parentheses Valid** problem demonstrates the power of understanding problem constraints and using simple counters:

- **Balance counter approach**: Optimal with O(n) time and O(1) space
- **Stack-based approach**: Intuitive but uses O(n) space
- **Two-pass approach**: Handles both directions, also O(1) space

The key insight is that we only need to track the count of unmatched parentheses, not their positions. The optimal solution uses a simple balance counter to achieve O(1) space complexity.

This problem is an excellent demonstration of how a seemingly complex problem can have a simple and elegant solution.

### Pattern Summary

This problem exemplifies the **Stack-based Parentheses Validation** pattern, which is characterized by:
- Tracking the balance of opening and closing parentheses
- Using counters instead of actual stacks when positions aren't needed
- Achieving O(1) space complexity
- Single-pass solution

For more details on this pattern and its variations, see the **[Stack-based Parentheses Validation Pattern](/patterns/stack-parentheses-validation)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/discuss/) - Community solutions
- [Valid Parentheses - GeeksforGeeks](https://www.geeksforgeeks.org/valid-parentheses/) - Related problem
- [Stack Data Structure - GeeksforGeeks](https://www.geeksforgeeks.org/stack-data-structure/) - Understanding stacks
- [Parentheses Matching - Wikipedia](https://en.wikipedia.org/wiki/Bracket_matching) - Theory behind matching
