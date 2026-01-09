# Minimize Max Distance To Gas Station

## Problem Description
## Solution

```python
from typing import List
import math

class Solution:
    def minmaxGasDist(self, stations: List[int], k: int) -> float:
        def can_cover(dist: float) -> bool:
            needed = 0
            for i in range(1, len(stations)):
                gap = stations[i] - stations[i-1]
                needed += math.ceil(gap / dist) - 1
            return needed <= k
        
        left, right = 0, stations[-1] - stations[0]
        for _ in range(100):
            mid = (left + right) / 2
            if can_cover(mid):
                right = mid
            else:
                left = mid
        return left
```

## Explanation
This problem uses binary search on the possible maximum distance between gas stations to minimize the maximum gap after adding k stations.

1. Define a helper function can_cover(dist) that checks if with the given max distance dist, we need <= k additional stations.
2. For can_cover, iterate through the gaps between consecutive stations, calculate needed stations for each gap as ceil(gap / dist) - 1, sum them.
3. Binary search between 0 and the total span, for 100 iterations to achieve high precision.
4. If can_cover(mid), search in lower half, else upper half.
5. Return the left bound after search.

Time complexity: O(n), as the check function is O(n) and binary search converges quickly.
Space complexity: O(1), using only constant extra space.
