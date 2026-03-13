# Stock Price Fluctuation

## LeetCode Link

[LeetCode Problem 2036: Stock Price Fluctuation](https://leetcode.com/problems/stock-price-fluctuation/)

## Pattern:

Heap with Lazy Deletion

This problem uses **two heaps** (max-heap and min-heap) combined with **lazy deletion** to efficiently track the maximum and minimum stock prices. When a timestamp's price is updated, old entries remain in the heaps but are lazily removed when they reach the top and are found to be outdated.

## Common Pitfalls

- **Lazy deletion logic**: Always check if the top of the heap matches the current price in the dictionary before returning the result.
- **Heap with negative values**: Python's heapq is a min-heap, so use negative values for max-heap.
- **Multiple updates to same timestamp**: Each update pushes to both heaps; outdated entries must be filtered during queries.
- **Empty heap handling**: Ensure the heap has valid entries before accessing the top element.

---

## Problem Description

You are given a stream of records about a particular stock. Each record contains a timestamp and the corresponding price of the stock at that timestamp. Unfortunately, due to the volatile nature of the stock market, the records do not come in order. Even worse, some records may be incorrect. Another record with the same timestamp may appear later in the stream, correcting the price of the previous wrong record.

Design an algorithm that:

- Updates the price of the stock at a particular timestamp, correcting the price from any previous records at the timestamp.
- Finds the latest price of the stock based on the current records. The latest price is the price at the latest timestamp recorded.
- Finds the maximum price the stock has been based on the current records.
- Finds the minimum price the stock has been based on the current records.

Implement the `StockPrice` class:

- `StockPrice()`: Initializes the object with no price records.
- `void update(int timestamp, int price)`: Updates the price of the stock at the given timestamp.
- `int current()`: Returns the latest price of the stock.
- `int maximum()`: Returns the maximum price of the stock.
- `int minimum()`: Returns the minimum price of the stock.

### Example 1:

**Input:**
```
["StockPrice", "update", "update", "current", "maximum", "update", "maximum", "update", "minimum"]
[[], [1, 10], [2, 5], [], [], [1, 3], [], [4, 2], []]
```

**Output:**
```
[null, null, null, 5, 10, null, 5, null, 2]
```

**Explanation:**
```python
StockPrice stockPrice = new StockPrice();
stockPrice.update(1, 10); # Timestamps are [1] with corresponding prices [10].
stockPrice.update(2, 5);  # Timestamps are [1,2] with corresponding prices [10,5].
stockPrice.current();     # return 5, the latest timestamp is 2 with the price being 5.
stockPrice.maximum();     # return 10, the maximum price is 10 at timestamp 1.
stockPrice.update(1, 3);  # The previous timestamp 1 had the wrong price, so it is updated to 3.
                          # Timestamps are [1,2] with corresponding prices [3,5].
stockPrice.maximum();     # return 5, the maximum price is 5 after the correction.
stockPrice.update(4, 2);  # Timestamps are [1,2,4] with corresponding prices [3,5,2].
stockPrice.minimum();     # return 2, the minimum price is 2 at timestamp 4.
```

## Constraints

- `1 <= timestamp, price <= 10^9`
- At most `10^5` calls will be made in total to `update`, `current`, `maximum`, and `minimum`.
- `current`, `maximum`, and `minimum` will be called only after `update` has been called at least once.

---

## Examples

### Example 1

**Input:**
```
["StockPrice", "update", "update", "current", "maximum", "update", "maximum", "update", "minimum"]
[[], [1, 10], [2, 5], [], [], [1, 3], [], [4, 2], []]
```

**Output:**
```
[null, null, null, 5, 10, null, 5, null, 2]
```

**Explanation:**
```python
StockPrice stockPrice = new StockPrice();
stockPrice.update(1, 10); # Timestamps are [1] with corresponding prices [10].
stockPrice.update(2, 5);  # Timestamps are [1,2] with corresponding prices [10,5].
stockPrice.current();     # return 5, the latest timestamp is 2 with the price being 5.
stockPrice.maximum();     # return 10, the maximum price is 10 at timestamp 1.
stockPrice.update(1, 3);  # The previous timestamp 1 had the wrong price, so it is updated to 3.
                          # Timestamps are [1,2] with corresponding prices [3,5].
stockPrice.maximum();     # return 5, the maximum price is 5 after the correction.
stockPrice.update(4, 2);  # Timestamps are [1,2,4] with corresponding prices [3,5,2].
stockPrice.minimum();     # return 2, the minimum price is 2 at timestamp 4.
```

---

## Intuition

The key insight for this problem is efficiently tracking the maximum and minimum values in a dynamic dataset where values can be updated.

### Key Observations

1. **Dynamic Updates**: Prices can be updated with new values at the same timestamp, requiring us to track the current (latest) price, maximum price, and minimum price.

2. **Naive Approach Won't Work**: Simply storing prices in a list and scanning for max/min would be O(n) per query, which is too slow.

3. **Heap Data Structure**: Heaps give us O(1) access to max/min elements, but they don't support efficient updates or deletions.

4. **Lazy Deletion**: When a price is updated, we can't efficiently remove the old value from the heap. Instead, we mark the old value as "stale" and remove it lazily when it reaches the top of the heap.

### Why It Works

The heap with lazy deletion approach works because:
- Heaps give us O(1) access to potential max/min
- We use a dictionary to store the current (valid) price for each timestamp
- When the top of the heap doesn't match the dictionary, we know it's stale and remove it
- Each element is pushed at most once but may be popped multiple times (lazy deletion), still giving amortized O(1) per operation

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Heap with Lazy Deletion (Optimal)** - O(log n) operations
2. **Balanced BST** - Alternative approach

---

## Approach 1: Heap with Lazy Deletion (Optimal)

### Code Implementation

````carousel
```python
import heapq
from collections import defaultdict

class StockPrice:
    def __init__(self):
        self.prices = {}  # timestamp -> price
        self.maxheap = []  # max heap using negative prices
        self.minheap = []  # min heap
        self.latest = 0   # track latest timestamp

    def update(self, timestamp: int, price: int) -> None:
        self.prices[timestamp] = price
        heapq.heappush(self.maxheap, (-price, timestamp))
        heapq.heappush(self.minheap, (price, timestamp))
        if timestamp > self.latest:
            self.latest = timestamp

    def current(self) -> int:
        return self.prices[self.latest]

    def maximum(self) -> int:
        # Lazy deletion: remove outdated entries from max heap
        while self.maxheap and -self.maxheap[0][0] != self.prices.get(self.maxheap[0][1], 0):
            heapq.heappop(self.maxheap)
        return -self.maxheap[0][0]

    def minimum(self) -> int:
        # Lazy deletion: remove outdated entries from min heap
        while self.minheap and self.minheap[0][0] != self.prices.get(self.minheap[0][1], 0):
            heapq.heappop(self.minheap)
        return self.minheap[0][0]
```

<!-- slide -->
```cpp
#include <unordered_map>
#include <queue>
#include <vector>
using namespace std;

class StockPrice {
private:
    unordered_map<int, int> prices;
    priority_queue<pair<int, int>> maxheap;  // (-price, timestamp)
    priority_queue<pair<int, int>, vector<pair<int, int>>, greater<pair<int, int>>> minheap;
    int latest = 0;
    
public:
    StockPrice() {}
    
    void update(int timestamp, int price) {
        prices[timestamp] = price;
        maxheap.push({-price, timestamp});
        minheap.push({price, timestamp});
        if (timestamp > latest) {
            latest = timestamp;
        }
    }
    
    int current() {
        return prices[latest];
    }
    
    int maximum() {
        while (!maxheap.empty()) {
            auto [negPrice, ts] = maxheap.top();
            int price = -negPrice;
            if (prices.find(ts) != prices.end() && prices[ts] == price) {
                return price;
            }
            maxheap.pop();
        }
        return -1;
    }
    
    int minimum() {
        while (!minheap.empty()) {
            auto [price, ts] = minheap.top();
            if (prices.find(ts) != prices.end() && prices[ts] == price) {
                return price;
            }
            minheap.pop();
        }
        return -1;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class StockPrice {
    private Map<Integer, Integer> prices = new HashMap<>();
    private PriorityQueue<int[]> maxheap;  // {-price, timestamp}
    private PriorityQueue<int[]> minheap;   // {price, timestamp}
    private int latest = 0;
    
    public StockPrice() {
        maxheap = new PriorityQueue<>((a, b) -> b[0] - a[0]);
        minheap = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
    }
    
    public void update(int timestamp, int price) {
        prices.put(timestamp, price);
        maxheap.offer(new int[]{-price, timestamp});
        minheap.offer(new int[]{price, timestamp});
        if (timestamp > latest) {
            latest = timestamp;
        }
    }
    
    public int current() {
        return prices.get(latest);
    }
    
    public int maximum() {
        while (!maxheap.isEmpty()) {
            int[] top = maxheap.peek();
            int price = -top[0];
            int ts = top[1];
            if (prices.containsKey(ts) && prices.get(ts) == price) {
                return price;
            }
            maxheap.poll();
        }
        return -1;
    }
    
    public int minimum() {
        while (!minheap.isEmpty()) {
            int[] top = minheap.peek();
            int price = top[0];
            int ts = top[1];
            if (prices.containsKey(ts) && prices.get(ts) == price) {
                return price;
            }
            minheap.poll();
        }
        return -1;
    }
}
```

<!-- slide -->
```javascript
/**
 * @constructor
 */
var StockPrice = function() {
    this.prices = new Map();
    this.maxheap = [];  // [-price, timestamp]
    this.minheap = [];  // [price, timestamp]
    this.latest = 0;
};

/**
 * @param {number} timestamp 
 * @param {number} price
 * @return {void}
 */
StockPrice.prototype.update = function(timestamp, price) {
    this.prices.set(timestamp, price);
    this.maxheap.push([-price, timestamp]);
    this.minheap.push([price, timestamp]);
    if (timestamp > this.latest) {
        this.latest = timestamp;
    }
    this.maxheap.sort((a, b) => b[0] - a[0]);
    this.minheap.sort((a, b) => a[0] - b[0]);
};

/**
 * @return {number}
 */
StockPrice.prototype.current = function() {
    return this.prices.get(this.latest);
};

/**
 * @return {number}
 */
StockPrice.prototype.maximum = function() {
    while (this.maxheap.length > 0) {
        const [negPrice, ts] = this.maxheap[0];
        const price = -negPrice;
        if (this.prices.get(ts) === price) {
            return price;
        }
        this.maxheap.shift();
    }
    return -1;
};

/**
 * @return {number}
 */
StockPrice.prototype.minimum = function() {
    while (this.minheap.length > 0) {
        const [price, ts] = this.minheap[0];
        if (this.prices.get(ts) === price) {
            return price;
        }
        this.minheap.shift();
    }
    return -1;
};
```
````

---

## Approach 2: Balanced BST

### Code Implementation

````carousel
```python
from sortedcontainers import SortedDict

class StockPrice:
    def __init__(self):
        self.prices = {}  # timestamp -> price
        self.sorted_prices = SortedDict()  # price -> count
        self.latest = 0

    def update(self, timestamp: int, price: int) -> None:
        if timestamp in self.prices:
            old_price = self.prices[timestamp]
            self.sorted_prices[old_price] -= 1
            if self.sorted_prices[old_price] == 0:
                del self.sorted_prices[old_price]
        
        self.prices[timestamp] = price
        self.sorted_prices[price] = self.sorted_prices.get(price, 0) + 1
        
        if timestamp > self.latest:
            self.latest = timestamp

    def current(self) -> int:
        return self.prices[self.latest]

    def maximum(self) -> int:
        return self.sorted_prices.peekitem(-1)[0]

    def minimum(self) -> int:
        return self.sorted_prices.peekitem(0)[0]
```

<!-- slide -->
```cpp
#include <map>
using namespace std;

class StockPrice {
private:
    map<int, int> prices;  // timestamp -> price
    map<int, int> price_count;  // price -> count
    int latest = 0;
    
public:
    StockPrice() {}
    
    void update(int timestamp, int price) {
        if (prices.find(timestamp) != prices.end()) {
            int old_price = prices[timestamp];
            price_count[old_price]--;
            if (price_count[old_price] == 0) {
                price_count.erase(old_price);
            }
        }
        
        prices[timestamp] = price;
        price_count[price]++;
        
        if (timestamp > latest) {
            latest = timestamp;
        }
    }
    
    int current() {
        return prices[latest];
    }
    
    int maximum() {
        return price_count.rbegin()->first;
    }
    
    int minimum() {
        return price_count.begin()->first;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class StockPrice {
    private Map<Integer, Integer> prices = new HashMap<>();
    private TreeMap<Integer, Integer> priceCount = new TreeMap<>();
    private int latest = 0;
    
    public StockPrice() {}
    
    public void update(int timestamp, int price) {
        if (prices.containsKey(timestamp)) {
            int oldPrice = prices.get(timestamp);
            int count = priceCount.get(oldPrice);
            if (count == 1) {
                priceCount.remove(oldPrice);
            } else {
                priceCount.put(oldPrice, count - 1);
            }
        }
        
        prices.put(timestamp, price);
        priceCount.put(price, priceCount.getOrDefault(price, 0) + 1);
        
        if (timestamp > latest) {
            latest = timestamp;
        }
    }
    
    public int current() {
        return prices.get(latest);
    }
    
    public int maximum() {
        return priceCount.lastKey();
    }
    
    public int minimum() {
        return priceCount.firstKey();
    }
}
```

<!-- slide -->
```javascript
/**
 * @constructor
 */
var StockPrice = function() {
    this.prices = new Map();
    this.priceCount = new Map();
    this.latest = 0;
};

/**
 * @param {number} timestamp 
 * @param {number} price
 * @return {void}
 */
StockPrice.prototype.update = function(timestamp, price) {
    if (this.prices.has(timestamp)) {
        const oldPrice = this.prices.get(timestamp);
        const count = this.priceCount.get(oldPrice);
        if (count === 1) {
            this.priceCount.delete(oldPrice);
        } else {
            this.priceCount.set(oldPrice, count - 1);
        }
    }
    
    this.prices.set(timestamp, price);
    this.priceCount.set(price, (this.priceCount.get(price) || 0) + 1);
    
    if (timestamp > this.latest) {
        this.latest = timestamp;
    }
};

/**
 * @return {number}
 */
StockPrice.prototype.current = function() {
    return this.prices.get(this.latest);
};

/**
 * @return {number}
 */
StockPrice.prototype.maximum = function() {
    return Math.max(...this.priceCount.keys());
};

/**
 * @return {number}
 */
StockPrice.prototype.minimum = function() {
    return Math.min(...this.priceCount.keys());
};
```
````

### Complexity Analysis

| Operation | Heap Approach | BST Approach |
|-----------|--------------|--------------|
| Update | O(log n) | O(log n) |
| Current | O(1) | O(1) |
| Maximum | O(log n) amortized | O(1) |
| Minimum | O(log n) amortized | O(1) |

---

## Related Problems

| Problem | LeetCode | Description |
|---------|----------|-------------|
| [Design Twitter](/solutions/design-twitter.md) | 355 | Feed design |
| [Kth Largest Element in a Stream](/solutions/kth-largest-element-in-a-stream.md) | 703 | Heap usage |

---

## Video Tutorial Links

1. **[Stock Price Fluctuation - NeetCode](https://www.youtube.com/watch?v=XXXXX)** - Clear explanation

---

## Follow-up Questions

### Q1: What is lazy deletion?
**Answer:** Instead of removing outdated entries from heap immediately, we remove them when they reach the top during queries.

### Q2: Why use two heaps?
**Answer:** One for max (negated values) and one for min to get both in O(1) access.

---

## Summary

---

## Solution (Original)

The solution uses a combination of a dictionary and two heaps (max and min) with lazy deletion to efficiently handle stock price updates and queries:

1. **Dictionary**: Stores the current price for each timestamp for O(1) access.
2. **Max Heap**: Stores negative prices to simulate a max heap, allowing O(1) access to the maximum price.
3. **Min Heap**: Stores prices directly for O(1) access to the minimum price.
4. **Lazy Deletion**: Instead of removing outdated entries immediately, they are removed when they reach the top of the heap during queries.

### Step-by-Step Explanation

1. **Initialization**:
   - `prices`: Dictionary to map timestamps to their current prices.
   - `maxheap`: Max heap (using negative values) to track maximum prices.
   - `minheap`: Min heap to track minimum prices.
   - `latest`: Variable to track the latest timestamp.

2. **Update Operation**:
   - Store the price in the dictionary with the timestamp as the key.
   - Push the price and timestamp to both heaps.
   - Update the `latest` timestamp if the current timestamp is newer.

3. **Current Operation**:
   - Return the price associated with the `latest` timestamp from the dictionary.

4. **Maximum/Minimum Operations**:
   - For each operation, check if the top of the heap contains an outdated price (i.e., the price in the heap does not match the current price in the dictionary).
   - Remove outdated entries (lazy deletion) until the top of the heap contains a valid price.
   - Return the valid price from the top of the heap.

### Time Complexity

- **Update**: `O(log n)` - Heap insertion operations.
- **Current**: `O(1)` - Dictionary lookup.
- **Maximum/Minimum**: `O(log n)` amortized - Due to lazy deletion of outdated entries.

### Space Complexity

- **Overall**: `O(n)` - For storing the dictionary and heaps, where `n` is the number of unique timestamps.
