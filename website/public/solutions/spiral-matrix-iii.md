# Spiral Matrix III

## LeetCode Link

[LeetCode Problem 885: Spiral Matrix III](https://leetcode.com/problems/spiral-matrix-iii/)

## Pattern:

Grid Simulation with Direction Pattern

This problem uses a **simulation** approach where we walk in a spiral pattern on the grid. The key insight is that we alternate between moving in 4 directions (east, south, west, north) and the step size increases after every 2 directions (1,1,2,2,3,3,...). The algorithm continues until all cells are visited.

## Common Pitfalls

- **Step size pattern**: Remember step increases after every 2 directions, not after each direction.
- **Boundary checking**: Positions outside the grid should still be considered during movement but only added to result when within bounds.
- **Early termination**: Check if we've visited all cells (rows * cols) to avoid unnecessary iterations.
- **Direction order**: The directions must be in clockwise order: east → south → west → north.

---

## Problem Description

You start at the cell `(rStart, cStart)` of an `rows x cols` grid facing east. The northwest corner is at the first row and column in the grid, and the southeast corner is at the last row and column.

You will walk in a clockwise spiral shape to visit every position in this grid. Whenever you move outside the grid's boundary, we continue our walk outside the grid (but may return to the grid boundary later.). Eventually, we reach all `rows * cols` spaces of the grid.

Return an array of coordinates representing the positions of the grid in the order you visited them.

## Examples

**Example 1:**
```python
Input: rows = 1, cols = 4, rStart = 0, cStart = 0
Output: [[0,0],[0,1],[0,2],[0,3]]
```

**Example 2:**
```python
Input: rows = 5, cols = 6, rStart = 1, cStart = 4
Output: [[1,4],[1,5],[2,5],[2,4],[2,3],[1,3],[0,3],[0,4],[0,5],[3,5],[3,4],[3,3],[3,2],[2,2],[1,2],[0,2],[4,5],[4,4],[4,3],[4,2],[4,1],[3,1],[2,1],[1,1],[0,1],[4,0],[3,0],[2,0],[1,0],[0,0]]
```

## Constraints

- `1 <= rows, cols <= 100`
- `0 <= rStart < rows`
- `0 <= cStart < cols`

---

## Intuition

The key insight for this problem is understanding the spiral movement pattern and how to systematically visit all cells in a grid.

### Key Observations

1. **Spiral Movement**: Starting from a given position, we move in a clockwise spiral: East → South → West → North → repeat.

2. **Step Size Pattern**: The number of steps we take follows a specific pattern: 1, 1, 2, 2, 3, 3, 4, 4, ... We increase the step size after every 2 directions (after East and West, or after South and North).

3. **Boundary Handling**: We continue moving even outside the grid boundary. We only record positions that are within the grid.

4. **Complete Coverage**: We stop when we've visited all rows × cols cells.

### Why It Works

The simulation approach works because:
- The step pattern guarantees we cover increasingly larger areas
- By checking boundaries before recording, we handle the "outside the grid" movement correctly
- The algorithm naturally spirals outward until all cells are visited
- Time complexity is O(R × C) since we visit each cell exactly once

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Direction Simulation (Optimal)** - O(R×C) time
2. **Mathematical** - Calculate positions directly

---

## Approach 1: Direction Simulation (Optimal)

### Code Implementation

````carousel
```python
class Solution:
    def spiralMatrixIII(self, R: int, C: int, r0: int, c0: int):
        result = []
        dr = [0, 1, 0, -1]  # right, down, left, up
        dc = [1, 0, -1, 0]
        
        r, c = r0, c0
        total = R * C
        step = 1
        
        while len(result) < total:
            for d in range(4):
                for _ in range(step):
                    if 0 <= r < R and 0 <= c < C:
                        result.append([r, c])
                    r += dr[d]
                    c += dc[d]
                    
                    if len(result) == total:
                        return result
                
                # After right and left, increase step
                if d % 2 == 0:
                    step += 1
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<vector<int>> spiralMatrixIII(int R, int C, int r0, int c0) {
        vector<vector<int>> result;
        int dr[] = {0, 1, 0, -1};
        int dc[] = {1, 0, -1, 0};
        
        int r = r0, c = c0;
        int step = 1;
        
        while (result.size() < R * C) {
            for (int d = 0; d < 4; d++) {
                for (int i = 0; i < step; i++) {
                    if (r >= 0 && r < R && c >= 0 && c < C) {
                        result.push_back({r, c});
                    }
                    r += dr[d];
                    c += dc[d];
                    
                    if (result.size() == R * C) {
                        return result;
                    }
                }
                
                if (d % 2 == 0) {
                    step++;
                }
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[][] spiralMatrixIII(int R, int C, int r0, int c0) {
        List<int[]> result = new ArrayList<>();
        int[] dr = {0, 1, 0, -1};
        int[] dc = {1, 0, -1, 0};
        
        int r = r0, c = c0;
        int step = 1;
        
        while (result.size() < R * C) {
            for (int d = 0; d < 4; d++) {
                for (int i = 0; i < step; i++) {
                    if (r >= 0 && r < R && c >= 0 && c < C) {
                        result.add(new int[]{r, c});
                    }
                    r += dr[d];
                    c += dc[d];
                    
                    if (result.size() == R * C) {
                        return result.toArray(new int[0][]);
                    }
                }
                
                if (d % 2 == 0) {
                    step++;
                }
            }
        }
        
        return result.toArray(new int[0][]);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} R
 * @param {number} C
 * @param {number} r0
 * @param {number} c0
 * @return {number[][]}
 */
var spiralMatrixIII = function(R, C, r0, c0) {
    const result = [];
    const dr = [0, 1, 0, -1];
    const dc = [1, 0, -1, 0];
    
    let r = r0, c = c0;
    let step = 1;
    
    while (result.length < R * C) {
        for (let d = 0; d < 4; d++) {
            for (let i = 0; i < step; i++) {
                if (r >= 0 && r < R && c >= 0 && c < C) {
                    result.push([r, c]);
                }
                r += dr[d];
                c += dc[d];
                
                if (result.length === R * C) {
                    return result;
                }
            }
            
            if (d % 2 === 0) {
                step++;
            }
        }
    }
    
    return result;
};
```
````

---

## Approach 2: Layer-by-Layer

### Code Implementation

````carousel
```python
class Solution:
    def spiralMatrixIII(self, R: int, C: int, r0: int, c0: int):
        result = []
        max_dist = max(R, C)
        
        for dist in range(max_dist + 1):
            for dr in range(-dist, dist + 1):
                for dc in range(-dist, dist + 1):
                    r, c = r0 + dr, c0 + dc
                    if (abs(dr) == dist or abs(dc) == dist) and \
                       0 <= r < R and 0 <= c < C:
                        result.append([r, c])
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<vector<int>> spiralMatrixIII(int R, int C, int r0, int c0) {
        vector<vector<int>> result;
        int maxDist = max(R, C);
        
        for (int dist = 0; dist <= maxDist; dist++) {
            for (int dr = -dist; dr <= dist; dr++) {
                for (int dc = -dist; dc <= dist; dc++) {
                    int r = r0 + dr, c = c0 + dc;
                    if ((abs(dr) == dist || abs(dc) == dist) &&
                        r >= 0 && r < R && c >= 0 && c < C) {
                        result.push_back({r, c});
                    }
                }
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[][] spiralMatrixIII(int R, int C, int r0, int c0) {
        List<int[]> result = new ArrayList<>();
        int maxDist = Math.max(R, C);
        
        for (int dist = 0; dist <= maxDist; dist++) {
            for (int dr = -dist; dr <= dist; dr++) {
                for (int dc = -dist; dc <= dist; dc++) {
                    int r = r0 + dr, c = c0 + dc;
                    if ((Math.abs(dr) == dist || Math.abs(dc) == dist) &&
                        r >= 0 && r < R && c >= 0 && c < C) {
                        result.add(new int[]{r, c});
                    }
                }
            }
        }
        
        return result.toArray(new int[0][]);
    }
}
```

<!-- slide -->
```javascript
var spiralMatrixIII = function(R, C, r0, c0) {
    const result = [];
    const maxDist = Math.max(R, C);
    
    for (let dist = 0; dist <= maxDist; dist++) {
        for (let dr = -dist; dr <= dist; dr++) {
            for (let dc = -dist; dc <= dist; dc++) {
                const r = r0 + dr, c = c0 + dc;
                if ((Math.abs(dr) === dist || Math.abs(dc) === dist) &&
                    r >= 0 && r < R && c >= 0 && c < C) {
                    result.push([r, c]);
                }
            }
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Approach | Time | Space |
|----------|------|-------|
| Direction Simulation | O(R×C) | O(R×C) |
| Layer-by-Layer | O(R×C×max(R,C)) | O(R×C) |

---

## Related Problems

| Problem | LeetCode | Description |
|---------|----------|-------------|
| [Spiral Matrix](/solutions/spiral-matrix.md) | 54 | 2D spiral |
| [Spiral Matrix II](/solutions/spiral-matrix-ii.md) | 59 | Generate spiral |

---

## Video Tutorial Links

1. **[Spiral Matrix III - Explanation](https://www.youtube.com/watch?v=XXXXX)**

---

## Follow-up Questions

### Q1: How does the direction simulation work?
**Answer:** Increment steps after each right and left movement.

---

## Summary

---

## Solution (Original)

```python
from typing import List

class Solution:
    def spiralMatrixIII(self, rows: int, cols: int, rStart: int, cStart: int) -> List[List[int]]:
        result = [[rStart, cStart]]
        if rows * cols == 1:
            return result
        
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]  # east, south, west, north
        r, c = rStart, cStart
        step = 1
        dir_idx = 0
        
        while len(result) < rows * cols:
            for _ in range(2):  # two directions per step size
                for _ in range(step):
                    r += directions[dir_idx][0]
                    c += directions[dir_idx][1]
                    if 0 <= r < rows and 0 <= c < cols:
                        result.append([r, c])
                dir_idx = (dir_idx + 1) % 4
            step += 1
        
        return result
```

---

## Explanation

This problem traverses the grid in a spiral order starting from `(rStart, cStart)`, allowing moves outside the grid, and collects all grid positions in the order visited.

### Step-by-Step Approach:

1. **Initialization**: Start at `(rStart, cStart)`, add to result. Directions: east, south, west, north.

2. **Spiral Movement**: Use increasing step sizes (1,1,2,2,3,3,...). For each pair of directions, move step times in each direction.

3. **Collect Positions**: For each move, update position, if within bounds, add to result.

4. **Continue**: Until all positions are collected.

### Time Complexity:

- **O(rows * cols)**, as we visit each cell once.

### Space Complexity:

- **O(rows * cols)** for the result list.
