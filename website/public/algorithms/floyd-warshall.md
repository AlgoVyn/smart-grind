# Floyd-Warshall Algorithm

## Category
Graphs

## Description

The Floyd-Warshall algorithm is a fundamental **all-pairs shortest path** algorithm that finds the shortest paths between **all pairs of vertices** in a weighted graph. It uses dynamic programming to systematically consider each vertex as a potential intermediate point in paths, making it incredibly powerful for solving graph distance problems.

Unlike Dijkstra's algorithm (which finds shortest paths from a single source) or Bellman-Ford (which handles negative weights for single-source), Floyd-Warshall computes shortest paths between **every pair of vertices** in a single pass. This makes it ideal when you need to answer multiple distance queries between any two nodes.

**Key Characteristics:**
- Works with both positive and negative edge weights
- Detects negative weight cycles
- Computes all-pairs shortest paths in O(V³) time
- Space-efficient with O(V²) storage

---

## When to Use

Use the Floyd-Warshall algorithm when you need to solve problems involving:

- **All-Pairs Shortest Paths**: When you need distances between every pair of vertices
- **Negative Edge Weights**: When the graph may contain negative-weight edges (but no negative cycles)
- **Transitive Closure**: When you need to determine if a path exists between any two vertices
- **Graph Center**: Finding the vertex that minimizes the maximum distance to any other vertex
- **Reachability Queries**: Determining which vertices are reachable from others

### Comparison with Alternatives

| Algorithm | Time Complexity | Space | Use Case |
|-----------|----------------|-------|----------|
| **Floyd-Warshall** | O(V³) | O(V²) | All-pairs shortest paths, small-medium graphs |
| **Dijkstra (×V)** | O(V²) or O(E log V) | O(V) | Single-source queries, sparse graphs |
| **Bellman-Ford (×V)** | O(V×E) | O(V) | Negative weights, single-source |
| **Johnson's Algorithm** | O(V² log V + VE) | O(V²) | Sparse graphs with negative weights |

### When to Choose Floyd-Warshall vs Dijkstra

- **Choose Floyd-Warshall** when:
  - You need shortest paths between ALL pairs of vertices
  - The graph is dense (E ≈ V²)
  - You have negative edge weights
  - Multiple queries will be made after preprocessing

- **Choose Dijkstra** when:
  - You only need paths from a single source
  - The graph is sparse (E << V²)
  - All edge weights are non-negative
  - Memory is constrained

---

## Algorithm Explanation

### Core Concept

The key insight behind Floyd-Warshall is elegant in its simplicity: **any shortest path from vertex i to vertex j can be expressed as a path through some intermediate vertex k**. By systematically considering each vertex as a potential intermediate point, we can build up the shortest paths between all pairs.

The dynamic programming recurrence is:
```
dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])
```

This means: "The shortest path from i to j is either the previously known path, or a path that goes through vertex k."

### Why It Works

The algorithm builds on the principle of **optimal substructure**: the shortest path between any two vertices can be constructed from shortest paths between intermediate vertices. This is a hallmark of dynamic programming.

**Proof Sketch:**
1. Base case: Without any intermediate vertices, the shortest path is the direct edge (or infinity if no edge exists)
2. Inductive step: When considering vertex k as an intermediate, either:
   - The optimal path doesn't use k: dist[i][j] stays the same
   - The optimal path uses k: It's dist[i][k] + dist[k][j], both of which were computed in earlier iterations
3. After considering all vertices as potential intermediates, we have the true shortest paths

### Visual Representation

Consider a graph with 4 vertices:
```
     5
   0 --- 1
   |     |
  7     3
   |     |
   2 --- 3
      2
```

**Initial distance matrix (direct edges only):**
```
     0    1    2    3
0 [  0,   5,   7,  ∞  ]
1 [  5,   0,   3,   3  ]
2 [  7,   3,   0,   2  ]
3 [  ∞,   3,   2,   0  ]
```

**After considering vertex 0 as intermediate:**
- dist[1][2] = min(3, 5+7) = 3
- dist[2][1] = min(3, 7+5) = 3
- dist[1][3] = min(3, 5+∞) = 3
- dist[2][0] = min(7, 3+5) = 7

**After considering vertex 1 as intermediate:**
- dist[0][2] = min(7, 5+3) = 6 ✓ (0→1→2 is shorter)
- dist[0][3] = min(∞, 5+3) = 8 ✓ (0→1→3 is shorter)

**Final distance matrix:**
```
     0    1    2    3
0 [  0,   5,   6,   8  ]
1 [  5,   0,   3,   3  ]
2 [  6,   3,   0,   2  ]
3 [  8,   3,   2,   0  ]
```

### Limitations

- **Time Complexity**: O(V³) makes it impractical for very large graphs (V > 5000)
- **Space**: O(V²) for the distance matrix
- **Negative Cycles**: While it can detect negative cycles, paths through negative cycles are undefined (can become arbitrarily small)

---

## Algorithm Steps

### Step-by-Step Approach

1. **Initialize the distance matrix**
   - Create an n×n matrix where n is the number of vertices
   - Set dist[i][j] = 0 for all i = j (distance to self)
   - Set dist[i][j] = weight of edge (i,j) if edge exists
   - Set dist[i][j] = ∞ for all other pairs

2. **Iterate over intermediate vertices**
   - For each vertex k from 0 to n-1:
     - For each pair of vertices (i, j):
       - If dist[i][k] + dist[k][j] < dist[i][j]:
         - Update dist[i][j] = dist[i][k] + dist[k][j]

3. **Check for negative cycles** (optional)
   - After all iterations, if dist[i][i] < 0 for any i, a negative cycle exists

4. **Return the distance matrix**
   - Each entry dist[i][j] now contains the shortest distance from i to j

---

## Implementation

### Template Code (All-Pairs Shortest Path)

````carousel
```python
def floyd_warshall(n, edges, directed=False):
    """
    Floyd-Warshall All-Pairs Shortest Path Algorithm.
    
    Time Complexity: O(V³)
    Space Complexity: O(V²)
    
    Args:
        n: Number of vertices (0 to n-1)
        edges: List of (u, v, weight) tuples
        directed: If True, graph is directed; if False, undirected
    
    Returns:
        2D matrix where dist[i][j] = shortest distance from i to j
    """
    INF = float('inf')
    
    # Step 1: Initialize distance matrix
    dist = [[INF] * n for _ in range(n)]
    
    # Distance to self is 0
    for i in range(n):
        dist[i][i] = 0
    
    # Step 2: Set direct edge weights
    for u, v, w in edges:
        if w < dist[u][v]:  # Take minimum if multiple edges
            dist[u][v] = w
        if not directed:
            dist[v][u] = w
    
    # Step 3: Floyd-Warshall - consider each vertex as intermediate
    for k in range(n):
        for i in range(n):
            # Early termination: skip if i->k is unreachable
            if dist[i][k] == INF:
                continue
            for j in range(n):
                # Early termination: skip if k->j is unreachable
                if dist[k][j] == INF:
                    continue
                # Update if path through k is shorter
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
    
    return dist


def detect_negative_cycle(n, edges, directed=False):
    """
    Detect if graph contains a negative cycle using Floyd-Warshall.
    
    Returns:
        True if negative cycle exists, False otherwise
    """
    INF = float('inf')
    
    # Initialize
    dist = [[INF] * n for _ in range(n)]
    for i in range(n):
        dist[i][i] = 0
    
    for u, v, w in edges:
        if w < dist[u][v]:
            dist[u][v] = w
        if not directed:
            dist[v][u] = w
    
    # Floyd-Warshall
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] != INF and dist[k][j] != INF:
                    if dist[i][k] + dist[k][j] < dist[i][j]:
                        dist[i][j] = dist[i][k] + dist[k][j]
    
    # Check for negative cycles
    for i in range(n):
        if dist[i][i] < 0:
            return True
    
    return False


def get_path(dist, parent, u, v):
    """
    Reconstruct shortest path from u to v using parent matrix.
    
    Args:
        dist: Distance matrix from Floyd-Warshall
        parent: Parent matrix for path reconstruction
        u: Source vertex
        v: Destination vertex
    
    Returns:
        List of vertices in shortest path from u to v
    """
    if dist[u][v] == float('inf'):
        return []  # No path exists
    
    path = []
    current = u
    while current != v:
        path.append(current)
        current = parent[current][v]
        if current == -1:
            return []  # No path
    path.append(v)
    return path


def floyd_warshall_with_path(n, edges, directed=False):
    """
    Floyd-Warshall with path reconstruction.
    
    Returns:
        Tuple of (distance matrix, parent matrix)
    """
    INF = float('inf')
    
    # Initialize
    dist = [[INF] * n for _ in range(n)]
    parent = [[-1] * n for _ in range(n)]
    
    for i in range(n):
        dist[i][i] = 0
    
    for u, v, w in edges:
        dist[u][v] = w
        parent[u][v] = u
        if not directed:
            dist[v][u] = w
            parent[v][u] = v
    
    # Floyd-Warshall with path tracking
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] != INF and dist[k][j] != INF:
                    new_dist = dist[i][k] + dist[k][j]
                    if new_dist < dist[i][j]:
                        dist[i][j] = new_dist
                        parent[i][j] = parent[k][j]
    
    return dist, parent


# Example usage and demonstration
if __name__ == "__main__":
    # Build graph with 4 vertices
    #     5
    #   0 --- 1
    #   |     |
    #  7     3
    #   |     |
    #   2 --- 3
    #      2
    n = 4
    edges = [
        (0, 1, 5),   # 0 -> 1 with weight 5
        (0, 2, 7),   # 0 -> 2 with weight 7
        (1, 2, 3),   # 1 -> 2 with weight 3
        (1, 3, 3),   # 1 -> 3 with weight 3
        (2, 3, 2),   # 2 -> 3 with weight 2
    ]
    
    print("=" * 60)
    print("Floyd-Warshall Algorithm Demonstration")
    print("=" * 60)
    
    # Run Floyd-Warshall
    result = floyd_warshall(n, edges)
    
    # Print distance matrix
    print("\nAll-pairs shortest distances:")
    print("    0   1   2   3")
    print("  +" + "-" * 17 + "+")
    for i, row in enumerate(result):
        print(f"{i} | {row[0]:2d} {row[1]:2d} {row[2]:2d} {row[3]:2d} |")
    print("  +" + "-" * 17 + "+")
    
    # Print specific paths
    print("\nSpecific shortest distances:")
    print(f"  Distance 0 → 3: {result[0][3]} (path: 0 → 1 → 3)")
    print(f"  Distance 0 → 2: {result[0][2]} (path: 0 → 1 → 2)")
    print(f"  Distance 2 → 0: {result[2][0]} (path: 2 → 1 → 0)")
    
    # Demonstrate path reconstruction
    print("\n" + "=" * 60)
    print("Path Reconstruction Example")
    print("=" * 60)
    
    dist, parent = floyd_warshall_with_path(n, edges)
    path = get_path(dist, parent, 0, 2)
    print(f"\nShortest path from 0 to 2: {' → '.join(map(str, path))}")
    print(f"Distance: {dist[0][2]}")
    
    # Test negative cycle detection
    print("\n" + "=" * 60)
    print("Negative Cycle Detection")
    print("=" * 60)
    
    # Graph without negative cycle
    print(f"Graph (no negative cycle): {detect_negative_cycle(n, edges)}")
    
    # Graph with negative cycle
    n5 = 3
    edges_neg = [(0, 1, 1), (1, 2, -2), (2, 0, -1)]  # 1 + (-2) + (-1) = -2 < 0
    print(f"Graph (with negative cycle): {detect_negative_cycle(n5, edges_neg)}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <limits>
#include <algorithm>
using namespace std;

/**
 * Floyd-Warshall All-Pairs Shortest Path Algorithm.
 * 
 * Time Complexity: O(V³)
 * Space Complexity: O(V²)
 */
class FloydWarshall {
private:
    const int INF = numeric_limits<int>::max() / 4;
    int n;
    vector<vector<long long>> dist;
    vector<vector<int>> parent;
    
public:
    FloydWarshall(int n) : n(n) {
        dist.assign(n, vector<long long>(n, INF));
        parent.assign(n, vector<int>(n, -1));
        
        // Distance to self is 0
        for (int i = 0; i < n; i++) {
            dist[i][i] = 0;
        }
    }
    
    /**
     * Add an edge to the graph.
     * 
     * @param u Source vertex
     * @param v Destination vertex
     * @param w Weight (can be negative)
     * @param directed If true, edge is directed; otherwise undirected
     */
    void addEdge(int u, int v, long long w, bool directed = false) {
        if (w < dist[u][v]) {
            dist[u][v] = w;
            parent[u][v] = u;
        }
        if (!directed) {
            if (w < dist[v][u]) {
                dist[v][u] = w;
                parent[v][u] = v;
            }
        }
    }
    
    /**
     * Run the Floyd-Warshall algorithm.
     * 
     * @return Reference to this object for chaining
     */
    FloydWarshall& run() {
        // Floyd-Warshall main loops
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                if (dist[i][k] == INF) continue;
                for (int j = 0; j < n; j++) {
                    if (dist[k][j] == INF) continue;
                    if (dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                        parent[i][j] = parent[k][j];
                    }
                }
            }
        }
        return *this;
    }
    
    /**
     * Get the shortest distance from u to v.
     * 
     * @param u Source vertex
     * @param v Destination vertex
     * @return Shortest distance, or INF if no path exists
     */
    long long getDistance(int u, int v) const {
        return dist[u][v];
    }
    
    /**
     * Get the shortest path from u to v.
     * 
     * @param u Source vertex
     * @param v Destination vertex
     * @return Vector of vertices in the path, empty if no path exists
     */
    vector<int> getPath(int u, int v) const {
        if (dist[u][v] == INF) return {};
        
        vector<int> path;
        int current = u;
        while (current != v) {
            path.push_back(current);
            current = parent[current][v];
            if (current == -1) return {};
        }
        path.push_back(v);
        return path;
    }
    
    /**
     * Check if there's a negative cycle in the graph.
     * 
     * @return true if negative cycle exists
     */
    bool hasNegativeCycle() const {
        for (int i = 0; i < n; i++) {
            if (dist[i][i] < 0) return true;
        }
        return false;
    }
    
    /**
     * Print the distance matrix.
     */
    void printDistances() const {
        cout << "All-pairs shortest distances:" << endl;
        cout << "    ";
        for (int j = 0; j < n; j++) {
            cout << "  " << j << " ";
        }
        cout << endl;
        cout << "  +";
        for (int j = 0; j < n; j++) {
            cout << "----";
        }
        cout << "+" << endl;
        
        for (int i = 0; i < n; i++) {
            cout << i << " |";
            for (int j = 0; j < n; j++) {
                if (dist[i][j] == INF) {
                    cout << " INF";
                } else {
                    cout << " " << dist[i][j] << " ";
                }
            }
            cout << " |" << endl;
        }
        cout << "  +";
        for (int j = 0; j < n; j++) {
            cout << "----";
        }
        cout << "+" << endl;
    }
};


int main() {
    // Build graph with 4 vertices
    //     5
    //   0 --- 1
    //   |     |
    //  7     3
    //   |     |
    //   2 --- 3
    //      2
    
    FloydWarshall fw(4);
    fw.addEdge(0, 1, 5);
    fw.addEdge(0, 2, 7);
    fw.addEdge(1, 2, 3);
    fw.addEdge(1, 3, 3);
    fw.addEdge(2, 3, 2);
    
    cout << "=" << 60 << endl;
    cout << "Floyd-Warshall Algorithm Demonstration" << endl;
    cout << "=" << 60 << endl;
    
    // Run algorithm
    fw.run();
    
    // Print distances
    fw.printDistances();
    
    // Print specific paths
    cout << "\nSpecific shortest distances:" << endl;
    cout << "  Distance 0 → 3: " << fw.getDistance(0, 3) << " (path: 0 → 1 → 3)" << endl;
    cout << "  Distance 0 → 2: " << fw.getDistance(0, 2) << " (path: 0 → 1 → 2)" << endl;
    cout << "  Distance 2 → 0: " << fw.getDistance(2, 0) << " (path: 2 → 1 → 0)" << endl;
    
    // Demonstrate path reconstruction
    cout << "\n" << "=" << 60 << endl;
    cout << "Path Reconstruction Example" << endl;
    cout << "=" << 60 << endl;
    
    vector<int> path = fw.getPath(0, 2);
    cout << "\nShortest path from 0 to 2: ";
    for (size_t i = 0; i < path.size(); i++) {
        cout << path[i];
        if (i < path.size() - 1) cout << " → ";
    }
    cout << endl;
    cout << "Distance: " << fw.getDistance(0, 2) << endl;
    
    // Test negative cycle detection
    cout << "\n" << "=" << 60 << endl;
    cout << "Negative Cycle Detection" << endl;
    cout << "=" << 60 << endl;
    
    FloydWarshall fwNeg(3);
    fwNeg.addEdge(0, 1, 1);
    fwNeg.addEdge(1, 2, -2);
    fwNeg.addEdge(2, 0, -1);
    fwNeg.run();
    
    cout << "Graph (no negative cycle): " << (fw.hasNegativeCycle() ? "Yes" : "No") << endl;
    cout << "Graph (with negative cycle): " << (fwNeg.hasNegativeCycle() ? "Yes" : "No") << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Floyd-Warshall All-Pairs Shortest Path Algorithm.
 * 
 * Time Complexity: O(V³)
 * Space Complexity: O(V²)
 */
public class FloydWarshall {
    private static final long INF = Long.MAX_VALUE / 4;
    
    private int n;
    private long[][] dist;
    private int[][] parent;
    
    public FloydWarshall(int n) {
        this.n = n;
        this.dist = new long[n][n];
        this.parent = new int[n][n];
        
        // Initialize distance matrix
        for (int i = 0; i < n; i++) {
            Arrays.fill(dist[i], INF);
            Arrays.fill(parent[i], -1);
            dist[i][i] = 0;
        }
    }
    
    /**
     * Add an edge to the graph.
     */
    public void addEdge(int u, int v, long weight) {
        addEdge(u, v, weight, false);
    }
    
    /**
     * Add an edge to the graph.
     * 
     * @param u Source vertex
     * @param v Destination vertex
     * @param weight Edge weight (can be negative)
     * @param directed If true, edge is directed
     */
    public void addEdge(int u, int v, long weight, boolean directed) {
        if (weight < dist[u][v]) {
            dist[u][v] = weight;
            parent[u][v] = u;
        }
        if (!directed) {
            if (weight < dist[v][u]) {
                dist[v][u] = weight;
                parent[v][u] = v;
            }
        }
    }
    
    /**
     * Run the Floyd-Warshall algorithm.
     */
    public void run() {
        // Floyd-Warshall main loops
        for (int k = 0; k < n; k++) {
            for (int i = 0; i < n; i++) {
                if (dist[i][k] == INF) continue;
                for (int j = 0; j < n; j++) {
                    if (dist[k][j] == INF) continue;
                    if (dist[i][k] + dist[k][j] < dist[i][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                        parent[i][j] = parent[k][j];
                    }
                }
            }
        }
    }
    
    /**
     * Get the shortest distance from u to v.
     */
    public long getDistance(int u, int v) {
        return dist[u][v];
    }
    
    /**
     * Get the shortest path from u to v.
     */
    public List<Integer> getPath(int u, int v) {
        if (dist[u][v] == INF) return Collections.emptyList();
        
        List<Integer> path = new ArrayList<>();
        int current = u;
        while (current != v) {
            path.add(current);
            current = parent[current][v];
            if (current == -1) return Collections.emptyList();
        }
        path.add(v);
        return path;
    }
    
    /**
     * Check if there's a negative cycle.
     */
    public boolean hasNegativeCycle() {
        for (int i = 0; i < n; i++) {
            if (dist[i][i] < 0) return true;
        }
        return false;
    }
    
    /**
     * Print the distance matrix.
     */
    public void printDistances() {
        System.out.println("All-pairs shortest distances:");
        System.out.print("    ");
        for (int j = 0; j < n; j++) {
            System.out.printf("%3d ", j);
        }
        System.out.println();
        System.out.print("  +");
        for (int j = 0; j < n; j++) {
            System.out.print("----");
        }
        System.out.println("+");
        
        for (int i = 0; i < n; i++) {
            System.out.print(i + " |");
            for (int j = 0; j < n; j++) {
                if (dist[i][j] == INF) {
                    System.out.print(" INF");
                } else {
                    System.out.printf(" %2d ", dist[i][j]);
                }
            }
            System.out.println(" |");
        }
        System.out.print("  +");
        for (int j = 0; j < n; j++) {
            System.out.print("----");
        }
        System.out.println("+");
    }
    
    /**
     * Main method for demonstration.
     */
    public static void main(String[] args) {
        // Build graph with 4 vertices
        FloydWarshall fw = new FloydWarshall(4);
        fw.addEdge(0, 1, 5);
        fw.addEdge(0, 2, 7);
        fw.addEdge(1, 2, 3);
        fw.addEdge(1, 3, 3);
        fw.addEdge(2, 3, 2);
        
        System.out.println("============================================================");
        System.out.println("Floyd-Warshall Algorithm Demonstration");
        System.out.println("============================================================");
        
        // Run algorithm
        fw.run();
        
        // Print distances
        fw.printDistances();
        
        // Print specific paths
        System.out.println("\nSpecific shortest distances:");
        System.out.println("  Distance 0 → 3: " + fw.getDistance(0, 3) + " (path: 0 → 1 → 3)");
        System.out.println("  Distance 0 → 2: " + fw.getDistance(0, 2) + " (path: 0 → 1 → 2)");
        System.out.println("  Distance 2 → 0: " + fw.getDistance(2, 0) + " (path: 2 → 1 → 0)");
        
        // Demonstrate path reconstruction
        System.out.println("\n============================================================");
        System.out.println("Path Reconstruction Example");
        System.out.println("============================================================");
        
        List<Integer> path = fw.getPath(0, 2);
        System.out.print("\nShortest path from 0 to 2: ");
        System.out.println(String.join(" → ", path.stream().map(String::valueOf).toList()));
        System.out.println("Distance: " + fw.getDistance(0, 2));
        
        // Test negative cycle detection
        System.out.println("\n============================================================");
        System.out.println("Negative Cycle Detection");
        System.out.println("============================================================");
        
        FloydWarshall fwNeg = new FloydWarshall(3);
        fwNeg.addEdge(0, 1, 1);
        fwNeg.addEdge(1, 2, -2);
        fwNeg.addEdge(2, 0, -1);
        fwNeg.run();
        
        System.out.println("Graph (with negative cycle): " + (fwNeg.hasNegativeCycle() ? "Yes" : "No"));
    }
}
```

<!-- slide -->
```javascript
/**
 * Floyd-Warshall All-Pairs Shortest Path Algorithm.
 * 
 * Time Complexity: O(V³)
 * Space Complexity: O(V²)
 */
class FloydWarshall {
    /**
     * Create a Floyd-Warshall instance.
     * @param {number} n - Number of vertices
     */
    constructor(n) {
        this.n = n;
        this.INF = Number.MAX_SAFE_INTEGER / 4;
        
        // Initialize distance matrix
        this.dist = Array.from({ length: n }, () => 
            Array.from({ length: n }, () => this.INF)
        );
        this.parent = Array.from({ length: n }, () => 
            Array.from({ length: n }, () => -1)
        );
        
        // Distance to self is 0
        for (let i = 0; i < n; i++) {
            this.dist[i][i] = 0;
        }
    }
    
    /**
     * Add an edge to the graph.
     * @param {number} u - Source vertex
     * @param {number} v - Destination vertex
     * @param {number} weight - Edge weight (can be negative)
     * @param {boolean} directed - If true, edge is directed
     */
    addEdge(u, v, weight, directed = false) {
        if (weight < this.dist[u][v]) {
            this.dist[u][v] = weight;
            this.parent[u][v] = u;
        }
        if (!directed) {
            if (weight < this.dist[v][u]) {
                this.dist[v][u] = weight;
                this.parent[v][u] = v;
            }
        }
    }
    
    /**
     * Run the Floyd-Warshall algorithm.
     * @returns {FloydWarshall} this for chaining
     */
    run() {
        // Floyd-Warshall main loops
        for (let k = 0; k < this.n; k++) {
            for (let i = 0; i < this.n; i++) {
                if (this.dist[i][k] === this.INF) continue;
                for (let j = 0; j < this.n; j++) {
                    if (this.dist[k][j] === this.INF) continue;
                    const newDist = this.dist[i][k] + this.dist[k][j];
                    if (newDist < this.dist[i][j]) {
                        this.dist[i][j] = newDist;
                        this.parent[i][j] = this.parent[k][j];
                    }
                }
            }
        }
        return this;
    }
    
    /**
     * Get the shortest distance from u to v.
     * @param {number} u - Source vertex
     * @param {number} v - Destination vertex
     * @returns {number} Shortest distance, or INF if no path exists
     */
    getDistance(u, v) {
        return this.dist[u][v];
    }
    
    /**
     * Get the shortest path from u to v.
     * @param {number} u - Source vertex
     * @param {number} v - Destination vertex
     * @returns {number[]} Array of vertices in the path
     */
    getPath(u, v) {
        if (this.dist[u][v] === this.INF) return [];
        
        const path = [];
        let current = u;
        while (current !== v) {
            path.push(current);
            current = this.parent[current][v];
            if (current === -1) return [];
        }
        path.push(v);
        return path;
    }
    
    /**
     * Check if there's a negative cycle.
     * @returns {boolean} true if negative cycle exists
     */
    hasNegativeCycle() {
        for (let i = 0; i < this.n; i++) {
            if (this.dist[i][i] < 0) return true;
        }
        return false;
    }
    
    /**
     * Print the distance matrix.
     */
    printDistances() {
        console.log('All-pairs shortest distances:');
        
        // Header
        let header = '    ';
        for (let j = 0; j < this.n; j++) {
            header += `  ${j} `;
        }
        console.log(header);
        console.log('  +' + '----'.repeat(this.n) + '+');
        
        // Rows
        for (let i = 0; i < this.n; i++) {
            let row = `${i} |`;
            for (let j = 0; j < this.n; j++) {
                if (this.dist[i][j] === this.INF) {
                    row += ' INF';
                } else {
                    row += ` ${this.dist[i][j]}  `;
                }
            }
            row += ' |';
            console.log(row);
        }
        console.log('  +' + '----'.repeat(this.n) + '+');
    }
}


// Example usage and demonstration
// Build graph with 4 vertices
//     5
//   0 --- 1
//   |     |
//  7     3
//   |     |
//   2 --- 3
//      2

const fw = new FloydWarshall(4);
fw.addEdge(0, 1, 5);
fw.addEdge(0, 2, 7);
fw.addEdge(1, 2, 3);
fw.addEdge(1, 3, 3);
fw.addEdge(2, 3, 2);

console.log('============================================================');
console.log('Floyd-Warshall Algorithm Demonstration');
console.log('============================================================');

// Run algorithm
fw.run();

// Print distances
fw.printDistances();

// Print specific paths
console.log('\nSpecific shortest distances:');
console.log(`  Distance 0 → 3: ${fw.getDistance(0, 3)} (path: 0 → 1 → 3)`);
console.log(`  Distance 0 → 2: ${fw.getDistance(0, 2)} (path: 0 → 1 → 2)`);
console.log(`  Distance 2 → 0: ${fw.getDistance(2, 0)} (path: 2 → 1 → 0)`);

// Demonstrate path reconstruction
console.log('\n============================================================');
console.log('Path Reconstruction Example');
console.log('============================================================');

const path = fw.getPath(0, 2);
console.log(`\nShortest path from 0 to 2: ${path.join(' → ')}`);
console.log(`Distance: ${fw.getDistance(0, 2)}`);

// Test negative cycle detection
console.log('\n============================================================');
console.log('Negative Cycle Detection');
console.log('============================================================');

const fwNeg = new FloydWarshall(3);
fwNeg.addEdge(0, 1, 1);
fwNeg.addEdge(1, 2, -2);
fwNeg.addEdge(2, 0, -1);
fwNeg.run();

console.log(`Graph (with negative cycle): ${fwNeg.hasNegativeCycle() ? 'Yes' : 'No'}`);
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Initialization** | O(V² + E) | Set up distance matrix and process edges |
| **Main Algorithm** | O(V³) | Three nested loops over all vertices |
| **Path Reconstruction** | O(V) | Building a single path |
| **All Paths** | O(V³) | Reconstructing all paths |

### Detailed Breakdown

- **Three nested loops**: For each intermediate vertex k (V iterations), we iterate through all source vertices i (V iterations) and all destination vertices j (V iterations)
- **Total iterations**: V × V × V = V³
- **Early termination optimization**: Skip iterations where dist[i][k] or dist[k][j] is INF

### Complexity Comparison

| Graph Type | Floyd-Warshall | Dijkstra (×V) | Bellman-Ford (×V) |
|------------|---------------|---------------|-------------------|
| Dense (E = V²) | O(V³) | O(V³) | O(V³) |
| Sparse (E = V) | O(V³) | O(V² log V) | O(V²) |
| Very Sparse (E = O(V)) | O(V³) | O(V log V) | O(V) |

---

## Space Complexity Analysis

- **Distance Matrix**: O(V²) - stores shortest distances between all pairs
- **Parent Matrix**: O(V²) - for path reconstruction (optional)
- **Total**: O(V²)

### Space Optimization Options

1. **In-place updates**: Modify the distance matrix directly (lose path info)
2. **Single-source queries**: If you only need paths from one source, use Dijkstra instead
3. **Sparse representation**: Use adjacency list and only store finite distances

---

## Common Variations

### 1. Transitive Closure (Reachability)

Instead of shortest paths, compute whether a path exists between any two vertices:

````carousel
```python
def transitive_closure(n, edges, directed=False):
    """
    Compute transitive closure using Floyd-Warshall.
    
    Returns:
        2D matrix where reach[i][j] = True if j is reachable from i
    """
    reach = [[False] * n for _ in range(n)]
    
    # Initialize
    for i in range(n):
        reach[i][i] = True
    
    for u, v, w in edges:
        reach[u][v] = True
        if not directed:
            reach[v][u] = True
    
    # Floyd-Warshall for reachability
    for k in range(n):
        for i in range(n):
            for j in range(n):
                if reach[i][k] and reach[k][j]:
                    reach[i][j] = True
    
    return reach
```
````

### 2. Finding Graph Center

The center of a graph is the vertex with minimum eccentricity (minimum of maximum distances to all other vertices):

````carousel
```python
def graph_center(dist):
    """
    Find the center of a graph using Floyd-Warshall distances.
    
    Returns:
        The vertex that minimizes the maximum distance to any other vertex
    """
    n = len(dist)
    min_max_dist = float('inf')
    center = -1
    
    for i in range(n):
        # Find maximum distance from i to any other vertex
        max_dist = max(dist[i][j] for j in range(n) if dist[i][j] != float('inf'))
        if max_dist < min_max_dist:
            min_max_dist = max_dist
            center = i
    
    return center
```
````

### 3. Johnson's Algorithm (Hybrid)

For sparse graphs with negative weights, Johnson's algorithm combines Bellman-Ford with Dijkstra:

- Use Bellman-Ford once to reweight edges
- Run Dijkstra V times with reweighted edges
- Time: O(VE + V² log V) - better than Floyd-Warshall for sparse graphs

### 4. Weighted Directed Acyclic Graph (DAG) Shortest Paths

For DAGs, use topological sort + single pass:
- Time: O(V + E)
- Space: O(V)

---

## Practice Problems

### Problem 1: Network Delay Time

**Problem:** [LeetCode 743 - Network Delay Time](https://leetcode.com/problems/network-delay-time/)

**Description:** Given a network of n nodes labeled 1 to n, and a list of directed edges with travel times, find the minimum time it takes for the signal to reach all nodes.

**How to Apply Floyd-Warshall:**
- Build the distance matrix with all edges
- Run Floyd-Warshall to compute all-pairs shortest paths
- Find the maximum distance from the source to any reachable node

---

### Problem 2: Find the City With the Smallest Number of Neighbors

**Problem:** [LeetCode 1334 - Find the City With the Smallest Number of Neighbors at a Threshold Distance](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/)

**Description:** Given n cities and edges with travel times, find the city with the smallest number of cities reachable within distance threshold.

**How to Apply Floyd-Warshall:**
- Use Floyd-Warshall to compute all-pairs shortest paths
- For each city, count how many other cities are reachable within the threshold
- Select the city with minimum such count

---

### Problem 3: Detect Negative Cycle

**Problem:** [LeetCode 1584 - Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points/)

**Description:** You are given an array of points. Find the minimum cost to make all points connected where the cost between two points is the Manhattan distance.

**How to Apply Floyd-Warshall:**
- Build complete graph with all pairwise distances
- Floyd-Warshall can verify no negative cycles (though not needed here)
- Alternative: Use Prim's or Kruskal's for minimum spanning tree

---

### Problem 4: Shortest Path in Weighted Directed Graph

**Problem:** [LeetCode 787 - Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/)

**Description:** There are n cities connected by flights. Each flight has a price. Find the cheapest price from source to destination with at most K stops.

**How to Apply Floyd-Warshall:**
- While Floyd-Warshall computes shortest paths without stops limit
- For K-stop variant, use dynamic programming or modified Bellman-Ford
- Floyd-Warshall variant can track number of edges used

---

### Problem 5: Longest Path in DAG

**Problem:** [LeetCode 2699 - Modify Graph Edge Weights](https://leetcode.com/problems/modify-graph-edge-weights/)

**Description:** You are given a directed weighted graph with n nodes. Modify the weights to make the shortest path from 0 to n-1 equal to target.

**How to Apply Floyd-Warshall:**
- Use Floyd-Warshall to understand current shortest paths
- Identify edges that need modification
- Adjust edge weights to achieve target distance

---

## Video Tutorial Links

### Fundamentals

- [Floyd-Warshall Algorithm - Introduction (Take U Forward)](https://www.youtube.com/watch?v=1E5s7f1jH3w) - Comprehensive introduction
- [Floyd-Warshall Implementation (WilliamFiset)](https://www.youtube.com/watch?v=oL1s8oKQ0p8) - Detailed implementation guide
- [All-Pairs Shortest Path (NeetCode)](https://www.youtube.com/watch?v=6qM7t_2X9cM) - Practical problem-solving approach

### Advanced Topics

- [Negative Edge Weights and Cycle Detection](https://www.youtube.com/watch?v=9E2L4t_ZEwU) - Handling negative weights
- [Path Reconstruction](https://www.youtube.com/watch?v=L1L8q7z1s3g) - Building actual paths
- [Johnson's Algorithm](https://www.youtube.com/watch?v=c8-2qKh7a9U) - Hybrid approach for sparse graphs
- [Transitive Closure](https://www.youtube.com/watch?v=6X7f8sK5vYs) - Reachability problems

---

## Follow-up Questions

### Q1: How does Floyd-Warshall handle negative edge weights?

**Answer:** Floyd-Warshall correctly handles negative edge weights as long as there are no negative cycles. The algorithm works by repeatedly improving path estimates, which naturally handles negative weights. However, if a negative cycle exists (a cycle whose total weight is negative), the shortest path is undefined because you can loop infinitely to get arbitrarily small distances. The algorithm can detect this by checking if any dist[i][i] becomes negative after running.

### Q2: What is the difference between Floyd-Warshall and Dijkstra's algorithm?

**Answer:** Key differences:
- **Scope**: Floyd-Warshall computes ALL pairs; Dijkstra computes from ONE source
- **Time**: Floyd-Warshall is O(V³); Dijkstra is O(E log V) per source
- **Weights**: Both handle positive weights; Floyd-Warshall also handles negative weights
- **Use case**: Use Floyd-Warshall when you need many source-destination pairs; use Dijkstra for single-source queries

### Q3: Can Floyd-Warshall be parallelized?

**Answer:** Yes! The algorithm has good parallelism potential:
- The inner loop over j can be parallelized for each (i, k) pair
- GPU implementations can process the entire k-th iteration in parallel
- OpenMP and CUDA can significantly speed up the computation
- However, data dependencies between k-iterations prevent full parallelization

### Q4: How do you reconstruct the actual path in Floyd-Warshall?

**Answer:** Use a parent/next matrix:
1. Initialize parent[u][v] = u when there's a direct edge
2. When updating dist[i][j] through k, set parent[i][j] = parent[k][j]
3. To reconstruct path from u to v: follow parent pointers from u to v

### Q5: When should you use Johnson's algorithm instead of Floyd-Warshall?

**Answer:** Use Johnson's algorithm when:
- The graph is sparse (E << V²)
- You have negative weights but no negative cycles
- You need single-source shortest paths from multiple sources

Johnson's algorithm: O(VE + V² log V) vs Floyd-Warshall: O(V³)
- For dense graphs: Floyd-Warshall is better
- For sparse graphs: Johnson's algorithm is better

---

## Summary

The Floyd-Warshall algorithm is a fundamental tool for solving **all-pairs shortest path** problems in graphs. Key takeaways:

- **Complete solution**: Computes shortest paths between ALL pairs of vertices
- **Negative weights**: Handles negative edge weights (detects negative cycles)
- **Dynamic programming**: Elegant O(V³) solution using the principle of considering intermediate vertices
- **Path reconstruction**: Can reconstruct actual paths using a parent matrix

When to use:
- ✅ All-pairs shortest paths needed
- ✅ Graph is dense (E ≈ V²)
- ✅ Negative edge weights present
- ✅ Multiple distance queries required
- ❌ Graph is very large (V > 5000) - use Dijkstra instead
- ❌ Only single-source needed - use Dijkstra/Bellman-Ford

This algorithm is essential for competitive programming and technical interviews, especially in problems involving network routing, graph distance queries, and reachability analysis.

---

## Related Algorithms

- [Dijkstra's Algorithm](./dijkstra.md) - Single-source shortest path
- [Bellman-Ford](./bellman-ford.md) - Single-source with negative weights
- [ Johnson's Algorithm](./johnsons.md) - Hybrid approach for sparse graphs
- [Topological Sort](./topological-sort.md) - DAG shortest paths
