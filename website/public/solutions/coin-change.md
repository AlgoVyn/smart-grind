# Coin Change

## Problem Description

You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.
Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.
You may assume that you have an infinite number of each kind of coin.

**Link to problem:** [Coin Change - LeetCode 322](https://leetcode.com/problems/coin-change/)

## Constraints
- `1 <= coins.length <= 12`
- `1 <= coins[i] <= 2^31 - 1`
- `0 <= amount <= 10^4`

---

## Pattern: Dynamic Programming - Unbounded Knapsack

This problem is a classic example of the **Dynamic Programming - Unbounded Knapsack** pattern. The pattern involves finding the optimal solution when you can use each item (coin) an unlimited number of times.

### Core Concept

The fundamental idea is:
- **Unbounded**: Each coin can be used any number of times
- **Minimum**: We want the minimum number of coins
- **Subproblem**: `dp[i]` represents the minimum coins needed to make amount `i`

---

## Examples

### Example

**Input:**
```
coins = [1,2,5], amount = 11
```

**Output:**
```
3
```

**Explanation:** 11 = 5 + 5 + 1

### Example 2

**Input:**
```
coins = [2], amount = 3
```

**Output:**
```
-1
```

### Example 3

**Input:**
```
coins = [1], amount = 0
```

**Output:**
```
0
```

---

## Intuition

The key insight is that for each amount, we can either use a coin or not. If we use a coin of value `c`, then the remaining amount is `amount - c`, and we add 1 to the count.

This leads to the recurrence relation:
```
dp[i] = min(dp[i], dp[i - coin] + 1) for each coin
```

### Why Dynamic Programming?

- **Optimal Substructure**: The solution to the larger problem depends on solutions to smaller subproblems
- **Overlapping Subproblems**: We compute the same subproblems multiple times without DP

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Bottom-Up DP (Tabulation)** - Standard approach O(n * amount) time, O(amount) space
2. **Top-Down DP (Memoization)** - Recursive with memoization
3. **BFS Approach** - Alternative thinking using BFS

---

## Approach 1: Bottom-Up Dynamic Programming (Optimal)

This is the most common and efficient approach. We build the solution from the ground up.

### Algorithm Steps

1. Create a DP array of size `amount + 1`, initialize with infinity
2. Set `dp[0] = 0` (0 coins needed for amount 0)
3. For each amount from 1 to target:
   - For each coin denomination:
     - If coin <= current amount, update dp[amount]
4. Return dp[amount] if not infinity, else -1

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def coinChange(self, coins: List[int], amount: int) -> int:
        """
        Solve coin change using bottom-up dynamic programming.
        
        Args:
            coins: List of coin denominations
            amount: Target amount to make
            
        Returns:
            Minimum number of coins needed, or -1 if impossible
        """
        dp = [float('inf')] * (amount + 1)
        dp[0] = 0
        
        for coin in coins:
            for i in range(coin, amount + 1):
                dp[i] = min(dp[i], dp[i - coin] + 1)
        
        return dp[amount] if dp[amount] != float('inf') else -1
```

<!-- slide -->
```cpp
class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        /**
         * Solve coin change using bottom-up dynamic programming.
         * 
         * Args:
         *     coins: List of coin denominations
         *     amount: Target amount to make
         * 
         * Returns:
         *     Minimum number of coins needed, or -1 if impossible
         */
        const int INF = amount + 1;
        vector<int> dp(amount + 1, INF);
        dp[0] = 0;
        
        for (int coin : coins) {
            for (int i = coin; i <= amount; i++) {
                dp[i] = min(dp[i], dp[i - coin] + 1);
            }
        }
        
        return dp[amount] == INF ? -1 : dp[amount];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int coinChange(int[] coins, int amount) {
        /**
         * Solve coin change using bottom-up dynamic programming.
         * 
         * Args:
         *     coins: List of coin denominations
         *     amount: Target amount to make
         * 
         * Returns:
         *     Minimum number of coins needed, or -1 if impossible
         */
        int[] dp = new int[amount + 1];
        Arrays.fill(dp, amount + 1);
        dp[0] = 0;
        
        for (int coin : coins) {
            for (int i = coin; i <= amount; i++) {
                dp[i] = Math.min(dp[i], dp[i - coin] + 1);
            }
        }
        
        return dp[amount] > amount ? -1 : dp[amount];
    }
}
```

<!-- slide -->
```javascript
/**
 * Solve coin change using bottom-up dynamic programming.
 * 
 * @param {number[]} coins - List of coin denominations
 * @param {number} amount - Target amount to make
 * @return {number} - Minimum number of coins needed, or -1
 */
var coinChange = function(coins, amount) {
    const dp = new Array(amount + 1).fill(Infinity);
    dp[0] = 0;
    
    for (const coin of coins) {
        for (let i = coin; i <= amount; i++) {
            dp[i] = Math.min(dp[i], dp[i - coin] + 1);
        }
    }
    
    return dp[amount] === Infinity ? -1 : dp[amount];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n * amount) - where n is the number of coins |
| **Space** | O(amount) - for the dp array |

---

## Approach 2: Top-Down DP with Memoization

This approach uses recursion with memoization to avoid recomputing subproblems.

### Algorithm Steps

1. Create a memoization cache
2. Define recursive function `solve(remaining)`:
   - If remaining == 0, return 0
   - If remaining < 0, return -1 (impossible)
   - If in cache, return cached result
   - For each coin, compute result and track minimum
   - Store and return minimum (or -1 if impossible)

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def coinChange_memo(self, coins: List[int], amount: int) -> int:
        """
        Solve coin change using top-down DP with memoization.
        """
        memo = {}
        
        def solve(remaining):
            if remaining == 0:
                return 0
            if remaining < 0:
                return -1
            if remaining in memo:
                return memo[remaining]
            
            min_coins = float('inf')
            for coin in coins:
                result = solve(remaining - coin)
                if result != -1:
                    min_coins = min(min_coins, result + 1)
            
            memo[remaining] = min_coins if min_coins != float('inf') else -1
            return memo[remaining]
        
        return solve(amount)
```

<!-- slide -->
```cpp
class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        unordered_map<int, int> memo;
        return solve(coins, amount, memo);
    }
    
private:
    int solve(vector<int>& coins, int remaining, unordered_map<int, int>& memo) {
        if (remaining == 0) return 0;
        if (remaining < 0) return -1;
        if (memo.count(remaining)) return memo[remaining];
        
        int minCoins = INT_MAX;
        for (int coin : coins) {
            int result = solve(coins, remaining - coin, memo);
            if (result != -1) {
                minCoins = min(minCoins, result + 1);
            }
        }
        
        memo[remaining] = minCoins == INT_MAX ? -1 : minCoins;
        return memo[remaining];
    }
};
```

<!-- slide -->
```java
class Solution {
    private Map<Integer, Integer> memo = new HashMap<>();
    
    public int coinChange(int[] coins, int amount) {
        return solve(coins, amount);
    }
    
    private int solve(int[] coins, int remaining) {
        if (remaining == 0) return 0;
        if (remaining < 0) return -1;
        if (memo.containsKey(remaining)) return memo.get(remaining);
        
        int minCoins = Integer.MAX_VALUE;
        for (int coin : coins) {
            int result = solve(coins, remaining - coin);
            if (result != -1) {
                minCoins = Math.min(minCoins, result + 1);
            }
        }
        
        int answer = minCoins == Integer.MAX_VALUE ? -1 : minCoins;
        memo.put(remaining, answer);
        return answer;
    }
}
```

<!-- slide -->
```javascript
/**
 * Solve coin change using top-down DP with memoization.
 * 
 * @param {number[]} coins - List of coin denominations
 * @param {number} amount - Target amount to make
 * @return {number} - Minimum number of coins needed, or -1
 */
var coinChange = function(coins, amount) {
    const memo = new Map();
    
    const solve = (remaining) => {
        if (remaining === 0) return 0;
        if (remaining < 0) return -1;
        if (memo.has(remaining)) return memo.get(remaining);
        
        let minCoins = Infinity;
        for (const coin of coins) {
            const result = solve(remaining - coin);
            if (result !== -1) {
                minCoins = Math.min(minCoins, result + 1);
            }
        }
        
        const answer = minCoins === Infinity ? -1 : minCoins;
        memo.set(remaining, answer);
        return answer;
    };
    
    return solve(amount);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n * amount) |
| **Space** | O(amount) - for recursion stack and memo |

---

## Approach 3: BFS Approach

Think of this as finding the shortest path in an unweighted graph where each node is an amount.

### Algorithm Steps

1. Use BFS starting from amount 0
2. For each amount, try adding each coin to reach new amounts
3. Track visited amounts to avoid cycles
4. Return the level (number of coins) when we reach the target

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def coinChange_bfs(self, coins: List[int], amount: int) -> int:
        """
        Solve coin change using BFS.
        """
        if amount == 0:
            return 0
        
        visited = set()
        queue = deque([(0, 0)])  # (amount, coins_used)
        
        while queue:
            curr, count = queue.popleft()
            
            for coin in coins:
                next_amount = curr + coin
                if next_amount == amount:
                    return count + 1
                if next_amount < amount and next_amount not in visited:
                    visited.add(next_amount)
                    queue.append((next_amount, count + 1))
        
        return -1
```

<!-- slide -->
```cpp
class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        if (amount == 0) return 0;
        
        queue<pair<int, int>> q;
        q.push({0, 0});
        vector<bool> visited(amount + 1, false);
        
        while (!q.empty()) {
            auto [curr, count] = q.front();
            q.pop();
            
            for (int coin : coins) {
                int nextAmount = curr + coin;
                if (nextAmount == amount) return count + 1;
                if (nextAmount < amount && !visited[nextAmount]) {
                    visited[nextAmount] = true;
                    q.push({nextAmount, count + 1});
                }
            }
        }
        
        return -1;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int coinChange(int[] coins, int amount) {
        if (amount == 0) return 0;
        
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{0, 0});
        boolean[] visited = new boolean[amount + 1];
        
        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int amountSoFar = curr[0];
            int count = curr[1];
            
            for (int coin : coins) {
                int nextAmount = amountSoFar + coin;
                if (nextAmount == amount) return count + 1;
                if (nextAmount < amount && !visited[nextAmount]) {
                    visited[nextAmount] = true;
                    queue.offer(new int[]{nextAmount, count + 1});
                }
            }
        }
        
        return -1;
    }
}
```

<!-- slide -->
```javascript
/**
 * Solve coin change using BFS.
 * 
 * @param {number[]} coins - List of coin denominations
 * @param {number} amount - Target amount to make
 * @return {number} - Minimum number of coins needed, or -1
 */
var coinChange = function(coins, amount) {
    if (amount === 0) return 0;
    
    const queue = [[0, 0]];
    const visited = new Set();
    
    while (queue.length) {
        const [curr, count] = queue.shift();
        
        for (const coin of coins) {
            const nextAmount = curr + coin;
            if (nextAmount === amount) return count + 1;
            if (nextAmount < amount && !visited.has(nextAmount)) {
                visited.add(nextAmount);
                queue.push([nextAmount, count + 1]);
            }
        }
    }
    
    return -1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n^amount) in worst case - exponential |
| **Space** | O(amount) |

---

## Comparison of Approaches

| Aspect | Bottom-Up DP | Top-Down DP | BFS |
|--------|--------------|-------------|-----|
| **Time Complexity** | O(n * amount) | O(n * amount) | O(n^amount) |
| **Space Complexity** | O(amount) | O(amount) | O(amount) |
| **Implementation** | Simple | Moderate | Simple |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ❌ No |
| **Best For** | Production | Understanding | Concept |

**Best Approach:** Bottom-Up DP (Approach 1) is optimal and recommended for production code.

---

## Why DP is Optimal for This Problem

The dynamic programming approach is optimal because:

1. **Complete Coverage**: Every possible amount is computed exactly once
2. **Optimal Substructure**: The minimum coins for amount i depends on minimum coins for smaller amounts
3. **No Redundancy**: Each subproblem is solved only once with memoization
4. **Deterministic**: Time complexity is predictable and polynomial

The key insight is that we're solving an unbounded knapsack problem where we want to minimize the number of items (coins) used.

---

## Related Problems

Based on similar themes (dynamic programming, unbounded knapsack):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Climbing Stairs | [Link](https://leetcode.com/problems/climbing-stairs/) | Similar DP with choices |
| Minimum Cost Climbing Stairs | [Link](https://leetcode.com/problems/minimum-cost-climbing-stairs/) | DP with costs |
| House Robber | [Link](https://leetcode.com/problems/house-robber/) | DP with choices |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Coin Change II | [Link](https://leetcode.com/problems/coin-change-ii/) | Count ways to make amount |
| Target Sum | [Link](https://leetcode.com/problems/target-sum/) | DP with +/- signs |
| Partition Equal Subset Sum | [Link](https://leetcode.com/problems/partition-equal-subset-sum/) | Subset sum variant |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Minimum Cost to Make Array Equal | [Link](https://leetcode.com/problems/minimum-cost-to-make-array-equal/) | Advanced DP |
| Remove Boxes | [Link](https://leetcode.com/problems/remove-boxes/) | 3D DP |

### Pattern Reference

For more detailed explanations of the Dynamic Programming pattern, see:
- **[Dynamic Programming - Unbounded Knapsack Pattern](/patterns/unbounded-knapsack)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Dynamic Programming Basics

- [NeetCode - Coin Change](https://www.youtube.com/watch?v=H9bfqVHjoH4) - Clear explanation with visual examples
- [Back to Back SWE - Coin Change](https://www.youtube.com/watch?v=ru1JvtK8eMs) - Detailed walkthrough
- [LeetCode Official Solution](https://www.youtube.com/watch?v=YoBpf6r8E7I) - Official problem solution

### Advanced DP Concepts

- [Dynamic Programming Explained](https://www.youtube.com/watch?v=8LusJ5D8uc8) - Understanding DP
- [Unbounded Knapsack Pattern](https://www.youtube.com/watch?v=kyLxTdsT8zs) - Pattern explanation

---

## Follow-up Questions

### Q1: Can you solve it in O(amount) space?

**Answer:** Yes! The bottom-up DP approach already uses O(amount) space. We iterate through coins and update the dp array in place, which is optimal.

---

### Q2: What if coins are sorted in descending order - would it improve performance?

**Answer:** Sorting doesn't improve time complexity for the standard DP solution. However, it can help in branch-and-bound approaches or when combined with greedy heuristics for approximation.

---

### Q3: How would you handle very large amounts efficiently?

**Answer:** For extremely large amounts, consider:
1. Using BFS with pruning when coins are small
2. Using mathematical approaches (like the Frobenius coin problem) for specific denominations
3. Breaking the problem into smaller chunks with divide-and-conquer

---

### Q4: What edge cases should be tested?

**Answer:**
- Amount = 0 (should return 0)
- Single coin denomination
- Coins with gcd = 1 (always solvable for large enough amounts)
- Coins with gcd > 1 (some amounts may be impossible)
- Very large coin values (greater than amount)
- Duplicate coin values in the input

---

### Q5: How would you modify the solution to also return which coins to use?

**Answer:** Store a separate "parent" array that tracks which coin was used to reach each amount. Backtrack from the target to reconstruct the coin selection.

---

### Q6: What's the difference between bounded and unbounded knapsack?

**Answer:** 
- **Bounded**: Each item can be used at most a fixed number of times
- **Unbounded**: Each item can be used unlimited times (our case)

The main difference is in the iteration order: bounded knapsack iterates amounts in reverse, while unbounded iterates in forward order.

---

## Common Pitfalls

### 1. Initialization Value
**Issue**: Using -1 to initialize dp array instead of infinity.

**Solution**: Use a large value (amount + 1) as infinity, as the maximum coins needed is amount (all 1s).

### 2. Integer Overflow
**Issue**: Adding to infinity value causing overflow.

**Solution**: Check if dp[i - coin] is not infinity before adding 1, or use a large but finite value.

### 3. Coin Order
**Issue**: Not iterating through all coins for each amount.

**Solution**: Outer loop should be coins, inner loop should be amounts (for unbounded).

### 4. Not Handling Impossible Cases
**Issue**: Returning dp[amount] without checking if it's still infinity.

**Solution:** Return -1 if dp[amount] is infinity.

---

## Summary

The **Coin Change** problem is a classic dynamic programming problem that demonstrates the unbounded knapsack pattern:

- **Bottom-Up DP**: Optimal with O(n * amount) time and O(amount) space
- **Top-Down DP**: Good for understanding, same complexity
- **BFS**: Works but less efficient for this problem

The key insight is that the minimum coins for amount i depends on the minimum coins for smaller amounts, making DP the natural choice.

This problem is an excellent introduction to dynamic programming and the unbounded knapsack pattern.

### Pattern Summary

This problem exemplifies the **Dynamic Programming - Unbounded Knapsack** pattern, which is characterized by:
- Unlimited use of each item (coin)
- Finding minimum/maximum value
- Building solution from smaller subproblems
- Polynomial time complexity

For more details on this pattern, see the **[Dynamic Programming - Unbounded Knapsack Pattern](/patterns/unbounded-knapsack)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/coin-change/discuss/) - Community solutions
- [Knapsack Problem - GeeksforGeeks](https://www.geeksforgeeks.org/knapsack-problem/) - Detailed explanation
- [Dynamic Programming - LeetCode](https://leetcode.com/explore/interview/card/top-interview-questions-easy/98/dynamic-programming/) - DP problems
