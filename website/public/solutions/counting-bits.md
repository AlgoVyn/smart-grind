# Counting Bits

## Problem Description

Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` (0 <= i <= n), `ans[i]` is the number of 1's in the binary representation of `i`.

This is **LeetCode Problem #338** and is classified as an Easy difficulty problem. It is one of the most fundamental problems for understanding dynamic programming combined with bit manipulation, and is frequently asked in technical interviews at companies like Google, Amazon, Meta, and Apple.

### Detailed Problem Statement

You are given a non-negative integer `n` and you need to:
1. Compute the binary representation of each integer from 0 to n (inclusive)
2. Count the number of 1-bits (set bits) in each representation
3. Return an array where the index represents the number and the value represents the count of set bits

### Key Constraints

| Constraint | Description | Importance |
|------------|-------------|------------|
| `0 <= n <= 10^5` | Input range | Ensures O(n) solution is feasible |
| Time limit | Must be efficient | O(n) or better preferred |
| Return array size | n + 1 elements | Space complexity consideration |

---

## Examples

### Example 1:
```
Input: n = 2
Output: [0, 1, 1]

Binary representations:
  0 --> 0    (0 ones)
  1 --> 1    (1 one)
  2 --> 10   (1 one)
```

### Example 2:
```
Input: n = 5
Output: [0, 1, 1, 2, 1, 2]

Binary representations:
  0 --> 0      (0 ones)
  1 --> 1      (1 one)
  2 --> 10     (1 one)
  3 --> 11     (2 ones)
  4 --> 100    (1 one)
  5 --> 101    (2 ones)
```

### Example 3:
```
Input: n = 10
Output: [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2]

Binary representations:
  0 --> 0       (0 ones)
  1 --> 1       (1 one)
  2 --> 10      (1 one)
  3 --> 11      (2 ones)
  4 --> 100     (1 one)
  5 --> 101     (2 ones)
  6 --> 110     (2 ones)
  7 --> 111     (3 ones)
  8 --> 1000    (1 one)
  9 --> 1001    (2 ones)
 10 --> 1010    (2 ones)
```

### Visual Binary Table

| Number | Binary | Set Bits | ans[i] |
|--------|--------|----------|--------|
| 0 | 0000 | 0 | 0 |
| 1 | 0001 | 1 | 1 |
| 2 | 0010 | 1 | 1 |
| 3 | 0011 | 2 | 2 |
| 4 | 0100 | 1 | 1 |
| 5 | 0101 | 2 | 2 |
| 6 | 0110 | 2 | 2 |
| 7 | 0111 | 3 | 3 |
| 8 | 1000 | 1 | 1 |
| 9 | 1001 | 2 | 2 |
| 10 | 1010 | 2 | 2 |
| 11 | 1011 | 3 | 3 |
| 12 | 1100 | 2 | 2 |
| 13 | 1101 | 3 | 3 |
| 14 | 1110 | 3 | 3 |
| 15 | 1111 | 4 | 4 |

---

## Intuition

The key insight for solving this problem efficiently is recognizing the **relationship between consecutive numbers** in binary representation.

### Key Observation

For any integer `i`:
- **If i is even**: The binary representation of `i` is the same as `i // 2` with a 0 appended at the end (right shift)
- **If i is odd**: The binary representation of `i` is the same as `i // 2` with a 1 appended at the end

This means:
- **Even number**: `countBits(i) = countBits(i // 2)` (no new set bit added)
- **Odd number**: `countBits(i) = countBits(i // 2) + 1` (one new set bit added)

### Why This Works

When we right-shift a number by 1:
- We're essentially removing the least significant bit
- If the LSB was 0 (even), we remove a 0 → count stays the same
- If the LSB was 1 (odd), we remove a 1 → count decreases by 1

But since `i // 2` is always computed before `i`, we can use DP:
- `ans[i // 2]` is already computed when we're calculating `ans[i]`
- We just need to add `(i % 2)` to account for the LSB

### The "Aha!" Moment

```
i = 6 (binary: 110)
i // 2 = 3 (binary: 11)
ans[3] = 2
i % 2 = 0
ans[6] = ans[3] + 0 = 2 ✓

i = 7 (binary: 111)
i // 2 = 3 (binary: 11)
ans[3] = 2
i % 2 = 1
ans[7] = ans[3] + 1 = 3 ✓
```

---

## Solution Approaches

### Approach 1: Dynamic Programming with i // 2 (Optimal) ✅ Recommended

This is the optimal solution that achieves O(n) time complexity by leveraging the relationship between `i` and `i // 2`.

#### Algorithm

```python
from typing import List

class Solution:
    def countBits(self, n: int) -> List[int]:
        """
        Count the number of 1's in the binary representation for each number from 0 to n.
        
        Uses dynamic programming where:
        - ans[i] = ans[i // 2] + (i % 2)
        - ans[i // 2] is already computed since i // 2 < i
        
        Time Complexity: O(n)
        Space Complexity: O(n)
        """
        ans = [0] * (n + 1)  # ans[0] = 0 by default
        
        for i in range(1, n + 1):
            ans[i] = ans[i // 2] + (i % 2)
        
        return ans
```

#### Step-by-Step Example for n = 5

```
i = 1: ans[1] = ans[0] + 1 = 0 + 1 = 1
i = 2: ans[2] = ans[1] + 0 = 1 + 0 = 1
i = 3: ans[3] = ans[1] + 1 = 1 + 1 = 2
i = 4: ans[4] = ans[2] + 0 = 1 + 0 = 1
i = 5: ans[5] = ans[2] + 1 = 1 + 1 = 2

Result: [0, 1, 1, 2, 1, 2] ✓
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| **Time** | O(n) - Single pass through 1 to n |
| **Space** | O(n) - Result array of size n + 1 |

---

### Approach 2: Dynamic Programming with Lowest Set Bit (i & (i-1))

This approach uses Brian Kernighan's insight that `i & (i-1)` removes the lowest set bit from `i`.

#### Algorithm

```python
from typing import List

class Solution:
    def countBits(self, n: int) -> List[int]:
        """
        Count bits using the relationship:
        bits(i) = bits(i & (i-1)) + 1
        
        This works because i & (i-1) removes the lowest set bit.
        
        Time Complexity: O(n)
        Space Complexity: O(n)
        """
        ans = [0] * (n + 1)
        
        for i in range(1, n + 1):
            # i & (i-1) removes the lowest set bit
            ans[i] = ans[i & (i - 1)] + 1
        
        return ans
```

#### How It Works

```
i = 7 (binary: 111)
i & (i-1) = 7 & 6 = 6 (binary: 110)
ans[6] = 2
ans[7] = ans[6] + 1 = 2 + 1 = 3 ✓

i = 5 (binary: 101)
i & (i-1) = 5 & 4 = 4 (binary: 100)
ans[4] = 1
ans[5] = ans[4] + 1 = 1 + 1 = 2 ✓
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| **Time** | O(n) - Single pass through 1 to n |
| **Space** | O(n) - Result array of size n + 1 |

---

### Approach 3: Dynamic Programming with Lowest One Bit (i & -i)

This approach isolates the lowest set bit using `i & -i` and adds 1 to the count of `i - lowest_bit`.

#### Algorithm

```python
from typing import List

class Solution:
    def countBits(self, n: int) -> List[int]:
        """
        Count bits using the relationship:
        bits(i) = bits(i - (i & -i)) + 1
        
        i & -i isolates the lowest set bit (works due to two's complement).
        
        Time Complexity: O(n)
        Space Complexity: O(n)
        """
        ans = [0] * (n + 1)
        
        for i in range(1, n + 1):
            # i & -i gives the lowest set bit value
            lowest_bit = i & -i
            ans[i] = ans[i - lowest_bit] + 1
        
        return ans
```

#### How It Works

```
i = 6 (binary: 110)
lowest_bit = 6 & -6 = 2 (binary: 010)
i - lowest_bit = 6 - 2 = 4 (binary: 100)
ans[4] = 1
ans[6] = ans[4] + 1 = 1 + 1 = 2 ✓

i = 7 (binary: 111)
lowest_bit = 7 & -7 = 1 (binary: 001)
i - lowest_bit = 7 - 1 = 6 (binary: 110)
ans[6] = 2
ans[7] = ans[6] + 1 = 2 + 1 = 3 ✓
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| **Time** | O(n) - Single pass through 1 to n |
| **Space** | O(n) - Result array of size n + 1 |

---

### Approach 4: Using Built-in bit_count() (Python 3.8+)

Python provides a built-in method `int.bit_count()` that directly counts set bits.

#### Algorithm

```python
from typing import List

class Solution:
    def countBits(self, n: int) -> List[int]:
        """
        Count bits using Python's built-in bit_count() method.
        
        This approach is the most concise and leverages optimized C code.
        
        Time Complexity: O(n)
        Space Complexity: O(n)
        """
        return [i.bit_count() for i in range(n + 1)]
```

#### Explanation
- `i.bit_count()` is a Python 3.8+ method that returns the number of ones in the binary representation
- It's implemented in C, making it very fast
- The list comprehension creates the result array in one line

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| **Time** | O(n) - Each bit_count() call is O(1) for fixed-size integers |
| **Space** | O(n) - Result array of size n + 1 |

---

### Approach 5: Lookup Table (For Maximum Performance)

This approach precomputes a lookup table for 8-bit values and uses it to count bits quickly.

#### Algorithm

```python
from typing import List

class Solution:
    def countBits(self, n: int) -> List[int]:
        """
        Count bits using a precomputed lookup table.
        
        Breaks each number into 8-bit chunks and uses table lookup.
        Optimal when counting bits for very many numbers.
        
        Time Complexity: O(n)
        Space Complexity: O(n) + O(256) for lookup table
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
        
        ans = [0] * (n + 1)
        
        # For small n, use direct lookup
        if n <= 255:
            for i in range(n + 1):
                ans[i] = lookup[i]
        else:
            # For larger n, use 4-byte decomposition
            for i in range(n + 1):
                ans[i] = (lookup[i & 0xff] + 
                         lookup[(i >> 8) & 0xff] + 
                         lookup[(i >> 16) & 0xff] + 
                         lookup[(i >> 24) & 0xff])
        
        return ans
```

#### How It Works
- The lookup table stores the count of set bits for each 8-bit value (0-255)
- For numbers up to 255, we can directly index the table
- For larger numbers, we break them into 4 bytes and sum the results

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| **Time** | O(n) - Single pass, constant time per element |
| **Space** | O(n) + O(256) - Result array + lookup table |

---

### Approach 6: Dynamic Programming with Most Significant Bit (MSB)

This approach uses the highest power of 2 (most significant bit) to compute the bit count. The insight is that any number can be expressed as the MSB plus the remainder.

#### Algorithm

```python
from typing import List

class Solution:
    def countBits(self, n: int) -> List[int]:
        """
        Count bits using the Most Significant Bit (MSB) approach.
        
        The relationship is:
        bits(i) = 1 + bits(i - highest_power_of_2)
        
        Where highest_power_of_2 is the largest power of 2 <= i.
        
        Time Complexity: O(n)
        Space Complexity: O(n)
        """
        ans = [0] * (n + 1)
        
        # Track the current highest power of 2
        # msb will be the highest power of 2 <= i
        msb = 1
        
        for i in range(1, n + 1):
            # Check if we've entered a new power of 2 range
            # When i is exactly a power of 2 (i == msb * 2), update msb
            if i == msb * 2:
                msb *= 2
            
            # ans[i] = 1 (for the MSB) + ans[i - msb] (for the remainder)
            ans[i] = ans[i - msb] + 1
        
        return ans
```

#### How It Works

```
i = 1: msb = 1, ans[1] = ans[0] + 1 = 0 + 1 = 1
i = 2: msb = 2, ans[2] = ans[0] + 1 = 0 + 1 = 1
i = 3: msb = 2, ans[3] = ans[1] + 1 = 1 + 1 = 2
i = 4: msb = 4, ans[4] = ans[0] + 1 = 0 + 1 = 1
i = 5: msb = 4, ans[5] = ans[1] + 1 = 1 + 1 = 2
i = 6: msb = 4, ans[6] = ans[2] + 1 = 1 + 1 = 2
i = 7: msb = 4, ans[7] = ans[3] + 1 = 2 + 1 = 3
i = 8: msb = 8, ans[8] = ans[0] + 1 = 0 + 1 = 1

Result: [0, 1, 1, 2, 1, 2, 2, 3, 1] ✓
```

#### Why This Works

Every number `i` can be written as:
```
i = MSB(i) + remainder
```

Where `MSB(i)` is the highest power of 2 less than or equal to `i`, and `remainder = i - MSB(i)`.

The number of set bits in `i` is:
```
bits(i) = 1 (for the MSB) + bits(remainder)
```

This works because the MSB contributes exactly one set bit, and the remainder is always smaller than the MSB (so its bit count is already computed).

#### Finding the MSB Efficiently

There are multiple ways to find the highest power of 2:

**Method 1: Using bit shifting (as shown above)**
```python
# Keep doubling msb until it reaches or exceeds i
if i == msb * 2:
    msb *= 2
```

**Method 2: Using bit length**
```python
msb = 1 << (i.bit_length() - 1)
```

**Method 3: Using highest one bit**
```python
msb = 1 << (31 - i.bit_length())
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| **Time** | O(n) - Single pass through 1 to n |
| **Space** | O(n) - Result array of size n + 1 |

---

### Approach 7: MSB Using bit_length() (Python Optimized)

This is an optimized version of the MSB approach using Python's built-in `bit_length()` method.

#### Algorithm

```python
from typing import List

class Solution:
    def countBits(self, n: int) -> List[int]:
        """
        Count bits using MSB approach with Python's bit_length().
        
        bit_length() returns the number of bits needed to represent i.
        MSB = 1 << (bit_length - 1)
        
        Time Complexity: O(n)
        Space Complexity: O(n)
        """
        ans = [0] * (n + 1)
        
        for i in range(1, n + 1):
            # bit_length() gives the position of the highest set bit (1-indexed)
            # MSB = 1 << (bit_length - 1)
            msb = 1 << (i.bit_length() - 1)
            ans[i] = ans[i - msb] + 1
        
        return ans
```

#### How It Works

```
i = 5: bit_length() = 3, msb = 1 << 2 = 4
       ans[5] = ans[5 - 4] + 1 = ans[1] + 1 = 1 + 1 = 2 ✓

i = 7: bit_length() = 3, msb = 1 << 2 = 4
       ans[7] = ans[7 - 4] + 1 = ans[3] + 1 = 2 + 1 = 3 ✓

i = 8: bit_length() = 4, msb = 1 << 3 = 8
       ans[8] = ans[8 - 8] + 1 = ans[0] + 1 = 0 + 1 = 1 ✓
```

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| **Time** | O(n) - Single pass with O(1) bit_length() per iteration |
| **Space** | O(n) - Result array of size n + 1 |

---

## Complexity Analysis

### Comparison of All Approaches

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|-----------------|------------------|---------------|
| **DP with i // 2** | O(n) | O(n) | ✅ **General case** - Recommended |
| **DP with i & (i-1)** | O(n) | O(n) | When Brian Kernighan's is preferred |
| **DP with i & -i** | O(n) | O(n) | Alternative bit manipulation |
| **Built-in bit_count()** | O(n) | O(n) | Python 3.8+ - Most concise |
| **Lookup Table** | O(n) | O(n) | Maximum performance for many queries |
| **DP with MSB (bit shifting)** | O(n) | O(n) | Understanding MSB concept |
| **DP with MSB (bit_length)** | O(n) | O(n) | Python optimized MSB approach |

### Deep Dive: Optimal Approach (DP with i // 2)

**Why O(n)?**
- We iterate from 1 to n exactly once
- Each iteration performs O(1) operations (integer division, modulo, array access, addition)
- Total operations: n × O(1) = O(n)

**Why O(n) space?**
- We must return an array of size n + 1
- This is the minimum space needed for the output
- The dp array itself is O(n)

### Can We Do Better?

**No, we cannot achieve better than O(n) time:**
- We must compute values for all n + 1 numbers
- Even reading each number once takes O(n) time
- Any solution must be Ω(n) (omega of n)

**Space reduction is not possible:**
- The output itself requires O(n) space
- We cannot use less than O(n) space for the result

---

## Edge Cases and Common Pitfalls

### Edge Cases to Consider

1. **n = 0**
   ```python
   Input: n = 0
   Output: [0]
   Explanation: Only number 0, which has 0 set bits.
   ```

2. **n = 1**
   ```python
   Input: n = 1
   Output: [0, 1]
   Explanation: 0 -> 0, 1 -> 1 (one set bit).
   ```

3. **Large n (n = 10^5)**
   ```python
   Input: n = 100000
   Output: [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, ...]  (100001 elements)
   Explanation: The O(n) solution handles this easily.
   ```

4. **Power of 2**
   ```python
   Input: n = 8
   Output: [0, 1, 1, 2, 1, 2, 2, 3, 1, 2]
   Explanation: Powers of 2 always have exactly 1 set bit.
   ```

### Common Mistakes to Avoid

1. **Forgetting ans[0]**
   ```python
   # Wrong!
   ans = [0] * n  # Size n instead of n + 1
   
   # Correct!
   ans = [0] * (n + 1)
   ```

2. **Starting from 0**
   ```python
   # Wrong! ans[0] is already 0
   for i in range(0, n + 1):
       ans[i] = ans[i // 2] + (i % 2)
   
   # Correct! Start from 1
   for i in range(1, n + 1):
       ans[i] = ans[i // 2] + (i % 2)
   ```

3. **Using integer division incorrectly**
   ```python
   # Wrong!
   ans[i] = ans[i / 2] + (i % 2)  # / is float division
   
   # Correct!
   ans[i] = ans[i // 2] + (i % 2)  # // is integer division
   ```

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Frequently asked in technical interviews
- **Companies**: Google, Amazon, Meta, Apple, Microsoft, Bloomberg
- **Difficulty**: Easy, but tests understanding of DP and bit manipulation
- **Pattern**: Leads to many related bit manipulation problems

### Learning Outcomes

1. **DP + Bit Manipulation**: Learn to combine dynamic programming with bitwise operations
2. **Pattern Recognition**: Identify relationships between consecutive numbers
3. **Optimization**: Understand why O(n) is optimal for this problem
4. **Multiple Approaches**: See how the same problem can be solved in different ways

---

## Related Problems

### Same Pattern (DP with Bit Manipulation)

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/) | 191 | Easy | Count set bits in a single number |
| [Reverse Bits](https://leetcode.com/problems/reverse-bits/) | 190 | Easy | Reverse bits of a 32-bit integer |
| [Power of Two](https://leetcode.com/problems/power-of-two/) | 231 | Easy | Check if number is power of two |
| [Single Number](https://leetcode.com/problems/single-number/) | 136 | Easy | Find unique element using XOR |
| [Single Number II](https://leetcode.com/problems/single-number-ii/) | 137 | Medium | Find unique element with triples |

### Similar Concepts

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Total Hamming Distance](https://leetcode.com/problems/total-hamming-distance/) | 477 | Medium | Sum of Hamming distances between pairs |
| [Hamming Distance](https://leetcode.com/problems/hamming-distance/) | 461 | Easy | Hamming distance between two numbers |
| [Gray Code](https://leetcode.com/problems/gray-code/) | 89 | Medium | Generate Gray code sequence |
| [Missing Number](https://leetcode.com/problems/missing-number/) | 268 | Easy | Find missing number using XOR |
| [Bitwise AND of Numbers Range](https://leetcode.com/problems/bitwise-and-of-numbers-range/) | 201 | Medium | Bitwise AND of range |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[Counting Bits - NeetCode](https://www.youtube.com/watch?v=RyBMvRj29_w)**
   - Excellent visual explanation of the DP approach
   - Step-by-step walkthrough
   - Part of popular NeetCode playlist

2. **[Counting Bits - William Lin](https://www.youtube.com/watch?v=ypaEyWciklQ)**
   - Clean and concise explanation
   - Multiple approaches covered
   - Great for interview preparation

3. **[Dynamic Programming + Bit Manipulation](https://www.youtube.com/watch?v=yl2jB8T13aQ)**
   - Deep dive into DP with bit manipulation
   - Visual demonstrations
   - Beginner-friendly

4. **[LeetCode Official Solution](https://www.youtube.com/watch?v=35qD-_kEoUY)**
   - Official solution walkthrough
   - Best practices and edge cases

5. **[Bit Manipulation Masterclass](https://www.youtube.com/watch?v=6TcLqR_4u88)**
   - Comprehensive bit manipulation guide
   - Related problems covered

### Additional Resources

- **[Brian Kernighan's Algorithm](https://www.geeksforgeeks.org/count-set-bits-in-an-integer/)** - GeeksforGeeks explanation
- **[Bitwise Operations](https://en.wikipedia.org/wiki/Bitwise_operation)** - Wikipedia theoretical background
- **[LeetCode Discuss](https://leetcode.com/problems/counting-bits/discuss/)** - Community solutions and tips

---

## Follow-up Questions

### Basic Level

1. **What is the time and space complexity of the optimal solution?**
   - Time: O(n), Space: O(n)

2. **Why can't we solve this in less than O(n) time?**
   - We need to compute values for all n+1 numbers
   - Even reading each number once takes O(n) time

3. **What is the relationship between ans[i] and ans[i // 2]?**
   - ans[i] = ans[i // 2] + (i % 2)
   - For even i, ans[i] = ans[i // 2]
   - For odd i, ans[i] = ans[i // 2] + 1

### Intermediate Level

4. **How would you modify the solution to only return even bit counts?**
   - Filter the result: return [x for x in ans if x % 2 == 0]

5. **Can you solve this without using extra space (besides output)?**
   - No, the output itself is O(n) space
   - We could modify input but that's not allowed

6. **How does this relate to the Hamming weight of a number?**
   - The count of 1 bits is also known as Hamming weight
   - ans[i] is the Hamming weight of i

### Advanced Level

7. **How would you compute the sum of all set bits from 0 to n?**
   - Sum(ans[i]) for i in range(n + 1)
   - Can be optimized using bit position analysis

8. **What is the relationship between this problem and Gray code?**
   - Gray code has exactly one bit difference between consecutive numbers
   - This problem counts bits for all numbers

9. **How would you parallelize this computation?**
   - Each ans[i] depends on ans[i // 2]
   - Can be computed in parallel by levels (same msb positions)
   - Level 0: i = 0
   - Level 1: i = 1, 2
   - Level 2: i = 3, 4, 5, 6, 7
   - etc.

### Practical Implementation Questions

10. **What if n is extremely large (like 10^9)?**
    - O(n) solution won't work
    - Need mathematical formula based on bit patterns
    - Count bits at each position across all numbers

11. **How would you test this solution?**
    - Test n = 0, 1, 2, 5, 10, 100
    - Compare with brute force for small n
    - Test edge cases and boundary values

12. **What are the real-world applications of this pattern?**
    - Error detection/correction codes
    - Cryptography (key generation)
    - Data compression algorithms
    - Hash functions

---

## Summary

The **Counting Bits** problem is a classic example of combining dynamic programming with bit manipulation for an elegant O(n) solution. The key insights are:

1. **Relationship**: `ans[i] = ans[i // 2] + (i % 2)` leverages the binary structure
2. **Optimality**: O(n) time is optimal since we must compute all values
3. **Multiple Approaches**: Several equivalent formulations exist (i//2, i&(i-1), i&-i)
4. **Practicality**: The pattern extends to many related problems in bit manipulation

The problem demonstrates how understanding the underlying mathematical structure can lead to efficient algorithms that are both elegant and optimal.

---

## MSB Approach: Additional Explanation

### What is the Most Significant Bit (MSB)?

The MSB of a number is the highest-order bit that is set to 1. For example:
- MSB(5) = 4 (binary: 101 → MSB is 100)
- MSB(7) = 4 (binary: 111 → MSB is 100)
- MSB(8) = 8 (binary: 1000 → MSB is 1000)

### Why Use MSB for This Problem?

The MSB approach provides an alternative perspective on the bit counting problem:

1. **Decomposition**: Any number can be written as `i = MSB + remainder`
2. **Bit Count**: `bits(i) = 1 + bits(remainder)` (the MSB contributes exactly one set bit)
3. **DP Foundation**: Since `remainder < MSB ≤ i`, the value `bits(remainder)` is already computed

### MSB vs LSB Approaches

| Aspect | LSB-based (i//2) | MSB-based |
|--------|------------------|-----------|
| **Formula** | `bits(i) = bits(i//2) + (i%2)` | `bits(i) = bits(i - MSB) + 1` |
| **Direction** | Bottom-up (smaller → larger) | Top-down (larger → smaller) |
| **Intuition** | Remove LSB, count remains | Remove MSB, subtract 1 |
| **Easier to** | Understand for most people | Understand binary structure |

### Visual Representation

```
Number: 13 (binary: 1101)

LSB Approach:
  13 → 6 (110) + 1 (LSB) → ans[6] + 1
  6 → 3 (11) + 0 (LSB) → ans[3] + 0
  3 → 1 (1) + 1 (LSB) → ans[1] + 1
  1 → 0 + 1 → ans[0] + 1
  Total: ans[0] + 1 + 0 + 1 + 1 = 3

MSB Approach:
  13: MSB = 8, remainder = 5
  5: MSB = 4, remainder = 1
  1: MSB = 1, remainder = 0
  Total: 1 (for 8) + 1 (for 4) + 1 (for 1) = 3
```

Both approaches yield the same result, demonstrating the flexibility of dynamic programming solutions for this problem.

