# Bitwise AND - Counting Set Bits (Hamming Weight)

## Overview

The **Bitwise AND** pattern for counting set bits, also known as **Hamming Weight**, is one of the most fundamental techniques in bit manipulation. This pattern involves using bitwise AND operations to efficiently determine the number of 1s (set bits) in the binary representation of a number.

This pattern is essential for problems requiring bit analysis, such as calculating population counts, evaluating binary properties, and solving various competitive programming challenges. By leveraging clever bit manipulation techniques—particularly the `n & (n - 1)` operation—developers can count set bits with minimal operations.

### Why This Pattern Matters

- **Efficiency**: The optimal approach runs in O(k) time where k is the number of set bits (worst case O(1) for fixed-width integers)
- **Simplicity**: Requires only basic bitwise operations
- **Versatility**: Forms the foundation for more complex bit manipulation problems
- **Real-world Applications**: Used in cryptography, error detection/correction, data compression, and hardware-level programming

---

## Key Concepts

### Fundamental Operations

| Operation | Description | Example |
|-----------|-------------|---------|
| `n & 1` | Isolates the least significant bit (LSB) | `5 & 1 = 1` (101 & 001 = 001) |
| `n >> 1` | Right shifts by 1 (divides by 2) | `5 >> 1 = 2` (101 → 10) |
| `n & (n - 1)` | Clears the least significant 1 bit | `6 & 5 = 4` (110 & 101 = 100) |
| `n & -n` | Isolates the lowest set bit (LSB extraction) | `12 & -12 = 4` (1100 & ...0100 = 0100) |

### Key Terminology

- **Set Bit**: A bit that has a value of 1
- **Hamming Weight**: The total count of bits set to 1 in a binary number (also called "population count" or "popcount")
- **Bit Mask**: A binary number used to isolate specific bits through AND operations
- **Trailing Zeros**: Consecutive zeros at the least significant end of a binary number
- **Least Significant Bit (LSB)**: The rightmost bit in a binary number (position 0)

---

## Intuition

The core intuition behind counting set bits lies in understanding how we can systematically examine and manipulate individual bits. There are two main philosophical approaches:

### Approach 1: Check Every Bit

The most straightforward method is to check each bit position individually:
1. Start from the least significant bit
2. Check if it's 1 using `n & 1`
3. Shift right to move to the next bit
4. Repeat until all bits are processed

### Approach 2: Remove Set Bits (Optimal)

A more elegant approach leverages the property that `n & (n - 1)` always clears the least significant 1 bit:
1. Each iteration removes one set bit
2. Count how many iterations until n becomes 0
3. This count is exactly the number of set bits

**Why `n & (n - 1)` works:**
- `n - 1` flips all bits from the least significant 1 onwards
- ANDing with the original n clears only that least significant 1
- Example: `n = 12` (1100), `n - 1 = 11` (1011), `n & (n - 1) = 8` (1000)

---

## Solution Approaches

### Approach 1: Right Shift and Check (Basic)

This is the most straightforward approach that checks each bit individually. While not optimal for sparse bit patterns, it's highly readable and easy to understand.

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
    
    Args:
        n: 32-bit unsigned integer
        
    Returns:
        Count of bits set to 1
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
```
<!-- slide -->
```java
public class BitUtils {
    public static int hammingWeight(int n) {
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
function hammingWeight(n) {
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
}
```
````

#### Step-by-Step Example

For `n = 11` (binary: `1011`):

```
Iteration 1: n = 11 (1011), n & 1 = 1, count = 1, n = 5 (0101)
Iteration 2: n = 5  (0101), n & 1 = 1, count = 2, n = 2 (0010)
Iteration 3: n = 2  (0010), n & 1 = 0, count = 2, n = 1 (0001)
Iteration 4: n = 1  (0001), n & 1 = 1, count = 3, n = 0 (0000)
Result: 3 ✓
```

---

### Approach 2: Brian Kernighan's Algorithm (Optimal) ⭐

This is the most efficient approach that minimizes the number of operations by leveraging the `n & (n - 1)` trick. It only iterates as many times as there are set bits.

#### Algorithm

1. Initialize a counter to 0
2. While the number is not 0:
   - Increment the counter (we found a set bit)
   - Use `n & (n - 1)` to remove the least significant set bit
3. Return the counter

#### Why This Approach is Optimal

- **Time Complexity**: O(k) where k is the number of set bits
- **Space Complexity**: O(1) - only uses a counter variable
- **Best Case**: O(1) when n is a power of 2 (only 1 iteration)
- **Worst Case**: O(1) for fixed-width integers (at most 32 iterations)

#### Implementation

````carousel
```python
def hamming_weight(n: int) -> int:
    """
    Count the number of set bits using Brian Kernighan's algorithm.
    This is the optimal approach with O(k) time complexity.
    
    Args:
        n: 32-bit unsigned integer
        
    Returns:
        Count of bits set to 1
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

int hammingWeight(uint32_t n) {
    int count = 0;
    
    // Keep removing the least significant 1 bit
    while (n) {
        count++;
        n &= (n - 1);  // Remove the least significant 1 bit
    }
    
    return count;
}
```
<!-- slide -->
```java
public class BitUtils {
    public static int hammingWeight(int n) {
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
function hammingWeight(n) {
    let count = 0;
    
    // Keep removing the least significant 1 bit
    while (n !== 0) {
        count++;
        n &= (n - 1);  // Remove the least significant 1 bit
    }
    
    return count;
}
```
````

#### Step-by-Step Example

For `n = 11` (binary: `1011`):

```
Iteration 1: n = 11 (1011), count = 1, n = 11 & 10 = 10 (1010)
Iteration 2: n = 10 (1010), count = 2, n = 10 & 9 = 8  (1000)
Iteration 3: n = 8  (1000), count = 3, n = 8 & 7 = 0  (0000)
Result: 3 ✓
```

---

### Approach 3: Built-in Functions (Language-Specific)

Many programming languages provide built-in functions for counting set bits, which are typically highly optimized.

#### Implementation

````carousel
```python
def hamming_weight(n: int) -> int:
    """
    Count the number of set bits using Python's built-in bin() function.
    
    Args:
        n: 32-bit unsigned integer
        
    Returns:
        Count of bits set to 1
    """
    # Convert to binary string and count '1' characters
    return bin(n).count('1')

# Alternative using bit_count() (Python 3.8+)
def hamming_weight_builtin(n: int) -> int:
    """Use Python's built-in bit_count() method."""
    return n.bit_count()
```
<!-- slide -->
```cpp
#include <cstdint>
using namespace std;

int hammingWeight(uint32_t n) {
    // Use GCC/Clang built-in function
    return __builtin_popcount(n);
}

// For 64-bit integers
int hammingWeight64(uint64_t n) {
    return __builtin_popcountll(n);
}
```
<!-- slide -->
```java
public class BitUtils {
    public static int hammingWeight(int n) {
        // Use Java's built-in bitCount() method
        return Integer.bitCount(n);
    }
    
    public static long hammingWeight(long n) {
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
function hammingWeight(n) {
    // Convert to binary string and count '1' characters
    return n.toString(2).split('1').length - 1;
}

// Alternative using typed array for 32-bit interpretation
function hammingWeight32(n) {
    // Use DataView for reliable 32-bit unsigned interpretation
    const buffer = new ArrayBuffer(4);
    const view = new DataView(buffer);
    view.setUint32(0, n, true);
    let count = 0;
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < 4; i++) {
        count += bitCountTable[bytes[i]];
    }
    return count;
}

// Precomputed lookup table for 8-bit values
const bitCountTable = [
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
```
````

---

### Approach 4: Lookup Table (Precomputation)

For maximum performance when counting bits frequently, use a precomputed lookup table. This approach breaks the number into chunks and looks up their bit counts.

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


# Alternative: Singleton instance
_hammer_instance = HammingWeight()

def hamming_weight(n: int) -> int:
    """Convenience function using singleton instance."""
    return _hammer_instance.count(n)
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
    
    int count64(uint64_t n) const {
        return count(static_cast<uint32_t>(n)) +
               count(static_cast<uint32_t>(n >> 32));
    }
};

// Initialize static table
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
    
    public static int count(long n) {
        return count((int) n) +
               count((int) (n >> 32));
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

---

## Complexity Analysis

### Comparison of All Approaches

| Approach | Time Complexity | Space Complexity | Best For |
|----------|-----------------|------------------|----------|
| **Right Shift** | O(32) = O(1) | O(1) | Simplicity, readability |
| **Brian Kernighan** | O(k) where k = popcount(n) | O(1) | ✅ **Optimal for sparse bits** |
| **Built-in Functions** | O(1) | O(1) | Quick solutions, production code |
| **Lookup Table** | O(1) | O(256) = O(1) | **High-frequency calls** |

### When to Use Each Approach

1. **Right Shift**: When you need to process all bits (e.g., find specific bit patterns)
2. **Brian Kernighan**: When you want optimal performance without built-ins
3. **Built-in Functions**: When available (recommended for production)
4. **Lookup Table**: When counting bits frequently in performance-critical code

---

## Edge Cases and Common Pitfalls

### Edge Cases to Consider

| Input | Binary Representation | Expected Output | Notes |
|-------|----------------------|-----------------|-------|
| `n = 0` | `0` | `0` | No set bits |
| `n = 1` | `1` | `1` | Single set bit |
| `n = 2^31` | `100...0` (bit 31) | `1` | Highest bit set |
| `n = 2^32 - 1` | `111...1` (32 bits) | `32` | All bits set |
| `n = 255` | `11111111` | `8` | Full byte |
| `n = 15` | `1111` | `4` | Last 4 bits set |

### Common Mistakes to Avoid

#### Mistake 1: Modifying Original Number
```python
# Wrong - n is modified
while n:
    if n & 1:
        count += 1
    n >>= 1  # This changes n
```

**Solution**: Work on a copy if original needs to be preserved:
```python
# Correct - work on a copy
temp = n
while temp:
    if temp & 1:
        count += 1
    temp >>= 1
```

#### Mistake 2: Infinite Loop with Unsigned Integers
```cpp
// In C++, be careful with signed integers for right shift
int n = -1;
while (n) {  // -1 is never 0 in two's complement!
    n >>= 1;  // Arithmetic shift keeps sign bit
}
```

**Solution**: Use unsigned integer types:
```cpp
// Correct - use unsigned
uint32_t n = static_cast<uint32_t>(-1);
while (n) {
    n >>= 1;
}
```

#### Mistake 3: Not Handling All Bits
```python
# Wrong - may miss leading zeros
while n:
    if n & 1:
        count += 1
    n >>= 1
# For n = 0, count = 0 (correct)
# But for n with leading zeros, we only check significant bits
```

**Solution**: Use fixed-width loop for 32-bit integers:
```python
# Correct - check all 32 bits
for _ in range(32):
    if n & 1:
        count += 1
    n >>= 1
```

---

## Real-World Applications

### 1. Cryptography
- **Hash Functions**: Analyzing distribution of set bits in hash outputs
- **Key Generation**: Ensuring randomness in cryptographic keys
- **Parity Checking**: Detecting errors in encrypted data

### 2. Error Detection/Correction
- **Hamming Codes**: Error-correcting codes that use Hamming weight
- **CRC Checksums**: Cyclic redundancy checks for data integrity
- **Parity Bits**: Detecting single-bit errors in transmission

### 3. Computer Graphics
- **Pixel Operations**: Counting bits for color channel manipulation
- **Mipmapping**: Level-of-detail calculations
- **Anti-aliasing**: Sample counting techniques

### 4. Database Systems
- **Index Optimization**: Bitmap indexes use bit counting for queries
- **Bloom Filters**: Counting hash collisions
- **Query Optimization**: Cardinality estimation

### 5. Network Programming
- **Packet Validation**: Checksum verification
- **Protocol Analysis**: Bit field interpretation
- **Routing Tables**: Prefix matching algorithms

---

## Related Problems

### Same Pattern (Bit Counting)

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/) | 191 | Easy | Count 1s in 32-bit integer |
| [Reverse Bits](https://leetcode.com/problems/reverse-bits/) | 190 | Easy | Reverse bits of 32-bit integer |
| [Counting Bits](https://leetcode.com/problems/counting-bits/) | 338 | Easy | Count bits for all numbers 0 to n |
| [Power of Two](https://leetcode.com/problems/power-of-two/) | 231 | Easy | Check if number is power of 2 |

### Similar Concepts

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Single Number](https://leetcode.com/problems/single-number/) | 136 | Easy | Find element appearing once (XOR-based) |
| [Single Number II](https://leetcode.com/problems/single-number-ii/) | 137 | Medium | Elements appear 3 times except one |
| [Missing Number](https://leetcode.com/problems/missing-number/) | 268 | Easy | XOR-based solution |
| [Total Hamming Distance](https://leetcode.com/problems/total-hamming-distance/) | 477 | Medium | Sum of Hamming distances for all pairs |
| [Bitwise AND of Numbers Range](https://leetcode.com/problems/bitwise-and-of-numbers-range/) | 201 | Medium | Bitwise AND of range |
| [Sum of Two Integers](https://leetcode.com/problems/sum-of-two-integers/) | 371 | Medium | Add without + or - operators |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[Number of 1 Bits - NeetCode](https://www.youtube.com/watch?v=5Km3ut9o_2s)**
   - Excellent visual explanation of bit manipulation
   - Step-by-step walkthrough
   - Part of popular NeetCode playlist

2. **[Number of 1 Bits - William Lin](https://www.youtube.com/watch?v=1zH7K0Jo5kI)**
   - Clean and concise explanation
   - Multiple approaches covered
   - Great for interview preparation

3. **[Brian Kernighan's Algorithm - CodeBroke](https://www.youtube.com/watch?v=QRJ8S4qWq6Q)**
   - Deep dive into the optimal algorithm
   - Visual demonstrations
   - Beginner-friendly

4. **[Bit Manipulation Fundamentals - CodeBroke](https://www.youtube.com/watch?v=7jkVg4gM-qA)**
   - Comprehensive bit manipulation tutorial
   - Covers all basic operations
   - Includes practice problems

### Additional Resources

- **[Brian Kernighan's Algorithm - Wikipedia](https://en.wikipedia.org/wiki/Brian_Kernighan%27s_algorithm)** - Theoretical background
- **[Bitwise Operations - GeeksforGeeks](https://www.geeksforgeeks.org/bitwise-operators-c-cpp/)** - Language-specific examples
- **[LeetCode Discuss](https://leetcode.com/problems/number-of-1-bits/discuss/)** - Community solutions and tips

---

## Summary

The **Bitwise AND - Counting Set Bits** pattern is a fundamental technique in bit manipulation that enables efficient counting of set bits (1s) in a binary number. The key insights are:

1. **Brian Kernighan's Algorithm**: `n & (n - 1)` removes the least significant 1 bit efficiently
2. **Right Shift Approach**: Check each bit by shifting right and testing with `n & 1`
3. **Optimal Performance**: O(k) time where k is the number of set bits
4. **Minimal Space**: Only constant extra space is needed
5. **Universal Application**: Works with any integer representation

This pattern serves as a foundation for understanding bit manipulation, which is essential for many advanced algorithms in competitive programming, technical interviews, and real-world applications.

---

## Pattern Tags

`bitwise` `hamming-weight` `population-count` `bit-counting` `interview` `fundamentals`
