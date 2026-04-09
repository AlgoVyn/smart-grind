## Graph BFS - Topological Sort (Kahn's Algorithm): Core Concepts

What are the fundamental concepts behind Kahn's algorithm?

<!-- front -->

---

### Core Principle

**Process nodes with no dependencies first, freeing up new nodes as you go.**

```
Indegree Visualization:

Graph:    A ───┐
          │    ▼
          └──► C ───┐
          B ───┘    ▼
                    D

Indegrees:  A=0, B=0, C=2, D=1

Step 1: Queue nodes with indegree 0
        Queue: [A, B]
        Process A → decrement C's indegree
        Queue: [B], C's indegree = 1

Step 2: Process B → decrement C's indegree
        Queue: [], C's indegree = 0 → enqueue C
        Queue: [C]

Step 3: Process C → decrement D's indegree
        Queue: [], D's indegree = 0 → enqueue D
        Queue: [D]

Step 4: Process D
        Queue: []

Result: [A, B, C, D] ✓ Valid topological order
```

---

### The "Aha!" Moments

**Why does this work?**

1. **Indegree 0 = ready to process** - No prerequisites means can be processed anytime
2. **Decrementing frees dependencies** - When a node is done, its children become closer to ready
3. **New sources emerge** - When all parents of a node are processed, it becomes a source (indegree 0)
4. **Cycle detection** - If result length < total nodes, some nodes still have dependencies (cycle)
5. **Multiple valid orders** - Any node with indegree 0 can be chosen at each step

**Indegree vs Outdegree:**
| Property | Meaning | Usage |
|----------|---------|-------|
| Indegree | Count of incoming edges | Identify ready nodes (indegree = 0) |
| Outdegree | Count of outgoing edges | Know which nodes depend on current |

---

### Indegree Calculation Strategy

**Critical: Count incoming edges correctly**

```python
# CORRECT: For edge u -> v (u before v)
for u, v in edges:
    graph[u].append(v)    # u comes before v
    indegree[v] += 1      # v has one more prerequisite

# For prerequisites [course, prereq] = [a, b] meaning b -> a
for course, prereq in prerequisites:
    graph[prereq].append(course)  # prereq before course
    indegree[course] += 1          # course has prerequisite
```

---

### Cycle Detection Principle

```
Cycle Example:  A ──► B ──► C ──► A

Indegrees: A=1, B=1, C=1

Step 1: No nodes have indegree 0!
        Queue: []
        Result: []
        
→ Cycle detected: len(result) = 0 < 3 nodes

Algorithm returns empty list (no valid ordering exists)
```

**Why it works:** In a cycle, every node has at least one incoming edge from another node in the cycle. Thus, no node ever reaches indegree 0.

---

### Time & Space Complexity

| Aspect | Complexity | Explanation |
|--------|------------|-------------|
| Time | O(V + E) | Build graph (E), process all nodes (V), decrement edges (E) |
| Space | O(V + E) | Adjacency list (V + E), indegree array (V), queue (V) |

**Space breakdown:**
- Graph adjacency list: O(V + E)
- Indegree array: O(V)
- Queue: O(V) worst case
- Result array: O(V)

---

### Problem Identification Signals

| Signal | Pattern |
|--------|---------|
| "Prerequisites" | Topological sort |
| "Course schedule" | Kahn's algorithm |
| "Order tasks with dependencies" | DAG processing |
| "Compilation order" | Build dependency resolution |
| "Valid ordering" | Topological sort exists? |
| "Alien dictionary" | Derive character order |
| "Check if possible" | Cycle detection |

---

### When to Use Topological Sort

**Use when:**
- Tasks have dependencies (some must finish before others)
- Need to find valid execution order
- Need to detect cycles in directed graph
- Processing nodes in dependency order

**Characteristics of valid problems:**
- Directed graph (edges have direction)
- Acyclic (no circular dependencies)
- Dependencies form partial order

<!-- back -->
