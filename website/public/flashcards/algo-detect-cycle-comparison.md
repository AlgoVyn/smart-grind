## Detect Cycle: Comparison Guide

How do cycle detection algorithms compare across different scenarios?

<!-- front -->

---

### Algorithm Comparison

| Algorithm | Time | Space | Use When |
|-----------|------|-------|----------|
| **Floyd's** | O(μ + λ) | O(1) | Linked list, in-place required |
| **Brent's** | O(μ + λ) avg | O(1) | Often faster than Floyd's |
| **Hash set** | O(n) | O(n) | Need visited tracking, general graphs |
| **DFS (graph)** | O(V+E) | O(V) | General graph detection |
| **Union-Find** | O(α(V)) per op | O(V) | Dynamic connectivity |

**Notation:** μ = pre-cycle length, λ = cycle length, n = total nodes

---

### Floyd's vs Brent's

| Aspect | Floyd's | Brent's |
|--------|---------|---------|
| **Approach** | Constant step difference | Increasing power of 2 |
| **Worst case steps** | 3(μ + λ) | μ + λ + 2^⌈log₂ λ⌉ |
| **Average case** | Similar | Brent's often better |
| **Implementation** | Simpler | Slightly more complex |

**When to use:** Floyd's is standard; Brent's if profiling shows bottleneck.

---

### Data Structure Specific

| Structure | Best Algorithm | Notes |
|-----------|----------------|-------|
| **Linked list** | Floyd's | O(1) space, in-place |
| **Array as graph** | Floyd's or hash | Index → value mapping |
| **Undirected graph** | DFS or Union-Find | Track parent to avoid false cycle |
| **Directed graph** | DFS with states | White/Gray/Black coloring |
| **Functional graph** | Floyd's | f: S→S, out-degree = 1 |

---

### Space-Time Tradeoffs

```
Unlimited space:
  → Hash set, O(n) time, simple

Constant space required:
  → Floyd's, O(n) time
  → Can't use for general graphs (need stack)

Read-only constraint:
  → Floyd's for linked lists
  → Value range tricks for arrays
  → Binary search for sorted arrays
```

---

### Common Pitfalls

| Pitfall | Issue | Solution |
|---------|-------|----------|
| Self-loop not detected | Single node cycle | Check `slow != fast` before first advance |
| Wrong entry calculation | Forgetting to reset slow | `slow = head` in phase 2 |
| Infinite loop | No null check | Verify fast and fast.next exist |
| Modulo errors | Negative indices | Use proper modulo for wrap-around |
| Multiple cycles | Finding wrong cycle | Mark visited nodes |

<!-- back -->
