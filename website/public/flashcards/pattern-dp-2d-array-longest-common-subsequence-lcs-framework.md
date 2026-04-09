## DP - 2D Array (LCS): Framework

What is the complete algorithm framework for solving LCS problems?

<!-- front -->

---

### Core Framework

```
1. Initialize: dp = (m+1) × (n+1) table with zeros
2. Iterate: for i=1 to m, for j=1 to n
3. Decision:
   ├─ Match: if s1[i-1] == s2[j-1]
   │         → dp[i][j] = dp[i-1][j-1] + 1
   └─ Mismatch: else
             → dp[i][j] = max(dp[i-1][j], dp[i][j-1])
4. Return: dp[m][n]
```

---

### Key Formula

| Condition | Recurrence |
|-----------|------------|
| **Match** | `dp[i][j] = dp[i-1][j-1] + 1` |
| **Mismatch** | `dp[i][j] = max(dp[i-1][j], dp[i][j-1])` |

---

### Algorithm Steps

**Step 1: Setup**
- Create (m+1) × (n+1) DP table
- Initialize first row and column to 0 (empty prefix = LCS of 0)

**Step 2: Fill Table**
- For each position (i, j):
  - Compare s1[i-1] with s2[j-1]
  - If match: extend diagonal by 1
  - If mismatch: take best of top or left

**Step 3: Extract Result**
- Length: dp[m][n]
- String: backtrack from (m, n) to (0, 0)

<!-- back -->
