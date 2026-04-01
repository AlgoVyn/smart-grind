## BST Insert: Tactics & Tricks

What are the essential tactics for efficient BST operations and avoiding common pitfalls?

<!-- front -->

---

### Tactic 1: Randomized Insertion

Shuffle data before insertion to avoid worst case:

```python
import random

def build_balanced_bst(data):
    """Expected O(n log n) by randomization"""
    random.shuffle(data)  # Prevents sorted input degradation
    
    root = None
    for key in data:
        root = insert_iterative(root, key)
    
    return root
```

**Alternative:** Use treap (tree + heap) for guaranteed expected balance

---

### Tactic 2: Bulk Loading

For known data, build optimal tree in O(n log n) or O(n):

```python
def build_balanced_from_sorted(arr):
    """O(n) from sorted array - minimal height tree"""
    if not arr:
        return None
    
    mid = len(arr) // 2
    root = TreeNode(arr[mid])
    root.left = build_balanced_from_sorted(arr[:mid])
    root.right = build_balanced_from_sorted(arr[mid+1:])
    
    return root

# After sorting: O(n log n) total
```

---

### Tactic 3: DSW Algorithm (Day-Stout-Warren)

In-place balancing without recursion:

```python
def dsw_balance(root):
    """
    1. Create backbone (right-leaning vine)
    2. Compress to balanced tree
    Time: O(n), Space: O(1)
    """
    # Step 1: Tree to vine
    # Step 2: Vine to balanced tree via rotations
    pass
```

**Use when:** Have existing degenerate tree, need to balance in-place

---

### Tactic 4: Morris Traversal

O(1) space traversal (no stack, no recursion):

```python
def morris_inorder(root):
    """O(1) space inorder traversal"""
    current = root
    
    while current:
        if current.left is None:
            yield current.val
            current = current.right
        else:
            # Find inorder predecessor
            pre = current.left
            while pre.right and pre.right != current:
                pre = pre.right
            
            if pre.right is None:
                pre.right = current  # Create thread
                current = current.left
            else:
                pre.right = None  # Remove thread
                yield current.val
                current = current.right
```

**Trade-off:** O(1) space but O(n) time with larger constant (tree modified temporarily)

---

### Tactic 5: Testing BST Validity

```python
def is_valid_bst(root, lower=float('-inf'), upper=float('inf')):
    """O(n) validation with bounds"""
    if root is None:
        return True
    
    if root.val <= lower or root.val >= upper:
        return False
    
    return (is_valid_bst(root.left, lower, root.val) and
            is_valid_bst(root.right, root.val, upper))

# Alternative: Inorder should be sorted
def is_valid_bst_inorder(root):
    prev = float('-inf')
    
    def inorder(node):
        nonlocal prev
        if node is None:
            return True
        
        if not inorder(node.left):
            return False
        
        if node.val <= prev:
            return False
        prev = node.val
        
        return inorder(node.right)
    
    return inorder(root)
```

<!-- back -->
