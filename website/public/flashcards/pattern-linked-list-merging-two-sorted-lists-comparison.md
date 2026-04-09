## Linked List - Merging Two Sorted Lists: Comparison

When should you use iterative vs recursive approaches for merging two sorted lists?

<!-- front -->

---

### Iterative vs Recursive Comparison

| Aspect | Iterative (Recommended) | Recursive |
|--------|------------------------|-----------|
| **Space** | O(1) auxiliary | O(n + m) stack |
| **Time** | O(n + m) | O(n + m) |
| **Code clarity** | Explicit loop | Elegant, concise |
| **Stack overflow risk** | None | Risk for large lists |
| **Pointer manipulation** | Explicit | Implicit in returns |
| **Base case handling** | Loop condition | Explicit null checks |
| **Debugging** | Easier to trace | Stack traces can help |

**Rule of thumb:** Use iterative for production code; recursive for elegance in interviews.

---

### Comparison: Space Optimized vs Creating New Nodes

| Approach | Space | When to Use |
|----------|-------|-------------|
| **In-place (rewire pointers)** | O(1) | **Recommended** - reuses existing nodes |
| **Create new nodes** | O(n + m) | When inputs must not be modified |

**In-place (pointer rewiring):**
```python
current.next = l1  # Just rewire pointer, no new allocation
l1 = l1.next
```

**Creating new nodes:**
```python
current.next = ListNode(l1.val)  # New allocation
l1 = l1.next
```

---

### Comparison: Different Merge Variations

| Problem Type | Modification | Approach |
|--------------|--------------|----------|
| **Standard merge** | None | Compare and pick smaller |
| **Merge sorted arrays** | Array access | Same logic, use indices |
| **Merge descending** | Pre-sort | Reverse lists or change comparison |
| **Merge with duplicates removed** | Skip duplicates | Add check `if current.val != next.val` |
| **Merge alternating** | Interleave | Pick from each list alternately |

---

### Decision Matrix

| Situation | Approach | Space | Why |
|-----------|----------|-------|----- |
| Standard problem | Iterative in-place | O(1) | Cleanest, fastest |
| Cannot modify inputs | Iterative with new nodes | O(n+m) | Preserves originals |
| Very deep lists | Iterative only | O(1) | Avoid stack overflow |
| Interview elegance | Recursive | O(n+m) | Concise, beautiful |
| k lists (k > 2) | Heap or divide-conquer | O(k) | Efficient for large k |

---

### Common Pitfalls Comparison

| Pitfall | Iterative | Recursive |
|---------|-----------|-----------|
| Forgetting current advancement | Common | N/A |
| Null pointer access | Common at loop | In base cases |
| Returning dummy instead of dummy.next | Common | N/A |
| Stack overflow | Impossible | Risk for large input |
| Off-by-one in remainder append | Rare | N/A |

---

### Related Algorithm Comparison

| Algorithm | Time | Space | Use Case |
|-----------|------|-------|----------|
| Two-way merge (this pattern) | O(n+m) | O(1) | 2 sorted lists |
| k-way merge (heap) | O(N log k) | O(k) | k sorted lists |
| k-way merge (pairwise) | O(N log k) | O(log k) | k sorted lists |
| Merge sort | O(n log n) | O(n) or O(1) | Sorting unsorted data |

**Note:** Two-way merge is the building block for all multi-way merges and merge sort.

<!-- back -->
