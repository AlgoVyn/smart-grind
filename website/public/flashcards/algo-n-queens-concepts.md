## N-Queens: Core Concepts

What are the fundamental principles of the N-Queens problem?

<!-- front -->

---

### Core Concept

Place N queens on an N×N chessboard such that no two queens attack each other.

Queens attack along:
- Same row
- Same column  
- Same diagonal (both directions)

---

### Constraints

| Constraint | Mathematical Check |
|------------|-------------------|
| Unique rows | Place one queen per row |
| Unique columns | `cols[j] = true` if column j used |
| Unique diagonals | `diag1[i+j]` and `diag2[i-j]` tracking |

---

### Diagonal Indexing

For position (row, col) on N×N board:

| Diagonal Type | Formula | Range |
|---------------|---------|-------|
| Top-left to bottom-right (\) | `row - col` | -(N-1) to (N-1) |
| Top-right to bottom-left (/) | `row + col` | 0 to 2(N-1) |

**Offset for array indexing**: `row - col + (N - 1)` gives 0 to 2N-2

```
Diagonal (/) indices for 4×4:
  0 1 2 3
  1 2 3 4
  2 3 4 5
  3 4 5 6

Diagonal (\) indices (with offset):
  3 2 1 0
  4 3 2 1
  5 4 3 2
  6 5 4 3
```

---

### Backtracking Approach

Place queens row by row:
1. Try each column in current row
2. Check if position is safe (no conflicts)
3. If safe, place queen and recurse to next row
4. If no safe position, backtrack
5. If all N rows filled, found a solution

---

### Complexity

| Aspect | Value |
|--------|-------|
| Search space | N^N (naive) |
| With constraints | N! permutations |
| Typical runtime (N=8) | < 1ms |
| Typical runtime (N=14) | ~1 second |
| Solutions for N=8 | 92 |
| Unique solutions (N=8) | 12 |

<!-- back -->
