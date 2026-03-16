## Interval Scheduling: Maximum Non-Overlapping Intervals

**Question:** How do you find the maximum number of non-overlapping intervals?

<!-- front -->

---

## Answer: Greedy by Earliest End Time

### Solution
```python
def eraseOverlapIntervals(intervals):
    if not intervals:
        return 0
    
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    
    count = 1  # First interval always fits
    end = intervals[0][1]
    
    for i in range(1, len(intervals)):
        # If current starts after previous ends
        if intervals[i][0] >= end:
            count += 1
            end = intervals[i][1]
    
    return len(intervals) - count  # Intervals to remove
```

### For Finding Maximum Non-Overlapping
```python
def maxNonOverlapping(intervals):
    if not intervals:
        return 0
    
    intervals.sort(key=lambda x: x[1])
    
    result = 0
    end = float('-inf')
    
    for start, e in intervals:
        if start >= end:
            result += 1
            end = e
    
    return result
```

### Visual: Greedy Choice
```
Intervals: [[1,4], [2,3], [3,4], [1,10]]

Sorted by end: [[2,3], [1,4], [3,4], [1,10]]

Step 1: Pick [2,3] (earliest end)
Step 2: [1,4] overlaps, skip
Step 3: [3,4] doesn't overlap (3 >= 3), pick
Step 4: [1,10] overlaps, skip

Maximum = 2 intervals
```

### ⚠️ Tricky Parts

#### 1. Sort by End Time, Not Start
```python
# WRONG - doesn't work!
intervals.sort(key=lambda x: x[0])

# CORRECT - sort by end time
intervals.sort(key=lambda x: x[1])
```

#### 2. Overlap Definition
```python
# Overlap: start < end (not <=)
# Non-overlap: start >= end

# [1,2] and [2,3] don't overlap (2 >= 2)
# [1,3] and [3,5] don't overlap (3 >= 3)
```

#### 3. Edge Cases
```python
# Empty input
if not intervals:
    return 0

# Single interval
if len(intervals) == 1:
    return 1
```

### Variant: Minimum Number of Intervals to Remove
```python
def eraseOverlapIntervals(intervals):
    if not intervals:
        return 0
    
    intervals.sort(key=lambda x: x[1])
    
    removed = 0
    prev_end = intervals[0][1]
    
    for i in range(1, len(intervals)):
        if intervals[i][0] < prev_end:
            removed += 1
        else:
            prev_end = intervals[i][1]
    
    return removed
```

### All Interval Problem Variations

| Problem | Solution |
|---------|----------|
| Max non-overlapping | Sort by end, greedy pick |
| Min to remove | Sort by end, greedy skip overlapping |
| Merge overlapping | Sort by start, merge |
| Minimum meeting rooms | Sort by start, use min-heap |

### Why Greedy Works
- Choosing earliest end leaves maximum room for remaining intervals
- Proof by exchange argument: any optimal solution can be transformed to one that picks the earliest ending interval

### Comparison: All Problems

| Problem | Sort By | Key Logic |
|---------|---------|-----------|
| Max non-overlapping | End | Pick if start >= prev_end |
| Min to remove | End | Skip if start < prev_end |
| Merge intervals | Start | Merge if overlap |
| Meeting rooms | Start | Min-heap of end times |

<!-- back -->
