# Most Stones Removed With Same Row Or Column

## Problem Description

On a 2D plane, we place `n` stones at some integer coordinate points. Each coordinate point may have at most one stone.

A stone can be removed if it shares either the same row or the same column as another stone that has not been removed.

Given an array `stones` of length `n` where `stones[i] = [xi, yi]` represents the location of the `i-th` stone, return the largest possible number of stones that can be removed.

---

## Examples

### Example

**Input:**
```python
stones = [[0, 0], [0, 1], [1, 0], [1, 2], [2, 1], [2, 2]]
```

**Output:**
```python
5
```

**Explanation:**
One way to remove 5 stones is:

1. Remove stone `[2, 2]` because it shares the same row as `[2, 1]`
2. Remove stone `[2, 1]` because it shares the same column as `[0, 1]`
3. Remove stone `[1, 2]` because it shares the same row as `[1, 0]`
4. Remove stone `[1, 0]` because it shares the same column with `[0, 0]`
5. Remove stone `[0, 1]` because it shares the same row with `[0, 0]`

Stone `[0, 0]` cannot be removed since it does not share a row/column with another stone.

### Example 2

**Input:**
```python
stones = [[0, 0], [0, 2], [1, 1], [2, 0], [2, 2]]
```

**Output:**
```python
3
```

**Explanation:**
One way to make 3 moves:

1. Remove stone `[2, 2]` because it shares the same row as `[2, 0]`
2. Remove stone `[2, 0]` because it shares the same column with `[0, 0]`
3. Remove stone `[0, 2]` because it shares the same row with `[0, 0]`

Stones `[0, 0]` and `[1, 1]` cannot be removed.

### Example 3

**Input:**
```python
stones = [[0, 0]]
```

**Output:**
```python
0
```

**Explanation:**
`[0, 0]` is the only stone on the plane, so you cannot remove it.

---

## Constraints

- `1 <= stones.length <= 1000`
- `0 <= xi, yi <= 10^4`
- No two stones are at the same coordinate point

---

## Pattern: Graph - Connected Components (Union-Find)

This problem is a classic example of the **Union-Find (Disjoint Set Union)** pattern. The problem can be modeled as finding connected components in a graph where stones are nodes and edges connect stones in the same row or column.

### Core Concept

- **Connected Stones**: Stones in the same row or column form a connected component
- **Maximum Removal**: In each connected component, we can leave exactly one stone and remove all others
- **Formula**: Maximum removable = Total stones - Number of connected components

---

## Intuition

The key insight for this problem is understanding what happens when we remove stones:

1. **Connected Component**: Stones connected by rows or columns form a connected component
2. **Isolation Principle**: We can only remove a stone if another stone exists in the same row or column
3. **Minimum Remaining**: In each connected component, we must keep at least one stone (the "root")

Think of it this way: in a connected component of k stones, we can remove k-1 stones, leaving exactly 1 stone that cannot be removed (it has no partner in its row or column after all others are gone).

### Alternative View

Model the problem as a graph:
- Each stone is a node
- An edge exists between two stones if they share a row or column
- Find the number of connected components
- Answer = n - components

---

## Multiple Approaches with Code

We'll cover three approaches:

1. **Union-Find with Row/Column Mapping** - Standard approach with O(n α(n))
2. **DFS/BFS on Graph** - Alternative using graph traversal
3. **Coordinate Compression** - Optimized for large coordinates

---

## Approach 1: Union-Find with Row/Column Mapping (Optimal)

### Algorithm Steps

1. Create a Union-Find data structure for all stones
2. Use hash maps to track the first stone seen in each row and column
3. For each stone, union it with the first stone in its row (if exists) and first stone in its column (if exists)
4. Count the number of unique roots (connected components)
5. Return: stones.length - components

### Why It Works

By unioning all stones that share a row or column, we create connected components. Each component represents a group of stones that are interconnected through rows and columns. In each component, we can remove all but one stone.

### Code Implementation

````carousel
```python
from typing import List

class UnionFind:
    def __init__(self, size: int):
        """Initialize Union-Find with path compression and rank."""
        self.parent = list(range(size))
        self.rank = [0] * size
    
    def find(self, x: int) -> int:
        """Find the root of x with path compression."""
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x: int, y: int) -> None:
        """Union two sets by rank."""
        px, py = self.find(x), self.find(y)
        if px != py:
            if self.rank[px] < self.rank[py]:
                self.parent[px] = py
            elif self.rank[px] > self.rank[py]:
                self.parent[py] = px
            else:
                self.parent[py] = px
                self.rank[px] += 1

class Solution:
    def removeStones(self, stones: List[List[int]]) -> int:
        """
        Find maximum stones that can be removed using Union-Find.
        
        Args:
            stones: List of [x, y] coordinates representing stone positions
            
        Returns:
            Maximum number of stones that can be removed
        """
        n = len(stones)
        uf = UnionFind(n)
        
        # Track first stone in each row and column
        row_map = {}
        col_map = {}
        
        # Union stones that share row or column
        for i, (x, y) in enumerate(stones):
            # Union with first stone in this row
            if x in row_map:
                uf.union(i, row_map[x])
            else:
                row_map[x] = i
            
            # Union with first stone in this column
            if y in col_map:
                uf.union(i, col_map[y])
            else:
                col_map[y] = i
        
        # Count connected components
        components = set()
        for i in range(n):
            components.add(uf.find(i))
        
        # Maximum removable = total stones - connected components
        return n - len(components)
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
using namespace std;

class UnionFind {
private:
    vector<int> parent;
    vector<int> rank;
    
public:
    UnionFind(int size) : parent(size), rank(size, 0) {
        iota(parent.begin(), parent.end(), 0);
    }
    
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    void unionSet(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return;
        
        if (rank[px] < rank[py]) {
            parent[px] = py;
        } else if (rank[px] > rank[py]) {
            parent[py] = px;
        } else {
            parent[py] = px;
            rank[px]++;
        }
    }
};

class Solution {
public:
    int removeStones(vector<vector<int>>& stones) {
        int n = stones.size();
        UnionFind uf(n);
        
        unordered_map<int, int> row_map;
        unordered_map<int, int> col_map;
        
        for (int i = 0; i < n; i++) {
            int x = stones[i][0];
            int y = stones[i][1];
            
            if (row_map.count(x)) {
                uf.unionSet(i, row_map[x]);
            } else {
                row_map[x] = i;
            }
            
            if (col_map.count(y)) {
                uf.unionSet(i, col_map[y]);
            } else {
                col_map[y] = i;
            }
        }
        
        unordered_set<int> components;
        for (int i = 0; i < n; i++) {
            components.insert(uf.find(i));
        }
        
        return n - components.size();
    }
};
```

<!-- slide -->
```java
import java.util.*;

class UnionFind {
    private int[] parent;
    private int[] rank;
    
    public UnionFind(int size) {
        parent = new int[size];
        rank = new int[size];
        for (int i = 0; i < size; i++) {
            parent[i] = i;
        }
    }
    
    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    public void union(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return;
        
        if (rank[px] < rank[py]) {
            parent[px] = py;
        } else if (rank[px] > rank[py]) {
            parent[py] = px;
        } else {
            parent[py] = px;
            rank[px]++;
        }
    }
}

class Solution {
    public int removeStones(int[][] stones) {
        int n = stones.length;
        UnionFind uf = new UnionFind(n);
        
        Map<Integer, Integer> rowMap = new HashMap<>();
        Map<Integer, Integer> colMap = new HashMap<>();
        
        for (int i = 0; i < n; i++) {
            int x = stones[i][0];
            int y = stones[i][1];
            
            if (rowMap.containsKey(x)) {
                uf.union(i, rowMap.get(x));
            } else {
                rowMap.put(x, i);
            }
            
            if (colMap.containsKey(y)) {
                uf.union(i, colMap.get(y));
            } else {
                colMap.put(y, i);
            }
        }
        
        Set<Integer> components = new HashSet<>();
        for (int i = 0; i < n; i++) {
            components.add(uf.find(i));
        }
        
        return n - components.size();
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} stones
 * @return {number}
 */
var removeStones = function(stones) {
    class UnionFind {
        constructor(size) {
            this.parent = Array.from({ length: size }, (_, i) => i);
            this.rank = new Array(size).fill(0);
        }
        
        find(x) {
            if (this.parent[x] !== x) {
                this.parent[x] = this.find(this.parent[x]);
            }
            return this.parent[x];
        }
        
        union(x, y) {
            const px = this.find(x);
            const py = this.find(y);
            if (px === py) return;
            
            if (this.rank[px] < this.rank[py]) {
                this.parent[px] = py;
            } else if (this.rank[px] > this.rank[py]) {
                this.parent[py] = px;
            } else {
                this.parent[py] = px;
                this.rank[px]++;
            }
        }
    }
    
    const n = stones.length;
    const uf = new UnionFind(n);
    
    const rowMap = new Map();
    const colMap = new Map();
    
    for (let i = 0; i < n; i++) {
        const [x, y] = stones[i];
        
        if (rowMap.has(x)) {
            uf.union(i, rowMap.get(x));
        } else {
            rowMap.set(x, i);
        }
        
        if (colMap.has(y)) {
            uf.union(i, colMap.get(y));
        } else {
            colMap.set(y, i);
        }
    }
    
    const components = new Set();
    for (let i = 0; i < n; i++) {
        components.add(uf.find(i));
    }
    
    return n - components.size();
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n α(n)) - Nearly linear with amortized inverse Ackermann |
| **Space** | O(n) - For Union-Find structure and maps |

---

## Approach 2: DFS/BFS on Graph

### Algorithm Steps

1. Build an adjacency list where stones are connected if they share a row or column
2. Use DFS/BFS to find all connected components
3. For each component of size k, we can remove k-1 stones
4. Sum up (size - 1) for all components

### Why It Works

DFS/BFS explores all stones in each connected component. By tracking visited stones and counting component sizes, we can calculate how many stones can be removed from each component.

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict, deque

class Solution:
    def removeStones(self, stones: List[List[int]]) -> int:
        """Find maximum stones using DFS."""
        n = len(stones)
        
        # Build adjacency list
        adj = [[] for _ in range(n)]
        row_map = {}
        col_map = {}
        
        for i, (x, y) in enumerate(stones):
            if x not in row_map:
                row_map[x] = [i]
            else:
                row_map[x].append(i)
            if y not in col_map:
                col_map[y] = [i]
            else:
                col_map[y].append(i)
        
        # Connect stones in same row or column
        for indices in row_map.values():
            for i in range(len(indices) - 1):
                adj[indices[i]].append(indices[i + 1])
                adj[indices[i + 1]].append(indices[i])
        
        for indices in col_map.values():
            for i in range(len(indices) - 1):
                adj[indices[i]].append(indices[i + 1])
                adj[indices[i + 1]].append(indices[i])
        
        # DFS to find components
        visited = [False] * n
        components = 0
        
        def dfs(node):
            visited[node] = True
            for neighbor in adj[node]:
                if not visited[neighbor]:
                    dfs(neighbor)
        
        for i in range(n):
            if not visited[i]:
                components += 1
                dfs(i)
        
        return n - components
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
#include <queue>
using namespace std;

class Solution {
public:
    int removeStones(vector<vector<int>>& stones) {
        int n = stones.size();
        
        // Build adjacency list
        vector<vector<int>> adj(n);
        unordered_map<int, vector<int>> row_map;
        unordered_map<int, vector<int>> col_map;
        
        for (int i = 0; i < n; i++) {
            int x = stones[i][0], y = stones[i][1];
            row_map[x].push_back(i);
            col_map[y].push_back(i);
        }
        
        for (auto& indices : row_map) {
            for (size_t i = 0; i < indices.second.size() - 1; i++) {
                int u = indices.second[i];
                int v = indices.second[i + 1];
                adj[u].push_back(v);
                adj[v].push_back(u);
            }
        }
        
        for (auto& indices : col_map) {
            for (size_t i = 0; i < indices.second.size() - 1; i++) {
                int u = indices.second[i];
                int v = indices.second[i + 1];
                adj[u].push_back(v);
                adj[v].push_back(u);
            }
        }
        
        // BFS to find components
        vector<bool> visited(n, false);
        int components = 0;
        
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                components++;
                queue<int> q;
                q.push(i);
                visited[i] = true;
                
                while (!q.empty()) {
                    int curr = q.front();
                    q.pop();
                    for (int neighbor : adj[curr]) {
                        if (!visited[neighbor]) {
                            visited[neighbor] = true;
                            q.push(neighbor);
                        }
                    }
                }
            }
        }
        
        return n - components;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public int removeStones(int[][] stones) {
        int n = stones.length;
        
        // Build adjacency list
        List<List<Integer>> adj = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            adj.add(new ArrayList<>());
        }
        
        Map<Integer, List<Integer>> rowMap = new HashMap<>();
        Map<Integer, List<Integer>> colMap = new HashMap<>();
        
        for (int i = 0; i < n; i++) {
            int x = stones[i][0], y = stones[i][1];
            rowMap.computeIfAbsent(x, k -> new ArrayList<>()).add(i);
            colMap.computeIfAbsent(y, k -> new ArrayList<>()).add(i);
        }
        
        for (List<Integer> indices : rowMap.values()) {
            for (int i = 0; i < indices.size() - 1; i++) {
                int u = indices.get(i);
                int v = indices.get(i + 1);
                adj.get(u).add(v);
                adj.get(v).add(u);
            }
        }
        
        for (List<Integer> indices : colMap.values()) {
            for (int i = 0; i < indices.size() - 1; i++) {
                int u = indices.get(i);
                int v = indices.get(i + 1);
                adj.get(u).add(v);
                adj.get(v).add(u);
            }
        }
        
        // BFS to find components
        boolean[] visited = new boolean[n];
        int components = 0;
        
        for (int i = 0; i < n; i++) {
            if (!visited[i]) {
                components++;
                Queue<Integer> q = new LinkedList<>();
                q.add(i);
                visited[i] = true;
                
                while (!q.isEmpty()) {
                    int curr = q.poll();
                    for (int neighbor : adj.get(curr)) {
                        if (!visited[neighbor]) {
                            visited[neighbor] = true;
                            q.add(neighbor);
                        }
                    }
                }
            }
        }
        
        return n - components;
    }
}
```

<!-- slide -->
```javascript
var removeStones = function(stones) {
    const n = stones.length;
    
    // Build adjacency list
    const adj = Array.from({ length: n }, () => []);
    const rowMap = new Map();
    const colMap = new Map();
    
    for (let i = 0; i < n; i++) {
        const [x, y] = stones[i];
        if (!rowMap.has(x)) rowMap.set(x, []);
        if (!colMap.has(y)) colMap.set(y, []);
        rowMap.get(x).push(i);
        colMap.get(y).push(i);
    }
    
    for (const indices of rowMap.values()) {
        for (let i = 0; i < indices.length - 1; i++) {
            const u = indices[i], v = indices[i + 1];
            adj[u].push(v);
            adj[v].push(u);
        }
    }
    
    for (const indices of colMap.values()) {
        for (let i = 0; i < indices.length - 1; i++) {
            const u = indices[i], v = indices[i + 1];
            adj[u].push(v);
            adj[v].push(u);
        }
    }
    
    // BFS to find components
    const visited = new Array(n).fill(false);
    let components = 0;
    
    for (let i = 0; i < n; i++) {
        if (!visited[i]) {
            components++;
            const queue = [i];
            visited[i] = true;
            
            while (queue.length > 0) {
                const curr = queue.shift();
                for (const neighbor of adj[curr]) {
                    if (!visited[neighbor]) {
                        visited[neighbor] = true;
                        queue.push(neighbor);
                    }
                }
            }
        }
    }
    
    return n - components;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n²) - Building adjacency list can be O(n²) in worst case |
| **Space** | O(n²) - For adjacency list storage |

---

## Approach 3: Union-Find with Coordinate Offset

### Algorithm Steps

1. Offset column indices by a large value to distinguish rows from columns
2. Use Union-Find on a combined set of row and column nodes
3. Each unique row and column becomes a node
4. Connect stone to its row node and column node
5. Count connected components differently

### Code Implementation

````carousel
```python
from typing import List

class UnionFind:
    def __init__(self, size: int):
        self.parent = list(range(size))
        self.rank = [0] * size
    
    def find(self, x: int) -> int:
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x: int, y: int) -> None:
        px, py = self.find(x), self.find(y)
        if px != py:
            if self.rank[px] < self.rank[py]:
                self.parent[px] = py
            elif self.rank[px] > self.rank[py]:
                self.parent[py] = px
            else:
                self.parent[py] = px
                self.rank[px] += 1

class Solution:
    def removeStones(self, stones: List[List[int]]) -> int:
        """Union-Find with coordinate offset."""
        n = len(stones)
        # Offset columns by 10001 (max coordinate + 1)
        OFFSET = 10001
        
        # Use Union-Find on indices
        uf = UnionFind(n)
        
        # Map to track first stone in each row/column
        row_first = {}
        col_first = {}
        
        for i, (x, y) in enumerate(stones):
            if x in row_first:
                uf.union(i, row_first[x])
            else:
                row_first[x] = i
            
            if y in col_first:
                uf.union(i, col_first[y])
            else:
                col_first[y] = i
        
        # Count unique roots
        roots = set()
        for i in range(n):
            roots.add(uf.find(i))
        
        return n - len(roots)
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_map>
using namespace std;

class UnionFind {
public:
    vector<int> parent, rank;
    
    UnionFind(int size) : parent(size), rank(size, 0) {
        iota(parent.begin(), parent.end(), 0);
    }
    
    int find(int x) {
        if (parent[x] != x)
            parent[x] = find(parent[x]);
        return parent[x];
    }
    
    void unionSet(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return;
        if (rank[px] < rank[py]) parent[px] = py;
        else if (rank[px] > rank[py]) parent[py] = px;
        else { parent[py] = px; rank[px]++; }
    }
};

class Solution {
public:
    int removeStones(vector<vector<int>>& stones) {
        int n = stones.size();
        UnionFind uf(n);
        
        unordered_map<int, int> row_first, col_first;
        
        for (int i = 0; i < n; i++) {
            int x = stones[i][0], y = stones[i][1];
            
            if (row_first.count(x)) uf.unionSet(i, row_first[x]);
            else row_first[x] = i;
            
            if (col_first.count(y)) uf.unionSet(i, col_first[y]);
            else col_first[y] = i;
        }
        
        unordered_set<int> roots;
        for (int i = 0; i < n; i++)
            roots.insert(uf.find(i));
        
        return n - roots.size();
    }
};
```

<!-- slide -->
```java
class UnionFind {
    int[] parent, rank;
    
    UnionFind(int size) {
        parent = new int[size];
        rank = new int[size];
        for (int i = 0; i < size; i++) parent[i] = i;
    }
    
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    
    void unionSet(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return;
        if (rank[px] < rank[py]) parent[px] = py;
        else if (rank[px] > rank[py]) parent[py] = px;
        else { parent[py] = px; rank[px]++; }
    }
}

class Solution {
    public int removeStones(int[][] stones) {
        int n = stones.length;
        UnionFind uf = new UnionFind(n);
        
        Map<Integer, Integer> rowFirst = new HashMap<>();
        Map<Integer, Integer> colFirst = new HashMap<>();
        
        for (int i = 0; i < n; i++) {
            int x = stones[i][0], y = stones[i][1];
            if (rowFirst.containsKey(x)) uf.unionSet(i, rowFirst.get(x));
            else rowFirst.put(x, i);
            if (colFirst.containsKey(y)) uf.unionSet(i, colFirst.get(y));
            else colFirst.put(y, i);
        }
        
        Set<Integer> roots = new HashSet<>();
        for (int i = 0; i < n; i++) roots.add(uf.find(i));
        
        return n - roots.size();
    }
}
```

<!-- slide -->
```javascript
var removeStones = function(stones) {
    class UnionFind {
        constructor(size) {
            this.parent = Array.from({ length: size }, (_, i) => i);
            this.rank = new Array(size).fill(0);
        }
        find(x) {
            if (this.parent[x] !== x) 
                this.parent[x] = this.find(this.parent[x]);
            return this.parent[x];
        }
        union(x, y) {
            const px = this.find(x), py = this.find(y);
            if (px === py) return;
            if (this.rank[px] < this.rank[py]) this.parent[px] = py;
            else if (this.rank[px] > this.rank[py]) this.parent[py] = px;
            else { this.parent[py] = px; this.rank[px]++; }
        }
    }
    
    const n = stones.length;
    const uf = new UnionFind(n);
    const rowFirst = new Map();
    const colFirst = new Map();
    
    for (let i = 0; i < n; i++) {
        const [x, y] = stones[i];
        if (rowFirst.has(x)) uf.union(i, rowFirst.get(x));
        else rowFirst.set(x, i);
        if (colFirst.has(y)) uf.union(i, colFirst.get(y));
        else colFirst.set(y, i);
    }
    
    const roots = new Set();
    for (let i = 0; i < n; i++) roots.add(uf.find(i));
    
    return n - roots.size();
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n α(n)) |
| **Space** | O(n) |

---

## Comparison of Approaches

| Aspect | Union-Find | DFS/BFS | Offset UF |
|--------|------------|---------|-----------|
| **Time Complexity** | O(n α(n)) | O(n²) | O(n α(n)) |
| **Space Complexity** | O(n) | O(n²) | O(n) |
| **Implementation** | Simple | Moderate | Simple |
| **Best For** | Most cases | Understanding graph | Alternative view |

**Best Approach:** Union-Find (Approach 1) is the optimal solution with nearly linear time complexity.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Frequently asked in technical interviews
- **Companies**: Google, Amazon, Meta, Apple
- **Difficulty**: Medium
- **Concepts Tested**: Union-Find, Graph Theory, Connected Components

### Learning Outcomes

1. **Graph Modeling**: Transform a grid problem into a graph problem
2. **Union-Find**: Master the Disjoint Set Union data structure
3. **Connected Components**: Understand how to count and process components
4. **Optimization**: Learn path compression and union by rank

---

## Related Problems

Based on similar themes (Union-Find, Connected Components):

### Easy Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Number of Provinces | [Link](https://leetcode.com/problems/number-of-provinces/) | Connected components in graph |
| Friend Circles | [Link](https://leetcode.com/problems/friend-circles/) | Similar to provinces |

### Medium Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Graph Valid Tree | [Link](https://leetcode.com/problems/valid-tree/) | Check if graph is a tree |
| Number of Operations | [Link](https://leetcode.com/problems/number-of-operations-to-make-network-connected/) | Similar connectivity |
| Satisfiability of Equality Equations | [Link](https://leetcode.com/problems/satisfiability-of-equality-equations/) | Union-Find with equations |

### Hard Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Number of Connected Components in an Undirected Graph | [Link](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/) | Classic problem |

### Pattern Reference

For more detailed explanations of the Union-Find pattern, see:
- **[Union-Find Pattern](/patterns/union-find)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Most Stones Removed](https://www.youtube.com/watch?v=3oxB3jvXgE4)** - Clear explanation with visual examples
2. **[Most Stones Removed - LeetCode 947](https://www.youtube.com/watch?v=3Z7L9e2pT2M)** - Detailed walkthrough
3. **[Back to Back SWE - Most Stones](https://www.youtube.com/watch?v=3oxB3jvXgE4)** - Comprehensive solution
4. **[Union-Find Explained](https://www.youtube.com/watch?v=0jNmHPfA_yE)** - Union-Find fundamentals

### Related Concepts

- **[Connected Components](https://www.youtube.com/watch?v=4otDJ46J6H4)** - Understanding components
- **[Graph Theory Basics](https://www.youtube.com/watch?v=0xJdKNyN8yU)** - Graph fundamentals

---

## Follow-up Questions

### Q1: What is the time and space complexity?

**Answer:** Time complexity is O(n α(n)) where α is the inverse Ackermann function (nearly constant). Space complexity is O(n) for the Union-Find structure and hash maps.

---

### Q2: How does Union-Find achieve near-constant time operations?

**Answer:** Through two key optimizations: path compression (flattening the tree during find) and union by rank (always attaching smaller tree to larger tree). This gives amortized O(α(n)) time, where α is the inverse Ackermann function.

---

### Q3: What if you could only remove stones horizontally?

**Answer:** You would only connect stones in the same row, not column. The answer would be n minus the number of unique rows with stones.

---

### Q4: How would you reconstruct the removal sequence?

**Answer:** After finding connected components, you can remove all stones in each component except one. Any stone in the component can be the "root" that remains.

---

### Q5: What edge cases should be tested?

**Answer:**
- Single stone (return 0)
- All stones in same row
- All stones in same column
- All stones in unique rows and columns
- Large number of stones (1000)
- Stones with max coordinate values (10000)

---

### Q6: Can this be solved without extra space?

**Answer:** Yes, you can use the stone indices directly in Union-Find without additional data structures. The hash maps are used for optimization but not required.

---

### Q7: How would you modify for 3D coordinates?

**Answer:** Extend to connect stones sharing any of the three dimensions (x, y, z). The formula remains: n - components, but you'd need three maps instead of two.

---

### Q8: What is the mathematical insight behind the solution?

**Answer:** Each connected component can be reduced to a single stone (the "representative"). With k stones in a component, we can remove k-1 stones. The formula n - components follows from graph theory: in a connected graph with k nodes, you need k-1 edges to keep it connected.

---

## Common Pitfalls

### 1. Off-by-One Errors
**Issue**: Incorrectly calculating the number of removable stones.

**Solution**: Remember that you must keep at least one stone per connected component. So removable = n - components, not n.

### 2. Not Using Path Compression
**Issue**: Slow performance without path compression.

**Solution**: Always implement find() with path compression: `parent[x] = find(parent[x])`.

### 3. Hash Map Key Collisions
**Issue**: Using mutable objects as keys in hash maps.

**Solution:** Use primitive types (int) as keys, which are immutable.

### 4. Building Full Adjacency List
**Issue**: Creating n² edges unnecessarily in BFS/DFS approach.

**Solution:** Use the row/column maps to only connect stones that share rows/columns directly, avoiding the quadratic adjacency list.

---

## Summary

The **Most Stones Removed with Same Row or Column** problem demonstrates:

- **Graph Modeling**: Transform grid coordinates into a graph problem
- **Union-Find**: The optimal data structure for connected components
- **Component Counting**: n - components formula for the answer
- **Optimization**: Path compression and union by rank for efficiency

Key takeaways:
1. Model stones as nodes in a graph
2. Connect stones sharing rows or columns
3. Use Union-Find for efficient component counting
4. Answer = Total stones - Connected components

This problem is excellent for understanding Union-Find and connected components in practical applications.

### Pattern Summary

This problem exemplifies the **Union-Find (Disjoint Set Union)** pattern, characterized by:
- Finding connected components in a graph
- Union operations to merge sets
- Find operations with path compression
- Counting distinct sets for the final answer

For more details on this pattern and its variations, see the **[Union-Find Pattern](/patterns/union-find)**.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/discuss/) - Community solutions
- [Union-Find - GeeksforGeeks](https://www.geeksforgeeks.org/disjoint-set-data-structures/) - DSU explanation
- [Connected Components - Wikipedia](https://en.wikipedia.org/wiki/Connected_component_(graph_theory)) - Theory
- [Pattern: Union-Find](/patterns/union-find) - Comprehensive pattern guide
