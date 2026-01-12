# String - Palindrome Check (Two Pointers / Reverse)

## Overview

A palindrome is a string that reads the same forwards and backwards. This pattern checks if a given string is a palindrome using two main approaches: two pointers or reversing the string. Use this pattern when you need to validate symmetry in strings, such as in problems involving word validation or string manipulation. Benefits include simplicity and efficiency for large strings.

## Key Concepts

- **Two Pointers**: Initialize pointers at start and end, move towards center comparing characters.
- **Reverse Method**: Reverse the string and compare with original.
- Handle case insensitivity and ignore non-alphanumeric characters if needed.

## Template

```python
# Two Pointers Approach
def is_palindrome_two_pointers(s: str) -> bool:
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True

# Reverse Approach
def is_palindrome_reverse(s: str) -> bool:
    return s == s[::-1]
```

## Example Problems

- **Valid Palindrome**: Check if a string is a palindrome, considering only alphanumeric characters and ignoring cases.
- **Palindrome Linked List**: Determine if a linked list is a palindrome.
- **Longest Palindromic Substring**: Find the longest palindromic substring in a string.

## Time and Space Complexity

- **Two Pointers**: O(n) time, O(1) space.
- **Reverse**: O(n) time, O(n) space due to string reversal.

## Common Pitfalls

- Forgetting to handle case sensitivity or non-alphanumeric characters.
- Not considering empty strings as palindromes.
- Inefficient reversal for very large strings.