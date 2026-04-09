## Graph BFS - Connected Components: Core Concepts

What are the fundamental principles of BFS connected components?

<!-- front -->

---

### Core Concept

**Each BFS from an unvisited node discovers exactly one connected component. Count the number of BFS traversals needed to visit all nodes.**

**Example:**
```
Grid:
1 1 0 0 1
1 0 0 1 1
0 0 1 0 0

BFS 1: Start at (0,0) → visits (0,0), (0,1), (1,0)
BFS 2: Next unvisited 1 at (0,4) → visits (0,4), (1,3), (1,4)
BFS 3: Next unvisited 1 at (2,2) → visits (2,2)

Total: 3 islands
```

---

### The Pattern

```
1. Visit every cell/node
2. When find unvisited land/node:
   - New component found
   - BFS/DFS to mark entire component
3. Count = number of BFS/DFS starts
```

---

### BFS vs DFS

| Aspect | BFS | DFS |
|--------|-----|-----|
| **Order** | Level by level | Deep first |
| **Space** | O(width) queue | O(depth) stack |
| **Grid** | Both fine | Both fine |
| **Deep graph** | Safer | Risk overflow |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(V+E) or O(m×n) | Visit each once |
| Space | O(V) or O(m×n) | Visited tracking |
| BFS queue | O(min(m,n)) | Max width |

<!-- back -->
