## Greedy - Interval Merging/Scheduling: Framework

What is the complete code template for interval merging and scheduling problems?

<!-- front -->

---

### Framework 1: Standard Interval Merge

```
┌─────────────────────────────────────────────────────────────────┐
│  INTERVAL MERGE - STANDARD TEMPLATE                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Key Insight: Sort by start time, then sweep and merge         │
│                                                                 │
│  1. Sort intervals by start time:                               │
│     intervals.sort(key=lambda x: x[0])                         │
│                                                                 │
│  2. Initialize result with first interval:                      │
│     merged = [intervals[0]]                                    │
│                                                                 │
│  3. For each remaining interval:                                │
│     a. Get last = merged[-1]                                    │
│     b. If current[0] <= last[1]:   # Overlapping               │
│        - last[1] = max(last[1], current[1])  # Extend end     │
│     c. Else:                                                    │
│        - merged.append(current)   # Add new interval          │
│                                                                 │
│  4. Return merged                                               │
└─────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Standard Merge (Python)

```python
def merge(intervals: List[List[int]]) -> List[List[int]]:
    """
    Merge all overlapping intervals.
    Time: O(n log n) for sorting
    Space: O(n) for result
    """
    if not intervals:
        return []
    
    # Step 1: Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    # Step 2: Initialize with first interval
    merged = [intervals[0]]
    
    # Step 3: Process remaining intervals
    for current in intervals[1:]:
        last = merged[-1]
        
        # Check overlap: current starts before last ends
        if current[0] <= last[1]:
            # Merge: extend the end to max of both
            last[1] = max(last[1], current[1])
        else:
            # No overlap: add as new interval
            merged.append(current)
    
    return merged
```

---

### Framework 2: Activity Selection (Max Non-Overlapping)

```
┌─────────────────────────────────────────────────────────────────┐
│  ACTIVITY SELECTION - MAXIMUM NON-OVERLAPPING                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Key Insight: Sort by END time, pick earliest finishing first   │
│                                                                 │
│  1. Sort intervals by end time:                                 │
│     intervals.sort(key=lambda x: x[1])                         │
│                                                                 │
│  2. Select first interval, track its end time                   │
│     count = 1                                                   │
│     end = intervals[0][1]                                      │
│                                                                 │
│  3. For each remaining interval:                                │
│     a. If start >= end:          # Compatible                 │
│        - count += 1                                            │
│        - end = interval_end                                     │
│                                                                 │
│  4. Return count (or len - count for removals)                │
└─────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Activity Selection (Python)

```python
def erase_overlap_intervals(intervals: List[List[int]]) -> int:
    """
    Minimum intervals to remove to make rest non-overlapping.
    Sort by END time for optimal greedy choice.
    """
    if not intervals:
        return 0
    
    # KEY: Sort by end time, not start!
    intervals.sort(key=lambda x: x[1])
    
    count = 1           # First interval always selected
    end = intervals[0][1]
    
    for start, interval_end in intervals[1:]:
        if start >= end:       # Non-overlapping
            count += 1
            end = interval_end
    
    # Min to remove = total - max non-overlapping
    return len(intervals) - count


def schedule_maximum_meetings(intervals: List[List[int]]) -> int:
    """
    Schedule maximum number of non-overlapping meetings.
    """
    if not intervals:
        return 0
    
    intervals.sort(key=lambda x: x[1])
    
    count = 1
    end_time = intervals[0][1]
    
    for i in range(1, len(intervals)):
        if intervals[i][0] >= end_time:
            count += 1
            end_time = intervals[i][1]
    
    return count
```

---

### Framework 3: Minimum Meeting Rooms

```
┌─────────────────────────────────────────────────────────────────┐
│  MINIMUM MEETING ROOMS - HEAP TEMPLATE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Key Insight: Min-heap tracks when rooms free up                │
│                                                                 │
│  1. Sort intervals by start time                                │
│                                                                 │
│  2. Min-heap stores end times of ongoing meetings              │
│                                                                 │
│  3. For each meeting:                                           │
│     a. If heap[0] <= start:      # Room available              │
│        - heapq.heappop(heap)     # Free the room               │
│     b. heapq.heappush(heap, end) # Use room (new or reused)   │
│                                                                 │
│  4. Return len(heap) = minimum rooms needed                     │
└─────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Minimum Meeting Rooms (Python)

```python
def min_meeting_rooms(intervals: List[List[int]]) -> int:
    """
    Find minimum number of meeting rooms required.
    Uses min-heap to track end times.
    """
    if not intervals:
        return 0
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    # Min-heap: tracks when meetings end
    min_heap = []
    
    # Add first meeting
    heapq.heappush(min_heap, intervals[0][1])
    
    for start, end in intervals[1:]:
        # If earliest meeting ended, reuse that room
        if min_heap[0] <= start:
            heapq.heappop(min_heap)
        
        # Allocate room for current meeting
        heapq.heappush(min_heap, end)
    
    return len(min_heap)
```

---

### Key Framework Elements

| Element | Purpose | Merge | Activity | Min Rooms |
|---------|---------|-------|----------|-----------|
| Sort key | Primary sort | `x[0]` (start) | `x[1]` (end) | `x[0]` (start) |
| Data structure | Core storage | Array | Counter | Min-heap |
| Overlap check | Decision rule | `curr[0] <= last[1]` | `start >= end` | `heap[0] <= start` |
| Update action | What to do | Extend or add | Increment count | Pop/push |

<!-- back -->
