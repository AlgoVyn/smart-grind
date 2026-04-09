## Array/Matrix - Set Matrix Zeroes: Core Concepts

What are the fundamental principles of in-place matrix marking?

<!-- front -->

---

### Core Concept

**Use the matrix itself as storage to eliminate extra space while preserving original zero locations.**

**The "Aha!" Moments:**
1. **First row `matrix[0][j]`** stores column j zero flags
2. **First column `matrix[i][0]`** stores row i zero flags
3. **Two boolean flags** track if first row/column themselves need zeroing
4. **Two-pass approach**: Mark first, apply second

---

### The Pattern

```
Before:              After Marking:
[1 2 0 4]           [0 0 0 0]  ← first row zeroed as marker
[5 6 7 8]    →      [0 6 7 8]
[9 0 1 2]           [0 0 1 2]  ← row 2 col 1 marked

Step 1: Save first row/col flags
Step 2: Use position (0,1) as marker for column 1
Step 3: Use position (2,0) as marker for row 2
Step 4: Apply zeros based on markers
Step 5: Zero first row/col if original flags set
```

---

### Why This Works

**The Problem with Naive Approach:**
- If we zero as we find zeros → ruins other markers
- Need to know ALL zero locations before any modification

**The In-Place Solution:**
- First pass: Mark which rows/columns need zeroing
- Second pass: Apply zeros without affecting markers
- Markers stored in "overlapping" area (first row/col)

---

### Complexity Analysis

| Aspect | In-Place | Extra Arrays |
|--------|----------|--------------|
| Time | O(m × n) | O(m × n) |
| Space | O(1) | O(m + n) |
| Passes | 3 (check, mark, apply) | 2 (mark, apply) |
| Modifies input | Yes | Yes |

---

### Key Constraints Handled

| Constraint | Solution |
|------------|----------|
| Can't use O(m+n) space | Use matrix itself |
| First row needs zeroing | Boolean flag tracks separately |
| First col needs zeroing | Boolean flag tracks separately |
| Original zeros overwritten | Already captured in markers |

<!-- back -->
