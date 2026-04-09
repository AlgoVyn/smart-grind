## Backtracking - N-Queens: Comparison

When should you use different approaches for N-Queens and constraint satisfaction?

<!-- front -->

---

### Set-based vs Bitmask vs Boolean Array

| Approach | Time | Space | Code Clarity | Best For |
|----------|------|-------|--------------|----------|
| **Set-based** | O(1) avg | O(n) | High | Interviews, general use |
| **Bitmask** | O(1) | O(1) | Medium | Speed, n ≤ 20 |
| **Boolean arrays** | O(1) | O(n²) | High | Learning, debugging |

**Winner**: Set-based for interviews, Bitmask for optimization

---

### Constraint Tracking Methods

```
Method 1: Three Sets (Recommended)
├── cols: Set of occupied columns
├── diag1: Set of (row - col) for anti-diagonals \
└── diag2: Set of (row + col) for main-diagonals /

Method 2: Bitmask
├── cols: Integer bitmask
├── diag1: Integer, shifted left each row
└── diag2: Integer, shifted right each row

Method 3: Boolean Arrays
├── col_used[n]: bool array
├── diag1_used[2n-1]: row-col + (n-1) offset
└── diag2_used[2n-1]: row+col tracking
```

---

### When to Use Each Approach

**Set-based (Recommended for Interviews)**:
- Clean, readable, maintainable code
- Easy to explain and debug
- Amortized O(1) operations
- Best for: General constraint satisfaction

**Bitmask (For Optimization)**:
- Fastest possible operations
- Minimal memory footprint
- Elegant bit manipulation
- Best for: Competitive programming, small n

**Boolean Arrays (For Learning)**:
- Explicit constraint visualization
- Direct index access
- No hash overhead
- Best for: Understanding the algorithm

---

### Recursive vs Iterative Backtracking

| Aspect | Recursive | Iterative (Stack) |
|--------|-----------|-------------------|
| **Code size** | Shorter | Longer |
| **Stack depth** | System limited | User controlled |
| **Debugging** | Stack trace available | Manual tracking |
| **Performance** | Similar | Similar |
| **Clarity** | Natural DFS | Explicit state management |

**Winner**: Recursive for interviews, Iterative for control/large n

---

### Decision Tree for Approach Selection

```
Constraint Satisfaction Problem?
├── Need all solutions?
│   ├── Yes → Backtracking required
│   └── No  → Can use heuristics or early exit
├── Performance critical?
│   ├── Yes → Bitmask optimization
│   └── No  → Set-based for clarity
├── n is large (>20)?
│   ├── Yes → Consider advanced heuristics (MCV, forward checking)
│   └── No  → Standard backtracking
├── Interview setting?
│   ├── Yes → Clean set-based, well-commented
│   └── No  → Optimize for specific constraints
└── Only need count?
    ├── Yes → Skip board construction
    └── No  → Build and store solutions
```

---

### Problem Variations Comparison

| Problem | Approach | Key Difference |
|---------|----------|----------------|
| N-Queens (LC 51) | Standard backtracking | Return all boards |
| N-Queens II (LC 52) | Count only | No board construction |
| Sudoku Solver (LC 37) | Constraint propagation + backtracking | Multiple constraints per cell |
| Valid Sudoku (LC 36) | Constraint checking only | No backtracking needed |
| Graph Coloring | Backtracking with color constraints | Variable domain size |

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|-----|
| **Interview** | Set-based + clean code | Readability, maintainability |
| **Speed contest** | Bitmask | Fastest operations |
| **Learning** | Boolean arrays | Explicit, easy to trace |
| **Large n** | Heuristics + pruning | Reduce search space |
| **Count only** | No board storage | Memory efficiency |
| **First solution only** | Early exit pattern | Stop at first valid config |

<!-- back -->
