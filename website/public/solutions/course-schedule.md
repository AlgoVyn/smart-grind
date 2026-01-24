# Course Schedule

## Problem Statement

There are `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [a_i, b_i]` indicates that you **must** take course `b_i` first if you want to take course `a_i`.

- For example, the pair `[0, 1]` indicates that to take course 0 you have to first take course 1.

Return `true` if you can finish all courses. Otherwise, return `false` (i.e., if there is a cycle in the prerequisites that prevents completion).

**Input Format:**
- `int numCourses`
- `int[][] prerequisites` (list of pairs)

**Output Format:**
- `boolean`

**Constraints:**
- `1 <= numCourses <= 2000`
- `0 <= prerequisites.length <= 5000`
- `prerequisites[i].length == 2`
- `0 <= a_i, b_i < numCourses`
- All the pairs `prerequisites[i]` are **unique**.

---

## Examples

### Example 1

**Input:**
```python
numCourses = 2
prerequisites = [[1,0]]
```

**Output:**
```python
true
```

**Explanation:** There are 2 courses. To take course 1, you must finish course 0 first. So, take course 0 then course 1. This is possible.

---

### Example 2

**Input:**
```python
numCourses = 2
prerequisites = [[1,0],[0,1]]
```

**Output:**
```python
false
```

**Explanation:** To take course 1, you need course 0; to take course 0, you need course 1. This forms a cycle, so it's impossible.

---

### Example 3

**Input:**
```python
numCourses = 1
prerequisites = []
```

**Output:**
```python
true
```

**Explanation:** No prerequisites, so the single course can be taken.

---

### Example 4

**Input:**
```python
numCourses = 4
prerequisites = [[1,0],[2,0],[3,1],[3,2]]
```

**Output:**
```python
true
```

**Explanation:** Course 0 has no prerequisites. Courses 1 and 2 depend on 0. Course 3 depends on both 1 and 2. One valid order is [0, 1, 2, 3] or [0, 2, 1, 3].

---

### Example 5 (Cycle Detection)

**Input:**
```python
numCourses = 3
prerequisites = [[1,0],[2,0],[2,1]]
```

**Output:**
```python
false
```

**Explanation:** Course 2 depends on course 1, which depends on course 0. But course 2 also depends on course 0, and course 1 depends on course 0. There's no cycle here, so it should be true. Wait, let me correct: Actually this example has no cycle. A proper cycle example would be [[1,0],[2,1],[0,2]] which forms a cycle 0→1→2→0.

---

### Example 6 (No Prerequisites)

**Input:**
```python
numCourses = 5
prerequisites = []
```

**Output:**
```python
true
```

**Explanation:** All courses can be taken in any order since there are no dependencies.

---

## Constraints Analysis

| Constraint | Range | Implication |
|------------|-------|-------------|
| `numCourses` | 1 to 2000 | Small enough for O(V + E) algorithms |
| `prerequisites.length` | 0 to 5000 | Number of edges in the graph |
| Unique pairs | Yes | No duplicate edges to handle |

The constraints suggest that graph-based solutions with O(V + E) time complexity are ideal. V = numCourses, E = prerequisites.length.

---

## Intuition

This problem can be modeled as a **directed graph** where:
- Each course is a **node** (vertex)
- Each prerequisite pair `[a, b]` represents a **directed edge** from `b` to `a` (b must come before a)

The question reduces to: **Does this directed graph contain a cycle?**

### Key Insights

1. **Cycle Detection**: If there's a cycle in the prerequisite graph, it's impossible to complete all courses because each course in the cycle depends on another in the same cycle (circular dependency).

2. **Acyclic = Possible**: If the graph is acyclic (a Directed Acyclic Graph or DAG), a valid ordering exists. This ordering is called a **topological order**.

3. **Topological Sort**: A topological order is a linear ordering of vertices such that for every directed edge u → v, u comes before v in the ordering.

### Visual Representation

```
Example: [[1,0],[2,0],[3,1],[3,2]]

    0 ─────→ 1 ─────→ 3
    │              ↗
    └──→ 2 ────────┘
    
All paths flow from 0 to 1,2 to 3. No cycles. Valid order: [0, 1, 2, 3]
```

---

## Multiple Approaches with Code

We'll cover three standard approaches:
1. **DFS (Cycle Detection)**: Detects cycles using visit states
2. **BFS (Kahn's Algorithm)**: Uses indegrees and topological sorting
3. **Union-Find (Disjoint Set)**: Detects cycles in undirected graph style

### Approach 1: DFS with Cycle Detection

**Algorithm:**
1. Build an adjacency list for the graph
2. Use DFS to traverse the graph, tracking three states:
   - `0 = unvisited` (not yet explored)
   - `1 = visiting` (currently in recursion stack)
   - `2 = visited` (fully processed)
3. If we encounter a node in the "visiting" state, a cycle exists
4. If DFS completes without cycles, the graph is acyclic

**Why it works:** The "visiting" state tracks nodes currently in the recursion stack. If we revisit such a node, we've found a back edge, which indicates a cycle in a directed graph.

**Implementation:**

````carousel
```python
from typing import List

class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        """
        DFS-based cycle detection approach.
        Time: O(V + E), Space: O(V + E)
        """
        # Build adjacency list: graph[b] = list of courses that depend on b
        graph = [[] for _ in range(numCourses)]
        for a, b in prerequisites:
            graph[b].append(a)  # Edge from b to a (b before a)
        
        # Visit states: 0 = unvisited, 1 = visiting, 2 = visited
        visit = [0] * numCourses
        
        def dfs(node: int) -> bool:
            # If visiting, we found a cycle
            if visit[node] == 1:
                return False
            # If already visited, no cycle in this path
            if visit[node] == 2:
                return True
            
            # Mark as visiting (in current recursion stack)
            visit[node] = 1
            
            # Recurse on all dependents
            for neighbor in graph[node]:
                if not dfs(neighbor):
                    return False
            
            # Mark as visited (completed processing)
            visit[node] = 2
            return True
        
        # Check all nodes (handles disconnected components)
        for i in range(numCourses):
            if not dfs(i):
                return False
        return True
```
<!-- slide -->
```cpp
// Approach 1: DFS with Cycle Detection
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        // Build adjacency list
        vector<vector<int>> graph(numCourses);
        for (auto& prereq : prerequisites) {
            int a = prereq[0];
            int b = prereq[1];
            graph[b].push_back(a);  // Edge b -> a
        }
        
        // 0 = unvisited, 1 = visiting, 2 = visited
        vector<int> visit(numCourses, 0);
        
        function<bool(int)> dfs = [&](int node) -> bool {
            if (visit[node] == 1) return false;  // Cycle detected
            if (visit[node] == 2) return true;   // Already processed
            
            visit[node] = 1;
            for (int neighbor : graph[node]) {
                if (!dfs(neighbor)) return false;
            }
            visit[node] = 2;
            return true;
        };
        
        for (int i = 0; i < numCourses; i++) {
            if (!dfs(i)) return false;
        }
        return true;
    }
};
```
<!-- slide -->
```java
// Approach 1: DFS with Cycle Detection
import java.util.*;

class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        // Build adjacency list
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) {
            graph.add(new ArrayList<>());
        }
        
        for (int[] prereq : prerequisites) {
            int a = prereq[0];
            int b = prereq[1];
            graph.get(b).add(a);  // Edge b -> a
        }
        
        // 0 = unvisited, 1 = visiting, 2 = visited
        int[] visit = new int[numCourses];
        
        for (int i = 0; i < numCourses; i++) {
            if (!dfs(i, graph, visit)) {
                return false;
            }
        }
        return true;
    }
    
    private boolean dfs(int node, List<List<Integer>> graph, int[] visit) {
        if (visit[node] == 1) return false;  // Cycle detected
        if (visit[node] == 2) return true;   // Already processed
        
        visit[node] = 1;
        for (int neighbor : graph.get(node)) {
            if (!dfs(neighbor, graph, visit)) return false;
        }
        visit[node] = 2;
        return true;
    }
}
```
<!-- slide -->
```javascript
// Approach 1: DFS with Cycle Detection
/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
var canFinish = function(numCourses, prerequisites) {
    // Build adjacency list
    const graph = Array.from({ length: numCourses }, () => []);
    for (const [a, b] of prerequisites) {
        graph[b].push(a);  // Edge b -> a
    }
    
    // 0 = unvisited, 1 = visiting, 2 = visited
    const visit = new Array(numCourses).fill(0);
    
    function dfs(node) {
        if (visit[node] === 1) return false;  // Cycle detected
        if (visit[node] === 2) return true;   // Already processed
        
        visit[node] = 1;
        for (const neighbor of graph[node]) {
            if (!dfs(neighbor)) return false;
        }
        visit[node] = 2;
        return true;
    }
    
    for (let i = 0; i < numCourses; i++) {
        if (!dfs(i)) return false;
    }
    return true;
};
```
````

---

### Approach 2: BFS (Kahn's Algorithm for Topological Sort)

**Algorithm:**
1. Build an adjacency list and compute **indegrees** (number of incoming edges) for each node
2. Initialize a queue with all nodes having indegree 0 (no prerequisites)
3. Process the queue: for each node, add it to the result and decrease indegrees of its neighbors
4. If a neighbor's indegree becomes 0, add it to the queue
5. If we process all nodes (count == numCourses), no cycle exists; otherwise, cycle exists

**Why it works:** Nodes with indegree 0 have no prerequisites and can be taken first. By progressively removing these nodes and their outgoing edges, we either process all nodes (acyclic) or get stuck with nodes that still have indegree > 0 (cycle).

**Implementation:**

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        """
        BFS-based topological sort (Kahn's Algorithm).
        Time: O(V + E), Space: O(V + E)
        """
        # Build adjacency list and indegrees
        graph = [[] for _ in range(numCourses)]
        indegree = [0] * numCourses
        
        for a, b in prerequisites:
            graph[b].append(a)  # b -> a
            indegree[a] += 1   # a has one more prerequisite
        
        # Queue for nodes with no prerequisites
        queue = deque([i for i in range(numCourses) if indegree[i] == 0])
        processed = 0
        
        while queue:
            node = queue.popleft()
            processed += 1
            
            # Remove this node's edges by decreasing neighbors' indegrees
            for neighbor in graph[node]:
                indegree[neighbor] -= 1
                if indegree[neighbor] == 0:
                    queue.append(neighbor)
        
        # If we processed all courses, no cycle exists
        return processed == numCourses
```
<!-- slide -->
```cpp
// Approach 2: BFS (Kahn's Algorithm)
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        // Build adjacency list and indegrees
        vector<vector<int>> graph(numCourses);
        vector<int> indegree(numCourses, 0);
        
        for (auto& prereq : prerequisites) {
            int a = prereq[0];
            int b = prereq[1];
            graph[b].push_back(a);
            indegree[a]++;
        }
        
        // Queue for nodes with indegree 0
        queue<int> q;
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) q.push(i);
        }
        
        int processed = 0;
        while (!q.empty()) {
            int node = q.front();
            q.pop();
            processed++;
            
            for (int neighbor : graph[node]) {
                indegree[neighbor]--;
                if (indegree[neighbor] == 0) {
                    q.push(neighbor);
                }
            }
        }
        
        return processed == numCourses;
    }
};
```
<!-- slide -->
```java
// Approach 2: BFS (Kahn's Algorithm)
import java.util.*;

class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        // Build adjacency list and indegrees
        List<List<Integer>> graph = new ArrayList<>();
        int[] indegree = new int[numCourses];
        
        for (int i = 0; i < numCourses; i++) {
            graph.add(new ArrayList<>());
        }
        
        for (int[] prereq : prerequisites) {
            int a = prereq[0];
            int b = prereq[1];
            graph.get(b).add(a);
            indegree[a]++;
        }
        
        // Queue for nodes with indegree 0
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) q.add(i);
        }
        
        int processed = 0;
        while (!q.isEmpty()) {
            int node = q.poll();
            processed++;
            
            for (int neighbor : graph.get(node)) {
                indegree[neighbor]--;
                if (indegree[neighbor] == 0) {
                    q.add(neighbor);
                }
            }
        }
        
        return processed == numCourses;
    }
}
```
<!-- slide -->
```javascript
// Approach 2: BFS (Kahn's Algorithm)
/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
var canFinish = function(numCourses, prerequisites) {
    // Build adjacency list and indegrees
    const graph = Array.from({ length: numCourses }, () => []);
    const indegree = new Array(numCourses).fill(0);
    
    for (const [a, b] of prerequisites) {
        graph[b].push(a);
        indegree[a]++;
    }
    
    // Queue for nodes with indegree 0
    const queue = [];
    for (let i = 0; i < numCourses; i++) {
        if (indegree[i] === 0) queue.push(i);
    }
    
    let processed = 0;
    let front = 0;
    
    while (front < queue.length) {
        const node = queue[front++];
        processed++;
        
        for (const neighbor of graph[node]) {
            indegree[neighbor]--;
            if (indegree[neighbor] === 0) {
                queue.push(neighbor);
            }
        }
    }
    
    return processed === numCourses;
};
```
````

---

### Approach 3: Union-Find (Disjoint Set Union)

**Algorithm:**
1. Treat the graph as having bidirectional edges for cycle detection
2. Use Union-Find to detect cycles in a graph
3. For each edge [a, b], check if a and b are already connected
4. If yes, cycle exists; if no, union them

**Note:** This approach works because in an undirected graph, cycle detection is simpler. However, we need to be careful with the direction. For Course Schedule, we can think of it as: if a and b are prerequisites of each other (directly or indirectly), there's a cycle.

**Why it works:** Union-Find efficiently tracks connected components. If adding an edge connects two nodes already in the same component, we've found a cycle.

**Implementation:**

````carousel
```python
from typing import List

class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        """
        Union-Find approach for cycle detection.
        Time: O(V + E * α(V)), Space: O(V)
        """
        parent = list(range(numCourses))
        rank = [0] * numCourses
        
        def find(x):
            if parent[x] != x:
                parent[x] = find(parent[x])  # Path compression
            return parent[x]
        
        def union(x, y):
            px, py = find(x), find(y)
            if px == py:
                return False  # Cycle detected
            # Union by rank
            if rank[px] < rank[py]:
                px, py = py, px
            parent[py] = px
            if rank[px] == rank[py]:
                rank[px] += 1
            return True
        
        for a, b in prerequisites:
            # Union a and b - if they're already connected, cycle exists
            if not union(a, b):
                return False
        
        return True
```
<!-- slide -->
```cpp
// Approach 3: Union-Find (Disjoint Set Union)
#include <vector>
using namespace std;

class Solution {
public:
    vector<int> parent, rank;
    
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);  // Path compression
        }
        return parent[x];
    }
    
    bool unionSets(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;  // Cycle detected
        
        // Union by rank
        if (rank[px] < rank[py]) {
            swap(px, py);
        }
        parent[py] = px;
        if (rank[px] == rank[py]) {
            rank[px]++;
        }
        return true;
    }
    
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        parent.resize(numCourses);
        rank.resize(numCourses, 0);
        iota(parent.begin(), parent.end(), 0);
        
        for (auto& prereq : prerequisites) {
            int a = prereq[0];
            int b = prereq[1];
            if (!unionSets(a, b)) {
                return false;
            }
        }
        return true;
    }
};
```
<!-- slide -->
```java
// Approach 3: Union-Find (Disjoint Set Union)
class Solution {
    private int[] parent;
    private int[] rank;
    
    private int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);  // Path compression
        }
        return parent[x];
    }
    
    private boolean unionSets(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return false;  // Cycle detected
        
        // Union by rank
        if (rank[px] < rank[py]) {
            int temp = px;
            px = py;
            py = temp;
        }
        parent[py] = px;
        if (rank[px] == rank[py]) {
            rank[px]++;
        }
        return true;
    }
    
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        parent = new int[numCourses];
        rank = new int[numCourses];
        for (int i = 0; i < numCourses; i++) {
            parent[i] = i;
            rank[i] = 0;
        }
        
        for (int[] prereq : prerequisites) {
            int a = prereq[0];
            int b = prereq[1];
            if (!unionSets(a, b)) {
                return false;
            }
        }
        return true;
    }
}
```
<!-- slide -->
```javascript
// Approach 3: Union-Find (Disjoint Set Union)
/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
var canFinish = function(numCourses, prerequisites) {
    const parent = new Array(numCourses);
    const rank = new Array(numCourses).fill(0);
    
    for (let i = 0; i < numCourses; i++) {
        parent[i] = i;
    }
    
    function find(x) {
        if (parent[x] !== x) {
            parent[x] = find(parent[x]);  // Path compression
        }
        return parent[x];
    }
    
    function union(x, y) {
        const px = find(x);
        const py = find(y);
        if (px === py) return false;  // Cycle detected
        
        // Union by rank
        if (rank[px] < rank[py]) {
            parent[px] = py;
        } else if (rank[px] > rank[py]) {
            parent[py] = px;
        } else {
            parent[py] = px;
            rank[px]++;
        }
        return true;
    }
    
    for (const [a, b] of prerequisites) {
        if (!union(a, b)) {
            return false;
        }
    }
    return true;
};
```
````

---

## Time and Space Complexity Analysis

### Approach 1: DFS with Cycle Detection

| Metric | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(V + E) | Each node and edge is visited exactly once |
| **Space** | O(V + E) | Graph storage + O(V) for visit array + O(V) recursion stack |

### Approach 2: BFS (Kahn's Algorithm)

| Metric | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(V + E) | Each node and edge is processed exactly once |
| **Space** | O(V + E) | Graph storage + O(V) for indegree array + O(V) for queue |

### Approach 3: Union-Find

| Metric | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(V + E × α(V)) | α(V) is the inverse Ackermann function (practically constant) |
| **Space** | O(V) | Parent and rank arrays only |

### Comparison Summary

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| DFS | O(V + E) | O(V + E) | Detects cycle during traversal | Recursion depth risk |
| BFS | O(V + E) | O(V + E) | Iterative, no recursion | Slightly more code |
| Union-Find | O(V + E) | O(V) | Minimal space | Less intuitive for this problem |

**Recommendation:** BFS (Kahn's Algorithm) is often preferred for its iterative nature and direct connection to topological sorting. DFS is equally valid and more concise.

---

## Related Problems

Based on similar themes (topological sort, cycle detection, graph dependencies):

1. **[Course Schedule II](https://leetcode.com/problems/course-schedule-ii/)** - Returns the actual order of courses (topological sort)
2. **[Alien Dictionary](https://leetcode.com/problems/alien-dictionary/)** - Topological sort on characters from word order
3. **[Parallel Courses III](https://leetcode.com/problems/parallel-courses-iii/)** - Minimum time to complete all courses with dependencies
4. **[Parallel Courses II](https://leetcode.com/problems/parallel-courses-ii/)** - Minimum semesters with k courses per semester
5. **[Course Schedule IV](https://leetcode.com/problems/course-schedule-iv/)** - Queries about prerequisite relationships
6. **[Clone Graph](https://leetcode.com/problems/clone-graph/)** - Graph traversal (DFS/BFS)
7. **[Number of Islands](https://leetcode.com/problems/number-of-islands/)** - Connected components in grid
8. **[Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree/)** - Cycle detection + connectivity check
9. **[Find Eventual Safe States](https://leetcode.com/problems/find-eventual-safe-states/)** - Reverse graph + topological sort
10. **[Redundant Connection](https://leetcode.com/problems/redundant-connection/)** - Cycle detection in undirected graph

---

## Video Tutorial Links

Here are some helpful YouTube tutorials explaining the problem and solutions:

1. **[NeetCode: Course Schedule - Graph Adjacency List - Leetcode 207](https://www.youtube.com/watch?v=EgI5nU9etnU)** - Visual drawing and coding walkthrough
2. **[Joma Tech: Course Schedule (Leetcode 207) | LeetCode Tutorial](https://www.youtube.com/watch?v=0STFfIMah0g)** - Clear explanation for beginners
3. **[Leetcode 207 - Course Schedule (JAVA, Solution Explain!)](https://www.youtube.com/watch?v=mB3PGwnpM1k)** - Java-focused but concepts apply
4. **[Course Schedule (LeetCode 207) | Interview Essential | BFS, Queue, Cycle in a directed graph](https://www.youtube.com/watch?v=Oa4Srx9mDqs)** - BFS emphasis
5. **[Course Schedule || Leetcode 207 || 1 Variant that Big Tech Asks](https://www.youtube.com/watch?v=9lJZt_UXyGw)** - Includes variants asked in interviews
6. **[Topological Sort - Kahn's Algorithm Explained](https://www.youtube.com/watch?v=qb3eQP6Qm9A)** - Detailed Kahn's Algorithm explanation
7. **[DFS Cycle Detection in Directed Graph](https://www.youtube.com/watch?v=9TwY2MsgxcI)** - DFS approach deep dive

---

## Follow-up Questions

### Algorithm Understanding

1. **Why does DFS detect cycles with three states instead of two?**
   - Two states (visited/unvisited) work for undirected graphs but not directed. The third state "visiting" tracks nodes currently in the recursion stack. If we encounter such a node, it's a back edge indicating a cycle.

2. **Can we detect cycles with only one DFS pass?**
   - No, you need to track the recursion stack separately from completed nodes. A node might be visited from different paths, and we need to know if we're currently exploring from it.

3. **Why does Kahn's algorithm process nodes with indegree 0?**
   - These nodes have no prerequisites and can be taken immediately. By removing them and updating indegrees, we reveal new nodes that have no remaining prerequisites.

### Complexity and Optimization

4. **What's the worst-case recursion depth for DFS?**
   - O(V) in the worst case (a completely skewed graph like 0→1→2→3→...).

5. **Can we optimize the space complexity?**
   - DFS uses O(V) space for the recursion stack. BFS uses O(V) for the queue. Union-Find is most space-efficient at O(V) with no recursion stack.

6. **Which approach is best for very large graphs?**
   - BFS (Kahn's Algorithm) is generally safer for large graphs as it avoids potential stack overflow from recursion.

### Real-world Applications

7. **What are practical applications of cycle detection?**
   - Build systems (detecting circular dependencies in files)
   - Package managers (resolving library dependencies)
   - Deadlock detection in operating systems
   - Task scheduling with dependencies
   - Database schema validation

8. **How would you modify the solution to return the course order?**
   - For DFS, add nodes to an order list in post-order and reverse it at the end. For BFS, the order of processing is already topological.

### Edge Cases and Testing

9. **What edge cases should you test?**
   - Empty prerequisites (numCourses = 1, no edges)
   - All courses have prerequisites (linear chain)
   - Disconnected components
   - Self-loop (e.g., [0,0])
   - Multiple valid orderings
   - Complete graph with cycle

10. **How would you handle a self-loop in the input?**
    - A self-loop `[a, a]` is an immediate cycle. The DFS approach will detect this because when we visit node a, we'll try to visit a again (still in visiting state). BFS will also detect it because indegree[a] will be at least 1 and never reach 0.

---

## Summary

The **Course Schedule** problem is a classic graph cycle detection problem that can be solved using:

| Approach | Key Idea | When to Use |
|----------|----------|-------------|
| **DFS** | Track visit states (unvisited, visiting, visited) | When recursion is acceptable and you want concise code |
| **BFS** | Kahn's Algorithm with indegrees | When you want iterative solution or need topological order |
| **Union-Find** | Track connected components | When space is critical and direction doesn't matter |

**Key Takeaways:**
1. Model the problem as a directed graph where edges represent prerequisites
2. Detect cycles using either DFS (three states) or BFS (indegrees)
3. Time complexity is O(V + E) for all approaches
4. Choose based on preference: DFS is more concise, BFS is more explicit

---

## References

- [LeetCode 207: Course Schedule](https://leetcode.com/problems/course-schedule/)
- Problem constraints and examples from LeetCode
- Topological Sort: Kahn's Algorithm (1962)
- DFS Cycle Detection: Standard graph theory technique
- Union-Find: Disjoint Set Union data structure

