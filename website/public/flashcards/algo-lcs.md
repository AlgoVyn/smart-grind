## Longest Common Subsequence

**Question:** How do you find the longest common subsequence between two strings?

<!-- front -->

---

## Answer: Dynamic Programming

### Solution
```python
def longestCommonSubsequence(text1, text2):
    m, n = len(text1), len(text2)
    
    # 2D DP
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]
```

### Visual: DP Table Building
```
text1 = "abcde", text2 = "ace"

    ""  a  c  e
""   0  0  0  0
a    0  1  1  1
b    0  1  1  1  
c    0  1  2  2
d    0  1  2  2
e    0  1  2  3

LCS = 3 ("ace")
```

### ⚠️ Tricky Parts

#### 1. Why DP[i][j] = DP[i-1][j-1] + 1?
```python
# When characters match:
# LCS(i,j) = LCS(i-1, j-1) + 1

# Because we can extend the LCS of
# the prefixes without these characters

# text1[:i], text2[:j] → common subsequence
# = "ace" 
# Remove last chars → "ac" still common
```

#### 2. Why DP[i][j] = max(DP[i-1][j], DP[i][j-1])?
```python
# When characters don't match:
# LCS(i,j) = max(LCS without text1[i-1], 
#                LCS without text2[j-1])

# Either:
# - Skip char from text1 (use text1[:i-1])
# - Skip char from text2 (use text2[:j-1])

# Take the better option
```

#### 3. Space Optimization
```python
# Only need previous row
def lcsOptimized(s1, s2):
    n, m = len(s1), len(s2)
    if n < m:
        s1, s2 = s2, s1
        n, m = m, n
    
    prev = [0] * (m + 1)
    curr = [0] * (m + 1)
    
    for i in range(1, n + 1):
        for j in range(1, m + 1):
            if s1[i-1] == s2[j-1]:
                curr[j] = prev[j-1] + 1
            else:
                curr[j] = max(prev[j], curr[j-1])
        prev, curr = curr, prev
    
    return prev[m]
```

### Reconstruct LCS
```python
def getLCS(s1, s2):
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Fill table (same as before)
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    # Backtrack
    lcs = []
    i, j = m, n
    while i > 0 and j > 0:
        if s1[i-1] == s2[j-1]:
            lcs.append(s1[i-1])
            i -= 1
            j -= 1
        elif dp[i-1][j] > dp[i][j-1]:
            i -= 1
        else:
            j -= 1
    
    return ''.join(reversed(lcs))
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| 2D DP | O(m×n) | O(m×n) |
| 1D DP | O(m×n) | O(min(m,n)) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong indices | Use i-1, j-1 for string chars |
| Missing initialization | First row/col = 0 |
| Wrong max | Compare left and above, not diagonal |

<!-- back -->
