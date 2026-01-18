# Heap - Top K Elements (Selection/Frequency)

## Overview

The Heap - Top K Elements pattern is used to efficiently find the K largest or smallest elements in a dataset, or to select elements based on frequency or other criteria. This pattern leverages priority queues (heaps) to maintain a collection of the top K elements while iterating through the data. It's particularly useful when dealing with large datasets where sorting the entire array would be inefficient. The benefits include O(N log K) time complexity, which is optimal for this type of problem, and the ability to handle streaming data or cases where K is much smaller than N.

## Key Concepts

- **Priority Queue**: A data structure that allows efficient access to the highest or lowest priority element.
- **Min-Heap for Top K Largest**: Use a min-heap of size K to keep the largest elements, removing smaller ones.
- **Max-Heap for Top K Smallest**: Use a max-heap of size K to keep the smallest elements.
- **Frequency Counting**: Often combined with hash maps to count occurrences before heap operations.
- **Heap Size Maintenance**: Ensure the heap never exceeds K elements to maintain efficiency.

## Template

```python
import heapq
from collections import Counter

def top_k_elements(nums, k, largest=True):
    """
    Returns the top K elements from nums.
    If largest=True, returns the K largest elements.
    If largest=False, returns the K smallest elements.
    """
    if largest:
        # Min-heap for top K largest
        heap = []
        for num in nums:
            heapq.heappush(heap, num)
            if len(heap) > k:
                heapq.heappop(heap)
        return heap
    else:
        # Max-heap for top K smallest (using negative values)
        heap = []
        for num in nums:
            heapq.heappush(heap, -num)
            if len(heap) > k:
                heapq.heappop(heap)
        return [-x for x in heap]

def top_k_frequent(nums, k):
    """
    Returns the K most frequent elements in nums.
    """
    # Count frequencies
    freq = Counter(nums)
    
    # Use min-heap to keep top K frequent
    heap = []
    for num, count in freq.items():
        heapq.heappush(heap, (count, num))
        if len(heap) > k:
            heapq.heappop(heap)
    
    # Extract elements (in arbitrary order)
    return [num for count, num in heap]
```

## Example Problems

1. **Kth Largest Element in an Array**: Find the Kth largest element in an unsorted array. Use a min-heap of size K to track the largest elements.
2. **Top K Frequent Elements**: Given an array, return the K most frequent elements. Use frequency counting with a heap to maintain the top K frequencies.
3. **Find K Closest Points to Origin**: Given points on a plane, find the K closest to the origin. Use a max-heap to keep the closest points based on distance.

## Time and Space Complexity

- **Time Complexity**: O(N log K) for building the heap, where N is the input size and K is the number of elements to select. This is efficient when K << N.
- **Space Complexity**: O(K) for the heap, plus O(N) for frequency counting if needed. The heap size is bounded by K.

## Common Pitfalls

- **Heap Size Management**: Forgetting to remove elements when the heap exceeds K can lead to incorrect results and higher space usage.
- **Negative Values for Max-Heap**: When using Python's heapq (min-heap), negate values for max-heap behavior, but remember to negate back when extracting.
- **Handling Ties**: In frequency-based problems, ensure proper handling of elements with equal frequencies.
- **Edge Cases**: Consider when K equals the input size or when there are fewer than K unique elements.