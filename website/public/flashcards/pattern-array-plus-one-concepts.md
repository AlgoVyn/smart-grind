## Array - Plus One: Core Concepts

What are the fundamental principles of array-based addition?

<!-- front -->

---

### Core Concept

**Simulate manual addition: process from least significant digit (right), handle carry, and extend array if needed (all 9s case).**

**Example walkthrough [9, 9, 9]:**
```
Start: [9, 9, 9]

i=2 (last): digit is 9
  → Set to 0, carry continues
  [9, 9, 0]

i=1: digit is 9
  → Set to 0, carry continues
  [9, 0, 0]

i=0: digit is 9
  → Set to 0, carry continues
  [0, 0, 0]

Loop ended (all 9s case)
→ Insert 1 at front
[1, 0, 0, 0]
```

---

### The Pattern

```
Key insights:
1. Start from right (least significant)
2. Early termination: most numbers don't have trailing 9s
3. 9 becomes 0 with carry
4. <9 just increment and done
5. All 9s: need new leading 1
```

---

### Common Applications

| Problem Type | Use Case | Example |
|--------------|----------|---------|
| Plus one | Increment number | LeetCode 66 |
| Add two numbers | Array arithmetic | Big number ops |
| Multiply by digit | Scaling | Extended arithmetic |
| String addition | Similar concept | Binary, hex |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n) | Single pass, often early exit |
| Space | O(1) | Modify in place |
| Worst case | O(n) | When all 9s, create new array |

<!-- back -->
