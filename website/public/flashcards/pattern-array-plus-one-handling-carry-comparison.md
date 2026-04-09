## Array - Plus One (Handling Carry): Comparison

When should you use different approaches for incrementing digit arrays?

<!-- front -->

---

### Approach Comparison

| Aspect | Reverse Iteration | Explicit Carry | Recursive |
|--------|-------------------|----------------|-----------|
| **Time** | O(n) | O(n) | O(n) |
| **Space** | O(1) | O(1) | O(n) stack |
| **Code** | Cleanest | Extensible | Educational |
| **Best for** | Interview standard | Adding any K | Linked lists |

**Winner**: Reverse iteration for interviews, explicit carry for extensions.

---

### When to Use Each

**Reverse Iteration (Optimal):**
- Standard interview solution (LeetCode 66)
- Cleanest, most readable code
- O(1) space, O(n) time

**Explicit Carry:**
- Adding values other than 1
- More general arithmetic operations
- Clearer carry logic for complex cases

**Recursive:**
- Educational demonstrations
- Linked list implementations (can reverse then process)
- Not recommended for arrays (stack overhead)

**String Conversion (Avoid):**
- Simple but limited by integer overflow
- Not acceptable in interviews
- Only for very small numbers

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|-----|
| Interview standard | Reverse iteration | Clean, efficient, expected |
| Add arbitrary K | Explicit carry | Easy to modify carry value |
| Linked list input | Reverse + iterate | Or use recursion |
| Preserve original | Copy first, then modify | Or use explicit carry version |

<!-- back -->
