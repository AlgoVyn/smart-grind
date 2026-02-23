# Sliding Window Maximum

## Category
Heap / Priority Queue

## Description
Find maximum in each sliding window using deque or heap.

---

## Algorithm Explanation
The Sliding Window Maximum problem asks for the maximum value in each sliding window of size k as it moves across an array. The optimal solution uses a monotonic deque to achieve O(n) time complexity.

### Key Concepts:
- **Monotonic Deque**: A deque that maintains elements in decreasing order (front is always the maximum)
- **O(n) Time**: Each element is pushed and popped at most once
- **Window Management**: Remove elements that are out of the current window

### How It Works:
1. Maintain a deque storing indices of elements
2. Keep deque in decreasing order of values (front = maximum)
3. For each new element:
   - Remove indices from back that have smaller values
   - Add current index to back
   - Remove indices from front that are out of window
   - Once we've seen at least k elements, record the maximum (front of deque)

### Why O(n):
Each element enters the deque once and leaves the deque at most once. No element is compared more than twice.

## When to Use
Use this algorithm when you need to solve problems involving:
- heap / priority queue related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Steps
1. Understand the problem constraints and requirements
2. Identify the input and expected output
3. Apply the core algorithm logic
4. Handle edge cases appropriately
5. Optimize for the given constraints

---

## Implementation

```python
from typing import List
from collections import deque

def max_sliding_window(nums: List[int], k: int) -> List[int]:
    """
    Find the maximum element in each sliding window.
    Uses a monotonic deque for O(n) time complexity.
    
    Args:
        nums: Input array
        k: Window size
    
    Returns:
        List of maximum values in each window
    """
    if not nums or k == 0:
        return []
    
    result = []
    dq = deque()  # Stores indices
    
    for i in range(len(nums)):
        # Remove indices that are out of the current window
        while dq and dq[0] < i - k + 1:
            dq.popleft()
        
        # Remove indices with smaller values from back
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        
        # Add current index
        dq.append(i)
        
        # Record maximum once window is full
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result


def max_sliding_window_heap(nums: List[int], k: int) -> List[int]:
    """
    Alternative: using heap. Time: O(n log k)
    """
    import heapq
    
    if not nums or k == 0:
        return []
    
    result = []
    max_heap = []
    
    for i in range(len(nums)):
        # Add current element (negate for max heap)
        heapq.heappush(max_heap, (-nums[i], i))
        
        # Remove elements outside window
        while max_heap and max_heap[0][1] < i - k + 1:
            heapq.heappop(max_heap)
        
        # Record maximum
        if i >= k - 1:
            result.append(-max_heap[0][0])
    
    return result


# Example usage
if __name__ == "__main__":
    nums = [1, 3, -1, -3, 5, 3, 6, 7]
    k = 3
    
    result = max_sliding_window(nums, k)
    print(f"Input: {nums}")
    print(f"Window size: {k}")
    print(f"Maximums: {result}")
    
    # Verify with heap version
    result_heap = max_sliding_window_heap(nums, k)
    print(f"Heap result: {result_heap}")
```

```javascript
function slidingWindowMaximum() {
    // Sliding Window Maximum implementation
    // Time: O(n)
    // Space: O(k)
}
```

---

## Example

**Input:**
```
nums = [1, 3, -1, -3, 5, 3, 6, 7]
k = 3
```

**Output:**
```
Input: [1, 3, -1, -3, 5, 3, 6, 7]
Window size: 3
Maximums: [3, 3, 5, 5, 6, 7]
```

**Explanation:**
- Window [1,3,-1]: max = 3
- Window [3,-1,-3]: max = 3
- Window [-1,-3,5]: max = 5
- Window [-3,5,3]: max = 5
- Window [5,3,6]: max = 6
- Window [3,6,7]: max = 7

---

## Time Complexity
**O(n)**

---

## Space Complexity
**O(k)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
