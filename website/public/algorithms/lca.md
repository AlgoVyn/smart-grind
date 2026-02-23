# Lowest Common Ancestor

## Category
Trees & BSTs

## Description
Find the lowest common ancestor of two nodes in a binary tree.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- trees & bsts related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Steps
1. Understand the problem constraints and requirements
2. Identify the input and expected output
3. Apply the core algorithm logic
4. Handle edge cases appropriately
5. Optimize for the given constraints

---

## Algorithm Explanation

The Lowest Common Ancestor (LCA) of two nodes in a binary tree is the deepest node that has both nodes as descendants (where a node is also a descendant of itself).

**Key Insight:** The LCA is where the paths from root to each target node diverge.

**Approach 1: Recursive (Simple)**
- Recurse down the tree
- If current node is one of the targets, return it
- If both left and right recursion return non-null, current node is LCA
- Otherwise, return whichever is non-null

**Approach 2: Path Comparison**
- Find path from root to each target node
- LCA is the last common node in both paths
- O(n) time, O(h) space

**Approach 3: Parent Pointers + HashSet**
- Go up from one node using parent pointers
- Check if ancestor exists in other node's ancestor set
- O(n) time, O(h) space

**Special Case - BST:** For Binary Search Trees, we can use the BST property:
- If both nodes are less than current, go left
- If both are greater, go right
- Otherwise, this is the LCA

---

## Implementation

```python
class TreeNode:
    """Definition for a binary tree node."""
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def lowest_common_ancestor(root, p, q):
    """
    Find the lowest common ancestor of two nodes in a binary tree.
    
    Args:
        root: Root of the binary tree
        p: First node
        q: Second node
        
    Returns:
        LCA node
        
    Time: O(n)
    Space: O(h)
    """
    # Base case: reached end or found one of the nodes
    if not root or root == p or root == q:
        return root
    
    # Recurse on left and right
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    
    # If both sides return non-null, current is LCA
    if left and right:
        return root
    
    # Return whichever is non-null
    return left or right


# Alternative: Using parent pointers
def lca_with_parent(p, q):
    """
    Find LCA assuming nodes have parent pointers.
    Uses O(h) space for ancestors set.
    """
    ancestors = set()
    
    # Collect all ancestors of p
    while p:
        ancestors.add(p)
        p = p.parent
    
    # Find first ancestor of q that's also in p's ancestors
    while q:
        if q in ancestors:
            return q
        q = q.parent
    
    return None


# For Binary Search Trees
def lowest_common_ancestor_bst(root, p, q):
    """
    Find LCA in a Binary Search Tree using BST property.
    More efficient - O(h) time.
    """
    if not root or not p or not q:
        return None
    
    # Both nodes are in left subtree
    if p.val < root.val and q.val < root.val:
        return lowest_common_ancestor_bst(root.left, p, q)
    
    # Both nodes are in right subtree
    if p.val > root.val and q.val > root.val:
        return lowest_common_ancestor_bst(root.right, p, q)
    
    # Nodes are on different sides - this is the LCA
    return root
```

```javascript
function lca() {
    // Lowest Common Ancestor implementation
    // Time: O(n)
    // Space: O(h)
}
```

---

## Example

**Input:**
```
Tree:
        3
       / \
      5   1
     / \ / \
    6  2 0  8
      / \
     7   4

p = 5, q = 1
```

**Output:**
```
3
```

**Explanation:**
- Path from root to 5: 3 → 5
- Path from root to 1: 3 → 1
- Common ancestors: {3}
- Lowest (deepest) = 3

**Additional Examples:**
```
Tree:
        3
       / \
      5   1
     / \
    6   2
         \
          4

p = 5, q = 4
Output: 5

Explanation: 5 is ancestor of 4, so LCA is 5

p = 6, q = 4
Output: 5

Paths: 3→5→6 and 3→5→2→4, diverge at 5
```

---

## Time Complexity
**O(n)**

---

## Space Complexity
**O(h)**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
