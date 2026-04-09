## Array/Matrix - In-place Rotation: Comparison

When should you use different rotation approaches?

<!-- front -->

---

### Transpose + Reverse vs Layer-by-Layer

| Aspect | Transpose + Reverse | Layer-by-Layer |
|--------|---------------------|----------------|
| **Code complexity** | Simple (2 loops) | Complex (4 swaps) |
| **Intuitiveness** | High | Medium |
| **Extensibility** | Easy (other rotations) | Harder |
| **Memory access** | Row-major friendly | Jumping around |
| **Cache performance** | Better | Worse |

**Winner**: Transpose + Reverse for all cases

---

### When to Use Each Rotation Type

**90° Clockwise**:
- Image rotation
- Matrix transformation
- Pattern matching with rotation

**90° Counter-Clockwise**:
- Reverse image operations
- Undo clockwise rotation
- Mathematical transformations

**180°**:
- Half-turn operations
- Symmetry checking
- Quick double rotation

---

### In-Place vs New Matrix

| Aspect | In-Place | New Matrix |
|--------|----------|------------|
| **Space** | O(1) extra | O(n²) |
| **Input preservation** | Destroys original | Keeps original |
| **Requirements** | Square matrix only | Any dimensions |
| **Use case** | Transform in place | Need original |

---

### Decision Tree

```
Need to rotate matrix?
├── Square matrix?
│   ├── Yes → Transpose + Reverse (in-place)
│   └── No → Create new matrix
├── Clockwise?
│   ├── Yes → Transpose, reverse rows
│   └── No → Reverse rows, transpose
└── How many degrees?
    ├── 90° → Single operation
    ├── 180° → Two 90° or reverse both
    └── 270° → Three 90° or one -90°
```

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|-----|
| Interview/Quick code | Transpose + Reverse | Simple, memorable |
| Learning fundamentals | Layer-by-layer | Understand mechanics |
| Performance critical | Transpose + Reverse | Better cache locality |
| Non-square matrix | New matrix | Impossible in-place |

<!-- back -->
