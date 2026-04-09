## Tree DFS - Recursive Inorder Traversal: Framework

What is the complete code template for recursive inorder traversal?

<!-- front -->

---

### Framework: Recursive Inorder Traversal

```
┌─────────────────────────────────────────────────────────────────────┐
│  INORDER TRAVERSAL - RECURSIVE TEMPLATE                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  1. Initialize:                                                       │
│     - result = [] (empty list for values)                           │
│                                                                     │
│  2. Define recursive helper dfs(node):                              │
│     - If node is null: return (base case)                           │
│     - dfs(node.left)        # Traverse left subtree                 │
│     - result.append(node.val)   # Visit root                        │
│     - dfs(node.right)       # Traverse right subtree                │
│                                                                     │
│  3. Execute:                                                        │
│     - dfs(root)                                                     │
│                                                                     │
│  4. Return result list                                              │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Python

```python
from typing import List, Optional

# Definition for a binary tree node.
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_traversal(root: Optional[TreeNode]) -> List[int]:
    """
    Perform inorder traversal: Left → Root → Right
    Time: O(n), Space: O(h) where h = tree height
    """
    result = []
    
    def dfs(node: Optional[TreeNode]) -> None:
        if not node:
            return
        
        dfs(node.left)           # Traverse left subtree
        result.append(node.val)   # Visit root node
        dfs(node.right)          # Traverse right subtree
    
    dfs(root)
    return result
```

---

### Implementation: C++

```cpp
#include <vector>
using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x, left(left), right(right) {}
};

class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> result;
        
        function<void(TreeNode*)> dfs = [&](TreeNode* node) {
            if (!node) return;
            dfs(node->left);
            result.push_back(node->val);
            dfs(node->right);
        };
        
        dfs(root);
        return result;
    }
};
```

---

### Implementation: Java

```java
import java.util.ArrayList;
import java.util.List;

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
    private List<Integer> result = new ArrayList<>();
    
    public List<Integer> inorderTraversal(TreeNode root) {
        dfs(root);
        return result;
    }
    
    private void dfs(TreeNode node) {
        if (node == null) return;
        dfs(node.left);
        result.add(node.val);
        dfs(node.right);
    }
}
```

---

### Implementation: JavaScript

```javascript
function TreeNode(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
}

function inorderTraversal(root) {
    const result = [];
    
    function dfs(node) {
        if (!node) return;
        dfs(node.left);
        result.push(node.val);
        dfs(node.right);
    }
    
    dfs(root);
    return result;
}
```

---

### Key Framework Elements

| Element | Purpose | Pattern |
|---------|---------|---------|
| `result` list | Store visited values | Captures traversal output |
| `dfs(node)` helper | Recursive traversal | Encapsulates traversal logic |
| Base case (`!node`) | Terminate recursion | Prevents null pointer errors |
| Left → Root → Right | Inorder sequence | Core traversal order |
| Closure/Instance var | Access result in recursion | Maintains state across calls |

---

### Complexity Summary

| Complexity | Value | Explanation |
|------------|-------|-------------|
| **Time** | O(n) | Each node visited exactly once |
| **Space** | O(h) | Recursion stack depth = tree height |

Where n = number of nodes, h = tree height (h = n for skewed trees)

<!-- back -->
