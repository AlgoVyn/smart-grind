# Graph BFS (Breadth-First Search)

## Category
Graphs

## Description

Breadth-First Search (BFS) is a fundamental graph traversal algorithm that explores all vertices at the present depth level before moving on to vertices at the next depth level. It uses a **queue data structure** to keep track of vertices to visit, ensuring level-by-level exploration of the graph.

BFS is particularly useful for:
- Finding the **shortest path** in unweighted graphs
- **Level-order traversal** of trees and graphs
- Finding **connected components**
- Solving problems involving **minimum distance** or **minimum steps**

---

## Core Concept

### How BFS Works

The key insight behind BFS is that it explores vertices in "waves" - first visiting all vertices at distance 1 from the source, then all vertices at distance 2, and so on. This guaranteed ordering makes BFS perfect for finding shortest paths in unweighted graphs.

### Algorithm Overview

1. **Initialize**: Start with a source vertex, mark it as visited, and enqueue it
2. **Process**: Dequeue a vertex from the front of the queue
3. **Explore**: Visit all unvisited neighbors of the dequeued vertex and enqueue them
4. **Repeat**: Continue until the queue is empty

### Visual Representation

For a graph with vertices A → B → C, etc.:

```
Level 0:     A (source)
Level 1:    B  C (distance 1 from A)
Level 2:   D  E  F (distance 2 from A)
```

BFS visits in order: A → B → C → D → E → F

### Why Queue Works

The queue data structure provides **FIFO** (First In, First Out) ordering:
- Vertices discovered earlier are explored earlier
- This ensures all vertices at distance d are processed before any at distance d+1
- Results in shortest-path discovery in unweighted graphs

### Key Data Structures

| Structure | Purpose |
|-----------|---------|
| **Queue** | Stores vertices to be explored (FIFO order) |
| **Visited Set** | Prevents revisiting vertices and infinite loops |
| **Result List** | Stores traversal order or distances |

---

## When to Use

Use BFS when you need to solve problems involving:

- **Shortest Path**: Finding minimum distance in unweighted graphs
- **Level-Order Traversal**: Visiting nodes level by level
- **Connected Components**: Finding all reachable vertices
- **Cycle Detection**: In undirected graphs
- **Path Finding**: With unweighted edges

### Comparison with DFS

| Feature | BFS | DFS |
|---------|-----|-----|
| **Data Structure** | Queue | Stack (or recursion) |
| **Exploration Order** | Level by level | Depth first |
| **Shortest Path** | ✅ Yes (unweighted) | ❌ No |
| **Memory** | O(width) | O(depth) |
| **Optimal for** | Shortest path | Path existence, cycles |
| **Can get stuck** | In deep graphs | In wide graphs |

### When to Choose BFS vs DFS

- **Choose BFS** when:
  - Finding shortest path in unweighted graph
  - Level-order traversal is needed
  - Graph is very wide but shallow
  - Minimum distance matters

- **Choose DFS** when:
  - Just checking path existence
  - Graph is very deep but narrow
  - Finding cycles in graph
  - Topological sorting

---

## Algorithm Steps

### Step-by-Step Approach

1. **Understand the Problem**
   - Identify the graph representation (adjacency list/matrix)
   - Determine the starting vertex/source
   - Clarify what needs to be returned (traversal order, distances, path)

2. **Choose Graph Representation**
   - Adjacency list: Better for sparse graphs, O(V + E) space
   - Adjacency matrix: Better for dense graphs, O(V²) space

3. **Initialize Data Structures**
   - Create a queue and enqueue the source vertex
   - Create a visited set and mark source as visited
   - Create a result array/list

4. **Process the Graph**
   - While queue is not empty:
     - Dequeue the front vertex
     - Process the vertex (add to result, update distance, etc.)
     - Enqueue all unvisited neighbors

5. **Handle Edge Cases**
   - Empty graph
   - Disconnected components
   - Starting vertex not in graph
   - Self-loops and parallel edges

6. **Return Results**
   - Traversal order, distances, or path as required

### Pseudocode

```
BFS(graph, start):
    if start not in graph:
        return []
    
    visited = {start}
    queue = [start]
    result = []
    
    while queue is not empty:
        vertex = queue.pop(0)  // Dequeue
        result.append(vertex)
        
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)  // Enqueue
    
    return result
```

---

## Implementation

### Basic BFS Template

````carousel
```python
from collections import deque
from typing import List, Dict, Set, Tuple, Optional

def bfs(graph: Dict[str, List[str]], start: str) -> List[str]:
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
    
    visited: Set[str] = {start}
    queue: deque = deque([start])
    result: List[str] = []
    
    while queue:
        vertex: str = queue.popleft()
        result.append(vertex)
        
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return result


def bfs_shortest_distance(graph: Dict[str, List[str]], start: str) -> Dict[str, int]:
    """
    Find shortest distance from start to all reachable vertices.
    
    Args:
        graph: Adjacency list representation
        start: Starting vertex
        
    Returns:
        Dictionary mapping vertex to its distance from start
        
    Time: O(V + E)
    Space: O(V)
    """
    if start not in graph:
        return {}
    
    distances: Dict[str, int] = {start: 0}
    visited: Set[str] = {start}
    queue: deque = deque([start])
    
    while queue:
        vertex: str = queue.popleft()
        current_distance: int = distances[vertex]
        
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                distances[neighbor] = current_distance + 1
                queue.append(neighbor)
    
    return distances


def bfs_shortest_path(graph: Dict[str, List[str]], start: str, target: str) -> Optional[List[str]]:
    """
    Find shortest path from start to target.
    
    Args:
        graph: Adjacency list representation
        start: Starting vertex
        target: Target vertex
        
    Returns:
        List representing the path, or None if no path exists
        
    Time: O(V + E)
    Space: O(V)
    """
    if start == target:
        return [start]
    
    if start not in graph:
        return None
    
    visited: Set[str] = {start}
    queue: deque = deque([(start, [start])])
    
    while queue:
        vertex, path = queue.popleft()
        
        for neighbor in graph[vertex]:
            if neighbor == target:
                return path + [neighbor]
            
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))
    
    return None  # No path exists


# Example usage and demonstration
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
    
    print("Graph:", graph)
    print()
    
    # Basic BFS traversal
    bfs_result = bfs(graph, 'A')
    print("BFS traversal from A:", bfs_result)
    # Output: ['A', 'B', 'C', 'D', 'E', 'F']
    
    # Shortest distances
    distances = bfs_shortest_distance(graph, 'A')
    print("Shortest distances from A:", distances)
    # Output: {'A': 0, 'B': 1, 'C': 1, 'D': 2, 'E': 2, 'F': 2}
    
    # Shortest path
    path = bfs_shortest_path(graph, 'A', 'F')
    print("Shortest path A to F:", path)
    # Output: ['A', 'C', 'F'] or ['A', 'B', 'E', 'F']
    
    # BFS on disconnected graph
    disconnected_graph = {
        'A': ['B'],
        'B': ['A'],
        'C': ['D'],
        'D': ['C']
    }
    print("\nDisconnected components:")
    all_visited = set()
    for vertex in disconnected_graph:
        if vertex not in all_visited:
            component = bfs(disconnected_graph, vertex)
            print(f"  Component starting from {vertex}: {component}")
            all_visited.update(component)
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <queue>
#include <unordered_map>
#include <unordered_set>
#include <string>
#include <optional>
#include <algorithm>

using namespace std;

/**
 * Breadth-First Search on a graph represented as adjacency list.
 * 
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */
class GraphBFS {
private:
    unordered_map<string, vector<string>> adjList;
    
public:
    GraphBFS(const unordered_map<string, vector<string>>& graph) : adjList(graph) {}
    
    /**
     * Perform BFS traversal starting from given vertex.
     * 
     * @param start Starting vertex
     * @return Vector of vertices in BFS order
     */
    vector<string> bfs(const string& start) {
        if (adjList.find(start) == adjList.end()) {
            return {};
        }
        
        unordered_set<string> visited;
        queue<string> q;
        vector<string> result;
        
        visited.insert(start);
        q.push(start);
        
        while (!q.empty()) {
            string vertex = q.front();
            q.pop();
            result.push_back(vertex);
            
            for (const string& neighbor : adjList[vertex]) {
                if (visited.find(neighbor) == visited.end()) {
                    visited.insert(neighbor);
                    q.push(neighbor);
                }
            }
        }
        
        return result;
    }
    
    /**
     * Find shortest distance from start to all reachable vertices.
     * 
     * @param start Starting vertex
     * @return Map of vertex to distance
     */
    unordered_map<string, int> shortestDistances(const string& start) {
        unordered_map<string, int> distances;
        
        if (adjList.find(start) == adjList.end()) {
            return distances;
        }
        
        unordered_set<string> visited;
        queue<string> q;
        
        visited.insert(start);
        q.push(start);
        distances[start] = 0;
        
        while (!q.empty()) {
            string vertex = q.front();
            q.pop();
            int currentDist = distances[vertex];
            
            for (const string& neighbor : adjList[vertex]) {
                if (visited.find(neighbor) == visited.end()) {
                    visited.insert(neighbor);
                    distances[neighbor] = currentDist + 1;
                    q.push(neighbor);
                }
            }
        }
        
        return distances;
    }
    
    /**
     * Find shortest path from start to target.
     * 
     * @param start Starting vertex
     * @param target Target vertex
     * @return Vector representing path, or nullopt if no path exists
     */
    optional<vector<string>> shortestPath(const string& start, const string& target) {
        if (start == target) {
            return vector<string>{start};
        }
        
        if (adjList.find(start) == adjList.end()) {
            return nullopt;
        }
        
        unordered_set<string> visited;
        queue<pair<string, vector<string>>> q;
        
        visited.insert(start);
        q.push({start, {start}});
        
        while (!q.empty()) {
            auto [vertex, path] = q.front();
            q.pop();
            
            for (const string& neighbor : adjList[vertex]) {
                if (neighbor == target) {
                    vector<string> newPath = path;
                    newPath.push_back(neighbor);
                    return newPath;
                }
                
                if (visited.find(neighbor) == visited.end()) {
                    visited.insert(neighbor);
                    vector<string> newPath = path;
                    newPath.push_back(neighbor);
                    q.push({neighbor, newPath});
                }
            }
        }
        
        return nullopt;
    }
};

int main() {
    // Create graph as adjacency list
    unordered_map<string, vector<string>> graph = {
        {"A", {"B", "C"}},
        {"B", {"A", "D", "E"}},
        {"C", {"A", "F"}},
        {"D", {"B"}},
        {"E", {"B", "F"}},
        {"F", {"C", "E"}}
    };
    
    GraphBFS bfs(graph);
    
    // Basic BFS traversal
    vector<string> bfsResult = bfs.bfs("A");
    cout << "BFS traversal from A: ";
    for (const string& v : bfsResult) {
        cout << v << " ";
    }
    cout << endl;
    
    // Shortest distances
    auto distances = bfs.shortestDistances("A");
    cout << "Shortest distances from A: ";
    for (const auto& [vertex, dist] : distances) {
        cout << vertex << "=" << dist << " ";
    }
    cout << endl;
    
    // Shortest path
    auto path = bfs.shortestPath("A", "F");
    if (path.has_value()) {
        cout << "Shortest path A to F: ";
        for (const string& v : path.value()) {
            cout << v << " ";
        }
        cout << endl;
    }
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Breadth-First Search implementation for graph traversal.
 * 
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */
public class GraphBFS {
    
    private Map<String, List<String>> adjList;
    
    public GraphBFS(Map<String, List<String>> graph) {
        this.adjList = graph;
    }
    
    /**
     * Perform BFS traversal starting from given vertex.
     * 
     * @param start Starting vertex
     * @return List of vertices in BFS order
     */
    public List<String> bfs(String start) {
        if (!adjList.containsKey(start)) {
            return new ArrayList<>();
        }
        
        Set<String> visited = new HashSet<>();
        Queue<String> queue = new LinkedList<>();
        List<String> result = new ArrayList<>();
        
        visited.add(start);
        queue.offer(start);
        
        while (!queue.isEmpty()) {
            String vertex = queue.poll();
            result.add(vertex);
            
            for (String neighbor : adjList.get(vertex)) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.offer(neighbor);
                }
            }
        }
        
        return result;
    }
    
    /**
     * Find shortest distance from start to all reachable vertices.
     * 
     * @param start Starting vertex
     * @return Map of vertex to distance
     */
    public Map<String, Integer> shortestDistances(String start) {
        Map<String, Integer> distances = new HashMap<>();
        
        if (!adjList.containsKey(start)) {
            return distances;
        }
        
        Set<String> visited = new HashSet<>();
        Queue<String> queue = new LinkedList<>();
        
        visited.add(start);
        queue.offer(start);
        distances.put(start, 0);
        
        while (!queue.isEmpty()) {
            String vertex = queue.poll();
            int currentDist = distances.get(vertex);
            
            for (String neighbor : adjList.get(vertex)) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    distances.put(neighbor, currentDist + 1);
                    queue.offer(neighbor);
                }
            }
        }
        
        return distances;
    }
    
    /**
     * Find shortest path from start to target.
     * 
     * @param start Starting vertex
     * @param target Target vertex
     * @return List representing path, or empty list if no path exists
     */
    public List<String> shortestPath(String start, String target) {
        if (start.equals(target)) {
            return Collections.singletonList(start);
        }
        
        if (!adjList.containsKey(start)) {
            return new ArrayList<>();
        }
        
        Set<String> visited = new HashSet<>();
        Queue<List<String>> queue = new LinkedList<>();
        
        visited.add(start);
        queue.offer(new ArrayList<>(List.of(start)));
        
        while (!queue.isEmpty()) {
            List<String> path = queue.poll();
            String vertex = path.get(path.size() - 1);
            
            for (String neighbor : adjList.get(vertex)) {
                if (neighbor.equals(target)) {
                    List<String> newPath = new ArrayList<>(path);
                    newPath.add(neighbor);
                    return newPath;
                }
                
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    List<String> newPath = new ArrayList<>(path);
                    newPath.add(neighbor);
                    queue.offer(newPath);
                }
            }
        }
        
        return new ArrayList<>(); // No path exists
    }
    
    public static void main(String[] args) {
        // Create graph as adjacency list
        Map<String, List<String>> graph = new HashMap<>();
        graph.put("A", Arrays.asList("B", "C"));
        graph.put("B", Arrays.asList("A", "D", "E"));
        graph.put("C", Arrays.asList("A", "F"));
        graph.put("D", Collections.singletonList("B"));
        graph.put("E", Arrays.asList("B", "F"));
        graph.put("F", Arrays.asList("C", "E"));
        
        GraphBFS bfs = new GraphBFS(graph);
        
        // Basic BFS traversal
        List<String> bfsResult = bfs.bfs("A");
        System.out.println("BFS traversal from A: " + bfsResult);
        
        // Shortest distances
        Map<String, Integer> distances = bfs.shortestDistances("A");
        System.out.println("Shortest distances from A: " + distances);
        
        // Shortest path
        List<String> path = bfs.shortestPath("A", "F");
        System.out.println("Shortest path A to F: " + path);
    }
}
```

<!-- slide -->
```javascript
/**
 * Breadth-First Search implementation for graph traversal.
 * 
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */
class GraphBFS {
    /**
     * @param {Map<string, string[]>} graph - Adjacency list representation
     */
    constructor(graph) {
        this.graph = graph;
    }
    
    /**
     * Perform BFS traversal starting from given vertex.
     * @param {string} start - Starting vertex
     * @returns {string[]} Vertices in BFS order
     */
    bfs(start) {
        if (!this.graph.has(start)) {
            return [];
        }
        
        const visited = new Set([start]);
        const queue = [start];
        const result = [];
        
        while (queue.length > 0) {
            const vertex = queue.shift();
            result.push(vertex);
            
            for (const neighbor of this.graph.get(vertex)) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            }
        }
        
        return result;
    }
    
    /**
     * Find shortest distance from start to all reachable vertices.
     * @param {string} start - Starting vertex
     * @returns {Map<string, number>} Vertex to distance mapping
     */
    shortestDistances(start) {
        const distances = new Map();
        
        if (!this.graph.has(start)) {
            return distances;
        }
        
        const visited = new Set([start]);
        const queue = [start];
        distances.set(start, 0);
        
        while (queue.length > 0) {
            const vertex = queue.shift();
            const currentDist = distances.get(vertex);
            
            for (const neighbor of this.graph.get(vertex)) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    distances.set(neighbor, currentDist + 1);
                    queue.push(neighbor);
                }
            }
        }
        
        return distances;
    }
    
    /**
     * Find shortest path from start to target.
     * @param {string} start - Starting vertex
     * @param {string} target - Target vertex
     * @returns {string[] | null} Path array or null if no path exists
     */
    shortestPath(start, target) {
        if (start === target) {
            return [start];
        }
        
        if (!this.graph.has(start)) {
            return null;
        }
        
        const visited = new Set([start]);
        const queue = [[start]];
        
        while (queue.length > 0) {
            const path = queue.shift();
            const vertex = path[path.length - 1];
            
            for (const neighbor of this.graph.get(vertex)) {
                if (neighbor === target) {
                    return [...path, neighbor];
                }
                
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push([...path, neighbor]);
                }
            }
        }
        
        return null; // No path exists
    }
}

// Example usage and demonstration
const graph = new Map([
    ['A', ['B', 'C']],
    ['B', ['A', 'D', 'E']],
    ['C', ['A', 'F']],
    ['D', ['B']],
    ['E', ['B', 'F']],
    ['F', ['C', 'E']]
]);

const bfs = new GraphBFS(graph);

// Basic BFS traversal
console.log('BFS traversal from A:', bfs.bfs('A'));
// Output: ['A', 'B', 'C', 'D', 'E', 'F']

// Shortest distances
console.log('Shortest distances from A:', 
    Object.fromEntries(bfs.shortestDistances('A')));
// Output: { A: 0, B: 1, C: 1, D: 2, E: 2, F: 2 }

// Shortest path
console.log('Shortest path A to F:', bfs.shortestPath('A', 'F'));
// Output: ['A', 'C', 'F'] or ['A', 'B', 'E', 'F']

// BFS on disconnected graph
const disconnectedGraph = new Map([
    ['A', ['B']],
    ['B', ['A']],
    ['C', ['D']],
    ['D', ['C']]
]);

console.log('\nDisconnected components:');
const allVisited = new Set();
for (const vertex of disconnectedGraph.keys()) {
    if (!allVisited.has(vertex)) {
        const component = new GraphBFS(disconnectedGraph).bfs(vertex);
        console.log(`  Component starting from ${vertex}:`, component);
        component.forEach(v => allVisited.add(v));
    }
}
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Basic BFS** | O(V + E) | Visit all vertices and edges once |
| **Shortest Path** | O(V + E) | Same as basic BFS |
| **Shortest Path (with path tracking)** | O(V + E) | Same complexity |
| **Finding All Components** | O(V + E) | Visit each vertex/edge once |

### Detailed Breakdown

- **V**: Number of vertices in the graph
- **E**: Number of edges in the graph

Each vertex is enqueued and dequeued exactly once: **O(V)**
Each edge is examined at most twice (from each endpoint): **O(E)**
Total: **O(V + E)**

---

## Space Complexity Analysis

| Data Structure | Space Complexity | Description |
|----------------|------------------|-------------|
| **Queue** | O(V) | Can hold all vertices in worst case |
| **Visited Set** | O(V) | Stores all visited vertices |
| **Distance Map** | O(V) | Stores distance for each vertex |
| **Path Storage** | O(V) | Stores the current path |
| **Total** | **O(V)** | Dominated by queue and visited set |

### Space Optimization Notes

- Use a `Set` or boolean array for visited tracking: O(V)
- For path reconstruction, use parent map instead of storing full paths
- In undirected graphs, mark visited when enqueueing (not when dequeuing) to save space

---

## Common Variations

### 1. BFS on Matrix/Grid

For 2D grid traversal with 4-directional movement:

````carousel
```python
from collections import deque

def bfs_grid(grid: list[list[int]], start: tuple) -> list:
    """BFS on a 2D grid with 4-directional movement."""
    if not grid or not grid[0]:
        return []
    
    rows, cols = len(grid), len(grid[0])
    visited = set([start])
    queue = deque([start])
    result = []
    
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    
    while queue:
        r, c = queue.popleft()
        result.append((r, c))
        
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if (0 <= nr < rows and 0 <= nc < cols and 
                (nr, nc) not in visited):
                visited.add((nr, nc))
                queue.append((nr, nc))
    
    return result
```
````

### 2. Bidirectional BFS

Optimized approach when both start and target are known:

````carousel
```python
from collections import deque

def bidirectional_bfs(graph: dict, start: str, target: str) -> int:
    """
    Bidirectional BFS - finds shortest path faster by searching from both ends.
    
    Time: O(V^(d/2)) instead of O(V^d) where d is shortest path length
    """
    if start == target:
        return 0
    if start not in graph or target not in graph:
        return -1
    
    # Forward search from start
    forward = {start: 0}
    forward_queue = deque([start])
    
    # Backward search from target
    backward = {target: 0}
    backward_queue = deque([target])
    
    while forward_queue and backward_queue:
        # Expand forward (or smaller queue)
        if len(forward_queue) <= len(forward_queue):
            for _ in range(len(forward_queue)):
                node = forward_queue.popleft()
                dist = forward[node]
                
                for neighbor in graph[node]:
                    if neighbor in backward:
                        return dist + 1 + backward[neighbor]
                    if neighbor not in forward:
                        forward[neighbor] = dist + 1
                        forward_queue.append(neighbor)
        
        # Expand backward
        else:
            for _ in range(len(backward_queue)):
                node = backward_queue.popleft()
                dist = backward[node]
                
                for neighbor in graph[node]:
                    if neighbor in forward:
                        return dist + 1 + forward[neighbor]
                    if neighbor not in backward:
                        backward[neighbor] = dist + 1
                        backward_queue.append(neighbor)
    
    return -1  # No path exists
```
````

### 3. Multi-Source BFS

Starting BFS from multiple source points simultaneously:

````carousel
```python
from collections import deque

def multi_source_bfs(grid: list[list[int]], sources: list[tuple]) -> list:
    """
    BFS from multiple source points.
    Useful for finding distance to nearest source from all cells.
    """
    rows, cols = len(grid), len(grid[0])
    distances = [[-1] * cols for _ in range(rows)]
    queue = deque()
    
    # Initialize all sources
    for r, c in sources:
        distances[r][c] = 0
        queue.append((r, c))
    
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    
    while queue:
        r, c = queue.popleft()
        dist = distances[r][c]
        
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if (0 <= nr < rows and 0 <= nc < cols and 
                distances[nr][nc] == -1):
                distances[nr][nc] = dist + 1
                queue.append((nr, nc))
    
    return distances
```
````

### 4. BFS with State Tracking

For problems with additional constraints:

````carousel
```python
from collections import deque

def bfs_with_state(graph: dict, start: str, visited_states: set) -> list:
    """
    BFS with additional state tracking.
    Useful when state includes more than just vertex (e.g., time, items collected).
    """
    # State = (vertex, additional_info)
    initial_state = (start, 0)  # Example: includes time
    queue = deque([initial_state])
    visited = set([initial_state])
    result = []
    
    while queue:
        vertex, state = queue.popleft()
        result.append((vertex, state))
        
        for neighbor in graph[vertex]:
            new_state = state + 1  # Update state
            new_key = (neighbor, new_state)
            
            if new_key not in visited:
                visited.add(new_key)
                queue.append(new_key)
    
    return result
```
````

---

## Practice Problems

### Problem 1: Number of Islands

**Problem:** [LeetCode 200 - Number of Islands](https://leetcode.com/problems/number-of-islands/)

**Description:** Given a 2D grid of '1's (land) and '0's (water), count the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.

**How to Apply BFS:**
- Use BFS to explore each island when encountering unvisited land
- Mark visited cells to avoid counting the same island twice
- BFS guarantees we visit all connected land cells

---

### Problem 2: Shortest Path in Binary Matrix

**Problem:** [LeetCode 1293 - Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/)

**Description:** Given an n x n binary matrix, find the length of the shortest clear path from top-left to bottom-right. A clear path is one where all cells have value 0.

**How to Apply BFS:**
- BFS naturally finds shortest path in unweighted grid
- Start from (0, 0) and BFS to (n-1, n-1)
- Track distance to each cell for shortest path

---

### Problem 3: Rotting Oranges

**Problem:** [LeetCode 994 - Rotting Oranges](https://leetcode.com/problems/rotting-oranges/)

**Description:** In a grid, each cell can have fresh oranges (1), rotten oranges (2), or be empty (0). Rotten oranges rot adjacent fresh oranges in 1 minute. Find the minimum time when all oranges become rotten.

**How to Apply BFS:**
- Use multi-source BFS starting from all initially rotten oranges
- Each BFS level represents one minute of time
- Answer is the number of BFS levels needed

---

### Problem 4: Clone Graph

**Problem:** [LeetCode 133 - Clone Graph](https://leetcode.com/problems/clone-graph/)

**Description:** Given a reference of a node in a connected undirected graph, return a deep copy of the graph.

**How to Apply BFS:**
- Use BFS to traverse the original graph
- Maintain a mapping from original nodes to cloned nodes
- When visiting each neighbor, create its clone if not exists

---

### Problem 5: Word Ladder

**Problem:** [LeetCode 127 - Word Ladder](https://leetcode.com/problems/word-ladder/)

**Description:** Given two words beginWord and endWord, and a dictionary, find the shortest transformation sequence length where only one letter changes at each step.

**How to Apply BFS:**
- Build graph where nodes are words and edges exist if words differ by one letter
- BFS from beginWord to find shortest transformation
- Use bidirectional BFS for optimization on large dictionaries

---

## Video Tutorial Links

### Fundamentals

- [BFS Introduction (Take U Forward)](https://www.youtube.com/watch?v=uWLlKThW7HQ) - Comprehensive BFS introduction
- [Breadth First Search (WilliamFiset)](https://www.youtube.com/watch?v=oDqjPvD54Ss) - Detailed explanation with visualizations
- [Graph Traversal (NeetCode)](https://www.youtube.com/watch?v=pcKY4hjDrxk) - BFS and DFS comparison

### Problem-Solving

- [Number of Islands - BFS Solution](https://www.youtube.com/watch?v=4t_NF66FA4I) - Grid BFS patterns
- [Word Ladder - BFS Solution](https://www.youtube.com/watch?v=vhWzBoy12_0) - Graph building with BFS
- [Rotting Oranges - BFS Solution](https://www.youtube.com/watch?v=y704f3pyEHw) - Multi-source BFS

### Advanced Topics

- [Bidirectional BFS](https://www.youtube.com/watch?v=UgZxr6n1f6M) - Optimization technique
- [BFS vs DFS](https://www.youtube.com/watch?v=1nKkXwfiNzk) - When to use which

---

## Follow-up Questions

### Q1: Can BFS be used to detect cycles in a directed graph?

**Answer:** Yes, but with a modification. Use three states for each vertex:
- **Unvisited**: Not seen yet
- **In Progress**: Currently in recursion stack (being processed)
- **Completed**: Fully processed

If we encounter a vertex in "In Progress" state, there's a cycle. Standard BFS with just visited set is sufficient for undirected graphs.

### Q2: What is the space complexity difference between BFS and DFS?

**Answer:** 
- **BFS**: O(V) worst case for queue + visited = O(V) - proportional to graph's width
- **DFS**: O(V) for recursion stack + visited = O(V) - proportional to graph's depth

For a line graph: BFS uses O(1) space, DFS uses O(V) space
For a star graph: BFS uses O(V) space, DFS uses O(1) space

### Q3: How do you handle very large graphs that don't fit in memory?

**Answer:**
1. **Disk-based BFS**: Use external memory algorithms
2. **Graph partitioning**: Divide graph and process in chunks
3. **Streaming BFS**: Process edges as they arrive
4. **Sampling**: For approximate answers, sample the graph

### Q4: Can BFS be implemented recursively?

**Answer:** BFS is inherently iterative due to its level-by-level requirement. However, you can simulate BFS using recursion with a "current level" and "next level" approach, but it's less efficient due to function call overhead. DFS is naturally recursive.

### Q5: How does BFS handle weighted graphs?

**Answer:** BFS **cannot** handle weighted graphs correctly for shortest path. For weighted graphs:
- Use **Dijkstra's Algorithm** (similar to BFS but with priority queue)
- For non-negative weights, Dijkstra is optimal
- For negative weights, use **Bellman-Ford** or **SPFA**

BFS treats all edges as having weight 1, so it only works for unweighted graphs.

---

## Summary

BFS (Breadth-First Search) is a fundamental graph traversal algorithm with numerous applications in competitive programming and technical interviews. Key takeaways:

- **Guaranteed shortest path**: In unweighted graphs, BFS finds shortest path
- **Level-order exploration**: Processes all nodes at distance d before d+1
- **Queue-based**: Uses FIFO ordering for exploration
- **Time: O(V + E)**: Efficient for sparse graphs
- **Space: O(V)**: Depends on graph structure (width vs depth)

When to use BFS:
- ✅ Finding shortest path in unweighted graphs
- ✅ Finding minimum number of steps/transformation
- ✅ Level-order tree/graph traversal
- ✅ Finding connected components
- ✅ Cycle detection in undirected graphs

When NOT to use BFS:
- ❌ Weighted graphs (use Dijkstra's)
- ❌ Finding any path (DFS is simpler)
- ❌ Deep graphs (may exceed stack with recursive DFS)
- ❌ Memory-constrained wide graphs

BFS is an essential tool that every programmer should master. It forms the foundation for many graph algorithms and is frequently asked in technical interviews.

---

## Related Algorithms

- [Graph DFS](./graph-dfs.md) - Depth-first search traversal
- [Dijkstra's Algorithm](./dijkstra.md) - Shortest path in weighted graphs
- [Topological Sort](./topological-sort.md) - Ordering with dependencies
- [Binary Lifting](./binary-lifting.md) - Path queries on trees
