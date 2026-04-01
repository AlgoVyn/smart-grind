## Title: Sudoku Solver - Forms

What are the different manifestations of Sudoku/backtracking patterns?

<!-- front -->

---

### Form 1: Standard 9×9 Sudoku

The classic puzzle with 9×9 grid and 3×3 boxes.

| Property | Value |
|----------|-------|
| Grid size | 9×9 |
| Numbers | 1-9 |
| Box size | 3×3 |
| Total cells | 81 |

---

### Form 2: Generalized N×N Sudoku

Larger or smaller Sudoku variants.

| Size | Box Size | Numbers |
|------|----------|---------|
| 4×4 | 2×2 | 1-4 |
| 9×9 | 3×3 | 1-9 |
| 16×16 | 4×4 | 1-16 or 0-9,A-F |
| 25×25 | 5×5 | 1-25 |

---

### Form 3: Sudoku Validation

Check if a given board is valid (no solving needed).

| Task | Approach |
|------|----------|
| Validation | Check rows, cols, boxes for duplicates |
| Complexity | O(81) = O(1) for 9×9 |
| Method | Use sets or frequency arrays |

---

### Form 4: Count Solutions

Find all valid solutions (not just one).

| Modification | Change |
|--------------|--------|
| Return | List of all solutions |
| Base case | Add solution, continue searching |
| Early exit | Remove early return |

---

### Form 5: Generate Sudoku

Create valid Sudoku puzzles.

| Step | Action |
|------|--------|
| 1 | Fill diagonal boxes (independent) |
| 2 | Solve the puzzle |
| 3 | Remove numbers while maintaining unique solution |

<!-- back -->
