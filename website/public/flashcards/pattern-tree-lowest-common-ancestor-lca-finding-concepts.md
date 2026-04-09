## LCA Finding: Core Concepts

What are the fundamental principles of LCA finding?

<!-- front -->

---

### Core Concept

**The LCA is the deepest node that is an ancestor of both given nodes.**

**Key Tree Property:** Every node has exactly one parent (except root). The LCA is where paths from both nodes to root converge.

---

### Visual Intuition

```
        A
       / \
      B   C
     / \   \
    D   E   F

For nodes D and E:
  - Path D → root: D → B → A
  - Path E → root: E → B → A
  - Convergence at B → B is LCA

For nodes D and F:
  - Path D → root: D → B → A
  - Path F → root: F → C → A
  - Convergence at A → A is LCA
```

---

### Key Observations

1. **Recursive Structure**: Trees have natural recursion - exploit it
2. **Base Cases**:
   - `node is None` → return None
   - `node is p` or `node is q` → return node
3. **LCA Property**: Node is LCA if one target in left subtree, other in right
4. **Bottom-Up**: Children must be processed before parent decision

---

### Special Cases

| Case | Behavior |
|------|----------|
| One node is ancestor of other | Return the ancestor |
| Same node (p = q) | Return that node |
| One node not in tree | Return the other node (if found) |
| Neither in tree | Return None |

---

### Applications

| Domain | Use Case |
|--------|----------|
| Version Control | Common ancestor in file versioning (Git) |
| Network Topology | Finding meeting points in routing |
| Bioinformatics | Common ancestors in evolutionary trees |
| Game Development | Lowest common boss in hierarchy |

<!-- back -->
