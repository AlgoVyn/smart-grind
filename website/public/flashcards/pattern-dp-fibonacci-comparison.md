## DP - Fibonacci Style: Comparison

When should you use different approaches?

<!-- front -->

---

### Iterative vs Matrix Exponentiation

| Aspect | Iterative | Matrix Exp | Fast Doubling |
|--------|-----------|------------|---------------|
| **Time** | O(n) | O(log n) | O(log n) |
| **Space** | O(1) | O(log n) stack | O(log n) stack |
| **Code** | Simple | Complex | Complex |
| **Use case** | Normal n | Very large n | Very large n |

**Winner**: Iterative for most cases, O(log n) for n > 10^6

---

### When to Use Each

**Iterative:**
- n up to 10^6 or 10^7
- Clean, simple code
- Interview standard

**Matrix Exponentiation:**
- n is very large (10^9)
- Need F(n) mod m
- Show-off solution

**Fast Doubling:**
- Even faster for huge n
- Less overhead than matrix
- Competitive programming

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Normal n | Iterative O(n) | Simple, fast enough |
| Huge n | Fast doubling | O(log n) time |
| Multiple queries | Precompute all | O(1) per query |

<!-- back -->
