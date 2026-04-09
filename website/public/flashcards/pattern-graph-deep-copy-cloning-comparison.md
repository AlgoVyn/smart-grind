## Graph Deep Copy / Cloning: Comparison

When should you use different approaches?

<!-- front -->

---

### DFS vs BFS for Deep Copy

| Aspect | DFS Recursive | BFS Iterative |
|--------|---------------|---------------|
| **Code clarity** | Cleanest | Moderate |
| **Stack overflow risk** | Yes (deep graphs) | No |
| **Space usage** | O(V) recursion stack | O(V) queue |
| **Implementation** | Simple recursive | Queue-based |
| **Order of creation** | Depth-first | Level-by-level |

**Winner**: DFS for interviews, BFS for very deep graphs

---

### When to Use Each

**DFS Recursive:**
- Standard interview solution
- Clean and intuitive code
- Graphs with reasonable depth
- Natural fit for graph traversal

**BFS Iterative:**
- Very deep graphs (avoid recursion limit)
- Explicit queue control
- Level-order creation needed
- Production safety

---

### Related Pattern Comparisons

| Pattern | Use Case | Key Difference |
|---------|----------|----------------|
| **Deep Copy** | Clone entire graph structure | Create new nodes |
| **Clone with Random** | Clone list with random pointers | Handle random refs |
| **Serialize/Deserialize** | Convert to string and back | String representation |
| **Copy Constructor** | OOP cloning | Class-based approach |

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|-----|
| Interview | DFS Recursive | Standard, clean code |
| Production | BFS | No stack overflow risk |
| Cyclic graph | Either with hash map | Must use visited map |
| Deep graph | BFS | Avoid recursion depth |
| DAG only | DFS without map | No cycles to handle |

<!-- back -->
