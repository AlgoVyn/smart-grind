## Tree - Serialization & Deserialization: Tactics

What implementation tactics should be used for efficient tree serialization?

<!-- front -->

---

### Tactic 1: Use Efficient String Building

**Problem**: String concatenation in loops is O(n²).

**Solution**: Use list/array + join, or StringBuilder.

```python
# Inefficient - O(n²)
result = ""
for val in values:
    result += str(val) + ","

# Efficient - O(n)
result = []
for val in values:
    result.append(str(val))
serialized = ",".join(result)
```

---

### Tactic 2: Handle Deep Trees (Avoid Stack Overflow)

**Problem**: Recursion depth limit exceeded for skewed trees.

**Solution**: Use iterative approach with explicit stack.

```python
# Iterative serialization
def serialize_iterative(root):
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
            stack.append(node.right)
            stack.append(node.left)
    return ",".join(result)
```

---

### Tactic 3: Use Iterator for Deserialization

**Problem**: Tracking index manually is error-prone.

**Solution**: Use `iter()` for clean sequential access.

```python
# Clean approach with iterator
def deserialize(self, data: str) -> Optional[TreeNode]:
    if not data:
        return None
    values = iter(data.split(','))  # Iterator
    
    def build():
        val = next(values)  # No index management needed
        if val == "#":
            return None
        node = TreeNode(int(val))
        node.left = build()
        node.right = build()
        return node
    
    return build()
```

---

### Tactic 4: Trim Trailing Nulls (Space Optimization)

**Problem**: Trailing null markers are redundant.

**Solution**: Remove them before returning.

```python
def serialize_compact(root):
    result = []
    # ... build result with nulls ...
    
    # Remove trailing nulls
    while result and result[-1] == "#":
        result.pop()
    
    return ",".join(result) if result else ""
```

---

### Tactic 5: Handle Empty Tree Edge Case

```python
def serialize(self, root):
    if not root:
        return ""  # Return empty string, not "#"
    # ... rest of serialization

def deserialize(self, data):
    if not data:
        return None  # Handle empty input
    # ... rest of deserialization
```

---

### Tactic 6: Queue for Level Order (BFS)

```python
from collections import deque

def serialize_bfs(root):
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
```

---

### Tactic Summary

| Tactic | Benefit | Use When |
|--------|---------|----------|
| List + join | O(n) vs O(n²) string building | All implementations |
| Iterative | Avoids recursion limit | Deep/skewed trees |
| Iterator pattern | Cleaner code, no index bugs | Recursive deserialization |
| Trim trailing nulls | Reduced space | Space-constrained |
| Empty tree check | Correct edge case handling | All implementations |

<!-- back -->
