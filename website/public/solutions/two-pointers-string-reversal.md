# Two Pointers - String Reversal

## Overview

The Two Pointers - String Reversal pattern is a straightforward technique for reversing strings or substrings in-place. It uses two pointers starting from the beginning and end of the string, swapping characters and moving towards the center. This pattern is efficient for in-place reversals and is commonly used in string manipulation problems.

## Key Concepts

- **Swap Operation**: Exchange characters at left and right pointers.
- **Pointer Convergence**: Move pointers towards each other until they meet.
- **In-place Modification**: Reverse the string without additional space.
- **Substring Reversal**: Can be adapted to reverse specific ranges.

## Template

```python
def reverse_string(s):
    """
    Template for Two Pointers - String Reversal.
    Reverses the string in-place.
    """
    left, right = 0, len(s) - 1  # Pointers at start and end
    
    while left < right:
        # Swap characters
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1
```

## Example Problems

1. **Reverse String**: Reverse a string in-place.
2. **Reverse String II**: Reverse the string in groups of k characters.
3. **Reverse Words in a String III**: Reverse each word in a string individually.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the string length, as each character is swapped once.
- **Space Complexity**: O(1), performing reversal in-place.

## Common Pitfalls

- **Immutable Strings**: Ensure the string is mutable (e.g., list in Python) for in-place changes.
- **Pointer Crossing**: Stop when left >= right to avoid redundant swaps.
- **Empty Strings**: Handle empty or single-character strings gracefully.
- **Range Reversal**: When reversing substrings, set pointers to start and end indices correctly.