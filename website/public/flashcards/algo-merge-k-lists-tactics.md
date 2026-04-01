## Title: Merge k Lists Tactics

What are the key implementation tactics for k-way merging?

<!-- front -->

---

### Implementation Tactics

| Tactic | Benefit |
|--------|---------|
| Heap tie-breaker | Handle equal values |
| Iterative D&C | Avoid stack overflow |
| Sentinel nodes | Simplify edge cases |
| Lazy iterators | Memory efficiency |
| Batch reads | External sorting |

### Iterative Divide and Conquer
```python
def merge_k_lists_iterative(lists):
    """Iterative to avoid recursion depth issues"""
    if not lists:
        return None
    
    interval = 1
    while interval < len(lists):
        for i in range(0, len(lists) - interval, interval * 2):
            lists[i] = merge_two_lists(lists[i], lists[i + interval])
        interval *= 2
    
    return lists[0]
```

---

### Common Pitfalls
| Pitfall | Issue | Fix |
|---------|-------|-----|
| No tie-breaker | Heap comparison error | Add index |
| Empty lists | heapq error | Check before push |
| All lists empty | Wrong return | Return None/empty |
| Single list | Unnecessary work | Early return |
| Modifying input | Side effects | Copy if needed |

### Optimized Heap Operations
```python
# Using heapreplace is faster than heappop + heappush
while heap:
    val, i, node = heap[0]  # peek
    current.next = node
    current = node
    
    if node.next:
        heapq.heapreplace(heap, (node.next.val, i, node.next))
    else:
        heapq.heappop(heap)
```

---

### Memory Optimization
```python
def merge_k_lists_generator(lists):
    """Generator for streaming results"""
    import heapq
    
    heap = []
    for i, head in enumerate(lists):
        if head:
            heapq.heappush(heap, (head.val, i, head))
    
    while heap:
        val, i, node = heapq.heappop(heap)
        yield val
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))

# Usage: for val in merge_k_lists_generator(lists): process(val)
```

<!-- back -->
