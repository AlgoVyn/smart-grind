## Array/Matrix - Set Matrix Zeroes: Comparison

When should you use different approaches for matrix zeroing?

<!-- front -->

---

### Space Optimized vs Extra Arrays

| Aspect | In-Place O(1) | Extra Arrays O(m+n) |
|--------|---------------|---------------------|
| **Space** | O(1) - two booleans | O(m+n) - row/col arrays |
| **Time** | O(m × n) - 3 passes | O(m × n) - 2 passes |
| **Code complexity** | Higher (need flags) | Simpler, more readable |
| **First pass** | Check first row/col | Mark all zero locations |
| **Second pass** | Mark in first row/col | Apply zeros |
| **Third pass** | Apply to rest + handle first row/col | - |
| **When to use** | Space constrained | Clarity preferred |

**Rule of thumb:** Use O(1) space for interviews (expected optimal), O(m+n) for clarity.

---

### Approach Comparison

| Approach | Space | Time | Pros | Cons |
|----------|-------|------|------|------|
| **In-Place Marking** | O(1) | O(m×n) | Optimal space, classic interview solution | More complex, 3 passes |
| **Extra Arrays** | O(m+n) | O(m×n) | Simple, readable, 2 passes | Uses extra space |
| **Set Tracking** | O(k) | O(m×n) | Minimal if few zeros | k = number of zeros |
| **Copy Matrix** | O(m×n) | O(m×n) | Original unchanged | Most space |

---

### When to Use What

```
Problem constraints?
├── "O(1) extra space" / "in-place"
│   └── Use: First row/col marking
│   └── Remember: Must save first row/col status first
│
├── "without using extra space"
│   └── Same as above: In-place marking
│
├── No space constraint mentioned
│   └── Choose based on:
│       ├── Interview? → O(1) (shows optimization skill)
│       └── Production? → O(m+n) (more maintainable)
│
└── "do not modify input"
    └── Use: Copy matrix + any tracking method
    └── Space: O(m×n) minimum
```

---

### Decision Matrix

| Situation | Approach | Space | Why |
|-----------|----------|-------|-----|
| Interview standard | In-place | O(1) | Expected optimal solution |
| Large matrix, space critical | In-place | O(1) | Memory efficiency |
| Small matrix, clarity needed | Extra arrays | O(m+n) | Easy to verify |
| Input must be preserved | Copy + track | O(m×n) | Non-destructive |
| Very sparse matrix | Set tracking | O(k) | k = # of zeros |
| Debugging/learning | Extra arrays | O(m+n) | Easier to trace |

---

### Complexity Trade-offs

| Pass | In-Place | Extra Arrays |
|------|----------|--------------|
| 1 | Check first row for zeros | Find all zeros, store positions |
| 2 | Check first col for zeros | Zero marked rows/cols |
| 3 | Mark zeros in first row/col | - |
| 4 | Apply zeros to rest | - |
| 5 | Zero first row/col if needed | - |

**Both are O(m×n) time** - the constant factor differs but asymptotically same.

---

### Common Pitfalls Comparison

| Pitfall | In-Place | Extra Arrays |
|---------|----------|--------------|
| Overwriting markers early | ❌ Common | N/A |
| Forgetting first row flag | ❌ Common | N/A |
| Forgetting first col flag | ❌ Common | N/A |
| Off-by-one in marker indices | ❌ Possible | N/A |
| Using too much space | ✅ Safe | ❌ O(m+n) |
| Easier to debug | ❌ Harder | ✅ Yes |

<!-- back -->
