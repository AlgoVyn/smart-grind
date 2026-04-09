## Tree DFS - Recursive Postorder Traversal: Framework

What is the complete code template for recursive postorder traversal?

<!-- front -->

---

### Framework: Recursive Postorder Structure

```
┌─────────────────────────────────────────────────────────────────┐
│  POSTORDER TRAVERSAL - LEFT → RIGHT → ROOT                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Visit Order:                                                   │
│  ┌─────────┐    ┌─────────┐    ┌─────────┐                     │
│  │  LEFT   │ -> │  RIGHT  │ -> │  ROOT   │                     │
│  │ subtree │    │ subtree │    │  node   │                     │
│  └─────────┘    └─────────┘    └─────────┘                     │
│                                                                 │
│  1. Base case:                                                  │
│     if node is null: return                                     │
│                                                                 │
│  2. Recursive traversal:                                        │
│     dfs(node.left)   // Explore all left descendants            │
│     dfs(node.right)  // Explore all right descendants           │
│                                                                 │
│  3. Visit root:                                                 │
│     result.append(node.val)  // Process after children          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Implementation: Python

```python
from typing import List, Optional

def postorder_traversal(root: Optional[TreeNode]) -> List[int]:
    """
    Postorder: Left -> Right -> Root
    Time: O(n), Space: O(h) where h = tree height
    """
    result = []
    
    def dfs(node: Optional[TreeNode]) -> None:
        if not node:
            return
        
        dfs(node.left)           # 1. Traverse left subtree
        dfs(node.right)          # 2. Traverse right subtree
        result.append(node.val)  # 3. Visit root (after children)
    
    dfs(root)
    return result
```

---

### Implementation: C++

```cpp
vector<int> postorderTraversal(TreeNode* root) {
    vector<int> result;
    
    function<void(TreeNode*)> dfs = [&](TreeNode* node) {
        if (!node) return;
        dfs(node->left);
        dfs(node->right);
        result.push_back(node->val);
    };
    
    dfs(root);
    return result;
}
```

---

### Implementation: Java

```java
private List<Integer> result = new ArrayList<>();

public List<Integer> postorderTraversal(TreeNode root) {
    dfs(root);
    return result;
}

private void dfs(TreeNode node) {
    if (node == null) return;
    dfs(node.left);
    dfs(node.right);
    result.add(node.val);
}
```

---

### Implementation: JavaScript

```javascript
var postorderTraversal = function(root) {
    const result = [];
    
    function dfs(node) {
        if (!node) return;
        dfs(node.left);
        dfs(node.right);
        result.push(node.val);
    }
    
    dfs(root);
    return result;
};
```

---

### Key Framework Elements

| Element | Purpose | Order |
|---------|---------|-------|
| `dfs(node.left)` | Traverse left subtree | First |
| `dfs(node.right)` | Traverse right subtree | Second |
| `result.append()` | Process current node | Last (after children) |
| Base case | Terminate recursion | `if (!node)` |

---

### When to Use Postorder

```
Problem Type                    -> Use Postorder?
─────────────────────────────────────────────────────
Tree deletion                   -> YES (children first)
Expression evaluation             -> YES (postfix notation)
Subtree height/sum calculations   -> YES (bottom-up)
Tree serialization                -> YES (children before parent)
Root-to-leaf paths                -> NO (use preorder)
Level-order processing            -> NO (use BFS)
```

<!-- back -->
