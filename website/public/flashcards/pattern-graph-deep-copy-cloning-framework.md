## Graph Deep Copy / Cloning: Framework

What is the complete code template for graph deep copy?

<!-- front -->

---

### Framework: DFS Deep Copy

```
┌─────────────────────────────────────────────────────┐
│  GRAPH DEEP COPY - TEMPLATE                            │
├─────────────────────────────────────────────────────┤
│  1. Create hash map: original_node → copy_node       │
│                                                        │
│  2. Define recursive clone function:                 │
│     If node is None: return None                     │
│     If node in map: return existing copy             │
│     Create copy node with same value                 │
│     Store in map before recursing                    │
│     Recursively clone all neighbors                  │
│     Add copied neighbors to copy's neighbors         │
│     Return the copy                                  │
│                                                        │
│  3. Start DFS from input node                        │
│  4. Return copied starting node                      │
└─────────────────────────────────────────────────────┘
```

---

### Implementation: DFS Recursive

```python
class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors else []

def clone_graph(node: 'Node') -> 'Node':
    """
    Clone graph using DFS with hash map.
    LeetCode 133 - Clone Graph
    Time: O(V + E), Space: O(V)
    """
    if not node:
        return None
    
    # Map original nodes to copies
    visited = {}
    
    def dfs(original):
        if original in visited:
            return visited[original]
        
        # Create copy BEFORE recursing
        copy = Node(original.val)
        visited[original] = copy
        
        # Recursively copy neighbors
        for neighbor in original.neighbors:
            copy.neighbors.append(dfs(neighbor))
        
        return copy
    
    return dfs(node)
```

---

### Key Pattern Elements

| Aspect | Description |
|--------|-------------|
| **Core Structure** | Hash map linking original → copy |
| **Critical Order** | Add to map BEFORE recursing |
| **Cycle Handling** | Map prevents infinite recursion |
| **Complexity** | O(V + E) time, O(V) space |

**Key Insight**: Create and store the copy node before recursing to neighbors to handle cycles properly.

<!-- back -->
