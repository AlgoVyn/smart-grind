# Insert Interval

## Problem Description

You are given an array of **non-overlapping** intervals `intervals` where `intervals[i] = [starti, endi]` represent the start and end of the ith interval. The array is sorted in ascending order by `starti`.

You are also given an interval `newInterval = [start, end]` that represents the start and end of another interval.

Insert `newInterval` into `intervals` such that:
1. The intervals remain sorted in ascending order by `starti`.
2. The intervals still do not have any overlapping intervals (merge overlapping intervals if necessary).

Return the intervals after the insertion. You can make a new array and return it (no need to modify in-place).

**Link to problem:** [Insert Interval - LeetCode 57](https://leetcode.com/problems/insert-interval/)

---

## Examples

### Example 1

| Input | Output |
|-------|--------|
| `intervals = [[1,3],[6,9]]`, `newInterval = [2,5]` | `[[1,5],[6,9]]` |

### Example 2

| Input | Output |
|-------|--------|
| `intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]]`, `newInterval = [4,8]` | `[[1,2],[3,10],[12,16]]` |

**Explanation:** The new interval `[4,8]` overlaps with `[3,5]`, `[6,7]`, and `[8,10]`, so they are all merged into `[3,10]`.

---

## Constraints

- `0 <= intervals.length <= 10⁴`
- `intervals[i].length == 2`
- `0 <= starti <= endi <= 10⁵`
- `intervals` is sorted by `starti` in ascending order.
- `newInterval.length == 2`
- `0 <= start <= end <= 10⁵`

---

## Pattern: Linear Scan

This problem follows the **Linear Scan** pattern for interval operations.

---

## Intuition

The key insight for this problem is understanding the three distinct cases when inserting a new interval:

> Process intervals in order, handling three cases: intervals before newInterval, intervals overlapping with newInterval, and intervals after newInterval.

### Key Observations

1. **Three Cases**: Each existing interval falls into exactly one of these categories:
   - **Before**: interval end < newInterval start (no overlap, comes before)
   - **Overlapping**: interval start <= newInterval end AND interval end >= newInterval start (merge)
   - **After**: interval start > newInterval end (no overlap, comes after)

2. **Sorted Input**: Since intervals are sorted by start time, we can process them in a single pass.

3. **Merge Logic**: When overlapping, the merged interval has:
   - Start = min(original start, newInterval start)
   - End = max(original end, newInterval end)

### Algorithm Overview

1. Add all intervals that end before newInterval starts
2. Merge all overlapping intervals with newInterval
3. Add the merged newInterval
4. Add all remaining intervals

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Linear Scan** - Optimal solution (O(n) time)
2. **Binary Search + Merge** - Alternative approach (O(log n + k) where k is overlapping)

---

## Approach 1: Linear Scan (Optimal) ⭐

### Algorithm Steps

1. Initialize result list and index i = 0
2. **Phase 1**: Add all intervals that end before newInterval starts
3. **Phase 2**: Merge all overlapping intervals with newInterval
4. **Phase 3**: Add the merged newInterval
5. **Phase 4**: Add all remaining intervals

### Why It Works

This approach works because:
- The sorted nature guarantees we encounter intervals in the correct order
- Each interval falls into exactly one of three cases
- Merging keeps the sorted order intact

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
        """
        Insert newInterval into intervals and merge if needed.
        
        Args:
            intervals: List of non-overlapping sorted intervals
            newInterval: New interval to insert
            
        Returns:
            List of merged intervals
        """
        res = []
        i = 0
        n = len(intervals)
        
        # Phase 1: Add all intervals that end before newInterval starts
        while i < n and intervals[i][1] < newInterval[0]:
            res.append(intervals[i])
            i += 1
        
        # Phase 2: Merge all overlapping intervals with newInterval
        while i < n and intervals[i][0] <= newInterval[1]:
            newInterval[0] = min(newInterval[0], intervals[i][0])
            newInterval[1] = max(newInterval[1], intervals[i][1])
            i += 1
        
        # Phase 3: Add the merged newInterval
        res.append(newInterval)
        
        # Phase 4: Add all remaining intervals
        while i < n:
            res.append(intervals[i])
            i += 1
        
        return res
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
        vector<vector<int>> res;
        int n = intervals.size();
        int i = 0;
        
        // Phase 1: Add all intervals that end before newInterval starts
        while (i < n && intervals[i][1] < newInterval[0]) {
            res.push_back(intervals[i]);
            i++;
        }
        
        // Phase 2: Merge all overlapping intervals with newInterval
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = min(newInterval[0], intervals[i][0]);
            newInterval[1] = max(newInterval[1], intervals[i][1]);
            i++;
        }
        
        // Phase 3: Add the merged newInterval
        res.push_back(newInterval);
        
        // Phase 4: Add all remaining intervals
        while (i < n) {
            res.push_back(intervals[i]);
            i++;
        }
        
        return res;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> res = new ArrayList<>();
        int n = intervals.length;
        int i = 0;
        
        // Phase 1: Add all intervals that end before newInterval starts
        while (i < n && intervals[i][1] < newInterval[0]) {
            res.add(intervals[i]);
            i++;
        }
        
        // Phase 2: Merge all overlapping intervals with newInterval
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
            newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
            i++;
        }
        
        // Phase 3: Add the merged newInterval
        res.add(newInterval);
        
        // Phase 4: Add all remaining intervals
        while (i < n) {
            res.add(intervals[i]);
            i++;
        }
        
        return res.toArray(new int[res.size()][]);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} intervals
 * @param {number[]} newInterval
 * @return {number[][]}
 */
var insert = function(intervals, newInterval) {
    const res = [];
    let i = 0;
    const n = intervals.length;
    
    // Phase 1: Add all intervals that end before newInterval starts
    while (i < n && intervals[i][1] < newInterval[0]) {
        res.push(intervals[i]);
        i++;
    }
    
    // Phase 2: Merge all overlapping intervals with newInterval
    while (i < n && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    
    // Phase 3: Add the merged newInterval
    res.push(newInterval);
    
    // Phase 4: Add all remaining intervals
    while (i < n) {
        res.push(intervals[i]);
        i++;
    }
    
    return res;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - single pass through all intervals |
| **Space** | O(n) - for the result list |

---

## Approach 2: Binary Search + Merge

### Algorithm Steps

1. Use binary search to find where newInterval should start
2. Use binary search to find where newInterval should end
3. Merge overlapping intervals
4. Insert in correct position

### Why It Works

This approach optimizes the search phase using binary search, though the overall complexity remains O(n) due to merging.

### Code Implementation

````carousel
```python
from typing import List
import bisect

class Solution:
    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:
        """
        Using binary search to find insertion points.
        """
        if not intervals:
            return [newInterval]
        
        # Find position to insert (where start >= newInterval[0])
        start_pos = bisect.bisect_right(intervals, [newInterval[0], float('inf')])
        
        # Find position where end > newInterval[1]
        end_pos = bisect.bisect_left(intervals, [newInterval[1] + 1, 0])
        
        # Merge
        if start_pos > 0 and intervals[start_pos - 1][1] >= newInterval[0]:
            start_pos -= 1
            newInterval[0] = min(newInterval[0], intervals[start_pos][0])
        
        if end_pos < len(intervals) and intervals[end_pos][0] <= newInterval[1]:
            newInterval[1] = max(newInterval[1], intervals[end_pos][1])
        
        return intervals[:start_pos] + [newInterval] + intervals[end_pos:]
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
        // Find insertion position using binary search
        auto it = lower_bound(intervals.begin(), intervals.end(), newInterval[1] + 1,
                            [](const vector<int>& a, int val) { return a[0] < val; });
        
        int insertPos = it - intervals.begin();
        
        // Check if we need to merge with previous
        if (insertPos > 0 && intervals[insertPos - 1][1] >= newInterval[0]) {
            insertPos--;
            newInterval[0] = min(newInterval[0], intervals[insertPos][0]);
            newInterval[1] = max(newInterval[1], intervals[insertPos][1]);
        }
        
        // Merge with overlapping intervals
        while (insertPos < intervals.size() && intervals[insertPos][0] <= newInterval[1]) {
            newInterval[0] = min(newInterval[0], intervals[insertPos][0]);
            newInterval[1] = max(newInterval[1], intervals[insertPos][1]);
            intervals.erase(intervals.begin() + insertPos);
        }
        
        intervals.insert(intervals.begin() + insertPos, newInterval);
        return intervals;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[][] insert(int[][] intervals, int[] newInterval) {
        List<int[]> result = new ArrayList<>();
        int n = intervals.length;
        int i = 0;
        
        // Add intervals before newInterval
        while (i < n && intervals[i][1] < newInterval[0]) {
            result.add(intervals[i++]);
        }
        
        // Merge overlapping intervals
        while (i < n && intervals[i][0] <= newInterval[1]) {
            newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
            newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
            i++;
        }
        result.add(newInterval);
        
        // Add remaining intervals
        while (i < n) {
            result.add(intervals[i++]);
        }
        
        return result.toArray(new int[result.size()][]);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} intervals
 * @param {number[]} newInterval
 * @return {number[][]}
 */
var insert = function(intervals, newInterval) {
    // Using linear scan - same as optimal approach
    const result = [];
    let i = 0;
    
    // Add intervals before newInterval
    while (i < intervals.length && intervals[i][1] < newInterval[0]) {
        result.push(intervals[i++]);
    }
    
    // Merge overlapping intervals
    while (i < intervals.length && intervals[i][0] <= newInterval[1]) {
        newInterval[0] = Math.min(newInterval[0], intervals[i][0]);
        newInterval[1] = Math.max(newInterval[1], intervals[i][1]);
        i++;
    }
    result.push(newInterval);
    
    // Add remaining intervals
    while (i < intervals.length) {
        result.push(intervals[i++]);
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - worst case still requires full scan |
| **Space** | O(n) - for the result list |

---

## Comparison of Approaches

| Aspect | Linear Scan | Binary Search + Merge |
|--------|-------------|----------------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(n) | O(n) |
| **Implementation** | Simple | Complex |
| **LeetCode Optimal** | ✅ | ✅ |
| **Difficulty** | Easy | Medium |

**Best Approach:** Use Approach 1 (Linear Scan) for its simplicity and clarity. The O(n) approach is straightforward and efficient enough.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Amazon, Meta, Microsoft
- **Difficulty**: Medium
- **Concepts Tested**: Interval manipulation, linear scan, merging logic

### Learning Outcomes

1. **Interval Operations**: Master interval insertion and merging
2. **Case Analysis**: Handle multiple cases systematically
3. **Edge Cases**: Handle empty intervals, boundaries

---

## Related Problems

Based on similar themes (interval operations):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Merge Intervals | [Link](https://leetcode.com/problems/merge-intervals/) | Merge all overlapping |
| Non-overlapping Intervals | [Link](https://leetcode.com/problems/non-overlapping-intervals/) | Remove overlaps |
| Meeting Rooms II | [Link](https://leetcode.com/problems/meeting-rooms-ii/) | Interval scheduling |
| Teemo Attacking | [Link](https://leetcode.com/problems/teemo-attacking/) | Overlapping intervals |

### Pattern Reference

For more detailed explanations of interval patterns, see:
- **[Interval Operations](/patterns/interval-list-intersections)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Insert Interval](https://www.youtube.com/watch?v=2L8p5IYkJ_c)** - Clear explanation with visual examples
2. **[Insert Interval - LeetCode 57](https://www.youtube.com/watch?v=3Y0K-jtY4jE)** - Detailed walkthrough
3. **[Interval Problems Explained](https://www.youtube.com/watch?v=44A2Ljm9J9U)** - Understanding interval patterns

### Related Concepts

- **[Binary Search](https://www.youtube.com/watch?v=3lVB5yZ-BjE)** - Search optimization
- **[Merge Sort Logic](https://www.youtube.com/watch?v=4V30R3EeFQ8)** - Similar merging approach

---

## Follow-up Questions

### Q1: How would you handle intervals with weights (e.g., room bookings with durations)?

**Answer:** Use a different data structure like a calendar with time slots or a priority queue for meeting rooms.

---

### Q2: What if intervals could be unsorted?

**Answer:** First sort the intervals by start time, then apply the standard algorithm.

---

### Q3: How would you find the minimum number of intervals to remove to make them non-overlapping?

**Answer:** This is the "Non-overlapping Intervals" problem. Sort by end time and greedily remove intervals that overlap.

---

### Q4: What if newInterval could be inserted at the beginning or end efficiently?

**Answer:** Our algorithm already handles this - Phase 1 or Phase 4 will handle these cases.

---

### Q5: How would you track which intervals were merged?

**Answer:** Maintain a list of indices that were merged, or return additional metadata about the merge operation.

---

## Common Pitfalls

### 1. Not Handling All Cases
**Issue:** Missing one of the three cases (before, overlap, after).

**Solution:** Explicitly handle: new before, new overlaps, new after.

### 2. Wrong Merge Logic
**Issue:** Not updating min/max correctly when merging.

**Solution:** Use min of starts and max of ends for merged interval.

### 3. List Modification During Iteration
**Issue:** Modifying list while iterating causes issues.

**Solution:** Build new list or use index carefully.

### 4. Off-by-One Errors
**Issue:** Using <= vs < incorrectly for overlap detection.

**Solution:** Intervals [a,b] and [c,d] overlap if b >= c (not b < c).

### 5. Empty Input
**Issue:** Not handling empty intervals list.

**Solution:** Add check at the beginning or let the algorithm handle it.

---

## Summary

The **Insert Interval** problem demonstrates **Linear Scan** for interval operations. The key insight is handling three distinct cases: intervals before newInterval, intervals overlapping with newInterval, and intervals after newInterval.

### Key Takeaways

1. **Three Cases**: Before, overlapping, or after the new interval
2. **Merge Logic**: min of starts, max of ends when overlapping
3. **Sorted Input**: Leverage sorted nature for single-pass solution
4. **Time Complexity**: O(n) - efficient for large inputs

### Pattern Summary

This problem exemplifies the **Interval Operations** pattern, characterized by:
- Handling overlapping ranges
- Merging or splitting intervals
- Leveraging sorted input

For more details on this pattern, see the **[Interval Operations](/patterns/interval-list-intersections)**.

---

## Additional Resources

- [LeetCode Problem 57](https://leetcode.com/problems/insert-interval/) - Official problem page
- [Merge Intervals - GeeksforGeeks](https://www.geeksforgeeks.org/merging-intervals/) - Detailed explanation
- [Interval Scheduling](https://en.wikipedia.org/wiki/Interval_scheduling) - Algorithm background
- [Pattern: Interval Operations](/patterns/interval-list-intersections) - Comprehensive pattern guide
