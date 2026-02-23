# Graph BFS

## Category
Graphs

## Description
Breadth-First Search (BFS) is a graph traversal algorithm that explores all vertices at the present depth before moving on to vertices at the next depth level. It uses a queue data structure to keep track of vertices to visit, ensuring level-by-level exploration of the graph. BFS is particularly useful for finding the shortest path in unweighted graphs, as it visits vertices in increasing distance from the source.

The algorithm works by:
1. Starting from a source vertex, mark it as visited and enqueue it
2. Dequeue a vertex from the front of the queue
3. Visit all unvisited neighbors of the dequeued vertex and enqueue them
4. Repeat steps 2-3 until the queue is empty

A visited set is maintained to avoid revisiting vertices and prevent infinite loops in graphs with cycles.

---

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
from collections import deque

def bfs(graph: dict, start: str) -> list:
    """
    Perform Breadth-First Search on a graph.
    
    Args:
        graph: Adjacency list representation of the graph
        start: Starting vertex for BFS traversal
        
    Returns:
        List of vertices in BFS order
        
    Time: O(V + E)
    Space: O(V)
    """
    if start not in graph:
        return []
    
    visited = set([start])
    queue = deque([start])
    result = []
    
    while queue:
        vertex = queue.popleft()
        result.append(vertex)
        
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return result


# Example usage
if __name__ == "__main__":
    # Graph represented as adjacency list
    graph = {
        'A': ['B', 'C'],
        'B': ['A', 'D', 'E'],
        'C': ['A', 'F'],
        'D': ['B'],
        'E': ['B', 'F'],
        'F': ['C', 'E']
    }
    
    result = bfs(graph, 'A')
    print("BFS traversal:", result)  # Output: ['A', 'B', 'C', 'D', 'E', 'F']
    
    # Finding shortest path in unweighted graph
    def shortest_path(graph: dict, start: str, target: str) -> int:
        if start == target:
            return 0
        
        visited = set([start])
        queue = deque([(start, 0)])
        
        while queue:
            vertex, distance = queue.popleft()
            
            for neighbor in graph[vertex]:
                if neighbor == target:
                    return distance + 1
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, distance + 1))
        
        return -1  # No path exists
    
    print("Shortest path A to F:", shortest_path(graph, 'A', 'F'))  # Output: 2
```

```javascript
function graphBfs() {
    // Graph BFS implementation
    // Time: O(V + E)
    // Space: O(V)
}
```

---

## Example

**Input:**
```
Graph (adjacency list):
{
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}
Start vertex: 'A'
```

**Output:**
```
BFS traversal: ['A', 'B', 'C', 'D', 'E', 'F']
Shortest path from A to F: 2
```

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
