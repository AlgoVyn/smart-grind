## Linked List - In-place Reversal: Core Concepts

What are the fundamental concepts behind in-place linked list reversal?

<!-- front -->

---

### The Core Insight

**Pointer redirection**: Each node's `next` pointer is flipped to point to its **predecessor** instead of its **successor**.

```
Before reversal:        After reversal:
1 → 2 → 3 → 4          1 ← 2 ← 3 ← 4
↑                      ↑
head                   head (now points to 4)
```

**Key realization**: We don't need extra memory — just three pointers to manipulate the links in place.

---

### The "Aha!" Moments

| Moment | Insight | Why It Matters |
|----------|---------|----------------|
| **Three pointers suffice** | `prev`, `current`, `next_node` are all we need | O(1) space guarantee |
| **Save before overwriting** | Always store `current.next` before changing it | Prevents losing the rest of the list |
| **Dummy node pattern** | Place node before head | Handles `left = 1` edge case in sublist reversal |
| **Iterative advancement** | Move pointers in sequence: save → flip → advance | Clean, single-pass algorithm |
| **Return `prev` not `current`** | After loop, `current` is null, `prev` is last node | Common bug: returning wrong pointer |

---

### Pointer Lifecycle

```
┌──────────────────────────────────────────────────────────┐
│  FOR EACH NODE:                                          │
│                                                          │
│  1. SAVE:  next_node = current.next   (preserve access)   │
│                                                          │
│  2. FLIP:  current.next = prev        (reverse link)      │
│                                                          │
│  3. MOVE:  prev = current             (advance prev)      │
│            current = next_node        (advance current)   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

### Why O(1) Space?

| Data Structure | Space | Why Not Needed |
|----------------|-------|----------------|
| Stack (recursion) | O(n) | Iterative avoids call stack |
| Array of nodes | O(n) | Pointers track position directly |
| New list creation | O(n) | We modify existing links |

**Result**: Only 3 pointer variables regardless of list size.

---

### Singly vs Doubly Linked List Reversal

| Aspect | Singly Linked | Doubly Linked |
|--------|---------------|---------------|
| Pointers to flip | `next` only | Both `next` and `prev` |
| Complexity | O(n) time, O(1) space | O(n) time, O(1) space |
| Implementation | Simpler | Swap both pointers at each node |
| Use case | Most interview problems | Full data structure reversal |

```python
# Doubly linked list reversal (swap both pointers)
def reverse_doubly(head):
    current = head
    while current:
        current.prev, current.next = current.next, current.prev
        current = current.prev  # prev is original next
    return head.prev if head else None  # new head
```

---

### Time/Space Complexity Breakdown

| Approach | Time | Space | Why |
|----------|------|-------|-----|
| Iterative | O(n) | O(1) | Single pass, 3 pointers |
| Recursive | O(n) | O(n) | Call stack for n frames |
| Using stack | O(n) | O(n) | Explicit stack of nodes |

**Always prefer iterative** for interviews unless recursion specifically requested.

---

### Common State Bugs

```
❌ Bug: Forgetting to save next first
   current.next = prev           # Lost rest of list!
   next_node = current.next      # next_node is now prev!

✅ Correct order:
   next_node = current.next      # Save first
   current.next = prev           # Then flip

❌ Bug: Returning current instead of prev
   while current:
       ...
   return current                # current is null!

✅ Correct:
   return prev                   # prev is new head
```

<!-- back -->
