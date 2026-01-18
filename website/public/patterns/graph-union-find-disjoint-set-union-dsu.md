# Graph - Union-Find (Disjoint Set Union - DSU)

## Overview

Union-Find (Disjoint Set Union - DSU) is a data structure for efficiently managing connectivity between elements. It supports union operations (connecting components) and find operations (checking if elements are connected) with near-constant time complexity.

Use this pattern when you need to:
- Track connected components dynamically
- Solve connectivity problems with union operations
- Implement Kruskal's algorithm for MST
- Handle dynamic graph connectivity queries

Benefits include:
- Near O(1) time for find and union operations
- Efficient for dynamic connectivity
- Simple to implement with optimizations
- Useful for offline algorithms like Kruskal

## Key Concepts

- **Find**: Locate the root/representative of a set
- **Union**: Merge two sets into one
- **Path Compression**: Flatten the tree during find
- **Union by Rank**: Attach smaller tree to larger tree
- **Connected Components**: Each root represents a component

## Template

```python
class UnionFind:
    def __init__(self, size):
        self.parent = list(range(size))
        self.rank = [0] * size
    
    def find(self, x):
        # Path compression
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x != root_y:
            # Union by rank
            if self.rank[root_x] > self.rank[root_y]:
                self.parent[root_y] = root_x
            elif self.rank[root_x] < self.rank[root_y]:
                self.parent[root_x] = root_y
            else:
                self.parent[root_y] = root_x
                self.rank[root_x] += 1
    
    def connected(self, x, y):
        return self.find(x) == self.find(y)

# Usage example
def count_components(n, edges):
    uf = UnionFind(n)
    for u, v in edges:
        uf.union(u, v)
    
    # Count unique roots
    roots = set()
    for i in range(n):
        roots.add(uf.find(i))
    return len(roots)

# Alternative: Count components during union
class UnionFindWithCount:
    def __init__(self, size):
        self.parent = list(range(size))
        self.rank = [0] * size
        self.count = size  # Number of components
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        root_x = self.find(x)
        root_y = self.find(y)
        
        if root_x != root_y:
            if self.rank[root_x] > self.rank[root_y]:
                self.parent[root_y] = root_x
            elif self.rank[root_x] < self.rank[root_y]:
                self.parent[root_x] = root_y
            else:
                self.parent[root_y] = root_x
                self.rank[root_x] += 1
            self.count -= 1  # Components decrease
    
    def get_count(self):
        return self.count
```

## Example Problems

1. **Number of Connected Components in an Undirected Graph (LeetCode 323)**: Count components after unions.
2. **Redundant Connection (LeetCode 684)**: Find the edge that creates a cycle.
3. **Accounts Merge (LeetCode 721)**: Merge accounts based on common emails.

## Time and Space Complexity

- **Time Complexity**: Nearly O(1) amortized for find and union operations.
- **Space Complexity**: O(n) for parent and rank arrays.

## Common Pitfalls

- Forgetting path compression in find operation
- Not using union by rank (can lead to skewed trees)
- Incorrectly counting components (use set or counter)
- Assuming elements are 0-based (handle offset if needed)
- Not initializing parent array correctly