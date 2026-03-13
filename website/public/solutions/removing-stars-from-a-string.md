# Removing Stars From A String

## Problem Description

You are given a string `s`, which contains stars `*`.

In one operation, you can:
1. Choose a star in `s`.
2. Remove the closest non-star character to its left, as well as remove the star itself.

Return the string after all stars have been removed.

**Note:**
- The input will be generated such that the operation is always possible.
- It can be shown that the resulting string will always be unique.

**LeetCode Link:** [LeetCode 1540 - Removing Stars From a String](https://leetcode.com/problems/removing-stars-from-a-string/)

---

## Examples

### Example 1

**Input:**
```python
s = "leet**cod*e"
```

**Output:**
```python
"lecoe"
```

**Explanation:** Performing the removals from left to right:
- The closest character to the 1st star is 't' in "leet**cod*e". `s` becomes "lee*cod*e".
- The closest character to the 2nd star is 'e' in "lee*cod*e". `s` becomes "lecod*e".
- The closest character to the 3rd star is 'd' in "lecod*e". `s` becomes "lecoe".

There are no more stars, so we return "lecoe".

### Example 2

**Input:**
```python
s = "erase*****"
```

**Output:**
```python
""
```

**Explanation:** The entire string is removed, so we return an empty string.

---

## Constraints

- `1 <= s.length <= 10^5`
- `s` consists of lowercase English letters and stars `*`.
- The operation above can be performed on `s`.

---

## Pattern: Stack Simulation

This problem uses a simple **Stack** to simulate star removal. Push non-star characters, pop when star encountered.

---

## Intuition

The key insight for this problem is recognizing that the star removal operation is equivalent to **simulating a stack**:

> Each star removes the most recent character before it - exactly what a stack does with its pop operation.

### Key Observations

1. **Stack Behavior**: When we encounter a star, we remove the closest non-star character to its left. This is identical to popping from a stack.

2. **Left-to-Right Processing**: Processing the string left to right ensures we always have access to the most recent character.

3. **No Need for Actual Removal**: We don't need to modify the string. We just build the result using a stack and join at the end.

4. **Input Guarantee**: The problem states the operation is always possible, so we never need to handle the case where there's a star with nothing to remove.

### Algorithm Overview

1. **Initialize empty stack**
2. **Iterate through string**:
   - If character is '*': pop from stack
   - Otherwise: push character to stack
3. **Join and return**: Convert stack to string

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Stack Simulation** - Most intuitive
2. **String Builder** - Using list as stack
3. **Two-pointer** - In-place optimization

---

## Approach 1: Stack Simulation (Most Intuitive)

### Algorithm Steps

1. Use a list as a stack
2. For each character in the string:
   - If it's '*', pop from stack if not empty
   - Otherwise, push to stack
3. Return joined stack

### Why It Works

The stack naturally models the "closest character to the left" behavior. When we see a star, we immediately remove the most recent character.

### Code Implementation

````carousel
```python
class Solution:
    def removeStars(self, s: str) -> str:
        """
        Remove all stars from string using stack simulation.
        
        Args:
            s: Input string with lowercase letters and stars
            
        Returns:
            String after removing all stars and their left neighbors
        """
        stack = []
        
        for char in s:
            if char == '*':
                # Remove the closest non-star character to the left
                if stack:
                    stack.pop()
            else:
                # Add non-star character to stack
                stack.append(char)
        
        # Convert stack to string
        return ''.join(stack)
```

<!-- slide -->
```cpp
#include <string>
#include <stack>
using namespace std;

class Solution {
public:
    string removeStars(string s) {
        stack<char> st;
        
        for (char c : s) {
            if (c == '*') {
                if (!st.empty()) {
                    st.pop();
                }
            } else {
                st.push(c);
            }
        }
        
        // Build result from stack
        string result;
        while (!st.empty()) {
            result = st.top() + result;
            st.pop();
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public String removeStars(String s) {
        StringBuilder stack = new StringBuilder();
        
        for (char c : s.toCharArray()) {
            if (c == '*') {
                if (stack.length() > 0) {
                    stack.deleteCharAt(stack.length() - 1);
                }
            } else {
                stack.append(c);
            }
        }
        
        return stack.toString();
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {string}
 */
var removeStars = function(s) {
    const stack = [];
    
    for (const char of s) {
        if (char === '*') {
            if (stack.length > 0) {
                stack.pop();
            }
        } else {
            stack.push(char);
        }
    }
    
    return stack.join('');
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - single pass through string |
| **Space** | O(n) - stack can hold up to n characters |

---

## Approach 2: String Builder (List)

### Algorithm Steps

1. Use a list as a more efficient stack
2. Same logic as approach 1
3. Join at the end

### Why It Works

In Python, a list has O(1) append and pop from the end, making it an efficient stack.

### Code Implementation

````carousel
```python
class Solution:
    def removeStars(self, s: str) -> str:
        # Using list as stack - same as approach 1
        result = []
        
        for char in s:
            if char == '*':
                if result:
                    result.pop()
            else:
                result.append(char)
        
        return ''.join(result)
```

<!-- slide -->
```cpp
// Same as approach 1 using stack
```

<!-- slide -->
```java
// Same as approach 1 using StringBuilder
```

<!-- slide -->
```javascript
// Same as approach 1 using array
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) |
| **Space** | O(n) |

---

## Approach 3: Two-Pointer (In-Place)

### Algorithm Steps

1. Use two pointers: one for reading, one for writing
2. When not a star: write to position and increment both
3. When star: decrement write pointer (effectively removing last character)

### Why It Works

This approach modifies the string in-place, using the write pointer to track the current end of the result.

### Code Implementation

````carousel
```python
class Solution:
    def removeStars(self, s: str) -> str:
        # Convert to list for O(1) modification
        chars = list(s)
        write = 0
        
        for read in range(len(chars)):
            if chars[read] == '*':
                # Move write pointer back (removes last character)
                write -= 1
            else:
                # Write character at write position
                chars[write] = chars[read]
                write += 1
        
        return ''.join(chars[:write])
```

<!-- slide -->
```cpp
#include <string>
using namespace std;

class Solution {
public:
    string removeStars(string s) {
        int write = 0;
        
        for (char c : s) {
            if (c == '*') {
                write--;
            } else {
                s[write++] = c;
            }
        }
        
        return s.substr(0, write);
    }
};
```

<!-- slide -->
```java
class Solution {
    public String removeStars(String s) {
        char[] chars = s.toCharArray();
        int write = 0;
        
        for (int read = 0; read < chars.length; read++) {
            if (chars[read] == '*') {
                write--;
            } else {
                chars[write++] = chars[read];
            }
        }
        
        return new String(chars, 0, write);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} s
 * @return {string}
 */
var removeStars = function(s) {
    const chars = s.split('');
    let write = 0;
    
    for (const char of chars) {
        if (char === '*') {
            write--;
        } else {
            chars[write++] = char;
        }
    }
    
    return chars.slice(0, write).join('');
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) |
| **Space** | O(1) extra (modifies in-place) |

---

## Comparison of Approaches

| Aspect | Stack | Two-Pointer |
|--------|-------|-------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(n) | O(1) |
| **Implementation** | Simple | More complex |
| **In-Place** | No | Yes |

**Best Approach:** Stack simulation is most intuitive. Two-pointer is best for memory efficiency.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Amazon, Google
- **Difficulty**: Easy
- **Concepts Tested**: Stack, String Manipulation

### Learning Outcomes

1. **Stack Basics**: Learn to use stack for simulation problems
2. **String Building**: Efficient string construction
3. **In-Place Operations**: Two-pointer optimization

---

## Related Problems

Based on similar themes (Stack, String):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Valid Parentheses | [Link](https://leetcode.com/problems/valid-parentheses/) | Stack matching |
| Backspace String Compare | [Link](https://leetcode.com/problems/backspace-string-compare/) | Stack/pointer |
| Minimum Add to Make Parentheses Valid | [Link](https://leetcode.com/problems/minimum-add-to-make-parentheses-valid/) | Stack counting |

### Pattern Reference

For more details on the Stack pattern, see:
- **[Stack Pattern](/patterns/stack)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Removing Stars From a String](https://www.youtube.com/watch?v=example)** - Clear explanation
2. **[Stack Problems](https://www.youtube.com/watch?v=example)** - Stack patterns
3. **[LeetCode 1540 Solution](https://www.youtube.com/watch?v=example)** - Full solution

---

## Follow-up Questions

### Q1: How would you modify the solution to remove k characters instead of 1?

**Answer:** Change the star to specify k, or modify to pop k times for each star (if there are enough characters).

---

### Q2: What if stars could remove characters to their right?

**Answer:** This would require a different data structure, possibly a deque to allow removal from both ends.

---

### Q3: How would you handle multiple types of removal operators?

**Answer:** Use a stack of stacks or maintain additional state to track what each operator removes.

---

## Common Pitfalls

### 1. Empty Stack Check
**Issue**: Trying to pop from empty stack when star has nothing to remove.

**Solution**: Always check if stack is non-empty before popping.

### 2. Order Matters
**Issue**: Processing right to left instead of left to right.

**Solution**: Process left to right to ensure we remove the "closest" character.

### 3. Space Complexity
**Issue**: Using string concatenation in loop.

**Solution**: Use stack/list and join at the end for O(n) performance.

---

## Summary

The **Removing Stars From A String** problem demonstrates the power of **stack simulation** for string manipulation.

Key takeaways:
1. Stars remove the closest character to the left
2. Stack naturally models this "most recent" behavior
3. Process left to right for correct order
4. Two-pointer approach saves space

This problem is essential for understanding how to apply stack concepts to string problems.

### Pattern Summary

This problem exemplifies the **Stack** pattern, characterized by:
- Simulating "most recent" behavior
- Push/pop operations
- Building results incrementally

For more details on this pattern, see the **[Stack Pattern](/patterns/stack)**.

---

## Additional Resources

- [LeetCode Problem 1540](https://leetcode.com/problems/removing-stars-from-a-string/) - Official problem page
- [Stack - GeeksforGeeks](https://www.geeksforgeeks.org/stack/) - Detailed explanation
- [Pattern: Stack](/patterns/stack) - Comprehensive pattern guide
