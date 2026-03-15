## Merge Intervals: Overlapping Edge Cases

**Question:** How do you handle all edge cases when merging overlapping intervals?

<!-- front -->

---

## Answer: Sort First, Then Compare

### Key Insight
**Always sort intervals by start time** before merging!

### Solution
```python
def merge(intervals):
    if not intervals:
        return []
    
    # Sort by start time - CRITICAL STEP!
    intervals.sort(key=lambda x: x[0])
    
    merged = [intervals[0]]
    
    for i in range(1, len(intervals)):
        current = intervals[i]
        last = merged[-1]
        
        # Check for overlap
        if current[0] <= last[1]:
            # Merge: extend the end
            last[1] = max(last[1], current[1])
        else:
            # No overlap - add new interval
            merged.append(current)
    
    return merged
```

### Visual Walkthrough
```
Input: [[1,3],[2,6],[8,10],[15,18]]

After sorting: [[1,3],[2,6],[8,10],[15,18]]
                ↑    ↑
                overlap!

Step 1: merged = [[1,3]]
Step 2: [2,6] overlaps [1,3] → merge → merged = [[1,6]]
Step 3: [8,10] doesn't overlap [1,6] → add → merged = [[1,6],[8,10]]
Step 4: [15,18] doesn't overlap [8,10] → add → merged = [[1,6],[8,10],[15,18]]

Output: [[1,6],[8,10],[15,18]]
```

### Complexity
- **Time:** O(n log n) - dominated by sorting
- **Space:** O(n) for output

### ⚠️ Tricky Edge Cases

#### 1. Completely Contained Intervals
```
[[1,10],[2,3],[4,5],[6,7]]
After sort: [[1,10],[2,3],[4,5],[6,7]]
All contained → Output: [[1,10]]
```

#### 2. Adjacent Intervals (Don't Merge!)
```
[[1,5],[5,10]]  ← Should this merge?
Answer: NO! [1,5] and [5,10] don't overlap
         Use <= not < for overlap check

[[1,5],[6,10]] → [[1,5],[6,10]] (separate)
```

#### 3. Empty Input / Single Interval
```
[] → []
[[1,5]] → [[1,5]]
```

#### 4. Intervals Out of Order
```
[[1,4],[0,2],[3,5]] ← Must sort first!
After sort: [[0,2],[1,4],[3,5]]
Result: [[0,4],[3,5]]
```

### ⚠️ Common Mistakes

| Mistake | Problem | Fix |
|---------|---------|-----|
| Not sorting | Wrong merges | Always sort first |
| Using `<` instead of `<=` | Adjacent intervals merge | Use `<=` for overlap |
| Not handling empty | IndexError | Check length first |
| Modifying input | Side effects | Use sorted() not .sort() |
| Wrong key in sort | Wrong order | Use `key=lambda x: x[0]` |

### Variations

#### Insert Interval
```python
def insert(intervals, newInterval):
    merged = []
    i = 0
    
    # Add all intervals before newInterval
    while i < len(intervals) and intervals[i][1] < newInterval[0]:
        merged.append(intervals[i])
        i += 1
    
    # Merge overlapping
    while i < len(intervals) and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    
    merged.append(newInterval)
    
    # Add remaining
    while i < len(intervals):
        merged.append(intervals[i])
        i += 1
    
    return merged
```

### When to Use This Pattern
- Overlapping intervals
- Meeting rooms scheduling
- Interval scheduling
- Calendar availability

<!-- back -->
