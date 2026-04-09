## Stack - Min Stack Design: Core Concepts

What is the fundamental principle behind O(1) minimum retrieval in a Min Stack?

<!-- front -->

---

### Core Concept

**Store the minimum at each state** so it's always available without searching.

Key insight: At every point in the stack's history, we need to know "what was the minimum when this element was pushed?"

---

### The Pattern Illustrated

```
Operations: push(5), push(3), push(7), push(2), pop()

┌─────────────────────────────────────────────────────────┐
│  Pair Storage Approach                                  │
├─────────────────────────────────────────────────────────┤
│  push(5): Stack = [(5, 5)]                              │
│           Current min = 5                               │
│                                                         │
│  push(3): Stack = [(5, 5), (3, 3)]                      │
│           Current min = 3  ← min(3, 5)                  │
│                                                         │
│  push(7): Stack = [(5, 5), (3, 3), (7, 3)]              │
│           Current min = 3  ← min(7, 3)                  │
│                                                         │
│  push(2): Stack = [(5, 5), (3, 3), (7, 3), (2, 2)]      │
│           Current min = 2  ← min(2, 3)                  │
│                                                         │
│  pop():   Stack = [(5, 5), (3, 3), (7, 3)]              │
│           Current min = 3  ← restored automatically!    │
└─────────────────────────────────────────────────────────┘
```

---

### Key Mechanics

| Push Action | Calculation | Result |
|-------------|-------------|--------|
| First element | `min = val` | val is the min |
| Subsequent | `min = min(val, current_min)` | Update if smaller |
| Pop | None needed | Previous min already stored |
| GetMin | Return stored min | O(1) access |

---

### The "Aha!" Moments

1. **Pair storage**: Each element carries its historical context
2. **Minimum restoration**: When popping, previous minimum is already stored in the next element
3. **No searching needed**: The min is always at your fingertips
4. **O(1) guarantee**: Constant time for all operations

---

### Common Applications

| Problem Type | Description | Key Operation |
|--------------|-------------|---------------|
| **Min Stack** | Track minimum with stack ops | getMin() |
| **Max Stack** | Track maximum instead | getMax() |
| **Stack Stats** | Track any running aggregate | push/pop with stats |
| **Sliding Window** | Min in variable window | Monotonic variant |

<!-- back -->
