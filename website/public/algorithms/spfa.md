# Shortest Path Faster Algorithm (SPFA)

## Category
Graphs - Shortest Path

## Description

The Shortest Path Faster Algorithm (SPFA) is an optimization of the Bellman-Ford algorithm for finding shortest paths in weighted graphs with negative edge weights. It uses a queue to efficiently process only vertices whose distances have been updated, making it significantly faster in practice for many graphs while maintaining the ability to detect negative cycles.

Developed by Fanding Duan in 1994, SPFA improves upon Bellman-Ford's O(V×E) worst-case time by avoiding the relaxation of edges that cannot lead to improvements. In sparse graphs or graphs with few negative edges, SPFA often achieves O(E) average time complexity, making it competitive with Dijkstra's algorithm while handling negative weights.

---

## Concepts

SPFA relies on fundamental graph theory and queue-based optimization concepts.

### 1. Bellman-Ford Foundation

| Aspect | Description |
|--------|-------------|
| **Relaxation** | Update distance if shorter path found |
| **Negative cycles** | Detected when vertex relaxed V times |
| **Optimality** | Correct for all graphs without negative cycles |

### 2. Queue Optimization

| Strategy | Benefit |
|----------|---------|
| **Process only changed vertices** | Skip unnecessary relaxations |
| **First-in-first-out** | Fair processing of updates |
| **In-queue tracking** | Avoid duplicate queue entries |

### 3. Time Complexity

| Case | Complexity | Scenario |
|------|------------|----------|
| **Best** | O(E) | Each vertex relaxed once |
| **Average** | O(E) | Sparse graphs, few updates |
| **Worst** | O(V×E) | Dense graphs, many updates |

### 4. Negative Cycle Detection

| Method | Implementation |
|--------|----------------|
| **Relaxation count** | Track relaxations per vertex |
| **Threshold** | If count[v] ≥ V, negative cycle exists |
| **Path reconstruction** | Store predecessor for cycle extraction |

---

## Frameworks

Structured approaches for SPFA implementation.

### Framework 1: Standard SPFA

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARD SPFA ALGORITHM                                     │
├─────────────────────────────────────────────────────────────┤
│  Input: Graph G=(V,E), source vertex s                       │
│  Output: Shortest distances from s to all vertices           │
│                                                              │
│  1. Initialize:                                               │
│     - dist[v] = ∞ for all v ≠ s                            │
│     - dist[s] = 0                                            │
│     - in_queue[v] = False for all v                        │
│     - queue = [s]                                            │
│     - in_queue[s] = True                                     │
│                                                              │
│  2. While queue not empty:                                  │
│     a. u = queue.pop_front()                                │
│     b. in_queue[u] = False                                   │
│     c. For each edge (u, v) with weight w:                   │
│        - If dist[u] + w < dist[v]:                         │
│          * dist[v] = dist[u] + w                           │
│          * If not in_queue[v]:                              │
│            · queue.push(v)                                  │
│            · in_queue[v] = True                             │
│                                                              │
│  3. Return dist                                              │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Single-source shortest path with possible negative weights.

### Framework 2: SPFA with Negative Cycle Detection

```
┌─────────────────────────────────────────────────────────────┐
│  SPFA WITH NEGATIVE CYCLE DETECTION                          │
├─────────────────────────────────────────────────────────────┤
│  1. Initialize as in standard SPFA                         │
│  2. Add: count[v] = 0 for all v (relaxation count)         │
│                                                              │
│  3. While queue not empty:                                  │
│     a. u = queue.pop_front()                                │
│     b. in_queue[u] = False                                   │
│     c. For each edge (u, v) with weight w:                 │
│        - If dist[u] + w < dist[v]:                          │
│          * dist[v] = dist[u] + w                            │
│          * count[v] += 1                                    │
│          * If count[v] ≥ V:                                 │
│            · Return "Negative cycle detected"               │
│          * If not in_queue[v]:                              │
│            · queue.push(v)                                  │
│            · in_queue[v] = True                             │
│                                                              │
│  4. Return dist (no negative cycle)                         │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: When negative cycles might exist and need detection.

### Framework 3: Small Label First (SLF) Optimization

```
┌─────────────────────────────────────────────────────────────┐
│  SPFA WITH SLF OPTIMIZATION                                  │
├─────────────────────────────────────────────────────────────┤
│  Optimization: Add to front of queue if dist[v] < dist[front]│
│                                                              │
│  When relaxing edge (u, v):                                 │
│     - If dist[v] < dist[queue.front()]:                     │
│       * queue.push_front(v)                                  │
│     - Else:                                                  │
│       * queue.push_back(v)                                   │
│                                                              │
│  Idea: Process "closer" vertices first                      │
│  Can significantly speed up convergence                     │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Large graphs where vertex ordering matters.

---

## Forms

Different manifestations of SPFA.

### Form 1: Basic SPFA

Standard queue-based implementation.

| Aspect | Details |
|--------|---------|
| **Time** | O(E) avg, O(V×E) worst |
| **Space** | O(V) |
| **Queue** | Simple FIFO |
| **Best for** | Sparse graphs with few negatives |

### Form 2: SPFA with SLF

Small Label First optimization.

| Aspect | Details |
|--------|---------|
| **Time** | Often faster than basic |
| **Space** | O(V) |
| **Queue** | Deque with front insertion |
| **Best for** | Large scale problems |

### Form 3: SPFA with LLL

Large Label Last optimization.

| Aspect | Details |
|--------|---------|
| **Time** | Comparable to SLF |
| **Strategy** | Compare with average distance |
| **Best for** | Variation for specific patterns |

### Form 4: Multi-source SPFA

Multiple source vertices.

| Aspect | Details |
|--------|---------|
| **Initialization** | All sources in queue with dist=0 |
| **Use case** | Multiple starting points |
| **Complexity** | Same asymptotic bounds |

---

## Tactics

Specific techniques for SPFA.

### Tactic 1: Basic SPFA Implementation

Standard queue-based shortest path:

```python
from collections import deque

def spfa(graph, source, n):
    """
    SPFA for single source shortest path.
    graph: adjacency list with (neighbor, weight)
    
    Time: O(V * E) worst, O(E) average
    Space: O(V)
    """
    INF = float('inf')
    dist = [INF] * n
    in_queue = [False] * n
    
    dist[source] = 0
    queue = deque([source])
    in_queue[source] = True
    
    while queue:
        u = queue.popleft()
        in_queue[u] = False
        
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                if not in_queue[v]:
                    queue.append(v)
                    in_queue[v] = True
    
    return dist
```

**Core**: Only enqueue when distance improves.

### Tactic 2: Negative Cycle Detection

Track relaxation counts:

```python
def spfa_with_cycle_detection(graph, source, n):
    """
    SPFA that detects negative cycles.
    Returns (distances, has_negative_cycle)
    """
    INF = float('inf')
    dist = [INF] * n
    count = [0] * n  # Count relaxations per node
    in_queue = [False] * n
    
    dist[source] = 0
    queue = deque([source])
    in_queue[source] = True
    
    while queue:
        u = queue.popleft()
        in_queue[u] = False
        
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                count[v] += 1
                
                # If relaxed more than V-1 times, negative cycle exists
                if count[v] >= n:
                    return dist, True
                
                if not in_queue[v]:
                    queue.append(v)
                    in_queue[v] = True
    
    return dist, False
```

**Critical**: Count relaxations to detect cycles.

### Tactic 3: SLF Optimization

Small Label First heuristic:

```python
def spfa_slf(graph, source, n):
    """
    SPFA with Small Label First optimization.
    """
    INF = float('inf')
    dist = [INF] * n
    in_queue = [False] * n
    
    dist[source] = 0
    queue = deque([source])
    in_queue[source] = True
    
    while queue:
        u = queue.popleft()
        in_queue[u] = False
        
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                if not in_queue[v]:
                    # SLF: Add to front if closer than current front
                    if queue and dist[v] < dist[queue[0]]:
                        queue.appendleft(v)
                    else:
                        queue.append(v)
                    in_queue[v] = True
    
    return dist
```

**Idea**: Prioritize processing vertices with smaller distances.

### Tactic 4: Path Reconstruction

Track predecessors:

```python
def spfa_with_path(graph, source, n):
    """
    SPFA with path reconstruction.
    """
    INF = float('inf')
    dist = [INF] * n
    parent = [-1] * n
    in_queue = [False] * n
    
    dist[source] = 0
    queue = deque([source])
    in_queue[source] = True
    
    while queue:
        u = queue.popleft()
        in_queue[u] = False
        
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                parent[v] = u
                if not in_queue[v]:
                    queue.append(v)
                    in_queue[v] = True
    
    return dist, parent

def get_path(parent, target):
    """Reconstruct path from source to target."""
    path = []
    cur = target
    while cur != -1:
        path.append(cur)
        cur = parent[cur]
    return path[::-1]
```

**Application**: Need actual shortest path, not just distances.

### Tactic 5: Early Termination Check

Check for convergence:

```python
def spfa_early_termination(graph, source, target, n):
    """
    SPFA that stops when target distance is finalized.
    """
    INF = float('inf')
    dist = [INF] * n
    in_queue = [False] * n
    
    dist[source] = 0
    queue = deque([source])
    in_queue[source] = True
    
    iterations = 0
    max_iterations = n * 2  # Safety limit
    
    while queue and iterations < max_iterations:
        u = queue.popleft()
        in_queue[u] = False
        
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                if not in_queue[v]:
                    queue.append(v)
                    in_queue[v] = True
        
        iterations += 1
        
        # Optional: Check if we can terminate early
        if not in_queue[target] and dist[target] < INF:
            # Target not in queue and has valid distance
            # Might be converged, could check further
            pass
    
    return dist[target] if dist[target] < INF else -1
```

---

## Python Templates

### Template 1: Standard SPFA

```python
from collections import deque
from typing import List, Tuple


def spfa(graph: List[List[Tuple[int, int]]], source: int, n: int) -> List[float]:
    """
    Shortest Path Faster Algorithm (SPFA).
    
    Finds shortest distances from source to all vertices in a weighted graph.
    Handles negative edge weights but not negative cycles.
    
    Args:
        graph: Adjacency list where graph[u] = [(v, weight), ...]
        source: Source vertex (0-indexed)
        n: Number of vertices
    
    Returns:
        List of shortest distances from source to each vertex
        INF if vertex is unreachable
    
    Time: O(V * E) worst case, O(E) average case
    Space: O(V)
    """
    INF = float('inf')
    dist = [INF] * n
    in_queue = [False] * n
    
    dist[source] = 0
    queue = deque([source])
    in_queue[source] = True
    
    while queue:
        u = queue.popleft()
        in_queue[u] = False
        
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                if not in_queue[v]:
                    queue.append(v)
                    in_queue[v] = True
    
    return dist
```

### Template 2: SPFA with Negative Cycle Detection

```python
def spfa_detect_negative_cycle(graph: List[List[Tuple[int, int]]], 
                                 source: int, n: int) -> Tuple[List[float], bool]:
    """
    SPFA with negative cycle detection.
    
    Returns:
        (distances, has_negative_cycle)
        has_negative_cycle is True if a negative cycle is reachable from source
    
    Time: O(V * E)
    Space: O(V)
    """
    INF = float('inf')
    dist = [INF] * n
    count = [0] * n  # Track relaxations per vertex
    in_queue = [False] * n
    
    dist[source] = 0
    queue = deque([source])
    in_queue[source] = True
    
    while queue:
        u = queue.popleft()
        in_queue[u] = False
        
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                count[v] += 1
                
                # If vertex relaxed V times, negative cycle exists
                if count[v] >= n:
                    return dist, True
                
                if not in_queue[v]:
                    queue.append(v)
                    in_queue[v] = True
    
    return dist, False
```

### Template 3: SPFA with Path Reconstruction

```python
def spfa_with_path(graph: List[List[Tuple[int, int]]], 
                   source: int, n: int) -> Tuple[List[float], List[int]]:
    """
    SPFA with predecessor tracking for path reconstruction.
    
    Returns:
        (distances, parent)
        parent[v] = predecessor of v in shortest path from source
        parent[source] = -1
    
    To reconstruct path to target:
        path = []
        cur = target
        while cur != -1:
            path.append(cur)
            cur = parent[cur]
        path.reverse()
    """
    INF = float('inf')
    dist = [INF] * n
    parent = [-1] * n
    in_queue = [False] * n
    
    dist[source] = 0
    queue = deque([source])
    in_queue[source] = True
    
    while queue:
        u = queue.popleft()
        in_queue[u] = False
        
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                parent[v] = u
                if not in_queue[v]:
                    queue.append(v)
                    in_queue[v] = True
    
    return dist, parent


def reconstruct_path(parent: List[int], target: int) -> List[int]:
    """Reconstruct path from source to target using parent array."""
    if parent[target] == -1 and target != 0:  # Assuming source is 0
        return []  # Target unreachable
    
    path = []
    cur = target
    while cur != -1:
        path.append(cur)
        cur = parent[cur]
    
    path.reverse()
    return path
```

### Template 4: Multi-source SPFA

```python
def spfa_multi_source(graph: List[List[Tuple[int, int]]], 
                      sources: List[int], n: int) -> List[float]:
    """
    SPFA with multiple source vertices.
    
    Useful for finding shortest distance from any of multiple sources.
    
    Args:
        graph: Adjacency list
        sources: List of source vertices (all initialized to distance 0)
        n: Number of vertices
    
    Returns:
        Minimum distances from any source to each vertex
    """
    INF = float('inf')
    dist = [INF] * n
    in_queue = [False] * n
    
    queue = deque()
    for s in sources:
        dist[s] = 0
        queue.append(s)
        in_queue[s] = True
    
    while queue:
        u = queue.popleft()
        in_queue[u] = False
        
        for v, w in graph[u]:
            if dist[u] + w < dist[v]:
                dist[v] = dist[u] + w
                if not in_queue[v]:
                    queue.append(v)
                    in_queue[v] = True
    
    return dist
```

---

## When to Use

Use SPFA when you need to solve problems involving:

- **Shortest paths with negative weights**: Dijkstra doesn't work with negatives
- **Sparse graphs**: Faster than Bellman-Ford in practice
- **Negative cycle detection**: Can detect unreachable negative cycles
- **Single source shortest path**: When source is fixed
- **Dynamic graphs**: For incremental updates

### Comparison with Alternatives

| Algorithm | Time | Space | Negative Weights | Best For |
|-----------|------|-------|------------------|----------|
| **Dijkstra** | O(E log V) | O(V) | No | Non-negative weights |
| **Bellman-Ford** | O(V × E) | O(V) | Yes | Small graphs, guaranteed bounds |
| **SPFA** | O(E) avg, O(V×E) worst | O(V) | Yes | Sparse graphs |
| **Floyd-Warshall** | O(V³) | O(V²) | Yes | All-pairs shortest |

### When to Choose SPFA vs Bellman-Ford

- **Choose SPFA** when:
  - Graph is sparse (E ≈ V)
  - Few negative edges
  - Average-case performance matters
  - Need faster practical performance

- **Choose Bellman-Ford** when:
  - Worst-case guarantee needed
  - Graph is dense
  - Want simpler implementation
  - Testing for negative cycles from all sources

---

## Algorithm Explanation

### Core Concept

SPFA optimizes Bellman-Ford by recognizing that relaxing edges from vertices whose distances haven't changed is pointless. By using a queue to track only "active" vertices (those whose distances were recently updated), we avoid wasted work.

### How It Works

#### Step 1: Initialize
```
dist[source] = 0
Queue = [source]
All other vertices: dist = INF, not in queue
```

#### Step 2: Process Queue
```
While queue not empty:
  u = dequeue()
  For each neighbor v of u:
    If can improve dist[v]:
      dist[v] = new_distance
      If v not in queue:
        enqueue(v)
```

#### Step 3: Terminate
```
Queue empty → all reachable shortest paths found
```

### Visual Walkthrough

**Example Graph**: A → B (5), A → C (3), B → C (-2), C → B (1)

```
Initial: dist[A]=0, dist[B]=INF, dist[C]=INF
Queue: [A]

Process A:
  Relax A→B: dist[B]=5, Queue=[B]
  Relax A→C: dist[C]=3, Queue=[B, C]

Process B:
  Relax B→C: dist[C] already 3 < 5+(-2)=3, no change

Process C:
  Relax C→B: dist[B]=3+1=4 < 5, update!
  Queue=[B]

Process B:
  No improvements possible

Queue empty. Final: dist=[0, 4, 3]
```

### Negative Cycle Detection

If a vertex is relaxed V times (more than V-1 edges in any simple path), a negative cycle exists:
```
count[v] = number of times v's distance was updated
If count[v] >= V:
  Negative cycle reachable from source
```

---

## Practice Problems

### Problem 1: Cheapest Flights Within K Stops

**Problem:** [LeetCode 787 - Cheapest Flights Within K Stops](https://leetcode.com/problems/cheapest-flights-within-k-stops/)

**Description:** There are `n` cities connected by flights. Find the cheapest price from `src` to `dst` with up to `k` stops.

**How to Apply SPFA:**
- Modified SPFA with stop constraint
- Track stops along with distance
- Can also use Bellman-Ford with iteration limit

---

### Problem 2: Network Delay Time

**Problem:** [LeetCode 743 - Network Delay Time](https://leetcode.com/problems/network-delay-time/)

**Description:** Given times[i] = (u, v, w) representing travel time from u to v, find minimum time for all nodes to receive signal from K.

**How to Apply:**
- Run SPFA from source K
- Find maximum distance among all reachable nodes
- Return -1 if any node unreachable

---

### Problem 3: Find the City With Smallest Number of Neighbors

**Problem:** [LeetCode 1334 - Find the City With the Smallest Number of Neighbors at a Threshold Distance](https://leetcode.com/problems/find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance/)

**Description:** Find the city with the smallest number of cities reachable within distance threshold.

**How to Apply:**
- Run SPFA from each city
- Count reachable cities within threshold
- Find city with minimum count

---

## Video Tutorial Links

### Fundamentals

- [SPFA Algorithm Explained](https://www.youtube.com/watch?v=lywM0U0kMi8) - Bellman-Ford and SPFA
- [Shortest Path Algorithms](https://www.youtube.com/watch?v=09_LlHjoEiY) - Comparison
- [Negative Cycle Detection](https://www.youtube.com/watch?v=maG blossoms_t7EwYC6N9vU) - SPFA implementation

### Problem Solutions

- [LeetCode 787 Solution](https://www.youtube.com/watch?v=5i7oKodCRJo) - Cheapest Flights
- [LeetCode 743 Solution](https://www.youtube.com/watch?v=3Jx3_9_1Q5I) - Network Delay Time
- [Graph Algorithms Playlist](https://www.youtube.com/watch?v=bts5yZn8h3A) - Comprehensive coverage

---

## Follow-up Questions

### Q1: When is SPFA slower than Bellman-Ford?

**Answer**: On dense graphs (E ≈ V²) or graphs specifically designed to trigger worst-case behavior (e.g., graphs with many edges causing frequent relaxations). Bellman-Ford's consistent O(V×E) can outperform SPFA's worst case.

### Q2: What are SLF and LLL optimizations?

**Answer**:
- **SLF (Small Label First)**: Add to queue front if distance is smaller than current front. Prioritizes processing "closer" vertices.
- **LLL (Large Label Last)**: If distance is larger than back of queue, add to back instead of front.

Both attempt to process vertices in better order for faster convergence.

### Q3: How does SPFA compare to Dijkstra with potential shifting?

**Answer**: Johnson's algorithm uses Dijkstra with potential shifting to handle negative weights. This is O(V×E log V) for all-pairs. SPFA is often faster for single-source on sparse graphs but lacks the theoretical guarantees of Dijkstra.

### Q4: Can SPFA handle graphs with negative weight edges only?

**Answer**: Yes, SPFA handles any graph with negative edges, as long as no negative cycles are reachable from the source. It's specifically designed for this case where Dijkstra fails.

### Q5: Why use in_queue flag instead of checking if vertex is in queue?

**Answer**: Checking if an element is in a queue is O(n). The in_queue array provides O(1) lookup to avoid duplicate queue entries, which is critical for performance.

---

## Summary

SPFA is a practical optimization of Bellman-Ford that significantly improves performance on sparse graphs while maintaining the ability to handle negative weights and detect negative cycles.

**Key Takeaways:**

1. **Queue Optimization**: Only process vertices whose distances changed
2. **Lazy Relaxation**: Skip unnecessary edge relaxations
3. **Average O(E)**: Much faster than Bellman-Ford in practice
4. **Negative Cycle Detection**: Track relaxation counts per vertex
5. **Optimizations**: SLF/LLL heuristics for queue ordering

**When to Use:**
- Graphs with negative edge weights
- Sparse graphs where E ≈ V
- When Dijkstra's non-negative requirement isn't met
- Need better practical performance than Bellman-Ford

SPFA is essential for competitive programming and applications involving graphs with negative weights, providing a good balance between theoretical correctness and practical efficiency.
