## DP - Longest Common Subsequence: Core Concepts

What are the fundamental principles of LCS?

<!-- front -->

---

### Core Concept

**Build a DP table where each cell represents the LCS of prefixes, extending when characters match or carrying forward the best result when they don't.**

**Visual DP Table:**
```
  "abcde" vs "ace"

      a  c  e
   0  0  0  0
a  0  1  1  1
b  0  1  1  1
c  0  1  2  2
d  0  1  2  2
e  0  1  2  3  ← LCS = 3 ("ace")
```

---

### The Pattern

```
Two cases:
1. Characters match: LCS extends by 1
   dp[i][j] = dp[i-1][j-1] + 1
   
2. Characters differ: Take best of skipping either
   dp[i][j] = max(dp[i-1][j], dp[i][j-1])

Build up from smaller prefixes to full strings.
```

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| LCS | String similarity | LeetCode 1143 |
| Edit distance | With insert/delete cost | LeetCode 72 |
| Diff | File comparison | Version control |
| DNA alignment | Bioinformatics | Sequence matching |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(m×n) | Fill all cells |
| Space | O(m×n) | Full table |
| Optimized | O(min(m,n)) | Two rows only |

<!-- back -->
