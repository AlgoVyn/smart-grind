# Sliding Window

## Category
Arrays & Strings

## Description
Maintain a window of elements that slides through the array for efficient computation of subarray problems.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- arrays & strings related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Explanation

The Sliding Window technique is used to perform operations on a specific window size of an array or string. It's particularly efficient for problems requiring O(n) time complexity instead of O(n*k) for nested loops.

### Types of Sliding Windows:

1. **Fixed Window Size**: Window of size k slides through the array
2. **Variable Window Size**: Window size expands/shrinks based on conditions

### Key Concepts:
- Maintain a "window" that slides through the data
- Add new elements to the window as it moves right
- Remove elements that are no longer in the window
- Process the current window

### Common Applications:
- Maximum/minimum sum of k consecutive elements
- Longest substring with k distinct characters
- String anagrams
- Longest subarray with conditions

---

## Algorithm Steps (Fixed Window)

### For Maximum Sliding Window:
1. Initialize a deque (monotonic decreasing) to store indices
2. Iterate through the array:
   a. Remove indices outside the current window from deque front
   b. Remove indices with smaller values than current element (they can't be max)
   c. Add current index to deque
   d. Once we have processed k elements, the front of deque is the max

### For Sum Problems:
1. Calculate sum of first k elements
2. Slide window by removing leftmost and adding next element
3. Track maximum/minimum sum

---

## Implementation

```python
from collections import deque

def max_sliding_window(nums: list, k: int) -> list:
    """
    Find the maximum value in each sliding window of size k.
    
    Args:
        nums: Input array
        k: Window size
        
    Returns:
        List of maximum values for each window
        
    Time: O(n)
    Space: O(k)
    """
    if not nums or k == 0:
        return []
    
    if k == 1:
        return nums[:]
    
    # Deque stores indices, maintains decreasing order of values
    deque = []
    result = []
    
    for i, num in enumerate(nums):
        # Remove indices that are out of the current window
        while deque and deque[0] < i - k + 1:
            deque.pop(0)
        
        # Remove indices whose values are less than current
        # They can never be the maximum in any window containing current
        while deque and nums[deque[-1]] < num:
            deque.pop()
        
        # Add current index
        deque.append(i)
        
        # Once we have processed at least k elements, record the max
        if i >= k - 1:
            result.append(nums[deque[0]])
    
    return result


def min_sliding_window(nums: list, k: int) -> list:
    """
    Find the minimum value in each sliding window of size k.
    
    Time: O(n)
    Space: O(k)
    """
    if not nums or k == 0:
        return []
    
    if k == 1:
        return nums[:]
    
    deque = []
    result = []
    
    for i, num in enumerate(nums):
        # Remove indices outside current window
        while deque and deque[0] < i - k + 1:
            deque.pop(0)
        
        # Remove indices with values greater than current
        while deque and nums[deque[-1]] > num:
            deque.pop()
        
        deque.append(i)
        
        if i >= k - 1:
            result.append(nums[deque[0]])
    
    return result


def max_sum_subarray(nums: list, k: int) -> int:
    """
    Find maximum sum of any contiguous subarray of size k.
    
    Time: O(n)
    Space: O(1)
    """
    if not nums or len(nums) < k:
        return 0
    
    # Calculate sum of first window
    window_sum = sum(nums[:k])
    max_sum = window_sum
    
    # Slide the window
    for i in range(k, len(nums)):
        window_sum = window_sum - nums[i - k] + nums[i]
        max_sum = max(max_sum, window_sum)
    
    return max_sum


# Example usage
if __name__ == "__main__":
    nums = [1, 3, -1, -3, 5, 3, 6, 7]
    k = 3
    
    print(f"Array: {nums}")
    print(f"Window size: {k}")
    print(f"Max sliding window: {max_sliding_window(nums, k)}")
    print(f"Min sliding window: {min_sliding_window(nums, k)}")
    print(f"Max sum subarray of size {k}: {max_sum_subarray(nums, k)}")

```javascript
function slidingWindow() {
    // Sliding Window implementation
    // Time: O(n)
    // Space: O(k) where k is window size
}
```

---

## Example

**Input:**
```python
nums = [1, 3, -1, -3, 5, 3, 6, 7]
k = 3
```

**Output:**
```
Array: [1, 3, -1, -3, 5, 3, 6, 7]
Window size: 3
Max sliding window: [3, 3, 5, 5, 6, 7]
Min sliding window: [-1, -3, -3, -3, 3, 3]
Max sum subarray of size 3: 16
```

**Step-by-step for maximum:**
| Window | Elements | Max |
|--------|----------|-----|
| [0,2] | [1, 3, -1] | 3 |
| [1,3] | [3, -1, -3] | 3 |
| [2,4] | [-1, -3, 5] | 5 |
| [3,5] | [-3, 5, 3] | 5 |
| [4,6] | [5, 3, 6] | 6 |
| [5,7] | [3, 6, 7] | 7 |

**Explanation:**
- We maintain a monotonic decreasing deque
- For each new element, we remove smaller elements from the back (they can never be max)
- We remove elements from front that are outside the window
- The front of the deque always contains the index of the maximum element in current window

---

## Time Complexity
**O(n)**

---

## Space Complexity
**O(k) where k is window size**

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
