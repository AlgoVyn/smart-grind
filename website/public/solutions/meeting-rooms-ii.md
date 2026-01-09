# Meeting Rooms II

## Problem Description

Given an array of meeting time intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of conference rooms required.

---

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `intervals = [[0,30],[5,10],[15,20]]` | `2` |

**Example 2:**

| Input | Output |
|-------|--------|
| `intervals = [[7,10],[2,4]]` | `1` |

---

## Constraints

- `1 <= intervals.length <= 10^4`
- `0 <= start_i < end_i <= 10^6`

---

## Solution

```python
from typing import List

class Solution:
    def minMeetingRooms(self, intervals: List[List[int]]) -> int:
        if not intervals:
            return 0
        
        # Extract and sort start times
        starts = sorted([i[0] for i in intervals])
        # Extract and sort end times
        ends = sorted([i[1] for i in intervals])
        
        i, j = 0, 0  # Pointers for starts and ends
        rooms = 0
        max_rooms = 0
        
        while i < len(intervals):
            # New meeting starts before earliest ending meeting finishes
            if starts[i] < ends[j]:
                rooms += 1
                max_rooms = max(max_rooms, rooms)
                i += 1
            else:
                # A meeting has ended
                rooms -= 1
                j += 1
        
        return max_rooms
```

---

## Explanation

To determine the minimum number of meeting rooms required, we use a two-pointer technique after sorting the start and end times.

1. **Extract and sort** the start times and end times of all meetings separately.
2. **Initialize two pointers**: one for start times (`i`) and one for end times (`j`), both starting at `0`.
3. **Initialize variables**: `rooms = 0` (current rooms in use), `max_rooms = 0` (maximum rooms needed).
4. **Iterate through meetings**:
   - If `starts[i] < ends[j]`: A new meeting starts before the earliest ending meeting finishes. Increment `rooms` and move the start pointer.
   - Otherwise: A meeting has ended. Decrement `rooms` and move the end pointer.
   - Update `max_rooms` with the current `rooms` value.
5. Return `max_rooms`, which holds the minimum number of rooms needed.

---

## Complexity Analysis

| Metric | Complexity |
|--------|------------|
| Time | `O(n log n)` — dominated by sorting the start and end times |
| Space | `O(n)` — for storing the sorted start and end arrays |
