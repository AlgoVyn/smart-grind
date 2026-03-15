## Top K Elements

**Question:** Min-heap or Max-heap for top K largest?

<!-- front -->

---

## Top K Pattern

### The Answer: Min-Heap for Top K Largest

### Logic
Maintain a **min-heap of size K**: 
- Heap contains K largest elements seen so far
- Root is the K-th largest (smallest of the top K)
- If new element > root: pop root, push new element

### Implementation
```python
import heapq

def top_k_largest(nums, k):
    # Min-heap with k largest
    min_heap = nums[:k]
    heapq.heapify(min_heap)
    
    for num in nums[k:]:
        if num > min_heap[0]:  # Larger than k-th largest?
            heapq.heapreplace(min_heap, num)
    
    return min_heap  # Or sorted(min_heap) for ordered result
```

### Complexity
| Approach | Time | Space |
|----------|------|-------|
| **Heap (O(n log k))** | O(n log k) | O(k) |
| Sorting | O(n log n) | O(1) or O(n) |

### 💡 Alternative: Max-Heap for Top K Smallest
Store **negatives** in a min-heap to simulate max-heap behavior.

### ⚠️ Python Tip
`heapq` only implements min-heap. For max-heap:
```python
heapq.heappush(max_heap, -num)  # Push negative
largest = -heapq.heappop(max_heap)  # Pop and negate
```

<!-- back -->
