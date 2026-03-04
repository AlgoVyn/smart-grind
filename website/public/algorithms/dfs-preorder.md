# DFS Preorder

## Category
Trees & BSTs

## Description

DFS Preorder traversal is a fundamental tree traversal algorithm that visits nodes in **Root-Left-Right** order. This means the root is processed before its left and right subtrees, making it ideal for scenarios where you need to process parent nodes before their subtrees. It's one of the three primary depth-first traversal strategies (alongside Inorder and Postorder) and is extensively used in tree serialization, expression tree evaluation, file system operations, and many tree-related algorithms.

---

## When to Use

Use the DFS Preorder algorithm when you need to solve problems involving:

- **Tree Serialization/Deserialization**: Creating a unique representation of a tree that can be reconstructed
- **Expression Tree Operations**: Evaluating prefix expressions or converting to prefix notation
- **File System Traversal**: Navigating directory structures where parent directories must be processed before children
- **DOM Tree Operations**: Walking HTML/XML trees where parent elements are processed before child elements
- **Tree Copy/Clone**: Creating a deep copy of a binary tree
- **Preorder Logging/Recording**: Recording the visit order of nodes for debugging or auditing
- **Path-based Operations**: Problems where you need to process a node before exploring its children

### Comparison with Alternative Tree Traversals

| Traversal Order | Visit Sequence | Use Case | Example Problems |
|-----------------|----------------|----------|------------------|
| **Preorder** | Root → Left → Right | Process node before children | Tree clone, serialization, prefix expression |
| **Inorder** | Left → Root → Right | BST operations, sorted output | BST search, kth smallest, validate BST |
| **Postorder** | Left → Right → Root | Process children before node | Delete tree, expression evaluation, bottom-up DP |
| **Level-order** | Level by level | Breadth-first operations | Shortest path, level averages |

### When to Choose Preorder vs Other DFS Orders

- **Choose Preorder** when:
  - You need to process the parent node before its children
  - Tree serialization is required (preorder with null markers creates unique representation)
  - You're building a tree from its preorder traversal
  - You need prefix expression evaluation

- **Choose Inorder** when:
  - Working with BSTs (gives sorted order)
  - You need nodes in ascending order
  - You're validating or debugging BST properties

- **Choose Postorder** when:
  - You need to process children before parent
  - Tree deletion (free children before parent)
  - Expression postfix evaluation
  - Bottom-up dynamic programming on trees

---

## Algorithm Explanation

### Core Concept

DFS Preorder traversal follows the principle of **depth-first exploration**, where we explore as far as possible along each branch before backtracking. The "preorder" designation specifically means the root is visited before its left and right subtrees. This creates a specific visitation order: process current node, recursively visit left subtree, then recursively visit right subtree.

The key insight behind preorder traversal is its ability to establish a **parent-before-child processing order**, which is essential for many tree algorithms that need to make decisions based on parent information before processing children.

### How It Works

#### Recursive Implementation:
1. Start at the root node
2. **Visit** the current node (process its value)
3. **Recursively traverse** the left subtree
4. **Recursively traverse** the right subtree

#### Iterative Implementation:
1. Use an explicit stack data structure
2. Push root onto stack
3. While stack is not empty:
   - Pop a node from stack
   - Visit the node
   - Push right child first (so left is processed first due to LIFO)
   - Push left child if exists

### Visual Representation

For the binary tree:
```
        1
       / \
      2   3
     / \
    4   5
```

The preorder traversal visits nodes in this sequence:

```
Step 1: Visit 1 (root)                    → [1]
Step 2: Go left to 2, visit 2             → [1, 2]
Step 3: Go left to 4, visit 4              → [1, 2, 4]
Step 4: 4 has no children, backtrack to 2
Step 5: Go right to 5, visit 5             → [1, 2, 4, 5]
Step 6: 5 has no children, backtrack to 2
Step 7: 2's subtree done, backtrack to 1
Step 8: Go right to 3, visit 3             → [1, 2, 4, 5, 3]
Step 9: 3 has no children, done

Final Result: [1, 2, 4, 5, 3]
```

### Why Preorder Works for Specific Problems

- **Tree Serialization**: Preorder with null node markers creates a unique string representation because the root is always first
- **Tree Cloning**: Process current node, then clone children - parent must exist before children are attached
- **Prefix Expression**: Evaluate operators before operands by processing operator nodes first

### Implementation Approaches

1. **Recursive**: Most intuitive and concise - uses the call stack implicitly
   - Pros: Clean, readable code
   - Cons: Stack overflow risk for very deep trees

2. **Iterative**: Uses explicit stack - necessary for very deep trees
   - Pros: No stack overflow risk, more control
   - Cons: More verbose code

3. **Morris Preorder**: Threading technique for O(1) space
   - Pros: Constant space complexity
   - Cons: Modifies tree temporarily, complex to implement

---

## Algorithm Steps

### Recursive Approach

1. **Base Case**: If current node is null, return (nothing to process)
2. **Visit Root**: Process the current node's value (add to result, print, etc.)
3. **Traverse Left**: Recursively call preorder on node.left
4. **Traverse Right**: Recursively call preorder on node.right

### Iterative Approach

1. **Initialize**: Create an empty stack and result array
2. **Push Root**: Add root node to stack
3. **While Stack Not Empty**:
   - Pop the top node from stack
   - Visit the node (process its value)
   - Push right child first (if exists)
   - Push left child second (if exists)
   - This ensures left is processed before right

### Morris Preorder Approach

1. **Initialize**: Set current node to root
2. **While Current Not Null**:
   - If left child is null:
     - Visit current node
     - Move to right child
   - Else:
     - Find inorder predecessor (rightmost node in left subtree)
     - If predecessor's right is null:
       - Visit current node
       - Create temporary thread to current
       - Move to left child
     - Else (thread exists):
       - Remove thread
       - Move to right child

---

## Implementation

### Template Code (Binary Tree Preorder Traversal)

````carousel
```python
from typing import List, Optional


class TreeNode:
    """Definition for a binary tree node."""
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


# ==================== RECURSIVE IMPLEMENTATION ====================

def preorder_recursive(root: Optional[TreeNode]) -> List[int]:
    """
    Perform preorder (root-left-right) traversal of binary tree recursively.
    
    Args:
        root: Root node of the binary tree
        
    Returns:
        List of node values in preorder traversal
        
    Time: O(n) - visit each node exactly once
    Space: O(h) - recursion stack, h = height of tree
           Worst case O(n) for skewed tree, O(log n) for balanced
    """
    result = []
    
    def traverse(node: Optional[TreeNode]) -> None:
        if not node:
            return
        
        # Visit root first (preorder = root before children)
        result.append(node.val)
        
        # Then traverse left subtree
        traverse(node.left)
        
        # Then traverse right subtree
        traverse(node.right)
    
    traverse(root)
    return result


# ==================== ITERATIVE IMPLEMENTATION ====================

def preorder_iterative(root: Optional[TreeNode]) -> List[int]:
    """
    Perform preorder traversal iteratively using explicit stack.
    
    Args:
        root: Root node of the binary tree
        
    Returns:
        List of node values in preorder traversal
        
    Time: O(n)
    Space: O(h) - explicit stack, h = height of tree
    """
    if not root:
        return []
    
    result = []
    stack = [root]
    
    while stack:
        node = stack.pop()
        
        # Visit current node
        result.append(node.val)
        
        # Push right first so left is processed first (LIFO)
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    
    return result


# ==================== MORRIS PREORDER (O(1) SPACE) ====================

def preorder_morris(root: Optional[TreeNode]) -> List[int]:
    """
    Morris preorder traversal - O(1) space without recursion/stack.
    
    Uses threading technique: temporarily create links back to ancestors
    to find the way back to the tree after traversing left subtrees.
    
    Args:
        root: Root node of the binary tree
        
    Returns:
        List of node values in preorder traversal
        
    Time: O(n) - each node visited at most twice
    Space: O(1) - no extra space for stack or recursion
    """
    result = []
    current = root
    
    while current:
        if not current.left:
            # No left subtree, visit current and go right
            result.append(current.val)
            current = current.right
        else:
            # Find inorder predecessor (rightmost node in left subtree)
            predecessor = current.left
            while predecessor.right and predecessor.right != current:
                predecessor = predecessor.right
            
            if not predecessor.right:
                # First time visiting - create temporary thread
                result.append(current.val)  # Visit root
                predecessor.right = current  # Create thread back to current
                current = current.left  # Move to left subtree
            else:
                # Second time visiting - restore tree and move right
                predecessor.right = None  # Remove thread
                current = current.right  # Move to right subtree
    
    return result


# ==================== EXAMPLE USAGE AND DEMONSTRATION ====================

def build_example_tree() -> TreeNode:
    """
    Build the example tree:
            1
           / \
          2   3
         / \
        4   5
    """
    root = TreeNode(1)
    root.left = TreeNode(2)
    root.right = TreeNode(3)
    root.left.left = TreeNode(4)
    root.left.right = TreeNode(5)
    return root


if __name__ == "__main__":
    # Build example tree
    root = build_example_tree()
    
    print("Example Tree:")
    print("        1")
    print("       / \\")
    print("      2   3")
    print("     / \\")
    print("    4   5")
    print()
    
    # Test all implementations
    print("Recursive Preorder:", preorder_recursive(root))
    print("Iterative Preorder:", preorder_iterative(root))
    print("Morris Preorder:   ", preorder_morris(root))
    
    # Test edge cases
    print("\nEdge Cases:")
    print("Empty tree:", preorder_recursive(None))
    print("Single node:", preorder_recursive(TreeNode(42)))
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
    TreeNode* left;
    TreeNode* right;
    TreeNode() : val(0), left(nullptr), right(nullptr) {}
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

// ==================== RECURSIVE IMPLEMENTATION ====================

/**
 * Perform preorder (root-left-right) traversal recursively.
 * 
 * Time: O(n)
 * Space: O(h) - recursion stack, h = height of tree
 */
void preorderRecursiveHelper(TreeNode* node, vector<int>& result) {
    if (!node) return;
    
    // Visit root first
    result.push_back(node->val);
    
    // Traverse left subtree
    preorderRecursiveHelper(node->left, result);
    
    // Traverse right subtree
    preorderRecursiveHelper(node->right, result);
}

vector<int> preorderRecursive(TreeNode* root) {
    vector<int> result;
    preorderRecursiveHelper(root, result);
    return result;
}

// ==================== ITERATIVE IMPLEMENTATION ====================

/**
 * Perform preorder traversal iteratively using explicit stack.
 * 
 * Time: O(n)
 * Space: O(h) - explicit stack
 */
vector<int> preorderIterative(TreeNode* root) {
    if (!root) return {};
    
    vector<int> result;
    stack<TreeNode*> st;
    st.push(root);
    
    while (!st.empty()) {
        TreeNode* node = st.top();
        st.pop();
        
        // Visit current node
        result.push_back(node->val);
        
        // Push right first so left is processed first
        if (node->right) st.push(node->right);
        if (node->left) st.push(node->left);
    }
    
    return result;
}

// ==================== Morris Preorder (O(1) Space) ====================

/**
 * Morris preorder traversal - O(1) space.
 * 
 * Time: O(n)
 * Space: O(1)
 */
vector<int> preorderMorris(TreeNode* root) {
    vector<int> result;
    TreeNode* current = root;
    
    while (current) {
        if (!current->left) {
            // No left subtree, visit and go right
            result.push_back(current->val);
            current = current->right;
        } else {
            // Find inorder predecessor
            TreeNode* predecessor = current->left;
            while (predecessor->right && predecessor->right != current) {
                predecessor = predecessor->right;
            }
            
            if (!predecessor->right) {
                // First visit - create thread
                result.push_back(current->val);
                predecessor->right = current;
                current = current->left;
            } else {
                // Second visit - remove thread
                predecessor->right = nullptr;
                current = current->right;
            }
        }
    }
    
    return result;
}

// ==================== Utility Functions ====================

void printVector(const vector<int>& v) {
    cout << "[";
    for (size_t i = 0; i < v.size(); i++) {
        cout << v[i];
        if (i < v.size() - 1) cout << ", ";
    }
    cout << "]" << endl;
}

TreeNode* buildExampleTree() {
    //         1
    //        / \
    //       2   3
    //      / \
    //     4   5
    TreeNode* root = new TreeNode(1);
    root->left = new TreeNode(2);
    root->right = new TreeNode(3);
    root->left->left = new TreeNode(4);
    root->left->right = new TreeNode(5);
    return root;
}

int main() {
    TreeNode* root = buildExampleTree();
    
    cout << "Example Tree:" << endl;
    cout << "        1" << endl;
    cout << "       / \\" << endl;
    cout << "      2   3" << endl;
    cout << "     / \\" << endl;
    cout << "    4   5" << endl;
    cout << endl;
    
    cout << "Recursive:  ";
    printVector(preorderRecursive(root));
    
    cout << "Iterative:  ";
    printVector(preorderIterative(root));
    
    cout << "Morris:     ";
    printVector(preorderMorris(root));
    
    // Test edge cases
    cout << "\nEdge Cases:" << endl;
    cout << "Empty:      ";
    printVector(preorderRecursive(nullptr));
    
    cout << "Single:     ";
    printVector(preorderRecursive(new TreeNode(42)));
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

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

public class PreorderTraversal {
    
    // ==================== RECURSIVE IMPLEMENTATION ====================
    
    /**
     * Perform preorder (root-left-right) traversal recursively.
     * 
     * Time: O(n)
     * Space: O(h) - recursion stack
     */
    public static List<Integer> preorderRecursive(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        traverse(root, result);
        return result;
    }
    
    private static void traverse(TreeNode node, List<Integer> result) {
        if (node == null) return;
        
        // Visit root first
        result.add(node.val);
        
        // Traverse left subtree
        traverse(node.left, result);
        
        // Traverse right subtree
        traverse(node.right, result);
    }
    
    // ==================== ITERATIVE IMPLEMENTATION ====================
    
    /**
     * Perform preorder traversal iteratively using explicit stack.
     * 
     * Time: O(n)
     * Space: O(h)
     */
    public static List<Integer> preorderIterative(TreeNode root) {
        if (root == null) return new ArrayList<>();
        
        List<Integer> result = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
        stack.push(root);
        
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            
            // Visit current node
            result.add(node.val);
            
            // Push right first so left is processed first
            if (node.right != null) stack.push(node.right);
            if (node.left != null) stack.push(node.left);
        }
        
        return result;
    }
    
    // ==================== Morris Preorder (O(1) Space) ====================
    
    /**
     * Morris preorder traversal - O(1) space.
     * 
     * Time: O(n)
     * Space: O(1)
     */
    public static List<Integer> preorderMorris(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        TreeNode current = root;
        
        while (current != null) {
            if (current.left == null) {
                // No left subtree, visit and go right
                result.add(current.val);
                current = current.right;
            } else {
                // Find inorder predecessor
                TreeNode predecessor = current.left;
                while (predecessor.right != null && predecessor.right != current) {
                    predecessor = predecessor.right;
                }
                
                if (predecessor.right == null) {
                    // First visit - create thread
                    result.add(current.val);
                    predecessor.right = current;
                    current = current.left;
                } else {
                    // Second visit - remove thread
                    predecessor.right = null;
                    current = current.right;
                }
            }
        }
        
        return result;
    }
    
    // ==================== Utility Functions ====================
    
    private static TreeNode buildExampleTree() {
        //         1
        //        / \
        //       2   3
        //      / \
        //     4   5
        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
        root.left.left = new TreeNode(4);
        root.left.right = new TreeNode(5);
        return root;
    }
    
    public static void main(String[] args) {
        TreeNode root = buildExampleTree();
        
        System.out.println("Example Tree:");
        System.out.println("        1");
        System.out.println("       / \\");
        System.out.println("      2   3");
        System.out.println("     / \\");
        System.out.println("    4   5");
        System.out.println();
        
        System.out.print("Recursive:  ");
        System.out.println(preorderRecursive(root));
        
        System.out.print("Iterative:  ");
        System.out.println(preorderIterative(root));
        
        System.out.print("Morris:     ");
        System.out.println(preorderMorris(root));
        
        // Test edge cases
        System.out.println("\nEdge Cases:");
        System.out.print("Empty:      ");
        System.out.println(preorderRecursive(null));
        
        System.out.print("Single:     ");
        System.out.println(preorderRecursive(new TreeNode(42)));
    }
}
```

<!-- slide -->
```javascript
/**
 * Definition for a binary tree node.
 */
class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

// ==================== RECURSIVE IMPLEMENTATION ====================

/**
 * Perform preorder (root-left-right) traversal recursively.
 * 
 * Time: O(n)
 * Space: O(h) - recursion stack
 * 
 * @param {TreeNode} root - Root of the binary tree
 * @returns {number[]} - Array of node values in preorder
 */
function preorderRecursive(root) {
    const result = [];
    
    function traverse(node) {
        if (!node) return;
        
        // Visit root first (preorder = root before children)
        result.push(node.val);
        
        // Traverse left subtree
        traverse(node.left);
        
        // Traverse right subtree
        traverse(node.right);
    }
    
    traverse(root);
    return result;
}

// ==================== ITERATIVE IMPLEMENTATION ====================

/**
 * Perform preorder traversal iteratively using explicit stack.
 * 
 * Time: O(n)
 * Space: O(h) - explicit stack
 * 
 * @param {TreeNode} root - Root of the binary tree
 * @returns {number[]} - Array of node values in preorder
 */
function preorderIterative(root) {
    if (!root) return [];
    
    const result = [];
    const stack = [root];
    
    while (stack.length > 0) {
        const node = stack.pop();
        
        // Visit current node
        result.push(node.val);
        
        // Push right first so left is processed first (LIFO)
        if (node.right) stack.push(node.right);
        if (node.left) stack.push(node.left);
    }
    
    return result;
}

// ==================== Morris Preorder (O(1) Space) ====================

/**
 * Morris preorder traversal - O(1) space without recursion/stack.
 * 
 * Time: O(n)
 * Space: O(1)
 * 
 * @param {TreeNode} root - Root of the binary tree
 * @returns {number[]} - Array of node values in preorder
 */
function preorderMorris(root) {
    const result = [];
    let current = root;
    
    while (current) {
        if (!current.left) {
            // No left subtree, visit and go right
            result.push(current.val);
            current = current.right;
        } else {
            // Find inorder predecessor
            let predecessor = current.left;
            while (predecessor.right && predecessor.right !== current) {
                predecessor = predecessor.right;
            }
            
            if (!predecessor.right) {
                // First time visiting - create temporary thread
                result.push(current.val);
                predecessor.right = current;
                current = current.left;
            } else {
                // Second time visiting - remove thread
                predecessor.right = null;
                current = current.right;
            }
        }
    }
    
    return result;
}

// ==================== Example Usage ====================

// Build example tree:
//         1
//        / \
//       2   3
//      / \
//     4   5
function buildExampleTree() {
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(3);
    root.left.left = new TreeNode(4);
    root.left.right = new TreeNode(5);
    return root;
}

// Run examples
const root = buildExampleTree();

console.log("Example Tree:");
console.log("        1");
console.log("       / \\");
console.log("      2   3");
console.log("     / \\");
console.log("    4   5");
console.log();

console.log("Recursive:", preorderRecursive(root));
console.log("Iterative:", preorderIterative(root));
console.log("Morris:    ", preorderMorris(root));

// Test edge cases
console.log("\nEdge Cases:");
console.log("Empty tree:", preorderRecursive(null));
console.log("Single node:", preorderRecursive(new TreeNode(42)));
```
````

---

## Time Complexity Analysis

| Implementation | Time Complexity | Space Complexity | Notes |
|----------------|-----------------|-----------------|-------|
| **Recursive** | O(n) | O(h) | h = height, worst O(n) for skewed tree |
| **Iterative** | O(n) | O(h) | h = height, worst O(n) for skewed tree |
| **Morris** | O(n) | O(1) | Each node visited at most twice |

### Detailed Breakdown

- **Time Complexity**: Each node is visited exactly once in all implementations
  - Visit = process node value (append to result)
  - Total: O(n) where n = number of nodes

- **Space Complexity**:
  - **Recursive**: O(h) for call stack where h = tree height
    - Balanced tree: O(log n)
    - Skewed tree: O(n)
  - **Iterative**: O(h) for explicit stack
  - **Morris**: O(1) - no extra space needed

### When to Use Each Implementation

| Scenario | Recommended Implementation |
|----------|---------------------------|
| General use, clean code | Recursive |
| Very deep trees (avoid stack overflow) | Iterative |
| Memory-constrained environments | Morris |
| Production code with safety concerns | Iterative |

---

## Space Complexity Analysis

### Recursive Implementation
- **Call Stack Space**: O(h) where h is tree height
- **Result Array**: O(n) for storing traversal order
- **Total Auxiliary Space**: O(h) + O(n) = O(n)

### Iterative Implementation
- **Explicit Stack**: O(h) maximum size
- **Result Array**: O(n)
- **Total Auxiliary Space**: O(h) + O(n) = O(n)

### Morris Implementation
- **No Stack/Recursion**: O(1)
- **Result Array**: O(n)
- **Total Auxiliary Space**: O(n)

### Space Optimization Notes

- For extremely deep trees (height > 10^5), prefer iterative or Morris
- Morris traversal modifies tree structure temporarily - not suitable for read-only traversals
- Iterative is generally preferred in production due to predictability and no stack overflow risk

---

## Common Variations

### 1. Preorder with Parent Information

Pass parent node information during traversal:

````carousel
```python
def preorder_with_parent(root: Optional[TreeNode], parent: Optional[TreeNode] = None) -> List[int]:
    """Preorder traversal with parent node information."""
    result = []
    
    def traverse(node, parent):
        if not node:
            return
        
        # Process current node - can access parent info
        result.append((node.val, parent.val if parent else None))
        
        traverse(node.left, node)
        traverse(node.right, node)
    
    traverse(root, parent)
    return result
```
````

### 2. Preorder with Depth Information

Track the depth of each node:

````carousel
```python
def preorder_with_depth(root: Optional[TreeNode]) -> List[tuple]:
    """Preorder traversal with depth information."""
    result = []
    
    def traverse(node, depth):
        if not node:
            return
        
        result.append((node.val, depth))
        traverse(node.left, depth + 1)
        traverse(node.right, depth + 1)
    
    traverse(root, 0)
    return result
```
````

### 3. Preorder with Path Tracking

Track the path from root to current node:

````carousel
```python
def preorder_with_path(root: Optional[TreeNode]) -> List[List[int]]:
    """Preorder traversal with full path from root."""
    result = []
    
    def traverse(node, path):
        if not node:
            return
        
        path.append(node.val)
        result.append(path.copy())
        
        traverse(node.left, path)
        traverse(node.right, path)
        
        path.pop()
    
    traverse(root, [])
    return result
```
````

### 4. Preorder Stopping at Target

Stop traversal once target is found:

````carousel
```python
def preorder_find(root: Optional[TreeNode], target: int) -> Optional[TreeNode]:
    """Find node with target value using preorder."""
    def traverse(node):
        if not node:
            return None
        
        if node.val == target:
            return node
        
        # Search left first
        left_result = traverse(node.left)
        if left_result:
            return left_result
        
        # Then search right
        return traverse(node.right)
    
    return traverse(root)
```
````

### 5. Preorder for N-ary Trees

Extension to N-ary trees (nodes with arbitrary number of children):

````carousel
```python
class Node:
    def __init__(self, val=None, children=None):
        self.val = val
        self.children = children if children else []

def preorder_nary(root: Node) -> List[int]:
    """Preorder traversal for N-ary tree."""
    if not root:
        return []
    
    result = [root.val]
    
    for child in root.children:
        result.extend(preorder_nary(child))
    
    return result

def preorder_nary_iterative(root: Node) -> List[int]:
    """Iterative preorder for N-ary tree."""
    if not root:
        return []
    
    result = []
    stack = [root]
    
    while stack:
        node = stack.pop()
        result.append(node.val)
        
        # Add children in reverse order
        stack.extend(reversed(node.children))
    
    return result
```
````

---

## Practice Problems

### Problem 1: Binary Tree Preorder Traversal

**Problem:** [LeetCode 144 - Binary Tree Preorder Traversal](https://leetcode.com/problems/binary-tree-preorder-traversal/)

**Description:** Given the root of a binary tree, return the preorder traversal of its nodes' values.

**How to Apply Preorder:**
- Visit root first, then recursively process left and right subtrees
- For iterative: use stack, push right before left to ensure left is processed first

---

### Problem 2: Clone Binary Tree

**Problem:** [LeetCode 1379 - Find a Corresponding Node of a Clone](https://leetcode.com/problems/find-a-corresponding-node-of-a-clone-binary-tree/)

**Description:** Given two binary trees original and cloned and a target node, find the corresponding node in the cloned tree.

**How to Apply Preorder:**
- Traverse both trees simultaneously in preorder
- Since preorder visits parent before children, we can match nodes in the same order
- Parent must be cloned before children can be attached

---

### Problem 3: Serialize and Deserialize Binary Tree

**Problem:** [LeetCode 297 - Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/)

**Description:** Design an algorithm to serialize and deserialize a binary tree.

**How to Apply Preorder:**
- Preorder with null markers creates unique representation
- Serialization: Preorder traversal, mark null nodes with special symbol
- Deserialization: Read preorder, recursively build tree using first non-null as root

---

### Problem 4: Evaluate Expression Tree

**Problem:** [LeetCode 638 - Expression Evaluation](https://leetcode.com/problems/minimum-cost-to-reach-destination-in-time/)

**Description:** Given an expression tree, evaluate it to get the result.

**How to Apply Preorder:**
- Expression tree: operators are internal nodes, operands are leaves
- Preorder (operator-operand-operand) gives prefix notation
- Evaluate: process operator, then recursively evaluate both operands

---

### Problem 5: File System Traversal

**Problem:** [LeetCode 588 - Design In-Memory File System](https://leetcode.com/problems/design-in-memory-file-system/)

**Description:** Design an in-memory file system with mkdir, addContentToFile, readContentFromFile, and list operations.

**How to Apply Preorder:**
- Directory structure is a tree
- Preorder traversal processes parent directories before children
- Necessary for operations like "cd ..", path resolution

---

## Video Tutorial Links

### Fundamentals

- [Binary Tree Traversal - Preorder (Take U Forward)](https://www.youtube.com/watch?v=gm8DU5hm8Ao) - Comprehensive preorder traversal explanation
- [Preorder Traversal (Coding Ninjas)](https://www.youtube.com/watch?v=RlUu72xM7lU) - Visual explanation with examples
- [Tree Traversals (Backseat Coding)](https://www.youtube.com/watch?v=oM1MkvCsANQ) - All tree traversals explained

### Implementation Techniques

- [Recursive vs Iterative Tree Traversal](https://www.youtube.com/watch?v=5zVNplHjG6M) - When to use which approach
- [Morris Traversal - O(1) Space](https://www.youtube.com/watch?v=80Zug6gD2j4) - Advanced space optimization
- [Stack-based Iterative Traversal](https://www.youtube.com/watch?v=l45Q3UD6uE4) - Detailed iterative implementation

### Problem Solutions

- [Serialize Deserialize Binary Tree](https://www.youtube.com/watch?v=-YbXySKJQX8) - Preorder for tree serialization
- [Clone Binary Tree](https://www.youtube.com/watch?v=vSun1094z9E) - Preorder for tree cloning
- [Expression Tree Evaluation](https://www.youtube.com/watch?v=JoF0sL8WcHM) - Preorder for prefix expressions

---

## Follow-up Questions

### Q1: What is the difference between preorder, inorder, and postorder traversal?

**Answer:** The key difference lies in when the root node is visited relative to its left and right subtrees:
- **Preorder**: Root → Left → Right (root is visited first)
- **Inorder**: Left → Root → Right (root is visited in the middle)
- **Postorder**: Left → Right → Root (root is visited last)

For the tree:
```
        1
       / \
      2   3
```
- Preorder: [1, 2, 3]
- Inorder: [2, 1, 3]
- Postorder: [2, 3, 1]

Each traversal has specific use cases: preorder for serialization and copying, inorder for BST operations, postorder for deletion and evaluation.

### Q2: When should I use iterative over recursive traversal?

**Answer:** Use iterative traversal when:
1. **Tree depth is very large**: Recursive approach may cause stack overflow for trees with depth > 10^5
2. **Memory is constrained**: Recursive call stack uses more memory
3. **Production code safety**: Iterative is more predictable and has bounded memory usage
4. **You need more control**: Iterative allows pausing, resuming, or early termination

### Q3: Can preorder traversal be used to validate a BST?

**Answer:** Not directly - inorder traversal is better for BST validation because it produces sorted order. However, preorder can be modified to validate BST by passing min/max bounds:
- Each node must be greater than all values in left subtree
- Each node must be less than all values in right subtree
- Track (min, max) bounds during preorder traversal

### Q4: What is Morris traversal and when should I use it?

**Answer:** Morris traversal uses a threading technique to achieve O(1) space complexity without using a stack or recursion. It temporarily creates links back to ancestors to find the way back to the tree.

**Use Morris when:**
- Space is extremely constrained
- Tree is read-only (modifies tree temporarily)
- You need constant space complexity

**Avoid Morris when:**
- Tree cannot be modified
- Code clarity is important
- Regular stack is acceptable

### Q5: How does preorder help in tree serialization?

**Answer:** Preorder is ideal for serialization because:
1. **Root first**: The root is always the first element, establishing tree structure immediately
2. **Unique representation**: With null markers, preorder produces a unique string for each tree structure
3. **Simple deserialization**: Read preorder, recursively build tree - first non-null is always the parent

Example: Tree [1,2,3,null,4] serializes to "1#2#3##4##" (where # = null)

---

## Summary

DFS Preorder traversal is a fundamental tree algorithm with the following key characteristics:

- **Order**: Root → Left → Right - parent is processed before children
- **Time**: O(n) - each node visited exactly once
- **Space**: O(h) for recursive/iterative, O(1) for Morris
- **Key Use Cases**: Tree serialization, cloning, prefix expression evaluation, file system traversal

**When to use Preorder:**
- ✅ Tree serialization/deserialization
- ✅ Tree copying/cloning
- ✅ Prefix expression evaluation
- ✅ File system navigation
- ✅ DOM tree traversal
- ✅ Any problem requiring parent-before-child processing

**When NOT to use Preorder:**
- ❌ BST operations (use Inorder)
- ❌ Tree deletion (use Postorder)
- ❌ Level-based processing (use BFS)

This traversal pattern is essential for competitive programming and technical interviews, forming the foundation for many more complex tree algorithms like binary lifting, tree DP, and path-based queries.

---

## Related Algorithms

- [Binary Lifting](./binary-lifting.md) - Jump-based ancestor queries using preorder
- [Inorder Traversal](./dfs-inorder.md) - BST operations, sorted output
- [Postorder Traversal](./dfs-postorder.md) - Bottom-up processing, tree deletion
- [BFS Level Order](./bfs-level-order.md) - Breadth-first tree traversal
- [Tree DFS Recursive](./tree-dfs-recursive-preorder-traversal.md) - Preorder pattern in practice
