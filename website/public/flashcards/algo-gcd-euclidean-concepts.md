## GCD Euclidean: Core Concepts

What is the Euclidean algorithm for GCD and how does it work?

<!-- front -->

---

### Fundamental Definition

The Euclidean algorithm finds the **Greatest Common Divisor (GCD)** of two numbers using the property:

```
gcd(a, b) = gcd(b, a mod b)
```

**Key insight:** GCD doesn't change if we replace the larger number with its remainder when divided by the smaller.

---

### Algorithm Steps

```
gcd(48, 18):
  = gcd(18, 48 mod 18) = gcd(18, 12)
  = gcd(12, 18 mod 12) = gcd(12, 6)
  = gcd(6, 12 mod 6)   = gcd(6, 0)
  = 6

Division steps: 48/18 = 2 R 12
                18/12 = 1 R 6
                12/6  = 2 R 0
```

---

### Complexity Analysis

| Aspect | Value |
|--------|-------|
| **Time** | O(log min(a, b)) |
| **Space** | O(1) iterative, O(log n) recursive |
| **Steps** | ≤ 5 × log₁₀(min(a, b)) + 1 |

**Lamé's Theorem:** Number of steps ≤ 5 × digits of smaller number.

---

### Mathematical Properties

| Property | Description |
|----------|-------------|
| **Commutative** | gcd(a, b) = gcd(b, a) |
| **Associative** | gcd(a, gcd(b, c)) = gcd(gcd(a, b), c) |
| **gcd(a, 0)** | = |a| |
| **gcd(a, 1)** | = 1 |
| **LCM relation** | lcm(a, b) × gcd(a, b) = |a × b| |

<!-- back -->
