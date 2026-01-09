# Maximum Candies Allocated to K Children

## Problem Description

You are given a 0-indexed integer array `candies`. Each element `candies[i]` denotes a pile of candies. You can divide each pile into any number of sub-piles, but you cannot merge two piles together.

You are also given an integer `k`. Allocate piles of candies to `k` children such that each child gets the same number of candies. Each child can receive candies from only one pile, and some piles may go unused.

Return the maximum number of candies each child can get.

---

## Examples

### Example 1

**Input:**
```python
candies = [5, 8, 6], k = 3
```

**Output:**
```
5
```

**Explanation:**
- Divide `candies[1]` (8) into two piles: 5 and 3
- Divide `candies[2]` (6) into two piles: 5 and 1
- Now we have piles: 5, 5, 3, 5, 1
- Allocate three piles of size 5 to three children
- Each child gets 5 candies

### Example 2

**Input:**
```python
candies = [2, 5], k = 11
```

**Output:**
```
0
```

**Explanation:** There are only 7 candies total but 11 children. It's impossible to give each child at least one candy, so return 0.

---

## Constraints

- `1 <= candies.length <= 10^5`
- `1 <= candies[i] <= 10^7`
- `1 <= k <= 10^12`

---

## Solution

```python
from typing import List

class Solution:
    def maximumCandies(self, candies: List[int], k: int) -> int:
        if sum(candies) < k:
            return 0
        
        left, right = 1, max(candies)
        while left <= right:
            mid = (left + right) // 2
            count = 0
            for c in candies:
                count += c // mid
            if count >= k:
                left = mid + 1
            else:
                right = mid - 1
        return right
```

---

## Explanation

We use **binary search** to find the maximum candy count `x` such that we can create at least `k` piles of size `x`.

### Key Insight

If we can create at least `k` piles of size `x`, then we can also create at least `k` piles of any size `y < x`. This monotonic property allows binary search.

### Algorithm

1. **Edge case**: If total candies < `k`, return `0`
2. **Binary search** on `x` (candies per child):
   - `left = 1`, `right = max(candies)`
   - For each `mid`:
     - Count how many piles of size `mid` we can create: `sum(c // mid)`
     - If `count >= k`: try larger `mid` (`left = mid + 1`)
     - Else: try smaller `mid` (`right = mid - 1`)
3. Return `right` (the largest valid `x`)

---

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(n log M)` — `n` = array length, `M` = max candy value |
| **Space** | `O(1)` — Only a few variables used |
