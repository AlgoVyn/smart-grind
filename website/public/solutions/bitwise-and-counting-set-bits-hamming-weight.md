# Bitwise AND - Counting Set Bits (Hamming Weight)

## Overview

The Bitwise AND pattern for counting set bits, also known as Hamming weight, involves using bitwise AND operations to determine the number of 1s in the binary representation of a number. This pattern is essential for problems requiring bit analysis, such as calculating population counts or evaluating binary properties. By repeatedly ANDing the number with 1 to check the least significant bit and shifting right, or using optimized techniques, this approach efficiently counts set bits. It's particularly useful in scenarios involving hardware-related computations, error detection, or optimization problems where bit manipulation is key. Benefits include simplicity, constant space usage, and direct applicability to individual numbers or arrays.

## Key Concepts

- **Bit Masking**: Using AND with 1 (0b1) isolates the least significant bit, allowing incremental checking.
- **Right Shift**: Shifting the number right by 1 moves to the next bit for examination.
- **Hamming Weight**: The total count of bits set to 1 in a binary number.
- **Loop Termination**: The process continues until the number becomes 0, ensuring all bits are checked.

## Template

```python
def hamming_weight(n):
    """
    Template for counting the number of set bits (1s) in the binary representation of n.
    
    Args:
    n: Integer to count set bits in.
    
    Returns:
    Integer representing the count of set bits.
    """
    count = 0
    while n:
        # Check if the least significant bit is set
        count += n & 1
        # Shift right to check the next bit
        n >>= 1
    return count

# Alternative optimized version using n & (n-1) to clear the lowest set bit
def hamming_weight_optimized(n):
    count = 0
    while n:
        n &= n - 1  # Clear the lowest set bit
        count += 1
    return count
```

## Example Problems

1. **Number of 1 Bits**: Write a function that takes an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight). (LeetCode 191)
2. **Counting Bits**: Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1's in the binary representation of i. (LeetCode 338) - Note: This can use DP optimization.
3. **Total Hamming Distance**: The Hamming distance between two integers is the number of positions at which the corresponding bits are different. Calculate the total Hamming distance for all pairs in an array. (LeetCode 477)

## Time and Space Complexity

- **Time Complexity**: O(log n) for a single number, as the loop runs for the number of bits (up to 32 for 32-bit integers). For an array of numbers, O(n log n) where n is the array size.
- **Space Complexity**: O(1) auxiliary space, excluding the input and output arrays.

## Common Pitfalls

- **Negative Numbers**: In languages like Python, integers are arbitrary precision, but in fixed-width languages, handle signed integers carefully as two's complement can affect bit representation.
- **Zero Input**: Ensure the function returns 0 for n = 0, as the loop won't execute.
- **Performance for Large Arrays**: For problems like Counting Bits, consider DP to achieve O(n) time instead of O(n log n).
- **Bit Width Assumptions**: Avoid assuming 32-bit integers; use language-specific methods if available for better performance.