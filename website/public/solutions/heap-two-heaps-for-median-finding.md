# Heap - Two Heaps for Median Finding

## Overview

The Heap - Two Heaps for Median Finding pattern uses two priority queues (heaps) to efficiently maintain the median of a stream of numbers. One max-heap stores the lower half of the numbers, and one min-heap stores the upper half. This ensures the median can be found in constant time after each insertion. It's ideal for scenarios involving streaming data or when you need to compute running medians. The benefits include O(log N) time per insertion and O(1) time for median queries, making it suitable for real-time applications.

## Key Concepts

- **Max-Heap for Lower Half**: Stores the smaller half of numbers, with the largest element at the root.
- **Min-Heap for Upper Half**: Stores the larger half of numbers, with the smallest element at the root.
- **Balance Maintenance**: Ensure the heaps differ in size by at most one to keep the median accessible.
- **Median Access**: The median is either the root of the larger heap or the average of both roots if sizes are equal.

## Template

```python
import heapq

class MedianFinder:
    def __init__(self):
        # Max-heap for lower half (use negative values for max-heap in Python)
        self.lower = []  # Stores smaller half, root is largest in lower
        self.upper = []  # Min-heap for upper half, root is smallest in upper

    def addNum(self, num: int) -> None:
        # Add to max-heap (lower half)
        heapq.heappush(self.lower, -num)
        
        # Balance: move largest in lower to upper
        heapq.heappush(self.upper, -heapq.heappop(self.lower))
        
        # Ensure lower half is not smaller than upper half
        if len(self.lower) < len(self.upper):
            heapq.heappush(self.lower, -heapq.heappop(self.upper))

    def findMedian(self) -> float:
        if len(self.lower) > len(self.upper):
            return -self.lower[0]
        else:
            return (-self.lower[0] + self.upper[0]) / 2
```

## Example Problems

1. **Find Median from Data Stream**: Implement a data structure that supports adding numbers and finding the median efficiently.
2. **Sliding Window Median**: Given an array and a window size, find the median for each window as it slides.
3. **Median of Two Sorted Arrays**: Find the median of two sorted arrays without merging them completely.

## Time and Space Complexity

- **Time Complexity**: O(log N) for each addNum operation due to heap insertions and balancing. findMedian is O(1).
- **Space Complexity**: O(N) to store all elements in the two heaps.

## Common Pitfalls

- **Heap Balancing**: Failing to maintain the size difference can lead to incorrect median calculations.
- **Negative Values**: In Python, using negative values for the max-heap requires careful negation when accessing values.
- **Empty Heaps**: Handle cases when no numbers have been added yet.
- **Floating Point Precision**: When averaging for even number of elements, ensure proper float division.