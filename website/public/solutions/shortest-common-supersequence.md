# Shortest Common Supersequence

## Problem Description

Given two strings `str1` and `str2`, return the shortest string that has both `str1` and `str2` as subsequences. If there are multiple valid strings, return any of them.

A string `s` is a subsequence of string `t` if deleting some number of characters from `t` (possibly 0) results in the string `s`.

### Examples

**Example 1:**
- Input: `str1 = "abac", str2 = "cab"`
- Output: `"cabac"`

**Explanation:**
- `str1 = "abac"` is a subsequence of `"cabac"` because we can delete the first `"c"`.
- `str2 = "cab"` is a subsequence of `"cabac"` because we can delete the last `"ac"`.
The answer provided is the shortest such string that satisfies these properties.

**Example 2:**
- Input: `str1 = "aaaaaaaa", str2 = "aaaaaaaa"`
- Output: `"aaaaaaaa"`

### Constraints

- `1 <= str1.length, str2.length <= 1000`
- `str1` and `str2` consist of lowercase English letters only.

---

## Solution

```python
class Solution:
    def shortestCommonSupersequence(self, str1: str, str2: str) -> str:
        m, n = len(str1), len(str2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        
        # Build DP table
        for i in range(m + 1):
            dp[i][0] = i
        for j in range(n + 1):
            dp[0][j] = j
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if str1[i-1] == str2[j-1]:
                    dp[i][j] = dp[i-1][j-1] + 1
                else:
                    dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + 1
        
        # Build the string
        result = []
        i, j = m, n
        while i > 0 or j > 0:
            if i > 0 and j > 0 and str1[i-1] == str2[j-1]:
                result.append(str1[i-1])
                i -= 1
                j -= 1
            elif i > 0 and (j == 0 or dp[i-1][j] < dp[i][j-1]):
                result.append(str1[i-1])
                i -= 1
            else:
                result.append(str2[j-1])
                j -= 1
        return ''.join(result[::-1])
```

---

## Explanation

Use dynamic programming to compute the length of the shortest common supersequence and then backtrack to construct the actual string.

### Approach

1. Build a DP table where `dp[i][j]` is the length of the shortest common supersequence for `str1[:i]` and `str2[:j]`.
2. If characters match, take diagonal value plus 1.
3. Otherwise, take minimum of left or top value plus 1.
4. Backtrack from `dp[m][n]` to build the string by appending characters from `str1` or `str2` based on the DP choices.

### Algorithm Steps

1. **Build DP Table:**
   - Initialize `dp[i][0] = i` and `dp[0][j] = j`.
   - Fill the table based on character matching.

2. **Backtrack to Build Result:**
   - Start from `dp[m][n]`.
   - If characters match, add the character and move diagonally.
   - Otherwise, move in the direction of the smaller value.

### Time Complexity

- **O(m * n)**, for building the DP table.

### Space Complexity

- **O(m * n)**, for the DP table.
