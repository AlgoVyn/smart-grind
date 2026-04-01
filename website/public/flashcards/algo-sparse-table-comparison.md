## Title: Sparse Table - Comparison

How does Sparse Table compare to other range query data structures?

<!-- front -->

---

### Comparison Table

| Data Structure | Build | Query | Update | Space | Best For |
|----------------|-------|-------|--------|-------|----------|
| **Prefix Sum** | O(n) | O(1) | O(n) | O(n) | Static sum queries |
| **Sparse Table** | O(n log n) | O(1) | O(n log n) | O(n log n) | Static min/max/gcd |
| **Segment Tree** | O(n) | O(log n) | O(log n) | O(n) | Dynamic data |
| **Fenwick Tree** | O(n) | O(log n) | O(log n) | O(n) | Dynamic prefix sums |
| **Sqrt Decomposition** | O(n) | O(√n) | O(√n) | O(n) | Simple implementation |

---

### When to Choose Each

**Choose Sparse Table when:**
- Array is completely static
- You need O(1) query time
- Building O(n log n) table is acceptable
- Operation is idempotent (min, max, GCD)

**Choose Segment Tree when:**
- Array may be updated
- You need more operation flexibility
- O(log n) query time is acceptable

**Choose Prefix Sum when:**
- Only sum queries needed
- Array is static
- O(1) query and O(n) build preferred

**Choose Fenwick Tree when:**
- Space efficiency is critical
- Only prefix sums needed
- Point updates and prefix queries suffice

---

### Limitations of Sparse Table

| Limitation | Description | Solution |
|------------|-------------|----------|
| **No updates** | Cannot handle dynamic changes efficiently | Use Segment Tree |
| **Only idempotent operations** | Sum and product don't work | Use Prefix Sum or Segment Tree |
| **Higher space** | O(n log n) vs O(n) | Accept for faster queries |
| **Static only** | Must rebuild for any change | Use Segment Tree for dynamic data |

<!-- back -->
