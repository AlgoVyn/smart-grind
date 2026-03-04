# Topological Sort

## Category
Graphs

## Description
Topological Sort is an algorithm that orders vertices of a Directed Acyclic Graph (DAG) such that for every edge u→v, vertex u comes before vertex v in the ordering. This is essential for solving problems involving dependency resolution, task scheduling, and build systems where certain tasks must be completed before others can begin.

---

## When to Use

Use the Topological Sort algorithm when you need to solve problems involving:

- **Dependency Resolution**: When tasks have prerequisites (course scheduling, package installation)
- **Build Systems**: Determining the order of compilation for source files
- **Task Scheduling**: When activities must be performed in a specific order
- **Course Prerequisites**: Determining valid course sequences
- **Project Planning**: Resolving task dependencies in project management

### Comparison with Alternatives

| Algorithm | Use Case | Time Complexity | Space Complexity |
|-----------|----------|------------------|-------------------|
| **Kahn's Algorithm (BFS)** | General DAG ordering, cycle detection | O(V + E) | O(V) |
| **DFS-based Topo Sort** | When DFS is already being performed | O(V + E) | O(V) |
| **Cycle Detection** | Just detecting if cycle exists | O(V + E) | O(V) |
| **All Topological Orders** | Generating all valid orderings | O(V! × (V + E)) | O(V) |

### When to Choose Kahn's Algorithm vs DFS-based

- **Choose Kahn's Algorithm (BFS)** when:
  - You need to detect cycles easily (if result count < V, cycle exists)
  - You want an intuitive level-by-level understanding
  - You're more comfortable with iterative approaches
  - You need to easily find the "starting points" (zero in-degree nodes)

- **Choose DFS-based Topological Sort** when:
  - You're already doing DFS for other purposes
  - You prefer recursive approaches
  - You want to find strongly connected components (can combine with Kosaraju's)
  - Memory stack depth is not a concern

---

## Algorithm Explanation

### Core Concept

The key insight behind Topological Sort is that in a DAG, there must always be at least one vertex with in-degree 0 (no dependencies). By repeatedly removing vertices with in-degree 0 and updating their neighbors' in-degrees, we can produce a valid ordering. If we can't process all vertices, a cycle exists.

### How It Works

#### Kahn's Algorithm (BFS-based):
1. **Calculate in-degree**: Count incoming edges for each vertex
2. **Initialize queue**: Add all vertices with in-degree 0 to the queue
3. **Process vertices**: While queue is not empty:
   - Dequeue vertex, add to result
   - For each neighbor, decrease its in-degree by 1
   - If neighbor's in-degree becomes 0, add to queue
4. **Check for cycle**: If processed vertices < total vertices, cycle exists

#### DFS-based Approach:
1. **Perform DFS**: Visit all unvisited vertices
2. **Record completion**: Add vertex to result AFTER exploring all neighbors
3. **Reverse result**: The final order is the reverse of completion times

### Visual Representation

For a graph with vertices {0, 1, 2, 3, 4} and edges:
- 1 → 0 (1 must come before 0)
- 0 → 4 (0 must come before 4)
- 1 → 4 (1 must come before 4)
- 2 → 3 (2 must come before 3)

```
Initial state:              After processing 1:
    1 → 0 → 4                   [1]    0 → 4
    |    ↗                         ↗
    ↓                           ↓
    1 → 4                   [1]    [0]

    2 → 3                   [1, 2] [0] → 3
```

Final topological order: [1, 2, 0, 3, 4]

### Why It Works

- **DAG Property**: A DAG always has at least one source (vertex with in-degree 0)
- **Induction**: If we process all sources first, the remaining graph is still a DAG
- **Cycle Detection**: If a cycle exists, no vertex in the cycle will ever reach in-degree 0

### Limitations

- **Only works on DAGs**: Cycles make topological sort impossible
- **Not unique**: Multiple valid topological orders may exist
- **No weight consideration**: Doesn't account for edge weights or priorities

---

## Algorithm Steps

### Kahn's Algorithm (BFS)

1. **Build the graph**: Create adjacency list from edges
2. **Calculate in-degrees**: For each vertex, count incoming edges
3. **Initialize queue**: Push all vertices with in-degree 0
4. **Process loop**: While queue is not empty:
   - Pop vertex, add to result
   - For each neighbor: decrement in-degree, add to queue if 0
5. **Validate**: Check if result contains all vertices

### DFS-based Topological Sort

1. **Build adjacency list**: Create graph from edges
2. **Initialize visited array**: Track node states (0=unvisited, 1=visiting, 2=done)
3. **DFS traversal**: For each unvisited vertex:
   - Mark as visiting
   - Recursively visit all neighbors
   - If neighbor is visiting, cycle detected
   - Mark as done, add to result
4. **Reverse result**: Final answer is reversed completion order

---

## Implementation

### Template Code (Kahn's Algorithm and DFS)

````carousel
```python
from typing import List, Deque, Optional
from collections import deque

def topological_sort_kahn(n: int, edges: List[List[int]]) -> List[int]:
    """
    Topological sort using Kahn's algorithm (BFS-based).
    
    Args:
        n: Number of vertices (0 to n-1)
        edges: List of directed edges [from, to]
    
    Returns:
        Topological ordering of vertices, or empty list if cycle exists
    
    Time Complexity: O(V + E)
    Space Complexity: O(V)
    """
    # Step 1: Build graph and in-degree array
    graph = [[] for _ in range(n)]
    in_degree = [0] * n
    
    for u, v in edges:
        graph[u].append(v)
        in_degree[v] += 1
    
    # Step 2: Initialize queue with all vertices having in-degree 0
    queue = deque([i for i in range(n) if in_degree[i] == 0])
    result = []
    
    # Step 3: Process vertices
    while queue:
        vertex = queue.popleft()
        result.append(vertex)
        
        # Step 4: Reduce in-degree of neighbors
        for neighbor in graph[vertex]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # Step 5: Check for cycle - if we couldn't process all vertices
    if len(result) != n:
        return []  # Cycle detected - no valid topological order
    
    return result


def topological_sort_dfs(n: int, edges: List[List[int]]) -> List[int]:
    """
    Topological sort using DFS.
    
    Args:
        n: Number of vertices (0 to n-1)
        edges: List of directed edges [from, to]
    
    Returns:
        Topological ordering of vertices, or empty list if cycle exists
    
    Time Complexity: O(V + E)
    Space Complexity: O(V)
    """
    # Build graph
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
    
    # visited: 0 = unvisited, 1 = in progress (visiting), 2 = done
    visited = [0] * n
    result = []
    
    def dfs(vertex: int) -> bool:
        """Returns False if cycle detected, True otherwise."""
        visited[vertex] = 1  # Mark as visiting
        
        for neighbor in graph[vertex]:
            if visited[neighbor] == 1:  # Back edge found - cycle!
                return False
            if visited[neighbor] == 0:  # Unvisited
                if not dfs(neighbor):
                    return False
        
        visited[vertex] = 2  # Mark as done
        result.append(vertex)  # Add to result after all neighbors
        return True
    
    # Process all vertices
    for v in range(n):
        if visited[v] == 0:
            if not dfs(v):
                return []  # Cycle detected
    
    return result[::-1]  # Reverse for correct topological order


# Example usage and demonstration
if __name__ == "__main__":
    # Example: Course Prerequisites
    # 0: Algorithms
    # 1: Data Structures
    # 2: Operating Systems
    # 3: Computer Networks
    # 4: Machine Learning
    # 
    # Prerequisites:
    # Data Structures (1) -> Algorithms (0)
    # Algorithms (0) -> Machine Learning (4)
    # Data Structures (1) -> Machine Learning (4)
    # Operating Systems (2) -> Computer Networks (3)
    
    n = 5
    edges = [
        [1, 0],  # Data Structures -> Algorithms
        [0, 4],  # Algorithms -> ML
        [1, 4],  # Data Structures -> ML
        [2, 3]   # OS -> Networks
    ]
    
    print(f"Number of vertices: {n}")
    print(f"Edges (prerequisites): {edges}")
    print()
    
    # Kahn's Algorithm
    result_kahn = topological_sort_kahn(n, edges)
    print(f"Kahn's Algorithm order: {result_kahn}")
    
    # DFS-based
    result_dfs = topological_sort_dfs(n, edges)
    print(f"DFS-based order: {result_dfs}")
    
    # Verify the order
    print("\nVerification:")
    print("1 → 0: ", result_kahn.index(1) < result_kahn.index(0))
    print("0 → 4: ", result_kahn.index(0) < result_kahn.index(4))
    print("1 → 4: ", result_kahn.index(1) < result_kahn.index(4))
    print("2 → 3: ", result_kahn.index(2) < result_kahn.index(3))
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

/**
 * Topological Sort using Kahn's algorithm (BFS-based).
 * 
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */
vector<int> topologicalSortKahn(int n, const vector<pair<int,int>>& edges) {
    // Build graph and in-degree array
    vector<vector<int>> graph(n);
    vector<int> inDegree(n, 0);
    
    for (const auto& [u, v] : edges) {
        graph[u].push_back(v);
        inDegree[v]++;
    }
    
    // Initialize queue with vertices having in-degree 0
    queue<int> q;
    for (int i = 0; i < n; i++) {
        if (inDegree[i] == 0) {
            q.push(i);
        }
    }
    
    vector<int> result;
    
    // Process vertices
    while (!q.empty()) {
        int vertex = q.front();
        q.pop();
        result.push_back(vertex);
        
        // Reduce in-degree of neighbors
        for (int neighbor : graph[vertex]) {
            inDegree[neighbor]--;
            if (inDegree[neighbor] == 0) {
                q.push(neighbor);
            }
        }
    }
    
    // Check for cycle
    if (result.size() != n) {
        return {};  // Cycle detected
    }
    
    return result;
}

/**
 * Topological Sort using DFS.
 * 
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */
vector<int> topologicalSortDFS(int n, const vector<pair<int,int>>& edges) {
    // Build graph
    vector<vector<int>> graph(n);
    for (const auto& [u, v] : edges) {
        graph[u].push_back(v);
    }
    
    // visited: 0 = unvisited, 1 = visiting, 2 = done
    vector<int> visited(n, 0);
    vector<int> result;
    
    function<bool(int)> dfs = [&](int vertex) -> bool {
        visited[vertex] = 1;  // Mark as visiting
        
        for (int neighbor : graph[vertex]) {
            if (visited[neighbor] == 1) {  // Back edge - cycle!
                return false;
            }
            if (visited[neighbor] == 0) {
                if (!dfs(neighbor)) {
                    return false;
                }
            }
        }
        
        visited[vertex] = 2;  // Mark as done
        result.push_back(vertex);
        return true;
    };
    
    // Process all vertices
    for (int v = 0; v < n; v++) {
        if (visited[v] == 0) {
            if (!dfs(v)) {
                return {};  // Cycle detected
            }
        }
    }
    
    reverse(result.begin(), result.end());
    return result;
}

int main() {
    int n = 5;
    vector<pair<int,int>> edges = {
        {1, 0},  // Data Structures -> Algorithms
        {0, 4},  // Algorithms -> ML
        {1, 4},  // Data Structures -> ML
        {2, 3}   // OS -> Networks
    };
    
    cout << "Number of vertices: " << n << endl;
    cout << "Edges (prerequisites): ";
    for (const auto& [u, v] : edges) {
        cout << "(" << u << "->" << v << ") ";
    }
    cout << endl << endl;
    
    // Kahn's Algorithm
    vector<int> resultKahn = topologicalSortKahn(n, edges);
    cout << "Kahn's Algorithm order: ";
    for (int v : resultKahn) cout << v << " ";
    cout << endl;
    
    // DFS-based
    vector<int> resultDFS = topologicalSortDFS(n, edges);
    cout << "DFS-based order:       ";
    for (int v : resultDFS) cout << v << " ";
    cout << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Topological Sort implementations.
 * 
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */
public class TopologicalSort {
    
    /**
     * Topological sort using Kahn's algorithm (BFS-based).
     */
    public static List<Integer> topologicalSortKahn(int n, int[][] edges) {
        // Build graph and in-degree array
        List<List<Integer>> graph = new ArrayList<>();
        int[] inDegree = new int[n];
        
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }
        
        for (int[] edge : edges) {
            int u = edge[0];
            int v = edge[1];
            graph.get(u).add(v);
            inDegree[v]++;
        }
        
        // Initialize queue with vertices having in-degree 0
        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < n; i++) {
            if (inDegree[i] == 0) {
                queue.offer(i);
            }
        }
        
        List<Integer> result = new ArrayList<>();
        
        // Process vertices
        while (!queue.isEmpty()) {
            int vertex = queue.poll();
            result.add(vertex);
            
            // Reduce in-degree of neighbors
            for (int neighbor : graph.get(vertex)) {
                inDegree[neighbor]--;
                if (inDegree[neighbor] == 0) {
                    queue.offer(neighbor);
                }
            }
        }
        
        // Check for cycle
        if (result.size() != n) {
            return Collections.emptyList();  // Cycle detected
        }
        
        return result;
    }
    
    /**
     * Topological sort using DFS.
     */
    public static List<Integer> topologicalSortDFS(int n, int[][] edges) {
        // Build graph
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }
        
        for (int[] edge : edges) {
            graph.get(edge[0]).add(edge[1]);
        }
        
        // visited: 0 = unvisited, 1 = visiting, 2 = done
        int[] visited = new int[n];
        List<Integer> result = new ArrayList<>();
        
        // DFS using recursion
        for (int v = 0; v < n; v++) {
            if (visited[v] == 0) {
                if (!dfs(v, graph, visited, result)) {
                    return Collections.emptyList();  // Cycle detected
                }
            }
        }
        
        Collections.reverse(result);
        return result;
    }
    
    private static boolean dfs(int vertex, List<List<Integer>> graph, 
                              int[] visited, List<Integer> result) {
        visited[vertex] = 1;  // Mark as visiting
        
        for (int neighbor : graph.get(vertex)) {
            if (visited[neighbor] == 1) {  // Back edge - cycle!
                return false;
            }
            if (visited[neighbor] == 0) {
                if (!dfs(neighbor, graph, visited, result)) {
                    return false;
                }
            }
        }
        
        visited[vertex] = 2;  // Mark as done
        result.add(vertex);
        return true;
    }
    
    public static void main(String[] args) {
        int n = 5;
        int[][] edges = {
            {1, 0},  // Data Structures -> Algorithms
            {0, 4},  // Algorithms -> ML
            {1, 4},  // Data Structures -> ML
            {2, 3}   // OS -> Networks
        };
        
        System.out.println("Number of vertices: " + n);
        System.out.println("Edges (prerequisites): " + Arrays.deepToString(edges));
        System.out.println();
        
        // Kahn's Algorithm
        List<Integer> resultKahn = topologicalSortKahn(n, edges);
        System.out.println("Kahn's Algorithm order: " + resultKahn);
        
        // DFS-based
        List<Integer> resultDFS = topologicalSortDFS(n, edges);
        System.out.println("DFS-based order: " + resultDFS);
    }
}
```

<!-- slide -->
```javascript
/**
 * Topological Sort implementations.
 * 
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */

/**
 * Topological sort using Kahn's algorithm (BFS-based).
 * @param {number} n - Number of vertices
 * @param {number[][]} edges - Array of [from, to] edges
 * @returns {number[]} Topological ordering, or empty array if cycle exists
 */
function topologicalSortKahn(n, edges) {
    // Build graph and in-degree array
    const graph = Array.from({ length: n }, () => []);
    const inDegree = new Array(n).fill(0);
    
    for (const [u, v] of edges) {
        graph[u].push(v);
        inDegree[v]++;
    }
    
    // Initialize queue with vertices having in-degree 0
    const queue = [];
    for (let i = 0; i < n; i++) {
        if (inDegree[i] === 0) {
            queue.push(i);
        }
    }
    
    let head = 0;
    const result = [];
    
    // Process vertices
    while (head < queue.length) {
        const vertex = queue[head++];
        result.push(vertex);
        
        // Reduce in-degree of neighbors
        for (const neighbor of graph[vertex]) {
            inDegree[neighbor]--;
            if (inDegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }
    }
    
    // Check for cycle
    if (result.length !== n) {
        return [];  // Cycle detected
    }
    
    return result;
}

/**
 * Topological sort using DFS.
 * @param {number} n - Number of vertices
 * @param {number[][]} edges - Array of [from, to] edges
 * @returns {number[]} Topological ordering, or empty array if cycle exists
 */
function topologicalSortDFS(n, edges) {
    // Build graph
    const graph = Array.from({ length: n }, () => []);
    for (const [u, v] of edges) {
        graph[u].push(v);
    }
    
    // visited: 0 = unvisited, 1 = visiting, 2 = done
    const visited = new Array(n).fill(0);
    const result = [];
    
    function dfs(vertex) {
        visited[vertex] = 1;  // Mark as visiting
        
        for (const neighbor of graph[vertex]) {
            if (visited[neighbor] === 1) {  // Back edge - cycle!
                return false;
            }
            if (visited[neighbor] === 0) {
                if (!dfs(neighbor)) {
                    return false;
                }
            }
        }
        
        visited[vertex] = 2;  // Mark as done
        result.push(vertex);
        return true;
    }
    
    // Process all vertices
    for (let v = 0; v < n; v++) {
        if (visited[v] === 0) {
            if (!dfs(v)) {
                return [];  // Cycle detected
            }
        }
    }
    
    return result.reverse();  // Reverse for correct order
}

// Example usage and demonstration
const n = 5;
const edges = [
    [1, 0],  // Data Structures -> Algorithms
    [0, 4],  // Algorithms -> ML
    [1, 4],  // Data Structures -> ML
    [2, 3]   // OS -> Networks
];

console.log(`Number of vertices: ${n}`);
console.log(`Edges (prerequisites): ${JSON.stringify(edges)}`);
console.log();

// Kahn's Algorithm
const resultKahn = topologicalSortKahn(n, edges);
console.log(`Kahn's Algorithm order: [${resultKahn.join(', ')}]`);

// DFS-based
const resultDFS = topologicalSortDFS(n, edges);
console.log(`DFS-based order:       [${resultDFS.join(', ')}]`);

// Verification
console.log('\nVerification (Kahn):');
console.log('1 → 0:', resultKahn.indexOf(1) < resultKahn.indexOf(0));
console.log('0 → 4:', resultKahn.indexOf(0) < resultKahn.indexOf(4));
console.log('1 → 4:', resultKahn.indexOf(1) < resultKahn.indexOf(4));
console.log('2 → 3:', resultKahn.indexOf(2) < resultKahn.indexOf(3));
```
````

---

## Time Complexity Analysis

| Operation | Kahn's Algorithm | DFS-based | Description |
|-----------|-----------------|-----------|-------------|
| **Build Graph** | O(V + E) | O(V + E) | Create adjacency list from edges |
| **Calculate In-degrees** | O(E) | N/A | Count incoming edges |
| **Main Processing** | O(V + E) | O(V + E) | Process all vertices and edges |
| **Total Time** | **O(V + E)** | **O(V + E)** | Linear in graph size |
| **Space (Graph)** | O(V + E) | O(V + E) | Store adjacency list |
| **Space (Auxiliary)** | O(V) | O(V) | Queue/stack + visited array |

### Detailed Breakdown

- **Kahn's Algorithm**: 
  - Building graph: O(E)
  - Initial queue setup: O(V)
  - Each vertex processed once: O(V)
  - Each edge traversed once: O(E)
  - Total: O(V + E)

- **DFS-based**:
  - Building graph: O(E)
  - DFS visits each vertex once: O(V)
  - DFS explores each edge once: O(E)
  - Total: O(V + E)

---

## Space Complexity Analysis

| Component | Space | Notes |
|-----------|-------|-------|
| **Adjacency List** | O(V + E) | Store all edges |
| **In-degree Array** | O(V) | Count of incoming edges |
| **Visited/State Array** | O(V) | Track node states |
| **Queue (Kahn's)** | O(V) | Maximum size |
| **Result Array** | O(V) | Final ordering |
| **DFS Call Stack** | O(V) | Maximum recursion depth |
| **Total** | **O(V + E)** | |

### Space Optimization Tips

1. **In-place modification**: Modify in-degree array instead of copying
2. **Iterative DFS**: Use explicit stack instead of recursion to avoid call stack overflow
3. **Sparse graphs**: Use hash maps instead of arrays for adjacency lists

---

## Common Variations

### 1. Find Any Valid Topological Order

Simply return the first valid order found (Kahn's algorithm naturally does this).

### 2. Find All Topological Orders

Use backtracking with Kahn's algorithm:
- Track in-degrees and try each zero in-degree vertex
- Recursively explore all possibilities
- Time: O(V! × E) in worst case

### 3. Lexicographically Smallest Topological Order

Use a **min-heap** (priority queue) instead of regular queue:
- Always pick smallest available vertex
- Python: `heapq` | Java: `PriorityQueue` | C++: `priority_queue`

### 4. Find Path Between Two Nodes

After topological sort, check if source appears before destination in the order.

### 5. Detect Cycle Only (No Ordering)

Simplify either algorithm to just detect cycles without storing the order.

### 6. Topological Sort with Specific Start/End

Filter the result after computing the full topological order.

---

## Practice Problems

### Problem 1: Course Schedule

**Problem:** [LeetCode 207 - Course Schedule](https://leetcode.com/problems/course-schedule/)

**Description:** There are `numCourses` courses labeled from 0 to `numCourses - 1`. Some courses may have prerequisites. Given the total number of courses and a list of prerequisite pairs, determine if it is possible to finish all courses.

**How to Apply Topological Sort:**
- Build a graph where each course points to its dependents
- Use Kahn's algorithm or DFS to detect cycles
- If cycle exists → impossible to complete; otherwise → possible

---

### Problem 2: Course Schedule II

**Problem:** [LeetCode 210 - Course Schedule II](https://leetcode.com/problems/course-schedule-ii/)

**Description:** Find one valid order of course scheduling. Return an empty array if impossible.

**How to Apply Topological Sort:**
- Use Kahn's algorithm to produce actual ordering
- Return the result if all vertices processed, otherwise return empty

---

### Problem 3: Alien Dictionary

**Problem:** [LeetCode 269 - Alien Dictionary](https://leetcode.com/problems/alien-dictionary/)

**Description:** Given a sorted dictionary of alien alphabet, determine the order of characters.

**How to Apply Topological Sort:**
- Build graph from consecutive words by finding first differing character
- Use topological sort to find character ordering
- Handle edge cases (invalid ordering, cycle)

---

### Problem 4: Parallel Courses

**Problem:** [LeetCode 1136 - Parallel Courses](https://leetcode.com/problems/parallel-courses/)

**Description:** Given courses and their dependencies, find the minimum number of semesters needed to complete all courses.

**How to Apply Topological Sort:**
- Modify Kahn's algorithm to process all zero in-degree nodes in parallel (one semester)
- Count semesters until all courses completed

---

### Problem 5: Minimum Height Trees

**Problem:** [LeetCode 310 - Minimum Height Trees](https://leetcode.com/problems/minimum-height-trees/)

**Description:** For a tree (or graph without cycles), find all root nodes that produce minimum height trees.

**How to Apply Topological Sort:**
- Repeatedly remove leaf nodes (in-degree = 1) from the tree
- The remaining 1-2 nodes are the roots of minimum height trees

---

## Video Tutorial Links

### Fundamentals

- [Topological Sort - Introduction (Take U Forward)](https://www.youtube.com/watch?v=73r3KXMx5lk) - Comprehensive introduction to topological sort
- [Kahn's Algorithm (BFS)](https://www.youtube.com/watch?v=q1fp8zaB2wA) - Detailed explanation with examples
- [DFS-based Topological Sort](https://www.youtube.com/watch?v=3j-4LPuR1Ts) - DFS approach explained

### Practical Applications

- [Course Schedule Problem](https://www.youtube.com/watch?v=qe_pT4wkqOM) - LeetCode 207 solution
- [Alien Dictionary](https://www.youtube.com/watch?v=1wuNBS0N2bU) - Real-world application
- [Parallel Courses](https://www.youtube.com/watch?v=k1lK8dairmI) - Extended problem variant

### Advanced Topics

- [All Topological Orders](https://www.youtube.com/watch?v=5_Q6QYgy2Rg) - Generating all valid orders
- [Topological Sort vs DFS](https://www.youtube.com/watch?v=A0Z0L-1lEE0) - Comparison and trade-offs

---

## Follow-up Questions

### Q1: What is the difference between Kahn's algorithm and DFS-based topological sort?

**Answer:** Both achieve the same result but with different approaches:
- **Kahn's Algorithm**: Uses BFS with a queue. Iteratively removes vertices with in-degree 0. More intuitive for cycle detection (if result < V, cycle exists).
- **DFS-based**: Uses depth-first search. Adds vertex to result after exploring all neighbors, then reverses. More natural when DFS is already being used.

### Q2: How do you detect a cycle in a directed graph?

**Answer:** There are several methods:
1. **Kahn's Algorithm**: If processed vertices < total vertices, cycle exists
2. **DFS-based**: If we encounter a vertex currently "visiting" (in recursion stack), it's a back edge → cycle
3. **Union-Find**: For each edge, union the two vertices; if they already belong to same set → cycle

### Q3: Can topological sort handle disconnected graphs?

**Answer:** Yes, both algorithms handle disconnected components naturally:
- Kahn's algorithm starts with ALL zero in-degree vertices in queue
- DFS-based iterates through all vertices, starting new DFS for unvisited ones
- The result will contain all vertices in topological order

### Q4: How do you find the lexicographically smallest topological order?

**Answer:** Use a priority queue (min-heap) instead of a regular queue:
- Always pop the smallest available vertex (in-degree = 0)
- This guarantees the lexicographically smallest valid ordering
- Time complexity increases slightly due to heap operations: O((V+E) log V)

### Q5: What is the time complexity to find ALL topological orders?

**Answer:** O(V! × E) in the worst case:
- There can be up to V! valid topological orders
- Each generation takes O(V + E) time
- This is exponential and impractical for large V
- Use only when explicitly required

---

## Summary

Topological Sort is an essential algorithm for solving **dependency-related problems** in directed acyclic graphs. Key takeaways:

- **Linear time**: O(V + E) time complexity makes it efficient
- **Two main approaches**: Kahn's algorithm (BFS) and DFS-based
- **Cycle detection**: Both methods naturally detect cycles
- **Multiple valid orders**: Any order satisfying all constraints is valid

When to use:
- ✅ Course scheduling and prerequisites
- ✅ Build systems and dependency resolution
- ✅ Task scheduling with dependencies
- ✅ Detecting cycles in directed graphs
- ❌ Undirected graphs (use DFS/Union-Find)
- ❌ Graphs with cycles (impossible)

This algorithm is fundamental for competitive programming and technical interviews, especially in problems involving ordering, scheduling, and dependency resolution.

---

## Related Algorithms

- [BFS Level Order Traversal](./bfs-level-order.md) - Breadth-first graph traversal
- [DFS Preorder](./dfs-preorder.md) - Depth-first graph traversal
- [Union Find](./union-find.md) - Disjoint set operations
- [Strongly Connected Components](./strongly-connected-components.md) - Kosaraju's and Tarjan's algorithms
