---
type: flashcard
pattern: dp-1d-array-0-1-knapsack-subset-sum
category: tactics
tags: [dp, knapsack, target-sum, math-trick, partition]
---

<!-- front -->
What tactical tricks are essential for 0/1 Knapsack problems?

<!-- back --
**Four Essential Tactics:**

1. **Target Sum Math Transformation**
   - Problem: Assign `+` or `-` to numbers to reach target
   - Transform: Find subset with sum `P = (target + total) / 2`
   - Derivation: `P - N = target` and `P + N = total` → `2P = target + total`
   - Check: `abs(target) <= total` and `(target + total) % 2 == 0`

2. **Partition Equal Subset Pattern**
   - Check if array can be split into two equal-sum subsets
   - Step 1: If `total % 2 != 0` → impossible
   - Step 2: Run subset sum with `target = total // 2`

3. **Loop Boundary Safety**
   - Always iterate from `target` down to `num` (inclusive)
   - Python: `range(target, num - 1, -1)`
   - Stopping at `num - 1` ensures `i - num >= 0`

4. **Edge Case Pre-checks**
   - For subset sum: early exit if `target > sum(nums)`
   - For target sum: check parity and bounds before DP
   - For partition: check if total is even first

**Complexity:** O(n × target) time, O(target) space
