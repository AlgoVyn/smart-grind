# Longest Subarray of 1's After Deleting One Element

## Problem Description

Given a binary array `nums`, delete exactly one element from it. Return the size of the longest non-empty subarray containing only `1`'s in the resulting array. Return `0` if there is no such subarray.

---

## Examples

### Example 1

**Input:**
```python
nums = [1, 1, 0, 1]
```

**Output:**
```
3
```

**Explanation:** After deleting the `0` at position 2, the array becomes `[1, 1, 1]` with a subarray of length 3.

### Example 2

**Input:**
```python
nums = [0, 1, 1, 1, 0, 1, 1, 0, 1]
```

**Output:**
```
5
```

**Explanation:** After deleting the `0` at position 4, the array becomes `[0, 1, 1, 1, 1, 1, 0, 1]`. The longest subarray of 1's is `[1, 1, 1, 1, 1]` with length 5.

### Example 3

**Input:**
```python
nums = [1, 1, 1]
```

**Output:**
```
2
```

**Explanation:** We must delete exactly one element. After deleting any `1`, the longest subarray of 1's has length 2.

---

## Constraints

- `1 <= nums.length <= 10^5`
- `nums[i]` is either `0` or `1`

---

## Solution

```python
from typing import List

class Solution:
    def longestSubarray(self, nums: List[int]) -> int:
        left = 0
        zero_count = 0
        max_result = 0
        for right in range(len(nums)):
            if nums[right] == 0:
                zero_count += 1
            while zero_count > 1:
                if nums[left] == 0:
                    zero_count -= 1
                left += 1
            current_len = right - left + 1
            if zero_count == 0:
                candidate = current_len - 1  # Must delete one element
            else:
                candidate = current_len if current_len > 1 else 0
            max_result = max(max_result, candidate)
        return max_result
```

---

## Explanation

We use a **sliding window** to find the maximum length of a subarray with at most one `0`.

### Key Insight

The window can contain at most one `0` (which we will delete). The resulting subarray length is:

- **If window has no zeros**: `current_len - 1` (must delete one element)
- **If window has one zero**: `current_len` (delete the zero)
- **Otherwise**: Not valid

### Algorithm

1. Initialize `left` pointer and `zero_count`
2. Expand the window by moving `right`:
   - Count zeros in the window
   - If more than one zero, shrink from the left
3. Calculate candidate length for each valid window
4. Track and return the maximum

---

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(n)` — Each element is visited at most twice |
| **Space** | `O(1)` — Only a few variables used |
