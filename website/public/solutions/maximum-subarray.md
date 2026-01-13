# LeetCode Problem: Maximum Subarray (Problem 53)

## Problem Statement

Given an integer array `nums`, find the contiguous subarray (containing at least one number) within an array which has the largest sum and return its sum.

A subarray is a contiguous part of the array. The problem requires returning the maximum sum, not the subarray itself.

## Examples

### Example 1
- **Input**: `nums = [-2,1,-3,4,-1,2,1,-5,4]`
- **Output**: `6`
- **Explanation**: The subarray `[4,-1,2,1]` has the largest sum of 6.

### Example 2
- **Input**: `nums = [1]`
- **Output**: `1`
- **Explanation**: The subarray `[1]` has the largest sum of 1.

### Example 3
- **Input**: `nums = [5,4,-1,7,8]`
- **Output**: `23`
- **Explanation**: The subarray `[5,4,-1,7,8]` has the largest sum of 23.

## Constraints
- `1 <= nums.length <= 10^5`
- `-10^4 <= nums[i] <= 10^4`

## Intuition
The core idea is to identify the continuous sequence of numbers in the array that adds up to the highest possible value. A naive approach would check every possible subarray, but that's inefficient for large arrays. Instead, we can observe that any subarray with a negative prefix can be improved by discarding that prefix, as it drags down the total sum. This leads to dynamic programming or divide-and-conquer strategies that efficiently track potential maximum sums without redundant calculations.

## Multiple Approaches

### 1. Brute Force Approach
Iterate through all possible subarrays by using two nested loops: one for the starting index and one for the ending index. For each subarray, compute its sum and track the maximum.

- **Code Snippet**:
  ```python
  max_sum = -infinity
  for i in 0 to n-1:
      current_sum = 0
      for j in i to n-1:
          current_sum += nums[j]
          max_sum = max(max_sum, current_sum)
  return max_sum
  ```

- **Time Complexity**: O(n²) – Due to the nested loops checking all O(n²) subarrays.
- **Space Complexity**: O(1) – No extra space beyond variables.
- **Drawbacks**: Too slow for the constraint n=10^5, as it would take around 10^10 operations.

### 2. Divide and Conquer Approach
This method splits the array into halves recursively, computing the maximum subarray sum in the left half, right half, and the maximum crossing the midpoint (by finding the maximum suffix sum from the left and prefix sum from the right).

- **Code Snippet**:
  ```python
  def max_subarray(nums, low, high):
      if low == high:
          return nums[low]
      mid = (low + high) // 2
      left_max = max_subarray(nums, low, mid)
      right_max = max_subarray(nums, mid+1, high)
      cross_max = max_crossing_sum(nums, low, mid, high)
      return max(left_max, right_max, cross_max)

  def max_crossing_sum(nums, low, mid, high):
      left_sum = -infinity
      current = 0
      for i in range(mid, low-1, -1):
          current += nums[i]
          left_sum = max(left_sum, current)
      right_sum = -infinity
      current = 0
      for i in range(mid+1, high+1):
          current += nums[i]
          right_sum = max(right_sum, current)
      return left_sum + right_sum
  ```

- **How to Arrive at the Solution**: Recursion breaks the problem into smaller subproblems. The base case is a single element. For merging, ensure we consider subarrays that span both halves by computing the best extensions from the midpoint.
- **Time Complexity**: O(n log n) – Each recursion level processes O(n) elements for crossing sums, with log n levels.
- **Space Complexity**: O(log n) – Due to the recursion stack.
- **Advantages**: More efficient than brute force and a good exercise in divide-and-conquer, as suggested in the follow-up.

### 3. Kadane's Algorithm (Optimal Dynamic Programming Approach)
This is the most efficient method. Maintain a running sum of the current subarray. If the running sum becomes negative, reset it to the current element (as starting a new subarray is better). Track the global maximum sum encountered.

- **Code Snippet**:
  ```python
  max_current = max_global = nums[0]
  for i in 1 to n-1:
      max_current = max(nums[i], max_current + nums[i])
      if max_current > max_global:
          max_global = max_current
  return max_global
  ```

- **How to Arrive at the Solution**: Use dynamic programming where dp[i] represents the maximum subarray sum ending at index i. Then, dp[i] = max(nums[i], dp[i-1] + nums[i]). The global max is the maximum over all dp[i]. This can be optimized to O(1) space by using variables instead of an array.
- **Time Complexity**: O(n) – Single pass through the array.
- **Space Complexity**: O(1) – Constant space.
- **Edge Cases**: Handles all-negative arrays correctly (returns the least negative number) and single-element arrays.

## Time/Space Complexity Analysis Summary

| Approach              | Time Complexity | Space Complexity |
|-----------------------|-----------------|------------------|
| Brute Force          | O(n²)          | O(1)            |
| Divide and Conquer   | O(n log n)     | O(log n)        |
| Kadane's Algorithm   | O(n)           | O(1)            |

The optimal choice is Kadane's for its balance of efficiency and simplicity, meeting the constraints easily.

## Related Problems
Here are some similar LeetCode problems that build on similar concepts like subarray sums or dynamic programming:
- [121. Best Time to Buy and Sell Stock](https://leetcode.com/problems/best-time-to-buy-and-sell-stock/) – Similar to finding max difference, can be solved with a variant of Kadane.
- [152. Maximum Product Subarray](https://leetcode.com/problems/maximum-product-subarray/) – Handles products instead of sums, tracking max and min due to negatives.
- [918. Maximum Sum Circular Subarray](https://leetcode.com/problems/maximum-sum-circular-subarray/) – Extends to circular arrays using Kadane variants.
- [1749. Maximum Absolute Sum of Any Subarray](https://leetcode.com/problems/maximum-absolute-sum-of-any-subarray/) – Similar but for absolute sums.
- [2272. Substring With Largest Variance](https://leetcode.com/problems/substring-with-largest-variance/) – Involves tracking variances in subarrays.

## Video Tutorial Links
For visual explanations, check these tutorials:
- [Maximum Subarray (Kadane's Algorithm) - Leetcode 53](https://www.youtube.com/watch?v=hLPkqd60-28) – Detailed Python walkthrough.
- [Amazon Coding Interview Question - Leetcode 53 - Python](https://www.youtube.com/watch?v=5WZl3MMT0Eg) – Focuses on interview preparation.
- [Maximum Subarray Solution (Kadane's Algorithm) Visually Explained](https://www.youtube.com/watch?v=lq8KOs1Ujas) – Animated visual breakdown.
- [Divide and Conquer Explained FAST! | Maximum Subarray Sum](https://www.youtube.com/shorts/zSZnkRoTJxc) – Quick divide-and-conquer focus.