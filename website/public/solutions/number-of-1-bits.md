# Number of 1 Bits

## Problem Description

Write a function that takes an unsigned integer and returns the number of '1' bits it has (also known as the **Hamming weight**).

This is a classic bit manipulation problem that tests your understanding of binary representation and bitwise operations.

---

## Examples

### Example 1

**Input:**
```python
n = 11
```

**Output:**
```python
3
```

**Explanation:** The binary representation of 11 is `1011`, which has three '1' bits.

### Example 2

**Input:**
```python
n = 128
```

**Output:**
```python
1
```

**Explanation:** The binary representation of 128 is `10000000`, which has one '1' bit.

### Example 3

**Input:**
```python
n = 2147483645
```

**Output:**
```python
30
```

**Explanation:** The binary representation of 2147483645 is `1111111111111111111111111111101`, which has thirty '1' bits.

---

## Constraints

- The input is a 32-bit unsigned integer.
- `0 <= n <= 2^32 - 1`

---

## Intuition

The key insight is that every integer can be represented in binary, and each bit can be either 0 or 1. To count the number of 1s:

1. **Check the least significant bit (LSB)**: The LSB tells us if the number is odd (1) or even (0).
2. **Shift right**: After checking the LSB, we shift the number right to examine the next bit.
3. **Repeat**: Continue until all bits have been examined (i.e., the number becomes 0).

This approach works because each right shift operation effectively divides the number by 2, and we stop when the number reaches 0.

---

## Multiple Approaches

### Approach 1: Brute Force - Check Each Bit

This is the most straightforward approach. We check each bit of the number by:
1. Using bitwise AND with 1 to isolate the LSB
2. Shifting the number right by 1
3. Repeating for all 32 bits

**Code:**
```python
class Solution:
    def hammingWeight(self, n: int) -> int:
        """
        Count the number of '1' bits in the binary representation of n.
        
        Time Complexity: O(32) = O(1) - Fixed 32 iterations
        Space Complexity: O(1) - Only using a few variables
        """
        count = 0
        for _ in range(32):
            # Check if the least significant bit is 1
            count += n & 1
            # Right shift to move to the next bit
            n >>= 1
        return count
```

**Explanation:**
- We iterate exactly 32 times (once for each bit in a 32-bit integer)
- `n & 1` gives us the LSB (0 or 1), which we add to our count
- `n >>= 1` shifts all bits right by 1 position

---

### Approach 2: Optimize by Stopping Early

We can improve the loop termination by stopping when `n` becomes 0, as all higher bits are guaranteed to be 0.

**Code:**
```python
class Solution:
    def hammingWeight(self, n: int) -> int:
        """
        Count the number of '1' bits in the binary representation of n.
        
        Time Complexity: O(k) where k is the number of bits (at most 32)
        Space Complexity: O(1) - Only using a few variables
        """
        count = 0
        while n:
            count += n & 1
            n >>= 1
        return count
```

**Explanation:**
- We only iterate while `n` is not zero
- This means fewer iterations for smaller numbers (e.g., n=1 only needs 1 iteration)
- The time complexity is still O(1) for practical purposes since integers are fixed-size

---

### Approach 3: Brian Kernighan's Algorithm (Most Efficient)

This algorithm takes advantage of the fact that `n & (n-1)` removes the lowest set bit from `n`. We can count set bits by repeatedly clearing the lowest set bit until `n` becomes 0.

**Code:**
```python
class Solution:
    def hammingWeight(self, n: int) -> int:
        """
        Count the number of '1' bits using Brian Kernighan's Algorithm.
        
        Time Complexity: O(k) where k is the number of set bits (at most 32)
        Space Complexity: O(1) - Only using a few variables
        
        This is more efficient than checking all bits when n has few set bits.
        """
        count = 0
        while n:
            n &= n - 1  # Clear the lowest set bit
            count += 1
        return count
```

**How it works:**
- `n - 1` flips all the bits after the rightmost set bit (including it)
- `n & (n-1)` clears the rightmost set bit
- Each iteration removes one set bit, so we only iterate as many times as there are 1s

**Example:**
```
n = 12 (binary: 1100)
n & (n-1) = 12 & 11 = 8 (binary: 1000) - clears the lowest set bit
n & (n-1) = 8 & 7 = 0 (binary: 0000) - clears the next set bit
Total iterations: 2 (which equals the number of set bits)
```

---

### Approach 4: Using Built-in Functions (Python)

Python provides built-in functions that can count set bits efficiently.

**Code:**
```python
class Solution:
    def hammingWeight(self, n: int) -> int:
        """
        Count the number of '1' bits using Python's built-in functions.
        
        Time Complexity: O(1) - Built-in operations are optimized in C
        Space Complexity: O(1)
        """
        # Method 1: Using bin() - convert to binary string and count '1's
        return bin(n).count('1')
        
        # Method 2: Using bit_count() (Python 3.8+)
        # return n.bit_count()
```

**Explanation:**
- `bin(n)` converts the integer to a binary string (e.g., `bin(5)` returns `'0b101'`)
- `.count('1')` counts the number of '1' characters
- `bit_count()` is a Python 3.8+ method that directly counts set bits (faster)

---

### Approach 5: Lookup Table (For Multiple Queries)

If you need to count bits for many numbers, you can precompute a lookup table for all 8-bit values (0-255) and then use it to count bits in 32-bit integers.

**Code:**
```python
class Solution:
    def hammingWeight(self, n: int) -> int:
        """
        Count the number of '1' bits using a lookup table.
        
        This approach is efficient when counting bits for many numbers,
        as the lookup table is computed once and reused.
        
        Time Complexity: O(1) - 4 lookups for 32-bit integer
        Space Complexity: O(256) for the lookup table
        """
        # Precomputed lookup table for 8-bit values (0-255)
        lookup = [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4,
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
                  4, 5, 5, 6, 5, 6, 6, 7, 5, 6, 6, 7, 6, 7, 7, 8]
        
        return (lookup[n & 0xff] + 
                lookup[(n >> 8) & 0xff] + 
                lookup[(n >> 16) & 0xff] + 
                lookup[(n >> 24) & 0xff])
```

**Explanation:**
- We break the 32-bit integer into four 8-bit chunks
- Each chunk is used as an index into the lookup table
- The table stores the count of set bits for each possible 8-bit value

---

## Complexity Analysis Comparison

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|-----------------|------------------|---------------|
| Brute Force | O(32) = O(1) | O(1) | Simple solution, always checks all bits |
| Stop Early | O(k) ≤ O(32) | O(1) | Most practical, stops at first zero |
| Brian Kernighan | O(k) ≤ O(32) | O(1) | Fewest iterations when few set bits |
| Built-in Functions | O(1) | O(1) | Quick implementation in Python |
| Lookup Table | O(1) | O(256) | Many queries, batch processing |

Where k = number of set bits (Hamming weight)

---

## Related Problems

1. **Counting Bits** (LeetCode 338) - Return an array of bit counts for all numbers from 0 to n
2. **Total Hamming Distance** (LeetCode 477) - Calculate the total Hamming distance for all pairs in an array
3. **Single Number** (LeetCode 136) - Find the element that appears once (uses XOR and bit counting)
4. **Single Number II** (LeetCode 137) - Find the element that appears once where others appear three times
5. **Reverse Bits** (LeetCode 190) - Reverse the bits of a 32-bit integer
6. **Power of Two** (LeetCode 231) - Check if a number is a power of two (uses bit counting)

---

## Video Tutorial Links

1. [Number of 1 Bits - LeetCode 191 - Full Explanation](https://www.youtube.com/watch?v=1L3b23G2pF0)
2. [Brian Kernighan's Algorithm Explained](https://www.youtube.com/watch?v=uwV4L6e7qHQ)
3. [Bit Manipulation Masterclass](https://www.youtube.com/watch?v=6TcLqR_4u88)
4. [Hamming Weight and Bit Counting](https://www.youtube.com/watch?v=6F3KcmHplHQ)

---

## Follow-up Questions

1. **Follow up 1:** If this function is called many times, how would you optimize it?
   
   **Answer:** Use Brian Kernighan's algorithm (Approach 3) for better average performance when the number has few set bits. Alternatively, use a lookup table (Approach 5) for O(1) performance per query.

2. **Follow up 2:** How would you count the number of set bits for an array of numbers?
   
   **Answer:** Iterate through the array and apply the bit counting function to each element. For better performance, use the lookup table approach which is O(n) for n numbers.

3. **Follow up 3:** How do you handle negative numbers in this problem?
   
   **Answer:** In Python, integers have arbitrary precision and use two's complement representation for negative numbers. Use `n & 0xFFFFFFFF` to get the 32-bit representation first, then apply the bit counting algorithm.

4. **Follow up 4:** How does the Hamming weight relate to the Hamming distance?
   
   **Answer:** The Hamming distance between two numbers is the number of positions where their bits differ, which equals the Hamming weight of their XOR. For example: `hamming_distance(a, b) = hamming_weight(a XOR b)`.

5. **Follow up 5:** What is the relationship between the number of set bits and the number of trailing zeros?
   
   **Answer:** There's no direct relationship, but both can be computed using bit manipulation. The number of trailing zeros can be found using `n & -n` (isolates the lowest set bit).

