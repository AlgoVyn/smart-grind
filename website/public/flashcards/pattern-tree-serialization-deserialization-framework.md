## Tree - Serialization & Deserialization: Framework

What is the complete code template for serializing and deserializing a binary tree?

<!-- front -->

---

### Framework: Tree Serialization

```
┌─────────────────────────────────────────────────────────────┐
│  TREE SERIALIZATION/DESERIALIZATION - TEMPLATE              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Key Insight: Encode tree structure into linear format      │
│                                                             │
│  1. Preorder Approach (Most Common):                        │
│     - Serialize: Root, Left, Right with null markers        │
│     - Deserialize: Read root, recursively build subtrees    │
│                                                             │
│  2. Null Markers Essential:                                 │
│     - Use "#" to indicate missing nodes                     │
│     - Preserves exact tree structure                        │
│                                                             │
│  3. Serializer Pattern:                                     │
│     - serialize(root): returns string                       │
│     - deserialize(data): returns TreeNode                   │
│                                                             │
│  4. Traversal Options:                                      │
│     - Preorder: Root first (LeetCode default)               │
│     - Level Order: BFS approach                             │
└─────────────────────────────────────────────────────────────┘
```

---

### Implementation: Preorder (Python)

```python
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

---

### Implementation: C++

```cpp
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

---

### Key Framework Elements

| Element | Purpose | Example |
|---------|---------|---------|
| `"#"` | Null marker | Indicates missing child node |
| `preorder()` | Serialize helper | Recursively encodes tree |
| `build()` | Deserialize helper | Recursively reconstructs tree |
| `iter()` / `istringstream` | Stream parsing | Process values sequentially |
| `","` | Delimiter | Separates node values |

---

### Why Preorder Works

1. **Root first**: Know root value immediately
2. **Natural division**: Left subtree values come before right
3. **Recursive reconstruction**: Build left, then right subtree
4. **Explicit structure**: Null markers define boundaries

<!-- back -->
