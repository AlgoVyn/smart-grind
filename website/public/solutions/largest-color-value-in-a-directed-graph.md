# Largest Color Value In A Directed Graph

## Problem Description

There is a directed graph of `n` colored nodes and `m` edges.

You are given:
- `colors`: A string where `colors[i]` is the lowercase letter representing the color of node `i` (0-indexed)
- `edges`: A 2D array where `edges[j] = [aj, bj]` represents a directed edge from `aj` to `bj`

A **valid path** is a sequence of nodes `x1 → x2 → x3 → ... → xk` where each consecutive pair has a directed edge.

The **color value** of a path is the count of the most frequently occurring color along that path.

Return the **largest color value** of any valid path, or **`-1`** if the graph contains a cycle.

---

## Examples

### Example 1

| Input | Output |
|-------|--------|
| `colors = "abaca", edges = [[0,1],[0,2],[2,3],[3,4]]` | `3` |

**Explanation:** The path `0 → 2 → 3 → 4` contains 3 nodes with color 'a'.

### Example 2

| Input | Output |
|-------|--------|
| `colors = "a", edges = [[0,0]]` | `-1` |

**Explanation:** There's a cycle from node 0 to itself.

---

## Constraints

| Constraint | Description |
|------------|-------------|
| `1 ≤ n ≤ 10^5` | Number of nodes |
| `0 ≤ m ≤ 10^5` | Number of edges |
| `colors` | Lowercase English letters |
| `0 ≤ aj, bj < n` | Valid node indices |

---

## Pattern: Topological Sort with Dynamic Programming

This problem combines **Topological Sort (Kahn's algorithm)** with **Dynamic Programming**. The key insight is that `dp[i][c]` represents the maximum count of color `c` in any path ending at node `i`. We process nodes in topological order to ensure all dependencies are processed before updating a node's DP values.

---

## Intuition

The key insight for this problem is understanding how to track color counts along paths in a directed graph:

### Key Observations

1. **Path-based Problem**: We need to find the maximum count of any color along any valid path in the graph.

2. **Topological Order**: Processing nodes in topological order ensures we have processed all predecessors before handling a node.

3. **Dynamic Programming**: `dp[node][color]` stores the maximum count of that color in any path ending at that node.

4. **Cycle Detection**: If there's a cycle, topological sort won't visit all nodes, and we return -1.

### Why DP + Topological Sort?

- Topological sort gives us a valid processing order (no cycles)
- DP allows us to combine information from multiple paths
- Each node builds upon its predecessors' results

### Algorithm Overview

1. Build adjacency list and compute indegrees
2. Initialize dp with each node's own color count = 1
3. Process nodes in topological order using Kahn's algorithm
4. For each edge, update dp values for the destination
5. Detect cycle and find maximum color value

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Kahn's Algorithm + DP** - Optimal solution
2. **DFS + Memoization** - Alternative approach

---

## Approach 1: Kahn's Algorithm + DP (Optimal)

### Algorithm Steps

1. Build graph and compute indegrees
2. Initialize dp array: dp[i][color_i] = 1
3. Use queue for topological sort
4. Process nodes: update neighbor dp values
5. Check for cycle and compute answer

### Why It Works

- Kahn's algorithm processes nodes in topological order
- Each node's dp is computed from all its predecessors
- Maximum across all nodes gives the answer

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict, deque

class Solution:
    def largestPathValue(self, colors: str, edges: List[List[int]]) -> int:
        """
        Find largest color value in directed graph.
        
        Uses Kahn's algorithm with DP.
        
        Args:
            colors: String of node colors
            edges: List of directed edges
            
        Returns:
            Maximum color value, or -1 if cycle exists
        """
        n = len(colors)
        graph = defaultdict(list)
        indegree = [0] * n
        
        # Step 1: Build graph and compute indegrees
        for a, b in edges:
            graph[a].append(b)
            indegree[b] += 1
        
        # Step 2: Initialize queue with nodes having no incoming edges
        q = deque([i for i in range(n) if indegree[i] == 0])
        
        # Step 3: dp[i][c] = max count of color c in any path ending at node i
        dp = [[0] * 26 for _ in range(n)]
        for i in range(n):
            color_idx = ord(colors[i]) - ord('a')
            dp[i][color_idx] = 1
        
        visited = 0
        while q:
            curr = q.popleft()
            visited += 1
            
            # Step 4: Update dp for neighbors
            for nei in graph[curr]:
                color_nei = ord(colors[nei]) - ord('a')
                for c in range(26):
                    # Extend path: either use existing or add current node's color
                    add = 1 if c == color_nei else 0
                    dp[nei][c] = max(dp[nei][c], dp[curr][c] + add)
                
                # Step 5: Process neighbor when all dependencies are done
                indegree[nei] -= 1
                if indegree[nei] == 0:
                    q.append(nei)
        
        # Step 6: Check for cycle
        if visited < n:
            return -1
        
        # Step 7: Find maximum color value
        ans = 0
        for i in range(n):
            for c in range(26):
                ans = max(ans, dp[i][c])
        
        return ans
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <unordered_map>
using namespace std;

class Solution {
public:
    int largestPathValue(string colors, vector<vector<int>>& edges) {
        int n = colors.length();
        vector<vector<int>> graph(n);
        vector<int> indegree(n, 0);
        
        // Build graph
        for (auto& e : edges) {
            int a = e[0], b = e[1];
            graph[a].push_back(b);
            indegree[b]++;
        }
        
        // Initialize queue
        queue<int> q;
        for (int i = 0; i < n; i++) {
            if (indegree[i] == 0) q.push(i);
        }
        
        // dp[i][c] = max count of color c in any path ending at node i
        vector<array<int, 26>> dp(n);
        for (int i = 0; i < n; i++) {
            dp[i].fill(0);
            dp[i][colors[i] - 'a'] = 1;
        }
        
        int visited = 0;
        while (!q.empty()) {
            int curr = q.front();
            q.pop();
            visited++;
            
            for (int nei : graph[curr]) {
                int colorNei = colors[nei] - 'a';
                for (int c = 0; c < 26; c++) {
                    int add = (c == colorNei) ? 1 : 0;
                    dp[nei][c] = max(dp[nei][c], dp[curr][c] + add);
                }
                
                indegree[nei]--;
                if (indegree[nei] == 0) q.push(nei);
            }
        }
        
        if (visited < n) return -1;
        
        int ans = 0;
        for (int i = 0; i < n; i++) {
            for (int c = 0; c < 26; c++) {
                ans = max(ans, dp[i][c]);
            }
        }
        
        return ans;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int largestPathValue(String colors, int[][] edges) {
        int n = colors.length();
        List<Integer>[] graph = new ArrayList[n];
        int[] indegree = new int[n];
        
        for (int i = 0; i < n; i++) graph[i] = new ArrayList<>();
        
        for (int[] e : edges) {
            int a = e[0], b = e[1];
            graph[a].add(b);
            indegree[b]++;
        }
        
        Queue<Integer> q = new LinkedList<>();
        for (int i = 0; i < n; i++) {
            if (indegree[i] == 0) q.offer(i);
        }
        
        int[][] dp = new int[n][26];
        for (int i = 0; i < n; i++) {
            dp[i][colors.charAt(i) - 'a'] = 1;
        }
        
        int visited = 0;
        while (!q.isEmpty()) {
            int curr = q.poll();
            visited++;
            
            for (int nei : graph[curr]) {
                int colorNei = colors.charAt(nei) - 'a';
                for (int c = 0; c < 26; c++) {
                    int add = (c == colorNei) ? 1 : 0;
                    dp[nei][c] = Math.max(dp[nei][c], dp[curr][c] + add);
                }
                
                indegree[nei]--;
                if (indegree[nei] == 0) q.offer(nei);
            }
        }
        
        if (visited < n) return -1;
        
        int ans = 0;
        for (int i = 0; i < n; i++) {
            for (int c = 0; c < 26; c++) {
                ans = Math.max(ans, dp[i][c]);
            }
        }
        
        return ans;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {string} colors
 * @param {number[][]} edges
 * @return {number}
 */
var largestPathValue = function(colors, edges) {
    const n = colors.length;
    const graph = Array.from({ length: n }, () => []);
    const indegree = new Array(n).fill(0);
    
    // Build graph
    for (const [a, b] of edges) {
        graph[a].push(b);
        indegree[b]++;
    }
    
    // Initialize queue
    const q = [];
    for (let i = 0; i < n; i++) {
        if (indegree[i] === 0) q.push(i);
    }
    
    // dp[i][c] = max count of color c in any path ending at node i
    const dp = Array.from({ length: n }, () => new Array(26).fill(0));
    for (let i = 0; i < n; i++) {
        dp[i][colors.charCodeAt(i) - 97] = 1;
    }
    
    let visited = 0;
    let head = 0;
    while (head < q.length) {
        const curr = q[head++];
        visited++;
        
        for (const nei of graph[curr]) {
            const colorNei = colors.charCodeAt(nei) - 97;
            for (let c = 0; c < 26; c++) {
                const add = (c === colorNei) ? 1 : 0;
                dp[nei][c] = Math.max(dp[nei][c], dp[curr][c] + add);
            }
            
            indegree[nei]--;
            if (indegree[nei] === 0) q.push(nei);
        }
    }
    
    if (visited < n) return -1;
    
    let ans = 0;
    for (let i = 0; i < n; i++) {
        for (let c = 0; c < 26; c++) {
            ans = Math.max(ans, dp[i][c]);
        }
    }
    
    return ans;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + m + 26n) ≈ O(n + m) |
| **Space** | O(n + m + 26n) for dp table |

---

## Approach 2: DFS + Memoization (Alternative)

### Algorithm Steps

1. Use DFS with memoization to find longest path
2. Track color counts along each path
3. Cache results to avoid recomputation

### Why It Works

DFS explores all paths, and memoization ensures we don't recompute.

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict

class Solution:
    def largestPathValue(self, colors: str, edges: List[List[int]]) -> int:
        """Alternative: DFS with memoization."""
        n = len(colors)
        graph = defaultdict(list)
        
        for a, b in edges:
            graph[a].append(b)
        
        dp = {}  # Memoization
        visited = set()
        
        def dfs(node):
            if node in dp:
                return dp[node]
            if node in visited:
                return None  # Cycle detected
            
            visited.add(node)
            color_counts = [0] * 26
            color_counts[ord(colors[node]) - ord('a')] = 1
            
            for nei in graph[node]:
                result = dfs(nei)
                if result is None:
                    return None  # Cycle
                for c in range(26):
                    color_counts[c] = max(color_counts[c], result[c] + (1 if ord(colors[node]) - ord('a') == c else 0))
            
            visited.remove(node)
            dp[node] = color_counts
            return color_counts
        
        result = 0
        for i in range(n):
            path_result = dfs(i)
            if path_result is None:
                return -1
            result = max(result, max(path_result))
        
        return result
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
using namespace std;

class Solution {
public:
    int largestPathValue(string colors, vector<vector<int>>& edges) {
        int n = colors.length();
        vector<vector<int>> graph(n);
        
        for (auto& e : edges) {
            graph[e[0]].push_back(e[1]);
        }
        
        vector<array<int, 26>> dp(n);
        vector<int> state(n, 0);  // 0=unvisited, 1=visiting, 2=done
        
        function<array<int,26>(int)> dfs = [&](int node) -> array<int,26> {
            if (state[node] == 2) return dp[node];
            if (state[node] == 1) return {};  // Cycle
            
            state[node] = 1;
            array<int, 26> result = {};
            result.fill(0);
            result[colors[node] - 'a'] = 1;
            
            for (int nei : graph[node]) {
                auto child = dfs(nei);
                if (state[nei] == 1) return {};  // Cycle
                
                for (int c = 0; c < 26; c++) {
                    int add = (c == colors[nei] - 'a') ? 1 : 0;
                    result[c] = max(result[c], child[c] + add);
                }
            }
            
            state[node] = 2;
            dp[node] = result;
            return result;
        };
        
        int ans = 0;
        for (int i = 0; i < n; i++) {
            auto result = dfs(i);
            if (result.empty()) return -1;
            for (int c = 0; c < 26; c++) {
                ans = max(ans, result[c]);
            }
        }
        
        return ans;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int largestPathValue(String colors, int[][] edges) {
        int n = colors.length();
        List<Integer>[] graph = new ArrayList[n];
        for (int i = 0; i < n; i++) graph[i] = new ArrayList<>();
        
        for (int[] e : edges) {
            graph[e[0]].add(e[1]);
        }
        
        int[] state = new int[n];  // 0=unvisited, 1=visiting, 2=done
        int[][] dp = new int[n][26];
        
        int[] dfs = new int[1];  // To detect cycle
        dfs[0] = 0;
        
        // Implementation would use recursion with state tracking
        // Similar to C++ approach
        return 0;  // Placeholder
    }
}
```

<!-- slide -->
```javascript
var largestPathValue = function(colors, edges) {
    const n = colors.length;
    const graph = Array.from({ length: n }, () => []);
    
    for (const [a, b] of edges) {
        graph[a].push(b);
    }
    
    const state = new Array(n).fill(0);
    const dp = Array.from({ length: n }, () => new Array(26).fill(0));
    
    const dfs = (node) => {
        if (state[node] === 2) return dp[node];
        if (state[node] === 1) return null;  // Cycle
        
        state[node] = 1;
        const result = new Array(26).fill(0);
        result[colors.charCodeAt(node) - 97] = 1;
        
        for (const nei of graph[node]) {
            const child = dfs(nei);
            if (child === null) return null;  // Cycle
            
            for (let c = 0; c < 26; c++) {
                const add = (c === colors.charCodeAt(nei) - 97) ? 1 : 0;
                result[c] = Math.max(result[c], child[c] + add);
            }
        }
        
        state[node] = 2;
        dp[node] = result;
        return result;
    };
    
    let ans = 0;
    for (let i = 0; i < n; i++) {
        const result = dfs(i);
        if (result === null) return -1;
        ans = Math.max(ans, ...result);
    }
    
    return ans;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n + m × 26) |
| **Space** | O(n × 26) |

---

## Comparison of Approaches

| Aspect | Kahn + DP | DFS + Memo |
|--------|-----------|-------------|
| **Time Complexity** | O(n + m) | O(n × m) |
| **Space Complexity** | O(n × 26) | O(n × 26) |
| **Implementation** | Moderate | Complex |
| **LeetCode Optimal** | ✅ | ❌ (slower) |
| **Difficulty** | Medium | Hard |

**Best Approach:** Use Approach 1 (Kahn + DP) - it's more efficient and cleaner.

---

## Related Problems

Based on similar themes (topological sort, DP on graphs):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Course Schedule | [Link](https://leetcode.com/problems/course-schedule/) | Topological sort |
| Longest Path in DAG | [Link](https://leetcode.com/problems/longest-path-in-dag/) | DP on DAG |
| Number of Good Paths | [Link](https://leetcode.com/problems/number-of-good-paths/) | Similar graph problem |
| Find the Town Judge | [Link](https://leetcode.com/problems/find-the-town-judge/) | Graph traversal |

### Pattern Reference

For more detailed explanations, see:
- **[Topological Sort Pattern](/patterns/topological-sort)**
- **[Graph DP Pattern](/patterns/graph-dp)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[Largest Color Value - LeetCode 1857](https://www.youtube.com/watch?v=example)** - Clear explanation
2. **[Topological Sort Explained](https://www.youtube.com/watch?v=example)** - Kahn's algorithm
3. **[DP on DAG](https://www.youtube.com/watch?v=example)** - Dynamic programming on graphs

### Related Concepts

- **[Kahn's Algorithm](https://www.youtube.com/watch?v=example)** - Topological sorting
- **[Graph DP](https://www.youtube.com/watch?v=example)** - DP patterns on graphs

---

## Follow-up Questions

### Q1: How would you optimize the inner loop to avoid checking all 26 colors?

**Answer:** Use a hash map/dictionary to store only non-zero color counts per node, reducing the inner loop complexity.

---

### Q2: What if you needed to find not just the max count but which path achieves it?

**Answer:** Track the predecessor that gives the maximum for each node and color combination.

---

### Q3: Can you solve this with only O(n) space (not O(26n))?

**Answer:** Use hash maps instead of arrays for dp, storing only non-zero entries.

---

### Q4: How would you modify for weighted edges?

**Answer:** The problem becomes more complex; you'd need to consider edge weights in the DP transition.

---

### Q5: What if colors were not limited to 26?

**Answer:** The same approach works but with dynamic color indexing instead of fixed 26.

---

## Common Pitfalls

### 1. Cycle Detection
**Issue**: Not detecting cycles.

**Solution**: Check if visited < n after topological sort; return -1.

### 2. Wrong DP Update Order
**Issue**: Processing nodes before their predecessors are done.

**Solution**: Use Kahn's algorithm to ensure proper topological order.

### 3. Indegree Initialization
**Issue**: Counting outgoing edges instead of incoming.

**Solution**: indegree[b]++ for edge a→b.

### 4. Color Indexing
**Issue**: Wrong character to index conversion.

**Solution**: Use ord(colors[i]) - ord('a').

### 5. Space Complexity
**Issue**: Using too much memory.

**Solution**: The 26n space is acceptable; can optimize with hash maps.

---

## Summary

The **Largest Color Value in a Directed Graph** problem demonstrates the combination of **Topological Sort** with **Dynamic Programming**. The key insight is tracking maximum color counts along paths using DP in topological order.

Key takeaways:
1. Use Kahn's algorithm for topological order
2. Track dp[node][color] = max count along any path ending at node
3. Detect cycles by checking if all nodes were visited
4. O(n + m) time with O(26n) space

This problem is essential for understanding how to combine graph algorithms with dynamic programming.

### Pattern Summary

This problem exemplifies the **Topological Sort + DP** pattern, characterized by:
- Using topological order for processing
- DP to track optimal path values
- Cycle detection as part of the algorithm
- O(n + m) complexity for graph traversal

For more details on this pattern and its variations, see the **[Topological Sort Pattern](/patterns/topological-sort)**.

---

## Additional Resources

- [LeetCode Problem 1857](https://leetcode.com/problems/largest-color-value-in-a-directed-graph/) - Official problem page
- [Topological Sort - GeeksforGeeks](https://www.geeksforgeeks.org/topological-sorting/) - Detailed explanation
- [Kahn's Algorithm](https://www.geeksforgeeks.org/kahns-algorithm-topological-sort/) - BFS-based approach
- [Pattern: Topological Sort](/patterns/topological-sort) - Comprehensive pattern guide
