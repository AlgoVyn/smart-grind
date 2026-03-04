# Lowest Common Ancestor

## Category
Trees & BSTs

## Description

The Lowest Common Ancestor (LCA) of two nodes in a binary tree is the deepest node that has both nodes as descendants (where a node is also a descendant of itself). This is a fundamental problem in tree data structures with applications in path finding, tree traversals, and hierarchical relationship queries.

---

## When to Use

Use the Lowest Common Ancestor algorithm when you need to solve problems involving:

- **Tree Ancestor Queries**: Finding the common parent of two nodes in a hierarchy
- **Path-Related Problems**: When paths from root to nodes need to be compared
- **Hierarchical Relationships**: Managing parent-child or ancestor-descendant relationships
- **Binary Search Trees**: Leveraging BST properties for efficient lookups
- **Graph Relationships**: Finding nearest common ancestor in any tree structure

### Comparison with Alternatives

| Approach | Time Complexity | Space Complexity | Use Case |
|----------|----------------|------------------|----------|
| **Naive Recursion** | O(n) | O(h) | Simple cases, small trees |
| **Path Comparison** | O(n) | O(h) | When parent pointers unavailable |
| **Parent + HashSet** | O(n) | O(h) | When parent pointers exist |
| **Binary Lifting** | O(n log n) build, O(log n) query | O(n log n) | Multiple LCA queries |
| **BST Optimization** | O(h) | O(1) | Binary Search Trees only |
| **Euler Tour + RMQ** | O(n) build, O(1) query | O(n) | Many queries, static tree |

### When to Choose Each Approach

- **Choose Naive Recursion** when:
  - Tree is small and simple
  - Only single LCA query needed
  - Code simplicity is preferred

- **Choose Binary Lifting** when:
  - Multiple LCA queries on same tree
  - Preprocessing time is acceptable
  - Need O(log n) per query

- **Choose BST Optimization** when:
  - Working with Binary Search Tree
  - Need O(h) time complexity
  - Can leverage ordered property

- **Choose Euler Tour + RMQ** when:
  - Many LCA queries needed
  - Tree structure is static
  - Need O(1) query time

---

## Algorithm Explanation

### Core Concept

The key insight behind finding the Lowest Common Ancestor is understanding that the LCA is the point where the paths from the root to each target node diverge. Before this point, both nodes share the same ancestors; after this point, they are in different subtrees.

**Key Insight:** If we traverse from both nodes upward, they will first meet at their lowest common ancestor. This is because:
- Each node is its own ancestor
- Moving upward from any node eventually reaches the root
- The first common node encountered is the deepest (lowest) one

### How It Works

#### Recursive Approach:
1. Start at the root
2. If current node is null, one of targets, or equals either target → return current
3. Recurse on left subtree to find LCA of targets
4. Recurse on right subtree to find LCA of targets
5. If both left and right return non-null, current node is LCA
6. Otherwise, return whichever is non-null

#### Path Comparison Approach:
1. Find path from root to first node
2. Find path from root to second node
3. Compare paths to find the last common node

#### Binary Lifting Approach:
1. Precompute 2^k ancestors for each node
2. Lift both nodes to same depth
3. Lift both nodes together until they meet
4. The meeting point is the LCA

### Visual Representation

For the tree:
```
        3
       / \
      5   1
     / \ / \
    6  2 0  8
      / \
     7   4
```

Finding LCA of nodes 5 and 1:
- Path to 5: 3 → 5
- Path to 1: 3 → 1
- Common ancestors: {3}
- LCA = 3

Finding LCA of nodes 5 and 4:
- Path to 5: 3 → 5
- Path to 4: 3 → 5 → 2 → 4
- Common ancestors: {3, 5}
- LCA = 5 (lowest/deepest)

### Why the Recursive Approach Works

The recursive solution leverages the tree structure:
- If both p and q are in the left subtree, the left recursion returns their LCA
- If both are in the right subtree, the right recursion returns their LCA
- If they're in different subtrees, the current node is where paths diverge → LCA
- If current node is one of the targets, it's an ancestor of the other → LCA

### Special Case - Binary Search Trees

For BSTs, we can use the ordering property:
- If both p and q are less than current, LCA is in left subtree
- If both p and q are greater than current, LCA is in right subtree
- Otherwise, current is the LCA (p and q are on different sides)

---

## Algorithm Steps

### Approach 1: Recursive (Most Common)

1. **Base Case**: If root is null or equals p or q, return root
2. **Recurse Left**: Find LCA in left subtree
3. **Recurse Right**: Find LCA in right subtree
4. **Combine Results**:
   - If both left and right are non-null → current is LCA
   - Otherwise return whichever is non-null

### Approach 2: Path Comparison

1. **Find Path to P**: Traverse from root, storing path when P is found
2. **Find Path to Q**: Traverse from root, storing path when Q is found
3. **Compare Paths**: Iterate through both paths, last common node is LCA

### Approach 3: Binary Lifting (Multiple Queries)

1. **Preprocessing**:
   - Compute depth of each node
   - Build ancestor table where table[node][k] = 2^k ancestor
2. **Equalize Depth**: Lift deeper node up to same level
3. **Find LCA**: Lift both nodes together from highest power down

### Approach 4: BST Optimization

1. Start at root
2. If both p and q < current.val → go left
3. If both p and q > current.val → go right
4. Otherwise → return current

---

## Implementation

### Template Code (Multiple Approaches)

````carousel
```python
from typing import Optional, List


class TreeNode:
    """Definition for a binary tree node."""
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right


# ============================================================
# Approach 1: Recursive (Most Common - Single Query)
# ============================================================

def lowest_common_ancestor(root: Optional[TreeNode], 
                           p: TreeNode, 
                           q: TreeNode) -> Optional[TreeNode]:
    """
    Find the lowest common ancestor of two nodes in a binary tree.
    
    Args:
        root: Root of the binary tree
        p: First node
        q: Second node
        
    Returns:
        LCA node or None
        
    Time: O(n)
    Space: O(h) - recursion stack depth
    """
    # Base case: reached null or found one of the nodes
    if not root or root == p or root == q:
        return root
    
    # Recurse on left and right subtrees
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    
    # If both sides return non-null, current is LCA
    if left and right:
        return root
    
    # Return whichever is non-null (or None)
    return left or right


# ============================================================
# Approach 2: Path Comparison
# ============================================================

def find_path(root: TreeNode, target: TreeNode, path: List[TreeNode]) -> bool:
    """Find path from root to target node."""
    if not root:
        return False
    
    path.append(root)
    
    if root == target:
        return True
    
    if find_path(root.left, target, path) or find_path(root.right, target, path):
        return True
    
    path.pop()
    return False


def lowest_common_ancestor_path(root: TreeNode, 
                                p: TreeNode, 
                                q: TreeNode) -> Optional[TreeNode]:
    """
    Find LCA using path comparison.
    
    Time: O(n)
    Space: O(h)
    """
    path_p, path_q = [], []
    
    find_path(root, p, path_p)
    find_path(root, q, path_q)
    
    # Find last common node in both paths
    lca = None
    for i in range(min(len(path_p), len(path_q))):
        if path_p[i] == path_q[i]:
            lca = path_p[i]
        else:
            break
    
    return lca


# ============================================================
# Approach 3: Binary Lifting (Multiple Queries)
# ============================================================

class BinaryLiftingLCA:
    """
    LCA with O(n log n) preprocessing and O(log n) per query.
    Best for multiple LCA queries on the same tree.
    """
    
    def __init__(self, root: TreeNode):
        self.n = self._count_nodes(root)
        self.LOG = (self.n).bit_length()
        
        # Depth of each node
        self.depth = [0] * (self.n + 1)
        
        # Binary lifting table: up[node][k] = 2^k ancestor
        self.up = [[-1] * self.LOG for _ in range(self.n + 1)]
        
        self._dfs(root, 0, -1)
    
    def _count_nodes(self, root: TreeNode) -> int:
        if not root:
            return 0
        return 1 + self._count_nodes(root.left) + self._count_nodes(root.right)
    
    def _dfs(self, node: TreeNode, depth: int, parent: int):
        """DFS to compute depth and ancestors."""
        node_id = id(node)
        self.depth[node_id] = depth
        self.up[node_id][0] = parent
        
        for k in range(1, self.LOG):
            if self.up[node_id][k-1] != -1:
                self.up[node_id][k] = self.up[self.up[node_id][k-1]][k-1]
        
        if node.left:
            self._dfs(node.left, depth + 1, node_id)
        if node.right:
            self._dfs(node.right, depth + 1, node_id)
    
    def lca(self, u: TreeNode, v: TreeNode) -> TreeNode:
        """Find LCA of nodes u and v in O(log n)."""
        u_id, v_id = id(u), id(v)
        
        # Ensure u is deeper
        if self.depth[u_id] < self.depth[v_id]:
            u_id, v_id = v_id, u_id
        
        # Lift u to depth of v
        diff = self.depth[u_id] - self.depth[v_id]
        for k in range(self.LOG):
            if diff & (1 << k):
                u_id = self.up[u_id][k]
        
        if u_id == v_id:
            return u
        
        # Lift both nodes together
        for k in range(self.LOG - 1, -1, -1):
            if self.up[u_id][k] != self.up[v_id][k]:
                u_id = self.up[u_id][k]
                v_id = self.up[v_id][k]
        
        return self.up[u_id][0]


# ============================================================
# Approach 4: Binary Search Tree Optimization
# ============================================================

def lowest_common_ancestor_bst(root: Optional[TreeNode], 
                               p: TreeNode, 
                               q: TreeNode) -> Optional[TreeNode]:
    """
    Find LCA in a Binary Search Tree using BST property.
    
    Time: O(h) where h is height
    Space: O(1) - iterative version
    """
    if not root or not p or not q:
        return None
    
    current = root
    
    while current:
        if p.val < current.val and q.val < current.val:
            # Both in left subtree
            current = current.left
        elif p.val > current.val and q.val > current.val:
            # Both in right subtree
            current = current.right
        else:
            # Nodes on different sides - this is LCA
            return current
    
    return None


# ============================================================
# Approach 5: Parent Pointers + HashSet
# ============================================================

def lowest_common_ancestor_with_parent(p: TreeNode, q: TreeNode) -> Optional[TreeNode]:
    """
    Find LCA assuming nodes have parent pointers.
    
    Time: O(h)
    Space: O(h) - for ancestor set
    """
    ancestors = set()
    
    # Collect all ancestors of p
    while p:
        ancestors.add(p)
        p = p.parent
    
    # Find first ancestor of q that's also in p's ancestors
    while q:
        if q in ancestors:
            return q
        q = q.parent
    
    return None


# ============================================================
# Example Usage and Testing
# ============================================================

if __name__ == "__main__":
    # Build example tree:
    #         3
    #        / \
    #       5   1
    #      / \ / \
    #     6  2 0  8
    #       / \
    #      7   4
    
    root = TreeNode(3)
    root.left = TreeNode(5)
    root.right = TreeNode(1)
    root.left.left = TreeNode(6)
    root.left.right = TreeNode(2)
    root.right.left = TreeNode(0)
    root.right.right = TreeNode(8)
    root.left.right.left = TreeNode(7)
    root.left.right.right = TreeNode(4)
    
    # Test cases
    p, q = root.left, root.right  # 5 and 1
    result = lowest_common_ancestor(root, p, q)
    print(f"LCA of {p.val} and {q.val}: {result.val}")  # Expected: 3
    
    p, q = root.left.left, root.left.right.right  # 6 and 4
    result = lowest_common_ancestor(root, p, q)
    print(f"LCA of {p.val} and {q.val}: {result.val}")  # Expected: 5
    
    # Test BST version
    # BST:
    #       6
    #      / \
    #     2   8
    #    / \
    #   1   4
    #      / \
    #     3   5
    
    bst_root = TreeNode(6)
    bst_root.left = TreeNode(2)
    bst_root.right = TreeNode(8)
    bst_root.left.left = TreeNode(1)
    bst_root.left.right = TreeNode(4)
    bst_root.left.right.left = TreeNode(3)
    bst_root.left.right.right = TreeNode(5)
    
    p, q = bst_root.left, bst_root.left.right  # 2 and 4
    result = lowest_common_ancestor_bst(bst_root, p, q)
    print(f"BST LCA of {p.val} and {q.val}: {result.val}")  # Expected: 2
```

<!-- slide -->
```cpp
#include <iostream>
#include <vector>
#include <unordered_set>
#include <cmath>
using namespace std;

/**
 * TreeNode definition for binary tree.
 */
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode* parent;  // Optional, for parent pointer approach
    
    TreeNode(int x) : val(x), left(nullptr), right(nullptr), parent(nullptr) {}
};


// ============================================================
// Approach 1: Recursive (Most Common - Single Query)
// ============================================================

/**
 * Find the lowest common ancestor of two nodes in a binary tree.
 * 
 * Time: O(n)
 * Space: O(h) - recursion stack depth
 */
TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
    // Base case: reached null or found one of the nodes
    if (!root || root == p || root == q) {
        return root;
    }
    
    // Recurse on left and right subtrees
    TreeNode* left = lowestCommonAncestor(root->left, p, q);
    TreeNode* right = lowestCommonAncestor(root->right, p, q);
    
    // If both sides return non-null, current is LCA
    if (left && right) {
        return root;
    }
    
    // Return whichever is non-null (or nullptr)
    return left ? left : right;
}


// ============================================================
// Approach 2: Path Comparison
// ============================================================

bool findPath(TreeNode* root, TreeNode* target, vector<TreeNode*>& path) {
    if (!root) return false;
    
    path.push_back(root);
    
    if (root == target) return true;
    
    if (findPath(root->left, target, path) || findPath(root->right, target, path)) {
        return true;
    }
    
    path.pop_back();
    return false;
}

TreeNode* lowestCommonAncestorPath(TreeNode* root, TreeNode* p, TreeNode* q) {
    vector<TreeNode*> pathP, pathQ;
    
    findPath(root, p, pathP);
    findPath(root, q, pathQ);
    
    // Find last common node in both paths
    TreeNode* lca = nullptr;
    for (size_t i = 0; i < min(pathP.size(), pathQ.size()); i++) {
        if (pathP[i] == pathQ[i]) {
            lca = pathP[i];
        } else {
            break;
        }
    }
    
    return lca;
}


// ============================================================
// Approach 3: Binary Lifting (Multiple Queries)
// ============================================================

class BinaryLiftingLCA {
private:
    vector<vector<int>> up;  // up[node][k] = 2^k ancestor
    vector<int> depth;
    int LOG;
    int n;

public:
    BinaryLiftingLCA(TreeNode* root) {
        n = countNodes(root);
        LOG = (int)log2(n) + 1;
        
        depth.resize(n + 1);
        up.assign(n + 1, vector<int>(LOG, -1));
        
        // We need to map node pointers to indices
        // For simplicity, using pointer address as ID (in practice, use mapping)
        dfs(root, 0, -1);
    }
    
    int countNodes(TreeNode* root) {
        if (!root) return 0;
        return 1 + countNodes(root->left) + countNodes(root->right);
    }
    
    void dfs(TreeNode* node, int d, int parent) {
        if (!node) return;
        
        int id = (int)(size_t)node;
        depth[id] = d;
        up[id][0] = parent;
        
        for (int k = 1; k < LOG; k++) {
            if (up[id][k-1] != -1) {
                up[id][k] = up[up[id][k-1]][k-1];
            }
        }
        
        dfs(node->left, d + 1, id);
        dfs(node->right, d + 1, id);
    }
    
    TreeNode* lca(TreeNode* u, TreeNode* v) {
        int u_id = (int)(size_t)u;
        int v_id = (int)(size_t)v;
        
        if (depth[u_id] < depth[v_id]) {
            swap(u_id, v_id);
        }
        
        // Lift u to depth of v
        int diff = depth[u_id] - depth[v_id];
        for (int k = 0; k < LOG; k++) {
            if (diff & (1 << k)) {
                u_id = up[u_id][k];
            }
        }
        
        if (u_id == v_id) {
            return u;
        }
        
        // Lift both nodes together
        for (int k = LOG - 1; k >= 0; k--) {
            if (up[u_id][k] != up[v_id][k]) {
                u_id = up[u_id][k];
                v_id = up[v_id][k];
            }
        }
        
        return (TreeNode*)(size_t)up[u_id][0];
    }
};


// ============================================================
// Approach 4: Binary Search Tree Optimization
// ============================================================

/**
 * Find LCA in a Binary Search Tree using BST property.
 * 
 * Time: O(h) where h is height
 * Space: O(1)
 */
TreeNode* lowestCommonAncestorBST(TreeNode* root, TreeNode* p, TreeNode* q) {
    if (!root || !p || !q) return nullptr;
    
    TreeNode* current = root;
    
    while (current) {
        if (p->val < current->val && q->val < current->val) {
            current = current->left;
        } else if (p->val > current->val && q->val > current->val) {
            current = current->right;
        } else {
            // Nodes on different sides - this is LCA
            return current;
        }
    }
    
    return nullptr;
}


// ============================================================
// Approach 5: Parent Pointers + HashSet
// ============================================================

TreeNode* lowestCommonAncestorWithParent(TreeNode* p, TreeNode* q) {
    unordered_set<TreeNode*> ancestors;
    
    // Collect all ancestors of p
    while (p) {
        ancestors.insert(p);
        p = p->parent;
    }
    
    // Find first ancestor of q that's also in p's ancestors
    while (q) {
        if (ancestors.find(q) != ancestors.end()) {
            return q;
        }
        q = q->parent;
    }
    
    return nullptr;
}


// ============================================================
// Main - Example Usage
// ============================================================

int main() {
    // Build example tree:
    //         3
    //        / \
    //       5   1
    //      / \ / \
    //     6  2 0  8
    //       / \
    //      7   4
    
    TreeNode* root = new TreeNode(3);
    root->left = new TreeNode(5);
    root->right = new TreeNode(1);
    root->left->left = new TreeNode(6);
    root->left->right = new TreeNode(2);
    root->right->left = new TreeNode(0);
    root->right->right = new TreeNode(8);
    root->left->right->left = new TreeNode(7);
    root->left->right->right = new TreeNode(4);
    
    // Test recursive approach
    TreeNode* result = lowestCommonAncestor(root, root->left, root->right);
    cout << "LCA of 5 and 1: " << result->val << endl;  // Expected: 3
    
    result = lowestCommonAncestor(root, root->left->left, root->left->right->right);
    cout << "LCA of 6 and 4: " << result->val << endl;  // Expected: 5
    
    // Test BST version
    TreeNode* bstRoot = new TreeNode(6);
    bstRoot->left = new TreeNode(2);
    bstRoot->right = new TreeNode(8);
    bstRoot->left->left = new TreeNode(1);
    bstRoot->left->right = new TreeNode(4);
    bstRoot->left->right->left = new TreeNode(3);
    bstRoot->left->right->right = new TreeNode(5);
    
    result = lowestCommonAncestorBST(bstRoot, bstRoot->left, bstRoot->left->right);
    cout << "BST LCA of 2 and 4: " << result->val << endl;  // Expected: 2
    
    return 0;
}
```

<!-- slide -->
```java
import java.util.*;


// ============================================================
// TreeNode Definition
// ============================================================

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode parent;  // Optional, for parent pointer approach
    
    TreeNode(int val) {
        this.val = val;
        this.left = null;
        this.right = null;
        this.parent = null;
    }
    
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}


// ============================================================
// Approach 1: Recursive (Most Common - Single Query)
// ============================================================

/**
 * Find the lowest common ancestor of two nodes in a binary tree.
 * 
 * Time: O(n)
 * Space: O(h) - recursion stack depth
 */
class LCASolution {
    
    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // Base case: reached null or found one of the nodes
        if (root == null || root == p || root == q) {
            return root;
        }
        
        // Recurse on left and right subtrees
        TreeNode left = lowestCommonAncestor(root.left, p, q);
        TreeNode right = lowestCommonAncestor(root.right, p, q);
        
        // If both sides return non-null, current is LCA
        if (left != null && right != null) {
            return root;
        }
        
        // Return whichever is non-null (or null)
        return left != null ? left : right;
    }
    
    
    // ============================================================
    // Approach 2: Path Comparison
    // ============================================================
    
    private boolean findPath(TreeNode root, TreeNode target, List<TreeNode> path) {
        if (root == null) return false;
        
        path.add(root);
        
        if (root == target) return true;
        
        if (findPath(root.left, target, path) || findPath(root.right, target, path)) {
            return true;
        }
        
        path.remove(path.size() - 1);
        return false;
    }
    
    public TreeNode lowestCommonAncestorPath(TreeNode root, TreeNode p, TreeNode q) {
        List<TreeNode> pathP = new ArrayList<>();
        List<TreeNode> pathQ = new ArrayList<>();
        
        findPath(root, p, pathP);
        findPath(root, q, pathQ);
        
        // Find last common node in both paths
        TreeNode lca = null;
        for (int i = 0; i < Math.min(pathP.size(), pathQ.size()); i++) {
            if (pathP.get(i) == pathQ.get(i)) {
                lca = pathP.get(i);
            } else {
                break;
            }
        }
        
        return lca;
    }
    
    
    // ============================================================
    // Approach 3: Binary Lifting (Multiple Queries)
    // ============================================================
    
    class BinaryLiftingLCA {
        private Map<TreeNode, Integer> nodeToId;
        private int[][] up;
        private int[] depth;
        private int LOG;
        private int nodeCount;
        
        public BinaryLiftingLCA(TreeNode root) {
            nodeToId = new HashMap<>();
            nodeCount = 0;
            assignIds(root);
            
            LOG = (int) (Math.log(nodeCount) / Math.log(2)) + 1;
            up = new int[nodeCount + 1][LOG];
            depth = new int[nodeCount + 1];
            
            dfs(root, 0, -1);
        }
        
        private void assignIds(TreeNode node) {
            if (node == null) return;
            nodeToId.put(node, nodeCount++);
            assignIds(node.left);
            assignIds(node.right);
        }
        
        private void dfs(TreeNode node, int d, int parent) {
            if (node == null) return;
            
            int id = nodeToId.get(node);
            depth[id] = d;
            up[id][0] = parent;
            
            for (int k = 1; k < LOG; k++) {
                if (up[id][k-1] != -1) {
                    up[id][k] = up[up[id][k-1]][k-1];
                }
            }
            
            dfs(node.left, d + 1, id);
            dfs(node.right, d + 1, id);
        }
        
        public TreeNode lca(TreeNode u, TreeNode v) {
            int uId = nodeToId.get(u);
            int vId = nodeToId.get(v);
            
            if (depth[uId] < depth[vId]) {
                int temp = uId;
                uId = vId;
                vId = temp;
            }
            
            // Lift u to depth of v
            int diff = depth[uId] - depth[vId];
            for (int k = 0; k < LOG; k++) {
                if ((diff & (1 << k)) != 0) {
                    uId = up[uId][k];
                }
            }
            
            if (uId == vId) {
                // Find node by ID (would need reverse mapping in practice)
                return u;
            }
            
            // Lift both nodes together
            for (int k = LOG - 1; k >= 0; k--) {
                if (up[uId][k] != up[vId][k]) {
                    uId = up[uId][k];
                    vId = up[vId][k];
                }
            }
            
            // Find node by ID (would need reverse mapping)
            for (Map.Entry<TreeNode, Integer> entry : nodeToId.entrySet()) {
                if (entry.getValue() == up[uId][0]) {
                    return entry.getKey();
                }
            }
            
            return null;
        }
    }
    
    
    // ============================================================
    // Approach 4: Binary Search Tree Optimization
    // ============================================================
    
    /**
     * Find LCA in a Binary Search Tree using BST property.
     * 
     * Time: O(h) where h is height
     * Space: O(1)
     */
    public TreeNode lowestCommonAncestorBST(TreeNode root, TreeNode p, TreeNode q) {
        if (root == null || p == null || q == null) {
            return null;
        }
        
        TreeNode current = root;
        
        while (current != null) {
            if (p.val < current.val && q.val < current.val) {
                current = current.left;
            } else if (p.val > current.val && q.val > current.val) {
                current = current.right;
            } else {
                // Nodes on different sides - this is LCA
                return current;
            }
        }
        
        return null;
    }
    
    
    // ============================================================
    // Approach 5: Parent Pointers + HashSet
    // ============================================================
    
    public TreeNode lowestCommonAncestorWithParent(TreeNode p, TreeNode q) {
        Set<TreeNode> ancestors = new HashSet<>();
        
        // Collect all ancestors of p
        while (p != null) {
            ancestors.add(p);
            p = p.parent;
        }
        
        // Find first ancestor of q that's also in p's ancestors
        while (q != null) {
            if (ancestors.contains(q)) {
                return q;
            }
            q = q.parent;
        }
        
        return null;
    }
}


// ============================================================
// Main - Example Usage
// ============================================================

public class Main {
    public static void main(String[] args) {
        LCASolution solution = new LCASolution();
        
        // Build example tree:
        //         3
        //        / \
        //       5   1
        //      / \ / \
        //     6  2 0  8
        //       / \
        //      7   4
        
        TreeNode root = new TreeNode(3);
        root.left = new TreeNode(5);
        root.right = new TreeNode(1);
        root.left.left = new TreeNode(6);
        root.left.right = new TreeNode(2);
        root.right.left = new TreeNode(0);
        root.right.right = new TreeNode(8);
        root.left.right.left = new TreeNode(7);
        root.left.right.right = new TreeNode(4);
        
        // Test recursive approach
        TreeNode result = solution.lowestCommonAncestor(root, root.left, root.right);
        System.out.println("LCA of 5 and 1: " + result.val);  // Expected: 3
        
        result = solution.lowestCommonAncestor(root, root.left.left, root.left.right.right);
        System.out.println("LCA of 6 and 4: " + result.val);  // Expected: 5
        
        // Test BST version
        TreeNode bstRoot = new TreeNode(6);
        bstRoot.left = new TreeNode(2);
        bstRoot.right = new TreeNode(8);
        bstRoot.left.left = new TreeNode(1);
        bstRoot.left.right = new TreeNode(4);
        bstRoot.left.right.left = new TreeNode(3);
        bstRoot.left.right.right = new TreeNode(5);
        
        result = solution.lowestCommonAncestorBST(bstRoot, bstRoot.left, bstRoot.left.right);
        System.out.println("BST LCA of 2 and 4: " + result.val);  // Expected: 2
    }
}
```

<!-- slide -->
```javascript
/**
 * TreeNode definition for binary tree.
 */
class TreeNode {
    constructor(val = 0, left = null, right = null) {
        this.val = val;
        this.left = left;
        this.right = right;
        this.parent = null;  // Optional, for parent pointer approach
    }
}


// ============================================================
// Approach 1: Recursive (Most Common - Single Query)
// ============================================================

/**
 * Find the lowest common ancestor of two nodes in a binary tree.
 * 
 * @param {TreeNode} root - Root of the binary tree
 * @param {TreeNode} p - First node
 * @param {TreeNode} q - Second node
 * @returns {TreeNode|null} LCA node or null
 * 
 * Time: O(n)
 * Space: O(h) - recursion stack depth
 */
function lowestCommonAncestor(root, p, q) {
    // Base case: reached null or found one of the nodes
    if (!root || root === p || root === q) {
        return root;
    }
    
    // Recurse on left and right subtrees
    const left = lowestCommonAncestor(root.left, p, q);
    const right = lowestCommonAncestor(root.right, p, q);
    
    // If both sides return non-null, current is LCA
    if (left && right) {
        return root;
    }
    
    // Return whichever is non-null (or null)
    return left || right;
}


// ============================================================
// Approach 2: Path Comparison
// ============================================================

function findPath(root, target, path = []) {
    if (!root) return false;
    
    path.push(root);
    
    if (root === target) return true;
    
    if (findPath(root.left, target, path) || findPath(root.right, target, path)) {
        return true;
    }
    
    path.pop();
    return false;
}

/**
 * Find LCA using path comparison.
 * 
 * Time: O(n)
 * Space: O(h)
 */
function lowestCommonAncestorPath(root, p, q) {
    const pathP = [];
    const pathQ = [];
    
    findPath(root, p, pathP);
    findPath(root, q, pathQ);
    
    // Find last common node in both paths
    let lca = null;
    for (let i = 0; i < Math.min(pathP.length, pathQ.length); i++) {
        if (pathP[i] === pathQ[i]) {
            lca = pathP[i];
        } else {
            break;
        }
    }
    
    return lca;
}


// ============================================================
// Approach 3: Binary Lifting (Multiple Queries)
// ============================================================

class BinaryLiftingLCA {
    /**
     * Create LCA solver with binary lifting.
     * @param {TreeNode} root - Root of the tree
     */
    constructor(root) {
        this.nodeToId = new Map();
        this.idCounter = 0;
        
        // Assign IDs to all nodes
        this.assignIds(root);
        
        this.LOG = Math.floor(Math.log2(this.idCounter)) + 1;
        this.up = Array.from({ length: this.idCounter + 1 }, () => 
            Array(this.LOG).fill(-1));
        this.depth = new Array(this.idCounter + 1).fill(0);
        
        this.dfs(root, 0, -1);
    }
    
    assignIds(node) {
        if (!node) return;
        this.nodeToId.set(node, this.idCounter++);
        this.assignIds(node.left);
        this.assignIds(node.right);
    }
    
    dfs(node, d, parent) {
        if (!node) return;
        
        const id = this.nodeToId.get(node);
        this.depth[id] = d;
        this.up[id][0] = parent;
        
        for (let k = 1; k < this.LOG; k++) {
            if (this.up[id][k - 1] !== -1) {
                this.up[id][k] = this.up[this.up[id][k - 1]][k - 1];
            }
        }
        
        this.dfs(node.left, d + 1, id);
        this.dfs(node.right, d + 1, id);
    }
    
    /**
     * Find LCA of nodes u and v in O(log n).
     * @param {TreeNode} u - First node
     * @param {TreeNode} v - Second node
     * @returns {TreeNode} LCA node
     */
    lca(u, v) {
        const uId = this.nodeToId.get(u);
        const vId = this.nodeToId.get(v);
        
        // Ensure u is deeper
        if (this.depth[uId] < this.depth[vId]) {
            return this.lca(v, u);
        }
        
        // Lift u to depth of v
        let diff = this.depth[uId] - this.depth[vId];
        for (let k = 0; k < this.LOG; k++) {
            if (diff & (1 << k)) {
                uId = this.up[uId][k];
            }
        }
        
        if (uId === vId) {
            return u;
        }
        
        // Lift both nodes together
        for (let k = this.LOG - 1; k >= 0; k--) {
            if (this.up[uId][k] !== this.up[vId][k]) {
                uId = this.up[uId][k];
                vId = this.up[vId][k];
            }
        }
        
        // Find node by ID
        for (const [node, id] of this.nodeToId) {
            if (id === this.up[uId][0]) {
                return node;
            }
        }
        
        return null;
    }
}


// ============================================================
// Approach 4: Binary Search Tree Optimization
// ============================================================

/**
 * Find LCA in a Binary Search Tree using BST property.
 * 
 * @param {TreeNode} root - Root of BST
 * @param {TreeNode} p - First node
 * @param {TreeNode} q - Second node
 * @returns {TreeNode|null} LCA node
 * 
 * Time: O(h) where h is height
 * Space: O(1) - iterative version
 */
function lowestCommonAncestorBST(root, p, q) {
    if (!root || !p || !q) return null;
    
    let current = root;
    
    while (current) {
        if (p.val < current.val && q.val < current.val) {
            // Both in left subtree
            current = current.left;
        } else if (p.val > current.val && q.val > current.val) {
            // Both in right subtree
            current = current.right;
        } else {
            // Nodes on different sides - this is LCA
            return current;
        }
    }
    
    return null;
}


// ============================================================
// Approach 5: Parent Pointers + HashSet
// ============================================================

/**
 * Find LCA assuming nodes have parent pointers.
 * 
 * Time: O(h)
 * Space: O(h) - for ancestor set
 */
function lowestCommonAncestorWithParent(p, q) {
    const ancestors = new Set();
    
    // Collect all ancestors of p
    while (p) {
        ancestors.add(p);
        p = p.parent;
    }
    
    // Find first ancestor of q that's also in p's ancestors
    while (q) {
        if (ancestors.has(q)) {
            return q;
        }
        q = q.parent;
    }
    
    return null;
}


// ============================================================
// Example Usage and Testing
// ============================================================

// Build example tree:
//         3
//        / \
//       5   1
//      / \ / \
//     6  2 0  8
//       / \
//      7   4

const root = new TreeNode(3);
root.left = new TreeNode(5);
root.right = new TreeNode(1);
root.left.left = new TreeNode(6);
root.left.right = new TreeNode(2);
root.right.left = new TreeNode(0);
root.right.right = new TreeNode(8);
root.left.right.left = new TreeNode(7);
root.left.right.right = new TreeNode(4);

// Test recursive approach
let result = lowestCommonAncestor(root, root.left, root.right);
console.log(`LCA of 5 and 1: ${result.val}`);  // Expected: 3

result = lowestCommonAncestor(root, root.left.left, root.left.right.right);
console.log(`LCA of 6 and 4: ${result.val}`);  // Expected: 5

// Test BST version
// BST:
//       6
//      / \
//     2   8
//    / \
//   1   4
//      / \
//     3   5

const bstRoot = new TreeNode(6);
bstRoot.left = new TreeNode(2);
bstRoot.right = new TreeNode(8);
bstRoot.left.left = new TreeNode(1);
bstRoot.left.right = new TreeNode(4);
bstRoot.left.right.left = new TreeNode(3);
bstRoot.left.right.right = new TreeNode(5);

result = lowestCommonAncestorBST(bstRoot, bstRoot.left, bstRoot.left.right);
console.log(`BST LCA of 2 and 4: ${result.val}`);  // Expected: 2
```
````

---

## Time Complexity Analysis

| Approach | Preprocessing | Query Time | Use Case |
|----------|--------------|------------|----------|
| **Recursive** | None | O(n) | Single query |
| **Path Comparison** | None | O(n) | Single query |
| **Binary Lifting** | O(n log n) | O(log n) | Multiple queries |
| **BST Optimization** | None | O(h) | BST only |
| **Parent + HashSet** | None | O(h) | Parent pointers available |
| **Euler Tour + RMQ** | O(n) | O(1) | Many queries |

### Detailed Breakdown

- **Recursive**: Visits each node at most once → O(n). Space is recursion depth O(h)
- **Path Comparison**: Two DFS traversals → O(n). Space for paths O(h)
- **Binary Lifting**: DFS for preprocessing O(n), then O(log n) per query
- **BST**: Traverse at most height of tree → O(h) worst case, O(log n) balanced
- **Euler Tour**: Build Euler tour and segment tree once, then O(1) queries

---

## Space Complexity Analysis

| Approach | Space Complexity | Notes |
|----------|------------------|-------|
| **Recursive** | O(h) | Recursion stack |
| **Path Comparison** | O(h) | Two path arrays |
| **Binary Lifting** | O(n log n) | Ancestor table |
| **BST Optimization** | O(1) | Iterative, no extra space |
| **Parent + HashSet** | O(h) | Ancestor set |
| **Euler Tour + RMQ** | O(n) | Euler tour + sparse table |

### Space Optimization Tips

- Use iterative versions when stack space is limited
- For binary lifting, use only O(n) with Euler tour + segment tree
- In BST, avoid recursion for O(1) space

---

## Common Variations

### 1. Lowest Common Ancestor with Parent Pointers

When each node has a parent pointer, we can use a hash set to collect all ancestors of one node and find the first common ancestor of the other.

````carousel
```python
def lca_with_parent(p, q):
    """O(h) time, O(h) space using parent pointers."""
    ancestors = set()
    
    while p:
        ancestors.add(p)
        p = p.parent
    
    while q:
        if q in ancestors:
            return q
        q = q.parent
    
    return None
```

<!-- slide -->
```cpp
TreeNode* lcaWithParent(TreeNode* p, TreeNode* q) {
    unordered_set<TreeNode*> ancestors;
    
    while (p) {
        ancestors.insert(p);
        p = p->parent;
    }
    
    while (q) {
        if (ancestors.find(q) != ancestors.end()) {
            return q;
        }
        q = q->parent;
    }
    
    return nullptr;
}
```

<!-- slide -->
```java
public TreeNode lcaWithParent(TreeNode p, TreeNode q) {
    Set<TreeNode> ancestors = new HashSet<>();
    
    while (p != null) {
        ancestors.add(p);
        p = p.parent;
    }
    
    while (q != null) {
        if (ancestors.contains(q)) {
            return q;
        }
        q = q.parent;
    }
    
    return null;
}
```

<!-- slide -->
```javascript
function lcaWithParent(p, q) {
    const ancestors = new Set();
    
    while (p) {
        ancestors.add(p);
        p = p.parent;
    }
    
    while (q) {
        if (ancestors.has(q)) {
            return q;
        }
        q = q.parent;
    }
    
    return null;
}
```
````

### 2. K-th Ancestor using Binary Lifting

Extend binary lifting to answer k-th ancestor queries efficiently.

````carousel
```python
def kth_ancestor(node, k, up, LOG):
    """Find k-th ancestor using binary lifting.
    
    Args:
        node: Starting node
        k: Number of steps to go up
        up: Precomputed ancestor table
        LOG: Maximum power of 2 needed
    
    Returns:
        The k-th ancestor or None if out of bounds
    """
    current = node
    for i in range(LOG):
        if k & (1 << i):
            if up[current][i] == -1:
                return None
            current = up[current][i]
    return current
```

<!-- slide -->
```cpp
int kthAncestor(int node, int k, const vector<vector<int>>& up, int LOG) {
    int current = node;
    for (int i = 0; i < LOG; i++) {
        if (k & (1 << i)) {
            if (up[current][i] == -1) return -1;
            current = up[current][i];
        }
    }
    return current;
}
```

<!-- slide -->
```java
public int kthAncestor(int node, int k, int[][] up, int LOG) {
    int current = node;
    for (int i = 0; i < LOG; i++) {
        if ((k & (1 << i)) != 0) {
            if (up[current][i] == -1) return -1;
            current = up[current][i];
        }
    }
    return current;
}
```

<!-- slide -->
```javascript
function kthAncestor(node, k, up, LOG) {
    let current = node;
    for (let i = 0; i < LOG; i++) {
        if (k & (1 << i)) {
            if (up[current][i] === -1) return -1;
            current = up[current][i];
        }
    }
    return current;
}
```
````

### 3. Distance Between Two Nodes

Using LCA to find distance: dist(u,v) = depth(u) + depth(v) - 2*depth(lca)

````carousel
```python
def distance(u, v, lca_node, depth):
    """Calculate distance between two nodes using LCA.
    
    Args:
        u: First node (as ID or index)
        v: Second node (as ID or index)
        lca_node: LCA of u and v (as ID or index)
        depth: Array mapping node to its depth from root
    
    Returns:
        Number of edges between u and v
    """
    return depth[u] + depth[v] - 2 * depth[lca_node]


# Example usage with TreeNodes
def distanceUsingLCA(root, p, q):
    """Find distance between two nodes in a binary tree."""
    from collections import deque
    
    # Step 1: Find LCA
    def findLCA(node, p, q):
        if not node or node == p or node == q:
            return node
        left = findLCA(node.left, p, q)
        right = findLCA(node.right, p, q)
        if left and right:
            return node
        return left or right
    
    lca = findLCA(root, p, q)
    
    # Step 2: Calculate depth from a given node
    def findDepth(node, target, current_depth):
        if not node:
            return -1
        if node == target:
            return current_depth
        left = findDepth(node.left, target, current_depth + 1)
        if left != -1:
            return left
        return findDepth(node.right, target, current_depth + 1)
    
    depth_p = findDepth(lca, p, 0)
    depth_q = findDepth(lca, q, 0)
    
    return depth_p + depth_q
```

<!-- slide -->
```cpp
// Calculate distance using precomputed depths
int distance(int u, int v, int lca, const vector<int>& depth) {
    return depth[u] + depth[v] - 2 * depth[lca];
}

// Full implementation with LCA finding
class DistanceFinder {
private:
    TreeNode* findLCA(TreeNode* node, TreeNode* p, TreeNode* q) {
        if (!node || node == p || node == q) return node;
        TreeNode* left = findLCA(node->left, p, q);
        TreeNode* right = findLCA(node->right, p, q);
        if (left && right) return node;
        return left ? left : right;
    }
    
    int findDepth(TreeNode* node, TreeNode* target, int currentDepth) {
        if (!node) return -1;
        if (node == target) return currentDepth;
        int left = findDepth(node->left, target, currentDepth + 1);
        if (left != -1) return left;
        return findDepth(node->right, target, currentDepth + 1);
    }

public:
    int distanceBetweenNodes(TreeNode* root, TreeNode* p, TreeNode* q) {
        TreeNode* lca = findLCA(root, p, q);
        int depthP = findDepth(lca, p, 0);
        int depthQ = findDepth(lca, q, 0);
        return depthP + depthQ;
    }
};
```

<!-- slide -->
```java
public class DistanceFinder {
    // Calculate distance using precomputed depths
    public int distance(int u, int v, int lca, int[] depth) {
        return depth[u] + depth[v] - 2 * depth[lca];
    }
    
    // Full implementation with LCA finding
    private TreeNode findLCA(TreeNode node, TreeNode p, TreeNode q) {
        if (node == null || node == p || node == q) return node;
        TreeNode left = findLCA(node.left, p, q);
        TreeNode right = findLCA(node.right, p, q);
        if (left != null && right != null) return node;
        return left != null ? left : right;
    }
    
    private int findDepth(TreeNode node, TreeNode target, int currentDepth) {
        if (node == null) return -1;
        if (node == target) return currentDepth;
        int left = findDepth(node.left, target, currentDepth + 1);
        if (left != -1) return left;
        return findDepth(node.right, target, currentDepth + 1);
    }
    
    public int distanceBetweenNodes(TreeNode root, TreeNode p, TreeNode q) {
        TreeNode lca = findLCA(root, p, q);
        int depthP = findDepth(lca, p, 0);
        int depthQ = findDepth(lca, q, 0);
        return depthP + depthQ;
    }
}
```

<!-- slide -->
```javascript
// Calculate distance using precomputed depths
function distance(u, v, lca, depth) {
    return depth[u] + depth[v] - 2 * depth[lca];
}

// Full implementation with LCA finding
function distanceBetweenNodes(root, p, q) {
    // Find LCA
    function findLCA(node, p, q) {
        if (!node || node === p || node === q) return node;
        const left = findLCA(node.left, p, q);
        const right = findLCA(node.right, p, q);
        if (left && right) return node;
        return left || right;
    }
    
    // Calculate depth from a given starting node
    function findDepth(node, target, currentDepth) {
        if (!node) return -1;
        if (node === target) return currentDepth;
        const left = findDepth(node.left, target, currentDepth + 1);
        if (left !== -1) return left;
        return findDepth(node.right, target, currentDepth + 1);
    }
    
    const lca = findLCA(root, p, q);
    const depthP = findDepth(lca, p, 0);
    const depthQ = findDepth(lca, q, 0);
    
    return depthP + depthQ;
}
```
````

### 4. LCA in N-ary Tree

The recursive approach works for any tree, not just binary trees. For an N-ary tree, we check all children instead of just left and right.

````carousel
```python
class NaryTreeNode:
    """Definition for an N-ary tree node."""
    def __init__(self, val=0, children=None):
        self.val = val
        self.children = children if children is not None else []

def lowestCommonAncestorNary(root, p, q):
    """
    Find LCA in an N-ary tree.
    
    Args:
        root: Root of the N-ary tree
        p: First target node
        q: Second target node
    
    Returns:
        LCA node or None
    """
    if not root or root == p or root == q:
        return root
    
    found_count = 0
    found_node = None
    
    # Check all children
    for child in root.children:
        result = lowestCommonAncestorNary(child, p, q)
        if result:
            found_count += 1
            found_node = result
    
    # If p and q found in different subtrees, root is LCA
    if found_count == 2:
        return root
    
    # If found in one subtree, return that result
    return found_node


def lowestCommonAncestorNaryIterative(root, p, q):
    """
    Iterative approach using parent pointers for N-ary tree.
    Assumes nodes have a 'parent' field.
    """
    ancestors = set()
    
    # Build ancestor chain for p
    while p:
        ancestors.add(p)
        p = p.parent if hasattr(p, 'parent') else None
    
    # Find first common ancestor with q
    while q:
        if q in ancestors:
            return q
        q = q.parent if hasattr(q, 'parent') else None
    
    return None
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

// N-ary Tree Node Definition
class NaryTreeNode {
public:
    int val;
    vector<NaryTreeNode*> children;
    
    NaryTreeNode(int x) : val(x) {}
    NaryTreeNode(int x, vector<NaryTreeNode*> _children) 
        : val(x), children(_children) {}
};

NaryTreeNode* lowestCommonAncestorNary(NaryTreeNode* root, 
                                        NaryTreeNode* p, 
                                        NaryTreeNode* q) {
    if (!root || root == p || root == q) return root;
    
    int foundCount = 0;
    NaryTreeNode* foundNode = nullptr;
    
    for (NaryTreeNode* child : root->children) {
        NaryTreeNode* result = lowestCommonAncestorNary(child, p, q);
        if (result) {
            foundCount++;
            foundNode = result;
        }
    }
    
    if (foundCount == 2) return root;
    return foundNode;
}

// Iterative with parent pointers
NaryTreeNode* lowestCommonAncestorNaryIterative(NaryTreeNode* p, NaryTreeNode* q) {
    unordered_set<NaryTreeNode*> ancestors;
    
    while (p) {
        ancestors.insert(p);
        p = p->parent;
    }
    
    while (q) {
        if (ancestors.find(q) != ancestors.end()) {
            return q;
        }
        q = q->parent;
    }
    
    return nullptr;
}
```

<!-- slide -->
```java
import java.util.*;

// N-ary Tree Node Definition
class NaryTreeNode {
    public int val;
    public List<NaryTreeNode> children;
    public NaryTreeNode parent;  // Optional
    
    public NaryTreeNode(int val) {
        this.val = val;
        this.children = new ArrayList<>();
    }
}

public class NaryLCA {
    public NaryTreeNode lowestCommonAncestor(NaryTreeNode root, 
                                              NaryTreeNode p, 
                                              NaryTreeNode q) {
        if (root == null || root == p || root == q) {
            return root;
        }
        
        int foundCount = 0;
        NaryTreeNode foundNode = null;
        
        for (NaryTreeNode child : root.children) {
            NaryTreeNode result = lowestCommonAncestor(child, p, q);
            if (result != null) {
                foundCount++;
                foundNode = result;
            }
        }
        
        if (foundCount == 2) return root;
        return foundNode;
    }
    
    // Iterative with parent pointers
    public NaryTreeNode lowestCommonAncestorIterative(NaryTreeNode p, 
                                                       NaryTreeNode q) {
        Set<NaryTreeNode> ancestors = new HashSet<>();
        
        while (p != null) {
            ancestors.add(p);
            p = p.parent;
        }
        
        while (q != null) {
            if (ancestors.contains(q)) {
                return q;
            }
            q = q.parent;
        }
        
        return null;
    }
}
```

<!-- slide -->
```javascript
// N-ary Tree Node Definition
class NaryTreeNode {
    constructor(val, children = []) {
        this.val = val;
        this.children = children;
        this.parent = null;  // Optional
    }
}

function lowestCommonAncestorNary(root, p, q) {
    if (!root || root === p || root === q) {
        return root;
    }
    
    let foundCount = 0;
    let foundNode = null;
    
    for (const child of root.children) {
        const result = lowestCommonAncestorNary(child, p, q);
        if (result) {
            foundCount++;
            foundNode = result;
        }
    }
    
    if (foundCount === 2) return root;
    return foundNode;
}

// Iterative with parent pointers
function lowestCommonAncestorNaryIterative(p, q) {
    const ancestors = new Set();
    
    while (p) {
        ancestors.add(p);
        p = p.parent;
    }
    
    while (q) {
        if (ancestors.has(q)) {
            return q;
        }
        q = q.parent;
    }
    
    return null;
}
```
````

### 5. Lowest Common Ancestor with Node Values

Instead of node references, find LCA using values. This is useful when you're given values instead of node pointers.

````carousel
```python
def find_lca_by_values(root, val1, val2):
    """
    Find LCA when we only have node values.
    
    Args:
        root: Root of the binary tree
        val1: Value of first target node
        val2: Value of second target node
    
    Returns:
        The LCA node or None if values not found
    """
    if not root:
        return None
    
    if root.val == val1 or root.val == val2:
        return root
    
    left = find_lca_by_values(root.left, val1, val2)
    right = find_lca_by_values(root.right, val1, val2)
    
    if left and right:
        return root
    return left or right


def find_lca_by_values_iterative(root, val1, val2):
    """
    Iterative approach: Find paths to both values then compare.
    """
    def find_path(root, target_val):
        if not root:
            return None
        if root.val == target_val:
            return [root]
        
        left_path = find_path(root.left, target_val)
        if left_path:
            return [root] + left_path
        
        right_path = find_path(root.right, target_val)
        if right_path:
            return [root] + right_path
        
        return None
    
    path1 = find_path(root, val1)
    path2 = find_path(root, val2)
    
    if not path1 or not path2:
        return None
    
    # Find last common node
    lca = None
    for i in range(min(len(path1), len(path2))):
        if path1[i] == path2[i]:
            lca = path1[i]
        else:
            break
    
    return lca
```

<!-- slide -->
```cpp
#include <vector>
using namespace std;

// Recursive approach
TreeNode* findLCAByValues(TreeNode* root, int val1, int val2) {
    if (!root) return nullptr;
    
    if (root->val == val1 || root->val == val2) {
        return root;
    }
    
    TreeNode* left = findLCAByValues(root->left, val1, val2);
    TreeNode* right = findLCAByValues(root->right, val1, val2);
    
    if (left && right) return root;
    return left ? left : right;
}

// Iterative with path finding
bool findPath(TreeNode* root, int target, vector<TreeNode*>& path) {
    if (!root) return false;
    
    path.push_back(root);
    if (root->val == target) return true;
    
    if (findPath(root->left, target, path) || 
        findPath(root->right, target, path)) {
        return true;
    }
    
    path.pop_back();
    return false;
}

TreeNode* findLCAByValuesIterative(TreeNode* root, int val1, int val2) {
    vector<TreeNode*> path1, path2;
    
    if (!findPath(root, val1, path1) || !findPath(root, val2, path2)) {
        return nullptr;
    }
    
    TreeNode* lca = nullptr;
    for (size_t i = 0; i < min(path1.size(), path2.size()); i++) {
        if (path1[i] == path2[i]) {
            lca = path1[i];
        } else {
            break;
        }
    }
    
    return lca;
}
```

<!-- slide -->
```java
import java.util.*;

public class LCAByValues {
    // Recursive approach
    public TreeNode findLCAByValues(TreeNode root, int val1, int val2) {
        if (root == null) return null;
        
        if (root.val == val1 || root.val == val2) {
            return root;
        }
        
        TreeNode left = findLCAByValues(root.left, val1, val2);
        TreeNode right = findLCAByValues(root.right, val1, val2);
        
        if (left != null && right != null) return root;
        return left != null ? left : right;
    }
    
    // Iterative with path finding
    private boolean findPath(TreeNode root, int target, List<TreeNode> path) {
        if (root == null) return false;
        
        path.add(root);
        if (root.val == target) return true;
        
        if (findPath(root.left, target, path) || 
            findPath(root.right, target, path)) {
            return true;
        }
        
        path.remove(path.size() - 1);
        return false;
    }
    
    public TreeNode findLCAByValuesIterative(TreeNode root, int val1, int val2) {
        List<TreeNode> path1 = new ArrayList<>();
        List<TreeNode> path2 = new ArrayList<>();
        
        if (!findPath(root, val1, path1) || !findPath(root, val2, path2)) {
            return null;
        }
        
        TreeNode lca = null;
        for (int i = 0; i < Math.min(path1.size(), path2.size()); i++) {
            if (path1.get(i) == path2.get(i)) {
                lca = path1.get(i);
            } else {
                break;
            }
        }
        
        return lca;
    }
}
```

<!-- slide -->
```javascript
// Recursive approach
function findLCAByValues(root, val1, val2) {
    if (!root) return null;
    
    if (root.val === val1 || root.val === val2) {
        return root;
    }
    
    const left = findLCAByValues(root.left, val1, val2);
    const right = findLCAByValues(root.right, val1, val2);
    
    if (left && right) return root;
    return left || right;
}

// Iterative with path finding
function findPath(root, target, path) {
    if (!root) return false;
    
    path.push(root);
    if (root.val === target) return true;
    
    if (findPath(root.left, target, path) || 
        findPath(root.right, target, path)) {
        return true;
    }
    
    path.pop();
    return false;
}

function findLCAByValuesIterative(root, val1, val2) {
    const path1 = [];
    const path2 = [];
    
    if (!findPath(root, val1, path1) || !findPath(root, val2, path2)) {
        return null;
    }
    
    let lca = null;
    for (let i = 0; i < Math.min(path1.length, path2.length); i++) {
        if (path1[i] === path2[i]) {
            lca = path1[i];
        } else {
            break;
        }
    }
    
    return lca;
}
```
````

---

## Practice Problems

### Problem 1: Lowest Common Ancestor of a Binary Tree

**Problem:** [LeetCode 236 - Lowest Common Ancestor of a Binary Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/)

**Description:** Given a binary tree (not BST), find the lowest common ancestor of two given nodes in the tree.

**How to Apply LCA:**
- Use the recursive approach directly
- Return node when both left and right recursion find targets
- Handle case where one target is ancestor of other

---

### Problem 2: Lowest Common Ancestor of a Binary Search Tree

**Problem:** [LeetCode 235 - Lowest Common Ancestor of a Binary Search Tree](https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/)

**Description:** Given a BST, find the LCA of two given nodes in the BST.

**How to Apply LCA:**
- Use BST property: compare values to decide which subtree to search
- O(h) time complexity - much simpler than general binary tree
- Iterative solution is most space-efficient

---

### Problem 3: Kth Ancestor of a Tree Node

**Problem:** [LeetCode 1483 - Kth Ancestor of a Tree Node](https://leetcode.com/problems/kth-ancestor-of-a-tree-node/)

**Description:** Design a data structure to find the kth ancestor of a given node in a tree.

**How to Apply LCA Technique:**
- Use binary lifting preprocessing
- For each node, store 2^k ancestors
- Answer each query in O(log n)

---

### Problem 4: Distance Between Nodes in Binary Tree

**Problem:** [LeetCode 1740 - Find Distance in a Binary Tree](https://leetcode.com/problems/find-distance-in-a-binary-tree/)

**Description:** Find the distance between two nodes in a binary tree.

**How to Apply LCA:**
- First find LCA of the two nodes
- Distance = depth(p) + depth(q) - 2 * depth(lca)
- Useful for many tree distance problems

---

### Problem 5: Lowest Common Ancestor with Weighted Edges

**Problem:** [LeetCode 2096 - Step-By-Step Directions From a Binary Tree Node to Another](https://leetcode.com/problems/step-by-step-directions-from-a-binary-tree-node-to-another/)

**Description:** Given a binary tree with edge weights, find directions from one node to another.

**How to Apply LCA:**
- Find LCA of source and destination
- Build path: "U" for each level up to LCA, then directions to destination

---

## Video Tutorial Links

### Fundamentals

- [Lowest Common Ancestor - Introduction (Take U Forward)](https://www.youtube.com/watch?v=WR7m4fpk5uU) - Comprehensive introduction to LCA
- [LCA Binary Tree (NeetCode)](https://www.youtube.com/watch?v=K3a7yWJ7PZY) - Practical implementation guide
- [Binary Search Tree LCA (WilliamFiset)](https://www.youtube.com/watch?v=uxPF8YqN9sU) - BST-specific approach

### Advanced Topics

- [Binary Lifting for LCA](https://www.youtube.com/watch?v=8M7rV8U4qBg) - Multiple queries optimization
- [Euler Tour + RMQ for LCA](https://www.youtube.com/watch?v=GLk3-2fX6qE) - O(1) query approach
- [LCA with K-th Ancestor](https://www.youtube.com/watch?v=NUdDuxX-2b4) - Extended LCA problems

---

## Follow-up Questions

### Q1: What is the difference between finding LCA in a Binary Tree vs Binary Search Tree?

**Answer:** In a general binary tree, we must traverse both subtrees to find where paths diverge. In a BST, we can leverage the ordering property: if both target values are less than current, go left; if both are greater, go right; otherwise, current is the LCA. BST version is O(h) vs O(n) for general tree.

### Q2: How do you handle multiple LCA queries efficiently?

**Answer:** Use binary lifting preprocessing in O(n log n), then each query takes O(log n). For even more queries, use Euler tour + Sparse Table for O(1) queries after O(n) preprocessing. The tradeoff is space vs query time.

### Q3: Can LCA be found in O(1) space?

**Answer:** Yes, using iterative BST approach takes O(1) extra space. However, general binary tree recursive approach uses O(h) stack space. For multiple queries with O(1) query time, use Euler tour + RMQ which requires O(n) space.

### Q4: How does the recursive LCA handle the case when one node is an ancestor of the other?

**Answer:** The algorithm handles this naturally: when we reach the ancestor node during recursion, the base case triggers (root == p or root == q), returning that node. The other recursion returns null, so the non-null result is the ancestor node itself.

### Q5: What is the relationship between LCA and finding distance between nodes?

**Answer:** Distance(u, v) = depth(u) + depth(v) - 2 * depth(LCA(u, v)). This formula is useful for many problems involving node distances in trees. Finding LCA first, then computing distance is a common pattern.

---

## Summary

The Lowest Common Ancestor is a fundamental tree algorithm with many practical applications. Key takeaways:

- **Core Concept**: LCA is where paths from root to two nodes diverge
- **Multiple Approaches**: Choose based on constraints - recursive for simplicity, binary lifting for multiple queries, BST optimization for search trees
- **Time Complexity**: Ranges from O(n) single query to O(1) with preprocessing
- **Space Complexity**: Ranges from O(1) to O(n log n) depending on approach
- **Common Use Cases**: Tree queries, path finding, hierarchical relationships
- **Extensions**: Binary lifting enables k-th ancestor queries and distance calculations

When to use:
- ✅ Single LCA query on small tree → Recursive approach
- ✅ BST → BST optimization (O(h))
- ✅ Multiple queries → Binary lifting or Euler + RMQ
- ✅ Parent pointers available → HashSet approach
- ❌ Large tree, many queries → Don't use naive O(n) for each

This algorithm is essential for competitive programming and technical interviews, especially in problems involving tree hierarchies and path queries.

---

## Related Algorithms

- [Binary Lifting](./binary-lifting.md) - Efficient ancestor queries
- [Segment Tree](./segment-tree.md) - Range queries (used in RMQ approach)
- [Tree Traversal](./tree-traversal.md) - DFS/BFS fundamentals
- [Euler Tour](./euler-tour.md) - Tree flattening technique
