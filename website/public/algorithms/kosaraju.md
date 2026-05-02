# Kosaraju's Algorithm (Strongly Connected Components)

## Category
Graphs

## Description

Kosaraju's Algorithm is an efficient method for finding all Strongly Connected Components (SCCs) in a directed graph using two depth-first search (DFS) passes: first on the original graph to determine processing order, and second on the transposed (reversed) graph to identify components. It provides a simpler implementation compared to Tarjan's algorithm while maintaining the same optimal O(V + E) time complexity.

The algorithm's elegance lies in its two-pass approach. The first DFS on the original graph fills a stack with vertices in order of completion time (post-order). The second DFS processes vertices from this stack in reverse order on the transposed graph—each DFS tree in this pass forms one strongly connected component. This approach naturally produces the SCCs in reverse topological order of the condensation graph.

---

## Concepts

Kosaraju's algorithm is built on fundamental concepts from graph theory.

### 1. Strongly Connected Components

A maximal subgraph where every vertex is reachable from every other vertex:

| Concept | Definition |
|---------|------------|
| **Strongly Connected** | Path exists from u to v AND v to u for all pairs |
| **Component** | Maximal set of strongly connected vertices |
| **Condensation Graph** | DAG formed by contracting each SCC to a single node |
| **Source SCC** | SCC with no incoming edges from other SCCs |

### 2. Transpose Graph

Reversing all edge directions:

| Aspect | Description |
|--------|-------------|
| **Original** | Edge u → v |
| **Transpose** | Edge v → u |
| **Property** | SCCs remain the same in the transpose |
| **Usage** | Second DFS identifies components |

### 3. Post-Order Significance

Why processing order matters:

```
DFS on original graph:
- Finish order pushes vertices to stack
- In transpose, source SCCs become "sinks"
- Processing stack in reverse finds SCCs in topological order
```

### 4. Two-Pass Structure

| Pass | Graph | Purpose | Result |
|------|-------|---------|--------|
| **First** | Original | Fill order stack by finish time | Processing order |
| **Second** | Transpose | Pop from stack, DFS to find SCC | List of SCCs |

---

## Frameworks

Structured approaches for implementing Kosaraju's algorithm.

### Framework 1: Standard Kosaraju's Algorithm

```
┌─────────────────────────────────────────────────────────────┐
│  KOSARAJU'S ALGORITHM FRAMEWORK                               │
├─────────────────────────────────────────────────────────────┤
│  Input: Directed graph as adjacency list, n vertices         │
│  Output: List of strongly connected components             │
│                                                                │
│  PASS 1 - Fill Order Stack:                                  │
│    Initialize: visited = [False] * n, order = []            │
│    For each vertex v from 0 to n-1:                         │
│      If not visited[v]:                                      │
│        DFS1(v):                                             │
│          Mark visited[v] = True                             │
│          For each neighbor u of v:                          │
│            If not visited[u]: DFS1(u)                       │
│          Append v to order (post-order)                      │
│                                                                │
│  PASS 2 - Find SCCs:                                          │
│    Build transpose graph (reverse all edges)               │
│    Reset: visited = [False] * n                             │
│    Initialize: sccs = []                                     │
│    For v in reversed(order):                                  │
│      If not visited[v]:                                      │
│        scc = []                                              │
│        DFS2(v, scc):                                         │
│          Mark visited[v] = True                               │
│          Add v to scc                                         │
│          For each neighbor u in transpose[v]:               │
│            If not visited[u]: DFS2(u, scc)                  │
│        Add scc to sccs                                       │
│                                                                │
│  Return sccs (list of lists, each is one SCC)               │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard SCC finding on directed graphs.

### Framework 2: Condensation Graph Construction

```
┌─────────────────────────────────────────────────────────────┐
│  CONDENSATION GRAPH FRAMEWORK                                 │
├─────────────────────────────────────────────────────────────┤
│  After finding SCCs:                                          │
│    1. Assign component ID to each vertex                    │
│       comp_id[v] = index of SCC containing v               │
│                                                                │
│    2. Build condensation DAG:                                │
│       For each edge u → v in original graph:                │
│         If comp_id[u] != comp_id[v]:                         │
│           Add edge comp_id[u] → comp_id[v] to DAG          │
│                                                                │
│    3. Remove duplicate edges (use set)                       │
│                                                                │
│  Result: DAG where each node represents one SCC              │
│  - Number of nodes = number of SCCs                         │
│  - Edges represent connections between components           │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: When you need the meta-graph of SCCs.

### Framework 3: Kosaraju vs Tarjan Decision

```
┌─────────────────────────────────────────────────────────────┐
│  CHOOSING SCC ALGORITHM                                       │
├─────────────────────────────────────────────────────────────┤
│  Use Kosaraju's when:                                        │
│    ✓ Implementation simplicity is priority                    │
│    ✓ Can store transpose graph (extra O(V+E) space OK)     │
│    ✓ Need SCCs in topological order naturally               │
│    ✓ Two-pass approach is acceptable                         │
│                                                                │
│  Use Tarjan's when:                                          │
│    ✓ Space is constrained (no transpose storage)           │
│    ✓ Need single-pass algorithm                             │
│    ✓ Already familiar with low-link concept                 │
│    ✓ Slightly better cache performance needed               │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Deciding between SCC algorithms.

---

## Forms

Different manifestations of the Kosaraju pattern.

### Form 1: List of SCCs

Standard output format.

| Aspect | Details |
|--------|---------|
| **Return** | List of lists, each inner list is one SCC |
| **Order** | Reverse topological order of condensation DAG |
| **Use Case** | General SCC analysis |

### Form 2: Component ID Array

Map each vertex to its component.

| Aspect | Details |
|--------|---------|
| **Return** | Array where comp[v] = component number |
| **Benefit** | O(1) lookup of which component a vertex belongs to |
| **Use Case** | Condensation graph, component queries |

### Form 3: Count Only

Just return number of SCCs.

| Aspect | Details |
|--------|---------|
| **Return** | Integer count |
| **Optimization** | Don't store SCCs, just count DFS2 calls |
| **Use Case** | Quick connectivity check |

### Form 4: Strong Connectivity Check

Check if entire graph is strongly connected.

| Aspect | Details |
|--------|---------|
| **Return** | Boolean (True if 1 SCC) |
| **Optimization** | Early termination if 2nd SCC found |
| **Use Case** | Connectivity validation |

### Form 5: Condensation DAG

The meta-graph of SCCs.

| Aspect | Details |
|--------|---------|
| **Return** | Adjacency list of component graph |
| **Property** | Always a DAG (no cycles between SCCs) |
| **Use Case** | Topological sort, scheduling, 2-SAT |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Standard Implementation

Complete Kosaraju's implementation:

```python
def kosaraju_scc(graph, n):
    """
    Find all strongly connected components using Kosaraju's algorithm.
    
    Args:
        graph: adjacency list of directed graph
        n: number of vertices
    
    Returns:
        list of SCCs, each SCC is a list of vertices
    """
    visited = [False] * n
    order = []  # Stack by finish time
    
    # First DFS: fill order by finish time
    def dfs1(v):
        visited[v] = True
        for u in graph[v]:
            if not visited[u]:
                dfs1(u)
        order.append(v)
    
    for v in range(n):
        if not visited[v]:
            dfs1(v)
    
    # Build transpose graph
    transpose = [[] for _ in range(n)]
    for v in range(n):
        for u in graph[v]:
            transpose[u].append(v)
    
    # Second DFS on transpose in reverse order
    visited = [False] * n
    sccs = []
    
    def dfs2(v, scc):
        visited[v] = True
        scc.append(v)
        for u in transpose[v]:
            if not visited[u]:
                dfs2(u, scc)
    
    # Process in reverse finish order
    for v in reversed(order):
        if not visited[v]:
            scc = []
            dfs2(v, scc)
            sccs.append(scc)
    
    return sccs
```

### Tactic 2: Count SCCs Only

Memory-efficient if only count needed:

```python
def count_scc(graph, n):
    """Return number of strongly connected components."""
    visited = [False] * n
    order = []
    
    def dfs1(v):
        visited[v] = True
        for u in graph[v]:
            if not visited[u]:
                dfs1(u)
        order.append(v)
    
    for v in range(n):
        if not visited[v]:
            dfs1(v)
    
    # Build transpose
    transpose = [[] for _ in range(n)]
    for v in range(n):
        for u in graph[v]:
            transpose[u].append(v)
    
    # Count components
    visited = [False] * n
    count = 0
    
    def dfs2(v):
        visited[v] = True
        for u in transpose[v]:
            if not visited[u]:
                dfs2(u)
    
    for v in reversed(order):
        if not visited[v]:
            dfs2(v)
            count += 1
    
    return count
```

### Tactic 3: Component ID Mapping

Map each vertex to its SCC:

```python
def kosaraju_with_comp_id(graph, n):
    """
    Returns (sccs, comp_id) where comp_id[v] = component index.
    """
    sccs = kosaraju_scc(graph, n)
    
    # Build component ID array
    comp_id = [-1] * n
    for i, scc in enumerate(sccs):
        for v in scc:
            comp_id[v] = i
    
    return sccs, comp_id
```

### Tactic 4: Strong Connectivity Check

Check if graph is strongly connected:

```python
def is_strongly_connected(graph, n):
    """Graph is strongly connected if there's only 1 SCC."""
    return count_scc(graph, n) == 1
```

### Tactic 5: Build Condensation Graph

Construct the DAG of SCCs:

```python
def build_condensation_graph(graph, n, sccs, comp_id):
    """
    Build condensation DAG from SCCs.
    Returns adjacency list of component graph.
    """
    num_comps = len(sccs)
    dag = [set() for _ in range(num_comps)]
    
    for v in range(n):
        for u in graph[v]:
            if comp_id[v] != comp_id[u]:
                dag[comp_id[v]].add(comp_id[u])
    
    # Convert sets to lists
    return [list(neighbors) for neighbors in dag]
```

---

## Python Templates

### Template 1: Complete Kosaraju's Implementation

```python
def kosaraju_scc(graph: list[list[int]], n: int) -> list[list[int]]:
    """
    Kosaraju's Algorithm for Strongly Connected Components.
    
    Args:
        graph: Adjacency list where graph[v] = list of neighbors
        n: Number of vertices (0 to n-1)
    
    Returns:
        List of SCCs, each SCC is a list of vertices
        SCCs are returned in reverse topological order
        
    Time: O(V + E)
    Space: O(V + E) for transpose graph
    """
    visited = [False] * n
    order = []
    
    # First pass: DFS on original graph to fill order
    def dfs1(v: int):
        visited[v] = True
        for u in graph[v]:
            if not visited[u]:
                dfs1(u)
        order.append(v)  # Post-order
    
    for v in range(n):
        if not visited[v]:
            dfs1(v)
    
    # Build transpose graph (reverse all edges)
    transpose = [[] for _ in range(n)]
    for v in range(n):
        for u in graph[v]:
            transpose[u].append(v)
    
    # Second pass: DFS on transpose in reverse order
    visited = [False] * n
    sccs = []
    
    def dfs2(v: int, scc: list[int]):
        visited[v] = True
        scc.append(v)
        for u in transpose[v]:
            if not visited[u]:
                dfs2(u, scc)
    
    for v in reversed(order):
        if not visited[v]:
            scc = []
            dfs2(v, scc)
            sccs.append(scc)
    
    return sccs
```

### Template 2: Kosaraju with Component IDs

```python
def kosaraju_comp_id(graph: list[list[int]], n: int) -> tuple[list[list[int]], list[int]]:
    """
    Kosaraju's algorithm returning both SCCs and component IDs.
    
    Returns:
        (sccs, comp_id) where comp_id[v] = index of SCC containing v
    """
    # Get SCCs
    sccs = kosaraju_scc(graph, n)
    
    # Build component ID array
    comp_id = [-1] * n
    for i, scc in enumerate(sccs):
        for v in scc:
            comp_id[v] = i
    
    return sccs, comp_id
```

### Template 3: Count SCCs

```python
def count_strongly_connected_components(graph: list[list[int]], n: int) -> int:
    """
    Count the number of strongly connected components.
    
    Time: O(V + E)
    Space: O(V + E)
    """
    visited = [False] * n
    order = []
    
    def dfs1(v: int):
        visited[v] = True
        for u in graph[v]:
            if not visited[u]:
                dfs1(u)
        order.append(v)
    
    for v in range(n):
        if not visited[v]:
            dfs1(v)
    
    # Build transpose
    transpose = [[] for _ in range(n)]
    for v in range(n):
        for u in graph[v]:
            transpose[u].append(v)
    
    # Count components
    visited = [False] * n
    count = 0
    
    def dfs2(v: int):
        visited[v] = True
        for u in transpose[v]:
            if not visited[u]:
                dfs2(u)
    
    for v in reversed(order):
        if not visited[v]:
            dfs2(v)
            count += 1
    
    return count
```

### Template 4: Strong Connectivity Check

```python
def is_strongly_connected(graph: list[list[int]], n: int) -> bool:
    """
    Check if the entire graph is strongly connected.
    
    A graph is strongly connected if there's a path from
    every vertex to every other vertex.
    """
    return count_strongly_connected_components(graph, n) == 1
```

### Template 5: Condensation DAG

```python
def build_condensation_dag(graph: list[list[int]], n: int) -> tuple[list[list[int]], list[int], list[list[int]]]:
    """
    Build the condensation DAG from a directed graph.
    
    Returns:
        (dag, comp_id, sccs) where:
        - dag[i] = list of component neighbors of component i
        - comp_id[v] = component index of vertex v
        - sccs[i] = list of vertices in component i
    """
    # Get SCCs and component IDs
    sccs, comp_id = kosaraju_comp_id(graph, n)
    num_comps = len(sccs)
    
    # Build DAG edges
    dag = [set() for _ in range(num_comps)]
    
    for v in range(n):
        for u in graph[v]:
            if comp_id[v] != comp_id[u]:
                dag[comp_id[v]].add(comp_id[u])
    
    # Convert to list
    dag = [sorted(list(neighbors)) for neighbors in dag]
    
    return dag, comp_id, sccs
```

### Template 6: Kosaraju for 2-SAT

```python
def solve_2sat(n: int, implications: list[tuple[int, int]]) -> list[bool] | None:
    """
    Solve 2-SAT using Kosaraju's algorithm.
    
    Args:
        n: Number of variables (numbered 1 to n)
        implications: List of (a, b) meaning (a → b)
                     Use negative for negation: -1 means NOT x1
    
    Returns:
        Assignment satisfying all clauses, or None if unsatisfiable
    """
    # Build implication graph with 2*n vertices
    # Vertex 2*i = x_i (positive), 2*i+1 = NOT x_i
    def var_index(x: int) -> int:
        """Convert variable to vertex index."""
        if x > 0:
            return 2 * (x - 1)  # x_i at even index
        else:
            return 2 * (-x - 1) + 1  # NOT x_i at odd index
    
    m = 2 * n
    graph = [[] for _ in range(m)]
    
    # Build implication graph
    for a, b in implications:
        u, v = var_index(a), var_index(b)
        graph[u].append(v)
        # Add contrapositive: NOT b → NOT a
        not_b = u ^ 1  # Flip last bit
        not_a = v ^ 1
        graph[not_b].append(not_a)
    
    # Find SCCs
    sccs = kosaraju_scc(graph, m)
    comp_id = [-1] * m
    for i, scc in enumerate(sccs):
        for v in scc:
            comp_id[v] = i
    
    # Check satisfiability: x and NOT x must be in different SCCs
    for i in range(n):
        if comp_id[2*i] == comp_id[2*i+1]:
            return None  # Unsatisfiable
    
    # Build assignment: process SCCs in reverse topological order
    # If x comes before NOT x in this order, set x = True
    assignment = [False] * n
    
    for i in range(n):
        # Component of NOT x should come before x for x = False
        # So if comp_id[x] < comp_id[NOT x], set x = True
        if comp_id[2*i] < comp_id[2*i+1]:
            assignment[i] = True
    
    return assignment
```

---

## When to Use

Use Kosaraju's Algorithm when you need to solve problems involving:

- **Strongly Connected Components**: Finding maximal strongly connected subgraphs
- **Connectivity Analysis**: Understanding the structure of directed graphs
- **Condensation Graphs**: Reducing directed graphs to DAGs
- **2-SAT Problems**: Boolean satisfiability with 2 literals per clause
- **Topological Ordering**: Processing SCCs in dependency order
- **Graph Simplification**: Contracting cycles for easier analysis

### Comparison with Alternatives

| Algorithm | Time | Space | Passes | Complexity | Best For |
|-----------|------|-------|--------|------------|----------|
| **Kosaraju's** | O(V+E) | O(V+E) | 2 | Simpler | Implementation ease |
| **Tarjan's** | O(V+E) | O(V) | 1 | More complex | Space constraints |
| **Gabow's** | O(V+E) | O(V) | 1 | Complex | Advanced applications |
| **Path-Based** | O(V+E) | O(V) | 1 | Moderate | Single-pass needs |

### When to Choose Kosaraju's vs Tarjan's

- **Choose Kosaraju's** when:
  - You prefer simpler, easier-to-remember implementation
  - Extra O(V+E) space for transpose is acceptable
  - Need SCCs in reverse topological order naturally
  - Teaching or learning SCC algorithms

- **Choose Tarjan's** when:
  - Space is at a premium
  - Prefer single-pass algorithm
  - Already familiar with low-link values
  - Slightly better performance is needed

---

## Algorithm Explanation

### Core Concept

A strongly connected component is a maximal subgraph where every vertex is reachable from every other vertex. Kosaraju's algorithm finds all SCCs by exploiting a key insight: if you reverse all edges (transpose), the SCCs remain the same, but the source SCCs become sinks and vice versa.

### How It Works

#### Step 1: First DFS on Original Graph

Traverse the graph and fill a stack with vertices in order of completion (post-order):

```python
def dfs1(v):
    visited[v] = True
    for u in graph[v]:
        if not visited[u]:
            dfs1(u)
    order.append(v)  # Add after visiting all children
```

**Key Insight**: Vertices are added to the stack after all their descendants. This means if there's a path from v to u, v appears after u in the stack (unless they're in the same SCC).

#### Step 2: Build Transpose Graph

Reverse all edge directions:

```python
transpose = [[] for _ in range(n)]
for v in range(n):
    for u in graph[v]:
        transpose[u].append(v)
```

#### Step 3: Second DFS on Transpose

Process vertices in reverse order from the stack:

```python
for v in reversed(order):
    if not visited[v]:
        scc = []
        dfs2(v, scc)  # All reachable vertices form one SCC
        sccs.append(scc)
```

**Why it works**: When we process a vertex v from the stack, all vertices reachable from v in the transpose that haven't been visited yet must be in the same SCC as v. The stack ordering ensures we find SCCs in reverse topological order.

### Visual Walkthrough

**Example Graph:**
```
0 → 1 → 2 → 0 (SCC: {0,1,2})
↓
3 → 4 (SCC: {3,4})
```

**Pass 1 (Original Graph):**
```
DFS from 0:
  0 → 1 → 2 → 0 (cycle, backtrack)
  Order: [2, 1, 0]

DFS from 3:
  3 → 4
  Order: [2, 1, 0, 4, 3]
```

**Transpose:**
```
0 ← 1 ← 2 ← 0
↑
3 ← 4
```

**Pass 2 (Transpose, reverse order: 3, 4, 0, 1, 2):**
```
From 3: Reach {3, 4} → SCC 1
From 0: Reach {0, 2, 1} → SCC 2
```

### Why Kosaraju's Works

1. **Order Matters**: First pass orders vertices by finish time
2. **Transpose Insight**: Reversing edges flips source/sink SCCs
3. **Component Isolation**: Each DFS2 call finds exactly one SCC
4. **Topological Order**: SCCs found in reverse topological order

### Limitations

- **Two passes**: Requires two DFS traversals
- **Transpose storage**: Needs O(V+E) extra space
- **Recursive depth**: May overflow stack on deep graphs (use iterative DFS or increase limit)

---

## Practice Problems

### Problem 1: Course Schedule II

**Problem:** [LeetCode 210 - Course Schedule II](https://leetcode.com/problems/course-schedule-ii/)

**Description:** Given prerequisites, return a valid ordering of courses.

**How to Apply Kosaraju's:**
- Find SCCs (courses in cycles must be taken together)
- Build condensation DAG
- Topological sort the DAG

---

### Problem 2: Sort Items by Groups

**Problem:** [LeetCode 1203 - Sort Items by Groups Respecting Dependencies](https://leetcode.com/problems/sort-items-by-groups-respecting-dependencies/)

**Description:** Sort items respecting both group constraints and dependencies.

**How to Apply Kosaraju's:**
- Use SCCs to identify items that must stay together
- Build condensation graph for both item and group dependencies

---

### Problem 3: Critical Connections in a Network

**Problem:** [LeetCode 1192 - Critical Connections in a Network](https://leetcode.com/problems/critical-connections-in-a-network/)

**Description:** Find bridges in an undirected graph.

**How to Apply:**
- Different algorithm (Tarjan's bridge-finding), but related SCC concepts
- Understanding connectivity helps

---

### Problem 4: Number of Provinces

**Problem:** [LeetCode 547 - Number of Provinces](https://leetcode.com/problems/number-of-provinces/)

**Description:** Find number of connected components in undirected graph.

**How to Apply:**
- Simpler than SCC—use Union-Find or basic DFS
- SCC algorithms work but are overkill

---

## Video Tutorial Links

### Fundamentals

- [Kosaraju's Algorithm - William Fiset](https://www.youtube.com/watch?v=9V3QqhS5zkY) - Visual explanation
- [Strongly Connected Components - MIT OCW](https://www.youtube.com/watch?v=It8T9H0T6zE) - Theoretical foundation
- [Kosaraju vs Tarjan - Algorithms](https://www.youtube.com/watch?v=ZeVhsLwL3pg) - Comparison

### Implementation

- [SCC Implementation - Take U Forward](https://www.youtube.com/watch?v=R6Xfs8D--gk) - Code walkthrough
- [Graph Algorithms - Abdul Bari](https://www.youtube.com/watch?v=7zltboxaLkE) - Comprehensive tutorial

---

## Follow-up Questions

### Q1: What is the difference between Kosaraju's and Tarjan's algorithms?

**Answer:** Both find SCCs in O(V+E) time:
- **Kosaraju's**: Two DFS passes, builds transpose graph, simpler implementation
- **Tarjan's**: Single DFS pass, uses low-link values, no transpose needed
- **Trade-off**: Kosaraju's uses more space but is easier to understand and implement

---

### Q2: Why do we need the transpose graph?

**Answer:** The transpose (reversed edges) ensures that when we process vertices in reverse finish order, each DFS2 call explores exactly one SCC. In the original graph, a source SCC becomes a "sink" in the transpose, isolating it from other SCCs during the second pass.

---

### Q3: Can Kosaraju's algorithm find bridges?

**Answer:** No, bridges are for undirected graphs. Kosaraju's finds strongly connected components in directed graphs. For bridges in undirected graphs, use a modified DFS with low-link values (similar concept to Tarjan's SCC but different implementation).

---

### Q4: What is the condensation graph used for?

**Answer:** The condensation graph (DAG of SCCs) is useful for:
- Topological sorting when cycles exist
- 2-SAT problem solving
- Analyzing hierarchical structure of directed graphs
- Scheduling with cyclic dependencies

---

### Q5: How do I handle large graphs that might cause stack overflow?

**Answer:** Options include:
1. Increase recursion limit: `sys.setrecursionlimit(1000000)`
2. Use iterative DFS with explicit stack instead of recursion
3. Use iterative Kosaraju's implementation
4. Consider using Tarjan's algorithm which can be made iterative more easily

---

## Summary

Kosaraju's Algorithm is an elegant two-pass approach for finding strongly connected components in directed graphs. The key takeaways are:

1. **Two DFS Passes**: Original graph for order, transpose for SCCs
2. **Post-Order Matters**: Finish time determines processing order
3. **Transpose Graph**: Reversing edges isolates components
4. **Simpler than Tarjan**: No low-link values needed
5. **Same Complexity**: O(V+E) time, O(V+E) space

**When to Use Kosaraju's**:
- Finding SCCs in directed graphs
- Building condensation DAGs
- Solving 2-SAT problems
- When implementation simplicity is priority

**Key Insight**:
```
First pass:  Visit all, remember finish order
Transpose:   Flip all edges
Second pass: Process in reverse order, each DFS = one SCC
```

This algorithm is essential for competitive programming and graph analysis, providing a straightforward way to decompose directed graphs into strongly connected components.
