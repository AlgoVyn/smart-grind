## Graph Deep Copy / Cloning: Core Concepts

What are the fundamental principles of graph deep copy?

<!-- front -->

---

### Core Concept

**Use a hash map to map original nodes to their copies. This enables cycle handling and ensures each node is cloned exactly once.**

**The "aha!" moments:**
1. **Node mapping**: Hash map tracks original → copy relationships
2. **Cycle handling**: Visited map prevents infinite loops
3. **Create before recurse**: Add to map before recursing to handle cycles
4. **Reuse copies**: Return existing copy if already visited
5. **Edge recreation**: Connect copied nodes using same relationships

---

### The Pattern

```
1. Initialize empty hash map
2. For each neighbor:
   - If neighbor in map: use existing copy
   - If not in map: create copy, add to map, recurse
3. Connect copied neighbors to copy node
```

---

### Critical Rules

| Rule | Why It Matters |
|------|----------------|
| **Add to map FIRST** | Prevents infinite recursion in cycles |
| **Check map before creating** | Avoids duplicate copies of same node |
| **Copy value, not reference** | Ensures true deep copy |
| **Copy ALL neighbors** | Preserves complete graph structure |

---

### Complexity

| Aspect | Complexity | Explanation |
|--------|------------|-------------|
| Time | O(V + E) | Visit each vertex and edge once |
| Space | O(V) | Hash map stores all nodes |

**Space breakdown**:
- Hash map: O(V)
- Recursion stack: O(V) worst case

<!-- back -->
