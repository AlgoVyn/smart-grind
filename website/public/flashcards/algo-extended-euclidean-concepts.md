## Extended Euclidean: Core Concepts

What is the Extended Euclidean algorithm and how does it differ from the standard Euclidean algorithm?

<!-- front -->

---

### Fundamental Definition

Extended Euclidean finds integers x, y such that:

```
ax + by = gcd(a, b)
```

This is **Bézout's identity** - the linear combination representation of GCD.

**Standard Euclidean:** Only finds gcd(a, b)  
**Extended:** Also finds Bézout coefficients x, y

---

### Mathematical Foundation

**Euclidean Algorithm:**
```
gcd(a, b) = gcd(b, a mod b)
Base case: gcd(a, 0) = a
```

**Extended Extension:**
At each step, track coefficients:
```
a·x₁ + b·y₁ = gcd(a, b)
b·x₂ + (a mod b)·y₂ = gcd(b, a mod b)
```

Since `a mod b = a - ⌊a/b⌋·b`, we can backtrack to find x₁, y₁.

---

### Primary Applications

| Application | How Extended GCD Helps |
|-------------|------------------------|
| **Modular inverse** | Find x where ax ≡ 1 (mod m) |
| **Linear Diophantine** | Solve ax + by = c for integers |
| **RSA cryptography** | Key generation, decryption |
| **Chinese Remainder** | Combine congruences |

---

### Complexity Analysis

| Aspect | Value |
|--------|-------|
| **Time** | O(log min(a,b)) - same as standard |
| **Space** | O(log min(a,b)) - recursion depth |
| **Steps** | At most 5·log₁₀(min(a,b)) for Fibonacci inputs |

Lamé's theorem: Number of steps ≤ 5 × digits of smaller number.

<!-- back -->
