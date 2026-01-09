# Flood Fill

## Problem Description
You are given an image represented by an m x n grid of integers image, where image[i][j] represents the pixel value of the image. You are also given three integers sr, sc, and color. Your task is to perform a flood fill on the image starting from the pixel image[sr][sc].
To perform a flood fill:

Begin with the starting pixel and change its color to color.
Perform the same process for each pixel that is directly adjacent (pixels that share a side with the original pixel, either horizontally or vertically) and shares the same color as the starting pixel.
Keep repeating this process by checking neighboring pixels of the updated pixels and modifying their color if it matches the original color of the starting pixel.
The process stops when there are no more adjacent pixels of the original color to update.

Return the modified image after performing the flood fill.
 
Example 1:

Input: image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2
Output: [[2,2,2],[2,2,0],[2,0,1]]
Explanation:

From the center of the image with position (sr, sc) = (1, 1) (i.e., the red pixel), all pixels connected by a path of the same color as the starting pixel (i.e., the blue pixels) are colored with the new color.
Note the bottom corner is not colored 2, because it is not horizontally or vertically connected to the starting pixel.

Example 2:

Input: image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0
Output: [[0,0,0],[0,0,0]]
Explanation:
The starting pixel is already colored with 0, which is the same as the target color. Therefore, no changes are made to the image.

 
Constraints:

m == image.length
n == image[i].length
1 <= m, n <= 50
0 <= image[i][j], color < 216
0 <= sr < m
0 <= sc < n
## Solution

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

## Explanation
Flood fill is a graph traversal problem where we change the color of all connected pixels of the same original color starting from a given pixel. We use DFS or BFS to explore all adjacent pixels (up, down, left, right) that match the original color.

### Step-by-Step Explanation:
1. **Check base case**: If the starting pixel's color is already the target color, return the image unchanged.

2. **Initialize DFS or BFS**: Store the original color. Change the starting pixel to the new color.

3. **Traverse connected pixels**: Use a stack (DFS) or queue (BFS) to visit all pixels that are adjacent and have the original color, changing them to the new color.

4. **Return the modified image**.

### Time Complexity:
- O(m * n), as we may visit each pixel at most once.

### Space Complexity:
- O(m * n), in the worst case for the recursion stack or queue.
