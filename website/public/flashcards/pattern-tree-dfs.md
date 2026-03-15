## Tree DFS: Pre-order vs Post-order

**Question:** When should you use each traversal order?

<!-- front -->

---

## Tree DFS Traversal Orders

### Pre-order (Root → Left → Right)
**Use when:** Passing information down (path, parent info)

```python
# Root-to-leaf paths
def dfs(node, path, result):
    if not node:
        return
    
    path.append(node.val)  # Pre-order: process node
    
    if not node.left and not node.right:
        result.append(path[:])  # Leaf node
    
    dfs(node.left, path, result)
    dfs(node.right, path, result)
    path.pop()  # Backtrack
```

### Post-order (Left → Right → Root)
**Use when:** Aggregating from children (subtree info)

```python
# Max path sum
def dfs(node):
    if not node:
        return 0
    
    left = max(0, dfs(node.left))    # Post-order
    right = max(0, dfs(node.right))  # Post-order
    
    # Process node with children info
    max_path_sum = max(max_path_sum, left + right + node.val)
    
    return max(left, right) + node.val
```

### 💡 Comparison
| Order | Process Node | Use Case |
|-------|-------------|----------|
| Pre-order | Before children | Path tracking |
| Post-order | After children | Subtree aggregation |
| In-order | Between children | BST validation |

<!-- back -->
