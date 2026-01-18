# Array - Product Except Self (Prefix/Suffix Products)

## Overview

The Array - Product Except Self pattern is used to calculate the product of all elements in an array except the element at the current index, without using division. This is done efficiently using prefix and suffix product arrays or optimized in-place approaches.

## Key Concepts

- **Prefix Products**: Products of elements from the start up to but not including the current index.
- **Suffix Products**: Products of elements from the end up to but not including the current index.
- **In-place Optimization**: Calculate products using a single output array, first for prefix products then multiplying with suffix products.

## Template

```python
def productExceptSelf(nums):
    n = len(nums)
    output = [1] * n
    
    # Calculate prefix products
    prefix = 1
    for i in range(n):
        output[i] = prefix
        prefix *= nums[i]
    
    # Calculate suffix products and multiply with prefix
    suffix = 1
    for i in range(n-1, -1, -1):
        output[i] *= suffix
        suffix *= nums[i]
    
    return output
```

## Example Problems

1. **Product of Array Except Self (LeetCode 238)**: Calculate product of array except self without division.
2. **Product Except Self II**: Handle cases with zero elements or other constraints.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the number of elements (two passes through the array).
- **Space Complexity**: O(1) if we don't count the output array, O(n) otherwise.

## Common Pitfalls

- **Using division**: Can lead to errors when there are zero elements in the array.
- **Incorrect initialization of prefix/suffix variables**: Starting with incorrect values can break the product chain.
- **Off-by-one errors**: Incorrect loop ranges can exclude or include the current element.
- **Not handling edge cases**: Empty arrays or single-element arrays need special handling.
