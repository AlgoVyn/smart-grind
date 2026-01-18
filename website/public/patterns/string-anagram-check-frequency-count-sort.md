# String - Anagram Check (Frequency Count/Sort)

## Overview

The String - Anagram Check pattern is used to determine if two strings are anagrams of each other. Anagrams are strings that contain the same characters with the same frequencies but in different orders. This pattern uses frequency counting or sorting to solve the problem efficiently.

## Key Concepts

- **Frequency Count**: Count occurrences of each character in both strings.
- **Character Sorting**: Sort both strings and compare if they are identical.
- **Case Sensitivity**: Consider if characters should be treated as case-sensitive or not.
- **Unicode Support**: Handle different character sets if necessary.

## Template

```python
def is_anagram_frequency(s, t):
    if len(s) != len(t):
        return False
    
    frequency = {}
    for char in s:
        frequency[char] = frequency.get(char, 0) + 1
    
    for char in t:
        if char not in frequency or frequency[char] == 0:
            return False
        frequency[char] -= 1
    
    return True

def is_anagram_sort(s, t):
    if len(s) != len(t):
        return False
    return sorted(s) == sorted(t)
```

## Example Problems

1. **Valid Anagram (LeetCode 242)**: Check if two strings are anagrams.
2. **Group Anagrams (LeetCode 49)**: Group anagrams from a list of strings.
3. **Find All Anagrams in a String (LeetCode 438)**: Find all starting indices of anagrams.
4. **Anagram Mappings**: Find indices mapping between anagrams.

## Time and Space Complexity

- **Frequency Count Approach**: O(n) time, O(n) space (n is length of strings).
- **Sorting Approach**: O(n log n) time, O(n) space (for sorted strings).

## Common Pitfalls

- **Not checking string lengths first**: Can lead to incorrect results if strings are of different lengths.
- **Case sensitivity issues**: Assuming all characters are lowercase without checking.
- **Ignoring whitespace or special characters**: Not handling non-alphabet characters correctly.
- **Overcomplicating frequency count**: Using complex data structures when a simple dictionary suffices.
- **Not considering empty strings**: Empty strings are anagrams of each other.
