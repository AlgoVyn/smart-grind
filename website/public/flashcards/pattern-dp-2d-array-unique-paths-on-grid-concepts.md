## DP - 2D Array (Unique Paths on Grid): Core Concepts

What are the fundamental concepts behind unique paths on grid?

<!-- front -->

---

### The Core Insight

**Top-Left Dependency**: The number of ways to reach any cell depends ONLY on the cells from which we can directly arrive (typically the cell above and the cell to the left).

```
    [i-1][j] (from top)
         ↓
[i][j-1] → [i][j] (current cell)
(from left)

dp[i][j] = dp[i-1][j] + dp[i][j-1]
```

---

### Problem Variants

| Variant | Question | Recurrence |
|---------|----------|------------|
| **Unique Paths** | How many ways to reach end? | `dp[i][j] = dp[i-1][j] + dp[i][j-1]` |
| **With Obstacles** | Paths avoiding blocked cells? | `0` if obstacle, else sum |
| **Minimum Path Sum** | Path with minimum weight? | `min(dp[i-1][j], dp[i][j-1]) + grid[i][j]` |
| **Maximum Path Sum** | Path with maximum weight? | `max(dp[i-1][j], dp[i][j-1]) + grid[i][j]` |
| **Dungeon Game** | Minimum initial health needed? | Work backwards from end |

---

### Base Cases Explained

**First Row**: Can only be reached from the left
```
[1] → [1] → [1] → [1]
Only one way: keep going right
```

**First Column**: Can only be reached from above
```
[1]
↓
[1]
↓
[1]
Only one way: keep going down
```

**With Obstacles**: Once blocked, all cells after are unreachable (0)

---

### Space Optimization Insight

**Key Realization**: We only need the previous row to compute the current row.

```
Before: Store entire m×n grid
        dp[i][j] = dp[i-1][j] + dp[i][j-1]

After:  Store just one row (n elements)
        dp[j] = dp[j] (from top, stored) + dp[j-1] (from left, just computed)
               ↑                      ↑
          previous row             current row
```

**Result**: Space reduces from O(m×n) to O(n)

---

### Combinatorics Shortcut

**For basic unique paths (no obstacles):**
- Need exactly `(m-1)` down moves and `(n-1)` right moves
- Total moves: `(m-1) + (n-1) = m+n-2`
- Choose which moves are down (or right)
- Answer: `C(m+n-2, m-1)` or `C(m+n-2, n-1)`

```python
from math import comb
paths = comb(m + n - 2, min(m - 1, n - 1))  # O(min(m,n)) time
```

**When it works**: No obstacles, just counting paths.

---

### Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| **2D DP** | O(m×n) | O(m×n) | Learning, path reconstruction |
| **Space Optimized** | O(m×n) | O(min(m,n)) | Memory constrained |
| **Combinatorics** | O(min(m,n)) | O(1) | Large grids, no obstacles |

<!-- back -->
