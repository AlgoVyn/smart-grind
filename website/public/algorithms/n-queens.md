# N-Queens

## Category
Backtracking

## Description
Place N queens on N×N board so no two attack each other.

## Algorithm Explanation
The N-Queens problem is a classic backtracking problem where we must place N queens on an N×N chessboard such that no two queens threaten each other. A queen can attack horizontally, vertically, and diagonally.

**Approach using Backtracking:**
1. **Try placing queens row by row**: Since each row must have exactly one queen, we process one row at a time
2. **Constraint checking**: For each column in the current row, check if placing a queen is valid:
   - No queen in the same column (column check)
   - No queen in the upper-left diagonal (row - col constant)
   - No queen in the upper-right diagonal (row + col constant)
3. **Backtrack**: If we reach a dead end, remove the queen and try the next position
4. **Base case**: When all N queens are placed, we have a valid solution

**Optimization techniques:**
- Use sets to track columns and diagonals under attack (O(1) lookup)
- Early termination when no valid placement exists in a row

**Why backtracking works:** We explore all possible placements systematically, and when we hit an invalid state, we undo the last placement and try a different option.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- backtracking related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Steps
1. Understand the problem constraints and requirements
2. Identify the input and expected output
3. Apply the core algorithm logic
4. Handle edge cases appropriately
5. Optimize for the given constraints

---

## Implementation

```python
def solve_n_queens(n):
    """
    Solve N-Queens problem using backtracking.
    
    Args:
        n: Number of queens (board is n×n)
    
    Returns:
        List of solutions, each solution is a list of column positions
        where row i has queen at column positions[i]
    
    Time: O(N!) - worst case exploration
    Space: O(N) - for recursion stack and tracking sets
    """
    solutions = []
    
    # Track columns and diagonals under attack
    cols = set()           # columns with queens
    pos_diag = set()       # r + c for positive diagonal
    neg_diag = set()       # r - c for negative diagonal
    
    def backtrack(row, board):
        # Base case: all queens placed
        if row == n:
            solutions.append(board[:])
            return
        
        for col in range(n):
            # Check if this position is under attack
            if col in cols or (row + col) in pos_diag or (row - col) in neg_diag:
                continue
            
            # Place queen
            cols.add(col)
            pos_diag.add(row + col)
            neg_diag.add(row - col)
            board.append(col)
            
            # Recurse to next row
            backtrack(row + 1, board)
            
            # Backtrack: remove queen
            cols.remove(col)
            pos_diag.remove(row + col)
            neg_diag.remove(row - col)
            board.pop()
    
    backtrack(0, [])
    return solutions

# Alternative: Return board representations
def solve_n_queens_board(n):
    """Return solutions as board strings."""
    solutions = solve_n_queens(n)
    result = []
    for positions in solutions:
        board = []
        for col in positions:
            row_str = '.' * col + 'Q' + '.' * (n - col - 1)
            board.append(row_str)
        result.append(board)
    return result
```

```javascript
function solveNQueens(n) {
    const solutions = [];
    const cols = new Set();
    const posDiag = new Set();
    const negDiag = new Set();
    
    function backtrack(row, board) {
        if (row === n) {
            solutions.push([...board]);
            return;
        }
        
        for (let col = 0; col < n; col++) {
            if (cols.has(col) || posDiag.has(row + col) || negDiag.has(row - col)) {
                continue;
            }
            
            cols.add(col);
            posDiag.add(row + col);
            negDiag.add(row - col);
            board.push(col);
            
            backtrack(row + 1, board);
            
            cols.delete(col);
            posDiag.delete(row + col);
            negDiag.delete(row - col);
            board.pop();
        }
    }
    
    backtrack(0, []);
    return solutions;
}
```

---

## Example

**Input:**
```
n = 4
```

**Output:**
```
[
  [".Q..", "...Q", "Q...", "..Q."],
  ["..Q.", "Q...", "...Q", ".Q.."]
]
```

**Explanation:**
- For n=4, there are 2 valid solutions
- Solution 1: Queen at (0,1), (1,3), (2,0), (3,2)
- Solution 2: Queen at (0,2), (1,0), (2,3), (3,1)

**Input:**
```
n = 1
```

**Output:**
```
[["Q"]]
```

**Input:**
```
n = 2 or n = 3
```

**Output:**
```
[]
```

**Explanation:** No solutions exist for n=2 and n=3.

---

## Time Complexity
**O(N!)**

---

## Space Complexity
**O(N)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
