## Serialize and Deserialize Binary Tree

**Question:** Compare level-order (BFS) vs pre-order (DFS) serialization approaches.

<!-- front -->

---

## Serialize & Deserialize Binary Tree

### Level-Order (BFS) Approach
```python
# Serialize
def serialize(root):
    if not root:
        return \"\"
    
    queue = deque([root])
    result = []
    
    while queue:
        node = queue.popleft()
        if node:
            result.append(str(node.val))
            queue.append(node.left)
            queue.append(node.right)
        else:
            result.append(\"null\")
    
    return \",\".join(result)

# Deserialize
def deserialize(data):
    if not data:
        return None
    
    values = data.split(\",\")
    root = TreeNode(int(values[0]))
    queue = deque([root])
    i = 1
    
    while queue and i < len(values):
        node = queue.popleft()
        
        if values[i] != \"null\":
            node.left = TreeNode(int(values[i]))
            queue.append(node.left)
        i += 1
        
        if values[i] != \"null\":
            node.right = TreeNode(int(values[i]))
            queue.append(node.right)
        i += 1
    
    return root
```

### Pre-Order (DFS) Approach
```python
# Serialize
def serialize(root):
    if not root:
        return \"null\"
    return f\"{root.val},{serialize(root.left)},{serialize(root.right)}\"

# Deserialize
def deserialize(data):
    values = iter(data.split(\",\"))
    
    def build():
        val = next(values)
        if val == \"null\":
            return None
        node = TreeNode(int(val))
        node.left = build()
        node.right = build()
        return node
    
    return build()
```

### Comparison
| Aspect | BFS (Level-order) | DFS (Pre-order) |
|--------|-------------------|-----------------|
| Space | Wide trees: more | Deep trees: more |
| Readability | Simple | Simple |
| Null handling | Explicit \"null\" | Implicit \"null\" |

<!-- back -->
