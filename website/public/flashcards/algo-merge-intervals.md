## Merge Intervals

**Question:** Merge overlapping intervals?

<!-- front -->

---

## Answer: Sort + Merge

### Solution
```python
def merge(intervals):
    if not intervals:
        return []
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    result = [intervals[0]]
    
    for i in range(1, len(intervals)):
        current = result[-1]
        
        if intervals[i][0] <= current[1]:
            # Overlapping: merge
            current[1] = max(current[1], intervals[i][1])
        else:
            # Non-overlapping
            result.append(intervals[i])
    
    return result
```

### Visual: Merge Process
```
intervals = [[1,3],[2,6],[8,10],[15,18]]

Sort: [[1,3],[2,6],[8,10],[15,18]]

i=1: [2,6] overlaps [1,3]
     merge → [1,6]

i=2: [8,10] doesn't overlap [1,6]
     add → [[1,6],[8,10]]

i=3: [15,18] doesn't overlap [8,10]
     add → [[1,6],[8,10],[15,18]]

Result: [[1,6],[8,10],[15,18]]
```

### ⚠️ Tricky Parts

#### 1. Why Sort First?
```python
# After sorting, we only need to check
# current interval with next interval
# No need to check all pairs

# Without sort: O(n²)
# With sort: O(n log n)
```

#### 2. In-place Modification
```python
# result[-1][1] = max(result[-1][1], intervals[i][1])
# Modifies result list in place

# Alternative: create new interval
# merged = [result[-1][0], max(result[-1][1], intervals[i][1])]
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Sort + Merge | O(n log n) | O(n) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Not sorting | Always sort by start |
| Wrong overlap check | intervals[i][0] <= current[1] |
| Not updating end | max(current[1], intervals[i][1]) |

<!-- back -->
