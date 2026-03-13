# The Earliest Moment When Everyone Become Friends

## Problem Description

There are `n` people, numbered from `0` to `n-1`. You are given a list of logs where each log is a pair of timestamps and two different person indices: `logs[i] = [timestamp_i, person_i, person_j]`, meaning that person `person_i` and person `person_j` became friends at time `timestamp_i`.

A moment is a time when every pair of people have become friends. More formally, a moment `t` is a time when for every pair of people `(i, j)`, there is a path of friendships connecting `i` and `j` using the logs with timestamp `<= t`.

Return the earliest moment when everyone becomes friends. If it's impossible for everyone to become friends, return `-1`.

**Link to problem:** [The Earliest Moment When Everyone Become Friends - LeetCode 1101](https://leetcode.com/problems/the-earliest-moment-when-everyone-become-friends/)

---

## Pattern: Union-Find (Disjoint Set Union)

This problem demonstrates the **Union-Find** pattern for tracking connected components over time.

### Core Concept

The fundamental idea is:
- Sort logs by timestamp
- Use Union-Find to track connected components
- When all n people become one component, return current timestamp

---

## Examples

### Example

**Input:** logs = [[20190101,0,1],[20190102,1,2],[20190104,2,0]], n = 3
**Output:** 20190104

**Explanation:** At time 20190104, person 0 is friends with person 1 (via log at 20190101), person 1 is friends with person 2 (via log at 20190102), and person 2 is friends with person 0 (via log at 20190104). Therefore, all three people are connected.

### Example 2

**Input:** logs = [[20190101,0,1],[20190101,2,3]], n = 4
**Output:** -1

**Explanation:** Even though person 0 is friends with person 1, and person 2 is friends with person 3, there is no connection between these two groups.

---

## Constraints

- `2 <= n <= 1000`
- `1 <= logs.length <= 10^4`
- `logs[i][0]` is the timestamp.
- `logs[i][1]` and `logs[i][2]` are different person indices.
- `logs` are not necessarily sorted and may contain duplicates.

---

## Intuition

We sort logs by timestamp and process them in order using Union-Find. Each union operation connects two people. When all n people are in a single component, we have found the earliest moment when everyone becomes friends.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **Union-Find (Optimal)** - O(m log m + m α(n))
2. **BFS/Flood Fill** - Alternative graph traversal approach

---

## Approach 1: Union-Find (Optimal)

### Algorithm Steps

1. Sort logs by timestamp
2. Initialize UnionFind with n components
3. Process each log in order:
   - Union the two people
   - Check if components == 1
   - If yes, return current timestamp
4. Return -1 if never fully connected

### Code Implementation

````carousel
```python
from typing import List

class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.components = n

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px != py:
            if self.rank[px] < self.rank[py]:
                self.parent[px] = py
            elif self.rank[px] > self.rank[py]:
                self.parent[py] = px
            else:
                self.parent[py] = px
                self.rank[px] += 1
            self.components -= 1

class Solution:
    def earliestAcq(self, logs: List[List[int]], n: int) -> int:
        """
        Find earliest moment when everyone becomes friends.
        
        Args:
            logs: List of [timestamp, person_i, person_j]
            n: Number of people
            
        Returns:
            Earliest timestamp or -1
        """
        logs.sort()
        uf = UnionFind(n)
        
        for time, a, b in logs:
            uf.union(a, b)
            if uf.components == 1:
                return time
        
        return -1
```

<!-- slide -->
```cpp
class UnionFind {
private:
    vector<int> parent, rank;
    int components;
public:
    UnionFind(int n) {
        parent.resize(n);
        rank.resize(n, 0);
        iota(parent.begin(), parent.end(), 0);
        components = n;
    }
    
    int find(int x) {
        if (parent[x] != x) parent[x] = find(parent[x]);
        return parent[x];
    }
    
    void union(int x, int y) {
        int px = find(x), py = find(y);
        if (px == py) return;
        if (rank[px] < rank[py]) swap(px, py);
        parent[py] = px;
        if (rank[px] == rank[py]) rank[px]++;
        components--;
    }
    
    int getComponents() { return components; }
};

class Solution {
public:
    int earliestAcq(vector<vector<int>>& logs, int n) {
        sort(logs.begin(), logs.end());
        UnionFind uf(n);
        
        for (const auto& log : logs) {
            int time = log[0], a = log[1], b = log[2];
            uf.union(a, b);
            if (uf.getComponents() == 1) return time;
        }
        return -1;
    }
};
```

<!-- slide -->
```java
class Solution {
    class UnionFind {
        int[] parent;
        int[] rank;
        int components;
        
        UnionFind(int n) {
            parent = new int[n];
            rank = new int[n];
            for (int i = 0; i < n; i++) parent[i] = i;
            components = n;
        }
        
        int find(int x) {
            if (parent[x] != x) parent[x] = find(parent[x]);
            return parent[x];
        }
        
        void union(int x, int y) {
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
            components--;
        }
    }
    
    public int earliestAcq(int[][] logs, int n) {
        Arrays.sort(logs, Comparator.comparingInt(a -> a[0]));
        UnionFind uf = new UnionFind(n);
        
        for (int[] log : logs) {
            int time = log[0], a = log[1], b = log[2];
            uf.union(a, b);
            if (uf.components == 1) return time;
        }
        return -1;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} logs
 * @param {number} n
 * @return {number}
 */
var earliestAcq = function(logs, n) {
    logs.sort((a, b) => a[0] - b[0]);
    
    const parent = Array.from({ length: n }, (_, i) => i);
    const rank = new Array(n).fill(0);
    let components = n;
    
    const find = (x) => {
        if (parent[x] !== x) parent[x] = find(parent[x]);
        return parent[x];
    };
    
    const union = (x, y) => {
        const px = find(x), py = find(y);
        if (px === py) return;
        if (rank[px] < rank[py]) {
            parent[px] = py;
        } else if (rank[px] > rank[py]) {
            parent[py] = px;
        } else {
            parent[py] = px;
            rank[px]++;
        }
        components--;
    };
    
    for (const [time, a, b] of logs) {
        union(a, b);
        if (components === 1) return time;
    }
    return -1;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m log m + m α(n)) where m = number of logs |
| **Space** | O(n) |

---

## Approach 2: BFS / Graph Construction (Alternative)

### Algorithm Steps

1. Build a graph from the logs as we process them in order
2. Use BFS to find when all nodes become connected
3. Start BFS from node 0 and track timestamp when all nodes are reached

### Why It Works

We can model this as a graph problem where edges are added over time. BFS from any node will reach all connected nodes at the time they become connected.

### Code Implementation

````carousel
```python
from typing import List
from collections import defaultdict, deque

class Solution:
    def earliestAcq(self, logs: List[List[int]], n: int) -> int:
        """
        Find earliest time when all people become friends.
        
        Args:
            logs: List of [timestamp, person_a, person_b]
            n: Number of people
            
        Returns:
            Earliest timestamp when all are connected
        """
        # Sort logs by timestamp
        logs.sort(key=lambda x: x[0])
        
        # Build graph incrementally
        graph = defaultdict(list)
        
        for timestamp, a, b in logs:
            graph[a].append(b)
            graph[b].append(a)
            
            # Check if all connected using BFS
            if len(graph) == n:  # All nodes have edges
                if self._is_fully_connected(graph, n):
                    return timestamp
        
        return -1
    
    def _is_fully_connected(self, graph, n):
        """Check if graph is fully connected using BFS."""
        if n <= 1:
            return True
        
        visited = set()
        queue = deque([0])
        visited.add(0)
        count = 1
        
        while queue:
            node = queue.popleft()
            for neighbor in graph[node]:
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
                    count += 1
        
        return count == n
```

<!-- slide -->
```cpp
class Solution {
public:
    int earliestAcq(vector<vector<int>>& logs, int n) {
        // Sort logs by timestamp
        sort(logs.begin(), logs.end(), [](auto& a, auto& b) {
            return a[0] < b[0];
        });
        
        vector<vector<int>> graph(n);
        
        for (const auto& log : logs) {
            int t = log[0], a = log[1], b = log[2];
            graph[a].push_back(b);
            graph[b].push_back(a);
            
            if (isFullyConnected(graph, n)) {
                return t;
            }
        }
        
        return -1;
    }
    
private:
    bool isFullyConnected(const vector<vector<int>>& graph, int n) {
        vector<bool> visited(n, false);
        queue<int> q;
        q.push(0);
        visited[0] = true;
        int count = 1;
        
        while (!q.empty()) {
            int node = q.front(); q.pop();
            for (int neighbor : graph[node]) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.push(neighbor);
                    count++;
                }
            }
        }
        
        return count == n;
    }
};
```

<!-- slide -->
```java
class Solution {
    public int earliestAcq(int[][] logs, int n) {
        // Sort logs by timestamp
        Arrays.sort(logs, (a, b) -> a[0] - b[0]);
        
        List<List<Integer>> graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }
        
        for (int[] log : logs) {
            int t = log[0], a = log[1], b = log[2];
            graph.get(a).add(b);
            graph.get(b).add(a);
            
            if (isFullyConnected(graph, n)) {
                return t;
            }
        }
        
        return -1;
    }
    
    private boolean isFullyConnected(List<List<Integer>> graph, int n) {
        boolean[] visited = new boolean[n];
        Queue<Integer> q = new LinkedList<>();
        q.add(0);
        visited[0] = true;
        int count = 1;
        
        while (!q.isEmpty()) {
            int node = q.poll();
            for (int neighbor : graph.get(node)) {
                if (!visited[neighbor]) {
                    visited[neighbor] = true;
                    q.add(neighbor);
                    count++;
                }
            }
        }
        
        return count == n;
    }
}
```

<!-- slide -->
```javascript
var earliestAcq = function(logs, n) {
    // Sort logs by timestamp
    logs.sort((a, b) => a[0] - b[0]);
    
    const graph = Array.from({length: n}, () => []);
    
    for (const [t, a, b] of logs) {
        graph[a].push(b);
        graph[b].push(a);
        
        if (isFullyConnected(graph, n)) {
            return t;
        }
    }
    
    return -1;
};

function isFullyConnected(graph, n) {
    const visited = new Array(n).fill(false);
    const queue = [0];
    visited[0] = true;
    let count = 1;
    
    while (queue.length > 0) {
        const node = queue.shift();
        for (const neighbor of graph[node]) {
            if (!visited[neighbor]) {
                visited[neighbor] = true;
                queue.push(neighbor);
                count++;
            }
        }
    }
    
    return count === n;
}
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m log m + m × n) in worst case |
| **Space** | O(n + m) |

---

## Comparison of Approaches

| Aspect | Union-Find | BFS / Graph |
|--------|-----------|-------------|
| **Time** | O(m log m + m α(n)) | O(m log m + m × n) |
| **Space** | O(n) | O(n + m) |
| **Implementation** | More complex | Simpler concept |
| **Efficiency** | Better α(n) amortized | Worse for dense graphs |

Union-Find is more efficient for this problem.

---

## Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Number of Provinces | [Link](https://leetcode.com/problems/number-of-provinces/) | Similar Union-Find |
| Graph Valid Tree | [Link](https://leetcode.com/problems/graph-valid-tree/) | Union-Find for cycle detection |
| Redundant Connection | [Link](https://leetcode.com/problems/redundant-connection/) | Union-Find application |

---

## Video Tutorial Links

- [NeetCode - Earliest Moment](https://www.youtube.com/watch?v=8hQPLSSjkMY) - Clear explanation
- [Union-Find Explained](https://www.youtube.com/watch?v=7C_f7fD2p14) - Understanding the algorithm

---

## Follow-up Questions

### Q1: Why sort the logs?

**Answer:** We need to process friendships in chronological order to find the earliest moment when everyone becomes connected.

### Q2: How does Union-Find handle duplicates?

**Answer:** If two people are already in the same component, the union operation does nothing. Duplicates don't affect the result.

### Q3: What if logs are already sorted?

**Answer:** The sorting step would be O(m) instead of O(m log m), making the algorithm faster.

---

## Common Pitfalls

### 1. Not Sorting
**Issue**: Processing logs in wrong order.
**Solution**: Always sort logs by timestamp first.

### 2. Component Count
**Issue**: Not tracking component count correctly.
**Solution**: Decrement components only when two different components are merged.

### 3. Return Value
**Issue**: Not returning -1 when impossible.
**Solution**: Return -1 if never fully connected after processing all logs.

### 4. Time Complexity
**Issue**: Using naive approach instead of Union-Find.
**Solution**: Union-Find provides nearly O(1) operations with path compression.

---

## Summary

The **Earliest Moment When Everyone Become Friends** problem demonstrates **Union-Find**:
- Sort logs by timestamp
- Union people as friendships form
- Track when all n people become one component
- O(m log m) time, O(n) space

This is a classic application of Union-Find for tracking connectivity over time.

---

## Additional Resources

- [LeetCode Problem Discussion](https://leetcode.com/problems/the-earliest-moment-when-everyone-become-friends/discuss/)
- [Union-Find - GeeksforGeeks](https://www.geeksforgeeks.org/disjoint-set-data-structures/)
