# Binary Lifting

## Category
Advanced

## Description

Binary Lifting is a powerful optimization technique used to preprocess a tree (or forest) to answer **Lowest Common Ancestor (LCA)** queries in **O(log n)** time after **O(n log n)** preprocessing. It's particularly essential for solving problems on large trees where repeated ancestor lookups, path queries, or distance calculations are needed. The technique leverages the binary representation of numbers to "jump" up the tree in powers of two, making ancestor queries extremely efficient.

---

## When to Use

Use the Binary Lifting algorithm when you need to solve problems involving:

- **Tree Ancestor Queries**: Finding the k-th ancestor or all ancestors of a node
- **LCA Queries**: Finding the lowest common ancestor of two nodes efficiently
- **Path Operations**: Computing distances or performing operations along paths in trees
- **Multiple Queries**: When you have many queries (Q) on a tree where Q × n would be too slow
- **Tree Traversals**: Efficient traversal when you need to move up/down the tree repeatedly

### Comparison with Alternatives

| Data Structure | Build Time | LCA Query | K-th Ancestor | Supports Updates |
|----------------|------------|-----------|----------------|-------------------|
| **Binary Lifting** | O(n log n) | O(log n) | O(log n) | ❌ No |
| Naive (parent traversal) | O(1) | O(n) | O(n) | ✅ Yes |
| Euler Tour + RMQ | O(n) | O(1) | O(n) | ❌ No |
| Heavy-Light Decomposition | O(n) | O(log n) | O(log n) | ✅ Yes |

### When to Choose Binary Lifting vs Other Methods

- **Choose Binary Lifting** when:
  - You need to answer many LCA or k-th ancestor queries
  - The tree is static (doesn't change between queries)
  - You need additional operations like distance between nodes
  - Simpler implementation is preferred over HLD

- **Choose Euler Tour + RMQ** when:
  - You need absolute fastest LCA queries (O(1) after O(n) build)
  - The tree is completely static
  - You're comfortable with slightly more complex implementation

- **Choose Naive Approach** when:
  - You only have a few queries (less than ~100)
  - The tree is small
  - Simplicity is more important than efficiency

---

## Algorithm Explanation

### Core Concept

The key insight behind Binary Lifting is that any integer `k` can be represented as a sum of powers of 2. Instead of moving up one parent at a time (O(k)), we can "jump" up by larger powers of two using a precomputed table. This transforms O(k) time complexity to O(log k).

For example, to move up 13 steps from a node:
- 13 in binary = 1101 (8 + 4 + 1)
- We jump: 8 steps → 4 steps → 1 step = 3 jumps instead of 13

### How It Works

#### Preprocessing Phase:
- `up[v][i]` = 2^i-th ancestor of node v
- Build using dynamic programming: `up[v][i] = up[ up[v][i-1] ][i-1]`
- This means the 2^i ancestor is the 2^(i-1) ancestor of the 2^(i-1) ancestor

#### LCA Query Phase:
1. **Align depths**: If nodes are at different depths, lift the deeper node up
2. **Simultaneous lifting**: From highest power to lowest, lift both nodes if their ancestors differ
3. **Return parent**: When nodes are direct children of LCA, return the parent

### Visual Representation

For a tree with root 0:
```
        0          ← Level 0 (root)
       / \
      1   2        ← Level 1
     / \   \
    3   4   5      ← Level 2
   /
  6                ← Level 3
```

Binary lifting table for node 6 ( LOG = 2 for this tree):
- `up[6][0]` = parent = 4 (2^0 = 1)
- `up[6][1]` = grandparent = 1 (2^1 = 2)
- `up[6][2]` = great-grandparent = 0 (2^2 = 4, if tree were deeper)

To find LCA(3, 5):
1. Depth(3) = 2, Depth(5) = 2 (already equal)
2. From i = LOG down to 0:
   - Check if up[3][i] != up[5][i]
   - For i = 1: up[3][1] = 0, up[5][1] = 0 → equal, skip
3. Return parent[0][3] = 1 → LCA = 0 ✓

### Why Binary Lifting Works

- **Binary decomposition**: Any number k can be represented as sum of powers of 2
- **Precomputation**: All 2^i ancestors are precomputed, so each jump is O(1)
- **Total jumps**: At most log₂(n) jumps per query
- **Optimality**: This is essentially the optimal approach for static trees

### Limitations

- **Static tree only**: The tree structure cannot change between queries
- **Space complexity**: O(n log n) space for the jump table
- **Preprocessing required**: Need O(n log n) time before answering queries
- **Single root**: Works best with rooted trees; forest requires additional handling

---

## Algorithm Steps

### Preprocessing

1. **Determine LOG**: Calculate `LOG = floor(log2(n)) + 1`
2. **Initialize structures**: Create parent table `up[n][LOG]` and depth array
3. **DFS/BFS traversal**: From root, compute:
   - `depth[v]` for each node
   - `up[v][0]` = immediate parent of v
4. **Build jump table**: For i from 1 to LOG-1:
   - `up[v][i] = up[ up[v][i-1] ][i-1]` (if ancestor exists)

### LCA Query

1. **Depth alignment**: If `depth[u] < depth[v]`, swap them
2. **Lift u to depth v**: For i from LOG-1 to 0:
   - If `depth[u] - depth[v] >= 2^i`, set `u = up[u][i]`
3. **Check if same**: If u == v, return u (v is ancestor)
4. **Simultaneous lift**: For i from LOG-1 to 0:
   - If `up[u][i] != up[v][i]`:
     - `u = up[u][i]`
     - `v = up[v][i]`
5. **Return parent**: Return `up[u][0]` (or `up[v][0]`)

### K-th Ancestor Query

1. **Binary decomposition**: For each bit i in k:
   - If k has bit i set, move node up by 2^i
2. **Return node**: After all jumps, return the result

### Distance Between Nodes

1. **Find LCA**: Compute lca(u, v)
2. **Calculate distance**: `depth[u] + depth[v] - 2 * depth[lca]`

---

## Implementation

### Template Code (LCA, K-th Ancestor, Distance)

````carousel
```python
from typing import List, Dict, Optional
from collections import defaultdict, deque


class BinaryLifting:
    """
    Binary Lifting for LCA queries on a tree.
    
    Time Complexities:
        - Preprocessing: O(n log n)
        - LCA Query: O(log n)
        - K-th Ancestor: O(log n)
        - Distance: O(log n)
    
    Space Complexity: O(n log n)
    
    Supports:
        - LCA queries
        - K-th ancestor queries
        - Distance between nodes
        - Path operations
    """
    
    def __init__(self, n: int, edges: List[List[int]], root: int = 0):
        """
        Initialize binary lifting structure.
        
        Args:
            n: Number of nodes (0 to n-1)
            edges: List of [u, v] edges (undirected tree)
            root: Root node index
        """
        self.n = n
        self.root = root
        self.LOG = (n).bit_length()  # Enough to store 2^LOG > n
        
        # Build adjacency list
        self.graph: Dict[int, List[int]] = defaultdict(list)
        for u, v in edges:
            self.graph[u].append(v)
            self.graph[v].append(u)
        
        # Arrays for parent and depth
        # up[i][v] = 2^i-th ancestor of v
        self.up: List[List[int]] = [[-1] * n for _ in range(self.LOG)]
        self.depth: List[int] = [0] * n
        
        # Preprocess
        self._bfs(root, -1)
        self._build_table()
    
    def _bfs(self, start: int, parent: int):
        """BFS to compute depth and immediate parent."""
        queue = deque([(start, parent)])
        self.depth[start] = 0
        self.up[0][start] = parent
        
        while queue:
            node, par = queue.popleft()
            for neighbor in self.graph[node]:
                if neighbor != par:
                    self.depth[neighbor] = self.depth[node] + 1
                    self.up[0][neighbor] = node
                    queue.append((neighbor, node))
    
    def _build_table(self):
        """Build binary lifting table using DP."""
        for i in range(1, self.LOG):
            for v in range(self.n):
                if self.up[i-1][v] != -1:
                    self.up[i][v] = self.up[i-1][self.up[i-1][v]]
    
    def lift(self, node: int, k: int) -> int:
        """
        Lift node by k steps up the tree.
        
        Args:
            node: Starting node
            k: Number of steps to lift
        
        Returns:
            Node after lifting k steps (or -1 if beyond root)
        """
        for i in range(self.LOG):
            if k & (1 << i):
                node = self.up[i][node]
                if node == -1:
                    return -1
        return node
    
    def kth_ancestor(self, node: int, k: int) -> int:
        """
        Find the k-th ancestor of a node.
        
        Args:
            node: Starting node
            k: K-th ancestor (0 returns node itself)
        
        Returns:
            K-th ancestor node (or -1 if doesn't exist)
        """
        if k == 0:
            return node
        return self.lift(node, k)
    
    def lca(self, u: int, v: int) -> int:
        """
        Find Lowest Common Ancestor of nodes u and v.
        
        Args:
            u, v: Node indices
        
        Returns:
            LCA node index
        """
        # Ensure u is deeper
        if self.depth[u] < self.depth[v]:
            u, v = v, u
        
        # Lift u to same depth as v
        diff = self.depth[u] - self.depth[v]
        u = self.lift(u, diff)
        
        # If v is ancestor of u after lifting, return v
        if u == v:
            return v
        
        # Lift both nodes together from highest power to lowest
        for i in range(self.LOG - 1, -1, -1):
            if self.up[i][u] != self.up[i][v]:
                u = self.up[i][u]
                v = self.up[i][v]
        
        # Return parent (LCA)
        return self.up[0][u]
    
    def distance(self, u: int, v: int) -> int:
        """
        Find distance between two nodes (number of edges).
        
        Args:
            u, v: Node indices
        
        Returns:
            Number of edges between u and v
        """
        lca = self.lca(u, v)
        return self.depth[u] + self.depth[v] - 2 * self.depth[lca]
    
    def is_ancestor(self, u: int, v: int) -> bool:
        """
        Check if u is an ancestor of v.
        
        Args:
            u: Potential ancestor
            v: Potential descendant
        
        Returns:
            True if u is ancestor of v
        """
        lca = self.lca(u, v)
        return lca == u
    
    def path_nodes(self, u: int, v: int) -> List[int]:
        """
        Get all nodes on path from u to v (inclusive).
        
        Args:
            u, v: Node indices
        
        Returns:
            List of nodes on path from u to v
        """
        lca = self.lca(u, v)
        
        # Path from u to LCA (reverse it later)
        path_u = []
        node = u
        while node != lca:
            path_u.append(node)
            node = self.up[0][node]
        path_u.append(lca)
        
        # Path from v to LCA
        path_v = []
        node = v
        while node != lca:
            path_v.append(node)
            node = self.up[0][node]
        
        # Combine: u→...→lca + reversed(v→...→lca without lca)
        return path_u + path_v[::-1]


# Example usage and demonstration
if __name__ == "__main__":
    # Tree structure:
    #       0
    #      / \
    #     1   2
    #    / \   \
    #   3   4   5
    #      /
    #     6
    
    n = 7
    edges = [
        [0, 1], [0, 2],
        [1, 3], [1, 4],
        [2, 5],
        [4, 6]
    ]
    
    bl = BinaryLifting(n, edges, root=0)
    
    print("Binary Lifting - LCA Queries")
    print("=" * 50)
    print("\nTree structure:")
    print("      0")
    print("     / \\")
    print("    1   2")
    print("   / \\   \\")
    print("  3   4   5")
    print("     /")
    print("    6")
    
    # Test LCA queries
    queries = [(3, 5), (3, 4), (6, 5), (0, 6), (3, 3)]
    
    print("\nLCA Queries:")
    print("-" * 30)
    for u, v in queries:
        lca = bl.lca(u, v)
        dist = bl.distance(u, v)
        print(f"  LCA({u}, {v}) = {lca}, Distance = {dist}")
    
    # Test lift operations
    print("\nLift operations from node 6:")
    print("-" * 30)
    for k in range(1, 5):
        lifted = bl.lift(6, k)
        ancestor = bl.kth_ancestor(6, k)
        print(f"  lift(6, {k}) = {lifted}, 6th ancestor = {ancestor}")
    
    # Test is_ancestor
    print("\nAncestor queries:")
    print("-" * 30)
    print(f"  is_ancestor(0, 6) = {bl.is_ancestor(0, 6)}")  # True
    print(f"  is_ancestor(1, 6) = {bl.is_ancestor(1, 6)}")  # True
    print(f"  is_ancestor(6, 0) = {bl.is_ancestor(6, 0)}")  # False
    
    # Test path nodes
    print("\nPath from node 3 to node 5:")
    print("-" * 30)
    path = bl.path_nodes(3, 5)
    print(f"  Path: {' -> '.join(map(str, path))}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <algorithm>
#include <queue>
using namespace std;

/**
 * Binary Lifting for LCA queries on a tree.
 * 
 * Time Complexities:
 *     - Preprocessing: O(n log n)
 *     - LCA Query: O(log n)
 *     - K-th Ancestor: O(log n)
 *     - Distance: O(log n)
 * 
 * Space Complexity: O(n log n)
 */
class BinaryLifting {
private:
    int n, root, LOG;
    vector<vector<int>> graph;
    vector<vector<int>> up;  // up[i][v] = 2^i-th ancestor of v
    vector<int> depth;
    
public:
    BinaryLifting(int n, const vector<vector<int>>& edges, int root = 0) {
        this->n = n;
        this->root = root;
        this->LOG = 0;
        while ((1 << LOG) <= n) LOG++;
        
        // Build adjacency list
        graph.resize(n);
        for (const auto& edge : edges) {
            int u = edge[0], v = edge[1];
            graph[u].push_back(v);
            graph[v].push_back(u);
        }
        
        // Initialize tables
        up.assign(LOG, vector<int>(n, -1));
        depth.assign(n, 0);
        
        // Preprocess
        bfs(root, -1);
        buildTable();
    }
    
private:
    void bfs(int start, int parent) {
        queue<pair<int, int>> q;
        q.push({start, parent});
        depth[start] = 0;
        up[0][start] = parent;
        
        while (!q.empty()) {
            auto [node, par] = q.front();
            q.pop();
            
            for (int neighbor : graph[node]) {
                if (neighbor != par) {
                    depth[neighbor] = depth[node] + 1;
                    up[0][neighbor] = node;
                    q.push({neighbor, node});
                }
            }
        }
    }
    
    void buildTable() {
        for (int i = 1; i < LOG; i++) {
            for (int v = 0; v < n; v++) {
                if (up[i-1][v] != -1) {
                    up[i][v] = up[i-1][up[i-1][v]];
                }
            }
        }
    }
    
public:
    /**
     * Lift node by k steps up the tree.
     * Time: O(log n)
     */
    int lift(int node, int k) const {
        for (int i = 0; i < LOG; i++) {
            if (k & (1 << i)) {
                node = up[i][node];
                if (node == -1) return -1;
            }
        }
        return node;
    }
    
    /**
     * Find the k-th ancestor of a node.
     * Time: O(log n)
     */
    int kthAncestor(int node, int k) const {
        if (k == 0) return node;
        return lift(node, k);
    }
    
    /**
     * Find Lowest Common Ancestor of nodes u and v.
     * Time: O(log n)
     */
    int lca(int u, int v) const {
        // Ensure u is deeper
        if (depth[u] < depth[v]) swap(u, v);
        
        // Lift u to same depth as v
        int diff = depth[u] - depth[v];
        u = lift(u, diff);
        
        // If v is ancestor of u after lifting, return v
        if (u == v) return v;
        
        // Lift both nodes together
        for (int i = LOG - 1; i >= 0; i--) {
            if (up[i][u] != up[i][v]) {
                u = up[i][u];
                v = up[i][v];
            }
        }
        
        // Return parent (LCA)
        return up[0][u];
    }
    
    /**
     * Find distance between two nodes (number of edges).
     * Time: O(log n)
     */
    int distance(int u, int v) const {
        int l = lca(u, v);
        return depth[u] + depth[v] - 2 * depth[l];
    }
    
    /**
     * Check if u is an ancestor of v.
     */
    bool isAncestor(int u, int v) const {
        return lca(u, v) == u;
    }
};


int main() {
    // Tree structure:
    //       0
    //      / \
    //     1   2
    //    / \   \
    //   3   4   5
    //      /
    //     6
    
    int n = 7;
    vector<vector<int>> edges = {
        {0, 1}, {0, 2},
        {1, 3}, {1, 4},
        {2, 5},
        {4, 6}
    };
    
    BinaryLifting bl(n, edges, 0);
    
    cout << "Binary Lifting - LCA Queries" << endl;
    cout << "==============================" << endl << endl;
    
    cout << "Tree structure:" << endl;
    cout << "      0" << endl;
    cout << "     / \\" << endl;
    cout << "    1   2" << endl;
    cout << "   / \\   \\" << endl;
    cout << "  3   4   5" << endl;
    cout << "     /" << endl;
    cout << "    6" << endl << endl;
    
    // Test LCA queries
    vector<pair<int, int>> queries = {{3, 5}, {3, 4}, {6, 5}, {0, 6}, {3, 3}};
    
    cout << "LCA Queries:" << endl;
    cout << "------------------------------" << endl;
    for (auto [u, v] : queries) {
        int lca = bl.lca(u, v);
        int dist = bl.distance(u, v);
        cout << "  LCA(" << u << ", " << v << ") = " << lca 
             << ", Distance = " << dist << endl;
    }
    
    // Test lift operations
    cout << endl << "Lift operations from node 6:" << endl;
    cout << "------------------------------" << endl;
    for (int k = 1; k <= 4; k++) {
        int lifted = bl.lift(6, k);
        cout << "  lift(6, " << k << ") = " << lifted << endl;
    }
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Binary Lifting for LCA queries on a tree.
 * 
 * Time Complexities:
 *     - Preprocessing: O(n log n)
 *     - LCA Query: O(log n)
 *     - K-th Ancestor: O(log n)
 *     - Distance: O(log n)
 * 
 * Space Complexity: O(n log n)
 */
public class BinaryLifting {
    private int n, root, LOG;
    private List<List<Integer>> graph;
    private int[][] up;  // up[i][v] = 2^i-th ancestor of v
    private int[] depth;
    
    public BinaryLifting(int n, int[][] edges, int root) {
        this.n = n;
        this.root = root;
        
        // Calculate LOG
        this.LOG = 0;
        while ((1 << LOG) <= n) LOG++;
        
        // Build adjacency list
        this.graph = new ArrayList<>();
        for (int i = 0; i < n; i++) {
            graph.add(new ArrayList<>());
        }
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            graph.get(u).add(v);
            graph.get(v).add(u);
        }
        
        // Initialize tables
        this.up = new int[LOG][n];
        this.depth = new int[n];
        
        // Initialize up table with -1
        for (int i = 0; i < LOG; i++) {
            Arrays.fill(up[i], -1);
        }
        
        // Preprocess
        bfs(root, -1);
        buildTable();
    }
    
    private void bfs(int start, int parent) {
        Queue<int[]> queue = new ArrayDeque<>();
        queue.offer(new int[]{start, parent});
        depth[start] = 0;
        up[0][start] = parent;
        
        while (!queue.isEmpty()) {
            int[] curr = queue.poll();
            int node = curr[0];
            int par = curr[1];
            
            for (int neighbor : graph.get(node)) {
                if (neighbor != par) {
                    depth[neighbor] = depth[node] + 1;
                    up[0][neighbor] = node;
                    queue.offer(new int[]{neighbor, node});
                }
            }
        }
    }
    
    private void buildTable() {
        for (int i = 1; i < LOG; i++) {
            for (int v = 0; v < n; v++) {
                if (up[i-1][v] != -1) {
                    up[i][v] = up[i-1][up[i-1][v]];
                }
            }
        }
    }
    
    /**
     * Lift node by k steps up the tree.
     * Time: O(log n)
     */
    public int lift(int node, int k) {
        for (int i = 0; i < LOG; i++) {
            if ((k & (1 << i)) != 0) {
                node = up[i][node];
                if (node == -1) return -1;
            }
        }
        return node;
    }
    
    /**
     * Find the k-th ancestor of a node.
     * Time: O(log n)
     */
    public int kthAncestor(int node, int k) {
        if (k == 0) return node;
        return lift(node, k);
    }
    
    /**
     * Find Lowest Common Ancestor of nodes u and v.
     * Time: O(log n)
     */
    public int lca(int u, int v) {
        // Ensure u is deeper
        if (depth[u] < depth[v]) {
            int temp = u;
            u = v;
            v = temp;
        }
        
        // Lift u to same depth as v
        int diff = depth[u] - depth[v];
        u = lift(u, diff);
        
        // If v is ancestor of u after lifting, return v
        if (u == v) return v;
        
        // Lift both nodes together
        for (int i = LOG - 1; i >= 0; i--) {
            if (up[i][u] != up[i][v]) {
                u = up[i][u];
                v = up[i][v];
            }
        }
        
        // Return parent (LCA)
        return up[0][u];
    }
    
    /**
     * Find distance between two nodes (number of edges).
     * Time: O(log n)
     */
    public int distance(int u, int v) {
        int l = lca(u, v);
        return depth[u] + depth[v] - 2 * depth[l];
    }
    
    /**
     * Check if u is an ancestor of v.
     */
    public boolean isAncestor(int u, int v) {
        return lca(u, v) == u;
    }
    
    public static void main(String[] args) {
        // Tree structure:
        //       0
        //      / \
        //     1   2
        //    / \   \
        //   3   4   5
        //      /
        //     6
        
        int n = 7;
        int[][] edges = {
            {0, 1}, {0, 2},
            {1, 3}, {1, 4},
            {2, 5},
            {4, 6}
        };
        
        BinaryLifting bl = new BinaryLifting(n, edges, 0);
        
        System.out.println("Binary Lifting - LCA Queries");
        System.out.println("=============================");
        System.out.println();
        
        System.out.println("Tree structure:");
        System.out.println("      0");
        System.out.println("     / \\");
        System.out.println("    1   2");
        System.out.println("   / \\   \\");
        System.out.println("  3   4   5");
        System.out.println("     /");
        System.out.println("    6");
        System.out.println();
        
        // Test LCA queries
        int[][] queries = {{3, 5}, {3, 4}, {6, 5}, {0, 6}, {3, 3}};
        
        System.out.println("LCA Queries:");
        System.out.println("------------------------------");
        for (int[] query : queries) {
            int u = query[0], v = query[1];
            int lca = bl.lca(u, v);
            int dist = bl.distance(u, v);
            System.out.println("  LCA(" + u + ", " + v + ") = " + lca + ", Distance = " + dist);
        }
        
        // Test lift operations
        System.out.println();
        System.out.println("Lift operations from node 6:");
        System.out.println("------------------------------");
        for (int k = 1; k <= 4; k++) {
            int lifted = bl.lift(6, k);
            System.out.println("  lift(6, " + k + ") = " + lifted);
        }
    }
}
```

<!-- slide -->
```javascript
/**
 * Binary Lifting for LCA queries on a tree.
 * 
 * Time Complexities:
 *     - Preprocessing: O(n log n)
 *     - LCA Query: O(log n)
 *     - K-th Ancestor: O(log n)
 *     - Distance: O(log n)
 * 
 * Space Complexity: O(n log n)
 */
class BinaryLifting {
    /**
     * Initialize binary lifting structure.
     * @param {number} n - Number of nodes
     * @param {number[][]} edges - List of [u, v] edges
     * @param {number} root - Root node index
     */
    constructor(n, edges, root = 0) {
        this.n = n;
        this.root = root;
        
        // Calculate LOG
        this.LOG = 0;
        while ((1 << this.LOG) <= n) this.LOG++;
        
        // Build adjacency list
        this.graph = Array.from({ length: n }, () => []);
        for (const [u, v] of edges) {
            this.graph[u].push(v);
            this.graph[v].push(u);
        }
        
        // Initialize tables
        this.up = Array.from({ length: this.LOG }, () => Array(n).fill(-1));
        this.depth = Array(n).fill(0);
        
        // Preprocess
        this._bfs(root, -1);
        this._buildTable();
    }
    
    /**
     * BFS to compute depth and immediate parent.
     * @private
     */
    _bfs(start, parent) {
        const queue = [[start, parent]];
        this.depth[start] = 0;
        this.up[0][start] = parent;
        
        while (queue.length > 0) {
            const [node, par] = queue.shift();
            
            for (const neighbor of this.graph[node]) {
                if (neighbor !== par) {
                    this.depth[neighbor] = this.depth[node] + 1;
                    this.up[0][neighbor] = node;
                    queue.push([neighbor, node]);
                }
            }
        }
    }
    
    /**
     * Build binary lifting table using DP.
     * @private
     */
    _buildTable() {
        for (let i = 1; i < this.LOG; i++) {
            for (let v = 0; v < this.n; v++) {
                if (this.up[i-1][v] !== -1) {
                    this.up[i][v] = this.up[i-1][this.up[i-1][v]];
                }
            }
        }
    }
    
    /**
     * Lift node by k steps up the tree.
     * @param {number} node - Starting node
     * @param {number} k - Number of steps to lift
     * @returns {number} Node after lifting k steps (or -1 if beyond root)
     * 
     * Time: O(log n)
     */
    lift(node, k) {
        for (let i = 0; i < this.LOG; i++) {
            if (k & (1 << i)) {
                node = this.up[i][node];
                if (node === -1) return -1;
            }
        }
        return node;
    }
    
    /**
     * Find the k-th ancestor of a node.
     * @param {number} node - Starting node
     * @param {number} k - K-th ancestor (0 returns node itself)
     * @returns {number} K-th ancestor node (or -1 if doesn't exist)
     * 
     * Time: O(log n)
     */
    kthAncestor(node, k) {
        if (k === 0) return node;
        return this.lift(node, k);
    }
    
    /**
     * Find Lowest Common Ancestor of nodes u and v.
     * @param {number} u - First node
     * @param {number} v - Second node
     * @returns {number} LCA node index
     * 
     * Time: O(log n)
     */
    lca(u, v) {
        // Ensure u is deeper
        if (this.depth[u] < this.depth[v]) {
            [u, v] = [v, u];
        }
        
        // Lift u to same depth as v
        const diff = this.depth[u] - this.depth[v];
        u = this.lift(u, diff);
        
        // If v is ancestor of u after lifting, return v
        if (u === v) return v;
        
        // Lift both nodes together from highest power to lowest
        for (let i = this.LOG - 1; i >= 0; i--) {
            if (this.up[i][u] !== this.up[i][v]) {
                u = this.up[i][u];
                v = this.up[i][v];
            }
        }
        
        // Return parent (LCA)
        return this.up[0][u];
    }
    
    /**
     * Find distance between two nodes (number of edges).
     * @param {number} u - First node
     * @param {number} v - Second node
     * @returns {number} Number of edges between u and v
     * 
     * Time: O(log n)
     */
    distance(u, v) {
        const l = this.lca(u, v);
        return this.depth[u] + this.depth[v] - 2 * this.depth[l];
    }
    
    /**
     * Check if u is an ancestor of v.
     * @param {number} u - Potential ancestor
     * @param {number} v - Potential descendant
     * @returns {boolean} True if u is ancestor of v
     */
    isAncestor(u, v) {
        return this.lca(u, v) === u;
    }
}


// Example usage and demonstration
const n = 7;
const edges = [
    [0, 1], [0, 2],
    [1, 3], [1, 4],
    [2, 5],
    [4, 6]
];

const bl = new BinaryLifting(n, edges, 0);

console.log("Binary Lifting - LCA Queries");
console.log("=============================");
console.log();

console.log("Tree structure:");
console.log("      0");
console.log("     / \\");
console.log("    1   2");
console.log("   / \\   \\");
console.log("  3   4   5");
console.log("     /");
console.log("    6");
console.log();

// Test LCA queries
const queries = [[3, 5], [3, 4], [6, 5], [0, 6], [3, 3]];

console.log("LCA Queries:");
console.log("------------------------------");
for (const [u, v] of queries) {
    const lca = bl.lca(u, v);
    const dist = bl.distance(u, v);
    console.log(`  LCA(${u}, ${v}) = ${lca}, Distance = ${dist}`);
}

// Test lift operations
console.log();
console.log("Lift operations from node 6:");
console.log("------------------------------");
for (let k = 1; k <= 4; k++) {
    const lifted = bl.lift(6, k);
    console.log(`  lift(6, ${k}) = ${lifted}`);
}

// Test isAncestor
console.log();
console.log("Ancestor queries:");
console.log("------------------------------");
console.log(`  isAncestor(0, 6) = ${bl.isAncestor(0, 6)}`);  // true
console.log(`  isAncestor(1, 6) = ${bl.isAncestor(1, 6)}`);  // true
console.log(`  isAncestor(6, 0) = ${bl.isAncestor(6, 0)}`);  // false
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Preprocessing** | O(n log n) | Need to fill all n × LOG entries |
| **LCA Query** | O(log n) | At most LOG jumps |
| **K-th Ancestor** | O(log n) | Binary decomposition of k |
| **Distance** | O(log n) | LCA + depth calculation |
| **Is Ancestor** | O(log n) | Uses LCA internally |

### Detailed Breakdown

- **Preprocessing**: 
  - DFS/BFS: O(n)
  - Building table: For each level i (0 to LOG-1), compute n entries
  - Total: O(n log n)

- **LCA Query**:
  - Depth alignment: O(log n) using binary lifting
  - Simultaneous lifting: LOG iterations, each O(1)
  - Total: O(log n)

- **K-th Ancestor**:
  - Binary decomposition of k: at most LOG bits
  - Each bit requires O(1) lookup
  - Total: O(log n)

---

## Space Complexity Analysis

- **Jump Table (up)**: O(n log n) - stores n × LOG integers
- **Depth Array**: O(n)
- **Adjacency List**: O(n)
- **Total**: O(n log n)

### Space Optimization (Optional)

For very large trees, consider:
1. **Compress the table**: Store only `up[i][v]` where 2^i ≤ max_depth
2. **Use smaller types**: int instead of long if values fit
3. **Sparse representation**: Only store nodes that need full table
4. **Euler Tour alternative**: O(n) space but O(1) LCA queries

---

## Common Variations

### 1. K-th Ancestor Query

Find the k-th ancestor of any node efficiently:

````carousel
```python
def kth_ancestor(self, node: int, k: int) -> int:
    """Find k-th ancestor using binary lifting."""
    for i in range(self.LOG):
        if k & (1 << i):
            node = self.up[i][node]
            if node == -1:
                return -1
    return node
```
````

### 2. Distance Between Nodes

Number of edges between any two nodes:

````carousel
```python
def distance(self, u: int, v: int) -> int:
    """Distance = depth[u] + depth[v] - 2 * depth[lca]"""
    lca = self.lca(u, v)
    return self.depth[u] + self.depth[v] - 2 * self.depth[lca]
```
````

### 3. Path Queries on Trees

Perform operations along paths between nodes:

````carousel
```python
def path_sum(self, u: int, v: int, values: List[int]) -> int:
    """Sum of values on path from u to v."""
    lca = self.lca(u, v)
    # Sum from u to lca + from v to lca (excluding lca once)
    return self._sum_to_root(u, lca, values) + \
           self._sum_to_root(v, lca, values) - values[lca]
```
````

### 4. Binary Lifting on Binary Trees

For binary trees with left/right child pointers:

````carousel
```python
# For binary trees (not general trees)
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def kth_ancestor_binary_tree(root: TreeNode, target: TreeNode, k: int) -> TreeNode:
    """Find k-th ancestor in a binary tree."""
    # Similar approach but using left/right pointers
    # Can also precompute jump tables for O(log n) queries
    pass
```
````

### 5. Offline LCA with Union-Find

For forests or disconnected graphs:

````carousel
```python
def lca_forest(forest: List[List[int]]) -> BinaryLifting:
    """Process multiple trees (forest)."""
    # Run DFS from each root not visited
    # Build combined jump table
    # Handle queries within same tree only
    pass
```
````

---

## Practice Problems

### Problem 1: Lowest Common Ancestor

**Problem:** [LeetCode 236 - Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/)

**Description:** Given a binary tree (not BST), find the lowest common ancestor (LCA) of two given nodes in the tree.

**How to Apply Binary Lifting:**
- Preprocess the tree with binary lifting (O(n log n))
- Answer each LCA query in O(log n)
- This is more efficient than the naive O(n) approach when multiple queries exist

---

### Problem 2: K-th Ancestor in a Binary Tree

**Problem:** [LeetCode 1483 - Kth Ancestor of a Tree Node](https://leetcode.com/problems/kth-ancestor-of-a-tree-node/)

**Description:** Design a data structure to find the k-th ancestor of a given node in a tree.

**How to Apply Binary Lifting:**
- Use the lift() function to jump k steps up
- Binary decomposition makes this O(log n) per query
- Preprocessing enables fast queries

---

### Problem 3: Distance Between Nodes in a Tree

**Problem:** [LeetCode 834 - Sum of Distances in Tree](https://leetcode.com/problems/sum-of-distances-in-tree/)

**Description:** Given a tree with n nodes (0-indexed), find the sum of distances from node 0 to all other nodes.

**How to Apply Binary Lifting:**
- Use binary lifting to find LCA in O(log n)
- Distance formula: depth[u] + depth[v] - 2 * depth[lca]
- Efficient for computing all pair distances

---

### Problem 4: Path Queries on Trees

**Problem:** [LeetCode 1487 - Making File Names Unique](https://leetcode.com/problems/making-file-names-unique/)

**Description:** Given an array of strings `paths` of directory info, create a unique directory path.

**How to Apply Binary Lifting:**
- Build tree from directory structure
- Use LCA to determine common ancestors
- Efficient path operations

---

### Problem 5: Ancestor Queries with Updates

**Problem:** [LeetCode 1676 - Lowest Common Ancestor of a Binary Tree IV](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree-iv/)

**Description:** Find the LCA of nodes in a binary tree when multiple nodes are given at once.

**How to Apply Binary Lifting:**
- Preprocess tree with binary lifting
- For each query, find LCA of all nodes in O(k log n)
- More efficient than pairwise LCA for multiple nodes

---

## Video Tutorial Links

### Fundamentals

- [Binary Lifting - Introduction (Take U Forward)](https://www.youtube.com/watch?v=Un0JDLV3qG4) - Comprehensive introduction to binary lifting
- [Binary Lifting Implementation (WilliamFiset)](https://www.youtube.com/watch?v=L2O0RAna7P4) - Detailed explanation with code
- [LCA using Binary Lifting (NeetCode)](https://www.youtube.com/watch?v=s_3P2j3UcO4) - Practical implementation guide

### Advanced Topics

- [K-th Ancestor Problem](https://www.youtube.com/watch?v=dRMx4DdGf50) - K-th ancestor queries
- [Distance in Tree using Binary Lifting](https://www.youtube.com/watch?v=MO55_r7nbbM) - Computing distances
- [Binary Lifting vs Euler Tour](https://www.youtube.com/watch?v=HhaGkHDsP9k) - Comparing LCA approaches

---

## Follow-up Questions

### Q1: What is the difference between Binary Lifting and Euler Tour + RMQ for LCA?

**Answer:** 
- **Binary Lifting**: O(n log n) preprocessing, O(log n) query, O(n log n) space
- **Euler Tour + RMQ**: O(n) preprocessing, O(1) query, O(n) space
- Binary lifting is simpler to implement and allows k-th ancestor queries
- Euler tour is faster but requires additional data structure (sparse table or segment tree for RMQ)

### Q2: Can Binary Lifting handle trees with multiple roots (forest)?

**Answer:** Yes, but with modifications:
1. Run preprocessing from each root in the forest
2. Mark nodes that are roots with parent = -1
3. Ensure queries only between nodes in the same tree
4. Alternative: Add a super-root connecting all forest roots

### Q3: How do you handle updates in a tree with Binary Lifting?

**Answer:** Binary Lifting **does not support efficient updates**. Options:
1. **Rebuild entire structure**: O(n log n) per update - not practical
2. **Use Link-Cut Tree**: For dynamic trees with path queries
3. **Use Heavy-Light Decomposition**: For trees that change infrequently
4. **Binary Lifting + Fenwick**: For point updates on node values

### Q4: What is the maximum tree size Binary Lifting can handle?

**Answer:** With O(n log n) space:
- **Memory**: ~100MB → ~10^7 elements (depending on LOG)
- **Time**: Build takes O(n log n) → practical up to ~10^5-10^6 nodes
- For larger trees, consider Euler tour or external memory approaches

### Q5: How does Binary Lifting compare to DFS for single LCA queries?

**Answer:**
- **Single query**: DFS is O(n), Binary Lifting is O(log n) but needs O(n log n) preprocessing
- **Multiple queries**: Binary Lifting wins when Q × log n < n × Q (i.e., more than ~log n queries)
- **Practical threshold**: Binary Lifting becomes worth it with ~10+ queries on the same tree

---

## Summary

Binary Lifting is an essential technique for solving **tree-related queries efficiently**. Key takeaways:

- **Preprocessing investment**: O(n log n) build time enables O(log n) queries
- **Versatile operations**: Supports LCA, k-th ancestor, distance, and path queries
- **Space tradeoff**: Uses O(n log n) space for fast query performance
- **Static trees only**: Doesn't support dynamic tree modifications

When to use:
- ✅ Multiple LCA/ancestor queries on the same tree
- ✅ Path operations (distance, sum along paths)
- ✅ K-th ancestor queries
- ❌ When tree changes frequently (use Link-Cut Tree or HLD)
- ❌ Single queries on small trees (simple DFS is enough)

This technique is fundamental in competitive programming and technical interviews, especially for problems involving tree traversals, ancestor queries, and path operations. Combined with other tree algorithms, it enables efficient solutions to complex tree problems.

---

## Related Algorithms

- [Sparse Table](./sparse-table.md) - O(1) range queries (used in Euler tour + RMQ)
- [Segment Tree](./segment-tree.md) - Dynamic range queries
- [DFS/BFS](./dfs.md) - Tree traversal basics
- [Heavy-Light Decomposition](./heavy-light.md) - Advanced tree path queries
