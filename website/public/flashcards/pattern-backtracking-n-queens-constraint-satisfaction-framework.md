## Backtracking - N-Queens: Framework

What is the complete code template for solving N-Queens using backtracking?

<!-- front -->

---

### Framework 1: Set-based Constraint Tracking

```
┌─────────────────────────────────────────────────────┐
│  N-QUEENS BACKTRACKING - TEMPLATE                      │
├─────────────────────────────────────────────────────┤
│  1. Initialize three constraint sets:                  │
│     - cols: columns with queens                        │
│     - diag1 (\): row - col values                     │
│     - diag2 (/): row + col values                     │
│                                                        │
│  2. Backtrack(row):                                    │
│     a. If row == n: found valid solution              │
│                                                        │
│     b. For each col in 0 to n-1:                      │
│        - Check: col not in cols                       │
│        - Check: (row-col) not in diag1                │
│        - Check: (row+col) not in diag2                │
│                                                        │
│        - If valid:                                     │
│          * Place queen at (row, col)                  │
│          * Add constraints to sets                    │
│          * Recurse: backtrack(row + 1)                │
│          * Remove constraints (backtrack)               │
│                                                        │
│  3. Return all solutions found                         │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: N-Queens

```python
def solve_n_queens(n):
    """
    Solve N-Queens using backtracking with constraint sets.
    LeetCode 51 - N-Queens
    Time: O(n!), Space: O(n)
    """
    def backtrack(row, cols, diag1, diag2, board):
        # Base case: all queens placed
        if row == n:
            solution = [''.join(r) for r in board]
            result.append(solution)
            return
        
        # Try each column in current row
        for col in range(n):
            # Check constraints
            if (col in cols or 
                (row - col) in diag1 or 
                (row + col) in diag2):
                continue
            
            # Place queen
            board[row][col] = 'Q'
            cols.add(col)
            diag1.add(row - col)
            diag2.add(row + col)
            
            # Recurse to next row
            backtrack(row + 1, cols, diag1, diag2, board)
            
            # Backtrack: remove queen
            board[row][col] = '.'
            cols.remove(col)
            diag1.remove(row - col)
            diag2.remove(row + col)
    
    result = []
    board = [['.' for _ in range(n)] for _ in range(n)]
    backtrack(0, set(), set(), set(), board)
    return result
```

---

### Key Insight: Diagonal Encoding

```
Anti-diagonal (\): row - col is constant
Main-diagonal (/): row + col is constant

Example for 4x4:
  0 1 2 3
0 . . . .
1 . . . .
2 . . . .
3 . . . .

Position (2,1): 
  - Anti-diag: 2-1 = 1
  - Main-diag: 2+1 = 3
```

---

### Key Pattern Elements

| Element | Purpose | Data Structure |
|---------|---------|----------------|
| `cols` | Track occupied columns | Set |
| `diag1` | Anti-diagonals (row-col) | Set |
| `diag2` | Main-diagonals (row+col) | Set |
| Backtracking | Try → Recurse → Undo | DFS pattern |
| Pruning | Skip invalid early | Constraint check |

<!-- back -->
