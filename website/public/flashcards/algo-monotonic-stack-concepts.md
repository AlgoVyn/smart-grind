## Monotonic Stack: Core Concepts

What are the fundamental principles of the monotonic stack pattern?

<!-- front -->

---

### Core Concept

A stack that maintains elements in **strictly increasing** or **strictly/decreasing** order.

When a new element violates the order, pop elements until order is restored.

```
Increasing monotonic stack (bottom to top):

Add 5:  [5]
Add 3:  [5]        (pop 5, add 3) → [3]
Add 7:  [3, 7]     (7 > 3, OK)
Add 4:  [3, 7]     (4 < 7, pop) → [3] → (4 > 3) → [3, 4]
Add 9:  [3, 4, 9]  (9 > 4, OK)
```

---

### Key Properties

| Property | Description |
|----------|-------------|
| Monotonicity | Stack always ordered (inc or dec) |
| Popping | Removes elements that can't be answers for future |
| Next Greater | Monotonic decreasing finds next greater |
| Previous Greater | Monotonic increasing finds previous greater |

---

### Visual: Finding Next Greater Element

```
Array: [2, 1, 2, 4, 3]
Goal: Find next greater element for each

Stack (decreasing, stores indices):

i=0, val=2: Stack empty, push 0
            Stack: [0] (values: [2])

i=1, val=1: 1 < 2, push 1
            Stack: [0, 1] (values: [2, 1])

i=2, val=2: 2 > 1, pop 1 → NGE[1] = 2
            2 == 2, not greater, push 2
            Stack: [0, 2] (values: [2, 2])

i=3, val=4: 4 > 2, pop 2 → NGE[2] = 4
            4 > 2, pop 0 → NGE[0] = 4
            Stack empty, push 3
            Stack: [3] (values: [4])

i=4, val=3: 3 < 4, push 4
            Stack: [3, 4] (values: [4, 3])

End: Pop remaining, NGE = -1
```

---

### Common Applications

| Problem Type | Stack Order | What We Find |
|--------------|-------------|--------------|
| Next Greater Element | Decreasing | First larger to right |
| Previous Greater | Decreasing (reverse) | First larger to left |
| Next Smaller | Increasing | First smaller to right |
| Largest Rectangle | Increasing | Boundaries for each bar |
| Stock Span | Decreasing | Consecutive smaller days |

---

### Why It Works (Correctness)

**Monotonicity invariant**: When we push element i, all elements in stack are:
1. To the left of i (already processed)
2. Greater (or smaller) than i
3. Have no valid answer between their position and i

**Popping correctness**: When we pop element j because i is greater:
- i is to the right of j
- i is the first element greater than j (stack was decreasing)
- Therefore i is the **next greater** for j

<!-- back -->
