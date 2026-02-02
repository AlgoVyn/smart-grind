# Number of 1 Bits

## Problem Description

Write a function that takes an integer input and returns the number of '1' bits (also known as the Hamming weight) in its binary representation.

This is **LeetCode Problem #191** and is classified as an Easy difficulty problem. It is one of the most fundamental problems for understanding bitwise operations and is frequently asked in technical interviews at companies like Google, Amazon, Meta, and Apple.

### Detailed Problem Statement

You are given an unsigned integer `n` where:
- You need to count how many bits are set to `1` in the binary representation of `n`
- The binary representation is in the form of a 32-bit unsigned integer
- The task is to return the count of set bits (1s)

### Key Constraints

| Constraint | Description | Importance |
|------------|-------------|------------|
| `0 <= n < 2^32` | Input range | 32-bit unsigned integer |
| Can be 0 | Edge case | Must handle zero correctly |
| Must be efficient | Multiple approaches | Test bit manipulation skills |

---

## Examples

### Example 1:
```
Input: n = 11
Output: 3
Explanation: The binary representation of 11 is "1011", which has 3 set bits.
```

### Example 2:
```
Input: n = 128
Output: 1
Explanation: The binary representation of 128 is "10000000", which has 1 set bit.
```

### Example 3:
```
Input: n = 0
Output: 0
Explanation: The binary representation of 0 is "0", which has 0 set bits.
```

### Example 4:
```
Input: n = 2147483647 (2^31 - 1)
Output: 31
Explanation: The binary representation is 31 ones in a 32-bit number.
```

### Example 5:
```
Input: n = 255 (11111111)
Output: 8
Explanation: All 8 bits are set to 1.
```

### Example 6:
```
Input: n = 15 (00001111)
Output: 4
Explanation: The last 4 bits are set to 1.
```

---

## Intuition

The key insight behind solving this problem efficiently lies in understanding **bit manipulation** and how we can systematically check and remove bits from a number.

### Understanding Binary Representation

Every integer can be represented in binary as a sequence of bits. For example:
- `11` in binary is `1011` (bits from right to left: 1, 1, 0, 1)
- `128` in binary is `10000000` (bits from right to left: 0, 0, 0, 0, 0, 0, 0, 1)

### Key Operations

1. **AND with 1**: `n & 1` checks if the least significant bit is 1
2. **Right Shift**: `n >> 1` shifts all bits right, effectively dividing by 2
3. **n & (n - 1)**: Removes the least significant 1 bit from n

---

## Solution Approaches

### Approach 1: Right Shift and Check (Basic) ✅ Recommended

This is the most straightforward approach that checks each bit individually.

#### Algorithm

1. Initialize a counter to 0
2. While the number is not 0:
   - Check if the least significant bit is 1 using `n & 1`
   - If it is, increment the counter
   - Right shift the number by 1 bit
3. Return the counter

#### Implementation

````carousel
```python
class Solution:
    def hammingWeight(self, n: int) -> int:
        """
        Count the number of '1' bits in the binary representation of n.
        
        Args:
            n: 32-bit unsigned integer
            
        Returns:
            The count of bits set to 1
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
 * @param {number} n - a positive integer
 * @return {number}
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

#### Step-by-Step Example

For `n = 11` (binary: `1011`):

```
Step 1: n = 11, n & 1 = 1, count = 1, n = 5 (101)
Step 2: n = 5,  n & 1 = 1, count = 2, n = 2 (10)
Step 3: n = 2,  n & 1 = 0, count = 2, n = 1 (1)
Step 4: n = 1,  n & 1 = 1, count = 3, n = 0
Result: 3 ✓
```

---

### Approach 2: Brian Kernighan's Algorithm (Optimal) ⭐

This is the most efficient approach that minimizes the number of operations.

#### Algorithm

1. Initialize a counter to 0
2. While the number is not 0:
   - Increment the counter (we found a 1 bit)
   - Use `n & (n - 1)` to remove the least significant 1 bit
3. Return the counter

#### Why It Works

The operation `n & (n - 1)` always removes the least significant 1 bit:
- `n` has a binary form ending with `...1000...0`
- `n - 1` changes the least significant 1 to 0 and all zeros to its right to 1
- `n & (n - 1)` clears the least significant 1 bit

Example: `n = 12` (1100), `n - 1 = 11` (1011), `n & (n - 1) = 8` (1000)

#### Implementation

````carousel
```python
class Solution:
    def hammingWeight(self, n: int) -> int:
        """
        Count the number of '1' bits using Brian Kernighan's algorithm.
        
        Args:
            n: 32-bit unsigned integer
            
        Returns:
            The count of bits set to 1
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
 * @param {number} n - a positive integer
 * @return {number}
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

#### Step-by-Step Example

For `n = 11` (binary: `1011`):

```
Step 1: n = 11 (1011), count = 1, n = 11 & 10 = 10 (1010)
Step 2: n = 10 (1010), count = 2, n = 10 & 9 = 8 (1000)
Step 3: n = 8 (1000),  count = 3, n = 8 & 7 = 0
Result: 3 ✓
```

---

### Approach 3: Built-in Functions (Language-Specific)

Many languages provide built-in functions for counting set bits.

#### Implementation

````carousel
```python
class Solution:
    def hammingWeight(self, n: int) -> int:
        """
        Count the number of '1' bits using Python's built-in bin() function.
        
        Args:
            n: 32-bit unsigned integer
            
        Returns:
            The count of bits set to 1
        """
        # Convert to binary string and count '1' characters
        return bin(n).count('1')
```
<!-- slide -->
```cpp
#include <cstdint>
#include <bitset>
using namespace std;

class Solution {
public:
    int hammingWeight(uint32_t n) {
        // Use bitset to convert to binary and count ones
        return __builtin_popcount(n);
    }
};
```
<!-- slide -->
```java
public class Solution {
    public int hammingWeight(int n) {
        // Use Integer.bitCount() to count set bits
        return Integer.bitCount(n);
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number} n - a positive integer
 * @return {number}
 */
var hammingWeight = function(n) {
    // Convert to binary string and count '1' characters
    return n.toString(2).split('1').length - 1;
};
```
````

---

### Approach 4: Lookup Table (Precomputation)

For maximum performance when called frequently, use a precomputed lookup table.

#### Algorithm

1. Precompute a table of 16-bit values (0-65535) with their bit counts
2. Split the 32-bit number into four 16-bit chunks
3. Sum up the counts from the lookup table

#### Implementation

````carousel
```python
class Solution:
    def __init__(self):
        # Precompute lookup table for 8-bit values (0-255)
        self.lookup = [0] * 256
        for i in range(256):
            self.lookup[i] = (i & 1) + self.lookup[i >> 1] if i else 0
    
    def hammingWeight(self, n: int) -> int:
        """
        Count the number of '1' bits using a lookup table.
        
        Args:
            n: 32-bit unsigned integer
            
        Returns:
            The count of bits set to 1
        """
        # Extract bytes and sum up counts
        return (self.lookup[n & 0xff] +
                self.lookup[(n >> 8) & 0xff] +
                self.lookup[(n >> 16) & 0xff] +
                self.lookup[(n >> 24) & 0xff])
```
<!-- slide -->
```cpp
#include <cstdint>
using namespace std;

class Solution {
private:
    // Precomputed lookup table for 16-bit values
    static const int TABLE[256];
    
    static int initTable() {
        int table[256] = {0};
        for (int i = 0; i < 256; i++) {
            table[i] = (i & 1) + (i > 1 ? table[i >> 1] : 0);
        }
        return table[0];  // Just to avoid unused warning
    }
    
public:
    int hammingWeight(uint32_t n) {
        static bool initialized = initTable() == 0;
        (void)initialized;
        
        return TABLE[n & 0xff] +
               TABLE[(n >> 8) & 0xff] +
               TABLE[(n >> 16) & 0xff] +
               TABLE[(n >> 24) & 0xff];
    }
};

const int Solution::TABLE[256] = [] {
    int table[256] = {0};
    for (int i = 0; i < 256; i++) {
        table[i] = (i & 1) + table[i >> 1];
    }
    // Copy to static const array
    int result[256];
    for (int i = 0; i < 256; i++) {
        result[i] = table[i];
    }
    return result[0];  // Placeholder
}();
// Note: For simplicity, use __builtin_popcount in practice
```
<!-- slide -->
```java
public class Solution {
    // Precomputed lookup table for 16-bit values
    private static final int[] LOOKUP = new int[256];
    
    static {
        for (int i = 0; i < 256; i++) {
            LOOKUP[i] = (i & 1) + (i > 0 ? LOOKUP[i >> 1] : 0);
        }
    }
    
    public int hammingWeight(int n) {
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
 * @param {number} n - a positive integer
 * @return {number}
 */
var hammingWeight = function(n) {
    // Precomputed lookup table for 8-bit values
    const lookup = [
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
    
    return lookup[n & 0xff] +
           lookup[(n >> 8) & 0xff] +
           lookup[(n >> 16) & 0xff] +
           lookup[(n >> 24) & 0xff];
};
```
````

---

## Complexity Analysis

### Comparison of All Approaches

| Approach | Time Complexity | Space Complexity | Best For |
|----------|-----------------|------------------|----------|
| **Right Shift** | O(32) = O(1) | O(1) | Simplicity |
| **Brian Kernighan** | O(k) where k is number of 1s | O(1) | ✅ **Optimal** |
| **Built-in Functions** | O(1) | O(1) | Quick solutions |
| **Lookup Table** | O(1) | O(1) | High-performance scenarios |

### Deep Dive: Brian Kernighan's Algorithm

**Time Complexity: O(k)**
- Where k is the number of set bits in n
- In the worst case (all bits are 1), k = 32, so it's still O(1)
- In the best case (only one bit is 1), it's very fast

**Space Complexity: O(1)**
- Only a few integer variables are used
- No data structures that grow with input

### Why Brian Kernighan's Algorithm is Optimal

1. **Minimal Operations**: Only iterates as many times as there are 1 bits
2. **Constant Space**: No additional data structures needed
3. **Elegant Logic**: Simple and easy to understand
4. **Worst-case Fixed**: Maximum 32 iterations for 32-bit numbers

---

## Edge Cases and Common Pitfalls

### Edge Cases to Consider

1. **Zero Input**
   ```
   n = 0 → Output: 0
   ```
   The algorithm correctly handles this case.

2. **All Bits Set**
   ```
   n = 0xFFFFFFFF (4294967295) → Output: 32
   ```
   Works with the maximum 32-bit unsigned value.

3. **Single Bit Set**
   ```
   n = 1 → Output: 1
   n = 2147483648 → Output: 1
   ```
   Works with both low and high bit positions.

4. **Power of Two**
   ```
   n = 2^k → Output: 1
   ```
   Always returns 1 for powers of 2.

### Common Mistakes to Avoid

1. **Modifying Original Number**
   ```python
   # Wrong - modifying n may cause issues
   while n:
       if n & 1:
           count += 1
       n = n >> 1  # This modifies n
   ```
   - Solution: Work on a copy if original needs to be preserved

2. **Not Handling 32 Bits**
   ```python
   # Wrong - may miss leading zeros
   while n:
       if n & 1:
           count += 1
       n >>= 1
   # If n starts as 0, count is 0 (correct)
   # But if n has leading zeros, we still need to check all 32 bits
   ```
   - Solution: Use a fixed 32-bit loop or Brian Kernighan's algorithm

3. **Signed vs Unsigned**
   ```cpp
   // In C++, be careful with signed integers
   int n = -1;  // This is problematic for unsigned operations
   ```
   - Solution: Use unsigned integer types (uint32_t, uint64_t)

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Frequently asked in technical interviews
- **Companies**: Google, Amazon, Meta, Apple, Microsoft, Bloomberg
- **Difficulty**: Easy, but tests fundamental understanding of bitwise operations
- **Variations**: Leads to more complex bit manipulation problems

### Learning Outcomes

1. **Understanding Bitwise Operations**: Learn the powerful properties of AND, OR, NOT, and shifts
2. **Bit Manipulation Techniques**: Master techniques for checking and manipulating bits
3. **Algorithm Optimization**: Understand how to minimize operations using clever bit tricks
4. **Pattern Recognition**: Identify when bit manipulation is the right approach

---

## Related Problems

### Same Pattern (Bit Counting)

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Reverse Bits](https://leetcode.com/problems/reverse-bits/) | 190 | Easy | Reverse bits of a 32-bit integer |
| [Single Number](https://leetcode.com/problems/single-number/) | 136 | Easy | Find element appearing once |
| [Counting Bits](https://leetcode.com/problems/counting-bits/) | 338 | Easy | Count bits for all numbers from 0 to n |
| [Single Number II](https://leetcode.com/problems/single-number-ii/) | 137 | Medium | Elements appear 3 times except one |

### Similar Concepts

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Missing Number](https://leetcode.com/problems/missing-number/) | 268 | Easy | XOR-based solution |
| [Power of Two](https://leetcode.com/problems/power-of-two/) | 231 | Easy | Check if number is power of 2 |
| [Bitwise AND of Numbers Range](https://leetcode.com/problems/bitwise-and-of-numbers-range/) | 201 | Medium | Bitwise AND of range |
| [Sum of Two Integers](https://leetcode.com/problems/sum-of-two-integers/) | 371 | Medium | Add without + or - |

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

3. **[Brian Kernighan's Algorithm - CodeBroke](https://www.youtube.com/watch?v=RQr9cH5q-eM)**
   - Deep dive into the optimal algorithm
   - Visual demonstrations
   - Beginner-friendly

4. **[LeetCode Official Solution](https://www.youtube.com/watch?v=4PFBd1oOlMw)**
   - Official solution walkthrough
   - Best practices and edge cases

5. **[Bit Manipulation Fundamentals](https://www.youtube.com/watch?v=7jkVg4gM-qA)**
   - Comprehensive bit manipulation tutorial
   - Covers all basic operations

### Additional Resources

- **[Bitwise Operations - GeeksforGeeks](https://www.geeksforgeeks.org/bitwise-operators-c-cpp/)** - Language-specific examples
- **[Brian Kernighan's Algorithm - Wikipedia](https://en.wikipedia.org/wiki/Brian_Kernighan%27s_algorithm)** - Theoretical background
- **[LeetCode Discuss](https://leetcode.com/problems/number-of-1-bits/discuss/)** - Community solutions and tips

---

## Follow-up Questions

### Basic Level

1. **What is the time and space complexity of Brian Kernighan's algorithm?**
   - Time: O(k) where k is the number of set bits (worst case O(1) for 32-bit integers)
   - Space: O(1)

2. **How does the operation `n & (n - 1)` work?**
   - It clears the least significant 1 bit
   - This is because `n - 1` flips all bits from the least significant 1 onwards
   - ANDing with original n clears only that bit

3. **What is the difference between signed and unsigned integers in bit counting?**
   - For counting set bits, both work the same way
   - However, right shift behavior differs (sign extension vs. zero fill)

### Intermediate Level

4. **How would you count set bits for a 64-bit number?**
   - Same algorithms work, just loop more times or use 64-bit operations
   - Brian Kernighan's algorithm still has O(k) complexity

5. **What is the Hamming distance between two numbers?**
   - It's the number of positions where bits differ
   - Can be computed as `count_bits(n ^ m)` where ^ is XOR

6. **How does this relate to parity checking?**
   - Parity is 0 if even number of 1s, 1 if odd
   - Can be computed using XOR of all bits

### Advanced Level

7. **How would you count set bits for all numbers from 1 to n efficiently?**

   This is LeetCode problem "Counting Bits" (#338). There are several approaches:

   **Dynamic Programming (DP) Approach:**
   - Use the relationship: `count_bits[i] = count_bits[i >> 1] + (i & 1)`
   - `i >> 1` removes the least significant bit
   - `i & 1` checks if the least significant bit is 1
   - This runs in O(n) time and O(n) space

   **Algorithm:**
   ```
   For i from 1 to n:
       count_bits[i] = count_bits[i >> 1] + (i & 1)
   ```

   **Example for n = 5:**
   - `i = 1 (001)`: count_bits[0] + 1 = 0 + 1 = 1
   - `i = 2 (010)`: count_bits[1] + 0 = 1 + 0 = 1
   - `i = 3 (011)`: count_bits[1] + 1 = 1 + 1 = 2
   - `i = 4 (100)`: count_bits[2] + 0 = 1 + 0 = 1
   - `i = 5 (101)`: count_bits[2] + 1 = 1 + 1 = 2
   - Result: [0, 1, 1, 2, 1, 2]

   **Alternate Approach using Brian Kernighan:**
   - For each number, use `i & (i - 1)` to clear the lowest set bit
   - `count_bits[i] = count_bits[i & (i - 1)] + 1`
   - This works because clearing the lowest set bit gives a smaller number we've already computed

   **Time Complexity:** O(n) where n is the input number
   **Space Complexity:** O(n) for storing all results

8. **What is the relationship between this problem and the Collatz conjecture?**

   The Collatz conjecture (also known as the 3n+1 problem) and the "Number of 1 Bits" problem share several interesting connections:

   **Collatz Sequence Definition:**
   - Start with any positive integer n
   - If n is even: n = n / 2
   - If n is odd: n = 3n + 1
   - Repeat until you reach 1

   **Connection through Bit Operations:**
   - **Division by 2 (n / 2):** This is equivalent to right shift: `n >> 1`
   - **Checking even/odd:** This is equivalent to checking the least significant bit: `n & 1`
   - **3n + 1 computation:** `3n + 1 = (n << 1) + n + 1` which involves bit shifts

   **Bit-Level Analysis:**
   - When n is odd (LSB = 1), 3n + 1 is always even
   - This means after the odd step, the result always has at least one trailing zero
   - This explains why Collatz sequences often have multiple divisions by 2 in a row

   **Interesting Property:**
   - The number of times you can divide by 2 in a row is the number of trailing zeros
   - This is computed as: `trailing_zeros = n & -n` (isolates lowest set bit)
   - This is the same as the lowest power of 2 that divides n

   **Research Application:**
   - Bit manipulation techniques from this problem help analyze Collatz sequences
   - Understanding trailing zeros helps predict how long a sequence will stay even
   - Both problems require thinking in binary/bit-level terms

9. **How would you implement addition using only bitwise operations?**

   Adding two numbers using only bitwise operations is a fundamental technique that demonstrates how CPUs perform addition at the hardware level.

   **Half Adder Logic:**
   - **Sum (without carry):** `sum = a ^ b` (XOR gives 1 where bits differ)
   - **Carry:** `carry = a & b` (AND gives 1 where both bits are 1)

   **Full Adder (handling carry propagation):**
   ```
   sum = a ^ b ^ carry_in
   carry_out = (a & b) | (carry_in & (a ^ b))
   ```

   **Iterative Addition Algorithm:**
   ```
   function add(a, b):
       while b != 0:
           carry = a & b           # Calculate carry
           a = a ^ b               # Add without carry
           b = carry << 1          # Shift carry to next position
       return a
   ```

   **Step-by-Step Example: Add 5 (101) and 3 (011):**
   ```
   Iteration 1:
       a = 101 (5), b = 011 (3)
       carry = 101 & 011 = 001 (1)
       a = 101 ^ 011 = 110 (6)
       b = 001 << 1 = 010 (2)
   
   Iteration 2:
       a = 110 (6), b = 010 (2)
       carry = 110 & 010 = 010 (2)
       a = 110 ^ 010 = 100 (4)
       b = 010 << 1 = 100 (4)
   
   Iteration 3:
       a = 100 (4), b = 100 (4)
       carry = 100 & 100 = 100 (4)
       a = 100 ^ 100 = 000 (0)
       b = 100 << 1 = 1000 (8)
   
   Iteration 4:
       a = 000 (0), b = 1000 (8)
       carry = 000 & 1000 = 000 (0)
       a = 000 ^ 1000 = 1000 (8)
       b = 000 << 1 = 000 (0)
   
   Result: 8 (5 + 3 = 8) ✓
   ```

   **Time Complexity:** O(log(max(a, b))) - proportional to the number of bits
   **Space Complexity:** O(1)

   **Why It Works:**
   - The algorithm repeatedly:
     1. Adds the bits where there's no carry (XOR)
     2. Shifts the carry to the next higher bit
     3. Continues until there's no carry left
   - This mimics how addition works in binary at the hardware level

10. **What is the difference between Hamming weight and Hamming distance?**

    These are two fundamental concepts in information theory and coding theory, though they measure different things:

    **Hamming Weight:**
    - Definition: The number of non-zero symbols in a string
    - For binary: The number of 1 bits in a number
    - Formula: `hw(n) = count of bits where bit = 1`
    - Example: Hamming weight of 13 (1101) is 3
    - Range: 0 to word size (32 for 32-bit integers)

    **Hamming Distance:**
    - Definition: The number of positions at which the corresponding symbols are different
    - For binary: The number of bit positions where two numbers differ
    - Formula: `hd(a, b) = count of bits where bit_a != bit_b`
    - Relationship: `hd(a, b) = hw(a ^ b)`
    - Example: Distance between 13 (1101) and 10 (1010) is 3
      - 13 ^ 10 = 0111, hw(7) = 3
    - Range: 0 to word size

    **Key Differences:**
    | Aspect | Hamming Weight | Hamming Distance |
    |--------|---------------|------------------|
    | Operands | Single number | Two numbers |
    | Measures | Count of 1s | Count of differences |
    | Formula | hw(n) | hd(a, b) = hw(a ^ b) |
    | Range | 0 to word size | 0 to word size |

    **Applications of Hamming Distance:**
    - **Error Detection/Correction:** Measures how many bit errors occurred
    - **DNA Sequence Analysis:** Compares genetic sequences
    - **Spell Checkers:** Finds closest matching words
    - **Machine Learning:** K-Nearest Neighbors with Hamming distance
    - **Network Coding:** Detecting packet errors

    **Applications of Hamming Weight:**
    - **Cryptography:** Measuring randomness in keys
    - **Hash Functions:** Analyzing distribution
    - **Parity Checking:** Detecting odd/even number of errors
    - **Complexity Analysis:** Measuring population count in algorithms

    **Relationship to This Problem:**
    - The "Number of 1 Bits" problem is essentially computing Hamming weight
    - Hamming distance can be computed by first XORing two numbers, then computing Hamming weight
    - Both are fundamental operations in bit manipulation

    **Example Computation:**
    ```
    Number A: 13 = 0b1101 (Hamming weight = 3)
    Number B: 10 = 0b1010 (Hamming weight = 2)
    
    A ^ B = 0b0111 (Hamming weight = 3)
    Hamming Distance(A, B) = 3
    
    Verification:
    Position 0: 1 vs 0 (different) ✓
    Position 1: 0 vs 1 (different) ✓
    Position 2: 1 vs 0 (different) ✓
    Position 3: 1 vs 1 (same)
    Total differences: 3 ✓
    ```

### Practical Implementation Questions

11. **What if you need to count bits in a very large number (beyond 64 bits)?**
    - Use arbitrary precision libraries or custom big integer implementation
    - Brian Kernighan's algorithm still applies

12. **How would you test this solution?**
    - Test cases: 0, 1, max uint32, powers of 2, all bits set, random values

13. **What are the real-world applications of this pattern?**
    - Error detection/correction codes (Hamming codes)
    - Cryptography and hash functions
    - Data compression algorithms
    - Network protocol checksums

---

## Summary

The **Number of 1 Bits** problem is a classic example of using bitwise operations for an elegant and efficient solution. The key insights are:

1. **Brian Kernighan's Algorithm**: `n & (n - 1)` removes the least significant 1 bit efficiently
2. **Right Shift Approach**: Check each bit by shifting right and testing with `n & 1`
3. **Constant Time**: Both optimal approaches run in O(1) time for 32-bit integers
4. **Minimal Space**: Only constant extra space is needed
5. **Universal Application**: Works with any integer representation

The problem serves as a foundation for understanding bit manipulation, which is essential for many advanced algorithms in competitive programming and technical interviews.

---

## LeetCode Link

[Number of 1 Bits - LeetCode](https://leetcode.com/problems/number-of-1-bits/)
