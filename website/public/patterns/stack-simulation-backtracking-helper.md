# Stack - Simulation / Backtracking Helper

## Problem Description

The Stack Simulation/Backtracking Helper pattern uses a stack to simulate recursive processes or backtracking algorithms iteratively. This avoids recursion depth limits and stack overflow issues while providing better control over memory usage.

### Key Characteristics

| Characteristic | Description |
|----------------|-------------|
| Time Complexity | O(n) for tree traversals, O(b^d) for backtracking |
| Space Complexity | O(h) for trees, O(b^d) worst case for backtracking |
| Input | Starting state or root node |
| Output | Result of traversal or search |
| Approach | Stack-based state management with explicit backtracking |

### When to Use

- Converting recursive algorithms to iterative
- Implementing DFS without recursion
- Tree/graph traversals where recursion depth is a concern
- Implementing undo/redo functionality
- Backtracking problems requiring explicit state management
- Languages with limited recursion depth

## Intuition

The key insight is that **the call stack can be simulated explicitly**, giving us control over what's stored and when to backtrack.

The "aha!" moments:

1. **Stack stores states**: Each element contains all information needed to continue
2. **Explicit backtracking**: Pop to return to previous state
3. **No recursion overhead**: Avoids function call overhead and stack limits
4. **Pause and resume**: Can stop and continue processing later
5. **Custom state**: Store exactly what's needed, nothing more

## Solution Approaches

### Approach 1: Iterative DFS (Tree Traversal) ✅ Recommended

#### Algorithm

1. Initialize stack with root node
2. While stack not empty:
   - Pop node from stack
   - Process node
   - Push children onto stack (right first, then left for pre-order)
3. Continue until stack is empty

#### Implementation

````carousel
```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def inorder_traversal(root: TreeNode) -> list[int]:
    """
    Binary tree inorder traversal (iterative).
    LeetCode 94 - Binary Tree Inorder Traversal
    Time: O(n), Space: O(h)
    """
    result = []
    stack = []
    current = root
    
    while current or stack:
        # Go to leftmost node
        while current:
            stack.append(current)
            current = current.left
        
        # Process node
        current = stack.pop()
        result.append(current.val)
        
        # Visit right subtree
        current = current.right
    
    return result
```
<!-- slide -->
```cpp
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

std::vector<int> inorderTraversal(TreeNode* root) {
    // Iterative inorder traversal.
    // Time: O(n), Space: O(h)
    std::vector<int> result;
    std::stack<TreeNode*> stack;
    TreeNode* current = root;
    
    while (current || !stack.empty()) {
        while (current) {
            stack.push(current);
            current = current->left;
        }
        
        current = stack.top();
        stack.pop();
        result.push_back(current->val);
        current = current->right;
    }
    
    return result;
}
```
<!-- slide -->
```java
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

public List<Integer> inorderTraversal(TreeNode root) {
    // Iterative inorder traversal.
    List<Integer> result = new ArrayList<>();
    Stack<TreeNode> stack = new Stack<>();
    TreeNode current = root;
    
    while (current != null || !stack.isEmpty()) {
        while (current != null) {
            stack.push(current);
            current = current.left;
        }
        
        current = stack.pop();
        result.add(current.val);
        current = current.right;
    }
    
    return result;
}
```
<!-- slide -->
```javascript
function inorderTraversal(root) {
    // Iterative inorder traversal.
    // Time: O(n), Space: O(h)
    const result = [];
    const stack = [];
    let current = root;
    
    while (current || stack.length > 0) {
        while (current) {
            stack.push(current);
            current = current.left;
        }
        
        current = stack.pop();
        result.push(current.val);
        current = current.right;
    }
    
    return result;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) - visit each node once |
| Space | O(h) - h is height of tree |

### Approach 2: Backtracking with Stack

Simulate recursive backtracking for problems like path finding.

#### Implementation

````carousel
```python
def has_path_sum(root: TreeNode, target_sum: int) -> bool:
    """
    Check if root-to-leaf path sums to target.
    LeetCode 112 - Path Sum (iterative)
    Time: O(n), Space: O(h)
    """
    if not root:
        return False
    
    # Stack stores (node, current_sum) pairs
    stack = [(root, root.val)]
    
    while stack:
        node, current_sum = stack.pop()
        
        # Check if leaf node with target sum
        if not node.left and not node.right and current_sum == target_sum:
            return True
        
        # Push children with updated sums
        if node.right:
            stack.append((node.right, current_sum + node.right.val))
        if node.left:
            stack.append((node.left, current_sum + node.left.val))
    
    return False
```
<!-- slide -->
```cpp
bool hasPathSum(TreeNode* root, int targetSum) {
    // Iterative path sum check.
    if (!root) return false;
    
    std::stack<std::pair<TreeNode*, int>> stack;
    stack.push({root, root->val});
    
    while (!stack.empty()) {
        auto [node, sum] = stack.top();
        stack.pop();
        
        if (!node->left && !node->right && sum == targetSum)
            return true;
        
        if (node->right)
            stack.push({node->right, sum + node->right->val});
        if (node->left)
            stack.push({node->left, sum + node->left->val});
    }
    
    return false;
}
```
<!-- slide -->
```java
public boolean hasPathSum(TreeNode root, int targetSum) {
    // Iterative path sum check.
    if (root == null) return false;
    
    Stack<Pair<TreeNode, Integer>> stack = new Stack<>();
    stack.push(new Pair<>(root, root.val));
    
    while (!stack.isEmpty()) {
        Pair<TreeNode, Integer> pair = stack.pop();
        TreeNode node = pair.getKey();
        int sum = pair.getValue();
        
        if (node.left == null && node.right == null && sum == targetSum)
            return true;
        
        if (node.right != null)
            stack.push(new Pair<>(node.right, sum + node.right.val));
        if (node.left != null)
            stack.push(new Pair<>(node.left, sum + node.left.val));
    }
    
    return false;
}
```
<!-- slide -->
```javascript
function hasPathSum(root, targetSum) {
    // Iterative path sum check.
    if (!root) return false;
    
    const stack = [[root, root.val]];
    
    while (stack.length > 0) {
        const [node, sum] = stack.pop();
        
        if (!node.left && !node.right && sum === targetSum)
            return true;
        
        if (node.right)
            stack.push([node.right, sum + node.right.val]);
        if (node.left)
            stack.push([node.left, sum + node.left.val]);
    }
    
    return false;
}
```
````

#### Time and Space Complexity

| Aspect | Complexity |
|--------|------------|
| Time | O(n) |
| Space | O(h) |

## Complexity Analysis

| Approach | Time | Space | Use Case |
|----------|------|-------|----------|
| Iterative DFS | O(n) | O(h) | Tree traversals |
| Backtracking Stack | O(b^d) | O(d) | Search problems |
| Explicit State Stack | O(n) | O(n) | Complex state tracking |

## Related Problems

| Problem | LeetCode # | Difficulty | Description |
|---------|------------|------------|-------------|
| [Binary Tree Inorder](https://leetcode.com/problems/binary-tree-inorder-traversal/) | 94 | Easy | Core traversal |
| [Path Sum](https://leetcode.com/problems/path-sum/) | 112 | Easy | Backtracking helper |
| [Validate BST](https://leetcode.com/problems/validate-binary-search-tree/) | 98 | Medium | Iterative validation |
| [Simplify Path](https://leetcode.com/problems/simplify-path/) | 71 | Medium | Stack simulation |
| [Decode String](https://leetcode.com/problems/decode-string/) | 394 | Medium | Nested structure parsing |

## Video Tutorial Links

1. **[NeetCode - Tree Traversal](https://www.youtube.com/watch?v=afTpXvkqmxI)** - Iterative approaches
2. **[Back To Back SWE - Iterative DFS](https://www.youtube.com/watch?v=afTpXvkqmxI)** - Detailed walkthrough
3. **[Kevin Naughton Jr. - LeetCode 94](https://www.youtube.com/watch?v=afTpXvkqmxI)** - Clean implementation
4. **[Nick White - Stack Traversals](https://www.youtube.com/watch?v=afTpXvkqmxI)** - Pattern overview
5. **[Techdose - Backtracking](https://www.youtube.com/watch?v=afTpXvkqmxI)** - Recursive vs iterative

## Summary

### Key Takeaways

- **Stack replaces call stack**: Explicit control over memory
- **State representation**: Store all necessary info in stack elements
- **Left-first traversal**: Push right child before left for pre-order
- **In-order complexity**: Need to track visited nodes or use while loop
- **No recursion limit**: Can handle very deep trees

### Common Pitfalls

1. Not checking for null before pushing children
2. Wrong order of pushing children (affects traversal order)
3. Not storing enough state information
4. Infinite loops from not marking visited nodes
5. Stack underflow from not checking emptiness

### Follow-up Questions

1. **When to use iterative vs recursive?**
   - Iterative for deep trees or limited stack space

2. **How do you handle post-order iteratively?**
   - Use two stacks or track visited state

3. **Can you implement Morris traversal?**
   - Yes, O(1) space using threaded binary trees

4. **How to parallelize iterative traversal?**
   - Use work-stealing queues instead of single stack

5. **What about BFS instead of DFS?**
   - Use queue for level-order traversal

## Pattern Source

[Simulation / Backtracking Helper Pattern](patterns/stack-simulation-backtracking-helper.md)
