# Edit Distance

## Problem Description
Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.
You have the following three operations permitted on a word:

Insert a character
Delete a character
Replace a character

### Example(s)

**Input:**
```
word1 = "horse", word2 = "ros"
```

**Output:**
```
3
```

**Explanation:**
```
horse -> rorse (replace 'h' with 'r')
rorse -> rose (remove 'r')
rose -> ros (remove 'e')
```

**Input:**
```
word1 = "intention", word2 = "execution"
```

**Output:**
```
5
```

**Explanation:**
```
intention -> inention (remove 't')
inention -> enention (replace 'i' with 'e')
enention -> exention (replace 'n' with 'x')
exention -> exection (replace 'n' with 'c')
exection -> execution (insert 'u')
```

### Constraints

- `0 <= word1.length, word2.length <= 500`
- `word1 and word2 consist of lowercase English letters.`

## Solution

```python
# Python solution
class Solution:
    def minDistance(self, word1: str, word2: str) -> int:
        m, n = len(word1), len(word2)
        dp = [[0] * (n + 1) for _ in range(m + 1)]
        for i in range(m + 1):
            dp[i][0] = i
        for j in range(n + 1):
            dp[0][j] = j
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                if word1[i-1] == word2[j-1]:
                    dp[i][j] = dp[i-1][j-1]
                else:
                    dp[i][j] = min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]) + 1
        return dp[m][n]
```

## Explanation
This problem requires finding the minimum number of operations (insert, delete, replace) to convert word1 to word2, which is the Levenshtein distance.

We use dynamic programming with a 2D table dp where dp[i][j] represents the minimum operations to convert the first i characters of word1 to the first j characters of word2.

- Initialize the first row and column: dp[i][0] = i (deletions to make word1 empty), dp[0][j] = j (insertions to make word2 from empty).
- For each cell, if characters match, dp[i][j] = dp[i-1][j-1].
- Otherwise, dp[i][j] = min(dp[i-1][j] (delete), dp[i][j-1] (insert), dp[i-1][j-1] (replace)) + 1.

The result is dp[m][n].

Time complexity: O(m * n), where m and n are the lengths of the strings.
Space complexity: O(m * n) for the DP table.
