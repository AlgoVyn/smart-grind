# Bridges & Articulation Points (Tarjan low-link)

## Overview

Bridges are edges whose removal increases the number of connected components in an undirected graph. Articulation points (cut vertices) are nodes whose removal increases the number of connected components. Tarjan's algorithm uses DFS with discovery times and low-link values to find these critical elements.

Use this pattern when you need to:
- Identify critical edges (bridges) in networks
- Find single points of failure in graphs
- Analyze network vulnerability
- Solve connectivity problems with removal constraints

Benefits include:
- Finds all bridges and articulation points in O(V + E) time
- Works on undirected graphs
- Identifies critical infrastructure elements
- Useful for network design and analysis

## Key Concepts

- **Discovery Time**: When a node is first visited
- **Low-Link Value**: Smallest discovery time reachable from subtree
- **Bridge**: Edge where low[child] > disc[parent]
- **Articulation Point**: Node where low[child] >= disc[node] for children
- **Root Handling**: Special case for root nodes

## Template

```python
class TarjanBridgesArticulation:
    def __init__(self, graph, n):
        self.graph = graph
        self.n = n
        self.discovery = [-1] * n
        self.low = [-1] * n
        self.parent = [-1] * n
        self.time = 0
        self.bridges = []
        self.articulation_points = set()
        self.children = [0] * n  # For root articulation check
    
    def dfs(self, node):
        self.discovery[node] = self.low[node] = self.time
        self.time += 1
        
        for neighbor in self.graph[node]:
            if self.discovery[neighbor] == -1:  # Not visited
                self.parent[neighbor] = node
                self.children[node] += 1
                
                self.dfs(neighbor)
                
                # Update low value
                self.low[node] = min(self.low[node], self.low[neighbor])
                
                # Check for bridge
                if self.low[neighbor] > self.discovery[node]:
                    self.bridges.append((node, neighbor))
                
                # Check for articulation point
                if self.parent[node] == -1 and self.children[node] > 1:
                    self.articulation_points.add(node)
                elif self.parent[node] != -1 and self.low[neighbor] >= self.discovery[node]:
                    self.articulation_points.add(node)
                    
            elif neighbor != self.parent[node]:  # Back edge
                self.low[node] = min(self.low[node], self.discovery[neighbor])
    
    def find_critical_points(self):
        for i in range(self.n):
            if self.discovery[i] == -1:
                self.dfs(i)
        
        return self.bridges, list(self.articulation_points)

# Usage
def find_bridges_and_articulation_points(graph, n):
    tarjan = TarjanBridgesArticulation(graph, n)
    bridges, articulation_points = tarjan.find_critical_points()
    return bridges, articulation_points

# Alternative: Simplified bridge finding
def find_bridges(graph, n):
    discovery = [-1] * n
    low = [-1] * n
    parent = [-1] * n
    time = 0
    bridges = []
    
    def dfs(node):
        nonlocal time
        discovery[node] = low[node] = time
        time += 1
        
        for neighbor in graph[node]:
            if discovery[neighbor] == -1:
                parent[neighbor] = node
                dfs(neighbor)
                low[node] = min(low[node], low[neighbor])
                
                if low[neighbor] > discovery[node]:
                    bridges.append((node, neighbor))
                    
            elif neighbor != parent[node]:
                low[node] = min(low[node], discovery[neighbor])
    
    for i in range(n):
        if discovery[i] == -1:
            dfs(i)
    
    return bridges
```

## Example Problems

1. **Critical Connections in a Network (LeetCode 1192)**: Find all bridges in a network.
2. **Find Articulation Points**: Standard problem to find cut vertices.
3. **Network Connectivity**: Analyze network robustness.

## Time and Space Complexity

- **Time Complexity**: O(V + E), single DFS traversal.
- **Space Complexity**: O(V) for discovery, low, and parent arrays.

## Common Pitfalls

- Confusing discovery and low-link values
- Not handling back edges correctly
- Forgetting special case for root articulation points
- Assuming directed graph (this is for undirected)
- Not updating low values through back edges