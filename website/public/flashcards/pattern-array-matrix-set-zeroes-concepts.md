## Array/Matrix - Set Matrix Zeroes: Core Concepts

What are the fundamental principles for setting matrix zeroes?

<!-- front -->

---

### Core Concept

**Use the first row and first column of the matrix itself as marker storage to achieve O(1) space complexity.**

The key insight: Instead of using O(m+n) space for row/column markers, use the matrix's first row and column, with two boolean variables for the first row/column themselves.

**Visual marking:**
```
Original:          Markers stored in first row/col:
[1, 2, 3, 4]       [1, 0, 0, 4]  ← first row markers
[5, 0, 7, 8]  →    [0, 0, 7, 8]
[9, 10, 0, 12]     [0, 10, 0, 12]
[13, 14, 15, 16]   [13, 14, 15, 16]

0 at [1,1] and [2,2] → mark row 1,2 and col 1,2
```

---

### The Pattern

```
Why use first row/col as markers?
- Saves O(m+n) space → O(1) space
- Need separate flags for first row/col themselves
- Three steps:
  1. Mark (using first row/col)
  2. Apply (to inner cells)
  3. Handle first row/col based on flags
```

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| Matrix marking | Zero rows/cols | LeetCode 73 |
| Grid marking | In-place marking | Battleship, game of life |
| Constraint marking | Track state | Various matrix problems |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(m × n) | Three passes |
| Space | O(1) | In-place with 2 booleans |
| Alternative | O(m+n) | Extra arrays for markers |

---

### Why Separate First Row/Col?

```
If we don't save first row/col state separately:
- When we mark matrix[i][0] = 0, we lose original value
- Can't tell if first col should actually be zeroed

Solution:
- first_row_zero = any zero in row 0
- first_col_zero = any zero in col 0
- Use these flags at the end
```

<!-- back -->
