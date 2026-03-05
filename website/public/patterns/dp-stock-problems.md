# DP - Stock Problems

## Problem Description

Stock Problems are a family of dynamic programming problems involving buying and selling stocks to maximize profit under various constraints. These problems teach state machine thinking in DP, where you track different states (holding stock, not holding, cooldown, etc.) and transition between them.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) for most variations, O(n × k) for k transactions |
| Space Complexity | O(1) to O(n), optimizable to O(1) for most cases |
| Input | Array of daily stock prices |
| Output | Maximum achievable profit |
| Approach | State machine with DP transitions |

### When to Use

- **Stock Trading**: Maximize profit with various constraints
- **State Machine Problems**: Multiple states with transitions
- **Buy/Sell Problems**: Any optimization with buy/sell actions
- **Cooldown Problems**: Actions with waiting periods
- **Transaction Limited Problems**: Limited number of operations

## Intuition

The key insight is to model the problem as a state machine where each day you can be in different states (holding stock, not holding, in cooldown) and make transitions based on actions (buy, sell, rest).

The "aha!" moments:

1. **State tracking**: Track profit in each state separately
2. **State transitions**: Define how you move between states (buy moves from not hold to hold)
3. **Optimal substructure**: Today's best profit depends on yesterday's best profits
4. **Multiple states**: More complex problems need more states (cooldown, transaction count)
5. **Space optimization**: Only need previous day's states, not entire array

## Solution Approaches

### Approach 1: One Transaction (Best Time to Buy and Sell Stock I) ✅ Recommended

Buy once and sell once to maximize profit.

#### Algorithm

1. Track minimum price seen so far
2. Track maximum profit achievable
3. For each price:
   - Update minimum price
   - Calculate profit if sold today
   - Update maximum profit
4. Return maximum profit

#### Implementation

````carousel
```python
def max_profit_one_transaction(prices):
    """
    Max profit with at most one transaction.
    LeetCode 121 - Best Time to Buy and Sell Stock
    
    Time: O(n), Space: O(1)
    """
    if not prices:
        return 0
    
    min_price = float('inf')
    max_profit = 0
    
    for price in prices:
        # Update minimum price seen so far
        min_price = min(min_price, price)
        # Calculate profit if we sell today
        profit = price - min_price
        # Update maximum profit
        max_profit = max(max_profit, profit)
    
    return max_profit
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        if (prices.empty()) return 0;
        
        int minPrice = INT_MAX;
        int maxProfit = 0;
        
        for (int price : prices) {
            minPrice = min(minPrice, price);
            maxProfit = max(maxProfit, price - minPrice);
        }
        
        return maxProfit;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int maxProfit(int[] prices) {
        if (prices.length == 0) return 0;
        
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        
        for (int price : prices) {
            minPrice = Math.min(minPrice, price);
            maxProfit = Math.max(maxProfit, price - minPrice);
        }
        
        return maxProfit;
    }
}
```
<!-- slide -->
```javascript
function maxProfit(prices) {
    if (prices.length === 0) return 0;
    
    let minPrice = Infinity;
    let maxProfit = 0;
    
    for (const price of prices) {
        minPrice = Math.min(minPrice, price);
        maxProfit = Math.max(maxProfit, price - minPrice);
    }
    
    return maxProfit;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) |
| Space | O(1) |

### Approach 2: Unlimited Transactions (Best Time to Buy and Sell Stock II)

Buy and sell multiple times with no cooldown.

#### Implementation

````carousel
```python
def max_profit_unlimited(prices):
    """
    Max profit with unlimited transactions.
    LeetCode 122 - Best Time to Buy and Sell Stock II
    
    Time: O(n), Space: O(1)
    """
    profit = 0
    
    for i in range(1, len(prices)):
        # Add all positive differences
        if prices[i] > prices[i - 1]:
            profit += prices[i] - prices[i - 1]
    
    return profit

# Alternative: State machine approach
def max_profit_unlimited_state_machine(prices):
    """Using state machine for consistency with other problems."""
    if not prices:
        return 0
    
    # hold: max profit at day i with stock in hand
    # not_hold: max profit at day i without stock
    hold = -prices[0]
    not_hold = 0
    
    for price in prices[1:]:
        # Either keep holding or buy today
        hold = max(hold, not_hold - price)
        # Either keep not holding or sell today
        not_hold = max(not_hold, hold + price)
    
    return not_hold
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int profit = 0;
        
        for (int i = 1; i < prices.size(); i++) {
            if (prices[i] > prices[i - 1]) {
                profit += prices[i] - prices[i - 1];
            }
        }
        
        return profit;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int maxProfit(int[] prices) {
        int profit = 0;
        
        for (int i = 1; i < prices.length; i++) {
            if (prices[i] > prices[i - 1]) {
                profit += prices[i] - prices[i - 1];
            }
        }
        
        return profit;
    }
}
```
<!-- slide -->
```javascript
function maxProfit(prices) {
    let profit = 0;
    
    for (let i = 1; i < prices.length; i++) {
        if (prices[i] > prices[i - 1]) {
            profit += prices[i] - prices[i - 1];
        }
    }
    
    return profit;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) |
| Space | O(1) |

### Approach 3: With Cooldown (Best Time to Buy and Sell Stock with Cooldown)

One day cooldown after selling.

#### Implementation

````carousel
```python
def max_profit_with_cooldown(prices):
    """
    Max profit with one day cooldown after selling.
    LeetCode 309 - Best Time to Buy and Sell Stock with Cooldown
    
    Time: O(n), Space: O(n) - can be optimized to O(1)
    """
    if not prices:
        return 0
    
    n = len(prices)
    
    # Three states:
    # hold[i]: max profit at day i with stock in hand
    # not_hold[i]: max profit at day i without stock, can buy
    # cooldown[i]: max profit at day i in cooldown (just sold)
    
    hold = [0] * n
    not_hold = [0] * n
    cooldown = [0] * n
    
    hold[0] = -prices[0]
    not_hold[0] = 0
    cooldown[0] = 0
    
    for i in range(1, n):
        # Can hold from yesterday or buy from not_hold yesterday
        hold[i] = max(hold[i - 1], not_hold[i - 1] - prices[i])
        # Can stay in not_hold or come from cooldown
        not_hold[i] = max(not_hold[i - 1], cooldown[i - 1])
        # Come from selling (holding yesterday + selling today)
        cooldown[i] = hold[i - 1] + prices[i]
    
    return max(not_hold[n - 1], cooldown[n - 1])

# Space optimized to O(1)
def max_profit_cooldown_optimized(prices):
    """O(1) space version."""
    if not prices:
        return 0
    
    hold = -prices[0]
    not_hold = 0
    cooldown = 0
    
    for price in prices[1:]:
        prev_hold = hold
        hold = max(hold, not_hold - price)
        not_hold = max(not_hold, cooldown)
        cooldown = prev_hold + price
    
    return max(not_hold, cooldown)
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        if (prices.empty()) return 0;
        
        int hold = -prices[0];
        int notHold = 0;
        int cooldown = 0;
        
        for (int i = 1; i < prices.size(); i++) {
            int prevHold = hold;
            hold = max(hold, notHold - prices[i]);
            notHold = max(notHold, cooldown);
            cooldown = prevHold + prices[i];
        }
        
        return max(notHold, cooldown);
    }
};
```
<!-- slide -->
```java
class Solution {
    public int maxProfit(int[] prices) {
        if (prices.length == 0) return 0;
        
        int hold = -prices[0];
        int notHold = 0;
        int cooldown = 0;
        
        for (int i = 1; i < prices.length; i++) {
            int prevHold = hold;
            hold = Math.max(hold, notHold - prices[i]);
            notHold = Math.max(notHold, cooldown);
            cooldown = prevHold + prices[i];
        }
        
        return Math.max(notHold, cooldown);
    }
}
```
<!-- slide -->
```javascript
function maxProfit(prices) {
    if (prices.length === 0) return 0;
    
    let hold = -prices[0];
    let notHold = 0;
    let cooldown = 0;
    
    for (let i = 1; i < prices.length; i++) {
        const prevHold = hold;
        hold = Math.max(hold, notHold - prices[i]);
        notHold = Math.max(notHold, cooldown);
        cooldown = prevHold + prices[i];
    }
    
    return Math.max(notHold, cooldown);
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) |
| Space | O(1) |

### Approach 4: At Most K Transactions (Best Time to Buy and Sell Stock IV)

Limit on number of transactions.

#### Implementation

````carousel
```python
def max_profit_k_transactions(prices, k):
    """
    Max profit with at most k transactions.
    LeetCode 188 - Best Time to Buy and Sell Stock IV
    
    Time: O(n * k), Space: O(n * k) - can be optimized
    """
    if not prices or k == 0:
        return 0
    
    n = len(prices)
    
    # If k is large enough, treat as unlimited transactions
    if k >= n // 2:
        return max_profit_unlimited(prices)
    
    # dp[i][j] = max profit up to day j with at most i transactions
    # We track buy and sell separately for each transaction
    
    # buy[i]: max profit after buying with i-th transaction
    # sell[i]: max profit after selling with i-th transaction
    buy = [-float('inf')] * (k + 1)
    sell = [0] * (k + 1)
    
    for price in prices:
        for i in range(1, k + 1):
            # Either keep previous buy or buy today (using sell[i-1] profit)
            buy[i] = max(buy[i], sell[i - 1] - price)
            # Either keep previous sell or sell today
            sell[i] = max(sell[i], buy[i] + price)
    
    return sell[k]

# Alternative: Using 2D DP table
def max_profit_k_transactions_dp(prices, k):
    """2D DP approach - more intuitive but uses more space."""
    if not prices or k == 0:
        return 0
    
    n = len(prices)
    
    if k >= n // 2:
        return max_profit_unlimited(prices)
    
    # dp[t][d] = max profit up to day d with at most t transactions
    dp = [[0] * n for _ in range(k + 1)]
    
    for t in range(1, k + 1):
        max_diff = -prices[0]  # max of dp[t-1][j] - prices[j]
        for d in range(1, n):
            dp[t][d] = max(dp[t][d - 1], prices[d] + max_diff)
            max_diff = max(max_diff, dp[t - 1][d] - prices[d])
    
    return dp[k][n - 1]
```
<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int maxProfit(int k, vector<int>& prices) {
        int n = prices.size();
        if (n == 0 || k == 0) return 0;
        
        // Unlimited transactions case
        if (k >= n / 2) {
            int profit = 0;
            for (int i = 1; i < n; i++) {
                if (prices[i] > prices[i - 1])
                    profit += prices[i] - prices[i - 1];
            }
            return profit;
        }
        
        vector<int> buy(k + 1, INT_MIN);
        vector<int> sell(k + 1, 0);
        
        for (int price : prices) {
            for (int i = 1; i <= k; i++) {
                buy[i] = max(buy[i], sell[i - 1] - price);
                sell[i] = max(sell[i], buy[i] + price);
            }
        }
        
        return sell[k];
    }
};
```
<!-- slide -->
```java
class Solution {
    public int maxProfit(int k, int[] prices) {
        int n = prices.length;
        if (n == 0 || k == 0) return 0;
        
        // Unlimited transactions case
        if (k >= n / 2) {
            int profit = 0;
            for (int i = 1; i < n; i++) {
                if (prices[i] > prices[i - 1])
                    profit += prices[i] - prices[i - 1];
            }
            return profit;
        }
        
        int[] buy = new int[k + 1];
        int[] sell = new int[k + 1];
        Arrays.fill(buy, Integer.MIN_VALUE);
        
        for (int price : prices) {
            for (int i = 1; i <= k; i++) {
                buy[i] = Math.max(buy[i], sell[i - 1] - price);
                sell[i] = Math.max(sell[i], buy[i] + price);
            }
        }
        
        return sell[k];
    }
}
```
<!-- slide -->
```javascript
function maxProfit(k, prices) {
    const n = prices.length;
    if (n === 0 || k === 0) return 0;
    
    // Unlimited transactions case
    if (k >= n / 2) {
        let profit = 0;
        for (let i = 1; i < n; i++) {
            if (prices[i] > prices[i - 1])
                profit += prices[i] - prices[i - 1];
        }
        return profit;
    }
    
    const buy = new Array(k + 1).fill(-Infinity);
    const sell = new Array(k + 1).fill(0);
    
    for (const price of prices) {
        for (let i = 1; i <= k; i++) {
            buy[i] = Math.max(buy[i], sell[i - 1] - price);
            sell[i] = Math.max(sell[i], buy[i] + price);
        }
    }
    
    return sell[k];
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n × k) |
| Space | O(k) |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| One Transaction | O(n) | O(1) | Single buy/sell |
| Unlimited | O(n) | O(1) | No constraints |
| With Cooldown | O(n) | O(1) | One day wait after sell |
| With Fee | O(n) | O(1) | Transaction fee per trade |
| K Transactions | O(n × k) | O(k) | Limited transactions |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) | 121 | Easy | One transaction |
| [Best Time to Buy and Sell Stock II](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/) | 122 | Medium | Unlimited transactions |
| [Best Time to Buy and Sell Stock III](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/) | 123 | Hard | At most 2 transactions |
| [Best Time to Buy and Sell Stock IV](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/) | 188 | Hard | At most k transactions |
| [Best Time to Buy and Sell Stock with Cooldown](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/) | 309 | Medium | One day cooldown |
| [Best Time to Buy and Sell Stock with Transaction Fee](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/) | 714 | Medium | Fee per transaction |

## Video Tutorial Links

1. **[NeetCode - Stock Problems](https://www.youtube.com/watch?v=gsLndaT8y6A)** - All variations explained
2. **[Back To Back SWE - Stock Problems](https://www.youtube.com/watch?v=gsLndaT8y6A)** - State machine approach
3. **[Kevin Naughton Jr. - Stock I](https://www.youtube.com/watch?v=1pkOgXD63yU)** - Simple approach
4. **[Techdose - Stock Problems Playlist](https://www.youtube.com/watch?v=gsLndaT8y6A)** - Complete series
5. **[Abdul Bari - DP on Stocks](https://www.youtube.com/watch?v=gsLndaT8y6A)** - Mathematical approach

## Summary

### Key Takeaways

- **State machine thinking**: Track profit in each state separately
- **Two main states**: Holding stock vs not holding stock
- **Transition rules**: Buy moves to hold, sell moves to not hold
- **Space optimization**: Only need previous day's states
- **K transactions trick**: If k >= n/2, treat as unlimited
- **More states for complexity**: Add states for cooldown, transaction count

### Common Pitfalls

- **Wrong initialization**: hold should be negative (buying costs money)
- **State transition errors**: Make sure transitions follow problem rules
- **Not handling edge cases**: Empty prices array
- **Integer overflow**: Use appropriate data types
- **Confusing states**: Not clearly defining what each state represents
- **Missing the unlimited optimization**: Forgetting k >= n/2 check

### Follow-up Questions

1. **How would you find the actual buy/sell days?**
   - Track decisions at each step, backtrack from final state

2. **What if you can short sell?**
   - Add more states for short positions

3. **Can you solve this with graph algorithms?**
   - Yes, model as graph with states as nodes

4. **How to handle multiple stocks?**
   - Extend state space for each stock

## Pattern Source

[Stock Problems Pattern](patterns/dp-stock-problems.md)
