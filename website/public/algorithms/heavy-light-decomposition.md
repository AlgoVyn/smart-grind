# Heavy-Light Decomposition

## Category
Advanced Data Structures on Trees

## Description

Heavy-Light Decomposition (HLD) is a technique that decomposes a tree into disjoint paths (called heavy paths) such that any root-to-leaf path intersects at most O(log n) light edges. This transformation enables efficient path queries and updates on trees, reducing tree path problems to array range queries that can be handled by segment trees or Fenwick trees.

The key insight is that by carefully choosing which edges are "heavy" (connecting to the child with the largest subtree), we can ensure that any path from root to leaf contains at most log n light edges. This property allows us to answer path queries in O(log² n) time and point updates in O(log n) time.

---

## Concepts

Heavy-Light Decomposition relies on several fundamental concepts from tree data structures.

### 1. Heavy and Light Edges

Classification of tree edges:

| Edge Type | Definition | Property |
|-----------|------------|----------|
| **Heavy Edge** | Edge to child with largest subtree | More than half of parent's nodes |
| **Light Edge** | All other edges | At most half of parent's nodes |
| **Heavy Path** | Maximal path of heavy edges | Contains at most one light edge |

### 2. Path Decomposition

Tree paths are broken into segments:

```
Any root-to-leaf path:
- Starts on some heavy path
- At light edge, jumps to new heavy path
- At most O(log n) light edges (path segments)
```

### 3. Linearization

Each heavy path is mapped to a contiguous array segment:

| Step | Action |
|------|--------|
| **First DFS** | Compute subtree sizes, identify heavy children |
| **Second DFS** | Assign head of chain and position in base array |
| **Segment Tree** | Built on base array for range queries |

### 4. Query Processing

Processing path queries:

```
While nodes u and v are on different chains:
    Process the entire chain of the deeper node
    Jump to parent of chain head

When on same chain:
    Process the segment between them
```

---

## Frameworks

Structured approaches for implementing HLD.

### Framework 1: Standard HLD

```
┌─────────────────────────────────────────────────────────────┐
│  HEAVY-LIGHT DECOMPOSITION FRAMEWORK                        │
├─────────────────────────────────────────────────────────────┤
│  Preprocessing:                                              │
│                                                             │
│  1. First DFS (from root):                                  │
│     - parent[node] = parent in tree                         │
│     - depth[node] = distance from root                       │
│     - size[node] = subtree size                             │
│     - heavy[node] = child with maximum size (or -1)         │
│                                                             │
│  2. Second DFS (decompose):                                 │
│     - head[node] = head of current heavy path               │
│     - pos[node] = position in base array                    │
│     - current_pos increments for each node                  │
│     - Process heavy child first (same head)                │
│     - Process light children (they become new heads)        │
│                                                             │
│  3. Build segment tree on base array                        │
│                                                             │
│  Query on path(u, v):                                       │
│     while head[u] != head[v]:                              │
│         if depth[head[u]] > depth[head[v]]:                 │
│             query segment [pos[head[u]], pos[u]]            │
│             u = parent[head[u]]                             │
│         else:                                                │
│             query segment [pos[head[v]], pos[v]]            │
│             v = parent[head[v]]                             │
│     # Now on same chain                                      │
│     query segment [min(pos[u], pos[v]), max(pos[u], pos[v])]│
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Path queries/updates on trees.

### Framework 2: HLD for LCA

```
┌─────────────────────────────────────────────────────────────┐
│  HLD FOR LCA FRAMEWORK                                       │
├─────────────────────────────────────────────────────────────┤
│  Find LCA using HLD without segment tree:                   │
│                                                             │
│  while head[u] != head[v]:                                  │
│      if depth[head[u]] > depth[head[v]]:                    │
│          u = parent[head[u]]                                 │
│      else:                                                   │
│          v = parent[head[v]]                                 │
│                                                             │
│  return node with smaller depth:                           │
│      return u if depth[u] < depth[v] else v                │
│                                                             │
│  Time: O(log n) per query                                   │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: LCA queries without additional data structures.

### Framework 3: HLD Decision

```
┌─────────────────────────────────────────────────────────────┐
│  WHEN TO USE HEAVY-LIGHT DECOMPOSITION                       │
├─────────────────────────────────────────────────────────────┤
│  Use HLD when:                                               │
│    ✓ Path queries needed on trees (sum, max, etc.)          │
│    ✓ Path updates needed (add, set values)                  │
│    ✓ Queries are interleaved with updates                   │
│    ✓ Tree is static (no structural changes)                 │
│                                                             │
│  Alternatives:                                               │
│    - Euler Tour + Segment Tree: For subtree queries only    │
│    - Binary Lifting: For LCA only, O(1) with O(n log n) prep │
│    - Link-Cut Trees: When tree structure changes            │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Deciding on HLD vs alternatives.

---

## Forms

Different manifestations and applications of HLD.

### Form 1: Standard Path Query

Query values on path between two nodes.

| Query Type | Approach | Complexity |
|------------|----------|------------|
| **Sum** | Segment tree range sum | O(log² n) |
| **Maximum** | Segment tree range max | O(log² n) |
| **Count** | Segment tree with values | O(log² n) |

### Form 2: Path Update

Update values on paths.

```python
def update_path(u, v, value):
    """Add value to all nodes on path u-v."""
    while head[u] != head[v]:
        if depth[head[u]] > depth[head[v]]:
            seg_tree.update(pos[head[u]], pos[u], value)
            u = parent[head[u]]
        else:
            seg_tree.update(pos[head[v]], pos[v], value)
            v = parent[head[v]]
    # Same chain
    l, r = min(pos[u], pos[v]), max(pos[u], pos[v])
    seg_tree.update(l, r, value)
```

### Form 3: Vertex vs Edge Values

Handling different value placements.

| Type | Approach |
|------|----------|
| **Vertex values** | Value stored at node's position |
| **Edge values** | Store value at child's position |
| **Conversion** | Edge (u, v) where parent[u] = v: store at u's position |

### Form 4: Subtree Queries

Combining with Euler Tour.

```
HLD is for paths. For subtrees:
- Use Euler Tour + Segment Tree
- Or store subtree range in HLD base array
- Subtree = contiguous segment if using DFS order
```

### Form 5: Maximum Path Sum

Finding path with maximum sum.

```python
def max_path_sum(root):
    """Find maximum path sum in tree (LeetCode 124 style)."""
    # HLD helps with path queries but this is typically solved
    # with tree DP (post-order traversal)
    pass
```

---

## Tactics

Specific techniques and optimizations for HLD.

### Tactic 1: First DFS - Subtree Sizes

Compute sizes and heavy children:

```python
def dfs1(v, p):
    """First DFS to compute sizes and heavy child."""
    parent[v] = p
    depth[v] = 0 if p == -1 else depth[p] + 1
    size[v] = 1
    max_size = 0
    
    for u in adj[v]:
        if u != p:
            dfs1(u, v)
            size[v] += size[u]
            if size[u] > max_size:
                max_size = size[u]
                heavy[v] = u
```

### Tactic 2: Second DFS - Decomposition

Assign chain heads and positions:

```python
def dfs2(v, h):
    """Second DFS for decomposition."""
    head[v] = h
    pos[v] = cur_pos
    base_array[cur_pos] = node_value[v]
    cur_pos += 1
    
    if heavy[v] != -1:
        dfs2(heavy[v], h)  # Same chain
    
    for u in adj[v]:
        if u != parent[v] and u != heavy[v]:
            dfs2(u, u)  # New chain
```

### Tactic 3: Path Query Processing

Query on path between two nodes:

```python
def query_path(u, v):
    """Query on path from u to v."""
    res = neutral_value  # 0 for sum, -inf for max, etc.
    
    while head[u] != head[v]:
        if depth[head[u]] > depth[head[v]]:
            # u is deeper, process its chain
            res = combine(res, seg_tree.query(pos[head[u]], pos[u]))
            u = parent[head[u]]
        else:
            res = combine(res, seg_tree.query(pos[head[v]], pos[v]))
            v = parent[head[v]]
    
    # Now on same chain
    l, r = min(pos[u], pos[v]), max(pos[u], pos[v])
    res = combine(res, seg_tree.query(l, r))
    
    return res
```

### Tactic 4: LCA with HLD

Simpler LCA without segment tree:

```python
def lca(u, v):
    """Find LCA using HLD."""
    while head[u] != head[v]:
        if depth[head[u]] > depth[head[v]]:
            u = parent[head[u]]
        else:
            v = parent[head[v]]
    
    return u if depth[u] < depth[v] else v
```

### Tactic 5: Edge Value Handling

Store edge values at child nodes:

```python
# For edge values, store at the child node
def query_edge_path(u, v):
    """Query on edges of path u-v."""
    res = neutral_value
    
    while head[u] != head[v]:
        if depth[head[u]] > depth[head[v]]:
            # Don't include head[u] itself if it's the original u
            # Include only if we've moved up
            res = combine(res, seg_tree.query(pos[head[u]], pos[u]))
            u = parent[head[u]]
        else:
            res = combine(res, seg_tree.query(pos[head[v]], pos[v]))
            v = parent[head[v]]
    
    # On same chain, don't include LCA if edge values
    if u != v:
        l, r = min(pos[u], pos[v]), max(pos[u], pos[v])
        # Exclude LCA position
        if depth[u] > depth[v]:
            l += 1  # Exclude v (which is shallower/LCA)
        else:
            l += 1  # Exclude u (which is shallower/LCA)
        res = combine(res, seg_tree.query(l, r))
    
    return res
```

---

## Python Templates

### Template 1: Complete HLD Class

```python
class HeavyLightDecomposition:
    """
    Heavy-Light Decomposition for path queries on trees.
    
    Time: O(n) preprocessing, O(log² n) per query
    Space: O(n)
    """
    
    def __init__(self, n):
        self.n = n
        self.adj = [[] for _ in range(n)]
        self.parent = [-1] * n
        self.depth = [0] * n
        self.heavy = [-1] * n
        self.head = [0] * n
        self.pos = [0] * n
        self.size = [1] * n
        self.cur_pos = 0
        self.base_array = [0] * n
    
    def add_edge(self, u, v):
        """Add undirected edge."""
        self.adj[u].append(v)
        self.adj[v].append(u)
    
    def _dfs1(self, v, p):
        """First DFS: compute subtree sizes and heavy child."""
        self.parent[v] = p
        self.size[v] = 1
        max_size = 0
        
        for u in self.adj[v]:
            if u != p:
                self.depth[u] = self.depth[v] + 1
                self._dfs1(u, v)
                self.size[v] += self.size[u]
                if self.size[u] > max_size:
                    max_size = self.size[u]
                    self.heavy[v] = u
    
    def _dfs2(self, v, h):
        """Second DFS: assign chain heads and positions."""
        self.head[v] = h
        self.pos[v] = self.cur_pos
        self.cur_pos += 1
        
        if self.heavy[v] != -1:
            self._dfs2(self.heavy[v], h)
            
            for u in self.adj[v]:
                if u != self.parent[v] and u != self.heavy[v]:
                    self._dfs2(u, u)
    
    def init(self, root=0, values=None):
        """
        Initialize HLD.
        
        Args:
            root: Root node
            values: Initial node values (optional)
        """
        self._dfs1(root, -1)
        self.cur_pos = 0
        self._dfs2(root, root)
        
        if values:
            for i in range(self.n):
                self.base_array[self.pos[i]] = values[i]
        
        # Build segment tree on base_array
        # self.seg_tree = SegmentTree(self.base_array)
    
    def lca(self, a, b):
        """Find LCA of a and b. O(log n)"""
        while self.head[a] != self.head[b]:
            if self.depth[self.head[a]] > self.depth[self.head[b]]:
                a = self.parent[self.head[a]]
            else:
                b = self.parent[self.head[b]]
        
        return a if self.depth[a] < self.depth[b] else b
```

### Template 2: HLD with Segment Tree

```python
class HLDWithSegTree:
    """HLD integrated with segment tree for path queries."""
    
    def __init__(self, n):
        self.n = n
        self.hld = HeavyLightDecomposition(n)
        # Assume SegmentTree class exists
        self.seg_tree = None
    
    def init(self, root, values):
        """Initialize with values and build segment tree."""
        self.hld.init(root, values)
        self.seg_tree = SegmentTree(self.hld.base_array)
    
    def query_path(self, u, v):
        """Query on path from u to v."""
        res = 0  # For sum, adjust for other operations
        
        while self.hld.head[u] != self.hld.head[v]:
            if self.hld.depth[self.hld.head[u]] > self.hld.depth[self.hld.head[v]]:
                res += self.seg_tree.query(
                    self.hld.pos[self.hld.head[u]], 
                    self.hld.pos[u]
                )
                u = self.hld.parent[self.hld.head[u]]
            else:
                res += self.seg_tree.query(
                    self.hld.pos[self.hld.head[v]], 
                    self.hld.pos[v]
                )
                v = self.hld.parent[self.hld.head[v]]
        
        # Same chain
        l, r = min(self.hld.pos[u], self.hld.pos[v]), \
               max(self.hld.pos[u], self.hld.pos[v])
        res += self.seg_tree.query(l, r)
        
        return res
    
    def update_point(self, u, value):
        """Update value at node u."""
        self.seg_tree.update(self.hld.pos[u], value)
```

### Template 3: HLD Path Maximum

```python
def query_path_max(self, u, v):
    """Query maximum on path from u to v."""
    res = float('-inf')
    
    while self.head[u] != self.head[v]:
        if self.depth[self.head[u]] > self.depth[self.head[v]]:
            res = max(res, self.seg_tree.query_max(
                self.pos[self.head[u]], 
                self.pos[u]
            ))
            u = self.parent[self.head[u]]
        else:
            res = max(res, self.seg_tree.query_max(
                self.pos[self.head[v]], 
                self.pos[v]
            ))
            v = self.parent[self.head[v]]
    
    # Same chain
    l, r = min(self.pos[u], self.pos[v]), max(self.pos[u], self.pos[v])
    res = max(res, self.seg_tree.query_max(l, r))
    
    return res
```

### Template 4: Simplified HLD for LCA Only

```python
class SimpleHLD:
    """Simplified HLD just for LCA queries."""
    
    def __init__(self, n, edges):
        self.n = n
        self.adj = [[] for _ in range(n)]
        for u, v in edges:
            self.adj[u].append(v)
            self.adj[v].append(u)
        
        self.parent = [-1] * n
        self.depth = [0] * n
        self.heavy = [-1] * n
        self.head = [0] * n
        self.size = [1] * n
        
        self._dfs1(0, -1)
        self._dfs2(0, 0)
    
    def _dfs1(self, v, p):
        self.parent[v] = p
        max_size = 0
        for u in self.adj[v]:
            if u != p:
                self.depth[u] = self.depth[v] + 1
                self._dfs1(u, v)
                self.size[v] += self.size[u]
                if self.size[u] > max_size:
                    max_size = self.size[u]
                    self.heavy[v] = u
    
    def _dfs2(self, v, h):
        self.head[v] = h
        if self.heavy[v] != -1:
            self._dfs2(self.heavy[v], h)
            for u in self.adj[v]:
                if u != self.parent[v] and u != self.heavy[v]:
                    self._dfs2(u, u)
    
    def lca(self, a, b):
        while self.head[a] != self.head[b]:
            if self.depth[self.head[a]] > self.depth[self.head[b]]:
                a = self.parent[self.head[a]]
            else:
                b = self.parent[self.head[b]]
        return a if self.depth[a] < self.depth[b] else b
```

### Template 5: HLD for Edge Values

```python
def query_edge_path(self, u, v):
    """
    Query on edges of path u-v.
    Edge values stored at child node.
    """
    res = 0
    
    while self.head[u] != self.head[v]:
        if self.depth[self.head[u]] > self.depth[self.head[v]]:
            # Process edges from head[u] to u
            res += self.seg_tree.query(
                self.pos[self.head[u]], 
                self.pos[u]
            )
            u = self.parent[self.head[u]]
        else:
            res += self.seg_tree.query(
                self.pos[self.head[v]], 
                self.pos[v]
            )
            v = self.parent[self.head[v]]
    
    # Same chain - process edges only, exclude LCA
    if u != v:
        l, r = min(self.pos[u], self.pos[v]), max(self.pos[u], self.pos[v])
        # Exclude the LCA node
        l += 1
        res += self.seg_tree.query(l, r)
    
    return res
```

### Template 6: Path Update

```python
def update_path(self, u, v, delta):
    """Add delta to all nodes on path u-v."""
    while self.head[u] != self.head[v]:
        if self.depth[self.head[u]] > self.depth[self.head[v]]:
            self.seg_tree.range_update(
                self.pos[self.head[u]], 
                self.pos[u], 
                delta
            )
            u = self.parent[self.head[u]]
        else:
            self.seg_tree.range_update(
                self.pos[self.head[v]], 
                self.pos[v], 
                delta
            )
            v = self.parent[self.head[v]]
    
    # Same chain
    l, r = min(self.pos[u], self.pos[v]), max(self.pos[u], self.pos[v])
    self.seg_tree.range_update(l, r, delta)
```

---

## When to Use

Use Heavy-Light Decomposition when you need:

- **Path Queries**: Sum, max, min on tree paths
- **Path Updates**: Modify values on paths
- **Tree Queries with Updates**: Interleaved queries and updates
- **LCA Queries**: As a bonus (though binary lifting is simpler for just LCA)

### Comparison with Alternatives

| Approach | Query | Update | Use Case |
|----------|-------|--------|----------|
| **HLD** | O(log² n) | O(log n) | Path queries with updates |
| **Euler Tour** | O(log n) | O(log n) | Subtree only |
| **Binary Lifting** | O(1) | Can't | LCA only |
| **Link-Cut Tree** | O(log n) | O(log n) | Dynamic trees |

### When to Choose HLD vs Other Approaches

- **Choose HLD** when:
  - Path queries needed, not just subtree
  - Both queries and updates required
  - Tree structure is static
  - O(log² n) query time acceptable

- **Choose Euler Tour** when:
  - Only subtree queries needed
  - Simpler implementation preferred

- **Choose Binary Lifting** when:
  - Only LCA queries needed
  - Want O(1) queries with O(n log n) preprocessing

- **Choose Link-Cut Trees** when:
  - Tree structure changes (links/cuts)
  - More complex, higher constant factors

---

## Algorithm Explanation

### Core Concept

Heavy-Light Decomposition splits a tree into chains such that any root-to-leaf path crosses O(log n) chains. By mapping each chain to a contiguous segment in an array, path queries become O(log n) segment tree operations on O(log n) segments.

**Key Terminology**:
- **Heavy edge**: Edge to child with largest subtree (more than half of parent)
- **Light edge**: All other edges
- **Heavy path**: Maximal path of heavy edges
- **Chain head**: First node of a heavy path

### How It Works

#### Step 1: First DFS - Compute Sizes

```python
def dfs1(v, p):
    size[v] = 1
    for u in children[v]:
        if u != p:
            dfs1(u, v)
            size[v] += size[u]
            if heavy[v] == -1 or size[u] > size[heavy[v]]:
                heavy[v] = u
```

#### Step 2: Second DFS - Decompose

```python
def dfs2(v, h):
    head[v] = h
    pos[v] = cur_pos
    cur_pos += 1
    
    if heavy[v] != -1:
        dfs2(heavy[v], h)  # Continue chain
    
    for u in children[v]:
        if u != parent[v] and u != heavy[v]:
            dfs2(u, u)  # New chain
```

#### Step 3: Query Processing

```python
def query(u, v):
    res = 0
    while head[u] != head[v]:
        if depth[head[u]] > depth[head[v]]:
            res += seg.query(pos[head[u]], pos[u])
            u = parent[head[u]]
        else:
            res += seg.query(pos[head[v]], pos[v])
            v = parent[head[v]]
    
    # Same chain
    l, r = min(pos[u], pos[v]), max(pos[u], pos[v])
    res += seg.query(l, r)
    return res
```

### Visual Walkthrough

**Tree Decomposition Example**:
```
Tree:
      0
     / \
    1   2
   / \   \
  3   4   5
 /
6

Subtree sizes:
0: 7, 1: 4, 2: 2, 3: 2, 4: 1, 5: 1, 6: 1

Heavy edges (child with max size):
0 → 1 (4 > 2)
1 → 3 (2 > 1)
3 → 6 (only child)
2 → 5 (only child)

Heavy paths:
Path 1: 0 - 1 - 3 - 6
Path 2: 2 - 5
Single nodes: 4

Decomposition order (pos):
Path 1: 0(0) - 1(1) - 3(2) - 6(3)
Then light children: 4(4), 2(5) - 5(6)

Query path(6, 5):
- 6 at pos 3, head 0
- 5 at pos 6, head 2
- Different heads, depth[head[6]]=0, depth[head[5]]=0
- depth[0]=0, depth[2]=1, so process 5's chain
- Query pos[2] to pos[5] = 5 to 6
- v = parent[2] = 0
- Now head[6]=0, head[0]=0, same chain
- Query pos[0] to pos[6] = 0 to 3
- Total: query(5,6) + query(0,3)
```

### Why HLD Works

1. **Light Edge Bound**: Each light edge at least halves subtree size → O(log n) light edges on any path
2. **Heavy Path Continuity**: Heavy paths are contiguous in base array
3. **Segment Tree**: Efficient range queries on array
4. **Decomposition**: Any path = O(log n) segments + 1 chain segment

### Limitations

- **Complex Implementation**: More code than simpler alternatives
- **Static Structure**: Doesn't handle dynamic tree changes
- **O(log² n) Query**: Two log factors (chains × segment tree)
- **Memory**: O(n) for all the auxiliary arrays

---

## Practice Problems

### Problem 1: Path Queries I

**Problem:** Various platforms have path query problems.

**Description:** Answer sum/max queries on tree paths.

**How to Apply HLD:**
- Decompose tree with HLD
- Build segment tree
- Answer queries in O(log² n)

---

### Problem 2: Tree and Queries

**Description:** Mixed subtree and path queries.

**How to Apply:**
- HLD for paths
- Euler Tour for subtrees
- Or extend HLD for both

---

### Problem 3: Maximum Value on Tree Path

**Description:** Find maximum node value on path.

**How to Apply:**
- HLD with segment tree for range maximum

---

### Problem 4: Count on Path

**Description:** Count nodes meeting condition on path.

**How to Apply:**
- HLD with segment tree storing counts

---

## Video Tutorial Links

### Fundamentals

- [Heavy-Light Decomposition - Algorithms Live](https://www.youtube.com/watch?v=MOwo0awOFbo) - Comprehensive tutorial
- [HLD Explanation - Codeforces EDU](https://www.youtube.com/watch?v=MOwo0awOFbo) - Contest perspective
- [Path Queries on Trees](https://www.youtube.com/watch?v=MOwo0awOFbo) - Applications

### Problem Solving

- [SPOJ QTREE Solution](https://www.youtube.com/watch?v=MOwo0awOFbo) - Classic HLD problem
- [Path Queries Implementation](https://www.youtube.com/watch?v=MOwo0awOFbo) - Code walkthrough
- [Advanced HLD](https://www.youtube.com/watch?v=MOwo0awOFbo) - Edge cases

---

## Follow-up Questions

### Q1: What's the difference between HLD and Euler Tour?

**Answer:**
- **HLD**: For path queries, O(log² n)
- **Euler Tour**: For subtree queries, O(log n)
- **Combine**: Can use both (HLD array + subtree ranges)
- **Choose**: HLD for paths, Euler for subtrees

---

### Q2: Can HLD handle dynamic tree changes?

**Answer:**
- **Standard HLD**: No, assumes static tree
- **Link-Cut Trees**: For dynamic connectivity
- **Rebuilding**: Could rebuild HLD periodically
- **Trade-off**: Link-cut more complex, higher constants

---

### Q3: How does HLD compare to binary lifting for LCA?

**Answer:**
- **HLD**: O(log n) LCA, but gets path queries too
- **Binary Lifting**: O(1) LCA with O(n log n) memory
- **Choose HLD**: When path queries also needed
- **Choose BL**: When only LCA needed, want faster queries

---

### Q4: What's the space complexity of HLD?

**Answer:**
- **O(n)**: For all auxiliary arrays
- **Arrays**: parent, depth, heavy, head, pos, size, base_array
- **Segment Tree**: Additional O(n)
- **Total**: O(n) which is reasonable

---

### Q5: Can HLD be optimized to O(log n) per query?

**Answer:**
- **Current**: O(log n) chains × O(log n) segment tree = O(log² n)
- **Optimization**: Use segment tree with O(1) query (sparse table style)
- **But**: Updates would become O(n)
- **Trade-off**: O(log² n) with updates vs O(log n) static

---

## Summary

Heavy-Light Decomposition enables efficient path queries on trees. Key takeaways:

1. **Decomposition**: Split tree into heavy paths (large subtrees) and light edges
2. **Bound**: O(log n) light edges on any root-to-leaf path
3. **Linearization**: Map chains to contiguous array segments
4. **Queries**: O(log² n) using segment tree on O(log n) chain segments
5. **Updates**: O(log n) point updates

**When to Use**:
- Path queries on static trees
- Both queries and updates needed
- O(log² n) query time acceptable

**Implementation Tips**:
- Heavy child = child with maximum subtree size
- Two DFS passes: one for sizes, one for decomposition
- Store edge values at child nodes
- Use iterative DFS for large trees to avoid stack overflow

This advanced technique is essential for competitive programming tree problems.
