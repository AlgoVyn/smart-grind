# Sudoku Solver

## Category
Backtracking

## Description
Solve Sudoku puzzle using backtracking with constraint propagation.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- backtracking related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Explanation

Sudoku Solver uses backtracking to find a valid solution to a 9x9 Sudoku puzzle. The algorithm tries to fill empty cells with digits 1-9 while maintaining Sudoku rules:
- Each row must contain digits 1-9 without repetition
- Each column must contain digits 1-9 without repetition
- Each 3x3 subgrid must contain digits 1-9 without repetition

### Backtracking Approach:
1. Find an empty cell
2. Try digits 1-9 in that cell
3. For each digit, check if it's valid according to Sudoku rules
4. If valid, place the digit and recursively solve the rest
5. If recursion leads to dead end, backtrack (remove digit and try next)

### Constraint Checking Optimization:
- Instead of checking all 3 constraints for every placement, use sets to track:
  - Which digits are used in each row
  - Which digits are used in each column
  - Which digits are used in each 3x3 box
- This reduces checking time from O(1) to O(1) with O(1) lookups

### Key Insights:
- Use sets/dictionaries for O(1) constraint checking
- Choose the next empty cell strategically (MRV heuristic)
- Early termination if no solution exists

---

## Algorithm Steps

1. Initialize constraint sets for rows, columns, and boxes
2. Fill constraint sets with given numbers
3. Find an empty cell (or use MRV heuristic)
4. Try digits 1-9:
   a. Check if digit is valid (not in row, column, or box)
   b. If valid: place digit, add to constraint sets, recurse
   c. If recursion succeeds: return True
   d. Otherwise: remove digit (backtrack)
5. If no digit works, return False

---

## Implementation

```python
def solve_sudoku(board: list) -> bool:
    """
    Solve a Sudoku puzzle using backtracking.
    
    Args:
        board: 9x9 grid where 0 represents empty cells
        
    Returns:
        True if solved, False if no solution exists
        
    Time: O(9^(n*n)) worst case
    Space: O(n*n) for recursion stack
    """
    
    def is_valid(row: int, col: int, num: int) -> bool:
        """Check if placing num at board[row][col] is valid."""
        # Check row
        if num in rows[row]:
            return False
        # Check column
        if num in cols[col]:
            return False
        # Check 3x3 box
        box_idx = (row // 3) * 3 + (col // 3)
        if num in boxes[box_idx]:
            return False
        return True
    
    def place(num: int, row: int, col: int):
        """Place num at board[row][col] and update constraints."""
        board[row][col] = num
        rows[row].add(num)
        cols[col].add(num)
        box_idx = (row // 3) * 3 + (col // 3)
        boxes[box_idx].add(num)
    
    def remove(num: int, row: int, col: int):
        """Remove num from board[row][col] and update constraints."""
        board[row][col] = 0
        rows[row].remove(num)
        cols[col].remove(num)
        box_idx = (row // 3) * 3 + (col // 3)
        boxes[box_idx].remove(num)
    
    def backtrack() -> bool:
        """Recursively solve the Sudoku puzzle."""
        # Find next empty cell
        min_options = 10
        selected_cell = (-1, -1)
        
        for i in range(9):
            for j in range(9):
                if board[i][j] == 0:
                    # Count valid options (MRV heuristic)
                    options = sum(
                        1 for num in range(1, 10)
                        if is_valid(i, j, num)
                    )
                    if options < min_options:
                        min_options = options
                        selected_cell = (i, j)
                        if options == 1:
                            break
            if min_options == 1:
                break
        
        # No empty cells - puzzle solved!
        if selected_cell == (-1, -1):
            return True
        
        row, col = selected_cell
        
        for num in range(1, 10):
            if is_valid(row, col, num):
                place(num, row, col)
                if backtrack():
                    return True
                remove(num, row, col)
        
        return False
    
    # Initialize constraint sets
    rows = [set() for _ in range(9)]
    cols = [set() for _ in range(9)]
    boxes = [set() for _ in range(9)]
    
    # Fill constraint sets with given numbers
    for i in range(9):
        for j in range(9):
            if board[i][j] != 0:
                place(board[i][j], i, j)
    
    return backtrack()


def print_board(board: list):
    """Print the Sudoku board in readable format."""
    for i in range(9):
        if i % 3 == 0 and i > 0:
            print("-" * 21)
        for j in range(9):
            if j % 3 == 0 and j > 0:
                print("|", end=" ")
            print(board[i][j], end=" ")
        print()


# Example usage
if __name__ == "__main__":
    # Sample Sudoku puzzle (0 = empty)
    board = [
        [5, 3, 0, 0, 7, 0, 0, 0, 0],
        [6, 0, 0, 1, 9, 5, 0, 0, 0],
        [0, 9, 8, 0, 0, 0, 0, 6, 0],
        [8, 0, 0, 0, 6, 0, 0, 0, 3],
        [4, 0, 0, 8, 0, 3, 0, 0, 1],
        [7, 0, 0, 0, 2, 0, 0, 0, 6],
        [0, 6, 0, 0, 0, 0, 2, 8, 0],
        [0, 0, 0, 4, 1, 9, 0, 0, 5],
        [0, 0, 0, 0, 8, 0, 0, 7, 9]
    ]
    
    print("Original Sudoku:")
    print_board(board)
    
    if solve_sudoku(board):
        print("\nSolved Sudoku:")
        print_board(board)
    else:
        print("No solution exists!")

```javascript
function sudokuSolver() {
    // Sudoku Solver implementation
    // Time: O(9^(n*n))
    // Space: O(n*n)
}
```

---

## Example

**Input:**
```python
board = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
]
```

**Output:**
```
Original Sudoku:
5 3 0 | 0 7 0 | 0 0 0
6 0 0 | 1 9 5 | 0 0 0
0 9 8 | 0 0 0 | 0 6 0
---------------------
8 0 0 | 0 6 0 | 0 0 3
4 0 0 | 8 0 3 | 0 0 1
7 0 0 | 0 2 0 | 0 0 6
---------------------
0 6 0 | 0 0 0 | 2 8 0
0 0 0 | 4 1 9 | 0 0 5
0 0 0 | 0 8 0 | 0 7 9

Solved Sudoku:
5 3 4 | 6 7 8 | 9 1 2
6 7 2 | 1 9 5 | 3 4 8
1 9 8 | 3 4 2 | 5 6 7
---------------------
8 5 9 | 7 6 1 | 4 2 3
4 2 6 | 8 5 3 | 7 9 1
7 1 3 | 9 2 4 | 8 5 6
---------------------
9 6 1 | 5 3 7 | 2 8 4
2 8 7 | 4 1 9 | 6 3 5
3 4 5 | 2 8 6 | 1 7 9
```

**Explanation:**
The solver fills in the empty cells (0s) with valid digits 1-9 while maintaining:
- Each row contains digits 1-9 exactly once
- Each column contains digits 1-9 exactly once
- Each 3x3 subgrid contains digits 1-9 exactly once

---

## Time Complexity
**O(9^(n*n))**

---

## Space Complexity
**O(n*n)**

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
