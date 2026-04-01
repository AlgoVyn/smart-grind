## Title: Topological Sort - Forms

What are the different manifestations of topological sort?

<!-- front -->

---

### Form 1: Standard Topological Sort

Basic ordering of all vertices in a DAG.

| Aspect | Description |
|--------|-------------|
| **Input** | DAG as edge list or adjacency list |
| **Output** | List of vertices in valid order |
| **Use Case** | General dependency resolution |

---

### Form 2: Cycle Detection Only

Use topological sort just to check for cycles.

| Aspect | Description |
|--------|-------------|
| **Key Insight** | If processed vertices < total, cycle exists |
| **Output** | Boolean (has cycle or not) |
| **Optimization** | Can terminate early on cycle detection |

---

### Form 3: Parallel Task Scheduling

Determine minimum time/semesters for all tasks.

| Aspect | Description |
|--------|-------------|
| **Key Insight** | Process all available tasks in parallel |
| **Output** | Number of rounds/semesters needed |
| **Use Case** | Course scheduling, project planning |

---

### Form 4: All Topological Orders

Generate all valid topological orderings.

| Aspect | Description |
|--------|-------------|
| **Key Insight** | Use backtracking at each decision point |
| **Complexity** | O(V! × E) worst case |
| **Use Case** | Testing, enumeration problems |

---

### Form 5: Longest Path in DAG

Find longest path using topological order.

| Aspect | Description |
|--------|-------------|
| **Key Insight** | Process vertices in topo order, relax edges |
| **Output** | Longest path distances |
| **Use Case** | Critical path analysis |

```python
def longest_path_dag(n, edges):
    topo_order = topological_sort_kahn(n, edges)
    if not topo_order:
        return []  # Cycle
    
    dist = [0] * n
    graph = build_graph(edges)
    
    for u in topo_order:
        for v in graph[u]:
            if dist[v] < dist[u] + 1:
                dist[v] = dist[u] + 1
    
    return dist
```

<!-- back -->
