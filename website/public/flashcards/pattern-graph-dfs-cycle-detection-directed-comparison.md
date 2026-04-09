## Graph DFS - Cycle Detection (Directed): Comparison

When should you use different approaches for cycle detection?

<!-- front -->

---

### DFS vs BFS (Kahn's) vs Union-Find: Trade-off Analysis

| Aspect | DFS (Three States) | BFS (Kahn's) | Union-Find |
|--------|-------------------|--------------|------------|
| **Primary Use** | Directed graphs | DAG validation | Undirected graphs |
| **Cycle Detection** | Explicit (back edge) | Implicit (unprocessed nodes) | Implicit (same set) |
| **Also Provides** | Path reconstruction | Topological order | Connected components |
| **Implementation** | Recursive/Iterative | Iterative (queue) | Iterative |
| **Space** | O(V) stack/queue | O(V) queue + indegree | O(V) parent array |
| **Stack Overflow Risk** | Yes (recursive) | No | No |
| **Edge Direction** | Required | Required | Ignored (undirected) |

**Winner for Directed Cycles**: DFS with Three States (standard, reliable)
**Winner for Topological Sort**: Kahn's BFS (gives order + cycle check)
**Winner for Undirected**: Union-Find (simplest, nearly O(1) per op)

---

### When to Use Each Approach

#### DFS (Three States) - Use When:
- Standard directed graph cycle detection
- Need to find actual cycle path
- Interview settings (expected solution)
- Also need to find "safe states" (nodes not in cycles)
- Graph has moderate depth

#### Kahn's Algorithm (BFS) - Use When:
- Need valid topological ordering
- Detecting cycles in course scheduling
- Iterative solution preferred (no recursion)
- Also need to find execution order
- Large graphs where stack overflow is concern

#### Union-Find - Use When:
- Graph is undirected
- Building MST (Kruskal's)
- Need dynamic connectivity
- Edge additions with cycle checks
- **Not recommended for pure directed cycle detection**

---

### Recursive vs Iterative DFS

| Aspect | Recursive DFS | Iterative DFS |
|--------|---------------|---------------|
| **Code Clarity** | Clean, elegant | Verbose, manual state |
| **Space** | O(depth) call stack | O(depth) explicit stack |
| **Stack Overflow** | Risk on deep graphs | Safer, controllable |
| **Speed** | Slightly faster | Comparable |
| **Interview Default** | ✅ Yes | For large graphs only |

**Decision Rule**:
- Grid ≤ 10^4 cells or n ≤ 10^4 nodes → Recursive
- Grid > 10^4 cells or deep graphs → Iterative

---

### State Tracking: Three States vs Boolean + Set

| Method | Space | Clarity | Speed |
|--------|-------|---------|-------|
| **Three States Array** | O(V) | Clean | Fast (array access) |
| **Boolean + onStack Set** | O(V) | Explicit | Moderate (set ops) |
| **Three States + Parent** | O(V) | For path recovery | Fast |

**Interview Default**: Three states array `[0, 1, 2]`
**Alternative**: `on_stack` boolean array for explicitness

---

### Directed vs Undirected Cycle Detection

| Feature | Undirected | Directed |
|---------|------------|----------|
| **States Needed** | 2 (visited/unvisited) | 3 (0/1/2) |
| **Parent Tracking** | Required (avoid false positive) | Not needed |
| **Back Edge Check** | `visited[neighbor] && neighbor != parent` | `visit[neighbor] == 1` |
| **Self-loop Handling** | Special case | Naturally handled |
| **Cross Edges** | Don't exist | Ignored (visit==2) |

---

### Algorithm Selection Decision Tree

```
Start
  │
  ├── Directed graph?
  │     │
  │     ├── Need topological order? ──→ Kahn's BFS (queue)
  │     │
  │     ├── Need cycle path? ──→ DFS + parent tracking
  │     │
  │     ├── Very large/deep? ──→ Iterative DFS
  │     │
  │     └── Default ──→ Recursive DFS with 3 states
  │
  └── Undirected graph?
        │
        ├── Dynamic additions? ──→ Union-Find
        │
        └── Static graph? ──→ DFS with parent tracking
```

---

### Summary Table: Choose Your Approach

| Situation | Best Approach | Why |
|-----------|---------------|-----|
| Standard interview (directed) | Recursive DFS + 3 states | Expected, clean code |
| Course scheduling / task order | Kahn's BFS | Gives order + cycle check |
| Very large graph (10^5+ nodes) | Iterative DFS or Kahn's | No stack overflow |
| Need cycle path | DFS + parent array | Reconstruct from back edge |
| Undirected graph | Union-Find or DFS+parent | Simpler, more efficient |
| Multiple cycle queries | Union-Find (undirected) | Near O(1) per query |
| Find "safe nodes" (not in cycles) | DFS 3 states | Track nodes never in cycles |

---

### Complexity Comparison

| Algorithm | Time | Space | Notes |
|-----------|------|-------|-------|
| DFS (3 states) | O(V + E) | O(V) | Best for directed |
| Kahn's BFS | O(V + E) | O(V) | Also gives topo sort |
| Union-Find | O(E × α(V)) | O(V) | α = inverse Ackermann |
| Find cycle path | O(V + E) | O(V) | Extra parent array |

<!-- back -->
