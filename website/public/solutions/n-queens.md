# N-Queens

## Problem Description

The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other.

Given an integer n, return all distinct solutions to the n-queens puzzle. You may return the answer in any order.

Each solution contains a distinct board configuration of the n-queens' placement, where 'Q' and '.' both indicate a queen and an empty space, respectively.

---

## Examples

### Example

**Input:**
```python
n = 4
```

**Output:**
```python
[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]
```

**Explanation:**
There exist two distinct solutions to the 4-queens puzzle as shown above.

### Example 2

**Input:**
```python
n = 1
```

**Output:**
```python
[["Q"]]
```

---

## Constraints

- `1 <= n <= 9`

---

## Pattern: Backtracking - Constraint Satisfaction

This problem is a classic example of the **Backtracking** pattern for solving constraint satisfaction problems. The N-Queens problem requires placing n queens on an n×n board with no two queens threatening each other.

### Core Concept

- **Row Constraint**: Place exactly one queen in each row
- **Column Constraint**: No two queens in the same column
- **Diagonal Constraint**: No two queens on the same diagonal (both main and anti-diagonal)

### Attack Patterns

A queen attacks along:
1. **Same Row**: All cells in the same row
2. **Same Column**: All cells in the same column
3. **Main Diagonal**: Cells where row - col is constant
4. **Anti-Diagonal**: Cells where row + col is constant

---

## Intuition

The key insight for this problem is using **backtracking** to systematically explore all possible queen placements:

1. **Row-by-Row Placement**: Place one queen per row (eliminates row conflicts)
2. **Safety Check**: At each position, check if the column and diagonals are safe
3. **Backtrack**: If placement leads to no solution, remove the queen and try next position
4. **Complete Solution**: When all n rows have queens, we found a valid solution

### Why Backtracking Works

- **Systematic Exploration**: Tries all possible column positions in each row
- **Pruning**: Early elimination of invalid states through safety checks
- **Complete Search**: Guarantees finding all valid solutions

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Standard Backtracking** - Using sets for O(1) conflict detection
2. **Bitmask Optimization** - Using bit manipulation for faster checks
3. **Bitwise Backtracking** - Ultra-efficient bit manipulation

---

## Approach 1: Standard Backtracking (Recommended)

### Algorithm Steps

1. Use three sets to track:
   - Columns occupied
   - Main diagonals (row - col)
   - Anti-diagonals (row + col)
2. Recursively try placing a queen in each column of the current row
3. Check safety before placing
4. Backtrack by removing the queen after exploring
5. When all rows are filled, convert to string format

### Why It Works

The three sets provide O(1) lookup to check if a position is safe. By tracking diagonals with (row - col) and (row + col), we can detect diagonal conflicts efficiently.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        """
        Solve N-Queens using backtracking with sets.
        
        Args:
            n: Size of the chessboard and number of queens
            
        Returns:
            List of all valid board configurations
        """
        def is_safe(row: int, col: int) -> bool:
            """Check if placing queen at (row, col) is safe."""
            # Check column
            if col in cols:
                return False
            # Check main diagonal (row - col)
            if row - col in diag1:
                return False
            # Check anti-diagonal (row + col)
            if row + col in diag2:
                return False
            return True
        
        def backtrack(board: List[int], row: int) -> None:
            """Recursively place queens row by row."""
            # Base case: all rows filled
            if row == n:
                result.append(['.' * i + 'Q' + '.' * (n - i - 1) for i in board])
                return
            
            # Try each column in current row
            for col in range(n):
                if is_safe(row, col):
                    # Place queen
                    board.append(col)
                    cols.add(col)
                    diag1.add(row - col)
                    diag2.add(row + col)
                    
                    # Recurse to next row
                    backtrack(board, row + 1)
                    
                    # Backtrack
                    board.pop()
                    cols.remove(col)
                    diag1.remove(row - col)
                    diag2.remove(row + col)
        
        # Initialize tracking sets
        cols = set()      # Columns with queens
        diag1 = set()     # Main diagonals (row - col)
        diag2 = set()     # Anti-diagonals (row + col)
        result = []
        
        # Start backtracking
        backtrack([], 0)
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
#include <unordered_set>
using namespace std;

class Solution {
private:
    unordered_set<int> cols;
    unordered_set<int> diag1;  // row - col
    unordered_set<int> diag2;  // row + col
    vector<vector<string>> result;
    
    bool isSafe(int row, int col) {
        if (cols.count(col)) return false;
        if (diag1.count(row - col)) return false;
        if (diag2.count(row + col)) return false;
        return true;
    }
    
    void backtrack(vector<int>& board, int row, int n) {
        if (row == n) {
            vector<string> solution;
            for (int col : board) {
                string row_str(n, '.');
                row_str[col] = 'Q';
                solution.push_back(row_str);
            }
            result.push_back(solution);
            return;
        }
        
        for (int col = 0; col < n; col++) {
            if (isSafe(row, col)) {
                board.push_back(col);
                cols.insert(col);
                diag1.insert(row - col);
                diag2.insert(row + col);
                
                backtrack(board, row + 1, n);
                
                board.pop_back();
                cols.erase(col);
                diag1.erase(row - col);
                diag2.erase(row + col);
            }
        }
    }
    
public:
    vector<vector<string>> solveNQueens(int n) {
        vector<int> board;
        backtrack(board, 0, n);
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    private Set<Integer> cols = new HashSet<>();
    private Set<Integer> diag1 = new HashSet<>();  // row - col
    private Set<Integer> diag2 = new HashSet<>();  // row + col
    private List<List<String>> result = new ArrayList<>();
    
    private boolean isSafe(int row, int col) {
        if (cols.contains(col)) return false;
        if (diag1.contains(row - col)) return false;
        if (diag2.contains(row + col)) return false;
        return true;
    }
    
    private void backtrack(List<Integer> board, int row, int n) {
        if (row == n) {
            List<String> solution = new ArrayList<>();
            for (int col : board) {
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < n; i++) {
                    sb.append(i == col ? 'Q' : '.');
                }
                solution.add(sb.toString());
            }
            result.add(solution);
            return;
        }
        
        for (int col = 0; col < n; col++) {
            if (isSafe(row, col)) {
                board.add(col);
                cols.add(col);
                diag1.add(row - col);
                diag2.add(row + col);
                
                backtrack(board, row + 1, n);
                
                board.remove(board.size() - 1);
                cols.remove(col);
                diag1.remove(row - col);
                diag2.remove(row + col);
            }
        }
    }
    
    public List<List<String>> solveNQueens(int n) {
        backtrack(new ArrayList<>(), 0, n);
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @return {string[][]}
 */
var solveNQueens = function(n) {
    const cols = new Set();
    const diag1 = new Set();  // row - col
    const diag2 = new Set();  // row + col
    const result = [];
    
    function isSafe(row, col) {
        if (cols.has(col)) return false;
        if (diag1.has(row - col)) return false;
        if (diag2.has(row + col)) return false;
        return true;
    }
    
    function backtrack(board, row) {
        if (row === n) {
            const solution = board.map((col, i) => 
                '.'.repeat(col) + 'Q' + '.'.repeat(n - col - 1)
            );
            result.push(solution);
            return;
        }
        
        for (let col = 0; col < n; col++) {
            if (isSafe(row, col)) {
                board.push(col);
                cols.add(col);
                diag1.add(row - col);
                diag2.add(row + col);
                
                backtrack(board, row + 1);
                
                board.pop();
                cols.delete(col);
                diag1.delete(row - col);
                diag2.delete(row + col);
            }
        }
    }
    
    backtrack([], 0);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N!) - Worst case explores all permutations |
| **Space** | O(N) - For recursion stack and sets |

---

## Approach 2: Bitmask Optimization

### Algorithm Steps

1. Use three integers (bitmasks) instead of sets:
   - `cols`: Bits for occupied columns
   - `diag1`: Bits for main diagonals
   - `diag2`: Bits for anti-diagonals
2. Use bit operations for O(1) safety checks
3. Use recursion with bit manipulation

### Why It Works

Bitmasks provide a more efficient way to track occupied positions. Using bit operations (AND, OR, NOT) allows for extremely fast conflict detection and manipulation.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        """Solve N-Queens using bitmask optimization."""
        def backtrack(row: int, cols: int, diag1: int, diag2: int, board: List[int]) -> None:
            if row == n:
                result.append(['.' * i + 'Q' + '.' * (n - i - 1) for i in board])
                return
            
            # Available positions: bits that are 0
            available = ((1 << n) - 1) & ~(cols | diag1 | diag2)
            
            while available:
                # Get rightmost set bit
                position = available & (-available)
                available -= position
                
                col = position.bit_length() - 1
                board.append(col)
                
                # Recurse with updated bitmasks
                backtrack(
                    row + 1,
                    cols | position,
                    (diag1 | position) << 1,
                    (diag2 | position) >> 1,
                    board
                )
                
                board.pop()
        
        result = []
        backtrack(0, 0, 0, 0, [])
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
using namespace std;

class Solution {
private:
    vector<vector<string>> result;
    
    void backtrack(int row, int cols, int d1, int d2, vector<int>& board, int n) {
        if (row == n) {
            vector<string> solution;
            for (int col : board) {
                string s(n, '.');
                s[col] = 'Q';
                solution.push_back(s);
            }
            result.push_back(solution);
            return;
        }
        
        int available = ((1 << n) - 1) & ~(cols | d1 | d2);
        
        while (available) {
            int position = available & (-available);
            available -= position;
            
            int col = __builtin_ctz(position);
            board.push_back(col);
            
            backtrack(row + 1, 
                     cols | position,
                     (d1 | position) << 1,
                     (d2 | position) >> 1,
                     board, n);
            
            board.pop_back();
        }
    }
    
public:
    vector<vector<string>> solveNQueens(int n) {
        vector<int> board;
        backtrack(0, 0, 0, 0, board, n);
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    private List<List<String>> result = new ArrayList<>();
    
    private void backtrack(int row, int cols, int d1, int d2, List<Integer> board, int n) {
        if (row == n) {
            List<String> solution = new ArrayList<>();
            for (int col : board) {
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < n; i++) {
                    sb.append(i == col ? 'Q' : '.');
                }
                solution.add(sb.toString());
            }
            result.add(solution);
            return;
        }
        
        int available = ((1 << n) - 1) & ~(cols | d1 | d2);
        
        while (available != 0) {
            int position = available & (-available);
            available -= position;
            
            int col = Integer.bitCount(position - 1);
            board.add(col);
            
            backtrack(row + 1,
                    cols | position,
                    (d1 | position) << 1,
                    (d2 | position) >> 1,
                    board, n);
            
            board.remove(board.size() - 1);
        }
    }
    
    public List<List<String>> solveNQueens(int n) {
        backtrack(0, 0, 0, 0, new ArrayList<>(), n);
        return result;
    }
}
```

<!-- slide -->
```javascript
var solveNQueens = function(n) {
    const result = [];
    
    function backtrack(row, cols, d1, d2, board) {
        if (row === n) {
            result.push(board.map((col, i) => 
                '.'.repeat(col) + 'Q' + '.'.repeat(n - col - 1)
            ));
            return;
        }
        
        let available = ((1 << n) - 1) & ~(cols | d1 | d2);
        
        while (available) {
            const position = available & (-available);
            available -= position;
            
            const col = position.toString(2).length - 1;
            board.push(col);
            
            backtrack(
                row + 1,
                cols | position,
                (d1 | position) << 1,
                (d2 | position) >> 1,
                board
            );
            
            board.pop();
        }
    }
    
    backtrack(0, 0, 0, 0, []);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N!) |
| **Space** | O(N) |

---

## Approach 3: Bitwise Backtracking (Most Efficient)

### Algorithm Steps

1. Similar to Approach 2 but with additional optimizations
2. Use left shift and right shift for diagonal propagation
3. Minimal variable usage for maximum speed

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def solveNQueens(self, n: int) -> List[List[str]]:
        """Ultra-efficient N-Queens using bitwise operations."""
        result = []
        
        def dfs(row: int, cols: int, diag1: int, diag2: int, board: List[int]) -> None:
            if row == n:
                result.append(['.' * i + 'Q' + '.' * (n - i - 1) for i in board])
                return
            
            # Bits where we can place a queen
            bits = ~(cols | diag1 | diag2) & ((1 << n) - 1)
            
            while bits:
                # Get rightmost 1-bit
                pick = bits & -bits
                bits -= pick
                
                col = (pick.bit_length() - 1)
                board.append(col)
                
                dfs(row + 1, 
                    cols | pick, 
                    (diag1 | pick) << 1, 
                    (diag2 | pick) >> 1, 
                    board)
                
                board.pop()
        
        dfs(0, 0, 0, 0, [])
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <string>
using namespace std;

class Solution {
private:
    vector<vector<string>> result;
    
    void solve(int row, int cols, int d1, int d2, vector<int>& board, int n) {
        if (row == n) {
            vector<string> solution;
            for (int col : board) {
                string s(n, '.');
                s[col] = 'Q';
                solution.push_back(s);
            }
            result.push_back(solution);
            return;
        }
        
        int bits = ~(cols | d1 | d2) & ((1 << n) - 1);
        
        while (bits) {
            int pick = bits & -bits;
            bits -= pick;
            
            int col = __builtin_ctz(pick);
            board.push_back(col);
            
            solve(row + 1, cols | pick, (d1 | pick) << 1, (d2 | pick) >> 1, board, n);
            
            board.pop_back();
        }
    }
    
public:
    vector<vector<string>> solveNQueens(int n) {
        vector<int> board;
        solve(0, 0, 0, 0, board, n);
        return result;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    private List<List<String>> result = new ArrayList<>();
    
    private void solve(int row, int cols, int d1, int d2, List<Integer> board, int n) {
        if (row == n) {
            List<String> solution = new ArrayList<>();
            for (int col : board) {
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < n; i++) {
                    sb.append(i == col ? 'Q' : '.');
                }
                solution.add(sb.toString());
            }
            result.add(solution);
            return;
        }
        
        int bits = ~(cols | d1 | d2) & ((1 << n) - 1);
        
        while (bits != 0) {
            int pick = bits & -bits;
            bits -= pick;
            
            int col = Integer.numberOfTrailingZeros(pick);
            board.add(col);
            
            solve(row + 1, cols | pick, (d1 | pick) << 1, (d2 | pick) >> 1, board, n);
            
            board.remove(board.size() - 1);
        }
    }
    
    public List<List<String>> solveNQueens(int n) {
        solve(0, 0, 0, 0, new ArrayList<>(), n);
        return result;
    }
}
```

<!-- slide -->
```javascript
var solveNQueens = function(n) {
    const result = [];
    
    function solve(row, cols, d1, d2, board) {
        if (row === n) {
            result.push(board.map((col, i) => 
                '.'.repeat(col) + 'Q' + '.'.repeat(n - col - 1)
            ));
            return;
        }
        
        let bits = ~(cols | d1 | d2) & ((1 << n) - 1);
        
        while (bits) {
            const pick = bits & -bits;
            bits -= pick;
            
            const col = pick.toString(2).length - 1;
            board.push(col);
            
            solve(row + 1, cols | pick, (d1 | pick) << 1, (d2 | pick) >> 1, board);
            
            board.pop();
        }
    }
    
    solve(0, 0, 0, 0, []);
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(N!) |
| **Space** | O(N) - Minimal overhead |

---

## Comparison of Approaches

| Aspect | Standard Backtracking | Bitmask | Bitwise |
|--------|----------------------|---------|---------|
| **Time Complexity** | O(N!) | O(N!) | O(N!) |
| **Space Complexity** | O(N) + O(N) sets | O(N) | O(N) |
| **Readability** | Very High | Medium | Low |
| **Performance** | Good | Fast | Fastest |
| **Recommended For** | Learning | Production | Competitive |

**Best Approach:** Standard backtracking (Approach 1) for readability and understanding. Bitwise (Approach 3) for maximum performance in competitions.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Classic interview problem
- **Companies**: Google, Amazon, Meta, Apple, Microsoft
- **Difficulty**: Hard
- **Concepts Tested**: Backtracking, DFS, Bit Manipulation, Recursion

### Learning Outcomes

1. **Backtracking**: Master the classic backtracking pattern
2. **Constraint Satisfaction**: Learn to handle multiple constraints
3. **Optimization**: Understand bit manipulation for efficiency
4. **State Management**: Handle complex state in recursion

---

## Related Problems

Based on similar themes (backtracking, recursion, constraint satisfaction):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Subsets | [Link](https://leetcode.com/problems/subsets/) | Basic backtracking |
| Permutations | [Link](https://leetcode.com/problems/permutations/) | Generate all arrangements |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Letter Combinations | [Link](https://leetcode.com/problems/letter-combinations-of-a-phone-number/) | Backtracking with mapping |
| Combination Sum | [Link](https://leetcode.com/problems/combination-sum/) | Backtracking with sums |
| Sudoku Solver | [Link](https://leetcode.com/problems/sudoku-solver/) | Advanced backtracking |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| N-Queens II | [Link](https://leetcode.com/problems/n-queens-ii/) | Count solutions only |
| Word Search | [Link](https://leetcode.com/problems/word-search/) | 2D backtracking |
| Remove Invalid Parentheses | [Link](https://leetcode.com/problems/remove-invalid-parentheses/) | Backtracking with pruning |

### Pattern Reference

For more detailed explanations of the Backtracking pattern, see:
- **[Backtracking Pattern](/patterns/backtracking)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - N-Queens](https://www.youtube.com/watch?v=Ph3c_iDAW8Y)** - Clear explanation with visual examples
2. **[N-Queens - LeetCode 51](https://www.youtube.com/watch?v=yTDNOI6O2gg)** - Detailed walkthrough
3. **[Back to Back SWE - N-Queens](https://www.youtube.com/watch?v=i05JuLkpltM)** - Comprehensive solution
4. **[N-Queens Bitmask Solution](https://www.youtube.com/watch?v=1nE-X7C4G9Y)** - Bitmask optimization

### Related Concepts

- **[Backtracking Explained](https://www.youtube.com/watch?v=Zq4upTEa5Bg)** - Understanding backtracking
- **[Bit Manipulation](https://www.youtube.com/watch?v=7jk0g8VYezs)** - Bit operations for efficiency

---

## Follow-up Questions

### Q1: What is the time complexity?

**Answer:** The time complexity is O(N!) because in the worst case, we explore all possible placements. However, with pruning from conflict detection, it's much faster in practice.

---

### Q2: How many solutions exist for N-Queens?

**Answer:** The number of solutions grows exponentially: N=1:1, N=2:0, N=3:0, N=4:2, N=5:10, N=6:4, N=7:40, N=8:92, N=9:352.

---

### Q3: Can you solve N-Queens II (count only) more efficiently?

**Answer:** Yes, you can stop counting once you find solutions instead of storing them. This uses less memory but same time complexity.

---

### Q4: How would you modify to find just one solution?

**Answer:** Add a flag to stop searching once one solution is found, or simply return the first solution from the current list.

---

### Q5: What is the difference between main and anti-diagonal checks?

**Answer:** Main diagonal: row - col is constant for all cells on same diagonal. Anti-diagonal: row + col is constant. Both need to be checked.

---

### Q6: How would you handle N > 9?

**Answer:** For larger N, the number of solutions becomes massive. You would need to use a different approach or limit the number of solutions returned. The bitmask approach still works but becomes impractical.

---

### Q7: Can you solve this iteratively instead of recursively?

**Answer:** Yes, you can use an explicit stack to simulate the recursion. The recursive approach is more elegant, but iterative can be useful for very deep recursion.

---

### Q8: How would you visualize the solution?

**Answer:** Convert the board list to a visual format where 'Q' represents a queen and '.' represents an empty cell, as shown in the output format.

---

## Common Pitfalls

### 1. Index vs Position Confusion
**Issue**: Confusing between array indices and board positions.

**Solution**: Use consistent indexing (0 to N-1) throughout.

### 2. Diagonal Formula Mistakes
**Issue**: Incorrect diagonal calculations.

**Solution**: Remember: main diagonal = row - col, anti-diagonal = row + col.

### 3. Backtracking Cleanup
**Issue**: Forgetting to remove placed queen after recursion.

**Solution**: Always ensure state is restored after recursive call returns.

### 4. Off-by-One in Bitmask
**Issue**: Incorrect bitmask range for available positions.

**Solution**: Use `(1 << n) - 1` to create an n-bit mask of all 1s.

---

## Summary

The **N-Queens** problem is a classic backtracking problem that demonstrates:

- **Systematic Search**: Try all possibilities with pruning
- **Constraint Handling**: Multiple constraints (row, column, diagonals)
- **State Management**: Track and restore state in recursion
- **Optimization**: Bit manipulation for efficiency

Key takeaways:
1. Place one queen per row (eliminates row conflict)
2. Use sets or bitmasks for O(1) conflict detection
3. Backtrack by removing placed queens
4. Convert board to string format for output

This problem is essential for understanding backtracking and forms the foundation for many constraint satisfaction problems.

### Pattern Summary

This problem exemplifies the **Backtracking** pattern, characterized by:
- Recursive exploration of solution space
- Pruning invalid states early
- State restoration after exploration
- Systematic search for all valid solutions

For more details on this pattern and its variations, see the **[Backtracking Pattern](/patterns/backtracking)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/n-queens/discuss/) - Community solutions
- [Backtracking - GeeksforGeeks](https://www.geeksforgeeks.org/backtracking-algorithms/) - Backtracking fundamentals
- [N-Queens Wikipedia](https://en.wikipedia.org/wiki/Eight_queens_puzzle) - Historical context
- [Pattern: Backtracking](/patterns/backtracking) - Comprehensive pattern guide
