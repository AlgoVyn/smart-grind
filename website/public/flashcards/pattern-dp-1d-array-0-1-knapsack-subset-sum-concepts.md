---
type: flashcard
pattern: dp-1d-array-0-1-knapsack-subset-sum
category: concepts
tags: [dp, knapsack, subset-sum, backward-iteration, state-representation]
---

<!-- front -->
What are the key concepts in 0/1 Knapsack 1D DP?

<!-- back -->
**Five Core Concepts:**

1. **Backward Iteration Principle**
   - Why backward? Prevents using the same item multiple times
   - Forward iteration → unbounded knapsack (unlimited use)
   - Backward iteration → 0/1 knapsack (use once)

2. **State Representation**
   - `dp[i]` = whether sum `i` is achievable (boolean)
   - `dp[i]` = max value for capacity `i` (integer)
   - `dp[i]` = number of ways to achieve sum `i` (count)

3. **State Transitions**
   - **Subset Sum**: `dp[i] = dp[i] OR dp[i - num]`
   - **Knapsack**: `dp[i] = max(dp[i], dp[i - weight] + value)`
   - **Count**: `dp[i] += dp[i - num]`

4. **Base Case Importance**
   - `dp[0] = True` → empty subset sums to 0
   - `dp[0] = 0` → zero capacity = zero value
   - `dp[0] = 1` → one way to make sum 0

5. **Space Optimization Insight**
   - 1D array is sufficient because each state only depends on previous (smaller) states
   - We don't need the full 2D table for most problems
