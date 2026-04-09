## Design - General/Specific: Framework

What is the systematic framework for solving design problems?

<!-- front -->

---

### Design Problem Framework

```
STEP 1: ANALYZE REQUIREMENTS
├── List all required operations
├── Identify time complexity constraints for each
└── Note space complexity limits

STEP 2: IDENTIFY BOTTLENECKS
├── Which operation is called most frequently?
├── Which operation needs to be fastest?
└── What trade-offs are acceptable?

STEP 3: SELECT DATA STRUCTURES
├── Fast lookup → HashMap (O(1))
├── Maintain order → Linked List (O(1) reorder)
├── Range queries → BST/Segment Tree (O(log n))
└── Min/Max tracking → Heap (O(log n))

STEP 4: COMBINE STRUCTURES
├── Map + Linked List (LRU Cache)
├── Two Stacks (Min Stack)
├── Map + Heap (Frequency tracking)
└── Map + ArrayList (Random access + lookup)

STEP 5: IMPLEMENT & VERIFY
├── Handle edge cases (empty, full, single)
├── Maintain invariants after each operation
└── Test with examples
```

---

### Key Decision Matrix

| Need | Data Structure | Time | Trade-off |
|------|---------------|------|-----------|
| O(1) lookup | HashMap | O(1) | No ordering |
| O(1) reordering | Doubly LL | O(1) | O(n) search |
| Both | HashMap + DLL | O(1) | More complex |

<!-- back -->
