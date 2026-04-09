## Sliding Window - Monotonic Queue: Core Concepts

What are the fundamental principles of using monotonic queues with sliding windows?

<!-- front -->

---

### Core Concept

Use **a deque (double-ended queue) that maintains elements in monotonic order** to efficiently find maximum or minimum in every sliding window.

**Key insight**: Elements that are "worse" than new elements will never be the maximum/minimum in future windows, so they can be removed.

---

### The Pattern

```
Find max in each window of size k=3:

Array: [1, 3, -1, -3, 5, 3, 6, 7]

i=0, val=1: deque=[1] (indices: [0])
i=1, val=3: Remove 1 (3 > 1), deque=[3]
i=2, val=-1: deque=[3, -1]
           Window [0..2] ends: max=3 ✓

i=3, val=-3: deque=[3, -1, -3]
           Remove 0 (out of window), deque=[3, -1, -3]
           Window ends: max=3 ✓

i=4, val=5: Remove -3, -1, 3 (all < 5), deque=[5]
           Window [2..4]: max=5 ✓

Result: [3, 3, 5, 5, 6, 7]
```

---

### Monotonic Property

| Queue Type | Order | Removal Condition |
|------------|-------|-------------------|
| **Max Queue** | Decreasing | Remove from back if smaller than new |
| **Min Queue** | Increasing | Remove from back if larger than new |

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| Sliding Window Maximum | Max in each window | Sliding Window Maximum |
| Sliding Window Minimum | Min in each window | Min in Window |
| Max of Min | Find max of all window minimums | Complex variations |
| Constrained Subarray | Max with constraints | Monotonic queue + DP |
| Shortest Subarray | Sum at least K | Shortest Subarray with Sum at Least K |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n) | Each element pushed/popped once |
| Space | O(k) | At most k elements in deque |
| Naive | O(n × k) | Recalculate max each window |

<!-- back -->
