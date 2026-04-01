## Activity Selection: Comparison Guide

How does activity selection compare to similar scheduling and interval problems?

<!-- front -->

---

### Algorithm Comparison

| Algorithm | Problem | Approach | Time | Space |
|-----------|---------|----------|------|-------|
| **Activity Selection** | Max non-overlapping | Greedy | O(n log n) | O(1) extra |
| **Weighted Interval** | Max weight subset | DP | O(n log n) | O(n) |
| **Interval Partitioning** | Min resources needed | Greedy + sweep | O(n log n) | O(n) |
| **Interval Covering** | Min intervals to cover range | Greedy | O(n log n) | O(1) |
| **Job Scheduling** | Min lateness/max profit | Various | Varies | Varies |

---

### Greedy vs Dynamic Programming

| Scenario | Activity Selection | Weighted Version |
|----------|-------------------|------------------|
| **Structure** | Greedy | DP |
| **Key decision** | Earliest finish | Include/exclude each interval |
| **Recurrence** | None | `dp[i] = max(dp[i-1], w[i] + dp[p[i]])` |
| **Why greedy fails weighted?** | Heavy long activity vs many light short ones |

**Example where greedy fails weighted:**
```
Activities: A=[0,10] weight=10, B=[0,5] weight=6, C=[5,10] weight=6
Greedy picks A (count=1, weight=10)
Optimal picks B+C (count=2, weight=12)
```

---

### Activity Selection vs Interval Partitioning

| Aspect | Activity Selection | Interval Partitioning |
|--------|-------------------|----------------------|
| **Goal** | Maximize selected | Minimize resources |
| **Resource view** | 1 resource, schedule all | Unlimited resources, find minimum |
| **Algorithm** | Sort by end, pick compatible | Sweep line with min-heap |
| **Output** | Subset of intervals | Number (or schedule) |

**Relationship:** Dual problems on interval graphs

---

### When to Use Each

| Requirement | Use |
|-------------|-----|
| Maximize event count | Activity Selection (greedy) |
| Maximize weighted value | Weighted Interval Scheduling (DP) |
| Find minimum rooms | Interval Partitioning (sweep) |
| Cover entire timeline | Interval Covering (greedy) |
| Multiple constraints | MILP or Network Flow |
| Online (no pre-sorting) | Ad-hoc greedy heuristics |

---

### Complexity Hierarchy

```
Simpler ────────────────────────────────→ Harder

Activity Selection ──► Weighted ──► Multiple Resources ──► General Scheduling
  O(n log n)           O(n log n)      O(n log n)            NP-Hard
  Greedy               DP              Flow/Coloring         Approximations
```

<!-- back -->
