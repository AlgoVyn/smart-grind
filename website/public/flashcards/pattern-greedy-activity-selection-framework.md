## Greedy - Activity Selection: Framework

What is the complete code template for activity selection?

<!-- front -->

---

### Framework 1: Activity Selection Template

```
┌─────────────────────────────────────────────────────┐
│  ACTIVITY SELECTION - GREEDY TEMPLATE                │
├─────────────────────────────────────────────────────┤
│  1. Sort activities by finish time (ascending)      │
│  2. Select first activity (earliest finish)            │
│     count = 1                                         │
│     last_finish = finish of first                    │
│  3. For each remaining activity:                    │
│     a. If start >= last_finish:                     │
│        - Select this activity                        │
│        - count += 1                                   │
│        - last_finish = this finish                   │
│  4. Return count                                      │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: Activity Selection

```python
def activity_selection(activities):
    """
    Find maximum number of non-overlapping activities.
    activities: list of (start, end) tuples
    """
    # Sort by finish time
    activities.sort(key=lambda x: x[1])
    
    count = 1
    last_finish = activities[0][1]
    selected = [activities[0]]
    
    for i in range(1, len(activities)):
        start, finish = activities[i]
        
        if start >= last_finish:
            selected.append(activities[i])
            count += 1
            last_finish = finish
    
    return count, selected
```

---

### Implementation: Meeting Rooms II

```python
import heapq

def min_meeting_rooms(intervals):
    """Find minimum number of conference rooms required."""
    if not intervals:
        return 0
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    # Min heap: end times of ongoing meetings
    rooms = [intervals[0][1]]
    
    for i in range(1, len(intervals)):
        start, end = intervals[i]
        
        # If earliest ending meeting ends before/at current start
        if rooms[0] <= start:
            heapq.heappop(rooms)
        
        heapq.heappush(rooms, end)
    
    return len(rooms)
```

---

### Implementation: Non-overlapping Intervals

```python
def erase_overlap_intervals(intervals):
    """Remove minimum intervals to make all non-overlapping."""
    if not intervals:
        return 0
    
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    
    count = 1  # Keep first
    last_end = intervals[0][1]
    
    for i in range(1, len(intervals)):
        start, end = intervals[i]
        
        if start >= last_end:
            # No overlap, keep this
            count += 1
            last_end = end
    
    # Remove = total - keep
    return len(intervals) - count
```

---

### Key Pattern Elements

| Element | Purpose | Greedy Choice |
|---------|---------|---------------|
| Sort by finish | Earliest finish first | Optimal substructure |
| `last_finish` | Track last selected | Compatibility check |
| `start >= last_finish` | No overlap | Selection criteria |

<!-- back -->
