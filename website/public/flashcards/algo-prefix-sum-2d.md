## 2D Prefix Sum

**Question:** How do you build a 2D prefix sum array and query any submatrix in O(1)?

<!-- front -->

---

## 2D Prefix Sum

### Building the Prefix Sum Array
```python
def build_prefix_sum(matrix):
    if not matrix or not matrix[0]:
        return []
    
    m, n = len(matrix), len(matrix[0])
    # Create (m+1) x (n+1) grid filled with zeros
    prefix = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(m):
        for j in range(n):
            prefix[i+1][j+1] = (matrix[i][j] 
                + prefix[i][j+1] 
                + prefix[i+1][j] 
                - prefix[i][j])
    
    return prefix
```

### Querying a Submatrix (row1, col1) to (row2, col2)
```python
def query(prefix, row1, col1, row2, col2):
    return (prefix[row2+1][col2+1] 
        - prefix[row1][col2+1] 
        - prefix[row2+1][col1] 
        + prefix[row1][col1])
```

### 💡 Key Formula
```
Sum(row1→row2, col1→col2) = 
  S(row2,col2) - S(row1-1,col2) - S(row2,col1-1) + S(row1-1,col1-1)
```

### ⚠️ Common Mistake
Using 0-based indices directly without the (+1) offset in the prefix array.

<!-- back -->
