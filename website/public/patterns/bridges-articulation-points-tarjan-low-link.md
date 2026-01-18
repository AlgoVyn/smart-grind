# Bridges & Articulation Points (Tarjan low-link)

## Overview

The Bridges & Articulation Points pattern is used to find critical connections (bridges) and critical nodes (articulation points) in an undirected graph using Tarjan's algorithm with low-link values. A bridge is an edge whose removal increases the number of connected components, while an articulation point is a node whose removal does the same.

## Key Concepts

- **Bridge**: Edge whose removal increases connected components.
- **Articulation Point**: Node whose removal increases connected components.
- **Discovery Time**: Time when a node is first visited.
- **Low-link Value**: Smallest discovery time reachable from a node.
- **Tarjan's Algorithm**: Single DFS with time tracking and low-link values.

## Template

```python
from collections import defaultdict

def tarjan_bridges_and_articulation_points(graph):
    index = 0
    discovery = {}
    low = {}
    parent = {}
    bridges = []
    articulation_points = set()
    children_count = defaultdict(int)
    
    def dfs(u):
        nonlocal index
        discovery[u] = low[u] = index
        index += 1
        is_articulation = False
        
        for v in graph[u]:
            if v not in discovery:
                parent[v] = u
                children_count[u] += 1
                dfs(v)
                low[u] = min(low[u], low[v])
                
                # Check if edge u-v is a bridge
                if low[v] > discovery[u]:
                    bridges.append((u, v))
                
                # Check if u is an articulation point (case 1: root with at least two children)
                if parent[u] is None and children_count[u] > 1:
                    articulation_points.add(u)
                
                # Check if u is an articulation point (case 2: non-root with a child v where no back edge from v to u or above)
                if parent[u] is not None and low[v] >= discovery[u]:
                    is_articulation = True
            elif v != parent[u]:  # Back edge to an ancestor
                low[u] = min(low[u], discovery[v])
        
        if parent[u] is not None and is_articulation:
            articulation_points.add(u)
    
    for node in graph:
        if node not in discovery:
            parent[node] = None
            dfs(node)
    
    return bridges, list(articulation_points)
```

## Example Problems

1. **Critical Connections in a Network (LeetCode 1192)**: Find all critical connections in the network.
2. **Find Articulation Points**: Identify all critical nodes in a graph.
3. **Network Reliability**: Determine the most vulnerable parts of a network.

## Time and Space Complexity

- **Time Complexity**: O(V + E), where V is the number of vertices and E is the number of edges.
- **Space Complexity**: O(V) for storing discovery times, low-link values, and parent pointers.

## Common Pitfalls

- **Incorrect low-link value updates**: Failing to update low[u] with discovery[v] for back edges.
- **Not handling root node case**: Forgetting that root needs at least two children to be an articulation point.
- **Off-by-one errors in time tracking**: Incorrect discovery time initialization.
- **Failing to check all connected components**: Forgetting to start DFS on unvisited nodes.
