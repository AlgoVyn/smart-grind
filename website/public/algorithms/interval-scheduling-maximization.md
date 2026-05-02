# Interval Scheduling Maximization

## Category
Greedy Algorithms & Interval Problems

## Description

Interval Scheduling Maximization is a classic greedy algorithm problem where the goal is to select the maximum number of non-overlapping intervals (or activities) from a given set. This problem appears in various real-world scenarios including meeting room scheduling, task scheduling, resource allocation, and activity selection.

The key insight is that by always selecting the interval that finishes earliest among the remaining options, we leave the maximum possible room for subsequent intervals. This greedy choice leads to an optimal solution, which can be proven using an exchange argument showing that any optimal solution can be transformed to match the greedy solution without decreasing its size.

---

## Concepts

Interval scheduling relies on several fundamental concepts from greedy algorithms.

### 1. The Greedy Choice Property

Selecting the earliest finishing interval is optimal:

| Property | Explanation |
|----------|-------------|
| **Earliest Finish** | Leaves maximum room for remaining intervals |
| **Intuition** | Earlier finish → more time for others |
| **Optimality** | Can be proven via exchange argument |
| **Local vs Global** | Local optimal choice leads to global optimum |

### 2. Interval Representation

Common ways to represent intervals:

| Format | Example | Use Case |
|--------|---------|----------|
| **Start/End** | [1, 3] | Standard representation |
| **Start/Duration** | (1, 2) | Some problem variants |
| **Points on line** | [a, b] | Geometric interpretation |

### 3. Overlap Definition

Two intervals [s₁, e₁] and [s₂, e₂] overlap if:

```
Overlap condition: NOT (e₁ < s₂ OR e₂ < s₁)
Or equivalently: s₁ ≤ e₂ AND s₂ ≤ e₁
```

### 4. Variants

Different problem formulations:

| Variant | Goal | Complexity |
|---------|------|------------|
| **Max count** | Most intervals | O(n log n) greedy |
| **Max weight** | Maximum total weight | O(n log n) DP |
| **Min rooms** | Resource allocation | O(n log n) sweep line |
| **Longest chain** | Maximum chain length | O(n log n) greedy |

---

## Frameworks

Structured approaches for interval scheduling problems.

### Framework 1: Greedy by Earliest Finish Time

```
┌─────────────────────────────────────────────────────────────┐
│  GREEDY INTERVAL SCHEDULING FRAMEWORK                        │
├─────────────────────────────────────────────────────────────┤
│  Find maximum number of non-overlapping intervals:          │
│                                                             │
│  1. Sort all intervals by end time (ascending)             │
│                                                             │
│  2. Initialize:                                             │
│     count = 0                                                │
│     last_end = -infinity                                     │
│                                                             │
│  3. For each interval (start, end) in sorted order:       │
│     if start >= last_end:                                  │
│        select this interval                                 │
│        count += 1                                           │
│        last_end = end                                       │
│                                                             │
│  4. Return count                                            │
│                                                             │
│  Time: O(n log n) dominated by sorting                     │
│  Space: O(1) or O(n) depending on sort                     │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard interval scheduling, maximum count.

### Framework 2: Weighted Interval Scheduling

```
┌─────────────────────────────────────────────────────────────┐
│  WEIGHTED INTERVAL SCHEDULING FRAMEWORK                      │
├─────────────────────────────────────────────────────────────┤
│  Find maximum weight subset of non-overlapping intervals:  │
│                                                             │
│  1. Sort intervals by end time                              │
│                                                             │
│  2. For each interval i, find p[i]:                        │
│     p[i] = index of last interval that doesn't overlap i │
│     (Use binary search: O(log n))                          │
│                                                             │
│  3. DP:                                                     │
│     dp[i] = max weight using first i intervals             │
│     dp[i] = max(dp[i-1], weight[i] + dp[p[i]])             │
│                                                             │
│  4. Return dp[n]                                            │
│                                                             │
│  Time: O(n log n)                                           │
│  Space: O(n)                                                │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Intervals have different weights/values.

### Framework 3: Minimum Meeting Rooms

```
┌─────────────────────────────────────────────────────────────┐
│  MINIMUM MEETING ROOMS FRAMEWORK                             │
├─────────────────────────────────────────────────────────────┤
│  Find minimum rooms needed for all intervals:               │
│                                                             │
│  1. Create events:                                          │
│     For each interval [start, end]:                         │
│        Add (start, +1) event  # Start needs room           │
│        Add (end, -1) event    # End frees room             │
│                                                             │
│  2. Sort events by time:                                      │
│     If tie: process ends before starts (free before alloc) │
│                                                             │
│  3. Sweep through events:                                   │
│     current_rooms += delta                                   │
│     max_rooms = max(max_rooms, current_rooms)             │
│                                                             │
│  4. Return max_rooms                                         │
│                                                             │
│  Time: O(n log n)                                           │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Resource allocation, room scheduling.

---

## Forms

Different manifestations of interval scheduling.

### Form 1: Maximum Non-Overlapping (Unweighted)

Greedy by earliest finish.

| Case | Condition |
|------|-----------|
| **Proper intersection** | Segments straddle each other |
| **Endpoint touch** | Endpoint lies on other segment |
| **Compatible** | start >= last_end |

### Form 2: Weighted Interval Scheduling

DP with binary search.

```python
def weighted_interval_scheduling(intervals):
    """Maximum weight non-overlapping intervals."""
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    n = len(intervals)
    
    # dp[i] = max weight using first i intervals
    dp = [0] * (n + 1)
    
    for i in range(1, n + 1):
        start, end, weight = intervals[i-1]
        
        # Find last non-conflicting interval
        last = binary_search_last_compatible(intervals, i-1, start)
        
        # Take max: skip i-1, or take i-1 + dp[last]
        dp[i] = max(dp[i-1], weight + dp[last])
    
    return dp[n]
```

### Form 3: Minimum Rooms Required

Sweep line algorithm.

```python
def min_meeting_rooms(intervals):
    """Minimum meeting rooms needed."""
    if not intervals:
        return 0
    
    events = []
    for start, end in intervals:
        events.append((start, 1))   # Start: need room
        events.append((end, -1))      # End: free room
    
    # Sort: if same time, end before start
    events.sort(key=lambda x: (x[0], x[1]))
    
    max_rooms = current = 0
    for time, delta in events:
        current += delta
        max_rooms = max(max_rooms, current)
    
    return max_rooms
```

### Form 4: Longest Chain of Intervals

Similar to maximum non-overlapping but with strict inequality.

```python
def longest_chain(intervals):
    """
    Longest chain where each interval starts after previous ends.
    Similar to greedy but with strict > condition.
    """
    if not intervals:
        return 0
    
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    
    count = 1
    last_end = intervals[0][1]
    
    for start, end in intervals[1:]:
        if start > last_end:  # Strictly after
            count += 1
            last_end = end
    
    return count
```

### Form 5: Interval Removals

Minimum removals to make non-overlapping.

```python
def erase_overlap_intervals(intervals):
    """
    LeetCode 435: Minimum intervals to remove.
    Equivalent to n - max_non_overlapping.
    """
    if not intervals:
        return 0
    
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    
    count = 1
    last_end = intervals[0][1]
    
    for start, end in intervals[1:]:
        if start >= last_end:
            count += 1
            last_end = end
    
    return len(intervals) - count
```

---

## Tactics

Specific techniques for interval scheduling problems.

### Tactic 1: Earliest Finish Greedy

Standard implementation:

```python
def max_non_overlapping_intervals(intervals):
    """
    Select maximum non-overlapping intervals.
    Greedy: always pick interval with earliest end.
    """
    if not intervals:
        return 0, []
    
    # Sort by end time
    sorted_intervals = sorted(intervals, key=lambda x: x[1])
    
    selected = [sorted_intervals[0]]
    last_end = sorted_intervals[0][1]
    
    for interval in sorted_intervals[1:]:
        start, end = interval
        if start >= last_end:
            selected.append(interval)
            last_end = end
    
    return len(selected), selected
```

### Tactic 2: Binary Search for Compatibility

Find last compatible interval efficiently:

```python
import bisect

def binary_search_compatible(intervals, end_idx, target_start):
    """
    Find rightmost interval with end <= target_start.
    intervals is sorted by end time.
    """
    # Extract end times for binary search
    end_times = [interval[1] for interval in intervals[:end_idx]]
    
    # Find rightmost with end <= target_start
    idx = bisect.bisect_right(end_times, target_start) - 1
    
    return idx + 1 if idx >= 0 else 0  # +1 because dp is 1-indexed
```

### Tactic 3: Sweep Line with Priority Queue

For dynamic interval problems:

```python
import heapq

def min_rooms_sweep_pq(intervals):
    """Minimum rooms using priority queue (alternative to sweep line)."""
    if not intervals:
        return 0
    
    # Sort by start time
    intervals.sort()
    
    # Min heap of end times
    rooms = []
    
    for start, end in intervals:
        if rooms and rooms[0] <= start:
            # Reuse room
            heapq.heappop(rooms)
        heapq.heappush(rooms, end)
    
    return len(rooms)
```

### Tactic 4: DP with Path Reconstruction

Track which intervals are selected:

```python
def weighted_interval_scheduling_with_path(intervals):
    """Return both max weight and selected intervals."""
    n = len(intervals)
    if n == 0:
        return 0, []
    
    # Sort by end
    intervals.sort(key=lambda x: x[1])
    
    # dp[i] = (max_weight, prev_index, take_current)
    dp = [(0, -1, False)]  # dp[0] = no intervals
    
    for i in range(n):
        start, end, weight = intervals[i]
        
        # Find p[i]
        p_idx = binary_search_last_compatible(intervals, i, start)
        
        # Option 1: Don't take interval i
        dont_take = dp[i][0]
        
        # Option 2: Take interval i
        take = weight + dp[p_idx][0]
        
        if take > dont_take:
            dp.append((take, p_idx, True))
        else:
            dp.append((dont_take, i, False))
    
    # Backtrack to find selected intervals
    selected = []
    i = n
    while i > 0:
        if dp[i][2]:  # Took interval i-1
            selected.append(intervals[i-1])
            i = dp[i][1]
        else:
            i -= 1
    
    return dp[n][0], selected[::-1]
```

### Tactic 5: Sorting Strategy Comparison

Different sort orders for different problems:

| Problem | Sort By | Why |
|---------|---------|-----|
| **Max count** | End time | Greedy works |
| **Max weight** | End time | DP easier with this order |
| **Min rooms** | Start time (or events) | Sweep line |
| **Longest chain** | End time | Greedy similar to max count |
| **Min removals** | End time | Same as max count |

---

## Python Templates

### Template 1: Maximum Non-Overlapping Intervals

```python
def max_non_overlapping(intervals):
    """
    Maximum number of non-overlapping intervals.
    
    Greedy: Sort by end time, always pick earliest finishing.
    
    Time: O(n log n)
    Space: O(1) or O(n) for sort
    
    Returns (count, selected_intervals).
    """
    if not intervals:
        return 0, []
    
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    
    selected = [intervals[0]]
    last_end = intervals[0][1]
    
    for interval in intervals[1:]:
        start, end = interval[:2]
        if start >= last_end:
            selected.append(interval)
            last_end = end
    
    return len(selected), selected
```

### Template 2: Weighted Interval Scheduling

```python
def weighted_interval_scheduling(intervals):
    """
    Maximum weight subset of non-overlapping intervals.
    
    Time: O(n log n)
    Space: O(n)
    
    LeetCode 1235 style problem.
    """
    if not intervals:
        return 0
    
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    n = len(intervals)
    
    # Extract end times for binary search
    ends = [interval[1] for interval in intervals]
    
    # dp[i] = max weight using first i intervals
    dp = [0] * (n + 1)
    
    for i in range(1, n + 1):
        start, end, weight = intervals[i-1]
        
        # Find last non-conflicting interval
        import bisect
        j = bisect.bisect_right(ends, start, 0, i-1)
        
        # dp[i] = max(skip i-1, take i-1 + dp[j])
        dp[i] = max(dp[i-1], weight + dp[j])
    
    return dp[n]
```

### Template 3: Minimum Meeting Rooms

```python
def min_meeting_rooms(intervals):
    """
    Minimum number of meeting rooms required.
    
    Sweep line algorithm.
    
    Time: O(n log n)
    Space: O(n)
    
    LeetCode 253.
    """
    if not intervals:
        return 0
    
    events = []
    for start, end in intervals:
        events.append((start, 1))   # Start: +1 room
        events.append((end, -1))      # End: -1 room
    
    # Sort: by time, then process ends before starts
    events.sort(key=lambda x: (x[0], x[1]))
    
    max_rooms = current = 0
    for time, delta in events:
        current += delta
        max_rooms = max(max_rooms, current)
    
    return max_rooms
```

### Template 4: Longest Chain of Pairs

```python
def find_longest_chain(pairs):
    """
    Longest chain where pairs[i][0] > pairs[j][1].
    Similar to interval scheduling with strict inequality.
    
    Time: O(n log n)
    Space: O(1)
    
    LeetCode 646.
    """
    if not pairs:
        return 0
    
    # Sort by end time
    pairs.sort(key=lambda x: x[1])
    
    count = 1
    last_end = pairs[0][1]
    
    for i in range(1, len(pairs)):
        if pairs[i][0] > last_end:  # Strictly after
            count += 1
            last_end = pairs[i][1]
    
    return count
```

### Template 5: Erase Overlap Intervals

```python
def erase_overlap_intervals(intervals):
    """
    Minimum intervals to remove to make rest non-overlapping.
    
    Equivalent to: n - max_non_overlapping
    
    Time: O(n log n)
    Space: O(1)
    
    LeetCode 435.
    """
    if not intervals:
        return 0
    
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    
    count = 1  # Count of kept intervals
    last_end = intervals[0][1]
    
    for start, end in intervals[1:]:
        if start >= last_end:
            count += 1
            last_end = end
    
    return len(intervals) - count
```

### Template 6: Can Attend All Meetings

```python
def can_attend_all_meetings(intervals):
    """
    Check if person can attend all meetings (no overlaps).
    
    Time: O(n log n)
    Space: O(1)
    
    LeetCode 252.
    """
    if len(intervals) <= 1:
        return True
    
    # Sort by start time
    intervals.sort()
    
    for i in range(len(intervals) - 1):
        if intervals[i][1] > intervals[i+1][0]:  # Overlap
            return False
    
    return True
```

---

## When to Use

Use Interval Scheduling when:

- **Activity selection**: Choose maximum non-overlapping activities
- **Resource allocation**: Minimize rooms/resources needed
- **Weighted scheduling**: Optimize total value, not just count
- **Chain building**: Find longest chain of intervals
- **Conflict resolution**: Minimize removals for compatibility

### Comparison with Alternatives

| Problem | Greedy | DP | Sweep Line |
|---------|--------|-----|------------|
| **Max count** | O(n log n) ✓ | O(n log n) | - |
| **Max weight** | Not optimal | O(n log n) ✓ | - |
| **Min rooms** | Not applicable | - | O(n log n) ✓ |
| **Longest chain** | O(n log n) ✓ | O(n²) | - |

---

## Algorithm Explanation

### Core Concept

The greedy algorithm for interval scheduling works because selecting the interval that finishes earliest leaves the maximum remaining time for other intervals. This local optimal choice leads to a global optimal solution.

**Key Terminology**:
- **Greedy choice**: Select earliest finishing interval
- **Compatible**: Two intervals don't overlap
- **Optimal substructure**: Problem can be broken into subproblems
- **Exchange argument**: Proof technique showing greedy is optimal

### How It Works

#### Step 1: Sort by End Time

```python
intervals.sort(key=lambda x: x[1])
```

#### Step 2: Greedy Selection

```python
selected = [intervals[0]]
last_end = intervals[0][1]

for interval in intervals[1:]:
    if interval[0] >= last_end:  # Compatible
        selected.append(interval)
        last_end = interval[1]
```

#### Step 3: Proof Sketch (Exchange Argument)

```
Let G = greedy solution
Let O = any optimal solution

We can transform O to match G without decreasing size:
- At first point where G and O differ
- G picks interval finishing earliest
- Replace O's choice with G's choice
- Still valid (G's choice finishes earlier)
- Repeat until O = G
```

### Visual Walkthrough

**Example: Select Maximum Non-Overlapping**:
```
Intervals: [1,3], [2,4], [3,5], [1,6], [4,7], [5,8]

Step 1: Sort by end time
[1,3], [2,4], [3,5], [1,6], [4,7], [5,8]
  ↓

Step 2: Greedy selection
Pick [1,3] (earliest end)
  last_end = 3

Next: [2,4] - start 2 < 3, skip
Next: [3,5] - start 3 >= 3, pick!
  last_end = 5

Next: [1,6] - start 1 < 5, skip
Next: [4,7] - start 4 < 5, skip
Next: [5,8] - start 5 >= 5, pick!
  last_end = 8

Selected: [1,3], [3,5], [5,8]
Count: 3
```

### Why Greedy Works

1. **Earliest finish maximizes room**: Leaves most time remaining
2. **Compatible intervals**: No overlap with selected
3. **Exchange argument**: Can transform any optimal to greedy
4. **Optimal count**: Cannot do better than greedy

### Limitations

- **Not for weighted**: Greedy fails with different weights
- **Not for complex constraints**: Some variants need DP
- **Requires sorting**: O(n log n) lower bound

---

## Practice Problems

### Problem 1: Non-overlapping Intervals

**Problem:** [LeetCode 435 - Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)

**Description:** Find minimum intervals to remove.

**How to Apply:**
- Greedy by end time
- Answer = n - max_non_overlapping

---

### Problem 2: Meeting Rooms II

**Problem:** [LeetCode 253 - Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/)

**Description:** Minimum meeting rooms needed.

**How to Apply:**
- Sweep line with events
- Or priority queue approach

---

### Problem 3: Maximum Length of Pair Chain

**Problem:** [LeetCode 646 - Maximum Length of Pair Chain](https://leetcode.com/problems/maximum-length-of-pair-chain/)

**Description:** Longest chain where pairs[i][0] > pairs[j][1].

**How to Apply:**
- Greedy by end time
- Strict inequality in comparison

---

### Problem 4: Course Schedule III

**Problem:** [LeetCode 630 - Course Schedule III](https://leetcode.com/problems/course-schedule-iii/)

**Description**: Max courses with [duration, lastDay] constraints.

**How to Apply:**
- Greedy with priority queue
- Swap longer courses when needed

---

### Problem 5: Maximum Profit in Job Scheduling

**Problem:** [LeetCode 1235 - Maximum Profit in Job Scheduling](https://leetcode.com/problems/maximum-profit-in-job-scheduling/)

**Description:** Weighted interval scheduling.

**How to Apply:**
- DP with binary search
- Sort by end time

---

## Video Tutorial Links

### Fundamentals

- [Interval Scheduling - Greedy Algorithms](https://www.youtube.com/watch?v=hVhOeaONg1Y) - MIT OCW
- [Activity Selection Problem](https://www.youtube.com/watch?v=hVhOeaONg1Y) - Explanation
- [Greedy Proof Techniques](https://www.youtube.com/watch?v=hVhOeaONg1Y) - Exchange argument

### Problem Solving

- [LeetCode 435 Solution](https://www.youtube.com/watch?v=hVhOeaONg1Y) - Non-overlapping
- [Meeting Rooms II](https://www.youtube.com/watch?v=hVhOeaONg1Y) - Sweep line
- [Weighted Scheduling](https://www.youtube.com/watch?v=hVhOeaONg1Y) - DP approach

---

## Follow-up Questions

### Q1: Why does greedy by start time fail?

**Answer:**
- **Counterexample**: [(1, 10), (2, 3), (3, 4), (4, 5)]
- **By start**: Picks [1,10], then nothing else fits → count 1
- **By end**: Picks [2,3], [3,4], [4,5] → count 3
- **Early start ≠ optimal**: Long interval blocks many short ones

---

### Q2: What's the difference between weighted and unweighted?

**Answer:**
- **Unweighted**: Greedy by end time works, O(n log n)
- **Weighted**: Greedy fails, need DP O(n log n)
- **Example**: [(1,10,100), (1,2,10), (2,3,10)...] - greedy picks 100, optimal picks sum of many small
- **When greedy fails**: Different values per interval

---

### Q3: How does sweep line work for minimum rooms?

**Answer:**
- **Events**: Start (+1 room), End (-1 room)
- **Process in order**: Track current rooms needed
- **Maximum**: Peak concurrent intervals
- **Why correct**: At any point, count = active intervals

---

### Q4: Can we solve interval scheduling in O(n) time?

**Answer:**
- **Lower bound**: Ω(n log n) due to sorting
- **If pre-sorted**: O(n) selection possible
- **Special cases**: If intervals given in order
- **General case**: Sorting required, so O(n log n)

---

### Q5: What's the relationship between interval scheduling and graph coloring?

**Answer:**
- **Interval graph**: Vertices = intervals, edges = overlaps
- **Min rooms = chromatic number**: Color classes = rooms
- **Interval graphs**: Perfect, so ω = χ
- **Clique size**: Maximum overlapping intervals

---

## Summary

Interval Scheduling Maximization is a fundamental greedy algorithm. Key takeaways:

1. **Greedy choice**: Earliest finishing interval
2. **Unweighted**: O(n log n) greedy works optimally
3. **Weighted**: O(n log n) DP required
4. **Min rooms**: Sweep line or priority queue
5. **Proof**: Exchange argument shows optimality

**When to Use**:
- Non-overlapping selection
- Resource allocation
- Activity scheduling
- Conflict minimization

**Implementation Tips**:
- Always sort by end time for greedy
- Binary search for weighted DP
- Sweep line for concurrent counting
- Consider strict vs non-strict inequalities

This pattern appears frequently in scheduling and resource allocation problems.
