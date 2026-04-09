## Heap - K-way Merge: Framework

What is the complete code template for k-way merge?

<!-- front -->

---

### Framework 1: K-way Merge with Heap

```
┌─────────────────────────────────────────────────────┐
│  K-WAY MERGE - TEMPLATE                                │
├─────────────────────────────────────────────────────┤
│  1. Initialize min-heap                                │
│     For each list i:                                  │
│        If list i not empty:                         │
│           Push (val, list_idx, elem_idx) to heap    │
│                                                        │
│  2. While heap not empty:                             │
│     a. Pop smallest (val, i, j) from heap            │
│     b. Add val to result                              │
│     c. If next element exists in list i:            │
│        Push (next_val, i, j+1) to heap              │
│                                                        │
│  3. Return result                                      │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
import heapq

def merge_k_sorted(lists):
    """
    Merge K sorted lists.
    Time: O(N log K), Space: O(K)
    """
    result = []
    heap = []
    
    # Initialize with first element from each list
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))
    
    while heap:
        val, list_idx, elem_idx = heapq.heappop(heap)
        result.append(val)
        
        # Add next element from same list
        if elem_idx + 1 < len(lists[list_idx]):
            next_val = lists[list_idx][elem_idx + 1]
            heapq.heappush(heap, (next_val, list_idx, elem_idx + 1))
    
    return result
```

---

### Implementation: Merge K Linked Lists

```python
def merge_k_lists(lists):
    """Merge K sorted linked lists."""
    heap = []
    
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    
    dummy = ListNode(0)
    current = dummy
    
    while heap:
        val, idx, node = heapq.heappop(heap)
        current.next = node
        current = current.next
        
        if node.next:
            heapq.heappush(heap, (node.next.val, idx, node.next))
    
    return dummy.next
```

---

### Key Pattern Elements

| Element | Purpose |
|---------|---------|
| Heap | O(log K) access to minimum |
| List index | Track which list element came from |
| Element index | Track position in list |
| Lazy loading | Only load next when current consumed |

<!-- back -->
