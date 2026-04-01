## BST Insert: Algorithm Framework

What are the implementation patterns for BST insertion in both iterative and recursive forms?

<!-- front -->

---

### Recursive Insertion

```python
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def insert_recursive(root, key):
    """
    Returns: new root (may change if inserting into empty tree)
    """
    if root is None:
        return TreeNode(key)
    
    if key < root.val:
        root.left = insert_recursive(root.left, key)
    elif key > root.val:
        root.right = insert_recursive(root.right, key)
    # If key == root.val, handle as needed (skip or increment count)
    
    return root

# Usage
root = None
for key in [8, 3, 10, 1, 6]:
    root = insert_recursive(root, key)
```

---

### Iterative Insertion

```python
def insert_iterative(root, key):
    """
    Returns: root (unchanged if tree non-empty)
    """
    new_node = TreeNode(key)
    
    if root is None:
        return new_node
    
    current = root
    parent = None
    
    while current:
        parent = current
        if key < current.val:
            current = current.left
        elif key > current.val:
            current = current.right
        else:
            return root  # Duplicate, skip
    
    # Attach to parent
    if key < parent.val:
        parent.left = new_node
    else:
        parent.right = new_node
    
    return root
```

---

### Comparison: Recursive vs Iterative

| Aspect | Recursive | Iterative |
|--------|-----------|-----------|
| **Code clarity** | Clean, intuitive | Verbose |
| **Space** | O(h) stack | O(1) extra |
| **Performance** | Function call overhead | Slightly faster |
| **Parent pointer** | Natural | Need explicit tracking |
| **Bottom-up ops** | Post-order natural | Need to track path |

**For basic insertion:** Iterative preferred in production (no stack overflow)

---

### Handling Duplicates

| Strategy | Implementation | Use Case |
|----------|----------------|----------|
| **Skip** | If equal, return | Set semantics |
| **Count** | Add count field | Multiset |
| **Right subtree** | Always go right | Convention |
| **Left subtree** | Always go left | Convention |

```python
# With count
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.count = 1  # Number of occurrences
        self.left = None
        self.right = None

def insert_with_count(root, key):
    if root is None:
        return TreeNode(key)
    
    if key == root.val:
        root.count += 1
    elif key < root.val:
        root.left = insert_with_count(root.left, key)
    else:
        root.right = insert_with_count(root.right, key)
    
    return root
```

---

### Insert with Parent Pointer

For operations requiring parent reference:

```python
class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
        self.parent = None

def insert_with_parent(root, key):
    new_node = TreeNode(key)
    
    if root is None:
        return new_node
    
    current = root
    while True:
        if key < current.val:
            if current.left is None:
                current.left = new_node
                new_node.parent = current
                break
            current = current.left
        else:
            if current.right is None:
                current.right = new_node
                new_node.parent = current
                break
            current = current.right
    
    return root
```

<!-- back -->
