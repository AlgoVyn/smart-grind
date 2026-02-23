# Tarjan's Algorithm

## Category
Advanced

## Description
Find strongly connected components in a directed graph.

---

## Algorithm Explanation
Tarjan's algorithm finds all Strongly Connected Components (SCCs) in a directed graph in O(V + E) time. An SCC is a maximal set of vertices where each vertex can reach every other vertex in the set.

### Key Concepts:
- **Low-link Value**: The lowest discovery time reachable from a node (including itself) through its subtree
- **Discovery Time (disc)**: When a node is first visited during DFS
- **Stack**: Used to track nodes in current DFS path
- **SCC Detection**: When disc[v] == low[v], we've found an SCC

### How It Works:
1. Perform DFS, tracking discovery time and low-link value for each vertex
2. When a vertex is first discovered, assign it a discovery time and push to stack
3. Update low-link value by checking back edges and tree edges
4. When disc[v] == low[v], pop vertices from stack to form an SCC

### Why It Works:
A vertex can reach vertices in its DFS subtree. If the lowest discovery time reachable from the subtree is the vertex itself, no vertex outside can reach into this subtree, forming an SCC.

## When to Use
Use this algorithm when you need to solve problems involving:
- advanced related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Steps
1. Understand the problem constraints and requirements
2. Identify the input and expected output
3. Apply the core algorithm logic
4. Handle edge cases appropriately
5. Optimize for the given constraints

---

## Implementation

```python
from typing import List, Set

def tarjan_scc(n: int, edges: List[List[int]]) -> List[List[int]]:
    """
    Find all strongly connected components in a directed graph.
    
    Args:
        n: Number of vertices (0 to n-1)
        edges: List of directed edges [from, to]
    
    Returns:
        List of SCCs, each SCC is a list of vertices
    """
    # Build adjacency list
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
    
    # Initialize arrays
    indices = [-1] * n  # Discovery time (-1 if not visited)
    lowlink = [0] * n
    on_stack = [False] * n
    stack = []
    
    index_counter = [0]  # Using list to allow mutation in nested function
    sccs = []
    
    def strongconnect(v: int):
        # Set the depth index for v
        indices[v] = index_counter[0]
        lowlink[v] = index_counter[0]
        index_counter[0] += 1
        stack.append(v)
        on_stack[v] = True
        
        # Consider successors
        for w in graph[v]:
            if indices[w] == -1:
                # Successor w has not yet been visited
                strongconnect(w)
                lowlink[v] = min(lowlink[v], lowlink[w])
            elif on_stack[w]:
                # Successor w is in stack, hence in current SCC
                lowlink[v] = min(lowlink[v], indices[w])
        
        # If v is a root, pop the stack and generate an SCC
        if lowlink[v] == indices[v]:
            scc = []
            while True:
                w = stack.pop()
                on_stack[w] = False
                scc.append(w)
                if w == v:
                    break
            sccs.append(scc)
    
    # Run strongconnect from all unvisited vertices
    for v in range(n):
        if indices[v] == -1:
            strongconnect(v)
    
    return sccs


# Example usage
if __name__ == "__main__":
    # Graph: 5 vertices
    # 0 -> 1 -> 2 -> 0 (SCC)
    # 2 -> 3 -> 4 (separate)
    n = 5
    edges = [
        [0, 1],
        [1, 2],
        [2, 0],
        [2, 3],
        [3, 4]
    ]
    
    sccs = tarjan_scc(n, edges)
    print(f"Vertices: {n}")
    print(f"Edges: {edges}")
    print(f"Strongly Connected Components: {sccs}")
```

```javascript
function tarjans() {
    // Tarjan's Algorithm implementation
    // Time: O(V + E)
    // Space: O(V)
}
```

---

## Example

**Input:**
```
n = 5
edges = [[0,1], [1,2], [2,0], [2,3], [3,4]]
```

**Output:**
```
Vertices: 5
Edges: [[0, 1], [1, 2], [2, 0], [2, 3], [3, 4]]
Strongly Connected Components: [[4], [3], [0, 1, 2]]
```

**Explanation:**
- SCC [0,1,2]: 0→1→2→0 forms a cycle
- SCC [3]: Can reach 4 but 4 cannot reach 3
- SCC [4]: Isolated sink vertex

---

## Time Complexity
**O(V + E)**

---

## Space Complexity
**O(V)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
