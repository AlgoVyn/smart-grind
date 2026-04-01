## Miller-Rabin: Core Concepts

What are the fundamental principles of the Miller-Rabin primality test?

<!-- front -->

---

### Core Concept: Probabilistic Primality Test

Miller-Rabin determines if a number is **probably prime** or **definitely composite**. It's based on properties of strong pseudoprimes.

**Key equation from Fermat's Little Theorem**:
If p is prime and 1 < a < p-1:
```
a^(p-1) ≡ 1 (mod p)
```

---

### Strong Pseudoprime Test

Write n-1 as d × 2^s where d is odd.

For prime n, either:
```
a^d ≡ 1 (mod n)
```
or there exists r in [0, s-1] such that:
```
a^(d × 2^r) ≡ -1 ≡ n-1 (mod n)
```

If neither holds, n is **definitely composite**.

---

### Visual: Miller-Rabin Witness

```
n = 561 (Carmichael number, composite)
n - 1 = 560 = 35 × 2^4  (so d=35, s=4)

Test a = 2:
  2^35 mod 561 = 263  (≠ 1 and ≠ 560)
  2^70 mod 561 = 166  (≠ 560)
  2^140 mod 561 = 67  (≠ 560)
  2^280 mod 561 = 1   (≠ 560)

None equal -1 (560), so 2 is a witness: 561 is composite.
```

---

### Error Probability

| Bases Tested | Probability of False Positive | Use Case |
|--------------|-------------------------------|----------|
| 1 | < 1/4 | Quick screening |
| 5 | < 1/4^5 ≈ 1/1000 | General purpose |
| 10 | < 1/4^10 ≈ 1/10^6 | High confidence |

**Deterministic for n < 2^64**: Testing specific bases {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37}

---

### When Miller-Rabin Lies (Carmichael Numbers)

Carmichael numbers are composite but pass Fermat test for all bases.

```
561 = 3 × 11 × 17  (smallest Carmichael number)
1105 = 5 × 13 × 17
1729 = 7 × 13 × 19
```

Miller-Rabin catches these by testing the strong condition.

<!-- back -->
