## nCr Binomial: Comparison

How do different binomial coefficient approaches compare?

<!-- front -->

---

### Method Comparison Table

| Method | Precompute Time | Query Time | Space | Best For |
|--------|----------------|------------|-------|----------|
| Pascal DP | O(max_n²) | O(1) | O(max_n²) | All nCr needed |
| Factorial | O(max_n) | O(1) | O(max_n) | Many queries, prime mod |
| Multiplicative | None | O(r) | O(1) | Single query |
| Lucas | None | O(log_p n) | O(1) | Large n, prime mod |
| CRT + Lucas | None | O(k log_p n) | O(1) | Large n, any mod |

---

### Factorial vs Pascal's Triangle

| Aspect | Factorial Method | Pascal DP |
|--------|------------------|-----------|
| Precompute | O(n) | O(n²) |
| Space | O(n) | O(n²) or O(n) |
| Query | O(1) | O(1) |
| Mod requirement | Prime (for inverse) | Any |
| Code complexity | Medium | Simple |

**Recommendation**: Use factorial for prime mod, Pascal for small mod or exact values.

---

### When to Use Each Method

| Scenario | Recommended Method | Why |
|----------|---------------------|-----|
| n ≤ 1000, many queries | Factorial precompute | Fast queries |
| n ≤ 60, exact value | Pascal or built-in | Exact integer |
| n ≥ mod (prime) | Lucas theorem | Handles large n |
| n ≥ 10^9, mod prime | Lucas | Logarithmic time |
| mod composite | CRT + prime power | General solution |
| Single query, any n | Multiplicative | No precompute needed |

---

### Common Moduli and Approaches

| Modulus | Type | Approach |
|---------|------|----------|
| 10^9+7 | Prime | Factorial + Fermat |
| 10^9+9 | Prime | Factorial + Fermat |
| 998244353 | Prime | Factorial + Fermat |
| 2^64 | Power of 2 | Lucas or special handling |
| Arbitrary | Composite | CRT decomposition |

---

### Complexity Deep Dive

```
Precomputation approaches:

Factorial method:
  - Build fact[]: O(n) multiplications
  - Build inv_fact[]: O(n) multiplications + 1 powmod
  - Query: 2 array lookups + 2 multiplications

Pascal DP:
  - Build table: O(n²) additions
  - Query: 1 array lookup
  
Single query multiplicative:
  - O(r) multiplications + 1 powmod
  
Lucas theorem:
  - O(log_p n) digit extractions
  - Each digit: O(p) to precompute or O(p) multiplicative
```

<!-- back -->
