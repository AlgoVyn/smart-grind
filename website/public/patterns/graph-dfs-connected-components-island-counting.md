# Graph DFS - Connected Components / Island Counting

## Overview

This pattern uses Depth-First Search (DFS) to identify and count connected components in an undirected graph or to count "islands" in a 2D grid. A connected component is a subgraph where every pair of vertices is connected by a path. In grid problems, islands are groups of adjacent land cells (typically '1's) surrounded by water ('0's).

Use this pattern when you need to:
- Count the number of distinct groups or clusters in a graph
- Identify separate regions in a grid (like islands in a map)
- Solve problems involving connectivity in undirected graphs

Benefits include:
- Efficient traversal of connected regions
- Clear identification of separate components
- Adaptable to both graph and grid representations

## Key Concepts

- **DFS Traversal**: Recursively explore neighbors from a starting node
- **Visited Set**: Track visited nodes to avoid revisiting and infinite loops
- **Component Counting**: Increment counter each time a new unvisited node is found
- **Grid Adaptation**: Treat grid cells as nodes, with adjacency defined by up/down/left/right moves
- **Connectivity**: Only consider connected through valid edges (graph) or adjacent cells (grid)

## Template

```python
def dfs(node, visited, graph):
    # Mark current node as visited
    visited.add(node)
    
    # Explore all neighbors
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs(neighbor, visited, graph)

def count_connected_components(graph):
    visited = set()
    count = 0
    
    # Iterate through all nodes
    for node in graph:
        if node not in visited:
            # Start DFS from unvisited node
            dfs(node, visited, graph)
            count += 1
    
    return count

# For grid-based island counting
def dfs_grid(grid, i, j, visited):
    # Check bounds and if cell is land and not visited
    if (i < 0 or i >= len(grid) or j < 0 or j >= len(grid[0]) or 
        grid[i][j] == '0' or (i, j) in visited):
        return
    
    # Mark as visited
    visited.add((i, j))
    
    # Explore 4 directions
    dfs_grid(grid, i+1, j, visited)
    dfs_grid(grid, i-1, j, visited)
    dfs_grid(grid, i, j+1, visited)
    dfs_grid(grid, i, j-1, visited)

def num_islands(grid):
    if not grid:
        return 0
    
    visited = set()
    count = 0
    
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j] == '1' and (i, j) not in visited:
                dfs_grid(grid, i, j, visited)
                count += 1
    
    return count
```

## Example Problems

1. **Number of Islands (LeetCode 200)**: Given a 2D grid of '1's (land) and '0's (water), count the number of islands.
2. **Number of Connected Components in an Undirected Graph (LeetCode 323)**: Given n nodes and a list of undirected edges, return the number of connected components.
3. **Friend Circles (LeetCode 547)**: Given a matrix representing friendships, find the total number of friend circles.

## Time and Space Complexity

- **Time Complexity**: O(V + E) for graph traversal, where V is vertices and E is edges. For grids, O(rows * cols).
- **Space Complexity**: O(V) for the visited set in worst case (all nodes visited). Recursion stack can reach O(V) depth.

## Common Pitfalls

- Forgetting to mark nodes as visited before recursing, leading to infinite loops
- Not handling disconnected graphs properly (iterate through all nodes)
- In grids, ensure proper bounds checking and only visit land cells
- Mixing up graph adjacency list vs. grid coordinate systems
- Not considering diagonal connections unless specified (usually only 4-directional)