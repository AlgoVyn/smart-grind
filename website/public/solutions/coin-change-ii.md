# Coin Change Ii

## Problem Description

[LeetCode Link: Coin Change II](https://leetcode.com/problems/coin-change-ii/)

You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money.
Return the number of combinations that make up that amount. If that amount of money cannot be made up by any combination of the coins, return 0.
You may assume that you have an infinite number of each kind of coin.
The answer is guaranteed to fit into a signed 32-bit integer.

---

## Examples

**Example 1:**

**Input:**
```python
amount = 5, coins = [1,2,5]
```

**Output:**
```python
4
```

**Explanation:** there are four ways to make up the amount:
- 5=5
- 5=2+2+1
- 5=2+1+1+1
- 5=1+1+1+1+1

**Example 2:**

**Input:**
```python
amount = 3, coins = [2]
```

**Output:**
```python
0
```

**Explanation:** the amount of 3 cannot be made up just with coins of 2.

**Example 3:**

**Input:**
```python
amount = 10, coins = [10]
```

**Output:**
```python
1
```

---

## Constraints

- `1 <= coins.length <= 300`
- `1 <= coins[i] <= 5000`
- All the values of coins are unique.
- `0 <= amount <= 5000`

---

## Pattern:

This problem follows the **Dynamic Programming - Unbounded Knapsack** pattern, specifically the **Coin Change** variation.

### Core Concept

- **Unbounded knapsack**: Each coin can be used unlimited times
- **DP by amount**: dp[i] represents number of ways to make amount i
- **Order-independent combinations**: Using 1D DP with outer loop over coins ensures combinations not permutations

### When to Use This Pattern

This pattern is applicable when:
1. Counting ways to achieve a target sum with unlimited items
2. Problems involving coin change or similar denominations
3. When order of selection doesn't matter (combinations vs permutations)

### Related Patterns

| Pattern | Description |
|---------|-------------|
| 0/1 Knapsack | Items can only be used once |
| Coin Change (min coins) | Find minimum coins needed |
| Subset Sum | Whether subset can sum to target |

### Pattern Summary

This problem exemplifies **Unbounded Knapsack for Combination Count**, characterized by:
- 1D DP array where dp[i] = number of ways to make amount i
- Outer loop over coins, inner loop over amounts
- This order ensures combinations (not permutations) are counted

---

## Intuition

The key insight for this problem is using **Dynamic Programming** to count the number of ways to make a target amount. This is the classic "unbounded knapsack" variation where:

1. **Unbounded**: Each coin can be used unlimited times
2. **Combinations (not permutations)**: Order of coins doesn't matter

### Key Insight: Order of Loops

The critical difference between counting **combinations** vs **permutations** lies in the loop order:
- **Outer loop over coins, inner over amount**: ✅ Combinations (correct)
- **Outer loop over amount, inner over coins**: ❌ Permutations (counts different orders)

### Why?

When coins are in the outer loop, we process all ways using the first coin before moving to the second. This ensures {1,2} and {2,1} are counted as the same combination.

### Example Walkthrough

For `amount = 5, coins = [1,2,5]`:
```
dp[0] = 1 (one way to make 0: use no coins)

Using coin 1:
dp[1] = dp[1] + dp[0] = 0 + 1 = 1  (1)
dp[2] = dp[2] + dp[1] = 0 + 1 = 1  (1+1)
dp[3] = dp[3] + dp[2] = 0 + 1 = 1  (1+1+1)
dp[4] = dp[4] + dp[3] = 0 + 1 = 1  (1+1+1+1)
dp[5] = dp[5] + dp[4] = 0 + 1 = 1  (1+1+1+1+1)

Using coin 2:
dp[2] = dp[2] + dp[0] = 1 + 1 = 2  (1+1, 2)
dp[3] = dp[3] + dp[1] = 1 + 1 = 2  (1+1+1, 2+1)
dp[4] = dp[4] + dp[2] = 1 + 2 = 3  (1+1+1+1, 1+1+2, 2+2)
dp[5] = dp[5] + dp[3] = 1 + 2 = 3  (1+1+1+1+1, 1+1+1+2, 2+2+1)

Using coin 5:
dp[5] = dp[5] + dp[0] = 3 + 1 = 4  (all above + 5)

Answer: 4
```

---

## Solution Approaches

## Approach 1: 1D DP (Optimal)

### Algorithm Steps

1. Create dp array of size amount+1, initialize dp[0] = 1
2. For each coin, iterate from coin to amount
3. dp[i] += dp[i - coin] for each amount
4. Return dp[amount]

### Why It Works

By processing coins one at a time in the outer loop, we build up all combinations using only the coins processed so far. Each dp[i] represents the number of ways to make amount i.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def change(self, amount: int, coins: List[int]) -> int:
        dp = [0] * (amount + 1)
        dp[0] = 1
        for coin in coins:
            for i in range(coin, amount + 1):
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
/**
 * @param {number} amount
 * @param {number[]} coins
 * @return {number}
 */
var change = function(amount, coins) {
    const dp = new Array(amount + 1).fill(0);
    dp[0] = 1;
    for (const coin of coins) {
        for (let i = coin; i <= amount; i++) {
            dp[i] += dp[i - coin];
        }
    }
    return dp[amount];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n * amount) where n is number of coins |
| **Space** | O(amount) |

---

## Approach 2: 2D DP (For Understanding)

### Algorithm Steps

1. Create dp[n+1][amount+1] where n = number of coins
2. dp[i][j] = number of ways to make amount j using first i coins
3. Base case: dp[0][0] = 1
4. Fill table: dp[i][j] = dp[i-1][j] + dp[i][j-coins[i-1]]

### Why It Works

This is the classic 2D DP formulation. dp[i][j] can either not use coin i-1 (dp[i-1][j]) or use it at least once (dp[i][j-coins[i-1]]).

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def change(self, amount: int, coins: List[int]) -> int:
        n = len(coins)
        dp = [[0] * (amount + 1) for _ in range(n + 1)]
        dp[0][0] = 1
        
        for i in range(1, n + 1):
            for j in range(amount + 1):
                dp[i][j] = dp[i - 1][j]
                if j >= coins[i - 1]:
                    dp[i][j] += dp[i][j - coins[i - 1]]
        
        return dp[n][amount]
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int change(int amount, vector<int>& coins) {
        int n = coins.size();
        vector<vector<int>> dp(n + 1, vector<int>(amount + 1, 0));
        dp[0][0] = 1;
        
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j <= amount; j++) {
                dp[i][j] = dp[i - 1][j];
                if (j >= coins[i - 1]) {
                    dp[i][j] += dp[i][j - coins[i - 1]];
                }
            }
        }
        
        return dp[n][amount];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int change(int amount, int[] coins) {
        int n = coins.length;
        int[][] dp = new int[n + 1][amount + 1];
        dp[0][0] = 1;
        
        for (int i = 1; i <= n; i++) {
            for (int j = 0; j <= amount; j++) {
                dp[i][j] = dp[i - 1][j];
                if (j >= coins[i - 1]) {
                    dp[i][j] += dp[i][j - coins[i - 1]];
                }
            }
        }
        
        return dp[n][amount];
    }
}
```

<!-- slide -->
```javascript
var change = function(amount, coins) {
    const n = coins.length;
    const dp = Array.from({ length: n + 1 }, () => Array(amount + 1).fill(0));
    dp[0][0] = 1;
    
    for (let i = 1; i <= n; i++) {
        for (let j = 0; j <= amount; j++) {
            dp[i][j] = dp[i - 1][j];
            if (j >= coins[i - 1]) {
                dp[i][j] += dp[i][j - coins[i - 1]];
            }
        }
    }
    
    return dp[n][amount];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n * amount) |
| **Space** | O(n * amount) |

---

## Approach 3: Recursion with Memoization

### Algorithm Steps

1. Define recursive function f(i, remaining) = ways using coins[i:] to make remaining
2. Base case: if remaining == 0, return 1; if remaining < 0 or i == len(coins), return 0
3. Memoize results to avoid recomputation

### Why It Works

Recursion naturally explores all combinations. Memoization ensures each state is computed only once.

### Code Implementation

````carousel
```python
from typing import List
from functools import lru_cache

class Solution:
    def change(self, amount: int, coins: List[int]) -> int:
        @lru_cache(maxsize=None)
        def dfs(idx, remaining):
            if remaining == 0:
                return 1
            if remaining < 0 or idx == len(coins):
                return 0
            # Skip current coin or use it
            return dfs(idx + 1, remaining) + dfs(idx, remaining - coins[idx])
        
        return dfs(0, amount)
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    int change(int amount, vector<int>& coins) {
        vector<unordered_map<int, int>> memo(coins.size() + 1);
        function<int(int, int)> dfs = [&](int idx, int remaining) -> int {
            if (remaining == 0) return 1;
            if (remaining < 0 || idx == coins.size()) return 0;
            if (memo[idx].count(remaining)) return memo[idx][remaining];
            int result = dfs(idx + 1, remaining) + dfs(idx, remaining - coins[idx]);
            memo[idx][remaining] = result;
            return result;
        };
        return dfs(0, amount);
    }
};
```

<!-- slide -->
```java
class Solution {
    public int change(int amount, int[] coins) {
        int[][] memo = new int[coins.length][amount + 1];
        for (int[] row : memo) {
            Arrays.fill(row, -1);
        }
        return dfs(0, amount, coins, memo);
    }
    
    private int dfs(int idx, int remaining, int[] coins, int[][] memo) {
        if (remaining == 0) return 1;
        if (remaining < 0 || idx == coins.length) return 0;
        if (memo[idx][remaining] != -1) return memo[idx][remaining];
        memo[idx][remaining] = dfs(idx + 1, remaining, coins, memo) + 
                               dfs(idx, remaining - coins[idx], coins, memo);
        return memo[idx][remaining];
    }
}
```

<!-- slide -->
```javascript
var change = function(amount, coins) {
    const memo = new Map();
    
    function dfs(idx, remaining) {
        if (remaining === 0) return 1;
        if (remaining < 0 || idx === coins.length) return 0;
        
        const key = `${idx}-${remaining}`;
        if (memo.has(key)) return memo.get(key);
        
        const result = dfs(idx + 1, remaining) + dfs(idx, remaining - coins[idx]);
        memo.set(key, result);
        return result;
    }
    
    return dfs(0, amount);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n * amount) |
| **Space** | O(n * amount) |

---

## Comparison of Approaches

| Aspect | 1D DP | 2D DP | Recursion |
|--------|-------|-------|----------|
| **Time Complexity** | O(n*amount) | O(n*amount) | O(n*amount) |
| **Space Complexity** | O(amount) | O(n*amount) | O(n*amount) |
| **Implementation** | Simple | Moderate | Complex |
| **LeetCode Optimal** | ✅ | ❌ | ❌ |
| **Difficulty** | Easy | Easy | Medium |

**Best Approach:** Use Approach 1 (1D DP) for optimal solution.

---

## Common Pitfalls

### 1. Counting permutations instead of combinations
**Issue:** Inner loop over coins and outer loop over amount counts different orders (permutations).

**Solution:** Use outer loop over coins and inner loop over amounts to count combinations.

### 2. Not initializing dp[0]
**Issue:** Without dp[0] = 1, no combinations can be formed.

**Solution:** Always set dp[0] = 1 as the base case (one way to make amount 0).

### 3. Incorrect loop direction
**Issue:** Using descending or incorrect direction may cause wrong counts.

**Solution:** For this problem, iterate from coin to amount (ascending).

### 4. Integer overflow
**Issue:** Large amounts may cause overflow with 32-bit integers.

**Solution:** Use appropriate data types; Python handles big integers automatically.

### 5. Not handling amount = 0
**Issue:** May return wrong value for amount = 0.

**Solution:** dp[0] = 1 ensures correct answer for amount = 0 (one empty combination).

---

## Related Problems

Based on similar DP themes:

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Coin Change | [Link](https://leetcode.com/problems/coin-change/) | Minimum coins needed |
| Target Sum | [Link](https://leetcode.com/problems/target-sum/) | DP with +/- signs |
| Combination Sum IV | [Link](https://leetcode.com/problems/combination-sum-iv/) | Order matters (permutations) |
| Partition Equal Subset Sum | [Link](https://leetcode.com/problems/partition-equal-subset-sum/) | Subset sum problem |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[Coin Change II - LeetCode 518](https://www.youtube.com/watch?v=MGyDvlXU3Wc)** - NeetCode explanation
2. **[Unbounded Knapsack](https://www.youtube.com/watch?v=ZI17bgz06mQ)** - Back to Back SWE
3. **[DP for Combination Sum](https://www.youtube.com/watch?v=nQL-7_K3c7w)** - Nick White

### Related Concepts

- **[Dynamic Programming Basics](https://www.youtube.com/watch?v=oBt53YbR9Kk)** - DP fundamentals
- **[Knapsack Problem](https://www.youtube.com/watch?v=8lF2blZ4z9Y)** - 0/1 vs Unbounded

---

## Summary

The **Coin Change II** problem demonstrates **Unbounded Knapsack for Combination Count**:

- **1D DP**: dp[i] = number of ways to make amount i
- **Loop order matters**: Outer coin loop for combinations
- **Time complexity**: O(n * amount)
- **Space complexity**: O(amount)

Key insights:
1. dp[0] = 1 is the base case (one way to make 0: use nothing)
2. Outer loop over coins ensures combinations, not permutations
3. Each coin can be used unlimited times (unbounded)
4. The problem is equivalent to counting subsets that sum to target

---

## Follow-up Questions

### Q1: How would you find the minimum number of coins instead?

**Answer:** Use similar DP but initialize dp with infinity. dp[i] = min(dp[i], dp[i-coin] + 1).

### Q2: How would you handle very large amounts efficiently?

**Answer:** Use space-optimized 1D DP which is already O(amount). For extremely large amounts, consider greedy with validation.

### Q3: What if order of coins matters (permutations)?

**Answer:** Swap the loops: outer over amount, inner over coins. This counts {1,2} and {2,1} as different.

### Q4: How would you return all possible combinations?

**Answer:** Instead of counting, store the actual coin combinations in a list of lists.

### Q5: Can you solve with recursion only?

**Answer:** Yes, use recursion with memoization (top-down DP). Time O(n*amount), Space O(n*amount).

---

## Time Complexity
**O(n * amount)**, where n is the number of coins.

---

## Space Complexity
**O(amount)**, for the dp array.
