# Interval List Intersections

## Problem Description

You are given two lists of closed intervals, `firstList` and `secondList`, where:
- `firstList[i] = [starti, endi]`
- `secondList[j] = [startj, endj]`

Each list of intervals is **pairwise disjoint** and in **sorted order**.

Return the intersection of these two interval lists.

A **closed interval** `[a, b]` (with `a <= b`) denotes the set of real numbers `x` with `a <= x <= b`.

The intersection of two closed intervals is a set of real numbers that is either empty or represented as a closed interval. For example, the intersection of `[1, 3]` and `[2, 4]` is `[2, 3]`.

---

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `firstList = [[0,2],[5,10],[13,23],[24,25]]`<br>`secondList = [[1,5],[8,12],[15,24],[25,26]]` | `[[1,2],[5,5],[8,10],[15,23],[24,24],[25,25]]` |

**Example 2:**

| Input | Output |
|-------|--------|
| `firstList = [[1,3],[5,9]]`<br>`secondList = []` | `[]` |

---

## Constraints

- `0 <= firstList.length, secondList.length <= 1000`
- `firstList.length + secondList.length >= 1`
- `0 <= starti < endi <= 10⁹`
- `endi < starti+1` (intervals are non-overlapping within each list)
- `0 <= startj < endj <= 10⁹`
- `endj < startj+1` (intervals are non-overlapping within each list)

---

## Solution

```python
from typing import List

class Solution:
    def intervalIntersection(self, firstList: List[List[int]], secondList: List[List[int]]) -> List[List[int]]:
        res = []
        i, j = 0, 0
        
        while i < len(firstList) and j < len(secondList):
            a_start, a_end = firstList[i]
            b_start, b_end = secondList[j]
            
            # Calculate the intersection of current intervals
            start = max(a_start, b_start)
            end = min(a_end, b_end)
            
            # If there's an overlap, add it to results
            if start <= end:
                res.append([start, end])
            
            # Advance the pointer of the interval that ends first
            if a_end < b_end:
                i += 1
            else:
                j += 1
        
        return res
```

---

## Explanation

This problem finds intersections of two lists of intervals using a two-pointer approach.

### Key Insight

Since both lists are sorted and contain non-overlapping intervals, we can use two pointers to traverse them simultaneously.

### Algorithm

1. **Initialize Pointers:** Start with `i = 0` for `firstList` and `j = 0` for `secondList`.

2. **Compare Current Intervals:**
   - `a_start, a_end` = current interval in `firstList`
   - `b_start, b_end` = current interval in `secondList`

3. **Find Intersection:**
   - `start = max(a_start, b_start)` - the later start time
   - `end = min(a_end, b_end)` - the earlier end time
   - If `start <= end`, there's an intersection → add `[start, end]` to results

4. **Advance Pointer:**
   - If `a_end < b_end`, move pointer `i` forward (first interval ends first)
   - Otherwise, move pointer `j` forward

5. **Repeat** until one list is exhausted.

---

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m + n) where m and n are the lengths of the two lists |
| **Space** | O(m + n) for the result list |

This efficient two-pointer approach ensures we only visit each interval once.
