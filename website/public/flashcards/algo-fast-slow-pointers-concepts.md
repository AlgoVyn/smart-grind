## Fast-Slow Pointers: Core Concepts

What is the fast-slow (tortoise-hare) pointer technique and when is it used?

<!-- front -->

---

### Fundamental Definition

Fast-slow pointers use two pointers moving at different speeds through a sequence (typically a linked list).

| Pointer | Speed | Purpose |
|---------|-------|---------|
| **Slow** | 1 step at a time | Marks position, detects cycles entry |
| **Fast** | 2 steps at a time | Detects cycles, finds middle |

```
Initial: S→F→→→
Step 1:  →S→→F→
Step 2:  →→S→→→F
```

---

### Core Applications

| Problem Type | Fast-Slow Solution |
|--------------|-------------------|
| **Cycle detection** | If fast meets slow → cycle exists |
| **Middle element** | When fast reaches end, slow is at middle |
| **kth from end** | Fast leads by k, both move together |
| **Cycle start** | After meeting, reset one pointer to head |
| **Duplicate detection** | In array-as-linked-list problems |

---

### Floyd's Cycle Detection (Tortoise and Hare)

**Key insight:** If there's a cycle, fast pointer will eventually catch slow.

```
Cycle length = C
Non-cycle length = L

Fast gains 1 step per iteration on slow
Meeting point: L + k·C steps from start
```

**Why it works:**
- If no cycle: fast reaches null
- If cycle: relative speed = 1, so fast laps slow

---

### Complexity Analysis

| Aspect | Value |
|--------|-------|
| **Time** | O(n) - each pointer visits nodes ≤ n times |
| **Space** | O(1) - only two pointers |
| **Guarantee** | Detects cycle in ≤ n steps |

**Proof:**
- No cycle: fast visits n/2 nodes → O(n)
- With cycle: distance decreases by 1 each step → O(n)

<!-- back -->
