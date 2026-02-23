# Floyd-Warshall

## Category
Graphs

## Description
Find all-pairs shortest paths using dynamic programming.

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
Floyd-Warshall algorithm finds shortest paths between **all pairs** of vertices in a weighted graph. It's a dynamic programming approach that works with both positive and negative edge weights (but no negative cycles).

**Key Concept:** Use intermediate vertices to find shorter paths.

**Why it works:**
- Let `dist[i][j]` be the shortest distance from i to j
- Consider all possible intermediate vertices k
- Update: `dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])`
- After considering all k, we have the shortest paths

**Algorithm:**
1. Initialize distance matrix with direct edge weights
2. Set diagonal to 0 (distance to self)
3. For each intermediate vertex k:
   - For each pair (i, j):
     - If path through k is shorter, update distance
4. Return the distance matrix

**Properties:**
- Time: O(V³) - three nested loops
- Space: O(V²) - distance matrix
- Works for negative weights (detects negative cycles)

---

## Implementation

```python
def floyd_warshall(n, edges):
    """
    Floyd-Warshall All-Pairs Shortest Path
    Time: O(V³)
    Space: O(V²)
    
    Args:
        n: Number of vertices (0 to n-1)
        edges: List of (u, v, weight) tuples
    
    Returns:
        2D matrix of shortest distances between all pairs
    """
    # Initialize distance matrix
    INF = float('inf')
    dist = [[INF] * n for _ in range(n)]
    
    # Distance to self is 0
    for i in range(n):
        dist[i][i] = 0
    
    # Set direct edge weights
    for u, v, w in edges:
        dist[u][v] = w
        # For undirected graph, also use: dist[v][u] = w
    
    # Floyd-Warshall: consider each vertex as intermediate
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    
    return dist


# Example usage
if __name__ == "__main__":
    # Build graph with 4 vertices
    #     5
    #   0---1
    #   |   |
    #  7   3
    #   |   |
    #   2---3
    #      2
    n = 4
    edges = [
        (0, 1, 5),   # 0 -> 1 with weight 5
        (0, 2, 7),   # 0 -> 2 with weight 7
        (1, 2, 3),   # 1 -> 2 with weight 3
        (1, 3, 3),   # 1 -> 3 with weight 3
        (2, 3, 2),   # 2 -> 3 with weight 2
    ]
    
    result = floyd_warshall(n, edges)
    
    print("All-pairs shortest distances:")
    print("    0  1  2  3")
    for i, row in enumerate(result):
        print(f"{i}: {row}")
    
    # Print specific paths
    print(f"\nShortest distance 0->3: {result[0][3]}")  # 5 (0-1-3)
    print(f"Shortest distance 0->2: {result[0][2]}")  # 6 (0-1-2)
```

```javascript
function floydWarshall() {
    // Floyd-Warshall implementation
    // Time: O(V³)
    // Space: O(V²)
}
```

---

## Example

**Input:**
```
n = 4
Edges: [(0,1,5), (0,2,7), (1,2,3), (1,3,3), (2,3,2)]
```

**Output:**
```
All-pairs shortest distances:
    0  1  2  3
0: [0, 5, 6, 8]
1: [5, 0, 3, 3]
2: [6, 3, 0, 2]
3: [8, 3, 2, 0]

Shortest distance 0->3: 8
Shortest distance 0->2: 6
```

**Explanation:**
- Direct 0→3 = INF (no direct edge)
- Via 1: 0→1(5) + 1→3(3) = 8
- Via 2: 0→2(7)
- Via 1→2: 0→1(5) + 1→2(3) = 6

---

## Time Complexity
**O(V³)**

---

## Space Complexity
**O(V²)**

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
