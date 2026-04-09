## Graph BFS - Topological Sort (Kahn's Algorithm): Comparison

When should you use Kahn's BFS vs DFS-based topological sort?

<!-- front -->

---

### Kahn's Algorithm vs DFS-based Topological Sort

| Aspect | Kahn's (BFS) | DFS-based |
|--------|--------------|-----------|
| **Code complexity** | Moderate | Moderate |
| **Stack overflow** | No | Yes (recursion) |
| **Iterative** | Yes | Can be (usually recursive) |
| **Cycle detection** | Natural (result length check) | Requires 3-color state |
| **Processing order** | Natural order | Reverse post-order |
| **First node in result** | Always source (indegree 0) | Any node |
| **Level information** | Available (process by levels) | Not available |
| **Multiple orderings** | Easy to detect | Harder to detect |
| **Lexicographical** | Easy (use heap) | Harder |

**Winner**: Kahn's for cycle detection and iterative safety, DFS for simplicity with small graphs

---

### When to Use Each Approach

**Kahn's Algorithm (BFS) - Use when:**
- Stack overflow is a concern (large graphs)
- Need natural cycle detection
- Want level-by-level processing (parallel scheduling)
- Need lexicographical ordering
- Iterative solution preferred
- Need to detect multiple valid orderings

**DFS-based - Use when:**
- Graph depth is manageable
- Prefer recursive solutions
- Need any valid order quickly
- Already using DFS for other graph operations
- Stack space not a concern

---

### Algorithm Comparison Details

**Kahn's Algorithm:**
```python
def kahn_topo_sort(n, edges):
    graph = defaultdict(list)
    indegree = [0] * n
    
    for u, v in edges:
        graph[u].append(v)
        indegree[v] += 1
    
    queue = deque([i for i in range(n) if indegree[i] == 0])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        for neighbor in graph[node]:
            indegree[neighbor] -= 1
            if indegree[neighbor] == 0:
                queue.append(neighbor)
    
    # Natural cycle detection
    return result if len(result) == n else []
```

**DFS-based:**
```python
def dfs_topo_sort(n, edges):
    graph = defaultdict(list)
    for u, v in edges:
        graph[u].append(v)
    
    # 0=unvisited, 1=visiting, 2=visited
    state = [0] * n
    result = []
    has_cycle = False
    
    def dfs(node):
        nonlocal has_cycle
        if has_cycle:
            return
        if state[node] == 1:
            has_cycle = True  # Cycle detected
            return
        if state[node] == 2:
            return
        
        state[node] = 1
        for neighbor in graph[node]:
            dfs(neighbor)
        state[node] = 2
        result.append(node)  # Post-order
    
    for i in range(n):
        if state[i] == 0:
            dfs(i)
    
    return [] if has_cycle else result[::-1]
```

---

### Key Trade-offs by Situation

| Situation | Best Choice | Why |
|-----------|-------------|-----|
| Interview coding (quick) | DFS | Shorter to write |
| Interview follow-up | Kahn's | Shows deeper understanding |
| Large graphs (10^5+ nodes) | Kahn's | No recursion stack overflow |
| Need lexicographical order | Kahn's | Use min-heap |
| Need parallel scheduling | Kahn's | Process by levels |
| Cycle detection critical | Kahn's | More intuitive |
| Already using DFS | DFS-based | Consistency with codebase |
| Very deep dependency chains | Kahn's | Stack overflow risk with DFS |
| Multiple valid orders needed | Kahn's | Check queue size > 1 |

---

### Cycle Detection Comparison

**Kahn's - Natural detection:**
```python
# If some nodes never reach indegree 0, they're in a cycle
if len(result) < num_nodes:
    return []  # Cycle exists
```

**DFS - State-based detection:**
```python
# 0=unvisited, 1=visiting, 2=visited
if state[node] == 1:
    # Back edge to node currently in recursion stack
    has_cycle = True
```

**Kahn's advantage:** More intuitive - nodes remaining with indegree > 1 are in cycles
**DFS advantage:** Can identify exactly which nodes are in the cycle

---

### Space Complexity Comparison

| Approach | Space | Components |
|----------|-------|------------|
| Kahn's | O(V + E) | Graph, indegree array, queue, result |
| DFS (recursive) | O(V + E) | Graph, state array, recursion stack, result |
| DFS (iterative) | O(V + E) | Graph, state array, explicit stack, result |

**DFS recursion stack:** O(V) in worst case (long path)
**Kahn's queue:** O(V) in worst case (all nodes independent)

<!-- back -->
