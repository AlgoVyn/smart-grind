## Chinese Remainder: Core Concepts

What is the Chinese Remainder Theorem and how does it solve simultaneous congruences?

<!-- front -->

---

### Fundamental Theorem

If moduli `m₁, m₂, ..., mₖ` are **pairwise coprime**, then for any remainders `a₁, a₂, ..., aₖ`:

```
x ≡ a₁ (mod m₁)
x ≡ a₂ (mod m₂)
...
x ≡ aₖ (mod mₖ)
```

Has a **unique solution modulo M = m₁ × m₂ × ... × mₖ**.

---

### Key Properties

| Property | Meaning |
|----------|---------|
| Existence | Solution guaranteed for coprime moduli |
| Uniqueness | Exactly one solution in [0, M-1] |
| Constructive | Can actually compute the solution |

**Critical requirement:** `gcd(mᵢ, mⱼ) = 1` for all `i ≠ j`

---

### Mathematical Foundation

**Ring isomorphism:**
```
ℤ/Mℤ ≅ ℤ/m₁ℤ × ℤ/m₂ℤ × ... × ℤ/mₖℤ
```

This means:
- Operations in mod M = independent operations in each mod mᵢ
- Enables divide-and-conquer with large numbers

---

### Applications

| Use Case | How CRT Helps |
|----------|---------------|
| Large modulus arithmetic | Split into smaller, faster computations |
| Secret sharing | Distribute shares across different moduli |
| RSA decryption | Speed up with prime factorization |
| Polynomial interpolation | Solve for coefficients |
| Error-correcting codes | Recover from partial information |

---

### When CRT Fails

| Issue | Cause | Solution |
|-------|-------|----------|
| Non-coprime moduli | gcd(mᵢ, mⱼ) > 1 | Check consistency or use extended CRT |
| Inconsistent system | aᵢ ≢ aⱼ (mod gcd(mᵢ, mⱼ)) | No solution exists |

<!-- back -->
