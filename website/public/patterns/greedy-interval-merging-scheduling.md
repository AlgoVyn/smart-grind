# Greedy - Interval Merging/Scheduling

## Overview

The **Interval Merging/Scheduling** pattern is a classic greedy algorithm problem where we need to merge overlapping intervals or schedule non-overlapping intervals optimally. This pattern is fundamental in computational geometry, resource allocation, and event scheduling problems.

---

## Pattern Description

Given a collection of intervals (each defined by a start and end time), the goal is typically to:
1. **Merge all overlapping intervals** into a single set of non-overlapping intervals
2. **Find the minimum number of intervals** needed to cover all time points
3. **Schedule maximum number of non-overlapping intervals** (Activity Selection)
4. **Find minimum meeting rooms** required for scheduling

### Core Characteristics

- **Input**: Array of intervals `[[start1, end1], [start2, end2], ...]`
- **Output**: Merged intervals or maximum count of non-overlapping intervals
- **Key Insight**: Sort intervals by start time, then make greedy decisions locally

---

## When to Use This Pattern

Use this pattern when you encounter problems involving:
- Merging overlapping intervals
- Scheduling maximum non-overlapping events
- Finding minimum resources (rooms, tracks) needed
- Identifying conflicting meetings/events
- Range consolidation problems

---

## Intuition & Core Concept

### Why Greedy Works Here

The greedy approach works for interval problems because:

1. **Sorting by Start Time**: Once intervals are sorted by start time, we can process them sequentially
2. **Local Optimal Decision**: At each step, we make a locally optimal choice (merge with current or start new)
3. **No Backtracking Needed**: The sorted order ensures we never need to revisit previous decisions
4. **Optimal Substructure**: The optimal solution can be built from optimal solutions of subproblems

### Key Observations

- If interval A ends before interval B starts, they don't overlap
- If interval A overlaps with B (A.start <= B.end AND B.start <= A.end), they should be merged
- The merged interval's start is min(A.start, B.start), end is max(A.end, B.end)

---

## Multiple Approaches

### Approach 1: Standard Merge (Most Common)

This is the classic approach for merging overlapping intervals.

### Algorithm Steps

1. **Sort intervals** by start time
2. **Initialize** result with first interval
3. **Iterate** through remaining intervals:
   - If current interval overlaps with last merged interval → extend the last interval
   - Otherwise → add current interval as new merged interval

### Code Implementation

````carousel
```python
from typing import List

def merge(intervals: List[List[int]]) -> List[List[int]]:
    """
    Merge all overlapping intervals.
    
    Args:
        intervals: List of [start, end] intervals
        
    Returns:
        List of merged non-overlapping intervals
    """
    if not intervals:
        return []
    
    # Step 1: Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    # Step 2: Initialize result with first interval
    merged = [intervals[0]]
    
    # Step 3: Iterate through remaining intervals
    for current in intervals[1:]:
        # Get last merged interval
        last = merged[-1]
        
        # Check if current overlaps with last
        if current[0] <= last[1]:
            # Merge: extend the end
            last[1] = max(last[1], current[1])
        else:
            # No overlap: add as new interval
            merged.append(current)
    
    return merged


def merge_intervals_template(intervals: List[List[int]]) -> List[List[int]]:
    """
    Template for interval merging problems.
    
    Time Complexity: O(n log n) for sorting
    Space Complexity: O(n) for result storage
    """
    if len(intervals) <= 1:
        return intervals
    
    # Sort by start time (key insight)
    intervals.sort(key=lambda x: x[0])
    
    result = [intervals[0]]
    
    for start, end in intervals[1:]:
        prev_start, prev_end = result[-1]
        
        if start <= prev_end:  # Overlapping
            result[-1] = [prev_start, max(prev_end, end)]
        else:  # Non-overlapping
            result.append([start, end])
    
    return result
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    /**
     * Merge all overlapping intervals.
     * 
     * @param intervals - Vector of [start, end] intervals
     * @return Vector of merged non-overlapping intervals
     */
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        if (intervals.empty()) {
            return {};
        }
        
        // Step 1: Sort by start time
        sort(intervals.begin(), intervals.end(), 
             [](const vector<int>& a, const vector<int>& b) {
                 return a[0] < b[0];
             });
        
        // Step 2: Initialize result with first interval
        vector<vector<int>> merged;
        merged.push_back(intervals[0]);
        
        // Step 3: Iterate through remaining intervals
        for (size_t i = 1; i < intervals.size(); i++) {
            vector<int>& last = merged.back();
            const vector<int>& current = intervals[i];
            
            // Check if current overlaps with last
            if (current[0] <= last[1]) {
                // Merge: extend the end
                last[1] = max(last[1], current[1]);
            } else {
                // No overlap: add as new interval
                merged.push_back(current);
            }
        }
        
        return merged;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    /**
     * Merge all overlapping intervals.
     * 
     * @param intervals - List of [start, end] intervals
     * @return List of merged non-overlapping intervals
     */
    public int[][] merge(int[][] intervals) {
        if (intervals == null || intervals.length == 0) {
            return new int[0][];
        }
        
        // Step 1: Sort by start time
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        
        // Step 2: Initialize result list
        List<int[]> merged = new ArrayList<>();
        merged.add(intervals[0]);
        
        // Step 3: Iterate through remaining intervals
        for (int i = 1; i < intervals.length; i++) {
            int[] last = merged.get(merged.size() - 1);
            int[] current = intervals[i];
            
            // Check if current overlaps with last
            if (current[0] <= last[1]) {
                // Merge: extend the end
                last[1] = Math.max(last[1], current[1]);
            } else {
                // No overlap: add as new interval
                merged.add(current);
            }
        }
        
        return merged.toArray(new int[0][]);
    }
}
```

<!-- slide -->
```javascript
/**
 * Merge all overlapping intervals.
 * 
 * @param {number[][]} intervals - Array of [start, end] intervals
 * @return {number[][]} - Array of merged non-overlapping intervals
 */
function merge(intervals) {
    if (!intervals || intervals.length === 0) {
        return [];
    }
    
    // Step 1: Sort by start time
    intervals.sort((a, b) => a[0] - b[0]);
    
    // Step 2: Initialize result with first interval
    const merged = [intervals[0]];
    
    // Step 3: Iterate through remaining intervals
    for (let i = 1; i < intervals.length; i++) {
        const last = merged[merged.length - 1];
        const current = intervals[i];
        
        // Check if current overlaps with last
        if (current[0] <= last[1]) {
            // Merge: extend the end
            last[1] = Math.max(last[1], current[1]);
        } else {
            // No overlap: add as new interval
            merged.push(current);
        }
    }
    
    return merged;
}
```
````

---

### Approach 2: Insert Interval (Variant)

When inserting a new interval into an already merged set of intervals.

### Algorithm Steps

1. **Find position** where new interval should be inserted (based on start)
2. **Add all intervals** before the new interval
3. **Merge overlapping intervals** with the new interval
4. **Add remaining intervals** after the merged result

### Code Implementation

````carousel
```python
from typing import List

def insert(intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
    """
    Insert newInterval into intervals and merge overlapping intervals.
    
    Args:
        intervals: Sorted list of non-overlapping intervals
        newInterval: New interval to insert
        
    Returns:
        Merged interval list
    """
    result = []
    i = 0
    n = len(intervals)
    
    # Step 1: Add all intervals that come BEFORE newInterval
    while i < n and intervals[i][1] < newInterval[0]:
        result.append(intervals[i])
        i += 1
    
    # Step 2: Merge all overlapping intervals with newInterval
    while i < n and intervals[i][0] <= newInterval[1]:
        newInterval[0] = min(newInterval[0], intervals[i][0])
        newInterval[1] = max(newInterval[1], intervals[i][1])
        i += 1
    
    result.append(newInterval)
    
    # Step 3: Add all remaining intervals
    while i < n:
        result.append(intervals[i])
        i += 1
    
    return result
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> insert(vector<vector<int>>& intervals, 
                                vector<int>& newInterval) {
        vector<vector<int>> result;
        int i = 0;
        int n = intervals.size();
        
        // Step 1: Add all intervals that come BEFORE newInterval
        while (i < n && intervals[i][1] < newInterval[0]) {
            result.push_back(intervals[i]);
            i++;
        }
        
        // Step 2: Merge all overlapping intervals with newInterval
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = min(newInterval[0], intervals[i][0]);
            newInterval[1] = max(newInterval[1], intervals[i][1]);
            i++;
        }
        
        result.push_back(newInterval);
        
        // Step 3: Add all remaining intervals
        while (i < n) {
            result.push_back(intervals[i]);
            i++;
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> result = new ArrayList<>();
        int i = 0;
        int n = intervals.length;
        
        // Step 1: Add all intervals that come BEFORE newInterval
        while (i < n && intervals[i][1] < newInterval[0]) {
            result.add(intervals[i]);
            i++;
        }
        
        // Step 2: Merge all overlapping intervals with newInterval
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
            newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
            i++;
        }
        
        result.add(newInterval);
        
        // Step 3: Add all remaining intervals
        while (i < n) {
            result.add(intervals[i]);
            i++;
        }
        
        return result.toArray(new int[0][]);
    }
}
```

<!-- slide -->
```javascript
/**
 * Insert newInterval into intervals and merge overlapping intervals.
 * 
 * @param {number[][]} intervals - Sorted non-overlapping intervals
 * @param {number[]} newInterval - New interval to insert
 * @return {number[][]} - Merged interval list
 */
function insert(intervals, newInterval) {
    const result = [];
    let i = 0;
    const n = intervals.length;
    
    // Step 1: Add all intervals that come BEFORE newInterval
    while (i < n && intervals[i][1] < newInterval[0]) {
        result.push(intervals[i]);
        i++;
    }
    
    // Step 2: Merge all overlapping intervals with newInterval
    while (i < n && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    
    result.push(newInterval);
    
    // Step 3: Add all remaining intervals
    while (i < n) {
        result.push(intervals[i]);
        i++;
    }
    
    return result;
}
```
````

---

### Approach 3: Activity Selection (Maximum Non-Overlapping)

Find maximum number of non-overlapping intervals.

### Algorithm Steps

1. **Sort intervals** by end time (earliest finishing first)
2. **Select first activity** (earliest finishing)
3. **Greedily select** next activity that starts after the previous ends

### Code Implementation

````carousel
```python
from typing import List

def eraseOverlapIntervals(intervals: List[List[int]]) -> int:
    """
    Find minimum number of intervals to remove to make rest non-overlapping.
    
    Args:
        intervals: List of [start, end] intervals
        
    Returns:
        Minimum intervals to remove
    """
    if not intervals:
        return 0
    
    # Sort by end time (key for activity selection)
    intervals.sort(key=lambda x: x[1])
    
    # Count = total - maximum non-overlapping
    count = 1  # First interval always selected
    end = intervals[0][1]
    
    for start, interval_end in intervals[1:]:
        if start >= end:
            count += 1
            end = interval_end
    
    return len(intervals) - count


def scheduleMaximumMeetings(intervals: List[List[int]]) -> int:
    """
    Schedule maximum number of non-overlapping meetings.
    
    Returns:
        Maximum number of meetings that can be held
    """
    if not intervals:
        return 0
    
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    
    count = 1
    end_time = intervals[0][1]
    
    for i in range(1, len(intervals)):
        if intervals[i][0] >= end_time:
            count += 1
            end_time = intervals[i][1]
    
    return count
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    int eraseOverlapIntervals(vector<vector<int>>& intervals) {
        if (intervals.empty()) return 0;
        
        // Sort by end time
        sort(intervals.begin(), intervals.end(), 
             [](const vector<int>& a, const vector<int>& b) {
                 return a[1] < b[1];
             });
        
        int count = 1;  // First interval always selected
        int end = intervals[0][1];
        
        for (size_t i = 1; i < intervals.size(); i++) {
            if (intervals[i][0] >= end) {
                count++;
                end = intervals[i][1];
            }
        }
        
        return intervals.size() - count;
    }
    
    int scheduleMaximumMeetings(vector<vector<int>>& intervals) {
        if (intervals.empty()) return 0;
        
        sort(intervals.begin(), intervals.end(), 
             [](const vector<int>& a, const vector<int>& b) {
                 return a[1] < b[1];
             });
        
        int count = 1;
        int endTime = intervals[0][1];
        
        for (size_t i = 1; i < intervals.size(); i++) {
            if (intervals[i][0] >= endTime) {
                count++;
                endTime = intervals[i][1];
            }
        }
        
        return count;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int eraseOverlapIntervals(int[][] intervals) {
        if (intervals == null || intervals.length == 0) {
            return 0;
        }
        
        // Sort by end time
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
        
        int count = 1;  // First interval always selected
        int end = intervals[0][1];
        
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] >= end) {
                count++;
                end = intervals[i][1];
            }
        }
        
        return intervals.length - count;
    }
    
    public int scheduleMaximumMeetings(int[][] intervals) {
        if (intervals == null || intervals.length == 0) {
            return 0;
        }
        
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
        
        int count = 1;
        int endTime = intervals[0][1];
        
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] >= endTime) {
                count++;
                endTime = intervals[i][1];
            }
        }
        
        return count;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find minimum number of intervals to remove to make rest non-overlapping.
 * 
 * @param {number[][]} intervals - Array of [start, end] intervals
 * @return {number} - Minimum intervals to remove
 */
function eraseOverlapIntervals(intervals) {
    if (!intervals || intervals.length === 0) {
        return 0;
    }
    
    // Sort by end time
    intervals.sort((a, b) => a[1] - b[1]);
    
    let count = 1;  // First interval always selected
    let end = intervals[0][1];
    
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] >= end) {
            count++;
            end = intervals[i][1];
        }
    }
    
    return intervals.length - count;
}

/**
 * Schedule maximum number of non-overlapping meetings.
 * 
 * @param {number[][]} intervals - Array of [start, end] intervals
 * @return {number} - Maximum number of meetings
 */
function scheduleMaximumMeetings(intervals) {
    if (!intervals || intervals.length === 0) {
        return 0;
    }
    
    intervals.sort((a, b) => a[1] - b[1]);
    
    let count = 1;
    let endTime = intervals[0][1];
    
    for (let i = 1; i < intervals.length; i++) {
        if (intervals[i][0] >= endTime) {
            count++;
            endTime = intervals[i][1];
        }
    }
    
    return count;
}
```
````

---

### Approach 4: Minimum Meeting Rooms

Find minimum number of meeting rooms required.

### Algorithm Steps (Two Heap Approach)

1. **Sort intervals** by start time
2. **Use min-heap** to track end times of ongoing meetings
3. **For each interval**:   - If earliest meeting ended ≤ current start → reuse room   - Otherwise → need new room
4. **Return heap size** as minimum rooms needed

### Code Implementation

````carousel
```python
import heapq
from typing import List

def minMeetingRooms(intervals: List[List[int]]) -> int:
    """
    Find minimum number of meeting rooms required.
    
    Args:
        intervals: List of [start, end] meeting intervals
        
    Returns:
        Minimum number of rooms needed
    """
    if not intervals:
        return 0
    
    # Sort by start time
    intervals.sort(key=lambda x: x[0])
    
    # Min-heap to track end times of meetings
    min_heap = []
    
    # Add first meeting's end time
    heapq.heappush(min_heap, intervals[0][1])
    
    # Process remaining meetings
    for start, end in intervals[1:]:
        # If meeting ends before next starts, reuse room
        if min_heap[0] <= start:
            heapq.heappop(min_heap)
        
        # Add current meeting's end time
        heapq.heappush(min_heap, end)
    
    return len(min_heap)


def minMeetingRoomsAlternative(intervals: List[List[int]]) -> int:
    """
    Alternative approach using sweep line algorithm.
    
    Time: O(n log n)
    Space: O(n)
    """
    if not intervals:
        return 0
    
    # Create start and end events
    starts = [interval[0] for interval in intervals]
    ends = [interval[1] for interval in intervals]
    
    starts.sort()
    ends.sort()
    
    rooms = 0
    max_rooms = 0
    i = 0  # for starts
    
    for start in starts:
        # Free up rooms whose meetings ended
        while ends[i] <= start:
            rooms -= 1
            i += 1
        
        # Allocate new room
        rooms += 1
        max_rooms = max(max_rooms, rooms)
    
    return max_rooms
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
        
        // Min-heap to track end times
        priority_queue<int, vector<int>, greater<int>> minHeap;
        
        // Add first meeting's end time
        minHeap.push(intervals[0][1]);
        
        // Process remaining meetings
        for (size_t i = 1; i < intervals.size(); i++) {
            int start = intervals[i][0];
            int end = intervals[i][1];
            
            // If meeting ends before next starts, reuse room
            if (minHeap.top() <= start) {
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
        if (intervals == null || intervals.length == 0) {
            return 0;
        }
        
        // Sort by start time
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        
        // Min-heap to track end times
        PriorityQueue<Integer> minHeap = new PriorityQueue<>();
        
        // Add first meeting's end time
        minHeap.add(intervals[0][1]);
        
        // Process remaining meetings
        for (int i = 1; i < intervals.length; i++) {
            int start = intervals[i][0];
            int end = intervals[i][1];
            
            // If meeting ends before next starts, reuse room
            if (minHeap.peek() <= start) {
                minHeap.poll();
            }
            
            minHeap.add(end);
        }
        
        return minHeap.size();
    }
}
```

<!-- slide -->
```javascript
/**
 * Find minimum number of meeting rooms required.
 * 
 * @param {number[][]} intervals - Array of [start, end] meetings
 * @return {number} - Minimum rooms needed
 */
function minMeetingRooms(intervals) {
    if (!intervals || intervals.length === 0) {
        return 0;
    }
    
    // Sort by start time
    intervals.sort((a, b) => a[0] - b[0]);
    
    // Min-heap to track end times
    const minHeap = [];
    
    // Add first meeting's end time
    minHeap.push(intervals[0][1]);
    
    // Process remaining meetings
    for (let i = 1; i < intervals.length; i++) {
        const start = intervals[i][0];
        const end = intervals[i][1];
        
        // If meeting ends before next starts, reuse room
        if (minHeap[0] <= start) {
            minHeap.shift();
            minHeap.sort((a, b) => a - b);  // Simple sort as min-heap
        }
        
        minHeap.push(end);
    }
    
    return minHeap.length;
}
```
````

---

### Approach 5: Interval Intersection

Find intersection points between two interval lists.

### Algorithm Steps

1. **Use two pointers** for each interval list
2. **Compare intervals**:   - If no overlap → advance pointer with smaller end   - If overlap → add intersection and advance pointer with smaller end

### Code Implementation

````carousel
```python
from typing import List

def intervalIntersection(firstList: List[List[int]], 
                          secondList: List[List[int]]) -> List[List[int]]:
    """
    Find intersection of two interval lists.
    
    Args:
        firstList: First list of intervals
        secondList: Second list of intervals
        
    Returns:
        List of intersecting intervals
    """
    if not firstList or not secondList:
        return []
    
    result = []
    i, j = 0, 0
    
    while i < len(firstList) and j < len(secondList):
        start1, end1 = firstList[i]
        start2, end2 = secondList[j]
        
        # Check for overlap
        start = max(start1, start2)
        end = min(end1, end2)
        
        if start <= end:
            result.append([start, end])
        
        # Advance pointer with smaller end
        if end1 < end2:
            i += 1
        else:
            j += 1
    
    return result
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> intervalIntersection(vector<vector<int>>& firstList,
                                               vector<vector<int>>& secondList) {
        if (firstList.empty() || secondList.empty()) {
            return {};
        }
        
        vector<vector<int>> result;
        int i = 0, j = 0;
        
        while (i < firstList.size() && j < secondList.size()) {
            int start1 = firstList[i][0], end1 = firstList[i][1];
            int start2 = secondList[j][0], end2 = secondList[j][1];
            
            // Check for overlap
            int start = max(start1, start2);
            int end = min(end1, end2);
            
            if (start <= end) {
                result.push_back({start, end});
            }
            
            // Advance pointer with smaller end
            if (end1 < end2) {
                i++;
            } else {
                j++;
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[][] intervalIntersection(int[][] firstList, int[][] secondList) {
        if (firstList == null || secondList == null || 
            firstList.length == 0 || secondList.length == 0) {
            return new int[0][];
        }
        
        List<int[]> result = new ArrayList<>();
        int i = 0, j = 0;
        
        while (i < firstList.length && j < secondList.length) {
            int start1 = firstList[i][0], end1 = firstList[i][1];
            int start2 = secondList[j][0], end2 = secondList[j][1];
            
            // Check for overlap
            int start = Math.max(start1, start2);
            int end = Math.min(end1, end2);
            
            if (start <= end) {
                result.add(new int[]{start, end});
            }
            
            // Advance pointer with smaller end
            if (end1 < end2) {
                i++;
            } else {
                j++;
            }
        }
        
        return result.toArray(new int[0][]);
    }
}
```

<!-- slide -->
```javascript
/**
 * Find intersection of two interval lists.
 * 
 * @param {number[][]} firstList - First list of intervals
 * @param {number[][]} secondList - Second list of intervals
 * @return {number[][]} - List of intersecting intervals
 */
function intervalIntersection(firstList, secondList) {
    if (!firstList || !secondList || 
        firstList.length === 0 || secondList.length === 0) {
        return [];
    }
    
    const result = [];
    let i = 0, j = 0;
    
    while (i < firstList.length && j < secondList.length) {
        const [start1, end1] = firstList[i];
        const [start2, end2] = secondList[j];
        
        // Check for overlap
        const start = Math.max(start1, start2);
        const end = Math.min(end1, end2);
        
        if (start <= end) {
            result.push([start, end]);
        }
        
        // Advance pointer with smaller end
        if (end1 < end2) {
            i++;
        } else {
            j++;
        }
    }
    
    return result;
}
```
````

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|-----------------|------------------|----------|
| **Standard Merge** | O(n log n) | O(n) | Merge overlapping intervals |
| **Insert Interval** | O(n) | O(n) | Insert into sorted intervals |
| **Activity Selection** | O(n log n) | O(1)* | Max non-overlapping |
| **Min Meeting Rooms** | O(n log n) | O(n) | Minimum resources needed |
| **Interval Intersection** | O(n + m) | O(n + m) | Find common intervals |

*Space is O(1) if sorting in-place

---

## Visual Example

### Merge Overlapping Intervals

```
Input:  [[1,3], [2,6], [8,10], [15,18]]

Step 1 - Sort by start: [[1,3], [2,6], [8,10], [15,18]]
         ↓
Step 2 - Start with [1,3]
         ↓
Step 3 - [2,6] overlaps with [1,3] → merge to [1,6]
         ↓
Step 4 - [8,10] doesn't overlap → add new [8,10]
         ↓
Step 5 - [15,18] doesn't overlap → add new [15,18]

Output: [[1,6], [8,10], [15,18]]
```

### Activity Selection

```
Input:  [[1,4], [2,3], [3,4], [0,2], [0,1]]

Sort by end: [[0,1], [2,3], [1,4], [0,2], [3,4]]

Select [0,1] → end = 1
Select [2,3] → end = 3 (2 >= 1)
Select [3,4] → end = 4 (3 >= 3)

Maximum meetings: 3
```

---

## Related Problems

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|----------------|-------------|
| Merge Intervals | [Link](https://leetcode.com/problems/merge-intervals/) | Merge all overlapping intervals |
| Insert Interval | [Link](https://leetcode.com/problems/insert-interval/) | Insert and merge new interval |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|----------------|-------------|
| Meeting Rooms II | [Link](https://leetcode.com/problems/meeting-rooms-ii/) | Minimum meeting rooms |
| Non-overlapping Intervals | [Link](https://leetcode.com/problems/non-overlapping-intervals/) | Remove minimum intervals |
| Interval List Intersections | [Link](https://leetcode.com/problems/interval-list-intersections/) | Find intersection of two lists |
| Employee Free Time | [Link](https://leetcode.com/problems/employee-free-time/) | Find common free time |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|----------------|-------------|
| Merge K Sorted Lists | [Link](https://leetcode.com/problems/merge-k-sorted-lists/) | Merge k sorted intervals |
| Meeting Rooms III | [Link](https://leetcode.com/problems/meeting-rooms-iii/) | Complex meeting room allocation |

---

## Video Tutorial Links

### Core Concept Tutorials

- [NeetCode - Merge Intervals](https://www.youtube.com/watch?v=44H3cEC2ZM8) - Clear explanation with visual examples
- [Back to Back SWE - Merge Intervals](https://www.youtube.com/watch?v=5G_2NGlEbl0) - Detailed walkthrough
- [LeetCode Official - Merge Intervals](https://www.youtube.com/watch?v=2MZ8CquHMOE) - Official solution

### Related Topics

- [Activity Selection Problem](https://www.youtube.com/watch?v=2L8K5zlR4Lw) - Greedy algorithm explained
- [Meeting Rooms II - Heap Approach](https://www.youtube.com/watch?v=Trz4JMdO0z4) - Priority queue solution
- [Interval Scheduling](https://www.youtube.com/watch?v=sz-OzdKck9I) - Comprehensive interval patterns

---

## Common Pitfalls

### 1. Not Sorting First
**Issue**: Forgetting to sort intervals by start/end time
**Solution**: Always sort first - it's the foundation of the greedy approach

### 2. Off-by-One Errors
**Issue**: Using `<` instead of `<=` or vice versa for overlap check
**Solution**: Remember: intervals [1,2] and [2,3] overlap at point 2

### 3. Not Creating New List
**Issue**: Modifying input list when new list is expected
**Solution**: Create a new result list and return it

### 4. Wrong Sort Key
**Issue**: Sorting by end instead of start (or vice versa) for wrong problem
**Solution**: 
- Merge: sort by start
- Activity Selection: sort by end

### 5. Heap vs Sort Confusion
**Issue**: Using wrong approach for minimum rooms
**Solution**: Heap approach uses min-heap on end times

---

## Summary

The **Interval Merging/Scheduling** pattern is a fundamental greedy algorithm pattern characterized by:

- **Sorting as foundation**: Always sort intervals first
- **Local optimal decisions**: Make greedy choices at each step
- **Single pass after sort**: O(n) additional processing after O(n log n) sort
- **Variants**: Merge, insert, schedule, allocate resources

### Key Takeaways

1. **Standard Merge**: Sort by start, merge overlapping
2. **Insert**: Find position, merge, add rest
3. **Activity Selection**: Sort by end, pick earliest finishing
4. **Min Rooms**: Sort by start, use min-heap on end times
5. **Intersection**: Two pointers, advance smaller end

This pattern is essential for solving many real-world scheduling and resource allocation problems efficiently.

---

## Pattern Reference

For more detailed explanations and variations, see related patterns:
- [Greedy - Jump Game](/patterns/greedy-jump-game-reachability-minimization)
- [Greedy - Buy and Sell Stock](/patterns/greedy-buy-sell-stock)
- [Heap - K Way Merge](/patterns/heap-k-way-merge)
