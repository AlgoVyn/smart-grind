# Tree Ring Order Traversal

## Category
Trees

## Description

Tree Ring Order Traversal (also known as Level Order or Breadth-First traversal) visits nodes in concentric rings from the root outward, similar to the growth rings of a tree trunk. This pattern processes all nodes at depth 0 (root), then depth 1 (children of root), then depth 2 (grandchildren), and so on.

This traversal is fundamental for problems requiring level-by-level processing, tree visualization, and breadth-first exploration. Unlike depth-first traversals that go deep before going wide, ring order ensures all nodes at a given depth are processed before moving deeper. This property makes it essential for finding shortest paths in unweighted trees, computing level-wise statistics, and problems involving horizontal relationships between nodes.

---

## Concepts

The ring order traversal is built on fundamental queue-based processing and tree depth concepts.

### 1. Level/Depth Concepts

| Term | Definition | Example |
|------|------------|---------|
| **Root Level** | Depth 0, starting point | Single root node |
| **Level k** | All nodes k edges from root | Children at level 1 |
| **Tree Height** | Maximum level + 1 | Deepest leaf's level + 1 |
| **Width** | Maximum nodes at any level | Widest ring size |

### 2. Queue-Based Processing

FIFO (First-In-First-Out) processing ensures level order:

```
Queue evolution during traversal:

Start:  [root]
Level 0: Process root, add children
         [child1, child2]
Level 1: Process children, add grandchildren
         [grandchild1, grandchild2, grandchild3]
Level 2: Process grandchildren
         [...]
```

### 3. Level Size Tracking

Processing by level groups requires tracking level boundaries:

```
For each level:
  1. Record current queue size = nodes at this level
  2. Process exactly that many nodes
  3. Add children to queue (next level)
  4. Queue now contains only next level nodes
```

### 4. Ring Order Variations

| Variation | Description | Use Case |
|-----------|-------------|----------|
| **Standard** | Left-to-right per level | Default processing |
| **Zigzag** | Alternate directions | Spiral visualization |
| **Vertical** | Group by column, then level | Column-wise operations |
| **Bottom-up** | Process from leaves to root | Propagation problems |

---

## Frameworks

Structured approaches for ring order traversal.

### Framework 1: Standard Ring Order

```
┌─────────────────────────────────────────────────────────────┐
│  STANDARD RING ORDER TRAVERSAL                              │
├─────────────────────────────────────────────────────────────┤
│  Input: root of binary or n-ary tree                        │
│  Output: List of levels, each containing node values        │
│                                                              │
│  1. If root is null, return empty list                      │
│  2. Initialize queue with root                              │
│  3. Initialize result list                                  │
│  4. While queue not empty:                                   │
│     a. level_size = queue.size()                            │
│     b. current_level = []                                   │
│     c. For i = 0 to level_size-1:                          │
│        - node = queue.dequeue()                             │
│        - current_level.append(node.value)                   │
│        - For each child of node:                           │
│           * queue.enqueue(child)                            │
│     d. result.append(current_level)                         │
│  5. Return result                                             │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Standard level-by-level processing.

### Framework 2: Zigzag (Spiral) Ring Order

```
┌─────────────────────────────────────────────────────────────┐
│  ZIGZAG RING ORDER TRAVERSAL                                │
├─────────────────────────────────────────────────────────────┤
│  Same as standard, but with direction toggle:               │
│                                                              │
│  1. Initialize left_to_right = true                         │
│  2. For each level:                                         │
│     a. Collect nodes as in standard framework               │
│     b. If not left_to_right:                               │
│        - Reverse current_level                              │
│     c. Append to result                                     │
│     d. Toggle: left_to_right = !left_to_right              │
│  3. Return result                                             │
│                                                              │
│  Optimization: Use deque and appendleft for O(1) reverse    │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Spiral or alternating direction visualization.

### Framework 3: Ring Order with Aggregation

```
┌─────────────────────────────────────────────────────────────┐
│  RING ORDER WITH LEVEL AGGREGATION                          │
├─────────────────────────────────────────────────────────────┤
│  Compute statistics per level:                                │
│                                                              │
│  1. Standard ring order traversal                           │
│  2. For each level, compute:                                │
│     a. Sum: Add all node values                             │
│     b. Average: Sum / count                                 │
│     c. Max/Min: Track extremes                              │
│     d. Count: Number of nodes                               │
│  3. Return aggregation results per level                    │
│                                                              │
│  Common aggregations:                                        │
│  - Level sums (sum of each ring)                            │
│  - Level averages                                           │
│  - Maximum value per level                                  │
│  - Right-side view (last node per level)                  │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: Level-wise statistics and summaries.

### Framework 4: Connect Nodes at Same Level

```
┌─────────────────────────────────────────────────────────────┐
│  CONNECTING LEVEL SIBLINGS                                  │
├─────────────────────────────────────────────────────────────┤
│  Link each node to its next sibling at same level:          │
│                                                              │
│  1. Standard ring order with level tracking                 │
│  2. For each level:                                         │
│     a. Track previous node = null                           │
│     b. For each node in level:                             │
│        - If previous exists:                               │
│          previous.next = current                           │
│        - previous = current                                │
│     c. Last node's next remains null                        │
│  3. Return modified tree                                    │
│                                                              │
│  Result: Each node has a "next" pointer to right sibling  │
└─────────────────────────────────────────────────────────────┘
```

**When to use**: When horizontal connections are needed.

---

## Forms

Different manifestations of ring order traversal.

### Form 1: Binary Tree Ring Order

Standard binary tree with left and right children.

| Aspect | Details |
|--------|---------|
| **Children** | At most 2 (left and right) |
| **Queue additions** | Add left if exists, then right |
| **LeetCode** | Problem 102 - Binary Tree Level Order |
| **Complexity** | O(n) time, O(w) space where w = max width |

### Form 2: N-ary Tree Ring Order

Tree where nodes can have any number of children.

| Modification | Iterate through all children list |
|--------------|-----------------------------------|
| **Structure** | node.children = list of nodes |
| **LeetCode** | Problem 429 - N-ary Tree Level Order |
| **Flexibility** | Handles arbitrary branching factor |

### Form 3: Zigzag Ring Order

Alternate left-to-right and right-to-left per level.

| Modification | Reverse every other level, or use deque |
|--------------|-----------------------------------------|
| **LeetCode** | Problem 103 - Binary Tree Zigzag |
| **Direction** | Level 0: L→R, Level 1: R→L, etc. |

### Form 4: Vertical Ring Order

Group by column first, then by level.

| Modification | Track column indices during traversal |
|--------------|---------------------------------------|
| **Columns** | Root = 0, left = -1, right = +1 |
| **Sorting** | Sort by column, then by level |
| **LeetCode** | Problem 987 - Vertical Order Traversal |

### Form 5: Bottom-Up Ring Order

Process from leaves to root (reverse level order).

| Approach | Standard ring order, then reverse result |
|----------|------------------------------------------|
| **Use case** | Propagate information from leaves |
| **Alternative** | Track depths, group by max_depth - depth |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Standard Ring Order Implementation

Classic BFS for level-by-level processing:

```python
from collections import deque

def ring_order_traversal(root):
    """
    Standard ring order (level order) traversal.
    Returns list of levels.
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

**Key points**: Track level_size before processing, don't use while queue.

### Tactic 2: Zigzag Ring Order

Alternate directions efficiently:

```python
def zigzag_ring_order(root):
    """
    Ring order with alternating directions.
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    left_to_right = True
    
    while queue:
        level_size = len(queue)
        level = deque() if not left_to_right else []
        
        for _ in range(level_size):
            node = queue.popleft()
            
            if left_to_right:
                level.append(node.val)
            else:
                level.appendleft(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(list(level))
        left_to_right = not left_to_right
    
    return result
```

**Optimization**: Use deque and appendleft to avoid O(n) reverse.

### Tactic 3: Level-wise Aggregation

Compute statistics per level:

```python
def level_averages(root):
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

**Pattern**: Accumulate during level processing, compute after.

### Tactic 4: Right Side View

Get last node of each level:

```python
def right_side_view(root):
    """
    Return values visible from right side.
    (Last node at each level)
    """
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

**Insight**: Right side view = last element of each level.

---

## Python Templates

### Template 1: Binary Tree Ring Order

```python
from collections import deque
from typing import List, Optional


# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def level_order(root: Optional[TreeNode]) -> List[List[int]]:
    """
    LeetCode 102: Binary Tree Level Order Traversal
    
    Returns list of levels, each level is list of node values.
    
    Time: O(n) - visit each node once
    Space: O(w) - where w is maximum width of tree
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

### Template 2: N-ary Tree Ring Order

```python
from collections import deque
from typing import List


# Definition for a Node.
class Node:
    def __init__(self, val=None, children=None):
        self.val = val
        self.children = children if children is not None else []


def level_order_nary(root: 'Node') -> List[List[int]]:
    """
    LeetCode 429: N-ary Tree Level Order Traversal
    
    Handles trees where nodes can have any number of children.
    
    Time: O(n)
    Space: O(w)
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
            
            # Add all children
            for child in node.children:
                queue.append(child)
        
        result.append(current_level)
    
    return result
```

### Template 3: Zigzag Ring Order

```python
from collections import deque
from typing import List, Optional


def zigzag_level_order(root: Optional[TreeNode]) -> List[List[int]]:
    """
    LeetCode 103: Binary Tree Zigzag Level Order Traversal
    
    Alternates left-to-right and right-to-left at each level.
    
    Time: O(n)
    Space: O(w)
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    left_to_right = True
    
    while queue:
        level_size = len(queue)
        # Use deque for O(1) append from either end
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

### Template 4: Level-wise Maximum

```python
def largest_values(root: Optional[TreeNode]) -> List[int]:
    """
    LeetCode 515: Find Largest Value in Each Tree Row
    
    Returns maximum value at each level.
    
    Time: O(n)
    Space: O(w)
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        level_max = float('-inf')
        
        for _ in range(level_size):
            node = queue.popleft()
            level_max = max(level_max, node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level_max)
    
    return result
```

### Template 5: Connect Nodes at Same Level

```python
def connect(root: Optional['Node']) -> Optional['Node']:
    """
    LeetCode 116: Populating Next Right Pointers in Each Node
    
    Connects each node to its next right sibling.
    
    Time: O(n)
    Space: O(1) - uses already established next pointers
    """
    if not root:
        return None
    
    # Start with the leftmost node of each level
    leftmost = root
    
    while leftmost.left:
        # Traverse the current level using next pointers
        head = leftmost
        
        while head:
            # Connect left child to right child
            head.left.next = head.right
            
            # Connect right child to next node's left child
            if head.next:
                head.right.next = head.next.left
            
            head = head.next
        
        # Move to next level
        leftmost = leftmost.left
    
    return root


# Alternative using queue (works for non-perfect binary trees)
def connect_general(root: Optional['Node']) -> Optional['Node']:
    """Works for any binary tree structure."""
    if not root:
        return None
    
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

### Template 6: Vertical Order Traversal

```python
from collections import defaultdict, deque

def vertical_order(root: Optional[TreeNode]) -> List[List[int]]:
    """
    LeetCode 987: Vertical Order Traversal of a Binary Tree
    
    Groups nodes by column, maintaining level order within each column.
    
    Time: O(n log n) due to sorting columns
    Space: O(n)
    """
    if not root:
        return []
    
    # Map: column -> list of (row, value)
    columns = defaultdict(list)
    queue = deque([(root, 0, 0)])  # (node, column, row)
    
    while queue:
        node, col, row = queue.popleft()
        columns[col].append((row, node.val))
        
        if node.left:
            queue.append((node.left, col - 1, row + 1))
        if node.right:
            queue.append((node.right, col + 1, row + 1))
    
    # Sort by column, then by row within each column
    result = []
    for col in sorted(columns.keys()):
        # Sort by row, then by value for same position
        columns[col].sort()
        result.append([val for row, val in columns[col]])
    
    return result
```

---

## When to Use

Use Ring Order Traversal when you need to solve problems involving:

- **Level-by-level processing**: Computing statistics per depth level
- **Shortest path in unweighted trees**: BFS guarantees shortest path
- **Horizontal relationships**: Finding next siblings, right-side views
- **Visualization**: Displaying tree structure level by level
- **Propagation**: Information flowing breadth-first through tree
- **Width calculation**: Finding maximum nodes at any level

### Comparison with Depth-First Traversals

| Traversal | Order | Best For | Space |
|-----------|-------|----------|-------|
| **Ring Order (BFS)** | Level by level | Shortest path, level stats | O(w) width |
| **Preorder (DFS)** | Root, left, right | Copying tree, serialization | O(h) height |
| **Inorder (DFS)** | Left, root, right | BST sorting | O(h) height |
| **Postorder (DFS)** | Left, right, root | Deletion, bottom-up | O(h) height |

### When to Choose Ring Order vs Depth-First

- **Choose Ring Order** when:
  - You need shortest path (in unweighted tree)
  - Level-wise statistics are required
  - Processing order should be breadth before depth
  - Horizontal relationships matter (siblings)

- **Choose Depth-First** when:
  - You need to process all descendants before siblings
  - Space is constrained (DFS uses O(h) vs BFS O(w))
  - Tree is very wide (BFS queue could be large)
  - Path reconstruction from root is needed

---

## Algorithm Explanation

### Core Concept

Ring order traversal processes nodes in increasing order of their distance from the root. All nodes at distance k are processed before any node at distance k+1. This creates concentric "rings" around the root.

**Key Terminology**:
- **Level/Depth**: Number of edges from root to node
- **Width**: Maximum number of nodes at any single level
- **Queue**: FIFO data structure enabling level-order processing
- **Level Size**: Number of nodes at current depth

### How It Works

#### Standard Ring Order

1. **Initialize**: Add root to queue
2. **Process Level**: 
   - Record current queue size (nodes at this level)
   - Remove and process exactly that many nodes
   - Add each node's children to queue
3. **Repeat**: Continue until queue is empty

#### Why Queue Enables Ring Order

```
Visualization:

Initial:     [Root]
             Process: Root
             Add: A, B
             [A, B]

Level 1:     [A, B]
             Process: A (add C, D), B (add E)
             [C, D, E]
             
Level 2:     [C, D, E]
             Process: C, D, E
             ...
```

The FIFO property ensures all level-k nodes are enqueued before any level-(k+1) node is processed.

### Visual Walkthrough

**Example Tree**:
```
      1
     / \
    2   3
   / \   \
  4   5   6
```

**Ring Order Execution**:
```
Step 1: Queue = [1]
        Level 0: Process 1
        Add children: 2, 3
        Result: [[1]]

Step 2: Queue = [2, 3]
        Level 1: Process 2, 3
        Add children of 2: 4, 5
        Add children of 3: 6
        Result: [[1], [2, 3]]

Step 3: Queue = [4, 5, 6]
        Level 2: Process 4, 5, 6
        No children to add
        Result: [[1], [2, 3], [4, 5, 6]]

Final: [[1], [2, 3], [4, 5, 6]]
```

### Zigzag Variation

Same processing, but alternate level reversal:
- Level 0: [1] (left-to-right)
- Level 1: [3, 2] (right-to-left)
- Level 2: [4, 5, 6] (left-to-right)

### Time and Space Complexity

| Operation | Complexity | Explanation |
|-----------|------------|-------------|
| Time | O(n) | Visit each node exactly once |
| Space | O(w) | Queue holds at most one level |
| Worst space | O(n) | Complete binary tree last level has n/2 nodes |

### Limitations

- **Space for wide trees**: Queue can grow large for wide trees
- **Not for deep paths**: DFS is better for finding deep paths
- **No backtracking**: Cannot easily return to parent after children
- **Extra memory**: Requires queue storage vs DFS stack recursion

---

## Practice Problems

### Problem 1: Binary Tree Level Order Traversal

**Problem:** [LeetCode 102 - Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)

**Description:** Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).

**How to Apply:**
- Standard ring order template
- Process nodes level by level using queue
- Return list of lists grouping by level

---

### Problem 2: Binary Tree Zigzag Level Order

**Problem:** [LeetCode 103 - Binary Tree Zigzag Level Order Traversal](https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/)

**Description:** Given the root of a binary tree, return the zigzag level order traversal of its nodes' values (i.e., from left to right, then right to left for the next level and alternate between).

**How to Apply:**
- Standard ring order with direction toggle
- Use deque for O(1) appendleft
- Or reverse every other level before adding to result

---

### Problem 3: Average of Levels in Binary Tree

**Problem:** [LeetCode 637 - Average of Levels in Binary Tree](https://leetcode.com/problems/average-of-levels-in-binary-tree/)

**Description:** Given the root of a binary tree, return the average value of the nodes on each level.

**How to Apply:**
- Ring order traversal
- Sum values at each level
- Divide by level size for average

---

### Problem 4: Find Largest Value in Each Tree Row

**Problem:** [LeetCode 515 - Find Largest Value in Each Tree Row](https://leetcode.com/problems/find-largest-value-in-each-tree-row/)

**Description:** Given the root of a binary tree, return an array of the largest value in each row.

**How to Apply:**
- Ring order traversal
- Track maximum value at each level
- Add to result after processing each level

---

### Problem 5: Populating Next Right Pointers

**Problem:** [LeetCode 116 - Populating Next Right Pointers in Each Node](https://leetcode.com/problems/populating-next-right-pointers-in-each-node/)

**Description:** You are given a perfect binary tree where all leaves are on the same level, and every parent has two children. Populate each next pointer to point to its next right node.

**How to Apply:**
- Ring order traversal
- Connect each node to the next node in queue
- Or use O(1) space by following already established next pointers

---

### Problem 6: Vertical Order Traversal

**Problem:** [LeetCode 987 - Vertical Order Traversal of a Binary Tree](https://leetcode.com/problems/vertical-order-traversal-of-a-binary-tree/)

**Description:** Given the root of a binary tree, calculate the vertical order traversal of the binary tree. For each node at position (row, col), its left and right children will be at positions (row + 1, col - 1) and (row + 1, col + 1) respectively.

**How to Apply:**
- Ring order with column tracking
- Map column to list of (row, value) pairs
- Sort by column, then by row

---

## Video Tutorial Links

### Fundamentals

- [Binary Tree Level Order Traversal - NeetCode](https://www.youtube.com/watch?v=6ZnyE7gXC) - BFS explanation
- [Tree Traversals - Abdul Bari](https://www.youtube.com/watch?v=gm1S8L4T) - All traversal types
- [BFS vs DFS for Trees](https://www.youtube.com/watch?v=U1Rv)_EA - When to use each

### Problem Solutions

- [LeetCode 102 Solution](https://www.youtube.com/watch?v=TVo) - Level order implementation
- [LeetCode 103 Zigzag](https://www.youtube.com/watch?v=3klbG) - Spiral order
- [Vertical Order Traversal](https://www.youtube.com/watch?v=8rhC) - Column-based grouping

### Advanced Topics

- [Level Order Variations](https://www.youtube.com/watch?v=FAfRh6yy) - Different patterns
- [Tree BFS Patterns](https://www.youtube.com/watch?v=5i7oKodCRJo) - Common techniques

---

## Follow-up Questions

### Q1: What's the difference between ring order and depth-first traversal?

**Answer:** Ring order (BFS) processes nodes level by level, exploring all nodes at depth k before depth k+1. Depth-first goes deep first, fully exploring one branch before moving to siblings. Ring order uses a queue (FIFO); DFS uses a stack or recursion (LIFO).

---

### Q2: When would you use DFS instead of ring order?

**Answer:** Use DFS when: (1) Space is limited (DFS uses O(height) vs BFS O(width)), (2) You need to process descendants before siblings, (3) The tree is very wide (BFS queue would be huge), (4) Path reconstruction from root is needed.

---

### Q3: How do you handle very wide trees with ring order?

**Answer:** For extremely wide trees where the queue might consume too much memory: (1) Consider DFS if the problem allows, (2) Process levels one at a time without storing all results, (3) Use iterative deepening DFS which mimics BFS behavior with DFS space efficiency.

---

### Q4: Can ring order find the shortest path between two nodes?

**Answer:** Yes, in unweighted trees, the first time you encounter the target node during BFS, you've found the shortest path. This is a fundamental property of BFS. For finding the path itself, track parent pointers during traversal.

---

### Q5: How do you modify ring order for bottom-up processing?

**Answer:** Two approaches: (1) Do standard ring order and reverse the result list, (2) Track the maximum depth first, then process levels from max_depth down to 0. Some problems can use postorder DFS instead for true bottom-up (children processed before parent).

---

## Summary

Tree Ring Order Traversal (Level Order/BFS) is a fundamental tree algorithm that processes nodes in concentric depth levels from the root outward. It is essential for level-wise statistics, shortest path finding in unweighted trees, and problems requiring horizontal node relationships.

**Key Takeaways**:

1. **Queue-based**: FIFO processing ensures level-by-level order
2. **Track level size**: Process exactly queue.size() nodes per level
3. **O(n) time**: Each node visited exactly once
4. **O(w) space**: Queue holds at most widest level
5. **Versatile**: Standard, zigzag, vertical, and many variations

**When to Use**:
- Shortest path in unweighted trees
- Level-wise aggregation (sum, max, average)
- Horizontal connections (next sibling)
- Breadth-before-depth processing

**Common Variations**:
- Standard (left-to-right)
- Zigzag (alternating directions)
- Vertical (column-based)
- Bottom-up (leaves to root)

This pattern is fundamental for tree problems and appears frequently in coding interviews.
