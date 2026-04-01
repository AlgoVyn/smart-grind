# Activity Selection

## Category
Greedy

## Description

The Activity Selection problem is a classic greedy algorithm problem where we need to select the maximum number of non-overlapping activities from a given set. Each activity has a start time and an end time, and two activities are considered non-overlapping if one finishes before (or exactly when) the other starts.

This problem demonstrates the power of greedy algorithms where making locally optimal choices (selecting the earliest finishing activity) leads to a globally optimal solution. The key insight is that by always selecting the activity that finishes earliest, we maximize the remaining time available for other activities, ensuring we can fit as many as possible.

---

## Concepts

The Activity Selection technique is built on several fundamental concepts that make it powerful for resource allocation and scheduling problems.

### 1. Greedy Choice Property

The fundamental principle that makes this algorithm work:

| Property | Description | Implication |
|----------|-------------|-------------|
| **Local Optimal** | Select earliest finishing compatible activity | Leaves maximum room for others |
| **Global Optimal** | Sequence of local choices yields max activities | No need to explore alternatives |
| **No Backtracking** | Once selected, never reconsider | Simple, efficient implementation |

### 2. Activity Representation

An activity is represented as a pair `(start, end)` where:

| Attribute | Description | Constraint |
|-----------|-------------|------------|
| **Start** | Beginning time | Non-negative integer |
| **End** | Finishing time | `end > start` |
| **Duration** | `end - start` | Can vary across activities |

### 3. Compatibility Check

Two activities are compatible (can both be selected) if:

```python
def are_compatible(activity1, activity2):
    """
    Check if two activities don't overlap.
    """
    start1, end1 = activity1
    start2, end2 = activity2
    
    # Activities don't overlap if one ends before other starts
    return end1 <= start2 or end2 <= start1
```

### 4. Sorting Strategy

| Sort By | Purpose | Result |
|---------|---------|--------|
| **End Time** | Greedy selection (earliest finish) | Optimal for max count |
| **Start Time** | Alternative approach | May not yield optimal |
| **Duration** | Shortest activity first | Not optimal for this problem |

---

## Frameworks

Structured approaches for solving activity selection problems.

### Framework 1: Standard Greedy Activity Selection

```
┌─────────────────────────────────────────────────────┐
│  ACTIVITY SELECTION FRAMEWORK                       │
├─────────────────────────────────────────────────────┤
│  1. Handle edge case: empty input                    │
│  2. Create list: (end, start, original_index)        │
│  3. Sort by end time (ascending)                     │
│  4. Select first activity (earliest end)            │
│  5. Initialize: last_end = selected.end             │
│  6. For each remaining activity:                    │
│     a. If activity.start >= last_end:              │
│        - Select activity (store index)              │
│        - Update last_end = activity.end             │
│     b. Else:                                         │
│        - Skip (overlaps with last selected)         │
│  7. Return list of selected indices                  │
└─────────────────────────────────────────────────────┘
```

**When to use**: Classic activity selection with maximum count objective.

### Framework 2: Weighted Activity Selection (DP)

```
┌─────────────────────────────────────────────────────┐
│  WEIGHTED ACTIVITY SELECTION FRAMEWORK              │
├─────────────────────────────────────────────────────┤
│  1. Sort activities by end time                    │
│  2. Precompute: for each activity i, find p[i]     │
│     - p[i] = largest index j where activity j       │
│       doesn't overlap with activity i                │
│     - Use binary search: O(log n) per query        │
│  3. Initialize dp[0] = weight[0]                   │
│  4. For each i from 1 to n-1:                        │
│     a. option1 = weight[i]                          │
│     b. if p[i] != -1: option1 += dp[p[i]]           │
│     c. option2 = dp[i-1] (don't select i)            │
│     d. dp[i] = max(option1, option2)                │
│  5. Return dp[n-1]                                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: When activities have different values/profits.

### Framework 3: Minimum Activities to Remove

```
┌─────────────────────────────────────────────────────┐
│  MINIMUM ACTIVITIES TO REMOVE FRAMEWORK             │
├─────────────────────────────────────────────────────┤
│  1. Apply standard activity selection                │
│  2. Count selected activities: selected_count       │
│  3. Answer = total_activities - selected_count      │
│                                                     │
│  Key Insight: This is equivalent to finding           │
│  the maximum set of non-overlapping activities      │
│  and removing the rest                               │
└─────────────────────────────────────────────────────┘
```

**When to use**: LeetCode 435 - Non-overlapping Intervals variation.

---

## Forms

Different manifestations of the activity selection pattern.

### Form 1: Maximum Activities (Classic)

Select the maximum number of non-overlapping activities.

| Input Activities | Sorted by End | Selected | Count |
|----------------|---------------|----------|-------|
| [(1,4), (3,5), (0,6)] | [(1,4), (3,5), (0,6)] | [(1,4)] | 1 |
| [(1,3), (3,5), (5,7)] | [(1,3), (3,5), (5,7)] | All | 3 |
| [(1,10), (2,3), (3,4)] | [(2,3), (3,4), (1,10)] | [(2,3), (3,4)] | 2 |

### Form 2: Minimum Platforms (Meeting Rooms II)

Find minimum resources needed for all activities.

```
Problem: All activities must occur
Solution: Track maximum concurrent activities
Approach: Sweep line or min-heap
```

### Form 3: Balloon Bursting

Minimum arrows to burst all balloons (intervals on a line).

| Balloon | Interval | Greedy Strategy |
|---------|----------|-----------------|
| 1 | [1,6] | Sort by end, shoot at 6 |
| 2 | [2,8] | Burst with same arrow if overlapping |
| 3 | [10,16] | Shoot new arrow at 16 |

### Form 4: Pair Chain

Maximum length chain where each pair follows the previous.

```
pairs[i] = [left, right], pair p2 follows p1 if p1[1] < p2[0]
Same as activity selection: sort by right, greedily select
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Return Indices vs Intervals

```python
def activity_selection_indices(activities):
    """
    Return original indices of selected activities.
    Useful when you need to reference original data.
    """
    if not activities:
        return []
    
    # Store (end, start, original_index)
    indexed = [(end, start, i) for i, (start, end) in enumerate(activities)]
    indexed.sort()  # Sorts by end time
    
    selected_indices = [indexed[0][2]]
    last_end = indexed[0][0]
    
    for end, start, idx in indexed[1:]:
        if start >= last_end:
            selected_indices.append(idx)
            last_end = end
    
    return selected_indices


def activity_selection_intervals(activities):
    """
    Return the actual selected intervals.
    """
    if not activities:
        return []
    
    # Sort by end time
    sorted_acts = sorted(activities, key=lambda x: x[1])
    
    selected = [sorted_acts[0]]
    last_end = sorted_acts[0][1]
    
    for start, end in sorted_acts[1:]:
        if start >= last_end:
            selected.append((start, end))
            last_end = end
    
    return selected
```

### Tactic 2: Handling Same End Times

```python
def activity_selection_with_ties(activities):
    """
    When multiple activities have same end time,
    prefer the one with earlier start.
    """
    # Sort by end, then by start (ascending)
    # This ensures we pick shorter activities when ends are equal
    activities.sort(key=lambda x: (x[1], x[0]))
    
    selected = []
    last_end = float('-inf')
    
    for start, end in activities:
        if start >= last_end:
            selected.append((start, end))
            last_end = end
    
    return selected
```

### Tactic 3: Greedy Proof by Exchange Argument

```python
def explain_greedy_correctness():
    """
    Understanding why greedy works:
    
    Exchange Argument:
    1. Let A = {a1, a2, ..., ak} be greedy solution (sorted by end)
    2. Let O = {o1, o2, ..., om} be optimal solution (sorted by end)
    3. We prove k >= m by showing we can replace oi with ai
    
    Key insight: Since ai is the earliest-finishing activity 
    compatible with previous selections, end(ai) <= end(oi)
    Therefore, replacing oi with ai leaves at least as much room
    for remaining activities.
    
    By induction, we can transform O into A without reducing size.
    Hence, greedy is optimal.
    """
    pass
```

### Tactic 4: Binary Search for Weighted Version

```python
def find_last_compatible_binary(activities, i):
    """
    Find rightmost activity that ends before activities[i] starts.
    Used in weighted activity selection DP.
    """
    start_i = activities[i][0]
    lo, hi = 0, i - 1
    result = -1
    
    while lo <= hi:
        mid = (lo + hi) // 2
        if activities[mid][1] <= start_i:
            result = mid
            lo = mid + 1
        else:
            hi = mid - 1
    
    return result
```

### Tactic 5: Convert to Minimum Removals

```python
def min_activities_to_remove(activities):
    """
    LeetCode 435 variation.
    Convert to: total - max_non_overlapping
    """
    if not activities:
        return 0
    
    # Apply greedy activity selection
    activities.sort(key=lambda x: x[1])
    
    keep_count = 1
    last_end = activities[0][1]
    
    for start, end in activities[1:]:
        if start >= last_end:
            keep_count += 1
            last_end = end
    
    return len(activities) - keep_count
```

---

## Python Templates

### Template 1: Activity Selection (Return Indices)

```python
from typing import List, Tuple


def activity_selection(activities: List[Tuple[int, int]]) -> List[int]:
    """
    Select maximum number of non-overlapping activities.
    Returns original indices of selected activities.
    
    Args:
        activities: List of (start, end) tuples for each activity
    
    Returns:
        Indices of selected non-overlapping activities
    
    Time: O(n log n) for sorting
    Space: O(n) for storing indices (excluding input storage)
    """
    if not activities:
        return []
    
    n = len(activities)
    
    # Create list of (end, start, original_index) and sort by end time
    sorted_activities = sorted(
        [(activities[i][1], activities[i][0], i) for i in range(n)],
        key=lambda x: (x[0], x[1])
    )
    
    # Select first activity (earliest end time)
    result = [sorted_activities[0][2]]
    last_end_time = sorted_activities[0][0]
    
    # Select subsequent non-overlapping activities
    for i in range(1, n):
        start_time = sorted_activities[i][1]
        
        # If this activity starts after or when the last one ends
        if start_time >= last_end_time:
            result.append(sorted_activities[i][2])
            last_end_time = sorted_activities[i][0]
    
    return result
```

### Template 2: Activity Selection (Return Intervals)

```python
def activity_selection_intervals(intervals: List[Tuple[int, int]]) -> List[Tuple[int, int]]:
    """
    Alternative version that returns the actual intervals instead of indices.
    
    Args:
        intervals: List of (start, end) tuples
    
    Returns:
        List of selected non-overlapping intervals
    """
    if not intervals:
        return []
    
    # Sort by end time
    sorted_intervals = sorted(intervals, key=lambda x: x[1])
    
    # Select first interval
    result = [sorted_intervals[0]]
    last_end = sorted_intervals[0][1]
    
    # Select subsequent non-overlapping intervals
    for start, end in sorted_intervals[1:]:
        if start >= last_end:
            result.append((start, end))
            last_end = end
    
    return result
```

### Template 3: Weighted Activity Selection (DP)

```python
def weighted_activity_selection(activities: List[Tuple[int, int]], 
                                weights: List[int]) -> int:
    """
    Weighted Activity Selection using Dynamic Programming.
    
    Args:
        activities: List of (start, end) tuples
        weights: List of weights for each activity
    
    Returns:
        Maximum total weight of non-overlapping activities
    """
    if not activities:
        return 0
    
    n = len(activities)
    
    # Sort by end time
    sorted_indices = sorted(range(n), key=lambda i: activities[i][1])
    
    # Create sorted activities and weights
    sorted_activities = [activities[i] for i in sorted_indices]
    sorted_weights = [weights[i] for i in sorted_indices]
    
    # Find the last non-overlapping activity for each activity
    def find_last_compatible(i):
        for j in range(i - 1, -1, -1):
            if sorted_activities[j][1] <= sorted_activities[i][0]:
                return j
        return -1
    
    # DP: dp[i] = max weight considering activities 0 to i
    dp = [0] * n
    
    for i in range(n):
        # Option 1: Don't include activity i
        weight_without = dp[i - 1] if i > 0 else 0
        
        # Option 2: Include activity i
        last_compatible = find_last_compatible(i)
        weight_with = sorted_weights[i]
        if last_compatible >= 0:
            weight_with += dp[last_compatible]
        
        dp[i] = max(weight_without, weight_with)
    
    return dp[n - 1]
```

### Template 4: Minimum Activities to Remove

```python
def min_activities_to_remove(activities: List[Tuple[int, int]]) -> int:
    """
    Find minimum number of activities to remove to make all non-overlapping.
    Equivalent to: n - max_non_overlapping
    
    LeetCode 435 solution.
    """
    if not activities:
        return 0
    
    n = len(activities)
    
    # Sort by end time
    sorted_activities = sorted(
        [(activities[i][1], activities[i][0], i) for i in range(n)],
        key=lambda x: (x[0], x[1])
    )
    
    count = 1  # At least one activity can be selected
    last_end = sorted_activities[0][0]
    
    for i in range(1, n):
        if sorted_activities[i][1] >= last_end:
            count += 1
            last_end = sorted_activities[i][0]
    
    return n - count
```

### Template 5: Meeting Rooms II

```python
import heapq

def min_meeting_rooms(intervals: List[List[int]]) -> int:
    """
    Find minimum number of meeting rooms required.
    Uses min-heap to track end times of ongoing meetings.
    """
    if not intervals:
        return 0
    
    # Sort by start time
    sorted_intervals = sorted(intervals, key=lambda x: x[0])
    
    # Min-heap to track end times
    min_heap = []
    
    for start, end in sorted_intervals:
        # If meeting ends before next starts, pop from heap
        if min_heap and min_heap[0] <= start:
            heapq.heappop(min_heap)
        
        # Add current meeting end time
        heapq.heappush(min_heap, end)
    
    return len(min_heap)
```

---

## When to Use

Use the Activity Selection algorithm when you need to solve problems involving:

- **Interval Scheduling**: Selecting maximum number of non-overlapping intervals
- **Resource Allocation**: Scheduling tasks that don't conflict with each other
- **Event Planning**: Finding maximum events that can attend
- **Greedy Optimization**: Problems where local optimal leads to global optimal

### Comparison with Alternatives

| Approach | Time Complexity | Use Case |
|----------|-----------------|----------|
| **Activity Selection (Greedy)** | O(n log n) | When you need maximum non-overlapping activities |
| **Dynamic Programming** | O(n²) or O(n log n) | When weights are involved (Weighted Interval Scheduling) |
| **Backtracking** | Exponential | When you need ALL possible combinations |
| **Sort + Scan** | O(n log n) | Similar to greedy, different implementation |

### When to Choose Activity Selection vs Other Approaches

- **Choose Activity Selection (Greedy)** when:
  - You need the maximum number of non-overlapping intervals
  - All intervals have equal "value" or weight
  - You want O(n log n) solution
  - The problem has the "earliest finish time" property

- **Choose Dynamic Programming** when:
  - Each interval has a different weight/value
  - You need weighted interval scheduling
  - The greedy property doesn't hold

- **Choose Backtracking** when:
  - You need to find all possible valid combinations
  - The problem requires enumeration of solutions

---

## Algorithm Explanation

### Core Concept

The key insight behind the Activity Selection algorithm is that by always selecting the activity that **finishes earliest**, we maximize the remaining time available for other activities. This greedy choice property ensures optimality because:

1. **Earliest Finish = Most Room**: The activity that ends earliest leaves the maximum time window for subsequent activities
2. **Optimal Substructure**: If we select the earliest-finishing activity, the remaining problem (selecting from the activities that start after it ends) is a smaller instance of the same problem
3. **No Regret**: Selecting the earliest finisher never eliminates a better solution because any optimal solution that doesn't include the earliest finisher can be modified to include it without reducing the number of activities

### How It Works

#### Algorithm Steps:

1. **Sort activities by end time** (ascending order). If two activities have the same end time, sort by start time (ascending).

2. **Select the first activity** from the sorted list (the one that finishes earliest).

3. **For each remaining activity** (in sorted order):
   - If the activity's start time is **greater than or equal to** the last selected activity's end time:
     - Select this activity
     - Update the "last selected activity" to this one

4. **Repeat** until all activities are processed.

#### Visual Representation

Consider activities with (start, end) times:
```
Activity 0: [1, 4]
Activity 1: [3, 5]
Activity 2: [0, 6]
Activity 3: [5, 7]
Activity 4: [3, 9]
Activity 5: [5, 9]
Activity 6: [6, 10]
Activity 7: [8, 11]
```

After sorting by end time:
```
[1, 4] → Activity 0
[3, 5] → Activity 1
[5, 7] → Activity 3
[6, 10] → Activity 6
[8, 11] → Activity 7
[0, 6] → Activity 2
[3, 9] → Activity 4
[5, 9] → Activity 5
```

Selection process:
1. Select [1, 4] (earliest end)
2. Skip [3, 5] (starts at 3 < 4, overlaps)
3. Select [5, 7] (starts at 5 ≥ 4)
4. Skip [6, 10] (starts at 6 < 7, overlaps)
5. Select [8, 11] (starts at 8 ≥ 7)
6. Result: [[1,4], [5,7], [8,11]] = 3 activities

### Why Greedy Works

The Activity Selection problem satisfies two key properties that make greedy work:

1. **Greedy Choice Property**: Choosing the activity that finishes earliest is always part of some optimal solution. If there's an optimal solution that doesn't include the earliest-finishing activity, we can swap the first activity in that solution with the earliest-finishing one without reducing the number of activities.

2. **Optimal Substructure**: After selecting the earliest-finishing activity, the remaining problem (selecting from activities that start after it ends) is itself an activity selection problem. The optimal solution to the whole problem consists of the greedy choice plus the optimal solution to the subproblem.

---

## Practice Problems

### Problem 1: Non-overlapping Intervals

**Problem:** [LeetCode 435 - Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)

**Description:** Given a collection of intervals, find the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.

**How to Apply Activity Selection:**
- Sort intervals by end time (like standard activity selection)
- Count how many non-overlapping intervals we can keep
- Answer = total intervals - non-overlapping count

---

### Problem 2: Minimum Number of Arrows to Burst Balloons

**Problem:** [LeetCode 452 - Minimum Number of Arrows to Burst Balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/)

**Description:** Find minimum arrows that must be shot to burst all balloons. An arrow shot at position x will burst all balloons whose starting point ≤ x ≤ ending point.

**How to Apply Activity Selection:**
- Sort balloons by end coordinate
- Shoot arrow at end of first balloon
- Skip all balloons that overlap with this arrow position
- Repeat for remaining balloons

---

### Problem 3: Merge Intervals (Related)

**Problem:** [LeetCode 56 - Merge Intervals](https://leetcode.com/problems/merge-intervals/)

**Description:** Merge all overlapping intervals and return an array of non-overlapping intervals.

**How to Apply Activity Selection:**
- Sort intervals by start time
- Merge overlapping intervals
- Similar greedy approach but with merging instead of selection

---

### Problem 4: Meeting Rooms II

**Problem:** [LeetCode 253 - Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/)

**Description:** Find the minimum number of conference rooms required to hold all meetings.

**How to Apply Activity Selection:**
- Use min-heap approach with activity selection concepts
- Track end times of ongoing meetings
- Similar to "minimum platforms" problem

---

### Problem 5: Minimum Platforms

**Problem:** [GeeksForGeeks - Minimum Number of Platforms](https://practice.geeksforgeeks.org/problems/minimum-number-of-platforms-while-merge-sorting/)

**Description:** Given arrival and departure times of trains, find minimum number of platforms needed.

**How to Apply Activity Selection:**
- Treat each train as an activity with arrival and departure
- Use greedy approach similar to activity selection
- Count maximum overlapping activities at any time

---

## Video Tutorial Links

### Fundamentals

- [Activity Selection Problem (Take U Forward)](https://www.youtube.com/watch?v=poWB6MGoxAk) - Comprehensive introduction
- [Activity Selection Greedy Algorithm (WilliamFiset)](https://www.youtube.com/watch?v=2NoZ8T58J74) - Detailed explanation with visualizations
- [Greedy Algorithm - Activity Selection (NeetCode)](https://www.youtube.com/watch?v=4nK8x5w8U8w) - Practical implementation guide

### Related Problems

- [Non-overlapping Intervals (LeetCode 435)](https://www.youtube.com/watch?v=nONCGxWoUfM) - Applying activity selection
- [Merge Intervals (LeetCode 56)](https://www.youtube.com/watch?v=44H3cE2ggsM) - Related interval problems
- [Meeting Rooms II (LeetCode 253)](https://www.youtube.com/watch?v=FXWgr7eW2N0) - Minimum resources problem

### Advanced Topics

- [Weighted Activity Selection (DP)](https://www.youtube.com/watch?v=oN0F8VwESrE) - When weights are involved
- [Interval Scheduling Maximum Profit](https://www.youtube.com/watch?v=o64CW-8N-pI) - Weighted version

---

## Follow-up Questions

### Q1: Why do we sort by end time instead of start time?

**Answer:** Sorting by end time (ascending) is crucial because:
- It ensures we always pick the activity that finishes earliest
- This leaves maximum room for remaining activities
- It guarantees optimality (proven by exchange argument)

If we sorted by start time, we might pick activities that finish late, blocking many potential activities.

---

### Q2: Can Activity Selection handle activities with the same end time?

**Answer:** Yes, but you need a tie-breaker:
- If two activities have the same end time, sort by start time (ascending)
- This picks the one that starts earlier, which is always safe
- Example: [1,5] and [4,5] → pick [1,5] first, then check [4,5]

---

### Q3: What if activities can share endpoints (one ends exactly when another starts)?

**Answer:** The algorithm already handles this:
- Use `start_time >= last_end_time` (≥, not >)
- This allows activities that end exactly when another starts
- This is the correct interpretation for non-overlapping

---

### Q4: How do you modify the algorithm for weighted activity selection?

**Answer:** Greedy doesn't work for weighted versions. Use Dynamic Programming:
1. Sort activities by end time: O(n log n)
2. For each activity i, find last non-conflicting activity j
3. Use DP: `dp[i] = max(dp[i-1], weight[i] + dp[j])`
4. Time: O(n²) or O(n log n) with binary search

---

### Q5: What's the difference between Activity Selection and Merge Intervals?

**Answer:**
- **Activity Selection**: Select MAXIMUM number of NON-overlapping intervals
- **Merge Intervals**: Combine ALL overlapping intervals into non-overlapping ones
- Both use sorting, but different goals and logic

---

## Summary

The Activity Selection algorithm is a classic greedy algorithm that demonstrates how making locally optimal choices leads to globally optimal solutions. Key takeaways:

- **Greedy Approach**: Always select the activity that finishes earliest
- **Time Complexity**: O(n log n) due to sorting
- **Space Complexity**: O(n) for storing results
- **Key Property**: Greedy choice property + optimal substructure

When to use:
- ✅ Maximum non-overlapping intervals
- ✅ Event scheduling problems
- ✅ Resource allocation where all resources have equal value
- ❌ When intervals have different weights (use DP instead)
- ❌ When you need ALL valid combinations (use backtracking)

This algorithm is fundamental to understanding greedy algorithms and is frequently asked in technical interviews, especially in problems related to interval scheduling and resource allocation.
