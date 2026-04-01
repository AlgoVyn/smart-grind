## Detect Cycle: Core Concepts

What are the fundamental approaches for detecting cycles in linked lists and sequences?

<!-- front -->

---

### Problem Variants

| Variant | Input | Goal |
|---------|-------|------|
| **Linked list** | Pointer-based list | Detect if cycle exists |
| **Functional graph** | f: S → S | Find cycle start/length |
| **Sequence** | Array indices | Detect cycle in iteration |
| **Undirected graph** | Edges | Detect any cycle |

---

### Floyd's Cycle-Finding (Tortoise & Hare)

**Intuition:** Two runners on a circular track, one twice as fast as the other, will eventually meet.

```
Phase 1 - Meeting:
  slow moves 1 step at a time
  fast moves 2 steps at a time
  If fast reaches null: no cycle
  If fast == slow: cycle detected

Phase 2 - Finding entry:
  Reset slow to head
  Move both 1 step at a time
  Meeting point = cycle entry
```

---

### Mathematical Proof

```
Let:
  m = distance from head to cycle entry
  n = distance from entry to meeting point
  c = cycle length

When they meet:
  slow distance: m + n + k₁c
  fast distance: m + n + k₂c = 2 × slow

Therefore: m + n = multiple of c
  → m ≡ -n (mod c)

When slow reset to head:
  slow walks m to entry
  fast (at n from entry) walks m ≡ -n (mod c)
  → fast also at entry!
```

---

### Complexity Analysis

| Approach | Time | Space | Use Case |
|----------|------|-------|----------|
| **Floyd's** | O(n) | O(1) | Linked list, functional graphs |
| **Hash set** | O(n) | O(n) | General, need visited tracking |
| **Brent's** | O(μ + λ) | O(1) | Shorter average than Floyd's |
| **DFS (graphs)** | O(V+E) | O(V) | General graph cycle detection |

---

### Brent's Algorithm

Alternative with potentially fewer steps:
```
power = 1, λ = 1
 tortoise = x₀, hare = f(x₀)
 while tortoise != hare:
   if power == λ:
     tortoise = hare
     power *= 2
     λ = 0
   hare = f(hare)
   λ += 1
# λ is cycle length
```

<!-- back -->
