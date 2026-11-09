What is the general framework for solving 0/1 Knapsack / Subset Sum problems using 1D DP?

<!-- front -->

The 5-step framework:

1. **Define the target/capacity**: Identify what you're trying to achieve (sum, value, or capacity constraint)

2. **Initialize 1D DP array**: `dp[target + 1]` with appropriate base values:
   - Boolean: `False` (with `dp[0] = True`)
   - Integer: `0` (with `dp[0] = 0`)
   - Count: `0` (with `dp[0] = 1`)

3. **Process each item once**: Iterate through all items (numbers, weights, values)

4. **Backward iteration**: For each item, iterate from `target` down to `item_value`:
   - This prevents reusing the same item multiple times
   - Key insight: `for i in range(target, num - 1, -1)`

5. **Apply transition**: Update dp based on problem type:
   - Subset Sum: `dp[i] = dp[i] OR dp[i - num]`
   - Knapsack: `dp[i] = max(dp[i], dp[i - weight] + value)`
   - Count: `dp[i] += dp[i - num]`

6. **Return result**: `dp[target]` contains the answer

<!-- back -->
