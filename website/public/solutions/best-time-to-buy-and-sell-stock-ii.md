# Best Time To Buy And Sell Stock II

## Problem Description

You are given an integer array `prices` where `prices[i]` is the price of a given stock on the ith day.
On each day, you may decide to buy and/or sell the stock. You can only hold at most one share of the stock at any time. However, you can sell and buy the stock multiple times on the same day, ensuring you never hold more than one share of the stock.
Find and return the maximum profit you can achieve.

**Link to problem:** [Best Time to Buy and Sell Stock II - LeetCode 122](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/)

---

## Pattern: Greedy - Maximum Profit with Multiple Transactions

This problem exemplifies the **Greedy - Maximum Profit with Multiple Transactions** pattern. The key insight is that for problems where we can make unlimited transactions, we can simply capture every upward price movement to maximize profit.

### Core Concept

The fundamental greedy principle is:
- **Capture Every Gain**: If the price tomorrow is higher than today, buy today and sell tomorrow
- **Accumulate Profits**: Sum up all positive price differences

This works because:
1. We can make unlimited transactions
2. There's no transaction cost or cooldown period
3. Holding stock overnight has no penalty

---

## Examples

### Example

**Input:**
```
prices = [7,1,5,3,6,4]
```

**Output:**
```
7
```

**Explanation:** Buy on day 2 (price = 1) and sell on day 3 (price = 5), profit = 5-1 = 4.
Then buy on day 4 (price = 3) and sell on day 5 (price = 6), profit = 6-3 = 3.
Total profit is 4 + 3 = 7.

### Example 2

**Input:**
```
prices = [1,2,3,4,5]
```

**Output:**
```
4
```

**Explanation:** Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit = 5-1 = 4.
Total profit is 4.

### Example 3

**Input:**
```
prices = [7,6,4,3,1]
```

**Output:**
```
0
```

**Explanation:** There is no way to make a positive profit, so we never buy the stock to achieve the maximum profit of 0.

---

## Constraints

- `1 <= prices.length <= 3 × 10^4`
- `-10^4 <= prices[i] <= 10^4`
- At most one share can be held at a time
- Multiple transactions are allowed

---

## Intuition

The key insight is that we don't need to find the global buy/sell points. Instead, we can adopt a greedy strategy:

1. **Local Optima**: If `prices[i+1] > prices[i]`, we gain by buying at day i and selling at day i+1
2. **Cumulative Gains**: By capturing every positive difference, we get the same profit as any complex multi-day transaction
3. **Optimal Substructure**: The problem has optimal substructure - the profit from multiple transactions equals the sum of individual transaction profits

### Visual Example

For `prices = [7,1,5,3,6,4]`:

```
Day 1: 7 → Day 2: 1 (decrease, skip)
Day 2: 1 → Day 3: 5 (increase, gain = 4) ✓
Day 3: 5 → Day 4: 3 (decrease, skip)
Day 4: 3 → Day 5: 6 (increase, gain = 3) ✓
Day 5: 6 → Day 6: 4 (decrease, skip)

Total Profit = 4 + 3 = 7
```

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Greedy with Single Pass** - Optimal O(n) time, O(1) space
2. **Valley-Peak Approach** - O(n) time, O(1) space
3. **Dynamic Programming** - O(n) time, O(n) space

---

## Approach 1: Greedy with Single Pass (Optimal)

This is the most efficient approach. We simply add up all positive price differences.

### Algorithm Steps

1. Initialize `profit = 0`
2. Iterate through the prices array from index 1 to n-1
3. For each day, if `prices[i] > prices[i-1]`, add the difference to profit
4. Return the total profit

### Why It Works

This greedy approach captures every upward price movement. Since we can make unlimited transactions, this is equivalent to buying at local valleys and selling at local peaks.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        """
        Calculate maximum profit using greedy single pass approach.
        
        Args:
            prices: List of stock prices for each day
            
        Returns:
            Maximum profit achievable
        """
        profit = 0
        for i in range(1, len(prices)):
            if prices[i] > prices[i - 1]:
                profit += prices[i] - prices[i - 1]
        return profit
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    /**
     * Calculate maximum profit using greedy single pass approach.
     * 
     * @param prices List of stock prices for each day
     * @return Maximum profit achievable
     */
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
import java.util.List;

class Solution {
    /**
     * Calculate maximum profit using greedy single pass approach.
     * 
     * @param prices List of stock prices for each day
     * @return Maximum profit achievable
     */
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
/**
 * Calculate maximum profit using greedy single pass approach.
 * 
 * @param {number[]} prices - List of stock prices for each day
 * @return {number} - Maximum profit achievable
 */
var maxProfit = function(prices) {
    let profit = 0;
    for (let i = 1; i < prices.length; i++) {
        if (prices[i] > prices[i - 1]) {
            profit += prices[i] - prices[i - 1];
        }
    }
    return profit;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through the prices array |
| **Space** | O(1) - Only one variable for profit |

---

## Approach 2: Valley-Peak Approach

This approach explicitly identifies local valleys and peaks, making the logic more explicit.

### Algorithm Steps

1. Initialize `profit = 0` and `i = 0`
2. Find local valley: while `i < n-1` and `prices[i] >= prices[i+1]`, increment i
3. Find local peak: while `i < n-1` and `prices[i] <= prices[i+1]`, increment i
4. Add `prices[peak] - prices[valley]` to profit
5. Repeat until end of array

### Why It Works

By identifying each valley-peak pair, we capture the profit from each transaction. This is mathematically equivalent to summing all positive differences.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxProfit_valley_peak(self, prices: List[int]) -> int:
        """
        Calculate maximum profit using valley-peak approach.
        
        Args:
            prices: List of stock prices for each day
            
        Returns:
            Maximum profit achievable
        """
        profit = 0
        i = 0
        n = len(prices)
        
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
#include <vector>
using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int profit = 0;
        int i = 0;
        int n = prices.size();
        
        while (i < n - 1) {
            // Find valley (local minimum)
            while (i < n - 1 && prices[i] >= prices[i + 1]) {
                i++;
            }
            int valley = prices[i];
            
            // Find peak (local maximum)
            while (i < n - 1 && prices[i] <= prices[i + 1]) {
                i++;
            }
            int peak = prices[i];
            
            profit += peak - valley;
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
        int i = 0;
        int n = prices.length;
        
        while (i < n - 1) {
            // Find valley (local minimum)
            while (i < n - 1 && prices[i] >= prices[i + 1]) {
                i++;
            }
            int valley = prices[i];
            
            // Find peak (local maximum)
            while (i < n - 1 && prices[i] <= prices[i + 1]) {
                i++;
            }
            int peak = prices[i];
            
            profit += peak - valley;
        }
        
        return profit;
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
    let profit = 0;
    let i = 0;
    const n = prices.length;
    
    while (i < n - 1) {
        // Find valley (local minimum)
        while (i < n - 1 && prices[i] >= prices[i + 1]) {
            i++;
        }
        const valley = prices[i];
        
        // Find peak (local maximum)
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

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each element is visited at most once |
| **Space** | O(1) - Only a few variables used |

---

## Approach 3: Dynamic Programming

This approach uses DP to track the maximum profit with and without holding a stock.

### Algorithm Steps

1. Create two variables: `hold` (profit when holding stock) and `cash` (profit when not holding)
2. For each price, update:
   - `cash = max(cash, hold + price)` - either stay in cash or sell
   - `hold = max(hold, -price)` - either hold or buy
3. Return `cash` as the final answer

### Why It Works

The DP approach models the problem as a state machine with two states: holding stock or not holding stock.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxProfit_dp(self, prices: List[int]) -> int:
        """
        Calculate maximum profit using dynamic programming.
        
        Args:
            prices: List of stock prices for each day
            
        Returns:
            Maximum profit achievable
        """
        if not prices:
            return 0
        
        cash = 0  # Max profit when not holding stock
        hold = -prices[0]  # Max profit when holding stock (bought at day 0)
        
        for price in prices[1:]:
            # Update cash: either stay in cash or sell the stock
            cash = max(cash, hold + price)
            # Update hold: either keep holding or buy new stock
            hold = max(hold, -price)
        
        return cash
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
        
        int cash = 0;  // Max profit when not holding stock
        int hold = -prices[0];  // Max profit when holding stock
        
        for (int i = 1; i < prices.size(); i++) {
            cash = max(cash, hold + prices[i]);
            hold = max(hold, -prices[i]);
        }
        
        return cash;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maxProfit(int[] prices) {
        if (prices == null || prices.length == 0) {
            return 0;
        }
        
        int cash = 0;  // Max profit when not holding stock
        int hold = -prices[0];  // Max profit when holding stock
        
        for (int i = 1; i < prices.length; i++) {
            cash = Math.max(cash, hold + prices[i]);
            hold = Math.max(hold, -prices[i]);
        }
        
        return cash;
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
    if (!prices || prices.length === 0) {
        return 0;
    }
    
    let cash = 0;  // Max profit when not holding stock
    let hold = -prices[0];  // Max profit when holding stock
    
    for (let i = 1; i < prices.length; i++) {
        cash = Math.max(cash, hold + prices[i]);
        hold = Math.max(hold, -prices[i]);
    }
    
    return cash;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through prices |
| **Space** | O(1) - Only two variables |

---

## Comparison of Approaches

| Aspect | Greedy Single Pass | Valley-Peak | Dynamic Programming |
|--------|-------------------|-------------|---------------------|
| **Time Complexity** | O(n) | O(n) | O(n) |
| **Space Complexity** | O(1) | O(1) | O(1) |
| **Implementation** | Simplest | Moderate | Moderate |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Best For** | Quick solution | Understanding concept | Extension to variations |

**Best Approach:** The greedy single-pass approach (Approach 1) is optimal with the simplest implementation.

---

## Why Greedy Works for This Problem

The greedy approach is optimal for this problem because:

1. **Unlimited Transactions**: Unlike Stock I (one transaction) or Stock III (two transactions), we can make unlimited transactions
2. **No Transaction Cost**: Each price difference can be captured independently
3. **Optimal Substructure**: The total profit equals the sum of individual transaction profits
4. **Local to Global**: Every local maximum (peak) can be captured without affecting future gains

---

## Related Problems

### Same Pattern (Stock Trading)

| Problem | LeetCode Link | Difficulty | Description |
|---------|---------------|------------|-------------|
| Best Time to Buy and Sell Stock | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) | Easy | At most one transaction |
| Best Time to Buy and Sell Stock III | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/) | Hard | At most two transactions |
| Best Time to Buy and Sell Stock IV | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/) | Hard | At most k transactions |
| Best Time to Buy and Sell Stock with Cooldown | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/) | Medium | With cooldown period |
| Best Time to Buy and Sell Stock with Transaction Fee | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/) | Medium | With transaction fee |

### Similar Greedy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Gas Station | [Link](https://leetcode.com/problems/gas-station/) | Greedy with circular array |
| Jump Game | [Link](https://leetcode.com/problems/jump-game/) | Greedy reachability |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Best Time to Buy and Sell Stock II](https://www.youtube.com/watch?v=0iRWy_8-2RQ)** - Clear explanation with visual examples

2. **[Back to Back SWE - Stock Buy Sell](https://www.youtube.com/watch?v=6i7XKq8qZ5w)** - Detailed walkthrough

3. **[Two Pointer & Greedy Technique](https://www.youtube.com/watch?v=1L2OiLDbJ6E)** - Understanding greedy patterns

4. **[LeetCode Official Solution](https://www.youtube.com/watch?v=8oWfD2aKf2w)** - Official problem solution

---

## Follow-up Questions

### Q1: What if there was a transaction fee for each transaction?

**Answer:** The greedy approach still works. Instead of adding `prices[i] - prices[i-1]` directly, you'd add `prices[i] - prices[i-1] - fee` only when it's positive after subtracting the fee. Alternatively, use the DP approach with an additional cost in the state transition.

---

### Q2: How would you modify the solution to handle the cooldown period?

**Answer:** With cooldown, you cannot buy immediately after selling. Use DP with three states: `hold`, `cash`, and `cooldown`. The transitions become more complex but the solution remains O(n) time and O(1) space.

---

### Q3: What if you could only make at most k transactions?

**Answer:** This is LeetCode 188 (Best Time to Buy and Sell Stock IV). Use DP with a 2D array where `dp[i][j]` represents max profit on day i with at most j transactions. For k > n/2, the greedy solution applies.

---

### Q4: Can you solve it in O(1) space without using greedy?

**Answer:** Yes, the DP approach with two variables (`cash` and `hold`) achieves O(1) space. The greedy solution is essentially the same as the DP solution since it satisfies the optimal substructure.

---

### Q5: What if you could only hold one share at a time and couldn't buy on the same day you sell?

**Answer:** The greedy solution still works because buying and selling on the same day gives zero profit (price difference would be 0 or negative). The valley-peak approach naturally handles this.

---

### Q6: How would you track the actual buy/sell days?

**Answer:** Modify the greedy approach to record days where `prices[i] > prices[i-1]`. For valley-peak, record the valley and peak indices. For DP, track state transitions.

---

### Q7: What edge cases should be tested?

**Answer:**
- Empty or single element array (return 0)
- Strictly decreasing prices (return 0)
- Strictly increasing prices (return max difference)
- All same prices (return 0)
- Two elements (either return 0 or positive difference)

---

### Q8: How would you extend this to handle multiple stocks?

**Answer:** The greedy approach naturally extends. Process each stock independently, or for portfolios, use the same logic on the sum of all stocks.

---

## Common Pitfalls

### 1. Missing Edge Cases
**Issue**: Not handling empty or single-element arrays.

**Solution**: The greedy approach naturally handles these (empty returns 0, single element can't make profit).

### 2. Overcomplicating
**Issue**: Trying to find global peaks and valleys when simple accumulation works.

**Solution**: Remember that summing all positive differences equals the valley-peak profit.

### 3. Transaction Counting
**Issue**: Not understanding that unlimited transactions are allowed.

**Solution**: This is the key difference from Stock I (one transaction) and Stock III (two transactions).

---

## Summary

The **Best Time to Buy and Sell Stock II** problem demonstrates the power of greedy algorithms when:
- Unlimited transactions are allowed
- There's no transaction cost or cooldown
- The optimal substructure allows local decisions to lead to global optimum

Key takeaways:
- **Greedy is optimal**: Simple O(n) single-pass solution
- **Accumulate gains**: Sum all positive price differences
- **Multiple approaches**: Greedy, valley-peak, and DP all work

This problem is an excellent example of how understanding problem constraints can lead to simple and elegant solutions.

### Pattern Summary

This problem exemplifies the **Greedy - Maximum Profit with Multiple Transactions** pattern, characterized by:
- Unlimited transactions allowed
- Capturing every upward price movement
- O(n) time and O(1) space solution

For more details on greedy patterns, see the **[Greedy Algorithms](/algorithms/greedy)** section.
