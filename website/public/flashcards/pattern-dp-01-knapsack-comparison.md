## DP - 0/1 Knapsack: Comparison

When should you use different approaches?

<!-- front -->

---

### 0/1 vs Unbounded Knapsack

| Aspect | 0/1 Knapsack | Unbounded Knapsack |
|--------|--------------|---------------------|
| **Iteration** | Backward | Forward |
| **Item use** | At most once | Unlimited |
| **Time** | O(n×capacity) | Same |
| **Space** | O(capacity) | Same |
| **Example** | Limited items | Infinite supply |

**Winner**: Depends on problem constraints

---

### When to Use Each

**0/1 Knapsack:**
- Items are unique/limited
- Binary choice per item
- Classic knapsack problems

**Unbounded:**
- Unlimited item supply
- Coin change style problems
- Rod cutting

**Subset Sum:**
- Just need boolean result
- Partition problems
- Target sum existence

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Unique items | 0/1 | Once per item |
| Unlimited supply | Unbounded | Multiple use |
| Just need yes/no | Subset sum | Simpler DP |

<!-- back -->
