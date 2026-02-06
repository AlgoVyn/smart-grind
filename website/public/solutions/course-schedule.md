# Course Schedule

## Problem Statement

There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [a_i, b_i]` indicates that you must take course `b_i` first if you want to take course `a_i`.

For example, the pair `[0, 1]` indicates that to take course `0`, you have to first take course `1`.

Return `true` if it is possible to finish all courses, otherwise return `false`.

---

### Input Format

- `int numCourses`: The number of courses.
- `vector<vector<int>> prerequisites`: A list of prerequisite pairs.

### Output Format

- `bool`: `true` if all courses can be finished, `false` otherwise.

### Constraints

- `1 <= numCourses <= 2000`
- `0 <= prerequisites.length <= numCourses * (numCourses - 1) / 2`
- `prerequisites[i].length == 2`
- `0 <= a_i, b_i < numCourses`
- `a_i != b_i`
- All the pairs `[a_i, b_i]` are **distinct**.

---

## Examples

### Example 1

**Input:**
```python
numCourses = 2
prerequisites = [[1, 0]]
```

**Output:**
```
true
```

**Explanation:** There are 2 courses. To take course 1, you must finish course 0 first. One valid order is `[0, 1]`.

---

### Example 2

**Input:**
```python
numCourses = 2
prerequisites = [[1, 0], [0, 1]]
```

**Output:**
```
false
```

**Explanation:** There is a cycle between course 0 and course 1, making it impossible to complete either.

---

### Example 3

**Input:**
```python
numCourses = 4
prerequisites = [[1, 0], [2, 0], [3, 1], [3, 2]]
```

**Output:**
```
true
```

**Explanation:** Course 0 has no prerequisites. Courses 1 and 2 depend on 0. Course 3 depends on both 1 and 2. The order `[0, 1, 2, 3]` is valid.

---

### Example 4 (Edge Case - Empty Prerequisites)

**Input:**
```python
numCourses = 1
prerequisites = []
```

**Output:**
```
true
```

**Explanation:** A single course with no prerequisites can always be completed.

---

## Intuition

This problem models course prerequisites as a **directed graph**, where:

- Each course is a node (`0` to `numCourses - 1`)
- An edge `b_i → a_i` means "take `b_i` before `a_i`" (`b_i` is a prerequisite for `a_i`)

The key insight is that **if the graph contains a cycle, it's impossible to complete all courses**. This is because in a cycle, each course depends on the next one, creating a circular dependency with no starting point.

### Key Insights

1. **Cycle Detection**: The problem reduces to detecting if the directed graph is acyclic (DAG - Directed Acyclic Graph)
2. **Topological Sort**: If the graph is a DAG, a topological ordering exists and all courses can be completed
3. **Multiple Valid Orders**: There may be many valid ways to order courses; we only need to determine if ANY valid order exists

---

## Multiple Approaches with Code

We'll cover three standard approaches:

1. **DFS with Three States (Color Method)**: Recursive approach tracking node states
2. **BFS (Kahn's Algorithm)**: Iterative approach using indegrees
3. **Union-Find**: Efficient for undirected cycle detection (adapted for directed)

---

### Approach 1: DFS with Three States (Color Method)

#### Algorithm Steps

1. **Build the adjacency list** from the prerequisite pairs
2. **Initialize a visit array** with three states:
   - `0` (WHITE/UNVISITED): Node hasn't been processed yet
   - `1` (GRAY/VISITING): Node is currently in the recursion stack
   - `2` (BLACK/VISITED): Node and all its descendants have been fully processed
3. **For each unvisited node**, perform DFS:
   - Mark current node as VISITING (GRAY)
   - For each neighbor:
     - If VISITING → Cycle detected! Return `false`
     - If UNVISITED → Recurse
   - After processing all neighbors, mark as VISITED (BLACK)
4. **Return** `true` if no cycles were found

#### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        """
        Detect if all courses can be finished using DFS with three states.
        
        Args:
            numCourses: Total number of courses
            prerequisites: List of [course, prerequisite] pairs
            
        Returns:
            True if all courses can be completed, False otherwise
        """
        # Build adjacency list: graph[course] = list of courses that depend on this course
        graph = [[] for _ in range(numCourses)]
        for course, prereq in prerequisites:
            graph[prereq].append(course)
        
        # 0 = unvisited (white), 1 = visiting (gray), 2 = visited (black)
        visit = [0] * numCourses
        
        def dfs(node: int) -> bool:
            # If we're visiting a node that's already in the recursion stack, cycle found!
            if visit[node] == 1:
                return False  # Cycle detected
            
            # If already fully processed, no need to revisit
            if visit[node] == 2:
                return True
            
            # Mark as visiting (in recursion stack)
            visit[node] = 1
            
            # Recurse on all dependents
            for dependent in graph[node]:
                if not dfs(dependent):
                    return False
            
            # Mark as visited (removed from recursion stack)
            visit[node] = 2
            return True
        
        # Check all nodes (handles disconnected graphs)
        for node in range(numCourses):
            if visit[node] == 0:
                if not dfs(node):
                    return False
        
        return True

# Alternative implementation with recursion stack tracking
class SolutionAlt:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        graph = [[] for _ in range(numCourses)]
        for course, prereq in prerequisites:
            graph[prereq].append(course)
        
        visit = [0] * numCourses
        on_stack = [False] * numCourses
        
        def dfs(node: int) -> bool:
            if on_stack[node]:
                return False  # Back edge found
            
            if visit[node] == 2:
                return True
            
            visit[node] = 1
            on_stack[node] = True
            
            for dependent in graph[node]:
                if not dfs(dependent):
                    return False
            
            visit[node] = 2
            on_stack[node] = False
            return True
        
        for node in range(numCourses):
            if visit[node] == 0:
                if not dfs(node):
                    return False
        
        return True
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_set>
using namespace std;

class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        // Build adjacency list
        vector<vector<int>> graph(numCourses);
        for (auto& prereq : prerequisites) {
            int course = prereq[0];
            int prereqCourse = prereq[1];
            graph[prereqCourse].push_back(course);
        }
        
        // 0: unvisited, 1: visiting, 2: visited
        vector<int> visit(numCourses, 0);
        
        function<bool(int)> dfs = [&](int node) -> bool {
            if (visit[node] == 1) {
                return false;  // Cycle detected
            }
            if (visit[node] == 2) {
                return true;   // Already processed
            }
            
            visit[node] = 1;
            for (int dependent : graph[node]) {
                if (!dfs(dependent)) {
                    return false;
                }
            }
            visit[node] = 2;
            return true;
        };
        
        for (int node = 0; node < numCourses; node++) {
            if (visit[node] == 0) {
                if (!dfs(node)) {
                    return false;
                }
            }
        }
        return true;
    }
};

// Alternative with explicit recursion stack
class SolutionAlt {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> graph(numCourses);
        for (auto& prereq : prerequisites) {
            graph[prereq[1]].push_back(prereq[0]);
        }
        
        vector<int> visit(numCourses, 0);
        vector<bool> onStack(numCourses, false);
        
        function<bool(int)> dfs = [&](int node) -> bool {
            if (onStack[node]) return false;
            if (visit[node] == 2) return true;
            
            visit[node] = 1;
            onStack[node] = true;
            
            for (int dependent : graph[node]) {
                if (!dfs(dependent)) return false;
            }
            
            visit[node] = 2;
            onStack[node] = false;
            return true;
        };
        
        for (int node = 0; node < numCourses; node++) {
            if (visit[node] == 0) {
                if (!dfs(node)) return false;
            }
        }
        return true;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        // Build adjacency list
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) {
            graph.add(new ArrayList<>());
        }
        
        for (int[] prereq : prerequisites) {
            int course = prereq[0];
            int prereqCourse = prereq[1];
            graph.get(prereqCourse).add(course);
        }
        
        // 0: unvisited, 1: visiting, 2: visited
        int[] visit = new int[numCourses];
        
        for (int node = 0; node < numCourses; node++) {
            if (visit[node] == 0) {
                if (!dfs(node, graph, visit)) {
                    return false;
                }
            }
        }
        return true;
    }
    
    private boolean dfs(int node, List<List<Integer>> graph, int[] visit) {
        if (visit[node] == 1) {
            return false;  // Cycle detected
        }
        if (visit[node] == 2) {
            return true;   // Already processed
        }
        
        visit[node] = 1;
        for (int dependent : graph.get(node)) {
            if (!dfs(dependent, graph, visit)) {
                return false;
            }
        }
        visit[node] = 2;
        return true;
    }
}

// Alternative with recursion stack tracking
class SolutionAlt {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < numCourses; i++) {
            graph.add(new ArrayList<>());
        }
        
        for (int[] prereq : prerequisites) {
            graph.get(prereq[1]).add(prereq[0]);
        }
        
        int[] visit = new int[numCourses];
        boolean[] onStack = new boolean[numCourses];
        
        for (int node = 0; node < numCourses; node++) {
            if (visit[node] == 0) {
                if (!dfs(node, graph, visit, onStack)) {
                    return false;
                }
            }
        }
        return true;
    }
    
    private boolean dfs(int node, List<List<Integer>> graph, int[] visit, boolean[] onStack) {
        if (onStack[node]) return false;
        if (visit[node] == 2) return true;
        
        visit[node] = 1;
        onStack[node] = true;
        
        for (int dependent : graph.get(node)) {
            if (!dfs(dependent, graph, visit, onStack)) return false;
        }
        
        visit[node] = 2;
        onStack[node] = false;
        return true;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
var canFinish = function(numCourses, prerequisites) {
    // Build adjacency list
    const graph = Array.from({ length: numCourses }, () => []);
    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);
    }
    
    // 0: unvisited, 1: visiting, 2: visited
    const visit = new Array(numCourses).fill(0);
    
    const dfs = (node) => {
        if (visit[node] === 1) {
            return false;  // Cycle detected
        }
        if (visit[node] === 2) {
            return true;   // Already processed
        }
        
        visit[node] = 1;
        for (const dependent of graph[node]) {
            if (!dfs(dependent)) {
                return false;
            }
        }
        visit[node] = 2;
        return true;
    };
    
    for (let node = 0; node < numCourses; node++) {
        if (visit[node] === 0) {
            if (!dfs(node)) {
                return false;
            }
        }
    }
    return true;
};

// Alternative with explicit recursion stack
var canFinishAlt = function(numCourses, prerequisites) {
    const graph = Array.from({ length: numCourses }, () => []);
    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);
    }
    
    const visit = new Array(numCourses).fill(0);
    const onStack = new Array(numCourses).fill(false);
    
    const dfs = (node) => {
        if (onStack[node]) return false;
        if (visit[node] === 2) return true;
        
        visit[node] = 1;
        onStack[node] = true;
        
        for (const dependent of graph[node]) {
            if (!dfs(dependent)) return false;
        }
        
        visit[node] = 2;
        onStack[node] = false;
        return true;
    };
    
    for (let node = 0; node < numCourses; node++) {
        if (visit[node] === 0) {
            if (!dfs(node)) return false;
        }
    }
    return true;
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(V + E), where V = numCourses (vertices), E = prerequisites.length (edges). Each node and edge is visited exactly once. |
| **Space** | O(V + E), for graph adjacency list and recursion stack. The visit array is O(V). |

---

### Approach 2: BFS (Kahn's Algorithm)

#### Algorithm Steps

1. **Build the adjacency list** and compute **indegrees** for each node
2. **Initialize a queue** with all nodes having indegree 0 (no prerequisites)
3. **Process nodes**:
   - Dequeue a node and increment the count of processed courses
   - For each dependent, decrement its indegree
   - If dependent's indegree becomes 0, enqueue it
4. **Cycle Detection**: If the count of processed courses < total courses, a cycle exists

#### Code Implementation

````carousel
```python
from collections import deque
from typing import List

class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        """
        Detect if all courses can be finished using Kahn's Algorithm (BFS).
        
        Args:
            numCourses: Total number of courses
            prerequisites: List of [course, prerequisite] pairs
            
        Returns:
            True if all courses can be completed, False otherwise
        """
        # Build adjacency list and indegree array
        graph = [[] for _ in range(numCourses)]
        indegree = [0] * numCourses
        
        for course, prereq in prerequisites:
            graph[prereq].append(course)  # prereq -> course
            indegree[course] += 1
        
        # Queue all courses with no prerequisites
        queue = deque([i for i in range(numCourses) if indegree[i] == 0])
        processed = 0
        
        while queue:
            course = queue.popleft()
            processed += 1
            
            # Reduce indegree of all dependents
            for dependent in graph[course]:
                indegree[dependent] -= 1
                if indegree[dependent] == 0:
                    queue.append(dependent)
        
        # If we processed all courses, no cycle exists
        return processed == numCourses
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> graph(numCourses);
        vector<int> indegree(numCourses, 0);
        
        for (auto& prereq : prerequisites) {
            int course = prereq[0];
            int prereqCourse = prereq[1];
            graph[prereqCourse].push_back(course);
            indegree[course]++;
        }
        
        queue<int> q;
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) {
                q.push(i);
            }
        }
        
        int processed = 0;
        while (!q.empty()) {
            int course = q.front();
            q.pop();
            processed++;
            
            for (int dependent : graph[course]) {
                indegree[dependent]--;
                if (indegree[dependent] == 0) {
                    q.push(dependent);
                }
            }
        }
        
        return processed == numCourses;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        List<List<Integer>> graph = new ArrayList<>();
        int[] indegree = new int[numCourses];
        
        for (int i = 0; i < numCourses; i++) {
            graph.add(new ArrayList<>());
        }
        
        for (int[] prereq : prerequisites) {
            int course = prereq[0];
            int prereqCourse = prereq[1];
            graph.get(prereqCourse).add(course);
            indegree[course]++;
        }
        
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < numCourses; i++) {
            if (indegree[i] == 0) {
                q.offer(i);
            }
        }
        
        int processed = 0;
        while (!q.isEmpty()) {
            int course = q.poll();
            processed++;
            
            for (int dependent : graph.get(course)) {
                indegree[dependent]--;
                if (indegree[dependent] == 0) {
                    q.offer(dependent);
                }
            }
        }
        
        return processed == numCourses;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
var canFinish = function(numCourses, prerequisites) {
    const graph = Array.from({ length: numCourses }, () => []);
    const indegree = new Array(numCourses).fill(0);
    
    for (const [course, prereq] of prerequisites) {
        graph[prereq].push(course);
        indegree[course]++;
    }
    
    const queue = [];
    for (let i = 0; i < numCourses; i++) {
        if (indegree[i] === 0) {
            queue.push(i);
        }
    }
    
    let processed = 0;
    while (queue.length > 0) {
        const course = queue.shift();
        processed++;
        
        for (const dependent of graph[course]) {
            indegree[dependent]--;
            if (indegree[dependent] === 0) {
                queue.push(dependent);
            }
        }
    }
    
    return processed === numCourses;
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(V + E), each node and edge processed once |
| **Space** | O(V + E), for adjacency list, indegree array, and queue |

---

### Approach 3: Union-Find (Disjoint Set Union)

#### Algorithm Steps

1. **Initialize DSU** with each course as its own parent
2. **For each prerequisite** (course, prereq):
   - Find the root of course and prereq
   - If roots are the same → cycle detected! Return `false`
   - Otherwise, union them
3. **Return** `true` if no cycles were found

**Note**: Union-Find is primarily designed for undirected graphs. For directed graphs with the prerequisite structure, it can detect cycles but may have limitations in some edge cases.

#### Code Implementation

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

class Solution:
    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:
        """
        Detect cycle using Union-Find.
        Note: Best suited for undirected graphs; use DFS/BFS for directed.
        """
        uf = UnionFind(numCourses)
        
        for course, prereq in prerequisites:
            # Edge: prereq -> course
            if not uf.union(prereq, course):
                return False  # Cycle detected
        
        return True
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
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    bool unionSets(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        
        if (rootX == rootY) {
            return false;
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
};

class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        UnionFind uf(numCourses);
        
        for (auto& prereq : prerequisites) {
            int course = prereq[0];
            int prereqCourse = prereq[1];
            if (!uf.unionSets(prereqCourse, course)) {
                return false;
            }
        }
        return true;
    }
};
```

<!-- slide -->
```java
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
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    public boolean unionSets(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        
        if (rootX == rootY) {
            return false;
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

class Solution {
    public boolean canFinish(int numCourses, int[][] prerequisites) {
        UnionFind uf = new UnionFind(numCourses);
        
        for (int[] prereq : prerequisites) {
            int course = prereq[0];
            int prereqCourse = prereq[1];
            if (!uf.unionSets(prereqCourse, course)) {
                return false;
            }
        }
        return true;
    }
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
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }
    
    unionSets(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX === rootY) {
            return false;
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
 * @param {number} numCourses
 * @param {number[][]} prerequisites
 * @return {boolean}
 */
var canFinish = function(numCourses, prerequisites) {
    const uf = new UnionFind(numCourses);
    
    for (const [course, prereq] of prerequisites) {
        if (!uf.unionSets(prereq, course)) {
            return false;
        }
    }
    return true;
};
```
````

#### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(E × α(V)), where α is the inverse Ackermann function (practically constant) |
| **Space** | O(V), for parent and rank arrays |

**Note**: Union-Find is best suited for undirected graphs. For directed graphs like this problem, DFS or BFS is more reliable.

---

## Comparison of Approaches

| Aspect | DFS (Three States) | BFS (Kahn's) | Union-Find |
|--------|-------------------|---------------|------------|
| **Type** | Recursive | Iterative | Iterative |
| **Cycle Detection** | Explicit (back edge) | Implicit (unprocessed nodes) | Implicit (same set) |
| **Space** | O(V) recursion stack | O(V) queue | O(V) |
| **Memory Limit** | Risk of stack overflow | Safer | Safest |
| **Intuition** | Tracks recursion stack | Topological sort | Disjoint sets |
| **Best For** | Most directed cycle problems | Topological sort + cycle detection | Undirected graphs |

**Recommendation**: Use **DFS** for most cases (intuitive cycle detection). Use **BFS** when you also need a valid ordering or when recursion depth is a concern.

---

## Common Pitfalls

1. **Wrong Edge Direction**: Remember that `prerequisites[i] = [a, b]` means edge `b → a`, not `a → b`
2. **Not Handling Disconnected Graphs**: Always iterate through ALL nodes, not just the first one
3. **Stack Overflow**: For very large graphs (2000+ nodes), recursion may cause stack overflow. Use BFS instead
4. **Confusing States**: Don't forget the three states: UNVISITED, VISITING, VISITED
5. **Self-Loops**: A self-loop (course → itself) should be detected as a cycle

---

## Related Problems

Based on similar themes (cycle detection, topological sort, dependency resolution):

- **[LeetCode 210: Course Schedule II](https://leetcode.com/problems/course-schedule-ii/)** - Return a valid course order (also uses cycle detection)
- **[LeetCode 1462: Course Schedule IV](https://leetcode.com/problems/course-schedule-iv/)** - Query if one course is prerequisite of another
- **[LeetCode 802: Find Eventual Safe States](https://leetcode.com/problems/find-eventual-safe-states/)** - Find nodes not in cycles (reverse graph + DFS)
- **[LeetCode 1557: Minimum Number of Vertices to Reach All Nodes](https://leetcode.com/problems/minimum-number-of-vertices-to-reach-all-nodes/)** - Find source nodes in DAG
- **[LeetCode 269: Alien Dictionary](https://leetcode.com/problems/alien-dictionary/)** - Topological sort with character constraints
- **[LeetCode 444: Sequence Reconstruction](https://leetcode.com/problems/sequence-reconstruction/)** - Verify unique topological order

---

## Video Tutorial Links

Here are some helpful YouTube tutorials explaining the problem and solutions:

- **[Detect Cycle in Directed Graph - GeeksforGeeks](https://www.youtube.com/watch?v=uzVUplmrqZU)** - Comprehensive DFS cycle detection explanation
- **[Course Schedule (LeetCode 207) - DFS and BFS Solutions](https://www.youtube.com/watch?v=rG2mLJ72-9A)** - Two approaches with code walkthrough
- **[Detect Cycle in Directed Graph - Algorithms Made Easy](https://www.youtube.com/watch?v=nT1IVY1d1-k)** - Visual explanation of the algorithm
- **[Topological Sort and Cycle Detection - Khan's Algorithm](https://www.youtube.com/watch?v=IBxA5akDCjQ)** - BFS approach explanation
- **[Course Schedule - LeetCode 207 (NeetCode)](https://www.youtube.com/watch?v=idmgG1zCIaA)** - Problem walkthrough with solutions

---

## Followup Questions

### Q1: How would you return a valid course order along with cycle detection?

**Answer**: Use the DFS approach but record nodes in post-order (when backtracking), then reverse the list. This gives a valid topological order. If a cycle is detected during DFS, return an empty array.

---

### Q2: What if courses can be taken in parallel (multiple at once)?

**Answer**: Use Kahn's algorithm (BFS). At each step, take ALL courses with indegree 0 in parallel. Count the number of semesters needed to complete all courses.

---

### Q3: How do you detect multiple cycles efficiently?

**Answer**: DFS naturally detects all cycles. Each time you encounter a back edge to a VISITING node, you've found a cycle. The algorithm continues to find all cycles.

---

### Q4: What's the difference between white, gray, and black state tracking?

**Answer**: This is another name for the three-state approach:
- **White (0)**: Node not yet discovered
- **Gray (1)**: Node discovered, being processed (in recursion stack)
- **Black (2)**: Node and all descendants fully processed

A gray-to-gray edge indicates a cycle.

---

### Q5: How would you handle the case where the graph is disconnected?

**Answer**: Both BFS and DFS naturally handle disconnected graphs. In BFS, initialize the queue with ALL nodes having indegree 0. In DFS, iterate through all nodes and start DFS from any unvisited node.

---

### Q6: How do you detect a cycle and also find the nodes involved?

**Answer**: When a back edge is found, backtrack from the current node to the target node using parent pointers to collect all nodes in the cycle.

---

### Q7: What is the difference between detecting a cycle and finding the shortest cycle?

**Answer**: Cycle detection is O(V + E) with DFS/BFS. Finding the shortest cycle requires BFS from each node, making it O(V × (V + E)).

---

### Q8: How would you modify the solution to return the minimum number of semesters needed?

**Answer**: Use Kahn's algorithm. Each "level" of BFS represents one semester. Continue until all courses are processed. The number of levels is the minimum semesters.

---

### Q9: What are the key differences between Kahn's algorithm and DFS-based topological sort?

**Answer**: 
- Kahn's uses indegrees and a queue; DFS uses visit states and recursion
- Kahn's naturally produces topological order; DFS requires reversal
- Kahn's can detect cycles by checking if processed count < total nodes
- DFS cycle detection is more intuitive for many developers

---

### Q10: How would you verify that a given ordering is valid without recomputing?

**Answer**: For each course (except the first) in the ordering, check that all its prerequisites appear earlier. Build a position map for O(1) lookups, then verify each edge `prereq → course` has `position[prereq] < position[course]`.
