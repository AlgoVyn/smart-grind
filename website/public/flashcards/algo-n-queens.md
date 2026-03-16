## N-Queens Problem

**Question:** How do you place n queens on an n×n board so no two attack each other?

<!-- front -->

---

## Answer: Backtracking with Sets

### Solution
```python
def solveNQueens(n):
    result = []
    cols = set()
    posDiag = set()  # r + c
    negDiag = set()  # r - c
    
    board = [['.' for _ in range(n)] for _ in range(n)]
    
    def backtrack(row):
        if row == n:
            result.append([''.join(row) for row in board])
            return
        
        for col in range(n):
            if col in cols or (row + col) in posDiag or (row - col) in negDiag:
                continue
            
            # Place queen
            board[row][col] = 'Q'
            cols.add(col)
            posDiag.add(row + col)
            negDiag.add(row - col)
            
            backtrack(row + 1)
            
            # Remove queen
            board[row][col] = '.'
            cols.remove(col)
            posDiag.remove(row + col)
            negDiag.remove(row - col)
    
    backtrack(0)
    return result
```

### Visual: Placement Process (n=4)
```
Row 0: Try col 0 → Q . . .
Row 1: Try col 1 → Q . . .
                    . Q . .
        Conflict! Try col 2
Row 1: Try col 2 → Q . . .
                    . . Q .
Row 2: Try col 1 → Q . . .
                    . . Q .
                    . Q . .
        Conflict! Try col 3
Row 2: Try col 3 → Q . . .
                    . . Q .
                    . . . Q
Row 3: No valid columns! Backtrack
...

Solution: . Q . .
          . . . Q
          Q . . .
          . . Q .
```

### ⚠️ Tricky Parts

#### 1. Why Diagonal Sets Work
```python
# Main diagonal (↘): r - c is constant
# 0,0 → 0    1,1 → 0    2,2 → 0
# Anti-diagonal (↙): r + c is constant  
# 0,3 → 3    1,2 → 3    2,1 → 3

# If two queens share same r-c → same main diagonal → attack
# If two queens share same r+c → same anti-diagonal → attack
```

#### 2. Why Use Sets Instead of Arrays
```python
# O(1) lookup for occupied columns/diagonals
# More efficient than scanning entire row

# Alternative: Use bitmask
def solveNQueensBit(n):
    result = []
    
    def backtrack( cols, posDiag, negDiag, row):
        if row == n:
            result.append(1)  # Found solution
            return
        
        for col in range(n):
            currCol = 1 << col
            currPos = 1 << (n + row + col)
            currNeg = 1 << (row - col + n)
            
            if not (cols & currCol or 
                    posDiag & currPos or 
                    negDiag & currNeg):
                backtrack(cols | currCol,
                         posDiag | currPos,
                         negDiag | currNeg,
                         row + 1)
    
    backtrack(0, 0, 0, 0)
    return result
```

#### 3. Board Representation
```python
# Must create fresh board for each solution
board = [['.' for _ in range(n)] for _ in range(n)]

# Don't modify in place for result
# Convert each row to string when adding
result.append([''.join(row) for row in board])
```

### Time & Space Complexity

| Metric | Complexity |
|--------|------------|
| Time | O(n!) - n^n but prunes heavily |
| Space | O(n) - recursion + sets |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong diagonal formula | r-c for main, r+c for anti |
| Not removing on backtrack | Clean up all sets |
| Shallow copy issue | Convert to strings immediately |

<!-- back -->
