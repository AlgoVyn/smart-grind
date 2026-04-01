## Monotonic Stack: Comparison

How do different monotonic stack approaches compare?

<!-- front -->

---

### Stack vs Alternative Approaches

| Problem | Stack | Alternative | Stack Advantage |
|---------|-------|-------------|-----------------|
| Next Greater | O(n) | Brute O(n²) | Linear time |
| Largest Rectangle | O(n) | Brute O(n²) | Single pass |
| Stock Span | O(n) | Array O(n) amortized | Cleaner code |

---

### Strict vs Non-Strict Monotonicity

| Type | Comparison | Use When |
|------|------------|----------|
| Strict | `<` or `>` | Need strictly next greater/smaller |
| Non-strict | `<=` or `>=` | Handle duplicates, avoid infinite loops |

**Critical for**: Problems counting subarrays (sum of subarray minimums).

---

### Stack vs Deque (Monotonic Queue)

| Feature | Stack | Deque |
|---------|-------|-------|
| Remove from | One end | Both ends |
| Use case | One-directional queries | Sliding windows |
| Operations | Push/pop | Push/pop/popleft |
| Example | NGE, histogram | Sliding window max |

---

### Common Problem Transformations

| Given Problem | Transform To | Pattern |
|---------------|--------------|---------|
| Find leader | Next greater to right | Decreasing stack |
| Water trapping | Previous/next greater | Two monotonic passes |
| Max subarray min | Contribution counting | Two monotonic + math |

---

### Time Complexity Analysis

| Operation | Cost | Why |
|-----------|------|-----|
| Push | O(1) | Each element pushed once |
| Pop | O(1) amortized | Each element popped at most once |
| Total | O(n) | 2n operations max |

**Space**: O(n) worst case (decreasing array for NGE).

```
Worst case for NGE: [5, 4, 3, 2, 1]
Stack grows to n, no pops until end.
```

<!-- back -->
