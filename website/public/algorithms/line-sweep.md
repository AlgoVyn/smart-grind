# Line Sweep (Sweep Line Algorithm)

## Category
Computational Geometry

## Description

The Line Sweep algorithm processes geometric or interval problems by "sweeping" a line across the plane and tracking events as the line moves. It efficiently handles problems involving intervals, rectangles, and overlapping regions by converting continuous geometric problems into discrete event processing.

The algorithm's power lies in its ability to transform complex geometric problems into manageable event processing tasks. By sorting events by position and maintaining an active set of currently intersecting objects, the algorithm achieves O(n log n) time complexity for many problems that would otherwise require O(n²) brute-force approaches. Applications include rectangle union area, skyline generation, interval overlap detection, and closest pair problems.

---

## Concepts

The line sweep algorithm relies on several fundamental concepts that make it efficient for geometric problems.

### 1. Event Generation

Converting continuous problems into discrete events:

| Event Type | Meaning | Action |
|------------|---------|--------|
| **Enter/Start** | Object begins | Add to active set |
| **Exit/End** | Object ends | Remove from active set |
| **Intersection** | Objects meet | Process relationship |

### 2. Active Set Management

Tracking currently intersecting objects:

| Data Structure | Use Case | Operations |
|---------------|----------|------------|
| **Priority Queue/Heap** | Max/min heights | O(log n) add/remove |
| **Balanced BST** | Ordered queries | O(log n) search/insert/delete |
| **Ordered Set** | Range queries | O(log n) operations |

### 3. Event Ordering

Critical for correct processing:

```
Sort Events By:
  1. Position (x-coordinate for vertical sweep)
  2. Event type (enter before exit at same position)
  3. Other criteria (height, priority)

Example: [x=1, enter], [x=2, enter], [x=2, exit], [x=3, exit]
```

### 4. Processing Between Events

State remains constant between events:

```
Between event positions x[i] and x[i+1]:
  - Active set doesn't change
  - Can compute area/length once
  - Move to next event position
```

---

## Frameworks

Structured approaches for implementing line sweep algorithms.

### Framework 1: Building Skyline

```
┌─────────────────────────────────────────────────────────────┐
│  SKYLINE PROBLEM FRAMEWORK                                    │
├─────────────────────────────────────────────────────────────┤
│  Input: List of buildings (left, right, height)              │
│  Output: List of (x, height) key points                        │
│                                                                │
│  1. Create events:                                             │
│     - (left, -height, right) for building start             │
│     - (right, 0, 0) for building end                        │
│     - Negative height distinguishes start from end            │
│                                                                │
│  2. Sort events:                                               │
│     - By x coordinate                                          │
│     - If same x: starts before ends (negative < positive)    │
│     - If both starts: taller first                           │
│                                                                │
│  3. Sweep with max-heap of active heights:                   │
│     - Process each event:                                      │
│       * Start: add height to heap, push (right, height)      │
│       * End: remove ended buildings, clean heap top          │
│     - After processing, get current max height               │
│     - If max changed, add key point (x, new_max)              │
│                                                                │
│  4. Return list of key points                                  │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Skyline/building silhouette problems.

### Framework 2: Interval Counting

```
┌─────────────────────────────────────────────────────────────┐
│  INTERVAL COUNTING FRAMEWORK                                  │
├─────────────────────────────────────────────────────────────┤
│  Input: List of intervals (start, end)                     │
│  Output: Maximum overlap count                               │
│                                                                │
│  1. Create events:                                             │
│     - (start, +1) for interval begin                          │
│     - (end, -1) for interval end                              │
│                                                                │
│  2. Sort events:                                               │
│     - By position                                              │
│     - If same position: ends before starts (-1 before +1)   │
│                                                                │
│  3. Sweep and count:                                          │
│     - active = 0                                               │
│     - max_active = 0                                           │
│     - For each event:                                          │
│         active += delta                                        │
│         max_active = max(max_active, active)                   │
│                                                                │
│  4. Return max_active                                           │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Meeting rooms, concurrent events, resource allocation.

### Framework 3: Rectangle Area Union

```
┌─────────────────────────────────────────────────────────────┐
│  RECTANGLE AREA UNION FRAMEWORK                               │
├─────────────────────────────────────────────────────────────┤
│  Input: List of rectangles (x1, y1, x2, y2)                │
│  Output: Total area of union                                  │
│                                                                │
│  1. Create x-events:                                           │
│     - (x1, y1, y2, +1) for left edge (enter)               │
│     - (x2, y1, y2, -1) for right edge (exit)               │
│                                                                │
│  2. Coordinate compress y-values:                             │
│     - Collect all y1, y2                                     │
│     - Sort and map to indices                                  │
│                                                                │
│  3. Sweep x from left to right:                              │
│     - Between x[i] and x[i+1]:                              │
│         width = x[i+1] - x[i]                                │
│         height = total covered y-length                      │
│         area += width * height                                 │
│     - Process events at x[i+1]:                                │
│         Update active y-intervals                            │
│         Update covered y-length                                │
│                                                                │
│  4. Return total area                                          │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Rectangle overlap area problems.

---

## Forms

Different manifestations of the line sweep pattern.

### Form 1: Vertical Line Sweep

Sweep left to right (x-direction).

| Problem Type | Use Case | Data Structure |
|-------------|----------|----------------|
| **Skyline** | Building silhouettes | Max-heap |
| **Rectangle Union** | Area of overlap | Segment tree or interval list |
| **Closest Pair** | Nearest points | Balanced BST |

### Form 2: Horizontal Line Sweep

Sweep bottom to top (y-direction).

| Problem Type | Use Case | Data Structure |
|-------------|----------|----------------|
| **2D Closest Pair** | Rotate and sweep | Balanced BST |
| **Convex Hull** | Graham scan | Stack |
| **Visibility** | Line of sight problems | Event queue |

### Form 3: Angular Sweep

Sweep by angle around a point.

| Problem Type | Use Case |
|-------------|----------|
| **Circular Range** | Points in circular sector |
| **Visibility Polygon** | Visible area from point |
| **Art Gallery** | Guard placement problems |

### Form 4: Event-Based Sweep

Pure event processing without spatial sweep.

| Problem Type | Use Case |
|-------------|----------|
| **Interval Scheduling** | Meeting rooms, resources |
| **Timeline Processing** | Historical event analysis |
| **Job Scheduling** | Task overlap detection |

### Form 5: Multi-Dimensional Sweep

Higher dimensional sweeps.

| Problem Type | Complexity | Use Case |
|-------------|------------|----------|
| **3D Sweep** | O(n² log n) | Volume calculations |
| **KD-Tree Sweep** | Varies | Nearest neighbor queries |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Skyline Algorithm

The classic building skyline problem:

```python
import heapq

def get_skyline(buildings):
    """
    LeetCode 218: The Skyline Problem.
    Time: O(n log n), Space: O(n)
    """
    events = []
    for left, right, height in buildings:
        events.append((left, -height, right))  # Start
        events.append((right, 0, 0))  # End
    
    events.sort()  # Sort by x, then by height (negative for starts)
    
    # Max heap: (-height, right_end)
    result = [[0, 0]]
    heap = [(0, float('inf'))]
    
    for x, h, r in events:
        if h < 0:  # Start
            heapq.heappush(heap, (h, r))
        
        # Remove ended buildings
        while heap and heap[0][1] <= x:
            heapq.heappop(heap)
        
        curr_max = -heap[0][0]
        if curr_max != result[-1][1]:
            result.append([x, curr_max])
    
    return result[1:]
```

### Tactic 2: Meeting Rooms II

Minimum meeting rooms needed:

```python
def min_meeting_rooms(intervals):
    """
    LeetCode 253: Meeting Rooms II.
    Time: O(n log n), Space: O(n)
    """
    events = []
    for start, end in intervals:
        events.append((start, 1))   # Enter
        events.append((end, -1))    # Exit
    
    # Sort: end events before start events at same time
    events.sort(key=lambda x: (x[0], x[1]))
    
    max_rooms = curr_rooms = 0
    for time, delta in events:
        curr_rooms += delta
        max_rooms = max(max_rooms, curr_rooms)
    
    return max_rooms
```

### Tactic 3: Rectangle Area II

Union of rectangle areas:

```python
def rectangle_area(rectangles):
    """
    LeetCode 850: Rectangle Area II.
    Time: O(n² log n), Space: O(n)
    """
    MOD = 10**9 + 7
    
    # Events: (x, y1, y2, type)
    events = []
    y_coords = set()
    
    for x1, y1, x2, y2 in rectangles:
        events.append((x1, y1, y2, 1))   # Enter
        events.append((x2, y1, y2, -1))  # Exit
        y_coords.update([y1, y2])
    
    events.sort()
    y_list = sorted(y_coords)
    y_index = {y: i for i, y in enumerate(y_list)}
    
    # Active interval counting
    active = [0] * (len(y_list) - 1)
    prev_x = events[0][0]
    area = 0
    
    for x, y1, y2, typ in events:
        # Calculate area since last x
        width = x - prev_x
        if width > 0:
            covered_y = sum(y_list[i+1] - y_list[i] 
                           for i in range(len(y_list)-1) if active[i] > 0)
            area = (area + width * covered_y) % MOD
        
        # Update active intervals
        for i in range(y_index[y1], y_index[y2]):
            active[i] += typ
        
        prev_x = x
    
    return area
```

### Tactic 4: Car Pooling

Capacity check for intervals:

```python
def car_pooling(trips, capacity):
    """
    LeetCode 1094: Car Pooling.
    Check if car can accommodate all trips.
    Time: O(n log n), Space: O(n)
    """
    events = []
    for num, start, end in trips:
        events.append((start, num))    # Pick up
        events.append((end, -num))     # Drop off
    
    events.sort()  # Drop before pick at same location
    
    passengers = 0
    for location, delta in events:
        passengers += delta
        if passengers > capacity:
            return False
    
    return True
```

### Tactic 5: My Calendar II

Double booking detection:

```python
class MyCalendarTwo:
    """
    LeetCode 731: My Calendar II.
    Track when events have triple booking.
    """
    def __init__(self):
        self.bookings = []
    
    def book(self, start: int, end: int) -> bool:
        events = []
        for s, e in self.bookings:
            events.append((s, 1))
            events.append((e, -1))
        events.append((start, 1))
        events.append((end, -1))
        
        events.sort()
        
        active = 0
        for time, delta in events:
            active += delta
            if active > 2:
                return False
        
        self.bookings.append((start, end))
        return True
```

---

## Python Templates

### Template 1: Skyline Problem

```python
import heapq
from typing import List

def get_skyline(buildings: List[List[int]]) -> List[List[int]]:
    """
    LeetCode 218: The Skyline Problem.
    Returns key points of the skyline contour.
    
    Args:
        buildings: List of [left, right, height]
    
    Returns:
        List of [x, height] key points
        
    Time: O(n log n)
    Space: O(n)
    """
    if not buildings:
        return []
    
    # Create events: (x, height, right)
    # Use negative height for starts to distinguish from ends
    events = []
    for left, right, height in buildings:
        events.append((left, -height, right))  # Building start
        events.append((right, 0, 0))  # Building end
    
    # Sort by x, then by height (starts before ends, taller first)
    events.sort()
    
    # Max heap of (-height, right_end)
    result = []
    heap = [(0, float('inf'))]  # Ground level at infinity
    
    for x, h, r in events:
        if h < 0:  # Building starts
            heapq.heappush(heap, (h, r))
        
        # Remove buildings that have ended
        while heap and heap[0][1] <= x:
            heapq.heappop(heap)
        
        # Current max height
        curr_height = -heap[0][0]
        
        # Add key point if height changed
        if not result or result[-1][1] != curr_height:
            result.append([x, curr_height])
    
    return result
```

### Template 2: Meeting Rooms II (Minimum Rooms)

```python
def min_meeting_rooms(intervals: list[list[int]]) -> int:
    """
    LeetCode 253: Meeting Rooms II.
    Find minimum meeting rooms required.
    
    Args:
        intervals: List of [start, end] times
    
    Returns:
        Minimum number of rooms needed
        
    Time: O(n log n)
    Space: O(n)
    """
    if not intervals:
        return 0
    
    # Create events
    events = []
    for start, end in intervals:
        events.append((start, 1))   # Meeting starts
        events.append((end, -1))    # Meeting ends
    
    # Sort: if same time, end before start
    events.sort(key=lambda x: (x[0], x[1]))
    
    max_rooms = 0
    current_rooms = 0
    
    for time, delta in events:
        current_rooms += delta
        max_rooms = max(max_rooms, current_rooms)
    
    return max_rooms
```

### Template 3: Car Pooling

```python
def car_pooling(trips: list[list[int]], capacity: int) -> bool:
    """
    LeetCode 1094: Car Pooling.
    Check if all trips can be completed with given capacity.
    
    Args:
        trips: List of [num_passengers, start, end]
        capacity: Car capacity
    
    Returns:
        True if possible, False otherwise
        
    Time: O(n log n)
    Space: O(n)
    """
    events = []
    
    for num, start, end in trips:
        events.append((start, num))    # Pick up
        events.append((end, -num))     # Drop off
    
    # Sort by location
    events.sort()
    
    current_passengers = 0
    
    for location, delta in events:
        current_passengers += delta
        if current_passengers > capacity:
            return False
    
    return True
```

### Template 4: Generic Line Sweep Template

```python
def line_sweep(events: list[tuple], process_fn):
    """
    Generic line sweep template.
    
    Args:
        events: List of (position, type, data)
        process_fn: Function(active_set, event) -> None
    
    Returns:
        Result from processing
    """
    # Sort events by position
    events.sort(key=lambda x: x[0])
    
    active_set = set()  # or appropriate data structure
    results = []
    
    for event in events:
        pos, typ, data = event
        
        # Process event
        if typ == 'enter':
            active_set.add(data)
        elif typ == 'exit':
            active_set.discard(data)
        
        # Compute intermediate result
        result = process_fn(active_set, event)
        if result is not None:
            results.append(result)
    
    return results
```

### Template 5: Interval Overlap Detection

```python
def has_overlap(intervals: list[list[int]]) -> bool:
    """
    Check if any intervals overlap.
    
    Args:
        intervals: List of [start, end]
    
    Returns:
        True if any overlap exists
        
    Time: O(n log n)
    Space: O(n)
    """
    events = []
    for start, end in intervals:
        events.append((start, 1))   # Start
        events.append((end, -1))    # End
    
    # Sort by time, ends before starts at same time
    events.sort(key=lambda x: (x[0], x[1]))
    
    active = 0
    for time, delta in events:
        active += delta
        if active > 1:  # More than one active interval
            return True
    
    return False
```

### Template 6: My Calendar I (No Overlap)

```python
class MyCalendar:
    """
    LeetCode 729: My Calendar I.
    Book events without overlap.
    """
    def __init__(self):
        self.events = []
    
    def book(self, start: int, end: int) -> bool:
        """
        Book an event if no overlap.
        
        Returns:
            True if booked successfully, False if overlap
        """
        for s, e in self.events:
            if max(start, s) < min(end, e):  # Overlap
                return False
        
        self.events.append((start, end))
        self.events.sort()  # Keep sorted for efficiency
        return True

# More efficient version using sorted containers
from bisect import bisect_left

class MyCalendarEfficient:
    def __init__(self):
        self.starts = []
        self.ends = []
    
    def book(self, start: int, end: int) -> bool:
        i = bisect_left(self.starts, end)
        if i > 0 and self.ends[i-1] > start:
            return False
        
        self.starts.insert(i, start)
        self.ends.insert(i, end)
        return True
```

---

## When to Use

Use Line Sweep when you need to solve problems involving:

- **Geometric Overlaps**: Rectangle intersections, area unions
- **Interval Processing**: Meeting rooms, scheduling, resource allocation
- **Skyline/Contour**: Building silhouettes, terrain profiles
- **Closest Pairs**: Nearest points in 2D space
- **Event-Based Analysis**: Timeline processing, historical events

### Comparison with Alternatives

| Problem | Brute Force | Line Sweep | Best Approach |
|---------|-------------|------------|---------------|
| **Skyline** | O(n²) | O(n log n) | Line sweep |
| **Meeting Rooms** | O(n²) | O(n log n) | Line sweep |
| **Rectangle Union** | O(n²) | O(n²) or O(n log n) | Line sweep + segment tree |
| **Closest Pair** | O(n²) | O(n log n) | Line sweep |
| **Convex Hull** | O(n³) | O(n log n) | Graham scan (sweep) |

### When to Choose Each Approach

- **Choose Line Sweep** when:
  - Problem involves intervals or 1D/2D geometry
  - Can define "events" at specific positions
  - Need to track "active" set of objects
  - O(n log n) is acceptable vs O(n²)

- **Choose Brute Force** when:
  - n is very small (n < 100)
  - Overhead of sweep not worth it
  - Simple implementation preferred

- **Choose Segment Tree** when:
  - Need range queries during sweep
  - Working with interval union/area problems
  - Active set needs complex range operations

---

## Algorithm Explanation

### Core Concept

The line sweep algorithm converts continuous geometric problems into discrete event processing by observing that the state of the problem only changes at specific "event" positions. Between events, the state remains constant, allowing batch processing.

### How It Works

#### Step 1: Event Generation

Identify all positions where state changes:
```python
events = []
for each object:
    events.append((enter_position, 'enter', object))
    events.append((exit_position, 'exit', object))
```

#### Step 2: Sort Events

Order events by position, with tie-breaking rules:
```python
events.sort(key=lambda e: (e.position, e.type_priority))
# Typically: enter before exit at same position
```

#### Step 3: Sweep and Process

Move through events, maintaining active set:
```python
active = set()
for event in events:
    if event.type == 'enter':
        active.add(event.object)
    else:
        active.remove(event.object)
    
    # Process state between this and next event
    process(active)
```

### Visual Representation

**Meeting Rooms Sweep:**
```
Timeline: 0----1----2----3----4----5----6----7
Meeting A: [1========3]
Meeting B:     [2========5]
Meeting C:         [4====6]

Events: 1(A enter), 2(B enter), 3(A exit), 4(C enter), 5(B exit), 6(C exit)

Sweep:
  t=1: {A} active=1
  t=2: {A,B} active=2 (max=2)
  t=3: {B} active=1
  t=4: {B,C} active=2
  t=5: {C} active=1
  t=6: {} active=0

Result: max_rooms = 2
```

### Why Line Sweep Works

1. **Discrete Events**: Continuous problem → discrete processing points
2. **Sorted Order**: Process left to right systematically
3. **Active Set**: Only track currently relevant objects
4. **Efficiency**: O(n log n) from sorting, not O(n²)

### Limitations

- **Sorting Overhead**: O(n log n) required upfront
- **Active Set Size**: Can grow large in worst case
- **2D Complexity**: Some 2D problems need O(n²) or complex data structures
- **Event Definition**: Must be able to define clear events

---

## Practice Problems

### Problem 1: The Skyline Problem

**Problem:** [LeetCode 218 - The Skyline Problem](https://leetcode.com/problems/the-skyline-problem/)

**Description:** Generate skyline contour from building heights.

**How to Apply Line Sweep:**
- Events at building starts and ends
- Max-heap of active heights
- Record height changes

---

### Problem 2: Meeting Rooms II

**Problem:** [LeetCode 253 - Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/)

**Description:** Find minimum meeting rooms needed.

**How to Apply Line Sweep:**
- Events at meeting start and end
- Count active meetings
- Track maximum

---

### Problem 3: Rectangle Area II

**Problem:** [LeetCode 850 - Rectangle Area II](https://leetcode.com/problems/rectangle-area-ii/)

**Description:** Find area of union of rectangles.

**How to Apply Line Sweep:**
- Sweep x-axis
- Track active y-intervals
- Use segment tree or interval counting

---

### Problem 4: Minimum Interval to Include Each Query

**Problem:** [LeetCode 1851 - Minimum Interval to Include Each Query](https://leetcode.com/problems/minimum-interval-to-include-each-query/)

**Description:** For each query point, find smallest interval containing it.

**How to Apply Line Sweep:**
- Sort intervals and queries
- Process in order with priority queue
- Track active intervals

---

### Problem 5: Car Pooling

**Problem:** [LeetCode 1094 - Car Pooling](https://leetcode.com/problems/car-pooling/)

**Description:** Check if car can accommodate all trips.

**How to Apply Line Sweep:**
- Events at pick-up and drop-off
- Track current passengers
- Check against capacity

---

## Video Tutorial Links

### Fundamentals

- [Line Sweep Algorithm - William Fiset](https://www.youtube.com/watch?v=dePDHVov-JE) - Geometric sweep
- [Skyline Problem - NeetCode](https://www.youtube.com/watch?v=8Kd-Tn0zVlI) - Problem walkthrough
- [Sweep Line - Algorithm Gym](https://www.youtube.com/watch?v=7fi7A3QLP6s) - Advanced problems

### Implementation

- [Meeting Rooms II - Back to Back SWE](https://www.youtube.com/watch?v=NKf1OJEXwNA) - Interval sweep
- [Rectangle Area - Algorithms](https://www.youtube.com/watch?v=J4Sp43Zd2KA) - 2D sweep

---

## Follow-up Questions

### Q1: What makes line sweep O(n log n)?

**Answer:** The sorting step dominates at O(n log n). The sweep itself is O(n) or O(n × cost_of_active_set_operation). If active set operations are O(log n) (heap, balanced BST), total is O(n log n).

---

### Q2: When should I use segment tree with line sweep?

**Answer:** Use segment tree when the active set requires range queries or updates during the sweep. For example, rectangle area union needs to query total covered y-length, which benefits from a segment tree maintaining covered lengths.

---

### Q3: How do I handle 3D sweep problems?

**Answer:** 3D sweep (plane sweep) is more complex. Sweep along one axis, maintain a 2D structure for the other two. Often requires 2D segment trees or range trees, making it O(n² log n) or higher.

---

### Q4: What's the difference between line sweep and event-based processing?

**Answer:** Line sweep specifically refers to spatial sweeps (left to right, bottom to top). Event-based processing is more general—can be timeline-based, priority-based, etc. Line sweep is a type of event-based processing with spatial ordering.

---

### Q5: Can line sweep work for non-geometric problems?

**Answer:** Yes! Any problem with "events" and an "active set" can use this pattern. Examples: meeting rooms (time axis), CPU scheduling (time axis), interval graphs. The key is defining meaningful events and active state.

---

## Summary

The Line Sweep algorithm is a powerful technique for solving geometric and interval problems efficiently. The key takeaways are:

1. **Event Generation**: Convert continuous problems to discrete events
2. **Sorted Processing**: Process events in order (typically left to right)
3. **Active Set**: Track currently relevant objects
4. **State Changes**: Problem state only changes at event positions
5. **Efficiency**: Typically O(n log n) vs O(n²) brute force

**When to Use:**
- Geometric overlap problems
- Interval scheduling and resource allocation
- Skyline/contour generation
- Any problem with "active" periods and event triggers

**Common Pattern:**
```python
# Generate events
events = [(start, 'enter'), (end, 'exit') for each object]
events.sort()

# Sweep
active = set()
for pos, typ, data in events:
    if typ == 'enter': active.add(data)
    else: active.remove(data)
    process(active)
```

This pattern is essential for competitive programming and computational geometry, providing efficient solutions to seemingly complex spatial problems.
