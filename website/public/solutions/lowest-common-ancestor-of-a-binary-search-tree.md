# Lowest Common Ancestor of a Binary Search Tree

## Problem Description

Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes in the BST. According to the definition of LCA on Wikipedia: "The lowest common ancestor is defined between two nodes p and q as the lowest node in the tree that has both p and q as descendants (where we allow a node to be a descendant of itself)."

In a Binary Search Tree:
- All values in the left subtree of a node are less than the node's value
- All values in the right subtree of a node are greater than the node's value
- Both left and right subtrees are also binary search trees

This property makes finding the LCA more efficient compared to a regular binary tree, as we can use the values to guide our search direction.

---

## Constraints

- The number of nodes in the tree is in the range [2, 10^4]
- -10^9 <= Node.val <= 10^9
- All Node.val are unique
- p and q are guaranteed to exist in the BST
- p.val ≠ q.val (though this is not explicitly stated, it's implied by "unique" values)

---

## Example 1

**Input:**
```python
root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4
```

**Output:**
```python
4
```

**Visual:**
```
        6
       / \
      2   8
     / \ / \
    0  4 7 9
      / \
     3   5
```

**Explanation:**
- Node 2 and Node 4 are both descendants of Node 4
- Node 4 is the lowest node that has both as descendants
- Therefore, the LCA is 4

---

## Example 2

**Input:**
```python
root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8
```

**Output:**
```python
6
```

**Visual:**
```
        6
       / \
      2   8
     / \ / \
    0  4 7 9
      / \
     3   5
```

**Explanation:**
- Node 2 is in the left subtree of 6
- Node 8 is in the right subtree of 6
- Since p and q diverge at the root, 6 is the LCA

---

## Example 3

**Input:**
```python
root = [2,1], p = 2, q = 1
```

**Output:**
```python
2
```

**Visual:**
```
    2
   /
  1
```

**Explanation:**
- Node 2 is an ancestor of Node 1
- When one node is an ancestor of the other, the ancestor is the LCA
- Therefore, the LCA is 2

---

## Solution

We use three approaches to solve this problem:

1. **Recursive Approach** - Most intuitive, leverages BST properties
2. **Iterative Approach** - Uses a while loop without recursion
3. **Parent Pointer Approach** - Builds parent references and finds intersection

---

## Approach 1: Recursive Approach

### Algorithm

The recursive approach leverages the BST property to efficiently search for the LCA:

1. **Base Case**: If root is null, return null (no LCA found)
2. **Check if both nodes are in left subtree**: If both p.val and q.val are less than root.val, recursively search in the left subtree
3. **Check if both nodes are in right subtree**: If both p.val and q.val are greater than root.val, recursively search in the right subtree
4. **Found LCA**: If one node is on the left and one is on the right (or one equals root), then root is the LCA
5. **Return the found node**: The first non-null return from recursive calls is the LCA

### Code Implementation

````carousel
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
        Find the lowest common ancestor of two nodes in a BST.
        
        Args:
            root: Root node of the BST
            p: First node
            q: Second node
            
        Returns:
            Lowest Common Ancestor node
        """
        # Base case: if root is null or matches p or q, return root
        if not root or root == p or root == q:
            return root
        
        # If both p and q are in the left subtree, search left
        if p.val < root.val and q.val < root.val:
            return self.lowestCommonAncestor(root.left, p, q)
        
        # If both p and q are in the right subtree, search right
        if p.val > root.val and q.val > root.val:
            return self.lowestCommonAncestor(root.right, p, q)
        
        # One node in left, one in right (or one equals root) - found LCA
        return root
```

<!-- slide -->
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */

class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        // Base case: if root is null or matches p or q, return root
        if (!root || root == p || root == q) {
            return root;
        }
        
        // If both p and q are in the left subtree, search left
        if (p->val < root->val && q->val < root->val) {
            return lowestCommonAncestor(root->left, p, q);
        }
        
        // If both p and q are in the right subtree, search right
        if (p->val > root->val && q->val > root->val) {
            return lowestCommonAncestor(root->right, p, q);
        }
        
        // One node in left, one in right - found LCA
        return root;
    }
};
```

<!-- slide -->
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */

class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // Base case: if root is null or matches p or q, return root
        if (root == null || root == p || root == q) {
            return root;
        }
        
        // If both p and q are in the left subtree, search left
        if (p.val < root.val && q.val < root.val) {
            return lowestCommonAncestor(root.left, p, q);
        }
        
        // If both p and q are in the right subtree, search right
        if (p.val > root.val && q.val > root.val) {
            return lowestCommonAncestor(root.right, p, q);
        }
        
        // One node in left, one in right - found LCA
        return root;
    }
}
```

<!-- slide -->
```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function(root, p, q) {
    // Base case: if root is null or matches p or q, return root
    if (!root || root === p || root === q) {
        return root;
    }
    
    // If both p and q are in the left subtree, search left
    if (p.val < root.val && q.val < root.val) {
        return lowestCommonAncestor(root.left, p, q);
    }
    
    // If both p and q are in the right subtree, search right
    if (p.val > root.val && q.val > root.val) {
        return lowestCommonAncestor(root.right, p, q);
    }
    
    // One node in left, one in right - found LCA
    return root;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(h) - Where h is the height of the tree. In the worst case (skewed tree), h = O(n). In the average case (balanced tree), h = O(log n) |
| **Space** | O(h) - Recursion stack depth equals tree height |

---

## Approach 2: Iterative Approach

### Algorithm

The iterative approach uses a while loop to traverse the tree without recursion:

1. Start at the root
2. While root is not null:
   - If both p and q are less than root.val, move left
   - If both p and q are greater than root.val, move right
   - Otherwise, root is the LCA (one in left, one in right, or root equals one of them)
3. Return the found LCA

### Code Implementation

````carousel
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
        Find the lowest common ancestor of two nodes in a BST using iteration.
        
        Args:
            root: Root node of the BST
            p: First node
            q: Second node
            
        Returns:
            Lowest Common Ancestor node
        """
        # Traverse from root until we find the LCA
        while root:
            # Both nodes are in left subtree
            if p.val < root.val and q.val < root.val:
                root = root.left
            # Both nodes are in right subtree
            elif p.val > root.val and q.val > root.val:
                root = root.right
            # Found LCA: nodes are in different subtrees or one equals root
            else:
                return root
        
        return None  # Should never reach here as p and q are guaranteed to exist
```

<!-- slide -->
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */

class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        // Traverse from root until we find the LCA
        while (root) {
            // Both nodes are in left subtree
            if (p->val < root->val && q->val < root->val) {
                root = root->left;
            }
            // Both nodes are in right subtree
            else if (p->val > root->val && q->val > root->val) {
                root = root->right;
            }
            // Found LCA
            else {
                return root;
            }
        }
        return nullptr;
    }
};
```

<!-- slide -->
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */

class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // Traverse from root until we find the LCA
        while (root != null) {
            // Both nodes are in left subtree
            if (p.val < root.val && q.val < root.val) {
                root = root.left;
            }
            // Both nodes are in right subtree
            else if (p.val > root.val && q.val > root.val) {
                root = root.right;
            }
            // Found LCA
            else {
                return root;
            }
        }
        return null;
    }
}
```

<!-- slide -->
```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function(root, p, q) {
    // Traverse from root until we find the LCA
    while (root) {
        // Both nodes are in left subtree
        if (p.val < root.val && q.val < root.val) {
            root = root.left;
        }
        // Both nodes are in right subtree
        else if (p.val > root.val && q.val > root.val) {
            root = root.right;
        }
        // Found LCA
        else {
            return root;
        }
    }
    return null;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(h) - Same as recursive, each step moves one level down |
| **Space** | O(1) - No recursion stack, constant extra space |

---

## Approach 3: Parent Pointer Approach

### Algorithm

This approach builds parent references and then finds the intersection of paths from p and q to the root:

1. **Build parent map**: Create a hash map/dictionary that maps each node to its parent
2. **Find path from p to root**: Create a set of all ancestors of p
3. **Find first common ancestor**: Traverse from q upward, checking if each ancestor is in p's ancestor set
4. **Return first match**: The first ancestor of q that appears in p's ancestor set is the LCA

### Code Implementation

````carousel
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
        Find the lowest common ancestor using parent pointers.
        
        Args:
            root: Root node of the BST
            p: First node
            q: Second node
            
        Returns:
            Lowest Common Ancestor node
        """
        # Edge case
        if not root:
            return None
        
        # Step 1: Build parent pointers
        parents = {root: None}
        current = root
        
        # Find p and q while building parent map
        while parents.get(p) is None and parents.get(q) is None:
            if p.val < current.val:
                if current.left:
                    parents[current.left] = current
                    current = current.left
            else:
                if current.right:
                    parents[current.right] = current
                    current = current.right
            
            if q.val < current.val:
                if current.left:
                    parents[current.left] = current
                    current = current.left
            else:
                if current.right:
                    parents[current.right] = current
                    current = current.right
        
        # Step 2: Collect all ancestors of p
        ancestors = set()
        while p:
            ancestors.add(p)
            p = parents[p]
        
        # Step 3: Find first common ancestor
        while q not in ancestors:
            q = parents[q]
        
        return q
```

<!-- slide -->
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */

class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if (!root) return nullptr;
        
        // Use two pointers to traverse
        TreeNode* cur = root;
        while (cur) {
            if (p->val < cur->val && q->val < cur->val) {
                cur = cur->left;
            } else if (p->val > cur->val && q->val > cur->val) {
                cur = cur->right;
            } else {
                return cur;
            }
        }
        return nullptr;
    }
};
```

<!-- slide -->
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */

class Solution {
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null) return null;
        
        TreeNode cur = root;
        while (cur != null) {
            if (p.val < cur.val && q.val < cur.val) {
                cur = cur.left;
            } else if (p.val > cur.val && q.val > cur.val) {
                cur = cur.right;
            } else {
                return cur;
            }
        }
        return null;
    }
}
```

<!-- slide -->
```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

/**
 * @param {TreeNode} root
 * @param {TreeNode} p
 * @param {TreeNode} q
 * @return {TreeNode}
 */
var lowestCommonAncestor = function(root, p, q) {
    if (!root) return null;
    
    let cur = root;
    while (cur) {
        if (p.val < cur.val && q.val < cur.val) {
            cur = cur.left;
        } else if (p.val > cur.val && q.val > cur.val) {
            cur = cur.right;
        } else {
            return cur;
        }
    }
    return null;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(h) - Building parent map takes O(h), finding ancestors takes O(h) |
| **Space** | O(h) - Hash map/ancestors set stores up to h nodes |

---

## Comparison of Approaches

| Aspect | Recursive | Iterative | Parent Pointer |
|--------|------------|-----------|----------------|
| **Time Complexity** | O(h) | O(h) | O(h) |
| **Space Complexity** | O(h) | O(1) | O(h) |
| **Implementation** | Simple, elegant | Simple | More complex |
| **Code Readability** | High | High | Medium |
| **Stack Overflow Risk** | Yes | No | No |
| **Additional Data Structures** | None | None | Hash map/set |
| **Best For** | General understanding, balanced trees | Production code, deep trees | When parent pointers are pre-built |

**Where:**
- n = number of nodes
- h = height of tree (can be O(n) for skewed tree, O(log n) for balanced tree)

---

## Explanation

### Why BST Properties Matter

The key insight that makes this problem easier for BSTs compared to regular binary trees is the **search space reduction**:

1. **Regular Binary Tree**: You might need to search both left and right subtrees completely
2. **BST**: You can eliminate half the tree at each step based on values

### The Three Cases

When comparing p.val and q.val with root.val:

1. **Both in left subtree** (p.val < root.val AND q.val < root.val): The LCA must be in the left subtree
2. **Both in right subtree** (p.val > root.val AND q.val > root.val): The LCA must be in the right subtree
3. **Split across subtrees** (one < root.val, one > root.val OR one equals root): Current root is the LCA

### Why This Works

The algorithm works because:

1. **Ancestor Property**: If both nodes are in the left subtree, any common ancestor must also be in the left subtree
2. **First Common Ancestor**: The first node where the search paths diverge (or one path ends) is the LCA
3. **Early Termination**: Unlike regular binary trees, we can determine the direction immediately without searching both sides

### Recursive vs Iterative

Both approaches are functionally equivalent:
- **Recursive**: More intuitive, follows the mathematical definition naturally
- **Iterative**: More memory-efficient, no stack overflow risk for deep trees
- **Parent Pointer**: Useful when you need to answer multiple LCA queries (preprocessing helps)

---

## Followup Questions

### Q1: How would you find the LCA in a regular binary tree (not BST)?

**Answer:** In a regular binary tree without BST properties, you need a different approach:
- Method 1: Find paths from root to p and root to q, then find the last common node
- Method 2: Use a post-order traversal that returns the LCA when found
- The regular approach uses recursion that checks if either child subtree contains both nodes

### Q2: How would you modify the solution if nodes can have duplicate values?

**Answer:** With duplicates, you need to change the comparison logic:
- Use ≤ instead of < for one side to handle duplicates consistently
- Or use < for left and ≤ for right (or vice versa) to define a total ordering
- The key is to establish a consistent rule for which subtree a duplicate belongs to

### Q3: How would you find the k-th ancestor of a node in a BST?

**Answer:** You can:
1. First find the path from root to the node
2. Then move up k steps using parent pointers (if available)
3. Or use the iterative approach to navigate upward k times
4. Without parent pointers, you might need to store the path during search

### Q4: How would you find the distance between two nodes in a BST?

**Answer:** Distance between two nodes = distance(root to p) + distance(root to q) - 2 × distance(root to LCA):
1. Find LCA using any approach above
2. Find depth of LCA
3. Find depths of p and q
4. Calculate: depth(p) + depth(q) - 2 × depth(LCA)

### Q5: How would you find all nodes that are common ancestors of p and q?

**Answer:** You can modify the solution to collect all nodes on the path from root to the first LCA found:
1. Find the first LCA using the standard algorithm
2. Then traverse from root to this LCA, collecting all nodes
3. All nodes on this path are common ancestors, with the LCA being the lowest

### Q6: What if p and q are not guaranteed to exist in the tree?

**Answer:** You would need to add validation:
1. Before returning, verify both nodes were actually found
2. Add a check to ensure the returned LCA is not null
3. Consider returning a special value or throwing an exception if nodes don't exist

### Q7: How would you solve this problem if you could only use O(1) extra space (no recursion, no hash maps)?

**Answer:** This is challenging but possible:
1. You could first find the depths of p and q using the iterative approach
2. Then move the deeper node up until both are at the same depth
3. Then move both up simultaneously until they meet
4. This approach uses O(1) space but requires knowing p and q's depths first

---

## Related Problems

- [Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/) - General binary tree version
- [Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) - Uses BST traversal
- [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/) - BST validation
- [Inorder Successor in BST](https://leetcode.com/problems/inorder-successor-in-bst/) - BST navigation
- [Two Sum IV - Input is a BST](https://leetcode.com/problems/two-sum-iv-input-is-a-bst/) - BST problem
- [Closest BST Value](https://leetcode.com/problems/closest-binary-search-tree-value/) - BST search
- [Find Mode in Binary Search Tree](https://leetcode.com/problems/find-mode-in-binary-search-tree/) - BST traversal

---

## Video Tutorials

- [Lowest Common Ancestor of a BST - LeetCode 235](https://www.youtube.com/watch?v=uwZ8YjFDMlY)
- [Binary Search Tree Explained](https://www.youtube.com/watch?v=9p9kd0eKy0E)
- [Tree Algorithms - Common Patterns](https://www.youtube.com/watch?v=7jcn63Mh9E0)
- [Recursion vs Iteration](https://www.youtube.com/watch?v=8B2B3M6R5U8)
