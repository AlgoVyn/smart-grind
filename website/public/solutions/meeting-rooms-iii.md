# Meeting Rooms III

## Problem Description

You are given an integer `n` representing `n` rooms numbered from `0` to `n - 1`. You are given a 2D integer array `meetings` where `meetings[i] = [start_i, end_i]`, meaning a meeting will be held during the half-closed interval `[start_i, end_i)`. All `start_i` values are unique.

### Allocation Rules

- Each meeting takes place in the **unused room with the lowest number**.
- If no rooms are available, the meeting is **delayed** until a room becomes free. The delayed meeting keeps its original duration.
- When a room becomes unused, meetings with **earlier original start times** are given priority.

Return the number of the room that held the most meetings. If multiple rooms have the same count, return the room with the **lowest number**.

> **Note:** A half-closed interval `[a, b)` includes `a` but excludes `b`.

---

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `n = 2, meetings = [[0,10],[1,5],[2,7],[3,4]]` | `0` |

**Explanation:**
- Time 0: Both rooms available. Meeting 1 starts in room 0.
- Time 1: Room 1 available. Meeting 2 starts in room 1.
- Time 2: Both rooms occupied. Meeting 3 delayed.
- Time 3: Both rooms occupied. Meeting 4 delayed.
- Time 5: Meeting in room 1 ends. Meeting 3 starts in room 1 (duration `[5,10)`).
- Time 10: Both meetings end. Meeting 4 starts in room 0 (duration `[10,11)`).
- Both rooms held 2 meetings → return `0`.

**Example 2:**

| Input | Output |
|-------|--------|
| `n = 3, meetings = [[1,20],[2,10],[3,5],[4,9],[6,8]]` | `1` |

**Explanation:**
- Time 1: All rooms available. Meeting 1 starts in room 0.
- Time 2: Rooms 1, 2 available. Meeting 2 starts in room 1.
- Time 3: Room 2 available. Meeting 3 starts in room 2.
- Time 4: All rooms occupied. Meeting 4 delayed.
- Time 5: Meeting in room 2 ends. Meeting 4 starts in room 2 (duration `[5,10)`).
- Time 6: All rooms occupied. Meeting 5 delayed.
- Time 10: Meetings in rooms 1, 2 end. Meeting 5 starts in room 1 (duration `[10,12)`).
- Room 0 held 1 meeting; rooms 1 and 2 held 2 meetings each → return `1`.

---

## Constraints

- `1 <= n <= 100`
- `1 <= meetings.length <= 10^5`
- `meetings[i].length == 2`
- `0 <= start_i < end_i <= 5 * 10^5`
- All `start_i` values are unique

---

## Solution

```python
import heapq
from typing import List

class Solution:
    def mostBooked(self, n: int, meetings: List[List[int]]) -> int:
        # Sort meetings by start time
        meetings.sort()
        
        # Available rooms (min-heap by room number)
        available = list(range(n))
        heapq.heapify(available)
        
        # Occupied rooms: (end_time, room)
        occupied = []
        # Delayed meetings: (start, duration)
        delayed = []
        # Track meeting count per room
        count = [0] * n
        
        i = 0  # Index for meetings
        
        while i < len(meetings) or delayed:
            # If no occupied or delayed meetings, process next meeting directly
            if not occupied and not delayed:
                start, end = meetings[i]
                duration = end - start
                room = heapq.heappop(available)
                heapq.heappush(occupied, (end, room))
                count[room] += 1
                i += 1
            else:
                # Find next significant time point
                next_time = float('inf')
                if occupied:
                    next_time = min(next_time, occupied[0][0])
                if delayed:
                    next_time = min(next_time, delayed[0][0])
                if i < len(meetings):
                    next_time = min(next_time, meetings[i][0])
                
                # Free rooms that ended by next_time
                while occupied and occupied[0][0] <= next_time:
                    _, room = heapq.heappop(occupied)
                    heapq.heappush(available, room)
                
                # Assign delayed meetings if rooms available
                while delayed and available:
                    start, duration = heapq.heappop(delayed)
                    room = heapq.heappop(available)
                    heapq.heappush(occupied, (start + duration, room))
                    count[room] += 1
                
                # Start meetings at next_time if rooms available
                while i < len(meetings) and meetings[i][0] == next_time and available:
                    start, end = meetings[i]
                    duration = end - start
                    room = heapq.heappop(available)
                    heapq.heappush(occupied, (end, room))
                    count[room] += 1
                    i += 1
                
                # Delay remaining meetings at this time
                while i < len(meetings) and meetings[i][0] == next_time:
                    start, end = meetings[i]
                    duration = end - start
                    heapq.heappush(delayed, (start, duration))
                    i += 1
        
        # Find room with maximum meetings (lowest room number on ties)
        max_count = max(count)
        for room in range(n):
            if count[room] == max_count:
                return room
```

---

## Explanation

This problem requires simulating meeting room allocation with delayed meetings and specific prioritization rules. We use priority queues (heaps) for efficient management:

1. **Sort meetings** by start time for chronological processing.
2. **Initialize three heaps**:
   - `available`: Min-heap for available rooms (prioritized by room number)
   - `occupied`: Min-heap for occupied rooms (prioritized by end time)
   - `delayed`: Min-heap for delayed meetings (prioritized by original start time)
3. **Maintain a counter array** to track meetings per room.
4. **Process meetings**:
   - Free rooms that have ended before the next significant time.
   - Assign delayed meetings to available rooms (earliest original start first).
   - Start new meetings at current time if rooms available.
   - Delay meetings when no rooms are free.
5. **Return the room** with the maximum meeting count (lowest number on ties).

---

## Complexity Analysis

| Metric | Complexity |
|--------|------------|
| Time | `O(m log n)` — where `m` is the number of meetings (sorting + heap operations) |
| Space | `O(n + m)` — for heaps and counter array |
