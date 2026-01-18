# Bitwise DP - Counting Bits Optimization

## Overview

The Bitwise DP pattern for counting bits optimization uses dynamic programming to efficiently compute the number of set bits (Hamming weight) for all integers from 0 to n. This approach leverages the relationship between binary representations of consecutive numbers, avoiding redundant calculations by building on previously computed results. It's ideal for problems requiring bit counts across a range, such as generating arrays of bit counts. By using recurrence relations based on bit shifting and parity, it achieves linear time complexity. Benefits include scalability for large n and reduced computational overhead compared to naive bit-by-bit counting for each number.

## Key Concepts

- **DP Recurrence**: For an even number i, the bit count is the same as i//2 (right shift). For odd i, it's (i//2) + 1.
- **Bit Manipulation Insight**: i & 1 checks parity; i >> 1 performs integer division by 2.
- **Base Case**: dp[0] = 0, as 0 has no set bits.
- **Iterative Building**: Compute dp[i] using dp[i-1] or dp[i>>1] to ensure O(1) work per element.

## Template

```python
def count_bits(n):
    """
    Template for counting the number of set bits for each number from 0 to n using DP.
    
    Args:
    n: Integer up to which to compute bit counts.
    
    Returns:
    List of integers where ans[i] is the number of 1's in binary representation of i.
    """
    dp = [0] * (n + 1)
    
    for i in range(1, n + 1):
        # dp[i] = dp[i >> 1] + (i & 1)
        # i >> 1 is i // 2, i & 1 is 1 if i is odd, 0 if even
        dp[i] = dp[i >> 1] + (i & 1)
    
    return dp
```

## Example Problems

1. **Counting Bits**: Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1's in the binary representation of i. (LeetCode 338)
2. **Number of 1 Bits in Range**: Compute the sum of Hamming weights for numbers in a range using precomputed DP.
3. **Binary Watch**: Given a non-negative integer n which represents the number of LEDs that are currently on, return all possible times the watch could represent. (LeetCode 401) - Uses bit counting concepts.

## Time and Space Complexity

- **Time Complexity**: O(n), as we iterate through each number from 1 to n with constant-time operations.
- **Space Complexity**: O(n), for storing the DP array of size n+1.

## Common Pitfalls

- **Off-by-One Errors**: Ensure the DP array is sized n+1 and indices start from 0.
- **Edge Cases**: Handle n=0 correctly, returning [0].
- **Large n**: For very large n, consider space constraints, though O(n) is optimal for this problem.
- **Misunderstanding Recurrence**: Confuse i>>1 with i//2 in languages where division behaves differently for negatives (though n is non-negative here).