# Serialize and Deserialize Binary Tree

## Problem Description

Serialization is the process of converting a data structure or object into a sequence of bits so that it can be stored in a file or memory buffer, or transmitted across a network connection link to be reconstructed later. Deserialization is the reverse process - taking the serialized data and reconstructing the original data structure.

For binary trees, this means converting a binary tree into a string representation that can be stored or transmitted, and then reconstructing the exact binary tree from that string.

This is a fundamental problem that appears in many real-world applications:
- **Data Persistence**: Storing binary trees in databases or files
- **Network Transmission**: Sending tree structures between systems
- **Caching**: Caching tree data for faster retrieval
- **Distributed Computing**: Sharing tree data across different nodes

### Understanding the Problem

The challenge is to design an encoding scheme that:
1. **Preserves Tree Structure**: Every node's position must be captured
2. **Handles All Cases**: Must work with trees of any shape (skewed, complete, etc.)
3. **Is Efficient**: Both time and space should be optimized
4. **Is Reversible**: The original tree must be perfectly reconstructed

---

## Constraints

- The number of nodes in the tree is in the range `[0, 10^4]`
- `-1000 <= Node.val <= 1000`
- The tree is a binary tree (each node has at most two children)
- You may assume that the input is always a valid binary tree

---

## Example 1

**Input:**
```python
root = [1,2,3,null,null,4,5]
```

**Visual:**
```
       1
     /   \
    2     3
         / \
        4   5
```

**Output:**
```
[1,2,3,null,null,4,5]
```

**Explanation:**
- The tree has root value 1
- Left child of root is node with value 2
- Right child of root is node with value 3
- Node 3 has left child 4 and right child 5
- The serialization captures this exact structure

---

## Example 2

**Input:**
```
root = []
```

**Output:**
```
[]
```

**Explanation:**
- An empty tree serializes to an empty string or empty list

---

## Example 3

**Input:**
```python
root = [1]
```

**Visual:**
```
1
```

**Output:**
```
[1]
```

**Explanation:**
- A single node tree serializes to a single value

---

## Example 4

**Input:**
```python
root = [1,2,3,4,5]
```

**Visual:**
```
       1
     /   \
    2     3
   / \
  4   5
```

**Output:**
```
[1,2,3,4,5,null,null,null,null]
```

---

## Solution

This problem has multiple solution approaches, each with different trade-offs:

1. **Preorder Traversal (Recursive)** - Root-first approach
2. **Level Order (BFS)** - Level-by-level approach using queue
3. **Preorder (Iterative)** - Using stack instead of recursion
4. **Inorder + Preorder** - Using two traversals for verification

---

## Approach 1: Preorder Traversal (Recursive)

### Algorithm

The preorder traversal approach serializes the tree by visiting nodes in the order: Root → Left → Right. This order is chosen because:

1. The root is processed first, making it easy to identify where to start deserialization
2. The left subtree is fully serialized before the right, which helps in reconstruction
3. We use a special marker (like "null" or "#") to indicate missing nodes

**Serialization Process:**
1. If the current node is null, append a null marker to the result
2. Otherwise, append the node's value
3. Recursively serialize the left subtree
4. Recursively serialize the right subtree

**Deserialization Process:**
1. Split the serialized string into values
2. Use an iterator to process values sequentially
3. If the current value is null, return None
4. Otherwise, create a node and recursively deserialize left and right subtrees

### Code Implementation

````carousel
```python
from typing import Optional, List
import collections

# Definition for a binary tree node
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Codec:
    def serialize(self, root: Optional[TreeNode]) -> str:
        """
        Encodes a binary tree to a single string using preorder traversal.
        
        Args:
            root: The root node of the binary tree
            
        Returns:
            A string representation of the tree
        """
        def dfs(node: Optional[TreeNode]) -> None:
            if not node:
                res.append("null")
                return
            
            # Process current node (root)
            res.append(str(node.val))
            
            # Process left subtree
            dfs(node.left)
            
            # Process right subtree
            dfs(node.right)
        
        res = []
        dfs(root)
        return ",".join(res)
    
    def deserialize(self, data: str) -> Optional[TreeNode]:
        """
        Decodes the encoded data to a binary tree.
        
        Args:
            data: The serialized string representation of the tree
            
        Returns:
            The root node of the reconstructed binary tree
        """
        def dfs() -> Optional[TreeNode]:
            val = next(vals)
            
            if val == "null":
                return None
            
            # Create node with current value
            node = TreeNode(int(val))
            
            # Recursively build left subtree
            node.left = dfs()
            
            # Recursively build right subtree
            node.right = dfs()
            
            return node
        
        if not data:
            return None
        
        vals = iter(data.split(","))
        return dfs()

# Your Codec object will be instantiated and called as such:
# codec = Codec()
# codec.deserialize(codec.serialize(root))
```

<!-- slide -->
```cpp
/**
 * Definition for a binary tree node.
 * struct TreeNode {
 *     int val;
 *     TreeNode *left;
 *     TreeNode *right;
 *     TreeNode(int x) : val(x), left(NULL), right(NULL) {}
 * };
 */

class Codec {
private:
    // Helper function for serialization using preorder
    void serializeHelper(TreeNode* node, string& result) {
        if (!node) {
            result += "null,";
            return;
        }
        
        // Process current node
        result += to_string(node->val) + ",";
        
        // Process left subtree
        serializeHelper(node->left, result);
        
        // Process right subtree
        serializeHelper(node->right, result);
    }
    
    // Helper function for deserialization
    TreeNode* deserializeHelper(queue<string>& q) {
        string val = q.front();
        q.pop();
        
        if (val == "null") {
            return nullptr;
        }
        
        // Create node with current value
        TreeNode* node = new TreeNode(stoi(val));
        
        // Recursively build left and right subtrees
        node->left = deserializeHelper(q);
        node->right = deserializeHelper(q);
        
        return node;
    }
    
public:
    // Encodes a tree to a single string
    string serialize(TreeNode* root) {
        string result = "";
        serializeHelper(root, result);
        // Remove trailing comma
        if (!result.empty()) {
            result.pop_back();
        }
        return result;
    }
    
    // Decodes your encoded data to tree
    TreeNode* deserialize(string data) {
        if (data.empty()) {
            return nullptr;
        }
        
        // Split string into values
        stringstream ss(data);
        string val;
        queue<string> q;
        
        while (getline(ss, val, ',')) {
            q.push(val);
        }
        
        return deserializeHelper(q);
    }
};

// Your Codec object will be instantiated and called as such:
// Codec codec;
// codec.deserialize(codec.serialize(root));
```

<!-- slide -->
```java
/**
 * Definition for a binary tree node.
 * public class TreeNode {
 *     int val;
 *     TreeNode left;
 *     TreeNode right;
 *     TreeNode(int x) { val = x; }
 * }
 */

public class Codec {
    // Encodes a tree to a single string
    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        serializeHelper(root, sb);
        return sb.toString();
    }
    
    private void serializeHelper(TreeNode node, StringBuilder sb) {
        if (node == null) {
            sb.append("null,");
            return;
        }
        
        // Process current node
        sb.append(node.val).append(",");
        
        // Process left subtree
        serializeHelper(node.left, sb);
        
        // Process right subtree
        serializeHelper(node.right, sb);
    }
    
    // Decodes your encoded data to tree
    public TreeNode deserialize(String data) {
        if (data == null || data.isEmpty()) {
            return null;
        }
        
        Queue<String> q = new LinkedList<>(Arrays.asList(data.split(",")));
        return deserializeHelper(q);
    }
    
    private TreeNode deserializeHelper(Queue<String> q) {
        String val = q.poll();
        
        if (val.equals("null")) {
            return null;
        }
        
        // Create node with current value
        TreeNode node = new TreeNode(Integer.parseInt(val));
        
        // Recursively build left and right subtrees
        node.left = deserializeHelper(q);
        node.right = deserializeHelper(q);
        
        return node;
    }
}

// Your Codec object will be instantiated and called as such:
// Codec codec = new Codec();
// codec.deserialize(codec.serialize(root));
```

<!-- slide -->
```javascript
/**
 * Definition for a binary tree node.
 * function TreeNode(val) {
 *     this.val = val;
 *     this.left = this.right = null;
 * }
 */

var Codec = function() {};

/**
 * Encodes a tree to a single string.
 * 
 * @param {TreeNode} root
 * @return {string}
 */
Codec.prototype.serialize = function(root) {
    function serializeHelper(node) {
        if (node === null) {
            res.push("null");
            return;
        }
        
        // Process current node
        res.push(String(node.val));
        
        // Process left subtree
        serializeHelper(node.left);
        
        // Process right subtree
        serializeHelper(node.right);
    }
    
    const res = [];
    serializeHelper(root);
    return res.join(",");
};

/**
 * Decodes your encoded data to tree.
 * 
 * @param {string} data
 * @return {TreeNode}
 */
Codec.prototype.deserialize = function(data) {
    if (!data) return null;
    
    const values = data.split(",");
    let index = 0;
    
    function deserializeHelper() {
        const val = values[index++];
        
        if (val === "null") {
            return null;
        }
        
        // Create node with current value
        const node = new TreeNode(parseInt(val, 10));
        
        // Recursively build left and right subtrees
        node.left = deserializeHelper();
        node.right = deserializeHelper();
        
        return node;
    }
    
    return deserializeHelper();
};

/**
 * Your Codec object will be instantiated and called as such:
 * var codec = new Codec();
 * codec.deserialize(codec.serialize(root));
 */
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time (Serialize)** | O(n) - Visit each node exactly once |
| **Time (Deserialize)** | O(n) - Process each value exactly once |
| **Space (Serialize)** | O(n) - Storage for the serialized string |
| **Space (Deserialize)** | O(n) - For the queue/iterator + recursion stack O(h) |
| **Recursion Stack** | O(h) - Where h is the height of the tree |

---

## Approach 2: Level Order Traversal (BFS)

### Algorithm

Instead of depth-first search, we can use breadth-first search (level order traversal):

1. **Serialization**: Use a queue to process nodes level by level
   - Add each node's value to the result
   - Add non-null children to the queue
   - Continue until all nodes are processed

2. **Deserialization**: 
   - Read the first value to create the root
   - Use a queue to keep track of parent nodes
   - For each parent, assign left and right children from the next values in the list

### Code Implementation

````carousel
```python
from typing import Optional, List
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Codec:
    def serialize(self, root: Optional[TreeNode]) -> str:
        """
        Encodes a binary tree to a single string using level order traversal.
        
        Args:
            root: The root node of the binary tree
            
        Returns:
            A string representation of the tree
        """
        if not root:
            return ""
        
        # Use BFS/level order traversal
        result = []
        queue = deque([root])
        
        while queue:
            node = queue.popleft()
            
            if node:
                result.append(str(node.val))
                # Add children to queue (both null and non-null)
                queue.append(node.left)
                queue.append(node.right)
            else:
                result.append("null")
        
        # Remove trailing nulls for efficiency
        while result and result[-1] == "null":
            result.pop()
        
        return ",".join(result)
    
    def deserialize(self, data: str) -> Optional[TreeNode]:
        """
        Decodes the encoded data to a binary tree using level order reconstruction.
        
        Args:
            data: The serialized string representation of the tree
            
        Returns:
            The root node of the reconstructed binary tree
        """
        if not data:
            return None
        
        values = data.split(",")
        index = 0
        
        # Create root from first value
        root = TreeNode(int(values[index]))
        index += 1
        
        # Use queue for level order reconstruction
        queue = deque([root])
        
        while queue:
            node = queue.popleft()
            
            # Process left child
            if index < len(values):
                left_val = values[index]
                index += 1
                
                if left_val != "null":
                    node.left = TreeNode(int(left_val))
                    queue.append(node.left)
            
            # Process right child
            if index < len(values):
                right_val = values[index]
                index += 1
                
                if right_val != "null":
                    node.right = TreeNode(int(right_val))
                    queue.append(node.right)
        
        return root
```

<!-- slide -->
```cpp
class Codec {
public:
    // Encodes a tree to a single string using level order
    string serialize(TreeNode* root) {
        if (!root) return "";
        
        string result = "";
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
        
        // Remove trailing nulls
        while (!result.empty() && result.substr(result.find_last_of(",") - 3, 4) == "null") {
            result = result.substr(0, result.find_last_of(","));
        }
        
        if (!result.empty() && result.back() == ',') {
            result.pop_back();
        }
        
        return result;
    }
    
    // Decodes your encoded data to tree
    TreeNode* deserialize(string data) {
        if (data.empty()) return nullptr;
        
        vector<string> values;
        stringstream ss(data);
        string val;
        
        while (getline(ss, val, ',')) {
            values.push_back(val);
        }
        
        int index = 0;
        TreeNode* root = new TreeNode(stoi(values[index++]));
        
        queue<TreeNode*> q;
        q.push(root);
        
        while (!q.empty()) {
            TreeNode* node = q.front();
            q.pop();
            
            // Process left child
            if (index < values.size()) {
                if (values[index] != "null") {
                    node->left = new TreeNode(stoi(values[index]));
                    q.push(node->left);
                }
                index++;
            }
            
            // Process right child
            if (index < values.size()) {
                if (values[index] != "null") {
                    node->right = new TreeNode(stoi(values[index]));
                    q.push(node->right);
                }
                index++;
            }
        }
        
        return root;
    }
};
```

<!-- slide -->
```java
public class Codec {
    // Encodes a tree to a single string
    public String serialize(TreeNode root) {
        if (root == null) return "";
        
        StringBuilder sb = new StringBuilder();
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        
        while (!q.isEmpty()) {
            TreeNode node = q.poll();
            
            if (node != null) {
                sb.append(node.val).append(",");
                q.offer(node.left);
                q.offer(node.right);
            } else {
                sb.append("null,");
            }
        }
        
        // Remove trailing nulls
        String result = sb.toString();
        while (result.endsWith("null,")) {
            result = result.substring(0, result.lastIndexOf("null,"));
        }
        
        if (result.endsWith(",")) {
            result = result.substring(0, result.length() - 1);
        }
        
        return result;
    }
    
    // Decodes your encoded data to tree
    public TreeNode deserialize(String data) {
        if (data == null || data.isEmpty()) return null;
        
        String[] values = data.split(",");
        int index = 0;
        
        TreeNode root = new TreeNode(Integer.parseInt(values[index++]));
        
        Queue<TreeNode> q = new LinkedList<>();
        q.offer(root);
        
        while (!q.isEmpty()) {
            TreeNode node = q.poll();
            
            // Process left child
            if (index < values.length) {
                if (!values[index].equals("null")) {
                    node.left = new TreeNode(Integer.parseInt(values[index]));
                    q.offer(node.left);
                }
                index++;
            }
            
            // Process right child
            if (index < values.length) {
                if (!values[index].equals("null")) {
                    node.right = new TreeNode(Integer.parseInt(values[index]));
                    q.offer(node.right);
                }
                index++;
            }
        }
        
        return root;
    }
}
```

<!-- slide -->
```javascript
var Codec = function() {};

/**
 * Encodes a tree to a single string using level order
 * 
 * @param {TreeNode} root
 * @return {string}
 */
Codec.prototype.serialize = function(root) {
    if (!root) return "";
    
    const result = [];
    const queue = [root];
    
    while (queue.length > 0) {
        const node = queue.shift();
        
        if (node) {
            result.push(String(node.val));
            queue.push(node.left);
            queue.push(node.right);
        } else {
            result.push("null");
        }
    }
    
    // Remove trailing nulls
    while (result.length > 0 && result[result.length - 1] === "null") {
        result.pop();
    }
    
    return result.join(",");
};

/**
 * Decodes your encoded data to tree
 * 
 * @param {string} data
 * @return {TreeNode}
 */
Codec.prototype.deserialize = function(data) {
    if (!data) return null;
    
    const values = data.split(",");
    let index = 0;
    
    const root = new TreeNode(parseInt(values[index++], 10));
    const queue = [root];
    
    while (queue.length > 0) {
        const node = queue.shift();
        
        // Process left child
        if (index < values.length) {
            if (values[index] !== "null") {
                node.left = new TreeNode(parseInt(values[index], 10));
                queue.push(node.left);
            }
            index++;
        }
        
        // Process right child
        if (index < values.length) {
            if (values[index] !== "null") {
                node.right = new TreeNode(parseInt(values[index], 10));
                queue.push(node.right);
            }
            index++;
        }
    }
    
    return root;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time (Serialize)** | O(n) - Visit each node exactly once |
| **Time (Deserialize)** | O(n) - Process each value exactly once |
| **Space (Serialize)** | O(n) - Storage for queue (max width = ~n/2 for complete tree) |
| **Space (Deserialize)** | O(n) - For the queue |
| **Serialization Output** | May include trailing nulls (can be trimmed) |

---

## Approach 3: Preorder with Stack (Iterative)

### Algorithm

This approach eliminates recursion by using an explicit stack:

1. **Serialization**: Use a stack to simulate the recursive preorder traversal
2. **Deserialization**: Use a stack to reconstruct nodes in preorder fashion

### Code Implementation

````carousel
```python
from typing import Optional
import collections

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Codec:
    def serialize(self, root: Optional[TreeNode]) -> str:
        """
        Encodes a binary tree to a single string using iterative preorder traversal.
        """
        if not root:
            return ""
        
        result = []
        stack = [root]
        
        while stack:
            node = stack.pop()
            
            if node:
                result.append(str(node.val))
                # Push right first so left is processed first (LIFO)
                stack.append(node.right)
                stack.append(node.left)
            else:
                result.append("null")
        
        # Remove trailing nulls
        while result and result[-1] == "null":
            result.pop()
        
        return ",".join(result)
    
    def deserialize(self, data: str) -> Optional[TreeNode]:
        """
        Decodes the encoded data to a binary tree using iterative approach.
        """
        if not data:
            return None
        
        values = data.split(",")
        index = 0
        
        root = TreeNode(int(values[index]))
        index += 1
        
        stack = [root]
        
        while stack and index < len(values):
            parent = stack.pop()
            
            # Process left child
            if index < len(values):
                left_val = values[index]
                index += 1
                
                if left_val != "null":
                    parent.left = TreeNode(int(left_val))
                    stack.append(parent.left)
            
            # Process right child
            if index < len(values):
                right_val = values[index]
                index += 1
                
                if right_val != "null":
                    parent.right = TreeNode(int(right_val))
                    stack.append(parent.right)
        
        return root
```

<!-- slide -->
```cpp
class Codec {
public:
    // Encodes a tree to a single string using iterative preorder
    string serialize(TreeNode* root) {
        if (!root) return "";
        
        string result = "";
        stack<TreeNode*> st;
        st.push(root);
        
        while (!st.empty()) {
            TreeNode* node = st.top();
            st.pop();
            
            if (node) {
                result += to_string(node->val) + ",";
                st.push(node->right);
                st.push(node->left);
            } else {
                result += "null,";
            }
        }
        
        // Remove trailing nulls
        while (!result.empty() && result.substr(result.find_last_of(",") - 3, 4) == "null") {
            result = result.substr(0, result.find_last_of(","));
        }
        
        if (!result.empty() && result.back() == ',') {
            result.pop_back();
        }
        
        return result;
    }
    
    // Decodes your encoded data to tree
    TreeNode* deserialize(string data) {
        if (data.empty()) return nullptr;
        
        vector<string> values;
        stringstream ss(data);
        string val;
        
        while (getline(ss, val, ',')) {
            values.push_back(val);
        }
        
        int index = 0;
        TreeNode* root = new TreeNode(stoi(values[index++]));
        
        stack<TreeNode*> st;
        st.push(root);
        
        while (!st.empty() && index < values.size()) {
            TreeNode* parent = st.top();
            st.pop();
            
            // Process left child
            if (index < values.size()) {
                if (values[index] != "null") {
                    parent->left = new TreeNode(stoi(values[index]));
                    st.push(parent->left);
                }
                index++;
            }
            
            // Process right child
            if (index < values.size()) {
                if (values[index] != "null") {
                    parent->right = new TreeNode(stoi(values[index]));
                    st.push(parent->right);
                }
                index++;
            }
        }
        
        return root;
    }
};
```

<!-- slide -->
```java
public class Codec {
    // Encodes a tree to a single string
    public String serialize(TreeNode root) {
        if (root == null) return "";
        
        StringBuilder sb = new StringBuilder();
        Stack<TreeNode> stack = new Stack<>();
        stack.push(root);
        
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            
            if (node != null) {
                sb.append(node.val).append(",");
                stack.push(node.right);
                stack.push(node.left);
            } else {
                sb.append("null,");
            }
        }
        
        String result = sb.toString();
        while (result.endsWith("null,")) {
            result = result.substring(0, result.lastIndexOf("null,"));
        }
        
        if (result.endsWith(",")) {
            result = result.substring(0, result.length() - 1);
        }
        
        return result;
    }
    
    // Decodes your encoded data to tree
    public TreeNode deserialize(String data) {
        if (data == null || data.isEmpty()) return null;
        
        String[] values = data.split(",");
        int index = 0;
        
        TreeNode root = new TreeNode(Integer.parseInt(values[index++]));
        
        Stack<TreeNode> stack = new Stack<>();
        stack.push(root);
        
        while (!stack.isEmpty() && index < values.length) {
            TreeNode parent = stack.pop();
            
            // Process left child
            if (index < values.length) {
                if (!values[index].equals("null")) {
                    parent.left = new TreeNode(Integer.parseInt(values[index]));
                    stack.push(parent.left);
                }
                index++;
            }
            
            // Process right child
            if (index < values.length) {
                if (!values[index].equals("null")) {
                    parent.right = new TreeNode(Integer.parseInt(values[index]));
                    stack.push(parent.right);
                }
                index++;
            }
        }
        
        return root;
    }
}
```

<!-- slide -->
```javascript
var Codec = function() {};

/**
 * Encodes a tree to a single string using iterative preorder
 * 
 * @param {TreeNode} root
 * @return {string}
 */
Codec.prototype.serialize = function(root) {
    if (!root) return "";
    
    const result = [];
    const stack = [root];
    
    while (stack.length > 0) {
        const node = stack.pop();
        
        if (node) {
            result.push(String(node.val));
            // Push right first so left is processed first
            stack.push(node.right);
            stack.push(node.left);
        } else {
            result.push("null");
        }
    }
    
    // Remove trailing nulls
    while (result.length > 0 && result[result.length - 1] === "null") {
        result.pop();
    }
    
    return result.join(",");
};

/**
 * Decodes your encoded data to tree
 * 
 * @param {string} data
 * @return {TreeNode}
 */
Codec.prototype.deserialize = function(data) {
    if (!data) return null;
    
    const values = data.split(",");
    let index = 0;
    
    const root = new TreeNode(parseInt(values[index++], 10));
    const stack = [root];
    
    while (stack.length > 0 && index < values.length) {
        const parent = stack.pop();
        
        // Process left child
        if (index < values.length) {
            if (values[index] !== "null") {
                parent.left = new TreeNode(parseInt(values[index], 10));
                stack.push(parent.left);
            }
            index++;
        }
        
        // Process right child
        if (index < values.length) {
            if (values[index] !== "null") {
                parent.right = new TreeNode(parseInt(values[index], 10));
                stack.push(parent.right);
            }
            index++;
        }
    }
    
    return root;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time (Serialize)** | O(n) - Visit each node exactly once |
| **Time (Deserialize)** | O(n) - Process each value exactly once |
| **Space (Serialize)** | O(n) - Stack size + result storage |
| **Space (Deserialize)** | O(n) - Stack size |
| **Benefit** | No recursion stack overflow for deep trees |

---

## Approach 4: Optimized Preorder (No Null Markers for Full Trees)

### Algorithm

This approach optimizes the serialization for complete or near-complete binary trees:

1. For serialization, we can omit trailing nulls since we know when to stop
2. We can also store the size of the tree to help with deserialization

However, this approach has limitations when dealing with sparse trees. Let's implement a balanced approach that handles all cases efficiently.

### Code Implementation

````carousel
```python
from typing import Optional
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Codec:
    def serialize(self, root: Optional[TreeNode]) -> str:
        """
        Encodes a binary tree to a single string using preorder traversal.
        Optimized to handle edge cases efficiently.
        """
        def preorder(node):
            if not node:
                return ["#"]
            
            result = [str(node.val)]
            result.extend(preorder(node.left))
            result.extend(preorder(node.right))
            return result
        
        if not root:
            return ""
        
        serialized = preorder(root)
        # Remove trailing nulls for efficiency
        while serialized and serialized[-1] == "#":
            serialized.pop()
        
        return ",".join(serialized)
    
    def deserialize(self, data: str) -> Optional[TreeNode]:
        """
        Decodes the encoded data to a binary tree.
        """
        if not data:
            return None
        
        values = deque(data.split(","))
        
        def build():
            val = values.popleft()
            
            if val == "#":
                return None
            
            node = TreeNode(int(val))
            node.left = build()
            node.right = build()
            return node
        
        return build()
```

<!-- slide -->
```cpp
class Codec {
private:
    void preorder(TreeNode* node, string& result) {
        if (!node) {
            result += "#,";
            return;
        }
        
        result += to_string(node->val) + ",";
        preorder(node->left, result);
        preorder(node->right, result);
    }
    
    TreeNode* build(queue<string>& q) {
        string val = q.front();
        q.pop();
        
        if (val == "#") {
            return nullptr;
        }
        
        TreeNode* node = new TreeNode(stoi(val));
        node->left = build(q);
        node->right = build(q);
        
        return node;
    }
    
public:
    // Encodes a tree to a single string
    string serialize(TreeNode* root) {
        string result = "";
        preorder(root, result);
        
        // Remove trailing nulls
        while (!result.empty() && result.substr(result.find_last_of(",") - 3, 4) == "#,") {
            result = result.substr(0, result.find_last_of(","));
        }
        
        if (!result.empty() && result.back() == ',') {
            result.pop_back();
        }
        
        return result;
    }
    
    // Decodes your encoded data to tree
    TreeNode* deserialize(string data) {
        if (data.empty()) return nullptr;
        
        stringstream ss(data);
        string val;
        queue<string> q;
        
        while (getline(ss, val, ',')) {
            q.push(val);
        }
        
        return build(q);
    }
};
```

<!-- slide -->
```java
public class Codec {
    private void preorder(TreeNode node, StringBuilder sb) {
        if (node == null) {
            sb.append("#,");
            return;
        }
        
        sb.append(node.val).append(",");
        preorder(node.left, sb);
        preorder(node.right, sb);
    }
    
    private TreeNode build(Queue<String> q) {
        String val = q.poll();
        
        if (val.equals("#")) {
            return null;
        }
        
        TreeNode node = new TreeNode(Integer.parseInt(val));
        node.left = build(q);
        node.right = build(q);
        
        return node;
    }
    
    // Encodes a tree to a single string
    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        preorder(root, sb);
        
        String result = sb.toString();
        if (result.isEmpty()) return "";
        
        // Remove trailing nulls
        while (result.endsWith("#,")) {
            result = result.substring(0, result.lastIndexOf("#,"));
        }
        
        if (result.endsWith(",")) {
            result = result.substring(0, result.length() - 1);
        }
        
        return result;
    }
    
    // Decodes your encoded data to tree
    public TreeNode deserialize(String data) {
        if (data == null || data.isEmpty()) return null;
        
        Queue<String> q = new LinkedList<>(Arrays.asList(data.split(",")));
        return build(q);
    }
}
```

<!-- slide -->
```javascript
var Codec = function() {};

/**
 * Encodes a tree to a single string using preorder traversal
 * 
 * @param {TreeNode} root
 * @return {string}
 */
Codec.prototype.serialize = function(root) {
    function preorder(node) {
        if (node === null) {
            return ["#"];
        }
        
        const result = [String(node.val)];
        result.push(...preorder(node.left));
        result.push(...preorder(node.right));
        return result;
    }
    
    if (!root) return "";
    
    const serialized = preorder(root);
    
    // Remove trailing nulls for efficiency
    while (serialized.length > 0 && serialized[serialized.length - 1] === "#") {
        serialized.pop();
    }
    
    return serialized.join(",");
};

/**
 * Decodes your encoded data to tree
 * 
 * @param {string} data
 * @return {TreeNode}
 */
Codec.prototype.deserialize = function(data) {
    if (!data) return null;
    
    const values = data.split(",");
    let index = 0;
    
    function build() {
        const val = values[index++];
        
        if (val === "#") {
            return null;
        }
        
        const node = new TreeNode(parseInt(val, 10));
        node.left = build();
        node.right = build();
        
        return node;
    }
    
    return build();
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time (Serialize)** | O(n) - Visit each node exactly once |
| **Time (Deserialize)** | O(n) - Process each value exactly once |
| **Space (Serialize)** | O(n) - For the serialized output |
| **Space (Deserialize)** | O(n) - Queue + recursion stack O(h) |
| **Optimization** | Trailing nulls are trimmed for smaller output |

---

## Comparison of Approaches

| Approach | Serialize Time | Deserialize Time | Space | Pros | Cons |
|----------|----------------|------------------|-------|------|------|
| **Preorder Recursive** | O(n) | O(n) | O(n) + O(h) | Simple, intuitive | Stack overflow for deep trees |
| **Level Order BFS** | O(n) | O(n) | O(n) | Preserves level order | Larger output for sparse trees |
| **Preorder Iterative** | O(n) | O(n) | O(n) | No recursion limits | Slightly more complex |
| **Optimized Preorder** | O(n) | O(n) | O(n) + O(h) | Smaller output | Slightly complex trimming |

**Recommendation:** For most use cases, the recursive preorder approach is recommended because it's:
1. Simple and easy to understand
2. Naturally reconstructs the tree
3. Works well for most tree sizes

Use BFS/Level Order when:
- You need to preserve level information
- The tree is relatively balanced
- You want to stream the data

---

## Explanation

### Why Preorder Works

Preorder traversal (Root → Left → Right) is ideal for serialization because:

1. **Root First**: The root is processed first, providing a clear starting point for reconstruction
2. **Deterministic Order**: The order is always the same, ensuring the same tree always produces the same string
3. **Self-Describing**: With null markers, the sequence uniquely identifies the tree structure

### Handling Null Nodes

We use a special marker (like "null" or "#") to represent missing nodes. This ensures:
- We know exactly how to reconstruct the tree structure
- We can handle any tree shape (skewed, sparse, complete)
- The deserialization process always knows when to stop processing a subtree

### Visualizing the Process

For the tree:
```
       1
     /   \
    2     3
         / \
        4   5
```

**Serialization (Preorder):**
```
1,2,null,null,3,4,null,null,5,null,null
```

**Deserialization:**
1. Read 1 → Create root
2. Read 2 → Create left child
3. Read null → No left child for node 2
4. Read null → No right child for node 2
5. Read 3 → Create right child of root
6. Read 4 → Create left child of node 3
7. ... and so on

---

## Followup Questions

### Q1: How would you optimize the serialization for memory-constrained environments?

**Answer:** Consider using bit-packing techniques or compressing the output. For integer values, you can use a fixed number of bits per value. You can also use run-length encoding if there are many consecutive null values. Another option is to use a more compact serialization format like Protocol Buffers or MessagePack.

### Q2: How would you handle very deep trees (10^5+ nodes)?

**Answer:** Use iterative approaches instead of recursive ones to avoid stack overflow. The iterative preorder or level order approaches work well. You might also consider processing the tree in chunks or using a streaming approach for extremely large trees.

### Q3: How would you verify that deserialization produces the exact same tree?

**Answer:** Run a second serialization on the deserialized tree and compare the results. They should be identical. Alternatively, you can do a structural comparison by traversing both trees simultaneously and checking that all node values and positions match.

### Q4: How would you handle trees with duplicate values?

**Answer:** The current approaches handle duplicate values correctly since we serialize both the value AND the position. Each node's position in the tree is uniquely determined by the sequence of left/right choices during traversal.

### Q5: How would you modify the solution to serialize only non-null nodes?

**Answer:** This is tricky because you lose positional information. One approach is to use a size-prefixed format: first store the count of nodes, then store only the non-null values in breadth-first order. During deserialization, you use the count to know when to stop and fill missing positions.

### Q6: How would you add error handling for corrupted serialization data?

**Answer:** Add validation during deserialization:
- Check for unexpected end of data
- Validate that null markers are in valid positions
- Verify that all values can be parsed as integers
- Use checksums or CRC to detect data corruption

### Q7: How would you make the serialization format human-readable?

**Answer:** Use JSON format with explicit position encoding. For example:
```json
{"val": 1, "left": {"val": 2, "left": null, "right": null}, "right": {...}}
```

This is more verbose but easier to debug and read.

### Q8: How would you handle serialization of trees with custom objects as node values?

**Answer:** Convert custom objects to primitives first (using JSON serialization or a custom toString method), then proceed with the standard serialization. During deserialization, convert the primitives back to custom objects.

---

## Related Problems

- [Serialize and Deserialize BST](https://leetcode.com/problems/serialize-and-deserialize-bst/) - Similar problem but for Binary Search Trees with potentially smaller output
- [Encode and Decode TinyURL](https://leetcode.com/problems/encode-and-decode-tinyurl/) - Similar concept applied to URLs
- [Serialize Binary Search Tree](https://leetcode.com/problems/serialize-binary-search-tree/) - Different approach taking advantage of BST properties
- [Construct Binary Tree from Preorder and Inorder Traversal](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/) - Uses two traversals to reconstruct
- [Flatten Binary Tree to Linked List](https://leetcode.com/problems/flatten-binary-tree-to-linked-list/) - Related tree manipulation
- [Binary Tree Level Order Traversal](https://leetcode.com/problems/binary-tree-level-order-traversal/) - BFS fundamentals
- [Validate Binary Search Tree](https://leetcode.com/problems/validate-binary-search-tree/) - Tree validation

---

## Video Tutorials

- [Serialize and Deserialize Binary Tree - LeetCode 297](https://www.youtube.com/watch?v=u4JAi2JJ5s8)
- [Binary Tree Serialization Explained](https://www.youtube.com/watch?v=6B-0mXoKf6I)
- [Preorder Traversal for Serialization](https://www.youtube.com/watch?v=n6Qwn7W4O-4)
- [BFS vs DFS for Tree Serialization](https://www.youtube.com/watch?v=-564zP-Io8k)

---

## Summary

The Serialize and Deserialize Binary Tree problem is a fundamental tree problem with many practical applications. Key takeaways:

1. **Preorder is Natural**: Root-first traversal makes reconstruction straightforward
2. **Null Markers**: Essential for preserving tree structure (especially for sparse trees)
3. **Multiple Approaches**: Choose based on your needs (BFS for level info, DFS for simplicity)
4. **Complexity**: O(n) time and space is optimal - you must visit/process every node
5. **Trade-offs**: Different approaches have different memory usage patterns and output sizes

The recursive preorder approach is recommended for most interviews and general use cases due to its simplicity and clarity. However, always consider your specific constraints (tree depth, memory, etc.) when choosing an approach.

---

*Note: This solution follows the standard LeetCode problem format. The exact method signatures may vary slightly depending on the platform. The core algorithms remain the same.*
