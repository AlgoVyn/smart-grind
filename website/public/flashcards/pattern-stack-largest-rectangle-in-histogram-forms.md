## Stack - Largest Rectangle in Histogram: Forms

What are the different variations of the Largest Rectangle in Histogram pattern?

<!-- front -->

---

### Form 1: Basic Largest Rectangle (LeetCode 84)

Find maximum area rectangle in histogram.

```python
def largest_rectangle_area(heights: list[int]) -> int:
    """
    Standard largest rectangle in histogram.
    Input: [2, 1, 5, 6, 2, 3]
    Output: 10 (from heights [5, 6] or [2, 1, 5, 6, 2])
    """
    stack = []
    max_area = 0
    
    for i in range(len(heights) + 1):
        h = heights[i] if i < len(heights) else 0
        
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            max_area = max(max_area, height * width)
        
        stack.append(i)
    
    return max_area
```

---

### Form 2: Maximal Rectangle in Binary Matrix (LeetCode 85)

2D extension - largest rectangle of 1s in binary matrix.

```python
def maximal_rectangle(matrix: list[list[str]]) -> int:
    """
    Find largest rectangle containing only 1s.
    Builds histogram for each row and applies stack algorithm.
    """
    if not matrix or not matrix[0]:
        return 0
    
    rows, cols = len(matrix), len(matrix[0])
    heights = [0] * cols
    max_area = 0
    
    for r in range(rows):
        for c in range(cols):
            heights[c] = heights[c] + 1 if matrix[r][c] == '1' else 0
        
        max_area = max(max_area, largest_rectangle_area(heights))
    
    return max_area
```

---

### Form 3: Largest Rectangle with All 1s (LeetCode 1727)

Largest submatrix with rearrangements allowed.

```python
def largest_submatrix(matrix: list[list[int]]) -> int:
    """
    Can rearrange columns - sort row heights descending.
    LeetCode 1727 - Largest Submatrix With Rearrangements
    """
    rows, cols = len(matrix), len(matrix[0])
    heights = [0] * cols
    max_area = 0
    
    for r in range(rows):
        for c in range(cols):
            heights[c] = 0 if matrix[r][c] == 0 else heights[c] + 1
        
        # Sort descending - we can rearrange columns!
        sorted_heights = sorted(heights, reverse=True)
        
        # Calculate max area with sorted heights
        for i, h in enumerate(sorted_heights):
            area = h * (i + 1)
            max_area = max(max_area, area)
    
    return max_area
```

---

### Form 4: Largest Plus Sign (LeetCode 764)

Find order of largest plus sign that can be formed.

```python
def order_of_largest_plus_sign(n: int, mines: list[list[int]]) -> int:
    """
    Find largest plus sign in n×n grid with mines.
    Uses 4 DP arrays: up, down, left, right consecutive 1s.
    """
    grid = [[1] * n for _ in range(n)]
    for r, c in mines:
        grid[r][c] = 0
    
    # DP arrays for each direction
    up = [[0] * n for _ in range(n)]
    down = [[0] * n for _ in range(n)]
    left = [[0] * n for _ in range(n)]
    right = [[0] * n for _ in range(n)]
    
    # Fill DP arrays
    for i in range(n):
        for j in range(n):
            if grid[i][j] == 1:
                up[i][j] = 1 if i == 0 else up[i-1][j] + 1
                left[i][j] = 1 if j == 0 else left[i][j-1] + 1
    
    for i in range(n-1, -1, -1):
        for j in range(n-1, -1, -1):
            if grid[i][j] == 1:
                down[i][j] = 1 if i == n-1 else down[i+1][j] + 1
                right[i][j] = 1 if j == n-1 else right[i][j+1] + 1
    
    # Find largest plus sign
    max_order = 0
    for i in range(n):
        for j in range(n):
            if grid[i][j] == 1:
                order = min(up[i][j], down[i][j], left[i][j], right[i][j])
                max_order = max(max_order, order)
    
    return max_order
```

---

### Form 5: Trapping Rain Water (Related - LeetCode 42)

Calculate water trapped between bars.

```python
def trap(heights: list[int]) -> int:
    """
    Calculate water trapped after raining.
    Related: uses stack but for different purpose (finding boundaries).
    """
    stack = []
    water = 0
    
    for i, h in enumerate(heights):
        while stack and heights[stack[-1]] < h:
            top = stack.pop()
            if not stack:
                break
            
            # Calculate trapped water
            distance = i - stack[-1] - 1
            bounded_height = min(heights[stack[-1]], h) - heights[top]
            water += distance * bounded_height
        
        stack.append(i)
    
    return water
```

---

### Form 6: Form Largest Island (LeetCode 827)

Make largest island by flipping one 0 to 1, using component sizes.

```python
def largest_island(grid: list[list[int]]) -> int:
    """
    Flip one 0 to 1 to make largest island.
    Uses DFS for component labeling + size tracking.
    """
    n = len(grid)
    island_id = 2
    island_sizes = {}
    
    def dfs(r, c, id):
        if r < 0 or r >= n or c < 0 or c >= n or grid[r][c] != 1:
            return 0
        grid[r][c] = id
        return 1 + dfs(r+1, c, id) + dfs(r-1, c, id) + dfs(r, c+1, id) + dfs(r, c-1, id)
    
    # Label islands
    for i in range(n):
        for j in range(n):
            if grid[i][j] == 1:
                size = dfs(i, j, island_id)
                island_sizes[island_id] = size
                island_id += 1
    
    if not island_sizes:
        return 1
    
    max_size = max(island_sizes.values())
    
    # Try flipping each 0
    for i in range(n):
        for j in range(n):
            if grid[i][j] == 0:
                neighbor_ids = set()
                for di, dj in [(-1,0), (1,0), (0,-1), (0,1)]:
                    ni, nj = i + di, j + dj
                    if 0 <= ni < n and 0 <= nj < n and grid[ni][nj] > 1:
                        neighbor_ids.add(grid[ni][nj])
                
                merged = 1  # The flipped cell
                for id in neighbor_ids:
                    merged += island_sizes[id]
                max_size = max(max_size, merged)
    
    return max_size
```

---

### Form Comparison

| Form | Input | Key Pattern | LeetCode # |
|------|-------|-------------|------------|
| Largest rectangle | Height array | Monotonic stack | 84 |
| Maximal rectangle | Binary matrix | Row histograms | 85 |
| Rearrangeable matrix | Binary matrix | Sort row heights | 1727 |
| Largest plus sign | Grid with mines | 4-direction DP | 764 |
| Trapping rain water | Height array | Decreasing stack | 42 |
| Largest island | Binary grid | DFS labeling | 827 |

---

### Form 7: Count of Rectangles (Variations)

Count rectangles with specific properties:

```python
def count_rectangles(heights: list[int]) -> int:
    """
    Count all possible rectangles (not just largest).
    Each bar can form rectangles with all shorter bars to left/right.
    """
    n = len(heights)
    # Can extend the problem to count or enumerate all rectangles
    # Using NSE approach for boundaries
    
    left = [-1] * n
    right = [n] * n
    
    # Find boundaries
    stack = []
    for i in range(n):
        while stack and heights[stack[-1]] >= heights[i]:
            stack.pop()
        left[i] = stack[-1] if stack else -1
        stack.append(i)
    
    stack = []
    for i in range(n - 1, -1, -1):
        while stack and heights[stack[-1]] >= heights[i]:
            stack.pop()
        right[i] = stack[-1] if stack else n
        stack.append(i)
    
    # Each bar forms (right[i] - left[i] - 1) distinct width rectangles
    count = 0
    for i in range(n):
        widths = right[i] - left[i] - 1
        count += widths  # heights[i] different heights possible
    
    return count
```

<!-- back -->
