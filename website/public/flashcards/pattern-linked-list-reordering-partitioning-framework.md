## Linked List Reordering/Partitioning: Framework

What is the complete code template for solving linked list reordering/partitioning problems?

<!-- front -->

---

### Framework: Linked List Partitioning

```
┌─────────────────────────────────────────────────────────────┐
│  LINKED LIST REORDERING/PARTITIONING - TEMPLATE             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Key Insight: Use multiple dummy heads for partitions      │
│                                                             │
│  1. Create dummy heads for each partition:                  │
│     - before_dummy = ListNode()  # nodes < x               │
│     - after_dummy = ListNode()   # nodes >= x              │
│                                                             │
│  2. Maintain tail pointers for each partition:             │
│     - before_tail = before_dummy                           │
│     - after_tail = after_dummy                             │
│                                                             │
│  3. Single pass through list:                             │
│     - while current:                                       │
│         - Append to appropriate partition                  │
│         - Move tail pointer forward                        │
│         - current = current.next                           │
│                                                             │
│  4. Connect partitions and terminate:                       │
│     - before_tail.next = after_dummy.next                  │
│     - after_tail.next = None  # CRITICAL: prevent cycles   │
│                                                             │
│  5. Return before_dummy.next                                │
└─────────────────────────────────────────────────────────────┘
```

---

### Implementation: Odd-Even Position Partitioning

```python
def odd_even_list(head: ListNode) -> ListNode:
    """
    Group odd-positioned nodes followed by even-positioned nodes.
    LeetCode 328 - Odd Even Linked List
    Time: O(n), Space: O(1)
    """
    if not head or not head.next:
        return head
    
    # Dummy nodes for odd and even partitions
    odd_dummy = ListNode()
    even_dummy = ListNode()
    odd_tail = odd_dummy
    even_tail = even_dummy
    
    current = head
    is_odd = True
    
    # Partition nodes by position
    while current:
        if is_odd:
            odd_tail.next = current
            odd_tail = odd_tail.next
        else:
            even_tail.next = current
            even_tail = even_tail.next
        
        is_odd = not is_odd
        current = current.next
    
    # Connect partitions and terminate
    odd_tail.next = even_dummy.next
    even_tail.next = None
    
    return odd_dummy.next
```

---

### Implementation: Value-Based Partitioning

```python
def partition(head: ListNode, x: int) -> ListNode:
    """
    Partition list around value x.
    LeetCode 86 - Partition List
    Time: O(n), Space: O(1)
    """
    before_dummy = ListNode()
    after_dummy = ListNode()
    before_tail = before_dummy
    after_tail = after_dummy
    
    current = head
    while current:
        if current.val < x:
            before_tail.next = current
            before_tail = before_tail.next
        else:
            after_tail.next = current
            after_tail = after_tail.next
        current = current.next
    
    before_tail.next = after_dummy.next
    after_tail.next = None
    
    return before_dummy.next
```

---

### Key Framework Elements

| Element | Purpose | Example |
|---------|---------|---------|
| `odd_dummy`, `even_dummy` | Dummy heads for partitions | Separate odd/even chains |
| `odd_tail`, `even_tail` | Track end of each partition | Append new nodes here |
| `is_odd` toggle | Position tracking | Alternate between partitions |
| `current` traversal | Iterate through list | Visit each node once |
| `tail.next = None` | Cycle prevention | Always terminate last partition |

---

### Template for K Partitions

```python
def partition_k(head: ListNode, k_partitions: int) -> ListNode:
    """
    General template for k-way partitioning.
    """
    # Create k dummy heads and tails
    dummies = [ListNode() for _ in range(k_partitions)]
    tails = dummies[:]
    
    current = head
    partition_idx = 0
    
    while current:
        # Append to current partition
        tails[partition_idx].next = current
        tails[partition_idx] = tails[partition_idx].next
        
        # Move to next partition (round-robin or by criteria)
        partition_idx = (partition_idx + 1) % k_partitions
        current = current.next
    
    # Connect all partitions in sequence
    for i in range(k_partitions - 1):
        tails[i].next = dummies[i + 1].next
    
    # Null terminate last partition
    tails[-1].next = None
    
    return dummies[0].next
```

<!-- back -->
