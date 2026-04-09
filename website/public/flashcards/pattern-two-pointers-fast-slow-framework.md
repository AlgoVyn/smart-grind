## Two Pointers - Fast & Slow: Framework

What is the complete code template for implementing Fast & Slow pointer solutions?

<!-- front -->

---

### Framework 1: Basic Cycle Detection Template

```
┌─────────────────────────────────────────────────────┐
│  FAST & SLOW - BASIC CYCLE DETECTION                 │
├─────────────────────────────────────────────────────┤
│  1. Initialize slow = head, fast = head              │
│  2. While fast exists and fast.next exists:         │
│     a. Move slow 1 step: slow = slow.next          │
│     b. Move fast 2 steps: fast = fast.next.next    │
│     c. If slow == fast: return True (cycle found)  │
│  3. Return False (no cycle - fast hit end)         │
└─────────────────────────────────────────────────────┘
```

**Implementation:**

```python
def has_cycle(head):
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

### Framework 2: Find Cycle Entrance Template

```
┌─────────────────────────────────────────────────────┐
│  FAST & SLOW - FIND CYCLE ENTRANCE                   │
├─────────────────────────────────────────────────────┤
│  PHASE 1: Find Meeting Point                         │
│  1. Initialize slow = fast = head                   │
│  2. While fast and fast.next:                      │
│     a. slow = slow.next, fast = fast.next.next     │
│     b. If slow == fast: break (found meeting)      │
│  3. If loop ended normally: return None (no cycle) │
│                                                      │
│  PHASE 2: Find Entrance                              │
│  4. Reset slow = head                               │
│  5. While slow != fast:                            │
│     a. Move both 1 step: slow = slow.next         │
│     b. fast = fast.next                            │
│  6. Return slow (or fast) - this is the entrance   │
└─────────────────────────────────────────────────────┘
```

**Implementation:**

```python
def detect_cycle_start(head):
    if not head or not head.next:
        return None
    
    # Phase 1: Find meeting point
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return None  # No cycle
    
    # Phase 2: Find entrance
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow
```

---

### Framework 3: Find Middle Element Template

```
┌─────────────────────────────────────────────────────┐
│  FAST & SLOW - FIND MIDDLE ELEMENT                   │
├─────────────────────────────────────────────────────┤
│  1. Initialize slow = head, fast = head             │
│  2. While fast and fast.next:                      │
│     a. slow = slow.next (move 1 step)              │
│     b. fast = fast.next.next (move 2 steps)        │
│  3. Return slow (middle when fast reaches end)     │
└─────────────────────────────────────────────────────┘
```

**Implementation:**

```python
def find_middle(head):
    if not head:
        return None
    
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow  # Second middle for even length
```

---

### Key Pattern Elements

| Element | Purpose | Common Mistake |
|---------|---------|----------------|
| `fast and fast.next` check | Prevent null pointer | Using just `fast` misses one-node check |
| Same starting point | Both from head | Starting fast at head.next also works |
| 1:2 speed ratio | Guaranteed meeting | Other ratios need math verification |
| Reset to head for entrance | Math property | Forgetting this phase entirely |

<!-- back -->
