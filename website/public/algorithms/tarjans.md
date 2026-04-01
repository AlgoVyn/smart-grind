# Tarjan's Algorithm

## Category
Graph Algorithms

## Description

Tarjan's Algorithm (1972) finds all **Strongly Connected Components (SCCs)** in a directed graph in **O(V + E)** time using a single DFS traversal. A Strongly Connected Component is a maximal set of vertices where every vertex can reach every other vertex in the set through directed paths.

This algorithm is fundamental for understanding graph structure, detecting cycles, and solving problems involving directed graphs. It uses the innovative **low-link value** concept to identify SCC roots during a single depth-first search, making it more memory-efficient than alternatives like Kosaraju's algorithm which requires two passes and graph reversal.

---

## Concepts

### 1. Strongly Connected Components

An SCC is a maximal subgraph where every vertex is reachable from every other vertex.

| Property | Description |
|----------|-------------|
| **Maximal** | Cannot add any more vertices and maintain the property |
| **Reachability** | For all u, v in SCC: u → v path exists |
| **Condensation** | Contracting SCCs creates a Directed Acyclic Graph (DAG) |

### 2. Discovery Time vs Low-Link Value

| Value | Definition | Purpose |
|-------|------------|---------|
| **disc[v]** | When vertex v was first discovered in DFS | Tracks visitation order |
| **low[v]** | Minimum discovery time reachable from v's subtree | Identifies SCC roots |

When `disc[v] == low[v]`, vertex `v` is the root of an SCC.

### 3. DFS Stack

The algorithm maintains an explicit stack during DFS:
- Vertices are pushed when first visited
- Vertices are popped when an SCC is identified
- The `onStack` array tracks current stack membership

### 4. Back Edges and Cross Edges

| Edge Type | Description | Effect on low[] |
|-----------|-------------|-----------------|
| **Tree Edge** | First visit to unvisited vertex | Updates via recursion |
| **Back Edge** | Edge to ancestor on DFS stack | `low[v] = min(low[v], disc[w])` |
| **Cross Edge** | Edge to completed SCC | Ignored (not on stack) |

---

## Frameworks

### Framework 1: Standard Tarjan's Algorithm

```
┌─────────────────────────────────────────────────────────┐
│  TARJAN'S SCC FRAMEWORK                                   │
├─────────────────────────────────────────────────────────┤
│  1. Initialize: disc[] = -1, low[] = 0, onStack[] = false │
│  2. For each unvisited vertex v:                         │
│     a. Call strongconnect(v)                             │
│  3. In strongconnect(v):                                 │
│     a. Set disc[v] = low[v] = current_index++            │
│     b. Push v to stack, mark onStack[v] = true           │
│     c. For each neighbor w:                              │
│        - If disc[w] == -1: recurse, update low[v]        │
│        - Else if onStack[w]: low[v] = min(low[v], disc[w])│
│     d. If disc[v] == low[v]:                             │
│        - Pop stack until v, forming one SCC               │
│  4. Return all SCCs                                       │
└─────────────────────────────────────────────────────────┘
```

**When to use**: Finding all SCCs in a directed graph with O(V + E) complexity.

### Framework 2: Condensation Graph Construction

```
┌─────────────────────────────────────────────────────────┐
│  CONDENSATION GRAPH FRAMEWORK                             │
├─────────────────────────────────────────────────────────┤
│  1. Find all SCCs using Tarjan's algorithm                │
│  2. Assign each vertex to its SCC index                  │
│  3. Build new graph where:                               │
│     - Each SCC becomes a single node                    │
│     - Edges between different SCCs become DAG edges     │
│  4. Result: Directed Acyclic Graph of SCCs              │
│                                                           │
│  Use case: Topological ordering of cyclic graphs         │
└─────────────────────────────────────────────────────────┘
```

---

## Forms

### Form 1: Recursive Implementation

Standard recursive DFS approach. Clean and intuitive but may hit recursion depth limits on very large graphs.

| Aspect | Details |
|--------|---------|
| **Time** | O(V + E) |
| **Space** | O(V) for recursion stack + O(V) for data structures |
| **Pros** | Clean, easy to understand |
| **Cons** | Recursion depth limit on deep graphs |

### Form 2: Iterative Implementation

Uses explicit stack to avoid recursion depth issues.

| Aspect | Details |
|--------|---------|
| **Time** | O(V + E) |
| **Space** | O(V) for explicit stack |
| **Pros** | Handles deep graphs, no recursion limit |
| **Cons** | More complex to implement |

### Form 3: Kosaraju's Algorithm (Alternative)

Two-pass approach using graph reversal.

| Aspect | Tarjan's | Kosaraju's |
|--------|----------|------------|
| **Passes** | 1 | 2 |
| **Graph Storage** | Original only | Original + reversed |
| **Implementation** | Slightly complex | Simpler |
| **Space** | Less (no reverse graph) | More (stores reverse) |

---

## Tactics

### Tactic 1: Finding Single SCC Containing Target

```python
def find_scc_containing(graph, target):
    """Find only the SCC containing a specific vertex."""
    sccs = tarjan_scc(graph)
    for scc in sccs:
        if target in scc:
            return scc
    return None
```

**Use case**: When you only care about one specific component, not all SCCs.

### Tactic 2: Cycle Detection Using SCCs

```python
def has_cycle(graph):
    """Check if directed graph has any cycle."""
    sccs = tarjan_scc(graph)
    # If any SCC has size > 1, there's a cycle
    return any(len(scc) > 1 for scc in sccs)
```

### Tactic 3: Longest Cycle Detection

```python
def longest_cycle_length(graph):
    """Find length of longest cycle in graph."""
    sccs = tarjan_scc(graph)
    max_cycle = 0
    for scc in sccs:
        if len(scc) > 1:
            max_cycle = max(max_cycle, len(scc))
    return max_cycle if max_cycle > 0 else -1
```

### Tactic 4: Dependency Resolution

```python
def find_circular_dependencies(dependencies):
    """
    Find circular dependencies in a dependency graph.
    Returns list of SCCs with size > 1 (cycles).
    """
    # Build graph from dependencies
    graph = build_graph(dependencies)
    sccs = tarjan_scc(graph)
    return [scc for scc in sccs if len(scc) > 1]
```

---

## Python Templates

### Template 1: Basic Tarjan's SCC

```python
from typing import List

def tarjan_scc(n: int, edges: List[List[int]]) -> List[List[int]]:
    """
    Find all strongly connected components in a directed graph.
    
    Args:
        n: Number of vertices (0 to n-1)
        edges: List of directed edges [from, to]
    
    Returns:
        List of SCCs, each SCC is a list of vertices
    
    Time: O(V + E), Space: O(V)
    """
    # Build adjacency list
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
    
    disc = [-1] * n  # Discovery times
    low = [0] * n    # Low-link values
    on_stack = [False] * n
    stack = []
    index = [0]  # Mutable counter
    sccs = []
    
    def strongconnect(v: int):
        disc[v] = low[v] = index[0]
        index[0] += 1
        stack.append(v)
        on_stack[v] = True
        
        for w in graph[v]:
            if disc[w] == -1:
                strongconnect(w)
                low[v] = min(low[v], low[w])
            elif on_stack[w]:
                low[v] = min(low[v], disc[w])
        
        # If v is root of SCC
        if low[v] == disc[v]:
            scc = []
            while True:
                w = stack.pop()
                on_stack[w] = False
                scc.append(w)
                if w == v:
                    break
            sccs.append(scc)
    
    for v in range(n):
        if disc[v] == -1:
            strongconnect(v)
    
    return sccs
```

### Template 2: Tarjan's with Component IDs

```python
def tarjan_scc_with_ids(n: int, edges: List[List[int]]) -> tuple:
    """
    Find SCCs and return component ID for each vertex.
    
    Returns:
        (sccs, comp_id) where comp_id[v] = component index of vertex v
    """
    sccs = tarjan_scc(n, edges)
    comp_id = [-1] * n
    
    for i, scc in enumerate(sccs):
        for v in scc:
            comp_id[v] = i
    
    return sccs, comp_id


def build_condensation_graph(n: int, edges: List[List[int]]) -> tuple:
    """
    Build condensation graph (DAG of SCCs).
    
    Returns:
        (condensation_edges, sccs, comp_id)
    """
    sccs, comp_id = tarjan_scc_with_ids(n, edges)
    num_sccs = len(sccs)
    
    # Build edges between components
    cond_edges = set()
    for u, v in edges:
        cu, cv = comp_id[u], comp_id[v]
        if cu != cv:
            cond_edges.add((cu, cv))
    
    return list(cond_edges), sccs, comp_id
```

### Template 3: Kosaraju's Algorithm (Alternative)

```python
def kosaraju_scc(n: int, edges: List[List[int]]) -> List[List[int]]:
    """
    Find SCCs using Kosaraju's two-pass algorithm.
    Simpler but requires storing reversed graph.
    
    Time: O(V + E), Space: O(V + E)
    """
    # Build graph and reversed graph
    graph = [[] for _ in range(n)]
    rev = [[] for _ in range(n)]
    
    for u, v in edges:
        graph[u].append(v)
        rev[v].append(u)
    
    visited = [False] * n
    order = []
    
    # First DFS: find exit order
    def dfs1(v: int):
        visited[v] = True
        for w in graph[v]:
            if not visited[w]:
                dfs1(w)
        order.append(v)
    
    for v in range(n):
        if not visited[v]:
            dfs1(v)
    
    # Second DFS on reversed graph
    visited = [False] * n
    sccs = []
    
    def dfs2(v: int, component: List[int]):
        visited[v] = True
        component.append(v)
        for w in rev[v]:
            if not visited[w]:
                dfs2(w, component)
    
    for v in reversed(order):
        if not visited[v]:
            component = []
            dfs2(v, component)
            sccs.append(component)
    
    return sccs
```

### Template 4: Cycle Detection Only

```python
def has_cycle_directed(n: int, edges: List[List[int]]) -> bool:
    """
    Check if directed graph has any cycle using Tarjan's concept.
    Returns True if cycle exists, False otherwise.
    """
    graph = [[] for _ in range(n)]
    for u, v in edges:
        graph[u].append(v)
    
    # 0 = unvisited, 1 = visiting, 2 = done
    state = [0] * n
    
    def dfs(v: int) -> bool:
        state[v] = 1  # Currently visiting
        
        for w in graph[v]:
            if state[w] == 1:  # Back edge found
                return True
            if state[w] == 0 and dfs(w):
                return True
        
        state[v] = 2  # Done
        return False
    
    for v in range(n):
        if state[v] == 0:
            if dfs(v):
                return True
    
    return False
```

---

## When to Use

Use Tarjan's Algorithm when you need to solve problems involving:

- **Cycle Detection**: Finding cycles in directed graphs
- **Graph Decomposition**: Breaking a directed graph into SCCs
- **Dependency Resolution**: Detecting circular dependencies
- **2-SAT Problems**: Solving boolean satisfiability
- **Web Analysis**: PageRank and network analysis

### Comparison with Alternatives

| Algorithm | Time | Space | Passes | Use Case |
|-----------|------|-------|--------|----------|
| **Tarjan's** | O(V+E) | O(V) | 1 | Single-pass efficiency |
| **Kosaraju's** | O(V+E) | O(V+E) | 2 | Simpler implementation |
| **Path-based** | O(V+E) | O(V) | 1 | In-place, no recursion |
| **Union-Find** | O(V+E) | O(V) | 1 | Undirected graphs only |

### When to Choose Tarjan's vs Kosaraju

- **Choose Tarjan's** when:
  - Memory efficiency is important
  - You want single-pass traversal
  - Building condensation graph

- **Choose Kosaraju's** when:
  - Simpler code is preferred
  - Graph reversal is already available
  - Teaching/learning SCCs

---

## Algorithm Explanation

### Core Concept

The key insight is the **low-link value**: the minimum discovery time reachable from a vertex's DFS subtree. When `disc[v] == low[v]`, no vertex outside `v`'s subtree can reach into it, making `v` the root of a strongly connected component.

### How It Works

1. **DFS Traversal**: Perform DFS from unvisited vertices
2. **Assign Values**: Set `disc[v] = low[v] = current_time`
3. **Update Low-Link**: For each neighbor:
   - If unvisited: recurse, then `low[v] = min(low[v], low[neighbor])`
   - If on stack: `low[v] = min(low[v], disc[neighbor])` (back edge)
4. **Identify SCC**: When `disc[v] == low[v]`, pop stack until `v` to form SCC

### Visual Representation

```
Graph: 0 → 1 → 2 → 0 (cycle)
       ↓
       3 → 4

DFS Execution:

Step 1: Visit 0 (disc=0, low=0)
        Stack: [0]
        
Step 2: Visit 1 (disc=1, low=1)
        Stack: [0, 1]
        
Step 3: Visit 2 (disc=2, low=2)
        Stack: [0, 1, 2]
        
Step 4: From 2, edge to 0 (on stack)
        low[2] = min(2, 0) = 0
        
Step 5: Return to 1
        low[1] = min(1, low[2]) = 0
        
Step 6: Return to 0
        low[0] = min(0, low[1]) = 0
        
Step 7: disc[0] == low[0], pop SCC: {0, 1, 2}
        
Step 8: Visit 3, then 4 (each forms own SCC)
```

### Why It Works

- **Back edges** indicate cycles (vertices reachable from descendants)
- **Low-link tracking** captures the earliest reachable ancestor
- **Stack membership** distinguishes active DFS path from completed components
- **Single pass** works because all SCC information is captured during DFS

### Limitations

- **Recursion depth**: May overflow for very deep graphs (use iterative version)
- **Directed only**: For undirected graphs, use Union-Find or simple DFS
- **Static graph**: Cannot handle dynamic updates efficiently

---

## Practice Problems

### Problem 1: Course Schedule II

**Problem:** [LeetCode 210 - Course Schedule II](https://leetcode.com/problems/course-schedule-ii/)

**Description:** There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you must take course `bi` first if you want to take course `ai`. Return the ordering of courses you should take to finish all courses.

**How to Apply Tarjan's:**
- Build dependency graph from prerequisites
- Use SCC detection to find circular dependencies
- If any SCC has size > 1, return empty (impossible)
- Otherwise, topological sort on condensation graph

---

### Problem 2: Critical Connections in a Network

**Problem:** [LeetCode 1192 - Critical Connections in a Network](https://leetcode.com/problems/critical-connections-in-a-network/)

**Description:** There are `n` servers numbered from `0` to `n-1` connected by undirected server-to-server connections forming a network where connections[i] = [a, b] represents a connection between servers `a` and `b`. Any server can reach any other server directly or indirectly through the network. A critical connection is a connection that, if removed, will make some server unable to reach some other server. Return all critical connections in any order.

**How to Apply Tarjan's:**
- Adapt Tarjan's algorithm for bridges (undirected version)
- Use similar low-link concept to find edges that disconnect the graph
- An edge (u, v) is critical if low[v] > disc[u]

---

### Problem 3: Longest Cycle in a Graph

**Problem:** [LeetCode 2360 - Longest Cycle in a Graph](https://leetcode.com/problems/longest-cycle-in-a-graph/)

**Description:** You are given a directed graph of `n` nodes numbered from `0` to `n - 1`, where each node has at most one outgoing edge. The graph is represented with a given 0-indexed array `edges` of size `n`, indicating that there is a directed edge from node `i` to node `edges[i]`. If there is no outgoing edge from node `i`, then `edges[i] == -1`. Return the length of the longest cycle in the graph. If no cycle exists, return `-1`.

**How to Apply Tarjan's:**
- Find all SCCs using Tarjan's algorithm
- Each SCC with size > 1 contains a cycle
- The largest SCC size gives the answer

---

### Problem 4: Find Eventual Safe States

**Problem:** [LeetCode 802 - Find Eventual Safe States](https://leetcode.com/problems/find-eventual-safe-states/)

**Description:** There is a directed graph of `n` nodes with each node labeled from `0` to `n - 1`. The graph is represented by a 0-indexed 2D integer array `graph` where `graph[i]` is an integer array of nodes adjacent to node `i`, meaning there is an edge from node `i` to each node in `graph[i]`. A node is a terminal node if there are no outgoing edges. A node is a safe node if every possible path starting from that node leads to a terminal node. Return an array containing all the safe nodes of the graph.

**How to Apply Tarjan's:**
- Nodes in cycles are unsafe
- Use SCC detection: nodes in SCCs with size > 1 are unsafe
- Nodes that can reach unsafe nodes are also unsafe

---

### Problem 5: Redundant Connection II

**Problem:** [LeetCode 685 - Redundant Connection II](https://leetcode.com/problems/redundant-connection-ii/)

**Description:** In this problem, a rooted tree is a directed graph such that, there is exactly one node (the root) for which all other nodes are descendants of this node, plus every node has exactly one parent, except for the root node which has no parents. The given input is a directed graph that started as a rooted tree with `n` nodes (with distinct values `1, 2, ..., n`), with one additional directed edge added. Return an edge that can be removed so that the result is a rooted tree of `n` nodes.

**How to Apply Tarjan's:**
- Use cycle detection to find the extra edge
- The graph has one cycle; find and break it
- Tarjan's helps identify which edge is part of the cycle

---

## Video Tutorial Links

### Fundamentals

- [Tarjan's Algorithm - Strongly Connected Components (Take U Forward)](https://www.youtube.com/watch?v=6kT0m0Uf2SM)
- [Tarjan's Algorithm Explained (WilliamFiset)](https://www.youtube.com/watch?v=tyonrF4E7sE)
- [SCC in Directed Graphs (NeetCode)](https://www.youtube.com/watch?v=z1lQPSx0Ui8)

### Comparison and Advanced

- [Kosaraju vs Tarjan's Algorithm](https://www.youtube.com/watch?v=VCdNuZbQ6yo)
- [Strongly Connected Components - All Methods](https://www.youtube.com/watch?v=XxB7-aJuj6s)
- [2-SAT using SCC](https://www.youtube.com/watch?v=0nMNuE18QyM)

### Competitive Programming

- [Tarjan's Algorithm for CP (Codeforces)](https://www.youtube.com/watch?v=8M6wSsC1xSk)
- [Graph Algorithms for Interviews](https://www.youtube.com/watch?v=2gA3Ezm3POk)

---

## Follow-up Questions

### Q1: What is the difference between Tarjan's and Kosaraju's algorithm?

**Answer:** Both find SCCs in O(V + E) time but differ in approach:
- **Tarjan's**: Single DFS pass using low-link values, more memory efficient
- **Kosaraju's**: Two DFS passes, requires reversed graph, simpler to understand
- **Tarjan is preferred** for single-pass efficiency; **Kosaraju** for simplicity

### Q2: How does the low-link value work?

**Answer:** The low-link value of a vertex is the minimum discovery time reachable from that vertex through zero or more tree edges followed by at most one back edge. When `disc[v] == low[v]`, the vertex is the root of an SCC because no vertex outside can reach into its subtree.

### Q3: Can Tarjan's algorithm handle disconnected graphs?

**Answer:** Yes. The algorithm runs `strongconnect()` from each unvisited vertex in the main loop, naturally handling disconnected graphs. Each DFS call finds SCCs within that connected component.

### Q4: What is the condensation graph?

**Answer:** The condensation graph is the DAG formed by contracting each SCC into a single vertex. It preserves the reachability properties of the original graph while eliminating cycles. Useful for topological ordering and understanding graph structure.

### Q5: When should I use Tarjan's vs Union-Find?

**Answer:** 
- **Tarjan's**: For directed graphs, finding SCCs, cycle detection in digraphs
- **Union-Find**: For undirected graphs, connected components, Kruskal's MST
- Union-Find cannot handle directed graphs; Tarjan's is specifically for directed graphs

---

## Summary

Tarjan's Algorithm is a foundational graph algorithm for finding **Strongly Connected Components** in **O(V + E)** time with **O(V)** space.

**Key Takeaways:**
- **Single-pass efficiency**: One DFS finds all SCCs
- **Low-link values**: Core concept enabling SCC detection
- **Stack-based**: Uses explicit stack for tracking DFS path
- **Versatile**: Cycle detection, 2-SAT, dependency resolution

**When to use:**
- Finding cycles in directed graphs
- Detecting circular dependencies
- Building condensation DAGs
- 2-SAT problems

**When NOT to use:**
- Undirected graphs (use Union-Find)
- Very deep graphs without iterative version
- Dynamic graphs (requires rebuilding)
