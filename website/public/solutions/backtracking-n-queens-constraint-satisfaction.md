# Backtracking - N-Queens / Constraint Satisfaction

## Overview

The Backtracking - N-Queens / Constraint Satisfaction pattern solves the classic N-Queens problem by placing N queens on an N x N chessboard such that no two queens threaten each other. It uses backtracking to try placements column by column, checking constraints for rows, columns, and diagonals. This pattern extends to general constraint satisfaction problems (CSPs) where variables must satisfy multiple constraints.

Apply this pattern to problems requiring placement or assignment with mutual exclusion constraints, such as scheduling, puzzle solving, or resource allocation. The benefits include systematic exploration with early pruning of invalid states, efficient constraint checking, and adaptability to various CSP formulations.

## Key Concepts

- **Column-wise Placement**: Place one queen per column to avoid column conflicts automatically.
- **Constraint Tracking**: Use sets to track occupied columns, and diagonals (using row-col and row+col offsets).
- **Backtracking**: Try placing a queen, recurse to next row, then remove and try next column.
- **Base Case**: When all rows are filled, a valid solution is found.
- **Pruning**: Skip placements that violate any constraint.

## Template

```python
def solveNQueens(n):
    def backtrack(row, cols, diagonals1, diagonals2, board):
        # Base case: all rows filled
        if row == n:
            # Add a copy of the board to results
            result.append([''.join(r) for r in board])
            return
        
        for col in range(n):
            # Check constraints: column and diagonals
            if (col in cols or 
                (row - col) in diagonals1 or 
                (row + col) in diagonals2):
                continue
            
            # Place queen
            cols.add(col)
            diagonals1.add(row - col)
            diagonals2.add(row + col)
            board[row][col] = 'Q'
            
            # Recurse to next row
            backtrack(row + 1, cols, diagonals1, diagonals2, board)
            
            # Backtrack: remove queen and constraints
            board[row][col] = '.'
            cols.remove(col)
            diagonals1.remove(row - col)
            diagonals2.remove(row + col)
    
    result = []
    board = [['.'] * n for _ in range(n)]
    backtrack(0, set(), set(), set(), board)
    return result
```

## Example Problems

1. **N-Queens (LeetCode 51)**: Place N queens on an N×N chessboard so that no two queens attack each other.
2. **N-Queens II (LeetCode 52)**: Count the number of distinct solutions to the N-Queens problem.
3. **Sudoku Solver (LeetCode 37)**: Solve a Sudoku puzzle by filling the grid with digits subject to row, column, and box constraints.

## Time and Space Complexity

- **Time Complexity**: O(n!) in the worst case, as each row has up to n choices, but pruning reduces it significantly.
- **Space Complexity**: O(n) for the sets tracking constraints, plus O(n^2) for the board.

## Common Pitfalls

- **Missing constraints**: Ensure all three constraints (column, diagonal1, diagonal2) are checked; forgetting diagonals leads to invalid solutions.
- **Incorrect diagonal calculation**: Diagonals are tracked by (row - col) and (row + col); verify the offsets.
- **Not backtracking board changes**: Always restore the board cell to '.' after recursion.
- **Set modifications**: Adding/removing from sets must be symmetric; mismatches cause incorrect state.
- **Large n**: For n > 12, exponential time may timeout; consider optimizations or heuristics.