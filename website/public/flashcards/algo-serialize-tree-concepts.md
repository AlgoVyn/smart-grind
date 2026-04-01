## Title: Serialize Tree - Core Concepts

What is tree serialization and how does it work?

<!-- front -->

---

### Definition
Converting a binary tree to a string representation that can be stored/transmitted and reconstructed (deserialized) back into the original tree structure.

| Aspect | Description |
|--------|-------------|
| **Purpose** | Persistence, network transmission, deep copy |
| **Challenge** | Encode both values AND structure in linear format |
| **Key Insight** | Preorder traversal + null markers = unique reconstruction |

---

### Traversal Order Comparison

| Traversal | Order | Reconstruction | Null Markers |
|-----------|-------|----------------|--------------|
| **Preorder** | Root → Left → Right | Straightforward | Required |
| **Inorder** | Left → Root → Right | Ambiguous alone | Required |
| **Postorder** | Left → Right → Root | Complex | Required |
| **Level Order** | Level by level | Iterative | Required |

### Why Preorder Works

```
Tree:      1
          / \
         2   3
            /
           4

Without markers: "1,2,3,4" (ambiguous structure)
With markers:    "1,2,null,null,3,4,null,null,null" (unique)
```

**Key Principle:** Root appears before children, enabling deterministic reconstruction.

---

### Null Markers

Special values indicate missing children:

```
Serialization: "1,2,null,null,3,4,null,null,null"

Breakdown:
1         - Root
2         - Left child of 1
null      - Left child of 2 (none)
null      - Right child of 2 (none)
3         - Right child of 1
4         - Left child of 3
null      - Left child of 4
null      - Right child of 4
null      - Right child of 3
```

---

### Space Efficiency

| Format | Space | Readability | Use Case |
|--------|-------|-------------|----------|
| **Comma-separated** | Medium | Low | Standard algorithms |
| **JSON** | High | High | APIs, human-readable |
| **Binary** | Low | None | Storage optimization |
| **Parent-pointer** | Low | Low | Special applications |

<!-- back -->
