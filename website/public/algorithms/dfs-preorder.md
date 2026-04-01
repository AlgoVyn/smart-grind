# DFS Preorder

## Category
Trees & BSTs

## Description

DFS Preorder traversal is a fundamental tree traversal algorithm that visits nodes in **Root-Left-Right** order. This means the root is processed before its left and right subtrees, making it ideal for scenarios where you need to process parent nodes before their subtrees. It's one of the three primary depth-first traversal strategies and is extensively used in tree serialization, expression tree evaluation, file system operations, and many tree-related algorithms.

This pattern is essential in competitive programming and technical interviews for solving a wide range of tree problems efficiently.

---

## Concepts

The DFS Preorder technique is built on several fundamental concepts that make it powerful for solving tree problems.

### 1. Node Processing Order

The preorder traversal follows a strict processing sequence:

| Order | Action | When to Use |
|-------|--------|-------------|
| **First** | Visit Root | When parent info needed before children |
| **Second** | Traverse Left | Process entire left subtree |
| **Third** | Traverse Right | Process entire right subtree |

This creates the characteristic **Root-Left-Right** sequence.

### 2. Call Stack Utilization

Recursive preorder uses the call stack implicitly:

```
Each recursive call:
- Pushes current node context
- Processes node
- Recurses on children
- Pops when returning
```

The stack depth equals the tree height: O(h) space.

### 3. Explicit Stack (Iterative)

Iterative version uses an explicit stack:

```
Push root
While stack not empty:
    Pop node
    Visit node
    Push right (so left processed first - LIFO)
    Push left
```

### 4. State Preservation

Preorder maintains state through:
- **Recursion**: Call stack preserves parent context
- **Iteration**: Explicit stack stores nodes to process
- **Morris**: Temporary thread links for O(1) space

---

## Frameworks

Structured approaches for solving preorder traversal problems.

### Framework 1: Recursive Preorder Template

```
┌─────────────────────────────────────────────────────┐
│  RECURSIVE PREORDER FRAMEWORK                       │
├─────────────────────────────────────────────────────┤
│  1. Base case: if node is null, return              │
│  2. Process current node (visit/root action)       │
│  3. Recurse on left child                            │
│  4. Recurse on right child                           │
│  5. Return (implicit after children processed)      │
└─────────────────────────────────────────────────────┘
```

**When to use**: Clean code, simple trees, when stack overflow not a concern.

### Framework 2: Iterative Preorder Template

```
┌─────────────────────────────────────────────────────┐
│  ITERATIVE PREORDER FRAMEWORK                       │
├─────────────────────────────────────────────────────┤
│  1. If root is null, return empty result            │
│  2. Initialize stack with root                      │
│  3. While stack not empty:                          │
│     a. Pop node from stack                          │
│     b. Visit/process the node                         │
│     c. Push right child (if exists)                 │
│     d. Push left child (if exists)                │
│  4. Return collected results                          │
└─────────────────────────────────────────────────────┘
```

**When to use**: Deep trees, avoiding stack overflow, more control needed.

### Framework 3: Morris Preorder Template (O(1) Space)

```
┌─────────────────────────────────────────────────────┐
│  MORRIS PREORDER FRAMEWORK (O(1) Space)             │
├─────────────────────────────────────────────────────┤
│  1. Initialize current = root                       │
│  2. While current is not null:                      │
│     a. If current.left is null:                    │
│        - Visit current                              │
│        - Move to current.right                     │
│     b. Else:                                         │
│        - Find inorder predecessor (rightmost in left)│
│        - If predecessor.right is null:             │
│          * Visit current                           │
│          * Create thread: predecessor.right = current│
│          * Move to current.left                    │
│        - Else (thread exists):                     │
│          * Remove thread                           │
│          * Move to current.right                   │
│  3. Return results                                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: Memory constrained, O(1) space required.

---

## Forms

Different manifestations of the preorder traversal pattern.

### Form 1: Basic Preorder Traversal

Standard traversal collecting all node values:

| Implementation | Time | Space | Best For |
|----------------|------|-------|----------|
| Recursive | O(n) | O(h) | Clean, readable code |
| Iterative | O(n) | O(h) | Deep trees |
| Morris | O(n) | O(1) | Memory constrained |

### Form 2: Preorder with Path Tracking

Track the path from root to each node:

```python
def preorder_with_path(root):
    result = []
    def traverse(node, path):
        if not node:
            return
        path.append(node.val)
        result.append(path[:])  # Store copy
        traverse(node.left, path)
        traverse(node.right, path)
        path.pop()
    traverse(root, [])
    return result
```

**Use case**: Root-to-node path problems, path sum tracking.

### Form 3: Preorder with Parent Information

Pass parent node information during traversal:

```python
def preorder_with_parent(root):
    result = []
    def traverse(node, parent):
        if not node:
            return
        result.append((node.val, parent.val if parent else None))
        traverse(node.left, node)
        traverse(node.right, node)
    traverse(root, None)
    return result
```

**Use case**: Ancestor queries, parent-child relationship problems.

### Form 4: Preorder with Depth Information

Track depth level during traversal:

```python
def preorder_with_depth(root):
    result = []
    def traverse(node, depth):
        if not node:
            return
        result.append((node.val, depth))
        traverse(node.left, depth + 1)
        traverse(node.right, depth + 1)
    traverse(root, 0)
    return result
```

**Use case**: Level-aware processing, depth-based calculations.

### Form 5: N-ary Tree Preorder

Extension to trees with arbitrary number of children:

```python
class Node:
    def __init__(self, val=None, children=None):
        self.val = val
        self.children = children if children else []

def preorder_nary(root):
    if not root:
        return []
    result = [root.val]
    for child in root.children:
        result.extend(preorder_nary(child))
    return result
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Early Termination

Stop traversal once target is found:

```python
def preorder_find(root, target):
    """Find node with target value using preorder."""
    def traverse(node):
        if not node:
            return None
        if node.val == target:
            return node
        # Search left first
        left_result = traverse(node.left)
        if left_result:
            return left_result
        # Then search right
        return traverse(node.right)
    return traverse(root)
```

### Tactic 2: Tree Serialization

Create string representation for storage/transmission:

```python
def serialize(root):
    """Serialize tree to string using preorder with null markers."""
    result = []
    def traverse(node):
        if not node:
            result.append("#")
            return
        result.append(str(node.val))
        traverse(node.left)
        traverse(node.right)
    traverse(root)
    return ",".join(result)
```

### Tactic 3: Tree Cloning

Create deep copy using preorder:

```python
def clone_tree(root):
    """Create deep copy of binary tree."""
    if not root:
        return None
    new_node = TreeNode(root.val)
    new_node.left = clone_tree(root.left)
    new_node.right = clone_tree(root.right)
    return new_node
```

### Tactic 4: Expression Tree Evaluation

Evaluate prefix expressions:

```python
def evaluate_expression(node):
    """Evaluate expression tree (operators as internal nodes)."""
    if not node:
        return 0
    # Leaf node (operand)
    if not node.left and not node.right:
        return int(node.val)
    # Internal node (operator)
    left_val = evaluate_expression(node.left)
    right_val = evaluate_expression(node.right)
    if node.val == '+':
        return left_val + right_val
    elif node.val == '-':
        return left_val - right_val
    elif node.val == '*':
        return left_val * right_val
    elif node.val == '/':
        return left_val // right_val
```

### Tactic 5: Comparing Two Trees

Check if two trees are identical:

```python
def is_same_tree(p, q):
    """Check if two trees are identical using preorder."""
    if not p and not q:
        return True
    if not p or not q:
        return False
    return (p.val == q.val and
            is_same_tree(p.left, q.left) and
            is_same_tree(p.right, q.right))
```

### Tactic 6: String Construction from Tree

Build string representation with parentheses:

```python
def tree_to_string(root):
    """Convert tree to string with parenthesis representation."""
    if not root:
        return ""
    result = str(root.val)
    if root.left or root.right:
        result += "(" + tree_to_string(root.left) + ")"
    if root.right:
        result += "(" + tree_to_string(root.right) + ")"
    return result
```

---

## Python Templates

### Template 1: Recursive Preorder

```python
from typing import Optional, List

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def preorder_recursive(root: Optional[TreeNode]) -> List[int]:
    """
    Template 1: Recursive preorder traversal.
    Time: O(n), Space: O(h) where h is tree height
    """
    result = []
    
    def traverse(node: Optional[TreeNode]) -> None:
        if not node:
            return
        # Visit root first
        result.append(node.val)
        # Then traverse left subtree
        traverse(node.left)
        # Then traverse right subtree
        traverse(node.right)
    
    traverse(root)
    return result
```

### Template 2: Iterative Preorder

```python
def preorder_iterative(root: Optional[TreeNode]) -> List[int]:
    """
    Template 2: Iterative preorder using explicit stack.
    Time: O(n), Space: O(h)
    """
    if not root:
        return []
    
    result = []
    stack = [root]
    
    while stack:
        node = stack.pop()
        # Visit current node
        result.append(node.val)
        # Push right first so left is processed first (LIFO)
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    
    return result
```

### Template 3: Morris Preorder (O(1) Space)

```python
def preorder_morris(root: Optional[TreeNode]) -> List[int]:
    """
    Template 3: Morris preorder traversal - O(1) space.
    Time: O(n), Space: O(1)
    """
    result = []
    current = root
    
    while current:
        if not current.left:
            # No left subtree, visit and go right
            result.append(current.val)
            current = current.right
        else:
            # Find inorder predecessor (rightmost node in left subtree)
            predecessor = current.left
            while predecessor.right and predecessor.right != current:
                predecessor = predecessor.right
            
            if not predecessor.right:
                # First time visiting - create temporary thread
                result.append(current.val)  # Visit root
                predecessor.right = current  # Create thread back to current
                current = current.left  # Move to left subtree
            else:
                # Second time visiting - restore tree and move right
                predecessor.right = None  # Remove thread
                current = current.right  # Move to right subtree
    
    return result
```

### Template 4: Preorder with Path

```python
def preorder_with_path(root: Optional[TreeNode]) -> List[List[int]]:
    """
    Template 4: Preorder with path tracking from root.
    Time: O(n), Space: O(h) for recursion + O(n*h) for output
    """
    result = []
    
    def traverse(node: Optional[TreeNode], path: List[int]) -> None:
        if not node:
            return
        path.append(node.val)
        result.append(path.copy())
        traverse(node.left, path)
        traverse(node.right, path)
        path.pop()
    
    traverse(root, [])
    return result
```

### Template 5: N-ary Tree Preorder

```python
class NaryTreeNode:
    def __init__(self, val=None, children=None):
        self.val = val
        self.children = children if children else []

def preorder_nary(root: NaryTreeNode) -> List[int]:
    """
    Template 5: Preorder for N-ary tree.
    Time: O(n), Space: O(h)
    """
    if not root:
        return []
    
    result = [root.val]
    
    for child in root.children:
        result.extend(preorder_nary(child))
    
    return result

def preorder_nary_iterative(root: NaryTreeNode) -> List[int]:
    """
    Iterative preorder for N-ary tree.
    Time: O(n), Space: O(h)
    """
    if not root:
        return []
    
    result = []
    stack = [root]
    
    while stack:
        node = stack.pop()
        result.append(node.val)
        # Add children in reverse order
        stack.extend(reversed(node.children))
    
    return result
```

---

## When to Use

Use the DFS Preorder algorithm when you need to solve problems involving:

- **Tree Serialization/Deserialization**: Creating a unique representation of a tree that can be reconstructed
- **Expression Tree Operations**: Evaluating prefix expressions or converting to prefix notation
- **File System Traversal**: Navigating directory structures where parent directories must be processed before children
- **Tree Copy/Clone**: Creating a deep copy of a binary tree
- **Path-based Operations**: Problems where you need to process a node before exploring its children

### Comparison with Alternative Tree Traversals

| Traversal Order | Visit Sequence | Use Case | Example Problems |
|-----------------|----------------|----------|------------------|
| **Preorder** | Root → Left → Right | Process node before children | Tree clone, serialization, prefix expression |
| **Inorder** | Left → Root → Right | BST operations, sorted output | BST search, kth smallest, validate BST |
| **Postorder** | Left → Right → Root | Process children before node | Delete tree, expression evaluation, bottom-up DP |
| **Level-order** | Level by level | Breadth-first operations | Shortest path, level averages |

### When to Choose Preorder vs Other DFS Orders

- **Choose Preorder** when:
  - You need to process the parent node before its children
  - Tree serialization is required (preorder with null markers creates unique representation)
  - You're building a tree from its preorder traversal
  - You need prefix expression evaluation

- **Choose Inorder** when:
  - Working with BSTs (gives sorted order)
  - You need nodes in ascending order
  - You're validating or debugging BST properties

- **Choose Postorder** when:
  - You need to process children before parent
  - Tree deletion (free children before parent)
  - Expression postfix evaluation
  - Bottom-up dynamic programming on trees

---

## Algorithm Explanation

### Core Concept

DFS Preorder traversal follows the principle of **depth-first exploration**, where we explore as far as possible along each branch before backtracking. The "preorder" designation specifically means the root is visited before its left and right subtrees. This creates a specific visitation order: process current node, recursively visit left subtree, then recursively visit right subtree.

The key insight behind preorder traversal is its ability to establish a **parent-before-child processing order**, which is essential for many tree algorithms that need to make decisions based on parent information before processing children.

### How It Works

#### Recursive Implementation:
1. Start at the root node
2. **Visit** the current node (process its value)
3. **Recursively traverse** the left subtree
4. **Recursively traverse** the right subtree

#### Iterative Implementation:
1. Use an explicit stack data structure
2. Push root onto stack
3. While stack is not empty:
   - Pop a node from stack
   - Visit the node
   - Push right child first (so left is processed first due to LIFO)
   - Push left child if exists

### Visual Representation

For the binary tree:
```
        1
       / \
      2   3
     / \
    4   5
```

The preorder traversal visits nodes in this sequence:

```
Step 1: Visit 1 (root)                    → [1]
Step 2: Go left to 2, visit 2             → [1, 2]
Step 3: Go left to 4, visit 4              → [1, 2, 4]
Step 4: 4 has no children, backtrack to 2
Step 5: Go right to 5, visit 5             → [1, 2, 4, 5]
Step 6: 5 has no children, backtrack to 2
Step 7: 2's subtree done, backtrack to 1
Step 8: Go right to 3, visit 3             → [1, 2, 4, 5, 3]
Step 9: 3 has no children, done

Final Result: [1, 2, 4, 5, 3]
```

### Why Preorder Works for Specific Problems

- **Tree Serialization**: Preorder with null node markers creates a unique string representation because the root is always first
- **Tree Cloning**: Process current node, then clone children - parent must exist before children are attached
- **Prefix Expression**: Evaluate operators before operands by processing operator nodes first

### Limitations

- **Stack overflow risk**: For very deep trees, recursive implementation may cause stack overflow
- **No sorted order**: Unlike inorder traversal, preorder doesn't produce sorted output for BSTs
- **Space overhead**: Recursive and iterative versions use O(h) space

---

## Practice Problems

### Problem 1: Binary Tree Preorder Traversal

**Problem:** [LeetCode 144 - Binary Tree Preorder Traversal](https://leetcode.com/problems/binary-tree-preorder-traversal/)

**Description:** Given the root of a binary tree, return the preorder traversal of its nodes' values.

**How to Apply Preorder:**
- Visit root first, then recursively process left and right subtrees
- For iterative: use stack, push right before left to ensure left is processed first

---

### Problem 2: Serialize and Deserialize Binary Tree

**Problem:** [LeetCode 297 - Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/)

**Description:** Design an algorithm to serialize and deserialize a binary tree.

**How to Apply Preorder:**
- Preorder with null markers creates unique representation
- Serialization: Preorder traversal, mark null nodes with special symbol
- Deserialization: Read preorder, recursively build tree using first non-null as root

---

### Problem 3: Construct String from Binary Tree

**Problem:** [LeetCode 606 - Construct String from Binary Tree](https://leetcode.com/problems/construct-string-from-binary-tree/)

**Description:** Given the root of a binary tree, construct a string consisting of parenthesis and integers from a binary tree with the preorder traversal way.

**How to Apply Preorder:**
- Use preorder to build string representation
- Add parentheses around left child (even if empty) when right exists
- Omit empty parentheses for right-only children

---

### Problem 4: Path Sum

**Problem:** [LeetCode 112 - Path Sum](https://leetcode.com/problems/path-sum/)

**Description:** Given the root of a binary tree and an integer targetSum, return true if the tree has a root-to-leaf path such that adding up all the values along the path equals targetSum.

**How to Apply Preorder:**
- Traverse tree in preorder, accumulating path sum
- Subtract node value from targetSum at each step
- At leaf, check if remaining targetSum equals leaf's value

---

### Problem 5: N-ary Tree Preorder Traversal

**Problem:** [LeetCode 589 - N-ary Tree Preorder Traversal](https://leetcode.com/problems/n-ary-tree-preorder-traversal/)

**Description:** Given the root of an n-ary tree, return the preorder traversal of its nodes' values.

**How to Apply Preorder:**
- Visit root first, then recursively process all children left-to-right
- For iterative: use stack, push children in reverse order so first child processed first

---

## Video Tutorial Links

### Fundamentals

- [Binary Tree Traversal - Preorder (Take U Forward)](https://www.youtube.com/watch?v=gm8DU5hm8Ao) - Comprehensive preorder traversal explanation
- [Preorder Traversal (Coding Ninjas)](https://www.youtube.com/watch?v=RlUu72xM7lU) - Visual explanation with examples
- [Tree Traversals (Backseat Coding)](https://www.youtube.com/watch?v=oM1MkvCsANQ) - All tree traversals explained

### Implementation Techniques

- [Recursive vs Iterative Tree Traversal](https://www.youtube.com/watch?v=5zVNplHjG6M) - When to use which approach
- [Morris Traversal - O(1) Space](https://www.youtube.com/watch?v=80Zug6gD2j4) - Advanced space optimization
- [Stack-based Iterative Traversal](https://www.youtube.com/watch?v=l45Q3UD6uE4) - Detailed iterative implementation

### Problem Solutions

- [Serialize Deserialize Binary Tree](https://www.youtube.com/watch?v=-YbXySKJQX8) - Preorder for tree serialization
- [Path Sum Problem](https://www.youtube.com/watch?v=6Q7OrZawnM4) - Preorder for path tracking
- [N-ary Tree Traversal](https://www.youtube.com/watch?v=ZaK9bF1KBYM) - Extension to N-ary trees

---

## Follow-up Questions

### Q1: What is the difference between preorder, inorder, and postorder traversal?

**Answer:** The key difference lies in when the root node is visited relative to its left and right subtrees:
- **Preorder**: Root → Left → Right (root is visited first)
- **Inorder**: Left → Root → Right (root is visited in the middle)
- **Postorder**: Left → Right → Root (root is visited last)

For the tree:
```
        1
       / \
      2   3
```
- Preorder: [1, 2, 3]
- Inorder: [2, 1, 3]
- Postorder: [2, 3, 1]

Each traversal has specific use cases: preorder for serialization and copying, inorder for BST operations, postorder for deletion and evaluation.

---

### Q2: When should I use iterative over recursive traversal?

**Answer:** Use iterative traversal when:
1. **Tree depth is very large**: Recursive approach may cause stack overflow for trees with depth > 10^5
2. **Memory is constrained**: Recursive call stack uses more memory
3. **Production code safety**: Iterative is more predictable and has bounded memory usage
4. **You need more control**: Iterative allows pausing, resuming, or early termination

---

### Q3: Can preorder traversal be used to validate a BST?

**Answer:** Not directly - inorder traversal is better for BST validation because it produces sorted order. However, preorder can be modified to validate BST by passing min/max bounds:
- Each node must be greater than all values in left subtree
- Each node must be less than all values in right subtree
- Track (min, max) bounds during preorder traversal

---

### Q4: What is Morris traversal and when should I use it?

**Answer:** Morris traversal uses a threading technique to achieve O(1) space complexity without using a stack or recursion. It temporarily creates links back to ancestors to find the way back to the tree.

**Use Morris when:**
- Space is extremely constrained
- Tree is read-only (modifies tree temporarily)
- You need constant space complexity

**Avoid Morris when:**
- Tree cannot be modified
- Code clarity is important
- Regular stack is acceptable

---

### Q5: How does preorder help in tree serialization?

**Answer:** Preorder is ideal for serialization because:
1. **Root first**: The root is always the first element, establishing tree structure immediately
2. **Unique representation**: With null markers, preorder produces a unique string for each tree structure
3. **Simple deserialization**: Read preorder, recursively build tree - first non-null is always the parent

Example: Tree [1,2,3,null,4] serializes to "1#2##3##4##" (where # = null)

---

## Summary

DFS Preorder traversal is a fundamental tree algorithm with the following key characteristics:

- **Order**: Root → Left → Right - parent is processed before children
- **Time**: O(n) - each node visited exactly once
- **Space**: O(h) for recursive/iterative, O(1) for Morris
- **Key Use Cases**: Tree serialization, cloning, prefix expression evaluation, file system traversal

When to use Preorder:
- ✅ Tree serialization/deserialization
- ✅ Tree copying/cloning
- ✅ Prefix expression evaluation
- ✅ File system navigation
- ✅ DOM tree traversal
- ✅ Any problem requiring parent-before-child processing

When NOT to use Preorder:
- ❌ BST operations (use Inorder)
- ❌ Tree deletion (use Postorder)
- ❌ Level-based processing (use BFS)

This traversal pattern is essential for competitive programming and technical interviews, forming the foundation for many more complex tree algorithms.