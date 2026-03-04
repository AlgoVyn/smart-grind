# Merge Intervals

## Category
Arrays & Strings

## Description

The Merge Intervals problem is a fundamental algorithmic pattern that requires combining all overlapping intervals into a single set of non-overlapping intervals. This pattern appears frequently in interval scheduling, calendar management, resource allocation, and various computational geometry problems.

The key insight is that by sorting intervals by their start times, we can process them in a single pass, detecting and merging overlapping intervals efficiently.

---

## When to Use

Use the Merge Intervals algorithm when you need to solve problems involving:

- **Interval Overlap Detection**: Finding all overlapping intervals in a collection
- **Calendar Scheduling**: Merging overlapping meeting times or events
- **Resource Allocation**: Combining time slots that conflict
- **Range Merging**: Consolidating continuous or overlapping ranges
- **Sweep Line Problems**: Using intervals to track changes over time

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|----------------|------------------|---------------|
| **Sort + Single Pass** | O(n log n) | O(n) | Most interval merging problems |
| **Brute Force** | O(n²) | O(n) | Small datasets, educational purposes |
| **Interval Tree** | O(n log n + k) | O(n) | Dynamic interval insertion and query |
| **Sweep Line** | O(n log n) | O(n) | Finding all intersection points |

### When to Choose Different Approaches

- **Sort + Single Pass** (this algorithm):
  - When all intervals are given upfront
  - When you need to merge/collapse intervals
  - When simplicity and efficiency are priorities

- **Interval Tree**:
  - When intervals are added dynamically
  - When you need to query which intervals contain a point
  - When you need to find all overlaps for a given interval

- **Sweep Line**:
  - When finding all intersection points between intervals
  - When tracking state changes at interval boundaries
  - When solving problems like "meeting rooms needed"

---

## Algorithm Explanation

### Core Concept

The fundamental principle behind the merge intervals algorithm is that **sorting intervals ensures any by their start time overlapping intervals will be adjacent**. This allows us to process all intervals in a single linear scan after sorting.

### How It Works

#### Key Insight
When intervals are sorted by start time, we only need to compare each interval with the **last merged interval**:
- If the current interval overlaps with the last merged interval, extend the end of the last merged interval
- Otherwise, start a new merged interval

#### The Overlap Condition
Two intervals `[start1, end1]` and `[start2, end2]` overlap if and only if:
```
start2 <= end1
```
(Assuming start1 <= start2 after sorting)

#### Visual Representation

For input `[[1,3], [2,6], [8,10], [15,18]]`:

```
Step 1 - Sort by start time:
[[1,3], [2,6], [8,10], [15,18]]

Step 2 - Process each interval:

Initial: merged = [[1,3]]

[2,6]: 2 <= 3? YES → Overlaps! 
        Merge: [1, max(3,6)] = [1,6]
        merged = [[1,6]]

[8,10]: 8 <= 6? NO → No overlap
        Add new: merged = [[1,6], [8,10]]

[15,18]: 15 <= 10? NO → No overlap  
        Add new: merged = [[1,6], [8,10], [15,18]]

Final Result: [[1,6], [8,10], [15,18]]
```

### Edge Cases

1. **Empty input**: Return empty list
2. **Single interval**: Return the same interval
3. **Non-overlapping intervals**: Return sorted intervals as-is
4. **Completely overlapping intervals**: Merge all into one interval
5. **Touching intervals** `[1,4], [4,5]`: Merge (4 <= 4 is True)
6. **Reverse sorted input**: Sorting handles this correctly

### Why Sorting Works

- After sorting by start time, all potentially overlapping intervals are adjacent
- We only need to track the "current merged interval" 
- Each interval is processed exactly once → O(n) after sorting
- The overlap check is O(1)

---

## Algorithm Steps

### Step-by-Step Approach

1. **Handle Edge Cases**
   - If intervals list is empty, return empty list
   - If intervals has only one interval, return it

2. **Sort Intervals**
   - Sort by start time (first element of each interval)
   - This ensures adjacent intervals are candidates for merging
   - Time: O(n log n)

3. **Initialize Result**
   - Start with the first interval in the sorted list
   - This becomes our first "merged" interval

4. **Iterate and Merge**
   - For each subsequent interval:
     - Check if it overlaps with the last interval in result
     - **If overlap**: Extend the end of last interval to max(end1, end2)
     - **If no overlap**: Add the current interval to result

5. **Return Result**
   - The result list now contains all merged non-overlapping intervals

### Pseudocode

```
function merge(intervals):
    if intervals is empty:
        return []
    
    sort intervals by start time
    
    merged = [intervals[0]]
    
    for each (start, end) in intervals[1:]:
        lastEnd = merged[last][1]
        
        if start <= lastEnd:  // overlap
            merged[last][1] = max(lastEnd, end)
        else:                  // no overlap
            merged.append([start, end])
    
    return merged
```

---

## Implementation

### Template Code (Merge Intervals)

````carousel
```python
def merge_intervals(intervals):
    """
    Merge overlapping intervals.
    
    Args:
        intervals: List of [start, end] intervals
    
    Returns:
        List of merged non-overlapping intervals
    
    Time: O(n log n) - sorting dominates
    Space: O(n) - for storing result
    """
    if not intervals:
        return []
    
    # Sort intervals by start time
    sorted_intervals = sorted(intervals, key=lambda x: x[0])
    
    merged = [sorted_intervals[0]]
    
    for current_start, current_end in sorted_intervals[1:]:
        last_end = merged[-1][1]
        
        # If current interval overlaps with previous, merge them
        if current_start <= last_end:
            merged[-1][1] = max(last_end, current_end)
        else:
            # No overlap, add new interval
            merged.append([current_start, current_end])
    
    return merged


# Example usage
if __name__ == "__main__":
    # Example 1: Standard case
    intervals1 = [[1, 3], [2, 6], [8, 10], [15, 18]]
    print(f"Input:  {intervals1}")
    print(f"Output: {merge_intervals(intervals1)}")
    # Output: [[1, 6], [8, 10], [15, 18]]
    
    # Example 2: Touching intervals
    intervals2 = [[1, 4], [4, 5]]
    print(f"\nInput:  {intervals2}")
    print(f"Output: {merge_intervals(intervals2)}")
    # Output: [[1, 5]]
    
    # Example 3: All overlapping
    intervals3 = [[1, 4], [2, 3]]
    print(f"\nInput:  {intervals3}")
    print(f"Output: {merge_intervals(intervals3)}")
    # Output: [[1, 4]]
    
    # Example 4: No overlapping
    intervals4 = [[1, 4], [5, 6]]
    print(f"\nInput:  {intervals4}")
    print(f"Output: {merge_intervals(intervals4)}")
    # Output: [[1, 4], [5, 6]]
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

/**
 * Merge overlapping intervals.
 * 
 * Time Complexity: O(n log n) - sorting dominates
 * Space Complexity: O(n) - for storing result
 * 
 * @param intervals Vector of [start, end] intervals
 * @return Vector of merged non-overlapping intervals
 */
vector<vector<int>> mergeIntervals(vector<vector<int>>& intervals) {
    if (intervals.empty()) {
        return {};
    }
    
    // Sort intervals by start time
    sort(intervals.begin(), intervals.end(), 
         [](const vector<int>& a, const vector<int>& b) {
             return a[0] < b[0];
         });
    
    vector<vector<int>> merged;
    merged.push_back(intervals[0]);
    
    for (size_t i = 1; i < intervals.size(); i++) {
        int currentStart = intervals[i][0];
        int currentEnd = intervals[i][1];
        int lastEnd = merged.back()[1];
        
        // If current interval overlaps with previous, merge them
        if (currentStart <= lastEnd) {
            merged.back()[1] = max(lastEnd, currentEnd);
        } else {
            // No overlap, add new interval
            merged.push_back(intervals[i]);
        }
    }
    
    return merged;
}

// Helper function to print intervals
void printIntervals(const vector<vector<int>>& intervals) {
    cout << "[";
    for (size_t i = 0; i < intervals.size(); i++) {
        cout << "[" << intervals[i][0] << ", " << intervals[i][1] << "]";
        if (i < intervals.size() - 1) cout << ", ";
    }
    cout << "]" << endl;
}

int main() {
    // Example 1: Standard case
    vector<vector<int>> intervals1 = {{1, 3}, {2, 6}, {8, 10}, {15, 18}};
    cout << "Input:  ";
    printIntervals(intervals1);
    cout << "Output: ";
    printIntervals(mergeIntervals(intervals1));
    // Output: [[1, 6], [8, 10], [15, 18]]
    
    // Example 2: Touching intervals
    vector<vector<int>> intervals2 = {{1, 4}, {4, 5}};
    cout << "\nInput:  ";
    printIntervals(intervals2);
    cout << "Output: ";
    printIntervals(mergeIntervals(intervals2));
    // Output: [[1, 5]]
    
    // Example 3: All overlapping
    vector<vector<int>> intervals3 = {{1, 4}, {2, 3}};
    cout << "\nInput:  ";
    printIntervals(intervals3);
    cout << "Output: ";
    printIntervals(mergeIntervals(intervals3));
    // Output: [[1, 4]]
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Merge overlapping intervals.
 * 
 * Time Complexity: O(n log n) - sorting dominates
 * Space Complexity: O(n) - for storing result
 */
public class MergeIntervals {
    
    /**
     * Merge overlapping intervals.
     * 
     * @param intervals List of int[] where each int[] is [start, end]
     * @return List of merged non-overlapping intervals
     */
    public static int[][] merge(int[][] intervals) {
        if (intervals == null || intervals.length == 0) {
            return new int[0][];
        }
        
        // Sort intervals by start time
        Arrays.sort(intervals, (a, b) -> Integer.compare(a[0], b[0]));
        
        List<int[]> merged = new ArrayList<>();
        merged.add(intervals[0]);
        
        for (int i = 1; i < intervals.length; i++) {
            int currentStart = intervals[i][0];
            int currentEnd = intervals[i][1];
            int lastEnd = merged.get(merged.size() - 1)[1];
            
            // If current interval overlaps with previous, merge them
            if (currentStart <= lastEnd) {
                merged.get(merged.size() - 1)[1] = Math.max(lastEnd, currentEnd);
            } else {
                // No overlap, add new interval
                merged.add(intervals[i]);
            }
        }
        
        return merged.toArray(new int[0][]);
    }
    
    // Alternative: Using List<int[]> for clearer API
    public static List<int[]> mergeAsList(List<int[]> intervals) {
        if (intervals == null || intervals.isEmpty()) {
            return new ArrayList<>();
        }
        
        // Sort by start time
        intervals.sort(Comparator.comparingInt(a -> a[0]));
        
        List<int[]> merged = new ArrayList<>();
        merged.add(intervals.get(0));
        
        for (int i = 1; i < intervals.size(); i++) {
            int[] current = intervals.get(i);
            int[] last = merged.get(merged.size() - 1);
            
            if (current[0] <= last[1]) {
                // Overlap - extend the end
                last[1] = Math.max(last[1], current[1]);
            } else {
                // No overlap - add new interval
                merged.add(current);
            }
        }
        
        return merged;
    }
    
    // Test the implementation
    public static void main(String[] args) {
        // Example 1: Standard case
        int[][] intervals1 = {{1, 3}, {2, 6}, {8, 10}, {15, 18}};
        System.out.print("Input:  ");
        printIntervals(intervals1);
        System.out.print("Output: ");
        printIntervals(merge(intervals1));
        
        // Example 2: Touching intervals
        int[][] intervals2 = {{1, 4}, {4, 5}};
        System.out.print("\nInput:  ");
        printIntervals(intervals2);
        System.out.print("Output: ");
        printIntervals(merge(intervals2));
        
        // Example 3: All overlapping
        int[][] intervals3 = {{1, 4}, {2, 3}};
        System.out.print("\nInput:  ");
        printIntervals(intervals3);
        System.out.print("Output: ");
        printIntervals(merge(intervals3));
    }
    
    private static void printIntervals(int[][] intervals) {
        System.out.print("[");
        for (int i = 0; i < intervals.length; i++) {
            System.out.print("[" + intervals[i][0] + ", " + intervals[i][1] + "]");
            if (i < intervals.length - 1) System.out.print(", ");
        }
        System.out.println("]");
    }
}
```

<!-- slide -->
```javascript
/**
 * Merge overlapping intervals.
 * 
 * Time Complexity: O(n log n) - sorting dominates
 * Space Complexity: O(n) - for storing result
 * 
 * @param {number[][]} intervals - Array of [start, end] intervals
 * @returns {number[][]} - Array of merged non-overlapping intervals
 */
function mergeIntervals(intervals) {
    if (!intervals || intervals.length === 0) {
        return [];
    }
    
    // Sort by start time (creating copy to avoid mutating input)
    const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
    
    const merged = [sorted[0]];
    
    for (let i = 1; i < sorted.length; i++) {
        const [start, end] = sorted[i];
        const lastEnd = merged[merged.length - 1][1];
        
        if (start <= lastEnd) {
            // Overlap - extend the end
            merged[merged.length - 1][1] = Math.max(lastEnd, end);
        } else {
            // No overlap - add new interval
            merged.push([start, end]);
        }
    }
    
    return merged;
}

// Alternative: In-place modification
function mergeIntervalsInPlace(intervals) {
    if (!intervals || intervals.length === 0) {
        return [];
    }
    
    // Sort in place
    intervals.sort((a, b) => a[0] - b[0]);
    
    const merged = [intervals[0]];
    
    for (let i = 1; i < intervals.length; i++) {
        const current = intervals[i];
        const last = merged[merged.length - 1];
        
        if (current[0] <= last[1]) {
            last[1] = Math.max(last[1], current[1]);
        } else {
            merged.push(current);
        }
    }
    
    return merged;
}

// Test the implementation
function runTests() {
    // Example 1: Standard case
    const intervals1 = [[1, 3], [2, 6], [8, 10], [15, 18]];
    console.log('Input: ', JSON.stringify(intervals1));
    console.log('Output:', JSON.stringify(mergeIntervals(intervals1)));
    // Output: [[1, 6], [8, 10], [15, 18]]
    
    // Example 2: Touching intervals
    const intervals2 = [[1, 4], [4, 5]];
    console.log('\nInput: ', JSON.stringify(intervals2));
    console.log('Output:', JSON.stringify(mergeIntervals(intervals2)));
    // Output: [[1, 5]]
    
    // Example 3: All overlapping
    const intervals3 = [[1, 4], [2, 3]];
    console.log('\nInput: ', JSON.stringify(intervals3));
    console.log('Output:', JSON.stringify(mergeIntervals(intervals3)));
    // Output: [[1, 4]]
    
    // Example 4: No overlapping
    const intervals4 = [[1, 4], [5, 6]];
    console.log('\nInput: ', JSON.stringify(intervals4));
    console.log('Output:', JSON.stringify(mergeIntervals(intervals4)));
    // Output: [[1, 4], [5, 6]]
    
    // Example 5: Empty input
    const intervals5 = [];
    console.log('\nInput: ', JSON.stringify(intervals5));
    console.log('Output:', JSON.stringify(mergeIntervals(intervals5)));
    // Output: []
    
    // Example 6: Single interval
    const intervals6 = [[1, 5]];
    console.log('\nInput: ', JSON.stringify(intervals6));
    console.log('Output:', JSON.stringify(mergeIntervals(intervals6)));
    // Output: [[1, 5]]
}

runTests();
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Sorting** | O(n log n) | Dominant factor - must sort all intervals |
| **Single Pass Merge** | O(n) | Each interval processed once |
| **Total** | **O(n log n)** | Sorting dominates |
| **Space (Output)** | O(n) | Worst case: no merging, all intervals distinct |
| **Space (Auxiliary)** | O(1) | In-place merging if input list can be modified |

### Detailed Breakdown

- **Sorting**: O(n log n) using comparison-based sort (TimSort in Python, sort in other languages)
- **Merging**: O(n) - single linear scan through sorted intervals
- **Total**: O(n log n) + O(n) = **O(n log n)**

### When Time Complexity Matters

- **Best case**: O(n log n) - even when all intervals can be merged
- **Worst case**: O(n log n) - sorting dominates regardless
- **Note**: You cannot achieve better than O(n log n) because any algorithm must at least examine each interval's start and end values

---

## Space Complexity Analysis

| Component | Space | Notes |
|-----------|-------|-------|
| **Output Array** | O(n) | Stores merged intervals |
| **Sorted Copy** | O(n) | If creating sorted copy |
| **In-Place Sort** | O(1) extra | Most languages sort in-place |

### Space Optimization

- **In-place sorting**: Most implementations sort the input array in-place, using O(1) extra space
- **Avoid copy**: Use `sorted(intervals, key=...)` in Python creates a new list; consider `intervals.sort(key=...)` for in-place
- **Minimizing allocations**: Reuse the input array when possible

---

## Common Variations

### 1. Insert Interval

Insert a new interval into an existing set of non-overlapping intervals and merge if necessary.

````carousel
```python
def insert_interval(intervals, new_interval):
    """Insert a new interval into merged intervals."""
    intervals.append(new_interval)
    return merge_intervals(intervals)
```
````

### 2. Meeting Rooms

Determine the minimum number of meeting rooms needed:

````carousel
```python
def min_meeting_rooms(intervals):
    """Find minimum meeting rooms needed."""
    if not intervals:
        return 0
    
    # Extract all start and end times
    starts = sorted([i[0] for i in intervals])
    ends = sorted([i[1] for i in intervals])
    
    rooms = 0
    max_rooms = 0
    i = 0  # for starts
    j = 0  # for ends
    
    while i < len(intervals):
        if starts[i] < ends[j]:
            rooms += 1
            max_rooms = max(max_rooms, rooms)
            i += 1
        else:
            rooms -= 1
            j += 1
    
    return max_rooms
```
````

### 3. Employee Free Time

Find common free time for all employees:

````carousel
```python
def employee_free_time(schedules):
    """Find common free time across all employees."""
    # Flatten and merge all intervals
    all_intervals = [interval for employee in schedules for interval in employee]
    merged = merge_intervals(all_intervals)
    
    # Find gaps between merged intervals
    free_time = []
    for i in range(1, len(merged)):
        free_time.append([merged[i-1][1], merged[i][0]])
    
    return free_time
```
````

### 4. Interval Intersection

Find the intersection of two sets of intervals:

````carousel
```python
def interval_intersection(intervals1, intervals2):
    """Find intersection of two interval lists."""
    result = []
    i = j = 0
    
    intervals1 = sorted(intervals1, key=lambda x: x[0])
    intervals2 = sorted(intervals2, key=lambda x: x[0])
    
    while i < len(intervals1) and j < len(intervals2):
        start1, end1 = intervals1[i]
        start2, end2 = intervals2[j]
        
        # Check for overlap
        start = max(start1, start2)
        end = min(end1, end2)
        
        if start <= end:
            result.append([start, end])
        
        # Move the pointer with smaller end
        if end1 < end2:
            i += 1
        else:
            j += 1
    
    return result
```
````

### 5. Non-overlapping Intervals

Count minimum intervals to remove to make them non-overlapping:

````carousel
```python
def erase_overlap_intervals(intervals):
    """Minimum intervals to remove to make non-overlapping."""
    if not intervals:
        return 0
    
    # Sort by end time (greedy approach)
    intervals.sort(key=lambda x: x[1])
    
    count = 0
    prev_end = intervals[0][1]
    
    for i in range(1, len(intervals)):
        if intervals[i][0] < prev_end:
            count += 1  # Need to remove this interval
        else:
            prev_end = intervals[i][1]
    
    return count
```
````

---

## Practice Problems

### Problem 1: Merge Intervals

**Problem:** [LeetCode 56 - Merge Intervals](https://leetcode.com/problems/merge-intervals/)

**Description:** Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.

**How to Apply the Technique:**
- Sort intervals by start time
- Iterate and merge overlapping intervals
- Time complexity: O(n log n) for sorting

---

### Problem 2: Meeting Rooms II

**Problem:** [LeetCode 253 - Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/)

**Description:** Given an array of meeting time intervals where intervals[i] = [starti, endi], find the minimum number of conference rooms required.

**How to Apply the Technique:**
- First approach: Use merge intervals + sweep line
- Sort all start times and end times separately
- Count overlapping meetings at each point
- Alternative: Use min-heap to track room end times

---

### Problem 3: Non-overlapping Intervals

**Problem:** [LeetCode 435 - Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)

**Description:** Given an array of intervals intervals[i] = [starti, endi], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.

**How to Apply the Technique:**
- Sort by end time (not start time!)
- Greedy: always remove the interval that ends later
- Count intervals that can be kept, subtract from total

---

### Problem 4: Insert Interval

**Problem:** [LeetCode 57 - Insert Interval](https://leetcode.com/problems/insert-interval/)

**Description:** You are given an array of non-overlapping intervals intervals where intervals[i] = [starti, endi] represent the start and the end of the intervals and intervals is sorted in ascending order by starti. Insert newInterval into intervals such that intervals is still sorted in ascending order by starti and intervals still does not have any overlapping intervals.

**How to Apply the Technique:**
- Add new interval to list
- Apply standard merge intervals algorithm
- Or: binary search for insertion point + merge locally

---

### Problem 5: Interval List Intersections

**Problem:** [LeetCode 986 - Interval List Intersections](https://leetcode.com/problems/interval-list-intersections/)

**Description:** You are given two lists of closed intervals, firstList and secondList, where firstList[i] = [starti, endi] and secondList[j] = [startj, endj]. The lists are sorted in ascending order by start. Return the intersection of these interval lists.

**How to Apply the Technique:**
- Use two pointers, one for each list
- At each step, find intersection of current intervals
- Move the pointer with smaller end time forward

---

## Video Tutorial Links

### Fundamentals

- [Merge Intervals - Concept and Implementation (Take U Forward)](https://www.youtube.com/watch?v=2F4r0N2u4vU) - Comprehensive introduction
- [Merge Intervals - LeetCode Explained (NeetCode)](https://www.youtube.com/watch?v=2W2y2X8X7Qw) - Step-by-step solution
- [Interval Problems - Pattern Overview (Back to Back SWE)](https://www.youtube.com/watch?v=44H3cE4_xjI) - Multiple interval patterns

### Problem-Specific

- [Meeting Rooms II - Minimum Rooms (WilliamFiset)](https://www.youtube.com/watch?v=zb72gK9jGNY) - Detailed explanation
- [Non-overlapping Intervals - Greedy Approach](https://www.youtube.com/watch?v=2F4r0N2u4vU) - Greedy solution
- [Insert Interval - LeetCode Solution](https://www.youtube.com/watch?v=1j4Q3i56p1I) - Edge case handling

### Advanced Topics

- [Sweep Line Algorithm](https://www.youtube.com/watch?v=4GS5DPD3g3s) - For complex interval problems
- [Interval Scheduling - Theory](https://www.youtube.com/watch?v=sz-ZRbtz2W8) - Greedy optimization
- [Divide and Conquer with Intervals](https://www.youtube.com/watch?v=r1s4L9z8W3A) - Advanced techniques

---

## Follow-up Questions

### Q1: Why do we sort by start time instead of end time?

**Answer:** Sorting by start time ensures that any overlapping intervals will be adjacent in the sorted list. When we process intervals sequentially, we only need to compare each interval with the last merged interval. If we sorted by end time, we would need to check against multiple previous intervals, losing the O(n) single-pass property.

However, for some variations like "non-overlapping intervals," sorting by end time is actually better because it enables a greedy approach that always keeps intervals that end earliest.

### Q2: How would you handle intervals with negative numbers or large values?

**Answer:** The algorithm works identically regardless of the values:
- The sorting step compares numeric values regardless of sign
- The overlap condition `start <= last_end` works for any integers
- Only concern is integer overflow in languages like C++/Java for very large values - use 64-bit integers

### Q3: Can this algorithm be modified to handle floating-point intervals?

**Answer:** Yes, with minor modifications:
- Replace integer comparison with floating-point comparison
- Add an epsilon value for "touching" intervals: `start <= last_end + epsilon`
- Sorting works the same way
- Be careful with floating-point precision issues

### Q4: How would you merge intervals in place to save space?

**Answer:** Many implementations already do this:
- Sort the array in-place (most languages support this)
- Use the sorted array as both input and output storage
- This reduces space from O(n) to O(1) auxiliary space
- In Python: `intervals.sort(key=lambda x: x[0])` then merge

### Q5: What if intervals can have the same start time but different end times?

**Answer:** The algorithm handles this correctly:
- After sorting, intervals with same start time are adjacent
- They will be merged because `start <= last_end` will be true
- They effectively become one interval with the maximum end time
- Example: [[1,3], [1,5]] → [[1,5]]

### Q6: How do you handle the case where intervals are given as objects or custom data structures?

**Answer:** The core algorithm remains the same:
1. Extract start and end values from your data structure
2. Sort using a custom comparator or key function
3. Apply the merge logic
4. Convert back to your desired output format

The pattern is language-agnostic - only the syntax for accessing fields changes.

---

## Summary

The Merge Intervals algorithm is a fundamental pattern for handling interval-based problems. Key takeaways:

- **Core insight**: Sort by start time, merge in single pass
- **Time complexity**: O(n log n) due to sorting
- **Space complexity**: O(n) for output, O(1) auxiliary
- **Key condition**: Overlap when `current_start <= last_end`

When to use:
- ✅ Merging overlapping intervals
- ✅ Finding minimum meeting rooms
- ✅ Calendar scheduling problems
- ✅ Resource allocation problems
- ❌ When intervals are dynamically added (use Interval Tree)
- ❌ When you need to find all overlaps for a specific interval

This pattern is essential for:
1. **Technical interviews** - Frequently asked at major tech companies
2. **Competitive programming** - Foundation for many interval problems
3. **Real-world applications** - Calendar apps, scheduling systems

The algorithm's elegance lies in its simplicity: just sort and scan. This makes it both easy to implement and easy to understand, while still being optimal for the problem constraints.

---

## Related Algorithms

- [Sort + Two Pointers](./two-pointers.md) - Related pattern for sorted arrays
- [Sweep Line](./sweep-line.md) - Advanced interval techniques
- [Interval Tree](./interval-tree.md) - For dynamic interval operations
- [Meeting Rooms](./meeting-rooms.md) - Practical application of the pattern
