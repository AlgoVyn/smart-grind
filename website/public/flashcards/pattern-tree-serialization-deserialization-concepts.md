## Tree - Serialization & Deserialization: Core Concepts

What are the fundamental principles behind tree serialization?

<!-- front -->

---

### Core Concept

Convert a **hierarchical tree structure into a linear format** that can be stored/transmitted and then reconstruct the exact same tree from that format.

**Key insight**: Trees are inherently recursive - each subtree is itself a tree, making recursive serialization natural.

---

### What Must Be Encoded

| Element | Why Required | Representation |
|---------|--------------|----------------|
| **Node values** | Preserve data | Integer/string values |
| **Tree structure** | Know which nodes exist | Null markers for missing children |
| **Parent-child relationships** | Rebuild correctly | Position in sequence determines relationship |

---

### Why Null Markers Are Essential

Without null markers, multiple trees could produce the same serialization:

```
Tree A:    1         Tree B:    1
          /                     \
         2                       2

Both would serialize as: "1,2" (ambiguous!)

With markers:
Tree A: "1,2,#,#,#"    Tree B: "1,#,2,#,#"  (unique!)
```

**Rule**: Always include explicit markers for null children.

---

### Common Traversal Orders

| Order | Sequence | Best For |
|-------|----------|----------|
| **Preorder** | Root → Left → Right | Deserialization (LeetCode default) |
| **Level Order** | Level by level (BFS) | Visual structure preservation |
| **Postorder** | Left → Right → Root | Not commonly used |
| **Inorder** | Left → Root → Right | Requires extra info (ambiguous alone) |

---

### Use Cases

| Application | Purpose |
|-------------|---------|
| **Data persistence** | Store trees in databases/files |
| **Network transmission** | Send trees across systems |
| **Deep copying** | Create independent tree copies |
| **Distributed computing** | Share tree data between nodes |
| **Caching** | Store tree state for recovery |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| **Time** | O(n) | Visit each node once |
| **Space** | O(n) | Store all values + null markers |
| **Space (recursion)** | O(h) | h = tree height (call stack) |

<!-- back -->
