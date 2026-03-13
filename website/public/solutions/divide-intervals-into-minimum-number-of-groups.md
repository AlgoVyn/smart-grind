# Divide Intervals Into Minimum Number Of Groups

## Problem Description

You are given a 2D integer array intervals where intervals[i] = [lefti, righti] represents the inclusive interval [lefti, righti].
You have to divide the intervals into one or more groups such that each interval is in exactly one group, and no two intervals that are in the same group intersect each other.
Return the minimum number of groups you need to make.
Two intervals intersect if there is at least one common number between them. For example, the intervals [1, 5] and [5, 8] intersect.

**LeetCode Link:** [Divide Intervals Into Minimum Number of Groups - LeetCode 2406](https://leetcode.com/problems/divide-intervals-into-minimum-number-of-groups/)

---

## Examples

### Example 1:

**Input:**
```python
intervals = [[5,10],[6,8],[1,5],[2,3],[1,10]]
```

**Output:**
```python
3
```

---

## Constraints

- `1 <= intervals.length <= 10^5`
- `intervals[i].length == 2`
- `1 <= lefti <= righti <= 10^6`

---

## Pattern: Heap-based Interval Scheduling

This problem follows the **Heap-based Interval Scheduling** pattern for finding minimum number of non-overlapping groups.

### Core Concept

- **Maximum Overlap**: Find maximum number of overlapping intervals at any point
- **Min-Heap Tracking**: Use min-heap to track active interval end times
- **Greedy Grouping**: Assign intervals to groups when possible, create new group when needed

### When to Use This Pattern

This pattern is applicable when:
1. Finding minimum number of resources/rooms needed
2. Interval partitioning problems
3. Scheduling with resource constraints

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Meeting Rooms | Similar interval allocation |
| Priority Queue | For tracking active intervals |
| Sweep Line | Alternative event-based approach |

### Pattern Summary

This problem exemplifies **Interval Partitioning**, characterized by:
- Finding maximum number of overlapping intervals
- Using heap to track active intervals
- Maximum overlap = minimum groups needed

---

## Intuition

The key insight is that this problem is equivalent to finding the **maximum number of overlapping intervals** at any point in time. If at some point k intervals overlap, we need at least k groups.

### Key Observations

1. **Overlap Counting**: When intervals overlap, they cannot be in the same group
2. **Sorting Helps**: Sorting by start time allows us to process intervals in order
3. **Heap for Active Intervals**: A min-heap tracking end times tells us which intervals have finished
4. **Group Size = Max Overlap**: The maximum number of active intervals at any time equals minimum groups needed

### Algorithm Overview

1. Sort intervals by start time
2. Use a min-heap to track end times of currently active intervals
3. For each interval, remove expired intervals from heap (those that ended before current starts)
4. Add current interval's end time to heap
5. Track maximum heap size - this is our answer

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Min-Heap Approach** - Track active intervals with heap
2. **Sweep Line** - Event-based counting approach

---

## Approach 1: Min-Heap (Optimal)

### Algorithm Steps

1. Sort intervals by start time
2. Initialize an empty min-heap to store end times
3. For each interval:
   - Remove from heap all intervals that ended before current start (heap[0] < start)
   - Add current interval's end time to heap
   - Track maximum heap size
4. Return maximum heap size

### Why It Works

The heap always contains intervals that are currently active (overlapping). The size of the heap represents how many intervals overlap at the current point. The maximum size throughout the process equals the minimum number of groups needed.

### Code Implementation

````carousel
```python
from typing import List
import heapq

class Solution:
    def minGroups(self, intervals: List[List[int]]) -> int:
        """
        Find minimum number of groups using min-heap.
        
        Args:
            intervals: List of [start, end] intervals
            
        Returns:
            Minimum number of groups needed
        """
        if not intervals:
            return 0
        
        # Sort by start time
        intervals.sort(key=lambda x: x[0])
        
        heap = []  # Min-heap of end times
        max_groups = 0
        
        for start, end in intervals:
            # Remove intervals that have ended before current starts
            # Note: use < not <= since [1,5] and [5,8] intersect
            while heap and heap[0] < start:
                heapq.heappop(heap)
            
            # Add current interval
            heapq.heappush(heap, end)
            
            # Track maximum overlap
            max_groups = max(max_groups, len(heap))
        
        return max_groups
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
#include <queue>
using namespace std;

class Solution {
public:
    int minGroups(vector<vector<int>>& intervals) {
        if (intervals.empty()) return 0;
        
        // Sort by start time
        sort(intervals.begin(), intervals.end(), 
             [](const vector<int>& a, const vector<int>& b) {
                 return a[0] < b[0];
             });
        
        priority_queue<int, vector<int>, greater<int>> heap;
        int maxGroups = 0;
        
        for (const auto& interval : intervals) {
            int start = interval[0];
            int end = interval[1];
            
            // Remove intervals that have ended
            while (!heap.empty() && heap.top() < start) {
                heap.pop();
            }
            
            // Add current interval
            heap.push(end);
            
            // Track maximum
            maxGroups = max(maxGroups, (int)heap.size());
        }
        
        return maxGroups;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int minGroups(int[][] intervals) {
        if (intervals == null || intervals.length == 0) {
            return 0;
        }
        
        // Sort by start time
        Arrays.sort(intervals, (a, b) -> a[0] - b[0]);
        
        PriorityQueue<Integer> heap = new PriorityQueue<>();
        int maxGroups = 0;
        
        for (int[] interval : intervals) {
            int start = interval[0];
            int end = interval[1];
            
            // Remove intervals that have ended
            while (!heap.isEmpty() && heap.peek() < start) {
                heap.poll();
            }
            
            // Add current interval
            heap.add(end);
            
            // Track maximum
            maxGroups = Math.max(maxGroups, heap.size());
        }
        
        return maxGroups;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} intervals
 * @return {number}
 */
var minGroups = function(intervals) {
    if (!intervals || intervals.length === 0) {
        return 0;
    }
    
    // Sort by start time
    intervals.sort((a, b) => a[0] - b[0]);
    
    const heap = [];
    let maxGroups = 0;
    
    for (const [start, end] of intervals) {
        // Remove intervals that have ended
        while (heap.length > 0 && heap[0] < start) {
            heap.shift();  // Since we don't have heap pop in JS for min-heap
            heap.sort((a, b) => a - b);  // Re-sort (inefficient but works)
        }
        
        // For better performance, use a proper heap implementation
        // Here using array with binary heap operations
        heap.push(end);
        heap.sort((a, b) => a - b);
        
        maxGroups = Math.max(maxGroups, heap.length);
    }
    
    return maxGroups;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - sorting + heap operations |
| **Space** | O(n) - worst case heap size |

---

## Approach 2: Sweep Line

### Algorithm Steps

1. Create two arrays: one for start events, one for end events
2. Sort starts in ascending order, ends in ascending order
3. Use two pointers to traverse both arrays
4. For each start event, increment current overlap count
5. For each end event (where end < start), decrement overlap count
6. Track maximum overlap

### Why It Works

This is an alternative approach using the sweep line algorithm. We treat interval starts as "+1" events and interval ends as "-1" events. The maximum cumulative count gives us the answer.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minGroups(self, intervals: List[List[int]]) -> int:
        """Sweep line approach."""
        if not intervals:
            return 0
        
        # Extract all start and end points
        starts = sorted([i[0] for i in intervals])
        ends = sorted([i[1] for i in intervals])
        
        max_overlap = 0
        current_overlap = 0
        i = 0  # pointer for starts
        
        for start in starts:
            # Move end pointer while end < start (intervals don't overlap)
            while i < len(ends) and ends[i] < start:
                current_overlap -= 1
                i += 1
            
            # Add current start
            current_overlap += 1
            
            # Track maximum
            max_overlap = max(max_overlap, current_overlap)
        
        return max_overlap
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int minGroups(vector<vector<int>>& intervals) {
        if (intervals.empty()) return 0;
        
        vector<int> starts, ends;
        for (const auto& interval : intervals) {
            starts.push_back(interval[0]);
            ends.push_back(interval[1]);
        }
        
        sort(starts.begin(), ends.end());
        sort(ends.begin(), ends.end());
        
        int maxOverlap = 0;
        int currentOverlap = 0;
        int i = 0;
        
        for (int start : starts) {
            while (i < ends.size() && ends[i] < start) {
                currentOverlap--;
                i++;
            }
            currentOverlap++;
            maxOverlap = max(maxOverlap, currentOverlap);
        }
        
        return maxOverlap;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int minGroups(int[][] intervals) {
        if (intervals == null || intervals.length == 0) {
            return 0;
        }
        
        int[] starts = new int[intervals.length];
        int[] ends = new int[intervals.length];
        
        for (int i = 0; i < intervals.length; i++) {
            starts[i] = intervals[i][0];
            ends[i] = intervals[i][1];
        }
        
        Arrays.sort(starts);
        Arrays.sort(ends);
        
        int maxOverlap = 0;
        int currentOverlap = 0;
        int i = 0;
        
        for (int start : starts) {
            while (i < ends.length && ends[i] < start) {
                currentOverlap--;
                i++;
            }
            currentOverlap++;
            maxOverlap = Math.max(maxOverlap, currentOverlap);
        }
        
        return maxOverlap;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} intervals
 * @return {number}
 */
var minGroups = function(intervals) {
    if (!intervals || intervals.length === 0) {
        return 0;
    }
    
    const starts = intervals.map(i => i[0]).sort((a, b) => a - b);
    const ends = intervals.map(i => i[1]).sort((a, b) => a - b);
    
    let maxOverlap = 0;
    let currentOverlap = 0;
    let i = 0;
    
    for (const start of starts) {
        while (i < ends.length && ends[i] < start) {
            currentOverlap--;
            i++;
        }
        currentOverlap++;
        maxOverlap = Math.max(maxOverlap, currentOverlap);
    }
    
    return maxOverlap;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) - sorting both arrays |
| **Space** | O(n) - for storing starts and ends |

---

## Comparison of Approaches

| Aspect | Min-Heap | Sweep Line |
|--------|----------|------------|
| **Time Complexity** | O(n log n) | O(n log n) |
| **Space Complexity** | O(n) | O(n) |
| **Implementation** | Simple | Moderate |
| **Recommended** | ✅ | ✅ |

**Best Approach:** Either approach works. Use Approach 1 (Min-Heap) for clarity.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Amazon, Google, Microsoft
- **Difficulty**: Medium
- **Concepts Tested**: Heap, Interval Scheduling, Greedy Algorithms

### Learning Outcomes

1. **Heap Application**: Master using heaps for interval problems
2. **Greedy Thinking**: Understand optimal grouping strategy
3. **Maximum Overlap**: Learn to find maximum concurrent events

---

## Related Problems

Based on similar themes (Interval Scheduling):

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Meeting Rooms II | [Link](https://leetcode.com/problems/meeting-rooms-ii/) | Minimum meeting rooms |
| Non-overlapping Intervals | [Link](https://leetcode.com/problems/non-overlapping-intervals/) | Interval scheduling |
| Minimum Number of Arrows | [Link](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/) | Balloon shooting |

### Pattern Reference

For more detailed explanations, see:
- **[Greedy Algorithms](/patterns/greedy)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Divide Intervals](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Clear explanation
2. **[Meeting Rooms II Tutorial](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Similar problem
3. **[Interval Scheduling](https://www.youtube.com/watch?v=8grsX-cB0jU)** - Greedy algorithms

---

## Follow-up Questions

### Q1: How would you modify to handle intervals that don't intersect at endpoints?

**Answer:** Change the condition from `heap[0] < start` to `heap[0] <= start`.

---

### Q2: How would you track which intervals go to which group?

**Answer:** Store the group assignment along with the end time in the heap, or maintain a separate data structure mapping intervals to groups.

---

### Q3: What's the relationship to the "Meeting Rooms II" problem?

**Answer:** They're essentially the same problem. Meeting Rooms II asks for minimum rooms; this asks for minimum groups.

---

## Common Pitfalls

### 1. Not Removing Expired Intervals
**Issue:** Heap contains intervals that have already ended.

**Solution:** Remove intervals from heap where end < current start.

### 2. Wrong Comparison Operator
**Issue:** Using <= instead of < for interval end check.

**Solution:** Intervals that end exactly when next starts don't overlap (they intersect at the endpoint).

### 3. Not Sorting by Start Time
**Issue:** Processing intervals in wrong order.

**Solution:** Always sort intervals by start time first.

---

## Summary

The **Divide Intervals Into Minimum Number of Groups** problem can be solved efficiently using a min-heap approach:

- **Key Insight**: The minimum number of groups equals the maximum number of overlapping intervals at any point
- **Approach**: Sort intervals by start time, use min-heap to track active intervals
- **Time Complexity**: O(n log n) - sorting + heap operations
- **Space Complexity**: O(n) - worst case heap size

This is the same pattern as "Meeting Rooms II" and is useful for resource allocation problems.

### Pattern Summary

This problem exemplifies **Interval Partitioning**, characterized by:
- Finding maximum number of overlapping intervals
- Using heap to track active intervals
- Maximum overlap = minimum groups needed

For more details on this pattern, see the **[Greedy Algorithms](/patterns/greedy)** pattern.

---

## Additional Resources

- [LeetCode Problem 2406](https://leetcode.com/problems/divide-intervals-into-minimum-number-of-groups/) - Official problem page
- [Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/) - Similar problem
- [Interval Scheduling - GeeksforGeeks](https://www.geeksforgeeks.org/interval-scheduling/) - Theory
- [Pattern: Greedy](/patterns/greedy) - Comprehensive pattern guide
