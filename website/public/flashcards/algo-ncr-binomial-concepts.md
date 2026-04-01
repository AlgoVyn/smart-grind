## nCr Binomial: Core Concepts

What are the fundamental principles of binomial coefficient computation?

<!-- front -->

---

### Core Concept

nCr ("n choose r") = number of ways to choose r elements from n elements.

```
nCr = n! / (r! × (n-r)!)
```

**Pascal's Identity**: nCr = (n-1)C(r-1) + (n-1)Cr

---

### Mathematical Properties

| Property | Formula | Use |
|----------|---------|-----|
| Symmetry | nCr = nC(n-r) | Reduce computation |
| Pascal's | nCr = (n-1)C(r-1) + (n-1)Cr | DP recurrence |
| Factorial | nCr = n!/(r!(n-r)!) | Direct computation |
| Multiplicative | nCr = Π(i=1 to r)(n-r+i)/i | Avoid large factorials |

---

### Visual: Pascal's Triangle

```
        1              n=0, C(0,0)=1
      1   1            n=1
    1   2   1          n=2
  1   3   3   1        n=3
1   4   6   4   1      n=4

Each entry = sum of two above
6 = 3 + 3
```

---

### Modulo Considerations

Computing nCr mod m depends on relationship between n, r and m:

| Case | Method | Complexity |
|------|--------|------------|
| m prime, n < m | Factorial + Fermat | O(n) precalc, O(1) query |
| m prime, n ≥ m | Lucas Theorem | O(log_m n) |
| m composite | Chinese Remainder + prime power | Complex |

---

### Special Values

| Expression | Value | When |
|------------|-------|------|
| nC0 | 1 | Always |
| nCn | 1 | Always |
| nC1 | n | Always |
| nC2 | n(n-1)/2 | n ≥ 2 |
| nCr | 0 | r < 0 or r > n |

<!-- back -->
