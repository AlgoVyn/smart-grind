## Recover BST: Core Concepts

What are the fundamental principles of recovering a binary search tree with swapped nodes?

<!-- front -->

---

### Core Concept

In a valid BST, inorder traversal yields a **sorted sequence**. If two nodes are swapped, the sequence has exactly **two violations** of the sorted order.

**Key insight**: Find violations in inorder traversal, swap back the misplaced nodes.

---

### Identifying Swapped Nodes

In a valid inorder traversal: `... a < b < c < d < e ...`

If b and d are swapped: `... a < d < c < b < e ...`

| Violation Type | Pattern | Nodes to Swap |
|----------------|---------|--------------|
| First | `prev > current` | first = prev |
| Second | `prev > current` | second = current |

---

### Visual: Finding Violations

```
Original BST (inorder): 1, 2, 3, 4, 5, 6, 7

Swapped 3 and 6:
Inorder: 1, 2, 6, 4, 5, 3, 7
              ↑     ↑
           6>4     5>3
           first  second

First violation: prev=6, curr=4 → first=6
Second violation: prev=5, curr=3 → second=3

Swap first and second to recover.
```

---

### Two Cases

| Case | Violations | Example |
|------|-----------|---------|
| Non-adjacent | 2 violations | `[1,2,6,4,5,3,7]` |
| Adjacent | 1 violation | `[1,2,4,3,5,6,7]` |

For adjacent case: `first` is first element, `second` is second element.

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n) | One inorder traversal |
| Space | O(h) | Recursion stack, h = height |
| Space (iterative) | O(1) | Morris traversal |

<!-- back -->
