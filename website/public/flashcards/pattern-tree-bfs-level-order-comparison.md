## Tree - BFS Level Order: Comparison

When should you use BFS level order versus DFS traversal?

<!-- front -->

---

### BFS vs DFS Comparison

| Aspect | BFS (Level Order) | DFS |
|--------|-------------------|-----|
| **Order** | Level by level | Depth first |
| **Space** | O(w) - max width | O(h) - height |
| **Shortest path** | Finds immediately | May explore deeper first |
| **Complete traversal** | Same O(n) | Same O(n) |
| **Skewed tree space** | O(1) best case | O(n) worst case |
| **Wide tree space** | O(n) worst case | O(log n) best case |

**Winner**: BFS for shortest path/level-related, DFS for depth/space-constrained

---

### When to Use BFS Level Order

**Use when:**
- Finding shortest path (minimum depth)
- Processing by levels (averages, level-specific)
- Right/left side view problems
- Level connectivity problems
- Nodes at same depth matter

**Don't use when:**
- Space is severely constrained and tree is wide
- Only need path information (DFS with backtracking)
- Tree is extremely deep (stack overflow for DFS)

---

### Comparison with Other Tree Traversals

| Traversal | Order | Space | Best For |
|-----------|-------|-------|----------|
| **BFS Level** | Level by level | O(w) | Shortest path, level properties |
| **DFS Inorder** | Left-Root-Right | O(h) | BST sorted order |
| **DFS Preorder** | Root-Left-Right | O(h) | Copy, serialize tree |
| **DFS Postorder** | Left-Right-Root | O(h) | Delete, bottom-up DP |

---

### Decision Tree

```
Tree traversal problem?
├── Yes → Need shortest path/minimum depth?
│   ├── Yes → BFS LEVEL ORDER
│   └── No → BST related?
│       ├── Yes → DFS INORDER
│       └── No → Serialize/copy?
│           ├── Yes → DFS PREORDER
│           └── No → Delete/bottom-up?
│               ├── Yes → DFS POSTORDER
│               └── No → Either works
└── No → Different pattern
```

---

### Key Trade-offs

| Consideration | BFS Wins | DFS Wins |
|-------------|----------|----------|
| Shortest path | ✓ | - |
| Space (balanced tree) | - | ✓ |
| Space (skewed tree) | ✓ | - |
| Level-specific processing | ✓ | - |
| Path reconstruction | - | ✓ |
| Implementation simplicity | Same | Same |

<!-- back -->
