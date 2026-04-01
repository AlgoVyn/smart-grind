# Merge Intervals

## Category
Arrays & Strings

## Description

The Merge Intervals algorithm is a fundamental pattern for combining overlapping intervals into a single set of non-overlapping intervals. This technique appears frequently in interval scheduling, calendar management, resource allocation, and computational geometry problems.

The key insight behind this algorithm is that by sorting intervals by their start times, we can process them in a single linear pass, detecting and merging overlapping intervals efficiently. This transforms a seemingly complex problem into an elegant O(n log n) solution.

---

## Concepts

The Merge Intervals technique is built on several fundamental concepts that make it powerful for solving interval-based problems.

### 1. Interval Representation

An interval is typically represented as `[start, end]` where `start <= end`. The state of an interval is defined by its boundaries.

| Property | Description | Example |
|----------|-------------|---------|
| **Start** | Beginning of interval | 1 in [1, 5] |
| **End** | Termination of interval | 5 in [1, 5] |
| **Duration** | Length of interval | `end - start` |
| **Overlap** | Shared region with another interval | [1,5] and [3,7] overlap |

### 2. Overlap Detection

Two intervals `[s1, e1]` and `[s2, e2]` overlap if and only if:

```
s2 <= e1 (assuming s1 <= s2 after sorting)
```

| Scenario | Condition | Action |
|----------|-----------|--------|
| **Complete Overlap** | s1 <= s2 and e1 >= e2 | Interval 2 is contained in 1 |
| **Partial Overlap** | s2 <= e1 and e2 > e1 | Merge into [s1, max(e1, e2)] |
| **Touching** | s2 == e1 | Merge into [s1, e2] |
| **No Overlap** | s2 > e1 | Separate intervals |

### 3. Sorting Strategy

Sorting is the critical preprocessing step:

| Sort By | Use Case | Complexity |
|---------|----------|------------|
| **Start Time** | Merging overlapping intervals | O(n log n) |
| **End Time** | Maximum non-overlapping intervals | O(n log n) |

### 4. Incremental Merging

Instead of comparing each interval with all others, maintain a "current merged interval" and compare only with that:

```
Current: [1, 3]     Next: [2, 6]     → Merge to [1, 6]
Current: [1, 6]     Next: [8, 10]    → Keep both
```

---

## Frameworks

Structured approaches for solving merge intervals problems.

### Framework 1: Standard Merge Intervals

```
┌─────────────────────────────────────────────────────┐
│  STANDARD MERGE INTERVALS FRAMEWORK                 │
├─────────────────────────────────────────────────────┤
│  1. Handle edge cases (empty/single interval)      │
│  2. Sort intervals by start time                     │
│  3. Initialize result with first interval            │
│  4. For each subsequent interval:                    │
│     a. Get last interval in result                   │
│     b. If current.start <= last.end:               │
│        - Merge: last.end = max(last.end, current.end)│
│     c. Else:                                         │
│        - Add current interval to result              │
│  5. Return merged intervals                          │
└─────────────────────────────────────────────────────┘
```

**When to use**: Classic merge intervals problem with overlapping detection.

### Framework 2: Insert Interval

```
┌─────────────────────────────────────────────────────┐
│  INSERT INTERVAL FRAMEWORK                          │
├─────────────────────────────────────────────────────┤
│  1. Find position where new interval fits            │
│  2. Add all intervals ending before new starts       │
│  3. Merge overlapping intervals:                     │
│     - Update new interval start = min(starts)        │
│     - Update new interval end = max(ends)            │
│  4. Add merged interval to result                    │
│  5. Add all remaining intervals                      │
└─────────────────────────────────────────────────────┘
```

**When to use**: Inserting a new interval into existing non-overlapping set.

### Framework 3: Interval Intersection

```
┌─────────────────────────────────────────────────────┐
│  INTERVAL INTERSECTION FRAMEWORK                    │
├─────────────────────────────────────────────────────┤
│  1. Initialize two pointers (i=0, j=0)              │
│  2. While i < len(A) and j < len(B):               │
│     a. Compute intersection:                         │
│        start = max(A[i].start, B[j].start)           │
│        end = min(A[i].end, B[j].end)                 │
│     b. If start <= end: add [start, end] to result   │
│     c. Move pointer with smaller end time            │
│  3. Return intersections                             │
└─────────────────────────────────────────────────────┘
```

**When to use**: Finding common time slots between two schedules.

---

## Forms

Different manifestations of the merge intervals pattern.

### Form 1: Complete Merge

Merge all overlapping intervals into the minimal non-overlapping set.

| Input | Output | Complexity |
|-------|--------|------------|
| [[1,3], [2,6], [8,10], [15,18]] | [[1,6], [8,10], [15,18]] | O(n log n) |
| [[1,4], [4,5]] | [[1,5]] | O(n log n) |
| [[1,4], [2,3]] | [[1,4]] | O(n log n) |

### Form 2: Meeting Rooms II

Find minimum rooms needed for all meetings (interval partitioning).

| Approach | Data Structure | Time Complexity |
|----------|----------------|-----------------|
| **Two Pointer** | Sorted arrays | O(n log n) |
| **Min Heap** | Priority queue | O(n log n) |
| **Sweep Line** | Timeline events | O(n log n) |

### Form 3: Non-overlapping Intervals

Find minimum intervals to remove (greedy by end time).

| Strategy | Sort By | Selection Criteria |
|----------|---------|-------------------|
| **Greedy** | End time | Keep intervals ending earliest |
| **DP** | Start time | Dynamic programming for weighted |

### Form 4: Employee Free Time

Find common free slots across all employee schedules.

```
Step 1: Flatten all intervals: [[1,2], [1,3], [4,5], [6,7]]
Step 2: Merge intervals: [[1,3], [4,5], [6,7]]
Step 3: Find gaps: [[3,4], [5,6]] → Free time!
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: In-Place Sorting

```python
def merge_intervals_inplace(intervals):
    """Merge intervals using in-place sort to save space."""
    if not intervals:
        return []
    
    # Sort in-place instead of creating new list
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

### Tactic 2: Binary Search for Insertion

```python
import bisect

def insert_interval_optimized(intervals, new_interval):
    """Insert interval using binary search for position."""
    if not intervals:
        return [new_interval]
    
    # Binary search for insertion point
    start_pos = bisect.bisect_left(intervals, [new_interval[0], float('-inf')])
    
    # Insert and merge locally around insertion point
    # Only need to check neighbors, not entire list
    # ... merge logic ...
    return result
```

### Tactic 3: Sweep Line for Meeting Rooms

```python
def min_meeting_rooms_sweep(intervals):
    """Count meeting rooms using sweep line technique."""
    events = []
    for start, end in intervals:
        events.append((start, 1))   # +1 room needed
        events.append((end, -1))      # -1 room freed
    
    # Sort by time, +1 before -1 if same time (start before end)
    events.sort(key=lambda x: (x[0], x[1]))
    
    rooms = 0
    max_rooms = 0
    for _, delta in events:
        rooms += delta
        max_rooms = max(max_rooms, rooms)
    
    return max_rooms
```

### Tactic 4: Greedy for Minimum Removals

```python
def erase_overlap_intervals(intervals):
    """Minimum intervals to remove - greedy by end time."""
    if not intervals:
        return 0
    
    # Sort by end time (not start time!)
    intervals.sort(key=lambda x: x[1])
    
    count = 1  # Keep first interval (ends earliest)
    last_end = intervals[0][1]
    
    for i in range(1, len(intervals)):
        if intervals[i][0] >= last_end:
            # Non-overlapping - keep it
            count += 1
            last_end = intervals[i][1]
        # else: overlapping - skip (will be removed)
    
    return len(intervals) - count
```

### Tactic 5: Two-Pointer for Intersection

```python
def interval_intersection_two_pointer(A, B):
    """Find intersection using two pointers."""
    result = []
    i = j = 0
    
    while i < len(A) and j < len(B):
        # Find intersection
        start = max(A[i][0], B[j][0])
        end = min(A[i][1], B[j][1])
        
        if start <= end:
            result.append([start, end])
        
        # Move pointer of interval that ends first
        if A[i][1] < B[j][1]:
            i += 1
        else:
            j += 1
    
    return result
```

---

## Python Templates

### Template 1: Basic Merge Intervals

```python
def merge_intervals(intervals: list[list[int]]) -> list[list[int]]:
    """
    Merge overlapping intervals.
    
    Args:
        intervals: List of [start, end] intervals
    
    Returns:
        List of merged non-overlapping intervals
    
    Time: O(n log n) - sorting dominates
    Space: O(n) - for storing result
    """
    if not intervals:
        return []
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    merged = [intervals[0]]
    
    for current_start, current_end in intervals[1:]:
        last_end = merged[-1][1]
        
        # Check for overlap
        if current_start <= last_end:
            # Merge: extend end to maximum
            merged[-1][1] = max(last_end, current_end)
        else:
            # No overlap - add new interval
            merged.append([current_start, current_end])
    
    return merged
```

### Template 2: Insert Interval

```python
def insert_interval(intervals: list[list[int]], new_interval: list[int]) -> list[list[int]]:
    """
    Insert a new interval into existing non-overlapping intervals.
    
    Args:
        intervals: List of non-overlapping intervals sorted by start
        new_interval: [start, end] interval to insert
    
    Returns:
        New list with inserted and merged interval
    """
    result = []
    i = 0
    n = len(intervals)
    new_start, new_end = new_interval
    
    # Add all intervals ending before new interval starts
    while i < n and intervals[i][1] < new_start:
        result.append(intervals[i])
        i += 1
    
    # Merge all overlapping intervals with new_interval
    while i < n and intervals[i][0] <= new_end:
        new_start = min(new_start, intervals[i][0])
        new_end = max(new_end, intervals[i][1])
        i += 1
    
    result.append([new_start, new_end])
    
    # Add remaining intervals
    while i < n:
        result.append(intervals[i])
        i += 1
    
    return result
```

### Template 3: Meeting Rooms II (Min Heap Approach)

```python
import heapq

def min_meeting_rooms(intervals: list[list[int]]) -> int:
    """
    Find minimum number of meeting rooms required.
    
    Args:
        intervals: List of [start, end] meeting times
    
    Returns:
        Minimum rooms needed
    """
    if not intervals:
        return 0
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    # Min heap to track end times of ongoing meetings
    min_heap = []
    
    for start, end in intervals:
        # If a meeting ended before this starts, reuse room
        if min_heap and min_heap[0] <= start:
            heapq.heappop(min_heap)
        
        # Allocate room (new or reused)
        heapq.heappush(min_heap, end)
    
    return len(min_heap)
```

### Template 4: Non-overlapping Intervals (Greedy)

```python
def erase_overlap_intervals(intervals: list[list[int]]) -> int:
    """
    Find minimum intervals to remove to make rest non-overlapping.
    LeetCode 435 variation.
    
    Args:
        intervals: List of [start, end] intervals
    
    Returns:
        Minimum number of intervals to remove
    """
    if not intervals:
        return 0
    
    # Sort by end time - crucial for greedy optimality
    intervals.sort(key=lambda x: x[1])
    
    # Always keep the interval that ends earliest
    keep_count = 1
    last_end = intervals[0][1]
    
    for i in range(1, len(intervals)):
        if intervals[i][0] >= last_end:
            # No overlap - can keep this interval
            keep_count += 1
            last_end = intervals[i][1]
        # else: overlap - skip (remove) this interval
    
    return len(intervals) - keep_count
```

### Template 5: Interval List Intersections

```python
def interval_intersection(A: list[list[int]], B: list[list[int]]) -> list[list[int]]:
    """
    Find intersections between two lists of intervals.
    LeetCode 986 solution.
    
    Args:
        A: First list of intervals
        B: Second list of intervals
    
    Returns:
        List of intersecting intervals
    """
    result = []
    i = j = 0
    
    while i < len(A) and j < len(B):
        # Find overlap
        start = max(A[i][0], B[j][0])
        end = min(A[i][1], B[j][1])
        
        if start <= end:
            result.append([start, end])
        
        # Move pointer of interval that ends first
        if A[i][1] < B[j][1]:
            i += 1
        else:
            j += 1
    
    return result
```

---

## When to Use

Use the Merge Intervals algorithm when you need to solve problems involving:

- **Interval Overlap Detection**: Finding all overlapping intervals in a collection
- **Calendar Scheduling**: Merging overlapping meeting times or events
- **Resource Allocation**: Combining time slots that conflict
- **Range Merging**: Consolidating continuous or overlapping ranges
- **Sweep Line Problems**: Using intervals to track changes over time

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|----------------|------------------|---------------|
| **Sort + Single Pass** | O(n log n) | O(n) | Most interval merging problems |
| **Brute Force** | O(n²) | O(n) | Small datasets, educational purposes |
| **Interval Tree** | O(n log n + k) | O(n) | Dynamic interval insertion and query |
| **Sweep Line** | O(n log n) | O(n) | Finding all intersection points |

### When to Choose Different Approaches

- **Sort + Single Pass** (this algorithm):
  - When all intervals are given upfront
  - When you need to merge/collapse intervals
  - When simplicity and efficiency are priorities

- **Interval Tree**:
  - When intervals are added dynamically
  - When you need to query which intervals contain a point
  - When you need to find all overlaps for a given interval

- **Sweep Line**:
  - When finding all intersection points between intervals
  - When tracking state changes at interval boundaries
  - When solving problems like "meeting rooms needed"

---

## Algorithm Explanation

### Core Concept

The fundamental principle behind the merge intervals algorithm is that **sorting intervals by their start time ensures any overlapping intervals will be adjacent**. This allows us to process all intervals in a single linear scan after sorting.

### How It Works

#### Key Insight
When intervals are sorted by start time, we only need to compare each interval with the **last merged interval**:
- If the current interval overlaps with the last merged interval, extend the end of the last merged interval
- Otherwise, start a new merged interval

#### The Overlap Condition
Two intervals `[start1, end1]` and `[start2, end2]` overlap if and only if:
```
start2 <= end1
```
(Assuming start1 <= start2 after sorting)

#### Visual Representation

For input `[[1,3], [2,6], [8,10], [15,18]]`:

```
Step 1 - Sort by start time:
[[1,3], [2,6], [8,10], [15,18]]

Step 2 - Process each interval:

Initial: merged = [[1,3]]

[2,6]: 2 <= 3? YES → Overlaps! 
        Merge: [1, max(3,6)] = [1,6]
        merged = [[1,6]]

[8,10]: 8 <= 6? NO → No overlap
        Add new: merged = [[1,6], [8,10]]

[15,18]: 15 <= 10? NO → No overlap  
        Add new: merged = [[1,6], [8,10], [15,18]]

Final Result: [[1,6], [8,10], [15,18]]
```

### Why It Works

- **After sorting**: All potentially overlapping intervals are adjacent
- **Single comparison**: We only need to track the "current merged interval"
- **Linear scan**: Each interval is processed exactly once → O(n) after sorting
- **The overlap check is O(1)**

### Limitations

- **Requires sorting**: O(n log n) is the lower bound due to comparison-based sorting
- **Static intervals**: Best for problems where all intervals are known upfront
- **Memory overhead**: May need O(n) space for the result

---

## Practice Problems

### Problem 1: Merge Intervals

**Problem:** [LeetCode 56 - Merge Intervals](https://leetcode.com/problems/merge-intervals/)

**Description:** Given an array of intervals where `intervals[i] = [starti, endi]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

**How to Apply:**
- Sort intervals by start time
- Iterate and merge overlapping intervals
- Time complexity: O(n log n) for sorting

---

### Problem 2: Meeting Rooms II

**Problem:** [LeetCode 253 - Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/)

**Description:** Given an array of meeting time intervals where `intervals[i] = [starti, endi]`, find the minimum number of conference rooms required.

**How to Apply:**
- First approach: Use merge intervals + sweep line
- Sort all start times and end times separately
- Count overlapping meetings at each point
- Alternative: Use min-heap to track room end times

---

### Problem 3: Non-overlapping Intervals

**Problem:** [LeetCode 435 - Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)

**Description:** Given an array of intervals `intervals[i] = [starti, endi]`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.

**How to Apply:**
- Sort by end time (not start time!)
- Greedy: always remove the interval that ends later
- Count intervals that can be kept, subtract from total

---

### Problem 4: Insert Interval

**Problem:** [LeetCode 57 - Insert Interval](https://leetcode.com/problems/insert-interval/)

**Description:** You are given an array of non-overlapping intervals where `intervals[i] = [starti, endi]` represent the start and the end of the intervals and intervals is sorted in ascending order by starti. Insert `newInterval` into intervals such that intervals is still sorted in ascending order by starti and intervals still does not have any overlapping intervals.

**How to Apply:**
- Add new interval to list
- Apply standard merge intervals algorithm
- Or: binary search for insertion point + merge locally

---

### Problem 5: Interval List Intersections

**Problem:** [LeetCode 986 - Interval List Intersections](https://leetcode.com/problems/interval-list-intersections/)

**Description:** You are given two lists of closed intervals, `firstList` and `secondList`, where `firstList[i] = [starti, endi]` and `secondList[j] = [startj, endj]`. The lists are sorted in ascending order by start. Return the intersection of these interval lists.

**How to Apply:**
- Use two pointers, one for each list
- At each step, find intersection of current intervals
- Move the pointer with smaller end time forward

---

## Video Tutorial Links

### Fundamentals

- [Merge Intervals - Concept and Implementation (Take U Forward)](https://www.youtube.com/watch?v=2F4r0N2u4vU) - Comprehensive introduction
- [Merge Intervals - LeetCode Explained (NeetCode)](https://www.youtube.com/watch?v=2W2y2X8X7Qw) - Step-by-step solution
- [Interval Problems - Pattern Overview (Back to Back SWE)](https://www.youtube.com/watch?v=44H3cE4_xjI) - Multiple interval patterns

### Problem-Specific

- [Meeting Rooms II - Minimum Rooms (WilliamFiset)](https://www.youtube.com/watch?v=zb72gK9jGNY) - Detailed explanation
- [Non-overlapping Intervals - Greedy Approach](https://www.youtube.com/watch?v=2F4r0N2u4vU) - Greedy solution
- [Insert Interval - LeetCode Solution](https://www.youtube.com/watch?v=1j4Q3i56p1I) - Edge case handling

### Advanced Topics

- [Sweep Line Algorithm](https://www.youtube.com/watch?v=4GS5DPD3g3s) - For complex interval problems
- [Interval Scheduling - Theory](https://www.youtube.com/watch?v=sz-ZRbtz2W8) - Greedy optimization
- [Divide and Conquer with Intervals](https://www.youtube.com/watch?v=r1s4L9z8W3A) - Advanced techniques

---

## Follow-up Questions

### Q1: Why do we sort by start time instead of end time for merging?

**Answer:** Sorting by start time ensures that any overlapping intervals will be adjacent in the sorted list. When we process intervals sequentially, we only need to compare each interval with the last merged interval. If we sorted by end time, we would need to check against multiple previous intervals, losing the O(n) single-pass property.

However, for some variations like "non-overlapping intervals," sorting by end time is actually better because it enables a greedy approach that always keeps intervals that end earliest.

---

### Q2: How would you handle intervals with negative numbers or large values?

**Answer:** The algorithm works identically regardless of the values:
- The sorting step compares numeric values regardless of sign
- The overlap condition `start <= last_end` works for any integers
- Only concern is integer overflow in languages like C++/Java for very large values - use 64-bit integers

---

### Q3: Can this algorithm be modified to handle floating-point intervals?

**Answer:** Yes, with minor modifications:
- Replace integer comparison with floating-point comparison
- Add an epsilon value for "touching" intervals: `start <= last_end + epsilon`
- Sorting works the same way
- Be careful with floating-point precision issues

---

### Q4: How would you merge intervals in place to save space?

**Answer:** Many implementations already do this:
- Sort the array in-place (most languages support this)
- Use the sorted array as both input and output storage
- This reduces space from O(n) to O(1) auxiliary space
- In Python: `intervals.sort(key=lambda x: x[0])` then merge

---

### Q5: What if intervals can have the same start time but different end times?

**Answer:** The algorithm handles this correctly:
- After sorting, intervals with same start time are adjacent
- They will be merged because `start <= last_end` will be true
- They effectively become one interval with the maximum end time
- Example: [[1,3], [1,5]] → [[1,5]]

---

## Summary

The Merge Intervals algorithm is a fundamental pattern for handling interval-based problems. Key takeaways:

- **Core insight**: Sort by start time, merge in single pass
- **Time complexity**: O(n log n) due to sorting
- **Space complexity**: O(n) for output, O(1) auxiliary
- **Key condition**: Overlap when `current_start <= last_end`

When to use:
- ✅ Merging overlapping intervals
- ✅ Finding minimum meeting rooms
- ✅ Calendar scheduling problems
- ✅ Resource allocation problems
- ❌ When intervals are dynamically added (use Interval Tree)
- ❌ When you need to find all overlaps for a specific interval

This pattern is essential for:
1. **Technical interviews** - Frequently asked at major tech companies
2. **Competitive programming** - Foundation for many interval problems
3. **Real-world applications** - Calendar apps, scheduling systems

The algorithm's elegance lies in its simplicity: just sort and scan. This makes it both easy to implement and easy to understand, while still being optimal for the problem constraints.
