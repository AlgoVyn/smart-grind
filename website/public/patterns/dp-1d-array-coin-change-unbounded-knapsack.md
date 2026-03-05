# DP - 1D Array (Coin Change / Unbounded Knapsack Style)

## Problem Description

The DP - 1D Array (Coin Change / Unbounded Knapsack Style) pattern solves problems where items can be selected unlimited times (unbounded property) to reach a target value. This pattern is essential for coin change problems, rod cutting, and unbounded knapsack variations where each item has infinite supply.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(amount × coins), where amount is target, coins is number of coin types |
| Space Complexity | O(amount), for the DP array |
| Input | Array of coin denominations/item values and a target amount |
| Output | Minimum coins, maximum ways, or boolean feasibility |
| Approach | Bottom-up with forward iteration to allow reuse |

### When to Use

- **Coin Change problems**: Find minimum coins to make an amount
- **Count combinations**: Number of ways to make change
- **Unbounded Knapsack**: Maximize value with unlimited item selection
- **Rod Cutting**: Maximize value when cutting rods
- **Integer Partition**: Ways to partition an integer
- **Problems with unlimited supply**: Each item can be used any number of times

## Intuition

The key difference from 0/1 knapsack is that we iterate forward, allowing us to reuse the same coin/item multiple times.

The "aha!" moments:

1. **Forward iteration**: Unlike 0/1 knapsack, we iterate forward to allow unlimited use of each coin
2. **Two loop orders**: For counting ways, coin-outer loop gives combinations; amount-outer loop gives permutations
3. **Initialization matters**: Use infinity for minimum problems, 0 for maximum, 1 for count base cases
4. **State transition**: dp[i] = min/max(dp[i], dp[i - coin] + value) or dp[i] += dp[i - coin]
5. **Unreachable states**: Check if dp[amount] is still infinity (no solution exists)

## Solution Approaches

### Approach 1: Minimum Coins ✅ Recommended

Find the minimum number of coins needed to make the target amount.

#### Algorithm

1. Initialize dp array of size (amount + 1) with infinity
2. Set dp[0] = 0 (base case: 0 coins for amount 0)
3. For each amount from 1 to target:
   - For each coin:
     - If coin ≤ amount: dp[amount] = min(dp[amount], dp[amount - coin] + 1)
4. Return dp[amount] if not infinity, else -1

#### Implementation

````carousel
```python
def coin_change_min_coins(coins, amount):
    """
    Find minimum coins needed to make amount.
    LeetCode 322 - Coin Change
    
    Time: O(amount * coins), Space: O(amount)
    """
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # Base case: 0 coins for amount 0
    
    # For each amount, try all coins
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1

# Alternative: Coin outer loop (also correct for minimum)
def coin_change_min_coins_v2(coins, amount):
    """Alternative with coin outer loop."""
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, INT_MAX);
        dp[0] = 0;
        
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i && dp[i - coin] != INT_MAX) {
                    dp[i] = min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        
        return dp[amount] == INT_MAX ? -1 : dp[amount];
    }
};
```
<!-- slide -->
```java
class Solution {
    public int coinChange(int[] coins, int amount) {
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;
        
        for (int i = 1; i <= amount; i++) {
            for (int coin : coins) {
                if (coin <= i && dp[i - coin] != Integer.MAX_VALUE) {
                    dp[i] = Math.min(dp[i], dp[i - coin] + 1);
                }
            }
        }
        
        return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];
    }
}
```
<!-- slide -->
```javascript
function coinChange(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    for (let i = 1; i <= amount; i++) {
        for (const coin of coins) {
            if (coin <= i) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(amount × coins) |
| Space | O(amount) |

### Approach 2: Number of Ways (Combinations)

Count the number of ways to make change (order of coins doesn't matter).

#### Algorithm

1. Initialize dp array of size (amount + 1) with 0
2. Set dp[0] = 1 (one way to make amount 0: use no coins)
3. For each coin:
   - For amount from coin to target:
     - dp[amount] += dp[amount - coin]
4. Return dp[amount]

#### Implementation

````carousel
```python
def coin_change_ways(coins, amount):
    """
    Count number of ways to make amount (combinations).
    LeetCode 518 - Coin Change II
    
    Coin outer loop ensures combinations (order doesn't matter).
    Time: O(amount * coins), Space: O(amount)
    """
    dp = [0] * (amount + 1)
    dp[0] = 1  # Base case: one way to make amount 0
    
    # Coin outer loop = combinations
    for coin in coins:
        for i in range(coin, amount + 1):
            dp[i] += dp[i - coin]
    
    return dp[amount]

# Note: If we want permutations (order matters), use amount outer loop
def coin_change_permutations(coins, amount):
    """Count permutations (order matters)."""
    dp = [0] * (amount + 1)
    dp[0] = 1
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] += dp[i - coin]
    
    return dp[amount]
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int change(int amount, vector<int>& coins) {
        vector<int> dp(amount + 1, 0);
        dp[0] = 1;
        
        // Coin outer loop = combinations
        for (int coin : coins) {
            for (int i = coin; i <= amount; i++) {
                dp[i] += dp[i - coin];
            }
        }
        
        return dp[amount];
    }
};
```
<!-- slide -->
```java
class Solution {
    public int change(int amount, int[] coins) {
        int[] dp = new int[amount + 1];
        dp[0] = 1;
        
        // Coin outer loop = combinations
        for (int coin : coins) {
            for (int i = coin; i <= amount; i++) {
                dp[i] += dp[i - coin];
            }
        }
        
        return dp[amount];
    }
}
```
<!-- slide -->
```javascript
function change(amount, coins) {
    const dp = new Array(amount + 1).fill(0);
    dp[0] = 1;
    
    // Coin outer loop = combinations
    for (const coin of coins) {
        for (let i = coin; i <= amount; i++) {
            dp[i] += dp[i - coin];
        }
    }
    
    return dp[amount];
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(amount × coins) |
| Space | O(amount) |

### Approach 3: Unbounded Knapsack (Maximization)

Maximize value with unlimited item selection.

#### Implementation

````carousel
```python
def unbounded_knapsack(values, weights, capacity):
    """
    Unbounded Knapsack: Maximize value with unlimited items.
    
    Time: O(n * capacity), Space: O(capacity)
    """
    dp = [0] * (capacity + 1)
    
    # Forward iteration allows reuse
    for w in range(1, capacity + 1):
        for i in range(len(values)):
            if weights[i] <= w:
                dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[capacity]

def rod_cutting(prices, n):
    """
    Rod Cutting: Maximize value when cutting rod of length n.
    prices[i] = value of piece of length i+1
    """
    dp = [0] * (n + 1)
    
    for length in range(1, n + 1):
        for cut_len in range(1, length + 1):
            if cut_len <= len(prices):
                dp[length] = max(dp[length], dp[length - cut_len] + prices[cut_len - 1])
    
    return dp[n]
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int unboundedKnapsack(vector<int>& values, vector<int>& weights, int capacity) {
        vector<int> dp(capacity + 1, 0);
        
        for (int w = 1; w <= capacity; w++) {
            for (int i = 0; i < values.size(); i++) {
                if (weights[i] <= w) {
                    dp[w] = max(dp[w], dp[w - weights[i]] + values[i]);
                }
            }
        }
        
        return dp[capacity];
    }
    
    int rodCutting(vector<int>& prices, int n) {
        vector<int> dp(n + 1, 0);
        
        for (int length = 1; length <= n; length++) {
            for (int cut = 1; cut <= length && cut <= prices.size(); cut++) {
                dp[length] = max(dp[length], dp[length - cut] + prices[cut - 1]);
            }
        }
        
        return dp[n];
    }
};
```
<!-- slide -->
```java
class Solution {
    public int unboundedKnapsack(int[] values, int[] weights, int capacity) {
        int[] dp = new int[capacity + 1];
        
        for (int w = 1; w <= capacity; w++) {
            for (int i = 0; i < values.length; i++) {
                if (weights[i] <= w) {
                    dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
                }
            }
        }
        
        return dp[capacity];
    }
    
    public int rodCutting(int[] prices, int n) {
        int[] dp = new int[n + 1];
        
        for (int length = 1; length <= n; length++) {
            for (int cut = 1; cut <= length && cut <= prices.length; cut++) {
                dp[length] = Math.max(dp[length], dp[length - cut] + prices[cut - 1]);
            }
        }
        
        return dp[n];
    }
}
```
<!-- slide -->
```javascript
function unboundedKnapsack(values, weights, capacity) {
    const dp = new Array(capacity + 1).fill(0);
    
    for (let w = 1; w <= capacity; w++) {
        for (let i = 0; i < values.length; i++) {
            if (weights[i] <= w) {
                dp[w] = Math.max(dp[w], dp[w - weights[i]] + values[i]);
            }
        }
    }
    
    return dp[capacity];
}

function rodCutting(prices, n) {
    const dp = new Array(n + 1).fill(0);
    
    for (let length = 1; length <= n; length++) {
        for (let cut = 1; cut <= length && cut <= prices.length; cut++) {
            dp[length] = Math.max(dp[length], dp[length - cut] + prices[cut - 1]);
        }
    }
    
    return dp[n];
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × capacity) |
| Space | O(capacity) |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Minimum Coins | O(amount × coins) | O(amount) | Find min coins for amount |
| Count Ways | O(amount × coins) | O(amount) | Count combinations/permutations |
| Unbounded Knapsack | O(n × capacity) | O(capacity) | Maximize value with unlimited items |
| 2D DP | O(amount × coins) | O(amount × coins) | When reconstruction needed |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Coin Change](https://leetcode.com/problems/coin-change/) | 322 | Medium | Minimum coins to make amount |
| [Coin Change II](https://leetcode.com/problems/coin-change-ii/) | 518 | Medium | Number of ways to make change |
| [Combination Sum IV](https://leetcode.com/problems/combination-sum-iv/) | 377 | Medium | Count permutation ways to make target |
| [Perfect Squares](https://leetcode.com/problems/perfect-squares/) | 279 | Medium | Min squares that sum to n |
| [Minimum Cost For Tickets](https://leetcode.com/problems/minimum-cost-for-tickets/) | 983 | Medium | Min cost for travel days |
| [2 Keys Keyboard](https://leetcode.com/problems/2-keys-keyboard/) | 650 | Medium | Min steps to get n 'A's |
| [Integer Break](https://leetcode.com/problems/integer-break/) | 343 | Medium | Max product by breaking integer |
| [Rod Cutting](https://www.geeksforgeeks.org/cutting-a-rod-dp-13/) | - | Medium | Max value from cutting rod |
| [Unbounded Knapsack](https://www.geeksforgeeks.org/unbounded-knapsack-repetition-items-allowed/) | - | Medium | Classic unbounded knapsack |

## Video Tutorial Links

1. **[NeetCode - Coin Change](https://www.youtube.com/watch?v=H9bfqozjoqs)** - Comprehensive DP explanation
2. **[Back To Back SWE - Unbounded Knapsack](https://www.youtube.com/watch?v=aycn9KO8_Ls)** - Pattern walkthrough
3. **[Kevin Naughton Jr. - Coin Change](https://www.youtube.com/watch?v=jgiZlGzXMBw)** - Step-by-step solution
4. **[Abdul Bari - Unbounded Knapsack](https://www.youtube.com/watch?v=8LusJS5-AGo)** - Detailed algorithm
5. **[Techdose - Coin Change Variations](https://www.youtube.com/watch?v=I-l6PBeERuc)** - All variations explained

## Summary

### Key Takeaways

- **Forward iteration for unbounded**: Unlike 0/1 knapsack, iterate forward to allow unlimited use
- **Loop order matters for counting**: Coin-outer = combinations; Amount-outer = permutations
- **Initialize appropriately**: Use infinity for min, 0 for max, 1 for count base cases
- **Check for unreachable**: Always verify if dp[amount] changed from initial value
- **Same complexity**: All variations have O(amount × n) time and O(amount) space

### Common Pitfalls

- **Using backward iteration**: Results in 0/1 knapsack behavior instead of unbounded
- **Wrong initialization**: Using 0 for minimum (should be infinity) or 0 for count (should be 1)
- **Not checking unreachable**: Forgetting to check if result is still infinity
- **Wrong loop order**: Getting permutations instead of combinations (or vice versa)
- **Integer overflow**: Ways counting can overflow; consider modulo or larger types
- **Not handling coin > amount**: Always check bounds before accessing dp[i - coin]

### Follow-up Questions

1. **What's the difference between combinations and permutations?**
   - Combinations: {1,2} same as {2,1}; use coin-outer loop
   - Permutations: {1,2} different from {2,1}; use amount-outer loop

2. **How to reconstruct the actual coins used?**
   - Track parent pointers or use backtracking with the DP table

3. **Can you optimize space further?**
   - No, O(amount) is optimal for 1D approach

4. **What if coins can be used at most k times?**
   - Convert to bounded knapsack or add a dimension for count

## Pattern Source

[Coin Change Unbounded Knapsack Pattern](patterns/dp-1d-array-coin-change-unbounded-knapsack.md)
