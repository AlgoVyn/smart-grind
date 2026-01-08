# Employee Free Time

## Problem Description
[Link to problem](https://leetcode.com/problems/employee-free-time/)

## Solution

```python
# Python solution
from typing import List

class Solution:
    def employeeFreeTime(self, schedule: List[List[List[int]]]) -> List[List[int]]:
        all_intervals = []
        for emp in schedule:
            all_intervals.extend(emp)
        all_intervals.sort(key=lambda x: x[0])
        merged = []
        for interval in all_intervals:
            if not merged or merged[-1][1] < interval[0]:
                merged.append(interval)
            else:
                merged[-1][1] = max(merged[-1][1], interval[1])
        free = []
        for i in range(1, len(merged)):
            if merged[i][0] > merged[i-1][1]:
                free.append([merged[i-1][1], merged[i][0]])
        return free
```

## Explanation
To find the free time slots where no employee is working, we first collect all intervals from all employees and sort them by start time.

We then merge overlapping intervals to get the periods when at least one employee is working.

The free time slots are the gaps between these merged intervals.

We iterate through the merged intervals and add the gaps to the result list.

Time complexity: O(n log n) for sorting, where n is the total number of intervals.
Space complexity: O(n) for storing all intervals.
