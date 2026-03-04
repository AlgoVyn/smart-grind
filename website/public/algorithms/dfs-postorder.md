# DFS Postorder

## Category
Trees & BSTs

## Description

DFS Postorder (Depth-First Search Postorder) is a tree traversal algorithm that visits nodes in **Left-Right-Root** order. This means it recursively explores the entire left subtree, then the entire right subtree, and finally processes the current node. Postorder traversal is particularly useful for **bottom-up processing** where children must be processed before their parent, such as tree deletion, computing subtree properties, and evaluating expression trees.

---

## When to Use

Use Postorder DFS when you need to solve problems involving:

- **Tree Deletion**: Must delete children before parents to avoid memory leaks
- **Bottom-up Calculations**: Computing properties that depend on child nodes (height, size, sum)
- **Expression Trees**: Evaluating mathematical expressions where operands must be computed before operators
- **Subtree Validation**: Checking properties of subtrees before validating parent nodes
- **Directory/File Size Calculation**: Computing total sizes where subdirectories must be summed first

### Comparison with Other Tree Traversals

| Traversal | Order | Best Used For | Processing Direction |
|-----------|-------|---------------|---------------------|
| **Preorder** | Root-Left-Right | Copying trees, prefix notation, top-down processing | Top-down |
| **Inorder** | Left-Root-Right | BST validation, sorted order retrieval | Left-to-right |
| **Postorder** | Left-Right-Root | Tree deletion, expression evaluation, bottom-up DP | Bottom-up |
| **Level Order** | Level by level | Finding shortest path, level-based processing | Breadth-first |

### When to Choose Postorder vs Other Traversals

- **Choose Postorder** when:
  - You need to process children before parents (bottom-up)
  - Deleting a tree (free children before parent)
  - Evaluating expression trees
  - Computing subtree aggregates (sum, count, height)

- **Choose Preorder** when:
  - You need to process root before children (top-down)
  - Creating a copy of the tree
  - Serializing tree structure

- **Choose Inorder** when:
  - Working with BSTs to get sorted order
  - Finding inorder predecessors/successors

---

## Algorithm Explanation

### Core Concept

The fundamental principle of Postorder DFS is **post-visit processing**: the root node is processed only after both its left and right subtrees have been completely traversed. This creates a natural bottom-up flow of information from leaf nodes to the root.

```
Postorder(node):
    if node is null:
        return
    Postorder(node.left)      // Process entire left subtree
    Postorder(node.right)     // Process entire right subtree
    Process(node)             // Process current node last
```

### How It Works

#### Traversal Order Visualization:

For the following binary tree:

```
        1          <- Level 0 (Root)
       / \
      2   3        <- Level 1
     / \   \
    4   5   6      <- Level 2
       /
      7            <- Level 3
```

**Postorder Traversal: [4, 7, 5, 2, 6, 3, 1]**

Let's trace through the execution:

1. Start at root (1), go left to (2)
2. From (2), go left to (4)
3. (4) is a leaf - process it: **[4]**
4. Back to (2), go right to (5)
5. From (5), go left to (7)
6. (7) is a leaf - process it: **[4, 7]**
7. Back to (5), right is null - process (5): **[4, 7, 5]**
8. Back to (2), both children done - process (2): **[4, 7, 5, 2]**
9. Back to (1), go right to (3)
10. From (3), left is null, go right to (6)
11. (6) is a leaf - process it: **[4, 7, 5, 2, 6]**
12. Back to (3), right child done - process (3): **[4, 7, 5, 2, 6, 3]**
13. Back to (1), both children done - process (1): **[4, 7, 5, 2, 6, 3, 1]**

### Key Properties

1. **Children Before Parent**: Guaranteed that both left and right children are processed before their parent
2. **Leaf-First**: All leaf nodes appear before their ancestors in the result
3. **Left Subtree Before Right**: The entire left subtree is processed before any node in the right subtree
4. **Root Last**: The root is always the last node processed

### Common Applications

| Application | Why Postorder Works |
|-------------|---------------------|
| **Tree Deletion** | Free child memory before parent to avoid dangling pointers |
| **Expression Evaluation** | Evaluate operands (children) before applying operator (parent) |
| **Maximum Path Sum** | Compute max paths in subtrees before computing through parent |
| **Tree Height** | Calculate heights of children before calculating parent's height |
| **Univalue Subtrees** | Check if children are univalue before checking parent |

---

## Algorithm Steps

### Recursive Approach

1. **Base Case**: If current node is null, return
2. **Traverse Left**: Recursively call postorder on left child
3. **Traverse Right**: Recursively call postorder on right child
4. **Process Node**: Add current node's value to result (or perform computation)

### Iterative Approach (Two Stacks)

1. **Initialize**: Create two empty stacks, push root onto stack1
2. **First Pass**: While stack1 is not empty:
   - Pop node from stack1 and push onto stack2
   - Push left child onto stack1 (if exists)
   - Push right child onto stack1 (if exists)
3. **Second Pass**: Pop all nodes from stack2 and add to result
   - This gives postorder: left, right, root

### Iterative Approach (Single Stack with Tracking)

1. **Initialize**: Create empty stack, set current = root, lastVisited = null
2. **Traverse**: While stack is not empty or current is not null:
   - If current is not null: push to stack and go left
   - Else: peek at stack top
     - If right child exists and wasn't just visited: go right
     - Else: pop and process (add to result), set lastVisited

---

## Implementation

### Template Code (Recursive and Iterative)

````carousel
```python
from typing import List, Optional

class TreeNode:
    """Definition for a binary tree node."""
    def __init__(self, val: int = 0, left: Optional['TreeNode'] = None, right: Optional['TreeNode'] = None):
        self.val = val
        self.left = left
        self.right = right


class PostorderDFS:
    """
    DFS Postorder Traversal implementations.
    
    Time Complexities:
        - All traversals: O(n) where n is number of nodes
    
    Space Complexity:
        - Recursive: O(h) for call stack (h = tree height)
        - Iterative: O(h) for explicit stack
    """
    
    @staticmethod
    def recursive(root: Optional[TreeNode]) -> List[int]:
        """
        Recursive Postorder Traversal: Left -> Right -> Root
        
        Args:
            root: Root of the binary tree
            
        Returns:
            List of node values in postorder
            
        Time: O(n)
        Space: O(h) where h is height of tree
        """
        result = []
        
        def traverse(node: Optional[TreeNode]):
            if not node:
                return
            traverse(node.left)       # Visit left subtree
            traverse(node.right)      # Visit right subtree
            result.append(node.val)   # Visit root
        
        traverse(root)
        return result
    
    @staticmethod
    def iterative_two_stacks(root: Optional[TreeNode]) -> List[int]:
        """
        Iterative Postorder using two stacks.
        
        Logic: First stack does a root-right-left traversal,
        second stack reverses it to get left-right-root (postorder).
        
        Args:
            root: Root of the binary tree
            
        Returns:
            List of node values in postorder
            
        Time: O(n)
        Space: O(n) - stores all nodes
        """
        if not root:
            return []
        
        result = []
        stack1 = [root]  # For traversal
        stack2 = []      # For reversing
        
        # Get root-right-left order in stack2
        while stack1:
            node = stack1.pop()
            stack2.append(node)
            
            # Push left first, then right (so right is processed first)
            if node.left:
                stack1.append(node.left)
            if node.right:
                stack1.append(node.right)
        
        # Pop from stack2 to get left-right-root
        while stack2:
            result.append(stack2.pop().val)
        
        return result
    
    @staticmethod
    def iterative_single_stack(root: Optional[TreeNode]) -> List[int]:
        """
        Iterative Postorder using single stack with last visited tracking.
        
        More space-efficient than two-stack approach.
        
        Args:
            root: Root of the binary tree
            
        Returns:
            List of node values in postorder
            
        Time: O(n)
        Space: O(h) - only stores one path
        """
        if not root:
            return []
        
        result = []
        stack = []
        current = root
        last_visited = None
        
        while stack or current:
            # Go to leftmost node
            if current:
                stack.append(current)
                current = current.left
            else:
                # Peek at top
                peek = stack[-1]
                
                # If right exists and not visited, go right
                if peek.right and peek.right != last_visited:
                    current = peek.right
                else:
                    # Both children processed, process this node
                    result.append(peek.val)
                    last_visited = stack.pop()
        
        return result


# Example usage and demonstration
if __name__ == "__main__":
    # Build tree:       4
    #                /   \
    #               2     6
    #              / \   / \
    #             1   3 5   7
    root = TreeNode(4)
    root.left = TreeNode(2, TreeNode(1), TreeNode(3))
    root.right = TreeNode(6, TreeNode(5), TreeNode(7))
    
    print("Tree structure:")
    print("        4")
    print("       / \\")
    print("      2   6")
    print("     / \\ / \\")
    print("    1  3 5  7")
    print()
    
    # Test all three approaches
    recursive_result = PostorderDFS.recursive(root)
    two_stack_result = PostorderDFS.iterative_two_stacks(root)
    single_stack_result = PostorderDFS.iterative_single_stack(root)
    
    print("Traversal Results:")
    print(f"Recursive:      {recursive_result}")
    print(f"Two Stacks:     {two_stack_result}")
    print(f"Single Stack:   {single_stack_result}")
    print()
    
    # Verify correctness
    expected = [1, 3, 2, 5, 7, 6, 4]
    assert recursive_result == expected, f"Recursive failed: {recursive_result}"
    assert two_stack_result == expected, f"Two stacks failed: {two_stack_result}"
    assert single_stack_result == expected, f"Single stack failed: {single_stack_result}"
    print("✓ All implementations produce correct postorder traversal!")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <stack>
using namespace std;

/**
 * Definition for a binary tree node.
 */
struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

/**
 * DFS Postorder Traversal implementations.
 * 
 * Time Complexities:
 *     - All traversals: O(n)
 * 
 * Space Complexities:
 *     - Recursive: O(h) for call stack
 *     - Iterative: O(h) for explicit stack
 */
class PostorderDFS {
public:
    /**
     * Recursive Postorder Traversal: Left -> Right -> Root
     * 
     * Time: O(n)
     * Space: O(h) where h is height of tree
     */
    vector<int> recursive(TreeNode* root) {
        vector<int> result;
        traverse(root, result);
        return result;
    }
    
    /**
     * Iterative Postorder using two stacks.
     * 
     * Time: O(n)
     * Space: O(n)
     */
    vector<int> iterativeTwoStacks(TreeNode* root) {
        vector<int> result;
        if (!root) return result;
        
        stack<TreeNode*> stack1;
        stack<TreeNode*> stack2;
        stack1.push(root);
        
        // Get root-right-left order in stack2
        while (!stack1.empty()) {
            TreeNode* node = stack1.top();
            stack1.pop();
            stack2.push(node);
            
            // Push left first, then right
            if (node->left) stack1.push(node->left);
            if (node->right) stack1.push(node->right);
        }
        
        // Pop from stack2 to get postorder
        while (!stack2.empty()) {
            result.push_back(stack2.top()->val);
            stack2.pop();
        }
        
        return result;
    }
    
    /**
     * Iterative Postorder using single stack with tracking.
     * 
     * Time: O(n)
     * Space: O(h)
     */
    vector<int> iterativeSingleStack(TreeNode* root) {
        vector<int> result;
        if (!root) return result;
        
        stack<TreeNode*> stack;
        TreeNode* current = root;
        TreeNode* lastVisited = nullptr;
        
        while (!stack.empty() || current) {
            // Go to leftmost
            if (current) {
                stack.push(current);
                current = current->left;
            } else {
                TreeNode* peek = stack.top();
                
                // If right exists and not visited, go right
                if (peek->right && peek->right != lastVisited) {
                    current = peek->right;
                } else {
                    // Process this node
                    result.push_back(peek->val);
                    lastVisited = peek;
                    stack.pop();
                }
            }
        }
        
        return result;
    }

private:
    void traverse(TreeNode* node, vector<int>& result) {
        if (!node) return;
        traverse(node->left, result);    // Visit left
        traverse(node->right, result);   // Visit right
        result.push_back(node->val);     // Visit root
    }
};

// Example usage
int main() {
    // Build tree:       4
    //                /   \
    //               2     6
    //              / \   / \
    //             1   3 5   7
    TreeNode* root = new TreeNode(4);
    root->left = new TreeNode(2, new TreeNode(1), new TreeNode(3));
    root->right = new TreeNode(6, new TreeNode(5), new TreeNode(7));
    
    PostorderDFS solver;
    
    cout << "Traversal Results:" << endl;
    
    vector<int> recursive = solver.recursive(root);
    cout << "Recursive:    ";
    for (int x : recursive) cout << x << " ";
    cout << endl;
    
    vector<int> twoStack = solver.iterativeTwoStacks(root);
    cout << "Two Stacks:   ";
    for (int x : twoStack) cout << x << " ";
    cout << endl;
    
    vector<int> singleStack = solver.iterativeSingleStack(root);
    cout << "Single Stack: ";
    for (int x : singleStack) cout << x << " ";
    cout << endl;
    
    // Cleanup
    delete root->left->left;
    delete root->left->right;
    delete root->right->left;
    delete root->right->right;
    delete root->left;
    delete root->right;
    delete root;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

/**
 * Definition for a binary tree node.
 */
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    
    TreeNode() {}
    
    TreeNode(int val) {
        this.val = val;
    }
    
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

/**
 * DFS Postorder Traversal implementations.
 * 
 * Time Complexities:
 *     - All traversals: O(n)
 * 
 * Space Complexities:
 *     - Recursive: O(h) for call stack
 *     - Iterative: O(h) for explicit stack
 */
public class PostorderDFS {
    
    /**
     * Recursive Postorder Traversal: Left -> Right -> Root
     * 
     * Time: O(n)
     * Space: O(h) where h is height of tree
     */
    public List<Integer> recursive(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        traverse(root, result);
        return result;
    }
    
    private void traverse(TreeNode node, List<Integer> result) {
        if (node == null) return;
        traverse(node.left, result);     // Visit left
        traverse(node.right, result);    // Visit right
        result.add(node.val);            // Visit root
    }
    
    /**
     * Iterative Postorder using two stacks.
     * 
     * Time: O(n)
     * Space: O(n)
     */
    public List<Integer> iterativeTwoStacks(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) return result;
        
        Stack<TreeNode> stack1 = new Stack<>();
        Stack<TreeNode> stack2 = new Stack<>();
        stack1.push(root);
        
        // Get root-right-left order in stack2
        while (!stack1.isEmpty()) {
            TreeNode node = stack1.pop();
            stack2.push(node);
            
            // Push left first, then right
            if (node.left != null) stack1.push(node.left);
            if (node.right != null) stack1.push(node.right);
        }
        
        // Pop from stack2 to get postorder
        while (!stack2.isEmpty()) {
            result.add(stack2.pop().val);
        }
        
        return result;
    }
    
    /**
     * Iterative Postorder using single stack with tracking.
     * 
     * Time: O(n)
     * Space: O(h)
     */
    public List<Integer> iterativeSingleStack(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) return result;
        
        Stack<TreeNode> stack = new Stack<>();
        TreeNode current = root;
        TreeNode lastVisited = null;
        
        while (!stack.isEmpty() || current != null) {
            // Go to leftmost
            if (current != null) {
                stack.push(current);
                current = current.left;
            } else {
                TreeNode peek = stack.peek();
                
                // If right exists and not visited, go right
                if (peek.right != null && peek.right != lastVisited) {
                    current = peek.right;
                } else {
                    // Process this node
                    result.add(peek.val);
                    lastVisited = stack.pop();
                }
            }
        }
        
        return result;
    }
    
    // Main method for testing
    public static void main(String[] args) {
        // Build tree:       4
        //                /   \
        //               2     6
        //              / \   / \
        //             1   3 5   7
        TreeNode root = new TreeNode(4);
        root.left = new TreeNode(2, new TreeNode(1), new TreeNode(3));
        root.right = new TreeNode(6, new TreeNode(5), new TreeNode(7));
        
        PostorderDFS solver = new PostorderDFS();
        
        System.out.println("Traversal Results:");
        System.out.println("Recursive:    " + solver.recursive(root));
        System.out.println("Two Stacks:   " + solver.iterativeTwoStacks(root));
        System.out.println("Single Stack: " + solver.iterativeSingleStack(root));
    }
}
```

<!-- slide -->
```javascript
/**
 * Definition for a binary tree node.
 */
class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

/**
 * DFS Postorder Traversal implementations.
 * 
 * Time Complexities:
 *     - All traversals: O(n)
 * 
 * Space Complexities:
 *     - Recursive: O(h) for call stack
 *     - Iterative: O(h) for explicit stack
 */
class PostorderDFS {
    /**
     * Recursive Postorder Traversal: Left -> Right -> Root
     * 
     * @param {TreeNode} root - Root of the binary tree
     * @returns {number[]} - Array of node values in postorder
     * 
     * Time: O(n)
     * Space: O(h) where h is height of tree
     */
    recursive(root) {
        const result = [];
        
        const traverse = (node) => {
            if (!node) return;
            traverse(node.left);           // Visit left
            traverse(node.right);          // Visit right
            result.push(node.val);         // Visit root
        };
        
        traverse(root);
        return result;
    }
    
    /**
     * Iterative Postorder using two stacks.
     * 
     * @param {TreeNode} root - Root of the binary tree
     * @returns {number[]} - Array of node values in postorder
     * 
     * Time: O(n)
     * Space: O(n)
     */
    iterativeTwoStacks(root) {
        if (!root) return [];
        
        const result = [];
        const stack1 = [root];
        const stack2 = [];
        
        // Get root-right-left order in stack2
        while (stack1.length > 0) {
            const node = stack1.pop();
            stack2.push(node);
            
            // Push left first, then right
            if (node.left) stack1.push(node.left);
            if (node.right) stack1.push(node.right);
        }
        
        // Pop from stack2 to get postorder
        while (stack2.length > 0) {
            result.push(stack2.pop().val);
        }
        
        return result;
    }
    
    /**
     * Iterative Postorder using single stack with tracking.
     * 
     * @param {TreeNode} root - Root of the binary tree
     * @returns {number[]} - Array of node values in postorder
     * 
     * Time: O(n)
     * Space: O(h)
     */
    iterativeSingleStack(root) {
        if (!root) return [];
        
        const result = [];
        const stack = [];
        let current = root;
        let lastVisited = null;
        
        while (stack.length > 0 || current) {
            // Go to leftmost
            if (current) {
                stack.push(current);
                current = current.left;
            } else {
                const peek = stack[stack.length - 1];
                
                // If right exists and not visited, go right
                if (peek.right && peek.right !== lastVisited) {
                    current = peek.right;
                } else {
                    // Process this node
                    result.push(peek.val);
                    lastVisited = stack.pop();
                }
            }
        }
        
        return result;
    }
}

// Example usage
const root = new TreeNode(4);
root.left = new TreeNode(2, new TreeNode(1), new TreeNode(3));
root.right = new TreeNode(6, new TreeNode(5), new TreeNode(7));

const solver = new PostorderDFS();

console.log("Tree structure:");
console.log("        4");
console.log("       / \\");
console.log("      2   6");
console.log("     / \\ / \\");
console.log("    1  3 5  7");
console.log();

console.log("Traversal Results:");
console.log("Recursive:    ", solver.recursive(root));
console.log("Two Stacks:   ", solver.iterativeTwoStacks(root));
console.log("Single Stack: ", solver.iterativeSingleStack(root));
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Recursive Traversal** | O(n) | Visit each node exactly once |
| **Iterative (Two Stacks)** | O(n) | Each node pushed/popped from both stacks once |
| **Iterative (Single Stack)** | O(n) | Each node pushed and popped at most once |

### Detailed Breakdown

- **Node Visits**: Each node is visited exactly once in all implementations
  - Recursive: Function call per node
  - Iterative: Stack push/pop per node

- **Edge Traversal**: 
  - Each edge is traversed exactly twice (once down, once up)
  - For a tree with n nodes, there are n-1 edges
  - Total edge traversals: 2(n-1) = O(n)

### Comparison of Approaches

| Approach | Time | Practical Considerations |
|----------|------|-------------------------|
| Recursive | O(n) | Clean code, risk of stack overflow on deep trees |
| Two Stacks | O(n) | Simpler logic, uses more space |
| Single Stack | O(n) | More complex, space-optimal |

---

## Space Complexity Analysis

| Approach | Space Complexity | Description |
|----------|-----------------|-------------|
| **Recursive** | O(h) | Call stack depth equals tree height |
| **Iterative (Two Stacks)** | O(n) | Stores all nodes in worst case |
| **Iterative (Single Stack)** | O(h) | Only stores current path |

### Space Breakdown

- **Call Stack / Stack Storage**: 
  - Best case (balanced tree): O(log n)
  - Worst case (skewed tree): O(n)
  - Average case: O(log n) for random trees

- **Result Storage**: O(n) for all approaches (storing traversal output)

### Space Optimization Tips

1. **For Deep Trees**: Use iterative single-stack to avoid recursion limit
2. **For Wide Trees**: Any approach works similarly
3. **For Streaming Output**: Process nodes immediately instead of storing

---

## Common Variations

### 1. Postorder with Node Processing Function

Apply custom operations during traversal:

````carousel
```python
class PostorderWithCallback:
    """Postorder traversal with custom node processing."""
    
    @staticmethod
    def traverse(root, process_fn):
        """
        Traverse tree in postorder and apply process_fn to each node.
        
        Args:
            root: Root of the binary tree
            process_fn: Function to apply to each node (receives node, left_result, right_result)
        
        Returns:
            Result from processing root node
        """
        if not root:
            return None
        
        left_result = PostorderWithCallback.traverse(root.left, process_fn)
        right_result = PostorderWithCallback.traverse(root.right, process_fn)
        
        return process_fn(root, left_result, right_result)
    
    @staticmethod
    def tree_height(root):
        """Calculate height of tree using postorder."""
        def calc_height(node, left_h, right_h):
            left_depth = left_h if left_h is not None else -1
            right_depth = right_h if right_h is not None else -1
            return 1 + max(left_depth, right_depth)
        
        return PostorderWithCallback.traverse(root, calc_height)
    
    @staticmethod
    def tree_sum(root):
        """Calculate sum of all node values."""
        def calc_sum(node, left_sum, right_sum):
            left_val = left_sum if left_sum is not None else 0
            right_val = right_sum if right_sum is not None else 0
            return node.val + left_val + right_val
        
        return PostorderWithCallback.traverse(root, calc_sum)
```
````

### 2. N-ary Tree Postorder

Extension for trees with arbitrary number of children:

````carousel
```python
class NaryTreeNode:
    """Definition for an N-ary tree node."""
    def __init__(self, val=0, children=None):
        self.val = val
        self.children = children if children is not None else []


class NaryPostorder:
    """Postorder traversal for N-ary trees."""
    
    @staticmethod
    def recursive(root):
        """Recursive postorder for N-ary tree."""
        result = []
        
        def traverse(node):
            if not node:
                return
            # Process all children first
            for child in node.children:
                traverse(child)
            # Then process current node
            result.append(node.val)
        
        traverse(root)
        return result
    
    @staticmethod
    def iterative(root):
        """Iterative postorder for N-ary tree using single stack."""
        if not root:
            return []
        
        result = []
        stack = [(root, False)]  # (node, visited)
        
        while stack:
            node, visited = stack.pop()
            
            if visited:
                result.append(node.val)
            else:
                # Mark as visited and push back
                stack.append((node, True))
                # Push children in reverse order (rightmost first)
                for child in reversed(node.children):
                    stack.append((child, False))
        
        return result
```
````

### 3. Threaded Tree Postorder (Morris-like)

Space-optimized approach using tree threading:

````carousel
```python
class ThreadedPostorder:
    """
    Postorder traversal with O(1) extra space (excluding output).
    Uses temporary tree modification with restoration.
    """
    
    @staticmethod
    def traverse(root):
        """
        O(1) space postorder traversal.
        
        Time: O(n)
        Space: O(1) auxiliary
        """
        if not root:
            return []
        
        result = []
        dummy = TreeNode(0)
        dummy.left = root
        current = dummy
        
        while current:
            if not current.left:
                current = current.right
            else:
                # Find predecessor
                predecessor = current.left
                while predecessor.right and predecessor.right != current:
                    predecessor = predecessor.right
                
                if not predecessor.right:
                    # Create thread
                    predecessor.right = current
                    current = current.left
                else:
                    # Remove thread and process
                    predecessor.right = None
                    # Process nodes from current.left to predecessor in reverse
                    ThreadedPostorder._add_reverse_path(result, current.left, predecessor)
                    current = current.right
        
        return result
    
    @staticmethod
    def _add_reverse_path(result, from_node, to_node):
        """Add nodes from from_node to to_node in reverse order."""
        # Reverse the path
        prev = None
        current = from_node
        while current != to_node:
            next_node = current.right
            current.right = prev
            prev = current
            current = next_node
        
        # Add to result
        temp = to_node
        while temp != from_node:
            result.append(temp.val)
            temp = temp.right
        result.append(from_node.val)
        
        # Restore the path
        prev = None
        current = to_node
        while current != from_node:
            next_node = current.right
            current.right = prev
            prev = current
            current = next_node
```
````

### 4. Parallel Postorder

For very large trees, process subtrees in parallel:

````carousel
```python
from concurrent.futures import ThreadPoolExecutor

class ParallelPostorder:
    """Parallel postorder traversal for large trees."""
    
    @staticmethod
    def traverse(root, max_depth=4):
        """
        Parallel postorder with depth limit.
        
        Args:
            root: Root of the tree
            max_depth: Depth at which to switch to sequential
        
        Returns:
            List of values in postorder
        """
        if not root:
            return []
        
        result = []
        ParallelPostorder._parallel_traverse(root, result, 0, max_depth)
        return result
    
    @staticmethod
    def _parallel_traverse(node, result, depth, max_depth):
        if not node:
            return
        
        if depth >= max_depth:
            # Switch to sequential for deeper levels
            ParallelPostorder._sequential_traverse(node, result)
            return
        
        # Process children in parallel at higher levels
        left_result = []
        right_result = []
        
        with ThreadPoolExecutor(max_workers=2) as executor:
            future_left = executor.submit(
                ParallelPostorder._parallel_traverse, 
                node.left, left_result, depth + 1, max_depth
            )
            future_right = executor.submit(
                ParallelPostorder._parallel_traverse,
                node.right, right_result, depth + 1, max_depth
            )
            future_left.result()
            future_right.result()
        
        result.extend(left_result)
        result.extend(right_result)
        result.append(node.val)
    
    @staticmethod
    def _sequential_traverse(node, result):
        if not node:
            return
        ParallelPostorder._sequential_traverse(node.left, result)
        ParallelPostorder._sequential_traverse(node.right, result)
        result.append(node.val)
```
````

---

## Practice Problems

### Problem 1: Binary Tree Postorder Traversal

**Problem:** [LeetCode 145 - Binary Tree Postorder Traversal](https://leetcode.com/problems/binary-tree-postorder-traversal/)

**Description:** Given the root of a binary tree, return the postorder traversal of its nodes' values.

**How to Apply Postorder DFS:**
- This is the fundamental postorder traversal problem
- Implement both recursive and iterative solutions
- The two-stack approach is most intuitive for iterative

**Key Insight:** The root is processed after both subtrees, making postorder perfect for bottom-up aggregation.

---

### Problem 2: Binary Tree Maximum Path Sum

**Problem:** [LeetCode 124 - Binary Tree Maximum Path Sum](https://leetcode.com/problems/binary-tree-maximum-path-sum/)

**Description:** A path in a binary tree is a sequence of nodes where each pair of adjacent nodes has an edge connecting them. Return the maximum path sum of any non-empty path.

**How to Apply Postorder DFS:**
- Use postorder to compute max path sum through each node
- For each node, calculate:
  - Max sum from left subtree (max(0, left_result))
  - Max sum from right subtree (max(0, right_result))
  - Current max path through node: left + right + node.val
- Return max single path (left or right + node.val) to parent

**Key Insight:** Postorder ensures we know the best paths through children before deciding the best path through parent.

---

### Problem 3: Count Univalue Subtrees

**Problem:** [LeetCode 250 - Count Univalue Subtrees](https://leetcode.com/problems/count-univalue-subtrees/)

**Description:** Given the root of a binary tree, return the number of uni-value subtrees (subtrees where all nodes have the same value).

**How to Apply Postorder DFS:**
- Process leaves first (they are always univalue)
- For each internal node, check if it's univalue:
  - Both children must be univalue subtrees
  - Node value must equal children's values (if they exist)
- Count and propagate result upward

**Key Insight:** You must verify children are univalued before the parent can be verified - perfect for postorder.

---

### Problem 4: Delete Tree Nodes

**Problem:** [LeetCode 1273 - Delete Tree Nodes](https://leetcode.com/problems/delete-tree-nodes/)

**Description:** Return the number of nodes remaining in the tree after removing nodes with subtree sums equal to zero.

**How to Apply Postorder DFS:**
- Compute subtree sums bottom-up using postorder
- Track which subtrees have zero sum
- Delete (don't count) nodes whose subtree sum is zero
- Return count of remaining nodes

**Key Insight:** You need the sum of the entire subtree to decide deletion - postorder provides this naturally.

---

### Problem 5: House Robber III

**Problem:** [LeetCode 337 - House Robber III](https://leetcode.com/problems/house-robber-iii/)

**Description:** The thief has found a new place to rob. Houses are arranged in a binary tree structure. Determine the maximum amount of money the thief can rob without alerting the police (cannot rob directly connected houses).

**How to Apply Postorder DFS:**
- For each node, compute two values:
  - `rob`: max money if we rob this node (can't rob children)
  - `not_rob`: max money if we don't rob this node (can rob children)
- `rob = node.val + left.not_rob + right.not_rob`
- `not_rob = max(left.rob, left.not_rob) + max(right.rob, right.not_rob)`
- Return both values to parent

**Key Insight:** Decision at each node depends on optimal decisions from children - classic postorder DP.

---

## Video Tutorial Links

### Fundamentals

- [Binary Tree Postorder Traversal (NeetCode)](https://www.youtube.com/watch?v=QzO1mP8b624) - Clear explanation with code
- [Tree Traversals Explained (Back To Back SWE)](https://www.youtube.com/watch?v=1WxLM2hwL-U) - Comprehensive traversal comparison
- [Iterative Postorder Using Two Stacks (Kevin Naughton Jr.)](https://www.youtube.com/watch?v=qT65HltK2uE) - Stack-based approach explained
- [DFS Traversals In-Depth (Abdul Bari)](https://www.youtube.com/watch?v=gm8DUJJhmY4) - Visual animation of all traversals

### Advanced Topics

- [Maximum Path Sum in Binary Tree (NeetCode)](https://www.youtube.com/watch?v=Hr5cWUld4vU) - Bottom-up postorder DP
- [House Robber III Solution (Nick White)](https://www.youtube.com/watch?v=nHR8ytpzz7c) - Postorder DP pattern
- [Morris Traversal O(1) Space](https://www.youtube.com/watch?v=wGXB9OWhPTg) - Space-optimized tree traversal
- [Tree DP Patterns (Lead Coding)](https://www.youtube.com/watch?v=d1uQ8C9E0kk) - Postorder in dynamic programming

---

## Follow-up Questions

### Q1: Why can't we do postorder traversal using just one simple stack without tracking?

**Answer:** In postorder, we need to visit a node twice - once to explore its right subtree after finishing the left, and once to process the node itself after both subtrees. Without tracking which children have been visited, we can't distinguish between:
- Just arrived at node (need to go left)
- Returned from left (need to go right)
- Returned from right (need to process node)

The single-stack solution uses `lastVisited` to track this state, or we can use a visited flag in the stack.

### Q2: What happens with postorder on an infinitely deep tree?

**Answer:** The recursive implementation will hit the system recursion limit or cause a stack overflow. The iterative implementations will also fail as they need O(h) space. For very deep trees:
- Use an explicit stack with manual memory management
- Convert to an iterative approach with tail-call optimization
- Use a modified Morris traversal for O(1) space

### Q3: Can postorder be used to serialize a binary tree?

**Answer:** Postorder alone cannot uniquely serialize a binary tree because different trees can produce the same postorder sequence. For example:
```
  1      1
 /          \
2            2
```
Both have postorder `[2, 1]`. To uniquely serialize, you need:
- Preorder + Inorder, or
- Postorder + Inorder, or  
- Level order with null markers

### Q4: How does postorder compare to BFS for finding tree height?

**Answer:** Both work, but differently:
- **Postorder (DFS)**: Computes height bottom-up. Each node returns `1 + max(left_height, right_height)`. Time: O(n), Space: O(h)
- **BFS (Level Order)**: Counts levels from top. Increment counter for each level processed. Time: O(n), Space: O(w) where w is max width

Postorder is more natural for height calculation, but BFS can be more space-efficient for balanced trees.

### Q5: When would you choose iterative over recursive postorder?

**Answer:** Choose iterative when:
- Tree depth might exceed recursion limit (typically ~1000 in Python)
- You need explicit control over the stack for debugging
- Memory is constrained (single-stack iterative uses less than two-stack)
- You're in an environment with limited stack space (embedded systems)

Choose recursive when:
- Code clarity is priority
- Tree is guaranteed to be balanced
- The language optimizes tail recursion (though postorder isn't tail-recursive)

---

## Summary

DFS Postorder is a fundamental tree traversal algorithm characterized by its **Left-Right-Root** processing order. It excels in scenarios requiring **bottom-up computation** where child information must be available before parent processing.

**Key Takeaways:**

- **Processing Order**: Left subtree → Right subtree → Root
- **Primary Use Cases**: Tree deletion, expression evaluation, bottom-up DP
- **Time Complexity**: O(n) - visits each node exactly once
- **Space Complexity**: O(h) - height of tree for stack storage
- **Implementation Options**: Recursive (clean), Two-Stack (intuitive), Single-Stack (space-optimal)

**When to Use:**
- ✅ Computing subtree properties (sum, count, height)
- ✅ Tree deletion and memory management
- ✅ Expression tree evaluation
- ✅ Problems requiring information to flow from leaves to root
- ❌ When you need sorted order from BST (use inorder)
- ❌ When you need top-down propagation (use preorder)

**Implementation Recommendations:**
- Start with recursive for clarity and correctness
- Use two-stack iterative for interview settings (easier to explain)
- Use single-stack iterative for production with deep trees
- Consider Morris traversal only when space is absolutely critical

This traversal pattern is essential for tree-based dynamic programming and appears frequently in competitive programming and technical interviews. Mastering postorder unlocks solutions to a wide class of tree problems involving subtree aggregation and bottom-up decision making.

---

## Related Algorithms

- [DFS Preorder](./dfs-preorder.md) - Root-Left-Right traversal for top-down processing
- [DFS Inorder](./dfs-inorder.md) - Left-Root-Right traversal for BST problems
- [BFS Level Order](./bfs-level-order.md) - Level-by-level traversal for shortest path
- [Binary Tree Maximum Path Sum](./binary-tree-maximum-path-sum.md) - Postorder DP application
- [Lowest Common Ancestor](./lca.md) - Uses tree traversals for ancestor queries
