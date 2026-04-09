## Binary Search - On Sorted Array: Comparison

When should you use binary search versus other search approaches?

<!-- front -->

---

### Binary Search vs Linear Search

| Aspect | Binary Search | Linear Search |
|--------|---------------|---------------|
| **Time** | O(log n) | O(n) |
| **Space** | O(1) | O(1) |
| **Requires sorted** | Yes | No |
| **Implementation** | More complex | Simple |
| **Multiple queries** | Efficient after sort | Linear each time |

**Winner**: 
- Binary search for multiple queries on sorted data
- Linear search for unsorted or single query

---

### Binary Search vs Hash Table

| Aspect | Binary Search | Hash Table |
|--------|---------------|------------|
| **Time** | O(log n) | O(1) average |
| **Space** | O(1) | O(n) |
| **Preprocessing** | O(n log n) sort | O(n) build |
| **Sorted order** | Preserved | Lost |
| **Range queries** | Natural | Requires tree |

**Winner**:
- Hash table for point lookups
- Binary search for range queries or sorted traversal

---

### When to Use Binary Search

**Use when:**
- Array is sorted
- Multiple searches on same data
- Need range queries (lower/upper bound)
- Space is constrained
- Deterministic O(log n) required

**Don't use when:**
- Array is unsorted (unless sorting is worthwhile)
- Single search (hash table or linear may be better)
- Dynamic data with frequent insertions (use BST)

---

### Comparison with Other Search Patterns

| Pattern | Time | Space | Best For |
|---------|------|-------|----------|
| **Binary Search** | O(log n) | O(1) | Sorted array |
| **Linear Search** | O(n) | O(1) | Unsorted, small data |
| **Hash Table** | O(1) avg | O(n) | Point lookups |
| **BST** | O(log n) | O(n) | Dynamic sorted data |
| **Interpolation** | O(log log n) avg | O(1) | Uniformly distributed |

---

### Decision Tree

```
Need to search for element?
├── Yes → Data structure?
│   ├── Array → Sorted?
│   │   ├── Yes → BINARY SEARCH
│   │   └── No → Sort first or LINEAR SEARCH
│   ├── Linked List → LINEAR (can't binary search)
│   └── Tree/BST → TREE SEARCH
└── No → Different pattern
```

---

### Key Trade-offs

| Consideration | Binary Search Wins | Hash Table Wins |
|-------------|-------------------|-----------------|
| Space efficiency | ✓ | - |
| Point lookup speed | - | ✓ |
| Range queries | ✓ | - |
| Sorted order access | ✓ | - |
| Dynamic updates | - | ✓ |
| Implementation simplicity | - | ✓ |

<!-- back -->
