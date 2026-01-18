# Graph BFS - Connected Components / Island Counting

## Overview

This pattern uses Breadth-First Search (BFS) to identify and count connected components in an undirected graph or to count "islands" in a 2D grid. BFS explores nodes level by level, which can be useful for finding shortest paths in unweighted graphs, though for component counting, the choice between DFS and BFS is often interchangeable.

Use this pattern when you need to:
- Count the number of distinct groups or clusters in a graph
- Identify separate regions in a grid (like islands in a map)
- Prefer iterative over recursive traversal (BFS is iterative)

Benefits include:
- Iterative approach avoids recursion stack overflow for large graphs
- Level-order exploration can provide additional insights if needed
- Same connectivity analysis as DFS but with different traversal mechanics

## Key Concepts

- **BFS Traversal**: Use a queue to explore neighbors level by level
- **Visited Set**: Track visited nodes to prevent revisiting
- **Component Counting**: Increment counter for each new unvisited starting node
- **Grid Adaptation**: Convert grid to graph with 4-directional adjacency
- **Queue Operations**: Enqueue unvisited neighbors, dequeue and process

## Template

```python
from collections import deque

def bfs(node, visited, graph):
    queue = deque([node])
    visited.add(node)
    
    while queue:
        current = queue.popleft()
        
        # Explore all neighbors
        for neighbor in graph[current]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)

def count_connected_components(graph):
    visited = set()
    count = 0
    
    # Iterate through all nodes
    for node in graph:
        if node not in visited:
            # Start BFS from unvisited node
            bfs(node, visited, graph)
            count += 1
    
    return count

# For grid-based island counting
def bfs_grid(grid, i, j, visited):
    queue = deque([(i, j)])
    visited.add((i, j))
    
    while queue:
        x, y = queue.popleft()
        
        # Explore 4 directions
        directions = [(0, 1), (1, 0), (0, -1), (-1, 0)]
        for dx, dy in directions:
            nx, ny = x + dx, y + dy
            if (0 <= nx < len(grid) and 0 <= ny < len(grid[0]) and 
                grid[nx][ny] == '1' and (nx, ny) not in visited):
                visited.add((nx, ny))
                queue.append((nx, ny))

def num_islands(grid):
    if not grid:
        return 0
    
    visited = set()
    count = 0
    
    for i in range(len(grid)):
        for j in range(len(grid[0])):
            if grid[i][j] == '1' and (i, j) not in visited:
                bfs_grid(grid, i, j, visited)
                count += 1
    
    return count
```

## Example Problems

1. **Number of Islands (LeetCode 200)**: Given a 2D grid of '1's (land) and '0's (water), count the number of islands.
2. **Number of Connected Components in an Undirected Graph (LeetCode 323)**: Given n nodes and a list of undirected edges, return the number of connected components.
3. **Friend Circles (LeetCode 547)**: Given a matrix representing friendships, find the total number of friend circles.

## Time and Space Complexity

- **Time Complexity**: O(V + E) for graph traversal, where V is vertices and E is edges. For grids, O(rows * cols).
- **Space Complexity**: O(V) for the visited set and queue in worst case.

## Common Pitfalls

- Forgetting to mark nodes as visited when enqueuing, not dequeuing
- Not iterating through all nodes for disconnected graphs
- In grids, incorrect bounds checking or visiting water cells
- Using recursion in BFS (it's inherently iterative)
- Confusing BFS with DFS traversal order (though result is the same for connectivity)