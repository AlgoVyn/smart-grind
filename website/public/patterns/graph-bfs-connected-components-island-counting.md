# Graph - BFS Connected Components

## Problem Description

The **Graph BFS - Connected Components / Island Counting** pattern uses Breadth-First Search (BFS) to identify and count connected components in an undirected graph or to count "islands" in a 2D grid. BFS explores nodes level by level, providing an iterative approach to connectivity analysis.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| **Input** | Undirected graph (adjacency list) or 2D grid |
| **Output** | Number of connected components or islands |
| **Key Insight** | Each BFS from an unvisited node discovers one component |
| **Time Complexity** | O(V + E) for graphs, O(rows × cols) for grids |
| **Space Complexity** | O(V) or O(rows × cols) for visited tracking |

### When to Use

- **Counting distinct groups**: Finding number of friend circles, networks, or clusters
- **Grid island counting**: Finding distinct land masses in a 2D grid
- **Connectivity analysis**: Determining if all nodes are connected
- **Iterative traversal preferred**: When recursion stack overflow is a concern
- **Level-order insights needed**: When you need shortest path in unweighted graphs

---

## Intuition

### Core Insight

The key insight behind BFS for connected components is that **each complete BFS traversal visits exactly one connected component**:

1. **Start from any unvisited node** - This begins exploring a new component
2. **BFS visits all reachable nodes** - All nodes in the same component are discovered
3. **Mark all visited nodes** - So we don't start BFS from them again
4. **Count increments per BFS start** - Each new BFS start = new component
5. **Repeat until all nodes visited** - Handles disconnected graphs

### The "Aha!" Moments

1. **Why BFS instead of DFS?** Both work for connectivity! BFS is iterative (no stack overflow), DFS is often simpler to write. Choose based on constraints.

2. **How does BFS track visited?** Use a Set, boolean array, or modify grid in-place. Grid problems often use in-place marking with a special value like '0'.

3. **What's the difference for grids vs graphs?** Grids have implicit adjacency (4 directions), graphs have explicit adjacency lists. The core BFS logic remains the same.

### Component Discovery Visualization

```
Graph:     0 --- 1     3 --- 4
           |     |     |
           2     5     6

BFS 1: Start at 0 → visits 0,1,2,5 (Component 1)
BFS 2: Next unvisited is 3 → visits 3,4,6 (Component 2)
Total: 2 components
```

---

## Solution Approaches

### Approach 1: BFS for Graph Connected Components ⭐

Standard BFS approach for counting connected components in a graph.

#### Algorithm

1. **Initialize visited set** and component counter
2. **Iterate through all nodes**:
   - If node unvisited, increment counter and start BFS
3. **BFS function**:
   - Initialize queue with starting node
   - Mark as visited
   - While queue not empty:
     - Dequeue node
     - Enqueue all unvisited neighbors
     - Mark neighbors as visited
4. **Return component count**

#### Implementation

````carousel
```python
from collections import deque
from typing import List, Dict, Set

def count_connected_components(graph: Dict[int, List[int]]) -> int:
    """
    Count connected components in an undirected graph using BFS.
    
    Args:
        graph: Adjacency list representation
        
    Returns:
        Number of connected components
    """
    if not graph:
        return 0
    
    visited = set()
    components = 0
    
    def bfs(start: int):
        queue = deque([start])
        visited.add(start)
        
        while queue:
            node = queue.popleft()
            for neighbor in graph[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
    
    for node in graph:
        if node not in visited:
            components += 1
            bfs(node)
    
    return components


def find_components(graph: Dict[int, List[int]]) -> List[List[int]]:
    """
    Find all connected components and return them as lists.
    """
    if not graph:
        return []
    
    visited = set()
    all_components = []
    
    def bfs(start: int) -> List[int]:
        component = []
        queue = deque([start])
        visited.add(start)
        
        while queue:
            node = queue.popleft()
            component.append(node)
            for neighbor in graph[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        
        return component
    
    for node in graph:
        if node not in visited:
            all_components.append(bfs(node))
    
    return all_components
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <unordered_set>
using namespace std;

class Solution {
public:
    int countComponents(int n, vector<vector<int>>& edges) {
        // Build adjacency list
        vector<vector<int>> graph(n);
        for (auto& edge : edges) {
            graph[edge[0]].push_back(edge[1]);
            graph[edge[1]].push_back(edge[0]);
        }
        
        vector<bool> visited(n, false);
        int components = 0;
        
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                components++;
                bfs(i, graph, visited);
            }
        }
        
        return components;
    }
    
private:
    void bfs(int start, vector<vector<int>>& graph, vector<bool>& visited) {
        queue<int> q;
        q.push(start);
        visited[start] = true;
        
        while (!q.empty()) {
            int node = q.front();
            q.pop();
            
            for (int neighbor : graph[node]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.push(neighbor);
                }
            }
        }
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int countComponents(int n, int[][] edges) {
        // Build adjacency list
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }
        
        for (int[] edge : edges) {
            graph.get(edge[0]).add(edge[1]);
            graph.get(edge[1]).add(edge[0]);
        }
        
        boolean[] visited = new boolean[n];
        int components = 0;
        
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                components++;
                bfs(i, graph, visited);
            }
        }
        
        return components;
    }
    
    private void bfs(int start, List<List<Integer>> graph, boolean[] visited) {
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(start);
        visited[start] = true;
        
        while (!queue.isEmpty()) {
            int node = queue.poll();
            
            for (int neighbor : graph.get(node)) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.offer(neighbor);
                }
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
var countComponents = function(n, edges) {
    // Build adjacency list
    const graph = Array.from({ length: n }, () => []);
    
    for (const [u, v] of edges) {
        graph[u].push(v);
        graph[v].push(u);
    }
    
    const visited = new Array(n).fill(false);
    let components = 0;
    
    const bfs = (start) => {
        const queue = [start];
        visited[start] = true;
        
        while (queue.length > 0) {
            const node = queue.shift();
            
            for (const neighbor of graph[node]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    queue.push(neighbor);
                }
            }
        }
    };
    
    for (let i = 0; i < n; i++) {
        if (!visited[i]) {
            components++;
            bfs(i);
        }
    }
    
    return components;
};
```
````

---

### Approach 2: BFS for Grid Island Counting

Adaptation for 2D grids where land is represented by '1' and water by '0'.

#### Algorithm

1. **Iterate through all cells** in the grid
2. **When finding unvisited land** ('1'):
   - Increment island count
   - Start BFS to mark entire island as visited
3. **BFS marks visited** by changing '1' to '0' (in-place)
4. **Return island count**

#### Implementation

````carousel
```python
from collections import deque
from typing import List

def num_islands(grid: List[List[str]]) -> int:
    """
    Count number of islands in a 2D grid.
    '1' = land, '0' = water
    
    Args:
        grid: 2D grid of characters
        
    Returns:
        Number of islands
    """
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    islands = 0
    
    def bfs(r: int, c: int):
        queue = deque([(r, c)])
        grid[r][c] = '0'  # Mark as visited
        
        directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
        
        while queue:
            row, col = queue.popleft()
            
            for dr, dc in directions:
                nr, nc = row + dr, col + dc
                if (0 <= nr < rows and 0 <= nc < cols and 
                    grid[nr][nc] == '1'):
                    grid[nr][nc] = '0'  # Mark as visited
                    queue.append((nr, nc))
    
    for i in range(rows):
        for j in range(cols):
            if grid[i][j] == '1':
                islands += 1
                bfs(i, j)
    
    return islands


def max_area_of_island(grid: List[List[int]]) -> int:
    """
    Find maximum area of an island.
    1 = land, 0 = water
    """
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    max_area = 0
    
    def bfs(r: int, c: int) -> int:
        area = 0
        queue = deque([(r, c)])
        grid[r][c] = 0  # Mark visited
        
        directions = [(-1, 0), (1, 0), (0, -1), (0, 1)]
        
        while queue:
            row, col = queue.popleft()
            area += 1
            
            for dr, dc in directions:
                nr, nc = row + dr, col + dc
                if (0 <= nr < rows and 0 <= nc < cols and 
                    grid[nr][nc] == 1):
                    grid[nr][nc] = 0
                    queue.append((nr, nc))
        
        return area
    
    for i in range(rows):
        for j in range(cols):
            if grid[i][j] == 1:
                max_area = max(max_area, bfs(i, j))
    
    return max_area
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        if (grid.empty() || grid[0].empty()) return 0;
        
        int rows = grid.size();
        int cols = grid[0].size();
        int islands = 0;
        
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (grid[i][j] == '1') {
                    islands++;
                    bfs(grid, i, j);
                }
            }
        }
        
        return islands;
    }
    
private:
    void bfs(vector<vector<char>>& grid, int r, int c) {
        int rows = grid.size();
        int cols = grid[0].size();
        
        queue<pair<int, int>> q;
        q.push({r, c});
        grid[r][c] = '0';
        
        vector<pair<int, int>> dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
        
        while (!q.empty()) {
            auto [row, col] = q.front();
            q.pop();
            
            for (auto [dr, dc] : dirs) {
                int nr = row + dr;
                int nc = col + dc;
                
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && 
                    grid[nr][nc] == '1') {
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
import java.util.*;

class Solution {
    public int numIslands(char[][] grid) {
        if (grid == null || grid.length == 0) return 0;
        
        int rows = grid.length;
        int cols = grid[0].length;
        int islands = 0;
        
        for (int i = 0; i < rows; i++) {
            for (int j = 0; j < cols; j++) {
                if (grid[i][j] == '1') {
                    islands++;
                    bfs(grid, i, j);
                }
            }
        }
        
        return islands;
    }
    
    private void bfs(char[][] grid, int r, int c) {
        int rows = grid.length;
        int cols = grid[0].length;
        
        Queue<int[]> queue = new LinkedList<>();
        queue.offer(new int[]{r, c});
        grid[r][c] = '0';
        
        int[][] dirs = {{-1, 0}, {1, 0}, {0, -1}, {0, 1}};
        
        while (!queue.isEmpty()) {
            int[] cell = queue.poll();
            int row = cell[0], col = cell[1];
            
            for (int[] dir : dirs) {
                int nr = row + dir[0];
                int nc = col + dir[1];
                
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && 
                    grid[nr][nc] == '1') {
                    grid[nr][nc] = '0';
                    queue.offer(new int[]{nr, nc});
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
var numIslands = function(grid) {
    if (!grid || grid.length === 0) return 0;
    
    const rows = grid.length;
    const cols = grid[0].length;
    let islands = 0;
    
    const bfs = (r, c) => {
        const queue = [[r, c]];
        grid[r][c] = '0';
        
        const dirs = [[-1, 0], [1, 0], [0, -1], [0, 1]];
        
        while (queue.length > 0) {
            const [row, col] = queue.shift();
            
            for (const [dr, dc] of dirs) {
                const nr = row + dr;
                const nc = col + dc;
                
                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && 
                    grid[nr][nc] === '1') {
                    grid[nr][nc] = '0';
                    queue.push([nr, nc]);
                }
            }
        }
    };
    
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] === '1') {
                islands++;
                bfs(i, j);
            }
        }
    }
    
    return islands;
};
```
````

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity | Best For |
|----------|----------------|------------------|----------|
| **Graph BFS** | O(V + E) | O(V) | General graph connectivity |
| **Grid BFS** | O(rows × cols) | O(min(rows, cols)) | 2D grid problems |

**Where:**
- `V` = number of vertices, `E` = number of edges
- `rows`, `cols` = grid dimensions

**Space Breakdown:**
- Visited tracking: O(V) for graphs, O(1) for in-place grid marking
- BFS queue: O(V) worst case or O(min(rows, cols)) for grids

---

## Related Problems

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **Number of Islands** | [Link](https://leetcode.com/problems/number-of-islands/) | Classic island counting |
| **Flood Fill** | [Link](https://leetcode.com/problems/flood-fill/) | Simple BFS/DFS coloring |
| **Max Area of Island** | [Link](https://leetcode.com/problems/max-area-of-island/) | Find largest island |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **Number of Connected Components** | [Link](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) | Graph connectivity |
| **Friend Circles** | [Link](https://leetcode.com/problems/friend-circles/) | Adjacency matrix version |
| **Island Perimeter** | [Link](https://leetcode.com/problems/island-perimeter/) | Count perimeter edges |
| **Rotting Oranges** | [Link](https://leetcode.com/problems/rotting-oranges/) | Multi-source BFS |
| **Walls and Gates** | [Link](https://leetcode.com/problems/walls-and-gates/) | Multi-source shortest path |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| **Number of Islands II** | [Link](https://leetcode.com/problems/number-of-islands-ii/) | Dynamic connectivity with Union-Find |
| **Making A Large Island** | [Link](https://leetcode.com/problems/making-a-large-island/) | Optimize by flipping one 0 |
| **Longest Increasing Path in Matrix** | [Link](https://leetcode.com/problems/longest-increasing-path-in-a-matrix/) | DFS with memoization |

---

## Video Tutorial Links

1. [Number of Islands - NeetCode](https://www.youtube.com/watch?v=pV2kpPD66nE) - Complete BFS/DFS explanation
2. [Connected Components - WilliamFiset](https://www.youtube.com/watch?v=2b19A1Z8IVE) - Graph theory basics
3. [BFS vs DFS for Islands](https://www.youtube.com/watch?v=__98uL6JUsE) - Comparison and trade-offs
4. [Graph Traversals - Abdul Bari](https://www.youtube.com/watch?v=pcKY4hjDrxk) - Comprehensive BFS/DFS

---

## Summary

### Key Takeaways

1. **BFS discovers one component per start** - Each unvisited node starts a new BFS = new component
2. **Mark visited when enqueuing** - Not when dequeuing, to avoid duplicates
3. **Iterate through all nodes** - Handles disconnected graphs correctly
4. **In-place grid marking** - Use '0' or '#' to mark visited in grid problems
5. **Four directions for grids** - Up, down, left, right (no diagonals unless specified)

### Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| **Marking visited when dequeuing** | Mark when enqueuing to avoid processing same cell multiple times |
| **Not iterating all nodes** | Always loop through all nodes - handles disconnected graphs |
| **Wrong grid bounds check** | Check `0 <= nr < rows` before accessing |
| **Modifying grid during iteration** | For grid BFS, mark visited immediately to prevent reprocessing |
| **Using DFS with deep recursion** | For large grids, BFS avoids stack overflow |

### Follow-up Questions

**Q1: When should you use DFS instead of BFS for connected components?**

Either works for connectivity! Use DFS when:
- You need path finding (not just counting)
- Code simplicity is preferred
- Stack overflow isn't a concern

Use BFS when:
- Finding shortest path in unweighted graph
- Stack overflow is a concern with deep graphs
- Level-order processing is needed

**Q2: How do you handle diagonal connections in grid problems?**

Add four more directions: `(-1,-1), (-1,1), (1,-1), (1,1)` for the 8-directional case.

**Q3: Can you use Union-Find for connected components?**

Yes! Union-Find is another O(V + E) approach that's often simpler for pure counting. BFS/DFS are better when you need component details.

**Q4: How do you find the number of islands when you can modify at most one 0 to 1?**

Use the "Making A Large Island" approach: label each island with a unique ID, count sizes, then check each 0's neighbors to find the best merge.

---

## Pattern Source

For more graph pattern implementations, see:
- **[Graph - DFS Cycle Detection](/patterns/graph-dfs-cycle-detection-directed-graph)**
- **[Graph - Union Find](/patterns/graph-union-find-disjoint-set-union-dsu)**
- **[Graph - BFS Topological Sort](/patterns/graph-bfs-topological-sort-kahn-s)**
- **[Backtracking - Word Search Grid](/patterns/backtracking-word-search-path-finding-in-grid)**

---

## Additional Resources

- [LeetCode Number of Islands](https://leetcode.com/problems/number-of-islands/)
- [LeetCode Number of Connected Components](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/)
- [GeeksforGeeks Connected Components](https://www.geeksforgeeks.org/connected-components-in-an-undirected-graph/)
- [BFS vs DFS Guide](https://www.geeksforgeeks.org/bfs-vs-dfs-binary-tree/)
