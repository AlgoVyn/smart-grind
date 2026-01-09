# Maximum Average Subarray I

## Problem Description

You are given an integer array `nums` consisting of `n` elements, and an integer `k`. Find a contiguous subarray whose length is equal to `k` that has the maximum average value and return this value.

Any answer with a calculation error less than `10^-5` will be accepted.

---

## Examples

### Example 1

**Input:**
```python
nums = [1, 12, -5, -6, 50, 3], k = 4
```

**Output:**
```
12.75000
```

**Explanation:** Maximum average is `(12 + (-5) + (-6) + 50) / 4 = 51 / 4 = 12.75`.

### Example 2

**Input:**
```python
nums = [5], k = 1
```

**Output:**
```
5.00000
```

---

## Constraints

- `n == nums.length`
- `1 <= k <= n <= 10^5`
- `-10^4 <= nums[i] <= 10^4`

---

## Solution

```python
def findMaxAverage(nums: List[int], k: int) -> float:
    current_sum = sum(nums[:k])
    max_sum = current_sum
    for i in range(k, len(nums)):
        current_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, current_sum)
    return max_sum / k
```

---

## Explanation

We use a **sliding window** to efficiently compute the sum of all subarrays of length `k`.

### Algorithm

1. **Initial Sum**: Compute the sum of the first `k` elements
2. **Slide Window**: For each subsequent element:
   - Add the new element
   - Subtract the element leaving the window
   - Update `max_sum`
3. **Return Average**: Divide `max_sum` by `k`

### Why This Works

The sliding window maintains the sum of the current window in `O(1)` time per element, avoiding the `O(k)` cost of recomputing sums from scratch.

---

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | `O(n)` — Single pass through the array |
| **Space** | `O(1)` — Only a few variables used |
