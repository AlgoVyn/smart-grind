## Linked List - In-Place Reversal: Framework

What is the complete code template for linked list reversal?

<!-- front -->

---

### Framework 1: Full List Reversal

```
┌─────────────────────────────────────────────────────┐
│  LINKED LIST REVERSAL - ITERATIVE TEMPLATE           │
├─────────────────────────────────────────────────────┤
│  1. Initialize:                                     │
│     - prev = None                                   │
│     - curr = head                                   │
│     - next = None                                   │
│                                                      │
│  2. While curr is not None:                        │
│     a. next = curr.next  (store next)             │
│     b. curr.next = prev  (reverse link)            │
│     c. prev = curr       (move prev forward)       │
│     d. curr = next       (move curr forward)       │
│                                                      │
│  3. Return prev (new head)                         │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Full Reversal

```python
def reverse_list(head):
    """Reverse entire linked list in-place."""
    prev = None
    curr = head
    
    while curr:
        next_temp = curr.next  # Store next
        curr.next = prev       # Reverse
        prev = curr            # Move prev
        curr = next_temp       # Move curr
    
    return prev  # New head
```

---

### Implementation: Reverse First K Nodes

```python
def reverse_k_nodes(head, k):
    """Reverse first k nodes of list."""
    prev = None
    curr = head
    count = 0
    
    # Reverse k nodes
    while curr and count < k:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
        count += 1
    
    # head is now the k-th node (last of reversed part)
    # curr is (k+1)-th node
    # Connect: original head points to remaining list
    head.next = curr
    
    return prev  # New head (k-th node)
```

---

### Implementation: Reverse Between Positions

```python
def reverse_between(head, left, right):
    """Reverse nodes from position left to right."""
    if not head or left == right:
        return head
    
    dummy = ListNode(0, head)
    prev = dummy
    
    # Move prev to node before left
    for _ in range(left - 1):
        prev = prev.next
    
    # curr is at left
    curr = prev.next
    
    # Reverse (right - left) times
    for _ in range(right - left):
        temp = curr.next
        curr.next = temp.next
        temp.next = prev.next
        prev.next = temp
    
    return dummy.next
```

---

### Key Pattern Elements

| Pointer | Role | Movement |
|---------|------|----------|
| `prev` | Previous node (new next) | Forward |
| `curr` | Current node being processed | Forward |
| `next` | Temporary storage for next | - |

<!-- back -->
