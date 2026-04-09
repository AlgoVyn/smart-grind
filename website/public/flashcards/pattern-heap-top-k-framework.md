## Heap - Top K Elements: Framework

What is the complete code template for Top K problems using heaps?

<!-- front -->

---

### Framework 1: K Largest Elements (Min-Heap)

```
┌─────────────────────────────────────────────────────┐
│  TOP K LARGEST - MIN HEAP TEMPLATE                   │
├─────────────────────────────────────────────────────┤
│  1. Initialize empty min-heap                        │
│  2. For each element in stream:                     │
│     a. If heap size < K:                            │
│        - Push element to heap                       │
│     b. Else if element > heap[0] (min of top K):   │
│        - Pop heap[0] (remove smallest of top K)      │
│        - Push new element                             │
│  3. Heap contains K largest elements                │
│     Root is the K-th largest                         │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Kth Largest

```python
import heapq

def find_kth_largest(nums, k):
    """Find the kth largest element in array."""
    # Min heap with k largest elements
    min_heap = []
    
    for num in nums:
        if len(min_heap) < k:
            heapq.heappush(min_heap, num)
        elif num > min_heap[0]:
            heapq.heapreplace(min_heap, num)  # Faster than pop+push
    
    return min_heap[0]  # K-th largest
```

---

### Implementation: Top K Frequent Elements

```python
def top_k_frequent(nums, k):
    """Find k most frequent elements."""
    from collections import Counter
    
    # Count frequencies
    count = Counter(nums)
    
    # Min heap: (frequency, element)
    # Store only k most frequent
    heap = []
    
    for num, freq in count.items():
        if len(heap) < k:
            heapq.heappush(heap, (freq, num))
        elif freq > heap[0][0]:
            heapq.heapreplace(heap, (freq, num))
    
    # Extract elements
    return [num for freq, num in heap]
```

---

### Implementation: K Closest to Origin

```python
def k_closest(points, k):
    """Find k points closest to origin (0,0)."""
    # Max heap approach: store negative distances
    # Or min heap with all, then extract k
    
    # Using heap with all points (Python has no max-heap)
    # Store (distance, point), use nsmallest
    
    def distance(p):
        return p[0]**2 + p[1]**2
    
    # heapq.nsmallest is O(N log K) internally
    return heapq.nsmallest(k, points, key=distance)
```

---

### Key Pattern Elements

| Element | Purpose | Implementation |
|---------|---------|----------------|
| Min-heap | Track K largest | Root = K-th largest |
| Size limit | Only keep K elements | Pop before push when full |
| `heapreplace` | Efficient update | Faster than pop+push |
| `nsmallest`/`nlargest` | Library functions | Python convenience |

<!-- back -->
