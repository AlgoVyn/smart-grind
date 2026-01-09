# Next Permutation

## Problem Description

A permutation of an array of integers is an arrangement of its members into a sequence or linear order.

For example, for `arr = [1,2,3]`, the following are all the permutations of `arr`: `[1,2,3]`, `[1,3,2]`, `[2, 1, 3]`, `[2, 3, 1]`, `[3,1,2]`, `[3,2,1]`.

The next permutation of an array of integers is the next lexicographically greater permutation of its integer. More formally, if all the permutations of the array are sorted in one container according to their lexicographical order, then the next permutation of that array is the permutation that follows it in the sorted container. If such arrangement is not possible, the array must be rearranged as the lowest possible order (i.e., sorted in ascending order).

For example, the next permutation of `arr = [1,2,3]` is `[1,3,2]`.

Similarly, the next permutation of `arr = [2,3,1]` is `[3,1,2]`.

While the next permutation of `arr = [3,2,1]` is `[1,2,3]` because `[3,2,1]` does not have a lexicographical larger rearrangement.

Given an array of integers `nums`, find the next permutation of `nums`.

The replacement must be in place and use only constant extra memory.

---

## Examples

### Example 1

**Input:**
```python
nums = [1, 2, 3]
```

**Output:**
```python
[1, 3, 2]
```

### Example 2

**Input:**
```python
nums = [3, 2, 1]
```

**Output:**
```python
[1, 2, 3]
```

### Example 3

**Input:**
```python
nums = [1, 1, 5]
```

**Output:**
```python
[1, 5, 1]
```

---

## Constraints

- `1 <= nums.length <= 100`
- `0 <= nums[i] <= 100`

---

## Solution

```python
from typing import List

class Solution:
    def nextPermutation(self, nums: List[int]) -> None:
        n = len(nums)
        i = n - 2
        while i >= 0 and nums[i] >= nums[i + 1]:
            i -= 1
        if i >= 0:
            j = n - 1
            while nums[j] <= nums[i]:
                j -= 1
            nums[i], nums[j] = nums[j], nums[i]
        nums[i + 1:] = reversed(nums[i + 1:])
```

---

## Explanation

This problem requires generating the next permutation of the array in lexicographical order.

### Algorithm Steps

1. Find the largest index `i` such that `nums[i] < nums[i+1]` (from right).

2. If no such `i`, reverse the array (it's the last permutation).

3. Find the smallest index `j > i` such that `nums[j] > nums[i]`.

4. Swap `nums[i]` and `nums[j]`.

5. Reverse the subarray from `i+1` to the end.

---

## Complexity Analysis

- **Time Complexity:** O(n), for the linear scans.
- **Space Complexity:** O(1), modifying in place.
