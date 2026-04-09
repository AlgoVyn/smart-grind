## Greedy - Interval Merging/Scheduling: Forms

What are the different variations of interval problems?

<!-- front -->

---

### Form 1: Standard Merge (Most Common)

```python
def merge(intervals: List[List[int]]) -> List[List[int]]:
    """
    Form: Merge all overlapping intervals.
    Input: [[1,3], [2,6], [8,10], [15,18]]
    Output: [[1,6], [8,10], [15,18]]
    """
    if not intervals:
        return []
    
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        last = merged[-1]
        if current[0] <= last[1]:
            last[1] = max(last[1], current[1])
        else:
            merged.append(current)
    
    return merged
```

**Characteristics:** Sort by start, extend end on overlap.

---

### Form 2: Insert Interval

```python
def insert(intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
    """
    Form: Insert new interval into sorted non-overlapping list.
    Input: intervals=[[1,3], [6,9]], newInterval=[2,5]
    Output: [[1,5], [6,9]]
    """
    result = []
    i, n = 0, len(intervals)
    
    # Add intervals before newInterval
    while i < n and intervals[i][1] < newInterval[0]:
        result.append(intervals[i])
        i += 1
    
    # Merge overlapping intervals
    while i < n and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    
    result.append(newInterval)
    
    # Add remaining intervals
    while i < n:
        result.append(intervals[i])
        i += 1
    
    return result
```

**Characteristics:** Three phases - before, merge, after.

---

### Form 3: Activity Selection (Max Non-Overlapping)

```python
def erase_overlap_intervals(intervals: List[List[int]]) -> int:
    """
    Form: Remove minimum intervals to make rest non-overlapping.
    Input: [[1,2], [2,3], [3,4], [1,3]]
    Output: 1 (remove [1,3])
    """
    if not intervals:
        return 0
    
    # KEY: Sort by END time
    intervals.sort(key=lambda x: x[1])
    
    count = 1
    end = intervals[0][1]
    
    for i in range(1, len(intervals)):
        if intervals[i][0] >= end:
            count += 1
            end = intervals[i][1]
    
    return len(intervals) - count
```

**Characteristics:** Sort by end, greedy select, count = total - selected.

---

### Form 4: Minimum Meeting Rooms

```python
def min_meeting_rooms(intervals: List[List[int]]) -> int:
    """
    Form: Find minimum rooms for all meetings.
    Input: [[0,30], [5,10], [15,20]]
    Output: 2 (first overlaps with both)
    """
    if not intervals:
        return 0
    
    intervals.sort(key=lambda x: x[0])
    min_heap = []
    heapq.heappush(min_heap, intervals[0][1])
    
    for start, end in intervals[1:]:
        if min_heap[0] <= start:
            heapq.heappop(min_heap)
        heapq.heappush(min_heap, end)
    
    return len(min_heap)
```

**Characteristics:** Min-heap tracks end times, heap size = rooms needed.

---

### Form 5: Interval Intersection

```python
def interval_intersection(first: List[List[int]], 
                          second: List[List[int]]) -> List[List[int]]:
    """
    Form: Find intersection of two interval lists.
    Input: first=[[0,2], [5,10]], second=[[1,5], [8,12]]
    Output: [[1,2], [5,5], [8,10]]
    """
    result = []
    i = j = 0
    
    while i < len(first) and j < len(second):
        start = max(first[i][0], second[j][0])
        end = min(first[i][1], second[j][1])
        
        if start <= end:
            result.append([start, end])
        
        if first[i][1] < second[j][1]:
            i += 1
        else:
            j += 1
    
    return result
```

**Characteristics:** Two pointers, both lists sorted by start.

---

### Form 6: Can Attend All Meetings

```python
def can_attend_meetings(intervals: List[List[int]]) -> bool:
    """
    Form: Check if person can attend all (no overlaps).
    Input: [[0,30], [5,10], [15,20]]
    Output: False (overlaps exist)
    """
    intervals.sort(key=lambda x: x[0])
    
    for i in range(1, len(intervals)):
        if intervals[i][0] < intervals[i-1][1]:
            return False
    
    return True
```

**Characteristics:** Simple check for any overlap after sorting.

---

### Form 7: Find Free Time / Employee Free Time

```python
def employee_free_time(schedule: List[List[List[int]]]) -> List[List[int]]:
    """
    Form: Find common free time across all schedules.
    Input: [[[1,2], [5,6]], [[1,3]], [[4,10]]]
    Output: [[3,4]]
    """
    # Flatten all intervals
    all_intervals = []
    for s in schedule:
        all_intervals.extend(s)
    
    # Merge all
    all_intervals.sort(key=lambda x: x[0])
    merged = [all_intervals[0]]
    
    for curr in all_intervals[1:]:
        last = merged[-1]
        if curr[0] <= last[1]:
            last[1] = max(last[1], curr[1])
        else:
            merged.append(curr)
    
    # Find gaps
    free = []
    for i in range(1, len(merged)):
        if merged[i-1][1] < merged[i][0]:
            free.append([merged[i-1][1], merged[i][0]])
    
    return free
```

**Characteristics:** Merge all intervals, then find gaps between them.

---

### Form Comparison Table

| Form | Problem Type | Sort By | Core Operation | Output |
|------|--------------|---------|----------------|--------|
| 1. Standard Merge | Combine overlapping | Start | Extend end | Merged list |
| 2. Insert Interval | Add to sorted | N/A (pre-sorted) | Three-phase scan | New merged list |
| 3. Activity Selection | Max non-overlapping | End | Greedy pick | Count |
| 4. Min Meeting Rooms | Resource allocation | Start | Heap track | Room count |
| 5. Intersection | Common intervals | Start (both) | Two pointers | Intersection list |
| 6. Can Attend All | Conflict detection | Start | Adjacent check | Boolean |
| 7. Free Time | Gap finding | Start | Merge then gaps | Gap list |

---

### Form Identification Guide

| Keywords | Form | Key Constraint |
|----------|------|---------------|
| "Merge overlapping" | 1 | Combine all overlapping |
| "Insert into sorted" | 2 | Input already sorted |
| "Non-overlapping" / "compatible" / "remove minimum" | 3 | Maximize count |
| "Meeting rooms" / "conference rooms" | 4 | Min resources |
| "Intersection" / "common range" | 5 | Two input lists |
| "Can attend all" / "no conflicts" | 6 | Boolean check |
| "Free time" / "available slots" | 7 | Multiple schedules |

<!-- back -->
