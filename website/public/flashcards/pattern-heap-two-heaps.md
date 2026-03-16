## Two Heaps: Median of Data Stream

**Question:** How do you efficiently find the median of a stream of numbers?

<!-- front -->

---

## Answer: Use Max-Heap and Min-Heap

### Standard Solution
```python
import heapq

class MedianFinder:
    def __init__(self):
        # max heap (lower half) - store negative for max heap
        self.small = []  # max heap
        # min heap (upper half)
        self.large = []  # min heap
    
    def addNum(self, num):
        # Always add to max heap first
        heapq.heappush(self.small, -num)
        
        # Balance: largest of small <= smallest of large
        if self.small and self.large and -self.small[0] > self.large[0]:
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
        
        # Maintain size property: |small| == |large| or |small| = |large| + 1
        if len(self.small) > len(self.large) + 1:
            val = -heapq.heappop(self.small)
            heapq.heappush(self.large, val)
        
        if len(self.large) > len(self.small):
            val = heapq.heappop(self.large)
            heapq.heappush(self.small, -val)
    
    def findMedian(self):
        if len(self.small) > len(self.large):
            return -self.small[0]
        
        return (-self.small[0] + self.large[0]) / 2
```

### Visual: Heap Balance
```
Add 1:  small=[-1], large=[] → median = 1
Add 5:  small=[-1], large=[5] → median = (1+5)/2 = 3
Add 2:  small=[-2,-1], large=[5] → median = (2+5)/2 = 3.5
Add 4:  small=[-2,-1], large=[4,5] → median = (2+4)/2 = 3
```

### ⚠️ Tricky Parts

#### 1. Python Heap Behavior
```python
# Python's heapq is a MIN heap
# For MAX heap, negate values!

# Store negative in "max heap"
heapq.heappush(small, -num)

# To get max value
max_val = -small[0]
```

#### 2. Balancing Heaps
```python
# After adding to small, may violate:
# -small[0] <= large[0]

if self.small and self.large and -self.small[0] > self.large[0]:
    # Move largest from small to large
    val = -heapq.heappop(self.small)
    heapq.heappush(self.large, val)

# Also maintain size difference at most 1
if len(self.small) > len(self.large) + 1:
    # Move from small to large
```

#### 3. Median Calculation
```python
# If odd number of elements
if len(small) > len(large):
    return -small[0]  # max of small

# If even number
return (-small[0] + large[0]) / 2
```

### Alternative: Balancing by Size
```python
def addNum(self, num):
    if not self.small or num <= -self.small[0]:
        heapq.heappush(self.small, -num)
    else:
        heapq.heappush(self.large, num)
    
    # Rebalance
    if len(self.small) > len(self.large) + 1:
        heapq.heappush(self.large, -heapq.heappop(self.small))
    elif len(self.small) < len(self.large):
        heapq.heappush(self.small, -heapq.heappop(self.large))
```

### Time Complexity

| Operation | Complexity |
|-----------|------------|
| addNum | O(log n) |
| findMedian | O(1) |

### Why Two Heaps?
- Max heap stores smaller half → gives quick access to largest of small
- Min heap stores larger half → gives quick access to smallest of large
- Together they give O(1) median finding

### Common Variations

| Variation | Data Structure | Use Case |
|-----------|----------------|----------|
| Running median | Two heaps | Median of stream |
| Sliding window median | Two heaps + multiset | Moving median |
| Frequency stack | Heap + count | Mode tracking |

<!-- back -->
