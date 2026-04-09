## Tree - BFS Level Order: Core Concepts

What are the fundamental principles of BFS level order traversal on trees?

<!-- front -->

---

### Core Concept

Use **a queue to traverse tree level by level**, processing all nodes at each depth before moving to the next level.

**Key insight**: Queue-based traversal naturally processes nodes in order of their distance from the root.

---

### The Pattern

```
Tree:      1
         /   \
        2     3
       / \   / \
      4   5 6   7

Level Order:
  Queue: [1]
  Level 0: Process 1, add children → Queue: [2, 3]
  
  Level 1: Process 2, add children → Queue: [3, 4, 5]
           Process 3, add children → Queue: [4, 5, 6, 7]
  
  Level 2: Process 4 (no children) → Queue: [5, 6, 7]
           Process 5 (no children) → Queue: [6, 7]
           Process 6 (no children) → Queue: [7]
           Process 7 (no children) → Queue: []

Result: [[1], [2, 3], [4, 5, 6, 7]] ✓
```

---

### Why Use Queue

| Data Structure | Order | Best For |
|---------------|-------|----------|
| **Queue (BFS)** | Level by level | Shortest path, level-order |
| **Stack (DFS)** | Depth first | Path finding, exploration |

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| Level Order Traversal | Process by depth | Binary Tree Level Order |
| Zigzag Traversal | Alternate directions | Binary Tree Zigzag |
| Right Side View | View from right | Right Side View |
| Average of Levels | Per-level stats | Average of Levels |
| Minimum Depth | Shortest root-to-leaf | Minimum Depth |
| Connect Nodes | Connect level siblings | Populating Next Pointers |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n) | Visit each node once |
| Space | O(w) | w = max width of tree |
| Space (worst) | O(n) | Complete binary tree last level |

<!-- back -->
