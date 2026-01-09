# Insert Interval

## Problem Description

You are given an array of **non-overlapping** intervals `intervals` where `intervals[i] = [starti, endi]` represent the start and end of the ith interval. The array is sorted in ascending order by `starti`.

You are also given an interval `newInterval = [start, end]` that represents the start and end of another interval.

Insert `newInterval` into `intervals` such that:
1. The intervals remain sorted in ascending order by `starti`.
2. The intervals still do not have any overlapping intervals (merge overlapping intervals if necessary).

Return the intervals after the insertion. You can make a new array and return it (no need to modify in-place).

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `intervals = [[1,3],[6,9]]`, `newInterval = [2,5]` | `[[1,5],[6,9]]` |

**Example 2:**

| Input | Output |
|-------|--------|
| `intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]]`, `newInterval = [4,8]` | `[[1,2],[3,10],[12,16]]` |

**Explanation:** The new interval `[4,8]` overlaps with `[3,5]`, `[6,7]`, and `[8,10]`, so they are all merged into `[3,10]`.

## Constraints

- `0 <= intervals.length <= 10⁴`
- `intervals[i].length == 2`
- `0 <= starti <= endi <= 10⁵`
- `intervals` is sorted by `starti` in ascending order.
- `newInterval.length == 2`
- `0 <= start <= end <= 10⁵`

## Solution

```python
from typing import List

class Solution:
    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
        res = []
        i = 0
        n = len(intervals)
        
        # Add all intervals that end before newInterval starts
        while i < n and intervals[i][1] < newInterval[0]:
            res.append(intervals[i])
            i += 1
        
        # Merge all overlapping intervals with newInterval
        while i < n and intervals[i][0] <= newInterval[1]:
            newInterval[0] = min(newInterval[0], intervals[i][0])
            newInterval[1] = max(newInterval[1], intervals[i][1])
            i += 1
        
        # Add the merged newInterval
        res.append(newInterval)
        
        # Add all remaining intervals
        while i < n:
            res.append(intervals[i])
            i += 1
        
        return res
```

## Explanation

This problem inserts a new interval into a sorted list of non-overlapping intervals, merging if necessary.

### Algorithm Steps

1. **Add non-overlapping intervals before newInterval:**
   - Add all intervals that end before `newInterval` starts.
   - These intervals have no overlap with the new interval.

2. **Merge overlapping intervals:**
   - While the current interval starts before or at the end of `newInterval`, they overlap.
   - Expand `newInterval` to include the overlap:
     - `newInterval[0] = min(newInterval[0], intervals[i][0])`
     - `newInterval[1] = max(newInterval[1], intervals[i][1])`

3. **Add the merged newInterval:**
   - After merging all overlaps, add the combined interval.

4. **Add remaining intervals:**
   - Add all intervals that come after the merged newInterval.

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - single pass through all intervals |
| **Space** | O(n) - for the result list |

The algorithm efficiently handles the insertion by leveraging the sorted nature of the input intervals.
