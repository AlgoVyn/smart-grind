# Coin Change

## Category
Dynamic Programming

## Description
Find minimum number of coins to make a target amount.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- dynamic programming related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Steps
1. Understand the problem constraints and requirements
2. Identify the input and expected output
3. Apply the core algorithm logic
4. Handle edge cases appropriately
5. Optimize for the given constraints

---

## Algorithm Explanation

The Coin Change problem is a classic dynamic programming problem that models an unbounded knapsack. Given a set of coin denominations and a target amount, we need to find the minimum number of coins needed to make up that amount.

**Key Insight:** This is an unbounded knapsack problem because we can use each coin unlimited times.

**Approach:**
1. Create a DP array where `dp[i]` represents the minimum coins needed to make amount `i`
2. Initialize `dp[0] = 0` (0 coins needed for amount 0)
3. For each amount from 1 to target, try each coin and take the minimum
4. Use `float('inf')` to represent impossible combinations

**State Transition:**
```
dp[amount] = min(dp[amount], dp[amount - coin] + 1)
```

This checks if using the current coin results in fewer coins than the current best solution.

**Time Complexity:** O(amount × number of coins)
**Space Complexity:** O(amount)

This problem has many variations including finding all possible combinations, maximizing value, or determining if it's possible at all.

---

## Implementation

```python
def coin_change(coins, amount):
    """
    Find minimum number of coins needed to make up the amount.
    
    Args:
        coins: List of coin denominations
        amount: Target amount
        
    Returns:
        Minimum number of coins, or -1 if impossible
        
    Time: O(amount * len(coins))
    Space: O(amount)
    """
    if amount == 0:
        return 0
    
    # dp[i] = minimum coins needed to make amount i
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    # Build up solution for each amount
    for current_amount in range(1, amount + 1):
        for coin in coins:
            if coin <= current_amount:
                # Use this coin and add remaining from previous state
                dp[current_amount] = min(
                    dp[current_amount],
                    dp[current_amount - coin] + 1
                )
    
    return dp[amount] if dp[amount] != float('inf') else -1


# Alternative: Return the actual coins used
def coin_change_with_coins(coins, amount):
    """Return both minimum coins and the coin combination."""
    if amount == 0:
        return 0, []
    
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    # Track which coin was used
    parent = [-1] * (amount + 1)
    
    for current_amount in range(1, amount + 1):
        for coin in coins:
            if coin <= current_amount and dp[current_amount - coin] + 1 < dp[current_amount]:
                dp[current_amount] = dp[current_amount - coin] + 1
                parent[current_amount] = coin
    
    if dp[amount] == float('inf'):
        return -1, []
    
    # Reconstruct the coins used
    result_coins = []
    current = amount
    while current > 0:
        result_coins.append(parent[current])
        current -= parent[current]
    
    return dp[amount], result_coins


# Alternative: Recursive with memoization
from functools import lru_cache

def coin_change_memo(coins, amount):
    """Recursive solution with memoization."""
    @lru_cache(maxsize=None)
    def helper(remain):
        if remain == 0:
            return 0
        if remain < 0:
            return float('inf')
        
        min_coins = float('inf')
        for coin in coins:
            result = helper(remain - coin)
            if result != float('inf'):
                min_coins = min(min_coins, result + 1)
        
        return min_coins
    
    result = helper(amount)
    return result if result != float('inf') else -1
```

```javascript
function coinChange() {
    // Coin Change implementation
    // Time: O(n * amount)
    // Space: O(amount)
}
```

---

## Example

**Input:**
```
coins = [1, 2, 5]
amount = 11
```

**Output:**
```
3
```

**Explanation:**
The minimum number of coins needed is 3:
- 11 = 5 + 5 + 1 (3 coins)

Other combinations that work:
- 11 = 5 + 2 + 2 + 2 (4 coins)
- 11 = 2 + 2 + 2 + 2 + 2 + 1 (6 coins)
- 11 = 1 × 11 (11 coins)

**Additional Example:**
```
Input: coins = [2], amount = 3
Output: -1 (impossible)
```

---

## Time Complexity
**O(n * amount)**

---

## Space Complexity
**O(amount)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
