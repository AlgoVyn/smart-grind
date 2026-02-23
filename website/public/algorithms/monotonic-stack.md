# Monotonic Stack

## Category
Arrays & Strings

## Description
Use a stack that maintains elements in monotonic order for efficient next greater/smaller element queries.

---

## Algorithm Explanation
A Monotonic Stack is a stack data structure that maintains elements in either increasing or decreasing order. It's commonly used to find the next greater or next smaller element for each element in an array in O(n) time.

### Key Concepts:
- **Monotonic Decreasing Stack**: Stack where elements are in decreasing order (top is smallest). Used for "next greater element"
- **Monotonic Increasing Stack**: Stack where elements are in increasing order (top is largest). Used for "next smaller element"
- **O(n) Time**: Each element is pushed and popped at most once

### How It Works:
1. Iterate through the array
2. For each element, pop from stack while top is smaller/greater than current element
3. The current element is the next greater/smaller for the popped elements
4. Push current element onto stack

### Common Applications:
- Next Greater Element
- Next Smaller Element
- Largest Rectangle in Histogram
- Daily Temperatures

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
from typing import List

def next_greater(nums: List[int]) -> List[int]:
    """
    Find the next greater element for each element in the array.
    Uses a monotonic decreasing stack.
    
    Args:
        nums: Input array
    
    Returns:
        Array where result[i] is the next greater element to the right of nums[i],
        or -1 if no greater element exists
    """
    n = len(nums)
    result = [-1] * n
    stack = []  # stores indices
    
    for i in range(n):
        # Pop elements smaller than current
        while stack and nums[stack[-1]] < nums[i]:
            result[stack.pop()] = nums[i]
        stack.append(i)
    
    return result


def next_smaller(nums: List[int]) -> List[int]:
    """
    Find the next smaller element for each element in the array.
    Uses a monotonic increasing stack.
    """
    n = len(nums)
    result = [-1] * n
    stack = []
    
    for i in range(n):
        while stack and nums[stack[-1]] > nums[i]:
            result[stack.pop()] = nums[i]
        stack.append(i)
    
    return result


def next_greater_circular(nums: List[int]) -> List[int]:
    """
    Find the next greater element in a circular array.
    """
    n = len(nums)
    result = [-1] * n
    stack = []
    
    for i in range(2 * n):
        while stack and nums[stack[-1]] < nums[i % n]:
            result[stack.pop()] = nums[i % n]
            if len(stack) == 0:
                break
        stack.append(i % n)
        if i >= n - 1 and len(stack) == 0:
            break
    
    return result


# Example usage
if __name__ == "__main__":
    nums = [2, 1, 2, 4, 3]
    
    result = next_greater(nums)
    print(f"Input: {nums}")
    print(f"Next greater elements: {result}")
    # Output: [2, 2, 4, -1, -1]
    
    result_smaller = next_smaller(nums)
    print(f"Next smaller elements: {result_smaller}")
    # Output: [-1, -1, -1, 3, -1]
    
    # Circular example
    nums2 = [1, 2, 3, 4]
    result_circular = next_greater_circular(nums2)
    print(f"\nCircular input: {nums2}")
    print(f"Next greater (circular): {result_circular}")
    # Output: [2, 3, 4, 1]
```

```javascript
function monotonicStack() {
    // Monotonic Stack implementation
    // Time: O(n)
    // Space: O(n)
}
```

---

## Example

**Input:**
```
nums = [2, 1, 2, 4, 3]
```

**Output:**
```
Input: [2, 1, 2, 4, 3]
Next greater elements: [2, 2, 4, -1, -1]
```

**Explanation:**
- For nums[0]=2: next greater is 2 (at index 2)
- For nums[1]=1: next greater is 2 (at index 2)
- For nums[2]=2: next greater is 4 (at index 3)
- For nums[3]=4: no greater element exists = -1
- For nums[4]=3: no greater element exists = -1

**Circular Example:**
```
nums = [1, 2, 3, 4]
```

**Output:**
```
Next greater (circular): [2, 3, 4, 1]
```

---

## Time Complexity
**O(n)**

---

## Space Complexity
**O(n)**

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
