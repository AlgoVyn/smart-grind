## Backtracking - Palindrome Partitioning: Comparison

When should you use different approaches?

<!-- front -->

---

### Backtracking vs DP

| Aspect | Backtracking | DP |
|--------|--------------|-----|
| **Goal** | All partitions | Min cuts / count |
| **Time** | O(2^n × n) | O(n²) or O(n³) |
| **Space** | O(n) | O(n²) |
| **Use case** | Enumerate | Optimize |

**Winner**: Backtracking for listing, DP for optimization

---

### Palindrome Check Methods

| Method | Time | Space | When to Use |
|--------|------|-------|-------------|
| String reverse | O(k) | O(k) | Short strings |
| Expand around center | O(k) | O(1) | Medium |
| Precomputed table | O(1) lookup | O(n²) | Many checks |

---

### Decision Tree

```
Palindrome partition problem?
├── Need all partitions?
│   └── Yes → Backtracking
├── Need minimum cuts?
│   └── Yes → DP (O(n²))
├── Need count?
│   └── Yes → DP
└── Longest palindrome?
    └── Two pointers / Expand
```

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| List all | Backtracking | Natural enumeration |
| Min cuts | DP | Polynomial time |
| Single check | Reverse/compare | Simple |
| Many checks | Precompute table | O(1) per check |

<!-- back -->
