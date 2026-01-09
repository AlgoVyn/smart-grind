# Minimum Number Of Days To Make M Bouquets

## Problem Description

You are given an integer array `bloomDay`, an integer `m` and an integer `k`. You want to make `m` bouquets. To make a bouquet, you need to use `k` adjacent flowers from the garden.

The garden consists of `n` flowers, the `i-th` flower will bloom in the `bloomDay[i]` and then can be used in exactly one bouquet.

Return the minimum number of days you need to wait to be able to make `m` bouquets from the garden. If it is impossible to make `m` bouquets, return `-1`.

## Examples

### Example 1

**Input:**
```python
bloomDay = [1, 10, 3, 10, 2], m = 3, k = 1
```

**Output:**
```python
3
```

**Explanation:**
We need 3 bouquets each should contain 1 flower.
- After day 1: `[x, _, _, _, _]` - we can only make one bouquet
- After day 2: `[x, _, _, _, x]` - we can only make two bouquets
- After day 3: `[x, _, x, _, x]` - we can make 3 bouquets

### Example 2

**Input:**
```python
bloomDay = [1, 10, 3, 10, 2], m = 3, k = 2
```

**Output:**
```python
-1
```

**Explanation:**
We need 3 bouquets each has 2 flowers, that means we need 6 flowers. We only have 5 flowers so it is impossible to get the needed bouquets.

### Example 3

**Input:**
```python
bloomDay = [7, 7, 7, 7, 12, 7, 7], m = 2, k = 3
```

**Output:**
```python
12
```

**Explanation:**
We need 2 bouquets each should have 3 flowers.
- After day 7: `[x, x, x, x, _, x, x]` - we can make one bouquet of the first three flowers
- After day 12: `[x, x, x, x, x, x, x]` - we can make two bouquets

## Constraints

- `bloomDay.length == n`
- `1 <= n <= 10^5`
- `1 <= bloomDay[i] <= 10^9`
- `1 <= m <= 10^6`
- `1 <= k <= n`

## Solution

```python
from typing import List

class Solution:
    def minDays(self, bloomDay: List[int], m: int, k: int) -> int:
        """
        Find minimum days to make m bouquets using binary search.
        """
        # Early termination: not enough flowers
        if m * k > len(bloomDay):
            return -1
        
        def can_make(days: int) -> bool:
            """Check if we can make at least m bouquets by given days."""
            bouquets = 0
            streak = 0
            for day in bloomDay:
                if day <= days:
                    streak += 1
                    if streak == k:
                        bouquets += 1
                        streak = 0
                else:
                    streak = 0
            return bouquets >= m
        
        left, right = min(bloomDay), max(bloomDay)
        while left < right:
            mid = (left + right) // 2
            if can_make(mid):
                right = mid
            else:
                left = mid + 1
        
        return left
```

## Explanation

This problem uses binary search to find the minimum number of days to make `m` bouquets, each requiring `k` adjacent bloomed flowers.

1. **Early check**: If `m * k > n`, return -1 (not enough flowers).

2. **Binary search on days**: Search from the minimum to maximum bloom day.

3. **Check feasibility**: For a candidate number of days:
   - Count groups of `k` consecutive bloomed flowers
   - If count >= m, it's possible

4. **Return minimum**: The left bound is the answer.

## Complexity Analysis

- **Time Complexity:** O(n log D), where n is the number of flowers and D is the range of bloomDay values
- **Space Complexity:** O(1), using only constant extra space
