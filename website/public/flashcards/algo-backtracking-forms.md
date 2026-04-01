## Backtracking: Problem Forms

What are the standard problem forms that use backtracking, and how do they map to the template?

<!-- front -->

---

### Permutations

**Form:** Generate all arrangements of n elements

```python
def permutations(nums):
    result = []
    
    def backtrack(path, used):
        if len(path) == len(nums):
            result.append(path[:])
            return
        
        for i in range(len(nums)):
            if used[i]:
                continue
            used[i] = True
            path.append(nums[i])
            backtrack(path, used)
            path.pop()
            used[i] = False
    
    backtrack([], [False] * len(nums))
    return result

# Count: n! permutations
```

---

### Combinations/Subsets

**Form:** Generate all subsets or k-element combinations

```python
def subsets(nums):
    result = []
    
    def backtrack(start, path):
        result.append(path[:])  # All paths are valid subsets
        
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)  # i+1: no reuse
            path.pop()
    
    backtrack(0, [])
    return result

def combinations(n, k):
    # Prune: if len(path) + (n - i) < k, can't complete
    # Add early termination
```

---

### N-Queens

**Form:** Place n queens on n×n board with no attacks

```python
def solve_n_queens(n):
    result = []
    
    def is_valid(board, row, col):
        # Check column and diagonals for existing queens
        for r in range(row):
            if board[r] == col or \
               abs(board[r] - col) == abs(r - row):
                return False
        return True
    
    def backtrack(board, row):
        if row == n:
            result.append(board[:])
            return
        
        for col in range(n):
            if is_valid(board, row, col):
                board[row] = col
                backtrack(board, row + 1)
                # No need to reset, will be overwritten
    
    backtrack([-1] * n, 0)
    return result
```

---

### Constraint Satisfaction

**Form:** Variables with domains and constraints

| Problem | Variables | Domain | Constraints |
|---------|-----------|--------|-------------|
| **Sudoku** | 81 cells | 1-9 | Row/col/box unique |
| **Graph coloring** | n nodes | k colors | Adjacent different |
| **Cryptarithmetic** | Letters | 0-9 | Equation holds |
| **Crossword** | Word slots | Dictionary | Intersection matches |

---

### Path Finding in Grid/Graph

**Form:** Find valid paths with constraints

```python
def find_paths(grid, start, end):
    # State: (row, col, path_so_far, visited_set)
    # Valid move: in bounds, not obstacle, not visited
    # Complete: reached end
    
    # Variants:
    # - Knight's tour: visit every cell exactly once
    # - Word search: path spells word
    # - Maze solving: shortest vs any path
```

<!-- back -->
