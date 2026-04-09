## Greedy Task Scheduling (Frequency Based): Comparison

When should you use different approaches for task scheduling problems?

<!-- front -->

---

### Max Heap vs Mathematical Formula

| Aspect | Max Heap + Queue | Mathematical Formula |
|--------|-----------------|----------------------|
| **Time** | O(n log m) | O(n) |
| **Space** | O(m) | O(m) |
| **Output** | Actual schedule | Time count only |
| **Use case** | Need actual schedule | Only need minimum time |
| **Code complexity** | Moderate | Simple |
| **Flexibility** | High (easily modified) | Low (fixed formula) |

**Winner**: Mathematical for time-only, Heap for schedule reconstruction

---

### When to Use Each Approach

**Max Heap with Cooldown Queue**:
- Task Scheduler with cooldown (LeetCode 621)
- Reorganize string (LeetCode 767)
- Need actual task sequence
- Variable cooldown periods
- Need to modify/extend solution

**Mathematical Formula**:
- Only need minimum time units
- Fixed uniform cooldown
- Large input size (performance critical)
- Quick verification of answer

**Two-Pass Array Fill**:
- String reorganization problems
- No heap needed
- O(n log m) due to sorting
- Simpler to understand

---

### Comparison with Other Scheduling Patterns

| Pattern | Time | Space | Best For |
|---------|------|-------|----------|
| **Max Heap + Queue** | O(n log m) | O(m) | Frequency-based with constraints |
| **Mathematical** | O(n) | O(m) | Time calculation only |
| **Two-Pass Fill** | O(n log m) | O(m) | String reorganization |
| **Interval Scheduling** | O(n log n) | O(1) | Non-overlapping intervals |
| **Topological Sort** | O(V + E) | O(V) | Task dependencies |

---

### Decision Tree

```
Task scheduling problem?
├── Need actual task sequence?
│   ├── Yes
│   │   ├── String/character rearrangement?
│   │   │   ├── Yes → Two-Pass Array Fill or Max Heap
│   │   │   └── No → Max Heap with Cooldown Queue
│   │   └── Cooldown varies by task?
│   │       ├── Yes → Modified heap with per-task tracking
│   │       └── No → Standard heap + queue
│   └── No (only need time count)
│       └── Fixed cooldown?
│           ├── Yes → MATHEMATICAL FORMULA
│           └── No → Heap simulation
│
├── Task dependencies exist?
│   └── Yes → TOPOLOGICAL SORT (Kahn's algorithm)
│
└── Minimize number of workers/machines?
    └── Yes → INTERVAL SCHEDULING GREEDY
```

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|-----|
| LeetCode 621 (Task Scheduler) | Heap or Math | Both work; math faster |
| LeetCode 767 (Reorganize String) | Heap or Two-Pass | Heap more general |
| Need schedule reconstruction | Heap | Produces actual order |
| Large n, time-only | Math | O(n) vs O(n log m) |
| Per-task cooldown | Modified heap | Track individual wait times |
| Circular arrangement | Two-Pass | Natural fit for indices |

---

### Complexity Comparison

| Approach | Best Case | Average | Worst Case |
|----------|-----------|---------|------------|
| Heap + Queue | O(m log m) | O(n log m) | O(n log m) |
| Mathematical | O(n) | O(n) | O(n) |
| Two-Pass | O(m log m) | O(n log m) | O(n log m) |

Note: m = unique tasks, n = total tasks. Usually m ≤ n.

<!-- back -->
