## Stack - Monotonic Stack: Core Concepts

What are the fundamental principles of monotonic stacks for finding next greater/smaller elements?

<!-- front -->

---

### Core Concept

Use **a stack that maintains monotonically increasing or decreasing order** to efficiently find next greater/smaller elements in O(n) time.

**Key insight**: A decreasing stack keeps elements in order where we can quickly find the next greater element for each item.

---

### The Pattern

```
Find Next Greater Element for [2, 1, 2, 4, 3]:

Use decreasing monotonic stack:

i=0, val=2: Stack empty, push 2
  Stack: [2]
  
i=1, val=1: 1 < stack.top(2), push 1
  Stack: [2, 1]
  
i=2, val=2: 2 > stack.top(1)
  Pop 1, NGE[1] = 2 (found!)
  2 == stack.top(2), push 2
  Stack: [2, 2]
  
i=3, val=4: 4 > stack.top(2)
  Pop 2, NGE[2] = 4 (found!)
  Pop 2, NGE[2] = 4 (found!)
  Stack empty, push 4
  Stack: [4]
  
i=4, val=3: 3 < 4, push 3
  Stack: [4, 3]

End: Pop remaining, NGE = -1
  NGE[3] = -1, NGE[4] = -1

Result: [4, 2, 4, -1, -1] ✓
```

---

### Stack Types

| Type | Order | Finds |
|------|-------|-------|
| **Decreasing** | Top is smallest | Next greater element |
| **Increasing** | Top is largest | Next smaller element |

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| **Next Greater Element** | NGE for each element | Next Greater Element |
| **Next Smaller Element** | NSE for each element | Next Smaller |
| **Largest Rectangle** | In histogram | Largest Rectangle |
| **Daily Temperatures** | Days until warmer | Daily Temperatures |
| **Stock Span** | Consecutive smaller | Online Stock Span |
| **Trapping Rain Water** | Calculate trapped water | Trapping Rain Water |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| **Time** | O(n) | Each element pushed/popped once |
| **Space** | O(n) | Stack size |
| **Naive** | O(n²) | For each, scan forward |

<!-- back -->
