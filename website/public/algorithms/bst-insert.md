# BST Insert

## Category
Trees & BSTs

## Description

Insert a new node into a Binary Search Tree (BST) while maintaining the BST property. This fundamental operation enables dynamic tree construction and is the basis for BST-based data structures like sets and maps. The algorithm ensures that after insertion, the tree maintains the critical invariant: for every node, all values in the left subtree are smaller, and all values in the right subtree are larger.

---

## When to Use

Use BST Insert when you need to solve problems involving:

- **Dynamic Set Operations**: Building a sorted collection with efficient insertion
- **Tree Construction**: Creating a BST from a sequence of values
- **Order Statistics**: Maintaining elements in sorted order for rank queries
- **Duplicate Handling**: Managing frequency counts in a sorted structure
- **Self-Balancing Trees**: As a building block for AVL, Red-Black trees

### Comparison with Alternatives

| Data Structure | Insert Time | Search Time | Space | Supports Duplicates | Balanced Guarantee |
|----------------|-------------|-------------|-------|---------------------|-------------------|
| **BST (Basic)** | O(h) avg | O(h) avg | O(n) | ✅ Yes | ❌ No |
| **AVL Tree** | O(log n) | O(log n) | O(n) | ✅ Yes | ✅ Yes |
| **Red-Black Tree** | O(log n) | O(log n) | O(n) | ✅ Yes | ✅ Yes |
| **Hash Table** | O(1) avg | O(1) avg | O(n) | ✅ Yes | N/A |
| **Sorted Array** | O(n) | O(log n) | O(n) | ✅ Yes | N/A |

### When to Choose BST Insert vs Other Structures

- **Choose BST Insert** when:
  - You need in-order traversal for sorted output
  - The data has some randomness (natural balance)
  - You need both insertions and range queries
  - Implementing more complex tree algorithms

- **Choose Hash Table** when:
  - You only need existence checks, not ordering
  - O(1) lookup is critical
  - No need for range queries or sorted iteration

- **Choose Self-Balancing Tree** when:
  - Input may be sorted (causing skew)
  - Worst-case guarantees are important
  - Consistent O(log n) performance needed

---

## Algorithm Explanation

### Core Concept

The fundamental principle of BST insertion is the **Binary Search Property**: for any node with value `v`, all nodes in its left subtree have values `< v`, and all nodes in its right subtree have values `> v`. This property enables efficient O(h) insertion by using the value comparison to guide the search for the insertion position.

### How It Works

#### Insertion Strategy:
1. **Search Phase**: Traverse from root, comparing the new value with each node
2. **Decision Rule**: Go left if smaller, right if larger
3. **Termination**: Stop at the first `null` position (leaf's child)
4. **Attachment**: Create new node and attach as left/right child

#### Recursive vs Iterative:

**Recursive Approach:**
- Elegant, mirrors the mathematical definition
- Stack depth equals tree height: O(h) space
- Natural return of modified subtree root

**Iterative Approach:**
- Explicit stack management with pointers
- Constant extra space: O(1) space
- Better for very deep trees (avoids stack overflow)

### Visual Representation

Inserting value `6` into the following BST:

```
    8
   / \
  3   10
 / \    \
1   6    14
   /
  4
   \
    5
```

**Step-by-step insertion of 6:**
1. Start at root (8): 6 < 8, go left
2. At node (3): 6 > 3, go right
3. At node (6): 6 == 6, handle duplicate
4. If allowing duplicates in right subtree: attach as right child of existing 6

### Handling Duplicates

Three common strategies:
1. **Ignore**: Don't insert if value exists (standard)
2. **Count**: Store frequency count in node
3. **Right-Only**: Always insert duplicates in right subtree

### Time Complexity Variations

| Tree Shape | Height (h) | Insert Time | Example Input |
|------------|------------|-------------|---------------|
| **Balanced** | log₂(n) | O(log n) | Random insertion order |
| **Skewed (Left)** | n | O(n) | Sorted descending input |
| **Skewed (Right)** | n | O(n) | Sorted ascending input |
| **Degenerate** | n | O(n) | Single-child nodes only |

---

## Algorithm Steps

### Recursive Insertion

1. **Base Case**: If current node is `null`, create and return new node
2. **Compare Value**: 
   - If new value < current value, recurse on left subtree
   - If new value > current value, recurse on right subtree
   - If equal, handle according to duplicate policy
3. **Return Root**: Return (possibly modified) current node

### Iterative Insertion

1. **Empty Tree Check**: If root is `null`, create root and return
2. **Traversal**: Initialize `current = root`, `parent = null`
3. **Find Position**: While `current` is not `null`:
   - Store `parent = current`
   - Move left if value < current.val, else right
   - Break if duplicate found (per policy)
4. **Attach Node**: Create new node as left/right child of `parent`
5. **Return Root**: Return unchanged root

---

## Implementation

````carousel
```python
from typing import Optional


class TreeNode:
    """Node class for Binary Search Tree."""
    def __init__(self, val: int):
        self.val = val
        self.left: Optional[TreeNode] = None
        self.right: Optional[TreeNode] = None


def insert_recursive(root: Optional[TreeNode], val: int) -> TreeNode:
    """
    Insert a value into BST recursively.
    
    Args:
        root: Root of the BST (can be None for empty tree)
        val: Value to insert
    
    Returns:
        Root of the modified BST
    
    Time: O(h) where h is height
    Space: O(h) for recursion stack
    """
    # Base case: found the position
    if root is None:
        return TreeNode(val)
    
    # Recursively find the correct position
    if val < root.val:
        root.left = insert_recursive(root.left, val)
    elif val > root.val:
        root.right = insert_recursive(root.right, val)
    # If val == root.val, do nothing (no duplicates in standard BST)
    
    return root


def insert_iterative(root: Optional[TreeNode], val: int) -> TreeNode:
    """
    Insert a value into BST iteratively.
    
    Args:
        root: Root of the BST (can be None for empty tree)
        val: Value to insert
    
    Returns:
        Root of the modified BST
    
    Time: O(h) where h is height
    Space: O(1)
    """
    # If tree is empty, create root
    if root is None:
        return TreeNode(val)
    
    # Traverse to find the correct position
    current = root
    while True:
        if val < current.val:
            if current.left is None:
                current.left = TreeNode(val)
                break
            current = current.left
        elif val > current.val:
            if current.right is None:
                current.right = TreeNode(val)
                break
            current = current.right
        else:
            # Duplicate value - do nothing
            break
    
    return root


class BSTWithDuplicates:
    """BST that stores duplicate values in right subtree."""
    
    def insert(self, root: Optional[TreeNode], val: int) -> TreeNode:
        """Insert allowing duplicates in right subtree."""
        if root is None:
            return TreeNode(val)
        
        if val <= root.val:  # <= for left subtree
            root.left = self.insert(root.left, val)
        else:
            root.right = self.insert(root.right, val)
        
        return root


def inorder_traversal(root: Optional[TreeNode]) -> list:
    """Inorder traversal to verify BST property."""
    result = []
    
    def _inorder(node):
        if node:
            _inorder(node.left)
            result.append(node.val)
            _inorder(node.right)
    
    _inorder(root)
    return result


def build_bst(values: list) -> Optional[TreeNode]:
    """Build BST from a list of values."""
    root = None
    for val in values:
        root = insert_iterative(root, val)
    return root


# Example usage
if __name__ == "__main__":
    print("BST Insertion")
    print("=" * 40)
    
    # Insert values into BST
    values = [7, 3, 9, 1, 5, 8, 10]
    
    print(f"\nInserting values: {values}")
    root = None
    for val in values:
        root = insert_iterative(root, val)
        print(f"  Inserted {val}, Inorder: {inorder_traversal(root)}")
    
    print("\nFinal tree (inorder):", inorder_traversal(root))
    
    # Build tree and verify
    print("\nBuilding from [5, 3, 7, 1, 4, 6, 8]:")
    root2 = build_bst([5, 3, 7, 1, 4, 6, 8])
    print("Inorder:", inorder_traversal(root2))
    
    # Insert more values
    print("\nInserting 2 and 9:")
    root2 = insert_iterative(root2, 2)
    root2 = insert_iterative(root2, 9)
    print("Inorder:", inorder_traversal(root2))
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
using namespace std;

/**
 * Node structure for Binary Search Tree
 */
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

/**
 * Insert a value into BST recursively
 * 
 * Time: O(h) where h is height
 * Space: O(h) for recursion stack
 */
TreeNode* insertRecursive(TreeNode* root, int val) {
    // Base case: found the position
    if (root == nullptr) {
        return new TreeNode(val);
    }
    
    // Recursively find the correct position
    if (val < root->val) {
        root->left = insertRecursive(root->left, val);
    } else if (val > root->val) {
        root->right = insertRecursive(root->right, val);
    }
    // If val == root->val, do nothing (no duplicates)
    
    return root;
}

/**
 * Insert a value into BST iteratively
 * 
 * Time: O(h) where h is height
 * Space: O(1)
 */
TreeNode* insertIterative(TreeNode* root, int val) {
    // If tree is empty, create root
    if (root == nullptr) {
        return new TreeNode(val);
    }
    
    TreeNode* current = root;
    TreeNode* parent = nullptr;
    
    // Find the correct position
    while (current != nullptr) {
        parent = current;
        if (val < current->val) {
            current = current->left;
        } else if (val > current->val) {
            current = current->right;
        } else {
            // Duplicate found, do nothing
            return root;
        }
    }
    
    // Attach new node to parent
    if (val < parent->val) {
        parent->left = new TreeNode(val);
    } else {
        parent->right = new TreeNode(val);
    }
    
    return root;
}

/**
 * BST that allows duplicates in right subtree
 */
class BSTWithDuplicates {
public:
    TreeNode* insert(TreeNode* root, int val) {
        if (root == nullptr) {
            return new TreeNode(val);
        }
        
        if (val <= root->val) {  // <= for left subtree
            root->left = insert(root->left, val);
        } else {
            root->right = insert(root->right, val);
        }
        
        return root;
    }
};

/**
 * Inorder traversal to verify BST property
 */
void inorderTraversal(TreeNode* root, vector<int>& result) {
    if (root == nullptr) return;
    
    inorderTraversal(root->left, result);
    result.push_back(root->val);
    inorderTraversal(root->right, result);
}

/**
 * Build BST from vector of values
 */
TreeNode* buildBST(const vector<int>& values) {
    TreeNode* root = nullptr;
    for (int val : values) {
        root = insertIterative(root, val);
    }
    return root;
}

// Helper to print vector
void printVector(const vector<int>& vec) {
    cout << "[";
    for (size_t i = 0; i < vec.size(); i++) {
        cout << vec[i];
        if (i < vec.size() - 1) cout << ", ";
    }
    cout << "]";
}

int main() {
    cout << "BST Insertion" << endl;
    cout << "========================================" << endl;
    
    // Insert values into BST
    vector<int> values = {7, 3, 9, 1, 5, 8, 10};
    
    cout << "\nInserting values: ";
    printVector(values);
    cout << endl;
    
    TreeNode* root = nullptr;
    for (int val : values) {
        root = insertIterative(root, val);
        vector<int> inorder;
        inorderTraversal(root, inorder);
        cout << "  Inserted " << val << ", Inorder: ";
        printVector(inorder);
        cout << endl;
    }
    
    vector<int> finalInorder;
    inorderTraversal(root, finalInorder);
    cout << "\nFinal tree (inorder): ";
    printVector(finalInorder);
    cout << endl;
    
    return 0;
}
```

<!-- slide -->
```java
/**
 * Node class for Binary Search Tree
 */
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    
    TreeNode(int x) {
        val = x;
        left = null;
        right = null;
    }
}

/**
 * BST Insert implementation with recursive and iterative approaches
 */
public class BSTInsert {
    
    /**
     * Insert a value into BST recursively
     * 
     * Time: O(h) where h is height
     * Space: O(h) for recursion stack
     */
    public TreeNode insertRecursive(TreeNode root, int val) {
        // Base case: found the position
        if (root == null) {
            return new TreeNode(val);
        }
        
        // Recursively find the correct position
        if (val < root.val) {
            root.left = insertRecursive(root.left, val);
        } else if (val > root.val) {
            root.right = insertRecursive(root.right, val);
        }
        // If val == root.val, do nothing (no duplicates)
        
        return root;
    }
    
    /**
     * Insert a value into BST iteratively
     * 
     * Time: O(h) where h is height
     * Space: O(1)
     */
    public TreeNode insertIterative(TreeNode root, int val) {
        // If tree is empty, create root
        if (root == null) {
            return new TreeNode(val);
        }
        
        TreeNode current = root;
        TreeNode parent = null;
        
        // Find the correct position
        while (current != null) {
            parent = current;
            if (val < current.val) {
                current = current.left;
            } else if (val > current.val) {
                current = current.right;
            } else {
                // Duplicate found, do nothing
                return root;
            }
        }
        
        // Attach new node to parent
        if (val < parent.val) {
            parent.left = new TreeNode(val);
        } else {
            parent.right = new TreeNode(val);
        }
        
        return root;
    }
    
    /**
     * BST that allows duplicates in right subtree
     */
    public TreeNode insertWithDuplicates(TreeNode root, int val) {
        if (root == null) {
            return new TreeNode(val);
        }
        
        if (val <= root.val) {  // <= for left subtree
            root.left = insertWithDuplicates(root.left, val);
        } else {
            root.right = insertWithDuplicates(root.right, val);
        }
        
        return root;
    }
    
    /**
     * Inorder traversal to verify BST property
     */
    public void inorderTraversal(TreeNode root, java.util.List<Integer> result) {
        if (root == null) return;
        
        inorderTraversal(root.left, result);
        result.add(root.val);
        inorderTraversal(root.right, result);
    }
    
    /**
     * Build BST from array of values
     */
    public TreeNode buildBST(int[] values) {
        TreeNode root = null;
        for (int val : values) {
            root = insertIterative(root, val);
        }
        return root;
    }
    
    public static void main(String[] args) {
        BSTInsert solution = new BSTInsert();
        
        System.out.println("BST Insertion");
        System.out.println("========================================");
        
        // Insert values into BST
        int[] values = {7, 3, 9, 1, 5, 8, 10};
        
        System.out.println("\nInserting values: " + java.util.Arrays.toString(values));
        TreeNode root = null;
        
        for (int val : values) {
            root = solution.insertIterative(root, val);
            java.util.List<Integer> inorder = new java.util.ArrayList<>();
            solution.inorderTraversal(root, inorder);
            System.out.println("  Inserted " + val + ", Inorder: " + inorder);
        }
        
        java.util.List<Integer> finalInorder = new java.util.ArrayList<>();
        solution.inorderTraversal(root, finalInorder);
        System.out.println("\nFinal tree (inorder): " + finalInorder);
    }
}
```

<!-- slide -->
```javascript
/**
 * Node class for Binary Search Tree
 */
class TreeNode {
    constructor(val) {
        this.val = val;
        this.left = null;
        this.right = null;
    }
}

/**
 * Insert a value into BST recursively
 * 
 * Time: O(h) where h is height
 * Space: O(h) for recursion stack
 * 
 * @param {TreeNode} root - Root of the BST
 * @param {number} val - Value to insert
 * @returns {TreeNode} Root of the modified BST
 */
function insertRecursive(root, val) {
    // Base case: found the position
    if (root === null) {
        return new TreeNode(val);
    }
    
    // Recursively find the correct position
    if (val < root.val) {
        root.left = insertRecursive(root.left, val);
    } else if (val > root.val) {
        root.right = insertRecursive(root.right, val);
    }
    // If val == root.val, do nothing (no duplicates)
    
    return root;
}

/**
 * Insert a value into BST iteratively
 * 
 * Time: O(h) where h is height
 * Space: O(1)
 * 
 * @param {TreeNode} root - Root of the BST
 * @param {number} val - Value to insert
 * @returns {TreeNode} Root of the modified BST
 */
function insertIterative(root, val) {
    // If tree is empty, create root
    if (root === null) {
        return new TreeNode(val);
    }
    
    let current = root;
    
    // Find the correct position
    while (true) {
        if (val < current.val) {
            if (current.left === null) {
                current.left = new TreeNode(val);
                break;
            }
            current = current.left;
        } else if (val > current.val) {
            if (current.right === null) {
                current.right = new TreeNode(val);
                break;
            }
            current = current.right;
        } else {
            // Duplicate found, do nothing
            break;
        }
    }
    
    return root;
}

/**
 * BST that allows duplicates in right subtree
 */
class BSTWithDuplicates {
    insert(root, val) {
        if (root === null) {
            return new TreeNode(val);
        }
        
        if (val <= root.val) {  // <= for left subtree
            root.left = this.insert(root.left, val);
        } else {
            root.right = this.insert(root.right, val);
        }
        
        return root;
    }
}

/**
 * Inorder traversal to verify BST property
 * 
 * @param {TreeNode} root - Root of the BST
 * @returns {number[]} Array of values in sorted order
 */
function inorderTraversal(root) {
    const result = [];
    
    function inorder(node) {
        if (node === null) return;
        inorder(node.left);
        result.push(node.val);
        inorder(node.right);
    }
    
    inorder(root);
    return result;
}

/**
 * Build BST from array of values
 * 
 * @param {number[]} values - Array of values
 * @returns {TreeNode} Root of the built BST
 */
function buildBST(values) {
    let root = null;
    for (const val of values) {
        root = insertIterative(root, val);
    }
    return root;
}

// Example usage
console.log("BST Insertion");
console.log("========================================");

// Insert values into BST
const values = [7, 3, 9, 1, 5, 8, 10];

console.log("\nInserting values:", values);
let root = null;

for (const val of values) {
    root = insertIterative(root, val);
    console.log(`  Inserted ${val}, Inorder: [${inorderTraversal(root).join(", ")}]`);
}

console.log("\nFinal tree (inorder):", inorderTraversal(root));

// Build tree and verify
console.log("\nBuilding from [5, 3, 7, 1, 4, 6, 8]:");
const root2 = buildBST([5, 3, 7, 1, 4, 6, 8]);
console.log("Inorder:", inorderTraversal(root2));
```
````

---

## Example

**Input:**
```
Insert values: [7, 3, 9, 1, 5, 8, 10] into an empty BST
```

**Output:**
```
Inserting values: [7, 3, 9, 1, 5, 8, 10]
  Inserted 7, Inorder: [7]
  Inserted 3, Inorder: [3, 7]
  Inserted 9, Inorder: [3, 7, 9]
  Inserted 1, Inorder: [1, 3, 7, 9]
  Inserted 5, Inorder: [1, 3, 5, 7, 9]
  Inserted 8, Inorder: [1, 3, 5, 7, 8, 9]
  Inserted 10, Inorder: [1, 3, 5, 7, 8, 9, 10]

Final tree (inorder): [1, 3, 5, 7, 8, 9, 10]

Tree structure:
        7
       / \
      3   9
     / \ / \
    1  5 8  10
```

---

## Time Complexity Analysis

| Case | Time Complexity | Description |
|------|-----------------|-------------|
| **Best Case** | O(log n) | Balanced tree, height = log₂(n) |
| **Average Case** | O(log n) | Random insertion order |
| **Worst Case** | O(n) | Skewed tree (sorted input) |
| **Amortized** | O(log n) | With self-balancing (AVL/Red-Black) |

### Detailed Breakdown

- **Balanced BST**: Height h = ⌊log₂(n)⌋, so insertion takes O(log n)
  - At each level, we do one comparison and move to a child
  - Total work: number of levels = height

- **Skewed BST**: Height h = n (single chain), insertion takes O(n)
  - Must traverse through all n nodes
  - Occurs with sorted/ nearly sorted input

- **Recursive vs Iterative**:
  - Both have same time complexity: O(h)
  - Recursive has O(h) space overhead from call stack
  - Iterative uses O(1) extra space

---

## Space Complexity Analysis

| Component | Space Complexity | Description |
|-----------|------------------|-------------|
| **Tree Structure** | O(n) | n nodes, each with 2 pointers + value |
| **Recursive Insert** | O(h) | Call stack depth equals tree height |
| **Iterative Insert** | O(1) | Only uses a few pointers |
| **Total (Recursive)** | O(n + h) = O(n) | Dominated by tree storage |
| **Total (Iterative)** | O(n) | Just the tree structure |

### Space Optimization Notes

1. **Pointer Overhead**: Each node stores 2 child pointers (16 bytes on 64-bit)
2. **Memory Pool**: For many insertions, use object pool to reduce allocation overhead
3. **Parent Pointer**: Adding parent pointer increases space but enables certain operations

---

## Common Variations

### 1. BST with Duplicate Handling

Store frequency count for duplicate values:

````carousel
```python
class TreeNodeWithCount:
    """Node that tracks frequency of values."""
    def __init__(self, val: int):
        self.val = val
        self.count = 1  # Frequency of this value
        self.left: Optional[TreeNodeWithCount] = None
        self.right: Optional[TreeNodeWithCount] = None

def insert_with_count(root: Optional[TreeNodeWithCount], val: int) -> TreeNodeWithCount:
    """Insert with frequency counting for duplicates."""
    if root is None:
        return TreeNodeWithCount(val)
    
    if val < root.val:
        root.left = insert_with_count(root.left, val)
    elif val > root.val:
        root.right = insert_with_count(root.right, val)
    else:
        root.count += 1  # Increment frequency
    
    return root
```
````

### 2. Threaded BST Insert

Optimize space by using null pointers as threads to successors:

````carousel
```python
class ThreadedTreeNode:
    """Node with threading for inorder traversal without stack."""
    def __init__(self, val: int):
        self.val = val
        self.left = None
        self.right = None
        self.left_thread = False  # True if left is thread
        self.right_thread = False  # True if right is thread

def insert_threaded(root: ThreadedTreeNode, val: int) -> ThreadedTreeNode:
    """Insert into threaded BST."""
    if root is None:
        return ThreadedTreeNode(val)
    
    # Find insertion point and update threads
    # Implementation maintains threading invariants
    # ... (full implementation would update threads)
    
    return root
```
````

### 3. Parent-Pointer BST

Each node stores reference to parent for easier traversal:

````carousel
```python
class TreeNodeWithParent:
    """Node with parent reference for upward traversal."""
    def __init__(self, val: int, parent=None):
        self.val = val
        self.parent = parent
        self.left: Optional[TreeNodeWithParent] = None
        self.right: Optional[TreeNodeWithParent] = None

def insert_with_parent(root: Optional[TreeNodeWithParent], val: int) -> TreeNodeWithParent:
    """Insert while maintaining parent pointers."""
    if root is None:
        return TreeNodeWithParent(val)
    
    if val < root.val:
        if root.left is None:
            root.left = TreeNodeWithParent(val, root)
        else:
            root.left = insert_with_parent(root.left, val)
    elif val > root.val:
        if root.right is None:
            root.right = TreeNodeWithParent(val, root)
        else:
            root.right = insert_with_parent(root.right, val)
    
    return root
```
````

### 4. Randomized BST Insert

Randomize insertion to maintain balance probabilistically:

````carousel
```python
import random

def insert_randomized(root: Optional[TreeNode], val: int) -> TreeNode:
    """
    Randomized insertion that maintains balance in expectation.
    With probability 1/(size+1), make new node the root.
    """
    if root is None:
        return TreeNode(val)
    
    # Get size (in practice, store size in node)
    size = get_size(root)
    
    # With probability 1/(size+1), insert at root
    if random.randint(1, size + 1) == 1:
        return insert_at_root(root, val)
    
    # Otherwise, insert recursively
    if val < root.val:
        root.left = insert_randomized(root.left, val)
    elif val > root.val:
        root.right = insert_randomized(root.right, val)
    
    return root

def insert_at_root(root: TreeNode, val: int) -> TreeNode:
    """Insert val as new root, splitting existing tree."""
    # Split tree and make val the new root
    # ... implementation using tree split operation
    pass

def get_size(root: TreeNode) -> int:
    """Get size of subtree (would be O(1) with stored size)."""
    if root is None:
        return 0
    return 1 + get_size(root.left) + get_size(root.right)
```
````

---

## Practice Problems

### Problem 1: Insert into a Binary Search Tree

**Problem:** [LeetCode 701 - Insert into a Binary Search Tree](https://leetcode.com/problems/insert-into-a-binary-search-tree/)

**Description:** You are given the root node of a BST and a value to insert. Return the root node of the BST after the insertion.

**Key Learning:**
- Basic BST insertion mechanics
- Handling empty tree case
- Return value management in recursive solution

---

### Problem 2: Search in a Binary Search Tree

**Problem:** [LeetCode 700 - Search in a Binary Search Tree](https://leetcode.com/problems/search-in-a-binary-search-tree/)

**Description:** Given the root of BST and a value, find the node with that value and return the subtree rooted with that node.

**Key Learning:**
- BST search follows same logic as insert
- Understanding the BST property for navigation
- Recursive and iterative approaches

---

### Problem 3: Delete Node in a BST

**Problem:** [LeetCode 450 - Delete Node in a BST](https://leetcode.com/problems/delete-node-in-a-bst/)

**Description:** Given a root node and a key, delete the node with the given key and return the new root.

**Key Learning:**
- Natural extension of insertion
- Three cases: leaf, one child, two children
- Finding inorder successor/predecessor

---

### Problem 4: Validate Binary Search Tree

**Problem:** [LeetCode 98 - Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/)

**Description:** Determine if a given binary tree is a valid BST.

**Key Learning:**
- Understanding BST invariants
- Range-based validation
- Inorder traversal verification

---

### Problem 5: Kth Smallest Element in a BST

**Problem:** [LeetCode 230 - Kth Smallest Element in a BST](https://leetcode.com/problems/kth-smallest-element-in-a-bst/)

**Description:** Given the root of a BST and an integer k, return the kth smallest value.

**Key Learning:**
- Inorder traversal gives sorted order
- Augmenting nodes with subtree sizes
- Order statistics on BSTs

---

## Video Tutorial Links

### Fundamentals

- [Binary Search Tree - Insertion (WilliamFiset)](https://www.youtube.com/watch?v=COZK7NATh4k) - Comprehensive BST insertion explanation
- [BST Insertion Algorithm (Abdul Bari)](https://www.youtube.com/watch?v=K5pX9L1d8y8) - Step-by-step visualization
- [Binary Search Tree in 5 Minutes (NeetCode)](https://www.youtube.com/watch?v=UvLqWJP2L10) - Quick overview of BST operations

### Advanced Topics

- [Self-Balancing BST (AVL Tree Insertion)](https://www.youtube.com/watch?v=vRwi_UcZGjU) - How to maintain balance
- [Red-Black Tree Insertion](https://www.youtube.com/watch?v=qvZGUFHWChY) - Advanced balanced tree insertion
- [Randomized BST](https://www.youtube.com/watch?v=2x4LR8YsZJw) - Probabilistic balancing approach

---

## Follow-up Questions

### Q1: Why does BST insertion use O(h) time instead of O(log n)?

**Answer:** The time complexity depends on tree height h, not log n:
- **Balanced tree**: h = log₂(n), so time is O(log n)
- **Skewed tree**: h = n, so time is O(n)
- Basic BST doesn't guarantee balance
- Self-balancing trees (AVL, Red-Black) ensure h = O(log n)

### Q2: How do you handle duplicate values in BST insertion?

**Answer:** Three common strategies:
1. **Ignore**: Don't insert duplicates (standard approach)
2. **Count**: Store frequency in node, increment on duplicate
3. **Right subtree**: Insert duplicates in right subtree (use `<=` for left comparison)

### Q3: What's the difference between recursive and iterative insertion?

**Answer:**
- **Recursive**: Cleaner code, mirrors mathematical definition, O(h) stack space
- **Iterative**: More efficient, O(1) extra space, avoids stack overflow for deep trees
- Both have same time complexity O(h)
- Iterative is preferred for production code with large trees

### Q4: Can we insert into a BST in O(1) time?

**Answer:** No, you cannot insert in O(1) time while maintaining BST properties:
- Must find correct position to maintain ordering
- Requires traversing from root to leaf
- Hash tables can insert in O(1) but lose ordering
- Consider using hash table if only need existence checks

### Q5: How do you build a balanced BST from a sorted array?

**Answer:** Instead of sequential insertion (O(n²) worst case):
1. **Sort the array**: O(n log n)
2. **Pick middle element** as root
3. **Recursively** build left subtree from left half
4. **Recursively** build right subtree from right half
5. **Total time**: O(n log n), results in perfectly balanced tree

---

## Summary

BST Insertion is a fundamental tree operation that maintains the binary search property while adding new elements. Key takeaways:

- **O(h) time complexity**: Fast for balanced trees, slow for skewed trees
- **Two approaches**: Recursive (elegant) vs Iterative (space-efficient)
- **Duplicate handling**: Multiple strategies based on requirements
- **Foundation for advanced trees**: AVL, Red-Black trees build upon basic insertion
- **Trade-offs**: Simple implementation vs guaranteed performance

When to use:
- ✅ Need dynamic sorted data structure
- ✅ Frequent insertions with occasional searches
- ✅ Building block for more complex algorithms
- ⚠️ Input may be sorted (consider self-balancing variant)
- ❌ Only need existence checks (use hash table instead)

Mastering BST insertion is essential for understanding tree-based data structures and forms the basis for more advanced algorithms in computer science.

---

## Related Algorithms

- [BST Search](./bst-search.md) - Finding elements in a BST
- [BST Delete](./bst-delete.md) - Removing elements from a BST
- [AVL Tree](./avl-tree.md) - Self-balancing BST variant
- [Red-Black Tree](./red-black-tree.md) - Another self-balancing BST
- [Binary Tree Traversal](./binary-tree-traversal.md) - Inorder, preorder, postorder
