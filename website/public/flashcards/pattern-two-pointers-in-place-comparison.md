## Two Pointers - In-Place Array Modification: Comparison

When should you use in-place modification versus creating a new array?

<!-- front -->

---

### In-Place vs New Array

| Aspect | In-Place | New Array |
|--------|----------|-----------|
| **Time** | O(n) | O(n) |
| **Space** | O(1) | O(n) |
| **Original preserved** | No | Yes |
| **Code complexity** | Moderate | Simpler |
| **Interview preference** | Usually required | If not specified |

**Winner**: In-place when space matters, new array for clarity

---

### When to Use In-Place

**Use in-place when:**
- Space complexity is constrained
- Problem explicitly asks for O(1) space
- Large arrays (memory concerns)
- "Modify array" in problem statement

**Don't use when:**
- Need to preserve original
- Building completely different structure
- Problem allows extra space
- Clarity is more important

---

### Comparison with Other Array Patterns

| Pattern | Space | Best For |
|---------|-------|----------|
| **In-Place Two Pointer** | O(1) | Remove, partition |
| **New Array** | O(n) | Transform, map |
| **Converging** | O(1) | Pair sum |
| **Sliding Window** | O(k) | Subarray |
| **Prefix/Suffix** | O(n) | Range queries |

---

### Decision Tree

```
Array modification problem?
├── Yes → Space constrained or O(1) required?
│   ├── Yes → IN-PLACE TWO POINTER
│   └── No → Need original preserved?
│       ├── Yes → NEW ARRAY
│       └── No → Either approach works
└── No → Different pattern
```

---

### Key Trade-offs

| Consideration | In-Place Wins | New Array Wins |
|-------------|---------------|----------------|
| Space optimization | ✓ | - |
| Code clarity | - | ✓ |
| Debugging | - | ✓ |
| Preserve input | - | ✓ |
| Interview "optimal" answer | ✓ | - |

<!-- back -->
