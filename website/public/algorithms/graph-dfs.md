# Graph DFS (Depth-First Search)

## Category
Graphs

## Description

Depth-First Search (DFS) is a fundamental graph traversal algorithm that explores as far as possible along each branch before backtracking. It goes deep into the graph before exploring siblings, making it ideal for problems involving path finding, cycle detection, topological sorting, and connected components.

DFS uses a **stack** (either the call stack via recursion or an explicit stack) to keep track of the traversal path. This depth-first nature makes it particularly effective for problems requiring exhaustive search or exploration of all possible paths.

---

## Concepts

The DFS algorithm is built on several fundamental concepts that make it powerful for graph traversal and analysis.

### 1. Stack-Based Exploration

DFS uses a **Last-In-First-Out (LIFO)** approach for exploration:

| Concept | Description |
|---------|-------------|
| **Push** | Add unvisited neighbors to stack |
| **Pop** | Remove and process vertex from top |
| **LIFO Order** | Ensures depth-first exploration |

### 2. Visited Tracking

Preventing revisits is essential to avoid infinite loops:

| Approach | Description | Best For |
|----------|-------------|----------|
| **Two-State** | Unvisited / Visited | Simple traversal, undirected graphs |
| **Three-State** | Unvisited / In-Progress / Done | Cycle detection in directed graphs |
| **Timestamp** | Entry/Exit times | Edge classification, topological sort |

### 3. Recursion vs Iteration

Two ways to implement DFS:

| Implementation | Space | Pros | Cons |
|----------------|-------|------|------|
| **Recursive** | O(depth) | Clean, intuitive | Stack overflow risk |
| **Iterative** | O(depth) | No overflow, explicit control | More verbose |

### 4. Edge Classification

In DFS, edges can be classified into types:

| Edge Type | Description | Identified By |
|-----------|-------------|---------------|
| **Tree Edge** | Part of DFS forest | To unvisited vertex |
| **Back Edge** | To ancestor in DFS tree | To vertex in progress (gray) |
| **Forward Edge** | To descendant (non-tree) | To done vertex (black) that is descendant |
| **Cross Edge** | Between non-ancestor subtrees | To done vertex (black) in different subtree |

---

## Frameworks

Structured approaches for solving DFS problems.

### Framework 1: Recursive DFS Template

```
┌─────────────────────────────────────────────────────┐
│  RECURSIVE DFS FRAMEWORK                            │
├─────────────────────────────────────────────────────┤
│  1. Define recursive function with vertex parameter │
│  2. Mark current vertex as visited                  │
│  3. Process current vertex (add to result, etc.)  │
│  4. For each unvisited neighbor:                    │
│     - Recursively call DFS on neighbor              │
│  5. Post-processing (if needed)                    │
│  6. Return                                          │
└─────────────────────────────────────────────────────┘
```

**When to use**: Clean, readable code; tree-like graphs; backtracking problems.

### Framework 2: Iterative DFS Template

```
┌─────────────────────────────────────────────────────┐
│  ITERATIVE DFS FRAMEWORK                            │
├─────────────────────────────────────────────────────┤
│  1. Initialize stack with starting vertex          │
│  2. While stack not empty:                          │
│     a. Pop vertex from stack                        │
│     b. If not visited:                              │
│        - Mark as visited                            │
│        - Process vertex                             │
│        - Push all neighbors (in reverse order)      │
│  3. Return result                                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: Avoiding recursion limit, explicit stack control needed.

### Framework 3: DFS with Cycle Detection Template

```
┌─────────────────────────────────────────────────────┐
│  DFS WITH CYCLE DETECTION FRAMEWORK                 │
├─────────────────────────────────────────────────────┤
│  1. Initialize state array (0=unvisited, 1=visiting,│
│     2=done)                                        │
│  2. For each unvisited vertex:                      │
│     a. Mark as visiting (state = 1)                 │
│     b. For each neighbor:                           │
│        - If state = 1: CYCLE DETECTED!              │
│        - If unvisited: recurse                        │
│     c. Mark as done (state = 2)                     │
│  3. Return cycle status                             │
└─────────────────────────────────────────────────────┘
```

**When to use**: Directed/undirected cycle detection, topological sort validation.

---

## Forms

Different manifestations of the DFS pattern.

### Form 1: Standard DFS Traversal

Basic DFS returning vertices in traversal order.

| Aspect | Description |
|--------|-------------|
| **Input** | Graph, starting vertex |
| **Output** | List of vertices in DFS order |
| **Use Case** | General traversal, reachable vertices |

### Form 2: Path Finding

DFS for finding any path between two vertices.

| Aspect | Description |
|--------|-------------|
| **Key Insight** | DFS explores one path completely before trying others |
| **Optimization** | Stop when target found |
| **Use Case** | Maze solving, any path existence |

### Form 3: Connected Components

DFS for finding all connected components.

| Aspect | Description |
|--------|-------------|
| **Approach** | Run DFS from each unvisited vertex |
| **Result** | Groups of vertices (components) |
| **Use Case** | Network analysis, clustering |

### Form 4: Topological Sort (DFS-based)

Ordering vertices in a Directed Acyclic Graph (DAG).

| Aspect | Description |
|--------|-------------|
| **Key Insight** | Add vertex to result after exploring all neighbors |
| **Output** | Reverse of completion order |
| **Use Case** | Task scheduling, dependency resolution |

### Form 5: Grid DFS

DFS adapted for 2D grids.

| Aspect | Description |
|--------|-------------|
| **Movement** | 4 or 8 directional |
| **Visited** | Mark cells as visited |
| **Use Case** | Island counting, flood fill |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Path Recording with Backtracking

Track and record paths during DFS:

```python
def dfs_find_path(graph, start, target):
    """Find any path from start to target."""
    visited = set()
    path = []
    
    def dfs(vertex):
        if vertex == target:
            path.append(vertex)
            return True
        
        visited.add(vertex)
        path.append(vertex)
        
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                if dfs(neighbor):
                    return True
        
        path.pop()  # Backtrack
        return False
    
    if dfs(start):
        return path
    return None
```

### Tactic 2: All Paths Finding

Find all paths between two vertices:

```python
def dfs_all_paths(graph, start, target):
    """Find all paths from start to target."""
    all_paths = []
    path = []
    
    def dfs(vertex):
        path.append(vertex)
        
        if vertex == target:
            all_paths.append(path.copy())
        else:
            for neighbor in graph[vertex]:
                if neighbor not in path:  # Avoid revisiting in current path
                    dfs(neighbor)
        
        path.pop()
    
    dfs(start)
    return all_paths
```

### Tactic 3: Three-State Cycle Detection

Detect cycles in directed graphs:

```python
def has_cycle_dfs(graph):
    """
    Detect cycle in directed graph.
    States: 0 = unvisited, 1 = visiting, 2 = done
    """
    state = {}
    
    def dfs(vertex):
        state[vertex] = 1  # Mark as visiting
        
        for neighbor in graph.get(vertex, []):
            if neighbor in state:
                if state[neighbor] == 1:  # Back edge found
                    return True
            else:
                if dfs(neighbor):
                    return True
        
        state[vertex] = 2  # Mark as done
        return False
    
    # Check all vertices (handles disconnected)
    all_vertices = set(graph.keys())
    for neighbors in graph.values():
        all_vertices.update(neighbors)
    
    for vertex in all_vertices:
        if vertex not in state:
            if dfs(vertex):
                return True
    
    return False
```

### Tactic 4: DFS with Entry/Exit Times

Track discovery and finish times:

```python
def dfs_with_times(graph, start):
    """
    DFS tracking entry and exit times.
    Useful for edge classification.
    """
    visited = set()
    entry = {}
    exit = {}
    time = [0]
    
    def dfs(vertex):
        entry[vertex] = time[0]
        time[0] += 1
        visited.add(vertex)
        
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                dfs(neighbor)
        
        exit[vertex] = time[0]
        time[0] += 1
    
    dfs(start)
    return entry, exit
```

### Tactic 5: Grid DFS with Island Counting

Count connected components in 2D grid:

```python
def num_islands_dfs(grid):
    """Count number of islands using DFS."""
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    visited = set()
    
    def dfs(r, c):
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            grid[r][c] == '0' or (r, c) in visited):
            return
        
        visited.add((r, c))
        
        # Explore 4 directions
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            dfs(r + dr, c + dc)
    
    count = 0
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1' and (r, c) not in visited:
                dfs(r, c)
                count += 1
    
    return count
```

---

## Python Templates

### Template 1: Recursive DFS Traversal

```python
from typing import List, Dict, Set, Optional

def dfs_recursive(graph: Dict[str, List[str]], start: str, 
                  visited: Optional[Set[str]] = None) -> List[str]:
    """
    Depth-First Search using recursion.
    
    Time Complexity: O(V + E)
    Space Complexity: O(V) for visited + O(depth) for recursion stack
    
    Args:
        graph: Adjacency list representation
        start: Starting vertex
        visited: Set of visited vertices (for tracking)
    
    Returns:
        List of vertices in DFS order
    """
    if visited is None:
        visited = set()
    
    result = []
    
    def _dfs(vertex: str):
        if vertex in visited:
            return
        
        visited.add(vertex)
        result.append(vertex)
        
        # Visit all unvisited neighbors
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                _dfs(neighbor)
    
    _dfs(start)
    return result
```

### Template 2: Iterative DFS Traversal

```python
def dfs_iterative(graph: Dict[str, List[str]], start: str) -> List[str]:
    """
    Depth-First Search using explicit stack (iterative).
    
    Time: O(V + E)
    Space: O(V)
    
    Args:
        graph: Adjacency list representation
        start: Starting vertex
    
    Returns:
        List of vertices in DFS order
    """
    visited = set()
    stack = [start]
    result = []
    
    while stack:
        vertex = stack.pop()
        
        if vertex in visited:
            continue
        
        visited.add(vertex)
        result.append(vertex)
        
        # Add neighbors in reverse order to maintain left-to-right
        for neighbor in reversed(graph.get(vertex, [])):
            if neighbor not in visited:
                stack.append(neighbor)
    
    return result
```

### Template 3: DFS with Path Finding

```python
from typing import Optional

def dfs_find_path(graph: Dict[str, List[str]], start: str, 
                  target: str) -> Optional[List[str]]:
    """
    Find any path from start to target using DFS.
    
    Time: O(V + E)
    Space: O(V)
    
    Args:
        graph: Adjacency list representation
        start: Starting vertex
        target: Target vertex
    
    Returns:
        Path as list of vertices, or None if no path exists
    """
    visited = set()
    path = []
    
    def dfs(vertex: str) -> bool:
        if vertex == target:
            path.append(vertex)
            return True
        
        visited.add(vertex)
        path.append(vertex)
        
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                if dfs(neighbor):
                    return True
        
        path.pop()  # Backtrack
        return False
    
    if dfs(start):
        return path
    return None
```

### Template 4: DFS Cycle Detection (Directed)

```python
def has_cycle_directed(graph: Dict[str, List[str]]) -> bool:
    """
    Detect if directed graph has a cycle using DFS.
    
    Uses three states:
    0 = unvisited (white)
    1 = visiting (gray) - in current recursion stack
    2 = done (black) - fully processed
    
    Time: O(V + E)
    Space: O(V)
    """
    state = {}  # vertex -> state
    
    def dfs(vertex: str) -> bool:
        state[vertex] = 1  # Mark as visiting
        
        for neighbor in graph.get(vertex, []):
            if neighbor in state:
                if state[neighbor] == 1:  # Back edge - cycle!
                    return True
            else:
                if dfs(neighbor):
                    return True
        
        state[vertex] = 2  # Mark as done
        return False
    
    # Check all vertices (handles disconnected graphs)
    all_vertices = set(graph.keys())
    for neighbors in graph.values():
        all_vertices.update(neighbors)
    
    for vertex in all_vertices:
        if vertex not in state:
            if dfs(vertex):
                return True
    
    return False
```

### Template 5: DFS Cycle Detection (Undirected)

```python
def has_cycle_undirected(graph: Dict[str, List[str]]) -> bool:
    """
    Detect if undirected graph has a cycle using DFS.
    
    Time: O(V + E)
    Space: O(V)
    """
    visited = set()
    
    def dfs(vertex: str, parent: str) -> bool:
        visited.add(vertex)
        
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                if dfs(neighbor, vertex):
                    return True
            elif neighbor != parent:  # Found a back edge
                return True
        
        return False
    
    # Check all vertices (handles disconnected graphs)
    all_vertices = set(graph.keys())
    for neighbors in graph.values():
        all_vertices.update(neighbors)
    
    for vertex in all_vertices:
        if vertex not in visited:
            if dfs(vertex, None):
                return True
    
    return False
```

### Template 6: Connected Components DFS

```python
def find_connected_components(graph: Dict[str, List[str]]) -> List[List[str]]:
    """
    Find all connected components using DFS.
    
    Time: O(V + E)
    Space: O(V)
    
    Returns:
        List of connected components (each is a list of vertices)
    """
    visited = set()
    components = []
    
    # Get all vertices
    all_vertices = set(graph.keys())
    for neighbors in graph.values():
        all_vertices.update(neighbors)
    
    def dfs(vertex: str, component: List[str]):
        visited.add(vertex)
        component.append(vertex)
        
        for neighbor in graph.get(vertex, []):
            if neighbor not in visited:
                dfs(neighbor, component)
    
    for vertex in all_vertices:
        if vertex not in visited:
            component = []
            dfs(vertex, component)
            components.append(component)
    
    return components
```

### Template 7: Topological Sort (DFS-based)

```python
def topological_sort_dfs(n: int, edges: List[List[int]]) -> List[int]:
    """
    Topological sort using DFS.
    
    Time: O(V + E)
    Space: O(V)
    
    Args:
        n: Number of vertices (0 to n-1)
        edges: List of [from, to] edges
    
    Returns:
        Topological ordering, or empty list if cycle exists
    """
    # Build graph
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
    
    # 0 = unvisited, 1 = visiting, 2 = done
    visited = [0] * n
    result = []
    
    def dfs(vertex: int) -> bool:
        visited[vertex] = 1
        
        for neighbor in graph[vertex]:
            if visited[neighbor] == 1:  # Back edge - cycle!
                return False
            if visited[neighbor] == 0:
                if not dfs(neighbor):
                    return False
        
        visited[vertex] = 2
        result.append(vertex)
        return True
    
    # Process all vertices
    for v in range(n):
        if visited[v] == 0:
            if not dfs(v):
                return []  # Cycle detected
    
    return result[::-1]  # Reverse for correct order
```

---

## When to Use

Use DFS when you need to solve problems involving:

- **Graph Traversal**: Visiting all nodes in a graph
- **Path Finding**: Finding any path between two nodes (not necessarily shortest)
- **Cycle Detection**: Detecting cycles in directed or undirected graphs
- **Topological Sorting**: Ordering vertices in a DAG
- **Connected Components**: Finding all connected components in a graph
- **Backtracking Problems**: Exploring all possible solutions

### Comparison with Alternatives

| Algorithm | Time Complexity | Space Complexity | Use Case |
|-----------|----------------|------------------|----------|
| **DFS** | O(V + E) | O(V) | Deep traversal, path finding, cycle detection |
| **BFS** | O(V + E) | O(V) | Shortest path in unweighted graphs, level-order |
| **Dijkstra** | O((V + E) log V) | O(V) | Shortest path with weighted edges |
| **Union-Find** | O(α(V)) amortized | O(V) | Dynamic connectivity, quick cycle check |

### When to Choose DFS vs BFS

- **Choose DFS** when:
  - You need to explore deep before wide
  - Path existence is sufficient (not necessarily shortest)
  - Memory is limited (can use iterative with explicit stack)
  - Solving problems like: maze solving, topological sort, finding connected components

- **Choose BFS** when:
  - Shortest path in unweighted graph is required
  - Level-by-level exploration is needed
  - Finding minimum number of steps/moves
  - Graph is very wide but shallow

---

## Algorithm Explanation

### Core Concept

Depth-First Search explores a graph by going as far as possible along each branch before backtracking. It uses a **stack** (either call stack via recursion or explicit stack) to keep track of nodes to visit. The key idea is to "go deep" rather than "go wide" - we explore one path completely before trying other paths.

### How It Works

#### Basic Algorithm:
1. Start at the root (or any arbitrary node)
2. Mark current node as visited
3. Recursively visit all unvisited neighbors (or push to stack for iterative)
4. Backtrack when no unvisited neighbors remain

#### Visual Representation

For a graph:
```
    0 --- 1 --- 2
    |     |
    3 --- 4
    |
    5
```

DFS traversal from node 0:
```
Step 1: Visit 0 → mark as visited
Step 2: Visit 1 (neighbor of 0) → mark as visited  
Step 3: Visit 2 (neighbor of 1) → mark as visited
Step 4: Backtrack from 2 (no unvisited neighbors)
Step 5: Visit 4 (neighbor of 1) → mark as visited
Step 6: Backtrack from 4
Step 7: Visit 3 (neighbor of 0) → mark as visited
Step 8: Visit 5 (neighbor of 3) → mark as visited
Step 9: Backtrack from 5 → Done!

Order: [0, 1, 2, 4, 3, 5]
```

### Key Concepts

- **Visited Set**: Prevents revisiting nodes (avoids infinite loops in cyclic graphs)
- **Stack**: Used to track nodes to visit (explicit or implicit via recursion call stack)
- **Preorder/Postorder**: Order of visiting nodes matters for certain problems
- **Entry/Exit Times**: Timestamps useful for tree edge classification and topological sort

### Why It Works

DFS guarantees complete exploration because:
1. Every vertex is marked visited when first encountered
2. All neighbors are explored from each vertex
3. The algorithm continues until no unvisited vertices remain
4. For disconnected graphs, we restart DFS from each unvisited component

### Limitations

| Limitation | Description | Mitigation |
|------------|-------------|------------|
| **No Shortest Path** | DFS does not find shortest path in unweighted graphs | Use BFS for shortest path |
| **Stack Overflow** | Recursive DFS can overflow on deep graphs | Use iterative DFS |
| **Infinite Paths** | Can get stuck exploring infinite paths | Use visited set |

---

## Practice Problems

### Problem 1: Number of Islands

**Problem:** [LeetCode 200 - Number of Islands](https://leetcode.com/problems/number-of-islands/)

**Description:** Given a 2D grid of '1's (land) and '0's (water), count the number of islands.

**How to Apply:**
- Use DFS to explore each island (connected component of '1's)
- Mark visited cells to avoid counting them again
- Increment count when a new unvisited island is found
- Explore all 4 adjacent directions

**Key Insight:** Each DFS call from an unvisited land cell discovers one complete island.

---

### Problem 2: Course Schedule

**Problem:** [LeetCode 207 - Course Schedule](https://leetcode.com/problems/course-schedule/)

**Description:** Determine if you can finish all courses given prerequisites (directed cycle detection).

**How to Apply:**
- Build directed graph from prerequisites
- Use three-state DFS to detect cycles
- If cycle exists, impossible to complete all courses
- Otherwise, all courses can be finished

**Key Insight:** Cycle in prerequisite graph means circular dependencies - impossible to satisfy.

---

### Problem 3: Pacific Atlantic Water Flow

**Problem:** [LeetCode 417 - Pacific Atlantic Water Flow](https://leetcode.com/problems/pacific-atlantic-water-flow/)

**Description:** Find cells that can reach both Pacific and Atlantic oceans.

**How to Apply:**
- Run DFS from Pacific border cells (can flow to Pacific)
- Run DFS from Atlantic border cells (can flow to Atlantic)
- Cells visited in both DFS are the answer
- Water flows from higher/equal to lower/equal elevation

**Key Insight:** Reverse the flow - start from oceans and work backwards to find reachable cells.

---

### Problem 4: Clone Graph

**Problem:** [LeetCode 133 - Clone Graph](https://leetcode.com/problems/clone-graph/)

**Description:** Deep copy a connected undirected graph.

**How to Apply:**
- Use DFS to traverse original graph
- Maintain a hashmap of cloned nodes (original -> clone)
- Recursively clone neighbors while traversing
- Handle cycles by checking if node already cloned

**Key Insight:** DFS naturally handles the recursive structure of cloning interconnected nodes.

---

### Problem 5: Graph Valid Tree

**Problem:** [LeetCode 261 - Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree/)

**Description:** Given n nodes and edges, determine if they make a valid tree.

**How to Apply:**
- Check two conditions for a valid tree:
  1. No cycles (use DFS cycle detection)
  2. All nodes are connected (single component)
- Tree with n nodes must have exactly n-1 edges
- Run DFS to check both conditions

**Key Insight:** A valid tree is a connected acyclic graph. DFS can verify both properties.

---

## Video Tutorial Links

### Fundamentals

- [DFS Graph Traversal (Take U Forward)](https://www.youtube.com/watch?v=pcKY4hjDrxk) - Comprehensive introduction to DFS
- [Graph DFS Implementation (WilliamFiset)](https://www.youtube.com/watch?v=4bL1J30J5D4) - Detailed implementation guide
- [DFS vs BFS (NeetCode)](https://www.youtube.com/watch?v=oL6SSUkFFJo) - When to use which algorithm

### Advanced Topics

- [Cycle Detection using DFS](https://www.youtube.com/watch?v=6GQ1623q3C0) - Detecting cycles in directed/undirected graphs
- [Topological Sort using DFS](https://www.youtube.com/watch?v=dis_c84ejhQ) - DFS-based topological ordering
- [Number of Islands - DFS Solution](https://www.youtube.com/watch?v=oKpK0dX0aBw) - Grid DFS patterns
- [Strongly Connected Components](https://www.youtube.com/watch?v=9Wbej4A6K4w) - Kosaraju's algorithm

---

## Follow-up Questions

### Q1: When should you use iterative DFS over recursive DFS?

**Answer:** Use iterative DFS when:
- Graph may be very deep (risk of stack overflow with recursion)
- Memory is constrained
- You're implementing in a language with limited recursion depth
- Working with very large graphs

The iterative version uses an explicit stack and has the same time complexity but better memory control.

### Q2: How do you detect cycles in an undirected graph vs directed graph?

**Answer:**
- **Undirected**: Track parent node. If you encounter a visited node that is NOT the parent, there's a cycle.
- **Directed**: Use three-state approach (0=unvisited, 1=in progress, 2=done). If you encounter a node in state 1 (in progress), there's a cycle.

### Q3: Can DFS find the shortest path?

**Answer:** DFS does NOT guarantee the shortest path in unweighted graphs. It finds SOME path, but not necessarily the shortest. Use BFS for shortest path in unweighted graphs. However, DFS can be modified to find shortest path in weighted graphs using Dijkstra's algorithm approach.

### Q4: What is the difference between pre-order and post-order DFS?

**Answer:**
- **Pre-order**: Process node BEFORE exploring children (visit → recurse)
- **Post-order**: Process node AFTER exploring children (recurse → visit)

Post-order is useful for:
- Topological sorting
- Deleting nodes in trees
- Computing subtree sizes

### Q5: How does memoization work with DFS?

**Answer:** Memoization (DFS + DP) stores results of subproblems to avoid recomputation:
1. Before computing, check if result is already memoized
2. Compute and store result
3. Return memoized result when needed

This transforms exponential DFS into polynomial time for problems with optimal substructure.

---

## Summary

Depth-First Search (DFS) is a versatile graph traversal algorithm essential for solving many graph and tree problems. Key takeaways:

### Core Concepts
- **Go Deep First**: Explore one branch completely before backtracking
- **Time Complexity**: O(V + E) - visits each vertex and edge once
- **Space Complexity**: O(V) - for visited set and stack
- **Two Implementations**: Recursive (elegant) vs Iterative (memory-safe)

### When to Use
- ✅ Cycle detection in graphs
- ✅ Topological sorting
- ✅ Finding connected components
- ✅ Path finding (not necessarily shortest)
- ✅ Tree/graph traversal problems
- ✅ Backtracking and exhaustive search

### When NOT to Use
- ❌ Shortest path in unweighted graphs (use BFS instead)
- ❌ Very deep graphs without iterative optimization
- ❌ When path order matters (BFS provides level-order)

### Implementation Tips
1. Always use visited set to prevent infinite loops
2. For directed cycle detection, use three-state approach
3. Consider iterative implementation for deep graphs
4. Use timestamps for edge classification problems

DFS is the foundation for many advanced algorithms including topological sort, strongly connected components, and is frequently combined with memoization for dynamic programming solutions.
