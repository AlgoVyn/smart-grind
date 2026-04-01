# BFS Level Order

## Category
Trees & BSTs

## Description

Breadth-First Search (BFS) Level Order Traversal is a fundamental tree traversal algorithm that visits all nodes at the present depth level before moving to nodes at the next depth level. Using a queue data structure, this algorithm ensures nodes are processed in FIFO (First-In-First-Out) order, which naturally produces level-by-level traversal from left to right.

This algorithm is essential for solving many tree and graph problems, including finding the shortest path in unweighted graphs, computing level statistics, checking tree properties, and solving problems that require processing nodes by their distance from the root. The technique forms the foundation for many advanced tree algorithms and is frequently asked in technical interviews.

---

## Concepts

The BFS Level Order technique is built on several fundamental concepts that make it powerful for solving tree problems.

### 1. Queue Data Structure

BFS relies on the FIFO property of queues:

| Operation | Time | Description |
|-----------|------|-------------|
| **Enqueue** | O(1) | Add element to back of queue |
| **Dequeue** | O(1) | Remove element from front of queue |
| **Peek/Front** | O(1) | View front element |
| **Size** | O(1) | Get queue size |

### 2. Level Separation

Key insight: Queue size indicates number of nodes at current level.

```
Before processing level i: queue contains only level i nodes
During processing: dequeue level i nodes, enqueue level i+1 nodes
After processing: queue contains only level i+1 nodes
```

### 3. Traversal Properties

| Property | Value | Explanation |
|----------|-------|-------------|
| **Order** | Top-to-bottom, left-to-right | By level, left child before right |
| **Complete Traversal** | O(n) | Each node visited exactly once |
| **Shortest Path** | Yes | In unweighted trees/graphs |
| **Level Information** | Directly available | Queue size gives level count |

### 4. Node States

Track node processing state:

| State | Description | Action |
|-------|-------------|--------|
| **Unvisited** | Not yet discovered | Will be enqueued by parent |
| **In Queue** | Discovered, pending processing | Will be dequeued and processed |
| **Processed** | Value recorded, children enqueued | Done with this node |

---

## Frameworks

Structured approaches for solving BFS level order problems.

### Framework 1: Basic Level Order

```
┌─────────────────────────────────────────────────────┐
│  BASIC LEVEL ORDER FRAMEWORK                        │
├─────────────────────────────────────────────────────┤
│  1. Check if root is None, return empty list         │
│  2. Initialize: queue = [root], result = []          │
│  3. While queue not empty:                           │
│     a. level_size = len(queue)                      │
│     b. current_level = []                             │
│     c. For i in range(level_size):                   │
│        - node = dequeue()                             │
│        - current_level.append(node.val)              │
│        - if node.left: enqueue(node.left)            │
│        - if node.right: enqueue(node.right)         │
│     d. result.append(current_level)                   │
│  4. Return result                                     │
└─────────────────────────────────────────────────────┘
```

**When to use**: Standard level order traversal returning values by level.

### Framework 2: Level Order with State

```
┌─────────────────────────────────────────────────────┐
│  LEVEL ORDER WITH STATE FRAMEWORK                   │
├─────────────────────────────────────────────────────┤
│  1. Initialize: queue = [(root, 0)], result = []    │
│     (Store node along with depth/level)             │
│  2. While queue not empty:                           │
│     a. node, depth = dequeue()                       │
│     b. Process node with depth information          │
│     c. if node.left: enqueue((node.left, depth+1)) │
│     d. if node.right: enqueue((node.right, depth+1))│
│  3. Aggregate results by depth if needed            │
│  4. Return result                                    │
└─────────────────────────────────────────────────────┘
```

**When to use**: When you need depth/level information with each node.

### Framework 3: Modified BFS (Right Side View, Averages)

```
┌─────────────────────────────────────────────────────┐
│  MODIFIED BFS FRAMEWORK                             │
├─────────────────────────────────────────────────────┤
│  1. Initialize: queue = [root], result = []          │
│  2. While queue not empty:                           │
│     a. level_size = len(queue)                      │
│     b. level_data = [] or accumulator               │
│     c. For i in range(level_size):                   │
│        - node = dequeue()                             │
│        - Collect data: value, or specific property   │
│        - if i == level_size - 1: handle rightmost  │
│        - enqueue children                             │
│     d. Process level_data (average, max, etc.)      │
│     e. result.append(processed_data)                  │
│  3. Return result                                     │
└─────────────────────────────────────────────────────┘
```

**When to use**: Right side view, level averages, level maximums, etc.

---

## Forms

Different manifestations of BFS level order traversal.

### Form 1: Standard Level Order

Return nodes grouped by level.

```
Input:     1
          / \
         2   3
        / \   \
       4   5   6

Output: [[1], [2, 3], [4, 5, 6]]
```

### Form 2: Flat Level Order

Return all values in single list.

```
Input:     1
          / \
         2   3

Output: [1, 2, 3]
```

### Form 3: Zigzag Level Order

Alternate left-to-right and right-to-left.

```
Input:     1
          / \
         2   3
        / \   \
       4   5   6

Output: [[1], [3, 2], [4, 5, 6]]
```

### Form 4: Level Order with Depth

Return values with their depth.

```
Output: [(1, 0), (2, 1), (3, 1), (4, 2), (5, 2), (6, 2)]
```

### Form 5: Vertical Order

Group by column (horizontal distance from root).

```
Output: [[4], [2], [1, 5, 6], [3]]
(Column -2, -1, 0, 1)
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Tracking Level Boundaries

Use queue size to separate levels:

```python
from collections import deque

def level_order_with_level_info(root):
    """BFS with explicit level tracking."""
    if not root:
        return []
    
    result = []
    queue = deque([root])
    level = 0
    
    while queue:
        level_size = len(queue)
        print(f"Processing level {level}, {level_size} nodes")
        
        for i in range(level_size):
            node = queue.popleft()
            # Process node
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        level += 1
    
    return result
```

### Tactic 2: Right Side View

Capture last node at each level:

```python
def right_side_view(root):
    """Get rightmost node at each level."""
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        
        for i in range(level_size):
            node = queue.popleft()
            
            # Last node in this level
            if i == level_size - 1:
                result.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return result
```

### Tactic 3: Level Averages

Calculate average per level:

```python
def average_of_levels(root):
    """Calculate average value at each level."""
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        level_sum = 0
        
        for _ in range(level_size):
            node = queue.popleft()
            level_sum += node.val
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level_sum / level_size)
    
    return result
```

### Tactic 4: Connect Level Order Siblings

Connect nodes at same level:

```python
class Node:
    def __init__(self, val=0, left=None, right=None, next=None):
        self.val = val
        self.left = left
        self.right = right
        self.next = next  # Pointer to next right node

def connect_siblings(root):
    """Connect each node to its next right sibling."""
    if not root:
        return root
    
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        prev = None
        
        for i in range(level_size):
            node = queue.popleft()
            
            # Connect to previous node
            if prev:
                prev.next = node
            prev = node
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return root
```

### Tactic 5: Tree Serialization

Serialize tree using level order:

```python
def serialize(root):
    """Serialize tree to string using level order."""
    if not root:
        return ""
    
    result = []
    queue = deque([root])
    
    while queue:
        node = queue.popleft()
        
        if node:
            result.append(str(node.val))
            queue.append(node.left)
            queue.append(node.right)
        else:
            result.append("null")
    
    # Remove trailing nulls
    while result and result[-1] == "null":
        result.pop()
    
    return ",".join(result)


def deserialize(data):
    """Deserialize string to tree using level order."""
    if not data:
        return None
    
    values = data.split(",")
    root = TreeNode(int(values[0]))
    queue = deque([root])
    i = 1
    
    while queue and i < len(values):
        node = queue.popleft()
        
        # Left child
        if i < len(values) and values[i] != "null":
            node.left = TreeNode(int(values[i]))
            queue.append(node.left)
        i += 1
        
        # Right child
        if i < len(values) and values[i] != "null":
            node.right = TreeNode(int(values[i]))
            queue.append(node.right)
        i += 1
    
    return root
```

---

## Python Templates

### Template 1: Basic Level Order Traversal

```python
from collections import deque
from typing import List, Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def level_order(root: Optional[TreeNode]) -> List[List[int]]:
    """
    Standard level order traversal.
    Returns nodes grouped by level.
    
    Time: O(n), Space: O(w) where w is max width
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
```

### Template 2: Right Side View

```python
def right_side_view(root: Optional[TreeNode]) -> List[int]:
    """
    Get rightmost node at each level.
    
    Time: O(n), Space: O(w)
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        
        for i in range(level_size):
            node = queue.popleft()
            
            # Last node at this level
            if i == level_size - 1:
                result.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return result
```

### Template 3: Average of Levels

```python
def average_of_levels(root: Optional[TreeNode]) -> List[float]:
    """
    Calculate average value at each level.
    
    Time: O(n), Space: O(w)
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        level_sum = 0
        
        for _ in range(level_size):
            node = queue.popleft()
            level_sum += node.val
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level_sum / level_size)
    
    return result
```

### Template 4: Zigzag Level Order

```python
def zigzag_level_order(root: Optional[TreeNode]) -> List[List[int]]:
    """
    Level order with alternating left-to-right and right-to-left.
    
    Time: O(n), Space: O(w)
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    left_to_right = True
    
    while queue:
        level_size = len(queue)
        current_level = deque()
        
        for _ in range(level_size):
            node = queue.popleft()
            
            if left_to_right:
                current_level.append(node.val)
            else:
                current_level.appendleft(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(list(current_level))
        left_to_right = not left_to_right
    
    return result
```

### Template 5: Connect Nodes at Same Level

```python
class Node:
    def __init__(self, val=0, left=None, right=None, next=None):
        self.val = val
        self.left = left
        self.right = right
        self.next = next  # Pointer to next right node

def connect(root: Optional[Node]) -> Optional[Node]:
    """
    Connect each node to its next right sibling.
    
    Time: O(n), Space: O(w)
    """
    if not root:
        return root
    
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        prev = None
        
        for _ in range(level_size):
            node = queue.popleft()
            
            if prev:
                prev.next = node
            prev = node
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return root
```

### Template 6: Maximum Width of Binary Tree

```python
def width_of_binary_tree(root: Optional[TreeNode]) -> int:
    """
    Find maximum width of binary tree.
    Width = number of nodes at the widest level.
    
    Time: O(n), Space: O(w)
    """
    if not root:
        return 0
    
    max_width = 0
    # Store (node, position) where position follows heap indexing
    queue = deque([(root, 0)])
    
    while queue:
        level_size = len(queue)
        _, first_pos = queue[0]
        
        for _ in range(level_size):
            node, pos = queue.popleft()
            
            if node.left:
                queue.append((node.left, 2 * pos))
            if node.right:
                queue.append((node.right, 2 * pos + 1))
        
        # Width = last_pos - first_pos + 1
        _, last_pos = queue[-1] if queue else (None, first_pos)
        max_width = max(max_width, last_pos - first_pos + 1)
    
    return max_width
```

### Template 7: Minimum Depth

```python
def min_depth(root: Optional[TreeNode]) -> int:
    """
    Find minimum depth (shortest path to leaf).
    
    Time: O(n), Space: O(w)
    """
    if not root:
        return 0
    
    queue = deque([(root, 1)])
    
    while queue:
        node, depth = queue.popleft()
        
        # First leaf encountered is at minimum depth
        if not node.left and not node.right:
            return depth
        
        if node.left:
            queue.append((node.left, depth + 1))
        if node.right:
            queue.append((node.right, depth + 1))
    
    return 0
```

### Template 8: Deepest Leaves Sum

```python
def deepest_leaves_sum(root: Optional[TreeNode]) -> int:
    """
    Sum of values of all deepest leaves.
    
    Time: O(n), Space: O(w)
    """
    if not root:
        return 0
    
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        level_sum = 0
        
        for _ in range(level_size):
            node = queue.popleft()
            level_sum += node.val
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    # After loop, level_sum is sum of last level (deepest)
    return level_sum
```

---

## When to Use

Use the BFS Level Order algorithm when you need to solve problems involving:

- **Level-by-Level Processing**: Computing statistics per level (average, sum, max)
- **Shortest Path in Unweighted Trees/Graphs**: Minimum depth, closest target
- **Tree Width**: Finding maximum width, level with most nodes
- **Serialization/Deserialization**: Converting tree to/from string representation
- **Sibling Connections**: Connecting nodes at the same level

### Comparison with Alternatives

| Algorithm | Use Case | Time | Space | Notes |
|-----------|----------|------|-------|-------|
| **BFS Level Order** | Level-by-level, shortest path | O(n) | O(w) | w = max width |
| **DFS Pre-order** | Path finding, tree construction | O(n) | O(h) | h = height |
| **DFS In-order** | BST traversal, sorted output | O(n) | O(h) | h = height |
| **DFS Post-order** | Tree evaluation, deletion | O(n) | O(h) | h = height |

### When to Choose BFS vs DFS

- **Choose BFS Level Order** when:
  - Finding shortest path in unweighted structures
  - Computing level-wise statistics (averages, sums)
  - Tree width or level-related queries
  - Level-order reconstruction of trees
  - Problems where closer nodes should be processed first

- **Choose DFS** when:
  - Finding all paths or valid configurations
  - Tree depth-related problems
  - Memory is limited (DFS uses O(h) vs O(w) for BFS)
  - Recursive solutions are cleaner

---

## Algorithm Explanation

### Core Concept

The key insight behind BFS Level Order traversal is using a **queue** data structure to maintain the order of nodes to be processed. Since a queue follows FIFO (First-In-First-Out) principle:

1. When we discover a node, we add its children to the end of the queue
2. Nodes are processed from the front of the queue
3. This ensures all nodes at depth d are processed before any node at depth d+1

### How It Works

#### Basic Algorithm:
1. **Initialize**: Add the root node to a queue
2. **Process Level**: While queue is not empty:
   - Determine the number of nodes at current level (queue size)
   - Process all nodes at current level (dequeue, process, enqueue children)
3. **Move to Next Level**: After processing all nodes at current level, proceed to the next
4. **Termination**: Continue until queue is empty

### Visual Representation

For a binary tree:
```
        1           ← Level 0 (root)
       / \
      2   3         ← Level 1
     / \   \
    4   5   6       ← Level 2

Queue States:
Step 1: [1]           → Process 1, add children
Step 2: [2, 3]        → Process 2,3, add their children
Step 3: [4, 5, 6]     → Process 4,5,6, no children
Step 4: []            → Done!

Output: [[1], [2, 3], [4, 5, 6]]
```

### Why It Works

- **FIFO Property**: The queue naturally orders nodes by discovery time
- **Level Separation**: By processing all nodes of current queue size, we ensure level boundaries
- **Left-to-Right**: Adding left child first, then right child ensures left-to-right ordering within each level

### Limitations

- **Space Complexity**: O(w) where w is maximum width. For complete binary trees, w = O(n/2) = O(n)
- **Not suitable for**: Deep narrow trees (DFS uses O(h) = O(log n) for balanced trees)
- **No backtracking**: Once processed, cannot easily revisit parent context

---

## Practice Problems

### Problem 1: Binary Tree Level Order Traversal

**Problem:** [LeetCode 102 - Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)

**Description:** Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).

**How to Apply BFS Level Order:**
- Use the standard BFS pattern with queue
- Track level size at each iteration
- Group nodes by their level in the result
- Time: O(n), Space: O(w)

---

### Problem 2: Binary Tree Right Side View

**Problem:** [LeetCode 199 - Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view/)

**Description:** Given the root of a binary tree, imagine yourself standing on the right side of it. Return the values of the nodes you can see ordered from top to bottom.

**How to Apply BFS Level Order:**
- Use BFS to traverse level by level
- Capture the last node value at each level (rightmost)
- The rightmost node at each level is visible from the right side
- Time: O(n), Space: O(w)

---

### Problem 3: Maximum Width of Binary Tree

**Problem:** [LeetCode 662 - Maximum Width of Binary Tree](https://leetcode.com/problems/maximum-width-of-binary-tree/)

**Description:** Given the root of a binary tree, return the maximum width of the given tree. The maximum width of a tree is the maximum width among all levels. Width is the length between the leftmost and rightmost non-null nodes.

**How to Apply BFS Level Order:**
- Use BFS with position tracking for each node
- Assign positions using heap indexing: left child = 2*pos, right child = 2*pos + 1
- Width = rightmost_position - leftmost_position + 1
- Use large integers to avoid overflow for deep trees

---

### Problem 4: Average of Levels in Binary Tree

**Problem:** [LeetCode 637 - Average of Levels in Binary Tree](https://leetcode.com/problems/average-of-levels-in-binary-tree/)

**Description:** Given the root of a binary tree, return the average value of the nodes on each level in the form of an array.

**How to Apply BFS Level Order:**
- Use BFS to process level by level
- Accumulate sum of all values at each level
- Divide by level size to get average
- Return array of averages
- Time: O(n), Space: O(w)

---

### Problem 5: Populating Next Right Pointers in Each Node

**Problem:** [LeetCode 116 - Populating Next Right Pointers in Each Node](https://leetcode.com/problems/populating-next-right-pointers-in-each-node/)

**Description:** You are given a perfect binary tree where all leaves are on the same level, and every parent has two children. Populate each next pointer to point to its next right node. If there is no next right node, the next pointer should be set to NULL.

**How to Apply BFS Level Order:**
- Use BFS level order traversal
- Maintain reference to previous node at same level
- Connect previous node's next to current node
- Time: O(n), Space: O(w)

---

## Video Tutorial Links

### Fundamentals

- [BFS Level Order Traversal (Take U Forward)](https://www.youtube.com/watch?v=3QZJ7T0J5Qk) - Comprehensive introduction to BFS
- [Binary Tree Level Order Traversal (NeetCode)](https://www.youtube.com/watch?v=U7V0qJ9x-78) - Practical implementation guide
- [BFS vs DFS (WilliamFiset)](https://www.youtube.com/watch?v=oHWzG6ivqvU) - When to use which traversal

### Problem-Specific

- [LeetCode 102 Solution](https://www.youtube.com/watch?v=5_02ws-cekg) - Level order traversal
- [LeetCode 199 Solution](https://www.youtube.com/watch?v=TmZW1t2c7wE) - Right side view
- [LeetCode 662 Solution](https://www.youtube.com/watch?v=7y2GPJ0YGEE) - Maximum width
- [LeetCode 116 Solution](https://www.youtube.com/watch?v=U4hFQFo1xP4) - Connecting siblings

---

## Follow-up Questions

### Q1: What is the difference between BFS and DFS for tree traversal?

**Answer:**
- **BFS (Level Order)**: Uses a queue, visits nodes level by level from top to bottom
  - Good for: shortest path, level statistics, problems requiring proximity
  - Space: O(w) where w is maximum width of tree
  - Time: O(n)

- **DFS**: Uses recursion/stack, visits depth-first (go as deep as possible before backtracking)
  - Good for: path finding, tree construction, memory-constrained environments
  - Space: O(h) where h is height of tree
  - Time: O(n)

For balanced trees: BFS uses O(n) space, DFS uses O(log n) space.
For skewed trees: BFS uses O(1) space, DFS uses O(n) space.

### Q2: Can BFS be implemented recursively?

**Answer:** BFS is inherently iterative due to the queue data structure. While you can simulate BFS using recursion with an explicit stack or by using level-order DFS, the iterative approach with an explicit queue is the standard and most efficient implementation. Recursion implies a stack (LIFO) which gives DFS behavior, not BFS behavior.

### Q3: How do you handle very wide trees in BFS?

**Answer:** Strategies for wide trees:
- Use a deque for O(1) append/pop from both ends
- Process levels in streaming fashion without storing entire result
- Use position indexing (integers) instead of storing actual node references
- For extremely wide trees, consider using a generator that yields nodes level by level
- Use long integers for position tracking to avoid overflow

### Q4: When should you use BFS over DFS for trees?

**Answer:** Use BFS when:
- Finding shortest path in unweighted tree/graph (minimum depth, closest target)
- Need level-by-level results or statistics (averages, sums per level)
- Tree width is important (maximum width problems)
- Processing order should prioritize shallower nodes
- Level-order serialization is needed

Use DFS when:
- Finding all paths or specific path requirements
- Memory is limited (deep trees, BFS would use too much memory)
- Recursive solution is cleaner (tree DP, path tracking)
- Working with BSTs (inorder traversal for sorted order)

### Q5: How does BFS handle null children in complete binary trees?

**Answer:** For complete binary trees and serialization:
- Explicitly check for null before adding to queue
- For serialization, use special markers (like "null" or "#") to preserve tree structure
- Use array representation where index i has children at 2i+1 and 2i+2
- During deserialization, use these markers to reconstruct the tree accurately
- The queue naturally handles sparse trees with null children

---

## Summary

BFS Level Order Traversal is a fundamental algorithm for tree and graph problems. Key takeaways:

- **Queue-based**: Uses FIFO property to process nodes level by level
- **O(n) time**: Each node visited exactly once
- **O(w) space**: Queue holds at most one level (maximum width)
- **Versatile**: Forms basis for many tree problems including shortest path, level statistics, and serialization

When to use:
- ✅ Level-by-level traversal or statistics (averages, sums, maximums)
- ✅ Shortest path in unweighted structures (minimum depth, closest target)
- ✅ Tree width calculations
- ✅ Level-order serialization/deserialization
- ✅ Connecting nodes at the same level
- ❌ Deep trees with limited memory (use DFS instead)
- ❌ Problems requiring path exploration or backtracking (use DFS)

This algorithm is essential for competitive programming and technical interviews, particularly in problems involving binary trees, graph traversal, and shortest path calculations in unweighted graphs.
