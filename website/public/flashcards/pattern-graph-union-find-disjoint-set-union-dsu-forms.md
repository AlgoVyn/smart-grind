## Union-Find (Disjoint Set Union - DSU): Forms

What are the different variations and applications of Union-Find?

<!-- front -->

---

### Form 1: Connected Component Counting

Count the number of connected components in a graph.

```python
def count_components(n, edges):
    """
    LeetCode 323 - Number of Connected Components in an Undirected Graph
    """
    uf = UnionFind(n)
    
    for u, v in edges:
        uf.union(u, v)
    
    return uf.get_count()


# Variation: Count provinces (same pattern)
def find_circle_num(is_connected):
    """
    LeetCode 547 - Number of Provinces
    is_connected: adjacency matrix
    """
    n = len(is_connected)
    uf = UnionFind(n)
    
    for i in range(n):
        for j in range(i + 1, n):  # Only upper triangle
            if is_connected[i][j]:
                uf.union(i, j)
    
    return uf.get_count()
```

**Key pattern:** Initialize with n components, decrement on successful union.

---

### Form 2: Cycle Detection (Redundant Connection)

Find the edge that creates a cycle in a graph.

```python
def find_redundant_connection(edges):
    """
    LeetCode 684 - Redundant Connection
    Return the edge that can be removed to make a tree.
    """
    n = len(edges)
    uf = UnionFind(n + 1)  # 1-indexed nodes
    
    for u, v in edges:
        if uf.connected(u, v):
            return [u, v]  # This edge creates cycle
        uf.union(u, v)
    
    return []


# Variation: Return last edge if multiple redundant
def find_redundant_directed(edges):
    """
    LeetCode 685 - Redundant Connection II (directed)
    More complex: need to detect cycle AND node with two parents
    """
    n = len(edges)
    parent = list(range(n + 1))
    
    # Find node with two parents
    candidate1 = candidate2 = -1
    for u, v in edges:
        if parent[v] != v:  # v already has a parent
            candidate1, candidate2 = parent[v], u
            break
        parent[v] = u
    
    # Use Union-Find to check for cycle
    uf = UnionFind(n + 1)
    for u, v in edges:
        if u == candidate1 and v == edges[candidate1 - 1][1]:
            continue  # Skip candidate1
        if uf.connected(u, v):
            return [u, v] if candidate1 == -1 else [candidate1, edges[candidate1-1][1]]
        uf.union(u, v)
    
    return [candidate1, edges[candidate1-1][1]] if candidate1 != -1 else []
```

**Key pattern:** If `connected(u, v)` before union, edge `(u,v)` creates cycle.

---

### Form 3: Valid Tree Check

Verify if a graph is a valid tree (connected, no cycles, exactly n-1 edges).

```python
def valid_tree(n, edges):
    """
    LeetCode 261 - Graph Valid Tree
    """
    # Condition 1: Exactly n-1 edges
    if len(edges) != n - 1:
        return False
    
    # Condition 2: All nodes connected (no cycles possible with n-1 edges if connected)
    uf = UnionFind(n)
    for u, v in edges:
        uf.union(u, v)
    
    return uf.get_count() == 1


# Alternative: Explicit cycle detection
def valid_tree_with_cycle_check(n, edges):
    if len(edges) != n - 1:
        return False
    
    uf = UnionFind(n)
    for u, v in edges:
        if uf.connected(u, v):  # Cycle detected
            return False
        uf.union(u, v)
    
    return True
```

**Key pattern:** Tree iff (n-1 edges) AND (all connected) AND (no cycles).

---

### Form 4: Equation Validation (Equality/Satisfiability)

Check if a set of equations is consistent.

```python
def equations_possible(equations):
    """
    LeetCode 990 - Satisfiability of Equality Equations
    equations: ["a==b", "b!=c", ...]
    """
    uf = UnionFind(26)  # 26 lowercase letters
    
    # First pass: process all equality equations
    for eq in equations:
        if eq[1] == '=':  # "a==b"
            a, b = ord(eq[0]) - ord('a'), ord(eq[3]) - ord('a')
            uf.union(a, b)
    
    # Second pass: check all inequality equations
    for eq in equations:
        if eq[1] == '!':  # "a!=b"
            a, b = ord(eq[0]) - ord('a'), ord(eq[3]) - ord('a')
            if uf.connected(a, b):  # Contradiction!
                return False
    
    return True


# Variation: Evaluate division (weighted Union-Find)
def calc_equation(equations, values, queries):
    """
    LeetCode 399 - Evaluate Division
    a/b = 2.0, b/c = 3.0 → a/c = 6.0
    """
    from collections import defaultdict
    
    # Map variables to indices
    gid = defaultdict(lambda: len(gid))
    for a, b in equations:
        gid[a]
        gid[b]
    
    n = len(gid)
    uf = UnionFind(n)
    weight = [1.0] * n  # weight[x] = value from x to its parent
    
    def find(x):
        if uf.parent[x] != x:
            orig_parent = uf.parent[x]
            uf.parent[x] = find(uf.parent[x])
            weight[x] *= weight[orig_parent]
        return uf.parent[x]
    
    def union(x, y, value):
        # x/y = value
        root_x, root_y = find(x), find(y)
        if root_x != root_y:
            # Make root_x parent of root_y
            # weight[x] / weight[y] = value
            uf.parent[root_y] = root_x
            weight[root_y] = weight[x] / (weight[y] * value)
    
    # Process equations
    for (a, b), val in zip(equations, values):
        x, y = gid[a], gid[b]
        union(x, y, val)
    
    # Answer queries
    result = []
    for a, b in queries:
        if a not in gid or b not in gid:
            result.append(-1.0)
            continue
        x, y = gid[a], gid[b]
        if find(x) != find(y):
            result.append(-1.0)
        else:
            result.append(weight[y] / weight[x])
    
    return result
```

---

### Form 5: Accounts Merge (Equivalence Grouping)

Group entities by equivalence relation.

```python
def accounts_merge(accounts):
    """
    LeetCode 721 - Accounts Merge
    Merge accounts that share at least one email.
    """
    email_to_id = {}
    email_to_name = {}
    
    # Assign ID to each unique email
    for account in accounts:
        name = account[0]
        for email in account[1:]:
            email_to_name[email] = name
            if email not in email_to_id:
                email_to_id[email] = len(email_to_id)
    
    # Union emails in same account
    uf = UnionFind(len(email_to_id))
    for account in accounts:
        first_id = email_to_id[account[1]]
        for email in account[2:]:
            uf.union(first_id, email_to_id[email])
    
    # Group by root
    from collections import defaultdict
    root_to_emails = defaultdict(list)
    for email, id in email_to_id.items():
        root = uf.find(id)
        root_to_emails[root].append(email)
    
    # Format result
    return [[email_to_name[emails[0]]] + sorted(emails) 
            for emails in root_to_emails.values()]


# Variation: Similar string groups
def num_similar_groups(strs):
    """
    LeetCode 839 - Similar String Groups
    Group strings that are similar (swap two chars).
    """
    def similar(a, b):
        diff = sum(c1 != c2 for c1, c2 in zip(a, b))
        return diff == 2 or diff == 0
    
    n = len(strs)
    uf = UnionFind(n)
    
    for i in range(n):
        for j in range(i + 1, n):
            if similar(strs[i], strs[j]):
                uf.union(i, j)
    
    return uf.get_count()
```

---

### Form 6: Grid Island Counting (2D to 1D)

Count islands in a 2D grid using Union-Find.

```python
def num_islands_uf(grid):
    """
    LeetCode 200 - Number of Islands (Union-Find version)
    """
    if not grid or not grid[0]:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    uf = UnionFind(rows * cols)
    
    # Convert (r, c) to index: r * cols + c
    def index(r, c):
        return r * cols + c
    
    # Union adjacent land cells
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                # Check right and down neighbors (avoid duplicates)
                for dr, dc in [(0, 1), (1, 0)]:
                    nr, nc = r + dr, c + dc
                    if nr < rows and nc < cols and grid[nr][nc] == '1':
                        uf.union(index(r, c), index(nr, nc))
    
    # Count unique roots for land cells
    roots = set()
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                roots.add(uf.find(index(r, c)))
    
    return len(roots)
```

**Key pattern:** Convert 2D coordinates to 1D index with `r * cols + c`.

---

### Form 7: Kruskal's MST

Find Minimum Spanning Tree using Union-Find.

```python
def minimum_spanning_tree(n, edges):
    """
    Kruskal's algorithm for MST.
    edges: [(u, v, weight), ...]
    """
    # Sort by weight
    edges.sort(key=lambda x: x[2])
    
    uf = UnionFind(n)
    mst_weight = 0
    mst_edges = []
    
    for u, v, w in edges:
        if not uf.connected(u, v):  # No cycle
            uf.union(u, v)
            mst_weight += w
            mst_edges.append((u, v))
            
            if len(mst_edges) == n - 1:
                break
    
    return mst_weight


# Variation: Min Cost to Connect All Points
def min_cost_connect_points(points):
    """
    LeetCode 1584 - Min Cost to Connect All Points
    Connect all points with minimum total Manhattan distance.
    """
    n = len(points)
    
    # Generate all edges with Manhattan distance
    edges = []
    for i in range(n):
        for j in range(i + 1, n):
            dist = abs(points[i][0] - points[j][0]) + abs(points[i][1] - points[j][1])
            edges.append((dist, i, j))
    
    edges.sort()
    
    uf = UnionFind(n)
    total_cost = 0
    edges_used = 0
    
    for dist, u, v in edges:
        if uf.union(u, v):  # Returns True if merged
            total_cost += dist
            edges_used += 1
            if edges_used == n - 1:
                break
    
    return total_cost
```

---

### Form 8: Dynamic Island Counting

Track island count as water cells are filled (Number of Islands II).

```python
def num_islands2(m, n, positions):
    """
    LeetCode 305 - Number of Islands II
    Return island count after each land addition.
    """
    uf = UnionFind(m * n)
    grid = [[0] * n for _ in range(m)]
    result = []
    islands = 0
    
    def index(r, c):
        return r * n + c
    
    for r, c in positions:
        if grid[r][c] == 1:
            result.append(islands)
            continue
        
        grid[r][c] = 1
        islands += 1
        
        # Check all 4 neighbors
        for dr, dc in [(-1,0), (1,0), (0,-1), (0,1)]:
            nr, nc = r + dr, c + dc
            if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:
                if uf.union(index(r, c), index(nr, nc)):
                    islands -= 1  # Two islands merged
        
        result.append(islands)
    
    return result
```

---

### Form Comparison Table

| Form | Input | Output | Key Pattern |
|------|-------|--------|-------------|
| Component count | n, edges | Integer count | Track `count` variable |
| Cycle detection | edges | Edge creating cycle | Check `connected()` first |
| Valid tree | n, edges | Boolean | n-1 edges + 1 component |
| Equation validation | equations | Boolean consistent | Equalities first, then check inequalities |
| Accounts merge | List of [name, emails...] | Merged accounts | Map to indices, union shared |
| Grid islands | 2D grid | Island count | 2D→1D index conversion |
| MST | n, weighted edges | Min total weight | Sort edges, union if not connected |
| Dynamic islands | m, n, positions | Count after each | Increment on add, decrement on merge |

<!-- back -->
