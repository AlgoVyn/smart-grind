# N-Queens

## Category
Backtracking

## Description

The N-Queens problem is a classic combinatorial problem that asks: *How can N chess queens be placed on an N×N chessboard so that no two queens threaten each other?* A queen can attack horizontally, vertically, and along both diagonals. This problem exemplifies the power of **backtracking** - a systematic way to explore all possible configurations while pruning branches that cannot lead to valid solutions.

The N-Queens problem is not just a puzzle; it has practical applications in:
- **Parallel processing**: Task scheduling where no two tasks conflict
- **VLSI design**: Placement of components without signal interference
- **Load balancing**: Distributing resources without overlap

---

## When to Use

Use the N-Queens backtracking algorithm when you need to solve problems involving:

- **Constraint Satisfaction**: Finding configurations that satisfy multiple conditions simultaneously
- **Combinatorial Search**: Exploring all possible arrangements systematically
- **Placement Problems**: Positioning items where they don't conflict
- **Game Board Problems**: Solving puzzles on grids with movement constraints

### Comparison with Alternatives

| Algorithm/Approach | Best For | Time Complexity | Space Complexity | Key Limitation |
|-------------------|----------|-----------------|-------------------|----------------|
| **Backtracking (Naive)** | Small N (≤15) | O(N!) | O(N) | Explores all possibilities |
| **Backtracking + Sets** | Moderate N (≤20) | O(N!) avg | O(N) | Still exponential worst case |
| **Bitwise Manipulation** | N ≤ 32 | O(N!) | O(1) | Limited to 32-bit |
| **Mathematical Solutions** | Special cases | O(N) or O(N²) | O(1) | Only for certain N values |
| **Iterative Construction** | Generating one solution | O(N²) | O(N) | May not find all solutions |

### When to Choose Different Approaches

- **Choose Standard Backtracking** when:
  - You need ALL solutions, not just one
  - N is relatively small (≤15-20)
  - You need a clear, understandable solution

- **Choose Bitwise Optimization** when:
  - Performance is critical
  - N is moderate (up to 32)
  - You're only finding ONE solution

- **Choose Mathematical Construction** when:
  - You only need ONE solution
  - N has special properties
  - Speed is paramount

---

## Algorithm Explanation

### Core Concept

The key insight behind the N-Queens solution is **incremental construction with constraint checking**:

1. **Row-by-Row Placement**: Since each row must have exactly one queen, we place queens row by row
2. **Constraint Propagation**: At each step, we track which columns and diagonals are under attack
3. **Backtracking**: When we hit a dead end, we undo the last placement and try the next position

### How It Works

#### The Three Attack Patterns:

1. **Same Column**: `col` is already occupied
2. **Main Diagonal (↘)**: `row - col` is constant along this diagonal
3. **Anti-Diagonal (↙)**: `row + col` is constant along this diagonal

#### Why Backtracking Works:

Backtracking is a depth-first search that:
- **Explores systematically**: Every possible placement is considered
- **Prunes early**: Invalid configurations are detected immediately
- **Undoes decisions**: When a path fails, we revert to a previous state and try alternatives

### Visual Representation

For N=4, the solution space looks like:

```
Row 0: Try column 0 → FAIL (can't place rest)
Row 0: Try column 1 → Continue
Row 1: Try column 0 → FAIL
Row 1: Try column 2 → Continue  
Row 2: Try column 0 → Continue ← QUEEN HERE
Row 3: Try column ? → FAIL (no valid position)
...backtrack and try different paths...
```

The valid solutions for N=4:
```
Solution 1:              Solution 2:
. Q . .                 . . Q .
. . . Q                 Q . . .
Q . . .                 . . . Q
. . Q .                 . Q . .
(0,1) (1,3) (2,0) (3,2)  (0,2) (1,0) (2,3) (3,1)
```

### Optimization Techniques

1. **Set-Based Tracking**: O(1) lookup for columns and diagonals under attack
2. **Bitmask Optimization**: Use single integers to track occupied positions (faster for larger N)
3. **Early Termination**: Skip rows where no valid column exists
4. **Symmetry Pruning**: For N > 6, only search first half of first row (solutions are symmetric)

### Limitations

- **Exponential Time**: O(N!) worst case - not feasible for very large N
- **Memory Intensive for All Solutions**: Number of solutions grows exponentially
- **No Polynomial Solution**: This is an NP-complete problem

---

## Algorithm Steps

### Step-by-Step Approach

1. **Initialize Tracking Structures**
   - Create sets for columns, positive diagonals (row+col), and negative diagonals (row-col)
   - Each tracks positions already under attack

2. **Base Case Check**
   - If `row == N`, all queens are placed successfully
   - Convert column positions to board representation and add to solutions

3. **Try Each Column**
   - For the current row, iterate through all columns (0 to N-1)
   - For each column, check if it's safe to place a queen

4. **Safety Check**
   - Skip if column is in `cols` set
   - Skip if `row + col` is in `pos_diag` set (anti-diagonal)
   - Skip if `row - col` is in `neg_diag` set (main diagonal)

5. **Place Queen**
   - Add column and both diagonals to their respective sets
   - Add column position to current board state
   - Recursively call for next row

6. **Backtrack**
   - Remove column and diagonals from sets (undo the placement)
   - Remove last column from board state
   - Try next column position

7. **Return Solutions**
   - After recursion completes, return all valid board configurations

---

## Implementation

### Template Code (Backtracking with Set Optimization)

````carousel
```python
def solve_n_queens(n):
    """
    Solve N-Queens problem using backtracking with set optimization.
    
    Args:
        n: Number of queens (board is n×n)
    
    Returns:
        List of solutions, each solution is a list of column positions
        where row i has queen at column positions[i]
    
    Time: O(N!) - worst case explores all permutations
    Space: O(N) - recursion stack + tracking sets
    """
    solutions = []
    
    # Track columns and diagonals under attack
    cols = set()           # columns with queens
    pos_diag = set()       # r + c for positive diagonal (↙)
    neg_diag = set()       # r - c for negative diagonal (↘)
    
    def backtrack(row, board):
        # Base case: all queens placed successfully
        if row == n:
            solutions.append(board[:])
            return
        
        # Try placing queen in each column of current row
        for col in range(n):
            # Calculate diagonal identifiers
            p_diag = row + col  # positive diagonal
            n_diag = row - col  # negative diagonal
            
            # Skip if position is under attack
            if col in cols or p_diag in pos_diag or n_diag in neg_diag:
                continue
            
            # Place queen: mark position as occupied
            cols.add(col)
            pos_diag.add(p_diag)
            neg_diag.add(n_diag)
            board.append(col)
            
            # Recurse to next row
            backtrack(row + 1, board)
            
            # Backtrack: remove queen and try next position
            cols.remove(col)
            pos_diag.remove(p_diag)
            neg_diag.remove(n_diag)
            board.pop()
    
    # Start from first row
    backtrack(0, [])
    return solutions


def solve_n_queens_board(n):
    """Return solutions as visual board representations."""
    solutions = solve_n_queens(n)
    result = []
    
    for positions in solutions:
        board = []
        for col in positions:
            row_str = '.' * col + 'Q' + '.' * (n - col - 1)
            board.append(row_str)
        result.append(board)
    
    return result


# Example usage
if __name__ == "__main__":
    n = 4
    solutions = solve_n_queens_board(n)
    
    print(f"N-Queens solutions for n={n}:")
    print(f"Total solutions: {len(solutions)}\n")
    
    for i, solution in enumerate(solutions, 1):
        print(f"Solution {i}:")
        for row in solution:
            print(f"  {row}")
        print()
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <set>
using namespace std;

/**
 * Solve N-Queens problem using backtracking with set optimization.
 * 
 * Time Complexity: O(N!) - worst case explores all permutations
 * Space Complexity: O(N) - recursion stack + tracking sets
 */
class NQueens {
private:
    int n;
    vector<vector<string>> solutions;
    set<int> cols;       // columns occupied
    set<int> posDiag;    // row + col (positive diagonal ↙)
    set<int> negDiag;    // row - col (negative diagonal ↘)
    
public:
    NQueens(int n) : n(n) {}
    
    vector<vector<string>> solve() {
        vector<int> board;
        backtrack(0, board);
        return solutions;
    }
    
private:
    void backtrack(int row, vector<int>& board) {
        // Base case: all queens placed
        if (row == n) {
            solutions.push_back(buildBoard(board));
            return;
        }
        
        // Try each column in current row
        for (int col = 0; col < n; col++) {
            int pDiag = row + col;
            int nDiag = row - col;
            
            // Skip if position is under attack
            if (cols.count(col) || posDiag.count(pDiag) || negDiag.count(nDiag)) {
                continue;
            }
            
            // Place queen
            cols.insert(col);
            posDiag.insert(pDiag);
            negDiag.insert(nDiag);
            board.push_back(col);
            
            // Recurse to next row
            backtrack(row + 1, board);
            
            // Backtrack
            cols.erase(col);
            posDiag.erase(pDiag);
            negDiag.erase(nDiag);
            board.pop_back();
        }
    }
    
    vector<string> buildBoard(const vector<int>& board) {
        vector<string> result;
        for (int col : board) {
            string row(n, '.');
            row[col] = 'Q';
            result.push_back(row);
        }
        return result;
    }
};


int main() {
    int n = 4;
    NQueens solver(n);
    vector<vector<string>> solutions = solver.solve();
    
    cout << "N-Queens solutions for n=" << n << ":" << endl;
    cout << "Total solutions: " << solutions.size() << endl << endl;
    
    for (size_t i = 0; i < solutions.size(); i++) {
        cout << "Solution " << i + 1 << ":" << endl;
        for (const string& row : solutions[i]) {
            cout << "  " << row << endl;
        }
        cout << endl;
    }
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Solve N-Queens problem using backtracking with set optimization.
 * 
 * Time Complexity: O(N!) - worst case explores all permutations
 * Space Complexity: O(N) - recursion stack + tracking sets
 */
public class NQueensSolver {
    private int n;
    private Set<Integer> cols;       // columns occupied
    private Set<Integer> posDiag;   // row + col (positive diagonal)
    private Set<Integer> negDiag;   // row - col (negative diagonal)
    private List<List<String>> solutions;
    
    public NQueensSolver(int n) {
        this.n = n;
        this.cols = new HashSet<>();
        this.posDiag = new HashSet<>();
        this.negDiag = new HashSet<>();
        this.solutions = new ArrayList<>();
    }
    
    public List<List<String>> solve() {
        List<Integer> board = new ArrayList<>();
        backtrack(0, board);
        return solutions;
    }
    
    private void backtrack(int row, List<Integer> board) {
        // Base case: all queens placed
        if (row == n) {
            solutions.add(buildBoard(board));
            return;
        }
        
        // Try each column in current row
        for (int col = 0; col < n; col++) {
            int pDiag = row + col;
            int nDiag = row - col;
            
            // Skip if position is under attack
            if (cols.contains(col) || posDiag.contains(pDiag) || negDiag.contains(nDiag)) {
                continue;
            }
            
            // Place queen
            cols.add(col);
            posDiag.add(pDiag);
            negDiag.add(nDiag);
            board.add(col);
            
            // Recurse to next row
            backtrack(row + 1, board);
            
            // Backtrack
            cols.remove(col);
            posDiag.remove(pDiag);
            negDiag.remove(nDiag);
            board.remove(board.size() - 1);
        }
    }
    
    private List<String> buildBoard(List<Integer> board) {
        List<String> result = new ArrayList<>();
        for (int col : board) {
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < n; i++) {
                sb.append(i == col ? 'Q' : '.');
            }
            result.add(sb.toString());
        }
        return result;
    }
    
    public static void main(String[] args) {
        int n = 4;
        NQueensSolver solver = new NQueensSolver(n);
        List<List<String>> solutions = solver.solve();
        
        System.out.println("N-Queens solutions for n=" + n + ":");
        System.out.println("Total solutions: " + solutions.size());
        System.out.println();
        
        for (int i = 0; i < solutions.size(); i++) {
            System.out.println("Solution " + (i + 1) + ":");
            for (String row : solutions.get(i)) {
                System.out.println("  " + row);
            }
            System.out.println();
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Solve N-Queens problem using backtracking with set optimization.
 * 
 * Time Complexity: O(N!) - worst case explores all permutations
 * Space Complexity: O(N) - recursion stack + tracking sets
 */
function solveNQueens(n) {
    const solutions = [];
    const cols = new Set();      // columns occupied
    const posDiag = new Set();   // row + col (positive diagonal)
    const negDiag = new Set();   // row - col (negative diagonal)
    
    function backtrack(row, board) {
        // Base case: all queens placed
        if (row === n) {
            solutions.push([...board]);
            return;
        }
        
        // Try each column in current row
        for (let col = 0; col < n; col++) {
            const pDiag = row + col;
            const nDiag = row - col;
            
            // Skip if position is under attack
            if (cols.has(col) || posDiag.has(pDiag) || negDiag.has(nDiag)) {
                continue;
            }
            
            // Place queen
            cols.add(col);
            posDiag.add(pDiag);
            negDiag.add(nDiag);
            board.push(col);
            
            // Recurse to next row
            backtrack(row + 1, board);
            
            // Backtrack
            cols.delete(col);
            posDiag.delete(pDiag);
            negDiag.delete(nDiag);
            board.pop();
        }
    }
    
    backtrack(0, []);
    return solutions;
}

/**
 * Convert column positions to board representation
 */
function convertToBoard(positions) {
    const n = positions.length;
    return positions.map(col => {
        return '.'.repeat(col) + 'Q' + '.'.repeat(n - col - 1);
    });
}

// Example usage
const n = 4;
const solutions = solveNQueens(n);

console.log(`N-Queens solutions for n=${n}:`);
console.log(`Total solutions: ${solutions.length}\n`);

solutions.forEach((solution, i) => {
    console.log(`Solution ${i + 1}:`);
    const board = convertToBoard(solution);
    board.forEach(row => console.log(`  ${row}`));
    console.log();
});
```
````

---

## Example

### Example 1: n = 4

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
- For n=4, there are exactly 2 valid solutions
- Solution 1: Queens at positions (0,1), (1,3), (2,0), (3,2)
- Solution 2: Queens at positions (0,2), (1,0), (2,3), (3,1)

### Example 2: n = 1

**Input:**
```
n = 1
```

**Output:**
```
[["Q"]]
```

**Explanation:** Only one queen, placed at (0,0)

### Example 3: n = 2 or n = 3

**Input:**
```
n = 2  or  n = 3
```

**Output:**
```
[]
```

**Explanation:** No solutions exist for n=2 and n=3 because it's impossible to place queens without them attacking each other.

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Worst Case** | O(N!) | Explores all possible permutations |
| **Average Case** | O(N!) | Still exponential due to pruning |
| **Best Case** | O(1) | When N=0 or N=1 (immediate solution) |
| **Solution Count** | Varies | Known formula: ~0.34^N for large N |

### Detailed Breakdown

- **Branch Factor**: At row `r`, we try up to `(N - r)` columns
- **Total Combinations**: N × (N-1) × (N-2) × ... × 1 = N!
- **Constraint Checking**: O(1) per position using sets
- **Overhead**: Each successful placement triggers recursion; each failure triggers backtracking

### Known Solution Counts

| N | Number of Solutions |
|---|---------------------|
| 1 | 1 |
| 2 | 0 |
| 3 | 0 |
| 4 | 2 |
| 5 | 10 |
| 6 | 4 |
| 7 | 40 |
| 8 | 92 |
| 9 | 352 |
| 10 | 724 |
| 11 | 2,680 |
| 12 | 14,200 |

---

## Space Complexity Analysis

| Component | Space | Description |
|-----------|-------|-------------|
| **Recursion Stack** | O(N) | Maximum depth of recursion |
| **Column Set** | O(N) | Tracks occupied columns |
| **Diagonal Sets** | O(N) | Tracks occupied diagonals |
| **Board State** | O(N) | Current queen placements |
| **Solutions Storage** | O(N² × S) | S = number of solutions |

### Space Optimization Notes

- Using **bitmasks** instead of sets reduces space to O(1)
- If only one solution is needed, don't store all solutions
- For very large N, consider iterative approaches or mathematical constructions

---

## Common Variations

### 1. Bitwise Optimization (Most Efficient)

Using bit manipulation instead of sets for faster performance:

````carousel
```python
def solve_n_queens_bitwise(n):
    """Solve N-Queens using bitwise operations - much faster."""
    solutions = []
    
    def backtrack(row, cols, pos_diag, neg_diag, board):
        if row == n:
            solutions.append(board[:])
            return
        
        # Available positions: all columns not occupied
        # Bits: column 0 = LSB
        available = ((1 << n) - 1) & ~(cols | pos_diag | neg_diag)
        
        while available:
            # Pick rightmost available position
            pos = available & (-available)
            available -= pos
            
            col = pos.bit_length() - 1
            board.append(col)
            
            backtrack(
                row + 1,
                cols | pos,
                (pos_diag | pos) << 1,
                (neg_diag | pos) >> 1,
                board
            )
            
            board.pop()
    
    backtrack(0, 0, 0, 0, [])
    return solutions
```

<!-- slide -->
```javascript
function solveNQueensBitwise(n) {
    const solutions = [];
    
    function backtrack(row, cols, posDiag, negDiag, board) {
        if (row === n) {
            solutions.push([...board]);
            return;
        }
        
        // Available positions
        let available = ((1 << n) - 1) & ~(cols | posDiag | negDiag);
        
        while (available) {
            const pos = available & (-available);
            available -= pos;
            
            const col = Math.log2(pos);
            board.push(col);
            
            backtrack(
                row + 1,
                cols | pos,
                (posDiag | pos) << 1,
                (negDiag | pos) >> 1,
                board
            );
            
            board.pop();
        }
    }
    
    backtrack(0, 0, 0, 0, []);
    return solutions;
}
```
````

### 2. Finding Only ONE Solution

Stop after finding the first solution:

````carousel
```python
def solve_n_queens_one(n):
    """Find just one solution - stops as soon as found."""
    cols = set()
    pos_diag = set()
    neg_diag = set()
    result = []
    
    def backtrack(row, board):
        if row == n:
            result.append(board[:])
            return True  # Signal found
        
        for col in range(n):
            p_diag = row + col
            n_diag = row - col
            
            if col in cols or p_diag in pos_diag or n_diag in neg_diag:
                continue
            
            cols.add(col)
            pos_diag.add(p_diag)
            neg_diag.add(n_diag)
            board.append(col)
            
            if backtrack(row + 1, board):
                return True  # Stop further search
            
            cols.remove(col)
            pos_diag.remove(p_diag)
            neg_diag.remove(n_diag)
            board.pop()
        
        return False
    
    backtrack(0, [])
    return result[0] if result else []
```
````

### 3. N-Queens II (Count Only)

Return count instead of all boards:

````carousel
```python
def total_n_queens(n):
    """Return count of solutions without storing them."""
    count = 0
    cols = set()
    pos_diag = set()
    neg_diag = set()
    
    def backtrack(row):
        nonlocal count
        if row == n:
            count += 1
            return
        
        for col in range(n):
            if col in cols or (row + col) in pos_diag or (row - col) in neg_diag:
                continue
            
            cols.add(col)
            pos_diag.add(row + col)
            neg_diag.add(row - col)
            
            backtrack(row + 1)
            
            cols.remove(col)
            pos_diag.remove(row + col)
            neg_diag.remove(row - col)
    
    backtrack(0)
    return count
```
````

### 4. N-Rooks (Simpler Variant)

Place N rooks - only need column tracking:

````carousel
```python
def solve_n_rooks(n):
    """N-Rooks problem - rooks only attack horizontally/vertically."""
    solutions = []
    cols = set()
    
    def backtrack(row, board):
        if row == n:
            solutions.append(board[:])
            return
        
        for col in range(n):
            if col in cols:
                continue
            
            cols.add(col)
            board.append(col)
            backtrack(row + 1, board)
            cols.remove(col)
            board.pop()
    
    backtrack(0, [])
    return solutions
```
````

---

## Practice Problems

### Problem 1: N-Queens

**Problem:** [LeetCode 51 - N-Queens](https://leetcode.com/problems/n-queens/)

**Description:** Return all distinct solutions to the n-queens puzzle. Each solution contains a distinct board configuration where the queens are placed.

**How to Apply This Technique:**
- Use the standard backtracking approach with set optimization
- Track columns and both diagonals
- Return all valid configurations

---

### Problem 2: N-Queens II

**Problem:** [LeetCode 52 - N-Queens II](https://leetcode.com/problems/n-queens-ii/)

**Description:** Return the number of distinct solutions to the n-queens puzzle.

**How to Apply This Technique:**
- Same algorithm but only count solutions
- Don't store board configurations to save memory
- Use a counter instead of collecting all solutions

---

### Problem 3: Valid Sudoku

**Problem:** [LeetCode 36 - Valid Sudoku](https://leetcode.com/problems/valid-sudoku/)

**Description:** Determine if a 9x9 Sudoku board is valid.

**How to Apply This Technique:**
- Similar constraint checking approach
- Track rows, columns, and 3x3 boxes
- Use sets to detect duplicates (similar to diagonal tracking)

---

### Problem 4: Word Search

**Problem:** [LeetCode 79 - Word Search](https://leetcode.com/problems/word-search/)

**Description:** Find if a word exists in a 2D grid of letters, moving horizontally and vertically.

**How to Apply This Technique:**
- Backtracking with visited set
- Similar recursive exploration pattern
- Prune when character doesn't match

---

### Problem 5: Restore IP Addresses

**Problem:** [LeetCode 93 - Restore IP Addresses](https://leetcode.com/problems/restore-ip-addresses/)

**Description:** Given a string of digits, restore all possible valid IP addresses.

**How to Apply This Technique:**
- Backtracking with constraint validation
- Check validity at each step (similar to checking safe queen positions)
- Prune invalid branches early

---

## Video Tutorial Links

### Fundamentals

- [N-Queens Problem - Backtracking (Take U Forward)](https://www.youtube.com/watch?v=Ph1R6X6XgJM) - Comprehensive introduction
- [N-Queens LeetCode Solution (NeetCode)](https://www.youtube.com/watch?v=n7yw8k1a5sE) - Practical implementation
- [Backtracking Algorithm (WilliamFiset)](https://www.youtube.com/watch?v=4lmU1kT27Mo) - Core concepts

### Advanced Topics

- [Bitwise N-Queens Optimization](https://www.youtube.com/watch?v=n7yw8k1a5sE) - Bit manipulation approach
- [N-Queens Visual Explanation](https://www.youtube.com/watch?v=Hzv9L8idzLE) - Visual walkthrough
- [Understanding Backtracking](https://www.youtube.com/watch?v=A80YzvNwqVw) - Deep dive into recursion

---

## Follow-up Questions

### Q1: Why is N-Queens considered exponential time even with pruning?

**Answer:** The pruning in backtracking doesn't reduce the worst-case time complexity because:
- We still explore essentially all N! permutations in the worst case
- For N=15, this is still ~1.3 trillion combinations
- The constraint checking only eliminates invalid branches AFTER we try positions
- Pruning reduces average case but not worst-case complexity

### Q2: How does bitwise optimization improve performance?

**Answer:** Bitwise optimization provides significant speedup because:
- Set operations are O(1) but have overhead (hash computation, object creation)
- Bitwise operations are single CPU instructions
- Bit manipulation allows using bit shifts for diagonal tracking
- For N ≤ 32, all state fits in a single 32-bit integer
- Can process multiple positions in parallel with SIMD instructions

### Q3: Can N-Queens be solved in polynomial time?

**Answer:** No, N-Queens is NP-Complete, meaning:
- No known polynomial-time algorithm exists
- Solutions grow exponentially (~0.34^N)
- However, there's a mathematical construction for finding ONE solution in O(N²)
- For specific N values, there are known patterns that can be generated directly

### Q4: What's the maximum N that can be practically solved?

**Answer:** With standard backtracking:
- N ≤ 15: Fast (sub-second)
- N = 20: Takes several seconds
- N = 25: Takes minutes to hours
- N > 30: Not practical with backtracking

With bitwise + symmetry pruning + distributed computing:
- N up to 50+ has been solved (but huge computational resources needed)

### Q5: How does N-Queens relate to other backtracking problems?

**Answer:** N-Queens is a foundational backtracking problem that teaches:
- **Incremental construction**: Build solution piece by piece
- **Constraint propagation**: Track what's "off-limits"
- **Backtracking**: Undo decisions when stuck
- **Pruning**: Stop exploring dead ends early

These same patterns apply to:
- Sudoku solving
- Crossword puzzle generation
- Path finding in games
- Combinatorial optimization

---

## Summary

The N-Queens problem is a **foundational backtracking algorithm** that demonstrates the power of systematic exploration with constraint checking. Key takeaways:

- **Backtracking**: Explore all possibilities, undoing bad decisions
- **Set Optimization**: O(1) constraint checking with hash sets
- **Bitwise Optimization**: Faster with bit manipulation for larger N
- **Exponential Complexity**: O(N!) worst case - not for very large N
- **Practical Applications**: Scheduling, placement, puzzle solving

When to use:
- ✅ Constraint satisfaction problems
- ✅ Placement on grids
- ✅ When you need ALL solutions
- ✅ Learning backtracking fundamentals

- ❌ Very large N (exponential explosion)
- ❌ When only one solution needed (use mathematical construction instead)
- ❌ When performance is critical (use bitwise optimization)

This algorithm is essential for competitive programming and technical interviews, serving as a gateway to understanding more complex backtracking and combinatorial optimization problems.

---

## Related Algorithms

- [Combinations](./combinations.md) - Generate all combinations
- [Permutations](./permutations.md) - Generate all permutations
- [Subsets](./subsets.md) - Power set generation
- [Backtracking Patterns](./backtracking-patterns.md) - Common backtracking approaches
