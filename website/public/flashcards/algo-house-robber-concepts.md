## House Robber: Core Concepts

What is the House Robber problem and what are the key DP strategies?

<!-- front -->

---

### Fundamental Definition

**Problem:** Rob houses in a row to maximize money, without robbing adjacent houses.

| Variant | Constraint |
|---------|------------|
| **Linear** | Cannot rob adjacent |
| **Circular** | First and last are adjacent |
| **Tree** | Binary tree, cannot rob adjacent nodes |

---

### Key DP Insight

```
For house i, two choices:
1. Rob it: get nums[i] + max from houses [0..i-2]
2. Skip it: get max from houses [0..i-1]

dp[i] = max(dp[i-1], nums[i] + dp[i-2])

Base cases:
dp[0] = nums[0]
dp[1] = max(nums[0], nums[1])
```

**State:** `dp[i]` = maximum money from first i+1 houses.

---

### Complexity Analysis

| Approach | Time | Space | Optimization |
|----------|------|-------|--------------|
| **DP array** | O(n) | O(n) | Clear state |
| **Optimized** | O(n) | O(1) | Rolling variables |

**Space optimization:** Only need `dp[i-1]` and `dp[i-2]`.

---

### Recurrence Visualization

```
nums = [2, 7, 9, 3, 1]

dp[0] = 2                    (rob house 0)
dp[1] = max(2, 7) = 7        (rob house 1 or 0)
dp[2] = max(7, 2+9) = 11     (skip 2 or rob 2 + dp[0])
dp[3] = max(11, 7+3) = 11    (skip 3 or rob 3 + dp[1])
dp[4] = max(11, 11+1) = 12   (skip 4 or rob 4 + dp[2])

Answer: 12 (houses 0, 2, 4)
```

<!-- back -->
