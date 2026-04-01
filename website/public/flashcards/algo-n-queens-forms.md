## N-Queens: Forms & Variations

What are the different forms and variations of the N-Queens problem?

<!-- front -->

---

### Form 1: Standard N-Queens (All Solutions)

```python
# Find all valid configurations
def solve_n_queens(n):
    solutions = []
    # Backtracking to collect all solutions
    return solutions

# N=4 Solutions:
# [".Q..", "...Q", "Q...", "..Q."]
# ["..Q.", "Q...", "...Q", ".Q.."]
```

---

### Form 2: Check Validity Only

```python
def is_valid_n_queens(board):
    """
    Check if given board is valid N-Queens solution.
    Board is list of queen column positions per row.
    """
    n = len(board)
    
    for i in range(n):
        for j in range(i + 1, n):
            # Same column
            if board[i] == board[j]:
                return False
            # Same diagonal
            if abs(board[i] - board[j]) == abs(i - j):
                return False
    
    return True

# Example: is_valid_n_queens([1, 3, 0, 2]) for N=4
```

---

### Form 3: N-Queens II (Count Only)

```python
def total_n_queens(n):
    """
    Return only count of solutions, not the solutions themselves.
    Faster when only count needed.
    """
    def backtrack(row, cols, diags, anti_diags):
        if row == n:
            return 1
        
        count = 0
        for col in range(n):
            if not is_safe(row, col, cols, diags, anti_diags):
                continue
            
            mark_queen(row, col, cols, diags, anti_diags)
            count += backtrack(row + 1, cols, diags, anti_diags)
            unmark_queen(row, col, cols, diags, anti_diags)
        
        return count
    
    return backtrack(0, set(), set(), set())
```

---

### Form 4: Queens That Can Attack the King

```python
def queens_attack_king(queens, king):
    """
    Given multiple queens, find which can attack the king.
    Related to queen movement pattern.
    """
    kx, ky = king
    attackers = []
    
    # Check all 8 directions
    directions = [(-1, -1), (-1, 0), (-1, 1), (0, -1), 
                  (0, 1), (1, -1), (1, 0), (1, 1)]
    
    queen_set = set(queens)
    
    for dx, dy in directions:
        x, y = kx + dx, ky + dy
        while 0 <= x < 8 and 0 <= y < 8:
            if (x, y) in queen_set:
                attackers.append((x, y))
                break
            x += dx
            y += dy
    
    return attackers
```

---

### Form 5: Maximum Non-Attacking Queens

```python
def max_queens_with_obstacles(n, obstacles):
    """
    Maximum queens placement with obstacles on board.
    Variant where some squares are blocked.
    """
    obstacle_set = set(obstacles)
    
    def can_place(row, col, queen_positions):
        if (row, col) in obstacle_set:
            return False
        
        for qr, qc in queen_positions:
            if (qr == row or qc == col or 
                abs(qr - row) == abs(qc - col)):
                return False
        return True
    
    def backtrack(row, queen_positions):
        if row == n:
            return len(queen_positions)
        
        max_queens = backtrack(row + 1, queen_positions)  # Skip row
        
        for col in range(n):
            if can_place(row, col, queen_positions):
                queen_positions.append((row, col))
                max_queens = max(max_queens, 
                    backtrack(row + 1, queen_positions))
                queen_positions.pop()
        
        return max_queens
    
    return backtrack(0, [])
```

<!-- back -->
