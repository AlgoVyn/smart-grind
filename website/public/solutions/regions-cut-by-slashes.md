# Regions Cut By Slashes

## Problem Description

An `n x n` grid is composed of `1 x 1` squares where each `1 x 1` square consists of a `'/'`, `'\'`, or blank space `' '`. These characters divide the square into contiguous regions.

Given the grid `grid` represented as a string array, return the number of regions.

Note that backslash characters are escaped, so a `'\'` is represented as `'\\'`.

**LeetCode Link:** [LeetCode 959 - Regions Cut By Slashes](https://leetcode.com/problems/regions-cut-by-slashes/)

---

## Examples

### Example 1

**Input:**
```python
grid = [" /", "/ "]
```

**Output:**
```python
2
```

**Explanation:**
The grid creates two separate regions.

### Example 2

**Input:**
```python
grid = [" /", "  "]
```

**Output:**
```python
1
```

**Explanation:**
All spaces are connected, forming one region.

### Example 3

**Input:**
```python
grid = ["/\\", "\\/"]
```

**Output:**
```python
5
```

**Explanation:**
The slashes divide the grid into 5 separate regions. Remember that `\\/` represents `\/` and `/\\` represents `/\`.

---

## Constraints

- `n == grid.length == grid[i].length`
- `1 <= n <= 30`
- `grid[i][j]` is either `'/'`, `'\'`, or `' '`.

---

## Pattern: Union-Find (Disjoint Set)

This problem uses **Union-Find** to count regions. Each cell is divided into 4 triangles, and slashes connect/disconnect them. Count connected components.

---

## Intuition

The key insight for this problem is treating each cell as having **4 sub-regions** (triangles) and using Union-Find to track which sub-regions are connected.

### Key Observations

1. **4 Triangles Per Cell**: Each cell can be divided into 4 triangles:
   - Top (0)
   - Right (1)
   - Bottom (2)
   - Left (3)

2. **Slash Connections**: 
   - `/` connects top with left, right with bottom
   - `\` connects top with right, left with bottom
   - ` ` (space) connects all 4 triangles together

3. **Adjacent Cell Connections**:
   - Right triangle of cell (i,j) connects to Left triangle of cell (i,j+1)
   - Bottom triangle of cell (i,j) connects to Top triangle of cell (i+1,j)

4. **Region Count**: After processing all cells, the number of regions equals the number of connected components in the Union-Find structure.

### Algorithm Overview

1. **Initialize Union-Find**: Create 4n² elements (4 per cell)
2. **Process each cell**:
   - Connect triangles within cell based on slash type
   - Connect to adjacent cells
3. **Count components**: Count roots in Union-Find structure

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Union-Find** - Standard solution
2. **DFS/BFS** - Alternative approach

---

## Approach 1: Union-Find (Standard)

### Algorithm Steps

1. Initialize Union-Find with 4 × n × n elements
2. For each cell, connect internal triangles based on character
3. Connect triangles to neighboring cells
4. Count unique roots to get number of regions

### Why It Works

Union-Find efficiently tracks which parts of the grid are connected. Each union operation merges two regions, and counting the final number of disjoint sets gives us the answer.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def regionsBySlashes(self, grid: List[str]) -> int:
        """
        Count regions in a grid divided by slashes.
        
        Args:
            grid: List of strings representing the grid
            
        Returns:
            Number of regions
        """
        n = len(grid)
        # 4 triangles per cell: top(0), right(1), bottom(2), left(3)
        parent = list(range(n * n * 4))
        
        def find(x: int) -> int:
            """Find root with path compression."""
            if parent[x] != x:
                parent[x] = find(parent[x])
            return parent[x]
        
        def union(x: int, y: int) -> None:
            """Union two sets."""
            px, py = find(x), find(y)
            if px != py:
                parent[px] = py
        
        # Process each cell
        for i in range(n):
            for j in range(n):
                idx = (i * n + j) * 4
                char = grid[i][j]
                
                # Connect internal triangles based on character
                if char == '/':
                    # / connects: top-left, right-bottom
                    union(idx, idx + 3)  # top with left
                    union(idx + 1, idx + 2)  # right with bottom
                elif char == '\\':
                    # \ connects: top-right, left-bottom
                    union(idx, idx + 1)  # top with right
                    union(idx + 2, idx + 3)  # bottom with left
                else:  # space
                    # Space connects all 4 triangles
                    union(idx, idx + 1)
                    union(idx + 1, idx + 2)
                    union(idx + 2, idx + 3)
                
                # Connect to right neighbor
                if j + 1 < n:
                    union(idx + 1, (i * n + j + 1) * 4 + 3)  # right to neighbor's left
                
                # Connect to bottom neighbor
                if i + 1 < n:
                    union(idx + 2, ((i + 1) * n + j) * 4)  # bottom to neighbor's top
        
        # Count number of connected components
        return sum(1 for i in range(len(parent)) if parent[i] == i)
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> parent;
    int n;
    
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    void unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px != py) {
            parent[px] = py;
        }
    }
    
    int regionsBySlashes(vector<string>& grid) {
        n = grid.size();
        parent.resize(n * n * 4);
        for (int i = 0; i < n * n * 4; i++) {
            parent[i] = i;
        }
        
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                int idx = (i * n + j) * 4;
                char c = grid[i][j];
                
                if (c == '/') {
                    unite(idx, idx + 3);
                    unite(idx + 1, idx + 2);
                } else if (c == '\\') {
                    unite(idx, idx + 1);
                    unite(idx + 2, idx + 3);
                } else {
                    unite(idx, idx + 1);
                    unite(idx + 1, idx + 2);
                    unite(idx + 2, idx + 3);
                }
                
                if (j + 1 < n) {
                    unite(idx + 1, (i * n + j + 1) * 4 + 3);
                }
                if (i + 1 < n) {
                    unite(idx + 2, ((i + 1) * n + j) * 4);
                }
            }
        }
        
        int count = 0;
        for (int i = 0; i < parent.size(); i++) {
            if (parent[i] == i) count++;
        }
        return count;
    }
};
```

<!-- slide -->
```java
class Solution {
    private int[] parent;
    private int n;
    
    private int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    private void union(int x, int y) {
        int px = find(x), py = find(y);
        if (px != py) {
            parent[px] = py;
        }
    }
    
    public int regionsBySlashes(String[] grid) {
        n = grid.length;
        parent = new int[n * n * 4];
        for (int i = 0; i < parent.length; i++) {
            parent[i] = i;
        }
        
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                int idx = (i * n + j) * 4;
                char c = grid[i].charAt(j);
                
                if (c == '/') {
                    union(idx, idx + 3);
                    union(idx + 1, idx + 2);
                } else if (c == '\\') {
                    union(idx, idx + 1);
                    union(idx + 2, idx + 3);
                } else {
                    union(idx, idx + 1);
                    union(idx + 1, idx + 2);
                    union(idx + 2, idx + 3);
                }
                
                if (j + 1 < n) {
                    union(idx + 1, (i * n + j + 1) * 4 + 3);
                }
                if (i + 1 < n) {
                    union(idx + 2, ((i + 1) * n + j) * 4);
                }
            }
        }
        
        int count = 0;
        for (int i = 0; i < parent.length; i++) {
            if (parent[i] == i) count++;
        }
        return count;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string[]} grid
 * @return {number}
 */
var regionsBySlashes = function(grid) {
    const n = grid.length;
    const parent = new Array(n * n * 4).fill(0).map((_, i) => i);
    
    const find = (x) => {
        if (parent[x] !== x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    };
    
    const union = (x, y) => {
        const px = find(x), py = find(y);
        if (px !== py) {
            parent[px] = py;
        }
    };
    
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            const idx = (i * n + j) * 4;
            const c = grid[i][j];
            
            if (c === '/') {
                union(idx, idx + 3);
                union(idx + 1, idx + 2);
            } else if (c === '\\') {
                union(idx, idx + 1);
                union(idx + 2, idx + 3);
            } else {
                union(idx, idx + 1);
                union(idx + 1, idx + 2);
                union(idx + 2, idx + 3);
            }
            
            if (j + 1 < n) {
                union(idx + 1, (i * n + j + 1) * 4 + 3);
            }
            if (i + 1 < n) {
                union(idx + 2, ((i + 1) * n + j) * 4);
            }
        }
    }
    
    let count = 0;
    for (let i = 0; i < parent.length; i++) {
        if (parent[i] === i) count++;
    }
    return count;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n² × α(n²)) - near linear with path compression |
| **Space** | O(n²) for Union-Find structure |

---

## Approach 2: DFS/BFS

### Algorithm Steps

1. Create a 3n × 3n grid to represent triangles
2. Fill cells based on slash characters
3. Run DFS/BFS to count connected components
4. Return count of unvisited regions

### Why It Works

Expanding each cell into a 3×3 grid allows us to directly flood-fill regions without complex union logic.

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def regionsBySlashes(self, grid: List[str]) -> int:
        n = len(grid)
        # Expand grid: each cell becomes 3x3
        expanded = [[0] * (3 * n) for _ in range(3 * n)]
        
        # Fill the expanded grid
        for i in range(n):
            for j in range(n):
                if grid[i][j] == '/':
                    expanded[3*i][3*j+2] = 1
                    expanded[3*i+1][3*j+1] = 1
                    expanded[3*i+2][3*j] = 1
                elif grid[i][j] == '\\':
                    expanded[3*i][3*j] = 1
                    expanded[3*i+1][3*j+1] = 1
                    expanded[3*i+2][3*j+2] = 1
        
        # BFS to count regions
        count = 0
        m = 3 * n
        visited = [[False] * m for _ in range(m)]
        
        for i in range(m):
            for j in range(m):
                if not visited[i][j] and expanded[i][j] == 0:
                    count += 1
                    queue = deque([(i, j)])
                    visited[i][j] = True
                    while queue:
                        x, y = queue.popleft()
                        for dx, dy in [(0,1), (0,-1), (1,0), (-1,0)]:
                            nx, ny = x + dx, y + dy
                            if 0 <= nx < m and 0 <= ny < m and not visited[nx][ny] and expanded[nx][ny] == 0:
                                visited[nx][ny] = True
                                queue.append((nx, ny))
        
        return count
```

<!-- slide -->
```cpp
// Similar DFS approach in C++
```

<!-- slide -->
```java
// Similar DFS approach in Java
```

<!-- slide -->
```javascript
// Similar DFS approach in JavaScript
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - visiting each cell once |
| **Space** | O(n²) for expanded grid |

---

## Comparison of Approaches

| Aspect | Union-Find | DFS/BFS |
|--------|------------|---------|
| **Time Complexity** | O(n² × α(n²)) | O(n²) |
| **Space Complexity** | O(n²) | O(n²) |
| **Implementation** | More complex | Simpler |
| **Understanding** | Harder | Easier |

**Best Approach:** Union-Find is more elegant and commonly used, but DFS is easier to understand.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Google, Amazon
- **Difficulty**: Medium
- **Concepts Tested**: Union-Find, Graph Theory, Spatial Reasoning

### Learning Outcomes

1. **Union-Find Mastery**: Learn to apply Union-Find to 2D grid problems
2. **Spatial Modeling**: Understand how to model cell divisions
3. **Region Counting**: Learn techniques for counting connected components

---

## Related Problems

Based on similar themes (Union-Find, Graph):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Number of Islands | [Link](https://leetcode.com/problems/number-of-islands/) | Count islands using DFS/Union-Find |
| Friend Circles | [Link](https://leetcode.com/problems/friend-circles/) | Union-Find for connectivity |
| Graph Valid Tree | [Link](https://leetcode.com/problems/valid-tree/) | Union-Find connectivity |

### Pattern Reference

For more details on the Union-Find pattern, see:
- **[Union-Find Pattern](/patterns/union-find)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Regions Cut By Slashes](https://www.youtube.com/watch?v=example)** - Clear explanation
2. **[Union-Find Explained](https://www.youtube.com/watch?v=example)** - Understanding Union-Find
3. **[LeetCode 959 Solution](https://www.youtube.com/watch?v=example)** - Full solution

---

## Follow-up Questions

### Q1: How would you modify the solution for a 3D grid?

**Answer:** Extend to 8 sub-regions per cell (or more), and connect to 6 neighboring cells instead of 4.

---

### Q2: What if we need to find the size of each region?

**Answer:** Track component sizes in Union-Find and report sizes after counting components.

---

### Q3: How would you handle different slash characters?

**Answer:** The solution already handles `/`, `\`, and space. You'd add more cases for additional characters.

---

## Common Pitfalls

### 1. 4 Triangles Per Cell
**Issue**: Not understanding each cell has 4 sub-regions.

**Solution**: Remember each cell is divided into 4 triangles: top, right, bottom, left.

### 2. Backslash Escaping
**Issue**: In code, using single backslash instead of double.

**Solution**: Use `'\\'` in Python/Java and `'\\'` in C++/JavaScript to represent a backslash.

### 3. Adjacent Cell Connections
**Issue**: Not connecting triangles to neighbors correctly.

**Solution**: Connect right triangle to neighbor's left, bottom to neighbor's top.

---

## Summary

The **Regions Cut By Slashes** problem demonstrates how to use **Union-Find** to solve grid partition problems.

Key takeaways:
1. Each cell has 4 sub-regions (triangles)
2. Connect triangles based on slash characters
3. Connect adjacent cells' triangles
4. Count connected components for answer

This problem is essential for understanding Union-Find applications in 2D grid problems.

### Pattern Summary

This problem exemplifies the **Union-Find** pattern, characterized by:
- Tracking connectivity in a grid
- Merging regions based on constraints
- Counting final components

For more details on this pattern, see the **[Union-Find Pattern](/patterns/union-find)**.

---

## Additional Resources

- [LeetCode Problem 959](https://leetcode.com/problems/regions-cut-by-slashes/) - Official problem page
- [Union-Find - GeeksforGeeks](https://www.geeksforgeeks.org/union-find/) - Detailed explanation
- [Pattern: Union-Find](/patterns/union-find) - Comprehensive pattern guide
