## Two Pointers - Fixed Separation: Core Concepts

What are the fundamental principles of the Fixed Separation two-pointer pattern?

<!-- front -->

---

### Core Concept

Use **two pointers maintaining a fixed distance apart** to find elements relative to each other in a single pass.

**Key insight**: By keeping one pointer k steps ahead, when the front pointer reaches the end, the back pointer is at the kth element from end.

---

### The Pattern

```
Find 2nd node from end: [1 → 2 → 3 → 4 → 5]

Step 0: fast at 1, slow at 1
Step 1: fast at 2, slow at 1
Step 2: fast at 3, slow at 1 (fast is now 2 ahead)
Step 3: fast at 4, slow at 2
Step 4: fast at 5, slow at 3
Step 5: fast at null, slow at 4 ← Answer!
```

**Why it works**: The distance between pointers remains constant as they move together.

---

### Common Applications

| Problem Type | Distance | Example |
|--------------|----------|---------|
| Nth from End | n | Remove Nth Node From End |
| Find Middle | n/2 | Middle of Linked List |
| Kth Element | k | Kth Node from End |
| Rotate List | k | Rotate List |
| Detect Intersection | Varies | Intersection of Lists |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n) | Single pass |
| Space | O(1) | Two pointers only |
| Passes | 1 | Better than two-pass |

<!-- back -->
