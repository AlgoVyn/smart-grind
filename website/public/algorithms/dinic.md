# Dinic's Algorithm (Max Flow)

## Category
Graphs & Network Flow

## Description

Dinic's Algorithm is one of the most efficient algorithms for computing maximum flow in a flow network. Developed by Yefim Dinitz in 1970, it achieves a time complexity of O(V²E) in general cases and O(E√V) for bipartite matching problems. This makes it significantly faster than the Edmonds-Karp algorithm, which runs in O(VE²) time.

The algorithm's key innovation is the use of level graphs and blocking flows. A level graph is constructed using BFS to assign levels to each node based on their distance from the source. Within this level graph, the algorithm finds blocking flows using DFS with current arc optimization. This combination ensures that each iteration makes significant progress toward the maximum flow, reducing the number of augmenting path searches needed.

---

## Concepts

Dinic's algorithm relies on several fundamental concepts that enable its efficiency.

### 1. Flow Network Basics

A flow network consists of directed edges with capacities:

| Concept | Description |
|---------|-------------|
| **Source (s)** | Node where flow originates |
| **Sink (t)** | Node where flow terminates |
| **Capacity** | Maximum flow an edge can carry |
| **Residual Capacity** | Remaining capacity = capacity - current flow |

### 2. Level Graph

BFS constructs a layered structure from the source:

```
Level 0: Source node
Level 1: Nodes reachable directly from source
Level 2: Nodes reachable from Level 1 nodes
...and so on
```

| Property | Meaning |
|----------|---------|
| **level[v]** | Shortest distance from source to v in residual graph |
| **Level Graph** | Only edges from level i to level i+1 |

### 3. Blocking Flow

A flow that saturates at least one edge on every path from source to sink in the level graph:

| Characteristic | Description |
|----------------|-------------|
| **Saturating Edge** | Edge that reaches full capacity |
| **Blocking Property** | No augmenting path exists in current level graph |
| **Efficiency** | Multiple augmentations in one blocking flow computation |

### 4. Current Arc Optimization

The ptr[] array tracks progress to avoid re-scanning edges:

```
ptr[u] = index of next edge to try from node u
When DFS backtracks, we don't revisit already-tried edges
```

---

## Frameworks

Structured approaches for implementing Dinic's algorithm.

### Framework 1: Standard Dinic's Algorithm

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARD DINIC'S ALGORITHM FRAMEWORK                       │
├─────────────────────────────────────────────────────────────┤
│  1. Initialize:                                             │
│     - Build adjacency list with edge capacities             │
│     - Create reverse edges with 0 capacity                  │
│                                                             │
│  2. While BFS can reach sink:                               │
│     a. Build level graph using BFS from source            │
│     b. If sink not reachable: break (max flow found)        │
│     c. Reset ptr[] array for current arc optimization       │
│                                                             │
│  3. While DFS can push flow:                                │
│     a. Find blocking flow using DFS in level graph          │
│     b. Add flow to total                                    │
│     c. Update residual capacities                           │
│                                                             │
│  4. Return total flow                                       │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard max flow problems with moderate-sized graphs.

### Framework 2: Dinic's for Bipartite Matching

```
┌─────────────────────────────────────────────────────────────┐
│  BIPARTITE MATCHING WITH DINIC'S FRAMEWORK                  │
├─────────────────────────────────────────────────────────────┤
│  1. Create flow network:                                      │
│     - Source → Left nodes (capacity 1)                    │
│     - Left → Right edges from input (capacity 1)          │
│     - Right → Sink (capacity 1)                           │
│                                                             │
│  2. Run Dinic's algorithm                                    │
│                                                             │
│  3. Maximum matching = maximum flow                        │
│                                                             │
│  Time: O(E√V) for bipartite matching                        │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Maximum bipartite matching problems.

### Framework 3: Min-Cut Using Max-Flow

```
┌─────────────────────────────────────────────────────────────┐
│  MIN-CUT VIA MAX-FLOW FRAMEWORK                             │
├─────────────────────────────────────────────────────────────┤
│  1. Compute max flow from source to sink                   │
│                                                             │
│  2. Find reachable nodes from source in residual graph:    │
│     - Run BFS/DFS on edges with positive residual capacity │
│                                                             │
│  3. Min-cut edges:                                           │
│     - Edges from reachable to non-reachable nodes           │
│     - Original capacity - residual capacity = flow          │
│                                                             │
│  By Max-Flow Min-Cut Theorem: max flow = min cut capacity │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Network connectivity and partitioning problems.

---

## Forms

Different manifestations and variations of Dinic's algorithm.

### Form 1: Standard Max Flow

Basic implementation for general flow networks.

| Aspect | Details |
|--------|---------|
| **Complexity** | O(V²E) general case |
| **Data Structure** | Adjacency list with edge objects |
| **Key Arrays** | level[], ptr[] |

### Form 2: Unit Capacity Networks

When all edges have capacity 1:

| Optimization | Benefit |
|--------------|---------|
| **Time** | O(E√V) for bipartite matching |
| **Simplification** | No need for complex capacity tracking |
| **Applications** | Matching, edge-disjoint paths |

### Form 3: Scaling Dinic's Algorithm

For graphs with large capacities:

```
1. Start with highest bit of capacity
2. Find blocking flow with current capacity threshold
3. Add lower bits progressively
4. Achieves O(E log C) for capacity C
```

### Form 4: Multi-Source Multi-Sink

Handle multiple sources and sinks:

| Modification | Implementation |
|--------------|----------------|
| **Super Source** | Connect to all sources with infinite capacity |
| **Super Sink** | Connect from all sinks with infinite capacity |
| **Result** | Single source-sink max flow |

### Form 5: Circulation with Demands

When nodes have supply/demand:

| Concept | Approach |
|---------|----------|
| **Node Demands** | Add edge from super source/sink |
| **Feasibility** | Check if all demands can be satisfied |
| **Optimization** | Minimize cost of satisfying demands |

---

## Tactics

Specific techniques and optimizations for Dinic's algorithm.

### Tactic 1: Edge Structure Design

Efficient edge representation for residual graph:

```python
class Edge:
    """Edge with to, rev (reverse edge index), cap."""
    def __init__(self, to, rev, cap):
        self.to = to
        self.rev = rev
        self.cap = cap

class Dinic:
    def __init__(self, n):
        self.n = n
        self.graph = [[] for _ in range(n)]
    
    def add_edge(self, fr, to, cap):
        """Add edge and reverse edge for residual graph."""
        forward = Edge(to, len(self.graph[to]), cap)
        backward = Edge(fr, len(self.graph[fr]), 0)
        self.graph[fr].append(forward)
        self.graph[to].append(backward)
```

### Tactic 2: BFS Level Graph Construction

Build level array efficiently:

```python
def bfs(self, s, t):
    """Build level graph from source."""
    self.level = [-1] * self.n
    self.level[s] = 0
    queue = deque([s])
    
    while queue:
        u = queue.popleft()
        for e in self.graph[u]:
            if e.cap > 0 and self.level[e.to] < 0:
                self.level[e.to] = self.level[u] + 1
                queue.append(e.to)
    
    return self.level[t] >= 0
```

### Tactic 3: DFS with Current Arc Optimization

Efficient blocking flow computation:

```python
def dfs(self, u, t, flow):
    """Find augmenting path with current arc optimization."""
    if u == t:
        return flow
    
    for i in range(self.ptr[u], len(self.graph[u])):
        e = self.graph[u][i]
        
        if e.cap > 0 and self.level[e.to] == self.level[u] + 1:
            pushed = self.dfs(e.to, t, min(flow, e.cap))
            
            if pushed > 0:
                e.cap -= pushed
                self.graph[e.to][e.rev].cap += pushed
                return pushed
        
        self.ptr[u] += 1
    
    return 0
```

### Tactic 4: Scaling for Large Capacities

When capacities are very large:

```python
def max_flow_scaling(self, s, t):
    """Dinic's with capacity scaling."""
    max_cap = max(e.cap for u in range(self.n) for e in self.graph[u])
    
    # Start with highest bit
    delta = 1 << (max_cap.bit_length() - 1)
    
    flow = 0
    while delta > 0:
        # Only consider edges with capacity >= delta
        while self.bfs_with_threshold(s, t, delta):
            self.ptr = [0] * self.n
            while True:
                pushed = self.dfs(s, t, float('inf'))
                if pushed == 0:
                    break
                flow += pushed
        delta >>= 1
    
    return flow
```

### Tactic 5: Handling Disconnected Graphs

Early termination checks:

```python
def max_flow(self, s, t):
    """Max flow with early termination checks."""
    if s == t:
        return 0
    
    total_flow = 0
    
    while self.bfs(s, t):
        self.ptr = [0] * self.n
        
        while True:
            pushed = self.dfs(s, t, float('inf'))
            if pushed == 0:
                break
            total_flow += pushed
    
    return total_flow
```

---

## Python Templates

### Template 1: Edge Class for Dinic's

```python
class Edge:
    """
    Edge class for flow networks with residual tracking.
    
    Attributes:
        to: destination node
        rev: index of reverse edge in graph[to]
        cap: residual capacity
    """
    def __init__(self, to, rev, cap):
        self.to = to
        self.rev = rev
        self.cap = cap
```

### Template 2: Complete Dinic's Implementation

```python
from collections import deque

class Dinic:
    """
    Dinic's Max Flow Algorithm.
    
    Time: O(V²E) general, O(E√V) for bipartite matching
    Space: O(V + E)
    """
    
    def __init__(self, n):
        """Initialize with n nodes (0 to n-1)."""
        self.n = n
        self.graph = [[] for _ in range(n)]
    
    def add_edge(self, fr, to, cap):
        """Add directed edge with given capacity."""
        forward = [to, cap, None]  # [to, cap, rev_index]
        backward = [fr, 0, None]
        forward[2] = len(self.graph[to])
        backward[2] = len(self.graph[fr])
        self.graph[fr].append(forward)
        self.graph[to].append(backward)
    
    def bfs(self, s, t):
        """Build level graph."""
        self.level = [-1] * self.n
        self.level[s] = 0
        queue = deque([s])
        
        while queue:
            u = queue.popleft()
            for v, cap, _ in self.graph[u]:
                if cap > 0 and self.level[v] < 0:
                    self.level[v] = self.level[u] + 1
                    queue.append(v)
        
        return self.level[t] >= 0
    
    def dfs(self, u, t, f):
        """Find blocking flow."""
        if u == t:
            return f
        
        for i in range(self.it[u], len(self.graph[u])):
            self.it[u] = i
            v, cap, rev = self.graph[u][i]
            
            if cap > 0 and self.level[v] == self.level[u] + 1:
                d = self.dfs(v, t, min(f, cap))
                if d > 0:
                    # Update residual capacities
                    self.graph[u][i][1] -= d
                    self.graph[v][rev][1] += d
                    return d
        
        return 0
    
    def max_flow(self, s, t):
        """Compute maximum flow from s to t."""
        flow = 0
        INF = float('inf')
        
        while self.bfs(s, t):
            self.it = [0] * self.n
            while True:
                f = self.dfs(s, t, INF)
                if f == 0:
                    break
                flow += f
        
        return flow
```

### Template 3: Bipartite Matching with Dinic's

```python
def max_bipartite_matching(n_left, n_right, edges):
    """
    Maximum bipartite matching using Dinic's algorithm.
    
    Args:
        n_left: number of nodes in left partition
        n_right: number of nodes in right partition
        edges: list of (u, v) where u in [0, n_left), v in [0, n_right)
    
    Returns:
        Maximum matching size
    """
    # Node IDs: source=0, left=1..n_left, right=1+n_left..n_left+n_right, sink=last
    source = 0
    sink = 1 + n_left + n_right
    n = sink + 1
    
    dinic = Dinic(n)
    
    # Source to left
    for u in range(n_left):
        dinic.add_edge(source, 1 + u, 1)
    
    # Left to right
    for u, v in edges:
        dinic.add_edge(1 + u, 1 + n_left + v, 1)
    
    # Right to sink
    for v in range(n_right):
        dinic.add_edge(1 + n_left + v, sink, 1)
    
    return dinic.max_flow(source, sink)
```

### Template 4: Min-Cut Using Max-Flow

```python
def min_cut(n, edges, source, sink):
    """
    Find min-cut edges using max-flow.
    
    Returns:
        (min_cut_capacity, cut_edges, reachable_from_source)
    """
    # Build flow network
    dinic = Dinic(n)
    for u, v, cap in edges:
        dinic.add_edge(u, v, cap)
    
    # Compute max flow
    max_flow_val = dinic.max_flow(source, sink)
    
    # Find reachable nodes in residual graph
    reachable = [False] * n
    queue = deque([source])
    reachable[source] = True
    
    while queue:
        u = queue.popleft()
        for v, cap, _ in dinic.graph[u]:
            if cap > 0 and not reachable[v]:
                reachable[v] = True
                queue.append(v)
    
    # Find cut edges
    cut_edges = []
    for u in range(n):
        if reachable[u]:
            for v, cap, rev in dinic.graph[u]:
                if not reachable[v] and cap == 0:
                    # Original edge u->v was saturated
                    cut_edges.append((u, v))
    
    return max_flow_val, cut_edges, reachable
```

### Template 5: Multiple Source Multiple Sink

```python
def multi_source_multi_sink_flow(n, edges, sources, sinks):
    """
    Handle multiple sources and sinks by adding super source/sink.
    
    Args:
        n: original number of nodes
        edges: list of (u, v, cap)
        sources: list of source node indices
        sinks: list of sink node indices
    """
    # Add super source and super sink
    super_source = n
    super_sink = n + 1
    n_new = n + 2
    
    dinic = Dinic(n_new)
    
    # Add original edges
    for u, v, cap in edges:
        dinic.add_edge(u, v, cap)
    
    # Connect super source to all sources
    for s in sources:
        dinic.add_edge(super_source, s, float('inf'))
    
    # Connect all sinks to super sink
    for t in sinks:
        dinic.add_edge(t, super_sink, float('inf'))
    
    return dinic.max_flow(super_source, super_sink)
```

### Template 6: Dinic's with Edge Capacities from List

```python
def dinic_from_edge_list(n, edge_list):
    """
    Create Dinic's algorithm instance from edge list.
    
    Args:
        n: number of nodes
        edge_list: list of (u, v, capacity) tuples
    
    Returns:
        Dinic instance ready for max_flow computation
    """
    dinic = Dinic(n)
    
    for u, v, cap in edge_list:
        dinic.add_edge(u, v, cap)
    
    return dinic
```

---

## When to Use

Use Dinic's Algorithm when you need to solve problems involving:

- **Maximum Flow**: Finding the maximum flow in a flow network
- **Bipartite Matching**: Maximum matching in bipartite graphs
- **Min-Cut**: Finding minimum capacity cut in a network
- **Network Connectivity**: Checking edge/vertex connectivity
- **Circulation Problems**: Flow with lower bounds on edges
- **Multi-commodity Flow**: Multiple flow requirements

### Comparison with Alternatives

| Algorithm | Time Complexity | Best For | Limitations |
|-----------|----------------|----------|-------------|
| **Dinic's** | O(V²E) | General max flow, dense graphs | Complex implementation |
| **Edmonds-Karp** | O(VE²) | Simple implementation, sparse graphs | Slower on large graphs |
| **Push-Relabel** | O(V³) | Very dense graphs, unit capacities | Higher constant factor |
| **Capacity Scaling** | O(E² log C) | Large capacities | Extra log factor |

### When to Choose Dinic's vs Other Approaches

- **Choose Dinic's** when:
  - Graph has moderate size (V ≤ 10³, E ≤ 10⁴)
  - Bipartite matching needed
  - Need O(E√V) for unit capacities
  - Want balance of speed and implementation complexity

- **Choose Edmonds-Karp** when:
  - Graph is very sparse
  - Simple implementation preferred
  - V and E are small

- **Choose Push-Relabel** when:
  - Graph is very dense
  - Have access to optimized library implementations
  - Absolute best performance needed

---

## Algorithm Explanation

### Core Concept

Dinic's algorithm repeatedly builds a level graph using BFS and finds blocking flows using DFS. The level graph ensures we only traverse edges that make progress toward the sink, while the blocking flow maximizes the use of each level graph before rebuilding it.

**Key Terminology**:
- **Residual Graph**: Graph showing remaining capacity on each edge
- **Level Graph**: Subgraph with edges only to next level nodes
- **Blocking Flow**: Flow that saturates at least one edge on every path
- **Augmenting Path**: Path from source to sink with available capacity

### How It Works

#### Step 1: Build Level Graph with BFS

```python
def bfs_level_graph(s, t):
    level = [-1] * n
    level[s] = 0
    queue = [s]
    
    while queue:
        u = queue.pop(0)
        for each edge (u, v) with residual capacity > 0:
            if level[v] == -1:
                level[v] = level[u] + 1
                queue.append(v)
    
    return level[t] != -1  # True if sink reachable
```

#### Step 2: Find Blocking Flow with DFS

```python
def dfs_blocking_flow(u, t, flow):
    if u == t:
        return flow
    
    for each edge (u, v) where level[v] == level[u] + 1:
        if edge has residual capacity:
            pushed = dfs_blocking_flow(v, t, min(flow, residual_cap))
            if pushed > 0:
                update_residual_capacities(u, v, pushed)
                return pushed
    
    return 0
```

#### Step 3: Main Algorithm Loop

```python
def max_flow(s, t):
    total_flow = 0
    
    while bfs_level_graph(s, t):
        ptr = [0] * n  # Reset current arc
        
        while True:
            flow = dfs_blocking_flow(s, t, infinity)
            if flow == 0:
                break
            total_flow += flow
    
    return total_flow
```

### Visual Walkthrough

**Example Network**:
```
    0 --10--> 1 --5--> 3 (sink)
    |         |         ^
    10       15        10
    |         |         |
    v         v         |
    2 --10--> 4 --10-----
```

**Level Graph Building**:
```
BFS from source (0):
  Level 0: {0}
  Level 1: {1, 2} (reachable from 0)
  Level 2: {3, 4} (reachable from 1, 2)
  Level 3: {sink} (reachable from 3, 4)

Level Graph (only edges to next level):
  0 -> 1, 0 -> 2
  1 -> 3, 2 -> 4
  4 -> 3 (but 3 and 4 same level, so excluded)
  3 -> sink, 4 -> sink
```

**Blocking Flow**:
```
DFS finds: 0 -> 1 -> 3 -> sink (pushes 5)
           0 -> 2 -> 4 -> sink (pushes 10)
           0 -> 1 (remaining 5) -> ... blocked
           
Some edges saturated, rebuild level graph
```

### Why Dinic's is Efficient

1. **Level Graph Constraint**: DFS only follows edges to next level, preventing cycles
2. **Blocking Flow**: Multiple augmentations per BFS
3. **Current Arc**: Avoids revisiting edges that can't contribute
4. **Complexity Analysis**: Each blocking flow phase takes O(VE), and there are O(V) phases

### Limitations

- **Complex Implementation**: More code than Edmonds-Karp
- **Memory Usage**: Need to store level array and ptr array
- **Not Always Fastest**: Push-relabel can be faster for dense graphs
- **Recursive DFS Risk**: Stack overflow on deep graphs (use iterative DFS)

---

## Practice Problems

### Problem 1: Maximum Invitations

**Problem:** [LeetCode 1820 - Maximum Number of Accepted Invitations](https://leetcode.com/problems/maximum-number-of-accepted-invitations/)

**Description:** Given m boys and n girls, and a matrix where grid[i][j] = 1 means boy i and girl j can be paired. Find the maximum number of pairs that can be formed.

**How to Apply Dinic's:**
- Create bipartite graph: boys on left, girls on right
- Add edge from source to each boy (capacity 1)
- Add edge from each girl to sink (capacity 1)
- Add edges between compatible pairs (capacity 1)
- Maximum flow = maximum matching

---

### Problem 2: Escape The Spreading Fire

**Problem:** [LeetCode 2258 - Escape the Spreading Fire](https://leetcode.com/problems/escape-the-spreading-fire/)

**Description:** You are given a 0-indexed 2D integer array `grid` of size `m x n` representing a field. Each cell can have one of three values: 0 (grass), 1 (fire), 2 (wall). Fire spreads to adjacent grass cells every minute. Find the maximum number of minutes you can wait while still being able to reach the safehouse.

**How to Apply Dinic's:**
- Use binary search on the waiting time
- For each candidate time, check if escape is possible using max flow/min-cut
- Alternatively, use BFS + binary search for simpler implementation
- This problem can also be solved with BFS-based verification

---

### Problem 3: Maximum Students Taking Exam

**Problem:** [LeetCode 1349 - Maximum Students Taking Exam](https://leetcode.com/problems/maximum-students-taking-exam/)

**Description:** Given a `m x n` matrix `seats` representing seats in a classroom, find the maximum number of students that can take an exam such that no two students can cheat (cannot sit adjacent including diagonally).

**How to Apply Dinic's:**
- Model as bipartite matching problem
- Create bipartite graph: split rows into left/right partitions
- Connect compatible seats with edges
- Maximum independent set = total seats - minimum vertex cover = total seats - maximum matching
- Dinic's finds maximum matching efficiently

---

### Problem 4: Minimum Cut to Disconnect Grid

**Problem:** Related to network connectivity problems

**Description:** Find minimum number of cells to block (turn into walls) to prevent reaching from start to destination.

**How to Apply Min-Cut:**
- Create flow network: split each cell into in/out nodes
- Edge from in to out has capacity 1 (cost to block)
- Edges between adjacent cells have infinite capacity
- Min-cut separates source from sink
- Result = minimum cells to block

---

### Problem 5: Maximum Number of People That Can Be in a Grid

**Problem:** Similar to LeetCode 2142 - [related problems on grid connectivity]

**Description:** Given grid with obstacles, find maximum flow of people from entrance to exit.

**How to Apply Dinic's:**
- Model grid as flow network
- Each cell is a node (or split into in/out for capacity)
- Source connects to entrance(s), exit connects to sink
- Edge capacities represent how many people can pass
- Maximum flow = maximum people throughput

---

### Problem 6: Minimum Path Sum with Min-Cut

**Problem:** [LeetCode 1298 - Minimum Cost to Make at Least One Valid Path in a Grid](https://leetcode.com/problems/minimum-cost-to-make-at-least-one-valid-path-in-a-grid/) (related)

**Description:** Find minimum cost to modify grid signs so there's a valid path from start to destination.

**How to Apply Min-Cut:**
- Create node for each cell
- Split cells with capacity = cost to modify
- Connect adjacent cells with infinite capacity
- Min-cut gives minimum modification cost
- Alternative: 0-1 BFS for this specific problem

---

## Video Tutorial Links

### Fundamentals

- [Dinic's Algorithm - William Fiset](https://www.youtube.com/watch?v=M6cm8UfIbsI) - Comprehensive explanation
- [Max Flow Introduction - Abdul Bari](https://www.youtube.com/watch?v=LdOnanfc5TM) - Flow networks basics
- [Network Flow Algorithms - MIT OCW](https://www.youtube.com/watch?v=VYZGlgzr-OrI) - Academic perspective

### Practical Implementation

- [Max Flow Ford-Fulkerson - Tushar Roy](https://www.youtube.com/watch?v=GiN3jRjg5U) - Good visual explanation
- Search for "Dinic Algorithm Implementation Algorithms Live" for coding walkthroughs
- [Maximum Flow Algorithms - William Fiset](https://www.youtube.com/watch?v=3Hw6M1Lfn6s) - Comprehensive max flow series

### Advanced Topics

- [Max Flow Min Cut Theorem](https://www.youtube.com/watch?v=5GjMX8Y2N0) - Theoretical foundation
- [Bipartite Matching via Max Flow](https://www.youtube.com/watch?v=6mwvkJRz82o) - Applications
- [Push-Relabel vs Dinic's](https://www.youtube.com/watch?v=5GjMX8Y2N0) - Algorithm comparison

---

## Follow-up Questions

### Q1: What is the difference between Dinic's and Edmonds-Karp algorithms?

**Answer:** Both find max flow but with different approaches:
- **Edmonds-Karp**: Uses BFS to find shortest augmenting path, O(VE²) time
- **Dinic's**: Uses level graphs and blocking flows, O(V²E) time
- **Key difference**: Dinic's finds multiple augmenting paths per BFS phase, making it faster
- **When to use**: Dinic's for larger graphs, Edmonds-Karp for simpler implementation

---

### Q2: Why do we need reverse edges in the residual graph?

**Answer:** Reverse edges enable flow cancellation:
- If we send 5 units along u->v, we add capacity 5 to reverse edge v->u
- This allows the algorithm to "undo" flow if a better path is found later
- Essential for correctness of max flow algorithms
- Reverse edge capacity represents how much flow can be redirected

---

### Q3: How does the current arc optimization work?

**Answer:** The ptr[] array tracks progress:
- ptr[u] stores the next edge index to try from node u
- When DFS returns from a dead end, we don't retry edges that failed
- This prevents O(E) work per DFS call in worst case
- Critical for achieving O(V²E) bound instead of O(VE²)

---

### Q4: Can Dinic's algorithm handle graphs with negative capacities?

**Answer:** No, Dinic's requires non-negative capacities:
- Negative capacities don't make physical sense in flow networks
- Algorithms that handle negative capacities use different approaches (cycle canceling)
- For min-cost max-flow with negative costs, use specialized algorithms
- Always ensure capacities are non-negative before applying Dinic's

---

### Q5: What is the max-flow min-cut theorem and why is it important?

**Answer:** The theorem states that maximum flow equals minimum cut capacity:
- **Max Flow**: Maximum amount that can be sent from source to sink
- **Min Cut**: Minimum capacity of edges that, when removed, disconnect source from sink
- **Significance**: Provides dual perspective on flow problems
- **Applications**: Network reliability, bipartite matching, image segmentation
- **Proof**: Based on linear programming duality

---

## Summary

Dinic's Algorithm is a powerful max flow algorithm that achieves O(V²E) time complexity using level graphs and blocking flows. Key takeaways:

1. **Level Graph**: BFS builds shortest-path layering from source
2. **Blocking Flow**: DFS finds maximum flow in level graph efficiently
3. **Current Arc Optimization**: ptr[] array prevents redundant work
4. **Applications**: Bipartite matching, min-cut, network connectivity
5. **Time Complexity**: O(V²E) general, O(E√V) for unit capacities

**When to Use Dinic's**:
- Maximum flow problems with moderate-sized graphs
- Bipartite matching (especially efficient)
- Min-cut problems via max-flow min-cut theorem
- Network flow with integer capacities

**Implementation Tips**:
- Use adjacency list with edge objects storing reverse indices
- Always add reverse edges with 0 initial capacity
- Reset ptr[] array after each BFS level graph construction
- Consider capacity scaling for very large capacities

This algorithm is essential for competitive programming and network optimization problems.
