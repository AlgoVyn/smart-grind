# Divide Intervals Into Minimum Number Of Groups

## Problem Description
You are given a 2D integer array intervals where intervals[i] = [lefti, righti] represents the inclusive interval [lefti, righti].
You have to divide the intervals into one or more groups such that each interval is in exactly one group, and no two intervals that are in the same group intersect each other.
Return the minimum number of groups you need to make.
Two intervals intersect if there is at least one common number between them. For example, the intervals [1, 5] and [5, 8] intersect.
 
Example 1:

Input: intervals = [[5,10],[6,8],[1,5],[2,3],[1,10]]
Output: 3
Explanation: We can divide the intervals into the following groups:
- Group 1: [1, 5], [6, 8].
- Group 2: [2, 3], [5, 10].
- Group 3: [1, 10].
It can be proven that it is not possible to divide the intervals into fewer than 3 groups.

Example 2:

Input: intervals = [[1,3],[5,6],[8,10],[11,13]]
Output: 1
Explanation: None of the intervals overlap, so we can put all of them in one group.

 
Constraints:

1 <= intervals.length <= 105
intervals[i].length == 2
1 <= lefti <= righti <= 106
## Solution

```python
# Python solution
from typing import List
import heapq

class Solution:
    def minGroups(self, intervals: List[List[int]]) -> int:
        if not intervals:
            return 0
        intervals.sort(key=lambda x: x[0])
        heap = []
        max_groups = 0
        for start, end in intervals:
            while heap and heap[0] < start:
                heapq.heappop(heap)
            heapq.heappush(heap, end)
            max_groups = max(max_groups, len(heap))
        return max_groups
```

## Explanation
To solve this problem, we need to find the minimum number of groups such that no two intervals in the same group overlap. This is equivalent to finding the maximum number of intervals that overlap at any point in time.

We sort the intervals by their start times. We use a min-heap to keep track of the end times of the intervals that are currently active (i.e., have started but not yet ended).

For each interval in sorted order:
- We remove from the heap all intervals that have ended before the current interval starts (i.e., heap[0] < start).
- We add the current interval's end time to the heap.
- We update the maximum number of groups as the current size of the heap.

This approach ensures we track the maximum overlap efficiently.

Time complexity: O(n log n) due to sorting and heap operations.
Space complexity: O(n) for the heap in the worst case.
