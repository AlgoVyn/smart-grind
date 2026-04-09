## Tree - BFS Level Order Traversal: Core Concepts

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
          / \
         2   3
        / \   \
       4   5   6

Level Order Processing:
  Queue: [1]
  Level 0: Process 1, enqueue 2, 3 → Queue: [2, 3]
  
  Level 1: Process 2, enqueue 4, 5; Process 3, enqueue 6
           → Queue: [4, 5, 6]
  
  Level 2: Process 4, 5, 6 (no children)
           → Queue: []

Result: [[1], [2, 3], [4, 5, 6]] ✓
```

---

### Why Use Queue

| Data Structure | Order | Best For |
|---------------|-------|----------|
| **Queue (BFS)** | FIFO - level by level | Shortest path, level-order |
| **Stack (DFS)** | LIFO - depth first | Path finding, exploration |

**Critical difference**: BFS needs FIFO to process nodes level by level, while DFS uses LIFO (stack/call stack) for depth-first exploration.

---

### Level Boundary Detection

The critical technique is **capturing queue size before processing each level**:

```python
level_size = len(queue)      # BEFORE the inner loop
for _ in range(level_size):  # Process exactly this many nodes
    node = queue.popleft()
    # enqueue children for NEXT level
```

**Why this matters:** Children are added to queue during processing. Without fixed iteration count, you'd process newly added children in the same level.

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| Level Order Traversal | Basic pattern | Binary Tree Level Order |
| Level Averages | Per-level stats | Average of Levels |
| Right Side View | View from right | Binary Tree Right Side View |
| Zigzag Traversal | Alternate directions | Binary Tree Zigzag |
| Minimum Depth | Shortest root-to-leaf | Minimum Depth |
| Connect Nodes | Connect level siblings | Populating Next Right Pointers |
| Maximum Level Sum | Level aggregations | Maximum Level Sum |

---

### When to Use BFS vs DFS

**Use BFS when:**
- Need level-by-level results
- Finding shortest path in unweighted tree
- Level-based aggregations (sum, max, min, average)
- Tree width is small (better space than DFS for deep trees)

**Use DFS when:**
- Need path-based results
- Tree height is small
- Tree traversal without level grouping
- Memory is constrained (if height < width)

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n) | Visit each node once |
| Space | O(w) | w = max width of tree |
| Space (worst) | O(n) | Complete binary tree last level |

**Where n = number of nodes, w = maximum tree width**

<!-- back -->
