## Modular Inverse: Comparison

How do different modular inverse approaches compare?

<!-- front -->

---

### Method Comparison Table

| Method | Time | Space | Prerequisites | Best For |
|--------|------|-------|---------------|----------|
| Extended Euclid | O(log min(a,m)) | O(1) | gcd(a,m)=1 | General use |
| Fermat's | O(log m) | O(1) | m prime | Prime modulus |
| Euler's | O(φ(m)) | O(1) | Know φ(m) | Special cases |
| Precompute | O(m) | O(m) | m small | Many queries |
| Batch | O(n + log mod) | O(n) | n inverses | Same mod, multiple values |

---

### Extended Euclid vs Fermat's

| Aspect | Extended Euclid | Fermat's |
|--------|-----------------|----------|
| Works for | Any coprime a,m | Prime modulus only |
| Time | ~log steps | ~log m multiplications |
| Constants | Lower | Higher (pow overhead) |
| Code size | Larger | Smaller |
| Python | `mod_inverse()` | `pow(a, p-2, p)` |

**Rule of thumb**: Use Fermat for prime mod, Extended Euclid otherwise.

---

### Precomputation Trade-offs

| Scenario | Method | Break-even Point |
|----------|--------|------------------|
| Need inv[1..n] | Range precompute | n > 100 |
| Need random inv | Per-call Extended Euclid | Always |
| nCr queries | Factorial + inv precompute | > 10 queries |

---

### Common Moduli in Competitions

| Modulus | Type | Inverse Method |
|---------|------|----------------|
| 10⁹+7 | Prime | Fermat's |
| 10⁹+9 | Prime | Fermat's |
| 998244353 | Prime | Fermat's |
| 2^32 | Power of 2 | Extended Euclid (odd only) |

---

### Error Cases to Handle

| Case | gcd(a, m) | Result | Action |
|------|-----------|--------|--------|
| a = 0 | m | No inverse | Return None |
| a ≡ 0 (mod m) | m | No inverse | Return None |
| gcd > 1 | > 1 | No inverse | Return None or exception |
| a < 0 | Check | May exist | Normalize a % m first |

```python
def robust_inverse(a, m):
    a = ((a % m) + m) % m  # Normalize to [0, m-1]
    if a == 0:
        return None
    return mod_inverse(a, m)
```

<!-- back -->
