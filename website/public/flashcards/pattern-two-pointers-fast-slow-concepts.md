## Two Pointers - Fast & Slow: Core Concepts

What are the fundamental principles of the Fast & Slow pointer pattern for cycle detection?

<!-- front -->

---

### Core Concept

Use **two pointers moving at different speeds** through a linked structure. If there's a cycle, the faster pointer will eventually catch up to the slower one.

**Key insight**: A fast pointer (2 steps) and slow pointer (1 step) will meet inside any cycle due to relative speed difference.

---

### The Math Behind It

| Pointer | Speed | Position after t steps |
|---------|-------|----------------------|
| Slow | 1 step/tick | t |
| Fast | 2 steps/tick | 2t |

**Why they meet**: Fast gains 1 step per iteration. In a cycle of length C, fast will lap slow after at most C iterations.

---

### Visual: Tortoise and Hare

```
Start:  1 → 2 → 3 → 4 → 5 → 6
                    ↑         ↓
                    └─────────┘
        
        S/F
        ↓
        1 → 2 → 3 → 4 → 5 → 6
        
t=0:    S=1, F=1 (start)
t=1:    S=2, F=3
t=2:    S=3, F=5
t=3:    S=4, F=4 ← MEET! Cycle detected
```

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| Cycle Detection | Linked list has loop | Linked List Cycle |
| Cycle Start | Find where cycle begins | Linked List Cycle II |
| Middle Element | Find middle of list | Middle of Linked List |
| Happy Number | Detect infinite loops | Happy Number |
| Duplicate Find | Find duplicate in array | Find Duplicate Number |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n) | Single traversal |
| Space | O(1) | Only two pointers |

<!-- back -->
