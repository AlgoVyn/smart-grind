## Title: Serialize Tree - Forms

What are the different manifestations of tree serialization?

<!-- front -->

---

### Form 1: Preorder with Null Markers

Most common approach for general binary trees.

| Aspect | Description |
|--------|-------------|
| **Traversal** | Root → Left → Right |
| **Format** | "1,2,null,null,3,4,null,null,5,null,null" |
| **Pros** | Simple, deterministic, handles any shape |
| **Cons** | Includes many null markers for sparse trees |

```python
# Example tree
#     1
#    / \
#   2   3
#      / \
#     4   5

# Serialization: 1,2,null,null,3,4,null,null,5,null,null
```

---

### Form 2: Level Order (BFS) Serialization

Good for complete/near-complete trees.

| Aspect | Description |
|--------|-------------|
| **Traversal** | Level by level, left to right |
| **Format** | "1,2,3,null,null,4,5,null,null,null,null" |
| **Pros** | Iterative, no recursion stack risk |
| **Cons** | More null markers at end for incomplete levels |

---

### Form 3: Compact BST Serialization

Leverages BST property for smaller output.

| Aspect | Description |
|--------|-------------|
| **Approach** | Preorder only, no null markers |
| **Format** | "5,3,1,4,7,6,8" |
| **Reconstruction** | Use min/max bounds or inorder+preorder |
| **Pros** | Minimal space |
| **Cons** | Only works for BSTs |

```python
def deserialize_bst(data):
    """Deserialize BST from preorder."""
    if not data:
        return None
    
    values = list(map(int, data.split(',')))
    
    def build(values, min_val, max_val):
        if not values or not (min_val < values[0] < max_val):
            return None
        
        val = values.pop(0)
        node = TreeNode(val)
        node.left = build(values, min_val, val)
        node.right = build(values, val, max_val)
        return node
    
    return build(values, float('-inf'), float('inf'))
```

---

### Form 4: JSON/XML Serialization

Human-readable format for APIs.

```json
{
  "val": 1,
  "left": {
    "val": 2,
    "left": null,
    "right": null
  },
  "right": {
    "val": 3,
    "left": {"val": 4, "left": null, "right": null},
    "right": {"val": 5, "left": null, "right": null}
  }
}
```

---

### Form 5: Parent-Pointer Encoding

Store nodes with their indices in a complete binary tree.

| Node | Index | Value |
|------|-------|-------|
| Root | 0 | 1 |
| Left child | 1 | 2 |
| Right child | 2 | 3 |
| Left-left | 3 | 4 |

Format: "0:1,1:2,2:3,3:4" - compact for complete trees

<!-- back -->
