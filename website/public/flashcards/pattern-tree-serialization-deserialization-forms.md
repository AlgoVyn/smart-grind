## Tree - Serialization & Deserialization: Forms

What are the different problem variations and forms of tree serialization?

<!-- front -->

---

### Form 1: Basic Binary Tree (LeetCode 297)

**Problem**: Serialize and deserialize any binary tree.

**Input/Output**:
- Serialize: TreeNode → string
- Deserialize: string → TreeNode

**Key Requirements**:
- Handle arbitrary binary tree structure
- Null markers mandatory
- Exact reconstruction required

**Example**:
```
Input:  Tree [1,2,3,null,null,4,5]
Output: "1,2,#,#,3,4,#,#,5,#,#"
```

---

### Form 2: Binary Search Tree (LeetCode 449)

**Problem**: Serialize/deserialize BST with optimization.

**Optimization**: Use BST property to reduce space.

```python
# BST can use inorder (sorted) + preorder
def serialize_bst(root):
    """Only store preorder, BST property gives structure."""
    result = []
    def preorder(node):
        if not node:
            return
        result.append(str(node.val))
        preorder(node.left)
        preorder(node.right)
    preorder(root)
    return ",".join(result)

def deserialize_bst(data):
    """Build BST from preorder traversal."""
    if not data:
        return None
    values = list(map(int, data.split(',')))
    
    def build(min_val, max_val):
        if not values or not (min_val < values[0] < max_val):
            return None
        val = values.pop(0)
        node = TreeNode(val)
        node.left = build(min_val, val)
        node.right = build(val, max_val)
        return node
    
    return build(float('-inf'), float('inf'))
```

---

### Form 3: N-ary Tree (LeetCode 428)

**Problem**: Serialize tree with arbitrary number of children.

**Approach**: Store child count before children.

```python
def serialize_nary(root):
    if not root:
        return "#"
    
    result = [str(root.val)]
    result.append(str(len(root.children)))  # Store count
    
    for child in root.children:
        result.append(serialize_nary(child))
    
    return ",".join(result)
```

---

### Form 4: String-Encoded N-ary Tree

**Problem**: Compact string representation for N-ary trees.

**Format**: `[value [child1] [child2] ...]`

```
Tree:      1
         / | \
        2  3  4

Serialized: "1[2][3][4]"
```

---

### Form 5: Tree to Linked List (Flatten)

**Problem**: Serialize to preorder linked list (LeetCode 114).

**Approach**: Modify tree in-place to linked list.

```python
def flatten(root):
    """Flatten tree to linked list in-place (preorder)."""
    if not root:
        return
    
    # Flatten subtrees
    flatten(root.left)
    flatten(root.right)
    
    # Reconnect: root -> left subtree -> right subtree
    if root.left:
        # Find end of left subtree
        rightmost = root.left
        while rightmost.right:
            rightmost = rightmost.right
        
        # Insert left between root and right
        rightmost.right = root.right
        root.right = root.left
        root.left = None
```

---

### Form 6: Compressed Serialization

**Problem**: Add compression for space efficiency.

```python
import zlib, base64

def serialize_compressed(root):
    serialized = serialize(root)
    compressed = zlib.compress(serialized.encode())
    return base64.b64encode(compressed).decode()

def deserialize_compressed(data):
    decoded = base64.b64decode(data.encode())
    decompressed = zlib.decompress(decoded).decode()
    return deserialize(decompressed)
```

---

### Form Summary

| Form | Tree Type | Key Feature | Example |
|------|-----------|-------------|---------|
| Basic | Binary | Null markers | LeetCode 297 |
| BST | Binary Search | BST property optimization | LeetCode 449 |
| N-ary | Arbitrary children | Child count encoding | LeetCode 428 |
| String-Encoded | N-ary | Bracket notation | "1[2][3]" |
| Flatten | Binary | In-place linked list | LeetCode 114 |
| Compressed | Any | zlib compression | Network transmission |

---

### Related Problems

| Problem | Form Type | Difficulty |
|---------|-----------|------------|
| LeetCode 297 | Basic Binary Tree | Hard |
| LeetCode 449 | BST | Medium |
| LeetCode 428 | N-ary Tree | Hard |
| LeetCode 114 | Flatten to Linked List | Medium |
| LeetCode 105 | Build from Pre+Inorder | Medium |
| LeetCode 106 | Build from In+Postorder | Medium |

<!-- back -->
