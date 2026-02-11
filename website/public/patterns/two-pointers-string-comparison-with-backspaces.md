# Two Pointers - String Comparison with Backspaces

## Overview

The **Two Pointers - String Comparison with Backspaces** pattern is a specialized two-pointer technique designed for comparing strings where certain characters (typically `#`) represent backspace operations. This pattern efficiently compares the final processed strings without actually building them, achieving optimal O(1) space complexity.

This pattern is particularly valuable when:
- You need to compare strings with backspace/delete characters
- Space complexity must be O(1) as per problem constraints
- You're processing strings backwards to handle deletions naturally
- You want to avoid building intermediate string representations

## Core Concept

The fundamental idea behind this pattern is processing strings **from right to left**:

- **Backspace Behavior**: A backspace character (`#`) deletes the character immediately to its left
- **Backward Processing**: By starting from the end, we know exactly how many characters each backspace has "consumed" before reaching the current position
- **Two Pointers**: Each string has its own pointer that skips over characters invalidated by backspaces

The key insight is that backspaces affect characters to their **left**, making backward iteration the natural and efficient direction for processing.

## When to Use This Pattern

Use the Two Pointers - String Comparison with Backspaces pattern when:
- Problem involves comparing strings with backspace/delete characters
- You need to determine if two strings produce the same output after processing
- Space constraints require O(1) extra space
- You want to avoid building processed strings (which would be O(n) space)
- The backspace character is guaranteed to only delete characters to its left

---

## Intuition

The key insight driving this pattern is simple yet powerful:

1. **Backward Iteration Advantage**: Since backspaces delete characters to their left, processing from right to left allows us to naturally handle deletions without building intermediate results

2. **Skip Counters**: We maintain a counter that tracks how many characters to skip due to backspaces encountered so far

3. **Single Pass Comparison**: By comparing characters from the end moving forward, we can determine equality without processing the entire strings

4. **Natural Termination**: When both pointers go below 0, we've compared all meaningful characters

### Why Processing from Right to Left?

Consider the string `"ab#c"`:
- Forward processing: 'a' → 'b' → '#' removes 'b' → 'c' = "ac"
- Backward processing: 'c' (valid) → '#' (skip next) → 'b' (skipped) → 'a' (valid)

The backward approach naturally skips characters that would be deleted because the backspace character is encountered **before** the character it deletes in forward order, but **after** in backward order.

---

## Multiple Approaches with Code Templates

We'll cover three approaches:

1. **Two Pointers with Backward Iteration (Optimal)** - O(n) time, O(1) space
2. **Stack-Based Processing** - O(n) time, O(n) space
3. **Build Processed Strings** - O(n) time, O(n) space

---

## Approach 1: Two Pointers with Backward Iteration (Optimal)

This is the most efficient approach with O(1) extra space. By processing from right to left, we naturally handle backspaces because we know exactly how many characters each backspace has deleted before reaching the current position.

### Algorithm Steps

1. Initialize two pointers `i` and `j` at the end of strings `s` and `t` respectively
2. Create a helper function that finds the next valid character index:
   - Count backspaces encountered while moving left
   - Skip characters that are "deleted" by backspaces
   - Return the index of the next valid character or -1 if none exists
3. While both pointers are valid:
   - Get the next valid indices for both strings
   - Compare characters at these indices
   - If characters differ, return false
   - Move both pointers left
4. If both pointers go below 0, strings are equal

### Code Implementation

````carousel
```python
def two_pointers_backspace_compare(s: str, t: str) -> bool:
    """
    Compare two strings with backspace characters using two pointers.
    
    Args:
        s: First string with '#' as backspace
        t: Second string with '#' as backspace
        
    Returns:
        True if the processed strings are equal, False otherwise
    """
    def get_next_valid_index(string: str, index: int) -> int:
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
        
        # Both strings exhausted - they're equal
        if i < 0 and j < 0:
            return True
        
        # One string exhausted but not the other - not equal
        if i < 0 or j < 0:
            return False
        
        # Characters differ - not equal
        if s[i] != t[j]:
            return False
        
        i -= 1
        j -= 1
    
    return True
```

<!-- slide -->
```cpp
/**
 * Compare two strings with backspace characters using two pointers.
 * 
 * @param s First string with '#' as backspace
 * @param t Second string with '#' as backspace
 * @return True if the processed strings are equal, False otherwise
 */
bool twoPointersBackspaceCompare(string s, string t) {
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
        
        // Both strings exhausted - they're equal
        if (i < 0 && j < 0) {
            return true;
        }
        
        // One string exhausted but not the other - not equal
        if (i < 0 || j < 0) {
            return false;
        }
        
        // Characters differ - not equal
        if (s[i] != t[j]) {
            return false;
        }
        
        i--;
        j--;
    }
    
    return true;
}
```

<!-- slide -->
```java
/**
 * Compare two strings with backspace characters using two pointers.
 * 
 * @param s First string with '#' as backspace
 * @param t Second string with '#' as backspace
 * @return True if the processed strings are equal, False otherwise
 */
public boolean twoPointersBackspaceCompare(String s, String t) {
    int i = s.length() - 1;
    int j = t.length() - 1;
    
    while (i >= 0 || j >= 0) {
        i = getNextValidIndex(s, i);
        j = getNextValidIndex(t, j);
        
        // Both strings exhausted - they're equal
        if (i < 0 && j < 0) {
            return true;
        }
        
        // One string exhausted but not the other - not equal
        if (i < 0 || j < 0) {
            return false;
        }
        
        // Characters differ - not equal
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
```

<!-- slide -->
```javascript
/**
 * Compare two strings with backspace characters using two pointers.
 * 
 * @param {string} s - First string with '#' as backspace
 * @param {string} t - Second string with '#' as backspace
 * @return {boolean} - True if the processed strings are equal
 */
function twoPointersBackspaceCompare(s, t) {
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
        
        // Both strings exhausted - they're equal
        if (i < 0 && j < 0) {
            return true;
        }
        
        // One string exhausted but not the other - not equal
        if (i < 0 || j < 0) {
            return false;
        }
        
        // Characters differ - not equal
        if (s[i] !== t[j]) {
            return false;
        }
        
        i--;
        j--;
    }
    
    return true;
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + m) - Each character is visited at most once per string |
| **Space** | O(1) - Only two pointers and a counter used |

---

## Approach 2: Stack-Based Processing

This approach uses a stack to simulate the typing process. Normal characters are pushed onto the stack, and backspaces pop the last character if the stack is not empty. While intuitive, this approach uses O(n) space.

### Algorithm Steps

1. For each string, create an empty stack (or list used as stack)
2. Iterate through each character:
   - If character is not '#', push it onto the stack
   - If character is '#', pop from stack if not empty
3. Compare the final stack contents
4. Return true if equal, false otherwise

### Code Implementation

````carousel
```python
def stack_backspace_compare(s: str, t: str) -> bool:
    """
    Compare two strings with backspace using stack-based processing.
    
    Args:
        s: First string with '#' as backspace
        t: Second string with '#' as backspace
        
    Returns:
        True if the processed strings are equal, False otherwise
    """
    def process_with_stack(string: str) -> str:
        """Process string using stack to handle backspaces."""
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
/**
 * Compare two strings with backspace using stack-based processing.
 * 
 * @param s First string with '#' as backspace
 * @param t Second string with '#' as backspace
 * @return True if the processed strings are equal, False otherwise
 */
bool stackBackspaceCompare(string s, string t) {
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
```

<!-- slide -->
```java
/**
 * Compare two strings with backspace using stack-based processing.
 * 
 * @param s First string with '#' as backspace
 * @param t Second string with '#' as backspace
 * @return True if the processed strings are equal, False otherwise
 */
public boolean stackBackspaceCompare(String s, String t) {
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
```

<!-- slide -->
```javascript
/**
 * Compare two strings with backspace using stack-based processing.
 * 
 * @param {string} s - First string with '#' as backspace
 * @param {string} t - Second string with '#' as backspace
 * @return {boolean} - True if the processed strings are equal
 */
function stackBackspaceCompare(s, t) {
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
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + m) - Each character is processed once in both strings |
| **Space** | O(n + m) - Stack stores up to n characters for s and m characters for t |

---

## Approach 3: Build Processed Strings

This approach directly simulates typing the strings into an editor and compares the final results. It's similar to the stack approach but uses a list/string builder for building.

### Algorithm Steps

1. Create a function to process a string:
   - Initialize an empty result list/StringBuilder
   - For each character, append if not '#', else remove last character
2. Process both input strings
3. Compare the resulting strings

### Code Implementation

````carousel
```python
def build_string_backspace_compare(s: str, t: str) -> bool:
    """
    Compare two strings by building processed strings.
    
    Args:
        s: First string with '#' as backspace
        t: Second string with '#' as backspace
        
    Returns:
        True if the processed strings are equal, False otherwise
    """
    def build_processed_string(string: str) -> str:
        """Build the processed string simulating text editor."""
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
/**
 * Compare two strings by building processed strings.
 * 
 * @param s First string with '#' as backspace
 * @param t Second string with '#' as backspace
 * @return True if the processed strings are equal, False otherwise
 */
bool buildStringBackspaceCompare(string s, string t) {
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
```

<!-- slide -->
```java
/**
 * Compare two strings by building processed strings.
 * 
 * @param s First string with '#' as backspace
 * @param t Second string with '#' as backspace
 * @return True if the processed strings are equal, False otherwise
 */
public boolean buildStringBackspaceCompare(String s, String t) {
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
```

<!-- slide -->
```javascript
/**
 * Compare two strings by building processed strings.
 * 
 * @param {string} s - First string with '#' as backspace
 * @param {string} t - Second string with '#' as backspace
 * @return {boolean} - True if the processed strings are equal
 */
function buildStringBackspaceCompare(s, t) {
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
}
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

**Best Approach:** The two-pointer approach (Approach 1) is optimal with O(n) time and O(1) space complexity, making it the preferred solution for interviews and production code.

---

## Why Two Pointers is Optimal for This Problem

The two-pointer approach with backward iteration is the optimal solution because:

1. **Single Pass**: Visits each element at most once, achieving O(n) time complexity
2. **Constant Space**: Only two integer pointers used, achieving O(1) space complexity
3. **No Intermediate Storage**: Processes strings without building intermediate representations
4. **Natural Backspace Handling**: By processing from right to left, backspaces are naturally handled
5. **Industry Standard**: Widely accepted and used solution for this problem
6. **Minimal Operations**: Each element is visited at most once

---

## Related Problems

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Backspace String Compare | [Link](https://leetcode.com/problems/backspace-string-compare/) | Compare strings with backspaces (primary problem) |
| Crawler Log Folder | [Link](https://leetcode.com/problems/crawler-log-folder/) | Similar backspace-like behavior with folder navigation |
| Robot Collisions | [Link](https://leetcode.com/problems/robot-collisions/) | Stack-based approach for collision problems |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Decode String | [Link](https://leetcode.com/problems/decode-string/) | Stack-based string decoding with nested patterns |
| Design a Text Editor | [Link](https://leetcode.com/problems/design-a-text-editor/) | Implement text editor operations with backspace |
| Letter Tile Possibilities | [Link](https://leetcode.com/problems/letter-tile-possibilities/) | Backtracking with character operations |
| Find the Longest Valid Parentheses | [Link](https://leetcode.com/problems/longest-valid-parentheses/) | Stack-based parenthesis validation |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Regular Expression Matching | [Link](https://leetcode.com/problems/regular-expression-matching/) | Complex pattern matching with backspace semantics |
| Number of Atoms | [Link](https://leetcode.com/problems/number-of-atoms/) | Stack-based parsing with nested structures |

---

## Video Tutorial Links

### Two Pointers Technique

- [NeetCode - Backspace String Compare](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation with visual examples
- [Back to Back SWE - Backspace String Compare](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Detailed walkthrough of the two-pointer approach
- [LeetCode Official Solution](https://www.youtube.com/watch?v=0lGNeO7xW7k) - Official problem solution
- [Two Pointer Technique Explained](https://www.youtube.com/watch?v=8jP8CCrj8cI) - Understanding the two-pointer technique

### Stack-Based Approaches

- [Stack vs Two Pointer](https://www.youtube.com/watch?v=vOS1QSXKq2Y) - Comparison of different approaches
- [Stack Data Structure - Complete Guide](https://www.youtube.com/watch?v=1AJ4ldc2E1Q) - Understanding stack operations

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

## Pattern Variations

### Variation 1: Multiple Backspace Characters
For problems where backspace is represented by different characters (e.g., both `#` and `<`), modify the skip condition to check for any backspace character.

### Variation 2: Case-Insensitive Comparison
Add `.lower()` or `tolower()` calls when comparing characters for case-insensitive matching.

### Variation 3: Unicode Backspaces
The character-based approach naturally handles Unicode correctly since it operates on individual code points.

### Variation 4: Custom Delete Behavior
For problems where backspace deletes a different number of characters, adjust the skip counter accordingly.

---

## Summary

The **Two Pointers - String Comparison with Backspaces** pattern is essential for efficiently comparing strings with backspace/delete operations:

1. **Core Technique**: Process strings from right to left, using pointers to skip over characters invalidated by backspaces
2. **Optimal Solution**: Achieves O(n) time and O(1) space complexity
3. **Natural Fit**: Backward processing matches the "delete left" semantics of backspaces
4. **Versatility**: Can be adapted for various backspace and deletion scenarios
5. **Interview Favorite**: Commonly asked in technical interviews

Key takeaways:
- The backward iteration approach is the optimal solution with O(1) space
- Stack-based and build-string approaches are more intuitive but use O(n) space
- The key insight is that backspaces affect characters to their left, making backward processing efficient
- This pattern forms the foundation for many string processing interview problems

---

## Additional Resources

- [LeetCode - Backspace String Compare](https://leetcode.com/problems/backspace-string-compare/) - Primary problem
- [Two Pointer Technique - GeeksforGeeks](https://www.geeksforgeeks.org/two-pointers-technique/) - Detailed explanation
- [Stack Data Structure - GeeksforGeeks](https://www.geeksforgeeks.org/stack-data-structure/) - Understanding stacks
- [String Processing Algorithms - Wikipedia](https://en.wikipedia.org/wiki/String_algorithms) - Learn about string algorithms
- [LeetCode Discuss](https://leetcode.com/problems/backspace-string-compare/discuss/) - Community solutions and insights
