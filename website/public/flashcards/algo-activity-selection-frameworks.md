## Activity Selection: Algorithm Framework

What is the standard implementation structure for activity selection, and how do you handle edge cases?

<!-- front -->

---

### Algorithm Template

```python
def activity_selection(activities):
    """
    activities: list of (start, end) tuples
    Returns: list of selected activity indices
    """
    # 1. Sort by finish time
    sorted_acts = sorted(activities, key=lambda x: x[1])
    
    # 2. Greedy selection
    selected = [0]  # First activity always selected
    last_finish = sorted_acts[0][1]
    
    for i in range(1, len(sorted_acts)):
        if sorted_acts[i][0] >= last_finish:
            selected.append(i)
            last_finish = sorted_acts[i][1]
    
    return selected
```

---

### Key Components

| Component | Purpose |
|-----------|---------|
| **Sorting** | O(n log n) - establishes greedy order |
| **Last finish tracker** | O(1) - enables O(n) selection |
| **Compatible check** | `start >= last_finish` - no overlap |

---

### Iterative vs Recursive

| Approach | Code | Use Case |
|----------|------|----------|
| **Iterative** | Standard loop | Production, large n |
| **Recursive** | Divide and conquer | Educational, small n |

**Recursive variant:**
```python
def recursive_select(activities, k, n):
    m = k + 1
    while m <= n and activities[m][0] < activities[k][1]:
        m += 1
    if m <= n:
        return [m] + recursive_select(activities, m, n)
    return []
```

---

### Edge Cases

| Case | Handling |
|------|----------|
| Empty input | Return empty list |
| Single activity | Return [0] |
| All overlapping | Return [0] (first ends earliest) |
| None overlapping | Return all activities |
| Equal finish times | Break ties arbitrarily (or by start time) |

---

### Common Mistakes

```python
# ❌ Wrong: Sort by start time
sorted(activities, key=lambda x: x[0])  # Doesn't maximize count

# ❌ Wrong: Strict inequality
if start > last_finish:  # Misses edge case: touching intervals

# ✅ Correct: Non-strict + finish time sort
if start >= last_finish:
```

<!-- back -->
