# BST Insert

## Category
Trees & BSTs

## Description
Insert a new node in a binary search tree maintaining BST property.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- trees & bsts related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Explanation
BST Insertion is the process of inserting a new node into a Binary Search Tree while maintaining the BST property. The BST property states that for each node:
- All nodes in the left subtree have values less than the node's value
- All nodes in the right subtree have values greater than the node's value

### How It Works:
1. Start at the root node
2. Compare the value to insert with the current node's value
3. If smaller, go to the left child; if larger, go to the right child
4. Repeat until a null (empty) position is found
5. Insert the new node at that position

### Implementation Approaches:
1. **Recursive**: Elegant but uses O(h) stack space where h is height
2. **Iterative**: More memory efficient, uses O(1) extra space

### Key Properties:
- **Time Complexity**: O(h) where h is the height of the tree
- **Best Case**: O(log n) for balanced tree (height = log n)
- **Worst Case**: O(n) for skewed tree (all nodes in one line)
- **Space Complexity**: O(h) for recursive, O(1) for iterative

### Handling Duplicates:
- Standard BST doesn't allow duplicates (can be modified to allow)
- Options: Ignore, count frequency, or store in right subtree only

---

## Algorithm Steps
1. **Recursive Approach**:
   - If tree is empty, create new node and return
   - If value < current node's value, recurse left
   - If value > current node's value, recurse right
   - Return current node after insertion

2. **Iterative Approach**:
   - If tree is empty, create root and return
   - Traverse to find correct position (while loop)
   - Insert new node as left or right child of found parent

---

## Implementation

```python
from typing import Optional


class TreeNode:
    """Node class for Binary Search Tree."""
    def __init__(self, val: int):
        self.val = val
        self.left: Optional[TreeNode] = None
        self.right: Optional[TreeNode] = None


def insert_recursive(root: Optional[TreeNode], val: int) -> TreeNode:
    """
    Insert a value into BST recursively.
    
    Args:
        root: Root of the BST (can be None for empty tree)
        val: Value to insert
    
    Returns:
        Root of the modified BST
    
    Time: O(h) where h is height
    Space: O(h) for recursion stack
    """
    # Base case: found the position
    if root is None:
        return TreeNode(val)
    
    # Recursively find the correct position
    if val < root.val:
        root.left = insert_recursive(root.left, val)
    elif val > root.val:
        root.right = insert_recursive(root.right, val)
    # If val == root.val, do nothing (no duplicates in standard BST)
    
    return root


def insert_iterative(root: Optional[TreeNode], val: int) -> TreeNode:
    """
    Insert a value into BST iteratively.
    
    Args:
        root: Root of the BST (can be None for empty tree)
        val: Value to insert
    
    Returns:
        Root of the modified BST
    
    Time: O(h) where h is height
    Space: O(1)
    """
    # If tree is empty, create root
    if root is None:
        return TreeNode(val)
    
    # Traverse to find the correct position
    current = root
    while True:
        if val < current.val:
            if current.left is None:
                current.left = TreeNode(val)
                break
            current = current.left
        elif val > current.val:
            if current.right is None:
                current.right = TreeNode(val)
                break
            current = current.right
        else:
            # Duplicate value - do nothing
            break
    
    return root


def inorder_traversal(root: Optional[TreeNode]) -> list:
    """Inorder traversal to verify BST property."""
    result = []
    
    def _inorder(node):
        if node:
            _inorder(node.left)
            result.append(node.val)
            _inorder(node.right)
    
    _inorder(root)
    return result


def build_bst(values: list) -> Optional[TreeNode]:
    """Build BST from a list of values."""
    root = None
    for val in values:
        root = insert_iterative(root, val)
    return root


# Example usage
if __name__ == "__main__":
    print("BST Insertion")
    print("=" * 40)
    
    # Insert values into BST
    values = [7, 3, 9, 1, 5, 8, 10]
    
    print(f"\nInserting values: {values}")
    root = None
    for val in values:
        root = insert_iterative(root, val)
        print(f"  Inserted {val}, Inorder: {inorder_traversal(root)}")
    
    print("\nFinal tree (inorder):", inorder_traversal(root))
    
    # Build tree and verify
    print("\nBuilding from [5, 3, 7, 1, 4, 6, 8]:")
    root2 = build_bst([5, 3, 7, 1, 4, 6, 8])
    print("Inorder:", inorder_traversal(root2))
    
    # Insert more values
    print("\nInserting 2 and 9:")
    root2 = insert_iterative(root2, 2)
    root2 = insert_iterative(root2, 9)
    print("Inorder:", inorder_traversal(root2))

```javascript
function bstInsert() {
    // BST Insert implementation
    // Time: O(h)
    // Space: O(h)
}
```

---

## Example

**Input:**
```
Insert values: [7, 3, 9, 1, 5, 8, 10] into an empty BST
```

**Output:**
```
Inserting values: [7, 3, 9, 1, 5, 8, 10]
  Inserted 7, Inorder: [7]
  Inserted 3, Inorder: [3, 7]
  Inserted 9, Inorder: [3, 7, 9]
  Inserted 1, Inorder: [1, 3, 7, 9]
  Inserted 5, Inorder: [1, 3, 5, 7, 9]
  Inserted 8, Inorder: [1, 3, 5, 7, 8, 9]
  Inserted 10, Inorder: [1, 3, 5, 7, 8, 9, 10]

Final tree (inorder): [1, 3, 5, 7, 8, 9, 10]

Tree structure:
        7
       / \
      3   9
     / \ / \
    1  5 8  10
```

---

## Time Complexity
**O(h)**

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
