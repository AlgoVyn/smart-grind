## N-Queens: Tactics & Techniques

What are the tactical patterns for solving N-Queens variations?

<!-- front -->

---

### Tactic 1: Diagonal Representation

Use sets or bitmasks for O(1) conflict checking.

```python
# Set-based (clear, slower)
cols, diags, anti_diags = set(), set(), set()
diag = row - col
anti_diag = row + col

# Array-based (fast, fixed memory)
cols = [False] * n
diags = [False] * (2 * n - 1)  # row - col + (n - 1)
anti_diags = [False] * (2 * n - 1)  # row + col

# Bitmask (fastest, compact)
cols_mask = 0
diag_mask = 0
anti_mask = 0
```

---

### Tactic 2: Pruning with Forward Checking

Check if remaining rows can possibly fit:

```python
def can_complete(n, row, cols, diags, anti_diags):
    """Quick check if solution is still possible"""
    available_cols = n - len(cols)
    remaining_rows = n - row
    
    # Basic check: need at least as many free columns as rows
    if available_cols < remaining_rows:
        return False
    
    return True
```

---

### Tactic 3: Symmetry Reduction

Eliminate symmetric solutions to reduce search:

```python
def solve_with_symmetry(n):
    """Only search unique configurations"""
    if n == 0:
        return 1
    
    # First queen only in first half of first row
    count = 0
    for col in range((n + 1) // 2):
        count += solve_from_position(n, 0, col)
    
    # Multiply by 2 for mirror (except middle)
    return 2 * count - (n % 2) * solve_from_position(n, 0, n // 2)
```

---

### Tactic 4: Warnsdorff's Rule (Heuristic)

For knight-related, but applicable: prioritize harder positions.

```python
def heuristic_placement(n):
    """
    Place queens in columns with fewer conflicts first.
    """
    def count_conflicts(row, col, cols, diags, anti_diags):
        """Count how many future positions this blocks"""
        count = 0
        for r in range(row + 1, n):
            for c in range(n):
                if (c in cols or 
                    (r - c) in diags or 
                    (r + c) in anti_diags):
                    continue
                if c == col or (r - c) == (row - col) or (r + c) == (row + col):
                    count += 1
        return count
    
    # Try columns in order of least conflicts
    # ... implementation continues
```

---

### Tactic 5: Iterative Deepening for Large N

For very large N, use probabilistic or heuristic methods:

```python
def solve_large_n_heuristic(n):
    """
    For n > 20, use heuristic search or simulated annealing.
    """
    import random
    
    # Random initial placement (one per row)
    board = list(range(n))
    random.shuffle(board)
    
    # Hill climbing / simulated annealing
    # Minimize conflicts through swaps
    
    def count_conflicts(board):
        conflicts = 0
        for i in range(n):
            for j in range(i + 1, n):
                if board[i] == board[j]:  # Same column
                    conflicts += 1
                if abs(board[i] - board[j]) == abs(i - j):  # Diagonal
                    conflicts += 1
        return conflicts
    
    # Iterative improvement
    for _ in range(100000):
        conflicts = count_conflicts(board)
        if conflicts == 0:
            return board
        
        # Try random swap
        i, j = random.sample(range(n), 2)
        board[i], board[j] = board[j], board[i]
        
        new_conflicts = count_conflicts(board)
        if new_conflicts > conflicts:
            # Revert if worse
            board[i], board[j] = board[j], board[i]
    
    return None  # Failed to find solution
```

<!-- back -->
