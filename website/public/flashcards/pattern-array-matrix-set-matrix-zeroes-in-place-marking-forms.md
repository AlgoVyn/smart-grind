## Array/Matrix - Set Matrix Zeroes: Forms

What are the different forms and variations of matrix zeroing problems?

<!-- front -->

---

### Problem Variations

| Variation | Constraint | Approach | Complexity |
|-----------|------------|----------|------------|
| **LeetCode 73** | O(1) extra space | In-place marking | O(m×n) time, O(1) space |
| **Game of Life** | In-place state transition | State encoding | O(m×n) time, O(1) space |
| **Bomb Enemy** | Max enemies killed | DP / prefix sums | O(m×n) time, O(m×n) space |
| **Valid Sudoku** | Check valid board | Hash set tracking | O(1) time per check, O(1) space |
| **Lonely Pixel** | Find unique black pixels | Row/col counting | O(m×n) time, O(m+n) space |

---

### Form 1: Basic Set Matrix Zeroes (LeetCode 73)

```python
def set_zeroes(matrix):
    """
    Standard in-place marking with O(1) space.
    """
    if not matrix or not matrix[0]:
        return
    
    m, n = len(matrix), len(matrix[0])
    first_row_zero = any(matrix[0][j] == 0 for j in range(n))
    first_col_zero = any(matrix[i][0] == 0 for i in range(m))
    
    # Mark zeros in first row/col
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = 0
                matrix[0][j] = 0
    
    # Apply zeros
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0
    
    # Handle first row/col
    if first_row_zero:
        for j in range(n):
            matrix[0][j] = 0
    if first_col_zero:
        for i in range(m):
            matrix[i][0] = 0
```

---

### Form 2: O(m+n) Space (Simpler Implementation)

```python
def set_zeroes_simple(matrix):
    """
    Simpler approach using O(m+n) space.
    Better for understanding, not optimal for space.
    """
    if not matrix or not matrix[0]:
        return
    
    m, n = len(matrix), len(matrix[0])
    rows = set()  # Rows to zero
    cols = set()  # Columns to zero
    
    # Find all zeros
    for i in range(m):
        for j in range(n):
            if matrix[i][j] == 0:
                rows.add(i)
                cols.add(j)
    
    # Zero marked rows and columns
    for i in range(m):
        for j in range(n):
            if i in rows or j in cols:
                matrix[i][j] = 0
```

---

### Form 3: Game of Life (State Encoding)

```python
def game_of_life(board):
    """
    LeetCode 289: In-place with state encoding.
    0→0 (dead), 1→1 (live), 0→2 (dead→live), 1→3 (live→dead)
    """
    m, n = len(board), len(board[0])
    directions = [(-1,-1), (-1,0), (-1,1), (0,-1), (0,1), (1,-1), (1,0), (1,1)]
    
    def count_live(board, i, j):
        count = 0
        for di, dj in directions:
            ni, nj = i + di, j + dj
            if 0 <= ni < m and 0 <= nj < n and board[ni][nj] % 2 == 1:
                count += 1
        return count
    
    # Encode next state
    for i in range(m):
        for j in range(n):
            live = count_live(board, i, j)
            if board[i][j] == 1 and (live < 2 or live > 3):
                board[i][j] = 3  # Live → Dead
            elif board[i][j] == 0 and live == 3:
                board[i][j] = 2  # Dead → Live
    
    # Decode
    for i in range(m):
        for j in range(n):
            if board[i][j] == 2:
                board[i][j] = 1
            elif board[i][j] == 3:
                board[i][j] = 0
```

---

### Form 4: Surrounded Regions (Borders)

```python
def solve(board):
    """
    LeetCode 130: Flip surrounded regions.
    Mark border-connected 'O's, flip rest.
    """
    if not board or not board[0]:
        return
    
    m, n = len(board), len(board[0])
    
    def dfs(i, j):
        if i < 0 or i >= m or j < 0 or j >= n or board[i][j] != 'O':
            return
        board[i][j] = 'T'  # Mark as border-connected
        dfs(i+1, j)
        dfs(i-1, j)
        dfs(i, j+1)
        dfs(i, j-1)
    
    # Mark border-connected regions
    for i in range(m):
        dfs(i, 0)
        dfs(i, n-1)
    for j in range(n):
        dfs(0, j)
        dfs(m-1, j)
    
    # Flip: surrounded 'O' → 'X', marked 'T' → 'O'
    for i in range(m):
        for j in range(n):
            if board[i][j] == 'O':
                board[i][j] = 'X'
            elif board[i][j] == 'T':
                board[i][j] = 'O'
```

---

### Form 5: Matrix Rotation (Related Pattern)

```python
def rotate(matrix):
    """
    LeetCode 48: Rotate image 90 degrees clockwise.
    Another in-place matrix manipulation.
    """
    n = len(matrix)
    
    # Transpose
    for i in range(n):
        for j in range(i+1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    
    # Reverse each row
    for i in range(n):
        matrix[i].reverse()
```

---

### Decision Flowchart

```
Read problem statement
│
├─ "Set matrix zeroes" + "O(1) space"
│   └─→ Use: First row/col marking (Form 1)
│
├─ "Game of Life" / "state transition"
│   └─→ Use: State encoding with values 0,1,2,3 (Form 3)
│
├─ "Surrounded regions" / "flip O's surrounded by X's"
│   └─→ Use: DFS/BFS from borders + mark (Form 4)
│
├─ "Rotate image" / "transpose + reverse"
│   └─→ Use: Transpose then reverse rows (Form 5)
│
└─ General matrix marking
    ├─ Space constrained?
    │   └─→ Use: In-place marking
    └─ Space not constrained?
        └─→ Use: Extra arrays (simpler)
```

---

### Quick Reference Table

| LeetCode | Problem | Pattern | Key Insight |
|----------|---------|---------|-------------|
| 73 | Set Matrix Zeroes | In-place marking | Use first row/col as markers |
| 289 | Game of Life | State encoding | Encode next state in bits |
| 130 | Surrounded Regions | Border DFS | Unconnected regions flip |
| 48 | Rotate Image | Transpose+reverse | 90° rotation in-place |
| 54 | Spiral Matrix | Boundary tracking | Shrink boundaries |
| 361 | Bomb Enemy | Prefix sums | Max kills per position |

<!-- back -->
