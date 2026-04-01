## Title: Sieve of Eratosthenes - Frameworks

What are the structured approaches for implementing the Sieve?

<!-- front -->

---

### Framework 1: Basic Sieve Template

```
┌─────────────────────────────────────────────────────┐
│  BASIC SIEVE OF ERATOSTHENES FRAMEWORK               │
├─────────────────────────────────────────────────────┤
│  1. Create boolean array is_prime[0...n], init True │
│  2. Mark is_prime[0] = is_prime[1] = False          │
│  3. For p from 2 to √n:                               │
│     a. If is_prime[p] is True:                       │
│        - Mark all multiples from p² to n as False    │
│  4. Collect all indices where is_prime[i] is True    │
│  5. Return list of primes                              │
└─────────────────────────────────────────────────────┘
```

**When to use:** Finding all primes up to n, basic prime generation.

---

### Framework 2: Optimized Sieve (Odd Numbers Only)

```
┌─────────────────────────────────────────────────────┐
│  OPTIMIZED SIEVE FRAMEWORK (Odd Numbers Only)        │
├─────────────────────────────────────────────────────┤
│  1. Handle n < 2: return []                           │
│  2. If n >= 2: start with [2]                       │
│  3. Create boolean array for odd numbers only          │
│     - Index i represents number 2i + 3                │
│  4. For i from 0 to (√n - 3) / 2:                     │
│     a. If is_prime[i] is True:                       │
│        - p = 2i + 3                                   │
│        - Mark multiples starting from (p²-3)/2        │
│  5. Convert indices back to numbers and return         │
└─────────────────────────────────────────────────────┘
```

**When to use:** Memory-constrained environments, ~2x speedup.

---

### Framework 3: SPF (Smallest Prime Factor) Sieve

```
┌─────────────────────────────────────────────────────┐
│  SMALLEST PRIME FACTOR (SPF) SIEVE FRAMEWORK         │
├─────────────────────────────────────────────────────┤
│  1. Initialize spf[i] = i for all i (each number   │
│     is its own smallest prime factor initially)      │
│  2. For i from 2 to √n:                               │
│     a. If spf[i] == i (i is prime):                   │
│        - For j from i² to n, step i:                  │
│          - If spf[j] == j: set spf[j] = i            │
│  3. Return spf array                                  │
│  4. Use spf for O(log n) factorization                │
└─────────────────────────────────────────────────────┘
```

**When to use:** When you need prime factorization queries after sieve.

<!-- back -->
