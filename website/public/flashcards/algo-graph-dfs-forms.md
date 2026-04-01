## Graph DFS: Forms & Variations

What are the different forms and specialized DFS implementations?

<!-- front -->

---

### Pre-order DFS Form

```python
def dfs_preorder(graph, start):
    """
    Process node before children
    Useful for: copying structures, marking visited early
    """
    result = []
    visited = set()
    
    def dfs(node, depth=0):
        visited.add(node)
        result.append((node, depth))  # Process here
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                dfs(neighbor, depth + 1)
    
    dfs(start)
    return result

# Application: Find all nodes at each depth
def nodes_by_depth(graph, start):
    depth_map = {}
    
    def dfs(node, depth):
        if depth not in depth_map:
            depth_map[depth] = []
        depth_map[depth].append(node)
        
        for nxt in graph[node]:
            if nxt not in visited:
                dfs(nxt, depth + 1)
    
    dfs(start, 0)
    return depth_map
```

---

### Post-order DFS Form

```python
def dfs_postorder(graph, start):
    """
    Process node after all children
    Useful for: tree DP, cleanup, subtree sizes
    """
    result = []
    visited = set()
    
    def dfs(node):
        visited.add(node)
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                dfs(neighbor)
        
        result.append(node)  # Process after children
    
    dfs(start)
    return result

# Application: Subtree size calculation
def subtree_sizes(graph, root):
    size = {}
    
    def dfs(node, parent):
        size[node] = 1
        for neighbor in graph[node]:
            if neighbor != parent:
                size[node] += dfs(neighbor, node)
        return size[node]
    
    dfs(root, -1)
    return size
```

---

### In-order DFS Form (Binary Trees)

```python
def dfs_inorder(root):
    """
    Left - Node - Right
    For BST: gives sorted order
    """
    result = []
    
    def dfs(node):
        if not node:
            return
        
        dfs(node.left)
        result.append(node.val)  # Process in middle
        dfs(node.right)
    
    dfs(root)
    return result

# Iterative version
def inorder_iterative(root):
    result = []
    stack = []
    curr = root
    
    while curr or stack:
        while curr:
            stack.append(curr)
            curr = curr.left
        
        curr = stack.pop()
        result.append(curr.val)
        curr = curr.right
    
    return result
```

---

### DFS with Path Tracking

```python
def dfs_all_paths(graph, start, end):
    """
    Find all paths from start to end
    """
    paths = []
    current_path = [start]
    visited = {start}
    
    def dfs(node):
        if node == end:
            paths.append(current_path[:])
            return
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                current_path.append(neighbor)
                
                dfs(neighbor)
                
                current_path.pop()
                visited.remove(neighbor)
    
    dfs(start)
    return paths
```

---

### Limited Depth DFS (IDDFS Component)

```python
def dfs_limited_depth(graph, start, max_depth):
    """
    DFS with depth limit - component of IDDFS
    """
    result = []
    
    def dfs(node, depth):
        if depth > max_depth:
            return
        
        result.append((node, depth))
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                dfs(neighbor, depth + 1)
                visited.remove(neighbor)
    
    visited = {start}
    dfs(start, 0)
    return result

# Iterative Deepening DFS
def iddfs(graph, start, target):
    """
    Iterative Deepening DFS - memory efficient
    Like BFS but with DFS memory usage
    """
    for depth in range(len(graph)):
        found = dfs_depth_limited(graph, start, target, depth)
        if found:
            return depth
    return -1
```

<!-- back -->
