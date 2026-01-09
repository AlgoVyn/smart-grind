# Next Greater Element Ii

## Problem Description

Given a circular integer array `nums` (i.e., the next element of `nums[nums.length - 1]` is `nums[0]`), return the next greater number for every element in nums.

The next greater number of a number `x` is the first greater number to its traversing-order next in the array, which means you could search circularly to find its next greater number. If it doesn't exist, return -1 for this number.

## Examples

### Example 1

**Input:**
```
nums = [1, 2, 1]
```

**Output:**
```
[2, -1, 2]
```

**Explanation:**
The first 1's next greater number is 2.
The number 2 can't find next greater number.
The second 1's next greater number needs to search circularly, which is also 2.

### Example 2

**Input:**
```
nums = [1, 2, 3, 4, 3]
```

**Output:**
```
[2, 3, 4, -1, 4]
```

## Constraints

- `1 <= nums.length <= 10^4`
- `-10^9 <= nums[i] <= 10^9`

## Solution

```python
from typing import List

class Solution:
    def nextGreaterElements(self, nums: List[int]) -> List[int]:
        n = len(nums)
        result = [-1] * n
        stack = []
        for i in range(2 * n):
            while stack and nums[stack[-1]] < nums[i % n]:
                result[stack.pop()] = nums[i % n]
            if i < n:
                stack.append(i)
        return result
```

## Explanation

This problem requires finding the next greater element for each element in a circular array.

### Algorithm Steps

1. Use a stack to keep indices.

2. Iterate through the array twice (0 to 2*n-1), using `index % n`.

3. For each element, while the stack is not empty and the current element is greater than the element at the top of the stack, pop the stack and set the result for that index to the current element.

4. Push the current index `% n` onto the stack.

5. Elements with no greater element remain -1.

## Complexity Analysis

- **Time Complexity:** O(n), as each element is pushed and popped at most once.
- **Space Complexity:** O(n), for the stack and result array.
