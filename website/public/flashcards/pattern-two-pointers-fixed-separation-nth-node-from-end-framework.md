## Two Pointers - Fixed Separation (Nth Node from End): Framework

What is the complete algorithmic framework for finding the nth node from the end using fixed separation?

<!-- front -->

---

### Core Framework

```
┌────────────────────────────────────────────────────────────┐
│  FIND NTH NODE FROM END - FIXED SEPARATION                  │
├────────────────────────────────────────────────────────────┤
│  Phase 1: Gap Creation                                      │
│  ─────────────────────                                      │
│  slow = head                                                │
│  fast = head                                                │
│  for i from 0 to n-1:                                       │
│      if fast is null: return null  (list < n)             │
│      fast = fast.next                                       │
│                                                             │
│  Phase 2: Simultaneous Traversal                            │
│  ─────────────────────────────                              │
│  while fast is not null:                                    │
│      slow = slow.next                                       │
│      fast = fast.next                                       │
│                                                             │
│  Phase 3: Result                                            │
│  ─────────────────                                          │
│  return slow  (points to nth node from end)                 │
└────────────────────────────────────────────────────────────┘
```

---

### Framework for Finding nth Node from End

```python
def find_nth_from_end(head, n):
    """
    Find the nth node from the end of a linked list.
    Time: O(L), Space: O(1) where L is list length
    """
    if not head:
        return None
    
    slow = fast = head
    
    # Phase 1: Move fast n steps ahead to create gap
    for _ in range(n):
        if not fast:
            return None  # n exceeds list length
        fast = fast.next
    
    # Phase 2: Move both until fast reaches end
    while fast:
        slow = slow.next
        fast = fast.next
    
    # Phase 3: slow is at nth from end
    return slow
```

---

### Framework for Removing nth Node from End

```python
def remove_nth_from_end(head, n):
    """
    Remove nth node from end using dummy node.
    Time: O(L), Space: O(1)
    """
    dummy = ListNode(0, head)
    slow = fast = dummy
    
    # Phase 1: Move fast n+1 steps (gap includes target)
    for _ in range(n + 1):
        fast = fast.next
    
    # Phase 2: Move both until fast is null
    while fast:
        slow = slow.next
        fast = fast.next
    
    # Phase 3: slow is before target, skip over it
    slow.next = slow.next.next
    return dummy.next
```

---

### Key Framework Differences

| Scenario | Gap Size | Starting Point | Purpose |
|----------|----------|----------------|---------|
| Find nth node | n steps | head | Point slow at target |
| Remove nth node | n+1 steps | dummy | Point slow before target |
| Return value only | n steps | head | Return slow.val |

---

### Edge Case Handling

```
Case: Remove head node (n = list length)
┌────────────────────────────────────────┐
│  List: 1 → 2 → 3, n = 3                │
│  After dummy: dummy → 1 → 2 → 3        │
│  Move fast 4 steps: fast = null          │
│  slow stays at dummy                     │
│  slow.next = slow.next.next (removes 1) │
│  Return dummy.next = 2 → 3              │
└────────────────────────────────────────┘
```

---

### Implementation Checklist

- [ ] Initialize both pointers correctly (head or dummy)
- [ ] Move fast the exact number of steps (n or n+1)
- [ ] Check for null during gap creation (list < n)
- [ ] Move both pointers together until fast is null
- [ ] For removal: slow points to node BEFORE target
- [ ] For finding: slow points directly to target
- [ ] Return appropriate value (node, node.val, or new head)

<!-- back -->
