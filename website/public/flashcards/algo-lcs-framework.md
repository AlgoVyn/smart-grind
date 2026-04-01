## Title: LCS Framework

What is the standard DP framework for LCS?

<!-- front -->

---

### LCS Framework
```
LCS(X[0..m-1], Y[0..n-1]):
  
  INITIALIZE:
    dp[i][0] = 0 for all i  (empty Y)
    dp[0][j] = 0 for all j  (empty X)
  
  FILL DP TABLE:
    for i = 1 to m:
      for j = 1 to n:
        if X[i-1] == Y[j-1]:
          dp[i][j] = dp[i-1][j-1] + 1  // match
        else:
          dp[i][j] = max(dp[i-1][j],   // skip X[i-1]
                         dp[i][j-1])   // skip Y[j-1]
  
  RETURN dp[m][n]
```

---

### Reconstruction
```python
def reconstruct_lcs(X, Y, dp):
    """Backtrack to find actual LCS string"""
    i, j = len(X), len(Y)
    lcs = []
    
    while i > 0 and j > 0:
        if X[i-1] == Y[j-1]:
            lcs.append(X[i-1])
            i -= 1
            j -= 1
        elif dp[i-1][j] > dp[i][j-1]:
            i -= 1
        else:
            j -= 1
    
    return ''.join(reversed(lcs))
```

### Key Properties
| Property | Value |
|----------|-------|
| Optimal substructure | Yes |
| Overlapping subproblems | Yes |
| DP type | 2D, bottom-up |

---

### Variations
| Problem | Modification |
|---------|--------------|
| Shortest Common Supersequence | m + n - LCS |
| Longest Palindromic Subsequence | LCS with reversed string |
| Edit Distance | Add substitution cost |
| Longest Repeating Subseq | LCS with itself, i≠j |

<!-- back -->
