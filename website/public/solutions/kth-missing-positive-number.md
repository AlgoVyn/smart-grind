# Kth Missing Positive Number

## Problem Description

Given a sorted array `arr` of **distinct positive integers** and an integer `k`, return the kth positive integer that is **missing** from this array.

---

## Examples

### Example 1

| Input | Output |
|-------|--------|
| `arr = [2,3,4,7,11], k = 5` | `9` |

**Explanation:** The missing positive integers are `[1,5,6,8,9,10,12,13,...]`. The 5th missing is `9`.

### Example 2

| Input | Output |
|-------|--------|
| `arr = [1,2,3,4], k = 2` | `6` |

**Explanation:** The missing positive integers are `[5,6,7,...]`. The 2nd missing is `6`.

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 ≤ arr.length ≤ 10^3` | Array length |
| `1 ≤ arr[i] ≤ 10^3` | Element values |
| `1 ≤ k ≤ 10^3` | Missing count |
| `arr[i] < arr[j]` for `i < j` | Strictly increasing |

---

## Solution

```python
from typing import List

class Solution:
    def findKthPositive(self, arr: List[int], k: int) -> int:
        left, right = 0, len(arr)
        while left < right:
            mid = (left + right) // 2
            # Count missing numbers up to arr[mid]
            missing = arr[mid] - (mid + 1)
            if missing < k:
                left = mid + 1
            else:
                right = mid
        return left + k
```

---

## Explanation

We use **binary search** to find the smallest index where the count of missing numbers is at least `k`:

1. For index `mid`, the count of missing numbers is `arr[mid] - (mid + 1)`
   - This works because at position `i`, we expect the value to be at least `i+1`
   - Any difference represents missing numbers

2. **Binary search logic:**
   - If `missing < k`: Need more missing numbers → search right half
   - Otherwise: Search left half

3. After the loop, `left` is the index where kth missing occurs
4. The kth missing positive is `left + k`

---

## Complexity Analysis

| Metric | Complexity | Description |
|--------|------------|-------------|
| **Time** | `O(log n)` | Binary search on array |
| **Space** | `O(1)` | Constant extra space |

---

## Follow-up Challenge

Could you solve this problem in less than `O(n)` time? (Our solution already achieves `O(log n)`!)

---

## Alternative Approach: Linear Scan

For comparison, here's the simpler `O(n)` approach:

```python
class Solution:
    def findKthPositive(self, arr: List[int], k: int) -> int:
        missing = 0
        expected = 1
        for num in arr:
            while num != expected:
                missing += 1
                if missing == k:
                    return expected
                expected += 1
            expected += 1
        # If not found in array, it's beyond all elements
        while missing < k:
            missing += 1
            expected += 1
        return expected - 1
```
