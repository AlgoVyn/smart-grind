# Meeting Rooms II

## Problem Description

## Pattern: Priority Queue - Minimum Meeting Rooms

This problem demonstrates algorithmic problem-solving patterns.

Given an array of meeting time intervals `intervals` where `intervals[i] = [start_i, end_i]`, return the minimum number of conference rooms required.

**Link to problem:** [Meeting Rooms II - LeetCode 253](https://leetcode.com/problems/meeting-rooms-ii/)

---

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `intervals = [[0,30],[5,10],[15,20]]` | `2` |

**Explanation:** 
- Meeting [0,30] occupies a room
- Meeting [5,10] occupies a second room (overlaps with first)
- Meeting [15,20] can reuse the room from [5,10]
- Maximum concurrent meetings = 2

**Example 2:**

| Input | Output |
|-------|--------|
| `intervals = [[7,10],[2,4]]` | `1` |

**Explanation:** Meeting [7,10] starts after [2,4] ends, so only 1 room needed.

---

## Constraints

- `1 <= intervals.length <= 10^4`
- `0 <= start_i < end_i <= 10^6`

---

## Intuition

The key insight is to track the minimum number of rooms needed at any point in time. We can think of this as tracking the maximum number of overlapping intervals at any given time.

Two main approaches:
1. **Two Pointers + Sorting**: Track start and end times separately
2. **Min-Heap**: Always keep the earliest ending meeting in a heap

---

## Solution Approaches

## Approach 1: Two Pointers with Sorted Arrays (Optimal)

This approach uses the "sweep line" concept. By sorting start times and end times separately, we can simulate adding rooms when meetings start and removing them when meetings end.

#### Algorithm

1. Extract all start times and sort them
2. Extract all end times and sort them
3. Use two pointers to iterate through both arrays
4. When a start time is less than the earliest end time, we need a new room
5. Otherwise, a meeting has ended and we can reuse a room

#### Code Implementation

````carousel
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

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minMeetingRooms(vector<vector<int>>& intervals) {
        if (intervals.empty()) return 0;
        
        // Extract and sort start times
        vector<int> starts(intervals.size());
        vector<int> ends(intervals.size());
        
        for (int i = 0; i < intervals.size(); i++) {
            starts[i] = intervals[i][0];
            ends[i] = intervals[i][1];
        }
        
        sort(starts.begin(), starts.end());
        sort(ends.begin(), ends.end());
        
        int i = 0, j = 0;
        int rooms = 0;
        int max_rooms = 0;
        
        while (i < intervals.size()) {
            if (starts[i] < ends[j]) {
                rooms++;
                max_rooms = max(max_rooms, rooms);
                i++;
            } else {
                rooms--;
                j++;
            }
        }
        
        return max_rooms;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int minMeetingRooms(int[][] intervals) {
        if (intervals == null || intervals.length == 0) return 0;
        
        int n = intervals.length;
        
        // Extract and sort start times
        int[] starts = new int[n];
        int[] ends = new int[n];
        
        for (int i = 0; i < n; i++) {
            starts[i] = intervals[i][0];
            ends[i] = intervals[i][1];
        }
        
        Arrays.sort(starts);
        Arrays.sort(ends);
        
        int i = 0, j = 0;
        int rooms = 0;
        int maxRooms = 0;
        
        while (i < n) {
            if (starts[i] < ends[j]) {
                rooms++;
                maxRooms = Math.max(maxRooms, rooms);
                i++;
            } else {
                rooms--;
                j++;
            }
        }
        
        return maxRooms;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} intervals
 * @return {number}
 */
var minMeetingRooms = function(intervals) {
    if (!intervals || intervals.length === 0) return 0;
    
    const n = intervals.length;
    
    // Extract and sort start times
    const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
    const ends = intervals.map(i => i[1]).sort((a, b) => a - b);
    
    let i = 0, j = 0;
    let rooms = 0;
    let maxRooms = 0;
    
    while (i < n) {
        if (starts[i] < ends[j]) {
            rooms++;
            maxRooms = Math.max(maxRooms, rooms);
            i++;
        } else {
            rooms--;
            j++;
        }
    }
    
    return maxRooms;
};
```
````

---

## Approach 2: Min-Heap (Alternative)

Use a min-heap to keep track of the earliest ending meeting room. For each new meeting, if the earliest ending meeting has already ended, reuse that room; otherwise, allocate a new room.

#### Code Implementation

````carousel
```python
import heapq
from typing import List

class Solution:
    def minMeetingRooms(self, intervals: List[List[int]]) -> int:
        if not intervals:
            return 0
        
        # Sort intervals by start time
        intervals.sort(key=lambda x: x[0])
        
        # Min-heap to track end times of occupied rooms
        min_heap = []
        
        for start, end in intervals:
            # If meeting starts after earliest ending, reuse room
            if min_heap and start >= min_heap[0]:
                heapq.heappop(min_heap)
            
            # Add current meeting's end time
            heapq.heappush(min_heap, end)
        
        return len(min_heap)
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <queue>
using namespace std;

class Solution {
public:
    int minMeetingRooms(vector<vector<int>>& intervals) {
        if (intervals.empty()) return 0;
        
        // Sort by start time
        sort(intervals.begin(), intervals.end(), 
             [](const vector<int>& a, const vector<int>& b) {
                 return a[0] < b[0];
             });
        
        // Min-heap for end times
        priority_queue<int, vector<int>, greater<int>> minHeap;
        
        for (const auto& interval : intervals) {
            int start = interval[0];
            int end = interval[1];
            
            if (!minHeap.empty() && start >= minHeap.top()) {
                minHeap.pop();
            }
            
            minHeap.push(end);
        }
        
        return minHeap.size();
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int minMeetingRooms(int[][] intervals) {
        if (intervals == null || intervals.length == 0) return 0;
        
        // Sort by start time
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        
        // Min-heap for end times
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        
        for (int[] interval : intervals) {
            int start = interval[0];
            int end = interval[1];
            
            if (!minHeap.isEmpty() && start >= minHeap.peek()) {
                minHeap.poll();
            }
            
            minHeap.offer(end);
        }
        
        return minHeap.size();
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} intervals
 * @return {number}
 */
var minMeetingRooms = function(intervals) {
    if (!intervals || intervals.length === 0) return 0;
    
    // Sort by start time
    intervals.sort((a, b) => a[0] - b[0]);
    
    // Min-heap for end times
    const minHeap = [];
    
    for (const [start, end] of intervals) {
        if (minHeap.length > 0 && start >= minHeap[0]) {
            heapq.heappop(minHeap);
        }
        heapq.heappush(minHeap, end);
    }
    
    return minHeap.length;
};
```
````

---

## Approach 3: Chronological Sweep with Events

Treat start and end times as events. Sort all events by time, increment room count for starts, decrement for ends.

#### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minMeetingRooms(self, intervals: List[List[int]]) -> int:
        if not intervals:
            return 0
        
        # Create events: (time, type) where type: +1 for start, -1 for end
        events = []
        for start, end in intervals:
            events.append((start, 1))
            events.append((end, -1))
        
        # Sort by time, then by type (-1 comes before +1 for same time)
        events.sort(key=lambda x: (x[0], x[1]))
        
        rooms = 0
        max_rooms = 0
        
        for time, event_type in events:
            rooms += event_type
            max_rooms = max(max_rooms, rooms)
        
        return max_rooms
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minMeetingRooms(vector<vector<int>>& intervals) {
        if (intervals.empty()) return 0;
        
        // Create events: (time, type) where type: +1 for start, -1 for end
        vector<pair<int, int>> events;
        for (const auto& interval : intervals) {
            events.push_back({interval[0], 1});   // start
            events.push_back({interval[1], -1});  // end
        }
        
        // Sort by time, then by type
        sort(events.begin(), events.end(), 
             [](const pair<int,int>& a, const pair<int,int>& b) {
                 if (a.first != b.first) return a.first < b.first;
                 return a.second < b.second;
             });
        
        int rooms = 0, max_rooms = 0;
        for (const auto& event : events) {
            rooms += event.second;
            max_rooms = max(max_rooms, rooms);
        }
        
        return max_rooms;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int minMeetingRooms(int[][] intervals) {
        if (intervals == null || intervals.length == 0) return 0;
        
        // Create events
        List<int[]> events = new ArrayList<>();
        for (int[] interval : intervals) {
            events.add(new int[]{interval[0], 1});   // start
            events.add(new int[]{interval[1], -1});  // end
        }
        
        // Sort by time, then by type
        events.sort((a, b) -> {
            if (a[0] != b[0]) return Integer.compare(a[0], b[0]);
            return Integer.compare(a[1], b[1]);
        });
        
        int rooms = 0, maxRooms = 0;
        for (int[] event : events) {
            rooms += event[1];
            maxRooms = Math.max(maxRooms, rooms);
        }
        
        return maxRooms;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} intervals
 * @return {number}
 */
var minMeetingRooms = function(intervals) {
    if (!intervals || intervals.length === 0) return 0;
    
    // Create events: [time, type]
    const events = [];
    for (const [start, end] of intervals) {
        events.push([start, 1]);   // start
        events.push([end, -1]);    // end
    }
    
    // Sort by time, then by type
    events.sort((a, b) => {
        if (a[0] !== b[0]) return a[0] - b[0];
        return a[1] - b[1];
    });
    
    let rooms = 0;
    let maxRooms = 0;
    
    for (const [time, type] of events) {
        rooms += type;
        maxRooms = Math.max(maxRooms, rooms);
    }
    
    return maxRooms;
};
```
````

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity |
|----------|-----------------|-------------------|
| Two Pointers | O(n log n) | O(n) |
| Min-Heap | O(n log n) | O(n) |
| Sweep Line | O(n log n) | O(n) |

All approaches have the same time complexity due to sorting. The space complexity is O(n) for storing the sorted arrays or heap.

---

## Comparison of Approaches

| Aspect | Two Pointers | Min-Heap | Sweep Line |
|--------|--------------|-----------|------------|
| **Intuition** | Compare earliest start with earliest end | Reuse available rooms | Count overlapping events |
| **Implementation** | Moderate | Simple | Simple |
| **Best For** | Understanding the problem | Practical coding | Event simulation |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ✅ Yes |

---

## Related Problems

### Same Category

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Meeting Rooms | [Link](https://leetcode.com/problems/meeting-rooms/) | Check if meetings can attend |
| Minimum Number of Arrows to Burst Balloons | [Link](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/) | Find minimum overlapping intervals |
| Car Pooling | [Link](https://leetcode.com/problems/car-pooling/) | Capacity tracking with intervals |

### Similar Patterns

| Problem | LeetCode Link | Related Technique |
|---------|---------------|-------------------|
| Merge Intervals | [Link](https://leetcode.com/problems/merge-intervals/) | Interval sorting |
| Insert Interval | [Link](https://leetcode.com/problems/insert-interval/) | Interval manipulation |
| Non-overlapping Intervals | [Link](https://leetcode.com/problems/non-overlapping-intervals/) | Greedy interval selection |

### Pattern Reference

For more detailed explanations of interval problems, see:
- **[Greedy - Interval Merging/Scheduling Pattern](/patterns/greedy-interval-merging-scheduling)**

---

## Video Tutorial Links

### Two Pointers Approach
- [NeetCode - Meeting Rooms II](https://www.youtube.com/watch?v=mlxY严x7v9I) - Clear explanation with visual examples
- [Back to Back SWE - Meeting Rooms II](https://www.youtube.com/watch?v=3FzN3QT75iQ) - Detailed walkthrough

### Heap-Based Approach
- [Heap Solution Explained](https://www.youtube.com/watch?v=dJWMF7HWcWQ) - Min-heap approach

### General Resources
- [LeetCode Official Solution](https://www.youtube.com/watch?v=d2bR3I32zT4) - Official problem solution
- [Interval Problems - Common Patterns](https://www.youtube.com/watch?v=ncpJRqC8T6o) - Understanding interval patterns

---

## Follow-up Questions

### Q1: How would you modify the solution to return which meetings go to which room?

**Answer:** Track the room assignment along with the end time in the heap. Use a dictionary to map meeting indices to room numbers. When reusing a room, retrieve the room number from the popped meeting.

---

### Q2: What if meetings have different priorities and you want to prioritize certain meetings?

**Answer:** Create a custom comparator that considers both start time and priority. Sort by priority first, then by start time. This ensures higher priority meetings get allocated first.

---

### Q3: How would you handle meetings that have break times in between?

**Answer:** Treat each meeting as multiple intervals: (start, break_start) and (break_end, end). Or create a more complex event system with event types for meeting start, break start, break end, and meeting end.

---

### Q4: Can you solve this with O(1) space (excluding input)?

**Answer:** The two-pointer approach requires O(n) space for sorted arrays. With a counting sort based on time range (0 to 10^6), you could achieve O(1) extra space, but this trades memory for time range constraints.

---

### Q5: How would you find the minimum number of rooms needed if meetings can be rearranged?

**Answer:** This is different from the original problem. You would use a greedy algorithm to schedule meetings: always schedule the meeting that ends earliest among available meetings. This becomes the interval scheduling maximization problem.

---

### Q6: What if you need to output the actual schedule (which room gets which meeting)?

**Answer:** Along with tracking the end time in the heap, also track the room ID. When assigning a meeting, either reuse a room (pop and push) or assign a new room ID. Store the assignment mapping.

---

### Q7: How would you handle meeting room requests with flexible start times?

**Answer:** Use a priority queue sorted by both end time and meeting flexibility. For each request, find the earliest room that can accommodate it, or delay the meeting if no room is immediately available.

---

### Q8: What edge cases should be tested?

**Answer:**
- Empty intervals array
- Single meeting
- All meetings at the same time
- All meetings non-overlapping
- Meetings with same start and end time
- Very large number of meetings
- Meetings with zero duration (start equals end)

---

## Common Pitfalls

### 1. Forgetting to Sort Both Arrays
**Issue:** Not sorting start and end times separately leads to incorrect results.

**Solution:** Always sort both arrays independently before comparing.

### 2. Not Handling Equal Times Correctly
**Issue:** When a meeting ends at the same time another starts, they can share a room.

**Solution:** Use `<` instead of `<=` for the comparison - meetings can reuse rooms when `start >= end`.

### 3. Incorrect Heap Logic
**Issue:** Not properly managing the heap when rooms are reused.

**Solution:** Always pop from heap when `start >= earliest_end` before pushing the new meeting's end time.

### 4. Forgetting Edge Cases
**Issue:** Not handling empty intervals or single meetings.

**Solution:** Add early return for empty arrays.

---

## Summary

The **Meeting Rooms II** problem is a classic interval scheduling problem that can be solved using multiple approaches:

- **Two Pointers**: Most intuitive, compare earliest start with earliest end
- **Min-Heap**: Practical approach, always reuse the room that becomes free earliest
- **Sweep Line**: Event-based counting, increment for starts, decrement for ends

The key insight is that we need to find the maximum number of overlapping intervals at any point in time. All approaches achieve O(n log n) time complexity due to sorting.

This problem is essential for understanding interval-based scheduling and is frequently asked in technical interviews.

### Pattern Summary

This problem exemplifies the **Interval Scheduling** pattern, characterized by:
- Sorting intervals by start or end times
- Tracking maximum concurrent events
- Using heaps for optimal room reuse
- Handling edge cases with equal times

For more details on interval problems, see the **[Greedy - Interval Merging/Scheduling Pattern](/patterns/greedy-interval-merging-scheduling)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/meeting-rooms-ii/discuss/) - Community solutions
- [Interval Scheduling - GeeksforGeeks](https://www.geeksforgeeks.org/activity-selection-problem-greedy-algo-1/) - Greedy approach
- [Priority Queue in Java](https://www.geeksforgeeks.org/priority-queue-in-cpp/) - Heap implementations
