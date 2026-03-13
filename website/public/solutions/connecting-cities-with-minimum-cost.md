# Connecting Cities With Minimum Cost

## LeetCode Link

[Connecting Cities With Minimum Cost - LeetCode](https://leetcode.com/problems/connecting-cities-with-minimum-cost/)

---

## Problem Description

Given n cities and a list of connections between them with associated costs, find the minimum cost to connect all cities. If it's not possible, return -1.

---

## Examples

**Example 1:**

**Input:**
```python
n = 3, connections = [[1,2,5],[1,3,6],[2,3,1]]
```

**Output:**
```python
6
```

**Explanation:** Connect 2-3 with cost 1, then connect 1-2 with cost 5. Total = 6.

**Example 2:**

**Input:**
```python
n = 4, connections = [[1,2,1],[2,3,2],[3,1,3]]
```

**Output:**
```python
3
```

---

## Constraints

- `1 <= n <= 10^5`
- `1 <= connections.length <= 10^5`
- `1 <= connections[i][2] <= 10^6`
- `1 <= connections[i][0], connections[i][1] <= n`

---

## Intuition

The key insight is that this is a **Minimum Spanning Tree (MST)** problem. We need to connect all cities with minimum total cost, and there should be exactly n-1 edges in the final connected graph.

**Key observations:**
1. This is exactly the Minimum Spanning Tree problem
2. Kruskal's algorithm works perfectly: sort edges by weight, add if no cycle
3. Use Union-Find to detect cycles efficiently
4. If after processing all edges we have less than n-1 edges, graph is disconnected

---

## Pattern:

This problem follows the **Minimum Spanning Tree (MST)** pattern, specifically using **Kruskal's Algorithm**.

### Core Concept

- **Spanning Tree**: A connected subgraph that includes all vertices with minimum edges (n-1)
- **MST Property**: In Kruskal's, always pick the smallest edge that doesn't create a cycle
- **Union-Find**: Efficiently detect cycles and merge components

### When to Use This Pattern

This pattern is applicable when:
1. Connecting all nodes with minimum total edge weight
2. Network design problems (roads, cables, networks)
3. Problems asking for minimum cost to connect everything

### Related Patterns

| Pattern | Description |
|---------|-------------|
| Prim's Algorithm | MST using priority queue, start from one node |
| Dijkstra's | Shortest path from single source |
| Union-Find | Cycle detection and component merging |

### Pattern Summary

This problem exemplifies **Kruskal's Algorithm for MST**, characterized by:
- Sorting all edges by weight
- Using Union-Find to detect cycles
- Adding edges until n-1 edges or all edges processed

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Kruskal's Algorithm** - Optimal solution
2. **Prim's Algorithm** - Alternative MST approach

---

## Approach 1: Kruskal's Algorithm (Optimal)

### Algorithm Steps

1. **Sort edges**: Sort all connections by cost in ascending order
2. **Initialize Union-Find**: Create parent array for all cities
3. **Process edges**: For each edge, if cities are in different components, union them and add cost
4. **Check completion**: If we have n-1 edges, return total cost; otherwise return -1

### Why It Works

Kruskal's algorithm is a greedy algorithm that builds the MST by always selecting the smallest edge that doesn't create a cycle. The Union-Find data structure efficiently detects cycles by checking if two vertices are already in the same component.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def minimumCost(self, n: int, connections: List[List[int]]) -> int:
        """
        Find the minimum cost to connect all cities using Kruskal's algorithm.

        Args:
            n: Number of cities (1-indexed)
            connections: List of [city1, city2, cost] connections

        Returns:
            Minimum cost to connect all cities, or -1 if not possible
        """
        # Sort connections by cost (Kruskal's algorithm)
        connections.sort(key=lambda x: x[2])

        # Initialize Union-Find data structure
        parent = list(range(n + 1))

        def find(x):
            if parent[x] != x:
                parent[x] = find(parent[x])  # Path compression
            return parent[x]

        def union(x, y):
            px, py = find(x), find(y)
            if px != py:
                parent[px] = py
                return True
            return False

        # Build Minimum Spanning Tree
        cost = 0
        edges = 0
        for u, v, w in connections:
            if union(u, v):
                cost += w
                edges += 1
                if edges == n - 1:
                    return cost

        return -1
```

<!-- slide -->
```cpp
#include <vector>
#include <algorithm>
using namespace std;

class UnionFind {
public:
    vector<int> parent;
    UnionFind(int n) {
        parent.resize(n + 1);
        for (int i = 0; i <= n; i++) parent[i] = i;
    }
    
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    bool unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        parent[px] = py;
        return true;
    }
};

class Solution {
public:
    int minimumCost(int n, vector<vector<int>>& connections) {
        sort(connections.begin(), connections.end(), 
             [](const auto& a, const auto& b) { return a[2] < b[2]; });
        
        UnionFind uf(n);
        int cost = 0, edges = 0;
        
        for (const auto& conn : connections) {
            int u = conn[0], v = conn[1], w = conn[2];
            if (uf.unite(u, v)) {
                cost += w;
                edges++;
                if (edges == n - 1) return cost;
            }
        }
        
        return -1;
    }
};
```

<!-- slide -->
```java
class UnionFind {
    int[] parent;
    UnionFind(int n) {
        parent = new int[n + 1];
        for (int i = 0; i <= n; i++) parent[i] = i;
    }
    
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    boolean unite(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;
        parent[px] = py;
        return true;
    }
}

class Solution {
    public int minimumCost(int n, int[][] connections) {
        Arrays.sort(connections, (a, b) -> a[2] - b[2]);
        
        UnionFind uf = new UnionFind(n);
        int cost = 0, edges = 0;
        
        for (int[] conn : connections) {
            int u = conn[0], v = conn[1], w = conn[2];
            if (uf.unite(u, v)) {
                cost += w;
                edges++;
                if (edges == n - 1) return cost;
            }
        }
        
        return -1;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @param {number[][]} connections
 * @return {number}
 */
var minimumCost = function(n, connections) {
    connections.sort((a, b) => a[2] - b[2]);
    
    const parent = Array.from({ length: n + 1 }, (_, i) => i);
    
    const find = (x) => {
        if (parent[x] !== x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    };
    
    const unite = (x, y) => {
        const px = find(x), py = find(y);
        if (px === py) return false;
        parent[px] = py;
        return true;
    };
    
    let cost = 0, edges = 0;
    
    for (const [u, v, w] of connections) {
        if (unite(u, v)) {
            cost += w;
            edges++;
            if (edges === n - 1) return cost;
        }
    }
    
    return -1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(E log E) - sorting edges |
| **Space** | O(n) - Union-Find structure |

---

## Approach 2: Prim's Algorithm

### Algorithm Steps

1. **Build adjacency list**: Convert connections to graph
2. **Use priority queue**: Start from city 1, add all connected edges
3. **Pick minimum**: Always pick the minimum weight edge to unvisited city
4. **Repeat**: Until all cities are visited or no more edges

### Why It Works

Prim's algorithm is another greedy MST algorithm that grows the tree from a starting vertex. It always adds the minimum weight edge that connects a visited vertex to an unvisited vertex.

### Code Implementation

````carousel
```python
from typing import List
import heapq

class Solution:
    def minimumCost(self, n: int, connections: List[List[int]]) -> int:
        """
        Find the minimum cost using Prim's algorithm.
        """
        # Build adjacency list
        graph = [[] for _ in range(n + 1)]
        for u, v, w in connections:
            graph[u].append((w, v))
            graph[v].append((w, u))
        
        # Prim's algorithm with priority queue
        visited = [False] * (n + 1)
        min_heap = [(0, 1)]  # (cost, city)
        cost = 0
        edges = 0
        
        while min_heap and edges < n:
            curr_cost, city = heapq.heappop(min_heap)
            if visited[city]:
                continue
            visited[city] = True
            cost += curr_cost
            edges += 1
            
            for next_cost, neighbor in graph[city]:
                if not visited[neighbor]:
                    heapq.heappush(min_heap, (next_cost, neighbor))
        
        return cost if edges == n else -1
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    int minimumCost(int n, vector<vector<int>>& connections) {
        // Build adjacency list
        vector<vector<pair<int,int>>> graph(n + 1);
        for (auto& conn : connections) {
            graph[conn[0]].push_back({conn[2], conn[1]});
            graph[conn[1]].push_back({conn[2], conn[0]});
        }
        
        // Prim's algorithm
        vector<bool> visited(n + 1, false);
        priority_queue<pair<int,int>, vector<pair<int,int>>, greater<pair<int,int>>> pq;
        pq.push({0, 1});
        int cost = 0, edges = 0;
        
        while (!pq.empty() && edges < n) {
            auto [c, city] = pq.top();
            pq.pop();
            if (visited[city]) continue;
            visited[city] = true;
            cost += c;
            edges++;
            
            for (auto& [nc, nb] : graph[city]) {
                if (!visited[nb]) {
                    pq.push({nc, nb});
                }
            }
        }
        
        return edges == n ? cost : -1;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int minimumCost(int n, int[][] connections) {
        // Build adjacency list
        List<List<int[]>> graph = new ArrayList<>();
        for (int i = 0; i <= n; i++) graph.add(new ArrayList<>());
        for (int[] conn : connections) {
            graph.get(conn[0]).add(new int[]{conn[2], conn[1]});
            graph.get(conn[1]).add(new int[]{conn[2], conn[0]});
        }
        
        // Prim's algorithm
        boolean[] visited = new boolean[n + 1];
        PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[0] - b[0]);
        pq.add(new int[]{0, 1});
        int cost = 0, edges = 0;
        
        while (!pq.isEmpty() && edges < n) {
            int[] curr = pq.poll();
            int c = curr[0], city = curr[1];
            if (visited[city]) continue;
            visited[city] = true;
            cost += c;
            edges++;
            
            for (int[] next : graph.get(city)) {
                if (!visited[next[1]]) {
                    pq.add(next);
                }
            }
        }
        
        return edges == n ? cost : -1;
    }
}
```

<!-- slide -->
```javascript
var minimumCost = function(n, connections) {
    // Build adjacency list
    const graph = Array.from({ length: n + 1 }, () => []);
    for (const [u, v, w] of connections) {
        graph[u].push([w, v]);
        graph[v].push([w, u]);
    }
    
    // Prim's algorithm
    const visited = new Array(n + 1).fill(false);
    const pq = [[0, 1]];
    let cost = 0, edges = 0;
    
    while (pq.length > 0 && edges < n) {
        const [c, city] = pq.pop();
        if (visited[city]) continue;
        visited[city] = true;
        cost += c;
        edges++;
        
        for (const [nc, nb] of graph[city]) {
            if (!visited[nb]) {
                pq.push([nc, nb]);
                pq.sort((a, b) => b[0] - a[0]);  // Max heap
            }
        }
    }
    
    return edges === n ? cost : -1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(E log V) - priority queue operations |
| **Space** | O(V + E) - graph and visited arrays |

---

## Comparison of Approaches

| Aspect | Kruskal's | Prim's |
|--------|-----------|--------|
| **Time Complexity** | O(E log E) | O(E log V) |
| **Space Complexity** | O(V) | O(V + E) |
| **Implementation** | Simpler | More complex |
| **Best For** | Sparse graphs | Dense graphs |

**Best Approach:** Use Kruskal's algorithm for most cases.

---

## Related Problems

Based on similar themes (MST, graph connectivity):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Minimum Spanning Tree | [Link](https://leetcode.com/problems/minimum-spanning-tree/) | General MST |
| Number of Operations | [Link](https://leetcode.com/problems/number-of-operations-to-connect-nodes/) | Similar connectivity |
| Graph Valid Tree | [Link](https://leetcode.com/problems/valid-tree/) | Check if connected |
| Redundant Connection | [Link](https://leetcode.com/problems/redundant-connection/) | Find edge to remove |

---

## Video Tutorial Links

Here are helpful YouTube tutorials:

1. **[Kruskal's Algorithm](https://www.youtube.com/watch?v=71NkC3aZbQE)** - MST explanation
2. **[Prim's Algorithm](https://www.youtube.com/watch?v=cplmcLq3RjI)** - Alternative MST
3. **[Union-Find](https://www.youtube.com/watch?v=0jNmHPfAYPUE)** - Data structure

---

## Follow-up Questions

### Q1: How would you handle weighted connections with time constraints?

**Answer:** Add time dimension to edges. Use modified Dijkstra's algorithm.

### Q2: What if some connections are bidirectional?

**Answer:** The problem already treats connections as bidirectional (undirected).

### Q3: How would you return the actual connections used?

**Answer:** Track which edges are added to the MST during the algorithm.

---

## Common Pitfalls

### 1. Not Using Path Compression
**Issue**: Union-Find operations become slow without path compression.

**Solution**: Always implement path compression in the find operation to achieve near O(1) operations.

### 2. Wrong Sort Order
**Issue**: Forgetting to sort edges by cost in ascending order.

**Solution**: Kruskal's algorithm requires sorting edges by weight. Always use ascending order.

### 3. Not Checking for Disconnected Graph
**Issue**: Returning incorrect result when graph cannot be fully connected.

**Solution**: After processing all edges, verify that exactly n-1 edges were added. If not, return -1.

### 4. Using 1-indexed Cities Incorrectly
**Issue**: Not accounting for 1-indexed city numbering in Union-Find array.

**Solution**: Initialize Union-Find with n+1 elements (0 to n), ignoring index 0.

### 5. Modifying Input Array
**Issue**: Sorting the original connections array may cause issues if input needs to be preserved.

**Solution**: Create a copy if the original array must be preserved, or document that input is modified.

---

## Summary

The **Connecting Cities With Minimum Cost** problem demonstrates the **Minimum Spanning Tree** pattern:

- **Kruskal's Algorithm**: Sort edges, use Union-Find to detect cycles
- **Greedy choice**: Always pick smallest edge that doesn't create cycle
- **Time complexity**: O(E log E) - optimal for this problem

Key insights:
1. This is a classic MST problem
2. Kruskal's algorithm is simple and efficient
3. Use Union-Find for cycle detection
4. Return -1 if graph is disconnected (less than n-1 edges)

This pattern extends to:
- Network design problems
- Cluster analysis
- Various connectivity optimization problems

---

## Additional Resources

- [LeetCode Problem 1167](https://leetcode.com/problems/connecting-cities-with-minimum-cost/) - Official problem page
- [Kruskal's Algorithm - GeeksforGeeks](https://www.geeksforgeeks.org/kruskals-minimum-spanning-tree-algorithm/)
- [Pattern: Minimum Spanning Tree](/algorithms/kruskals)
