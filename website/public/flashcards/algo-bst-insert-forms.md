## BST Insert: Problem Forms

What are the variations and extensions of BST insertion for different scenarios?

<!-- front -->

---

### Standard BST Operations

| Operation | Complexity | Key Aspect |
|-----------|-----------|------------|
| **Insert** | O(h) | Find null position |
| **Search** | O(h) | Follow comparison path |
| **Min/Max** | O(h) | Leftmost/Rightmost |
| **Delete** | O(h) | 3 cases: leaf, one child, two children |
| **Inorder** | O(n) | Sorted output |

---

### Self-Balancing Variants

| Variant | Balance Factor | Insert Complexity | Description |
|---------|---------------|-------------------|-------------|
| **AVL Tree** | Height-balanced | O(log n) | Strict balance, rotations |
| **Red-Black** | Color-balanced | O(log n) | Weaker balance, faster insert |
| **Treap** | Heap priority | O(log n) expected | Randomized |
| **Splay Tree** | Access-based | O(log n) amortized | Self-adjusting |
| **B-Tree** | Multi-way | O(log n) | Disk-based, high branching |

**AVL Insert additional steps:**
```python
def avl_insert(root, key):
    # 1. Standard BST insert
    # 2. Update height
    # 3. Get balance factor
    # 4. Rebalance: LL, RR, LR, RL rotations
    pass
```

---

### Augmented BST

Store additional information per node:

```python
class AugmentedNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
        self.size = 1  # Size of subtree
        self.sum = val  # Sum of subtree
        self.max = val  # Max in subtree
        # ... other aggregates

def update(node):
    """Recalculate augmented values"""
    if node:
        node.size = 1 + size(node.left) + size(node.right)
        node.sum = node.val + sum(node.left) + sum(node.right)

def insert_augmented(root, key):
    if root is None:
        return AugmentedNode(key)
    
    if key < root.val:
        root.left = insert_augmented(root.left, key)
    else:
        root.right = insert_augmented(root.right, key)
    
    update(root)  # Maintain augmentation
    return root
```

**Applications:** Order statistics, range queries

---

### BST from Traversal

| Input | Construction | Complexity |
|-------|--------------|------------|
| **Preorder** | Use upper/lower bounds | O(n) |
| **Inorder + Preorder** | Root from preorder, partition | O(n) |
| **Inorder + Postorder** | Root from postorder end | O(n) |
| **Level order** | Insert sequentially | O(n log n) or O(n²) |

**Preorder construction:**
```python
def bst_from_preorder(preorder):
    """O(n) using index and bounds"""
    idx = 0
    
    def helper(lower, upper):
        nonlocal idx
        if idx >= len(preorder):
            return None
        
        val = preorder[idx]
        if val < lower or val > upper:
            return None
        
        idx += 1
        root = TreeNode(val)
        root.left = helper(lower, val)
        root.right = helper(val, upper)
        return root
    
    return helper(float('-inf'), float('inf'))
```

---

### Threaded BST

Store inorder successor to enable traversal without stack:

```python
class ThreadedNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None
        self.left_thread = False  # True if left is inorder predecessor
        self.right_thread = False # True if right is inorder successor

# Enables O(1) space inorder traversal
# Useful for: Morris traversal, memory-constrained environments
```

<!-- back -->
