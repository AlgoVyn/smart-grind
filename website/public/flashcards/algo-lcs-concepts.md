## Title: LCS - Longest Common Subsequence

What is the LCS problem and how is it solved?

<!-- front -->

---

### Definition
Given two sequences, find the length of the longest subsequence present in both. A subsequence is derived by deleting elements without changing order.

### Examples
```
X = "ABCBDAB", Y = "BDCABA"
LCS = "BCBA" (length 4)

X = "AGGTAB", Y = "GXTXAYB"
LCS = "GTAB" (length 4)
```

### DP Recurrence
```
dp[i][j] = length of LCS of X[0..i-1] and Y[0..j-1]

if X[i-1] == Y[j-1]:
    dp[i][j] = dp[i-1][j-1] + 1
else:
    dp[i][j] = max(dp[i-1][j], dp[i][j-1])
```

---

### Implementation
```python
def lcs_length(X, Y):
    m, n = len(X), len(Y)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if X[i-1] == Y[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]

# Space optimized - only need previous row
def lcs_length_optimized(X, Y):
    m, n = len(X), len(Y)
    if m < n:
        X, Y = Y, X  # ensure Y is shorter
        m, n = n, m
    
    prev = [0] * (n + 1)
    curr = [0] * (n + 1)
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if X[i-1] == Y[j-1]:
                curr[j] = prev[j-1] + 1
            else:
                curr[j] = max(prev[j], curr[j-1])
        prev, curr = curr, prev
    
    return prev[n]
```

---

### Complexity
| Aspect | Value |
|--------|-------|
| Time | O(m × n) |
| Space | O(m × n) or O(min(m,n)) |
| Reconstruction | O(m + n) additional |

<!-- back -->
