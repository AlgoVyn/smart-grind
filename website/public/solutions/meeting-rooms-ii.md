# Meeting Rooms Ii

## Problem Description
[Link to problem](https://leetcode.com/problems/meeting-rooms-ii/)

Given an array of meeting time intervals intervals where intervals[i] = [starti, endi], return the minimum number of conference rooms required.

Example 1:

Input: intervals = [[0,30],[5,10],[15,20]]
Output: 2

Example 2:

Input: intervals = [[7,10],[2,4]]
Output: 1

Constraints:

1 <= intervals.length <= 104
0 <= starti < endi <= 106

## Solution

```python
from typing import List

class Solution:
    def minMeetingRooms(self, intervals: List[List[int]]) -> int:
        if not intervals:
            return 0
        starts = sorted([i[0] for i in intervals])
        ends = sorted([i[1] for i in intervals])
        i, j = 0, 0
        rooms = 0
        max_rooms = 0
        while i < len(intervals):
            if starts[i] < ends[j]:
                rooms += 1
                max_rooms = max(max_rooms, rooms)
                i += 1
            else:
                rooms -= 1
                j += 1
        return max_rooms
```

## Explanation
To determine the minimum number of meeting rooms required, we use a two-pointer technique after sorting the start and end times.

1. Extract and sort the start times of all meetings.
2. Extract and sort the end times of all meetings.
3. Initialize two pointers: one for the start times (i) and one for the end times (j), both starting at 0.
4. Initialize variables: current_rooms = 0, max_rooms = 0.
5. While the start pointer i is less than the number of meetings:
   - If the current start time is less than the current end time (start[i] < end[j]), it means a new meeting starts before the earliest ending meeting finishes, so increment current_rooms and move the start pointer.
   - Otherwise, a meeting has ended, so decrement current_rooms and move the end pointer.
   - Update max_rooms with the current_rooms.
6. After processing all starts, max_rooms will hold the minimum number of rooms needed.

Time complexity: O(n log n), dominated by sorting the start and end times.
Space complexity: O(n), for storing the sorted start and end arrays.
