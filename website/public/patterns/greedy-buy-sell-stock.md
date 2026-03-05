# Greedy - Buy Sell Stock

## Problem Description

The **Greedy - Buy/Sell Stock** pattern is used for problems involving stock trading where you can buy and sell stocks multiple times, but you cannot hold more than one stock at a time and cannot buy and sell on the same day. This pattern maximizes profit by taking advantage of every upward price movement, treating each profitable transaction independently.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| **Input** | Array of daily stock prices |
| **Output** | Maximum achievable profit |
| **Key Insight** | Capture every positive price difference (uphill climb) |
| **Time Complexity** | O(n) - single pass through prices |
| **Space Complexity** | O(1) - constant extra space |

### When to Use

- **Multiple transactions allowed**: Unlimited buy-sell pairs (with constraints)
- **No simultaneous holdings**: Must sell before buying again
- **Daily price tracking**: Array represents consecutive day prices
- **Profit maximization**: Want to capture all upward trends
- **Greedy choice valid**: Local optimal choices lead to global optimum

---

## Intuition

### Core Insight

The key insight behind the greedy stock trading approach is that **every upward price movement represents a profit opportunity**:

1. **Price increase = profit opportunity** - If price[i] > price[i-1], you could have bought at i-1 and sold at i
2. **Sum all positive differences** - Each positive diff is a separate profitable trade
3. **No need for complex state tracking** - Unlike DP approaches for limited transactions
4. **Greedy is optimal** - Taking every profit opportunity yields maximum total profit

### The "Aha!" Moments

1. **Why does summing all positive differences work?** Think of the price chart as a mountain range. Every uphill segment contributes to profit. Instead of finding one big buy-sell pair, we capture every climb.

2. **What's the alternative view?** You can imagine buying at local minima and selling at the next local maxima. The sum of all (max - min) pairs equals the sum of all positive differences.

3. **Why is greedy optimal here?** There's no disadvantage to taking a profit when available. A future higher price doesn't make the current profit any less valuable.

### Profit Visualization

```
Prices: [7, 1, 5, 3, 6, 4]
         ↓  ↑  ↓  ↑  ↓
        -6 +4 -2 +3 -2

Profitable transactions:
- Buy at 1, sell at 5: profit = 4
- Buy at 3, sell at 6: profit = 3
Total: 7

Or equivalently: 4 + (-2) + 3 = 5? No...
Actually: sum of all positive diffs: 4 + 3 = 7 ✓
```

---

## Solution Approaches

### Approach 1: Sum All Positive Differences ⭐

The standard greedy approach capturing every upward price movement.

#### Algorithm

1. **Initialize profit = 0**
2. **Iterate from day 1 to n-1**:
   - If `prices[i] > prices[i-1]`:
     - Add `prices[i] - prices[i-1]` to profit
3. **Return total profit**

#### Implementation

````carousel
```python
def max_profit(prices):
    """
    Calculate max profit with unlimited transactions.
    Sum all positive price differences.
    
    Args:
        prices: List of daily stock prices
        
    Returns:
        Maximum achievable profit
    """
    if not prices:
        return 0
    
    max_profit = 0
    
    for i in range(1, len(prices)):
        if prices[i] > prices[i - 1]:
            # Add every positive difference
            max_profit += prices[i] - prices[i - 1]
    
    return max_profit


def max_profit_with_transactions(prices):
    """
    Returns profit and list of buy-sell transactions.
    """
    if not prices:
        return 0, []
    
    profit = 0
    transactions = []
    buy_day = None
    
    for i in range(len(prices) - 1):
        # Start of upward trend
        if buy_day is None and prices[i + 1] > prices[i]:
            buy_day = i
        # End of upward trend
        elif buy_day is not None and prices[i + 1] < prices[i]:
            transactions.append((buy_day, i, prices[i] - prices[buy_day]))
            profit += prices[i] - prices[buy_day]
            buy_day = None
    
    # Handle last day
    if buy_day is not None:
        transactions.append((buy_day, len(prices) - 1, 
                           prices[-1] - prices[buy_day]))
        profit += prices[-1] - prices[buy_day]
    
    return profit, transactions


def max_profit_with_fee(prices, fee):
    """
    Max profit with transaction fee per trade.
    Use DP approach: cash (no stock) vs hold (have stock).
    """
    if not prices:
        return 0
    
    # cash: max profit with no stock in hand
    # hold: max profit with stock in hand
    cash, hold = 0, -prices[0]
    
    for i in range(1, len(prices)):
        # Either keep cash or sell stock today
        cash = max(cash, hold + prices[i] - fee)
        # Either keep holding or buy stock today
        hold = max(hold, cash - prices[i])
    
    return cash


def max_profit_with_cooldown(prices):
    """
    Max profit with 1-day cooldown after selling.
    """
    if not prices:
        return 0
    
    n = len(prices)
    # hold[i]: max profit on day i with stock in hand
    # sold[i]: max profit on day i just sold
    # rest[i]: max profit on day i resting
    
    hold = [-prices[0]]
    sold = [0]
    rest = [0]
    
    for i in range(1, n):
        hold.append(max(hold[-1], rest[-1] - prices[i]))
        sold.append(hold[-2] + prices[i])  # Must have held yesterday
        rest.append(max(rest[-1], sold[-2]))
    
    return max(sold[-1], rest[-1])
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
        
        int maxProfit = 0;
        
        for (int i = 1; i < prices.size(); i++) {
            if (prices[i] > prices[i - 1]) {
                maxProfit += prices[i] - prices[i - 1];
            }
        }
        
        return maxProfit;
    }
    
    int maxProfitWithFee(vector<int>& prices, int fee) {
        if (prices.empty()) return 0;
        
        int cash = 0;          // Max profit without stock
        int hold = -prices[0]; // Max profit with stock
        
        for (int i = 1; i < prices.size(); i++) {
            cash = max(cash, hold + prices[i] - fee);
            hold = max(hold, cash - prices[i]);
        }
        
        return cash;
    }
    
    int maxProfitWithCooldown(vector<int>& prices) {
        if (prices.empty()) return 0;
        
        int n = prices.size();
        vector<int> hold(n, 0);
        vector<int> sold(n, 0);
        vector<int> rest(n, 0);
        
        hold[0] = -prices[0];
        
        for (int i = 1; i < n; i++) {
            hold[i] = max(hold[i - 1], rest[i - 1] - prices[i]);
            sold[i] = hold[i - 1] + prices[i];
            rest[i] = max(rest[i - 1], sold[i - 1]);
        }
        
        return max(sold[n - 1], rest[n - 1]);
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maxProfit(int[] prices) {
        if (prices == null || prices.length == 0) return 0;
        
        int maxProfit = 0;
        
        for (int i = 1; i < prices.length; i++) {
            if (prices[i] > prices[i - 1]) {
                maxProfit += prices[i] - prices[i - 1];
            }
        }
        
        return maxProfit;
    }
    
    public int maxProfitWithFee(int[] prices, int fee) {
        if (prices == null || prices.length == 0) return 0;
        
        int cash = 0;
        int hold = -prices[0];
        
        for (int i = 1; i < prices.length; i++) {
            int prevCash = cash;
            cash = Math.max(cash, hold + prices[i] - fee);
            hold = Math.max(hold, prevCash - prices[i]);
        }
        
        return cash;
    }
    
    public int maxProfitWithCooldown(int[] prices) {
        if (prices == null || prices.length == 0) return 0;
        
        int n = prices.length;
        int[] hold = new int[n];
        int[] sold = new int[n];
        int[] rest = new int[n];
        
        hold[0] = -prices[0];
        
        for (int i = 1; i < n; i++) {
            hold[i] = Math.max(hold[i - 1], rest[i - 1] - prices[i]);
            sold[i] = hold[i - 1] + prices[i];
            rest[i] = Math.max(rest[i - 1], sold[i - 1]);
        }
        
        return Math.max(sold[n - 1], rest[n - 1]);
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
    
    let maxProfit = 0;
    
    for (let i = 1; i < prices.length; i++) {
        if (prices[i] > prices[i - 1]) {
            maxProfit += prices[i] - prices[i - 1];
        }
    }
    
    return maxProfit;
};

/**
 * @param {number[]} prices
 * @param {number} fee
 * @return {number}
 */
var maxProfitWithFee = function(prices, fee) {
    if (!prices || prices.length === 0) return 0;
    
    let cash = 0;
    let hold = -prices[0];
    
    for (let i = 1; i < prices.length; i++) {
        cash = Math.max(cash, hold + prices[i] - fee);
        hold = Math.max(hold, cash - prices[i]);
    }
    
    return cash;
};

/**
 * @param {number[]} prices
 * @return {number}
 */
var maxProfitWithCooldown = function(prices) {
    if (!prices || prices.length === 0) return 0;
    
    const n = prices.length;
    const hold = new Array(n).fill(0);
    const sold = new Array(n).fill(0);
    const rest = new Array(n).fill(0);
    
    hold[0] = -prices[0];
    
    for (let i = 1; i < n; i++) {
        hold[i] = Math.max(hold[i - 1], rest[i - 1] - prices[i]);
        sold[i] = hold[i - 1] + prices[i];
        rest[i] = Math.max(rest[i - 1], sold[i - 1]);
    }
    
    return Math.max(sold[n - 1], rest[n - 1]);
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - single pass through prices |
| **Space** | O(1) - only tracking profit variable |

---

### Approach 2: Peak-Valley Approach

Alternative intuitive approach: buy at valleys (local minima), sell at peaks (local maxima).

#### Algorithm

1. **Find next valley** (local minimum) - buy here
2. **Find next peak** after valley (local maximum) - sell here
3. **Add profit** from this transaction
4. **Repeat** until end of array

#### Implementation

````carousel
```python
def max_profit_peak_valley(prices):
    """
    Peak-Valley approach: Buy at valleys, sell at peaks.
    """
    if not prices:
        return 0
    
    n = len(prices)
    profit = 0
    i = 0
    
    while i < n - 1:
        # Find valley (local minimum)
        while i < n - 1 and prices[i] >= prices[i + 1]:
            i += 1
        valley = prices[i]
        
        # Find peak (local maximum)
        while i < n - 1 and prices[i] <= prices[i + 1]:
            i += 1
        peak = prices[i]
        
        profit += peak - valley
    
    return profit
```

<!-- slide -->
```cpp
int maxProfitPeakValley(vector<int>& prices) {
    if (prices.empty()) return 0;
    
    int n = prices.size();
    int profit = 0;
    int i = 0;
    
    while (i < n - 1) {
        // Find valley
        while (i < n - 1 && prices[i] >= prices[i + 1]) {
            i++;
        }
        int valley = prices[i];
        
        // Find peak
        while (i < n - 1 && prices[i] <= prices[i + 1]) {
            i++;
        }
        int peak = prices[i];
        
        profit += peak - valley;
    }
    
    return profit;
}
```

<!-- slide -->
```java
public int maxProfitPeakValley(int[] prices) {
    if (prices == null || prices.length == 0) return 0;
    
    int n = prices.length;
    int profit = 0;
    int i = 0;
    
    while (i < n - 1) {
        // Find valley
        while (i < n - 1 && prices[i] >= prices[i + 1]) {
            i++;
        }
        int valley = prices[i];
        
        // Find peak
        while (i < n - 1 && prices[i] <= prices[i + 1]) {
            i++;
        }
        int peak = prices[i];
        
        profit += peak - valley;
    }
    
    return profit;
}
```

<!-- slide -->
```javascript
var maxProfitPeakValley = function(prices) {
    if (!prices || prices.length === 0) return 0;
    
    const n = prices.length;
    let profit = 0;
    let i = 0;
    
    while (i < n - 1) {
        // Find valley
        while (i < n - 1 && prices[i] >= prices[i + 1]) {
            i++;
        }
        const valley = prices[i];
        
        // Find peak
        while (i < n - 1 && prices[i] <= prices[i + 1]) {
            i++;
        }
        const peak = prices[i];
        
        profit += peak - valley;
    }
    
    return profit;
};
```
````

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity | Best For |
|----------|----------------|------------------|----------|
| **Sum Differences** | O(n) | O(1) | **General use** - clean and simple |
| **Peak-Valley** | O(n) | O(1) | Understanding the intuition |
| **With Fee (DP)** | O(n) | O(1) | Transaction fee constraint |
| **With Cooldown** | O(n) | O(n) or O(1) | Cooldown constraint |

**Where:**
- `n` = number of days (length of prices array)

---

## Related Problems

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **Best Time to Buy and Sell Stock** | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) | Only one transaction allowed |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **Best Time to Buy and Sell Stock II** | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/) | Unlimited transactions |
| **Best Time to Buy and Sell Stock with Transaction Fee** | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/) | Fee per transaction |
| **Best Time to Buy and Sell Stock with Cooldown** | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/) | 1-day cooldown |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **Best Time to Buy and Sell Stock III** | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/) | At most 2 transactions |
| **Best Time to Buy and Sell Stock IV** | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/) | At most k transactions |

---

## Video Tutorial Links

1. [Best Time to Buy and Sell Stock II - NeetCode](https://www.youtube.com/watch?v=3SJ3pikPQRE) - Greedy approach explained
2. [Stock Trading Problems - Back To Back SWE](https://www.youtube.com/watch?v=JaosdXkUJBg) - All stock problems
3. [Greedy Algorithms - Abdul Bari](https://www.youtube.com/watch?v=HzeK7g8cD4U) - General greedy concepts
4. [DP for Stock Problems](https://www.youtube.com/watch?v=0M_kIqhwbFo) - When DP is needed

---

## Summary

### Key Takeaways

1. **Sum all positive differences** - Each upward movement is a profit opportunity
2. **Greedy is optimal for unlimited transactions** - Taking every profit yields max total
3. **O(n) time, O(1) space** - Very efficient solution
4. **Variations require DP** - Fees, cooldowns, transaction limits need state tracking
5. **Peak-valley intuition** - Buying at local minima and selling at local maxima

### Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| **Using DP when greedy suffices** | For unlimited transactions, greedy is simpler and faster |
| **Wrong condition for positive diff** | Use `prices[i] > prices[i-1]`, not `>=` |
| **Forgetting empty array check** | Always handle empty/null prices array |
| **Confusing with single transaction** | Stock I (1 transaction) uses different approach |
| **Wrong state transitions in DP variants** | Carefully track cash vs hold states |

### Follow-up Questions

**Q1: Why does greedy work for unlimited transactions but not for limited transactions?**

With unlimited transactions, there's no opportunity cost - taking a profit now doesn't prevent future profits. With limited transactions (e.g., at most 2), you must decide which transactions are most valuable, requiring DP to compare options.

**Q2: How do you solve with transaction fee?**

Use two states: `cash` (no stock) and `hold` (have stock). Update: `cash = max(cash, hold + price - fee)` and `hold = max(hold, cash - price)`.

**Q3: What's the difference between this and Stock I (single transaction)?**

Stock I requires finding the maximum single (buy, sell) pair. Use min price tracking: `min_price = min(min_price, price)` and `max_profit = max(max_profit, price - min_price)`.

**Q4: How do you solve with cooldown (1-day wait after selling)?**

Use three states: `hold`, `sold`, `rest`. Transitions:
- `hold[i] = max(hold[i-1], rest[i-1] - price[i])`
- `sold[i] = hold[i-1] + price[i]`
- `rest[i] = max(rest[i-1], sold[i-1])`

---

## Pattern Source

For more greedy and DP patterns, see:
- **[DP - Stock Problems](/patterns/dp-stock-problems)**
- **[Greedy - Gas Station](/patterns/greedy-gas-station-circuit)**
- **[Greedy - Task Scheduling](/patterns/greedy-task-scheduling-frequency-based)**
- **[Greedy - Sorting Based](/patterns/greedy-sorting-based)**

---

## Additional Resources

- [LeetCode Best Time to Buy and Sell Stock II](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/)
- [GeeksforGeeks Stock Buy Sell](https://www.geeksforgeeks.org/stock-buy-sell/)
- [Greedy Algorithms Guide](https://www.geeksforgeeks.org/greedy-algorithms/)
- [Stock Problems Pattern](https://leetcode.com/discuss/general-discussion/657507/stock-problems-pattern)
