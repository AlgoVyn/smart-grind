# Minimum Limit Of Balls In A Bag

## Problem Description

You are given an integer array `nums` where the `i-th` bag contains `nums[i]` balls. You are also given an integer `maxOperations`.

You can perform the following operation at most `maxOperations` times:

> Take any bag of balls and divide it into two new bags with a positive number of balls.

For example, a bag of 5 balls can become two new bags of 1 and 4 balls, or two new bags of 2 and 3 balls.

Your penalty is the maximum number of balls in a bag. You want to minimize your penalty after the operations. Return the minimum possible penalty after performing the operations.

---

## Examples

### Example 1

**Input:**
```python
nums = [9], maxOperations = 2
```

**Output:**
```python
3
```

**Explanation:**
- Divide the bag with 9 balls into two bags of sizes 6 and 3: `[9] -> [6, 3]`
- Divide the bag with 6 balls into two bags of sizes 3 and 3: `[6, 3] -> [3, 3, 3]`

The bag with the most number of balls has 3 balls, so your penalty is 3.

### Example 2

**Input:**
```python
nums = [2, 4, 8, 2], maxOperations = 4
```

**Output:**
```python
2
```

**Explanation:**
- Divide the bag with 8 balls into two bags of sizes 4 and 4: `[2, 4, 8, 2] -> [2, 4, 4, 4, 2]`
- Divide the bag with 4 balls into two bags of sizes 2 and 2: `[2, 4, 4, 4, 2] -> [2, 2, 2, 4, 4, 2]`
- Divide the bag with 4 balls into two bags of sizes 2 and 2: `[2, 2, 2, 4, 4, 2] -> [2, 2, 2, 2, 2, 4, 2]`
- Divide the bag with 4 balls into two bags of sizes 2 and 2: `[2, 2, 2, 2, 2, 4, 2] -> [2, 2, 2, 2, 2, 2, 2, 2]`

The bag with the most number of balls has 2 balls.

---

## Constraints

- `1 <= nums.length <= 10^5`
- `1 <= maxOperations, nums[i] <= 10^9`

---

## Solution

```python
from typing import List

class Solution:
    def minimumSize(self, nums: List[int], maxOperations: int) -> int:
        """
        Find minimum possible maximum balls per bag using binary search.
        """
        def can(mid: int) -> bool:
            """Check if we can reduce all bags to <= mid with maxOperations."""
            ops = 0
            for num in nums:
                if num > mid:
                    # Operations needed = ceil(num / mid) - 1 = (num - 1) // mid
                    ops += (num - 1) // mid
            return ops <= maxOperations
        
        left, right = 1, max(nums)
        while left < right:
            mid = (left + right) // 2
            if can(mid):
                right = mid
            else:
                left = mid + 1
        
        return left
```

---

## Explanation

This problem uses binary search to find the minimum possible maximum number of balls in any bag after operations.

1. **Binary search on answer**: Search for the minimum `mid` (max balls per bag) from 1 to the maximum in nums.

2. **Check feasibility**: For a given `mid`, calculate the operations needed:
   - For each bag with `num > mid`, operations = `(num - 1) // mid`
   - If total operations <= maxOperations, it's possible

3. **Binary search**: Narrow down the search space based on feasibility.

---

## Complexity Analysis

- **Time Complexity:** O(n log M), where n is the number of bags and M is the maximum number in nums
- **Space Complexity:** O(1), using only constant extra space
