# Maximum Product Subarray

## Problem Description
Given an integer array nums, find a subarray that has the largest product, and return the product.
The test cases are generated so that the answer will fit in a 32-bit integer.
Note that the product of an array with a single element is the value of that element.
 
Example 1:

Input: nums = [2,3,-2,4]
Output: 6
Explanation: [2,3] has the largest product 6.

Example 2:

Input: nums = [-2,0,-1]
Output: 0
Explanation: The result cannot be 2, because [-2,-1] is not a subarray.

 
Constraints:

1 <= nums.length <= 2 * 104
-10 <= nums[i] <= 10
The product of any subarray of nums is guaranteed to fit in a 32-bit integer.
## Solution

```python
def maxProduct(nums):
    if not nums:
        return 0
    
    max_prod = min_prod = result = nums[0]
    for num in nums[1:]:
        if num < 0:
            max_prod, min_prod = min_prod, max_prod
        max_prod = max(num, max_prod * num)
        min_prod = min(num, min_prod * num)
        result = max(result, max_prod)
    return result
```

## Explanation
This problem finds the subarray with the maximum product. It uses dynamic programming to track the maximum and minimum product ending at each position, handling negative numbers that can flip the sign.

### Step-by-Step Approach:
1. **Initialize:**
   - Set max_prod, min_prod, and result to the first element.

2. **Iterate Through Array:**
   - For each subsequent number:
     - If negative, swap max_prod and min_prod (since multiplying by negative flips signs).
     - Update max_prod to max(num, max_prod * num).
     - Update min_prod to min(num, min_prod * num).
     - Update result with max(result, max_prod).

3. **Return Result:**
   - The result holds the maximum product found.

### Time Complexity:
- O(n), where n is the length of nums, as we iterate once.

### Space Complexity:
- O(1), using only a few variables.
