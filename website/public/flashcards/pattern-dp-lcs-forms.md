## DP - Longest Common Subsequence: Forms

What are the different variations of LCS?

<!-- front -->

---

### Form 1: Standard LCS

```python
def lcs(text1, text2):
    """Standard 2D DP solution."""
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]
```

---

### Form 2: Space Optimized

```python
def lcs_optimized(t1, t2):
    """O(min(m,n)) space."""
    if len(t1) < len(t2):
        t1, t2 = t2, t1
    
    prev = [0] * (len(t2) + 1)
    curr = [0] * (len(t2) + 1)
    
    for i in range(1, len(t1) + 1):
        for j in range(1, len(t2) + 1):
            if t1[i-1] == t2[j-1]:
                curr[j] = prev[j-1] + 1
            else:
                curr[j] = max(prev[j], curr[j-1])
        prev, curr = curr, prev
    
    return prev[len(t2)]
```

---

### Form 3: With Reconstruction

```python
def lcs_with_string(t1, t2):
    """Return LCS string."""
    # Build full DP table
    # Backtrack from dp[m][n]
    # Return reversed string
```

---

### Form Comparison

| Form | Space | Can Reconstruct | Use Case |
|------|-------|-----------------|----------|
| Standard | O(m×n) | Yes | Learning, reconstruction |
| Optimized | O(min) | No | Large inputs |
| With string | O(m×n) | Yes | Need actual LCS |

<!-- back -->
