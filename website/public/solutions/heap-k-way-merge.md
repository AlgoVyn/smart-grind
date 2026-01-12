# Heap - K-way Merge

## Overview

The Heap - K-way Merge pattern is used to merge multiple sorted lists or streams into a single sorted list efficiently. It employs a priority queue to always select the smallest (or largest) element from the current heads of the lists. This pattern is essential for handling large datasets that don't fit in memory or when merging results from parallel processes. The benefits include O(N log K) time complexity, where N is the total number of elements and K is the number of lists, making it scalable for many sources.

## Key Concepts

- **Priority Queue**: Maintains the smallest element from each list's current position.
- **List Pointers**: Each list has a pointer to track the current element being considered.
- **Heap Element**: Stores the value and the list index to know which list to advance.
- **Termination**: Continue until all elements from all lists are processed.

## Template

```python
import heapq

def merge_k_lists(lists):
    """
    Merge K sorted lists into one sorted list.
    lists: List of sorted lists
    """
    # Min-heap to store (value, list_index, element_index)
    heap = []
    
    # Initialize heap with first element from each list
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst[0], i, 0))
    
    result = []
    while heap:
        val, list_idx, elem_idx = heapq.heappop(heap)
        result.append(val)
        
        # If there's a next element in this list, push it to heap
        if elem_idx + 1 < len(lists[list_idx]):
            next_val = lists[list_idx][elem_idx + 1]
            heapq.heappush(heap, (next_val, list_idx, elem_idx + 1))
    
    return result

# Example usage for merging sorted arrays
def merge_k_sorted_arrays(arrays):
    return merge_k_lists(arrays)
```

## Example Problems

1. **Merge K Sorted Lists**: Given K sorted linked lists, merge them into one sorted linked list.
2. **Kth Smallest Element in Sorted Matrix**: Treat the matrix as K sorted arrays and find the Kth smallest element.
3. **Merge Intervals**: Although not directly K-way, similar heap-based merging for overlapping intervals.

## Time and Space Complexity

- **Time Complexity**: O(N log K), where N is the total number of elements across all lists, and K is the number of lists. Each heap operation is O(log K).
- **Space Complexity**: O(K) for the heap, plus O(N) for the result. The heap size is bounded by K.

## Common Pitfalls

- **Empty Lists**: Handle cases where some lists are empty or all lists are empty.
- **Heap Tuple Ordering**: Ensure the tuple in the heap compares correctly; Python compares tuples lexicographically.
- **Index Management**: Keep track of list and element indices accurately to avoid off-by-one errors.
- **Large K**: When K is large, consider if a different approach like divide and conquer might be better.