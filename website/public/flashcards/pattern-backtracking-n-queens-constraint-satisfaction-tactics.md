## Backtracking - N-Queens: Tactics

What are the advanced techniques for N-Queens and constraint satisfaction?

<!-- front -->

---

### Tactic 1: Bitmask Optimization

Use bits instead of sets for faster constraint operations:

```python
def total_n_queens_bitmask(n):
    """Count solutions using bit manipulation."""
    def backtrack(row, cols, diag1, diag2):
        if row == n:
            return 1
        
        count = 0
        # Available positions: bits not set in any constraint
        available = (~(cols | diag1 | diag2)) & ((1 << n) - 1)
        
        while available:
            # Get rightmost available bit
            position = available & -available
            available -= position
            
            count += backtrack(
                row + 1,
                cols | position,
                (diag1 | position) << 1,
                (diag2 | position) >> 1
            )
        
        return count
    
    return backtrack(0, 0, 0, 0)
```

**Benefit**: O(1) constraint checks with bitwise operations
**Best for**: Small n (≤20), competitive programming

---

### Tactic 2: Early Pruning

Skip invalid placements immediately rather than exploring dead branches:

```python
def backtrack(row, cols, diag1, diag2):
    if row == n:
        return 1
    
    count = 0
    for col in range(n):
        # Check ALL constraints BEFORE placing
        if (col in cols or 
            (row - col) in diag1 or 
            (row + col) in diag2):
            continue  # Skip immediately - don't recurse
        
        # Only recurse if valid
        count += backtrack(row + 1, ...)
```

**Key**: Check constraints first, place only if valid

---

### Tactic 3: Count Only Optimization

If only counting solutions (not storing them), skip board construction:

```python
def total_n_queens(n):
    """Count without building boards - much faster."""
    def backtrack(row, cols, diag1, diag2):
        if row == n:
            return 1
        
        count = 0
        for col in range(n):
            if (col not in cols and 
                (row - col) not in diag1 and 
                (row + col) not in diag2):
                count += backtrack(
                    row + 1,
                    cols | {col},
                    diag1 | {row - col},
                    diag2 | {row + col}
                )
        return count
    
    return backtrack(0, set(), set(), set())
```

**Savings**: No board array, no solution construction, no copying

---

### Tactic 4: Find Any Solution (Early Exit)

Stop immediately when first solution is found:

```python
def solve_n_queens_any(n):
    """Return first valid solution found."""
    result = None
    
    def backtrack(row, cols, diag1, diag2, positions):
        nonlocal result
        if result is not None:
            return True  # Early termination
        
        if row == n:
            result = positions[:]
            return True
        
        for col in range(n):
            if (col not in cols and 
                (row - col) not in diag1 and 
                (row + col) not in diag2):
                if backtrack(row + 1, ..., positions + [col]):
                    return True  # Propagate success up
        return False
```

---

### Tactic 5: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| Wrong diagonal formula | Invalid placements | Use `row-col` (\) and `row+col` (/) |
| Missing backtrack | Constraints accumulate | Always remove after recursion |
| Deep copy board | O(n²) per solution | Reuse board, copy only at solution |
| Wrong base case | Off-by-one errors | Check `row == n` (after placing n queens) |
| Asymmetric set ops | Set mismatch | Add and remove symmetrically |

---

### Tactic 6: Extension to General CSPs

Apply same pattern to other constraint satisfaction problems:

```python
def solve_csp(variables, constraints):
    """General constraint satisfaction template."""
    def backtrack(assignment):
        if len(assignment) == len(variables):
            return [assignment[:]]
        
        var = select_unassigned(variables, assignment)
        results = []
        
        for value in domain_values(var):
            if is_consistent(var, value, assignment, constraints):
                assignment.append((var, value))
                results.extend(backtrack(assignment))
                assignment.pop()  # Backtrack
        
        return results
```

**Applies to**: Sudoku, graph coloring, scheduling, crossword puzzles

<!-- back -->
