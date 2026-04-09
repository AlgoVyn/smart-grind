## DP - Longest Common Subsequence: Framework

What is the complete code template for LCS problems?

<!-- front -->

---

### Framework 1: Standard LCS DP

```
┌─────────────────────────────────────────────────────┐
│  LCS - TEMPLATE                                        │
├─────────────────────────────────────────────────────┤
│  dp[i][j] = LCS length of text1[0:i] and text2[0:j]    │
│                                                        │
│  1. Create dp table: (m+1) × (n+1), all zeros        │
│                                                        │
│  2. For i from 1 to m:                                │
│     For j from 1 to n:                                │
│        If text1[i-1] == text2[j-1]:                   │
│           dp[i][j] = dp[i-1][j-1] + 1                │
│        Else:                                          │
│           dp[i][j] = max(dp[i-1][j], dp[i][j-1])     │
│                                                        │
│  3. Return dp[m][n]                                    │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: LCS Length

```python
def longest_common_subsequence(text1, text2):
    """
    Find LCS length.
    LeetCode 1143
    Time: O(m×n), Space: O(m×n)
    """
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

### Implementation: Space Optimized

```python
def lcs_optimized(text1, text2):
    """O(min(m,n)) space."""
    if len(text1) < len(text2):
        text1, text2 = text2, text1
    
    prev = [0] * (len(text2) + 1)
    curr = [0] * (len(text2) + 1)
    
    for i in range(1, len(text1) + 1):
        for j in range(1, len(text2) + 1):
            if text1[i-1] == text2[j-1]:
                curr[j] = prev[j-1] + 1
            else:
                curr[j] = max(prev[j], curr[j-1])
        prev, curr = curr, prev
    
    return prev[len(text2)]
```

---

### Key Pattern Elements

| Case | Transition | Meaning |
|------|------------|---------|
| Match | dp[i-1][j-1] + 1 | Extend LCS |
| Mismatch | max(dp[i-1][j], dp[i][j-1]) | Skip char from either |

<!-- back -->
