# Clone N-Ary Tree

## Problem Description

Given the root of an N-ary tree, return a deep copy of the tree. Each node in the N-ary tree contains a value and a list of its children.

**Note:** This is LeetCode Problem 1490. You can find the original problem [here](https://leetcode.com/problems/clone-n-ary-tree/).

---

## Examples

### Example

**Input:** 
```python
root = [1,null,3,2,4,null,5,6]
```

**Output:** 
```python
[1,null,3,2,4,null,5,6]
```

**Explanation:** The N-ary tree has the following structure:
```
     1
   / | \
  3  2  4
 / \
5   6
```
The deep copy creates an identical tree with the same values and structure.

### Example 2

**Input:** 
```python
root = [1,null,2,3,4,5,null,null,6,7,null,8,null,9,10,null,null,11,null,12,null,13,null,null,14]
```

**Explanation:** This is a larger N-ary tree with 14 nodes. The output is a deep copy with identical structure.

---

## Constraints

- The number of nodes in the tree is in the range `[0, 1000]`
- `0 <= Node.val <= 1000`
- The number of children per node is in the range `[0, 10]`
- All values in the tree are unique

---

## Pattern: Tree Traversal (DFS/BFS)

This problem is a classic example of **Tree Traversal** using either **DFS** or **BFS**. The key insight is to create a deep copy by traversing and copying each node.

### Core Concept

- **Deep Copy**: Create new nodes with same values, don't reference original nodes
- **DFS Traversal**: Recursively visit each node and its children
- **BFS Traversal**: Use queue to process nodes level by level
- **Hash Map**: Can use map to track original-to-copy mapping

---

## Intuition

The key insight for this problem is understanding how to create a true deep copy of a tree structure.

### Key Observations

1. **Deep Copy vs Shallow Copy**: We must create new Node objects, not just copy references

2. **Recursive Structure**: Each node's children are independent subtrees that can be recursively copied

3. **Base Case**: An empty tree (null root) returns null

4. **Order Independence**: For tree cloning, we can traverse in any order - the result is the same

5. **Multiple Approaches**: Both DFS and BFS can effectively solve this problem

### Algorithm Overview

1. **DFS Approach** (Recursive):
   - Base case: if root is null, return null
   - Create new node with same value
   - Recursively clone all children
   - Return cloned node

2. **BFS Approach** (Iterative):
   - Use queue for level-order traversal
   - Create mapping from original to clone
   - Process nodes and build children

---

## Multiple Approaches with Code

We'll cover two approaches:

1. **DFS (Recursive)** - Most common and intuitive
2. **BFS (Iterative)** - Alternative approach

---

## Approach 1: DFS (Recursive) - Optimal

### Algorithm Steps

1. Base case: if root is None, return None
2. Create new Node with same value as root
3. For each child in root.children:
   - Recursively clone the child
   - Add cloned child to new node's children
4. Return the cloned node

### Why It Works

The DFS approach works because:
- Each node can be processed independently
- Recursively calling on children ensures entire subtree is copied
- The base case handles empty trees
- Order of processing doesn't affect final result

### Code Implementation

````carousel
```python
class Node:
    def __init__(self, val=None, children=None):
        """
        N-ary tree node.

        Args:
            val: The value of the node
            children: List of child nodes (default: empty list)
        """
        self.val = val
        self.children = children if children is not None else []


class Solution:
    def cloneTree(self, root: 'Node') -> 'Node':
        """
        Create a deep copy of an N-ary tree using DFS.

        Args:
            root: Root node of the source tree

        Returns:
            Root node of the cloned tree
        """
        # Base case: empty tree
        if not root:
            return None
        
        # Create new node with same value
        clone = Node(root.val, [])
        
        # Recursively clone each child
        for child in root.children:
            clone.children.append(self.cloneTree(child))
        
        return clone
```

<!-- slide -->
```cpp
/*
// Definition for a Node.
class Node {
public:
    int val;
    vector<Node*> children;
    
    Node() {}
    
    Node(int _val) {
        val = _val;
    }
    
    Node(int _val, vector<Node*> _children) {
        val = _val;
        children = _children;
    }
};
*/

class Solution {
public:
    Node* cloneTree(Node* root) {
        // Base case: empty tree
        if (!root) return nullptr;
        
        // Create new node with same value
        Node* clone = new Node(root->val, {});
        
        // Recursively clone each child
        for (Node* child : root->children) {
            clone->children.push_back(cloneTree(child));
        }
        
        return clone;
    }
};
```

<!-- slide -->
```java
/*
// Definition for a Node.
class Node {
    public int val;
    public List<Node> children;
    
    public Node() {}
    
    public Node(int _val) {
        val = _val;
    }
    
    public Node(int _val, List<Node> _children) {
        val = _val;
        children = _children;
    }
}
*/

class Solution {
    public Node cloneTree(Node root) {
        // Base case: empty tree
        if (root == null) return null;
        
        // Create new node with same value
        Node clone = new Node(root.val, new ArrayList<>());
        
        // Recursively clone each child
        for (Node child : root.children) {
            clone.children.add(cloneTree(child));
        }
        
        return clone;
    }
}
```

<!-- slide -->
```javascript
/**
 * // Definition for a Node.
 * function Node(val, children) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.children = (children===undefined ? [] : children)
 * }
 */

/**
 * @param {Node} root
 * @return {Node}
 */
var cloneTree = function(root) {
    // Base case: empty tree
    if (!root) return null;
    
    // Create new node with same value
    const clone = new Node(root.val, []);
    
    // Recursively clone each child
    for (const child of root.children) {
        clone.children.push(cloneTree(child));
    }
    
    return clone;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - each node visited exactly once |
| **Space** | O(h) - recursion stack where h is tree height |

---

## Approach 2: BFS (Iterative)

### Algorithm Steps

1. If root is null, return null
2. Create root clone and map original to clone
3. Use queue to process nodes level by level
4. For each node, clone it and add to parent's children
5. Continue until all nodes are processed
6. Return cloned root

### Why It Works

The BFS approach works because:
- Queue ensures level-order processing
- HashMap tracks original-to-clone mapping
- Each node is processed exactly once
- Children are linked to correct parent using the map

### Code Implementation

````carousel
```python
from collections import deque

class Node:
    def __init__(self, val=None, children=None):
        self.val = val
        self.children = children if children is not None else []


class Solution:
    def cloneTree(self, root: 'Node') -> 'Node':
        """Create a deep copy using BFS."""
        if not root:
            return None
        
        # Map original nodes to cloned nodes
        original_to_clone = {}
        
        # Create root clone
        clone_root = Node(root.val, [])
        original_to_clone[root] = clone_root
        
        # BFS traversal
        queue = deque([root])
        
        while queue:
            current = queue.popleft()
            current_clone = original_to_clone[current]
            
            # Process all children
            for child in current.children:
                # Clone the child
                child_clone = Node(child.val, [])
                original_to_clone[child] = child_clone
                
                # Add to parent's children
                current_clone.children.append(child_clone)
                
                # Add child to queue
                queue.append(child)
        
        return clone_root
```

<!-- slide -->
```cpp
#include <queue>
#include <unordered_map>

class Solution {
public:
    Node* cloneTree(Node* root) {
        if (!root) return nullptr;
        
        // Map original nodes to cloned nodes
        unordered_map<Node*, Node*> originalToClone;
        
        // Create root clone
        Node* cloneRoot = new Node(root->val, {});
        originalToClone[root] = cloneRoot;
        
        // BFS traversal
        queue<Node*> q;
        q.push(root);
        
        while (!q.empty()) {
            Node* current = q.front();
            q.pop();
            Node* currentClone = originalToClone[current];
            
            // Process all children
            for (Node* child : current->children) {
                // Clone the child
                Node* childClone = new Node(child->val, {});
                originalToClone[child] = childClone;
                
                // Add to parent's children
                currentClone->children.push_back(childClone);
                
                // Add child to queue
                q.push(child);
            }
        }
        
        return cloneRoot;
    }
};
```

<!-- slide -->
```java
import java.util.*;

class Solution {
    public Node cloneTree(Node root) {
        if (root == null) return null;
        
        // Map original nodes to cloned nodes
        Map<Node, Node> originalToClone = new HashMap<>();
        
        // Create root clone
        Node cloneRoot = new Node(root.val, new ArrayList<>());
        originalToClone.put(root, cloneRoot);
        
        // BFS traversal
        Queue<Node> queue = new LinkedList<>();
        queue.offer(root);
        
        while (!queue.isEmpty()) {
            Node current = queue.poll();
            Node currentClone = originalToClone.get(current);
            
            // Process all children
            for (Node child : current.children) {
                // Clone the child
                Node childClone = new Node(child.val, new ArrayList<>());
                originalToClone.put(child, childClone);
                
                // Add to parent's children
                currentClone.children.add(childClone);
                
                // Add child to queue
                queue.offer(child);
            }
        }
        
        return cloneRoot;
    }
}
```

<!-- slide -->
```javascript
/**
 * @param {Node} root
 * @return {Node}
 */
var cloneTree = function(root) {
    if (!root) return null;
    
    // Map original nodes to cloned nodes
    const originalToClone = new Map();
    
    // Create root clone
    const cloneRoot = new Node(root.val, []);
    originalToClone.set(root, cloneRoot);
    
    // BFS traversal
    const queue = [root];
    
    while (queue.length > 0) {
        const current = queue.shift();
        const currentClone = originalToClone.get(current);
        
        // Process all children
        for (const child of current.children) {
            // Clone the child
            const childClone = new Node(child.val, []);
            originalToClone.set(child, childClone);
            
            // Add to parent's children
            currentClone.children.push(childClone);
            
            // Add child to queue
            queue.push(child);
        }
    }
    
    return cloneRoot;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - each node visited exactly once |
| **Space** | O(n) - for queue and hashmap |

---

## Comparison of Approaches

| Aspect | DFS (Recursive) | BFS (Iterative) |
|--------|------------------|-----------------|
| **Time Complexity** | O(n) | O(n) |
| **Space Complexity** | O(h) | O(n) |
| **Implementation** | Simple | Moderate |
| **Memory Usage** | Lower for shallow trees | Higher due to queue/map |
| **LeetCode Optimal** | ✅ | ✅ |
| **Difficulty** | Easy | Easy |

**Best Approach:** Use Approach 1 (DFS Recursive) for its simplicity and lower space complexity.

---

## Why This Problem is Important

### Interview Relevance

- **Frequency**: Occasionally asked in technical interviews
- **Companies**: Google, Microsoft, Amazon
- **Difficulty**: Easy
- **Concepts Tested**: Tree Traversal, DFS, BFS, Deep Copy

### Learning Outcomes

1. **Tree Traversal**: Master DFS and BFS on N-ary trees
2. **Deep Copy**: Understand the difference between deep and shallow copies
3. **Recursion**: Practice recursive tree problems
4. **Iterative**: Learn alternative approaches using queues

---

## Related Problems

Based on similar themes (tree cloning, traversal):

| Problem | LeetCode Link | Description |
|---------|---------------|-------------|
| Clone Graph | [Link](https://leetcode.com/problems/clone-graph/) | Clone an undirected graph |
| Copy List with Random Pointer | [Link](https://leetcode.com/problems/copy-list-with-random-pointer/) | Deep copy linked list |
| Convert Binary Search Tree to Sorted Doubly Linked List | [Link](https://leetcode.com/problems/convert-bst-to-sorted-doubly-linked-list/) | BST to linked list |

### Pattern Reference

For more detailed explanations of tree traversal, see:
- **[Tree DFS](/patterns/tree-dfs)**
- **[Tree BFS](/patterns/tree-bfs)**

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining the problem and solutions:

### Recommended Tutorials

1. **[NeetCode - Clone N-ary Tree](https://www.youtube.com/watch?v=U1hZ3O8f5Ew)** - Clear explanation
2. **[N-ary Tree Traversal](https://www.youtube.com/watch?v=Y5rRjb2hL8w)** - N-ary tree concepts

### Related Concepts

- **[DFS on Trees](https://www.youtube.com/watch?v=1BtM-YdVnws)** - DFS fundamentals
- **[BFS on Trees](https://www.youtube.com/watch?v=86G2d1I4k8U)** - BFS fundamentals

---

## Follow-up Questions

### Q1: How would you handle very deep N-ary trees?

**Answer:** Use the BFS (iterative) approach to avoid recursion stack overflow. BFS uses a queue which can handle arbitrarily deep trees.

### Q2: Can you clone a tree with random pointers like the linked list problem?

**Answer:** Yes, similar to "Copy List with Random Pointer", you would use a hash map to track the mapping between original and cloned nodes. This allows you to handle both children and any additional pointers.

### Q3: How would you verify that the tree was correctly cloned?

**Answer:** Perform a traversal (preorder) on both trees and compare values. Also verify that no node references in the cloned tree point to nodes in the original tree.

### Q4: What if you need to clone only a subtree?

**Answer:** Simply pass the subtree root to the clone function. The algorithm works for any root - it will clone that node and all its descendants.

---

## Common Pitfalls

### 1. Shallow Copy
**Issue:** Creating references to original nodes instead of new nodes.

**Solution:** Always create new Node objects with the same value.

### 2. Not Initializing Children List
**Issue:** Getting null pointer exception when accessing children.

**Solution:** Initialize children with empty list: `Node(val, [])` or `new ArrayList<>()`.

### 3. Forgetting Base Case
**Issue:** Not handling null root.

**Solution:** Always check `if (!root) return null;` at the start.

### 4. Stack Overflow
**Issue:** Recursion depth too large for deep trees.

**Solution:** Use BFS (iterative) approach for very deep trees.

### 5. Not Cloning All Children
**Issue:** Missing some children in the clone.

**Solution:** Ensure you iterate through all children and add each cloned child.

---

## Summary

The **Clone N-Ary Tree** problem demonstrates the **Tree Traversal** pattern:

- **Deep Copy**: Create new nodes, not references
- **DFS/BFS**: Either approach works effectively
- **Recursive Structure**: Tree naturally lends itself to recursion
- **Time complexity**: O(n) - optimal

Key takeaways:
1. Create new nodes for each original node
2. Recursively clone all children
3. Handle base case (null root)
4. Use BFS for very deep trees
5. Verify no reference sharing in clone

This pattern extends to:
- Graph cloning problems
- Linked list deep copy
- Tree serialization/deserialization
- Any structure requiring deep copy

---

## Additional Resources

- [LeetCode Problem 1490](https://leetcode.com/problems/clone-n-ary-tree/) - Official problem page
- [Tree Traversal - GeeksforGeeks](https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-postorder/) - Traversal explanations
- [DFS on Trees](https://www.geeksforgeeks.org/depth-first-search-traversal-of-a-binary-tree/) - DFS fundamentals
- [Pattern: Tree DFS](/patterns/tree-dfs) - Comprehensive pattern guide
