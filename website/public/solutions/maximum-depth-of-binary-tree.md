# Maximum Depth of Binary Tree

## Problem Description

Given the root of a binary tree, return its **maximum depth** (also known as height).

The maximum depth of a binary tree is the number of nodes along the longest path from the root node down to the farthest leaf node.

A **leaf node** is a node with no children. The depth of an empty tree (null root) is defined as 0.

**LeetCode Problem Number:** 104

---

## Examples

### Example 1

**Input:**
```python
root = [3,9,20,null,null,15,7]
```

**Visual Representation:**
```
        3
       / \
      9   20
         /  \
        15   7
```

**Output:**
```python
3
```

**Explanation:**
- Level 0: Node 3 (depth = 1)
- Level 1: Nodes 9, 20 (depth = 2)
- Level 2: Nodes 15, 7 (depth = 3)
- The longest path has 3 nodes, so maximum depth = 3

---

### Example 2

**Input:**
```python
root = [1,null,2]
```

**Visual Representation:**
```
    1
     \
      2
```

**Output:**
```python
2
```

**Explanation:**
- Path 1 → 2 has 2 nodes, so maximum depth = 2

---

### Example 3

**Input:**
```python
root = []
```

**Output:**
```python
0
```

**Explanation:** An empty tree has depth 0.

---

### Example 4

**Input:**
```python
root = [1]
```

**Output:**
```python
1
```

**Explanation:** A single node tree has depth 1.

---

### Example 5

**Input:**
```python
root = [1,2,3,4,5,null,7,8]
```

**Visual Representation:**
```
            1
          /   \
         2     3
        / \     \
       4   5     7
      /
     8
```

**Output:**
```python
4
```

**Explanation:**
- Longest path: 1 → 2 → 4 → 8 (4 nodes)
- Maximum depth = 4

---

## Constraints

- The number of nodes in the tree is in the range `[0, 10^4]`.
- `-100 <= Node.val <= 100`

---

## Intuition

The maximum depth of a binary tree can be understood through the following key insights:

### 1. **Recursive Definition**
A tree's height can be defined recursively:
- The height of an empty tree is 0
- The height of a non-empty tree is: `1 + max(height(left_subtree), height(right_subtree))`

This is because the height of a node is 1 (for itself) plus the maximum of its left and right subtree heights.

### 2. **Tree Structure = Recursion**
Binary trees have a naturally recursive structure. Each node defines a subtree rooted at that node. This makes recursion the most intuitive approach.

### 3. **Two Fundamental Traversal Patterns**
- **Depth-First Search (DFS)**: Go deep before wide. Natural fit for recursive solutions.
- **Breadth-First Search (BFS)**: Go wide before deep. Can track depth by processing level by level.

### 4. **Key Observations**
- Every node contributes exactly 1 to the depth of paths going through it
- The maximum depth is the length of the longest root-to-leaf path
- We only need to find the maximum, not the entire path

---

## Multiple Approaches with Code

### Approach 1: Recursive DFS (Post-order Traversal) ⭐

This is the most straightforward and elegant solution. We process left and right subtrees first, then compute the current node's depth.

#### Algorithm
1. Base case: If root is null, return 0
2. Recursively compute the depth of left subtree
3. Recursively compute the depth of right subtree
4. Return `1 + max(left_depth, right_depth)`

#### Code Implementation
```python
from typing import Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        """
        Calculate maximum depth using recursive DFS (post-order traversal).
        
        Time: O(n) - Each node visited exactly once
        Space: O(h) - Recursion stack, h = height of tree
        
        Args:
            root: The root node of the binary tree
            
        Returns:
            The maximum depth of the tree
        """
        # Base case: empty tree
        if not root:
            return 0
        
        # Recursive case: height = 1 + max(left_height, right_height)
        left_depth = self.maxDepth(root.left)
        right_depth = self.maxDepth(root.right)
        
        return 1 + max(left_depth, right_depth)
```

#### How to Arrive at the Solution
1. Recognize that tree height follows the recursive formula: `height = 1 + max(height(left), height(right))`
2. This is a post-order traversal (left → right → root)
3. Handle the empty tree case first (depth = 0)
4. The recursion naturally handles all nodes

#### Step-by-Step Execution (Example: [3,9,20,null,null,15,7])

```
Tree:
        3
       / \
      9   20
         /  \
        15   7

Call stack:
maxDepth(3)
├── maxDepth(9)
│   └── returns 1 (leaf node)
└── maxDepth(20)
    ├── maxDepth(15)
    │   └── returns 1 (leaf node)
    └── maxDepth(7)
        └── returns 1 (leaf node)
    
Calculation:
- Node 9: 1 + max(0, 0) = 1
- Node 15: 1 + max(0, 0) = 1
- Node 7: 1 + max(0, 0) = 1
- Node 20: 1 + max(1, 1) = 2
- Node 3: 1 + max(1, 2) = 3

Result: 3
```

---

### Approach 2: Iterative DFS with Stack

This approach simulates the recursion using an explicit stack. We track both the node and its current depth.

#### Algorithm
1. Initialize a stack with (root, depth=1)
2. Initialize max_depth = 0
3. While stack is not empty:
   - Pop a node and its depth
   - Update max_depth if current depth is greater
   - Push right child with depth+1 (if exists)
   - Push left child with depth+1 (if exists)
4. Return max_depth

#### Code Implementation
```python
from typing import Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        """
        Calculate maximum depth using iterative DFS with explicit stack.
        
        Time: O(n) - Each node visited exactly once
        Space: O(h) - Stack storage, h = height of tree
        
        Args:
            root: The root node of the binary tree
            
        Returns:
            The maximum depth of the tree
        """
        if not root:
            return 0
        
        max_depth = 0
        stack = [(root, 1)]  # Stack stores tuples of (node, depth)
        
        while stack:
            node, depth = stack.pop()
            max_depth = max(max_depth, depth)
            
            # Push right first, then left (so left is processed first)
            if node.right:
                stack.append((node.right, depth + 1))
            if node.left:
                stack.append((node.left, depth + 1))
        
        return max_depth
```

#### Step-by-Step Execution

```
Tree:
        3
       / \
      9   20
         /  \
        15   7

Initial: stack = [(3, 1)], max_depth = 0

Step 1: Pop (3, 1), max_depth = 1
        Push (20, 2), (9, 2)
        Stack: [(20, 2), (9, 2)]

Step 2: Pop (9, 2), max_depth = 2
        No children
        Stack: [(20, 2)]

Step 3: Pop (20, 2), max_depth = 2
        Push (7, 3), (15, 3)
        Stack: [(7, 3), (15, 3)]

Step 4: Pop (15, 3), max_depth = 3
        No children
        Stack: [(7, 3)]

Step 5: Pop (7, 3), max_depth = 3
        No children
        Stack: []

Result: 3
```

---

### Approach 3: BFS with Queue (Level Order Traversal)

This approach processes the tree level by level, counting how many levels we traverse.

#### Algorithm
1. If root is null, return 0
2. Initialize queue with root
3. Initialize depth = 0
4. While queue is not empty:
   - Increment depth
   - Process all nodes at current level
   - Add their children to queue for next level
5. Return depth

#### Code Implementation
```python
from typing import Optional
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        """
        Calculate maximum depth using BFS with queue (level order).
        
        Time: O(n) - Each node visited exactly once
        Space: O(w) - Queue storage, w = maximum width of tree
        
        Args:
            root: The root node of the binary tree
            
        Returns:
            The maximum depth of the tree
        """
        if not root:
            return 0
        
        depth = 0
        queue = deque([root])
        
        while queue:
            depth += 1
            level_size = len(queue)
            
            for _ in range(level_size):
                node = queue.popleft()
                
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
        
        return depth
```

#### Step-by-Step Execution

```
Tree:
        3
       / \
      9   20
         /  \
        15   7

Initial: queue = [3], depth = 0

Level 0 (depth=1):
  Process: [3]
  Add children: [9, 20]
  queue = [9, 20], depth = 1

Level 1 (depth=2):
  Process: [9, 20]
  Add children: [15, 7]
  queue = [15, 7], depth = 2

Level 2 (depth=3):
  Process: [15, 7]
  Add children: []
  queue = [], depth = 3

Result: 3
```

---

### Approach 4: DFS with Path Tracking

This approach keeps track of the current path depth while traversing and updates a global maximum.

#### Code Implementation
```python
from typing import Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        """
        Calculate maximum depth using DFS with global max tracking.
        
        Time: O(n) - Each node visited exactly once
        Space: O(h) - Recursion stack, h = height of tree
        
        Args:
            root: The root node of the binary tree
            
        Returns:
            The maximum depth of the tree
        """
        self.max_depth = 0
        
        def dfs(node: Optional[TreeNode], current_depth: int):
            if not node:
                return
            
            # Update max depth at this node
            self.max_depth = max(self.max_depth, current_depth)
            
            # Recurse on children with incremented depth
            dfs(node.left, current_depth + 1)
            dfs(node.right, current_depth + 1)
        
        dfs(root, 1)
        return self.max_depth
```

---

### Approach 5: One-Liner (Functional Programming)

For those who appreciate Python's elegance, here's a compact one-liner using conditional expressions.

#### Code Implementation
```python
from typing import Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def maxDepth(self, root: Optional[TreeNode]) -> int:
        """
        Calculate maximum depth using a compact one-liner approach.
        
        Time: O(n) - Each node visited exactly once
        Space: O(h) - Recursion stack, h = height of tree
        
        Args:
            root: The root node of the binary tree
            
        Returns:
            The maximum depth of the tree
        """
        return 0 if not root else 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))
```

---

## Complexity Analysis Summary

| Approach | Time Complexity | Space Complexity | Notes |
|----------|-----------------|------------------|-------|
| Recursive DFS | O(n) | O(h) | **Most elegant**, natural fit for tree structure |
| Iterative DFS (Stack) | O(n) | O(h) | Avoids recursion limits, explicit control |
| BFS with Queue | O(n) | O(w) | Level-by-level, intuitive depth tracking |
| DFS with Path Tracking | O(n) | O(h) | Global variable approach |
| One-Liner | O(n) | O(h) | Elegant but less readable |

Where:
- n = number of nodes in the tree
- h = height of the tree (worst case: O(n) for skewed tree)
- w = maximum width of the tree (worst case: O(n) for complete tree)

**Best Space Complexity for Balanced Tree:** O(log n) for DFS approaches
**Worst Space Complexity for Skewed Tree:** O(n) for all approaches

---

## Related Problems

Here are similar LeetCode problems that build on tree depth concepts:

| # | Problem | Difficulty | Description |
|---|---------|------------|-------------|
| 1 | [Balanced Binary Tree](balanced-binary-tree.md) | Easy | Check if tree is height-balanced (left-right height diff ≤ 1) |
| 2 | [Diameter of Binary Tree](diameter-of-binary-tree.md) | Easy | Find longest path between any two nodes |
| 3 | [Minimum Depth of Binary Tree](https://leetcode.com/problems/minimum-depth-of-binary-tree/) | Easy | Find shortest root-to-leaf path |
| 4 | [Binary Tree Level Order Traversal](binary-tree-level-order-traversal.md) | Medium | Traverse level by level (BFS) |
| 5 | [Binary Tree Right Side View](binary-tree-right-side-view.md) | Medium | See tree from right side |
| 6 | [Maximum Depth of N-ary Tree](https://leetcode.com/problems/maximum-depth-of-n-ary-tree/) | Easy | Same problem for N-ary trees |
| 7 | [Count Nodes with Longest Path](https://leetcode.com/problems/count-nodes-with-the-longest-path/) | Hard | Advanced depth-based counting |
| 8 | [Tree Diameter](https://leetcode.com/problems/tree-diameter/) | Medium | Diameter in weighted trees |

---

## Video Tutorial Links

For visual explanations, check these tutorials:

1. **[Maximum Depth of Binary Tree - LeetCode 104](https://www.youtube.com/watch?v=_nnxV_dCBQw)** - NeetCode
2. **[Binary Tree Maximum Depth - Recursive Solution](https://www.youtube.com/watch?v=oDXZ91a5mpU)** - CodePath
3. **[Tree Traversal - BFS vs DFS](https://www.youtube.com/watch?v=86CgTejN9i0)** - Grokking the Coding Interview
4. **[Binary Tree Maximum Depth - Iterative Solution](https://www.youtube.com/watch?v=hTMlh7IOVCk)** - Timus Coding
5. **[Understanding Tree Height and Depth](https://www.youtube.com/watch?v=q70DDbKH3IM)** - Back to Back SWE

---

## Follow-up Questions

### 1. What if we wanted the minimum depth of the binary tree?
```python
def minDepth(self, root: Optional[TreeNode]) -> int:
    if not root:
        return 0
    if not root.left:
        return 1 + self.minDepth(root.right)
    if not root.right:
        return 1 + self.minDepth(root.left)
    return 1 + min(self.minDepth(root.left), self.minDepth(root.right))
```
**Key difference:** Must ensure we don't count a leaf as depth if only one child exists.

---

### 2. How would you check if a tree is balanced?
Use the post-order traversal approach where each node returns its height, and -1 if unbalanced:
```python
def isBalanced(self, root: Optional[TreeNode]) -> bool:
    def check(node):
        if not node:
            return 0
        left = check(node.left)
        if left == -1:
            return -1
        right = check(node.right)
        if right == -1:
            return -1
        if abs(left - right) > 1:
            return -1
        return max(left, right) + 1
    return check(root) != -1
```

---

### 3. How would you find the diameter of the tree?
The diameter is the maximum of:
- Left subtree diameter
- Right subtree diameter
- Longest path through current node (left_height + right_height)

---

### 4. Can you solve this iteratively without a stack or queue?
**Morris Traversal** can achieve O(1) space by temporarily modifying tree pointers:
```python
# Advanced - uses threaded binary tree concept
def maxDepth(self, root):
    depth = 0
    current = root
    while current:
        if not current.left:
            current = current.right
            depth += 1
        else:
            # Find predecessor and create thread
            # Similar to Morris inorder traversal
            ...
```

---

### 5. How would you calculate depth for an N-ary tree?
```python
def maxDepth(self, root: 'Node') -> int:
    if not root:
        return 0
    if not root.children:
        return 1
    return 1 + max(self.maxDepth(child) for child in root.children)
```

---

### 6. What if nodes have parent pointers?
We can use BFS level-order traversal, moving level by level until we hit leaf nodes. The parent pointers help in navigating back up the tree when needed.

---

### 7. How would you find all root-to-leaf paths and their depths?
Use DFS with path tracking:
```python
def findPaths(self, root: Optional[TreeNode]) -> List[List[int]]:
    def dfs(node, path):
        if not node:
            results.append(path[:])
            return
        path.append(node.val)
        dfs(node.left, path)
        dfs(node.right, path)
        path.pop()
```

---

### 8. How to handle very deep trees without recursion limit issues?
- Use **iterative BFS/DFS** with explicit stack/queue
- Increase **Python recursion limit** (not recommended for production)
- Use **Morris Traversal** for O(1) space

---

### 9. What's the difference between height and depth?
- **Height**: Maximum distance from node to a leaf (max edges to descendant)
- **Depth**: Distance from root to node (number of edges from root)

For a tree:
- Root has depth 0, height = tree height
- Leaf has height 0, depth = its distance from root

---

### 10. How would you compute average depth of all nodes?
```python
def averageDepth(self, root: Optional[TreeNode]) -> float:
    total_depth = 0
    count = 0
    queue = deque([(root, 0)])
    
    while queue:
        node, depth = queue.popleft()
        total_depth += depth
        count += 1
        if node.left:
            queue.append((node.left, depth + 1))
        if node.right:
            queue.append((node.right, depth + 1))
    
    return total_depth / count if count > 0 else 0
```

---

## Common Mistakes to Avoid

### 1. **Empty Tree Handling**
❌ **Wrong:** Returning None or -1 for empty tree
✅ **Correct:** Return 0 (depth of empty tree is 0)

### 2. **Confusing Nodes vs Edges**
❌ **Wrong:** Counting edges instead of nodes
✅ **Correct:** Tree depth is number of nodes, not edges

### 3. **Wrong Base Case for Minimum Depth**
❌ **Wrong:** Simply using `1 + min(left, right)`
✅ **Correct:** Must handle cases where one child is null (not a leaf)

### 4. **Stack Overflow on Deep Trees**
❌ **Wrong:** Using recursion on very deep (10^4+ nodes) skewed trees
✅ **Correct:** Use iterative approach for deep trees

### 5. **Forgetting to Track Depth in Iterative DFS**
❌ **Wrong:** Only pushing nodes to stack without depth
✅ **Correct:** Push (node, depth) tuples to track current depth

### 6. **Incorrect Level Size in BFS**
❌ **Wrong:** Using `while queue:` without level size tracking
✅ **Correct:** Track level size with `len(queue)` for correct depth counting

### 7. **Using Wrong Max Function**
❌ **Wrong:** `max(left, right)` without adding 1
✅ **Correct:** `1 + max(left, right)` includes current node

### 8. **Not Handling Both Children**
❌ **Wrong:** Only checking one child direction
✅ **Correct:** Always check both `node.left` and `node.right`

---

## References

- [LeetCode 104 - Maximum Depth of Binary Tree](https://leetcode.com/problems/maximum-depth-of-binary-tree/)
- [CLRS Introduction to Algorithms - Chapter 10 (Binary Trees)](https://en.wikipedia.org/wiki/Introduction_to_Algorithms)
- [Tree Traversals - GeeksforGeeks](https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/)
- [BFS vs DFS - Interview Cake](https://www.interviewcake.com/concept/java/bfs)

