## Valid Sudoku

**Question:** Validate 9x9 Sudoku board?

<!-- front -->

---

## Answer: HashSet for Row/Col/Box

### Solution
```python
def isValidSudoku(board):
    rows = [set() for _ in range(9)]
    cols = [set() for _ in range(9)]
    boxes = [set() for _ in range(9)]
    
    for i in range(9):
        for j in range(9):
            num = board[i][j]
            
            if num == '.':
                continue
            
            # Calculate box index
            box_idx = (i // 3) * 3 + (j // 3)
            
            # Check duplicates
            if num in rows[i] or num in cols[j] or num in boxes[box_idx]:
                return False
            
            rows[i].add(num)
            cols[j].add(num)
            boxes[box_idx].add(num)
    
    return True
```

### Visual: Box Index Calculation
```
Board: 9x9 grid divided into 9 boxes (3x3)

Box mapping:
(0,0) → 0   (0,1) → 1   (0,2) → 2
(1,0) → 3   (1,1) → 4   (1,2) → 5
(2,0) → 6   (2,1) → 7   (2,2) → 8

Formula: box_idx = (row // 3) * 3 + (col // 3)
```

### ⚠️ Tricky Parts

#### 1. Box Index Formula
```python
# Three 3x3 boxes horizontally
# Three 3x3 boxes vertically

# row//3 gives which 3-row block (0,1,2)
# Multiply by 3 to get base box number
# Add col//3 for position in block
```

#### 2. Why Three Structures?
```python
# Need to track:
# - Each row has 9 cells
# - Each column has 9 cells  
# - Each 3x3 box has 9 cells

# Use separate sets for O(1) lookup
```

### Time & Space Complexity

| Method | Time | Space |
|--------|------|-------|
| Single pass | O(81) = O(1) | O(9×3) = O(1) |

### Common Mistakes

| Mistake | Fix |
|---------|-----|
| Wrong box index | Use correct formula |
| Not checking all | Check row, col, box |
| Using array instead of set | Use set for O(1) lookup |

<!-- back -->
