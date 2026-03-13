# Build A Matrix With Conditions

## Problem Description

You are given a positive integer `k`. You are also given:

- a 2D integer array `rowConditions` of size `n` where `rowConditions[i] = [abovei, belowi]`, and
- a 2D integer array `colConditions` of size `m` where `colConditions[i] = [lefti, righti]`.

The two arrays contain integers from `1` to `k`.
You have to build a `k x k` matrix that contains each of the numbers from `1` to `k` exactly once. The remaining cells should have the value `0`.
The matrix should also satisfy the following conditions:

- The number `abovei` should appear in a row that is strictly above the row at which the number `belowi` appears for all `i` from `0` to `n - 1`.
- The number `lefti` should appear in a column that is strictly left of the column at which the number `righti` appears for all `i` from `0` to `m - 1`.

Return any matrix that satisfies the conditions. If no answer exists, return an empty matrix.

**Link to problem:** [Build a Matrix With Conditions - LeetCode 2392](https://leetcode.com/problems/build-a-matrix-with-conditions/)

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 <= k <= 10^5` | Size of the matrix |
| `1 <= rowConditions.length, colConditions.length <= 10^5` | Number of conditions |

---

## Pattern: Topological Sorting for Multiple Constraints

This problem demonstrates the **Topological Sorting** pattern applied to multiple independent constraint systems. The key insight is that row and column conditions form two separate DAGs (Directed Acyclic Graphs) that can be processed independently.

### Core Concept

The fundamental idea is treating each constraint as a directed edge in a graph:
- `rowConditions`: `abovei → belowi` means `abovei` must come before `belowi`
- `colConditions`: `lefti → righti` means `lefti` must come before `righti`

By performing topological sort on each set of conditions, we get the valid ordering of numbers. If either set has a cycle (impossible to order), we return an empty matrix.

---

## Examples

### Example

**Input:**
```
k = 3, rowConditions = [[1,2],[3,2]], colConditions = [[2,1],[3,2]]
```

**Output:**
```
[[3,0,0],[0,0,1],[0,2,0]]
```

**Explanation:** The diagram above shows a valid example of a matrix that satisfies all the conditions.
The row conditions are the following:
- Number 1 is in row 1, and number 2 is in row 2, so 1 is above 2 in the matrix.
- Number 3 is in row 0, and number 2 is in row 2, so 3 is above 2 in the matrix.
The column conditions are the following:
- Number 2 is in column 1, and number 1 is in column 2, so 2 is left of 1 in the matrix.
- Number 3 is in column 0, and number 2 is in column 1, so 3 is left of 2 in the matrix.
Note that there may be multiple correct answers.

### Example 2

**Input:**
```
k = 3, rowConditions = [[1,2],[2,3],[3,1],[2,3]], colConditions = [[2,1]]
```

**Output:**
```
[]
```

**Explanation:** From the first two conditions, 3 has to be below 1 but the third conditions needs 3 to be above 1 to be satisfied.
No matrix can satisfy all the conditions, so we return the empty matrix.

---

## Intuition

The key insight is that row and column conditions are **independent** of each other:
1. Row conditions define the vertical ordering (top to bottom)
2. Column conditions define the horizontal ordering (left to right)

Each ordering can be found using topological sort. If either has a cycle, no valid matrix exists.

### Why Topological Sort Works

Topological sort produces a linear ordering of vertices where for every directed edge `u → v`, `u` comes before `v` in the ordering. This exactly matches our requirement:
- `rowConditions[a,b]` → `a` must be above `b` (smaller row index)
- `colConditions[a,b]` → `a` must be left of `b` (smaller column index)

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Kahn's Algorithm (BFS-based)** - Standard topological sort O(V+E)
2. **DFS-based Topological Sort** - Alternative approach

---

## Approach 1: Kahn's Algorithm (BFS-based) - Optimal

This is the most common and intuitive approach using BFS. We compute in-degrees and process nodes with zero in-degree.

### Algorithm Steps

1. Build adjacency lists and in-degree arrays for both row and column conditions
2. Perform Kahn's algorithm:
   - Initialize queue with nodes having in-degree 0
   - Process nodes: add to result, reduce in-degree of neighbors
   - If result size < k, there's a cycle → return empty
3. Build position maps from the topological orders
4. Construct the k×k matrix using these positions
5. Place each number 1 to k at its row and column position

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict, deque

class Solution:
    def buildMatrix(self, k: int, rowConditions: List[List[int]], colConditions: List[List[int]]) -> List[List[int]]:
        def topo_sort(conditions: List[List[int]]) -> List[int]:
            """Perform topological sort using Kahn's algorithm."""
            graph = defaultdict(list)
            indegree = [0] * (k + 1)
            
            # Build graph
            for a, b in conditions:
                graph[a].append(b)
                indegree[b] += 1
            
            # Initialize queue with nodes having in-degree 0
            queue = deque([i for i in range(1, k + 1) if indegree[i] == 0])
            order = []
            
            # Process nodes
            while queue:
                node = queue.popleft()
                order.append(node)
                for neighbor in graph[node]:
                    indegree[neighbor] -= 1
                    if indegree[neighbor] == 0:
                        queue.append(neighbor)
            
            # Check for cycle
            return order if len(order) == k else []
        
        # Get topological orders for both conditions
        row_order = topo_sort(rowConditions)
        if not row_order:
            return []
        
        col_order = topo_sort(colConditions)
        if not col_order:
            return []
        
        # Build position maps
        row_pos = {num: i for i, num in enumerate(row_order)}
        col_pos = {num: i for i, num in enumerate(col_order)}
        
        # Build the matrix
        matrix = [[0] * k for _ in range(k)]
        for num in range(1, k + 1):
            matrix[row_pos[num]][col_pos[num]] = num
        
        return matrix
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<vector<int>> buildMatrix(int k, vector<vector<int>>& rowConditions, vector<vector<int>>& colConditions) {
        // Helper function for topological sort using Kahn's algorithm
        auto topoSort = [&](vector<vector<int>>& conditions) -> vector<int> {
            vector<vector<int>> graph(k + 1);
            vector<int> indegree(k + 1, 0);
            
            // Build graph
            for (auto& cond : conditions) {
                int a = cond[0], b = cond[1];
                graph[a].push_back(b);
                indegree[b]++;
            }
            
            // Initialize queue with nodes having in-degree 0
            queue<int> q;
            for (int i = 1; i <= k; i++) {
                if (indegree[i] == 0) q.push(i);
            }
            
            vector<int> order;
            while (!q.empty()) {
                int node = q.front();
                q.pop();
                order.push_back(node);
                for (int neighbor : graph[node]) {
                    if (--indegree[neighbor] == 0) {
                        q.push(neighbor);
                    }
                }
            }
            
            return (order.size() == k) ? order : vector<int>();
        };
        
        // Get topological orders
        vector<int> rowOrder = topoSort(rowConditions);
        if (rowOrder.empty()) return {};
        
        vector<int> colOrder = topoSort(colConditions);
        if (colOrder.empty()) return {};
        
        // Build position maps
        unordered_map<int, int> rowPos, colPos;
        for (int i = 0; i < rowOrder.size(); i++) {
            rowPos[rowOrder[i]] = i;
        }
        for (int i = 0; i < colOrder.size(); i++) {
            colPos[colOrder[i]] = i;
        }
        
        // Build matrix
        vector<vector<int>> matrix(k, vector<int>(k, 0));
        for (int num = 1; num <= k; num++) {
            matrix[rowPos[num]][colPos[num]] = num;
        }
        
        return matrix;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[][] buildMatrix(int k, int[][] rowConditions, int[][] colConditions) {
        // Helper function for topological sort using Kahn's algorithm
        List<Integer> topoSort = (conditions) -> {
            List<List<Integer>> graph = new ArrayList<>();
            int[] indegree = new int[k + 1];
            
            for (int i = 0; i <= k; i++) {
                graph.add(new ArrayList<>());
            }
            
            // Build graph
            for (int[] cond : conditions) {
                int a = cond[0], b = cond[1];
                graph.get(a).add(b);
                indegree[b]++;
            }
            
            // Initialize queue with nodes having in-degree 0
            Queue<Integer> queue = new LinkedList<>();
            for (int i = 1; i <= k; i++) {
                if (indegree[i] == 0) queue.add(i);
            }
            
            List<Integer> order = new ArrayList<>();
            while (!queue.isEmpty()) {
                int node = queue.poll();
                order.add(node);
                for (int neighbor : graph.get(node)) {
                    if (--indegree[neighbor] == 0) {
                        queue.add(neighbor);
                    }
                }
            }
            
            return order.size() == k ? order : new ArrayList<>();
        };
        
        // Get topological orders
        List<Integer> rowOrder = topoSort.exec(rowConditions);
        if (rowOrder.isEmpty()) return new int[0][0];
        
        List<Integer> colOrder = topoSort.exec(colConditions);
        if (colOrder.isEmpty()) return new int[0][0];
        
        // Build position maps
        Map<Integer, Integer> rowPos = new HashMap<>();
        Map<Integer, Integer> colPos = new HashMap<>();
        for (int i = 0; i < rowOrder.size(); i++) {
            rowPos.put(rowOrder.get(i), i);
        }
        for (int i = 0; i < colOrder.size(); i++) {
            colPos.put(colOrder.get(i), i);
        }
        
        // Build matrix
        int[][] matrix = new int[k][k];
        for (int num = 1; num <= k; num++) {
            matrix[rowPos.get(num)][colPos.get(num)] = num;
        }
        
        return matrix;
    }
    
    @FunctionalInterface
    interface TopoSort {
        List<Integer> exec(int[][] conditions);
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number} k
 * @param {number[][]} rowConditions
 * @param {number[][]} colConditions
 * @return {number[][]}
 */
var buildMatrix = function(k, rowConditions, colConditions) {
    const topoSort = (conditions) => {
        const graph = Array.from({ length: k + 1 }, () => []);
        const indegree = new Array(k + 1).fill(0);
        
        // Build graph
        for (const [a, b] of conditions) {
            graph[a].push(b);
            indegree[b]++;
        }
        
        // Initialize queue with nodes having in-degree 0
        const queue = [];
        for (let i = 1; i <= k; i++) {
            if (indegree[i] === 0) queue.push(i);
        }
        
        const order = [];
        while (queue.length > 0) {
            const node = queue.shift();
            order.push(node);
            for (const neighbor of graph[node]) {
                if (--indegree[neighbor] === 0) {
                    queue.push(neighbor);
                }
            }
        }
        
        return order.length === k ? order : [];
    };
    
    // Get topological orders
    const rowOrder = topoSort(rowConditions);
    if (rowOrder.length === 0) return [];
    
    const colOrder = topoSort(colConditions);
    if (colOrder.length === 0) return [];
    
    // Build position maps
    const rowPos = {};
    const colPos = {};
    rowOrder.forEach((num, i) => rowPos[num] = i);
    colOrder.forEach((num, i) => colPos[num] = i);
    
    // Build matrix
    const matrix = Array.from({ length: k }, () => new Array(k).fill(0));
    for (let num = 1; num <= k; num++) {
        matrix[rowPos[num]][colPos[num]] = num;
    }
    
    return matrix;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(k + e) where k is the size and e is the number of conditions |
| **Space** | O(k + e) for the graphs and queues used in topological sorting |

---

## Approach 2: DFS-based Topological Sort

This approach uses DFS with post-order tracking to determine the topological ordering. Nodes are added to the result after visiting all their dependencies.

### Algorithm Steps

1. Build adjacency lists for both condition sets
2. Use DFS to traverse the graph:
   - Mark nodes as "visiting" (in current path)
   - Mark nodes as "visited" after processing all neighbors
3. If we encounter a node already in "visiting" state, there's a cycle
4. Build the matrix using the same approach as before

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict

class Solution:
    def buildMatrix(self, k: int, rowConditions: List[List[int]], colConditions: List[List[int]]) -> List[List[int]]:
        def topo_sort_dfs(conditions: List[List[int]]) -> List[int]:
            """Perform topological sort using DFS."""
            graph = defaultdict(list)
            for a, b in conditions:
                graph[a].append(b)
            
            visited = [0] * (k + 1)  # 0=unvisited, 1=visiting, 2=visited
            order = []
            
            def dfs(node: int) -> bool:
                if visited[node] == 1:  # Cycle detected
                    return False
                if visited[node] == 2:  # Already processed
                    return True
                
                visited[node] = 1
                for neighbor in graph[node]:
                    if not dfs(neighbor):
                        return False
                visited[node] = 2
                order.append(node)
                return True
            
            for i in range(1, k + 1):
                if visited[i] == 0:
                    if not dfs(i):
                        return []
            
            return order[::-1]  # Reverse to get correct order
        
        row_order = topo_sort_dfs(rowConditions)
        if not row_order:
            return []
        
        col_order = topo_sort_dfs(colConditions)
        if not col_order:
            return []
        
        row_pos = {num: i for i, num in enumerate(row_order)}
        col_pos = {num: i for i, num in enumerate(col_order)}
        
        matrix = [[0] * k for _ in range(k)]
        for num in range(1, k + 1):
            matrix[row_pos[num]][col_pos[num]] = num
        
        return matrix
```

<!-- slide -->
```cpp
class Solution {
public:
    vector<vector<int>> buildMatrix(int k, vector<vector<int>>& rowConditions, vector<vector<int>>& colConditions) {
        auto topoSortDFS = [&](vector<vector<int>>& conditions) -> vector<int> {
            vector<vector<int>> graph(k + 1);
            for (auto& cond : conditions) {
                graph[cond[0]].push_back(cond[1]);
            }
            
            vector<int> visited(k + 1, 0);
            vector<int> order;
            
            function<bool(int)> dfs = [&](int node) -> bool {
                if (visited[node] == 1) return false;
                if (visited[node] == 2) return true;
                
                visited[node] = 1;
                for (int neighbor : graph[node]) {
                    if (!dfs(neighbor)) return false;
                }
                visited[node] = 2;
                order.push_back(node);
                return true;
            };
            
            for (int i = 1; i <= k; i++) {
                if (visited[i] == 0) {
                    if (!dfs(i)) return {};
                }
            }
            
            reverse(order.begin(), order.end());
            return order;
        };
        
        vector<int> rowOrder = topoSortDFS(rowConditions);
        if (rowOrder.empty()) return {};
        
        vector<int> colOrder = topoSortDFS(colConditions);
        if (colOrder.empty()) return {};
        
        unordered_map<int, int> rowPos, colPos;
        for (int i = 0; i < rowOrder.size(); i++) rowPos[rowOrder[i]] = i;
        for (int i = 0; i < colOrder.size(); i++) colPos[colOrder[i]] = i;
        
        vector<vector<int>> matrix(k, vector<int>(k, 0));
        for (int num = 1; num <= k; num++) {
            matrix[rowPos[num]][colPos[num]] = num;
        }
        
        return matrix;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int[][] buildMatrix(int k, int[][] rowConditions, int[][] colConditions) {
        List<Integer> topoSortDFS = (conditions) -> {
            List<List<Integer>> graph = new ArrayList<>();
            for (int i = 0; i <= k; i++) graph.add(new ArrayList<>());
            
            for (int[] cond : conditions) {
                graph.get(cond[0]).add(cond[1]);
            }
            
            int[] visited = new int[k + 1];
            List<Integer> order = new ArrayList<>();
            
            dfs = (node) -> {
                if (visited[node] == 1) return false;
                if (visited[node] == 2) return true;
                
                visited[node] = 1;
                for (int neighbor : graph.get(node)) {
                    if (!this.dfs(neighbor)) return false;
                }
                visited[node] = 2;
                order.add(node);
                return true;
            };
            
            for (int i = 1; i <= k; i++) {
                if (visited[i] == 0 && !this.dfs(i)) return new ArrayList<>();
            }
            
            Collections.reverse(order);
            return order;
        };
        
        // ... same as approach 1 for building matrix
    }
}
```

<!-- slide -->
```javascript
var buildMatrix = function(k, rowConditions, colConditions) {
    const topoSortDFS = (conditions) => {
        const graph = Array.from({ length: k + 1 }, () => []);
        for (const [a, b] of conditions) {
            graph[a].push(b);
        }
        
        const visited = new Array(k + 1).fill(0);
        const order = [];
        
        const dfs = (node) => {
            if (visited[node] === 1) return false;
            if (visited[node] === 2) return true;
            
            visited[node] = 1;
            for (const neighbor of graph[node]) {
                if (!dfs(neighbor)) return false;
            }
            visited[node] = 2;
            order.push(node);
            return true;
        };
        
        for (let i = 1; i <= k; i++) {
            if (visited[i] === 0 && !dfs(i)) return [];
        }
        
        return order.reverse();
    };
    
    // ... same as approach 1 for building matrix
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(k + e) |
| **Space** | O(k + e) for recursion stack and graph |

---

## Comparison of Approaches

| Aspect | Kahn's Algorithm | DFS-based |
|--------|-----------------|-----------|
| **Time Complexity** | O(k + e) | O(k + e) |
| **Space Complexity** | O(k + e) | O(k + e) + recursion stack |
| **Implementation** | Iterative | Recursive |
| **Cycle Detection** | Incomplete order | Direct detection |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes |

**Best Approach:** Both approaches are equally optimal. Kahn's algorithm is generally preferred for its iterative nature and easier cycle detection.

---

## Related Problems

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Course Schedule | [Link](https://leetcode.com/problems/course-schedule/) | Topological sort basics |
| Course Schedule II | [Link](https://leetcode.com/problems/course-schedule-ii/) | Return ordering of courses |
| Alien Dictionary | [Link](https://leetcode.com/problems/alien-dictionary/) | Topological sort with custom order |
| Sequence Reconstruction | [Link](https://leetcode.com/problems/sequence-reconstruction/) | Check if sequence can be reconstructed |

### Pattern Reference

For more detailed explanations of the Topological Sort pattern and its variations, see:
- **[Graph - Topological Sort (Kahn's Algorithm](/patterns/graph-bfs-topological-sort-kahns)**

---

## Video Tutorial Links

### Topological Sort Fundamentals

- [NeetCode - Build a Matrix With Conditions](https://www.youtube.com/watch?v=CYlG6y7JYo0) - Official solution explanation
- [Topological Sort - Kahn's Algorithm](https://www.youtube.com/watch?v=CYlG6y7JYo0) - Detailed Kahn's algorithm walkthrough
- [DFS-based Topological Sort](https://www.youtube.com/watch?v=CYlG6y7JYo0) - Understanding DFS approach
- [LeetCode Problem Discussion](https://www.youtube.com/watch?v=CYlG6y7JYo0) - Community solutions

### Graph Problems

- [Graph Traversal Patterns](https://www.youtube.com/watch?v=CYlG6y7JYo0) - BFS and DFS in graphs
- [Cycle Detection](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Detecting cycles in directed graphs

---

## Follow-up Questions

### Q1: What happens if there are multiple valid topological orderings?

**Answer:** There can be multiple valid orderings. Our algorithm returns one valid ordering based on the order we process nodes. Any valid ordering will produce a correct matrix.

---

### Q2: Can row and column conditions be dependent on each other?

**Answer:** No, they are completely independent. Row conditions determine vertical ordering, column conditions determine horizontal ordering. There's no constraint linking them.

---

### Q3: How would you modify the solution to return all possible matrices?

**Answer:** Instead of returning after finding one ordering, you'd need to:
1. Find all possible topological orderings for rows and columns
2. Generate all combinations of these orderings
3. Build matrices for each combination

This would be O(k!²) in the worst case.

---

### Q4: What if you need to minimize some property (e.g., minimize trace)?

**Answer:** This becomes an optimization problem. You'd need to explore different valid orderings and choose the one that minimizes/maximizes the target property. This would require generating multiple valid orderings.

---

### Q5: How would you validate if a given matrix satisfies the conditions?

**Answer:** For each condition [a, b] in rowConditions:
- Find row of a and row of b
- Check row_a < row_b
Similarly for column conditions. This takes O(e) time where e is number of conditions.

---

## Common Pitfalls

### 1. Cycle Detection
**Issue**: Not detecting cycles in conditions.

**Solution**: After topological sort, check if result size equals k. If not, there's a cycle.

### 2. Index Off-by-One
**Issue**: Using 0-based indexing when values range from 1 to k.

**Solution**: Use arrays of size k+1 and handle the 1-based values carefully.

### 3. Missing Edge Cases
**Issue**: Not handling empty condition arrays.

**Solution**: Topological sort with no conditions returns nodes in any order (1 to k).

### 4. Position Mapping
**Issue**: Forgetting to reverse DFS post-order.

**Solution**: DFS adds nodes after processing neighbors, so reverse the result.

---

## Summary

The **Build a Matrix With Conditions** problem demonstrates how to apply topological sorting to multiple independent constraint systems:

- **Kahn's Algorithm**: O(k+e) time and space, iterative, easy cycle detection
- **DFS-based**: O(k+e) time and space, recursive, direct cycle detection

The key insight is that row and column conditions are independent DAGs. By finding valid topological orderings for both, we can place each number 1 to k at the intersection of its row and column positions.

This problem is an excellent demonstration of how topological sorting can solve real-world ordering problems with multiple constraints.

### Pattern Summary

This problem exemplifies the **Topological Sort** pattern, characterized by:
- Finding linear ordering of elements with directed dependencies
- Detecting cycles in directed graphs
- Processing multiple independent constraint systems
- O(V+E) time complexity

For more details on this pattern and its variations, see the **[Graph - Topological Sort (Kahn's Algorithm](/patterns/graph-bfs-topological-sort-kahns)**.
