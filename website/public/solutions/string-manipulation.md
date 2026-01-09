# String Manipulation

## Problem Description
## Solution

```python
class Solution:
    def isPalindrome(self, s: str) -> bool:
        s = ''.join(c.lower() for c in s if c.isalnum())
        return s == s[::-1]
```

## Explanation
To check if a string is a palindrome ignoring case and non-alphanumeric, clean the string by keeping only alphanumeric characters in lowercase, then compare with its reverse.

**Time Complexity:** O(n), for cleaning and reversing.

**Space Complexity:** O(n), for the cleaned string.
