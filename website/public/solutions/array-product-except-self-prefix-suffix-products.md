# Array - Product Except Self (Prefix/Suffix Products)

## Overview

This pattern computes the product of all elements in an array except the one at each index, without using division and in linear time. It's ideal for problems requiring cumulative products while avoiding division by zero issues. By using prefix and suffix products, the solution achieves O(n) time and O(1) extra space (excluding output), making it efficient for large arrays.

## Key Concepts

The approach uses two passes:
1. **Prefix Products**: Compute the running product of elements from the left up to each index.
2. **Suffix Products**: Compute the running product from the right, multiplying with the prefix products.
This ensures each position gets the product of all other elements without recalculating from scratch.

## Template

```python
def product_except_self(nums):
    """
    Returns an array where each element is the product of all elements
    except itself.
    """
    n = len(nums)
    result = [1] * n
    
    # First pass: compute prefix products
    prefix = 1
    for i in range(n):
        result[i] = prefix
        prefix *= nums[i]
    
    # Second pass: compute suffix products and multiply
    suffix = 1
    for i in range(n - 1, -1, -1):
        result[i] *= suffix
        suffix *= nums[i]
    
    return result

# Example usage:
# nums = [1,2,3,4]
# print(product_except_self(nums))  # Output: [24,12,8,6]
```

## Example Problems

1. **Product of Array Except Self (LeetCode 238)**: Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].
2. **Product Except Self with Constraints**: Variants where the array contains zeros, requiring careful handling of product calculations.
3. **Cumulative Product Queries**: Problems involving range product queries using similar prefix/suffix techniques.

## Time and Space Complexity

- **Time Complexity**: O(n), with two linear passes through the array.
- **Space Complexity**: O(1) extra space (besides the output array), as only a few variables are used.

## Common Pitfalls

- **Zero Handling**: If there are multiple zeros, the product for all indices will be zero; ensure the logic accounts for this without division.
- **Overflow**: In languages without big integers, products may overflow; consider using 64-bit integers or modular arithmetic if needed.
- **Empty Array**: Handle edge cases like empty arrays by returning an empty result.
- **Single Element**: For arrays with one element, the result should be [1] or handle appropriately.