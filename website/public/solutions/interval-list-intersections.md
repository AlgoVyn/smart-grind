# Interval List Intersections

## Problem Description

You are given two lists of closed intervals, `firstList` and `secondList`, where:
- `firstList[i] = [starti, endi]`
- `secondList[j] = [startj, endj]`

Each list of intervals is **pairwise disjoint** and in **sorted order**.

Return the intersection of these two interval lists.

A **closed interval** `[a, b]` (with `a <= b`) denotes the set of real numbers `x` with `a <= x <= b`.

The intersection of two closed intervals is a set of real numbers that is either empty or represented as a closed interval. For example, the intersection of `[1, 3]` and `[2, 4]` is `[2, 3]`.

**Link to problem:** [Interval List Intersections - LeetCode 986](https://leetcode.com/problems/interval-list-intersections/)

## Constraints
- `0 <= firstList.length, secondList.length <= 1000`
- `firstList.length + secondList.length >= 1`
- `0 <= starti < endi <= 10^9`
- `endi < starti+1` (intervals are non-overlapping within each list)
- `0 <= startj < endj <= 10^9`
- `endj < startj+1` (intervals are non-overlapping within each list)

---

## Pattern: Two Pointers - Interval Intersection

This problem is a classic example of the **Two Pointers - Interval Intersection** pattern. The pattern involves using two pointers to traverse sorted lists and find overlapping regions.

### Core Concept

The fundamental idea is leveraging sorted, non-overlapping intervals:
- **Two Pointers**: Maintain pointers for both interval lists
- **Intersection Calculation**: The intersection of [a1, a2] and [b1, b2] is [max(a1, b1), min(a2, b2)]
- **Pointer Advancement**: Move the pointer with the smaller end value forward
- **Efficiency**: Each interval is visited at most once, achieving O(m + n) time

---

## Examples

### Example

**Input:**
```
firstList = [[0,2],[5,10],[13,23],[24,25]]
secondList = [[1,5],[8,12],[15,24],[25,26]]
```

**Output:**
```
[[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]
```

**Explanation:**
- [0,2] ∩ [1,5] = [1,2]
- [0,2] ∩ [8,12] = empty (no overlap)
- [5,10] ∩ [1,5] = [5,5] (touching endpoints count)
- [5,10] ∩ [8,12] = [8,10]
- [13,23] ∩ [15,24] = [15,23]
- [24,25] ∩ [15,24] = [24,24]
- [24,25] ∩ [25,26] = [25,25]

### Example 2: No Intersection

**Input:**
```
firstList = [[1,3],[5,9]]
secondList = []
```

**Output:**
```
[]
```

**Explanation:** Empty second list means no intersections.

### Example 3: Touching Endpoints

**Input:**
```
firstList = [[1,4],[10,14]]
secondList = [[4,6]]
```

**Output:**
```
[[4,4]]
```

**Explanation:** Intervals [1,4] and [4,6] intersect at point 4.

---

## Intuition

The key insight is that both lists are:
1. **Sorted** - We can use a linear scan
2. **Non-overlapping within each list** - Simplifies advancement logic

For each pair of intervals, we compute their intersection:
- Start of intersection = max(start1, start2)
- End of intersection = min(end1, end2)
- If start <= end, there's an intersection

After processing, we advance the pointer of the interval that ends earlier because it cannot possibly intersect with any future intervals in the other list.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Two Pointers (Optimal)** - O(m + n) time, O(1) extra space
2. **Merge-like Approach** - Similar to merging sorted arrays

---

## Approach 1: Two Pointers (Optimal)

This is the optimal solution with O(m + n) time complexity.

### Algorithm Steps

1. Initialize pointers i = 0 for firstList, j = 0 for secondList
2. While both pointers are within bounds:
   - Get current intervals: a = firstList[i], b = secondList[j]
   - Compute intersection: start = max(a[0], b[0]), end = min(a[1], b[1])
   - If start <= end, add [start, end] to result
   - Advance the pointer with smaller end value
3. Return result

### Why It Works

When one interval ends before the other, it can no longer intersect with any future intervals (since lists are sorted and non-overlapping). Moving the pointer forward ensures we only process necessary comparisons.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def intervalIntersection(self, firstList: List[List[int]], secondList: List[List[int]]) -> List[List[int]]:
        """
        Find intersections between two sorted interval lists using two pointers.
        
        Args:
            firstList: First list of intervals
            secondList: Second list of intervals
            
        Returns:
            List of intersecting intervals
        """
        result = []
        i, j = 0, 0
        
        while i < len(firstList) and j < len(secondList):
            a_start, a_end = firstList[i]
            b_start, b_end = secondList[j]
            
            # Calculate intersection
            start = max(a_start, b_start)
            end = min(a_end, b_end)
            
            # Add intersection if valid
            if start <= end:
                result.append([start, end])
            
            # Advance pointer with smaller end
            if a_end < b_end:
                i += 1
            else:
                j += 1
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<vector<int>> intervalIntersection(vector<vector<int>>& firstList, vector<vector<int>>& secondList) {
        vector<vector<int>> result;
        int i = 0, j = 0;
        
        while (i < firstList.size() && j < secondList.size()) {
            int aStart = firstList[i][0];
            int aEnd = firstList[i][1];
            int bStart = secondList[j][0];
            int bEnd = secondList[j][1];
            
            // Calculate intersection
            int start = max(aStart, bStart);
            int end = min(aEnd, bEnd);
            
            // Add intersection if valid
            if (start <= end) {
                result.push_back({start, end});
            }
            
            // Advance pointer with smaller end
            if (aEnd < bEnd) {
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
        List<int[]> result = new ArrayList<>();
        int i = 0, j = 0;
        
        while (i < firstList.length && j < secondList.length) {
            int aStart = firstList[i][0];
            int aEnd = firstList[i][1];
            int bStart = secondList[j][0];
            int bEnd = secondList[j][1];
            
            // Calculate intersection
            int start = Math.max(aStart, bStart);
            int end = Math.min(aEnd, bEnd);
            
            // Add intersection if valid
            if (start <= end) {
                result.add(new int[]{start, end});
            }
            
            // Advance pointer with smaller end
            if (aEnd < bEnd) {
                i++;
            } else {
                j++;
            }
        }
        
        return result.toArray(new int[result.size()][]);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} firstList
 * @param {number[][]} secondList
 * @return {number[][]}
 */
var intervalIntersection = function(firstList, secondList) {
    const result = [];
    let i = 0, j = 0;
    
    while (i < firstList.length && j < secondList.length) {
        const [aStart, aEnd] = firstList[i];
        const [bStart, bEnd] = secondList[j];
        
        // Calculate intersection
        const start = Math.max(aStart, bStart);
        const end = Math.min(aEnd, bEnd);
        
        // Add intersection if valid
        if (start <= end) {
            result.push([start, end]);
        }
        
        // Advance pointer with smaller end
        if (aEnd < bEnd) {
            i++;
        } else {
            j++;
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m + n) - Each interval visited at most once |
| **Space** | O(m + n) - Result storage (excluding output) |

---

## Approach 2: Merge-like Approach

Similar to merging two sorted arrays, this approach treats intervals as elements and finds all overlaps.

### Algorithm Steps

1. Use two pointers, similar to merge sort
2. For each pair of intervals, find intersection
3. Advance based on end values
4. Collect all intersections

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def intervalIntersection_merge(self, firstList: List[List[int]], secondList: List[List[int]]) -> List[List[int]]:
        """
        Find intersections using merge-like approach.
        """
        if not firstList or not secondList:
            return []
        
        result = []
        i = j = 0
        
        while i < len(firstList) and j < len(secondList):
            # Get current intervals
            a = firstList[i]
            b = secondList[j]
            
            # Check overlap
            overlap_start = max(a[0], b[0])
            overlap_end = min(a[1], b[1])
            
            if overlap_start <= overlap_end:
                result.append([overlap_start, overlap_end])
            
            # Move the pointer that ends first
            if a[1] < b[1]:
                i += 1
            elif a[1] > b[1]:
                j += 1
            else:
                i += 1
                j += 1
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<vector<int>> intervalIntersection(vector<vector<int>>& firstList, vector<vector<int>>& secondList) {
        if (firstList.empty() || secondList.empty()) {
            return {};
        }
        
        vector<vector<int>> result;
        int i = 0, j = 0;
        
        while (i < firstList.size() && j < secondList.size()) {
            int start = max(firstList[i][0], secondList[j][0]);
            int end = min(firstList[i][1], secondList[j][1]);
            
            if (start <= end) {
                result.push_back({start, end});
            }
            
            if (firstList[i][1] < secondList[j][1]) {
                i++;
            } else if (firstList[i][1] > secondList[j][1]) {
                j++;
            } else {
                i++;
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
            int start = Math.max(firstList[i][0], secondList[j][0]);
            int end = Math.min(firstList[i][1], secondList[j][1]);
            
            if (start <= end) {
                result.add(new int[]{start, end});
            }
            
            if (firstList[i][1] < secondList[j][1]) {
                i++;
            } else if (firstList[i][1] > secondList[j][1]) {
                j++;
            } else {
                i++;
                j++;
            }
        }
        
        return result.toArray(new int[result.size()][]);
    }
}
```

<!-- slide -->
```javascript
var intervalIntersection = function(firstList, secondList) {
    if (!firstList || !secondList || 
        firstList.length === 0 || secondList.length === 0) {
        return [];
    }
    
    const result = [];
    let i = 0, j = 0;
    
    while (i < firstList.length && j < secondList.length) {
        const start = Math.max(firstList[i][0], secondList[j][0]);
        const end = Math.min(firstList[i][1], secondList[j][1]);
        
        if (start <= end) {
            result.push([start, end]);
        }
        
        if (firstList[i][1] < secondList[j][1]) {
            i++;
        } else if (firstList[i][1] > secondList[j][1]) {
            j++;
        } else {
            i++;
            j++;
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m + n) - Each interval visited at most once |
| **Space** | O(m + n) - Result storage |

---

## Comparison of Approaches

| Aspect | Two Pointers | Merge-like |
|--------|--------------|------------|
| **Time Complexity** | O(m + n) | O(m + n) |
| **Space Complexity** | O(m + n) | O(m + n) |
| **Implementation** | Simple | Simple |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes |

**Best Approach:** Both approaches are equivalent in complexity. The two-pointer approach is the standard solution.

---

## Why Two Pointers is Optimal

The two-pointer approach is optimal because:

1. **Linear Scan**: Each interval is visited at most once
2. **No Redundant Comparisons**: Pointers advance optimally
3. **Sorted Property**: Leverages sorted, non-overlapping input
4. **Industry Standard**: Widely accepted solution for interval problems
5. **Minimal Operations**: Constant work per iteration

---

## Related Problems

Based on similar themes (interval problems, two pointers):

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Merge Intervals | [Link](https://leetcode.com/problems/merge-intervals/) | Merge overlapping intervals |
| Insert Interval | [Link](https://leetcode.com/problems/insert-interval/) | Insert new interval into sorted list |
| Employee Free Time | [Link](https://leetcode.com/problems/employee-free-time/) | Find common free time |
| Meeting Rooms II | [Link](https://leetcode.com/problems/meeting-rooms-ii/) | Minimum meeting rooms needed |

### Pattern Reference

For more detailed explanations of the Two Pointers pattern with intervals, see:
- **[Two Pointers - Interval Intersection Pattern](/patterns/two-pointers-interval-intersection)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Interval Problems

- [NeetCode - Interval List Intersections](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation
- [Interval Intersection Explained](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Detailed walkthrough
- [Two Pointers for Intervals](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Technique explanation

### Related Problems

- [Merge Intervals Solution](https://www.youtube.com/watch?v=8Q1nQkVGYQ8) - Similar pattern
- [Meeting Rooms II](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Interval scheduling

---

## Follow-up Questions

### Q1: How would you handle intervals that might overlap within the same list?

**Answer:** First merge the overlapping intervals in each list, then apply the intersection algorithm. This is similar to the "Merge Intervals" problem.

---

### Q2: What if the input lists were not sorted?

**Answer:** Sort both lists first by start time, then apply the two-pointer algorithm. This adds O(m log m + n log n) time complexity.

---

### Q3: How would you find the union instead of intersection?

**Answer:** Instead of taking the overlapping portion, you'd collect all intervals from both lists after merging overlapping ones. This is the "Merge Intervals" problem.

---

### Q4: How would you modify to find intervals where at least k lists intersect?

**Answer:** For k lists, maintain a min-heap of current intervals and track counts. This requires a more complex algorithm similar to "Employee Free Time".

---

### Q5: What edge cases should be tested?

**Answer:**
- Empty input lists
- Single interval in each list
- Complete overlap (one list contained in another)
- No intersection
- Touching endpoints ([1,2] and [2,3])
- Multiple small intersections
- Very large interval values

---

### Q6: How would you handle inclusive vs exclusive intervals?

**Answer:** For inclusive intervals [a,b], use <= for overlap check. For exclusive (a,b), use <. The problem uses closed intervals, so <= is correct.

---

### Q7: Can you solve it with O(1) extra space (excluding output)?

**Answer:** Yes! The algorithm itself uses only two pointers (O(1) space). Only the output requires O(m + n) space.

---

### Q8: How would you extend to 3D intervals (e.g., time and location)?

**Answer:** For 3D, you need all dimensions to overlap. Check each dimension separately and require all to have non-empty intersection.

---

## Common Pitfalls

### 1. Touching Endpoints
**Issue**: Forgetting that [1,2] and [2,3] have intersection at point 2

**Solution**: Use start <= end (not <) for intersection check with closed intervals

### 2. Pointer Advancement Logic
**Issue**: Advancing wrong pointer leads to missed intersections

**Solution**: Always advance the pointer with the smaller end value

### 3. Empty List Handling
**Issue**: Not handling empty input lists

**Solution**: Check for empty lists before entering loop

### 4. Off-by-One Errors
**Issue**: Using wrong comparison operators

**Solution**: Remember intervals are [start, end] inclusive

---

## Summary

The **Interval List Intersections** problem demonstrates the power of the two-pointer pattern for interval problems:

- **Two Pointers**: Optimal O(m + n) solution with simple implementation
- **Merge-like**: Equivalent approach with same complexity
- **Key Insight**: Advance pointer with smaller end value

The two-pointer approach is optimal because each interval is visited at most once, achieving linear time complexity.

### Pattern Summary

This problem exemplifies the **Two Pointers - Interval Intersection** pattern, which is characterized by:
- Processing sorted, non-overlapping intervals
- Using two pointers for simultaneous traversal
- Calculating intersection as [max(start1, start2), min(end1, end2)]
- Advancing based on end values

For more details on this pattern, see the **[Two Pointers Pattern](/patterns/two-pointers)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/interval-list-intersections/discuss/) - Community solutions
- [Interval Scheduling - GeeksforGeeks](https://www.geeksforgeeks.org/interval-subset-problem/) - Related problems
- [Two Pointers Technique](https://www.geeksforgeeks.org/two-pointers-technique/) - Understanding the pattern
- [Merge Intervals Pattern](https://en.wikipedia.org/wiki/Interval_(mathematics)) - Mathematical background
