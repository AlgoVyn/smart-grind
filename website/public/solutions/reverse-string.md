# Reverse String

## Problem Description

Write a function that reverses a string. The input string is given as an array of characters `s`.

You must do this by modifying the input array in-place with O(1) extra memory.

### Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `s = ["h","e","l","l","o"]` | `["o","l","l","e","h"]` |

**Example 2:**

| Input | Output |
|-------|--------|
| `s = ["H","a","n","n","a","h"]` | `["h","a","n","n","a","H"]` |

### Constraints

- `1 <= s.length <= 10^5`
- `s[i]` is a printable ASCII character.

---

## Solution

```python
from typing import List

class Solution:
    def reverseString(self, s: List[str]) -> None:
        left, right = 0, len(s) - 1
        while left < right:
            s[left], s[right] = s[right], s[left]
            left += 1
            right -= 1
```

---

## Explanation

Use two pointers to swap characters from both ends until they meet. This reverses in O(n) time and O(1) space.

### Time Complexity

- O(n), where n is the length of the string.

### Space Complexity

- O(1), using constant extra space.
