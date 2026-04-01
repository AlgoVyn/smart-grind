# Inclusion-Exclusion Principle

## Category
Math & Number Theory

## Description

The **Principle of Inclusion-Exclusion (PIE)** is a fundamental combinatorial technique for counting the size of the union of multiple sets by adding the sizes of individual sets and subtracting the sizes of their intersections appropriately. It provides a systematic way to avoid overcounting when sets overlap.

The principle can be stated as follows: To count the number of elements in the union of several sets, start by adding the sizes of individual sets, then subtract the sizes of all pairwise intersections, add back the sizes of all triple intersections, subtract the sizes of all quadruple intersections, and so on, alternating signs until all possible intersections are accounted for. This technique is essential for solving counting problems where direct enumeration is difficult due to overlapping constraints.

---

## Concepts

### 1. Set Unions and Intersections

The foundation of inclusion-exclusion lies in understanding how sets overlap:

| Sets | Formula | Key Insight |
|------|---------|-------------|
| **Two Sets** | \|A ∪ B\| = \|A\| + \|B\| - \|A ∩ B\| | Subtract the double-counted intersection |
| **Three Sets** | \|A ∪ B ∪ C\| = \|A\| + \|B\| + \|C\| - \|A∩B\| - \|A∩C\| - \|B∩C\| + \|A∩B∩C\| | Add singles, subtract pairs, add triple |
| **n Sets** | Σ(-1)^(\|S\|+1) × \|∩ᵢ∈S Aᵢ\| | Alternating sum over all non-empty subsets |

### 2. The Alternating Sum Pattern

The key insight is the alternating sign pattern based on subset size:

| Subset Size | Sign | Term |
|-------------|------|------|
| 1 (single sets) | + | Add \|Aᵢ\| |
| 2 (pairs) | - | Subtract \|Aᵢ ∩ Aⱼ\| |
| 3 (triples) | + | Add \|Aᵢ ∩ Aⱼ ∩ Aₖ\| |
| k | (-1)^(k+1) | Add/subtract k-way intersections |

### 3. Bitmask Enumeration

For implementing inclusion-exclusion with k conditions, we use bitmask enumeration:

| Bitmask | Binary | Included Sets | Count |
|---------|--------|---------------|-------|
| 1 | 001 | A₁ | C(1,1) |
| 2 | 010 | A₂ | C(2,1) |
| 3 | 011 | A₁ ∩ A₂ | C(2,2) |
| 4 | 100 | A₃ | C(3,1) |
| 5 | 101 | A₁ ∩ A₃ | C(3,2) |
| ... | ... | ... | ... |

Each bit represents whether a condition is included. We iterate through all non-empty subsets (masks 1 to 2^k - 1).

### 4. Complement Counting

Often it's easier to count the complement:

```
|Universal| - |A ∪ B ∪ C| = Count of elements in NONE of the sets
```

This is useful for "count numbers NOT divisible by any of..." problems.

---

## Frameworks

### Framework 1: Basic Inclusion-Exclusion

```
┌─────────────────────────────────────────────────────────────┐
│  INCLUSION-EXCLUSION FRAMEWORK                              │
├─────────────────────────────────────────────────────────────┤
│  1. Identify the k sets/conditions                          │
│  2. Determine the universal set size                        │
│  3. For each non-empty subset of conditions:                │
│     a. Calculate the intersection size                      │
│     b. Determine sign: (+) for odd-sized, (-) for even      │
│     c. Add signed intersection to result                    │
│  4. Return the alternating sum                              │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Union counting with explicit set definitions.

### Framework 2: Coprime Counting

```
┌─────────────────────────────────────────────────────────────┐
│  COPRIME COUNTING FRAMEWORK                                 │
├─────────────────────────────────────────────────────────────┤
│  1. Factorize n to get prime factors p₁, p₂, ..., pₖ      │
│  2. Define sets: Aᵢ = {multiples of pᵢ}                    │
│  3. Compute |Aᵢ₁ ∩ ... ∩ Aᵢⱼ| = ⌊N / (pᵢ₁ × ... × pᵢⱼ)⌋   │
│  4. Apply PIE: count divisible by at least one prime      │
│  5. Answer: N - (count from step 4) = coprime count         │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Counting numbers coprime to n in a range.

### Framework 3: Derangement Counting

```
┌─────────────────────────────────────────────────────────────┐
│  DERANGEMENT COUNTING FRAMEWORK                             │
├─────────────────────────────────────────────────────────────┤
│  1. Define sets: Aᵢ = {permutations where element i fixed} │
│  2. Universal set: All n! permutations                       │
│  3. Intersection size: |Aᵢ₁ ∩ ... ∩ Aᵢₖ| = (n-k)!         │
│  4. Apply PIE: Σ(-1)^k × C(n,k) × (n-k)!                   │
│  5. Simplify: n! × Σ((-1)^k / k!) ≈ round(n!/e)            │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Counting permutations where no element is in its original position.

---

## Forms

### Form 1: Two Set Inclusion-Exclusion

For two sets A and B:
```
|A ∪ B| = |A| + |B| - |A ∩ B|
```

**Example**: In a class of 30 students:
- 18 play football (set A)
- 15 play basketball (set B)  
- 8 play both sports
- Number playing at least one sport = 18 + 15 - 8 = 25

### Form 2: Three Set Inclusion-Exclusion

For three sets A, B, and C:
```
|A ∪ B ∪ C| = |A| + |B| + |C| 
              - |A ∩ B| - |A ∩ C| - |B ∩ C|
              + |A ∩ B ∩ C|
```

**Intuition**:
1. Add all singles: Elements in exactly one set are counted once ✓
2. Subtract all pairs: Elements in exactly two sets were counted twice, subtracted once → counted once ✓
3. Add back triple: Elements in all three sets were counted 3 times, subtracted 3 times, need to add once ✓

### Form 3: General n-Set Formula

For n sets A₁, A₂, ..., Aₙ:
```
|A₁ ∪ A₂ ∪ ... ∪ Aₙ| = Σ(-1)^(|S|+1) × |∩ᵢ∈S Aᵢ|
                       for all non-empty subsets S ⊆ {1, 2, ..., n}
```

Or equivalently:
```
|∪ᵢ₌₁ⁿ Aᵢ| = Σₖ₌₁ⁿ (-1)^(k+1) × Σ |Aᵢ₁ ∩ Aᵢ₂ ∩ ... ∩ Aᵢₖ|
             over all k-element subsets
```

### Form 4: Complement Form

Count elements in NONE of the sets:
```
|Universal| - |A ∪ B ∪ C| = Count of elements satisfying "none"
```

**Example**: Count numbers ≤ 100 NOT divisible by 2, 3, or 5:
- Direct PIE on coprime condition: complex
- Complement: PIE on divisible condition (simpler), then subtract from 100

---

## Tactics

### Tactic 1: Prime Factorization for Coprime Counting

```python
def get_prime_factors(n: int) -> list[int]:
    """Get unique prime factors of n."""
    factors = []
    d = 2
    while d * d <= n:
        if n % d == 0:
            factors.append(d)
            while n % d == 0:
                n //= d
        d += 1
    if n > 1:
        factors.append(n)
    return factors


def count_coprime(n: int, limit: int) -> int:
    """Count numbers ≤ limit coprime to n."""
    factors = get_prime_factors(n)
    m = len(factors)
    
    # Count numbers divisible by at least one prime factor
    divisible_count = 0
    
    for mask in range(1, 1 << m):
        bits = bin(mask).count('1')
        product = 1
        for i in range(m):
            if mask & (1 << i):
                product *= factors[i]
        
        count = limit // product
        sign = 1 if bits % 2 == 1 else -1
        divisible_count += sign * count
    
    # Numbers NOT divisible by any prime factor = coprime
    return limit - divisible_count
```

### Tactic 2: LCM for Non-Coprime Divisors

When counting multiples, use LCM not product when divisors share factors:

```python
from math import gcd

def count_multiples(divisors: list[int], limit: int) -> int:
    """Count numbers ≤ limit divisible by at least one divisor."""
    n = len(divisors)
    result = 0
    
    for mask in range(1, 1 << n):
        bits = bin(mask).count('1')
        
        # Calculate LCM of selected divisors
        lcm = 1
        for i in range(n):
            if mask & (1 << i):
                lcm = lcm * divisors[i] // gcd(lcm, divisors[i])
                if lcm > limit:
                    break
        
        if lcm <= limit:
            count = limit // lcm
            sign = 1 if bits % 2 == 1 else -1
            result += sign * count
    
    return result
```

### Tactic 3: Derangement Formula

```python
def count_derangements(n: int, mod: int = 10**9 + 7) -> int:
    """
    Count derangements: permutations where no element appears 
    in its original position.
    Formula: D(n) = n! × Σ((-1)^k / k!) for k = 0 to n
    """
    # Calculate n! mod mod
    fact = 1
    for i in range(1, n + 1):
        fact = (fact * i) % mod
    
    # Sum of (-1)^k / k! for k = 0 to n
    inv_fact = 1  # 1/0! = 1
    result = inv_fact  # k = 0 term
    
    for k in range(1, n + 1):
        inv_k = pow(k, mod - 2, mod)  # Modular inverse
        inv_fact = (inv_fact * inv_k) % mod  # 1/k!
        
        if k % 2 == 0:
            result = (result + inv_fact) % mod
        else:
            result = (result - inv_fact + mod) % mod
    
    return (fact * result) % mod
```

### Tactic 4: Euler's Totient via PIE

```python
def euler_totient(n: int) -> int:
    """
    Calculate Euler's totient function φ(n).
    φ(n) = count of numbers ≤ n that are coprime to n.
    """
    factors = get_prime_factors(n)
    m = len(factors)
    
    result = n
    
    for mask in range(1, 1 << m):
        bits = bin(mask).count('1')
        product = 1
        
        for i in range(m):
            if mask & (1 << i):
                product *= factors[i]
        
        # Add or subtract n/product
        if bits % 2 == 1:
            result -= n // product
        else:
            result += n // product
    
    return result
```

---

## Python Templates

### Template 1: Basic Inclusion-Exclusion

```python
from itertools import combinations

def inclusion_exclusion_union(sets: list[set]) -> int:
    """
    Calculate |A₁ ∪ A₂ ∪ ... ∪ Aₙ| using inclusion-exclusion.
    Time: O(2^n × cost_of_intersection)
    Space: O(n)
    """
    n = len(sets)
    result = 0
    
    # Iterate over all non-empty subsets
    for r in range(1, n + 1):
        for subset_indices in combinations(range(n), r):
            # Calculate intersection of selected sets
            intersection = sets[subset_indices[0]]
            for i in subset_indices[1:]:
                intersection = intersection & sets[i]
            
            # Add or subtract based on subset size
            sign = 1 if r % 2 == 1 else -1
            result += sign * len(intersection)
    
    return result
```

### Template 2: Coprime Counting with PIE

```python
def get_prime_factors(n: int) -> list[int]:
    """Get unique prime factors of n."""
    factors = []
    d = 2
    while d * d <= n:
        if n % d == 0:
            factors.append(d)
            while n % d == 0:
                n //= d
        d += 1
    if n > 1:
        factors.append(n)
    return factors


def count_coprime(n: int, limit: int) -> int:
    """
    Count numbers ≤ limit that are coprime to n.
    Uses inclusion-exclusion on prime factors of n.
    Time: O(2^m × √n) where m = number of prime factors
    """
    factors = get_prime_factors(n)
    m = len(factors)
    
    # Count numbers divisible by at least one prime factor
    divisible_count = 0
    
    for mask in range(1, 1 << m):
        bits = bin(mask).count('1')
        
        # Product of selected prime factors
        product = 1
        for i in range(m):
            if mask & (1 << i):
                product *= factors[i]
        
        count = limit // product
        sign = 1 if bits % 2 == 1 else -1
        divisible_count += sign * count
    
    # Numbers NOT divisible = coprime
    return limit - divisible_count
```

### Template 3: Multiples Counting with LCM

```python
from math import gcd

def count_multiples(divisors: list[int], limit: int) -> int:
    """
    Count numbers ≤ limit divisible by at least one divisor.
    Uses LCM for non-coprime divisors.
    Time: O(2^n × log(max(divisors)))
    """
    n = len(divisors)
    result = 0
    
    for mask in range(1, 1 << n):
        bits = bin(mask).count('1')
        
        # Calculate LCM of selected divisors
        lcm = 1
        for i in range(n):
            if mask & (1 << i):
                lcm = lcm * divisors[i] // gcd(lcm, divisors[i])
                if lcm > limit:
                    break
        
        if lcm <= limit:
            count = limit // lcm
            sign = 1 if bits % 2 == 1 else -1
            result += sign * count
    
    return result
```

### Template 4: Derangement Counting

```python
def count_derangements(n: int, mod: int = 10**9 + 7) -> int:
    """
    Count derangements: permutations where no element appears 
    in its original position.
    Formula: D(n) = n! × Σ((-1)^k / k!)
    Time: O(n log mod)
    """
    # Calculate n! mod mod
    fact = 1
    for i in range(1, n + 1):
        fact = (fact * i) % mod
    
    # Sum of (-1)^k / k!
    inv_fact = 1
    result = inv_fact
    
    for k in range(1, n + 1):
        inv_k = pow(k, mod - 2, mod)
        inv_fact = (inv_fact * inv_k) % mod
        
        if k % 2 == 0:
            result = (result + inv_fact) % mod
        else:
            result = (result - inv_fact + mod) % mod
    
    return (fact * result) % mod
```

### Template 5: Euler's Totient Function

```python
def euler_totient(n: int) -> int:
    """
    Calculate Euler's totient function φ(n).
    φ(n) = count of numbers ≤ n coprime to n.
    Alternative formula: φ(n) = n × Π(1 - 1/p) for distinct prime factors p.
    Time: O(2^m × √n) where m = number of prime factors
    """
    factors = get_prime_factors(n)
    m = len(factors)
    
    result = n
    
    for mask in range(1, 1 << m):
        bits = bin(mask).count('1')
        product = 1
        
        for i in range(m):
            if mask & (1 << i):
                product *= factors[i]
        
        if bits % 2 == 1:
            result -= n // product
        else:
            result += n // product
    
    return result
```

### Template 6: General PIE with Custom Intersection

```python
def inclusion_exclusion_custom(
    n: int, 
    get_intersection_size: callable
) -> int:
    """
    General inclusion-exclusion with custom intersection function.
    
    Args:
        n: Number of sets/conditions
        get_intersection_size: Function that takes a bitmask and returns
                              the size of intersection of sets in the mask
    """
    result = 0
    
    for mask in range(1, 1 << n):
        bits = bin(mask).count('1')
        intersection_size = get_intersection_size(mask)
        
        sign = 1 if bits % 2 == 1 else -1
        result += sign * intersection_size
    
    return result
```

---

## When to Use

Use the Inclusion-Exclusion Principle when you need to solve problems involving:

- **Union Counting**: Finding the total number of elements in the union of multiple overlapping sets
- **Complement Counting**: Calculating "at least one" or "none" conditions efficiently
- **Constraint Satisfaction**: Counting objects that satisfy at least one of several properties
- **Number Theory Problems**: Counting coprime numbers, multiples, or numbers with specific divisibility properties
- **Derangements**: Counting permutations where no element appears in its original position

### Comparison with Alternative Counting Methods

| Method | Best For | Time Complexity | Space Complexity |
|--------|----------|-----------------|------------------|
| **Direct Enumeration** | Small sets, no overlaps | O(n) | O(1) |
| **Inclusion-Exclusion** | Multiple overlapping constraints | O(2^k × f(n)) | O(k) |
| **DP + Bitmask** | Subset counting with states | O(2^n × n) | O(2^n) |
| **Mobius Inversion** | Divisor-based counting | O(n log n) | O(n) |
| **Generating Functions** | Complex combinatorial structures | Varies | Varies |

### When to Choose Inclusion-Exclusion

- **Choose Inclusion-Exclusion** when:
  - You need to count elements satisfying "at least one" of k conditions
  - You can efficiently compute intersections of the sets
  - The number of conditions k is small (typically k ≤ 20)
  - The problem has a natural set-based structure

- **Consider Alternatives** when:
  - k is large (use Mobius inversion or other techniques)
  - You need dynamic updates (use segment trees or Fenwick trees)
  - The structure allows DP with bitmask optimizations

---

## Algorithm Explanation

### Core Concept

The inclusion-exclusion principle is based on the idea that when we simply add up the sizes of individual sets, elements in the intersections are counted multiple times. We systematically correct this overcounting by subtracting and adding back intersections of various sizes.

### How It Works

#### Two Sets:
1. Add sizes of both sets: |A| + |B|
2. Elements in A ∩ B were counted twice, so subtract once: -|A ∩ B|
3. Result: |A| + |B| - |A ∩ B|

#### Three Sets:
1. Add all singles: |A| + |B| + |C|
2. Subtract all pairs: -|A∩B| - |A∩C| - |B∩C|
3. Elements in A∩B∩C were counted 3-3 = 0 times, so add back: +|A∩B∩C|

### Visual Representation

**Two Sets (Venn Diagram):**
```
    ┌─────────┐
    │   A     │
    │  ┌───┐  │
    │  │A∩B│  │
    │  └───┘  │
    └─────────┘
        B
```

**Three Sets (Venn Diagram):**
```
         ┌─────┐
       ┌─┤  A  ├─┐
       │ └─────┘ │
    ┌──┴──┐   ┌──┴──┐
    │  B  │███│  C  │
    └──┬──┘   └──┬──┘
       │  ┌───┐  │
       └──┤A∩B∩C├──┘
          └───┘
    █ = Pairwise intersections
    Center = Triple intersection
```

### Why It Works

The alternating sum ensures each element is counted exactly once:
- Elements in exactly one set: counted once (in a single term)
- Elements in exactly k sets: counted C(k,1) - C(k,2) + C(k,3) - ... = 1 time

This follows from the binomial theorem: Σ(-1)^(i+1) × C(k,i) = 1

### Limitations

- **Exponential Complexity**: O(2^k) where k is the number of sets
- **Intersection Computation**: Requires efficient computation of intersection sizes
- **Practical Limit**: Typically limited to k ≤ 20-25 sets
- **Floating Point Issues**: For probability calculations, be aware of precision loss

---

## Practice Problems

### Problem 1: Number of Ways to Form Target String

**Problem:** [LeetCode 1639 - Number of Ways to Form a Target String Given a Dictionary](https://leetcode.com/problems/number-of-ways-to-form-a-target-string-given-a-dictionary/)

**Description:** Given a list of strings `words` and a string `target`, form `target` using characters from `words` following specific rules about column selection.

**How to Apply Inclusion-Exclusion:**
- Uses complementary counting combined with DP
- Alternative: Direct DP with frequency counting per column

---

### Problem 2: Maximum XOR for Each Query

**Problem:** [LeetCode 1829 - Maximum XOR for Each Query](https://leetcode.com/problems/maximum-xor-for-each-query/)

**Description:** Given a sorted array `nums`, after each operation (increasing all elements by 1), calculate the XOR of all elements and find maximum possible XOR.

**How to Apply Inclusion-Exclusion:**
- Understand XOR properties through set-based thinking
- Use bitmask manipulation and properties of XOR

---

### Problem 3: Points That Intersect With Cars

**Problem:** [LeetCode 2848 - Points That Intersect With Cars](https://leetcode.com/problems/points-that-intersect-with-cars/)

**Description:** Given intervals representing cars on a number line, return the total number of integer points covered by at least one car.

**How to Apply Inclusion-Exclusion:**
- Direct application of union of intervals
- Sort intervals and use sweep line (alternative to PIE)

---

### Problem 4: Find the Number of Ways to Place People

**Problem:** [LeetCode 3027 - Find the Number of Ways to Place People II](https://leetcode.com/problems/find-the-number-of-ways-to-place-people-ii/)

**Description:** Given points on a 2D plane, count ways to place two people at different points such that one is at top-left and the other at bottom-right.

**How to Apply Inclusion-Exclusion:**
- Count valid pairs using coordinate compression
- Use inclusion-exclusion to handle overlapping constraints

---

### Problem 5: Count Vowel Strings in Ranges

**Problem:** [LeetCode 2559 - Count Vowel Strings in Ranges](https://leetcode.com/problems/count-vowel-strings-in-ranges/)

**Description:** Given an array of strings `words` and queries asking for strings starting and ending with vowels in a range.

**How to Apply Inclusion-Exclusion:**
- Preprocess using prefix sums (similar to union counting)
- Alternative: Use bitmask to represent vowel constraints

---

## Video Tutorial Links

### Fundamentals

- [Inclusion-Exclusion Principle - Introduction (WilliamFiset)](https://www.youtube.com/watch?v=YG0jVZqZ1rI) - Excellent visual explanation with examples
- [Inclusion Exclusion Principle Explained (Neso Academy)](https://www.youtube.com/watch?v=UTyI5GVI5BM) - Comprehensive theoretical foundation
- [Competitive Programming - PIE (Errichto)](https://www.youtube.com/watch?v=7UV1hSkX2Uo) - CP-focused tutorial with code

### Applications and Problem Solving

- [Counting Coprimes with Inclusion-Exclusion (Codeforces)](https://www.youtube.com/watch?v=KQqg6F2Mx7E) - Number theory applications
- [Derangements and Inclusion-Exclusion (Tushar Roy)](https://www.youtube.com/watch?v=F3QBa1bz1zg) - Derangement counting
- [Inclusion-Exclusion for Probability (Khan Academy)](https://www.youtube.com/watch?v=2kNvtMyrSPI) - Probability theory applications

### Advanced Topics

- [Mobius Inversion and Inclusion-Exclusion (Algorithms Live!)](https://www.youtube.com/watch?v=Qn4Jx1V4_wA) - Advanced number theory connections
- [Generalized Inclusion-Exclusion (MIT OpenCourseWare)](https://www.youtube.com/watch?v=blRzXKlqFJQ) - Mathematical foundations

---

## Follow-up Questions

### Q1: What's the maximum number of sets for practical use?

**Answer:** Typically 20-30 sets maximum due to the O(2^n) complexity. For n = 20, we have 2^20 ≈ 1 million operations. For n = 25, we have ~33 million operations. For more sets:
- Use **Mobius inversion** for divisor-based problems
- Use **dynamic programming with bitmask** if there's state overlap
- Use **approximation algorithms** for estimation
- Consider **meet-in-the-middle** techniques

---

### Q2: Can I optimize when sets have special structure?

**Answer:** Yes! Several optimizations exist:
- **Nested sets**: If A ⊆ B, then |A ∪ B| = |B| (simpler calculation)
- **Disjoint sets**: |A ∪ B| = |A| + |B| (no subtraction needed)
- **Chain structure**: Can use dynamic programming instead
- **Symmetric structure**: Exploit symmetry to reduce computation by half

---

### Q3: When should I use complement counting vs direct counting?

**Answer:** Use **complement counting** when:
- Counting "none" or "at least one" is easier than exact counting
- The union is complex but the universal set is simple
- Problems ask for "not divisible by any" rather than "divisible by specific"

Use **direct counting** when:
- The union structure is simple
- You need exact intersection sizes anyway
- Complement would require counting a massive universal set

---

### Q4: How does inclusion-exclusion relate to the Mobius function?

**Answer:** The **Mobius inversion formula** is a generalization of inclusion-exclusion:

```
If f(n) = Σ g(d) for all d|n, then g(n) = Σ μ(d) × f(n/d) for all d|n
```

Where μ is the Mobius function:
- μ(1) = 1
- μ(n) = 0 if n has a squared prime factor
- μ(n) = (-1)^k if n is a product of k distinct primes

For divisor-based counting, Mobius inversion often provides a more efficient O(n log n) solution compared to O(2^k) PIE.

---

### Q5: How do I handle floating-point precision in probability calculations?

**Answer:** When using inclusion-exclusion for probabilities:
- Use **exact fractions** when possible (rational arithmetic)
- For floating-point, use **double precision** (64-bit) minimum
- Be aware of **catastrophic cancellation** when subtracting similar values
- Consider **Kahan summation** for better accuracy with many terms
- **Log-space computation** for very small probabilities

---

## Summary

The **Principle of Inclusion-Exclusion** is a powerful counting technique essential for solving problems with overlapping constraints.

### Core Formula
```
|A₁ ∪ A₂ ∪ ... ∪ Aₙ| = Σ(-1)^(|S|+1) × |∩ᵢ∈S Aᵢ|
```

### When to Use
- ✅ Counting union of overlapping sets
- ✅ "At least one" or "none" conditions
- ✅ Number theory (coprime, multiple counting)
- ✅ Derangements and constrained permutations
- ✅ Probability of union of events

### Implementation Strategy
1. Identify the k conditions/sets
2. Determine the universal set size
3. For each non-empty subset of conditions:
   - Calculate the intersection size
   - Add/subtract based on subset cardinality
4. Return the alternating sum

### Complexity Considerations
- **Time**: O(2^k × f(n)) where k = number of conditions
- **Space**: O(k) typically
- Practical limit: k ≤ 20-25 for reasonable runtime

### Common Patterns
| Pattern | Formula/Approach |
|---------|-----------------|
| Coprime counting | N - count of numbers sharing any prime factor with M |
| Multiples counting | PIE over divisors using LCM |
| Derangements | n! × Σ((-1)^k / k!) |
| At least one | Direct PIE on union |
| None satisfy | Universal - PIE(union) |

The inclusion-exclusion principle bridges the gap between simple counting and complex combinatorial problems, making it an indispensable tool in competitive programming.

### Related Algorithms

- [Sieve of Eratosthenes](./sieve-eratosthenes.md) - Prime factorization support
- [Euler's Totient](./euler-totient.md) - Related number-theoretic function
- [GCD and LCM](./gcd-euclidean.md) - Essential for LCM calculations
- [Mobius Function](./mobius-function.md) - Generalization of inclusion-exclusion
