# Best Time to Buy and Sell Stock III

## Problem Description

You are given an array `prices` where `prices[i]` is the price of a given stock on the ith day.

Find the maximum profit you can achieve. You may complete at most two transactions.

**Note:** You may not engage in multiple transactions simultaneously (i.e., you must sell the stock before you buy again).

**Note:** This is LeetCode Problem 123. You can find the original problem [here](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/).

---

## Examples

### Example

**Input:**
```python
prices = [3,3,5,0,0,3,1,4]
```

**Output:**
```python
6
```

**Explanation:** 
- Buy on day 4 (price = 0) and sell on day 6 (price = 3), profit = 3-0 = 3.
- Then buy on day 7 (price = 1) and sell on day 8 (price = 4), profit = 4-1 = 3.
- Total profit = 3 + 3 = 6.

### Example 2

**Input:**
```python
prices = [1,2,3,4,5]
```

**Output:**
```python
4
```

**Explanation:** Buy on day 1 (price = 1) and sell on day 5 (price = 5), profit = 5-1 = 4. Note that you cannot buy on day 1, buy on day 2 and sell them later, as you are engaging multiple transactions at the same time. You must sell before buying again.

### Example 3

**Input:**
```python
prices = [7,6,4,3,1]
```

**Output:**
```python
0
```

**Explanation:** In this case, no transaction is done, i.e. max profit = 0. Prices only decrease, so no profitable transactions.

---

## Constraints

- `1 <= prices.length <= 10^5`
- `0 <= prices[i] <= 10^5`

---

## Pattern: Dynamic Programming (State Machine)

This problem is a classic example of **Dynamic Programming** using a **State Machine**. The key insight is to track the maximum profit at each state for up to two transactions.

### Core Concept

- **Four States sell1, buy2, sell2**: buy1,
- **State Transitions**: At each price, decide whether to buy or sell
- **Single Pass**: O(n) time with O(1) space
- **Optimal Substructure**: Current state depends only on previous states

---

## Intuition

The key insight for this problem is understanding how to track maximum profit for up to two transactions.

### Key Observations

1. **Two Transactions Maximum**: We can complete at most 2 buy-sell cycles

2. **State Machine**: At any point, we can be in one of four states:
   - After first buy
   - After first sell
   - After second buy
   - After second sell

3. **Order Matters**: We must complete first transaction before starting second

4. **Optimal Substructure**: The best decision at each step depends only on previous best values

5. **Single Pass**: We can update all states in one pass through prices

### Algorithm Overview

1. Initialize four variables: buy1, sell1, buy2, sell2
2. For each price:
   - Update buy1: max of current buy1 or buying at this price
   - Update sell1: max of current sell1 or selling after first buy
   - Update buy2: max of current buy2 or buying after first sell
   - Update sell2: max of current sell2 or selling after second buy
3. Return sell2 (max profit after up to two transactions)

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Dynamic Programming (State Machine)** - Optimal solution
2. **Divide and Conquer** - Alternative approach

---

## Approach 1: Dynamic Programming (State Machine) - Optimal

### Algorithm Steps

1. Initialize:
   - buy1 = -prices[0] (max profit after first buy, negative because we're spending)
   - sell1 = 0 (max profit after first sell)
   - buy2 = -prices[0] (max profit after second buy)
   - sell2 = 0 (max profit after second sell)

2. For each price:
   - buy1 = max(buy1, -price) - best state after first buy
   - sell1 = max(sell1, buy1 + price) - best after first sell
   - buy2 = max(buy2, sell1 - price) - best after second buy
   - sell2 = max(sell2, buy2 + price) - best after second sell

3. Return sell2

### Why It Works

This DP approach works because:
- Each state represents the maximum profit achievable at that point
- Updating in order ensures we don't use future information
- The negative values for "buy" states represent money spent
- At the end, sell2 represents max profit with up to 2 transactions

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        """
        Find max profit with at most two transactions using DP.
        
        Args:
            prices: List of stock prices
            
        Returns:
            Maximum profit
        """
        if not prices:
            return 0
        
        # Initialize states
        buy1 = buy2 = float('-inf')
        sell1 = sell2 = 0
        
        # Process each price
        for price in prices:
            # First transaction states
            buy1 = max(buy1, -price)  # Best after first buy
            sell1 = max(sell1, buy1 + price)  # Best after first sell
            
            # Second transaction states
            buy2 = max(buy2, sell1 - price)  # Best after second buy
            sell2 = max(sell2, buy2 + price)  # Best after second sell
        
        return sell2
```

<!-- slide -->
```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        if (prices.empty()) return 0;
        
        // Initialize states
        int buy1 = -prices[0], sell1 = 0;
        int buy2 = -prices[0], sell2 = 0;
        
        // Process each price
        for (int i = 1; i < prices.size(); i++) {
            int price = prices[i];
            
            // First transaction states
            buy1 = max(buy1, -price);
            sell1 = max(sell1, buy1 + price);
            
            // Second transaction states
            buy2 = max(buy2, sell1 - price);
            sell2 = max(sell2, buy2 + price);
        }
        
        return sell2;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maxProfit(int[] prices) {
        if (prices == null || prices.length == 0) return 0;
        
        // Initialize states
        int buy1 = -prices[0], sell1 = 0;
        int buy2 = -prices[0], sell2 = 0;
        
        // Process each price
        for (int i = 1; i < prices.length; i++) {
            int price = prices[i];
            
            // First transaction states
            buy1 = Math.max(buy1, -price);
            sell1 = Math.max(sell1, buy1 + price);
            
            // Second transaction states
            buy2 = Math.max(buy2, sell1 - price);
            sell2 = Math.max(sell2, buy2 + price);
        }
        
        return sell2;
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
    
    // Initialize states
    let buy1 = -prices[0], sell1 = 0;
    let buy2 = -prices[0], sell2 = 0;
    
    // Process each price
    for (let i = 1; i < prices.length; i++) {
        const price = prices[i];
        
        // First transaction states
        buy1 = Math.max(buy1, -price);
        sell1 = Math.max(sell1, buy1 + price);
        
        // Second transaction states
        buy2 = Math.max(buy2, sell1 - price);
        sell2 = Math.max(sell2, buy2 + price);
    }
    
    return sell2;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - single pass through prices |
| **Space** | O(1) - four variables only |

---

## Approach 2: Divide and Conquer

### Algorithm Steps

1. Find the best profit for first transaction (left side)
2. Find the best profit for second transaction (right side)
3. Combine results: max of left[i] + right[i] for all i

### Why It Works

The divide and conquer approach works because:
- Split the array at some point
- First transaction happens entirely on left side
- Second transaction happens entirely on right side
- Try all split points and take maximum

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        """Using divide and conquer approach."""
        if not prices:
            return 0
        
        n = len(prices)
        
        # Calculate max profit for left side (first transaction)
        left = [0] * n
        min_price = prices[0]
        for i in range(1, n):
            left[i] = max(left[i-1], prices[i] - min_price)
            min_price = min(min_price, prices[i])
        
        # Calculate max profit for right side (second transaction)
        right = [0] * n
        max_price = prices[-1]
        for i in range(n-2, -1, -1):
            right[i] = max(right[i+1], max_price - prices[i])
            max_price = max(max_price, prices[i])
        
        # Combine: max of left + right at each point
        max_profit = 0
        for i in range(n):
            max_profit = max(max_profit, left[i] + right[i])
        
        return max_profit
```

<!-- slide -->
```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        if (prices.empty()) return 0;
        
        int n = prices.size();
        
        // Left side
        vector<int> left(n, 0);
        int minPrice = prices[0];
        for (int i = 1; i < n; i++) {
            left[i] = max(left[i-1], prices[i] - minPrice);
            minPrice = min(minPrice, prices[i]);
        }
        
        // Right side
        vector<int> right(n, 0);
        int maxPrice = prices[n-1];
        for (int i = n-2; i >= 0; i--) {
            right[i] = max(right[i+1], maxPrice - prices[i]);
            maxPrice = max(maxPrice, prices[i]);
        }
        
        // Combine
        int maxProfit = 0;
        for (int i = 0; i < n; i++) {
            maxProfit = max(maxProfit, left[i] + right[i]);
        }
        
        return maxProfit;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maxProfit(int[] prices) {
        if (prices == null || prices.length == 0) return 0;
        
        int n = prices.length;
        
        // Left side
        int[] left = new int[n];
        int minPrice = prices[0];
        for (int i = 1; i < n; i++) {
            left[i] = Math.max(left[i-1], prices[i] - minPrice);
            minPrice = Math.min(minPrice, prices[i]);
        }
        
        // Right side
        int[] right = new int[n];
        int maxPrice = prices[n-1];
        for (int i = n-2; i >= 0; i--) {
            right[i] = Math.max(right[i+1], maxPrice - prices[i]);
            maxPrice = Math.max(maxPrice, prices[i]);
        }
        
        // Combine
        int maxProfit = 0;
        for (int i = 0; i < n; i++) {
            maxProfit = Math.max(maxProfit, left[i] + right[i]);
        }
        
        return maxProfit;
    }
}
```

<!-- slide -->
```javascript
var maxProfit = function(prices) {
    if (!prices || prices.length === 0) return 0;
    
    const n = prices.length;
    
    // Left side
    const left = new Array(n).fill(0);
    let minPrice = prices[0];
    for (let i = 1; i < n; i++) {
        left[i] = Math.max(left[i-1], prices[i] - minPrice);
        minPrice = Math.min(minPrice, prices[i]);
    }
    
    // Right side
    const right = new Array(n).fill(0);
    let maxPrice = prices[n-1];
    for (let i = n-2; i >= 0; i--) {
        right[i] = Math.max(right[i+1], maxPrice - prices[i]);
        maxPrice = Math.max(maxPrice, prices[i]);
    }
    
    // Combine
    let maxProfit = 0;
    for (let i = 0; i < n; i++) {
        maxProfit = Math.max(maxProfit, left[i] + right[i]);
    }
    
    return maxProfit;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - two passes + combination |
| **Space** | O(n) - for left and right arrays |

---

## Comparison of Approaches

| Aspect | State Machine DP | Divide & Conquer |
|--------|------------------|-------------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(1) | O(n) |
| **Implementation** | Elegant | More intuitive |
| **LeetCode Optimal** | ✅ | ✅ |
| **Difficulty** | Medium | Medium |

**Best Approach:** Use Approach 1 (State Machine DP) for O(1) space.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Facebook, Amazon, Microsoft
- **Difficulty**: Hard
- **Concepts Tested**: Dynamic Programming, State Machine, Optimization

### Learning Outcomes

1. **DP Mastery**: Learn state-based dynamic programming
2. **State Machine**: Understand state transitions
3. **Space Optimization**: Reduce from O(n) to O(1)
4. **Stock Problems**: Foundation for stock series problems

---

## Related Problems

Based on similar themes (dynamic programming, stock trading):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Best Time to Buy and Sell Stock | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) | Single transaction |
| Best Time to Buy and Sell Stock II | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/) | Unlimited transactions |
| Best Time to Buy and Sell Stock IV | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/) | k transactions |
| Best Time to Buy and Sell Stock with Cooldown | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/) | With cooldown |

### Pattern Reference

For more detailed explanations of Dynamic Programming, see:
- **[Dynamic Programming](/patterns/dynamic-programming)**

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Best Time to Buy and Sell Stock III](https://www.youtube.com/watch?v=3E97W3hK1QE)** - Clear explanation
2. **[Stock III - LeetCode 123](https://www.youtube.com/watch?v=oDenh5p3w9I)** - Detailed walkthrough

---

## Follow-up Questions

### Q1: How would you extend this to k transactions?

**Answer:** Use arrays of size k+1 for buy and sell states. The time complexity becomes O(n*k) and space O(k).

### Q2: How would you handle with cooldown between transactions?

**Answer:** Add another state for "cooldown" where you cannot buy immediately after selling. Use 5 states instead of 4.

### Q3: What if you can hold at most one stock at a time?

**Answer:** The current solution already handles this - we can only buy after selling.

### Q4: How would you handle transaction fees?

**Answer:** Subtract the transaction fee from the profit when selling. Modify sell states to account for fees.

### Q5: Can you solve with O(1) space for k transactions?

**Answer:** For k=2, yes. For general k, you'd need O(k) space.

---

## Common Pitfalls

### 1. Not Initializing Correctly
**Issue:** Wrong initial values for buy states.

**Solution:** Initialize buy1 and buy2 to -prices[0] (negative because we spend money).

### 2. Wrong Update Order
**Issue:** Updating states in wrong order causing data dependency.

**Solution:** Update buy1 → sell1 → buy2 → sell2 in that order.

### 3. Missing Edge Cases
**Issue:** Not handling empty prices array.

**Solution:** Check for empty array and return 0.

### 4. Integer Overflow
**Issue:** Large prices causing overflow in some languages.

**Solution:** Use appropriate data types (Python handles big ints automatically).

### 5. Wrong Return Value
**Issue:** Returning wrong state variable.

**Solution:** Return sell2, not sell1 or buy2.

---

## Summary

The **Best Time to Buy and Sell Stock III** problem demonstrates **Dynamic Programming with State Machine**:

- **Four States**: buy1, sell1, buy2, sell2
- **State Transitions**: Update in order at each price
- **Single Pass**: O(n) time with O(1) space
- **Optimal**: Perfect for up to 2 transactions

Key takeaways:
1. Track maximum profit at each state
2. Update in correct order to avoid using future info
3. Return sell2 as final answer
4. Can extend to k transactions

This pattern extends to:
- Stock series problems (I, II, IV, with cooldown)
- Transaction problems with constraints
- Optimization problems with limited resources

---

## Additional Resources

- [LeetCode Problem 123](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/) - Official problem page
- [Dynamic Programming - GeeksforGeeks](https://www.geeksforgeeks.org/dynamic-programming/) - DP explanations
- [Pattern: Dynamic Programming](/patterns/dynamic-programming) - Comprehensive pattern guide
