## Merge Intervals Pattern

**Question:** How to merge overlapping intervals?

<!-- front -->

---

## Answer: Sort + Single Pass

### Template
```python
def merge(intervals):
    if len(intervals) <= 1:
        return intervals
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    result = [intervals[0]]
    
    for start, end in intervals[1:]:
        last_end = result[-1][1]
        
        if start <= last_end:
            # Overlapping - extend
            result[-1][1] = max(last_end, end)
        else:
            # Non-overlapping - add new
            result.append([start, end])
    
    return result
```

### Visual: Merge Process
```
Input: [[1,3],[2,6],[8,10],[15,18]]

Sorted: [[1,3],[2,6],[8,10],[15,18]]

[1,3]: add
[2,6]: 2 <= 3 → merge → [1,6]
[8,10]: 8 > 6 → add → [1,6], [8,10]
[15,18]: 15 > 10 → add → [1,6], [8,10], [15,18]

Result: [[1,6],[8,10],[15,18]]
```

### ⚠️ Tricky Parts

#### 1. Why Sort First?
```python
# Ensures we only check next interval
# Without sorting, would miss overlaps

# Sort by start time ascending
```

#### 2. Extend vs Add
```python
# if start <= last_end: overlap
# - extend: last[1] = max(last_end, end)

# if start > last_end: no overlap  
# - add new interval
```

### Variations

| Problem | Key Difference |
|---------|---------------|
| Merge | Extend if overlap |
| Insert | Binary search position first |
| Overlap | Check any two overlap |
| Non-overlap | Count non-overlapping |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not sorting | Always sort first |
| Wrong comparison | start <= last_end |
| Not using max | Take max of ends |

<!-- back -->
