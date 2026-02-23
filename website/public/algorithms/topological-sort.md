# Topological Sort

## Category
Graphs

## Description
Order vertices of a DAG such that for every edge u→v, u comes before v. Uses Kahn's algorithm or DFS.

---

## Algorithm Explanation
Topological Sort is an ordering of vertices in a Directed Acyclic Graph (DAG) where for every edge u→v, vertex u comes before vertex v in the ordering. This is useful for task scheduling, build systems, and dependency resolution.

### Key Concepts:
- **DAG**: Graph without cycles - topological sort only works on DAGs
- **In-degree**: Number of incoming edges to a vertex
- **Kahn's Algorithm**: BFS-based, uses queue of zero in-degree vertices
- **DFS-based**: Uses post-order traversal, reverse the result

### Kahn's Algorithm (BFS):
1. Calculate in-degree for all vertices
2. Add all vertices with in-degree 0 to queue
3. Process queue: remove vertex, add to result, reduce neighbors' in-degree
4. Add neighbors with in-degree 0 to queue
5. If result has all vertices, we have topological order; otherwise, cycle exists

### DFS-based Approach:
1. Perform DFS
2. Add vertex to result after exploring all neighbors
3. Reverse the result

## When to Use
Use this algorithm when you need to solve problems involving:
- graphs related operations
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
from typing import List, Deque
from collections import deque

def topological_sort(n: int, edges: List[List[int]]) -> List[int]:
    """
    Topological sort using Kahn's algorithm (BFS).
    
    Args:
        n: Number of vertices (0 to n-1)
        edges: List of directed edges [from, to]
    
    Returns:
        Topological ordering of vertices, or empty list if cycle exists
    """
    # Build graph and in-degree array
    graph = [[] for _ in range(n)]
    in_degree = [0] * n
    
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1
    
    # Queue for vertices with in-degree 0
    queue = deque([i for i in range(n) if in_degree[i] == 0])
    result = []
    
    while queue:
        vertex = queue.popleft()
        result.append(vertex)
        
        for neighbor in graph[vertex]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # If we couldn't process all vertices, there's a cycle
    if len(result) != n:
        return []
    
    return result


def topological_sort_dfs(n: int, edges: List[List[int]]) -> List[int]:
    """
    Topological sort using DFS.
    """
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
    
    visited = [0] * n  # 0: unvisited, 1: in progress, 2: done
    result = []
    
    def dfs(v: int) -> bool:
        visited[v] = 1  # Mark as in progress
        for neighbor in graph[v]:
            if visited[neighbor] == 1:  # Back edge - cycle
                return False
            if visited[neighbor] == 0:
                if not dfs(neighbor):
                    return False
        visited[v] = 2  # Mark as done
        result.append(v)
        return True
    
    for v in range(n):
        if visited[v] == 0:
            if not dfs(v):
                return []  # Cycle detected
    
    return result[::-1]  # Reverse for correct order


# Example usage
if __name__ == "__main__":
    # Example: Course Schedule
    # 0: Algorithms
    # 1: Data Structures
    # 2: Operating Systems
    # 3: Computer Networks
    # 4: Machine Learning
    # 
    # Prerequisites:
    # Algorithms -> Machine Learning
    # Data Structures -> Algorithms
    # Data Structures -> Machine Learning
    # Operating Systems -> Computer Networks
    
    n = 5
    edges = [
        [1, 0],  # Data Structures -> Algorithms
        [0, 4],  # Algorithms -> ML
        [1, 4],  # Data Structures -> ML
        [2, 3]   # OS -> Networks
    ]
    
    result = topological_sort(n, edges)
    print(f"Vertices: {n}")
    print(f"Edges (prerequisites): {edges}")
    print(f"Topological order: {result}")
```

```javascript
function topologicalSort() {
    // Topological Sort implementation
    // Time: O(V + E)
    // Space: O(V)
}
```

---

## Example

**Input:**
```
n = 5
edges = [[1,0], [0,4], [1,4], [2,3]]
```

**Output:**
```
Vertices: 5
Edges (prerequisites): [[1, 0], [0, 4], [1, 4], [2, 3]]
Topological order: [1, 2, 0, 3, 4]
```

**Explanation:**
- Vertex 1 (Data Structures) comes before 0 (Algorithms)
- Vertex 0 comes before 4 (ML)
- Vertex 1 also comes before 4
- Vertex 2 (OS) comes before 3 (Networks)
- Valid order: 1, 2, 0, 3, 4

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
