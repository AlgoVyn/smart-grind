## DP - 2D Array (LCS): Forms

What are the different problem forms and variations of LCS?

<!-- front -->

---

### LCS Variations

| Variant | Description | Formula/Modification |
|---------|-------------|---------------------|
| **Standard LCS** | Longest common subsequence | Base DP algorithm |
| **Shortest Common Supersequence** | Shortest string containing both | SCS = len(A) + len(B) - LCS |
| **Longest Palindromic Subsequence** | LCS of string and its reverse | LPS = LCS(S, reverse(S)) |
| **Edit Distance (Insert/Delete)** | Min deletions to make equal | m + n - 2×LCS |
| **Longest Common Substring** | Must be contiguous | Reset dp[i][j] = 0 on mismatch |

---

### Shortest Common Supersequence

```python
def shortestCommonSupersequence(str1, str2):
    # Build LCS table, then backtrack
    # Add non-matching chars from both strings
    while i > 0 and j > 0:
        if str1[i-1] == str2[j-1]:
            scs.append(str1[i-1])  # LCS char
            i -= 1; j -= 1
        elif dp[i-1][j] > dp[i][j-1]:
            scs.append(str1[i-1])  # From str1
            i -= 1
        else:
            scs.append(str2[j-1])  # From str2
            j -= 1
    # Add remaining chars from either string
```

---

### Longest Common Substring (vs Subsequence)

```python
def longest_common_substring(X, Y):
    m, n = len(X), len(Y)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    max_len = 0
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if X[i-1] == Y[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
                max_len = max(max_len, dp[i][j])
            else:
                dp[i][j] = 0  # Reset for substring!
    
    return max_len
```

**Key difference**: Substring resets to 0 on mismatch; subsequence carries forward max.

---

### Related Problems

| Problem | LeetCode | Key Insight |
|---------|----------|-------------|
| Longest Common Subsequence | 1143 | Base pattern |
| Shortest Common Supersequence | 1092 | Backtrack adding all chars |
| Delete Operation for Two Strings | 583 | m + n - 2×LCS |
| Longest Palindromic Subsequence | 516 | LCS with reverse |
| Uncrossed Lines | 1035 | LCS with matching numbers |

<!-- back -->
