# DFS Inorder Traversal

## Category
Trees & BSTs

## Description

DFS Inorder Traversal is a **depth-first tree traversal** algorithm that visits nodes in **Left-Root-Right** order. For Binary Search Trees (BST), this traversal produces nodes in **sorted (ascending) order**, making it an essential tool for tree-based problems. The algorithm systematically explores the leftmost branch first, processes the current node, and then explores the right branch.

This traversal pattern is particularly valuable for retrieving sorted data from BSTs in O(n) time, converting between different tree representations, solving problems requiring sequential access to tree elements, and validating BST properties.

---

## Concepts

The DFS Inorder Traversal is built on several fundamental concepts that make it powerful for solving tree problems.

### 1. Traversal Order

The fundamental principle is the **Left-Root-Right** processing order:

1. **Left Subtree**: Recursively traverse the entire left subtree first
2. **Root**: Process the current node
3. **Right Subtree**: Recursively traverse the entire right subtree

This ordering ensures that for any node, all values in its left subtree (which are smaller in a BST) are processed before the node itself, and all values in its right subtree (larger in a BST) are processed after.

### 2. Tree Properties

| Property | Description | Implication |
|----------|-------------|-------------|
| **BST Sorted Order** | Left < Root < Right | Inorder produces ascending sorted sequence |
| **Complete Traversal** | Every node visited exactly once | O(n) time complexity guaranteed |
| **Stack Usage** | Implicit (recursion) or explicit (iteration) | Memory usage depends on tree height |

### 3. State Tracking

Different implementations track traversal progress differently:

| Implementation | State Tracking | Space Overhead |
|----------------|----------------|----------------|
| **Recursive** | Call stack | O(h) where h = tree height |
| **Iterative (Stack)** | Explicit stack | O(h) |
| **Morris** | Temporary tree modification | O(1) |
| **Parent Pointer** | Upward traversal capability | O(1) |

### 4. Node Relationships

Understanding the relationships between nodes helps with traversal:

- **Inorder Predecessor**: Rightmost node in left subtree
- **Inorder Successor**: Leftmost node in right subtree
- **Thread**: Temporary link from predecessor to current node (Morris traversal)

---

## Frameworks

Structured approaches for solving inorder traversal problems.

### Framework 1: Recursive Traversal Template

```
┌─────────────────────────────────────────────────────┐
│  RECURSIVE INORDER TRAVERSAL FRAMEWORK              │
├─────────────────────────────────────────────────────┤
│  1. Define recursive function with node parameter   │
│  2. Base case: if node is null, return              │
│  3. Recursively traverse left subtree               │
│  4. Process current node (add to result, etc.)      │
│  5. Recursively traverse right subtree              │
│  6. Return result                                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: Clean, readable code when recursion depth is manageable.

### Framework 2: Iterative Traversal Template

```
┌─────────────────────────────────────────────────────┐
│  ITERATIVE INORDER TRAVERSAL FRAMEWORK              │
├─────────────────────────────────────────────────────┤
│  1. Initialize empty stack, current = root          │
│  2. While current is not null OR stack not empty:   │
│     a. While current is not null:                   │
│        - Push current to stack                      │
│        - Move current to left child                 │
│     b. Pop from stack, process node                 │
│     c. Move current to right child                  │
│  3. Return result                                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: Avoiding recursion limit, explicit control over stack.

### Framework 3: Morris Traversal Template

```
┌─────────────────────────────────────────────────────┐
│  MORRIS INORDER TRAVERSAL FRAMEWORK (O(1) Space)    │
├─────────────────────────────────────────────────────┤
│  1. Initialize current = root                       │
│  2. While current is not null:                      │
│     a. If no left child:                            │
│        - Process current                            │
│        - Go to right                                │
│     b. If left child exists:                        │
│        - Find inorder predecessor                   │
│        - If no thread: create thread, go left       │
│        - If thread exists: remove thread, process,    │
│          go right                                   │
│  3. Return result                                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: Memory-constrained environments, very large trees.

---

## Forms

Different manifestations of the inorder traversal pattern.

### Form 1: Standard Inorder Traversal

Basic traversal returning all node values in order.

| Aspect | Description |
|--------|-------------|
| **Input** | Root of binary tree |
| **Output** | List of values in inorder sequence |
| **Use Case** | General tree traversal, sorted output from BST |

### Form 2: BST Validation

Inorder traversal to validate BST property.

| Aspect | Description |
|--------|-------------|
| **Key Insight** | Inorder of valid BST must be strictly increasing |
| **Optimization** | Track previous value, no need to store all values |
| **Time** | O(n) - stop early if violation found |

### Form 3: Kth Smallest/Largest Element

Finding order statistics in BST.

| Aspect | Description |
|--------|-------------|
| **Key Insight** | Inorder gives sorted order, kth element is at position k |
| **Optimization** | Stop traversal after k nodes, don't process entire tree |
| **Time** | O(k) average, O(n) worst case |

### Form 4: Tree Iterator

Controlled inorder traversal for BST iterator.

| Aspect | Description |
|--------|-------------|
| **Key Insight** | Use stack to simulate recursion, lazy loading |
| **Operations** | hasNext(): O(1), next(): Amortized O(1) |
| **Space** | O(h) for stack |

### Form 5: Expression Tree Evaluation

Converting infix expressions to postfix/prefix.

| Aspect | Description |
|--------|-------------|
| **Key Insight** | Inorder naturally represents infix notation |
| **Output** | Postfix for evaluation, prefix for prefix notation |
| **Use Case** | Expression parsing and evaluation |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Early Termination

Stop traversal early when goal is achieved:

```python
def kth_smallest(root: TreeNode, k: int) -> int:
    """Find kth smallest element using early termination."""
    result = None
    count = 0
    
    def traverse(node):
        nonlocal count, result
        if not node or result is not None:
            return
        
        traverse(node.left)
        
        count += 1
        if count == k:
            result = node.val
            return
        
        traverse(node.right)
    
    traverse(root)
    return result
```

### Tactic 2: Previous Value Tracking for BST Validation

Avoid storing all values by tracking only the previous value:

```python
def is_valid_bst(root: TreeNode) -> bool:
    """Validate BST using inorder with previous tracking."""
    prev_val = float('-inf')
    is_valid = True
    
    def traverse(node):
        nonlocal prev_val, is_valid
        if not node or not is_valid:
            return
        
        traverse(node.left)
        
        if node.val <= prev_val:
            is_valid = False
            return
        prev_val = node.val
        
        traverse(node.right)
    
    traverse(root)
    return is_valid
```

### Tactic 3: Stack with State Tracking

Alternative iterative approach using visited flags:

```python
def inorder_iterative_with_state(root: TreeNode) -> list[int]:
    """Inorder using stack with visited flags."""
    if not root:
        return []
    
    result = []
    stack = [(root, False)]
    
    while stack:
        node, visited = stack.pop()
        if visited:
            result.append(node.val)
        else:
            # Push in reverse order: right, node (visited), left
            if node.right:
                stack.append((node.right, False))
            stack.append((node, True))
            if node.left:
                stack.append((node.left, False))
    
    return result
```

### Tactic 4: Morris Traversal Thread Management

Creating and removing temporary threads:

```python
def morris_inorder(root: TreeNode) -> list[int]:
    """O(1) space inorder traversal."""
    result = []
    current = root
    
    while current:
        if not current.left:
            result.append(current.val)
            current = current.right
        else:
            # Find predecessor
            predecessor = current.left
            while predecessor.right and predecessor.right != current:
                predecessor = predecessor.right
            
            if not predecessor.right:
                # Create thread
                predecessor.right = current
                current = current.left
            else:
                # Remove thread and process
                predecessor.right = None
                result.append(current.val)
                current = current.right
    
    return result
```

### Tactic 5: Recovering Swapped BST Nodes

Using inorder to find and fix swapped nodes:

```python
def recover_tree(root: TreeNode) -> None:
    """Recover BST where two nodes were swapped."""
    first = second = prev = None
    
    def inorder(node):
        nonlocal first, second, prev
        if not node:
            return
        
        inorder(node.left)
        
        if prev and prev.val > node.val:
            if not first:
                first = prev
            second = node
        prev = node
        
        inorder(node.right)
    
    inorder(root)
    first.val, second.val = second.val, first.val
```

---

## Python Templates

### Template 1: Recursive Inorder Traversal

```python
from typing import List, Optional

class TreeNode:
    """Definition for a binary tree node."""
    def __init__(self, val: int = 0, left: Optional['TreeNode'] = None, 
                 right: Optional['TreeNode'] = None):
        self.val = val
        self.left = left
        self.right = right

def inorder_recursive(root: Optional[TreeNode]) -> List[int]:
    """
    DFS Inorder Traversal - Recursive Approach
    
    Time Complexity: O(n) - visit each node exactly once
    Space Complexity: O(h) - recursion stack, h = height of tree
    
    Args:
        root: Root of binary tree
        
    Returns:
        List of node values in inorder sequence
    """
    result = []
    
    def traverse(node: Optional[TreeNode]) -> None:
        if not node:
            return
        traverse(node.left)           # Visit left subtree
        result.append(node.val)       # Visit root
        traverse(node.right)          # Visit right subtree
    
    traverse(root)
    return result
```

### Template 2: Iterative Inorder Traversal

```python
from typing import List, Optional

def inorder_iterative(root: Optional[TreeNode]) -> List[int]:
    """
    DFS Inorder Traversal - Iterative using stack
    
    Time Complexity: O(n) - each node pushed and popped once
    Space Complexity: O(h) - explicit stack
    
    Args:
        root: Root of binary tree
        
    Returns:
        List of node values in inorder sequence
    """
    result = []
    stack = []
    current = root
    
    while current or stack:
        # Go to leftmost node
        while current:
            stack.append(current)
            current = current.left
        
        # Process current node
        current = stack.pop()
        result.append(current.val)
        
        # Move to right subtree
        current = current.right
    
    return result
```

### Template 3: Morris Inorder Traversal (O(1) Space)

```python
def inorder_morris(root: Optional[TreeNode]) -> List[int]:
    """
    Morris Inorder Traversal - O(1) Space
    
    Uses threaded binary tree concept to traverse without stack.
    Creates temporary links (threads) from predecessor to current.
    
    Time Complexity: O(n) - each edge traversed at most twice
    Space Complexity: O(1) - only uses pointers
    
    Args:
        root: Root of binary tree
        
    Returns:
        List of node values in inorder sequence
    """
    result = []
    current = root
    
    while current:
        if not current.left:
            # No left child, process and go right
            result.append(current.val)
            current = current.right
        else:
            # Find inorder predecessor (rightmost in left subtree)
            predecessor = current.left
            while predecessor.right and predecessor.right != current:
                predecessor = predecessor.right
            
            if not predecessor.right:
                # Create thread and move left
                predecessor.right = current
                current = current.left
            else:
                # Thread exists, remove it and process current
                predecessor.right = None
                result.append(current.val)
                current = current.right
    
    return result
```

### Template 4: BST Iterator

```python
class BSTIterator:
    """
    Binary Search Tree Iterator
    
    Implements iterator over inorder traversal.
    next() and hasNext() run in average O(1) time.
    Uses O(h) memory where h is tree height.
    """
    
    def __init__(self, root: Optional[TreeNode]):
        self.stack = []
        self._leftmost_inorder(root)
    
    def _leftmost_inorder(self, node: Optional[TreeNode]):
        """Push all left nodes onto stack."""
        while node:
            self.stack.append(node)
            node = node.left
    
    def next(self) -> int:
        """Return next smallest number."""
        topmost_node = self.stack.pop()
        # If node has right child, push its leftmost path
        if topmost_node.right:
            self._leftmost_inorder(topmost_node.right)
        return topmost_node.val
    
    def hasNext(self) -> bool:
        """Return whether we have a next smallest number."""
        return len(self.stack) > 0
```

### Template 5: Kth Smallest Element in BST

```python
def kth_smallest(root: TreeNode, k: int) -> int:
    """
    Find kth smallest element in BST using inorder traversal.
    
    Time: O(k) average, O(n) worst case
    Space: O(h)
    
    Args:
        root: Root of BST
        k: Position (1-indexed)
    
    Returns:
        kth smallest element value
    """
    stack = []
    current = root
    count = 0
    
    while current or stack:
        while current:
            stack.append(current)
            current = current.left
        
        current = stack.pop()
        count += 1
        
        if count == k:
            return current.val
        
        current = current.right
    
    return -1  # k is larger than tree size
```

### Template 6: Validate BST with Inorder

```python
def is_valid_bst(root: Optional[TreeNode]) -> bool:
    """
    Validate BST using inorder traversal.
    Inorder of valid BST must be strictly increasing.
    
    Time: O(n)
    Space: O(h)
    """
    if not root:
        return True
    
    stack = []
    current = root
    prev_val = float('-inf')
    
    while current or stack:
        while current:
            stack.append(current)
            current = current.left
        
        current = stack.pop()
        
        # Check BST property
        if current.val <= prev_val:
            return False
        prev_val = current.val
        
        current = current.right
    
    return True
```

### Template 7: Recover BST (Two Swapped Nodes)

```python
def recover_tree(root: Optional[TreeNode]) -> None:
    """
    Recover BST where exactly two nodes were swapped.
    
    Uses inorder to find violations in the sorted sequence.
    
    Time: O(n)
    Space: O(h)
    """
    first = second = prev = None
    
    def inorder(node):
        nonlocal first, second, prev
        if not node:
            return
        
        inorder(node.left)
        
        # Detect violation
        if prev and prev.val > node.val:
            if not first:
                first = prev
            second = node
        prev = node
        
        inorder(node.right)
    
    inorder(root)
    # Swap values back
    first.val, second.val = second.val, first.val
```

---

## When to Use

Use Inorder DFS when you need to solve problems involving:

- **Binary Search Tree operations**: Retrieving sorted elements, validating BST structure, finding kth smallest/largest element
- **Expression tree evaluation**: Converting infix expressions to postfix or prefix
- **Tree reconstruction problems**: Building trees from inorder + preorder/postorder traversals
- **Range queries on BSTs**: Finding elements within a specific value range
- **Tree serialization**: When order matters for reconstruction

### Comparison: DFS Traversal Orders

| Traversal | Order | Best For | BST Output |
|-----------|-------|----------|------------|
| **Inorder** | Left → Root → Right | Sorted output, BST validation | ✅ Sorted ascending |
| **Preorder** | Root → Left → Right | Tree cloning, serialization | ❌ Not sorted |
| **Postorder** | Left → Right → Root | Tree deletion, bottom-up processing | ❌ Not sorted |
| **Level Order** | By levels (BFS) | Finding shortest path, level-based problems | ❌ Not sorted |

### When to Choose Inorder vs Other Traversals

- **Choose Inorder** when:
  - You need sorted output from a BST
  - Validating BST properties
  - Finding kth smallest/largest element
  - Converting expressions between notations

- **Choose Preorder** when:
  - Cloning or serializing trees
  - Building trees from traversal data
  - Root needs to be processed before children

- **Choose Postorder** when:
  - Deleting trees (children before parent)
  - Calculating subtree properties
  - Bottom-up dynamic programming on trees

---

## Algorithm Explanation

### Core Concept

The fundamental principle of Inorder DFS is the **Left-Root-Right** processing order:

1. **Left Subtree**: Recursively traverse the entire left subtree first
2. **Root**: Process the current node
3. **Right Subtree**: Recursively traverse the entire right subtree

This ordering ensures that for any node, all values in its left subtree (which are smaller in a BST) are processed before the node itself, and all values in its right subtree (larger in a BST) are processed after.

### How It Works

#### Traversal Flow:
1. Start at root, traverse left as far as possible
2. When left is exhausted, process current node
3. Then traverse the right subtree
4. Continue recursively until all nodes are processed

### Visual Representation

For a sample BST:

```
        4
       / \
      2   6
     / \/ \
    1   3 5  7
```

**Traversal Path Visualization:**

```
Step 1: Start at root (4), go left to (2)
        ↓
        4
       /
      2

Step 2: From (2), go left to (1)
        ↓
        4
       /
      2
     /
    1

Step 3: (1) has no left child, process (1)
        Output: [1]

Step 4: Back to (2), process (2)
        Output: [1, 2]

Step 5: From (2), go right to (3), process (3)
        Output: [1, 2, 3]

Step 6: Back to (4), process (4)
        Output: [1, 2, 3, 4]

Step 7: From (4), go right to (6), then left to (5)
        Process (5), then (6), then (7)
        
Final Output: [1, 2, 3, 4, 5, 6, 7] ✓ Sorted!
```

### Why It Works

**For Binary Search Trees:**
- BST property: Left child < Parent < Right child
- Inorder traversal visits: Left (smaller) → Root → Right (larger)
- Result: Ascending sorted order

**For General Binary Trees:**
- Systematic exploration ensures no node is missed
- Stack (implicit in recursion or explicit in iteration) tracks the path
- Each node is visited exactly once

### Limitations

| Limitation | Description | Mitigation |
|------------|-------------|------------|
| **Stack Overflow** | Recursive approach may overflow for deep trees | Use iterative approach or Morris traversal |
| **Only for Binary Trees** | Standard inorder defined for binary trees | Convert n-ary to binary for similar effect |
| **Cannot Skip Nodes** | Must visit all nodes in order | Use other traversals if selective access needed |

---

## Practice Problems

### Problem 1: Binary Tree Inorder Traversal

**Problem:** [LeetCode 94 - Binary Tree Inorder Traversal](https://leetcode.com/problems/binary-tree-inorder-traversal/)

**Description:** Given the root of a binary tree, return the inorder traversal of its nodes' values.

**How to Apply:**
- Direct application of inorder traversal
- Practice both recursive and iterative implementations
- Try Morris traversal for O(1) space solution

**Key Insights:**
- Classic template for all inorder problems
- Test edge cases: empty tree, single node, skewed tree
- Compare space complexity of different approaches

---

### Problem 2: Validate Binary Search Tree

**Problem:** [LeetCode 98 - Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/)

**Description:** Given the root of a binary tree, determine if it is a valid binary search tree (BST).

**How to Apply:**
- Use inorder traversal to get sorted sequence
- Check if result is strictly increasing
- More efficient: track previous value during traversal, no need to store all values

**Key Insights:**
- Inorder of valid BST must be strictly increasing
- Use long min/max to handle edge cases with INT_MIN/INT_MAX
- Morris traversal can validate with O(1) space

---

### Problem 3: Kth Smallest Element in a BST

**Problem:** [LeetCode 230 - Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/)

**Description:** Given the root of a binary search tree and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.

**How to Apply:**
- Inorder traversal naturally gives sorted order
- Stop traversal after visiting k nodes (optimization)
- Use iterative approach for early termination

**Key Insights:**
- No need to traverse entire tree
- Counter tracks how many nodes processed
- Return immediately when counter reaches k

---

### Problem 4: Recover Binary Search Tree

**Problem:** [LeetCode 99 - Recover Binary Search Tree](https://leetcode.com/problems/recover-binary-search-tree/)

**Description:** You are given the root of a binary search tree (BST), where the values of exactly two nodes were swapped by mistake. Recover the tree without changing its structure.

**How to Apply:**
- Inorder traversal of valid BST is sorted
- Two swapped elements will create one or two "drops" in the sequence
- Track first and second violations during traversal
- Swap the values of the two incorrect nodes

**Key Insights:**
- First violation: first element is larger than next
- Second violation: second element is smaller than previous
- In-order predecessor tracking is key

---

### Problem 5: Binary Search Tree Iterator

**Problem:** [LeetCode 173 - Binary Search Tree Iterator](https://leetcode.com/problems/binary-search-tree-iterator/)

**Description:** Implement the BSTIterator class that represents an iterator over the in-order traversal of a binary search tree.

**How to Apply:**
- Use iterative inorder approach with controlled stack
- next(): Pop from stack, push right subtree's leftmost path
- hasNext(): Check if stack is non-empty
- Average O(1) time for both operations, O(h) space

**Key Insights:**
- Controlled iteration using explicit stack
- Lazy loading of right subtree
- Amortized O(1) time complexity

---

## Video Tutorial Links

### Fundamentals

- [Binary Tree Inorder Traversal (NeetCode)](https://www.youtube.com/watch?v=5T9T3C3D3vU) - Clear explanation of recursive and iterative approaches
- [Morris Traversal Algorithm (Take U Forward)](https://www.youtube.com/watch?v=80Zug6D1_r4) - O(1) space traversal explained
- [Tree Traversals Explained (Abdul Bari)](https://www.youtube.com/watch?v=gm8DUJJhmY4) - Visual animation of all traversal types

### BST-Specific Applications

- [Validate BST and Applications (NeetCode)](https://www.youtube.com/watch?v=s6ATEkipzow) - BST validation techniques
- [Kth Smallest Element in BST (Kevin Naughton Jr.)](https://www.youtube.com/watch?v=5LUXSvjmGCw) - Order statistics with inorder
- [Recover BST Explained (Back To Back SWE)](https://www.youtube.com/watch?v=LR3K5XAWV5k) - Advanced inorder application

### Advanced Topics

- [Threaded Binary Trees (Jenny's Lectures)](https://www.youtube.com/watch?v=iRB_e7Y7Ss4) - Permanent threading for traversal
- [Tree Iterator Pattern (Pepcoding)](https://www.youtube.com/watch?v=8rwHi9aNMfQ) - Controlled iteration design
- [Binary Tree Traversal Iterative (Nick White)](https://www.youtube.com/watch?v=8rwHi9aNMfQ) - All traversal types iteratively

---

## Follow-up Questions

### Q1: Why does inorder traversal give sorted order for BSTs?

**Answer:** In a valid BST:
- All left subtree values < root value
- All right subtree values > root value
- Inorder visits: Left → Root → Right
- Therefore: Smaller values → Root → Larger values

This recursive property ensures the entire traversal is in ascending order.

### Q2: What are the advantages of Morris traversal over recursive/iterative?

**Answer:**
- **Space**: O(1) vs O(h) - critical for memory-constrained systems
- **No stack overflow**: Safe for extremely deep trees
- **No auxiliary data structures**: Uses tree's own null pointers

**Trade-offs:**
- Temporarily modifies tree (restores it)
- Slightly more complex to understand/implement
- May be slower due to more pointer operations

### Q3: How do you handle inorder traversal when the tree might be modified during traversal?

**Answer:**
1. **Snapshot approach**: Store traversal results first, then modify
2. **Copy-on-write**: Work on a copy of the tree
3. **Locking mechanism**: Prevent modifications during traversal
4. **Fail-fast iterator**: Detect concurrent modification and throw exception

Never modify tree structure during Morris traversal (threads will break).

### Q4: Can inorder traversal be parallelized?

**Answer:** Direct parallelization is challenging because:
- Traversal order is inherently sequential
- Dependencies between left subtree, root, and right subtree

**Possible approaches:**
1. **Subtree-level parallelism**: Process left and right subtrees in parallel, then merge
2. **Pipeline parallelism**: Producer-consumer pattern with generator
3. **Map-reduce**: For very large trees distributed across systems

### Q5: How would you implement inorder traversal for n-ary trees?

**Answer:** Inorder is specifically defined for binary trees. For n-ary trees:

1. **First-child/next-sibling representation**: Convert to binary tree, then inorder
2. **Custom definition**: Visit first child, root, then remaining children
3. **Use different traversal**: Preorder or postorder make more sense for n-ary

Example custom inorder for n-ary:
```python
def inorder_nary(node):
    if not node.children:
        process(node)
        return
    inorder_nary(node.children[0])  # First child
    process(node)                    # Root
    for child in node.children[1:]:  # Remaining children
        inorder_nary(child)
```

---

## Summary

DFS Inorder Traversal is a fundamental tree algorithm with powerful applications, especially for Binary Search Trees. Key takeaways:

### Core Concepts
- **Left-Root-Right** processing order
- Produces **sorted output** for BSTs
- Three main implementations: Recursive, Iterative, Morris

### When to Use
- ✅ Retrieving sorted data from BSTs
- ✅ Validating BST properties
- ✅ Finding order statistics (kth smallest/largest)
- ✅ Expression tree evaluation
- ✅ Tree reconstruction problems

### Complexity Summary

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Recursive | O(n) | O(h) | Clean, readable code |
| Iterative | O(n) | O(h) | Avoiding recursion limits |
| Morris | O(n) | O(1) | Memory-constrained environments |

### Implementation Tips
1. **Recursive**: Easiest to write, watch stack overflow on skewed trees
2. **Iterative**: Use while loop with explicit stack, go left as far as possible
3. **Morris**: Understand predecessor threading concept thoroughly
4. **Early termination**: Iterative approach allows stopping at any point

### Common Pitfalls
- Not handling null/empty trees
- Confusing inorder with preorder/postorder
- Stack overflow in recursive approach with skewed trees
- Not restoring tree structure after Morris traversal

Mastering inorder traversal is essential for tree-based problems in technical interviews and competitive programming. The ability to implement all three variants (recursive, iterative, Morris) demonstrates deep understanding of tree algorithms.
