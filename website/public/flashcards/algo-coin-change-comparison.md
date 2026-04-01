## Coin Change: Comparison Guide

How does coin change relate to other DP and optimization problems?

<!-- front -->

---

### Knapsack Family Comparison

| Problem | Item Usage | Objective | Classic Example |
|---------|------------|-----------|-----------------|
| **0/1 Knapsack** | Each once | Max value | Item selection |
| **Unbounded Knapsack** | Unlimited | Max value | Coin change (max ways) |
| **Bounded Knapsack** | Limited count | Max value | Multiple items |
| **Coin Change Min** | Unlimited | Min count | Fewest coins |
| **Coin Change Ways** | Unlimited | Count ways | Combinations |

**Coin change** is the "unbounded" variant with min/max/ counting objectives.

---

### Greedy vs DP Decision Tree

```
Is the coin system canonical? (like US coins)
  ├─ YES → Greedy works, O(n log n)
  └─ NO  → Must use DP, O(amount × n)

Check canonically: Verify for all amounts up to a+b where a,b largest coins
```

| Algorithm | Time | When Valid |
|-----------|------|------------|
| **Greedy** | O(n) or O(n log n) | Canonical systems only |
| **DP** | O(amount × n) | Always correct |
| **BFS** | O(amount × n) | Shortest path interpretation |
| **Meet-in-middle** | O(2^(n/2)) | Very small n, large amount |

---

### Similar DP Problems

| Problem | Relation to Coin Change |
|---------|------------------------|
| **Combination sum** | Coin change with specific target, find all combos |
| **Word break** | String version: can we segment using dictionary? |
| **Perfect squares** | Coin change where coins are 1, 4, 9, 16, ... |
| **Partition to k equal sum** | Multiple knapsack with equality constraint |
| **Target sum (+/-)** | Signed coin change variant |

---

### Complexity Classes

| Variant | Time | Space | Optimization |
|-----------|------|-------|--------------|
| Minimum coins | O(n × amount) | O(amount) | Can use BFS |
| Number of ways | O(n × amount) | O(amount) | Use mod for overflow |
| Exact k coins | O(n × amount × k) | O(amount × k) | Space can optimize |
| Limited supply | O(n × amount × max_limit) | O(amount) | Monotonic queue opt |

---

### When Each Approach Wins

```
Small amount (< 1000):  Simple DP, any order
Large amount (> 10^6):  Greedy check first
Many coins (> 1000):   Optimize inner loop
Many queries:          Precompute all dp[0..max_amount]
Limited supply:        0/1 knapsack style, iterate backwards
Need path:             Add parent pointers
```

<!-- back -->
