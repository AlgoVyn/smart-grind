## Fast & Slow Pointers (Cycle Detection): Framework

What is the complete code template for Floyd's Tortoise and Hare algorithm?

<!-- front -->

---

### Framework: Floyd's Cycle Detection Algorithm

```
┌─────────────────────────────────────────────────────────────────────┐
│  FLOYD'S TORTOISE AND HARE - TEMPLATE                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  PHASE 1: Find Meeting Point (if cycle exists)                       │
│  ─────────────────────────────────────────────                      │
│  - Initialize: slow = head, fast = head                             │
│  - Loop while fast and fast.next exist:                            │
│      slow = slow.next        (move 1 step)                          │
│      fast = fast.next.next   (move 2 steps)                         │
│      if slow == fast: break  (cycle detected!)                     │
│  - If loop exits normally: return None  (no cycle)                 │
│                                                                     │
│  PHASE 2: Find Cycle Entrance (after meeting point found)          │
│  ──────────────────────────────────────────────────────────────    │
│  - Reset: slow = head                                               │
│  - Loop while slow != fast:                                        │
│      slow = slow.next        (move 1 step)                          │
│      fast = fast.next        (move 1 step)                          │
│  - Return slow  (or fast) - this is the cycle entrance             │
│                                                                     │
│  Why it works: distance(start → entrance) = distance(meeting → entrance)
└─────────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Complete Cycle Detection

```python
def detect_cycle(head):
    """
    Complete Floyd's algorithm - returns cycle start node or None.
    Time: O(n), Space: O(1)
    """
    if not head or not head.next:
        return None
    
    # Phase 1: Find meeting point
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return None  # No cycle
    
    # Phase 2: Find cycle entrance
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow


def has_cycle(head):
    """
    Simplified version - returns True/False only.
    Only needs Phase 1.
    """
    if not head or not head.next:
        return False
    
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    
    return False
```

---

### Implementation: Find Middle of Linked List

```python
def find_middle(head):
    """
    Fast-slow for finding middle element.
    When fast reaches end, slow is at middle.
    """
    if not head:
        return None
    
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next      # 1 step
        fast = fast.next.next # 2 steps
    
    return slow  # Middle node (second middle if even length)
```

---

### Key Framework Elements

| Element | Purpose | Initialization |
|---------|---------|----------------|
| `slow` | Moves 1 step at a time | `head` |
| `fast` | Moves 2 steps at a time | `head` |
| Meeting point | Proves cycle exists | `slow == fast` |
| Entrance finding | Locates cycle start | Reset `slow` to `head` |
| Loop condition | Handle edge cases | `fast and fast.next` |

---

### Complexity Summary

| Approach | Time | Space | Use Case |
|----------|------|-------|----------|
| Cycle Detection (Phase 1) | O(n) | O(1) | Has cycle? |
| Find Start (Phase 1+2) | O(n) | O(1) | Where is cycle? |
| Middle Element | O(n) | O(1) | Find midpoint |

<!-- back -->
