# LCM (Least Common Multiple)

## Category
Mathematics

## Description

The Least Common Multiple (LCM) of two or more integers is the smallest positive integer that is divisible by each of them. It is a fundamental mathematical operation with applications in scheduling, fraction arithmetic, periodic event synchronization, and number theory problems.

LCM is closely related to the Greatest Common Divisor (GCD) through the fundamental formula: lcm(a, b) = |a × b| / gcd(a, b). This relationship allows efficient computation of LCM using the Euclidean algorithm for GCD, which runs in O(log min(a, b)) time. Understanding LCM is essential for solving problems involving periodic patterns, common multiples, and rational number operations.

---

## Concepts

LCM computation relies on several fundamental mathematical concepts.

### 1. Relationship with GCD

The fundamental theorem connecting LCM and GCD:

| Formula | Description |
|---------|-------------|
| **lcm(a, b) × gcd(a, b) = a × b** | Core relationship |
| **lcm(a, b) = (a × b) / gcd(a, b)** | Computational formula |
| **lcm(a, b) = a / gcd(a, b) × b** | Overflow-safe version |

### 2. Properties of LCM

Mathematical properties useful in problem solving:

| Property | Formula | Description |
|----------|---------|-------------|
| **Commutative** | lcm(a, b) = lcm(b, a) | Order doesn't matter |
| **Associative** | lcm(a, lcm(b, c)) = lcm(lcm(a, b), c) | Can compute iteratively |
| **Distributive** | lcm(a, gcd(a, b)) = a | Relationship with GCD |
| **Identity** | lcm(a, 1) = a | 1 is LCM identity |
| **Absorption** | lcm(a, a) = a | Idempotent |

### 3. LCM of Multiple Numbers

Extending to arrays:

```
lcm(a, b, c) = lcm(lcm(a, b), c)

Example:
lcm(4, 6, 8) = lcm(lcm(4, 6), 8)
             = lcm(12, 8)
             = 24
```

### 4. Computational Considerations

Important implementation details:

| Concern | Solution |
|---------|----------|
| **Overflow** | Divide before multiply: (a / gcd) × b |
| **Negative numbers** | Use absolute values |
| **Zero** | lcm(a, 0) = 0 (by convention) |
| **Large numbers** | Use modular arithmetic if possible |

---

## Frameworks

Structured approaches for solving LCM-related problems.

### Framework 1: Basic LCM Computation

```
┌─────────────────────────────────────────────────────────────┐
│  BASIC LCM COMPUTATION FRAMEWORK                              │
├─────────────────────────────────────────────────────────────┤
│  Input: Two integers a and b                                 │
│  Output: lcm(a, b)                                           │
│                                                                │
│  1. Compute g = gcd(a, b) using Euclidean algorithm          │
│  2. Return abs(a * b) // g                                   │
│                                                                │
│  Optimization (prevent overflow):                             │
│  1. Compute g = gcd(a, b)                                      │
│  2. a_div = a // g                                           │
│  3. Return abs(a_div * b)                                      │
│                                                                │
│  Time: O(log(min(a, b))), Space: O(1)                       │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Computing LCM of two numbers.

### Framework 2: Array LCM

```
┌─────────────────────────────────────────────────────────────┐
│  ARRAY LCM FRAMEWORK                                          │
├─────────────────────────────────────────────────────────────┤
│  Input: Array of integers                                    │
│  Output: lcm of all elements                                   │
│                                                                │
│  1. Initialize result = 1                                     │
│  2. For each element x in array:                              │
│       result = lcm(result, x)                                  │
│  3. Return result                                               │
│                                                                │
│  Note: Can overflow quickly with large arrays                │
│  Mitigation: Use modulo if final result can be modded          │
│                                                                │
│  Time: O(n × log(max)), Space: O(1)                         │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Computing LCM of multiple numbers.

### Framework 3: LCM Applications

```
┌─────────────────────────────────────────────────────────────┐
│  LCM APPLICATION PATTERNS                                     │
├─────────────────────────────────────────────────────────────┤
│  Pattern 1: Next Common Multiple                            │
│    Input: Numbers a, b, target t                              │
│    Output: Smallest multiple of both >= t                      │
│    Formula: ((t + l - 1) // l) × l where l = lcm(a, b)       │
│                                                                │
│  Pattern 2: Count Common Multiples                            │
│    Input: a, b, range [L, R]                                  │
│    Output: Count of numbers divisible by both a and b        │
│    Formula: R // l - (L - 1) // l where l = lcm(a, b)        │
│                                                                │
│  Pattern 3: K-th Common Multiple                              │
│    Input: a, b, k                                               │
│    Output: k-th smallest number divisible by both             │
│    Formula: k × lcm(a, b)                                       │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Common LCM application patterns.

---

## Forms

Different manifestations of LCM computation.

### Form 1: Pairwise LCM

Basic two-number LCM.

| Aspect | Details |
|--------|---------|
| **Formula** | lcm(a, b) = abs(a × b) / gcd(a, b) |
| **Time** | O(log(min(a, b))) |
| **Use Case** | Two-number operations |

### Form 2: Iterative Array LCM

LCM of entire array.

| Aspect | Details |
|--------|---------|
| **Formula** | lcm(arr) = lcm(lcm(...lcm(arr[0], arr[1])...), arr[n-1]) |
| **Time** | O(n × log(max)) |
| **Overflow Risk** | High - use divide-first technique |

### Form 3: Modular LCM

LCM with modulo operation.

| Aspect | Details |
|--------|---------|
| **Challenge** | LCM can overflow, then mod |
| **Solution** | Compute with prime factorization, then mod |
| **Use Case** | Large number LCM with modular output |

### Form 4: Fraction LCM

LCM for fraction denominators.

| Aspect | Details |
|--------|---------|
| **Use** | Finding common denominator |
| **Formula** | lcm of denominators |
| **Application** | Fraction addition/subtraction |

### Form 5: Weighted LCM

LCM with coefficients or constraints.

| Aspect | Details |
|--------|---------|
| **Use** | Extended LCM problems |
| **Variation** | Constrained multiples, weighted events |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Safe LCM (Overflow Prevention)

Prevent overflow by dividing first:

```python
import math

def lcm_safe(a, b):
    """
    Compute LCM with overflow protection.
    Time: O(log(min(a,b))), Space: O(1)
    """
    a, b = abs(a), abs(b)
    if a == 0 or b == 0:
        return 0
    
    g = math.gcd(a, b)
    # Divide before multiply to prevent overflow
    a_div = a // g
    
    # Check for overflow
    if a_div > (2**63 - 1) // b:
        raise OverflowError("LCM exceeds 64-bit limit")
    
    return a_div * b
```

### Tactic 2: Array LCM with Modulo

Compute LCM modulo m:

```python
def lcm_array_mod(arr, mod):
    """
    Compute LCM of array modulo mod.
    Uses prime factorization approach.
    """
    from collections import defaultdict
    
    # Count maximum power of each prime
    prime_powers = defaultdict(int)
    
    for x in arr:
        temp = x
        d = 2
        while d * d <= temp:
            count = 0
            while temp % d == 0:
                temp //= d
                count += 1
            if count > 0:
                prime_powers[d] = max(prime_powers[d], count)
            d += 1
        if temp > 1:
            prime_powers[temp] = max(prime_powers[temp], 1)
    
    # Compute LCM from prime factorization
    result = 1
    for prime, power in prime_powers.items():
        result = (result * pow(prime, power, mod)) % mod
    
    return result
```

### Tactic 3: Count Common Multiples in Range

Count multiples of both a and b in [L, R]:

```python
def count_common_multiples(a, b, left, right):
    """
    Count numbers in [left, right] divisible by both a and b.
    Time: O(log(min(a,b))), Space: O(1)
    """
    import math
    l = (a * b) // math.gcd(a, b)
    return right // l - (left - 1) // l
```

### Tactic 4: Next Common Multiple

Find smallest multiple >= target:

```python
def next_common_multiple(a, b, target):
    """
    Smallest number >= target divisible by both a and b.
    Time: O(log(min(a,b))), Space: O(1)
    """
    import math
    l = (a * b) // math.gcd(a, b)
    remainder = target % l
    if remainder == 0:
        return target
    return target + (l - remainder)
```

### Tactic 5: K-th Common Multiple

Find k-th multiple divisible by both:

```python
def kth_common_multiple(a, b, k):
    """
    Find kth number divisible by both a and b.
    Time: O(log(min(a,b))), Space: O(1)
    """
    import math
    l = (a * b) // math.gcd(a, b)
    return l * k
```

---

## Python Templates

### Template 1: Basic LCM

```python
import math

def lcm(a: int, b: int) -> int:
    """
    Compute LCM using GCD.
    
    Args:
        a: First integer
        b: Second integer
    
    Returns:
        Least common multiple of a and b
        
    Time: O(log(min(a,b)))
    Space: O(1)
    """
    if a == 0 or b == 0:
        return 0
    return abs(a * b) // math.gcd(a, b)
```

### Template 2: LCM with Overflow Protection

```python
def lcm_safe(a: int, b: int) -> int:
    """
    Compute LCM with overflow protection.
    
    Args:
        a: First integer
        b: Second integer
    
    Returns:
        Least common multiple
        
    Raises:
        OverflowError: If LCM exceeds system limits
        
    Time: O(log(min(a,b)))
    Space: O(1)
    """
    a, b = abs(a), abs(b)
    if a == 0 or b == 0:
        return 0
    
    g = math.gcd(a, b)
    a_div = a // g
    
    # Check for potential overflow (64-bit limit example)
    if a_div > (2**63 - 1) // b:
        raise OverflowError("LCM exceeds 64-bit limit")
    
    return a_div * b
```

### Template 3: Array LCM

```python
def lcm_array(arr: list[int]) -> int:
    """
    Compute LCM of all elements in array.
    
    Args:
        arr: List of integers
    
    Returns:
        LCM of all elements
        
    Time: O(n * log(max))
    Space: O(1)
    """
    if not arr:
        return 0
    
    result = arr[0]
    for i in range(1, len(arr)):
        result = lcm_safe(result, arr[i])
    
    return result
```

### Template 4: Count Multiples in Range

```python
def count_multiples_in_range(a: int, b: int, left: int, right: int) -> int:
    """
    Count numbers in [left, right] divisible by both a and b.
    
    Args:
        a: First divisor
        b: Second divisor
        left: Range start (inclusive)
        right: Range end (inclusive)
    
    Returns:
        Count of common multiples in range
        
    Time: O(log(min(a,b)))
    Space: O(1)
    """
    l = lcm(a, b)
    return right // l - (left - 1) // l
```

### Template 5: Modular LCM using Prime Factorization

```python
def lcm_modulo(arr: list[int], mod: int) -> int:
    """
    Compute LCM of array modulo mod using prime factorization.
    
    Args:
        arr: List of integers
        mod: Modulus
    
    Returns:
        LCM modulo mod
        
    Time: O(n * sqrt(max))
    Space: O(sqrt(max))
    """
    from collections import defaultdict
    
    prime_powers = defaultdict(int)
    
    for x in arr:
        temp = x
        d = 2
        while d * d <= temp:
            count = 0
            while temp % d == 0:
                temp //= d
                count += 1
            if count > 0:
                prime_powers[d] = max(prime_powers[d], count)
            d += 1
        if temp > 1:
            prime_powers[temp] = max(prime_powers[temp], 1)
    
    result = 1
    for prime, power in prime_powers.items():
        result = (result * pow(prime, power, mod)) % mod
    
    return result
```

### Template 6: Nth Magical Number (LeetCode 878)

```python
def nthMagicalNumber(n: int, a: int, b: int) -> int:
    """
    LeetCode 878: Nth Magical Number.
    Find nth number divisible by a or b.
    
    Args:
        n: Position to find
        a: First magic number base
        b: Second magic number base
    
    Returns:
        nth magical number modulo 10^9 + 7
    """
    MOD = 10**9 + 7
    
    l = lcm(a, b)
    
    # Binary search
    left, right = 1, n * min(a, b)
    
    while left < right:
        mid = (left + right) // 2
        # Count numbers <= mid divisible by a or b
        count = mid // a + mid // b - mid // l
        
        if count < n:
            left = mid + 1
        else:
            right = mid
    
    return left % MOD
```

---

## When to Use

Use LCM when you need to solve problems involving:

- **Periodic Events**: Finding when repeating events align
- **Fraction Arithmetic**: Common denominators for addition/subtraction
- **Scheduling**: Synchronizing tasks with different periods
- **Number Theory**: Problems involving multiples and divisibility
- **Resource Allocation**: Distributing resources in cycles

### Comparison with Alternatives

| Operation | Use LCM | Use GCD | Use Product |
|-----------|---------|---------|-------------|
| Common multiples | Yes | No | Sometimes |
| Common divisors | No | Yes | No |
| Fraction common denominator | Yes | No | No |
| Period alignment | Yes | No | Sometimes |
| Simplification | No | Yes | No |

### When to Choose LCM vs GCD

- **Choose LCM** when:
  - Finding common multiples or synchronization points
  - Working with periodic patterns
  - Computing common denominators
  - "When will events align" type problems

- **Choose GCD** when:
  - Finding common divisors
  - Simplifying fractions
  - Checking coprimality
  - Solving Diophantine equations

---

## Algorithm Explanation

### Core Concept

The LCM of two numbers is the smallest number that both divide evenly. It represents the "meeting point" of two periodic sequences and is fundamental to understanding multiplicative relationships between integers.

### How It Works

#### Step 1: Prime Factorization Understanding

For any number, we can write it as prime powers:
```
a = p₁^a₁ × p₂^a₂ × ... × pₙ^aₙ
b = p₁^b₁ × p₂^b₂ × ... × pₙ^bₙ

lcm(a, b) = p₁^max(a₁,b₁) × p₂^max(a₂,b₂) × ... × pₙ^max(aₙ,bₙ)
gcd(a, b) = p₁^min(a₁,b₁) × p₂^min(a₂,b₂) × ... × pₙ^min(aₙ,bₙ)
```

#### Step 2: The LCM-GCD Relationship

```
lcm(a, b) × gcd(a, b) = a × b

Proof: For each prime p:
  max(aᵢ, bᵢ) + min(aᵢ, bᵢ) = aᵢ + bᵢ
```

This is why lcm(a, b) = (a × b) / gcd(a, b)

### Visual Representation

**LCM on Number Line:**
```
Multiples of 4: 4, 8, 12, 16, 20, 24, 28, ...
Multiples of 6: 6, 12, 18, 24, 30, 36, ...
                      ↑           ↑
                    LCM = 12    Next common = 24

lcm(4, 6) = 12
```

### Why LCM is Important

1. **Period Synchronization**: When will two repeating events align?
2. **Fraction Arithmetic**: Finding common denominators
3. **Resource Management**: Cyclic resource allocation
4. **Number Theory Foundation**: Building block for advanced concepts

### Limitations

- **Overflow**: LCM grows quickly; use divide-first approach
- **Computational**: Prime factorization approach is slower
- **Multiple Numbers**: Becomes very large very quickly

---

## Practice Problems

### Problem 1: Nth Magical Number

**Problem:** [LeetCode 878 - Nth Magical Number](https://leetcode.com/problems/nth-magical-number/)

**Description:** Find the nth positive integer that is divisible by either a or b.

**How to Apply LCM:**
- Use inclusion-exclusion: count = n//a + n//b - n//lcm(a,b)
- Binary search on answer
- LCM used to avoid double counting

---

### Problem 2: Ugly Number II

**Problem:** [LeetCode 264 - Ugly Number II](https://leetcode.com/problems/ugly-number-ii/)

**Description:** Find the nth ugly number (numbers whose prime factors are 2, 3, or 5).

**How to Apply:**
- Related to LCM concepts with multiple bases
- Use merge/multiple pointer technique

---

### Problem 3: Maximize GCD of an Array

**Problem:** [LeetCode 1815 - Maximum GCD Sum of Two Subsequences](https://leetcode.com/problems/maximum-gcd-sum-of-two-subsequences/)

**Description:** Find maximum GCD sum (related to LCM/GCD problems).

**How to Apply:**
- LCM/GCD duality
- Number theory optimization

---

### Problem 4: Minimum Cost to Make Array Equal

**Problem:** [LeetCode 2448 - Minimum Cost to Make Array Equal](https://leetcode.com/problems/minimum-cost-to-make-array-equal/)

**Description:** Find minimum cost to make all array elements equal.

**How to Apply:**
- Uses median/mean concepts
- Related to number theory optimization

---

## Video Tutorial Links

### Fundamentals

- [LCM and GCD - Khan Academy](https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:gcd-lcm) - Basic concepts
- [LCM Explained - Math Antics](https://www.youtube.com/watch?v=3j9K7_1iP9s) - Visual explanation

### Competitive Programming

- [Number Theory - Codeforces](https://codeforces.com/blog/entry/46492) - Blog tutorial
- [LCM/GCD Problems - CP-Algorithms](https://cp-algorithms.com/algebra/lcm-gcd.html) - Reference

---

## Follow-up Questions

### Q1: What's the relationship between LCM and GCD?

**Answer:** For any two positive integers a and b: lcm(a, b) × gcd(a, b) = a × b. This means lcm(a, b) = (a × b) / gcd(a, b). This relationship allows efficient LCM computation using the fast Euclidean algorithm for GCD.

---

### Q2: How do I prevent overflow when computing LCM?

**Answer:** Instead of computing (a × b) / gcd(a, b), compute (a / gcd(a, b)) × b. This divides before multiplying, keeping intermediate values smaller. For very large numbers, check if a/gcd > MAX/b before multiplying.

---

### Q3: Can LCM be computed for more than two numbers?

**Answer:** Yes, use the associative property: lcm(a, b, c) = lcm(lcm(a, b), c). Process iteratively through the array. Be aware that LCM grows very quickly with multiple numbers, so overflow is a real concern.

---

### Q4: When should I use prime factorization vs GCD method for LCM?

**Answer:** Use the GCD method (lcm = a×b/gcd) for pairwise LCM—it's faster at O(log n). Use prime factorization when you need LCM modulo m, as the GCD method can overflow even with intermediate steps.

---

### Q5: What are common applications of LCM?

**Answer:** Common applications include: finding when periodic events align, computing common denominators for fractions, scheduling repeating tasks, gear ratios in mechanics, and cryptographic applications in number theory.

---

## Summary

The Least Common Multiple (LCM) is a fundamental mathematical operation with applications in periodicity, fractions, and number theory. The key takeaways are:

1. **LCM-GCD Relationship**: lcm(a, b) × gcd(a, b) = a × b
2. **Efficient Computation**: Use GCD method: lcm(a, b) = (a / gcd(a, b)) × b
3. **Overflow Prevention**: Divide before multiplying
4. **Multiple Numbers**: Apply iteratively using associativity
5. **Applications**: Period synchronization, fraction denominators, scheduling

**When to Use LCM:**
- Finding common multiples
- Synchronizing periodic events
- Computing common denominators
- Number theory problems involving divisibility

**Key Formula:**
```
lcm(a, b) = abs(a × b) / gcd(a, b)
Safe version: (abs(a) // gcd(a, b)) × abs(b)
```

Understanding LCM is essential for competitive programming and mathematical problem solving, especially for problems involving periodicity and divisibility.
