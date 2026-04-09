## Graph DFS - Cycle Detection (Directed): Framework

What is the complete code template for detecting cycles in a directed graph?

<!-- front -->

---

### Framework Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│  DFS CYCLE DETECTION IN DIRECTED GRAPH - TEMPLATE                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. INITIALIZE                                                        │
│     - Build adjacency list from edges                                 │
│     - visit[] array with 3 states: 0=UNVISITED, 1=VISITING, 2=VISITED │
│     - onStack[] array (optional, for explicit recursion tracking)     │
│                                                                     │
│  2. ITERATE through all nodes:                                        │
│     For each node:                                                    │
│        If visit[node] == 0 (UNVISITED):                              │
│           If DFS(node) returns True → Cycle detected!                 │
│                                                                     │
│  3. DFS(node):                                                        │
│     If visit[node] == 1 → Return True (back edge found!)            │
│     If visit[node] == 2 → Return False (already processed)           │
│                                                                     │
│     Mark visit[node] = 1 (VISITING - in recursion stack)              │
│                                                                     │
│     For each neighbor:                                                │
│        If DFS(neighbor) returns True → Return True                    │
│                                                                     │
│     Mark visit[node] = 2 (VISITED - fully processed)                  │
│     Return False                                                      │
│                                                                     │
│  4. RETURN False (no cycle found)                                    │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Core Implementation (Three States)

```python
from typing import List

def has_cycle(graph: List[List[int]]) -> bool:
    """
    Detect cycle in directed graph using DFS with three states.
    Time: O(V + E), Space: O(V)
    """
    n = len(graph)
    visit = [0] * n  # 0: unvisited, 1: visiting, 2: visited
    
    def dfs(node: int) -> bool:
        if visit[node] == 1:   # Back edge to node in recursion stack
            return True
        if visit[node] == 2:   # Already fully processed
            return False
        
        visit[node] = 1        # Mark as visiting (in recursion stack)
        
        for neighbor in graph[node]:
            if dfs(neighbor):
                return True
        
        visit[node] = 2        # Mark as visited (removed from stack)
        return False
    
    # Check all nodes (handles disconnected graphs)
    for node in range(n):
        if visit[node] == 0:
            if dfs(node):
                return True
    
    return False
```

---

### Alternative: Explicit Recursion Stack

```python
def has_cycle_explicit_stack(n: int, edges: List[List[int]]) -> bool:
    """
    Alternative using explicit on_stack array for clarity.
    """
    # Build adjacency list
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
    
    visit = [0] * n
    on_stack = [False] * n
    
    def dfs(node: int) -> bool:
        if on_stack[node]:      # Found back edge
            return True
        if visit[node] == 2:    # Already processed
            return False
        
        visit[node] = 1
        on_stack[node] = True   # Add to recursion stack
        
        for neighbor in graph[node]:
            if dfs(neighbor):
                return True
        
        on_stack[node] = False  # Remove from recursion stack
        visit[node] = 2
        return False
    
    for node in range(n):
        if visit[node] == 0:
            if dfs(node):
                return True
    
    return False
```

---

### Key Framework Elements

| Component | Purpose | Critical For |
|-----------|---------|--------------|
| **State 0 (UNVISITED)** | Node not yet explored | Starting condition |
| **State 1 (VISITING)** | Node in current DFS path | Cycle detection! |
| **State 2 (VISITED)** | Node fully processed | Avoid reprocessing |
| **Iterate all nodes** | Handle disconnected graphs | Completeness |
| **Back edge check** | `visit[node] == 1` triggers cycle | Core detection logic |

---

### State Transitions

```
UNVISITED (0) ──DFS starts──> VISITING (1)
                                    │
                                    │ All neighbors processed
                                    ▼
                            VISITED (2)
                                    ▲
                                    │
    Cycle detected! <─── visit[neighbor] == 1 ────┘
```

<!-- back -->
