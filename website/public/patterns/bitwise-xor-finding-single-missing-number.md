# Bitwise XOR - Finding Single/Missing Number

## Overview

The Bitwise XOR pattern for finding a single or missing number leverages the properties of the XOR operation to efficiently identify elements that appear an odd number of times in a collection. This pattern is particularly useful in problems where you need to find a unique element in an array where all other elements appear in pairs (even counts), or to detect missing numbers in a sequence. The XOR operation is associative, commutative, and has the key property that any number XORed with itself results in 0, while XORing with 0 leaves the number unchanged. This makes it ideal for canceling out duplicate values, leaving only the unique or missing element. Benefits include O(n) time complexity and O(1) auxiliary space, making it highly efficient for large datasets without requiring additional data structures.

## Key Concepts

- **XOR Properties**: XOR is a bitwise operation that returns 1 for bits that differ between two operands. Key properties include: A ^ A = 0, A ^ 0 = A, and A ^ B ^ A = B (self-inverse).
- **Cancellation Effect**: When all elements except one appear an even number of times, XORing all elements will cancel out the pairs, leaving the single unique element.
- **Missing Number Detection**: For sequences like 1 to n, XORing the expected range with the given array reveals the missing number due to the cancellation of matching pairs.
- **Extension to Multiple Uniques**: Can be adapted for finding multiple unique elements by using multiple XOR passes or bit manipulation.

## Template

```python
def find_single_or_missing(nums, expected_range=None):
    """
    Template for finding a single unique number or missing number using XOR.
    
    Args:
    nums: List of integers where all elements appear even times except one.
    expected_range: Optional tuple (start, end) for missing number in range.
    
    Returns:
    The single unique number or the missing number.
    """
    result = 0
    
    # XOR all elements in the array
    for num in nums:
        result ^= num
    
    # If finding missing number, XOR with expected range
    if expected_range:
        start, end = expected_range
        for i in range(start, end + 1):
            result ^= i
    
    return result
```

## Example Problems

1. **Single Number**: Given a non-empty array of integers where every element appears twice except for one, find that single one. (LeetCode 136)
2. **Missing Number**: Given an array containing n distinct numbers taken from 0, 1, 2, ..., n, find the one that is missing. (LeetCode 268)
3. **Find the Duplicate and Missing Number**: Given an array of integers where one number is duplicated and one is missing, find both using XOR properties. (LeetCode 645)

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the number of elements, as we perform a single pass through the array with constant-time XOR operations.
- **Space Complexity**: O(1), utilizing only a few variables regardless of input size, making it memory-efficient.

## Common Pitfalls

- **Incorrect Assumptions on Frequency**: Ensure that all elements except the target appear an even number of times; if frequencies vary unpredictably, additional logic may be needed.
- **Edge Cases**: Handle empty arrays, arrays with one element, or cases where the unique element is 0 (since 0 ^ 0 = 0, but 0 is the identity).
- **Integer Overflow**: In languages with fixed integer sizes, be cautious with very large numbers, though Python handles arbitrary precision.
- **Range Specification**: When finding missing numbers, accurately define the expected range to avoid incorrect results from extraneous XOR operations.