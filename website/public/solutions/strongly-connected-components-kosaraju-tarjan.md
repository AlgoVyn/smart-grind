# Strongly Connected Components (Kosaraju / Tarjan)

## Overview

Strongly Connected Components (SCCs) are maximal subgraphs where every pair of vertices is mutually reachable. Kosaraju's algorithm uses two DFS passes, while Tarjan's algorithm uses a single pass with discovery times and low-link values.

Use this pattern when you need to:
- Find strongly connected components in directed graphs
- Simplify graphs by contracting SCCs
- Solve problems involving mutual reachability
- Analyze graph structure and dependencies

Benefits include:
- Identifies groups of mutually reachable nodes
- Enables graph condensation
- Useful for compiler optimizations and network analysis
- Both algorithms are efficient and well-established

## Key Concepts

- **Kosaraju**: DFS on graph, then DFS on transpose in finish order
- **Tarjan**: Single DFS with discovery/low-link values
- **SCC**: Every node reachable from every other in the component
- **Transpose Graph**: Reverse all edge directions
- **Finish Times**: Order of completion in DFS

## Template

```python
# Kosaraju's Algorithm
def kosaraju_scc(graph, n):
    # Step 1: DFS to get finishing times
    visited = [False] * n
    stack = []
    
    def dfs1(node):
        visited[node] = True
        for neighbor in graph[node]:
            if not visited[neighbor]:
                dfs1(neighbor)
        stack.append(node)
    
    for i in range(n):
        if not visited[i]:
            dfs1(i)
    
    # Step 2: Transpose graph
    transpose = [[] for _ in range(n)]
    for u in range(n):
        for v in graph[u]:
            transpose[v].append(u)
    
    # Step 3: DFS on transpose in stack order
    visited = [False] * n
    sccs = []
    
    def dfs2(node, component):
        visited[node] = True
        component.append(node)
        for neighbor in transpose[node]:
            if not visited[neighbor]:
                dfs2(neighbor, component)
    
    while stack:
        node = stack.pop()
        if not visited[node]:
            component = []
            dfs2(node, component)
            sccs.append(component)
    
    return sccs

# Tarjan's Algorithm
class TarjanSCC:
    def __init__(self, graph, n):
        self.graph = graph
        self.n = n
        self.discovery = [-1] * n
        self.low = [-1] * n
        self.stack = []
        self.in_stack = [False] * n
        self.time = 0
        self.sccs = []
    
    def dfs(self, node):
        self.discovery[node] = self.low[node] = self.time
        self.time += 1
        self.stack.append(node)
        self.in_stack[node] = True
        
        for neighbor in self.graph[node]:
            if self.discovery[neighbor] == -1:
                self.dfs(neighbor)
                self.low[node] = min(self.low[node], self.low[neighbor])
            elif self.in_stack[neighbor]:
                self.low[node] = min(self.low[node], self.discovery[neighbor])
        
        # If node is root of SCC
        if self.low[node] == self.discovery[node]:
            component = []
            while True:
                w = self.stack.pop()
                self.in_stack[w] = False
                component.append(w)
                if w == node:
                    break
            self.sccs.append(component)
    
    def find_sccs(self):
        for i in range(self.n):
            if self.discovery[i] == -1:
                self.dfs(i)
        return self.sccs

# Usage
def find_sccs(graph, n):
    tarjan = TarjanSCC(graph, n)
    return tarjan.find_sccs()
```

## Example Problems

1. **Critical Connections in a Network (LeetCode 1192)**: Find bridges, related to SCCs.
2. **Strongly Connected Component**: Standard problem to find SCCs.
3. **Course Schedule II (LeetCode 210)**: Can be solved using topological sort on SCCs.

## Time and Space Complexity

- **Time Complexity**: O(V + E) for both algorithms.
- **Space Complexity**: O(V + E) for graph storage and auxiliary arrays.

## Common Pitfalls

- In Kosaraju, forgetting to use finishing times order
- Not building transpose graph correctly
- In Tarjan, confusing discovery and low-link values
- Not handling stack operations properly in Tarjan
- Assuming undirected graph behavior (SCCs are for directed graphs)