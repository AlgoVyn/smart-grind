# Flashcards: Tree DFS Recursive Preorder Traversal - Comparison

## Card 1: Recursive vs Iterative
---
front:
When should you choose recursive preorder vs iterative (stack-based) preorder?
back:
| Factor | Recursive | Iterative |
|--------|-----------|-----------|
| **Code simplicity** | Better | More verbose |
| **Stack overflow risk** | Higher | Still present |
| **Tree depth** | Balanced OK | Better for deep trees |
| **Readability** | Cleaner | Moderate |

Use recursive for interviews and balanced trees; iterative for very deep trees.

---

## Card 2: Space Complexity Comparison
---
front:
How do the three preorder traversal approaches compare in space complexity?
back:
| Approach | Space | Why |
|----------|-------|-----|
| **Recursive** | O(h) | Call stack |
| **Iterative (Stack)** | O(h) | Explicit stack |
| **Morris** | O(1) | Temporary threads |

h = tree height (worst case O(n) for skewed trees)

---

## Card 3: Morris Traversal Trade-offs
---
front:
What are the trade-offs of using Morris traversal for preorder?
back:
**Pros:**
- O(1) space complexity
- No recursion stack overflow

**Cons:**
- Modifies tree temporarily (restores after)
- More complex code
- Lower readability
- Harder to debug

**Best for:** Memory-constrained environments

---

## Card 4: Traversal Order Comparison
---
front:
How does preorder compare to inorder and postorder traversals?
back:
| Traversal | Order | Use Case |
|-----------|-------|----------|
| **Preorder** | Root → Left → Right | Copy trees, paths, serialization |
| **Inorder** | Left → Root → Right | BST sorting |
| **Postorder** | Left → Right → Root | Delete trees, bottom-up calculations |

---

## Card 5: Iterative Stack Key Detail
---
front:
In iterative preorder, why push right child before left child?
back:
**LIFO order**: Stack is Last-In-First-Out

```python
if node.right:
    stack.append(node.right)  # Push first
if node.left:
    stack.append(node.left)   # Push second → processed first
```

Left must be processed before right, so left is pushed last (popped first).

---
