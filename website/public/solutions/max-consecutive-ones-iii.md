# Max Consecutive Ones III

## Problem Description

Given a binary array `nums` and an integer `k`, return the maximum number of consecutive `1`'s in the array if you can flip at most `k` `0`'s to `1`.

---

## Examples

### Example 1

**Input:**
```python
nums = [1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0], k = 2
```

**Output:**
```python
6
```

**Explanation:** After flipping two `0`'s to `1`, the longest subarray of consecutive `1`'s has length 6.

### Example 2

**Input:**
```python
nums = [0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1], k = 3
```

**Output:**
```python
10
```

**Explanation:** After flipping three `0`'s to `1`, the longest subarray of consecutive `1`'s has length 10.

---

## Constraints

- `1 <= nums.length <= 10^5`
- `nums[i]` is either `0` or `1`
- `0 <= k <= nums.length`

---

## Solution

```python
from typing import List

class Solution:
    def longestOnes(self, nums: List[int], k: int) -> int:
        left = 0
        zero_count = 0
        max_len = 0
        for right in range(len(nums)):
            if nums[right] == 0:
                zero_count += 1
            while zero_count > k:
                if nums[left] == 0:
                    zero_count -= 1
                left += 1
            max_len = max(max_len, right - left + 1)
        return max_len
```

---

## Explanation

We use a **sliding window** to find the maximum length of a subarray with at most `k` zeros.

### Key Idea

The window `[left, right]` is always valid (contains at most `k` zeros). When we add a `0` and exceed `k`, we shrink the window from the left until it's valid again.

### Algorithm

1. Initialize `left` pointer and `zero_count`
2. Expand the window by moving `right`:
   - Count zeros in the window
   - If zeros exceed `k`, shrink from the left
3. Update `max_len` with the current valid window size
4. Return `max_len`

---

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(n)` — Each element is visited at most twice |
| **Space** | `O(1)` — Only a few variables used |
