## Linked List - Merge Two Sorted: Framework

What is the complete code template for merging sorted linked lists?

<!-- front -->

---

### Framework 1: Merge Two Lists Template

```
┌─────────────────────────────────────────────────────┐
│  MERGE TWO SORTED LISTS - TEMPLATE                   │
├─────────────────────────────────────────────────────┤
│  1. Create dummy head node                           │
│  2. Initialize tail = dummy                         │
│  3. While both lists not empty:                    │
│     a. If list1.val <= list2.val:                   │
│        - tail.next = list1                          │
│        - list1 = list1.next                         │
│     b. Else:                                         │
│        - tail.next = list2                          │
│        - list2 = list2.next                         │
│     c. tail = tail.next                             │
│  4. Link remaining nodes (one list will be done)  │
│     tail.next = list1 if list1 else list2           │
│  5. Return dummy.next                                │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Merge Two Lists

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_two_lists(list1, list2):
    """Merge two sorted linked lists."""
    dummy = ListNode(0)
    tail = dummy
    
    while list1 and list2:
        if list1.val <= list2.val:
            tail.next = list1
            list1 = list1.next
        else:
            tail.next = list2
            list2 = list2.next
        tail = tail.next
    
    # Link remaining
    tail.next = list1 if list1 else list2
    
    return dummy.next
```

---

### Implementation: Merge K Lists (with Heap)

```python
import heapq

def merge_k_lists(lists):
    """Merge k sorted linked lists."""
    dummy = ListNode(0)
    tail = dummy
    
    # Min heap: (val, list_index, node)
    # list_index breaks ties
    heap = []
    for i, node in enumerate(lists):
        if node:
            heapq.heappush(heap, (node.val, i, node))
    
    while heap:
        val, i, node = heapq.heappop(heap)
        tail.next = node
        tail = tail.next
        
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    
    return dummy.next
```

---

### Implementation: Add Two Numbers

```python
def add_two_numbers(l1, l2):
    """Add two numbers represented as linked lists."""
    dummy = ListNode(0)
    tail = dummy
    carry = 0
    
    while l1 or l2 or carry:
        val1 = l1.val if l1 else 0
        val2 = l2.val if l2 else 0
        
        total = val1 + val2 + carry
        carry = total // 10
        digit = total % 10
        
        tail.next = ListNode(digit)
        tail = tail.next
        
        l1 = l1.next if l1 else None
        l2 = l2.next if l2 else None
    
    return dummy.next
```

---

### Key Pattern Elements

| Element | Purpose | Note |
|---------|---------|------|
| `dummy` | Simplify edge cases | Return `dummy.next` |
| `tail` | Build result | Always advances |
| Remaining link | Finish merge | One list always has leftovers |

<!-- back -->
