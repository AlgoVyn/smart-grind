## Greedy - Activity Selection: Core Concepts

What are the fundamental principles of the greedy approach for activity selection problems?

<!-- front -->

---

### Core Concept

Use **a greedy strategy to always pick the activity with the earliest finish time** that doesn't conflict with previously selected activities.

**Key insight**: Choosing the activity that finishes earliest leaves the maximum remaining time for other activities.

---

### The Pattern

```
Activities: [(start, finish)]
[(1, 4), (3, 5), (0, 6), (5, 7), (3, 8), (5, 9), (6, 10), (8, 11)]

Step 1: Sort by finish time:
[(1, 4), (3, 5), (0, 6), (5, 7), (3, 8), (5, 9), (6, 10), (8, 11)]
         ↑
         Select (1,4), count=1, last_finish=4

Step 2: Check (3,5): start=3 < last_finish=4, conflict, skip

Step 3: Check (0,6): start=0 < 4, conflict, skip

Step 4: Check (5,7): start=5 >= 4, no conflict!
         Select (5,7), count=2, last_finish=7

Step 5: Check (3,8): start=3 < 7, conflict, skip

Step 6: Check (5,9): start=5 < 7, conflict, skip

Step 7: Check (6,10): start=6 < 7, conflict, skip

Step 8: Check (8,11): start=8 >= 7, no conflict!
         Select (8,11), count=3

Result: 3 activities: (1,4), (5,7), (8,11) ✓
```

---

### Greedy Choice Proof

| Strategy | Optimal? | Why |
|----------|----------|-----|
| **Earliest finish** | Yes | Leaves most room for remaining |
| Earliest start | No | May block others |
| Shortest duration | No | May not be compatible |
| Fewest conflicts | No | May not maximize count |

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| **Activity Selection** | Max non-overlapping | Classic problem |
| **Meeting Rooms II** | Min rooms needed | Meeting Rooms |
| **Interval Scheduling** | Max intervals | Non-overlapping Intervals |
| **Task Scheduling** | Remove min for valid | Remove Intervals |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| **Sort** | O(n log n) | By finish time |
| **Scan** | O(n) | Single pass |
| **Total** | O(n log n) | Dominated by sort |
| **Space** | O(1) or O(n) | Depends on sort |

<!-- back -->
