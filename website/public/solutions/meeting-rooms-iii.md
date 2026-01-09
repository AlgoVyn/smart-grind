# Meeting Rooms Iii

## Problem Description
You are given an integer n. There are n rooms numbered from 0 to n - 1.
You are given a 2D integer array meetings where meetings[i] = [starti, endi] means that a meeting will be held during the half-closed time interval [starti, endi). All the values of starti are unique.
Meetings are allocated to rooms in the following manner:

Each meeting will take place in the unused room with the lowest number.
If there are no available rooms, the meeting will be delayed until a room becomes free. The delayed meeting should have the same duration as the original meeting.
When a room becomes unused, meetings that have an earlier original start time should be given the room.

Return the number of the room that held the most meetings. If there are multiple rooms, return the room with the lowest number.
A half-closed interval [a, b) is the interval between a and b including a and not including b.
 
Example 1:

Input: n = 2, meetings = [[0,10],[1,5],[2,7],[3,4]]
Output: 0
Explanation:
- At time 0, both rooms are not being used. The first meeting starts in room 0.
- At time 1, only room 1 is not being used. The second meeting starts in room 1.
- At time 2, both rooms are being used. The third meeting is delayed.
- At time 3, both rooms are being used. The fourth meeting is delayed.
- At time 5, the meeting in room 1 finishes. The third meeting starts in room 1 for the time period [5,10).
- At time 10, the meetings in both rooms finish. The fourth meeting starts in room 0 for the time period [10,11).
Both rooms 0 and 1 held 2 meetings, so we return 0. 

Example 2:

Input: n = 3, meetings = [[1,20],[2,10],[3,5],[4,9],[6,8]]
Output: 1
Explanation:
- At time 1, all three rooms are not being used. The first meeting starts in room 0.
- At time 2, rooms 1 and 2 are not being used. The second meeting starts in room 1.
- At time 3, only room 2 is not being used. The third meeting starts in room 2.
- At time 4, all three rooms are being used. The fourth meeting is delayed.
- At time 5, the meeting in room 2 finishes. The fourth meeting starts in room 2 for the time period [5,10).
- At time 6, all three rooms are being used. The fifth meeting is delayed.
- At time 10, the meetings in rooms 1 and 2 finish. The fifth meeting starts in room 1 for the time period [10,12).
Room 0 held 1 meeting while rooms 1 and 2 each held 2 meetings, so we return 1. 

 
Constraints:

1 <= n <= 100
1 <= meetings.length <= 105
meetings[i].length == 2
0 <= starti < endi <= 5 * 105
All the values of starti are unique.
## Solution

```python
import heapq
from typing import List

class Solution:
    def mostBooked(self, n: int, meetings: List[List[int]]) -> int:
        meetings.sort()
        available = list(range(n))
        heapq.heapify(available)
        occupied = []  # (end_time, room)
        delayed = []  # (start, duration)
        count = [0] * n
        i = 0
        while i < len(meetings) or delayed:
            if not occupied and not delayed:
                # No occupied, process next meeting
                start, end = meetings[i]
                duration = end - start
                room = heapq.heappop(available)
                heapq.heappush(occupied, (end, room))
                count[room] += 1
                i += 1
            else:
                # Find next time
                next_time = float('inf')
                if occupied:
                    next_time = min(next_time, occupied[0][0])
                if delayed:
                    next_time = min(next_time, delayed[0][0])
                if i < len(meetings):
                    next_time = min(next_time, meetings[i][0])
                
                # Free rooms ended by next_time
                while occupied and occupied[0][0] <= next_time:
                    _, room = heapq.heappop(occupied)
                    heapq.heappush(available, room)
                
                # Assign delayed meetings if possible
                while delayed and available:
                    start, duration = heapq.heappop(delayed)
                    room = heapq.heappop(available)
                    heapq.heappush(occupied, (start + duration, room))
                    count[room] += 1
                
                # If there are meetings starting at next_time and available rooms
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
        
        max_count = max(count)
        for room in range(n):
            if count[room] == max_count:
                return room
```

## Explanation
This problem requires simulating the meeting room allocation process while handling delays and prioritizing rooms and meetings according to the rules. We use priority queues (heaps) to manage available rooms, occupied rooms, and delayed meetings efficiently.

1. Sort the meetings by their start times to process them in chronological order.
2. Initialize a min-heap for available rooms (prioritizing by room number), a min-heap for occupied rooms (prioritizing by end time), and a min-heap for delayed meetings (prioritizing by original start time).
3. Also, maintain a counter array to track the number of meetings held in each room.
4. Iterate through each meeting:
   - While there are occupied rooms that have ended (end time <= current meeting's start time), move them back to available rooms.
   - If there are available rooms, assign the one with the smallest number, increment its counter, and add it to occupied with the new end time.
   - If no available rooms, add the meeting to the delayed heap.
5. After processing all meetings, while there are delayed meetings and available rooms, assign the delayed meeting with the earliest original start time to the smallest available room.
6. Finally, find the room with the maximum number of meetings; if ties, choose the smallest room number.

Time complexity: O(n log n), where n is the number of meetings, due to sorting and heap operations (each meeting and room operation is logarithmic).
Space complexity: O(n), for the heaps and counter array.
