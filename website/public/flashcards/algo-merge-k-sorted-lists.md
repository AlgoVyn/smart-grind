## Merge K Sorted Lists

**Question:** How do you merge k sorted linked lists into one sorted list efficiently?

<!-- front -->

---

## Answer: Use a Min-Heap

### Approach
Use a min-heap to always get the smallest element across all lists.

### Solution
```python
import heapq

def mergeKLists(lists):
    heap = []
    
    # Add first node from each list
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    
    dummy = curr = ListNode(0)
    
    while heap:
        val, i, node = heapq.heappop(heap)
        curr.next = node
        curr = curr.next
        
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    
    return dummy.next
```

### Complexity Analysis
- **Time:** O(N log k) where N = total nodes, k = lists
- **Space:** O(k) for heap

### Alternatives
| Method | Time | Space |
|--------|------|-------|
| Merge one by one | O(Nk) | O(1) |
| Divide & Conquer | O(N log k) | O(1) |
| **Heap** | O(N log k) | O(k) |

### ⚠️ Key Points
- Keep track of which list each node came from
- Handle edge case: empty lists

<!-- back -->
