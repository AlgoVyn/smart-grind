## Tree - Serialization & Deserialization: Comparison

How do the different serialization approaches compare?

<!-- front -->

---

### Approach Comparison Table

| Aspect | Preorder (Recursive) | Preorder (Iterative) | Level Order (BFS) | JSON Format |
|--------|---------------------|---------------------|-------------------|-------------|
| **Time** | O(n) | O(n) | O(n) | O(n) |
| **Space** | O(n) | O(n) | O(n) | O(n) |
| **Readability** | High | Medium | Medium | High |
| **Human Readable** | Low | Low | Low | High |
| **Implementation** | Simple | Moderate | Moderate | Simple |
| **LeetCode Preferred** | ✅ Yes | ❌ No | ❌ No | ❌ No |
| **Tree Shape Preserved** | Yes | Yes | Yes | Yes |
| **Recursion Depth** | O(h) | O(1) explicit | O(1) | O(h) |

---

### When to Use Each Approach

**Preorder (Recursive)**
- ✅ LeetCode interviews (default solution)
- ✅ Clean, readable code
- ✅ Most intuitive recursive structure
- ❌ Risk of stack overflow on deep trees

**Preorder (Iterative)**
- ✅ Very deep trees (no recursion limit)
- ✅ Explicit control over traversal
- ❌ More verbose implementation

**Level Order (BFS)**
- ✅ Visual tree structure preservation
- ✅ Good for level-based analysis
- ❌ Slightly more complex deserialization

**JSON Format**
- ✅ Human-readable debugging
- ✅ Self-documenting structure
- ❌ More verbose (includes field names)
- ❌ Requires JSON library

---

### Serialization Format Examples

For tree:
```
    1
   / \
  2   3
     / \
    4   5
```

| Approach | Serialized Output |
|----------|-------------------|
| Preorder | `1,2,#,#,3,4,#,#,5,#,#` |
| Level Order | `1,2,3,#,#,4,5,#,#,#,#` |
| JSON | `{"val":1,"left":{"val":2,"left":null,"right":null},"right":{"val":3,"left":{"val":4...}}}` |

---

### Space Efficiency Comparison

| Tree Type | Preorder Size | Level Order Size | Notes |
|-----------|--------------|------------------|-------|
| Complete binary | ~2n values | ~2n values | Similar |
| Skewed (linked list) | ~2n values | ~2n values | Similar |
| Sparse (few nodes) | ~2n values | Many trailing # | Preorder wins |

**Note**: Both approaches require ~2× number of nodes in values (including nulls).

---

### Binary Tree vs BST Serialization

| Aspect | Binary Tree | Binary Search Tree |
|--------|-------------|-------------------|
| **Null markers** | Required | Can be optimized out |
| **Structure info** | Must preserve | Implied by values |
| **Space** | O(n) with nulls | O(n) without nulls |
| **Validation** | Not needed | BST property check |
| **Algorithm** | Preorder/BFS | Inorder + constraints |

<!-- back -->
