## Fast & Slow Pointers (Cycle Detection): Core Concepts

What are the fundamental concepts behind the Tortoise and Hare algorithm?

<!-- front -->

---

### The Core Insight

**Why Fast & Slow Pointers Always Meet in a Cycle**

Imagine two runners on a circular track:
- **Tortoise (slow)**: Speed 1 → moves 1 step per iteration
- **Hare (fast)**: Speed 2 → moves 2 steps per iteration

Once both enter the cycle, the hare gains 1 step per iteration on the tortoise. Eventually, the hare (from behind) catches up to the tortoise. **They must meet.**

```
Cycle length = 5 nodes

Start:    T1 → T2 → T3 → T4 → T5
          ↑                    ↓
          └────────────────────┘

Hare catches Tortoise because:
- Relative speed = 2 - 1 = 1 step per iteration
- After k iterations: Hare is k steps ahead
- Hare laps Tortoise in at most (cycle length) iterations
```

---

### The "Aha!" Moments

| Moment | Insight | Why It Matters |
|--------|---------|----------------|
| **Speed 2:1** | Fast moves twice as fast as slow | Guarantees meeting in any cycle |
| **Null check** | Check `fast` AND `fast.next` | Prevents null pointer exceptions |
| **Phase separation** | Meeting ≠ Entrance | Two-phase algorithm needed for entrance |
| **Reset trick** | Reset slow to head, both move at speed 1 | Magically finds cycle entrance |
| **Relative motion** | Think in terms of relative speed | Explains why algorithm works |

---

### Why Finding Entrance Works (The Math)

Let:
- `a` = distance from start to cycle entrance
- `b` = distance from entrance to meeting point
- `c` = distance from meeting point back to entrance (rest of cycle)

When slow and fast meet:
- Slow traveled: `a + b` (plus maybe some full cycles)
- Fast traveled: `a + b + n(b + c)` (n laps around cycle)
- Since fast moves 2× speed: `2(a + b) = a + b + n(b + c)`
- Simplifying: `a = n(b + c) - b = (n-1)(b + c) + c`

**Key insight**: `a = c` (mod cycle length). Distance from start to entrance equals distance from meeting point to entrance!

```
Start ─────a────→ Entrance ─────b────→ Meeting Point
                                                ↓
                                     c (the rest of cycle)
                                                ↓
                                          back to Entrance

a = c  →  Reset slow to start, move both at speed 1:
          - Slow travels a to reach entrance
          - Fast (at meeting point) travels c to reach entrance
          - They meet at entrance!
```

---

### Pointer Roles

| Pointer | Speed | Responsibility |
|---------|-------|----------------|
| **Slow (Tortoise)** | 1 step/iteration | Baseline traversal, meeting reference |
| **Fast (Hare)** | 2 steps/iteration | Cycle detection, lapping slow pointer |

---

### When This Pattern Applies

**Use Fast & Slow when:**
1. Linked list cycle detection needed
2. Finding middle element without counting
3. Sequence transforms into itself (happy numbers)
4. Array treated as linked list (values as pointers)
5. O(1) space required (beats hash set approach)

**Don't use when:**
1. Need to know exact cycle length (requires extra work)
2. Structure isn't a linked structure
3. You can modify the list (mark with flag/negative values)

---

### Time/Space Complexity Breakdown

| Aspect | Value | Explanation |
|--------|-------|-------------|
| **Time** | O(n) | Each pointer visits at most n nodes |
| **Space** | O(1) | Only two pointers, no extra data structures |
| **Passes** | 1-2 | Phase 1 only or Phase 1+2 |

<!-- back -->
