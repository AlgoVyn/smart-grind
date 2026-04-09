## Greedy - Interval Merging/Scheduling: Tactics

What are the advanced techniques for interval problems?

<!-- front -->

---

### Tactic 1: Insert Interval with Three-Phase Processing

```python
def insert(intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
    """
    Insert new interval into sorted non-overlapping intervals.
    Three phases: before, merge, after.
    """
    result = []
    i, n = 0, len(intervals)
    
    # PHASE 1: Add all intervals BEFORE newInterval
    while i < n and intervals[i][1] < newInterval[0]:
        result.append(intervals[i])
        i += 1
    
    # PHASE 2: Merge all overlapping intervals with newInterval
    while i < n and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    
    result.append(newInterval)  # Add merged interval
    
    # PHASE 3: Add all remaining intervals AFTER
    while i < n:
        result.append(intervals[i])
        i += 1
    
    return result
```

**Key insight:** Pre-sorted intervals allow O(n) insertion without re-sorting.

---

### Tactic 2: Sweep Line for Meeting Rooms

```python
def min_meeting_rooms_sweep(intervals: List[List[int]]) -> int:
    """
    Alternative to heap: sweep line with start/end events.
    """
    if not intervals:
        return 0
    
    # Create events: +1 for start, -1 for end
    events = []
    for start, end in intervals:
        events.append((start, 1))    # Meeting starts
        events.append((end, -1))     # Meeting ends
    
    # Sort: if same time, process ends before starts
    # (end, -1) comes before (start, 1) at same timestamp
    events.sort(key=lambda x: (x[0], x[1]))
    
    rooms = 0
    max_rooms = 0
    
    for time, delta in events:
        rooms += delta
        max_rooms = max(max_rooms, rooms)
    
    return max_rooms
```

**Key insight:** Sweep line often easier to reason about for "maximum concurrent" problems.

---

### Tactic 3: Interval Intersection with Two Pointers

```python
def interval_intersection(first: List[List[int]], 
                          second: List[List[int]]) -> List[List[int]]:
    """
    Find intersection of two interval lists.
    Two pointers - advance the one with smaller end.
    """
    result = []
    i = j = 0
    
    while i < len(first) and j < len(second):
        # Find overlap: max of starts, min of ends
        start = max(first[i][0], second[j][0])
        end = min(first[i][1], second[j][1])
        
        # If they overlap
        if start <= end:
            result.append([start, end])
        
        # Advance pointer with smaller end time
        if first[i][1] < second[j][1]:
            i += 1
        else:
            j += 1
    
    return result
```

**Key insight:** Advance the interval that ends first - it can't overlap with any future intervals from the other list.

---

### Tactic 4: Finding Free Time / Gaps

```python
def find_free_time(schedule: List[List[List[int]]]) -> List[List[int]]:
    """
    Find common free time across all employee schedules.
    """
    # Flatten all intervals
    all_intervals = []
    for employee in schedule:
        all_intervals.extend(employee)
    
    # Merge all intervals
    merged = merge(all_intervals)  # Standard merge function
    
    # Find gaps between merged intervals
    free_time = []
    for i in range(1, len(merged)):
        if merged[i-1][1] < merged[i][0]:
            free_time.append([merged[i-1][1], merged[i][0]])
    
    return free_time
```

**Key insight:** Free time = gaps between merged busy intervals.

---

### Tactic 5: Pruning in Subset Problems

```python
def can_attend_all_meetings(intervals: List[List[int]]) -> bool:
    """
    Check if person can attend all meetings (no overlaps).
    """
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    for i in range(1, len(intervals)):
        # If current starts before previous ends → conflict
        if intervals[i][0] < intervals[i-1][1]:
            return False
    
    return True


def min_intervals_to_remove(intervals: List[List[int]]) -> int:
    """
    Classic: remove minimum intervals to eliminate overlaps.
    = Total - Maximum non-overlapping (activity selection)
    """
    if not intervals:
        return 0
    
    # Sort by END time (critical!)
    intervals.sort(key=lambda x: x[1])
    
    count = 1
    end = intervals[0][1]
    
    for i in range(1, len(intervals)):
        if intervals[i][0] >= end:
            count += 1
            end = intervals[i][1]
    
    return len(intervals) - count
```

---

### Tactic 6: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| Sort by start for activity selection | Wrong answer, not optimal | Sort by **end** time |
| Using `<` instead of `<=` for overlap | [1,2] and [2,3] considered non-overlapping | Use `<=` for touching intervals |
| Not handling empty input | Runtime error | Check `if not intervals` first |
| Modifying input list | Unexpected side effects | Create new result list |
| Off-by-one in sweep line | Count off by 1 | Process events in correct order |
| Heap peek without pop | Wrong room count | Always pop when reusing |

---

### Quick Reference: Problem → Approach

```
Problem description → Solution pattern:
├── "Merge overlapping intervals" 
│   → Sort by start, sweep and merge
│
├── "Maximum non-overlapping" / "minimum to remove"
│   → Sort by end, greedy select
│
├── "Meeting rooms needed" / "concurrent events"
│   → Sort by start, min-heap on end times
│
├── "Insert into sorted intervals"
│   → Three phases: before, merge, after
│
├── "Intersection of two lists"
│   → Two pointers, advance smaller end
│
└── "Find free time / gaps"
    → Merge all, find gaps between merged
```

<!-- back -->
