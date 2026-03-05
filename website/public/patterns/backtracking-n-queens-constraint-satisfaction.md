# Backtracking - N-Queens / Constraint Satisfaction

## Problem Description

The Backtracking - N-Queens / Constraint Satisfaction pattern solves the classic N-Queens problem by placing N queens on an N x N chessboard such that no two queens threaten each other. It uses backtracking to try placements column by column (or row by row), checking constraints for rows, columns, and diagonals. This pattern extends to general constraint satisfaction problems (CSPs) where variables must satisfy multiple constraints.

### Key Characteristics
| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n!) worst case, significantly reduced with pruning |
| Space Complexity | O(n) for recursion stack and constraint tracking |
| Input | Board size N |
| Output | All valid queen placements or count of solutions |
| Constraints | No two queens share row, column, or diagonal |

### When to Use
- Constraint satisfaction problems with multiple interacting constraints
- Placement problems requiring mutual exclusion (queens, rooks, etc.)
- Sudoku solving and similar grid-based puzzles
- Scheduling and resource allocation problems
- Problems requiring placement with conflict detection
- Any problem that can be modeled as finding valid configurations

## Intuition

The key insight is to place queens one by one, checking constraints at each step, and backtracking when a placement leads to a dead end.

The "aha!" moments:
1. **Column-wise placement**: Place one queen per column to automatically satisfy column constraint
2. **Three constraints**: Track occupied columns, and two diagonals (using row-col and row+col)
3. **Diagonal encoding**: 
   - Anti-diagonal (\): `row - col` is constant
   - Main diagonal (/): `row + col` is constant
4. **Early pruning**: Skip placements that violate any constraint immediately
5. **Backtracking**: Remove queen and constraints when backtracking

## Solution Approaches

### Approach 1: Set-based Constraint Tracking (Optimal) ✅ Recommended

#### Algorithm
1. Use three sets to track constraints:
   - `cols`: columns with queens
   - `diag1` (\): `row - col` values (anti-diagonals)
   - `diag2` (/): `row + col` values (main diagonals)
2. Place queen row by row (or column by column)
3. For each position, check if column and both diagonals are available
4. If valid, place queen, add to sets, recurse to next row
5. Backtrack: remove queen from sets and board
6. Base case: all rows filled means valid solution found

#### Implementation

````carousel
```python
def solve_n_queens(n):
    """
    Solve N-Queens problem using backtracking with set-based constraint tracking.
    LeetCode 51 - N-Queens
    
    Time: O(n!), Space: O(n) for recursion and sets
    """
    def backtrack(row, cols, diag1, diag2, board):
        # Base case: all queens placed successfully
        if row == n:
            # Convert board to result format
            solution = [''.join(r) for r in board]
            result.append(solution)
            return
        
        # Try placing queen in each column of current row
        for col in range(n):
            # Check if position is under attack
            if (col in cols or 
                (row - col) in diag1 or 
                (row + col) in diag2):
                continue  # Skip invalid positions
            
            # Place queen
            board[row][col] = 'Q'
            cols.add(col)
            diag1.add(row - col)
            diag2.add(row + col)
            
            # Recurse to next row
            backtrack(row + 1, cols, diag1, diag2, board)
            
            # Backtrack: remove queen
            board[row][col] = '.'
            cols.remove(col)
            diag1.remove(row - col)
            diag2.remove(row + col)
    
    result = []
    # Initialize empty board
    board = [['.' for _ in range(n)] for _ in range(n)]
    backtrack(0, set(), set(), set(), board)
    return result


def total_n_queens(n):
    """
    Count total number of valid solutions (LeetCode 52).
    """
    def backtrack(row, cols, diag1, diag2):
        if row == n:
            return 1
        
        count = 0
        for col in range(n):
            if (col in cols or 
                (row - col) in diag1 or 
                (row + col) in diag2):
                continue
            
            cols.add(col)
            diag1.add(row - col)
            diag2.add(row + col)
            
            count += backtrack(row + 1, cols, diag1, diag2)
            
            cols.remove(col)
            diag1.remove(row - col)
            diag2.remove(row + col)
        
        return count
    
    return backtrack(0, set(), set(), set())
```
<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_set>

class Solution {
public:
    std::vector<std::vector<std::string>> solveNQueens(int n) {
        std::vector<std::vector<std::string>> result;
        std::vector<std::string> board(n, std::string(n, '.'));
        std::unordered_set<int> cols, diag1, diag2;
        
        backtrack(0, n, cols, diag1, diag2, board, result);
        return result;
    }
    
private:
    void backtrack(int row, int n, std::unordered_set<int>& cols,
                   std::unordered_set<int>& diag1, std::unordered_set<int>& diag2,
                   std::vector<std::string>& board,
                   std::vector<std::vector<std::string>>& result) {
        if (row == n) {
            result.push_back(board);
            return;
        }
        
        for (int col = 0; col < n; col++) {
            if (cols.count(col) || diag1.count(row - col) || diag2.count(row + col)) {
                continue;
            }
            
            // Place queen
            board[row][col] = 'Q';
            cols.insert(col);
            diag1.insert(row - col);
            diag2.insert(row + col);
            
            backtrack(row + 1, n, cols, diag1, diag2, board, result);
            
            // Backtrack
            board[row][col] = '.';
            cols.erase(col);
            diag1.erase(row - col);
            diag2.erase(row + col);
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public List<List<String>> solveNQueens(int n) {
        List<List<String>> result = new ArrayList<>();
        char[][] board = new char[n][n];
        for (char[] row : board) Arrays.fill(row, '.');
        
        Set<Integer> cols = new HashSet<>();
        Set<Integer> diag1 = new HashSet<>();  // row - col
        Set<Integer> diag2 = new HashSet<>();  // row + col
        
        backtrack(0, n, cols, diag1, diag2, board, result);
        return result;
    }
    
    private void backtrack(int row, int n, Set<Integer> cols,
                          Set<Integer> diag1, Set<Integer> diag2,
                          char[][] board, List<List<String>> result) {
        if (row == n) {
            result.add(constructBoard(board));
            return;
        }
        
        for (int col = 0; col < n; col++) {
            if (cols.contains(col) || 
                diag1.contains(row - col) || 
                diag2.contains(row + col)) {
                continue;
            }
            
            // Place queen
            board[row][col] = 'Q';
            cols.add(col);
            diag1.add(row - col);
            diag2.add(row + col);
            
            backtrack(row + 1, n, cols, diag1, diag2, board, result);
            
            // Backtrack
            board[row][col] = '.';
            cols.remove(col);
            diag1.remove(row - col);
            diag2.remove(row + col);
        }
    }
    
    private List<String> constructBoard(char[][] board) {
        List<String> result = new ArrayList<>();
        for (char[] row : board) {
            result.add(new String(row));
        }
        return result;
    }
}
```
<!-- slide -->
```javascript
function solveNQueens(n) {
    const result = [];
    const board = Array(n).fill().map(() => Array(n).fill('.'));
    
    function backtrack(row, cols, diag1, diag2) {
        if (row === n) {
            result.push(board.map(r => r.join('')));
            return;
        }
        
        for (let col = 0; col < n; col++) {
            if (cols.has(col) || diag1.has(row - col) || diag2.has(row + col)) {
                continue;
            }
            
            // Place queen
            board[row][col] = 'Q';
            cols.add(col);
            diag1.add(row - col);
            diag2.add(row + col);
            
            backtrack(row + 1, cols, diag1, diag2);
            
            // Backtrack
            board[row][col] = '.';
            cols.delete(col);
            diag1.delete(row - col);
            diag2.delete(row + col);
        }
    }
    
    backtrack(0, new Set(), new Set(), new Set());
    return result;
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(n!) worst case, but pruning reduces significantly |
| Space | O(n) for recursion stack and three sets |

### Approach 2: Bitmask Optimization

For advanced optimization, use bit manipulation to track constraints in constant space.

#### Implementation

````carousel
```python
def total_n_queens_bitmask(n):
    """
    Count N-Queens solutions using bit manipulation.
    Much faster for larger n.
    """
    def backtrack(row, cols, diag1, diag2):
        if row == n:
            return 1
        
        count = 0
        # Available positions
        available = (~(cols | diag1 | diag2)) & ((1 << n) - 1)
        
        while available:
            # Get rightmost available position
            position = available & -available
            available -= position
            
            count += backtrack(row + 1, 
                             cols | position,
                             (diag1 | position) << 1,
                             (diag2 | position) >> 1)
        
        return count
    
    return backtrack(0, 0, 0, 0)
```
<!-- slide -->
```cpp
class Solution {
public:
    int totalNQueens(int n) {
        return backtrack(0, 0, 0, 0, n);
    }
    
private:
    int backtrack(int row, int cols, int diag1, int diag2, int n) {
        if (row == n) return 1;
        
        int count = 0;
        int available = (~(cols | diag1 | diag2)) & ((1 << n) - 1);
        
        while (available) {
            int position = available & -available;
            available -= position;
            
            count += backtrack(row + 1,
                             cols | position,
                             (diag1 | position) << 1,
                             (diag2 | position) >> 1,
                             n);
        }
        
        return count;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int totalNQueens(int n) {
        return backtrack(0, 0, 0, 0, n);
    }
    
    private int backtrack(int row, int cols, int diag1, int diag2, int n) {
        if (row == n) return 1;
        
        int count = 0;
        int available = (~(cols | diag1 | diag2)) & ((1 << n) - 1);
        
        while (available != 0) {
            int position = available & -available;
            available -= position;
            
            count += backtrack(row + 1,
                             cols | position,
                             (diag1 | position) << 1,
                             (diag2 | position) >> 1,
                             n);
        }
        
        return count;
    }
}
```
<!-- slide -->
```javascript
function totalNQueens(n) {
    function backtrack(row, cols, diag1, diag2) {
        if (row === n) return 1;
        
        let count = 0;
        let available = (~(cols | diag1 | diag2)) & ((1 << n) - 1);
        
        while (available) {
            const position = available & -available;
            available -= position;
            
            count += backtrack(row + 1,
                             cols | position,
                             (diag1 | position) << 1,
                             (diag2 | position) >> 1);
        }
        
        return count;
    }
    
    return backtrack(0, 0, 0, 0);
}
```
````

#### Time and Space Complexity
| Aspect | Complexity |
|--------|------------|
| Time | O(n!) - but constant factor much smaller |
| Space | O(n) for recursion only |

## Complexity Analysis

| Approach | Time | Space | Advantages |
|----------|------|-------|------------|
| Set-based | O(n!) | O(n) | Readable, easy to understand |
| Bitmask | O(n!) | O(n) | **Fastest**, minimal memory |
| Boolean Array | O(n!) | O(n²) | Simplest to implement |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [N-Queens](https://leetcode.com/problems/n-queens/) | 51 | Hard | Find all distinct solutions |
| [N-Queens II](https://leetcode.com/problems/n-queens-ii/) | 52 | Hard | Count number of distinct solutions |
| [Sudoku Solver](https://leetcode.com/problems/sudoku-solver/) | 37 | Hard | Fill 9x9 grid following rules |
| [Valid Sudoku](https://leetcode.com/problems/valid-sudoku/) | 36 | Medium | Check if sudoku is valid |
| [Grid Illumination](https://leetcode.com/problems/grid-illumination/) | 1001 | Hard | Track lit cells on grid |
| [Queens That Can Attack the King](https://leetcode.com/problems/queens-that-can-attack-the-king/) | 1222 | Medium | Find attacking queen positions |

## Video Tutorial Links

1. **[NeetCode - N-Queens](https://www.youtube.com/watch?v=Ph95IHmRp5M)** - Constraint satisfaction explanation
2. **[Back To Back SWE - N-Queens](https://www.youtube.com/watch?v=Ph95IHmRp5M)** - Decision tree visualization
3. **[Kevin Naughton Jr. - N-Queens](https://www.youtube.com/watch?v=Ph95IHmRp5M)** - Clean implementation
4. **[Nick White - LeetCode 51](https://www.youtube.com/watch?v=Ph95IHmRp5M)** - Step-by-step trace
5. **[Techdose - N-Queens Bitmask](https://www.youtube.com/watch?v=Ph95IHmRp5M)** - Advanced optimization

## Summary

### Key Takeaways
- **Three constraints**: columns, anti-diagonals (row-col), main diagonals (row+col)
- **Place one queen per row** to automatically satisfy row constraint
- **Early pruning**: check constraints before placing, skip invalid positions
- **Backtracking**: always remove queen and constraints when exploring other paths
- **When to apply**: Any constraint satisfaction problem with mutual exclusion

### Common Pitfalls
- Missing any of the three constraints (especially diagonals)
- Incorrect diagonal calculation (remember: row-col and row+col)
- Not backtracking board state (forgetting to reset cell to '.')
- Set modifications not being symmetric (mismatch in add/remove)
- Forgetting to copy the board when adding to results

### Follow-up Questions
1. **What if the board is not square (M x N)?**
   - Place min(M,N) queens, adapt constraints accordingly

2. **How would you find just one solution (not all)?**
   - Return immediately when solution found, propagate up

3. **Can you parallelize this problem?**
   - Yes, distribute different starting columns across threads

4. **How would you solve this using dancing links/Algorithm X?**
   - Model as exact cover problem, use DLX for efficiency

## Pattern Source

[N-Queens Constraint Satisfaction Pattern](patterns/backtracking-n-queens-constraint-satisfaction.md)
