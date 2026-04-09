## Heap - K-way Merge: Tactics

What are the advanced techniques for k-way merge?

<!-- front -->

---

### Tactic 1: Find Kth Smallest in Sorted Matrix

```python
def kth_smallest(matrix, k):
    """Find kth smallest in sorted matrix."""
    n = len(matrix)
    heap = []
    
    # Push first column
    for i in range(min(n, k)):
        heapq.heappush(heap, (matrix[i][0], i, 0))
    
    while k > 1:
        val, row, col = heapq.heappop(heap)
        if col + 1 < n:
            heapq.heappush(heap, (matrix[row][col + 1], row, col + 1))
        k -= 1
    
    return heap[0][0]
```

---

### Tactic 2: Merge with Custom Comparator

```python
import functools

def merge_k_sorted_custom(lists, key=None):
    """Merge with custom key function."""
    heap = []
    
    for i, lst in enumerate(lists):
        if lst:
            val = key(lst[0]) if key else lst[0]
            heapq.heappush(heap, (val, i, 0, lst[0]))
    
    result = []
    while heap:
        _, i, j, orig = heapq.heappop(heap)
        result.append(orig)
        
        if j + 1 < len(lists[i]):
            next_val = key(lists[i][j+1]) if key else lists[i][j+1]
            heapq.heappush(heap, (next_val, i, j+1, lists[i][j+1]))
    
    return result
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Wrong heap element | Lost track | Include list and element indices |
| Not checking bounds | Index error | Check len before accessing |
| Empty lists | Heap error | Check list not empty before push |
| No lazy loading | Memory | Only push when needed |

---

### Tactic 4: Merge K Largest

```python
def merge_k_largest(lists, k):
    """Find K largest from K sorted lists."""
    # Use max heap (negate values) or min heap of size k
    heap = []
    
    for lst in lists:
        for val in lst:
            if len(heap) < k:
                heapq.heappush(heap, val)
            elif val > heap[0]:
                heapq.heapreplace(heap, val)
    
    return sorted(heap, reverse=True)
```

<!-- back -->
