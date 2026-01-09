# Sudoku Solver

## Problem Description

Write a program to solve a Sudoku puzzle by filling the empty cells.

A sudoku solution must satisfy all of the following rules:

1. Each of the digits 1-9 must occur exactly once in each row.
2. Each of the digits 1-9 must occur exactly once in each column.
3. Each of the digits 1-9 must occur exactly once in each of the 9 3x3 sub-boxes of the grid.

The '.' character indicates empty cells.

**Example 1:**

Input: `board = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]`

Output: `[["5","3","4","6","7","8","9","1","2"],["6","7","2","1","9","5","3","4","8"],["1","9","8","3","4","2","5","6","7"],["8","5","9","7","6","1","4","2","3"],["4","2","6","8","5","3","7","9","1"],["7","1","3","9","2","4","8","5","6"],["9","6","1","5","3","7","2","8","4"],["2","8","7","4","1","9","6","3","5"],["3","4","5","2","8","6","1","7","9"]]`

Explanation: The input board is shown above and the only valid solution is shown below.

## Constraints

- `board.length == 9`
- `board[i].length == 9`
- `board[i][j]` is a digit or '.'.
- It is guaranteed that the input board has only one solution.

## Solution

```python
from typing import List

def solveSudoku(board: List[List[str]]) -> None:
    def is_valid(row: int, col: int, num: int) -> bool:
        # Check row
        for j in range(9):
            if board[row][j] == str(num):
                return False
        # Check column
        for i in range(9):
            if board[i][col] == str(num):
                return False
        # Check 3x3 box
        box_row = (row // 3) * 3
        box_col = (col // 3) * 3
        for i in range(3):
            for j in range(3):
                if board[box_row + i][box_col + j] == str(num):
                    return False
        return True

    def backtrack() -> bool:
        for i in range(9):
            for j in range(9):
                if board[i][j] == '.':
                    for num in range(1, 10):
                        if is_valid(i, j, num):
                            board[i][j] = str(num)
                            if backtrack():
                                return True
                            board[i][j] = '.'
                    return False
        return True

    backtrack()
```

## Explanation

To solve Sudoku, we use backtracking to fill empty cells with digits 1-9, ensuring no duplicates in rows, columns, or 3x3 boxes.

1. The `is_valid` function checks if placing `num` at `(row, col)` violates Sudoku rules by scanning the row, column, and 3x3 box.
2. The `backtrack` function iterates through all cells, finding empty ones ('.').
3. For each empty cell, try numbers 1-9; if valid, place it and recurse.
4. If recursion succeeds (board filled), return `True`; else, reset cell and try next number.
5. If no number works, return `False` to backtrack.

This modifies the board in-place.

**Time Complexity:** Exponential in worst case, but efficient for standard Sudoku due to constraints.

**Space Complexity:** O(1), since board is 9x9 and recursion depth is at most 81.
