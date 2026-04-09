## Bitwise XOR - Missing Number: Comparison

When should you use XOR vs other approaches?

<!-- front -->

---

### XOR vs Math vs Hash

| Aspect | XOR | Math (Sum) | Hash Set |
|--------|-----|------------|----------|
| **Time** | O(n) | O(n) | O(n) |
| **Space** | O(1) | O(1) | O(n) |
| **Overflow** | No | Risk | No |
| **Use case** | Single/Missing | Single/Missing | Any pattern |

**Winner**: XOR for interviews (elegant), Math for simplicity

---

### When to Use Each

**XOR:**
- Single missing number
- Elegant solution
- No overflow concerns
- Interview show-off

**Math (Sum):**
- Quick and simple
- Easy to understand
- Risk of overflow with big numbers

**Hash Set:**
- Complex patterns
- Multiple missing
- Frequency counting

---

### Key Trade-offs

| Situation | Best Approach | Why |
|-----------|---------------|----- |
| Single/missing | XOR | Clean, no overflow |
| Quick code | Math sum | Simple arithmetic |
| Multiple issues | Hash set | Flexible |
| Very large numbers | XOR | No overflow |

<!-- back -->
