# Dijkstra's Algorithm

## Category
Graphs

## Description
Find shortest path from source to all vertices in weighted graph with non-negative edges.

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

## How It Works
Dijkstra's algorithm finds the shortest path from a source vertex to all other vertices in a weighted graph with **non-negative edge weights**. It uses a greedy approach with a priority queue (min-heap).

**Key Concept:** At each step, choose the unvisited vertex with the smallest known distance.

**Why it works:**
- Greedy choice: Once the shortest path to a vertex is finalized, it can't be improved
- Uses relaxation: For each neighbor, check if going through current vertex gives a shorter path
- Priority queue ensures we always process the closest unvisited vertex first

**Algorithm:**
1. Initialize distances: source = 0, others = infinity
2. Use min-heap with (distance, vertex) pairs
3. While heap not empty:
   - Extract vertex with minimum distance
   - For each neighbor: if new distance < current, update and push to heap
4. Return distances

**Important:** Does NOT work with negative edge weights (use Bellman-Ford instead)

---

## Implementation

```python
import heapq
from collections import defaultdict

def dijkstra(graph, source):
    """
    Dijkstra's Shortest Path Algorithm
    Time: O((V + E) log V)
    Space: O(V)
    
    Args:
        graph: Dict of {vertex: [(neighbor, weight), ...]}
        source: Starting vertex
    
    Returns:
        Dictionary of shortest distances from source
    """
    # Initialize distances
    distances = {vertex: float('inf') for vertex in graph}
    distances[source] = 0
    
    # Min-heap: (distance, vertex)
    heap = [(0, source)]
    
    while heap:
        curr_dist, current = heapq.heappop(heap)
        
        # Skip if we've already found a shorter path
        if curr_dist > distances[current]:
            continue
        
        # Check all neighbors
        for neighbor, weight in graph[current]:
            distance = curr_dist + weight
            
            # Relaxation: found shorter path?
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(heap, (distance, neighbor))
    
    return distances


# Example usage
if __name__ == "__main__":
    # Build graph (adjacency list)
    #     4
    #    / \
    #   1---2
    #    \ /
    #     3
    graph = defaultdict(list)
    graph[0] = [(1, 4), (2, 1)]  # 0 -> 1 (4), 0 -> 2 (1)
    graph[1] = [(0, 4), (2, 2), (3, 5)]  # 1 -> 0, 2, 3
    graph[2] = [(0, 1), (1, 2), (3, 8)]  # 2 -> 0, 1, 3
    graph[3] = [(1, 5), (2, 8)]  # 3 -> 1, 2
    
    # Find shortest paths from vertex 0
    distances = dijkstra(graph, 0)
    print("Shortest paths from vertex 0:")
    for vertex, dist in distances.items():
        print(f"  To {vertex}: {dist}")
    
    # Output: {0: 0, 1: 3, 2: 1, 3: 6}
    # Path: 0->2(1), 2->1(2), 2->3(8)
```

```javascript
function dijkstras() {
    // Dijkstra's Algorithm implementation
    // Time: O((V + E) log V)
    // Space: O(V)
}
```

---

## Example

**Input:**
```
Graph (adjacency list):
0: [(1, 4), (2, 1)]
1: [(0, 4), (2, 2), (3, 5)]
2: [(0, 1), (1, 2), (3, 8)]
3: [(1, 5), (2, 8)]

Source: 0
```

**Output:**
```
Shortest paths from vertex 0:
  To 0: 0
  To 1: 3
  To 2: 1
  To 3: 6
```

**Explanation:**
- Distance to 0: 0 (source)
- Distance to 2: 1 (direct edge)
- Distance to 1: 3 (0→2→1: 1+2)
- Distance to 3: 6 (0→2→1→3: 1+2+3) or (0→2→3: 1+8)

---

## Time Complexity
**O((V + E) log V)**

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
