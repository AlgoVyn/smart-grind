# Find Eventual Safe States

## Problem Description

There is a directed graph of n nodes with each node labeled from 0 to n - 1. The graph is represented by a 0-indexed 2D integer array graph where graph[i] is an integer array of nodes adjacent to node i, meaning there is an edge from node i to each node in graph[i].

A node is a terminal node if there are no outgoing edges. A node is a safe node if every possible path starting from that node leads to a terminal node (or another safe node).

Return an array containing all the safe nodes of the graph. The answer should be sorted in ascending order.

**Link to problem:** [Find Eventual Safe States - LeetCode 802](https://leetcode.com/problems/find-eventual-safe-states/)

## Constraints
- `n == graph.length`
- `1 <= n <= 10^4`
- `0 <= graph[i].length <= n`
- `0 <= graph[i][j] <= n - 1`
- `graph[i]` is sorted in a strictly increasing order.
- The graph may contain self-loops.
- The number of edges in the graph will be in the range [1, 4 * 10^4].

---

## Pattern: DFS with State Tracking (Graph Cycle Detection)

This problem demonstrates the **DFS with State Tracking** pattern. The pattern detects cycles in directed graphs to identify safe states.

### Core Concept

- **Terminal Nodes**: Nodes with no outgoing edges are safe
- **Cycle Detection**: Nodes in cycles are not safe
- **State Tracking**: Track visiting and visited states during DFS

---

## Examples

### Example

**Input:**
```
graph = [[1,2],[2,3],[5],[0],[5],[],[]]
```

**Output:**
```
[2,4,5,6]
```

**Explanation:**
```
Node 0 → 1 → 2 → 5 (terminal)
Node 0 → 1 → 2 → 3 → 0 (cycle!)
Node 1 → 2 → 5 (terminal)
Node 2 → 5 (terminal)
Node 3 → 0 → ... (cycle)
Node 4 → 5 (terminal)
Node 5 (terminal) - safe
Node 6 (terminal) - safe
```

Safe nodes: 2, 4, 5, 6

### Example 2

**Input:**
```
graph = [[1,2,3,4],[1,2],[3,4],[0,4],[]]
```

**Output:**
```
[4]
```

**Explanation:**
- Node 4 is terminal (no outgoing edges) - safe
- Node 0 → 1 → 2 → 3 → 4 → terminal (safe path exists)
- But also 0 → 1 → 2 → 3 → 0 (cycle through node 0)
- Node 1 → 2 → 3 → 4 (safe)
- But also 1 → 2 → 3 → 1 (cycle through node 1)
- Node 2 → 3 → 4 (safe)
- But also 2 → 3 → 2 (cycle)
- Node 3 → 4 (safe)
- Node 3 → 0 → ... (cycle)
- Only node 4 is safe

---

## Intuition

The key insight is understanding safe nodes:

1. **Terminal = Safe**: Nodes with no outgoing edges are safe
2. **Reach Terminal = Safe**: If all paths from a node lead to terminal nodes
3. **Cycle = Not Safe**: Nodes in cycles can never reach a terminal
4. **Inverse Problem**: Find nodes NOT in cycles that can reach terminal

### Why DFS with State Tracking Works

- **Three States**: 0 (unvisited), 1 (visiting), 2 (safe/visited)
- **Cycle Detection**: If we encounter a "visiting" node, we found a cycle
- **Reverse Graph**: Often easier to think in terms of "terminal" and work backwards

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **DFS with State Tracking (Optimal)** - O(n + m) time
2. **Topological Sort (Reverse Graph)** - O(n + m) time

---

## Approach 1: DFS with State Tracking (Optimal)

This is the standard DFS approach with state tracking to detect cycles.

### Algorithm Steps

1. Create state array: 0 = unvisited, 1 = visiting, 2 = safe
2. For each node, run DFS:
   - If state[node] == 1: Found cycle, return False
   - If state[node] == 2: Already safe, return True
   - Mark as visiting (state = 1)
   - Recurse on all neighbors
   - If all neighbors safe, mark as safe (state = 2), return True
   - If any neighbor unsafe, return False
3. Collect all safe nodes

### Why It Works

DFS explores all paths from each node. By tracking states:
- Visiting nodes form the current DFS path
- If we encounter a visiting node, we've found a cycle
- Nodes that can reach terminal nodes without cycles are marked safe

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def eventualSafeNodes(self, graph: List[List[int]]) -> List[int]:
        n = len(graph)
        state = [0] * n  # 0: not visited, 1: visiting, 2: safe
        
        def dfs(node):
            if state[node] == 1:
                return False  # cycle detected
            if state[node] == 2:
                return True  # already determined safe
            
            state[node] = 1  # mark as visiting
            
            for nei in graph[node]:
                if not dfs(nei):
                    return False
            
            state[node] = 2  # mark as safe
            return True
        
        result = []
        for i in range(n):
            if dfs(i):
                result.append(i)
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<int> eventualSafeNodes(vector<vector<int>>& graph) {
        int n = graph.size();
        vector<int> state(n, 0);  // 0: not visited, 1: visiting, 2: safe
        
        function<bool(int)> dfs = [&](int node) -> bool {
            if (state[node] == 1) return false;  // cycle
            if (state[node] == 2) return true;   // already safe
            
            state[node] = 1;  // visiting
            
            for (int nei : graph[node]) {
                if (!dfs(nei)) return false;
            }
            
            state[node] = 2;  // safe
            return true;
        };
        
        vector<int> result;
        for (int i = 0; i < n; i++) {
            if (dfs(i)) result.push_back(i);
        }
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public List<Integer> eventualSafeNodes(int[][] graph) {
        int n = graph.length;
        int[] state = new int[n];  // 0: not visited, 1: visiting, 2: safe
        
        dfs(0, graph, state);  // Initialize state array
        
        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if (state[i] == 2) {
                result.add(i);
            }
        }
        return result;
    }
    
    private boolean dfs(int node, int[][] graph, int[] state) {
        if (state[node] == 1) return false;  // cycle
        if (state[node] == 2) return true;   // already safe
        
        state[node] = 1;  // visiting
        
        for (int nei : graph[node]) {
            if (!dfs(nei, graph, state)) return false;
        }
        
        state[node] = 2;  // safe
        return true;
    }
}
```

<!-- slide -->
```javascript
var eventualSafeNodes = function(graph) {
    const n = graph.length;
    const state = new Array(n).fill(0);  // 0: not visited, 1: visiting, 2: safe
    
    function dfs(node) {
        if (state[node] === 1) return false;  // cycle detected
        if (state[node] === 2) return true;   // already safe
        
        state[node] = 1;  // visiting
        
        for (const nei of graph[node]) {
            if (!dfs(nei)) return false;
        }
        
        state[node] = 2;  // safe
        return true;
    }
    
    const result = [];
    for (let i = 0; i < n; i++) {
        if (dfs(i)) result.push(i);
    }
    return result;
};
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + m) - each node and edge visited once |
| **Space** | O(n) - state array and recursion stack |

---

## Approach 2: Topological Sort (Reverse Graph)

This approach uses topological sort on the reverse graph.

### Algorithm Steps

1. Build reverse graph: for each edge u→v, add v→u in reverse graph
2. Find terminal nodes (nodes with no outgoing edges)
3. Perform BFS/DFS from terminal nodes in reverse graph
4. All visited nodes are safe

### Why It Works

In the reverse graph, starting from terminal nodes, we can reach all nodes that can eventually reach terminal in the original graph. This is the classic topological ordering approach.

### Code Implementation

````carousel
```python
from typing import List
from collections import deque, defaultdict

class Solution:
    def eventualSafeNodes(self, graph: List[List[int]]) -> List[int]:
        n = len(graph)
        
        # Build reverse graph and out-degree count
        reverse_graph = defaultdict(list)
        out_degree = [0] * n
        
        for node in range(n):
            for nei in graph[node]:
                reverse_graph[nei].append(node)
                out_degree[node] += 1
        
        # Start with terminal nodes (out-degree = 0)
        queue = deque()
        for i in range(n):
            if out_degree[i] == 0:
                queue.append(i)
        
        # BFS from terminal nodes
        safe = [False] * n
        while queue:
            node = queue.popleft()
            safe[node] = True
            
            for prev in reverse_graph[node]:
                out_degree[prev] -= 1
                if out_degree[prev] == 0:
                    queue.append(prev)
        
        return [i for i in range(n) if safe[i]]
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<int> eventualSafeNodes(vector<vector<int>>& graph) {
        int n = graph.size();
        
        // Build reverse graph
        vector<vector<int>> reverse_graph(n);
        vector<int> out_degree(n, 0);
        
        for (int i = 0; i < n; i++) {
            for (int j : graph[i]) {
                reverse_graph[j].push_back(i);
                out_degree[i]++;
            }
        }
        
        // BFS from terminal nodes
        queue<int> q;
        vector<int> safe(n, 0);
        
        for (int i = 0; i < n; i++) {
            if (out_degree[i] == 0) q.push(i);
        }
        
        while (!q.empty()) {
            int node = q.front();
            q.pop();
            safe[node] = 1;
            
            for (int prev : reverse_graph[node]) {
                if (--out_degree[prev] == 0) {
                    q.push(prev);
                }
            }
        }
        
        vector<int> result;
        for (int i = 0; i < n; i++) {
            if (safe[i]) result.push_back(i);
        }
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public List<Integer> eventualSafeNodes(int[][] graph) {
        int n = graph.length;
        
        // Build reverse graph
        List<List<Integer>> reverse_graph = new ArrayList<>();
        int[] out_degree = new int[n];
        
        for (int i = 0; i < n; i++) {
            reverse_graph.add(new ArrayList<>());
        }
        
        for (int i = 0; i < n; i++) {
            for (int j : graph[i]) {
                reverse_graph.get(j).add(i);
                out_degree[i]++;
            }
        }
        
        // BFS from terminal nodes
        Queue<Integer> queue = new LinkedList<>();
        boolean[] safe = new boolean[n];
        
        for (int i = 0; i < n; i++) {
            if (out_degree[i] == 0) queue.add(i);
        }
        
        while (!queue.isEmpty()) {
            int node = queue.poll();
            safe[node] = true;
            
            for (int prev : reverse_graph.get(node)) {
                if (--out_degree[prev] == 0) {
                    queue.add(prev);
                }
            }
        }
        
        List<Integer> result = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            if (safe[i]) result.add(i);
        }
        return result;
    }
}
```

<!-- slide -->
```javascript
var eventualSafeNodes = function(graph) {
    const n = graph.length;
    
    // Build reverse graph
    const reverse_graph = Array.from({length: n}, () => []);
    const out_degree = new Array(n).fill(0);
    
    for (let i = 0; i < n; i++) {
        for (const j of graph[i]) {
            reverse_graph[j].push(i);
            out_degree[i]++;
        }
    }
    
    // BFS from terminal nodes
    const queue = [];
    const safe = new Array(n).fill(false);
    
    for (let i = 0; i < n; i++) {
        if (out_degree[i] === 0) queue.push(i);
    }
    
    while (queue.length > 0) {
        const node = queue.shift();
        safe[node] = true;
        
        for (const prev of reverse_graph[node]) {
            if (--out_degree[prev] === 0) {
                queue.push(prev);
            }
        }
    }
    
    const result = [];
    for (let i = 0; i < n; i++) {
        if (safe[i]) result.push(i);
    }
    return result;
};
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + m) - each node and edge visited once |
| **Space** | O(n + m) - reverse graph storage |

---

## Comparison of Approaches

| Aspect | DFS with State | Topological Sort |
|--------|---------------|------------------|
| **Time Complexity** | O(n + m) | O(n + m) |
| **Space Complexity** | O(n) recursion | O(n + m) |
| **Implementation** | Recursive | Iterative (BFS) |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes |
| **Best For** | Understanding cycles | Clear visualization |

Both approaches are optimal; choose based on preference.

---

## Why DFS with State Tracking is Optimal

1. **Direct Cycle Detection**: Naturally finds cycles during traversal
2. **Memory Efficient**: Only needs state array, no reverse graph
3. **Clear Logic**: Each node's safety determined by its paths
4. **Industry Standard**: Common pattern for cycle detection

---

## Related Problems

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Course Schedule | [Link](https://leetcode.com/problems/course-schedule/) | Cycle detection in directed graph |
| Find Eventual Safe States | [Link](https://leetcode.com/problems/find-eventual-safe-states/) | Original problem |
| Longest Cycle in a Graph | [Link](https://leetcode.com/problems/longest-cycle-in-a-graph/) | Find longest cycle |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Course Schedule III | [Link](https://leetcode.com/problems/course-schedule-iii/) | Course scheduling with intervals |
| Parallel Courses | [Link](https://leetcode.com/problems/parallel-courses/) | Course completion with dependencies |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### DFS Approach

- [NeetCode - Find Eventual Safe States](https://www.youtube.com/watch?v=6aGj7c56s4Q) - Clear explanation
- [DFS Cycle Detection](https://www.youtube.com/watch?v=GYupHRWy1p8) - Understanding DFS states

### Graph Theory

- [Directed Graph Cycle Detection](https://www.youtube.com/watch?v=ddTCcxiivB4) - Cycle detection techniques
- [Topological Sort](https://www.youtube.com/watch?v=3N8yrcMB_EE) - Understanding topological ordering

---

## Follow-up Questions

### Q1: What is the difference between terminal nodes and safe nodes?

**Answer:** Terminal nodes have no outgoing edges and are always safe. Safe nodes are nodes from which all paths lead to terminal nodes (or other safe nodes).

---

### Q2: How does the algorithm handle self-loops?

**Answer:** A self-loop creates a cycle. If node i has an edge to itself (graph[i] contains i), then DFS will encounter state[i] == 1 when exploring, detect a cycle, and mark node i as unsafe.

---

### Q3: Can a node be safe if it has outgoing edges?

**Answer:** Yes! A node with outgoing edges can be safe if all paths from it eventually lead to terminal nodes. For example, in graph [[1], []], node 0 has an outgoing edge to node 1, but since node 1 is terminal, node 0 is safe.

---

### Q4: What is the time complexity if we run DFS from each node?

**Answer:** It's still O(n + m) because each node and edge is visited only once. The state tracking ensures we don't re-explore already visited nodes.

---

### Q5: How would you modify to find nodes that can reach specific terminal nodes?

**Answer:** Build a reverse graph from the terminal nodes and perform BFS/DFS. This is similar to Approach 2 (topological sort).

---

## Common Pitfalls

### 1. Not Tracking Visiting State
**Issue:** Missing cycle detection.

**Solution:** Use three states: unvisited (0), visiting (1), visited/safe (2).

### 2. Wrong State Assignment
**Issue:** Marking node as safe before checking all neighbors.

**Solution:** Only mark as safe after all recursive calls return True.

### 3. Not Handling Self-Loops
**Issue:** Self-loops not detected.

**Solution:** The state tracking handles self-loops naturally (encountering state == 1).

### 4. Stack Overflow for Deep Graphs
**Issue:** Recursion depth limit.

**Solution:** Use iterative approach (topological sort) for very deep graphs.

### 5. Forgetting to Sort Result
**Issue:** Result not in ascending order.

**Solution:** Iterate through nodes in order or sort the result.

---

## Summary

The **Find Eventual Safe States** problem demonstrates the **DFS with State Tracking** pattern:

- **DFS with State**: O(n + m) time, O(n) space - optimal solution
- **Topological Sort**: O(n + m) time, O(n + m) space - alternative solution

The key insight is that safe nodes are exactly those not part of any cycle that can reach terminal nodes. By tracking DFS states, we can detect cycles and identify safe nodes.

This problem is an excellent demonstration of cycle detection in directed graphs.

### Pattern Summary

This problem exemplifies the **DFS with State Tracking** pattern, characterized by:
- Three-state tracking (unvisited, visiting, visited)
- Cycle detection in directed graphs
- Recursive exploration with memoization
- Safe node identification

For more details on this pattern and its variations, see the **[Graph Cycle Detection Pattern](/patterns/graph-cycle-detection)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/find-eventual-safe-states/discuss/) - Community solutions
- [DFS Cycle Detection - GeeksforGeeks](https://www.geeksforgeeks.org/detect-cycle-in-a-graph-using-dfs/) - Understanding cycle detection
- [Topological Sort](https://www.geeksforgeeks.org/topological-sorting/) - Graph ordering
