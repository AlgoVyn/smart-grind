# Lowest Common Ancestor Of A Binary Tree

## Problem Description

Given a binary tree, find the lowest common ancestor (LCA) of two given nodes in the tree.

According to the definition of LCA on Wikipedia: "The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where we allow a node to be a descendant of itself)."

---

## Examples

### Example 1:

**Input:** `root = [3,5,1,6,2,0,8,null,null,7,4]`, `p = 5`, `q = 1`

**Output:** `3`

**Explanation:** The LCA of nodes `5` and `1` is `3`.

```
        3
       / \
      5   1
     / \ / \
    6  2 0  8
      / \
     7   4
```

### Example 2:

**Input:** `root = [3,5,1,6,2,0,8,null,null,7,4]`, `p = 5`, `q = 4`

**Output:** `5`

**Explanation:** The LCA of nodes `5` and `4` is `5`, since a node can be a descendant of itself according to the LCA definition.

```
        3
       / \
      5   1
     / \ / \
    6  2 0  8
      / \
     7   4
```

### Example 3:

**Input:** `root = [1,2]`, `p = 1`, `q = 2`

**Output:** `1`

---

## Constraints

- The number of nodes in the tree is in the range `[2, 10^5]`.
- `-10^9 <= Node.val <= 10^9`
- All `Node.val` are unique.
- `p != q`
- `p` and `q` will exist in the tree.

---

## Intuition

The key insight is that for any node in the tree, if both `p` and `q` are in its subtree, then that node could be a common ancestor. The **lowest** such node is our answer.

When traversing the tree:
1. If we find `p` or `q`, we return that node.
2. If we find both in different subtrees of a node, that node is the LCA.
3. If we find only one, we propagate it up (it's in the path to the LCA).

---

## Approaches

### Approach 1: Recursive DFS (Recommended)

This is the most intuitive and efficient approach. We use post-order traversal to check both subtrees.

```python
# Definition for a binary tree node.
class TreeNode:
    def __init__(self, x):
        self.val = x
        self.left = None
        self.right = None

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        # Base case: if root is null or matches p or q
        if not root or root == p or root == q:
            return root
        
        # Recurse on left and right subtrees
        left = self.lowestCommonAncestor(root.left, p, q)
        right = self.lowestCommonAncestor(root.right, p, q)
        
        # If both left and right are non-null, root is LCA
        if left and right:
            return root
        
        # Otherwise, return the non-null one (or None)
        return left or right
```

**Why this works:**
- Post-order traversal ensures we check children before the parent.
- If both subtrees return non-null, `p` and `q` are found in different subtrees → current node is LCA.
- If only one subtree returns non-null, the LCA is in that subtree.

### Approach 2: Iterative with Parent Pointers

For cases where recursion depth is a concern, we can use an iterative approach with parent pointers.

```python
from collections import defaultdict, deque

class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        if not root:
            return None
        
        # Build parent pointers using BFS
        parent = {root: None}
        queue = deque([root])
        
        # Find both nodes
        while p not in parent or q not in parent:
            node = queue.popleft()
            if node.left:
                parent[node.left] = node
                queue.append(node.left)
            if node.right:
                parent[node.right] = node
                queue.append(node.right)
        
        # Collect ancestors of p
        ancestors = set()
        while p:
            ancestors.add(p)
            p = parent[p]
        
        # Find first common ancestor in q's path
        while q not in ancestors:
            q = parent[q]
        
        return q
```

**Why this works:**
1. First, we build a parent pointer map by traversing the tree.
2. We trace all ancestors of `p` and store them in a set.
3. We then trace ancestors of `q` until we find one that's in `p`'s ancestor set.

### Approach 3: Two Pointer Approach (O(1) Extra Space with Parent Pointers)

Once we have parent pointers available, we can find the LCA using a two-pointer technique similar to finding the intersection of two linked lists. This approach achieves O(1) extra space by avoiding the use of a set.

```python
class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        if not root:
            return None
        
        # Step 1: Build parent pointers using BFS
        parent = {root: None}
        queue = [root]
        while p not in parent or q not in parent:
            node = queue.pop(0)
            if node.left:
                parent[node.left] = node
                queue.append(node.left)
            if node.right:
                parent[node.right] = node
                queue.append(node.right)
        
        # Step 2: Two-pointer technique to find LCA
        # Get depths of p and q from root
        depth_p, depth_q = 0, 0
        temp = p
        while temp:
            depth_p += 1
            temp = parent[temp]
        
        temp = q
        while temp:
            depth_q += 1
            temp = parent[temp]
        
        # Step 3: Equalize depths by moving up the deeper node
        while depth_p > depth_q:
            p = parent[p]
            depth_p -= 1
        while depth_q > depth_p:
            q = parent[q]
            depth_q -= 1
        
        # Step 4: Move both pointers up together until they meet
        while p != q:
            p = parent[p]
            q = parent[q]
        
        return p
```

**Even More Optimized Version (Single Pass for Depth Calculation):**

```python
class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        if not root:
            return None
        
        # Build parent pointers
        parent = {root: None}
        queue = [root]
        while p not in parent or q not in parent:
            node = queue.pop(0)
            if node.left:
                parent[node.left] = node
                queue.append(node.left)
            if node.right:
                parent[node.right] = node
                queue.append(node.right)
        
        # Calculate depths
        def get_depth(node):
            depth = 0
            while node:
                depth += 1
                node = parent[node]
            return depth
        
        depth_p, depth_q = get_depth(p), get_depth(q)
        
        # Equalize depths
        while depth_p > depth_q:
            p = parent[p]
            depth_p -= 1
        while depth_q > depth_p:
            q = parent[q]
            depth_q -= 1
        
        # Find intersection
        while p != q:
            p = parent[p]
            q = parent[q]
        
        return p
```

**Why this works (Two-Pointer Technique):**
1. **Depth Equalization:** By moving the deeper node up to the same depth as the shallower node, we ensure both pointers are at the same level from the root.
2. **Synchronous Movement:** By moving both pointers up one level at a time, we're essentially finding the first common node in their ancestor chains.
3. **O(1) Space:** Unlike the set-based approach, we don't store all ancestors - we just use two pointers.
4. **Analogy to Linked Lists:** This is identical to finding the intersection of two linked lists where the "tails" are the root of the tree.

**Key Insight:** Once we have parent pointers, the path from any node to the root forms a linked list. Finding the LCA is equivalent to finding the intersection of two linked lists.

### Approach 4: Single Pass with Early Termination

An optimized version that stops early once both nodes are found.

```python
class Solution:
    def lowestCommonAncestor(self, root: 'TreeNode', p: 'TreeNode', q: 'TreeNode') -> 'TreeNode':
        self.found = 0
        
        def dfs(node):
            if not node:
                return None
            
            left = dfs(node.left)
            right = dfs(node.right)
            
            mid = None
            if node == p or node == q:
                mid = node
                self.found += 1
            
            # Count found nodes
            found_count = (1 if mid else 0) + (1 if left else 0) + (1 if right else 0)
            
            # If two nodes are found, this is the LCA
            if found_count == 2:
                if mid:
                    return mid
                return node
            
            return mid or left or right
        
        result = dfs(root)
        # If we found both nodes, return result; else return None
        return result if self.found == 2 else None
```

---

## Explanation

### Recursive Approach Deep Dive

1. **Base Case:** If the current node is `None`, or it matches `p` or `q`, return it immediately.

2. **Recursive Calls:** We recursively search both left and right subtrees.

3. **LCA Detection:** 
   - If both recursive calls return non-null values, it means `p` was found in one subtree and `q` in the other.
   - The current node is therefore the lowest common ancestor.

4. **Propagation:** If only one side returns non-null, we propagate that result upward (the LCA must be in that subtree).

### Iterative Approach Deep Dive

1. **Parent Map:** We first traverse the tree (BFS) to build a mapping of each node to its parent.

2. **Ancestor Set:** We collect all ancestors of `p` in a set for O(1) lookup.

3. **Search:** We walk up from `q` to its ancestors, checking against the set. The first match is the LCA.

---

## Time Complexity Analysis

| Approach | Time Complexity | Space Complexity | Notes |
|----------|-----------------|------------------|-------|
| Recursive DFS | O(n) | O(h) | h = tree height (recursion stack) |
| Iterative with Parent Pointers (Set) | O(n) | O(n) | Uses set for ancestor lookup |
| Two Pointer Approach | O(n) | O(n) | Parent map + O(1) for two pointers |
| Single Pass Early Termination | O(n) | O(h) | Can terminate early |

- **Best Case:** O(h) when nodes are close to each other
- **Worst Case:** O(n) when tree is skewed or nodes are far apart

---

## Space Complexity Analysis

- **Recursive:** O(h) due to recursion stack, where h is the height of the tree
  - Balanced tree: O(log n)
  - Skewed tree: O(n)
- **Iterative (Parent Map with Set):** O(n) for storing parent pointers + O(n) for set
- **Two Pointer Approach:** O(n) for storing parent pointers (two pointers use O(1) space)

---

## Related Problems

| Problem | Difficulty | Connection |
|---------|------------|------------|
| [Lowest Common Ancestor of a Binary Search Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/) | Easy | LCA with BST properties |
| [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/) | Medium | BST validation |
| [All Nodes Distance K in Binary Tree](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/) | Medium | Tree distance queries |
| [Diameter of Binary Tree](https://leetcode.com/problems/diameter-of-binary-tree/) | Easy | Tree traversal pattern |
| [Smallest Common Region](https://leetcode.com/problems/smallest-common-region/) | Medium | LCA in tree hierarchies |

---

## Video Tutorial Links

- [NeetCode - Lowest Common Ancestor of a Binary Tree](https://www.youtube.com/watch?v=nn2T_7f7uD4)
- [Back To Back SWE - Lowest Common Ancestor](https://www.youtube.com/watch?v=py3R_T2aBCc)
- [LeetCode Official Solution](https://www.youtube.com/watch?v=p1hIY-HM7sQ)
- [CodeBreak - Binary Tree LCA](https://www.youtube.com/watch?v=13m9Z-4OAi8)

---

## Follow-up Questions

1. **How would you modify the solution if the tree nodes don't have parent pointers and you can't modify the tree structure?**

   **Answer:** Use the recursive DFS approach (Approach 1) which doesn't require parent pointers. It traverses the tree and returns nodes found, combining results from left and right subtrees to identify the LCA.

2. **How would you find the LCA if you need to find the lowest common ancestor for K nodes instead of 2?**

   **Answer:** Modify the recursive approach to count how many target nodes are found in each subtree. Return the node when count == K. Alternatively, find LCA of first two nodes, then find LCA of result with third node iteratively (LCA is associative: LCA(LCA(a,b),c) = LCA(a,b,c)).

3. **What changes would you make to handle the case where p or q might not exist in the tree?**

   **Answer:** Check if both nodes are found during traversal. In recursive approach, track a "found" counter. In iterative approach, check if we reached None before finding both. Return None if not all nodes exist.

4. **How would you optimize the recursive solution for a balanced vs skewed tree?**

   **Answer:** For balanced trees, recursion depth is O(log n) - no special optimization needed. For skewed trees, convert to iterative approach or use tail recursion optimization. Consider using explicit stack to avoid stack overflow.

5. **Can you implement an iterative solution using DFS instead of BFS?**

   **Answer:** Yes, use a stack for DFS traversal to build parent pointers. The algorithm remains the same - just replace queue with stack and use pop() instead of popleft().

6. **How would you modify the solution to return the path from root to LCA instead of just the LCA node?**

   **Answer:** Store the path during traversal. In recursive approach, pass a path list and backtrack. When LCA is found, return the current path. Or build path using parent pointers after finding LCA.

7. **What is the difference between LCA in a binary tree vs a binary search tree? How can you optimize for BST?**

   **Answer:** In BST, we can use value comparisons to decide which subtree to search. Start from root, if both values < root.val, search left; if both >, search right; else current node is LCA. This is O(h) time with O(1) space.

8. **Explain the two-pointer approach for finding LCA. How is it similar to finding the intersection of two linked lists?**

   **Answer:** After equalizing depths, move both pointers up synchronously. The first meeting point is the LCA. This is identical to the linked list intersection algorithm: equalize lengths, then traverse together until pointers meet.

9. **How can you achieve O(1) extra space (excluding the tree itself) for finding LCA using the two-pointer technique?**

   **Answer:** The two-pointer part itself uses O(1) space. We only use two pointers that move up parent pointers. The parent map takes O(n) space, but the actual LCA finding logic uses constant extra space.

10. **If you know the depths of p and q from the root, how can you efficiently find the LCA without using a set?**

    **Answer:** Equalize depths by moving up the deeper node, then move both up synchronously until they meet. The first common node is the LCA. This is the two-pointer approach and uses O(1) extra space.

11. **Compare the set-based approach vs the two-pointer approach. What are the trade-offs in terms of time and space complexity?**

    **Answer:** Both are O(n) time. Set-based uses O(n) space for the set, while two-pointer uses O(1) for the search phase (but still needs O(n) for parent map). Two-pointer is more memory-efficient for the actual LCA finding step.

---

## References

- [LeetCode 235 - Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/)
- [CLRS Introduction to Algorithms, Chapter 12](https://en.wikipedia.org/wiki/Binary_search_tree)
- [Wikipedia - Lowest Common Ancestor](https://en.wikipedia.org/wiki/Lowest_common_ancestor)

