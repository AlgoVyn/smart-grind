# 

## Pattern: Union-Find / DFS - Connected Components

Number of Provinces

## Problem Description

There are n cities. Some of them are connected, while some are not. If city a is connected directly with city b, and city b is connected directly with city c, then city a is connected indirectly with city c.

A province is a group of directly or indirectly connected cities and no other cities outside of the group.

You are given an n x n matrix `isConnected` where `isConnected[i][j] = 1` if the ith city and the jth city are directly connected, and `isConnected[i][j] = 0` otherwise.

Return the total number of provinces.

**Link to problem:** [Number of Provinces - LeetCode 547](https://leetcode.com/problems/number-of-provinces/)

---

## Examples

### Example

**Input:**
```
isConnected = [[1,1,0],[1,1,0],[0,0,1]]
```

**Output:**
```
2
```

**Explanation:**
- Cities 0 and 1 are connected (province 1)
- City 2 is isolated (province 2)
- Total: 2 provinces

### Example 2

**Input:**
```
isConnected = [[1,0,0],[0,1,0],[0,0,1]]
```

**Output:**
```
3
```

**Explanation:** Each city is isolated, so 3 provinces.

---

## Constraints

- `1 <= n <= 200`
- `n == isConnected.length`
- `n == isConnected[i].length`
- `isConnected[i][j]` is 1 or 0.
- `isConnected[i][i] == 1`
- `isConnected[i][j] == isConnected[j][i]`

---

## Intuition

This problem is essentially counting connected components in an undirected graph:
- Each city is a node
- Direct connections between cities are edges
- Provinces are connected components

We can solve this using:
1. **Union-Find (Disjoint Set Union)**: Group connected cities together
2. **DFS/BFS**: Traverse from each unvisited city and mark all reachable cities
3. **Warshall's Algorithm**: Compute transitive closure (less efficient)

---

## Solution Approaches

## Approach 1: Union-Find (Optimal)

Union-Find is a data structure that keeps track of elements partitioned into disjoint sets. We use it to union connected cities and count unique roots.

#### Algorithm

1. Initialize parent array where each city is its own parent
2. Define find with path compression
3. Define union to merge two sets
4. Iterate through the matrix and union connected cities
5. Count unique roots (provinces)

#### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findCircleNum(self, isConnected: List[List[int]]) -> int:
        n = len(isConnected)
        parent = list(range(n))
        
        def find(x):
            if parent[x] != x:
                parent[x] = find(parent[x])  # Path compression
            return parent[x]
        
        def union(x, y):
            px, py = find(x), find(y)
            if px != py:
                parent[py] = px
        
        # Union connected cities
        for i in range(n):
            for j in range(i + 1, n):
                if isConnected[i][j] == 1:
                    union(i, j)
        
        # Count unique roots
        return sum(1 for i in range(n) if parent[i] == i)
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

class Solution {
private:
    vector<int> parent;
    
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);  // Path compression
        }
        return parent[x];
    }
    
    void unionSets(int x, int y) {
        int px = find(x);
        int py = find(y);
        if (px != py) {
            parent[py] = px;
        }
    }
    
public:
    int findCircleNum(vector<vector<int>>& isConnected) {
        int n = isConnected.size();
        parent.resize(n);
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
        
        // Union connected cities
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (isConnected[i][j] == 1) {
                    unionSets(i, j);
                }
            }
        }
        
        // Count unique roots
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (parent[i] == i) count++;
        }
        return count;
    }
};
```

<!-- slide -->
```java
class Solution {
    private int[] parent;
    
    private int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);  // Path compression
        }
        return parent[x];
    }
    
    private void unionSets(int x, int y) {
        int px = find(x);
        int py = find(y);
        if (px != py) {
            parent[py] = px;
        }
    }
    
    public int findCircleNum(int[][] isConnected) {
        int n = isConnected.length;
        parent = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
        
        // Union connected cities
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (isConnected[i][j] == 1) {
                    unionSets(i, j);
                }
            }
        }
        
        // Count unique roots
        int count = 0;
        for (int i = 0; i < n; i++) {
            if (parent[i] == i) count++;
        }
        return count;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} isConnected
 * @return {number}
 */
var findCircleNum = function(isConnected) {
    const n = isConnected.length;
    const parent = new Array(n).fill(0).map((_, i) => i);
    
    const find = (x) => {
        if (parent[x] !== x) {
            parent[x] = find(parent[x]);  // Path compression
        }
        return parent[x];
    };
    
    const union = (x, y) => {
        const px = find(x);
        const py = find(y);
        if (px !== py) {
            parent[py] = px;
        }
    };
    
    // Union connected cities
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (isConnected[i][j] === 1) {
                union(i, j);
            }
        }
    }
    
    // Count unique roots
    let count = 0;
    for (let i = 0; i < n; i++) {
        if (parent[i] === i) count++;
    }
    return count;
};
```
````

---

## Approach 2: Depth-First Search (DFS)

Use DFS to traverse from each unvisited city and mark all reachable cities as visited.

#### Algorithm

1. Create a visited array
2. For each unvisited city, start DFS
3. In DFS, mark current city as visited and explore all connected cities
4. Increment province count for each new DFS started
5. Return province count

#### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def findCircleNum(self, isConnected: List[List[int]]) -> int:
        n = len(isConnected)
        visited = [False] * n
        provinces = 0
        
        def dfs(city):
            visited[city] = True
            for neighbor in range(n):
                if isConnected[city][neighbor] == 1 and not visited[neighbor]:
                    dfs(neighbor)
        
        for i in range(n):
            if not visited[i]:
                dfs(i)
                provinces += 1
        
        return provinces
```

<!-- slide -->
```cpp
class Solution {
private:
    void dfs(int city, const vector<vector<int>>& isConnected, 
             vector<bool>& visited) {
        visited[city] = true;
        int n = isConnected.size();
        for (int neighbor = 0; neighbor < n; neighbor++) {
            if (isConnected[city][neighbor] == 1 && !visited[neighbor]) {
                dfs(neighbor, isConnected, visited);
            }
        }
    }
    
public:
    int findCircleNum(vector<vector<int>>& isConnected) {
        int n = isConnected.size();
        vector<bool> visited(n, false);
        int provinces = 0;
        
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                dfs(i, isConnected, visited);
                provinces++;
            }
        }
        
        return provinces;
    }
};
```

<!-- slide -->
```java
class Solution {
    private void dfs(int city, int[][] isConnected, boolean[] visited) {
        visited[city] = true;
        int n = isConnected.length;
        for (int neighbor = 0; neighbor < n; neighbor++) {
            if (isConnected[city][neighbor] == 1 && !visited[neighbor]) {
                dfs(neighbor, isConnected, visited);
            }
        }
    }
    
    public int findCircleNum(int[][] isConnected) {
        int n = isConnected.length;
        boolean[] visited = new boolean[n];
        int provinces = 0;
        
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                dfs(i, isConnected, visited);
                provinces++;
            }
        }
        
        return provinces;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} isConnected
 * @return {number}
 */
var findCircleNum = function(isConnected) {
    const n = isConnected.length;
    const visited = new Array(n).fill(false);
    let provinces = 0;
    
    const dfs = (city) => {
        visited[city] = true;
        for (let neighbor = 0; neighbor < n; neighbor++) {
            if (isConnected[city][neighbor] === 1 && !visited[neighbor]) {
                dfs(neighbor);
            }
        }
    };
    
    for (let i = 0; i < n; i++) {
        if (!visited[i]) {
            dfs(i);
            provinces++;
        }
    }
    
    return provinces;
};
```
````

---

## Approach 3: Breadth-First Search (BFS)

Use BFS instead of DFS to traverse connected cities.

#### Algorithm

1. Create a visited array
2. For each unvisited city, start BFS
3. In BFS, use a queue to explore all connected cities
4. Mark all reachable cities as visited
5. Increment province count for each new BFS started

#### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def findCircleNum(self, isConnected: List[List[int]]) -> int:
        n = len(isConnected)
        visited = [False] * n
        provinces = 0
        
        for i in range(n):
            if not visited[i]:
                # Start BFS from city i
                queue = deque([i])
                visited[i] = True
                
                while queue:
                    city = queue.popleft()
                    for neighbor in range(n):
                        if isConnected[city][neighbor] == 1 and not visited[neighbor]:
                            visited[neighbor] = True
                            queue.append(neighbor)
                
                provinces += 1
        
        return provinces
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
using namespace std;

class Solution {
public:
    int findCircleNum(vector<vector<int>>& isConnected) {
        int n = isConnected.size();
        vector<bool> visited(n, false);
        int provinces = 0;
        
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                // Start BFS from city i
                queue<int> q;
                q.push(i);
                visited[i] = true;
                
                while (!q.empty()) {
                    int city = q.front();
                    q.pop();
                    
                    for (int neighbor = 0; neighbor < n; neighbor++) {
                        if (isConnected[city][neighbor] == 1 && !visited[neighbor]) {
                            visited[neighbor] = true;
                            q.push(neighbor);
                        }
                    }
                }
                
                provinces++;
            }
        }
        
        return provinces;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int findCircleNum(int[][] isConnected) {
        int n = isConnected.length;
        boolean[] visited = new boolean[n];
        int provinces = 0;
        
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                // Start BFS from city i
                Queue<Integer> queue = new LinkedList<>();
                queue.offer(i);
                visited[i] = true;
                
                while (!queue.isEmpty()) {
                    int city = queue.poll();
                    for (int neighbor = 0; neighbor < n; neighbor++) {
                        if (isConnected[city][neighbor] == 1 && !visited[neighbor]) {
                            visited[neighbor] = true;
                            queue.offer(neighbor);
                        }
                    }
                }
                
                provinces++;
            }
        }
        
        return provinces;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} isConnected
 * @return {number}
 */
var findCircleNum = function(isConnected) {
    const n = isConnected.length;
    const visited = new Array(n).fill(false);
    let provinces = 0;
    
    for (let i = 0; i < n; i++) {
        if (!visited[i]) {
            // Start BFS from city i
            const queue = [i];
            visited[i] = true;
            
            while (queue.length > 0) {
                const city = queue.shift();
                for (let neighbor = 0; neighbor < n; neighbor++) {
                    if (isConnected[city][neighbor] === 1 && !visited[neighbor]) {
                        visited[neighbor] = true;
                        queue.push(neighbor);
                    }
                }
            }
            
            provinces++;
        }
    }
    
    return provinces;
};
```
````

---

## Complexity Analysis

| Approach | Time Complexity | Space Complexity |
|----------|-----------------|------------------|
| Union-Find | O(n² × α(n)) ≈ O(n²) | O(n) |
| DFS | O(n²) | O(n) |
| BFS | O(n²) | O(n) |

All approaches have O(n²) time complexity due to iterating through the adjacency matrix. Union-Find is amortized O(α(n)) per operation (inverse Ackermann function, nearly constant).

---

## Comparison of Approaches

| Aspect | Union-Find | DFS | BFS |
|--------|------------|-----|-----|
| **Time** | O(n² × α(n)) | O(n²) | O(n²) |
| **Space** | O(n) | O(n) | O(n) |
| **Implementation** | Moderate | Simple | Simple |
| **LeetCode Optimal** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Intuition** | Merge sets | Explore recursively | Explore level by level |

---

## Why Union-Find Works

### Key Concepts

1. **Parent Array**: Each element starts as its own parent
2. **Find**: Returns the root/representative of a set
3. **Union**: Merges two sets by making one root point to another
4. **Path Compression**: Flattens the tree for faster lookups

### Visual Example

For `isConnected = [[1,1,0],[1,1,0],[0,0,1]]`:

```
Initial: parent = [0, 1, 2]  (each is own province)
After union(0,1): parent = [0, 0, 2]  (cities 0,1 merged)
Count roots: parent[0]=0, parent[1]=0, parent[2]=2 → 2 provinces
```

---

## Related Problems

### Same Pattern (Connected Components)

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Number of Connected Components in an Undirected Graph | [Link](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) | Same problem with edge list |
| Graph Valid Tree | [Link](https://leetcode.com/problems/graph-valid-tree/) | Check if graph is a valid tree |
| Surrounded Regions | [Link](https://leetcode.com/problems/surrounded-regions/) | DFS/BFS on grid |

### Union-Find Problems

| Problem | LeetCode Link | Related Technique |
|---------|---------------|-------------------|
| Friend Circles | [Link](https://leetcode.com/problems/friend-circles/) | Same as number of provinces |
| Number of Operations to Make Network Connected | [Link](https://leetcode.com/problems/number-of-operations-to-make-network-connected/) | Union-Find with edge counting |
| Longest Consecutive Sequence | [Link](https://leetcode.com/problems/longest-consecutive-sequence/) | Union-Find with sequence |

### Pattern Reference

For more details on graph traversal and connected components, see:
- **[Graph - DFS - Connected Components / Island Counting Pattern](/patterns/graph-dfs-connected-components-island-counting)**
- **[Graph - BFS - Topological Sort Pattern](/patterns/graph-bfs-topological-sort-kahn-s)**

---

## Video Tutorial Links

### Union-Find Approach

- [NeetCode - Number of Provinces](https://www.youtube.com/watch?v=IOlGn94XW0I) - Clear visual explanation
- [Back to Back SWE - Number of Provinces](https://www.youtube.com/watch?v=8Ki7S8r4G_4) - Detailed walkthrough

### DFS/BFS Approach

- [DFS Solution Explained](https://www.youtube.com/watch?v=7z3A5E3T4Xw) - DFS traversal
- [BFS Solution](https://www.youtube.com/watch?v=9XqLN5N有多A) - BFS approach

### General Resources

- [LeetCode Official Solution](https://www.youtube.com/watch?v=7F1D6l6_zYk) - Official explanation
- [Union-Find Data Structure](https://www.youtube.com/watch?v=0jDbDKeVBjE) - Understanding DSU

---

## Follow-up Questions

### Q1: How would you return the actual provinces (list of cities in each province)?

**Answer:** Modify the algorithms to store the component each city belongs to. For Union-Find, after all unions, iterate through each root and collect cities with that root. For DFS/BFS, store the component ID during traversal.

---

### Q2: How would you handle a sparse matrix representation?

**Answer:** Convert the adjacency matrix to an adjacency list first (O(n²) to O(E)). Then use the same algorithms but iterate through adjacency lists instead of the full matrix.

---

### Q3: What if you need to find the size of the largest province?

**Answer:** Track the size of each component during union (for Union-Find) or count during traversal (for DFS/BFS). Return the maximum size found.

---

### Q4: Can you solve it without extra space?

**Answer:** The adjacency matrix is given as input, so we must use O(n) extra space for visited/parent arrays. It's impossible to solve with truly O(1) extra space since we need to track which cities have been visited.

---

### Q5: How would you modify the solution for directed connections?

**Answer:** This would become a different problem (strongly connected components). You'd need to use Kosaraju's or Tarjan's algorithm instead of the simple approaches shown here.

---

### Q6: What if the input is a list of edges instead of a matrix?

**Answer:** Build an adjacency list from the edges, then apply the same DFS/BFS or Union-Find approach. The time complexity becomes O(V + E) instead of O(n²).

---

### Q7: What edge cases should be tested?

**Answer:**
- Single city (n=1)
- All cities connected
- No cities connected (diagonal only)
- Two cities connected to each other
- Chain of connected cities
- Very large n (up to 200)

---

## Common Pitfalls

### 1. Off-by-One in Matrix Traversal
**Issue:** Not properly handling the upper triangle of the matrix.

**Solution:** Only iterate `j > i` since the matrix is symmetric (or check both directions).

### 2. Path Compression Missing
**Issue:** Without path compression, find operations become slow.

**Solution:** Always implement path compression in the find function.

### 3. Not Marking Visited
**Issue:** Infinite loops in DFS/BFS if cities aren't marked as visited.

**Solution:** Mark cities as visited immediately when adding to queue/stack.

### 4. Union-Find Without Union by Rank
**Issue:** Tree can become unbalanced, leading to O(n) find operations.

**Solution:** Add rank/size tracking and union by rank for better performance.

---

## Summary

The **Number of Provinces** problem is a classic connected components problem that can be solved using multiple approaches:

- **Union-Find**: Merge connected cities into sets, count unique roots
- **DFS**: Traverse from each unvisited city, marking all reachable cities
- **BFS**: Level-order traversal to find all connected cities

All approaches achieve O(n²) time complexity due to the matrix representation. Union-Find is often preferred for its near-constant amortized operations.

### Pattern Summary

This problem exemplifies the **Graph Connected Components** pattern, characterized by:
- Finding groups of connected nodes
- Using traversal or union-based approaches
- Tracking visited nodes to avoid reprocessing
- Counting distinct components

For more details on graph traversal patterns, see the **[Graph - DFS - Connected Components Pattern](/patterns/graph-dfs-connected-components-island-counting)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/number-of-provinces/discuss/) - Community solutions
- [Union-Find - GeeksforGeeks](https://www.geeksforgeeks.org/disjoint-set-data-structures/) - DSU explanation
- [Connected Components - Wikipedia](https://en.wikipedia.org/wiki/Connected_component_(graph_theory)) - Theory
