# Is Subsequence

## Problem Description

Given two strings `s` and `t`, return `true` if `s` is a **subsequence** of `t`, or `false` otherwise.

A **subsequence** of a string is a new string that is formed from the original string by deleting some (can be none) of the characters without disturbing the relative positions of the remaining characters.

For example:
- `"ace"` is a subsequence of `"abcde"`
- `"aec"` is **not** a subsequence of `"abcde"` (order is wrong)

---

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `s = "abc"`, `t = "ahbgdc"` | `true` |

**Example 2:**

| Input | Output |
|-------|--------|
| `s = "axc"`, `t = "ahbgdc"` | `false` |

---

## Constraints

- `0 <= s.length <= 100`
- `0 <= t.length <= 10⁴`
- `s` and `t` consist only of lowercase English letters.

**Follow up:** Suppose there are lots of incoming `s`, say `s1, s2, ..., sk` where `k >= 10⁹`, and you want to check if `t` has each as a subsequence. How would you change your code?

---

## Solution

```python
class Solution:
    def isSubsequence(self, s: str, t: str) -> bool:
        i, j = 0, 0  # i for s, j for t
        
        while i < len(s) and j < len(t):
            if s[i] == t[j]:
                i += 1  # Match found, move to next char in s
            j += 1  # Always move to next char in t
        
        return i == len(s)  # True if we matched all of s
```

---

## Explanation

This problem checks if `s` is a subsequence of `t` using a two-pointer approach.

### Algorithm

1. **Initialize Pointers:** `i = 0` for string `s`, `j = 0` for string `t`.

2. **Traverse `t`:**
   - If `s[i] == t[j]`, increment `i` (found the next character of `s`).
   - Always increment `j` (move through `t`).

3. **Check Completion:** If `i == len(s)`, all characters of `s` were found in order → return `true`.

### Follow-up Optimization

For multiple queries with the same `t`:
1. **Preprocess `t`:** Create a mapping from each character to a list of indices where it appears.
2. **Binary Search:** For each `s`, use binary search to check if characters appear in increasing order.

This reduces per-query time to O(|s| * log |t|).

---

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(|t|) - single pass through `t` |
| **Space** | O(1) - constant space |

For the follow-up with preprocessing: O(|t|) preprocessing, O(|s| * log |t|) per query.
