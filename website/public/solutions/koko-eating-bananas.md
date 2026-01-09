# Koko Eating Bananas

## Problem Description

Koko loves to eat bananas. There are `n` piles of bananas, and the `i`-th pile has `piles[i]` bananas. The guards have gone and will come back in `h` hours.

Koko can decide her bananas-per-hour eating speed `k`. Each hour, she chooses some pile of bananas and eats `k` bananas from that pile. If the pile has less than `k` bananas, she eats all of them instead and will not eat any more bananas during this hour.

Koko likes to eat slowly but still wants to finish eating all the bananas before the guards return. Return the minimum integer `k` such that she can eat all the bananas within `h` hours.

### Example 1

**Input:** `piles = [3,6,7,11], h = 8`

**Output:** `4`

### Example 2

**Input:** `piles = [30,11,23,4,20], h = 5`

**Output:** `30`

### Example 3

**Input:** `piles = [30,11,23,4,20], h = 6`

**Output:** `23`

---

## Constraints

- `1 <= piles.length <= 10^4`
- `piles.length <= h <= 10^9`
- `1 <= piles[i] <= 10^9`

---

## Solution

```python
import math
from typing import List

class Solution:
    def minEatingSpeed(self, piles: List[int], h: int) -> int:
        left, right = 1, max(piles)
        
        while left < right:
            mid = (left + right) // 2
            hours_needed = sum(math.ceil(p / mid) for p in piles)
            
            if hours_needed <= h:
                right = mid
            else:
                left = mid + 1
        
        return left
```

---

## Explanation

This problem is solved using binary search on the eating speed `k`.

### Binary Search Range

- **Lower bound (`left`):** 1 banana per hour (minimum possible speed).
- **Upper bound (`right`):** `max(piles)` bananas per hour (maximum pile size).

### Binary Search Process

1. Calculate `mid` as the average of `left` and `right`.
2. Compute `hours_needed = sum(ceil(p / mid) for p in piles)`:
   - For each pile, Koko needs `ceil(p / k)` hours to finish it.
3. If `hours_needed <= h`, the current speed `k` is sufficient, so search for a potentially smaller speed by setting `right = mid`.
4. Otherwise, the speed is too slow, so search for a faster speed by setting `left = mid + 1`.
5. When `left == right`, we've found the minimum sufficient speed.

### Key Insight

The hours needed is monotonically decreasing with respect to `k`. This monotonicity allows us to apply binary search.

---

## Complexity Analysis

- **Time Complexity:** O(n log M) — where `n` is the number of piles and `M` is the maximum pile size. Binary search takes O(log M) iterations, and each iteration sums over all `n` piles.
- **Space Complexity:** O(1) — constant extra space.
