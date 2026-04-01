## Title: LCS Forms

What are the different forms and variations of LCS problems?

<!-- front -->

---

### Problem Variations
| Variant | Description | Modification |
|---------|-------------|--------------|
| LCS | Standard | Base case |
| Shortest Common Supersequence (SCS) | Shortest string containing both | SCS = X + Y - LCS |
| Longest Palindromic Subsequence | LCS of string and reverse | LCS(S, reverse(S)) |
| Edit Distance (Levenshtein) | Min operations | +1 for substitute |
| Longest Common Substring | Continuous | Reset when mismatch |

### Edit Distance
```python
def edit_distance(X, Y):
    m, n = len(X), len(Y)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(m + 1):
        dp[i][0] = i  # delete all
    for j in range(n + 1):
        dp[0][j] = j  # insert all
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if X[i-1] == Y[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j],    # delete
                                   dp[i][j-1],    # insert
                                   dp[i-1][j-1])  # replace
    return dp[m][n]
```

---

### Longest Common Substring
```python
def longest_common_substring(X, Y):
    m, n = len(X), len(Y)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    max_len = 0
    end_pos = 0
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if X[i-1] == Y[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
                if dp[i][j] > max_len:
                    max_len = dp[i][j]
                    end_pos = i
            else:
                dp[i][j] = 0  # substring: reset
    
    return X[end_pos - max_len : end_pos]
```

---

### Multiple Sequence Alignment
| Approach | Complexity |
|----------|------------|
| 3-way LCS | O(n³) |
| k-way LCS | O(n^k) - NP-hard for general k |
| Approximation | Heuristics for bioinformatics |
| Progressive | Pairwise then merge |

<!-- back -->
