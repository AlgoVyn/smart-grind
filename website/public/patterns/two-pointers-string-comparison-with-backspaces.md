# Two Pointers - String Comparison with Backspaces

## Overview

The Two Pointers - String Comparison with Backspaces pattern is designed for comparing strings that include backspace characters ('#'), which delete the previous character. Instead of building new strings, this pattern uses two pointers starting from the end of each string to simulate the backspace operations in-place. It's efficient for problems where you need to compare the final effective strings without extra space.

## Key Concepts

- **Backward Traversal**: Start from the end to handle backspaces naturally.
- **Skip Characters**: Use a counter to skip characters that are backspaced.
- **Effective Character**: Only consider characters not deleted by backspaces.
- **Simultaneous Comparison**: Move pointers and compare valid characters.

## Template

```python
def backspace_compare(s, t):
    """
    Template for Two Pointers - String Comparison with Backspaces.
    Compares two strings with backspace characters.
    """
    i, j = len(s) - 1, len(t) - 1  # Pointers at end of strings
    skip_s, skip_t = 0, 0  # Counters for backspaces
    
    while i >= 0 or j >= 0:
        # Find next valid character in s
        while i >= 0:
            if s[i] == '#':
                skip_s += 1
                i -= 1
            elif skip_s > 0:
                skip_s -= 1
                i -= 1
            else:
                break
        
        # Find next valid character in t
        while j >= 0:
            if t[j] == '#':
                skip_t += 1
                j -= 1
            elif skip_t > 0:
                skip_t -= 1
                j -= 1
            else:
                break
        
        # Compare valid characters
        if (i >= 0) != (j >= 0) or (i >= 0 and s[i] != t[j]):
            return False
        
        i -= 1
        j -= 1
    
    return True
```

## Example Problems

1. **Backspace String Compare**: Determine if two strings are equal after processing backspaces.
2. **Build String with Backspaces**: Construct the final string after applying backspaces (can use similar logic).
3. **Simplify Path**: Simplify Unix-style file paths, handling '..' and '.' with backspace-like logic.

## Time and Space Complexity

- **Time Complexity**: O(n + m), where n and m are string lengths, as each character is processed at most once.
- **Space Complexity**: O(1), using only pointers and counters.

## Common Pitfalls

- **Multiple Backspaces**: Ensure skip counters handle consecutive '#' correctly.
- **End of String**: Check pointer bounds to avoid index errors.
- **Unequal Lengths**: Compare only when both pointers are valid.
- **Edge Cases**: Handle strings with all backspaces or empty strings.