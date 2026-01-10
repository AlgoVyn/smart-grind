# Stock Price Fluctuation

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

### Constraints:

- `1 <= timestamp, price <= 10^9`
- At most `10^5` calls will be made in total to `update`, `current`, `maximum`, and `minimum`.
- `current`, `maximum`, and `minimum` will be called only after `update` has been called at least once.

---

## Solution

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

---

## Explanation

### Approach

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
