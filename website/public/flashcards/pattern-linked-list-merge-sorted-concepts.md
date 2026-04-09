## Linked List - Merge Two Sorted: Core Concepts

What are the fundamental principles of merging two sorted linked lists?

<!-- front -->

---

### Core Concept

Use **a dummy head and two pointers to iteratively compare and link nodes**, building the merged list in sorted order.

**Key insight**: Similar to array merge but with pointer manipulation - always pick the smaller node and advance that list.

---

### The Pattern

```
List1: 1 → 3 → 5
List2: 2 → 4 → 6

Dummy → ?
  ↑
 tail

Step 1: 1 < 2, link 1
Dummy → 1
        ↑
       tail
List1 now at 3

Step 2: 3 > 2, link 2
Dummy → 1 → 2
            ↑
           tail
List2 now at 4

Step 3: 3 < 4, link 3
Dummy → 1 → 2 → 3
                ↑
               tail

Continue...

Final: Dummy → 1 → 2 → 3 → 4 → 5 → 6
Return dummy.next: 1 → 2 → 3 → 4 → 5 → 6 ✓
```

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| **Merge Two Lists** | Basic merge | Merge Two Sorted Lists |
| **Merge K Lists** | Multiple lists | Merge k Sorted Lists |
| **Sort List** | Merge sort on LL | Sort List |
| **Intersection** | Common nodes | Intersection of Lists |
| **Add Two Numbers** | Digit by digit | Add Two Numbers |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| **Time** | O(n + m) | One pass through both lists |
| **Space** | O(1) | In-place, just pointers |
| **Recursive** | O(n + m) time, O(n + m) space | Stack overhead |

<!-- back -->
