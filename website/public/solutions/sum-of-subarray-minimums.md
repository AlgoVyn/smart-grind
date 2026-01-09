# Sum Of Subarray Minimums

## Problem Description
Given an array of integers arr, find the sum of min(b), where b ranges over every (contiguous) subarray of arr. Since the answer may be large, return the answer modulo 109 + 7.
 
Example 1:

Input: arr = [3,1,2,4]
Output: 17
Explanation: 
Subarrays are [3], [1], [2], [4], [3,1], [1,2], [2,4], [3,1,2], [1,2,4], [3,1,2,4]. 
Minimums are 3, 1, 2, 4, 1, 1, 2, 1, 1, 1.
Sum is 17.

Example 2:

Input: arr = [11,81,94,43,3]
Output: 444

 
Constraints:

1 <= arr.length <= 3 * 104
1 <= arr[i] <= 3 * 104
## Solution

```python
from typing import List

class Solution:
    def sumSubarrayMins(self, arr: List[int]) -> int:
        MOD = 10**9 + 7
        n = len(arr)
        left = [-1] * n
        right = [n] * n
        stack = []
        
        # Find left boundaries
        for i in range(n):
            while stack and arr[stack[-1]] >= arr[i]:
                stack.pop()
            if stack:
                left[i] = stack[-1]
            stack.append(i)
        
        stack = []
        # Find right boundaries
        for i in range(n-1, -1, -1):
            while stack and arr[stack[-1]] > arr[i]:
                stack.pop()
            if stack:
                right[i] = stack[-1]
            stack.append(i)
        
        res = 0
        for i in range(n):
            l = i - left[i]
            r = right[i] - i
            res = (res + arr[i] * l * r) % MOD
        return res
```

## Explanation
This problem requires summing the minimums of all subarrays, modulo 10^9+7.

### Step-by-Step Approach:
1. **Monotonic Stack for Boundaries**: Use stack to find for each i, the leftmost index where arr[j] < arr[i], and rightmost where arr[j] <= arr[i].

2. **Calculate Contribution**: For each i, the number of subarrays where arr[i] is minimum is (i - left[i]) * (right[i] - i).

3. **Sum Up**: Add arr[i] * contribution for each i, take modulo.

### Time Complexity:
- O(n), as each element is pushed and popped once.

### Space Complexity:
- O(n), for the stack and arrays.
