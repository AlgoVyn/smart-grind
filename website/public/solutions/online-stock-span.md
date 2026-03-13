# Online Stock Span

## Problem Description

Design an algorithm that collects daily price quotes for some stock and returns the span of that stock's price for the current day.

The span of the stock's price in one day is the maximum number of consecutive days (starting from that day and going backward) for which the stock price was less than or equal to the price of that day.

For example, if the prices of the stock in the last four days is [7,2,1,2] and the price of the stock today is 2, then the span of today is 4 because starting from today, the price of the stock was less than or equal 2 for 4 consecutive days.

Also, if the prices of the stock in the last four days is [7,34,1,2] and the price of the stock today is 8, then the span of today is 3 because starting from today, the price of the stock was less than or equal 8 for 3 consecutive days.

Implement the StockSpanner class:

- `StockSpanner()` Initializes the object of the class.
- `int next(int price)` Returns the span of the stock's price given that today's price is price.

**LeetCode Link:** [LeetCode 901 - Online Stock Span](https://leetcode.com/problems/online-stock-span/)

---

## Examples

### Example

**Input**
```python
["StockSpanner", "next", "next", "next", "next", "next", "next", "next"]
[[], [100], [80], [60], [70], [60], [75], [85]]
```

**Output**
```python
[null, 1, 1, 1, 2, 1, 4, 6]
```

**Explanation**
```python
StockSpanner stockSpanner = new StockSpanner();
stockSpanner.next(100); // return 1
stockSpanner.next(80);  // return 1
stockSpanner.next(60);  // return 1
stockSpanner.next(70);  // return 2
stockSpanner.next(60);  // return 1
stockSpanner.next(75);  // return 4, because the last 4 prices (including today's price of 75) were less than or equal to today's price.
stockSpanner.next(85);  // return 6
```

---

## Constraints

- `1 <= price <= 10^5`
- At most `10^4` calls will be made to `next`.

---

## Pattern: Monotonic Stack

This problem uses a **monotonic decreasing stack** where we store pairs of (price, span). The stack maintains elements in decreasing order of price. For each new price, we pop smaller prices and accumulate their spans to compute the current stock span.

---

## Intuition

The key insight for this problem is understanding that the stock span is essentially "how far back can I go while prices are less than or equal to today". This is a classic case for the monotonic stack pattern.

### Key Observations

1. **Stack Stores (price, span)**: Each element in the stack stores both the price and its span. This allows us to accumulate spans when popping.

2. **Monotonic Decreasing Stack**: Prices in the stack are in decreasing order from bottom to top. This ensures we only need to look at relevant previous prices.

3. **Span Accumulation**: When we pop elements, we add their spans to our current span. This works because all popped elements have prices less than or equal to current price.

4. **Amortized O(1)**: Each price is pushed and popped at most once, making the average time complexity O(1).

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Monotonic Stack** - Optimal solution (O(1) amortized)
2. **Brute Force** - For understanding (O(n))

---

## Approach 1: Monotonic Stack (Optimal)

### Algorithm Steps

1. Initialize an empty stack storing (price, span) pairs
2. For each new price:
   - Start with span = 1 (the current day itself)
   - While stack not empty AND top price <= current price:
     - Add top's span to current span
     - Pop from stack
   - Push (current price, span) onto stack
   - Return span

### Why It Works

The stack maintains prices in decreasing order. When we see a new price, all smaller (or equal) prices in the stack can't contribute to future spans, so we pop them and accumulate their spans.

### Code Implementation

````carousel
```python
class StockSpanner:
    def __init__(self):
        """Initialize the stock span tracker."""
        self.stack = []  # list of (price, span)
    
    def next(self, price: int) -> int:
        """
        Calculate the stock span for the given price.
        
        Time: O(1) amortized, Space: O(n)
        """
        span = 1
        # Pop all smaller or equal prices and accumulate spans
        while self.stack and self.stack[-1][0] <= price:
            span += self.stack.pop()[1]
        
        self.stack.append((price, span))
        return span
```

<!-- slide -->
```cpp
#include <stack>
#include <utility>
using namespace std;

class StockSpanner {
private:
    stack<pair<int, int>> st;  // (price, span)
    
public:
    StockSpanner() {
        // Constructor - nothing to initialize
    }
    
    int next(int price) {
        int span = 1;
        
        // Pop all smaller or equal prices and accumulate spans
        while (!st.empty() && st.top().first <= price) {
            span += st.top().second;
            st.pop();
        }
        
        st.push({price, span});
        return span;
    }
};
```

<!-- slide -->
```java
import java.util.Stack;

class StockSpanner {
    private Stack<int[]> stack;
    
    public StockSpanner() {
        stack = new Stack<>();
    }
    
    public int next(int price) {
        int span = 1;
        
        // Pop all smaller or equal prices and accumulate spans
        while (!stack.isEmpty() && stack.peek()[0] <= price) {
            span += stack.peek()[1];
            stack.pop();
        }
        
        stack.push(new int[]{price, span});
        return span;
    }
}
```

<!-- slide -->
```javascript
/**
 * Your StockSpanner object will be instantiated and called as such:
 * var obj = new StockSpanner()
 * var param_1 = obj.next(price)
 */
var StockSpanner = function() {
    this.stack = [];  // Array of [price, span]
};

/**
 * @param {number} price
 * @return {number}
 */
StockSpanner.prototype.next = function(price) {
    let span = 1;
    
    // Pop all smaller or equal prices and accumulate spans
    while (this.stack.length > 0 && this.stack[this.stack.length - 1][0] <= price) {
        span += this.stack.pop()[1];
    }
    
    this.stack.push([price, span]);
    return span;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(1) amortized - each price pushed and popped at most once |
| **Space** | O(n) - worst case where prices are strictly decreasing |

---

## Approach 2: Brute Force (For Understanding)

### Algorithm Steps

1. Store all prices in a list
2. For each new price, count backwards until finding a price greater than current
3. Return the count

### Why It Works

This is the straightforward definition of stock span - count consecutive days with prices <= current.

### Code Implementation

````carousel
```python
class StockSpanner:
    def __init__(self):
        """Initialize the stock span tracker."""
        self.prices = []
    
    def next(self, price: int) -> int:
        """
        Calculate the stock span using brute force.
        
        Time: O(n), Space: O(n)
        """
        span = 1
        # Count backwards
        i = len(self.prices) - 1
        while i >= 0 and self.prices[i] <= price:
            span += 1
            i -= 1
        
        self.prices.append(price)
        return span
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class StockSpanner {
private:
    vector<int> prices;
    
public:
    StockSpanner() {
        // Constructor
    }
    
    int next(int price) {
        int span = 1;
        int i = prices.size() - 1;
        
        while (i >= 0 && prices[i] <= price) {
            span++;
            i--;
        }
        
        prices.push_back(price);
        return span;
    }
};
```

<!-- slide -->
```java
class StockSpanner {
    private List<Integer> prices;
    
    public StockSpanner() {
        prices = new ArrayList<>();
    }
    
    public int next(int price) {
        int span = 1;
        int i = prices.size() - 1;
        
        while (i >= 0 && prices.get(i) <= price) {
            span++;
            i--;
        }
        
        prices.add(price);
        return span;
    }
}
```

<!-- slide -->
```javascript
/**
 * Your StockSpanner object will be instantiated and called as such:
 * var obj = new StockSpanner()
 * var param_1 = obj.next(price)
 */
var StockSpanner = function() {
    this.prices = [];
};

/**
 * @param {number} price
 * @return {number}
 */
StockSpanner.prototype.next = function(price) {
    let span = 1;
    let i = this.prices.length - 1;
    
    while (i >= 0 && this.prices[i] <= price) {
        span++;
        i--;
    }
    
    this.prices.push(price);
    return span;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) per call - scanning backwards |
| **Space** | O(n) - storing all prices |

---

## Comparison of Approaches

| Aspect | Monotonic Stack | Brute Force |
|--------|-----------------|-------------|
| **Time Complexity** | O(1) amortized | O(n) |
| **Space Complexity** | O(n) | O(n) |
| **LeetCode Optimal** | ✅ | ❌ (too slow) |

**Best Approach:** Use Approach 1 (Monotonic Stack) for optimal solution.

---

## Common Pitfalls

- **Wrong comparison operator**: Use `<=` to pop elements when current price is greater than or equal to stack top.
- **Initial span value**: Start with span = 1 (the current day itself).
- **Stack stores (price, span)**: Not just prices - need the span for accumulation.
- **Empty stack handling**: The algorithm naturally handles empty stack - the initial span of 1 is returned.

---

## Related Problems

Based on similar themes (Monotonic Stack, Stock Problems):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Daily Temperatures | [Link](https://leetcode.com/problems/daily-temperatures/) | Similar monotonic stack |
| Next Greater Element | [Link](https://leetcode.com/problems/next-greater-element-i/) | Classic monotonic stack |
| Stock Price Fluctuation | [Link](https://leetcode.com/problems/stock-price-fluctuation/) | Related stock problem |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

1. **[NeetCode - Online Stock Span](https://www.youtube.com/watch?v=3RBCX1K6rPU)** - Clear explanation with visual examples
2. **[LeetCode 901 - Solution Walkthrough](https://www.youtube.com/watch?v=5v-0fD3J2jU)** - Detailed walkthrough

---

## Follow-up Questions

### Q1: How would you modify the solution to get the minimum price in the last n days?

**Answer:** Instead of storing spans, store minimum values in the stack. Or maintain a separate monotonic increasing stack for minimums.

---

### Q2: What if you needed to calculate the span for multiple stocks simultaneously?

**Answer:** You could use separate stacks for each stock, or combine them with a stock identifier in each stack element.

---

### Q3: How would you handle a very large number of calls efficiently?

**Answer:** The current solution already handles this well with O(1) amortized time. For extremely high volume, consider batch processing.

---

### Q4: Can you solve this without storing spans in the stack?

**Answer:** You could store just prices and calculate span by counting popped elements, but you'd lose the span accumulation optimization. The current approach is optimal.

---

### Q5: What's the worst-case space complexity?

**Answer:** O(n) when prices are in strictly decreasing order. In this case, no elements are ever popped, and all n elements remain in the stack.

---

## Summary

The **Online Stock Span** problem demonstrates the power of the **Monotonic Stack** pattern for solving span-related problems efficiently.

Key takeaways:
1. Store (price, span) pairs in the stack
2. Pop smaller prices and accumulate their spans
3. O(1) amortized time complexity
4. O(n) worst case space complexity

This problem is essential for understanding monotonic stack applications in financial data processing.

### Pattern Summary

This problem exemplifies the **Monotonic Stack** pattern, characterized by:
- Maintaining elements in sorted order
- Accumulating values when popping
- O(1) amortized time complexity
- Common in stock and temperature problems

For more details on this pattern and its variations, see the **[Monotonic Stack Pattern](/patterns/monotonic-stack)**.
