# Detonate The Maximum Bombs

## Problem Description

You are given a list of bombs. The range of a bomb is defined as the area where its effect can be felt. This area is in the shape of a circle with the center as the location of the bomb.

The bombs are represented by a 0-indexed 2D integer array bombs where `bombs[i] = [xi, yi, ri]` where:
- `xi` and `yi` denote the X-coordinate and Y-coordinate of the location of the ith bomb
- `ri` denotes the radius of its range

You may choose to detonate a single bomb. When a bomb is detonated, it will detonate all bombs that lie in its range. These bombs will further detonate the bombs that lie in their ranges.

Given the list of bombs, return the maximum number of bombs that can be detonated if you are allowed to detonate only one bomb.

**Link to problem:** [Detonate the Maximum Bombs - LeetCode 2101](https://leetcode.com/problems/detonate-the-maximum-bombs/)

---

## Pattern: Graph Traversal - DFS/BFS

This problem demonstrates the **Graph Traversal** pattern. We model the bombs as a directed graph where there's an edge from bomb i to bomb j if bomb j lies within bomb i's range.

### Core Concept

The fundamental idea is:
- Build a graph where each bomb is a node
- There's a directed edge from bomb i to bomb j if bomb j is within bomb i's range
- For each starting bomb, perform DFS/BFS to count reachable bombs
- Return the maximum count

---

## Examples

### Example

**Input:**
```
bombs = [[2,1,3],[6,1,4]]
```

**Output:**
```
2
```

**Explanation:**
The above figure shows the positions and ranges of the 2 bombs.
- If we detonate the left bomb, the right bomb will not be affected.
- If we detonate the right bomb, both bombs will be detonated.
So the maximum bombs that can be detonated is 2.

### Example 2

**Input:**
```
bombs = [[1,1,5],[10,10,5]]
```

**Output:**
```
1
```

**Explanation:**
Detonating either bomb will not detonate the other bomb, so the maximum number of bombs that can be detonated is 1.

### Example 3

**Input:**
```
bombs = [[1,2,3],[2,3,1],[3,4,2],[4,5,3],[5,6,4]]
```

**Output:**
```
5
```

**Explanation:**
The best bomb to detonate is bomb 0 because:
- Bomb 0 detonates bombs 1 and 2
- Bomb 2 detonates bomb 3
- Bomb 3 detonates bomb 4
Thus all 5 bombs are detonated.

---

## Constraints

- `1 <= bombs.length <= 100`
- `bombs[i].length == 3`
- `1 <= xi, yi, ri <= 10^5`

---

## Intuition

The key insight is that when bomb A detonates bomb B, and bomb B is in range of bomb C, then bomb C also gets detonated. This is a chain reaction that can be modeled as a graph traversal.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Graph + DFS** - O(n² + n×e) time (Optimal for n ≤ 100)
2. **Graph + BFS** - Alternative approach using breadth-first search

---

## Approach 1: Graph + DFS (Optimal)

### Algorithm Steps

1. Build an adjacency list for the graph:
   - For each pair of bombs (i, j), check if bomb j is in bomb i's range
   - A bomb j is in range of bomb i if: (xi - xj)² + (yi - yj)² ≤ ri²
2. For each starting bomb:
   - Run DFS to find all reachable bombs
   - Keep track of visited bombs in the current traversal
   - Count and update maximum
3. Return the maximum count

### Why It Works

Since each bomb can trigger a chain reaction, we need to find all bombs reachable from each starting bomb. DFS explores all connected nodes in the chain reaction.

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict

class Solution:
    def maximumDetonation(self, bombs: List[List[int]]) -> int:
        """
        Find maximum bombs that can be detonated.
        
        Args:
            bombs: List of bombs [x, y, radius]
            
        Returns:
            Maximum number of bombs that can be detonated
        """
        n = len(bombs)
        
        # Build adjacency list
        graph = defaultdict(list)
        for i in range(n):
            x1, y1, r1 = bombs[i]
            for j in range(n):
                if i != j:
                    x2, y2, r2 = bombs[j]
                    # Check if bomb j is in bomb i's range
                    if (x1 - x2) ** 2 + (y1 - y2) ** 2 <= r1 ** 2:
                        graph[i].append(j)
        
        def dfs(node: int, visited: set) -> int:
            """DFS to count all reachable bombs from node."""
            visited.add(node)
            count = 1
            for neighbor in graph[node]:
                if neighbor not in visited:
                    count += dfs(neighbor, visited)
            return count
        
        max_detonated = 0
        for i in range(n):
            visited = set()
            max_detonated = max(max_detonated, dfs(i, visited))
        
        return max_detonated
```

<!-- slide -->
```cpp
class Solution {
public:
    int maximumDetonation(vector<vector<int>>& bombs) {
        /**
         * Find maximum bombs that can be detonated.
         * 
         * Args:
         *     bombs: List of bombs [x, y, radius]
         * 
         * Returns:
         *     Maximum number of bombs that can be detonated
         */
        int n = bombs.size();
        
        // Build adjacency list
        vector<vector<int>> graph(n);
        for (int i = 0; i < n; i++) {
            long long x1 = bombs[i][0], y1 = bombs[i][1], r1 = bombs[i][2];
            for (int j = 0; j < n; j++) {
                if (i == j) continue;
                long long x2 = bombs[j][0], y2 = bombs[j][1];
                if ((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) <= r1 * r1) {
                    graph[i].push_back(j);
                }
            }
        }
        
        int maxDetonated = 0;
        
        function<int(int, unordered_set<int>&)> dfs = [&](int node, unordered_set<int>& visited) -> int {
            visited.insert(node);
            int count = 1;
            for (int neighbor : graph[node]) {
                if (visited.find(neighbor) == visited.end()) {
                    count += dfs(neighbor, visited);
                }
            }
            return count;
        };
        
        for (int i = 0; i < n; i++) {
            unordered_set<int> visited;
            maxDetonated = max(maxDetonated, dfs(i, visited));
        }
        
        return maxDetonated;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maximumDetonation(int[][] bombs) {
        /**
         * Find maximum bombs that can be detonated.
         * 
         * Args:
         *     bombs: List of bombs [x, y, radius]
         * 
         * Returns:
         *     Maximum number of bombs that can be detonated
         */
        int n = bombs.length;
        
        // Build adjacency list
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
            long x1 = bombs[i][0], y1 = bombs[i][1], r1 = bombs[i][2];
            for (int j = 0; j < n; j++) {
                if (i == j) continue;
                long x2 = bombs[j][0], y2 = bombs[j][1];
                if ((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) <= r1 * r1) {
                    graph.get(i).add(j);
                }
            }
        }
        
        int maxDetonated = 0;
        
        for (int i = 0; i < n; i++) {
            Set<Integer> visited = new HashSet<>();
            maxDetonated = Math.max(maxDetonated, dfs(i, graph, visited));
        }
        
        return maxDetonated;
    }
    
    private int dfs(int node, List<List<Integer>> graph, Set<Integer> visited) {
        visited.add(node);
        int count = 1;
        for (int neighbor : graph.get(node)) {
            if (!visited.contains(neighbor)) {
                count += dfs(neighbor, graph, visited);
            }
        }
        return count;
    }
}
```

<!-- slide -->
```javascript
/**
 * Find maximum bombs that can be detonated.
 * 
 * @param {number[][]} bombs - List of bombs [x, y, radius]
 * @return {number} - Maximum number of bombs that can be detonated
 */
var maximumDetonation = function(bombs) {
    const n = bombs.length;
    
    // Build adjacency list
    const graph = Array.from({length: n}, () => []);
    for (let i = 0; i < n; i++) {
        const [x1, y1, r1] = bombs[i];
        for (let j = 0; j < n; j++) {
            if (i === j) continue;
            const [x2, y2] = bombs[j];
            const dist = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
            if (dist <= r1 * r1) {
                graph[i].push(j);
            }
        }
    }
    
    const dfs = (node, visited) => {
        visited.add(node);
        let count = 1;
        for (const neighbor of graph[node]) {
            if (!visited.has(neighbor)) {
                count += dfs(neighbor, visited);
            }
        }
        return count;
    };
    
    let maxDetonated = 0;
    for (let i = 0; i < n; i++) {
        const visited = new Set();
        maxDetonated = Math.max(maxDetonated, dfs(i, visited));
    }
    
    return maxDetonated;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n² + n×e) - Building graph O(n²), DFS O(n×e) worst case |
| **Space** | O(n²) - Adjacency list can have up to n² edges |

---

## Approach 2: Graph + BFS (Alternative)

### Algorithm Steps

1. Build the same adjacency list as in Approach 1
2. For each starting bomb:
   - Use BFS with a queue instead of DFS recursion
   - Track visited bombs in the current traversal
   - Count and update maximum
3. Return the maximum count

### Why It Works

BFS explores all nodes at the current distance level before moving to the next level. This ensures we visit all reachable bombs in the chain reaction.

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict, deque

class Solution:
    def maximumDetonation(self, bombs: List[List[int]]) -> int:
        """
        Find maximum bombs that can be detonated using BFS.
        
        Args:
            bombs: List of bombs [x, y, radius]
            
        Returns:
            Maximum number of bombs that can be detonated
        """
        n = len(bombs)
        
        # Build adjacency list
        graph = defaultdict(list)
        for i in range(n):
            x1, y1, r1 = bombs[i]
            for j in range(n):
                if i != j:
                    x2, y2, r2 = bombs[j]
                    # Check if bomb j is in bomb i's range
                    if (x1 - x2) ** 2 + (y1 - y2) ** 2 <= r1 ** 2:
                        graph[i].append(j)
        
        def bfs(start: int) -> int:
            """BFS to count all reachable bombs from start."""
            visited = set([start])
            queue = deque([start])
            count = 0
            
            while queue:
                node = queue.popleft()
                count += 1
                for neighbor in graph[node]:
                    if neighbor not in visited:
                        visited.add(neighbor)
                        queue.append(neighbor)
            
            return count
        
        max_detonated = 0
        for i in range(n):
            max_detonated = max(max_detonated, bfs(i))
        
        return max_detonated
```

<!-- slide -->
```cpp
class Solution {
public:
    int maximumDetonation(vector<vector<int>>& bombs) {
        int n = bombs.size();
        
        // Build adjacency list
        vector<vector<int>> graph(n);
        for (int i = 0; i < n; i++) {
            long long x1 = bombs[i][0], y1 = bombs[i][1], r1 = bombs[i][2];
            for (int j = 0; j < n; j++) {
                if (i == j) continue;
                long long x2 = bombs[j][0], y2 = bombs[j][1];
                if ((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) <= r1 * r1) {
                    graph[i].push_back(j);
                }
            }
        }
        
        auto bfs = [&](int start) -> int {
            unordered_set<int> visited;
            queue<int> q;
            visited.insert(start);
            q.push(start);
            int count = 0;
            
            while (!q.empty()) {
                int node = q.front();
                q.pop();
                count++;
                for (int neighbor : graph[node]) {
                    if (visited.find(neighbor) == visited.end()) {
                        visited.insert(neighbor);
                        q.push(neighbor);
                    }
                }
            }
            
            return count;
        };
        
        int maxDetonated = 0;
        for (int i = 0; i < n; i++) {
            maxDetonated = max(maxDetonated, bfs(i));
        }
        
        return maxDetonated;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int maximumDetonation(int[][] bombs) {
        int n = bombs.length;
        
        // Build adjacency list
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
            long x1 = bombs[i][0], y1 = bombs[i][1], r1 = bombs[i][2];
            for (int j = 0; j < n; j++) {
                if (i == j) continue;
                long x2 = bombs[j][0], y2 = bombs[j][1];
                if ((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2) <= r1 * r1) {
                    graph.get(i).add(j);
                }
            }
        }
        
        int maxDetonated = 0;
        
        for (int i = 0; i < n; i++) {
            maxDetonated = Math.max(maxDetonated, bfs(i, graph));
        }
        
        return maxDetonated;
    }
    
    private int bfs(int start, List<List<Integer>> graph) {
        Set<Integer> visited = new HashSet<>();
        Queue<Integer> queue = new LinkedList<>();
        visited.add(start);
        queue.add(start);
        int count = 0;
        
        while (!queue.isEmpty()) {
            int node = queue.poll();
            count++;
            for (int neighbor : graph.get(node)) {
                if (!visited.contains(neighbor)) {
                    visited.add(neighbor);
                    queue.add(neighbor);
                }
            }
        }
        
        return count;
    }
}
```

<!-- slide -->
```javascript
var maximumDetonation = function(bombs) {
    const n = bombs.length;
    
    // Build adjacency list
    const graph = Array.from({length: n}, () => []);
    for (let i = 0; i < n; i++) {
        const [x1, y1, r1] = bombs[i];
        for (let j = 0; j < n; j++) {
            if (i === j) continue;
            const [x2, y2] = bombs[j];
            const dist = Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2);
            if (dist <= r1 * r1) {
                graph[i].push(j);
            }
        }
    }
    
    const bfs = (start) => {
        const visited = new Set([start]);
        const queue = [start];
        let count = 0;
        
        while (queue.length > 0) {
            const node = queue.shift();
            count++;
            for (const neighbor of graph[node]) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            }
        }
        
        return count;
    };
    
    let maxDetonated = 0;
    for (let i = 0; i < n; i++) {
        maxDetonated = Math.max(maxDetonated, bfs(i));
    }
    
    return maxDetonated;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n² + n×e) - Building graph O(n²), BFS O(n×e) worst case |
| **Space** | O(n²) - Adjacency list can have up to n² edges |

---

## Comparison of Approaches

| Aspect | Graph + DFS | Graph + BFS |
|--------|-------------|-------------|
| **Time** | Same | Same |
| **Space** | DFS stack | Queue |
| **Implementation** | Recursive | Iterative |

Both approaches work. DFS is simpler to implement.

---

## Related Problems

Based on similar themes (graph traversal, reachability):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Number of Provinces | [Link](https://leetcode.com/problems/number-of-provinces/) | Connected components |
| Graph Valid Tree | [Link](https://leetcode.com/problems/graph-valid-tree/) | Tree validation |
| Critical Connections | [Link](https://leetcode.com/problems/critical-connections-in-a-network/) | Graph bridges |
| Robot Collisions | [Link](https://leetcode.com/problems/robot-collisions/) | Similar range checking |

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Graph Traversal

- [NeetCode - Detonate Maximum Bombs](https://www.youtube.com/watch?v=R_MLCuG2Sts) - Clear explanation
- [DFS Graph Traversal](https://www.youtube.com/watch?v=pcKY4hjDrxk) - Understanding DFS
- [BFS vs DFS](https://www.youtube.com/watch?v=7Z6kIP-ledG) - Comparing approaches

---

## Follow-up Questions

### Q1: Why is this a graph problem?

**Answer:** The chain reaction of bomb detonations can be modeled as a directed graph. If bomb A can detonate bomb B, there's an edge from A to B.

---

### Q2: Why do we need to check all starting bombs?

**Answer:** The problem asks for the maximum bombs when starting from a single bomb. We need to try each possible starting bomb.

---

### Q3: Can we optimize by only checking certain starting bombs?

**Answer:** With n ≤ 100, checking all is fine. For larger n, we could use Tarjan's SCC to find strongly connected components, but n is small here.

---

### Q4: How do we check if a bomb is in range?

**Answer:** Use the distance formula. Bomb j is in bomb i's range if (xi - xj)² + (yi - yj)² ≤ ri².

---

### Q5: What type of graph is this?

**Answer:** It's a directed graph. Even though the range relationship is symmetric in terms of distance, the detonation chain is directed (if A can reach B, the chain goes A → B).

---

### Q6: Can we use BFS instead of DFS?

**Answer:** Yes, BFS would work the same way. Use a queue instead of recursion stack.

---

### Q7: What edge cases should be tested?

**Answer:**
- Single bomb (answer = 1)
- No connections (each detonates only itself)
- All connected (one bomb detonates all)
- Chain reactions

---

## Common Pitfalls

### 1. Not Using Long for Distance Calculation
**Issue:** Squaring large numbers can overflow int.

**Solution:** Use long/long long for distance calculations.

### 2. Counting Same Bomb Multiple Times
**Issue:** Not tracking visited in DFS.

**Solution:** Use a visited set for each starting bomb.

### 3. Missing Self Loops
**Issue:** Forgetting to exclude i == j when building graph.

**Solution:** Skip when i == j.

---

## Summary

The **Detonate The Maximum Bombs** problem demonstrates:

- **Graph Modeling**: Converting geometric problem to graph
- **DFS/BFS**: Exploring reachable nodes
- **Range Checking**: Using distance formula
- **Time Complexity**: O(n² + n×e) for n ≤ 100
- **Space Complexity**: O(n²)

This problem shows how geometric relationships can be modeled as graphs for traversal problems.

For more details on this pattern, see the **[Graph Traversal](/algorithms/graph/traversal)**.
