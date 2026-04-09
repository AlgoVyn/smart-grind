## Binary Search - First Last Occurrence: Comparison

When should you use modified binary search versus built-in functions for first/last occurrence?

<!-- front -->

---

### Custom Implementation vs bisect Module

| Aspect | Custom Binary Search | bisect module |
|--------|---------------------|---------------|
| **Time** | O(log n) | O(log n) |
| **Space** | O(1) | O(1) |
| **Readability** | More code | Clean and standard |
| **Interview** | Preferred (show skill) | Acceptable in Python |
| **Production** | - | Preferred (tested) |

**Winner**: 
- Custom implementation for interviews to demonstrate understanding
- `bisect` for production Python code

---

### When to Use Each Approach

**Custom Binary Search**:
- Technical interviews
- Learning the algorithm
- Languages without built-in equivalent
- Modified requirements (nearly sorted, etc.)

**Built-in bisect**:
- Production Python code
- Quick scripting
- Standard library is optimized
- Team code reviews (familiarity)

---

### Comparison with Other Range Finding

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| **Binary Search (2x)** | O(log n) | O(1) | General, interviews |
| **bisect** | O(log n) | O(1) | Python production |
| **Linear Scan** | O(n) | O(1) | Small arrays, unsorted |
| **Hash Count** | O(n) | O(n) | Count in unsorted |

---

### Decision Tree

```
Need first/last/range of target?
├── Yes → Using Python?
│   ├── Yes → Production code?
│   │   ├── Yes → BISECT module
│   │   └── No → Either works
│   └── No → CUSTOM BINARY SEARCH
│       (for learning/interviews)
└── No → Different approach
```

---

### Key Trade-offs

| Consideration | Custom Implementation Wins | bisect Module Wins |
|-------------|---------------------------|-------------------|
| Interview demonstration | ✓ | - |
| Code brevity | - | ✓ |
| Cross-language knowledge | ✓ | - |
| Production reliability | - | ✓ |
| Custom modifications | ✓ | - |

<!-- back -->
