## Two Pointers - Fixed Separation: Framework

What is the complete code template for fixed separation two-pointer solutions?

<!-- front -->

---

### Framework 1: Nth Node from End Template

```
┌─────────────────────────────────────────────────────┐
│  FIXED SEPARATION - NTH FROM END                     │
├─────────────────────────────────────────────────────┤
│  1. Initialize slow = head, fast = head           │
│  2. Move fast n steps ahead:                        │
│     For i from 0 to n-1:                            │
│        If fast is null: return None (list < n)      │
│        fast = fast.next                             │
│  3. While fast is not null:                         │
│        slow = slow.next                             │
│        fast = fast.next                             │
│  4. Return slow (points to nth from end)           │
└─────────────────────────────────────────────────────┘
```

---

### Implementation

```python
def find_nth_from_end(head, n):
    """Find the nth node from end (1-indexed)."""
    slow = fast = head
    
    # Move fast n steps ahead
    for _ in range(n):
        if not fast:
            return None  # List shorter than n
        fast = fast.next
    
    # Move both until fast reaches end
    while fast:
        slow = slow.next
        fast = fast.next
    
    return slow
```

---

### Framework 2: Remove Nth from End Template

```python
def remove_nth_from_end(head, n):
    """Remove nth node from end and return new head."""
    dummy = ListNode(0)
    dummy.next = head
    slow = fast = dummy
    
    # Move fast n+1 steps (to node before target)
    for _ in range(n + 1):
        fast = fast.next
    
    # Move both until fast is null
    while fast:
        slow = slow.next
        fast = fast.next
    
    # slow is now before the node to remove
    slow.next = slow.next.next
    return dummy.next
```

**Key difference**: Use dummy node to handle removal of first element

---

### Framework 3: Find Middle Element

```python
def find_middle(head):
    """Find middle using fixed separation of half length."""
    # Count length first (requires two passes)
    length = 0
    curr = head
    while curr:
        length += 1
        curr = curr.next
    
    # Second pass to middle
    slow = head
    for _ in range(length // 2):
        slow = slow.next
    
    return slow
```

**Better approach**: Fast & Slow (single pass)

<!-- back -->
