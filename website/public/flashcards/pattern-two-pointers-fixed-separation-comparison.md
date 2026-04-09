## Two Pointers - Fixed Separation: Comparison

When should you use Fixed Separation versus other linked list approaches?

<!-- front -->

---

### Fixed Separation vs Two-Pass

| Aspect | Fixed Separation | Two-Pass |
|--------|------------------|----------|
| **Time** | O(n) | O(n) |
| **Space** | O(1) | O(1) |
| **Passes** | 1 | 2 |
| **Code complexity** | Moderate | Simpler |

**Winner**: Fixed separation (single pass, more elegant)

```python
# Two-pass approach (simpler but two traversals)
def nth_from_end_twopass(head, n):
    # First pass: count
    length = 0
    curr = head
    while curr:
        length += 1
        curr = curr.next
    
    # Second pass: go to length - n
    curr = head
    for _ in range(length - n):
        curr = curr.next
    return curr
```

---

### When to Use Fixed Separation

**Use when:**
- Finding kth element from end
- Removing kth from end
- Rotating linked list
- Any "relative position" problem

**Don't use when:**
- Cycle detection (use Fast & Slow)
- Middle element (use Fast & Slow)
- Two-pointer from ends (array problems)

---

### Comparison with Fast & Slow

| Pattern | Speed | Best For |
|---------|-------|----------|
| **Fixed Separation** | Same, fixed gap | Nth from end |
| **Fast & Slow** | Different speeds | Cycles, middle |

**Fast & Slow can find middle** (gap naturally becomes half), but **Fixed Separation is clearer** for specific positions.

---

### Decision Tree

```
Linked list problem?
├── Yes → Finding element relative to end?
│   ├── Yes → FIXED SEPARATION
│   └── No → Cycle or middle?
│       ├── Yes → FAST & SLOW
│       └── No → Other pattern
└── No → Different data structure pattern
```

---

### Key Trade-offs

| Consideration | Fixed Separation Wins | Alternative Wins |
|-------------|------------------------|------------------|
| Single pass elegance | ✓ | - |
| Code simplicity | - | Two-pass |
| Concept clarity | ✓ | - |
| Memory constraints | Same | Same |

<!-- back -->
