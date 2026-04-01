# Interval Scheduling

## Category
Greedy

## Description

The Interval Scheduling problem (also known as the Activity Selection Problem) is a classic greedy algorithm that finds the maximum number of mutually compatible activities (non-overlapping intervals). Given a set of intervals with start and end times, the goal is to select the largest possible subset where no two intervals overlap.

This algorithm exemplifies the power of the greedy choice property - making locally optimal choices at each step leads to a globally optimal solution. The key insight is that selecting the interval that finishes earliest leaves the maximum room for future selections, ensuring we can fit as many intervals as possible.

---

## Concepts

The Interval Scheduling technique is built on several fundamental concepts that make it powerful for resource allocation problems.

### 1. Greedy Choice Property

The fundamental principle that makes this algorithm work:

| Property | Description |
|----------|-------------|
| **Local Optimal** | At each step, select the interval that finishes earliest |
| **Global Optimal** | This leads to the maximum number of intervals overall |
| **No Regret** | Selecting earliest finisher never blocks a better solution |

### 2. Optimal Substructure

After making a greedy choice, the remaining problem has the same structure:

```
Problem: Select max intervals from [start, end] times
Step 1: Select earliest finishing interval (ends at t)
Step 2: Recursively solve for intervals starting at or after t
```

### 3. Compatibility

Two intervals are compatible (non-overlapping) if:

| Condition | Formula | Example |
|-----------|---------|---------|
| **Non-overlapping** | `interval1.end <= interval2.start` | [1,3] and [3,5] are compatible |
| **Overlapping** | `interval1.end > interval2.start` | [1,4] and [2,5] overlap |
| **Touching** | `interval1.end == interval2.start` | [1,3] and [3,5] touch (usually OK) |

### 4. Problem Variations

| Variation | Objective | Approach |
|-----------|-----------|----------|
| **Maximum Intervals** | Select max non-overlapping | Greedy (earliest finish) |
| **Minimum Removals** | Remove minimum to make non-overlapping | Greedy (same as above) |
| **Weighted Scheduling** | Maximize total weight | DP + Binary Search |
| **Interval Partitioning** | Minimize resources needed | Greedy (earliest start) |

---

## Frameworks

Structured approaches for solving interval scheduling problems.

### Framework 1: Maximum Non-Overlapping Intervals

```
┌─────────────────────────────────────────────────────┐
│  MAXIMUM NON-OVERLAPPING INTERVALS FRAMEWORK        │
├─────────────────────────────────────────────────────┤
│  1. Sort intervals by end time (ascending)           │
│  2. Select first interval (earliest finish)          │
│  3. Set last_end = selected.end                     │
│  4. For each remaining interval:                     │
│     a. If interval.start >= last_end:                │
│        - Select this interval                       │
│        - Update last_end = interval.end              │
│     b. Else:                                         │
│        - Skip (it overlaps)                           │
│  5. Return count or list of selected intervals       │
└─────────────────────────────────────────────────────┘
```

**When to use**: Maximizing throughput on a single resource.

### Framework 2: Weighted Interval Scheduling

```
┌─────────────────────────────────────────────────────┐
│  WEIGHTED INTERVAL SCHEDULING (DP) FRAMEWORK        │
├─────────────────────────────────────────────────────┤
│  1. Sort intervals by end time                       │
│  2. For each interval i, find p[i]:                  │
│     - Last interval that doesn't overlap with i      │
│     - Use binary search for O(log n)                 │
│  3. Initialize dp[0] = weight[0]                     │
│  4. For each i from 1 to n-1:                        │
│     a. Include: weight[i] + dp[p[i]] (if p[i] >= 0) │
│     b. Exclude: dp[i-1]                               │
│     c. dp[i] = max(include, exclude)                 │
│  5. Return dp[n-1]                                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: When intervals have different values/profits.

### Framework 3: Meeting Rooms II (Interval Partitioning)

```
┌─────────────────────────────────────────────────────┐
│  MEETING ROOMS II FRAMEWORK                         │
├─────────────────────────────────────────────────────┤
│  1. Separate all start and end times                 │
│  2. Sort both arrays                                 │
│  3. Use two pointers (i for starts, j for ends)    │
│  4. Initialize rooms = 0, max_rooms = 0               │
│  5. While i < n:                                     │
│     a. If starts[i] < ends[j]:                     │
│        - Need new room: rooms++                     │
│        - max_rooms = max(max_rooms, rooms)          │
│        - i++                                          │
│     b. Else:                                         │
│        - Free a room: rooms--                        │
│        - j++                                          │
│  6. Return max_rooms                                 │
└─────────────────────────────────────────────────────┘
```

**When to use**: Finding minimum resources needed.

---

## Forms

Different manifestations of the interval scheduling pattern.

### Form 1: Maximum Interval Selection

Select maximum number of non-overlapping intervals (classic greedy).

| Input | Sorted by End | Selected | Count |
|-------|---------------|----------|-------|
| [[1,4], [2,3], [3,5]] | [[2,3], [1,4], [3,5]] | [[2,3], [3,5]] | 2 |
| [[1,2], [2,3], [3,4]] | [[1,2], [2,3], [3,4]] | All | 3 |
| [[1,5], [2,3], [4,6]] | [[2,3], [1,5], [4,6]] | [[2,3], [4,6]] | 2 |

### Form 2: Minimum Removals

Convert minimum removals problem to maximum selection.

```
Problem: Minimum intervals to remove to make non-overlapping
Solution: Remove = Total - Maximum_Non_Overlapping

Example: 5 intervals, can select 3 non-overlapping
         Answer = 5 - 3 = 2 intervals to remove
```

### Form 3: Balloon Bursting (Arrows)

Minimum arrows to burst all balloons (intervals on a line).

| Balloon | Interval | Arrow Position |
|---------|----------|----------------|
| 1 | [1,6] | Shoot at 6, burst overlapping |
| 2 | [2,8] | Next non-overlapping balloon |
| 3 | [10,16] | Shoot at 16 |

### Form 4: Maximum Length Pair Chain

Similar to activity selection with pairs instead of intervals.

```
pairs[i] = [left, right], pair p2 follows p1 if b < c
Same algorithm: sort by right, greedily select
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Sorting Tie-Breaker

```python
def interval_scheduling_with_tiebreaker(intervals):
    """
    When multiple intervals have same end time,
    prefer the one with earlier start time.
    """
    # Sort by end time, then by start time
    intervals.sort(key=lambda x: (x[1], x[0]))
    
    selected = []
    last_end = float('-inf')
    
    for start, end in intervals:
        if start >= last_end:
            selected.append((start, end))
            last_end = end
    
    return selected
```

### Tactic 2: Binary Search for Weighted Version

```python
import bisect

def find_last_non_overlapping(intervals, i):
    """
    Find the rightmost interval that ends <= intervals[i].start.
    Returns -1 if no such interval exists.
    """
    # intervals must be sorted by end time
    start_i = intervals[i][0]
    
    # Binary search for the largest end <= start_i
    lo, hi = 0, i - 1
    result = -1
    
    while lo <= hi:
        mid = (lo + hi) // 2
        if intervals[mid][1] <= start_i:
            result = mid
            lo = mid + 1
        else:
            hi = mid - 1
    
    return result
```

### Tactic 3: Two-Pointer for Meeting Rooms

```python
def min_meeting_rooms_two_pointer(intervals):
    """
    Alternative two-pointer approach for meeting rooms.
    """
    if not intervals:
        return 0
    
    # Separate and sort
    starts = sorted([i[0] for i in intervals])
    ends = sorted([i[1] for i in intervals])
    
    rooms = 0
    end_ptr = 0
    
    for i in range(len(intervals)):
        if starts[i] < ends[end_ptr]:
            # Meeting starts before one ends, need new room
            rooms += 1
        else:
            # Meeting ends, free up a room
            end_ptr += 1
    
    return rooms
```

### Tactic 4: Greedy Exchange Proof

```python
def prove_greedy_optimal(intervals):
    """
    Understanding why greedy works:
    
    Exchange Argument:
    1. Let G = greedy solution, O = optimal solution
    2. Both solutions have same size (or G is larger)
    3. If they differ at position k, replace O's interval
       with G's interval (which ends no later)
    4. This doesn't reduce the number of remaining slots
    5. Therefore G is also optimal
    """
    # This is a conceptual proof, not executable code
    pass
```

### Tactic 5: Counting at Most K

```python
def count_non_overlapping_at_most_k(intervals, k):
    """
    Count intervals with at most k overlaps at any point.
    Uses sweep line technique.
    """
    events = []
    for start, end in intervals:
        events.append((start, 1))   # +1 overlap at start
        events.append((end, -1))      # -1 overlap at end
    
    # Sort: ends before starts if same time
    events.sort(key=lambda x: (x[0], x[1]))
    
    current_overlap = 0
    valid_intervals = 0
    
    for time, delta in events:
        current_overlap += delta
        if current_overlap <= k:
            valid_intervals += 1
    
    return valid_intervals
```

---

## Python Templates

### Template 1: Maximum Non-Overlapping Intervals (Count)

```python
def interval_scheduling_max(intervals: list[tuple[int, int]]) -> int:
    """
    Find maximum number of non-overlapping intervals.
    Uses greedy algorithm - pick earliest finishing interval.
    
    Args:
        intervals: List of tuples (start, end) where start < end
    
    Returns:
        Maximum number of non-overlapping intervals
    
    Time: O(n log n) - dominated by sorting
    Space: O(1) - only using a few variables
    """
    if not intervals:
        return 0
    
    # Sort by end time (greedy choice: earliest finishing first)
    intervals.sort(key=lambda x: x[1])
    
    count = 1  # Select first interval (earliest end)
    last_end = intervals[0][1]
    
    # Iterate through remaining intervals
    for start, end in intervals[1:]:
        # Select if it starts after or at the end of last selected
        if start >= last_end:
            count += 1
            last_end = end
    
    return count
```

### Template 2: Return Selected Intervals

```python
def interval_scheduling_select(intervals: list[tuple[int, int]]) -> list[tuple[int, int]]:
    """
    Return the actual selected intervals (not just count).
    
    Time: O(n log n)
    Space: O(n) - storing selected intervals
    """
    if not intervals:
        return []
    
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    
    selected = [intervals[0]]
    last_end = intervals[0][1]
    
    for start, end in intervals[1:]:
        if start >= last_end:
            selected.append((start, end))
            last_end = end
    
    return selected
```

### Template 3: Minimum Intervals to Remove

```python
def min_intervals_to_remove(intervals: list[tuple[int, int]]) -> int:
    """
    Find minimum number of intervals to remove to make non-overlapping.
    This is equivalent to: total - max_non_overlapping
    
    Problem: LeetCode 435 - Non-overlapping Intervals
    
    Time: O(n log n)
    Space: O(1)
    """
    if not intervals:
        return 0
    
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    
    count = 1  # Count of kept intervals
    last_end = intervals[0][1]
    
    for start, end in intervals[1:]:
        if start >= last_end:
            # Non-overlapping - keep it
            count += 1
            last_end = end
        # else: overlapping - this interval will be removed
    
    # Minimum to remove = total - kept
    return len(intervals) - count
```

### Template 4: Weighted Interval Scheduling (Dynamic Programming)

```python
def weighted_interval_scheduling(intervals: list[tuple[int, int, int]]) -> int:
    """
    Weighted interval scheduling using dynamic programming.
    Each interval is (start, end, weight).
    Returns maximum total weight of compatible intervals.
    
    Time: O(n log n) with binary search
    Space: O(n)
    """
    if not intervals:
        return 0
    
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    n = len(intervals)
    
    # dp[i] = max weight using intervals[0..i]
    dp = [0] * n
    dp[0] = intervals[0][2]  # Weight of first interval
    
    for i in range(1, n):
        start, end, weight = intervals[i]
        
        # Find the last interval that doesn't overlap with current
        # Binary search for largest j where intervals[j][1] <= start
        lo, hi = 0, i - 1
        best_j = -1
        while lo <= hi:
            mid = (lo + hi) // 2
            if intervals[mid][1] <= start:
                best_j = mid
                lo = mid + 1
            else:
                hi = mid - 1
        
        # Option 1: Include current interval
        include = weight
        if best_j != -1:
            include += dp[best_j]
        
        # Option 2: Exclude current interval
        exclude = dp[i - 1]
        
        dp[i] = max(include, exclude)
    
    return dp[-1]
```

### Template 5: Meeting Rooms II

```python
import heapq

def min_meeting_rooms(intervals: list[list[int]]) -> int:
    """
    Find minimum number of meeting rooms required.
    Uses min-heap to track end times of ongoing meetings.
    
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

---

## When to Use

Use the Interval Scheduling algorithm when you need to solve problems involving:

- **Resource allocation**: Assigning limited resources to maximum activities
- **Meeting room scheduling**: Selecting maximum non-conflicting meetings
- **Course scheduling**: Choosing maximum non-conflicting classes
- **Job scheduling on single machine**: Maximizing throughput on one processor
- **TV/program broadcasting**: Selecting maximum non-overlapping shows

### Comparison: Greedy vs Dynamic Programming

| Aspect | Greedy Interval Scheduling | Weighted Interval Scheduling (DP) |
|--------|---------------------------|-----------------------------------|
| **Objective** | Maximize number of intervals | Maximize total weight/profit |
| **Time Complexity** | O(n log n) | O(n log n) or O(n²) |
| **Space Complexity** | O(1) or O(n) | O(n) |
| **Optimality** | Optimal for unweighted | Optimal for weighted |
| **Implementation** | Simple, elegant | More complex |
| **Use When** | All intervals have equal value | Intervals have different values |

### When to Choose Which Approach

**Choose Greedy Approach when:**
- All intervals have equal importance/value
- You only need to maximize the count of selected intervals
- Simple, fast solution is preferred
- Problem constraints are standard

**Choose Dynamic Programming when:**
- Intervals have different weights/profits
- You need to maximize total value, not count
- The greedy choice property doesn't apply
- Example: Some meetings pay more than others

---

## Algorithm Explanation

### Core Concept

The fundamental insight of interval scheduling is the **Earliest Finish Time** greedy strategy:

> **Greedy Choice:** Always select the interval with the earliest finish time that doesn't conflict with previously selected intervals.

### How It Works

#### The Algorithm Steps
1. **Sort Intervals**: Sort all intervals by their end time in ascending order
2. **Initialize**: Select the first interval (earliest end), set `last_end = end_time`
3. **Iterate**: For each remaining interval:
   - If `start_time >= last_end`: Select this interval, update `last_end`
   - Else: Skip this interval (it overlaps)
4. **Return**: Count or list of selected intervals

#### Visual Representation

Consider intervals: `[(1, 4), (2, 3), (3, 5), (5, 7), (6, 8), (8, 10)]`

```
Intervals sorted by end time:
┌─────────────────────────────────────────────────────────┐
│ Interval │ Start │ End  │ Visual Timeline              │
├─────────────────────────────────────────────────────────┤
│    B     │   2   │  3   │  ···██······················ │ ← SELECTED (earliest end)
│    A     │   1   │  4   │  ██████····················· │   (overlaps with B, skip)
│    C     │   3   │  5   │  ···██████·················· │ ← SELECTED (starts at 3 >= 3)
│    D     │   5   │  7   │  ·······██████·············· │ ← SELECTED (starts at 5 >= 5)
│    E     │   6   │  8   │  ··········██████··········· │   (overlaps with D, skip)
│    F     │   8   │  10  │  ···············████████···· │ ← SELECTED (starts at 8 >= 7)
└─────────────────────────────────────────────────────────┘

Result: 4 intervals selected (B, C, D, F)
```

### Why This Works

**Proof Sketch (Greedy Exchange Argument):**

1. Let `G` be the greedy solution (earliest finish time strategy)
2. Let `O` be any optimal solution
3. Both select the same number of intervals (or `G` selects more)
4. We can transform `O` into `G` without decreasing its size:
   - At each step where `O` and `G` differ, replace `O`'s choice with `G`'s choice
   - Since `G` always picks the earliest finishing interval, `G`'s choice ends no later than `O`'s choice
   - This leaves at least as much room for remaining intervals

### Key Properties

1. **Greedy Choice Property**: A globally optimal solution can be achieved by making locally optimal choices
2. **Optimal Substructure**: After selecting an interval, the problem reduces to the same problem on remaining compatible intervals
3. **No Lookahead Needed**: The greedy choice doesn't depend on future choices

---

## Practice Problems

### Problem 1: Non-overlapping Intervals

**Problem:** [LeetCode 435 - Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)

**Description:** Given an array of intervals where `intervals[i] = [starti, endi]`, return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.

**How to Apply:**
- This is the inverse of interval scheduling
- Find maximum non-overlapping intervals using greedy
- Answer = total intervals - max non-overlapping
- Sort by end time, count compatible intervals

**Key Insight:** `answer = n - interval_scheduling_max(intervals)`

---

### Problem 2: Meeting Rooms II

**Problem:** [LeetCode 253 - Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/)

**Description:** Given an array of meeting time intervals consisting of start and end times, find the minimum number of conference rooms required.

**How to Apply:**
- This is the interval partitioning problem
- Sort start times and end times separately
- Use two pointers: when a meeting starts before one ends, need a new room
- Answer is the maximum number of concurrent meetings

**Alternative Approach:** Min-heap to track end times of ongoing meetings

---

### Problem 3: Minimum Number of Arrows to Burst Balloons

**Problem:** [LeetCode 452 - Minimum Number of Arrows to Burst Balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/)

**Description:** There are some spherical balloons taped onto a flat wall. An arrow shot vertically can burst a balloon if the arrow's position is within the balloon's horizontal diameter. Find the minimum number of arrows that must be shot to burst all balloons.

**How to Apply:**
- Each balloon is an interval [xstart, xend]
- Sort by end coordinate (greedy)
- Shoot arrow at first balloon's end, burst all overlapping
- Move to next non-overlapping balloon
- Same algorithm as interval scheduling!

---

### Problem 4: Maximum Length of Pair Chain

**Problem:** [LeetCode 646 - Maximum Length of Pair Chain](https://leetcode.com/problems/maximum-length-of-pair-chain/)

**Description:** You are given an array of n pairs where `pairs[i] = [lefti, righti]` and `lefti < righti`. A pair `p2 = [c, d]` follows a pair `p1 = [a, b]` if `b < c`. A chain of pairs can be formed in this fashion. Return the length of the longest chain which can be formed.

**How to Apply:**
- This is exactly the interval scheduling problem
- Sort by second element (righti)
- Greedily select pairs that can follow the previous one
- Classic greedy: O(n log n) time, O(1) space

---

### Problem 5: Data Stream as Disjoint Intervals

**Problem:** [LeetCode 352 - Data Stream as Disjoint Intervals](https://leetcode.com/problems/data-stream-as-disjoint-intervals/)

**Description:** Given a data stream input of non-negative integers, summarize the numbers seen so far as a list of disjoint intervals.

**How to Apply:**
- Use TreeMap (Java) or SortedDict (Python) to maintain intervals
- When adding a number, merge with adjacent intervals if they touch
- Keep intervals sorted by start time for O(log n) insertion

**Time Complexity:** O(log n) per addNum, O(n) per getIntervals

---

## Video Tutorial Links

### Fundamentals

- **[Interval Scheduling - Greedy Algorithm (WilliamFiset)](https://www.youtube.com/watch?v=hVhOeaONg1Y)** - Comprehensive explanation with visualizations
- **[Activity Selection Problem (Abdul Bari)](https://www.youtube.com/watch?v=poWB2UCuozA)** - Step-by-step greedy algorithm explanation
- **[Greedy Algorithm - Interval Scheduling (MIT OpenCourseWare)](https://www.youtube.com/watch?v=HoCGU-wA1w4)** - Academic perspective with proofs
- **[LeetCode 435 - Non-overlapping Intervals (NeetCode)](https://www.youtube.com/watch?v=nONCGxWoUfM)** - Practical interview problem solving

### Advanced Topics

- **[Weighted Interval Scheduling (WilliamFiset)](https://www.youtube.com/watch?v=cr6Ip0J9izc)** - Dynamic programming approach
- **[Interval Partitioning - Meeting Rooms II](https://www.youtube.com/watch?v=NKf1OJkEZ2o)** - Greedy for resource allocation
- **[Interval Problems Pattern (NeetCode)](https://www.youtube.com/watch?v=44H3cEC2fFM)** - Common interval problem patterns

---

## Follow-up Questions

### Q1: Why does sorting by end time work, but sorting by start time doesn't?

**Answer:** 
- **End time sorting**: Selecting the interval that ends earliest leaves maximum room for future intervals. This is provably optimal.
- **Start time sorting**: Selecting by earliest start might pick a very long interval that blocks many shorter ones.

**Counter-example for start-time sorting:**
```
Intervals: [(1, 100), (2, 3), (3, 4), (4, 5)]
By start time: Select (1,100) → blocks all others → result: 1
By end time: Select (2,3), (3,4), (4,5) → result: 3 ✓
```

---

### Q2: Can we use dynamic programming for the unweighted interval scheduling problem?

**Answer:** Yes, but it's overkill:
- **DP solution**: O(n²) or O(n log n) with binary search
- **Greedy solution**: O(n log n) with simpler code

DP is necessary only for **weighted** interval scheduling where greedy fails.

---

### Q3: How do we handle intervals that can touch (start == end of previous)?

**Answer:** The condition `start >= last_end` naturally handles this:
- If `start == last_end`, intervals touch but don't overlap
- This is typically allowed in interval scheduling
- If strict non-overlapping required (start > last_end), change the condition

---

### Q4: What if intervals are given in a streaming fashion (online)?

**Answer:** 
- **Greedy doesn't work online** - you need to see all intervals to sort
- **Online approaches**: 
  - If intervals arrive sorted by end time: greedy works in O(n)
  - Otherwise: need more complex data structures or approximation algorithms
  - Consider using a segment tree or interval tree for dynamic insertion

---

### Q5: How does interval scheduling relate to other greedy problems?

**Answer:** Many greedy problems use similar strategies:

| Problem | Greedy Strategy |
|---------|----------------|
| Interval Scheduling | Earliest finish time |
| Fractional Knapsack | Highest value/weight ratio |
| Huffman Coding | Lowest frequency first |
| Dijkstra's Algorithm | Shortest distance first |
| Prim's/Kruskal's | Minimum edge weight |

All rely on the **greedy choice property**: local optimal choices lead to global optimum.

---

## Summary

The Interval Scheduling algorithm is a fundamental greedy technique for maximizing the number of non-overlapping activities. Key takeaways:

### Core Strategy
- **Sort by end time**: O(n log n)
- **Greedy selection**: Always pick the interval that ends earliest
- **Proof**: Greedy exchange argument shows this is optimal

### Time & Space Complexity
| Metric | Complexity |
|--------|------------|
| Time | O(n log n) |
| Space | O(1) or O(n) |

### When to Use
- ✅ Maximizing throughput on a single resource
- ✅ All intervals have equal value
- ✅ Need simple, fast solution
- ❌ Intervals have different weights (use DP instead)
- ❌ Need to minimize resources (use interval partitioning)

### Common Variations
1. **Weighted Interval Scheduling** → Use DP (O(n log n))
2. **Interval Partitioning** → Min resources needed (Meeting Rooms II)
3. **Interval Merging** → Combine overlapping intervals
4. **Minimum Removals** → Inverse of max scheduling (LeetCode 435)

### Related Problems
- [435. Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)
- [253. Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/)
- [452. Minimum Number of Arrows](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/)
- [646. Maximum Length of Pair Chain](https://leetcode.com/problems/maximum-length-of-pair-chain/)
