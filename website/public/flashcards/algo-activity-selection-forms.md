## Activity Selection: Problem Forms

What are the common variations and equivalent forms of the activity selection problem?

<!-- front -->

---

### Standard Form

**Input:** `n` activities with `(start, end)` intervals  
**Output:** Maximum subset of mutually compatible activities

```
Example:
Activities: [(1,4), (3,5), (0,6), (5,7), (3,8), (5,9), (6,10), (8,11)]
Selected:   [(1,4), (5,7), (8,11)]  →  Count: 3
```

---

### Weighted Variant

| Aspect | Unweighted | Weighted |
|--------|-----------|----------|
| **Goal** | Max count | Max total weight |
| **Approach** | Greedy | Dynamic Programming |
| **Complexity** | O(n log n) | O(n log n) or O(n²) |
| **Greedy works?** | Yes | No |

**DP recurrence:**
```python
def weighted_selection(activities):
    # Sort by finish time, precompute p[j] = largest i where finish[i] < start[j]
    dp = [0] * (n + 1)
    for j in range(1, n + 1):
        # Option 1: Don't take activity j
        # Option 2: Take activity j + optimal up to p[j]
        dp[j] = max(dp[j-1], weight[j] + dp[p[j]])
    return dp[n]
```

---

### Equivalent Problems

| Problem | Mapping to Activity Selection |
|---------|-------------------------------|
| **Interval Scheduling** | Direct equivalence |
| **Maximum Independent Set** | For interval graphs |
| **Minimum Rooms** | Dual problem (graph coloring) |
| **Course Scheduling** | Activities = courses |
| **Resource Allocation** | Activities = resource requests |

---

### Constraint Variations

```
Single resource:     Standard problem (rooms, machines)
Multiple resources:  Bipartite matching or flow
Release times:       start[i] = max(request_time, earliest_start)
Deadlines:           end[i] = min(deadline, processing_time)
Precedence:          DAG scheduling (harder)
```

---

### Real-World Forms

| Domain | Activity = | Constraint = |
|--------|-----------|----------------|
| **CPU Scheduling** | Process | No overlapping execution |
| **Meeting Rooms** | Meeting | Room capacity = 1 |
| **TV Broadcast** | Show | Channel time slot |
| **Job Shop** | Operation | Machine availability |
| **Airport Gates** | Flight | Gate assignment |

<!-- back -->
