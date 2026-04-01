## Title: Merge k Sorted Lists

What is the Merge k Sorted Lists problem and how is it solved?

<!-- front -->

---

### Definition
Merge k sorted linked lists into one sorted list. Each list is sorted in ascending order.

### Approaches
| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Brute force | O(N log N) | O(N) | Concatenate + sort |
| Min-heap | O(N log k) | O(k) | k = number of lists |
| Divide & conquer | O(N log k) | O(log k) | Recursive merge |
| Pairwise merge | O(Nk) | O(1) | Merge 2 at a time |

### Min-Heap Approach
```python
import heapq

def merge_k_lists_heap(lists):
    """Use heap to track min of each list"""
    # Handle empty input
    if not lists or not any(lists):
        return None
    
    # Min heap of (value, list_index, node)
    # Need list_index as tie-breaker for equal values
    heap = []
    for i, head in enumerate(lists):
        if head:
            heapq.heappush(heap, (head.val, i, head))
    
    dummy = ListNode(0)
    current = dummy
    
    while heap:
        val, i, node = heapq.heappop(heap)
        current.next = node
        current = current.next
        
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    
    return dummy.next
```

---

### Divide and Conquer
```python
def merge_k_lists_dac(lists):
    """Merge pairs of lists recursively"""
    if not lists:
        return None
    if len(lists) == 1:
        return lists[0]
    
    mid = len(lists) // 2
    left = merge_k_lists_dac(lists[:mid])
    right = merge_k_lists_dac(lists[mid:])
    
    return merge_two_lists(left, right)

def merge_two_lists(l1, l2):
    dummy = ListNode(0)
    current = dummy
    
    while l1 and l2:
        if l1.val <= l2.val:
            current.next = l1
            l1 = l1.next
        else:
            current.next = l2
            l2 = l2.next
        current = current.next
    
    current.next = l1 or l2
    return dummy.next
```

---

### Complexity Comparison
| Approach | Time | Space | When Best |
|----------|------|-------|-----------|
| Heap | O(N log k) | O(k) | General case |
| D&C | O(N log k) | O(log k) stack | k very large |
| Pairwise | O(Nk) | O(1) | k small |
| Brute | O(N log N) | O(N) | Never optimal |

<!-- back -->
