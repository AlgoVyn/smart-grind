# Power Of Two

## Problem Description

Given an integer `n`, return `true` if it is a power of two. Otherwise, return `false`.

An integer `n` is a power of two if and only if there exists an integer `x` such that `n == 2^x`.

This is **LeetCode Problem #231** and is classified as an Easy difficulty problem. It is one of the most fundamental problems for understanding bitwise operations and is frequently asked in technical interviews.

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

### Key Constraints

| Constraint | Description | Importance |
|------------|-------------|------------|
| `-2^31 <= n <= 2^31 - 1` | Input range | 32-bit signed integer |
| `n > 0` | Powers of two are always positive | Edge case handling |
| O(1) solution exists | Bit manipulation | Tests bitwise understanding |

---

## Examples

### Example 1:

**Input:** `n = 1`  
**Output:** `true`

**Explanation:** 2^0 = 1

### Example 2:

**Input:** `n = 16`  
**Output:** `true`

**Explanation:** 2^4 = 16

### Example 3:

**Input:** `n = 3`  
**Output:** `false`

**Explanation:** 3 is not a power of two (binary: 0b11 has two set bits)

### Example 4:

**Input:** `n = 0`  
**Output:** `false`

**Explanation:** 0 is not a power of two

### Example 5:

**Input:** `n = -2`  
**Output:** `false`

**Explanation:** Negative numbers cannot be powers of two

### Example 6:

**Input:** `n = 1073741824` (2^30)  
**Output:** `true`

**Explanation:** This is the largest power of two within 32-bit signed integer range

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

### Approach 1: Bit Manipulation (Recommended) ⭐

This is the most efficient and elegant approach using the `n & (n-1)` trick.

#### Algorithm

1. Check if n is greater than 0 (negative numbers and zero cannot be powers of two)
2. Check if n & (n-1) equals 0 (this means only one bit is set)

#### Implementation

````carousel
```python
class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        """
        Check if n is a power of two using bit manipulation.
        
        Args:
            n: Integer to check
            
        Returns:
            True if n is a power of two, False otherwise
        """
        return n > 0 and (n & (n - 1)) == 0
```
<!-- slide -->
```cpp
#include <cstdint>
using namespace std;

class Solution {
public:
    bool isPowerOfTwo(int32_t n) {
        // Check if n is positive and has only one bit set
        return n > 0 && (n & (n - 1)) == 0;
    }
};
```
<!-- slide -->
```java
public class Solution {
    public boolean isPowerOfTwo(int n) {
        // Check if n is positive and has only one bit set
        return n > 0 && (n & (n - 1)) == 0;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number} n - a positive or negative integer
 * @return {boolean}
 */
var isPowerOfTwo = function(n) {
    // Check if n is positive and has only one bit set
    return n > 0 && (n & (n - 1)) === 0;
};
```
````

**Time Complexity:** O(1)  
**Space Complexity:** O(1)

---

### Approach 2: Built-in bit_count() (Python 3.8+)

Uses Python's built-in method to count set bits.

#### Algorithm

1. Check if n is greater than 0
2. Check if the number of set bits is exactly 1

#### Implementation

````carousel
```python
class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        """
        Check if n is a power of two using Python's bit_count() method.
        
        Args:
            n: Integer to check
            
        Returns:
            True if n is a power of two, False otherwise
        """
        return n > 0 and n.bit_count() == 1
```
<!-- slide -->
```cpp
#include <cstdint>
#include <bitset>
using namespace std;

class Solution {
public:
    bool isPowerOfTwo(int32_t n) {
        if (n <= 0) return false;
        // Count set bits and check if exactly one
        return __builtin_popcount(n) == 1;
    }
};
```
<!-- slide -->
```java
public class Solution {
    public boolean isPowerOfTwo(int n) {
        if (n <= 0) return false;
        // Count set bits and check if exactly one
        return Integer.bitCount(n) == 1;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number} n - a positive or negative integer
 * @return {boolean}
 */
var isPowerOfTwo = function(n) {
    if (n <= 0) return false;
    // Convert to binary string and count '1's
    return n.toString(2).split('1').length - 1 === 1;
};
```
````

**Time Complexity:** O(1)  
**Space Complexity:** O(1)

---

### Approach 3: Logarithmic Method

Uses mathematical logarithm to check if n is a power of two.

#### Algorithm

1. Check if n is greater than 0
2. Calculate log2(n) and check if it's an integer (i.e., fractional part is 0)

#### Implementation

````carousel
```python
import math

class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        """
        Check if n is a power of two using logarithms.
        
        Args:
            n: Integer to check
            
        Returns:
            True if n is a power of two, False otherwise
        """
        if n <= 0:
            return False
        return math.log2(n).is_integer()
```
<!-- slide -->
```cpp
#include <cmath>
#include <cstdint>
using namespace std;

class Solution {
public:
    bool isPowerOfTwo(int32_t n) {
        if (n <= 0) return false;
        // Calculate log2 and check if it's an integer
        double log_val = log2(n);
        return fabs(log_val - round(log_val)) < 1e-10;
    }
};
```
<!-- slide -->
```java
import java.lang.Math;

public class Solution {
    public boolean isPowerOfTwo(int n) {
        if (n <= 0) return false;
        // Calculate log2 and check if it's an integer
        double logVal = Math.log(n) / Math.log(2);
        return Math.abs(logVal - Math.round(logVal)) < 1e-10;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number} n - a positive or negative integer
 * @return {boolean}
 */
var isPowerOfTwo = function(n) {
    if (n <= 0) return false;
    // Calculate log2 and check if it's an integer
    const logVal = Math.log2(n);
    return Math.abs(logVal - Math.round(logVal)) < 1e-10;
};
```
````

**Time Complexity:** O(1)  
**Space Complexity:** O(1)

**Note:** This approach may have floating-point precision issues for very large numbers.

---

### Approach 4: Loop Division

Repeatedly divides by 2 until reaching 1.

#### Algorithm

1. Keep dividing n by 2 until it becomes 1
2. If we reach exactly 1, it's a power of two
3. If at any point n becomes 0 or we get a non-integer result, it's not

#### Implementation

````carousel
```python
class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        """
        Check if n is a power of two by repeated division.
        
        Args:
            n: Integer to check
            
        Returns:
            True if n is a power of two, False otherwise
        """
        if n <= 0:
            return False
        while n % 2 == 0:
            n //= 2
        return n == 1
```
<!-- slide -->
```cpp
#include <cstdint>
using namespace std;

class Solution {
public:
    bool isPowerOfTwo(int32_t n) {
        if (n <= 0) return false;
        // Keep dividing by 2 until we reach 1
        while (n % 2 == 0) {
            n /= 2;
        }
        return n == 1;
    }
};
```
<!-- slide -->
```java
public class Solution {
    public boolean isPowerOfTwo(int n) {
        if (n <= 0) return false;
        // Keep dividing by 2 until we reach 1
        while (n % 2 == 0) {
            n /= 2;
        }
        return n == 1;
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number} n - a positive or negative integer
 * @return {boolean}
 */
var isPowerOfTwo = function(n) {
    if (n <= 0) return false;
    // Keep dividing by 2 until we reach 1
    while (n % 2 === 0) {
        n = Math.floor(n / 2);
    }
    return n === 1;
};
```
````

**Time Complexity:** O(log n) - Number of divisions equals the exponent  
**Space Complexity:** O(1)

---

### Approach 5: Recursion

Uses recursive approach to check if n is a power of two.

#### Algorithm

1. Base case: if n == 1, return True
2. If n is even, recursively check n/2
3. Otherwise, return False

#### Implementation

````carousel
```python
class Solution:
    def isPowerOfTwo(self, n: int) -> bool:
        """
        Check if n is a power of two using recursion.
        
        Args:
            n: Integer to check
            
        Returns:
            True if n is a power of two, False otherwise
        """
        if n == 1:
            return True
        if n <= 0 or n % 2 != 0:
            return False
        return self.isPowerOfTwo(n // 2)
```
<!-- slide -->
```cpp
#include <cstdint>
using namespace std;

class Solution {
public:
    bool isPowerOfTwo(int32_t n) {
        if (n == 1) return true;
        if (n <= 0 || n % 2 != 0) return false;
        return isPowerOfTwo(n / 2);
    }
};
```
<!-- slide -->
```java
public class Solution {
    public boolean isPowerOfTwo(int n) {
        if (n == 1) return true;
        if (n <= 0 || n % 2 != 0) return false;
        return isPowerOfTwo(n / 2);
    }
    
    private boolean isPowerOfTwo(int n) {
        if (n == 1) return true;
        if (n <= 0 || n % 2 != 0) return false;
        return isPowerOfTwo(n / 2);
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number} n - a positive or negative integer
 * @return {boolean}
 */
var isPowerOfTwo = function(n) {
    if (n === 1) return true;
    if (n <= 0 || n % 2 !== 0) return false;
    return isPowerOfTwo(Math.floor(n / 2));
};
```
````

**Time Complexity:** O(log n)  
**Space Complexity:** O(log n) - Due to recursion stack

---

### Approach 6: Precomputed Lookup Table (Constant Time)

Uses a precomputed table to check if n is a power of two.

#### Algorithm

1. Use a lookup table that maps 16-bit values to boolean (is power of two)
2. Check the 16-bit chunks of n against the table

#### Implementation

````carousel
```python
class Solution:
    # Precomputed lookup table for 16-bit values (0-65535)
    _lookup = [False] * 65536
    
    def __init__(self):
        # Precompute which values are powers of two
        for i in range(65536):
            self._lookup[i] = i > 0 and (i & (i - 1)) == 0
    
    def isPowerOfTwo(self, n: int) -> bool:
        """
        Check if n is a power of two using a lookup table.
        
        Args:
            n: Integer to check
            
        Returns:
            True if n is a power of two, False otherwise
        """
        if n <= 0 or n >= 65536:
            return n > 0 and (n & (n - 1)) == 0
        return self._lookup[n]
```
<!-- slide -->
```cpp
#include <cstdint>
#include <vector>
using namespace std;

class Solution {
private:
    // Precomputed lookup table for 16-bit values
    static const vector<bool> LOOKUP;
    
    static vector<bool> initLookup() {
        vector<bool> lookup(65536, false);
        for (int i = 0; i < 65536; i++) {
            lookup[i] = i > 0 && (i & (i - 1)) == 0;
        }
        return lookup;
    }
    
public:
    bool isPowerOfTwo(int32_t n) {
        if (n <= 0 || n >= 65536) {
            return n > 0 && (n & (n - 1)) == 0;
        }
        return LOOKUP[n];
    }
};

const vector<bool> Solution::LOOKUP = Solution::initLookup();
```
<!-- slide -->
```java
public class Solution {
    // Precomputed lookup table for 16-bit values
    private static final boolean[] LOOKUP = new boolean[65536];
    
    static {
        for (int i = 0; i < 65536; i++) {
            LOOKUP[i] = i > 0 && (i & (i - 1)) == 0;
        }
    }
    
    public boolean isPowerOfTwo(int n) {
        if (n <= 0 || n >= 65536) {
            return n > 0 && (n & (n - 1)) == 0;
        }
        return LOOKUP[n];
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number} n - a positive or negative integer
 * @return {boolean}
 */
var isPowerOfTwo = function(n) {
    // Precomputed lookup table for 16-bit values
    const lookup = new Array(65536).fill(false);
    for (let i = 0; i < 65536; i++) {
        lookup[i] = i > 0 && (i & (i - 1)) === 0;
    }
    
    return function(n) {
        if (n <= 0 || n >= 65536) {
            return n > 0 && (n & (n - 1)) === 0;
        }
        return lookup[n];
    };
}();
```
````

**Time Complexity:** O(1)  
**Space Complexity:** O(1) - Lookup table is static (allocated once)

**Note:** This approach is useful for high-frequency calls where the lookup table is precomputed once.

---

## Comparison of Approaches

| Approach | Time Complexity | Space Complexity | Pros | Cons |
|----------|-----------------|------------------|------|------|
| **Bit Manipulation** | O(1) | O(1) | Most efficient, no loops | Requires understanding of bitwise ops |
| **Built-in bit_count()** | O(1) | O(1) | Clean, readable code | Python 3.8+ / language-specific |
| **Logarithmic** | O(1) | O(1) | Simple concept | Floating-point precision issues |
| **Loop Division** | O(log n) | O(1) | Easy to understand | Slower for large numbers |
| **Recursion** | O(log n) | O(log n) | Elegant recursive solution | Stack overflow risk for large n |
| **Lookup Table** | O(1) | O(1) | Fast for high-frequency calls | Precomputation overhead, large table for 64-bit |

---

## Explanation of the Recommended Approach (Bit Manipulation)

### Step-by-Step Breakdown

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

### Why This Works

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

## Edge Cases and Common Pitfalls

### Edge Cases to Consider

1. **Zero Input:**
   ```
   n = 0 → Output: false
   ```
   The algorithm correctly handles this case since 0 is not greater than 0.

2. **Negative Numbers:**
   ```
   n = -2 → Output: false
   ```
   Negative numbers cannot be powers of two.

3. **One (2^0):**
   ```
   n = 1 → Output: true
   ```
   1 is a valid power of two (2^0).

4. **Maximum Power of Two:**
   ```
   n = 1073741824 (2^30) → Output: true
   ```
   This is the largest power of two within 32-bit signed integer range.

5. **Overflow Case:**
   ```
   n = 2147483648 (2^31) → Output: false (for signed int)
   ```
   This exceeds the positive range of 32-bit signed integers.

### Common Mistakes to Avoid

1. **Forgetting to Check n > 0:**
   ```python
   # Wrong - will return true for 0
   return (n & (n - 1)) == 0
   ```
   - Always check for positive numbers first

2. **Using Signed Integer for Bit Operations:**
   ```cpp
   // In C++, be careful with signed integers for negative numbers
   int n = -2147483648;
   ```
   - Solution: Use unsigned integer types (uint32_t) for bit manipulation

3. **Floating-Point Precision:**
   ```python
   # Wrong - may have precision issues
   return math.log2(n) == int(math.log2(n))
   ```
   - Solution: Use `math.log2(n).is_integer()` or a small epsilon tolerance

---

## Why This Problem is Important

### Interview Relevance

- **Frequency:** Frequently asked in technical interviews
- **Companies:** Google, Amazon, Meta, Apple, Microsoft, Bloomberg
- **Difficulty:** Easy, but tests fundamental understanding of bitwise operations
- **Variations:** Leads to more complex bit manipulation problems like Power of Three and Power of Four

### Learning Outcomes

1. **Understanding Bitwise Operations:** Learn the powerful properties of AND, OR, NOT, and shifts
2. **Bit Manipulation Techniques:** Master techniques for checking and manipulating bits
3. **Algorithm Optimization:** Understand how to minimize operations using clever bit tricks
4. **Pattern Recognition:** Identify when bit manipulation is the right approach

---

## Related Problems

### Same Category (Power Checking)

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Power of Four](https://leetcode.com/problems/power-of-four/) | 342 | Easy | Check if a number is a power of 4 |
| [Power of Three](https://leetcode.com/problems/power-of-three/) | 326 | Easy | Check if a number is a power of 3 |

### Similar Bit Manipulation Concepts

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/) | 191 | Easy | Count the number of '1' bits |
| [Reverse Bits](https://leetcode.com/problems/reverse-bits/) | 190 | Easy | Reverse bits of a 32-bit integer |
| [Bitwise AND of Numbers Range](https://leetcode.com/problems/bitwise-and-of-numbers-range/) | 201 | Medium | Find bitwise AND of range |
| [Single Number](https://leetcode.com/problems/single-number/) | 136 | Easy | Find element appearing once |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[Power of Two - NeetCode](https://www.youtube.com/watch?v=6E818oVIW64)**
   - Clear explanation with multiple approaches
   - Visual demonstrations
   - Part of popular NeetCode playlist

2. **[Bit Manipulation Tricks - Power of Two](https://www.youtube.com/watch?v=v-15MvM6a4c)**
   - In-depth bit manipulation tutorial
   - Explains the n & (n-1) trick

3. **[LeetCode 231 Solution - Tech Lead](https://www.youtube.com/watch?v=11jMtYPQMEA)**
   - Detailed walkthrough of the solution
   - Interview-focused approach

4. **[Bitwise AND Trick Explained](https://www.youtube.com/watch?v=HsDEkZHrdKg)**
   - Visual explanation of n & (n-1) trick
   - Beginner-friendly

### Additional Resources

- **[LeetCode Official Solution](https://leetcode.com/problems/power-of-two/solutions/)** - Official solutions and community discussions
- **[Bitwise Operations - GeeksforGeeks](https://www.geeksforgeeks.org/bitwise-operators-c-cpp/)** - Language-specific examples
- **[Brian Kernighan's Algorithm](https://en.wikipedia.org/wiki/Brian_Kernighan%27s_algorithm)** - Theoretical background

---

## Follow-up Questions

### Basic Level

1. **What is the time and space complexity of the bit manipulation approach?**
   - Time Complexity: O(1) - constant time regardless of input size
   - Space Complexity: O(1) - only uses a few primitive variables

2. **How does the operation `n & (n - 1)` work?**
   - It clears the least significant 1 bit
   - This is because `n - 1` flips all bits from the least significant 1 onwards
   - ANDing with original n clears only that bit
   - For powers of two, this results in 0 since there's only one bit set

3. **Why do we need to check `n > 0` before the bit operation?**
   - 0 is not a power of two but `0 & (0 - 1) = 0 & (-1) = 0` would incorrectly return true
   - Negative numbers have their sign bit set, which would also cause incorrect results

### Intermediate Level

4. **How would you check if a number is a power of 4?**

   A number is a power of 4 if:
   1. It is a power of 2 (one set bit)
   2. The set bit is in an even position (0-indexed from LSB)

   The formula: `n > 0 && (n & (n - 1)) == 0 && (n & 0xAAAAAAAA) == 0`

   The mask `0xAAAAAAAA` has '1's in all odd bit positions, so this check ensures the single '1' bit is in an even position.

5. **How do you find the next power of 2 greater than or equal to n?**

   Use bit manipulation to set all bits to the right of the highest set bit:
   ```
   if n is power of 2, return n
   otherwise:
     n |= n >> 1
     n |= n >> 2
     n |= n >> 4
     n |= n >> 8
     n |= n >> 16
     return n + 1
   ```

6. **What's the difference between checking powers of two using bit_count() vs (n & (n-1))?**

   Both methods are O(1) in Python, but they have different characteristics:
   
   - `n & (n-1) == 0`:
     - Works in all Python versions
     - Uses bitwise operations
     - Very efficient (2-3 operations)
   
   - `n.bit_count() == 1`:
     - Requires Python 3.8+
     - More readable and explicit
     - Slightly more overhead but negligible

### Advanced Level

7. **How would you count the number of set bits (Hamming weight)?**

   **Brian Kernighan's Algorithm (Optimal):**
   ```
   count = 0
   while n:
       n = n & (n - 1)
       count += 1
   return count
   ```

   This algorithm runs in O(k) where k is the number of set bits, which is more efficient than checking all 32 bits.

8. **What is the relationship between this problem and the Collatz conjecture?**

   The Collatz conjecture (3n+1 problem) and the Power of Two problem share interesting connections:
   
   - **Division by 2:** Equivalent to right shift: `n >> 1`
   - **Checking even/odd:** Equivalent to checking LSB: `n & 1`
   - **Trailing zeros:** The number of times you can divide by 2 in a row equals the number of trailing zeros
   - This is computed as: `trailing_zeros = n & -n` (isolates lowest set bit)

   Understanding bit manipulation helps analyze Collatz sequences, as the number of consecutive divisions by 2 depends on trailing zeros.

9. **How would you implement addition using only bitwise operations?**

   **Iterative Addition Algorithm:**
   ```
   function add(a, b):
       while b != 0:
           carry = a & b
           a = a ^ b
           b = carry << 1
       return a
   ```

   **How it works:**
   - XOR (^) adds bits without carry
   - AND (&) identifies positions where carry occurs
   - Carry is shifted left and added back
   - Continues until no carry remains

10. **What is the difference between Hamming weight and Hamming distance?**

    **Hamming Weight:**
    - Number of 1 bits in a number
    - Formula: `hw(n) = count of bits where bit = 1`
    - Example: Hamming weight of 13 (1101) is 3

    **Hamming Distance:**
    - Number of positions where two numbers differ
    - Formula: `hd(a, b) = hw(a ^ b)`
    - Example: Distance between 13 (1101) and 10 (1010) is 3

    **Key Difference:** Hamming weight measures 1s in a single number, while Hamming distance measures differences between two numbers.

### Practical Implementation Questions

11. **How would you handle edge cases in production code?**

    - Validate input type (ensure integer)
    - Handle negative numbers and zero explicitly
    - Consider using unsigned integers for bit operations
    - Add documentation explaining the algorithm

12. **What if you need to check powers of two for very large numbers (beyond 64 bits)?**
    - The bit manipulation approach still works
    - Use arbitrary precision integers or big integer libraries
    - The `n & (n-1)` trick is universal for any bit width

13. **What are the real-world applications of this pattern?**
    - Memory allocation (powers of 2 alignment)
    - Hash table sizing
    - Graphics programming (texture dimensions)
    - Game development (grid sizes, chunk sizes)
    - Compiler optimization (alignment padding)

---

## Summary

The **Power of Two** problem is a classic bit manipulation problem with an elegant O(1) solution. The key insight is that powers of two have exactly one bit set in binary, and the `n & (n-1)` trick efficiently verifies this property.

### Key Takeaways

1. **Recommended Approach:** Bit manipulation using `n & (n-1)` - O(1) time and space
2. **Understanding Binary:** Powers of two have exactly one '1' bit followed by all '0's
3. **The Trick:** `n & (n-1)` clears the least significant 1 bit
4. **Edge Cases:** Always check for n > 0 before bit operations
5. **Universal Pattern:** This technique extends to Power of Three and Power of Four
6. **Alternative O(1) Methods:** Lookup tables for high-frequency scenarios

This problem serves as a foundation for understanding bit manipulation, which is essential for many advanced algorithms in competitive programming and technical interviews.

---

## LeetCode Link

[Power of Two - LeetCode](https://leetcode.com/problems/power-of-two/)
