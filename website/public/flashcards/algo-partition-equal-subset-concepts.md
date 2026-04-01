## Partition Equal Subset: Core Concepts

What are the fundamental principles of the partition equal subset sum problem?

<!-- front -->

---

### Core Concept

Given array of positive integers, determine if it can be partitioned into two subsets with equal sums.

**Key Insight**: This is equivalent to finding a subset with sum = total_sum / 2.

---

### Mathematical Formulation

| Requirement | Condition |
|-------------|-----------|
| Possible to partition | total_sum must be **even** |
| Target subset sum | target = total_sum / 2 |
| Decision problem | Is there subset with sum = target? |

---

### Connection to Knapsack

This is a 0/1 Knapsack variant:
- Capacity = target
- Items = array elements (weight = value = nums[i])
- Goal: Fill knapsack exactly to capacity

---

### DP State Definition

```
dp[i][s] = True if we can achieve sum s using first i elements

Recurrence:
dp[i][s] = dp[i-1][s] OR dp[i-1][s - nums[i]]
          (don't take)    (take nums[i])
```

**Space optimization**: 1D array since we only need previous row.

---

### Visual: DP Table

```
nums = [1, 5, 11, 5], total = 22, target = 11

      0  1  2  3  4  5  6  7  8  9  10 11
     ------------------------------------
∅  |  T  F  F  F  F  F  F  F  F  F  F  F
1  |  T  T  F  F  F  F  F  F  F  F  F  F
5  |  T  T  F  F  F  T  T  F  F  F  F  F
11 |  T  T  F  F  F  T  T  F  F  F  F  T
5  |  T  T  F  F  F  T  T  F  F  F  T  T

Result: dp[4][11] = True → can partition!
Subset 1: [1, 5, 5] = 11
Subset 2: [11] = 11
```

<!-- back -->
