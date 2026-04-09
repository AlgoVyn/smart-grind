## Graph DFS - Cycle Detection (Directed): Tactics

What are the advanced techniques and variations for cycle detection?

<!-- front -->

---

### Tactic 1: Finding the Actual Cycle Path

Don't just detect—recover the cycle nodes:

```python
def find_cycle_path(graph: List[List[int]]) -> List[int]:
    """Returns the nodes in the cycle, or empty list if no cycle."""
    n = len(graph)
    visit = [0] * n
    parent = [-1] * n  # Track path
    
    def dfs(node: int, par: int) -> List[int]:
        visit[node] = 1
        parent[node] = par
        
        for neighbor in graph[node]:
            if visit[neighbor] == 1:
                # Found cycle - reconstruct path
                cycle = [neighbor]
                cur = node
                while cur != neighbor:
                    cycle.append(cur)
                    cur = parent[cur]
                cycle.append(neighbor)
                return cycle[::-1]  # Reverse to get correct order
            
            if visit[neighbor] == 0:
                result = dfs(neighbor, node)
                if result:
                    return result
        
        visit[node] = 2
        return []
    
    for node in range(n):
        if visit[node] == 0:
            cycle = dfs(node, -1)
            if cycle:
                return cycle
    
    return []

# Example: [0, 1, 2, 3, 1] means 1→2→3→1 forms the cycle
```

---

### Tactic 2: Kahn's Algorithm (BFS Topological Sort)

Alternative when you also need topological order:

```python
from collections import deque

def has_cycle_kahn(n: int, edges: List[List[int]]) -> bool:
    """
    Detect cycle using Kahn's algorithm (BFS).
    If not all nodes processed, a cycle exists.
    Time: O(V + E), Space: O(V)
    """
    # Build graph and indegrees
    graph = [[] for _ in range(n)]
    indegree = [0] * n
    
    for u, v in edges:
        graph[u].append(v)
        indegree[v] += 1
    
    # Start with nodes having no dependencies
    queue = deque([i for i in range(n) if indegree[i] == 0])
    processed = 0
    
    while queue:
        node = queue.popleft()
        processed += 1
        
        for neighbor in graph[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)
    
    # If not all nodes processed, there's a cycle
    return processed != n

# Bonus: Also gives valid topological order if no cycle!
```

---

### Tactic 3: Iterative DFS (No Recursion Limit)

For very large graphs to avoid stack overflow:

```python
def has_cycle_iterative(graph: List[List[int]]) -> bool:
    """
    Iterative DFS using explicit stack.
    Stack stores (node, iterator_state, visited_flag)
    """
    n = len(graph)
    visit = [0] * n
    
    for start in range(n):
        if visit[start] != 0:
            continue
        
        # Stack: (current_node, next_neighbor_index)
        stack = [(start, 0)]
        visit[start] = 1
        path_set = {start}
        
        while stack:
            node, idx = stack[-1]
            neighbors = graph[node]
            
            if idx < len(neighbors):
                # Process next neighbor
                stack[-1] = (node, idx + 1)
                neighbor = neighbors[idx]
                
                if visit[neighbor] == 1:  # In current path
                    return True
                if visit[neighbor] == 0:  # Unvisited
                    visit[neighbor] = 1
                    path_set.add(neighbor)
                    stack.append((neighbor, 0))
            else:
                # Done with all neighbors
                stack.pop()
                visit[node] = 2
                path_set.discard(node)
    
    return False
```

---

### Tactic 4: Union-Find (For Special Cases)

Works well for undirected; limited for directed:

```python
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        self.parent[self.find(x)] = self.find(y)

# Note: Union-Find is PRIMARILY for undirected graphs!
# For directed graphs, use DFS with three states.
def has_cycle_undirected(n: int, edges: List[List[int]]) -> bool:
    """Cycle detection for UNDIRECTED graphs using Union-Find."""
    uf = UnionFind(n)
    
    for u, v in edges:
        if uf.find(u) == uf.find(v):
            return True  # Same set = cycle
        uf.union(u, v)
    
    return False
```

---

### Tactic 5: Detecting All Cycles (Not Just One)

Continue after finding first cycle:

```python
def find_all_cycles(graph: List[List[int]]) -> List[List[int]]:
    """Find all unique cycles in the graph."""
    n = len(graph)
    visit = [0] * n
    cycles = []
    
    def dfs(node: int, path: List[int], path_set: set) -> None:
        visit[node] = 1
        path.append(node)
        path_set.add(node)
        
        for neighbor in graph[node]:
            if neighbor in path_set:
                # Found cycle - extract it
                cycle_start = path.index(neighbor)
                cycle = path[cycle_start:] + [neighbor]
                cycles.append(cycle)
            elif visit[neighbor] == 0:
                dfs(neighbor, path, path_set)
        
        path.pop()
        path_set.remove(node)
        visit[node] = 2
    
    for node in range(n):
        if visit[node] == 0:
            dfs(node, [], set())
    
    return cycles
```

---

### Tactic 6: Course Schedule Pattern (LeetCode Classic)

Detect if courses can be completed (no circular dependencies):

```python
def can_finish(num_courses: int, prerequisites: List[List[int]]) -> bool:
    """
    LeetCode 207: Course Schedule
    prerequisites[i] = [course, prerequisite]
    Returns True if all courses can be completed.
    """
    # Build graph (prereq -> course)
    graph = [[] for _ in range(num_courses)]
    for course, prereq in prerequisites:
        graph[prereq].append(course)
    
    # Three-state DFS
    visit = [0] * num_courses  # 0=unvisited, 1=visiting, 2=visited
    
    def dfs(course: int) -> bool:
        if visit[course] == 1:  # Currently taking - cycle!
            return False
        if visit[course] == 2:  # Already completed
            return True
        
        visit[course] = 1  # Taking course
        for next_course in graph[course]:
            if not dfs(next_course):
                return False
        visit[course] = 2  # Completed course
        return True
    
    for course in range(num_courses):
        if visit[course] == 0:
            if not dfs(course):
                return False
    
    return True
```

---

### Tactic 7: Common Pitfalls & Fixes

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Two states only** | False positives on cross edges | Use THREE states (0, 1, 2) |
| **Missing disconnected** | Some components unchecked | Iterate ALL nodes (0 to n-1) |
| **Stack overflow** | Deep recursion on large graphs | Use iterative DFS or BFS |
| **Self-loop ignored** | Node→itself not detected | Algorithm naturally handles: visit[node]=1, then check neighbor=node |
| **Not marking VISITED** | Repeated work, TLE | Mark as 2 after processing all neighbors |
| **Wrong edge direction** | Building graph backwards | Read problem: [a,b] usually means a→b OR b is prereq for a |

---

### Tactic 8: Multi-Language Quick Reference

**Python:**
```python
visit = [0] * n  # List for O(1) state access
if visit[node] == 1: return True
```

**C++:**
```cpp
vector<int> visit(n, 0);
if (visit[node] == 1) return true;
// Use function<bool(int)> for recursive lambda
```

**Java:**
```java
int[] visit = new int[n];
if (visit[node] == 1) return true;
// Helper method needed (no nested functions)
```

**JavaScript:**
```javascript
const visit = new Array(n).fill(0);
if (visit[node] === 1) return true;
// Use function declaration or arrow in closure
```

<!-- back -->
