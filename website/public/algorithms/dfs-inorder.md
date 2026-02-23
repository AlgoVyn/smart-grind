# DFS Inorder

## Category
Trees & BSTs

## Description
Traverse tree in left-root-right order. For BST, gives sorted output.

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

## How It Works
Inorder traversal is a depth-first tree traversal that visits nodes in **Left-Root-Right** order. For Binary Search Trees (BST), this produces nodes in **sorted order**.

**Key Concept:** Visit left subtree first, then the root, then the right subtree.

**Why it works:**
- Recursively process left subtree → visit root → recursively process right subtree
- This ensures all nodes in left subtree are visited before the root
- For BSTs, this gives ascending order traversal

**Algorithm (Recursive):**
1. Base case: if node is None, return
2. Recursively traverse left subtree
3. Process current node (add to result)
4. Recursively traverse right subtree

**Algorithm (Iterative):**
- Use a stack to simulate recursion
- Go left as far as possible, pushing nodes
- Pop and process, then move to right

---

## Implementation

```python
class TreeNode:
    """Definition for a binary tree node."""
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def inorder_traversal_recursive(root):
    """
    DFS Inorder Traversal - Recursive
    Time: O(n)
    Space: O(h) where h is height of tree
    
    Args:
        root: Root of binary tree
    
    Returns:
        List of node values in inorder
    """
    result = []
    
    def traverse(node):
        if not node:
            return
        traverse(node.left)      # Visit left
        result.append(node.val)   # Visit root
        traverse(node.right)      # Visit right
    
    traverse(root)
    return result


def inorder_traversal_iterative(root):
    """
    DFS Inorder Traversal - Iterative using stack
    Time: O(n)
    Space: O(h)
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


# Example usage
if __name__ == "__main__":
    # Build tree:       4
    #                /   \
    #               2     6
    #              / \   / \
    #             1   3 5   7
    root = TreeNode(4)
    root.left = TreeNode(2, TreeNode(1), TreeNode(3))
    root.right = TreeNode(6, TreeNode(5), TreeNode(7))
    
    result = inorder_traversal_recursive(root)
    print(f"Recursive: {result}")  # [1, 2, 3, 4, 5, 6, 7]
    
    result = inorder_traversal_iterative(root)
    print(f"Iterative: {result}")  # [1, 2, 3, 4, 5, 6, 7]
```

```javascript
function dfsInorder() {
    // DFS Inorder implementation
    // Time: O(n)
    // Space: O(h)
}
```

---

## Example

**Input:**
```
Tree:
    4
   / \
  2   6
 / \ / \
1  3 5  7
```

**Output:**
```
Recursive: [1, 2, 3, 4, 5, 6, 7]
Iterative: [1, 2, 3, 4, 5, 6, 7]
```

**Explanation:**
- Traverse left subtree of 4: 2 → 1 → 3
- Visit root: 4
- Traverse right subtree of 4: 6 → 5 → 7
- Combined: [1, 2, 3, 4, 5, 6, 7]

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
