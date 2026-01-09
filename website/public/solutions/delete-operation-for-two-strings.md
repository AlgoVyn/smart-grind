# Delete Operation For Two Strings

## Problem Description
Given two strings word1 and word2, return the minimum number of steps required to make word1 and word2 the same.
In one step, you can delete exactly one character in either string.

---

## Examples

**Example 1:**

**Input:**
```python
word1 = "sea", word2 = "eat"
```

**Output:**
```python
2
```

**Explanation:**
You need one step to make "sea" to "ea" and another step to make "eat" to "ea".

**Example 2:**

**Input:**
```python
word1 = "leetcode", word2 = "etco"
```

**Output:**
```python
4
```

---

## Constraints

- `1 <= word1.length, word2.length <= 500`
- `word1 and word2 consist of only lowercase English letters.`

---

## Solution

```
# Python solution
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if word1[i-1] == word2[j-1]:
                    dp[i][j] = dp[i-1][j-1] + 1
                else:
                    dp[i][j] = max(dp[i-1][j], dp[i][j-1])
        lcs = dp[m][n]
        return m + n - 2 * lcs
```

---

## Explanation

To make two strings the same by deleting characters, we need to find the longest common subsequence (LCS) between them. The minimum number of deletions is the total characters minus twice the LCS length, because each character not in LCS must be deleted from one string.

We use dynamic programming to compute the LCS:
- `dp[i][j]` represents the LCS length for the first `i` characters of `word1` and first `j` characters of `word2`.
- If characters match, `dp[i][j] = dp[i-1][j-1] + 1`.
- Otherwise, `dp[i][j] = max(dp[i-1][j], dp[i][j-1])`.

---

## Time Complexity

**O(m * n)**, where m and n are the lengths of the strings.

---

## Space Complexity

**O(m * n)** for the dp table, which can be optimized to **O(min(m, n))** with space optimization.
