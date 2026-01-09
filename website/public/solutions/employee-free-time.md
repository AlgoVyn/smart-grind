# Employee Free Time

## Problem Description

> Given a list of employees' schedules where each employee has a list of busy time intervals, find all time intervals when all employees are free.

## Solution

```python
from typing import List

class Solution:
    def employeeFreeTime(self, schedule: List[List[List[int]]]) -> List[List[int]]]:
        """
        Find all time intervals when all employees are free.

        Args:
            schedule: List of employees, each with a list of [start, end] intervals

        Returns:
            List of [start, end] intervals representing free time slots
        """
        # Flatten all intervals from all employees
        all_intervals = []
        for emp in schedule:
            all_intervals.extend(emp)

        # Sort all intervals by start time
        all_intervals.sort(key=lambda x: x[0])

        # Merge overlapping intervals
        merged = []
        for interval in all_intervals:
            if not merged or merged[-1][1] < interval[0]:
                merged.append(interval)
            else:
                merged[-1][1] = max(merged[-1][1], interval[1])

        # Find gaps between merged intervals
        free = []
        for i in range(1, len(merged)):
            if merged[i][0] > merged[i-1][1]:
                free.append([merged[i-1][1], merged[i][0]])

        return free
```

## Explanation

### Algorithm Overview

To find the free time slots where no employee is working:

1. **Flatten Intervals**: Collect all intervals from all employees into a single list.
2. **Sort**: Sort all intervals by their start time.
3. **Merge Overlaps**: Merge overlapping intervals to identify periods when at least one employee is working.
4. **Find Gaps**: The free time slots are the gaps between these merged intervals.

## Complexity Analysis

| Metric | Complexity |
|--------|------------|
| Time | **O(n log n)** |
| Space | **O(n)** |

- **Time**: O(n log n) for sorting, where n is the total number of intervals
- **Space**: O(n) for storing all intervals
