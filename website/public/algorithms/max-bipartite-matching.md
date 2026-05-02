# Maximum Bipartite Matching (Kuhn's Algorithm)

## Category
Graphs

## Description

Maximum Bipartite Matching finds the largest set of edges in a bipartite graph such that no two edges share a common vertex. This fundamental graph algorithm has wide applications in resource allocation, job assignment, task scheduling, and network flow problems.

Kuhn's algorithm (also known as the Hungarian algorithm for unweighted matching) solves this problem using augmenting paths in O(VE) time. The algorithm works by iteratively finding augmenting paths that increase the matching size by one until no more augmenting paths exist. For larger graphs, the Hopcroft-Karp algorithm provides a faster O(E√V) solution using BFS layering combined with DFS.

---

## Concepts

Maximum bipartite matching relies on several fundamental concepts from graph theory.

### 1. Bipartite Graphs

Graphs with two disjoint vertex sets:

| Property | Description |
|----------|-------------|
| **Two Sets** | U and V (left and right partitions) |
| **Edge Rule** | All edges connect U to V (no edges within U or V) |
| **Matching** | Set of edges without common vertices |
| **Maximum** | Largest possible matching |

### 2. Augmenting Paths

Paths that can increase matching size:

| Path Type | Structure | Effect on Matching |
|-----------|-----------|-------------------|
| **Augmenting** | Starts and ends at unmatched vertices<br>Alternates: unmatched → matched → unmatched... | Matching size +1 |
| **Properties** | Odd length, alternating unmatched/matched edges | Flipping improves matching |

### 3. Matching Types

Different matching objectives:

| Type | Goal | Algorithm |
|------|------|-----------|
| **Maximum Cardinality** | Maximize number of matched edges | Kuhn's, Hopcroft-Karp |
| **Maximum Weight** | Maximize total edge weight | Hungarian (Kuhn-Munkres) |
| **Perfect** | Match all vertices | Check if |matching| = |V|/2 |
| **Maximal** | Cannot add more edges | Greedy (not necessarily maximum) |

### 4. Algorithm Comparison

| Algorithm | Time | Space | Best For |
|-----------|------|-------|----------|
| **Kuhn's** | O(VE) | O(V) | Small to medium graphs |
| **Hopcroft-Karp** | O(E√V) | O(V) | Large sparse graphs |
| **Hungarian** | O(V³) | O(V²) | Weighted matching |
| **Max Flow** | O(VE) or better | O(V+E) | When flow network needed |

---

## Frameworks

Structured approaches for implementing bipartite matching.

### Framework 1: Kuhn's Algorithm (DFS-based)

```
┌─────────────────────────────────────────────────────────────┐
│  KUHN'S ALGORITHM FRAMEWORK                                   │
├─────────────────────────────────────────────────────────────┤
│  Input: Bipartite graph (U set edges to V), sizes n, m      │
│  Output: Maximum matching size and match array               │
│                                                                │
│  1. Initialize match[m] = -1 for all vertices in V            │
│     (match[v] = u means v is matched to u)                     │
│                                                                │
│  2. For each u in U (left set):                              │
│     a. Clear visited[m] = False for all v in V                │
│     b. Try to find augmenting path from u:                  │
│        dfs(u):                                                 │
│          For each neighbor v of u:                            │
│            If not visited[v]:                                 │
│              Mark visited[v] = True                           │
│              If match[v] == -1 OR dfs(match[v]):            │
│                match[v] = u                                   │
│                Return True (found augmenting path)            │
│          Return False                                          │
│     c. If dfs(u) succeeds, matching size increases            │
│                                                                │
│  3. Return count of matched vertices, match array            │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard unweighted maximum bipartite matching.

### Framework 2: Hopcroft-Karp Algorithm

```
┌─────────────────────────────────────────────────────────────┐
│  HOPCROFT-KARP FRAMEWORK                                      │
├─────────────────────────────────────────────────────────────┤
│  Input: Bipartite graph, sizes n, m                            │
│  Output: Maximum matching                                       │
│                                                                │
│  1. Initialize empty matching                                   │
│                                                                │
│  2. While BFS finds augmenting paths:                        │
│     a. BFS from free vertices in U:                          │
│        - Build layering of distances                         │
│        - Stop at free vertices in V                          │
│                                                                │
│     b. For each free u in U:                                 │
│        DFS(u) to find augmenting path:                       │
│          - Only follow edges respecting layering              │
│          - Augment matching along path                        │
│                                                                │
│  3. Return matching                                            │
│                                                                │
│  Note: Each phase increases matching by multiple edges       │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Large sparse graphs where O(E√V) is needed.

### Framework 3: Problem Modeling

```
┌─────────────────────────────────────────────────────────────┐
│  BIPARTITE MATCHING PROBLEM MODELING                          │
├─────────────────────────────────────────────────────────────┤
│  Job Assignment:                                              │
│   - U = Workers, V = Jobs                                    │
│   - Edge (u,v) if worker u can do job v                      │
│   - Max matching = max assignments                             │
│                                                                │
│  Task Scheduling:                                             │
│   - U = Time slots, V = Tasks                                │
│   - Edge if task can be done in time slot                    │
│                                                                │
│  Chess/Board:                                                 │
│   - U = White squares, V = Black squares                   │
│   - Edge if piece can move between them                      │
│                                                                │
│  Resource Allocation:                                         │
│   - U = Resources, V = Requirements                          │
│   - Edge if resource satisfies requirement                   │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Converting problems to bipartite matching.

---

## Forms

Different manifestations of bipartite matching.

### Form 1: Unweighted Maximum Matching

Standard cardinality maximization.

| Aspect | Details |
|--------|---------|
| **Goal** | Maximize number of matched edges |
| **Algorithm** | Kuhn's O(VE), Hopcroft-Karp O(E√V) |
| **Output** | Match count + match pairs |

### Form 2: Weighted Maximum Matching

Maximum total weight matching.

| Aspect | Details |
|--------|---------|
| **Goal** | Maximize sum of edge weights |
| **Algorithm** | Hungarian (Kuhn-Munkres) O(V³) |
| **Output** | Weight + matched pairs |

### Form 3: Perfect Matching

Match all vertices.

| Aspect | Details |
|--------|---------|
| **Requirement** | |U| = |V| and matching covers all |
| **Check** | matching_size == |U| == |V| |
| **Algorithm** | Same as maximum, check result |

### Form 4: Maximum Bipartite Independent Set

Related problem via Konig's theorem.

| Aspect | Details |
|--------|---------|
| **Relation** | |MIS| = |V| - |max_matching| |
| **Use** | Find vertices not in minimum vertex cover |

### Form 5: Minimum Vertex Cover

Konig's theorem application.

| Aspect | Details |
|--------|---------|
| **Konig's Theorem** | In bipartite graphs, |min_vertex_cover| = |max_matching| |
| **Use** | Security, surveillance problems |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Kuhn's Algorithm Implementation

Standard DFS-based matching:

```python
def max_bipartite_matching(graph, n_left, n_right):
    """
    Kuhn's algorithm for maximum bipartite matching.
    
    Args:
        graph: adjacency list, graph[u] = list of v in right set
        n_left: number of vertices in left set
        n_right: number of vertices in right set
    
    Returns:
        (matching_size, match_array)
    """
    match = [-1] * n_right  # match[v] = u matched to v
    
    def dfs(u, visited):
        """Try to find augmenting path from u."""
        for v in graph[u]:
            if visited[v]:
                continue
            visited[v] = True
            
            # If v is unmatched, or its match can find another partner
            if match[v] == -1 or dfs(match[v], visited):
                match[v] = u
                return True
        return False
    
    result = 0
    for u in range(n_left):
        visited = [False] * n_right
        if dfs(u, visited):
            result += 1
    
    return result, match
```

### Tactic 2: Hopcroft-Karp Implementation

Faster algorithm for large graphs:

```python
from collections import deque

def hopcroft_karp(graph, n_left, n_right):
    """
    Hopcroft-Karp: O(E * sqrt(V)) for maximum bipartite matching.
    """
    INF = float('inf')
    pair_u = [-1] * n_left
    pair_v = [-1] * n_right
    dist = [0] * n_left
    
    def bfs():
        queue = deque()
        for u in range(n_left):
            if pair_u[u] == -1:
                dist[u] = 0
                queue.append(u)
            else:
                dist[u] = INF
        
        found_augmenting = False
        while queue:
            u = queue.popleft()
            for v in graph[u]:
                if pair_v[v] == -1:
                    found_augmenting = True
                elif dist[pair_v[v]] == INF:
                    dist[pair_v[v]] = dist[u] + 1
                    queue.append(pair_v[v])
        return found_augmenting
    
    def dfs(u):
        for v in graph[u]:
            pu = pair_v[v]
            if pu == -1 or (dist[pu] == dist[u] + 1 and dfs(pu)):
                pair_u[u] = v
                pair_v[v] = u
                return True
        dist[u] = INF
        return False
    
    matching = 0
    while bfs():
        for u in range(n_left):
            if pair_u[u] == -1:
                if dfs(u):
                    matching += 1
    
    return matching
```

### Tactic 3: LeetCode 1820 - Maximum Invitations

Grid to bipartite matching:

```python
def max_invitations(grid):
    """
    LeetCode 1820: Maximum Number of Accepted Invitations.
    grid[i][j] = 1 if boy i can invite girl j.
    """
    m, n = len(grid), len(grid[0])
    
    # Build graph
    graph = [[] for _ in range(m)]
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 1:
                graph[i].append(j)
    
    match, _ = max_bipartite_matching(graph, m, n)
    return match
```

### Tactic 4: Checking Perfect Matching

Verify if all vertices matched:

```python
def has_perfect_matching(graph, n):
    """Check if perfect matching exists (n must be even)."""
    size, match = max_bipartite_matching(graph, n // 2, n // 2)
    return size == n // 2
```

### Tactic 5: Find Maximum Matching Edges

Reconstruct matching pairs:

```python
def get_matching_edges(match, n_right):
    """
    Get list of matched edges from match array.
    Returns list of (u, v) pairs.
    """
    edges = []
    for v in range(n_right):
        if match[v] != -1:
            edges.append((match[v], v))
    return edges
```

---

## Python Templates

### Template 1: Kuhn's Algorithm (Maximum Bipartite Matching)

```python
from typing import List, Tuple

def max_bipartite_matching(graph: List[List[int]], n_left: int, n_right: int) -> Tuple[int, List[int]]:
    """
    Kuhn's algorithm for maximum bipartite matching.
    
    Args:
        graph: adjacency list where graph[u] = list of v in right set
        n_left: number of vertices in left set
        n_right: number of vertices in right set
    
    Returns:
        Tuple of (matching_size, match_array)
        match_array[v] = u means vertex v is matched to u
        
    Time: O(V * E)
    Space: O(V)
    """
    match = [-1] * n_right  # match[v] = u that v is matched to
    
    def dfs(u: int, visited: List[bool]) -> bool:
        """
        Try to find augmenting path starting from u.
        Returns True if augmenting path found.
        """
        for v in graph[u]:
            if visited[v]:
                continue
            visited[v] = True
            
            # If v is unmatched, or its current match can find another partner
            if match[v] == -1 or dfs(match[v], visited):
                match[v] = u
                return True
        return False
    
    matching_size = 0
    for u in range(n_left):
        visited = [False] * n_right
        if dfs(u, visited):
            matching_size += 1
    
    return matching_size, match
```

### Template 2: Hopcroft-Karp Algorithm

```python
from collections import deque
from typing import List

def hopcroft_karp(graph: List[List[int]], n_left: int, n_right: int) -> int:
    """
    Hopcroft-Karp algorithm for maximum bipartite matching.
    Faster for large sparse graphs: O(E * sqrt(V)).
    
    Args:
        graph: adjacency list
        n_left: number of left vertices
        n_right: number of right vertices
    
    Returns:
        Size of maximum matching
        
    Time: O(E * sqrt(V))
    Space: O(V)
    """
    INF = float('inf')
    pair_u = [-1] * n_left   # pair_u[u] = v matched to u
    pair_v = [-1] * n_right  # pair_v[v] = u matched to v
    dist = [0] * n_left
    
    def bfs() -> bool:
        """Build layering and return True if augmenting path exists."""
        queue = deque()
        for u in range(n_left):
            if pair_u[u] == -1:
                dist[u] = 0
                queue.append(u)
            else:
                dist[u] = INF
        
        found_augmenting = False
        while queue:
            u = queue.popleft()
            for v in graph[u]:
                if pair_v[v] == -1:
                    found_augmenting = True  # Found free vertex on right
                elif dist[pair_v[v]] == INF:
                    dist[pair_v[v]] = dist[u] + 1
                    queue.append(pair_v[v])
        return found_augmenting
    
    def dfs(u: int) -> bool:
        """Find augmenting path using DFS on layered graph."""
        for v in graph[u]:
            pu = pair_v[v]
            if pu == -1 or (dist[pu] == dist[u] + 1 and dfs(pu)):
                pair_u[u] = v
                pair_v[v] = u
                return True
        dist[u] = INF
        return False
    
    matching = 0
    while bfs():
        for u in range(n_left):
            if pair_u[u] == -1:
                if dfs(u):
                    matching += 1
    
    return matching
```

### Template 3: Maximum Invitations (Grid Problem)

```python
def max_invitations(grid: List[List[int]]) -> int:
    """
    LeetCode 1820: Maximum Number of Accepted Invitations.
    
    Args:
        grid: m x n grid where grid[i][j] = 1 if boy i can invite girl j
    
    Returns:
        Maximum number of invitations (maximum bipartite matching)
    """
    m, n = len(grid), len(grid[0])
    
    # Build bipartite graph: boys (0..m-1) -> girls (0..n-1)
    graph = [[] for _ in range(m)]
    for i in range(m):
        for j in range(n):
            if grid[i][j] == 1:
                graph[i].append(j)
    
    matching_size, _ = max_bipartite_matching(graph, m, n)
    return matching_size
```

### Template 4: Bipartite Matching with Vertex Indices

```python
def bipartite_matching_edges(edges: List[Tuple[int, int]], n_left: int, n_right: int) -> List[Tuple[int, int]]:
    """
    Find maximum matching given list of edges.
    
    Args:
        edges: List of (u, v) edges where u in [0, n_left) and v in [0, n_right)
        n_left: number of left vertices
        n_right: number of right vertices
    
    Returns:
        List of matched (u, v) pairs
    """
    # Build adjacency list
    graph = [[] for _ in range(n_left)]
    for u, v in edges:
        graph[u].append(v)
    
    # Find matching
    size, match = max_bipartite_matching(graph, n_left, n_right)
    
    # Reconstruct edge list
    result = []
    for v in range(n_right):
        if match[v] != -1:
            result.append((match[v], v))
    
    return result
```

### Template 5: Check Perfect Matching

```python
def has_perfect_matching(graph: List[List[int]], n: int) -> bool:
    """
    Check if graph has a perfect matching.
    Requires n to be even and bipartite with equal partitions.
    
    Args:
        graph: adjacency list (assumes n/2 left, n/2 right)
        n: total vertices
    
    Returns:
        True if perfect matching exists
    """
    if n % 2 != 0:
        return False
    
    half = n // 2
    size, _ = max_bipartite_matching(graph, half, half)
    return size == half
```

### Template 6: Maximum Bipartite Matching for Worker-Job

```python
def assign_workers_to_jobs(worker_skills: List[List[int]], n_jobs: int) -> Tuple[int, List[int]]:
    """
    Assign workers to jobs they can perform.
    
    Args:
        worker_skills: worker_skills[i] = list of job IDs worker i can do
        n_jobs: total number of jobs
    
    Returns:
        (num_assigned, job_assignments) where job_assignments[job] = worker
    """
    n_workers = len(worker_skills)
    
    # Build graph: workers -> jobs
    graph = [skills[:] for skills in worker_skills]
    
    # Find maximum matching
    num_assigned, match = max_bipartite_matching(graph, n_workers, n_jobs)
    
    return num_assigned, match
```

---

## When to Use

Use Maximum Bipartite Matching when you need to solve problems involving:

- **Job Assignment**: Assigning workers to jobs they can perform
- **Task Scheduling**: Matching tasks to time slots or resources
- **Resource Allocation**: Matching resources to requirements
- **Network Flow**: Maximum flow in unit-capacity networks
- **Bipartite Covering**: Minimum vertex cover, maximum independent set
- **Dance/Matching Problems**: Pairing entities with preferences

### Comparison with Alternatives

| Problem Type | Bipartite Matching | Flow | Greedy |
|-------------|-------------------|------|--------|
| **Unweighted** | Kuhn's O(VE) | Dinic's O(E√V) | Maximal only |
| **Weighted** | Hungarian O(V³) | Min-Cost Max-Flow | Approximation |
| **Perfect Matching** | Check if |M| = |V|/2 | Same | Not applicable |

### When to Choose Each Algorithm

- **Choose Kuhn's** when:
  - Graph is small to medium (V < 1000)
  - Simple implementation needed
  - O(VE) time is acceptable
  - Educational or interview context

- **Choose Hopcroft-Karp** when:
  - Graph is large and sparse
  - Need better asymptotic performance
  - E√V << VE in practice

- **Choose Hungarian** when:
  - Edge weights exist
  - Need maximum weight matching
  - O(V³) is acceptable

- **Choose Max Flow** when:
  - Problem has additional constraints (capacities, costs)
  - Already have flow library

---

## Algorithm Explanation

### Core Concept

Maximum bipartite matching finds the largest set of edges connecting two disjoint vertex sets such that no vertex is included in more than one edge. Kuhn's algorithm repeatedly finds augmenting paths—paths that alternate between unmatched and matched edges, starting and ending at unmatched vertices—to increase the matching size.

### How It Works

#### Step 1: Initialize

Start with empty matching:
```python
match = [-1] * n_right  # All right vertices unmatched
```

#### Step 2: Find Augmenting Paths

For each left vertex, try to find augmenting path:
```python
def dfs(u):
    for v in graph[u]:  # Try each neighbor
        if not visited[v]:
            visited[v] = True
            # If v is free, or its match can find another partner
            if match[v] == -1 or dfs(match[v]):
                match[v] = u  # Augment: match u-v
                return True
    return False
```

#### Step 3: Augment

When augmenting path found, flip edge states:
```
Path: u0 - v0 - u1 - v1 - u2 - v2
Edges: unmatched, matched, unmatched, matched, unmatched

Flip: matched, unmatched, matched, unmatched, matched
Result: Matching size +1
```

### Visual Representation

**Augmenting Path Example:**
```
Before:
  U:  0    1    2
      ↓         ↓
  V:  a -- b    c
      (matched: 0-a, 2-c)

Try to match u=1:
  1 → b (b is matched to 0)
  Try 0 → c (c is matched to 2)
  Try 2 → ? (no more edges)
  Backtrack fails

Actually: 1 → b, move 0 to a? No, 0 already uses a.
Alternative: Check all of 1's neighbors
```

### Why It Works

1. **Augmenting Path Theorem**: A matching is maximum iff no augmenting path exists
2. **Path Flipping**: Augmenting path increases matching by 1
3. **Iterative Improvement**: Keep finding paths until none exist
4. **Correctness**: When algorithm stops, matching is maximum

### Limitations

- **Time Complexity**: O(VE) can be slow for dense graphs
- **Unweighted Only**: For weighted, use Hungarian
- **Bipartite Only**: For general graphs, use Blossom algorithm

---

## Practice Problems

### Problem 1: Maximum Number of Accepted Invitations

**Problem:** [LeetCode 1820 - Maximum Number of Accepted Invitations](https://leetcode.com/problems/maximum-number-of-accepted-invitations/)

**Description:** Grid where boys can invite girls; find maximum invitations.

**How to Apply:**
- Boys = left set, Girls = right set
- Edge if grid[i][j] == 1
- Maximum bipartite matching

---

### Problem 2: Matchsticks to Square

**Problem:** [LeetCode 473 - Matchsticks to Square](https://leetcode.com/problems/matchsticks-to-square/)

**Description:** Form a square using all matchsticks.

**How to Apply:**
- Different approach: backtracking/DP
- Related: subset sum and partitioning

---

### Problem 3: Campus Bikes II

**Problem:** [LeetCode 1066 - Campus Bikes II](https://leetcode.com/problems/campus-bikes-ii/)

**Description:** Assign workers to bikes minimizing total Manhattan distance.

**How to Apply:**
- Weighted bipartite matching
- Use Hungarian algorithm or DP

---

## Video Tutorial Links

### Fundamentals

- [Bipartite Matching - William Fiset](https://www.youtube.com/watch?v=GhjwOiN5S1w) - Algorithm explanation
- [Kuhn's Algorithm - Algorithms](https://www.youtube.com/watch?v=HZhJAdDPSKQ) - Implementation
- [Hopcroft-Karp - Competitive Programming](https://www.youtube.com/watch?v=l8VWWC0G9MG) - Advanced

### Problem Solving

- [Maximum Bipartite Matching - Tushar Roy](https://www.youtube.com/watch?v=6vcBqQcDKoY) - Visual explanation
- [Hungarian Algorithm - GameTheory](https://www.youtube.com/watch?v=dQDZNr7V11w) - Weighted matching

---

## Follow-up Questions

### Q1: What is the difference between Kuhn's and Hopcroft-Karp algorithms?

**Answer:** Both find maximum bipartite matching:
- **Kuhn's**: O(VE), simpler, DFS-based from each left vertex
- **Hopcroft-Karp**: O(E√V), uses BFS layering + DFS, finds multiple augmenting paths per phase
- **Trade-off**: Hopcroft-Karp is faster for large sparse graphs but more complex

---

### Q2: Can maximum bipartite matching solve assignment problems with costs?

**Answer:** Not directly. Maximum matching only considers cardinality (number of edges). For assignment with costs (weights), use the Hungarian algorithm (Kuhn-Munkres) which finds minimum/maximum weight matching in O(V³).

---

### Q3: What is Konig's theorem and how is it related?

**Answer:** Konig's theorem states that in bipartite graphs, the size of the minimum vertex cover equals the size of the maximum matching. This means |max_matching| + |max_independent_set| = |V|, useful for solving related problems.

---

### Q4: How do I model a problem as bipartite matching?

**Answer:** Identify two distinct sets where edges represent valid connections:
1. One set is typically "assignees" (workers, students)
2. Other set is "targets" (jobs, schools)
3. Edge exists if assignment is valid/allowed
4. Maximum matching gives optimal assignment

---

### Q5: What if the graph is not bipartite?

**Answer:** For general (non-bipartite) graphs, use Edmonds' Blossom algorithm for maximum matching. It's more complex (O(V⁴) or O(V³) with optimizations) but works for any graph. Alternatively, model as integer linear programming.

---

## Summary

Maximum Bipartite Matching is a fundamental graph algorithm for assignment and pairing problems. The key takeaways are:

1. **Augmenting Paths**: Key to increasing matching size
2. **Kuhn's Algorithm**: O(VE), simple DFS-based approach
3. **Hopcroft-Karp**: O(E√V), faster for large sparse graphs
4. **Bipartite Modeling**: Many assignment problems reduce to matching
5. **Konig's Theorem**: Relates matching to vertex cover and independent set

**When to Use:**
- Job/worker assignment problems
- Bipartite pairing/assignment
- Resource allocation
- Network flow with unit capacities

**Key Algorithm Pattern:**
```python
for u in left_set:
    visited = [False] * n_right
    if dfs(u, visited):  # Find augmenting path
        matching_size += 1
```

This algorithm is essential for competitive programming and operations research, providing efficient solutions to fundamental assignment problems.
