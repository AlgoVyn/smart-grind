## Title: Merge Intervals

What is the Merge Intervals problem and how is it solved?

<!-- front -->

---

### Definition
Given a collection of intervals, merge all overlapping intervals into non-overlapping intervals.

### Examples
```
Input: [[1,3], [2,6], [8,10], [15,18]]
Output: [[1,6], [8,10], [15,18]]

Input: [[1,4], [4,5]]
Output: [[1,5]]  # adjacent intervals merged
```

### Algorithm
```
1. Sort intervals by start time (O(n log n))
2. Initialize result with first interval
3. For each subsequent interval:
   If overlaps with last result interval:
     Extend last interval's end = max(end, current.end)
   Else:
     Add new interval to result
```

---

### Implementation
```python
def merge(intervals):
    if not intervals:
        return []
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        last = merged[-1]
        
        # Check overlap: current.start <= last.end
        if current[0] <= last[1]:
            # Merge: extend end to max of both
            last[1] = max(last[1], current[1])
        else:
            merged.append(current)
    
    return merged

# With explicit interval class
def merge_class(intervals):
    if not intervals:
        return []
    
    intervals.sort(key=lambda x: x.start)
    merged = [intervals[0]]
    
    for curr in intervals[1:]:
        if curr.start <= merged[-1].end:
            merged[-1].end = max(merged[-1].end, curr.end)
        else:
            merged.append(curr)
    
    return merged
```

---

### Complexity
| Aspect | Value |
|--------|-------|
| Sorting | O(n log n) |
| Merging | O(n) |
| Total | O(n log n) |
| Space | O(n) for output, O(1) or O(log n) extra |

<!-- back -->
