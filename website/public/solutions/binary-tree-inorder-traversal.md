# Binary Tree Inorder Traversal

## Problem Description

Given the root of a binary tree, return the inorder traversal of its nodes' values.

Inorder traversal is a depth-first traversal technique where we visit the nodes in the following order:
1. Left subtree
2. Root node
3. Right subtree

This is one of the three fundamental tree traversals (along with preorder and postorder) and is particularly important because for binary search trees (BST), inorder traversal returns nodes in non-decreasing order.

**LeetCode Problem Number:** 94

---

## Examples

### Example 1:

**Input:**
```
root = [1,null,2,3]
```

**Visual Representation:**
```
    1
     \
      2
     /
    3
```

**Output:**
```
[1,3,2]
```

**Explanation:** 
- Visit left subtree of 1 (null, skip)
- Visit root: 1
- Visit right subtree of 1:
  - Visit left subtree of 2: 3
  - Visit root: 2
  - Visit right subtree of 2 (null, skip)
Result: [1, 3, 2]

---

### Example 2:

**Input:**
```
root = [1,2,3,4,5,null,8,null,null,6,7,9]
```

**Visual Representation:**
```
           1
         /   \
        2     3
       / \     \
      4   5     8
         / \   / 
        6   7 9  
```

**Output:**
```
[4,2,6,5,7,1,3,9,8]
```

**Explanation:** The inorder traversal visits nodes in the order: 4 → 2 → 6 → 5 → 7 → 1 → 3 → 9 → 8

---

### Example 3:

**Input:**
```
root = []
```

**Output:**
```
[]
```

**Explanation:** An empty tree has no nodes to traverse.

---

### Example 4:

**Input:**
```
root = [1]
```

**Output:**
```
[1]
```

**Explanation:** A single node tree returns a list with just that node's value.

---

## Constraints

- The number of nodes in the tree is in the range `[0, 100]`.
- `-100 <= Node.val <= 100`

---

## Follow up

Recursive solution is trivial, could you do it iteratively?

---

## Intuition

The inorder traversal follows the pattern: **Left → Root → Right**. This naturally maps to a recursive definition because:

1. To traverse a tree, we first need to traverse its left subtree
2. Then process the current node (append its value)
3. Finally, traverse the right subtree

For the iterative approach, we need to simulate the recursion stack manually using an explicit stack data structure. The key insight is:
- We keep going left as long as possible, pushing nodes onto the stack
- When we can't go further left, we pop from the stack (this is the next node to visit)
- After processing a node, we move to its right subtree and repeat

Morris Traversal provides an even more elegant solution by modifying the tree temporarily to create threaded connections, achieving O(1) extra space.

---

## Approach 1: Recursive Solution (DFS)

### Algorithm
1. Create an empty result list
2. Define a helper function that takes a node
3. If node is not null:
   - Recursively call helper on left child
   - Append current node's value to result
   - Recursively call helper on right child
4. Call the helper function with root
5. Return the result

### Code Implementation

```python
from typing import List, Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        """
        Recursive inorder traversal of binary tree.
        Time: O(n) - each node visited exactly once
        Space: O(h) - recursion stack, h = height of tree
        """
        result = []
        
        def inorder(node: Optional[TreeNode]):
            if not node:
                return
            inorder(node.left)
            result.append(node.val)
            inorder(node.right)
        
        inorder(root)
        return result
```

### Complexity Analysis
- **Time Complexity:** O(n) - Each node is visited exactly once
- **Space Complexity:** O(h) - Where h is the height of the tree. In the worst case (skewed tree), h = n, so O(n). In a balanced tree, h = log(n).

---

## Approach 2: Iterative Solution (Using Stack)

### Algorithm
1. Initialize an empty stack and an empty result list
2. Start with current = root
3. While current is not null OR stack is not empty:
   - While current is not null:
     - Push current onto stack
     - Move current to left child
   - Current is now null, pop from stack (this is the next node to visit)
   - Append current.val to result
   - Move current to right child
4. Return result

### Code Implementation

```python
from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        """
        Iterative inorder traversal using explicit stack.
        Time: O(n) - each node visited exactly once
        Space: O(h) - stack storage, h = height of tree
        """
        result = []
        stack = []
        current = root
        
        while current or stack:
            # Reach the leftmost node of the current node
            while current:
                stack.append(current)
                current = current.left
            
            # Current must be None at this point
            current = stack.pop()
            result.append(current.val)  # Visit the node
            
            # We have visited the node and its left subtree.
            # Now, it's right subtree's turn
            current = current.right
        
        return result
```

### Step-by-Step Execution (Example: [1,null,2,3])

```
Initial: current = 1, stack = [], result = []

Step 1: Push 1, move left -> current = None, stack = [1]
Step 2: Pop 1, add to result, move right -> current = 2, result = [1], stack = []
Step 3: Push 2, move left -> current = 3, stack = [2]
Step 4: Push 3, move left -> current = None, stack = [2, 3]
Step 5: Pop 3, add to result -> current = None, result = [1, 3], stack = [2]
Step 6: Pop 2, add to result, move right -> current = None, result = [1, 3, 2], stack = []
Done! Result = [1, 3, 2]
```

### Complexity Analysis
- **Time Complexity:** O(n) - Each node is pushed and popped from the stack exactly once
- **Space Complexity:** O(h) - Stack storage, where h is the height of the tree

---

## Approach 3: Morris Traversal (O(1) Space)

### Algorithm
Morris Traversal is a clever technique that uses threaded binary trees to achieve O(1) extra space:

1. Initialize current = root, result = []
2. While current is not null:
   - If current has no left child:
     - Add current.val to result
     - Move to right child
   - Else:
     - Find the inorder predecessor (rightmost node in left subtree)
     - If predecessor's right is null:
       - Set predecessor's right to current (create thread)
       - Move current to left child
     - Else (predecessor's right already points to current):
       - Restore tree: set predecessor's right to null
       - Add current.val to result
       - Move to right child
3. Return result

### Code Implementation

```python
from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def inorderTraversal(self, root: Optional[TreeNode]) -> List[int]:
        """
        Morris Inorder Traversal - O(1) extra space.
        Uses threaded binary tree concept to avoid explicit stack.
        Time: O(n) - each edge traversed at most twice
        Space: O(1) - no recursion or stack used
        """
        result = []
        current = root
        
        while current:
            if not current.left:
                # No left subtree, visit and go right
                result.append(current.val)
                current = current.right
            else:
                # Find inorder predecessor
                predecessor = current.left
                while predecessor.right and predecessor.right != current:
                    predecessor = predecessor.right
                
                if not predecessor.right:
                    # Create thread to current node
                    predecessor.right = current
                    current = current.left
                else:
                    # Thread already exists, visit and remove thread
                    predecessor.right = None
                    result.append(current.val)
                    current = current.right
        
        return result
```

### How Morris Traversal Works (Visual)

For tree:
```
    1
     \
      2
     /
    3
```

```
Step 1: current = 1
        1 has no left child, add 1, move to right
        current = 2

Step 2: current = 2
        2 has left child (3), find predecessor (3)
        Thread: 3.right = 2
        Move to left: current = 3

Step 3: current = 3
        3 has no left child, add 3, move to right
        current = 2 (via thread)

Step 4: current = 2
        Predecessor (3) already points to 2
        Remove thread, add 2, move to right
        current = None

Done! Result = [1, 3, 2]
```

### Complexity Analysis
- **Time Complexity:** O(n) - Each edge is traversed at most twice (once going left, once via thread)
- **Space Complexity:** O(1) - No recursion stack or explicit stack used

---

## Comparison of Approaches

| Approach | Time | Space | Pros | Cons |
|----------|------|-------|------|------|
| Recursive | O(n) | O(h) | Simple, intuitive | Stack overflow risk for deep trees |
| Iterative (Stack) | O(n) | O(h) | No recursion limit | Still O(h) space |
| Morris | O(n) | O(1) | Constant space | Modifies tree temporarily |

---

## Related Problems

| # | Problem | Difficulty | Description |
|---|---------|------------|-------------|
| 1 | [Binary Tree Preorder Traversal](https://leetcode.com/problems/binary-tree-preorder-traversal/) | Easy | Visit: Root → Left → Right |
| 2 | [Binary Tree Postorder Traversal](https://leetcode.com/problems/binary-tree-postorder-traversal/) | Easy | Visit: Left → Right → Root |
| 3 | [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) | Medium | Level by level traversal (BFS) |
| 4 | [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/) | Medium | Use inorder to check sorted property |
| 5 | [Binary Search Tree Iterator](https://leetcode.com/problems/binary-search-tree-iterator/) | Medium | Implement iterator using inorder |
| 6 | [Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/) | Medium | Stop early in inorder traversal |
| 7 | [All Nodes Distance K in Binary Tree](https://leetcode.com/problems/all-nodes-distance-k-in-binary-tree/) | Medium | Uses traversal patterns |
| 8 | [Binary Tree Inorder Traversal (Iterative)](https://leetcode.com/problems/binary-tree-inorder-traversal/) | Easy | Iterative solution follow-up |
| 9 | [Unique Binary Search Trees II](https://leetcode.com/problems/unique-binary-search-trees-ii/) | Medium | Generate all BSTs using inorder concepts |
| 10 | [Convert BST to Greater Tree](https://leetcode.com/problems/convert-bst-to-greater-tree/) | Medium | Reverse inorder traversal |

---

## Video Tutorials

1. **[Binary Tree Inorder Traversal - LeetCode 94](https://www.youtube.com/watch?v=5cyLw2mXGtQ)** - Back to Back SWE
2. **[Morris Traversal Inorder](https://www.youtube.com/watch?v=wGXBmgOhO6w)** - Abdul Bari
3. **[Tree Traversals - Inorder, Preorder, Postorder](https://www.youtube.com/watch?v=gm8DUJJhmY4)** - GeeksforGeeks
4. **[Binary Tree Traversal - Iterative](https://www.youtube.com/watch?v=PopNL7ykZE4)** - Nick White

---

## Follow-up Questions

### 1. Inorder traversal for n-ary tree?
No standard inorder exists for n-ary trees. Use **preorder** (node → children) or **postorder** (children → node) instead.

---

### 2. Morris traversal for preorder?
Yes! Visit node **before** creating thread (not after like inorder). The visit happens when thread creation is considered, not when it's removed.

---

### 3. Traversal with parent pointers?
Go to leftmost node. After visiting, if right child exists, go to its leftmost; otherwise, climb up via parent pointers until coming from left child.

---

### 4. BST Iterator using inorder?
Use a stack to push left nodes lazily. `next()` pops from stack, pushes right subtree's left nodes. `hasNext()` checks if stack is empty.

---

### 5. Check if two trees have same inorder?
Traverse both trees simultaneously using iterative stack-based inorder. Compare values at each step; return false on mismatch.

---

### 6. Non-recursive without stack?
**Morris Traversal** creates temporary threads to remember positions (O(1) space). **Parent pointers** allow climbing up when no left child exists (O(1) space).

---

### 7. Kth smallest in BST with inorder?
Perform iterative inorder and stop when reaching the kth node. Time: O(h + k), Space: O(h).

**Alternative**: Augment each node with left subtree count for O(h) query with O(1) extra space.

---

### 8. Sorted array to balanced BST?
Pick middle element as root, recursively build left subtree from left half and right subtree from right half. This creates a balanced tree whose inorder is the sorted array.

---

## References

- [LeetCode 94 - Binary Tree Inorder Traversal](https://leetcode.com/problems/binary-tree-inorder-traversal/)
- [Morris Traversal - Wikipedia](https://en.wikipedia.org/wiki/Threaded_binary_tree)
- CLRS Introduction to Algorithms, Chapter 12 (Binary Search Trees)

