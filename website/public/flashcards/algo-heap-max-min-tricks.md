## Heap Operations: Max-Heap vs Min-Heap

**Question:** How do you choose between max-heap and min-heap, and what are the common mistakes?

<!-- front -->

---

## Answer: Know Your Data Flow

### When to Use Each

| Goal | Heap Type | Why |
|------|-----------|-----|
| Find K largest | Min-heap of size K | Root is Kth largest |
| Find K smallest | Max-heap of size K | Root is Kth smallest |
| Median | Two heaps | Balance sizes |
| Dijkstra | Min-heap | Always get closest |
| Priority Queue | Depends | Based on priority |

### Python Implementation Note
```python
import heapq

# Python only has min-heap!
# Max-heap: store negatives

# Max-heap operations
max_heap = []  # Want max at top
heapq.heappush(max_heap, -5)   # push negative
heapq.heappush(max_heap, -10)
heapq.heappush(max_heap, -3)

max_val = -heapq.heappop(max_heap)  # pop and negate
```

### Common Mistakes

#### 1. Using Wrong Heap Type
```python
# Find K largest - WRONG!
max_heap = []
for num in nums[:k]:
    heapq.heappush(max_heap, num)  # Max-heap!
    
# Should use min-heap to track K largest
min_heap = []
for num in nums:
    if len(min_heap) < k:
        heapq.heappush(min_heap, num)
    elif num > min_heap[0]:
        heapq.heapreplace(min_heap, num)
```

#### 2. Forgetting Negation for Max-Heap
```python
# WRONG - treating min-heap as max-heap
heapq.heappush(heap, 5)  # Adds 5
heapq.heappush(heap, 10) # Adds 10
print(heap[0])  # Prints 5, not 10!

# CORRECT - negate for max behavior
heapq.heappush(heap, -5)
heapq.heappush(heap, -10)
print(-heap[0])  # Prints 10
```

#### 3. Not Handling Empty Heap
```python
# WRONG - may crash
min_heap = []
top = min_heap[0]  # IndexError!

# CORRECT
if min_heap:
    top = min_heap[0]
else:
    # Handle empty case
```

### Heap Operations Complexity

| Operation | Time | Notes |
|-----------|------|-------|
| push | O(log n) | Insert element |
| pop | O(log n) | Remove top |
| peek | O(1) | View top without removing |
| heapify | O(n) | Build heap from array |

### Key Visual

```
Min-Heap (smallest at root):          Max-Heap (largest at root):
        1                                     10
      /   \                                  /   \
     3     5        vs                     8     6
    / \   / \                             / \   / \
   7   9 8  12                           1   5 3   2

Root: 1 (smallest)                    Root: 10 (largest)
```

### Median of Data Stream
```python
import heapq

class MedianFinder:
    def __init__(self):
        self.small = []  # max-heap (negatives)
        self.large = []  # min-heap
    
    def addNum(self, num):
        # Add to max-heap first
        heapq.heappush(self.small, -num)
        
        # Balance: largest of small <= smallest of large
        heapq.heappush(self.large, -heapq.heappop(self.small))
        
        # Ensure small has >= large
        if len(self.small) < len(self.large):
            heapq.heappush(self.small, -heapq.heappop(self.large))
    
    def findMedian(self):
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2
```

### ⚠️ Tricky Parts

| Issue | Problem | Solution |
|-------|---------|----------|
| Python min-heap only | Can't directly use max-heap | Negate values |
| heapreplace vs heappop+heappush | Efficiency | Use heapreplace |
| Heap not sorted | Can't access all elements | Use sorted() if needed |
| Memory | Large heaps | Consider streaming |

### When NOT to Use Heaps
- Need all elements sorted → Use sort()
- Random access needed → Use array/list
- Insert only, never pop → Consider sorted container

### heapreplace vs heappop + heappush
```python
# Two operations - may violate heap property briefly
heapq.heappop(heap)
heapq.heappush(heap, new_val)

# Single atomic operation - maintains heap property
heapq.heapreplace(heap, new_val)  # Returns popped element
```

<!-- back -->
