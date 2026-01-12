# Sliding Window - Monotonic Queue for Max/Min

## Overview

The Sliding Window - Monotonic Queue pattern is designed for efficiently finding the maximum or minimum element in every window of size k as it slides through an array. It uses a deque (double-ended queue) to maintain elements in a monotonic order (either decreasing for max or increasing for min), ensuring that the front of the deque always contains the current window's max/min. This avoids recomputing the max/min for each window, achieving optimal performance.

When to use: This pattern is perfect for problems requiring the maximum or minimum in each sliding window of fixed size, such as in time series analysis or real-time data processing.

Benefits: Maintains O(n) time complexity while providing O(k) space usage, making it efficient for large datasets.

## Key Concepts

- **Monotonic Deque**: A deque that stores indices in decreasing order for maximum (or increasing for minimum).
- **Front Removal**: Remove elements from the front when they fall out of the current window.
- **Back Removal**: Remove elements from the back if they are smaller/larger than the current element to maintain monotonicity.
- **Index Storage**: Store indices instead of values to easily check window bounds.

## Template

```python
from collections import deque

def sliding_window_maximum(nums, k):
    """
    Template for monotonic queue sliding window maximum.
    Returns list of maximums for each window of size k.
    """
    if not nums or k == 0:
        return []
    
    result = []
    deq = deque()  # Will store indices
    
    for i in range(len(nums)):
        # Remove elements out of current window
        while deq and deq[0] < i - k + 1:
            deq.popleft()
        
        # Remove elements smaller than current from back
        while deq and nums[deq[-1]] < nums[i]:
            deq.pop()
        
        # Add current index
        deq.append(i)
        
        # Add to result when window is complete
        if i >= k - 1:
            result.append(nums[deq[0]])
    
    return result
```

## Example Problems

1. **Sliding Window Maximum**: Find the maximum in each window of size k sliding through the array.
2. **Sliding Window Minimum**: Find the minimum in each window of size k.
3. **Max Sliding Window**: Variant of sliding window maximum with additional constraints.

## Time and Space Complexity

- **Time Complexity**: O(n), as each element is added and removed from the deque at most once.
- **Space Complexity**: O(k), for the deque which stores at most k elements.

## Common Pitfalls

- **Index vs Value**: Always store indices in the deque to check window boundaries easily.
- **Deque Operations**: Ensure correct order of operations: remove out-of-window first, then maintain monotonicity.
- **Edge Cases**: Handle k=1 (each element is max), k > len(nums), or empty arrays.
- **Direction of Monotonicity**: For max, keep decreasing order; for min, keep increasing order.