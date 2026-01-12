# Bitwise Operations - Power of Two/Four Check

## Overview

The Bitwise Operations pattern for checking if a number is a power of two or four uses efficient bit manipulation to determine if a given integer has exactly one set bit (for powers of two) or meets additional criteria (for powers of four). This pattern is crucial for problems involving binary properties, such as optimizing divisions or detecting specific numerical patterns. By leveraging the fact that powers of two have a single 1 in their binary representation, and powers of four are powers of two with the bit in an even position, this approach provides constant-time checks. Benefits include speed, simplicity, and avoidance of loops or logarithms, making it ideal for performance-critical code.

## Key Concepts

- **Power of Two Check**: A number n is a power of 2 if n > 0 and n & (n-1) == 0, as this clears the lowest set bit, leaving 0 only for powers of 2.
- **Power of Four Check**: Additionally, for powers of 4, the single set bit must be in an even position (0-indexed from LSB). This can be checked by ensuring n & 0xAAAAAAAA == 0 (masks odd positions).
- **Bit Isolation**: n & (n-1) isolates and removes the lowest set bit.
- **Edge Cases**: Handle n <= 0, as negative numbers and zero are not powers of 2 or 4.

## Template

```python
def is_power_of_two(n):
    """
    Template for checking if n is a power of 2 using bitwise operations.
    
    Args:
    n: Integer to check.
    
    Returns:
    Boolean indicating if n is a power of 2.
    """
    return n > 0 and (n & (n - 1)) == 0

def is_power_of_four(n):
    """
    Template for checking if n is a power of 4 using bitwise operations.
    
    Args:
    n: Integer to check.
    
    Returns:
    Boolean indicating if n is a power of 4.
    """
    # First check if power of 2, then check if bit is in even position
    return n > 0 and (n & (n - 1)) == 0 and (n & 0xAAAAAAAA) == 0
```

## Example Problems

1. **Power of Two**: Given an integer n, return true if it is a power of two. Otherwise, return false. (LeetCode 231)
2. **Power of Four**: Given an integer n, return true if it is a power of four. Otherwise, return false. (LeetCode 342)
3. **Bitwise AND of Numbers Range**: Given a range [m, n], find the bitwise AND of all numbers in this range. (LeetCode 201) - Uses power of 2 concepts for optimization.

## Time and Space Complexity

- **Time Complexity**: O(1), as all operations are constant-time bitwise checks.
- **Space Complexity**: O(1), using only a few variables.

## Common Pitfalls

- **Zero and Negative Inputs**: Ensure n > 0, as 0 and negatives fail the check but may cause issues in some implementations.
- **Integer Overflow**: In fixed-width integers, very large n might wrap, but Python handles this.
- **Misunderstanding Masks**: For power of 4, ensure the mask 0xAAAAAAAA correctly targets odd bit positions (1,3,5,...).
- **Alternative Methods**: Avoid using loops or math.log, as bitwise is more efficient and direct.