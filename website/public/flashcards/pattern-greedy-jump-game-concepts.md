## Greedy - Jump Game: Core Concepts

What are the fundamental principles of the greedy approach for reachability problems?

<!-- front -->

---

### Core Concept

Use **a greedy strategy to track the farthest reachable position**, updating as we iterate through the array to determine if the end is reachable.

**Key insight**: At each position, we only care about the maximum reach, not how we got there.

---

### The Pattern

```
Can we reach the end?
[2, 3, 1, 1, 4]

Index: 0    1    2    3    4
Value: 2    3    1    1    4
       ↑
       max_reach = 0 + 2 = 2
       
       At i=0: max_reach = max(2, 0+2) = 2
       0 <= 2, can continue
       
       At i=1: max_reach = max(2, 1+3) = 4
       1 <= 4, can continue
       
       At i=2: max_reach = max(4, 2+1) = 4
       2 <= 4, can continue
       
       At i=3: max_reach = max(4, 3+1) = 4
       3 <= 4, can continue
       
       At i=4: Reached end! ✓

max_reach >= last index → True

---

[3, 2, 1, 0, 4]

Index: 0    1    2    3    4
Value: 3    2    1    0    4
       ↑
       max_reach = 3
       
       At i=0: max_reach = 3, ok
       At i=1: max_reach = max(3, 1+2) = 3, ok
       At i=2: max_reach = max(3, 2+1) = 3, ok
       At i=3: max_reach = max(3, 3+0) = 3
       
       i=4: 4 > 3, cannot reach! ✗
       
       Return False
```

---

### Common Applications

| Problem Type | Description | Example |
|--------------|-------------|---------|
| **Jump Game I** | Can reach end? | Jump Game |
| **Jump Game II** | Min jumps to end | Jump Game II |
| **Gas Station** | Complete circuit | Gas Station |
| **Reach End** | General reachability | Array reachability |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| **Time** | O(n) | Single pass |
| **Space** | O(1) | Only track max_reach |
| **Greedy optimal** | Yes | Maximum reach is best |

<!-- back -->
