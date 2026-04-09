## Stack - Monotonic Stack: Core Concepts

What are the fundamental principles of the Monotonic Stack pattern?

<!-- front -->

---

### Core Concept

A **Monotonic Stack** maintains elements in **strictly increasing** or **strictly decreasing** order. When a new element violates this order, elements are popped until order is restored.

```
Decreasing Monotonic Stack (bottom to top):

Add 5:  [5]
Add 3:  [5, 3]       (3 < 5, OK - decreasing)
Add 7:  [5] → pop 3  (7 > 3, violates)
        [ ] → pop 5  (7 > 5, violates)
        [7]          (stack empty, push)
Add 4:  [7, 4]       (4 < 7, OK)

Result: Stack always decreasing from bottom to top
```

---

### Key "Aha!" Moments

| Insight | Explanation |
|---------|-------------|
| **Monotonic order** | Stack is always sorted (increasing or decreasing) |
| **Violation triggers processing** | New element "kills" previous smaller/larger ones |
| **Right-to-left iteration** | For next greater to the right, iterate from end |
| **Store indices** | Store indices, not values, to compute distances |
| **Pop while condition holds** | Remove elements that can't be answers anymore |

---

### Visual: Finding Next Greater Element

```
Array: [2, 1, 2, 4, 3]
Goal: Find next greater element to the right

Stack (decreasing, stores indices):

i=0, val=2: Stack empty, push 0
            Stack: [0] (values: [2])

i=1, val=1: 1 < 2, push 1
            Stack: [0, 1] (values: [2, 1])

i=2, val=2: 2 > 1, pop 1 → NGE[1] = 2 (at index 2)
            2 == 2, not strictly greater, push 2
            Stack: [0, 2] (values: [2, 2])

i=3, val=4: 4 > 2, pop 2 → NGE[2] = 4
            4 > 2, pop 0 → NGE[0] = 4
            Stack empty, push 3
            Stack: [3] (values: [4])

i=4, val=3: 3 < 4, push 4
            Stack: [3, 4] (values: [4, 3])

End: No more elements. NGE[4] = -1 (default)

Final Result: [4, 2, 4, -1, -1]
```

---

### Why It Works (Correctness)

**Monotonicity Invariant**: When we push element `i`, all elements in stack:
1. Are to the left of `i` (already processed)
2. Are greater (or smaller) than `i`
3. Have no valid answer between their position and `i`

**Popping Correctness**: When we pop element `j` because `i` is greater:
- `i` is to the right of `j`
- `i` is the **first** element greater than `j` (stack was decreasing)
- Therefore `i` is the **next greater element** for `j`

---

### Common Applications

| Problem Type | Stack Order | What We Find | Example |
|--------------|-------------|--------------|---------|
| Next Greater Element | Decreasing | First larger to right | LeetCode 496 |
| Previous Greater | Decreasing (L-to-R) | First larger to left | Stock span |
| Next Smaller | Increasing | First smaller to right | LeetCode 901 |
| Daily Temperatures | Decreasing | Days until warmer | LeetCode 739 |
| Largest Rectangle | Increasing | Boundaries for each bar | LeetCode 84 |
| Remove K Digits | Increasing | Build smallest number | LeetCode 402 |

---

### Time & Space Complexity

| Aspect | Complexity | Why |
|--------|------------|-----|
| Time | O(n) | Each element pushed and popped at most once |
| Space | O(n) | Stack holds at most n elements |

**Proof of O(n) Time**: Each element is pushed exactly once and popped at most once. Total operations ≤ 2n.

<!-- back -->
