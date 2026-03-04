# Union Find (Disjoint Set Union)

## Category
Advanced

## Description

Union-Find (also known as Disjoint Set Union or DSU) is a data structure that tracks a collection of disjoint sets. When combined with **Union by Rank** and **Path Compression**, it provides almost constant time O(α(n)) amortized operations, making it one of the most efficient data structures in computer science. The inverse Ackermann function α(n) is so small that it's practically considered constant (always ≤ 4 for any realistic value of n).

---

## When to Use

Use Union-Find with Union by Rank and Path Compression when you need to solve problems involving:

- **Dynamic Connectivity**: Tracking which elements are connected in a network
- **Cycle Detection**: In graphs, especially for Kruskal's minimum spanning tree algorithm
- **Graph Clustering**: Grouping related elements into connected components
- **Image Processing**: Connected component labeling in binary images
- **Social Network Friend Groups**: Finding friend circles or connected groups
- **Equation Solving**: Union-find can model equivalence relations

### Comparison with Alternatives

| Data Structure | Find | Union | Space | Best Use Case |
|----------------|------|-------|-------|---------------|
| **Union-Find (Optimized)** | O(α(n)) | O(α(n)) | O(n) | Dynamic connectivity, infrequent updates |
| **Adjacency List + DFS** | O(V+E) | N/A | O(V+E) | Static connectivity queries |
| **Adjacency Matrix** | O(V²) | O(1) | O(V²) | Dense graphs, small V |
| **Disjoint Set (Naive)** | O(n) | O(n) | O(n) | Never use in practice |

### When to Choose Union-Find vs Other Approaches

- **Choose Union-Find** when:
  - You have many union and find operations
  - The graph is dynamic (edges added over time)
  - You need to track connected components efficiently
  - Memory is a concern (O(n) vs O(V²))

- **Choose DFS/BFS** when:
  - You only need to query connectivity once
  - The graph is completely built before queries
  - You need to find the actual path between nodes

---

## Algorithm Explanation

### Core Concept

The key insight behind Union-Find is to maintain a **forest** (collection of trees), where each tree represents a connected component. Each element points to its parent, and the root of each tree serves as the representative of that set. By using two powerful optimizations—**Union by Rank** and **Path Compression**—we achieve near-constant time operations.

### Key Components

1. **Parent Array**: `parent[i]` stores the parent of element `i`. If `parent[i] == i`, then `i` is a root.

2. **Find Operation**: Locates the root/representative of the set containing element `x`. With path compression, all nodes along the path to the root point directly to the root.

3. **Union Operation**: Merges two sets by attaching the root of the smaller tree to the root of the larger tree (union by rank).

4. **Rank**: An approximate height of the tree (or size) used to keep trees balanced. Using rank instead of size gives slightly better theoretical guarantees.

### How It Works

#### Find with Path Compression:
```
Before:  0 → 1 → 2 → 3 (root is 3)
After:   0 → 3
         1 → 3
         2 → 3
```
All nodes directly point to the root, flattening the tree.

#### Union by Rank:
```
Tree A (rank 2):     Tree B (rank 1):
    0                    5
    │                    │
    1                    6
    │
    2

Union: Attach smaller (B) to larger (A)
Result:
    0
    │
    1
    │
    2
    │
    5
    │
    6
```

### Why It's Efficient

| Optimization | Complexity | Description |
|--------------|------------|-------------|
| No optimization | O(n) | Simple tree, linear time |
| Path compression only | O(log* n) | Iterated logarithm, very slow growth |
| Union by rank only | O(log n) | Balanced trees |
| Both optimizations | O(α(n)) | Inverse Ackermann, practically constant |

The inverse Ackermann function α(n) is:
- α(1) = 1
- α(2) = 2
- α(3) = 3
- α(4) = 4
- α(10^80) = 4

This means for any practical n, the operations are essentially O(1)!

---

## Algorithm Steps

### Initialization

1. Create a parent array where `parent[i] = i` (each element is its own root)
2. Create a rank/size array initialized to 0

### Find Operation (with Path Compression)

1. If `parent[x] != x`, recursively find the root
2. Set `parent[x] = find(parent[x])` (path compression)
3. Return the root

### Union Operation (by Rank)

1. Find roots of both elements: `rootX = find(x)`, `rootY = find(y)`
2. If roots are equal, elements are already in the same set
3. If ranks differ: attach lower rank tree to higher rank tree
4. If ranks are equal: attach one to the other and increment rank

### Connected Query

1. Simply check if `find(x) == find(y)`

---

## Implementation

### Template Code (Union Find with Rank + Path Compression)

````carousel
```python
from typing import List, Optional

class UnionFind:
    """
    Union-Find (Disjoint Set Union) with Union by Rank and Path Compression.
    
    Time Complexities:
        - Find: O(α(n)) amortized
        - Union: O(α(n)) amortized
        - Connected: O(α(n)) amortized
    
    Space Complexity: O(n)
    
    The inverse Ackermann function α(n) is practically constant (≤4 for all n).
    """
    
    def __init__(self, n: int):
        """
        Initialize Union-Find data structure.
        
        Args:
            n: Number of elements (0 to n-1)
        """
        self.parent = list(range(n))
        self.rank = [0] * n  # Using rank (approximate height)
    
    def find(self, x: int) -> int:
        """
        Find the root/representative of x with path compression.
        
        Path compression makes every node on the find path 
        point directly to the root.
        
        Args:
            x: Element to find root for
        
        Returns:
            Root of the set containing x
        """
        if self.parent[x] != x:
            # Path compression: recursively find root and flatten tree
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x: int, y: int) -> None:
        """
        Union two sets by rank (union by size).
        
        Attaches the smaller tree to the larger tree to keep
        the structure balanced.
        
        Args:
            x: First element
            y: Second element
        """
        root_x = self.find(x)
        root_y = self.find(y)
        
        # Already in same set - nothing to do
        if root_x == root_y:
            return
        
        # Union by rank: attach smaller tree to larger tree
        if self.rank[root_x] < self.rank[root_y]:
            # root_x has smaller rank, attach to root_y
            self.parent[root_x] = root_y
        elif self.rank[root_x] > self.rank[root_y]:
            # root_y has smaller rank, attach to root_x
            self.parent[root_y] = root_x
        else:
            # Same rank, choose one as root and increment its rank
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
    
    def connected(self, x: int, y: int) -> bool:
        """
        Check if x and y are in the same set.
        
        Args:
            x: First element
            y: Second element
        
        Returns:
            True if x and y are connected (in the same set)
        """
        return self.find(x) == self.find(y)
    
    def get_num_components(self) -> int:
        """Get the number of separate components."""
        # Count unique roots
        roots = set(self.find(i) for i in range(len(self.parent)))
        return len(roots)
    
    def get_component_size(self, x: int) -> int:
        """Get the size of the component containing x."""
        root = self.find(x)
        return sum(1 for i in range(len(self.parent)) if self.find(i) == root)


# Example usage and demonstration
if __name__ == "__main__":
    n = 10
    uf = UnionFind(n)
    
    print(f"Union-Find initialized with {n} elements")
    print(f"Initial components: {uf.get_num_components()}")
    print()
    
    # Perform unions
    unions = [(0, 1), (2, 3), (4, 5), (6, 7), (0, 2), (4, 6)]
    
    print("Union operations:")
    for x, y in unions:
        uf.union(x, y)
        print(f"  union({x}, {y}) -> connected({x}, {y}) = {uf.connected(x, y)}")
    
    print()
    print("Connectivity queries:")
    print(f"  connected(0, 1): {uf.connected(0, 1)}  (same component)")
    print(f"  connected(0, 3): {uf.connected(0, 3)}  (connected via 0-2)")
    print(f"  connected(0, 5): {uf.connected(0, 5)}  (connected via unions)")
    print(f"  connected(8, 9): {uf.connected(8, 9)}  (different components)")
    print(f"  connected(3, 7): {uf.connected(3, 7)}  (both in first group)")
    
    print()
    print(f"Number of components: {uf.get_num_components()}")
    print(f"Component sizes: 0->{uf.get_component_size(0)}, 4->{uf.get_component_size(4)}, 8->{uf.get_component_size(8)}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <numeric>
using namespace std;

/**
 * Union-Find (Disjoint Set Union) with Union by Rank and Path Compression.
 * 
 * Time Complexities:
 *     - Find: O(α(n)) amortized
 *     - Union: O(α(n)) amortized
 *     - Connected: O(α(n)) amortized
 * 
 * Space Complexity: O(n)
 */
class UnionFind {
private:
    vector<int> parent;
    vector<int> rank;
    int components;
    
public:
    UnionFind(int n) : parent(n), rank(n, 0), components(n) {
        // Initialize: each element is its own parent
        iota(parent.begin(), parent.end(), 0);
    }
    
    /**
     * Find the root with path compression.
     * Makes every node point directly to the root.
     */
    int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);  // Path compression
        }
        return parent[x];
    }
    
    /**
     * Union two sets by rank.
     * Attaches smaller tree to larger tree.
     */
    void unionSets(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        
        if (rootX == rootY) return;  // Already in same set
        
        // Union by rank
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        
        components--;
    }
    
    /**
     * Check if two elements are connected.
     */
    bool connected(int x, int y) {
        return find(x) == find(y);
    }
    
    /**
     * Get number of separate components.
     */
    int getNumComponents() const {
        return components;
    }
    
    /**
     * Get size of component containing x.
     */
    int getComponentSize(int x) {
        int root = find(x);
        int size = 0;
        for (int i = 0; i < parent.size(); i++) {
            if (find(i) == root) size++;
        }
        return size;
    }
};

int main() {
    int n = 10;
    UnionFind uf(n);
    
    cout << "Union-Find initialized with " << n << " elements" << endl;
    cout << "Initial components: " << uf.getNumComponents() << endl << endl;
    
    // Perform unions
    vector<pair<int,int>> unions = {{0,1}, {2,3}, {4,5}, {6,7}, {0,2}, {4,6}};
    
    cout << "Union operations:" << endl;
    for (auto [x, y] : unions) {
        uf.unionSets(x, y);
        cout << "  union(" << x << ", " << y << ") -> connected(" << x << ", " << y << ") = " 
             << (uf.connected(x, y) ? "true" : "false") << endl;
    }
    
    cout << endl << "Connectivity queries:" << endl;
    cout << "  connected(0, 1): " << uf.connected(0, 1) << endl;
    cout << "  connected(0, 3): " << uf.connected(0, 3) << endl;
    cout << "  connected(0, 5): " << uf.connected(0, 5) << endl;
    cout << "  connected(8, 9): " << uf.connected(8, 9) << endl;
    cout << "  connected(3, 7): " << uf.connected(3, 7) << endl;
    
    cout << endl << "Number of components: " << uf.getNumComponents() << endl;
    cout << "Component sizes: 0->" << uf.getComponentSize(0) 
         << ", 4->" << uf.getComponentSize(4) 
         << ", 8->" << uf.getComponentSize(8) << endl;
    
    return 0;
}
```

<!-- slide -->
```java
/**
 * Union-Find (Disjoint Set Union) with Union by Rank and Path Compression.
 * 
 * Time Complexities:
 *     - Find: O(α(n)) amortized
 *     - Union: O(α(n)) amortized
 *     - Connected: O(α(n)) amortized
 * 
 * Space Complexity: O(n)
 */
public class UnionFind {
    private int[] parent;
    private int[] rank;
    private int components;
    
    /**
     * Initialize Union-Find with n elements.
     * 
     * @param n Number of elements (0 to n-1)
     */
    public UnionFind(int n) {
        this.parent = new int[n];
        this.rank = new int[n];
        this.components = n;
        
        // Each element is its own parent initially
        for (int i = 0; i < n; i++) {
            parent[i] = i;
            rank[i] = 0;
        }
    }
    
    /**
     * Find the root with path compression.
     * Makes every node on the find path point directly to the root.
     * 
     * @param x Element to find root for
     * @return Root of the set containing x
     */
    public int find(int x) {
        if (parent[x] != x) {
            parent[x] = find(parent[x]);  // Path compression
        }
        return parent[x];
    }
    
    /**
     * Union two sets by rank.
     * Attaches the smaller tree to the larger tree.
     * 
     * @param x First element
     * @param y Second element
     */
    public void union(int x, int y) {
        int rootX = find(x);
        int rootY = find(y);
        
        if (rootX == rootY) return;  // Already in same set
        
        // Union by rank
        if (rank[rootX] < rank[rootY]) {
            parent[rootX] = rootY;
        } else if (rank[rootX] > rank[rootY]) {
            parent[rootY] = rootX;
        } else {
            parent[rootY] = rootX;
            rank[rootX]++;
        }
        
        components--;
    }
    
    /**
     * Check if x and y are in the same set.
     * 
     * @param x First element
     * @param y Second element
     * @return true if connected
     */
    public boolean connected(int x, int y) {
        return find(x) == find(y);
    }
    
    /**
     * Get the number of separate components.
     * 
     * @return Number of components
     */
    public int getNumComponents() {
        return components;
    }
    
    /**
     * Get the size of the component containing x.
     * 
     * @param x Element to check
     * @return Size of component
     */
    public int getComponentSize(int x) {
        int root = find(x);
        int size = 0;
        for (int i = 0; i < parent.length; i++) {
            if (find(i) == root) size++;
        }
        return size;
    }
    
    // Test the implementation
    public static void main(String[] args) {
        int n = 10;
        UnionFind uf = new UnionFind(n);
        
        System.out.println("Union-Find initialized with " + n + " elements");
        System.out.println("Initial components: " + uf.getNumComponents());
        System.out.println();
        
        // Perform unions
        int[][] unions = {{0,1}, {2,3}, {4,5}, {6,7}, {0,2}, {4,6}};
        
        System.out.println("Union operations:");
        for (int[] pair : unions) {
            int x = pair[0], y = pair[1];
            uf.union(x, y);
            System.out.printf("  union(%d, %d) -> connected(%d, %d) = %b%n", 
                              x, y, x, y, uf.connected(x, y));
        }
        
        System.out.println();
        System.out.println("Connectivity queries:");
        System.out.println("  connected(0, 1): " + uf.connected(0, 1));
        System.out.println("  connected(0, 3): " + uf.connected(0, 3));
        System.out.println("  connected(0, 5): " + uf.connected(0, 5));
        System.out.println("  connected(8, 9): " + uf.connected(8, 9));
        System.out.println("  connected(3, 7): " + uf.connected(3, 7));
        
        System.out.println();
        System.out.println("Number of components: " + uf.getNumComponents());
        System.out.printf("Component sizes: 0->%d, 4->%d, 8->%d%n", 
                          uf.getComponentSize(0), 
                          uf.getComponentSize(4), 
                          uf.getComponentSize(8));
    }
}
```

<!-- slide -->
```javascript
/**
 * Union-Find (Disjoint Set Union) with Union by Rank and Path Compression.
 * 
 * Time Complexities:
 *     - Find: O(α(n)) amortized
 *     - Union: O(α(n)) amortized
 *     - Connected: O(α(n)) amortized
 * 
 * Space Complexity: O(n)
 * 
 * The inverse Ackermann function α(n) is practically constant (≤4 for all n).
 */
class UnionFind {
    /**
     * Initialize Union-Find with n elements.
     * @param {number} n - Number of elements (0 to n-1)
     */
    constructor(n) {
        this.parent = new Array(n);
        this.rank = new Array(n);
        this.components = n;
        
        // Each element is its own parent initially
        for (let i = 0; i < n; i++) {
            this.parent[i] = i;
            this.rank[i] = 0;
        }
    }
    
    /**
     * Find the root with path compression.
     * Makes every node on the find path point directly to the root.
     * @param {number} x - Element to find root for
     * @returns {number} Root of the set containing x
     */
    find(x) {
        if (this.parent[x] !== x) {
            this.parent[x] = this.find(this.parent[x]);  // Path compression
        }
        return this.parent[x];
    }
    
    /**
     * Union two sets by rank.
     * Attaches the smaller tree to the larger tree.
     * @param {number} x - First element
     * @param {number} y - Second element
     */
    union(x, y) {
        const rootX = this.find(x);
        const rootY = this.find(y);
        
        if (rootX === rootY) return;  // Already in same set
        
        // Union by rank: attach smaller tree to larger tree
        if (this.rank[rootX] < this.rank[rootY]) {
            this.parent[rootX] = rootY;
        } else if (this.rank[rootX] > this.rank[rootY]) {
            this.parent[rootY] = rootX;
        } else {
            this.parent[rootY] = rootX;
            this.rank[rootX]++;
        }
        
        this.components--;
    }
    
    /**
     * Check if x and y are in the same set.
     * @param {number} x - First element
     * @param {number} y - Second element
     * @returns {boolean} True if connected
     */
    connected(x, y) {
        return this.find(x) === this.find(y);
    }
    
    /**
     * Get the number of separate components.
     * @returns {number} Number of components
     */
    getNumComponents() {
        return this.components;
    }
    
    /**
     * Get the size of the component containing x.
     * @param {number} x - Element to check
     * @returns {number} Size of component
     */
    getComponentSize(x) {
        const root = this.find(x);
        let size = 0;
        for (let i = 0; i < this.parent.length; i++) {
            if (this.find(i) === root) size++;
        }
        return size;
    }
}

// Example usage and demonstration
const n = 10;
const uf = new UnionFind(n);

console.log(`Union-Find initialized with ${n} elements`);
console.log(`Initial components: ${uf.getNumComponents()}`);
console.log();

// Perform unions
const unions = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [4, 6]];

console.log("Union operations:");
for (const [x, y] of unions) {
    uf.union(x, y);
    console.log(`  union(${x}, ${y}) -> connected(${x}, ${y}) = ${uf.connected(x, y)}`);
}

console.log();
console.log("Connectivity queries:");
console.log(`  connected(0, 1): ${uf.connected(0, 1)}  (same component)`);
console.log(`  connected(0, 3): ${uf.connected(0, 3)}  (connected via 0-2)`);
console.log(`  connected(0, 5): ${uf.connected(0, 5)}  (connected via unions)`);
console.log(`  connected(8, 9): ${uf.connected(8, 9)}  (different components)`);
console.log(`  connected(3, 7): ${uf.connected(3, 7)}  (both in first group)`);

console.log();
console.log(`Number of components: ${uf.getNumComponents()}`);
console.log(`Component sizes: 0->${uf.getComponentSize(0)}, 4->${uf.getComponentSize(4)}, 8->${uf.getComponentSize(8)}`);
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Initialize** | O(n) | Create parent and rank arrays |
| **Find** | O(α(n)) amortized | Path compression flattens tree |
| **Union** | O(α(n)) amortized | Find + attach by rank |
| **Connected** | O(α(n)) amortized | Two find operations |
| **Get Components** | O(n) | Requires scanning all elements |

### Detailed Breakdown

- **Without optimization**: O(n) per operation (worst case becomes a linked list)
- **With path compression only**: O(log* n) - iterated logarithm, very slow growth
- **With union by rank only**: O(log n) - trees stay balanced
- **With both optimizations**: O(α(n)) - inverse Ackermann function

The inverse Ackermann function grows extremely slowly:
- α(1) = 1
- α(2) = 2  
- α(3) = 3
- α(4) = 4
- α(2^65536) = 4

For all practical purposes, α(n) ≤ 4, making these operations effectively O(1)!

---

## Space Complexity Analysis

| Data Structure | Space | Description |
|----------------|-------|-------------|
| **Parent Array** | O(n) | Stores parent index for each element |
| **Rank Array** | O(n) | Stores rank/size for each element |
| **Total** | O(n) | Two integer arrays of size n |

### Space Optimization Options

1. **Union by Size**: Use single array combining parent and size (store negative size at root)
2. **Compressed Representation**: For very large n, consider memory-mapped structures

---

## Common Variations

### 1. Union by Size (Simpler Variant)

Instead of rank, use the size of the tree. The root stores the negative size.

````carousel
```python
class UnionFindBySize:
    """Union-Find using size instead of rank."""
    
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n  # Track size at root
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        rootX, rootY = self.find(x), self.find(y)
        if rootX == rootY: return
        
        # Attach smaller to larger by size
        if self.size[rootX] < self.size[rootY]:
            rootX, rootY = rootY, rootX
        
        self.parent[rootY] = rootX
        self.size[rootX] += self.size[rootY]
```
````

### 2. Iterative Find (Avoids Stack Overflow)

For very deep trees, use iterative approach:

````carousel
```python
def find_iterative(self, x):
    """Iterative find with path compression."""
    root = x
    while self.parent[root] != root:
        root = self.parent[root]
    
    # Path compression: point all nodes to root
    while self.parent[x] != root:
        next_parent = self.parent[x]
        self.parent[x] = root
        x = next_parent
    
    return root
```
````

### 3. Union-Find with Additional Data

Track additional information per component:

````carousel
```python
class UnionFindWithData:
    """Union-Find with component size and member tracking."""
    
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
        self.size = [1] * n
        self.max_val = list(range(n))  # Max value in component
        self.min_val = list(range(n))  # Min value in component
    
    def union(self, x, y):
        rootX, rootY = self.find(x), self.find(y)
        if rootX == rootY: return
        
        # Union by rank
        if self.rank[rootX] < self.rank[rootY]:
            rootX, rootY = rootY, rootX
        
        self.parent[rootY] = rootX
        self.size[rootX] += self.size[rootY]
        self.max_val[rootX] = max(self.max_val[rootX], self.max_val[rootY])
        self.min_val[rootX] = min(self.min_val[rootX], self.min_val[rootY])
        
        if self.rank[rootX] == self.rank[rootY]:
            self.rank[rootX] += 1
```
````

### 4. Weighted Quick Union (Classic Variant)

The original algorithm by Tarjan using size weighting:

````carousel
```python
class WeightedQuickUnion:
    """Weighted Quick Union with path compression (classic)."""
    
    def __init__(self, n):
        self.parent = list(range(n))
        self.sz = [1] * n
    
    def find(self, p):
        """Find root with path compression."""
        while p != self.parent[p]:
            self.parent[p] = self.parent[self.parent[p]]  # Halving
            p = self.parent[p]
        return p
    
    def union(self, p, q):
        """Weighted union: attach smaller to larger."""
        rootP, rootQ = self.find(p), self.find(q)
        if rootP == rootQ: return
        
        if self.sz[rootP] < self.sz[rootQ]:
            self.parent[rootP] = rootQ
            self.sz[rootQ] += self.sz[rootP]
        else:
            self.parent[rootQ] = rootP
            self.sz[rootP] += self.sz[rootQ]
```
````

---

## Practice Problems

### Problem 1: Number of Connected Components

**Problem:** [LeetCode 323 - Number of Connected Components in an Undirected Graph](https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/)

**Description:** Given n nodes labeled from 0 to n-1 and a list of undirected edges, write a function to count the number of connected components.

**How to Apply Union-Find:**
- Initialize UnionFind with n elements
- For each edge (u, v), call union(u, v)
- The answer is the number of components after all unions
- Time: O(n + m·α(n)) where m is number of edges

---

### Problem 2: Graph Valid Tree

**Problem:** [LeetCode 261 - Graph Valid Tree](https://leetcode.com/problems/graph-valid-tree/)

**Description:** Given n nodes labeled from 0 to n-1 and a list of undirected edges, determine if these edges form a valid tree.

**How to Apply Union-Find:**
- A valid tree has exactly n-1 edges and all nodes are connected
- Use Union-Find to detect cycles during edge processing
- If adding an edge connects two already-connected nodes, it's a cycle
- After processing all edges, check if exactly one component remains

---

### Problem 3: Longest Consecutive Sequence

**Problem:** [LeetCode 128 - Longest Consecutive Sequence](https://leetcode.com/problems/longest-consecutive-sequence/)

**Description:** Given an unsorted array of integers, find the length of the longest consecutive sequence.

**How to Apply Union-Find:**
- Use Union-Find to group consecutive numbers
- For each number num, union with num+1 if it exists in the map
- Track component sizes to find the maximum
- Alternatively: use hash set for O(n) solution, but Union-Find provides alternative approach

---

### Problem 4: Number of Islands II

**Problem:** [LeetCode 305 - Number of Islands II](https://leetcode.com/problems/number-of-islands-ii/)

**Description:** Given a 2D grid of water and land positions, add m lands one by one. Return the number of islands after each addition.

**How to Apply Union-Find:**
- Each land position is initially water (not connected)
- When adding land at (r, c), create a new component
- Check 4 neighbors and union with any adjacent land
- Track number of components dynamically
- Perfect use case for Union-Find's dynamic nature

---

### Problem 5: Critical Connections in a Network

**Problem:** [LeetCode 1192 - Critical Connections in a Network](https://leetcode.com/problems/critical-connections-in-a-network/)

**Description:** Given a network of n servers labeled from 0 to n-1, find all critical connections in the network (bridges).

**How to Apply Union-Find:**
- While Union-Find alone isn't ideal for bridges, it's useful for the overall connectivity
- Use DFS/Tarjan's algorithm for finding actual bridges
- Union-Find can help verify connectivity after removing edges
- This problem demonstrates when NOT to use Union-Find alone

---

## Video Tutorial Links

### Fundamentals

- [Union-Find Introduction (Take U Forward)](https://www.youtube.com/watch?v=akkDEpRqNo4) - Comprehensive introduction to Union-Find
- [Disjoint Set Union (WilliamFiset)](https://www.youtube.com/watch?v=ID00PMy4-6E) - Detailed explanation with visualizations
- [Union Find Pattern (NeetCode)](https://www.youtube.com/watch?v=II5r7m6N1Rk) - Practical implementation guide

### Advanced Topics

- [Union-Find with Path Compression](https://www.youtube.com/watch?v=z2K2w8i4NQ0) - Deep dive into optimization
- [Kruskal's Algorithm using Union-Find](https://www.youtube.com/watch?v=4uQ6f3NfF8A) - MST with DSU
- [Union-Find vs DFS for Connectivity](https://www.youtube.com/watch?v=CB5Pp6gCAco) - When to use which

---

## Follow-up Questions

### Q1: What is the difference between union by rank and union by size?

**Answer:** Both achieve similar results, but:
- **Union by rank**: Uses tree height (rank) as the heuristic. Ranks are integers that don't necessarily equal tree size but provide good approximation. Theoretical guarantee: O(log n) depth.
- **Union by size**: Uses actual component size. Simpler to implement (store negative size at root). In practice, performs similarly to rank.

Both combined with path compression give O(α(n)) complexity.

### Q2: Why is path compression so effective?

**Answer:** Path compression works because it "flattens" the tree during find operations. Consider a tree of height h:
- After one find on a leaf, all nodes on that path point directly to root
- This dramatically reduces future find costs
- The amortized cost becomes α(n), which grows slower than any iterative logarithm

### Q3: Can Union-Find handle dynamic connectivity queries efficiently?

**Answer:** Yes! Union-Find is specifically designed for dynamic connectivity:
- Adding edges (union): O(α(n))
- Querying connectivity: O(α(n))
- However, it cannot efficiently handle edge deletions (removing edges requires rebuilding)

For problems requiring edge deletions, consider using dynamic connectivity algorithms like Link-Cut trees.

### Q4: What is the maximum n that Union-Find can handle?

**Answer:** With O(n) space:
- Memory: Each element needs 2 integers (parent + rank/size) = 8 bytes typically
- For 1GB memory: ~125 million elements
- Time: Each operation is O(α(n)) ≈ O(1), so even billions of operations are fast

### Q5: How does Union-Find compare to adjacency list + DFS?

**Answer:**
- **Union-Find**: Better for many union operations, dynamic graphs, tracking components
- **Adjacency List + DFS**: Better for single-pass connectivity checks, finding actual paths

Use Union-Find when you have many connectivity queries or union operations. Use DFS when you need to traverse the actual graph structure.

---

## Summary

Union-Find with Union by Rank and Path Compression is one of the most efficient data structures for managing dynamic connectivity. Key takeaways:

- **Near-constant time**: O(α(n)) amortized for all operations - effectively O(1)
- **Two key optimizations**: Path compression (flattening trees) + Union by rank (balancing)
- **Simple implementation**: Just two arrays and two main operations
- **Memory efficient**: O(n) space - just parent and rank arrays
- **Dynamic connectivity**: Perfect for tracking connected components as edges are added
- **Applications**: Cycle detection, Kruskal's MST, clustering, image processing

When to use:
- ✅ Dynamic connectivity with many union/find operations
- ✅ Cycle detection in undirected graphs
- ✅ Clustering and grouping problems
- ✅ Kruskal's minimum spanning tree
- ❌ When you need to find actual paths (use BFS/DFS)
- ❌ When edges are frequently removed (use Link-Cut trees)

This data structure is essential for competitive programming and technical interviews, especially in problems involving dynamic connectivity and graph algorithms.

---

## Related Algorithms

- [Kruskal's Algorithm](./kruskals.md) - Minimum spanning tree using Union-Find
- [Detect Cycle](./detect-cycle.md) - Cycle detection in graphs
- [Graph BFS](./graph-bfs.md) - Alternative connectivity approach
- [Graph DFS](./graph-dfs.md) - Alternative connectivity approach
