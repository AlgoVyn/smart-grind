# Sudoku Solver

## Category
Backtracking

## Description

Sudoku Solver is a classic backtracking algorithm used to solve 9x9 Sudoku puzzles. The algorithm systematically attempts to fill empty cells with digits 1-9 while satisfying three fundamental constraints:
- Each row must contain digits 1-9 without repetition
- Each column must contain digits 1-9 without repetition
- Each 3x3 subgrid (box) must contain digits 1-9 without repetition

Backtracking is a depth-first search technique that explores possible solutions by incrementally building a candidate solution. When a dead end is reached, the algorithm "backtracks" by removing the last choice and trying the next alternative. This makes it perfect for constraint satisfaction problems like Sudoku, N-Queens, and crossword puzzles.

---

## When to Use

Use the Sudoku Solver (backtracking) algorithm when you need to solve problems involving:

- **Constraint Satisfaction Problems (CSP)**: Problems where you must assign values to variables while satisfying certain constraints
- **Combinatorial Search**: Exhaustive search through possible configurations
- **Puzzle Solving**: Any puzzle with clear rules and a finite search space
- **Decision Problems**: Problems requiring yes/no answers through systematic exploration
- **Optimization with Backtracking**: Finding optimal solutions among many possibilities

### Comparison with Alternatives

| Algorithm | Best For | Time Complexity | Space | When to Use |
|-----------|----------|-----------------|-------|-------------|
| **Backtracking** | CSP, puzzles | O(9^(n²)) worst | O(n²) recursion | Small search spaces, hard constraints |
| **Brute Force** | Small exhaustive search | O(n^k) | O(k) | Tiny problems only |
| **Constraint Propagation** | Efficient CSP | Much better than brute | O(n²) | When constraints can prune heavily |
| ** dancing Links (DLX)** | Exact cover problems | Very fast | O(k) | Algorithm X problems (Sudoku, N-Queens) |

### When to Choose Backtracking vs Other Approaches

- **Choose Backtracking** when:
  - The problem has clear constraints that can be checked incrementally
  - The solution space is manageable (not exponentially huge)
  - You need to find any valid solution (not necessarily optimal)
  - The problem is NP-complete in general

- **Choose Constraint Propagation** when:
  - You can propagate constraints to eliminate many possibilities early
  - Problems like Sudoku where constraint propagation significantly reduces search

- **Choose Dancing Links (DLX)** when:
  - The problem can be formulated as exact cover
  - You need extremely fast solving (competitive Sudoku)

---

## Algorithm Explanation

### Core Concept

The fundamental insight behind backtracking is **systematic trial and error with pruning**. Instead of trying all possible combinations randomly, we:

1. **Make a choice**: Place a number in an empty cell
2. **Check constraints**: Verify the placement doesn't violate Sudoku rules
3. **Recurse**: If valid, move to the next empty cell
4. **Backtrack**: If dead end, undo the choice and try another number

The key optimization is **constraint checking in O(1)** using sets/dictionaries to track which numbers are already used in each row, column, and box. This avoids scanning entire rows/columns/boxes for each placement.

### How It Works

#### The Backtracking Process:

```
1. Start with an empty cell
2. Try numbers 1-9 in order:
   a. Check if valid (not in current row, column, or box)
   b. If valid: place it, mark as used, recurse
   c. If recursion succeeds: return True
   d. Otherwise: remove and try next number
3. If no number works: return False (backtrack)
```

#### Constraint Checking Optimization:

Instead of checking all cells in a row/column/box each time, maintain three sets:
- `rows[9]`: Numbers used in each row
- `cols[9]`: Numbers used in each column  
- `boxes[9]`: Numbers used in each 3x3 box

Box index formula: `(row // 3) * 3 + (col // 3)`

This gives O(1) lookup for constraint checking!

### Minimum Remaining Values (MRV) Heuristic

The **MRV heuristic** (also called "most constrained cell first") selects the empty cell with the fewest valid options. This is a form of **forward checking** that:
- Reduces branching factor dramatically
- Fails early when no options exist
- Typically solves Sudoku 10-100x faster than naive row-by-row approach

### Visual Representation

For a partially filled Sudoku:

```
Initial State:           After placing 5 at [0,0]:
5 3 . | . 7 . | . . .    5 3 . | . 7 . | . . .
6 . . | 1 9 5 | . . .    6 . . | 1 9 5 | . . .
. 9 8 | . . . | . 6 .    . 9 8 | . . . | . 6 .
------+-------           ------+-------
8 . . | . 6 . | . . 3    8 . . | . 6 . | . . 3
4 . . | 8 . 3 | . . 1    4 . . | 8 . 3 | . . 1
7 . . | . 2 . | . . 6    7 . . | . 2 .6
------+------- | . .            ------+-------
. 6 . | . . . | 2 8 .    . 6 . | . . . | 2 8 .
. . . | 4 1 9 | . . 5    . . . | 4 1 9 | . . 5
. . . | . 8 . | . 7 9    . . . | . 8 . | . 7 9

Constraint sets after placing 5:
rows[0] = {5}     cols[0] = {5,6,8,4,7}     boxes[0] = {5}
```

### Why Backtracking Works for Sudoku

- **Finite search space**: Maximum 9^81 combinations, but constraints prune 99.99%
- **Incremental checking**: Violations detected immediately
- **Optimal pruning**: MRV heuristic + constraint propagation = fast solving
- **Complete**: Guarantees solution if one exists (or determines unsolvable)

---

## Algorithm Steps

### Step-by-Step Approach

1. **Initialize Constraint Sets**
   - Create 3 arrays of sets: `rows[9]`, `cols[9]`, `boxes[9]`
   - Each set tracks which numbers (1-9) are already used

2. **Populate Initial Constraints**
   - Scan the entire board
   - For each non-zero cell: add to corresponding row, col, and box sets
   - This is O(81) = O(1) since board is always 9x9

3. **Find Next Empty Cell (with MRV)**
   - Scan all 81 cells
   - For empty cells (value = 0), count valid options
   - Select cell with minimum options (MRV heuristic)
   - If no empty cells remain: puzzle solved!

4. **Try Each Valid Number**
   - For num in 1 to 9:
     - If num not in row, col, or box sets: it's valid
     - Place num: update board and all three constraint sets
     - Recursively call solve()
     - If recursion returns True: propagate success upward
     - Otherwise: backtrack (remove num from board and sets)

5. **Backtrack if No Number Works**
   - If loop completes without success: return False
   - This triggers backtracking to previous level

6. **Return Result**
   - True if solved, False if no solution exists

---

## Implementation

### Template Code (Python, C++, Java, JavaScript)

````carousel
```python
def solve_sudoku(board: list) -> bool:
    """
    Solve a Sudoku puzzle using backtracking with MRV heuristic.
    
    Args:
        board: 9x9 grid where 0 represents empty cells
        
    Returns:
        True if solved, False if no solution exists
        
    Time: O(9^(n*n)) worst case, but much better with MRV
    Space: O(n*n) for recursion stack = O(81) = O(1)
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
        # Find next empty cell using MRV heuristic
        min_options = 10
        selected_cell = (-1, -1)
        
        for i in range(9):
            for j in range(9):
                if board[i][j] == 0:
                    # Count valid options
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
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <set>
#include <algorithm>
using namespace std;

/**
 * Sudoku Solver using backtracking with MRV heuristic.
 * 
 * Time: O(9^(n*n)) worst case, optimized with constraints
 * Space: O(n*n) for recursion stack
 */
class SudokuSolver {
private:
    vector<vector<int>> board;
    vector<set<int>> rows, cols, boxes;
    
    int getBoxIndex(int row, int col) const {
        return (row / 3) * 3 + (col / 3);
    }
    
    bool isValid(int row, int col, int num) const {
        return rows[row].count(num) == 0 &&
               cols[col].count(num) == 0 &&
               boxes[getBoxIndex(row, col)].count(num) == 0;
    }
    
    void place(int num, int row, int col) {
        board[row][col] = num;
        rows[row].insert(num);
        cols[col].insert(num);
        boxes[getBoxIndex(row, col)].insert(num);
    }
    
    void remove(int num, int row, int col) {
        board[row][col] = 0;
        rows[row].erase(num);
        cols[col].erase(num);
        boxes[getBoxIndex(row, col)].erase(num);
    }
    
    // Find next cell using MRV heuristic
    pair<int, int> findNextCell() {
        int minOptions = 10;
        pair<int, int> selected = {-1, -1};
        
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if (board[i][j] == 0) {
                    int options = 0;
                    for (int num = 1; num <= 9; num++) {
                        if (isValid(i, j, num)) options++;
                    }
                    if (options < minOptions) {
                        minOptions = options;
                        selected = {i, j};
                        if (options == 1) return selected;
                    }
                }
            }
        }
        return selected;
    }
    
    bool backtrack() {
        auto [row, col] = findNextCell();
        
        // No empty cells - solved!
        if (row == -1) return true;
        
        for (int num = 1; num <= 9; num++) {
            if (isValid(row, col, num)) {
                place(num, row, col);
                if (backtrack()) return true;
                remove(num, row, col);
            }
        }
        return false;
    }
    
public:
    bool solve(vector<vector<int>>& board) {
        this->board = board;
        
        // Initialize constraint sets
        rows.assign(9, set<int>());
        cols.assign(9, set<int>());
        boxes.assign(9, set<int>());
        
        // Fill with given numbers
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if (board[i][j] != 0) {
                    place(board[i][j], i, j);
                }
            }
        }
        
        return backtrack();
    }
    
    void printBoard() const {
        for (int i = 0; i < 9; i++) {
            if (i % 3 == 0 && i > 0) cout << string(21, '-') << endl;
            for (int j = 0; j < 9; j++) {
                if (j % 3 == 0 && j > 0) cout << "| ";
                cout << board[i][j] << " ";
            }
            cout << endl;
        }
    }
};

int main() {
    vector<vector<int>> board = {
        {5, 3, 0, 0, 7, 0, 0, 0, 0},
        {6, 0, 0, 1, 9, 5, 0, 0, 0},
        {0, 9, 8, 0, 0, 0, 0, 6, 0},
        {8, 0, 0, 0, 6, 0, 0, 0, 3},
        {4, 0, 0, 8, 0, 3, 0, 0, 1},
        {7, 0, 0, 0, 2, 0, 0, 0, 6},
        {0, 6, 0, 0, 0, 0, 2, 8, 0},
        {0, 0, 0, 4, 1, 9, 0, 0, 5},
        {0, 0, 0, 0, 8, 0, 0, 7, 9}
    };
    
    cout << "Original Sudoku:" << endl;
    SudokuSolver solver;
    solver.solve(board);
    solver.printBoard();
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Sudoku Solver using backtracking with MRV heuristic.
 * 
 * Time: O(9^(n*n)) worst case, optimized with constraints
 * Space: O(n*n) for recursion stack
 */
public class SudokuSolver {
    private int[][] board;
    private Set<Integer>[] rows, cols, boxes;
    
    @SuppressWarnings("unchecked")
    public SudokuSolver(int[][] board) {
        this.board = board;
        
        // Initialize constraint sets
        rows = new HashSet[9];
        cols = new HashSet[9];
        boxes = new HashSet[9];
        
        for (int i = 0; i < 9; i++) {
            rows[i] = new HashSet<>();
            cols[i] = new HashSet<>();
            boxes[i] = new HashSet<>();
        }
        
        // Fill with given numbers
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if (board[i][j] != 0) {
                    place(board[i][j], i, j);
                }
            }
        }
    }
    
    private int getBoxIndex(int row, int col) {
        return (row / 3) * 3 + (col / 3);
    }
    
    private boolean isValid(int row, int col, int num) {
        return !rows[row].contains(num) &&
               !cols[col].contains(num) &&
               !boxes[getBoxIndex(row, col)].contains(num);
    }
    
    private void place(int num, int row, int col) {
        board[row][col] = num;
        rows[row].add(num);
        cols[col].add(num);
        boxes[getBoxIndex(row, col)].add(num);
    }
    
    private void remove(int num, int row, int col) {
        board[row][col] = 0;
        rows[row].remove(num);
        cols[col].remove(num);
        boxes[getBoxIndex(row, col)].remove(num);
    }
    
    // Find next cell using MRV heuristic
    private int[] findNextCell() {
        int minOptions = 10;
        int[] selected = {-1, -1};
        
        for (int i = 0; i < 9; i++) {
            for (int j = 0; j < 9; j++) {
                if (board[i][j] == 0) {
                    int options = 0;
                    for (int num = 1; num <= 9; num++) {
                        if (isValid(i, j, num)) options++;
                    }
                    if (options < minOptions) {
                        minOptions = options;
                        selected = new int[]{i, j};
                        if (options == 1) return selected;
                    }
                }
            }
        }
        return selected;
    }
    
    public boolean solve() {
        int[] cell = findNextCell();
        int row = cell[0], col = cell[1];
        
        // No empty cells - solved!
        if (row == -1) return true;
        
        for (int num = 1; num <= 9; num++) {
            if (isValid(row, col, num)) {
                place(num, row, col);
                if (solve()) return true;
                remove(num, row, col);
            }
        }
        return false;
    }
    
    public void printBoard() {
        for (int i = 0; i < 9; i++) {
            if (i % 3 == 0 && i > 0) {
                System.out.println("---------------------");
            }
            for (int j = 0; j < 9; j++) {
                if (j % 3 == 0 && j > 0) System.out.print("| ");
                System.out.print(board[i][j] + " ");
            }
            System.out.println();
        }
    }
    
    public static void main(String[] args) {
        int[][] board = {
            {5, 3, 0, 0, 7, 0, 0, 0, 0},
            {6, 0, 0, 1, 9, 5, 0, 0, 0},
            {0, 9, 8, 0, 0, 0, 0, 6, 0},
            {8, 0, 0, 0, 6, 0, 0, 0, 3},
            {4, 0, 0, 8, 0, 3, 0, 0, 1},
            {7, 0, 0, 0, 2, 0, 0, 0, 6},
            {0, 6, 0, 0, 0, 0, 2, 8, 0},
            {0, 0, 0, 4, 1, 9, 0, 0, 5},
            {0, 0, 0, 0, 8, 0, 0, 7, 9}
        };
        
        System.out.println("Original Sudoku:");
        SudokuSolver solver = new SudokuSolver(board);
        solver.solve();
        solver.printBoard();
    }
}
```

<!-- slide -->
```javascript
/**
 * Sudoku Solver using backtracking with MRV heuristic.
 * 
 * Time: O(9^(n*n)) worst case, optimized with constraints
 * Space: O(n*n) for recursion stack
 */
class SudokuSolver {
    constructor(board) {
        this.board = board;
        this.rows = Array.from({ length: 9 }, () => new Set());
        this.cols = Array.from({ length: 9 }, () => new Set());
        this.boxes = Array.from({ length: 9 }, () => new Set());
        
        // Initialize with given numbers
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (board[i][j] !== 0) {
                    this.place(board[i][j], i, j);
                }
            }
        }
    }
    
    getBoxIndex(row, col) {
        return Math.floor(row / 3) * 3 + Math.floor(col / 3);
    }
    
    isValid(row, col, num) {
        return !this.rows[row].has(num) &&
               !this.cols[col].has(num) &&
               !this.boxes[this.getBoxIndex(row, col)].has(num);
    }
    
    place(num, row, col) {
        this.board[row][col] = num;
        this.rows[row].add(num);
        this.cols[col].add(num);
        this.boxes[this.getBoxIndex(row, col)].add(num);
    }
    
    remove(num, row, col) {
        this.board[row][col] = 0;
        this.rows[row].delete(num);
        this.cols[col].delete(num);
        this.boxes[this.getBoxIndex(row, col)].delete(num);
    }
    
    // Find next cell using MRV heuristic
    findNextCell() {
        let minOptions = 10;
        let selected = [-1, -1];
        
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.board[i][j] === 0) {
                    let options = 0;
                    for (let num = 1; num <= 9; num++) {
                        if (this.isValid(i, j, num)) options++;
                    }
                    if (options < minOptions) {
                        minOptions = options;
                        selected = [i, j];
                        if (options === 1) return selected;
                    }
                }
            }
        }
        return selected;
    }
    
    solve() {
        const [row, col] = this.findNextCell();
        
        // No empty cells - solved!
        if (row === -1) return true;
        
        for (let num = 1; num <= 9; num++) {
            if (this.isValid(row, col, num)) {
                this.place(num, row, col);
                if (this.solve()) return true;
                this.remove(num, row, col);
            }
        }
        return false;
    }
    
    printBoard() {
        console.log("Solved Sudoku:");
        for (let i = 0; i < 9; i++) {
            if (i % 3 === 0 && i > 0) console.log('---------------------');
            let row = '';
            for (let j = 0; j < 9; j++) {
                if (j % 3 === 0 && j > 0) row += '| ';
                row += this.board[i][j] + ' ';
            }
            console.log(row);
        }
    }
}

// Example usage
const board = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

const solver = new SudokuSolver(board);
solver.solve();
solver.printBoard();
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Worst Case** | O(9^(n²)) | Naive backtracking without optimizations |
| **With Constraint Sets** | O(9^k) where k < n² | O(1) constraint checking prunes early |
| **With MRV Heuristic** | Much better than worst case | k is typically small (1-3 options per cell) |
| **Constraint Propagation** | Very fast | Eliminates candidates before backtracking |

### Detailed Breakdown

- **Constraint checking**: O(1) per placement using sets
- **Finding next cell (MRV)**: O(n²) = O(81) = O(1) for 9x9
- **Recursion depth**: Maximum n² = 81 cells to fill
- **Typical solve time**: Milliseconds for standard Sudoku puzzles

**Note**: While worst-case is exponential, well-formed Sudoku puzzles typically solve in milliseconds due to:
1. MRV heuristic reducing branching
2. Constraint propagation eliminating impossible states early
3. The puzzle having a unique solution

---

## Space Complexity Analysis

| Component | Space | Description |
|-----------|-------|-------------|
| **Board Storage** | O(n²) = O(81) = O(1) | 9x9 grid |
| **Constraint Sets** | O(n) = O(27) = O(1) | 9 rows + 9 cols + 9 boxes |
| **Recursion Stack** | O(n²) = O(81) = O(1) | Max depth = number of empty cells |
| **Total** | O(n²) = O(1) | Constant for 9x9 Sudoku |

### Space Optimization Notes

- Constraint sets are constant size (9 sets of max 9 elements each)
- Recursion depth is bounded by empty cells (typically 20-40 for valid puzzles)
- No additional data structures needed beyond the board itself

---

## Common Variations

### 1. Naive Backtracking (Without MRV)

Simple row-by-row approach, easier to understand but slower:

````carousel
```python
def solve_sudoku_naive(board):
    """Simple backtracking without MRV heuristic."""
    
    def is_valid(board, row, col, num):
        # Check row
        for x in range(9):
            if board[row][x] == num:
                return False
        # Check column
        for x in range(9):
            if board[x][col] == num:
                return False
        # Check 3x3 box
        start_row, start_col = 3 * (row // 3), 3 * (col // 3)
        for i in range(3):
            for j in range(3):
                if board[start_row + i][start_col + j] == num:
                    return False
        return True
    
    def backtrack():
        for i in range(9):
            for j in range(9):
                if board[i][j] == 0:
                    for num in range(1, 10):
                        if is_valid(board, i, j, num):
                            board[i][j] = num
                            if backtrack():
                                return True
                            board[i][j] = 0
                    return False
        return True
    
    return backtrack()
```
````

### 2. Constraint Propagation (Naked Singles)

Eliminate candidates before backtracking:

````carousel
```python
def solve_sudoku_propagation(board):
    """Backtracking with constraint propagation."""
    
    def get_candidates(row, col):
        if board[row][col] != 0:
            return None
        used = set()
        # Check row
        used.update(board[row])
        # Check column
        for r in range(9):
            used.add(board[r][col])
        # Check box
        start_row, start_col = 3 * (row // 3), 3 * (col // 3)
        for r in range(start_row, start_row + 3):
            for c in range(start_col, start_col + 3):
                used.add(board[r][c])
        return [n for n in range(1, 10) if n not in used]
    
    def propagate():
        """Single propagation pass - fill naked singles."""
        changed = True
        while changed:
            changed = False
            for i in range(9):
                for j in range(9):
                    candidates = get_candidates(i, j)
                    if candidates and len(candidates) == 1:
                        board[i][j] = candidates[0]
                        changed = True
    
    # Main solving loop with propagation
    def backtrack():
        propagate()
        
        # Find empty cell
        for i in range(9):
            for j in range(9):
                if board[i][j] == 0:
                    candidates = get_candidates(i, j)
                    for num in candidates:
                        board[i][j] = num
                        if backtrack():
                            return True
                        board[i][j] = 0
                    return False
        return True
    
    return backtrack()
```
````

### 3. Solving Larger Sudoku (16x16, 25x25)

The algorithm scales to any N×N Sudoku:

````carousel
```python
def solve_sudoku_general(board, size=3):
    """General N×N Sudoku solver (size=3 for 9x9, 4 for 16x16)."""
    n = size * size
    
    def is_valid(row, col, num):
        for x in range(n):
            if board[row][x] == num: return False
            if board[x][col] == num: return False
        
        start_row, start_col = size * (row // size), size * (col // size)
        for i in range(size):
            for j in range(size):
                if board[start_row + i][start_col + j] == num:
                    return False
        return True
    
    def find_empty():
        min_options = n + 1
        selected = (-1, -1)
        
        for i in range(n):
            for j in range(n):
                if board[i][j] == 0:
                    options = sum(1 for num in range(1, n + 1) if is_valid(i, j, num))
                    if options < min_options:
                        min_options = options
                        selected = (i, j)
        return selected
    
    def backtrack():
        row, col = find_empty()
        if row == -1: return True
        
        for num in range(1, n + 1):
            if is_valid(row, col, num):
                board[row][col] = num
                if backtrack(): return True
                board[row][col] = 0
        return False
    
    return backtrack()
```
````

### 4. Solving Sudoku with Unique Solutions

Using DLX (Dancing Links) for very fast solving:

````carousel
```python
# Note: Full DLX implementation is complex, here's the concept
def solve_sudoku_dlx(board):
    """
    Dancing Links (Algorithm X) for exact cover.
    Very fast for competitive Sudoku solving.
    
    The Sudoku problem is modeled as an exact cover:
    - 324 constraints (9×9 cells, 9×9 rows, 9×9 cols, 9×9 boxes)
    - Each placement fills exactly 4 constraints
    """
    # Full implementation requires DLX data structure
    # This is a simplified explanation
    pass
```
````

---

## Practice Problems

### Problem 1: Valid Sudoku

**Problem:** [LeetCode 36 - Valid Sudoku](https://leetcode.com/problems/valid-sudoku/)

**Description:** Determine if a 9×9 Sudoku board is valid. Only filled cells need to be validated according to Sudoku rules.

**How to Apply This Technique:**
- Use the same constraint set approach from Sudoku solver
- Check rows, columns, and 3x3 boxes for duplicates
- Time: O(81) = O(1) since board is always 9x9

---

### Problem 2: N-Queens

**Problem:** [LeetCode 51 - N-Queens](https://leetcode.com/problems/n-queens/)

**Description:** Return all distinct solutions to the n-queens puzzle. Place n queens on an n×n chessboard so no two queens attack each other.

**How to Apply This Technique:**
- Same backtracking pattern as Sudoku
- Track which columns, diagonals are attacked
- Use sets for O(1) conflict checking
- MRV heuristic also helps (place queens in columns with fewest options)

---

### Problem 3: Word Search

**Problem:** [LeetCode 79 - Word Search](https://leetcode.com/problems/word-search/)

**Description:** Given a 2D board and a word, find if the word exists in the grid (connecting letters horizontally or vertically, can't reuse cells).

**How to Apply This Technique:**
- Backtracking with visited set
- Similar constraint propagation (can't revisit cells in current path)
- Recursively explore 4 directions

---

### Problem 4: Solve Sudoku

**Problem:** [LeetCode 37 - Solve Sudoku](https://leetcode.com/problems/solve-sudoku/)

**Description:** Write a program to solve a Sudoku puzzle by filling the empty cells. Return the solved board.

**How to Apply This Technique:**
- Directly apply the Sudoku solver algorithm
- Use constraint sets and MRV heuristic
- Handle both row-by-row and cell-by-cell approaches

---

### Problem 5: Permutations II

**Problem:** [LeetCode 47 - Permutations II](https://leetcode.com/problems/permutations-ii/)

**Description:** Given a collection of numbers that might contain duplicates, return all unique permutations.

**How to Apply This Technique:**
- Use backtracking with a "used" set (like constraint sets in Sudoku)
- Sort first to group duplicates
- Skip duplicate values at same recursion level

---

## Video Tutorial Links

### Fundamentals

- [Backtracking Algorithm - Introduction (Take U Forward)](https://www.youtube.com/watch?v=MBoc2Lq1VwA) - Comprehensive introduction to backtracking
- [Sudoku Solver - Backtracking (NeetCode)](https://www.youtube.com/watch?v=vzcy5Wu1O5U) - Practical Sudoku solving walkthrough
- [N-Queens Problem (WilliamFiset)](https://www.youtube.com/watch?v=0oXfKzx3Bkc) - Classic backtracking problem

### Advanced Topics

- [Dancing Links (DLX) - Fast Sudoku Solving](https://www.youtube.com/watch?v=pJ3H3S6sK8w) - Algorithm X for competitive solving
- [Constraint Propagation Explained](https://www.youtube.com/watch?v=btn9n-LHlT4) - Forward checking and constraint propagation
- [MRV Heuristic in Detail](https://www.youtube.com/watch?v=nQ7WS这个地方替换为真实链接) - Most constrained variable first

---

## Follow-up Questions

### Q1: How does the MRV (Minimum Remaining Values) heuristic improve performance?

**Answer:** The MRV heuristic selects the empty cell with the fewest valid options first. This provides:

- **Early failure detection**: If a cell has 0 options, we know immediately the current path is wrong
- **Reduced branching**: Starting with constrained cells reduces the search tree dramatically
- **Faster solving**: Typically 10-100x faster than naive row-by-row approach
- **Example**: Instead of trying 9 possibilities in one cell, try the cell with only 1 possibility first

### Q2: Can Sudoku be solved in polynomial time?

**Answer:** Sudoku is NP-complete in general. This means:
- No polynomial-time algorithm is known (unless P = NP)
- Backtracking is the best known approach for general cases
- However, practical puzzles solve in milliseconds due to constraints
- Specialized algorithms (DLX, constraint propagation) are extremely fast

### Q3: How do you handle multiple solutions in Sudoku?

**Answer:** To find all solutions:
- Don't return after finding first solution
- Continue backtracking after each found solution
- Store solutions in a list before returning
- Important: Deep copy the board before adding to solutions

### Q4: What is the difference between backtracking and recursion?

**Answer:** 
- **Recursion**: A programming technique where a function calls itself
- **Backtracking**: An algorithmic paradigm using recursion to explore all possibilities, then "undo" changes when dead ends are reached
- Backtracking IS recursion, but with the key concept of undoing decisions (removing placed numbers)

### Q5: How would you modify the solver to check if a puzzle is solvable before solving?

**Answer:** 
1. Run the solver and check return value (True = solvable, False = unsolvable)
2. For validity checking first: Add a validation pass before solving that checks:
   - No duplicate numbers in any row, column, or box
   - All given numbers are between 1-9
   - If invalid, return immediately without attempting solve

---

## Summary

Sudoku Solver demonstrates the power of **backtracking** for constraint satisfaction problems. Key takeaways:

- **Backtracking paradigm**: Try, recurse, and undo - works for many CSPs
- **Constraint optimization**: Using sets gives O(1) constraint checking instead of O(n)
- **MRV heuristic**: Choosing most constrained cell first dramatically reduces search space
- **Practical efficiency**: Despite O(9^n²) worst case, real puzzles solve in milliseconds
- **Scalability**: The algorithm works for any N×N Sudoku with appropriate modifications

When to use backtracking:
- ✅ Constraint satisfaction problems (CSPs)
- ✅ Puzzle solving (Sudoku, N-Queens, crossword)
- ✅ Combinatorial search (subsets, permutations)
- ✅ Path finding in grids (word search)
- ❌ When polynomial solution exists (use dynamic programming instead)
- ❌ When you need optimal solution (use A* or other search algorithms)

This algorithm is fundamental to competitive programming and technical interviews, appearing frequently in problems requiring systematic exploration with constraints.

---

## Related Algorithms

- [N-Queens](./n-queens.md) - Classic backtracking problem
- [Permutations](./permutations.md) - Generate all permutations using backtracking
- [Combinations](./combinations.md) - Generate combinations using backtracking
- [Word Search](./word-search.md) - Grid-based backtracking
- [Subsets](./subsets.md) - Power set generation using backtracking
