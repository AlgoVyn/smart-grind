# Power Of Two

## Problem Description

Given an integer `n`, return `true` if it is a power of two. Otherwise, return `false`.

An integer `n` is a power of two if and only if there exists an integer `x` such that `n == 2^x`.

### What is a Power of Two?

A power of two is a number that can be expressed as 2 raised to some integer exponent. For example:
- 2^0 = 1
- 2^1 = 2
- 2^2 = 4
- 2^3 = 8
- 2^4 = 16
- 2^5 = 32
- 2^6 = 64
- ...

In binary representation, powers of two have exactly one bit set to '1' followed by all '0's:
- 1 (2^0) = 0b0001
- 2 (2^1) = 0b0010
- 4 (2^2) = 0b0100
- 8 (2^3) = 0b1000
- 16 (2^4) = 0b10000

---

## Examples

**Example 1:**

**Input:** `n = 1`  
**Output:** `true`

**Explanation:** 2^0 = 1

**Example 2:**

**Input:** `n = 16`  
**Output:** `true`

**Explanation:** 2^4 = 16

**Example 3:**

**Input:** `n = 3`  
**Output:** `false`

**Explanation:** 3 is not a power of two (binary: 0b11 has two set bits)

**Example 4:**

**Input:** `n = 0`  
**Output:** `false`

**Explanation:** 0 is not a power of two

**Example 5:**

**Input:** `n = -2`  
**Output:** `false`

**Explanation:** Negative numbers cannot be powers of two

---

## Constraints

- `-2^31 <= n <= 2^31 - 1`
- The integer is 32-bit signed

---

## Follow up

Could you solve it without loops/recursion?

---

## Intuition

The key insight is that powers of two have exactly one bit set in their binary representation. This unique property allows us to use bitwise operations for an efficient O(1) solution.

For any number `n`:
- If `n` is a power of two, its binary form has exactly one '1' bit
- For example: 8 = 0b1000 (only the 4th bit from right is set)

The trick `n & (n-1)` clears the lowest set bit:
- For power of two: n = 0b1000, n-1 = 0b0111, n & (n-1) = 0b0000 = 0
- For non-power of two: n = 0b1010, n-1 = 0b1001, n & (n-1) = 0b1000 ≠ 0

Thus, `n` is a power of two if and only if `n > 0` AND `n & (n-1) == 0`.

---

## Multiple Approaches

### Approach 1: Bit Manipulation (Recommended)

**Algorithm:**
1. Check if n is greater than 0 (negative numbers and zero cannot be powers of two)
2. Check if n & (n-1) equals 0 (this means only one bit is set)

**Python Code:**
```python
class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        return n > 0 and (n & (n - 1)) == 0
```

**Time Complexity:** O(1)  
**Space Complexity:** O(1)

---

### Approach 2: Built-in bit_count() (Python 3.8+)

**Algorithm:**
1. Check if n is greater than 0
2. Check if the number of set bits is exactly 1

**Python Code:**
```python
class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        return n > 0 and n.bit_count() == 1
```

**Time Complexity:** O(1)  
**Space Complexity:** O(1)

---

### Approach 3: Logarithmic Method

**Algorithm:**
1. Check if n is greater than 0
2. Calculate log2(n) and check if it's an integer (i.e., fractional part is 0)

**Python Code:**
```python
import math

class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        if n <= 0:
            return False
        return math.log2(n).is_integer()
```

**Time Complexity:** O(1)  
**Space Complexity:** O(1)

**Note:** This approach may have floating-point precision issues for very large numbers.

---

### Approach 4: Loop Division

**Algorithm:**
1. Keep dividing n by 2 until it becomes 1
2. If we reach exactly 1, it's a power of two
3. If at any point n becomes 0 or we get a non-integer result, it's not

**Python Code:**
```python
class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        if n <= 0:
            return False
        while n % 2 == 0:
            n //= 2
        return n == 1
```

**Time Complexity:** O(log n) - Number of divisions equals the exponent  
**Space Complexity:** O(1)

---

### Approach 5: Recursion

**Algorithm:**
1. Base case: if n == 1, return True
2. If n is even, recursively check n/2
3. Otherwise, return False

**Python Code:**
```python
class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        if n == 1:
            return True
        if n <= 0 or n % 2 != 0:
            return False
        return self.isPowerOfTwo(n // 2)
```

**Time Complexity:** O(log n)  
**Space Complexity:** O(log n) - Due to recursion stack

---

### Approach 6: No Loop/Recursion (Magic Number Trick)

**Algorithm:**
1. Use the fact that for 32-bit integers, 2^30 is the largest power of 2
2. If n is positive and n & 2^30 equals n, then n is a power of 2

**Python Code:**
```python
class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        return n > 0 and (n & (1 << 30)) == n
```

**Time Complexity:** O(1)  
**Space Complexity:** O(1)

**Note:** This works for 32-bit integers. For 64-bit, use 1 << 62.

---

## Comparison of Approaches

| Approach | Time Complexity | Space Complexity | Pros | Cons |
|----------|-----------------|------------------|------|------|
| Bit Manipulation | O(1) | O(1) | Most efficient, no loops | Requires understanding of bitwise ops |
| Built-in bit_count() | O(1) | O(1) | Clean, readable code | Python 3.8+ only |
| Logarithmic | O(1) | O(1) | Simple concept | Floating-point precision issues |
| Loop Division | O(log n) | O(1) | Easy to understand | Slower for large numbers |
| Recursion | O(log n) | O(log n) | Elegant recursive solution | Stack overflow risk for large n |
| Magic Number | O(1) | O(1) | No arithmetic operations | 32-bit specific |

---

## Explanation of the Recommended Approach (Bit Manipulation)

### Step-by-Step Breakdown:

1. **Check n > 0:**
   - 0 cannot be a power of two (2^x is never 0)
   - Negative numbers cannot be powers of two
   - This is a crucial edge case check

2. **Check n & (n-1) == 0:**
   - For a power of two (e.g., n = 8 = 0b1000):
     - n-1 = 7 = 0b0111
     - n & (n-1) = 0b1000 & 0b0111 = 0b0000 = 0 ✓
   
   - For a non-power of two (e.g., n = 6 = 0b0110):
     - n-1 = 5 = 0b0101
     - n & (n-1) = 0b0110 & 0b0101 = 0b0100 ≠ 0 ✗

### Why This Works:

Powers of two in binary have exactly one '1' bit followed by all '0's. When you subtract 1 from such a number:
- The single '1' bit becomes '0'
- All the '0's to its right become '1's

For example: 1000 - 1 = 0111

When you AND these two numbers, there's no overlap in their '1' bits, resulting in 0. Any number with more than one '1' bit will have some overlap after subtracting 1, resulting in a non-zero value.

---

## Complexity Analysis

### Time Complexity: O(1)

All operations (comparison, subtraction, AND) are constant-time operations regardless of the input value.

### Space Complexity: O(1)

No additional data structures or variables are used beyond a few primitive types.

---

## Related Problems

1. **[Power of Four (LeetCode 342)](https://leetcode.com/problems/power-of-four/)**
   - Check if a number is a power of 4
   - Extends the power of two concept by checking the position of the single set bit

2. **[Power of Three (LeetCode 326)](https://leetcode.com/problems/power-of-three/)**
   - Check if a number is a power of 3
   - Can use logarithmic or loop-based approaches

3. **[Bitwise AND of Numbers Range (LeetCode 201)](https://leetcode.com/problems/bitwise-and-of-numbers-range/)**
   - Find bitwise AND of all numbers in range [m, n]
   - Uses power of two concept to find common prefix

4. **[Number of 1 Bits (LeetCode 191)](https://leetcode.com/problems/number-of-1-bits/)**
   - Count the number of '1' bits in binary representation
   - Related to detecting powers of two

5. **[Reverse Bits (LeetCode 190)](https://leetcode.com/problems/reverse-bits/)**
   - Reverse bits of a 32-bit integer
   - Uses bitwise operations extensively

---

## Video Tutorial Links

1. **[Power of Two - NeetCode](https://www.youtube.com/watch?v=6E818oVIW64)** - Clear explanation with multiple approaches

2. **[Bit Manipulation Tricks - Power of Two](https://www.youtube.com/watch?v=v-15MvM6a4c)** - In-depth bit manipulation tutorial

3. **[LeetCode 231 Solution - Tech Lead](https://www.youtube.com/watch?v=11jMtYPQMEA)** - Detailed walkthrough of the solution

4. **[Bitwise AND Trick Explained](https://www.youtube.com/watch?v=HsDEkZHrdKg)** - Visual explanation of n & (n-1) trick

---

## Followup Questions

### 1. How would you check if a number is a power of 4?

A number is a power of 4 if:
1. It is a power of 2 (one set bit)
2. The set bit is in an even position (0-indexed from LSB)

```python
class Solution:
    def isPowerOfFour(self, n: int) -> bool:
        return n > 0 and (n & (n - 1)) == 0 and (n & 0xAAAAAAAA) == 0
```

The mask `0xAAAAAAAA` has '1's in all odd bit positions, so this check ensures the single '1' bit is in an even position.

---

### 2. How do you find the next power of 2 greater than or equal to n?

```python
def next_power_of_2(n: int) -> int:
    if n <= 0:
        return 1
    if n & (n - 1) == 0:
        return n
    # Set all bits to the right of the highest set bit
    n |= n >> 1
    n |= n >> 2
    n |= n >> 4
    n |= n >> 8
    n |= n >> 16
    return n + 1
```

---

### 3. How do you count the number of set bits (Hamming weight)?

```python
class Solution:
    def hammingWeight(self, n: int) -> int:
        count = 0
        while n:
            count += n & 1
            n >>= 1
        return count

# Brian Kernighan's Algorithm (more efficient)
class Solution:
    def hammingWeight(self, n: int) -> int:
        count = 0
        while n:
            n = n & (n - 1)
            count += 1
        return count
```

---

### 4. What's the difference between checking powers of two using bit_count() vs (n & (n-1))?

Both methods are O(1) in Python, but they have different characteristics:

- `n & (n-1) == 0`:
  - Works in all Python versions
  - Uses bitwise operations
  - Very efficient (2-3 operations)

- `n.bit_count() == 1`:
  - Requires Python 3.8+
  - More readable and explicit
  - Slightly more overhead but negligible

---

### 5. How would you handle edge cases in production code?

```python
def is_power_of_two(n: int) -> bool:
    """
    Check if n is a power of two.
    
    Args:
        n: Integer to check
        
    Returns:
        True if n is a power of two, False otherwise
        
    Raises:
        TypeError: If n is not an integer
    """
    if not isinstance(n, int):
        raise TypeError("Input must be an integer")
    
    # Handle Python's arbitrary precision integers
    # The bit manipulation approach works for all positive integers
    return n > 0 and (n & (n - 1)) == 0
```

---

## Summary

The Power of Two problem is a classic bit manipulation problem with an elegant O(1) solution. The key insight is that powers of two have exactly one bit set in binary, and the `n & (n-1)` trick efficiently verifies this property. This pattern is fundamental for many bitwise operation problems and is commonly used in system programming, compiler optimization, and competitive programming.

