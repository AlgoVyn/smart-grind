# Graph BFS (Breadth-First Search)

## Category
Graphs

## Description

Breadth-First Search (BFS) is a fundamental graph traversal algorithm that explores all vertices at the present depth level before moving on to vertices at the next depth level. It uses a **queue data structure** to keep track of vertices to visit, ensuring level-by-level exploration of the graph.

BFS is particularly useful for finding the **shortest path** in unweighted graphs, performing **level-order traversal** of trees and graphs, finding **connected components**, and solving problems involving **minimum distance** or **minimum steps**. The algorithm guarantees that the first time a node is visited is via the shortest path from the source.

---

## Concepts

The BFS algorithm is built on several fundamental concepts that make it powerful for graph traversal problems.

### 1. Queue-Based Exploration

BFS uses a **First-In-First-Out (FIFO)** queue to manage the exploration order:

| Concept | Description |
|---------|-------------|
| **Enqueue** | Add unvisited neighbors to the back of the queue |
| **Dequeue** | Remove and process vertex from the front |
| **FIFO Order** | Ensures level-by-level exploration |

### 2. Level-Order Processing

BFS naturally processes vertices in increasing distance from the source:

```
Level 0: Source vertex (distance 0)
Level 1: All vertices at distance 1
Level 2: All vertices at distance 2
...
Level k: All vertices at distance k
```

This property is crucial for shortest path discovery in unweighted graphs.

### 3. Visited Tracking

Preventing revisits is essential to avoid infinite loops:

| Structure | Purpose | Space |
|-----------|---------|-------|
| **Visited Set** | Track processed vertices | O(V) |
| **Distance Map** | Store shortest distances | O(V) |
| **Parent Map** | Enable path reconstruction | O(V) |

### 4. Graph Representation

BFS works with different graph representations:

| Representation | Space | Neighbor Access | Best For |
|----------------|-------|-----------------|----------|
| **Adjacency List** | O(V + E) | O(degree) | Sparse graphs |
| **Adjacency Matrix** | O(V²) | O(1) | Dense graphs |
| **Edge List** | O(E) | O(E) | Simple edge storage |

---

## Frameworks

Structured approaches for solving BFS problems.

### Framework 1: Basic BFS Traversal Template

```
┌─────────────────────────────────────────────────────┐
│  BASIC BFS TRAVERSAL FRAMEWORK                      │
├─────────────────────────────────────────────────────┤
│  1. Initialize queue with starting vertex          │
│  2. Mark start as visited                           │
│  3. While queue not empty:                          │
│     a. Dequeue vertex from front                    │
│     b. Process vertex (add to result, etc.)         │
│     c. For each unvisited neighbor:               │
│        - Mark as visited                            │
│        - Enqueue neighbor                           │
│  4. Return traversal result                         │
└─────────────────────────────────────────────────────┘
```

**When to use**: General graph traversal, connected components, simple reachability.

### Framework 2: Shortest Path BFS Template

```
┌─────────────────────────────────────────────────────┐
│  SHORTEST PATH BFS FRAMEWORK                          │
├─────────────────────────────────────────────────────┤
│  1. Initialize queue with (start, distance=0)      │
│  2. Mark start as visited, set distance[start] = 0  │
│  3. While queue not empty:                          │
│     a. Dequeue (vertex, dist)                       │
│     b. If vertex is target: return dist           │
│     c. For each unvisited neighbor:                 │
│        - Mark as visited                            │
│        - Set distance[neighbor] = dist + 1          │
│        - Enqueue (neighbor, dist + 1)               │
│  4. Return -1 (target not reachable)                │
└─────────────────────────────────────────────────────┘
```

**When to use**: Finding shortest path in unweighted graphs, minimum steps problems.

### Framework 3: Multi-Source BFS Template

```
┌─────────────────────────────────────────────────────┐
│  MULTI-SOURCE BFS FRAMEWORK                          │
├─────────────────────────────────────────────────────┤
│  1. Initialize queue with ALL source vertices       │
│  2. Mark all sources as visited with distance 0     │
│  3. While queue not empty:                          │
│     a. Dequeue vertex                               │
│     b. Process vertex                               │
│     c. For each unvisited neighbor:                 │
│        - Mark as visited                            │
│        - Set distance = current_distance + 1        │
│        - Enqueue neighbor                             │
│  4. Return distances to all reachable vertices      │
└─────────────────────────────────────────────────────┘
```

**When to use**: Problems with multiple starting points, flooding/spreading problems.

---

## Forms

Different manifestations of the BFS pattern.

### Form 1: Standard BFS Traversal

Basic BFS returning vertices in traversal order.

| Aspect | Description |
|--------|-------------|
| **Input** | Graph, starting vertex |
| **Output** | List of vertices in BFS order |
| **Use Case** | General traversal, connected components |

### Form 2: Shortest Path Distance

BFS for finding minimum distances from source.

| Aspect | Description |
|--------|-------------|
| **Key Insight** | First visit to a node is via shortest path |
| **Output** | Distance map from source to all reachable vertices |
| **Use Case** | Unweighted shortest path, minimum hops |

### Form 3: Path Reconstruction

BFS with parent tracking to reconstruct actual paths.

| Aspect | Description |
|--------|-------------|
| **Additional State** | Track parent of each vertex |
| **Path Recovery** | Backtrack from target to source using parents |
| **Use Case** | Navigation, route planning, actual path needed |

### Form 4: Grid/Matrix BFS

BFS adapted for 2D grids with directional movement.

| Aspect | Description |
|--------|-------------|
| **Neighbors** | 4-directional or 8-directional adjacent cells |
| **Constraints** | Boundary checking, obstacle handling |
| **Use Case** | Mazes, maps, island problems |

### Form 5: Bidirectional BFS

BFS from both start and target simultaneously.

| Aspect | Description |
|--------|-------------|
| **Optimization** | Reduces search space from O(b^d) to O(b^(d/2)) |
| **Termination** | When searches meet in the middle |
| **Use Case** | Large graphs where start and target are known |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Early Termination

Stop BFS immediately when target is found:

```python
from collections import deque

def bfs_shortest_path(graph, start, target):
    """BFS with early termination when target found."""
    if start == target:
        return 0
    
    visited = {start}
    queue = deque([(start, 0)])
    
    while queue:
        vertex, dist = queue.popleft()
        
        for neighbor in graph[vertex]:
            if neighbor == target:
                return dist + 1
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))
    
    return -1  # Not reachable
```

### Tactic 2: Parent Tracking for Path

Reconstruct the actual path, not just distance:

```python
def bfs_with_path(graph, start, target):
    """BFS returning both distance and actual path."""
    visited = {start}
    parent = {start: None}
    queue = deque([start])
    
    while queue:
        vertex = queue.popleft()
        
        if vertex == target:
            # Reconstruct path
            path = []
            current = target
            while current is not None:
                path.append(current)
                current = parent[current]
            return path[::-1]  # Reverse to get start -> target
        
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                parent[neighbor] = vertex
                queue.append(neighbor)
    
    return None  # Not reachable
```

### Tactic 3: Multi-Source BFS Initialization

Start BFS from multiple sources simultaneously:

```python
def multi_source_bfs(grid, sources):
    """
    BFS from multiple sources.
    Returns distance to nearest source for each cell.
    """
    rows, cols = len(grid), len(grid[0])
    distances = [[-1] * cols for _ in range(rows)]
    queue = deque()
    
    # Initialize all sources with distance 0
    for r, c in sources:
        distances[r][c] = 0
        queue.append((r, c))
    
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    
    while queue:
        r, c = queue.popleft()
        
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols and distances[nr][nc] == -1:
                distances[nr][nc] = distances[r][c] + 1
                queue.append((nr, nc))
    
    return distances
```

### Tactic 4: State Space BFS

BFS with additional state dimensions:

```python
def bfs_with_state(grid, start, target):
    """
    BFS where state includes position and additional info (e.g., keys).
    """
    rows, cols = len(grid), len(grid[0])
    # State: (row, col, keys_bitmask)
    start_state = (start[0], start[1], 0)
    
    visited = set([start_state])
    queue = deque([(start_state, 0)])  # (state, distance)
    
    while queue:
        (r, c, keys), dist = queue.popleft()
        
        if (r, c) == target:
            return dist
        
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < rows and 0 <= nc < cols:
                cell = grid[nr][nc]
                
                # Handle keys
                new_keys = keys
                if cell.islower():  # Key
                    new_keys |= (1 << (ord(cell) - ord('a')))
                
                # Check if we can enter (have key for door)
                if cell.isupper() and not (keys & (1 << (ord(cell.lower()) - ord('a')))):
                    continue
                
                new_state = (nr, nc, new_keys)
                if new_state not in visited:
                    visited.add(new_state)
                    queue.append((new_state, dist + 1))
    
    return -1
```

### Tactic 5: 0-1 BFS (Dequeue Optimization)

For graphs with edge weights 0 or 1, use deque:

```python
from collections import deque

def bfs_01(graph, start):
    """
    0-1 BFS for graphs with edge weights 0 or 1.
    Uses deque: appendleft for weight 0, append for weight 1.
    """
    n = len(graph)
    dist = [float('inf')] * n
    dist[start] = 0
    dq = deque([start])
    
    while dq:
        u = dq.popleft()
        
        for v, weight in graph[u]:  # (neighbor, weight)
            if dist[u] + weight < dist[v]:
                dist[v] = dist[u] + weight
                if weight == 0:
                    dq.appendleft(v)
                else:
                    dq.append(v)
    
    return dist
```

---

## Python Templates

### Template 1: Basic BFS Traversal

```python
from collections import deque
from typing import List, Dict, Set

def bfs_traversal(graph: Dict[str, List[str]], start: str) -> List[str]:
    """
    Perform basic BFS traversal on a graph.
    
    Time Complexity: O(V + E)
    Space Complexity: O(V)
    
    Args:
        graph: Adjacency list representation
        start: Starting vertex
        
    Returns:
        List of vertices in BFS order
    """
    if start not in graph:
        return []
    
    visited: Set[str] = {start}
    queue: deque = deque([start])
    result: List[str] = []
    
    while queue:
        vertex = queue.popleft()
        result.append(vertex)
        
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return result
```

### Template 2: Shortest Distance BFS

```python
def bfs_shortest_distance(graph: Dict[str, List[str]], start: str) -> Dict[str, int]:
    """
    Find shortest distance from start to all reachable vertices.
    
    Time: O(V + E)
    Space: O(V)
    
    Args:
        graph: Adjacency list representation
        start: Starting vertex
        
    Returns:
        Dictionary mapping vertex to its distance from start
    """
    if start not in graph:
        return {}
    
    distances: Dict[str, int] = {start: 0}
    visited: Set[str] = {start}
    queue: deque = deque([start])
    
    while queue:
        vertex = queue.popleft()
        current_distance = distances[vertex]
        
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                distances[neighbor] = current_distance + 1
                queue.append(neighbor)
    
    return distances
```

### Template 3: Shortest Path with Path Reconstruction

```python
from typing import Optional

def bfs_shortest_path(graph: Dict[str, List[str]], start: str, target: str) -> Optional[List[str]]:
    """
    Find shortest path from start to target.
    
    Time: O(V + E)
    Space: O(V)
    
    Args:
        graph: Adjacency list representation
        start: Starting vertex
        target: Target vertex
        
    Returns:
        List representing the path, or None if no path exists
    """
    if start == target:
        return [start]
    
    if start not in graph:
        return None
    
    visited: Set[str] = {start}
    parent: Dict[str, str] = {start: None}
    queue: deque = deque([start])
    
    while queue:
        vertex = queue.popleft()
        
        for neighbor in graph[vertex]:
            if neighbor == target:
                # Reconstruct path
                path = [target, vertex]
                current = vertex
                while parent[current] is not None:
                    current = parent[current]
                    path.append(current)
                return path[::-1]
            
            if neighbor not in visited:
                visited.add(neighbor)
                parent[neighbor] = vertex
                queue.append(neighbor)
    
    return None  # No path exists
```

### Template 4: Grid BFS (4-Directional)

```python
def bfs_grid(grid: List[List[int]], start: tuple, target: tuple) -> int:
    """
    BFS on 2D grid to find shortest path.
    
    Time: O(rows * cols)
    Space: O(rows * cols)
    
    Args:
        grid: 2D grid (0 = walkable, 1 = obstacle)
        start: (row, col) starting position
        target: (row, col) target position
        
    Returns:
        Shortest distance, or -1 if no path
    """
    rows, cols = len(grid), len(grid[0])
    
    if grid[start[0]][start[1]] == 1 or grid[target[0]][target[1]] == 1:
        return -1
    
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    visited = set([start])
    queue = deque([(start[0], start[1], 0)])  # (row, col, distance)
    
    while queue:
        r, c, dist = queue.popleft()
        
        if (r, c) == target:
            return dist
        
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if (0 <= nr < rows and 0 <= nc < cols and 
                grid[nr][nc] == 0 and (nr, nc) not in visited):
                visited.add((nr, nc))
                queue.append((nr, nc, dist + 1))
    
    return -1  # No path found
```

### Template 5: Multi-Source BFS

```python
def multi_source_bfs(grid: List[List[int]], sources: List[tuple]) -> List[List[int]]:
    """
    BFS from multiple sources simultaneously.
    Returns distance to nearest source for each cell.
    
    Time: O(rows * cols)
    Space: O(rows * cols)
    """
    rows, cols = len(grid), len(grid[0])
    distances = [[-1] * cols for _ in range(rows)]
    queue = deque()
    
    # Initialize all sources
    for r, c in sources:
        distances[r][c] = 0
        queue.append((r, c))
    
    directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]
    
    while queue:
        r, c = queue.popleft()
        
        for dr, dc in directions:
            nr, nc = r + dr, c + dc
            if (0 <= nr < rows and 0 <= nc < cols and 
                distances[nr][nc] == -1 and grid[nr][nc] == 0):
                distances[nr][nc] = distances[r][c] + 1
                queue.append((nr, nc))
    
    return distances
```

### Template 6: Connected Components BFS

```python
def find_connected_components(graph: Dict[str, List[str]]) -> List[List[str]]:
    """
    Find all connected components in graph using BFS.
    
    Time: O(V + E)
    Space: O(V)
    
    Returns:
        List of connected components (each is a list of vertices)
    """
    visited: Set[str] = set()
    components: List[List[str]] = []
    
    # Get all vertices
    all_vertices = set(graph.keys())
    for neighbors in graph.values():
        all_vertices.update(neighbors)
    
    for vertex in all_vertices:
        if vertex not in visited:
            # BFS from this vertex
            component = []
            queue = deque([vertex])
            visited.add(vertex)
            
            while queue:
                v = queue.popleft()
                component.append(v)
                
                for neighbor in graph.get(v, []):
                    if neighbor not in visited:
                        visited.add(neighbor)
                        queue.append(neighbor)
            
            components.append(component)
    
    return components
```

---

## When to Use

Use BFS when you need to solve problems involving:

- **Shortest Path**: Finding minimum distance in unweighted graphs
- **Level-Order Traversal**: Visiting nodes level by level
- **Connected Components**: Finding all reachable vertices
- **Cycle Detection**: In undirected graphs
- **Path Finding**: With unweighted edges
- **Minimum Steps**: Problems requiring minimum number of moves

### Comparison with DFS

| Feature | BFS | DFS |
|---------|-----|-----|
| **Data Structure** | Queue | Stack (or recursion) |
| **Exploration Order** | Level by level | Depth first |
| **Shortest Path** | ✅ Yes (unweighted) | ❌ No |
| **Memory** | O(width) | O(depth) |
| **Optimal for** | Shortest path | Path existence, cycles |
| **Can get stuck** | In deep graphs | In wide graphs |

### When to Choose BFS vs DFS

- **Choose BFS** when:
  - Finding shortest path in unweighted graph
  - Level-order traversal is needed
  - Graph is very wide but shallow
  - Minimum distance matters

- **Choose DFS** when:
  - Just checking path existence
  - Graph is very deep but narrow
  - Finding cycles in graph
  - Topological sorting

---

## Algorithm Explanation

### Core Concept

The key insight behind BFS is that it explores vertices in "waves" - first visiting all vertices at distance 1 from the source, then all vertices at distance 2, and so on. This guaranteed ordering makes BFS perfect for finding shortest paths in unweighted graphs.

### How It Works

#### Basic Algorithm:
1. **Initialize**: Start with a source vertex, mark it as visited, and enqueue it
2. **Process**: Dequeue a vertex from the front of the queue
3. **Explore**: Visit all unvisited neighbors of the dequeued vertex and enqueue them
4. **Repeat**: Continue until the queue is empty

### Visual Representation

For a graph with vertices A → B → C, etc.:

```
Level 0:     A (source)
Level 1:    B  C (distance 1 from A)
Level 2:   D  E  F (distance 2 from A)
```

BFS visits in order: A → B → C → D → E → F

### Why Queue Works

The queue data structure provides **FIFO** (First In, First Out) ordering:
- Vertices discovered earlier are explored earlier
- This ensures all vertices at distance d are processed before any at distance d+1
- Results in shortest-path discovery in unweighted graphs

### Key Data Structures

| Structure | Purpose |
|-----------|---------|
| **Queue** | Stores vertices to be explored (FIFO order) |
| **Visited Set** | Prevents revisiting vertices and infinite loops |
| **Result List** | Stores traversal order or distances |

### Why It Works

BFS guarantees the shortest path because:
1. All paths of length k are explored before any path of length k+1
2. The first time we reach a node is via the shortest path
3. No shorter path can exist that we haven't already explored

### Limitations

| Limitation | Description | Mitigation |
|------------|-------------|------------|
| **Memory Usage** | Queue can grow large for wide graphs | Use DFS for very wide graphs |
| **Weighted Graphs** | Cannot handle weighted edges correctly | Use Dijkstra's algorithm |
| **Deep Graphs** | Can be memory-intensive | Consider bidirectional BFS |

---

## Practice Problems

### Problem 1: Number of Islands

**Problem:** [LeetCode 200 - Number of Islands](https://leetcode.com/problems/number-of-islands/)

**Description:** Given a 2D grid of '1's (land) and '0's (water), count the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.

**How to Apply:**
- Use BFS to explore each island when encountering unvisited land
- Mark visited cells to avoid counting the same island twice
- BFS guarantees we visit all connected land cells

**Key Insight:** Each BFS from an unvisited land cell discovers one complete island.

---

### Problem 2: Shortest Path in Binary Matrix

**Problem:** [LeetCode 1091 - Shortest Path in Binary Matrix](https://leetcode.com/problems/shortest-path-in-binary-matrix/)

**Description:** Given an n x n binary matrix, find the length of the shortest clear path from top-left to bottom-right. A clear path is one where all cells have value 0.

**How to Apply:**
- BFS naturally finds shortest path in unweighted grid
- Start from (0, 0) and BFS to (n-1, n-1)
- Track distance to each cell for shortest path
- Can use 8-directional movement

**Key Insight:** BFS ensures the first time we reach the target is via the shortest path.

---

### Problem 3: Rotting Oranges

**Problem:** [LeetCode 994 - Rotting Oranges](https://leetcode.com/problems/rotting-oranges/)

**Description:** In a grid, each cell can have fresh oranges (1), rotten oranges (2), or be empty (0). Rotten oranges rot adjacent fresh oranges in 1 minute. Find the minimum time when all oranges become rotten.

**How to Apply:**
- Use multi-source BFS starting from all initially rotten oranges
- Each BFS level represents one minute of time
- Answer is the number of BFS levels needed
- Check if any fresh oranges remain unreachable

**Key Insight:** Multi-source BFS spreads from all rotten oranges simultaneously, perfectly modeling the rotting process.

---

### Problem 4: Clone Graph

**Problem:** [LeetCode 133 - Clone Graph](https://leetcode.com/problems/clone-graph/)

**Description:** Given a reference of a node in a connected undirected graph, return a deep copy of the graph.

**How to Apply:**
- Use BFS to traverse the original graph
- Maintain a mapping from original nodes to cloned nodes
- When visiting each neighbor, create its clone if not exists
- Connect cloned nodes to match original structure

**Key Insight:** BFS ensures we visit all nodes while maintaining the cloning mapping.

---

### Problem 5: Word Ladder

**Problem:** [LeetCode 127 - Word Ladder](https://leetcode.com/problems/word-ladder/)

**Description:** Given two words beginWord and endWord, and a dictionary, find the shortest transformation sequence length where only one letter changes at each step.

**How to Apply:**
- Build graph where nodes are words and edges exist if words differ by one letter
- BFS from beginWord to find shortest transformation
- Use bidirectional BFS for optimization on large dictionaries
- Track visited words to avoid cycles

**Key Insight:** This is a classic shortest path problem in an unweighted graph - perfect for BFS.

---

## Video Tutorial Links

### Fundamentals

- [BFS Introduction (Take U Forward)](https://www.youtube.com/watch?v=uWLlKThW7HQ) - Comprehensive BFS introduction
- [Breadth First Search (WilliamFiset)](https://www.youtube.com/watch?v=oDqjPvD54Ss) - Detailed explanation with visualizations
- [Graph Traversal (NeetCode)](https://www.youtube.com/watch?v=pcKY4hjDrxk) - BFS and DFS comparison

### Problem-Solving

- [Number of Islands - BFS Solution](https://www.youtube.com/watch?v=4t_NF66FA4I) - Grid BFS patterns
- [Word Ladder - BFS Solution](https://www.youtube.com/watch?v=vhWzBoy12_0) - Graph building with BFS
- [Rotting Oranges - BFS Solution](https://www.youtube.com/watch?v=y704f3pyEHw) - Multi-source BFS

### Advanced Topics

- [Bidirectional BFS](https://www.youtube.com/watch?v=UgZxr6n1f6M) - Optimization technique
- [BFS vs DFS](https://www.youtube.com/watch?v=1nKkXwfiNzk) - When to use which

---

## Follow-up Questions

### Q1: Can BFS be used to detect cycles in a directed graph?

**Answer:** Yes, but with a modification. Use three states for each vertex:
- **Unvisited**: Not seen yet
- **In Progress**: Currently in recursion stack (being processed)
- **Completed**: Fully processed

If we encounter a vertex in "In Progress" state, there's a cycle. Standard BFS with just visited set is sufficient for undirected graphs.

### Q2: What is the space complexity difference between BFS and DFS?

**Answer:**
- **BFS**: O(V) worst case for queue + visited = O(V) - proportional to graph's width
- **DFS**: O(V) for recursion stack + visited = O(V) - proportional to graph's depth

For a line graph: BFS uses O(1) space, DFS uses O(V) space
For a star graph: BFS uses O(V) space, DFS uses O(1) space

### Q3: How do you handle very large graphs that don't fit in memory?

**Answer:**
1. **Disk-based BFS**: Use external memory algorithms
2. **Graph partitioning**: Divide graph and process in chunks
3. **Streaming BFS**: Process edges as they arrive
4. **Sampling**: For approximate answers, sample the graph

### Q4: Can BFS be implemented recursively?

**Answer:** BFS is inherently iterative due to its level-by-level requirement. However, you can simulate BFS using recursion with a "current level" and "next level" approach, but it's less efficient due to function call overhead. DFS is naturally recursive.

### Q5: How does BFS handle weighted graphs?

**Answer:** BFS **cannot** handle weighted graphs correctly for shortest path. For weighted graphs:
- Use **Dijkstra's Algorithm** (similar to BFS but with priority queue)
- For non-negative weights, Dijkstra is optimal
- For negative weights, use **Bellman-Ford** or **SPFA**

BFS treats all edges as having weight 1, so it only works for unweighted graphs.

---

## Summary

BFS (Breadth-First Search) is a fundamental graph traversal algorithm with numerous applications in competitive programming and technical interviews. Key takeaways:

### Core Concepts
- **Guaranteed shortest path**: In unweighted graphs, BFS finds shortest path
- **Level-order exploration**: Processes all nodes at distance d before d+1
- **Queue-based**: Uses FIFO ordering for exploration
- **Time: O(V + E)**: Efficient for sparse graphs
- **Space: O(V)**: Depends on graph structure (width vs depth)

### When to Use
- ✅ Finding shortest path in unweighted graphs
- ✅ Finding minimum number of steps/transformation
- ✅ Level-order tree/graph traversal
- ✅ Finding connected components
- ✅ Cycle detection in undirected graphs

### When NOT to Use
- ❌ Weighted graphs (use Dijkstra's)
- ❌ Finding any path (DFS is simpler)
- ❌ Deep graphs (may exceed stack with recursive DFS)
- ❌ Memory-constrained wide graphs

### Implementation Tips
1. Always mark visited when enqueueing, not when dequeuing (prevents duplicate entries)
2. Use parent map for path reconstruction
3. Consider bidirectional BFS for large graphs
4. For grids, use direction arrays for cleaner code

BFS is an essential tool that every programmer should master. It forms the foundation for many graph algorithms and is frequently asked in technical interviews.
