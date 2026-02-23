# Union-Find

## Category
Graphs

## Description
Disjoint set data structure for efficient union and find operations.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- graphs related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Explanation

Union-Find (also known as Disjoint Set Union or DSU) is a data structure that tracks a partition of elements into disjoint sets. It supports two main operations:
- **find(x)**: Find the representative/root of the set containing x
- **union(x, y)**: Merge the sets containing x and y

### Key Optimizations:

1. **Path Compression**: During find, make all nodes on the path directly point to the root
2. **Union by Rank**: Always attach the smaller tree under the larger tree

### Why these optimizations matter:
- Without optimizations: O(n) per operation
- With both optimizations: O(α(n)) amortized (inverse Ackermann, practically constant)

### Applications:
- Cycle detection in graphs
- Connected components
- Kruskal's Minimum Spanning Tree
- Image processing (connected components)
- Network connectivity problems

---

## Algorithm Steps

### Initialization:
1. Each element is its own parent (self-loop)
2. Each element has rank/size of 0

### Find with Path Compression:
1. If x is not its own parent, recursively find root
2. Set x's parent directly to the root
3. Return the root

### Union by Rank:
1. Find roots of both elements
2. If same root, they're already in same set
3. Attach smaller rank tree under larger rank tree
4. If equal ranks, increment one rank

---

## Implementation

```python
class UnionFind:
    """Union-Find (Disjoint Set Union) with path compression and union by rank."""
    
    def __init__(self, n: int):
        """
        Initialize n isolated sets.
        
        Args:
            n: Number of elements
            
        Time: O(n)
        Space: O(n)
        """
        self.parent = list(range(n))  # Each element is its own parent
        self.rank = [0] * n  # Rank/size for union by rank
    
    def find(self, x: int) -> int:
        """
        Find the root/representative of set containing x.
        Uses path compression.
        
        Args:
            x: Element to find
            
        Returns:
            Root of the set
            
        Time: O(α(n)) amortized
        """
        if self.parent[x] != x:
            # Path compression: make x point directly to root
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x: int, y: int) -> None:
        """
        Union the sets containing x and y.
        Uses union by rank.
        
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
        elif self.rank[root_x] > self.rank[root_y]:
            self.parent[root_y] = root_x
        else:
            # Same rank, choose one as root and increment rank
            self.parent[root_y] = root_x
            self.rank[root_x] += 1
    
    def connected(self, x: int, y: int) -> bool:
        """
        Check if x and y are in the same set.
        
        Args:
            x: First element
            y: Second element
            
        Returns:
            True if x and y are connected
            
        Time: O(α(n))
        """
        return self.find(x) == self.find(y)
    
    def get_group_count(self) -> int:
        """Get the number of distinct groups."""
        groups = set()
        for i in range(len(self.parent)):
            groups.add(self.find(i))
        return len(groups)


def count_cycles(n: int, edges: list) -> int:
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


# Example usage
if __name__ == "__main__":
    # Example 1: Basic operations
    uf = UnionFind(5)
    
    print("Initial: 5 isolated sets")
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
    
    # Example 2: Cycle detection
    n = 4
    edges = [[0, 1], [1, 2], [2, 0], [3, 2]]  # Triangle + extra edge
    print(f"\nCycle detection: {count_cycles(n, edges)} cycle(s)")

```javascript
function unionFind() {
    // Union-Find implementation
    // Time: O(α(n)) amortized
    // Space: O(n)
}
```

---

## Example

**Input:**
```python
uf = UnionFind(5)
uf.union(0, 1)
uf.union(2, 3)
uf.union(0, 2)
```

**Output:**
```
Initial: 5 isolated sets
Find(0): 0, Find(1): 1

After unions (0-1-2-3 connected):
Find(0): 0, Find(3): 0
Connected(0, 3): True
Connected(0, 4): False
Number of groups: 2
```

**Explanation:**
- Initially: {0}, {1}, {2}, {3}, {4} (5 groups)
- After union(0, 1): {0, 1}, {2}, {3}, {4}
- After union(2, 3): {0, 1}, {2, 3}, {4}
- After union(0, 2): {0, 1, 2, 3}, {4} (2 groups)

**Cycle Detection Example:**
```python
n = 4
edges = [[0, 1], [1, 2], [2, 0], [3, 2]]
# Graph: 0 -- 1 -- 2 -- 0 (triangle) + 2 -- 3
print(count_cycles(n, edges))
# Output: 1 (one cycle in the triangle)
```

**Union-Find Tree Structure:**
```
Initially:          After union operations:
   0                  0
   |                  |
   1                  1
                      \
   2                  2
   |                  |
   3                  3
   
   4                  4

With path compression (find(3)):
   0
  /|\
 1 2 3
 |
 4
```

---

## Time Complexity
**O(α(n)) amortized**

---

## Space Complexity
**O(n)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
