## Merge K Sorted Lists

**Question:** Merge k sorted linked lists into one sorted list?

<!-- front -->

---

## Answer: Min Heap

### Solution
```python
import heapq

def mergeKLists(lists):
    heap = []
    
    # Add first node from each list
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst.val, i, lst))
    
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

### Visual: Heap Operations
```
Lists: [1→4→5], [1→3→4], [2→6]

Step 1: heap = [(1,0,L1), (1,1,L2), (2,2,L3)]
        pop (1,0) → add L1.next=4
        heap = [(1,1,L2), (2,2,L3), (4,0,L1)]

Step 2: pop (1,1) → add L2.next=3
        heap = [(2,2,L3), (4,0,L1), (3,1,L2)]

Step 3: pop (2,2) → add L3.next=6
        heap = [(3,1,L2), (4,0,L1), (6,2,L3)]

Continue until all nodes merged...

Result: 1→1→2→3→4→4→5→6
```

### ⚠️ Tricky Parts

#### 1. Why Store Index?
```python
# Python requires comparable items
# Tuples (val, index, node) compare by first element
# If values equal, compare by index
# This ensures deterministic ordering
```

#### 2. Divide and Conquer
```python
def mergeKListsDC(lists):
    if not lists:
        return None
    if len(lists) == 1:
        return lists[0]
    
    mid = len(lists) // 2
    left = mergeKListsDC(lists[:mid])
    right = mergeKListsDC(lists[mid:])
    
    return mergeTwo(left, right)

def mergeTwo(l1, l2):
    dummy = ListNode()
    current = dummy
    
    while l1 and l2:
        if l1.val < l2.val:
            current.next = l1
            l1 = l1.next
        else:
            current.next = l2
            l2 = l2.next
        current = current.next
    
    current.next = l1 or l2
    return dummy.next
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Heap | O(N log k) | O(k) |
| Divide & Conquer | O(N log k) | O(log k) |
| Brute Force | O(Nk) | O(1) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Forgetting to add next | Add node.next to heap |
| No index in heap | Store (val, index, node) |
| Not checking empty | Check list before adding |

<!-- back -->
