## Stack - Largest Rectangle in Histogram: Tactics

What are the advanced techniques and variations for the Largest Rectangle in Histogram pattern?

<!-- front -->

---

### Tactic 1: Two-Pass Next Smaller Element (NSE) Approach

Precompute next smaller to left and right for each bar, then calculate all areas.

```python
def largest_rectangle_area_nse(heights: list[int]) -> int:
    """
    Find largest area using next smaller element arrays.
    Time: O(n), Space: O(n)
    """
    n = len(heights)
    left = [-1] * n   # Index of next smaller to left
    right = [n] * n   # Index of next smaller to right
    
    # Find next smaller to left
    stack = []
    for i in range(n):
        while stack and heights[stack[-1]] >= heights[i]:
            stack.pop()
        left[i] = stack[-1] if stack else -1
        stack.append(i)
    
    # Find next smaller to right
    stack = []
    for i in range(n - 1, -1, -1):
        while stack and heights[stack[-1]] >= heights[i]:
            stack.pop()
        right[i] = stack[-1] if stack else n
        stack.append(i)
    
    # Calculate max area
    max_area = 0
    for i in range(n):
        width = right[i] - left[i] - 1
        max_area = max(max_area, heights[i] * width)
    
    return max_area
```

**When to use:** When you need NSE arrays for other purposes (e.g., multiple queries).

---

### Tactic 2: Return Rectangle Coordinates

Track boundaries to return actual rectangle position, not just area.

```python
def largest_rectangle_with_coords(heights: list[int]):
    """
    Returns (max_area, height, left, right) of largest rectangle.
    """
    stack = []
    max_area = 0
    best = (0, 0, 0, 0)  # (area, height, left, right)
    
    for i in range(len(heights) + 1):
        h = heights[i] if i < len(heights) else 0
        
        while stack and heights[stack[-1]] > h:
            height = heights[stack.pop()]
            left = stack[-1] + 1 if stack else 0
            right = i - 1
            width = right - left + 1
            area = height * width
            
            if area > max_area:
                max_area = area
                best = (area, height, left, right)
        
        stack.append(i)
    
    return best
```

---

### Tactic 3: 2D Extension - Maximal Rectangle in Binary Matrix

Apply histogram algorithm to each row of a binary matrix.

```python
def maximal_rectangle(matrix: list[list[str]]) -> int:
    """
    Find largest rectangle containing only 1s in binary matrix.
    LeetCode 85 - Maximal Rectangle
    Time: O(rows × cols), Space: O(cols)
    """
    if not matrix or not matrix[0]:
        return 0
    
    rows, cols = len(matrix), len(matrix[0])
    heights = [0] * cols
    max_area = 0
    
    for r in range(rows):
        # Update heights for current row
        for c in range(cols):
            if matrix[r][c] == '1':
                heights[c] += 1
            else:
                heights[c] = 0
        
        # Apply largest rectangle in histogram
        max_area = max(max_area, largest_rectangle_area(heights))
    
    return max_area


def largest_rectangle_area(heights: list[int]) -> int:
    """Helper function - monotonic stack approach."""
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

### Tactic 4: Using >= vs > in Stack Condition

The comparison operator affects which bars are considered "equal."

```python
# Version A: > (strictly greater)
# Use when: We want to merge equal heights, treat as one continuous bar
while stack and heights[stack[-1]] > h:
    ...

# Version B: >= (greater or equal)
# Use when: We want to process each bar independently
while stack and heights[stack[-1]] >= h:
    ...
```

| Operator | Behavior | When to Use |
|----------|----------|-------------|
| `>` | Equal heights merged, wider rectangles | Standard problem |
| `>=` | Equal heights processed separately | When individual bar tracking needed |

---

### Tactic 5: Common Pitfalls & Fixes

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Forgetting sentinel** | Stack not empty at end, some bars not processed | Add 0 to heights or iterate to n |
| **Off-by-one width** | Wrong area calculation | Use `i - stack[-1] - 1` when stack not empty |
| **Empty stack case** | Width should be `i`, not `i - (-1) - 1` | Check `if not stack: width = i` |
| **Modifying input** | Sentinel approach changes original array | Use `heights + [0]` or iterate to n |
| **Stack stores values not indices** | Can't calculate width correctly | Always store indices in stack |

---

### Tactic 6: Without Modifying Input Array

Avoid side effects by not appending to input:

```python
def largest_rectangle_clean(heights: list[int]) -> int:
    """
    Non-destructive version - doesn't modify input.
    """
    stack = []
    max_area = 0
    n = len(heights)
    
    for i in range(n + 1):
        # Use 0 as sentinel when i == n
        curr_height = heights[i] if i < n else 0
        
        while stack and heights[stack[-1]] > curr_height:
            height = heights[stack.pop()]
            # Width calculation
            if not stack:
                width = i  # Extends from beginning
            else:
                width = i - stack[-1] - 1
            max_area = max(max_area, height * width)
        
        stack.append(i)
    
    return max_area
```

---

### Tactic 7: Segment Tree Divide & Conquer Alternative

For educational purposes or when stack isn't allowed:

```python
def largest_rectangle_segment_tree(heights: list[int]) -> int:
    """
    O(n log n) divide and conquer using range minimum query.
    """
    def divide_conquer(left: int, right: int) -> int:
        if left > right:
            return 0
        if left == right:
            return heights[left]
        
        # Find minimum in range (can use segment tree for O(log n))
        min_idx = left
        for i in range(left + 1, right + 1):
            if heights[i] < heights[min_idx]:
                min_idx = i
        
        # Three cases: min in middle, entirely left, or entirely right
        mid_area = heights[min_idx] * (right - left + 1)
        left_area = divide_conquer(left, min_idx - 1)
        right_area = divide_conquer(min_idx + 1, right)
        
        return max(mid_area, left_area, right_area)
    
    return divide_conquer(0, len(heights) - 1)
```

**Note:** This is O(n log n) or O(n) with cartesian tree + RMQ. Stack approach is preferred.

<!-- back -->
