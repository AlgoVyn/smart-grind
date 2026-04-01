## Activity Selection: Core Concepts

What is the activity selection problem, what makes it a classic greedy algorithm, and when is it applicable?

<!-- front -->

---

### Problem Definition

Given `n` activities with start and end times, select the **maximum number of non-overlapping activities** (no shared time intervals).

| Aspect | Description |
|--------|-------------|
| **Goal** | Maximize count of compatible activities |
| **Constraint** | No two selected activities overlap |
| **Complexity** | O(n log n) sort + O(n) greedy |

---

### Greedy Choice Property

The key insight: **Earliest finish time** leads to optimal solution.

**Why it works:**
- Leaves maximum remaining time for other activities
- Local optimal choice = Global optimal solution
- Intuition: "Get done early, free up room for more"

**Formal Proof Sketch:**
```
Let A = optimal solution with earliest-finishing activity a_k
If a_k ≠ a_1 (greedy choice), swap a_k with a_1
Since finish(a_1) ≤ finish(a_k), a_1 is compatible with rest of A
New solution A' has same size, so greedy choice is safe
```

---

### When to Use

| ✅ Applicable | ❌ Not Applicable |
|--------------|------------------|
| Maximize count of activities | Weighted activity selection |
| All activities have equal value | Need to maximize total duration |
| Simple interval scheduling | Complex resource constraints |

**Weighted variant requires DP (O(n²) or O(n log n))**

---

### Key Properties

```
Optimal Substructure: Yes (after greedy choice, subproblem remains optimal)
Greedy Choice Property: Yes (earliest finish time)
Can be solved by DP: Yes, but greedy is more efficient
```

<!-- back -->
