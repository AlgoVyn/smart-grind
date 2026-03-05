# Bitwise - Counting Set Bits (Hamming Weight)

## Problem Description

The Bitwise Counting Set Bits pattern, also known as **Hamming Weight**, is a fundamental technique in bit manipulation for counting the number of 1s (set bits) in the binary representation of a number. By leveraging clever bit manipulation techniques—particularly the `n & (n - 1)` operation—developers can count set bits with minimal operations.

This pattern is essential for problems requiring bit analysis, such as calculating population counts, evaluating binary properties, and solving various competitive programming challenges.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(k) where k is the number of set bits (worst case O(1) for fixed-width integers) |
| Space Complexity | O(1) - Constant extra space |
| Input | 32-bit or 64-bit integer |
| Output | Count of bits set to 1 |
| Approach | Brian Kernighan's algorithm or bit manipulation |

### When to Use

- Counting set bits (population count) in binary representation
- Problems requiring bit analysis and manipulation
- Cryptography and error detection algorithms
- Database bitmap index operations
- Network programming and packet validation
- Graphics and pixel manipulation

## Intuition

The core intuition behind counting set bits lies in understanding how we can systematically examine and manipulate individual bits.

The "aha!" moments:
1. **Check Every Bit**: Check each bit position individually using `n & 1` and shift right
2. **Brian Kernighan's Trick**: `n & (n - 1)` always clears the least significant 1 bit
3. **Count Iterations**: Each iteration removes one set bit, count until n becomes 0
4. **Built-in Functions**: Most languages provide optimized built-in functions
5. **Lookup Tables**: Precomputed tables provide O(1) lookup for frequent operations

## Solution Approaches

### Approach 1: Brian Kernighan's Algorithm (Optimal) ✅ Recommended

This is the most efficient approach that minimizes the number of operations by leveraging the `n & (n - 1)` trick.

#### Algorithm
1. Initialize a counter to 0
2. While the number is not 0:
   - Increment the counter (we found a set bit)
   - Use `n & (n - 1)` to remove the least significant set bit
3. Return the counter

#### Implementation

````carousel
```python
def hamming_weight(n: int) -> int:
    """
    Count the number of set bits using Brian Kernighan's algorithm.
    LeetCode 191 - Number of 1 Bits
    
    Time: O(k) where k is number of set bits, Space: O(1)
    """
    count = 0
    
    # Keep removing the least significant 1 bit
    while n:
        count += 1
        n &= (n - 1)  # Remove the least significant 1 bit
    
    return count
```
<!-- slide -->
```cpp
#include <cstdint>
using namespace std;

class Solution {
public:
    int hammingWeight(uint32_t n) {
        int count = 0;
        
        // Keep removing the least significant 1 bit
        while (n) {
            count++;
            n &= (n - 1);  // Remove the least significant 1 bit
        }
        
        return count;
    }
};
```
<!-- slide -->
```java
public class Solution {
    public int hammingWeight(int n) {
        int count = 0;
        
        // Keep removing the least significant 1 bit
        while (n != 0) {
            count++;
            n &= (n - 1);  // Remove the least significant 1 bit
        }
        
        return count;
    }
}
```
<!-- slide -->
```javascript
/**
 * Count the number of set bits using Brian Kernighan's algorithm.
 * @param {number} n - 32-bit unsigned integer
 * @return {number} Count of bits set to 1
 */
var hammingWeight = function(n) {
    let count = 0;
    
    // Keep removing the least significant 1 bit
    while (n !== 0) {
        count++;
        n &= (n - 1);  // Remove the least significant 1 bit
    }
    
    return count;
};
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(k) where k is the number of set bits |
| Space | O(1) - Only uses a counter variable |

### Approach 2: Right Shift and Check (Basic)

This is the most straightforward approach that checks each bit individually.

#### Algorithm
1. Initialize a counter to 0
2. Iterate through all bit positions (32 for 32-bit integers)
3. Check if the least significant bit is 1 using `n & 1`
4. If it is, increment the counter
5. Right shift the number by 1 bit
6. Return the counter

#### Implementation

````carousel
```python
def hamming_weight(n: int) -> int:
    """
    Count the number of set bits using right shift approach.
    LeetCode 191 - Number of 1 Bits
    
    Time: O(32) = O(1), Space: O(1)
    """
    count = 0
    
    # Process all 32 bits
    for _ in range(32):
        # Check if the least significant bit is 1
        if n & 1:
            count += 1
        
        # Right shift to check next bit
        n >>= 1
    
    return count
```
<!-- slide -->
```cpp
#include <cstdint>
using namespace std;

class Solution {
public:
    int hammingWeight(uint32_t n) {
        int count = 0;
        
        // Process all 32 bits
        for (int i = 0; i < 32; i++) {
            // Check if the least significant bit is 1
            if (n & 1) {
                count++;
            }
            
            // Right shift to check next bit
            n >>= 1;
        }
        
        return count;
    }
};
```
<!-- slide -->
```java
public class Solution {
    public int hammingWeight(int n) {
        int count = 0;
        
        // Process all 32 bits
        for (int i = 0; i < 32; i++) {
            // Check if the least significant bit is 1
            if ((n & 1) == 1) {
                count++;
            }
            
            // Right shift to check next bit
            n >>= 1;
        }
        
        return count;
    }
}
```
<!-- slide -->
```javascript
/**
 * Count the number of set bits using right shift approach.
 * @param {number} n - 32-bit unsigned integer
 * @return {number} Count of bits set to 1
 */
var hammingWeight = function(n) {
    let count = 0;
    
    // Process all 32 bits
    for (let i = 0; i < 32; i++) {
        // Check if the least significant bit is 1
        if (n & 1) {
            count++;
        }
        
        // Right shift to check next bit
        n >>= 1;
    }
    
    return count;
};
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(32) = O(1) - Fixed number of iterations |
| Space | O(1) - Constant extra space |

### Approach 3: Built-in Functions (Language-Specific)

Many programming languages provide built-in functions for counting set bits.

#### Algorithm
1. Use language-specific built-in function
2. Return the result directly

#### Implementation

````carousel
```python
def hamming_weight(n: int) -> int:
    """
    Count the number of set bits using Python's built-in.
    
    Time: O(1), Space: O(1)
    """
    # Python 3.10+ has built-in bit_count()
    return n.bit_count()

# Alternative using bin()
def hamming_weight_bin(n: int) -> int:
    """Convert to binary string and count '1' characters."""
    return bin(n).count('1')
```
<!-- slide -->
```cpp
#include <cstdint>
using namespace std;

class Solution {
public:
    int hammingWeight(uint32_t n) {
        // Use GCC/Clang built-in function
        return __builtin_popcount(n);
    }
    
    int hammingWeight64(uint64_t n) {
        // For 64-bit integers
        return __builtin_popcountll(n);
    }
};
```
<!-- slide -->
```java
public class Solution {
    public int hammingWeight(int n) {
        // Use Java's built-in bitCount() method
        return Integer.bitCount(n);
    }
    
    public int hammingWeight(long n) {
        // For 64-bit integers
        return Long.bitCount(n);
    }
}
```
<!-- slide -->
```javascript
/**
 * Count the number of set bits using built-in methods.
 * @param {number} n - 32-bit unsigned integer
 * @return {number} Count of bits set to 1
 */
var hammingWeight = function(n) {
    // Convert to binary string and count '1' characters
    return n.toString(2).split('1').length - 1;
};
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(1) - Highly optimized built-in operations |
| Space | O(1) - No extra space used |

### Approach 4: Lookup Table (Precomputation)

For maximum performance when counting bits frequently, use a precomputed lookup table.

#### Algorithm
1. Precompute a table mapping 8-bit values (0-255) to their bit counts
2. Split the 32-bit number into four 8-bit bytes
3. Sum up the counts from the lookup table

#### Implementation

````carousel
```python
class HammingWeight:
    """Precomputed lookup table for fast bit counting."""
    
    def __init__(self):
        # Precompute lookup table for 8-bit values (0-255)
        self.lookup = [0] * 256
        for i in range(256):
            self.lookup[i] = (i & 1) + self.lookup[i >> 1] if i else 0
    
    def count(self, n: int) -> int:
        """Count set bits using lookup table."""
        # Extract bytes and sum up counts
        return (self.lookup[n & 0xff] +
                self.lookup[(n >> 8) & 0xff] +
                self.lookup[(n >> 16) & 0xff] +
                self.lookup[(n >> 24) & 0xff])


def hamming_weight(n: int) -> int:
    """Convenience function using singleton instance."""
    return HammingWeight().count(n)
```
<!-- slide -->
```cpp
#include <cstdint>
#include <array>

class BitCounter {
private:
    // Precomputed lookup table for 8-bit values
    static const std::array<uint8_t, 256> TABLE;
    
    static std::array<uint8_t, 256> initTable() {
        std::array<uint8_t, 256> table{};
        for (int i = 0; i < 256; i++) {
            table[i] = (i & 1) + table[i >> 1];
        }
        return table;
    }
    
public:
    int count(uint32_t n) const {
        return TABLE[n & 0xff] +
               TABLE[(n >> 8) & 0xff] +
               TABLE[(n >> 16) & 0xff] +
               TABLE[(n >> 24) & 0xff];
    }
};

const std::array<uint8_t, 256> BitCounter::TABLE = BitCounter::initTable();
```
<!-- slide -->
```java
public class BitCounter {
    // Precomputed lookup table for 8-bit values
    private static final int[] LOOKUP = new int[256];
    
    static {
        for (int i = 0; i < 256; i++) {
            LOOKUP[i] = (i & 1) + (i > 0 ? LOOKUP[i >> 1] : 0);
        }
    }
    
    public static int count(int n) {
        return LOOKUP[n & 0xff] +
               LOOKUP[(n >> 8) & 0xff] +
               LOOKUP[(n >> 16) & 0xff] +
               LOOKUP[(n >> 24) & 0xff];
    }
}
```
<!-- slide -->
```javascript
/**
 * Lookup table-based bit counter
 */
class BitCounter {
    constructor() {
        // Precomputed lookup table for 8-bit values
        this.lookup = [
            0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4,
            1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5,
            1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5,
            2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6,
            1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5,
            2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6,
            2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6,
            3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7,
            1, 2, 2, 3, 2, 3, 3, 4, 2, 3, 3, 4, 3, 4, 4, 5,
            2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6,
            2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6,
            3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7,
            2, 3, 3, 4, 3, 4, 4, 5, 3, 4, 4, 5, 4, 5, 5, 6,
            3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7,
            3, 4, 4, 5, 4, 5, 5, 6, 4, 5, 5, 6, 5, 6, 6, 7,
            4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8
        ];
    }
    
    count(n) {
        return this.lookup[n & 0xff] +
               this.lookup[(n >> 8) & 0xff] +
               this.lookup[(n >> 16) & 0xff] +
               this.lookup[(n >> 24) & 0xff];
    }
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(1) - Constant time lookup |
| Space | O(256) = O(1) - Fixed lookup table size |

## Complexity Analysis

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| **Brian Kernighan** | O(k) | O(1) | **Recommended** - Optimal for sparse bits |
| **Right Shift** | O(32) = O(1) | O(1) | Simplicity, readability |
| **Built-in Functions** | O(1) | O(1) | Production code, when available |
| **Lookup Table** | O(1) | O(1) | High-frequency calls |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/) | 191 | Easy | Count 1s in 32-bit integer |
| [Counting Bits](https://leetcode.com/problems/counting-bits/) | 338 | Easy | Count bits for all numbers 0 to n |
| [Reverse Bits](https://leetcode.com/problems/reverse-bits/) | 190 | Easy | Reverse bits of 32-bit integer |
| [Power of Two](https://leetcode.com/problems/power-of-two/) | 231 | Easy | Check if number is power of 2 |
| [Single Number](https://leetcode.com/problems/single-number/) | 136 | Easy | Find element appearing once (XOR-based) |
| [Single Number II](https://leetcode.com/problems/single-number-ii/) | 137 | Medium | Elements appear 3 times except one |
| [Missing Number](https://leetcode.com/problems/missing-number/) | 268 | Easy | XOR-based solution |
| [Total Hamming Distance](https://leetcode.com/problems/total-hamming-distance/) | 477 | Medium | Sum of Hamming distances for all pairs |
| [Bitwise AND of Numbers Range](https://leetcode.com/problems/bitwise-and-of-numbers-range/) | 201 | Medium | Bitwise AND of range |

## Video Tutorial Links

1. **[Number of 1 Bits - NeetCode](https://www.youtube.com/watch?v=5Km3ut9o_2s)** - Excellent visual explanation
2. **[Number of 1 Bits - William Lin](https://www.youtube.com/watch?v=1zH7K0Jo5kI)** - Multiple approaches covered
3. **[Brian Kernighan's Algorithm - CodeBroke](https://www.youtube.com/watch?v=QRJ8S4qWq6Q)** - Deep dive into the optimal algorithm
4. **[Bit Manipulation Fundamentals - CodeBroke](https://www.youtube.com/watch?v=7jkVg4gM-qA)** - Comprehensive tutorial

## Summary

### Key Takeaways
- **Brian Kernighan's Algorithm**: `n & (n - 1)` removes the least significant 1 bit efficiently
- **Optimal Performance**: O(k) time where k is the number of set bits
- **Minimal Space**: Only constant extra space is needed
- **Built-in Functions**: Prefer language built-ins for production code
- **Universal Application**: Works with any integer representation

### Common Pitfalls
- **Modifying original number**: Work on a copy if original needs to be preserved
- **Infinite loop with signed integers**: Use unsigned integer types in C++
- **Not handling all bits**: Use fixed-width loop (32 iterations) for 32-bit integers
- **Off-by-one errors**: Be careful with loop bounds and bit masks

### Follow-up Questions
1. **How would you count bits for all numbers from 0 to n?**
   - Answer: Use DP approach where `count[i] = count[i >> 1] + (i & 1)`

2. **Can you count bits without using any loops?**
   - Answer: Use parallel bit counting with bitwise operations (advanced)

3. **How would you find the position of the rightmost set bit?**
   - Answer: Use `n & -n` to isolate the lowest set bit, then use lookup table

4. **What is the time complexity for counting bits in all numbers from 1 to n?**
   - Answer: O(n) using dynamic programming approach

## Pattern Source

[Counting Set Bits Pattern](patterns/bitwise-and-counting-set-bits-hamming-weight.md)
