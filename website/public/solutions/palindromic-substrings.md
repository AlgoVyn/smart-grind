# Palindromic Substrings

## Problem Description

Given a string `s`, return the number of palindromic substrings in it.

A string is a palindrome when it reads the same backward as forward.
A substring is a contiguous sequence of characters within the string.

### Example 1

**Input:** `s = "abc"`  
**Output:** `3`

**Explanation:** Three palindromic strings: "a", "b", "c".

### Example 2

**Input:** `s = "aaa"`  
**Output:** `6`

**Explanation:** Six palindromic strings: "a", "a", "a", "aa", "aa", "aaa".

### Constraints

- `1 <= s.length <= 1000`
- `s` consists of lowercase English letters.

---

## Solution

```python
class Solution:
    def countSubstrings(self, s: str) -> int:
        count = 0
        for i in range(len(s)):
            count += self.expandAroundCenter(s, i, i)
            count += self.expandAroundCenter(s, i, i + 1)
        return count

    def expandAroundCenter(self, s, left, right):
        count = 0
        while left >= 0 and right < len(s) and s[left] == s[right]:
            count += 1
            left -= 1
            right += 1
        return count
```

---

## Explanation

Similar to longest palindrome, count all palindromic substrings by expanding around centers.

### Step-by-step Approach

1. For each character in the string, treat it as a center for odd-length palindromes.
2. For each position between characters, treat it as a center for even-length palindromes.
3. Expand around each center while the characters match.
4. Count all valid palindromic substrings.

### Complexity Analysis

- **Time Complexity:** O(n^2), where n is the length of the string, as we expand around n centers.
- **Space Complexity:** O(1).
