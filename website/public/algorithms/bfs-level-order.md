# BFS Level Order

## Category
Trees & BSTs

## Description

Breadth-First Search (BFS) Level Order Traversal is a fundamental tree traversal algorithm that visits all nodes at the present depth level before moving to nodes at the next depth level. Using a queue data structure, this algorithm ensures nodes are processed in FIFO (First-In-First-Out) order, which naturally produces level-by-level traversal from left to right.

This algorithm is essential for solving many tree and graph problems, including finding the shortest path in unweighted graphs, computing level statistics, checking tree properties, and solving problems that require processing nodes by their distance from the root.

---

## When to Use

Use the BFS Level Order algorithm when you need to solve problems involving:

- **Tree Level Traversal**: When you need to visit nodes level by level
- **Shortest Path**: Finding the shortest path in unweighted graphs or trees
- **Level Statistics**: Computing averages, sums, maximums, or minimums per level
- **Tree Width**: Finding the maximum width of a binary tree
- **Level-order Serialization**: Converting a tree to array representation and vice versa
- **Graph Connectivity**: Finding connected components in unweighted graphs
- **Minimum Depth**: Finding the minimum depth of a binary tree

### Comparison with Alternatives

| Algorithm | Use Case | Time | Space | Notes |
|-----------|----------|------|-------|-------|
| **BFS Level Order** | Level-by-level traversal, shortest path | O(n) | O(w) | w = max width |
| **DFS Pre-order** | Path finding, tree construction | O(n) | O(h) | h = height |
| **DFS In-order** | BST traversal, sorted output | O(n) | O(h) | h = height |
| **DFS Post-order** | Tree evaluation, deletion | O(n) | O(h) | h = height |

### When to Choose BFS vs DFS

- **Choose BFS Level Order** when:
  - Finding shortest path in unweighted structures
  - Computing level-wise statistics
  - Tree width or level-related queries
  - Level-order reconstruction of trees
  - Problems where closer nodes should be processed first

- **Choose DFS** when:
  - Finding all paths or valid configurations
  - Tree depth-related problems
  - Memory is limited (DFS uses less space for deep trees)
  - Recursive solutions are cleaner

---

## Algorithm Explanation

### Core Concept

The key insight behind BFS Level Order traversal is using a **queue** data structure to maintain the order of nodes to be processed. Since a queue follows FIFO (First-In-First-Out) principle:

1. When we discover a node, we add its children to the end of the queue
2. Nodes are processed from the front of the queue
3. This ensures all nodes at depth d are processed before any node at depth d+1

### How It Works

#### Basic Algorithm:
1. **Initialize**: Add the root node to a queue
2. **Process Level**: While queue is not empty:
   - Determine the number of nodes at current level (queue size)
   - Process all nodes at current level (dequeue, process, enqueue children)
3. **Move to Next Level**: After processing all nodes at current level, proceed to the next
4. **Termination**: Continue until queue is empty

### Visual Representation

For a binary tree:
```
        1           ← Level 0 (root)
       / \
      2   3         ← Level 1
     / \   \
    4   5   6       ← Level 2

Queue States:
Step 1: [1]           → Process 1, add children
Step 2: [2, 3]        → Process 2,3, add their children
Step 3: [4, 5, 6]     → Process 4,5,6, no children
Step 4: []            → Done!

Output: [[1], [2, 3], [4, 5, 6]]
```

### Why Queue Works

- **FIFO Property**: The queue naturally orders nodes by discovery time
- **Level Separation**: By processing all nodes of current queue size, we ensure level boundaries
- **Left-to-Right**: Adding left child first, then right child ensures left-to-right ordering within each level

### Key Variations

1. **Flat Output**: Return all values in a single list `[1, 2, 3, 4, 5, 6]`
2. **Level Grouped**: Return values per level `[[1], [2, 3], [4, 5, 6]]`
3. **Level Indicators**: Return values with level information `[(1, 0), (2, 1), (3, 1), ...]`

---

## Algorithm Steps

### Basic Level Order Traversal

1. **Check Base Case**: If root is null, return empty list
2. **Initialize Queue**: Create an empty queue and add root node
3. **Initialize Result**: Create an empty list to store results
4. **While Queue Not Empty**:
   - Get current queue size (number of nodes at current level)
   - Create empty list for current level
   - Loop `size` times:
     - Dequeue node from front
     - Add node's value to current level list
     - Enqueue left child if exists
     - Enqueue right child if exists
   - Add current level list to result
5. **Return Result**: Return the list of all levels

### With Level Tracking

1. Track depth alongside each node in the queue
2. Or process levels and increment depth counter after each level

---

## Implementation

````carousel
```python
from collections import deque
from typing import List, Optional, Tuple

class TreeNode:
    """Definition for a binary tree node."""
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


def level_order(root: Optional[TreeNode]) -> List[List[int]]:
    """
    Perform level-order traversal of binary tree.
    
    Returns nodes grouped by level (left to right).
    
    Args:
        root: Root node of the binary tree
        
    Returns:
        List of lists containing node values at each level
        
    Time: O(n) - each node visited exactly once
    Space: O(w) where w is max width of tree (worst case O(n))
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        current_level = []
        
        # Process all nodes at current level
        for _ in range(level_size):
            node = queue.popleft()
            current_level.append(node.val)
            
            # Enqueue children (left first for left-to-right order)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(current_level)
    
    return result


def level_order_flat(root: Optional[TreeNode]) -> List[int]:
    """Return all values in level-order as a flat list."""
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        node = queue.popleft()
        result.append(node.val)
        
        if node.left:
            queue.append(node.left)
        if node.right:
            queue.append(node.right)
    
    return result


def level_order_with_depth(root: Optional[TreeNode]) -> List[Tuple[int, int]]:
    """Return values with their depth levels."""
    if not root:
        return []
    
    result = []
    queue = deque([(root, 0)])  # (node, depth)
    
    while queue:
        node, depth = queue.popleft()
        result.append((node.val, depth))
        
        if node.left:
            queue.append((node.left, depth + 1))
        if node.right:
            queue.append((node.right, depth + 1))
    
    return result


def level_order_right_view(root: Optional[TreeNode]) -> List[int]:
    """Return the rightmost node at each level (like LeetCode 199)."""
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        
        for i in range(level_size):
            node = queue.popleft()
            
            # Add rightmost node of each level
            if i == level_size - 1:
                result.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return result


def level_order_average(root: Optional[TreeNode]) -> List[float]:
    """Calculate average value at each level (like LeetCode 637)."""
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        level_sum = 0
        
        for _ in range(level_size):
            node = queue.popleft()
            level_sum += node.val
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level_sum / level_size)
    
    return result


# Example usage and demonstration
if __name__ == "__main__":
    # Construct tree:
    #        1
    #       / \
    #      2   3
    #     / \   \
    #    4   5   6
    
    root = TreeNode(1)
    root.left = TreeNode(2)
    root.right = TreeNode(3)
    root.left.left = TreeNode(4)
    root.left.right = TreeNode(5)
    root.right.right = TreeNode(6)
    
    print("Tree Structure:")
    print("       1")
    print("      / \")
    print("     2   3")
    print("    / \   \")
    print("   4   5   6")
    print()
    
    print("Level Order (by level):")
    print(f"  Result: {level_order(root)}")
    
    print("\nLevel Order (flat):")
    print(f"  Result: {level_order_flat(root)}")
    
    print("\nLevel Order (with depth):")
    print(f"  Result: {level_order_with_depth(root)}")
    
    print("\nRight View:")
    print(f"  Result: {level_order_right_view(root)}")
    
    print("\nLevel Averages:")
    print(f"  Result: {level_order_average(root)}")
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <queue>
using namespace std;

/**
 * Definition for a binary tree node.
 */
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

/**
 * Perform level-order traversal of binary tree.
 * Returns nodes grouped by level (left to right).
 * 
 * Time: O(n) - each node visited exactly once
 * Space: O(w) where w is max width of tree (worst case O(n))
 */
vector<vector<int>> levelOrder(TreeNode* root) {
    if (!root) return {};
    
    vector<vector<int>> result;
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        int levelSize = q.size();
        vector<int> currentLevel;
        
        // Process all nodes at current level
        for (int i = 0; i < levelSize; i++) {
            TreeNode* node = q.front();
            q.pop();
            currentLevel.push_back(node->val);
            
            // Enqueue children (left first for left-to-right order)
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        
        result.push_back(currentLevel);
    }
    
    return result;
}

/**
 * Return all values in level-order as a flat list.
 */
vector<int> levelOrderFlat(TreeNode* root) {
    if (!root) return {};
    
    vector<int> result;
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        TreeNode* node = q.front();
        q.pop();
        result.push_back(node->val);
        
        if (node->left) q.push(node->left);
        if (node->right) q.push(node->right);
    }
    
    return result;
}

/**
 * Return the rightmost node at each level (like LeetCode 199).
 */
vector<int> levelOrderRightView(TreeNode* root) {
    if (!root) return {};
    
    vector<int> result;
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        int levelSize = q.size();
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode* node = q.front();
            q.pop();
            
            // Add rightmost node of each level
            if (i == levelSize - 1) {
                result.push_back(node->val);
            }
            
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
    }
    
    return result;
}

/**
 * Calculate average value at each level (like LeetCode 637).
 */
vector<double> levelOrderAverage(TreeNode* root) {
    if (!root) return {};
    
    vector<double> result;
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        int levelSize = q.size();
        long long levelSum = 0;
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode* node = q.front();
            q.pop();
            levelSum += node->val;
            
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        
        result.push_back(static_cast<double>(levelSum) / levelSize);
    }
    
    return result;
}

// Helper function to print result
void printVector(const vector<vector<int>>& result) {
    cout << "[";
    for (size_t i = 0; i < result.size(); i++) {
        cout << "[";
        for (size_t j = 0; j < result[i].size(); j++) {
            cout << result[i][j];
            if (j < result[i].size() - 1) cout << ", ";
        }
        cout << "]";
        if (i < result.size() - 1) cout << ", ";
    }
    cout << "]" << endl;
}

// Example usage
int main() {
    // Construct tree:
    //        1
    //       / \
    //      2   3
    //     / \   \
    //    4   5   6
    
    TreeNode* root = new TreeNode(1);
    root->left = new TreeNode(2);
    root->right = new TreeNode(3);
    root->left->left = new TreeNode(4);
    root->left->right = new TreeNode(5);
    root->right->right = new TreeNode(6);
    
    cout << "Tree Structure:" << endl;
    cout << "       1" << endl;
    cout << "      / \" << endl;
    cout << "     2   3" << endl;
    cout << "    / \   \" << endl;
    cout << "   4   5   6" << endl << endl;
    
    cout << "Level Order (by level):" << endl;
    cout << "  Result: ";
    printVector(levelOrder(root));
    
    cout << "\nLevel Order (flat):" << endl;
    cout << "  Result: [";
    vector<int> flat = levelOrderFlat(root);
    for (size_t i = 0; i < flat.size(); i++) {
        cout << flat[i];
        if (i < flat.size() - 1) cout << ", ";
    }
    cout << "]" << endl;
    
    cout << "\nRight View:" << endl;
    cout << "  Result: [";
    vector<int> rightView = levelOrderRightView(root);
    for (size_t i = 0; i < rightView.size(); i++) {
        cout << rightView[i];
        if (i < rightView.size() - 1) cout << ", ";
    }
    cout << "]" << endl;
    
    // Clean up memory
    delete root->left->left;
    delete root->left->right;
    delete root->left;
    delete root->right->right;
    delete root->right;
    delete root;
    
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

public class LevelOrderTraversal {
    
    /**
     * Perform level-order traversal of binary tree.
     * Returns nodes grouped by level (left to right).
     * 
     * Time: O(n) - each node visited exactly once
     * Space: O(w) where w is max width of tree (worst case O(n))
     */
    public static List<List<Integer>> levelOrder(TreeNode root) {
        List<List<Integer>> result = new ArrayList<>();
        
        if (root == null) {
            return result;
        }
        
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            List<Integer> currentLevel = new ArrayList<>();
            
            // Process all nodes at current level
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                currentLevel.add(node.val);
                
                // Enqueue children (left first for left-to-right order)
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
    
    /**
     * Return all values in level-order as a flat list.
     */
    public static List<Integer> levelOrderFlat(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        
        if (root == null) {
            return result;
        }
        
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            result.add(node.val);
            
            if (node.left != null) {
                queue.offer(node.left);
            }
            if (node.right != null) {
                queue.offer(node.right);
            }
        }
        
        return result;
    }
    
    /**
     * Return the rightmost node at each level (like LeetCode 199).
     */
    public static List<Integer> levelOrderRightView(TreeNode root) {
        List<Integer> result = new ArrayList<>();
        
        if (root == null) {
            return result;
        }
        
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                
                // Add rightmost node of each level
                if (i == levelSize - 1) {
                    result.add(node.val);
                }
                
                if (node.left != null) {
                    queue.offer(node.left);
                }
                if (node.right != null) {
                    queue.offer(node.right);
                }
            }
        }
        
        return result;
    }
    
    /**
     * Calculate average value at each level (like LeetCode 637).
     */
    public static List<Double> levelOrderAverage(TreeNode root) {
        List<Double> result = new ArrayList<>();
        
        if (root == null) {
            return result;
        }
        
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        
        while (!queue.isEmpty()) {
            int levelSize = queue.size();
            long levelSum = 0;
            
            for (int i = 0; i < levelSize; i++) {
                TreeNode node = queue.poll();
                levelSum += node.val;
                
                if (node.left != null) {
                    queue.offer(node.left);
                }
                if (node.right != null) {
                    queue.offer(node.right);
                }
            }
            
            result.add((double) levelSum / levelSize);
        }
        
        return result;
    }
    
    // Helper to print results
    private static void printResult(List<List<Integer>> result) {
        System.out.print("[");
        for (int i = 0; i < result.size(); i++) {
            System.out.print(result.get(i));
            if (i < result.size() - 1) System.out.print(", ");
        }
        System.out.println("]");
    }
    
    // Example usage
    public static void main(String[] args) {
        // Construct tree:
        //        1
        //       / \
        //      2   3
        //     / \   \
        //    4   5   6
        
        TreeNode root = new TreeNode(1);
        root.left = new TreeNode(2);
        root.right = new TreeNode(3);
        root.left.left = new TreeNode(4);
        root.left.right = new TreeNode(5);
        root.right.right = new TreeNode(6);
        
        System.out.println("Tree Structure:");
        System.out.println("       1");
        System.out.println("      / \");
        System.out.println("     2   3");
        System.out.println("    / \   \");
        System.out.println("   4   5   6");
        System.out.println();
        
        System.out.println("Level Order (by level):");
        System.out.print("  Result: ");
        printResult(levelOrder(root));
        
        System.out.println("\nLevel Order (flat):");
        System.out.println("  Result: " + levelOrderFlat(root));
        
        System.out.println("\nRight View:");
        System.out.println("  Result: " + levelOrderRightView(root));
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

/**
 * Perform level-order traversal of binary tree.
 * Returns nodes grouped by level (left to right).
 * 
 * Time: O(n) - each node visited exactly once
 * Space: O(w) where w is max width of tree (worst case O(n))
 * 
 * @param {TreeNode|null} root - Root node of the binary tree
 * @returns {number[][]} Array of arrays containing node values at each level
 */
function levelOrder(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        // Process all nodes at current level
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            currentLevel.push(node.val);
            
            // Enqueue children (left first for left-to-right order)
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
    }
    
    return result;
}

/**
 * Return all values in level-order as a flat list.
 * 
 * @param {TreeNode|null} root - Root node of the binary tree
 * @returns {number[]} Array of all node values in level order
 */
function levelOrderFlat(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const node = queue.shift();
        result.push(node.val);
        
        if (node.left) queue.push(node.left);
        if (node.right) queue.push(node.right);
    }
    
    return result;
}

/**
 * Return values with their depth levels.
 * 
 * @param {TreeNode|null} root - Root node of the binary tree
 * @returns {Array<[number, number]>} Array of [value, depth] tuples
 */
function levelOrderWithDepth(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [[root, 0]];  // [node, depth]
    
    while (queue.length > 0) {
        const [node, depth] = queue.shift();
        result.push([node.val, depth]);
        
        if (node.left) queue.push([node.left, depth + 1]);
        if (node.right) queue.push([node.right, depth + 1]);
    }
    
    return result;
}

/**
 * Return the rightmost node at each level (like LeetCode 199).
 * 
 * @param {TreeNode|null} root - Root node of the binary tree
 * @returns {number[]} Array of rightmost values at each level
 */
function levelOrderRightView(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            
            // Add rightmost node of each level
            if (i === levelSize - 1) {
                result.push(node.val);
            }
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }
    
    return result;
}

/**
 * Calculate average value at each level (like LeetCode 637).
 * 
 * @param {TreeNode|null} root - Root node of the binary tree
 * @returns {number[]} Array of average values per level
 */
function levelOrderAverage(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        let levelSum = 0;
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            levelSum += node.val;
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(levelSum / levelSize);
    }
    
    return result;
}

/**
 * Find maximum width of binary tree (like LeetCode 662).
 * 
 * @param {TreeNode|null} root - Root node of the binary tree
 * @returns {number} Maximum width of the tree
 */
function maxWidth(root) {
    if (!root) return 0;
    
    let maxWidth = 0;
    const queue = [[root, 0]];  // [node, position]
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const startPos = queue[0][1];
        
        for (let i = 0; i < levelSize; i++) {
            const [node, pos] = queue.shift();
            const currentPos = pos - startPos;
            
            if (node.left) queue.push([node.left, currentPos * 2]);
            if (node.right) queue.push([node.right, currentPos * 2 + 1]);
            
            if (i === levelSize - 1) {
                maxWidth = Math.max(maxWidth, currentPos + 1);
            }
        }
    }
    
    return maxWidth;
}


// Example usage and demonstration
function main() {
    // Construct tree:
    //        1
    //       / \
    //      2   3
    //     / \   \
    //    4   5   6
    
    const root = new TreeNode(1);
    root.left = new TreeNode(2);
    root.right = new TreeNode(3);
    root.left.left = new TreeNode(4);
    root.left.right = new TreeNode(5);
    root.right.right = new TreeNode(6);
    
    console.log("Tree Structure:");
    console.log("       1");
    console.log("      / \");
    console.log("     2   3");
    console.log("    / \   \");
    console.log("   4   5   6");
    console.log();
    
    console.log("Level Order (by level):");
    console.log("  Result:", JSON.stringify(levelOrder(root)));
    
    console.log("\nLevel Order (flat):");
    console.log("  Result:", levelOrderFlat(root));
    
    console.log("\nLevel Order (with depth):");
    console.log("  Result:", levelOrderWithDepth(root));
    
    console.log("\nRight View:");
    console.log("  Result:", levelOrderRightView(root));
    
    console.log("\nLevel Averages:");
    console.log("  Result:", levelOrderAverage(root));
    
    console.log("\nMaximum Width:");
    console.log("  Result:", maxWidth(root));
}

// Run example
main();
```
````

---

## Time Complexity Analysis

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Traversal** | O(n) | Each node is visited exactly once |
| **Queue Operations** | O(n) | Each enqueue/dequeue is O(1) |
| **Total** | O(n) | Linear time for complete traversal |

### Detailed Breakdown

- **Visiting nodes**: Each of the n nodes is dequeued exactly once → O(n)
- **Adding children**: Each node's children (0-2) are enqueued at most once → O(n)
- **Level boundary tracking**: Computing queue size for each level → O(h) where h = height

---

## Space Complexity Analysis

| Component | Space Complexity | Description |
|-----------|----------------|-------------|
| **Queue** | O(w) | w = maximum width of tree |
| **Result Storage** | O(n) | Storing all n node values |
| **Total** | O(n) | Worst case (complete binary tree) |

### Space Variations

- **Best Case (skewed tree)**: O(1) - queue holds only one branch
- **Worst Case (complete tree)**: O(n/2) ≈ O(n) - queue holds largest level
- **Average Case**: O(w) where w is typically O(n) for complete binary trees

---

## Common Variations

### 1. Zigzag Level Order (LeetCode 103)

Visit levels alternatively left-to-right and right-to-left.

````carousel
```python
from collections import deque

def zigzag_level_order(root):
    """Spiral/alternating level order traversal."""
    if not root:
        return []
    
    result = []
    queue = deque([root])
    left_to_right = True
    
    while queue:
        level_size = len(queue)
        current_level = deque()  # Use deque for efficient prepend
        
        for _ in range(level_size):
            node = queue.popleft()
            
            if left_to_right:
                current_level.append(node.val)
            else:
                current_level.appendleft(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(list(current_level))
        left_to_right = not left_to_right
    
    return result
```

<!-- slide -->
```cpp
#include <vector>
#include <queue>
#include <deque>
using namespace std;

vector<vector<int>> zigzagLevelOrder(TreeNode* root) {
    if (!root) return {};
    
    vector<vector<int>> result;
    queue<TreeNode*> q;
    q.push(root);
    bool leftToRight = true;
    
    while (!q.empty()) {
        int levelSize = q.size();
        deque<int> currentLevel;
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode* node = q.front();
            q.pop();
            
            if (leftToRight) {
                currentLevel.push_back(node->val);
            } else {
                currentLevel.push_front(node->val);
            }
            
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
        
        result.push_back(vector<int>(currentLevel.begin(), currentLevel.end()));
        leftToRight = !leftToRight;
    }
    
    return result;
}
```

<!-- slide -->
```java
import java.util.*;

public List<List<Integer>> zigzagLevelOrder(TreeNode root) {
    List<List<Integer>> result = new ArrayList<>();
    if (root == null) return result;
    
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    boolean leftToRight = true;
    
    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        LinkedList<Integer> currentLevel = new LinkedList<>();
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.poll();
            
            if (leftToRight) {
                currentLevel.addLast(node.val);
            } else {
                currentLevel.addFirst(node.val);
            }
            
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
        
        result.add(currentLevel);
        leftToRight = !leftToRight;
    }
    
    return result;
}
```

<!-- slide -->
```javascript
function zigzagLevelOrder(root) {
    if (!root) return [];
    
    const result = [];
    const queue = [root];
    let leftToRight = true;
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        const currentLevel = [];
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            
            if (leftToRight) {
                currentLevel.push(node.val);
            } else {
                currentLevel.unshift(node.val);
            }
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
        
        result.push(currentLevel);
        leftToRight = !leftToRight;
    }
    
    return result;
}
```
````

### 2. Level Order with Null Markers (LeetCode 297)

Serialize and deserialize tree with level order using null markers.

````carousel
```python
from collections import deque

def serialize(root):
    """Encode tree to string using level order with null markers."""
    if not root:
        return ""
    
    queue = deque([root])
    result = []
    
    while queue:
        node = queue.popleft()
        
        if node:
            result.append(str(node.val))
            queue.append(node.left)
            queue.append(node.right)
        else:
            result.append("null")
    
    return ",".join(result)

def deserialize(data):
    """Decode string to tree using level order with null markers."""
    if not data:
        return None
    
    values = data.split(",")
    root = TreeNode(int(values[0]))
    queue = deque([root])
    i = 1
    
    while queue and i < len(values):
        node = queue.popleft()
        
        if values[i] != "null":
            node.left = TreeNode(int(values[i]))
            queue.append(node.left)
        i += 1
        
        if i < len(values) and values[i] != "null":
            node.right = TreeNode(int(values[i]))
            queue.append(node.right)
        i += 1
    
    return root
```

<!-- slide -->
```cpp
#include <sstream>

string serialize(TreeNode* root) {
    if (!root) return "";
    
    string result;
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        TreeNode* node = q.front();
        q.pop();
        
        if (node) {
            result += to_string(node->val) + ",";
            q.push(node->left);
            q.push(node->right);
        } else {
            result += "null,";
        }
    }
    
    // Remove trailing comma
    if (!result.empty()) result.pop_back();
    return result;
}

TreeNode* deserialize(string data) {
    if (data.empty()) return nullptr;
    
    stringstream ss(data);
    string val;
    getline(ss, val, ',');
    
    TreeNode* root = new TreeNode(stoi(val));
    queue<TreeNode*> q;
    q.push(root);
    
    while (!q.empty()) {
        TreeNode* node = q.front();
        q.pop();
        
        if (getline(ss, val, ',')) {
            if (val != "null") {
                node->left = new TreeNode(stoi(val));
                q.push(node->left);
            }
        }
        
        if (getline(ss, val, ',')) {
            if (val != "null") {
                node->right = new TreeNode(stoi(val));
                q.push(node->right);
            }
        }
    }
    
    return root;
}
```

<!-- slide -->
```java
public String serialize(TreeNode root) {
    if (root == null) return "";
    
    StringBuilder sb = new StringBuilder();
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    
    while (!queue.isEmpty()) {
        TreeNode node = queue.poll();
        
        if (node != null) {
            sb.append(node.val).append(",");
            queue.offer(node.left);
            queue.offer(node.right);
        } else {
            sb.append("null,");
        }
    }
    
    return sb.toString();
}

public TreeNode deserialize(String data) {
    if (data.isEmpty()) return null;
    
    String[] values = data.split(",");
    TreeNode root = new TreeNode(Integer.parseInt(values[0]));
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    int i = 1;
    
    while (!queue.isEmpty() && i < values.length) {
        TreeNode node = queue.poll();
        
        if (!values[i].equals("null")) {
            node.left = new TreeNode(Integer.parseInt(values[i]));
            queue.offer(node.left);
        }
        i++;
        
        if (i < values.length && !values[i].equals("null")) {
            node.right = new TreeNode(Integer.parseInt(values[i]));
            queue.offer(node.right);
        }
        i++;
    }
    
    return root;
}
```

<!-- slide -->
```javascript
function serialize(root) {
    if (!root) return "";
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const node = queue.shift();
        
        if (node) {
            result.push(node.val);
            queue.push(node.left);
            queue.push(node.right);
        } else {
            result.push("null");
        }
    }
    
    return result.join(",");
}

function deserialize(data) {
    if (!data) return null;
    
    const values = data.split(",");
    const root = new TreeNode(parseInt(values[0]));
    const queue = [root];
    let i = 1;
    
    while (queue.length > 0 && i < values.length) {
        const node = queue.shift();
        
        if (values[i] !== "null") {
            node.left = new TreeNode(parseInt(values[i]));
            queue.push(node.left);
        }
        i++;
        
        if (i < values.length && values[i] !== "null") {
            node.right = new TreeNode(parseInt(values[i]));
            queue.push(node.right);
        }
        i++;
    }
    
    return root;
}
```
````

### 3. Connect Level Order Siblings (LeetCode 116/117)

Connect each node to its next right neighbor at the same level.

````carousel
```python
from collections import deque

def connect_siblings(root):
    """Connect each node to its next right sibling."""
    if not root:
        return root
    
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        prev = None
        
        for i in range(level_size):
            node = queue.popleft()
            
            if prev:
                prev.next = node
            prev = node
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return root
```

<!-- slide -->
```cpp
Node* connect(Node* root) {
    if (!root) return nullptr;
    
    queue<Node*> q;
    q.push(root);
    
    while (!q.empty()) {
        int levelSize = q.size();
        Node* prev = nullptr;
        
        for (int i = 0; i < levelSize; i++) {
            Node* node = q.front();
            q.pop();
            
            if (prev) {
                prev->next = node;
            }
            prev = node;
            
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
    }
    
    return root;
}
```

<!-- slide -->
```java
public Node connect(Node root) {
    if (root == null) return null;
    
    Queue<Node> queue = new LinkedList<>();
    queue.offer(root);
    
    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        Node prev = null;
        
        for (int i = 0; i < levelSize; i++) {
            Node node = queue.poll();
            
            if (prev != null) {
                prev.next = node;
            }
            prev = node;
            
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
    }
    
    return root;
}
```

<!-- slide -->
```javascript
function connect(root) {
    if (!root) return null;
    
    const queue = [root];
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        let prev = null;
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            
            if (prev) {
                prev.next = node;
            }
            prev = node;
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }
    
    return root;
}
```
````

### 4. Deepest Leaves Sum (LeetCode 1302)

Find sum of values at the deepest level.

````carousel
```python
from collections import deque

def deepest_leaves_sum(root):
    """Find sum of all deepest leaves."""
    if not root:
        return 0
    
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        level_sum = 0
        
        for _ in range(level_size):
            node = queue.popleft()
            level_sum += node.val
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return level_sum
```

<!-- slide -->
```cpp
int deepestLeavesSum(TreeNode* root) {
    if (!root) return 0;
    
    queue<TreeNode*> q;
    q.push(root);
    int levelSum = 0;
    
    while (!q.empty()) {
        int levelSize = q.size();
        levelSum = 0;
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode* node = q.front();
            q.pop();
            levelSum += node->val;
            
            if (node->left) q.push(node->left);
            if (node->right) q.push(node->right);
        }
    }
    
    return levelSum;
}
```

<!-- slide -->
```java
public int deepestLeavesSum(TreeNode root) {
    if (root == null) return 0;
    
    Queue<TreeNode> queue = new LinkedList<>();
    queue.offer(root);
    int levelSum = 0;
    
    while (!queue.isEmpty()) {
        int levelSize = queue.size();
        levelSum = 0;
        
        for (int i = 0; i < levelSize; i++) {
            TreeNode node = queue.poll();
            levelSum += node.val;
            
            if (node.left != null) queue.offer(node.left);
            if (node.right != null) queue.offer(node.right);
        }
    }
    
    return levelSum;
}
```

<!-- slide -->
```javascript
function deepestLeavesSum(root) {
    if (!root) return 0;
    
    const queue = [root];
    let levelSum = 0;
    
    while (queue.length > 0) {
        const levelSize = queue.length;
        levelSum = 0;
        
        for (let i = 0; i < levelSize; i++) {
            const node = queue.shift();
            levelSum += node.val;
            
            if (node.left) queue.push(node.left);
            if (node.right) queue.push(node.right);
        }
    }
    
    return levelSum;
}
```
````

### 5. Minimum Depth (LeetCode 111)

Find the shortest path from root to a leaf.

````carousel
```python
from collections import deque

def min_depth(root):
    """Find minimum depth of binary tree."""
    if not root:
        return 0
    
    queue = deque([(root, 1)])
    
    while queue:
        node, depth = queue.popleft()
        
        # First leaf encountered is at minimum depth
        if not node.left and not node.right:
            return depth
        
        if node.left:
            queue.append((node.left, depth + 1))
        if node.right:
            queue.append((node.right, depth + 1))
    
    return 0
```

<!-- slide -->
```cpp
int minDepth(TreeNode* root) {
    if (!root) return 0;
    
    queue<pair<TreeNode*, int>> q;
    q.push({root, 1});
    
    while (!q.empty()) {
        auto [node, depth] = q.front();
        q.pop();
        
        // First leaf encountered is at minimum depth
        if (!node->left && !node->right) {
            return depth;
        }
        
        if (node->left) q.push({node->left, depth + 1});
        if (node->right) q.push({node->right, depth + 1});
    }
    
    return 0;
}
```

<!-- slide -->
```java
public int minDepth(TreeNode root) {
    if (root == null) return 0;
    
    Queue<Pair<TreeNode, Integer>> queue = new LinkedList<>();
    queue.offer(new Pair<>(root, 1));
    
    while (!queue.isEmpty()) {
        Pair<TreeNode, Integer> pair = queue.poll();
        TreeNode node = pair.getKey();
        int depth = pair.getValue();
        
        // First leaf encountered is at minimum depth
        if (node.left == null && node.right == null) {
            return depth;
        }
        
        if (node.left != null) {
            queue.offer(new Pair<>(node.left, depth + 1));
        }
        if (node.right != null) {
            queue.offer(new Pair<>(node.right, depth + 1));
        }
    }
    
    return 0;
}
```

<!-- slide -->
```javascript
function minDepth(root) {
    if (!root) return 0;
    
    const queue = [[root, 1]];
    
    while (queue.length > 0) {
        const [node, depth] = queue.shift();
        
        // First leaf encountered is at minimum depth
        if (!node.left && !node.right) {
            return depth;
        }
        
        if (node.left) queue.push([node.left, depth + 1]);
        if (node.right) queue.push([node.right, depth + 1]);
    }
    
    return 0;
}
```
````

---

## Practice Problems

### Problem 1: Binary Tree Level Order Traversal

**Problem:** [LeetCode 102 - Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/)

**Description:** Given the root of a binary tree, return the level order traversal of its nodes' values (i.e., from left to right, level by level).

**How to Apply BFS Level Order:**
- Use the standard BFS pattern with queue
- Track level size at each iteration
- Group nodes by their level in the result

---

### Problem 2: Binary Tree Right Side View

**Problem:** [LeetCode 199 - Binary Tree Right Side View](https://leetcode.com/problems/binary-tree-right-side-view/)

**Description:** Given the root of a binary tree, imagine yourself standing on the right side of it. Return the values of the nodes you can see ordered from top to bottom.

**How to Apply BFS Level Order:**
- Use BFS to traverse level by level
- Capture the last node value at each level (rightmost)
- This directly gives the right side view

---

### Problem 3: Maximum Width of Binary Tree

**Problem:** [LeetCode 662 - Maximum Width of Binary Tree](https://leetcode.com/problems/maximum-width-of-binary-tree/)

**Description:** Given the root of a binary tree, return the maximum width of the given tree. The maximum width of a tree is the maximum width among all levels.

**How to Apply BFS Level Order:**
- Use BFS with position tracking for each node
- Assign positions: left child = position * 2, right child = position * 2 + 1
- Width = rightmost_position - leftmost_position + 1
- Use long integers to avoid overflow for deep trees

---

### Problem 4: Average of Levels in Binary Tree

**Problem:** [LeetCode 637 - Average of Levels in Binary Tree](https://leetcode.com/problems/average-of-levels-in-binary-tree/)

**Description:** Given the root of a binary tree, return the average value of the nodes on each level in the form of an array.

**How to Apply BFS Level Order:**
- Use BFS to process level by level
- Accumulate sum of all values at each level
- Divide by level size to get average
- Return array of averages

---

### Problem 5: Populating Next Right Pointers in Each Node

**Problem:** [LeetCode 116 - Populating Next Right Pointers in Each Node](https://leetcode.com/problems/populating-next-right-pointers-in-each-node/)

**Description:** You are given a perfect binary tree where all leaves are on the same level, and every parent has two children. Populate each next pointer to point to its next right node.

**How to Apply BFS Level Order:**
- Use BFS level order traversal
- Connect each node to the next node at the same level
- Use the previously processed node to set up the connection

---

## Video Tutorial Links

### Fundamentals

- [BFS Level Order Traversal (Take U Forward)](https://www.youtube.com/watch?v=3QZJ7T0J5Qk) - Comprehensive introduction to BFS
- [Binary Tree Level Order Traversal (NeetCode)](https://www.youtube.com/watch?v=U7V0qJ9x-78) - Practical implementation guide
- [BFS vs DFS (WilliamFiset)](https://www.youtube.com/watch?v=oHWzG6ivqvU) - When to use which traversal

### Problem-Specific

- [LeetCode 102 Solution](https://www.youtube.com/watch?v=5_02ws-cekg) - Level order traversal
- [LeetCode 199 Solution](https://www.youtube.com/watch?v=TmZW1t2c7wE) - Right side view
- [LeetCode 662 Solution](https://www.youtube.com/watch?v=7y2GPJ0YGEE) - Maximum width

### Advanced Topics

- [BFS on Graphs](https://www.youtube.com/watch?v=4G1L6dX4q6s) - BFS for graph traversal
- [Binary Tree Serialization](https://www.youtube.com/watch?v=R-6eTFv-XfI) - Level order encoding

---

## Follow-up Questions

### Q1: What is the difference between BFS and DFS for tree traversal?

**Answer:** 
- **BFS (Level Order)**: Uses a queue, visits nodes level by level. Good for shortest path, level statistics, and when closer nodes should be processed first. Space complexity is O(w) where w is maximum width.
- **DFS**: Uses recursion/stack, visits depth-first. Good for path finding, tree construction, and when memory is limited. Space complexity is O(h) where h is height.

### Q2: Can BFS be implemented recursively?

**Answer:** BFS is inherently iterative due to the queue data structure. However, you can simulate BFS using recursion with explicit stack or by using level-order DFS (visiting levels recursively). The iterative approach with an explicit queue is the standard and most efficient implementation.

### Q3: How do you handle very wide trees in BFS?

**Answer:** 
- For extremely wide trees, consider using a vector/list instead of standard queue to reduce memory overhead
- Use position indexing instead of storing actual node references
- Consider processing levels in chunks for very large trees
- Use long integers for position tracking to avoid overflow

### Q4: When should you use BFS over DFS for trees?

**Answer:** Use BFS when:
- Finding shortest path in unweighted tree/graph
- Need level-by-level results or statistics
- Tree width is important (max width problems)
- Processing order should prioritize shallower nodes

Use DFS when:
- Finding all paths or specific path requirements
- Memory is limited (deep trees)
- Recursive solution is cleaner for the problem

### Q5: How does BFS handle null children in complete binary trees?

**Answer:** 
- In complete binary trees, you can use array representation where index i has children at 2i+1 and 2i+2
- For general binary trees, explicitly check for null before adding to queue
- For serialization purposes, use special markers (like "null" or "#") to preserve tree structure

---

## Summary

BFS Level Order Traversal is a fundamental algorithm for tree and graph problems. Key takeaways:

- **Queue-based**: Uses FIFO property to process nodes level by level
- **O(n) time**: Each node visited exactly once
- **O(w) space**: Queue holds at most one level (max width)
- **Versatile**: Forms basis for many tree problems

When to use:
- ✅ Level-by-level traversal or statistics
- ✅ Shortest path in unweighted structures  
- ✅ Tree width calculations
- ✅ Level-order serialization
- ❌ Deep trees with limited memory (use DFS instead)
- ❌ Problems requiring path exploration (use DFS)

This algorithm is essential for competitive programming and technical interviews, particularly in problems involving binary trees, graph traversal, and shortest path calculations.

---

## Related Algorithms

- [Graph BFS](./graph-bfs.md) - BFS on general graphs
- [Graph DFS](./graph-dfs.md) - DFS on general graphs
- [Binary Lifting](./binary-lifting.md) - Advanced tree queries
- [Tree DFS Preorder](./tree-dfs-recursive-preorder-traversal.md) - Depth-first traversal
