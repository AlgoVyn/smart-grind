# Greedy - Interval Merging/Scheduling

## Overview

The Greedy - Interval Merging/Scheduling pattern is a fundamental approach used to handle problems involving intervals or time-based events. This pattern focuses on efficiently merging overlapping intervals or scheduling tasks to minimize conflicts and optimize resource usage. It's particularly useful in scenarios where you have a collection of time intervals that may overlap, and you need to combine them into non-overlapping intervals or schedule them without conflicts.

When to use this pattern:
- When dealing with a list of intervals that need to be merged if they overlap
- For scheduling problems where tasks have start and end times, and you need to find the minimum number of resources (like rooms) required
- In problems requiring the removal of minimum intervals to eliminate overlaps

Benefits:
- Simplifies complex interval-based problems by reducing them to sorted operations
- Provides optimal solutions for many interval-related optimization problems
- Helps in resource allocation and conflict resolution in scheduling scenarios

## Key Concepts

- **Sorting Intervals**: Always sort the intervals by their start time to process them in order
- **Merging Logic**: When iterating through sorted intervals, check if the current interval overlaps with the last merged interval. If it does, extend the end time; otherwise, add it as a new interval
- **Scheduling Priority**: For scheduling problems, sort intervals by their end time to always pick the task that finishes earliest, allowing more tasks to be scheduled
- **Greedy Choice**: At each step, make the locally optimal choice (merge or schedule the current interval) that leads to a globally optimal solution

## Template

```python
def merge_intervals(intervals):
    """
    Template for merging overlapping intervals.
    
    Args:
    intervals (List[List[int]]): List of intervals, each as [start, end]
    
    Returns:
    List[List[int]]: List of merged non-overlapping intervals
    """
    if not intervals:
        return []
    
    # Sort intervals by start time
    intervals.sort(key=lambda x: x[0])
    
    # Initialize merged list with first interval
    merged = [intervals[0]]
    
    # Iterate through remaining intervals
    for current in intervals[1:]:
        last = merged[-1]
        # If current interval overlaps with last merged interval
        if current[0] <= last[1]:
            # Merge by updating the end time
            last[1] = max(last[1], current[1])
        else:
            # No overlap, add current interval
            merged.append(current)
    
    return merged

def schedule_tasks(intervals):
    """
    Template for scheduling tasks to minimize conflicts (greedy by end time).
    
    Args:
    intervals (List[List[int]]): List of intervals, each as [start, end]
    
    Returns:
    List[List[int]]: List of scheduled non-overlapping tasks
    """
    if not intervals:
        return []
    
    # Sort intervals by end time for greedy scheduling
    intervals.sort(key=lambda x: x[1])
    
    scheduled = [intervals[0]]
    
    for current in intervals[1:]:
        last = scheduled[-1]
        # If current task starts after last task ends
        if current[0] >= last[1]:
            scheduled.append(current)
    
    return scheduled
```

## Example Problems

1. **Merge Intervals (LeetCode 56)**: Given a collection of intervals, merge all overlapping intervals and return a list of non-overlapping intervals that cover all the original intervals.

2. **Meeting Rooms II (LeetCode 253)**: Given an array of meeting time intervals consisting of start and end times, find the minimum number of conference rooms required to accommodate all meetings.

3. **Non-overlapping Intervals (LeetCode 435)**: Given a collection of intervals, find the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.

## Time and Space Complexity

- **Time Complexity**: O(n log n) due to the initial sorting step, where n is the number of intervals. The merging or scheduling iteration is O(n).
- **Space Complexity**: O(n) in the worst case, as we may need to store all intervals in the merged or scheduled list. The sorting can be done in-place in some languages.

## Common Pitfalls

- **Not Sorting Intervals**: Always sort by start time for merging or by end time for scheduling; failing to do so will lead to incorrect results.
- **Incorrect Merge Condition**: Use `current[0] <= last[1]` to check for overlap, and update the end with `max(last[1], current[1])`.
- **Edge Cases**: Handle empty input lists, single intervals, and intervals with identical start/end times.
- **Scheduling vs. Merging**: In scheduling problems, prioritize by end time to allow more tasks; in merging, prioritize by start time.
- **Modifying Original List**: Be careful not to modify the input list if it's not allowed; make a copy if necessary.