# Reverse Vowels of a String

## Problem Description

Given a string `s`, reverse only all the vowels in the string and return it.

The vowels are 'a', 'e', 'i', 'o', and 'u', and they can appear in both lower and upper cases.

### Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `s = "IceCreAm"` | `"AceCreIm"` |

**Explanation:** The vowels in `s` are `['I', 'e', 'e', 'A']`. On reversing the vowels, `s` becomes `"AceCreIm"`.

**Example 2:**

| Input | Output |
|-------|--------|
| `s = "leetcode"` | `"leotcede"` |

### Constraints

- `1 <= s.length <= 3 * 10^5`
- `s` consists of printable ASCII characters.

---

## Solution

```python
class Solution:
    def reverseVowels(self, s: str) -> str:
        vowels = set('aeiouAEIOU')
        s = list(s)
        left, right = 0, len(s) - 1
        while left < right:
            if s[left] not in vowels:
                left += 1
            elif s[right] not in vowels:
                right -= 1
            else:
                s[left], s[right] = s[right], s[left]
                left += 1
                right -= 1
        return ''.join(s)
```

---

## Explanation

Use two pointers to find vowels from both ends and swap them. Skip non-vowels. This is O(n) time and O(n) space for the list conversion.

### Time Complexity

- O(n), where n is the length of the string.

### Space Complexity

- O(n), for the character list.
