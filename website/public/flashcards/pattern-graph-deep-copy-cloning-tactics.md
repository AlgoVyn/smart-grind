## Graph Deep Copy / Cloning: Tactics

What are the advanced techniques for graph deep copy?

<!-- front -->

---

### Tactic 1: BFS Iterative Deep Copy

Use queue instead of recursion to avoid stack overflow.

```python
from collections import deque

def clone_graph_bfs(node: 'Node') -> 'Node':
    """
    Clone graph using BFS iteration.
    Time: O(V + E), Space: O(V)
    """
    if not node:
        return None
    
    visited = {node: Node(node.val)}
    queue = deque([node])
    
    while queue:
        original = queue.popleft()
        copy = visited[original]
        
        for neighbor in original.neighbors:
            if neighbor not in visited:
                # Create copy and enqueue
                visited[neighbor] = Node(neighbor.val)
                queue.append(neighbor)
            # Connect to copied neighbor
            copy.neighbors.append(visited[neighbor])
    
    return visited[node]
```

---

### Tactic 2: Adjacency List Clone

Clone graph represented as adjacency list (dictionary).

```python
def clone_graph_adj_list(graph):
    """
    Clone graph as {node: [neighbors]} dict.
    """
    if not graph:
        return {}
    
    # Create new node objects
    old_to_new = {}
    
    # First pass: create all nodes
    for node in graph:
        if node not in old_to_new:
            old_to_new[node] = Node(node.val)
    
    # Second pass: connect neighbors
    for node, neighbors in graph.items():
        new_node = old_to_new[node]
        for neighbor in neighbors:
            new_node.neighbors.append(old_to_new[neighbor])
    
    return old_to_new
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| Forgetting visited map | Infinite recursion in cycles | Always use hash map |
| Recursing before storing | Duplicate nodes | Add to map first |
| Creating copy twice | Wrong connections | Check map before creating |
| Mapping to original | Shallow copy | Map to copy, not original |
| Missing disconnected nodes | Incomplete clone | Iterate all nodes |

---

### Tactic 4: Handle Disconnected Graphs

```python
def clone_disconnected_graph(nodes):
    """
    Clone graph with multiple components.
    """
    visited = {}
    copies = []
    
    def dfs(original):
        if original in visited:
            return visited[original]
        
        copy = Node(original.val)
        visited[original] = copy
        
        for neighbor in original.neighbors:
            copy.neighbors.append(dfs(neighbor))
        
        return copy
    
    for node in nodes:
        if node not in visited:
            copies.append(dfs(node))
    
    return copies
```

<!-- back -->
