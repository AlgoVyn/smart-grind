# Kadane's Algorithm

## Category
Arrays & Strings

## Description
Kadane's Algorithm finds the maximum sum of a contiguous subarray (also known as the Maximum Subarray Problem) in O(n) time. This is a classic dynamic programming problem with an elegant greedy optimization.

The key insight is that at each position, we decide whether to:
1. **Extend the current subarray**: Add the current element to our existing maximum ending here
2. **Start a new subarray**: Begin fresh from the current element

The algorithm maintains the maximum sum ending at each position and tracks the global maximum. If the current element alone is greater than the sum of the previous subarray, it's better to start fresh.

This works because any subarray with a negative sum would decrease the total - we might as well exclude it and start fresh from a positive or less negative value.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- arrays & strings related operations
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
def max_subarray(nums: list[int]) -> tuple:
    """
    Find the contiguous subarray with the largest sum.
    
    Args:
        nums: List of integers (can include negative numbers)
        
    Returns:
        Tuple of (max_sum, start_index, end_index)
        
    Time: O(n)
    Space: O(1)
    """
    if not nums:
        return 0, -1, -1
    
    # Initialize variables
    max_current = max_global = nums[0]
    start = end = 0
    temp_start = 0
    
    for i in range(1, len(nums)):
        # Either extend previous subarray or start new one
        if nums[i] > max_current + nums[i]:
            max_current = nums[i]
            temp_start = i
        else:
            max_current = max_current + nums[i]
        
        # Update global maximum if current is better
        if max_current > max_global:
            max_global = max_current
            start = temp_start
            end = i
    
    return max_global, start, end


def max_subarray_kadane(nums: list[int]) -> int:
    """
    Simpler version that returns only the maximum sum.
    
    Args:
        nums: List of integers
        
    Returns:
        Maximum sum of contiguous subarray
        
    Time: O(n)
    Space: O(1)
    """
    if not nums:
        return 0
    
    max_current = max_global = nums[0]
    
    for i in range(1, len(nums)):
        max_current = max(nums[i], max_current + nums[i])
        max_global = max(max_global, max_current)
    
    return max_global


# Example usage
if __name__ == "__main__":
    # Test case 1
    nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
    max_sum, start, end = max_subarray(nums)
    print(f"Array: {nums}")
    print(f"Maximum subarray sum: {max_sum}")
    print(f"Subarray: {nums[start:end+1]}")  # Output: [4, -1, 2, 1]
    
    # Test case 2
    nums = [1]
    print(f"\nArray: {nums}")
    print(f"Maximum subarray sum: {max_subarray_kadane(nums)}")  # Output: 1
    
    # Test case 3 - all negative
    nums = [-1, -2, -3, -4]
    print(f"\nArray: {nums}")
    print(f"Maximum subarray sum: {max_subarray_kadane(nums)}")  # Output: -1
    
    # Test case 4
    nums = [5, 4, -1, 7, 8]
    print(f"\nArray: {nums}")
    print(f"Maximum subarray sum: {max_subarray_kadane(nums)}")  # Output: 23
```

```javascript
function kadanesAlgorithm() {
    // Kadane's Algorithm implementation
    // Time: O(n)
    // Space: O(1)
}
```

---

## Example

**Input:**
```
nums = [-2, 1, -3, 4, -1, 2, 1, -5, 4]
```

**Output:**
```
Maximum subarray sum: 6
Subarray: [4, -1, 2, 1]
Indices: 3 to 6
```

**Input:**
```
nums = [5, 4, -1, 7, 8]
```

**Output:**
```
Maximum subarray sum: 23
Subarray: [5, 4, -1, 7, 8] (entire array)
```

---

## Time Complexity
**O(n)**

---

## Space Complexity
**O(1)**

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
