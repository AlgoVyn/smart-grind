# Recover BST

## Category
Trees & BSTs

## Description

The Recover BST algorithm fixes a Binary Search Tree where exactly **two nodes have been swapped**, violating the BST property. This is a classic tree traversal problem that leverages the fundamental property of BSTs: an **in-order traversal yields values in sorted (ascending) order**.

When two nodes in a BST are swapped, the in-order sequence will have **at most two violations** where a value is smaller than its predecessor. By identifying these violations during traversal, we can locate and swap the two misplaced nodes to restore the BST property without changing the tree structure.

---

## Concepts

The Recover BST algorithm is built on several fundamental concepts from tree traversal and BST properties.

### 1. In-Order Traversal Property

The key insight that enables this algorithm:

| Tree State | In-Order Sequence | Sorted? |
|------------|-------------------|---------|
| **Valid BST** | [1, 2, 3, 4, 5, 6, 7] | Yes |
| **Two nodes swapped** | [1, 2, 7, 4, 5, 6, 3] | No (violations at 7>4, 6>3) |
| **Adjacent swap** | [1, 2, 4, 3, 5, 6, 7] | No (violation at 4>3) |

### 2. Violation Detection

During in-order traversal, compare each node with its predecessor:

```
When current.val < prev.val:
    → Found a violation!
    → First violation: first = prev
    → Second violation: second = current (always update)
```

### 3. Two Cases of Swaps

**Case 1: Non-adjacent nodes**
```
Original:  [1, 2, 3, 4, 5, 6, 7, 8]
Swapped:   [1, 2, 7, 4, 5, 6, 3, 8]  (3 and 7 swapped)
                  ↑        ↑
             first=7    second=3
Two violations found
```

**Case 2: Adjacent nodes**
```
Original:  [1, 2, 3, 4, 5, 6, 7, 8]
Swapped:   [1, 2, 4, 3, 5, 6, 7, 8]  (3 and 4 swapped)
                  ↑  ↑
             first=4  second=3
One violation found, but second always updated
```

### 4. Traversal Approaches

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| **Iterative** | O(n) | O(h) | Production, balanced trees |
| **Recursive** | O(n) | O(h) | Interviews, simple code |
| **Morris** | O(n) | O(1) | Space-critical scenarios |

**h = height of tree, n = number of nodes**

---

## Frameworks

Structured approaches for recovering a corrupted BST.

### Framework 1: Iterative In-Order Recovery

```
┌─────────────────────────────────────────────────────┐
│  RECOVER BST FRAMEWORK (Iterative)                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Initialize:                                        │
│  - stack = []                                       │
│  - current = root                                   │
│  - prev = None                                      │
│  - first = None, second = None                      │
│                                                     │
│  While stack not empty OR current not null:        │
│                                                     │
│    1. TRAVERSE LEFT:                                │
│       while current:                                │
│           stack.push(current)                       │
│           current = current.left                    │
│                                                     │
│    2. PROCESS NODE:                                 │
│       current = stack.pop()                         │
│                                                     │
│       if prev AND current.val < prev.val:          │
│           if first is None:                        │
│               first = prev          ← 1st violation│
│           second = current            ← 2nd violation│
│                                                     │
│       prev = current                                │
│                                                     │
│    3. GO RIGHT:                                     │
│       current = current.right                       │
│                                                     │
│  SWAP: first.val, second.val = second.val, first.val│
│                                                     │
│  Complexity: O(n) time, O(h) space                  │
└─────────────────────────────────────────────────────┘
```

### Framework 2: Morris Traversal Recovery

```
┌─────────────────────────────────────────────────────┐
│  RECOVER BST FRAMEWORK (Morris - O(1) Space)        │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Initialize:                                        │
│  - current = root                                   │
│  - prev = None                                      │
│  - first = None, second = None                      │
│                                                     │
│  While current is not null:                         │
│                                                     │
│    if current.left is null:                         │
│        // Process current (no left subtree)         │
│        if prev AND current.val < prev.val:          │
│            if first is None: first = prev          │
│            second = current                         │
│        prev = current                               │
│        current = current.right                      │
│                                                     │
│    else:                                            │
│        // Find inorder predecessor                  │
│        pred = current.left                          │
│        while pred.right AND pred.right != current: │
│            pred = pred.right                        │
│                                                     │
│        if pred.right is null:                       │
│            // Create temporary thread               │
│            pred.right = current                     │
│            current = current.left                   │
│        else:                                        │
│            // Thread exists, remove and process     │
│            pred.right = null                        │
│            if prev AND current.val < prev.val:     │
│                if first is None: first = prev        │
│                second = current                     │
│            prev = current                           │
│            current = current.right                  │
│                                                     │
│  SWAP: first.val, second.val = second.val, first.val│
│                                                     │
│  Complexity: O(n) time, O(1) space                  │
└─────────────────────────────────────────────────────┘
```

### Framework 3: Recursive Recovery

```
┌─────────────────────────────────────────────────────┐
│  RECOVER BST FRAMEWORK (Recursive)                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Global/Nonlocal: first, second, prev               │
│                                                     │
│  function inorder(node):                            │
│      if node is null: return                        │
│                                                     │
│      // 1. Traverse left                              │
│      inorder(node.left)                             │
│                                                     │
│      // 2. Process current                            │
│      if prev AND node.val < prev.val:               │
│          if first is None: first = prev              │
│          second = node                              │
│      prev = node                                    │
│                                                     │
│      // 3. Traverse right                             │
│      inorder(node.right)                            │
│                                                     │
│  Main:                                              │
│      first = second = prev = null                   │
│      inorder(root)                                  │
│      swap(first.val, second.val)                    │
│                                                     │
│  Complexity: O(n) time, O(h) stack space            │
│  Risk: Stack overflow for skewed trees              │
└─────────────────────────────────────────────────────┘
```

---

## Forms

Different manifestations and variations of the Recover BST pattern.

### Form 1: Non-Adjacent Node Swap

Two swapped nodes are far apart in in-order sequence.

| Characteristic | Description |
|----------------|-------------|
| **Violations** | Exactly 2 |
| **First node** | Predecessor of first violation |
| **Second node** | Current node of second violation |
| **Example** | [1,2,7,4,5,6,3,8] → swap 7 and 3 |

### Form 2: Adjacent Node Swap

Two swapped nodes are next to each other in in-order sequence.

| Characteristic | Description |
|----------------|-------------|
| **Violations** | Exactly 1 |
| **First node** | Predecessor of violation |
| **Second node** | Current node of violation |
| **Example** | [1,2,4,3,5,6,7,8] → swap 4 and 3 |

### Form 3: Morris Traversal Form

Space-optimized version using temporary threads.

| Aspect | Description |
|--------|-------------|
| **Threads** | Temporary right pointers to inorder successors |
| **Space** | O(1) extra space |
| **Tree modification** | Temporarily modified, restored at end |
| **Use case** | Space-constrained environments |

### Form 4: BST Validation Form

Detect violations without fixing (validation only).

```python
def is_valid_bst(root):
    """Return True if BST is valid, False otherwise."""
    prev = None
    
    def inorder(node):
        nonlocal prev
        if not node:
            return True
        
        if not inorder(node.left):
            return False
        
        if prev and node.val <= prev.val:
            return False
        
        prev = node
        return inorder(node.right)
    
    return inorder(root)
```

---

## Tactics

Specific techniques and optimizations for recovering BST.

### Tactic 1: Always Update Second Node

Handle both adjacent and non-adjacent cases uniformly:

```python
def recover_tree(root):
    first = second = prev = None
    
    def inorder(node):
        nonlocal first, second, prev
        if not node:
            return
        
        inorder(node.left)
        
        # Check violation
        if prev and node.val < prev.val:
            if first is None:
                first = prev  # First violation found
            second = node     # Always update second!
            
        prev = node
        inorder(node.right)
    
    inorder(root)
    
    # Swap values
    if first and second:
        first.val, second.val = second.val, first.val
```

**Why this works:**
- Non-adjacent: First violation sets `first`, second violation sets `second`
- Adjacent: Only one violation, but `second` correctly captures the adjacent node

### Tactic 2: Morris Traversal Predecessor Finding

Find inorder predecessor without parent pointers:

```python
def find_predecessor(current):
    """Find rightmost node in left subtree."""
    pred = current.left
    while pred.right and pred.right != current:
        pred = pred.right
    return pred
```

**Usage:**
- If `pred.right` is null: Create thread, go left
- If `pred.right` is current: Remove thread, process current, go right

### Tactic 3: BST Iterator Pattern

Encapsulate traversal logic for cleaner code:

```python
class BSTIterator:
    """Iterator for in-order traversal of BST."""
    
    def __init__(self, root):
        self.stack = []
        self._push_left(root)
    
    def _push_left(self, node):
        while node:
            self.stack.append(node)
            node = node.left
    
    def next(self):
        node = self.stack.pop()
        self._push_left(node.right)
        return node
    
    def has_next(self):
        return len(self.stack) > 0


def recover_tree_iterator(root):
    """Recover using BST iterator pattern."""
    iterator = BSTIterator(root)
    first = second = prev = None
    
    while iterator.has_next():
        current = iterator.next()
        if prev and current.val < prev.val:
            if first is None:
                first = prev
            second = current
        prev = current
    
    if first and second:
        first.val, second.val = second.val, first.val
```

### Tactic 4: Value Swap vs Node Swap

Swap values, not nodes (simpler and more efficient):

| Aspect | Value Swap | Node Swap |
|--------|------------|-----------|
| **Complexity** | O(1) | O(n) |
| **Implementation** | Simple | Complex (update parent pointers) |
| **Problem requirement** | Satisfied ("recover the tree") | Not required |
| **Recommended** | ✅ Yes | ❌ No |

```python
# Recommended: Value swap
first.val, second.val = second.val, first.val

# NOT recommended: Node swap (would require parent pointers,
# handling children correctly, updating hash maps, etc.)
```

### Tactic 5: Handling Edge Cases

Defensive programming for various tree structures:

```python
def recover_tree(root):
    """Handle all edge cases."""
    # Edge case: empty tree
    if not root:
        return
    
    # Edge case: single node (already valid)
    if not root.left and not root.right:
        return
    
    first = second = prev = None
    
    # ... traversal logic ...
    
    # Edge case: no violations found (already valid)
    if not first or not second:
        return
    
    # Swap values
    first.val, second.val = second.val, first.val
```

---

## Python Templates

### Template 1: Iterative In-Order Recovery

```python
from typing import Optional, List

class TreeNode:
    def __init__(self, val: int = 0, 
                 left: 'TreeNode' = None, 
                 right: 'TreeNode' = None):
        self.val = val
        self.left = left
        self.right = right


def recover_tree_iterative(root: Optional[TreeNode]) -> None:
    """
    Recover BST using iterative in-order traversal.
    
    Time: O(n) - visit each node once
    Space: O(h) - stack space, h = tree height
    """
    if not root:
        return
    
    stack: List[TreeNode] = []
    current = root
    first: Optional[TreeNode] = None
    second: Optional[TreeNode] = None
    prev: Optional[TreeNode] = None
    
    while stack or current:
        # Go to leftmost node
        while current:
            stack.append(current)
            current = current.left
        
        # Process current node
        current = stack.pop()
        
        # Check for violation
        if prev and current.val < prev.val:
            if first is None:
                first = prev
            second = current
        
        prev = current
        current = current.right
    
    # Swap values
    if first and second:
        first.val, second.val = second.val, first.val
```

### Template 2: Morris Traversal Recovery

```python
def recover_tree_morris(root: Optional[TreeNode]) -> None:
    """
    Recover BST using Morris Traversal - O(1) space solution.
    
    Time: O(n) - each edge traversed at most twice
    Space: O(1) - only pointers used
    """
    if not root:
        return
    
    current = root
    first: Optional[TreeNode] = None
    second: Optional[TreeNode] = None
    prev: Optional[TreeNode] = None
    
    while current:
        if not current.left:
            # Visit node - no left subtree
            if prev and current.val < prev.val:
                if first is None:
                    first = prev
                second = current
            prev = current
            current = current.right
        else:
            # Find inorder predecessor
            pred = current.left
            while pred.right and pred.right != current:
                pred = pred.right
            
            if not pred.right:
                # Create temporary thread link
                pred.right = current
                current = current.left
            else:
                # Thread exists, remove it and visit node
                pred.right = None
                if prev and current.val < prev.val:
                    if first is None:
                        first = prev
                    second = current
                prev = current
                current = current.right
    
    # Swap values
    if first and second:
        first.val, second.val = second.val, first.val
```

### Template 3: Recursive Recovery

```python
def recover_tree_recursive(root: Optional[TreeNode]) -> None:
    """
    Recover BST using recursive in-order traversal.
    
    Time: O(n)
    Space: O(h) - recursion stack
    
    Note: Risk of stack overflow for skewed trees.
    """
    first: Optional[TreeNode] = None
    second: Optional[TreeNode] = None
    prev: Optional[TreeNode] = None
    
    def inorder(node: Optional[TreeNode]) -> None:
        nonlocal first, second, prev
        if not node:
            return
        
        # Traverse left
        inorder(node.left)
        
        # Process current
        if prev and node.val < prev.val:
            if first is None:
                first = prev
            second = node
        
        prev = node
        
        # Traverse right
        inorder(node.right)
    
    inorder(root)
    
    if first and second:
        first.val, second.val = second.val, first.val
```

### Template 4: BST Iterator Recovery

```python
class BSTIterator:
    """Iterator for in-order traversal of BST."""
    
    def __init__(self, root: Optional[TreeNode]):
        self.stack: List[TreeNode] = []
        self._push_left(root)
    
    def _push_left(self, node: Optional[TreeNode]) -> None:
        while node:
            self.stack.append(node)
            node = node.left
    
    def next(self) -> TreeNode:
        node = self.stack.pop()
        self._push_left(node.right)
        return node
    
    def has_next(self) -> bool:
        return len(self.stack) > 0


def recover_tree_iterator(root: Optional[TreeNode]) -> None:
    """
    Recover BST using BST iterator pattern.
    Clean separation of traversal and logic.
    
    Time: O(n)
    Space: O(h)
    """
    if not root:
        return
    
    iterator = BSTIterator(root)
    first: Optional[TreeNode] = None
    second: Optional[TreeNode] = None
    prev: Optional[TreeNode] = None
    
    while iterator.has_next():
        current = iterator.next()
        if prev and current.val < prev.val:
            if first is None:
                first = prev
            second = current
        prev = current
    
    if first and second:
        first.val, second.val = second.val, first.val
```

### Template 5: Complete Solution with All Approaches

```python
def recover_tree(root: Optional[TreeNode], 
                 method: str = "iterative") -> None:
    """
    Recover BST with selectable method.
    
    Methods:
        - "iterative": Stack-based in-order (recommended)
        - "morris": O(1) space, modifies tree temporarily
        - "recursive": Simple but stack overflow risk
    """
    if method == "iterative":
        recover_tree_iterative(root)
    elif method == "morris":
        recover_tree_morris(root)
    elif method == "recursive":
        recover_tree_recursive(root)
    else:
        raise ValueError(f"Unknown method: {method}")
```

---

## When to Use

Use the Recover BST algorithm when you need to solve problems involving:

- **BST Validation and Repair**: When a BST has been corrupted by swapping exactly two nodes
- **Tree Traversal Patterns**: Problems requiring in-order traversal analysis
- **Node Identification**: Finding nodes that violate BST properties
- **Space-Constrained Environments**: When O(1) extra space is required (using Morris Traversal)

### Comparison: Recover BST vs Tree Reconstruction

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|-----------------|------------------|----------|
| **In-order + Sort** | O(n log n) | O(n) | When you can extract all values |
| **Iterative In-order** | O(n) | O(h) | Standard approach, balanced space/time |
| **Morris Traversal** | O(n) | O(1) | When space is critical |
| **Recursive In-order** | O(n) | O(h) | Simple implementation, risk of stack overflow |

**Legend**: n = number of nodes, h = height of tree

### When to Choose Each Approach

- **Choose Iterative In-order** when:
  - You need a clean, efficient implementation
  - Tree height is reasonable (balanced BST)
  - Stack space of O(h) is acceptable

- **Choose Morris Traversal** when:
  - Space optimization is critical
  - You're working with extremely deep trees
  - You cannot use recursion or extra stack space

- **Avoid Recursive In-order** when:
  - Tree could be skewed (h = n, causing stack overflow)
  - Working with large trees in production code

---

## Algorithm Explanation

### Core Concept

The fundamental insight behind recovering a BST is that **in-order traversal of a valid BST produces a sorted sequence**. When two nodes are swapped, this sorted property is violated at specific points:

```
Valid BST In-order:     [1, 2, 3, 4, 5, 6, 7, 8]
Swapped Nodes (3, 7):   [1, 2, 7, 4, 5, 6, 3, 8]
                              ↑     ↑
                         violation  violation
```

### How It Works

#### Detecting Violations:

During in-order traversal, we compare each node with its predecessor:
- If `current.val < prev.val`, we've found a violation
- The first violation gives us the **first swapped node** (the predecessor)
- The second violation gives us the **second swapped node** (the current node)

#### Two Cases of Swapped Nodes:

**Case 1: Non-adjacent nodes in in-order sequence**
```
Original:  [1, 2, 3, 4, 5, 6, 7, 8]
Swapped:   [1, 2, 7, 4, 5, 6, 3, 8]  (3 and 7 swapped)
                  ↑        ↑
             first=7    second=3
```

**Case 2: Adjacent nodes in in-order sequence**
```
Original:  [1, 2, 3, 4, 5, 6, 7, 8]
Swapped:   [1, 2, 4, 3, 5, 6, 7, 8]  (3 and 4 swapped)
                  ↑  ↑
             first=4  second=3
```

### Visual Representation

Consider this BST with nodes 3 and 7 swapped:

```
Before Recovery:
        5
       / \
      3   8
     / \   \
    1   7   9
       /
      6

In-order traversal: [1, 3, 7, 6, 5, 8, 9]
                     ↑  ↑
                violation 1 (7 > 6)
                           ↑     ↑
                      violation 2 (6 > 5)

After Recovery (swap 3 and 7):
        5
       / \
      7   8
     / \   \
    1   3   9
       /
      6

In-order traversal: [1, 3, 5, 6, 7, 8, 9] ✓ Sorted!
```

### Why At Most Two Violations?

When two elements in a sorted array are swapped:
- If they are **not adjacent**: Creates exactly 2 violations
- If they are **adjacent**: Creates exactly 1 violation

This property allows us to identify both nodes with a single traversal.

### Limitations

- **Exactly two nodes swapped**: Algorithm assumes this constraint
- **Value swap only**: Swaps values, not entire nodes (simpler and valid)
- **In-order traversal required**: Must traverse entire tree
- **Not for general sorting**: Only fixes BST-specific violations

---

## Practice Problems

### Problem 1: Recover Binary Search Tree

**Problem:** [LeetCode 99 - Recover Binary Search Tree](https://leetcode.com/problems/recover-binary-search-tree/)

**Description:** You are given the `root` of a binary search tree (BST), where the values of exactly two nodes of the tree were swapped by mistake. Recover the tree without changing its structure.

**How to Apply:**
- Use iterative in-order traversal to find the two violations
- First violation: `prev.val > current.val`, mark `first = prev`
- Second violation: mark `second = current`
- Swap values of `first` and `second`

---

### Problem 2: Validate Binary Search Tree

**Problem:** [LeetCode 98 - Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/)

**Description:** Given the `root` of a binary tree, determine if it is a valid binary search tree (BST).

**How to Apply Recover BST Pattern:**
- Similar in-order traversal approach
- Track previous node and ensure `current.val > prev.val`
- Return false if any violation found
- This is essentially the detection phase without the recovery

---

### Problem 3: Binary Search Tree Iterator

**Problem:** [LeetCode 173 - Binary Search Tree Iterator](https://leetcode.com/problems/binary-search-tree-iterator/)

**Description:** Implement the `BSTIterator` class that represents an iterator over the in-order traversal of a binary search tree.

**How to Apply Recover BST Pattern:**
- Same iterative in-order traversal mechanism
- Controlled iteration using a stack
- Understanding this helps implement recover BST with cleaner code

---

### Problem 4: Kth Smallest Element in a BST

**Problem:** [LeetCode 230 - Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/)

**Description:** Given the `root` of a binary search tree, and an integer `k`, return the `k`th smallest value (1-indexed) of all the values of the nodes in the tree.

**How to Apply Recover BST Pattern:**
- Use the same in-order traversal approach
- Count nodes as you visit them
- Return when count reaches k
- Morris traversal can solve this in O(1) space

---

### Problem 5: Two Sum IV - Input is a BST

**Problem:** [LeetCode 653 - Two Sum IV - Input is a BST](https://leetcode.com/problems/two-sum-iv-input-is-a-bst/)

**Description:** Given the `root` of a binary search tree and an integer `k`, return `true` if there exist two elements in the BST such that their sum is equal to the given target.

**How to Apply Recover BST Pattern:**
- Use BST iterator for forward in-order traversal (ascending)
- Use reverse BST iterator for backward in-order traversal (descending)
- Two-pointer technique: if sum < target, move left iterator; if sum > target, move right iterator

---

## Video Tutorial Links

### Fundamentals

- [Recover Binary Search Tree (NeetCode)](https://www.youtube.com/watch?v=3Q_oYDQ2whs) - Clear explanation with visualization
- [Recover BST - Morris Traversal (Striver)](https://www.youtube.com/watch?v=1l_0QEF7rsE) - O(1) space solution explained
- [Binary Search Tree Recovery (take U forward)](https://www.youtube.com/watch?v=ZWGW7FminDM) - Step-by-step walkthrough

### Advanced Topics

- [Morris Traversal Explained](https://www.youtube.com/watch?v=wGXB9OWhPTg) - Threaded binary trees in detail
- [BST Iterator Pattern](https://www.youtube.com/watch?v=Ddg4tA9fG0w) - Controlled tree traversal
- [Space Optimized Tree Algorithms](https://www.youtube.com/watch?v=24Kp_0RpL1w) - O(1) space techniques

---

## Follow-up Questions

### Q1: Why do we swap values instead of nodes?

**Answer:** Swapping values is simpler and more efficient than swapping nodes:
- **Value swap**: O(1) - just exchange two integers
- **Node swap**: O(n) potentially - need to update parent pointers, handle children correctly
- The problem asks to "recover the tree" which is satisfied by fixing the values
- Node swap would require knowing parent pointers and handling various tree configurations

### Q2: Can there be more than two violations?

**Answer:** No, when exactly two nodes are swapped in a BST:
- **Non-adjacent case**: Creates exactly 2 violations
- **Adjacent case**: Creates exactly 1 violation
- More violations would mean more than 2 nodes were swapped
- The algorithm handles both cases: always update `second` node on violation

### Q3: What if more than two nodes are swapped?

**Answer:** The algorithm won't correctly recover the tree:
- It's designed for exactly two swapped nodes
- With more swaps, you'd need a different approach:
  - Extract all values, sort them, then rebuild (O(n log n))
  - Or use a more complex algorithm to identify all misplaced nodes
- This is why problem constraints specify "exactly two nodes"

### Q4: Why is Morris Traversal O(1) space?

**Answer:** Morris Traversal achieves O(1) space by:
- Using the tree's own null pointers as temporary threads
- No stack or recursion needed
- Each node has a right pointer that can temporarily point to its in-order successor
- These threads are created and then removed (tree restored to original structure)
- Only uses a few pointer variables regardless of tree size

### Q5: When should I avoid Morris Traversal?

**Answer:** Avoid Morris Traversal when:
- **Multi-threaded environment**: Modifying tree structure can cause race conditions
- **Immutable trees**: Tree cannot be temporarily modified
- **Read-only access**: Not allowed to modify tree even temporarily
- **Simpler code preferred**: Iterative solution is more readable and maintainable
- **Performance critical**: Morris has higher constant factor despite same asymptotic complexity

---

## Summary

The **Recover BST** algorithm is a classic tree traversal problem that demonstrates the power of **in-order traversal** in BST problems. Key takeaways:

- **Core Insight**: In-order traversal of BST yields sorted order; swapped nodes create violations
- **Detection**: Track `prev` node during traversal; violations occur when `current.val < prev.val`
- **Two Cases**: Non-adjacent swap (2 violations) vs adjacent swap (1 violation)
- **Implementation Options**:
  - **Iterative**: O(n) time, O(h) space - balanced approach
  - **Morris**: O(n) time, O(1) space - optimal space
  - **Recursive**: O(n) time, O(h) space - simplest code, stack overflow risk

**When to use each approach:**
- ✅ Use **Iterative** for production code with balanced trees
- ✅ Use **Morris** when space is critical and tree can be temporarily modified
- ✅ Use **Recursive** for interviews and small trees
- ❌ Avoid **Recursive** for potentially skewed trees (stack overflow risk)

**Common Pattern Extensions:**
- BST validation (same traversal, just detect without fixing)
- Kth smallest element (stop traversal at kth node)
- BST Iterator (controlled traversal)
- Two Sum in BST (forward + reverse iterators)

Mastering this algorithm provides a foundation for many BST-related problems in competitive programming and technical interviews.
