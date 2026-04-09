## DP - Longest Common Subsequence: Tactics

What are the advanced techniques for LCS?

<!-- front -->

---

### Tactic 1: Reconstruct LCS String

```python
def get_lcs_string(text1, text2):
    """Return the actual LCS string."""
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    # Fill DP table
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    # Backtrack to get string
    lcs = []
    i, j = m, n
    while i > 0 and j > 0:
        if text1[i-1] == text2[j-1]:
            lcs.append(text1[i-1])
            i -= 1
            j -= 1
        elif dp[i-1][j] > dp[i][j-1]:
            i -= 1
        else:
            j -= 1
    
    return ''.join(reversed(lcs))
```

---

### Tactic 2: Shortest Common Supersequence

```python
def shortest_common_supersequence(s1, s2):
    """Shortest string containing both s1 and s2."""
    lcs_len = longest_common_subsequence(s1, s2)
    return len(s1) + len(s2) - lcs_len
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Wrong indices | Off-by-one | Remember dp[i][j] = text[:i], text[:j] |
| Not +1 on match | Wrong length | dp[i][j] = dp[i-1][j-1] + 1 |
| Wrong skip logic | Wrong path | max of up and left |
| Reconstruction order | Wrong string | Reverse at end |

---

### Tactic 4: Edit Distance (Levenshtein)

```python
def edit_distance(s1, s2):
    """Minimum operations to convert s1 to s2."""
    m, n = len(s1), len(s2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if s1[i-1] == s2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j],    # Delete
                                  dp[i][j-1],    # Insert
                                  dp[i-1][j-1])  # Replace
    return dp[m][n]
```

<!-- back -->
