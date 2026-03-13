# Best Time To Buy And Sell Stock

## Problem Description

You are given an array `prices` where `prices[i]` is the price of a given stock on the ith day.
You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.
Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.

---

## Examples

**Example 1:**

**Input:**
```
prices = [7,1,5,3,6,4]
```

**Output:**
```
5
```

**Explanation:** Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.
Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.

---

**Example 2:**

**Input:**
```
prices = [7,6,4,3,1]
```

**Output:**
```
0
```

**Explanation:** In this case, no transactions are done and the max profit = 0.

---

## Constraints

- `1 <= prices.length <= 10^5`
- `0 <= prices[i] <= 10^4`

---

## Pattern:

This problem follows the **Single Pass Tracking** pattern, also known as the **Kadane's Algorithm Variant** for maximum subarray problems.

### Core Concept

- Track **minimum value** seen so far while iterating
- Calculate potential **maximum difference** at each step
- Ensure selling happens **after** buying (enforced by iteration order)

### When to Use This Pattern

This pattern is applicable when:
1. Finding maximum difference in an array where larger element comes after smaller
2. Problems requiring single-pass optimization
3. Stock trading problems with single transaction

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Kadane's Algorithm | Maximum subarray sum |
| Peak-Valley | Finding local minima/maxima |
| Sliding Window | Range-based optimization |

---

## Intuition

The key insight is that we need to find the maximum difference between two elements in the array where the larger element comes after the smaller element.

This can be solved efficiently in a single pass by:
1. Tracking the minimum price seen so far
2. At each day, calculating the potential profit if we sell on that day
3. Keeping track of the maximum profit seen

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Single Pass (Optimal)** - O(n) time, O(1) space
2. **Brute Force** - O(n²) time, O(1) space
3. **Peak-Valley Approach** - O(n) time, O(1) space

---

## Approach 1: Single Pass (Optimal)

This is the most efficient approach that finds the maximum profit in a single pass.

### Why It Works

By tracking the minimum price encountered so far and calculating the potential profit at each step, we can find the maximum profit in one pass through the array.

### Algorithm Steps

1. Initialize `min_price` to infinity and `max_profit` to 0
2. For each price in the array:
   - Update `min_price` if current price is lower
   - Calculate `profit` = current price - min_price
   - Update `max_profit` if this profit is higher
3. Return `max_profit`

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        """
        Find maximum profit from single transaction.
        
        Args:
            prices: List of stock prices
            
        Returns:
            Maximum profit possible
        """
        if not prices:
            return 0
        
        min_price = float('inf')
        max_profit = 0
        
        for price in prices:
            # Update minimum price if current price is lower
            if price < min_price:
                min_price = price
            # Calculate profit if we sell today
            elif price - min_price > max_profit:
                max_profit = price - min_price
        
        return max_profit
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
        
        int minPrice = INT_MAX;
        int maxProfit = 0;
        
        for (int price : prices) {
            if (price < minPrice) {
                minPrice = price;
            } else if (price - minPrice > maxProfit) {
                maxProfit = price - minPrice;
            }
        }
        
        return maxProfit;
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
        
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;
        
        for (int price : prices) {
            if (price < minPrice) {
                minPrice = price;
            } else if (price - minPrice > maxProfit) {
                maxProfit = price - minPrice;
            }
        }
        
        return maxProfit;
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
    
    let minPrice = Infinity;
    let maxProfit = 0;
    
    for (const price of prices) {
        if (price < minPrice) {
            minPrice = price;
        } else if (price - minPrice > maxProfit) {
            maxProfit = price - minPrice;
        }
    }
    
    return maxProfit;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass through the array |
| **Space** | O(1) - Only two variables used |

---

## Approach 2: Brute Force

This approach checks all possible buy-sell pairs.

### Why It Works

We can try all combinations of buy day and sell day where buy comes before sell, tracking the maximum profit.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxProfit_brute(self, prices: List[int]) -> int:
        """
        Find maximum profit using brute force.
        
        Args:
            prices: List of stock prices
            
        Returns:
            Maximum profit possible
        """
        max_profit = 0
        
        for i in range(len(prices)):
            for j in range(i + 1, len(prices)):
                profit = prices[j] - prices[i]
                if profit > max_profit:
                    max_profit = profit
        
        return max_profit
```

<!-- slide -->
```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int maxProfit = 0;
        
        for (int i = 0; i < prices.size(); i++) {
            for (int j = i + 1; j < prices.size(); j++) {
                maxProfit = max(maxProfit, prices[j] - prices[i]);
            }
        }
        
        return maxProfit;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maxProfit(int[] prices) {
        int maxProfit = 0;
        
        for (int i = 0; i < prices.length; i++) {
            for (int j = i + 1; j < prices.length; j++) {
                maxProfit = Math.max(maxProfit, prices[j] - prices[i]);
            }
        }
        
        return maxProfit;
    }
}
```

<!-- slide -->
```javascript
var maxProfit = function(prices) {
    let maxProfit = 0;
    
    for (let i = 0; i < prices.length; i++) {
        for (let j = i + 1; j < prices.length; j++) {
            maxProfit = Math.max(maxProfit, prices[j] - prices[i]);
        }
    }
    
    return maxProfit;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - Check all pairs |
| **Space** | O(1) - No extra space |

---

## Approach 3: Peak-Valley Approach

This approach identifies peaks and valleys in the price chart.

### Why It Works

The maximum profit can be found by summing all upward slopes between consecutive valleys and peaks. However, for a single transaction, we just need to find the largest upward slope.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def maxProfit_valley(self, prices: List[int]) -> int:
        """
        Find maximum profit using peak-valley approach.
        
        Args:
            prices: List of stock prices
            
        Returns:
            Maximum profit possible
        """
        if len(prices) < 2:
            return 0
        
        max_profit = 0
        valley = prices[0]
        
        for i in range(1, len(prices)):
            profit = prices[i] - valley
            if profit > max_profit:
                max_profit = profit
            if prices[i] < valley:
                valley = prices[i]
        
        return max_profit
```

<!-- slide -->
```cpp
class Solution {
public:
    int maxProfit(vector<int>& prices) {
        if (prices.size() < 2) return 0;
        
        int maxProfit = 0;
        int valley = prices[0];
        
        for (int i = 1; i < prices.size(); i++) {
            maxProfit = max(maxProfit, prices[i] - valley);
            valley = min(valley, prices[i]);
        }
        
        return maxProfit;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maxProfit(int[] prices) {
        if (prices.length < 2) return 0;
        
        int maxProfit = 0;
        int valley = prices[0];
        
        for (int i = 1; i < prices.length; i++) {
            maxProfit = Math.max(maxProfit, prices[i] - valley);
            valley = Math.min(valley, prices[i]);
        }
        
        return maxProfit;
    }
}
```

<!-- slide -->
```javascript
var maxProfit = function(prices) {
    if (prices.length < 2) return 0;
    
    let maxProfit = 0;
    let valley = prices[0];
    
    for (let i = 1; i < prices.length; i++) {
        maxProfit = Math.max(maxProfit, prices[i] - valley);
        valley = Math.min(valley, prices[i]);
    }
    
    return maxProfit;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Single pass |
| **Space** | O(1) - Only two variables |

---

## Comparison of Approaches

| Aspect | Single Pass | Brute Force | Peak-Valley |
|--------|-------------|-------------|-------------|
| **Time Complexity** | O(n) | O(n²) | O(n) |
| **Space Complexity** | O(1) | O(1) | O(1) |
| **Implementation** | Simple | Simple | Simple |
| **LeetCode Optimal** | ✅ Yes | ❌ No | ✅ Yes |
| **Best For** | Interview favorite | Understanding | Alternative |

**Best Approach:** The single pass approach (Approach 1) is optimal and the most commonly used solution.

---

## Why Single Pass is Optimal

1. **Efficiency**: O(n) time complexity is the best possible
2. **Simplicity**: Single loop with clear logic
3. **Memory**: Only O(1) extra space
4. **Interview Favorite**: Demonstrates understanding of optimization

---

## Related Problems

Based on similar themes (array, optimization):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Best Time to Buy and Sell Stock II | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/) | Multiple transactions |
| Best Time to Buy and Sell Stock III | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iii/) | At most two transactions |
| Best Time to Buy and Sell Stock IV | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-iv/) | k transactions |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Best Time to Buy and Sell Stock with Cooldown | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/) | With cooldown |
| Best Time to Buy and Sell Stock with Transaction Fee | [Link](https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-transaction-fee/) | With transaction fee |

---

## Video Tutorial Links

### Single Pass Solution

- [NeetCode - Best Time to Buy and Sell Stock](https://www.youtube.com/watch?v=1wA8-oh2k3Q) - Clear explanation
- [Single Pass Approach](https://www.youtube.com/watch?v=76hMcalaPR8) - Step-by-step

### Problem Variants

- [Stock II - Multiple Transactions](https://www.youtube.com/watch?v=2BF5fC3RgHs) - Extension
- [Dynamic Programming for Stocks](https://www.youtube.com/watch?v=3VC5tM4C2S4) - Advanced variations

---

## Follow-up Questions

### Q1: What is the time and space complexity of the optimal solution?

**Answer:** The optimal solution has O(n) time complexity (single pass through the array) and O(1) space complexity (only two variables).

---

### Q2: What if we want to find the days to buy and sell (not just the profit)?

**Answer:** Track the index of the minimum price along with the value. When updating max_profit, also record the sell day index.

---

### Q3: How would you handle the case where prices can go negative?

**Answer:** The algorithm naturally handles negative prices since we're looking for the maximum difference. Just initialize min_price to the first price instead of infinity.

---

### Q4: What if we could buy and sell multiple times (like in Best Time to Buy and Sell Stock II)?

**Answer:** Instead of looking for the global maximum, we sum all positive differences between consecutive days. This is equivalent to adding up all upward slopes.

---

### Q5: What edge cases should be tested?

**Answer:**
- Empty array or single element (return 0)
- Prices always decreasing (return 0)
- Prices always increasing (return prices[n-1] - prices[0])
- Single peak (buy low, sell high)

---

### Q6: How would you handle large arrays efficiently?

**Answer:** The single pass approach is already optimal for large arrays. It processes each element once and uses constant memory.

---

## Common Pitfalls

### 1. Not Handling Decreasing Prices
**Issue:** Returning negative profit for decreasing price arrays.

**Solution:** Always initialize max_profit to 0, not negative. Return 0 if no profit is possible.

### 2. Wrong Initialization
**Issue:** Using wrong initial values for min_price.

**Solution:** Initialize min_price to a large value (Infinity or first element) to ensure proper tracking.

### 3. Selling Before Buying
**Issue:** Allowing sell day before buy day.

**Solution:** The single-pass approach naturally handles this by only looking at prices after the minimum.

### 4. Forgetting Empty Array
**Issue:** Not handling edge cases.

**Solution:** Add checks for empty array or single element at the start.

### 5. Integer Overflow
**Issue:** In C++/Java, price difference might overflow.

**Solution:** Use appropriate data types (long in Java, careful with INT_MAX).

---

## Summary

The **Best Time to Buy and Sell Stock** problem demonstrates:

- **Single Pass**: Optimal O(n) time with O(1) space
- **Peak-Valley**: Alternative O(n) approach
- **Brute Force**: O(n²) but useful for understanding

The key insight is that we only need to track the minimum price seen so far and calculate the potential profit at each step. This simple approach gives us the maximum profit in a single pass.

This is a classic array optimization problem frequently asked in technical interviews.

---

## Additional Resources

- [LeetCode Problem](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/)
- [Peak Valley Definition](https://en.wikipedia.org/wiki/Peak_and_valley)
- [Kadane's Algorithm](https://en.wikipedia.org/wiki/Kadane%27s_algorithm) - Similar pattern
