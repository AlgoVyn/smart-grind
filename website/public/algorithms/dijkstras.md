# Dijkstra's Algorithm

## Category
Graphs

## Description

Dijkstra's algorithm finds the **shortest path** from a source vertex to all other vertices in a weighted graph with **non-negative edge weights**. It is a fundamental greedy algorithm that uses a priority queue (min-heap) to always process the vertex with the smallest known distance first. This algorithm is the backbone of many navigation systems, network routing protocols, and pathfinding applications.

---

## When to Use

Use Dijkstra's algorithm when you need to solve problems involving:

- **Shortest Path in Weighted Graphs**: Finding the minimum cost path between nodes
- **Non-Negative Weights**: When all edge weights are ≥ 0 (for negative weights, use Bellman-Ford)
- **Single Source Shortest Path**: Finding distances from one source to all other nodes
- **Navigation Systems**: GPS, maps, and route planning
- **Network Routing**: Finding optimal routes in computer networks
- **Resource Allocation**: Finding minimum cost paths in transportation/logistics

### Comparison with Alternatives

| Algorithm | Time Complexity | Edge Weight Constraint | Use Case |
|-----------|----------------|------------------------|----------|
| **Dijkstra's** | O((V + E) log V) | Non-negative only | Single-source shortest path, dense graphs |
| **Bellman-Ford** | O(V × E) | All weights | Negative weights, negative cycle detection |
| **Floyd-Warshall** | O(V³) | All weights | All-pairs shortest path, small graphs |
| **BFS (unweighted)** | O(V + E) | Unit weights | Unweighted graphs, shortest path in terms of edges |
| **A* Search** | O(E) average | Non-negative | Heuristic-guided shortest path, games |

### When to Choose Dijkstra's vs Other Algorithms

- **Choose Dijkstra's** when:
  - Edge weights are non-negative
  - You need single-source shortest paths
  - You want better performance than Bellman-Ford
  - The graph is sparse (E ≈ V)

- **Choose Bellman-Ford** when:
  - Graph may have negative edge weights
  - You need to detect negative weight cycles
  - You're unsure about edge weight signs

- **Choose Floyd-Warshall** when:
  - You need all-pairs shortest paths
  - Graph is small (V ≤ 500)
  - Multiple queries for different source-destination pairs

- **Choose A*** when:
  - You have a good heuristic function
  - You're finding path to a specific target (not all nodes)
  - Game pathfinding or robotics

---

## Algorithm Explanation

### Core Concept

Dijkstra's algorithm works on the principle of **greedy selection** and **relaxation**. At each step, it selects the unvisited vertex with the smallest known distance from the source, then attempts to find shorter paths to its neighbors through relaxation.

### How It Works

#### Initialization Phase:
1. Set distance to source = 0, all other vertices = infinity (∞)
2. Create a min-heap (priority queue) containing (distance, vertex) pairs
3. Mark all vertices as unvisited

#### Main Algorithm Loop:
1. **Extract Minimum**: Remove vertex with smallest distance from heap
2. **Termination Check**: If heap is empty or all reachable vertices visited, stop
3. **Relaxation**: For each neighbor of current vertex:
   - Calculate new distance = current_distance + edge_weight
   - If new distance < known distance, update and add to heap
4. Repeat until heap is empty

#### Why the Greedy Approach Works

The algorithm makes a greedy choice: once we extract a vertex with the minimum distance from the priority queue, that distance is **final** and cannot be improved later. Here's why:

- All edge weights are non-negative
- Any alternative path to this vertex must go through an unvisited vertex
- All unvisited vertices have distance ≥ current distance (by heap property)
- Therefore, no alternative path can be shorter

### Visual Representation

```
Graph:                    Step-by-step distances from source 0:
                         
    4                      Step 0: dist[0]=0, others=∞
   / \                    
  1   2                   Step 1: Extract 0, relax neighbors
  |   |                   → dist[1]=4, dist[2]=1
  3   3                   
                           Step 2: Extract 2 (min), relax neighbors  
                          → dist[1]=3 (improved!), dist[3]=9
                           Step 3: Extract 1 (min), relax neighbors
                          → dist[3]=6 (improved!)
                           Step 4: Extract 3 (min), done
                           
Final: {0:0, 1:3, 2:1, 3:6}
```

### Key Terminology

- **Relaxation**: The process of checking if going through the current vertex gives a shorter path to a neighbor
- **Priority Queue**: A data structure that always returns the element with highest (or lowest) priority
- **Min-Heap**: A complete binary tree where each parent node is smaller than its children (used for priority queue)
- **Infinity**: A large value (e.g., `float('inf')` in Python) representing unreachable vertices

### Limitations

- **Does NOT work with negative edge weights**: Can produce incorrect results
- **Does NOT detect negative cycles**: Unlike Bellman-Ford
- **Can be slow for very large graphs**: Consider A* with heuristics for specific targets

---

## Algorithm Steps

### Complete Step-by-Step Approach

1. **Validate Input**
   - Check if graph is empty or source is valid
   - Ensure all edge weights are non-negative

2. **Initialize Data Structures**
   - Create distance array: source = 0, others = ∞
   - Create min-heap: push (0, source)
   - Create visited set (optional, can use distance comparison)

3. **Process Vertices**
   - While heap is not empty:
     a. Pop vertex with minimum distance
     b. Skip if current distance > known distance (stale entry)
     c. For each neighbor:
        - Calculate potential new distance
        - If shorter, update distance and push to heap

4. **Return Results**
   - Return the distance dictionary
   - Optionally: maintain parent array for path reconstruction

5. **Path Reconstruction (Optional)**
   - Track parent of each vertex when updating distances
   - Backtrack from target to source to reconstruct path

---

## Implementation

### Template Code (Dijkstra's Shortest Path)

````carousel
```python
import heapq
from collections import defaultdict
from typing import Dict, List, Tuple, Optional

def dijkstra(graph: Dict[int, List[Tuple[int, int]]], source: int) -> Dict[int, float]:
    """
    Dijkstra's Shortest Path Algorithm
    
    Time Complexity: O((V + E) log V)
    Space Complexity: O(V)
    
    Args:
        graph: Adjacency list {vertex: [(neighbor, weight), ...]}
        source: Starting vertex index
    
    Returns:
        Dictionary mapping each vertex to its shortest distance from source
    
    Note: Works only for non-negative edge weights!
    """
    # Initialize distances
    distances = {vertex: float('inf') for vertex in graph}
    distances[source] = 0
    
    # Min-heap: (distance, vertex)
    # heapq is a min-heap in Python
    heap = [(0, source)]
    
    # Track visited (optional optimization)
    visited = set()
    
    while heap:
        curr_dist, current = heapq.heappop(heap)
        
        # Skip if already processed or stale entry
        if current in visited:
            continue
        visited.add(current)
        
        # Skip if we've already found a shorter path
        if curr_dist > distances[current]:
            continue
        
        # Explore all neighbors
        for neighbor, weight in graph.get(current, []):
            # Skip negative weights (use Bellman-Ford instead)
            if weight < 0:
                continue
                
            distance = curr_dist + weight
            
            # Relaxation: found shorter path?
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                heapq.heappush(heap, (distance, neighbor))
    
    return distances


def dijkstra_with_path(graph: Dict[int, List[Tuple[int, int]]], source: int) -> Tuple[Dict[int, float], Dict[int, int]]:
    """
    Dijkstra's algorithm with path reconstruction.
    
    Returns:
        Tuple of (distances, parent_map)
        To reconstruct path: backtrack from target using parent_map
    """
    distances = {vertex: float('inf') for vertex in graph}
    distances[source] = 0
    
    # Parent map for path reconstruction: child -> parent
    parent = {source: None}
    
    heap = [(0, source)]
    visited = set()
    
    while heap:
        curr_dist, current = heapq.heappop(heap)
        
        if current in visited:
            continue
        visited.add(current)
        
        if curr_dist > distances[current]:
            continue
        
        for neighbor, weight in graph.get(current, []):
            if weight < 0:
                continue
                
            distance = curr_dist + weight
            
            if distance < distances[neighbor]:
                distances[neighbor] = distance
                parent[neighbor] = current
                heapq.heappush(heap, (distance, neighbor))
    
    return distances, parent


def reconstruct_path(parent: Dict[int, Optional[int]], source: int, target: int) -> List[int]:
    """Reconstruct path from source to target using parent map."""
    if target not in parent:
        return []  # No path exists
    
    path = []
    current = target
    
    while current is not None:
        path.append(current)
        current = parent[current]
    
    path.reverse()
    return path if path[0] == source else []


# Example usage and demonstration
if __name__ == "__main__":
    # Build graph (adjacency list)
    #     4
    #    / \
    #   1---2
    #    \ /
    #     3
    graph = defaultdict(list)
    graph[0] = [(1, 4), (2, 1)]      # 0 -> 1 (4), 0 -> 2 (1)
    graph[1] = [(0, 4), (2, 2), (3, 5)]  # 1 -> 0, 2, 3
    graph[2] = [(0, 1), (1, 2), (3, 8)]  # 2 -> 0, 1, 3
    graph[3] = [(1, 5), (2, 8)]      # 3 -> 1, 2
    
    # Find shortest paths from vertex 0
    print("=" * 50)
    print("Dijkstra's Algorithm Demonstration")
    print("=" * 50)
    
    distances = dijkstra(graph, 0)
    print("\nShortest paths from vertex 0:")
    for vertex, dist in sorted(distances.items()):
        print(f"  To {vertex}: {dist}")
    
    # With path reconstruction
    distances, parent = dijkstra_with_path(graph, 0)
    
    print("\nPaths from vertex 0:")
    for target in sorted(graph.keys()):
        path = reconstruct_path(parent, 0, target)
        path_str = " -> ".join(map(str, path))
        print(f"  To {target}: {path_str} (cost: {distances[target]})")
    
    # Output: {0: 0, 1: 3, 2: 1, 3: 6}
    # Path to 1: 0 -> 2 -> 1 (1 + 2 = 3)
    # Path to 3: 0 -> 2 -> 1 -> 3 (1 + 2 + 3 = 6) or 0 -> 2 -> 3 (1 + 8 = 9)
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <limits>
#include <utility>
#include <unordered_map>
using namespace std;

/**
 * Dijkstra's Shortest Path Algorithm
 * 
 * Time Complexity: O((V + E) log V)
 * Space Complexity: O(V)
 */

typedef pair<int, int> pii;  // (distance, vertex)
typedef pair<int, pii> edge; // (weight, (from, to))

/**
 * Dijkstra's algorithm using adjacency list
 * @param graph: vector of vector of (neighbor, weight) pairs
 * @param source: starting vertex index
 * @return: vector of shortest distances from source
 */
vector<int> dijkstra(const vector<vector<pair<int, int>>>& graph, int source) {
    int n = graph.size();
    const int INF = numeric_limits<int>::max();
    
    // Initialize distances
    vector<int> dist(n, INF);
    dist[source] = 0;
    
    // Min-heap: (distance, vertex)
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    pq.push({0, source});
    
    // Track visited vertices
    vector<bool> visited(n, false);
    
    while (!pq.empty()) {
        auto [currDist, current] = pq.top();
        pq.pop();
        
        // Skip if already visited or stale entry
        if (visited[current]) continue;
        visited[current] = true;
        
        if (currDist > dist[current]) continue;
        
        // Explore all neighbors
        for (auto [neighbor, weight] : graph[current]) {
            // Skip negative weights
            if (weight < 0) continue;
            
            int newDist = currDist + weight;
            
            // Relaxation
            if (newDist < dist[neighbor]) {
                dist[neighbor] = newDist;
                pq.push({newDist, neighbor});
            }
        }
    }
    
    return dist;
}

/**
 * Dijkstra's algorithm with path reconstruction
 * Returns pair of (distances, parent map)
 */
pair<vector<int>, vector<int>> dijkstraWithPath(const vector<vector<pair<int, int>>>& graph, int source) {
    int n = graph.size();
    const int INF = numeric_limits<int>::max();
    
    vector<int> dist(n, INF);
    vector<int> parent(n, -1);
    dist[source] = 0;
    
    priority_queue<pii, vector<pii>, greater<pii>> pq;
    pq.push({0, source});
    
    vector<bool> visited(n, false);
    
    while (!pq.empty()) {
        auto [currDist, current] = pq.top();
        pq.pop();
        
        if (visited[current]) continue;
        visited[current] = true;
        
        if (currDist > dist[current]) continue;
        
        for (auto [neighbor, weight] : graph[current]) {
            if (weight < 0) continue;
            
            int newDist = currDist + weight;
            
            if (newDist < dist[neighbor]) {
                dist[neighbor] = newDist;
                parent[neighbor] = current;
                pq.push({newDist, neighbor});
            }
        }
    }
    
    return {dist, parent};
}

/**
 * Reconstruct path from source to target
 */
vector<int> reconstructPath(const vector<int>& parent, int source, int target) {
    if (parent[target] == -1 && target != source) return {};
    
    vector<int> path;
    int current = target;
    
    while (current != -1) {
        path.push_back(current);
        if (current == source) break;
        current = parent[current];
    }
    
    reverse(path.begin(), path.end());
    return path;
}


int main() {
    // Build graph (adjacency list)
    //     4
    //    / \
    //   1---2
    //    \ /
    //     3
    int n = 4;
    vector<vector<pair<int, int>>> graph(n);
    
    graph[0] = {{1, 4}, {2, 1}};      // 0 -> 1 (4), 0 -> 2 (1)
    graph[1] = {{0, 4}, {2, 2}, {3, 5}};  // 1 -> 0, 2, 3
    graph[2] = {{0, 1}, {1, 2}, {3, 8}};  // 2 -> 0, 1, 3
    graph[3] = {{1, 5}, {2, 8}};      // 3 -> 1, 2
    
    cout << "==================================================" << endl;
    cout << "Dijkstra's Algorithm Demonstration" << endl;
    cout << "==================================================" << endl;
    
    // Find shortest paths from vertex 0
    vector<int> distances = dijkstra(graph, 0);
    
    cout << "\nShortest paths from vertex 0:" << endl;
    for (int i = 0; i < n; i++) {
        cout << "  To " << i << ": " << distances[i] << endl;
    }
    
    // With path reconstruction
    auto [dist, parent] = dijkstraWithPath(graph, 0);
    
    cout << "\nPaths from vertex 0:" << endl;
    for (int target = 0; target < n; target++) {
        vector<int> path = reconstructPath(parent, 0, target);
        cout << "  To " << target << ": ";
        for (size_t i = 0; i < path.size(); i++) {
            cout << path[i];
            if (i < path.size() - 1) cout << " -> ";
        }
        cout << " (cost: " << dist[target] << ")" << endl;
    }
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Dijkstra's Shortest Path Algorithm
 * 
 * Time Complexity: O((V + E) log V)
 * Space Complexity: O(V)
 */
public class Dijkstra {
    
    /**
     * Dijkstra's algorithm using adjacency list
     * @param graph: Map of vertex to list of (neighbor, weight) pairs
     * @param source: starting vertex
     * @return: Map of shortest distances from source
     */
    public static Map<Integer, Integer> dijkstra(Map<Integer, List<int[]>> graph, int source) {
        // Initialize distances
        Map<Integer, Integer> dist = new HashMap<>();
        for (Integer vertex : graph.keySet()) {
            dist.put(vertex, Integer.MAX_VALUE);
        }
        dist.put(source, 0);
        
        // Min-heap: (distance, vertex)
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        pq.add(new int[]{0, source});
        
        // Track visited vertices
        Set<Integer> visited = new HashSet<>();
        
        while (!pq.isEmpty()) {
            int[] current = pq.poll();
            int currDist = current[0];
            int currentVertex = current[1];
            
            // Skip if already visited or stale entry
            if (visited.contains(currentVertex)) continue;
            visited.add(currentVertex);
            
            if (currDist > dist.get(currentVertex)) continue;
            
            // Explore all neighbors
            List<int[]> neighbors = graph.getOrDefault(currentVertex, Collections.emptyList());
            for (int[] edge : neighbors) {
                int neighbor = edge[0];
                int weight = edge[1];
                
                // Skip negative weights
                if (weight < 0) continue;
                
                int newDist = currDist + weight;
                
                // Relaxation
                if (newDist < dist.get(neighbor)) {
                    dist.put(neighbor, newDist);
                    pq.add(new int[]{newDist, neighbor});
                }
            }
        }
        
        return dist;
    }
    
    /**
     * Dijkstra's algorithm with path reconstruction
     * Returns pair of (distances, parent map)
     */
    public static Pair<Map<Integer, Integer>, Map<Integer, Integer>> dijkstraWithPath(
            Map<Integer, List<int[]>> graph, int source) {
        
        Map<Integer, Integer> dist = new HashMap<>();
        Map<Integer, Integer> parent = new HashMap<>();
        
        for (Integer vertex : graph.keySet()) {
            dist.put(vertex, Integer.MAX_VALUE);
        }
        dist.put(source, 0);
        parent.put(source, null);
        
        PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[0]));
        pq.add(new int[]{0, source});
        
        Set<Integer> visited = new HashSet<>();
        
        while (!pq.isEmpty()) {
            int[] current = pq.poll();
            int currDist = current[0];
            int currentVertex = current[1];
            
            if (visited.contains(currentVertex)) continue;
            visited.add(currentVertex);
            
            if (currDist > dist.get(currentVertex)) continue;
            
            List<int[]> neighbors = graph.getOrDefault(currentVertex, Collections.emptyList());
            for (int[] edge : neighbors) {
                int neighbor = edge[0];
                int weight = edge[1];
                
                if (weight < 0) continue;
                
                int newDist = currDist + weight;
                
                if (newDist < dist.get(neighbor)) {
                    dist.put(neighbor, newDist);
                    parent.put(neighbor, currentVertex);
                    pq.add(new int[]{newDist, neighbor});
                }
            }
        }
        
        return new Pair<>(dist, parent);
    }
    
    /**
     * Reconstruct path from source to target
     */
    public static List<Integer> reconstructPath(Map<Integer, Integer> parent, int source, int target) {
        if (!parent.containsKey(target)) return Collections.emptyList();
        
        List<Integer> path = new ArrayList<>();
        Integer current = target;
        
        while (current != null) {
            path.add(current);
            if (current == source) break;
            current = parent.get(current);
        }
        
        Collections.reverse(path);
        return path;
    }
    
    // Simple Pair class since Java doesn't have built-in Pair
    static class Pair<K, V> {
        K key;
        V value;
        Pair(K key, V value) { this.key = key; this.value = value; }
        K getKey() { return key; }
        V getValue() { return value; }
    }
    
    public static void main(String[] args) {
        // Build graph (adjacency list)
        Map<Integer, List<int[]>> graph = new HashMap<>();
        
        graph.put(0, Arrays.asList(new int[]{1, 4}, new int[]{2, 1}));
        graph.put(1, Arrays.asList(new int[]{0, 4}, new int[]{2, 2}, new int[]{3, 5}));
        graph.put(2, Arrays.asList(new int[]{0, 1}, new int[]{1, 2}, new int[]{3, 8}));
        graph.put(3, Arrays.asList(new int[]{1, 5}, new int[]{2, 8}));
        
        System.out.println("==================================================");
        System.out.println("Dijkstra's Algorithm Demonstration");
        System.out.println("==================================================");
        
        // Find shortest paths from vertex 0
        Map<Integer, Integer> distances = dijkstra(graph, 0);
        
        System.out.println("\nShortest paths from vertex 0:");
        for (Integer vertex : Arrays.asList(0, 1, 2, 3)) {
            System.out.println("  To " + vertex + ": " + distances.get(vertex));
        }
        
        // With path reconstruction
        Pair<Map<Integer, Integer>, Map<Integer, Integer>> result = dijkstraWithPath(graph, 0);
        Map<Integer, Integer> dist = result.getKey();
        Map<Integer, Integer> parent = result.getValue();
        
        System.out.println("\nPaths from vertex 0:");
        for (int target = 0; target <= 3; target++) {
            List<Integer> path = reconstructPath(parent, 0, target);
            System.out.print("  To " + target + ": ");
            System.out.println(String.join(" -> ", path.stream()
                .map(String::valueOf)
                .toArray(String[]::new)) + " (cost: " + dist.get(target) + ")");
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Dijkstra's Shortest Path Algorithm
 * 
 * Time Complexity: O((V + E) log V)
 * Space Complexity: O(V)
 */

/**
 * Dijkstra's algorithm using adjacency list
 * @param {Map<number, Array<[number, number]>>} graph - Adjacency list {vertex: [[neighbor, weight], ...]}
 * @param {number} source - Starting vertex
 * @returns {Map<number, number>} Map of shortest distances from source
 */
function dijkstra(graph, source) {
    // Initialize distances
    const dist = new Map();
    for (const [vertex] of graph) {
        dist.set(vertex, Infinity);
    }
    dist.set(source, 0);
    
    // Min-heap using custom implementation or use built-in with custom comparison
    // Using a simple array with sorting for clarity (not most efficient)
    // For production, use a proper priority queue library
    const heap = [[0, source]];
    
    // Track visited vertices
    const visited = new Set();
    
    while (heap.length > 0) {
        // Extract minimum (inefficient for large graphs - use proper heap)
        heap.sort((a, b) => a[0] - b[0]);
        const [currDist, current] = heap.shift();
        
        // Skip if already visited or stale entry
        if (visited.has(current)) continue;
        visited.add(current);
        
        if (currDist > dist.get(current)) continue;
        
        // Explore all neighbors
        const neighbors = graph.get(current) || [];
        for (const [neighbor, weight] of neighbors) {
            // Skip negative weights
            if (weight < 0) continue;
            
            const newDist = currDist + weight;
            
            // Relaxation
            if (newDist < dist.get(neighbor)) {
                dist.set(neighbor, newDist);
                heap.push([newDist, neighbor]);
            }
        }
    }
    
    return dist;
}

/**
 * Dijkstra's algorithm with path reconstruction
 * @returns {Object} {distances, parent}
 */
function dijkstraWithPath(graph, source) {
    const dist = new Map();
    const parent = new Map();
    
    for (const [vertex] of graph) {
        dist.set(vertex, Infinity);
    }
    dist.set(source, 0);
    parent.set(source, null);
    
    const heap = [[0, source]];
    const visited = new Set();
    
    while (heap.length > 0) {
        heap.sort((a, b) => a[0] - b[0]);
        const [currDist, current] = heap.shift();
        
        if (visited.has(current)) continue;
        visited.add(current);
        
        if (currDist > dist.get(current)) continue;
        
        const neighbors = graph.get(current) || [];
        for (const [neighbor, weight] of neighbors) {
            if (weight < 0) continue;
            
            const newDist = currDist + weight;
            
            if (newDist < dist.get(neighbor)) {
                dist.set(neighbor, newDist);
                parent.set(neighbor, current);
                heap.push([newDist, neighbor]);
            }
        }
    }
    
    return { distances: dist, parent };
}

/**
 * Reconstruct path from source to target
 * @param {Map<number, number|null>} parent - Parent map
 * @param {number} source - Source vertex
 * @param {number} target - Target vertex
 * @returns {number[]} Path from source to target
 */
function reconstructPath(parent, source, target) {
    if (!parent.has(target)) return [];
    
    const path = [];
    let current = target;
    
    while (current !== null && current !== undefined) {
        path.push(current);
        if (current === source) break;
        current = parent.get(current);
    }
    
    return path.reverse();
}

// Min-Heap Priority Queue implementation for better performance
class MinHeap {
    constructor() {
        this.heap = [];
    }
    
    push(item) {
        this.heap.push(item);
        this.bubbleUp(this.heap.length - 1);
    }
    
    pop() {
        if (this.heap.length === 0) return null;
        if (this.heap.length === 1) return this.heap.pop();
        
        const min = this.heap[0];
        this.heap[0] = this.heap.pop();
        this.bubbleDown(0);
        return min;
    }
    
    isEmpty() {
        return this.heap.length === 0;
    }
    
    bubbleUp(index) {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);
            if (this.heap[parentIndex][0] <= this.heap[index][0]) break;
            [this.heap[parentIndex], this.heap[index]] = [this.heap[index], this.heap[parentIndex]];
            index = parentIndex;
        }
    }
    
    bubbleDown(index) {
        const length = this.heap.length;
        while (true) {
            const leftChild = 2 * index + 1;
            const rightChild = 2 * index + 2;
            let smallest = index;
            
            if (leftChild < length && this.heap[leftChild][0] < this.heap[smallest][0]) {
                smallest = leftChild;
            }
            if (rightChild < length && this.heap[rightChild][0] < this.heap[smallest][0]) {
                smallest = rightChild;
            }
            if (smallest === index) break;
            
            [this.heap[smallest], this.heap[index]] = [this.heap[index], this.heap[smallest]];
            index = smallest;
        }
    }
}

/**
 * Optimized Dijkstra using MinHeap
 */
function dijkstraOptimized(graph, source) {
    const dist = new Map();
    for (const [vertex] of graph) {
        dist.set(vertex, Infinity);
    }
    dist.set(source, 0);
    
    const heap = new MinHeap();
    heap.push([0, source]);
    
    const visited = new Set();
    
    while (!heap.isEmpty()) {
        const [currDist, current] = heap.pop();
        
        if (visited.has(current)) continue;
        visited.add(current);
        
        if (currDist > dist.get(current)) continue;
        
        const neighbors = graph.get(current) || [];
        for (const [neighbor, weight] of neighbors) {
            if (weight < 0) continue;
            
            const newDist = currDist + weight;
            
            if (newDist < dist.get(neighbor)) {
                dist.set(neighbor, newDist);
                heap.push([newDist, neighbor]);
            }
        }
    }
    
    return dist;
}


// Example usage and demonstration
// Build graph (adjacency list)
//     4
//    / \
//   1---2
//    \ /
//     3

const graph = new Map();
graph.set(0, [[1, 4], [2, 1]]);
graph.set(1, [[0, 4], [2, 2], [3, 5]]);
graph.set(2, [[0, 1], [1, 2], [3, 8]]);
graph.set(3, [[1, 5], [2, 8]]);

console.log("=".repeat(50));
console.log("Dijkstra's Algorithm Demonstration");
console.log("=".repeat(50));

// Find shortest paths from vertex 0
const distances = dijkstra(graph, 0);

console.log("\nShortest paths from vertex 0:");
for (const [vertex, dist] of distances) {
    console.log(`  To ${vertex}: ${dist}`);
}

// With path reconstruction
const { distances: distMap, parent } = dijkstraWithPath(graph, 0);

console.log("\nPaths from vertex 0:");
for (const target of [0, 1, 2, 3]) {
    const path = reconstructPath(parent, 0, target);
    console.log(`  To ${target}: ${path.join(" -> ")} (cost: ${distMap.get(target)})`);
}
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Build + Query** | O((V + E) log V) | Standard implementation with min-heap |
| **With Binary Heap** | O((V + E) log V) | Most common implementation |
| **With Fibonacci Heap** | O(E + V log V) | Better theoretical complexity for sparse graphs |
| **Space** | O(V) | For distance array and priority queue |

### Detailed Breakdown

- **Vertex Processing**: Each vertex is extracted at most once → O(V log V)
- **Edge Relaxation**: Each edge is examined at most once → O(E log V) for heap operations
- **Total**: O((V + E) log V) ≈ O(E log V) for connected graphs (E ≥ V)

### Optimization Notes

- Use **Fibonacci Heap** for theoretical O(E + V log V) improvement (rarely needed in practice)
- Use **array-based heap** for small graphs
- Early termination when target reached (for single-target queries)

---

## Space Complexity Analysis

| Data Structure | Space | Description |
|---------------|-------|-------------|
| **Distance Array** | O(V) | Stores shortest distances |
| **Priority Queue** | O(V) | Maximum size during execution |
| **Visited Set** | O(V) | Optional, can use distance comparison |
| **Parent Map** | O(V) | For path reconstruction |
| **Total** | O(V) | Main space complexity |

### Space Optimization

- Use distance comparison instead of visited set (saves O(V))
- For path reconstruction, only store parent of each vertex
- Use sparse arrays when vertex IDs are not contiguous

---

## Common Variations

### 1. Bidirectional Dijkstra

Run Dijkstra from both source and target, meeting in the middle. Useful when you only need one destination.

````carousel
```python
def bidirectional_dijkstra(graph, source, target):
    """Bidirectional Dijkstra - faster for single destination queries."""
    if source == target: return 0
    
    # Forward search from source
    dist_forward = {source: 0}
    heap_forward = [(0, source)]
    
    # Backward search from target  
    dist_backward = {target: 0}
    heap_backward = [(0, target)]
    
    best_dist = float('inf')
    
    while heap_forward and heap_backward:
        # Expand forward
        if heap_forward:
            d_f, u = heapq.heappop(heap_forward)
            if u in dist_backward:
                best_dist = min(best_dist, d_f + dist_backward[u])
            if d_f > best_dist: break
            for v, w in graph.get(u, []):
                nd = d_f + w
                if nd < dist_forward.get(v, float('inf')):
                    dist_forward[v] = nd
                    heapq.heappush(heap_forward, (nd, v))
        
        # Expand backward
        if heap_backward:
            d_b, u = heapq.heappop(heap_backward)
            if u in dist_forward:
                best_dist = min(best_dist, d_b + dist_forward[u])
            if d_b > best_dist: break
            for v, w in graph.get(u, []):
                nd = d_b + w
                if nd < dist_backward.get(v, float('inf')):
                    dist_backward[v] = nd
                    heapq.heappush(heap_backward, (nd, v))
    
    return best_dist
```
````

### 2. 0-1 BFS (Special Case)

When all edge weights are 0 or 1, use deque for O(V + E).

````carousel
```python
def zero_one_bfs(graph, source):
    """0-1 BFS for graphs with edge weights 0 or 1."""
    from collections import deque
    
    dist = {v: float('inf') for v in graph}
    dist[source] = 0
    
    dq = deque([source])
    
    while dq:
        current = dq.popleft()
        
        for neighbor, weight in graph.get(current, []):
            if weight not in (0, 1):
                raise ValueError("Only 0-1 weights allowed")
            
            new_dist = dist[current] + weight
            
            if new_dist < dist[neighbor]:
                dist[neighbor] = new_dist
                if weight == 0:
                    dq.appendleft(neighbor)
                else:
                    dq.append(neighbor)
    
    return dist
```
````

### 3. Dial's Algorithm (Bucket Dijkstra)

For small integer weights, use bucket-based approach for O(V + E + C) where C is max weight.

### 4. Multi-Source Dijkstra

Run Dijkstra from multiple sources simultaneously to find nearest source for each vertex.

---

## Practice Problems

### Problem 1: Network Delay Time

**Problem:** [LeetCode 743 - Network Delay Time](https://leetcode.com/problems/network-delay-time/)

**Description:** You are given a network of `n` nodes labeled 1 to `n`. There are also `times` edges `[u, v, w]` representing a signal traveling from node `u` to node `v` in `w` time units. Find the minimum time for the signal to reach all nodes.

**How to Apply Dijkstra:**
- Build adjacency list from times array
- Run Dijkstra from source node k
- Return maximum distance if all nodes reachable, else -1

---

### Problem 2: Path With Minimum Effort

**Problem:** [LeetCode 1631 - Path With Minimum Effort](https://leetcode.com/problems/path-with-minimum-effort/)

**Description:** You are given a 2D array of heights. Find a path from top-left to bottom-right that minimizes the maximum absolute difference between consecutive cells.

**How to Apply Dijkstra:**
- Treat each cell as a vertex
- Edge weight = max absolute difference between cells
- Use Dijkstra with modified relaxation to find minimum maximum edge

---

### Problem 3: Cheapest Flights Within K Stops

**Problem:** [LeetCode 787 - Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/)

**Description:** There are `n` cities connected by flights. Find the cheapest price to travel from city `src` to city `dst` with at most `k` stops.

**How to Apply Dijkstra:**
- Modified Dijkstra to track number of stops
- State: (cost, current_node, stops_used)
- Only expand if stops_used <= k

---

### Problem 4: Find the City With the Smallest Number of Neighbors

**Problem:** [LeetCode 1334 - Find the City With the Smallest Number of Neighbors](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/)

**Description:** Given `n` cities and distances between them, find the city with the smallest number of reachable cities within distance `threshold`.

**How to Apply Dijkstra:**
- Run Dijkstra from each city
- Count reachable cities within threshold
- Track minimum and return city index

---

### Problem 5: Minimum Cost to Reach Destination in Time

**Problem:** [LeetCode 1379 - Find a Value of a Mysterious Function](https://leetcode.com/problems/minimum-cost-to-reach-destination-in-time/)

**Description:** Similar to shortest path but with time constraints and vertex costs.

**How to Apply Dijkstra:**
- State: (cost, time, current_city)
- Track both cost and time in relaxation
- Optimize for minimum cost while respecting time limit

---

## Video Tutorial Links

### Fundamentals

- [Dijkstra's Algorithm - Introduction (Take U Forward)](https://www.youtube.com/watch?v=IBMf3qJlzYw) - Comprehensive introduction
- [Dijkstra's Algorithm Implementation (WilliamFiset)](https://www.youtube.com/watch?v=gQa-h9c1tCQ) - Detailed explanation with visualizations
- [Dijkstra's Algorithm (NeetCode)](https://www.youtube.com/watch?v=EFg3uE6xPLc) - Practical implementation guide

### Advanced Topics

- [0-1 BFS](https://www.youtube.com/watch?v=AMapQ67j8FQ) - Special case optimization
- [Bidirectional Dijkstra](https://www.youtube.com/watch?v=CglxBhWzK6k) - Two-way search optimization
- [Dijkstra vs Bellman-Ford](https://www.youtube.com/watch?v=04F4yDhI3C4) - Algorithm comparison

---

## Follow-up Questions

### Q1: Why doesn't Dijkstra's algorithm work with negative edge weights?

**Answer:** Dijkstra's greedy approach relies on the assumption that once we extract a vertex with minimum distance, that distance is final. With negative edge weights, a shorter path could be discovered later by going through a vertex with currently larger distance. The algorithm would incorrectly finalize distances too early.

### Q2: How would you modify Dijkstra to handle negative weights?

**Answer:** You cannot directly modify Dijkstra for negative weights. Use Bellman-Ford instead, which:
- Iterates V-1 times relaxing all edges
- Can detect negative cycles
- Has higher time complexity O(V × E)

### Q3: What's the difference between Dijkstra and BFS?

**Answer:**
- **BFS**: Unweighted graphs, finds shortest path in terms of edges
- **Dijkstra**: Weighted graphs with non-negative weights, finds shortest path in terms of total weight
- Both use similar greedy approach but Dijkstra uses priority queue instead of regular queue

### Q4: Can Dijkstra be used for all-pairs shortest path?

**Answer:** Yes, you can run Dijkstra from each vertex (O(V × (V + E) log V)), but:
- Floyd-Warshall is better for small dense graphs O(V³)
- For sparse graphs, Dijkstra from each vertex is practical

### Q5: How does A* differ from Dijkstra?

**Answer:** A* uses a heuristic to guide the search:
- Dijkstra explores uniformly based on distance from source
- A* prioritizes vertices closer to the target using heuristic h(n)
- A* is faster for single-target queries but requires admissible heuristic

---

## Summary

Dijkstra's algorithm is a **fundamental graph algorithm** for finding shortest paths in weighted graphs with **non-negative edge weights**. Key takeaways:

- **Greedy + Relaxation**: Always process closest vertex first, update neighbors
- **Time Complexity**: O((V + E) log V) with binary heap
- **Space Complexity**: O(V) for distances and priority queue
- **Limitation**: Only works with non-negative weights

When to use:
- ✅ Finding shortest path in weighted graphs
- ✅ GPS and navigation systems
- ✅ Network routing protocols
- ❌ Graphs with negative edge weights (use Bellman-Ford)
- ❌ Finding shortest path with negative cycles

This algorithm is essential for competitive programming and technical interviews, especially in problems involving route planning, network optimization, and pathfinding.

---

## Related Algorithms

- [Bellman-Ford](./bellman-ford.md) - Handles negative weights
- [Floyd-Warshall](./floyd-warshall.md) - All-pairs shortest path
- [BFS](./bfs-level-order.md) - Unweighted shortest path
- [Topological Sort](./topological-sort.md) - DAG shortest path (O(V + E))
- [A* Search](./a-star-search.md) - Heuristic-guided shortest path
