# String - Anagram Check (Frequency Count/Sort)

## Overview

An anagram is a word formed by rearranging the letters of another word. This pattern checks if two strings are anagrams using sorting or frequency counting. Use when comparing character compositions, such as in grouping words or validating rearrangements. Benefits: Efficient for large strings with frequency count.

## Key Concepts

- **Sorting**: Sort both strings and compare.
- **Frequency Count**: Use arrays or maps to count character frequencies.

## Template

```python
# Sorting Approach
def is_anagram_sort(s: str, t: str) -> bool:
    return sorted(s) == sorted(t)

# Frequency Count Approach
def is_anagram_count(s: str, t: str) -> bool:
    if len(s) != len(t):
        return False
    count = [0] * 26
    for char in s:
        count[ord(char) - ord('a')] += 1
    for char in t:
        count[ord(char) - ord('a')] -= 1
    return all(c == 0 for c in count)
```

## Example Problems

- **Valid Anagram**: Check if two strings are anagrams.
- **Group Anagrams**: Group strings that are anagrams.
- **Find All Anagrams in a String**: Find starting indices of anagrams of a pattern in a string.

## Time and Space Complexity

- **Sorting**: O(n log n) time, O(n) space.
- **Frequency Count**: O(n) time, O(1) space (assuming fixed alphabet).

## Common Pitfalls

- Not checking lengths first.
- Case sensitivity issues.
- Handling Unicode characters beyond ASCII.