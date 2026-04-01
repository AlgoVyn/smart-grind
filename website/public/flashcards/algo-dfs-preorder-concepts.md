## DFS Preorder: Core Concepts

What is preorder tree traversal and when is it the right choice?

<!-- front -->

---

### Definition

**Preorder traversal:** Root → Left subtree → Right subtree

```
    4
   / \
  2   6
 / \  / \
1  3 5  7

Preorder: 4, 2, 1, 3, 6, 5, 7
```

---

### Key Properties

| Property | Preorder |
|----------|----------|
| **Root first** | Process parent before children |
| **Path tracking** | Natural for root-to-leaf paths |
| **Serialization** | Can reconstruct tree (with null markers) |
| **Top-down** | Propagate information downward |

---

### When to Use

| Use Case | Why Preorder |
|----------|--------------|
| **Tree serialization** | Root first enables reconstruction |
| **Copy/clone tree** | Create parent, then children |
| **Root-to-leaf paths** | Build path as you go down |
| **Search with pruning** | Can stop early if invalid |
| **Expression tree** | Prefix notation |
| **Directory listing** | Parent before contents |
| **Decision tree** | Decision before branches |

---

### Top-Down Pattern

```python
def top_down_pattern(node, state):
    if not node:
        return
    
    # Process current node, update state
    new_state = update(state, node.val)
    
    # Pass updated state to children
    top_down_pattern(node.left, new_state)
    top_down_pattern(node.right, new_state)
```

---

### Complexity

| Aspect | Complexity |
|--------|------------|
| **Time** | O(n) - visit each node |
| **Space (recursive)** | O(h) - recursion stack |
| **Space (iterative)** | O(h) - explicit stack |
| **Space (Morris)** | O(1) - threaded traversal |

<!-- back -->
