# BST Insert

## Category
Trees & BSTs

## Description

Insert a new node into a Binary Search Tree (BST) while maintaining the BST property. This fundamental operation enables dynamic tree construction and is the basis for BST-based data structures like sets and maps. The algorithm ensures that after insertion, the tree maintains the critical invariant: for every node, all values in the left subtree are smaller, and all values in the right subtree are larger.

BST insertion is a core building block for more advanced tree algorithms and data structures. Understanding the nuances of both recursive and iterative implementations, handling duplicates, and recognizing performance characteristics across different tree shapes is essential for effective tree manipulation.

---

## Concepts

The BST Insert algorithm is built on several fundamental concepts that ensure correct tree construction.

### 1. Binary Search Property

The invariant that defines a BST:

| Property | Description | Implication |
|----------|-------------|-------------|
| **Left Subtree** | All values < node.val | Search left for smaller values |
| **Right Subtree** | All values > node.val | Search right for larger values |
| **No Duplicates** | Standard BST doesn't allow duplicates | Each value is unique |

### 2. Insertion Position

Finding the correct leaf position for a new value:

```
Value to insert: 6

        8
       / \
      3   10
     / \
    1   5

Step 1: 6 < 8, go left
Step 2: 6 > 3, go right
Step 3: 6 > 5, but 5 has no right child
→ Insert 6 as right child of 5
```

### 3. Traversal Comparison

| Aspect | Recursive | Iterative |
|--------|-----------|-----------|
| **Code Style** | Elegant, mathematical | Explicit, step-by-step |
| **Space** | O(h) call stack | O(1) extra space |
| **Risk** | Stack overflow for skewed trees | No stack overflow risk |
| **Return Value** | Modified subtree root | Original root (unchanged) |

### 4. Duplicate Handling Strategies

| Strategy | Implementation | Use Case |
|----------|----------------|----------|
| **Ignore** | Skip if value exists | Standard sets |
| **Right Subtree** | Use `<=` for left | Allow duplicates |
| **Frequency Count** | Increment counter | Multi-set/bag |
| **Error** | Raise exception | Strict uniqueness |

---

## Frameworks

Structured approaches for BST insertion.

### Framework 1: Recursive Insertion Template

```
┌─────────────────────────────────────────────────────┐
│  BST RECURSIVE INSERTION FRAMEWORK                  │
├─────────────────────────────────────────────────────┤
│                                                     │
│  function insert(node, value):                      │
│      // Base case: found insertion position         │
│      if node is null:                               │
│          return new Node(value)                     │
│                                                     │
│      // Recursive case: navigate to position        │
│      if value < node.val:                           │
│          node.left = insert(node.left, value)       │
│      else if value > node.val:                      │
│          node.right = insert(node.right, value)     │
│      // else: value == node.val → do nothing        │
│                                                     │
│      return node                                    │
│                                                     │
│  Main:                                              │
│      root = insert(root, value)                     │
│                                                     │
│  Complexity: O(h) time, O(h) stack space           │
└─────────────────────────────────────────────────────┘
```

### Framework 2: Iterative Insertion Template

```
┌─────────────────────────────────────────────────────┐
│  BST ITERATIVE INSERTION FRAMEWORK                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  function insert(root, value):                        │
│      // Empty tree case                             │
│      if root is null:                               │
│          return new Node(value)                     │
│                                                     │
│      current = root                                 │
│                                                     │
│      while true:                                    │
│          if value < current.val:                    │
│              if current.left is null:               │
│                  current.left = new Node(value)     │
│                  break                              │
│              current = current.left                 │
│                                                     │
│          else if value > current.val:               │
│              if current.right is null:              │
│                  current.right = new Node(value)    │
│                  break                              │
│              current = current.right                │
│                                                     │
│          else:  // value == current.val             │
│              break  // Duplicate, do nothing          │
│                                                     │
│      return root                                    │
│                                                     │
│  Complexity: O(h) time, O(1) extra space           │
└─────────────────────────────────────────────────────┘
```

### Framework 3: Duplicate-Handling Insertion Template

```
┌─────────────────────────────────────────────────────┐
│  BST DUPLICATE-HANDLING FRAMEWORK                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Strategy: Store duplicates in right subtree          │
│  Modification: Use <= for left comparison           │
│                                                     │
│  function insert_with_duplicates(node, value):      │
│      if node is null:                               │
│          return new Node(value)                     │
│                                                     │
│      if value <= node.val:   // Changed: <=          │
│          node.left = insert_with_duplicates(        │
│              node.left, value)                      │
│      else:                                          │
│          node.right = insert_with_duplicates(       │
│              node.right, value)                     │
│                                                     │
│      return node                                    │
│                                                     │
│  Result: All duplicates stored in left subtree      │
└─────────────────────────────────────────────────────┘
```

---

## Forms

Different manifestations of the BST insertion pattern.

### Form 1: Standard BST (No Duplicates)

Most common form - each value appears at most once.

| Operation | Condition | Action |
|-----------|-----------|--------|
| **Insert** | value < node.val | Go left |
| **Insert** | value > node.val | Go right |
| **Insert** | value == node.val | Do nothing |
| **Search** | Same conditions | Return node or null |

### Form 2: BST with Duplicates

Allows multiple instances of same value.

| Strategy | Left Condition | Where Duplicates Go |
|----------|----------------|---------------------|
| **Left Bias** | value <= node.val | Left subtree |
| **Right Bias** | value < node.val | Right subtree |
| **Frequency Count** | value == node.val | Increment counter |

### Form 3: Balanced BST Building

Building balanced tree from sorted array (avoid skew).

```
Sorted Array: [1, 2, 3, 4, 5, 6, 7]

Approach 1: Sequential Insert (BAD - creates skew)
Insert 1, 2, 3, 4, 5, 6, 7 → Completely right-skewed

Approach 2: Middle-First (GOOD - creates balance)
       4
      / \
     2   6
    / \  / \
   1  3 5  7

Build from middle: O(n log n) → perfectly balanced
```

### Form 4: Self-Balancing BST (AVL/Red-Black)

Insertion with automatic rebalancing.

| Tree Type | Balance Factor | Rebalancing Operation |
|-----------|----------------|----------------------|
| **AVL** | -1, 0, or 1 | Rotations on violation |
| **Red-Black** | Black height | Color flips + rotations |
| **Treap** | Heap priority | Rotations by priority |

### Form 5: Threaded BST

Uses null pointers as threads for efficient traversal.

| Pointer | Standard | Threaded |
|---------|----------|----------|
| Left null | Always null | Points to inorder predecessor |
| Right null | Always null | Points to inorder successor |
| Insertion | Simple | Must update threads |

---

## Tactics

Specific techniques and optimizations for BST insertion.

### Tactic 1: Parent Pointer Tracking

Track parent for easier insertion and future operations:

```python
def insert_iterative(root: Optional[TreeNode], val: int) -> TreeNode:
    """Insert while tracking parent node."""
    if root is None:
        return TreeNode(val)
    
    current = root
    parent = None
    
    # Find position and track parent
    while current:
        parent = current
        if val < current.val:
            current = current.left
        elif val > current.val:
            current = current.right
        else:
            return root  # Duplicate, do nothing
    
    # Attach to parent
    if val < parent.val:
        parent.left = TreeNode(val)
    else:
        parent.right = TreeNode(val)
    
    return root
```

**Benefits:**
- Clear separation of search and attach phases
- Parent reference available for other operations
- Easier to extend for delete operations

### Tactic 2: Return Root Pattern

Always return root for consistent API:

```python
# Good: Works for empty and non-empty trees
def build_bst(values: List[int]) -> Optional[TreeNode]:
    root = None
    for val in values:
        root = insert_recursive(root, val)
    return root

# Root returned can be stored and reused
root = build_bst([5, 3, 7, 1, 4, 6, 8])
root = insert_recursive(root, 2)  # Works with existing tree
```

### Tactic 3: Duplicate Handling with Frequency

Track occurrences without storing multiple nodes:

```python
class TreeNodeWithCount:
    """Node that tracks frequency of values."""
    def __init__(self, val: int):
        self.val = val
        self.count = 1  # Frequency
        self.left: Optional[TreeNodeWithCount] = None
        self.right: Optional[TreeNodeWithCount] = None

def insert_with_count(root: Optional[TreeNodeWithCount], 
                       val: int) -> TreeNodeWithCount:
    """Insert with frequency counting for duplicates."""
    if root is None:
        return TreeNodeWithCount(val)
    
    if val < root.val:
        root.left = insert_with_count(root.left, val)
    elif val > root.val:
        root.right = insert_with_count(root.right, val)
    else:
        root.count += 1  # Increment frequency
    
    return root
```

### Tactic 4: Validation After Insertion

Verify BST property remains valid:

```python
def is_valid_bst(root: Optional[TreeNode], 
                   min_val: float = float('-inf'),
                   max_val: float = float('inf')) -> bool:
    """Validate BST property using range checking."""
    if root is None:
        return True
    
    if root.val <= min_val or root.val >= max_val:
        return False
    
    return (is_valid_bst(root.left, min_val, root.val) and
            is_valid_bst(root.right, root.val, max_val))

# Usage after insertion
def insert_and_validate(root, val):
    root = insert_recursive(root, val)
    assert is_valid_bst(root), "BST property violated!"
    return root
```

### Tactic 5: Bulk Insertion Optimization

Sort first, then build balanced tree:

```python
def sorted_array_to_bst(values: List[int], 
                        left: int, 
                        right: int) -> Optional[TreeNode]:
    """Build balanced BST from sorted array."""
    if left > right:
        return None
    
    mid = (left + right) // 2
    node = TreeNode(values[mid])
    node.left = sorted_array_to_bst(values, left, mid - 1)
    node.right = sorted_array_to_bst(values, mid + 1, right)
    return node

def build_balanced_bst(values: List[int]) -> Optional[TreeNode]:
    """Build balanced BST from unsorted values."""
    sorted_values = sorted(values)
    return sorted_array_to_bst(sorted_values, 0, len(sorted_values) - 1)

# Complexity: O(n log n) for sort + O(n) for build = O(n log n)
# Result: Perfectly balanced tree vs skewed from sequential insert
```

---

## Python Templates

### Template 1: Recursive BST Insertion

```python
from typing import Optional

class TreeNode:
    """Node class for Binary Search Tree."""
    def __init__(self, val: int):
        self.val = val
        self.left: Optional[TreeNode] = None
        self.right: Optional[TreeNode] = None


def insert_recursive(root: Optional[TreeNode], 
                     val: int) -> TreeNode:
    """
    Insert a value into BST recursively.
    
    Args:
        root: Root of the BST (can be None for empty tree)
        val: Value to insert
    
    Returns:
        Root of the modified BST
    
    Time: O(h) where h is height
    Space: O(h) for recursion stack
    """
    # Base case: found the position
    if root is None:
        return TreeNode(val)
    
    # Recursively find the correct position
    if val < root.val:
        root.left = insert_recursive(root.left, val)
    elif val > root.val:
        root.right = insert_recursive(root.right, val)
    # If val == root.val, do nothing (no duplicates)
    
    return root
```

### Template 2: Iterative BST Insertion

```python
def insert_iterative(root: Optional[TreeNode], 
                     val: int) -> TreeNode:
    """
    Insert a value into BST iteratively.
    
    Args:
        root: Root of the BST (can be None for empty tree)
        val: Value to insert
    
    Returns:
        Root of the modified BST
    
    Time: O(h) where h is height
    Space: O(1)
    """
    # If tree is empty, create root
    if root is None:
        return TreeNode(val)
    
    # Traverse to find the correct position
    current = root
    while True:
        if val < current.val:
            if current.left is None:
                current.left = TreeNode(val)
                break
            current = current.left
        elif val > current.val:
            if current.right is None:
                current.right = TreeNode(val)
                break
            current = current.right
        else:
            # Duplicate value - do nothing
            break
    
    return root
```

### Template 3: BST with Duplicate Handling

```python
class BSTWithDuplicates:
    """BST that stores duplicate values in right subtree."""
    
    def insert(self, root: Optional[TreeNode], 
               val: int) -> TreeNode:
        """Insert allowing duplicates in right subtree."""
        if root is None:
            return TreeNode(val)
        
        if val <= root.val:  # <= for left subtree
            root.left = self.insert(root.left, val)
        else:
            root.right = self.insert(root.right, val)
        
        return root
```

### Template 4: BST with Frequency Count

```python
class TreeNodeWithCount:
    """Node that tracks frequency of values."""
    def __init__(self, val: int):
        self.val = val
        self.count = 1
        self.left: Optional['TreeNodeWithCount'] = None
        self.right: Optional['TreeNodeWithCount'] = None


class BSTMWithFrequency:
    """BST with frequency counting for duplicates."""
    
    def insert(self, root: Optional[TreeNodeWithCount], 
               val: int) -> TreeNodeWithCount:
        """Insert with frequency counting."""
        if root is None:
            return TreeNodeWithCount(val)
        
        if val < root.val:
            root.left = self.insert(root.left, val)
        elif val > root.val:
            root.right = self.insert(root.right, val)
        else:
            root.count += 1  # Increment frequency
        
        return root
    
    def count(self, root: Optional[TreeNodeWithCount], 
              val: int) -> int:
        """Get frequency of a value."""
        if root is None:
            return 0
        
        if val < root.val:
            return self.count(root.left, val)
        elif val > root.val:
            return self.count(root.right, val)
        else:
            return root.count
```

### Template 5: Complete BST Builder (Balanced)

```python
def sorted_array_to_bst(values: List[int], 
                        left: int, 
                        right: int) -> Optional[TreeNode]:
    """
    Build balanced BST from sorted array segment.
    
    Time: O(n)
    Space: O(log n) for recursion
    """
    if left > right:
        return None
    
    mid = (left + right) // 2
    node = TreeNode(values[mid])
    node.left = sorted_array_to_bst(values, left, mid - 1)
    node.right = sorted_array_to_bst(values, mid + 1, right)
    return node


def build_balanced_bst(values: List[int]) -> Optional[TreeNode]:
    """
    Build balanced BST from any array.
    Sorts first, then builds balanced.
    
    Time: O(n log n) - dominated by sorting
    Space: O(n)
    """
    if not values:
        return None
    
    sorted_values = sorted(values)
    return sorted_array_to_bst(sorted_values, 0, len(sorted_values) - 1)


def build_bst_sequential(values: List[int]) -> Optional[TreeNode]:
    """
    Build BST by sequential insertion.
    May create unbalanced tree.
    
    Time: O(n²) worst case (sorted input)
    Space: O(n)
    """
    root = None
    for val in values:
        root = insert_iterative(root, val)
    return root
```

---

## When to Use

Use BST Insert when you need to solve problems involving:

- **Dynamic Set Operations**: Building a sorted collection with efficient insertion
- **Tree Construction**: Creating a BST from a sequence of values
- **Order Statistics**: Maintaining elements in sorted order for rank queries
- **Duplicate Handling**: Managing frequency counts in a sorted structure
- **Self-Balancing Trees**: As a building block for AVL, Red-Black trees

### Comparison with Alternatives

| Data Structure | Insert Time | Search Time | Space | Supports Duplicates | Balanced Guarantee |
|----------------|-------------|-------------|-------|---------------------|-------------------|
| **BST (Basic)** | O(h) avg | O(h) avg | O(n) | ✅ Yes | ❌ No |
| **AVL Tree** | O(log n) | O(log n) | O(n) | ✅ Yes | ✅ Yes |
| **Red-Black Tree** | O(log n) | O(log n) | O(n) | ✅ Yes | ✅ Yes |
| **Hash Table** | O(1) avg | O(1) avg | O(n) | ✅ Yes | N/A |
| **Sorted Array** | O(n) | O(log n) | O(n) | ✅ Yes | N/A |

### When to Choose BST Insert vs Other Structures

- **Choose BST Insert** when:
  - You need in-order traversal for sorted output
  - The data has some randomness (natural balance)
  - You need both insertions and range queries
  - Implementing more complex tree algorithms

- **Choose Hash Table** when:
  - You only need existence checks, not ordering
  - O(1) lookup is critical
  - No need for range queries or sorted iteration

- **Choose Self-Balancing Tree** when:
  - Input may be sorted (causing skew)
  - Worst-case guarantees are important
  - Consistent O(log n) performance needed

---

## Algorithm Explanation

### Core Concept

The fundamental principle of BST insertion is the **Binary Search Property**: for any node with value `v`, all nodes in its left subtree have values `< v`, and all nodes in its right subtree have values `> v`. This property enables efficient O(h) insertion by using the value comparison to guide the search for the insertion position.

### How It Works

#### Insertion Strategy:
1. **Search Phase**: Traverse from root, comparing the new value with each node
2. **Decision Rule**: Go left if smaller, right if larger
3. **Termination**: Stop at the first `null` position (leaf's child)
4. **Attachment**: Create new node and attach as left/right child

#### Recursive vs Iterative:

**Recursive Approach:**
- Elegant, mirrors the mathematical definition
- Stack depth equals tree height: O(h) space
- Natural return of modified subtree root

**Iterative Approach:**
- Explicit stack management with pointers
- Constant extra space: O(1) space
- Better for very deep trees (avoids stack overflow)

### Visual Representation

Inserting value `6` into the following BST:

```
    8
   / \
  3   10
 / \
1   5
```

**Step-by-step insertion of 6:**
1. Start at root (8): 6 < 8, go left
2. At node (3): 6 > 3, go right
3. At node (5): 6 > 5, but 5 has no right child
4. Create new node with value 6
5. Attach as right child of 5

**Result:**
```
    8
   / \
  3   10
 / \
1   5
     \
      6
```

### Time Complexity Variations

| Tree Shape | Height (h) | Insert Time | Example Input |
|------------|------------|-------------|---------------|
| **Balanced** | log₂(n) | O(log n) | Random insertion order |
| **Skewed (Left)** | n | O(n) | Sorted descending input |
| **Skewed (Right)** | n | O(n) | Sorted ascending input |
| **Degenerate** | n | O(n) | Single-child nodes only |

### Why It Works

- **Binary search property**: Guarantees correct position for any value
- **Leaf insertion**: New nodes are always leaves, preserving existing structure
- **Deterministic**: Same sequence of insertions produces same tree
- **No rebalancing needed**: Simple version accepts any tree shape

### Limitations

- **No balance guarantee**: Can become skewed, degrading to O(n) operations
- **Duplicate handling**: Must explicitly decide policy
- **No backtracking**: Once inserted, position is fixed (unless rebalancing)
- **Sequential insertion risk**: Sorted input creates worst-case skew

---

## Practice Problems

### Problem 1: Insert into a Binary Search Tree

**Problem:** [LeetCode 701 - Insert into a Binary Search Tree](https://leetcode.com/problems/insert-into-a-binary-search-tree/)

**Description:** You are given the root node of a BST and a value to insert. Return the root node of the BST after the insertion.

**How to Apply:**
- Implement standard BST insertion (recursive or iterative)
- Handle empty tree case
- Maintain BST property throughout

---

### Problem 2: Search in a Binary Search Tree

**Problem:** [LeetCode 700 - Search in a Binary Search Tree](https://leetcode.com/problems/search-in-a-binary-search-tree/)

**Description:** Given the root of BST and a value, find the node with that value and return the subtree rooted with that node.

**How to Apply:**
- BST search follows same logic as insert
- Understanding the BST property for navigation
- Return subtree or null if not found

---

### Problem 3: Delete Node in a BST

**Problem:** [LeetCode 450 - Delete Node in a BST](https://leetcode.com/problems/delete-node-in-a-bst/)

**Description:** Given a root node and a key, delete the node with the given key and return the new root.

**How to Apply:**
- Natural extension of insertion
- Three cases: leaf, one child, two children
- Finding inorder successor/predecessor for replacement

---

### Problem 4: Validate Binary Search Tree

**Problem:** [LeetCode 98 - Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/)

**Description:** Determine if a given binary tree is a valid BST.

**How to Apply:**
- Understanding BST invariants
- Range-based validation
- Inorder traversal verification

---

### Problem 5: Kth Smallest Element in a BST

**Problem:** [LeetCode 230 - Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/)

**Description:** Given the root of a BST and an integer k, return the kth smallest value.

**How to Apply:**
- Inorder traversal gives sorted order
- Augmenting nodes with subtree sizes for O(log n)
- Order statistics on BSTs

---

## Video Tutorial Links

### Fundamentals

- [Binary Search Tree - Insertion (WilliamFiset)](https://www.youtube.com/watch?v=COZK7NATh4k) - Comprehensive BST insertion explanation
- [BST Insertion Algorithm (Abdul Bari)](https://www.youtube.com/watch?v=K5pX9L1d8y8) - Step-by-step visualization
- [Binary Search Tree in 5 Minutes (NeetCode)](https://www.youtube.com/watch?v=UvLqWJP2L10) - Quick overview of BST operations

### Advanced Topics

- [Self-Balancing BST (AVL Tree Insertion)](https://www.youtube.com/watch?v=vRwi_UcZGjU) - How to maintain balance
- [Red-Black Tree Insertion](https://www.youtube.com/watch?v=qvZGUFHWChY) - Advanced balanced tree insertion
- [Randomized BST](https://www.youtube.com/watch?v=2x4LR8YsZJw) - Probabilistic balancing approach

---

## Follow-up Questions

### Q1: Why does BST insertion use O(h) time instead of O(log n)?

**Answer:** The time complexity depends on tree height h, not log n:
- **Balanced tree**: h = log₂(n), so time is O(log n)
- **Skewed tree**: h = n, so time is O(n)
- Basic BST doesn't guarantee balance
- Self-balancing trees (AVL, Red-Black) ensure h = O(log n)

### Q2: How do you handle duplicate values in BST insertion?

**Answer:** Three common strategies:
1. **Ignore**: Don't insert duplicates (standard approach)
2. **Count**: Store frequency count in node, increment on duplicate
3. **Right subtree**: Insert duplicates in right subtree (use `<=` for left comparison)

### Q3: What's the difference between recursive and iterative insertion?

**Answer:**
- **Recursive**: Cleaner code, mirrors mathematical definition, O(h) stack space
- **Iterative**: More efficient, O(1) extra space, avoids stack overflow for deep trees
- Both have same time complexity O(h)
- Iterative is preferred for production code with large trees

### Q4: Can we insert into a BST in O(1) time?

**Answer:** No, you cannot insert in O(1) time while maintaining BST properties:
- Must find correct position to maintain ordering
- Requires traversing from root to leaf
- Hash tables can insert in O(1) but lose ordering
- Consider using hash table if only need existence checks

### Q5: How do you build a balanced BST from a sorted array?

**Answer:** Instead of sequential insertion (O(n²) worst case):
1. **Sort the array**: O(n log n)
2. **Pick middle element** as root
3. **Recursively** build left subtree from left half
4. **Recursively** build right subtree from right half
5. **Total time**: O(n log n), results in perfectly balanced tree

---

## Summary

BST Insertion is a fundamental tree operation that maintains the binary search property while adding new elements. Key takeaways:

- **O(h) time complexity**: Fast for balanced trees, slow for skewed trees
- **Two approaches**: Recursive (elegant) vs Iterative (space-efficient)
- **Duplicate handling**: Multiple strategies based on requirements
- **Foundation for advanced trees**: AVL, Red-Black trees build upon basic insertion
- **Trade-offs**: Simple implementation vs guaranteed performance

When to use:
- ✅ Need dynamic sorted data structure
- ✅ Frequent insertions with occasional searches
- ✅ Building block for more complex algorithms
- ⚠️ Input may be sorted (consider self-balancing variant)
- ❌ Only need existence checks (use hash table instead)

Mastering BST insertion is essential for understanding tree-based data structures and forms the basis for more advanced algorithms in computer science.
