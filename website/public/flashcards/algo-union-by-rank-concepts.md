## Title: Union Find (Union by Rank) - Core Concepts

What is Union-Find with Union by Rank and Path Compression?

<!-- front -->

---

### Definition
A data structure (Disjoint Set Union) that tracks a collection of disjoint sets with near-constant O(α(n)) amortized operations, where α(n) is the inverse Ackermann function (practically ≤ 4).

| Operation | Complexity |
|-----------|------------|
| **Find** | O(α(n)) ≈ O(1) |
| **Union** | O(α(n)) ≈ O(1) |
| **Connected** | O(α(n)) ≈ O(1) |

---

### Disjoint Set Representation

| Component | Description |
|-----------|-------------|
| **Parent Array** | Stores parent of each element: `parent[i] = j` |
| **Rank/Size** | Approximate height or size of tree: `rank[i] = 2` |
| **Root** | Representative of a set: `parent[i] == i` |

---

### Path Compression

Flattens the tree structure during find operations:

```
Before:  0 → 1 → 2 → 3 (root is 3)
After:   0 → 3
         1 → 3
         2 → 3
```

All nodes directly point to the root after finding.

---

### Union by Rank

Attaches smaller tree to larger tree to maintain balance:

| Rank Comparison | Action | Result |
|----------------|--------|--------|
| rank[x] < rank[y] | Attach x to y | Tree grows at y |
| rank[x] > rank[y] | Attach y to x | Tree grows at x |
| rank[x] == rank[y] | Attach either, increment | Both become equal+1 |

---

### Inverse Ackermann Function

The complexity class achieved with both optimizations:

- α(1) = 1
- α(2) = 2
- α(3) = 3
- α(4) = 4
- α(10^80) = 4

For all practical n, operations are effectively O(1).

<!-- back -->
