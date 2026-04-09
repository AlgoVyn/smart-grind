## Linked List Intersection Detection: Core Concepts

What are the fundamental concepts behind detecting cycles and finding intersections in linked lists?

<!-- front -->

---

### The Core Insight

**If there's a cycle, two pointers moving at different speeds will eventually meet.**

- `slow` moves 1 step at a time
- `fast` moves 2 steps at a time
- In a cycle, `fast` gains 1 step on `slow` each iteration
- Eventually, `fast` laps `slow` and they meet

```
List: 1 → 2 → 3 → 4 → 5 → 3 (cycle back to 3)

Step 1: slow=1, fast=1
Step 2: slow=2, fast=3  
Step 3: slow=3, fast=5
Step 4: slow=4, fast=3 (wrapped)
Step 5: slow=5, fast=5 ← MEET!
```

---

### The "Aha!" Moments

| Moment | Insight | Why It Matters |
|--------|---------|----------------|
| **Why they meet** | Fast gains 1 step per iteration | Guaranteed meeting in cycle |
| **Finding start** | Reset slow to head, both move at 1x | Math proof: a = c |
| **Two list trick** | Switch heads at end | Both travel m+n distance |
| **No extra space** | Just 2 pointers | O(1) space solution |
| **Array cycles** | Values as next pointers | Works for duplicate detection |

---

### The Math Behind Finding Cycle Start

Let: a = distance(head→start), b = distance(start→meet), c = distance(meet→start)

```
When slow and fast meet:
- Slow traveled: a + b
- Fast traveled: a + b + c + b = a + 2b + c (one extra loop)
- Since fast is 2x speed: 2(a + b) = a + 2b + c
- Therefore: a = c ✓

Reset slow to head:
- Slow travels a to reach start
- Fast travels c to reach start  
- They meet at the cycle start!
```

---

### Two List Intersection Intuition

```
List A: a1 → a2 → c1 → c2 → c3
List B: b1 → b2 → b3 → c1 → c2 → c3

Pointer p1: a1→a2→c1→c2→c3→null→b1→b2→b3→c1 (meets!)
Pointer p2: b1→b2→b3→c1→c2→c3→null→a1→a2→c1 (meets!)

Both travel: len(A) + len(B) distance
```

**Key insight**: After switching, both pointers have same remaining distance to intersection.

---

### Time/Space Complexity Breakdown

| Problem | Approach | Time | Space | Why |
|---------|----------|------|-------|-----|
| **Has Cycle** | Floyd's | O(n) | O(1) | Single pass with 2 pointers |
| **Find Cycle Start** | Floyd's + Phase 2 | O(n) | O(1) | At most 2 passes |
| **Cycle Length** | Count from meeting | O(n) | O(1) | One extra pass |
| **Two List Intersection** | Two pointers | O(n+m) | O(1) | Each list traversed twice max |
| **Hash Set Alternative** | Set tracking | O(n) | O(n) | Store visited nodes |

---

### Cycle vs Intersection: When to Use What

| Scenario | Pattern | Key Difference |
|----------|---------|--------------|
| **Single list, may loop** | Floyd's cycle detection | Node points back to previous node |
| **Two lists merge** | Two-pointer intersection | Lists share common tail |
| **Array with duplicates** | Array-as-linked-list | Value at index is next pointer |
| **Happy number** | Number transformation | Replace next with digit square sum |

<!-- back -->
