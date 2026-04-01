# Count Bits

## Category
Bit Manipulation

## Description

The Count Bits technique involves efficiently computing the number of set bits (1s) in the binary representation of integers. This fundamental bit manipulation operation, also known as population count or Hamming weight, has multiple elegant solutions including Brian Kernighan's algorithm which runs in O(k) time where k is the number of set bits, and a dynamic programming approach that enables O(1) queries after O(n) preprocessing.

This technique is essential for solving competitive programming problems involving bit manipulation, Hamming distance calculations, and power-of-two detection. It frequently appears in technical interviews at major tech companies.

---

## Concepts

The Count Bits technique is built on several fundamental concepts that make it efficient and versatile for different scenarios.

### 1. Bitwise Operations

The core operation behind efficient bit counting relies on fundamental bitwise operations:

| Operation | Description | Example |
|-----------|-------------|---------|
| **AND (&)** | Sets bit if both operands have it | `12 & 11 = 8` |
| **Right Shift (>>)** | Shifts bits right, divides by 2 | `5 >> 1 = 2` |
| **Masking** | Extract specific bits using masks | `n & 1` extracts LSB |

### 2. Brian Kernighan's Insight

The key insight is the operation `n & (n - 1)` which clears the lowest set bit:

```
New n = Old n & (Old n - 1)
```

This transforms the problem from iterating through all bits to only visiting set bits.

### 3. Dynamic Programming Principle

For range queries, leverage previously computed values:

- `count[i] = count[i >> 1] + (i & 1)`
- Reuses the count from `i/2` and adds the current LSB

### 4. Lookup Table Optimization

Precompute bit counts for all possible byte values (0-255):

| Table Size | Values | Lookups for 32-bit |
|------------|--------|-------------------|
| 256 entries | 0-255 | 4 lookups |
| 65536 entries | 0-65535 | 2 lookups |

---

## Frameworks

Structured approaches for solving count bits problems.

### Framework 1: Brian Kernighan's Algorithm (Single Number)

```
┌─────────────────────────────────────────────────────┐
│  BRIAN KERNIGHAN'S ALGORITHM                        │
├─────────────────────────────────────────────────────┤
│  1. Initialize count = 0                            │
│  2. While n > 0:                                    │
│     a. n = n & (n - 1)  // Clear lowest set bit    │
│     b. count += 1                                   │
│  3. Return count                                    │
└─────────────────────────────────────────────────────┘
```

**When to use**: Single number, sparse bit representation, memory constrained.

### Framework 2: Dynamic Programming Precomputation

```
┌─────────────────────────────────────────────────────┐
│  DP PRECOMPUTATION FRAMEWORK                        │
├─────────────────────────────────────────────────────┤
│  1. Create array result[0..n]                       │
│  2. Set result[0] = 0                               │
│  3. For i from 1 to n:                              │
│     a. result[i] = result[i >> 1] + (i & 1)        │
│  4. Return result array                             │
└─────────────────────────────────────────────────────┘
```

**When to use**: Multiple queries in range [0, n], can afford O(n) preprocessing.

### Framework 3: Lookup Table Approach

```
┌─────────────────────────────────────────────────────┐
│  LOOKUP TABLE FRAMEWORK                             │
├─────────────────────────────────────────────────────┤
│  1. Precompute table[0..255] using DP               │
│  2. For 32-bit number n:                            │
│     a. Split into 4 bytes: b0, b1, b2, b3          │
│     b. count = table[b0] + table[b1]               │
│              + table[b2] + table[b3]               │
│  3. Return count                                    │
└─────────────────────────────────────────────────────┘
```

**When to use**: Maximum speed needed, frequent queries, memory available.

---

## Forms

Different manifestations of the count bits pattern.

### Form 1: Single Number Query

Count bits for one integer at a time.

| Method | Time | Space | Best For |
|--------|------|-------|----------|
| Brian Kernighan's | O(k) | O(1) | Sparse numbers |
| Naive Loop | O(log n) | O(1) | Simple implementation |
| Built-in | O(1) | O(1) | Production code |

### Form 2: Range Query [0, n]

Precompute bit counts for all numbers 0 to n.

| Method | Preprocess | Query | Space |
|--------|-----------|-------|-------|
| DP Array | O(n) | O(1) | O(n) |
| Sparse Table | O(n log n) | O(1) | O(n log n) |

### Form 3: Hamming Distance

Count differing bits between two numbers.

```
x ^ y  // XOR gives bits that differ
Count set bits in result
```

**Example**: Hamming distance between 1 (001) and 4 (100) = 2

### Form 4: Power of Two Detection

Check if exactly one bit is set:

```
n > 0 AND (n & (n - 1)) == 0
```

**Example**: 8 (1000) is power of two, 12 (1100) is not

### Form 5: Parallel Bit Counting

Use bitwise operations to count bits in parallel for 32-bit integers.

```
n = n - ((n >> 1) & 0x55555555)
n = (n & 0x33333333) + ((n >> 2) & 0x33333333)
n = (n + (n >> 4)) & 0x0F0F0F0F
n = n + (n >> 8)
n = n + (n >> 16)
count = n & 0x3F
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Using Built-in Functions

Most languages provide optimized built-in functions:

```python
def count_bits_builtin(n: int) -> int:
    """Use Python's built-in bit_count() method."""
    return n.bit_count()

# Alternative using bin()
def count_bits_bin(n: int) -> int:
    """Simple but less efficient string conversion."""
    return bin(n).count('1')
```

### Tactic 2: Brian Kernighan's vs DP Trade-off

```python
def should_use_brian_kernighan(n: int, num_queries: int) -> bool:
    """
    Decide which method to use based on expected workload.
    
    Use Brian Kernighan's when:
    - num_queries is small
    - n has sparse bits (typical k < log(n)/4)
    - Memory is constrained
    
    Use DP when:
    - num_queries is large
    - Query range is limited [0, n]
    - Need O(1) per query
    """
    avg_set_bits = n.bit_count()  # Sample estimate
    
    # Rough heuristic: DP wins when queries > n / (2 * avg_set_bits)
    return num_queries < n / (2 * max(avg_set_bits, 1))
```

### Tactic 3: Hamming Distance Calculation

```python
def hamming_distance(x: int, y: int) -> int:
    """
    Calculate Hamming distance between two integers.
    Counts positions where bits differ.
    """
    return (x ^ y).bit_count()
```

### Tactic 4: Power of Two Check

```python
def is_power_of_two(n: int) -> bool:
    """
    Check if n is a power of two.
    A power of two has exactly one set bit.
    """
    return n > 0 and (n & (n - 1)) == 0
```

### Tactic 5: Counting Bits in a Range [l, r]

```python
def count_bits_range(l: int, r: int) -> int:
    """
    Total set bits across all numbers in range [l, r].
    Uses prefix sum approach with DP.
    """
    def prefix_count(n: int) -> int:
        """Total set bits in all numbers from 0 to n."""
        if n < 0:
            return 0
        # Precompute using DP
        dp = [0] * (n + 1)
        total = 0
        for i in range(1, n + 1):
            dp[i] = dp[i >> 1] + (i & 1)
            total += dp[i]
        return total
    
    return prefix_count(r) - prefix_count(l - 1)
```

### Tactic 6: Reverse Bits with Counting

```python
def reverse_bits(n: int) -> int:
    """
    Reverse bits of a 32-bit integer.
    Can count bits before/after for verification.
    """
    result = 0
    for i in range(32):
        result = (result << 1) | ((n >> i) & 1)
    return result
```

### Tactic 7: Find Rightmost Set Bit

```python
def rightmost_set_bit(n: int) -> int:
    """
    Get the value of the rightmost set bit.
    Uses n & -n to isolate rightmost bit.
    """
    return n & -n

def rightmost_set_bit_position(n: int) -> int:
    """
    Get the position (0-indexed) of the rightmost set bit.
    Returns -1 if n is 0.
    """
    if n == 0:
        return -1
    # Count trailing zeros
    count = 0
    while (n & 1) == 0:
        n >>= 1
        count += 1
    return count
```

---

## Python Templates

### Template 1: Brian Kernighan's Algorithm

```python
def count_bits_kernighan(n: int) -> int:
    """
    Count set bits using Brian Kernighan's algorithm.
    Time: O(k) where k = number of set bits
    Space: O(1)
    """
    count = 0
    while n:
        n = n & (n - 1)  # Clear lowest set bit
        count += 1
    return count
```

### Template 2: Dynamic Programming Precomputation

```python
def count_bits_dp(n: int) -> list[int]:
    """
    Count bits for all numbers from 0 to n using DP.
    Time: O(n) for preprocessing
    Space: O(n)
    
    Returns: List where result[i] = number of 1s in i
    """
    result = [0] * (n + 1)
    for i in range(1, n + 1):
        # i >> 1 removes LSB, (i & 1) gets LSB
        result[i] = result[i >> 1] + (i & 1)
    return result
```

### Template 3: Lookup Table for 32-bit Integers

```python
def create_lookup_table() -> list[int]:
    """
    Create a 256-entry lookup table for fast bit counting.
    Time: O(1) per query after setup
    Space: O(256)
    """
    table = [0] * 256
    for i in range(1, 256):
        table[i] = table[i >> 1] + (i & 1)
    return table


def count_bits_lookup(n: int, table: list[int]) -> int:
    """
    Count bits for 32-bit integer using lookup table.
    Time: O(1)
    Space: O(1)
    """
    return (table[n & 0xFF] +
            table[(n >> 8) & 0xFF] +
            table[(n >> 16) & 0xFF] +
            table[(n >> 24) & 0xFF])
```

### Template 4: Hamming Distance

```python
def hamming_distance(x: int, y: int) -> int:
    """
    Calculate Hamming distance between two integers.
    Counts positions where corresponding bits differ.
    Time: O(1) using built-in
    Space: O(1)
    """
    return (x ^ y).bit_count()


def hamming_distance_manual(x: int, y: int) -> int:
    """
    Manual Hamming distance using Brian Kernighan's.
    Time: O(k) where k = number of differing bits
    Space: O(1)
    """
    xor = x ^ y
    count = 0
    while xor:
        xor = xor & (xor - 1)
        count += 1
    return count
```

### Template 5: Power of Two Detection

```python
def is_power_of_two(n: int) -> bool:
    """
    Check if n is a power of two.
    Uses the property: n & (n-1) == 0 for powers of two.
    Time: O(1)
    Space: O(1)
    """
    return n > 0 and (n & (n - 1)) == 0


def is_power_of_two_alternative(n: int) -> bool:
    """
    Alternative: Check if exactly one bit is set.
    Time: O(1) using built-in
    Space: O(1)
    """
    return n > 0 and n.bit_count() == 1
```

### Template 6: Count Total Set Bits in Range [0, n]

```python
def count_total_set_bits(n: int) -> int:
    """
    Count total set bits in all numbers from 0 to n.
    Uses pattern observation: every 2^k numbers have
    specific bit patterns.
    Time: O(log n)
    Space: O(1)
    """
    if n < 0:
        return 0
    
    count = 0
    i = 0
    
    while (1 << i) <= n:
        # Pattern repeats every 2^(i+1)
        pattern_size = 1 << (i + 1)
        full_patterns = (n + 1) // pattern_size
        remainder = (n + 1) % pattern_size
        
        # Each full pattern has 2^i set bits at position i
        count += full_patterns * (1 << i)
        
        # Remainder contributes max(0, remainder - 2^i) bits
        count += max(0, remainder - (1 << i))
        
        i += 1
    
    return count
```

### Template 7: Reverse Bits (32-bit)

```python
def reverse_bits(n: int) -> int:
    """
    Reverse bits of a 32-bit unsigned integer.
    Time: O(1) - fixed 32 iterations
    Space: O(1)
    """
    result = 0
    for i in range(32):
        # Extract bit at position i and place at position (31-i)
        bit = (n >> i) & 1
        result = result | (bit << (31 - i))
    return result


def reverse_bits_optimized(n: int) -> int:
    """
    Optimized using bit manipulation.
    Time: O(1)
    Space: O(1)
    """
    n = ((n & 0xFFFF0000) >> 16) | ((n & 0x0000FFFF) << 16)
    n = ((n & 0xFF00FF00) >> 8) | ((n & 0x00FF00FF) << 8)
    n = ((n & 0xF0F0F0F0) >> 4) | ((n & 0x0F0F0F0F) << 4)
    n = ((n & 0xCCCCCCCC) >> 2) | ((n & 0x33333333) << 2)
    n = ((n & 0xAAAAAAAA) >> 1) | ((n & 0x55555555) << 1)
    return n
```

---

## When to Use

Use Count Bits techniques when you need to solve problems involving:

- **Population Count**: Counting set bits in integers
- **Hamming Distance**: Measuring differences between binary representations
- **Bit Manipulation**: Various bitwise operations and optimizations
- **Power of Two Checks**: Efficiently testing if a number is a power of two

### Comparison with Alternatives

| Method | Time Complexity | Space Complexity | Best Use Case |
|--------|----------------|------------------|---------------|
| **Brian Kernighan's** | O(k) where k = set bits | O(1) | Single number, sparse bits |
| **Naive Loop** | O(log n) | O(1) | Simple implementation |
| **DP Precomputation** | O(n) build, O(1) query | O(n) | Multiple queries for range [0, n] |
| **Lookup Table** | O(1) | O(256) or O(65536) | Frequent queries, fixed width |
| **Built-in Functions** | O(1) | O(1) | Production code, when available |

### When to Choose Each Method

- **Choose Brian Kernighan's** when:
  - You only need to count bits for one or a few numbers
  - The numbers have few set bits (sparse representation)
  - Memory is constrained

- **Choose DP Precomputation** when:
  - You need to query many numbers in range [0, n]
  - You can afford O(n) preprocessing time
  - You need O(1) per-query time

- **Choose Lookup Table** when:
  - Working with fixed-width integers (8, 16, or 32-bit)
  - Memory is not a concern
  - Maximum speed is required

---

## Algorithm Explanation

### Core Concept

The key insight behind Brian Kernighan's algorithm is the bitwise operation `n & (n - 1)`. This operation **clears the lowest set bit** in a single step, making it incredibly efficient for counting set bits.

The operation works because:
- When we subtract 1 from n, all bits to the right of the rightmost 1 become 1
- That rightmost 1 itself becomes 0
- The AND operation then clears only that lowest set bit

### How It Works

#### Brian Kernighan's Algorithm:

1. **The Magic Operation**: `n & (n - 1)` clears the lowest set bit
2. **Why it works**: Subtracting 1 flips all bits below the rightmost 1
3. **Iteration**: Each iteration clears exactly one bit
4. **Count**: The number of iterations equals the number of set bits

#### Visual Example

```
n = 12 (binary: 1100)

Iteration 1:
  n = 12 (1100)
  n - 1 = 11 (1011)
  n & (n-1) = 8 (1000) → count = 1

Iteration 2:
  n = 8 (1000)
  n - 1 = 7 (0111)
  n & (n-1) = 0 (0000) → count = 2

Result: 2 set bits
```

#### DP Approach (for Range Queries):

The DP approach precomputes the number of set bits for all numbers from 0 to n:

- `count_bits[i] = count_bits[i >> 1] + (i & 1)`

This works because:
- `i >> 1` removes the least significant bit
- `(i & 1)` gets the least significant bit (0 or 1)
- The sum gives the total count of set bits

### Why It Works Efficiently

- **Brian Kernighan's**: Each iteration clears one bit, so we only iterate k times
- **DP Approach**: Leverages previously computed values, avoiding redundant calculations
- **Best case**: O(1) for numbers with no set bits (n = 0)
- **Worst case**: O(log n) for numbers like (2^k - 1) with all bits set
- **Average case**: O(k) where k is typically much smaller than log₂(n)

### Limitations

- **Brian Kernighan's**: Performance degrades with dense bit patterns (many 1s)
- **DP Approach**: Requires O(n) space, which may be prohibitive for large n
- **Lookup Table**: Fixed size limits applicability to known bit widths
- **Built-in functions**: May not be available in all languages or environments

---

## Practice Problems

### Problem 1: Number of 1 Bits

**Problem:** [LeetCode 191 - Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/)

**Description:** Write a function that takes an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight).

**How to Apply:**
- Use Brian Kernighan's algorithm for optimal O(k) time
- Or use built-in `n.bit_count()` in Python
- Input is guaranteed to be a 32-bit unsigned integer

---

### Problem 2: Counting Bits

**Problem:** [LeetCode 338 - Counting Bits](https://leetcode.com/problems/counting-bits/)

**Description:** Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` (0 ≤ i ≤ n), `ans[i]` is the number of 1's in the binary representation of `i`.

**How to Apply:**
- Use DP approach: `result[i] = result[i >> 1] + (i & 1)`
- This leverages previously computed values for efficiency
- Time: O(n), Space: O(n)

---

### Problem 3: Hamming Distance

**Problem:** [LeetCode 461 - Hamming Distance](https://leetcode.com/problems/hamming-distance/)

**Description:** The Hamming distance between two integers is the number of positions at which the corresponding bits are different. Given two integers `x` and `y`, return the Hamming distance between them.

**How to Apply:**
- Use `x ^ y` to find differing bits
- Count the set bits in the result using Brian Kernighan's algorithm
- Or use `(x ^ y).bit_count()` for simplicity

---

### Problem 4: Reverse Bits

**Problem:** [LeetCode 190 - Reverse Bits](https://leetcode.com/problems/reverse-bits/)

**Description:** Reverse bits of a given 32-bit unsigned integer.

**How to Apply:**
- Use bit manipulation to reverse each bit position
- Can count bits before and after as verification
- Useful for understanding bit-level operations

---

### Problem 5: Power of Two

**Problem:** [LeetCode 231 - Power of Two](https://leetcode.com/problems/power-of-two/)

**Description:** Given an integer `n`, return `true` if it is a power of two, or `false` otherwise.

**How to Apply:**
- Use property: `n > 0` and `n & (n - 1) == 0`
- A power of two has exactly one set bit
- This is a direct application of the core count bits concept

---

## Video Tutorial Links

### Fundamentals

- [Brian Kernighan's Algorithm (Take U Forward)](https://www.youtube.com/watch?v=9Xyt8xvL-1I) - Detailed explanation of the algorithm
- [Counting Bits - LeetCode 338 (NeetCode)](https://www.youtube.com/watch?v=Kkmv2e30HWs) - DP approach explanation
- [Bit Manipulation Masterclass (WilliamFiset)](https://www.youtube.com/watch?v=7rvZ7S3z9iI) - Comprehensive bit manipulation guide

### Advanced Topics

- [Hamming Weight Implementation](https://www.youtube.com/watch?v=vhZ9t3QBPEs) - Various approaches to counting bits
- [Bit Hacks for Programmers](https://www.youtube.com/watch?v=Zusi7dk_PL_M) - Advanced bit manipulation tricks
- [Built-in Population Count](https://www.youtube.com/watch?v=5e6s63Wz9wQ) - Using language built-ins effectively

---

## Follow-up Questions

### Q1: Why is `n & (n - 1)` always a power of 2 less than n when n is a power of 2?

**Answer:** When n is a power of 2 (e.g., 8 = 1000 in binary), n - 1 flips all bits below the single 1 (e.g., 7 = 0111). The AND operation then results in 0, confirming that n had only one set bit. This property is used to check if a number is a power of two.

---

### Q2: Can you count bits for negative integers?

**Answer:** For signed integers with two's complement representation:
- **Python**: Uses arbitrary precision, `n.bit_count()` works directly
- **C/C++**: Use unsigned types or reinterpret cast
- **Java**: Use `Integer.bitCount()` which treats as unsigned
- **JavaScript**: Bitwise operations are 32-bit signed, use `>>> 0` for unsigned

In Python, negative numbers are handled seamlessly due to unlimited precision integers.

---

### Q3: What is the fastest method for counting bits in production code?

**Answer:** 
1. **Use built-in functions**: Most languages have optimized hardware-accelerated built-ins
   - Python: `n.bit_count()`
   - C++: `__builtin_popcount()`
   - Java: `Integer.bitCount()`
   - JavaScript: Use lookup table or parallel method

2. **Lookup table**: Fastest for multiple queries with fixed width integers
3. **SIMD instructions**: For massive data processing in specialized applications

---

### Q4: How does the DP approach for counting bits work?

**Answer:** The recurrence `result[i] = result[i >> 1] + (i & 1)` works because:
- `i >> 1` removes the least significant bit (right shift by 1 = integer division by 2)
- `(i & 1)` extracts the least significant bit (0 or 1)
- Adding them gives the total count of set bits
- Example: i=5 (101), i>>1=2 (10), i&1=1, result[2]=1, so result[5]=1+1=2

---

### Q5: What is the relationship between bit counting and the number of operations needed?

**Answer:** Brian Kernighan's algorithm performs exactly k iterations where k is the number of set bits. This makes it optimal because:
- We must at least see each set bit once (lower bound)
- The algorithm achieves this lower bound
- For sparse numbers (few 1s), it's much faster than O(log n)
- For dense numbers (many 1s), a lookup table or parallel bit counting may be faster

---

## Summary

The Count Bits technique is a fundamental bit manipulation skill with multiple approaches suited for different scenarios. Key takeaways:

- **Brian Kernighan's Algorithm**: O(k) time, O(1) space - optimal for single queries with sparse bits
- **DP Precomputation**: O(n) build, O(1) query - ideal for range queries
- **Lookup Table**: O(1) per query, fixed space - best for frequent queries
- **Built-in Functions**: Most convenient - use when available in production code

When to use:
- ✅ Single number with sparse bits → Brian Kernighan's
- ✅ Multiple queries in range [0, n] → DP approach
- ✅ Maximum performance needed → Lookup table
- ✅ Quick implementation → Built-in functions
- ❌ When bit pattern is completely unpredictable

This technique is essential for competitive programming and technical interviews, especially in problems involving bit manipulation, Hamming distance, and power-of-two checking.
