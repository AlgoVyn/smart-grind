# Graph DFS - Cycle Detection (Directed Graph)

## Overview

This pattern uses Depth-First Search (DFS) to detect cycles in a directed graph. A cycle exists if there's a path that starts and ends at the same node. This is crucial for problems involving dependencies, scheduling, or graph validation.

Use this pattern when you need to:
- Check if a directed graph contains cycles
- Validate topological ordering possibilities
- Detect deadlocks in resource allocation
- Ensure no circular dependencies

Benefits include:
- Efficient cycle detection in O(V + E) time
- Can identify the presence of cycles without full traversal if needed
- Foundation for topological sort algorithms

## Key Concepts

- **Visiting Set**: Tracks nodes currently in the recursion stack (current path)
- **Visited Set**: Tracks fully explored nodes
- **Cycle Detection**: If a neighbor is in the visiting set, a cycle exists
- **Backtracking**: Remove nodes from visiting set after exploration
- **Directed Edges**: Only follow directed edges, not bidirectional

## Template

```python
def has_cycle_dfs(node, graph, visited, visiting):
    # Mark as visiting (in current path)
    visiting.add(node)
    
    # Explore neighbors
    for neighbor in graph[node]:
        if neighbor in visiting:
            # Cycle found
            return True
        if neighbor not in visited:
            if has_cycle_dfs(neighbor, graph, visited, visiting):
                return True
    
    # Mark as visited and remove from visiting
    visited.add(node)
    visiting.remove(node)
    return False

def detect_cycle(graph):
    visited = set()
    visiting = set()
    
    # Check all nodes (handles disconnected graphs)
    for node in graph:
        if node not in visited:
            if has_cycle_dfs(node, graph, visited, visiting):
                return True
    
    return False

# Alternative: Return the cycle if found
def find_cycle_dfs(node, graph, visited, visiting, path):
    visiting.add(node)
    path.append(node)
    
    for neighbor in graph[node]:
        if neighbor in visiting:
            # Cycle found, return the cycle
            cycle_start = path.index(neighbor)
            return path[cycle_start:] + [neighbor]
        if neighbor not in visited:
            cycle = find_cycle_dfs(neighbor, graph, visited, visiting, path)
            if cycle:
                return cycle
    
    visited.add(node)
    visiting.remove(node)
    path.pop()
    return None
```

## Example Problems

1. **Course Schedule (LeetCode 207)**: Determine if you can finish all courses given prerequisites.
2. **Course Schedule II (LeetCode 210)**: Find the ordering of courses to finish all.
3. **Detect Cycle in a Directed Graph**: Standard graph problem to check for cycles.

## Time and Space Complexity

- **Time Complexity**: O(V + E), as each node and edge is visited once.
- **Space Complexity**: O(V) for visited and visiting sets, plus O(V) recursion stack.

## Common Pitfalls

- Confusing visited and visiting sets (visiting is for current path)
- Not removing nodes from visiting set after backtracking
- Forgetting to check all nodes in disconnected graphs
- Assuming undirected graph behavior (cycles in directed are different)
- Not handling self-loops (immediate cycle if node points to itself)