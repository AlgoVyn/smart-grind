# Coin Change

## Category
Dynamic Programming

## Description

The Coin Change problem is a classic **dynamic programming** problem that models an **unbounded knapsack**. Given a set of coin denominations and a target amount, we need to find the minimum number of coins needed to make up that amount. This problem appears frequently in financial applications, optimization problems, and as a fundamental DP pattern in technical interviews.

---

## When to Use

Use the Coin Change algorithm when you need to solve problems involving:

- **Unbounded Knapsack**: When you can use each item unlimited times
- **Optimization Problems**: Finding minimum/maximum ways to achieve a target
- **Counting Problems**: Counting the number of ways to make change
- **Reachability Problems**: Determining if a target is achievable

### Comparison with Alternatives

| Approach | Use Case | Time Complexity | Space Complexity |
|----------|----------|-----------------|------------------|
| **Greedy** | Works only for canonical coin systems | O(n log n) | O(1) |
| **Dynamic Programming (Bottom-up)** | Most general solution | O(amount × n) | O(amount) |
| **Dynamic Programming (Top-down)** | Recursive with memoization | O(amount × n) | O(amount) |
| **BFS** | Finding minimum steps | O(amount × n) | O(amount) |

### When to Choose Each Approach

- **Choose DP (Bottom-up)** when:
  - You need guaranteed optimal solution
  - The coin system is not canonical
  - You need to handle edge cases properly
  - Memory is not a constraint

- **Choose DP (Top-down/Memoization)** when:
  - You prefer recursive solutions
  - You want to visualize the problem as a tree
  - You want to easily reconstruct the solution

- **Choose BFS** when:
  - You need the minimum number of coins
  - You want to visualize as level-by-level exploration

- **Greedy may work** when:
  - Coin system is canonical (e.g., US coins: 1, 5, 10, 25)
  - You need the fastest solution
  - You can prove greedy works for your coin system

---

## Algorithm Explanation

### Core Concept

The key insight behind the Coin Change problem is that we can break down the problem into **subproblems**. If we know the minimum coins needed for all amounts less than our target, we can build up to the target amount.

**Why DP Works:**
1. **Optimal Substructure**: The minimum coins for amount `i` depends on minimum coins for amounts `i - coin` for each coin
2. **Overlapping Subproblems**: The same subproblems (amounts) are computed multiple times without memoization

### How It Works

#### State Definition:
- `dp[amount]` = minimum number of coins needed to make exactly `amount`

#### Initialization:
- `dp[0] = 0` — Zero coins needed to make amount 0
- `dp[i] = infinity` for all other amounts (unreachable state)

#### State Transition:
```
For each amount from 1 to target:
    For each coin:
        If coin <= amount:
            dp[amount] = min(dp[amount], dp[amount - coin] + 1)
```

This checks if using the current coin results in fewer coins than the current best solution.

### Visual Representation

For `coins = [1, 2, 5]` and `amount = 11`:

```
dp[0] = 0
dp[1] = 1 (using coin 1)
dp[2] = 1 (using coin 2)
dp[3] = 2 (1+2 or 1+1+1)
dp[4] = 2 (2+2)
dp[5] = 1 (using coin 5)
dp[6] = 2 (5+1)
dp[7] = 3 (5+2)
dp[8] = 3 (5+2+1)
dp[9] = 4 (5+2+2)
dp[10] = 2 (5+5)
dp[11] = 3 (5+5+1)
```

### Why This Works

Think of it as building a graph:
- Each amount `i` is a node
- From amount `i`, you can reach `i + coin` using one coin
- We want the shortest path from 0 to target amount

### Limitations

- **Not all coin systems work with greedy**: [1, 3, 4] with amount 6 — greedy gives 4+1+1=3 coins, but optimal is 3+3=2 coins
- **Large amounts can overflow memory**: Consider space-optimized solutions
- **Integer overflow**: Use appropriate data types for very large answers

---

## Algorithm Steps

### Step-by-Step Approach

1. **Understand the Problem**
   - Identify if it's minimum coins, maximum value, or counting combinations
   - Check if order matters (different from combination sum)
   - Identify if coins can be reused (unbounded)

2. **Choose the DP Approach**
   - Bottom-up: Iterative, usually more space-efficient
   - Top-down: Recursive with memoization, easier to visualize

3. **Define the State**
   - For minimum coins: `dp[i]` = minimum coins to make amount `i`
   - For counting: `dp[i]` = number of ways to make amount `i`
   - For combinations: `dp[i][j]` = ways using first `j` coins

4. **Initialize Properly**
   - Base case: `dp[0] = 0` (for min) or `dp[0] = 1` (for counting)
   - Use infinity for impossible states

5. **Build the Solution**
   - Iterate through all amounts
   - For each amount, try all coins
   - Apply the state transition formula

6. **Handle Edge Cases**
   - Amount = 0: Return 0
   - No valid coins: Return -1
   - Impossible amount: Return -1 or infinity

7. **Reconstruct Solution (if needed)**
   - Track parent pointers
   - Backtrack from target to find the coins used

---

## Implementation

### Template Code (Minimum Coins)

````carousel
```python
def coin_change(coins: list[int], amount: int) -> int:
    """
    Find minimum number of coins needed to make up the amount.
    
    Args:
        coins: List of coin denominations (positive integers)
        amount: Target amount (non-negative)
        
    Returns:
        Minimum number of coins, or -1 if impossible
        
    Time: O(amount * len(coins))
    Space: O(amount)
    """
    if amount == 0:
        return 0
    
    if not coins or amount < 0:
        return -1
    
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


def coin_change_with_coins(coins: list[int], amount: int) -> tuple[int, list[int]]:
    """
    Return both minimum coins and the coin combination used.
    
    Returns:
        Tuple of (minimum_coins, list_of_coins_used)
    """
    if amount == 0:
        return 0, []
    
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    # Track which coin was used to reach each amount
    parent = [-1] * (amount + 1)
    
    for current_amount in range(1, amount + 1):
        for coin in coins:
            if coin <= current_amount:
                if dp[current_amount - coin] + 1 < dp[current_amount]:
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


# Recursive with memoization
from functools import lru_cache

def coin_change_memo(coins: list[int], amount: int) -> int:
    """
    Recursive solution with memoization.
    
    Time: O(amount * len(coins))
    Space: O(amount)
    """
    @lru_cache(maxsize=None)
    def helper(remain: int) -> int:
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


# Example usage
if __name__ == "__main__":
    coins = [1, 2, 5]
    amount = 11
    
    result = coin_change(coins, amount)
    print(f"Minimum coins: {result}")  # Output: 3
    
    min_coins, coins_used = coin_change_with_coins(coins, amount)
    print(f"Coins used: {coins_used}")  # Output: [5, 5, 1]
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

/**
 * Coin Change - Find minimum number of coins needed.
 * 
 * Time: O(amount * n) where n = number of coins
 * Space: O(amount)
 */
int coinChange(vector<int>& coins, int amount) {
    if (amount == 0) return 0;
    if (coins.empty()) return -1;
    
    // dp[i] = minimum coins needed to make amount i
    vector<int> dp(amount + 1, INT_MAX);
    dp[0] = 0;
    
    // Build up solution for each amount
    for (int currentAmount = 1; currentAmount <= amount; currentAmount++) {
        for (int coin : coins) {
            if (coin <= currentAmount && dp[currentAmount - coin] != INT_MAX) {
                dp[currentAmount] = min(dp[currentAmount], 
                                        dp[currentAmount - coin] + 1);
            }
        }
    }
    
    return dp[amount] == INT_MAX ? -1 : dp[amount];
}

/**
 * Coin Change with reconstruction - return actual coins used.
 */
pair<int, vector<int>> coinChangeWithCoins(vector<int>& coins, int amount) {
    if (amount == 0) return {0, {}};
    if (coins.empty()) return {-1, {}};
    
    vector<int> dp(amount + 1, INT_MAX);
    dp[0] = 0;
    
    // Track which coin was used
    vector<int> parent(amount + 1, -1);
    vector<int> parentCoin(amount + 1, -1);
    
    for (int currentAmount = 1; currentAmount <= amount; currentAmount++) {
        for (int coin : coins) {
            if (coin <= currentAmount && dp[currentAmount - coin] != INT_MAX) {
                if (dp[currentAmount - coin] + 1 < dp[currentAmount]) {
                    dp[currentAmount] = dp[currentAmount - coin] + 1;
                    parent[currentAmount] = currentAmount - coin;
                    parentCoin[currentAmount] = coin;
                }
            }
        }
    }
    
    if (dp[amount] == INT_MAX) return {-1, {}};
    
    // Reconstruct coins
    vector<int> resultCoins;
    int current = amount;
    while (current > 0) {
        resultCoins.push_back(parentCoin[current]);
        current = parent[current];
    }
    
    return {dp[amount], resultCoins};
}

/**
 * Recursive with memoization.
 */
class CoinChangeMemo {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> memo(amount + 1, -1);
        return helper(coins, amount, memo);
    }
    
private:
    int helper(vector<int>& coins, int remain, vector<int>& memo) {
        if (remain == 0) return 0;
        if (remain < 0) return INT_MAX;
        if (memo[remain] != -1) return memo[remain];
        
        int minCoins = INT_MAX;
        for (int coin : coins) {
            int result = helper(coins, remain - coin, memo);
            if (result != INT_MAX) {
                minCoins = min(minCoins, result + 1);
            }
        }
        
        memo[remain] = minCoins;
        return minCoins;
    }
};

int main() {
    vector<int> coins = {1, 2, 5};
    int amount = 11;
    
    cout << "Coins: [1, 2, 5], Amount: 11" << endl;
    cout << "Minimum coins: " << coinChange(coins, amount) << endl;
    
    auto [minCoins, coinsUsed] = coinChangeWithCoins(coins, amount);
    cout << "Coins used: ";
    for (int coin : coinsUsed) cout << coin << " ";
    cout << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.Arrays;

/**
 * Coin Change - Find minimum number of coins needed.
 * 
 * Time: O(amount * n) where n = number of coins
 * Space: O(amount)
 */
public class CoinChange {
    
    /**
     * Find minimum number of coins needed.
     */
    public static int coinChange(int[] coins, int amount) {
        if (amount == 0) return 0;
        if (coins == null || coins.length == 0) return -1;
        
        // dp[i] = minimum coins needed to make amount i
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;
        
        // Build up solution for each amount
        for (int currentAmount = 1; currentAmount <= amount; currentAmount++) {
            for (int coin : coins) {
                if (coin <= currentAmount && dp[currentAmount - coin] != Integer.MAX_VALUE) {
                    dp[currentAmount] = Math.min(dp[currentAmount], 
                                                 dp[currentAmount - coin] + 1);
                }
            }
        }
        
        return dp[amount] == Integer.MAX_VALUE ? -1 : dp[amount];
    }
    
    /**
     * Return both minimum coins and the coins used.
     */
    public static int[] coinChangeWithCoins(int[] coins, int amount) {
        if (amount == 0) return new int[]{0};
        if (coins == null || coins.length == 0) return new int[]{-1};
        
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, Integer.MAX_VALUE);
        dp[0] = 0;
        
        // Track parent for reconstruction
        int[] parent = new int[amount + 1];
        Arrays.fill(parent, -1);
        int[] parentCoin = new int[amount + 1];
        
        for (int currentAmount = 1; currentAmount <= amount; currentAmount++) {
            for (int coin : coins) {
                if (coin <= currentAmount && dp[currentAmount - coin] != Integer.MAX_VALUE) {
                    if (dp[currentAmount - coin] + 1 < dp[currentAmount]) {
                        dp[currentAmount] = dp[currentAmount - coin] + 1;
                        parent[currentAmount] = currentAmount - coin;
                        parentCoin[currentAmount] = coin;
                    }
                }
            }
        }
        
        if (dp[amount] == Integer.MAX_VALUE) return new int[]{-1};
        
        // Reconstruct coins
        int[] result = new int[dp[amount]];
        int idx = 0;
        int current = amount;
        while (current > 0) {
            result[idx++] = parentCoin[current];
            current = parent[current];
        }
        
        return result;
    }
    
    /**
     * Recursive with memoization.
     */
    public static int coinChangeMemo(int[] coins, int amount) {
        int[] memo = new int[amount + 1];
        Arrays.fill(memo, -1);
        return helper(coins, amount, memo);
    }
    
    private static int helper(int[] coins, int remain, int[] memo) {
        if (remain == 0) return 0;
        if (remain < 0) return Integer.MAX_VALUE;
        if (memo[remain] != -1) return memo[remain];
        
        int minCoins = Integer.MAX_VALUE;
        for (int coin : coins) {
            int result = helper(coins, remain - coin, memo);
            if (result != Integer.MAX_VALUE) {
                minCoins = Math.min(minCoins, result + 1);
            }
        }
        
        memo[remain] = minCoins;
        return minCoins;
    }
    
    public static void main(String[] args) {
        int[] coins = {1, 2, 5};
        int amount = 11;
        
        System.out.println("Coins: [1, 2, 5], Amount: 11");
        System.out.println("Minimum coins: " + coinChange(coins, amount));
        
        int[] coinsUsed = coinChangeWithCoins(coins, amount);
        System.out.print("Coins used: ");
        for (int coin : coinsUsed) System.out.print(coin + " ");
        System.out.println();
    }
}
```

<!-- slide -->
```javascript
/**
 * Coin Change - Find minimum number of coins needed.
 * 
 * Time: O(amount * n) where n = number of coins
 * Space: O(amount)
 */

/**
 * Find minimum number of coins needed to make up the amount.
 * @param {number[]} coins - Array of coin denominations
 * @param {number} amount - Target amount
 * @returns {number} Minimum number of coins, or -1 if impossible
 */
function coinChange(coins, amount) {
    if (amount === 0) return 0;
    if (!coins || coins.length === 0) return -1;
    
    // dp[i] = minimum coins needed to make amount i
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    // Build up solution for each amount
    for (let currentAmount = 1; currentAmount <= amount; currentAmount++) {
        for (const coin of coins) {
            if (coin <= currentAmount) {
                dp[currentAmount] = Math.min(
                    dp[currentAmount],
                    dp[currentAmount - coin] + 1
                );
            }
        }
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
}

/**
 * Return both minimum coins and the coins used.
 * @returns {Object} { minCoins, coinsUsed }
 */
function coinChangeWithCoins(coins, amount) {
    if (amount === 0) return { minCoins: 0, coinsUsed: [] };
    if (!coins || coins.length === 0) return { minCoins: -1, coinsUsed: [] };
    
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    // Track which coin was used
    const parent = new Array(amount + 1).fill(-1);
    const parentCoin = new Array(amount + 1).fill(-1);
    
    for (let currentAmount = 1; currentAmount <= amount; currentAmount++) {
        for (const coin of coins) {
            if (coin <= currentAmount && dp[currentAmount - coin] + 1 < dp[currentAmount]) {
                dp[currentAmount] = dp[currentAmount - coin] + 1;
                parent[currentAmount] = currentAmount - coin;
                parentCoin[currentAmount] = coin;
            }
        }
    }
    
    if (dp[amount] === Infinity) {
        return { minCoins: -1, coinsUsed: [] };
    }
    
    // Reconstruct coins used
    const coinsUsed = [];
    let current = amount;
    while (current > 0) {
        coinsUsed.push(parentCoin[current]);
        current = parent[current];
    }
    
    return { minCoins: dp[amount], coinsUsed };
}

/**
 * Recursive with memoization.
 */
function coinChangeMemo(coins, amount) {
    const memo = new Map();
    
    function helper(remain) {
        if (remain === 0) return 0;
        if (remain < 0) return Infinity;
        if (memo.has(remain)) return memo.get(remain);
        
        let minCoins = Infinity;
        for (const coin of coins) {
            const result = helper(remain - coin);
            if (result !== Infinity) {
                minCoins = Math.min(minCoins, result + 1);
            }
        }
        
        memo.set(remain, minCoins);
        return minCoins;
    }
    
    const result = helper(amount);
    return result === Infinity ? -1 : result;
}

// Example usage
const coins = [1, 2, 5];
const amount = 11;

console.log(`Coins: [${coins.join(', ')}], Amount: ${amount}`);
console.log(`Minimum coins: ${coinChange(coins, amount)}`);

const { minCoins, coinsUsed } = coinChangeWithCoins(coins, amount);
console.log(`Coins used: [${coinsUsed.join(', ')}]`);
```
````

---

## Example

### Example 1: Basic Case

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

### Example 2: Impossible Case

**Input:**
```
coins = [2]
amount = 3
```

**Output:**
```
-1
```

**Explanation:**
With only coin denomination 2, we can only make even amounts (0, 2, 4, 6, ...). Amount 3 is impossible.

### Example 3: Zero Amount

**Input:**
```
coins = [1, 2, 5]
amount = 0
```

**Output:**
```
0
```

**Explanation:**
Zero coins are needed to make amount 0.

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Bottom-up DP** | O(amount × n) | Iterate through all amounts and all coins |
| **Top-down DP (Memoization)** | O(amount × n) | Each state computed once |
| **Greedy (if applicable)** | O(n log n) | Sorting + single pass |
| **BFS** | O(amount × n) | Level-by-level exploration |

### Detailed Breakdown

- **Bottom-up DP**:
  - Outer loop: `amount` iterations
  - Inner loop: `n` (number of coins) iterations
  - Total: O(amount × n)

- **Space Complexity**:
  - DP array: O(amount)
  - Parent tracking (for reconstruction): O(amount)
  - Total: O(amount)

---

## Space Complexity Analysis

| Approach | Space Complexity | Notes |
|----------|-----------------|-------|
| **Bottom-up DP** | O(amount) | Single 1D array |
| **Top-down DP** | O(amount) | Recursion stack + memo table |
| **With reconstruction** | O(amount) | Additional parent array |
| **Optimized** | O(n) | Only store last row |

### Space Optimization

For very large amounts, consider:
1. **Single row DP**: Use only O(n) space by iterating coins first
2. **Bitset approach**: Use bitset for boolean reachability
3. **In-place modification**: Modify input if allowed

---

## Common Variations

### 1. Coin Change II - Counting Combinations

Count the number of ways to make amount using unlimited coins.

````carousel
```python
def coin_change_count(coins: list[int], amount: int) -> int:
    """
    Count number of combinations that make up the amount.
    
    Order does NOT matter (unlike permutations).
    """
    dp = [0] * (amount + 1)
    dp[0] = 1
    
    for coin in coins:
        for current_amount in range(coin, amount + 1):
            dp[current_amount] += dp[current_amount - coin]
    
    return dp[amount]
```

<!-- slide -->
```cpp
int coinChangeCount(vector<int>& coins, int amount) {
    vector<int> dp(amount + 1, 0);
    dp[0] = 1;
    
    for (int coin : coins) {
        for (int currentAmount = coin; currentAmount <= amount; currentAmount++) {
            dp[currentAmount] += dp[currentAmount - coin];
        }
    }
    
    return dp[amount];
}
```

<!-- slide -->
```java
public static int coinChangeCount(int[] coins, int amount) {
    int[] dp = new int[amount + 1];
    dp[0] = 1;
    
    for (int coin : coins) {
        for (int currentAmount = coin; currentAmount <= amount; currentAmount++) {
            dp[currentAmount] += dp[currentAmount - coin];
        }
    }
    
    return dp[amount];
}
```

<!-- slide -->
```javascript
function coinChangeCount(coins, amount) {
    const dp = new Array(amount + 1).fill(0);
    dp[0] = 1;
    
    for (const coin of coins) {
        for (let currentAmount = coin; currentAmount <= amount; currentAmount++) {
            dp[currentAmount] += dp[currentAmount - coin];
        }
    }
    
    return dp[amount];
}
```
````

### 2. Maximum Value with Limited Coins (0/1 Knapsack)

Find maximum value with limited copies of each coin.

````carousel
```python
def coin_change_max_value(coins: list[int], values: list[int], amount: int) -> int:
    """
    Maximum value using at most one of each coin (0/1 knapsack).
    """
    n = len(coins)
    dp = [0] * (amount + 1)
    
    for i in range(n):
        for current_amount in range(amount, coins[i] - 1, -1):
            dp[current_amount] = max(
                dp[current_amount],
                dp[current_amount - coins[i]] + values[i]
            )
    
    return dp[amount]
```

### 3. Minimum Coins with Limited Count

Each coin can be used at most k times.

````carousel
```python
def coin_change_limited(coins: list[int], limits: list[int], amount: int) -> int:
    """
    Minimum coins when each coin has a limited count.
    """
    n = len(coins)
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i in range(n):
        coin = coins[i]
        limit = limits[i]
        
        # Process each coin up to its limit
        for count in range(1, limit + 1):
            for current_amount in range(amount, coin - 1, -1):
                if dp[current_amount - coin] != float('inf'):
                    dp[current_amount] = min(
                        dp[current_amount],
                        dp[current_amount - coin] + 1
                    )
    
    return dp[amount] if dp[amount] != float('inf') else -1
```

### 4. LeetCode 322 - Complete Solution

Complete solution with edge case handling and optimization.

````carousel
```python
def coin_change_optimized(coins: list[int], amount: int) -> int:
    """
    Optimized solution with early termination.
    """
    if amount == 0:
        return 0
    
    # Sort coins for early termination optimization
    coins = sorted(set(coins))
    
    # Maximum coin helps prune
    max_coin = coins[0]
    if amount < max_coin:
        # Check if amount is directly reachable
        return 1 if amount in coins else -1
    
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    # Use sorting: try larger coins first for fewer iterations
    for coin in coins:
        for current_amount in range(coin, amount + 1):
            if dp[current_amount - coin] != float('inf'):
                dp[current_amount] = min(dp[current_amount], dp[current_amount - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1
```
````

### 5. Permutations vs Combinations

Key difference in DP approach:

- **Combinations** (order doesn't matter): Iterate coins first, then amounts
- **Permutations** (order matters): Iterate amounts first, then coins

````carousel
```python
# Combinations - order doesn't matter
def count_combinations(coins, amount):
    dp = [0] * (amount + 1)
    dp[0] = 1
    for coin in coins:  # Coins first
        for current_amount in range(coin, amount + 1):
            dp[current_amount] += dp[current_amount - coin]
    return dp[amount]

# Permutations - order matters
def count_permutations(coins, amount):
    dp = [0] * (amount + 1)
    dp[0] = 1
    for current_amount in range(1, amount + 1):  # Amounts first
        for coin in coins:
            if coin <= current_amount:
                dp[current_amount] += dp[current_amount - coin]
    return dp[amount]
```
````

---

## Practice Problems

### Problem 1: Minimum Coins (LeetCode 322)

**Problem:** [LeetCode 322 - Coin Change](https://leetcode.com/problems/coin-change/)

**Description:** You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money. Return the fewest number of coins that you need to make up that amount.

**How to Apply the Technique:**
- Use bottom-up DP: `dp[i] = min(dp[i], dp[i - coin] + 1)`
- Initialize with infinity, base case `dp[0] = 0`
- Track parent pointers if reconstruction needed

---

### Problem 2: Count Combinations (LeetCode 518)

**Problem:** [LeetCode 518 - Coin Change II](https://leetcode.com/problems/coin-change-2/)

**Description:** Find the number of combinations that make up that amount using any number of coins.

**How to Apply the Technique:**
- Use DP with combinations approach (coins outer loop)
- `dp[i] += dp[i - coin]` — each coin contributes to all reachable amounts
- Order doesn't matter, so coins iterated first

---

### Problem 3: Maximum Value (LeetCode 1449)

**Problem:** [LeetCode 1449 - Form Largest Integer](https://leetcode.com/problems/form-largest-integer-given-cost-of-digits/)

**Description:** Given costs of digits, form the largest number with a given total cost.

**How to Apply the Technique:**
- Treat costs as "coins" and digits as "values"
- Use 0/1 knapsack DP to maximize value
- Process from high to low to ensure each digit used at most once

---

### Problem 4: Minimum Squares (LeetCode 279)

**Problem:** [LeetCode 279 - Perfect Squares](https://leetcode.com/problems/perfect-squares/)

**Description:** Given an integer n, return the least number of perfect square numbers that sum to n.

**How to Apply the Technique:**
- Perfect squares become your "coins"
- Same DP as coin change: `dp[i] = min(dp[i], dp[i - square] + 1)`
- Precompute all squares up to n

---

### Problem 5: Minimum Steps to Make Array Equal (LeetCode 1526)

**Problem:** [LeetCode 1526 - Minimum Number of Operations to Make Array Continuous](https://leetcode.com/problems/minimum-number-of-operations-to-make-array-continuous/)

**Description:** Find minimum operations to make array continuous where all elements are the same or consecutive.

**How to Apply the Technique:**
- Sort and use sliding window
- Coin change variant: find minimum insertions in window
- Use DP or greedy within window

---

## Video Tutorial Links

### Fundamentals

- [Coin Change Problem - Dynamic Programming (Take U Forward)](https://www.youtube.com/watch?v=I-l6P7Qn3uA) - Comprehensive introduction
- [Coin Change - LeetCode 322 (NeetCode)](https://www.youtube.com/watch?v=oL6mJ8D3iNI) - Practical implementation
- [Dynamic Programming - Coin Change (BackToBack SWE)](https://www.youtube.com/watch?v=1mtVMEtzI_8) - Detailed explanation

### Variations

- [Coin Change II - Count Combinations (NeetCode)](https://www.youtube.com/watch?v=ru1OwsZbQ5U) - Counting variations
- [Perfect Squares - LeetCode 279](https://www.youtube.com/watch?v=HLReNd4dVzo) - Application to perfect squares
- [Coin Change - Space Optimization](https://www.youtube.com/watch?v=U2qo8hK3QjM) - Space optimization techniques

### Advanced

- [Unbounded Knapsack (Pepcoding)](https://www.youtube.com/watch?v=zaM_gG5uH3s) - Theory behind coin change
- [DP on Subsequences vs DP on Indexes](https://www.youtube.com/watch?v=AE039b4Ug3s) - Understanding DP patterns

---

## Follow-up Questions

### Q1: What makes the Coin Change problem different from 0/1 Knapsack?

**Answer:** The key difference is **unbounded vs bounded**:
- **Coin Change (Unbounded)**: Each coin can be used unlimited times — iterate amount first, then coins
- **0/1 Knapsack**: Each item can be used at most once — iterate amount from high to low

The state transition is similar, but the iteration order differs to prevent reusing items.

### Q2: Why does greedy fail for some coin systems?

**Answer:** Greedy works only for **canonical coin systems** where the greedy choice always leads to optimal solution. Example: coins = [1, 3, 4], amount = 6
- Greedy: 4 + 1 + 1 = 3 coins
- Optimal: 3 + 3 = 2 coins

The greedy algorithm makes locally optimal choices but doesn't consider future implications, leading to suboptimal global solutions.

### Q3: How do you handle very large amounts efficiently?

**Answer:** For very large amounts:
1. **Space optimization**: Use O(n) space by iterating coins first
2. **Bitset approach**: Use bitset for boolean reachability
3. **BFS**: Find minimum coins without storing all states
4. **Mathematical approaches**: For specific coin systems like [1, 5, 10, 25]

### Q4: Can you solve Coin Change in O(amount) space using BFS?

**Answer:** Yes! BFS treats each amount as a node and finds the shortest path:
- Start from amount 0
- Each step subtracts a coin
- First time we reach 0 (going backwards) gives minimum coins

This uses O(amount) space for the visited set but avoids the full DP array.

### Q5: What's the difference between counting combinations vs permutations?

**Answer:**
- **Combinations** (order doesn't matter): Count ways to select coins without considering order
  - Use: coins loop outer, amount loop inner
  - Example: [1,2] and [2,1] are the same

- **Permutations** (order matters): Count all ordered sequences
  - Use: amount loop outer, coins loop inner
  - Example: [1,2] and [2,1] are different

---

## Summary

The Coin Change problem is a fundamental **dynamic programming** pattern that teaches essential concepts:

- **Unbounded Knapsack**: Using items unlimited times
- **Optimal Substructure**: Building solutions from subproblems
- **State Transition**: `dp[i] = min(dp[i], dp[i-coin] + 1)`
- **Order Matters**: Combinations vs permutations

Key takeaways:

- **Use DP** when you need guaranteed optimal solution
- **Greedy works only** for canonical coin systems
- **Time: O(amount × n)**, **Space: O(amount)**
- **Variations**: Counting, maximum value, limited coins
- **Reconstruction**: Track parent pointers to find actual coins used

When to use:
- ✅ Finding minimum coins for exact amount
- ✅ Counting number of ways to make change
- ✅ Unbounded knapsack problems
- ❌ When greedy is not proven optimal
- ❌ For very large amounts (consider BFS or optimizations)

This pattern is essential for technical interviews and competitive programming, appearing in various forms across many problems.

---

## Related Algorithms

- [0/1 Knapsack](./knapsack-01.md) - Bounded knapsack variant
- [Unbounded Knapsack](./knapsack-unbounded.md) - Related DP pattern
- [Combination Sum](./combination-sum.md) - Finding all combinations
- [Partition Equal Subset](./partition-equal-subset.md) - Similar DP approach
