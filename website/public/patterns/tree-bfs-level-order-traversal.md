# Tree BFS - Level Order Traversal

## Overview

Level order traversal, also known as **Breadth-First Search (BFS)** for trees, visits all nodes at each level before moving to the next level, processing nodes from left to right. This fundamental pattern is essential for solving many tree-related problems where level-by-level processing is required.

**Key Characteristics:**
- Processes nodes in increasing order of depth
- Maintains left-to-right order within each level
- Uses a queue data structure for FIFO processing
- Natural fit for problems requiring hierarchical understanding

**Why BFS Works for Trees:**
Trees have a natural hierarchical structure with parent-child relationships. BFS leverages this by starting at the root and systematically exploring all nodes at the current depth before moving deeper. This makes it ideal for problems where depth or level information is important.

---

## Intuition

### Core Insight

The key insight behind level order traversal is that **trees are naturally organized by levels**. By using a queue (First-In-First-Out), we can:

1. **Process nodes in FIFO order** - nodes discovered first are processed first
2. **Automatically group by level** - children of level N are discovered while processing level N
3. **Maintain hierarchical order** - left children are always enqueued before right children

### Queue Behavior During Traversal

Consider a simple tree:
```
        1
       / \
      2   3
     / \   \
    4   5   6
```

**Step-by-step queue evolution:**
1. Start: `[1]` → Process 1, enqueue 2, 3
2. After level 1: `[2, 3]` → Process 2, enqueue 4, 5; Process 3, enqueue 6
3. After level 2: `[4, 5, 6]` → Process all (no children)
4. Empty: `[]`

### Level Boundary Detection

The critical technique is **capturing queue size at each level start**:
```python
level_size = len(queue)  # BEFORE processing current level
for _ in range(level_size):  # Process exactly this many nodes
```

This ensures we process all nodes at current level while their children (next level) are added to the queue.

### Why Queue Over Recursion?

While DFS can be implemented recursively, BFS requires a queue because:
- Recursion implicitly uses a stack (LIFO) for DFS order
- BFS needs FIFO behavior to process nodes level by level
- Queue naturally tracks multiple branches simultaneously

---

## Multiple Approaches

### Approach 1: Standard Level Order Traversal

**Description:** The fundamental BFS approach using queue size tracking to process one level at a time.

**Use Case:** General level order traversal, computing level-based aggregates.

**Key Steps:**
1. Initialize queue with root
2. While queue not empty:
   - Get current level size
   - Process all nodes at current level
   - Enqueue children for next level

````carousel
```python
from collections import deque
from typing import List, Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val: int = 0, left: Optional['TreeNode'] = None, 
                 right: Optional['TreeNode'] = None):
        self.val = val
        self.left = left
        self.right = right

def level_order_traversal(root: Optional[TreeNode]) -> List[List[int]]:
    """
    Perform level order traversal of a binary tree.
    
    Args:
        root: Root node of the binary tree
        
    Returns:
        List of lists containing node values by level
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

<!-- slide -->
```cpp
#include <queue>
#include <vector>

// Definition for a binary tree node.
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

std::vector<std::vector<int>> levelOrder(TreeNode* root) {
    if (!root) {
        return {};
    }
    
    std::vector<std::vector<int>> result;
    std::queue<TreeNode*> queue;
    queue.push(root);
    
    while (!queue.empty()) {
        int levelSize = queue.size();
        std::vector<int> currentLevel;
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode* node = queue.front();
            queue.pop();
            currentLevel.push_back(node->val);
            
            if (node->left) {
                queue.push(node->left);
            }
            if (node->right) {
                queue.push(node->right);
            }
        }
        
        result.push_back(currentLevel);
    }
    
    return result;
}
```

<!-- slide -->
```java
import java.util.*;

// Definition for a binary tree node.
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Solution {
    public List<List<Integer>> levelOrder(TreeNode root) {
        if (root == null) {
            return new ArrayList<>();
        }
        
        List<List<Integer>> result = new ArrayList<>();
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            List<Integer> currentLevel = new ArrayList<>();
            
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                currentLevel.add(node.val);
                
                if (node.left != null) {
                    queue.offer(node.left);
                }
                if (node.right != null) {
                    queue.offer(node.right);
                }
            }
            
            result.add(currentLevel);
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
/**
 * Definition for a binary tree node.
 * @param {number} val
 * @param {TreeNode|null} left
 * @param {TreeNode|null} right
 */
function TreeNode(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
}

/**
 * Perform level order traversal of a binary tree.
 * @param {TreeNode|null} root - Root node of the binary tree
 * @return {number[][]} - Array of arrays containing node values by level
 */
var levelOrder = function(root) {
    if (!root) {
        return [];
    }
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.push(node.val);
            
            if (node.left) {
                queue.push(node.left);
            }
            if (node.right) {
                queue.push(node.right);
            }
        }
        
        result.push(currentLevel);
    }
    
    return result;
};
```
````

---

### Approach 2: Two Queue Method

**Description:** Uses two queues - one for current level, one for next level. Simpler to understand but uses more memory.

**Use Case:** Educational purposes, easier to visualize level boundaries.

**Key Steps:**
1. Use `current_queue` for current level nodes
2. Use `next_queue` for children
3. Swap queues when current level is complete

````carousel
```python
from collections import deque
from typing import List, Optional

class TreeNode:
    def __init__(self, val: int = 0, left: Optional['TreeNode'] = None, 
                 right: Optional['TreeNode'] = None):
        self.val = val
        self.left = left
        self.right = right

def level_order_two_queues(root: Optional[TreeNode]) -> List[List[int]]:
    """
    Level order traversal using two queues.
    
    Args:
        root: Root node of the binary tree
        
    Returns:
        List of lists containing node values by level
    """
    if not root:
        return []
    
    result = []
    current_queue = deque([root])
    
    while current_queue:
        current_level = []
        next_queue = deque()
        
        while current_queue:
            node = current_queue.popleft()
            current_level.append(node.val)
            
            if node.left:
                next_queue.append(node.left)
            if node.right:
                next_queue.append(node.right)
        
        result.append(current_level)
        current_queue = next_queue
    
    return result
```

<!-- slide -->
```cpp
#include <queue>
#include <vector>

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

std::vector<std::vector<int>> levelOrderTwoQueues(TreeNode* root) {
    if (!root) {
        return {};
    }
    
    std::vector<std::vector<int>> result;
    std::queue<TreeNode*> currentQueue;
    std::queue<TreeNode*> nextQueue;
    
    currentQueue.push(root);
    
    while (!currentQueue.empty()) {
        std::vector<int> currentLevel;
        
        while (!currentQueue.empty()) {
            TreeNode* node = currentQueue.front();
            currentQueue.pop();
            currentLevel.push_back(node->val);
            
            if (node->left) {
                nextQueue.push(node->left);
            }
            if (node->right) {
                nextQueue.push(node->right);
            }
        }
        
        result.push_back(currentLevel);
        currentQueue = nextQueue;
    }
    
    return result;
}
```

<!-- slide -->
```java
import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Solution {
    public List<List<Integer>> levelOrderTwoQueues(TreeNode root) {
        if (root == null) {
            return new ArrayList<>();
        }
        
        List<List<Integer>> result = new ArrayList<>();
        Queue<TreeNode> currentQueue = new LinkedList<>();
        Queue<TreeNode> nextQueue = new LinkedList<>();
        
        currentQueue.offer(root);
        
        while (!currentQueue.isEmpty()) {
            List<Integer> currentLevel = new ArrayList<>();
            
            while (!currentQueue.isEmpty()) {
                TreeNode node = currentQueue.poll();
                currentLevel.add(node.val);
                
                if (node.left != null) {
                    nextQueue.offer(node.left);
                }
                if (node.right != null) {
                    nextQueue.offer(node.right);
                }
            }
            
            result.add(currentLevel);
            currentQueue = nextQueue;
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
function TreeNode(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
}

var levelOrderTwoQueues = function(root) {
    if (!root) {
        return [];
    }
    
    const result = [];
    let currentQueue = [root];
    let nextQueue = [];
    
    while (currentQueue.length > 0) {
        const currentLevel = [];
        
        while (currentQueue.length > 0) {
            const node = currentQueue.shift();
            currentLevel.push(node.val);
            
            if (node.left) {
                nextQueue.push(node.left);
            }
            if (node.right) {
                nextQueue.push(node.right);
            }
        }
        
        result.push(currentLevel);
        currentQueue = nextQueue;
        nextQueue = [];
    }
    
    return result;
};
```
````

---

### Approach 3: Level Size Tracking with Depth

**Description:** Extended version that tracks depth alongside node values, useful for depth-specific operations.

**Use Case:** Problems requiring depth information, level-based filtering.

**Key Steps:**
1. Track current depth
2. Initialize result with empty list for each level
3. Add nodes to corresponding depth index

````carousel
```python
from collections import deque
from typing import List, Optional

class TreeNode:
    def __init__(self, val: int = 0, left: Optional['TreeNode'] = None, 
                 right: Optional['TreeNode'] = None):
        self.val = val
        self.left = left
        self.right = right

def level_order_with_depth(root: Optional[TreeNode]) -> List[List[int]]:
    """
    Level order traversal that also returns depth information.
    
    Returns:
        List of lists with values and their depths
    """
    if not root:
        return []
    
    result = []
    queue = deque([(root, 0)])  # (node, depth) tuples
    
    while queue:
        node, depth = queue.popleft()
        
        # Ensure result has enough levels
        while len(result) <= depth:
            result.append([])
        
        result[depth].append(node.val)
        
        if node.left:
            queue.append((node.left, depth + 1))
        if node.right:
            queue.append((node.right, depth + 1))
    
    return result
```

<!-- slide -->
```cpp
#include <queue>
#include <vector>
#include <utility>

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

std::vector<std::vector<int>> levelOrderWithDepth(TreeNode* root) {
    if (!root) {
        return {};
    }
    
    std::vector<std::vector<int>> result;
    std::queue<std::pair<TreeNode*, int>> queue;
    queue.push({root, 0});
    
    while (!queue.empty()) {
        auto [node, depth] = queue.front();
        queue.pop();
        
        if (depth >= result.size()) {
            result.push_back({});
        }
        
        result[depth].push_back(node->val);
        
        if (node->left) {
            queue.push({node->left, depth + 1});
        }
        if (node->right) {
            queue.push({node->right, depth + 1});
        }
    }
    
    return result;
}
```

<!-- slide -->
```java
import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Solution {
    public List<List<Integer>> levelOrderWithDepth(TreeNode root) {
        if (root == null) {
            return new ArrayList<>();
        }
        
        List<List<Integer>> result = new ArrayList<>();
        Queue<Pair<TreeNode, Integer>> queue = new LinkedList<>();
        queue.offer(new Pair<>(root, 0));
        
        while (!queue.isEmpty()) {
            Pair<TreeNode, Integer> pair = queue.poll();
            TreeNode node = pair.getKey();
            int depth = pair.getValue();
            
            if (depth >= result.size()) {
                result.add(new ArrayList<>());
            }
            
            result.get(depth).add(node.val);
            
            if (node.left != null) {
                queue.offer(new Pair<>(node.left, depth + 1));
            }
            if (node.right != null) {
                queue.offer(new Pair<>(node.right, depth + 1));
            }
        }
        
        return result;
    }
}
```

<!-- slide -->
```javascript
function TreeNode(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
}

var levelOrderWithDepth = function(root) {
    if (!root) {
        return [];
    }
    
    const result = [];
    const queue = [{ node: root, depth: 0 }];
    
    while (queue.length > 0) {
        const { node, depth } = queue.shift();
        
        if (!result[depth]) {
            result[depth] = [];
        }
        
        result[depth].push(node.val);
        
        if (node.left) {
            queue.push({ node: node.left, depth: depth + 1 });
        }
        if (node.right) {
            queue.push({ node: node.right, depth: depth + 1 });
        }
    }
    
    return result;
};
```
````

---

## Time and Space Complexity

| Complexity | Standard BFS | Two Queue | Depth Tracking |
|------------|--------------|-----------|----------------|
| **Time** | O(n) | O(n) | O(n) |
| **Space** | O(w) | O(w) | O(w) |

**Where:**
- `n` = number of nodes in the tree
- `w` = maximum width of the tree (widest level)
- In worst case (complete binary tree): `w = O(n)`

**Space Breakdown:**
- Queue stores at most one full level at a time
- Complete binary tree: last level has ~n/2 nodes
- Skewed tree: only 1 node per level (O(h) space)

---

## Common Pitfalls

### 1. Forgetting to Handle Empty Trees
**Problem:** Runtime errors when root is null
**Solution:** Always check `if not root:` at the beginning

### 2. Incorrect Level Grouping
**Problem:** Nodes from different levels mixed together
**Solution:** Use `level_size = len(queue)` BEFORE the inner loop to capture the exact number of nodes at current level

### 3. Space Issues with Wide Trees
**Problem:** Queue grows large for trees with many nodes per level
**Solution:** Be aware of memory constraints; consider iterative DFS for better space in some cases

### 4. Not Enqueuing Children Properly
**Problem:** Wrong left-right order or missing children
**Solution:** Always check and enqueue left before right; check for null children

### 5. Modifying Queue During Iteration
**Problem:** Using `for node in queue:` instead of `for _ in range(level_size):`
**Solution:** Use index-based loop to avoid processing newly added children in the same level

---

## Related LeetCode Problems

| Problem | Difficulty | Description | Link |
|---------|------------|-------------|------|
| Binary Tree Level Order Traversal | Easy | Standard level order traversal | [LeetCode 102](https://leetcode.com/problems/binary-tree-level-order-traversal/) |
| Binary Tree Level Order Traversal II | Easy | Bottom-up level order | [LeetCode 107](https://leetcode.com/problems/binary-tree-level-order-traversal-ii/) |
| Maximum Level Sum of a Binary Tree | Medium | Find level with max sum | [LeetCode 1161](https://leetcode.com/problems/maximum-level-sum-of-a-binary-tree/) |
| Find Largest Value in Each Tree Row | Medium | Max value per level | [LeetCode 515](https://leetcode.com/problems/find-largest-value-in-each-tree-row/) |
| Populating Next Right Pointers in Each Node | Medium | Connect nodes at same level | [LeetCode 116](https://leetcode.com/problems/populating-next-right-pointers-in-each-node/) |
| Average of Levels in Binary Tree | Easy | Average value per level | [LeetCode 637](https://leetcode.com/problems/average-of-levels-in-binary-tree/) |
| N-ary Tree Level Order Traversal | Medium | BFS for N-ary trees | [LeetCode 429](https://leetcode.com/problems/n-ary-tree-level-order-traversal/) |
| Check Completeness of a Binary Tree | Medium | Check if tree is complete | [LeetCode 958](https://leetcode.com/problems/check-completeness-of-a-binary-tree/) |
| Minimum Depth of Binary Tree | Easy | Find minimum depth | [LeetCode 111](https://leetcode.com/problems/minimum-depth-of-binary-tree/) |
| Maximum Depth of Binary Tree | Easy | Find maximum depth | [LeetCode 104](https://leetcode.com/problems/maximum-depth-of-binary-tree/) |

---

## Video Tutorials

### Recommended Videos

1. **NeetCode - Binary Tree Level Order Traversal**
   - Comprehensive walkthrough of BFS traversal
   - Time Complexity: ~10 minutes
   - [Watch on YouTube](https://www.youtube.com/watch?v=6EyM4Kj5qbw)

2. **Abdul Bari - Tree Traversal**
   - Excellent conceptual explanation
   - Covers BFS vs DFS differences
   - [Watch on YouTube](https://www.youtube.com/watch?v=09_LlHqEiDA)

3. **WilliamFiset - Breadth First Search**
   - Detailed BFS algorithm explanation
   - Code implementation in multiple languages
   - [Watch on YouTube](https://www.youtube.com/watch?v=pcKY4hjDrxk)

4. **BackToBack SWE - Level Order Traversal**
   - Problem-solving approach
   - Multiple solutions discussed
   - [Watch on YouTube](https://www.youtube.com/watch?v=0ZJgIj434Qo)

---

## Comparison with DFS

| Aspect | BFS (Level Order) | DFS (Pre-order) |
|--------|-------------------|------------------|
| **Order** | Level by level | Depth-first path |
| **Space** | O(w) - width | O(h) - height |
| **Use Case** | Level-based problems | Path-based problems |
| **Memory** | Queue (heap) | Call stack |
| **Implementation** | Iterative with queue | Recursive or iterative |
| **Cache Locality** | Poor (scattered memory) | Good (sequential access) |

**When to use BFS:**
- Need level-by-level results
- Tree width is small
- Looking for shortest path in unweighted tree
- Level-based aggregations (sums, averages, max/min)

**When to use DFS:**
- Need path-based results
- Tree height is small
- Tree traversal without level grouping
- Memory is constrained (if height < width)

---

## Pattern Recognition

### When to Recognize This Pattern

**Key Indicators:**
1. Problem mentions "level by level" or "breadth-first"
2. Need to process nodes by their depth/distance from root
3. Computing aggregates per level (sum, max, min, average)
4. Finding nodes at specific distances
5. Tree width or diameter problems

**Related Patterns:**
- **Tree DFS**: When depth-first traversal is needed
- **Graph BFS**: General BFS on graphs with cycles
- **Two Pointers**: Sometimes combined for in-place modifications

---

## Best Practices

### 1. Always Handle Edge Cases
```python
if not root:
    return []
```

### 2. Use Level Size Correctly
```python
# CORRECT: Get size BEFORE loop
level_size = len(queue)
for _ in range(level_size):
    # process nodes
    
# WRONG: Queue changes during iteration
for node in queue:
    # Will process newly added children!
```

### 3. Maintain Left-to-Right Order
```python
# Always add left before right
if node.left:
    queue.append(node.left)
if node.right:
    queue.append(node.right)
```

### 4. Choose Appropriate Data Structures
- **Python**: `collections.deque` for O(1) popleft
- **C++**: `std::queue` or `std::deque`
- **Java**: `LinkedList` as Queue implementation
- **JavaScript**: Array with `shift()` (or use a library for better performance)

### 5. Consider Iterative DFS for Space Efficiency
When tree is deep but narrow, iterative DFS may use less memory than BFS queue.

---

## Follow-up Questions

### Q1: How would you modify BFS to handle very wide trees?

**Answer:** Consider using a generator or yielding levels one at a time to reduce peak memory. For extremely wide trees, parallelization of independent subtrees may be considered.

### Q2: Can BFS be implemented with O(1) extra space?

**Answer:** Not for level order traversal. BFS inherently needs to track the next level's nodes. Morris traversal achieves O(1) space but only for in-order traversal.

### Q3: How would you count nodes at each level?

**Answer:** Track the level size (number of nodes) during BFS processing. The level size naturally gives the count for that level.

### Q4: What's the difference between level order traversal and breadth-first search?

**Answer:** They are essentially the same concept. Level order is tree-specific BFS. BFS on general graphs may not have level boundaries.

### Q5: How would you find all nodes at distance K from the root?

**Answer:** Two approaches:
1. BFS until reaching level K, then collect all nodes
2. DFS tracking current depth, collect when depth == K

---

## Summary

**Key Takeaways:**
- BFS naturally processes trees level by level
- Queue size tracking is essential for correct level grouping
- Time complexity is always O(n), space is O(w)
- Best for level-based aggregations and distance problems

**Pattern Strengths:**
- Simple and intuitive
- Naturally handles level boundaries
- Efficient for most tree problems
- Easy to modify for variants

**When to Apply:**
- Problems requiring level-by-level processing
- Distance/height-based queries
- Level aggregations (sum, max, min, average)
- Tree width problems

---

## Additional Resources

- [LeetCode Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)
- [GeeksforGeeks Level Order Traversal](https://www.geeksforgeeks.org/level-order-tree-traversal/)
- [BFS vs DFS](https://www.geeksforgeeks.org/bfs-vs-dfs-binary-tree/)
- [Queue Data Structure](https://www.programiz.com/data-structures/queue)
