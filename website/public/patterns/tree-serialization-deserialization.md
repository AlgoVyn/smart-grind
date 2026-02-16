# Tree - Serialization and Deserialization

## Overview

Serialization and Deserialization is a fundamental problem in computer science that deals with converting a data structure into a format that can be easily stored or transmitted, and then reconstructing it from that format. In the context of binary trees, this means converting a tree structure into a string (or array) representation and then rebuilding the tree from that representation.

This pattern is essential for:
- **Data persistence**: Storing tree structures in databases or files
- **Network transmission**: Sending tree structures over networks
- **Distributed computing**: Sharing tree data between systems
- **Deep copying**: Creating independent copies of trees
- **Tree reconstruction**: Rebuilding trees from various representations

**Why Use This Pattern?**

- **Versatility**: Works with any tree structure
- **Efficiency**: Can be optimized for different use cases
- **Foundation**: Forms the basis for many tree-related algorithms
- **Interview importance**: Frequently asked in technical interviews

---

## Intuition

### Core Concept

The intuition behind tree serialization stems from the need to represent a hierarchical structure in a linear format. A binary tree has a recursive structure where each node has:
- A value
- A left child (which is itself a subtree)
- A right child (which is itself a subtree)

To serialize, we need to encode:
1. The value of each node
2. The structure of the tree (which nodes exist and where)

To deserialize, we need to:
1. Parse the encoded data
2. Recursively reconstruct the tree structure

### Key Observations

1. **Recursive Nature**: Trees are inherently recursive - subtrees are themselves trees
2. **Null Representation**: We must explicitly handle null/empty nodes to preserve structure
3. **Order Matters**: The traversal order determines how we encode and decode
4. **Uniqueness**: A valid serialization should produce exactly one deserialized tree

### Common Serialization Formats

1. **Preorder Traversal**: Root → Left → Right (most common)
2. **Level Order Traversal**: Level by level (BFS)
3. **Inorder Traversal**: Left → Root → Right (requires special handling)
4. **Postorder Traversal**: Left → Right → Root

### When to Use Each Approach

- **Preorder**: Simple recursive deserialization, LeetCode's default format
- **Level Order**: Preserves tree shape, good for visual verification
- **Null Markers**: Essential to distinguish missing nodes

---

## Multiple Approaches with Code

We'll cover four main approaches:

1. **Preorder Traversal (Recursive)** - Most intuitive and commonly used
2. **Preorder Traversal (Iterative)** - Uses explicit stack instead of recursion
3. **Level Order (BFS)** - Uses queue, preserves tree structure visually
4. **Null-Separated Preorder** - More compact representation

---

## Approach 1: Preorder Traversal (Recursive)

This is the most intuitive approach. We traverse the tree in preorder (root, left, right) and encode each node. For null nodes, we use a special marker.

### Algorithm Steps

**Serialization:**
1. Start from the root
2. Add the node's value to the result
3. If left child exists, recursively serialize left subtree
4. If left child is null, add the null marker
5. If right child exists, recursively serialize right subtree
6. If right child is null, add the null marker

**Deserialization:**
1. Read the first value from the serialized string
2. Create a node with this value
3. Recursively deserialize the left subtree
4. Recursively deserialize the right subtree
5. Attach the subtrees to the current node

### Why It Works

Preorder traversal visits each node before its children, which allows us to:
1. Know the root value immediately when deserializing
2. Recursively build subtrees from remaining values
3. Handle null markers to know when to stop building a subtree

### Code Implementation

````carousel
```python
from typing import List, Optional
import json

# Definition for a binary tree node
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Codec:
    """
    Serialize and deserialize a binary tree using preorder traversal.
    
    This approach uses a recursive preorder traversal to encode the tree
    into a string and then rebuild it from the string.
    """
    
    def serialize(self, root: Optional[TreeNode]) -> str:
        """
        Serialize a binary tree to a string using preorder traversal.
        
        Args:
            root: The root of the binary tree
            
        Returns:
            A string representation of the tree
        """
        def preorder(node: Optional[TreeNode]) -> List[str]:
            if node is None:
                return ["#"]  # Null marker
            
            # Preorder: Root, Left, Right
            result = [str(node.val)]
            result.extend(preorder(node.left))
            result.extend(preorder(node.right))
            return result
        
        serialized = preorder(root)
        return ",".join(serialized)
    
    def deserialize(self, data: str) -> Optional[TreeNode]:
        """
        Deserialize a string back to a binary tree.
        
        Args:
            data: The serialized string representation
            
        Returns:
            The root of the reconstructed binary tree
        """
        if not data:
            return None
            
        values = iter(data.split(','))
        
        def build_tree() -> Optional[TreeNode]:
            val = next(values)
            if val == "#":  # Null marker
                return None
            
            node = TreeNode(int(val))
            node.left = build_tree()
            node.right = build_tree()
            return node
        
        return build_tree()


# Example usage
# codec = Codec()
# tree = TreeNode(1, TreeNode(2), TreeNode(3, TreeNode(4), TreeNode(5)))
# serialized = codec.serialize(tree)
# print(serialized)  # Output: "1,2,#,#,3,4,#,#,5,#,#"
# deserialized = codec.deserialize(serialized)
```

<!-- slide -->
```cpp
#include <iostream>
#include <sstream>
#include <vector>
#include <queue>
using namespace std;

// Definition for a binary tree node
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Codec {
public:
    /**
     * Serialize and deserialize a binary tree using preorder traversal.
     * 
     * This approach uses a recursive preorder traversal to encode the tree
     * into a string and then rebuild it from the string.
     */
    
    // Serializes a tree to a single string
    string serialize(TreeNode* root) {
        ostringstream output;
        serializeHelper(root, output);
        return output.str();
    }
    
    // Deserializes your encoded data to a tree
    TreeNode* deserialize(string data) {
        if (data.empty()) return nullptr;
        
        istringstream input(data);
        return deserializeHelper(input);
    }
    
private:
    void serializeHelper(TreeNode* node, ostringstream& output) {
        if (!node) {
            output << "#,";
            return;
        }
        
        // Preorder: Root, Left, Right
        output << node->val << ",";
        serializeHelper(node->left, output);
        serializeHelper(node->right, output);
    }
    
    TreeNode* deserializeHelper(istringstream& input) {
        string val;
        getline(input, val, ',');
        
        if (val == "#") {
            return nullptr;
        }
        
        TreeNode* node = new TreeNode(stoi(val));
        node->left = deserializeHelper(input);
        node->right = deserializeHelper(input);
        return node;
    }
};

// Example usage
// Codec codec;
// TreeNode* root = new TreeNode(1);
// root->left = new TreeNode(2);
// root->right = new TreeNode(3);
// string serialized = codec.serialize(root);
// TreeNode* deserialized = codec.deserialize(serialized);
```

<!-- slide -->
```java
import java.util.LinkedList;
import java.util.Queue;

public class Codec {
    /**
     * Serialize and deserialize a binary tree using preorder traversal.
     * 
     * This approach uses a recursive preorder traversal to encode the tree
     * into a string and then rebuild it from the string.
     */
    
    // Encodes a tree to a single string
    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        serializeHelper(root, sb);
        return sb.toString();
    }
    
    private void serializeHelper(TreeNode node, StringBuilder sb) {
        if (node == null) {
            sb.append("#,");
            return;
        }
        
        // Preorder: Root, Left, Right
        sb.append(node.val).append(",");
        serializeHelper(node.left, sb);
        serializeHelper(node.right, sb);
    }
    
    // Decodes your encoded data to a tree
    public TreeNode deserialize(String data) {
        if (data == null || data.isEmpty()) return null;
        
        Queue<String> queue = new LinkedList<>();
        for (String val : data.split(",")) {
            queue.offer(val);
        }
        
        return deserializeHelper(queue);
    }
    
    private TreeNode deserializeHelper(Queue<String> queue) {
        String val = queue.poll();
        
        if (val.equals("#")) {
            return null;
        }
        
        TreeNode node = new TreeNode(Integer.parseInt(val));
        node.left = deserializeHelper(queue);
        node.right = deserializeHelper(queue);
        return node;
    }
}

// Definition for a binary tree node
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int x) { val = x; }
}

// Example usage
// Codec codec = new Codec();
// TreeNode root = new TreeNode(1);
// root.left = new TreeNode(2);
// root.right = new TreeNode(3);
// String serialized = codec.serialize(root);
// TreeNode deserialized = codec.deserialize(serialized);
```

<!-- slide -->
```javascript
/**
 * Serialize and deserialize a binary tree using preorder traversal.
 * 
 * This approach uses a recursive preorder traversal to encode the tree
 * into a string and then rebuild it from the string.
 */

// Definition for a binary tree node
function TreeNode(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
}

var serialize = function(root) {
    /**
     * Serializes a tree to a string using preorder traversal.
     * 
     * @param {TreeNode} root - The root of the binary tree
     * @return {string} - A string representation of the tree
     */
    function preorder(node) {
        if (node === null) {
            return ["#"];
        }
        
        // Preorder: Root, Left, Right
        const result = [String(node.val)];
        result.push(...preorder(node.left));
        result.push(...preorder(node.right));
        return result;
    }
    
    return preorder(root).join(",");
};

var deserialize = function(data) {
    /**
     * Deserializes a string back to a binary tree.
     * 
     * @param {string} data - The serialized string
     * @return {TreeNode} - The root of the reconstructed tree
     */
    if (!data) return null;
    
    const values = data.split(",");
    let index = 0;
    
    function buildTree() {
        if (values[index] === "#") {
            index++;
            return null;
        }
        
        const node = new TreeNode(parseInt(values[index]));
        index++;
        node.left = buildTree();
        node.right = buildTree();
        return node;
    }
    
    return buildTree();
};

// Example usage
// const root = new TreeNode(1, new TreeNode(2), new TreeNode(3, new TreeNode(4), new TreeNode(5)));
// const serialized = serialize(root);
// console.log(serialized);  // Output: "1,2,#,#,3,4,#,#,5,#,#"
// const deserialized = deserialize(serialized);
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time (Serialize)** | O(n) - Visits each node once |
| **Time (Deserialize)** | O(n) - Processes each value once |
| **Space** | O(n) - Stores all node values plus null markers |

---

## Approach 2: Preorder Traversal (Iterative)

This approach uses an explicit stack instead of recursion to perform preorder traversal.

### Algorithm Steps

**Serialization:**
1. Use a stack to simulate recursive traversal
2. Process nodes in preorder fashion
3. Push right child before left child (so left is processed first)

**Deserialization:**
1. Use a queue to maintain order of values
2. Process values in preorder sequence
3. Use a queue to know which nodes have pending children

### Code Implementation

````carousel
```python
from collections import deque

class Codec:
    """
    Serialize and deserialize a binary tree using iterative preorder traversal.
    """
    
    def serialize(self, root: Optional[TreeNode]) -> str:
        """
        Serialize a binary tree using iterative preorder traversal.
        
        Args:
            root: The root of the binary tree
            
        Returns:
            A string representation of the tree
        """
        if not root:
            return ""
        
        stack = [root]
        result = []
        
        while stack:
            node = stack.pop()
            
            if node is None:
                result.append("#")
            else:
                result.append(str(node.val))
                # Push right first so left is processed first
                stack.append(node.right)
                stack.append(node.left)
        
        return ",".join(result)
    
    def deserialize(self, data: str) -> Optional[TreeNode]:
        """
        Deserialize a string using iterative approach with queue.
        
        Args:
            data: The serialized string
            
        Returns:
            The root of the reconstructed tree
        """
        if not data:
            return None
        
        values = deque(data.split(','))
        return self._build_tree(values)
    
    def _build_tree(self, values: deque) -> Optional[TreeNode]:
        val = values.popleft()
        
        if val == "#":
            return None
        
        node = TreeNode(int(val))
        node.left = self._build_tree(values)
        node.right = self._build_tree(values)
        
        return node
```

<!-- slide -->
```cpp
#include <iostream>
#include <sstream>
#include <stack>
#include <queue>
using namespace std;

class Codec {
public:
    // Serializes a tree to a single string (Iterative)
    string serialize(TreeNode* root) {
        if (!root) return "";
        
        stack<TreeNode*> st;
        st.push(root);
        string result;
        
        while (!st.empty()) {
            TreeNode* node = st.top();
            st.pop();
            
            if (!node) {
                result += "#,";
            } else {
                result += to_string(node->val) + ",";
                // Push right first so left is processed first
                st.push(node->right);
                st.push(node->left);
            }
        }
        
        return result;
    }
    
    // Deserializes your encoded data to a tree
    TreeNode* deserialize(string data) {
        if (data.empty()) return nullptr;
        
        queue<string> q;
        stringstream ss(data);
        string val;
        
        while (getline(ss, val, ',')) {
            q.push(val);
        }
        
        return buildTree(q);
    }
    
private:
    TreeNode* buildTree(queue<string>& q) {
        string val = q.front();
        q.pop();
        
        if (val == "#") return nullptr;
        
        TreeNode* node = new TreeNode(stoi(val));
        node->left = buildTree(q);
        node->right = buildTree(q);
        
        return node;
    }
};
```

<!-- slide -->
```java
import java.util.*;

public class Codec {
    // Encodes a tree to a single string (Iterative)
    public String serialize(TreeNode root) {
        if (root == null) return "";
        
        Stack<TreeNode> stack = new Stack<>();
        stack.push(root);
        StringBuilder sb = new StringBuilder();
        
        while (!stack.isEmpty()) {
            TreeNode node = stack.pop();
            
            if (node == null) {
                sb.append("#,");
            } else {
                sb.append(node.val).append(",");
                // Push right first so left is processed first
                stack.push(node.right);
                stack.push(node.left);
            }
        }
        
        return sb.toString();
    }
    
    // Decodes your encoded data to a tree
    public TreeNode deserialize(String data) {
        if (data == null || data.isEmpty()) return null;
        
        Queue<String> queue = new LinkedList<>();
        for (String val : data.split(",")) {
            queue.offer(val);
        }
        
        return buildTree(queue);
    }
    
    private TreeNode buildTree(Queue<String> queue) {
        String val = queue.poll();
        
        if (val.equals("#")) return null;
        
        TreeNode node = new TreeNode(Integer.parseInt(val));
        node.left = buildTree(queue);
        node.right = buildTree(queue);
        
        return node;
    }
}
```

<!-- slide -->
```javascript
var serialize = function(root) {
    /**
     * Serializes a tree to a string using iterative preorder.
     * 
     * @param {TreeNode} root - The root of the binary tree
     * @return {string} - A string representation
     */
    if (!root) return "";
    
    const stack = [root];
    const result = [];
    
    while (stack.length > 0) {
        const node = stack.pop();
        
        if (node === null) {
            result.push("#");
        } else {
            result.push(String(node.val));
            // Push right first so left is processed first
            stack.push(node.right);
            stack.push(node.left);
        }
    }
    
    return result.join(",");
};

var deserialize = function(data) {
    /**
     * Deserializes a string to a binary tree.
     * 
     * @param {string} data - The serialized string
     * @return {TreeNode} - The root of the tree
     */
    if (!data) return null;
    
    const queue = data.split(",");
    
    function buildTree() {
        const val = queue.shift();
        
        if (val === "#") return null;
        
        const node = new TreeNode(parseInt(val));
        node.left = buildTree();
        node.right = buildTree();
        
        return node;
    }
    
    return buildTree();
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time (Serialize)** | O(n) - Visits each node once |
| **Time (Deserialize)** | O(n) - Processes each value once |
| **Space** | O(n) - Stack/queue storage |

---

## Approach 3: Level Order (BFS)

This approach uses level-order traversal (BFS) to serialize and deserialize the tree. It preserves the visual structure of the tree.

### Algorithm Steps

**Serialization:**
1. Use a queue for BFS
2. Process nodes level by level
3. Include null markers for missing children
4. Continue until all nodes (including nulls) are processed

**Deserialization:**
1. Use a queue to process values
2. First value is always the root
3. For each non-null node, its next two values in queue are its children

### Why It Works

Level-order traversal processes nodes in the same order they appear in the tree structure. By including explicit null markers, we can exactly reconstruct the tree structure during deserialization.

### Code Implementation

````carousel
```python
from collections import deque

class Codec:
    """
    Serialize and deserialize a binary tree using level order traversal (BFS).
    """
    
    def serialize(self, root: Optional[TreeNode]) -> str:
        """
        Serialize using level order (BFS) traversal.
        
        Args:
            root: The root of the binary tree
            
        Returns:
            A string representation of the tree
        """
        if not root:
            return ""
        
        queue = deque([root])
        result = []
        
        while queue:
            node = queue.popleft()
            
            if node is None:
                result.append("#")
            else:
                result.append(str(node.val))
                queue.append(node.left)
                queue.append(node.right)
        
        return ",".join(result)
    
    def deserialize(self, data: str) -> Optional[TreeNode]:
        """
        Deserialize from level order representation.
        
        Args:
            data: The serialized string
            
        Returns:
            The root of the reconstructed tree
        """
        if not data:
            return None
        
        values = data.split(',')
        root = TreeNode(int(values[0]))
        queue = deque([root])
        
        i = 1
        while queue and i < len(values):
            node = queue.popleft()
            
            # Process left child
            if i < len(values) and values[i] != "#":
                node.left = TreeNode(int(values[i]))
                queue.append(node.left)
            i += 1
            
            # Process right child
            if i < len(values) and values[i] != "#":
                node.right = TreeNode(int(values[i]))
                queue.append(node.right)
            i += 1
        
        return root
```

<!-- slide -->
```cpp
#include <iostream>
#include <sstream>
#include <queue>
using namespace std;

class Codec {
public:
    // Serializes a tree to a single string (Level Order / BFS)
    string serialize(TreeNode* root) {
        if (!root) return "";
        
        queue<TreeNode*> q;
        q.push(root);
        string result;
        
        while (!q.empty()) {
            TreeNode* node = q.front();
            q.pop();
            
            if (!node) {
                result += "#,";
            } else {
                result += to_string(node->val) + ",";
                q.push(node->left);
                q.push(node->right);
            }
        }
        
        return result;
    }
    
    // Deserializes your encoded data to a tree
    TreeNode* deserialize(string data) {
        if (data.empty()) return nullptr;
        
        vector<string> values;
        stringstream ss(data);
        string val;
        
        while (getline(ss, val, ',')) {
            values.push_back(val);
        }
        
        queue<TreeNode*> q;
        TreeNode* root = new TreeNode(stoi(values[0]));
        q.push(root);
        
        int i = 1;
        while (!q.empty() && i < values.size()) {
            TreeNode* node = q.front();
            q.pop();
            
            // Left child
            if (i < values.size() && values[i] != "#") {
                node->left = new TreeNode(stoi(values[i]));
                q.push(node->left);
            }
            i++;
            
            // Right child
            if (i < values.size() && values[i] != "#") {
                node->right = new TreeNode(stoi(values[i]));
                q.push(node->right);
            }
            i++;
        }
        
        return root;
    }
};
```

<!-- slide -->
```java
import java.util.*;

public class Codec {
    // Encodes a tree to a single string (Level Order / BFS)
    public String serialize(TreeNode root) {
        if (root == null) return "";
        
        Queue<TreeNode> queue = new LinkedList<>();
        queue.offer(root);
        StringBuilder sb = new StringBuilder();
        
        while (!queue.isEmpty()) {
            TreeNode node = queue.poll();
            
            if (node == null) {
                sb.append("#,");
            } else {
                sb.append(node.val).append(",");
                queue.offer(node.left);
                queue.offer(node.right);
            }
        }
        
        return sb.toString();
    }
    
    // Decodes your encoded data to a tree
    public TreeNode deserialize(String data) {
        if (data == null || data.isEmpty()) return null;
        
        String[] values = data.split(",");
        Queue<TreeNode> queue = new LinkedList<>();
        
        TreeNode root = new TreeNode(Integer.parseInt(values[0]));
        queue.offer(root);
        
        int i = 1;
        while (!queue.isEmpty() && i < values.length) {
            TreeNode node = queue.poll();
            
            // Left child
            if (i < values.length && !values[i].equals("#")) {
                node.left = new TreeNode(Integer.parseInt(values[i]));
                queue.offer(node.left);
            }
            i++;
            
            // Right child
            if (i < values.length && !values[i].equals("#")) {
                node.right = new TreeNode(Integer.parseInt(values[i]));
                queue.offer(node.right);
            }
            i++;
        }
        
        return root;
    }
}
```

<!-- slide -->
```javascript
var serialize = function(root) {
    /**
     * Serializes a tree to a string using level order (BFS).
     * 
     * @param {TreeNode} root - The root of the binary tree
     * @return {string} - A string representation
     */
    if (!root) return "";
    
    const queue = [root];
    const result = [];
    
    while (queue.length > 0) {
        const node = queue.shift();
        
        if (node === null) {
            result.push("#");
        } else {
            result.push(String(node.val));
            queue.push(node.left);
            queue.push(node.right);
        }
    }
    
    return result.join(",");
};

var deserialize = function(data) {
    /**
     * Deserializes a string to a binary tree using BFS.
     * 
     * @param {string} data - The serialized string
     * @return {TreeNode} - The root of the tree
     */
    if (!data) return null;
    
    const values = data.split(",");
    const queue = [];
    
    const root = new TreeNode(parseInt(values[0]));
    queue.push(root);
    
    let i = 1;
    while (queue.length > 0 && i < values.length) {
        const node = queue.shift();
        
        // Left child
        if (i < values.length && values[i] !== "#") {
            node.left = new TreeNode(parseInt(values[i]));
            queue.push(node.left);
        }
        i++;
        
        // Right child
        if (i < values.length && values[i] !== "#") {
            node.right = new TreeNode(parseInt(values[i]));
            queue.push(node.right);
        }
        i++;
    }
    
    return root;
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Visits each node once |
| **Space** | O(n) - Queue storage |

### Visual Representation

For tree `1,2,3,#,#,4,5`:

```
    1
   / \
  2   3
     / \
    4   5

Level Order: 1,2,3,#,#,4,5,#,#,#,#
```

---

## Approach 4: JSON/Array Format

This approach uses a more compact representation, avoiding explicit null markers by using special conventions.

### Code Implementation

````carousel
```python
import json

class Codec:
    """
    Serialize and deserialize using JSON-like format.
    """
    
    def serialize(self, root: Optional[TreeNode]) -> str:
        """
        Serialize using JSON-like nested arrays.
        
        Args:
            root: The root of the binary tree
            
        Returns:
            A JSON string representation
        """
        def to_list(node):
            if node is None:
                return None
            return [node.val, to_list(node.left), to_list(node.right)]
        
        return json.dumps(to_list(root))
    
    def deserialize(self, data: str) -> Optional[TreeNode]:
        """
        Deserialize from JSON format.
        
        Args:
            data: The serialized JSON string
            
        Returns:
            The root of the reconstructed tree
        """
        def from_list(lst):
            if lst is None:
                return None
            node = TreeNode(lst[0])
            node.left = from_list(lst[1])
            node.right = from_list(lst[2])
            return node
        
        return from_list(json.loads(data))
```

<!-- slide -->
```cpp
#include <iostream>
#include <sstream>
#include <nlohmann/json.hpp>
using namespace nlohmann;

class Codec {
public:
    // Serializes a tree to JSON string
    string serialize(TreeNode* root) {
        json j = toJson(root);
        return j.dump();
    }
    
    // Deserializes JSON string to tree
    TreeNode* deserialize(string data) {
        json j = json::parse(data);
        return fromJson(j);
    }
    
private:
    json toJson(TreeNode* node) {
        if (!node) return nullptr;
        return {node->val, toJson(node->left), toJson(node->right)};
    }
    
    TreeNode* fromJson(json j) {
        if (j.is_null()) return nullptr;
        TreeNode* node = new TreeNode(j[0]);
        node->left = fromJson(j[1]);
        node->right = fromJson(j[2]);
        return node;
    }
};
```

<!-- slide -->
```java
import org.json.*;

public class Codec {
    // Encodes a tree to JSON string
    public String serialize(TreeNode root) {
        return toJson(root).toString();
    }
    
    // Decodes JSON string to tree
    public TreeNode deserialize(String data) {
        try {
            JSONObject json = new JSONObject(data);
            return fromJson(json);
        } catch (Exception e) {
            return null;
        }
    }
    
    private JSONObject toJson(TreeNode node) {
        if (node == null) return null;
        
        JSONObject obj = new JSONObject();
        obj.put("val", node.val);
        obj.put("left", toJson(node.left));
        obj.put("right", toJson(node.right));
        
        return obj;
    }
    
    private TreeNode fromJson(JSONObject json) {
        if (json == null) return null;
        
        TreeNode node = new TreeNode(json.getInt("val"));
        
        if (json.has("left") && !json.isNull("left")) {
            node.left = fromJson(json.getJSONObject("left"));
        }
        if (json.has("right") && !json.isNull("right")) {
            node.right = fromJson(json.getJSONObject("right"));
        }
        
        return node;
    }
}
```

<!-- slide -->
```javascript
var serialize = function(root) {
    /**
     * Serializes a tree to JSON string.
     * 
     * @param {TreeNode} root - The root of the binary tree
     * @return {string} - JSON string representation
     */
    function toJSON(node) {
        if (node === null) return null;
        return {
            val: node.val,
            left: toJSON(node.left),
            right: toJSON(node.right)
        };
    }
    
    return JSON.stringify(toJSON(root));
};

var deserialize = function(data) {
    /**
     * Deserializes JSON string to a binary tree.
     * 
     * @param {string} data - JSON string
     * @return {TreeNode} - The root of the tree
     */
    function fromJSON(obj) {
        if (obj === null) return null;
        
        const node = new TreeNode(obj.val);
        node.left = fromJSON(obj.left);
        node.right = fromJSON(obj.right);
        
        return node;
    }
    
    return fromJSON(JSON.parse(data));
};
```
````

### Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(n) - Visits each node once |
| **Space** | O(n) - JSON structure storage |
| **Advantage** | Human-readable, easy debugging |
| **Disadvantage** | More verbose, includes field names |

---

## Comparison of Approaches

| Aspect | Preorder (Recursive) | Preorder (Iterative) | Level Order (BFS) | JSON Format |
|--------|--------------------|--------------------|--------------------|--------------|
| **Time Complexity** | O(n) | O(n) | O(n) | O(n) |
| **Space Complexity** | O(n) | O(n) | O(n) | O(n) |
| **Readability** | High | Medium | Medium | High |
| **Human Readable** | Low | Low | Low | High |
| **Tree Shape Preserved** | Yes | Yes | Yes | Yes |
| **Implementation** | Simple | Moderate | Moderate | Simple |
| **LeetCode Preferred** | ✅ Yes | ❌ No | ❌ No | ❌ No |

**Where:**
- n = number of nodes in the tree

---

## Why These Approaches Work

### Preorder Traversal

The preorder approach works because:
1. The root value comes first in the serialized string
2. We immediately know the root when deserializing
3. The remaining values naturally divide into left and right subtree serializations
4. Recursion naturally handles the tree structure

### Level Order (BFS)

The level-order approach works because:
1. Nodes are processed in the same order they appear in the tree
2. The first value is always the root
3. Each node's children come immediately after it in the queue
4. Null markers explicitly indicate missing children

### JSON Format

The JSON approach works because:
1. JSON's nested structure mirrors the tree's recursive nature
2. Field names (val, left, right) provide clear structure
3. JSON libraries handle parsing automatically
4. The format is self-describing

All approaches share a common requirement: **explicit null markers** to distinguish between missing nodes and actual null values in the tree.

---

## Template Summary

### Python Template (Preorder - Recursive)

```python
from typing import Optional

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Codec:
    def serialize(self, root: Optional[TreeNode]) -> str:
        def preorder(node):
            if not node:
                return ["#"]
            return [str(node.val)] + preorder(node.left) + preorder(node.right)
        return ",".join(preorder(root))
    
    def deserialize(self, data: str) -> Optional[TreeNode]:
        if not data:
            return None
        values = iter(data.split(','))
        
        def build():
            val = next(values)
            if val == "#":
                return None
            node = TreeNode(int(val))
            node.left = build()
            node.right = build()
            return node
        return build()
```

### C++ Template (Preorder - Recursive)

```cpp
struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int x) : val(x), left(nullptr), right(nullptr) {}
};

class Codec {
public:
    string serialize(TreeNode* root) {
        ostringstream oss;
        serializeHelper(root, oss);
        return oss.str();
    }
    
    TreeNode* deserialize(string data) {
        if (data.empty()) return nullptr;
        istringstream iss(data);
        return deserializeHelper(iss);
    }
    
private:
    void serializeHelper(TreeNode* node, ostringstream& oss) {
        if (!node) {
            oss << "#,";
            return;
        }
        oss << node->val << ",";
        serializeHelper(node->left, oss);
        serializeHelper(node->right, oss);
    }
    
    TreeNode* deserializeHelper(istringstream& iss) {
        string val;
        getline(iss, val, ',');
        if (val == "#") return nullptr;
        TreeNode* node = new TreeNode(stoi(val));
        node->left = deserializeHelper(iss);
        node->right = deserializeHelper(iss);
        return node;
    }
};
```

### Java Template (Preorder - Recursive)

```java
public class Codec {
    public String serialize(TreeNode root) {
        StringBuilder sb = new StringBuilder();
        serializeHelper(root, sb);
        return sb.toString();
    }
    
    public TreeNode deserialize(String data) {
        if (data == null || data.isEmpty()) return null;
        Queue<String> queue = new LinkedList<>();
        for (String val : data.split(",")) {
            queue.offer(val);
        }
        return deserializeHelper(queue);
    }
    
    private void serializeHelper(TreeNode node, StringBuilder sb) {
        if (node == null) {
            sb.append("#,");
            return;
        }
        sb.append(node.val).append(",");
        serializeHelper(node.left, sb);
        serializeHelper(node.right, sb);
    }
    
    private TreeNode deserializeHelper(Queue<String> queue) {
        String val = queue.poll();
        if (val.equals("#")) return null;
        TreeNode node = new TreeNode(Integer.parseInt(val));
        node.left = deserializeHelper(queue);
        node.right = deserializeHelper(queue);
        return node;
    }
}

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int x) { val = x; }
}
```

### JavaScript Template (Preorder - Recursive)

```javascript
function TreeNode(val, left, right) {
    this.val = (val === undefined ? 0 : val);
    this.left = (left === undefined ? null : left);
    this.right = (right === undefined ? null : right);
}

function serialize(root) {
    function preorder(node) {
        if (node === null) return ["#"];
        return [String(node.val)].concat(preorder(node.left)).concat(preorder(node.right));
    }
    return preorder(root).join(",");
}

function deserialize(data) {
    if (!data) return null;
    const values = data.split(",");
    let index = 0;
    
    function build() {
        if (values[index] === "#") {
            index++;
            return null;
        }
        const node = new TreeNode(parseInt(values[index]));
        index++;
        node.left = build();
        node.right = build();
        return node;
    }
    
    return build();
}
```

---

## Related Problems

### Fundamental Problems

- **[Serialize and Deserialize Binary Tree (LeetCode 297)](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/)** - The classic problem
- **[Serialize and Deserialize BST (LeetCode 449)](https://leetcode.com/problems/serialize-and-deserialize-bst/)** - Binary Search Tree specific
- **[Encode N-ary Tree to Binary Tree (LeetCode 431)](https://leetcode.com/problems/encode-n-ary-tree-to-binary-tree/)** - N-ary tree encoding

### Variations

- **[Flatten Binary Tree to Linked List (LeetCode 114)](https://leetcode.com/problems/flatten-binary-tree-to-linked-list/)** - Tree to linked list
- **[Construct Binary Tree from Preorder and Inorder (LeetCode 105)](https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/)** - Tree reconstruction
- **[Construct Binary Tree from Inorder and Postorder (LeetCode 106)](https://leetcode.com/problems/construct-binary-tree-from-inorder-and-postorder-traversal/)** - Another reconstruction

### Related Patterns

- **[Tree DFS (Recursive Postorder Traversal)](../patterns/tree-dfs-recursive-postorder-traversal)** - Depth-first search on trees
- **[Tree BFS (Level Order Traversal)](../patterns/tree-bfs-level-order-traversal)** - Breadth-first search on trees
- **[Graph Deep Copy/Cloning](../patterns/graph-deep-copy-cloning)** - Similar concept for graphs

---

## Video Tutorial Links

Here are helpful YouTube tutorials explaining serialization and deserialization:

### Preorder Approach

- **[NeetCode - Serialize and Deserialize Binary Tree](https://www.youtube.com/watch?v=u4JAi2JJbI8)** - Clear explanation with visual examples
- **[LeetCode Official Solution](https://www.youtube.com/watch?v=-YbXySKrGnU)** - Official problem solution
- **[Back to Back SWE - Serialize Deserialize](https://www.youtube.com/watch?v=3XVTqDmR92Q)** - Detailed walkthrough

### Level Order Approach

- **[Level Order Serialization](https://www.youtube.com/watch?v=7uGWM0XfB4w)** - BFS approach explained
- **[BFS Tree Traversal](https://www.youtube.com/watch?v=6ZRhqVMRoTU)** - Understanding BFS

### Related Concepts

- **[Tree Traversals Explained](https://www.youtube.com/watch?v=1fbU8ZG1jWs)** - Preorder, Inorder, Postorder, Level Order
- **[Recursive Algorithms on Trees](https://www.youtube.com/watch?v=1AG3 iy7pB4)** - Understanding recursion on trees

---

## Follow-up Questions

### Q1: How would you optimize the serialization for space efficiency?

**Answer:** Several optimizations can reduce space:
1. Use delimiters only between values, not after the last
2. Use variable-length encoding for integers
3. Compress the string for transmission
4. Use integer arrays instead of strings

```python
# More compact representation
def serialize_compact(root):
    result = []
    stack = [root]
    while stack:
        node = stack.pop()
        if node:
            result.append(str(node.val))
            stack.append(node.right)
            stack.append(node.left)
        else:
            result.append("x")
    # Remove trailing null markers
    while result and result[-1] == "x":
        result.pop()
    return ",".join(result) if result else ""
```

---

### Q2: How would you handle very deep trees without stack overflow?

**Answer:** Use iterative approaches with explicit stack/queue, or implement your own stack:

```python
# Iterative deserialization to avoid recursion depth issues
def deserialize_iterative(data):
    if not data:
        return None
    
    values = data.split(',')
    root = TreeNode(int(values[0]))
    stack = [root]
    
    i = 1
    while stack and i < len(values):
        node = stack.pop()
        
        # Left child
        if values[i] != "#":
            node.left = TreeNode(int(values[i]))
            stack.append(node.left)
        i += 1
        
        # Right child
        if i < len(values) and values[i] != "#":
            node.right = TreeNode(int(values[i]))
            stack.append(node.right)
        i += 1
    
    return root
```

---

### Q3: How would you serialize a Binary Search Tree efficiently using its properties?

**Answer:** For BSTs, we can use the property that inorder traversal gives sorted values:

```python
# For BST only - more efficient
def serialize_bst(root):
    result = []
    
    def inorder(node):
        if not node:
            return
        inorder(node.left)
        result.append(str(node.val))
        inorder(node.right)
    
    inorder(root)
    return ",".join(result)

def deserialize_bst(data):
    if not data:
        return None
    
    values = list(map(int, data.split(',')))
    
    def build(low, high):
        if not values or values[0] < low or values[0] > high:
            return None
        
        val = values.pop(0)
        node = TreeNode(val)
        node.left = build(low, val)
        node.right = build(val, high)
        return node
    
    return build(float('-inf'), float('inf'))
```

---

### Q4: How would you add compression to the serialization?

**Answer:** Use compression algorithms:

```python
import zlib

def serialize_compressed(root):
    # Regular serialization
    serialized = serialize(root)
    # Compress
    compressed = zlib.compress(serialized.encode())
    # Encode to base64 for safe transmission
    import base64
    return base64.b64encode(compressed).decode()

def deserialize_compressed(data):
    import base64, zlib
    # Decode from base64
    decoded = base64.b64decode(data.encode())
    # Decompress
    decompressed = zlib.decompress(decoded).decode()
    # Deserialize
    return deserialize(decompressed)
```

---

### Q5: How would you handle trees with duplicate values?

**Answer:** Use type markers or unique identifiers:

```python
# Handle duplicate values by adding unique markers
def serialize_with_types(root):
    result = []
    
    def preorder(node, path=""):
        if not node:
            result.append(f"NULL:{path}")
            return
        result.append(f"VAL:{node.val}:{path}")
        preorder(node.left, path + "L")
        preorder(node.right, path + "R")
    
    preorder(root)
    return ",".join(result)
```

---

### Q6: What's the difference between serializing a Binary Tree vs Binary Search Tree?

**Answer:** Key differences:

| Aspect | Binary Tree | Binary Search Tree |
|--------|-------------|-------------------|
| **Structure** | No ordering required | Must maintain BST property |
| **Serialization** | Requires all null markers | Can use inorder for compactness |
| **Deserialization** | Straightforward | Must rebuild with BST property |
| **Space** | O(n) with null markers | O(n) without null markers |
| **Validation** | Not needed | Must validate BST property |

---

### Q7: How would you implement serialization for an N-ary tree?

**Answer:** Extend the binary tree approach:

```python
class Node:
    def __init__(self, val=None, children=None):
        self.val = val
        self.children = children or []

def serialize_nary(root):
    if not root:
        return "#"
    
    result = [str(root.val)]
    
    if root.children:
        result.append(str(len(root.children)))
        for child in root.children:
            result.append(serialize_nary(child))
    else:
        result.append("0")
    
    return ",".join(result)

def deserialize_nary(data):
    if data == "#":
        return None
    
    values = iter(data.split(','))
    val = next(values)
    num_children = int(next(values))
    
    node = Node(int(val))
    node.children = [deserialize_nary(",".join(values)) for _ in range(num_children)]
    
    return node
```

---

### Q8: How would you handle circular references in serialization?

**Answer:** Use visited sets or node IDs:

```python
# Handle trees that might have back-references (not typical for binary trees)
def serialize_with_ids(root):
    node_id = 0
    node_map = {}
    result = []
    
    def assign_ids(node):
        nonlocal node_id
        if not node:
            return None
        if node in node_map:
            return node_map[node]
        
        id = node_id
        node_map[node] = id
        node_id += 1
        
        return {"id": id, "val": node.val}
    
    # First pass: assign IDs
    def serialize_ids(node):
        node_info = assign_ids(node)
        if not node_info:
            return "#"
        
        return f"{node_info['id']}:{node_info['val']}"
    
    return ",".join([serialize_ids(root)])
```

---

### Q9: How would you verify the deserialized tree matches the original?

**Answer:** Compare traversals or use tree comparison algorithm:

```python
def trees_equal(root1, root2):
    if not root1 and not root2:
        return True
    if not root1 or not root2:
        return False
    
    # Compare both preorder and inorder traversals
    def preorder(node, result):
        if not node:
            result.append("#")
            return
        result.append(str(node.val))
        preorder(node.left, result)
        preorder(node.right, result)
    
    def inorder(node, result):
        if not node:
            result.append("#")
            return
        inorder(node.left, result)
        result.append(str(node.val))
        inorder(node.right, result)
    
    pre1, pre2 = [], []
    in1, in2 = [], []
    
    preorder(root1, pre1)
    preorder(root2, pre2)
    inorder(root1, in1)
    inorder(root2, in2)
    
    return pre1 == pre2 and in1 == in2
```

---

### Q10: What edge cases should be tested?

**Answer:**
- Empty tree (null root)
- Single node tree
- Complete binary tree
- Skewed tree (all left or all right children)
- Tree with duplicate values
- Very deep tree
- Tree with null markers at various positions
- Large tree (thousands of nodes)

---

## Common Pitfalls

### 1. Missing Null Markers
**Issue**: Forgetting to include markers for null nodes causes incorrect tree reconstruction.

**Solution**: Always include explicit null markers (#) for missing children.

```python
# Wrong: 1,2,3,#,#,4,5 - Could be multiple trees
# Correct: 1,2,#,#,3,4,#,#,5,#,# - Exactly one tree
```

---

### 2. Recursion Stack Overflow
**Issue**: For very deep trees, recursive deserialization may exceed stack limit.

**Solution**: Use iterative approaches with explicit stacks or increase recursion limit.

---

### 3. String Concatenation Efficiency
**Issue**: String concatenation in loops is O(n²) in some implementations.

**Solution**: Use list/array and join at the end, or use StringBuilder.

```python
# Inefficient
result = ""
for value in values:
    result += str(value) + ","

# Efficient
result = []
for value in values:
    result.append(str(value))
serialized = ",".join(result)
```

---

### 4. Delimiter Collision
**Issue**: Using a delimiter that might appear in node values.

**Solution**: Use escape sequences or choose delimiters that won't conflict with values.

---

### 5. Type Mismatch
**Issue**: Converting between strings and integers incorrectly.

**Solution**: Explicitly convert and validate types during parsing.

---

## Summary

The **Tree Serialization and Deserialization** pattern is a fundamental technique for converting tree structures to linear formats and back. Key takeaways:

1. **Multiple approaches available**: Preorder (recursive/iterative), Level Order (BFS), JSON format
2. **Null markers are essential**: They preserve tree structure information
3. **Preorder is most common**: Used in LeetCode's official solution
4. **Choose based on needs**: Consider readability, space, and use case
5. **Handle edge cases**: Empty trees, deep trees, duplicate values

This pattern is essential for:
- Data persistence
- Network transmission
- Deep copying
- Distributed computing
- Interview success

Understanding serialization/deserialization is crucial for any developer working with hierarchical data structures.

---

## Additional Resources

- [LeetCode Problem 297 - Serialize and Deserialize Binary Tree](https://leetcode.com/problems/serialize-and-deserialize-binary-tree/)
- [LeetCode Problem 449 - Serialize and Deserialize BST](https://leetcode.com/problems/serialize-and-deserialize-bst/)
- [GeeksforGeeks - Serialize and Deserialize a Binary Tree](https://www.geeksforgeeks.org/serialize-deserialize-binary-tree/)
- [GeeksforGeeks - Tree Traversals](https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-postorder/)
- [Visualization - Binary Tree Serialization](https://visualgo.net/en/bt serialization)
