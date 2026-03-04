# Union-Find

## Category
Graphs

## Description

Union-Find (also known as **Disjoint Set Union** or **DSU**) is a fundamental data structure that efficiently tracks a partition of elements into disjoint sets. It supports two primary operations—**find** (determine which set an element belongs to) and **union** (merge two sets)—in near-constant amortized time when properly optimized.

This data structure is essential for solving problems involving connectivity, grouping, and dynamic set membership. It forms the backbone of many graph algorithms and is a critical tool in competitive programming and technical interviews.

---

## When to Use

Use the Union-Find algorithm when you need to solve problems involving:

- **Dynamic Connectivity**: Tracking which elements are connected as edges are added
- **Cycle Detection**: Detecting cycles in undirected graphs efficiently
- **Grouping/Clustering**: Merging elements into connected components
- **Set Partitioning**: Maintaining disjoint sets with efficient merges and queries

### Comparison with Alternatives

| Data Structure | Find | Union | Cycle Detection | Dynamic Graph |
|----------------|------|-------|-----------------|---------------|
| **Union-Find** | O(α(n)) | O(α(n)) | O(V + E) | ✅ Yes |
| **DFS/BFS** | O(V + E) | N/A | O(V + E) | ❌ No |
| **Adjacency Matrix** | O(V) | N/A | O(V²) | ❌ No |

### When to Choose Union-Find vs DFS/BFS

- **Choose Union-Find** when:
  - You need to process edges incrementally
  - You frequently need to check connectivity between arbitrary pairs
  - You're building the graph dynamically
  - You need near-constant time connectivity queries

- **Choose DFS/BFS** when:
  - You need to traverse the entire graph
  - You need path information (not just connectivity)
  - The graph is static (built all at once)
  - You need to find all connected components at once

---

## Algorithm Explanation

### Core Concept

The key insight behind Union-Find is maintaining a **forest** (collection of trees) where each tree represents a set. Each element points to its parent, and the root of each tree serves as the representative of that set. By applying two critical optimizations—**path compression** and **union by rank**—we achieve amortized O(α(n)) time per operation, where α(n) is the inverse Ackermann function (practically constant for all realistic inputs).

### How It Works

#### Data Structure:
- **`parent[i]`**: The parent of element `i`. The root has `parent[i] = i`
- **`rank[i]`**: An upper bound on the height of the tree rooted at `i` (used for union by rank)

#### Find Operation with Path Compression:
1. Start at element `x`
2. If `x` is not its own parent, recursively find the root
3. Set `x`'s parent directly to the root (path compression)
4. Return the root

#### Union Operation with Rank:
1. Find the roots of both elements
2. If roots are the same, elements are already in the same set
3. Attach the smaller tree under the larger tree (rank-based union)
4. If ranks are equal, choose one as parent and increment its rank

### Visual Representation

```
Initial State (5 isolated elements):     After union(0,1), union(2,3), union(0,2):

        0                                       0
        |                                       | \
        1                                       1   2
                                                |   |
        2        →    union operations    →      3   4
        |
        3      
        
        4
                                                (0 is root of {0,1,2,3})
                                                (4 is separate)

With Path Compression (find(3)):
        0          ← All nodes point directly to root
       /|\
      1 2 3
```

### Why These Optimizations Matter

| Optimization | Without | With |
|--------------|---------|------|
| **No optimization** | O(n) per operation | - |
| **Path compression only** | O(log n) amortized | - |
| **Union by rank only** | O(log n) amortized | - |
| **Both optimizations** | O(α(n)) amortized | **Inverse Ackermann ≈ constant** |

The inverse Ackermann function α(n) grows so slowly that for n ≤ 10^200, α(n) ≤ 5. In practice, operations are effectively constant time.

### Applications

- **Cycle Detection in Undirected Graphs**: Detect if adding an edge creates a cycle
- **Connected Components**: Track number of connected components in a graph
- **Kruskal's MST Algorithm**: Build minimum spanning trees efficiently
- **Network Connectivity**: Determine if two computers are in the same network
- **Image Processing**: Find connected components in binary images
- **Social Networks**: Track friend groups and connections
- **Word Games**: Build word ladders efficiently

---

## Algorithm Steps

### Initialization

1. Create `parent` array where `parent[i] = i` (each element is its own root)
2. Create `rank` array where `rank[i] = 0` (all trees have height 0)
3. Optionally create `size` array for size-based union

### Find Operation (Recursive with Path Compression)

1. If `x` is not its own parent (`parent[x] != x`):
   - Recursively find the root: `parent[x] = find(parent[x])`
2. Return `parent[x]` (the root)

### Find Operation (Iterative)

1. Start at element `x`
2. Store the original element
3. Traverse up to find the root
4. Compress the path: set all visited nodes directly to root
5. Return the root

### Union Operation (By Rank)

1. Find root of `x`: `root_x = find(x)`
2. Find root of `y`: `root_y = find(y)`
3. If `root_x == root_y`: return (already in same set)
4. If `rank[root_x] < rank[root_y]`: set `parent[root_x] = root_y`
5. Else if `rank[root_x] > rank[root_y]`: set `parent[root_y] = root_x`
6. Else (equal ranks): set `parent[root_y] = root_x` and increment `rank[root_x]`

### Connected Check

1. Find root of `x`
2. Find root of `y`
3. Return `root_x == root_y`

---

## Implementation

### Template Code (Complete Union-Find)

````carousel
```python
from typing import List, Optional

class UnionFind:
    """
    Union-Find (Disjoint Set Union) with path compression and union by rank.
    
    Time Complexities:
        - find: O(α(n)) amortized
        - union: O(α(n)) amortized
        - connected: O(α(n)) amortized
    
    Space Complexity: O(n)
    
    Where α(n) is the inverse Ackermann function (practically constant).
    """
    
    def __init__(self, n: int):
        """
        Initialize n isolated sets.
        
        Args:
            n: Number of elements (0 to n-1)
            
        Time: O(n)
        Space: O(n)
        """
        self.parent = list(range(n))  # Each element is its own parent
        self.rank = [0] * n           # Rank for union by rank
        self.size = [1] * n           # Size of each component (optional)
    
    def find(self, x: int) -> int:
        """
        Find the root/representative of the set containing x.
        Uses path compression for optimization.
        
        Args:
            x: Element to find
            
        Returns:
            Root of the set containing x
            
        Time: O(α(n)) amortized
        """
        if self.parent[x] != x:
            # Path compression: make x point directly to root
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def find_iterative(self, x: int) -> int:
        """
        Iterative version of find with path compression.
        
        Args:
            x: Element to find
            
        Returns:
            Root of the set containing x
        """
        root = x
        # Find the root
        while self.parent[root] != root:
            root = self.parent[root]
        
        # Path compression: point all nodes directly to root
        while self.parent[x] != root:
            next_x = self.parent[x]
            self.parent[x] = root
            x = next_x
        
        return root
    
    def union(self, x: int, y: int) -> None:
        """
        Merge the sets containing x and y.
        Uses union by rank for optimization.
        
        Args:
            x: First element
            y: Second element
            
        Time: O(α(n)) amortized
        """
        root_x = self.find(x)
        root_y = self.find(y)
        
        # Already in the same set
        if root_x == root_y:
            return
        
        # Union by rank: attach smaller tree under larger tree
        if self.rank[root_x] < self.rank[root_y]:
            self.parent[root_x] = root_y
            self.size[root_y] += self.size[root_x]
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
            self.size[root_x] += self.size[root_y]
        else:
            # Same rank, choose one as root and increment rank
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
            self.size[root_x] += self.size[root_y]
    
    def union_by_size(self, x: int, y: int) -> None:
        """
        Union by size variant - attach smaller component to larger.
        
        Args:
            x: First element
            y: Second element
        """
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x == root_y:
            return
        
        # Attach smaller size to larger size
        if self.size[root_x] < self.size[root_y]:
            self.parent[root_x] = root_y
            self.size[root_y] += self.size[root_x]
        else:
            self.parent[root_y] = root_x
            self.size[root_x] += self.size[root_y]
    
    def connected(self, x: int, y: int) -> bool:
        """
        Check if x and y are in the same set.
        
        Args:
            x: First element
            y: Second element
            
        Returns:
            True if x and y are connected
            
        Time: O(α(n)) amortized
        """
        return self.find(x) == self.find(y)
    
    def get_root(self, x: int) -> int:
        """Alias for find for clarity."""
        return self.find(x)
    
    def get_component_size(self, x: int) -> int:
        """
        Get the size of the component containing x.
        
        Args:
            x: Element to query
            
        Returns:
            Size of the component
        """
        return self.size[self.find(x)]
    
    def get_group_count(self) -> int:
        """
        Get the number of distinct groups/sets.
        
        Returns:
            Number of connected components
            
        Time: O(n * α(n))
        """
        groups = set()
        for i in range(len(self.parent)):
            groups.add(self.find(i))
        return len(groups)
    
    def get_all_groups(self) -> dict:
        """
        Get all groups as a dictionary mapping root to members.
        
        Returns:
            Dictionary of {root: [members]}
            
        Time: O(n * α(n))
        """
        groups = {}
        for i in range(len(self.parent)):
            root = self.find(i)
            if root not in groups:
                groups[root] = []
            groups[root].append(i)
        return groups


def count_cycles(n: int, edges: List[List[int]]) -> int:
    """
    Detect number of cycles in an undirected graph.
    
    Args:
        n: Number of nodes (0 to n-1)
        edges: List of edges as [u, v] pairs
        
    Returns:
        Number of cycles detected
        
    Time: O(E * α(V))
    Space: O(V)
    """
    uf = UnionFind(n)
    cycles = 0
    
    for u, v in edges:
        if uf.connected(u, v):
            # Edge creates a cycle
            cycles += 1
        else:
            uf.union(u, v)
    
    return cycles


def number_of_provinces(is_connected: List[List[int]]) -> int:
    """
    Find number of provinces (connected components) in a matrix.
    
    Problem: LeetCode 547 - Number of Provinces
    
    Args:
        is_connected: N x N matrix where is_connected[i][j] = 1 if connected
        
    Returns:
        Number of provinces
        
    Time: O(N² * α(N))
    Space: O(N)
    """
    n = len(is_connected)
    if n == 0:
        return 0
    
    uf = UnionFind(n)
    
    # Union all connected cities
    for i in range(n):
        for j in range(i + 1, n):
            if is_connected[i][j] == 1:
                uf.union(i, j)
    
    return uf.get_group_count()


# Example usage and demonstration
if __name__ == "__main__":
    print("=" * 60)
    print("Union-Find Demo")
    print("=" * 60)
    
    # Example 1: Basic operations
    uf = UnionFind(5)
    
    print("\nInitial: 5 isolated sets")
    print(f"Find(0): {uf.find(0)}, Find(1): {uf.find(1)}")
    
    # Union some elements
    uf.union(0, 1)
    uf.union(2, 3)
    uf.union(0, 2)
    
    print("\nAfter unions (0-1-2-3 connected):")
    print(f"Find(0): {uf.find(0)}, Find(3): {uf.find(3)}")
    print(f"Connected(0, 3): {uf.connected(0, 3)}")
    print(f"Connected(0, 4): {uf.connected(0, 4)}")
    print(f"Number of groups: {uf.get_group_count()}")
    print(f"Component size of 0: {uf.get_component_size(0)}")
    
    # Example 2: Cycle detection
    n = 4
    edges = [[0, 1], [1, 2], [2, 0], [3, 2]]  # Triangle + extra edge
    print(f"\nCycle detection: {count_cycles(n, edges)} cycle(s)")
    
    # Example 3: Number of provinces
    is_connected = [
        [1, 1, 0],
        [1, 1, 0],
        [0, 0, 1]
    ]
    print(f"\nNumber of provinces: {number_of_provinces(is_connected)}")
    
    # Example 4: Get all groups
    print("\nAll groups:")
    groups = uf.get_all_groups()
    for root, members in groups.items():
        print(f"  Root {root}: {members}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <unordered_map>
using namespace std;

/**
 * Union-Find (Disjoint Set Union) with path compression and union by rank.
 * 
 * Time Complexities:
 *     - find: O(α(n)) amortized
 *     - union: O(α(n)) amortized
 *     - connected: O(α(n)) amortized
 * 
 * Space Complexity: O(n)
 */
class UnionFind {
private:
    vector<int> parent;  // Parent array
    vector<int> rank_;    // Rank for union by rank
    vector<int> size_;    // Size of each component
    
public:
    /**
     * Initialize n isolated sets.
     * 
     * Time: O(n)
     * Space: O(n)
     */
    UnionFind(int n) {
        parent.resize(n);
        rank_.resize(n, 0);
        size_.resize(n, 1);
        
        for (int i = 0; i < n; i++) {
            parent[i] = i;  // Each element is its own parent
        }
    }
    
    /**
     * Find the root with path compression.
     * 
     * Time: O(α(n)) amortized
     */
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);  // Path compression
        }
        return parent[x];
    }
    
    /**
     * Union by rank.
     * 
     * Time: O(α(n)) amortized
     */
    void unionSets(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        
        if (rootX == rootY) return;  // Already in same set
        
        // Union by rank
        if (rank_[rootX] < rank_[rootY]) {
            parent[rootX] = rootY;
            size_[rootY] += size_[rootX];
        } else if (rank_[rootX] > rank_[rootY]) {
            parent[rootY] = rootX;
            size_[rootX] += size_[rootY];
        } else {
            parent[rootY] = rootX;
            rank_[rootX]++;
            size_[rootX] += size_[rootY];
        }
    }
    
    /**
     * Check if x and y are connected.
     * 
     * Time: O(α(n)) amortized
     */
    bool connected(int x, int y) {
        return find(x) == find(y);
    }
    
    /**
     * Get size of component containing x.
     */
    int componentSize(int x) {
        return size_[find(x)];
    }
    
    /**
     * Get number of distinct groups.
     * 
     * Time: O(n * α(n))
     */
    int groupCount() {
        // Note: Can be optimized by tracking count during unions
        vector<bool> isRoot(parent.size(), false);
        for (int i = 0; i < parent.size(); i++) {
            isRoot[find(i)] = true;
        }
        int count = 0;
        for (bool b : isRoot) {
            if (b) count++;
        }
        return count;
    }
};

/**
 * Count cycles in undirected graph.
 * 
 * Time: O(E * α(V))
 * Space: O(V)
 */
int countCycles(int n, const vector<pair<int,int>>& edges) {
    UnionFind uf(n);
    int cycles = 0;
    
    for (auto [u, v] : edges) {
        if (uf.connected(u, v)) {
            cycles++;
        } else {
            uf.unionSets(u, v);
        }
    }
    
    return cycles;
}


int main() {
    cout << "=" << 60 << endl;
    cout << "Union-Find Demo" << endl;
    cout << "=" << 60 << endl;
    
    // Example 1: Basic operations
    UnionFind uf(5);
    
    cout << "\nInitial: 5 isolated sets" << endl;
    cout << "Find(0): " << uf.find(0) << ", Find(1): " << uf.find(1) << endl;
    
    // Union some elements
    uf.unionSets(0, 1);
    uf.unionSets(2, 3);
    uf.unionSets(0, 2);
    
    cout << "\nAfter unions (0-1-2-3 connected):" << endl;
    cout << "Find(0): " << uf.find(0) << ", Find(3): " << uf.find(3) << endl;
    cout << "Connected(0, 3): " << (uf.connected(0, 3) ? "true" : "false") << endl;
    cout << "Connected(0, 4): " << (uf.connected(0, 4) ? "true" : "false") << endl;
    cout << "Number of groups: " << uf.groupCount() << endl;
    cout << "Component size of 0: " << uf.componentSize(0) << endl;
    
    // Example 2: Cycle detection
    vector<pair<int,int>> edges = {{0, 1}, {1, 2}, {2, 0}, {3, 2}};
    cout << "\nCycle detection: " << countCycles(4, edges) << " cycle(s)" << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Union-Find (Disjoint Set Union) with path compression and union by rank.
 * 
 * Time Complexities:
 *     - find: O(α(n)) amortized
 *     - union: O(α(n)) amortized
 *     - connected: O(α(n)) amortized
 * 
 * Space Complexity: O(n)
 */
public class UnionFind {
    private int[] parent;
    private int[] rank;
    private int[] size;
    
    /**
     * Initialize n isolated sets.
     * 
     * Time: O(n)
     * Space: O(n)
     */
    public UnionFind(int n) {
        parent = new int[n];
        rank = new int[n];
        size = new int[n];
        
        for (int i = 0; i < n; i++) {
            parent[i] = i;  // Each element is its own parent
            rank[i] = 0;
            size[i] = 1;
        }
    }
    
    /**
     * Find the root with path compression.
     * 
     * Time: O(α(n)) amortized
     */
    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);  // Path compression
        }
        return parent[x];
    }
    
    /**
     * Union by rank.
     * 
     * Time: O(α(n)) amortized
     */
    public void union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        
        if (rootX == rootY) return;  // Already in same set
        
        // Union by rank
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
            size[rootY] += size[rootX];
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
            size[rootX] += size[rootY];
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
            size[rootX] += size[rootY];
        }
    }
    
    /**
     * Check if x and y are connected.
     * 
     * Time: O(α(n)) amortized
     */
    public boolean connected(int x, int y) {
        return find(x) == find(y);
    }
    
    /**
     * Get size of component containing x.
     */
    public int componentSize(int x) {
        return size[find(x)];
    }
    
    /**
     * Get number of distinct groups.
     * 
     * Time: O(n * α(n))
     */
    public int groupCount() {
        Set<Integer> roots = new HashSet<>();
        for (int i = 0; i < parent.length; i++) {
            roots.add(find(i));
        }
        return roots.size();
    }
    
    /**
     * Count cycles in undirected graph.
     * 
     * Time: O(E * α(V))
     * Space: O(V)
     */
    public static int countCycles(int n, int[][] edges) {
        UnionFind uf = new UnionFind(n);
        int cycles = 0;
        
        for (int[] edge : edges) {
            int u = edge[0], v = edge[1];
            if (uf.connected(u, v)) {
                cycles++;
            } else {
                uf.union(u, v);
            }
        }
        
        return cycles;
    }
    
    /**
     * Number of Provinces - LeetCode 547
     */
    public static int numberOfProvinces(int[][] isConnected) {
        int n = isConnected.length;
        UnionFind uf = new UnionFind(n);
        
        for (int i = 0; i < n; i++) {
            for (int j = i + 1; j < n; j++) {
                if (isConnected[i][j] == 1) {
                    uf.union(i, j);
                }
            }
        }
        
        return uf.groupCount();
    }
    
    // Main method for testing
    public static void main(String[] args) {
        System.out.println("=".repeat(60));
        System.out.println("Union-Find Demo");
        System.out.println("=".repeat(60));
        
        // Example 1: Basic operations
        UnionFind uf = new UnionFind(5);
        
        System.out.println("\nInitial: 5 isolated sets");
        System.out.println("Find(0): " + uf.find(0) + ", Find(1): " + uf.find(1));
        
        // Union some elements
        uf.union(0, 1);
        uf.union(2, 3);
        uf.union(0, 2);
        
        System.out.println("\nAfter unions (0-1-2-3 connected):");
        System.out.println("Find(0): " + uf.find(0) + ", Find(3): " + uf.find(3));
        System.out.println("Connected(0, 3): " + uf.connected(0, 3));
        System.out.println("Connected(0, 4): " + uf.connected(0, 4));
        System.out.println("Number of groups: " + uf.groupCount());
        System.out.println("Component size of 0: " + uf.componentSize(0));
        
        // Example 2: Cycle detection
        int[][] edges = {{0, 1}, {1, 2}, {2, 0}, {3, 2}};
        System.out.println("\nCycle detection: " + countCycles(4, edges) + " cycle(s)");
        
        // Example 3: Number of provinces
        int[][] isConnected = {
            {1, 1, 0},
            {1, 1, 0},
            {0, 0, 1}
        };
        System.out.println("\nNumber of provinces: " + numberOfProvinces(isConnected));
    }
}
```

<!-- slide -->
```javascript
/**
 * Union-Find (Disjoint Set Union) with path compression and union by rank.
 * 
 * Time Complexities:
 *     - find: O(α(n)) amortized
 *     - union: O(α(n)) amortized
 *     - connected: O(α(n)) amortized
 * 
 * Space Complexity: O(n)
 */
class UnionFind {
    /**
     * Initialize n isolated sets.
     * @param {number} n - Number of elements
     */
    constructor(n) {
        this.parent = new Array(n);
        this.rank = new Array(n);
        this.size = new Array(n);
        
        for (let i = 0; i < n; i++) {
            this.parent[i] = i;  // Each element is its own parent
            this.rank[i] = 0;
            this.size[i] = 1;
        }
    }
    
    /**
     * Find the root with path compression.
     * @param {number} x - Element to find
     * @returns {number} Root of the set
     * 
     * Time: O(α(n)) amortized
     */
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);  // Path compression
        }
        return this.parent[x];
    }
    
    /**
     * Union by rank.
     * @param {number} x - First element
     * @param {number} y - Second element
     * 
     * Time: O(α(n)) amortized
     */
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX === rootY) return;  // Already in same set
        
        // Union by rank
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
            this.size[rootY] += this.size[rootX];
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
            this.size[rootX] += this.size[rootY];
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
            this.size[rootX] += this.size[rootY];
        }
    }
    
    /**
     * Check if x and y are connected.
     * @param {number} x - First element
     * @param {number} y - Second element
     * @returns {boolean} True if connected
     * 
     * Time: O(α(n)) amortized
     */
    connected(x, y) {
        return this.find(x) === this.find(y);
    }
    
    /**
     * Get size of component containing x.
     * @param {number} x - Element to query
     * @returns {number} Size of the component
     */
    componentSize(x) {
        return this.size[this.find(x)];
    }
    
    /**
     * Get number of distinct groups.
     * @returns {number} Number of connected components
     * 
     * Time: O(n * α(n))
     */
    groupCount() {
        const roots = new Set();
        for (let i = 0; i < this.parent.length; i++) {
            roots.add(this.find(i));
        }
        return roots.size;
    }
    
    /**
     * Get all groups as a Map.
     * @returns {Map} Map of root to array of members
     */
    getAllGroups() {
        const groups = new Map();
        for (let i = 0; i < this.parent.length; i++) {
            const root = this.find(i);
            if (!groups.has(root)) {
                groups.set(root, []);
            }
            groups.get(root).push(i);
        }
        return groups;
    }
}

/**
 * Count cycles in undirected graph.
 * @param {number} n - Number of nodes
 * @param {Array} edges - Array of [u, v] pairs
 * @returns {number} Number of cycles
 * 
 * Time: O(E * α(V))
 * Space: O(V)
 */
function countCycles(n, edges) {
    const uf = new UnionFind(n);
    let cycles = 0;
    
    for (const [u, v] of edges) {
        if (uf.connected(u, v)) {
            cycles++;
        } else {
            uf.union(u, v);
        }
    }
    
    return cycles;
}

/**
 * Number of Provinces - LeetCode 547
 * @param {number[][]} isConnected - N x N matrix
 * @returns {number} Number of provinces
 */
function numberOfProvinces(isConnected) {
    const n = isConnected.length;
    if (n === 0) return 0;
    
    const uf = new UnionFind(n);
    
    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {
            if (isConnected[i][j] === 1) {
                uf.union(i, j);
            }
        }
    }
    
    return uf.groupCount();
}


// Example usage and demonstration
console.log("=".repeat(60));
console.log("Union-Find Demo");
console.log("=".repeat(60));

// Example 1: Basic operations
const uf = new UnionFind(5);

console.log("\nInitial: 5 isolated sets");
console.log(`Find(0): ${uf.find(0)}, Find(1): ${uf.find(1)}`);

// Union some elements
uf.union(0, 1);
uf.union(2, 3);
uf.union(0, 2);

console.log("\nAfter unions (0-1-2-3 connected):");
console.log(`Find(0): ${uf.find(0)}, Find(3): ${uf.find(3)}`);
console.log(`Connected(0, 3): ${uf.connected(0, 3)}`);
console.log(`Connected(0, 4): ${uf.connected(0, 4)}`);
console.log(`Number of groups: ${uf.groupCount()}`);
console.log(`Component size of 0: ${uf.componentSize(0)}`);

// Example 2: Cycle detection
const edges = [[0, 1], [1, 2], [2, 0], [3, 2]];
console.log(`\nCycle detection: ${countCycles(4, edges)} cycle(s)`);

// Example 3: Number of provinces
const isConnected = [
    [1, 1, 0],
    [1, 1, 0],
    [0, 0, 1]
];
console.log(`\nNumber of provinces: ${numberOfProvinces(isConnected)}`);
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Initialization** | O(n) | Create parent, rank, and size arrays |
| **find** | O(α(n)) amortized | Find root with path compression |
| **union** | O(α(n)) amortized | Merge two sets with rank |
| **connected** | O(α(n)) amortized | Check if two elements are in same set |
| **get_group_count** | O(n × α(n)) | Count distinct groups |
| **get_all_groups** | O(n × α(n)) | Get all groups as dictionary |

### Detailed Breakdown

- **Without optimizations**: Each operation takes O(n) in the worst case (degenerate tree)
- **With path compression only**: O(log n) amortized
- **With union by rank only**: O(log n) amortized  
- **With both optimizations**: O(α(n)) amortized (inverse Ackermann function)

### Why α(n) is Practically Constant

The inverse Ackermann function α(n) grows extremely slowly:
- For n = 10^6: α(n) ≤ 4
- For n = 10^200: α(n) ≤ 5

This means that for all practical purposes, Union-Find operations take constant time.

---

## Space Complexity Analysis

| Data Structure | Space Complexity |
|----------------|-----------------|
| **parent array** | O(n) |
| **rank array** | O(n) |
| **size array** | O(n) (optional) |
| **Total** | O(n) |

### Space Optimization Options

1. **Use size instead of rank**: Similar performance with slightly different behavior
2. **Remove size array**: If component sizes aren't needed, saves O(n) space
3. **Path compression only**: Use parent array only without rank (slightly worse performance)

---

## Common Variations

### 1. Union by Size

Instead of using rank, track component sizes and always attach smaller to larger:

````carousel
```python
class UnionFindBySize:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
    
    def union(self, x, y):
        root_x, root_y = self.find(x), self.find(y)
        if root_x == root_y:
            return
        
        # Attach smaller to larger
        if self.size[root_x] < self.size[root_y]:
            root_x, root_y = root_y, root_x  # Ensure root_x is larger
        
        self.parent[root_y] = root_x
        self.size[root_x] += self.size[root_y]
```
````

### 2. Weighted Quick Union (with Size)

The classic implementation using size instead of rank for tree height balancing.

### 3. Disjoint Set with Path Halving

During find, make every other node point to its grandparent (less aggressive compression):

````carousel
```python
def find_with_halving(self, x):
    """Path halving - point every other node to grandparent."""
    while self.parent[x] != x:
        self.parent[x] = self.parent[self.parent[x]]  # Point to grandparent
        x = self.parent[x]
    return x
```
````

### 4. Disjoint Set with Path Splitting

Make each node point directly to its parent during traversal (simplest compression):

````carousel
```python
def find_with_splitting(self, x):
    """Path splitting - each node points to its parent."""
    while self.parent[x] != x:
        next_x = self.parent[x]
        self.parent[x] = self.parent[next_x]
        x = next_x
    return x
```
````

### 5. Union-Find with Additional Data

Track extra information for each component:

````carousel
```python
class UnionFindAdvanced:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.size = [1] * n
        self.min_val = list(range(n))  # Minimum value in each component
        self.max_val = list(range(n))  # Maximum value in each component
    
    def union(self, x, y, val_x, val_y):
        # Merge and update min/max values
        # ...
```
````

---

## Practice Problems

### Problem 1: Number of Provinces

**Problem:** [LeetCode 547 - Number of Provinces](https://leetcode.com/problems/number-of-provinces/)

**Description:** You are given an `n × n` matrix `isConnected` where `isConnected[i][j] = 1` if the `i-th` city and the `j-th` city are directly connected, and `0` otherwise. Find the number of provinces (connected components).

**How to Apply Union-Find:**
- Initialize Union-Find with n elements (cities)
- For each pair (i, j) where `isConnected[i][j] = 1`, union the cities
- The answer is the number of distinct groups

---

### Problem 2: Graph Valid Tree

**Problem:** [LeetCode 261 - Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree/)

**Description:** Given n nodes labeled from 0 to n-1 and a list of undirected edges, determine if these edges form a valid tree.

**How to Apply Union-Find:**
- A valid tree has exactly n-1 edges and no cycles
- Process each edge: if it creates a cycle, return false
- After processing all edges, check that group exactly one remains

---

### Problem 3: Number of Connected Components in an Undirected Graph

**Problem:** [LeetCode 323 - Number of Connected Components in an Undirected Graph](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/)

**Description:** Given n nodes and a list of undirected edges, find the number of connected components.

**How to Apply Union-Find:**
- Initialize Union-Find with n nodes
- Process all edges and union connected nodes
- The answer is the number of distinct roots

---

### Problem 4: Most Stones Removed with Same Row or Column

**Problem:** [LeetCode 947 - Most Stones Removed with Same Row or Column](https://leetcode.com/problems/most-stones-removed-with-same-row-or-column/)

**Description:** On a 2D plane, we place n stones. A stone can be removed if it shares either the same row or the same column with another stone. Return the maximum number of stones that can be removed.

**How to Apply Union-Find:**
- Union all stones that share a row or column
- The answer is: total stones - number of connected components

---

### Problem 5: Critical Connections in a Network

**Problem:** [LeetCode 1192 - Critical Connections in a Network](https://leetcode.com/problems/critical-connections-in-a-network/)

**Description:** Given a network of n computers numbered from 0 to n-1, find all critical connections (bridges) whose removal would disconnect the network.

**How to Apply Union-Find:**
- While Union-Find can detect cycles, finding bridges requires Tarjan's algorithm
- Union-Find is useful as a preprocessing step to identify components

---

### Problem 6: Satisfiability of Equality Equations

**Problem:** [LeetCode 990 - Satisfiability of Equality Equations](https://leetcode.com/problems/satisfiability-of-equality-equations/)

**Description:** Given an array of strings equations where equations[i] is "a == b" or "a != b", determine if it's possible to assign values to variables such that all equations are satisfied.

**How to Apply Union-Find:**
- First, process all "==" equations and union the variables
- Then, process all "!=" equations and check if any pair is in the same set (contradiction)

---

## Video Tutorial Links

### Fundamentals

- [Union-Find Algorithm (WilliamFiset)](https://www.youtube.com/watch?v=0jNmHPfAypE) - Complete introduction to Union-Find
- [Disjoint Set Union (Take U Forward)](https://www.youtube.com/watch?v=aBxjDBC4Mvo) - Detailed explanation with implementations
- [Union-Find Pattern (NeetCode)](https://www.youtube.com/watch?v=ymJpUSiZkS4) - Problem-solving pattern

### Advanced Topics

- [Kruskal's Algorithm with Union-Find](https://www.youtube.com/watch?v=4p5JfQdX3Ww) - MST using DSU
- [Path Compression Optimization](https://www.youtube.com/watch?v=W7UtMTV8Tq0) - Deep dive into optimizations
- [Union-Find vs DFS](https://www.youtube.com/watch?v=CB5CpXDQ7hU) - When to use which approach

---

## Follow-up Questions

### Q1: What is the difference between union by rank and union by size?

**Answer:** Both achieve similar performance goals, but:
- **Union by rank**: Uses tree height as the decision factor
- **Union by size**: Uses component size as the decision factor

In practice, they perform almost identically. Some implementations prefer size because it naturally supports the `componentSize()` operation without additional tracking.

### Q2: Can Union-Find handle dynamic element addition?

**Answer:** Yes, but with caveats:
- You can create a new Union-Find with increased capacity
- Or use a hashmap-based implementation for sparse element IDs
- The key challenge is maintaining the inverse Ackermann bound with dynamic resizing

### Q3: Why is path compression alone not enough?

**Answer:** Path compression only optimizes the find operation. Without union by rank, trees can still become unbalanced (linear chains) during union operations. Both optimizations are needed to achieve O(α(n)) performance.

### Q4: How does Union-Find compare to DFS for finding connected components?

**Answer:**
- **Union-Find**: O(V + E × α(V)) - better for incremental edge processing
- **DFS**: O(V + E) - better when all edges are known upfront

Union-Find is preferred when:
- Edges are added dynamically
- You need to frequently check connectivity between arbitrary pairs

DFS is preferred when:
- The entire graph is available at once
- You need to traverse the entire graph anyway

### Q5: What are the limitations of Union-Find?

**Answer:**
- **No path retrieval**: Only tells you if elements are connected, not the path
- **No edge weights**: Cannot handle weighted unions
- **No direct cycle detection for directed graphs**: Only works for undirected cycles
- **Static structure**: Adding vertices after initialization requires rebuilding

---

## Summary

Union-Find (Disjoint Set Union) is an elegant and efficient data structure for managing dynamic connectivity. Key takeaways:

- **Near-constant time operations**: With path compression and union by rank, find and union operations run in O(α(n)) amortized time
- **Simple implementation**: Core logic is just a few lines of code
- **Versatile applications**: Essential for cycle detection, connected components, Kruskal's MST, and many graph problems
- **Space efficient**: Only O(n) space required

When to use:
- ✅ Dynamic connectivity problems
- ✅ Incremental edge processing
- ✅ Frequent connectivity queries
- ✅ Cycle detection in undirected graphs
- ❌ When you need path information (use BFS/DFS)
- ❌ When you need directed cycle detection (use DFS)
- ❌ When you need edge weights (use Prim's or Kruskal's with alternatives)

This data structure is a cornerstone of competitive programming and is frequently asked in technical interviews. Mastering Union-Find will significantly improve your ability to solve graph connectivity problems efficiently.

---

## Related Algorithms

- [Kruskal's Algorithm](./kruskals-mst.md) - Minimum Spanning Tree using Union-Find
- [Cycle Detection](./cycle-detection.md) - Detect cycles in graphs
- [Connected Components](./connected-components.md) - Find connected components in graphs
- [BFS Level Order](./bfs-level-order.md) - Graph traversal alternatives
- [DFS Preorder](./dfs-preorder.md) - Depth-first search for graph traversal
