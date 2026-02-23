# Recover BST

## Category
Trees & BSTs

## Description
Fix a BST where two nodes have been swapped.

---

## Algorithm Explanation
The Recover BST problem involves fixing a Binary Search Tree where exactly two nodes have been swapped, violating the BST property. The solution uses in-order traversal to identify the swapped nodes.

### Key Concepts:
- **In-order Traversal**: In a BST, in-order traversal produces sorted order
- **Violations**: When two nodes are swapped, there will be at most two violations in the sorted sequence
- **O(n) Time, O(h) Space**: Only one pass through the tree needed

### How It Works:
1. Perform in-order traversal (iterative to avoid recursion depth)
2. Track the previous node during traversal
3. Find first violation: where current < previous (first swapped node is previous)
4. Find second violation: where current < previous after first violation (second swapped node is current)
5. Swap the values of the two identified nodes

### Two Violations Case:
- Example: [1, 7, 3, 4, 5, 6, 8] - 7 and 3 are swapped
- First violation: 3 < 7 at position 2, first = 7
- Second violation: no more violations, second = 3

### Adjacent Swap Case:
- Example: [3, 2, 1] - 3 and 2 are swapped (adjacent)
- First violation: 2 < 3, first = 3
- Second violation: 1 < 2, second = 2

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

## Implementation

```python
from typing import Optional, Tuple

class TreeNode:
    def __init__(self, val: int, left: 'TreeNode' = None, right: 'TreeNode' = None):
        self.val = val
        self.left = left
        self.right = right


def recover_tree(root: Optional[TreeNode]) -> None:
    """
    Recover a BST where two nodes have been swapped.
    Modifies the tree in-place.
    
    Args:
        root: Root of the BST with two swapped nodes
    """
    stack = []
    current = root
    first = None
    second = None
    prev = None
    
    while stack or current:
        # Go to leftmost node
        while current:
            stack.append(current)
            current = current.left
        
        current = stack.pop()
        
        # Check for violation
        if prev and current.val < prev.val:
            if first is None:
                first = prev
            second = current
        
        prev = current
        current = current.right
    
    # Swap values
    if first and second:
        first.val, second.val = second.val, first.val


def recover_tree_morris(root: Optional[TreeNode]) -> None:
    """
    Morris Traversal - O(1) space solution.
    """
    current = root
    first = None
    second = None
    prev = None
    
    while current:
        if not current.left:
            # Visit node
            if prev and current.val < prev.val:
                if first is None:
                    first = prev
                second = current
            prev = current
            current = current.right
        else:
            # Find inorder predecessor
            pred = current.left
            while pred.right and pred.right != current:
                pred = pred.right
            
            if not pred.right:
                pred.right = current
                current = current.left
            else:
                # Restore tree
                pred.right = None
                if prev and current.val < prev.val:
                    if first is None:
                        first = prev
                    second = current
                prev = current
                current = current.right
    
    if first and second:
        first.val, second.val = second.val, first.val


# Example usage and test
def build_tree(values: list) -> Optional[TreeNode]:
    """Build tree from level-order list (None represents missing)."""
    if not values:
        return None
    
    nodes = [None if v is None else TreeNode(v) for v in values]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: node.left = kids.pop()
            if kids: node.right = kids.pop()
    return root


def inorder(root: TreeNode) -> list:
    """Get inorder traversal."""
    result = []
    stack = []
    current = root
    while stack or current:
        while current:
            stack.append(current)
            current = current.left
        current = stack.pop()
        result.append(current.val)
        current = current.right
    return result


if __name__ == "__main__":
    # Tree with swapped nodes: 3 and 7
    #       5
    #      / \
    #     3   8
    #    / \   \
    #   1   7   9  (7 should be 3, 3 should be 7)
    root = build_tree([5, 3, 8, 1, 7, None, 9])
    print("Before recovery:", inorder(root))
    recover_tree(root)
    print("After recovery:", inorder(root))
```

```javascript
function recoverBst() {
    // Recover BST implementation
    // Time: O(n)
    // Space: O(h)
}
```

---

## Example

**Input:**
```
Tree structure (swapped 3 and 7):
       5
      / \
     3   8
    / \   \
   1   7   9
```

**Output:**
```
Before recovery: [1, 3, 7, 5, 8, 9]
After recovery: [1, 3, 5, 7, 8, 9]
```

**Explanation:**
- In-order of swapped tree: [1, 3, 7, 5, 8, 9]
- First violation: 7 < 3 (first = 3)
- No second violation, so second = 7
- Swap values of nodes with values 3 and 7
- After recovery: [1, 3, 5, 7, 8, 9]

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
