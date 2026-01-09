# Next Greater Element I

## Problem Description

The next greater element of some element x in an array is the first greater element that is to the right of x in the same array.

You are given two distinct 0-indexed integer arrays `nums1` and `nums2`, where `nums1` is a subset of `nums2`.

For each `0 <= i < nums1.length`, find the index `j` such that `nums1[i] == nums2[j]` and determine the next greater element of `nums2[j]` in `nums2`. If there is no next greater element, then the answer for this query is -1.

Return an array `ans` of length `nums1.length` such that `ans[i]` is the next greater element as described above.

## Examples

### Example 1

**Input:**
```python
nums1 = [4, 1, 2], nums2 = [1, 3, 4, 2]
```

**Output:**
```python
[-1, 3, -1]
```

**Explanation:**
The next greater element for each value of nums1 is as follows:
- 4 is underlined in nums2 = [1, 3, 4, 2]. There is no next greater element, so the answer is -1.
- 1 is underlined in nums2 = [1, 3, 4, 2]. The next greater element is 3.
- 2 is underlined in nums2 = [1, 3, 4, 2]. There is no next greater element, so the answer is -1.

### Example 2

**Input:**
```python
nums1 = [2, 4], nums2 = [1, 2, 3, 4]
```

**Output:**
```python
[3, -1]
```

**Explanation:**
The next greater element for each value of nums1 is as follows:
- 2 is underlined in nums2 = [1, 2, 3, 4]. The next greater element is 3.
- 4 is underlined in nums2 = [1, 2, 3, 4]. There is no next greater element, so the answer is -1.

## Constraints

- `1 <= nums1.length <= nums2.length <= 1000`
- `0 <= nums1[i], nums2[i] <= 10^4`
- All integers in nums1 and nums2 are unique.
- All the integers of nums1 also appear in nums2.

**Follow up:** Could you find an O(nums1.length + nums2.length) solution?

## Solution

```python
from typing import List

class Solution:
    def nextGreaterElement(self, nums1: List[int], nums2: List[int]) -> List[int]:
        stack = []
        next_greater = {}
        for num in nums2:
            while stack and stack[-1] < num:
                next_greater[stack.pop()] = num
            stack.append(num)
        return [next_greater.get(num, -1) for num in nums1]
```

## Explanation

This problem requires finding the next greater element for each element in nums1 from nums2.

### Algorithm Steps

1. First, build a map for nums2: value to its next greater element.

2. Use a stack on nums2: iterate, while `stack not empty` and `nums2[stack[-1]] < nums2[i]`, pop and set `map[nums2[popped]] = nums2[i]`.

3. Push i.

4. For nums1, for each value, if in map, use `map[value]`, else -1.

## Complexity Analysis

- **Time Complexity:** O(n + m), where n and m are lengths of nums1 and nums2.
- **Space Complexity:** O(n + m), for the stack and map.
