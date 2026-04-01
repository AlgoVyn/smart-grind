## Merge Sorted Lists: Core Concepts

What are the fundamental principles behind merging sorted lists and linked lists?

<!-- front -->

---

### Core Concept

Merging sorted lists maintains order by always selecting the smallest available element from the heads of input lists. Like merging two sorted piles of cards by repeatedly picking the smaller top card.

---

### Visual: Merge Process

```
List 1: 1 -> 3 -> 5 -> None
List 2: 2 -> 4 -> 6 -> None

Result: 1 -> 2 -> 3 -> 4 -> 5 -> 6 -> None

Step by step:
  Compare 1 vs 2 → pick 1
  Compare 3 vs 2 → pick 2
  Compare 3 vs 4 → pick 3
  Compare 5 vs 4 → pick 4
  Compare 5 vs 6 → pick 5
  List 1 empty → append 6
```

---

### Key Properties

| Property | Description |
|----------|-------------|
| Stability | Maintains relative order of equal elements |
| Space | O(1) for linked lists, O(n) for arrays |
| Time | O(n + m) where n, m are list lengths |
| Precondition | Input lists must be sorted |

---

### Algorithm Variants

| Variant | Input | Output | Key Feature |
|---------|-------|--------|-------------|
| Two lists | 2 sorted lists | 1 sorted list | Classic merge |
| K-way | k sorted lists | 1 sorted list | Use min-heap |
| In-place | 2 sorted arrays | 1 sorted array | Gap method or swap |

---

### Common Pitfalls

| Pitfall | Why It Happens | Fix |
|---------|----------------|-----|
| Losing nodes | Forgetting to save `next` before reassignment | Always store `next` first |
| Infinite loop | Not advancing pointers properly | Advance the pointer of the list you took from |
| Memory leak | Not handling tail properly | Explicitly set `tail.next = None` when done |

<!-- back -->
