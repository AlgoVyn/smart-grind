# Find X Sum Of All K Long Subarrays I

## Problem Description

You are given an array `nums` of `n` integers and two integers `k` and `x`.

### X-Sum Definition

The **x-sum** of an array is calculated by:

1. Count the occurrences of all elements in the array
2. Keep only the occurrences of the **top `x` most frequent** elements
   - If two elements have the same frequency, the **larger value** is considered more frequent
3. Calculate the sum of the resulting array
4. If the array has fewer than `x` distinct elements, the x-sum is the sum of the entire array

Return an array `answer` of length `n - k + 1` where `answer[i]` is the x-sum of subarray `nums[i..i + k - 1]`.

### Examples

**Example 1:**

| Parameter | Value |
|-----------|-------|
| `nums` | `[1, 1, 2, 2, 3, 4, 2, 3]` |
| `k` | `6` |
| `x` | `2` |
| **Output** | `[6, 10, 12]` |

**Explanation:**
- Subarray `[1, 1, 2, 2, 3, 4]` → Top 2: `1` (2x), `2` (2x) → Sum = `1+1+2+2 = 6`
- Subarray `[1, 2, 2, 3, 4, 2]` → Top 2: `2` (3x), `4` (1x) → Sum = `2+2+2+4 = 10`
- Subarray `[2, 2, 3, 4, 2, 3]` → Top 2: `2` (3x), `3` (2x) → Sum = `2+2+2+3+3 = 12`

**Example 2:**

| Parameter | Value |
|-----------|-------|
| `nums` | `[3, 8, 7, 8, 7, 5]` |
| `k` | `2` |
| `x` | `2` |
| **Output** | `[11, 15, 15, 15, 12]` |

**Explanation:** Since `k == x`, every subarray keeps all elements, so x-sum equals the subarray sum.

### Constraints

| Constraint | Description |
|------------|-------------|
| `n == nums.length` | `1 <= n <= 50` |
| `nums[i]` | `1 <= nums[i] <= 50` |
| `x` | `1 <= x <= k <= nums.length` |

---

## Solution

```python
from typing import List
from collections import Counter

class Solution:
    def findXSum(self, nums: List[int], k: int, x: int) -> List[int]:
        result = []
        
        for i in range(len(nums) - k + 1):
            # Get current subarray
            sub = nums[i:i + k]
            
            # Count element frequencies
            count = Counter(sub)
            
            # Sort by: frequency (desc), then value (desc)
            candidates = sorted(
                count.items(), 
                key=lambda p: (-p[1], -p[0])
            )[:x]
            
            # Calculate x-sum
            x_sum = sum(freq * val for val, freq in candidates)
            result.append(x_sum)
        
        return result
```

### Approach

For each subarray of size `k`:

1. **Extract** the subarray `nums[i:i + k]`
2. **Count frequencies** using `Counter`
3. **Sort elements** by:
   - Primary: Frequency descending (`-p[1]`)
   - Secondary: Value descending (`-p[0]`)
4. **Select top `x`** elements
5. **Calculate sum** as `frequency × value` for each selected element
6. **Append** to results

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O((n-k+1) × k log k)` — Sorting `k` elements for each subarray |
| **Space** | `O(k)` — Counter and sorting storage |

### Optimization Note

For larger inputs, maintain a sliding window with frequency counters to achieve `O(n)` or `O(n log x)` time. However, for `n <= 50`, the straightforward approach is clear and efficient.

---
