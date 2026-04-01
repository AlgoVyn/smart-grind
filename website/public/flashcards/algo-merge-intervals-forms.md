## Title: Merge Intervals Forms

What are the different forms and variations of interval problems?

<!-- front -->

---

### Interval Variations
| Problem | Description | Key Insight |
|---------|-------------|-------------|
| Insert Interval | Add new, merge if needed | Binary search position |
| Meeting Rooms II | Min rooms for all meetings | Max concurrent meetings |
| Non-overlapping Intervals | Min to remove | Greedy by end time |
| Interval Intersections | Common parts of two lists | Two pointers |
| Employee Free Time | Gaps in schedule | Merge all then find gaps |

### Meeting Rooms II
```python
def min_meeting_rooms(intervals):
    """Maximum overlapping intervals at any time"""
    if not intervals:
        return 0
    
    starts = sorted([i[0] for i in intervals])
    ends = sorted([i[1] for i in intervals])
    
    rooms = max_rooms = 0
    s = e = 0
    
    while s < len(intervals):
        if starts[s] < ends[e]:  # new meeting starts before one ends
            rooms += 1
            s += 1
            max_rooms = max(max_rooms, rooms)
        else:  # meeting ended
            rooms -= 1
            e += 1
    
    return max_rooms
```

---

### Interval Intersection
```python
def interval_intersection(A, B):
    """Find all intersections between two interval lists"""
    result = []
    i = j = 0
    
    while i < len(A) and j < len(B):
        # Intersection exists
        lo = max(A[i][0], B[j][0])
        hi = min(A[i][1], B[j][1])
        
        if lo <= hi:
            result.append([lo, hi])
        
        # Move pointer of interval that ends first
        if A[i][1] < B[j][1]:
            i += 1
        else:
            j += 1
    
    return result
```

---

### Remove Overlapping Intervals
```python
def erase_overlap_intervals(intervals):
    """Minimum intervals to remove for no overlaps"""
    if not intervals:
        return 0
    
    # Sort by end time - greedy
    intervals.sort(key=lambda x: x[1])
    
    count = 0
    end = float('-inf')
    
    for interval in intervals:
        if interval[0] >= end:  # No overlap, keep it
            end = interval[1]
        else:  # Overlap, remove it
            count += 1
    
    return count
```

<!-- back -->
