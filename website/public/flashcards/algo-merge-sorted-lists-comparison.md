## Merge Sorted Lists: Comparison

How do different merge approaches compare for different scenarios?

<!-- front -->

---

### Two-List Merge Approaches

| Approach | Time | Space | Code Complexity | Best For |
|----------|------|-------|-----------------|----------|
| Iterative | O(n+m) | O(1) | Medium | Production code |
| Recursive | O(n+m) | O(n+m) | Simple | Interviews, clarity |
| Array (new) | O(n+m) | O(n+m) | Simple | When allocation OK |

---

### K-Way Merge Comparison

| Method | Time | Space | Heap Usage | Stability |
|--------|------|-------|------------|-----------|
| Heap | O(N log k) | O(k) | O(k) | Yes |
| Divide & Conquer | O(N log k) | O(log k) | None | Yes |
| Sequential | O(N*k) | O(1) | None | Yes |

**N** = total nodes, **k** = number of lists

---

### When to Use Each Approach

| Scenario | Recommended Approach | Why |
|----------|---------------------|-----|
| k=2, linked lists | Iterative | O(1) space, clean |
| k=2, arrays | Backwards in-place | No extra space |
| k=3-10 | Heap or D&C | Both O(N log k) |
| k=100+, memory tight | Divide & Conquer | O(log k) space |
| k=100+, speed critical | Heap | Better cache locality |

---

### Linked List vs Array Merge

| Aspect | Linked List | Array |
|--------|-------------|-------|
| Space | O(1) possible | O(n+m) or in-place tricky |
| Random access | No | Yes |
| Cache efficiency | Poor | Good |
| Code complexity | Simpler | In-place is tricky |
| Stability | Natural | Requires care |

---

### Performance Characteristics

```
Data sizes and recommended approaches:

Small (n < 1000):
  - Any method works
  - Recursive is readable

Medium (1k < n < 100k):
  - Iterative for linked lists
  - Heap for k-way merge

Large (n > 100k):
  - D&C for k-way (memory)
  - Iterative with pointer reuse
  - Consider external merge for massive data
```

<!-- back -->
