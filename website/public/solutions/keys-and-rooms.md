# Keys and Rooms

## Problem Description

There are `n` rooms labeled from `0` to `n - 1`, and all the rooms are locked except for room `0`. Your goal is to visit all the rooms. However, you cannot enter a locked room without having its key.

When you visit a room, you may find a set of distinct keys in it. Each key has a number on it, denoting which room it unlocks, and you can take all of them with you to unlock the other rooms.

Given an array `rooms` where `rooms[i]` is the set of keys you can obtain if you visited room `i`, return `true` if you can visit all the rooms, or `false` otherwise.

**LeetCode Link:** [LeetCode 841 - Keys and Rooms](https://leetcode.com/problems/keys-and-rooms/)

---

## Examples

### Example

**Input:** `rooms = [[1],[2],[3],[]]`

**Output:** `true`

**Explanation:**
- Visit room 0 and pick up key 1.
- Visit room 1 and pick up key 2.
- Visit room 2 and pick up key 3.
- Visit room 3.
- Since we were able to visit every room, we return `true`.

### Example 2

**Input:** `rooms = [[1,3],[3,0,1],[2],[0]]`

**Output:** `false`

**Explanation:** We cannot enter room 2 since the only key that unlocks it is in that room.

---

## Constraints

- `n == rooms.length`
- `2 <= n <= 1000`
- `0 <= rooms[i].length <= 1000`
- `1 <= sum(rooms[i].length) <= 3000`
- `0 <= rooms[i][j] < n`
- All the values of `rooms[i]` are unique.

---

## Pattern: Graph Traversal - BFS/DFS

This problem demonstrates the **Graph Traversal** pattern using BFS or DFS. The key is treating rooms as nodes and keys as edges.

### Core Concept

- **Graph Model**: Rooms are nodes, keys are directed edges
- **Traversal**: BFS or DFS from room 0
- **Reachability**: Check if all rooms are reachable
- **Graph Type**: Directed graph where edges go from room to key's room

### Why It Works

The algorithm works because:
1. Start from room 0 with available keys
2. Visit all reachable rooms using BFS/DFS
3. Collect more keys from newly visited rooms
4. If all rooms visited, return true

---

## Intuition

The key insight is that this is a **graph reachability problem**. We can model it as:

1. **Graph Representation**: Each room is a node, and each key in a room creates a directed edge to the room that key opens.

2. **Traversal**: Starting from room 0, we explore all reachable rooms by:
   - Visiting a room and collecting its keys
   - Using those keys to unlock and visit new rooms
   - Continuing until we can't find any new rooms

3. **Connection Check**: If we've visited all rooms (count == n), return true; otherwise, return false.

This is essentially checking if all nodes in a directed graph are reachable from a starting node - a classic graph traversal problem.

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **BFS (Breadth-First Search)** - Level-order traversal
2. **DFS (Depth-First Search)** - Recursive approach

---

## Approach 1: BFS (Breadth-First Search)

### Why It Works

BFS explores the graph level by level, starting from room 0. We use a queue to process rooms and a visited set to track which rooms we've entered. When we visit a room, we collect all its keys and add unvisited rooms to the queue.

### Code Implementation

````carousel
```python
from typing import List
from collections import deque

class Solution:
    def canVisitAllRooms(self, rooms: List[List[int]]) -> bool:
        """
        Check if all rooms can be visited using BFS.
        
        Args:
            rooms: List of keys found in each room
            
        Returns:
            True if all rooms can be visited, False otherwise
        """
        n = len(rooms)
        visited = set()
        queue = deque([0])
        visited.add(0)
        
        while queue:
            curr = queue.popleft()
            for key in rooms[curr]:
                if key not in visited:
                    visited.add(key)
                    queue.append(key)
        
        return len(visited) == n
```

<!-- slide -->
```cpp
#include <vector>
#include <unordered_set>
#include <queue>
using namespace std;

class Solution {
public:
    bool canVisitAllRooms(vector<vector<int>>& rooms) {
        int n = rooms.size();
        unordered_set<int> visited;
        queue<int> q;
        
        q.push(0);
        visited.insert(0);
        
        while (!q.empty()) {
            int curr = q.front();
            q.pop();
            
            for (int key : rooms[curr]) {
                if (visited.find(key) == visited.end()) {
                    visited.insert(key);
                    q.push(key);
                }
            }
        }
        
        return visited.size() == n;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public boolean canVisitAllRooms(List<List<Integer>> rooms) {
        int n = rooms.size();
        Set<Integer> visited = new HashSet<>();
        Queue<Integer> queue = new LinkedList<>();
        
        queue.add(0);
        visited.add(0);
        
        while (!queue.isEmpty()) {
            int curr = queue.poll();
            
            for (int key : rooms.get(curr)) {
                if (!visited.contains(key)) {
                    visited.add(key);
                    queue.add(key);
                }
            }
        }
        
        return visited.size() == n;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {number[][]} rooms
 * @return {boolean}
 */
var canVisitAllRooms = function(rooms) {
    const n = rooms.length;
    const visited = new Set();
    const queue = [0];
    visited.add(0);
    
    while (queue.length > 0) {
        const curr = queue.shift();
        
        for (const key of rooms[curr]) {
            if (!visited.has(key)) {
                visited.add(key);
                queue.push(key);
            }
        }
    }
    
    return visited.size === n;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(V + E) - Visit each room and process each key once |
| **Space** | O(V) - Visited set and queue |

---

## Approach 2: DFS (Depth-First Search)

### Why It Works

DFS explores as far as possible along each branch before backtracking. We use recursion (or stack) to visit rooms. Starting from room 0, we visit each room and recursively visit all rooms we can unlock from there.

### Code Implementation

````carousel
```python
from typing import List

class Solution:
    def canVisitAllRooms(self, rooms: List[List[int]]) -> bool:
        """
        Check if all rooms can be visited using DFS.
        """
        visited = set()
        
        def dfs(room: int) -> None:
            if room in visited:
                return
            visited.add(room)
            for key in rooms[room]:
                dfs(key)
        
        dfs(0)
        return len(visited) == len(rooms)
```

<!-- slide -->
```cpp
class Solution {
public:
    bool canVisitAllRooms(vector<vector<int>>& rooms) {
        unordered_set<int> visited;
        
        function<void(int)> dfs = [&](int room) {
            if (visited.count(room)) return;
            visited.insert(room);
            for (int key : rooms[room]) {
                dfs(key);
            }
        };
        
        dfs(0);
        return visited.size() == rooms.size();
    }
};
```

<!-- slide -->
```java
class Solution {
    private Set<Integer> visited;
    private List<List<Integer>> rooms;
    
    public boolean canVisitAllRooms(List<List<Integer>> rooms) {
        this.rooms = rooms;
        this.visited = new HashSet<>();
        dfs(0);
        return visited.size() == rooms.size();
    }
    
    private void dfs(int room) {
        if (visited.contains(room)) return;
        visited.add(room);
        for (int key : rooms.get(room)) {
            dfs(key);
        }
    }
}
```

<!-- slide -->
```javascript
var canVisitAllRooms = function(rooms) {
    const visited = new Set();
    
    function dfs(room) {
        if (visited.has(room)) return;
        visited.add(room);
        for (const key of rooms[room]) {
            dfs(key);
        }
    }
    
    dfs(0);
    return visited.size === rooms.length;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(V + E) |
| **Space** | O(V) - Recursion stack and visited set |

---

## Comparison of Approaches

| Aspect | BFS | DFS |
|--------|-----|-----|
| **Time Complexity** | O(V + E) | O(V + E) |
| **Space Complexity** | O(V) | O(V) |
| **Implementation** | Queue-based | Recursion/Stack |
| **Order** | Level-order | Depth-first |
| **LeetCode Optimal** | ✅ | ✅ |

**Best Approach:** Both are optimal. BFS is often more intuitive for reachability, while DFS can be simpler to implement recursively.

---

## Related Problems

### Related Problems

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Number of Provinces | [Link](https://leetcode.com/problems/number-of-provinces/) | Connected components |
| Clone Graph | [Link](https://leetcode.com/problems/clone-graph/) | Graph traversal |
| Flood Fill | [Link](https://leetcode.com/problems/flood-fill/) | DFS/BFS traversal |
| Pacific Atlantic Water Flow | [Link](https://leetcode.com/problems/pacific-atlantic-water-flow/) | Multi-source BFS |

### Pattern Reference

For more detailed explanations of the Graph Traversal pattern, see:
- **[Graph Traversal Pattern](/patterns/graph-traversal)**

---

## Video Tutorial Links

### Recommended Tutorials

1. **[NeetCode - Keys and Rooms](https://www.youtube.com/watch?v=6aMbtXjUQ1I)** - Clear explanation
2. **[Keys and Rooms - LeetCode 841](https://www.youtube.com/watch?v=8j-NE8XUE5U)** - Detailed walkthrough
3. **[Graph Traversal Explained](https://www.youtube.com/watch?v=6tQcp2m8s80)** - BFS vs DFS

---

## Follow-up Questions

### Q1: What if keys could be reused or duplicated?

**Answer:** The current solution already handles duplicate keys correctly because we use a visited set. Duplicate keys would simply be ignored when we check `if key not in visited`.

---

### Q2: Can you modify the solution to return the order of rooms visited?

**Answer:** Yes! Instead of just tracking visited, maintain a list that records the order in which rooms are visited. This would give you the traversal path.

---

### Q3: How would you handle it if rooms could have cycles?

**Answer:** The current solution handles cycles automatically through the visited set. When we encounter a room we've already visited, we skip it, preventing infinite loops.

---

### Q4: What if you could pick only one key per room?

**Answer:** This would become a completely different problem - essentially finding a path that visits all nodes. You'd need to use backtracking or more complex graph algorithms to determine if such a path exists.

---

## Summary

The **Keys and Rooms** problem demonstrates the **Graph Traversal** pattern using BFS or DFS. The key insight is treating rooms as graph nodes and keys as directed edges.

### Key Takeaways

1. **Graph Model**: Rooms are nodes, keys are directed edges
2. **Traversal**: Use BFS or DFS from room 0
3. **Reachability**: Check if all rooms are visited
4. **Time**: O(V + E) - visit each room and key once
5. **Space**: O(V) - for visited set and queue/stack

### Pattern Summary

This problem exemplifies the **Graph Traversal** pattern, characterized by:
- Building a graph from input data
- Using BFS or DFS to explore
- Tracking visited nodes to avoid cycles
- Checking reachability from a source node

For more details on this pattern, see the **[Graph Traversal Pattern](/patterns/graph-traversal)**.

---

## Common Pitfalls

### 1. Not Adding Initial Room to Visited
**Issue:** Forgetting to add room 0 to visited set initially.

**Solution:** Add room 0 to visited and queue before starting traversal.

### 2. Not Checking All Keys in Current Room
**Issue:** Only checking first key or not processing all keys.

**Solution:** Iterate through all keys in rooms[curr].

### 3. Confusing Directed vs Undirected Graph
**Issue:** Treating edges as bidirectional when they're directional.

**Solution:** Keys only go one way - from current room to key's room.

### 4. Not Handling Duplicate Keys
**Issue:** Adding same key multiple times to queue.

**Solution:** Check `if key not in visited` before adding to queue.
