# Treap (Randomized BST)

## Category
Data Structures - Trees

## Description

A Treap is a binary search tree that maintains heap properties using random priorities. Each node has a key (following BST property) and a random priority (following heap property). This randomized approach achieves expected O(log n) time for all operations without complex rebalancing procedures.

The name "Treap" combines "Tree" and "Heap", reflecting its dual nature. By assigning random priorities to nodes, the tree structure remains balanced with high probability, providing the performance of balanced BSTs (like AVL or Red-Black trees) with significantly simpler implementation.

---

## Concepts

Treaps rely on fundamental properties of binary search trees and heaps.

### 1. Dual Properties

| Property | Condition | Purpose |
|----------|-----------|---------|
| **BST Property** | Left.key < Parent.key < Right.key | Enable searching |
| **Heap Property** | Parent.priority > Child.priority | Maintain balance |

### 2. Operations

| Operation | Expected Time | Description |
|-----------|---------------|-------------|
| **Insert** | O(log n) | Add node, rotate to maintain heap |
| **Delete** | O(log n) | Rotate down, then remove |
| **Search** | O(log n) | Standard BST search |
| **Split** | O(log n) | Divide by key |
| **Merge** | O(log n) | Combine two treaps |

### 3. Rotations

| Rotation | When Used | Effect |
|----------|-----------|--------|
| **Right Rotate** | Left child has higher priority | Bring left child up |
| **Left Rotate** | Right child has higher priority | Bring right child up |

### 4. Implicit Treap

| Aspect | Description |
|--------|-------------|
| **Key** | Index (position) in array |
| **Use** | Array operations (split, merge, reverse) |
| **Size tracking** | Maintain subtree sizes for index lookup |

---

## Frameworks

Structured approaches for treap implementation.

### Framework 1: Standard Treap Insert

```
┌─────────────────────────────────────────────────────────────┐
│  TREAP INSERTION                                             │
├─────────────────────────────────────────────────────────────┤
│  1. Create new node with key and random priority            │
│  2. Perform standard BST insertion                           │
│  3. While node violates heap property (parent priority <):  │
│     a. If node is left child: rotate_right(parent)          │
│     b. If node is right child: rotate_left(parent)          │
│  4. Continue rotations until heap property satisfied        │
│                                                              │
│  Effect: New node bubbles up based on priority              │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard treap insertion.

### Framework 2: Treap Delete

```
┌─────────────────────────────────────────────────────────────┐
│  TREAP DELETION                                              │
├─────────────────────────────────────────────────────────────┤
│  1. Find node with given key (BST search)                   │
│  2. While node has children:                                 │
│     a. If left.priority > right.priority:                   │
│        - rotate_right(node)                                  │
│        - node becomes right child                          │
│     b. Else:                                                 │
│        - rotate_left(node)                                   │
│        - node becomes left child                           │
│  3. Node is now leaf, remove it                              │
│                                                              │
│  Effect: Node sinks down based on priorities, then removed │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Removing nodes from treap.

### Framework 3: Split and Merge

```
┌─────────────────────────────────────────────────────────────┐
│  TREAP SPLIT AND MERGE                                       │
├─────────────────────────────────────────────────────────────┤
│  Split(root, key):                                          │
│    Returns (L, R) where L contains keys < key,            │
│    R contains keys >= key                                   │
│                                                              │
│    1. If root is None: return (None, None)                  │
│    2. If key <= root.key:                                   │
│       - (L, R') = Split(root.left, key)                     │
│       - root.left = R'                                       │
│       - return (L, root)                                      │
│    3. Else:                                                  │
│       - (L', R) = Split(root.right, key)                   │
│       - root.right = L'                                      │
│       - return (root, R)                                    │
│                                                              │
│  Merge(L, R):  (assumes all keys in L < all keys in R)     │
│    1. If not L or not R: return the other                   │
│    2. If L.priority > R.priority:                          │
│       - L.right = Merge(L.right, R)                       │
│       - return L                                            │
│    3. Else:                                                  │
│       - R.left = Merge(L, R.left)                          │
│       - return R                                            │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Advanced treap operations, implicit treaps.

---

## Forms

Different manifestations of treaps.

### Form 1: Standard Treap

BST with random heap priorities.

| Aspect | Details |
|--------|---------|
| **Key** | User-defined ordering |
| **Priority** | Random value |
| **Operations** | Insert, delete, search |
| **Balance** | Expected O(log n) |

### Form 2: Implicit Treap

Array-like operations via split/merge.

| Aspect | Details |
|--------|---------|
| **Key** | Implicit (position/index) |
| **Operations** | Split by size, merge, reverse range |
| **Use case** | Rope data structure, array manipulation |
| **Extension** | Lazy propagation for range updates |

### Form 3: Cartesian Tree

Treap built from static array.

| Aspect | Details |
|--------|---------|
| **Construction** | O(n) from array |
| **Property** | Heap by value, in-order is array order |
| **Use case** | Range minimum query (RMQ) |

### Form 4: Randomized BST without explicit priorities

| Aspect | Details |
|--------|---------|
| **Mechanism** | Randomized decisions during insertion |
| **Priority** | Implicit from random decisions |
| **Simplicity** | Even simpler than treap |

---

## Tactics

Specific techniques for treap implementation.

### Tactic 1: Basic Treap Node

Node structure and rotations:

```python
import random

class TreapNode:
    def __init__(self, key, value=None):
        self.key = key
        self.value = value
        self.priority = random.random()
        self.left = None
        self.right = None
        self.size = 1  # For implicit treap

def get_size(node):
    return node.size if node else 0

def update_size(node):
    if node:
        node.size = 1 + get_size(node.left) + get_size(node.right)

def rotate_right(y):
    """Rotate right at y."""
    x = y.left
    y.left = x.right
    x.right = y
    update_size(y)
    update_size(x)
    return x

def rotate_left(x):
    """Rotate left at x."""
    y = x.right
    x.right = y.left
    y.left = x
    update_size(x)
    update_size(y)
    return y
```

### Tactic 2: Insert Operation

BST insert with heap fix:

```python
def insert(root, key, value=None):
    """Insert key into treap."""
    if root is None:
        return TreapNode(key, value)
    
    if key < root.key:
        root.left = insert(root.left, key, value)
        if root.left.priority > root.priority:
            root = rotate_right(root)
    elif key > root.key:
        root.right = insert(root.right, key, value)
        if root.right.priority > root.priority:
            root = rotate_left(root)
    else:
        root.value = value  # Update
    
    update_size(root)
    return root
```

### Tactic 3: Delete Operation

Rotate down and remove:

```python
def erase(root, key):
    """Remove key from treap."""
    if root is None:
        return None
    
    if key < root.key:
        root.left = erase(root.left, key)
    elif key > root.key:
        root.right = erase(root.right, key)
    else:
        # Found node to delete
        if root.left is None:
            return root.right
        elif root.right is None:
            return root.left
        elif root.left.priority > root.right.priority:
            root = rotate_right(root)
            root.right = erase(root.right, key)
        else:
            root = rotate_left(root)
            root.left = erase(root.left, key)
    
    update_size(root)
    return root
```

### Tactic 4: Split and Merge

Core operations for advanced usage:

```python
def split(root, key):
    """Split treap into (< key) and (>= key)."""
    if root is None:
        return (None, None)
    
    if key <= root.key:
        left, right = split(root.left, key)
        root.left = right
        update_size(root)
        return (left, root)
    else:
        left, right = split(root.right, key)
        root.right = left
        update_size(root)
        return (root, right)

def merge(left, right):
    """Merge two treaps where all keys in left < all keys in right."""
    if left is None:
        return right
    if right is None:
        return left
    
    if left.priority > right.priority:
        left.right = merge(left.right, right)
        update_size(left)
        return left
    else:
        right.left = merge(left, right.left)
        update_size(right)
        return right
```

### Tactic 5: Order Statistics

K-th smallest element:

```python
def kth_smallest(root, k):
    """Find k-th smallest element (1-indexed)."""
    if root is None:
        return None
    
    left_size = get_size(root.left)
    if k <= left_size:
        return kth_smallest(root.left, k)
    elif k == left_size + 1:
        return root
    else:
        return kth_smallest(root.right, k - left_size - 1)

def rank_of(root, key):
    """Count elements < key."""
    if root is None:
        return 0
    if key <= root.key:
        return rank_of(root.left, key)
    return 1 + get_size(root.left) + rank_of(root.right, key)
```

---

## Python Templates

### Template 1: Treap Node with Size

```python
import random


class TreapNode:
    """Node in a treap (tree + heap)."""
    
    def __init__(self, key, value=None):
        self.key = key
        self.value = value
        self.priority = random.random()
        self.left = None
        self.right = None
        self.size = 1


def get_size(node):
    """Get size of subtree."""
    return node.size if node else 0


def update_size(node):
    """Update subtree size."""
    if node:
        node.size = 1 + get_size(node.left) + get_size(node.right)


def rotate_right(y):
    """Rotate right at y."""
    x = y.left
    y.left = x.right
    x.right = y
    update_size(y)
    update_size(x)
    return x


def rotate_left(x):
    """Rotate left at x."""
    y = x.right
    x.right = y.left
    y.left = x
    update_size(x)
    update_size(y)
    return y
```

### Template 2: Standard Treap Insert

```python
def treap_insert(root, key, value=None):
    """
    Insert key into treap.
    
    Time: O(log n) expected
    """
    if root is None:
        return TreapNode(key, value)
    
    if key < root.key:
        root.left = treap_insert(root.left, key, value)
        if root.left.priority > root.priority:
            root = rotate_right(root)
    elif key > root.key:
        root.right = treap_insert(root.right, key, value)
        if root.right.priority > root.priority:
            root = rotate_left(root)
    else:
        root.value = value  # Update existing
    
    update_size(root)
    return root
```

### Template 3: Treap Delete

```python
def treap_erase(root, key):
    """
    Delete key from treap.
    
    Time: O(log n) expected
    """
    if root is None:
        return None
    
    if key < root.key:
        root.left = treap_erase(root.left, key)
    elif key > root.key:
        root.right = treap_erase(root.right, key)
    else:
        # Found node to delete
        if root.left is None:
            return root.right
        elif root.right is None:
            return root.left
        elif root.left.priority > root.right.priority:
            root = rotate_right(root)
            root.right = treap_erase(root.right, key)
        else:
            root = rotate_left(root)
            root.left = treap_erase(root.left, key)
    
    update_size(root)
    return root
```

### Template 4: Split and Merge

```python
def treap_split(root, key):
    """
    Split treap into (< key) and (>= key).
    
    Time: O(log n) expected
    """
    if root is None:
        return (None, None)
    
    if key <= root.key:
        left, right = treap_split(root.left, key)
        root.left = right
        update_size(root)
        return (left, root)
    else:
        left, right = treap_split(root.right, key)
        root.right = left
        update_size(root)
        return (root, right)


def treap_merge(left, right):
    """
    Merge two treaps where all keys in left < all keys in right.
    
    Time: O(log n) expected
    """
    if left is None:
        return right
    if right is None:
        return left
    
    if left.priority > right.priority:
        left.right = treap_merge(left.right, right)
        update_size(left)
        return left
    else:
        right.left = treap_merge(left, right.left)
        update_size(right)
        return right
```

### Template 5: Order Statistics

```python
def kth_smallest(root, k):
    """
    Find k-th smallest element (1-indexed).
    
    Time: O(log n) expected
    """
    if root is None:
        return None
    
    left_size = get_size(root.left)
    if k <= left_size:
        return kth_smallest(root.left, k)
    elif k == left_size + 1:
        return root
    else:
        return kth_smallest(root.right, k - left_size - 1)


def treap_rank(root, key):
    """
    Count number of elements < key.
    
    Time: O(log n) expected
    """
    if root is None:
        return 0
    if key <= root.key:
        return treap_rank(root.left, key)
    return 1 + get_size(root.left) + treap_rank(root.right, key)
```

---

## When to Use

Use a Treap when you need:

- **Balanced BST operations** without complex rebalancing code
- **Split/Merge operations** for sequence manipulation
- **Implicit treap** for array operations with O(log n) splits
- **Order statistics** (k-th smallest, rank queries)
- **Simpler implementation** than AVL/Red-Black trees

### Comparison with Balanced BSTs

| Data Structure | Implementation | Operations | Use Case |
|----------------|----------------|------------|----------|
| **Treap** | Simple | All BST + split/merge | General purpose, split/merge needed |
| **AVL Tree** | Moderate | Strict balance | When worst-case guarantee needed |
| **Red-Black Tree** | Complex | Good constants | Standard library implementations |
| **Splay Tree** | Simple | Amortized | Frequently accessed elements |

### When to Choose Treap

- **Choose Treap** when:
  - Want simple balanced BST implementation
  - Need split/merge operations
  - Average-case O(log n) is sufficient
  - Implementing implicit treap for sequences

- **Choose Other BST** when:
  - Worst-case O(log n) guarantee required
  - Standard library available (usually RB-tree)
  - Memory is extremely constrained

---

## Algorithm Explanation

### Core Concept

A treap combines the properties of a binary search tree (ordered keys) and a heap (priorities). By maintaining BST property on keys and heap property on random priorities, we get a balanced tree structure naturally without explicit balancing rules.

### Why It Works

Random priorities ensure:
1. High-priority nodes are near root
2. Expected tree height is O(log n)
3. No single input can force worst-case behavior (unlike unbalanced BST)

### Rotations Explained

**Right Rotation**:
```
Before:     y              After:      x
           / \                        / \
          x   C                      A   y
         / \                            / \
        A   B                          B   C
```

Used when left child has higher priority than parent.

### Visual Walkthrough

**Insertion Example**:
```
Insert key=5, priority=0.9 (high)

Step 1: BST insert at appropriate position
        3(0.3)
           \
            5(0.9)  <- new node

Step 2: Priority 0.9 > 0.3, violates heap
        Rotate left at 3

Result: 5(0.9)
         /
        3(0.3)

New high-priority node bubbles up to root
```

---

## Practice Problems

### Problem 1: Insert Delete GetRandom O(1)

**Problem:** [LeetCode 380 - Insert Delete GetRandom O(1)](https://leetcode.com/problems/insert-delete-getrandom-o1/)

**Description:** Implement data structure with O(1) insert, delete, and getRandom.

**How to Apply:**
- Hash map + array is standard solution
- Treap can provide alternative with order statistics

---

### Problem 2: K-th Largest Element in a Stream

**Problem:** [LeetCode 703 - Kth Largest Element in a Stream](https://leetcode.com/problems/kth-largest-element-in-a-stream/)

**Description:** Design class to find kth largest element in a stream.

**How to Apply:**
- Treap with size tracking for order statistics
- kth_smallest operation
- Or use heap approach

---

## Video Tutorial Links

### Fundamentals

- Search for "Treap Data Structure" for introduction videos
- Search for "Randomized BST" for theory and analysis
- Search for "Implicit Treap CP-algorithms" for array operations tutorials

### Implementations

- Search for "Treap implementation Python" for code walkthroughs
- Search for "Treap vs AVL vs Red-Black Tree" for data structure comparisons

---

## Follow-up Questions

### Q1: Why does random priority give balanced tree?

**Answer**: With random priorities, the expected height is O(log n) by the same analysis as quicksort's expected behavior. The root is the highest priority element (random), and recursively, subtrees are balanced in expectation.

### Q2: Can treap handle duplicate keys?

**Answer**: Yes, either by storing count at node or using a convention (e.g., left subtree ≤ key, right > key). The implementation can be modified to handle duplicates as needed.

### Q3: What's an implicit treap?

**Answer**: An implicit treap uses index as key (maintained via subtree sizes instead of explicit keys). It allows array-like operations: split by position, merge, reverse range - all in O(log n).

### Q4: How does treap compare to skip list?

**Answer**: Both provide expected O(log n) operations with randomization. Treaps use tree structure with rotations, skip lists use multiple linked list levels. Treaps offer easier split/merge, skip lists offer simpler insertion/deletion.

### Q5: When should I use treap over built-in tree structures?

**Answer**: Use treap when:
- You need split/merge operations (not in standard libraries)
- Implementing custom order statistics
- Educational purposes
- Implicit treap for array operations

Standard library trees (C++ std::map, Java TreeMap) are optimized and preferred for basic BST operations.

---

## Summary

The Treap is an elegant randomized data structure that provides balanced BST performance with simple implementation. By combining heap and BST properties through random priorities, it achieves expected O(log n) operations without complex rebalancing code.

**Key Takeaways:**

1. **Randomized Priority**: Ensures balance in expectation
2. **Heap Property**: Higher priority at root
3. **Split/Merge**: Flexible operations for sequence manipulation
4. **Implicit Treap**: Use size instead of key for array operations
5. **Simplicity**: Much simpler than deterministic balanced BSTs

**When to Use:**
- Need balanced BST with simple implementation
- Require split/merge operations
- Building order statistic trees
- Implicit treap for array manipulation

The treap demonstrates the power of randomization in data structure design, providing an excellent balance of simplicity and performance.
