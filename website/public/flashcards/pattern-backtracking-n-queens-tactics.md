## Backtracking - N-Queens: Tactics

What are the advanced techniques for N-Queens and constraint satisfaction?

<!-- front -->

---

### Tactic 1: Bitmask Optimization

Use bits instead of sets for faster operations:

```python
def solve_n_queens_bitmask(n):
    """Solve using bitmasks - faster for small n."""
    result = []
    
    def backtrack(row, cols, diag1, diag2, board):
        if row == n:
            result.append([''.join(r) for r in board])
            return
        
        # Available positions: bits not set in any constraint
        available = (~(cols | diag1 | diag2)) & ((1 << n) - 1)
        
        while available:
            # Get rightmost available bit
            bit = available & -available
            available -= bit
            
            col = (bit).bit_length() - 1
            board[row][col] = 'Q'
            
            backtrack(
                row + 1,
                cols | bit,
                (diag1 | bit) << 1,
                (diag2 | bit) >> 1,
                board
            )
            
            board[row][col] = '.'
    
    board = [['.' for _ in range(n)] for _ in range(n)]
    backtrack(0, 0, 0, 0, board)
    return result
```

**Benefit**: O(1) constraint checks with bitwise ops

---

### Tactic 2: Symmetry Pruning

Eliminate symmetric solutions early:

```python
def solve_n_queens_symmetry(n):
    """Use symmetry to reduce search space."""
    result = []
    
    def backtrack(row, cols, diag1, diag2, positions):
        if row == n:
            result.append(positions[:])
            return
        
        # Only search first half of first row (symmetry)
        start = 0 if row > 0 else 0
        end = n // 2 if row == 0 else n
        
        for col in range(start, end):
            if (col in cols or (row - col) in diag1 or (row + col) in diag2):
                continue
            
            positions.append(col)
            backtrack(
                row + 1,
                cols | {col},
                diag1 | {row - col},
                diag2 | {row + col},
                positions
            )
            positions.pop()
    
    backtrack(0, set(), set(), set(), [])
    # Mirror solutions for complete set
    return result
```

---

### Tactic 3: Most Constrained Variable

Place queen in column with fewest valid positions first:

```python
def solve_n_queens_mcv(n):
    """Most Constrained Variable heuristic."""
    def count_valid_positions(row, cols, diag1, diag2):
        count = 0
        for col in range(n):
            if (col not in cols and 
                (row - col) not in diag1 and 
                (row + col) not in diag2):
                count += 1
        return count
    
    def backtrack(row, cols, diag1, diag2, board):
        if row == n:
            return [[]]
        
        # Order columns by constraint count (least first)
        candidates = []
        for col in range(n):
            if (col not in cols and 
                (row - col) not in diag1 and 
                (row + col) not in diag2):
                # Count future constraints
                future = count_valid_positions(row + 1, cols | {col}, 
                                              diag1 | {row - col}, 
                                              diag2 | {row + col})
                candidates.append((future, col))
        
        candidates.sort()  # Most constrained first
        
        result = []
        for _, col in candidates:
            board[row][col] = 'Q'
            for sol in backtrack(row + 1, cols | {col}, 
                                diag1 | {row - col}, 
                                diag2 | {row + col}, board):
                result.append([[row, col]] + sol)
            board[row][col] = '.'
        
        return result
    
    board = [['.' for _ in range(n)] for _ in range(n)]
    return backtrack(0, set(), set(), set(), board)
```

---

### Tactic 4: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Wrong diagonal formula | Invalid placements | Use `row-col` and `row+col` |
| Missing backtrack | Constraints accumulate | Remove after recursion |
| Deep copy board | Performance | Reuse board, copy at solution |
| Wrong base case | Missing solutions | Check `row == n` |
| Column vs row placement | Confused logic | Be consistent |

---

### Tactic 5: N-Queens Count Only

If only need count, not solutions:

```python
def count_n_queens(n):
    """Count solutions without storing them."""
    count = 0
    
    def backtrack(row, cols, diag1, diag2):
        nonlocal count
        if row == n:
            count += 1
            return
        
        for col in range(n):
            if (col in cols or 
                (row - col) in diag1 or 
                (row + col) in diag2):
                continue
            
            backtrack(row + 1,
                     cols | {col},
                     diag1 | {row - col},
                     diag2 | {row + col})
    
    backtrack(0, set(), set(), set())
    return count
```

**Optimization**: No board, no solution construction

---

### Tactic 6: Iterative with Stack

```python
def solve_n_queens_iterative(n):
    """Iterative DFS using stack."""
    result = []
    # Stack: (row, cols, diag1, diag2, positions)
    stack = [(0, set(), set(), set(), [])]
    
    while stack:
        row, cols, diag1, diag2, positions = stack.pop()
        
        if row == n:
            result.append(positions)
            continue
        
        for col in range(n - 1, -1, -1):  # Reverse for correct order
            if (col in cols or 
                (row - col) in diag1 or 
                (row + col) in diag2):
                continue
            
            new_positions = positions + [col]
            stack.append((
                row + 1,
                cols | {col},
                diag1 | {row - col},
                diag2 | {row + col},
                new_positions
            ))
    
    return result
```

<!-- back -->
