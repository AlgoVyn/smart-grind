## Stack - Min Stack Design: Comparison

What are the differences between Pair Storage and Two Stacks approaches?

<!-- front -->

---

### Approach Comparison

| Aspect | Pair Storage | Two Stacks |
|--------|--------------|------------|
| **Data Structure** | Single stack of tuples | Two separate stacks |
| **Space per element** | 2 integers (value + min) | 1-2 integers (depends on value) |
| **Implementation** | Simpler | Slightly more complex |
| **Push logic** | Calculate min, store tuple | Push to main, conditionally to min |
| **Pop logic** | Simple pop | Pop from both if values match |
| **GetMin logic** | Return tuple[1] | Return min_stack[-1] |

---

### Code Comparison

**Push Operation:**

```python
# Pair Storage
    def push(self, val: int) -> None:
        current_min = min(val, self.stack[-1][1]) if self.stack else val
        self.stack.append((val, current_min))

# Two Stacks
    def push(self, val: int) -> None:
        self.stack.append(val)
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)
```

**Pop Operation:**

```python
# Pair Storage
    def pop(self) -> None:
        self.stack.pop()

# Two Stacks
    def pop(self) -> None:
        val = self.stack.pop()
        if val == self.min_stack[-1]:
            self.min_stack.pop()
```

---

### Space Efficiency Comparison

```
Scenario: Push [5, 3, 7, 2, 2] then Pop once

┌─────────────────────────────────────────────────────────┐
│  Pair Storage                                          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                 │
│  After pushes: [(5,5), (3,3), (7,3), (2,2), (2,2)]     │
│  Space used: 10 integers (5 pairs × 2)                 │
│                                                         │
│  After 1 pop: [(5,5), (3,3), (7,3), (2,2)]             │
│  Space used: 8 integers                                │
├─────────────────────────────────────────────────────────┤
│  Two Stacks                                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━                          │
│  After pushes: main=[5,3,7,2,2], min=[5,3,2,2]         │
│  Space used: 9 integers (5 + 4)                        │
│                                                         │
│  After 1 pop: main=[5,3,7,2], min=[5,3,2]              │
│  Space used: 7 integers                                │
└─────────────────────────────────────────────────────────┘
```

---

### When to Use Each

| Use Pair Storage When | Use Two Stacks When |
|----------------------|---------------------|
| You want simplest code | Input is mostly decreasing |
| Single data structure preferred | Space is critical concern |
| Thread safety with one lock | Need to track multiple stats |
| Consistent space usage | Min stack is much smaller |

---

### Space Complexity Scenarios

| Input Pattern | Pair Storage | Two Stacks | Winner |
|--------------|--------------|------------|--------|
| Increasing [1,2,3,4,5] | O(n) | O(n) | Tie |
| Decreasing [5,4,3,2,1] | O(n) | O(n) | Tie |
| Constant [3,3,3,3,3] | O(n) | O(n) | Tie |
| Zigzag [1,5,2,4,3] | O(n) | O(n) | Tie |

**Note**: Two stacks saves space only when non-minimum values greatly outnumber minimum changes.

<!-- back -->
