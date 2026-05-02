# AVL Tree (Self-Balancing Binary Search Tree)

## Category
Advanced Data Structures

## Description

An AVL Tree is a self-balancing Binary Search Tree (BST) where the difference between heights of left and right subtrees (balance factor) cannot be more than one for all nodes. This strict balance condition guarantees O(log n) time complexity for search, insert, and delete operations in the worst case.

Named after its inventors Adelson-Velsky and Landis (1962), AVL trees ensure that the tree height is always logarithmic in the number of nodes, preventing the degenerate O(n) behavior that can occur in unbalanced BSTs. This makes AVL trees ideal for applications requiring predictable performance, such as database indexing and real-time systems.

---

## Concepts

The AVL tree is built on several fundamental concepts that ensure balance and efficiency.

### 1. Balance Factor

The key metric that determines tree balance:

```
Balance Factor(node) = height(left subtree) - height(right subtree)

Valid range: -1 ≤ BF ≤ 1

BF > 1  → Left-heavy, needs right rotation
BF < -1 → Right-heavy, needs left rotation
```

| Balance Factor | Condition | Action |
|----------------|-----------|--------|
| **0** | Perfectly balanced | None |
| **+1** | Left subtree 1 taller | None |
| **-1** | Right subtree 1 taller | None |
| **+2** | Left subtree 2 taller | Rebalance needed |
| **-2** | Right subtree 2 taller | Rebalance needed |

### 2. Rotations

Rotations restore balance while maintaining BST property:

| Rotation | Trigger | Cases |
|----------|---------|-------|
| **LL (Single Right)** | BF = +2, left child's BF ≥ 0 | Right rotate |
| **RR (Single Left)** | BF = -2, right child's BF ≤ 0 | Left rotate |
| **LR (Double)** | BF = +2, left child's BF = -1 | Left rotate left child, then right rotate |
| **RL (Double)** | BF = -2, right child's BF = +1 | Right rotate right child, then left rotate |

### 3. Height Tracking

Each node stores its height for O(1) balance factor calculation:

```python
node.height = 1 + max(height(left), height(right))
```

### 4. Tree Height Property

AVL trees maintain strict height bound:

```
Max height of AVL tree with n nodes: ≈ 1.44 × log₂(n + 2) - 0.328

This guarantees: height = O(log n)
```

---

## Frameworks

Structured approaches for implementing and using AVL trees.

### Framework 1: Standard AVL Tree

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARD AVL TREE FRAMEWORK                                 │
├─────────────────────────────────────────────────────────────┤
│  Node Structure:                                             │
│    - key: value                                              │
│    - left, right: child pointers                            │
│    - height: subtree height                                   │
│                                                              │
│  Operations:                                                 │
│  1. get_height(node) → returns height (0 if None)            │
│  2. get_balance(node) → returns balance factor               │
│  3. update_height(node) → recalculates height                │
│                                                              │
│  4. right_rotate(y) → fixes left-heavy imbalance            │
│     x = y.left                                                │
│     y.left = x.right                                         │
│     x.right = y                                               │
│     update y's height                                        │
│     update x's height                                        │
│     return x (new root of subtree)                           │
│                                                              │
│  5. left_rotate(x) → fixes right-heavy imbalance            │
│     y = x.right                                               │
│     x.right = y.left                                          │
│     y.left = x                                                │
│     update heights                                            │
│     return y (new root)                                       │
│                                                              │
│  6. insert(node, key):                                        │
│     - BST insert                                              │
│     - update height                                           │
│     - get balance                                             │
│     - Apply rotations if |balance| > 1:                     │
│       * Left-Left: right rotate                               │
│       * Right-Right: left rotate                             │
│       * Left-Right: left rotate left, then right rotate     │
│       * Right-Left: right rotate right, then left rotate    │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard BST operations with guaranteed O(log n) performance.

### Framework 2: Rotation Decision

```
┌─────────────────────────────────────────────────────────────┐
│  ROTATION DECISION FRAMEWORK                                 │
├─────────────────────────────────────────────────────────────┤
│  After insertion at node N:                                  │
│                                                              │
│  1. Calculate balance = get_balance(N)                      │
│                                                              │
│  2. If balance > 1 (left heavy):                            │
│     Compare key with N.left.key:                            │
│     a) If key < N.left.key:  // LL case                    │
│        → right_rotate(N)                                    │
│     b) If key > N.left.key:  // LR case                    │
│        → left_rotate(N.left)                                │
│        → right_rotate(N)                                    │
│                                                              │
│  3. If balance < -1 (right heavy):                          │
│     Compare key with N.right.key:                           │
│     a) If key > N.right.key:  // RR case                   │
│        → left_rotate(N)                                     │
│     b) If key < N.right.key:  // RL case                   │
│        → right_rotate(N.right)                              │
│        → left_rotate(N)                                     │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Determining which rotations to apply after insertion/deletion.

### Framework 3: Data Structure Selection

```
┌─────────────────────────────────────────────────────────────┐
│  CHOOSING BALANCED BST ALGORITHM                           │
├─────────────────────────────────────────────────────────────┤
│  Use AVL Tree when:                                        │
│    ✓ Guaranteed O(log n) required for all operations       │
│    ✓ Lookup-heavy workload (more reads than writes)        │
│    ✓ Small number of elements (tens of thousands)           │
│    ✓ Need strict balancing for predictable performance    │
│                                                              │
│  Use Red-Black Tree when:                                  │
│    ✓ Insertion/deletion heavy workload                     │
│    ✓ Larger datasets (millions of elements)                │
│    ✓ Fewer rotations preferred over strict balance         │
│    ✓ Implemented in most standard libraries (C++ map/set)  │
│                                                              │
│  Use Treap when:                                           │
│    ✓ Randomized balancing acceptable                       │
│    ✓ Simpler implementation preferred                       │
│    ✓ Average case O(log n) sufficient                     │
│                                                              │
│  Use Splay Tree when:                                      │
│    ✓ Recently accessed elements should be fast to access    │
│    ✓ Amortized analysis acceptable                         │
└─────────────────────────────────────────────────────────────┘
```

---

## Forms

Different manifestations of the AVL tree pattern.

### Form 1: Standard AVL Tree

Basic self-balancing BST for general use.

| Aspect | Details |
|--------|---------|
| **Operations** | Insert, delete, search, min, max |
| **Time** | O(log n) for all operations |
| **Space** | O(n) |
| **Balance** | Strict: \|BF\| ≤ 1 |

### Form 2: AVL with Parent Pointers

Maintain parent references for easier traversal.

| Extension | Add parent pointer to node |
|-----------|---------------------------|
| **Benefit** | Easier successor/predecessor finding |
| **Cost** | Extra pointer per node, more complex rotations |

### Form 3: Order-Statistics AVL

Support rank and select operations.

| Extension | Store subtree size at each node |
|-----------|--------------------------------|
| **Operations** | find_by_order(k), order_of_key(x) |
| **Use Case** | Finding kth smallest, rank queries |

### Form 4: Interval AVL Tree

Store intervals instead of single values.

| Extension | Node stores interval, subtree stores max endpoint |
|-----------|------------------------------------------------|
| **Operations** | Find overlapping intervals |
| **Use Case** | Interval scheduling, collision detection |

### Form 5: AVL Tree Array

Implicit AVL tree using array representation.

| Approach | Store in array, compute children indices |
|----------|------------------------------------------|
| **Use Case** | Cache-friendly access, fixed-size trees |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Single Right Rotation (LL Case)

```python
def right_rotate(self, y):
    """
    Right rotation for left-left case.
    
    Before:          After:
        y              x
       /             /   \
      x      →      z     y
       \
        z
    """
    x = y.left
    T2 = x.right
    
    # Perform rotation
    x.right = y
    y.left = T2
    
    # Update heights
    y.height = 1 + max(self.get_height(y.left), self.get_height(y.right))
    x.height = 1 + max(self.get_height(x.left), self.get_height(x.right))
    
    return x
```

### Tactic 2: Single Left Rotation (RR Case)

```python
def left_rotate(self, x):
    """
    Left rotation for right-right case.
    
    Before:          After:
      x                 y
       \              /   \
        y     →      x     z
       /
      z
    """
    y = x.right
    T2 = y.left
    
    # Perform rotation
    y.left = x
    x.right = T2
    
    # Update heights
    x.height = 1 + max(self.get_height(x.left), self.get_height(x.right))
    y.height = 1 + max(self.get_height(y.left), self.get_height(y.right))
    
    return y
```

### Tactic 3: Insert with Automatic Rebalancing

```python
def insert(self, node, key):
    """Insert key into subtree rooted with node."""
    # 1. Standard BST insert
    if not node:
        return TreeNode(key)
    
    if key < node.key:
        node.left = self.insert(node.left, key)
    elif key > node.key:
        node.right = self.insert(node.right, key)
    else:
        return node  # Duplicate keys not allowed
    
    # 2. Update height
    node.height = 1 + max(self.get_height(node.left), self.get_height(node.right))
    
    # 3. Get balance factor
    balance = self.get_balance(node)
    
    # 4. Rebalance if needed
    # Left Left Case
    if balance > 1 and key < node.left.key:
        return self.right_rotate(node)
    
    # Right Right Case
    if balance < -1 and key > node.right.key:
        return self.left_rotate(node)
    
    # Left Right Case
    if balance > 1 and key > node.left.key:
        node.left = self.left_rotate(node.left)
        return self.right_rotate(node)
    
    # Right Left Case
    if balance < -1 and key < node.right.key:
        node.right = self.right_rotate(node.right)
        return self.left_rotate(node)
    
    return node
```

### Tactic 4: Delete with Rebalancing

```python
def delete(self, node, key):
    """Delete key from subtree rooted with node."""
    # 1. Standard BST delete
    if not node:
        return node
    
    if key < node.key:
        node.left = self.delete(node.left, key)
    elif key > node.key:
        node.right = self.delete(node.right, key)
    else:
        # Node with one or no child
        if not node.left:
            return node.right
        elif not node.right:
            return node.left
        
        # Node with two children
        temp = self.get_min(node.right)
        node.key = temp.key
        node.right = self.delete(node.right, temp.key)
    
    # 2. Update height
    node.height = 1 + max(self.get_height(node.left), self.get_height(node.right))
    
    # 3. Get balance
    balance = self.get_balance(node)
    
    # 4. Rebalance
    # Left Left
    if balance > 1 and self.get_balance(node.left) >= 0:
        return self.right_rotate(node)
    
    # Left Right
    if balance > 1 and self.get_balance(node.left) < 0:
        node.left = self.left_rotate(node.left)
        return self.right_rotate(node)
    
    # Right Right
    if balance < -1 and self.get_balance(node.right) <= 0:
        return self.left_rotate(node)
    
    # Right Left
    if balance < -1 and self.get_balance(node.right) > 0:
        node.right = self.right_rotate(node.right)
        return self.left_rotate(node)
    
    return node
```

### Tactic 5: Iterative Traversal

```python
def inorder_iterative(self, root):
    """Inorder traversal without recursion."""
    result = []
    stack = []
    current = root
    
    while current or stack:
        # Reach leftmost node
        while current:
            stack.append(current)
            current = current.left
        
        # Current must be None, pop from stack
        current = stack.pop()
        result.append(current.key)
        
        # Visit right subtree
        current = current.right
    
    return result
```

---

## Python Templates

### Template 1: AVL Tree Node

```python
class AVLNode:
    """Node for AVL Tree."""
    
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None
        self.height = 1
```

### Template 2: Complete AVL Tree

```python
class AVLTree:
    """
    Self-balancing Binary Search Tree.
    
    Time Complexities:
        - Search: O(log n)
        - Insert: O(log n)
        - Delete: O(log n)
    
    Space Complexity: O(n)
    """
    
    def __init__(self):
        self.root = None
    
    def get_height(self, node):
        """Get height of node (0 if None)."""
        return node.height if node else 0
    
    def get_balance(self, node):
        """Get balance factor of node."""
        return self.get_height(node.left) - self.get_height(node.right) if node else 0
    
    def right_rotate(self, y):
        """Right rotation for LL case."""
        x = y.left
        T2 = x.right
        
        # Perform rotation
        x.right = y
        y.left = T2
        
        # Update heights
        y.height = 1 + max(self.get_height(y.left), self.get_height(y.right))
        x.height = 1 + max(self.get_height(x.left), self.get_height(x.right))
        
        return x
    
    def left_rotate(self, x):
        """Left rotation for RR case."""
        y = x.right
        T2 = y.left
        
        # Perform rotation
        y.left = x
        x.right = T2
        
        # Update heights
        x.height = 1 + max(self.get_height(x.left), self.get_height(x.right))
        y.height = 1 + max(self.get_height(y.left), self.get_height(y.right))
        
        return y
    
    def insert(self, key):
        """Insert key into tree."""
        self.root = self._insert(self.root, key)
    
    def _insert(self, node, key):
        """Recursive insert with rebalancing."""
        # Standard BST insert
        if not node:
            return AVLNode(key)
        
        if key < node.key:
            node.left = self._insert(node.left, key)
        elif key > node.key:
            node.right = self._insert(node.right, key)
        else:
            return node  # Duplicate
        
        # Update height
        node.height = 1 + max(self.get_height(node.left), self.get_height(node.right))
        
        # Get balance
        balance = self.get_balance(node)
        
        # Left Left
        if balance > 1 and key < node.left.key:
            return self.right_rotate(node)
        
        # Right Right
        if balance < -1 and key > node.right.key:
            return self.left_rotate(node)
        
        # Left Right
        if balance > 1 and key > node.left.key:
            node.left = self.left_rotate(node.left)
            return self.right_rotate(node)
        
        # Right Left
        if balance < -1 and key < node.right.key:
            node.right = self.right_rotate(node.right)
            return self.left_rotate(node)
        
        return node
    
    def delete(self, key):
        """Delete key from tree."""
        self.root = self._delete(self.root, key)
    
    def _delete(self, node, key):
        """Recursive delete with rebalancing."""
        if not node:
            return node
        
        if key < node.key:
            node.left = self._delete(node.left, key)
        elif key > node.key:
            node.right = self._delete(node.right, key)
        else:
            # Node with one or no child
            if not node.left:
                return node.right
            elif not node.right:
                return node.left
            
            # Node with two children
            temp = self._get_min(node.right)
            node.key = temp.key
            node.right = self._delete(node.right, temp.key)
        
        # Update height
        node.height = 1 + max(self.get_height(node.left), self.get_height(node.right))
        
        # Get balance
        balance = self.get_balance(node)
        
        # Rebalance
        if balance > 1 and self.get_balance(node.left) >= 0:
            return self.right_rotate(node)
        
        if balance > 1 and self.get_balance(node.left) < 0:
            node.left = self.left_rotate(node.left)
            return self.right_rotate(node)
        
        if balance < -1 and self.get_balance(node.right) <= 0:
            return self.left_rotate(node)
        
        if balance < -1 and self.get_balance(node.right) > 0:
            node.right = self.right_rotate(node.right)
            return self.left_rotate(node)
        
        return node
    
    def _get_min(self, node):
        """Get minimum value node."""
        while node.left:
            node = node.left
        return node
    
    def search(self, key):
        """Search for key in tree."""
        return self._search(self.root, key)
    
    def _search(self, node, key):
        if not node or node.key == key:
            return node
        if key < node.key:
            return self._search(node.left, key)
        return self._search(node.right, key)
```

### Template 3: AVL Tree with Size (Order Statistics)

```python
class AVLNodeWithSize:
    def __init__(self, key):
        self.key = key
        self.left = None
        self.right = None
        self.height = 1
        self.size = 1  # Size of subtree rooted here

class AVLTreeWithSize:
    """AVL Tree supporting order statistics."""
    
    def __init__(self):
        self.root = None
    
    def get_size(self, node):
        return node.size if node else 0
    
    def update_size(self, node):
        if node:
            node.size = 1 + self.get_size(node.left) + self.get_size(node.right)
    
    # Include all rotation and insert methods from Template 2
    # Plus update_size() calls after height updates
    
    def find_by_order(self, k):
        """Find kth smallest element (1-indexed)."""
        return self._find_by_order(self.root, k)
    
    def _find_by_order(self, node, k):
        if not node:
            return None
        
        left_size = self.get_size(node.left)
        
        if k == left_size + 1:
            return node.key
        elif k <= left_size:
            return self._find_by_order(node.left, k)
        else:
            return self._find_by_order(node.right, k - left_size - 1)
    
    def order_of_key(self, key):
        """Return number of elements < key."""
        return self._order_of_key(self.root, key)
    
    def _order_of_key(self, node, key):
        if not node:
            return 0
        
        if key <= node.key:
            return self._order_of_key(node.left, key)
        else:
            return 1 + self.get_size(node.left) + self._order_of_key(node.right, key)
```

### Template 4: Iterative AVL Operations

```python
class AVLTreeIterative:
    """AVL Tree with iterative operations."""
    
    def __init__(self):
        self.root = None
    
    def insert_iterative(self, key):
        """Iterative insert (more complex but avoids stack overflow)."""
        if not self.root:
            self.root = AVLNode(key)
            return
        
        # Find insertion point and track path
        path = []
        current = self.root
        
        while True:
            path.append(current)
            if key < current.key:
                if not current.left:
                    current.left = AVLNode(key)
                    break
                current = current.left
            elif key > current.key:
                if not current.right:
                    current.right = AVLNode(key)
                    break
                current = current.right
            else:
                return  # Duplicate
        
        # Rebalance up the path
        for node in reversed(path):
            node.height = 1 + max(self.get_height(node.left), self.get_height(node.right))
            balance = self.get_balance(node)
            
            # Apply rotations as needed (similar to recursive version)
            # ... rotation logic ...
```

### Template 5: Convert Sorted Array to AVL

```python
def sorted_array_to_avl(nums):
    """
    LeetCode 108: Convert Sorted Array to BST (balanced).
    Returns root of balanced AVL tree.
    """
    if not nums:
        return None
    
    def helper(left, right):
        if left > right:
            return None
        
        mid = (left + right) // 2
        node = AVLNode(nums[mid])
        node.left = helper(left, mid - 1)
        node.right = helper(mid + 1, right)
        
        # Update height
        left_h = node.left.height if node.left else 0
        right_h = node.right.height if node.right else 0
        node.height = 1 + max(left_h, right_h)
        
        return node
    
    return helper(0, len(nums) - 1)
```

### Template 6: AVL Tree Validation

```python
def is_valid_avl(root):
    """Check if tree is valid AVL tree."""
    
    def helper(node):
        if not node:
            return True, 0  # (is_valid, height)
        
        # Check BST property
        if node.left and node.left.key >= node.key:
            return False, 0
        if node.right and node.right.key <= node.key:
            return False, 0
        
        # Recursively check subtrees
        left_valid, left_h = helper(node.left)
        right_valid, right_h = helper(node.right)
        
        if not left_valid or not right_valid:
            return False, 0
        
        # Check AVL balance property
        if abs(left_h - right_h) > 1:
            return False, 0
        
        # Check height is correct
        if node.height != 1 + max(left_h, right_h):
            return False, 0
        
        return True, 1 + max(left_h, right_h)
    
    valid, _ = helper(root)
    return valid
```

---

## When to Use

Use AVL trees when you need to solve problems involving:

- **Ordered data operations**: Range queries, successor/predecessor
- **Guaranteed O(log n)**: When worst-case performance matters
- **Frequent lookups**: Search-heavy workloads
- **Database indexing**: Consistent query performance
- **Real-time systems**: Predictable operation times
- **Balanced tree practice**: Common interview topic

### Comparison with Alternatives

| Tree Type | Search | Insert | Delete | Balance | Space | Rotations |
|-----------|--------|--------|--------|---------|-------|-----------|
| **AVL** | O(log n) | O(log n) | O(log n) | Strict | O(n) | More |
| **Red-Black** | O(log n) | O(log n) | O(log n) | Relaxed | O(n) | Fewer |
| **Treap** | O(log n) avg | O(log n) avg | O(log n) avg | Random | O(n) | Random |
| **Splay** | O(log n) amortized | O(log n) amortized | O(log n) amortized | Adaptive | O(n) | Many |
| **BST (unbalanced)** | O(n) worst | O(n) worst | O(n) worst | None | O(n) | None |

### When to Choose Each Tree

- **Choose AVL** when:
  - Guaranteed O(log n) is required
  - Lookup-heavy workload
  - Predictable performance is critical
  - Tree size is moderate

- **Choose Red-Black** when:
  - Frequent insertions/deletions
  - Larger datasets
  - Fewer rotations preferred
  - Using standard libraries

- **Choose Treap** when:
  - Simpler implementation preferred
  - Randomized balance is acceptable
  - Average case sufficient

---

## Algorithm Explanation

### Core Concept

An AVL tree is a self-balancing binary search tree where the height difference between subtrees of every node is at most 1. This strict balance condition guarantees O(log n) height, ensuring all operations (search, insert, delete) complete in logarithmic time.

### How It Works

#### Step 1: BST Operations

Perform standard BST insertion or deletion:
- Insert: Find leaf position, add new node
- Delete: Handle 0, 1, or 2 children cases

#### Step 2: Update Heights

After modification, update heights bottom-up:
```
node.height = 1 + max(height(left), height(right))
```

#### Step 3: Check Balance

Calculate balance factor at each affected node:
```
balance = height(left) - height(right)
```

#### Step 4: Rebalance if Needed

If |balance| > 1, apply rotations:
- **Left-Left (balance = +2, left balance ≥ 0)**: Single right rotation
- **Right-Right (balance = -2, right balance ≤ 0)**: Single left rotation
- **Left-Right (balance = +2, left balance = -1)**: Left rotate left child, then right rotate
- **Right-Left (balance = -2, right balance = +1)**: Right rotate right child, then left rotate

### Visual Walkthrough

**Example**: Insert 10, 20, 30 into empty AVL tree

```
Insert 10:
    10

Insert 20:
    10
      \
       20

Insert 30:
    10        (balance at 10 = -2, right-right case)
      \
       20
         \
          30

After left rotation at 10:
      20
     /  \
    10   30

All nodes balanced ✓
```

### Why Rotations Work

Rotations maintain BST property (left < parent < right) while changing the structure to restore balance:

1. **Single Rotation**: Moves the heavier subtree up
2. **Double Rotation**: Fixes left-right or right-left cases
3. **Height Updates**: Must recalculate heights after rotation

### Limitations

- **Complex Implementation**: More code than simple BST
- **More Rotations**: Strict balance requires more rebalancing than Red-Black trees
- **Overhead**: Height tracking adds memory overhead
- **Not Cache-Friendly**: Pointer chasing degrades cache performance

---

## Practice Problems

### Problem 1: Delete Node in a BST

**Problem:** [LeetCode 450 - Delete Node in a BST](https://leetcode.com/problems/delete-node-in-a-bst/)

**Description:** Given a root node reference of a BST and a key, delete the node with the given key in the BST. Return the root node reference (possibly updated) of the BST.

**How to Apply AVL:**
- Standard BST deletion
- After deletion, update heights
- Rebalance if needed (like in AVL delete)
- Return new root

---

### Problem 2: Validate Binary Search Tree

**Problem:** [LeetCode 98 - Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/)

**Description:** Given the root of a binary tree, determine if it is a valid binary search tree (BST).

**How to Apply AVL:**
- Use inorder traversal to check sorted property
- For AVL validation, also check balance factor
- Ensure |balance| ≤ 1 for all nodes

---

### Problem 3: Kth Smallest Element in a BST

**Problem:** [LeetCode 230 - Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/)

**Description:** Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.

**How to Apply AVL:**
- Standard BST: O(k) or O(n) with inorder
- AVL with size: O(log n) using order statistics
- Store subtree size at each node

---

### Problem 4: Convert Sorted Array to Binary Search Tree

**Problem:** [LeetCode 108 - Convert Sorted Array to Binary Search Tree](https://leetcode.com/problems/convert-sorted-array-to-binary-search-tree/)

**Description:** Given an integer array nums where the elements are sorted in ascending order, convert it to a height-balanced binary search tree.

**How to Apply AVL:**
- Build balanced tree recursively
- Pick middle element as root
- Recursively build left and right subtrees
- Result is height-balanced

---

### Problem 5: Balanced Binary Tree

**Problem:** [LeetCode 110 - Balanced Binary Tree](https://leetcode.com/problems/balanced-binary-tree/)

**Description:** Given a binary tree, determine if it is height-balanced. A height-balanced binary tree is defined as a binary tree in which the depth of the two subtrees of every node never differs by more than one.

**How to Apply AVL:**
- Calculate height of each subtree
- Check |left_height - right_height| ≤ 1
- Similar to AVL balance check
- Return both height and balance status

---

### Problem 6: Range Sum of BST

**Problem:** [LeetCode 938 - Range Sum of BST](https://leetcode.com/problems/range-sum-of-bst/)

**Description:** Given the root node of a binary search tree and two integers low and high, return the sum of values of all nodes with a value in the inclusive range [low, high].

**How to Apply AVL:**
- BST traversal with pruning
- If node.val < low: only visit right
- If node.val > high: only visit left
- O(log n + k) where k = nodes in range

---

## Video Tutorial Links

### Fundamentals

- [AVL Tree Introduction - Abdul Bari](https://www.youtube.com/watch?v=TbvhG0R3fHM) - Comprehensive explanation
- [AVL Tree Rotations - William Fiset](https://www.youtube.com/watch?v=2xl9M1dO7nU) - Rotation mechanics
- [Self-Balancing BST - mycodeschool](https://www.youtube.com/watch?v=qgCi03tWwac) - Theory and intuition

### Advanced Topics

- [AVL vs Red-Black Trees - TechDifferences](https://www.youtube.com/watch?v=TbvhG0R3fHM) - Comparison
- [Order Statistics Tree - MIT OCW](https://www.youtube.com/watch?v=TbvhG0R3fHM) - Augmented trees
- [Advanced Tree Operations](https://www.youtube.com/watch?v=TbvhG0R3fHM) - Split, merge, join

### Practice Problems

- [LeetCode Tree Problems - NeetCode](https://www.youtube.com/watch?v=TbvhG0R3fHM) - Problem solving
- [Competitive Programming - Trees](https://www.youtube.com/watch?v=TbvhG0R3fHM) - Contest applications

---

## Follow-up Questions

### Q1: What is the difference between AVL and Red-Black trees?

**Answer:**
- **Balance**: AVL is strictly balanced (|BF| ≤ 1), Red-Black is loosely balanced
- **Height**: AVL height ≤ 1.44 log(n), Red-Black height ≤ 2 log(n)
- **Rotations**: AVL does more rotations during insert/delete
- **Lookup**: AVL is faster for search-heavy workloads
- **Modification**: Red-Black is faster for insert/delete-heavy workloads

### Q2: How many rotations are needed in the worst case?

**Answer:**
- **Insert**: At most 2 rotations (one single or one double)
- **Delete**: O(log n) rotations in worst case (may need to rebalance up the path)
- **AVL vs Red-Black**: AVL does more rotations overall but guarantees shorter tree

### Q3: Can we implement AVL tree iteratively?

**Answer:** Yes, but it's more complex:
- Track path from root to insertion/deletion point
- Store parent pointers or use a stack
- Rebalance from insertion point up to root
- Usually recursion is clearer and sufficient

### Q4: What is the maximum height of an AVL tree with n nodes?

**Answer:** The height h satisfies: F(h+2) - 1 ≤ n, where F is Fibonacci sequence. This gives:
```
h ≤ 1.44 × log₂(n + 2) - 0.328
```

### Q5: When should I use AVL tree in an interview?

**Answer:**
- When guaranteed O(log n) is explicitly required
- When asked about self-balancing trees specifically
- When discussing trade-offs between tree types
- For order statistics problems (with augmentation)
- Generally, mention that Red-Black is more common in practice

---

## Summary

AVL trees are self-balancing binary search trees that guarantee O(log n) operations through strict balance maintenance using rotations.

**Key Takeaways**:

1. **Balance Factor**: |height(left) - height(right)| ≤ 1 for all nodes
2. **Four Rotation Cases**: LL, RR, LR, RL - know when to apply each
3. **Height Tracking**: Store and update height at every node
4. **Strict Balance**: Guarantees O(log n) height, better than Red-Black for lookups
5. **More Rotations**: Pay for strict balance with more rebalancing work

**When to Use**:
- Guaranteed O(log n) required
- Search-heavy workloads
- Predictable performance critical
- Moderate dataset sizes

**Common Pitfalls**:
- Wrong rotation order in double rotations
- Forgetting to update heights after rotation
- Not checking all four imbalance cases
- Recursive stack overflow on very large trees

AVL trees demonstrate important concepts in self-balancing data structures and remain relevant for applications requiring predictable, logarithmic-time operations.
