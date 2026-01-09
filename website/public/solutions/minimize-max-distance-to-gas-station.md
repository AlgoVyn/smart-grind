# Minimize Max Distance to Gas Station

## Problem Description

You are given an integer array `stations` representing gas station positions on a number line, and an integer `k` representing the number of additional gas stations you can build.

You want to achieve the **minimum possible maximum distance** between consecutive gas stations (including the start, end, and newly built stations).

Return this minimum possible maximum distance.

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `stations = [1,2,3,4,5,6,7], k = 3` | `1.0` |

**Explanation:** By adding 3 gas stations strategically, the maximum distance between any two consecutive stations becomes 1.0.

**Example 2:**

| Input | Output |
|-------|--------|
| `stations = [4,6,8,12,16], k = 5` | `1.5` |

## Constraints

- `2 <= stations.length <= 10^4`
- `0 <= stations[i] <= 10^9`
- `k >= 0`

## Solution

```python
from typing import List
import math

class Solution:
    def minmaxGasDist(self, stations: List[int], k: int) -> float:
        def can_cover(dist: float) -> bool:
            """
            Check if we can achieve max distance <= dist with k additional stations.
            """
            needed = 0
            for i in range(1, len(stations)):
                gap = stations[i] - stations[i - 1]
                # Stations needed for this gap: ceil(gap / dist) - 1
                needed += math.ceil(gap / dist) - 1
            return needed <= k
        
        left, right = 0, stations[-1] - stations[0]
        
        # Binary search for 100 iterations for high precision
        for _ in range(100):
            mid = (left + right) / 2
            if can_cover(mid):
                right = mid  # Can achieve this distance, try smaller
            else:
                left = mid   # Need larger distance
        
        return left
```

## Explanation

We use **binary search** on the possible maximum distance to find the minimum achievable value:

1. **Define the search space**:
   - `left = 0` — minimum possible distance
   - `right = stations[-1] - stations[0]` — maximum distance (span of all stations)

2. **Helper function `can_cover(dist)`**:
   - For each gap between consecutive stations, calculate how many additional stations are needed:
     - `needed = ceil(gap / dist) - 1`
   - Return `True` if total needed stations <= `k`

3. **Binary search**:
   - For 100 iterations (ensures high precision):
     - Calculate `mid` (candidate maximum distance)
     - If `can_cover(mid)`: try smaller distance (`right = mid`)
     - Otherwise: need larger distance (`left = mid`)

4. Return `left`, the minimum achievable maximum distance.

## Complexity Analysis

| Metric | Complexity |
|--------|------------|
| Time | `O(n * log(precision))` — `n` stations, ~100 iterations |
| Space | `O(1)` — constant extra space |
