# Bellman-Ford Algorithm

## Category
Graphs

## Description
The Bellman-Ford algorithm finds the shortest path from a single source vertex to all other vertices in a weighted graph. Unlike Dijkstra's algorithm, Bellman-Ford can handle graphs with **negative edge weights** and can detect **negative cycles**. This makes it essential for problems where edge weights may be negative, such as in currency arbitrage detection, network routing, and certain optimization problems.

---

## When to Use

Use the Bellman-Ford algorithm when you need to solve problems involving:

- **Negative Edge Weights**: When the graph contains edges with negative weights
- **Negative Cycle Detection**: When you need to detect if a negative cycle exists in the graph
- **Single-Source Shortest Path**: When finding shortest paths from one source to all other vertices
- **Constraint Problems**: When problems can be modeled as shortest path with potential negative cycles

### Comparison with Alternatives

| Algorithm | Handles Negative Weights | Detects Negative Cycles | Time Complexity | Best For |
|-----------|-------------------------|------------------------|-----------------|----------|
| **Bellman-Ford** | ✅ Yes | ✅ Yes | O(V × E) | Graphs with negative weights |
| **Dijkstra's** | ❌ No | ❌ No | O((V + E) log V) | Dense graphs with positive weights |
| **Floyd-Warshall** | ✅ Yes | ✅ Yes | O(V³) | All-pairs shortest path |
| **SPFA** | ✅ Yes | ✅ Yes | O(V × E) average | Sparse graphs, often faster in practice |

### When to Choose Bellman-Ford vs Dijkstra

- **Choose Bellman-Ford** when:
  - Graph has negative edge weights
  - You need to detect negative cycles
  - You're unsure if all weights are non-negative
  
- **Choose Dijkstra's** when:
  - All edge weights are guaranteed non-negative
  - You need faster execution (uses priority queue)
  - Graph is large and sparse

---

## Algorithm Explanation

### Core Concept

The key insight behind Bellman-Ford is that in a graph without negative cycles, the shortest path between any two vertices contains at most **V-1 edges** (where V is the number of vertices). By repeatedly relaxing all edges, we progressively find shorter paths using more edges.

### How It Works

#### Initialization:
1. Set the distance to the source vertex as 0
2. Set all other vertices' distances to infinity (∞)

#### Relaxation Process:
1. **Repeat V-1 times**: For every edge (u, v) with weight w:
   - If `dist[u] + w < dist[v]`, then update `dist[v] = dist[u] + w`
2. This ensures we find shortest paths using paths of increasing length

#### Negative Cycle Detection:
- After V-1 iterations, perform one more pass
- If any edge can still be relaxed, a negative cycle exists
- The algorithm can traverse the cycle infinitely to get arbitrarily short paths

### Visual Representation

```
Graph with 5 vertices:
        
        4          2
    0 --------> 1 --------> 3
    |           |
    |           | -3
    v           v
    2           4
    |           |
    +-----------+

Iteration 0: dist = [0, ∞, ∞, ∞, ∞]
Iteration 1: dist = [0, 4, 2, ∞, ∞]
             (relax 0→1, 0→2, then 1→2, 1→4 with -3)
Iteration 2: dist = [0, 4, 2, 6, 1]
             (relax 2→3, 3→4, 1→3)
Final:       [0, 4, 2, 5, 1]
```

### Why V-1 Iterations?

In a graph without negative cycles:
- The shortest path between any two vertices uses at most V-1 edges
- Each iteration of relaxation finds shortest paths using at most one more edge
- After V-1 iterations, all shortest paths (of length ≤ V-1 edges) are found
- Any remaining relaxable edges indicate a negative cycle

### Limitations

- **Time Complexity**: O(V × E) - slower than Dijkstra for sparse graphs
- **Negative Cycles**: Can cause the algorithm to not terminate (hence the detection step)
- **Not for All-Pairs**: For all-pairs, Floyd-Warshall may be more efficient

---

## Algorithm Steps

### Step-by-Step Approach

1. **Understand the Graph**
   - Identify the number of vertices (V)
   - Identify all edges with their weights (directed edges)
   - Determine the source vertex

2. **Initialize Distances**
   - Create an array `dist` of size V
   - Set `dist[source] = 0`
   - Set all other distances to infinity (use a large number like `float('inf')` or `Integer.MAX_VALUE`)

3. **Perform V-1 Relaxations**
   - For `i` from 1 to V-1:
     - For each edge (u, v, w):
       - If `dist[u] != infinity` AND `dist[u] + w < dist[v]`:
         - Update `dist[v] = dist[u] + w`

4. **Detect Negative Cycles**
   - For each edge (u, v, w):
     - If `dist[u] != infinity` AND `dist[u] + w < dist[v]`:
       - Negative cycle detected!
       - Return or handle accordingly

5. **Return Results**
   - Return the distance array
   - Optionally return whether a negative cycle was found

---

## Implementation

### Template Code (Single-Source Shortest Path)

````carousel
```python
from typing import List, Tuple, Optional

def bellman_ford(vertices: int, edges: List[Tuple[int, int, int]], source: int) -> Tuple[List[Optional[int]], bool]:
    """
    Bellman-Ford algorithm to find shortest paths from source to all vertices.
    
    Args:
        vertices: Number of vertices (0 to vertices-1)
        edges: List of tuples (u, v, w) representing edge from u to v with weight w
        source: Source vertex
    
    Returns:
        Tuple of (distances, has_negative_cycle)
        - distances: List where distances[i] is the shortest distance from source to i
                      None if vertex is unreachable
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
    
    # Convert infinity to None for unreachable vertices
    dist = [None if d == float('inf') else d for d in dist]
    
    return dist, has_negative_cycle


def bellman_ford_with_path(vertices: int, edges: List[Tuple[int, int, int]], source: int) -> Tuple[List[Optional[int]], List[Optional[int]], bool]:
    """
    Bellman-Ford with path reconstruction.
    
    Returns:
        - distances: Shortest distances from source
        - parent: Parent vertex for path reconstruction (-1 if unreachable or source)
        - has_negative_cycle: Whether negative cycle exists
    """
    dist = [float('inf')] * vertices
    parent = [-1] * vertices
    dist[source] = 0
    
    # V-1 relaxations
    for _ in range(vertices - 1):
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                parent[v] = u
    
    # Negative cycle check
    has_negative_cycle = False
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            has_negative_cycle = True
            break
    
    # Convert to None for unreachable
    dist = [None if d == float('inf') else d for d in dist]
    
    return dist, parent, has_negative_cycle


def reconstruct_path(parent: List[int], source: int, target: int) -> List[int]:
    """Reconstruct path from source to target using parent array."""
    if parent[target] == -1 and target != source:
        return []  # No path exists
    
    path = []
    current = target
    while current != -1:
        path.append(current)
        current = parent[current]
    
    path.reverse()
    return path if path[0] == source else []


# Example usage and demonstration
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
    
    print("\n" + "="*50)
    print("With path reconstruction:")
    dist, parent, has_cycle = bellman_ford_with_path(vertices, edges, source)
    
    for target in range(vertices):
        path = reconstruct_path(parent, source, target)
        if path:
            print(f"Path to {target}: {path} (distance: {dist[target]})")
        else:
            print(f"No path to {target}")
    
    # Test with negative cycle
    print("\n" + "="*50)
    print("Testing with negative cycle:")
    vertices_cycle = 3
    edges_cycle = [
        (0, 1, 2),
        (1, 2, -3),
        (2, 0, -1)  # Creates cycle: 0→1→2→0 with total weight -2
    ]
    dist, _ = bellman_ford(vertices_cycle, edges_cycle, 0)
    print(f"Distances: {dist}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <limits>
#include <tuple>
using namespace std;

/**
 * Bellman-Ford algorithm to find shortest paths from source to all vertices.
 * 
 * Time Complexity: O(V * E)
 * Space Complexity: O(V)
 */
class BellmanFord {
private:
    int V;  // Number of vertices
    vector<tuple<int, int, int>> edges;  // (u, v, w)
    
public:
    BellmanFord(int vertices) : V(vertices) {}
    
    // Add directed edge
    void addEdge(int u, int v, int w) {
        edges.emplace_back(u, v, w);
    }
    
    /**
     * Find shortest paths from source to all vertices.
     * 
     * Returns: pair(distances, hasNegativeCycle)
     * - distances: vector where distances[i] is shortest distance from source to i
     *              (INF if unreachable)
     * - hasNegativeCycle: true if negative cycle detected
     */
    pair<vector<long long>, bool> shortestPath(int source) {
        const long long INF = LLONG_MAX / 4;
        vector<long long> dist(V, INF);
        dist[source] = 0;
        
        // Relax all edges V-1 times
        for (int i = 0; i < V - 1; i++) {
            for (const auto& [u, v, w] : edges) {
                if (dist[u] != INF && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                }
            }
        }
        
        // Check for negative cycles
        bool hasNegativeCycle = false;
        for (const auto& [u, v, w] : edges) {
            if (dist[u] != INF && dist[u] + w < dist[v]) {
                hasNegativeCycle = true;
                break;
            }
        }
        
        return {dist, hasNegativeCycle};
    }
    
    /**
     * Find shortest paths with path reconstruction.
     */
    tuple<vector<long long>, vector<int>, bool> shortestPathWithParent(int source) {
        const long long INF = LLONG_MAX / 4;
        vector<long long> dist(V, INF);
        vector<int> parent(V, -1);
        dist[source] = 0;
        
        // V-1 relaxations
        for (int i = 0; i < V - 1; i++) {
            for (const auto& [u, v, w] : edges) {
                if (dist[u] != INF && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    parent[v] = u;
                }
            }
        }
        
        // Check for negative cycles
        bool hasNegativeCycle = false;
        for (const auto& [u, v, w] : edges) {
            if (dist[u] != INF && dist[u] + w < dist[v]) {
                hasNegativeCycle = true;
                break;
            }
        }
        
        return {dist, parent, hasNegativeCycle};
    }
};

// Reconstruct path from source to target
vector<int> reconstructPath(const vector<int>& parent, int source, int target) {
    if (parent[target] == -1 && target != source) return {};
    
    vector<int> path;
    int current = target;
    while (current != -1) {
        path.push_back(current);
        current = parent[current];
    }
    
    reverse(path.begin(), path.end());
    return path[0] == source ? path : vector<int>();
}


int main() {
    // Create graph with 5 vertices
    BellmanFord bf(5);
    
    // Add edges: (u, v, weight)
    bf.addEdge(0, 1, 4);
    bf.addEdge(0, 2, 2);
    bf.addEdge(1, 2, 3);
    bf.addEdge(1, 3, 2);
    bf.addEdge(2, 3, 5);
    bf.addEdge(1, 4, -3);  // negative weight
    bf.addEdge(3, 4, 4);
    
    int source = 0;
    
    auto [dist, hasNegCycle] = bf.shortestPath(source);
    
    cout << "Source: " << source << endl;
    cout << "Negative cycle detected: " << (hasNegCycle ? "Yes" : "No") << endl;
    cout << "Shortest distances:" << endl;
    for (int i = 0; i < 5; i++) {
        cout << "  Vertex " << i << ": ";
        if (dist[i] == LLONG_MAX / 4) {
            cout << "INF (unreachable)";
        } else {
            cout << dist[i];
        }
        cout << endl;
    }
    
    cout << "\n" << string(50, '=') << endl;
    cout << "With path reconstruction:" << endl;
    
    auto [dist2, parent, hasCycle] = bf.shortestPathWithParent(source);
    for (int target = 0; target < 5; target++) {
        vector<int> path = reconstructPath(parent, source, target);
        if (!path.empty()) {
            cout << "Path to " << target << ": ";
            for (size_t i = 0; i < path.size(); i++) {
                cout << path[i] << (i < path.size() - 1 ? " -> " : "");
            }
            cout << " (distance: " << dist2[target] << ")" << endl;
        } else {
            cout << "No path to " << target << endl;
        }
    }
    
    // Test with negative cycle
    cout << "\n" << string(50, '=') << endl;
    cout << "Testing with negative cycle:" << endl;
    
    BellmanFord bf2(3);
    bf2.addEdge(0, 1, 2);
    bf2.addEdge(1, 2, -3);
    bf2.addEdge(2, 0, -1);  // Creates negative cycle
    
    auto [dist3, hasNeg] = bf2.shortestPath(0);
    cout << "Distances from 0: ";
    for (int i = 0; i < 3; i++) {
        cout << dist3[i] << " ";
    }
    cout << endl;
    cout << "Negative cycle: " << (hasNeg ? "Yes" : "No") << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Bellman-Ford algorithm to find shortest paths from source to all vertices.
 * 
 * Time Complexity: O(V * E)
 * Space Complexity: O(V)
 */
public class BellmanFord {
    private int V;
    private List<int[]> edges;  // [u, v, w]
    
    public BellmanFord(int vertices) {
        this.V = vertices;
        this.edges = new ArrayList<>();
    }
    
    // Add directed edge
    public void addEdge(int u, int v, int w) {
        edges.add(new int[]{u, v, w});
    }
    
    /**
     * Find shortest paths from source to all vertices.
     * 
     * @return Map with "distances" (long[]), "hasNegativeCycle" (Boolean)
     */
    public Map<String, Object> shortestPath(int source) {
        final long INF = Long.MAX_VALUE / 4;
        long[] dist = new long[V];
        Arrays.fill(dist, INF);
        dist[source] = 0;
        
        // Relax all edges V-1 times
        for (int i = 0; i < V - 1; i++) {
            for (int[] edge : edges) {
                int u = edge[0], v = edge[1], w = edge[2];
                if (dist[u] != INF && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                }
            }
        }
        
        // Check for negative cycles
        boolean hasNegativeCycle = false;
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], w = edge[2];
            if (dist[u] != INF && dist[u] + w < dist[v]) {
                hasNegativeCycle = true;
                break;
            }
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("distances", dist);
        result.put("hasNegativeCycle", hasNegativeCycle);
        return result;
    }
    
    /**
     * Find shortest paths with path reconstruction.
     */
    public Map<String, Object> shortestPathWithParent(int source) {
        final long INF = Long.MAX_VALUE / 4;
        long[] dist = new long[V];
        int[] parent = new int[V];
        Arrays.fill(dist, INF);
        Arrays.fill(parent, -1);
        dist[source] = 0;
        
        // V-1 relaxations
        for (int i = 0; i < V - 1; i++) {
            for (int[] edge : edges) {
                int u = edge[0], v = edge[1], w = edge[2];
                if (dist[u] != INF && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    parent[v] = u;
                }
            }
        }
        
        // Check for negative cycles
        boolean hasNegativeCycle = false;
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], w = edge[2];
            if (dist[u] != INF && dist[u] + w < dist[v]) {
                hasNegativeCycle = true;
                break;
            }
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("distances", dist);
        result.put("parent", parent);
        result.put("hasNegativeCycle", hasNegativeCycle);
        return result;
    }
    
    // Reconstruct path from source to target
    public List<Integer> reconstructPath(int[] parent, int source, int target) {
        if (parent[target] == -1 && target != source) {
            return Collections.emptyList();
        }
        
        List<Integer> path = new ArrayList<>();
        int current = target;
        while (current != -1) {
            path.add(current);
            current = parent[current];
        }
        
        Collections.reverse(path);
        return path.get(0) == source ? path : Collections.emptyList();
    }
    
    public static void main(String[] args) {
        // Create graph with 5 vertices
        BellmanFord bf = new BellmanFord(5);
        
        // Add edges: (u, v, weight)
        bf.addEdge(0, 1, 4);
        bf.addEdge(0, 2, 2);
        bf.addEdge(1, 2, 3);
        bf.addEdge(1, 3, 2);
        bf.addEdge(2, 3, 5);
        bf.addEdge(1, 4, -3);  // negative weight
        bf.addEdge(3, 4, 4);
        
        int source = 0;
        
        Map<String, Object> result = bf.shortestPath(source);
        long[] dist = (long[]) result.get("distances");
        boolean hasNegCycle = (boolean) result.get("hasNegativeCycle");
        
        System.out.println("Source: " + source);
        System.out.println("Negative cycle detected: " + hasNegCycle);
        System.out.println("Shortest distances:");
        for (int i = 0; i < 5; i++) {
            System.out.println("  Vertex " + i + ": " + dist[i]);
        }
        
        System.out.println("\n" + "=".repeat(50));
        System.out.println("With path reconstruction:");
        
        Map<String, Object> result2 = bf.shortestPathWithParent(source);
        long[] dist2 = (long[]) result2.get("distances");
        int[] parent = (int[]) result2.get("parent");
        
        for (int target = 0; target < 5; target++) {
            List<Integer> path = bf.reconstructPath(parent, source, target);
            if (!path.isEmpty()) {
                System.out.print("Path to " + target + ": ");
                System.out.println(path + " (distance: " + dist2[target] + ")");
            } else {
                System.out.println("No path to " + target);
            }
        }
        
        // Test with negative cycle
        System.out.println("\n" + "=".repeat(50));
        System.out.println("Testing with negative cycle:");
        
        BellmanFord bf2 = new BellmanFord(3);
        bf2.addEdge(0, 1, 2);
        bf2.addEdge(1, 2, -3);
        bf2.addEdge(2, 0, -1);  // Creates negative cycle
        
        Map<String, Object> result3 = bf2.shortestPath(0);
        long[] dist3 = (long[]) result3.get("distances");
        
        System.out.print("Distances from 0: ");
        for (int i = 0; i < 3; i++) {
            System.out.print(dist3[i] + " ");
        }
        System.out.println();
        System.out.println("Negative cycle: " + result3.get("hasNegativeCycle"));
    }
}
```

<!-- slide -->
```javascript
/**
 * Bellman-Ford algorithm to find shortest paths from source to all vertices.
 * 
 * Time Complexity: O(V * E)
 * Space Complexity: O(V)
 */

/**
 * Find shortest paths from source to all vertices.
 * 
 * @param {number} vertices - Number of vertices
 * @param {Array<[number, number, number]>} edges - Array of [u, v, w] tuples
 * @param {number} source - Source vertex
 * @returns {Object} { distances, hasNegativeCycle }
 */
function bellmanFord(vertices, edges, source) {
    const INF = Number.MAX_SAFE_INTEGER;
    
    // Initialize distances
    const dist = new Array(vertices).fill(INF);
    dist[source] = 0;
    
    // Relax all edges V-1 times
    for (let i = 0; i < vertices - 1; i++) {
        for (const [u, v, w] of edges) {
            if (dist[u] !== INF && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    
    // Check for negative cycles
    let hasNegativeCycle = false;
    for (const [u, v, w] of edges) {
        if (dist[u] !== INF && dist[u] + w < dist[v]) {
            hasNegativeCycle = true;
            break;
        }
    }
    
    return { distances: dist, hasNegativeCycle };
}

/**
 * Find shortest paths with path reconstruction.
 * 
 * @returns {Object} { distances, parent, hasNegativeCycle }
 */
function bellmanFordWithPath(vertices, edges, source) {
    const INF = Number.MAX_SAFE_INTEGER;
    
    const dist = new Array(vertices).fill(INF);
    const parent = new Array(vertices).fill(-1);
    dist[source] = 0;
    
    // V-1 relaxations
    for (let i = 0; i < vertices - 1; i++) {
        for (const [u, v, w] of edges) {
            if (dist[u] !== INF && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                parent[v] = u;
            }
        }
    }
    
    // Check for negative cycles
    let hasNegativeCycle = false;
    for (const [u, v, w] of edges) {
        if (dist[u] !== INF && dist[u] + w < dist[v]) {
            hasNegativeCycle = true;
            break;
        }
    }
    
    return { distances: dist, parent, hasNegativeCycle };
}

/**
 * Reconstruct path from source to target using parent array.
 * 
 * @param {number[]} parent - Parent array from Bellman-Ford
 * @param {number} source - Source vertex
 * @param {number} target - Target vertex
 * @returns {number[]} Path as array of vertices, or empty if no path
 */
function reconstructPath(parent, source, target) {
    if (parent[target] === -1 && target !== source) {
        return [];  // No path exists
    }
    
    const path = [];
    let current = target;
    
    while (current !== -1) {
        path.push(current);
        current = parent[current];
    }
    
    path.reverse();
    return path[0] === source ? path : [];
}


// Example usage and demonstration
const vertices = 5;
const edges = [
    [0, 1, 4],
    [0, 2, 2],
    [1, 2, 3],
    [1, 3, 2],
    [2, 3, 5],
    [1, 4, -3],  // negative weight edge
    [3, 4, 4]
];
const source = 0;

const { distances, hasNegativeCycle } = bellmanFord(vertices, edges, source);

console.log(`Source: ${source}`);
console.log(`Negative cycle detected: ${hasNegativeCycle}`);
console.log('Shortest distances:');
distances.forEach((d, i) => {
    console.log(`  Vertex ${i}: ${d === Number.MAX_SAFE_INTEGER ? 'INF (unreachable)' : d}`);
});

console.log('\n' + '='.repeat(50));
console.log('With path reconstruction:');

const { distances: dist2, parent, hasCycle } = bellmanFordWithPath(vertices, edges, source);

for (let target = 0; target < vertices; target++) {
    const path = reconstructPath(parent, source, target);
    if (path.length > 0) {
        console.log(`Path to ${target}: ${path.join(' -> ')} (distance: ${dist2[target]})`);
    } else {
        console.log(`No path to ${target}`);
    }
}

// Test with negative cycle
console.log('\n' + '='.repeat(50));
console.log('Testing with negative cycle:');

const verticesCycle = 3;
const edgesCycle = [
    [0, 1, 2],
    [1, 2, -3],
    [2, 0, -1]  // Creates cycle: 0→1→2→0 with total weight -2
];

const { distances: dist3, hasNegativeCycle: hasNeg } = bellmanFord(verticesCycle, edgesCycle, 0);
console.log(`Distances from 0: ${dist3.join(' ')}`);
console.log(`Negative cycle: ${hasNeg ? 'Yes' : 'No'}`);
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Initialization** | O(V) | Create distance array |
| **Relaxation (V-1 iterations)** | O(V × E) | Each iteration processes all edges |
| **Negative Cycle Check** | O(E) | One final pass through edges |
| **Total** | **O(V × E)** | Dominated by relaxation steps |

### Detailed Breakdown

- **V-1 Iterations**: Each iteration examines all E edges
- **Edge Processing**: For each edge, we perform constant-time comparison and potential update
- **Worst Case**: O(V × E) where V is vertices and E is edges
  - Dense graph: E ≈ V², so O(V³)
  - Sparse graph: E ≈ V, so O(V²)

---

## Space Complexity Analysis

| Data Structure | Space | Description |
|---------------|-------|-------------|
| **Distance Array** | O(V) | Store shortest distances |
| **Parent Array (optional)** | O(V) | For path reconstruction |
| **Edge List** | O(E) | Input storage |
| **Total** | **O(V + E)** | Can be reduced to O(V) if edges processed from input |

### Space Optimization

For memory-constrained environments:
1. **Process edges on-the-fly**: Don't store all edges if possible
2. **Single-pass relaxation**: Some variants can optimize memory usage
3. **Use adjacency list**: Instead of edge list, process from adjacency representation

---

## Common Variations

### 1. Shortest Path with Path Reconstruction

Track parent pointers during relaxation to reconstruct actual paths.

**Implementation Note:** See the main implementation section above for `bellman_ford_with_path()` and `reconstruct_path()` functions in all four languages.

### 2. Finding Negative Cycle Vertices

Identify which vertices are affected by the negative cycle.

````carousel
```python
def find_negative_cycle_vertices(vertices, edges, source):
    """Find vertices affected by negative cycle."""
    dist = [float('inf')] * vertices
    parent = [-1] * vertices
    dist[source] = 0
    
    # V relaxations
    for _ in range(vertices):
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                parent[v] = u
    
    # Find vertices on negative cycle
    in_cycle = [False] * vertices
    for v in range(vertices):
        if parent[v] != -1:
            # Trace back to find cycle
            current = v
            for _ in range(vertices):
                current = parent[current]
                if current == -1:
                    break
            if current != -1:
                in_cycle[current] = True
    
    return [i for i, x in enumerate(in_cycle) if x]


# Example usage
if __name__ == "__main__":
    vertices = 4
    edges = [
        (0, 1, 1),
        (1, 2, -1),
        (2, 3, -1),
        (3, 1, -1)  # Negative cycle: 1 -> 2 -> 3 -> 1
    ]
    cycle_vertices = find_negative_cycle_vertices(vertices, edges, 0)
    print(f"Vertices in negative cycle: {cycle_vertices}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <tuple>
using namespace std;

vector<int> findNegativeCycleVertices(int vertices, vector<tuple<int,int,int>>& edges, int source) {
    const long long INF = LLONG_MAX / 4;
    vector<long long> dist(vertices, INF);
    vector<int> parent(vertices, -1);
    dist[source] = 0;
    
    // V relaxations
    for (int i = 0; i < vertices; i++) {
        for (const auto& [u, v, w] : edges) {
            if (dist[u] != INF && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                parent[v] = u;
            }
        }
    }
    
    // Find vertices on negative cycle
    vector<bool> inCycle(vertices, false);
    for (int v = 0; v < vertices; v++) {
        if (parent[v] != -1) {
            int current = v;
            for (int i = 0; i < vertices; i++) {
                current = parent[current];
                if (current == -1) break;
            }
            if (current != -1) {
                inCycle[current] = true;
            }
        }
    }
    
    vector<int> result;
    for (int i = 0; i < vertices; i++) {
        if (inCycle[i]) result.push_back(i);
    }
    return result;
}

int main() {
    int vertices = 4;
    vector<tuple<int,int,int>> edges = {
        {0, 1, 1},
        {1, 2, -1},
        {2, 3, -1},
        {3, 1, -1}  // Negative cycle: 1 -> 2 -> 3 -> 1
    };
    
    vector<int> cycleVertices = findNegativeCycleVertices(vertices, edges, 0);
    cout << "Vertices in negative cycle: ";
    for (int v : cycleVertices) cout << v << " ";
    cout << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

public class NegativeCycleFinder {
    public static List<Integer> findNegativeCycleVertices(int vertices, int[][] edges, int source) {
        final long INF = Long.MAX_VALUE / 4;
        long[] dist = new long[vertices];
        int[] parent = new int[vertices];
        Arrays.fill(dist, INF);
        Arrays.fill(parent, -1);
        dist[source] = 0;
        
        // V relaxations
        for (int i = 0; i < vertices; i++) {
            for (int[] edge : edges) {
                int u = edge[0], v = edge[1], w = edge[2];
                if (dist[u] != INF && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    parent[v] = u;
                }
            }
        }
        
        // Find vertices on negative cycle
        boolean[] inCycle = new boolean[vertices];
        for (int v = 0; v < vertices; v++) {
            if (parent[v] != -1) {
                int current = v;
                for (int i = 0; i < vertices; i++) {
                    current = parent[current];
                    if (current == -1) break;
                }
                if (current != -1) {
                    inCycle[current] = true;
                }
            }
        }
        
        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < vertices; i++) {
            if (inCycle[i]) result.add(i);
        }
        return result;
    }
    
    public static void main(String[] args) {
        int vertices = 4;
        int[][] edges = {
            {0, 1, 1},
            {1, 2, -1},
            {2, 3, -1},
            {3, 1, -1}  // Negative cycle: 1 -> 2 -> 3 -> 1
        };
        
        List<Integer> cycleVertices = findNegativeCycleVertices(vertices, edges, 0);
        System.out.println("Vertices in negative cycle: " + cycleVertices);
    }
}
```

<!-- slide -->
```javascript
function findNegativeCycleVertices(vertices, edges, source) {
    const INF = Number.MAX_SAFE_INTEGER;
    const dist = new Array(vertices).fill(INF);
    const parent = new Array(vertices).fill(-1);
    dist[source] = 0;
    
    // V relaxations
    for (let i = 0; i < vertices; i++) {
        for (const [u, v, w] of edges) {
            if (dist[u] !== INF && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
                parent[v] = u;
            }
        }
    }
    
    // Find vertices on negative cycle
    const inCycle = new Array(vertices).fill(false);
    for (let v = 0; v < vertices; v++) {
        if (parent[v] !== -1) {
            let current = v;
            for (let i = 0; i < vertices; i++) {
                current = parent[current];
                if (current === -1) break;
            }
            if (current !== -1) {
                inCycle[current] = true;
            }
        }
    }
    
    return inCycle.map((x, i) => x ? i : -1).filter(x => x !== -1);
}

// Example usage
const vertices = 4;
const edges = [
    [0, 1, 1],
    [1, 2, -1],
    [2, 3, -1],
    [3, 1, -1]  // Negative cycle: 1 -> 2 -> 3 -> 1
];

const cycleVertices = findNegativeCycleVertices(vertices, edges, 0);
console.log("Vertices in negative cycle:", cycleVertices);
```
````

### 3. SPFA (Shortest Path Faster Algorithm)

An optimization that uses a queue to only process vertices that were actually updated. Often faster in practice for sparse graphs.

````carousel
```python
from collections import deque
from typing import List, Tuple, Optional

def spfa(vertices: int, edges: List[Tuple[int, int, int]], source: int) -> Tuple[List[Optional[int]], bool]:
    """
    SPFA - Shortest Path Faster Algorithm.
    Often faster than standard Bellman-Ford for sparse graphs.
    
    Args:
        vertices: Number of vertices
        edges: List of (u, v, w) tuples
        source: Source vertex
    
    Returns:
        Tuple of (distances, has_negative_cycle)
    """
    dist = [float('inf')] * vertices
    in_queue = [False] * vertices
    count = [0] * vertices  # Relaxation count for negative cycle detection
    dist[source] = 0
    
    # Build adjacency list
    adj = [[] for _ in range(vertices)]
    for u, v, w in edges:
        adj[u].append((v, w))
    
    queue = deque([source])
    in_queue[source] = True
    
    while queue:
        u = queue.popleft()
        in_queue[u] = False
        
        for v, w in adj[u]:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                count[v] = count[u] + 1
                
                # Negative cycle detection
                if count[v] >= vertices:
                    return dist, True
                
                if not in_queue[v]:
                    queue.append(v)
                    in_queue[v] = True
    
    dist = [None if d == float('inf') else d for d in dist]
    return dist, False


# Example usage
if __name__ == "__main__":
    vertices = 5
    edges = [
        (0, 1, 4),
        (0, 2, 2),
        (1, 2, 3),
        (1, 3, 2),
        (2, 3, 5),
        (1, 4, -3),
        (3, 4, 4)
    ]
    
    distances, has_neg = spfa(vertices, edges, 0)
    print("SPFA Results:")
    print(f"Negative cycle: {has_neg}")
    print("Distances:", distances)
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <tuple>
using namespace std;

class SPFA {
private:
    int V;
    vector<vector<pair<int,int>>> adj;  // adjacency list: (neighbor, weight)
    
public:
    SPFA(int vertices) : V(vertices) {
        adj.resize(V);
    }
    
    void addEdge(int u, int v, int w) {
        adj[u].push_back({v, w});
    }
    
    pair<vector<long long>, bool> shortestPath(int source) {
        const long long INF = LLONG_MAX / 4;
        vector<long long> dist(V, INF);
        vector<bool> inQueue(V, false);
        vector<int> count(V, 0);  // Relaxation count
        
        dist[source] = 0;
        queue<int> q;
        q.push(source);
        inQueue[source] = true;
        
        while (!q.empty()) {
            int u = q.front();
            q.pop();
            inQueue[u] = false;
            
            for (const auto& [v, w] : adj[u]) {
                if (dist[u] != INF && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    count[v] = count[u] + 1;
                    
                    // Negative cycle detection
                    if (count[v] >= V) {
                        return {dist, true};
                    }
                    
                    if (!inQueue[v]) {
                        q.push(v);
                        inQueue[v] = true;
                    }
                }
            }
        }
        
        return {dist, false};
    }
};

int main() {
    SPFA spfa(5);
    spfa.addEdge(0, 1, 4);
    spfa.addEdge(0, 2, 2);
    spfa.addEdge(1, 2, 3);
    spfa.addEdge(1, 3, 2);
    spfa.addEdge(2, 3, 5);
    spfa.addEdge(1, 4, -3);
    spfa.addEdge(3, 4, 4);
    
    auto [dist, hasNeg] = spfa.shortestPath(0);
    
    cout << "SPFA Results:" << endl;
    cout << "Negative cycle: " << (hasNeg ? "Yes" : "No") << endl;
    cout << "Distances: ";
    for (long long d : dist) {
        if (d == LLONG_MAX / 4) cout << "INF ";
        else cout << d << " ";
    }
    cout << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

public class SPFA {
    private int V;
    private List<int[]>[] adj;
    
    public SPFA(int vertices) {
        this.V = vertices;
        this.adj = new ArrayList[V];
        for (int i = 0; i < V; i++) {
            adj[i] = new ArrayList<>();
        }
    }
    
    public void addEdge(int u, int v, int w) {
        adj[u].add(new int[]{v, w});
    }
    
    public Map<String, Object> shortestPath(int source) {
        final long INF = Long.MAX_VALUE / 4;
        long[] dist = new long[V];
        boolean[] inQueue = new boolean[V];
        int[] count = new int[V];
        Arrays.fill(dist, INF);
        
        dist[source] = 0;
        Queue<Integer> queue = new LinkedList<>();
        queue.offer(source);
        inQueue[source] = true;
        
        while (!queue.isEmpty()) {
            int u = queue.poll();
            inQueue[u] = false;
            
            for (int[] edge : adj[u]) {
                int v = edge[0], w = edge[1];
                if (dist[u] != INF && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    count[v] = count[u] + 1;
                    
                    // Negative cycle detection
                    if (count[v] >= V) {
                        Map<String, Object> result = new HashMap<>();
                        result.put("distances", dist);
                        result.put("hasNegativeCycle", true);
                        return result;
                    }
                    
                    if (!inQueue[v]) {
                        queue.offer(v);
                        inQueue[v] = true;
                    }
                }
            }
        }
        
        Map<String, Object> result = new HashMap<>();
        result.put("distances", dist);
        result.put("hasNegativeCycle", false);
        return result;
    }
    
    public static void main(String[] args) {
        SPFA spfa = new SPFA(5);
        spfa.addEdge(0, 1, 4);
        spfa.addEdge(0, 2, 2);
        spfa.addEdge(1, 2, 3);
        spfa.addEdge(1, 3, 2);
        spfa.addEdge(2, 3, 5);
        spfa.addEdge(1, 4, -3);
        spfa.addEdge(3, 4, 4);
        
        Map<String, Object> result = spfa.shortestPath(0);
        long[] dist = (long[]) result.get("distances");
        boolean hasNeg = (boolean) result.get("hasNegativeCycle");
        
        System.out.println("SPFA Results:");
        System.out.println("Negative cycle: " + hasNeg);
        System.out.print("Distances: ");
        for (long d : dist) {
            System.out.print(d + " ");
        }
        System.out.println();
    }
}
```

<!-- slide -->
```javascript
class SPFA {
    constructor(vertices) {
        this.V = vertices;
        this.adj = Array.from({ length: vertices }, () => []);
    }
    
    addEdge(u, v, w) {
        this.adj[u].push([v, w]);
    }
    
    shortestPath(source) {
        const INF = Number.MAX_SAFE_INTEGER;
        const dist = new Array(this.V).fill(INF);
        const inQueue = new Array(this.V).fill(false);
        const count = new Array(this.V).fill(0);
        
        dist[source] = 0;
        const queue = [source];
        inQueue[source] = true;
        
        while (queue.length > 0) {
            const u = queue.shift();
            inQueue[u] = false;
            
            for (const [v, w] of this.adj[u]) {
                if (dist[u] !== INF && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                    count[v] = count[u] + 1;
                    
                    // Negative cycle detection
                    if (count[v] >= this.V) {
                        return { distances: dist, hasNegativeCycle: true };
                    }
                    
                    if (!inQueue[v]) {
                        queue.push(v);
                        inQueue[v] = true;
                    }
                }
            }
        }
        
        return { distances: dist, hasNegativeCycle: false };
    }
}

// Example usage
const spfa = new SPFA(5);
spfa.addEdge(0, 1, 4);
spfa.addEdge(0, 2, 2);
spfa.addEdge(1, 2, 3);
spfa.addEdge(1, 3, 2);
spfa.addEdge(2, 3, 5);
spfa.addEdge(1, 4, -3);
spfa.addEdge(3, 4, 4);

const result = spfa.shortestPath(0);
console.log("SPFA Results:");
console.log("Negative cycle:", result.hasNegativeCycle);
console.log("Distances:", result.distances.map(d => 
    d === Number.MAX_SAFE_INTEGER ? 'INF' : d
));
```
````

### 4. Bellman-Ford for Distributed Systems

Used in distance-vector routing protocols like RIP (Routing Information Protocol).

**Concept:** Each node maintains a distance vector table and periodically exchanges routing information with neighbors. The algorithm converges to the shortest paths without requiring global knowledge of the network topology.

### 5. Currency Arbitrage Detection

Model currencies as vertices, exchange rates as edge weights (negative log of rate), and look for negative cycles.

````carousel
```python
import math
from typing import List, Tuple

def detect_arbitrage(currencies: List[str], rates: List[Tuple[int, int, float]]) -> bool:
    """
    Detect currency arbitrage opportunity.
    
    Args:
        currencies: List of currency names
        rates: List of (i, j, rate) where rate is exchange rate from currency i to j
    
    Returns:
        True if arbitrage opportunity exists
    """
    n = len(currencies)
    # Convert rates to weights: weight = -log(rate)
    # Arbitrage exists if we can find a cycle with product > 1
    # Which means sum of -log(rate) < 0 (negative cycle)
    edges = []
    for i, j, rate in rates:
        weight = -math.log(rate)
        edges.append((i, j, weight))
    
    # Bellman-Ford to detect negative cycle
    dist = [float('inf')] * n
    dist[0] = 0
    
    # Relax V-1 times
    for _ in range(n - 1):
        for u, v, w in edges:
            if dist[u] != float('inf') and dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
    
    # Check for negative cycle
    for u, v, w in edges:
        if dist[u] != float('inf') and dist[u] + w < dist[v]:
            return True  # Arbitrage exists!
    
    return False


# Example: Currency arbitrage
if __name__ == "__main__":
    currencies = ["USD", "EUR", "GBP", "JPY"]
    # Exchange rates (from, to, rate)
    rates = [
        (0, 1, 0.85),   # USD -> EUR: 1 USD = 0.85 EUR
        (1, 2, 0.88),   # EUR -> GBP: 1 EUR = 0.88 GBP
        (2, 0, 1.42),   # GBP -> USD: 1 GBP = 1.42 USD
        # Cycle: USD -> EUR -> GBP -> USD
        # Product: 0.85 * 0.88 * 1.42 = 1.062 > 1 (arbitrage!)
    ]
    
    has_arbitrage = detect_arbitrage(currencies, rates)
    print(f"Arbitrage opportunity detected: {has_arbitrage}")
    
    # Calculate profit
    if has_arbitrage:
        profit = 0.85 * 0.88 * 1.42
        print(f"Profit multiplier: {profit:.4f} ({(profit-1)*100:.2f}% gain)")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <cmath>
using namespace std;

bool detectArbitrage(int n, vector<tuple<int,int,double>>& rates) {
    const double INF = 1e18;
    vector<double> dist(n, INF);
    dist[0] = 0;
    
    // Convert rates to weights: weight = -log(rate)
    vector<tuple<int,int,double>> edges;
    for (const auto& [i, j, rate] : rates) {
        double weight = -log(rate);
        edges.push_back({i, j, weight});
    }
    
    // Relax V-1 times
    for (int i = 0; i < n - 1; i++) {
        for (const auto& [u, v, w] : edges) {
            if (dist[u] != INF && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    
    // Check for negative cycle
    for (const auto& [u, v, w] : edges) {
        if (dist[u] != INF && dist[u] + w < dist[v]) {
            return true;  // Arbitrage exists!
        }
    }
    
    return false;
}

int main() {
    vector<string> currencies = {"USD", "EUR", "GBP", "JPY"};
    vector<tuple<int,int,double>> rates = {
        {0, 1, 0.85},   // USD -> EUR
        {1, 2, 0.88},   // EUR -> GBP
        {2, 0, 1.42}    // GBP -> USD
    };
    
    bool hasArbitrage = detectArbitrage(currencies.size(), rates);
    cout << "Arbitrage opportunity detected: " << (hasArbitrage ? "Yes" : "No") << endl;
    
    if (hasArbitrage) {
        double profit = 0.85 * 0.88 * 1.42;
        cout << "Profit multiplier: " << profit << " (" << (profit-1)*100 << "% gain)" << endl;
    }
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

public class ArbitrageDetector {
    public static boolean detectArbitrage(int n, double[][] rates) {
        final double INF = 1e18;
        double[] dist = new double[n];
        Arrays.fill(dist, INF);
        dist[0] = 0;
        
        // Build edges with weights = -log(rate)
        List<double[]> edges = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {
                if (rates[i][j] > 0) {
                    edges.add(new double[]{i, j, -Math.log(rates[i][j])});
                }
            }
        }
        
        // Relax V-1 times
        for (int i = 0; i < n - 1; i++) {
            for (double[] edge : edges) {
                int u = (int) edge[0];
                int v = (int) edge[1];
                double w = edge[2];
                if (dist[u] != INF && dist[u] + w < dist[v]) {
                    dist[v] = dist[u] + w;
                }
            }
        }
        
        // Check for negative cycle
        for (double[] edge : edges) {
            int u = (int) edge[0];
            int v = (int) edge[1];
            double w = edge[2];
            if (dist[u] != INF && dist[u] + w < dist[v]) {
                return true;  // Arbitrage exists!
            }
        }
        
        return false;
    }
    
    public static void main(String[] args) {
        int n = 3;
        double[][] rates = new double[n][n];
        // Initialize with 0
        for (int i = 0; i < n; i++) {
            Arrays.fill(rates[i], 0);
        }
        rates[0][1] = 0.85;  // USD -> EUR
        rates[1][2] = 0.88;  // EUR -> GBP
        rates[2][0] = 1.42;  // GBP -> USD
        
        boolean hasArbitrage = detectArbitrage(n, rates);
        System.out.println("Arbitrage opportunity detected: " + hasArbitrage);
        
        if (hasArbitrage) {
            double profit = 0.85 * 0.88 * 1.42;
            System.out.printf("Profit multiplier: %.4f (%.2f%% gain)%n", profit, (profit-1)*100);
        }
    }
}
```

<!-- slide -->
```javascript
function detectArbitrage(n, rates) {
    const INF = 1e18;
    const dist = new Array(n).fill(INF);
    dist[0] = 0;
    
    // Build edges with weights = -log(rate)
    const edges = [];
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (rates[i][j] > 0) {
                edges.push([i, j, -Math.log(rates[i][j])]);
            }
        }
    }
    
    // Relax V-1 times
    for (let i = 0; i < n - 1; i++) {
        for (const [u, v, w] of edges) {
            if (dist[u] !== INF && dist[u] + w < dist[v]) {
                dist[v] = dist[u] + w;
            }
        }
    }
    
    // Check for negative cycle
    for (const [u, v, w] of edges) {
        if (dist[u] !== INF && dist[u] + w < dist[v]) {
            return true;  // Arbitrage exists!
        }
    }
    
    return false;
}

// Example usage
const n = 3;
const rates = Array.from({ length: n }, () => new Array(n).fill(0));
rates[0][1] = 0.85;  // USD -> EUR
rates[1][2] = 0.88;  // EUR -> GBP
rates[2][0] = 1.42;  // GBP -> USD

const hasArbitrage = detectArbitrage(n, rates);
console.log("Arbitrage opportunity detected:", hasArbitrage);

if (hasArbitrage) {
    const profit = 0.85 * 0.88 * 1.42;
    console.log(`Profit multiplier: ${profit.toFixed(4)} (${((profit-1)*100).toFixed(2)}% gain)`);
}
```
````

---

## Practice Problems

### Problem 1: Network Delay Time

**Problem:** [LeetCode 743 - Network Delay Time](https://leetcode.com/problems/network-delay-time/)

**Description:** Given a network of n nodes labeled 1 to n, and a list of directed edges (u, v, w) representing a signal traveling from u to v taking w time, find the minimum time for the signal to reach all nodes.

**How to Apply Bellman-Ford:**
- Use Bellman-Ford starting from node k (the source)
- The answer is the maximum distance to any reachable node
- If any node is unreachable, return -1

---

### Problem 2: Cheapest Flights Within K Stops

**Problem:** [LeetCode 787 - Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/)

**Description:** There are n cities connected by flights. Each flight has a price. Find the cheapest price from src to dst with at most k stops.

**How to Apply Bellman-Ford:**
- Run Bellman-Ford for exactly k+1 iterations (k stops = k+1 edges)
- This is a constrained version of Bellman-Ford
- Track prices at each iteration

---

### Problem 3: Find the City With the Smallest Number of Neighbors at a Threshold Distance

**Problem:** [LeetCode 1334 - Find the City With the Smallest Number of Neighbors at a Threshold Distance](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/)

**Description:** There are n cities numbered from 0 to n-1. Given the array edges where edges[i] = [fromi, toi, weighti] represents a bidirectional and weighted edge between cities fromi and toi, find the city with the smallest number of cities that are reachable through some path and whose distance is at most distanceThreshold.

**How to Apply Bellman-Ford:**
- Run Bellman-Ford from each city as source (or use Floyd-Warshall for all-pairs)
- Count reachable cities within the threshold distance for each source
- Return the city with the smallest such count

---

### Problem 4: Frog Position After T Seconds

**Problem:** [LeetCode 1377 - Frog Position After T Seconds](https://leetcode.com/problems/frog-position-after-t-seconds/)

**Description:** Given a tree graph where a frog starts at vertex 1, moves to unvisited neighbors with equal probability. Find probability that frog is at vertex target after exactly t seconds.

**How to Apply Bellman-Ford:**
- This can be modeled as a shortest path variant
- Use DP with Bellman-Ford style updates to track probabilities

---

### Problem 5: Minimum Cost to Convert String I

**Problem:** [LeetCode 2976 - Minimum Cost to Convert String I](https://leetcode.com/problems/minimum-cost-to-convert-string-i/)

**Description:** You are given two 0-indexed strings source and target, both of length n and consisting of lowercase English letters. You are also given two 0-indexed character arrays original and changed, and an integer array cost, where cost[i] represents the cost of changing character original[i] to character changed[i]. Return the minimum cost to convert the string source to the string target using any number of operations. If it's impossible, return -1.

**How to Apply Bellman-Ford:**
- Model this as a graph where characters are nodes and conversions are edges with costs
- Use Bellman-Ford (or Floyd-Warshall) to find shortest paths between all character pairs
- This gives the minimum cost to convert any character to any other character
- Then apply these costs to transform source to target character by character

---

## Video Tutorial Links

### Fundamentals

- [Bellman-Ford Algorithm - Introduction (Take U Forward)](https://www.youtube.com/watch?v=9PHkk0UavIM) - Comprehensive introduction
- [Bellman-Ford Algorithm (WilliamFiset)](https://www.youtube.com/watch?v=FtN3BYH2Zes) - Detailed explanation with visualizations
- [Bellman-Ford Algorithm (NeetCode)](https://www.youtube.com/watch?v=9P6nOkT4L7U) - Practical implementation guide

### Negative Cycles

- [Detecting Negative Cycles](https://www.youtube.com/watch?v=42KhN60j5Vo) - How negative cycle detection works
- [Bellman-Ford vs Dijkstra](https://www.youtube.com/watch?v=bo3Wqbq3y5A) - Comparison and when to use which

### Applications

- [SPFA Algorithm](https://www.youtube.com/watch?v=AmzG9W4jWV0) - Shortest Path Faster Algorithm
- [Currency Arbitrage with Bellman-Ford](https://www.youtube.com/watch?v=4OQeKHY-j5Q) - Real-world application

---

## Follow-up Questions

### Q1: What happens if the graph has negative cycles?

**Answer:** If a negative cycle exists, Bellman-Ford will detect it by finding an edge that can still be relaxed after V-1 iterations. In this case:
- Shortest paths are undefined (can be arbitrarily small)
- The algorithm returns a flag indicating negative cycle existence
- For some problems, you may want to identify the affected vertices

### Q2: Can Bellman-Ford handle undirected graphs?

**Answer:** Yes, but you need to add each undirected edge as two directed edges. For an undirected edge between u and v with weight w, add both (u, v, w) and (v, u, w). Note: If there's a negative weight edge in an undirected graph, make sure there isn't a 2-edge cycle that could cause issues.

### Q3: How does Bellman-Ford compare to Dijkstra in practice?

**Answer:**
- **Time**: Dijkstra is typically O((V+E) log V), faster than Bellman-Ford's O(V×E)
- **Weight Constraints**: Bellman-Ford handles negative weights; Dijkstra doesn't
- **Negative Cycles**: Bellman-Ford can detect them; Dijkstra cannot
- **Use Case**: Use Dijkstra for positive-weight graphs; Bellman-Ford when negatives possible

### Q4: What is SPFA and when should I use it?

**Answer:** SPFA (Shortest Path Faster Algorithm) is an optimization of Bellman-Ford:
- Uses a queue to process only vertices that were updated
- Average case: O(E) for many practical graphs
- Worst case: Still O(V×E) but rarely occurs
- Use SPFA when you expect sparse updates or need better average performance

### Q5: Can Bellman-Ford be parallelized?

**Answer:** Yes! The relaxation of different edges can be done in parallel since they don't depend on each other within the same iteration. However:
- You still need V-1 sequential iterations
- Parallel speedup is limited but possible on GPU or multi-core systems
- For most practical cases, the overhead isn't worth it

---

## Summary

The Bellman-Ford algorithm is an essential tool for solving shortest path problems in graphs with **negative edge weights** and for **negative cycle detection**. Key takeaways:

- **Handles Negative Weights**: Unlike Dijkstra, works correctly with negative edge weights
- **Negative Cycle Detection**: Can detect cycles with negative total weight
- **Time Complexity**: O(V × E) - slower than Dijkstra but more versatile
- **V-1 Iterations**: Guarantees finding shortest paths in graphs without negative cycles

When to use:
- ✅ Graphs with negative edge weights
- ✅ When negative cycle detection is needed
- ✅ When unsure if all weights are non-negative
- ❌ For large graphs with only positive weights (use Dijkstra instead)
- ❌ For all-pairs shortest path (use Floyd-Warshall)

This algorithm is fundamental in networking (routing protocols), finance (arbitrage detection), and various optimization problems. Master it to handle edge cases where simpler algorithms fail.

---

## Related Algorithms

- [Dijkstra's Algorithm](./dijkstras.md) - Faster for non-negative weights
- [Floyd-Warshall](./floyd-warshall.md) - All-pairs shortest path
- [SPFA](./spfa.md) - Optimized Bellman-Ford variant
- [Graph BFS](./graph-bfs.md) - Unweighted shortest path
