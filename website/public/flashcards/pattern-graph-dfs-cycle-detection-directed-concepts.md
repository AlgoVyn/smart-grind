## Graph DFS - Cycle Detection (Directed): Core Concepts

What are the fundamental concepts behind cycle detection in directed graphs?

<!-- front -->

---

### The Core Insight

**A cycle exists when you encounter a node currently in your recursion stack**

In directed graphs, simply seeing a visited node doesn't mean there's a cycle—you need to distinguish between:
- **Already processed nodes** (safe to revisit from another path)
- **Currently exploring nodes** (back edge = cycle!)

```
Graph: 0 → 1 → 2 → 3
            ↓   ↑
            └───┘
            
DFS Path: 0 → 1 → 2 → 3 → 2
                    ↑
            2 is VISITING (state 1)
            Cycle detected!
```

---

### The "Aha!" Moments

| Moment | Insight | Why It Matters |
|--------|---------|----------------|
| **Three states, not two** | Need to track "currently in stack" vs "done" | Prevents false positives from cross edges |
| **Back edge = cycle** | Edge to VISITING node proves cycle | Core detection mechanism |
| **Disregard VISITED nodes** | Fully processed nodes are safe | Avoids redundant work |
| **Iterate all nodes** | Graph may be disconnected | Ensures complete coverage |
| **Direction matters** | Edge direction determines cycles | A→B cycle ≠ B→A cycle |

---

### Why Two States Aren't Enough

```
Graph: A → B → C
            ↓
            D
            
Two states (visited/unvisited):
- DFS: A → B → C → D
- After C: mark C visited, backtrack to B
- D is visited from B → False positive cycle!

Three states:
- C is VISITED (2), not in current path
- No cycle detected (correct!)
```

---

### Types of Edges in DFS

| Edge Type | To State | Indicates | Example |
|-----------|----------|-----------|---------|
| **Tree Edge** | UNVISITED (0) | Normal DFS traversal | A → B (first visit) |
| **Back Edge** | VISITING (1) | **CYCLE DETECTED!** | B → A (A still on stack) |
| **Forward Edge** | VISITED (2) | Ancestor already processed | A → C (B→C already traversed) |
| **Cross Edge** | VISITED (2) | Different subtree | C → D (different branch) |

**Only back edges indicate cycles in directed graphs!**

---

### Undirected vs Directed Cycles

| Aspect | Undirected Graph | Directed Graph |
|--------|------------------|----------------|
| **Detection** | Any visited neighbor (not parent) | Only back edge to VISITING node |
| **States needed** | 2 (visited/unvisited) | 3 (unvisited/visiting/visited) |
| **Edge tracking** | Track parent to avoid false positive | No parent tracking needed |
| **Complexity** | Same O(V + E) | Same O(V + E) |

---

### The Recursion Stack Visualization

```
Call Stack during DFS:

hasCycle(0)
    hasCycle(1)
        hasCycle(2)  <- Current, visit[2] = 1 (VISITING)
            hasCycle(3)
                3's neighbor is 2
                visit[2] == 1 → CYCLE!
                
visit array: [2, 1, 1, 1]
              ↑  ↑  ↑  ↑
              0  1  2  3
              
0: VISITED (done)
1,2,3: VISITING (in current path)
```

---

### Time/Space Complexity Breakdown

| Aspect | Complexity | Explanation |
|--------|------------|-------------|
| **Time** | O(V + E) | Each node and edge visited once |
| **Space** | O(V) | Visit array + recursion stack |
| **Worst case** | O(V) stack depth | Longest path in graph |

<!-- back -->
