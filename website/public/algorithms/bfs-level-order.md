# BFS Level Order

## Category
Trees & BSTs

## Description
Traverse tree level by level using a queue.

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

Level-order traversal (also known as Breadth-First Search or BFS) visits a tree level by level, from left to right. This algorithm uses a queue data structure to achieve this:

1. **Queue Initialization**: Start by adding the root node to a queue
2. **Level Processing**: Process all nodes at the current level by dequeuing them, adding their values to the result, and enqueueing their children
3. **Level Separation**: Continue until the queue is empty

The key insight is that a queue naturally maintains the FIFO (First-In-First-Out) order, which ensures nodes are processed in the order they were discovered - exactly what we need for level-by-level traversal. We can also return results grouped by level for more detailed output.

This algorithm is fundamental for tree problems like finding the width of a tree, computing level averages, or checking if a tree is complete.

---

## Implementation

```python
from collections import deque

class TreeNode:
    """Definition for a binary tree node."""
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def level_order(root):
    """
    Perform level-order traversal of binary tree.
    
    Args:
        root: Root node of the binary tree
        
    Returns:
        List of lists containing node values at each level
        
    Time: O(n)
    Space: O(w) where w is max width of tree
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(current_level)
    
    return result


# Alternative: Return flat list
def level_order_flat(root):
    """Return all values in level-order as a flat list."""
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        node = queue.popleft()
        result.append(node.val)
        
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    
    return result
```

```javascript
function bfsLevelOrder() {
    // BFS Level Order implementation
    // Time: O(n)
    // Space: O(w) where w is max width
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
[[1], [2, 3], [4, 5]]
```

**Flattened Output:**
```
[1, 2, 3, 4, 5]
```

**Explanation:**
- Level 1: [1]
- Level 2: [2, 3]
- Level 3: [4, 5]

---

## Time Complexity
**O(n)**

---

## Space Complexity
**O(w) where w is max width**

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
