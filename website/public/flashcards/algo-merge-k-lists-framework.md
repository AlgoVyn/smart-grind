## Title: Merge k Lists Framework

What is the standard framework for merging k sorted lists?

<!-- front -->

---

### Framework
```
MERGE_K_LISTS(lists[0..k-1]):
  
  // Approach 1: Min-Heap
  heap = empty min-heap
  for i = 0 to k-1:
    if lists[i] not empty:
      push (lists[i].val, i, lists[i]) to heap
  
  dummy = new ListNode(0)
  current = dummy
  
  while heap not empty:
    val, i, node = pop heap
    current.next = node
    current = node
    if node.next exists:
      push (node.next.val, i, node.next) to heap
  
  return dummy.next
  
  // Approach 2: Divide and Conquer
  if lists empty: return null
  if len(lists) == 1: return lists[0]
  
  mid = len(lists) / 2
  left = MERGE_K_LISTS(lists[0..mid-1])
  right = MERGE_K_LISTS(lists[mid..k-1])
  
  return MERGE_TWO_LISTS(left, right)
```

---

### Merge Two Lists (Subroutine)
```
MERGE_TWO_LISTS(l1, l2):
  dummy = new ListNode(0)
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

### Selection Strategy
| Scenario | Best Approach |
|----------|---------------|
| k small (< 10) | Pairwise or heap |
| k large | Heap or D&C |
| Memory constrained | D&C (less heap) |
| Linked lists large | Heap (better locality) |

---

### Comparison Pattern
```python
# Python heapq requires tie-breaker for equal values
heapq.heappush(heap, (node.val, list_index, node))

# list_index ensures unique comparison when vals equal
```

<!-- back -->
