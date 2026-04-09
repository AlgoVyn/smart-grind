## Binary Search - On Answer: Comparison

When should you use binary search on answer versus other optimization approaches?

<!-- front -->

---

### Binary Search on Answer vs Greedy

| Aspect | Binary Search | Greedy |
|--------|---------------|--------|
| **Time** | O(log(range) × check) | O(n) or O(n log n) |
| **Applicability** | Monotonic predicate | Local optimal choice |
| **Proof** | Often easier | Can be tricky |
| **Space** | O(1) | O(1) or O(n) |
| **When to use** | Can verify, monotonic | Clear greedy choice |

**Winner**: Depends on problem structure - both common in optimization

---

### Binary Search on Answer vs Dynamic Programming

| Aspect | Binary Search | DP |
|--------|---------------|-----|
| **Time** | O(log × check) | Often O(n²) or higher |
| **Space** | O(1) check | O(n) or higher |
| **Subproblems** | No overlap | Overlapping subproblems |
| **Optimal substructure** | Verification only | Building up solution |

**Winner**: Binary search when verification is cheaper than building solution

---

### When to Use Binary Search on Answer

**Use when:**
- Answer space is monotonic (if X works, X+1 works or vice versa)
- Can write efficient check function
- Minimize maximum or maximize minimum problems
- Range of possible answers is large

**Don't use when:**
- Answer space is not monotonic
- Check function would be too slow
- DP or greedy gives direct solution
- Answer is not in searchable range

---

### Comparison with Other Optimization Patterns

| Pattern | Time | Space | Best For |
|---------|------|-------|----------|
| **Binary Search on Answer** | O(log × check) | O(1) | Monotonic verification |
| **Greedy** | O(n log n) | O(1) | Local optimal works globally |
| **DP** | O(n²) typical | O(n) | Overlapping subproblems |
| **Backtracking** | Exponential | O(n) | Small constraints |

---

### Decision Tree

```
Optimization problem (minimize max / maximize min)?
├── Yes → Can verify candidate answer efficiently?
│   ├── Yes → Is answer space monotonic?
│   │   ├── Yes → BINARY SEARCH ON ANSWER
│   │   └── No → Other approach
│   └── No → GREEDY or DP
└── No → Different pattern
```

---

### Key Trade-offs

| Consideration | Binary Search Wins | DP/Greedy Wins |
|-------------|-------------------|----------------|
| Large answer range | ✓ | - |
| Simple verification | ✓ | - |
| Overlapping subproblems | - | ✓ |
| Natural greedy choice | - | ✓ |
| Space efficiency | ✓ | - |

<!-- back -->
