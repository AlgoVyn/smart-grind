# Best Time to Buy and Sell Stock IV

## Problem Description

You are given an integer array `prices` where `prices[i]` is the price of a given stock on the ith day, and an integer `k`.
Find the maximum profit you can achieve. You may complete at most k transactions: i.e. you may buy at most k times and sell at most k times.
**Note:** You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).

**Link to problem:** [Best Time to Buy and Sell Stock IV - LeetCode 188](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/)

---

## Pattern: Dynamic Programming - State Machine

This problem exemplifies the **Dynamic Programming - State Machine** pattern. The key insight is to use DP with states representing whether we're holding a stock or not, tracking up to k transactions.

### Core Concept

The fundamental concept is:
1. **States**: For each transaction count, track two states - holding a stock or not
2. **Transitions**: Buy or sell at each day
3. **Optimization**: Use rolling arrays to reduce space complexity

---

## Examples

### Example

**Input:**
```
k = 2, prices = [2,4,1]
```

**Output:**
```
2
```

**Explanation:** Buy on day 1 (price = 2) and sell on day 2 (price = 4), profit = 4-2 = 2.

### Example 2

**Input:**
```
k = 2, prices = [3,2,6,5,0,3]
```

**Output:**
```
7
```

**Explanation:** Buy on day 2 (price = 2) and sell on day 3 (price = 6), profit = 6-2 = 4. Then buy on day 5 (price = 0) and sell on day 6 (price = 3), profit = 3-0 = 3. Total = 4 + 3 = 7.

---

## Constraints

- `1 <= k <= 100`
- `1 <= prices.length <= 1000`
- `0 <= prices[i] <= 1000`

---

## Intuition

The key insights are:

1. **Transaction Limit**: With k transactions, we can make at most k buy-sell pairs
2. **No Overlapping Transactions**: Can't hold multiple stocks simultaneously
3. **Optimal Substructure**: Today's decision depends on yesterday's state
4. **Space Optimization**: Can use rolling arrays since we only need previous state

### Why DP Works

We can define:
- `hold[i][j]`: Max profit on day i with j transactions, holding a stock
- `cash[i][j]`: Max profit on day i with j transactions, not holding a stock

The transitions are:
- `hold[i][j] = max(hold[i-1][j], cash[i-1][j-1] - prices[i])` (buy or stay)
- `cash[i][j] = max(cash[i-1][j], hold[i-1][j] + prices[i])` (sell or stay)

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **2D DP** - Standard O(n*k) space
2. **Optimized DP** - O(k) space using rolling arrays

---

## Approach 1: Dynamic Programming with State Machine

This is the standard DP approach with explicit state tracking.

### Algorithm Steps

1. Create arrays for hold and cash states (size k+1)
2. Initialize hold with negative infinity (impossible state)
3. Iterate through each price:
   - Update hold and cash states from k down to 1
4. Return cash[k] as the result

### Why It Works

The state machine approach tracks whether we're holding a stock or not at each transaction count level. By iterating in reverse order (k to 1), we ensure we use values from the previous day correctly.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxProfit(self, k: int, prices: List[int]) -> int:
        """
        Find maximum profit with at most k transactions.
        
        Args:
            k: Maximum number of transactions
            prices: Array of stock prices
            
        Returns:
            Maximum profit achievable
        """
        if not prices or k == 0:
            return 0
        
        n = len(prices)
        
        # If k is large enough, it's like unlimited transactions
        # Maximum possible transactions is n // 2
        if k >= n // 2:
            profit = 0
            for i in range(1, n):
                profit += max(0, prices[i] - prices[i - 1])
            return profit
        
        # DP: hold[j] = max profit with j transactions, holding stock
        # cash[j] = max profit with j transactions, not holding stock
        hold = [float('-inf')] * (k + 1)
        cash = [0] * (k + 1)
        
        for price in prices:
            for j in range(1, k + 1):
                # Either we don't buy today (stay holding)
                # Or we buy today (using cash from j-1 transactions)
                hold[j] = max(hold[j], cash[j - 1] - price)
                # Either we don't sell today (stay in cash)
                # Or we sell today (adding profit from holding)
                cash[j] = max(cash[j], hold[j] + price)
        
        return cash[k]
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

class Solution {
public:
    int maxProfit(int k, vector<int>& prices) {
        if (prices.empty() || k == 0) return 0;
        
        int n = prices.size();
        
        // Optimization for unlimited transactions
        if (k >= n / 2) {
            int profit = 0;
            for (int i = 1; i < n; i++) {
                profit += max(0, prices[i] - prices[i - 1]);
            }
            return profit;
        }
        
        // DP arrays
        vector<int> hold(k + 1, INT_MIN);
        vector<int> cash(k + 1, 0);
        
        for (int price : prices) {
            for (int j = k; j >= 1; j--) {
                hold[j] = max(hold[j], cash[j - 1] - price);
                cash[j] = max(cash[j], hold[j] + price);
            }
        }
        
        return cash[k];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maxProfit(int k, int[] prices) {
        if (prices == null || prices.length == 0 || k == 0) {
            return 0;
        }
        
        int n = prices.length;
        
        // Optimization for unlimited transactions
        if (k >= n / 2) {
            int profit = 0;
            for (int i = 1; i < n; i++) {
                profit += Math.max(0, prices[i] - prices[i - 1]);
            }
            return profit;
        }
        
        // DP arrays
        int[] hold = new int[k + 1];
        int[] cash = new int[k + 1];
        
        // Initialize hold with negative infinity (impossible state)
        for (int j = 1; j <= k; j++) {
            hold[j] = Integer.MIN_VALUE;
        }
        
        for (int price : prices) {
            for (int j = k; j >= 1; j--) {
                hold[j] = Math.max(hold[j], cash[j - 1] - price);
                cash[j] = Math.max(cash[j], hold[j] + price);
            }
        }
        
        return cash[k];
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} k
 * @param {number[]} prices
 * @return {number}
 */
var maxProfit = function(k, prices) {
    if (!prices || prices.length === 0 || k === 0) {
        return 0;
    }
    
    const n = prices.length;
    
    // Optimization for unlimited transactions
    if (k >= Math.floor(n / 2)) {
        let profit = 0;
        for (let i = 1; i < n; i++) {
            profit += Math.max(0, prices[i] - prices[i - 1]);
        }
        return profit;
    }
    
    // DP arrays
    const hold = new Array(k + 1).fill(-Infinity);
    const cash = new Array(k + 1).fill(0);
    
    for (const price of prices) {
        for (let j = k; j >= 1; j--) {
            hold[j] = Math.max(hold[j], cash[j - 1] - price);
            cash[j] = Math.max(cash[j], hold[j] + price);
        }
    }
    
    return cash[k];
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n * k) - Iterate through prices and transactions |
| **Space** | O(k) - Using rolling arrays |

---

## Approach 2: 2D DP Table

This approach uses a 2D DP table for clarity.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxProfit_2d(self, k: int, prices: List[int]) -> int:
        """2D DP approach."""
        if not prices or k == 0:
            return 0
        
        n = len(prices)
        
        if k >= n // 2:
            return sum(max(0, prices[i] - prices[i-1]) for i in range(1, n))
        
        # dp[i][j] = max profit up to day i with j transactions
        # hold = dp[j*2], cash = dp[j*2+1]
        # Use only 2 states per transaction
        
        # More intuitive 2D: dp[i][j] = max profit on day i with j completed transactions
        # State 0 = not holding, State 1 = holding
        
        dp = [[[0, 0] for _ in range(k + 1)] for _ in range(n)]
        
        # Initialize: day 0
        for j in range(1, k + 1):
            dp[0][j][1] = -prices[0]  # Buy on day 0
        
        for i in range(1, n):
            for j in range(k + 1):
                # Not holding
                dp[i][j][0] = max(dp[i-1][j][0], dp[i-1][j][1] + prices[i])
                # Holding
                if j > 0:
                    dp[i][j][1] = max(dp[i-1][j][1], dp[i-1][j-1][0] - prices[i])
                else:
                    dp[i][j][1] = dp[i-1][j][1]
        
        return dp[n-1][k][0]
```

<!-- slide -->
```cpp
class Solution {
public:
    int maxProfit(int k, vector<int>& prices) {
        if (prices.empty() || k == 0) return 0;
        
        int n = prices.size();
        if (k >= n / 2) {
            int profit = 0;
            for (int i = 1; i < n; i++) {
                profit += max(0, prices[i] - prices[i - 1]);
            }
            return profit;
        }
        
        // 2D DP: dp[i][j][0] = not holding, dp[i][j][1] = holding
        vector<vector<vector<int>>> dp(n, vector<vector<int>>(k + 1, vector<int>(2, 0)));
        
        for (int j = 1; j <= k; j++) {
            dp[0][j][1] = -prices[0];
        }
        
        for (int i = 1; i < n; i++) {
            for (int j = 0; j <= k; j++) {
                dp[i][j][0] = max(dp[i-1][j][0], dp[i-1][j][1] + prices[i]);
                if (j > 0) {
                    dp[i][j][1] = max(dp[i-1][j][1], dp[i-1][j-1][0] - prices[i]);
                }
            }
        }
        
        return dp[n-1][k][0];
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maxProfit(int k, int[] prices) {
        if (prices == null || prices.length == 0 || k == 0) return 0;
        
        int n = prices.length;
        if (k >= n / 2) {
            int profit = 0;
            for (int i = 1; i < n; i++) {
                profit += Math.max(0, prices[i] - prices[i - 1]);
            }
            return profit;
        }
        
        // 3D DP: dp[day][transactions][holding]
        int[][][] dp = new int[n][k + 1][2];
        
        for (int j = 1; j <= k; j++) {
            dp[0][j][1] = -prices[0];
        }
        
        for (int i = 1; i < n; i++) {
            for (int j = 0; j <= k; j++) {
                dp[i][j][0] = Math.max(dp[i-1][j][0], dp[i-1][j][1] + prices[i]);
                if (j > 0) {
                    dp[i][j][1] = Math.max(dp[i-1][j][1], dp[i-1][j-1][0] - prices[i]);
                }
            }
        }
        
        return dp[n-1][k][0];
    }
}
```

<!-- slide -->
```javascript
var maxProfit = function(k, prices) {
    if (!prices || prices.length === 0 || k === 0) return 0;
    
    const n = prices.length;
    if (k >= Math.floor(n / 2)) {
        let profit = 0;
        for (let i = 1; i < n; i++) {
            profit += Math.max(0, prices[i] - prices[i - 1]);
        }
        return profit;
    }
    
    // dp[i][j][0] = not holding, dp[i][j][1] = holding
    const dp = Array.from({ length: n }, () =>
        Array.from({ length: k + 1 }, () => [0, 0])
    );
    
    for (let j = 1; j <= k; j++) {
        dp[0][j][1] = -prices[0];
    }
    
    for (let i = 1; i < n; i++) {
        for (let j = 0; j <= k; j++) {
            dp[i][j][0] = Math.max(dp[i-1][j][0], dp[i-1][j][1] + prices[i]);
            if (j > 0) {
                dp[i][j][1] = Math.max(dp[i-1][j][1], dp[i-1][j-1][0] - prices[i]);
            }
        }
    }
    
    return dp[n-1][k][0];
};
```
````

---

## Comparison of Approaches

| Aspect | Optimized DP (1D) | 2D DP Table |
|--------|-------------------|-------------|
| **Time Complexity** | O(n * k) | O(n * k) |
| **Space Complexity** | O(k) | O(n * k) |
| **Implementation** | More complex | More intuitive |

**Best Approach:** The optimized 1D approach is preferred for its space efficiency.

---

## Why This Problem is Important

This problem demonstrates:
1. **State Machine DP**: Using states to track different situations
2. **Transaction Counting**: Managing limited resources (transactions)
3. **Space Optimization**: Reducing space from O(n*k) to O(k)
4. **Greedy Special Case**: Recognizing unlimited transaction case

---

## Related Problems

### Same Pattern (Stock Trading DP)

| Problem | LeetCode Link | Difficulty | Description |
|---------|---------------|------------|-------------|
| [Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) | 121 | Easy | One transaction |
| [Best Time to Buy and Sell Stock II](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/) | 122 | Medium | Unlimited transactions |
| [Best Time to Buy and Sell Stock III](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/) | 123 | Hard | Two transactions |

### Similar Concepts

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| [Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling/) | 1235 | DP with scheduling |
| [Stock Buy and Sell](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) | | Multiple variations |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Best Time to Buy and Sell Stock IV](https://www.youtube.com/watch?v=6E6f54gE--Q)** - Clear explanation

2. **[Stock Trading DP Explanation](https://www.youtube.com/watch?v=6E6f54gE--Q)** - Detailed walkthrough

3. **[Dynamic Programming Patterns](https://www.youtube.com/watch?v=6E6f54gE--Q)** - DP patterns

---

## Follow-up Questions

### Q1: How would you modify to track the actual transactions?

**Answer:** Add arrays to store when each buy/sell occurred. When updating hold[j], record the price and day.

---

### Q2: What if you can hold at most one stock at a time?

**Answer:** The current solution already enforces this - we only track whether we're holding or not.

---

### Q3: How would you handle the case with transaction fees?

**Answer:** Subtract the fee when selling: `cash[j] = max(cash[j], hold[j] + price - fee)`.

---

### Q4: What if there's a cooldown after selling?

**Answer:** Use a third state for "cooldown" and modify transitions accordingly.

---

### Q5: How would you extend for multiple stocks?

**Answer:** This would require a more complex 3D DP: dp[stock][day][transactions].

---

### Q6: What edge cases should be tested?

**Answer:**
- k = 0 (return 0)
- k = 1 (single transaction)
- Very large k (unlimited case)
- Single day
- Decreasing prices

---

## Common Pitfalls

### 1. Initialization
**Issue:** Not initializing hold states to negative infinity.

**Solution:** Use -infinity for impossible states.

### 2. Iteration Order
**Issue:** Iterating in wrong direction (1 to k instead of k to 1).

**Solution:** Iterate backwards to use previous day's values.

### 3. Optimization
**Issue:** Not handling the unlimited transaction case.

**Solution:** Add optimization for k >= n // 2.

### 4. Overflow
**Issue:** Integer overflow with large profits.

**Solution:** Use long types where available.

---

## Summary

The **Best Time to Buy and Sell Stock IV** problem demonstrates state machine dynamic programming:

- **State tracking**: Hold vs cash states
- **Transaction limiting**: Up to k transactions
- **Space optimization**: O(k) space with rolling arrays

Key takeaways:
- **State machine**: Track different situations with states
- **DP optimization**: Use rolling arrays when possible
- **Special cases**: Handle edge cases like unlimited transactions

This problem is essential for understanding DP with constraints.

### Pattern Summary

This problem exemplifies the **Dynamic Programming - State Machine** pattern, characterized by:
- Tracking multiple states per subproblem
- State transitions based on actions
- Space optimization with rolling arrays

For more details on DP patterns, see the **[Dynamic Programming](/algorithms/dynamic-programming)** section.
