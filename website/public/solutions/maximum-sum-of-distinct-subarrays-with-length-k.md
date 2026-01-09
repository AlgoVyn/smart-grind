# Maximum Sum Of Distinct Subarrays With Length K

## Problem Description
You are given an integer array nums and an integer k. Find the maximum subarray sum of all the subarrays of nums that meet the following conditions:

The length of the subarray is k, and
All the elements of the subarray are distinct.

Return the maximum subarray sum of all the subarrays that meet the conditions. If no subarray meets the conditions, return 0.
A subarray is a contiguous non-empty sequence of elements within an array.
 
Example 1:

Input: nums = [1,5,4,2,9,9,9], k = 3
Output: 15
Explanation: The subarrays of nums with length 3 are:
- [1,5,4] which meets the requirements and has a sum of 10.
- [5,4,2] which meets the requirements and has a sum of 11.
- [4,2,9] which meets the requirements and has a sum of 15.
- [2,9,9] which does not meet the requirements because the element 9 is repeated.
- [9,9,9] which does not meet the requirements because the element 9 is repeated.
We return 15 because it is the maximum subarray sum of all the subarrays that meet the conditions

Example 2:

Input: nums = [4,4,4], k = 3
Output: 0
Explanation: The subarrays of nums with length 3 are:
- [4,4,4] which does not meet the requirements because the element 4 is repeated.
We return 0 because no subarrays meet the conditions.

 
Constraints:

1 <= k <= nums.length <= 105
1 <= nums[i] <= 105
## Solution

```python
def maximumSubarraySum(nums, k):
    max_sum = 0
    current_sum = 0
    window = set()
    left = 0
    for right in range(len(nums)):
        # Shrink from left if duplicate
        while nums[right] in window:
            window.remove(nums[left])
            current_sum -= nums[left]
            left += 1
        # Add right
        window.add(nums[right])
        current_sum += nums[right]
        # If window size == k, update max_sum and shrink left
        if right - left + 1 == k:
            max_sum = max(max_sum, current_sum)
            window.remove(nums[left])
            current_sum -= nums[left]
            left += 1
    return max_sum
```

## Explanation
This problem requires finding the maximum sum of a subarray of length k where all elements are distinct. It uses a sliding window approach with a set to ensure distinctness.

### Step-by-Step Approach:
1. **Initialize Variables:**
   - `max_sum` to track the maximum sum found.
   - `current_sum` for the sum of the current window.
   - `window` set to keep track of elements in the current window.
   - `left` pointer for the start of the window.

2. **Slide the Window:**
   - Iterate `right` from 0 to len(nums)-1.
   - While `nums[right]` is already in the window (duplicate), remove `nums[left]` from the set and sum, and increment `left`.
   - Add `nums[right]` to the set and sum.

3. **Check Window Size:**
   - If the current window size (right - left + 1) equals k, update `max_sum` with `current_sum`.
   - Then, remove `nums[left]` from the set and sum, and increment `left` to slide the window.

4. **Return Result:**
   - After processing all elements, return `max_sum`. If no valid subarray, it remains 0.

### Time Complexity:
- O(n), where n is the length of nums, as each element is added and removed from the set at most once.

### Space Complexity:
- O(k), for the set storing up to k elements.
