## Merge Intervals - Overlap Condition

**Question:** When do two intervals [a, b] and [c, d] overlap?

<!-- front -->

---

## Merge Intervals: Overlap Condition

### Answer: `max(a, c) <= min(b, d)`

Or equivalently: `a <= d AND c <= b`

### Visual Representation
```
Interval 1:    |----a----|
Interval 2:        |----c----|
         
If a <= d AND c <= b → They overlap!
```

### Algorithm
```python
def merge(intervals):
    if not intervals:
        return []
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    merged = [intervals[0]]
    
    for start, end in intervals[1:]:
        last_end = merged[-1][1]
        
        # Overlap: current start <= last end
        if start <= last_end:
            # Merge: extend last interval
            merged[-1][1] = max(last_end, end)
        else:
            # No overlap: add new interval
            merged.append([start, end])
    
    return merged
```

### 💡 Key Insight
Sorting by start time ensures we only need to compare with the **last merged interval**.

<!-- back -->
