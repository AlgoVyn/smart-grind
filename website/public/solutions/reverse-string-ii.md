# Reverse String II

## Problem Description

Given a string `s` and an integer `k`, reverse the first `k` characters for every `2k` characters counting from the start of the string.

If there are fewer than `k` characters left, reverse all of them. If there are less than `2k` but greater than or equal to `k` characters, then reverse the first `k` characters and leave the rest as original.

### Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `s = "abcdefg"`<br>`k = 2` | `"bacdfeg"` |

**Example 2:**

| Input | Output |
|-------|--------|
| `s = "abcd"`<br>`k = 2` | `"bacd"` |

### Constraints

- `1 <= s.length <= 10^4`
- `s` consists of only lowercase English letters.
- `1 <= k <= 10^4`

---

## Solution

```python
class Solution:
    def reverseStr(self, s: str, k: int) -> str:
        s = list(s)
        for i in range(0, len(s), 2 * k):
            s[i:i + k] = reversed(s[i:i + k])
        return ''.join(s)
```

---

## Explanation

Reverse every `2k` characters, but only the first `k` in each group. This is O(n) time and O(n) space for the list conversion.

### Time Complexity

- O(n), where n is the length of the string.

### Space Complexity

- O(n), for the character list.
