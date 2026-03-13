# Best Time To Buy And Sell Stock With Cooldown

## LeetCode Link

[Best Time to Buy and Sell Stock with Cooldown - LeetCode](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/)

---

## Problem Description

You are given an array `prices` where `prices[i]` is the price of a given stock on the ith day.
Find the maximum profit you can achieve. You may complete as many transactions as you like (i.e., buy one and sell one share of the stock multiple times) with the following restrictions:

After you sell your stock, you cannot buy stock on the next day (i.e., cooldown one day).

**Note:** You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).

---

## Examples

**Example 1:**

**Input:**
```python
prices = [1,2,3,0,2]
```

**Output:**
```python
3
```

**Explanation:** transactions = [buy, sell, cooldown, buy, sell]

**Example 2:**

**Input:**
```python
prices = [1]
```

**Output:**
```python
0
```

---

## Constraints

- `1 <= prices.length <= 5000`
- `0 <= prices[i] <= 1000`

---

## Intuition

The key insight is to model this as a state machine problem. At any given day, we can be in one of three states:

1. **Hold (holding a stock)**: We own a stock and can either sell it today or continue holding
2. **Sold (just sold a stock)**: We sold a stock today, so we must cooldown tomorrow
3. **Cooldown (not holding, after cooldown)**: We're in the cooldown period, can buy tomorrow

**Key observations:**
1. After selling on day i, we cannot buy on day i+1 (mandatory cooldown)
2. We can hold a stock across multiple days
3. The profit at each state depends on previous states

The DP transition is:
- `hold[i] = max(hold[i-1], cooldown[i-1] - prices[i])` - Stay holding OR buy after cooldown
- `sold[i] = hold[i-1] + prices[i]` - Sell the held stock
- `cooldown[i] = max(cooldown[i-1], sold[i-1])` - Stay in cooldown OR cooldown ends

This can be optimized to O(1) space by only tracking the previous day's states.

---

## Pattern: Dynamic Programming - State Machine

### Core Concept

The Best Time to Buy and Sell Stock with Cooldown problem demonstrates the **DP State Machine** pattern where we maintain multiple states representing different situations:

1. **Hold State**: Maximum profit when currently holding a stock
2. **Sold State**: Maximum profit when just sold a stock (can cooldown)
3. **Cooldown State**: Maximum profit during cooldown period after selling

### When to Use This Pattern

This pattern applies when:
- Problem involves sequential decisions with constraints between steps
- Multiple mutually exclusive states need to be tracked
- Current decision affects future options (cooldown after sell)
- Problems involving transaction limits, cooldowns, or fees

### Alternative Patterns

| Alternative Pattern | Use Case |
|---------------------|----------|
| **Simple DP (Stock I/II)** | When no cooldown or transaction limit |
| **Greedy** | When only one transaction allowed |
| **Multiple Transactions** | When unlimited transactions allowed |

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **DP with State Machine** - Optimal solution using three states
2. **Memoization/Recursion** - Top-down DP approach

---

## Approach 1: DP with State Machine (Optimal)

### Algorithm Steps

1. **Initialize states**: Set hold, sold, cooldown to initial values
2. **Iterate through prices**: For each day's price, update states
3. **State transitions**: Apply the DP transitions correctly
4. **Save previous sold**: Need to save prev_sold before updating
5. **Return max profit**: Max of sold and cooldown states

### Why It Works

By maintaining three distinct states, we capture all possible situations:
- When holding: we can either continue holding or sell
- When sold: we must enter cooldown next day
- When in cooldown: we can either stay in cooldown or start fresh

The key is the state transition after selling: we can't buy the next day, which is enforced by the cooldown state.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        """
        Find maximum profit with cooldown using state machine DP.
        
        Args:
            prices: List of stock prices by day
            
        Returns:
            Maximum profit achievable
        """
        if not prices:
            return 0
        
        hold = float('-inf')  # Maximum profit when holding a stock
        sold = 0              # Maximum profit when just sold
        cooldown = 0         # Maximum profit during cooldown
        
        for price in prices:
            prev_sold = sold
            sold = hold + price  # Sell the held stock
            hold = max(hold, cooldown - price)  # Buy or stay holding
            cooldown = max(cooldown, prev_sold)  # Cooldown or end cooldown
        
        return max(sold, cooldown)
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        if (prices.empty()) return 0;
        
        int hold = INT_MIN;  // Maximum profit when holding
        int sold = 0;        // Maximum profit when just sold
        int cooldown = 0;    // Maximum profit during cooldown
        
        for (int price : prices) {
            int prev_sold = sold;
            sold = hold + price;
            hold = max(hold, cooldown - price);
            cooldown = max(cooldown, prev_sold);
        }
        
        return max(sold, cooldown);
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maxProfit(int[] prices) {
        if (prices == null || prices.length == 0) return 0;
        
        int hold = Integer.MIN_VALUE;  // Holding a stock
        int sold = 0;                   // Just sold
        int cooldown = 0;               // In cooldown
        
        for (int price : prices) {
            int prev_sold = sold;
            sold = hold + price;
            hold = Math.max(hold, cooldown - price);
            cooldown = Math.max(cooldown, prev_sold);
        }
        
        return Math.max(sold, cooldown);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    if (!prices || prices.length === 0) return 0;
    
    let hold = -Infinity;  // Holding a stock
    let sold = 0;           // Just sold
    let cooldown = 0;       // In cooldown
    
    for (const price of prices) {
        const prev_sold = sold;
        sold = hold + price;
        hold = Math.max(hold, cooldown - price);
        cooldown = Math.max(cooldown, prev_sold);
    }
    
    return Math.max(sold, cooldown);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - single pass through prices |
| **Space** | O(1) - only three variables |

---

## Approach 2: Memoization (Top-Down DP)

### Algorithm Steps

1. **Define recursive function**: f(i, state) returns max profit from day i in given state
2. **Base case**: If i >= n, return 0 (no more days)
3. **State transitions**: 
   - If holding: max(sell, continue holding)
   - If sold: must cooldown
   - If cooldown: max(buy, stay in cooldown)
4. **Memoize results**: Store computed results to avoid recomputation

### Why It Works

This approach explicitly models all possible actions at each day. The recursive structure naturally captures the constraints of buying, selling, and cooldown periods.

### Code Implementation

````carousel
```python
from typing import List
from functools import lru_cache

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        """
        Top-down DP with memoization.
        """
        n = len(prices)
        
        @lru_cache(maxsize=None)
        def dp(day: int, holding: int) -> int:
            if day >= n:
                return 0
            
            # Option 1: Skip this day
            skip = dp(day + 1, holding)
            
            if holding:
                # Can sell
                sell = prices[day] + dp(day + 2, 0)  # Cooldown after sell
                return max(skip, sell)
            else:
                # Can buy
                buy = -prices[day] + dp(day + 1, 1)
                return max(skip, buy)
        
        return dp(0, 0)
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <cstring>
using namespace std;

class Solution {
public:
    vector<vector<int>> memo;
    vector<int> prices;
    int n;
    
    int dp(int day, bool holding) {
        if (day >= n) return 0;
        if (memo[day][holding] != -1) return memo[day][holding];
        
        int skip = dp(day + 1, holding);
        
        if (holding) {
            int sell = prices[day] + dp(day + 2, false);
            memo[day][holding] = max(skip, sell);
        } else {
            int buy = -prices[day] + dp(day + 1, true);
            memo[day][holding] = max(skip, buy);
        }
        
        return memo[day][holding];
    }
    
    int maxProfit(vector<int>& prices) {
        this->prices = prices;
        n = prices.size();
        memo.assign(n + 2, vector<int>(2, -1));
        return dp(0, 0);
    }
};
```

<!-- slide -->
```java
class Solution {
    private int[][] memo;
    private int[] prices;
    private int n;
    
    private int dp(int day, int holding) {
        if (day >= n) return 0;
        if (memo[day][holding] != -1) return memo[day][holding];
        
        int skip = dp(day + 1, holding);
        
        if (holding == 1) {
            int sell = prices[day] + dp(day + 2, 0);
            memo[day][holding] = Math.max(skip, sell);
        } else {
            int buy = -prices[day] + dp(day + 1, 1);
            memo[day][holding] = Math.max(skip, buy);
        }
        
        return memo[day][holding];
    }
    
    public int maxProfit(int[] prices) {
        if (prices == null || prices.length == 0) return 0;
        this.prices = prices;
        this.n = prices.length;
        this.memo = new int[n + 2][2];
        for (int[] row : memo) {
            Arrays.fill(row, -1);
        }
        return dp(0, 0);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(prices) {
    const n = prices.length;
    const memo = new Map();
    
    function dp(day, holding) {
        if (day >= n) return 0;
        
        const key = `${day}-${holding}`;
        if (memo.has(key)) return memo.get(key);
        
        const skip = dp(day + 1, holding);
        let result;
        
        if (holding) {
            const sell = prices[day] + dp(day + 2, 0);
            result = Math.max(skip, sell);
        } else {
            const buy = -prices[day] + dp(day + 1, 1);
            result = Math.max(skip, buy);
        }
        
        memo.set(key, result);
        return result;
    }
    
    return dp(0, 0);
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - each state computed once |
| **Space** | O(n) - memoization table |

---

## Comparison of Approaches

| Aspect | State Machine | Memoization |
|--------|---------------|-------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(1) | O(n) |
| **Implementation** | More complex logic | More intuitive |
| **LeetCode Optimal** | ✅ | ✅ |

**Best Approach:** Use Approach 1 (State Machine) for optimal O(1) space solution.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Amazon, Apple, Microsoft, Goldman Sachs
- **Difficulty**: Medium
- **Concepts Tested**: Dynamic Programming, State Machine, Optimization

### Learning Outcomes

1. **State Machine DP**: Learn to model problems with multiple states
2. **Space Optimization**: Reduce from O(n) to O(1) space
3. **Transition Logic**: Understand how to correctly transition between states

---

## Related Problems

Based on similar themes (stock trading with constraints):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Best Time to Buy and Sell Stock II | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/) | Unlimited transactions |
| Best Time to Buy and Sell Stock III | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/) | At most 2 transactions |
| Best Time to Buy and Sell Stock IV | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/) | At most k transactions |
| Best Time to Buy and Sell Stock with Transaction Fee | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/) | With transaction fee |

### Pattern Reference

For more detailed explanations of the DP State Machine pattern, see:
- **[Dynamic Programming Pattern](/patterns/dynamic-programming)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Best Time to Buy and Sell Stock with Cooldown](https://www.youtube.com/watch?v=4wNXkhA38ic)** - Clear explanation with visual examples
2. **[Stock Buy Sell with Cooldown - LeetCode 309](https://www.youtube.com/watch?v=6Fuausoq6b4)** - Detailed walkthrough
3. **[Dynamic Programming - State Machine](https://www.youtube.com/watch?v=8L6Kc0W8uRk)** - Understanding state machine DP

### Related Concepts

- **[Dynamic Programming Fundamentals](https://www.youtube.com/watch?v=8LuzMT-_MjE)** - DP basics
- **[State Machine Design](https://www.youtube.com/watch?v=0sQHO5y4KqU)** - State machine patterns

---

## Follow-up Questions

### Q1: How would you extend this to handle transaction fees?

**Answer:** Add a transaction fee when selling. Modify the sold state:
```python
sold = hold + price - fee
```
Or add a separate fee state.

### Q2: What if we have a limit on the number of transactions?

**Answer:** Add another dimension to track number of transactions:
```python
hold[i][k] = max(hold[i-1][k], cooldown[i-1][k-1] - price[i])
```
where k is the number of transactions.

### Q3: How would you track the actual transactions (not just max profit)?

**Answer:** Store the decision made at each state, then backtrack to reconstruct the transactions.

### Q4: Can you solve this with greedy instead of DP?

**Answer:** No, greedy doesn't work because the cooldown constraint creates dependencies between non-adjacent days. DP is necessary to capture these relationships.

---

## Common Pitfalls

### 1. State Update Order
A critical mistake is updating states in the wrong order. Always save `prev_sold` (or use the previous day's value) before updating `hold` and `sold`, otherwise you'll use the current day's sold value when calculating hold.

### 2. Not Initializing States Correctly
For the first day, `hold` should be `-prices[0]` (buying on day 0), `sold` should be 0, and `cooldown` should be 0.

### 3. Confusing Cooldown and Sold States
Remember: "sold" means you just sold today (cannot buy tomorrow), while "cooldown" means you're in the cooldown period (can buy tomorrow).

### 4. Not Considering Empty Prices
Always handle the edge case where `prices` is empty - the answer should be 0.

### 5. Using Wrong Initial Values
Using 0 for `hold` instead of `-inf` or `-prices[0]` will give incorrect results for profit calculations.

---

## Summary

The **Best Time to Buy and Sell Stock with Cooldown** problem demonstrates the **DP State Machine** pattern:

- **Three states**: Hold, Sold, and Cooldown capture all situations
- **Correct transitions**: After selling, must enter cooldown
- **Space optimization**: O(1) space with proper state tracking

Key insights:
1. Use three states to model all possible situations
2. Save previous sold value before updating to avoid using today's value
3. Return max of sold and cooldown (not holding)
4. This pattern extends to other stock problems with constraints

This problem is essential for understanding how to apply state machine DP to sequential decision problems and forms the foundation for more complex stock trading problems.
