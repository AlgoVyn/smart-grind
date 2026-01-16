# Backspace String Compare

## Problem Description

Given two strings `s` and `t`, return `true` if they are equal when both are typed into empty text editors. The character `#` represents a backspace character.

When typing a string into a text editor:
- Normal characters are appended to the result
- The `#` character (backspace) deletes the previous character if one exists
- If backspacing an empty text, the text remains empty

This problem simulates the behavior of a text editor with backspace functionality where we need to compare the final processed strings.

---

## Examples

### Example 1

**Input:**
```python
s = "ab#c", t = "ad#c"
```

**Output:**
```python
true
```

**Explanation:** After processing:
- `s = "ab#c"` → 'a', 'b', backspace removes 'b', 'c' → "ac"
- `t = "ad#c"` → 'a', 'd', backspace removes 'd', 'c' → "ac"
- Both strings become "ac", so they are equal

### Example 2

**Input:**
```python
s = "ab##", t = "c#d#"
```

**Output:**
```python
true
```

**Explanation:** After processing:
- `s = "ab##"` → 'a', 'b', backspace removes 'b', backspace removes 'a' → ""
- `t = "c#d#"` → 'c', backspace removes 'c', 'd', backspace removes 'd' → ""
- Both strings become empty, so they are equal

### Example 3

**Input:**
```python
s = "a#c", t = "b"
```

**Output:**
```python
false
```

**Explanation:** After processing:
- `s = "a#c"` → 'a', backspace removes 'a', 'c' → "c"
- `t = "b"` → 'b'
- Strings are "c" and "b", which are different

### Example 4 (Edge Cases)

**Input:**
```python
s = "###a", t = "a"
```

**Output:**
```python
true
```

**Explanation:** After processing:
- `s = "###a"` → backspace, backspace, backspace, 'a' → "a"
- `t = "a"` → 'a'
- Both strings become "a"

---

## Constraints

- `1 <= s.length, t.length <= 200`
- `s` and `t` only contain lowercase letters and `#` characters
- The backspace `#` will only appear in the input strings

---

## Intuition

The key insight is that backspaces affect characters to their **left**. When comparing strings with backspaces, we have two main strategies:

1. **Process from the end**: Since backspaces delete characters to the left, we can process strings backwards and skip characters that have been "deleted" by counting backspaces.

2. **Build processed strings**: Use a stack to simulate the typing process, pushing normal characters and popping when encountering backspaces.

The backward processing approach is more space-efficient because it doesn't require storing intermediate results.

---

## Solution Approaches

### Approach 1: Two-Pointer with Backward Iteration (Optimal)

This is the most efficient approach with O(1) extra space.

**Algorithm:**
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

**Why it works:** By processing from the end, we naturally handle backspaces because we know exactly how many characters each backspace has deleted before reaching the current position.

### Approach 2: Stack-Based Processing

**Algorithm:**
1. For each string, create an empty stack
2. Iterate through each character:
   - If character is not '#', push it onto the stack
   - If character is '#', pop from stack if not empty
3. Compare the final stack contents
4. Return true if equal, false otherwise

**Why it works:** The stack naturally simulates a text editor where backspaces remove the most recently added character (LIFO behavior).

### Approach 3: Build Processed Strings

**Algorithm:**
1. Create a function to process a string:
   - Initialize an empty result string
   - For each character, append if not '#', else remove last character
2. Process both input strings
3. Compare the resulting strings

**Why it works:** Directly simulates typing the strings into an editor and compares the final results.

---

## Code Implementations

### Python

```python
class Solution:
    # Approach 1: Two-Pointer with Backward Iteration (O(1) space)
    def backspaceCompare(self, s: str, t: str) -> bool:
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

    # Approach 2: Stack-Based (O(n) space)
    def backspaceCompare_stack(self, s: str, t: str) -> bool:
        def process_with_stack(string):
            stack = []
            for char in string:
                if char != '#':
                    stack.append(char)
                elif stack:
                    stack.pop()
            return ''.join(stack)
        
        return process_with_stack(s) == process_with_stack(t)

    # Approach 3: Build Processed Strings (O(n) space)
    def backspaceCompare_build(self, s: str, t: str) -> bool:
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

---

## Time and Space Complexity Analysis

### Approach 1: Two-Pointer (Backward Iteration)

| Metric | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(n + m) | Each character is visited at most once per string, where n and m are the lengths of s and t |
| **Space** | O(1) | Only uses two pointers and a counter, no extra data structures |

### Approach 2: Stack-Based

| Metric | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(n + m) | Each character is processed once in both strings |
| **Space** | O(n + m) | Stack stores up to n characters for s and m characters for t |

### Approach 3: Build Processed Strings

| Metric | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(n + m) | Each character is processed once |
| **Space** | O(n + m) | Requires storing the processed strings |

**Best Approach:** The two-pointer approach (Approach 1) is optimal with O(n) time and O(1) space complexity, making it the preferred solution.

---

## Related Problems

1. **[Valid Parentheses](https://leetcode.com/problems/valid-parentheses/)** - Uses stack to validate balanced brackets
2. **[Decode String](https://leetcode.com/problems/decode-string/)** - Stack-based string decoding with nested patterns
3. **[Design a Text Editor](https://leetcode.com/problems/design-a-text-editor/)** - Implement text editor operations
4. **[Crawler Log Folder](https://leetcode.com/problems/crawler-log-folder/)** - Similar backspace-like behavior with folder navigation
5. **[Robot Collisions](https://leetcode.com/problems/robot-collisions/)** - Stack-based approach for collision problems
6. **[Implement Queue using Stacks](https://leetcode.com/problems/implement-queue-using-stacks/)** - Stack manipulation techniques

---

## Video Tutorials

1. **[NeetCode - Backspace String Compare](https://www.youtube.com/watch?v=8hQPLSSjkMY)** - Clear explanation with visual examples
2. **[Back to Back SWE - Backspace String Compare](https://www.youtube.com/watch?v=8Q1nQkVGYQ8)** - Detailed walkthrough of the two-pointer approach
3. **[LeetCode Official Solution](https://www.youtube.com/watch?v=0lGNeO7xW7k)** - Official problem solution
4. **[Two Pointer Technique Explained](https://www.youtube.com/watch?v=8jP8CCrj8cI)** - Understanding the two-pointer technique
5. **[Stack vs Two Pointer](https://www.youtube.com/watch?v=vOS1QSXKq2Y)** - Comparison of different approaches

---

## Follow-up Questions

### Performance and Complexity

1. **Can you solve it in O(n) time and O(1) space?**
   - Yes! The two-pointer approach with backward iteration achieves O(n) time and O(1) space complexity. This is the optimal solution as it doesn't require any additional data structures proportional to the input size.

2. **What is the difference between the three approaches in terms of practical performance?**
   - **Two-pointer**: Fastest in practice, minimal memory allocation
   - **Stack-based**: More intuitive, but requires dynamic array allocation
   - **Build strings**: Similar to stack, but string concatenation can be O(n²) in some languages

### Algorithmic Extensions

3. **How would you handle Unicode characters with multi-byte representations?**
   - The character-based approach naturally handles Unicode correctly since it operates on individual code points. The backspace '#' is a single ASCII character, and all other characters are processed as single entities regardless of their byte representation.

4. **What if backspace is represented by a different character (e.g., '\b' or '<')?**
   - Simply change the backspace character check in the code:
   ```python
   # Change '#' to your character
   if string[index] == '<':  # Instead of '#'
   ```

5. **How would you modify the solution for multiple consecutive backspaces?**
   - The current solution handles this naturally by using a counter. Each '#' increments the counter, and each valid character decrements it when the counter is positive. This works for any number of consecutive backspaces.

6. **How would you solve this if the backspace deleted the NEXT character instead of the previous?**
   - You would process left-to-right instead of right-to-left. The logic would mirror the current approach but in the forward direction.

### Practical Applications

7. **How would you extend this to support a "clear all" command?**
   - Add a new character (e.g., '*') that resets the result/pointer. When encountered, clear the entire stack or reset the counter to the string length.

8. **How would you implement this for a real-time text editor with streaming input?**
   - Use a doubly-linked list or a balanced BST to support efficient insertion and deletion at arbitrary positions. This allows O(1) deletion and O(log n) character access.

### Edge Cases and Testing

9. **What edge cases should be tested?**
   - Empty strings after processing
   - Only backspaces ("#####")
   - No backspaces ("abc", "abc")
   - All backspaces deleting everything
   - Multiple consecutive backspaces
   - Backspaces at the beginning, middle, and end

10. **How would you verify correctness without processing the entire string?**
    - You could use property-based testing with invariants:
    - Processed strings should be equal iff the algorithm returns true
    - The number of non-deleted characters should equal |s| - 2 × (# of backspaces that have effects)

---

## Summary

The **Backspace String Compare** problem can be solved using multiple approaches:

- **Stack-based**: Intuitive but uses O(n) space
- **Two-pointer (backward)**: Optimal with O(n) time and O(1) space

The key insight is that backspaces affect characters to their left, making backward processing efficient. The optimal solution processes both strings from right to left, using two pointers to skip over characters that would be deleted by backspaces.

This problem is an excellent demonstration of how understanding the problem constraints and properties (backspaces affect left characters) can lead to an optimal O(1) space solution.

---

## References

- [LeetCode 844 - Backspace String Compare](https://leetcode.com/problems/backspace-string-compare/)
- Problem constraints and examples from LeetCode

