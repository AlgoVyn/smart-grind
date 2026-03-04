# Activity Selection

## Category
Greedy

## Description

The Activity Selection problem is a classic **greedy algorithm** problem where we need to select the maximum number of non-overlapping activities from a given set. Each activity has a start time and an end time, and two activities are considered non-overlapping if one finishes before (or exactly when) the other starts.

This problem demonstrates the power of greedy algorithms where making locally optimal choices (selecting the earliest finishing activity) leads to a globally optimal solution.

---

## When to Use

Use the Activity Selection algorithm when you need to solve problems involving:

- **Interval Scheduling**: Selecting maximum number of non-overlapping intervals
- **Resource Allocation**: Scheduling tasks that don't conflict with each other
- **Event Planning**: Finding maximum events that can attend
- **Greedy Optimization**: Problems where local optimal leads to global optimal

### Comparison with Alternatives

| Approach | Time Complexity | Use Case |
|----------|-----------------|----------|
| **Activity Selection (Greedy)** | O(n log n) | When you need maximum non-overlapping activities |
| **Dynamic Programming** | O(n²) or O(n log n) | When weights are involved (Weighted Interval Scheduling) |
| **Backtracking** | Exponential | When you need ALL possible combinations |
| **Sort + Scan** | O(n log n) | Similar to greedy, different implementation |

### When to Choose Activity Selection vs Other Approaches

- **Choose Activity Selection (Greedy)** when:
  - You need the maximum number of non-overlapping intervals
  - All intervals have equal "value" or weight
  - You want O(n log n) solution
  - The problem has the "earliest finish time" property

- **Choose Dynamic Programming** when:
  - Each interval has a different weight/value
  - You need weighted interval scheduling
  - The greedy property doesn't hold

- **Choose Backtracking** when:
  - You need to find all possible valid combinations
  - The problem requires enumeration of solutions

---

## Algorithm Explanation

### Core Concept

The key insight behind the Activity Selection algorithm is that by always selecting the activity that **finishes earliest**, we maximize the remaining time available for other activities. This greedy choice property ensures optimality because:

1. **Earliest Finish = Most Room**: The activity that ends earliest leaves the maximum time window for subsequent activities
2. **Optimal Substructure**: If we select the earliest-finishing activity, the remaining problem (selecting from the activities that start after it ends) is a smaller instance of the same problem
3. **No Regret**: Selecting the earliest finisher never eliminates a better solution because any optimal solution that doesn't include the earliest finisher can be modified to include it without reducing the number of activities

### How It Works

#### Algorithm Steps:

1. **Sort activities by end time** (ascending order). If two activities have the same end time, sort by start time (ascending).

2. **Select the first activity** from the sorted list (the one that finishes earliest).

3. **For each remaining activity** (in sorted order):
   - If the activity's start time is **greater than or equal to** the last selected activity's end time:
     - Select this activity
     - Update the "last selected activity" to this one

4. **Repeat** until all activities are processed.

### Visual Representation

Consider activities with (start, end) times:
```
Activity 0: [1, 4]
Activity 1: [3, 5]
Activity 2: [0, 6]
Activity 3: [5, 7]
Activity 4: [3, 9]
Activity 5: [5, 9]
Activity 6: [6, 10]
Activity 7: [8, 11]
```

After sorting by end time:
```
[1, 4] → Activity 0
[3, 5] → Activity 1
[5, 7] → Activity 3
[6, 10] → Activity 6
[8, 11] → Activity 7
[0, 6] → Activity 2
[3, 9] → Activity 4
[5, 9] → Activity 5
```

Selection process:
1. Select [1, 4] (earliest end)
2. Skip [3, 5] (starts at 3 < 4, overlaps)
3. Select [5, 7] (starts at 5 ≥ 4)
4. Skip [6, 10] (starts at 6 < 7, overlaps)
5. Select [8, 11] (starts at 8 ≥ 7)
6. Result: [[1,4], [5,7], [8,11]] = 3 activities

### Why Greedy Works

The Activity Selection problem satisfies two key properties that make greedy work:

1. **Greedy Choice Property**: Choosing the activity that finishes earliest is always part of some optimal solution. If there's an optimal solution that doesn't include the earliest-finishing activity, we can swap the first activity in that solution with the earliest-finishing one without reducing the number of activities.

2. **Optimal Substructure**: After selecting the earliest-finishing activity, the remaining problem (selecting from activities that start after it ends) is itself an activity selection problem. The optimal solution to the whole problem consists of the greedy choice plus the optimal solution to the subproblem.

### Edge Cases to Consider

- **Empty input**: Return empty result
- **Single activity**: Return that activity
- **All overlapping activities**: Return only 1 activity
- **All non-overlapping activities**: Return all activities
- **Activities with same end time**: Sort by start time, pick the one starting earlier

---

## Algorithm Steps

### Detailed Step-by-Step Approach

1. **Input**: List of n activities, each with (start_time, end_time)

2. **Preprocessing**:
   - Create a list of tuples: (end_time, start_time, original_index)
   - Sort this list by end_time (ascending), then by start_time (ascending)

3. **Initialization**:
   - Create an empty result list
   - Select the first activity from sorted list
   - Add its original index to result
   - Set `last_end_time` = end_time of first selected activity

4. **Iteration** (for each activity i from 1 to n-1):
   - Get the start_time of current activity
   - If start_time >= last_end_time:
     - Add this activity's original index to result
     - Update last_end_time = current activity's end_time

5. **Return**: The indices of selected activities

---

## Implementation

### Template Code (Activity Selection)

````carousel
```python
from typing import List, Tuple


def activity_selection(activities: List[Tuple[int, int]]) -> List[int]:
    """
    Select maximum number of non-overlapping activities.
    
    Args:
        activities: List of (start, end) tuples for each activity
    
    Returns:
        Indices of selected non-overlapping activities
    
    Time: O(n log n) for sorting
    Space: O(n) for storing indices (excluding input storage)
    """
    if not activities:
        return []
    
    n = len(activities)
    
    # Create list of (end, start, original_index) and sort by end time
    # This handles sorting while keeping track of original indices
    sorted_activities = sorted(
        [(activities[i][1], activities[i][0], i) for i in range(n)],
        key=lambda x: (x[0], x[1])
    )
    
    # Select first activity (earliest end time)
    result = [sorted_activities[0][2]]  # Store original index
    last_end_time = sorted_activities[0][0]
    
    # Select subsequent non-overlapping activities
    for i in range(1, n):
        start_time = sorted_activities[i][1]
        
        # If this activity starts after or when the last one ends
        if start_time >= last_end_time:
            result.append(sorted_activities[i][2])  # Store original index
            last_end_time = sorted_activities[i][0]
    
    return result


def activity_selection_intervals(intervals: List[Tuple[int, int]]) -> List[Tuple[int, int]]:
    """
    Alternative version that returns the actual intervals instead of indices.
    
    Args:
        intervals: List of (start, end) tuples
    
    Returns:
        List of selected non-overlapping intervals
    """
    if not intervals:
        return []
    
    # Sort by end time
    sorted_intervals = sorted(intervals, key=lambda x: x[1])
    
    # Select first interval
    result = [sorted_intervals[0]]
    last_end = sorted_intervals[0][1]
    
    # Select subsequent non-overlapping intervals
    for start, end in sorted_intervals[1:]:
        if start >= last_end:
            result.append((start, end))
            last_end = end
    
    return result


# Example usage
if __name__ == "__main__":
    # Activities: (start_time, end_time)
    activities = [
        (1, 4),   # Activity 0: 1pm - 4pm
        (3, 5),   # Activity 1: 3pm - 5pm
        (0, 6),   # Activity 2: 12pm - 6pm
        (5, 7),   # Activity 3: 5pm - 7pm
        (3, 9),   # Activity 4: 3pm - 9pm
        (5, 9),   # Activity 5: 5pm - 9pm
        (6, 10),  # Activity 6: 6pm - 10pm
        (8, 11),  # Activity 7: 8pm - 11pm
    ]
    
    print("Activity Selection Problem")
    print("=" * 40)
    print("\nActivities (start, end):")
    for i, (s, e) in enumerate(activities):
        print(f"  Activity {i}: {s}:00 - {e}:00")
    
    # Get indices of selected activities
    selected_indices = activity_selection(activities)
    print(f"\nSelected activity indices: {selected_indices}")
    
    # Get actual intervals
    selected_intervals = activity_selection_intervals(activities)
    print("\nSelected non-overlapping activities:")
    for idx in selected_indices:
        s, e = activities[idx]
        print(f"  Activity {idx}: {s}:00 - {e}:00")
    
    print(f"\nMaximum number of activities: {len(selected_indices)}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

/**
 * Activity Selection Algorithm
 * 
 * Select maximum number of non-overlapping activities.
 * 
 * Time Complexity: O(n log n) for sorting
 * Space Complexity: O(n) for storing result
 */
vector<int> activitySelection(const vector<pair<int, int>>& activities) {
    int n = activities.size();
    if (n == 0) return {};
    
    // Create vector of (end, start, original_index) and sort by end time
    vector<tuple<int, int, int>> sortedActivities;
    sortedActivities.reserve(n);
    
    for (int i = 0; i < n; i++) {
        sortedActivities.emplace_back(activities[i].second, activities[i].first, i);
    }
    
    sort(sortedActivities.begin(), sortedActivities.end(),
         [](const auto& a, const auto& b) {
             if (get<0>(a) != get<0>(b)) return get<0>(a) < get<0>(b);
             return get<1>(a) < get<1>(b);
         });
    
    // Select first activity
    vector<int> result;
    result.push_back(get<2>(sortedActivities[0]));
    int lastEndTime = get<0>(sortedActivities[0]);
    
    // Select subsequent non-overlapping activities
    for (int i = 1; i < n; i++) {
        int startTime = get<1>(sortedActivities[i]);
        
        if (startTime >= lastEndTime) {
            result.push_back(get<2>(sortedActivities[i]));
            lastEndTime = get<0>(sortedActivities[i]);
        }
    }
    
    return result;
}

// Alternative version returning intervals
vector<pair<int, int>> activitySelectionIntervals(const vector<pair<int, int>>& intervals) {
    int n = intervals.size();
    if (n == 0) return {};
    
    // Sort by end time
    vector<pair<int, int>> sortedIntervals = intervals;
    sort(sortedIntervals.begin(), sortedIntervals.end(),
         [](const auto& a, const auto& b) {
             if (a.second != b.second) return a.second < b.second;
             return a.first < b.first;
         });
    
    // Select first interval
    vector<pair<int, int>> result;
    result.push_back(sortedIntervals[0]);
    int lastEnd = sortedIntervals[0].second;
    
    // Select subsequent non-overlapping intervals
    for (int i = 1; i < n; i++) {
        if (sortedIntervals[i].first >= lastEnd) {
            result.push_back(sortedIntervals[i]);
            lastEnd = sortedIntervals[i].second;
        }
    }
    
    return result;
}

int main() {
    // Activities: (start_time, end_time)
    vector<pair<int, int>> activities = {
        {1, 4},   // Activity 0
        {3, 5},   // Activity 1
        {0, 6},   // Activity 2
        {5, 7},   // Activity 3
        {3, 9},   // Activity 4
        {5, 9},   // Activity 5
        {6, 10},  // Activity 6
        {8, 11}   // Activity 7
    };
    
    cout << "Activity Selection Problem" << endl;
    cout << "==========================" << endl << endl;
    
    cout << "Activities (start, end):" << endl;
    for (int i = 0; i < activities.size(); i++) {
        cout << "  Activity " << i << ": " << activities[i].first 
             << ":00 - " << activities[i].second << ":00" << endl;
    }
    
    // Get indices of selected activities
    vector<int> selectedIndices = activitySelection(activities);
    cout << "\nSelected activity indices: ";
    for (int idx : selectedIndices) {
        cout << idx << " ";
    }
    cout << endl;
    
    // Get actual intervals
    vector<pair<int, int>> selectedIntervals = activitySelectionIntervals(activities);
    cout << "\nSelected non-overlapping activities:" << endl;
    for (int idx : selectedIndices) {
        cout << "  Activity " << idx << ": " << activities[idx].first 
             << ":00 - " << activities[idx].second << ":00" << endl;
    }
    
    cout << "\nMaximum number of activities: " << selectedIndices.size() << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Activity Selection Algorithm
 * 
 * Select maximum number of non-overlapping activities.
 * 
 * Time Complexity: O(n log n) for sorting
 * Space Complexity: O(n) for storing result
 */
public class ActivitySelection {
    
    /**
     * Select maximum number of non-overlapping activities.
     * 
     * @param activities List of activities as int[2] {start, end}
     * @return Indices of selected non-overlapping activities
     */
    public static List<Integer> activitySelection(int[][] activities) {
        if (activities == null || activities.length == 0) {
            return new ArrayList<>();
        }
        
        int n = activities.length;
        
        // Create list of (end, start, original_index) and sort by end time
        List<int[]> sortedActivities = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            sortedActivities.add(new int[]{activities[i][1], activities[i][0], i});
        }
        
        // Sort by end time, then by start time
        sortedActivities.sort((a, b) -> {
            if (a[0] != b[0]) return Integer.compare(a[0], b[0]);
            return Integer.compare(a[1], b[1]);
        });
        
        // Select first activity (earliest end time)
        List<Integer> result = new ArrayList<>();
        result.add(sortedActivities.get(0)[2]);  // Store original index
        int lastEndTime = sortedActivities.get(0)[0];
        
        // Select subsequent non-overlapping activities
        for (int i = 1; i < n; i++) {
            int startTime = sortedActivities.get(i)[1];
            
            // If this activity starts after or when the last one ends
            if (startTime >= lastEndTime) {
                result.add(sortedActivities.get(i)[2]);  // Store original index
                lastEndTime = sortedActivities.get(i)[0];
            }
        }
        
        return result;
    }
    
    /**
     * Alternative version that returns the actual intervals.
     * 
     * @param intervals List of intervals as int[2] {start, end}
     * @return List of selected non-overlapping intervals
     */
    public static List<int[]> activitySelectionIntervals(int[][] intervals) {
        if (intervals == null || intervals.length == 0) {
            return new ArrayList<>();
        }
        
        // Sort by end time
        Arrays.sort(intervals, (a, b) -> {
            if (a[1] != b[1]) return Integer.compare(a[1], b[1]);
            return Integer.compare(a[0], b[0]);
        });
        
        // Select first interval
        List<int[]> result = new ArrayList<>();
        result.add(intervals[0]);
        int lastEnd = intervals[0][1];
        
        // Select subsequent non-overlapping intervals
        for (int i = 1; i < intervals.length; i++) {
            if (intervals[i][0] >= lastEnd) {
                result.add(intervals[i]);
                lastEnd = intervals[i][1];
            }
        }
        
        return result;
    }
    
    public static void main(String[] args) {
        // Activities: {start_time, end_time}
        int[][] activities = {
            {1, 4},   // Activity 0
            {3, 5},   // Activity 1
            {0, 6},   // Activity 2
            {5, 7},   // Activity 3
            {3, 9},   // Activity 4
            {5, 9},   // Activity 5
            {6, 10},  // Activity 6
            {8, 11}   // Activity 7
        };
        
        System.out.println("Activity Selection Problem");
        System.out.println("=========================");
        System.out.println();
        
        System.out.println("Activities (start, end):");
        for (int i = 0; i < activities.length; i++) {
            System.out.println("  Activity " + i + ": " + activities[i][0] 
                    + ":00 - " + activities[i][1] + ":00");
        }
        
        // Get indices of selected activities
        List<Integer> selectedIndices = activitySelection(activities);
        System.out.println();
        System.out.print("Selected activity indices: ");
        for (Integer idx : selectedIndices) {
            System.out.print(idx + " ");
        }
        System.out.println();
        
        // Get actual intervals
        List<int[]> selectedIntervals = activitySelectionIntervals(activities);
        System.out.println();
        System.out.println("Selected non-overlapping activities:");
        for (Integer idx : selectedIndices) {
            System.out.println("  Activity " + idx + ": " + activities[idx][0] 
                    + ":00 - " + activities[idx][1] + ":00");
        }
        
        System.out.println();
        System.out.println("Maximum number of activities: " + selectedIndices.size());
    }
}
```

<!-- slide -->
```javascript
/**
 * Activity Selection Algorithm
 * 
 * Select maximum number of non-overlapping activities.
 * 
 * Time Complexity: O(n log n) for sorting
 * Space Complexity: O(n) for storing result
 */

/**
 * Select maximum number of non-overlapping activities.
 * @param {number[][]} activities - Array of [start, end] pairs
 * @returns {number[]} Indices of selected non-overlapping activities
 */
function activitySelection(activities) {
    if (!activities || activities.length === 0) {
        return [];
    }
    
    const n = activities.length;
    
    // Create array of {end, start, originalIndex} and sort by end time
    const sortedActivities = activities
        .map((activity, index) => ({
            end: activity[1],
            start: activity[0],
            originalIndex: index
        }))
        .sort((a, b) => {
            if (a.end !== b.end) return a.end - b.end;
            return a.start - b.start;
        });
    
    // Select first activity (earliest end time)
    const result = [sortedActivities[0].originalIndex];
    let lastEndTime = sortedActivities[0].end;
    
    // Select subsequent non-overlapping activities
    for (let i = 1; i < n; i++) {
        const startTime = sortedActivities[i].start;
        
        // If this activity starts after or when the last one ends
        if (startTime >= lastEndTime) {
            result.push(sortedActivities[i].originalIndex);
            lastEndTime = sortedActivities[i].end;
        }
    }
    
    return result;
}

/**
 * Alternative version that returns the actual intervals.
 * @param {number[][]} intervals - Array of [start, end] pairs
 * @returns {number[][]} Selected non-overlapping intervals
 */
function activitySelectionIntervals(intervals) {
    if (!intervals || intervals.length === 0) {
        return [];
    }
    
    // Sort by end time
    const sortedIntervals = [...intervals].sort((a, b) => {
        if (a[1] !== b[1]) return a[1] - b[1];
        return a[0] - b[0];
    });
    
    // Select first interval
    const result = [sortedIntervals[0]];
    let lastEnd = sortedIntervals[0][1];
    
    // Select subsequent non-overlapping intervals
    for (let i = 1; i < sortedIntervals.length; i++) {
        if (sortedIntervals[i][0] >= lastEnd) {
            result.push(sortedIntervals[i]);
            lastEnd = sortedIntervals[i][1];
        }
    }
    
    return result;
}

// Example usage
const activities = [
    [1, 4],   // Activity 0
    [3, 5],   // Activity 1
    [0, 6],   // Activity 2
    [5, 7],   // Activity 3
    [3, 9],   // Activity 4
    [5, 9],   // Activity 5
    [6, 10],  // Activity 6
    [8, 11]   // Activity 7
];

console.log("Activity Selection Problem");
console.log("==========================");
console.log();

console.log("Activities (start, end):");
activities.forEach((activity, index) => {
    console.log(`  Activity ${index}: ${activity[0]}:00 - ${activity[1]}:00`);
});

// Get indices of selected activities
const selectedIndices = activitySelection(activities);
console.log();
console.log(`Selected activity indices: ${selectedIndices.join(" ")}`);

// Get actual intervals
const selectedIntervals = activitySelectionIntervals(activities);
console.log();
console.log("Selected non-overlapping activities:");
selectedIndices.forEach(idx => {
    console.log(`  Activity ${idx}: ${activities[idx][0]}:00 - ${activities[idx][1]}:00`);
});

console.log();
console.log(`Maximum number of activities: ${selectedIndices.length}`);
```
````

---

## Example

**Input:**
```
Activities (start, end):
  Activity 0: 1 - 4
  Activity 1: 3 - 5
  Activity 2: 0 - 6
  Activity 3: 5 - 7
  Activity 4: 3 - 9
  Activity 5: 5 - 9
  Activity 6: 6 - 10
  Activity 7: 8 - 11
```

**Output:**
```
Selected activity indices: [0, 3, 7]
Selected non-overlapping activities:
  Activity 0: 1 - 4
  Activity 3: 5 - 7
  Activity 7: 8 - 11
Maximum number of activities: 3

Explanation: After sorting by end time, we select:
1. Activity 0 (ends at 4, earliest)
2. Activity 3 (starts at 5 ≥ 4)
3. Activity 7 (starts at 8 ≥ 7)
```

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|-----------------|-------------|
| **Sorting** | O(n log n) | Sorting activities by end time |
| **Selection** | O(n) | Single pass through sorted activities |
| **Total** | **O(n log n)** | Dominated by sorting |

### Detailed Breakdown

- **Sorting Phase**: O(n log n)
  - Creating the sorted list: O(n)
  - Sorting by end time: O(n log n)
  
- **Selection Phase**: O(n)
  - Single pass through sorted activities
  - Each comparison/selection is O(1)

- **Overall**: O(n log n) due to sorting

---

## Space Complexity Analysis

| Component | Space Complexity | Description |
|-----------|-----------------|-------------|
| **Sorted List** | O(n) | Stores copy of activities with original indices |
| **Result List** | O(k) | Where k is the number of selected activities |
| **Total** | **O(n)** | Excluding input storage |

### Space Optimization (Optional)

For memory-constrained environments:
1. **In-place sorting**: Sort the original array if you don't need to preserve input
2. **Use indices instead of copies**: Store only indices during sorting
3. **Iterative approach**: Process without storing all indices

---

## Common Variations

### 1. Weighted Activity Selection (Dynamic Programming)

When activities have different values/weights, greedy doesn't work. Use DP instead:

````carousel
```python
def weighted_activity_selection(activities, weights):
    """
    Weighted Activity Selection using Dynamic Programming.
    
    Args:
        activities: List of (start, end) tuples
        weights: List of weights for each activity
    
    Returns:
        Maximum total weight of non-overlapping activities
    """
    if not activities:
        return 0
    
    n = len(activities)
    
    # Sort by end time
    sorted_indices = sorted(range(n), key=lambda i: activities[i][1])
    
    # Create sorted activities and weights
    sorted_activities = [activities[i] for i in sorted_indices]
    sorted_weights = [weights[i] for i in sorted_indices]
    
    # Find the last non-overlapping activity for each activity
    # Using binary search would be O(log n), but we'll use O(n) here
    def find_last_compatible(i):
        for j in range(i - 1, -1, -1):
            if sorted_activities[j][1] <= sorted_activities[i][0]:
                return j
        return -1
    
    # DP: dp[i] = max weight considering activities 0 to i
    dp = [0] * n
    
    for i in range(n):
        # Option 1: Don't include activity i
        weight_without = dp[i - 1] if i > 0 else 0
        
        # Option 2: Include activity i
        last_compatible = find_last_compatible(i)
        weight_with = sorted_weights[i]
        if last_compatible >= 0:
            weight_with += dp[last_compatible]
        
        dp[i] = max(weight_without, weight_with)
    
    return dp[n - 1]
```
````

### 2. Activity Selection with Same Start Time

When activities can have the same start time, select the one with earliest end time:

````carousel
```python
def activity_selection_same_start(activities):
    """
    Activity Selection when multiple activities can start at same time.
    Select the activity with earliest end time when starts are equal.
    """
    if not activities:
        return []
    
    # Sort by (start, end) - activities with same start, pick earliest end
    sorted_activities = sorted(
        enumerate(activities),
        key=lambda x: (x[1][0], x[1][1])
    )
    
    result = [sorted_activities[0][0]]
    last_end = sorted_activities[0][1][1]
    
    for idx, (start, end) in sorted_activities[1:]:
        if start >= last_end:
            result.append(idx)
            last_end = end
    
    return result
```
````

### 3. Minimum Number of Activities to Remove

Find minimum activities to remove to make remaining non-overlapping:

````carousel
```python
def min_activities_to_remove(activities):
    """
    Find minimum number of activities to remove to make all non-overlapping.
    
    Equivalent to: n - max_non_overlapping
    """
    if not activities:
        return 0
    
    n = len(activities)
    
    # Sort by end time
    sorted_activities = sorted(
        [(activities[i][1], activities[i][0], i) for i in range(n)],
        key=lambda x: (x[0], x[1])
    )
    
    count = 1  # At least one activity can be selected
    last_end = sorted_activities[0][0]
    
    for i in range(1, n):
        if sorted_activities[i][1] >= last_end:
            count += 1
            last_end = sorted_activities[i][0]
    
    return n - count
```
````

### 4. Meeting Rooms (Related Problem)

Minimum number of meeting rooms required:

````carousel
```python
import heapq

def min_meeting_rooms(intervals):
    """
    Find minimum number of meeting rooms required.
    
    Uses min-heap to track end times of ongoing meetings.
    """
    if not intervals:
        return 0
    
    # Sort by start time
    sorted_intervals = sorted(intervals, key=lambda x: x[0])
    
    # Min-heap to track end times
    min_heap = []
    
    for start, end in sorted_intervals:
        # If meeting ends before next starts, pop from heap
        if min_heap and min_heap[0] <= start:
            heapq.heappop(min_heap)
        
        # Add current meeting end time
        heapq.heappush(min_heap, end)
    
    return len(min_heap)
```
````

---

## Practice Problems

### Problem 1: Non-overlapping Intervals

**Problem:** [LeetCode 435 - Non-overlapping Intervals](https://leetcode.com/problems/non-overlapping-intervals/)

**Description:** Given a collection of intervals, find the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.

**How to Apply Activity Selection:**
- Sort intervals by end time (like standard activity selection)
- Count how many non-overlapping intervals we can keep
- Answer = total intervals - non-overlapping count

---

### Problem 2: Minimum Number of Arrows to Burst Balloons

**Problem:** [LeetCode 452 - Minimum Number of Arrows to Burst Balloons](https://leetcode.com/problems/minimum-number-of-arrows-to-burst-balloons/)

**Description:** Find minimum arrows that must be shot to burst all balloons. An arrow shot at position x will burst all balloons whose starting point ≤ x ≤ ending point.

**How to Apply Activity Selection:**
- Sort balloons by end coordinate
- Shoot arrow at end of first balloon
- Skip all balloons that overlap with this arrow position
- Repeat for remaining balloons

---

### Problem 3: Merge Intervals (Related)

**Problem:** [LeetCode 56 - Merge Intervals](https://leetcode.com/problems/merge-intervals/)

**Description:** Merge all overlapping intervals and return an array of non-overlapping intervals.

**How to Apply Activity Selection:**
- Sort intervals by start time
- Merge overlapping intervals
- Similar greedy approach but with merging instead of selection

---

### Problem 4: Meeting Rooms II

**Problem:** [LeetCode 253 - Meeting Rooms II](https://leetcode.com/problems/meeting-rooms-ii/)

**Description:** Find the minimum number of conference rooms required to hold all meetings.

**How to Apply Activity Selection:**
- Use min-heap approach with activity selection concepts
- Track end times of ongoing meetings
- Similar to "minimum platforms" problem

---

### Problem 5: Minimum Platforms

**Problem:** [GeeksForGeeks - Minimum Number of Platforms](https://practice.geeksforgeeks.org/problems/minimum-number-of-platforms-while-merge-sorting/)

**Description:** Given arrival and departure times of trains, find minimum number of platforms needed.

**How to Apply Activity Selection:**
- Treat each train as an activity with arrival and departure
- Use greedy approach similar to activity selection
- Count maximum overlapping activities at any time

---

## Video Tutorial Links

### Fundamentals

- [Activity Selection Problem (Take U Forward)](https://www.youtube.com/watch?v=poWB6MGoxAk) - Comprehensive introduction
- [Activity Selection Greedy Algorithm (WilliamFiset)](https://www.youtube.com/watch?v=2NoZ8T58J74) - Detailed explanation with visualizations
- [Greedy Algorithm - Activity Selection (NeetCode)](https://www.youtube.com/watch?v=4nK8x5w8U8w) - Practical implementation guide

### Related Problems

- [Non-overlapping Intervals (LeetCode 435)](https://www.youtube.com/watch?v=nONCGxWoUfM) - Applying activity selection
- [Merge Intervals (LeetCode 56)](https://www.youtube.com/watch?v=44H3cE2ggsM) - Related interval problems
- [Meeting Rooms II (LeetCode 253)](https://www.youtube.com/watch?v=FXWgr7eW2N0) - Minimum resources problem

### Advanced Topics

- [Weighted Activity Selection (DP)](https://www.youtube.com/watch?v=oN0F8VwESrE) - When weights are involved
- [Interval Scheduling Maximum Profit](https://www.youtube.com/watch?v=o64CW-8N-pI) - Weighted version

---

## Follow-up Questions

### Q1: Why do we sort by end time instead of start time?

**Answer:** Sorting by end time (ascending) is crucial because:
- It ensures we always pick the activity that finishes earliest
- This leaves maximum room for remaining activities
- It guarantees optimality (proven by exchange argument)

If we sorted by start time, we might pick activities that finish late, blocking many potential activities.

### Q2: Can Activity Selection handle activities with the same end time?

**Answer:** Yes, but you need a tie-breaker:
- If two activities have the same end time, sort by start time (ascending)
- This picks the one that starts earlier, which is always safe
- Example: [1,5] and [4,5] → pick [1,5] first, then check [4,5]

### Q3: What if activities can share endpoints (one ends exactly when another starts)?

**Answer:** The algorithm already handles this:
- Use `start_time >= last_end_time` (≥, not >)
- This allows activities that end exactly when another starts
- This is the correct interpretation for non-overlapping

### Q4: How do you modify the algorithm for weighted activity selection?

**Answer:** Greedy doesn't work for weighted versions. Use Dynamic Programming:
1. Sort activities by end time: O(n log n)
2. For each activity i, find last non-conflicting activity j
3. Use DP: `dp[i] = max(dp[i-1], weight[i] + dp[j])`
4. Time: O(n²) or O(n log n) with binary search

### Q5: What's the difference between Activity Selection and Merge Intervals?

**Answer:**
- **Activity Selection**: Select MAXIMUM number of NON-overlapping intervals
- **Merge Intervals**: Combine ALL overlapping intervals into non-overlapping ones
- Both use sorting, but different goals and logic

---

## Summary

The Activity Selection algorithm is a classic greedy algorithm that demonstrates how making locally optimal choices leads to globally optimal solutions. Key takeaways:

- **Greedy Approach**: Always select the activity that finishes earliest
- **Time Complexity**: O(n log n) due to sorting
- **Space Complexity**: O(n) for storing results
- **Key Property**: Greedy choice property + optimal substructure

When to use:
- ✅ Maximum non-overlapping intervals
- ✅ Event scheduling problems
- ✅ Resource allocation where all resources have equal value
- ❌ When intervals have different weights (use DP instead)
- ❌ When you need ALL valid combinations (use backtracking)

This algorithm is fundamental to understanding greedy algorithms and is frequently asked in technical interviews, especially in problems related to interval scheduling and resource allocation.

---

## Related Algorithms

- [Merge Intervals](./merge-intervals.md) - Combining overlapping intervals
- [Meeting Rooms II](./meeting-rooms-ii.md) - Minimum resources problem
- [Greedy Task Scheduling](./greedy-task-scheduling-frequency-based.md) - Related greedy problems
- [Knapsack 0/1](./knapsack-01.md) - Weighted selection (DP approach)
