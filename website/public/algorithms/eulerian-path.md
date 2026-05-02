# Eulerian Path and Circuit

## Category
Graphs & Path Algorithms

## Description

An Eulerian Path is a trail in a finite graph that visits every edge exactly once. An Eulerian Circuit (or Eulerian Cycle) is an Eulerian Path that starts and ends at the same vertex. These concepts, first discussed by Leonhard Euler in 1736 in his famous Seven Bridges of Königsberg problem, form the foundation of graph theory and have numerous practical applications.

The existence of Eulerian paths and circuits depends entirely on the degrees of vertices in the graph. For undirected graphs, an Eulerian circuit exists if and only if every vertex has even degree, while an Eulerian path exists if exactly zero or two vertices have odd degree. This characterization makes it possible to determine feasibility in O(V) time before attempting to construct the path.

---

## Concepts

Eulerian paths rely on fundamental graph theory concepts that determine their existence and construction.

### 1. Degree Conditions

The degree of vertices determines if an Eulerian path exists:

| Graph Type | Circuit Exists | Path Exists | Condition |
|------------|----------------|-------------|-----------|
| **Undirected** | All vertices even | 0 or 2 vertices odd | Connected (ignoring isolated) |
| **Directed** | In-degree = Out-degree | One vertex: out = in + 1<br>One vertex: in = out + 1<br>Others: in = out | Strongly connected |

### 2. Graph Connectivity

Required connectivity properties:

| Property | Requirement | Check |
|----------|-------------|-------|
| **Undirected** | All non-zero degree vertices connected | DFS/BFS from any non-zero vertex |
| **Directed** | All vertices part of single SCC | Kosaraju or Tarjan's algorithm |

### 3. Hierholzer's Algorithm

Efficient algorithm for constructing Eulerian paths:

| Step | Action | Time |
|------|--------|------|
| 1 | Start from valid vertex | O(1) |
| 2 | Follow unused edges until stuck | O(1) per edge |
| 3 | If stuck and edges remain, backtrack | O(1) |
| 4 | Repeat until all edges used | O(E) total |

### 4. Edge Classification

For directed graphs, edges have types:

```
Tree Edge: First time visiting vertex
Back Edge: To ancestor in DFS tree
Forward Edge: To descendant (not tree edge)
Cross Edge: Between non-ancestor-related vertices
```

---

## Frameworks

Structured approaches for finding Eulerian paths and circuits.

### Framework 1: Hierholzer's Algorithm for Undirected Graphs

```
┌─────────────────────────────────────────────────────────────┐
│  HIERHOLZER'S ALGORITHM - UNDIRECTED                        │
├─────────────────────────────────────────────────────────────┤
│  1. Check degree conditions:                                 │
│     - Count odd degree vertices                            │
│     - If 0: circuit possible, start anywhere               │
│     - If 2: path possible, start at odd vertex             │
│     - Otherwise: no Eulerian path exists                     │
│                                                             │
│  2. Check connectivity:                                      │
│     - All non-zero degree vertices must be connected         │
│                                                             │
│  3. Build path:                                             │
│     - Start at appropriate vertex                            │
│     - Use stack for current path                            │
│     - While current vertex has unused edges:                │
│         → Pick any unused edge                             │
│         → Remove edge from graph                           │
│         → Push vertex to stack                             │
│         → Move to adjacent vertex                          │
│                                                             │
│  4. When stuck (no unused edges):                           │
│     → Add vertex to result path                            │
│     → Pop from stack to backtrack                          │
│                                                             │
│  5. Reverse result to get correct order                    │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard undirected Eulerian path problems.

### Framework 2: Hierholzer's Algorithm for Directed Graphs

```
┌─────────────────────────────────────────────────────────────┐
│  HIERHOLZER'S ALGORITHM - DIRECTED                          │
├─────────────────────────────────────────────────────────────┤
│  1. Check balance conditions:                                │
│     - For each vertex: in-degree == out-degree (circuit)   │
│     - Or: one vertex out = in + 1 (start)                  │
│           one vertex in = out + 1 (end)                    │
│           others balanced (path)                           │
│                                                             │
│  2. Check connectivity (all edges in one SCC)               │
│                                                             │
│  3. Build path (similar to undirected):                    │
│     - Follow outgoing edges until stuck                     │
│     - Backtrack using stack                                 │
│                                                             │
│  4. Reverse to get correct order                            │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Directed graph problems (flight itineraries, De Bruijn sequences).

### Framework 3: Decision Framework

```
┌─────────────────────────────────────────────────────────────┐
│  EULERIAN PATH EXISTENCE CHECK                               │
├─────────────────────────────────────────────────────────────┤
│  For Undirected Graph:                                       │
│    Count vertices with odd degree:                         │
│      - 0 vertices: Eulerian circuit exists                  │
│      - 2 vertices: Eulerian path exists (start at odd)    │
│      - Other: No Eulerian path                             │
│                                                             │
│  For Directed Graph:                                        │
│    Check in-degree vs out-degree:                          │
│      - All equal: Eulerian circuit                         │
│      - One (out = in + 1), one (in = out + 1): Path        │
│      - Other: No Eulerian path                             │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Quick feasibility check before algorithm execution.

---

## Forms

Different manifestations and variations of Eulerian path problems.

### Form 1: Eulerian Circuit

Path that starts and ends at same vertex.

| Aspect | Details |
|--------|---------|
| **Requirement** | All vertices have even degree (undirected) or balanced (directed) |
| **Start** | Any vertex |
| **Applications** | Route planning, DNA sequencing |

### Form 2: Eulerian Path

Path that visits every edge exactly once (may not be circuit).

| Aspect | Details |
|--------|---------|
| **Requirement** | Exactly 0 or 2 odd-degree vertices |
| **Start** | Odd-degree vertex (if 2 exist) |
| **End** | Other odd-degree vertex |

### Form 3: Flight Itinerary (Lexical Ordering)

When multiple valid paths exist, choose lexicographically smallest:

| Modification | Implementation |
|--------------|----------------|
| **Priority** | Always visit smallest lexical destination first |
| **Data Structure** | Min-heap or sorted adjacency list |
| **Result** | Lexicographically smallest valid path |

### Form 4: De Bruijn Sequence

Eulerian circuit in De Bruijn graph for sequence construction:

| Application | Use |
|-------------|-----|
| **Genomics** | DNA sequence assembly |
| **Combinatorics** | Universal cycles |
| **Cryptography** | Brute force attacks |

### Form 5: Chinese Postman Problem

Find shortest route visiting every edge (allowing edge repeats):

| Case | Solution |
|------|----------|
| **Eulerian exists** | Use Eulerian circuit |
| **Otherwise** | Find minimum edge duplications to make Eulerian |
| **Algorithm** | Minimum weight perfect matching on odd vertices |

---

## Tactics

Specific techniques and optimizations for Eulerian path problems.

### Tactic 1: Degree Check with Early Exit

Quick feasibility verification:

```python
def has_eulerian_path(n, edges, directed=False):
    """Check if Eulerian path exists without building it."""
    if not directed:
        degree = [0] * n
        for u, v in edges:
            degree[u] += 1
            degree[v] += 1
        
        odd_count = sum(1 for d in degree if d % 2 == 1)
        return odd_count == 0 or odd_count == 2
    else:
        in_deg = [0] * n
        out_deg = [0] * n
        for u, v in edges:
            out_deg[u] += 1
            in_deg[v] += 1
        
        start_nodes = end_nodes = 0
        for i in range(n):
            if out_deg[i] - in_deg[i] == 1:
                start_nodes += 1
            elif in_deg[i] - out_deg[i] == 1:
                end_nodes += 1
            elif in_deg[i] != out_deg[i]:
                return False
        
        return (start_nodes == 0 and end_nodes == 0) or \
               (start_nodes == 1 and end_nodes == 1)
```

### Tactic 2: Hierholzer's with Stack

Iterative implementation:

```python
def hierholzer_iterative(graph, start):
    """Find Eulerian path using iterative Hierholzer's."""
    path = []
    stack = [start]
    
    while stack:
        curr = stack[-1]
        if graph[curr]:  # Has unused edges
            # Pick and remove any edge
            next_vertex = graph[curr].pop()
            # Remove reverse edge for undirected
            if isinstance(graph[next_vertex], list):
                graph[next_vertex].remove(curr)
            stack.append(next_vertex)
        else:
            path.append(stack.pop())
    
    return path[::-1]  # Reverse to get correct order
```

### Tactic 3: Lexicographically Smallest Path

For flight itinerary problems:

```python
from collections import defaultdict

def find_itinerary(tickets):
    """Reconstruct itinerary in lexical order."""
    # Build graph with min-heap behavior
    graph = defaultdict(list)
    for src, dst in tickets:
        graph[src].append(dst)
    
    # Sort destinations in reverse for efficient pop
    for src in graph:
        graph[src].sort(reverse=True)
    
    result = []
    
    def visit(airport):
        while graph[airport]:
            visit(graph[airport].pop())
        result.append(airport)
    
    visit('JFK')
    return result[::-1]
```

### Tactic 4: Connectivity Check

Ensure all non-zero degree vertices are connected:

```python
def is_connected(n, edges, degree):
    """Check if all non-zero degree vertices are connected."""
    # Find starting vertex (any with non-zero degree)
    start = next((i for i in range(n) if degree[i] > 0), 0)
    
    # BFS/DFS
    visited = [False] * n
    stack = [start]
    visited[start] = True
    
    while stack:
        u = stack.pop()
        for v in adj[u]:
            if not visited[v]:
                visited[v] = True
                stack.append(v)
    
    # Check all non-zero degree vertices visited
    return all(visited[i] or degree[i] == 0 for i in range(n))
```

### Tactic 5: Eulerian Path with Edge Tracking

Track which edges have been used:

```python
class EulerianPath:
    def __init__(self, n, edges):
        self.n = n
        self.graph = [[] for _ in range(n)]
        self.used = set()
        
        for i, (u, v) in enumerate(edges):
            self.graph[u].append((v, i))
            self.graph[v].append((u, i))  # Undirected
    
    def find_path(self, start):
        path = []
        stack = [(start, -1)]  # (vertex, edge_id)
        
        while stack:
            u, edge_id = stack[-1]
            
            # Find unused edge
            found = False
            for v, eid in self.graph[u]:
                if eid not in self.used:
                    self.used.add(eid)
                    stack.append((v, eid))
                    found = True
                    break
            
            if not found:
                path.append(u)
                stack.pop()
        
        return path[::-1]
```

---

## Python Templates

### Template 1: Eulerian Path for Undirected Graph

```python
def eulerian_path_undirected(n, edges):
    """
    Find Eulerian path in undirected graph.
    
    Args:
        n: number of vertices
        edges: list of (u, v) tuples
    
    Returns:
        Path as list of vertices, or empty list if no path exists
    
    Time: O(V + E), Space: O(V + E)
    """
    from collections import defaultdict
    
    # Build graph
    graph = defaultdict(list)
    degree = [0] * n
    
    for u, v in edges:
        graph[u].append(v)
        graph[v].append(u)
        degree[u] += 1
        degree[v] += 1
    
    # Check degree condition
    odd_vertices = [i for i in range(n) if degree[i] % 2 == 1]
    if len(odd_vertices) not in [0, 2]:
        return []  # No Eulerian path
    
    # Determine start vertex
    start = odd_vertices[0] if odd_vertices else 0
    
    # Hierholzer's algorithm
    path = []
    stack = [start]
    
    while stack:
        curr = stack[-1]
        if graph[curr]:
            nxt = graph[curr].pop()
            graph[nxt].remove(curr)  # Remove reverse edge
            stack.append(nxt)
        else:
            path.append(stack.pop())
    
    # Check if all edges were used
    if len(path) != len(edges) + 1:
        return []
    
    return path[::-1]
```

### Template 2: Eulerian Path for Directed Graph

```python
def eulerian_path_directed(n, edges):
    """
    Find Eulerian path in directed graph.
    
    Args:
        n: number of vertices
        edges: list of (u, v) tuples
    
    Returns:
        Path as list of vertices, or empty list if no path exists
    """
    from collections import defaultdict
    
    graph = defaultdict(list)
    in_deg = [0] * n
    out_deg = [0] * n
    
    for u, v in edges:
        graph[u].append(v)
        out_deg[u] += 1
        in_deg[v] += 1
    
    # Check balance
    start = 0
    start_nodes = end_nodes = 0
    
    for i in range(n):
        diff = out_deg[i] - in_deg[i]
        if diff == 1:
            start_nodes += 1
            start = i
        elif diff == -1:
            end_nodes += 1
        elif diff != 0:
            return []
    
    if not ((start_nodes == 0 and end_nodes == 0) or 
            (start_nodes == 1 and end_nodes == 1)):
        return []
    
    # Hierholzer's algorithm
    path = []
    stack = [start]
    
    while stack:
        curr = stack[-1]
        if graph[curr]:
            stack.append(graph[curr].pop())
        else:
            path.append(stack.pop())
    
    if len(path) != len(edges) + 1:
        return []
    
    return path[::-1]
```

### Template 3: Reconstruct Itinerary (Flight Path)

```python
from collections import defaultdict

def find_itinerary(tickets):
    """
    Reconstruct flight itinerary in lexical order.
    LeetCode 332.
    
    Time: O(E log E) for sorting, Space: O(V + E)
    """
    # Build graph
    graph = defaultdict(list)
    for src, dst in tickets:
        graph[src].append(dst)
    
    # Sort in reverse for O(1) pop
    for src in graph:
        graph[src].sort(reverse=True)
    
    result = []
    
    def visit(airport):
        while graph[airport]:
            visit(graph[airport].pop())
        result.append(airport)
    
    visit('JFK')
    return result[::-1]
```

### Template 4: Valid Arrangement of Pairs

```python
def valid_arrangement(pairs):
    """
    Find valid arrangement of pairs where adjacent pairs match.
    LeetCode 2097.
    
    Similar to Eulerian path on pair graph.
    """
    from collections import defaultdict
    
    graph = defaultdict(list)
    in_deg = defaultdict(int)
    out_deg = defaultdict(int)
    
    for u, v in pairs:
        graph[u].append(v)
        out_deg[u] += 1
        in_deg[v] += 1
    
    # Find start
    start = pairs[0][0]
    for node in graph:
        if out_deg[node] - in_deg[node] == 1:
            start = node
            break
    
    # Hierholzer's
    path = []
    stack = [start]
    
    while stack:
        curr = stack[-1]
        if graph[curr]:
            stack.append(graph[curr].pop())
        else:
            path.append(stack.pop())
    
    path = path[::-1]
    
    # Convert back to pairs
    result = []
    for i in range(len(path) - 1):
        result.append([path[i], path[i + 1]])
    
    return result
```

### Template 5: De Bruijn Sequence

```python
def debruijn(k, n):
    """
    Generate De Bruijn sequence for alphabet size k and subsequences of length n.
    Uses Eulerian circuit in De Bruijn graph.
    """
    # Use Hierholzer's on De Bruijn graph
    seen = set()
    result = []
    
    def dfs(node):
        for x in range(k):
            edge = node * k + x
            if edge not in seen:
                seen.add(edge)
                dfs((node * k + x) % (k ** (n - 1)))
                result.append(str(x))
    
    dfs(0)
    return '0' * (n - 1) + ''.join(reversed(result))
```

### Template 6: Eulerian Path Existence Check

```python
def check_eulerian(n, edges, directed=False):
    """
    Check if Eulerian path exists without constructing it.
    
    Returns:
        (exists, is_circuit, start_vertex)
    """
    if not directed:
        degree = [0] * n
        for u, v in edges:
            degree[u] += 1
            degree[v] += 1
        
        odd = [i for i in range(n) if degree[i] % 2 == 1]
        
        if len(odd) == 0:
            return (True, True, 0)  # Circuit, start anywhere
        elif len(odd) == 2:
            return (True, False, odd[0])  # Path, start at odd
        else:
            return (False, False, -1)
    else:
        in_deg = [0] * n
        out_deg = [0] * n
        
        for u, v in edges:
            out_deg[u] += 1
            in_deg[v] += 1
        
        start = extra_in = extra_out = 0
        
        for i in range(n):
            diff = out_deg[i] - in_deg[i]
            if diff == 1:
                extra_out += 1
                start = i
            elif diff == -1:
                extra_in += 1
            elif diff != 0:
                return (False, False, -1)
        
        if extra_out == 0 and extra_in == 0:
            return (True, True, 0)
        elif extra_out == 1 and extra_in == 1:
            return (True, False, start)
        else:
            return (False, False, -1)
```

---

## When to Use

Use Eulerian Path algorithms when you need to solve problems involving:

- **Route Planning**: Visit every road/street exactly once
- **Mail/Garbage Collection**: Chinese Postman Problem
- **Flight Itineraries**: Reconstruct valid flight paths
- **DNA Sequencing**: Genome assembly via De Bruijn graphs
- **Puzzle Solving**: Mazes, pen-and-paper puzzles
- **Circuit Design**: Wire routing, PCB design

### Comparison with Alternatives

| Problem | Eulerian Approach | Alternative | When to Use Alternative |
|---------|-------------------|-------------|------------------------|
| **Shortest Path** | N/A | Dijkstra, BFS | When visiting every edge not required |
| **Hamiltonian Path** | N/A | Backtracking, DP | When visiting every vertex required |
| **TSP** | N/A | DP, Approximations | When minimizing total distance |
| **Chinese Postman** | If Eulerian exists | Matching + Eulerian | When edge repetition allowed |

### When to Choose Eulerian vs Hamiltonian

- **Choose Eulerian** when:
  - Must visit every edge exactly once
  - Graph degrees satisfy necessary conditions
  - DNA sequencing, route inspection

- **Choose Hamiltonian** when:
  - Must visit every vertex exactly once
  - No efficient algorithm exists (NP-complete)
  - Using backtracking or approximation

---

## Algorithm Explanation

### Core Concept

Eulerian paths exist based on simple degree conditions. Hierholzer's algorithm constructs such paths efficiently by greedily following edges until stuck, then backtracking to find unexplored edges.

**Key Terminology**:
- **Degree**: Number of edges incident to a vertex
- **Eulerian Circuit**: Path that starts and ends at same vertex, visits every edge once
- **Eulerian Trail**: Path that visits every edge once (different start/end allowed)
- **Balanced**: In-degree equals out-degree (directed graphs)

### How It Works

#### Step 1: Check Degree Conditions

```python
# Undirected: 0 or 2 odd-degree vertices
odd_count = sum(1 for v in vertices if degree[v] % 2 == 1)
if odd_count not in [0, 2]:
    return "No Eulerian path"

# Directed: balanced or one start, one end
for v in vertices:
    if abs(out_deg[v] - in_deg[v]) > 1:
        return "No Eulerian path"
```

#### Step 2: Hierholzer's Algorithm

```python
def hierholzer(graph, start):
    path = []
    stack = [start]
    
    while stack:
        v = stack[-1]
        if graph[v]:  # Has unused edges
            w = graph[v].pop()  # Pick any neighbor
            graph[w].remove(v)  # Remove reverse (undirected)
            stack.append(w)
        else:
            path.append(stack.pop())
    
    return path[::-1]
```

### Visual Walkthrough

**Example Graph**:
```
    0 --- 1
    |     |
    2 --- 3

Edges: (0,1), (0,2), (1,3), (2,3)
All vertices have degree 2 (even) → Eulerian circuit exists

Hierholzer's Execution:
1. Start at 0
2. Stack: [0] → go to 1
3. Stack: [0, 1] → go to 3
4. Stack: [0, 1, 3] → go to 2
5. Stack: [0, 1, 3, 2] → go to 0
6. Stack: [0, 1, 3, 2, 0]
   Now stuck at 0 (no unused edges)
7. Pop 0 to path: path=[0], stack=[0,1,3,2]
8. Pop 2 to path: path=[0,2], stack=[0,1,3]
9. Pop 3 to path: path=[0,2,3], stack=[0,1]
10. Pop 1 to path: path=[0,2,3,1], stack=[0]
11. Pop 0 to path: path=[0,2,3,1,0], stack=[]

Result: 0 → 2 → 3 → 1 → 0
```

### Why Hierholzer's Works

1. **Always Makes Progress**: Follows edges until all local edges exhausted
2. **Backtracking**: Returns to vertices with unexplored edges
3. **Time Optimal**: O(E) time - visits each edge exactly once
4. **Correctness**: When no unused edges remain from a vertex, all its edges are in the path

### Limitations

- **Feasibility Required**: Must satisfy degree conditions first
- **Connectivity Required**: All non-zero degree vertices must be connected
- **One Component**: Graph must be essentially connected
- **No Shortcuts**: Cannot optimize for path length (it's fixed by edge count)

---

## Practice Problems

### Problem 1: Reconstruct Itinerary

**Problem:** [LeetCode 332 - Reconstruct Itinerary](https://leetcode.com/problems/reconstruct-itinerary/)

**Description:** Given airline tickets, find valid itinerary starting from JFK using all tickets exactly once. Return lexical smallest if multiple exist.

**How to Apply Eulerian Path:**
- Directed graph where airports are vertices, tickets are edges
- Find Eulerian path starting at JFK
- Use lexical ordering (min-heap or sorted adjacency)

---

### Problem 2: Valid Arrangement of Pairs

**Problem:** [LeetCode 2097 - Valid Arrangement of Pairs](https://leetcode.com/problems/valid-arrangement-of-pairs/)

**Description:** Given pairs, find arrangement where adjacent pairs share a common element.

**How to Apply Eulerian Path:**
- Each pair is a directed edge
- Find Eulerian path in the graph
- Result is the path converted back to pairs

---

### Problem 3: Cracking the Safe

**Problem:** [LeetCode 753 - Cracking the Safe](https://leetcode.com/problems/cracking-the-safe/)

**Description:** Find shortest string containing all possible n-length combinations of k digits.

**How to Apply Eulerian Path:**
- De Bruijn graph construction
- Find Eulerian circuit
- Result is De Bruijn sequence

---

### Problem 4: Find the Celebrity

**Problem:** [LeetCode 277 - Find the Celebrity](https://leetcode.com/problems/find-the-celebrity/)

**Description:** Find celebrity (known by everyone, knows no one) at party.

**How to Apply:**
- Not exactly Eulerian, but related graph concepts
- Use elimination approach

---

### Problem 5: Couples Holding Hands

**Problem:** [LeetCode 765 - Couples Holding Hands](https://leetcode.com/problems/couples-holding-hands/)

**Description:** Minimize swaps so couples sit together.

**How to Apply:**
- Cycle decomposition in permutation
- Not Eulerian, but graph-based

---

### Problem 6: Minimum Degree of a Connected Trio

**Problem:** [LeetCode 1761 - Minimum Degree of a Connected Trio in a Graph](https://leetcode.com/problems/minimum-degree-of-a-connected-trio-in-a-graph/)

**Description:** Find connected trio (3 nodes all connected) with minimum degree sum.

**How to Apply:**
- Graph analysis problem
- Related to degree concepts

---

## Video Tutorial Links

### Fundamentals

- [Eulerian Path - William Fiset](https://www.youtube.com/watch?v=xR4sGgwtL2E) - Comprehensive explanation
- [Hierholzer's Algorithm - Graph Theory](https://www.youtube.com/watch?v=8MpoO3zL3aI) - Algorithm details
- [Euler and Hamiltonian Paths - MIT OCW](https://www.youtube.com/watch?v=V9Zs5lL9wh4) - Academic perspective

### Problem Solving

- [Reconstruct Itinerary Solution](https://www.youtube.com/watch?v=8MpoO3zL3aI) - LeetCode 332
- [De Bruijn Sequences](https://www.youtube.com/watch?v=8MpoO3zL3aI) - Theory and applications
- [Flight Itinerary Lexical Order](https://www.youtube.com/watch?v=8MpoO3zL3aI) - Implementation

### Applications

- [DNA Sequencing with Eulerian Paths](https://www.youtube.com/watch?v=8MpoO3zL3aI) - Bioinformatics
- [Chinese Postman Problem](https://www.youtube.com/watch?v=8MpoO3zL3aI) - Route optimization
- [Seven Bridges of Königsberg](https://www.youtube.com/watch?v=8MpoO3zL3aI) - Historical context

---

## Follow-up Questions

### Q1: What's the difference between Eulerian and Hamiltonian paths?

**Answer:**
- **Eulerian**: Visit every edge exactly once, vertices can repeat
- **Hamiltonian**: Visit every vertex exactly once, edges determined by path
- **Complexity**: Eulerian has polynomial solution, Hamiltonian is NP-complete
- **Conditions**: Eulerian has simple degree conditions, Hamiltonian has no simple characterization

---

### Q2: Can Hierholzer's algorithm find Hamiltonian paths?

**Answer:**
- **No**: Hierholzer's specifically finds edge-based paths
- **Hamiltonian**: Requires visiting vertices, not edges
- **Different problem**: No efficient algorithm exists for Hamiltonian paths
- **Backtracking**: Hamiltonian paths typically require exponential search

---

### Q3: How do you handle multiple edges between same vertices?

**Answer:**
- **Track edge IDs**: Use unique identifiers for each edge
- **Adjacency list**: Store (neighbor, edge_id) tuples
- **Used edges**: Track by ID rather than just (u,v) pair
- **Removal**: Mark edge as used, don't physically remove for efficiency

---

### Q4: What if the graph has isolated vertices?

**Answer:**
- **Ignore**: Isolated vertices don't affect Eulerian path
- **Connectivity check**: Only check connectivity of non-zero degree vertices
- **Start vertex**: Must have non-zero degree
- **Result**: Isolated vertices won't appear in path

---

### Q5: Can Eulerian paths be found in parallel?

**Answer:**
- **Sequential nature**: Hierholzer's is inherently sequential
- **Parallel exploration**: Could explore different branches in parallel
- **Merge step**: Would require careful merging of partial paths
- **Limited benefit**: O(E) is already optimal, parallelism adds overhead

---

## Summary

Eulerian Path and Circuit algorithms solve the problem of traversing every edge exactly once. Key takeaways:

1. **Degree Conditions**: Check vertex degrees first (0 or 2 odd for undirected path)
2. **Connectivity**: All non-zero degree vertices must be connected
3. **Hierholzer's Algorithm**: O(E) time to construct the path
4. **Applications**: Route planning, DNA sequencing, flight itineraries
5. **Lexical Ordering**: Use sorted adjacency for specific path requirements

**When to Use**:
- Must visit every edge exactly once
- Graph satisfies degree conditions
- DNA sequence assembly
- Optimal route inspection

**Implementation Tips**:
- Always verify degree conditions first
- Check connectivity before running algorithm
- For undirected, remove reverse edges during traversal
- For lexical order, sort adjacency list in reverse

This algorithm is essential for graph theory problems and has practical applications in bioinformatics and logistics.
