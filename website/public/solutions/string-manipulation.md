# String Manipulation

## Problem Description

String manipulation problems involve transforming, searching, or analyzing strings efficiently.

### Common Techniques

- **Two Pointers** — Palindrome checking, string reversal
- **Sliding Window** — Substring problems
- **Hash Maps** — Character counting, anagrams
- **Stack** — Parentheses validation

---

## Example Problem

**Valid Palindrome:**

Check if a string is a palindrome, ignoring case and non-alphanumeric characters.

---

## Solution

```python
class Solution:
    def isPalindrome(self, s: str) -> bool:
        # Filter and lowercase
        filtered = ''.join(c.lower() for c in s if c.isalnum())
        return filtered == filtered[::-1]
```

---

## Explanation

1. **Filter** to keep only alphanumeric characters
2. **Lowercase** for case-insensitive comparison
3. **Compare** with reversed string

### Time Complexity

- **O(n)** — Single pass through string

### Space Complexity

- **O(n)** — Filtered string

---

## Common Problems

- [Valid Palindrome](https://leetcode.com/problems/valid-palindrome/)
- [Reverse String](https://leetcode.com/problems/reverse-string/)
- [Valid Parentheses](https://leetcode.com/problems/valid-parentheses/)
