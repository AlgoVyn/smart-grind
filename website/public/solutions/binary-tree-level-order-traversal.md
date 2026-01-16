# Binary Tree Level Order Traversal

## Problem Statement

Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).

This is one of the most fundamental tree traversal problems and serves as a building block for many more complex tree problems. Level order traversal is also known as **Breadth-First Search (BFS)** on trees.

### What is Level Order Traversal?

Level order traversal visits all nodes at the present depth level before moving on to nodes at the next depth level. For a binary tree, this means:
- First, visit all nodes at level 0 (just the root)
- Then, visit all nodes at level 1 (children of root)
- Then, visit all nodes at level 2 (grandchildren of root)
- And so on...

### TreeNode Definition

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right
```

---

## Examples

### Example 1

**Input:**
```
root = [3,9,20,null,null,15,7]
```

**Visual Representation:**
```
        3
       / \
      9   20
         /  \
        15   7
```

**Output:**
```
[[3], [9, 20], [15, 7]]
```

**Explanation:** 
- Level 0: [3]
- Level 1: [9, 20]
- Level 2: [15, 7]

### Example 2

**Input:**
```
root = [1]
```

**Visual Representation:**
```
    1
```

**Output:**
```
[[1]]
```

**Explanation:** Only one node at level 0.

### Example 3

**Input:**
```
root = []
```

**Output:**
```
[]
```

**Explanation:** Empty tree returns empty list.

### Example 4

**Input:**
```
root = [1,2,3,4,5,null,7]
```

**Visual Representation:**
```
        1
       / \
      2   3
     /     \
    4       7
```

**Output:**
```
[[1], [2, 3], [4, 7]]
```

**Explanation:**
- Level 0: [1]
- Level 1: [2, 3]
- Level 2: [4, 7]

### Example 5

**Input:**
```
root = [3,9,20,1,3,null,15,7]
```

**Visual Representation:**
```
         3
       /   \
      9     20
     / \    /  \
    1   3  15   7
```

**Output:**
```
[[3], [9, 20], [1, 3, 15, 7]]
```

---

## Constraints

- The number of nodes in the tree is in the range `[0, 2000]`.
- `-1000 <= Node.val <= 1000`

---

## Intuition

The key insight for level order traversal is to process nodes **level by level** while maintaining the order within each level. This naturally maps to the **Breadth-First Search (BFS)** algorithm using a queue data structure.

### Why Queue for BFS?

A queue follows the **First-In-First-Out (FIFO)** principle, which is perfect for level order traversal because:
1. We want to process nodes in the order they were discovered
2. Children of a node should be processed after the node itself
3. All nodes at the same level should be processed together before moving to the next level

### Key Observations

1. **Size Tracking**: At each level, we process exactly `len(queue)` nodes (the number of nodes at that level)
2. **Child Enqueueing**: When we process a node, we add its children to the queue for the next level
3. **Termination**: The loop naturally terminates when the queue becomes empty (all nodes processed)

---

## Multiple Approaches with Code

### Approach 1: BFS with Queue (Optimal) ⭐

This is the most intuitive and commonly used approach. We use a queue to track nodes to visit, and for each level, we process all nodes currently in the queue.

```python
from typing import List, Optional
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        """
        Perform level order traversal using BFS with a queue.
        
        Args:
            root: The root node of the binary tree
            
        Returns:
            List of lists, where each inner list contains node values at that level
        """
        if not root:
            return []
        
        result = []
        queue = deque([root])
        
        while queue:
            level_size = len(queue)
            level = []
            
            for _ in range(level_size):
                node = queue.popleft()
                level.append(node.val)
                
                if node.left:
                    queue.append(node.left)
                if node.right:
                    queue.append(node.right)
            
            result.append(level)
        
        return result
```

**How to Arrive at the Solution:**
1. Start by adding the root to the queue
2. While the queue is not empty:
   - Get the current level size (number of nodes at this level)
   - Process exactly that many nodes
   - For each node: add its value to the level list, enqueue its children
   - Add the completed level to the result

**Time Complexity:** O(n) - Each node is visited exactly once
**Space Complexity:** O(w) - Where w is the maximum width of the tree (worst case: O(n) for a complete tree)

---

### Approach 2: DFS with Recursive Helper

This approach uses Depth-First Search recursively, tracking the current level as we traverse down the tree. We build the result level by level as we backtrack.

```python
from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        """
        Perform level order traversal using DFS with a recursive helper.
        
        Args:
            root: The root node of the binary tree
            
        Returns:
            List of lists, where each inner list contains node values at that level
        """
        if not root:
            return []
        
        result = []
        
        def dfs(node: TreeNode, level: int):
            """Recursive helper function to traverse the tree."""
            if not node:
                return
            
            # Expand the result list if needed
            if level == len(result):
                result.append([])
            
            # Add current node's value to its level
            result[level].append(node.val)
            
            # Recurse on left and right children with incremented level
            dfs(node.left, level + 1)
            dfs(node.right, level + 1)
        
        dfs(root, 0)
        return result
```

**How to Arrive at the Solution:**
1. Recognize that DFS naturally visits nodes level by level when we track the current depth
2. Use a helper function that takes the current node and its level
3. If we haven't created a list for this level yet, create one
4. Add the node's value to the corresponding level list
5. Recurse on children with level + 1

**Time Complexity:** O(n) - Each node is visited exactly once
**Space Complexity:** O(h) - Where h is the height of the tree for recursion stack, plus O(n) for result

---

### Approach 3: Iterative DFS with Stack

Similar to Approach 2, but uses an explicit stack instead of recursion. We store tuples of (node, level) in the stack.

```python
from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        """
        Perform level order traversal using iterative DFS with a stack.
        
        Args:
            root: The root node of the binary tree
            
        Returns:
            List of lists, where each inner list contains node values at that level
        """
        if not root:
            return []
        
        result = []
        stack = [(root, 0)]  # Stack stores tuples of (node, level)
        
        while stack:
            node, level = stack.pop()
            
            # Expand the result list if needed
            if level == len(result):
                result.append([])
            
            # Add current node's value to its level
            result[level].append(node.val)
            
            # Push right first, then left (so left is processed first)
            if node.right:
                stack.append((node.right, level + 1))
            if node.left:
                stack.append((node.left, level + 1))
        
        return result
```

**How to Arrive at the Solution:**
1. Use a stack to simulate the recursion stack
2. Push (node, level) tuples onto the stack
3. Pop from stack and process the node
4. Push children onto stack (right first, then left) to ensure left is processed first

**Time Complexity:** O(n) - Each node is visited exactly once
**Space Complexity:** O(h) - Stack size is at most the height of the tree

---

### Approach 4: BFS with Level Size Tracking (More Explicit)

A more explicit version of the BFS approach that makes the level separation very clear.

```python
from typing import List, Optional
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Solution:
    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:
        """
        Perform level order traversal with explicit level tracking.
        
        Args:
            root: The root node of the binary tree
            
        Returns:
            List of lists, where each inner list contains node values at that level
        """
        if not root:
            return []
        
        result = []
        current_level = [root]  # Start with root at level 0
        
        while current_level:
            # Extract values from current level
            level_vals = [node.val for node in current_level]
            result.append(level_vals)
            
            # Prepare next level (children of current level nodes)
            next_level = []
            for node in current_level:
                if node.left:
                    next_level.append(node.left)
                if node.right:
                    next_level.append(node.right)
            
            current_level = next_level
        
        return result
```

**How to Arrive at the Solution:**
1. Start with a list containing only the root
2. While the current level list is not empty:
   - Extract all values from the current level
   - Find all children of nodes in the current level
   - Set the children as the next level
3. Continue until no more levels

**Time Complexity:** O(n) - Each node is visited exactly once
**Space Complexity:** O(w) - Where w is the maximum width of the tree

---

## Step-by-Step Example

Let's trace through the BFS approach with this tree:

```
        3
       / \
      9   20
         /  \
        15   7
```

**Step 1:** Initialize
- `queue = [3]`
- `result = []`

**Step 2:** Process Level 0
- `level_size = len(queue) = 1`
- Pop node 3, add to level: `level = [3]`
- Enqueue children: `queue = [9, 20]`
- `result = [[3]]`

**Step 3:** Process Level 1
- `level_size = len(queue) = 2`
- Pop node 9, add to level: `level = [9]`
- Enqueue children: none
- Pop node 20, add to level: `level = [9, 20]`
- Enqueue children: `queue = [15, 7]`
- `result = [[3], [9, 20]]`

**Step 4:** Process Level 2
- `level_size = len(queue) = 2`
- Pop node 15, add to level: `level = [15]`
- Enqueue children: none
- Pop node 7, add to level: `level = [15, 7]`
- Enqueue children: none
- `queue = []`
- `result = [[3], [9, 20], [15, 7]]`

**Step 5:** Termination
- `queue` is empty, loop ends
- Return `[[3], [9, 20], [15, 7]]`

---

## Complexity Analysis Summary

| Approach | Time Complexity | Space Complexity | Notes |
|----------|-----------------|------------------|-------|
| BFS with Queue | O(n) | O(w) | **Most intuitive**, best for most cases |
| DFS Recursive | O(n) | O(h) + O(n) | Uses recursion stack, good for deep trees |
| DFS Iterative | O(n) | O(h) | Explicit stack, avoids recursion limits |
| BFS Level Tracking | O(n) | O(w) | More explicit level separation |

Where:
- n = number of nodes in the tree
- w = maximum width of the tree (maximum nodes at any level)
- h = height of the tree

---

## Related Problems

Here are similar LeetCode problems that build on level order traversal concepts:

1. **[Binary Tree Zigzag Level Order Traversal](binary-tree-zigzag-level-order-traversal.md)** (103) - Traverse levels in a zigzag pattern (left-to-right, then right-to-left).

2. **[Binary Tree Right Side View](binary-tree-right-side-view.md)** (199) - Return the rightmost node at each level.

3. **[Binary Tree Level Order Traversal II](https://leetcode.com/problems/binary-tree-level-order-traversal-ii/)** (107) - Same traversal but return results from bottom to top.

4. **[Average of Levels in Binary Tree](https://leetcode.com/problems/average-of-levels-in-binary-tree/)** (637) - Compute the average value at each level.

5. **[Maximum Level Sum of a Binary Tree](https://leetcode.com/problems/maximum-level-sum-of-a-binary-tree/)** (1161) - Find the level with the maximum sum.

6. **[Count Nodes Equal to Average of Subtree](https://leetcode.com/problems/count-nodes-equal-to-average-of-subtree/)** (2265) - Count nodes where node value equals average of its subtree.

7. **[Find Largest Value in Each Tree Row](https://leetcode.com/problems/find-largest-value-in-each-tree-row/)** (515) - Find the maximum value at each level.

---

## Video Tutorial Links

For visual explanations, check these tutorials:

- **[NeetCode - Binary Tree Level Order Traversal](https://www.youtube.com/watch?v=6ZnyEcbg5Kg)** - Clear explanation with Python implementation.

- **[Binary Tree Level Order Traversal - LeetCode 102](https://www.youtube.com/watch?v=5C0KrtT8G9w)** - Detailed walkthrough of the BFS approach.

- **[BFS vs DFS for Binary Trees](https://www.youtube.com/watch?v=uWLl-FGuEeQ)** - Understanding the difference between BFS and DFS approaches.

- **[Grokking the Coding Interview: Level Order Traversal](https://www.youtube.com/watch?v=86CgTejN9i0)** - Educational explanation of level order traversal patterns.

---

## Follow-up Questions

1. **How would you modify the solution to return values from bottom to top instead of top to bottom?**
   - Answer: Either reverse the final result list, or use a stack to collect levels and then pop them.

2. **Can you solve this problem using DFS instead of BFS?**
   - Answer: Yes, use a recursive helper function that tracks the current level and appends values accordingly.

3. **How would you handle a very deep tree that might cause stack overflow with recursion?**
   - Answer: Use the iterative BFS approach with an explicit queue instead of recursive DFS.

4. **How would you find the average value at each level?**
   - Answer: Track the sum and count of values at each level, then divide to get the average.

5. **How would you modify the solution to print the tree level by level with level numbers?**
   - Answer: Include the level index in the output or log statements.

6. **What if you needed to do this with O(1) extra space (excluding the output)?**
   - Answer: This is challenging; you'd need Morris Traversal variants or parent pointer tracking.

7. **How would you parallelize level order traversal for very large trees?**
   - Answer: Each level could potentially be processed in parallel, but the sequential dependency between levels limits parallelization.

---

## Common Mistakes to Avoid

1. **Forgetting to check for empty root**: Always handle the edge case of an empty tree first.

2. **Not tracking level size**: Using `while queue:` without tracking level size will result in a single flat list instead of level-separated lists.

3. **Incorrect child enqueueing order**: Remember to enqueue left child before right child to maintain left-to-right order.

4. **Modifying the queue while iterating**: Always capture the level size before iterating.

5. **Index out of bounds**: Be careful when accessing `node.left` and `node.right` on potentially None nodes.

6. **Using wrong data structure**: Make sure to use a queue (deque) for BFS, not a stack.

7. **Not handling deep recursion**: For very deep trees, the recursive DFS approach may hit recursion limits.

---

## References

- [LeetCode 102 - Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)
- [BFS Pattern - Educative](https://www.educative.io/page/5682209837483520/39370001)
- [Tree Traversals - Interview Cake](https://www.interviewcake.com/concept/java/tree-traversal)
