## Tree DFS - Postorder Traversal: Comparison

When should you use different postorder traversal approaches?

<!-- front -->

---

### Recursive vs Iterative (Single Stack) vs Two Stacks

| Aspect | Recursive | Single Stack | Two Stacks |
|--------|-----------|--------------|------------|
| **Code** | Cleanest, most intuitive | Moderate complexity | Simple logic |
| **Space** | O(h) - call stack | O(h) - explicit stack | O(n) - two stacks |
| **Stack overflow risk** | Yes (recursion limit) | No | No |
| **Readability** | High | Medium | High |
| **Implementation time** | Fast | Moderate | Fast |
| **Tree modification** | No | No | No |

**Where:** h = height of tree, n = number of nodes

---

### When to Use Each

**Recursive Postorder:**
- Standard interview solution
- Most readable and maintainable
- Balanced or moderately skewed trees
- When code clarity matters most

**Single Stack Iterative:**
- Very deep trees (avoid recursion limit)
- Production code requiring safety
- When you need explicit control

**Two Stacks Iterative:**
- Quick implementation without recursion
- When O(n) space is acceptable
- Easier to reason about than single stack

---

### Approach Decision Tree

```
Need postorder traversal?
│
├── Tree depth < 1000 (balanced/moderate)
│   └── Use RECURSIVE
│       └── Clean, standard, interview-friendly
│
├── Tree depth > 1000 or unknown
│   └── Use ITERATIVE
│       ├── Want O(h) space? → Single Stack
│       └── Want simpler code? → Two Stacks
│
└── Need O(1) space?
    └── Use MORRIS traversal
        └── Complex but constant space
```

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|-----|
| Interview coding | Recursive | Standard, expected solution |
| Production safety | Iterative (single stack) | No recursion limit |
| Very deep trees (>10⁴) | Single stack | Avoid stack overflow |
| Space constrained | Morris | O(1) extra space |
| Quick implementation | Recursive or Two Stacks | Easier to write correctly |

---

### Traversal Order Comparison

| Traversal | Order | Use When |
|-----------|-------|----------|
| **Preorder** | Root → Left → Right | Root-to-leaf paths, tree cloning |
| **Inorder** | Left → Root → Right | BST validation, sorted output |
| **Postorder** | Left → Right → Root | Deletion, expression trees, subtree properties |
| **Level Order** | By depth | Shortest path, level-based problems |

**Winner by use case:**
- Deletion → Postorder
- Expression evaluation → Postorder
- BST sorted order → Inorder
- Clone tree → Preorder
- Find shortest path → Level Order (BFS)

<!-- back -->
