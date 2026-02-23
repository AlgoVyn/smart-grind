# DFS Postorder

## Category
Trees & BSTs

## Description
Traverse tree in left-right-root order. Useful for deletion and bottom-up calculations.

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
Postorder traversal is a depth-first tree traversal that visits nodes in **Left-Right-Root** order. This is useful for:
- Tree deletion (must delete children before parent)
- Computing directory sizes
- Evaluating expression trees
- Bottom-up calculations

**Key Concept:** Visit left subtree, then right subtree, then the root.

**Why it works:**
- Recursively process left subtree → recursively process right subtree → process root
- This ensures children are processed before their parent
- Essential for operations like tree deletion

**Algorithm (Recursive):**
1. Base case: if node is None, return
2. Recursively traverse left subtree
3. Recursively traverse right subtree
4. Process current node (add to result)

**Algorithm (Iterative):**
- Use two stacks or modify the tree temporarily
- Use stack to simulate: push root, process children, then process root
- Or use single stack with last-visited tracking

---

## Implementation

```python
class TreeNode:
    """Definition for a binary tree node."""
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def postorder_traversal_recursive(root):
    """
    DFS Postorder Traversal - Recursive
    Time: O(n)
    Space: O(h) where h is height of tree
    
    Args:
        root: Root of binary tree
    
    Returns:
        List of node values in postorder
    """
    result = []
    
    def traverse(node):
        if not node:
            return
        traverse(node.left)      # Visit left
        traverse(node.right)     # Visit right
        result.append(node.val)  # Visit root
    
    traverse(root)
    return result


def postorder_traversal_iterative(root):
    """
    DFS Postorder Traversal - Iterative using two stacks
    Time: O(n)
    Space: O(h)
    """
    if not root:
        return []
    
    result = []
    stack1 = [root]
    stack2 = []
    
    # First stack to traverse, second to store reverse postorder
    while stack1:
        node = stack1.pop()
        stack2.append(node)
        
        # Push left first, then right (reverse of postorder)
        if node.left:
            stack1.append(node.left)
        if node.right:
            stack1.append(node.right)
    
    # Pop from stack2 to get postorder
    while stack2:
        result.append(stack2.pop().val)
    
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
    
    result = postorder_traversal_recursive(root)
    print(f"Recursive: {result}")  # [1, 3, 2, 5, 7, 6, 4]
    
    result = postorder_traversal_iterative(root)
    print(f"Iterative: {result}")  # [1, 3, 2, 5, 7, 6, 4]
```

```javascript
function dfsPostorder() {
    // DFS Postorder implementation
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
Recursive: [1, 3, 2, 5, 7, 6, 4]
Iterative: [1, 3, 2, 5, 7, 6, 4]
```

**Explanation:**
- Left subtree of 4: 2 → 1 → 3
- Right subtree of 4: 6 → 5 → 7
- Root: 4
- Combined: [1, 3, 2, 5, 7, 6, 4]

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
