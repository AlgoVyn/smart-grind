# Two Pointers - Expanding From Center

## Overview

The Two Pointers - Expanding From Center pattern is used for palindrome-related problems, such as finding the longest palindromic substring or checking if a string is a palindrome. It starts from a potential center and expands outwards using two pointers, checking for matching characters on both sides. This approach efficiently handles both odd and even-length palindromes.

## Key Concepts

- **Center Selection**: Choose each character (or pair) as a potential center.
- **Outward Expansion**: Move pointers left and right while characters match.
- **Palindrome Length**: Track the maximum length found.
- **Even/Odd Handling**: Treat single characters and pairs differently for centers.

## Template

```python
def longest_palindrome(s):
    """
    Template for Two Pointers - Expanding From Center.
    Finds the longest palindromic substring.
    """
    if not s:
        return ""
    
    def expand(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return s[left+1:right]  # Return the palindrome
    
    result = ""
    for i in range(len(s)):
        # Odd length palindrome
        odd = expand(i, i)
        if len(odd) > len(result):
            result = odd
        
        # Even length palindrome
        even = expand(i, i+1)
        if len(even) > len(result):
            result = even
    
    return result
```

## Example Problems

1. **Longest Palindromic Substring**: Find the longest substring that is a palindrome.
2. **Valid Palindrome**: Check if a string is a palindrome, ignoring case and non-alphanumeric characters.
3. **Palindromic Substrings**: Count the number of palindromic substrings in a string.

## Time and Space Complexity

- **Time Complexity**: O(n^2), where n is the string length, due to expansion from each center.
- **Space Complexity**: O(1), excluding the output string.

## Common Pitfalls

- **Boundary Checks**: Ensure pointers don't go out of bounds during expansion.
- **Case Sensitivity**: Handle case-insensitive comparisons if required.
- **Non-Alphanumeric**: Skip or ignore non-alphanumeric characters for certain problems.
- **Multiple Centers**: Check both odd and even length palindromes for each position.