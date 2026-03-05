# Graph - Union-Find (Disjoint Set Union - DSU)

## Problem Description

Union-Find (Disjoint Set Union - DSU) is a data structure for efficiently managing connectivity between elements in a dynamic graph. It supports union operations (connecting components) and find operations (checking if elements are connected) with near-constant time complexity using path compression and union by rank/size optimizations.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(α(n)) ≈ O(1) amortized per operation |
| Space Complexity | O(n) for parent and rank arrays |
| Input | Dynamic connectivity queries, edge additions |
| Output | Connected components, cycle detection |
| Approach | Tree-based with path compression |

### When to Use

- Track connected components dynamically
- Solve connectivity problems with union operations
- Implement Kruskal's algorithm for MST
- Detect cycles in undirected graphs
- Check if two elements are in same set
- Connected component counting and merging

## Intuition

The key insight is to represent each set as a tree, where the root is the set representative, and use path compression to flatten the tree during lookups.

The "aha!" moments:

1. **Tree representation**: Each set is a tree with root as representative
2. **Path compression**: Flatten tree during find for future speedup
3. **Union by rank**: Attach smaller tree to larger tree for balance
4. **Amortized O(1)**: Near-constant time per operation with optimizations
5. **Dynamic connectivity**: Efficiently handle incremental connections

## Solution Approaches

### Approach 1: Union-Find with Path Compression and Union by Rank ✅ Recommended

#### Algorithm

1. Initialize parent array where each node is its own parent
2. Initialize rank array (all zeros)
3. **Find(x)**: 
   - If parent[x] != x, recursively find and compress path
   - Return parent[x]
4. **Union(x, y)**:
   - Find roots of x and y
   - If same root, already connected
   - Otherwise, attach smaller rank tree to larger rank tree
   - If ranks equal, increment rank of new root
5. **Connected(x, y)**: Check if find(x) == find(y)

#### Implementation

````carousel
```python
class UnionFind:
    """
    Union-Find with path compression and union by rank.
    Time: O(α(n)) per operation, Space: O(n)
    """
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.count = n  # Number of components
    
    def find(self, x):
        """Find with path compression."""
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        """Union by rank."""
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            return False  # Already connected
        
        # Attach smaller tree to larger tree
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
        
        self.count -= 1
        return True
    
    def connected(self, x, y):
        """Check if x and y are in the same set."""
        return self.find(x) == self.find(y)
    
    def get_count(self):
        """Return number of connected components."""
        return self.count


def count_components(n, edges):
    """Count connected components after adding edges."""
    uf = UnionFind(n)
    for u, v in edges:
        uf.union(u, v)
    return uf.get_count()


def find_redundant_connection(edges):
    """
    LeetCode 684 - Redundant Connection
    Find edge that creates a cycle.
    """
    n = len(edges)
    uf = UnionFind(n + 1)
    
    for u, v in edges:
        if uf.connected(u, v):
            return [u, v]
        uf.union(u, v)
    
    return []


# Alternative: Union by Size (often more intuitive)
class UnionFindBySize:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
        self.count = n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            return False
        
        # Attach smaller tree to larger tree
        if self.size[root_x] < self.size[root_y]:
            root_x, root_y = root_y, root_x
        
        self.parent[root_y] = root_x
        self.size[root_x] += self.size[root_y]
        self.count -= 1
        return True
    
    def get_size(self, x):
        return self.size[self.find(x)]
```
<!-- slide -->
```cpp
class UnionFind {
private:
    vector<int> parent;
    vector<int> rank;
    int count;

public:
    UnionFind(int n) {
        parent.resize(n);
        rank.resize(n, 0);
        count = n;
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }
    
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    bool unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        
        if (rootX == rootY) return false;
        
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        
        count--;
        return true;
    }
    
    bool connected(int x, int y) {
        return find(x) == find(y);
    }
    
    int getCount() {
        return count;
    }
};

class Solution {
public:
    vector<int> findRedundantConnection(vector<vector<int>>& edges) {
        int n = edges.size();
        UnionFind uf(n + 1);
        
        for (auto& edge : edges) {
            int u = edge[0], v = edge[1];
            if (uf.connected(u, v)) {
                return edge;
            }
            uf.unite(u, v);
        }
        
        return {};
    }
};
```
<!-- slide -->
```java
class UnionFind {
    private int[] parent;
    private int[] rank;
    private int count;
    
    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        count = n;
        for (int i = 0; i < n; i++) {
            parent[i] = i;
        }
    }
    
    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    public boolean union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        
        if (rootX == rootY) return false;
        
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        
        count--;
        return true;
    }
    
    public boolean connected(int x, int y) {
        return find(x) == find(y);
    }
    
    public int getCount() {
        return count;
    }
}

class Solution {
    public int[] findRedundantConnection(int[][] edges) {
        int n = edges.length;
        UnionFind uf = new UnionFind(n + 1);
        
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            if (uf.connected(u, v)) {
                return edge;
            }
            uf.union(u, v);
        }
        
        return new int[0];
    }
}
```
<!-- slide -->
```javascript
class UnionFind {
    constructor(n) {
        this.parent = Array.from({length: n}, (_, i) => i);
        this.rank = new Array(n).fill(0);
        this.count = n;
    }
    
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }
    
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX === rootY) return false;
        
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
        
        this.count--;
        return true;
    }
    
    connected(x, y) {
        return this.find(x) === this.find(y);
    }
    
    getCount() {
        return this.count;
    }
}

/**
 * @param {number[][]} edges
 * @return {number[]}
 */
function findRedundantConnection(edges) {
    const n = edges.length;
    const uf = new UnionFind(n + 1);
    
    for (const [u, v] of edges) {
        if (uf.connected(u, v)) {
            return [u, v];
        }
        uf.union(u, v);
    }
    
    return [];
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(α(n)) per operation - Inverse Ackermann, effectively constant |
| Space | O(n) - Parent and rank arrays |

### Approach 2: Union-Find with Additional Features

Extended implementation with component tracking and custom data.

#### Implementation

````carousel
```python
class AdvancedUnionFind:
    """
    Union-Find with additional features:
    - Track component size
    - Support for custom node data
    - Batch initialization
    """
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
        self.count = n
        self.max_size = 1
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            return False
        
        # Union by size - always attach smaller to larger
        if self.size[root_x] < self.size[root_y]:
            root_x, root_y = root_y, root_x
        
        self.parent[root_y] = root_x
        self.size[root_x] += self.size[root_y]
        self.max_size = max(self.max_size, self.size[root_x])
        self.count -= 1
        return True
    
    def get_component_size(self, x):
        return self.size[self.find(x)]
    
    def get_max_component_size(self):
        return self.max_size
    
    def get_components(self):
        """Return list of components as sets."""
        components = {}
        for i in range(len(self.parent)):
            root = self.find(i)
            if root not in components:
                components[root] = set()
            components[root].add(i)
        return list(components.values())


def accounts_merge(accounts):
    """
    LeetCode 721 - Accounts Merge
    Merge accounts based on common emails.
    """
    email_to_id = {}
    email_to_name = {}
    
    # Assign ID to each unique email
    id_counter = 0
    for account in accounts:
        name = account[0]
        for email in account[1:]:
            email_to_name[email] = name
            if email not in email_to_id:
                email_to_id[email] = id_counter
                id_counter += 1
    
    # Union emails in same account
    uf = UnionFind(id_counter)
    for account in accounts:
        first_id = email_to_id[account[1]]
        for email in account[2:]:
            uf.union(first_id, email_to_id[email])
    
    # Group emails by root
    from collections import defaultdict
    root_to_emails = defaultdict(list)
    for email, id in email_to_id.items():
        root = uf.find(id)
        root_to_emails[root].append(email)
    
    # Format result
    result = []
    for emails in root_to_emails.values():
        name = email_to_name[emails[0]]
        result.append([name] + sorted(emails))
    
    return result
```
<!-- slide -->
```cpp
class AdvancedUnionFind {
private:
    vector<int> parent;
    vector<int> size;
    int count;
    int maxSize;

public:
    AdvancedUnionFind(int n) {
        parent.resize(n);
        size.resize(n, 1);
        for (int i = 0; i < n; i++) parent[i] = i;
        count = n;
        maxSize = 1;
    }
    
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    bool unite(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        if (rootX == rootY) return false;
        
        if (size[rootX] < size[rootY]) swap(rootX, rootY);
        parent[rootY] = rootX;
        size[rootX] += size[rootY];
        maxSize = max(maxSize, size[rootX]);
        count--;
        return true;
    }
    
    int getComponentSize(int x) {
        return size[find(x)];
    }
    
    int getMaxComponentSize() {
        return maxSize;
    }
};
```
<!-- slide -->
```java
class AdvancedUnionFind {
    private int[] parent;
    private int[] size;
    private int count;
    private int maxSize;
    
    public AdvancedUnionFind(int n) {
        parent = new int[n];
        size = new int[n];
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            size[i] = 1;
        }
        count = n;
        maxSize = 1;
    }
    
    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);
        }
        return parent[x];
    }
    
    public boolean union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        if (rootX == rootY) return false;
        
        if (size[rootX] < size[rootY]) {
            int temp = rootX;
            rootX = rootY;
            rootY = temp;
        }
        parent[rootY] = rootX;
        size[rootX] += size[rootY];
        maxSize = Math.max(maxSize, size[rootX]);
        count--;
        return true;
    }
    
    public int getComponentSize(int x) {
        return size[find(x)];
    }
    
    public int getMaxComponentSize() {
        return maxSize;
    }
}
```
<!-- slide -->
```javascript
class AdvancedUnionFind {
    constructor(n) {
        this.parent = Array.from({length: n}, (_, i) => i);
        this.size = new Array(n).fill(1);
        this.count = n;
        this.maxSize = 1;
    }
    
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);
        }
        return this.parent[x];
    }
    
    union(x, y) {
        let rootX = this.find(x);
        let rootY = this.find(y);
        if (rootX === rootY) return false;
        
        if (this.size[rootX] < this.size[rootY]) {
            [rootX, rootY] = [rootY, rootX];
        }
        this.parent[rootY] = rootX;
        this.size[rootX] += this.size[rootY];
        this.maxSize = Math.max(this.maxSize, this.size[rootX]);
        this.count--;
        return true;
    }
    
    getComponentSize(x) {
        return this.size[this.find(x)];
    }
    
    getMaxComponentSize() {
        return this.maxSize;
    }
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(α(n)) per operation |
| Space | O(n) - Parent and size arrays |

## Complexity Analysis

| Approach | Time | Space | When to Use |
|----------|------|-------|-------------|
| Standard UF | O(α(n)) | O(n) | **Recommended** - General use |
| Union by Size | O(α(n)) | O(n) | When component size matters |
| With Path Compression only | O(log n) | O(n) | Simpler implementation |
| Without optimizations | O(n) | O(n) | Only for small inputs |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Number of Provinces](https://leetcode.com/problems/number-of-provinces/) | 547 | Medium | Count connected components |
| [Redundant Connection](https://leetcode.com/problems/redundant-connection/) | 684 | Medium | Find edge creating cycle |
| [Accounts Merge](https://leetcode.com/problems/accounts-merge/) | 721 | Medium | Merge by common emails |
| [Most Stones Removed](https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/) | 947 | Medium | Connected stones |
| [Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree/) | 261 | Medium | Check if graph is tree |
| [Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/) | 128 | Medium | Union-Find or hash set |
| [Number of Islands II](https://leetcode.com/problems/number-of-islands-ii/) | 305 | Hard | Dynamic island counting |
| [Optimize Water Distribution](https://leetcode.com/problems/optimize-water-distribution-in-a-village/) | 1168 | Hard | MST with virtual node |

## Video Tutorial Links

1. **[NeetCode - Redundant Connection](https://www.youtube.com/watch?v=FXWRE67PLL0)** - Union-Find application
2. **[William Fiset - Union Find](https://www.youtube.com/watch?v=ayW5B2WqhSZ)** - Detailed explanation
3. **[Tushar Roy - Union Find](https://www.youtube.com/watch?v=ID00PMy0-vE)** - With path compression
4. **[Back To Back SWE - Union Find](https://www.youtube.com/watch?v=VJnUwsE4fWA)** - Algorithm walkthrough

## Summary

### Key Takeaways

- **Path compression**: Flatten tree during find for O(α(n)) amortized time
- **Union by rank/size**: Keep trees balanced for efficiency
- **Inverse Ackermann**: Effectively constant time for all practical purposes
- **Cycle detection**: If two nodes already connected, edge creates cycle
- **Component tracking**: Maintain count and sizes dynamically

### Common Pitfalls

- Forgetting path compression in find operation
- Not using union by rank/size (leads to skewed trees)
- Incorrectly counting components (decrement only on successful union)
- Assuming elements are 0-based (handle 1-based if needed)
- Not initializing parent array correctly
- Using recursion for find (may cause stack overflow on deep trees)

### Follow-up Questions

1. **How to implement rollback (undo) operations?**
   - Keep change log and revert parent/rank updates

2. **Can Union-Find handle directed graphs?**
   - Not directly; designed for undirected connectivity

3. **How to find all nodes in a component?**
   - Iterate all nodes and group by find() result

4. **What's the difference between rank and size?**
   - Rank is upper bound on tree height; size is actual node count

## Pattern Source

[Graph - Union-Find (Disjoint Set Union - DSU)](patterns/graph-union-find-disjoint-set-union-dsu.md)
