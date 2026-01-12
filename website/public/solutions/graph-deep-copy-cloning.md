# Graph - Deep Copy / Cloning

## Overview

This pattern creates a complete deep copy of a graph, duplicating all nodes and edges while preserving the structure. This is crucial when you need independent copies of graph data structures, especially with complex node objects containing additional data.

Use this pattern when you need to:
- Create independent copies of graph structures
- Modify a graph without affecting the original
- Serialize/deserialize graph objects
- Implement undo functionality for graph operations

Benefits include:
- Preserves all node data and relationships
- Creates truly independent copies
- Handles cyclic references properly
- Works with both adjacency lists and node-based graphs

## Key Concepts

- **Node Mapping**: Dictionary to map original nodes to their copies
- **Traversal**: DFS or BFS to visit all nodes and edges
- **Copy Creation**: Instantiate new nodes with same data
- **Edge Recreation**: Connect copied nodes with same relationships
- **Cycle Handling**: Visited tracking prevents infinite loops

## Template

```python
# For node-based graphs (e.g., LeetCode style)
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

def clone_graph(node):
    if not node:
        return None
    
    # Map original nodes to copies
    visited = {}
    
    def dfs(original):
        if original in visited:
            return visited[original]
        
        # Create copy
        copy = Node(original.val)
        visited[original] = copy
        
        # Recursively copy neighbors
        for neighbor in original.neighbors:
            copy.neighbors.append(dfs(neighbor))
        
        return copy
    
    return dfs(node)

# For adjacency list graphs
def deep_copy_graph(graph):
    # graph is dict: node -> list of neighbors
    if not graph:
        return {}
    
    visited = {}
    
    def dfs(node):
        if node in visited:
            return
        
        # Create copy of node if it's an object
        # For simple graphs, just use node as key
        visited[node] = []  # or create new node object
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                dfs(neighbor)
            visited[node].append(neighbor)
    
    # Start from all nodes (handles disconnected)
    for node in graph:
        if node not in visited:
            dfs(node)
    
    return visited

# BFS version for deep copy
from collections import deque

def clone_graph_bfs(node):
    if not node:
        return None
    
    visited = {}
    queue = deque([node])
    visited[node] = Node(node.val)
    
    while queue:
        original = queue.popleft()
        copy = visited[original]
        
        for neighbor in original.neighbors:
            if neighbor not in visited:
                visited[neighbor] = Node(neighbor.val)
                queue.append(neighbor)
            copy.neighbors.append(visited[neighbor])
    
    return visited[node]
```

## Example Problems

1. **Clone Graph (LeetCode 133)**: Given a reference of a node in a connected undirected graph, return a deep copy.
2. **Copy List with Random Pointer (LeetCode 138)**: A linked list with random pointers, which can be treated as a graph.
3. **Deep Copy of Graph**: General problem of duplicating graph structures.

## Time and Space Complexity

- **Time Complexity**: O(V + E), as each node and edge is processed once.
- **Space Complexity**: O(V) for the visited map and recursion/BFS queue.

## Common Pitfalls

- Forgetting the visited map leads to infinite recursion in cycles
- Not handling disconnected graphs (iterate through all nodes)
- Shallow copying node data instead of deep copying
- Incorrectly mapping neighbors to original instead of copied nodes
- Assuming graphs are connected (may have multiple components)