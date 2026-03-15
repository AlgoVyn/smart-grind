## Activity Selection - Why Sort by Finish Time?

**Question:** What happens if you sort by start time instead?

<!-- front -->

---

## Activity Selection: Why Finish Time?

### Greedy Choice
Always pick the activity that **finishes earliest** and does not conflict.

### Correct Algorithm (Sort by Finish)
```python
def activity_selection(activities):
    # Sort by finish time
    activities.sort(key=lambda x: x[1])
    
    count = 1
    last_end = activities[0][1]
    
    for start, end in activities[1:]:
        if start >= last_end:
            count += 1
            last_end = end
    
    return count
```

### Why Not Sort by Start?
```
Activities sorted by start:
A: [1, 4], B: [2, 3], C: [3, 5]

Greedy on start: Pick A, then can not pick B or C
Result: 1 activity

Correct (sort by end): Pick B, then C
Result: 2 activities ✓
```

### Proof Sketch
1. Let A be the activity with earliest finish time
2. A is always part of an optimal solution
3. After picking A, reduce to subproblem
4. By induction, greedy works

### Time Complexity
- Sort: O(n log n)
- Selection: O(n)
- Total: O(n log n)

<!-- back -->
