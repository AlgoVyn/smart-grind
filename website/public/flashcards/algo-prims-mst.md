## Prim's Algorithm (Minimum Spanning Tree)

**Question:** How does Prim's algorithm find the Minimum Spanning Tree (MST) of a graph?

<!-- front -->

---

## Answer: Grow MST Like a Flood

### Concept
Start from any vertex and greedily add the cheapest edge connecting the MST to a new vertex.

### Algorithm (Lazy Implementation)
```python
def prim(graph, start=0):
    mst = []
    visited = {start}
    edges = []
    
    while len(visited) < len(graph):
        # Add all edges from visited to unvisited
        for u in visited:
            for v, w in graph[u]:
                if v not in visited:
                    edges.append((w, u, v))
        
        # Find minimum edge to unvisited vertex
        edges.sort()
        for w, u, v in edges:
            if v not in visited:
                visited.add(v)
                mst.append((u, v, w))
                break
    
    return mst
```

### Complexity
| Implementation | Time | Space |
|----------------|------|-------|
| Lazy (sort edges) | O(E log E) | O(E) |
| Eager (heap) | O(E log V) | O(V) |

### When to Use
- Dense graphs
- When you need MST specifically (not SPT)

### Key Properties
- Produces **connected** spanning tree with **minimum weight**
- Works on **undirected** graphs
- Can start from **any** vertex

### Difference from Kruskal's
| Prim's | Kruskal's |
|--------|-----------|
| Grows one component | Grows multiple components |
| O(V²) or O(E log V) | O(E log V) |
| Better for dense graphs | Better for sparse graphs |

<!-- back -->
