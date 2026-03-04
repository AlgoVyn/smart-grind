# DFS Inorder Traversal

## Category
Trees & BSTs

## Description

DFS Inorder Traversal is a **depth-first tree traversal** algorithm that visits nodes in **Left-Root-Right** order. For Binary Search Trees (BST), this traversal produces nodes in **sorted (ascending) order**, making it an essential tool for tree-based problems. The algorithm systematically explores the leftmost branch first, processes the current node, and then explores the right branch.

This traversal pattern is particularly valuable for:
- Retrieving sorted data from BSTs in O(n) time
- Converting between different tree representations
- Solving problems requiring sequential access to tree elements
- Validating BST properties and finding order statistics

---

## When to Use

Use Inorder DFS when you need to solve problems involving:

- **Binary Search Tree operations**: Retrieving sorted elements, validating BST structure, finding kth smallest/largest element
- **Expression tree evaluation**: Converting infix expressions to postfix or prefix
- **Tree reconstruction problems**: Building trees from inorder + preorder/postorder traversals
- **Range queries on BSTs**: Finding elements within a specific value range
- **Tree serialization**: When order matters for reconstruction

### Comparison: DFS Traversal Orders

| Traversal | Order | Best For | BST Output |
|-----------|-------|----------|------------|
| **Inorder** | Left → Root → Right | Sorted output, BST validation | ✅ Sorted ascending |
| **Preorder** | Root → Left → Right | Tree cloning, serialization | ❌ Not sorted |
| **Postorder** | Left → Right → Root | Tree deletion, bottom-up processing | ❌ Not sorted |
| **Level Order** | By levels (BFS) | Finding shortest path, level-based problems | ❌ Not sorted |

### When to Choose Inorder vs Other Traversals

- **Choose Inorder** when:
  - You need sorted output from a BST
  - Validating BST properties
  - Finding kth smallest/largest element
  - Converting expressions between notations

- **Choose Preorder** when:
  - Cloning or serializing trees
  - Building trees from traversal data
  - Root needs to be processed before children

- **Choose Postorder** when:
  - Deleting trees (children before parent)
  - Calculating subtree properties
  - Bottom-up dynamic programming on trees

---

## Algorithm Explanation

### Core Concept

The fundamental principle of Inorder DFS is the **Left-Root-Right** processing order:

1. **Left Subtree**: Recursively traverse the entire left subtree first
2. **Root**: Process the current node
3. **Right Subtree**: Recursively traverse the entire right subtree

This ordering ensures that for any node, all values in its left subtree (which are smaller in a BST) are processed before the node itself, and all values in its right subtree (larger in a BST) are processed after.

### Why It Works

**For Binary Search Trees:**
- BST property: Left child < Parent < Right child
- Inorder traversal visits: Left (smaller) → Root → Right (larger)
- Result: Ascending sorted order

**For General Binary Trees:**
- Systematic exploration ensures no node is missed
- Stack (implicit in recursion or explicit in iteration) tracks the path
- Each node is visited exactly once

### Visual Representation

For a sample BST:

```
        4
       / \
      2   6
     / \  / \
    1   3 5  7
```

**Traversal Path Visualization:**

```
Step 1: Start at root (4), go left to (2)
        ↓
        4
       /
      2

Step 2: From (2), go left to (1)
        ↓
        4
       /
      2
     /
    1

Step 3: (1) has no left child, process (1)
        Output: [1]

Step 4: Back to (2), process (2)
        Output: [1, 2]

Step 5: From (2), go right to (3), process (3)
        Output: [1, 2, 3]

Step 6: Back to (4), process (4)
        Output: [1, 2, 3, 4]

Step 7: From (4), go right to (6), then left to (5)
        Process (5), then (6), then (7)
        
Final Output: [1, 2, 3, 4, 5, 6, 7] ✓ Sorted!
```

**Traversal Order Diagram:**

```
        4         ← 4th (root after left subtree)
       / \
      2   6       ← 2nd and 6th
     / \  / \
    1   3 5  7    ← 1st, 3rd, 5th, 7th
    
Visit Order: 1 → 2 → 3 → 4 → 5 → 6 → 7
```

### Types of Implementations

| Implementation | Space Complexity | Best For |
|----------------|------------------|----------|
| **Recursive** | O(h) stack | Clean, readable code |
| **Iterative (Stack)** | O(h) explicit stack | Avoiding recursion limit |
| **Morris Traversal** | O(1) | Memory-constrained environments |

Where h = height of tree (h = log n for balanced, h = n for skewed)

---

## Algorithm Steps

### Recursive Approach

1. **Base Case**: If current node is null, return
2. **Traverse Left**: Recursively call inorder on left child
3. **Process Current**: Add current node's value to result
4. **Traverse Right**: Recursively call inorder on right child

### Iterative Approach (Using Stack)

1. **Initialize**: Create empty stack, set current = root
2. **Loop** while current is not null OR stack is not empty:
   3. **Go Left**: While current is not null:
      - Push current to stack
      - Move current to left child
   4. **Process**: Pop from stack, add to result
   5. **Go Right**: Set current to right child of popped node

### Morris Traversal (O(1) Space)

1. **Initialize**: Set current = root
2. **Loop** while current is not null:
   3. **If no left child**: Process current, go right
   4. **If left child exists**:
      - Find inorder predecessor (rightmost in left subtree)
      - If predecessor.right is null: Create thread, go left
      - If predecessor.right is current: Remove thread, process current, go right

---

## Implementation

````carousel
```python
from typing import List, Optional

class TreeNode:
    """Definition for a binary tree node."""
    def __init__(self, val: int = 0, left: Optional['TreeNode'] = None, right: Optional['TreeNode'] = None):
        self.val = val
        self.left = left
        self.right = right


def inorder_recursive(root: Optional[TreeNode]) -> List[int]:
    """
    DFS Inorder Traversal - Recursive Approach
    
    Time Complexity: O(n) - visit each node exactly once
    Space Complexity: O(h) - recursion stack, h = height of tree
    
    Args:
        root: Root of binary tree
        
    Returns:
        List of node values in inorder sequence
    """
    result = []
    
    def traverse(node: Optional[TreeNode]) -> None:
        if not node:
            return
        traverse(node.left)           # Visit left subtree
        result.append(node.val)       # Visit root
        traverse(node.right)          # Visit right subtree
    
    traverse(root)
    return result


def inorder_iterative(root: Optional[TreeNode]) -> List[int]:
    """
    DFS Inorder Traversal - Iterative using stack
    
    Time Complexity: O(n) - each node pushed and popped once
    Space Complexity: O(h) - explicit stack
    
    Args:
        root: Root of binary tree
        
    Returns:
        List of node values in inorder sequence
    """
    result = []
    stack = []
    current = root
    
    while current or stack:
        # Go to leftmost node
        while current:
            stack.append(current)
            current = current.left
        
        # Process current node
        current = stack.pop()
        result.append(current.val)
        
        # Move to right subtree
        current = current.right
    
    return result


def inorder_morris(root: Optional[TreeNode]) -> List[int]:
    """
    Morris Inorder Traversal - O(1) Space
    
    Uses threaded binary tree concept to traverse without stack.
    Creates temporary links (threads) from predecessor to current.
    
    Time Complexity: O(n) - each edge traversed at most twice
    Space Complexity: O(1) - only uses pointers
    
    Args:
        root: Root of binary tree
        
    Returns:
        List of node values in inorder sequence
    """
    result = []
    current = root
    
    while current:
        if not current.left:
            # No left child, process and go right
            result.append(current.val)
            current = current.right
        else:
            # Find inorder predecessor (rightmost in left subtree)
            predecessor = current.left
            while predecessor.right and predecessor.right != current:
                predecessor = predecessor.right
            
            if not predecessor.right:
                # Create thread and move left
                predecessor.right = current
                current = current.left
            else:
                # Thread exists, remove it and process current
                predecessor.right = None
                result.append(current.val)
                current = current.right
    
    return result


def inorder_parent_pointer(root: Optional[TreeNode]) -> List[int]:
    """
    Inorder traversal with parent pointers - O(1) space
    
    Assumes each node has a 'parent' reference.
    Used when tree structure allows upward traversal.
    
    Time Complexity: O(n)
    Space Complexity: O(1)
    """
    result = []
    if not root:
        return result
    
    # Find leftmost node
    current = root
    while current.left:
        current = current.left
    
    # Traverse using parent pointers
    while current:
        result.append(current.val)
        
        # Find next node in inorder
        if current.right:
            # Go to leftmost of right subtree
            current = current.right
            while current.left:
                current = current.left
        else:
            # Go up until we came from left child
            while current.parent and current.parent.right == current:
                current = current.parent
            current = current.parent if current else None
    
    return result


# Example usage and demonstration
if __name__ == "__main__":
    # Build BST:        4
    #                /   \
    #               2     6
    #              / \   / \
    #             1   3 5   7
    root = TreeNode(4)
    root.left = TreeNode(2, TreeNode(1), TreeNode(3))
    root.right = TreeNode(6, TreeNode(5), TreeNode(7))
    
    print("=" * 50)
    print("DFS Inorder Traversal Demonstration")
    print("=" * 50)
    print("\nTree Structure:")
    print("        4")
    print("       / \\")
    print("      2   6")
    print("     / \\  / \\")
    print("    1   3 5  7")
    print()
    
    # Test all three approaches
    recursive_result = inorder_recursive(root)
    iterative_result = inorder_iterative(root)
    morris_result = inorder_morris(root)
    
    print(f"Recursive:  {recursive_result}")
    print(f"Iterative:  {iterative_result}")
    print(f"Morris:     {morris_result}")
    print()
    print(f"All approaches match: {recursive_result == iterative_result == morris_result}")
    print(f"Result is sorted: {recursive_result == sorted(recursive_result)}")
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
    TreeNode *parent;  // Optional: for parent pointer approach
    
    TreeNode(int x) : val(x), left(nullptr), right(nullptr), parent(nullptr) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right), parent(nullptr) {}
};

/**
 * DFS Inorder Traversal - Recursive Approach
 * 
 * Time Complexity: O(n) - visit each node exactly once
 * Space Complexity: O(h) - recursion stack, h = height of tree
 */
class InorderRecursive {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> result;
        traverse(root, result);
        return result;
    }
    
private:
    void traverse(TreeNode* node, vector<int>& result) {
        if (!node) return;
        
        traverse(node->left, result);    // Visit left
        result.push_back(node->val);      // Visit root
        traverse(node->right, result);    // Visit right
    }
};

/**
 * DFS Inorder Traversal - Iterative using stack
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(h)
 */
class InorderIterative {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> result;
        stack<TreeNode*> stk;
        TreeNode* current = root;
        
        while (current || !stk.empty()) {
            // Go to leftmost node
            while (current) {
                stk.push(current);
                current = current->left;
            }
            
            // Process current node
            current = stk.top();
            stk.pop();
            result.push_back(current->val);
            
            // Move to right subtree
            current = current->right;
        }
        
        return result;
    }
};

/**
 * Morris Inorder Traversal - O(1) Space
 * 
 * Uses threaded binary tree concept.
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
class InorderMorris {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> result;
        TreeNode* current = root;
        
        while (current) {
            if (!current->left) {
                // No left child, process and go right
                result.push_back(current->val);
                current = current->right;
            } else {
                // Find inorder predecessor
                TreeNode* predecessor = current->left;
                while (predecessor->right && predecessor->right != current) {
                    predecessor = predecessor->right;
                }
                
                if (!predecessor->right) {
                    // Create thread
                    predecessor->right = current;
                    current = current->left;
                } else {
                    // Remove thread and process
                    predecessor->right = nullptr;
                    result.push_back(current->val);
                    current = current->right;
                }
            }
        }
        
        return result;
    }
};

// Helper function to build example tree
TreeNode* buildExampleTree() {
    TreeNode* root = new TreeNode(4);
    root->left = new TreeNode(2, new TreeNode(1), new TreeNode(3));
    root->right = new TreeNode(6, new TreeNode(5), new TreeNode(7));
    return root;
}

// Helper function to print vector
void printVector(const vector<int>& vec, const string& label) {
    cout << label << ": [";
    for (size_t i = 0; i < vec.size(); i++) {
        cout << vec[i];
        if (i < vec.size() - 1) cout << ", ";
    }
    cout << "]" << endl;
}

int main() {
    TreeNode* root = buildExampleTree();
    
    cout << "============================================" << endl;
    cout << "DFS Inorder Traversal Demonstration" << endl;
    cout << "============================================" << endl;
    cout << "\nTree Structure:" << endl;
    cout << "        4" << endl;
    cout << "       / \\" << endl;
    cout << "      2   6" << endl;
    cout << "     / \\  / \\" << endl;
    cout << "    1   3 5  7" << endl;
    cout << endl;
    
    InorderRecursive rec;
    InorderIterative iter;
    InorderMorris morris;
    
    vector<int> recResult = rec.inorderTraversal(root);
    vector<int> iterResult = iter.inorderTraversal(root);
    vector<int> morrisResult = morris.inorderTraversal(root);
    
    printVector(recResult, "Recursive ");
    printVector(iterResult, "Iterative ");
    printVector(morrisResult, "Morris    ");
    
    cout << "\nAll approaches produce identical results!" << endl;
    
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
    TreeNode parent;  // Optional: for parent pointer approach
    
    TreeNode(int x) {
        this.val = x;
        this.left = null;
        this.right = null;
        this.parent = null;
    }
    
    TreeNode(int x, TreeNode left, TreeNode right) {
        this.val = x;
        this.left = left;
        this.right = right;
        this.parent = null;
    }
}

/**
 * DFS Inorder Traversal - Multiple Implementation Approaches
 */
public class InorderTraversal {
    
    /**
     * Recursive Approach
     * Time: O(n), Space: O(h)
     */
    public List<Integer> inorderRecursive(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        traverse(root, result);
        return result;
    }
    
    private void traverse(TreeNode node, List<Integer> result) {
        if (node == null) return;
        
        traverse(node.left, result);     // Visit left
        result.add(node.val);             // Visit root
        traverse(node.right, result);    // Visit right
    }
    
    /**
     * Iterative Approach using Stack
     * Time: O(n), Space: O(h)
     */
    public List<Integer> inorderIterative(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        Stack<TreeNode> stack = new Stack<>();
        TreeNode current = root;
        
        while (current != null || !stack.isEmpty()) {
            // Go to leftmost node
            while (current != null) {
                stack.push(current);
                current = current.left;
            }
            
            // Process current node
            current = stack.pop();
            result.add(current.val);
            
            // Move to right subtree
            current = current.right;
        }
        
        return result;
    }
    
    /**
     * Morris Traversal - O(1) Space
     * Time: O(n), Space: O(1)
     */
    public List<Integer> inorderMorris(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        TreeNode current = root;
        
        while (current != null) {
            if (current.left == null) {
                // No left child, process and go right
                result.add(current.val);
                current = current.right;
            } else {
                // Find inorder predecessor
                TreeNode predecessor = current.left;
                while (predecessor.right != null && predecessor.right != current) {
                    predecessor = predecessor.right;
                }
                
                if (predecessor.right == null) {
                    // Create thread
                    predecessor.right = current;
                    current = current.left;
                } else {
                    // Remove thread and process
                    predecessor.right = null;
                    result.add(current.val);
                    current = current.right;
                }
            }
        }
        
        return result;
    }
    
    /**
     * Iterative with explicit state tracking
     * Alternative approach tracking visited status
     */
    public List<Integer> inorderIterativeWithState(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        if (root == null) return result;
        
        // Stack stores pairs of (node, isVisited)
        Stack<Pair> stack = new Stack<>();
        stack.push(new Pair(root, false));
        
        while (!stack.isEmpty()) {
            Pair pair = stack.pop();
            TreeNode node = pair.node;
            boolean isVisited = pair.isVisited;
            
            if (isVisited || node == null) {
                if (node != null) result.add(node.val);
            } else {
                // Push in reverse order of processing: right, root, left
                stack.push(new Pair(node.right, false));
                stack.push(new Pair(node, true));
                stack.push(new Pair(node.left, false));
            }
        }
        
        return result;
    }
    
    // Helper class for state tracking
    private static class Pair {
        TreeNode node;
        boolean isVisited;
        
        Pair(TreeNode node, boolean isVisited) {
            this.node = node;
            this.isVisited = isVisited;
        }
    }
    
    // Demo main method
    public static void main(String[] args) {
        // Build tree:    4
        //              /   \
        //             2     6
        //            / \   / \
        //           1   3 5   7
        TreeNode root = new TreeNode(4);
        root.left = new TreeNode(2, new TreeNode(1), new TreeNode(3));
        root.right = new TreeNode(6, new TreeNode(5), new TreeNode(7));
        
        System.out.println("============================================");
        System.out.println("DFS Inorder Traversal Demonstration");
        System.out.println("============================================");
        
        InorderTraversal solver = new InorderTraversal();
        
        System.out.println("\nRecursive:  " + solver.inorderRecursive(root));
        System.out.println("Iterative:  " + solver.inorderIterative(root));
        System.out.println("Morris:     " + solver.inorderMorris(root));
        System.out.println("With State: " + solver.inorderIterativeWithState(root));
    }
}
```

<!-- slide -->
```javascript
/**
 * Definition for a binary tree node.
 */
class TreeNode {
    /**
     * @param {number} val - Node value
     * @param {TreeNode} left - Left child
     * @param {TreeNode} right - Right child
     */
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

/**
 * DFS Inorder Traversal - Recursive Approach
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(h) - call stack
 * 
 * @param {TreeNode} root - Root of binary tree
 * @returns {number[]} Array of values in inorder
 */
function inorderRecursive(root) {
    const result = [];
    
    function traverse(node) {
        if (!node) return;
        
        traverse(node.left);           // Visit left
        result.push(node.val);          // Visit root
        traverse(node.right);          // Visit right
    }
    
    traverse(root);
    return result;
}

/**
 * DFS Inorder Traversal - Iterative using stack
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(h)
 * 
 * @param {TreeNode} root - Root of binary tree
 * @returns {number[]} Array of values in inorder
 */
function inorderIterative(root) {
    const result = [];
    const stack = [];
    let current = root;
    
    while (current || stack.length > 0) {
        // Go to leftmost node
        while (current) {
            stack.push(current);
            current = current.left;
        }
        
        // Process current node
        current = stack.pop();
        result.push(current.val);
        
        // Move to right subtree
        current = current.right;
    }
    
    return result;
}

/**
 * Morris Inorder Traversal - O(1) Space
 * 
 * Uses threaded binary tree concept.
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 * 
 * @param {TreeNode} root - Root of binary tree
 * @returns {number[]} Array of values in inorder
 */
function inorderMorris(root) {
    const result = [];
    let current = root;
    
    while (current) {
        if (!current.left) {
            // No left child, process and go right
            result.push(current.val);
            current = current.right;
        } else {
            // Find inorder predecessor
            let predecessor = current.left;
            while (predecessor.right && predecessor.right !== current) {
                predecessor = predecessor.right;
            }
            
            if (!predecessor.right) {
                // Create thread
                predecessor.right = current;
                current = current.left;
            } else {
                // Remove thread and process
                predecessor.right = null;
                result.push(current.val);
                current = current.right;
            }
        }
    }
    
    return result;
}

/**
 * Inorder Traversal using Generator
 * Memory-efficient for large trees - yields values one at a time
 * 
 * @param {TreeNode} root - Root of binary tree
 * @yields {number} Next value in inorder sequence
 */
function* inorderGenerator(root) {
    function* traverse(node) {
        if (!node) return;
        
        yield* traverse(node.left);
        yield node.val;
        yield* traverse(node.right);
    }
    
    yield* traverse(root);
}

/**
 * Alternative: Inorder with explicit state tracking
 * Uses color/state marking approach
 * 
 * @param {TreeNode} root - Root of binary tree
 * @returns {number[]} Array of values in inorder
 */
function inorderWithState(root) {
    const result = [];
    if (!root) return result;
    
    // Stack contains [node, visited] pairs
    const stack = [[root, false]];
    
    while (stack.length > 0) {
        const [node, visited] = stack.pop();
        
        if (visited) {
            result.push(node.val);
        } else {
            // Push in reverse order: right, node (marked visited), left
            if (node.right) stack.push([node.right, false]);
            stack.push([node, true]);
            if (node.left) stack.push([node.left, false]);
        }
    }
    
    return result;
}


// ============================================
// Demonstration
// ============================================

// Build tree:        4
//                 /   \
//                2     6
//               / \   / \
//              1   3 5   7
const root = new TreeNode(4);
root.left = new TreeNode(2, new TreeNode(1), new TreeNode(3));
root.right = new TreeNode(6, new TreeNode(5), new TreeNode(7));

console.log("=".repeat(50));
console.log("DFS Inorder Traversal Demonstration");
console.log("=".repeat(50));
console.log("\nTree Structure:");
console.log("        4");
console.log("       / \\");
console.log("      2   6");
console.log("     / \\  / \\");
console.log("    1   3 5  7");
console.log();

const recursiveResult = inorderRecursive(root);
const iterativeResult = inorderIterative(root);
const morrisResult = inorderMorris(root);
const stateResult = inorderWithState(root);

console.log(`Recursive: [${recursiveResult.join(', ')}]`);
console.log(`Iterative: [${iterativeResult.join(', ')}]`);
console.log(`Morris:    [${morrisResult.join(', ')}]`);
console.log(`WithState: [${stateResult.join(', ')}]`);
console.log();

// Demonstrate generator approach
console.log("Using Generator:");
const generator = inorderGenerator(root);
const genResult = [...generator];
console.log(`Generator: [${genResult.join(', ')}]`);

// Verify all results match
const allMatch = [recursiveResult, iterativeResult, morrisResult, stateResult, genResult]
    .every(arr => JSON.stringify(arr) === JSON.stringify(recursiveResult));
console.log(`\nAll approaches match: ${allMatch}`);
console.log(`Result is sorted: ${JSON.stringify(recursiveResult) === JSON.stringify([...recursiveResult].sort((a,b) => a-b))}`);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        TreeNode,
        inorderRecursive,
        inorderIterative,
        inorderMorris,
        inorderGenerator,
        inorderWithState
    };
}
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Inorder Traversal** | **O(n)** | Visit each of n nodes exactly once |
| **Find Predecessor (Morris)** | O(1) amortized | Each edge traversed at most twice |

### Detailed Breakdown

**For All Approaches (Recursive, Iterative, Morris):**
- **Node visits**: Each node is visited exactly once → O(n)
- **Edge traversals**: Each edge is traversed at most twice (once down, once up) → O(n)
- **Total**: O(n) time complexity

**Morris Traversal Specifically:**
- Each edge is traversed at most twice
- Creating temporary links: O(1) per operation
- Removing temporary links: O(1) per operation
- Amortized time remains O(n)

### Best/Average/Worst Cases

| Case | Time | Tree Structure |
|------|------|----------------|
| Best | O(n) | Any tree (always linear in nodes) |
| Average | O(n) | Balanced or random tree |
| Worst | O(n) | Skewed tree (still visit all nodes) |

---

## Space Complexity Analysis

| Implementation | Space Complexity | Description |
|----------------|------------------|-------------|
| **Recursive** | **O(h)** | Call stack, h = height of tree |
| **Iterative (Stack)** | **O(h)** | Explicit stack |
| **Morris** | **O(1)** | Only uses pointers, modifies tree temporarily |
| **With Parent Pointers** | **O(1)** | Can traverse up without stack |

Where h = height of tree:
- Balanced BST: h = O(log n)
- Skewed tree: h = O(n)

### Detailed Breakdown

**Recursive Approach:**
- Maximum recursion depth equals tree height
- Balanced tree: O(log n) stack space
- Skewed tree: O(n) stack space (risk of stack overflow)

**Iterative Approach:**
- Stack holds at most h nodes at any time
- Same space complexity as recursive but explicit control
- No risk of stack overflow from recursion

**Morris Traversal:**
- O(1) extra space (just a few pointers)
- Temporarily modifies tree structure (creates threads)
- Restores original tree structure after traversal

### Space Comparison Summary

```
Tree Type        | Recursive | Iterative | Morris
-----------------|-----------|-----------|-------
Balanced (h=log n) | O(log n)  | O(log n)  | O(1)
Skewed (h=n)       | O(n)      | O(n)      | O(1)
```

---

## Common Variations

### 1. Morris Traversal (O(1) Space)

The Morris Traversal is a clever algorithm that achieves O(1) space complexity by temporarily modifying the tree to create "threads" from predecessors back to their successors. The tree structure is restored before completion.

**Key Steps:**
1. For each node with a left child, find its inorder predecessor
2. If predecessor.right is null, create a thread to current and go left
3. If predecessor.right is current, remove the thread and process current

**Use Cases:**
- Memory-constrained environments
- Very large trees where O(h) stack space is unacceptable
- Interview problems testing advanced tree knowledge

### 2. Threaded Binary Tree

A threaded binary tree is a permanent modification where null pointers are replaced with threads to inorder predecessors and successors.

**Types:**
- **Single-threaded**: Right null pointers point to inorder successor
- **Double-threaded**: Both left and right null pointers have threads

**Benefits:**
- O(1) space for traversal (no stack needed)
- Faster inorder traversal (no recursion/stack overhead)
- Easy to find predecessor and successor

**Drawbacks:**
- Modifies tree structure permanently
- Insertion/deletion becomes more complex

### 3. Inorder with Parent Pointers

If each node has a reference to its parent, we can traverse without a stack.

**Algorithm:**
1. Find the leftmost node
2. Process the node
3. If there's a right child, go to its leftmost
4. Otherwise, go up until we came from a left child
5. Repeat until reaching root from right child

**Time:** O(n), **Space:** O(1)

### 4. Iterative with State Tracking

Instead of the standard iterative approach, track whether a node has been visited.

```python
def inorder_state_tracking(root):
    result = []
    stack = [(root, False)]  # (node, is_visited)
    
    while stack:
        node, visited = stack.pop()
        if not node:
            continue
        if visited:
            result.append(node.val)
        else:
            # Push in reverse order: right, root, left
            stack.append((node.right, False))
            stack.append((node, True))
            stack.append((node.left, False))
    
    return result
```

This approach is more intuitive and easily adaptable to other traversals.

---

## Practice Problems

### Problem 1: Binary Tree Inorder Traversal

**Problem:** [LeetCode 94 - Binary Tree Inorder Traversal](https://leetcode.com/problems/binary-tree-inorder-traversal/)

**Description:** Given the root of a binary tree, return the inorder traversal of its nodes' values.

**How to Apply:**
- Direct application of inorder traversal
- Practice both recursive and iterative implementations
- Try Morris traversal for O(1) space solution

**Key Insights:**
- Classic template for all inorder problems
- Test edge cases: empty tree, single node, skewed tree
- Compare space complexity of different approaches

---

### Problem 2: Validate Binary Search Tree

**Problem:** [LeetCode 98 - Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/)

**Description:** Given the root of a binary tree, determine if it is a valid binary search tree (BST).

**How to Apply:**
- Use inorder traversal to get sorted sequence
- Check if result is strictly increasing
- More efficient: track previous value during traversal, no need to store all values

**Key Insights:**
- Inorder of valid BST must be strictly increasing
- Use long min/max to handle edge cases with INT_MIN/INT_MAX
- Morris traversal can validate with O(1) space

---

### Problem 3: Kth Smallest Element in a BST

**Problem:** [LeetCode 230 - Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/)

**Description:** Given the root of a binary search tree and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.

**How to Apply:**
- Inorder traversal naturally gives sorted order
- Stop traversal after visiting k nodes (optimization)
- Use iterative approach for early termination

**Key Insights:**
- No need to traverse entire tree
- Counter tracks how many nodes processed
- Return immediately when counter reaches k

---

### Problem 4: Recover Binary Search Tree

**Problem:** [LeetCode 99 - Recover Binary Search Tree](https://leetcode.com/problems/recover-binary-search-tree/)

**Description:** You are given the root of a binary search tree (BST), where the values of exactly two nodes were swapped by mistake. Recover the tree without changing its structure.

**How to Apply:**
- Inorder traversal of valid BST is sorted
- Two swapped elements will create one or two "drops" in the sequence
- Track first and second violations during traversal
- Swap the values of the two incorrect nodes

**Key Insights:**
- First violation: first element is larger than next
- Second violation: second element is smaller than previous
- In-order predecessor tracking is key

---

### Problem 5: Binary Search Tree Iterator

**Problem:** [LeetCode 173 - Binary Search Tree Iterator](https://leetcode.com/problems/binary-search-tree-iterator/)

**Description:** Implement the BSTIterator class that represents an iterator over the in-order traversal of a binary search tree.

**How to Apply:**
- Use iterative inorder approach with controlled stack
- next(): Pop from stack, push right subtree's leftmost path
- hasNext(): Check if stack is non-empty
- Average O(1) time for both operations, O(h) space

**Key Insights:**
- Controlled iteration using explicit stack
- Lazy loading of right subtree
- Amortized O(1) time complexity

---

## Video Tutorial Links

### Fundamentals

- [Binary Tree Inorder Traversal (NeetCode)](https://www.youtube.com/watch?v=5T9T3C3D3vU) - Clear explanation of recursive and iterative approaches
- [Morris Traversal Algorithm (Take U Forward)](https://www.youtube.com/watch?v=80Zug6D1_r4) - O(1) space traversal explained
- [Tree Traversals Explained (Abdul Bari)](https://www.youtube.com/watch?v=gm8DUJJhmY4) - Visual animation of all traversal types

### BST-Specific Applications

- [Validate BST and Applications (NeetCode)](https://www.youtube.com/watch?v=s6ATEkipzow) - BST validation techniques
- [Kth Smallest Element in BST (Kevin Naughton Jr.)](https://www.youtube.com/watch?v=5LUXSvjmGCw) - Order statistics with inorder
- [Recover BST Explained (Back To Back SWE)](https://www.youtube.com/watch?v=LR3K5XAWV5k) - Advanced inorder application

### Advanced Topics

- [Threaded Binary Trees (Jenny's Lectures)](https://www.youtube.com/watch?v=iRB_e7Y7Ss4) - Permanent threading for traversal
- [Tree Iterator Pattern (Pepcoding)](https://www.youtube.com/watch?v=8rwHi9aNMfQ) - Controlled iteration design
- [Binary Tree Traversal Iterative (Nick White)](https://www.youtube.com/watch?v=8rwHi9aNMfQ) - All traversal types iteratively

---

## Follow-up Questions

### Q1: Why does inorder traversal give sorted order for BSTs?

**Answer:** In a valid BST:
- All left subtree values < root value
- All right subtree values > root value
- Inorder visits: Left → Root → Right
- Therefore: Smaller values → Root → Larger values

This recursive property ensures the entire traversal is in ascending order.

### Q2: What are the advantages of Morris traversal over recursive/iterative?

**Answer:**
- **Space**: O(1) vs O(h) - critical for memory-constrained systems
- **No stack overflow**: Safe for extremely deep trees
- **No auxiliary data structures**: Uses tree's own null pointers

**Trade-offs:**
- Temporarily modifies tree (restores it)
- Slightly more complex to understand/implement
- May be slower due to more pointer operations

### Q3: How do you handle inorder traversal when the tree might be modified during traversal?

**Answer:**
1. **Snapshot approach**: Store traversal results first, then modify
2. **Copy-on-write**: Work on a copy of the tree
3. **Locking mechanism**: Prevent modifications during traversal
4. **Fail-fast iterator**: Detect concurrent modification and throw exception

Never modify tree structure during Morris traversal (threads will break).

### Q4: Can inorder traversal be parallelized?

**Answer:** Direct parallelization is challenging because:
- Traversal order is inherently sequential
- Dependencies between left subtree, root, and right subtree

**Possible approaches:**
1. **Subtree-level parallelism**: Process left and right subtrees in parallel, then merge
2. **Pipeline parallelism**: Producer-consumer pattern with generator
3. **Map-reduce**: For very large trees distributed across systems

### Q5: How would you implement inorder traversal for n-ary trees?

**Answer:** Inorder is specifically defined for binary trees. For n-ary trees:

1. **First-child/next-sibling representation**: Convert to binary tree, then inorder
2. **Custom definition**: Visit first child, root, then remaining children
3. **Use different traversal**: Preorder or postorder make more sense for n-ary

Example custom inorder for n-ary:
```
def inorder_nary(node):
    if not node.children:
        process(node)
        return
    inorder_nary(node.children[0])  # First child
    process(node)                    # Root
    for child in node.children[1:]:  # Remaining children
        inorder_nary(child)
```

---

## Summary

DFS Inorder Traversal is a fundamental tree algorithm with powerful applications, especially for Binary Search Trees. Key takeaways:

### Core Concepts
- **Left-Root-Right** processing order
- Produces **sorted output** for BSTs
- Three main implementations: Recursive, Iterative, Morris

### When to Use
- ✅ Retrieving sorted data from BSTs
- ✅ Validating BST properties
- ✅ Finding order statistics (kth smallest/largest)
- ✅ Expression tree evaluation
- ✅ Tree reconstruction problems

### Complexity Summary

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Recursive | O(n) | O(h) | Clean, readable code |
| Iterative | O(n) | O(h) | Avoiding recursion limits |
| Morris | O(n) | O(1) | Memory-constrained environments |

### Implementation Tips
1. **Recursive**: Easiest to write, watch stack overflow on skewed trees
2. **Iterative**: Use while loop with explicit stack, go left as far as possible
3. **Morris**: Understand predecessor threading concept thoroughly
4. **Early termination**: Iterative approach allows stopping at any point

### Common Pitfalls
- Not handling null/empty trees
- Confusing inorder with preorder/postorder
- Stack overflow in recursive approach with skewed trees
- Not restoring tree structure after Morris traversal

Mastering inorder traversal is essential for tree-based problems in technical interviews and competitive programming. The ability to implement all three variants (recursive, iterative, Morris) demonstrates deep understanding of tree algorithms.

---

## Related Algorithms

- [DFS Preorder Traversal](./dfs-preorder.md) - Root-Left-Right order
- [DFS Postorder Traversal](./dfs-postorder.md) - Left-Right-Root order
- [BFS Level Order Traversal](./bfs-level-order.md) - Level-by-level traversal
- [BST Insert](./bst-insert.md) - Building BSTs for inorder traversal
- [Binary Search Tree Validation](./validate-bst.md) - Using inorder for validation
- [Serialize and Deserialize Binary Tree](./serialize-tree.md) - Tree persistence
