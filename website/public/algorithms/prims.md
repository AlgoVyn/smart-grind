# Prim's Algorithm

## Category
Graphs

## Description

Prim's algorithm finds the **Minimum Spanning Tree (MST)** of a weighted undirected graph. A spanning tree connects all vertices without forming cycles, and the MST is the spanning tree with the minimum total edge weight. This is a classic **greedy algorithm** that builds the MST incrementally by always selecting the minimum weight edge that connects the tree to a new vertex.

---

## When to Use

Use Prim's algorithm when you need to solve problems involving:

- **Network Design**: Building cost-effective networks (roads, railways, telecommunications)
- **Clustering**: Grouping data points based on distance
- **Image Segmentation**: Segmenting images based on pixel similarities
- **Approximation Algorithms**: Used as a component in NP-hard problem approximations
- **Any MST-related problem**: When you need to find minimum spanning tree

### Comparison with Alternatives

| Algorithm | Time Complexity | Use Case |
|-----------|----------------|----------|
| **Prim's (Heap)** | O(E log V) | Most common MST algorithm |
| **Prim's (Fibonacci)** | O(E + V log V) | Optimal but complex to implement |
| **Kruskal's** | O(E log V) | Best for sparse graphs |
| **Borůvka's** | O(E log V) | Parallel/foreign-born algorithms |

### When to Choose Prim's vs Kruskal's

- **Choose Prim's** when:
  - The graph is dense (E ≈ V²)
  - You have a starting point requirement
  - You're working with adjacency list representation

- **Choose Kruskal's** when:
  - The graph is sparse
  - Edges are already sorted or can be sorted easily
  - You want simpler implementation

---

## Algorithm Explanation

### Core Concept

The key insight behind Prim's algorithm is the **Cut Property**: For any cut of the graph (a partition of vertices into two sets), the minimum weight edge crossing that cut is in some MST. By repeatedly applying this property—always picking the minimum weight edge that connects the visited vertices to unvisited vertices—we guarantee finding the optimal MST.

### How It Works

#### Initialization:
1. Start from an arbitrary vertex (usually vertex 0)
2. Mark it as part of the MST
3. Add all edges from this vertex to a priority queue (min-heap)

#### Growth Phase:
1. Extract the minimum weight edge from the priority queue
2. If the destination vertex is already visited, skip it
3. Otherwise, add the vertex and edge to the MST
4. Add all edges from this new vertex to unvisited vertices into the queue
5. Repeat until all vertices are included

#### Termination:
- The algorithm stops when all V vertices are in the MST
- If the priority queue becomes empty before reaching all vertices, the graph is disconnected (no MST exists)

### Visual Representation

For a graph with vertices {0, 1, 2, 3} and edges:
```
0 --(10)--> 1
0 --(6)--> 2
0 --(5)--> 3
1 --(15)--> 3
2 --(4)--> 3
```

```
Step 1: Start at vertex 0
        MST: {0}, Queue: [(10,1), (6,2), (5,3)]

Step 2: Pick edge (5,3) - add vertex 3
        MST: {0,3}, Queue: [(10,1), (6,2), (15,3)]

Step 3: Pick edge (4,3) - add vertex 2  
        MST: {0,3,2}, Queue: [(10,1), (15,3)]

Step 4: Pick edge (10,1) - add vertex 1
        MST: {0,3,2,1}, Queue: [(15,3)]

Total weight: 5 + 4 + 10 = 19
```

### Why Greedy Works

The greedy approach is valid due to the **Cut Property**:
- At each step, we have a "cut" separating visited vertices from unvisited ones
- The minimum edge crossing this cut MUST be in the MST
- By always picking this minimum edge, we never make a suboptimal choice
- This local optimal choice leads to global optimal (MST)

### Limitations

- **Only works for undirected graphs**: For directed minimum spanning arborescents, use Chu–Liu/Edmonds algorithm
- **Requires connected graph**: Disconnected graphs don't have an MST
- **Only considers edge weights**: All edges must have comparable weights

---

## Algorithm Steps

### Step-by-Step Approach

1. **Build Adjacency List**: Convert edge list to adjacency list for efficient traversal

2. **Initialize Data Structures**:
   - Create a min-heap (priority queue) with (weight, vertex, parent)
   - Mark all vertices as unvisited
   - Start from vertex 0

3. **Main Loop**:
   - While heap is not empty and MST is incomplete:
     - Pop the minimum weight edge
     - If destination is visited, skip
     - Otherwise, add vertex to MST
     - Add edge weight to total
     - Push all adjacent edges to unvisited vertices

4. **Verify Completeness**: Check if all vertices were included (otherwise, graph is disconnected)

5. **Return Result**: Return total MST weight or -1 for disconnected graphs

---

## Implementation

### Template Code (Prim's Algorithm with Min-Heap)

````carousel
```python
import heapq
from collections import defaultdict
from typing import List, Tuple, Optional

def prim_mst(n: int, edges: List[List[int]]) -> int:
    """
    Find MST using Prim's algorithm with min-heap.
    
    Args:
        n: Number of vertices (0 to n-1)
        edges: List of edges as [u, v, weight]
    
    Returns:
        Total weight of MST, or -1 if graph is disconnected
    
    Time: O(E log V)
    Space: O(V + E)
    """
    # Build adjacency list - handle empty edges
    graph = defaultdict(list)
    for u, v, w in edges:
        graph[u].append((v, w))
        graph[v].append((u, w))
    
    if not graph:
        return 0  # Single vertex with no edges
    
    # Min-heap: (weight, destination_vertex, parent_vertex)
    min_heap = [(0, 0, -1)]  # Start from vertex 0
    visited = [False] * n
    total_weight = 0
    edges_in_mst = 0
    
    while min_heap and edges_in_mst < n:
        weight, u, parent = heapq.heappop(min_heap)
        
        # Skip if already visited
        if visited[u]:
            continue
        
        # Include this vertex
        visited[u] = True
        total_weight += weight
        edges_in_mst += 1
        
        # Add all adjacent edges to heap
        for v, w in graph[u]:
            if not visited[v]:
                heapq.heappush(min_heap, (w, v, u))
    
    # Check if all vertices were reached
    if edges_in_mst == n:
        return total_weight
    return -1  # Graph is disconnected


def prim_mst_edges(n: int, edges: List[List[int]]) -> Tuple[int, List[List[int]]]:
    """
    Return MST with actual edges included.
    
    Args:
        n: Number of vertices
        edges: List of edges as [u, v, weight]
    
    Returns:
        Tuple of (total_weight, list_of_mst_edges)
    """
    graph = defaultdict(list)
    for u, v, w in edges:
        graph[u].append((v, w))
        graph[v].append((u, w))
    
    min_heap = [(0, 0, -1)]  # (weight, vertex, parent)
    visited = [False] * n
    mst_edges = []
    total_weight = 0
    edges_count = 0
    
    while min_heap and edges_count < n:
        weight, u, parent = heapq.heappop(min_heap)
        
        if visited[u]:
            continue
        
        visited[u] = True
        total_weight += weight
        edges_count += 1
        
        if parent != -1:
            mst_edges.append([parent, u, weight])
        
        for v, w in graph[u]:
            if not visited[v]:
                heapq.heappush(min_heap, (w, v, u))
    
    if edges_count == n:
        return total_weight, mst_edges
    return -1, []


# Prim's with adjacency matrix (better for dense graphs)
def prim_dense(n: int, graph: List[List[int]]) -> int:
    """
    Prim's algorithm using adjacency matrix.
    Better for dense graphs where E ≈ V^2.
    
    Time: O(V^2)
    Space: O(V)
    """
    dist = [float('inf')] * n
    visited = [False] * n
    dist[0] = 0
    total_weight = 0
    
    for _ in range(n):
        # Find minimum distance vertex not yet visited
        u = -1
        min_dist = float('inf')
        for v in range(n):
            if not visited[v] and dist[v] < min_dist:
                min_dist = dist[v]
                u = v
        
        if u == -1:  # Graph is disconnected
            return -1
        
        visited[u] = True
        total_weight += min_dist
        
        # Update distances
        for v in range(n):
            if not visited[v] and graph[u][v] < dist[v]:
                dist[v] = graph[u][v]
    
    return total_weight


# Example usage and demonstration
if __name__ == "__main__":
    # Example 1: Basic graph
    n1 = 4
    edges1 = [[0, 1, 10], [0, 2, 6], [0, 3, 5], [1, 3, 15], [2, 3, 4]]
    print(f"Example 1: n={n1}, edges={edges1}")
    print(f"MST Weight: {prim_mst(n1, edges1)}")  # Output: 19
    print()
    
    # Example 2: With edge list output
    weight, mst_edges = prim_mst_edges(n1, edges1)
    print(f"MST Edges: {mst_edges}")
    print(f"Total Weight: {weight}")  # Output: 19
    print()
    
    # Example 3: Disconnected graph
    n2 = 3
    edges2 = [[0, 1, 1]]  # Vertex 2 is isolated
    result = prim_mst(n2, edges2)
    print(f"Disconnected graph result: {result}")  # Output: -1
    print()
    
    # Example 4: Larger example
    n3 = 5
    edges3 = [[0, 1, 2], [0, 3, 6], [1, 2, 3], [1, 3, 8], 
              [1, 4, 5], [2, 4, 7], [3, 4, 9]]
    print(f"Example 4: n={n3}, edges={edges3}")
    print(f"MST Weight: {prim_mst(n3, edges3)}")  # Output: 16
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <limits>
using namespace std;

/**
 * Prim's Algorithm for MST using Min-Heap (Priority Queue)
 * 
 * Time Complexity: O(E log V)
 * Space Complexity: O(V + E)
 */

struct Edge {
    int to;
    int weight;
};

struct PQNode {
    int weight;
    int vertex;
    int parent;
    
    // For min-heap (priority_queue by default is max-heap)
    bool operator>(const PQNode& other) const {
        return weight > other.weight;
    }
};

int primMST(int n, const vector<vector<Edge>>& graph) {
    if (n == 0) return 0;
    
    // Min-heap: (weight, vertex, parent)
    priority_queue<PQNode, vector<PQNode>, greater<PQNode>> minHeap;
    vector<bool> visited(n, false);
    
    // Start from vertex 0
    minHeap.push({0, 0, -1});
    int totalWeight = 0;
    int edgesCount = 0;
    
    while (!minHeap.empty() && edgesCount < n) {
        PQNode current = minHeap.top();
        minHeap.pop();
        
        int u = current.vertex;
        
        // Skip if already visited
        if (visited[u]) continue;
        
        // Include this vertex
        visited[u] = true;
        totalWeight += current.weight;
        edgesCount++;
        
        // Add all adjacent edges
        for (const Edge& edge : graph[u]) {
            if (!visited[edge.to]) {
                minHeap.push({edge.weight, edge.to, u});
            }
        }
    }
    
    return (edgesCount == n) ? totalWeight : -1;
}

// Also return MST edges
pair<int, vector<vector<int>>> primMSTEdges(int n, const vector<vector<Edge>>& graph) {
    if (n == 0) return {0, {}};
    
    priority_queue<PQNode, vector<PQNode>, greater<PQNode>> minHeap;
    vector<bool> visited(n, false);
    vector<vector<int>> mstEdges;
    
    minHeap.push({0, 0, -1});
    int totalWeight = 0;
    int edgesCount = 0;
    
    while (!minHeap.empty() && edgesCount < n) {
        PQNode current = minHeap.top();
        minHeap.pop();
        
        int u = current.vertex;
        
        if (visited[u]) continue;
        
        visited[u] = true;
        totalWeight += current.weight;
        edgesCount++;
        
        if (current.parent != -1) {
            mstEdges.push_back({current.parent, u, current.weight});
        }
        
        for (const Edge& edge : graph[u]) {
            if (!visited[edge.to]) {
                minHeap.push({edge.weight, edge.to, u});
            }
        }
    }
    
    return (edgesCount == n) ? make_pair(totalWeight, mstEdges) : make_pair(-1, vector<vector<int>>());
}

// Dense graph version - O(V^2)
int primMSTDense(int n, const vector<vector<int>>& graph) {
    vector<int> dist(n, INT_MAX);
    vector<bool> visited(n, false);
    
    dist[0] = 0;
    int totalWeight = 0;
    
    for (int i = 0; i < n; i++) {
        // Find minimum distance vertex
        int u = -1;
        int minDist = INT_MAX;
        
        for (int v = 0; v < n; v++) {
            if (!visited[v] && dist[v] < minDist) {
                minDist = dist[v];
                u = v;
            }
        }
        
        if (u == -1) return -1;  // Disconnected
        
        visited[u] = true;
        totalWeight += minDist;
        
        // Update distances
        for (int v = 0; v < n; v++) {
            if (!visited[v] && graph[u][v] < dist[v]) {
                dist[v] = graph[u][v];
            }
        }
    }
    
    return totalWeight;
}

int main() {
    // Example 1: Basic graph
    int n1 = 4;
    vector<vector<Edge>> graph1(n1);
    vector<vector<int>> edges1 = {{0, 1, 10}, {0, 2, 6}, {0, 3, 5}, {1, 3, 15}, {2, 3, 4}};
    
    for (auto& e : edges1) {
        graph1[e[0]].push_back({e[1], e[2]});
        graph1[e[1]].push_back({e[0], e[2]});
    }
    
    cout << "Example 1: n=" << n1 << ", edges=[";
    for (size_t i = 0; i < edges1.size(); i++) {
        cout << "[" << edges1[i][0] << "," << edges1[i][1] << "," << edges1[i][2] << "]";
        if (i < edges1.size() - 1) cout << ", ";
    }
    cout << "]" << endl;
    
    int result1 = primMST(n1, graph1);
    cout << "MST Weight: " << result1 << endl;  // Output: 19
    cout << endl;
    
    // Example 2: With edges
    auto [weight2, mstEdges2] = primMSTEdges(n1, graph1);
    cout << "MST Edges: [";
    for (size_t i = 0; i < mstEdges2.size(); i++) {
        cout << "[" << mstEdges2[i][0] << "," << mstEdges2[i][1] << "," << mstEdges2[i][2] << "]";
        if (i < mstEdges2.size() - 1) cout << ", ";
    }
    cout << "]" << endl;
    cout << "Total Weight: " << weight2 << endl << endl;
    
    // Example 3: Disconnected
    int n2 = 3;
    vector<vector<Edge>> graph2(n2);
    graph2[0].push_back({1, 1});
    graph2[1].push_back({0, 1});
    
    int result2 = primMST(n2, graph2);
    cout << "Disconnected graph result: " << result2 << endl;  // Output: -1
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Prim's Algorithm for MST using Min-Heap (Priority Queue)
 * 
 * Time Complexity: O(E log V)
 * Space Complexity: O(V + E)
 */
public class PrimMST {
    
    static class Edge {
        int to;
        int weight;
        
        Edge(int to, int weight) {
            this.to = to;
            this.weight = weight;
        }
    }
    
    static class PQNode implements Comparable<PQNode> {
        int weight;
        int vertex;
        int parent;
        
        PQNode(int weight, int vertex, int parent) {
            this.weight = weight;
            this.vertex = vertex;
            this.parent = parent;
        }
        
        @Override
        public int compareTo(PQNode other) {
            return Integer.compare(this.weight, other.weight);
        }
    }
    
    /**
     * Find MST weight using Prim's algorithm
     * @param n Number of vertices
     * @param edges List of edges [u, v, weight]
     * @return Total MST weight, or -1 if disconnected
     */
    public static int primMST(int n, int[][] edges) {
        if (n == 0) return 0;
        
        // Build adjacency list
        List<Edge>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], w = edge[2];
            graph[u].add(new Edge(v, w));
            graph[v].add(new Edge(u, w));
        }
        
        // Min-heap
        PriorityQueue<PQNode> minHeap = new PriorityQueue<>();
        boolean[] visited = new boolean[n];
        
        // Start from vertex 0
        minHeap.add(new PQNode(0, 0, -1));
        int totalWeight = 0;
        int edgesCount = 0;
        
        while (!minHeap.isEmpty() && edgesCount < n) {
            PQNode current = minHeap.poll();
            int u = current.vertex;
            
            if (visited[u]) continue;
            
            visited[u] = true;
            totalWeight += current.weight;
            edgesCount++;
            
            for (Edge edge : graph[u]) {
                if (!visited[edge.to]) {
                    minHeap.add(new PQNode(edge.weight, edge.to, u));
                }
            }
        }
        
        return (edgesCount == n) ? totalWeight : -1;
    }
    
    /**
     * Find MST with actual edges
     * @return int[0] = total weight, int[1:] = edges as [u,v,w]
     */
    public static List<int[]> primMSTEdges(int n, int[][] edges) {
        if (n == 0) return new ArrayList<>();
        
        List<Edge>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) {
            graph[i] = new ArrayList<>();
        }
        
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1], w = edge[2];
            graph[u].add(new Edge(v, w));
            graph[v].add(new Edge(u, w));
        }
        
        PriorityQueue<PQNode> minHeap = new PriorityQueue<>();
        boolean[] visited = new boolean[n];
        List<int[]> mstEdges = new ArrayList<>();
        
        minHeap.add(new PQNode(0, 0, -1));
        int totalWeight = 0;
        int edgesCount = 0;
        
        while (!minHeap.isEmpty() && edgesCount < n) {
            PQNode current = minHeap.poll();
            int u = current.vertex;
            
            if (visited[u]) continue;
            
            visited[u] = true;
            totalWeight += current.weight;
            edgesCount++;
            
            if (current.parent != -1) {
                mstEdges.add(new int[]{current.parent, u, current.weight});
            }
            
            for (Edge edge : graph[u]) {
                if (!visited[edge.to]) {
                    minHeap.add(new PQNode(edge.weight, edge.to, u));
                }
            }
        }
        
        if (edgesCount == n) {
            List<int[]> result = new ArrayList<>();
            result.add(new int[]{totalWeight});
            result.addAll(mstEdges);
            return result;
        }
        return new ArrayList<>();
    }
    
    /**
     * Prim's for dense graphs - O(V^2)
     */
    public static int primMSTDense(int n, int[][] graph) {
        int[] dist = new int[n];
        boolean[] visited = new boolean[n];
        Arrays.fill(dist, Integer.MAX_VALUE);
        dist[0] = 0;
        
        int totalWeight = 0;
        
        for (int i = 0; i < n; i++) {
            // Find minimum distance vertex
            int u = -1;
            int minDist = Integer.MAX_VALUE;
            
            for (int v = 0; v < n; v++) {
                if (!visited[v] && dist[v] < minDist) {
                    minDist = dist[v];
                    u = v;
                }
            }
            
            if (u == -1) return -1;  // Disconnected
            
            visited[u] = true;
            totalWeight += minDist;
            
            // Update distances
            for (int v = 0; v < n; v++) {
                if (!visited[v] && graph[u][v] < dist[v]) {
                    dist[v] = graph[u][v];
                }
            }
        }
        
        return totalWeight;
    }
    
    public static void main(String[] args) {
        // Example 1
        int n1 = 4;
        int[][] edges1 = {{0, 1, 10}, {0, 2, 6}, {0, 3, 5}, {1, 3, 15}, {2, 3, 4}};
        
        System.out.println("Example 1: n=" + n1);
        System.out.println("MST Weight: " + primMST(n1, edges1));  // 19
        
        // Example 2
        List<int[]> result2 = primMSTEdges(n1, edges1);
        System.out.println("\nMST Edges:");
        System.out.print("[");
        for (int i = 1; i < result2.size(); i++) {
            int[] e = result2.get(i);
            System.out.print("[" + e[0] + "," + e[1] + "," + e[2] + "]");
            if (i < result2.size() - 1) System.out.print(", ");
        }
        System.out.println("]");
        System.out.println("Total Weight: " + result2.get(0)[0]);  // 19
        
        // Example 3: Disconnected
        int n2 = 3;
        int[][] edges2 = {{0, 1, 1}};
        System.out.println("\nDisconnected graph result: " + primMST(n2, edges2));  // -1
    }
}
```

<!-- slide -->
```javascript
/**
 * Prim's Algorithm for MST using Min-Heap
 * 
 * Time Complexity: O(E log V)
 * Space Complexity: O(V + E)
 */

class PrimMST {
    /**
     * Find MST weight using Prim's algorithm
     * @param {number} n - Number of vertices
     * @param {number[][]} edges - List of edges [u, v, weight]
     * @returns {number} Total MST weight, or -1 if disconnected
     */
    static primMST(n, edges) {
        if (n === 0) return 0;
        
        // Build adjacency list
        const graph = Array.from({ length: n }, () => []);
        for (const [u, v, w] of edges) {
            graph[u].push([v, w]);
            graph[v].push([u, w]);
        }
        
        // Min-heap using array with manual heapify
        // Each element: [weight, vertex, parent]
        const minHeap = [[0, 0, -1]];
        const visited = new Array(n).fill(false);
        let totalWeight = 0;
        let edgesCount = 0;
        
        while (minHeap.length > 0 && edgesCount < n) {
            // Extract minimum (since we use max-heap logic, reverse sort)
            minHeap.sort((a, b) => b[0] - a[0]);
            const [weight, u, parent] = minHeap.pop();
            
            if (visited[u]) continue;
            
            visited[u] = true;
            totalWeight += weight;
            edgesCount++;
            
            // Add all adjacent edges to unvisited vertices
            for (const [v, w] of graph[u]) {
                if (!visited[v]) {
                    minHeap.push([w, v, u]);
                }
            }
        }
        
        return edgesCount === n ? totalWeight : -1;
    }
    
    /**
     * Find MST with actual edges
     * @returns {{weight: number, edges: number[][]}}
     */
    static primMSTEdges(n, edges) {
        if (n === 0) return { weight: 0, edges: [] };
        
        const graph = Array.from({ length: n }, () => []);
        for (const [u, v, w] of edges) {
            graph[u].push([v, w]);
            graph[v].push([u, w]);
        }
        
        const minHeap = [[0, 0, -1]];
        const visited = new Array(n).fill(false);
        const mstEdges = [];
        let totalWeight = 0;
        let edgesCount = 0;
        
        while (minHeap.length > 0 && edgesCount < n) {
            minHeap.sort((a, b) => b[0] - a[0]);
            const [weight, u, parent] = minHeap.pop();
            
            if (visited[u]) continue;
            
            visited[u] = true;
            totalWeight += weight;
            edgesCount++;
            
            if (parent !== -1) {
                mstEdges.push([parent, u, weight]);
            }
            
            for (const [v, w] of graph[u]) {
                if (!visited[v]) {
                    minHeap.push([w, v, u]);
                }
            }
        }
        
        return edgesCount === n 
            ? { weight: totalWeight, edges: mstEdges }
            : { weight: -1, edges: [] };
    }
    
    /**
     * Prim's for dense graphs - O(V^2)
     * @param {number[][]} graph - Adjacency matrix
     */
    static primMSTDense(graph) {
        const n = graph.length;
        const dist = new Array(n).fill(Infinity);
        const visited = new Array(n).fill(false);
        
        dist[0] = 0;
        let totalWeight = 0;
        
        for (let i = 0; i < n; i++) {
            // Find minimum distance vertex
            let u = -1;
            let minDist = Infinity;
            
            for (let v = 0; v < n; v++) {
                if (!visited[v] && dist[v] < minDist) {
                    minDist = dist[v];
                    u = v;
                }
            }
            
            if (u === -1) return -1;  // Disconnected
            
            visited[u] = true;
            totalWeight += minDist;
            
            // Update distances
            for (let v = 0; v < n; v++) {
                if (!visited[v] && graph[u][v] < dist[v]) {
                    dist[v] = graph[u][v];
                }
            }
        }
        
        return totalWeight;
    }
}

// Example usage and demonstration
console.log("=".repeat(50));
console.log("Prim's Algorithm - MST Examples");
console.log("=".repeat(50));

// Example 1: Basic graph
const n1 = 4;
const edges1 = [[0, 1, 10], [0, 2, 6], [0, 3, 5], [1, 3, 15], [2, 3, 4]];

console.log(`\nExample 1: n=${n1}, edges=${JSON.stringify(edges1)}`);
console.log(`MST Weight: ${PrimMST.primMST(n1, edges1)}`);  // Output: 19

// Example 2: With edges
const result2 = PrimMST.primMSTEdges(n1, edges1);
console.log(`\nMST Edges: ${JSON.stringify(result2.edges)}`);
console.log(`Total Weight: ${result2.weight}`);  // Output: 19

// Example 3: Disconnected graph
const n2 = 3;
const edges2 = [[0, 1, 1]];
console.log(`\nDisconnected graph result: ${PrimMST.primMST(n2, edges2)}`);  // Output: -1

// Example 4: Larger graph
const n3 = 5;
const edges3 = [[0, 1, 2], [0, 3, 6], [1, 2, 3], [1, 3, 8], 
                [1, 4, 5], [2, 4, 7], [3, 4, 9]];
console.log(`\nExample 4: n=${n3}`);
console.log(`MST Weight: ${PrimMST.primMST(n3, edges3)}`);  // Output: 16

console.log("\n" + "=".repeat(50));
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **With Min-Heap** | O(E log V) | Each edge pushed/popped at most once |
| **With Fibonacci Heap** | O(E + V log V) | Optimal but complex implementation |
| **Dense Graph (Matrix)** | O(V²) | Simple implementation, no heap needed |
| **Space** | O(V + E) | Adjacency list + visited array + heap |

### Detailed Breakdown

- **Building adjacency list**: O(E)
- **Each vertex extraction**: O(log V) × V = O(V log V)
- **Each edge push**: O(log V) × E = O(E log V)
- **Total**: O(E log V + V log V) = O(E log V) (since E ≥ V-1)

---

## Space Complexity Analysis

- **Adjacency List**: O(V + E) - stores all edges
- **Visited Array**: O(V) - boolean array
- **Priority Queue**: O(E) - worst case contains all edges
- **Total**: O(V + E)

---

## Common Variations

### 1. Prim's with Fibonacci Heap

For theoretically optimal O(E + V log V) time:

````carousel
```python
import heapq
from collections import defaultdict

def prim_fibonacci(n, edges):
    """
    Prim's using adjacency list with potential for Fibonacci heap optimization.
    In Python, we simulate with heapq (O(E log V) in practice).
    """
    graph = defaultdict(list)
    for u, v, w in edges:
        graph[u].append((v, w))
        graph[v].append((u, w))
    
    # Key values for each vertex (minimum edge connecting to MST)
    key = [float('inf')] * n
    parent = [-1] * n
    in_mst = [False] * n
    
    key[0] = 0
    
    # Use list as min-heap with decrease-key simulation
    # (Python heapq doesn't support decrease-key directly)
    min_heap = [(0, 0)]  # (key, vertex)
    
    while min_heap:
        weight, u = heapq.heappop(min_heap)
        
        if in_mst[u]:
            continue
            
        in_mst[u] = True
        
        for v, w in graph[u]:
            if not in_mst[v] and w < key[v]:
                key[v] = w
                parent[v] = u
                heapq.heappush(min_heap, (w, v))
    
    total = sum(key[i] for i in range(1, n))
    return total if all(in_mst) else -1
```
````

### 2. Prim's for Directed Graphs (Chu-Liu/Edmonds)

For minimum spanning arborescents in directed graphs:

````carousel
```python
def edmonds(n, edges, root):
    """
    Chu-Liu/Edmonds algorithm for minimum directed spanning tree.
    Simplified version - finds minimum arborescence rooted at root.
    """
    # This is a placeholder - full implementation is complex
    # Useful for directed MST problems
    pass
```
````

### 3. Parallel Prim's

For multi-threaded or GPU implementations:

- Process multiple edges simultaneously
- Use concurrent data structures
- Useful for very large graphs

### 4. Lazy vs Eager Prim's

- **Lazy**: Push all edges, filter when popping (simpler, more memory)
- **Eager**: Use decrease-key operation (more efficient, complex implementation)

---

## Practice Problems

### Problem 1: Minimum Cost to Connect All Points

**Problem:** [LeetCode 1584 - Min Cost to Connect All Points](https://leetcode.com/problems/min-cost-to-connect-all-points/)

**Description:** You are given an array `points` representing integer coordinates. Return the minimum total length to connect all points.

**How to Apply Prim's:**
- Build complete graph where weight = Manhattan distance
- Use Prim's algorithm to find MST
- Works because distance satisfies triangle inequality

---

### Problem 2: Number of Operations to Make Network Connected

**Problem:** [LeetCode 1319 - Number of Operations to Make Network Connected](https://leetcode.com/problems/number-of-operations-to-make-network-connected/)

**Description:** Make all computers connected with minimum operations.

**How to Apply Prim's:**
- This uses Union-Find (related graph concept)
- Find number of connected components
- Minimum moves = components - 1

---

### Problem 3: Find the City With the Smallest Number of Neighbors

**Problem:** [LeetCode 1334 - Find the City With the Smallest Number of Neighbors at a Threshold Distance](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/)

**Description:** Find city with fewest reachable cities within distance threshold.

**How to Apply Prim's:**
- Use modified MST or Dijkstra variants
- Find all pairs within threshold
- Count reachable nodes

---

### Problem 4: Optimize Water Distribution

**Problem:** [LeetCode 1168 - Optimize Water Distribution in a Village](https://leetcode.com/problems/optimize-water-distribution-in-a-village/)

**Description:** Build water pipes to supply water to all houses with minimum cost.

**How to Apply Prim's:**
- Add virtual source (water warehouse) with edge weights = house cost
- Find MST including virtual source
- Classic "MST with virtual node" pattern

---

### Problem 5: Connecting Cities With Minimum Cost

**Problem:** [LeetCode 1135 - Connecting Cities With Minimum Cost](https://leetcode.com/problems/connecting-cities-with-minimum-cost/)

**Description:** Connect N cities with minimum cost using Kruskal's or Prim's.

**How to Apply Prim's:**
- Direct application of MST
- Build edges from input connections
- Return -1 if not all cities can be connected

---

## Video Tutorial Links

### Fundamentals

- [Prim's Algorithm - Introduction (Take U Forward)](https://www.youtube.com/watch?v=msttfZySq7w) - Comprehensive introduction
- [Prim's Algorithm Visualization (WilliamFiset)](https://www.youtube.com/watch?v=Maa_DZVE1j0) - Detailed visualization
- [MST - Prim & Kruskal (NeetCode)](https://www.youtube.com/watch?v=4f1E4y0I7-0) - Compare both algorithms

### Advanced Topics

- [Fibonacci Heap Prim's](https://www.youtube.com/watch?v=puX76-r9tD0) - Optimal implementation
- [Prim's vs Kruskal's](https://www.youtube.com/watch?v=71cU2L4Z7i4) - When to use which
- [Network Design Applications](https://www.youtube.com/watch?v=x6CBn2zOzT0) - Real-world applications

---

## Follow-up Questions

### Q1: What is the difference between Prim's and Kruskal's algorithms?

**Answer:** Both find MST but with different approaches:
- **Kruskal's**: Sort all edges, add smallest that doesn't form cycle (uses Union-Find)
- **Prim's**: Grow tree from a starting vertex using cut property
- **Complexity**: Both O(E log V) typically; Prim's better for dense graphs, Kruskal's for sparse

### Q2: Can Prim's algorithm handle negative edge weights?

**Answer:** Yes! Prim's works correctly with negative weights as long as:
- No negative cycles exist (otherwise MST is undefined)
- The algorithm naturally handles negatives since we always pick minimum

### Q3: What happens if the graph is disconnected?

**Answer:** Prim's algorithm will:
- Process all reachable vertices
- Eventually exhaust the heap without reaching all vertices
- Return -1 or indicate no complete MST exists
- This is correct: disconnected graphs have no spanning tree

### Q4: How does Prim's compare to Dijkstra's?

**Answer:** They look similar but have key differences:
- **Dijkstra**: Minimizes distance from source to each vertex
- **Prim**: Minimizes edge weight connecting to MST
- Both use greedy + priority queue approach
- Different relaxation: Dijkstra updates dist[v] = min(dist[v], dist[u] + weight)

### Q5: When should you use the dense graph version of Prim's?

**Answer:** Use O(V²) matrix version when:
- Graph is dense (E ≈ V²)
- Memory for adjacency list is a concern
- Simpler implementation is preferred
- Graph is small enough that O(V²) is acceptable

---

## Summary

Prim's algorithm is a fundamental **greedy algorithm** for finding the **Minimum Spanning Tree** in weighted undirected graphs. Key takeaways:

- **Greedy approach**: Always pick minimum weight edge crossing the cut
- **Time complexity**: O(E log V) with heap, O(V²) with matrix
- **Space complexity**: O(V + E)
- **Works for**: Connected undirected graphs with weighted edges
- **Applications**: Network design, clustering, image segmentation

When to use:
- ✅ Finding MST in undirected weighted graphs
- ✅ Network optimization problems
- ✅ When you need a starting point/root
- ✅ Dense graphs (use Prim's over Kruskal's)

When not to use:
- ❌ Directed graphs (use Chu-Liu/Edmonds)
- ❌ Disconnected graphs (no MST exists)
- ❌ Very sparse graphs with sorted edges (Kruskal's may be simpler)

This algorithm is essential for competitive programming and technical interviews, especially in graph-related optimization problems.

---

## Related Algorithms

- [Kruskal's Algorithm](./kruskals.md) - Alternative MST algorithm
- [Dijkstra's Algorithm](./dijkstras.md) - Shortest path (similar structure)
- [Bellman-Ford](./bellman-ford.md) - Shortest path with negative weights
- [Union-Find](./union-by-rank.md) - Used in Kruskal's algorithm
