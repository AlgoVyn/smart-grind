# N-Queens

## Category
Backtracking

## Description

The N-Queens problem is a classic combinatorial problem that asks: *How can N chess queens be placed on an N×N chessboard so that no two queens threaten each other?* A queen can attack horizontally, vertically, and along both diagonals. This problem exemplifies the power of **backtracking** - a systematic way to explore all possible configurations while pruning branches that cannot lead to valid solutions.

The N-Queens problem is not just a puzzle; it has practical applications in parallel processing, VLSI design, and load balancing scenarios where resources must be placed without conflict.

---

## Concepts

The N-Queens algorithm is built on several fundamental concepts that make backtracking effective for constraint satisfaction problems.

### 1. Constraint Propagation

Each queen placement affects available positions:

| Constraint | Rule | Tracking Method |
|------------|------|-----------------|
| **Column** | One queen per column | Set of occupied columns |
| **Main Diagonal (↘)** | `row - col` is constant | Set of `row - col` values |
| **Anti-Diagonal (↙)** | `row + col` is constant | Set of `row + col` values |

### 2. Incremental Construction

Build solution row by row:

```
Row 0: Try columns 0 to N-1
  - For each valid column, place queen
  - Recurse to Row 1
  - Backtrack (remove queen, try next column)
Row 1: Repeat process
...
Row N: All queens placed (solution found!)
```

### 3. Backtracking Pattern

The core backtracking approach:

```
1. Choose: Select next position to try
2. Constraint Check: Verify placement is valid
3. Place: Add to current state
4. Recurse: Continue to next decision
5. Backtrack: Undo placement if path fails
```

### 4. Pruning

Eliminate invalid branches early:

- **Early detection**: Check constraints before recursing
- **Dead end recognition**: If no valid column in current row, backtrack immediately
- **Symmetry**: For optimization, can exploit problem symmetry

---

## Frameworks

Structured approaches for solving N-Queens problems.

### Framework 1: Standard Backtracking with Sets

```
┌─────────────────────────────────────────────────────┐
│  STANDARD N-QUEENS BACKTRACKING FRAMEWORK            │
├─────────────────────────────────────────────────────┤
│  1. Initialize tracking sets:                      │
│     - cols = set()     (occupied columns)            │
│     - pos_diag = set() (row + col, anti-diagonal)   │
│     - neg_diag = set() (row - col, main diagonal)    │
│  2. Define backtrack(row, board):                   │
│     a. If row == N: add board to solutions           │
│     b. For each col in range(N):                    │
│        - Check if (col, row+col, row-col) in sets   │
│        - If safe:                                    │
│          * Add to all three sets                     │
│          * board.append(col)                         │
│          * backtrack(row + 1, board)               │
│          * Remove from sets (backtrack)             │
│          * board.pop()                               │
│  3. Call backtrack(0, [])                           │
│  4. Return all solutions                             │
└─────────────────────────────────────────────────────┘
```

**When to use**: Finding all solutions, N ≤ 15-20, clean code preferred.

### Framework 2: Bitwise Optimization

```
┌─────────────────────────────────────────────────────┐
│  BITWISE N-QUEENS FRAMEWORK                          │
├─────────────────────────────────────────────────────┤
│  1. Use bitmask to track available positions:       │
│     - available = (1 << N) - 1  (all N bits set)   │
│  2. Define backtrack(row, cols, pos_diag, neg_diag) │
│     a. If available == 0 and row < N: return       │
│     b. While available:                             │
│        - pos = available & (-available)  (LSB)       │
│        - available -= pos                          │
│        - Recurse with:                              │
│          cols | pos                                 │
│          (pos_diag | pos) << 1                       │
│          (neg_diag | pos) >> 1                     │
│  3. Track solutions                                 │
└─────────────────────────────────────────────────────┘
```

**When to use**: Performance critical, N ≤ 32, count-only solutions.

### Framework 3: Single Solution Search

```
┌─────────────────────────────────────────────────────┐
│  SINGLE SOLUTION N-QUEENS FRAMEWORK                  │
├─────────────────────────────────────────────────────┤
│  1. Same initialization as standard framework      │
│  2. In backtrack:                                    │
│     a. If row == N: return True (found solution)   │
│     b. For each valid column:                        │
│        - Place queen                                 │
│        - If backtrack(row + 1): return True        │
│        - Remove queen                                │
│     c. Return False (no solution from this path)    │
│  3. Stop after first solution found                  │
└─────────────────────────────────────────────────────┘
```

**When to use**: Only need one solution, early termination desired.

---

## Forms

Different manifestations of the N-Queens pattern.

### Form 1: Find All Solutions

Return all valid board configurations:

| N | Solutions | Time | Space |
|---|-----------|------|-------|
| 1 | 1 | O(1) | O(1) |
| 4 | 2 | O(N!) | O(N²) output |
| 8 | 92 | O(N!) | O(N²) output |
| 10 | 724 | O(N!) | O(N²) output |

### Form 2: Count Solutions Only

Return just the count (not boards):

| N | Count | Optimization |
|---|-------|--------------|
| 1 | 1 | No board storage |
| 8 | 92 | O(1) extra space |
| 14 | 365,596 | Bitwise recommended |

**Benefit**: No need to store board representations, just increment counter.

### Form 3: Return One Solution

Stop after finding first valid placement:

```
Typical for N ≥ 4, a solution always exists
Time: Much faster than finding all solutions
Can use heuristic: start from middle column
```

### Form 4: N-Rooks (Simplified)

Place rooks instead of queens:

| Difference | N-Queens | N-Rooks |
|------------|----------|---------|
| Attacks | Row, Col, Diagonals | Row, Col only |
| Constraints | 3 sets | 1 set (columns) |
| Solutions | Complex | N! (all permutations) |
| Time | O(N!) | O(N!) but simpler |

### Form 5: Bitwise Representation

Use integers to represent board state:

```
For N ≤ 32, use 32-bit integers as bitmasks:
- cols: bits represent which columns are occupied
- pos_diag: bits for anti-diagonals (row + col)
- neg_diag: bits for main diagonals (row - col + N - 1)

Available positions: ~(cols | pos_diag | neg_diag) & ((1 << N) - 1)
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Set-Based Constraint Tracking

Use sets for O(1) constraint checking:

```python
def solve_n_queens(n):
    solutions = []
    cols = set()        # occupied columns
    pos_diag = set()    # row + col
    neg_diag = set()    # row - col
    
    def backtrack(row, board):
        if row == n:
            solutions.append(board[:])
            return
        
        for col in range(n):
            if (col in cols or 
                (row + col) in pos_diag or 
                (row - col) in neg_diag):
                continue
            
            # Place queen
            cols.add(col)
            pos_diag.add(row + col)
            neg_diag.add(row - col)
            board.append(col)
            
            backtrack(row + 1, board)
            
            # Backtrack
            cols.remove(col)
            pos_diag.remove(row + col)
            neg_diag.remove(row - col)
            board.pop()
    
    backtrack(0, [])
    return solutions
```

### Tactic 2: Bitwise Optimization

Use bit manipulation for speed:

```python
def solve_n_queens_bitwise(n):
    """Solve N-Queens using bitwise operations."""
    solutions = []
    all_ones = (1 << n) - 1  # n bits set to 1
    
    def backtrack(row, cols, pos_diag, neg_diag, board):
        if row == n:
            solutions.append(board[:])
            return
        
        # Available positions
        available = all_ones & ~(cols | pos_diag | neg_diag)
        
        while available:
            # Get rightmost available position
            pos = available & (-available)
            available -= pos
            
            col = (pos.bit_length() - 1)
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

### Tactic 3: Symmetry Pruning

For optimization on symmetric boards:

```python
def solve_n_queens_symmetry_optimized(n):
    """Exploit symmetry - only search first half of first row."""
    if n == 1:
        return [["Q"]]
    
    solutions = []
    cols = set()
    pos_diag = set()
    neg_diag = set()
    
    def backtrack(row, board):
        if row == n:
            solutions.append(board[:])
            return
        
        # For row 0, only search first half
        start_col = 0
        end_col = n
        if row == 0 and n > 1:
            end_col = (n + 1) // 2
        
        for col in range(start_col, end_col):
            if (col in cols or 
                (row + col) in pos_diag or 
                (row - col) in neg_diag):
                continue
            
            cols.add(col)
            pos_diag.add(row + col)
            neg_diag.add(row - col)
            board.append(col)
            
            backtrack(row + 1, board)
            
            cols.remove(col)
            pos_diag.remove(row + col)
            neg_diag.remove(row - col)
            board.pop()
    
    backtrack(0, [])
    
    # Mirror solutions for complete count
    # (Implementation for full solutions)
    
    return solutions
```

### Tactic 4: Find Single Solution with Heuristic

Stop early when one solution found:

```python
def solve_n_queens_one(n):
    """Find just one solution."""
    cols = set()
    pos_diag = set()
    neg_diag = set()
    result = []
    
    def backtrack(row, board):
        if row == n:
            result.extend(board)
            return True  # Found solution
        
        # Try middle columns first (heuristic)
        columns = list(range(n))
        mid = n // 2
        columns.sort(key=lambda x: abs(x - mid))
        
        for col in columns:
            if (col in cols or 
                (row + col) in pos_diag or 
                (row - col) in neg_diag):
                continue
            
            cols.add(col)
            pos_diag.add(row + col)
            neg_diag.add(row - col)
            board.append(col)
            
            if backtrack(row + 1, board):
                return True
            
            cols.remove(col)
            pos_diag.remove(row + col)
            neg_diag.remove(row - col)
            board.pop()
        
        return False
    
    backtrack(0, [])
    return result
```

### Tactic 5: Count Solutions Without Storing

Memory-efficient counting:

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
            if (col in cols or 
                (row + col) in pos_diag or 
                (row - col) in neg_diag):
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

---

## Python Templates

### Template 1: Standard Backtracking (All Solutions)

```python
def solve_n_queens(n: int) -> list[list[str]]:
    """
    Template 1: Solve N-Queens using backtracking with set optimization.
    Returns all solutions as board representations.
    
    Time: O(N!), Space: O(N) for recursion + O(N²) for output
    """
    solutions = []
    
    # Track columns and diagonals under attack
    cols = set()        # columns with queens
    pos_diag = set()    # r + c for positive diagonal
    neg_diag = set()    # r - c for negative diagonal
    
    def backtrack(row: int, board: list[int]) -> None:
        # Base case: all queens placed successfully
        if row == n:
            # Convert to board representation
            solution = []
            for col in board:
                row_str = '.' * col + 'Q' + '.' * (n - col - 1)
                solution.append(row_str)
            solutions.append(solution)
            return
        
        # Try placing queen in each column of current row
        for col in range(n):
            # Calculate diagonal identifiers
            p_diag = row + col
            n_diag = row - col
            
            # Skip if position is under attack
            if (col in cols or 
                p_diag in pos_diag or 
                n_diag in neg_diag):
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
    
    backtrack(0, [])
    return solutions
```

### Template 2: Bitwise Optimization

```python
def solve_n_queens_bitwise(n: int) -> list[list[int]]:
    """
    Template 2: Solve N-Queens using bitwise operations.
    Much faster for larger N.
    
    Time: O(N!), Space: O(N)
    """
    solutions = []
    all_ones = (1 << n) - 1  # n bits set to 1
    
    def backtrack(row: int, cols: int, pos_diag: int, neg_diag: int, 
                  board: list[int]) -> None:
        if row == n:
            solutions.append(board[:])
            return
        
        # Available positions: bits not set in any constraint
        available = all_ones & ~(cols | pos_diag | neg_diag)
        
        while available:
            # Get rightmost available position
            pos = available & (-available)
            available -= pos
            
            col = pos.bit_length() - 1
            board.append(col)
            
            # Recurse with updated constraints
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

### Template 3: Count Solutions Only

```python
def total_n_queens(n: int) -> int:
    """
    Template 3: Return count of solutions without storing them.
    Memory efficient for larger N.
    
    Time: O(N!), Space: O(N)
    """
    count = 0
    cols = set()
    pos_diag = set()
    neg_diag = set()
    
    def backtrack(row: int) -> None:
        nonlocal count
        if row == n:
            count += 1
            return
        
        for col in range(n):
            if (col in cols or 
                (row + col) in pos_diag or 
                (row - col) in neg_diag):
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

### Template 4: Find Single Solution

```python
def solve_n_queens_one(n: int) -> list[int]:
    """
    Template 4: Find just one solution.
    Stops as soon as solution is found.
    
    Time: O(N!) worst case, but typically much faster
    Space: O(N)
    """
    cols = set()
    pos_diag = set()
    neg_diag = set()
    result = []
    
    def backtrack(row: int, board: list[int]) -> bool:
        if row == n:
            result.extend(board)
            return True  # Found solution
        
        for col in range(n):
            if (col in cols or 
                (row + col) in pos_diag or 
                (row - col) in neg_diag):
                continue
            
            cols.add(col)
            pos_diag.add(row + col)
            neg_diag.add(row - col)
            board.append(col)
            
            if backtrack(row + 1, board):
                return True  # Stop further search
            
            cols.remove(col)
            pos_diag.remove(row + col)
            neg_diag.remove(row - col)
            board.pop()
        
        return False
    
    backtrack(0, [])
    return result
```

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

### Why It Achieves O(N!) Complexity

- **Branch Factor**: At row `r`, we try up to `(N - r)` columns
- **Total Combinations**: N × (N-1) × (N-2) × ... × 1 = N!
- **Constraint Checking**: O(1) per position using sets
- **Overhead**: Each successful placement triggers recursion; each failure triggers backtracking

### Limitations

- **Exponential Time**: O(N!) worst case - not feasible for very large N
- **Memory Intensive for All Solutions**: Number of solutions grows exponentially
- **No Polynomial Solution**: This is an NP-complete problem

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

---

### Q2: How does bitwise optimization improve performance?

**Answer:** Bitwise optimization provides significant speedup because:
- Set operations are O(1) but have overhead (hash computation, object creation)
- Bitwise operations are single CPU instructions
- Bit manipulation allows using bit shifts for diagonal tracking
- For N ≤ 32, all state fits in a single 32-bit integer
- Can process multiple positions in parallel with SIMD instructions

---

### Q3: Can N-Queens be solved in polynomial time?

**Answer:** No, N-Queens is NP-Complete, meaning:
- No known polynomial-time algorithm exists
- Solutions grow exponentially (~0.34^N)
- However, there's a mathematical construction for finding ONE solution in O(N²)
- For specific N values, there are known patterns that can be generated directly

---

### Q4: What's the maximum N that can be practically solved?

**Answer:** With standard backtracking:
- N ≤ 15: Fast (sub-second)
- N = 20: Takes several seconds
- N = 25: Takes minutes to hours
- N > 30: Not practical with backtracking

With bitwise + symmetry pruning + distributed computing:
- N up to 50+ has been solved (but huge computational resources needed)

---

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

When NOT to use:
- ❌ Very large N (exponential explosion)
- ❌ When only one solution needed (use mathematical construction instead)
- ❌ When performance is critical (use bitwise optimization)

This algorithm is essential for competitive programming and technical interviews, serving as a gateway to understanding more complex backtracking and combinatorial optimization problems.