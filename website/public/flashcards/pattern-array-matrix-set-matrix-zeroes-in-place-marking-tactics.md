## Array/Matrix - Set Matrix Zeroes: Tactics

What are practical tactics for solving matrix zeroing problems?

<!-- front -->

---

### Tactic 1: Visualize the Marking Process

**Draw the matrix to track markers:**

```
Original Matrix:
┌─────┬─────┬─────┬─────┐
│  1  │  2  │  0  │  4  │  ← has zero, set first_row_zero = True
├─────┼─────┼─────┼─────┤
│  5  │  6  │  7  │  8  │
├─────┼─────┼─────┼─────┤
│  9  │  0  │  1  │  2  │  ← has zero at col 1
├─────┼─────┼─────┼─────┤
│  3  │  4  │  5  │  6  │
└─────┴─────┴─────┴─────┘

After Marking Phase:
┌─────┬─────┬─────┬─────┐
│  1  │  0  │  0  │  4  │  ← col markers: j=1, j=2 will be zeroed
├─────┼─────┼─────┼─────┤
│  5  │  6  │  7  │  8  │
├─────┼─────┼─────┼─────┤
│  0  │  0  │  1  │  2  │  ← row marker: i=2 will be zeroed
├─────┼─────┼─────┼─────┤
│  3  │  4  │  5  │  6  │
└─────┴─────┴─────┴─────┘
        ↑
     first_col_zero = True (found 0 at row 2, col 1)
```

---

### Tactic 2: Code Template Selector

**Quick classification based on constraints:**

```python
def classify_matrix_zero_problem(constraints):
    """
    Determine which matrix zero pattern to use.
    """
    keywords = {
        'O(1) space': 'in_place_marking',
        'in-place': 'in_place_marking',
        'constant space': 'in_place_marking',
        'space O(1)': 'in_place_marking',
        'without extra space': 'in_place_marking',
    }
    
    for keyword, pattern in keywords.items():
        if keyword in constraints.lower():
            return pattern
    
    # Default: simpler O(m+n) solution
    return 'extra_arrays'
```

| Keyword | Approach | Time | Space |
|---------|----------|------|-------|
| "O(1) space" / "in-place" | First row/col marking | O(m×n) | O(1) |
| No space constraint | Extra arrays | O(m×n) | O(m+n) |
| "cannot modify input" | Copy + tracking | O(m×n) | O(m×n) |

---

### Tactic 3: Debugging with State Prints

**Add trace statements to understand the flow:**

```python
def set_zeroes_debug(matrix):
    """Debug version with detailed tracing."""
    if not matrix or not matrix[0]:
        return
    
    m, n = len(matrix), len(matrix[0])
    
    # Step 1: Check first row
    first_row_zero = any(matrix[0][j] == 0 for j in range(n))
    print(f"Step 1 - First row has zero: {first_row_zero}")
    
    # Step 2: Check first column
    first_col_zero = any(matrix[i][0] == 0 for i in range(m))
    print(f"Step 2 - First col has zero: {first_col_zero}")
    
    # Step 3: Mark zeros
    print("Step 3 - Marking phase:")
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = 0
                matrix[0][j] = 0
                print(f"  Found zero at ({i},{j}), marked row {i} and col {j}")
    
    # Step 4: Apply zeros
    print("Step 4 - Applying zeros:")
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                print(f"  Zeroing ({i},{j}): row marker={matrix[i][0]}, col marker={matrix[0][j]}")
                matrix[i][j] = 0
    
    # Step 5: Handle first row/col
    print("Step 5 - Final cleanup:")
    if first_row_zero:
        print("  Zeroing first row")
        for j in range(n):
            matrix[0][j] = 0
    if first_col_zero:
        print("  Zeroing first column")
        for i in range(m):
            matrix[i][0] = 0
```

---

### Tactic 4: Edge Case Checklist

**Critical edge cases to test:**

| Case | Input | Expected | Why Important |
|------|-------|----------|---------------|
| Single element | `[[0]]` | `[[0]]` | Smallest matrix |
| Single row | `[[1,0,3]]` | `[[0,0,0]]` | First row zero handling |
| Single column | `[[1],[0],[3]]` | `[[0],[0],[0]]` | First col zero handling |
| No zeros | `[[1,2],[3,4]]` | `[[1,2],[3,4]]` | No change needed |
| All zeros | `[[0,0],[0,0]]` | `[[0,0],[0,0]]` | Already all zero |
| Zero at (0,0) | `[[0,2],[3,4]]` | `[[0,0],[0,4]]` | Both flags triggered |

---

### Tactic 5: Alternative: Using First Cell Encoding

**Variation: Use first row only with encoded states:**

```python
def set_zeroes_encoded(matrix):
    """
    Alternative: Use encoding to avoid boolean flags.
    Encode: -1 = will be zeroed, original value otherwise.
    Note: Only works if matrix values are non-negative.
    """
    if not matrix or not matrix[0]:
        return
    
    m, n = len(matrix), len(matrix[0])
    
    # Check if first row/col need zeroing
    first_row_has_zero = 0 in matrix[0]
    first_col_has_zero = any(matrix[i][0] == 0 for i in range(m))
    
    # Mark with special value (if allowed)
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = -1 if matrix[i][0] != 0 else 0
                matrix[0][j] = -1 if matrix[0][j] != 0 else 0
    
    # Apply based on markers
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0] == -1 or matrix[0][j] == -1:
                matrix[i][j] = 0
    
    # Handle first row/col
    if first_row_has_zero:
        for j in range(n):
            matrix[0][j] = 0
    if first_col_has_zero:
        for i in range(m):
            matrix[i][0] = 0
```

---

### Tactic 6: Related Problem Adaptation

**Apply same marking pattern to similar problems:**

```python
def game_of_life(board):
    """
    LeetCode 289: Use state encoding for in-place.
    0 → 0 (dead stays dead)
    1 → 1 (live stays live)
    0 → 2 (dead becomes live)
    1 → 3 (live becomes dead)
    
    Similar idea: encode next state in-place.
    """
    m, n = len(board), len(board[0])
    
    # First pass: encode next state
    for i in range(m):
        for j in range(n):
            live_neighbors = count_live_neighbors(board, i, j)
            if board[i][j] == 1 and (live_neighbors < 2 or live_neighbors > 3):
                board[i][j] = 3  # Live → Dead
            elif board[i][j] == 0 and live_neighbors == 3:
                board[i][j] = 2  # Dead → Live
    
    # Second pass: decode
    for i in range(m):
        for j in range(n):
            if board[i][j] == 2:
                board[i][j] = 1
            elif board[i][j] == 3:
                board[i][j] = 0
```

<!-- back -->
