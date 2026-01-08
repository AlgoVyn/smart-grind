# Merge Intervals

## Problem Description
[Link to problem](https://leetcode.com/problems/merge-intervals/)

Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.
 
Example 1:

Input: intervals = [[1,3],[2,6],[8,10],[15,18]]
Output: [[1,6],[8,10],[15,18]]
Explanation: Since intervals [1,3] and [2,6] overlap, merge them into [1,6].

Example 2:

Input: intervals = [[1,4],[4,5]]
Output: [[1,5]]
Explanation: Intervals [1,4] and [4,5] are considered overlapping.

Example 3:

Input: intervals = [[4,7],[1,4]]
Output: [[1,7]]
Explanation: Intervals [1,4] and [4,7] are considered overlapping.

 
Constraints:

1 <= intervals.length <= 104
intervals[i].length == 2
0 <= starti <= endi <= 104


## Solution

```python
from typing import List

class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        if not intervals:
            return []
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

## Explanation
To merge overlapping intervals, we first sort the intervals by their start times. Then, we iterate through the sorted list, merging intervals that overlap.

1. Sort the intervals based on their start times.
2. Initialize an empty list to store the merged intervals.
3. Iterate through each interval in the sorted list:
   - If the merged list is empty or the current interval's start time is greater than the end time of the last interval in the merged list, add the current interval to the merged list.
   - Otherwise, merge the current interval with the last one in the merged list by updating the end time to the maximum of the two end times.
4. After processing all intervals, the merged list contains the non-overlapping intervals.

Time complexity: O(n log n), where n is the number of intervals, due to the sorting step; the merging step is O(n).
Space complexity: O(n), for storing the merged intervals; the input can be sorted in place to achieve O(1) extra space if allowed.
