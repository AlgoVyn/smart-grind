## House Robber: Comparison with Alternatives

How does the House Robber DP compare to other approaches?

<!-- front -->

---

### DP vs Greedy vs Backtracking

| Approach | Time | Space | Correctness | When to Use |
|----------|------|-------|-------------|-------------|
| **DP (O(n) space)** | O(n) | O(n) | ✓ Optimal | Clear state tracking |
| **DP (O(1) space)** | O(n) | O(1) | ✓ Optimal | **Production choice** |
| **Greedy** | O(n) | O(1) | ✗ Fails | Never for this problem |
| **Backtracking** | O(2ⁿ) | O(n) | ✓ Optimal | Never, too slow |
| **Memoization** | O(n) | O(n) | ✓ Optimal | Tree recursion |

```python
# Greedy (WRONG - doesn't work)
def rob_greedy(nums):
    """Greedy: always take larger of adjacent pairs"""
    result = 0
    i = 0
    while i < len(nums):
        if i + 1 < len(nums) and nums[i+1] > nums[i]:
            result += nums[i+1]
            i += 2
        else:
            result += nums[i]
            i += 1
    return result

# Counterexample: [2, 1, 1, 2]
# Greedy: takes 2, then 2 = 4
# Optimal: takes 2 + 2 = 4 (works here, but not always)
# [2, 3, 2]: Greedy takes 3, optimal takes 2+2=4
```

---

### Space Optimized vs Full DP Array

```python
# Full array: clear, debuggable
def rob_full_array(nums):
    if not nums:
        return 0
    n = len(nums)
    dp = [0] * n
    dp[0] = nums[0]
    
    for i in range(1, n):
        take = nums[i] + (dp[i-2] if i >= 2 else 0)
        skip = dp[i-1]
        dp[i] = max(take, skip)
    
    return dp[-1]

# O(1) space: optimal for production
def rob_optimized(nums):
    prev2, prev1 = 0, 0
    for num in nums:
        prev2, prev1 = prev1, max(prev1, num + prev2)
    return prev1

# Trace comparison:
# Full: dp = [2, 7, 11, 11, 12] - can debug each step
# Opt: variables = 2, 7, 11, 11, 12 - same, less memory
```

---

### Recursive vs Iterative DP

| Aspect | Recursive (Memo) | Iterative |
|--------|----------------|-----------|
| **Code clarity** | Matches recurrence | Linear scan |
| **Stack depth** | O(n) | O(1) |
| **Speed** | Similar | Slightly faster |
| **Tree structure** | Natural | Requires explicit stack |

```python
# Recursive with memo (for House Robber III - tree)
def rob_tree_recursive(root, memo={}):
    if not root:
        return 0
    if root in memo:
        return memo[root]
    
    # Include root
    val_with_root = root.val
    if root.left:
        val_with_root += rob_tree_recursive(root.left.left, memo)
        val_with_root += rob_tree_recursive(root.left.right, memo)
    if root.right:
        val_with_root += rob_tree_recursive(root.right.left, memo)
        val_with_root += rob_tree_recursive(root.right.right, memo)
    
    # Exclude root
    val_without_root = rob_tree_recursive(root.left, memo) + \
                      rob_tree_recursive(root.right, memo)
    
    memo[root] = max(val_with_root, val_without_root)
    return memo[root]

# Iterative (requires post-order traversal)
def rob_tree_iterative(root):
    # Use stack for post-order
    # Then process nodes bottom-up
    pass
```

---

### Pattern: When to Use House Robber DP

| Similar Problem | Pattern | Modification |
|-----------------|---------|--------------|
| **Maximum sum non-adjacent** | Same | None |
| **Paint house with colors** | Add color dimension | dp[i][color] |
| **Stock with cooldown** | Similar state machine | 3 states |
| **Delete and earn** | Sort + adjacent constraint | Frequency first |
| **Maximum alternating sum** | Add sign tracking | 2 states |

```python
# Paint House variation
def min_cost_paint_houses(costs):
    """
    costs[i][j] = cost to paint house i with color j
    Adjacent houses different colors
    """
    if not costs:
        return 0
    
    n = len(costs)
    # dp[j] = min cost ending with color j
    dp = costs[0][:]
    
    for i in range(1, n):
        new_dp = [0] * 3
        for j in range(3):
            # Choose color j for house i
            # Previous house must be different color
            prev_min = min(dp[k] for k in range(3) if k != j)
            new_dp[j] = costs[i][j] + prev_min
        dp = new_dp
    
    return min(dp)
```

<!-- back -->
