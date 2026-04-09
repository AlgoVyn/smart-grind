## Stack - Valid Parentheses: Comparison

When should you use different approaches?

<!-- front -->

---

### Stack vs Counter

| Aspect | Stack | Counter |
|--------|-------|-----------|
| **Single type** | Works | Works (simpler) |
| **Multiple types** | Works | Doesn't work |
| **Nested matching** | Correct | May fail |
| **Space** | O(n) | O(1) |

**Winner**: Stack for multiple types, counter for single type

---

### When to Use Each

**Stack:**
- Multiple bracket types ()[]{}
- Need to check nesting order
- General validation

**Counter:**
- Single bracket type
- Just need balance count
- Memory constrained

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Multiple brackets | Stack | Tracks order |
| Single bracket | Counter | Simpler, O(1) |
| Nested check | Stack | Order matters |
| Just balance | Counter | Count is enough |

<!-- back -->
