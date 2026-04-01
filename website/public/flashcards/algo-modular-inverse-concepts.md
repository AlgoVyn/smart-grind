## Modular Inverse: Core Concepts

What are the fundamental principles of modular multiplicative inverse?

<!-- front -->

---

### Core Concept

The modular inverse of a (mod m) is a number x such that:
```
(a × x) ≡ 1 (mod m)
```

Written as a⁻¹ mod m or inv(a, m).

**Example**: 3⁻¹ mod 7 = 5 because 3 × 5 = 15 ≡ 1 (mod 7)

---

### When Inverse Exists

Inverse exists **if and only if** gcd(a, m) = 1 (a and m are coprime).

| a | m | gcd | Inverse Exists? |
|---|---|-----|-----------------|
| 3 | 7 | 1 | Yes (inv = 5) |
| 6 | 9 | 3 | No |
| 7 | 15 | 1 | Yes (inv = 13) |
| 4 | 8 | 4 | No |

---

### Finding the Inverse: Two Methods

| Method | Requirements | Time | Use When |
|--------|--------------|------|----------|
| Extended Euclidean | gcd(a,m)=1 | O(log min(a,m)) | General case |
| Fermat's Little | m is prime | O(log m) | Modulus is prime |

---

### Extended Euclidean Algorithm

Finds x, y such that: ax + my = gcd(a, m) = 1

Then ax ≡ 1 (mod m), so x is the inverse.

```
Find 3⁻¹ mod 7:
  7 = 2×3 + 1
  3 = 3×1 + 0

Work backwards:
  1 = 7 - 2×3

So: -2×3 + 1×7 = 1
Thus: -2 ≡ 5 (mod 7) is the inverse
```

---

### Fermat's Little Theorem (Prime Modulus)

If m is prime and a not divisible by m:
```
a^(m-1) ≡ 1 (mod m)
a^(m-2) ≡ a⁻¹ (mod m)
```

**Example**: Find 3⁻¹ mod 7
```
3^5 mod 7 = 243 mod 7 = 5 ✓
```

<!-- back -->
