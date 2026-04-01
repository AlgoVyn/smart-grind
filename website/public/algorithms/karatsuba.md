# Karatsuba Multiplication

## Category
Advanced Algorithms / Mathematics

## Description

Karatsuba Multiplication is a fast multiplication algorithm that uses a divide-and-conquer approach to multiply two n-digit numbers in **O(n^log₂(3)) ≈ O(n^1.585)** time, which is faster than the traditional **O(n²)** grade-school multiplication for large numbers.

The algorithm was discovered by Anatoly Karatsuba in 1960 and was the first multiplication algorithm faster than the conventional O(n²) approach. It demonstrates the power of the divide-and-conquer paradigm by reducing the number of recursive multiplications from 4 to 3, achieving significant speedup for numbers with hundreds or thousands of digits.

---

## Concepts

### 1. Divide-and-Conquer Strategy

Karatsuba splits numbers into halves and computes the product using only 3 multiplications instead of 4.

| Approach | Multiplications | Time Complexity |
|----------|-----------------|-----------------|
| **Grade-School** | 4 | O(n²) |
| **Karatsuba** | 3 | O(n^1.585) |
| **Toom-Cook** | 5 (for 3 parts) | O(n^1.465) |
| **FFT-based** | N/A | O(n log n) |

### 2. The Key Insight

Given two numbers x and y, split each into two halves:
```
x = a·10^m + b  (a = high half, b = low half)
y = c·10^m + d  (c = high half, d = low half)
```

Traditional approach needs: a·c, a·d, b·c, b·d (4 multiplications)

Karatsuba approach:
```
z0 = b × d                          (low × low)
z2 = a × c                          (high × high)
z1 = (a + b) × (c + d) - z0 - z2    (cross term)

Result: z2·10^(2m) + z1·10^m + z0
```

The cross term is computed as: `(a+b)(c+d) - ac - bd = ad + bc`

### 3. Recurrence Relation

T(n) = 3T(n/2) + O(n)

By Master Theorem: T(n) = O(n^log₂(3)) ≈ O(n^1.585)

### 4. Base Cases

| Size | Recommended Approach |
|------|---------------------|
| < 10 digits | Direct multiplication |
| 10-100 digits | Karatsuba |
| 100-1000 digits | Karatsuba or Toom-Cook |
| > 1000 digits | FFT-based (Schönhage-Strassen) |

---

## Frameworks

### Framework 1: Standard Karatsuba

```
┌─────────────────────────────────────────────────────────┐
│  KARATSUBA MULTIPLICATION FRAMEWORK                     │
├─────────────────────────────────────────────────────────┤
│  1. Base case: if either number < threshold, return   │
│     direct multiplication                               │
│                                                          │
│  2. Split numbers:                                      │
│     Find m = max(digits) // 2                           │
│     x = a·10^m + b,  y = c·10^m + d                    │
│                                                          │
│  3. Recursive multiplications:                          │
│     z0 = karatsuba(b, d)        // low × low          │
│     z2 = karatsuba(a, c)        // high × high        │
│     z1 = karatsuba(a+b, c+d) - z0 - z2  // cross      │
│                                                          │
│  4. Combine result:                                    │
│     return z2·10^(2m) + z1·10^m + z0                   │
└─────────────────────────────────────────────────────────┘
```

### Framework 2: Hybrid Multiplication Strategy

```
┌─────────────────────────────────────────────────────────┐
│  HYBRID MULTIPLICATION FRAMEWORK                        │
├─────────────────────────────────────────────────────────┤
│  Choose algorithm based on input size:                 │
│                                                          │
│  n < 10:      Direct multiplication                    │
│  10 ≤ n < 1000:  Karatsuba                              │
│  1000 ≤ n < 10000:  Toom-Cook                           │
│  n ≥ 10000:   FFT-based (Schönhage-Strassen)          │
│                                                          │
│  This ensures optimal performance across all sizes    │
└─────────────────────────────────────────────────────────┘
```

---

## Forms

### Form 1: Integer-Based Karatsuba

Uses integer arithmetic with divmod for splitting.

| Aspect | Details |
|--------|---------|
| **Implementation** | Simple, uses built-in integers |
| **Limitations** | Language-dependent integer size limits |
| **Use case** | Medium-sized numbers, easy implementation |

### Form 2: String-Based Karatsuba

Handles arbitrarily large numbers as strings.

| Aspect | Details |
|--------|---------|
| **Implementation** | More complex, manual digit manipulation |
| **Advantages** | No size limits, handles very large numbers |
| **Use case** | Very large numbers, competitive programming |

### Form 3: Polynomial Karatsuba

Applies the same divide-and-conquer to polynomial multiplication.

| Aspect | Details |
|--------|---------|
| **Input** | Polynomial coefficients |
| **Operation** | Polynomial multiplication |
| **Use case** | Symbolic computation, polynomial operations |

---

## Tactics

### Tactic 1: Optimized Base Case Switching

```python
def karatsuba_optimized(x, y, threshold=64):
    """Switch to grade-school for small numbers."""
    # Use grade-school for small numbers (faster due to lower overhead)
    if x < threshold or y < threshold:
        return x * y
    
    # Continue with Karatsuba for large numbers
    n = max(x.bit_length(), y.bit_length()) // 4
    m = n // 2
    mask = (1 << (m * 4)) - 1
    
    high1, low1 = x >> (m * 4), x & mask
    high2, low2 = y >> (m * 4), y & mask
    
    z0 = karatsuba_optimized(low1, low2, threshold)
    z2 = karatsuba_optimized(high1, high2, threshold)
    z1 = karatsuba_optimized(low1 + high1, low2 + high2, threshold) - z0 - z2
    
    return (z2 << (2 * m * 4)) + (z1 << (m * 4)) + z0
```

### Tactic 2: Parallel Karatsuba

```python
from concurrent.futures import ThreadPoolExecutor

def parallel_karatsuba(x, y):
    """Parallelize the three recursive multiplications."""
    if x < 1000 or y < 1000:
        return x * y
    
    n = max(len(str(x)), len(str(y)))
    m = n // 2
    
    high1, low1 = divmod(x, 10**m)
    high2, low2 = divmod(y, 10**m)
    
    with ThreadPoolExecutor(max_workers=3) as executor:
        z0_future = executor.submit(parallel_karatsuba, low1, low2)
        z2_future = executor.submit(parallel_karatsuba, high1, high2)
        z1_future = executor.submit(parallel_karatsuba, low1+high1, low2+high2)
        
        z0 = z0_future.result()
        z2 = z2_future.result()
        z1 = z1_future.result() - z0 - z2
    
    return z2 * 10**(2*m) + z1 * 10**m + z0
```

### Tactic 3: Handling Negative Numbers

```python
def karatsuba_signed(x, y):
    """Handle signed integer multiplication."""
    # Determine sign of result
    negative = (x < 0) ^ (y < 0)
    
    # Work with absolute values
    x, y = abs(x), abs(y)
    
    result = karatsuba(x, y)
    
    return -result if negative else result
```

### Tactic 4: Memory-Efficient Implementation

```python
def karatsuba_memory_efficient(x, y):
    """Reduce memory allocations in recursive calls."""
    # Use iterative approach or memoization
    # Pre-allocate result arrays
    # Reuse memory across recursive levels
    pass
```

---

## Python Templates

### Template 1: Integer Karatsuba

```python
def karatsuba(x: int, y: int) -> int:
    """
    Multiply two integers using Karatsuba algorithm.
    
    Args:
        x: First integer to multiply
        y: Second integer to multiply
        
    Returns:
        Product of x and y
        
    Time: O(n^log2(3)) ≈ O(n^1.585)
    Space: O(n) for recursion stack
    """
    # Base case for small numbers
    if x < 10 or y < 10:
        return x * y
    
    # Calculate the number of digits
    n = max(len(str(x)), len(str(y)))
    m = n // 2
    
    # Split the numbers: x = a*10^m + b, y = c*10^m + d
    high1, low1 = divmod(x, 10**m)  # a, b
    high2, low2 = divmod(y, 10**m)  # c, d
    
    # Recursive steps - only 3 multiplications!
    z0 = karatsuba(low1, low2)        # b × d (low × low)
    z2 = karatsuba(high1, high2)      # a × c (high × high)
    z1 = karatsuba(low1 + high1, low2 + high2) - z0 - z2  # cross term
    
    # Combine results: z2 * 10^(2m) + z1 * 10^m + z0
    return z2 * 10**(2*m) + z1 * 10**m + z0
```

### Template 2: String-Based Karatsuba

```python
def add_strings(num1: str, num2: str) -> str:
    """Add two numbers represented as strings."""
    result = []
    carry = 0
    i, j = len(num1) - 1, len(num2) - 1
    
    while i >= 0 or j >= 0 or carry:
        total = carry
        if i >= 0:
            total += ord(num1[i]) - ord('0')
            i -= 1
        if j >= 0:
            total += ord(num2[j]) - ord('0')
            j -= 1
        result.append(chr(total % 10 + ord('0')))
        carry = total // 10
    
    return ''.join(reversed(result))


def subtract_strings(num1: str, num2: str) -> str:
    """Subtract num2 from num1 (num1 >= num2)."""
    result = []
    borrow = 0
    i, j = len(num1) - 1, len(num2) - 1
    
    while i >= 0:
        diff = ord(num1[i]) - ord('0') - borrow
        if j >= 0:
            diff -= ord(num2[j]) - ord('0')
            j -= 1
        
        if diff < 0:
            diff += 10
            borrow = 1
        else:
            borrow = 0
        
        result.append(chr(diff + ord('0')))
        i -= 1
    
    # Remove leading zeros
    while len(result) > 1 and result[-1] == '0':
        result.pop()
    
    return ''.join(reversed(result))


def karatsuba_string(x: str, y: str) -> str:
    """
    Multiply two large numbers represented as strings.
    
    Time: O(n^1.585)
    Space: O(n)
    """
    # Handle signs
    negative = False
    if x[0] == '-':
        negative = not negative
        x = x[1:]
    if y[0] == '-':
        negative = not negative
        y = y[1:]
    
    # Remove leading zeros
    x = x.lstrip('0') or '0'
    y = y.lstrip('0') or '0'
    
    # Base case
    if x == '0' or y == '0':
        return '0'
    if len(x) == 1 and len(y) == 1:
        prod = int(x) * int(y)
        result = str(prod)
        return '-' + result if negative else result
    
    # Pad to equal length
    n = max(len(x), len(y))
    if n % 2 == 1:
        n += 1
    
    x = x.zfill(n)
    y = y.zfill(n)
    
    m = n // 2
    
    # Split
    a, b = x[:m], x[m:]
    c, d = y[:m], y[m:]
    
    # Remove leading zeros for recursive calls
    a, b = a.lstrip('0') or '0', b.lstrip('0') or '0'
    c, d = c.lstrip('0') or '0', d.lstrip('0') or '0'
    
    # Recursive multiplications
    z0 = karatsuba_string(b, d)
    z2 = karatsuba_string(a, c)
    z1_inner = karatsuba_string(add_strings(a, b), add_strings(c, d))
    z1 = subtract_strings(subtract_strings(z1_inner, z0), z2)
    
    # Combine
    result = add_strings(
        add_strings(z2 + '0' * (2 * m), z1 + '0' * m),
        z0
    )
    
    result = result.lstrip('0') or '0'
    
    if negative and result != '0':
        return '-' + result
    return result
```

### Template 3: Optimized Karatsuba with Threshold

```python
def karatsuba_optimized(x: int, y: int, threshold: int = 64) -> int:
    """
    Optimized Karatsuba that switches to grade-school for small numbers.
    
    Args:
        x, y: Integers to multiply
        threshold: Switch to direct multiplication below this digit count
        
    Returns:
        Product of x and y
    """
    # Use grade-school for small numbers (more efficient)
    if x < threshold or y < threshold:
        return x * y
    
    # Calculate size in bits
    n_bits = max(x.bit_length(), y.bit_length())
    n_digits = (n_bits + 3) // 4  # Approximate hex digits
    m = n_digits // 2
    
    # Split using bit shifts (faster than divmod for large numbers)
    shift = m * 4
    mask = (1 << shift) - 1
    
    high1, low1 = x >> shift, x & mask
    high2, low2 = y >> shift, y & mask
    
    # Recursive calls with same threshold
    z0 = karatsuba_optimized(low1, low2, threshold)
    z2 = karatsuba_optimized(high1, high2, threshold)
    z1 = karatsuba_optimized(low1 + high1, low2 + high2, threshold) - z0 - z2
    
    # Combine using bit shifts
    return (z2 << (2 * shift)) + (z1 << shift) + z0
```

### Template 4: Polynomial Karatsuba

```python
class Polynomial:
    """Polynomial represented by coefficient list."""
    
    def __init__(self, coeffs):
        """Coeffs[i] is coefficient of x^i."""
        self.coeffs = coeffs
    
    def karatsuba_multiply(self, other):
        """Multiply two polynomials using Karatsuba."""
        # Base case: small polynomials
        if len(self.coeffs) <= 2 or len(other.coeffs) <= 2:
            return self._naive_multiply(other)
        
        # Split polynomials
        n = max(len(self.coeffs), len(other.coeffs))
        m = n // 2
        
        # A = A1 * x^m + A0, B = B1 * x^m + B0
        a_high = Polynomial(self.coeffs[m:])
        a_low = Polynomial(self.coeffs[:m])
        b_high = Polynomial(other.coeffs[m:])
        b_low = Polynomial(other.coeffs[:m])
        
        # Recursive multiplications
        z0 = a_low.karatsuba_multiply(b_low)
        z2 = a_high.karatsuba_multiply(b_high)
        
        # Cross term
        a_sum = a_low.add(a_high)
        b_sum = b_low.add(b_high)
        z1 = a_sum.karatsuba_multiply(b_sum).subtract(z0).subtract(z2)
        
        # Combine: z2 * x^(2m) + z1 * x^m + z0
        result = z2.shift(2 * m).add(z1.shift(m)).add(z0)
        return result
    
    def _naive_multiply(self, other):
        """Grade-school polynomial multiplication."""
        result = [0] * (len(self.coeffs) + len(other.coeffs) - 1)
        for i, a in enumerate(self.coeffs):
            for j, b in enumerate(other.coeffs):
                result[i + j] += a * b
        return Polynomial(result)
    
    def add(self, other):
        """Add two polynomials."""
        n = max(len(self.coeffs), len(other.coeffs))
        result = []
        for i in range(n):
            a = self.coeffs[i] if i < len(self.coeffs) else 0
            b = other.coeffs[i] if i < len(other.coeffs) else 0
            result.append(a + b)
        return Polynomial(result)
    
    def subtract(self, other):
        """Subtract two polynomials."""
        n = max(len(self.coeffs), len(other.coeffs))
        result = []
        for i in range(n):
            a = self.coeffs[i] if i < len(self.coeffs) else 0
            b = other.coeffs[i] if i < len(other.coeffs) else 0
            result.append(a - b)
        return Polynomial(result)
    
    def shift(self, k):
        """Multiply polynomial by x^k."""
        return Polynomial([0] * k + self.coeffs)
```

---

## When to Use

Use the Karatsuba algorithm when you need to solve problems involving:

- **Large Integer Multiplication**: Numbers with hundreds or thousands of digits
- **Cryptographic Applications**: RSA and encryption schemes
- **Competitive Programming**: Problems requiring big number multiplication
- **Polynomial Multiplication**: Karatsuba can be adapted for polynomials

### Comparison with Alternatives

| Algorithm | Time | Space | Best For |
|-----------|------|-------|----------|
| **Grade-School** | O(n²) | O(1) | Small numbers (< 100 digits) |
| **Karatsuba** | O(n^1.585) | O(n) | Medium-large numbers (100-10K digits) |
| **Toom-Cook** | O(n^1.465) | O(n) | Very large numbers |
| **FFT-based** | O(n log n) | O(n) | Extremely large numbers (10K+ digits) |

### When to Choose Karatsuba vs Grade-School

- **Choose Grade-School** when:
  - Numbers have fewer than 50-100 digits
  - Simple implementation is preferred
  - Memory usage must be minimal

- **Choose Karatsuba** when:
  - Numbers have 100+ digits
  - Multiplication is a bottleneck
  - Recursive overhead is acceptable

---

## Algorithm Explanation

### Core Concept

The key insight is computing the cross term `ad + bc` with just **one multiplication** instead of two:

```
(a + b)(c + d) = ac + ad + bc + bd
(a + b)(c + d) - ac - bd = ad + bc
```

This reduces 4 multiplications to 3.

### How It Works

1. **Split**: Divide each number into high and low halves
2. **Three Products**: Compute `b×d`, `a×c`, and `(a+b)×(c+d)`
3. **Cross Term**: `z1 = (a+b)(c+d) - z0 - z2`
4. **Combine**: `result = z2·10^(2m) + z1·10^m + z0`

### Visual Representation

```
x = 1234, y = 5678

Split at m=2:
x = 12 | 34    →  a = 12,  b = 34
y = 56 | 78    →  c = 56,  d = 78

Traditional (4 multiplications):
12×56 = 672
12×78 = 936
34×56 = 1904
34×78 = 2652
Result: 6720000 + 93600 + 190400 + 2652 = 7006652

Karatsuba (3 multiplications):
z0 = 34×78 = 2652                      (low × low)
z2 = 12×56 = 672                       (high × high)
z1 = (12+34)×(56+78) - 2652 - 672
   = 46×134 - 3324
   = 6164 - 3324 = 2840                (cross term)

Result: 672×10^4 + 2840×10^2 + 2652
       = 6,720,000 + 284,000 + 2,652
       = 7,006,652 ✓
```

### Why It Works

- **Information theory**: 3 values (z0, z1, z2) sufficient to reconstruct 4 unknowns
- **Clever algebra**: `(a+b)(c+d) - ac - bd = ad + bc`
- **Recursive savings**: 3 subproblems at half size gives O(n^1.585)

### Limitations

- **Overhead**: For small n, overhead exceeds savings
- **Recursion depth**: Deep recursion for very large numbers
- **Not optimal**: FFT achieves O(n log n) for very large numbers

---

## Practice Problems

### Problem 1: Multiply Strings

**Problem:** [LeetCode 43 - Multiply Strings](https://leetcode.com/problems/multiply-strings/)

**Description:** Given two non-negative integers represented as strings, return their product as a string. You must not use any built-in BigInteger library or convert the inputs to integers directly.

**How to Apply Karatsuba:**
- Use string-based Karatsuba for O(n^1.585) time
- Handle edge cases like "0" multiplication
- Grade-school fails for very large numbers

---

### Problem 2: Super Pow

**Problem:** [LeetCode 372 - Super Pow](https://leetcode.com/problems/super-pow/)

**Description:** Calculate a^b mod 1337 where b is a very large positive integer given as an array.

**How to Apply Karatsuba:**
- Efficient modular exponentiation requires efficient multiplication
- Karatsuba can speed up repeated multiplication steps
- Understand interaction between fast multiplication and modular arithmetic

---

### Problem 3: Add Two Numbers II

**Problem:** [LeetCode 445 - Add Two Numbers II](https://leetcode.com/problems/add-two-numbers-ii/)

**Description:** You are given two non-empty linked lists representing two non-negative integers. The most significant digit comes first. Add the two numbers and return the sum as a linked list.

**How to Apply Karatsuba:**
- While this focuses on addition, understanding digit manipulation is key
- Similar principles of handling large numbers apply
- Practice working with numbers in non-standard formats

---

### Problem 4: Number of Digit One

**Problem:** [LeetCode 233 - Number of Digit One](https://leetcode.com/problems/number-of-digit-one/)

**Description:** Given an integer n, count the total number of digit 1 appearing in all non-negative integers less than or equal to n.

**How to Apply Karatsuba:**
- Understanding digit manipulation and place values
- Similar divide-and-conquer thinking required
- Practice working with digit decomposition

---

### Problem 5: Integer to English Words

**Problem:** [LeetCode 273 - Integer to English Words](https://leetcode.com/problems/integer-to-english-words/)

**Description:** Convert a non-negative integer to its English words representation.

**How to Apply Karatsuba:**
- Understanding number decomposition and grouping
- Working with large numbers by breaking them into chunks
- Similar pattern of divide and process

---

## Video Tutorial Links

### Fundamentals

- [Karatsuba Algorithm - Fast Multiplication (Gaurav Sen)](https://www.youtube.com/watch?v=JCbSRqD6eog)
- [Karatsuba Multiplication (MIT OpenCourseWare)](https://www.youtube.com/watch?v=eCa2D1b7oOI)
- [Fast Multiplication - Karatsuba (Back To Back SWE)](https://www.youtube.com/watch?v=JCbSRqD6eog)

### Advanced Topics

- [Toom-Cook Multiplication](https://www.youtube.com/watch?v=9J2td6Fl0X4)
- [FFT-based Multiplication (Schönhage-Strassen)](https://www.youtube.com/watch?v=1iRdr7YqJjA)
- [Polynomial Multiplication using FFT](https://www.youtube.com/watch?v=h7apO7l1j4o)

### Competitive Programming

- [Karatsuba in Python](https://www.youtube.com/watch?v=JCbSRqD6eog)
- [BigInteger Implementation](https://www.youtube.com/watch?v=QRSy5E5JzFc)
- [Competitive Programming Tips](https://www.youtube.com/watch?v=Ge0Ugs8Wq3I)

---

## Follow-up Questions

### Q1: Why is Karatsuba O(n^1.585) and not better?

**Answer:** The exponent log₂(3) ≈ 1.585 comes from solving T(n) = 3T(n/2) + O(n). We need at least 3 multiplications to reconstruct the result (information theory bound). More advanced algorithms (Toom-Cook, FFT) achieve better complexity by splitting into more pieces or using different techniques.

### Q2: When should I use Karatsuba vs the built-in multiplication?

**Answer:** Always prefer built-in multiplication for normal-sized numbers - modern CPUs have highly optimized instructions. Use Karatsuba when:
- Working with numbers exceeding 64-bit limits
- Implementing a BigInteger library
- Cryptographic applications with 1024+ bit numbers
- Problem explicitly requires implementing fast multiplication

### Q3: Can Karatsuba handle decimal/floating-point numbers?

**Answer:** Yes, with modifications:
1. Track the decimal position separately
2. Multiply as integers
3. Place the decimal point correctly in the result

Example: 12.34 × 56.78 → multiply 1234 × 5678, then place decimal 4 positions from right.

### Q4: How does Karatsuba compare to FFT-based multiplication?

**Answer:**
| Aspect | Karatsuba | FFT |
|--------|-----------|-----|
| Complexity | O(n^1.585) | O(n log n) |
| Crossover | ~100-1000 digits | ~10,000+ digits |
| Implementation | Moderate | Complex |

FFT becomes faster for very large numbers, but Karatsuba is preferred for medium sizes due to lower constant factors.

### Q5: Can Karatsuba be parallelized?

**Answer:** Yes! The three recursive calls (z0, z2, z1_inner) are independent and can run in parallel on multi-core systems. This can achieve up to 3× speedup, though thread overhead makes it worthwhile only for very large numbers.

---

## Summary

The Karatsuba Multiplication algorithm is a foundational divide-and-conquer algorithm demonstrating how clever mathematical insights can improve upon naive approaches.

**Key Takeaways:**
- **Key Innovation**: Reduces 4 multiplications to 3
- **Time Complexity**: O(n^log₂(3)) ≈ O(n^1.585)
- **Space Complexity**: O(n) for string implementations
- **Best For**: Large integers (100+ digits), cryptographic applications

**When to use:**
- ✅ Large number multiplication beyond built-in limits
- ✅ When implementing arbitrary-precision arithmetic
- ✅ As a building block for more advanced algorithms
- ❌ Small numbers (overhead not worth it)
- ❌ When built-in multiplication is sufficient

The algorithm serves as a stepping stone to understanding even faster multiplication algorithms like Toom-Cook and FFT-based methods.
