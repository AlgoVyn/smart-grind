# Stack - Monotonic Stack

## Overview

The Monotonic Stack pattern maintains a stack where elements are kept in strictly increasing or decreasing order. This data structure is particularly useful for finding the next greater or smaller element for each element in an array in linear time. It's commonly applied in problems involving finding nearest larger/smaller values, removing digits to form smallest number, or calculating areas in histograms.

This pattern should be used when:
- Finding the next greater/smaller element to the right or left
- Computing span of elements (like stock span problems)
- Solving problems that require O(n) time complexity for element comparisons

Benefits include:
- Achieves O(n) time complexity compared to O(n^2) brute force
- Space efficient with O(n) worst-case usage
- Can handle both increasing and decreasing monotonicity
- Adaptable to circular arrays by iterating twice

## Key Concepts

- **Increasing Monotonic Stack**: Elements increase from bottom to top (strictly greater)
- **Decreasing Monotonic Stack**: Elements decrease from bottom to top (strictly smaller)
- **Stack Maintenance**: When pushing a new element, pop elements that violate the monotonic order
- **Result Tracking**: Use an array to store results for each position
- **Iteration Direction**: Often iterate from right to left to find next greater elements

## Template

```python
def next_greater_element(nums):
    # Result array initialized to -1 (no greater element found)
    result = [-1] * len(nums)
    # Monotonic stack storing indices (for decreasing stack)
    stack = []
    
    # Iterate from right to left
    for i in range(len(nums) - 1, -1, -1):
        # Pop elements smaller than or equal to current (for next greater)
        while stack and nums[stack[-1]] <= nums[i]:
            stack.pop()
        
        # If stack not empty, top is the next greater element
        if stack:
            result[i] = nums[stack[-1]]
        
        # Push current index onto stack
        stack.append(i)
    
    return result
```

## Example Problems

1. **Next Greater Element I** (LeetCode 496): Find the next greater element for each element in nums1 from nums2.
2. **Daily Temperatures** (LeetCode 739): Given daily temperatures, return an array where each element is the number of days to wait for a warmer temperature.
3. **Largest Rectangle in Histogram** (LeetCode 84): Find the largest rectangular area in a histogram.

## Time and Space Complexity

- **Time Complexity**: O(n), as each element is pushed and popped at most once
- **Space Complexity**: O(n) for the stack and result array

## Common Pitfalls

- Choosing wrong iteration direction (right-to-left for next greater, left-to-right for previous greater)
- Handling equal elements (decide if strict or non-strict monotonicity is needed)
- Forgetting to handle circular arrays by iterating the array twice
- Not initializing result array correctly (often with -1 or specific values)
- Confusing increasing vs decreasing stack for the problem requirements