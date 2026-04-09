## Backtracking - N-Queens: Forms

What are the different variations of N-Queens?

<!-- front -->

---

### Form 1: Standard N-Queens (All Solutions)

```python
def solve_n_queens(n):
    """Return all valid board configurations."""
    result = []
    board = [['.' for _ in range(n)] for _ in range(n)]
    
    def backtrack(row, cols, diag1, diag2):
        if row == n:
            result.append([''.join(r) for r in board])
            return
        
        for col in range(n):
            if (col in cols or 
                (row - col) in diag1 or 
                (row + col) in diag2):
                continue
            
            board[row][col] = 'Q'
            backtrack(row + 1, 
                     cols | {col},
                     diag1 | {row - col},
                     diag2 | {row + col})
            board[row][col] = '.'
    
    backtrack(0, set(), set(), set())
    return result
```

**Output**: List of board configurations

---

### Form 2: N-Queens Count Only

```python
def total_n_queens(n):
    """Return count of solutions only."""
    count = 0
    
    def backtrack(row, cols, diag1, diag2):
        nonlocal count
        if row == n:
            count += 1
            return
        
        for col in range(n):
            if (col not in cols and 
                (row - col) not in diag1 and 
                (row + col) not in diag2):
                backtrack(row + 1,
                         cols | {col},
                         diag1 | {row - col},
                         diag2 | {row + col})
    
    backtrack(0, set(), set(), set())
    return count
```

**Output**: Integer count

---

### Form 3: N-Queens II (Any Solution)

```python
def solve_n_queens_any(n):
    """Return first valid solution found."""
    result = None
    
    def backtrack(row, cols, diag1, diag2, positions):
        nonlocal result
        if result is not None:
            return  # Early termination
        
        if row == n:
            result = positions[:]
            return
        
        for col in range(n):
            if (col not in cols and 
                (row - col) not in diag1 and 
                (row + col) not in diag2):
                positions.append(col)
                backtrack(row + 1,
                         cols | {col},
                         diag1 | {row - col},
                         diag2 | {row + col},
                         positions)
                if result is not None:
                    return
                positions.pop()
    
    backtrack(0, set(), set(), set(), [])
    return result
```

**Output**: Single solution or None

---

### Form 4: N-Queens with Positions

```python
def solve_n_queens_positions(n):
    """Return solutions as list of (row, col) positions."""
    result = []
    
    def backtrack(row, cols, diag1, diag2, current):
        if row == n:
            result.append([(r, c) for r, c in enumerate(current)])
            return
        
        for col in range(n):
            if (col not in cols and 
                (row - col) not in diag1 and 
                (row + col) not in diag2):
                backtrack(row + 1,
                         cols | {col},
                         diag1 | {row - col},
                         diag2 | {row + col},
                         current + [col])
    
    backtrack(0, set(), set(), set(), [])
    return result
```

**Output**: List of (row, col) tuples

---

### Form Comparison

| Form | Output | Use Case |
|------|--------|----------|
| Standard | Board configs | Display/visualize |
| Count | Integer | Statistics only |
| Any solution | Single config | Quick validation |
| Positions | Coordinate list | Processing/solving |

<!-- back -->
