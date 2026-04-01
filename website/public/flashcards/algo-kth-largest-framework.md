## Title: Kth Largest Framework

What is the standard framework for kth element selection problems?

<!-- front -->

---

### Selection Framework
```
SELECT_KTH(A, n, k):
  // Choose approach based on constraints
  
  if k close to n/2 and single query:
    return QUICKSELECT(A, k)  // O(n)
  
  if multiple queries on same array:
    SORT(A)  // O(n log n), then O(1) queries
  
  if streaming data:
    return HEAP_SELECT(A, k)  // O(n log k)
  
  if worst-case guarantee needed:
    return MEDIAN_OF_MEDIANS(A, k)  // O(n)
```

---

### Approach Selection
| Scenario | Best Algorithm | Why |
|----------|----------------|-----|
| Single query, mutable | Quickselect | O(n) avg, O(1) space |
| Multiple queries | Sort + index | O(n log n) once |
| Immutable array | Heap | O(n log k) no modification |
| Large n, small k | Min-heap | O(n log k) |
| Large k close to n | Max-heap | O(n + (n-k) log n) |
| Worst-case guarantee | Median-of-Medians | O(n) deterministic |

### Heap Approach Template
```python
import heapq

def kth_largest_heap(nums, k):
    """O(n log k) time, O(k) space"""
    min_heap = []
    for num in nums:
        heapq.heappush(min_heap, num)
        if len(min_heap) > k:
            heapq.heappop(min_heap)
    return min_heap[0]

def kth_smallest_heap(nums, k):
    """Use max heap (negate values)"""
    max_heap = []
    for num in nums:
        heapq.heappush(max_heap, -num)
        if len(max_heap) > k:
            heapq.heappop(max_heap)
    return -max_heap[0]
```

---

### Top K Elements Pattern
```python
def top_k_frequent(nums, k):  # K most frequent
    from collections import Counter
    count = Counter(nums)
    return heapq.nlargest(k, count.keys(), key=count.get)
```

<!-- back -->
