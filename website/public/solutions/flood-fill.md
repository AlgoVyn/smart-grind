# Flood Fill

## Problem Description

## Pattern: Graph - Flood Fill (DFS/BFS)

This problem demonstrates the **Depth-First Search (DFS)** or **Breadth-First Search (BFS)** pattern for flood fill operations.

You are given an image represented by an m x n grid of integers image, where image[i][j] represents the pixel value of the image. You are also given three integers sr, sc, and color. Your task to perform a flood fill on the image starting from the pixel image[sr][sc].
To perform a flood fill:
- Begin with the starting pixel and change its color to color.
- Perform the same process for each pixel that is directly adjacent (pixels that share a side with the original pixel, either horizontally or vertically) and shares the same color as the starting pixel.
- Keep repeating this process by checking neighboring pixels of the updated pixels and modifying their color if it matches the original color of the starting pixel.
- The process stops when there are no more adjacent pixels of the original color to update.
Return the modified image after performing the flood fill.

## Examples

**Example 1:**

**Input:** image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2

**Output:** [[2,2,2],[2,2,0],[2,0,1]]

**Explanation:**
From the center of the image with position (sr, sc) = (1, 1) (i.e., the red pixel), all pixels connected by a path of the same color as the starting pixel (i.e., the blue pixels) are colored with the new color.
Note the bottom corner is not colored 2, because it is not horizontally or vertically connected to the starting pixel.

**Example 2:**

**Input:** image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0

**Output:** [[0,0,0],[0,0,0]]

**Explanation:**
The starting pixel is already colored with 0, which is the same as the target color. Therefore, no changes are made to the image.

## Constraints

- m == image.length
- n == image[i].length
- 1 <= m, n <= 50
- 0 <= image[i][j], color < 2^16
- 0 <= sr < m
- 0 <= sc < n

---

## Intuition

The flood fill problem is essentially a **graph traversal** problem:

1. **Treat the image as a graph**: Each pixel is a node; adjacent pixels (4-directional) are connected edges
2. **Starting point**: The pixel at (sr, sc)
3. **Flood condition**: We can only traverse to pixels that:
   - Are within bounds
   - Have the same original color as the starting pixel
   - Haven't been visited yet
4. **Goal**: Visit all connected pixels and change their color

This is exactly the same problem as:
- Finding connected components
- Counting islands in a grid
- Performing a traversal (DFS or BFS)

---

## Solution Approaches

## Approach 1: Depth-First Search (Recursive)

The classic recursive DFS approach - intuitive and straightforward.

````carousel
```python
from typing import List

class Solution:
    def floodFill(self, image: List[List[int]], sr: int, sc: int, color: int) -> List[List[int]]:
        if image[sr][sc] == color:
            return image
        
        original_color = image[sr][sc]
        m, n = len(image), len(image[0])
        
        def dfs(r, c):
            if r < 0 or r >= m or c < 0 or c >= n or image[r][c] != original_color:
                return
            image[r][c] = color
            dfs(r + 1, c)
            dfs(r - 1, c)
            dfs(r, c + 1)
            dfs(r, c - 1)
        
        dfs(sr, sc)
        return image
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {
        if (image[sr][sc] == color) {
            return image;
        }
        
        int originalColor = image[sr][sc];
        int m = image.size();
        int n = image[0].size();
        
        function<void(int, int)> dfs = [&](int r, int c) {
            if (r < 0 || r >= m || c < 0 || c >= n || image[r][c] != originalColor) {
                return;
            }
            image[r][c] = color;
            dfs(r + 1, c);
            dfs(r - 1, c);
            dfs(r, c + 1);
            dfs(r, c - 1);
        };
        
        dfs(sr, sc);
        return image;
    }
};
```
<!-- slide -->
```java
class Solution {
    public int[][] floodFill(int[][] image, int sr, int sc, int color) {
        if (image[sr][sc] == color) {
            return image;
        }
        
        int originalColor = image[sr][sc];
        int m = image.length;
        int n = image[0].length;
        
        dfs(image, sr, sc, originalColor, color, m, n);
        return image;
    }
    
    private void dfs(int[][] image, int r, int c, int originalColor, int color, int m, int n) {
        if (r < 0 || r >= m || c < 0 || c >= n || image[r][c] != originalColor) {
            return;
        }
        
        image[r][c] = color;
        
        dfs(image, r + 1, c, originalColor, color, m, n);
        dfs(image, r - 1, c, originalColor, color, m, n);
        dfs(image, r, c + 1, originalColor, color, m, n);
        dfs(image, r, c - 1, originalColor, color, m, n);
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number[][]} image
 * @param {number} sr
 * @param {number} sc
 * @param {number} color
 * @return {number[][]}
 */
var floodFill = function(image, sr, sc, color) {
    if (image[sr][sc] === color) {
        return image;
    }
    
    const originalColor = image[sr][sc];
    const m = image.length;
    const n = image[0].length;
    
    function dfs(r, c) {
        if (r < 0 || r >= m || c < 0 || c >= n || image[r][c] !== originalColor) {
            return;
        }
        
        image[r][c] = color;
        dfs(r + 1, c);
        dfs(r - 1, c);
        dfs(r, c + 1);
        dfs(r, c - 1);
    }
    
    dfs(sr, sc);
    return image;
};
```
````

## Approach 2: Breadth-First Search (Iterative)

An iterative BFS approach using a queue - avoids recursion depth issues.

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def floodFill(self, image: List[List[int]], sr: int, sc: int, color: int) -> List[List[int]]:
        if image[sr][sc] == color:
            return image
        
        original_color = image[sr][sc]
        m, n = len(image), len(image[0])
        queue = deque([(sr, sc)])
        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        
        while queue:
            r, c = queue.popleft()
            if image[r][c] != original_color:
                continue
            
            image[r][c] = color
            
            for dr, dc in directions:
                nr, nc = r + dr, c + dc
                if 0 <= nr < m and 0 <= nc < n and image[nr][nc] == original_color:
                    queue.append((nr, nc))
        
        return image
```
<!-- slide -->
```cpp
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {
        if (image[sr][sc] == color) {
            return image;
        }
        
        int originalColor = image[sr][sc];
        int m = image.size();
        int n = image[0].size();
        
        queue<pair<int, int>> q;
        q.push({sr, sc});
        
        vector<vector<int>> directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        
        while (!q.empty()) {
            auto [r, c] = q.front();
            q.pop();
            
            if (image[r][c] != originalColor) {
                continue;
            }
            
            image[r][c] = color;
            
            for (auto& dir : directions) {
                int nr = r + dir[0];
                int nc = c + dir[1];
                
                if (nr >= 0 && nr < m && nc >= 0 && nc < n && image[nr][nc] == originalColor) {
                    q.push({nr, nc});
                }
            }
        }
        
        return image;
    }
};
```
<!-- slide -->
```java
import java.util.*;

class Solution {
    public int[][] floodFill(int[][] image, int sr, int sc, int color) {
        if (image[sr][sc] == color) {
            return image;
        }
        
        int originalColor = image[sr][sc];
        int m = image.length;
        int n = image[0].length;
        
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{sr, sc});
        
        int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        
        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int r = curr[0];
            int c = curr[1];
            
            if (image[r][c] != originalColor) {
                continue;
            }
            
            image[r][c] = color;
            
            for (int[] dir : directions) {
                int nr = r + dir[0];
                int nc = c + dir[1];
                
                if (nr >= 0 && nr < m && nc >= 0 && nc < n && image[nr][nc] == originalColor) {
                    queue.offer(new int[]{nr, nc});
                }
            }
        }
        
        return image;
    }
}
```
<!-- slide -->
```javascript
var floodFill = function(image, sr, sc, color) {
    if (image[sr][sc] === color) {
        return image;
    }
    
    const originalColor = image[sr][sc];
    const m = image.length;
    const n = image[0].length;
    
    const queue = [[sr, sc]];
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    
    while (queue.length > 0) {
        const [r, c] = queue.shift();
        
        if (image[r][c] !== originalColor) {
            continue;
        }
        
        image[r][c] = color;
        
        for (const [dr, dc] of directions) {
            const nr = r + dr;
            const nc = c + dc;
            
            if (nr >= 0 && nr < m && nc >= 0 && nc < n && image[nr][nc] === originalColor) {
                queue.push([nr, nc]);
            }
        }
    }
    
    return image;
};
```
````

## Approach 3: DFS with Direction Array

A cleaner DFS implementation using direction arrays.

````carousel
```python
from typing import List

class Solution:
    def floodFill(self, image: List[List[int]], sr: int, sc: int, color: int) -> List[List[int]]:
        if image[sr][sc] == color:
            return image
        
        original = image[sr][sc]
        m, n = len(image), len(image[0])
        directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
        
        def dfs(r, c):
            # Base case: out of bounds or different color
            if not (0 <= r < m and 0 <= c < n) or image[r][c] != original:
                return
            
            # Visit this pixel
            image[r][c] = color
            
            # Explore all 4 directions
            for dr, dc in directions:
                dfs(r + dr, c + dc)
        
        dfs(sr, sc)
        return image
```
<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
public:
    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {
        if (image[sr][sc] == color) {
            return image;
        }
        
        int original = image[sr][sc];
        int m = image.size();
        int n = image[0].size();
        vector<vector<int>> directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
        
        function<void(int, int)> dfs = [&](int r, int c) {
            if (!(r >= 0 && r < m && c >= 0 && c < n) || image[r][c] != original) {
                return;
            }
            
            image[r][c] = color;
            
            for (auto& dir : directions) {
                dfs(r + dir[0], c + dir[1]);
            }
        };
        
        dfs(sr, sc);
        return image;
    }
};
```
<!-- slide -->
```java
class Solution {
    private int[][] directions = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    
    public int[][] floodFill(int[][] image, int sr, int sc, int color) {
        if (image[sr][sc] == color) {
            return image;
        }
        
        int original = image[sr][sc];
        dfs(image, sr, sc, original, color);
        return image;
    }
    
    private void dfs(int[][] image, int r, int c, int original, int color) {
        int m = image.length;
        int n = image[0].length;
        
        if (r < 0 || r >= m || c < 0 || c >= n || image[r][c] != original) {
            return;
        }
        
        image[r][c] = color;
        
        for (int[] dir : directions) {
            dfs(image, r + dir[0], c + dir[1], original, color);
        }
    }
}
```
<!-- slide -->
```javascript
var floodFill = function(image, sr, sc, color) {
    if (image[sr][sc] === color) {
        return image;
    }
    
    const original = image[sr][sc];
    const directions = [[1, 0], [-1, 0], [0, 1], [0, -1]];
    const m = image.length;
    const n = image[0].length;
    
    function dfs(r, c) {
        if (r < 0 || r >= m || c < 0 || c >= n || image[r][c] !== original) {
            return;
        }
        
        image[r][c] = color;
        
        for (const [dr, dc] of directions) {
            dfs(r + dr, c + dc);
        }
    }
    
    dfs(sr, sc);
    return image;
};
```
````

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity | Description |
|----------|-----------------|------------------|-------------|
| **DFS Recursive** | O(m × n) | O(m × n) | Recursion stack in worst case |
| **BFS Iterative** | O(m × n) | O(m × n) | Queue can hold all pixels |
| **DFS Direction Array** | O(m × n) | O(m × n) | Same as recursive |

### Why O(m × n):

- In the worst case, we visit every pixel exactly once
- Each pixel is processed (checked and colored) at most one time
- The grid has m × n pixels total

---

## Edge Cases and Common Pitfalls

### Edge Cases to Consider

1. **Starting color equals target color**: Early return to avoid infinite loop
2. **Single pixel image**: Works correctly with any start position
3. **All same color**: Fills entire image
4. **No adjacent same-color pixels**: Only fills starting pixel

### Common Mistakes

1. **Forgetting boundary check**: Always check bounds before accessing array
2. **Not storing original color**: Must compare with original, not new color
3. **Infinite recursion**: Must check if already visited (different color)
4. **Modifying before check**: Must check color before changing to new color

---

## Why This Pattern is Important

### Interview Relevance

- **Frequency**: Frequently asked in technical interviews
- **Companies**: Google, Amazon, Meta, Apple, Microsoft
- **Difficulty**: Easy to Medium
- **Concepts tested**: Graph traversal, recursion, BFS/DFS

### Learning Outcomes

1. **Graph traversal**: Understanding BFS and DFS on grids
2. **Recursion mastery**: Practice with recursive approaches
3. **Boundary handling**: Managing edge cases carefully
4. **Connected components**: Understanding connectivity in grids

---

## Related Problems

### Same Pattern (Graph/Grid Traversal)

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Flood Fill](https://leetcode.com/problems/flood-fill/) | 733 | Easy | This problem |
| [Number of Islands](https://leetcode.com/problems/number-of-islands/) | 200 | Medium | Count connected components |
| [Max Area of Island](https://leetcode.com/problems/max-area-of-island/) | 695 | Medium | Largest connected area |
| [Islands and Treasure](https://leetcode.com/problems/as-far-from-land-as-possible/) | 1162 | Medium | BFS from land |

### Similar Concepts

| Problem | LeetCode # | Difficulty | Related Technique |
|---------|------------|------------|-------------------|
| [Surrounded Regions](https://leetcode.com/problems/surrounded-regions/) | 130 | Medium | DFS/BFS on grid |
| [Rotting Oranges](https://leetcode.com/problems/rotting-oranges/) | 994 | Medium | Multi-source BFS |
| [Pacific Atlantic Water Flow](https://leetcode.com/problems/pacific-atlantic-water-flow/) | 417 | Medium | DFS with conditions |
| [Number of Enclaves](https://leetcode.com/problems/number-of-enclaves/) | 1020 | Medium | Count boundary-connected |

---

## Video Tutorial Links

### Recommended Tutorials

1. **[Flood Fill - NeetCode](https://www.youtube.com/watch?v=f10vV1b9lQ0)**
   - Clear explanation of DFS approach
   - Step-by-step visualization

2. **[LeetCode 733 - Flood Fill](https://www.youtube.com/watch?v=8-UXbNFOMD8)**
   - Both DFS and BFS approaches
   - Interview tips

3. **[Graph Traversal - Back to Back SWE](https://www.youtube.com/watch?v=8h2G2cKVx1s)**
   - DFS and BFS fundamentals
   - Grid traversal patterns

4. **[Number of Islands - Overview](https://www.youtube.com/watch?v=0S0rQvqE0a0)**
   - Similar flood fill pattern
   - Practice for this problem type

---

## Follow-up Questions

### Basic Level

1. **What is the time and space complexity?**
   - Time: O(m × n), Space: O(m × n) for recursion stack or queue

2. **Why do we check if original color equals target color first?**
   - To avoid infinite loops when start and target colors are the same

3. **What are the four directions we need to check?**
   - Up, down, left, right (not diagonals unless specified)

### Intermediate Level

4. **How would you implement this with BFS instead of DFS?**
   - Use a queue instead of recursion; process neighbors level by level

5. **What if the problem allowed 8-directional connectivity?**
   - Add diagonal directions: (1,1), (1,-1), (-1,1), (-1,-1)

### Advanced Level

6. **How would you handle very large images efficiently?**
   - Use iterative BFS to avoid stack overflow; consider chunking for massive images

7. **What if you needed to undo the flood fill?**
   - Store original colors in a map before modifying; restore from map

---

## Common Pitfalls

### 1. Forgetting Boundary Check
**Issue**: Not checking array bounds before accessing elements.

**Solution**: Always check bounds: `if 0 <= r < m and 0 <= c < n`.

### 2. Not Storing Original Color
**Issue**: Comparing with new color instead of original, causing infinite loops.

**Solution**: Store original color before starting the flood fill.

### 3. Infinite Recursion
**Issue**: Not checking if a pixel was already visited (has new color).

**Solution**: Check `image[r][c] == original_color` before processing.

### 4. Modifying Before Check
**Issue**: Changing color before verifying it's the original color.

**Solution**: Always check the original color first, then modify.

### 5. Stack Overflow with Deep Recursion
**Issue**: For large images, recursive DFS can cause stack overflow.

**Solution**: Use iterative BFS approach instead for large images.

---

## Summary

The **Flood Fill** problem is a classic graph traversal problem. Key insights:

1. **Graph model**: Each pixel is a node; 4-directional adjacency creates edges
2. **DFS or BFS**: Either approach works for visiting all connected pixels
3. **Key check**: Only visit pixels with the original starting color
4. **Early return**: Handle case where start color equals target color

This problem is essential for understanding:
- Grid-based graph traversal
- Connected component problems
- BFS and DFS applications

---

## LeetCode Problems for Practice

- [Flood Fill](https://leetcode.com/problems/flood-fill/)
- [Number of Islands](https://leetcode.com/problems/number-of-islands/)
- [Max Area of Island](https://leetcode.com/problems/max-area-of-island/)
- [Surrounded Regions](https://leetcode.com/problems/surrounded-regions/)
- [Rotting Oranges](https://leetcode.com/problems/rotting-oranges/)
- [Pacific Atlantic Water Flow](https://leetcode.com/problems/pacific-atlantic-water-flow/)
