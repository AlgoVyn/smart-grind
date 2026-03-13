# Sudoku Solver

## Problem Description

Write a program to solve a Sudoku puzzle by filling the empty cells.

A sudoku solution must satisfy all of the following rules:

1. Each of the digits 1-9 must occur exactly once in each row.
2. Each of the digits 1-9 must occur exactly once in each column.
3. Each of the digits 1-9 must occur exactly once in each of the 9 3x3 sub-boxes of the grid.

The '.' character indicates empty cells.

---

## Examples

### Example

**Input:** 
```
board = [["5","3",".",".","7",".",".",".","."],
         ["6",".",".","1","9","5",".",".","."],
         [".","9","8",".",".",".",".","6","."],
         ["8",".",".",".","6",".",".",".","3"],
         ["4",".",".","8",".","3",".",".","1"],
         ["7",".",".",".","2",".",".",".","6"],
         [".","6",".",".",".",".","2","8","."],
         [".",".",".","4","1","9",".",".","5"],
         [".",".",".",".","8",".",".","7","9"]]
```

**Output:** 
```
[["5","3","4","6","7","8","9","1","2"],
 ["6","7","2","1","9","5","3","4","8"],
 ["1","9","8","3","4","2","5","6","7"],
 ["8","5","9","7","6","1","4","2","3"],
 ["4","2","6","8","5","3","7","9","1"],
 ["7","1","3","9","2","4","8","5","6"],
 ["9","6","1","5","3","7","2","8","4"],
 ["2","8","7","4","1","9","6","3","5"],
 ["3","4","5","2","8","6","1","7","9"]]
```

**Explanation:** The input board is shown above and the only valid solution is shown below.

---

## Constraints

- `board.length == 9`
- `board[i].length == 9`
- `board[i][j]` is a digit or '.'.
- It is guaranteed that the input board has only one solution.

---

## LeetCode Link

[LeetCode Problem 37: Sudoku Solver](https://leetcode.com/problems/sudoku-solver/)

---

## Pattern: Backtracking with Constraint Satisfaction

This problem follows the **Backtracking** pattern for constraint satisfaction problems.

### Core Concept

- **Constraint Propagation**: Each placement must satisfy row, column, and 3x3 box
- **Backtracking**: Try number, check validity, recurse, undo on failure
- **Deterministic**: Exactly one solution guaranteed
- **Optimization**: Choose most constrained cell (fewest possibilities)

### When to Use This Pattern

This pattern is applicable when:
1. Solving puzzles with multiple constraints
2. Problems requiring exhaustive search with pruning
3. N-Queens and similar problems

### Alternative Patterns

| Pattern | Description |
|---------|-------------|
| Constraint Sets | Pre-compute available numbers |
| DLX (Algorithm X) | Exact cover problem solver |

---

## Intuition

The key insight for solving Sudoku is using **backtracking** with constraint checking:

> Try each digit 1-9 in empty cells, and backtrack when a contradiction is found.

### Key Observations

1. **Constraint Propagation**: Each placement must satisfy three constraints: row, column, and 3x3 box.

2. **Backtracking**: Try a number, check validity, recurse. If dead end, undo and try next number.

3. **Deterministic Solution**: The problem guarantees exactly one solution, so we can stop when found.

4. **Optimization**: Choose the most constrained cell first (fewest possibilities) for efficiency.

### Why Backtracking Works

Backtracking systematically explores all possible assignments while pruning branches that violate constraints. Since the puzzle has exactly one solution, this exploration is guaranteed to succeed.

---

## Multiple Approaches with Code

We'll cover two approaches:
1. **Standard Backtracking** - Basic recursive approach
2. **Optimized Backtracking** - With constraint tracking sets

---

## Approach 1: Standard Backtracking

### Algorithm Steps

1. Find an empty cell ('.')
2. Try numbers 1-9 in that cell
3. Check if placement is valid (row, column, 3x3 box)
4. If valid, place and recurse
5. If recursion succeeds, return True
6. Otherwise, reset cell and try next number
7. If no number works, return False

### Why It Works

This brute-force approach explores all possible solutions. The validity check ensures we only explore valid paths, and backtracking undoes invalid choices.

### Code Implementation

````carousel
```python
from typing import List

def solveSudoku(board: List[List[str]]) -> None:
    """
    Solve Sudoku using backtracking.
    Modifies the board in-place.
    """
    
    def is_valid(row: int, col: int, num: int) -> bool:
        """Check if placing num at (row, col) is valid."""
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
        """Main backtracking function."""
        # Find empty cell
        for i in range(9):
            for j in range(9):
                if board[i][j] == '.':
                    # Try numbers 1-9
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

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    void solveSudoku(vector<vector<char>>& board) {
        solve(board);
    }
    
private:
    bool isValid(vector<vector<char>>& board, int row, int col, char num) {
        // Check row
        for (int j = 0; j < 9; j++) {
            if (board[row][j] == num) return false;
        }
        
        // Check column
        for (int i = 0; i < 9; i++) {
            if (board[i][col] == num) return false;
        }
        
        // Check 3x3 box
        int boxRow = (row / 3) * 3;
        int boxCol = (col / 3) * 3;
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[boxRow + i][boxCol + j] == num) return false;
            }
        }
        
        return true;
    }
    
    bool solve(vector<vector<char>>& board) {
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if (board[i][j] == '.') {
                    for (char num = '1'; num <= '9'; num++) {
                        if (isValid(board, i, j, num)) {
                            board[i][j] = num;
                            if (solve(board)) return true;
                            board[i][j] = '.';
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
};
```

<!-- slide -->
```java
class Solution {
    public void solveSudoku(char[][] board) {
        solve(board);
    }
    
    private boolean isValid(char[][] board, int row, int col, char num) {
        // Check row
        for (int j = 0; j < 9; j++) {
            if (board[row][j] == num) return false;
        }
        
        // Check column
        for (int i = 0; i < 9; i++) {
            if (board[i][col] == num) return false;
        }
        
        // Check 3x3 box
        int boxRow = (row / 3) * 3;
        int boxCol = (col / 3) * 3;
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                if (board[boxRow + i][boxCol + j] == num) return false;
            }
        }
        
        return true;
    }
    
    private boolean solve(char[][] board) {
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if (board[i][j] == '.') {
                    for (char num = '1'; num <= '9'; num++) {
                        if (isValid(board, i, j, num)) {
                            board[i][j] = num;
                            if (solve(board)) return true;
                            board[i][j] = '.';
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {character[][]} board
 * @return {void} Do not return anything, modify board in-place instead.
 */
var solveSudoku = function(board) {
    const isValid = (row, col, num) => {
        // Check row
        for (let j = 0; j < 9; j++) {
            if (board[row][j] === num) return false;
        }
        
        // Check column
        for (let i = 0; i < 9; i++) {
            if (board[i][col] === num) return false;
        }
        
        // Check 3x3 box
        const boxRow = Math.floor(row / 3) * 3;
        const boxCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[boxRow + i][boxCol + j] === num) return false;
            }
        }
        
        return true;
    };
    
    const solve = () => {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] === '.') {
                    for (let num = 1; num <= 9; num++) {
                        if (isValid(i, j, String(num))) {
                            board[i][j] = String(num);
                            if (solve()) return true;
                            board[i][j] = '.';
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    };
    
    solve();
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(9^m) where m is number of empty cells (worst case) |
| **Space** | O(m) recursion depth |

---

## Approach 2: Optimized with Constraint Sets

### Algorithm Steps

1. Pre-compute sets for rows, columns, and boxes showing which numbers are available
2. Find empty cell with fewest possibilities
3. Try numbers from the available set
4. Update sets on placement and backtrack

### Why It Works

Using sets to track available numbers reduces validation time from O(1) per check but speeds up by avoiding redundant scanning.

### Code Implementation

````carousel
```python
from typing import List

def solveSudoku(board: List[List[str]]) -> None:
    """
    Optimized Sudoku solver using constraint tracking.
    """
    rows = [set() for _ in range(9)]
    cols = [set() for _ in range(9)]
    boxes = [set() for _ in range(9)]
    
    # Initialize constraints
    for i in range(9):
        for j in range(9):
            if board[i][j] != '.':
                num = board[i][j]
                rows[i].add(num)
                cols[j].add(num)
                boxes[(i // 3) * 3 + j // 3].add(num)
    
    def solve():
        # Find empty cell with minimum possibilities
        min_pos, min_cell = float('inf'), None
        for i in range(9):
            for j in range(9):
                if board[i][j] == '.':
                    box = (i // 3) * 3 + j // 3
                    available = {'1','2','3','4','5','6','7','8','9'} - rows[i] - cols[j] - boxes[box]
                    if len(available) < min_pos:
                        min_pos = len(available)
                        min_cell = (i, j, box, available)
        
        if not min_cell:
            return True  # Solved!
        
        i, j, box, available = min_cell
        for num in available:
            board[i][j] = num
            rows[i].add(num)
            cols[j].add(num)
            boxes[box].add(num)
            
            if solve():
                return True
            
            board[i][j] = '.'
            rows[i].remove(num)
            cols[j].remove(num)
            boxes[box].remove(num)
        
        return False
    
    solve()
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | More efficient in practice due to constraint propagation |
| **Space** | O(1) for constraint sets |

---

## Comparison of Approaches

| Aspect | Standard | Optimized |
|--------|----------|-----------|
| **Implementation** | Simple | Complex |
| **Speed** | Good | Better |
| **LeetCode Optimal** | ✅ | ✅ |

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Commonly asked in technical interviews
- **Companies**: Google, Amazon, Microsoft
- **Difficulty**: Hard
- **Concepts Tested**: Backtracking, Constraint Satisfaction, DFS

### Learning Outcomes

1. **Backtracking Mastery**: Perfect example of backtracking pattern
2. **Constraint Checking**: Learn to validate against multiple constraints
3. **Optimization**: Understand constraint propagation

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Valid Sudoku | [Link](https://leetcode.com/problems/valid-sudoku/) | Check if Sudoku is valid |
| N-Queens | [Link](https://leetcode.com/problems/n-queens/) | Similar backtracking |
| Combination Sum | [Link](https://leetcode.com/problems/combination-sum/) | Backtracking |

### Pattern Reference

For more detailed explanations of the Backtracking pattern, see:
- **[Backtracking Pattern](/patterns/backtracking-n-queens-constraint-satisfaction)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

1. **[NeetCode - Sudoku Solver](https://www.youtube.com/watch?v=TVhB95T zPk)** - Clear explanation
2. **[Sudoku Solver - LeetCode 37](https://www.youtube.com/watch?v=TVhB95T zPk)** - Detailed walkthrough
3. **[Backtracking Explained](https://www.youtube.com/watch?v=A3wZ7F5D3EE)** - Understanding backtracking

---

## Follow-up Questions

### Q1: How would you optimize by choosing the most constrained cell first?

**Answer:** Find the empty cell with the fewest valid numbers to try. This reduces branching factor.

---

### Q2: Can you solve this without recursion?

**Answer:** Yes, you can use an iterative stack-based approach, but recursion is more natural for backtracking.

---

### Q3: How would you handle multiple solutions?

**Answer:** Instead of returning on first solution, collect all solutions until reaching a desired count.

---

### Q4: What's the maximum recursion depth needed?

**Answer:** At most 81 (for all empty cells), so recursion depth is bounded.

---

## Common Pitfalls

### 1. Not Validating Correctly
**Issue**: Checking wrong constraints.

**Solution**: Check row, column, and 3x3 box.

### 2. Not Backtracking
**Issue**: Not undoing placements.

**Solution**: Reset cell after exploring.

### 3. Performance
**Issue**: Too many combinations.

**Solution**: Use least constrained cell first.

---

## Summary

The **Sudoku Solver** problem demonstrates the **Backtracking** pattern for constraint satisfaction.

### Key Takeaways

1. **Backtracking**: Try, validate, recurse, undo
2. **Three Constraints**: Row, column, 3x3 box
3. **In-Place**: Modify board directly
4. **Deterministic**: Exactly one solution guaranteed

### Pattern Summary

This problem exemplifies the **Backtracking** pattern, characterized by:
- Exploring all possibilities with pruning
- Constraint checking at each step
- Undoing choices on failure

For more details on this pattern, see the **[Backtracking Pattern](/patterns/backtracking-n-queens-constraint-satisfaction)**.

---

## Additional Resources

- [LeetCode Problem 37](https://leetcode.com/problems/sudoku-solver/) - Official problem page
- [Backtracking - GeeksforGeeks](https://www.geeksforgeeks.org/backtracking-algorithms/) - Detailed explanation
- [Pattern: Backtracking](/patterns/backtracking-n-queens-constraint-satisfaction) - Comprehensive pattern guide
