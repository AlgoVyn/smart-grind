# Backspace String Compare

## Problem Statement

Given two strings `s` and `t`, return `true` if they are equal when both are typed into empty text editors. The character `#` represents a backspace character.

When typing a string into a text editor:
- Normal characters are appended to the result
- The `#` character (backspace) deletes the previous character if one exists
- If backspacing an empty text, the text remains empty

This problem simulates the behavior of a text editor with backspace functionality where we need to compare the final processed strings.

**Link to problem:** [Backspace String Compare - LeetCode 844](https://leetcode.com/problems/backspace-string-compare/)

**Constraints:**
- `1 <= s.length, t.length <= 200`
- `s` and `t` only contain lowercase letters and `#` characters
- The backspace `#` will only appear in the input strings

---

## Pattern: Two Pointers - String Comparison with Backspaces

This problem is a classic example of the **Two Pointers - String Comparison with Backspaces** pattern. The pattern involves processing strings from right to left to naturally handle backspace operations that delete characters to their left.

### Core Concept

The fundamental idea is processing strings **from right to left**:
- **Backspace Behavior**: A backspace character (`#`) deletes the character immediately to its left
- **Backward Processing**: By starting from the end, we know exactly how many characters each backspace has "consumed" before reaching the current position
- **Two Pointers**: Each string has its own pointer that skips over characters invalidated by backspaces

---

## Examples

### Example 1

**Input:**
```
s = "ab#c", t = "ad#c"
```

**Output:**
```
true
```

**Explanation:** After processing:
- `s = "ab#c"` → 'a', 'b', backspace removes 'b', 'c' → "ac"
- `t = "ad#c"` → 'a', 'd', backspace removes 'd', 'c' → "ac"
- Both strings become "ac", so they are equal

### Example 2

**Input:**
```
s = "ab##", t = "c#d#"
```

**Output:**
```
true
```

**Explanation:** After processing:
- `s = "ab##"` → 'a', 'b', backspace removes 'b', backspace removes 'a' → ""
- `t = "c#d#"` → 'c', backspace removes 'c', 'd', backspace removes 'd' → ""
- Both strings become empty, so they are equal

### Example 3

**Input:**
```
s = "a#c", t = "b"
```

**Output:**
```
false
```

**Explanation:** After processing:
- `s = "a#c"` → 'a', backspace removes 'a', 'c' → "c"
- `t = "b"` → 'b'
- Strings are "c" and "b", which are different

### Example 4 (Edge Cases)

**Input:**
```
s = "###a", t = "a"
```

**Output:**
```
true
```

**Explanation:** After processing:
- `s = "###a"` → backspace, backspace, backspace, 'a' → "a"
- `t = "a"` → 'a'
- Both strings become "a"

---

## Intuition

The key insight is that backspaces affect characters to their **left**. When comparing strings with backspaces, we have two main strategies:

1. **Process from the end**: Since backspaces delete characters to the left, we can process strings backwards and skip characters that have been "deleted" by counting backspaces.

2. **Build processed strings**: Use a stack to simulate the typing process, pushing normal characters and popping when encountering backspaces.

The backward processing approach is more space-efficient because it doesn't require storing intermediate results.

### Why Processing from Right to Left?

Consider the string `"ab#c"`:
- Forward processing: 'a' → 'b' → '#' removes 'b' → 'c' = "ac"
- Backward processing: 'c' (valid) → '#' (skip next) → 'b' (skipped) → 'a' (valid)

The backward approach naturally skips characters that would be deleted because the backspace character is encountered **before** the character it deletes in forward order, but **after** in backward order.

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Two Pointers (Backward Iteration)** - Optimal O(n) time, O(1) space
2. **Stack-Based Processing** - O(n) time, O(n) space
3. **Build Processed Strings** - O(n) time, O(n) space

---

## Approach 1: Two Pointers with Backward Iteration (Optimal)

This is the most efficient approach with O(1) extra space. By processing from right to left, we naturally handle backspaces because we know exactly how many characters each backspace has deleted before reaching the current position.

### Algorithm Steps

1. Initialize two pointers `i` and `j` at the end of strings `s` and `t` respectively
2. Create a helper function `get_next_valid_index(string, index)` that:
   - Counts backspaces encountered while moving left
   - Skips characters that are "deleted" by backspaces
   - Returns the index of the next valid character or -1 if none exists
3. While both pointers are valid:
   - Get the next valid indices for both strings
   - Compare characters at these indices
   - If characters differ, return false
   - Move both pointers left
4. If both pointers go below 0, strings are equal

### Why It Works

By processing from the end, we naturally handle backspaces because we know exactly how many characters each backspace has deleted before reaching the current position. Each `#` increments a counter, and each valid character decrements the counter when positive.

### Code Implementation

````carousel
```python
class Solution:
    def backspaceCompare(self, s: str, t: str) -> bool:
        """
        Compare two strings with backspace characters.
        
        Args:
            s: First string with '#' as backspace
            t: Second string with '#' as backspace
            
        Returns:
            True if the processed strings are equal, False otherwise
        """
        def get_next_valid_index(string, index):
            """Find the next valid character index moving backwards."""
            backspace_count = 0
            while index >= 0:
                if string[index] == '#':
                    backspace_count += 1
                elif backspace_count > 0:
                    backspace_count -= 1
                else:
                    return index
                index -= 1
            return -1
        
        i, j = len(s) - 1, len(t) - 1
        while i >= 0 or j >= 0:
            i = get_next_valid_index(s, i)
            j = get_next_valid_index(t, j)
            
            if i < 0 and j < 0:
                return True
            if i < 0 or j < 0 or s[i] != t[j]:
                return False
            
            i -= 1
            j -= 1
        return True
```

<!-- slide -->
```cpp
class Solution {
public:
    bool backspaceCompare(string s, string t) {
        /**
         * Compare two strings with backspace characters.
         * 
         * Args:
         *     s: First string with '#' as backspace
         *     t: Second string with '#' as backspace
         * 
         * Returns:
         *     True if the processed strings are equal, False otherwise
         */
        auto getNextValidIndex = [&](const string& str, int index) -> int {
            int backspaceCount = 0;
            while (index >= 0) {
                if (str[index] == '#') {
                    backspaceCount++;
                } else if (backspaceCount > 0) {
                    backspaceCount--;
                } else {
                    return index;
                }
                index--;
            }
            return -1;
        };
        
        int i = s.length() - 1;
        int j = t.length() - 1;
        
        while (i >= 0 || j >= 0) {
            i = getNextValidIndex(s, i);
            j = getNextValidIndex(t, j);
            
            if (i < 0 && j < 0) {
                return true;
            }
            if (i < 0 || j < 0 || s[i] != t[j]) {
                return false;
            }
            
            i--;
            j--;
        }
        return true;
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean backspaceCompare(String s, String t) {
        /**
         * Compare two strings with backspace characters.
         * 
         * Args:
         *     s: First string with '#' as backspace
         *     t: Second string with '#' as backspace
         * 
         * Returns:
         *     True if the processed strings are equal, False otherwise
         */
        int i = s.length() - 1;
        int j = t.length() - 1;
        
        while (i >= 0 || j >= 0) {
            i = getNextValidIndex(s, i);
            j = getNextValidIndex(t, j);
            
            if (i < 0 && j < 0) {
                return true;
            }
            if (i < 0 || j < 0) {
                return false;
            }
            if (s.charAt(i) != t.charAt(j)) {
                return false;
            }
            
            i--;
            j--;
        }
        return true;
    }
    
    private int getNextValidIndex(String str, int index) {
        int backspaceCount = 0;
        while (index >= 0) {
            if (str.charAt(index) == '#') {
                backspaceCount++;
            } else if (backspaceCount > 0) {
                backspaceCount--;
            } else {
                return index;
            }
            index--;
        }
        return -1;
    }
}
```

<!-- slide -->
```javascript
/**
 * Compare two strings with backspace characters.
 * 
 * @param {string} s - First string with '#' as backspace
 * @param {string} t - Second string with '#' as backspace
 * @return {boolean} - True if the processed strings are equal
 */
var backspaceCompare = function(s, t) {
    const getNextValidIndex = (str, index) => {
        let backspaceCount = 0;
        while (index >= 0) {
            if (str[index] === '#') {
                backspaceCount++;
            } else if (backspaceCount > 0) {
                backspaceCount--;
            } else {
                return index;
            }
            index--;
        }
        return -1;
    };
    
    let i = s.length - 1;
    let j = t.length - 1;
    
    while (i >= 0 || j >= 0) {
        i = getNextValidIndex(s, i);
        j = getNextValidIndex(t, j);
        
        if (i < 0 && j < 0) {
            return true;
        }
        if (i < 0 || j < 0 || s[i] !== t[j]) {
            return false;
        }
        
        i--;
        j--;
    }
    return true;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + m) - Each character is visited at most once per string |
| **Space** | O(1) - Only two pointers and a counter used |

---

## Approach 2: Stack-Based Processing

This approach uses a stack to simulate the typing process. Normal characters are pushed onto the stack, and backspaces pop the last character if the stack is not empty.

### Algorithm Steps

1. For each string, create an empty stack
2. Iterate through each character:
   - If character is not '#', push it onto the stack
   - If character is '#', pop from stack if not empty
3. Compare the final stack contents
4. Return true if equal, false otherwise

### Why It Works

The stack naturally simulates a text editor where backspaces remove the most recently added character (LIFO behavior).

### Code Implementation

````carousel
```python
class Solution:
    def backspaceCompare_stack(self, s: str, t: str) -> bool:
        """
        Compare using stack-based processing.
        
        Args:
            s: First string with '#' as backspace
            t: Second string with '#' as backspace
            
        Returns:
            True if the processed strings are equal, False otherwise
        """
        def process_with_stack(string):
            stack = []
            for char in string:
                if char != '#':
                    stack.append(char)
                elif stack:
                    stack.pop()
            return ''.join(stack)
        
        return process_with_stack(s) == process_with_stack(t)
```

<!-- slide -->
```cpp
class Solution {
public:
    bool backspaceCompare(string s, string t) {
        /**
         * Compare using stack-based processing.
         * 
         * Args:
         *     s: First string with '#' as backspace
         *     t: Second string with '#' as backspace
         * 
         * Returns:
         *     True if the processed strings are equal, False otherwise
         */
        auto processWithStack = [&](const string& str) -> string {
            vector<char> stack;
            for (char c : str) {
                if (c != '#') {
                    stack.push_back(c);
                } else if (!stack.empty()) {
                    stack.pop_back();
                }
            }
            return string(stack.begin(), stack.end());
        };
        
        return processWithStack(s) == processWithStack(t);
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean backspaceCompare(String s, String t) {
        /**
         * Compare using stack-based processing.
         * 
         * Args:
         *     s: First string with '#' as backspace
         *     t: Second string with '#' as backspace
         * 
         * Returns:
         *     True if the processed strings are equal, False otherwise
         */
        return processWithStack(s).equals(processWithStack(t));
    }
    
    private String processWithStack(String str) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < str.length(); i++) {
            char c = str.charAt(i);
            if (c != '#') {
                sb.append(c);
            } else if (sb.length() > 0) {
                sb.deleteCharAt(sb.length() - 1);
            }
        }
        return sb.toString();
    }
}
```

<!-- slide -->
```javascript
/**
 * Compare using stack-based processing.
 * 
 * @param {string} s - First string with '#' as backspace
 * @param {string} t - Second string with '#' as backspace
 * @return {boolean} - True if the processed strings are equal
 */
var backspaceCompare = function(s, t) {
    const processWithStack = (str) => {
        const stack = [];
        for (const char of str) {
            if (char !== '#') {
                stack.push(char);
            } else if (stack.length > 0) {
                stack.pop();
            }
        }
        return stack.join('');
    };
    
    return processWithStack(s) === processWithStack(t);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + m) - Each character is processed once in both strings |
| **Space** | O(n + m) - Stack stores up to n characters for s and m characters for t |

---

## Approach 3: Build Processed Strings

This approach directly simulates typing the strings into an editor and compares the final results. It's similar to the stack approach but uses a string/list for building.

### Algorithm Steps

1. Create a function to process a string:
   - Initialize an empty result list
   - For each character, append if not '#', else remove last character
2. Process both input strings
3. Compare the resulting strings

### Why It Works

Directly simulates typing the strings into an editor and compares the final results.

### Code Implementation

````carousel
```python
class Solution:
    def backspaceCompare_build(self, s: str, t: str) -> bool:
        """
        Compare by building processed strings.
        
        Args:
            s: First string with '#' as backspace
            t: Second string with '#' as backspace
            
        Returns:
            True if the processed strings are equal, False otherwise
        """
        def build_processed_string(string):
            result = []
            for char in string:
                if char != '#':
                    result.append(char)
                elif result:
                    result.pop()
            return ''.join(result)
        
        return build_processed_string(s) == build_processed_string(t)
```

<!-- slide -->
```cpp
class Solution {
public:
    bool backspaceCompare(string s, string t) {
        /**
         * Compare by building processed strings.
         * 
         * Args:
         *     s: First string with '#' as backspace
         *     t: Second string with '#' as backspace
         * 
         * Returns:
         *     True if the processed strings are equal, False otherwise
         */
        auto buildProcessedString = [&](const string& str) -> string {
            string result;
            for (char c : str) {
                if (c != '#') {
                    result.push_back(c);
                } else if (!result.empty()) {
                    result.pop_back();
                }
            }
            return result;
        };
        
        return buildProcessedString(s) == buildProcessedString(t);
    }
};
```

<!-- slide -->
```java
class Solution {
    public boolean backspaceCompare(String s, String t) {
        /**
         * Compare by building processed strings.
         * 
         * Args:
         *     s: First string with '#' as backspace
         *     t: Second string with '#' as backspace
         * 
         * Returns:
         *     True if the processed strings are equal, False otherwise
         */
        return buildProcessedString(s).equals(buildProcessedString(t));
    }
    
    private String buildProcessedString(String str) {
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < str.length(); i++) {
            char c = str.charAt(i);
            if (c != '#') {
                sb.append(c);
            } else if (sb.length() > 0) {
                sb.deleteCharAt(sb.length() - 1);
            }
        }
        return sb.toString();
    }
}
```

<!-- slide -->
```javascript
/**
 * Compare by building processed strings.
 * 
 * @param {string} s - First string with '#' as backspace
 * @param {string} t - Second string with '#' as backspace
 * @return {boolean} - True if the processed strings are equal
 */
var backspaceCompare = function(s, t) {
    const buildProcessedString = (str) => {
        const result = [];
        for (const char of str) {
            if (char !== '#') {
                result.push(char);
            } else if (result.length > 0) {
                result.pop();
            }
        }
        return result.join('');
    };
    
    return buildProcessedString(s) === buildProcessedString(t);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + m) - Each character is processed once |
| **Space** | O(n + m) - Requires storing the processed strings |

---

## Comparison of Approaches

| Aspect | Two Pointers | Stack-Based | Build Strings |
|--------|--------------|-------------|---------------|
| **Time Complexity** | O(n + m) | O(n + m) | O(n + m) |
| **Space Complexity** | O(1) | O(n + m) | O(n + m) |
| **Implementation** | Moderate | Simple | Simple |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ❌ No |
| **Best For** | Space-constrained | Readability | Simplicity |

**Best Approach:** The two-pointer approach (Approach 1) is optimal with O(n) time and O(1) space complexity, making it the preferred solution.

---

## Why Two Pointers is Optimal for This Problem

The two-pointer approach with backward iteration is the optimal solution because:

1. **Single Pass**: Visits each element at most once, achieving O(n) time complexity
2. **Constant Space**: Only two integer pointers used, achieving O(1) space complexity
3. **No Intermediate Storage**: Processes strings without building intermediate representations
4. **Natural Backspace Handling**: By processing from right to left, backspaces are naturally handled
5. **Industry Standard**: Widely accepted and used solution for this problem
6. **Minimal Operations**: Each element is visited at most once

The key insight is that backspaces affect characters to their left, making backward processing efficient. The optimal solution processes both strings from right to left, using two pointers to skip over characters that would be deleted by backspaces.

---

## Related Problems

Based on similar themes (string processing, stack-based approaches, two-pointer technique):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Crawler Log Folder | [Link](https://leetcode.com/problems/crawler-log-folder/) | Similar backspace-like behavior with folder navigation |
| Check if One String Swap Can Make Strings Equal | [Link](https://leetcode.com/problems/check-if-one-string-swap-can-make-strings-equal/) | String comparison with swaps |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Decode String | [Link](https://leetcode.com/problems/decode-string/) | Stack-based string decoding with nested patterns |
| Design a Text Editor | [Link](https://leetcode.com/problems/design-a-text-editor/) | Implement text editor operations |
| Robot Collisions | [Link](https://leetcode.com/problems/robot-collisions/) | Stack-based approach for collision problems |
| Letter Tile Possibilities | [Link](https://leetcode.com/problems/letter-tile-possibilities/) | Backtracking with character operations |

### Pattern Reference

For more detailed explanations of the Two Pointers pattern and its variations, see:
- **[Two Pointers - String Comparison with Backspaces Pattern](/patterns/two-pointers-string-comparison-with-backspaces)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Two Pointers Technique

- [NeetCode - Backspace String Compare](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation with visual examples
- [Back to Back SWE - Backspace String Compare](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Detailed walkthrough of the two-pointer approach
- [LeetCode Official Solution](https://www.youtube.com/watch?v=0lGNeO7xW7k) - Official problem solution
- [Two Pointer Technique Explained](https://www.youtube.com/watch?v=8jP8CCrj8cI) - Understanding the two-pointer technique

### Stack-Based Approaches

- [Stack vs Two Pointer](https://www.youtube.com/watch?v=vOS1QSXKq2Y) - Comparison of different approaches
- [Stack Data Structure - Complete Guide](https://www.youtube.com/watch?v=1AJ4ldc2E1Q) - Understanding stack operations

---

## Follow-up Questions

### Q1: Can you solve it in O(n) time and O(1) space?

**Answer:** Yes! The two-pointer approach with backward iteration achieves O(n) time and O(1) space complexity. This is the optimal solution as it doesn't require any additional data structures proportional to the input size.

---

### Q2: What is the difference between the three approaches in terms of practical performance?

**Answer:**
- **Two-pointer**: Fastest in practice, minimal memory allocation, optimal for large inputs
- **Stack-based**: More intuitive, but requires dynamic array allocation
- **Build strings**: Similar to stack, but string concatenation can be O(n²) in some languages if not using proper data structures

---

### Q3: How would you handle Unicode characters with multi-byte representations?

**Answer:** The character-based approach naturally handles Unicode correctly since it operates on individual code points. The backspace '#' is a single ASCII character, and all other characters are processed as single entities regardless of their byte representation.

---

### Q4: What if backspace is represented by a different character (e.g., '\b' or '<')?

**Answer:** Simply change the backspace character check in the code. For example, instead of checking for '#', check for your custom backspace character.

---

### Q5: How would you modify the solution for multiple consecutive backspaces?

**Answer:** The current solution handles this naturally by using a counter. Each '#' increments the counter, and each valid character decrements it when the counter is positive. This works for any number of consecutive backspaces.

---

### Q6: How would you solve this if the backspace deleted the NEXT character instead of the previous?

**Answer:** You would process left-to-right instead of right-to-left. The logic would mirror the current approach but in the forward direction. Instead of counting backspaces to skip deleted characters, you'd look ahead to skip characters that will be deleted.

---

### Q7: How would you extend this to support a "clear all" command?

**Answer:** Add a new character (e.g., '*') that resets the result/pointer. When encountered, clear the entire stack or reset the counter to the string length. For the two-pointer approach, this would mean moving the pointer to the beginning of the string.

---

### Q8: How would you implement this for a real-time text editor with streaming input?

**Answer:** Use a doubly-linked list or a balanced BST to support efficient insertion and deletion at arbitrary positions. This allows O(1) deletion and O(log n) character access. Alternatively, maintain a buffer with metadata about pending deletions.

---

### Q9: What edge cases should be tested?

**Answer:**
- Empty strings after processing
- Only backspaces ("#####")
- No backspaces ("abc", "abc")
- All backspaces deleting everything
- Multiple consecutive backspaces
- Backspaces at the beginning, middle, and end
- Strings of different lengths that become equal
- Strings of the same length that become different

---

### Q10: How would you verify correctness without processing the entire string?

**Answer:** You could use property-based testing with invariants:
- Processed strings should be equal iff the algorithm returns true
- The number of non-deleted characters should equal |s| - 2 × (# of backspaces that have effects)
- The algorithm should be symmetric: compare(s, t) should equal compare(t, s)

---

## Common Pitfalls

### 1. Backspace Order
**Issue**: Remember that backspaces affect characters to their left, not right.

**Solution**: Process from right to left to naturally handle this constraint.

### 2. Empty After Processing
**Issue**: Handle cases where both strings become empty.

**Solution**: The two-pointer approach correctly handles this by checking if both indices are -1.

### 3. Multiple Backspaces
**Issue**: The counter approach naturally handles consecutive backspaces.

**Solution**: Use a counter that increments on '#' and decrements on valid characters when counter > 0.

### 4. Pointer Movement
**Issue**: Ensure pointers move correctly after comparison.

**Solution**: Decrement both pointers after each successful character comparison.

### 5. Edge Cases
**Issue**: Not testing with strings that become empty or have leading backspaces.

**Solution**: Test with cases like `"###a"` vs `"a"`, `"#"` vs `""`, etc.

---

## Summary

The **Backspace String Compare** problem demonstrates the power of understanding problem constraints and leveraging algorithmic patterns:

- **Two-pointer approach**: Optimal with O(n) time and O(1) space
- **Stack-based approach**: Intuitive but uses O(n) space
- **Build strings approach**: Simple but also uses O(n) space

The key insight is that backspaces affect characters to their left, making backward processing efficient. The optimal solution processes both strings from right to left, using two pointers to skip over characters that would be deleted by backspaces.

This problem is an excellent demonstration of how understanding the problem constraints and properties can lead to an optimal O(1) space solution.

### Pattern Summary

This problem exemplifies the **Two Pointers - String Comparison with Backspaces** pattern, which is characterized by:
- Processing strings from right to left
- Using counters to skip characters invalidated by backspaces
- Achieving O(1) space complexity
- Comparing characters in a single pass

For more details on this pattern and its variations, see the **[Two Pointers - String Comparison with Backspaces Pattern](/patterns/two-pointers-string-comparison-with-backspaces)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/backspace-string-compare/discuss/) - Community solutions and explanations
- [Two Pointer Technique - GeeksforGeeks](https://www.geeksforgeeks.org/two-pointers-technique/) - Detailed explanation
- [Stack Data Structure - GeeksforGeeks](https://www.geeksforgeeks.org/stack-data-structure/) - Understanding stacks
- [String Processing Algorithms - Wikipedia](https://en.wikipedia.org/wiki/String_algorithms) - Learn about string algorithms
- [Pattern: Two Pointers - String Comparison with Backspaces](/patterns/two-pointers-string-comparison-with-backspaces) - Comprehensive pattern guide
