## Modular Exponentiation: Core Concepts

What are the fundamental principles of modular exponentiation?

<!-- front -->

---

### Core Concept

Compute (base^exponent) % modulus efficiently without overflow.

**Naive**: base^exponent then % modulus - overflows for large exponents.
**Smart**: Use properties of modular arithmetic to keep numbers small.

---

### Key Mathematical Properties

| Property | Formula | Use |
|----------|---------|-----|
| (a × b) % m | = [(a % m) × (b % m)] % m | Keep products small |
| a^b % m | Can compute step by step | Iterative reduction |
| Binary decomposition | a^13 = a^8 × a^4 × a^1 | Fast exponentiation |

---

### Binary Exponentiation (Square-and-Multiply)

Decompose exponent into powers of 2:
```
13 = 1101₂ = 8 + 4 + 0 + 1
a^13 = a^8 × a^4 × a^1
```

Compute by repeated squaring:
```
a^1 = a
a^2 = (a^1)^2
a^4 = (a^2)^2
a^8 = (a^4)^2
```

Only O(log exponent) multiplications needed!

---

### Visual: Fast Exponentiation

```
Compute 3^13 mod 7

Exponent 13 = 1101₂

Step 1: result = 1, base = 3, exp = 13
  exp & 1 = 1: result = 1 × 3 = 3
  base = 3^2 = 9 ≡ 2 (mod 7)
  exp >>= 1 → 6

Step 2: result = 3, base = 2, exp = 6
  exp & 1 = 0: skip multiply
  base = 2^2 = 4 (mod 7)
  exp >>= 1 → 3

Step 3: result = 3, base = 4, exp = 3
  exp & 1 = 1: result = 3 × 4 = 12 ≡ 5
  base = 4^2 = 16 ≡ 2
  exp >>= 1 → 1

Step 4: result = 5, base = 2, exp = 1
  exp & 1 = 1: result = 5 × 2 = 10 ≡ 3
  exp >>= 1 → 0

Result: 3^13 mod 7 = 3
```

---

### Complexity Comparison

| Method | Time | Space | Max Intermediate Value |
|--------|------|-------|------------------------|
| Naive | O(n) | O(1) | base^n (huge!) |
| Iterative modular | O(n) | O(1) | < m² |
| Binary (fast) | O(log n) | O(1) | < m² |

**n** = exponent value

<!-- back -->
