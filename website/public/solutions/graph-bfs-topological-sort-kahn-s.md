# Graph BFS - Topological Sort (Kahn's Algorithm)

## Overview

Kahn's algorithm uses Breadth-First Search (BFS) to perform topological sorting on a directed acyclic graph (DAG). Topological sort orders nodes such that for every directed edge u→v, u comes before v in the ordering. This is essential for dependency resolution and scheduling problems.

Use this pattern when you need to:
- Order tasks with dependencies
- Schedule courses with prerequisites
- Resolve build dependencies
- Process nodes in dependency order

Benefits include:
- Detects cycles (if not all nodes are processed)
- Produces a valid topological order if one exists
- Iterative approach using BFS with indegrees

## Key Concepts

- **Indegree**: Number of incoming edges to a node
- **Queue**: Start with nodes having indegree 0 (no dependencies)
- **Processing**: Remove edges by decreasing indegrees of neighbors
- **Cycle Detection**: If final order doesn't include all nodes, cycle exists
- **DAG Requirement**: Only works on directed acyclic graphs

## Template

```python
from collections import deque, defaultdict

def topological_sort_kahn(graph, num_nodes):
    # Calculate indegrees
    indegree = [0] * num_nodes
    for neighbors in graph.values():
        for neighbor in neighbors:
            indegree[neighbor] += 1
    
    # Queue nodes with indegree 0
    queue = deque([i for i in range(num_nodes) if indegree[i] == 0])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        # Decrease indegree of neighbors
        if node in graph:
            for neighbor in graph[node]:
                indegree[neighbor] -= 1
                if indegree[neighbor] == 0:
                    queue.append(neighbor)
    
    # Check for cycles
    if len(result) == num_nodes:
        return result  # Valid topological order
    else:
        return []  # Cycle detected

# Alternative: Using adjacency list with node labels
def topological_sort(graph):
    # graph is dict: node -> list of neighbors
    indegree = defaultdict(int)
    for node in graph:
        for neighbor in graph[node]:
            indegree[neighbor] += 1
    
    # Nodes with no incoming edges
    queue = deque([node for node in graph if indegree[node] == 0])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        for neighbor in graph[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)
    
    return result if len(result) == len(graph) else []
```

## Example Problems

1. **Course Schedule II (LeetCode 210)**: Return the ordering of courses you should take to finish all courses.
2. **Alien Dictionary (LeetCode 269)**: Given a list of words, derive the alien alphabet order.
3. **Parallel Courses III (LeetCode 2050)**: Find minimum time to complete all courses with dependencies.

## Time and Space Complexity

- **Time Complexity**: O(V + E), as we process each node and edge once.
- **Space Complexity**: O(V + E) for graph storage, indegree array, and queue.

## Common Pitfalls

- Not calculating indegrees correctly (count incoming edges)
- Forgetting to check if all nodes are included (cycle detection)
- Using wrong node indexing (ensure 0-based or handle node labels)
- Assuming graph is connected (handle all nodes)
- Not handling nodes with no outgoing edges