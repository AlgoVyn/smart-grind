## Tree - BFS Level Order Traversal: Framework

What is the complete code template for BFS level order traversal on trees?

<!-- front -->

---

### Framework: BFS Level Order Traversal

```
┌─────────────────────────────────────────────────────────────────────┐
│  BFS LEVEL ORDER TRAVERSAL - TEMPLATE                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. Initialize:                                                       │
│     - Handle empty tree: if not root: return []                     │
│     - result = [] (stores levels)                                   │
│     - queue = deque([root])                                         │
│                                                                     │
│  2. Process levels while queue not empty:                           │
│     - level_size = len(queue)  # CRITICAL: capture before loop      │
│     - current_level = []                                            │
│                                                                     │
│  3. Inner loop: for _ in range(level_size):                         │
│     - node = queue.popleft()                                        │
│     - current_level.append(node.val)                                │
│     - if node.left: queue.append(node.left)                         │
│     - if node.right: queue.append(node.right)                       │
│                                                                     │
│  4. After inner loop:                                               │
│     - result.append(current_level)                                  │
│                                                                     │
│  5. Return result                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Standard Level Order

```python
from collections import deque
from typing import List, Optional

class TreeNode:
    def __init__(self, val: int = 0, left: Optional['TreeNode'] = None, 
                 right: Optional['TreeNode'] = None):
        self.val = val
        self.left = left
        self.right = right

def level_order_traversal(root: Optional[TreeNode]) -> List[List[int]]:
    """
    Perform level order traversal of a binary tree.
    Time: O(n), Space: O(w) where w = max width
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)  # KEY: capture size BEFORE processing
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

---

### C++ Implementation

```cpp
#include <queue>
#include <vector>

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) 
        : val(x), left(left), right(right) {}
};

std::vector<std::vector<int>> levelOrder(TreeNode* root) {
    if (!root) return {};
    
    std::vector<std::vector<int>> result;
    std::queue<TreeNode*> queue;
    queue.push(root);
    
    while (!queue.empty()) {
        int levelSize = queue.size();  // Capture size first
        std::vector<int> currentLevel;
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode* node = queue.front();
            queue.pop();
            currentLevel.push_back(node->val);
            
            if (node->left) queue.push(node->left);
            if (node->right) queue.push(node->right);
        }
        
        result.push_back(currentLevel);
    }
    
    return result;
}
```

---

### Key Framework Elements

| Element | Purpose | Critical? |
|---------|---------|-----------|
| Empty check | Handle null root | Yes - prevents errors |
| `level_size` capture | Process exactly current level | Yes - wrong without this |
| `range(level_size)` | Fixed iteration count | Yes - queue grows during loop |
| Left before right | Maintain left-to-right order | Yes - for correct output |
| Result append | Store completed level | After inner loop completes |

---

### Queue Evolution Example

```
Tree:      1
          / \
         2   3
        / \   \
       4   5   6

Step-by-step:
  Start:    queue=[1],           level_size=1
  Level 0:  process 1,           queue=[2,3],       result=[[1]]
  Level 1:  level_size=2
            process 2, add 4,5   queue=[3,4,5]
            process 3, add 6     queue=[4,5,6],     result=[[1],[2,3]]
  Level 2:  level_size=3
            process 4 (no kids)  queue=[5,6]
            process 5 (no kids)  queue=[6]
            process 6 (no kids)  queue=[],          result=[[1],[2,3],[4,5,6]]
```

---

### Complexity Summary

| Approach | Time | Space | Notes |
|----------|------|-------|-------|
| Standard BFS | O(n) | O(w) | w = max tree width |
| Two Queue | O(n) | O(w) | Uses extra queue |
| With Depth | O(n) | O(w) | Tracks depth info |

<!-- back -->
