# Meeting Rooms III

## Problem Description

You are given an integer `n` representing `n` rooms numbered from `0` to `n - 1`. You are given a 2D integer array `meetings` where `meetings[i] = [start_i, end_i]`, meaning a meeting will be held during the half-closed interval `[start_i, end_i)`. All `start_i` values are unique.

### Allocation Rules

- Each meeting takes place in the **unused room with the lowest number**.
- If no rooms are available, the meeting is **delayed** until a room becomes free. The delayed meeting keeps its original duration.
- When a room becomes unused, meetings with **earlier original start times** are given priority.

Return the number of the room that held the most meetings. If multiple rooms have the same count, return the room with the **lowest number**.

> **Note:** A half-closed interval `[a, b)` includes `a` but excludes `b`.

**LeetCode Link:** [Meeting Rooms III - LeetCode 2392](https://leetcode.com/problems/meeting-rooms-iii/)

---

## Pattern:

Heap-based Event Simulation

This problem uses a **heap-based simulation** with multiple priority queues to manage room allocation. We maintain:
- Available rooms (min-heap by room number)
- Occupied rooms (min-heap by end time)
- Delayed meetings (min-heap by original start time)

## Common Pitfalls

- **Wrong priority for available rooms**: Available rooms should be allocated by lowest room number (not earliest free time).
- **Delayed meeting priority**: Delayed meetings should be processed by original start time, not by when they were delayed.
- **Handling time correctly**: Use the minimum of next occupied end time, next meeting start time, and next delayed meeting time as the next time point.
- **Processing order**: Free rooms first, then process delayed meetings, then start new meetings at that time.
- **Meeting duration**: When delaying, preserve the original duration, not recalculate from current time.

---

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

## Intuition

This problem simulates meeting room allocation with complex priority rules:

### Key Observations

1. **Available Room Priority**: Always allocate the room with the **lowest number** when available
2. **Delay Handling**: When no rooms are free, meetings are delayed with their **original duration preserved**
3. **Delayed Meeting Priority**: Delayed meetings are processed by **original start time** (not when they were delayed)
4. **Time Progression**: Process events in chronological order, handling room releases, delayed meetings, and new meetings

### Algorithm Overview

1. **Three priority queues**:
   - Available rooms: min-heap by room number
   - Occupied rooms: min-heap by end time
   - Delayed meetings: min-heap by original start time
2. **Track meeting counts** per room
3. **Process events**:
   - Free rooms that ended
   - Assign delayed meetings first
   - Start new meetings if rooms available
   - Delay remaining meetings
4. **Return room** with most meetings (lowest number on ties)

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Heap-based Simulation** - Optimal solution
2. **Array-based Simulation** - Alternative approach

---

## Approach 1: Heap-based Simulation (Optimal)

### Code Implementation

````carousel
```python
import heapq
from typing import List

class Solution:
    def mostBooked(self, n: int, meetings: List[List[int]]) -> int:
        """
        Find the room that holds the most meetings using heap simulation.
        
        Time Complexity: O(m log n) where m = number of meetings
        Space Complexity: O(n + m) for heaps and counters
        """
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

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

class Solution {
public:
    int mostBooked(int n, vector<vector<int>>& meetings) {
        sort(meetings.begin(), meetings.end());
        
        // Available rooms
        priority_queue<int, vector<int>, greater<int>> available;
        for (int i = 0; i < n; i++) available.push(i);
        
        // Occupied: (end_time, room)
        priority_queue<pair<long long, int>, vector<pair<long long, int>>, greater<pair<long long, int>>> occupied;
        // Delayed: (start_time, duration)
        priority_queue<pair<long long, long long>, vector<pair<long long, long long>>, greater<pair<long long, long long>>> delayed;
        
        vector<long long> count(n, 0);
        int i = 0;
        
        while (i < meetings.size() || !delayed.empty()) {
            if (occupied.empty() && delayed.empty()) {
                long long start = meetings[i][0], end = meetings[i][1];
                long long duration = end - start;
                int room = available.top(); available.pop();
                occupied.push({end, room});
                count[room]++;
                i++;
            } else {
                long long next_time = LLONG_MAX;
                if (!occupied.empty()) next_time = min(next_time, occupied.top().first);
                if (!delayed.empty()) next_time = min(next_time, delayed.top().first);
                if (i < meetings.size()) next_time = min(next_time, (long long)meetings[i][0]);
                
                while (!occupied.empty() && occupied.top().first <= next_time) {
                    auto [end, room] = occupied.top(); occupied.pop();
                    available.push(room);
                }
                
                while (!delayed.empty() && !available.empty()) {
                    auto [start, duration] = delayed.top(); delayed.pop();
                    int room = available.top(); available.pop();
                    occupied.push({start + duration, room});
                    count[room]++;
                }
                
                while (i < meetings.size() && meetings[i][0] == next_time && !available.empty()) {
                    long long start = meetings[i][0], end = meetings[i][1];
                    long long duration = end - start;
                    int room = available.top(); available.pop();
                    occupied.push({end, room});
                    count[room]++;
                    i++;
                }
                
                while (i < meetings.size() && meetings[i][0] == next_time) {
                    long long start = meetings[i][0], end = meetings[i][1];
                    delayed.push({start, end - start});
                    i++;
                }
            }
        }
        
        long long max_count = 0;
        int result = 0;
        for (int room = 0; room < n; room++) {
            if (count[room] > max_count) {
                max_count = count[room];
                result = room;
            }
        }
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int mostBooked(int n, int[][] meetings) {
        Arrays.sort(meetings, Comparator.comparingInt(a -> a[0]));
        
        // Available rooms
        PriorityQueue<Integer> available = new PriorityQueue<>();
        for (int i = 0; i < n; i++) available.add(i);
        
        // Occupied: (end_time, room)
        PriorityQueue<long[]> occupied = new PriorityQueue<>(Comparator.comparingLong(a -> a[0]));
        // Delayed: (start_time, duration)
        PriorityQueue<long[]> delayed = new PriorityQueue<>(Comparator.comparingLong(a -> a[0]));
        
        long[] count = new long[n];
        int i = 0;
        
        while (i < meetings.length || !delayed.isEmpty()) {
            if (occupied.isEmpty() && delayed.isEmpty()) {
                long start = meetings[i][0], end = meetings[i][1];
                long duration = end - start;
                int room = available.poll();
                occupied.add(new long[]{end, room});
                count[room]++;
                i++;
            } else {
                long next_time = Long.MAX_VALUE;
                if (!occupied.isEmpty()) next_time = Math.min(next_time, occupied.peek()[0]);
                if (!delayed.isEmpty()) next_time = Math.min(next_time, delayed.peek()[0]);
                if (i < meetings.length) next_time = Math.min(next_time, (long)meetings[i][0]);
                
                while (!occupied.isEmpty() && occupied.peek()[0] <= next_time) {
                    long[] o = occupied.poll();
                    available.add((int)o[1]);
                }
                
                while (!delayed.isEmpty() && !available.isEmpty()) {
                    long[] d = delayed.poll();
                    int room = available.poll();
                    occupied.add(new long[]{d[0] + d[1], room});
                    count[room]++;
                }
                
                while (i < meetings.length && meetings[i][0] == next_time && !available.isEmpty()) {
                    long start = meetings[i][0], end = meetings[i][1];
                    long duration = end - start;
                    int room = available.poll();
                    occupied.add(new long[]{end, room});
                    count[room]++;
                    i++;
                }
                
                while (i < meetings.length && meetings[i][0] == next_time) {
                    long start = meetings[i][0], end = meetings[i][1];
                    delayed.add(new long[]{start, end - start});
                    i++;
                }
            }
        }
        
        long max_count = 0;
        int result = 0;
        for (int room = 0; room < n; room++) {
            if (count[room] > max_count) {
                max_count = count[room];
                result = room;
            }
        }
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @param {number[][]} meetings
 * @return {number}
 */
var mostBooked = function(n, meetings) {
    meetings.sort((a, b) => a[0] - b[0]);
    
    // Available rooms
    const available = new MinPriorityQueue();
    for (let i = 0; i < n; i++) available.enqueue(i, i);
    
    // Occupied: (end_time, room)
    const occupied = new MinPriorityQueue();
    // Delayed: (start_time, duration)
    const delayed = new MinPriorityQueue();
    
    const count = new Array(n).fill(0);
    let i = 0;
    
    while (i < meetings.length || !delayed.isEmpty()) {
        if (occupied.isEmpty() && delayed.isEmpty()) {
            const [start, end] = meetings[i];
            const duration = end - start;
            const room = available.dequeue().element;
            occupied.enqueue({end, room}, end);
            count[room]++;
            i++;
        } else {
            let next_time = Infinity;
            if (!occupied.isEmpty()) next_time = Math.min(next_time, occupied.front().priority);
            if (!delayed.isEmpty()) next_time = Math.min(next_time, delayed.front().priority);
            if (i < meetings.length) next_time = Math.min(next_time, meetings[i][0]);
            
            while (!occupied.isEmpty() && occupied.front().priority <= next_time) {
                const {end, room} = occupied.dequeue().element;
                available.enqueue(room, room);
            }
            
            while (!delayed.isEmpty() && !available.isEmpty()) {
                const {element: {0: start, 1: duration}} = delayed.dequeue();
                const room = available.dequeue().element;
                occupied.enqueue({end: start + duration, room}, start + duration);
                count[room]++;
            }
            
            while (i < meetings.length && meetings[i][0] === next_time && !available.isEmpty()) {
                const [start, end] = meetings[i];
                const duration = end - start;
                const room = available.dequeue().element;
                occupied.enqueue({end, room}, end);
                count[room]++;
                i++;
            }
            
            while (i < meetings.length && meetings[i][0] === next_time) {
                const [start, end] = meetings[i];
                delayed.enqueue({0: start, 1: end - start}, start);
                i++;
            }
        }
    }
    
    let max_count = 0;
    let result = 0;
    for (let room = 0; room < n; room++) {
        if (count[room] > max_count) {
            max_count = count[room];
            result = room;
        }
    }
    return result;
};
```
````

---

## Approach 2: Array-based Simulation

This approach uses arrays and sorting instead of heaps. It's conceptually simpler but less efficient.

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict

class Solution:
    def mostBooked(self, n: int, meetings: List[List[int]]) -> int:
        """
        Find the room that holds the most meetings using array simulation.
        
        Time Complexity: O(m²) in worst case
        Space Complexity: O(n + m)
        """
        # Sort meetings by start time
        meetings.sort()
        
        # Track room end times
        room_end = [0] * n
        # Track meeting count per room
        count = [0] * n
        
        for start, end in meetings:
            duration = end - start
            earliest_room = -1
            earliest_end = float('inf')
            
            # Find the earliest available room
            for room in range(n):
                if room_end[room] <= start:
                    earliest_room = room
                    break
                if room_end[room] < earliest_end:
                    earliest_end = room_end[room]
                    earliest_room = room
            
            if room_end[earliest_room] <= start:
                # Room is available, use it
                room_end[earliest_room] = end
            else:
                # Room is occupied, delay the meeting
                room_end[earliest_room] = earliest_end + duration
            
            count[earliest_room] += 1
        
        # Find room with maximum meetings (lowest room number on ties)
        max_count = max(count)
        for room in range(n):
            if count[room] == max_count:
                return room
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <climits>
using namespace std;

class Solution {
public:
    int mostBooked(int n, vector<vector<int>>& meetings) {
        sort(meetings.begin(), meetings.end());
        
        // Track room end times
        vector<long long> roomEnd(n, 0);
        // Track meeting count per room
        vector<int> count(n, 0);
        
        for (const auto& meeting : meetings) {
            long long start = meeting[0];
            long long end = meeting[1];
            long long duration = end - start;
            
            int earliestRoom = -1;
            long long earliestEnd = LLONG_MAX;
            
            // Find the earliest available room
            for (int room = 0; room < n; room++) {
                if (roomEnd[room] <= start) {
                    earliestRoom = room;
                    break;
                }
                if (roomEnd[room] < earliestEnd) {
                    earliestEnd = roomEnd[room];
                    earliestRoom = room;
                }
            }
            
            if (roomEnd[earliestRoom] <= start) {
                roomEnd[earliestRoom] = end;
            } else {
                roomEnd[earliestRoom] = earliestEnd + duration;
            }
            
            count[earliestRoom]++;
        }
        
        // Find room with maximum meetings
        int maxCount = 0;
        int result = 0;
        for (int room = 0; room < n; room++) {
            if (count[room] > maxCount) {
                maxCount = count[room];
                result = room;
            }
        }
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int mostBooked(int n, int[][] meetings) {
        Arrays.sort(meetings, Comparator.comparingInt(a -> a[0]));
        
        // Track room end times
        long[] roomEnd = new long[n];
        // Track meeting count per room
        int[] count = new int[n];
        
        for (int[] meeting : meetings) {
            long start = meeting[0];
            long end = meeting[1];
            long duration = end - start;
            
            int earliestRoom = -1;
            long earliestEnd = Long.MAX_VALUE;
            
            // Find the earliest available room
            for (int room = 0; room < n; room++) {
                if (roomEnd[room] <= start) {
                    earliestRoom = room;
                    break;
                }
                if (roomEnd[room] < earliestEnd) {
                    earliestEnd = roomEnd[room];
                    earliestRoom = room;
                }
            }
            
            if (roomEnd[earliestRoom] <= start) {
                roomEnd[earliestRoom] = end;
            } else {
                roomEnd[earliestRoom] = earliestEnd + duration;
            }
            
            count[earliestRoom]++;
        }
        
        // Find room with maximum meetings
        int maxCount = 0;
        int result = 0;
        for (int room = 0; room < n; room++) {
            if (count[room] > maxCount) {
                maxCount = count[room];
                result = room;
            }
        }
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @param {number[][]} meetings
 * @return {number}
 */
var mostBooked = function(n, meetings) {
    meetings.sort((a, b) => a[0] - b[0]);
    
    // Track room end times
    const roomEnd = new Array(n).fill(0);
    // Track meeting count per room
    const count = new Array(n).fill(0);
    
    for (const [start, end] of meetings) {
        const duration = end - start;
        
        let earliestRoom = -1;
        let earliestEnd = Infinity;
        
        // Find the earliest available room
        for (let room = 0; room < n; room++) {
            if (roomEnd[room] <= start) {
                earliestRoom = room;
                break;
            }
            if (roomEnd[room] < earliestEnd) {
                earliestEnd = roomEnd[room];
                earliestRoom = room;
            }
        }
        
        if (roomEnd[earliestRoom] <= start) {
            roomEnd[earliestRoom] = end;
        } else {
            roomEnd[earliestRoom] = earliestEnd + duration;
        }
        
        count[earliestRoom]++;
    }
    
    // Find room with maximum meetings
    let maxCount = 0;
    let result = 0;
    for (let room = 0; room < n; room++) {
        if (count[room] > maxCount) {
            maxCount = count[room];
            result = room;
        }
    }
    return result;
};
```
````

### Complexity Analysis

| Metric | Heap-based | Array-based |
|--------|------------|-------------|
| Time | O(m log n) | O(m × n) |
| Space | O(n + m) | O(n + m) |
| Recommended | ✅ Yes | ❌ No |

---

## Complexity Analysis

| Metric | Complexity |
|--------|------------|
| Time | `O(m log n)` — where `m` is the number of meetings (sorting + heap operations) |
| Space | `O(n + m)` — for heaps and counter array |

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Google, Amazon
- **Difficulty**: Hard
- **Concepts Tested**: Heap/priority queue simulation, Event-driven programming

### Learning Outcomes

1. **Multiple Priority Queues**: Managing different priority orders simultaneously
2. **Event Simulation**: Handling time-based events efficiently
3. **Complex Prioritization**: Implementing nuanced scheduling rules

---

## Summary

The **Meeting Rooms III** problem demonstrates **heap-based event simulation**:

- **Three heaps** for different purposes (available, occupied, delayed)
- **Time progression** through significant events
- **Priority rules** for room allocation and meeting scheduling

Key takeaways:
1. Use separate heaps for different priorities
2. Process events in chronological order
3. Handle edge cases (no rooms available, all rooms occupied)

This problem is essential for understanding event-driven simulations with complex constraints.

---

## Video Tutorial Links

1. **[Meeting Rooms III - NeetCode](https://www.youtube.com/watch?v=)** - Clear explanation
2. **[Heap Simulation Patterns](https://www.youtube.com/watch?v=)** - Understanding heap-based simulation

---

## Follow-up Questions

### Q1: How would you modify to track total idle time per room?

**Answer:** Track the time intervals when rooms are idle (between meetings).

### Q2: What if meetings could be moved to different rooms?

**Answer:** Would require additional tracking and optimization criteria.

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Meeting Rooms II | [Link](https://leetcode.com/problems/meeting-rooms-ii/) | Room count calculation |
| Meeting Scheduler | [Link](https://leetcode.com/problems/meeting-scheduler/) | Similar scheduling |
