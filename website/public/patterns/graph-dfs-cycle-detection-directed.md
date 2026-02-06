# Graph DFS - Cycle Detection (Directed Graph)

## Overview

Cycle detection in directed graphs is a fundamental graph problem where we determine whether a directed graph contains any cycles (closed paths that start and end at the same vertex). A cycle exists when you can start at a vertex and follow directed edges to return to the same vertex.

This pattern is essential for:
- Detecting deadlocks in operating systems
- Validating dependency graphs (e.g., package managers, build systems)
- Checking for circular dependencies in code
- Topological sorting validation
- Detecting infinite loops in workflow systems

## Key Concepts

- **Directed Graph**: A graph where edges have a direction (u → v means u points to v)
- **Cycle**: A path of at least one edge that starts and ends at the same vertex
- **Recursion Stack**: Tracks nodes currently being visited during DFS
- **Three-State Tracking**: Uses states to distinguish between unvisited, visiting, and visited nodes
- **Back Edge**: An edge pointing to a node currently in the recursion stack (indicates a cycle)

## Intuition

The core insight is that during DFS traversal of a directed graph:

1. **Undirected vs Directed Cycles**: In undirected graphs, a cycle exists if we encounter an already-visited neighbor. In directed graphs, this is more complex because edges have directions.

2. **Recursion Stack**: When we visit a node, we add it to the "recursion stack" (call stack). If during traversal we encounter a node that's already in the recursion stack, we've found a cycle.

3. **Three States**: Instead of just tracking visited/not visited, we use three states:
   - `0` (UNVISITED): Node hasn't been processed yet
   - `1` (VISITING): Node is currently in the recursion stack
   - `2` (VISITED): Node and all its descendants have been fully processed

4. **Cycle Detection Rule**: If we encounter a neighbor that's in the `VISITING` state, a cycle exists.

---

## Approach 1: DFS with Three States (Color Method)

### Algorithm Steps

1. **Build the adjacency list** from the directed graph edges
2. **Initialize a visit array** with three states (0=UNVISITED, 1=VISITING, 2=VISITED)
3. **For each unvisited node**, perform DFS:
   - Mark current node as VISITING
   - For each neighbor:
     - If VISITING → Cycle detected!
     - If UNVISITED → Recurse
   - After processing all neighbors, mark as VISITED
4. **Return** whether a cycle was found

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def hasCycle(self, graph: List[List[int]]) -> bool:
        """
        Detect if a directed graph contains a cycle.
        
        Args:
            graph: Adjacency list where graph[i] contains all nodes j such that i -> j
            
        Returns:
            True if cycle exists, False otherwise
        """
        n = len(graph)
        visit = [0] * n  # 0: unvisited, 1: visiting, 2: visited
        on_stack = [False] * n  # Alternative: use a set to track recursion stack
        
        def dfs(node: int) -> bool:
            if visit[node] == 1:  # Found a back edge to a node in recursion stack
                return True
            if visit[node] == 2:  # Already fully processed
                return False
            
            # Mark as visiting (in recursion stack)
            visit[node] = 1
            on_stack[node] = True
            
            # Recurse on all neighbors
            for neighbor in graph[node]:
                if dfs(neighbor):
                    return True
            
            # Mark as visited (removed from recursion stack)
            visit[node] = 2
            on_stack[node] = False
            return False
        
        # Check all nodes (handles disconnected graphs)
        for node in range(n):
            if visit[node] == 0:
                if dfs(node):
                    return True
        
        return False

# Alternative implementation using recursion stack directly
class SolutionAlt:
    def hasCycle(self, graph: List[List[int]]) -> bool:
        n = len(graph)
        visit = [0] * n  # 0: unvisited, 1: visiting, 2: visited
        
        def dfs(node: int) -> bool:
            if visit[node] == 1:
                return True  # Back edge found
            if visit[node] == 2:
                return False  # Already processed
            
            visit[node] = 1
            for neighbor in graph[node]:
                if dfs(neighbor):
                    return True
            visit[node] = 2
            return False
        
        for node in range(n):
            if visit[node] == 0:
                if dfs(node):
                    return True
        return False
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_set>
using namespace std;

class Solution {
public:
    bool hasCycle(vector<vector<int>>& graph) {
        int n = graph.size();
        vector<int> visit(n, 0);  // 0: unvisited, 1: visiting, 2: visited
        
        function<bool(int)> dfs = [&](int node) -> bool {
            if (visit[node] == 1) {
                return true;  // Back edge found
            }
            if (visit[node] == 2) {
                return false;  // Already processed
            }
            
            visit[node] = 1;
            for (int neighbor : graph[node]) {
                if (dfs(neighbor)) {
                    return true;
                }
            }
            visit[node] = 2;
            return false;
        };
        
        for (int node = 0; node < n; node++) {
            if (visit[node] == 0) {
                if (dfs(node)) {
                    return true;
                }
            }
        }
        return false;
    }
};

// Alternative with recursion stack tracking
class SolutionAlt {
public:
    bool hasCycle(vector<vector<int>>& graph) {
        int n = graph.size();
        vector<int> visit(n, 0);
        vector<bool> onStack(n, false);
        
        function<bool(int)> dfs = [&](int node) -> bool {
            if (onStack[node]) return true;
            if (visit[node] == 2) return false;
            
            visit[node] = 1;
            onStack[node] = true;
            
            for (int neighbor : graph[node]) {
                if (dfs(neighbor)) return true;
            }
            
            visit[node] = 2;
            onStack[node] = false;
            return false;
        };
        
        for (int node = 0; node < n; node++) {
            if (visit[node] == 0) {
                if (dfs(node)) return true;
            }
        }
        return false;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public boolean hasCycle(int[][] graph) {
        int n = graph.length;
        int[] visit = new int[n];  // 0: unvisited, 1: visiting, 2: visited
        boolean[] onStack = new boolean[n];
        
        for (int node = 0; node < n; node++) {
            if (visit[node] == 0) {
                if (dfs(node, graph, visit, onStack)) {
                    return true;
                }
            }
        }
        return false;
    }
    
    private boolean dfs(int node, int[][] graph, int[] visit, boolean[] onStack) {
        if (onStack[node]) {
            return true;  // Back edge to node in recursion stack
        }
        if (visit[node] == 2) {
            return false;  // Already processed
        }
        
        visit[node] = 1;
        onStack[node] = true;
        
        for (int neighbor : graph[node]) {
            if (dfs(neighbor, graph, visit, onStack)) {
                return true;
            }
        }
        
        visit[node] = 2;
        onStack[node] = false;
        return false;
    }
}

// Alternative using only visit states
class SolutionAlt {
    public boolean hasCycle(int[][] graph) {
        int n = graph.length;
        int[] visit = new int[n];  // 0: unvisited, 1: visiting, 2: visited
        
        for (int node = 0; node < n; node++) {
            if (visit[node] == 0) {
                if (dfs(node, graph, visit)) {
                    return true;
                }
            }
        }
        return false;
    }
    
    private boolean dfs(int node, int[][] graph, int[] visit) {
        if (visit[node] == 1) {
            return true;  // Back edge found
        }
        if (visit[node] == 2) {
            return false;  // Already processed
        }
        
        visit[node] = 1;
        for (int neighbor : graph[node]) {
            if (dfs(neighbor, graph, visit)) {
                return true;
            }
        }
        visit[node] = 2;
        return false;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} graph - Adjacency list representation
 * @return {boolean}
 */
var hasCycle = function(graph) {
    const n = graph.length;
    const visit = new Array(n).fill(0);  // 0: unvisited, 1: visiting, 2: visited
    const onStack = new Array(n).fill(false);
    
    const dfs = (node) => {
        if (onStack[node]) {
            return true;  // Back edge found
        }
        if (visit[node] === 2) {
            return false;  // Already processed
        }
        
        visit[node] = 1;
        onStack[node] = true;
        
        for (const neighbor of graph[node]) {
            if (dfs(neighbor)) {
                return true;
            }
        }
        
        visit[node] = 2;
        onStack[node] = false;
        return false;
    };
    
    for (let node = 0; node < n; node++) {
        if (visit[node] === 0) {
            if (dfs(node)) {
                return true;
            }
        }
    }
    return false;
};

// Alternative with explicit recursion stack check
var hasCycleAlt = function(graph) {
    const n = graph.length;
    const visit = new Array(n).fill(0);
    
    const dfs = (node) => {
        if (visit[node] === 1) {
            return true;  // Back edge found
        }
        if (visit[node] === 2) {
            return false;  // Already processed
        }
        
        visit[node] = 1;
        for (const neighbor of graph[node]) {
            if (dfs(neighbor)) {
                return true;
            }
        }
        visit[node] = 2;
        return false;
    };
    
    for (let node = 0; node < n; node++) {
        if (visit[node] === 0) {
            if (dfs(node)) {
                return true;
            }
        }
    }
    return false;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(V + E), where V = vertices, E = edges. Each node and edge is visited exactly once. |
| **Space** | O(V), for the visit array and recursion stack. |

---

## Approach 2: Union-Find (Disjoint Set Union)

### Algorithm Steps

1. **Initialize DSU** with each node as its own parent
2. **For each directed edge** (u → v):
   - Find the root of u and v
   - If roots are the same → cycle detected!
   - Otherwise, union them
3. **Return** whether a cycle was found

**Note**: Union-Find works for undirected graphs, but can be adapted for directed graphs with some modifications. This approach is less common for pure cycle detection but useful in certain scenarios.

### Code Implementation

````carousel
```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])  # Path compression
        return self.parent[x]
    
    def union(self, x, y):
        rootX = self.find(x)
        rootY = self.find(y)
        
        if rootX == rootY:
            return False  # Already in same set - potential cycle
        
        # Union by rank
        if self.rank[rootX] < self.rank[rootY]:
            self.parent[rootX] = rootY
        elif self.rank[rootX] > self.rank[rootY]:
            self.parent[rootY] = rootX
        else:
            self.parent[rootY] = rootX
            self.rank[rootX] += 1
        return True

def hasCycleUF(n, edges):
    """
    Detect cycle using Union-Find.
    Note: This works best for undirected graphs.
    For directed graphs, DFS is preferred.
    """
    uf = UnionFind(n)
    
    for u, v in edges:
        if not uf.union(u, v):
            return True  # Cycle detected
    
    return False
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class UnionFind {
private:
    vector<int> parent;
    vector<int> rank;
    
public:
    UnionFind(int n) : parent(n), rank(n, 0) {
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }
    
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);  // Path compression
        }
        return parent[x];
    }
    
    bool unionSets(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        
        if (rootX == rootY) {
            return false;  // Already in same set - cycle detected
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
};

bool hasCycleUF(int n, vector<vector<int>>& edges) {
    UnionFind uf(n);
    
    for (const auto& edge : edges) {
        int u = edge[0];
        int v = edge[1];
        if (!uf.unionSets(u, v)) {
            return true;  // Cycle detected
        }
    }
    return false;
}
```

<!-- slide -->
```java
import java.util.*;

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
    
    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);  // Path compression
        }
        return parent[x];
    }
    
    public boolean unionSets(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        
        if (rootX == rootY) {
            return false;  // Already in same set
        }
        
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
}

public boolean hasCycleUF(int n, int[][] edges) {
    UnionFind uf = new UnionFind(n);
    
    for (int[] edge : edges) {
        int u = edge[0];
        int v = edge[1];
        if (!uf.unionSets(u, v)) {
            return true;  // Cycle detected
        }
    }
    return false;
}
```

<!-- slide -->
```javascript
class UnionFind {
    constructor(n) {
        this.parent = Array.from({ length: n }, (_, i) => i);
        this.rank = new Array(n).fill(0);
    }
    
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);  // Path compression
        }
        return this.parent[x];
    }
    
    unionSets(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX === rootY) {
            return false;  // Already in same set
        }
        
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
}

/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {boolean}
 */
var hasCycleUF = function(n, edges) {
    const uf = new UnionFind(n);
    
    for (const [u, v] of edges) {
        if (!uf.unionSets(u, v)) {
            return true;  // Cycle detected
        }
    }
    return false;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(E × α(V)), where α is the inverse Ackermann function (practically constant) |
| **Space** | O(V), for parent and rank arrays |

**Note**: Union-Find is primarily for undirected graphs. For directed graphs, DFS is the preferred approach.

---

## Approach 3: BFS (Kahn's Algorithm for Cycle Detection)

### Algorithm Steps

1. **Build the adjacency list** and compute **indegrees** for each node
2. **Initialize a queue** with all nodes having indegree 0
3. **Process nodes**:
   - Dequeue a node and add to result
   - For each neighbor, decrement its indegree
   - If neighbor's indegree becomes 0, enqueue it
4. **Cycle Detection**: If the number of processed nodes < total nodes, a cycle exists

### Code Implementation

````carousel
```python
from collections import deque
from typing import List

def hasCycleBFS(n: int, edges: List[List[int]]) -> bool:
    """
    Detect cycle using Kahn's Algorithm (BFS-based topological sort).
    
    Args:
        n: Number of nodes
        edges: List of directed edges [u, v] meaning u -> v
        
    Returns:
        True if cycle exists, False otherwise
    """
    # Build adjacency list
    graph = [[] for _ in range(n)]
    indegree = [0] * n
    
    for u, v in edges:
        graph[u].append(v)
        indegree[v] += 1
    
    # Queue all nodes with indegree 0
    queue = deque([i for i in range(n) if indegree[i] == 0])
    visited_count = 0
    
    while queue:
        node = queue.popleft()
        visited_count += 1
        
        for neighbor in graph[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)
    
    # If not all nodes were visited, there's a cycle
    return visited_count != n
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
using namespace std;

bool hasCycleBFS(int n, vector<vector<int>>& edges) {
    vector<vector<int>> graph(n);
    vector<int> indegree(n, 0);
    
    for (const auto& edge : edges) {
        int u = edge[0];
        int v = edge[1];
        graph[u].push_back(v);
        indegree[v]++;
    }
    
    queue<int> q;
    for (int i = 0; i < n; i++) {
        if (indegree[i] == 0) {
            q.push(i);
        }
    }
    
    int visited_count = 0;
    while (!q.empty()) {
        int node = q.front();
        q.pop();
        visited_count++;
        
        for (int neighbor : graph[node]) {
            indegree[neighbor]--;
            if (indegree[neighbor] == 0) {
                q.push(neighbor);
            }
        }
    }
    
    return visited_count != n;
}
```

<!-- slide -->
```java
import java.util.*;

public boolean hasCycleBFS(int n, int[][] edges) {
    List<List<Integer>> graph = new ArrayList<>();
    int[] indegree = new int[n];
    
    for (int i = 0; i < n; i++) {
        graph.add(new ArrayList<>());
    }
    
    for (int[] edge : edges) {
        int u = edge[0];
        int v = edge[1];
        graph.get(u).add(v);
        indegree[v]++;
    }
    
    Queue<Integer> q = new LinkedList<>();
    for (int i = 0; i < n; i++) {
        if (indegree[i] == 0) {
            q.offer(i);
        }
    }
    
    int visitedCount = 0;
    while (!q.isEmpty()) {
        int node = q.poll();
        visitedCount++;
        
        for (int neighbor : graph.get(node)) {
            indegree[neighbor]--;
            if (indegree[neighbor] == 0) {
                q.offer(neighbor);
            }
        }
    }
    
    return visitedCount != n;
}
```

<!-- slide -->
```javascript
/**
 * @param {number} n
 * @param {number[][]} edges
 * @return {boolean}
 */
var hasCycleBFS = function(n, edges) {
    const graph = Array.from({ length: n }, () => []);
    const indegree = new Array(n).fill(0);
    
    for (const [u, v] of edges) {
        graph[u].push(v);
        indegree[v]++;
    }
    
    const queue = [];
    for (let i = 0; i < n; i++) {
        if (indegree[i] === 0) {
            queue.push(i);
        }
    }
    
    let visitedCount = 0;
    while (queue.length > 0) {
        const node = queue.shift();
        visitedCount++;
        
        for (const neighbor of graph[node]) {
            indegree[neighbor]--;
            if (indegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }
    }
    
    return visitedCount !== n;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(V + E), each node and edge processed once |
| **Space** | O(V + E), for adjacency list, indegree array, and queue |

---

## Comparison of Approaches

| Aspect | DFS (Three States) | Union-Find | BFS (Kahn's) |
|--------|-------------------|------------|--------------|
| **Type** | Recursive | Iterative | Iterative |
| **Cycle Detection** | Explicit (back edge) | Implicit | Implicit (unprocessed nodes) |
| **Use Case** | General directed graphs | Undirected/special cases | Topological sort + cycle detection |
| **Space** | O(V) recursion stack | O(V) | O(V) queue |
| **Memory Limit** | Risk of stack overflow | Safer | Safest |
| **Flexibility** | Easy to extend | Limited | Also gives topological order |

---

## Common Pitfalls

1. **Not Using Three States**: Using only visited/unvisited leads to false positives in directed graphs. You MUST distinguish between "currently in recursion stack" and "fully processed".

2. **Missing Disconnected Components**: Always iterate through ALL nodes and start DFS from unvisited nodes.

3. **Stack Overflow**: For very deep graphs, DFS recursion may cause stack overflow. Consider iterative DFS or BFS.

4. **Confusing Edge Direction**: Remember edges are directed (u → v means u points to v).

5. **Self-Loops**: A self-loop (node → node) is always a cycle. Make sure your algorithm detects this.

6. **Multiple Edges**: Multiple edges between same nodes don't affect cycle detection but should be handled.

7. **Not Resetting State**: Ensure the VISITING state is properly managed when backtracking.

---

## Related Problems

### Easy
- **[LeetCode 207: Course Schedule](https://leetcode.com/problems/course-schedule/)** - Determine if you can finish all courses (cycle detection)
- **[LeetCode 210: Course Schedule II](https://leetcode.com/problems/course-schedule-ii/)** - Find a valid order + detect cycles

### Medium
- **[LeetCode 1462: Course Schedule IV](https://leetcode.com/problems/course-schedule-iv/)** - Query if one course is prerequisite of another
- **[LeetCode 269: Alien Dictionary](https://leetcode.com/problems/alien-dictionary/)** - Topological sort with constraints
- **[LeetCode 802: Find Eventual Safe States](https://leetcode.com/problems/find-eventual-safe-states/)** - Find nodes not in cycles
- **[LeetCode 1557: Minimum Number of Vertices to Reach All Nodes](https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes/)** - Find sources in DAG
- **[LeetCode 2050: Parallel Courses III](https://leetcode.com/problems/parallel-courses-iii/)** - Course scheduling with dependencies

### Hard
- **[LeetCode 212: Word Search II](https://leetcode.com/problems/word-search-ii/)** - Trie with DFS cycle detection
- **[LeetCode 1203: Sort Items by Dependencies](https://leetcode.com/problems/sort-items-by-dependencies/)** - Multi-level topological sort
- **[LeetCode 1361: Validate Binary Tree Nodes](https://leetcode.com/problems/validate-binary-tree-nodes/)** - Detect cycles in tree structure

---

## Video Tutorial Links

- **[Detect Cycle in a Directed Graph - GeeksforGeeks](https://www.youtube.com/watch?v=uzVUplmrqZU)** - Comprehensive DFS cycle detection explanation
- **[Course Schedule (LeetCode 207) - DFS and BFS Solutions](https://www.youtube.com/watch?v=rG2mLJ72-9A)** - Two approaches with code
- **[Detect Cycle in Directed Graph - Algorithms Made Easy](https://www.youtube.com/watch?v=nT1IVY1d1-k)** - Visual explanation
- **[Topological Sort and Cycle Detection - Khan's Algorithm](https://www.youtube.com/watch?v=IBxA5akDCjQ)** - BFS approach
- **[Cycle Detection in Graph - Interview Problem](https://www.youtube.com/watch?v=ac_y4aCsCYY)** - Practical interview tips

---

## Followup Questions

### Q1: How do you find all nodes that are part of a cycle?

**Answer**: Modify DFS to track the recursion stack. When a back edge is found, backtrack from the current node to the target node to collect all nodes in the cycle.

### Q2: How do you detect a cycle and also find the nodes involved?

**Answer**: Use DFS with parent tracking. When a back edge is found (to a VISITING node), backtrack using the parent pointers to collect all nodes in the cycle path.

### Q3: What's the difference between white, gray, and black state tracking?

**Answer**: This is another name for the three-state approach:
- **White (0)**: Unvisited, not yet explored
- **Gray (1)**: Currently in recursion stack (being processed)
- **Black (2)**: Fully processed (all descendants visited)

### Q4: How do you handle very large graphs without recursion?

**Answer**: Use **iterative DFS** with an explicit stack:
1. Push (node, iterator_index) to stack
2. Process neighbors using the iterator
3. Track states on stack rather than in recursion

### Q5: How does cycle detection differ in a functional programming paradigm?

**Answer**: In FP, use persistent data structures and track visited nodes in a persistent set. The algorithm remains O(V + E) but uses immutable state.

### Q6: What is a "cycle basis" and how would you find it?

**Answer**: A cycle basis is a set of fundamental cycles from which all other cycles can be derived. Found using spanning trees or by computing the null space of the incidence matrix.

### Q7: How do you detect cycles in a graph with weighted edges?

**Answer**: Edge weights don't affect cycle detection - the graph topology is what matters. Use the same DFS/BFS approaches.

### Q8: What's the difference between detecting a cycle and finding the shortest cycle?

**Answer**: Cycle detection is O(V + E) with DFS/BFS. Finding the shortest cycle requires BFS from each node, making it O(V × (V + E)).

### Q9: How do you detect multiple cycles efficiently?

**Answer**: DFS naturally detects all cycles. Each time you encounter a back edge to a VISITING node, you've found a cycle.

### Q10: How would you detect if adding an edge would create a cycle?

**Answer**: Temporarily add the edge and run cycle detection. Or more efficiently, check if the target node can reach the source node in the original graph (if yes, adding edge creates a cycle).
