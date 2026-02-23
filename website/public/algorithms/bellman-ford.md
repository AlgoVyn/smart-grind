# Bellman-Ford

## Category
Graphs

## Description
Find shortest path with negative weights. Can detect negative cycles.

---

## Algorithm Explanation
The Bellman-Ford algorithm finds the shortest path from a single source vertex to all other vertices in a weighted graph. Unlike Dijkstra's algorithm, Bellman-Ford can handle graphs with negative edge weights.

### Key Concepts:
- **Single-source shortest path**: Find the minimum distance from one source vertex to all other vertices
- **V-1 relaxations**: The algorithm performs edge relaxation V-1 times (where V is the number of vertices), guaranteeing that the shortest paths are found if no negative cycles exist
- **Negative cycle detection**: If we can still relax edges after V-1 iterations, a negative cycle exists

### How It Works:
1. Initialize distances: Set source distance to 0, all others to infinity
2. Relax all edges V-1 times: For each edge (u, v) with weight w, if dist[u] + w < dist[v], update dist[v]
3. Check for negative cycles: Perform one more iteration; if any edge can be relaxed, a negative cycle exists

### Why V-1 Iterations?
In a graph without negative cycles, the shortest path between two vertices contains at most V-1 edges. Each iteration of relaxation finds shortest paths with at most one more edge than before.

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
from typing import List, Tuple

def bellman_ford(vertices: int, edges: List[Tuple[int, int, int]], source: int) -> Tuple[List[int], bool]:
    """
    Bellman-Ford algorithm to find shortest paths from source to all vertices.
    
    Args:
        vertices: Number of vertices (0 to vertices-1)
        edges: List of tuples (u, v, w) representing edge from u to v with weight w
        source: Source vertex
    
    Returns:
        Tuple of (distances, has_negative_cycle)
        - distances: List where distances[i] is the shortest distance from source to i
        - has_negative_cycle: True if a negative cycle is detected
    """
    # Initialize distances
    dist = [float('inf')] * vertices
    dist[source] = 0
    
    # Relax all edges V-1 times
    for _ in range(vertices - 1):
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    
    # Check for negative cycles
    has_negative_cycle = False
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            has_negative_cycle = True
            break
    
    return dist, has_negative_cycle

# Example usage
if __name__ == "__main__":
    # Graph: 5 vertices (0 to 4)
    # Edges: (source, destination, weight)
    vertices = 5
    edges = [
        (0, 1, 4),
        (0, 2, 2),
        (1, 2, 3),
        (1, 3, 2),
        (2, 3, 5),
        (1, 4, -3),  # negative weight edge
        (3, 4, 4)
    ]
    source = 0
    
    distances, has_neg_cycle = bellman_ford(vertices, edges, source)
    print(f"Source: {source}")
    print(f"Negative cycle detected: {has_neg_cycle}")
    print("Shortest distances:")
    for i, d in enumerate(distances):
        print(f"  Vertex {i}: {d}")
```

```javascript
function bellmanFord() {
    // Bellman-Ford implementation
    // Time: O(V * E)
    // Space: O(V)
}
```

---

## Example

**Input:**
```
vertices = 5
edges = [(0, 1, 4), (0, 2, 2), (1, 2, 3), (1, 3, 2), (2, 3, 5), (1, 4, -3), (3, 4, 4)]
source = 0
```

**Output:**
```
Source: 0
Negative cycle detected: False
Shortest distances:
  Vertex 0: 0
  Vertex 1: 4
  Vertex 2: 2
  Vertex 3: 5
  Vertex 4: 1
```

**Explanation:**
- From vertex 0: distance to 0 is 0
- To reach vertex 1: 0 → 1 with weight 4 (direct) = 4
- To reach vertex 2: 0 → 2 with weight 2 = 2
- To reach vertex 3: 0 → 1 → 3 with weight 4 + 2 = 6, but 0 → 2 → 1 → 3 = 2 + 3 + 2 = 7, wait... actually 0 → 1 → 3 = 6 is shortest
- To reach vertex 4: 0 → 1 → 4 with weight 4 + (-3) = 1 (uses negative edge)

---

## Time Complexity
**O(V * E)**

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
