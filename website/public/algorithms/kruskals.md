# Kruskal's Algorithm

## Category
Graphs

## Description
Kruskal's Algorithm finds the Minimum Spanning Tree (MST) of a weighted undirected graph using a greedy approach. It sorts edges by weight and uses Union-Find (Disjoint Set Union) to avoid cycles, making it efficient for sparse graphs.

---

## When to Use

Use Kruskal's Algorithm when you need to solve problems involving:

- **Minimum Spanning Tree (MST)**: Finding the minimum weight tree that connects all vertices
- **Network Design**: Designing cost-effective networks (roads, cables, flights)
- **Clustering**: Grouping related elements with minimum connection cost
- **Cycle Detection**: Efficiently detecting cycles while building trees
- **Greedy Optimization**: Problems where locally optimal choices lead to global optimum

### Comparison with Alternatives

| Algorithm | Time Complexity | Best For | Limitations |
|-----------|----------------|----------|-------------|
| **Kruskal's** | O(E log E) | Sparse graphs, few edges | Requires sorting, extra memory for DSU |
| **Prim's** | O(E + V log V) | Dense graphs | Needs adjacency list/matrix |
| **Borůvka's** | O(E log V) | Very large graphs, parallel | More complex implementation |

### When to Choose Kruskal's vs Prim's

- **Choose Kruskal's** when:
  - Graph is sparse (E ≈ V)
  - Edges are already given or easy to sort
  - You need to find MST weight only
  - Implementation simplicity matters

- **Choose Prim's** when:
  - Graph is dense (E ≈ V²)
  - Graph is given as adjacency matrix
  - You need to track the actual MST edges during construction

---

## Algorithm Explanation

### Core Concept

Kruskal's Algorithm is a greedy algorithm that builds the Minimum Spanning Tree by iteratively adding the cheapest edge that doesn't create a cycle. The key insight is that the **Cut Property** guarantees the greedy approach works: for any partition of vertices, the minimum weight edge crossing that cut belongs to some MST.

### How It Works

1. **Sort Edges**: Arrange all edges in non-decreasing order by weight
2. **Initialize DSU**: Create a Union-Find structure where each vertex is its own component
3. **Iterate Through Edges**: For each edge (u, v) in sorted order:
   - If u and v are in different components, unite them and add edge to MST
   - If they're already connected, skip this edge (it would create a cycle)
4. **Stop Condition**: Continue until MST has V-1 edges (or all edges processed)

### Union-Find (Disjoint Set Union) Operations

The Union-Find data structure provides two critical operations:

- **`find(x)`**: Returns the root/representative of the set containing x
  - Uses **path compression** for nearly O(1) amortized time
  
- **`union(x, y)`**: Merges the sets containing x and y
  - Uses **union by rank** to keep trees balanced
  - Returns true if merge happened, false if already in same set

### Why Greedy Works (Cut Property Proof)

The correctness of Kruskal's algorithm relies on the **Cut Property**:

> For any cut (partition) of the graph's vertices, the minimum weight edge crossing that cut belongs to at least one Minimum Spanning Tree.

**Proof sketch**: Suppose we have an MST T. Consider any cut. If the minimum edge crossing the cut is not in T, add it to T - this creates a cycle. Remove the heaviest edge in that cycle crossing the same cut - the result is still a spanning tree with no greater weight. Thus, the minimum edge can be in an MST.

### Visual Representation

For a graph with vertices {0, 1, 2, 3} and edges:
```
Edges sorted by weight:
(1, 0-1), (2, 1-2), (3, 0-2), (4, 2-3)

Step 1: Start with 4 isolated vertices
        0    1    2    3

Step 2: Add edge (0-1) weight 1
        0--1   2    3

Step 3: Add edge (1-2) weight 2
        0--1--2   3

Step 4: Skip edge (0-2) weight 3 (would create cycle!)

Step 5: Add edge (2-3) weight 4
        0--1--2--3
        
MST Weight: 1 + 2 + 4 = 7
```

### Limitations

- **Only works for undirected graphs**: Directed MST requires different algorithms
- **Requires connected graph**: Returns error or special value for disconnected graphs
- **Edge sorting overhead**: O(E log E) dominates for very dense graphs
- **Memory for Union-Find**: Requires O(V) additional space

---

## Algorithm Steps

### Step-by-Step Approach

1. **Parse Input**: Understand the graph representation (edges list, vertices count)
   - Identify if edges are given as tuples (weight, u, v) or (u, v, weight)
   - Note the vertex numbering (0-based or 1-based)

2. **Sort Edges**: Sort all edges by weight in ascending order
   - Time complexity: O(E log E)
   - Can optimize to O(E log V) by using bucket sort or counting sort for integer weights

3. **Initialize Union-Find**: Create DSU with n vertices
   - Each vertex starts as its own parent
   - Rank/size arrays start at 0

4. **Process Edges**: Iterate through sorted edges
   - For each edge (weight, u, v):
     - Call `find(u)` and `find(v)`
     - If different, call `union(u, v)` and add weight to result
     - If same, skip (cycle would form)

5. **Check Completeness**: Verify MST has exactly V-1 edges
   - If less, graph is disconnected (return -1 or special value)

6. **Return Result**: Return total MST weight or edge list

---

## Implementation

````carousel
```python
from typing import List, Tuple, Optional


class UnionFind:
    """
    Union-Find (Disjoint Set Union) data structure with path compression
    and union by rank for near O(1) amortized operations.
    
    Time Complexity:
        - find: O(α(n)) ≈ O(1) amortized
        - union: O(α(n)) ≈ O(1) amortized
        - α(n) is the inverse Ackermann function
    
    Space Complexity: O(n)
    """
    
    def __init__(self, n: int):
        """Initialize n separate sets."""
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x: int) -> int:
        """
        Find root of the set containing x with path compression.
        
        Path compression flattens the tree by making every node
        on the find path point directly to the root.
        """
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Recursive compression
        return self.parent[x]
    
    def union(self, x: int, y: int) -> bool:
        """
        Unite the sets containing x and y using union by rank.
        
        Returns:
            True if sets were merged, False if already in same set
            
        Time: O(α(n)) ≈ O(1) amortized
        """
        root_x, root_y = self.find(x), self.find(y)
        
        if root_x == root_y:
            return False  # Already in same set
        
        # Union by rank: attach smaller tree under larger tree
        if self.rank[root_x] < self.rank[root_y]:
            root_x, root_y = root_y, root_x
        self.parent[root_y] = root_x
        
        if self.rank[root_x] == self.rank[root_y]:
            self.rank[root_x] += 1
        
        return True
    
    def connected(self, x: int, y: int) -> bool:
        """Check if x and y are in the same set."""
        return self.find(x) == self.find(y)


def kruskal_mst_weight(n: int, edges: List[Tuple[int, int, int]]) -> int:
    """
    Find the total weight of Minimum Spanning Tree using Kruskal's algorithm.
    
    Args:
        n: Number of vertices (labeled 0 to n-1)
        edges: List of tuples (weight, u, v) representing undirected edge
        
    Returns:
        Total weight of MST, or -1 if graph is disconnected
        
    Time Complexity: O(E log E) due to sorting
    Space Complexity: O(V) for Union-Find
    """
    if n <= 0:
        return 0
    
    # Sort edges by weight (ascending)
    edges.sort(key=lambda x: x[0])
    
    uf = UnionFind(n)
    mst_weight = 0
    edges_used = 0
    
    for weight, u, v in edges:
        if uf.union(u, v):
            mst_weight += weight
            edges_used += 1
            
            # MST is complete when we have V-1 edges
            if edges_used == n - 1:
                break
    
    # Check if we got a valid spanning tree
    if edges_used != n - 1:
        return -1  # Graph is disconnected
    
    return mst_weight


def kruskal_mst_edges(n: int, edges: List[Tuple[int, int, int]]) -> Optional[List[Tuple[int, int, int]]]:
    """
    Find the edges in Minimum Spanning Tree using Kruskal's algorithm.
    
    Args:
        n: Number of vertices (labeled 0 to n-1)
        edges: List of tuples (weight, u, v)
        
    Returns:
        List of edges (u, v, weight) in MST, or None if disconnected
    """
    if n <= 0:
        return []
    
    edges.sort(key=lambda x: x[0])
    
    uf = UnionFind(n)
    mst_edges = []
    
    for weight, u, v in edges:
        if uf.union(u, v):
            mst_edges.append((u, v, weight))
            if len(mst_edges) == n - 1:
                break
    
    return mst_edges if len(mst_edges) == n - 1 else None


# Example usage and demonstration
if __name__ == "__main__":
    # Example 1: Basic graph
    n = 4
    edges = [
        (1, 0, 1),   # weight 1, edge 0-1
        (3, 0, 2),   # weight 3, edge 0-2
        (2, 1, 2),   # weight 2, edge 1-2
        (4, 2, 3),   # weight 4, edge 2-3
    ]
    
    print(f"Example 1: n={n}, edges={edges}")
    print(f"MST Weight: {kruskal_mst_weight(n, edges)}")
    print(f"MST Edges: {kruskal_mst_edges(n, edges)}")
    print()
    
    # Example 2: Another graph
    n2 = 3
    edges2 = [
        (1, 0, 1),
        (2, 1, 2),
        (3, 0, 2),
    ]
    
    print(f"Example 2: n={n2}, edges={edges2}")
    print(f"MST Weight: {kruskal_mst_weight(n2, edges2)}")
    print(f"MST Edges: {kruskal_mst_edges(n2, edges2)}")
    print()
    
    # Example 3: Disconnected graph
    n3 = 4
    edges3 = [
        (1, 0, 1),
        (2, 2, 3),
        # No edge connecting {0,1} to {2,3}
    ]
    
    print(f"Example 3 (Disconnected): n={n3}, edges={edges3}")
    result = kruskal_mst_weight(n3, edges3)
    print(f"MST Weight: {result} (disconnected, returns -1)")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <numeric>

using namespace std;

/**
 * Union-Find (Disjoint Set Union) data structure with path compression
 * and union by rank for near O(1) amortized operations.
 * 
 * Time Complexity:
 *     - find: O(α(n)) ≈ O(1) amortized
 *     - union: O(α(n)) ≈ O(1) amortized
 * 
 * Space Complexity: O(n)
 */
class UnionFind {
private:
    vector<int> parent;
    vector<int> rank;
    
public:
    UnionFind(int n) {
        parent.resize(n);
        rank.assign(n, 0);
        iota(parent.begin(), parent.end(), 0);  // parent[i] = i
    }
    
    /**
     * Find root with path compression.
     */
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);  // Path compression
        }
        return parent[x];
    }
    
    /**
     * Unite sets using union by rank.
     * Returns true if merged, false if already in same set.
     */
    bool unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        
        if (rootX == rootY) {
            return false;
        }
        
        // Union by rank
        if (rank[rootX] < rank[rootY]) {
            swap(rootX, rootY);
        }
        parent[rootY] = rootX;
        
        if (rank[rootX] == rank[rootY]) {
            rank[rootX]++;
        }
        
        return true;
    }
    
    bool connected(int x, int y) {
        return find(x) == find(y);
    }
};

/**
 * Edge structure for Kruskal's algorithm.
 */
struct Edge {
    int weight;
    int u, v;
    
    bool operator<(const Edge& other) const {
        return weight < other.weight;
    }
};

/**
 * Find MST weight using Kruskal's algorithm.
 * 
 * Time Complexity: O(E log E)
 * Space Complexity: O(V)
 * 
 * @param n Number of vertices
 * @param edges Vector of edges (weight, u, v)
 * @return MST weight, or -1 if disconnected
 */
int kruskalMSTWeight(int n, const vector<Edge>& edges) {
    if (n <= 0) return 0;
    
    vector<Edge> sortedEdges = edges;
    sort(sortedEdges.begin(), sortedEdges.end());
    
    UnionFind uf(n);
    int mstWeight = 0;
    int edgesUsed = 0;
    
    for (const auto& edge : sortedEdges) {
        if (uf.unite(edge.u, edge.v)) {
            mstWeight += edge.weight;
            edgesUsed++;
            
            if (edgesUsed == n - 1) {
                break;
            }
        }
    }
    
    return (edgesUsed == n - 1) ? mstWeight : -1;
}

/**
 * Find MST edges using Kruskal's algorithm.
 * 
 * @param n Number of vertices
 * @param edges Vector of edges
 * @return Vector of edges in MST, empty if disconnected
 */
vector<Edge> kruskalMSTEdges(int n, const vector<Edge>& edges) {
    if (n <= 0) return {};
    
    vector<Edge> sortedEdges = edges;
    sort(sortedEdges.begin(), sortedEdges.end());
    
    UnionFind uf(n);
    vector<Edge> mstEdges;
    
    for (const auto& edge : sortedEdges) {
        if (uf.unite(edge.u, edge.v)) {
            mstEdges.push_back(edge);
            
            if ((int)mstEdges.size() == n - 1) {
                break;
            }
        }
    }
    
    return (mstEdges.size() == n - 1) ? mstEdges : vector<Edge>();
}

int main() {
    // Example 1: Basic graph
    int n = 4;
    vector<Edge> edges = {
        {1, 0, 1},
        {3, 0, 2},
        {2, 1, 2},
        {4, 2, 3}
    };
    
    cout << "Example 1: n=" << n << endl;
    cout << "MST Weight: " << kruskalMSTWeight(n, edges) << endl;
    
    vector<Edge> mst = kruskalMSTEdges(n, edges);
    cout << "MST Edges: ";
    for (const auto& e : mst) {
        cout << "(" << e.u << "-" << e.v << ", " << e.weight << ") ";
    }
    cout << endl << endl;
    
    // Example 2: Another graph
    int n2 = 3;
    vector<Edge> edges2 = {
        {1, 0, 1},
        {2, 1, 2},
        {3, 0, 2}
    };
    
    cout << "Example 2: n=" << n2 << endl;
    cout << "MST Weight: " << kruskalMSTWeight(n2, edges2) << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Union-Find (Disjoint Set Union) data structure with path compression
 * and union by rank for near O(1) amortized operations.
 */
class UnionFind {
    private int[] parent;
    private int[] rank;
    
    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            rank[i] = 0;
        }
    }
    
    /**
     * Find root with path compression.
     */
    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);  // Path compression
        }
        return parent[x];
    }
    
    /**
     * Unite sets using union by rank.
     * @return true if merged, false if already in same set
     */
    public boolean union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        
        if (rootX == rootY) {
            return false;
        }
        
        // Union by rank
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        
        return true;
    }
    
    public boolean connected(int x, int y) {
        return find(x) == find(y);
    }
}

/**
 * Edge class for Kruskal's algorithm.
 */
class Edge implements Comparable<Edge> {
    int weight;
    int u, v;
    
    public Edge(int weight, int u, int v) {
        this.weight = weight;
        this.u = u;
        this.v = v;
    }
    
    @Override
    public int compareTo(Edge other) {
        return Integer.compare(this.weight, other.weight);
    }
    
    @Override
    public String toString() {
        return "(" + u + "-" + v + ", " + weight + ")";
    }
}

public class KruskalAlgorithm {
    
    /**
     * Find MST weight using Kruskal's algorithm.
     * 
     * Time Complexity: O(E log E)
     * Space Complexity: O(V)
     * 
     * @param n Number of vertices
     * @param edges List of edges
     * @return MST weight, or -1 if disconnected
     */
    public static int kruskalMSTWeight(int n, List<Edge> edges) {
        if (n <= 0) return 0;
        
        Collections.sort(edges);
        
        UnionFind uf = new UnionFind(n);
        int mstWeight = 0;
        int edgesUsed = 0;
        
        for (Edge edge : edges) {
            if (uf.union(edge.u, edge.v)) {
                mstWeight += edge.weight;
                edgesUsed++;
                
                if (edgesUsed == n - 1) {
                    break;
                }
            }
        }
        
        return (edgesUsed == n - 1) ? mstWeight : -1;
    }
    
    /**
     * Find MST edges using Kruskal's algorithm.
     */
    public static List<Edge> kruskalMSTEdges(int n, List<Edge> edges) {
        if (n <= 0) return new ArrayList<>();
        
        Collections.sort(edges);
        
        UnionFind uf = new UnionFind(n);
        List<Edge> mstEdges = new ArrayList<>();
        
        for (Edge edge : edges) {
            if (uf.union(edge.u, edge.v)) {
                mstEdges.add(edge);
                
                if (mstEdges.size() == n - 1) {
                    break;
                }
            }
        }
        
        return (mstEdges.size() == n - 1) ? mstEdges : new ArrayList<>();
    }
    
    public static void main(String[] args) {
        // Example 1
        int n = 4;
        List<Edge> edges = Arrays.asList(
            new Edge(1, 0, 1),
            new Edge(3, 0, 2),
            new Edge(2, 1, 2),
            new Edge(4, 2, 3)
        );
        
        System.out.println("Example 1: n=" + n);
        System.out.println("MST Weight: " + kruskalMSTWeight(n, edges));
        System.out.println("MST Edges: " + kruskalMSTEdges(n, edges));
        
        // Example 2
        int n2 = 3;
        List<Edge> edges2 = Arrays.asList(
            new Edge(1, 0, 1),
            new Edge(2, 1, 2),
            new Edge(3, 0, 2)
        );
        
        System.out.println("\nExample 2: n=" + n2);
        System.out.println("MST Weight: " + kruskalMSTWeight(n2, edges2));
    }
}
```

<!-- slide -->
```javascript
/**
 * Union-Find (Disjoint Set Union) data structure with path compression
 * and union by rank for near O(1) amortized operations.
 */
class UnionFind {
    /**
     * @param {number} n - Number of elements
     */
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = new Array(n).fill(0);
    }
    
    /**
     * Find root with path compression.
     * @param {number} x - Element to find
     * @returns {number} Root of the set
     */
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);  // Path compression
        }
        return this.parent[x];
    }
    
    /**
     * Unite sets using union by rank.
     * @param {number} x - First element
     * @param {number} y - Second element
     * @returns {boolean} True if merged, false if already in same set
     */
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX === rootY) {
            return false;
        }
        
        // Union by rank
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
        
        return true;
    }
    
    /**
     * Check if two elements are in the same set.
     * @param {number} x 
     * @param {number} y 
     * @returns {boolean}
     */
    connected(x, y) {
        return this.find(x) === this.find(y);
    }
}

/**
 * Edge structure for Kruskal's algorithm.
 * @typedef {Object} Edge
 * @property {number} weight
 * @property {number} u
 * @property {number} v
 */

/**
 * Find MST weight using Kruskal's algorithm.
 * 
 * @param {number} n - Number of vertices
 * @param {Edge[]} edges - Array of edges {weight, u, v}
 * @returns {number} MST weight, or -1 if disconnected
 * 
 * Time Complexity: O(E log E)
 * Space Complexity: O(V)
 */
function kruskalMSTWeight(n, edges) {
    if (n <= 0) return 0;
    
    // Sort edges by weight
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
    
    const uf = new UnionFind(n);
    let mstWeight = 0;
    let edgesUsed = 0;
    
    for (const edge of sortedEdges) {
        if (uf.union(edge.u, edge.v)) {
            mstWeight += edge.weight;
            edgesUsed++;
            
            if (edgesUsed === n - 1) {
                break;
            }
        }
    }
    
    return edgesUsed === n - 1 ? mstWeight : -1;
}

/**
 * Find MST edges using Kruskal's algorithm.
 * 
 * @param {number} n - Number of vertices
 * @param {Edge[]} edges - Array of edges {weight, u, v}
 * @returns {Edge[]} Array of edges in MST, or empty if disconnected
 */
function kruskalMSTEdges(n, edges) {
    if (n <= 0) return [];
    
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
    
    const uf = new UnionFind(n);
    const mstEdges = [];
    
    for (const edge of sortedEdges) {
        if (uf.union(edge.u, edge.v)) {
            mstEdges.push(edge);
            
            if (mstEdges.length === n - 1) {
                break;
            }
        }
    }
    
    return mstEdges.length === n - 1 ? mstEdges : [];
}

// Example usage and demonstration
const edges1 = [
    { weight: 1, u: 0, v: 1 },
    { weight: 3, u: 0, v: 2 },
    { weight: 2, u: 1, v: 2 },
    { weight: 4, u: 2, v: 3 }
];

console.log("Example 1: n=4");
console.log("MST Weight:", kruskalMSTWeight(4, edges1));
console.log("MST Edges:", kruskalMSTEdges(4, edges1));

const edges2 = [
    { weight: 1, u: 0, v: 1 },
    { weight: 2, u: 1, v: 2 },
    { weight: 3, u: 0, v: 2 }
];

console.log("\nExample 2: n=3");
console.log("MST Weight:", kruskalMSTWeight(3, edges2));
console.log("MST Edges:", kruskalMSTEdges(3, edges2));
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Sorting Edges** | O(E log E) | Dominant factor |
| **Union-Find Operations** | O(E × α(V)) | α(V) ≈ constant |
| **Total** | O(E log E) | Equivalent to O(E log V) |
| **Space** | O(V + E) | O(V) for DSU, O(E) for edge storage |

### Detailed Breakdown

- **Sorting**: The most expensive operation
  - E edges need to be sorted: O(E log E)
  - Can be optimized to O(E log V) using counting sort for integer weights

- **Union-Find with optimizations**:
  - Path compression + union by rank: O(α(V)) ≈ O(1) amortized
  - Called for each edge: O(E × α(V))

- **Practical complexity**: O(E log E) ≈ O(E log V) for most cases

---

## Space Complexity Analysis

| Component | Space | Description |
|-----------|-------|-------------|
| **Union-Find Parent** | O(V) | Array of size n |
| **Union-Find Rank** | O(V) | Array of size n |
| **Edge List** | O(E) | Store all edges |
| **MST Edges** | O(V) | At most V-1 edges |
| **Total** | O(V + E) | |

### Space Optimization

For very large graphs, consider:
1. **In-place edge sorting**: Don't copy the edge array
2. **Compressed DSU**: Use size instead of rank (slightly different performance)
3. **Edge streaming**: Process edges without storing all (not possible with sorting)

---

## Common Variations

### 1. Minimum Spanning Forest

For disconnected graphs, find minimum spanning forest (MST for each component):

````carousel
```python
def kruskal_mst_forest(n, edges):
    """
    Find minimum spanning forest for disconnected graph.
    Returns a list of MSTs, one for each connected component.
    """
    edges.sort(key=lambda x: x[0])
    uf = UnionFind(n)
    mst_edges = []
    total_weight = 0
    
    for weight, u, v in edges:
        if uf.union(u, v):
            mst_edges.append((u, v, weight))
            total_weight += weight
    
    # Group edges by component using find operation
    components = {}
    for u, v, w in mst_edges:
        root = uf.find(u)
        if root not in components:
            components[root] = {'edges': [], 'weight': 0}
        components[root]['edges'].append((u, v, w))
        components[root]['weight'] += w
    
    return list(components.values())

# Example usage:
# n = 6, edges = [(1, 0, 1), (2, 2, 3), (3, 3, 4)]
# Result: [{edges: [(0,1,1)], weight: 1}, {edges: [(2,3,2), (3,4,3)], weight: 5}]
```

<!-- slide -->
```cpp
struct ForestResult {
    vector<tuple<int, int, int>> edges;
    int weight;
};

vector<ForestResult> kruskalMSTForest(int n, vector<Edge>& edges) {
    sort(edges.begin(), edges.end());
    
    UnionFind uf(n);
    vector<Edge> mstEdges;
    
    for (const auto& e : edges) {
        if (uf.unite(e.u, e.v)) {
            mstEdges.push_back(e);
        }
    }
    
    // Group by component
    unordered_map<int, ForestResult> components;
    for (const auto& e : mstEdges) {
        int root = uf.find(e.u);
        components[root].edges.push_back({e.u, e.v, e.weight});
        components[root].weight += e.weight;
    }
    
    vector<ForestResult> result;
    for (auto& [root, forest] : components) {
        result.push_back(forest);
    }
    
    return result;
}
```

<!-- slide -->
```java
class ForestResult {
    List<Edge> edges = new ArrayList<>();
    int weight = 0;
}

public static List<ForestResult> kruskalMSTForest(int n, List<Edge> edges) {
    Collections.sort(edges);
    
    UnionFind uf = new UnionFind(n);
    List<Edge> mstEdges = new ArrayList<>();
    
    for (Edge e : edges) {
        if (uf.union(e.u, e.v)) {
            mstEdges.add(e);
        }
    }
    
    // Group by component using find
    Map<Integer, ForestResult> components = new HashMap<>();
    for (Edge e : mstEdges) {
        int root = uf.find(e.u);
        components.putIfAbsent(root, new ForestResult());
        ForestResult fr = components.get(root);
        fr.edges.add(e);
        fr.weight += e.weight;
    }
    
    return new ArrayList<>(components.values());
}
```

<!-- slide -->
```javascript
function kruskalMSTForest(n, edges) {
    const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);
    const uf = new UnionFind(n);
    const mstEdges = [];
    
    for (const e of sortedEdges) {
        if (uf.union(e.u, e.v)) {
            mstEdges.push(e);
        }
    }
    
    // Group edges by component
    const components = new Map();
    for (const e of mstEdges) {
        const root = uf.find(e.u);
        if (!components.has(root)) {
            components.set(root, { edges: [], weight: 0 });
        }
        const comp = components.get(root);
        comp.edges.push(e);
        comp.weight += e.weight;
    }
    
    return Array.from(components.values());
}
```
````

### 2. Second Best MST

Find the second minimum spanning tree (different from MST):

````carousel
```python
def second_best_mst(n, edges):
    """
    Find second minimum spanning tree.
    
    Approach:
    1. Find MST and store its edges
    2. For each MST edge, find the minimum edge that can replace it
    3. Return the minimum among all candidates
    """
    # Sort edges by weight
    edges = sorted([(w, u, v, i) for i, (w, u, v) in enumerate(edges)])
    
    # Find MST using Kruskal's
    uf = UnionFind(n)
    mst_edges = []  # (weight, u, v, idx)
    non_mst_edges = []
    mst_weight = 0
    
    for weight, u, v, idx in edges:
        if uf.union(u, v):
            mst_edges.append((weight, u, v, idx))
            mst_weight += weight
        else:
            non_mst_edges.append((weight, u, v, idx))
    
    # If no MST exists or only one possible MST
    if len(mst_edges) != n - 1:
        return -1
    
    second_best = float('inf')
    
    # Try removing each MST edge and find replacement
    for skip_idx in range(len(mst_edges)):
        uf = UnionFind(n)
        temp_weight = 0
        edges_used = 0
        
        # Add all MST edges except skip_idx
        for i, (w, u, v, _) in enumerate(mst_edges):
            if i != skip_idx and uf.union(u, v):
                temp_weight += w
                edges_used += 1
        
        # Find the smallest non-MST edge that connects components
        for w, u, v, _ in non_mst_edges:
            if uf.union(u, v):
                temp_weight += w
                edges_used += 1
                break
        
        if edges_used == n - 1 and temp_weight > mst_weight:
            second_best = min(second_best, temp_weight)
    
    return second_best if second_best != float('inf') else -1
```

<!-- slide -->
```cpp
struct Edge {
    int weight, u, v, idx;
    bool operator<(const Edge& other) const {
        return weight < other.weight;
    }
};

int secondBestMST(int n, vector<Edge>& edges) {
    // Sort edges
    sort(edges.begin(), edges.end());
    
    // Find MST
    UnionFind uf(n);
    vector<Edge> mstEdges;
    vector<Edge> nonMstEdges;
    int mstWeight = 0;
    
    for (const auto& e : edges) {
        if (uf.unite(e.u, e.v)) {
            mstEdges.push_back(e);
            mstWeight += e.weight;
        } else {
            nonMstEdges.push_back(e);
        }
    }
    
    if (mstEdges.size() != n - 1) return -1;
    
    int secondBest = INT_MAX;
    
    // Try removing each MST edge
    for (size_t skip = 0; skip < mstEdges.size(); skip++) {
        UnionFind tempUf(n);
        int tempWeight = 0;
        int edgesUsed = 0;
        
        // Add all MST edges except skip
        for (size_t i = 0; i < mstEdges.size(); i++) {
            if (i != skip && tempUf.unite(mstEdges[i].u, mstEdges[i].v)) {
                tempWeight += mstEdges[i].weight;
                edgesUsed++;
            }
        }
        
        // Find replacement edge
        for (const auto& e : nonMstEdges) {
            if (tempUf.unite(e.u, e.v)) {
                tempWeight += e.weight;
                edgesUsed++;
                break;
            }
        }
        
        if (edgesUsed == n - 1 && tempWeight > mstWeight) {
            secondBest = min(secondBest, tempWeight);
        }
    }
    
    return (secondBest == INT_MAX) ? -1 : secondBest;
}
```

<!-- slide -->
```java
class Edge implements Comparable<Edge> {
    int weight, u, v, idx;
    
    public Edge(int w, int u, int v, int idx) {
        this.weight = w; this.u = u; this.v = v; this.idx = idx;
    }
    
    @Override
    public int compareTo(Edge other) {
        return Integer.compare(this.weight, other.weight);
    }
}

public static int secondBestMST(int n, List<Edge> edges) {
    Collections.sort(edges);
    
    // Find MST
    UnionFind uf = new UnionFind(n);
    List<Edge> mstEdges = new ArrayList<>();
    List<Edge> nonMstEdges = new ArrayList<>();
    int mstWeight = 0;
    
    for (Edge e : edges) {
        if (uf.union(e.u, e.v)) {
            mstEdges.add(e);
            mstWeight += e.weight;
        } else {
            nonMstEdges.add(e);
        }
    }
    
    if (mstEdges.size() != n - 1) return -1;
    
    int secondBest = Integer.MAX_VALUE;
    
    // Try removing each MST edge
    for (int skip = 0; skip < mstEdges.size(); skip++) {
        UnionFind tempUf = new UnionFind(n);
        int tempWeight = 0;
        int edgesUsed = 0;
        
        for (int i = 0; i < mstEdges.size(); i++) {
            if (i != skip && tempUf.union(mstEdges.get(i).u, mstEdges.get(i).v)) {
                tempWeight += mstEdges.get(i).weight;
                edgesUsed++;
            }
        }
        
        for (Edge e : nonMstEdges) {
            if (tempUf.union(e.u, e.v)) {
                tempWeight += e.weight;
                edgesUsed++;
                break;
            }
        }
        
        if (edgesUsed == n - 1 && tempWeight > mstWeight) {
            secondBest = Math.min(secondBest, tempWeight);
        }
    }
    
    return (secondBest == Integer.MAX_VALUE) ? -1 : secondBest;
}
```

<!-- slide -->
```javascript
function secondBestMST(n, edges) {
    // Add index to each edge for tracking
    const indexedEdges = edges.map((e, i) => ({...e, idx: i}));
    indexedEdges.sort((a, b) => a.weight - b.weight);
    
    // Find MST
    const uf = new UnionFind(n);
    const mstEdges = [];
    const nonMstEdges = [];
    let mstWeight = 0;
    
    for (const e of indexedEdges) {
        if (uf.union(e.u, e.v)) {
            mstEdges.push(e);
            mstWeight += e.weight;
        } else {
            nonMstEdges.push(e);
        }
    }
    
    if (mstEdges.length !== n - 1) return -1;
    
    let secondBest = Infinity;
    
    // Try removing each MST edge
    for (let skip = 0; skip < mstEdges.length; skip++) {
        const tempUf = new UnionFind(n);
        let tempWeight = 0;
        let edgesUsed = 0;
        
        for (let i = 0; i < mstEdges.length; i++) {
            if (i !== skip && tempUf.union(mstEdges[i].u, mstEdges[i].v)) {
                tempWeight += mstEdges[i].weight;
                edgesUsed++;
            }
        }
        
        for (const e of nonMstEdges) {
            if (tempUf.union(e.u, e.v)) {
                tempWeight += e.weight;
                edgesUsed++;
                break;
            }
        }
        
        if (edgesUsed === n - 1 && tempWeight > mstWeight) {
            secondBest = Math.min(secondBest, tempWeight);
        }
    }
    
    return secondBest === Infinity ? -1 : secondBest;
}
```
````

### 3. Kruskal with Edge Constraints

For problems with additional constraints (e.g., must include/exclude certain edges):

````carousel
```python
def kruskal_with_constraints(n, edges, required_edges, forbidden_edges):
    """
    Kruskal with required and forbidden edges.
    
    Args:
        required_edges: List of edges that must be included
        forbidden_edges: List of edges that cannot be used
    """
    # Create set of forbidden edges for O(1) lookup
    forbidden_set = set((min(u, v), max(u, v)) for u, v in forbidden_edges)
    
    # Filter out forbidden edges
    filtered_edges = [(w, u, v) for w, u, v in edges 
                      if (min(u, v), max(u, v)) not in forbidden_set]
    
    # Initialize Union-Find
    uf = UnionFind(n)
    mst_weight = 0
    edges_used = 0
    
    # First, add required edges
    for weight, u, v in required_edges:
        if not uf.union(u, v):
            return -1  # Required edges form a cycle - invalid
        mst_weight += weight
        edges_used += 1
    
    # Then, add remaining edges using standard Kruskal
    filtered_edges.sort(key=lambda x: x[0])
    for weight, u, v in filtered_edges:
        if uf.union(u, v):
            mst_weight += weight
            edges_used += 1
            if edges_used == n - 1:
                break
    
    return mst_weight if edges_used == n - 1 else -1
```

<!-- slide -->
```cpp
int kruskalWithConstraints(int n, vector<Edge>& edges, 
                           const vector<Edge>& requiredEdges,
                           const set<pair<int,int>>& forbiddenEdges) {
    // Filter out forbidden edges
    vector<Edge> filteredEdges;
    for (const auto& e : edges) {
        int u = min(e.u, e.v), v = max(e.u, e.v);
        if (forbiddenEdges.find({u, v}) == forbiddenEdges.end()) {
            filteredEdges.push_back(e);
        }
    }
    
    sort(filteredEdges.begin(), filteredEdges.end());
    
    UnionFind uf(n);
    int mstWeight = 0;
    int edgesUsed = 0;
    
    // Add required edges first
    for (const auto& e : requiredEdges) {
        if (!uf.unite(e.u, e.v)) {
            return -1; // Required edges form cycle
        }
        mstWeight += e.weight;
        edgesUsed++;
    }
    
    // Add remaining edges
    for (const auto& e : filteredEdges) {
        if (uf.unite(e.u, e.v)) {
            mstWeight += e.weight;
            edgesUsed++;
            if (edgesUsed == n - 1) break;
        }
    }
    
    return (edgesUsed == n - 1) ? mstWeight : -1;
}
```

<!-- slide -->
```java
public static int kruskalWithConstraints(int n, List<Edge> edges,
                                          List<Edge> requiredEdges,
                                          Set<String> forbiddenEdges) {
    // Filter forbidden edges
    List<Edge> filteredEdges = new ArrayList<>();
    for (Edge e : edges) {
        String key = Math.min(e.u, e.v) + ":" + Math.max(e.u, e.v);
        if (!forbiddenEdges.contains(key)) {
            filteredEdges.add(e);
        }
    }
    
    Collections.sort(filteredEdges);
    
    UnionFind uf = new UnionFind(n);
    int mstWeight = 0;
    int edgesUsed = 0;
    
    // Add required edges first
    for (Edge e : requiredEdges) {
        if (!uf.union(e.u, e.v)) {
            return -1; // Required edges form cycle
        }
        mstWeight += e.weight;
        edgesUsed++;
    }
    
    // Add remaining edges
    for (Edge e : filteredEdges) {
        if (uf.union(e.u, e.v)) {
            mstWeight += e.weight;
            edgesUsed++;
            if (edgesUsed == n - 1) break;
        }
    }
    
    return (edgesUsed == n - 1) ? mstWeight : -1;
}
```

<!-- slide -->
```javascript
function kruskalWithConstraints(n, edges, requiredEdges, forbiddenEdges) {
    // Create set of forbidden edges
    const forbiddenSet = new Set();
    for (const [u, v] of forbiddenEdges) {
        forbiddenSet.add(`${Math.min(u, v)}:${Math.max(u, v)}`);
    }
    
    // Filter out forbidden edges
    const filteredEdges = edges.filter(e => {
        const key = `${Math.min(e.u, e.v)}:${Math.max(e.u, e.v)}`;
        return !forbiddenSet.has(key);
    });
    
    filteredEdges.sort((a, b) => a.weight - b.weight);
    
    const uf = new UnionFind(n);
    let mstWeight = 0;
    let edgesUsed = 0;
    
    // Add required edges first
    for (const e of requiredEdges) {
        if (!uf.union(e.u, e.v)) {
            return -1; // Required edges form cycle
        }
        mstWeight += e.weight;
        edgesUsed++;
    }
    
    // Add remaining edges
    for (const e of filteredEdges) {
        if (uf.union(e.u, e.v)) {
            mstWeight += e.weight;
            edgesUsed++;
            if (edgesUsed === n - 1) break;
        }
    }
    
    return edgesUsed === n - 1 ? mstWeight : -1;
}
```
````

### 4. Maximum Spanning Tree

Find maximum weight spanning tree (simply reverse sorting):

````carousel
```python
def maximum_spanning_tree(n, edges):
    """
    Find maximum spanning tree using Kruskal's with descending sort.
    Time: O(E log E), Space: O(V)
    """
    # Sort in DESCENDING order instead of ascending
    edges.sort(key=lambda x: -x[0])
    uf = UnionFind(n)
    mst_edges = []
    total_weight = 0
    
    for weight, u, v in edges:
        if uf.union(u, v):
            mst_edges.append((u, v, weight))
            total_weight += weight
            if len(mst_edges) == n - 1:
                break
    
    return mst_edges if len(mst_edges) == n - 1 else None, total_weight

# Example: Network design where you want maximum capacity paths
# Useful for: Maximum capacity path, bottleneck optimization
```

<!-- slide -->
```cpp
vector<Edge> maximumSpanningTree(int n, vector<Edge>& edges) {
    // Sort in descending order
    sort(edges.begin(), edges.end(), 
         [](const Edge& a, const Edge& b) { return a.weight > b.weight; });
    
    UnionFind uf(n);
    vector<Edge> mstEdges;
    int totalWeight = 0;
    
    for (const auto& e : edges) {
        if (uf.unite(e.u, e.v)) {
            mstEdges.push_back(e);
            totalWeight += e.weight;
            if (mstEdges.size() == n - 1) break;
        }
    }
    
    return (mstEdges.size() == n - 1) ? mstEdges : vector<Edge>();
}
```

<!-- slide -->
```java
public static List<Edge> maximumSpanningTree(int n, List<Edge> edges) {
    // Sort in descending order
    edges.sort((a, b) -> Integer.compare(b.weight, a.weight));
    
    UnionFind uf = new UnionFind(n);
    List<Edge> mstEdges = new ArrayList<>();
    int totalWeight = 0;
    
    for (Edge e : edges) {
        if (uf.union(e.u, e.v)) {
            mstEdges.add(e);
            totalWeight += e.weight;
            if (mstEdges.size() == n - 1) break;
        }
    }
    
    return (mstEdges.size() == n - 1) ? mstEdges : new ArrayList<>();
}
```

<!-- slide -->
```javascript
function maximumSpanningTree(n, edges) {
    // Sort in descending order
    const sortedEdges = [...edges].sort((a, b) => b.weight - a.weight);
    
    const uf = new UnionFind(n);
    const mstEdges = [];
    let totalWeight = 0;
    
    for (const e of sortedEdges) {
        if (uf.union(e.u, e.v)) {
            mstEdges.push(e);
            totalWeight += e.weight;
            if (mstEdges.length === n - 1) break;
        }
    }
    
    return mstEdges.length === n - 1 ? { edges: mstEdges, weight: totalWeight } : null;
}
```
````

---

## Practice Problems

### Problem 1: Minimum Cost to Connect All Points

**Problem:** [LeetCode 1584 - Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points/)

**Description:** You are given an array `points` representing integer coordinates. Return the minimum total cost to connect all points where the cost between two points is the Manhattan distance.

**How to Apply Kruskal's:**
- Generate all O(V²) edges with Manhattan distance as weight
- Use Kruskal's algorithm to find MST weight
- Efficient for sparse graphs; for dense, consider Prim's instead

---

### Problem 2: Number of Operations to Make Network Connected

**Problem:** [LeetCode 1319 - Number of Operations to Make Network Connected](https://leetcode.com/problems/number-of-operations-to-make-network-connected/)

**Description:** There are `n` computers numbered from `0` to `n-1`. Given the connections, return the minimum number of operations needed to make the network connected.

**How to Apply Kruskal's/Union-Find:**
- Use Union-Find to count connected components
- If components > 1, need at least components-1 moves
- Verify if enough edges exist (edges must be >= n-1)

---

### Problem 3: Minimum Spanning Tree - LEDA

**Problem:** [LeetCode 1489 - Find Min Cost to Connect All Nodes in Graph](https://leetcode.com/problems/find-min-cost-to-connect-all-nodes-in-graph/)

**Description:** Given an undirected graph with possible duplicate edges, find the minimum cost to make the graph connected (can use existing edges or add new ones).

**How to Apply Kruskal's:**
- First, add all existing edges using Union-Find
- Then, use Kruskal to add cheapest edges to connect components
- Greedy approach: always pick cheapest edge that connects two components

---

### Problem 4: Critical and Pseudo-Critical Edges

**Problem:** [LeetCode 1489 - Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree](https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/)

**Description:** Given a weighted undirected graph, find edges that are critical (must be in MST) and pseudo-critical (can be in MST but not required).

**How to Apply Kruskal's:**
- First compute MST weight
- For each edge, test by:
  - Including it first (must-be-in test)
  - Excluding it (cannot-be-in test)
- Compare results to identify edge types

---

### Problem 5: Graph Connectivity with Threshold

**Problem:** [LeetCode 1627 - Graph Connectivity With Threshold](https://leetcode.com/problems/graph-connectivity-with-threshold/)

**Description:** Given `n` nodes, a threshold `t`, and a list of queries, determine if two nodes are connected when only edges between nodes with a common divisor greater than the threshold are considered.

**How to Apply Kruskal's/Union-Find:**
- Use Union-Find to build connectivity
- For each possible divisor d > threshold, connect all multiples of d
- This efficiently groups nodes that share common factors
- Answer queries by checking if nodes are in the same component

---

## Video Tutorial Links

### Fundamentals

- [Kruskal's Algorithm - Introduction (Take U Forward)](https://www.youtube.com/watch?v=DMxHDXxXJcw) - Comprehensive introduction
- [Kruskal's Algorithm (WilliamFiset)](https://www.youtube.com/watch?v=71UQJmN2k5I) - Detailed explanation with visualizations
- [Union-Find Data Structure (NeetCode)](https://www.youtube.com/watch?v=0jNmHPfAypU) - DSU implementation

### Advanced Topics

- [Kruskal vs Prim's Algorithm](https://www.youtube.com/watch?v=ZseH0Ng98cM) - Comparison and when to use which
- [Minimum Spanning Tree - All Variations](https://www.youtube.com/watch?v=EjVH8jS6TjE) - Comprehensive MST coverage
- [Second Best MST](https://www.youtube.com/watch?v=0695tG1h9dU) - Advanced variation

---

## Follow-up Questions

### Q1: What is the difference between Kruskal's and Prim's algorithms?

**Answer:** Both find MST but with different approaches:
- **Kruskal's**: Edge-centric, greedy on edges sorted by weight, uses Union-Find
- **Prim's**: Vertex-centric, grows tree from a starting vertex, uses priority queue
- **Choice**: Kruskal better for sparse graphs, Prim better for dense graphs

### Q2: Why does Kruskal's algorithm work?

**Answer:** It relies on the **Cut Property**: for any partition of vertices into two sets, the minimum weight edge crossing that cut belongs to some MST. By always picking the minimum weight edge that doesn't create a cycle, we're essentially making locally optimal choices that lead to a globally optimal solution.

### Q3: Can Kruskal's algorithm handle directed graphs?

**Answer:** No, Kruskal's is specifically for **undirected** graphs. For directed graphs:
- **Minimum arborescence/spanning arborescence**: Use Chu-Liu/Edmonds algorithm
- **Directed MST**: Different problem entirely

### Q4: What is the time complexity of Union-Find with path compression?

**Answer:** With both path compression and union by rank:
- **Amortized time**: O(α(n)) where α is the inverse Ackermann function
- **Practical time**: α(n) < 5 for all realistic n, so effectively O(1)

### Q5: How do you handle disconnected graphs with Kruskal's?

**Answer:** 
1. **Detect disconnection**: After processing all edges, check if MST has V-1 edges
2. **Return error**: Return -1, null, or throw exception
3. **MST Forest**: For each component, compute separate MST (variation)

---

## Summary

Kruskal's Algorithm is a classic greedy algorithm for finding the Minimum Spanning Tree in a weighted undirected graph. Key takeaways:

- **Greedy approach**: Always pick the cheapest edge that doesn't create a cycle
- **Union-Find**: Efficiently detects cycles and manages components
- **Time complexity**: O(E log E) dominated by edge sorting
- **Space complexity**: O(V + E) for edge storage and DSU

When to use:
- ✅ Finding MST for sparse graphs
- ✅ When edges are given directly (not as adjacency matrix)
- ✅ Network design and clustering problems
- ❌ Dense graphs (use Prim's instead)
- ❌ Directed graphs (use Chu-Liu/Edmonds)

This algorithm is fundamental in graph theory and competitive programming, essential for solving problems involving network optimization, clustering, and cycle detection.

---

## Related Algorithms

- [Prim's Algorithm](./prims.md) - Alternative MST algorithm (vertex-centric)
- [Union-Find](./union-find.md) - The core data structure used
- [Borůvka's Algorithm](./boruvka.md) - Another MST algorithm
- [Dijkstra's Algorithm](./dijkstra.md) - Shortest path (similar greedy approach)
