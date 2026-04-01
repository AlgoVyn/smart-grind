## Title: Sudoku Solver - Tactics

What are specific techniques and optimizations for Sudoku solving?

<!-- front -->

---

### Tactic 1: Constraint Set Optimization

```python
def solve_sudoku_optimized(board):
    """Solve Sudoku using constraint sets for O(1) validation."""
    # Initialize constraint sets
    rows = [set() for _ in range(9)]
    cols = [set() for _ in range(9)]
    boxes = [set() for _ in range(9)]
    
    def get_box(r, c):
        return (r // 3) * 3 + (c // 3)
    
    def is_valid(r, c, num):
        return num not in rows[r] and num not in cols[c] and num not in boxes[get_box(r, c)]
    
    def place(r, c, num):
        board[r][c] = num
        rows[r].add(num)
        cols[c].add(num)
        boxes[get_box(r, c)].add(num)
    
    def remove(r, c, num):
        board[r][c] = 0
        rows[r].remove(num)
        cols[c].remove(num)
        boxes[get_box(r, c)].remove(num)
    
    # Initialize with given numbers
    for r in range(9):
        for c in range(9):
            if board[r][c] != 0:
                place(r, c, board[r][c])
    
    def backtrack():
        # Find empty cell with MRV
        min_options = 10
        selected = (-1, -1)
        
        for r in range(9):
            for c in range(9):
                if board[r][c] == 0:
                    options = sum(1 for num in range(1, 10) if is_valid(r, c, num))
                    if options < min_options:
                        min_options = options
                        selected = (r, c)
                        if options == 1:
                            break
            if min_options == 1:
                break
        
        if selected == (-1, -1):
            return True  # Solved!
        
        r, c = selected
        for num in range(1, 10):
            if is_valid(r, c, num):
                place(r, c, num)
                if backtrack():
                    return True
                remove(r, c, num)
        
        return False
    
    return backtrack()
```

---

### Tactic 2: Naked Singles (Constraint Propagation)

```python
def fill_naked_singles(board):
    """Fill cells that have only one possible value."""
    changed = True
    while changed:
        changed = False
        for r in range(9):
            for c in range(9):
                if board[r][c] == 0:
                    options = get_options(board, r, c)
                    if len(options) == 1:
                        board[r][c] = options[0]
                        changed = True
                    elif len(options) == 0:
                        return False  # Invalid state
    return True
```

---

### Tactic 3: Bitmask Representation

```python
def solve_sudoku_bitmask(board):
    """Use bitmasks to represent possible values."""
    # Each cell: bitmask of possible values (bit 1 = value 1 possible)
    # rows[i]: bitmask of used values in row i
    # cols[j]: bitmask of used values in col j
    # boxes[k]: bitmask of used values in box k
    
    # For 9x9, use 9-bit integers
    rows = [0] * 9
    cols = [0] * 9
    boxes = [0] * 9
    
    def get_bit(num):
        return 1 << (num - 1)
    
    def is_valid(r, c, num):
        bit = get_bit(num)
        return not (rows[r] & bit or cols[c] & bit or boxes[(r//3)*3 + c//3] & bit)
    
    # ... rest of backtracking
```

---

### Tactic 4: Dancing Links (Concept)

```python
# Note: Full DLX implementation is complex
# This is the concept for exact cover problems

"""
Sudoku as exact cover problem:
- 324 constraints: 81 cell + 81 row + 81 col + 81 box
- Each placement satisfies exactly 4 constraints
- Algorithm X with Dancing Links efficiently finds solution
"""
```

---

### Tactic 5: Algorithm Comparison

| Algorithm | Best For | Time | Space |
|-----------|----------|------|-------|
| **Backtracking** | CSP, puzzles | O(9^(n²)) | O(n²) |
| **Constraint Propagation** | Efficient CSP | Much better | O(n²) |
| **Dancing Links (DLX)** | Exact cover | Very fast | O(k) |
| **Brute Force** | Small exhaustive search | O(n^k) | O(k) |

**Key Insight:** MRV heuristic + constraint sets = fast practical solving.

<!-- back -->
