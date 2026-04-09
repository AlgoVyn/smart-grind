## Linked List Intersection Detection: Comparison

When should you use different approaches for cycle detection and list intersection problems?

<!-- front -->

---

### Floyd's vs Hash Set Approach

| Aspect | Floyd's (Fast/Slow) | Hash Set |
|--------|---------------------|----------|
| **Space** | O(1) - 2 pointers | O(n) - store all nodes |
| **Time** | O(n) | O(n) |
| **Code complexity** | Medium (pointer logic) | Simple (set operations) |
| **Can find cycle start** | ✅ Yes | ❌ No (just detection) |
| **Can find cycle length** | ✅ Yes | ❌ No |
| **Suitable for interviews** | ✅ Preferred | Only if space allowed |
| **Real-world use** | Embedded, memory constrained | When clarity matters |

**Winner**: Floyd's for technical interviews; Hash Set for quick prototypes.

---

### Two-Pointer vs Length-Calculation for List Intersection

| Aspect | Two-Pointer (Switch Heads) | Length + Advance |
|--------|---------------------------|------------------|
| **Space** | O(1) | O(1) |
| **Time** | O(n+m) | O(n+m) |
| **Pass count** | At most 2 passes each | 2 passes + 1 comparison |
| **Code length** | Very short (4 lines) | Longer (helper function) |
| **Intuition** | Elegant trick | More explicit/straightforward |
| **Edge cases** | Clean handling | Clean handling |

**Winner**: Two-pointer switch for elegance; Length-calculation for clarity.

---

### Cycle Detection vs Two List Intersection

| Feature | Cycle Detection | List Intersection |
|---------|-----------------|-------------------|
| **Input** | Single linked list | Two linked lists |
| **Output** | Boolean / cycle start node | Intersection node or None |
| **Movement** | Different speeds (1x vs 2x) | Same speed, switch at end |
| **Core logic** | Meeting in a loop | Aligning after full traversal |
| **Modification** | Never modify list | Never modify lists |
| **Extension** | Cycle length, array cycles | Hash set alternative |

**Key difference**: Cycle = internal loop within one list; Intersection = shared tail between two lists.

---

### Decision Matrix

```
Problem type?
├── Detect cycle in linked list?
│   ├── Space critical? → Floyd's O(1)
│   └── Space available? → Hash Set (simpler)
│
├── Find where cycle starts?
│   └── Floyd's + Phase 2 (only option without hash)
│
├── Two linked lists intersect?
│   ├── Want elegant code? → Two-pointer switch
│   └── Want explicit logic? → Length calculation
│
├── Find duplicate in array [1..n]?
│   └── Array-as-linked-list + Floyd's
│
├── Happy Number / iterative transformation?
│   └── Floyd's on computed values
│
└── Find middle / kth from end?
    └── Fast/slow with gap pattern
```

---

### Iterative vs Recursive

| Aspect | Iterative (Floyd's) | Recursive (not applicable) |
|--------|---------------------|------------------------------|
| **Stack space** | O(1) | N/A - Floyd's is inherently iterative |
| **Code clarity** | Clean loops | Not suitable for this pattern |
| **Cycle detection** | Natural with moving pointers | Would cause infinite recursion in cycle |

**Note**: Floyd's algorithm is inherently iterative. Recursion would cause stack overflow in cyclic structures.

---

### Common Pitfalls Comparison

| Pitfall | Naive (Visited Marker) | Floyd's | Hash Set |
|---------|------------------------|---------|----------|
| **Space efficiency** | ❌ Modifies input | ✅ O(1) | ❌ O(n) |
| **Cycle start detection** | ❌ No | ✅ Yes | ❌ No |
| **Time limit** | ✅ O(n) | ✅ O(n) | ✅ O(n) |
| **Code complexity** | Low | Medium | Low |
| **Interview acceptance** | ❌ Modifying input bad practice | ✅ Standard answer | ⚠️ Acceptable if justified |

---

### When to Choose Which Pattern

| Situation | Approach | Why |
|-----------|----------|-----|
| **Technical interview** | Floyd's / Two-pointer | Expected optimal solution |
| **Space constrained** | Floyd's O(1) | No extra allocation |
| **Quick debugging** | Hash Set | Easier to verify |
| **Need cycle start** | Floyd's Phase 2 | Only O(1) solution |
| **Two list intersection** | Two-pointer switch | Cleanest code |
| **Array cycle detection** | Value-as-pointer Floyd's | Treat indices as links |
| **Happy number** | Computed-value Floyd's | Detect cycles in sequences |

<!-- back -->
