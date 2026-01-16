# Lowest Common Ancestor of a Binary Search Tree

## Problem Description

Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST.

According to the definition of LCA on Wikipedia: "The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself)."

**LeetCode Problem Number:** 235

---

## Examples

### Example 1:

**Input:**
```python
root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
```

**Visual Representation:**
```
           6
         /   \
        2     8
       / \   / \
      0   4 7   9
         / \
        3   5
```

**Output:**
```python
6
```

**Explanation:** The LCA of nodes `2` and `8` is `6`. Starting from the root (6), both p=2 and q=8 are in different subtrees, so 6 is the LCA.

---

### Example 2:

**Input:**
```python
root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4
```

**Visual Representation:**
```
           6
         /   \
        2     8
       / \   / \
      0   4 7   9
         / \
        3   5
```

**Output:**
```python
2
```

**Explanation:** The LCA of nodes `2` and `4` is `2`, since a node can be a descendant of itself according to the LCA definition. Node 2 is an ancestor of node 4.

---

### Example 3:

**Input:**
```python
root = [2,1], p = 2, q = 1
```

**Visual Representation:**
```
    2
   /
  1
```

**Output:**
```python
2
```

**Explanation:** Since node 2 is an ancestor of node 1, the LCA is node 2.

---

## Constraints

- The number of nodes in the tree is in the range `[2, 10^5]`.
- `-10^9 <= Node.val <= 10^9`
- All `Node.val` are unique.
- `p != q`
- `p` and `q` will exist in the BST.

---

## Intuition

The key insight is that **Binary Search Tree (BST) properties allow us to navigate the tree efficiently based on node values**:

1. For any node, all values in the left subtree are **less than** the node's value
2. For any node, all values in the right subtree are **greater than** the node's value

This ordering property means:
- If both `p` and `q` are less than the current node's value, the LCA must be in the **left subtree**
- If both `p` and `q` are greater than the current node's value, the LCA must be in the **right subtree**
- If `p` and `q` are on different sides (or one equals the current node), the current node **is the LCA**

This is because the BST structure naturally partitions the search space, and the first node where the paths to `p` and `q` diverge is by definition the lowest common ancestor.

---

## Approach 1: Iterative Solution (Recommended)

### Algorithm
1. Start from the root node
2. While the current node is not null:
   - If both `p.val` and `q.val` are less than `current.val`, move to `current.left`
   - If both `p.val` and `q.val` are greater than `current.val`, move to `current.right`
   - Otherwise, `current` is the LCA (the split point), return it
3. Return null if no LCA found (shouldn't happen based on constraints)

### Code Implementation

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        """
        Iterative solution using BST properties.
        Time: O(h) where h is tree height
        Space: O(1) - constant extra space
        """
        current = root
        
        while current:
            if p.val < current.val and q.val < current.val:
                # Both nodes are in the left subtree
                current = current.left
            elif p.val > current.val and q.val > current.val:
                # Both nodes are in the right subtree
                current = current.right
            else:
                # Nodes are on different sides or one equals current
                # This is the LCA
                return current
        
        return None  # Should never reach here given constraints
```

### Step-by-Step Execution (Example 1: root=6, p=2, q=8)

```
Step 1: current = 6
        p.val=2 < 6 and q.val=8 > 6 → different sides → Return 6
        Result: 6

Execution trace: 6 → return
```

### Complexity Analysis
- **Time Complexity:** O(h), where h is the height of the tree
  - Balanced BST: O(log n)
  - Worst case (skewed tree): O(n)
- **Space Complexity:** O(1) - no recursion stack, constant extra space

---

## Approach 2: Recursive Solution

### Algorithm
1. Define a recursive function that takes a node and returns the LCA
2. Base case: if node is null, return null
3. Recursive cases:
   - If both p and q are less than node.val, recurse on left subtree
   - If both p and q are greater than node.val, recurse on right subtree
   - Otherwise, return the current node as LCA

### Code Implementation

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        """
        Recursive solution using BST properties.
        Time: O(h) where h is tree height
        Space: O(h) - recursion stack
        """
        # Base case: null node or found p/q
        if not root or root == p or root == q:
            return root
        
        # Both nodes are in left subtree
        if p.val < root.val and q.val < root.val:
            return self.lowestCommonAncestor(root.left, p, q)
        
        # Both nodes are in right subtree
        if p.val > root.val and q.val > root.val:
            return self.lowestCommonAncestor(root.right, p, q)
        
        # Nodes are on different sides, current is LCA
        return root
```

### Step-by-Step Execution (Example 1: root=6, p=2, q=8)

```
Call: lowestCommonAncestor(6, 2, 8)
  2 < 6 and 8 > 6 → return 6

Result: 6
```

### Complexity Analysis
- **Time Complexity:** O(h), where h is the height of the tree
- **Space Complexity:** O(h) - recursion stack space

---

## Approach 3: Path Comparison Method

### Algorithm
1. Find the path from root to node p (list of nodes)
2. Find the path from root to node q (list of nodes)
3. Compare the paths to find the last common node (LCA)

### Code Implementation

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        """
        Path comparison method.
        Time: O(h) - two passes to find paths
        Space: O(h) - storing paths
        """
        def findPath(root, target):
            """Find path from root to target node."""
            if not root:
                return []
            
            if root == target:
                return [root]
            
            # Search in left subtree
            left_path = findPath(root.left, target)
            if left_path:
                return [root] + left_path
            
            # Search in right subtree
            right_path = findPath(root.right, target)
            if right_path:
                return [root] + right_path
            
            return []
        
        path_p = findPath(root, p)
        path_q = findPath(root, q)
        
        # Find last common node in both paths
        i = 0
        while i < min(len(path_p), len(path_q)) and path_p[i] == path_q[i]:
            i += 1
        
        return path_p[i - 1] if i > 0 else None
```

### Visual Example

For tree:
```
           6
         /   \
        2     8
       / \   / \
      0   4 7   9
         / \
        3   5
```

Path to p=2: [6, 2]
Path to q=8: [6, 8]

Common prefix: [6]
Last common node: 6 (LCA)

### Complexity Analysis
- **Time Complexity:** O(h) for finding each path, O(h) for comparison → O(h)
- **Space Complexity:** O(h) for storing paths

---

## Approach 4: Single Pass with Parent Pointers

### Algorithm
1. Use a single DFS traversal from root
2. Return a tuple (found_p, found_q, lca) for each subtree
3. Combine results from left and right subtrees

### Code Implementation

```python
# Definition for a binary tree node.
# class TreeNode:
#     def __init__(self, x):
#         self.val = x
#         self.left = None
#         self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        """
        Single pass DFS that returns (found_p, found_q, lca) status.
        Time: O(h) - single traversal
        Space: O(h) - recursion stack
        """
        def dfs(node):
            if not node:
                return (False, False, None)
            
            # Check left subtree
            left_p, left_q, left_lca = dfs(node.left)
            # Check right subtree
            right_p, right_q, right_lca = dfs(node.right)
            
            # Found p or q at current node
            found_p = left_p or right_p or node == p
            found_q = left_q or right_q or node == q
            
            # If LCA found in subtrees, propagate it
            if left_lca:
                return (found_p, found_q, left_lca)
            if right_lca:
                return (found_p, found_q, right_lca)
            
            # Current node is LCA if p and q are in different subtrees
            if found_p and found_q:
                return (found_p, found_q, node)
            
            return (found_p, found_q, None)
        
        _, _, lca = dfs(root)
        return lca
```

### Complexity Analysis
- **Time Complexity:** O(h) - single traversal
- **Space Complexity:** O(h) - recursion stack

---

## Comparison of Approaches

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| Iterative | O(h) | O(1) | Simple, no recursion stack | - |
| Recursive | O(h) | O(h) | Elegant, functional style | Stack overflow risk |
| Path Comparison | O(h) | O(h) | Easy to understand | Two traversals |
| Single Pass DFS | O(h) | O(h) | Works for any binary tree | More complex |

---

## Related Problems

| # | Problem | Difficulty | Description |
|---|---------|------------|-------------|
| 1 | [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/) | Medium | LCA without BST properties |
| 2 | [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/) | Medium | Check if tree is valid BST |
| 3 | [Binary Search Tree Iterator](https://leetcode.com/problems/binary-search-tree-iterator/) | Medium | Iterator for BST |
| 4 | [Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) | Medium | Find kth smallest element |
| 5 | [Insert into a Binary Search Tree](https://leetcode.com/problems/insert-into-a-binary-search-tree/) | Medium | Insert node in BST |
| 6 | [Delete Node in a BST](https://leetcode.com/problems/delete-node-in-a-bst/) | Medium | Delete node from BST |
| 7 | [All Nodes Distance K in Binary Tree](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/) | Medium | Find nodes at distance K |
| 8 | [Search in a Binary Search Tree](https://leetcode.com/problems/search-in-a-binary-search-tree/) | Easy | Search in BST |

---

## Video Tutorials

1. **[Lowest Common Ancestor of a BST - LeetCode 235](https://www.youtube.com/watch?v=gs2LMXGzWwI)** - Back to Back SWE
2. **[LCA in Binary Search Tree](https://www.youtube.com/watch?v=uwE16FJbvT8)** - Tushar Roy
3. **[Binary Search Tree - LCA](https://www.youtube.com/watch?v=5cU0O3W6qwY)** - GeeksforGeeks
4. **[Lowest Common Ancestor Explained](https://www.youtube.com/watch?v=FG_5R16x120)** - Nick White

---

## Follow-up Questions

### 1. How is this different from LCA in a regular binary tree?

In a regular binary tree, we cannot use value comparisons to navigate. We must use a recursive approach that searches both subtrees and checks if p/q are found in different subtrees. For BST, we can directly navigate based on values, making it O(h) vs O(n).

---

### 2. Can we solve this without comparing node values?

Yes! Use the general binary tree approach:
- Search both subtrees for p and q
- If both are found in different subtrees, current is LCA
- Otherwise, propagate the found node up

This works for any binary tree but is less efficient for BST.

---

### 3. How to find LCA if p and q are not guaranteed to exist?

Add null checks and handle the case where one path doesn't exist:
```python
def findPath(root, target):
    if not root:
        return []
    if root == target:
        return [root]
    left = findPath(root.left, target)
    if left:
        return [root] + left
    right = findPath(root.right, target)
    if right:
        return [root] + right
    return []
```

Then check if both paths are non-empty before finding LCA.

---

### 4. How to find LCA when we can only access nodes via their values (not references)?

Modify the algorithm to use value comparison:
```python
def lowestCommonAncestorByValue(root, p_val, q_val):
    current = root
    while current:
        if p_val < current.val and q_val < current.val:
            current = current.left
        elif p_val > current.val and q_val > current.val:
            current = current.right
        else:
            return current
    return None
```

---

### 5. How to find the distance between two nodes in a BST?

Distance = depth(p) + depth(q) - 2 * depth(LCA)

Find depth by traversing from root to the node, then use the LCA to compute distance.

---

### 6. How to find LCA in a BST with parent pointers?

1. Move up from p and q to find their depths
2. Bring both to same depth
3. Move up together until they meet (LCA)

Time: O(h), Space: O(1)

---

### 7. Can Morris traversal be used here?

Morris traversal modifies the tree temporarily. For LCA, we need to preserve the tree structure, so Morris traversal is not recommended. The iterative approach is already O(1) space.

---

### 8. How to find Kth ancestor of a node in BST?

Starting from the node, move up k times using parent pointers or find the node from root and count steps. Time: O(h) with parent pointers.

---

### 9. How to find LCA if the tree has duplicate values?

BST typically requires unique values. If duplicates exist, decide on convention (e.g., left <= root < right) and adjust navigation accordingly.

---

### 10. How to verify if a node is an ancestor of another in BST?

Node A is ancestor of B if:
- B is in A's left subtree (B.val < A.val and search succeeds)
- OR B is in A's right subtree (B.val > A.val and search succeeds)

Time: O(h)

---

## References

- [LeetCode 235 - Lowest Common Ancestor of a Binary Search Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)
- [CLRS Introduction to Algorithms, Chapter 12](https://en.wikipedia.org/wiki/Binary_search_tree)
- [Wikipedia - Lowest Common Ancestor](https://en.wikipedia.org/wiki/Lowest_common_ancestor)

