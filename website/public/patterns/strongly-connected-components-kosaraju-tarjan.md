# Strongly Connected Components (Kosaraju / Tarjan)

## Overview

The Strongly Connected Components (SCC) pattern is used to find all strongly connected components in a directed graph. A strongly connected component is a maximal subgraph where every pair of vertices is reachable from each other. Two common algorithms for this are Kosaraju's algorithm and Tarjan's algorithm.

## Key Concepts

- **Strongly Connected Components (SCC)**: Maximal subgraph with mutual reachability.
- **Kosaraju's Algorithm**: Two passes of DFS (forward and reverse graph).
- **Tarjan's Algorithm**: Single DFS with discovery and low-link values.
- **Stack for Tracking Components**: Used in both algorithms to track nodes in components.

## Template - Kosaraju's Algorithm

```python
from collections import defaultdict

def kosaraju_scc(graph):
    # Step 1: Perform DFS on original graph and push nodes to stack in order of completion
    visited = set()
    stack = []
    
    def dfs1(node):
        visited.add(node)
        for neighbor in graph[node]:
            if neighbor not in visited:
                dfs1(neighbor)
        stack.append(node)
    
    for node in graph:
        if node not in visited:
            dfs1(node)
    
    # Step 2: Reverse the graph
    reversed_graph = defaultdict(list)
    for node in graph:
        for neighbor in graph[node]:
            reversed_graph[neighbor].append(node)
    
    # Step 3: Perform DFS on reversed graph in stack order to get SCCs
    visited = set()
    sccs = []
    
    def dfs2(node, component):
        visited.add(node)
        component.append(node)
        for neighbor in reversed_graph[node]:
            if neighbor not in visited:
                dfs2(neighbor, component)
    
    while stack:
        node = stack.pop()
        if node not in visited:
            component = []
            dfs2(node, component)
            sccs.append(component)
    
    return sccs
```

## Example Problems

1. **Strongly Connected Components (LeetCode 207, 210)**: Find SCCs to solve problems like course schedule.
2. **Find the Number of SCCs**: Count the number of SCCs in a graph.
3. **SCC Decomposition**: Use SCCs to simplify graph problems.

## Time and Space Complexity

- **Time Complexity**: O(V + E), where V is the number of vertices and E is the number of edges.
- **Space Complexity**: O(V) for storing the stack, visited nodes, and reversed graph.

## Common Pitfalls

- **Incorrectly reversing the graph**: Leads to incorrect SCCs.
- **Failing to process all nodes in stack order**: Missing components.
- **Not handling disconnected graphs**: Forgetting to check all unvisited nodes in first DFS.
- **Incorrectly implementing Tarjan's algorithm**: Mishandling low-link values.
