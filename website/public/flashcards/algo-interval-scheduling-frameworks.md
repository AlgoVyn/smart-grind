## Interval Scheduling: Frameworks

What are the standard implementations for interval scheduling problems?

<!-- front -->

---

### Maximum Cardinality Framework

```python
def interval_scheduling_max(intervals):
    """
    Select maximum number of non-overlapping intervals
    intervals: list of (start, end) tuples
    """
    if not intervals:
        return []
    
    # Sort by finish time
    sorted_intervals = sorted(intervals, key=lambda x: x[1])
    
    result = [sorted_intervals[0]]
    last_finish = sorted_intervals[0][1]
    
    for interval in sorted_intervals[1:]:
        start, end = interval
        if start >= last_finish:
            result.append(interval)
            last_finish = end
    
    return result

# Alternative: return count only
def max_intervals_count(intervals):
    if not intervals:
        return 0
    
    # Sort by end time, then by start time
    intervals.sort(key=lambda x: (x[1], x[0]))
    
    count = 1
    last_end = intervals[0][1]
    
    for start, end in intervals[1:]:
        if start >= last_end:
            count += 1
            last_end = end
    
    return count
```

---

### Weighted Interval Scheduling Framework

```python
def weighted_interval_scheduling(intervals):
    """
    intervals: list of (start, end, weight)
    Find maximum weight subset of non-overlapping intervals
    """
    if not intervals:
        return 0, []
    
    # Sort by finish time
    intervals.sort(key=lambda x: x[1])
    n = len(intervals)
    
    # dp[i] = max weight using intervals[0..i]
    dp = [0] * n
    selected = [[] for _ in range(n)]
    
    # Find previous non-conflicting interval using binary search
    def find_previous(i):
        # Binary search for rightmost interval ending before intervals[i].start
        lo, hi = 0, i
        while lo < hi:
            mid = (lo + hi) // 2
            if intervals[mid][1] <= intervals[i][0]:
                lo = mid + 1
            else:
                hi = mid
        return lo - 1
    
    dp[0] = intervals[0][2]
    selected[0] = [0]
    
    for i in range(1, n):
        weight = intervals[i][2]
        prev = find_previous(i)
        
        # Option 1: Take interval i
        take_weight = weight + (dp[prev] if prev >= 0 else 0)
        
        # Option 2: Skip interval i
        skip_weight = dp[i-1]
        
        if take_weight > skip_weight:
            dp[i] = take_weight
            selected[i] = selected[prev] + [i] if prev >= 0 else [i]
        else:
            dp[i] = skip_weight
            selected[i] = selected[i-1][:]
    
    return dp[-1], selected[-1]
```

---

### Interval Partitioning Framework

```python
def min_classrooms_needed(intervals):
    """
    Minimum number of classrooms to schedule all intervals
    """
    if not intervals:
        return 0
    
    # Create events: (time, type) where type 0=start, 1=end
    events = []
    for start, end in intervals:
        events.append((start, 0))  # Start
        events.append((end, 1))    # End
    
    # Sort: ends before starts at same time
    events.sort(key=lambda x: (x[0], x[1]))
    
    max_rooms = 0
    current_rooms = 0
    
    for time, typ in events:
        if typ == 0:  # Start
            current_rooms += 1
            max_rooms = max(max_rooms, current_rooms)
        else:  # End
            current_rooms -= 1
    
    return max_rooms
import heapq

def schedule_with_min_rooms(intervals):
    """
    Actually assign intervals to classrooms
    """
    if not intervals:
        return []
    
    # Sort by start time
    sorted_intervals = sorted(intervals, key=lambda x: x[0])
    
    # Min-heap: (end_time, room_number)
    rooms = []  # Available rooms when they free up
    room_assignments = {}
    next_room = 0
    
    for start, end in sorted_intervals:
        # Free up rooms that have ended
        if rooms and rooms[0][0] <= start:
            end_time, room = heapq.heappop(rooms)
            heapq.heappush(rooms, (end, room))
            room_assignments[(start, end)] = room
        else:
            # Need new room
            heapq.heappush(rooms, (end, next_room))
            room_assignments[(start, end)] = next_room
            next_room += 1
    
    return room_assignments
```

---

### Activity Selection with Multiple Resources

```python
def schedule_multiple_resources(intervals, k):
    """
    Schedule maximum intervals using k resources
    """
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    # Min-heap tracking end times of each resource
    resources = [0] * k  # When each resource becomes free
    
    count = 0
    
    for start, end in intervals:
        # Find first resource that becomes free before start
        earliest_idx = resources.index(min(resources))
        
        if resources[earliest_idx] <= start:
            resources[earliest_idx] = end
            count += 1
    
    return count
```

---

### Online Interval Scheduling

```python
class OnlineIntervalScheduler:
    """
    Process intervals as they arrive (online algorithm)
    """
    def __init__(self):
        self.selected = []
        self.last_finish = 0
    
    def process_interval(self, interval):
        """
        Decide whether to accept interval
        Greedy still works for competitive ratio
        """
        start, end = interval
        
        if start >= self.last_finish:
            self.selected.append(interval)
            self.last_finish = end
            return True
        
        # Could also consider: replace if finishes earlier
        # (more complex competitive analysis)
        return False
    
    def get_schedule(self):
        return self.selected
```

<!-- back -->
