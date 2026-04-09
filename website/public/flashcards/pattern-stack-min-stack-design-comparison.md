## Stack - Min Stack Design: Comparison

When should you use Pair Storage vs Two-Stack approach for Min Stack?

<!-- front -->

---

### Approach Comparison

| Aspect | Pair Storage | Two Stacks |
|--------|--------------|------------|
| **Space** | O(n) always | O(n) worst, less in practice |
| **Code** | Simpler, cleaner | More complex |
| **Access** | One structure | Two structures |
| **Duplicates** | Handled automatically | Needs `<=` check |

---

### When to Use Each

**Pair Storage (Recommended)**
- General purpose implementation
- Clean, maintainable code
- Consistent space usage acceptable
- Thread-safe implementations

**Two Stacks**
- Mostly decreasing sequences (saves space)
- Memory-constrained environments
- When min stack rarely grows

---

### Space Analysis Example

```
Operations: push(5), push(4), push(3), push(2), push(1)

Pair Storage:           Two Stacks:
[(5,5), (4,4),          Main:  [5, 4, 3, 2, 1]
 (3,3), (2,2),          Min:   [5, 4, 3, 2, 1]
 (1,1)]                 Same space here

Operations: push(5), push(6), push(7), push(8), push(9)

Pair Storage:           Two Stacks:
[(5,5), (6,5),          Main:  [5, 6, 7, 8, 9]
 (7,5), (8,5),          Min:   [5]           ← much smaller!
 (9,5)]
```

---

### Time Complexity (Both)

| Operation | Pair Storage | Two Stacks |
|-----------|--------------|------------|
| push | O(1) | O(1) |
| pop | O(1) | O(1) |
| top | O(1) | O(1) |
| getMin | O(1) | O(1) |

**Winner**: Pair Storage for simplicity, Two Stacks for space optimization

<!-- back -->
