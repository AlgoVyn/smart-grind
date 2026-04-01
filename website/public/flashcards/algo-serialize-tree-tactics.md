## Title: Serialize Tree - Tactics

What are specific techniques and optimizations for tree serialization?

<!-- front -->

---

### Tactic 1: Iterator-Based Deserialization

Use iterator instead of list pop(0) for O(1) next operations:

```python
def deserialize(self, data: str) -> Optional[TreeNode]:
    """Deserialize using iterator for efficiency."""
    def build(values) -> Optional[TreeNode]:
        val = next(values)
        if val == "null":
            return None
        
        node = TreeNode(int(val))
        node.left = build(values)
        node.right = build(values)
        return node
    
    values = iter(data.split(","))
    return build(values)
```

**Benefits:**
- Avoids O(n) `pop(0)` operation
- Cleaner recursive code
- No index management needed

---

### Tactic 2: Trailing Null Removal

Remove unnecessary trailing nulls from serialized string:

```python
def serialize(self, root: Optional[TreeNode]) -> str:
    """Serialize with trailing null removal."""
    result = []
    queue = deque([root])
    
    while queue:
        node = queue.popleft()
        if node:
            result.append(str(node.val))
            queue.append(node.left)
            queue.append(node.right)
        else:
            result.append("null")
    
    # Remove trailing nulls
    while result and result[-1] == "null":
        result.pop()
    
    return ",".join(result)
```

---

### Tactic 3: StringBuilder Pattern

Use list for efficient string concatenation:

```python
def serialize_recursive(self, root: Optional[TreeNode], 
                        result: List[str]) -> None:
    """Build string using list (O(n) vs O(n²) for +=)."""
    if root is None:
        result.append("null")
        return
    
    result.append(str(root.val))
    self.serialize_recursive(root.left, result)
    self.serialize_recursive(root.right, result)

# Usage
result = []
serialize_recursive(root, result)
return ",".join(result)  # Single join at end
```

---

### Tactic 4: Handling Empty Tree

Always handle empty/null input gracefully:

```python
def serialize(self, root: Optional[TreeNode]) -> str:
    """Handle empty tree."""
    if not root:
        return "null"
    # ... rest of serialization

def deserialize(self, data: str) -> Optional[TreeNode]:
    """Handle empty input."""
    if not data or data == "null":
        return None
    # ... rest of deserialization
```

---

### Tactic 5: Comparison Table

| Method | Serialize | Deserialize | Space | Human Readable |
|--------|-----------|-------------|-------|----------------|
| **Preorder + Null** | O(n) | O(n) | Medium | Low |
| **Level Order** | O(n) | O(n) | Medium | Low |
| **JSON/XML** | O(n) | O(n) | Low | High |
| **Parent Pointer** | O(n) | O(n) | High | Low |
| **BST Only** | O(n) | O(n) | Medium | Low |

**Recommendation:**
- **General trees:** Preorder with null markers
- **BSTs:** Compact preorder (no nulls)
- **APIs/Storage:** JSON for readability
- **Memory-critical:** Parent-pointer or binary encoding

<!-- back -->
