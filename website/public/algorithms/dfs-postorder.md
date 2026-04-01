# DFS Postorder Traversal

## Category
Trees & BSTs

## Description

DFS Postorder Traversal is a **depth-first tree traversal** algorithm that visits nodes in **Left-Right-Root** order. This means it recursively explores the entire left subtree, then the entire right subtree, and finally processes the current node. Postorder traversal is particularly useful for **bottom-up processing** where children must be processed before their parent, such as tree deletion, computing subtree properties, and evaluating expression trees.

This traversal pattern excels in scenarios requiring information to flow from leaf nodes to the root, making it ideal for dynamic programming on trees and problems where parent decisions depend on child results.

---

## Concepts

The DFS Postorder Traversal is built on several fundamental concepts that make it powerful for bottom-up tree problems.

### 1. Traversal Order

The fundamental principle is the **Left-Right-Root** processing order:

1. **Left Subtree**: Recursively traverse the entire left subtree first
2. **Right Subtree**: Recursively traverse the entire right subtree
3. **Root**: Process the current node last

This ordering ensures that both children are fully processed before their parent, enabling bottom-up computation.

### 2. Bottom-Up Processing

| Characteristic | Description | Example Use Case |
|----------------|-------------|------------------|
| **Children First** | Both left and right subtrees processed before parent | Tree deletion, subtree sums |
| **Information Flow** | Data propagates from leaves toward root | Height calculation, path sums |
| **Aggregation** | Parent combines results from children | Counting nodes, subtree validation |

### 3. Post-Visit Processing

The root node is processed only after both subtrees are complete:

```
Postorder(node):
    if node is null: return
    Postorder(node.left)      // Process entire left subtree
    Postorder(node.right)     // Process entire right subtree
    Process(node)             // Process current node last
```

### 4. Key Properties

| Property | Description |
|----------|-------------|
| **Children Before Parent** | Guaranteed processing order |
| **Leaf-First** | All leaves appear before ancestors |
| **Root Last** | Root is always the final node processed |
| **Subtree Completeness** | Each subtree is fully processed as a unit |

---

## Frameworks

Structured approaches for solving postorder traversal problems.

### Framework 1: Recursive Postorder Template

```
┌─────────────────────────────────────────────────────┐
│  RECURSIVE POSTORDER TRAVERSAL FRAMEWORK            │
├─────────────────────────────────────────────────────┤
│  1. Define recursive function with node parameter  │
│  2. Base case: if node is null, return              │
│  3. Recursively traverse left subtree               │
│  4. Recursively traverse right subtree              │
│  5. Process current node (add to result, etc.)      │
│  6. Return result                                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: Clean, readable code for bottom-up problems.

### Framework 2: Iterative Postorder (Two Stacks) Template

```
┌─────────────────────────────────────────────────────┐
│  ITERATIVE POSTORDER (TWO STACKS) FRAMEWORK         │
├─────────────────────────────────────────────────────┤
│  1. Initialize stack1 with root, empty stack2         │
│  2. While stack1 not empty:                           │
│     a. Pop from stack1, push to stack2              │
│     b. Push left child to stack1 (if exists)        │
│     c. Push right child to stack1 (if exists)       │
│  3. Pop all from stack2 to get postorder             │
│  4. Return result                                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: When you need postorder without recursion, easier to understand.

### Framework 3: Iterative Postorder (Single Stack) Template

```
┌─────────────────────────────────────────────────────┐
│  ITERATIVE POSTORDER (SINGLE STACK) FRAMEWORK       │
├─────────────────────────────────────────────────────┤
│  1. Initialize empty stack, current = root          │
│  2. Initialize last_visited = null                  │
│  3. While stack not empty or current not null:      │
│     a. If current exists:                           │
│        - Push current to stack                      │
│        - Move to left child                         │
│     b. Else:                                        │
│        - Peek at stack top                          │
│        - If right exists and not last_visited:      │
│          → Go right                                 │
│        - Else:                                      │
│          → Process node, pop, update last_visited   │
│  4. Return result                                   │
└─────────────────────────────────────────────────────┘
```

**When to use**: Memory-constrained environments, space-optimal solution.

---

## Forms

Different manifestations of the postorder traversal pattern.

### Form 1: Standard Postorder Traversal

Basic traversal returning all node values in postorder.

| Aspect | Description |
|--------|-------------|
| **Input** | Root of binary tree |
| **Output** | List of values in postorder sequence |
| **Use Case** | General tree traversal, collecting all nodes |

### Form 2: Bottom-Up Calculation

Computing properties that depend on children first.

| Aspect | Description |
|--------|-------------|
| **Pattern** | Return values from children, combine at parent |
| **Examples** | Tree height, subtree sum, node count |
| **Optimization** | Process and return, don't store all values |

### Form 3: Tree Deletion

Safely deleting tree nodes without memory leaks.

| Aspect | Description |
|--------|-------------|
| **Key Insight** | Delete children before parent to avoid dangling pointers |
| **Implementation** | Postorder ensures children freed before parent |
| **Language Note** | Critical in C/C++, less concern in garbage-collected languages |

### Form 4: Expression Tree Evaluation

Evaluating mathematical expressions stored in trees.

| Aspect | Description |
|--------|-------------|
| **Structure** | Leaves are operands, internal nodes are operators |
| **Evaluation** | Evaluate children (operands) before applying operator |
| **Result** | Postorder naturally evaluates expressions correctly |

### Form 5: Dynamic Programming on Trees

Solving optimization problems using subtree solutions.

| Aspect | Description |
|--------|-------------|
| **Pattern** | Solve for subtrees, combine for parent decision |
| **Examples** | Maximum path sum, house robber III, tree DP |
| **State** | Return multiple values to parent (rob/not_rob, etc.) |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Returning Multiple Values

Return complex state from subtrees to parent:

```python
def house_robber_tree(root: TreeNode) -> int:
    """
    Return (rob_root, not_rob_root) for each subtree.
    """
    def dfs(node):
        if not node:
            return (0, 0)  # (rob, not_rob)
        
        left_rob, left_not_rob = dfs(node.left)
        right_rob, right_not_rob = dfs(node.right)
        
        # If we rob this node, cannot rob children
        rob = node.val + left_not_rob + right_not_rob
        
        # If we don't rob, take max of each child
        not_rob = max(left_rob, left_not_rob) + max(right_rob, right_not_rob)
        
        return (rob, not_rob)
    
    return max(dfs(root))
```

### Tactic 2: Maximum Path Sum Tracking

Track both path through node and path to parent:

```python
def max_path_sum(root: TreeNode) -> int:
    """
    Find maximum path sum in binary tree.
    """
    max_sum = float('-inf')
    
    def dfs(node):
        nonlocal max_sum
        if not node:
            return 0
        
        # Get max path sum from children (ignore negative paths)
        left_gain = max(dfs(node.left), 0)
        right_gain = max(dfs(node.right), 0)
        
        # Price of path going through current node
        price_newpath = node.val + left_gain + right_gain
        
        # Update global maximum
        max_sum = max(max_sum, price_newpath)
        
        # Return max gain if continue path upward
        return node.val + max(left_gain, right_gain)
    
    dfs(root)
    return max_sum
```

### Tactic 3: Subtree Validation

Check if subtrees satisfy conditions before checking parent:

```python
def count_univalue_subtrees(root: TreeNode) -> int:
    """
    Count subtrees where all nodes have same value.
    """
    count = 0
    
    def dfs(node):
        nonlocal count
        if not node:
            return True
        
        left_uni = dfs(node.left)
        right_uni = dfs(node.right)
        
        # Check if current subtree is univalued
        if left_uni and right_uni:
            if node.left and node.left.val != node.val:
                return False
            if node.right and node.right.val != node.val:
                return False
            count += 1
            return True
        
        return False
    
    dfs(root)
    return count
```

### Tactic 4: Tree Height and Balance Check

Compute height while checking balance:

```python
def is_balanced(root: TreeNode) -> bool:
    """
    Check if tree is height-balanced.
    """
    def dfs(node):
        if not node:
            return (0, True)  # (height, is_balanced)
        
        left_height, left_balanced = dfs(node.left)
        right_height, right_balanced = dfs(node.right)
        
        height = 1 + max(left_height, right_height)
        balanced = (left_balanced and right_balanced and 
                  abs(left_height - right_height) <= 1)
        
        return (height, balanced)
    
    return dfs(root)[1]
```

### Tactic 5: Lowest Common Ancestor with State

Find LCA using postorder state tracking:

```python
def lowest_common_ancestor(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    """
    Find LCA of nodes p and q.
    """
    def dfs(node):
        if not node:
            return None
        
        # If current node is one of the targets
        if node == p or node == q:
            return node
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        # If both subtrees found targets, current is LCA
        if left and right:
            return node
        
        # Otherwise, return the found node (if any)
        return left if left else right
    
    return dfs(root)
```

---

## Python Templates

### Template 1: Recursive Postorder Traversal

```python
from typing import List, Optional

class TreeNode:
    """Definition for a binary tree node."""
    def __init__(self, val: int = 0, left: Optional['TreeNode'] = None, 
                 right: Optional['TreeNode'] = None):
        self.val = val
        self.left = left
        self.right = right

def postorder_recursive(root: Optional[TreeNode]) -> List[int]:
    """
    DFS Postorder Traversal - Recursive Approach
    
    Time Complexity: O(n) - visit each node exactly once
    Space Complexity: O(h) - recursion stack, h = height of tree
    
    Args:
        root: Root of binary tree
        
    Returns:
        List of node values in postorder sequence
    """
    result = []
    
    def traverse(node: Optional[TreeNode]) -> None:
        if not node:
            return
        traverse(node.left)           # Visit left subtree
        traverse(node.right)          # Visit right subtree
        result.append(node.val)       # Visit root
    
    traverse(root)
    return result
```

### Template 2: Iterative Postorder (Two Stacks)

```python
def postorder_iterative_two_stacks(root: Optional[TreeNode]) -> List[int]:
    """
    DFS Postorder Traversal - Two Stacks Approach
    
    Logic: First stack does a root-right-left traversal,
    second stack reverses it to get left-right-root (postorder).
    
    Time Complexity: O(n)
    Space Complexity: O(n) - stores all nodes
    
    Args:
        root: Root of binary tree
        
    Returns:
        List of node values in postorder
    """
    if not root:
        return []
    
    result = []
    stack1 = [root]  # For traversal
    stack2 = []      # For reversing
    
    # Get root-right-left order in stack2
    while stack1:
        node = stack1.pop()
        stack2.append(node)
        
        # Push left first, then right (so right is processed first)
        if node.left:
            stack1.append(node.left)
        if node.right:
            stack1.append(node.right)
    
    # Pop from stack2 to get left-right-root
    while stack2:
        result.append(stack2.pop().val)
    
    return result
```

### Template 3: Iterative Postorder (Single Stack)

```python
def postorder_iterative_single_stack(root: Optional[TreeNode]) -> List[int]:
    """
    DFS Postorder Traversal - Single Stack with Last Visited Tracking
    
    More space-efficient than two-stack approach.
    
    Time Complexity: O(n)
    Space Complexity: O(h) - only stores one path
    
    Args:
        root: Root of binary tree
        
    Returns:
        List of node values in postorder
    """
    if not root:
        return []
    
    result = []
    stack = []
    current = root
    last_visited = None
    
    while stack or current:
        # Go to leftmost node
        if current:
            stack.append(current)
            current = current.left
        else:
            # Peek at top
            peek = stack[-1]
            
            # If right exists and not visited, go right
            if peek.right and peek.right != last_visited:
                current = peek.right
            else:
                # Both children processed, process this node
                result.append(peek.val)
                last_visited = stack.pop()
    
    return result
```

### Template 4: Tree Height Calculation

```python
def tree_height(root: Optional[TreeNode]) -> int:
    """
    Calculate height of binary tree using postorder.
    
    Time: O(n)
    Space: O(h)
    
    Args:
        root: Root of binary tree
    
    Returns:
        Height of tree (0 for empty tree)
    """
    def dfs(node):
        if not node:
            return -1  # Height of empty tree is -1 (edges)
            # return 0  # Use 0 if counting nodes instead of edges
        
        left_height = dfs(node.left)
        right_height = dfs(node.right)
        
        return 1 + max(left_height, right_height)
    
    return dfs(root)
```

### Template 5: Tree Node Count and Sum

```python
def tree_properties(root: Optional[TreeNode]) -> dict:
    """
    Calculate various tree properties using postorder.
    
    Returns dict with count, sum, and average of node values.
    
    Time: O(n)
    Space: O(h)
    """
    def dfs(node):
        if not node:
            return (0, 0)  # (count, sum)
        
        left_count, left_sum = dfs(node.left)
        right_count, right_sum = dfs(node.right)
        
        total_count = 1 + left_count + right_count
        total_sum = node.val + left_sum + right_sum
        
        return (total_count, total_sum)
    
    count, total = dfs(root)
    return {
        'count': count,
        'sum': total,
        'average': total / count if count > 0 else 0
    }
```

### Template 6: Delete Tree Nodes

```python
def delete_tree(root: Optional[TreeNode]) -> None:
    """
    Delete all nodes in tree using postorder.
    
    Important: Must delete children before parent.
    
    Time: O(n)
    Space: O(h)
    """
    def dfs(node):
        if not node:
            return
        
        # Delete children first
        dfs(node.left)
        dfs(node.right)
        
        # Now safe to delete current node
        # In Python, just dereference (GC handles it)
        # In C/C++, would call free/delete here
        node.left = None
        node.right = None
    
    dfs(root)
```

### Template 7: Serialize Tree (Postorder)

```python
def serialize_postorder(root: Optional[TreeNode]) -> str:
    """
    Serialize tree using postorder traversal.
    
    Time: O(n)
    Space: O(n)
    """
    def dfs(node):
        if not node:
            result.append("#")
            return
        
        dfs(node.left)
        dfs(node.right)
        result.append(str(node.val))
    
    result = []
    dfs(root)
    return ",".join(result)


def deserialize_postorder(data: str) -> Optional[TreeNode]:
    """
    Deserialize tree from postorder string.
    
    Note: Postorder alone cannot uniquely identify a tree.
    Requires additional information.
    """
    # Implementation would require knowing tree structure
    # or combining with inorder/preorder
    pass
```

---

## When to Use

Use Postorder DFS when you need to solve problems involving:

- **Tree Deletion**: Must delete children before parents to avoid memory leaks
- **Bottom-up Calculations**: Computing properties that depend on child nodes (height, size, sum)
- **Expression Trees**: Evaluating mathematical expressions where operands must be computed before operators
- **Subtree Validation**: Checking properties of subtrees before validating parent nodes
- **Directory/File Size Calculation**: Computing total sizes where subdirectories must be summed first
- **Tree Dynamic Programming**: Problems requiring optimal decisions based on child solutions

### Comparison with Other Tree Traversals

| Traversal | Order | Best Used For | Processing Direction |
|-----------|-------|---------------|---------------------|
| **Preorder** | Root-Left-Right | Copying trees, prefix notation, top-down processing | Top-down |
| **Inorder** | Left-Root-Right | BST validation, sorted order retrieval | Left-to-right |
| **Postorder** | Left-Right-Root | Tree deletion, expression evaluation, bottom-up DP | Bottom-up |
| **Level Order** | Level by level | Finding shortest path, level-based processing | Breadth-first |

### When to Choose Postorder vs Other Traversals

- **Choose Postorder** when:
  - You need to process children before parents (bottom-up)
  - Deleting a tree (free children before parent)
  - Evaluating expression trees
  - Computing subtree aggregates (sum, count, height)

- **Choose Preorder** when:
  - You need to process root before children (top-down)
  - Creating a copy of the tree
  - Serializing tree structure

- **Choose Inorder** when:
  - Working with BSTs to get sorted order
  - Finding inorder predecessors/successors

---

## Algorithm Explanation

### Core Concept

The fundamental principle of Postorder DFS is **post-visit processing**: the root node is processed only after both its left and right subtrees have been completely traversed. This creates a natural bottom-up flow of information from leaf nodes to the root.

```
Postorder(node):
    if node is null:
        return
    Postorder(node.left)      // Process entire left subtree
    Postorder(node.right)     // Process entire right subtree
    Process(node)             // Process current node last
```

### How It Works

#### Traversal Order Visualization:

For the following binary tree:

```
        1          <- Level 0 (Root)
       / \
      2   3        <- Level 1
     / \   \
    4   5   6      <- Level 2
       /
      7            <- Level 3
```

**Postorder Traversal: [4, 7, 5, 2, 6, 3, 1]**

Let's trace through the execution:

1. Start at root (1), go left to (2)
2. From (2), go left to (4)
3. (4) is a leaf - process it: **[4]**
4. Back to (2), go right to (5)
5. From (5), go left to (7)
6. (7) is a leaf - process it: **[4, 7]**
7. Back to (5), right is null - process (5): **[4, 7, 5]**
8. Back to (2), both children done - process (2): **[4, 7, 5, 2]**
9. Back to (1), go right to (3)
10. From (3), left is null, go right to (6)
11. (6) is a leaf - process it: **[4, 7, 5, 2, 6]**
12. Back to (3), right child done - process (3): **[4, 7, 5, 2, 6, 3]**
13. Back to (1), both children done - process (1): **[4, 7, 5, 2, 6, 3, 1]**

### Key Properties

1. **Children Before Parent**: Guaranteed that both left and right children are processed before their parent
2. **Leaf-First**: All leaf nodes appear before their ancestors in the result
3. **Left Subtree Before Right**: The entire left subtree is processed before any node in the right subtree
4. **Root Last**: The root is always the last node processed

### Common Applications

| Application | Why Postorder Works |
|-------------|---------------------|
| **Tree Deletion** | Free child memory before parent to avoid dangling pointers |
| **Expression Evaluation** | Evaluate operands (children) before applying operator (parent) |
| **Maximum Path Sum** | Compute max paths in subtrees before computing through parent |
| **Tree Height** | Calculate heights of children before calculating parent's height |
| **Univalue Subtrees** | Check if children are univalue before checking parent |

---

## Practice Problems

### Problem 1: Binary Tree Postorder Traversal

**Problem:** [LeetCode 145 - Binary Tree Postorder Traversal](https://leetcode.com/problems/binary-tree-postorder-traversal/)

**Description:** Given the root of a binary tree, return the postorder traversal of its nodes' values.

**How to Apply:**
- This is the fundamental postorder traversal problem
- Implement both recursive and iterative solutions
- The two-stack approach is most intuitive for iterative

**Key Insight:** The root is processed after both subtrees, making postorder perfect for bottom-up aggregation.

---

### Problem 2: Binary Tree Maximum Path Sum

**Problem:** [LeetCode 124 - Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/)

**Description:** A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge connecting them. Return the maximum path sum of any non-empty path.

**How to Apply:**
- Use postorder to compute max path sum through each node
- For each node, calculate:
  - Max sum from left subtree (max(0, left_result))
  - Max sum from right subtree (max(0, right_result))
  - Current max path through node: left + right + node.val
- Return max single path (left or right + node.val) to parent

**Key Insight:** Postorder ensures we know the best paths through children before deciding the best path through parent.

---

### Problem 3: Count Univalue Subtrees

**Problem:** [LeetCode 250 - Count Univalue Subtrees](https://leetcode.com/problems/count-univalue-subtrees/)

**Description:** Given the root of a binary tree, return the number of uni-value subtrees (subtrees where all nodes have the same value).

**How to Apply:**
- Process leaves first (they are always univalue)
- For each internal node, check if it's univalue:
  - Both children must be univalue subtrees
  - Node value must equal children's values (if they exist)
- Count and propagate result upward

**Key Insight:** You must verify children are univalued before the parent can be verified - perfect for postorder.

---

### Problem 4: Delete Tree Nodes

**Problem:** [LeetCode 1273 - Delete Tree Nodes](https://leetcode.com/problems/delete-tree-nodes/)

**Description:** Return the number of nodes remaining in the tree after removing nodes with subtree sums equal to zero.

**How to Apply:**
- Compute subtree sums bottom-up using postorder
- Track which subtrees have zero sum
- Delete (don't count) nodes whose subtree sum is zero
- Return count of remaining nodes

**Key Insight:** You need the sum of the entire subtree to decide deletion - postorder provides this naturally.

---

### Problem 5: House Robber III

**Problem:** [LeetCode 337 - House Robber III](https://leetcode.com/problems/house-robber-iii/)

**Description:** The thief has found a new place to rob. Houses are arranged in a binary tree structure. Determine the maximum amount of money the thief can rob without alerting the police (cannot rob directly connected houses).

**How to Apply:**
- For each node, compute two values:
  - `rob`: max money if we rob this node (can't rob children)
  - `not_rob`: max money if we don't rob this node (can rob children)
- `rob = node.val + left.not_rob + right.not_rob`
- `not_rob = max(left.rob, left.not_rob) + max(right.rob, right.not_rob)`
- Return both values to parent

**Key Insight:** Decision at each node depends on optimal decisions from children - classic postorder DP.

---

## Video Tutorial Links

### Fundamentals

- [Binary Tree Postorder Traversal (NeetCode)](https://www.youtube.com/watch?v=QzO1mP8b624) - Clear explanation with code
- [Tree Traversals Explained (Back To Back SWE)](https://www.youtube.com/watch?v=1WxLM2hwL-U) - Comprehensive traversal comparison
- [Iterative Postorder Using Two Stacks (Kevin Naughton Jr.)](https://www.youtube.com/watch?v=qT65HltK2uE) - Stack-based approach explained
- [DFS Traversals In-Depth (Abdul Bari)](https://www.youtube.com/watch?v=gm8DUJJhmY4) - Visual animation of all traversals

### Advanced Topics

- [Maximum Path Sum in Binary Tree (NeetCode)](https://www.youtube.com/watch?v=Hr5cWUld4vU) - Bottom-up postorder DP
- [House Robber III Solution (Nick White)](https://www.youtube.com/watch?v=nHR8ytpzz7c) - Postorder DP pattern
- [Morris Traversal O(1) Space](https://www.youtube.com/watch?v=wGXB9OWhPTg) - Space-optimized tree traversal
- [Tree DP Patterns (Lead Coding)](https://www.youtube.com/watch?v=d1uQ8C9E0kk) - Postorder in dynamic programming

---

## Follow-up Questions

### Q1: Why can't we do postorder traversal using just one simple stack without tracking?

**Answer:** In postorder, we need to visit a node twice - once to explore its right subtree after finishing the left, and once to process the node itself after both subtrees. Without tracking which children have been visited, we can't distinguish between:
- Just arrived at node (need to go left)
- Returned from left (need to go right)
- Returned from right (need to process node)

The single-stack solution uses `lastVisited` to track this state, or we can use a visited flag in the stack.

### Q2: What happens with postorder on an infinitely deep tree?

**Answer:** The recursive implementation will hit the system recursion limit or cause a stack overflow. The iterative implementations will also fail as they need O(h) space. For very deep trees:
- Use an explicit stack with manual memory management
- Convert to an iterative approach with tail-call optimization
- Use a modified Morris traversal for O(1) space

### Q3: Can postorder be used to serialize a binary tree?

**Answer:** Postorder alone cannot uniquely serialize a binary tree because different trees can produce the same postorder sequence. For example:
```
  1      1
 /          \
2            2
```
Both have postorder `[2, 1]`. To uniquely serialize, you need:
- Preorder + Inorder, or
- Postorder + Inorder, or
- Level order with null markers

### Q4: How does postorder compare to BFS for finding tree height?

**Answer:** Both work, but differently:
- **Postorder (DFS)**: Computes height bottom-up. Each node returns `1 + max(left_height, right_height)`. Time: O(n), Space: O(h)
- **BFS (Level Order)**: Counts levels from top. Increment counter for each level processed. Time: O(n), Space: O(w) where w is max width

Postorder is more natural for height calculation, but BFS can be more space-efficient for balanced trees.

### Q5: When would you choose iterative over recursive postorder?

**Answer:** Choose iterative when:
- Tree depth might exceed recursion limit (typically ~1000 in Python)
- You need explicit control over the stack for debugging
- Memory is constrained (single-stack iterative uses less than two-stack)
- You're in an environment with limited stack space (embedded systems)

Choose recursive when:
- Code clarity is priority
- Tree is guaranteed to be balanced
- The language optimizes tail recursion (though postorder isn't tail-recursive)

---

## Summary

DFS Postorder Traversal is a fundamental tree traversal algorithm characterized by its **Left-Right-Root** processing order. It excels in scenarios requiring **bottom-up computation** where child information must be available before parent processing.

### Key Takeaways

- **Processing Order**: Left subtree → Right subtree → Root
- **Primary Use Cases**: Tree deletion, expression evaluation, bottom-up DP
- **Time Complexity**: O(n) - visits each node exactly once
- **Space Complexity**: O(h) - height of tree for stack storage
- **Implementation Options**: Recursive (clean), Two-Stack (intuitive), Single-Stack (space-optimal)

### When to Use

- ✅ Computing subtree properties (sum, count, height)
- ✅ Tree deletion and memory management
- ✅ Expression tree evaluation
- ✅ Problems requiring information to flow from leaves to root
- ❌ When you need sorted order from BST (use inorder)
- ❌ When you need top-down propagation (use preorder)

### Implementation Recommendations

- Start with recursive for clarity and correctness
- Use two-stack iterative for interview settings (easier to explain)
- Use single-stack iterative for production with deep trees
- Consider Morris traversal only when space is absolutely critical

This traversal pattern is essential for tree-based dynamic programming and appears frequently in competitive programming and technical interviews. Mastering postorder unlocks solutions to a wide class of tree problems involving subtree aggregation and bottom-up decision making.
