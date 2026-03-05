# Graph DFS - Connected Components / Island Counting

## Problem Description

This pattern uses Depth-First Search (DFS) to identify and count connected components in an undirected graph or to count "islands" in a 2D grid. A connected component is a subgraph where every pair of vertices is connected by a path. In grid problems, islands are groups of adjacent land cells (typically '1's) surrounded by water ('0's).

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(V + E) for graphs, O(m × n) for grids |
| Space Complexity | O(V) or O(m × n) for visited set |
| Input | Graph (adjacency list) or 2D grid |
| Output | Number of connected components or islands |
| Approach | DFS/BFS traversal with visited tracking |

### When to Use

- Count distinct groups or clusters in a graph
- Identify separate regions in a grid (islands in a map)
- Solve connectivity problems in undirected graphs
- Mark visited areas to avoid revisiting
- Find all regions with certain properties
- Connected component labeling

## Intuition

The key insight is that each time we find an unvisited node or land cell, it represents a new connected component that we need to explore fully.

The "aha!" moments:

1. **Start fresh**: Each unvisited node/land cell starts a new component
2. **Flood fill**: DFS explores all reachable nodes from starting point
3. **Mark as visited**: Track visited to avoid counting same component twice
4. **Iterate all nodes**: Check every node/cell to ensure no component is missed
5. **Boundary checking**: In grids, check bounds before exploring neighbors

## Solution Approaches

### Approach 1: DFS for Graph Connected Components ✅ Recommended

#### Algorithm

1. Initialize visited set and component count to 0
2. Iterate through all nodes in the graph:
   - If node not visited:
     - Increment component count
     - Run DFS from this node to mark all connected nodes as visited
3. Return component count

#### Implementation

````carousel
```python
def count_connected_components(n: int, edges: list[list[int]]) -> int:
    """
    Count connected components in undirected graph.
    Time: O(V + E), Space: O(V)
    """
    # Build adjacency list
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
    
    visited = [False] * n
    
    def dfs(node):
        visited[node] = True
        for neighbor in graph[node]:
            if not visited[neighbor]:
                dfs(neighbor)
    
    components = 0
    for i in range(n):
        if not visited[i]:
            dfs(i)
            components += 1
    
    return components


def find_connected_components(graph: dict) -> list[list]:
    """
    Find all connected components with their nodes.
    """
    visited = set()
    components = []
    
    def dfs(node, component):
        visited.add(node)
        component.append(node)
        for neighbor in graph.get(node, []):
            if neighbor not in visited:
                dfs(neighbor, component)
    
    for node in graph:
        if node not in visited:
            component = []
            dfs(node, component)
            components.append(component)
    
    return components
```
<!-- slide -->
```cpp
class Solution {
public:
    int countComponents(int n, vector<vector<int>>& edges) {
        vector<vector<int>> graph(n);
        for (const auto& e : edges) {
            graph[e[0]].push_back(e[1]);
            graph[e[1]].push_back(e[0]);
        }
        
        vector<bool> visited(n, false);
        int components = 0;
        
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                dfs(i, graph, visited);
                components++;
            }
        }
        
        return components;
    }
    
private:
    void dfs(int node, vector<vector<int>>& graph, vector<bool>& visited) {
        visited[node] = true;
        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                dfs(neighbor, graph, visited);
            }
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public int countComponents(int n, int[][] edges) {
        List<Integer>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        
        for (int[] e : edges) {
            graph[e[0]].add(e[1]);
            graph[e[1]].add(e[0]);
        }
        
        boolean[] visited = new boolean[n];
        int components = 0;
        
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                dfs(i, graph, visited);
                components++;
            }
        }
        
        return components;
    }
    
    private void dfs(int node, List<Integer>[] graph, boolean[] visited) {
        visited[node] = true;
        for (int neighbor : graph[node]) {
            if (!visited[neighbor]) {
                dfs(neighbor, graph, visited);
            }
        }
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {number}
 */
function countComponents(n, edges) {
    const graph = Array.from({length: n}, () => []);
    
    for (const [u, v] of edges) {
        graph[u].push(v);
        graph[v].push(u);
    }
    
    const visited = new Array(n).fill(false);
    let components = 0;
    
    function dfs(node) {
        visited[node] = true;
        for (const neighbor of graph[node]) {
            if (!visited[neighbor]) {
                dfs(neighbor);
            }
        }
    }
    
    for (let i = 0; i < n; i++) {
        if (!visited[i]) {
            dfs(i);
            components++;
        }
    }
    
    return components;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(V + E) - Visit each vertex and edge once |
| Space | O(V) - Visited array and recursion stack |

### Approach 2: DFS for Island Counting (Grid)

#### Algorithm

1. Initialize count to 0 and handle edge case (empty grid)
2. Iterate through each cell in the grid:
   - If cell is land ('1') and not visited:
     - Increment island count
     - Run DFS to mark all connected land cells as visited
3. Return island count

#### Implementation

````carousel
```python
def num_islands(grid: list[list[str]]) -> int:
    """
    Count islands in 2D grid.
    LeetCode 200 - Number of Islands
    Time: O(m × n), Space: O(m × n)
    """
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    visited = [[False] * cols for _ in range(rows)]
    
    def dfs(r, c):
        # Check bounds and if cell is land and not visited
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            grid[r][c] == '0' or visited[r][c]):
            return
        
        visited[r][c] = True
        
        # Explore 4 directions
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    
    islands = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1' and not visited[r][c]:
                dfs(r, c)
                islands += 1
    
    return islands


def num_islands_inplace(grid: list[list[str]]) -> int:
    """
    Count islands using in-place marking (modifies grid).
    Space: O(1) extra space
    """
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    
    def dfs(r, c):
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            grid[r][c] != '1'):
            return
        
        grid[r][c] = '0'  # Mark as visited by sinking the island
        
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
    
    islands = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                dfs(r, c)
                islands += 1
    
    return islands
```
<!-- slide -->
```cpp
class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty() || grid[0].empty()) return 0;
        
        int rows = grid.size();
        int cols = grid[0].size();
        int islands = 0;
        
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == '1') {
                    dfs(grid, r, c);
                    islands++;
                }
            }
        }
        
        return islands;
    }
    
private:
    void dfs(vector<vector<char>>& grid, int r, int c) {
        int rows = grid.size();
        int cols = grid[0].size();
        
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != '1') {
            return;
        }
        
        grid[r][c] = '0';  // Mark as visited
        
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
};
```
<!-- slide -->
```java
class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        
        int rows = grid.length;
        int cols = grid[0].length;
        int islands = 0;
        
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == '1') {
                    dfs(grid, r, c);
                    islands++;
                }
            }
        }
        
        return islands;
    }
    
    private void dfs(char[][] grid, int r, int c) {
        int rows = grid.length;
        int cols = grid[0].length;
        
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] != '1') {
            return;
        }
        
        grid[r][c] = '0';  // Mark as visited
        
        dfs(grid, r + 1, c);
        dfs(grid, r - 1, c);
        dfs(grid, r, c + 1);
        dfs(grid, r, c - 1);
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {character[][]} grid
 * @return {number}
 */
function numIslands(grid) {
    if (!grid || grid.length === 0) return 0;
    
    const rows = grid.length;
    const cols = grid[0].length;
    let islands = 0;
    
    function dfs(r, c) {
        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== '1') {
            return;
        }
        
        grid[r][c] = '0';  // Mark as visited
        
        dfs(r + 1, c);
        dfs(r - 1, c);
        dfs(r, c + 1);
        dfs(r, c - 1);
    }
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '1') {
                dfs(r, c);
                islands++;
            }
        }
    }
    
    return islands;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(m × n) - Visit each cell once |
| Space | O(m × n) - Visited array or recursion stack |

### Approach 3: BFS for Island Counting

#### Implementation

````carousel
```python
from collections import deque

def num_islands_bfs(grid: list[list[str]]) -> int:
    """
    Count islands using BFS.
    Time: O(m × n), Space: O(min(m, n))
    """
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    islands = 0
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                islands += 1
                grid[r][c] = '0'
                
                queue = deque([(r, c)])
                while queue:
                    cr, cc = queue.popleft()
                    for dr, dc in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                        nr, nc = cr + dr, cc + dc
                        if (0 <= nr < rows and 0 <= nc < cols and
                            grid[nr][nc] == '1'):
                            grid[nr][nc] = '0'
                            queue.append((nr, nc))
    
    return islands
```
<!-- slide -->
```cpp
class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty() || grid[0].empty()) return 0;
        
        int rows = grid.size(), cols = grid[0].size();
        int islands = 0;
        
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == '1') {
                    islands++;
                    bfs(grid, r, c);
                }
            }
        }
        return islands;
    }
    
private:
    void bfs(vector<vector<char>>& grid, int r, int c) {
        int rows = grid.size(), cols = grid[0].size();
        queue<pair<int, int>> q;
        q.push({r, c});
        grid[r][c] = '0';
        
        vector<pair<int, int>> dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
        
        while (!q.empty()) {
            auto [cr, cc] = q.front();
            q.pop();
            
            for (auto [dr, dc] : dirs) {
                int nr = cr + dr, nc = cc + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == '1') {
                    grid[nr][nc] = '0';
                    q.push({nr, nc});
                }
            }
        }
    }
};
```
<!-- slide -->
```java
class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        
        int rows = grid.length, cols = grid[0].length;
        int islands = 0;
        
        for (int r = 0; r < rows; r++) {
            for (int c = 0; c < cols; c++) {
                if (grid[r][c] == '1') {
                    islands++;
                    bfs(grid, r, c);
                }
            }
        }
        return islands;
    }
    
    private void bfs(char[][] grid, int r, int c) {
        int rows = grid.length, cols = grid[0].length;
        Queue<int[]> q = new LinkedList<>();
        q.offer(new int[]{r, c});
        grid[r][c] = '0';
        
        int[][] dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
        
        while (!q.isEmpty()) {
            int[] curr = q.poll();
            for (int[] d : dirs) {
                int nr = curr[0] + d[0], nc = curr[1] + d[1];
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] == '1') {
                    grid[nr][nc] = '0';
                    q.offer(new int[]{nr, nc});
                }
            }
        }
    }
}
```
<!-- slide -->
```javascript
/**
 * @param {character[][]} grid
 * @return {number}
 */
function numIslands(grid) {
    if (!grid || grid.length === 0) return 0;
    
    const rows = grid.length, cols = grid[0].length;
    let islands = 0;
    
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] === '1') {
                islands++;
                bfs(grid, r, c);
            }
        }
    }
    return islands;
    
    function bfs(startR, startC) {
        const queue = [[startR, startC]];
        grid[startR][startC] = '0';
        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        
        while (queue.length > 0) {
            const [cr, cc] = queue.shift();
            for (const [dr, dc] of dirs) {
                const nr = cr + dr, nc = cc + dc;
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === '1') {
                    grid[nr][nc] = '0';
                    queue.push([nr, nc]);
                }
            }
        }
    }
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(m × n) - Visit each cell once |
| Space | O(min(m, n)) - Queue size in worst case |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| DFS (Graph) | O(V + E) | O(V) | **Recommended** - Simple recursion |
| DFS (Grid) | O(m × n) | O(m × n) | **Recommended** - In-place marking |
| BFS (Grid) | O(m × n) | O(min(m, n)) | When stack overflow is a concern |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Number of Islands](https://leetcode.com/problems/number-of-islands/) | 200 | Medium | Count islands in 2D grid |
| [Number of Provinces](https://leetcode.com/problems/number-of-provinces/) | 547 | Medium | Connected components in matrix |
| [Number of Connected Components](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) | 323 | Medium | Count components in graph |
| [Max Area of Island](https://leetcode.com/problems/max-area-of-island/) | 695 | Medium | Find largest island |
| [Island Perimeter](https://leetcode.com/problems/island-perimeter/) | 463 | Easy | Calculate perimeter of island |
| [Surrounded Regions](https://leetcode.com/problems/surrounded-regions/) | 130 | Medium | Capture surrounded regions |
| [Rotting Oranges](https://leetcode.com/problems/rotting-oranges/) | 994 | Medium | BFS from multiple sources |
| [Walls and Gates](https://leetcode.com/problems/walls-and-gates/) | 286 | Medium | Fill empty rooms with distance |

## Video Tutorial Links

1. **[NeetCode - Number of Islands](https://www.youtube.com/watch?v=pV2kpPD66nE)** - DFS and BFS solutions
2. **[Kevin Naughton Jr. - Islands](https://www.youtube.com/watch?v=U6-X_qaPp7k)** - Connected components
3. **[Back To Back SWE - Connected Components](https://www.youtube.com/watch?v=ibjEGG7ylHk)** - Graph traversal
4. **[Nick White - Number of Islands](https://www.youtube.com/watch?v=o8S2bO3pm04)** - Step by step

## Summary

### Key Takeaways

- **Iterate all nodes**: Must check every node/cell to find all components
- **Mark as visited**: Essential to avoid infinite loops and double counting
- **Flood fill**: DFS/BFS explores entire connected region
- **In-place marking**: Can modify grid to save space
- **4-directional**: Usually up, down, left, right (not diagonal)

### Common Pitfalls

- Forgetting to mark nodes as visited before recursing
- Not handling disconnected graphs (iterate through all nodes)
- In grids, not checking bounds properly
- Including diagonal connections when problem specifies 4-directional
- Modifying input without marking (or copying if required)
- Stack overflow with DFS on large grids (use BFS instead)

### Follow-up Questions

1. **How to count islands with diagonal connections?**
   - Check all 8 directions instead of 4

2. **How to find the largest island?**
   - Track area during DFS and return maximum

3. **How to handle multiple grids efficiently?**
   - Reuse visited array or clear it between calls

4. **What if we need to return all island coordinates?**
   - Collect coordinates during DFS and store in list

## Pattern Source

[Graph DFS - Connected Components / Island Counting](patterns/graph-dfs-connected-components-island-counting.md)
