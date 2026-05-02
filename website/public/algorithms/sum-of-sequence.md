# Sum of Sequence (Arithmetic and Geometric)

## Category
Mathematics & Number Theory

## Description

The sum of sequences involves calculating the total of arithmetic progressions (AP), geometric progressions (GP), and other series using direct mathematical formulas. These O(1) calculations enable efficient solutions to problems involving consecutive integers, powers, and sequence analysis.

Understanding sequence sum formulas is fundamental for algorithm design, from finding missing elements in arrays to optimizing range queries and solving mathematical programming problems. The formulas provide constant-time alternatives to iterative summation, dramatically improving efficiency for large inputs.

---

## Concepts

Sequence sums rely on fundamental mathematical formulas and properties.

### 1. Arithmetic Progression

| Property | Formula | Notes |
|----------|---------|-------|
| **Sum of 1 to n** | n(n+1)/2 | Most common |
| **Sum of range [a, b]** | (b-a+1)(a+b)/2 | Inclusive |
| **General AP** | n/2 × (2a₁ + (n-1)d) | a₁ = first, d = common difference |
| **Alternative** | n/2 × (a₁ + aₙ) | aₙ = last term |

### 2. Sum of Powers

| Power | Formula | Example |
|-------|---------|---------|
| **Squares** | n(n+1)(2n+1)/6 | 1² + 2² + ... + n² |
| **Cubes** | [n(n+1)/2]² | 1³ + 2³ + ... + n³ |
| **Fourth powers** | n(n+1)(2n+1)(3n²+3n-1)/30 | Higher powers available |

### 3. Geometric Progression

| Property | Formula | Condition |
|----------|---------|-----------|
| **Sum** | a(rⁿ - 1)/(r - 1) | r ≠ 1 |
| **Sum (r = 1)** | a × n | All terms equal |
| **Infinite sum** | a/(1 - r) | \|r\| < 1 |

### 4. Special Sequences

| Sequence | Formula | Use Case |
|----------|---------|----------|
| **Odd numbers** | n² | Sum of first n odd numbers |
| **Even numbers** | n(n+1) | Sum of first n even numbers |
| **Harmonic** | ≈ ln(n) + γ | Approximation |

---

## Frameworks

Structured approaches for sequence sum problems.

### Framework 1: Arithmetic Sum

```
┌─────────────────────────────────────────────────────────────┐
│  ARITHMETIC SEQUENCE SUM                                     │
├─────────────────────────────────────────────────────────────┤
│  Formula: Sum = n × (first + last) / 2                       │
│            or: n × (2a₁ + (n-1)d) / 2                       │
│                                                              │
│  Examples:                                                   │
│  1. Sum 1 to 100:                                           │
│     n=100, first=1, last=100                                 │
│     Sum = 100 × 101 / 2 = 5050                              │
│                                                              │
│  2. Sum 10 to 50:                                           │
│     n = 50 - 10 + 1 = 41                                     │
│     Sum = 41 × (10 + 50) / 2 = 1230                          │
│                                                              │
│  3. AP: 3, 7, 11, 15, ... (100 terms)                       │
│     a₁=3, d=4, n=100                                         │
│     Sum = 100/2 × (2×3 + 99×4) = 50 × 402 = 20100            │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Consecutive integers, arithmetic progressions.

### Framework 2: Missing Number Detection

```
┌─────────────────────────────────────────────────────────────┐
│  FIND MISSING NUMBER USING SUM FORMULA                       │
├─────────────────────────────────────────────────────────────┤
│  Problem: Find missing number in 0..n sequence             │
│                                                              │
│  1. Calculate expected sum: n × (n+1) / 2                 │
│  2. Calculate actual sum: sum of array elements              │
│  3. Missing number = expected - actual                     │
│                                                              │
│  Variation: Two missing numbers                             │
│  1. Use sum and sum of squares                               │
│  2. Let missing be a and b                                   │
│  3. a + b = expected_sum - actual_sum                      │
│  4. a² + b² = expected_sq_sum - actual_sq_sum              │
│  5. Solve system of equations                                │
│                                                              │
│  Example: [0, 1, 3] (n=3, should have 0,1,2,3)             │
│  Expected: 3 × 4 / 2 = 6                                    │
│  Actual: 0 + 1 + 3 = 4                                       │
│  Missing: 6 - 4 = 2 ✓                                       │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Missing element problems, data integrity checks.

### Framework 3: Geometric Sum

```
┌─────────────────────────────────────────────────────────────┐
│  GEOMETRIC SEQUENCE SUM                                      │
├─────────────────────────────────────────────────────────────┤
│  Formula: S = a × (rⁿ - 1) / (r - 1) for r ≠ 1            │
│                                                              │
│  Examples:                                                   │
│  1. 2 + 4 + 8 + 16 (4 terms):                               │
│     a=2, r=2, n=4                                            │
│     S = 2 × (2⁴ - 1) / (2 - 1) = 2 × 15 = 30               │
│                                                              │
│  2. Powers of 2 sum with modulo:                            │
│     Use modular inverse for division                        │
│     S = a × (rⁿ - 1) × modinv(r - 1, mod) % mod            │
│                                                              │
│  Special case r = 1:                                        │
│     S = a × n (all terms equal)                            │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Powers, exponential growth, geometric sequences.

---

## Forms

Different manifestations of sequence sum formulas.

### Form 1: Direct Formula

Standard arithmetic sum application.

| Aspect | Details |
|--------|---------|
| **Formula** | n(n+1)/2 |
| **Use case** | Sum of 1 to n |
| **Complexity** | O(1) |
| **Overflow** | Watch for large n (use 64-bit) |

### Form 2: Range Sum

Sum of consecutive ranges.

| Aspect | Details |
|--------|---------|
| **Formula** | sum(1 to b) - sum(1 to a-1) |
| **Direct** | (b-a+1)(a+b)/2 |
| **Use case** | Range queries, subarray sums |

### Form 3: Missing Element Detection

Using sum differences.

| Aspect | Details |
|--------|---------|
| **Method** | Expected - actual |
| **Variants** | One missing, two missing, AP missing |
| **Use case** | Error detection, incomplete data |

### Form 4: Geometric Applications

Power sums and series.

| Aspect | Details |
|--------|---------|
| **Formula** | a(rⁿ-1)/(r-1) |
| **Modulo** | Use modular inverse |
| **Use case** | Powers, binary representations |

---

## Tactics

Specific techniques for sequence sum problems.

### Tactic 1: Basic Arithmetic Sum

Sum of 1 to n:

```python
def sum_first_n(n):
    """
    Sum of 1 + 2 + ... + n = n * (n + 1) // 2
    """
    return n * (n + 1) // 2

def sum_arithmetic_range(start, end):
    """
    Sum of integers from start to end inclusive.
    """
    if start > end:
        return 0
    return (end - start + 1) * (start + end) // 2
```

### Tactic 2: Sum of Powers

Higher powers:

```python
def sum_of_squares(n):
    """
    Sum of 1² + 2² + ... + n² = n(n+1)(2n+1) / 6
    """
    return n * (n + 1) * (2 * n + 1) // 6

def sum_of_cubes(n):
    """
    Sum of 1³ + 2³ + ... + n³ = [n(n+1)/2]²
    """
    return (n * (n + 1) // 2) ** 2
```

### Tactic 3: Geometric Sum

GP calculations:

```python
def sum_geometric(a, r, n):
    """
    Sum of geometric sequence: a + ar + ar² + ... + ar^(n-1)
    = a * (r^n - 1) / (r - 1) for r != 1
    """
    if r == 1:
        return a * n
    return a * (r ** n - 1) // (r - 1)

def sum_geometric_mod(a, r, n, mod):
    """
    Geometric sum with modulo (for large n).
    """
    if r == 1:
        return (a * n) % mod
    
    # Use modular inverse for division
    numerator = (pow(r, n, mod) - 1) % mod
    inv_denominator = pow(r - 1, mod - 2, mod)  # Fermat's little theorem
    return (a * numerator * inv_denominator) % mod
```

### Tactic 4: Find Missing Number

Using sum difference:

```python
def find_missing(nums):
    """
    Find missing number in sequence 0, 1, ..., n (one missing).
    """
    n = len(nums)
    expected_sum = sum_first_n(n)  # Sum should be 0 + 1 + ... + n
    actual_sum = sum(nums)
    return expected_sum - actual_sum

# XOR approach - O(n) time, O(1) space
def find_missing_xor(nums):
    """
    XOR approach - O(n) time, O(1) space.
    """
    n = len(nums)
    result = n  # Include n (the full sequence has n+1 numbers 0..n)
    
    for i in range(n):
        result ^= i ^ nums[i]
    
    return result
```

### Tactic 5: Find Two Missing Numbers

Using sum and sum of squares:

```python
def find_two_missing(nums):
    """
    Find two missing numbers in 1..n sequence.
    """
    n = len(nums) + 2  # Original had n numbers
    
    # Sum and sum of squares
    expected_sum = sum_first_n(n)
    expected_sum_sq = sum_of_squares(n)
    
    actual_sum = sum(nums)
    actual_sum_sq = sum(x * x for x in nums)
    
    # Let missing be a and b
    diff_sum = expected_sum - actual_sum  # a + b
    diff_sum_sq = expected_sum_sq - actual_sum_sq  # a² + b²
    
    # (a + b)² = a² + 2ab + b²
    # 2ab = (a + b)² - (a² + b²)
    ab = (diff_sum * diff_sum - diff_sum_sq) // 2
    
    # a and b are roots of: x² - (a+b)x + ab = 0
    import math
    discriminant = diff_sum * diff_sum - 4 * ab
    sqrt_disc = int(math.isqrt(discriminant))
    
    a = (diff_sum + sqrt_disc) // 2
    b = diff_sum - a
    
    return [a, b]
```

### Tactic 6: Missing in AP

Binary search for missing element:

```python
def find_missing_in_ap(nums):
    """
    Find missing number in arithmetic progression.
    """
    n = len(nums) + 1  # Original length
    # Common difference
    d = (nums[-1] - nums[0]) // n
    
    # Binary search for gap
    left, right = 0, len(nums) - 1
    while left < right:
        mid = (left + right) // 2
        expected = nums[0] + mid * d
        if nums[mid] == expected:
            left = mid + 1
        else:
            right = mid
    
    return nums[0] + left * d
```

---

## Python Templates

### Template 1: Arithmetic Sum

```python
def sum_first_n(n: int) -> int:
    """
    Sum of first n natural numbers: 1 + 2 + ... + n
    
    Formula: n(n+1)/2
    
    Time: O(1)
    Space: O(1)
    """
    return n * (n + 1) // 2


def sum_range(start: int, end: int) -> int:
    """
    Sum of integers from start to end inclusive.
    
    Formula: (end - start + 1) * (start + end) / 2
    """
    if start > end:
        return 0
    return (end - start + 1) * (start + end) // 2
```

### Template 2: Sum of Powers

```python
def sum_of_squares(n: int) -> int:
    """
    Sum of squares: 1² + 2² + ... + n²
    
    Formula: n(n+1)(2n+1) / 6
    """
    return n * (n + 1) * (2 * n + 1) // 6


def sum_of_cubes(n: int) -> int:
    """
    Sum of cubes: 1³ + 2³ + ... + n³
    
    Formula: [n(n+1)/2]²
    """
    return (n * (n + 1) // 2) ** 2
```

### Template 3: Geometric Sum

```python
def sum_geometric(a: int, r: int, n: int) -> int:
    """
    Sum of geometric sequence: a + ar + ar² + ... + ar^(n-1)
    
    Formula:
    - a * (r^n - 1) / (r - 1) if r != 1
    - a * n if r == 1
    """
    if r == 1:
        return a * n
    return a * (r ** n - 1) // (r - 1)
```

### Template 4: Find Missing Number

```python
def find_missing_number(nums: list) -> int:
    """
    Find missing number in sequence 0, 1, ..., n.
    
    Uses sum formula: missing = expected_sum - actual_sum
    """
    n = len(nums)
    expected = n * (n + 1) // 2  # Sum of 0..n
    actual = sum(nums)
    return expected - actual
```

---

## When to Use

Use sequence sum formulas when you need to solve problems involving:

- **Range queries**: Sum of consecutive integers
- **Missing elements**: Find missing number using sum difference
- **AP/GP problems**: Arithmetic and geometric progression sums
- **Optimization**: Replace O(n) iteration with O(1) formula
- **Mathematical programming**: Number theory problems

### Common Formula Applications

| Problem | Formula | Use Case |
|---------|---------|----------|
| **Sum 1 to n** | n(n+1)/2 | Basic range sum |
| **Sum range [a,b]** | (b-a+1)(a+b)/2 | Range queries |
| **Missing number** | Expected - actual | Error detection |
| **Sum of squares** | n(n+1)(2n+1)/6 | Power sums |
| **Geometric sum** | a(rⁿ-1)/(r-1) | Exponential series |

---

## Algorithm Explanation

### Core Concept

Mathematical formulas allow O(1) calculation of sums that would require O(n) iteration. The key insight is recognizing patterns (consecutive integers, powers, geometric series) and applying the appropriate closed-form formula.

### Derivation of Sum Formula

For sum of 1 to n:
```
S = 1 + 2 + 3 + ... + (n-1) + n
S = n + (n-1) + (n-2) + ... + 2 + 1
------------------------------------
2S = (n+1) + (n+1) + ... + (n+1)  [n times]
2S = n(n+1)
S = n(n+1)/2
```

### Visual Walkthrough

**Finding Missing Number**:
```
Array: [0, 1, 3, 4] (n=4, should have 0,1,2,3,4)

Expected sum (0+1+2+3+4): 4×5/2 = 10
Actual sum (0+1+3+4): 8

Missing: 10 - 8 = 2 ✓
```

---

## Practice Problems

### Problem 1: Missing Number

**Problem:** [LeetCode 268 - Missing Number](https://leetcode.com/problems/missing-number/)

**Description:** Given array containing n distinct numbers in [0, n], find the missing number.

**How to Apply:**
- Use sum formula: n(n+1)/2
- Subtract actual sum from expected
- Or use XOR approach

---

### Problem 2: Missing Number In Arithmetic Progression

**Problem:** [LeetCode 1228 - Missing Number In Arithmetic Progression](https://leetcode.com/problems/missing-number-in-arithmetic-progression/)

**Description:** Find missing number in an arithmetic progression.

**How to Apply:**
- Calculate common difference
- Binary search for gap
- Or use sum formula

---

### Problem 3: Sum of Square Numbers

**Problem:** [LeetCode 633 - Sum of Square Numbers](https://leetcode.com/problems/sum-of-square-numbers/)

**Description:** Determine if a number can be expressed as sum of two squares.

**How to Apply:**
- Iterate possible squares
- Check if remainder is perfect square
- Use two-pointer technique

---

### Problem 4: Find Missing Observations

**Problem:** [LeetCode 2028 - Find Missing Observations](https://leetcode.com/problems/find-missing-observations/)

**Description:** Find missing observations to achieve target mean.

**How to Apply:**
- Calculate required sum for missing values
- Distribute using arithmetic principles

---

## Video Tutorial Links

### Fundamentals

- [Arithmetic Series Sum](https://www.youtube.com/watch?v=Kcfy4z5_3Uw) - Derivation
- [Missing Number Problems](https://www.youtube.com/watch?v=5q8JxC5f3Wg) - Various techniques
- [Geometric Series](https://www.youtube.com/watch?v=9LjsQqf2r0s) - Formula and applications

### Applications

- [LeetCode 268 Solution](https://www.youtube.com/watch?v=9bK8b3-q8) - Missing Number
- [LeetCode 1228 Solution](https://www.youtube.com/watch?v=5q8JxC5f3Wg) - Missing in AP

---

## Follow-up Questions

### Q1: Why does the sum formula n(n+1)/2 work?

**Answer**: Pair first and last: 1+n = n+1, 2+(n-1) = n+1, etc. There are n/2 such pairs, each summing to n+1. Total = n(n+1)/2. This is known as Gauss's formula (attributed to a childhood story about Carl Friedrich Gauss).

### Q2: Can these formulas overflow?

**Answer**: Yes! For large n (near 10^9), n(n+1) can exceed 32-bit integer range. Use 64-bit integers (long long in C++, long in Java/Python handles big integers automatically). For modular arithmetic, compute (n % mod) × ((n+1) % mod) / 2 using modular inverse for division.

### Q3: How do I find multiple missing numbers?

**Answer**: Use multiple equations:
- 1 missing: sum
- 2 missing: sum and sum of squares
- k missing: sum of 1st, 2nd, ..., k-th powers
This creates a system of k equations with k unknowns.

### Q4: What's the difference between arithmetic and geometric sums?

**Answer**:
- **Arithmetic**: Terms have common difference (linear growth)
- **Geometric**: Terms have common ratio (exponential growth)
- Arithmetic sum is quadratic in n, geometric sum is exponential in n

### Q5: When should I use XOR instead of sum formula for missing number?

**Answer**: 
- **Sum**: More intuitive, can handle large n if using big integers
- **XOR**: No overflow issues, but only works for single missing number in consecutive sequence

---

## Summary

Sum of sequence formulas provide powerful O(1) tools for solving problems involving consecutive integers, powers, and series. These mathematical shortcuts replace iterative approaches and form the foundation for more advanced algorithms.

**Key Takeaways:**

1. **Arithmetic Sum**: n(n+1)/2 for 1 to n
2. **Range Sum**: (b-a+1)(a+b)/2 for [a,b]
3. **Missing Number**: Expected - actual sum
4. **Sum of Powers**: Specific formulas for squares, cubes
5. **Geometric Sum**: a(rⁿ-1)/(r-1)

**When to Use:**
- Range sum queries
- Missing element detection
- AP/GP problems
- Optimization of iterative summation
- Mathematical programming

These fundamental formulas are essential for competitive programming and frequently appear in technical interviews as optimization techniques.
