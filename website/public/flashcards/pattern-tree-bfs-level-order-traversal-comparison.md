## Tree - BFS Level Order Traversal: Comparison

When should you use BFS vs DFS for tree traversal problems?

<!-- front -->

---

### BFS vs DFS Comparison

| Aspect | BFS (Level Order) | DFS (Pre-order) |
|--------|-------------------|------------------|
| **Order** | Level by level | Depth-first path |
| **Data Structure** | Queue (FIFO) | Stack/Recursion (LIFO) |
| **Space** | O(w) - tree width | O(h) - tree height |
| **Use Case** | Level-based problems | Path-based problems |
| **Memory** | Heap (queue) | Call stack |
| **Implementation** | Iterative | Recursive or iterative |
| **Shortest Path** | Yes (unweighted) | No |
| **Cache Locality** | Poor (scattered) | Good (sequential) |

---

### When to Use Each Approach

**Use BFS when:**
- Problem requires level-by-level processing
- Finding shortest path in unweighted tree
- Computing level-based aggregations (sums, averages, max/min per level)
- Determining tree width or diameter
- Tracking depth information explicitly
- Tree is narrow (height > width)

**Use DFS when:**
- Problem requires path-based results
- Tree is deep but narrow (better space complexity)
- Simple traversal without level grouping needed
- Memory is constrained (DFS uses O(h) vs BFS O(w))
- Recursion depth is manageable

---

### Space Complexity Deep Dive

**For different tree shapes:**

| Tree Shape | BFS Space | DFS Space |
|------------|-----------|-----------|
| Balanced (complete) | O(n) - last level | O(log n) - height |
| Skewed/Linked list | O(1) - one node/level | O(n) - recursion depth |
| Wide but shallow | O(n) - many leaves | O(log n) - small height |

**Key insight:** Choose based on tree shape. BFS wins for deep narrow trees, DFS wins for wide shallow trees.

---

### Three Approaches to Level Order

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| **Standard BFS** | O(n) | O(w) | **General use** - single queue |
| **Two Queue** | O(n) | O(w) | Educational - clearer level separation |
| **Depth Tracking** | O(n) | O(w) | When depth info needed with each node |

**Standard BFS is preferred** for most cases due to simplicity and efficiency.

---

### Algorithm Selection Guide

| Problem Type | Best Choice | Why |
|--------------|-------------|-----|
| Level order output | BFS | Natural fit |
| Minimum depth | BFS | Shortest path property |
| Maximum depth | DFS | Same complexity, simpler |
| Path sum | DFS | Path tracking easier |
| Level averages | BFS | Natural level grouping |
| Right side view | BFS | Process level, take last |
| Tree width | BFS | Track level sizes |
| Serialize tree | BFS/DFS | Both work, choose by format |
| Lowest common ancestor | DFS | Path tracking needed |

---

### BFS vs DFS: Code Complexity

**BFS Level Order:**
```python
# More verbose but explicit level control
def bfs(root):
    queue = deque([root])
    while queue:
        level_size = len(queue)  # Extra step
        for _ in range(level_size):
            node = queue.popleft()
            # process
```

**DFS Pre-order:**
```python
# Simpler recursive
def dfs(node):
    if not node: return
    # process node
    dfs(node.left)
    dfs(node.right)
```

**Trade-off:** DFS is simpler to write but BFS gives level control for free.

---

### Key Takeaways

1. **BFS naturally processes trees level by level** using queue FIFO ordering
2. **Space complexity differs**: BFS O(width) vs DFS O(height)
3. **BFS finds shortest path** in unweighted trees automatically
4. **Standard BFS is optimal** for most level-order problems
5. **Tree shape matters** for space efficiency - choose accordingly

<!-- back -->
