## Backtracking - N-Queens: Forms

What are the different variations and output formats for N-Queens?

<!-- front -->

---

### Form 1: Standard N-Queens (All Solutions)

Return all valid board configurations as string arrays:

```python
def solve_n_queens(n):
    """LeetCode 51: Return all valid board configurations."""
    result = []
    board = [['.' for _ in range(n)] for _ in range(n)]
    
    def backtrack(row, cols, diag1, diag2):
        if row == n:
            # Convert to required output format
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
            board[row][col] = '.'  # Backtrack
    
    backtrack(0, set(), set(), set())
    return result
```

**Output**: `List[List[str]]` - e.g., `[['.Q..', '...Q', 'Q...', '..Q.']]`

---

### Form 2: N-Queens Count Only (LeetCode 52)

Return only the count of valid solutions:

```python
def total_n_queens(n):
    """LeetCode 52: Count solutions without storing."""
    def backtrack(row, cols, diag1, diag2):
        if row == n:
            return 1  # Found one valid configuration
        
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

**Output**: `int` - e.g., `2` (for n=4)

**Optimization**: No board array, no solution construction

---

### Form 3: Find Any Single Solution

Return the first valid solution found (early termination):

```python
def solve_n_queens_any(n):
    """Return first valid solution or None."""
    result = None
    
    def backtrack(row, cols, diag1, diag2, positions):
        nonlocal result
        if result is not None:
            return True  # Early exit
        
        if row == n:
            # Convert positions to board format
            board = [['.' for _ in range(n)] for _ in range(n)]
            for r, c in enumerate(positions):
                board[r][c] = 'Q'
            result = [''.join(r) for r in board]
            return True
        
        for col in range(n):
            if (col not in cols and 
                (row - col) not in diag1 and 
                (row + col) not in diag2):
                if backtrack(row + 1, ..., positions + [col]):
                    return True  # Propagate early exit
        return False
    
    backtrack(0, set(), set(), set(), [])
    return result
```

**Output**: `List[str]` or `None`

---

### Form 4: Positions List Format

Return solutions as list of queen positions:

```python
def solve_n_queens_positions(n):
    """Return solutions as list of (row, col) tuples."""
    result = []
    
    def backtrack(row, cols, diag1, diag2, current):
        if row == n:
            # Store as list of column positions per row
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

# Example: [[(0,1), (1,3), (2,0), (3,2)]] for n=4
```

**Output**: `List[List[Tuple[int, int]]]`

---

### Form 5: One-Dimensional Array Format

Compact representation: index = row, value = column:

```python
def solve_n_queens_compact(n):
    """Return solutions as arrays where index=row, value=col."""
    result = []
    
    def backtrack(row, cols, diag1, diag2, placement):
        if row == n:
            result.append(placement[:])  # Copy list
            return
        
        for col in range(n):
            if (col not in cols and 
                (row - col) not in diag1 and 
                (row + col) not in diag2):
                placement.append(col)
                backtrack(row + 1, ..., placement)
                placement.pop()
    
    backtrack(0, set(), set(), set(), [])
    return result

# Example: [[1, 3, 0, 2]] means:
#   Row 0: Queen at column 1
#   Row 1: Queen at column 3
#   Row 2: Queen at column 0
#   Row 3: Queen at column 2
```

---

### Form Comparison Summary

| Form | Output Type | Use Case | Space Efficiency |
|------|-------------|----------|------------------|
| **Standard** | `List[List[str]]` | Display, visualization | Low |
| **Count** | `int` | Statistics, decision | High |
| **Any solution** | `List[str]` | Validation, quick check | Medium |
| **Positions** | `List[Tuple]` | Processing, algorithms | Medium |
| **Compact** | `List[int]` | Storage, transmission | High |

---

### Conversion Between Forms

```python
# Compact → Standard Board
def to_board(placement, n):
    """Convert [1,3,0,2] to ['.Q..', '...Q', 'Q...', '..Q.']"""
    board = [['.' for _ in range(n)] for _ in range(n)]
    for row, col in enumerate(placement):
        board[row][col] = 'Q'
    return [''.join(r) for r in board]

# Standard Board → Compact
def to_compact(board):
    """Convert board format to [col1, col2, ...]"""
    n = len(board)
    placement = []
    for row in range(n):
        for col in range(n):
            if board[row][col] == 'Q':
                placement.append(col)
                break
    return placement
```

<!-- back -->
