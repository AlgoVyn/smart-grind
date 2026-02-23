# Merge Intervals

## Category
Arrays & Strings

## Description
Merge overlapping intervals by sorting and iterating through them.

## Algorithm Explanation
The Merge Intervals problem requires combining all overlapping intervals into a single set of non-overlapping intervals. The key insight is that if we sort the intervals by their start times, we can process them in a single pass.

**Approach:**
1. **Sort** the intervals by their start time (first element of each interval)
2. **Iterate** through the sorted intervals, maintaining a "merged" interval
3. For each interval, check if it overlaps with the previous merged interval:
   - If it overlaps, update the end of the merged interval to the maximum end
   - If it doesn't overlap, add the previous merged interval to the result and start a new merged interval
4. Don't forget to add the last merged interval to the result

**Why sorting works:** When intervals are sorted by start time, any overlapping intervals will be adjacent, making it easy to detect and merge them in a single pass.

**Edge cases to consider:**
- Empty input: return empty list
- Single interval: return the same interval
- Non-overlapping intervals: return sorted intervals as-is
- Completely overlapping intervals: merge all into one interval

---

## When to Use
Use this algorithm when you need to solve problems involving:
- arrays & strings related operations
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

## Implementation

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
```

```javascript
function mergeIntervals(intervals) {
    if (!intervals || intervals.length === 0) return [];
    
    // Sort by start time
    const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
    
    const merged = [sorted[0]];
    
    for (let i = 1; i < sorted.length; i++) {
        const [start, end] = sorted[i];
        const lastEnd = merged[merged.length - 1][1];
        
        if (start <= lastEnd) {
            merged[merged.length - 1][1] = Math.max(lastEnd, end);
        } else {
            merged.push([start, end]);
        }
    }
    
    return merged;
}
```

---

## Example

**Input:**
```
intervals = [[1, 3], [2, 6], [8, 10], [15, 18]]
```

**Output:**
```
[[1, 6], [8, 10], [15, 18]]
```

**Explanation:**
- Sort by start: [[1, 3], [2, 6], [8, 10], [15, 18]]
- [1, 3] merged with [2, 6] → [1, 6] (overlap: 2 ≤ 3)
- [8, 10] doesn't overlap with [1, 6] → add as new
- [15, 18] doesn't overlap with [8, 10] → add as new

**Input:**
```
intervals = [[1, 4], [4, 5]]
```

**Output:**
```
[[1, 5]]
```

**Explanation:** [1, 4] and [4, 5] overlap at point 4, so they merge into [1, 5].

---

## Time Complexity
**O(n log n)**

---

## Space Complexity
**O(n)**

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
