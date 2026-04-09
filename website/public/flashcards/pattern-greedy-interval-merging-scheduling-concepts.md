## Greedy - Interval Merging/Scheduling: Core Concepts

What are the fundamental concepts behind interval merging and scheduling?

<!-- front -->

---

### Core Principle

**Interval problems** involve collections of time ranges `[start, end]` where we need to find relationships between overlapping or adjacent ranges.

```
Interval Representation:
┌────────────────────────────────────────────────────────────┐
│                                                            │
│  Interval A: [1, 5]     ████████████                       │
│  Interval B: [3, 7]          ████████████                  │
│  Interval C: [8, 10]                          ████████    │
│                                                            │
│  Overlap (A, B): [3, 5]     ████████      ← MERGE to [1,7]│
│  Gap (B, C): [6, 7] → [8, 10]   No overlap, separate      │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

---

### Why Greedy Works

**Optimal Substructure:** The greedy choice at each step leads to a globally optimal solution.

```
Merge Intervals - Why Greedy Works:
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  After sorting by start:                                   │
│  [1,3], [2,6], [8,10], [15,18]                            │
│                                                             │
│  Local decision at [2,6]:                                  │
│  - It overlaps [1,3] (2 <= 3) ✓                           │
│  - Must merge: new interval is [1, max(3,6)] = [1,6]      │
│                                                             │
│  Key insight: Once sorted, we process left-to-right         │
│  and NEVER need to reconsider previous decisions!          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### Overlap Conditions

**Two intervals `[a_start, a_end]` and `[b_start, b_end]` overlap if:**

```
OVERLAP CONDITION:
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  Intervals overlap when:                                    │
│                                                             │
│      a_start <= b_end AND b_start <= a_end               │
│                                                             │
│  Visual cases:                                             │
│  1. Partial overlap:  [1, 5] and [3, 7]                    │
│                       ████████                              │
│                             ████████                        │
│                                                             │
│  2. Complete containment: [1, 10] and [3, 5]               │
│                         ████████████                       │
│                            ████                             │
│                                                             │
│  3. Touching at point: [1, 5] and [5, 10]                  │
│                        ██████                               │
│                             ███████                         │
│                        ↑ overlap at 5                      │
│                                                             │
│  4. No overlap: [1, 3] and [5, 10]                         │
│                 ████                                        │
│                          ███████                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### Sort Strategy by Problem Type

| Problem | Sort By | Why |
|---------|---------|-----|
| **Merge Intervals** | Start time | Process left-to-right, merge as we go |
| **Insert Interval** | Start time (pre-sorted) | Find position, merge with neighbors |
| **Activity Selection** | End time | Pick earliest finishing = more room for rest |
| **Min Meeting Rooms** | Start time | Process chronologically, track concurrent |
| **Interval Intersection** | Start time (both lists) | Two pointers, advance smaller end |

---

### Mathematical Structure

**Merging Formula:**
```
Merged interval of [a_start, a_end] and [b_start, b_end]:

merged_start = min(a_start, b_start)
merged_end   = max(a_end, b_end)

Result: [min_start, max_end]
```

**Activity Selection Greedy Proof:**
```
Claim: Always picking the interval with earliest end time 
gives maximum number of non-overlapping intervals.

Proof sketch:
- Let G = greedy solution (pick earliest finishing first)
- Let O = any optimal solution
- Both pick same count until first difference at position k
- At k, G picked interval ending at e_g, O picked e_o where e_g <= e_o
- We can replace O's choice with G's choice without reducing count
- By induction, G is optimal
```

---

### Complexity Fundamentals

| Operation | Time | Why |
|-----------|------|-----|
| Sorting | O(n log n) | Dominates all interval problems |
| Single merge pass | O(n) | One pass through sorted array |
| Heap operations | O(log n) per op | For meeting rooms tracking |
| Two pointers | O(n + m) | For interval intersection |

**Space Complexity:**
- Result storage: O(n) worst case
- Heap for meeting rooms: O(n) worst case
- In-place sorting possible: O(1) extra

---

### Problem Identification Guide

| Signal Phrases | Pattern | Sort By |
|----------------|---------|---------|
| "Merge overlapping" | Standard merge | Start |
| "Non-overlapping" / "compatible" | Activity selection | End |
| "Meeting rooms" / "concurrent" | Min heap | Start |
| "Find intersection" | Two pointers | Start (both) |
| "Insert into sorted" | Three-phase | N/A (pre-sorted) |

<!-- back -->
