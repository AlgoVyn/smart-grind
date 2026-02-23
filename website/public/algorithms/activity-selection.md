# Activity Selection

## Category
Greedy

## Description
Select maximum number of non-overlapping activities.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- greedy related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Explanation
The Activity Selection problem is a classic greedy algorithm problem where we need to select the maximum number of non-overlapping activities from a given set. Each activity has a start time and an end time, and two activities are considered non-overlapping if one finishes before the other starts.

### How It Works:
The greedy approach works by always selecting the activity that finishes earliest and doesn't conflict with previously selected activities. This optimal substructure property ensures that choosing the earliest finishing activity leaves maximum room for remaining activities.

### Key Steps:
1. **Sort activities by end time** (ascending order)
2. **Select the first activity** (earliest end time)
3. **Iterate through remaining activities**: For each activity, select it if its start time is greater than or equal to the end time of the last selected activity
4. **Repeat** until all activities are processed

### Why Greedy Works:
- The greedy choice property: Selecting the activity that finishes earliest maximizes the remaining time for other activities
- Optimal substructure: The optimal solution can be built from optimal solutions of subproblems
- This is a classic example where a local optimal choice leads to a global optimal solution

---

## Algorithm Steps
1. Sort activities by their end times (if same end time, sort by start time)
2. Initialize result with the first activity
3. For each remaining activity (from index 1 to n-1):
   - If the activity's start time ≥ last selected activity's end time:
     - Add this activity to result
     - Update last selected activity
4. Return the selected activities

---

## Implementation

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

```javascript
function activitySelection() {
    // Activity Selection implementation
    // Time: O(n log n)
    // Space: O(1)
}
```

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

## Time Complexity
**O(n log n)**

---

## Space Complexity
**O(1)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
