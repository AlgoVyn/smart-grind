# Maximum Average Subarray I

## Problem Description
You are given an integer array nums consisting of n elements, and an integer k.
Find a contiguous subarray whose length is equal to k that has the maximum average value and return this value. Any answer with a calculation error less than 10-5 will be accepted.
 
Example 1:

Input: nums = [1,12,-5,-6,50,3], k = 4
Output: 12.75000
Explanation: Maximum average is (12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75

Example 2:

Input: nums = [5], k = 1
Output: 5.00000

 
Constraints:

n == nums.length
1 <= k <= n <= 105
-104 <= nums[i] <= 104
## Solution

```python
def findMaxAverage(nums, k):
    current_sum = sum(nums[:k])
    max_sum = current_sum
    for i in range(k, len(nums)):
        current_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, current_sum)
    return max_sum / k
```

## Explanation
This problem finds the maximum average of any subarray of length k using a sliding window to compute sums efficiently.

### Step-by-Step Approach:
1. **Initial Sum:**
   - Compute sum of first k elements.

2. **Slide Window:**
   - For each subsequent element, add it and subtract the element leaving the window.
   - Update max_sum.

3. **Return Average:**
   - Divide max_sum by k.

### Time Complexity:
- O(n), where n is the length of nums.

### Space Complexity:
- O(1), excluding input.
