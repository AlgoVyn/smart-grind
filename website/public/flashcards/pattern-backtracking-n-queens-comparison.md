## Backtracking - N-Queens: Comparison

When should you use different approaches for N-Queens?

<!-- front -->

---

### Set vs Bitmask vs Array

| Aspect | Set | Bitmask | Array |
|--------|-----|---------|-------|
| **Speed** | O(1) avg | O(1) | O(n) |
| **Space** | O(n) | O(1) | O(n²) |
| **Code clarity** | High | Medium | High |
| **Best for** | General use | Small n, speed | Learning |
| **Operations** | add/remove | \| / & | Direct index |

**Winner**: Sets for interviews, Bitmasks for optimization

---

### When to Use Each Approach

**Set-based**:
- Clean, readable code
- Interview settings
- General constraint satisfaction

**Bitmask**:
- Maximum performance
- Small n (n ≤ 20)
- Competitive programming

**Boolean arrays**:
- Simple constraint tracking
- Learning the pattern
- Large n (sparse constraints)

---

### Recursive vs Iterative

| Aspect | Recursive | Iterative |
|--------|-----------|-----------|
| **Code size** | Shorter | Longer |
| **Stack depth** | Limited by recursion | Controlled |
| **Debugging** | Stack trace | Manual tracking |
| **Performance** | Similar | Similar |

**Winner**: Recursive for clarity, Iterative for control

---

### Decision Tree

```
N-Queens problem?
├── Need all solutions?
│   ├── Yes → Backtracking required
│   └── No → Count only (faster)
├── Performance critical?
│   ├── Yes → Bitmask optimization
│   └── No → Set-based (clearer)
├── n is large (>20)?
│   ├── Yes → Consider optimized heuristics
│   └── No → Standard backtracking
└── Interview setting?
    ├── Yes → Clean set-based code
    └── No → Optimize as needed
```

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|-----|
| Interview | Set-based | Clear, maintainable |
| Speed contest | Bitmask | Fastest operations |
| Learning | Boolean arrays | Explicit constraint tracking |
| Large n | Heuristics + pruning | Reduce search space |
| Count only | No board storage | Memory savings |

<!-- back -->
