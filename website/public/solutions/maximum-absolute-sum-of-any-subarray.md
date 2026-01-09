# Maximum Absolute Sum of Any Subarray

## Problem Description

You are given an integer array `nums`. The **absolute sum** of a subarray `[nums[l], nums[l+1], ..., nums[r]]` is `abs(nums[l] + nums[l+1] + ... + nums[r])`.

Return the maximum absolute sum of any (possibly empty) subarray of `nums`.

---

## Examples

### Example 1

**Input:**
```python
nums = [1, -3, 2, 3, -4]
```

**Output:**
```python
5
```

**Explanation:** The subarray `[2, 3]` has sum `5`, and `abs(5) = 5`.

### Example 2

**Input:**
```python
nums = [2, -5, 1, -4, 3, -2]
```

**Output:**
```python
8
```

**Explanation:** The subarray `[-5, 1, -4]` has sum `-8`, and `abs(-8) = 8`.

---

## Constraints

- `1 <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`

---

## Solution

```python
from typing import List

class Solution:
    def maxAbsoluteSum(self, nums: List[int]) -> int:
        max_sum = float('-inf')
        min_sum = float('inf')
        current_max = 0
        current_min = 0
        for num in nums:
            current_max = max(num, current_max + num)
            max_sum = max(max_sum, current_max)
            current_min = min(num, current_min + num)
            min_sum = min(min_sum, current_min)
        return max(max_sum, -min_sum)
```

---

## Explanation

We compute both the **maximum subarray sum** and **minimum subarray sum** using variants of **Kadane's algorithm**.

### Key Insight

The maximum absolute sum is the maximum of:
- The maximum subarray sum
- The absolute value of the minimum subarray sum

### Kadane's Algorithm Variants

1. **Maximum Subarray Sum**:
   ```
   current_max = max(num, current_max + num)
   max_sum = max(max_sum, current_max)
   ```

2. **Minimum Subarray Sum**:
   ```
   current_min = min(num, current_min + num)
   min_sum = min(min_sum, current_min)
   ```

### Algorithm

1. Initialize running maximum and minimum sums
2. For each number:
   - Update running maximum and track global maximum
   - Update running minimum and track global minimum
3. Return `max(max_sum, -min_sum)`

---

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(n)` — Single pass through the array |
| **Space** | `O(1)` — Only a few variables used |
