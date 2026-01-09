# Sqrt(x)

## Problem Description
Given a non-negative integer x, return the square root of x rounded down to the nearest integer. The returned integer should be non-negative as well.
You must not use any built-in exponent function or operator.

For example, do not use pow(x, 0.5) in c++ or x ** 0.5 in python.

 
Example 1:

Input: x = 4
Output: 2
Explanation: The square root of 4 is 2, so we return 2.

Example 2:

Input: x = 8
Output: 2
Explanation: The square root of 8 is 2.82842..., and since we round it down to the nearest integer, 2 is returned.

 
Constraints:

0 <= x <= 231 - 1

---

## Solution

```python
class Solution:
    def mySqrt(self, x: int) -> int:
        if x < 2:
            return x
        left, right = 1, x
        while left <= right:
            mid = (left + right) // 2
            if mid * mid == x:
                return mid
            elif mid * mid < x:
                left = mid + 1
            else:
                right = mid - 1
        return right
```

---

## Explanation

This problem requires computing the integer square root of a non-negative integer x, rounded down, without using built-in functions like sqrt or **.

### Step-by-Step Approach:

1. **Handle Small Cases**: If x is 0 or 1, return x directly.

2. **Binary Search Setup**: Initialize left = 1, right = x.

3. **Binary Search Loop**:
   - Calculate mid = (left + right) // 2.
   - If mid * mid == x, return mid (exact square root).
   - If mid * mid < x, search in the right half (left = mid + 1).
   - If mid * mid > x, search in the left half (right = mid - 1).

4. **Return Result**: When the loop ends, right will be the floor of sqrt(x).

### Time Complexity:
- O(log x), as binary search halves the range each time.

### Space Complexity:
- O(1), using only a few variables.
