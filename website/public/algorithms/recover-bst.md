# Recover BST

## Category
Trees & BSTs

## Description

The **Recover BST** algorithm fixes a Binary Search Tree where exactly **two nodes have been swapped**, violating the BST property. This is a classic tree traversal problem that leverages the fundamental property of BSTs: an **in-order traversal yields values in sorted (ascending) order**.

When two nodes in a BST are swapped, the in-order sequence will have **at most two violations** where a value is smaller than its predecessor. By identifying these violations during traversal, we can locate and swap the two misplaced nodes to restore the BST property.

---

## When to Use

Use the Recover BST algorithm when you need to solve problems involving:

- **BST Validation and Repair**: When a BST has been corrupted by swapping exactly two nodes
- **Tree Traversal Patterns**: Problems requiring in-order traversal analysis
- **Node Identification**: Finding nodes that violate BST properties
- **Space-Constrained Environments**: When O(1) extra space is required (using Morris Traversal)

### Comparison: Recover BST vs Tree Reconstruction

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|-----------------|------------------|----------|
| **In-order + Sort** | O(n log n) | O(n) | When you can extract all values |
| **Iterative In-order** | O(n) | O(h) | Standard approach, balanced space/time |
| **Morris Traversal** | O(n) | O(1) | When space is critical |
| **Recursive In-order** | O(n) | O(h) | Simple implementation, risk of stack overflow |

**Legend**: n = number of nodes, h = height of tree

### When to Choose Each Approach

- **Choose Iterative In-order** when:
  - You need a clean, efficient implementation
  - Tree height is reasonable (balanced BST)
  - Stack space of O(h) is acceptable

- **Choose Morris Traversal** when:
  - Space optimization is critical
  - You're working with extremely deep trees
  - You cannot use recursion or extra stack space

- **Avoid Recursive In-order** when:
  - Tree could be skewed (h = n, causing stack overflow)
  - Working with large trees in production code

---

## Algorithm Explanation

### Core Concept

The fundamental insight behind recovering a BST is that **in-order traversal of a valid BST produces a sorted sequence**. When two nodes are swapped, this sorted property is violated at specific points:

```
Valid BST In-order:     [1, 2, 3, 4, 5, 6, 7, 8]
Swapped Nodes (3, 7):   [1, 2, 7, 4, 5, 6, 3, 8]
                              ↑     ↑
                         violation  violation
```

### How It Works

#### Detecting Violations:
During in-order traversal, we compare each node with its predecessor:
- If `current.val < prev.val`, we've found a violation
- The first violation gives us the **first swapped node** (the predecessor)
- The second violation gives us the **second swapped node** (the current node)

#### Two Cases of Swapped Nodes:

**Case 1: Non-adjacent nodes in in-order sequence**
```
Original:  [1, 2, 3, 4, 5, 6, 7, 8]
Swapped:   [1, 2, 7, 4, 5, 6, 3, 8]  (3 and 7 swapped)
                ↑        ↑
           first=7    second=3
```

**Case 2: Adjacent nodes in in-order sequence**
```
Original:  [1, 2, 3, 4, 5, 6, 7, 8]
Swapped:   [1, 2, 4, 3, 5, 6, 7, 8]  (3 and 4 swapped)
                ↑  ↑
           first=4  second=3
```

### Visual Representation

Consider this BST with nodes 3 and 7 swapped:

```
Before Recovery:
        5
       / \
      3   8
     / \   \
    1   7   9
       /
      6

In-order traversal: [1, 3, 7, 6, 5, 8, 9]
                         ↑  ↑
                    violation 1 (7 > 6)
                              ↑     ↑
                         violation 2 (6 > 5)

After Recovery (swap 3 and 7):
        5
       / \
      7   8
     / \   \
    1   3   9
       /
      6

In-order traversal: [1, 3, 5, 6, 7, 8, 9] ✓ Sorted!
```

### Why At Most Two Violations?

When two elements in a sorted array are swapped:
- If they are **not adjacent**: Creates exactly 2 violations
- If they are **adjacent**: Creates exactly 1 violation

This property allows us to identify both nodes with a single traversal.

---

## Algorithm Steps

### Iterative In-order Approach (O(h) Space)

1. **Initialize**: Create an empty stack, set `current = root`, `prev = None`, `first = None`, `second = None`

2. **Traverse Left**: Push all left children onto the stack until reaching the leftmost node

3. **Process Node**:
   - Pop from stack to get the current node
   - If `prev` exists and `current.val < prev.val`:
     - **First violation**: Set `first = prev` (if not already set)
     - Always set `second = current` (captures both adjacent and non-adjacent cases)
   - Update `prev = current`

4. **Traverse Right**: Move to the right child and repeat steps 2-3

5. **Swap Values**: Exchange values of `first` and `second` nodes

### Morris Traversal Approach (O(1) Space)

1. **Initialize**: Set `current = root`, `prev = None`, `first = None`, `second = None`

2. **While current is not null**:
   - **If no left child**: Process current node and move right
   - **If left child exists**: Find the in-order predecessor (rightmost node in left subtree)
     - If predecessor.right is null: Create temporary link, move left
     - If predecessor.right is current: Remove link, process current, move right

3. **Process Node**: Same violation detection as iterative approach

4. **Swap Values**: Exchange values of `first` and `second` nodes

---

## Implementation

### Complete Solution with All Approaches

````carousel
```python
from typing import Optional, List

class TreeNode:
    """Binary tree node with value and left/right children."""
    def __init__(self, val: int = 0, left: 'TreeNode' = None, right: 'TreeNode' = None):
        self.val = val
        self.left = left
        self.right = right


def recover_tree_iterative(root: Optional[TreeNode]) -> None:
    """
    Recover BST using iterative in-order traversal.
    
    Time Complexity: O(n) - visit each node once
    Space Complexity: O(h) - stack space, h = tree height
    
    Args:
        root: Root of BST with two swapped nodes
    """
    if not root:
        return
    
    stack: List[TreeNode] = []
    current = root
    first: Optional[TreeNode] = None
    second: Optional[TreeNode] = None
    prev: Optional[TreeNode] = None
    
    while stack or current:
        # Go to leftmost node
        while current:
            stack.append(current)
            current = current.left
        
        # Process current node
        current = stack.pop()
        
        # Check for violation: current should be > prev in valid BST
        if prev and current.val < prev.val:
            # First violation found
            if first is None:
                first = prev  # First swapped node
            # Second swapped node (always update for adjacent case)
            second = current
        
        prev = current
        current = current.right
    
    # Swap values of the two misplaced nodes
    if first and second:
        first.val, second.val = second.val, first.val


def recover_tree_morris(root: Optional[TreeNode]) -> None:
    """
    Recover BST using Morris Traversal - O(1) space solution.
    
    Time Complexity: O(n) - each edge traversed at most twice
    Space Complexity: O(1) - only pointers used
    
    Args:
        root: Root of BST with two swapped nodes
    """
    if not root:
        return
    
    current = root
    first: Optional[TreeNode] = None
    second: Optional[TreeNode] = None
    prev: Optional[TreeNode] = None
    
    while current:
        if not current.left:
            # Visit node - no left subtree
            if prev and current.val < prev.val:
                if first is None:
                    first = prev
                second = current
            prev = current
            current = current.right
        else:
            # Find inorder predecessor (rightmost in left subtree)
            pred = current.left
            while pred.right and pred.right != current:
                pred = pred.right
            
            if not pred.right:
                # Create temporary thread link
                pred.right = current
                current = current.left
            else:
                # Thread exists, remove it and visit node
                pred.right = None
                if prev and current.val < prev.val:
                    if first is None:
                        first = prev
                    second = current
                prev = current
                current = current.right
    
    # Swap values
    if first and second:
        first.val, second.val = second.val, first.val


def recover_tree_recursive(root: Optional[TreeNode]) -> None:
    """
    Recover BST using recursive in-order traversal.
    
    Time Complexity: O(n)
    Space Complexity: O(h) - recursion stack
    
    Note: Risk of stack overflow for skewed trees.
    """
    first: Optional[TreeNode] = None
    second: Optional[TreeNode] = None
    prev: Optional[TreeNode] = None
    
    def inorder(node: Optional[TreeNode]) -> None:
        nonlocal first, second, prev
        if not node:
            return
        
        # Traverse left
        inorder(node.left)
        
        # Process current
        if prev and node.val < prev.val:
            if first is None:
                first = prev
            second = node
        
        prev = node
        
        # Traverse right
        inorder(node.right)
    
    inorder(root)
    
    if first and second:
        first.val, second.val = second.val, first.val


# Helper functions for testing
def build_tree(values: List[Optional[int]]) -> Optional[TreeNode]:
    """Build tree from level-order list (None represents missing node)."""
    if not values:
        return None
    
    nodes = [None if v is None else TreeNode(v) for v in values]
    kids = nodes[::-1]
    root = kids.pop()
    for node in nodes:
        if node:
            if kids: 
                node.left = kids.pop()
            if kids: 
                node.right = kids.pop()
    return root


def inorder_traversal(root: Optional[TreeNode]) -> List[int]:
    """Get in-order traversal values."""
    result = []
    stack = []
    current = root
    while stack or current:
        while current:
            stack.append(current)
            current = current.left
        current = stack.pop()
        result.append(current.val)
        current = current.right
    return result


def print_tree(root: Optional[TreeNode], level: int = 0) -> None:
    """Pretty print tree structure."""
    if root:
        print_tree(root.right, level + 1)
        print(' ' * 4 * level + '->', root.val)
        print_tree(root.left, level + 1)


# Example usage
if __name__ == "__main__":
    # Test Case 1: Non-adjacent swap (3 and 7)
    #       5
    #      / \
    #     3   8
    #    / \   \
    #   1   7   9
    print("=" * 60)
    print("Test Case 1: Non-adjacent swap (3 and 7)")
    print("=" * 60)
    root1 = build_tree([5, 3, 8, 1, 7, None, 9])
    print("Before recovery:", inorder_traversal(root1))
    recover_tree_iterative(root1)
    print("After recovery: ", inorder_traversal(root1))
    print("Is sorted:", inorder_traversal(root1) == sorted(inorder_traversal(root1)))
    
    # Test Case 2: Adjacent swap (3 and 5)
    #       5
    #      / \
    #     3   8
    #    /     \
    #   1       9
    print("\n" + "=" * 60)
    print("Test Case 2: Adjacent swap (3 and 5)")
    print("=" * 60)
    root2 = build_tree([3, 1, 8, None, None, 5, 9])
    print("Before recovery:", inorder_traversal(root2))
    recover_tree_morris(root2)
    print("After recovery: ", inorder_traversal(root2))
    print("Is sorted:", inorder_traversal(root2) == sorted(inorder_traversal(root2)))
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <stack>
using namespace std;

/**
 * Binary Tree Node
 */
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
    TreeNode(int x, TreeNode* left, TreeNode* right) : val(x), left(left), right(right) {}
};

/**
 * Recover BST using iterative in-order traversal.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(h) where h is tree height
 */
class SolutionIterative {
private:
    TreeNode* first;
    TreeNode* second;
    TreeNode* prev;
    
public:
    void recoverTree(TreeNode* root) {
        first = nullptr;
        second = nullptr;
        prev = nullptr;
        
        TreeNode* current = root;
        stack<TreeNode*> st;
        
        while (current || !st.empty()) {
            // Go to leftmost
            while (current) {
                st.push(current);
                current = current->left;
            }
            
            // Process node
            current = st.top();
            st.pop();
            
            // Check for violation
            if (prev && current->val < prev->val) {
                if (!first) {
                    first = prev;
                }
                second = current;
            }
            
            prev = current;
            current = current->right;
        }
        
        // Swap values
        if (first && second) {
            swap(first->val, second->val);
        }
    }
};

/**
 * Recover BST using Morris Traversal - O(1) space.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
class SolutionMorris {
public:
    void recoverTree(TreeNode* root) {
        TreeNode* first = nullptr;
        TreeNode* second = nullptr;
        TreeNode* prev = nullptr;
        TreeNode* current = root;
        
        while (current) {
            if (!current->left) {
                // Visit node
                if (prev && current->val < prev->val) {
                    if (!first) {
                        first = prev;
                    }
                    second = current;
                }
                prev = current;
                current = current->right;
            } else {
                // Find inorder predecessor
                TreeNode* pred = current->left;
                while (pred->right && pred->right != current) {
                    pred = pred->right;
                }
                
                if (!pred->right) {
                    // Create thread
                    pred->right = current;
                    current = current->left;
                } else {
                    // Remove thread and visit
                    pred->right = nullptr;
                    if (prev && current->val < prev->val) {
                        if (!first) {
                            first = prev;
                        }
                        second = current;
                    }
                    prev = current;
                    current = current->right;
                }
            }
        }
        
        // Swap values
        if (first && second) {
            swap(first->val, second->val);
        }
    }
};

/**
 * Recover BST using recursive in-order traversal.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(h) - recursion stack
 */
class SolutionRecursive {
private:
    TreeNode* first;
    TreeNode* second;
    TreeNode* prev;
    
    void inorder(TreeNode* node) {
        if (!node) return;
        
        // Left
        inorder(node->left);
        
        // Current
        if (prev && node->val < prev->val) {
            if (!first) {
                first = prev;
            }
            second = node;
        }
        prev = node;
        
        // Right
        inorder(node->right);
    }
    
public:
    void recoverTree(TreeNode* root) {
        first = nullptr;
        second = nullptr;
        prev = nullptr;
        
        inorder(root);
        
        if (first && second) {
            swap(first->val, second->val);
        }
    }
};

// Helper functions
TreeNode* buildTree(const vector<int*>& values, int index = 0) {
    if (index >= values.size() || values[index] == nullptr) {
        return nullptr;
    }
    TreeNode* node = new TreeNode(*values[index]);
    node->left = buildTree(values, 2 * index + 1);
    node->right = buildTree(values, 2 * index + 2);
    return node;
}

vector<int> inorderTraversal(TreeNode* root) {
    vector<int> result;
    stack<TreeNode*> st;
    TreeNode* current = root;
    
    while (current || !st.empty()) {
        while (current) {
            st.push(current);
            current = current->left;
        }
        current = st.top();
        st.pop();
        result.push_back(current->val);
        current = current->right;
    }
    
    return result;
}

int main() {
    // Test Case: Swap 3 and 7
    // Values: [5, 3, 8, 1, 7, nullptr, 9]
    vector<int*> values = {
        new int(5), new int(3), new int(8),
        new int(1), new int(7), nullptr, new int(9)
    };
    
    TreeNode* root = buildTree(values);
    
    cout << "Before recovery: ";
    vector<int> before = inorderTraversal(root);
    for (int x : before) cout << x << " ";
    cout << endl;
    
    SolutionIterative sol;
    sol.recoverTree(root);
    
    cout << "After recovery:  ";
    vector<int> after = inorderTraversal(root);
    for (int x : after) cout << x << " ";
    cout << endl;
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;

/**
 * Binary Tree Node
 */
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    
    TreeNode(int x) {
        val = x;
    }
    
    TreeNode(int x, TreeNode left, TreeNode right) {
        val = x;
        this.left = left;
        this.right = right;
    }
}

/**
 * Recover BST using iterative in-order traversal.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(h) where h is tree height
 */
class SolutionIterative {
    private TreeNode first;
    private TreeNode second;
    private TreeNode prev;
    
    public void recoverTree(TreeNode root) {
        first = null;
        second = null;
        prev = null;
        
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode current = root;
        
        while (current != null || !stack.isEmpty()) {
            // Go to leftmost
            while (current != null) {
                stack.push(current);
                current = current.left;
            }
            
            // Process node
            current = stack.pop();
            
            // Check for violation
            if (prev != null && current.val < prev.val) {
                if (first == null) {
                    first = prev;
                }
                second = current;
            }
            
            prev = current;
            current = current.right;
        }
        
        // Swap values
        if (first != null && second != null) {
            int temp = first.val;
            first.val = second.val;
            second.val = temp;
        }
    }
}

/**
 * Recover BST using Morris Traversal - O(1) space.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 */
class SolutionMorris {
    public void recoverTree(TreeNode root) {
        TreeNode first = null;
        TreeNode second = null;
        TreeNode prev = null;
        TreeNode current = root;
        
        while (current != null) {
            if (current.left == null) {
                // Visit node
                if (prev != null && current.val < prev.val) {
                    if (first == null) {
                        first = prev;
                    }
                    second = current;
                }
                prev = current;
                current = current.right;
            } else {
                // Find inorder predecessor
                TreeNode pred = current.left;
                while (pred.right != null && pred.right != current) {
                    pred = pred.right;
                }
                
                if (pred.right == null) {
                    // Create thread
                    pred.right = current;
                    current = current.left;
                } else {
                    // Remove thread and visit
                    pred.right = null;
                    if (prev != null && current.val < prev.val) {
                        if (first == null) {
                            first = prev;
                        }
                        second = current;
                    }
                    prev = current;
                    current = current.right;
                }
            }
        }
        
        // Swap values
        if (first != null && second != null) {
            int temp = first.val;
            first.val = second.val;
            second.val = temp;
        }
    }
}

/**
 * Recover BST using recursive in-order traversal.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(h) - recursion stack
 */
class SolutionRecursive {
    private TreeNode first;
    private TreeNode second;
    private TreeNode prev;
    
    public void recoverTree(TreeNode root) {
        first = null;
        second = null;
        prev = null;
        
        inorder(root);
        
        if (first != null && second != null) {
            int temp = first.val;
            first.val = second.val;
            second.val = temp;
        }
    }
    
    private void inorder(TreeNode node) {
        if (node == null) return;
        
        // Left
        inorder(node.left);
        
        // Current
        if (prev != null && node.val < prev.val) {
            if (first == null) {
                first = prev;
            }
            second = node;
        }
        prev = node;
        
        // Right
        inorder(node.right);
    }
}

// Helper class
public class RecoverBST {
    
    public static TreeNode buildTree(Integer[] values) {
        if (values == null || values.length == 0) return null;
        
        TreeNode root = new TreeNode(values[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        int i = 1;
        
        while (!queue.isEmpty() && i < values.length) {
            TreeNode current = queue.poll();
            
            if (i < values.length && values[i] != null) {
                current.left = new TreeNode(values[i]);
                queue.offer(current.left);
            }
            i++;
            
            if (i < values.length && values[i] != null) {
                current.right = new TreeNode(values[i]);
                queue.offer(current.right);
            }
            i++;
        }
        
        return root;
    }
    
    public static List<Integer> inorderTraversal(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        Deque<TreeNode> stack = new ArrayDeque<>();
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
    
    public static void main(String[] args) {
        // Test Case: Swap 3 and 7
        Integer[] values = {5, 3, 8, 1, 7, null, 9};
        TreeNode root = buildTree(values);
        
        System.out.println("Before: " + inorderTraversal(root));
        
        SolutionIterative sol = new SolutionIterative();
        sol.recoverTree(root);
        
        System.out.println("After:  " + inorderTraversal(root));
    }
}
```

<!-- slide -->
```javascript
/**
 * Binary Tree Node
 */
class TreeNode {
    constructor(val, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

/**
 * Recover BST using iterative in-order traversal.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(h) where h is tree height
 * 
 * @param {TreeNode} root - Root of BST with two swapped nodes
 */
function recoverTreeIterative(root) {
    if (!root) return;
    
    const stack = [];
    let current = root;
    let first = null;
    let second = null;
    let prev = null;
    
    while (stack.length > 0 || current) {
        // Go to leftmost node
        while (current) {
            stack.push(current);
            current = current.left;
        }
        
        // Process current node
        current = stack.pop();
        
        // Check for violation
        if (prev && current.val < prev.val) {
            if (!first) {
                first = prev;
            }
            second = current;
        }
        
        prev = current;
        current = current.right;
    }
    
    // Swap values
    if (first && second) {
        [first.val, second.val] = [second.val, first.val];
    }
}

/**
 * Recover BST using Morris Traversal - O(1) space.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 * 
 * @param {TreeNode} root - Root of BST with two swapped nodes
 */
function recoverTreeMorris(root) {
    if (!root) return;
    
    let current = root;
    let first = null;
    let second = null;
    let prev = null;
    
    while (current) {
        if (!current.left) {
            // Visit node - no left subtree
            if (prev && current.val < prev.val) {
                if (!first) {
                    first = prev;
                }
                second = current;
            }
            prev = current;
            current = current.right;
        } else {
            // Find inorder predecessor
            let pred = current.left;
            while (pred.right && pred.right !== current) {
                pred = pred.right;
            }
            
            if (!pred.right) {
                // Create temporary thread link
                pred.right = current;
                current = current.left;
            } else {
                // Thread exists, remove it and visit node
                pred.right = null;
                if (prev && current.val < prev.val) {
                    if (!first) {
                        first = prev;
                    }
                    second = current;
                }
                prev = current;
                current = current.right;
            }
        }
    }
    
    // Swap values
    if (first && second) {
        [first.val, second.val] = [second.val, first.val];
    }
}

/**
 * Recover BST using recursive in-order traversal.
 * 
 * Time Complexity: O(n)
 * Space Complexity: O(h) - recursion stack
 * 
 * @param {TreeNode} root - Root of BST with two swapped nodes
 */
function recoverTreeRecursive(root) {
    let first = null;
    let second = null;
    let prev = null;
    
    function inorder(node) {
        if (!node) return;
        
        // Traverse left
        inorder(node.left);
        
        // Process current
        if (prev && node.val < prev.val) {
            if (!first) {
                first = prev;
            }
            second = node;
        }
        prev = node;
        
        // Traverse right
        inorder(node.right);
    }
    
    inorder(root);
    
    if (first && second) {
        [first.val, second.val] = [second.val, first.val];
    }
}

// Helper functions
function buildTree(values) {
    if (!values || values.length === 0) return null;
    
    const nodes = values.map(v => v === null ? null : new TreeNode(v));
    const kids = [...nodes].reverse();
    const root = kids.pop();
    
    for (const node of nodes) {
        if (node) {
            if (kids.length) node.left = kids.pop();
            if (kids.length) node.right = kids.pop();
        }
    }
    
    return root;
}

function inorderTraversal(root) {
    const result = [];
    const stack = [];
    let current = root;
    
    while (stack.length > 0 || current) {
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

function isSorted(arr) {
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[i - 1]) return false;
    }
    return true;
}

// Example usage
console.log("=".repeat(60));
console.log("Test Case 1: Non-adjacent swap (3 and 7)");
console.log("=".repeat(60));
const root1 = buildTree([5, 3, 8, 1, 7, null, 9]);
console.log("Before recovery:", inorderTraversal(root1).join(", "));
recoverTreeIterative(root1);
console.log("After recovery: ", inorderTraversal(root1).join(", "));
console.log("Is sorted:", isSorted(inorderTraversal(root1)));

console.log("\n" + "=".repeat(60));
console.log("Test Case 2: Morris Traversal (adjacent swap)");
console.log("=".repeat(60));
const root2 = buildTree([3, 1, 8, null, null, 5, 9]);
console.log("Before recovery:", inorderTraversal(root2).join(", "));
recoverTreeMorris(root2);
console.log("After recovery: ", inorderTraversal(root2).join(", "));
console.log("Is sorted:", isSorted(inorderTraversal(root2)));

module.exports = {
    TreeNode,
    recoverTreeIterative,
    recoverTreeMorris,
    recoverTreeRecursive
};
```
````

---

## Time Complexity Analysis

| Approach | Time Complexity | Description |
|----------|----------------|-------------|
| **Iterative In-order** | O(n) | Visit each node exactly once |
| **Morris Traversal** | O(n) | Each edge traversed at most twice |
| **Recursive In-order** | O(n) | Visit each node exactly once |
| **In-order + Sort** | O(n log n) | Extract values, sort, then rebuild |

### Detailed Breakdown

**Iterative In-order:**
- Each node is pushed and popped from the stack exactly once
- Total operations: 2n (push + pop) = O(n)

**Morris Traversal:**
- For nodes without left children: O(1) each
- For nodes with left children: traverse to predecessor twice (create + remove thread)
- Total: O(n) as each edge is traversed at most twice

**Recursive In-order:**
- Each node visited exactly once
- Function call overhead: O(n) total
- Risk of stack overflow for skewed trees

---

## Space Complexity Analysis

| Approach | Space Complexity | Description |
|----------|-----------------|-------------|
| **Iterative In-order** | O(h) | Stack holds at most h nodes |
| **Morris Traversal** | O(1) | Only pointer variables used |
| **Recursive In-order** | O(h) | Recursion stack depth |
| **In-order + Sort** | O(n) | Array to store all values |

**Legend**: h = height of tree, n = number of nodes

### Detailed Breakdown

**Iterative In-order:**
- Stack holds nodes along the current path from root
- Maximum stack size = tree height h
- Balanced BST: O(log n), Skewed BST: O(n)

**Morris Traversal:**
- No extra data structures
- Only uses a few pointer variables: current, prev, first, second, pred
- Modifies tree temporarily but restores it (no permanent change)

**Recursive In-order:**
- Each recursive call adds a stack frame
- Maximum recursion depth = tree height h
- Risk of stack overflow for h > ~10,000

---

## Common Variations

### 1. Morris Traversal (O(1) Space)

The optimal space solution that modifies the tree temporarily to create threads:

````carousel
```python
def morris_traversal_template(root):
    """
    Template for Morris In-order Traversal.
    Time: O(n), Space: O(1)
    """
    current = root
    while current:
        if not current.left:
            # Visit current
            print(current.val)
            current = current.right
        else:
            # Find predecessor
            pred = current.left
            while pred.right and pred.right != current:
                pred = pred.right
            
            if not pred.right:
                # Create thread
                pred.right = current
                current = current.left
            else:
                # Remove thread and visit
                pred.right = None
                print(current.val)
                current = current.right
```
````

### 2. Recursive In-order (Simplest)

Best for understanding, but risky for production with large/deep trees:

```python
def recover_tree_recursive(root):
    """Simple recursive solution - not recommended for deep trees."""
    def inorder(node):
        nonlocal first, second, prev
        if not node:
            return
        inorder(node.left)
        if prev and node.val < prev.val:
            if not first:
                first = prev
            second = node
        prev = node
        inorder(node.right)
    
    first = second = prev = None
    inorder(root)
    if first and second:
        first.val, second.val = second.val, first.val
```

### 3. Using BST Iterator Pattern

Abstract the traversal using an iterator:

```python
class BSTIterator:
    """Iterator for in-order traversal of BST."""
    
    def __init__(self, root):
        self.stack = []
        self._push_left(root)
    
    def _push_left(self, node):
        while node:
            self.stack.append(node)
            node = node.left
    
    def next(self):
        node = self.stack.pop()
        self._push_left(node.right)
        return node
    
    def has_next(self):
        return len(self.stack) > 0


def recover_tree_with_iterator(root):
    """Recover using BST iterator pattern."""
    iterator = BSTIterator(root)
    first = second = prev = None
    
    while iterator.has_next():
        current = iterator.next()
        if prev and current.val < prev.val:
            if not first:
                first = prev
            second = current
        prev = current
    
    if first and second:
        first.val, second.val = second.val, first.val
```

---

## Practice Problems

### Problem 1: Recover Binary Search Tree

**Problem:** [LeetCode 99 - Recover Binary Search Tree](https://leetcode.com/problems/recover-binary-search-tree/)

**Description:** You are given the `root` of a binary search tree (BST), where the values of exactly two nodes of the tree were swapped by mistake. Recover the tree without changing its structure.

**How to Apply:**
- Use iterative in-order traversal to find the two violations
- First violation: `prev.val > current.val`, mark `first = prev`
- Second violation: mark `second = current`
- Swap values of `first` and `second`

**Key Insight:** In-order traversal of BST gives sorted order. Two swapped elements create at most two violations.

---

### Problem 2: Validate Binary Search Tree

**Problem:** [LeetCode 98 - Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/)

**Description:** Given the `root` of a binary tree, determine if it is a valid binary search tree (BST).

**How to Apply Recover BST Pattern:**
- Similar in-order traversal approach
- Track previous node and ensure `current.val > prev.val`
- Return false if any violation found
- This is essentially the detection phase without the recovery

**Extension:** If invalid, can you recover it by swapping at most two nodes?

---

### Problem 3: Binary Search Tree Iterator

**Problem:** [LeetCode 173 - Binary Search Tree Iterator](https://leetcode.com/problems/binary-search-tree-iterator/)

**Description:** Implement the `BSTIterator` class that represents an iterator over the in-order traversal of a binary search tree.

**How to Apply Recover BST Pattern:**
- Same iterative in-order traversal mechanism
- Controlled iteration using a stack
- Understanding this helps implement recover BST with cleaner code

---

### Problem 4: Kth Smallest Element in a BST

**Problem:** [LeetCode 230 - Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/)

**Description:** Given the `root` of a binary search tree, and an integer `k`, return the `k`th smallest value (1-indexed) of all the values of the nodes in the tree.

**How to Apply Recover BST Pattern:**
- Use the same in-order traversal approach
- Count nodes as you visit them
- Return when count reaches k
- Morris traversal can solve this in O(1) space

---

### Problem 5: Two Sum IV - Input is a BST

**Problem:** [LeetCode 653 - Two Sum IV - Input is a BST](https://leetcode.com/problems/two-sum-iv-input-is-a-bst/)

**Description:** Given the `root` of a binary search tree and an integer `k`, return `true` if there exist two elements in the BST such that their sum is equal to the given target.

**How to Apply Recover BST Pattern:**
- Use BST iterator for forward in-order traversal (ascending)
- Use reverse BST iterator for backward in-order traversal (descending)
- Two-pointer technique: if sum < target, move left iterator; if sum > target, move right iterator
- This combines BST iterator pattern with two-pointer technique

---

## Video Tutorial Links

### Fundamentals

- [Recover Binary Search Tree (NeetCode)](https://www.youtube.com/watch?v=3Q_oYDQ2whs) - Clear explanation with visualization
- [Recover BST - Morris Traversal (Striver)](https://www.youtube.com/watch?v=1l_0QEF7rsE) - O(1) space solution explained
- [Binary Search Tree Recovery (take U forward)](https://www.youtube.com/watch?v=ZWGW7FminDM) - Step-by-step walkthrough

### Advanced Topics

- [Morris Traversal Explained](https://www.youtube.com/watch?v=wGXB9OWhPTg) - Threaded binary trees in detail
- [BST Iterator Pattern](https://www.youtube.com/watch?v=Ddg4tA9fG0w) - Controlled tree traversal
- [Space Optimized Tree Algorithms](https://www.youtube.com/watch?v=24Kp_0RpL1w) - O(1) space techniques

---

## Follow-up Questions

### Q1: Why do we swap values instead of nodes?

**Answer:** Swapping values is simpler and more efficient than swapping nodes:
- **Value swap**: O(1) - just exchange two integers
- **Node swap**: O(n) potentially - need to update parent pointers, handle children correctly
- The problem asks to "recover the tree" which is satisfied by fixing the values
- Node swap would require knowing parent pointers and handling various tree configurations

### Q2: Can there be more than two violations?

**Answer:** No, when exactly two nodes are swapped in a BST:
- **Non-adjacent case**: Creates exactly 2 violations
- **Adjacent case**: Creates exactly 1 violation
- More violations would mean more than 2 nodes were swapped
- The algorithm handles both cases: always update `second` node on violation

### Q3: What if more than two nodes are swapped?

**Answer:** The algorithm won't correctly recover the tree:
- It's designed for exactly two swapped nodes
- With more swaps, you'd need a different approach:
  - Extract all values, sort them, then rebuild (O(n log n))
  - Or use a more complex algorithm to identify all misplaced nodes
- This is why problem constraints specify "exactly two nodes"

### Q4: Why is Morris Traversal O(1) space?

**Answer:** Morris Traversal achieves O(1) space by:
- Using the tree's own null pointers as temporary threads
- No stack or recursion needed
- Each node has a right pointer that can temporarily point to its in-order successor
- These threads are created and then removed (tree restored to original structure)
- Only uses a few pointer variables regardless of tree size

### Q5: When should I avoid Morris Traversal?

**Answer:** Avoid Morris Traversal when:
- **Multi-threaded environment**: Modifying tree structure can cause race conditions
- **Immutable trees**: Tree cannot be temporarily modified
- **Read-only access**: Not allowed to modify tree even temporarily
- **Simpler code preferred**: Iterative solution is more readable and maintainable
- **Performance critical**: Morris has higher constant factor despite same asymptotic complexity

---

## Summary

The **Recover BST** algorithm is a classic tree traversal problem that demonstrates the power of **in-order traversal** in BST problems. Key takeaways:

- **Core Insight**: In-order traversal of BST yields sorted order; swapped nodes create violations
- **Detection**: Track `prev` node during traversal; violations occur when `current.val < prev.val`
- **Two Cases**: Non-adjacent swap (2 violations) vs adjacent swap (1 violation)
- **Implementation Options**:
  - **Iterative**: O(n) time, O(h) space - balanced approach
  - **Morris**: O(n) time, O(1) space - optimal space
  - **Recursive**: O(n) time, O(h) space - simplest code, stack overflow risk

**When to use each approach:**
- ✅ Use **Iterative** for production code with balanced trees
- ✅ Use **Morris** when space is critical and tree can be temporarily modified
- ✅ Use **Recursive** for interviews and small trees
- ❌ Avoid **Recursive** for potentially skewed trees (stack overflow risk)

**Common Pattern Extensions:**
- BST validation (same traversal, just detect without fixing)
- Kth smallest element (stop traversal at kth node)
- BST Iterator (controlled traversal)
- Two Sum in BST (forward + reverse iterators)

Mastering this algorithm provides a foundation for many BST-related problems in competitive programming and technical interviews.

---

## Related Algorithms

- [BST Insert](./bst-insert.md) - Building and modifying BSTs
- [Binary Search](./binary-search.md) - Searching in sorted structures
- [Inorder Traversal](./graph-dfs.md) - Tree traversal patterns
- [Kth Largest Element](./kth-largest.md) - Order statistics in trees
