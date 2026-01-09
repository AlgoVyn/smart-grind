# Maximum Frequency Of An Element After Performing Operations I

## Problem Description

You are given an integer array `nums` and two integers `k` and `numOperations`. You must perform an operation `numOperations` times on `nums`, where in each operation you:

1. Select an index `i` that was not selected in any previous operations
2. Add an integer in the range `[-k, k]` to `nums[i]`

Return the maximum possible frequency of any element in `nums` after performing the operations.

### Example 1

**Input:** `nums = [1,4,5]`, `k = 1`, `numOperations = 2`

**Output:** `2`

**Explanation:**

We can achieve a maximum frequency of two by:
- Adding `0` to `nums[1]`. `nums` becomes `[1, 4, 5]`
- Adding `-1` to `nums[2]`. `nums` becomes `[1, 4, 4]`

### Example 2

**Input:** `nums = [5,11,20,20]`, `k = 5`, `numOperations = 1`

**Output:** `2`

**Explanation:**

We can achieve a maximum frequency of two by:
- Adding `0` to `nums[1]`

### Constraints

- `1 <= nums.length <= 10^5`
- `1 <= nums[i] <= 10^5`
- `0 <= k <= 10^5`
- `0 <= numOperations <= nums.length`

## Solution

```python
from typing import List
import bisect
from collections import Counter

class Solution:
    def maxFrequency(self, nums: List[int], k: int, numOperations: int) -> int:
        nums.sort()
        freq = Counter(nums)
        max_freq = 0

        for num in freq:
            left = bisect.bisect_left(nums, num - k)
            right = bisect.bisect_right(nums, num + k) - 1
            total = right - left + 1
            base = freq[num]
            adjustable = total - base
            current = base + min(numOperations, adjustable)
            max_freq = max(max_freq, current)

        return max_freq
```

## Explanation

To solve this problem, we need to maximize the frequency of any element in the array after performing up to `numOperations` operations, where each operation adds a value between `-k` and `k` to a unique element.

### Approach

1. **Sort the array:** Sort `nums` to enable efficient range queries using binary search.

2. **Count frequencies:** Use a `Counter` to store the frequency of each number in `nums`.

3. **For each unique number `num` (potential target):**
   - Find the leftmost index where `nums[left] >= num - k` using `bisect_left`
   - Find the rightmost index where `nums[right] <= num + k` using `bisect_right` and subtract 1
   - Calculate the total number of elements in the range `[num - k, num + k]`
   - The base frequency is the count of `num` itself (`freq[num]`)
   - The number of adjustable elements is `total - base`
   - The achievable frequency for this target is `base + min(numOperations, adjustable)`
   - Update the maximum frequency found

The overall maximum frequency is the answer.

### Time Complexity

- **O(n log n)** due to sorting and binary search operations for each unique element

### Space Complexity

- **O(n)** for the counter and sorted array
