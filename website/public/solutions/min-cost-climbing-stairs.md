# Min Cost Climbing Stairs

## Problem Description

You are given an integer array `cost` where `cost[i]` is the cost of the `i-th` step on a staircase. Once you pay the cost, you can climb **one or two steps**.

You can start from either step `0` or step `1`. Return the **minimum cost** to reach the top of the floor (beyond the last step).

---

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `cost = [10,15,20]` | `15` |

**Explanation:** Start at index 1, pay 15, and climb two steps to reach the top. Total cost: 15.

**Example 2:**

| Input | Output |
|-------|--------|
| `cost = [1,100,1,1,1,100,1,1,100,1]` | `6` |

**Step-by-step:**
1. Pay 1 (index 0), climb 2 steps to index 2
2. Pay 1 (index 2), climb 2 steps to index 4
3. Pay 1 (index 4), climb 2 steps to index 6
4. Pay 1 (index 6), climb 1 step to index 7
5. Pay 1 (index 7), climb 2 steps to index 9
6. Pay 1 (index 9), climb 1 step to top

Total cost: 6

---

## Constraints

- `2 <= cost.length <= 1000`
- `0 <= cost[i] <= 999`

---

## Solution

```python
from typing import List

class Solution:
    def minCostClimbingStairs(self, cost: List[int]) -> int:
        n = len(cost)
        if n == 2:
            return min(cost[0], cost[1])
        
        # Use two variables to track last two DP values (space-optimized)
        prev2 = cost[0]  # dp[i-2]
        prev1 = cost[1]  # dp[i-1]
        
        for i in range(2, n):
            curr = cost[i] + min(prev1, prev2)
            prev2 = prev1
            prev1 = curr
        
        # Minimum cost to reach top is min of last two positions
        return min(prev1, prev2)
```

---

## Explanation

This is a classic dynamic programming problem. Let `dp[i]` be the minimum cost to reach step `i`.

1. **Base cases**:
   - `dp[0] = cost[0]` — cost to reach step 0
   - `dp[1] = cost[1]` — cost to reach step 1

2. **Recurrence relation**:
   - `dp[i] = cost[i] + min(dp[i-1], dp[i-2])` — pay cost[i] and come from either step `i-1` or `i-2`

3. **Answer**: `min(dp[n-1], dp[n-2])` — can reach top from either last or second-to-last step

4. **Space optimization**: We only need the last two values, reducing space from `O(n)` to `O(1)`.

---

## Complexity Analysis

| Metric | Complexity |
|--------|------------|
| Time | `O(n)` — single pass through the array |
| Space | `O(1)` — constant extra space |
