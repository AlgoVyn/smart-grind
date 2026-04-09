## Fast & Slow Pointers (Cycle Detection): Comparison

When should you use fast-slow pointers vs alternative approaches?

<!-- front -->

---

### Fast & Slow vs Hash Set Approach

| Aspect | Fast & Slow (Floyd's) | Hash Set |
|--------|----------------------|----------|
| **Time** | O(n) | O(n) |
| **Space** | O(1) | O(n) |
| **Code complexity** | Moderate | Simple |
| **Cycle detection** | Yes (native) | Yes (track visited) |
| **Entrance finding** | Yes (two-phase) | No (requires extra logic) |
| **Handles large data** | Excellent | Memory limited |
| **Modifies input** | No | No |

**Winner**: Fast & Slow for space-constrained scenarios, interviews
**Use Hash Set when**: Code clarity is priority, space not a concern

---

### When to Use Each Approach

**Fast & Slow Pointers:**
- Linked list cycle detection required
- O(1) space constraint specified
- Finding middle without length known
- Array-as-linked-list problems (duplicate finding)
- Happy number / sequence cycle problems

**Hash Set / Visited Tracking:**
- Need to track all visited nodes for other purposes
- Problem allows O(n) space
- Easier to implement and reason about
- Need to detect if specific node seen before (not just cycle)

**Marking/Flag Approach:**
- Can modify the linked list nodes
- Add flag/negative value to mark visited
- O(1) space but destructive

---

### Algorithm Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|-----|
| Interview (cycle detection) | Fast & Slow | Standard solution, shows algorithm knowledge |
| Interview (find middle) | Fast & Slow | Elegant, O(1) space |
| Production (read-only list) | Fast & Slow | No modification, space efficient |
| Production (can modify) | Mark visited | Simplest code, O(1) space |
| Need all cycle nodes | Hash Set | Track every node in cycle |
| Extremely long lists | Fast & Slow | No stack/heap issues |

---

### Cycle Detection: Floyd's vs Brent's Algorithm

| Algorithm | Tortoise Speed | Hare Speed | Detection Style |
|-----------|---------------|------------|-----------------|
| **Floyd's** | 1 | 2 | Move both each step, check equality |
| **Brent's** | 0 (stays) | 1,2,4,8... | Power-of-2 jumps, then linear |

**Floyd's advantages:**
- Simpler code
- Better for interviews
- Single loop structure

**Brent's advantages:**
- Often fewer steps in practice
- Easier to compute cycle length
- Better for some mathematical applications

**Interview choice**: Floyd's (standard, well-known)

---

### Comparison: Middle Finding Approaches

| Approach | Time | Space | Passes | Notes |
|----------|------|-------|--------|-------|
| **Fast-Slow** | O(n) | O(1) | 1 | Single pass, elegant |
| **Count then traverse** | O(n) | O(1) | 2 | Count length, then go to n/2 |
| **Store in array** | O(n) | O(n) | 1 | Simple but wasteful |

**Winner**: Fast-Slow for optimal space and single pass

---

### Key Decision Tree

```
Need to detect cycle or find middle?
│
├── Can modify the list?
│   └── Mark nodes (flag/negative value)
│       → O(1) space, destructive, simple
│
├── O(1) space required?
│   └── Use Fast & Slow (Floyd's)
│       → Standard, elegant, versatile
│
└── Space not a constraint?
    └── Use Hash Set for simplicity
        → Easier to implement, debug
```

<!-- back -->
