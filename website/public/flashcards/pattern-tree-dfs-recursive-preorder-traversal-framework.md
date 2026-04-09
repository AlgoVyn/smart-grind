# Flashcards: Tree DFS Recursive Preorder Traversal - Framework

## Card 1: Pattern Core
---
front:
What is the fundamental order of preorder traversal in a binary tree?
back:
**Root → Left → Right**

The root node is visited first, then recursively the left subtree, followed by the right subtree.

---

## Card 2: When to Use Preorder
---
front:
In what scenarios is preorder traversal the optimal choice?
back:
1. **Root-dependent operations** - parent needed before children
2. **Tree construction** - building expression trees from traversal
3. **Path exploration** - finding paths requiring root info first
4. **Serialization** - creating string representations

---

## Card 3: Recursive Template Structure
---
front:
What is the basic structure of a recursive preorder DFS function?
back:
```python
def dfs(node):
    if not node:          # Base case
        return
    process(node)         # Visit root
    dfs(node.left)        # Traverse left
    dfs(node.right)       # Traverse right
```

---

## Card 4: Pattern Characteristics
---
front:
What are the key benefits of the recursive preorder traversal pattern?
back:
- **Simplicity**: Elegant implementation with minimal code
- **Top-Down Processing**: Root before children
- **Natural Recursion**: Maps directly to recursive call stack
- **Predictable Order**: Consistent, reproducible sequences

---

## Card 5: Complexity Analysis
---
front:
What are the time and space complexities of recursive preorder traversal?
back:
| Complexity | Value | Notes |
|------------|-------|-------|
| **Time** | O(n) | Each node visited once |
| **Space** | O(h) | h = tree height (O(n) for skewed trees) |

---
