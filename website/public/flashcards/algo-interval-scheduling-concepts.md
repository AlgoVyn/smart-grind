## Interval Scheduling: Core Concepts

What is interval scheduling and what are the key greedy strategies?

<!-- front -->

---

### Fundamental Definition

**Interval Scheduling:** Select maximum-size subset of non-overlapping intervals.

| Variant | Objective |
|---------|-----------|
| **Maximum cardinality** | Most intervals |
| **Weighted** | Maximum total weight |
| **Resource allocation** | Minimum resources to schedule all |
| **Interval partitioning** | Minimum classrooms needed |

---

### Greedy Strategy: Earliest Finish Time

```
Algorithm:
1. Sort intervals by finish time (ascending)
2. Select first interval
3. For each subsequent interval:
   - If start >= last_selected_finish: select it

Why it works:
- Earliest finish leaves maximum room for remaining intervals
- Any optimal solution can be transformed to use this choice
```

---

### Proof of Optimality

```
Let G = greedy solution, O = optimal solution
Both sorted by finish time.

Claim: For all i, finish(G[i]) <= finish(O[i])
Proof by induction:
- Base: G[0] has earliest finish, so <= O[0].finish
- Inductive: Assume true for i-1
  G[i] is first interval starting after G[i-1]
  O[i] starts after O[i-1], which is >= G[i-1].finish
  So O[i] was available when G[i] was chosen
  Therefore G[i].finish <= O[i].finish

Thus |G| >= |O|, so G is optimal.
```

---

### Complexity Analysis

| Algorithm | Time | Space |
|-----------|------|-------|
| **Greedy (earliest finish)** | O(n log n) | O(n) or O(1) |
| **Weighted (DP)** | O(n log n) or O(n) | O(n) |
| **Interval partitioning** | O(n log n) | O(n) |

<!-- back -->
