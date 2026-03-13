# Employee Free Time

## Problem Description

> Given a list of employees' schedules where each employee has a list of busy time intervals, find all time intervals when all employees are free.

**LeetCode Link:** [Employee Free Time - LeetCode](https://leetcode.com/problems/employee-free-time/)

---

## Examples

**Example 1:**

**Input:**
```python
schedule = [
    [[1, 2], [5, 6]],
    [[1, 3]],
    [[4, 10]]
]
```

**Output:**
```python
[[3, 4]]
```

**Explanation:** 
- Employee 0 is busy: [1,2], [5,6]
- Employee 1 is busy: [1,3]
- Employee 2 is busy: [4,10]
- The only time all employees are free is [3,4]

**Example 2:**

**Input:**
```python
schedule = [
    [[1, 3], [6, 7]],
    [[2, 4]],
    [[2, 5], [9, 12]]
]
```

**Output:**
```python
[[5, 6], [7, 9]]
```

**Explanation:**
- Merged busy intervals: [1,4], [5,5], [6,7], [9,12]
- Combined: [1,7], [9,12]
- Free intervals: [7,9] but need to also check after [7,9] before merging - result is [5,6] and [7,9]

---

## Constraints

- `1 <= schedule.length <= 10^3`
- `schedule[i].length >= 1`
- `0 <= schedule[i][j].length <= 10^5`
- `schedule[i][j][0] < schedule[i][j][1]`
- `0 <= schedule[i][j][0] < schedule[i][j][1] <= 10^8`

---

## Pattern: Interval Merging

This problem follows the **Interval Merging** pattern for finding common free time slots.

### Core Concept

- **Flatten and Sort**: Collect all intervals and sort by start time
- **Merge Overlapping**: Combine overlapping intervals to find busy periods
- **Find Gaps**: Free time = gaps between merged busy intervals

### When to Use This Pattern

This pattern is applicable when:
1. Finding common availability across multiple schedules
2. Interval scheduling and merging problems
3. Detecting gaps in sorted intervals

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Interval Merge | Combine overlapping intervals |
| Two Pointers | For sorted interval traversal |
| Priority Queue | Alternative approach for merging |

---

## Intuition

The key insight for this problem is that finding common free time is equivalent to finding gaps in the merged busy schedule.

### Key Observations

1. **Flatten All Intervals**: Each employee has their own busy intervals. To find when ALL employees are free, we first need to understand when at least ONE employee is busy.

2. **Merge to Find Busy Periods**: By merging all overlapping intervals, we get the complete timeline of when someone is working.

3. **Free Time = Gaps**: After merging, any gap between busy intervals represents time when all employees are free.

4. **Edge Cases**: 
   - No busy intervals → all time is free
   - Overlapping intervals from different employees should merge
   - Adjacent intervals (end == start) don't create free time

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Flatten and Merge (Optimal)** - Simple and efficient
2. **Priority Queue Approach** - Alternative using min-heap

---

## Approach 1: Flatten and Merge (Optimal)

### Algorithm Steps

1. Flatten all intervals from all employees into a single list
2. Sort all intervals by start time
3. Merge overlapping intervals iteratively
4. Find gaps between merged intervals
5. Return gaps as free time

### Why It Works

This approach works because:
- Sorting ensures we process intervals in chronological order
- Merging combines any overlapping or adjacent busy periods
- Gaps between merged intervals are guaranteed to be free for all employees

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def employeeFreeTime(self, schedule: List[List[List[int]]]) -> List[List[int]]:
        """
        Find all time intervals when all employees are free.

        Args:
            schedule: List of employees, each with a list of [start, end] intervals

        Returns:
            List of [start, end] intervals representing free time slots
        """
        if not schedule:
            return []
        
        # Step 1: Flatten all intervals from all employees
        all_intervals = []
        for emp in schedule:
            all_intervals.extend(emp)
        
        if not all_intervals:
            return []
        
        # Step 2: Sort all intervals by start time
        all_intervals.sort(key=lambda x: x[0])
        
        # Step 3: Merge overlapping intervals
        merged = [all_intervals[0]]
        
        for interval in all_intervals[1:]:
            last = merged[-1]
            if interval[0] >= last[1]:
                # No overlap - add new interval
                merged.append(interval)
            else:
                # Overlap - extend the last interval
                merged[-1][1] = max(last[1], interval[1])
        
        # Step 4: Find gaps between merged intervals
        free = []
        for i in range(1, len(merged)):
            free.append([merged[i-1][1], merged[i][0]])
        
        return free
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> employeeFreeTime(vector<vector<vector<int>>>& schedule) {
        if (schedule.empty()) return {};
        
        // Step 1: Flatten all intervals
        vector<vector<int>> allIntervals;
        for (const auto& emp : schedule) {
            for (const auto& interval : emp) {
                allIntervals.push_back(interval);
            }
        }
        
        if (allIntervals.empty()) return {};
        
        // Step 2: Sort by start time
        sort(allIntervals.begin(), allIntervals.end(),
             [](const vector<int>& a, const vector<int>& b) {
                 return a[0] < b[0];
             });
        
        // Step 3: Merge overlapping intervals
        vector<vector<int>> merged;
        merged.push_back(allIntervals[0]);
        
        for (size_t i = 1; i < allIntervals.size(); i++) {
            vector<int>& last = merged.back();
            if (allIntervals[i][0] >= last[1]) {
                // No overlap
                merged.push_back(allIntervals[i]);
            } else {
                // Overlap - extend
                last[1] = max(last[1], allIntervals[i][1]);
            }
        }
        
        // Step 4: Find gaps
        vector<vector<int>> free;
        for (size_t i = 1; i < merged.size(); i++) {
            free.push_back({merged[i-1][1], merged[i][0]});
        }
        
        return free;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<List<Integer>> employeeFreeTime(List<List<List<Integer>>> schedule) {
        if (schedule == null || schedule.isEmpty()) {
            return new ArrayList<>();
        }
        
        // Step 1: Flatten all intervals
        List<int[]> allIntervals = new ArrayList<>();
        for (List<List<Integer>> emp : schedule) {
            for (List<Integer> interval : emp) {
                allIntervals.add(new int[]{interval.get(0), interval.get(1)});
            }
        }
        
        if (allIntervals.isEmpty()) {
            return new ArrayList<>();
        }
        
        // Step 2: Sort by start time
        allIntervals.sort(Comparator.comparingInt(a -> a[0]));
        
        // Step 3: Merge overlapping intervals
        List<int[]> merged = new ArrayList<>();
        merged.add(allIntervals.get(0));
        
        for (int i = 1; i < allIntervals.size(); i++) {
            int[] last = merged.get(merged.size() - 1);
            int[] current = allIntervals.get(i);
            
            if (current[0] >= last[1]) {
                merged.add(current);
            } else {
                last[1] = Math.max(last[1], current[1]);
            }
        }
        
        // Step 4: Find gaps
        List<List<Integer>> free = new ArrayList<>();
        for (int i = 1; i < merged.size(); i++) {
            List<Integer> gap = new ArrayList<>();
            gap.add(merged.get(i-1)[1]);
            gap.add(merged.get(i)[0]);
            free.add(gap);
        }
        
        return free;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][][]} schedule
 * @return {number[][]}
 */
var employeeFreeTime = function(schedule) {
    if (!schedule || schedule.length === 0) return [];
    
    // Step 1: Flatten all intervals
    const allIntervals = [];
    for (const emp of schedule) {
        for (const interval of emp) {
            allIntervals.push(interval);
        }
    }
    
    if (allIntervals.length === 0) return [];
    
    // Step 2: Sort by start time
    allIntervals.sort((a, b) => a[0] - b[0]);
    
    // Step 3: Merge overlapping intervals
    const merged = [allIntervals[0]];
    
    for (let i = 1; i < allIntervals.length; i++) {
        const last = merged[merged.length - 1];
        const current = allIntervals[i];
        
        if (current[0] >= last[1]) {
            merged.push(current);
        } else {
            last[1] = Math.max(last[1], current[1]);
        }
    }
    
    // Step 4: Find gaps
    const free = [];
    for (let i = 1; i < merged.length; i++) {
        free.push([merged[i-1][1], merged[i][0]]);
    }
    
    return free;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log n) where n is the total number of intervals (sorting dominates) |
| **Space** | O(n) for storing all intervals |

---

## Approach 2: Priority Queue Approach

### Algorithm Steps

1. Use a min-heap to track the earliest ending interval from each employee
2. Track the current "end" of the busy time
3. Extract the earliest ending interval and find gaps
4. Push the next interval from the same employee into the heap

### Why It Works

This approach is useful when you want O(n log k) time complexity where k is the number of employees. Instead of sorting all n intervals, we only need to keep track of the current interval from each employee.

### Code Implementation

````carousel
```python
import heapq
from typing import List

class Solution:
    def employeeFreeTime(self, schedule: List[List[List[int]]]) -> List[List[int]]:
        """
        Find free time using priority queue approach.
        """
        if not schedule:
            return []
        
        # Heap stores (end_time, employee_index, interval_index)
        # Initialize with first interval from each employee
        heap = []
        for emp_idx, intervals in enumerate(schedule):
            if intervals:
                heapq.heappush(heap, (intervals[0][1], emp_idx, 0))
        
        if not heap:
            return []
        
        # Track the end of last busy time
        _, last_emp, last_idx = heap[0]
        prev_end = schedule[last_emp][last_idx][1]
        
        free = []
        
        while heap:
            end_time, emp_idx, interval_idx = heapq.heappop(heap)
            
            # Found a gap if current interval starts after prev_end
            if end_time < prev_end:
                # This interval is completely contained, get next from same employee
                if interval_idx + 1 < len(schedule[emp_idx]):
                    next_interval = schedule[emp_idx][interval_idx + 1]
                    heapq.heappush(heap, (
                        next_interval[1], 
                        emp_idx, 
                        interval_idx + 1
                    ))
                continue
            
            # Gap found: starts at prev_end, ends at current start
            gap_start = prev_end
            gap_end = schedule[emp_idx][interval_idx][0]
            
            if gap_start < gap_end:
                free.append([gap_start, gap_end])
            
            # Update prev_end to the end of current interval
            prev_end = max(prev_end, end_time)
            
            # Push next interval from same employee
            if interval_idx + 1 < len(schedule[emp_idx]):
                next_interval = schedule[emp_idx][interval_idx + 1]
                heapq.heappush(heap, (
                    next_interval[1], 
                    emp_idx, 
                    interval_idx + 1
                ))
        
        return free
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <algorithm>
using namespace std;

class Solution {
public:
    vector<vector<int>> employeeFreeTime(vector<vector<vector<int>>>& schedule) {
        if (schedule.empty()) return {};
        
        // Min-heap: (endTime, employeeIndex, intervalIndex)
        using T = tuple<int, int, int>;
        priority_queue<T, vector<T>, greater<T>> pq;
        
        // Initialize with first interval from each employee
        for (int i = 0; i < schedule.size(); i++) {
            if (!schedule[i].empty()) {
                pq.emplace(schedule[i][0][1], i, 0);
            }
        }
        
        if (pq.empty()) return {};
        
        vector<vector<int>> free;
        int prevEnd = get<0>(pq.top());
        
        while (!pq.empty()) {
            auto [endTime, empIdx, intIdx] = pq.top();
            pq.pop();
            
            // Gap found
            int gapStart = prevEnd;
            int gapEnd = schedule[empIdx][intIdx][0];
            
            if (gapStart < gapEnd) {
                free.push_back({gapStart, gapEnd});
            }
            
            prevEnd = max(prevEnd, endTime);
            
            // Push next interval from same employee
            if (intIdx + 1 < schedule[empIdx].size()) {
                pq.emplace(schedule[empIdx][intIdx + 1][1], empIdx, intIdx + 1);
            }
        }
        
        return free;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public List<List<Integer>> employeeFreeTime(List<List<List<Integer>>> schedule) {
        if (schedule == null || schedule.isEmpty()) {
            return new ArrayList<>();
        }
        
        // Min-heap: (endTime, employeeIndex, intervalIndex)
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        
        // Initialize with first interval from each employee
        for (int i = 0; i < schedule.size(); i++) {
            if (!schedule.get(i).isEmpty()) {
                List<Integer> interval = schedule.get(i).get(0);
                pq.add(new int[]{interval.get(1), i, 0});
            }
        }
        
        if (pq.isEmpty()) {
            return new ArrayList<>();
        }
        
        List<List<Integer>> free = new ArrayList<>();
        int prevEnd = pq.peek()[0];
        
        while (!pq.isEmpty()) {
            int[] current = pq.poll();
            int empIdx = current[1];
            int intIdx = current[2];
            
            List<Integer> interval = schedule.get(empIdx).get(intIdx);
            int gapStart = prevEnd;
            int gapEnd = interval.get(0);
            
            if (gapStart < gapEnd) {
                free.add(Arrays.asList(gapStart, gapEnd));
            }
            
            prevEnd = Math.max(prevEnd, current[0]);
            
            // Push next interval from same employee
            if (intIdx + 1 < schedule.get(empIdx).size()) {
                List<Integer> nextInterval = schedule.get(empIdx).get(intIdx + 1);
                pq.add(new int[]{nextInterval.get(1), empIdx, intIdx + 1});
            }
        }
        
        return free;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][][]} schedule
 * @return {number[][]}
 */
var employeeFreeTime = function(schedule) {
    if (!schedule || schedule.length === 0) return [];
    
    // Min-heap stores [endTime, employeeIndex, intervalIndex]
    const pq = [];
    
    // Initialize with first interval from each employee
    for (let i = 0; i < schedule.length; i++) {
        if (schedule[i].length > 0) {
            pq.push([schedule[i][0][1], i, 0]);
        }
    }
    
    if (pq.length === 0) return [];
    
    // Min-heap property
    pq.sort((a, b) => a[0] - b[0]);
    
    const free = [];
    let prevEnd = pq[0][0];
    
    while (pq.length > 0) {
        const [endTime, empIdx, intIdx] = pq.shift();
        const interval = schedule[empIdx][intIdx];
        
        const gapStart = prevEnd;
        const gapEnd = interval[0];
        
        if (gapStart < gapEnd) {
            free.push([gapStart, gapEnd]);
        }
        
        prevEnd = Math.max(prevEnd, endTime);
        
        // Push next interval from same employee
        if (intIdx + 1 < schedule[empIdx].length) {
            const nextInterval = schedule[empIdx][intIdx + 1];
            pq.push([nextInterval[1], empIdx, intIdx + 1]);
            pq.sort((a, b) => a[0] - b[0]);
        }
    }
    
    return free;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n log k) where n is total intervals, k is number of employees |
| **Space** | O(k) for the heap |

---

## Comparison of Approaches

| Aspect | Flatten and Merge | Priority Queue |
|--------|------------------|----------------|
| **Time Complexity** | O(n log n) | O(n log k) |
| **Space Complexity** | O(n) | O(k) |
| **Implementation** | Simple | Moderate |
| **Best For** | Few employees, many intervals | Many employees, few intervals per employee |

**Best Approach:** Use Approach 1 (Flatten and Merge) for most cases. It's simpler and performs well when the number of employees is reasonable.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Google, Amazon, Microsoft
- **Difficulty**: Hard
- **Concepts Tested**: Interval merging, sorting, gap detection

### Learning Outcomes

1. **Interval Manipulation**: Master interval flattening, sorting, and merging
2. **Gap Detection**: Learn to identify gaps between merged intervals
3. **Optimization**: Understand trade-offs between different approaches

---

## Related Problems

Based on similar themes (interval merging, scheduling):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Merge Intervals | [Link](https://leetcode.com/problems/merge-intervals/) | Classic interval merging |
| Meeting Rooms | [Link](https://leetcode.com/problems/meeting-rooms/) | Interval overlap detection |
| Non-overlapping Intervals | [Link](https://leetcode.com/problems/non-overlapping-intervals/) | Interval removal |

### Pattern Reference

For more detailed explanations of the Interval Merging pattern, see:
- **[Interval Pattern](/patterns/interval)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[Employee Free Time - NeetCode](https://www.youtube.com/watch?v=nqlWcXlvqAQ)** - Clear explanation with visual examples
2. **[LeetCode 759 - Employee Free Time](https://www.youtube.com/watch?v=hedO5CFY3jE)** - Detailed walkthrough

---

## Follow-up Questions

### Q1: How would you modify the solution to find the longest continuous free time?

**Answer:** After finding all free intervals, simply track the one with the maximum duration (gap_end - gap_start). You could also modify the gap detection to only track the largest gap.

---

### Q2: What if we needed to find free time for at least K employees (not all)?

**Answer:** Instead of merging all intervals, we'd use a different approach:
- Count how many employees are busy at each time point using a sweep line algorithm
- Find time ranges where fewer than n-K employees are busy

---

### Q3: How would you handle the case where employees have different "work days"?

**Answer:** You'd need to:
1. First identify the overall time range being considered
2. For each day (or time period), apply the same algorithm
3. Combine results across all days

---

### Q4: Can you solve this in O(n) time without sorting?

**Answer:** If all intervals are already sorted within each employee's schedule, you could use the priority queue approach which is O(n log k) where k is the number of employees. Without any sorting, it's impossible to guarantee correct merging in O(n) time.

---

## Common Pitfalls

### 1. Not Sorting Intervals
**Issue**: Processing intervals in random order leads to incorrect merging.

**Solution**: Always sort intervals by start time before merging.

### 2. Off-by-One Errors in Gap Detection
**Issue**: Incorrectly identifying gap boundaries.

**Solution**: Free interval is [merged[i-1][1], merged[i][0]] - the end of previous and start of current.

### 3. Empty Schedule Handling
**Issue**: Not handling employees with no busy intervals.

**Solution**: Handle empty schedules - they contribute no intervals to the merge.

### 4. Adjacent Interval Handling
**Issue**: Treating adjacent intervals (where end == start) as creating a gap.

**Solution**: Only add a gap if merged[i][0] > merged[i-1][1] (strictly greater).

---

## Summary

The **Employee Free Time** problem demonstrates the power of interval merging:

Key takeaways:
1. Flatten all intervals from all employees
2. Sort by start time and merge overlapping intervals
3. Gaps between merged intervals represent free time for all employees
4. The problem reduces to "find gaps between merged intervals"

This problem is essential for understanding interval-based scheduling and gap detection algorithms.

### Pattern Summary

This problem exemplifies the **Interval Merging** pattern, characterized by:
- Flattening and sorting all intervals
- Merging overlapping or adjacent intervals
- Gap detection between merged intervals
- Applications in scheduling and calendar problems

For more details on this pattern and its variations, see the **[Interval Pattern](/patterns/interval)**.

---

## Additional Resources

- [LeetCode Problem 759](https://leetcode.com/problems/employee-free-time/) - Official problem page
- [Merge Intervals - GeeksforGeeks](https://www.geeksforgeeks.org/merging-intervals/) - Detailed explanation
- [Pattern: Interval](/patterns/interval) - Comprehensive pattern guide
