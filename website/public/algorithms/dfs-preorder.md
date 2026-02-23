# DFS Preorder

## Category
Trees & BSTs

## Description
Traverse tree in root-left-right order.

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

DFS Preorder traversal is a depth-first traversal strategy where nodes are visited in "Root-Left-Right" order. This means:
1. First visit the root node
2. Then recursively traverse the left subtree
3. Finally recursively traverse the right subtree

**Why Preorder?** The name comes from the fact that the root is processed before its children (pre = before).

**Applications:**
- Creating a copy of a tree (serialization)
- Getting prefix expressions in expression trees
- Preorder traversal is used in HTML/DOM tree traversal
- Used in file system operations

**Implementation Approaches:**
1. **Recursive**: Most intuitive - uses call stack
2. **Iterative**: Uses explicit stack - useful for very deep trees to avoid stack overflow

**Key Distinction from other DFS orders:**
- Preorder: Root → Left → Right
- Inorder: Left → Root → Right (for BST gives sorted order)
- Postorder: Left → Right → Root (useful for deleting trees)

---

## Implementation

```python
class TreeNode:
    """Definition for a binary tree node."""
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def preorder(root):
    """
    Perform preorder (root-left-right) traversal of binary tree.
    
    Args:
        root: Root node of the binary tree
        
    Returns:
        List of node values in preorder
        
    Time: O(n)
    Space: O(h) where h is height of tree
    """
    result = []
    
    def traverse(node):
        if not node:
            return
        # Visit root first
        result.append(node.val)
        # Then traverse left subtree
        traverse(node.left)
        # Then traverse right subtree
        traverse(node.right)
    
    traverse(root)
    return result


# Iterative implementation using stack
def preorder_iterative(root):
    """Iterative preorder traversal using explicit stack."""
    if not root:
        return []
    
    result = []
    stack = [root]
    
    while stack:
        node = stack.pop()
        result.append(node.val)
        
        # Push right first so left is processed first (LIFO)
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    
    return result


# Morris Preorder - O(1) space
def preorder_morris(root):
    """Morris preorder traversal - O(1) space without recursion/stack."""
    result = []
    current = root
    
    while current:
        if not current.left:
            result.append(current.val)
            current = current.right
        else:
            # Find inorder predecessor
            predecessor = current.left
            while predecessor.right and predecessor.right != current:
                predecessor = predecessor.right
            
            if not predecessor.right:
                # Create temporary thread
                result.append(current.val)  # Visit root
                predecessor.right = current
                current = current.left
            else:
                # Restore tree and move to right
                predecessor.right = None
                current = current.right
    
    return result
```

```javascript
function dfsPreorder() {
    // DFS Preorder implementation
    // Time: O(n)
    // Space: O(h) where h is height
}
```

---

## Example

**Input:**
```
Tree:
    1
   / \
  2   3
 / \
4   5
```

**Output:**
```
[1, 2, 4, 5, 3]
```

**Explanation:**
- Visit 1 (root)
- Go left to 2
- Visit 2 (root of subtree)
- Go left to 4
- Visit 4 (leaf - no children, return)
- Go right to 5
- Visit 5 (leaf - return)
- Return to 2 (done left subtree)
- Return to 1 (done left subtree)
- Go right to 3
- Visit 3 (leaf - done)

Order: 1 → 2 → 4 → 5 → 3

**Additional Example:**
```
Input: [1, null, 2, 3]  (root with right child having left)
Output: [1, 2, 3]
```

---

## Time Complexity
**O(n)**

---

## Space Complexity
**O(h) where h is height**

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
