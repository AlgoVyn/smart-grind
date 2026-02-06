# Graph BFS - Topological Sort (Kahn's Algorithm)

## Overview

Kahn's algorithm uses **Breadth-First Search (BFS)** to perform **topological sorting** on a **Directed Acyclic Graph (DAG)**. Topological sort orders nodes such that for every directed edge `u → v`, node `u` comes before node `v` in the ordering. This is essential for dependency resolution and scheduling problems where certain tasks must be completed before others can begin.

### When to Use This Pattern

Use Kahn's algorithm when you need to:
- **Order tasks with dependencies** - Schedule tasks where some tasks require others to be completed first
- **Schedule courses with prerequisites** - Determine valid course enrollment order based on prerequisites
- **Resolve build dependencies** - Determine compilation order for interdependent modules or files
- **Process nodes in dependency order** - Handle situations where operations must occur in a specific sequence
- **Detect cycles in directed graphs** - Identify circular dependencies that make the problem unsolvable

### Key Benefits

| Benefit | Description |
|---------|-------------|
| **Cycle Detection** | If not all nodes are processed, a cycle exists in the graph |
| **Guaranteed Valid Order** | Produces a valid topological order if one exists |
| **Iterative Approach** | Uses BFS with indegrees, avoiding recursion depth issues |
| **Linear Complexity** | O(V + E) time complexity for optimal performance |

---

## Intuition and Core Concepts

### What is Topological Sort?

A topological sort is a linear ordering of vertices in a directed graph such that for every directed edge `u → v`, vertex `u` comes before vertex `v` in the ordering. This only works for **Directed Acyclic Graphs (DAGs)** - graphs with no cycles.

**Example:**
```
Courses: A, B, C, D
Prerequisites: B → A, C → A, D → B, D → C

Valid Topological Order: [D, C, B, A] or [D, B, C, A]
```
In this order, D comes before B and C (since D is a prerequisite), and B and C come before A.

### Key Terminology

- **Indegree**: The number of incoming edges to a node (number of prerequisites)
- **Outdegree**: The number of outgoing edges from a node (number of dependents)
- **DAG**: Directed Acyclic Graph - a directed graph with no cycles
- **Source Node**: A node with indegree 0 (no prerequisites)
- **Sink Node**: A node with outdegree 0 (no dependents)

### Algorithm Intuition

The core idea behind Kahn's algorithm is intuitive:

1. **Start with independent tasks**: Nodes with indegree 0 (no prerequisites) can be processed first
2. **Remove dependencies progressively**: When a node is processed, remove its outgoing edges by decrementing the indegrees of its neighbors
3. **Continue until completion**: Keep adding nodes whose indegrees become 0
4. **Detect cycles**: If we can't process all nodes, a cycle exists

This is analogous to:
- **Course scheduling**: Take courses with no prerequisites first, then unlock new courses as prerequisites are completed
- **Build systems**: Compile files with no dependencies first, then recompile files that depend on completed files

---

## Multiple Approaches with Code Templates

We'll cover two standard approaches:

1. **BFS (Kahn's Algorithm)**: Iterative approach using indegrees and queue
2. **DFS with Cycle Detection**: Recursive approach using visit states

---

### Approach 1: BFS (Kahn's Algorithm)

#### Algorithm Steps

1. **Build the adjacency list** representation of the graph
2. **Compute indegrees** for each node by counting incoming edges
3. **Initialize a queue** with all nodes having indegree 0 (no prerequisites)
4. **Process the queue**:
   - Dequeue a node and add it to the result
   - For each neighbor (dependent), decrement its indegree
   - If a neighbor's indegree becomes 0, enqueue it
5. **Check for cycles**: If result contains all nodes, return valid order; otherwise, cycle exists

#### Code Implementation

````carousel
```python
from collections import deque, defaultdict
from typing import List

def topological_sort_kahn(num_nodes: int, edges: List[List[int]]) -> List[int]:
    """
    Kahn's Algorithm for Topological Sort using BFS.
    
    Args:
        num_nodes: Number of nodes in the graph (0 to num_nodes-1)
        edges: List of directed edges [u, v] meaning u -> v
    
    Returns:
        Topological order of nodes, or empty list if cycle exists
    """
    # Build adjacency list and compute indegrees
    graph = defaultdict(list)
    indegree = [0] * num_nodes
    
    for u, v in edges:
        graph[u].append(v)  # u -> v
        indegree[v] += 1
    
    # Initialize queue with nodes having indegree 0
    queue = deque([i for i in range(num_nodes) if indegree[i] == 0])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        # Decrease indegree of all neighbors
        for neighbor in graph[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)
    
    # Check if cycle exists
    if len(result) == num_nodes:
        return result
    else:
        return []  # Cycle detected


# Alternative: Using adjacency list with node labels
def topological_sort_generic(graph: dict, nodes: list) -> list:
    """
    Generic version for arbitrary node labels.
    
    Args:
        graph: Dict mapping node -> list of neighbors
        nodes: List of all nodes in the graph
    
    Returns:
        Topological order of nodes, or empty list if cycle exists
    """
    indegree = defaultdict(int)
    for node in graph:
        for neighbor in graph[node]:
            indegree[neighbor] += 1
    
    # Include nodes with no incoming edges
    for node in nodes:
        if node not in indegree:
            indegree[node] = 0
    
    # Initialize queue with nodes having indegree 0
    queue = deque([node for node in nodes if indegree[node] == 0])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        for neighbor in graph.get(node, []):
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)
    
    return result if len(result) == len(nodes) else []


# Example usage
if __name__ == "__main__":
    # Example 1: Course scheduling
    num_courses = 4
    prerequisites = [[1, 0], [2, 0], [3, 1], [3, 2]]  # [course, prerequisite]
    print(topological_sort_kahn(num_courses, [[p[1], p[0]] for p in prerequisites]))
    # Output: [0, 1, 2, 3] or [0, 2, 1, 3]
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <unordered_map>
#include <algorithm>
using namespace std;

class TopologicalSort {
public:
    /**
     * Kahn's Algorithm for Topological Sort using BFS.
     * 
     * @param num_nodes Number of nodes in the graph (0 to num_nodes-1)
     * @param edges Vector of directed edges [u, v] meaning u -> v
     * @return Topological order of nodes, or empty vector if cycle exists
     */
    vector<int> kahnBFS(int num_nodes, vector<vector<int>>& edges) {
        unordered_map<int, vector<int>> graph;
        vector<int> indegree(num_nodes, 0);
        
        // Build graph and compute indegrees
        for (const auto& edge : edges) {
            int u = edge[0];
            int v = edge[1];
            graph[u].push_back(v);  // u -> v
            indegree[v]++;
        }
        
        // Initialize queue with nodes having indegree 0
        queue<int> q;
        for (int i = 0; i < num_nodes; i++) {
            if (indegree[i] == 0) {
                q.push(i);
            }
        }
        
        vector<int> result;
        while (!q.empty()) {
            int node = q.front();
            q.pop();
            result.push_back(node);
            
            for (int neighbor : graph[node]) {
                indegree[neighbor]--;
                if (indegree[neighbor] == 0) {
                    q.push(neighbor);
                }
            }
        }
        
        // Check if cycle exists
        if (result.size() == num_nodes) {
            return result;
        }
        return {};  // Cycle detected
    }
    
    /**
     * Generic version for arbitrary node labels using unordered_map.
     */
    vector<char> kahnGeneric(unordered_map<char, vector<char>>& graph, 
                              vector<char>& nodes) {
        unordered_map<char, int> indegree;
        for (const auto& node : nodes) {
            indegree[node] = 0;
        }
        
        for (const auto& [node, neighbors] : graph) {
            for (const auto& neighbor : neighbors) {
                indegree[neighbor]++;
            }
        }
        
        queue<char> q;
        for (const auto& node : nodes) {
            if (indegree[node] == 0) {
                q.push(node);
            }
        }
        
        vector<char> result;
        while (!q.empty()) {
            char node = q.front();
            q.pop();
            result.push_back(node);
            
            for (char neighbor : graph[node]) {
                indegree[neighbor]--;
                if (indegree[neighbor] == 0) {
                    q.push(neighbor);
                }
            }
        }
        
        return result.size() == nodes.size() ? result : vector<char>{};
    }
};
```

<!-- slide -->
```java
import java.util.*;

public class TopologicalSort {
    
    /**
     * Kahn's Algorithm for Topological Sort using BFS.
     * 
     * @param numNodes Number of nodes in the graph (0 to numNodes-1)
     * @param edges List of directed edges [u, v] meaning u -> v
     * @return Topological order of nodes, or empty list if cycle exists
     */
    public List<Integer> kahnBFS(int numNodes, List<int[]> edges) {
        Map<Integer, List<Integer>> graph = new HashMap<>();
        int[] indegree = new int[numNodes];
        
        // Build graph and compute indegrees
        for (int[] edge : edges) {
            int u = edge[0];
            int v = edge[1];
            graph.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
            indegree[v]++;
        }
        
        // Initialize queue with nodes having indegree 0
        Queue<Integer> queue = new LinkedList<>();
        for (int i = 0; i < numNodes; i++) {
            if (indegree[i] == 0) {
                queue.offer(i);
            }
        }
        
        List<Integer> result = new ArrayList<>();
        while (!queue.isEmpty()) {
            int node = queue.poll();
            result.add(node);
            
            for (int neighbor : graph.getOrDefault(node, new ArrayList<>())) {
                indegree[neighbor]--;
                if (indegree[neighbor] == 0) {
                    queue.offer(neighbor);
                }
            }
        }
        
        // Check if cycle exists
        if (result.size() == numNodes) {
            return result;
        }
        return new ArrayList<>();  // Cycle detected
    }
    
    /**
     * Generic version for arbitrary node labels.
     */
    public List<Character> kahnGeneric(Map<Character, List<Character>> graph, 
                                        List<Character> nodes) {
        Map<Character, Integer> indegree = new HashMap<>();
        for (char node : nodes) {
            indegree.put(node, 0);
        }
        
        for (Map.Entry<Character, List<Character>> entry : graph.entrySet()) {
            char node = entry.getKey();
            for (char neighbor : entry.getValue()) {
                indegree.put(neighbor, indegree.getOrDefault(neighbor, 0) + 1);
            }
        }
        
        Queue<Character> queue = new LinkedList<>();
        for (char node : nodes) {
            if (indegree.get(node) == 0) {
                queue.offer(node);
            }
        }
        
        List<Character> result = new ArrayList<>();
        while (!queue.isEmpty()) {
            char node = queue.poll();
            result.add(node);
            
            for (char neighbor : graph.getOrDefault(node, new ArrayList<>())) {
                indegree.put(neighbor, indegree.get(neighbor) - 1);
                if (indegree.get(neighbor) == 0) {
                    queue.offer(neighbor);
                }
            }
        }
        
        return result.size() == nodes.size() ? result : new ArrayList<>();
    }
}
```

<!-- slide -->
```javascript
/**
 * Kahn's Algorithm for Topological Sort using BFS.
 * 
 * @param {number} numNodes - Number of nodes in the graph (0 to numNodes-1)
 * @param {number[][]} edges - Array of directed edges [u, v] meaning u -> v
 * @return {number[]} Topological order of nodes, or empty array if cycle exists
 */
function kahnBFS(numNodes, edges) {
    // Build graph and compute indegrees
    const graph = new Map();
    const indegree = new Array(numNodes).fill(0);
    
    for (const [u, v] of edges) {
        if (!graph.has(u)) {
            graph.set(u, []);
        }
        graph.get(u).push(v);  // u -> v
        indegree[v]++;
    }
    
    // Initialize queue with nodes having indegree 0
    const queue = [];
    for (let i = 0; i < numNodes; i++) {
        if (indegree[i] === 0) {
            queue.push(i);
        }
    }
    
    const result = [];
    while (queue.length > 0) {
        const node = queue.shift();
        result.push(node);
        
        const neighbors = graph.get(node) || [];
        for (const neighbor of neighbors) {
            indegree[neighbor]--;
            if (indegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }
    }
    
    // Check if cycle exists
    return result.length === numNodes ? result : [];
}

/**
 * Generic version for arbitrary node labels.
 * 
 * @param {Map} graph - Map mapping node -> array of neighbors
 * @param {Array} nodes - Array of all nodes
 * @return {Array} Topological order of nodes, or empty array if cycle exists
 */
function kahnGeneric(graph, nodes) {
    const indegree = new Map();
    
    // Initialize indegrees
    for (const node of nodes) {
        indegree.set(node, 0);
    }
    
    // Compute indegrees
    for (const [node, neighbors] of graph) {
        for (const neighbor of neighbors) {
            indegree.set(neighbor, indegree.get(neighbor) + 1);
        }
    }
    
    // Initialize queue with nodes having indegree 0
    const queue = [];
    for (const node of nodes) {
        if (indegree.get(node) === 0) {
            queue.push(node);
        }
    }
    
    const result = [];
    while (queue.length > 0) {
        const node = queue.shift();
        result.push(node);
        
        const neighbors = graph.get(node) || [];
        for (const neighbor of neighbors) {
            indegree.set(neighbor, indegree.get(neighbor) - 1);
            if (indegree.get(neighbor) === 0) {
                queue.push(neighbor);
            }
        }
    }
    
    return result.length === nodes.length ? result : [];
}

// Example usage
const numCourses = 4;
const prerequisites = [[1, 0], [2, 0], [3, 1], [3, 2]];
const edges = prerequisites.map(([a, b]) => [b, a]); // Convert [a, b] to b -> a
console.log(kahnBFS(numCourses, edges));
// Output: [0, 1, 2, 3] or [0, 2, 1, 3]
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(V + E) - Each vertex and edge is processed exactly once |
| **Space** | O(V + E) - Graph storage, indegree array, and queue |

---

### Approach 2: DFS with Cycle Detection

#### Algorithm Steps

1. **Build the adjacency list** representation of the graph
2. **Use a visit state array** with three states:
   - `0` = unvisited (not yet processed)
   - `1` = visiting (currently in recursion stack)
   - `2` = visited (fully processed)
3. **Perform DFS** from each unvisited node:
   - If visiting (`state == 1`), a **cycle is detected**
   - If visited (`state == 2`), skip (already processed)
   - Mark as visiting, recursively visit all neighbors, then mark as visited
4. **Add node to order** after processing all neighbors (post-order)
5. **Reverse the order** at the end (post-order gives reverse topological order)

#### Code Implementation

````carousel
```python
from collections import defaultdict
from typing import List

def topological_sort_dfs(num_nodes: int, edges: List[List[int]]) -> List[int]:
    """
    DFS-based Topological Sort with Cycle Detection.
    
    Args:
        num_nodes: Number of nodes in the graph (0 to num_nodes-1)
        edges: List of directed edges [u, v] meaning u -> v
    
    Returns:
        Topological order of nodes, or empty list if cycle exists
    """
    # Build adjacency list
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)  # u -> v
    
    # Visit states: 0 = unvisited, 1 = visiting, 2 = visited
    visit = [0] * num_nodes
    order = []
    has_cycle = [False]  # Use list for mutable closure
    
    def dfs(node: int):
        if has_cycle[0]:
            return
        if visit[node] == 1:
            has_cycle[0] = True  # Cycle detected
            return
        if visit[node] == 2:
            return  # Already processed
        
        visit[node] = 1  # Mark as visiting
        
        for neighbor in graph[node]:
            dfs(neighbor)
            if has_cycle[0]:
                return
        
        visit[node] = 2  # Mark as visited
        order.append(node)  # Add to order (post-order)
    
    # Perform DFS from each unvisited node
    for i in range(num_nodes):
        if visit[i] == 0:
            dfs(i)
            if has_cycle[0]:
                return []
    
    # Reverse to get topological order
    return order[::-1]


# Alternative: DFS with early termination and stack-based approach
def topological_sort_dfs_iterative(num_nodes: int, edges: List[List[int]]) -> List[int]:
    """
    Iterative DFS-based Topological Sort to avoid recursion limits.
    """
    from collections import deque
    
    # Build adjacency list
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
    
    visit = [0] * num_nodes  # 0 = unvisited, 1 = visiting, 2 = visited
    order = []
    
    for i in range(num_nodes):
        if visit[i] != 0:
            continue
            
        stack = [(i, 0)]  # (node, next_child_index)
        
        while stack:
            node, idx = stack[-1]
            
            if visit[node] == 1 and idx == 0:
                # Re-entering a visiting node - cycle detected
                return []
            
            if visit[node] == 0:
                visit[node] = 1  # Mark as visiting
            
            if idx < len(graph[node]):
                neighbor = graph[node][idx]
                stack[-1] = (node, idx + 1)
                
                if visit[neighbor] == 0:
                    stack.append((neighbor, 0))
                elif visit[neighbor] == 1:
                    return []  # Cycle detected
            else:
                # All neighbors processed
                stack.pop()
                visit[node] = 2
                order.append(node)
    
    return order[::-1]


if __name__ == "__main__":
    num_courses = 4
    prerequisites = [[1, 0], [2, 0], [3, 1], [3, 2]]
    print(topological_sort_dfs(num_courses, [[p[1], p[0]] for p in prerequisites]))
    # Output: [0, 2, 1, 3] or similar valid order
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <algorithm>
using namespace std;

class TopologicalSortDFS {
public:
    /**
     * DFS-based Topological Sort with Cycle Detection.
     * 
     * @param num_nodes Number of nodes in the graph (0 to num_nodes-1)
     * @param edges Vector of directed edges [u, v] meaning u -> v
     * @return Topological order of nodes, or empty vector if cycle exists
     */
    vector<int> dfsTopologicalSort(int num_nodes, vector<vector<int>>& edges) {
        unordered_map<int, vector<int>> graph;
        for (const auto& edge : edges) {
            int u = edge[0];
            int v = edge[1];
            graph[u].push_back(v);
        }
        
        vector<int> visit(num_nodes, 0);  // 0 = unvisited, 1 = visiting, 2 = visited
        vector<int> order;
        bool has_cycle = false;
        
        function<void(int)> dfs = [&](int node) {
            if (has_cycle) return;
            if (visit[node] == 1) {
                has_cycle = true;
                return;
            }
            if (visit[node] == 2) {
                return;
            }
            
            visit[node] = 1;
            for (int neighbor : graph[node]) {
                dfs(neighbor);
                if (has_cycle) return;
            }
            visit[node] = 2;
            order.push_back(node);
        };
        
        for (int i = 0; i < num_nodes; i++) {
            if (visit[i] == 0) {
                dfs(i);
                if (has_cycle) return {};
            }
        }
        
        reverse(order.begin(), order.end());
        return order;
    }
};
```

<!-- slide -->
```java
import java.util.*;

public class TopologicalSortDFS {
    
    /**
     * DFS-based Topological Sort with Cycle Detection.
     * 
     * @param numNodes Number of nodes in the graph (0 to numNodes-1)
     * @param edges List of directed edges [u, v] meaning u -> v
     * @return Topological order of nodes, or empty list if cycle exists
     */
    public List<Integer> dfsTopologicalSort(int numNodes, List<int[]> edges) {
        Map<Integer, List<Integer>> graph = new HashMap<>();
        for (int[] edge : edges) {
            int u = edge[0];
            int v = edge[1];
            graph.computeIfAbsent(u, k -> new ArrayList<>()).add(v);
        }
        
        int[] visit = new int[numNodes];  // 0 = unvisited, 1 = visiting, 2 = visited
        List<Integer> order = new ArrayList<>();
        boolean[] hasCycle = {false};
        
        java.util.function.Consumer<Integer> dfs = node -> {
            if (hasCycle[0]) return;
            if (visit[node] == 1) {
                hasCycle[0] = true;
                return;
            }
            if (visit[node] == 2) {
                return;
            }
            
            visit[node] = 1;
            for (int neighbor : graph.getOrDefault(node, new ArrayList<>())) {
                dfs.accept(neighbor);
                if (hasCycle[0]) return;
            }
            visit[node] = 2;
            order.add(node);
        };
        
        for (int i = 0; i < numNodes; i++) {
            if (visit[i] == 0) {
                dfs.accept(i);
                if (hasCycle[0]) return new ArrayList<>();
            }
        }
        
        Collections.reverse(order);
        return order;
    }
}
```

<!-- slide -->
```javascript
/**
 * DFS-based Topological Sort with Cycle Detection.
 * 
 * @param {number} numNodes - Number of nodes in the graph (0 to numNodes-1)
 * @param {number[][]} edges - Array of directed edges [u, v] meaning u -> v
 * @return {number[]} Topological order of nodes, or empty array if cycle exists
 */
function dfsTopologicalSort(numNodes, edges) {
    // Build adjacency list
    const graph = new Map();
    for (const [u, v] of edges) {
        if (!graph.has(u)) {
            graph.set(u, []);
        }
        graph.get(u).push(v);
    }
    
    const visit = new Array(numNodes).fill(0);  // 0 = unvisited, 1 = visiting, 2 = visited
    const order = [];
    let hasCycle = false;
    
    const dfs = (node) => {
        if (hasCycle) return;
        if (visit[node] === 1) {
            hasCycle = true;
            return;
        }
        if (visit[node] === 2) {
            return;
        }
        
        visit[node] = 1;
        const neighbors = graph.get(node) || [];
        for (const neighbor of neighbors) {
            dfs(neighbor);
            if (hasCycle) return;
        }
        visit[node] = 2;
        order.push(node);  // Add to order (post-order)
    };
    
    for (let i = 0; i < numNodes; i++) {
        if (visit[i] === 0) {
            dfs(i);
            if (hasCycle) return [];
        }
    }
    
    return order.reverse();  // Reverse to get topological order
}

// Example usage
const numCourses = 4;
const prerequisites = [[1, 0], [2, 0], [3, 1], [3, 2]];
const edges = prerequisites.map(([a, b]) => [b, a]);
console.log(dfsTopologicalSort(numCourses, edges));
// Output: [0, 2, 1, 3] or similar valid order
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(V + E) - Each vertex and edge visited exactly once |
| **Space** | O(V + E) - Graph storage, visit array, and recursion stack (O(V) worst case) |

---

### Comparison of Approaches

| Aspect | BFS (Kahn's) | DFS |
|--------|--------------|-----|
| **Approach** | Iterative | Recursive |
| **Cycle Detection** | Implicit (if nodes remain unprocessed) | Explicit (via visit states) |
| **Memory** | Queue + adjacency list | Recursion stack + adjacency list |
| **Use Case** | Better for large graphs (no recursion limits) | More intuitive for those familiar with recursion |
| **Order** | Natural topological order | Requires reverse at end |
| **Implementation** | Slightly more complex edge counting | More complex state management |

**Recommendation**: Use Kahn's algorithm for large graphs or when recursion depth might be an issue. Use DFS-based approach if recursion depth is not a concern and you prefer recursive solutions.

---

## Related Problems

Based on similar themes (topological sort, cycle detection, dependency resolution):

### Foundational Problems

- **[LeetCode 207: Course Schedule](https://leetcode.com/problems/course-schedule/)** - Check if course scheduling is possible without returning order (cycle detection only)
- **[LeetCode 210: Course Schedule II](https://leetcode.com/problems/course-schedule-ii/)** - Return the ordering of courses to finish all courses
- **[LeetCode 269: Alien Dictionary](https://leetcode.com/problems/alien-dictionary/)** - Derive alien alphabet order from sorted words
- **[LeetCode 444: Sequence Reconstruction](https://leetcode.com/problems/sequence-reconstruction/)** - Verify if a sequence is the unique topological order

### Advanced Problems

- **[LeetCode 1462: Course Schedule IV](https://leetcode.com/problems/course-schedule-iv/)** - Queries on prerequisite chains between course pairs
- **[LeetCode 1494: Parallel Courses II](https://leetcode.com/problems/parallel-courses-ii/)** - Minimum semesters to complete all courses with parallel taking
- **[LeetCode 1857: Largest Color Value in a Directed Graph](https://leetcode.com/problems/largest-color-value-in-a-directed-graph/)** - Topological sort combined with DP for color values
- **[LeetCode 2050: Parallel Courses III](https://leetcode.com/problems/parallel-courses-iii/)** - Minimum time to complete all courses with dependencies and durations
- **[LeetCode 2115: Find All Possible Recipes](https://leetcode.com/problems/find-all-possible-recipes/)** - Topological sort for recipe dependencies
- **[LeetCode 2136: Earliest Possible Day of Full Bloom](https://leetcode.com/problems/earliest-possible-day-of-full-bloom/)** - Plant growing with planting time and growth duration

### Graph Theory Problems

- **[LeetCode 802: Find Eventual Safe States](https://leetcode.com/problems/find-eventual-safe-states/)** - Find nodes in cycles or leading to cycles
- **[LeetCode 851: Loud and Rich](https://leetcode.com/problems/loud-and-rich/)** - Quietest person with more money using topological ordering
- **[LeetCode 1136: Parallel Courses](https://leetcode.com/problems/parallel-courses/)** - Check if all courses can be completed (simplified version)
- **[LeetCode 1557: Minimum Number of Vertices to Reach All Nodes](https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes/)** - Find source nodes to reach all nodes

---

## Video Tutorial Links

### Kahn's Algorithm (BFS) Tutorials

- [Topological Sort - Kahn's Algorithm | BFS | Graph | GeeksforGeeks](https://www.youtube.com/watch?v=nN-gl_2MbqU) - Comprehensive explanation with examples
- [Kahn's Algorithm for Topological Sort - LeetCode](https://www.youtube.com/watch?v=dis_c9dG5CQ) - LeetCode-focused walkthrough
- [Topological Sort Using Kahn's Algorithm - Abdul Bari](https://www.youtube.com/watch?v=ILu2g0bV6Ow) - Detailed algorithmic explanation

### DFS-Based Topological Sort

- [Topological Sort - DFS Approach - GeeksforGeeks](https://www.youtube.com/watch?v=P2Tc-6iY7yI) - DFS method with cycle detection
- [LeetCode Course Schedule II - DFS Solution](https://www.youtube.com/watch?v=w6M5d4Z0wWo) - Python DFS implementation

### Course Schedule Specific

- [LeetCode 210: Course Schedule II | Topological Sort](https://www.youtube.com/watch?v=SSJRZV9qa4M) - Complete solution walkthrough
- [Course Schedule I & II - Complete Explanation](https://www.youtube.com/watch?v=M6L3jT9Nnqw) - Both problems explained
- [NeetCode Course Schedule II](https://www.youtube.com/watch?v=Akt3glAwyfY) - Visual explanation with step-by-step

---

## Follow-up Questions

### Q1: How do you handle disconnected graphs in Kahn's algorithm?

**Answer:** Both BFS and DFS naturally handle disconnected graphs. In Kahn's algorithm, initialize the queue with ALL nodes having indegree 0 from all components. The algorithm will process each component sequentially. If a cycle exists in any component, not all nodes will be processed, and the result length will be less than total nodes.

### Q2: What if we want to find ALL possible valid orderings (not just one)?

**Answer:** Use backtracking to explore all topological sorts. At each step, maintain a list of nodes with indegree 0, recursively try each one, decrement indegrees accordingly, and collect all valid sequences. Time complexity is O(k × V!) where k is the average branching factor. This is only feasible for small graphs.

### Q3: How would you modify Kahn's algorithm to prioritize nodes with more dependents first?

**Answer:** Use a max-heap (priority queue) instead of a regular queue. At each step, select the node with the highest outdegree (most dependents) among those with indegree 0. This ensures nodes that unlock more other nodes are processed earlier.

### Q4: How do you detect if there are multiple valid orderings?

**Answer:** In Kahn's algorithm, if at any point the queue contains more than one node with indegree 0, multiple valid orderings exist. In DFS, you can track if there are multiple choices at any point. For a definitive count, use DP with bitmasking (feasible only for small graphs, typically V ≤ 20).

### Q5: What is the difference between topological sort and DFS finish times?

**Answer:** DFS finish times (post-order) naturally give nodes in reverse topological order. When performing DFS and recording nodes as you backtrack (finish time), then reversing that list yields a valid topological sort. Kahn's algorithm produces topological order directly without reversal.

### Q6: How would you solve this problem if courses could be taken in parallel?

**Answer:** Use Kahn's algorithm with a priority queue or simply a queue. At each semester/step, take ALL courses with indegree 0 (in parallel). Count semesters until all courses are completed. This is the approach used in "Parallel Courses III" (LeetCode 2050).

### Q7: How do you verify that a given ordering is valid without recomputing?

**Answer:** Precompute the index of each course in the ordering, then for each edge `b → a`, verify `index[b] < index[a]`. This verification is O(E). For each course (except first), check that all prerequisites appear earlier in the list.

### Q8: What happens if there are duplicate edges in the input?

**Answer:** According to most problem constraints, all edges are distinct. If duplicates exist, use a set or ignore duplicates when building the graph. Unchecked duplicates would incorrectly inflate indegrees and break the algorithm.

### Q9: How would you modify the solution to return courses in reverse topological order?

**Answer:** In Kahn's algorithm, prepend to the result list instead of appending, or simply reverse the final result. In DFS, return the order directly without reversing (post-order gives reverse topological order).

### Q10: What are the key differences between Kahn's algorithm and DFS-based topological sort?

**Answer:** Kahn's is iterative with explicit cycle detection (if order.length < V). DFS has more complex state management (3 states) but often produces more intuitive code for those familiar with recursion. Kahn's requires building an indegree array; DFS requires a visit state array. Both are O(V + E) with similar constant factors.

---

## Common Pitfalls

| Pitfall | Solution |
|---------|----------|
| **Incorrect indegree calculation** | Remember: indegree counts incoming edges (prerequisites), not outgoing |
| **Missing cycle detection** | Always check if result contains all nodes |
| **Wrong node indexing** | Ensure 0-based indexing or handle node labels correctly |
| **Unconnected components** | Initialize queue with ALL nodes having indegree 0 |
| **Nodes with no edges** | Include isolated nodes in initialization and final check |
| **Recursion depth (DFS)** | Use iterative version for large graphs |
| **Modifying indegrees incorrectly** | Decrement AFTER processing a node, not before |
| **Queue initialization** | Include ALL source nodes, not just the first one found |

---

## Template Summary

### Kahn's Algorithm (BFS) - Quick Template

```python
def topological_sort(num_nodes, edges):
    graph = defaultdict(list)
    indegree = [0] * num_nodes
    
    for u, v in edges:
        graph[u].append(v)
        indegree[v] += 1
    
    queue = deque([i for i in range(num_nodes) if indegree[i] == 0])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        for neighbor in graph[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)
    
    return result if len(result) == num_nodes else []
```

### DFS Topological Sort - Quick Template

```python
def topological_sort_dfs(num_nodes, edges):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
    
    visit = [0] * num_nodes
    order = []
    
    def dfs(node):
        if visit[node] == 1:
            return False  # Cycle
        if visit[node] == 2:
            return True
        visit[node] = 1
        for neighbor in graph[node]:
            if not dfs(neighbor):
                return False
        visit[node] = 2
        order.append(node)
        return True
    
    for i in range(num_nodes):
        if visit[i] == 0 and not dfs(i):
            return []
    
    return order[::-1]
```

---

## Summary

Kahn's algorithm is a powerful BFS-based approach for topological sorting and cycle detection in directed acyclic graphs. Its iterative nature makes it suitable for large graphs, while the clear step-by-step process makes it easy to implement and debug. Understanding both Kahn's algorithm and the DFS-based alternative provides flexibility in solving various dependency-related problems on LeetCode and in real-world applications.
