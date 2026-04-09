## Two Pointers - String Comparison with Backspaces: Comparison

When should you use different approaches for string comparison with backspaces?

<!-- front -->

---

### Two Pointers vs Stack vs Build String

| Aspect | Two Pointers (Optimal) | Stack-Based | Build String |
|--------|------------------------|-------------|--------------|
| **Time** | O(n + m) | O(n + m) | O(n + m) |
| **Space** | O(1) ✅ | O(n + m) | O(n + m) |
| **Implementation** | Moderate | Simple | Simple |
| **Readability** | Moderate | High | High |
| **Interview Standard** | ✅ Yes | ❌ No | ❌ No |
| **Production Use** | ✅ Yes | Limited | Limited |
| **Multiple Comparisons** | Reprocess each | Reuse stacks | Reuse strings |

**Rule of thumb**: Use Two Pointers for interviews and space-constrained problems. Use Stack for readability when space isn't critical.

---

### Forward vs Backward Processing

| Aspect | Forward (Stack) | Backward (Two Pointers) |
|--------|-----------------|-------------------------|
| **Direction** | Left to right | Right to left |
| **Data Structure** | Stack (LIFO) | Two indices |
| **Backspace Handling** | Pop from stack | Increment skip counter |
| **Space** | O(n) for stack | O(1) for pointers |
| **Natural Fit** | Simulates typing | Matches delete-left semantics |
| **Character Access** | Sequential | Random (index-based) |

**Winner**: Backward processing achieves O(1) space while being equally intuitive once understood.

---

### Iterative vs Recursive

| Aspect | Iterative (Two Pointers) | Recursive |
|--------|--------------------------|-----------|
| **Stack Space** | O(1) | O(n) recursion depth |
| **Code Clarity** | Slightly verbose | Natural for string problems |
| **Risk** | None | Stack overflow for long strings |
| **Optimization** | Easy to optimize | Tail recursion might help |

**Winner**: Iterative for this problem (no recursion benefits, extra stack risk).

---

### Space Complexity Tradeoffs

```
Problem Constraints?
├── Space must be O(1)?
│   └── Two Pointers (backward iteration)
│   └── Only option for space-constrained
│
├── Space can be O(n)?
│   ├── Stack (cleaner code, reusable)
│   ├── Build String (for actual result needed)
│   └── Two Pointers still preferred for interviews
│
├── Need actual processed string?
│   └── Stack or Build String required
│   └── Two pointers only compares, doesn't store
│
└── Comparing multiple strings to one target?
    ├── Process target once with stack: O(n)
    └── Compare others with two pointers: O(1) each
```

---

### Decision Matrix

| Situation | Approach | Space | Why |
|-----------|----------|-------|-----|
| Standard interview question | Two Pointers | O(1) | Expected optimal solution |
| Space explicitly constrained | Two Pointers | O(1) | Only viable option |
| Need processed string value | Stack | O(n) | Must build result |
| Comparing many to one | Stack once + Two Pointers | O(n) total | Amortize processing cost |
| Code golf / brevity | Stack | O(n) | Fewer lines |
| Teaching/learning | Stack → Two Pointers | - | Build intuition gradually |

---

### Common Pitfalls Comparison

| Pitfall | Naive Forward | Stack | Two Pointers |
|---------|-------------|-------|--------------|
| Space limit exceeded | ❌ O(n) built string | ❌ O(n) stack | ✅ O(1) |
| Backspace on empty | Handle with check | Empty stack check | Skip counter handles |
| Leading backspaces | Works | Works | Works |
| Multiple backspaces | Requires complex logic | Natural | Natural with counter |
| Off-by-one errors | Common | Rare | Common in indexing |
| Empty string result | Special case | Empty stack | Both -1 indices |

**Most common bug**: In two pointers, forgetting to move pointers after successful comparison (`i -= 1; j -= 1`).

<!-- back -->
