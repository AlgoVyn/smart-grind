## Title: Sudoku Solver - Core Concepts

What is the Sudoku Solver technique and how does it work?

<!-- front -->

---

### Definition
A backtracking algorithm that solves 9×9 Sudoku puzzles by filling empty cells with digits 1-9 while satisfying three constraints:
- Each row contains digits 1-9 without repetition
- Each column contains digits 1-9 without repetition
- Each 3×3 subgrid (box) contains digits 1-9 without repetition

| Aspect | Details |
|--------|---------|
| **Time** | O(9^(n²)) worst case, but much better with MRV |
| **Space** | O(n²) for recursion = O(81) = O(1) for 9×9 |
| **Key Technique** | Backtracking with constraint checking |

---

### Constraint Satisfaction

| Constraint | Scope | Check Method |
|------------|-------|--------------|
| **Row** | 9 cells in same row | Set membership |
| **Column** | 9 cells in same column | Set membership |
| **Box** | 9 cells in 3×3 subgrid | Set membership |

### Constraint Sets

O(1) constraint checking using sets:

```python
rows[i]   # Set of numbers in row i
cols[j]   # Set of numbers in column j
boxes[k]  # Set of numbers in box k, where k = (i//3)*3 + (j//3)
```

---

### Backtracking Pattern

| Step | Action | Purpose |
|------|--------|---------|
| **Choose** | Select empty cell | Pick where to place number |
| **Decide** | Try valid number | Find a valid digit |
| **Check** | Validate constraints | Ensure placement is legal |
| **Recurse** | Solve remaining | Continue solving |
| **Backtrack** | Undo if stuck | Try next alternative |

---

### Minimum Remaining Values (MRV)

Heuristic for cell selection:

| Approach | Strategy | Effect |
|----------|----------|--------|
| **Naive** | Row-by-row | Slower, more backtracking |
| **MRV** | Fewest options first | Faster, fails early |
| **Degree** | Most constrained first | Reduces branching |

<!-- back -->
