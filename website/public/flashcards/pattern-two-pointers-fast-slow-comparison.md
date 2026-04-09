## Two Pointers - Fast & Slow: Comparison

When should you use Fast & Slow pointers versus alternative approaches?

<!-- front -->

---

### Fast & Slow vs Hash Set for Cycle Detection

| Aspect | Fast & Slow | Hash Set |
|--------|-------------|----------|
| **Time** | O(n) | O(n) |
| **Space** | O(1) | O(n) |
| **Implementation** | Slightly complex | Simple |
| **Can get cycle start** | Yes (with Phase 2) | Yes (store nodes) |
| **Can get cycle length** | Yes | Yes |

**Winner**: Fast & Slow - same time, better space

```python
# Hash Set approach
def has_cycle_hash(head):
    seen = set()
    while head:
        if head in seen:
            return True
        seen.add(head)
        head = head.next
    return False
```

---

### Fast & Slow vs Counting for Middle Element

| Aspect | Fast & Slow | Two-pass Counting |
|--------|-------------|-------------------|
| **Time** | O(n) | O(n) |
| **Space** | O(1) | O(1) |
| **Passes** | 1 | 2 |
| **Handles streaming** | Yes | No |

**Winner**: Fast & Slow - single pass, online algorithm

```python
# Two-pass approach
def find_middle_twopass(head):
    count = 0
    curr = head
    while curr:
        count += 1
        curr = curr.next
    
    curr = head
    for _ in range(count // 2):
        curr = curr.next
    return curr
```

---

### When to Use Fast & Slow

**Use Fast & Slow when:**
- Linked list cycle detection needed
- Finding middle in single pass
- O(1) space is required
- Mathematical sequence may have cycles
- Array values act as pointers (1..n range)

**Don't use when:**
- Random access is available (use binary search)
- Array isn't sorted and you need pairs
- You need to find multiple cycles
- Problem requires array modification

---

### Comparison with Other Two Pointer Patterns

| Pattern | Movement | Best For | Time | Space |
|---------|----------|----------|------|-------|
| **Fast & Slow** | Same direction, different speeds | Cycles, middle | O(n) | O(1) |
| **Converging** | Opposite ends toward center | Sorted pair sum | O(n) | O(1) |
| **Fixed Gap** | Same direction, fixed distance | Nth from end | O(n) | O(1) |
| **Expanding** | Center outward | Palindromes | O(n²) | O(1) |

---

### Decision Tree: Which Two Pointer?

```
Is the input a linked list?
├── Yes → Is it about finding cycles?
│   ├── Yes → FAST & SLOW
│   └── No → Is it about finding middle?
│       ├── Yes → FAST & SLOW
│       └── No → FIXED SEPARATION
└── No → Is the array sorted?
    ├── Yes → CONVERGING
    └── No → Are we finding palindromes?
        ├── Yes → EXPANDING FROM CENTER
        └── No → IN-PLACE MODIFICATION
```

---

### Key Trade-offs

| Consideration | Fast & Slow Advantage | Alternative Advantage |
|---------------|----------------------|---------------------|
| Space | O(1) unbeatable | Hash easier to understand |
| Multiple cycles | Detects first only | Hash set finds all nodes in cycles |
| Implementation | Elegant once known | Hash is more intuitive |
| Large data | Perfect for streaming | Hash may exceed memory |

<!-- back -->
