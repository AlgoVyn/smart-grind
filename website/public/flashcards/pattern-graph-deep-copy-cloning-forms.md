## Graph Deep Copy / Cloning: Forms

What are the different variations of graph cloning problems?

<!-- front -->

---

### Form 1: Clone Graph (Node-based)

Clone connected undirected graph with node references.

```python
def clone_graph(node: 'Node') -> 'Node':
    """
    LeetCode 133: Clone Graph
    Clone node-based graph with neighbors list.
    """
    if not node:
        return None
    
    visited = {}
    
    def dfs(original):
        if original in visited:
            return visited[original]
        
        copy = Node(original.val)
        visited[original] = copy
        
        for neighbor in original.neighbors:
            copy.neighbors.append(dfs(neighbor))
        
        return copy
    
    return dfs(node)
```

---

### Form 2: Copy List with Random Pointer

Clone linked list where each node has a random pointer.

```python
def copy_random_list(head: 'Node') -> 'Node':
    """
    LeetCode 138: Copy List with Random Pointer
    Clone list with next and random pointers.
    """
    if not head:
        return None
    
    visited = {}
    
    def clone(node):
        if not node:
            return None
        if node in visited:
            return visited[node]
        
        # Create copy (without setting next/random yet)
        copy = Node(node.val)
        visited[node] = copy
        
        # Recursively set next and random
        copy.next = clone(node.next)
        copy.random = clone(node.random)
        
        return copy
    
    return clone(head)
```

---

### Form 3: Clone N-ary Tree

Clone tree where nodes can have any number of children.

```python
class Node:
    def __init__(self, val=None, children=None):
        self.val = val
        self.children = children if children else []

def clone_tree(root: 'Node') -> 'Node':
    """
    LeetCode 1490: Clone N-ary Tree
    """
    if not root:
        return None
    
    visited = {}
    
    def dfs(original):
        if not original:
            return None
        if original in visited:
            return visited[original]
        
        # Create copy
        copy = Node(original.val)
        visited[original] = copy
        
        # Clone all children
        for child in original.children:
            copy.children.append(dfs(child))
        
        return copy
    
    return dfs(root)
```

---

### Form 4: Clone Binary Tree with Random Pointer

Clone binary tree where nodes have random pointers.

```python
def clone_binary_tree(root: 'Node') -> 'Node':
    """
    LeetCode 1485: Clone Binary Tree With Random Pointer
    """
    if not root:
        return None
    
    visited = {}
    
    def dfs(original):
        if not original:
            return None
        if original in visited:
            return visited[original]
        
        copy = Node(original.val)
        visited[original] = copy
        
        copy.left = dfs(original.left)
        copy.right = dfs(original.right)
        copy.random = dfs(original.random)
        
        return copy
    
    return dfs(root)
```

---

### Form 5: Clone Graph with Weighted Edges

Clone graph where edges have weights.

```python
class WeightedNode:
    def __init__(self, val=0):
        self.val = val
        self.neighbors = []  # List of (node, weight) tuples

def clone_weighted_graph(node: 'WeightedNode') -> 'WeightedNode':
    """
    Clone weighted graph preserving edge weights.
    """
    if not node:
        return None
    
    visited = {}
    
    def dfs(original):
        if original in visited:
            return visited[original]
        
        copy = WeightedNode(original.val)
        visited[original] = copy
        
        # Copy neighbors with weights
        for neighbor, weight in original.neighbors:
            copy.neighbors.append((dfs(neighbor), weight))
        
        return copy
    
    return dfs(node)
```

---

### Form Comparison Summary

| Form | Problem | Key Twist |
|------|---------|-----------|
| **Basic Graph** | Clone Graph | Undirected, neighbors list |
| **Linked List** | Copy Random List | Random pointers |
| **N-ary Tree** | Clone N-ary Tree | Variable children count |
| **Binary Tree** | Clone Binary Tree | left, right, random |
| **Weighted** | Weighted Clone | Edge weights preserved |

**Common Pattern**: Hash map + DFS/BFS for all forms

<!-- back -->
