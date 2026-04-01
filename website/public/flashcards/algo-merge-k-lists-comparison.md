## Title: Merge k Lists Comparison

How does merging k lists compare to other merge and heap problems?

<!-- front -->

---

### Algorithm Comparison
| Problem | Approach | Time | Space |
|---------|----------|------|-------|
| Merge 2 lists | Iterative | O(n+m) | O(1) |
| Merge k lists (heap) | Min-heap | O(N log k) | O(k) |
| Merge k lists (D&C) | Recursive | O(N log k) | O(log k) |
| Sort then merge | TimSort | O(N log N) | O(N) |
| Stream merge | Generator | O(N log k) | O(k) |

### When to Use Each
| Scenario | Best Approach |
|----------|---------------|
| k = 2 | Standard two-pointer merge |
| k small (< 100) | Heap or pairwise |
| k very large | D&C for stack safety |
| Streaming data | Heap with generators |
| External sort | D&C with file handles |

### Related Problems
| Problem | Relation |
|---------|----------|
| Find median in stream | Similar heap approach |
| Top k elements | Same heap size bound |
| K closest points | Distance as key |
| Ugly numbers | Multiple generators |
| Super ugly numbers | Generalized |

---

### Heap vs Tree
| Structure | Insert | Extract Min | Decrease Key |
|-----------|--------|-------------|--------------|
| Binary Heap | O(log n) | O(log n) | O(log n) |
| Fibonacci Heap | O(1) | O(log n)* | O(1)* |
| BST | O(log n)* | O(log n)* | O(log n)* |
| Pairing Heap | O(1) | O(log n)* | O(1)* |

*amortized

<!-- back -->
