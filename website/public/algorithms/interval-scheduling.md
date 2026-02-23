# Interval Scheduling

## Category
Greedy

## Description
Schedule intervals optimally to maximize throughput.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- greedy related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Steps
1. Understand the problem constraints and requirements
2. Identify the input and expected output
3. Apply the core algorithm logic
4. Handle edge cases appropriately
5. Optimize for the given constraints

---

## Algorithm Explanation

The Interval Scheduling problem (also called Activity Selection) asks to find the maximum number of non-overlapping intervals from a set of intervals. This is a classic greedy algorithm problem.

**Greedy Choice:** Always pick the interval that ends earliest and doesn't conflict with previously selected intervals.

**Why this greedy approach works:**
- Picking the earliest finishing interval leaves maximum room for remaining intervals
- This is provably optimal using a greedy exchange argument

**Algorithm Steps:**
1. Sort intervals by their end time (earliest first)
2. Select the first interval
3. For each remaining interval, if it starts after (or at) the end of the last selected interval, select it
4. Return the count of selected intervals

**Time Complexity:** O(n log n) due to sorting
**Space Complexity:** O(1) if we just count (O(n) if storing selected intervals)

**Variations:**
- Maximum number of non-overlapping intervals
- Minimum number of intervals to remove to make non-overlapping
- Weighted interval scheduling (requires DP - O(n²))

---

## Implementation

```python
def interval_scheduling(intervals):
    """
    Find maximum number of non-overlapping intervals.
    Uses greedy algorithm - pick earliest finishing interval.
    
    Args:
        intervals: List of tuples (start, end)
        
    Returns:
        Maximum number of non-overlapping intervals
        
    Time: O(n log n)
    Space: O(1)
    """
    if not intervals:
        return 0
    
    # Sort by end time (greedy choice)
    intervals.sort(key=lambda x: x[1])
    
    count = 1  # Select first interval
    last_end = intervals[0][1]
    
    for start, end in intervals[1:]:
        # Select if it starts after (or equals) last selected end
        if start >= last_end:
            count += 1
            last_end = end
    
    return count


def interval_scheduling_select(intervals):
    """
    Return the actual selected intervals (not just count).
    """
    if not intervals:
        return []
    
    # Sort by end time
    intervals.sort(key=lambda x: x[1])
    
    selected = [intervals[0]]
    last_end = intervals[0][1]
    
    for start, end in intervals[1:]:
        if start >= last_end:
            selected.append((start, end))
            last_end = end
    
    return selected


def min_intervals_to_remove(intervals):
    """
    Find minimum number of intervals to remove to make non-overlapping.
    """
    if not intervals:
        return 0
    
    intervals.sort(key=lambda x: x[1])
    
    count = 0
    last_end = float('-inf')
    
    for start, end in intervals:
        if start < last_end:
            # Overlapping - remove this interval (keep the one ending earlier)
            count += 1
        else:
            # Non-overlapping - keep it
            last_end = end
    
    return count
```

```javascript
function intervalScheduling() {
    // Interval Scheduling implementation
    // Time: O(n log n)
    // Space: O(1)
}
```

---

## Example

**Input:**
```
intervals = [(1, 4), (2, 3), (3, 4), (5, 7), (6, 8), (8, 10)]
```

**Output:**
```
Maximum non-overlapping: 4
Selected intervals: [(2, 3), (3, 4), (6, 8), (8, 10)]
```

**Explanation:**
1. Sort by end time: [(2, 3), (3, 4), (1, 4), (6, 8), (5, 7), (8, 10)]
2. Select (2, 3) - ends earliest
3. Next (3, 4): starts at 3 ≥ 3 (end of last), select it
4. Next (1, 4): starts at 1 < 3 (overlaps), skip
5. Next (6, 8): starts at 6 ≥ 4, select it
6. Next (5, 7): starts at 5 < 6 (overlaps), skip
7. Next (8, 10): starts at 8 ≥ 8, select it

Result: 4 intervals selected

**Additional Example:**
```
Input: [(1, 2), (2, 3), (3, 4), (1, 100)]
Output: 3 (intervals: [(1, 2), (2, 3), (3, 4)])

Note: [(1, 100)] overlaps with all others, so we pick the 3 that finish first.
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
