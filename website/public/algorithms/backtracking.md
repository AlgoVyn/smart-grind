# Backtracking

## Category
Backtracking

## Description

Backtracking is a powerful algorithmic technique for solving problems that involve exploring all possible configurations or arrangements. It builds solutions incrementally and abandons a partial candidate ("backtracks") as soon as it determines the candidate cannot possibly lead to a valid solution. This systematic approach is essential for constraint satisfaction problems, combinatorial optimization, and puzzles like N-Queens, Sudoku, and maze solving.

The key insight behind backtracking is that it treats the solution space as a tree where each node represents a partial solution. By exploring this tree depth-first and pruning branches that violate constraints, backtracking efficiently finds valid solutions without exhaustive enumeration. This makes it ideal for problems where the solution requires making a sequence of choices, each of which depends on previous choices.

---

## Concepts

The backtracking technique is built on several fundamental concepts that make it effective for combinatorial problems.

### 1. State Space Tree

Backtracking visualizes the problem as a tree where:
- **Root**: Empty starting state
- **Nodes**: Partial solutions
- **Edges**: Choices that extend the partial solution
- **Leaves**: Complete solutions or dead ends

| Component | Description | Example |
|-----------|-------------|---------|
| **Root** | Empty initial state | `[]` |
| **Internal Nodes** | Partial configurations | `[1, 2]` in permutation |
| **Leaves** | Complete or invalid solutions | `[1, 2, 3]` or failure |
| **Branches** | Available choices at each step | Include/exclude element |

### 2. The Three Core Operations

Every backtracking algorithm performs three fundamental operations:

```
1. CHOOSE: Make a choice from available options
2. EXPLORE: Recurse to build on the current choice
3. UNDO (Backtrack): Remove the choice and try next option
```

This pattern ensures all possibilities are explored systematically.

### 3. Constraint Checking

Constraints determine whether a partial solution can lead to a valid complete solution:

- **Explicit Constraints**: Rules that must be satisfied (e.g., no two queens attacking)
- **Implicit Constraints**: Derived from problem structure (e.g., each row has one queen)
- **Pruning Condition**: Test that eliminates dead branches early

| Constraint Type | When to Check | Action if Violated |
|----------------|---------------|-------------------|
| **Hard** | Before recursion | Skip this branch entirely |
| **Soft** | After partial build | Continue but track violation |
| **Completion** | At leaf node | Accept or reject solution |

### 4. Recursion Depth

The recursion depth equals the number of decisions needed:

- **Shallow (≤10)**: All solutions easily found
- **Moderate (10-20)**: May need pruning optimizations
- **Deep (>20)**: Often requires heuristics or constraint propagation

---

## Frameworks

Structured approaches for solving backtracking problems.

### Framework 1: Standard Backtracking Template

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARD BACKTRACKING FRAMEWORK                              │
├─────────────────────────────────────────────────────────────┤
│  1. Define recursive function with state parameters          │
│     - Current position/index                                 │
│     - Path/current solution being built                      │
│     - Additional state (visited, constraints)                │
│                                                              │
│  2. Base Case:                                               │
│     - If solution complete: process/add to results           │
│     - If invalid: return (prune)                             │
│                                                              │
│  3. Recursive Case:                                          │
│     - For each available choice:                             │
│       a. Make the choice (update state)                      │
│       b. Recurse to next position                            │
│       c. Undo the choice (backtrack)                         │
│                                                              │
│  4. Return results collected during recursion                │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: General backtracking problems (permutations, subsets, combinations).

### Framework 2: Constraint Satisfaction Template

```
┌─────────────────────────────────────────────────────────────┐
│  CONSTRAINT SATISFACTION FRAMEWORK                            │
├─────────────────────────────────────────────────────────────┤
│  1. Initialize constraint tracking structures                │
│     - Sets for occupied positions                            │
│     - Maps for resource allocation                           │
│     - Arrays for state flags                                   │
│                                                              │
│  2. At each decision point:                                  │
│     - Check all constraints before placing                   │
│     - If valid: place and mark constraints                  │
│     - Recurse to next position                               │
│     - Unmark constraints (backtrack)                        │
│                                                              │
│  3. Optimization: Order decisions by most constrained        │
│     - Fail faster on invalid branches                        │
│     - Reduces search space significantly                     │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: N-Queens, Sudoku, scheduling problems with constraints.

### Framework 3: Subset Generation Template

```
┌─────────────────────────────────────────────────────────────┐
│  SUBSET/POWER SET FRAMEWORK                                   │
├─────────────────────────────────────────────────────────────┤
│  1. At each element position, make two choices:              │
│     - INCLUDE: Add element to current subset                │
│     - EXCLUDE: Skip element, move to next                   │
│                                                              │
│  2. Base case: All elements processed                        │
│     - Add current subset to results                         │
│                                                              │
│  3. Key insight: Each element has binary choice                │
│     - Produces 2^n subsets for n elements                   │
│     - Natural fit for backtracking structure                │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Subset generation, combination sum, power set problems.

---

## Forms

Different manifestations of the backtracking pattern.

### Form 1: Permutation Generation

Generate all possible orderings of elements.

| Approach | Key Mechanism | Time Complexity |
|----------|--------------|----------------|
| **Swap-based** | Swap elements in place | O(n! × n) |
| **Used-array** | Track used elements explicitly | O(n! × n) |
| **Next-permutation** | Iterative lexicographic | O(n!) |

### Form 2: Combination Generation

Generate all k-element selections from n elements.

| Approach | Key Mechanism | Time Complexity |
|----------|--------------|----------------|
| **Standard** | Choose start to n-1, recurse with i+1 | O(C(n,k) × k) |
| **With Pruning** | Skip when not enough elements left | O(C(n,k) × k) |
| **Iterative** | Build combinations incrementally | O(C(n,k) × k) |

**Key difference from permutations**: Order doesn't matter, use `start` index instead of `used` array.

### Form 3: Subset Generation (Power Set)

Generate all possible subsets.

```
For each element:
    Option 1: Include in current subset → Recurse
    Option 2: Exclude from subset → Recurse

Result: 2^n subsets total
```

**Variations**:
- Subsets with duplicates (skip duplicates at same level)
- Subsets of specific size (prune when size reached)
- Subsets with sum constraint (prune when sum exceeded)

### Form 4: Constraint Satisfaction

Find configurations satisfying multiple constraints.

```
N-Queens Example:
├── Row 0: Try columns 0 to n-1
│   ├── If column safe: place queen, mark constraints
│   │   └── Recurse to Row 1
│   └── Backtrack: unmark constraints
├── Row 1: Try remaining safe columns
└── Continue until all rows placed or dead end
```

### Form 5: Path Finding in Grid/Graph

Explore paths with backtracking for obstacles/visited nodes.

| Problem | Constraint | Backtracking Action |
|---------|-----------|---------------------|
| **Word Search** | Character must match | Return if mismatch |
| **Maze** | Wall/block encountered | Return if blocked |
| **Rat in Maze** | Out of bounds | Return if invalid position |

---

## Tactics

Specific techniques and optimizations for backtracking.

### Tactic 1: Pruning (Branch Elimination)

Eliminate branches that cannot lead to valid solutions:

```python
def backtrack_with_pruning(nums, start, path, target):
    # Prune: if current sum already exceeds target
    if sum(path) > target:
        return  # Dead branch, backtrack immediately
    
    # Prune: not enough elements remaining
    if len(nums) - start < needed_elements:
        return
    
    # Normal backtracking continues...
```

**Common Pruning Conditions**:
- Sum exceeds target (combination sum)
- Not enough elements remaining to complete
- Current path violates constraints
- Better solution already found (optimization)

### Tactic 2: Handling Duplicates

When input contains duplicates, avoid duplicate results:

```python
def backtrack_with_duplicates(nums, start, path):
    nums.sort()  # Sort to group duplicates
    
    for i in range(start, len(nums)):
        # Skip duplicates: only use first occurrence at this level
        if i > start and nums[i] == nums[i - 1]:
            continue
        
        path.append(nums[i])
        backtrack(nums, i + 1, path)
        path.pop()
```

### Tactic 3: Ordering by Most Constrained

Order choices to fail faster:

```python
def solve_sudoku(board):
    # Find cell with fewest valid options (most constrained)
    row, col = find_most_constrained_cell(board)
    
    for num in get_valid_numbers(board, row, col):
        board[row][col] = num
        if solve_sudoku(board):
            return True
        board[row][col] = '.'  # Backtrack
    
    return False
```

### Tactic 4: Early Exit (First Solution Only)

Stop when first valid solution found:

```python
def backtrack_early_exit(nums, path):
    if is_solution(path):
        return True  # Signal success up the call stack
    
    for choice in available_choices:
        path.append(choice)
        if backtrack_early_exit(nums, path):  # Check return value
            return True  # Propagate success
        path.pop()
    
    return False  # No solution found in this branch
```

### Tactic 5: State Caching (Memoization)

Cache results to avoid recomputation:

```python
from functools import lru_cache

@lru_cache(maxsize=None)
def backtrack_with_memo(state_key):
    if is_base_case(state_key):
        return result
    
    total = 0
    for next_state in get_transitions(state_key):
        total += backtrack_with_memo(next_state)
    
    return total
```

### Tactic 6: Iterative Deepening

Control recursion depth for optimization:

```python
def iterative_deepening_backtrack(max_depth):
    for depth in range(1, max_depth + 1):
        result = backtrack_limited(0, [], depth)
        if result:
            return result
    return None
```

### Tactic 7: Bitmask State Representation

Use bitmasks for efficient state tracking:

```python
def backtrack_with_bitmask(n, row, cols, diagonals):
    if row == n:
        return 1  # Found valid configuration
    
    count = 0
    available = ((1 << n) - 1) & ~(cols | diagonals)
    
    while available:
        pos = available & -available  # Get rightmost bit
        available -= pos
        count += backtrack_with_bitmask(
            n, row + 1,
            cols | pos,
            (diagonals | pos) << 1
        )
    
    return count
```

### Tactic 8: Symmetry Reduction

Exploit problem symmetry to reduce search space:

```python
def n_queens_symmetry_optimized(n):
    solutions = []
    
    # Only search first half of first row (symmetry)
    for col in range(n // 2):
        backtrack(0, col, ...)
    
    # Mirror solutions for second half
    solutions += [mirror(s) for s in solutions]
    
    # Handle odd n middle column separately
    if n % 2 == 1:
        backtrack(0, n // 2, ...)
    
    return solutions
```

---

## Python Templates

### Template 1: Standard Backtracking (Subsets)

```python
def subsets(nums: list[int]) -> list[list[int]]:
    """
    Template for generating all subsets (power set).
    Each element: include or exclude.
    """
    result = []
    
    def backtrack(start: int, path: list[int]):
        # Add current subset (copy to avoid reference issues)
        result.append(path[:])
        
        # Try including each remaining element
        for i in range(start, len(nums)):
            path.append(nums[i])
            backtrack(i + 1, path)
            path.pop()  # Backtrack
    
    backtrack(0, [])
    return result
```

### Template 2: Permutations (Used Array)

```python
def permutations(nums: list[int]) -> list[list[int]]:
    """
    Template for generating all permutations.
    Tracks used elements to avoid repetition.
    """
    result = []
    n = len(nums)
    used = [False] * n
    
    def backtrack(path: list[int]):
        if len(path) == n:
            result.append(path[:])
            return
        
        for i in range(n):
            if not used[i]:
                used[i] = True
                path.append(nums[i])
                backtrack(path)
                path.pop()
                used[i] = False
    
    backtrack([])
    return result
```

### Template 3: Combinations (n choose k)

```python
def combine(n: int, k: int) -> list[list[int]]:
    """
    Template for generating k-combinations from 1 to n.
    Uses start index to maintain order and avoid duplicates.
    """
    result = []
    
    def backtrack(start: int, path: list[int]):
        if len(path) == k:
            result.append(path[:])
            return
        
        # Pruning: not enough elements remaining
        for i in range(start, n + 1):
            if n - i + 1 < k - len(path):
                break
            
            path.append(i)
            backtrack(i + 1, path)
            path.pop()
    
    backtrack(1, [])
    return result
```

### Template 4: Combination Sum

```python
def combination_sum(candidates: list[int], target: int) -> list[list[int]]:
    """
    Template for finding combinations that sum to target.
    Elements can be reused (use i, not i+1 in recursion).
    """
    result = []
    candidates.sort()  # Sort for pruning
    
    def backtrack(start: int, remaining: int, path: list[int]):
        if remaining == 0:
            result.append(path[:])
            return
        
        for i in range(start, len(candidates)):
            # Pruning: skip if too large
            if candidates[i] > remaining:
                break
            
            path.append(candidates[i])
            # Use i (not i+1) to allow reuse of same element
            backtrack(i, remaining - candidates[i], path)
            path.pop()
    
    backtrack(0, target, [])
    return result
```

### Template 5: N-Queens (Constraint Satisfaction)

```python
def solve_n_queens(n: int) -> list[list[str]]:
    """
    Template for N-Queens constraint satisfaction.
    Uses sets to track occupied columns and diagonals.
    """
    solutions = []
    cols = set()
    pos_diag = set()  # row + col (positive diagonal)
    neg_diag = set()  # row - col (negative diagonal)
    
    def backtrack(row: int, board: list[int]):
        if row == n:
            # Convert to board representation
            solution = []
            for col in board:
                row_str = '.' * col + 'Q' + '.' * (n - col - 1)
                solution.append(row_str)
            solutions.append(solution)
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
            
            # Remove queen (backtrack)
            cols.remove(col)
            pos_diag.remove(row + col)
            neg_diag.remove(row - col)
            board.pop()
    
    backtrack(0, [])
    return solutions
```

### Template 6: Word Search (Grid Backtracking)

```python
def exist(board: list[list[str]], word: str) -> bool:
    """
    Template for grid-based backtracking (word search).
    Uses visited set to track current path.
    """
    rows, cols = len(board), len(board[0])
    
    def backtrack(r: int, c: int, index: int) -> bool:
        # Base case: found entire word
        if index == len(word):
            return True
        
        # Check bounds and match
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            board[r][c] != word[index]):
            return False
        
        # Mark as visited
        temp = board[r][c]
        board[r][c] = '#'  # Mark visited
        
        # Explore all 4 directions
        found = (backtrack(r + 1, c, index + 1) or
                 backtrack(r - 1, c, index + 1) or
                 backtrack(r, c + 1, index + 1) or
                 backtrack(r, c - 1, index + 1))
        
        # Backtrack: restore cell
        board[r][c] = temp
        return found
    
    for r in range(rows):
        for c in range(cols):
            if backtrack(r, c, 0):
                return True
    return False
```

### Template 7: Permutations with Duplicates

```python
def permute_unique(nums: list[int]) -> list[list[int]]:
    """
    Template for permutations with duplicate handling.
    Sorts first, then skips duplicates at same recursion level.
    """
    result = []
    nums.sort()  # Sort to group duplicates
    n = len(nums)
    used = [False] * n
    
    def backtrack(path: list[int]):
        if len(path) == n:
            result.append(path[:])
            return
        
        for i in range(n):
            if used[i]:
                continue
            # Skip duplicates: only use first occurrence at this level
            if i > 0 and nums[i] == nums[i - 1] and not used[i - 1]:
                continue
            
            used[i] = True
            path.append(nums[i])
            backtrack(path)
            path.pop()
            used[i] = False
    
    backtrack([])
    return result
```

---

## When to Use

Use the Backtracking algorithm when you need to solve problems involving:

- **Combinatorial Enumeration**: Generating all permutations, combinations, or subsets
- **Constraint Satisfaction**: Finding configurations that satisfy multiple rules (N-Queens, Sudoku)
- **Path Finding**: Exploring paths in grids or graphs with constraints
- **Decision Tree Problems**: Sequential choices where each depends on previous

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Best Use Case |
|----------|----------------|-------------------|---------------|
| **Backtracking** | O(branch^depth) | O(depth) | Constraint satisfaction, all solutions needed |
| **Dynamic Programming** | O(states) | O(states) | Overlapping subproblems, optimal substructure |
| **Greedy** | O(n log n) or O(n) | O(1) or O(n) | Local optimal leads to global optimal |
| **BFS/DFS** | O(V + E) | O(V) | Graph traversal, shortest path |
| **Iterative** | Same as recursive | O(1) aux | When recursion depth concerns |

### When to Choose Backtracking vs Other Approaches

- **Choose Backtracking** when:
  - You need ALL valid solutions, not just one
  - Problem involves making sequential choices with constraints
  - Solution space is exponential but searchable
  - Constraints can prune search space effectively

- **Choose Dynamic Programming** when:
  - Problem has overlapping subproblems
  - You need optimal solution (minimum/maximum)
  - State space is manageable

- **Choose Greedy** when:
  - Problem has optimal substructure with greedy choice property
  - You need an approximate solution quickly

---

## Algorithm Explanation

### Core Concept

Backtracking is essentially a depth-first search (DFS) over the solution space with early termination (pruning) of invalid branches. The key insight is that it builds candidates incrementally and abandons a candidate immediately when it determines the candidate cannot possibly be completed to a valid solution.

### How It Works

1. **Choose**: Select an option from available choices
2. **Constraint Check**: Verify if choice is valid in current context
3. **Recurse**: If valid, proceed to next decision level
4. **Base Case**: When complete solution found, process it
5. **Backtrack**: Undo choice and try next option

### Visual Representation

For generating subsets of `[1, 2, 3]`:

```
                        []
                   /           \
                [1]             []
              /    \          /    \
          [1,2]    [1]      [2]    []
          /  \     /  \     /  \   / \
      [1,2,3][1,2][1,3][1][2,3][2][3] []
```

Each leaf represents a complete subset. The algorithm visits each node exactly once.

### Why It Works

- **Completeness**: Explores all possible valid configurations
- **Correctness**: Only valid solutions are returned
- **Efficiency**: Pruning eliminates impossible branches early
- **Simplicity**: Recursive structure mirrors problem structure

### Limitations

- **Exponential Time**: Worst case explores entire solution space
- **Stack Overflow Risk**: Deep recursion can exceed stack limits
- **Not Suitable for Large N**: n > 20 often impractical without pruning
- **Redundant Work**: Without memoization, may recompute same states

---

## Practice Problems

### Problem 1: Subsets

**Problem:** [LeetCode 78 - Subsets](https://leetcode.com/problems/subsets/)

**Description:** Given an integer array `nums` of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets.

**How to Apply Backtracking:**
- Use standard subset template: include/exclude each element
- Add copy of current path at each node (not just leaves)
- Time: O(n × 2^n), Space: O(n)

---

### Problem 2: Permutations

**Problem:** [LeetCode 46 - Permutations](https://leetcode.com/problems/permutations/)

**Description:** Given an array of distinct integers, return all possible permutations.

**How to Apply Backtracking:**
- Use `used` array to track which elements are in current permutation
- When path length equals n, add to results
- Time: O(n! × n), Space: O(n)

---

### Problem 3: Combination Sum

**Problem:** [LeetCode 39 - Combination Sum](https://leetcode.com/problems/combination-sum/)

**Description:** Given an array of distinct integers `candidates` and a target integer `target`, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may use the same number unlimited times.

**How to Apply Backtracking:**
- Sort candidates for pruning (if candidate > remaining, break)
- Use index i (not i+1) to allow reuse of same element
- Prune when sum exceeds target
- Time: O(target/min_candidate), Space: O(target/min_candidate)

---

### Problem 4: N-Queens

**Problem:** [LeetCode 51 - N-Queens](https://leetcode.com/problems/n-queens/)

**Description:** The n-queens puzzle is the problem of placing n queens on an n×n chessboard such that no two queens attack each other. Return all distinct solutions.

**How to Apply Backtracking:**
- Place queens row by row (one per row)
- Track columns and diagonals using sets
- Check safety before placing, backtrack after recursion
- Time: O(N!), Space: O(N)

---

### Problem 5: Word Search

**Problem:** [LeetCode 79 - Word Search](https://leetcode.com/problems/word-search/)

**Description:** Given an m x n grid of characters and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells (horizontally or vertically).

**How to Apply Backtracking:**
- Start DFS from each cell matching word[0]
- Mark visited cells during exploration
- Backtrack (unmark) after recursion returns
- Prune when current cell doesn't match word[index]
- Time: O(m × n × 4^L) where L is word length, Space: O(L)

---

## Video Tutorial Links

### Fundamentals

- [Backtracking Introduction (NeetCode)](https://www.youtube.com/watch?v=Z3QV4Tm3g7I) - Complete backtracking guide
- [Backtracking Algorithm Pattern (Take U Forward)](https://www.youtube.com/watch?v=DKC2sStG3-U) - Deep dive into backtracking
- [Recursion and Backtracking (WilliamFiset)](https://www.youtube.com/watch?v=21NDeD3iMpp) - Core concepts explained

### Problem-Specific

- [N-Queens Backtracking (NeetCode)](https://www.youtube.com/watch?v=Ph1R6X6XgJM) - Classic constraint satisfaction
- [Combination Sum Backtracking](https://www.youtube.com/watch?v=GBKI9VSKdGg) - Sum problems
- [Subsets and Permutations (Tech With Nikola)](https://www.youtube.com/watch?v=77N5K-8hpfM) - Combinatorial patterns
- [Word Search Backtracking](https://www.youtube.com/watch?v=m9TrOLFNt-A) - Grid-based problems

### Advanced Topics

- [Pruning Techniques in Backtracking](https://www.youtube.com/watch?v=Zq4upTEaIog) - Optimization strategies
- [Bitmask Backtracking](https://www.youtube.com/watch?v=m9TrOLFNt-A) - Efficient state representation
- [Handling Duplicates in Backtracking](https://www.youtube.com/watch?v=0OghtN5M6lc) - Avoid duplicate results

---

## Follow-up Questions

### Q1: What is the difference between backtracking and simple recursion?

**Answer:** While both use recursion, backtracking specifically:
- **Explores decision trees** systematically
- **Undoes choices** (backtracks) to try alternatives
- **Prunes invalid branches** early
- **Finds all valid solutions** rather than just one

Simple recursion may compute a value or traverse without the "undo and try next" pattern.

### Q2: How do you avoid stack overflow in deep backtracking?

**Answer:** Several strategies:
1. **Increase recursion limit** (Python: `sys.setrecursionlimit()`)
2. **Convert to iterative** using explicit stack
3. **Use tail recursion** where possible
4. **Prune more aggressively** to reduce depth
5. **Use memoization** to avoid redundant deep calls

### Q3: When should I use backtracking vs dynamic programming?

**Answer:**

| Aspect | Backtracking | Dynamic Programming |
|--------|--------------|---------------------|
| **Subproblems** | Independent, no overlap | Overlapping |
| **Goal** | Find all/count valid solutions | Find optimal value |
| **State** | Current path + choices | DP table state |
| **Time** | Exponential | Polynomial |

Use backtracking when you need to enumerate possibilities; use DP when you need optimal solutions with overlapping subproblems.

### Q4: How do you handle time limit exceeded (TLE) in backtracking problems?

**Answer:** Optimization strategies:
1. **Pruning**: Add constraints to cut branches early
2. **Ordering**: Try most constrained choices first
3. **Memoization**: Cache states you've already computed
4. **Bitmask optimization**: Use integers instead of sets
5. **Symmetry reduction**: Don't explore symmetric equivalent states
6. **Early termination**: Stop if you found a good enough solution

### Q5: Can all backtracking problems be solved iteratively?

**Answer:** Yes, using an explicit stack:

```python
def iterative_backtrack():
    stack = [(initial_state, [])]
    results = []
    
    while stack:
        state, path = stack.pop()
        
        if is_solution(state):
            results.append(path)
            continue
        
        for choice in get_choices(state):
            new_state = apply_choice(state, choice)
            if is_valid(new_state):
                stack.append((new_state, path + [choice]))
    
    return results
```

The recursive version is usually clearer, but iterative avoids stack overflow for deep problems.

---

## Summary

The Backtracking algorithm is a fundamental technique for solving constraint satisfaction and combinatorial enumeration problems. Key takeaways:

- **Choose-Explore-Undo Pattern**: Core of every backtracking solution
- **State Space Tree**: Visualize as tree traversal with pruning
- **Pruning is Essential**: Early elimination of invalid branches
- **Exponential Complexity**: O(branch^depth) but often manageable with constraints
- **Recursion Depth**: Limited by stack size; convert to iterative if needed

When to use:
- ✅ Enumerating all permutations, combinations, subsets
- ✅ Constraint satisfaction (N-Queens, Sudoku)
- ✅ Path finding with constraints
- ✅ Problems requiring all valid solutions
- ❌ Very large search spaces without effective pruning
- ❌ Problems with polynomial-time solutions available
- ❌ When only one solution needed and mathematical construction exists

Master backtracking as it forms the foundation for solving many interview problems involving exploration and constraint satisfaction.
