## Array/Matrix - Spiral Traversal: Comparison

When should you use different spiral traversal approaches?

<!-- front -->

---

### Boundary Shrinkage vs Direction Vectors

| Aspect | Boundary Shrinkage | Direction Vectors |
|--------|---------------------|-------------------|
| **Code size** | Moderate | Compact |
| **Intuitiveness** | High | Medium |
| **Performance** | O(1) extra space | O(m×n) visited array |
| **Flexibility** | Fixed pattern | Easy to modify direction |
| **Best for** | Production code | Learning, variations |

**Winner**: Boundary shrinkage for interviews and production

---

### When to Use Each Approach

**Boundary Shrinkage**:
- Clean, efficient implementation
- Interview settings
- Production code
- Fixed clockwise/counter-clockwise patterns

**Direction Vectors**:
- Learning the pattern
- Need to change direction order
- More complex traversal patterns
- Snake/labyrinth patterns

**Recursive Layer**:
- Functional programming style
- Layer-by-layer thinking
- Not recommended for large matrices (stack depth)

---

### Complexity Comparison

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Boundary Shrinkage | O(m×n) | O(1) | **Recommended** |
| Direction Vectors | O(m×n) | O(m×n) | Learning |
| Recursive | O(m×n) | O(min(m,n)) | Educational |

---

### Decision Tree

```
Spiral traversal needed?
├── Direction order important?
│   ├── Yes → Standard clockwise
│   └── No → Direction vectors for flexibility
├── Space constrained?
│   ├── Yes → Boundary shrinkage (O(1))
│   └── No → Any approach works
├── Recursive preferred?
│   ├── Yes → Layer-by-layer recursive
│   └── No → Iterative boundary shrinkage
└── Matrix small?
    └── Yes → Any approach acceptable
```

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Interview | Boundary shrinkage | Standard, well-known |
| Large matrix | Boundary shrinkage | O(1) space, no recursion |
| Learning | Direction vectors | Visualize direction changes |
| Custom spiral | Direction vectors | Easy to modify |
| Functional style | Recursive | Clean, mathematical |

<!-- back -->
