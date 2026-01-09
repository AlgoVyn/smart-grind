# Merge Intervals

## Problem Description

Given an array of intervals `intervals` where `intervals[i] = [start_i, end_i]`, merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all intervals in the input.

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `intervals = [[1,3],[2,6],[8,10],[15,18]]` | `[[1,6],[8,10],[15,18]]` |

**Explanation:** Intervals `[1,3]` and `[2,6]` overlap, so they merge into `[1,6]`.

**Example 2:**

| Input | Output |
|-------|--------|
| `intervals = [[1,4],[4,5]]` | `[[1,5]]` |

**Explanation:** Intervals `[1,4]` and `[4,5]` are considered overlapping.

**Example 3:**

| Input | Output |
|-------|--------|
| `intervals = [[4,7],[1,4]]` | `[[1,7]]` |

**Explanation:** Intervals `[1,4]` and `[4,7]` are considered overlapping.

## Constraints

- `1 <= intervals.length <= 10^4`
- `intervals[i].length == 2`
- `0 <= start_i <= end_i <= 10^4`

## Solution

```python
from typing import List

class Solution:
    def merge(self, intervals: List[List[int]]) -> List[List[int]]:
        if not intervals:
            return []
        
        # Sort intervals by start time
        intervals.sort(key=lambda x: x[0])
        
        merged = [intervals[0]]
        
        for current in intervals[1:]:
            last = merged[-1]
            # Check if current interval overlaps with last merged interval
            if current[0] <= last[1]:
                # Merge by updating end time to max of both
                last[1] = max(last[1], current[1])
            else:
                # No overlap, add as new interval
                merged.append(current)
        
        return merged
```

## Explanation

1. **Sort intervals** by their start times.
2. **Iterate through sorted intervals**, comparing each with the last interval in the merged list:
   - If **overlapping** (`current[0] <= last[1]`), merge by extending the end time.
   - If **non-overlapping**, add the current interval to the merged list.
3. Return the merged list containing all non-overlapping intervals.

## Complexity Analysis

| Metric | Complexity |
|--------|------------|
| Time | `O(n log n)` — sorting dominates; merging is `O(n)` |
| Space | `O(n)` — for the merged intervals list |
