## Graph BFS - Connected Components / Island Counting: Core Concepts

What are the fundamental concepts behind BFS connected components?

<!-- front -->

---

### Core Principle

**Each complete BFS traversal visits exactly one connected component.**

```
Component Discovery Process:
┌──────────┐
│  Node 0  │── Not visited? Start BFS 1
│ (unvisited)│                            │
└──────────┘                               ▼
                                     ┌──────────┐
                                     │ BFS from │── Visits all reachable
                                     │   node 0 │   nodes in Component A
                                     └──────────┘
                                            │
┌──────────┐                                │
│  Node 3  │── Still unvisited? Start BFS 2 │
│ (unvisited)│◄─────────────────────────────┘
└──────────┘
       │
       ▼
┌──────────┐
│ BFS from │── Visits all nodes in Component B
│   node 3 │
└──────────┘

Result: 2 BFS starts = 2 components
```

---

### The "Aha!" Moments

**Why does this work?**

1. **BFS explores all reachable nodes** - From any starting node, BFS visits every node in that component
2. **Visited tracking prevents rediscovery** - Once a node is visited, it's "claimed" by its component
3. **Unvisited nodes are in different components** - If we reach an unvisited node, it must be in a new component

**Graph vs Grid:**
| Aspect | Graph | Grid |
|--------|-------|------|
| Adjacency | Explicit (adjacency list) | Implicit (4 directions) |
| Node identification | Node ID | (row, col) coordinates |
| Visited tracking | Set or boolean array | In-place marking or 2D array |
| Neighbor iteration | `graph[node]` | `directions[]` array |

---

### Visited Marking Strategy

**Critical Rule: Mark when enqueuing, NOT when dequeuing**

```python
# CORRECT: Mark when enqueuing
if neighbor not in visited:
    visited.add(neighbor)      # ← Mark here
    queue.append(neighbor)     # ← Then enqueue

# WRONG: Mark when dequeuing (causes duplicates!)
queue.append(neighbor)         # ← Enqueue first
# ... later ...
node = queue.popleft()
visited.add(node)              # ← Too late! Same node enqueued multiple times
```

**Why it matters:** Multiple paths can reach the same node. Marking on enqueue ensures we only process it once.

---

### Component Discovery Visualization

```
Graph:     0 --- 1     3 --- 4
           |     |     |
           2     5     6

Step 1: Start BFS at node 0
        Queue: [0], Visited: {0}
        Process 0 → enqueue 1, 2
        Queue: [1, 2], Visited: {0, 1, 2}
        Process 1 → enqueue 5
        Queue: [2, 5], Visited: {0, 1, 2, 5}
        Process 2 → no new neighbors
        Queue: [5], Visited: {0, 1, 2, 5}
        Process 5 → no new neighbors
        Queue: [], BFS 1 complete
        Component count: 1

Step 2: Find next unvisited node = 3
        Start BFS at node 3
        Queue: [3], Visited: {0, 1, 2, 5, 3}
        Process 3 → enqueue 4, 6
        Queue: [4, 6], Visited: {0, 1, 2, 5, 3, 4, 6}
        Process 4 → no new neighbors
        Queue: [6]
        Process 6 → no new neighbors
        Queue: [], BFS 2 complete
        Component count: 2

Step 3: All nodes visited, return 2
```

---

### When to Use BFS vs DFS

**Use BFS when:**
- Stack overflow is a concern (deep graphs/grids)
- Shortest path in unweighted graph is needed
- Level-order processing matters
- Iterative solution preferred

**Use DFS when:**
- Code simplicity is priority
- Path finding (not just counting)
- Recursion depth is manageable
- Memory for queue is limited

| Factor | BFS | DFS |
|--------|-----|-----|
| Implementation | Queue | Stack/recursion |
| Stack overflow risk | No | Yes (recursive) |
| Shortest path | Yes | No |
| Code complexity | Moderate | Simple (recursive) |
| Space | O(width) | O(depth) |

---

### Time & Space Complexity

| Approach | Time | Space | Explanation |
|----------|------|-------|-------------|
| Graph BFS | O(V + E) | O(V) | Visit all vertices and edges once |
| Grid BFS | O(rows × cols) | O(min(rows, cols)) | Visit each cell once |

**Space breakdown:**
- Visited tracking: O(V) or O(rows × cols)
- BFS queue: O(V) worst case, or O(min(rows, cols)) for grids

---

### Problem Identification Signals

| Signal | Pattern |
|--------|---------|
| "Number of islands" | Grid BFS/DFS |
| "Count friend circles" | Graph connected components |
| "Connected networks" | BFS/DFS counting |
| "All nodes connected?" | Check if count == 1 |
| "Largest region" | Track size during BFS |
| "Surrounded regions" | Border-first BFS |

<!-- back -->
