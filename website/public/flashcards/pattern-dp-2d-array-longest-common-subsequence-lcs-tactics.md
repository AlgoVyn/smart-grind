## DP - 2D Array (LCS): Tactics

What are the implementation tactics and pitfalls for LCS?

<!-- front -->

---

### Implementation Tactics

**Space Optimization**
```python
# Only need previous row
prev = [0] * (n + 1)
curr = [0] * (n + 1)

for i in range(1, m + 1):
    for j in range(1, n + 1):
        if text1[i-1] == text2[j-1]:
            curr[j] = prev[j-1] + 1
        else:
            curr[j] = max(prev[j], curr[j-1])
    prev, curr = curr, prev  # Swap rows
```

**Reconstruction (Backtracking)**
```python
i, j = m, n
lcs = []
while i > 0 and j > 0:
    if text1[i-1] == text2[j-1]:
        lcs.append(text1[i-1])  # Match found
        i -= 1; j -= 1
    elif dp[i-1][j] > dp[i][j-1]:
        i -= 1  # Came from top
    else:
        j -= 1  # Came from left
return ''.join(reversed(lcs))
```

---

### Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| **Off-by-one** | dp[i][j] ↔ text1[i-1], text2[j-1] |
| **Wrong direction** | Backtrack from (m,n) to (0,0), not forward |
| **Confusing substring** | Subsequence ≠ substring (can skip chars) |
| **Forgetting base case** | First row/col must be 0 |
| **Swap error** | prev, curr = curr, prev (not prev = curr) |

<!-- back -->
