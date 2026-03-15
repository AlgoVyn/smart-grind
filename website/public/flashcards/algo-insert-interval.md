## Insert Interval

**Question:** How do you handle the three cases when inserting a new interval?

<!-- front -->

---

## Insert Interval - Three Cases

### Cases
1. **Before** all intervals → New interval ends before current starts
2. **Overlapping** → Merge with overlapping intervals
3. **After** all intervals → New interval starts after current ends

### Algorithm
```python
def insert(intervals, newInterval):
    result = []
    i = 0
    n = len(intervals)
    
    # Case 1: All intervals before newInterval
    while i < n and intervals[i][1] < newInterval[0]:
        result.append(intervals[i])
        i += 1
    
    # Case 2: Overlapping - merge all overlapping intervals
    while i < n and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    result.append(newInterval)
    
    # Case 3: All intervals after newInterval
    while i < n:
        result.append(intervals[i])
        i += 1
    
    return result
```

### 💡 Edge Cases
- Empty intervals array → return `[newInterval]`
- New interval goes at the beginning
- New interval goes at the end
- New interval overlaps with all

<!-- back -->
