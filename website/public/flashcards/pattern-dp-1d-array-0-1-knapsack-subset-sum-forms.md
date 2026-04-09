---
type: flashcard
pattern: dp-1d-array-0-1-knapsack-subset-sum
category: forms
tags: [dp, knapsack, subset-sum, target-sum, count-subsets]
---

<!-- front -->
What are the common problem forms for 0/1 Knapsack / Subset Sum?

<!-- back -->
**Four Problem Forms:**

1. **Subset Sum (Boolean)** - "Can we achieve target?"
   ```python
   dp = [False] * (target + 1)
   dp[0] = True
   for num in nums:
       for i in range(target, num - 1, -1):
           dp[i] = dp[i] or dp[i - num]
   return dp[target]
   ```
   - Example: Partition Equal Subset Sum

2. **0/1 Knapsack (Maximization)** - "Max value within capacity"
   ```python
   dp = [0] * (capacity + 1)
   for i in range(len(values)):
       for w in range(capacity, weights[i] - 1, -1):
           dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
   return dp[capacity]
   ```

3. **Count Subsets** - "How many ways to achieve target?"
   ```python
   dp = [0] * (target + 1)
   dp[0] = 1
   for num in nums:
       for i in range(target, num - 1, -1):
           dp[i] += dp[i - num]
   return dp[target]
   ```
   - Example: Target Sum

4. **Minimize Difference** - "Minimize |sum1 - sum2|"
   - Transform: Find subset closest to `total // 2`
   - Example: Last Stone Weight II

**Related Problems:**
- LeetCode 416: Partition Equal Subset Sum
- LeetCode 494: Target Sum
- LeetCode 1049: Last Stone Weight II
- LeetCode 474: Ones and Zeroes
