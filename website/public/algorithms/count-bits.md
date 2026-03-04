# Count Bits

## Category
Bit Manipulation

## Description

Counting the number of set bits (1s) in the binary representation of an integer is a fundamental bit manipulation problem. Brian Kernighan's algorithm provides an elegant O(k) solution where k is the number of set bits, making it optimal for sparse bit representations. Additionally, the dynamic programming approach allows O(n) preprocessing to answer queries for all numbers from 0 to n in O(1) per query.

This technique is essential for solving many competitive programming problems and is frequently tested in technical interviews.

---

## When to Use

Use the count bits algorithm when you need to solve problems involving:

- **Single Number Queries**: When you need to count set bits for individual integers
- **Range Queries**: When you need to count bits for all numbers in a range [0, n]
- **Bit Manipulation**: Problems involving bitwise operations and optimizations
- ** Hamming Weight**: Computing the Hamming weight (population count) of an integer

### Comparison with Alternatives

| Method | Time Complexity | Space Complexity | Best Use Case |
|--------|----------------|------------------|---------------|
| **Brian Kernighan's** | O(k) where k = set bits | O(1) | Single number, sparse bits |
| **Naive Loop** | O(log n) | O(1) | Simple implementation |
| **Lookup Table** | O(1) | O(256) or O(65536) | Frequent queries, memory available |
| **DP Precomputation** | O(n) build, O(1) query | O(n) | Multiple queries for range [0, n] |
| **Built-in Functions** | O(1) or O(1) | O(1) | Production code, language support |

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

### How It Works

#### Brian Kernighan's Algorithm:

1. **The Magic Operation**: `n & (n - 1)` clears the lowest set bit
2. **Why it works**: When we subtract 1 from n, all bits to the right of the rightmost 1 become 1, and that rightmost 1 becomes 0
3. **Example**: 
   - n = 12 (binary: 1100)
   - n - 1 = 11 (binary: 1011)
   - n & (n - 1) = 1000 (clears the lowest set bit)
4. **Iteration**: Each iteration clears one bit, so we only iterate k times where k = number of set bits

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
- `(i & 1)` gets the least significant bit
- The sum gives the total count

### Why Brian Kernighan's is Optimal

- **Best case**: O(1) for numbers with no set bits (n = 0)
- **Worst case**: O(log n) for numbers like (2^k - 1) with all bits set
- **Average case**: O(k) where k is typically much smaller than log₂(n)

---

## Algorithm Steps

### Brian Kernighan's Algorithm (Single Number)

1. **Initialize**: Set `count = 0`
2. **Loop**: While `n > 0`:
   - Perform `n = n & (n - 1)` to clear lowest set bit
   - Increment `count`
3. **Return**: `count`

### DP Approach (Range Precomputation)

1. **Initialize**: Create array `result[0..n]` with result[0] = 0
2. **Iterate**: For each i from 1 to n:
   - `result[i] = result[i >> 1] + (i & 1)`
3. **Return**: The entire array `result`

### Step-by-Step Trace

For n = 12 using Brian Kernighan's:

```
Step 1: n = 12, count = 0
        n > 0? Yes
        n & (n-1) = 12 & 11 = 8
        count = 1

Step 2: n = 8, count = 1
        n > 0? Yes
        n & (n-1) = 8 & 7 = 0
        count = 2

Step 3: n = 0, count = 2
        n > 0? No
        Return 2
```

---

## Implementation

### Template Code (All Languages)

````carousel
```python
def count_bits(n: int) -> int:
    """
    Count set bits using Brian Kernighan's algorithm.
    
    Time Complexity: O(k) where k = number of set bits
    Space Complexity: O(1)
    
    Args:
        n: Non-negative integer
        
    Returns:
        Number of 1s in binary representation
    """
    count = 0
    while n:
        n = n & (n - 1)  # Clear lowest set bit
        count += 1
    return count


def count_bits_dp(n: int) -> list:
    """
    Count bits for all numbers from 0 to n using DP.
    
    Time Complexity: O(n) for preprocessing
    Space Complexity: O(n)
    
    Args:
        n: Non-negative integer (inclusive upper bound)
        
    Returns:
        List where result[i] = number of 1s in i
    """
    result = [0] * (n + 1)
    for i in range(1, n + 1):
        # i >> 1 removes LSB, (i & 1) gets LSB
        result[i] = result[i >> 1] + (i & 1)
    return result


def count_bits_lookup_table() -> list:
    """
    Create a 256-entry lookup table for fast bit counting.
    
    Time Complexity: O(1) per query after setup
    Space Complexity: O(256)
    
    Returns:
        Lookup table where table[i] = popcount(i)
    """
    table = [0] * 256
    for i in range(1, 256):
        table[i] = table[i >> 1] + (i & 1)
    return table


def count_bits_32bit(n: int, table: list) -> int:
    """
    Count bits for 32-bit integer using lookup table.
    
    Time Complexity: O(1)
    Space Complexity: O(1)
    """
    return (table[n & 0xFF] +
            table[(n >> 8) & 0xFF] +
            table[(n >> 16) & 0xFF] +
            table[n >> 24])


# Example usage and demonstration
if __name__ == "__main__":
    # Brian Kernighan's algorithm
    print("=== Brian Kernighan's Algorithm ===")
    test_cases = [0, 1, 7, 12, 15, 16, 255, 1024, 2**31 - 1]
    for n in test_cases:
        print(f"count_bits({n:>10}): {count_bits(n)}")
    
    # DP approach
    print("\n=== DP Approach ===")
    print(f"count_bits_dp(10): {count_bits_dp(10)}")
    # Output: [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2]
    
    # Lookup table approach
    print("\n=== Lookup Table Approach ===")
    table = count_bits_lookup_table()
    print(f"count_bits_32bit(255, table): {count_bits_32bit(255, table)}")  # 8
    print(f"count_bits_32bit(2**31 - 1, table): {count_bits_32bit(2**31 - 1, table)}")  # 31
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <cstdint>
using namespace std;

/**
 * Count set bits using Brian Kernighan's algorithm.
 * 
 * Time Complexity: O(k) where k = number of set bits
 * Space Complexity: O(1)
 */
int countBits(int n) {
    int count = 0;
    while (n > 0) {
        n = n & (n - 1);  // Clear lowest set bit
        count++;
    }
    return count;
}

/**
 * Count bits for all numbers from 0 to n using DP.
 * 
 * Time Complexity: O(n) for preprocessing
 * Space Complexity: O(n)
 */
vector<int> countBitsDP(int n) {
    vector<int> result(n + 1, 0);
    for (int i = 1; i <= n; i++) {
        result[i] = result[i >> 1] + (i & 1);
    }
    return result;
}

/**
 * Create a 256-entry lookup table for fast bit counting.
 */
vector<int> createLookupTable() {
    vector<int> table(256, 0);
    for (int i = 1; i < 256; i++) {
        table[i] = table[i >> 1] + (i & 1);
    }
    return table;
}

/**
 * Count bits for 32-bit integer using lookup table.
 */
int countBits32Bit(uint32_t n, const vector<int>& table) {
    return table[n & 0xFF] +
           table[(n >> 8) & 0xFF] +
           table[(n >> 16) & 0xFF] +
           table[n >> 24];
}

/**
 * Built-in function approach (GCC/Clang)
 */
int countBitsBuiltin(uint32_t n) {
    return __builtin_popcount(n);
}

/**
 * Built-in function for 64-bit
 */
int countBitsBuiltin64(uint64_t n) {
    return __builtin_popcountll(n);
}


int main() {
    // Brian Kernighan's algorithm
    cout << "=== Brian Kernighan's Algorithm ===" << endl;
    vector<int> testCases = {0, 1, 7, 12, 15, 16, 255, 1024};
    for (int n : testCases) {
        cout << "countBits(" << n << "): " << countBits(n) << endl;
    }
    
    // DP approach
    cout << "\n=== DP Approach ===" << endl;
    vector<int> dpResult = countBitsDP(10);
    cout << "countBitsDP(10): ";
    for (int i = 0; i <= 10; i++) {
        cout << dpResult[i] << " ";
    }
    cout << endl;
    
    // Lookup table approach
    cout << "\n=== Lookup Table Approach ===" << endl;
    vector<int> table = createLookupTable();
    cout << "countBits32Bit(255, table): " << countBits32Bit(255, table) << endl;
    
    // Built-in function
    cout << "\n=== Built-in Function ===" << endl;
    cout << "__builtin_popcount(255): " << countBitsBuiltin(255) << endl;
    
    return 0;
}
```

<!-- slide -->
```java
public class CountBits {
    
    /**
     * Count set bits using Brian Kernighan's algorithm.
     * 
     * Time Complexity: O(k) where k = number of set bits
     * Space Complexity: O(1)
     */
    public static int countBits(int n) {
        int count = 0;
        while (n > 0) {
            n = n & (n - 1);  // Clear lowest set bit
            count++;
        }
        return count;
    }
    
    /**
     * Count set bits for long (64-bit).
     */
    public static int countBitsLong(long n) {
        int count = 0;
        while (n > 0) {
            n = n & (n - 1);
            count++;
        }
        return count;
    }
    
    /**
     * Count bits for all numbers from 0 to n using DP.
     * 
     * Time Complexity: O(n) for preprocessing
     * Space Complexity: O(n)
     */
    public static int[] countBitsDP(int n) {
        int[] result = new int[n + 1];
        for (int i = 1; i <= n; i++) {
            result[i] = result[i >> 1] + (i & 1);
        }
        return result;
    }
    
    /**
     * Create a 256-entry lookup table.
     */
    public static int[] createLookupTable() {
        int[] table = new int[256];
        for (int i = 1; i < 256; i++) {
            table[i] = table[i >> 1] + (i & 1);
        }
        return table;
    }
    
    /**
     * Count bits for 32-bit integer using lookup table.
     */
    public static int countBits32Bit(int n, int[] table) {
        return table[n & 0xFF] +
               table[(n >> 8) & 0xFF] +
               table[(n >> 16) & 0xFF] +
               table[n >>> 24];
    }
    
    /**
     * Built-in function (Java Integer.bitCount)
     */
    public static int countBitsBuiltin(int n) {
        return Integer.bitCount(n);
    }
    
    /**
     * Built-in function for long
     */
    public static int countBitsBuiltinLong(long n) {
        return Long.bitCount(n);
    }
    
    
    public static void main(String[] args) {
        // Brian Kernighan's algorithm
        System.out.println("=== Brian Kernighan's Algorithm ===");
        int[] testCases = {0, 1, 7, 12, 15, 16, 255, 1024};
        for (int n : testCases) {
            System.out.println("countBits(" + n + "): " + countBits(n));
        }
        
        // DP approach
        System.out.println("\n=== DP Approach ===");
        int[] dpResult = countBitsDP(10);
        System.out.print("countBitsDP(10): ");
        for (int i = 0; i <= 10; i++) {
            System.out.print(dpResult[i] + " ");
        }
        System.out.println();
        
        // Lookup table approach
        System.out.println("\n=== Lookup Table Approach ===");
        int[] table = createLookupTable();
        System.out.println("countBits32Bit(255, table): " + countBits32Bit(255, table));
        
        // Built-in function
        System.out.println("\n=== Built-in Function ===");
        System.out.println("Integer.bitCount(255): " + countBitsBuiltin(255));
    }
}
```

<!-- slide -->
```javascript
/**
 * Count set bits using Brian Kernighan's algorithm.
 * 
 * Time Complexity: O(k) where k = number of set bits
 * Space Complexity: O(1)
 * @param {number} n - Non-negative integer
 * @returns {number} Number of 1s in binary representation
 */
function countBits(n) {
    let count = 0;
    while (n > 0) {
        n = n & (n - 1);  // Clear lowest set bit
        count++;
    }
    return count;
}

/**
 * Count set bits for all numbers from 0 to n using DP.
 * 
 * Time Complexity: O(n) for preprocessing
 * Space Complexity: O(n)
 * @param {number} n - Non-negative integer (inclusive upper bound)
 * @returns {number[]} Array where result[i] = number of 1s in i
 */
function countBitsDP(n) {
    const result = new Array(n + 1).fill(0);
    for (let i = 1; i <= n; i++) {
        // i >> 1 removes LSB, (i & 1) gets LSB
        result[i] = result[i >> 1] + (i & 1);
    }
    return result;
}

/**
 * Create a 256-entry lookup table for fast bit counting.
 * @returns {number[]} Lookup table
 */
function createLookupTable() {
    const table = new Array(256).fill(0);
    for (let i = 1; i < 256; i++) {
        table[i] = table[i >> 1] + (i & 1);
    }
    return table;
}

/**
 * Count bits for 32-bit integer using lookupparam {number} n - 32-bit integer
 * table.
 * @ @param {number[]} table - Lookup table
 * @returns {number} Number of set bits
 */
function countBits32Bit(n, table) {
    return table[n & 0xFF] +
           table[(n >> 8) & 0xFF] +
           table[(n >> 16) & 0xFF] +
           table[n >>> 24];
}

/**
 * Built-in function approach.
 * @param {number} n - Non-negative integer
 * @returns {number} Number of set bits
 */
function countBitsBuiltin(n) {
    return (n.toString(2).match(/1/g) || []).length;
}

/**
 * Using bitwise operations with optimized approach.
 * Faster than string matching for multiple queries.
 */
function countBitsOptimized(n) {
    n = n - ((n >>> 1) & 0x55555555);
    n = (n & 0x33333333) + ((n >>> 2) & 0x33333333);
    n = (n + (n >>> 4)) & 0x0F0F0F0F;
    n = n + (n >>> 8);
    n = n + (n >>> 16);
    return n & 0x3F;
}


// Example usage and demonstration
console.log("=== Brian Kernighan's Algorithm ===");
const testCases = [0, 1, 7, 12, 15, 16, 255, 1024];
testCases.forEach(n => {
    console.log(`countBits(${n}): ${countBits(n)}`);
});

console.log("\n=== DP Approach ===");
console.log(`countBitsDP(10): [${countBitsDP(10).join(', ')}]`);

console.log("\n=== Lookup Table Approach ===");
const table = createLookupTable();
console.log(`countBits32Bit(255, table): ${countBits32Bit(255, table)}`);

console.log("\n=== Built-in Function ===");
console.log(`countBitsBuiltin(255): ${countBitsBuiltin(255)}`);

console.log("\n=== Optimized Bitwise ===");
console.log(`countBitsOptimized(255): ${countBitsOptimized(255)}`);
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Brian Kernighan's** | O(k) | k = number of set bits in n |
| **Naive Loop** | O(log n) | Iterate through all bits |
| **DP Precomputation** | O(n) build, O(1) query | Build once, query many |
| **Lookup Table** | O(1) | Constant time per query |
| **Built-in Functions** | O(1) | Hardware-accelerated |

### Detailed Breakdown

- **Brian Kernighan's Algorithm**: 
  - Best case: O(1) when n = 0 (no set bits)
  - Worst case: O(log n) when n = 2^k - 1 (all bits set)
  - Average: O(k) where k is typically much smaller than log₂(n)

- **DP Approach**:
  - Preprocessing: O(n) to compute all values
  - Per query: O(1) using array lookup

- **Lookup Table**:
  - Setup: O(256) or O(65536) for 8-bit or 16-bit tables
  - Per query: O(1) with 4 table lookups for 32-bit

---

## Space Complexity Analysis

| Method | Space Complexity | Notes |
|--------|-----------------|-------|
| **Brian Kernighan's** | O(1) | Only uses counter variable |
| **Naive Loop** | O(1) | No additional space needed |
| **DP Precomputation** | O(n) | Stores counts for 0 to n |
| **Lookup Table** | O(256) or O(65536) | Fixed-size table |
| **Built-in Functions** | O(1) | No extra space |

### Space Optimization Tips

1. **For memory-constrained systems**: Use Brian Kernighan's algorithm
2. **For frequent queries**: Use lookup table (small, fixed size)
3. **For range queries**: Use DP approach when memory allows

---

## Common Variations

### 1. Recursive Implementation

````carousel
```python
def count_bits_recursive(n: int) -> int:
    """Recursive approach using n & (n-1)."""
    if n == 0:
        return 0
    return 1 + count_bits_recursive(n & (n - 1))
```
````

### 2. Using Built-in Functions

````carousel
```python
# Python 3.8+
def count_bits_python(n: int) -> int:
    """Using Python's built-in bit_count() method."""
    return n.bit_count()

# Alternative using bin()
def count_bits_bin(n: int) -> int:
    """Using bin() string conversion."""
    return bin(n).count('1')
```
````

### 3. Parallel Bit Counting (SIMD-style)

````carousel
```python
def count_bits_parallel(n: int) -> int:
    """
    Optimized bit counting using parallel operations.
    Works on 32-bit integers.
    """
    n = n - ((n >> 1) & 0x55555555)
    n = (n & 0x33333333) + ((n >> 2) & 0x33333333)
    n = (n + (n >> 4)) & 0x0F0F0F0F
    n = n + (n >> 8)
    n = n + (n >> 16)
    return n & 0x3F
```
````

### 4. Counting Bits in a Range

````carousel
```python
def count_bits_range(l: int, r: int) -> list:
    """
    Count bits for all numbers in range [l, r].
    Uses DP approach with offset.
    """
    # Get counts for [0, r]
    all_counts = count_bits_dp(r)
    
    if l == 0:
        return all_counts
    
    # Subtract counts for [0, l-1]
    l_minus_1_counts = count_bits_dp(l - 1)
    
    # Return range [l, r]
    return [all_counts[i] - l_minus_1_counts[i] for i in range(l, r + 1)]
```
````

---

## Practice Problems

### Problem 1: Number of 1 Bits

**Problem:** [LeetCode 191 - Number of 1 Bits](https://leetcode.com/problems/number-of-1-bits/)

**Description:** Write a function that takes an unsigned integer and returns the number of '1' bits it has (also known as the Hamming weight).

**How to Apply:**
- Use Brian Kernighan's algorithm for optimal O(k) time
- Or use built-in `n.bit_count()` in Python

---

### Problem 2: Counting Bits

**Problem:** [LeetCode 338 - Counting Bits](https://leetcode.com/problems/counting-bits/)

**Description:** Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` (0 ≤ i ≤ n), `ans[i]` is the number of 1's in the binary representation of `i`.

**How to Apply:**
- Use DP approach: `result[i] = result[i >> 1] + (i & 1)`
- This leverages previously computed values for efficiency

---

### Problem 3: Hamming Distance

**Problem:** [LeetCode 461 - Hamming Distance](https://leetcode.com/problems/hamming-distance/)

**Description:** The Hamming distance between two integers is the number of positions at which the corresponding bits are different. Given two integers `x` and `y`, return the Hamming distance between them.

**How to Apply:**
- Use `x ^ y` to find differing bits
- Count the set bits in the result using Brian Kernighan's algorithm

---

### Problem 4: Reverse Bits

**Problem:** [LeetCode 190 - Reverse Bits](https://leetcode.com/problems/reverse-bits/)

**Description:** Reverse bits of a given 32-bit unsigned integer.

**How to Apply:**
- Use bit manipulation to reverse each bit
- Can count bits during the reversal process for practice

---

### Problem 5: Power of Two

**Problem:** [LeetCode 231 - Power of Two](https://leetcode.com/problems/power-of-two/)

**Description:** Given an integer `n`, return `true` if it is a power of two, or `false` otherwise.

**How to Apply:**
- Use property: `n > 0` and `n & (n - 1) == 0`
- A power of two has exactly one set bit
- This variation uses the same core concept

---

## Video Tutorial Links

### Fundamentals

- [Brian Kernighan's Algorithm (Take U Forward)](https://www.youtube.com/watch?v=9Xyt8xvL-1I) - Detailed explanation of the algorithm
- [Counting Bits - LeetCode 338 (NeetCode)](https://www.youtube.com/watch?v George's-Algorithm) - DP approach explanation
- [Bit Manipulation Masterclass (WilliamFiset)](https://www.youtube.com/watch?v=7rvZ7S3z9iI) - Comprehensive bit manipulation guide

### Advanced Topics

- [Hamming Weight Implementation](https://www.youtube.com/watch?v=vhZ9t3QBPEs) - Various approaches
- [Bit Hacks for Programmers](https://www.youtube.com/watch?v=Zusi7dk_PL_M) - Advanced bit manipulation tricks
- [Built-in Population Count](https://www.youtube.com/watch?v=5e6s63Wz9wQ) - Using language built-ins

---

## Follow-up Questions

### Q1: Why is `n & (n - 1)` always a power of 2 less than n when n is a power of 2?

**Answer:** When n is a power of 2 (e.g., 8 = 1000 in binary), n - 1 flips all bits below the single 1 (e.g., 7 = 0111). The AND operation then results in 0, confirming that n had only one set bit. This property is used to check if a number is a power of two.

### Q2: Can you count bits for negative integers?

**Answer:** For signed integers with two's complement representation:
- Python: Uses arbitrary precision, `n.bit_count()` works directly
- C/C++: Use unsigned types or reinterpret cast
- Java: Use `Integer.bitCount()` which treats as unsigned
- JavaScript: Bitwise operations are 32-bit signed, use `>>> 0` for unsigned

### Q3: What is the fastest method for counting bits in production code?

**Answer:** 
1. **Use built-in functions**: Most languages have optimized built-ins
   - Python: `n.bit_count()`
   - C++: `__builtin_popcount()`
   - Java: `Integer.bitCount()`
   - JavaScript: No built-in, use lookup table or parallel method

2. **Lookup table**: Fastest for multiple queries with fixed width
3. **SIMD instructions**: For massive data processing

### Q4: How does the DP approach for counting bits work?

**Answer:** The recurrence `result[i] = result[i >> 1] + (i & 1)` works because:
- `i >> 1` removes the least significant bit
- `(i & 1)` extracts the least significant bit (0 or 1)
- Adding them gives the total count of set bits
- Example: i=5 (101), i>>1=2 (10), i&1=1, result[2]=1, so result[5]=1+1=2

### Q5: What is the relationship between bit counting and the number of operations needed?

**Answer:** Brian Kernighan's algorithm performs exactly k iterations where k is the number of set bits. This makes it optimal because:
- We must at least see each set bit once
- The algorithm achieves this lower bound
- For sparse numbers (few 1s), it's much faster than O(log n)

---

## Summary

Counting bits is a fundamental bit manipulation technique with multiple approaches suited for different scenarios. Key takeaways:

- **Brian Kernighan's Algorithm**: O(k) time, O(1) space - optimal for single queries
- **DP Precomputation**: O(n) build, O(1) query - ideal for range queries
- **Lookup Table**: O(1) per query, fixed space - best for frequent queries
- **Built-in Functions**: Most convenient - use when available

When to use:
- ✅ Single number with sparse bits → Brian Kernighan's
- ✅ Multiple queries in range [0, n] → DP approach
- ✅ Maximum performance needed → Lookup table
- ✅ Quick implementation → Built-in functions

This technique is essential for competitive programming and technical interviews, especially in problems involving bit manipulation, Hamming distance, and power-of-two checking.

---

## Related Algorithms

- [Single Number](./single-number.md) - Using XOR and bit counting
- [Bitwise XOR](./bitwise-xor.md) - XOR operations for finding unique elements
- [Detect Cycle](./detect-cycle.md) - Using bit manipulation in graphs
- [Power of Two](./power-of-two.md) - Related bit manipulation problem
