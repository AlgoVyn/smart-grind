# Longest Cycle in a Graph

## Problem Description

You are given a directed graph of `n` nodes numbered from `0` to `n - 1`, where each node has at most one outgoing edge. The graph is represented with a given 0-indexed array `edges` of size `n`, indicating that there is a directed edge from node `i` to node `edges[i]`. If there is no outgoing edge from node `i`, then `edges[i] == -1`.

Return the length of the longest cycle in the graph. If no cycle exists, return `-1`.

A **cycle** is a path that starts and ends at the same node.

**Link to problem:** [Longest Cycle in a Graph - LeetCode 2360](https://leetcode.com/problems/longest-cycle-in-a-graph/)

---

## Pattern: Graph Traversal - DFS with State Tracking

This problem demonstrates the **DFS with State Tracking** pattern. We use three states to track node visitation and detect cycles.

### Core Concept

The fundamental idea is:
- Use DFS to traverse the graph
- Track state: 0 = unvisited, 1 = currently in recursion stack, 2 = fully processed
- Track the step number when each node was first visited
- When we encounter a node in state 1, we've found a cycle
- Cycle length = current step - step when the node was first visited + 1

---

## Examples

### Example

**Input:**
```
edges = [3, 3, 4, 2, 3]
```

**Output:**
```
3
```

**Explanation:** 
The longest cycle in the graph is 2 → 4 → 3 → 2.
- Node 2 points to 4
- Node 4 points to 3
- Node 3 points to 2
- Length = 3

### Example 2

**Input:**
```
edges = [2, -1, 3, 1]
```

**Output:**
```
-1
```

**Explanation:** There are no cycles in this graph.

### Example 3

**Input:**
```
edges = [1, 2, 0]
```

**Output:**
```
3
```

**Explanation:** There's a cycle 0 → 1 → 2 → 0 of length 3.

---

## Constraints

- `n == edges.length`
- `2 <= n <= 10^5`
- `-1 <= edges[i] < n`
- `edges[i] != i`

---

## Intuition

The key insight is that each node has at most one outgoing edge, so the graph is a collection of directed paths and cycles. We can use DFS to explore from each unvisited node, tracking when we enter each node. When we encounter a node that's currently being visited (in the recursion stack), we've found a cycle.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **DFS with State Tracking** - O(n) time (Optimal)
2. **Topological Sort** - Alternative approach using indegree

---

## Approach 1: DFS with State Tracking (Optimal)

### Algorithm Steps

1. Initialize state array: 0 = unvisited, 1 = visiting, 2 = visited
2. Initialize step array to track when each node was first visited
3. For each node:
   - If unvisited, start DFS from that node
   - Track current step number
   - When exploring a neighbor:
     - If neighbor is unvisited, recurse
     - If neighbor is visiting, we've found a cycle
     - Cycle length = current_step - step[neighbor] + 1
   - Mark current node as visited
4. Track maximum cycle length found
5. Return -1 if no cycle, otherwise return max length

### Why It Works

By tracking the step number when each node is first visited, we can calculate cycle length when we encounter a node that's still in the recursion stack. The length is the difference between current step and the step when that node was first visited.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def longestCycle(self, edges: List[int]) -> int:
        """
        Find the longest cycle in a directed graph.
        
        Args:
            edges: Array where edges[i] is the node i points to
            
        Returns:
            Length of longest cycle, or -1 if none exists
        """
        n = len(edges)
        state = [0] * n  # 0: not visited, 1: visiting, 2: visited
        step = [-1] * n  # Step when node was first visited
        max_len = -1
        curr_step = 0
        
        def dfs(node: int) -> None:
            nonlocal max_len, curr_step
            
            state[node] = 1  # Mark as visiting
            step[node] = curr_step
            curr_step += 1
            
            nei = edges[node]
            if nei != -1:
                if state[nei] == 0:
                    dfs(nei)
                elif state[nei] == 1:
                    # Found a cycle
                    cycle_len = curr_step - step[nei]
                    max_len = max(max_len, cycle_len)
            
            state[node] = 2  # Mark as visited
            curr_step -= 1
        
        for i in range(n):
            if state[i] == 0:
                curr_step = 0
                dfs(i)
        
        return max_len
```

<!-- slide -->
```cpp
class Solution {
public:
    int longestCycle(vector<int>& edges) {
        /**
         * Find the longest cycle in a directed graph.
         * 
         * Args:
         *     edges: Array where edges[i] is the node i points to
         * 
         * Returns:
         *     Length of longest cycle, or -1 if none exists
         */
        int n = edges.size();
        vector<int> state(n, 0);  // 0: not visited, 1: visiting, 2: visited
        vector<int> step(n, -1);  // Step when node was first visited
        int max_len = -1;
        
        function<void(int, int&)> dfs = [&](int node, int& curr_step) {
            state[node] = 1;
            step[node] = curr_step;
            curr_step++;
            
            int nei = edges[node];
            if (nei != -1) {
                if (state[nei] == 0) {
                    dfs(nei, curr_step);
                } else if (state[nei] == 1) {
                    int cycle_len = curr_step - step[nei];
                    max_len = max(max_len, cycle_len);
                }
            }
            
            state[node] = 2;
            curr_step--;
        };
        
        for (int i = 0; i < n; i++) {
            if (state[i] == 0) {
                int curr_step = 0;
                dfs(i, curr_step);
            }
        }
        
        return max_len;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int longestCycle(int[] edges) {
        /**
         * Find the longest cycle in a directed graph.
         * 
         * Args:
         *     edges: Array where edges[i] is the node i points to
         * 
         * Returns:
         *     Length of longest cycle, or -1 if none exists
         */
        int n = edges.length;
        int[] state = new int[n];  // 0: not visited, 1: visiting, 2: visited
        int[] step = new int[n];   // Step when node was first visited
        Arrays.fill(step, -1);
        
        int[] maxLen = {-1};
        
        dfs(edges, 0, state, step, maxLen);
        
        return maxLen[0];
    }
    
    private int dfs(int[] edges, int node, int[] state, int[] step, int[] maxLen) {
        int currStep = 0;
        return dfsHelper(edges, node, state, step, maxLen, currStep);
    }
    
    private int dfsHelper(int[] edges, int node, int[] state, int[] step, int[] maxLen, int currStep) {
        // This is a simplified version - actual implementation would need careful step tracking
        return 0;
    }
}
```

Note: The Java implementation is complex due to step tracking. Here's a proper version:
```java
class Solution {
    public int longestCycle(int[] edges) {
        int n = edges.length;
        int[] state = new int[n];
        int[] step = new int[n];
        Arrays.fill(step, -1);
        
        int maxLen = -1;
        int[] currStep = {0};
        
        for (int i = 0; i < n; i++) {
            if (state[i] == 0) {
                currStep[0] = 0;
                dfs(i, edges, state, step, maxLen, currStep);
            }
        }
        
        return maxLen;
    }
    
    private void dfs(int node, int[] edges, int[] state, int[] step, int maxLen, int[] currStep) {
        state[node] = 1;
        step[node] = currStep[0]++;
        
        int nei = edges[node];
        if (nei != -1) {
            if (state[nei] == 0) {
                dfs(nei, edges, state, step, maxLen, currStep);
            } else if (state[nei] == 1) {
                int cycleLen = currStep[0] - step[nei];
                maxLen = Math.max(maxLen, cycleLen);
            }
        }
        
        state[node] = 2;
        currStep[0]--;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find the longest cycle in a directed graph.
 * 
 * @param {number[]} edges - Array where edges[i] is the node i points to
 * @return {number} - Length of longest cycle, or -1 if none exists
 */
var longestCycle = function(edges) {
    const n = edges.length;
    const state = new Array(n).fill(0);  // 0: not visited, 1: visiting, 2: visited
    const step = new Array(n).fill(-1);   // Step when node was first visited
    let maxLen = -1;
    
    function dfs(node, currStep) {
        state[node] = 1;
        step[node] = currStep;
        
        const nei = edges[node];
        if (nei !== -1) {
            if (state[nei] === 0) {
                dfs(nei, currStep + 1);
            } else if (state[nei] === 1) {
                const cycleLen = currStep + 1 - step[nei];
                maxLen = Math.max(maxLen, cycleLen);
            }
        }
        
        state[node] = 2;
    }
    
    for (let i = 0; i < n; i++) {
        if (state[i] === 0) {
            dfs(i, 0);
        }
    }
    
    return maxLen;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node visited at most once |
| **Space** | O(n) - For state and step arrays, plus recursion stack |

---

## Approach 2: Topological Sort (Alternative)

### Algorithm Steps

1. Calculate indegree for each node
2. Use Kahn's algorithm (BFS-based topological sort):
   - Start with nodes having indegree 0
   - Remove them and decrease indegrees of their neighbors
   - Track which nodes get removed
3. Any nodes not removed are part of cycles
4. For remaining nodes, run DFS to find cycle lengths
5. Return maximum cycle length found

### Why It Works

Topological sort only works on DAGs (directed acyclic graphs). By removing nodes with indegree 0, we eliminate all acyclic paths. The remaining nodes must be part of cycles. We can then find cycles among these remaining nodes.

### Code Implementation

````carousel
```python
from typing import List
from collections import deque, defaultdict

class Solution:
    def longestCycle(self, edges: List[int]) -> int:
        """
        Find the longest cycle using Topological Sort.
        
        Args:
            edges: List where edges[i] = node that node i points to
            
        Returns:
            Length of longest cycle, or -1 if none exists
        """
        n = len(edges)
        
        # Calculate indegrees
        indegree = [0] * n
        for i in range(n):
            if edges[i] != -1:
                indegree[edges[i]] += 1
        
        # Find nodes part of cycles using topological sort
        in_cycle = [True] * n
        queue = deque()
        
        for i in range(n):
            if indegree[i] == 0:
                queue.append(i)
                in_cycle[i] = False
        
        # Remove nodes with indegree 0 (not in cycles)
        while queue:
            node = queue.popleft()
            next_node = edges[node]
            if next_node != -1:
                indegree[next_node] -= 1
                if indegree[next_node] == 0:
                    queue.append(next_node)
                    in_cycle[next_node] = False
        
        # For nodes in cycles, find the longest cycle length
        result = -1
        visited = [False] * n
        
        for i in range(n):
            if in_cycle[i] and not visited[i]:
                # Start DFS from this cycle node
                cycle_length = 0
                current = i
                while not visited[current]:
                    visited[current] = True
                    cycle_length += 1
                    current = edges[current]
                
                # Check if we returned to starting node of this component
                if cycle_length > result:
                    result = cycle_length
        
        return result
```

<!-- slide -->
```cpp
class Solution {
public:
    int longestCycle(vector<int>& edges) {
        int n = edges.size();
        
        // Calculate indegrees
        vector<int> indegree(n, 0);
        for (int i = 0; i < n; i++) {
            if (edges[i] != -1) {
                indegree[edges[i]]++;
            }
        }
        
        // Find nodes in cycles using topological sort
        vector<bool> inCycle(n, true);
        queue<int> q;
        
        for (int i = 0; i < n; i++) {
            if (indegree[i] == 0) {
                q.push(i);
                inCycle[i] = false;
            }
        }
        
        while (!q.empty()) {
            int node = q.front(); q.pop();
            int next = edges[node];
            if (next != -1) {
                indegree[next]--;
                if (indegree[next] == 0) {
                    q.push(next);
                    inCycle[next] = false;
                }
            }
        }
        
        // Find longest cycle among nodes in cycles
        int result = -1;
        vector<bool> visited(n, false);
        
        for (int i = 0; i < n; i++) {
            if (inCycle[i] && !visited[i]) {
                int cycleLength = 0;
                int current = i;
                while (!visited[current]) {
                    visited[current] = true;
                    cycleLength++;
                    current = edges[current];
                }
                result = max(result, cycleLength);
            }
        }
        
        return result;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int longestCycle(int[] edges) {
        int n = edges.length;
        
        // Calculate indegrees
        int[] indegree = new int[n];
        for (int i = 0; i < n; i++) {
            if (edges[i] != -1) {
                indegree[edges[i]]++;
            }
        }
        
        // Find nodes in cycles using topological sort
        boolean[] inCycle = new boolean[n];
        Arrays.fill(inCycle, true);
        Queue<Integer> queue = new LinkedList<>();
        
        for (int i = 0; i < n; i++) {
            if (indegree[i] == 0) {
                queue.add(i);
                inCycle[i] = false;
            }
        }
        
        while (!queue.isEmpty()) {
            int node = queue.poll();
            int next = edges[node];
            if (next != -1) {
                indegree[next]--;
                if (indegree[next] == 0) {
                    queue.add(next);
                    inCycle[next] = false;
                }
            }
        }
        
        // Find longest cycle among nodes in cycles
        int result = -1;
        boolean[] visited = new boolean[n];
        
        for (int i = 0; i < n; i++) {
            if (inCycle[i] && !visited[i]) {
                int cycleLength = 0;
                int current = i;
                while (!visited[current]) {
                    visited[current] = true;
                    cycleLength++;
                    current = edges[current];
                }
                result = Math.max(result, cycleLength);
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
var longestCycle = function(edges) {
    const n = edges.length;
    
    // Calculate indegrees
    const indegree = new Array(n).fill(0);
    for (let i = 0; i < n; i++) {
        if (edges[i] !== -1) {
            indegree[edges[i]]++;
        }
    }
    
    // Find nodes in cycles using topological sort
    const inCycle = new Array(n).fill(true);
    const queue = [];
    
    for (let i = 0; i < n; i++) {
        if (indegree[i] === 0) {
            queue.push(i);
            inCycle[i] = false;
        }
    }
    
    while (queue.length > 0) {
        const node = queue.shift();
        const next = edges[node];
        if (next !== -1) {
            indegree[next]--;
            if (indegree[next] === 0) {
                queue.push(next);
                inCycle[next] = false;
            }
        }
    }
    
    // Find longest cycle among nodes in cycles
    let result = -1;
    const visited = new Array(n).fill(false);
    
    for (let i = 0; i < n; i++) {
        if (inCycle[i] && !visited[i]) {
            let cycleLength = 0;
            let current = i;
            while (!visited[current]) {
                visited[current] = true;
                cycleLength++;
                current = edges[current];
            }
            result = Math.max(result, cycleLength);
        }
    }
    
    return result;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Each node processed at most twice |
| **Space** | O(n) - For indegree and visited arrays |

---

## Comparison of Approaches

| Aspect | DFS with State Tracking | Topological Sort |
|--------|------------------------|------------------|
| **Time** | O(n) | O(n) |
| **Space** | O(n) recursion stack | O(n) |
| **Implementation** | Recursive | Iterative |
| **Concept** | Detect cycles during traversal | Remove non-cycle nodes first |

---

## Related Problems

Based on similar themes (cycle detection, graph traversal):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Detect Cycle in Directed Graph | [Link](https://leetcode.com/problems/detect-cycle-in-a-directed-graph/) | Basic cycle detection |
| Find Eventual Safe States | [Link](https://leetcode.com/problems/find-eventual-safe-states/) | Find nodes not in cycles |
| Course Schedule | [Link](https://leetcode.com/problems/course-schedule/) | Cycle detection in dependencies |
| Redundant Connection | [Link](https://leetcode.com/problems/redundant-connection/) | Find cycle in undirected graph |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Cycle Detection

- [NeetCode - Longest Cycle in Graph](https://www.youtube.com/watch?v=0u2sk1tXW1s) - Clear explanation
- [DFS Cycle Detection](https://www.youtube.com/watch?v=0H2miH_j3Rk) - Understanding DFS states
- [Graph Traversal](https://www.youtube.com/watch?v=pcKY4hjDrxk) - DFS and BFS

---

## Follow-up Questions

### Q1: Why do we need three states for each node?

**Answer:** Three states help distinguish between:
- Unvisited (0): Node not yet explored
- Visiting (1): Node currently in recursion stack (part of current path)
- Visited (2): Node fully processed (no cycles through this node)

This prevents false cycle detection from already-processed nodes.

---

### Q2: How does the step tracking help calculate cycle length?

**Answer:** When we first visit a node, we record the step number. When we encounter the same node again while it's still "visiting", the difference between current step and recorded step gives the cycle length.

---

### Q3: Can this problem be solved with BFS?

**Answer:** BFS is less natural for this problem because cycles are better detected with DFS's recursion stack. However, you could use topological sort: nodes not in cycles get removed, remaining nodes form cycles.

---

### Q4: What makes each node have at most one outgoing edge?

**Answer:** This constraint makes the problem easier. The graph becomes a collection of paths (linked lists) that may connect to cycles. Each component has at most one cycle.

---

### Q5: How would you find the actual cycle nodes?

**Answer:** When a cycle is detected, you can backtrack from current node to the node where the cycle starts, collecting all nodes in the cycle.

---

### Q6: What edge cases should be tested?

**Answer:**
- No cycles (all -1 or tree structure)
- Single node cycle (node pointing to itself, though edges[i] != i prevents this)
- Multiple cycles
- Disconnected components
- Long chain leading to cycle

---

### Q7: Why is the time complexity O(n)?

**Answer:** Each node is visited at most once. When a node is marked as "visited" (state 2), we never visit it again. The DFS traverses each edge at most once.

---

## Common Pitfalls

### 1. Not Resetting Step Counter
**Issue:** Using global step counter without resetting for each component.

**Solution:** Reset the step counter when starting DFS from a new unvisited component.

### 2. Wrong State Management
**Issue:** Not marking nodes as "visited" after processing.

**Solution:** Set state[node] = 2 after exploring all neighbors to prevent revisiting.

### 3. Off-by-One in Cycle Length
**Issue:** Incorrect calculation of cycle length.

**Solution:** Cycle length = current_step - step[neighbor] + 1, or adjust based on when you increment the step.

---

## Summary

The **Longest Cycle in a Graph** problem demonstrates:

- **DFS with State Tracking**: Using three states to detect cycles
- **Step Recording**: Tracking when each node was first visited
- **Cycle Length Calculation**: Using step difference
- **Time Complexity**: O(n)
- **Space Complexity**: O(n)

This problem leverages the constraint that each node has at most one outgoing edge, making the graph a collection of directed paths and cycles.

For more details on this pattern, see the **[Graph Cycle Detection](/algorithms/graph/cycle-detection)**.
