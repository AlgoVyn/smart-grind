## Reverse Linked List: Core Concepts

What are the fundamental principles of reversing linked lists?

<!-- front -->

---

### Core Concept

Reverse the direction of all `next` pointers in a linked list.

**Key insight**: Need three pointers to safely reverse:
- `prev`: Where current will point
- `curr`: Node being processed
- `next`: Save current's next before overwriting

---

### Pointer Manipulation

```
Before:  A → B → C → D → None

Step 1:  None ← A    B → C → D → None
                ↑     ↑
               prev  curr

Step 2:  None ← A ← B    C → D → None
                     ↑    ↑
                    prev  curr

Step 3:  None ← A ← B ← C    D → None
                          ↑   ↑
                         prev curr

After:   None ← A ← B ← C ← D
                        ↑
                      return this
```

---

### Critical Operations

| Step | Operation | Purpose |
|------|-----------|---------|
| 1 | Save `curr.next` | Don't lose rest of list |
| 2 | `curr.next = prev` | Reverse direction |
| 3 | `prev = curr` | Move prev forward |
| 4 | `curr = saved_next` | Move curr forward |

---

### Common Errors

| Error | Consequence | Fix |
|-------|-------------|-----|
| Forget to save `next` | Lose rest of list | `next_temp = curr.next` first |
| Wrong order of updates | Skip nodes | Follow fixed order |
| Not set head.next = None | Cycle in list | Set explicitly |

---

### Complexity

| Aspect | Iterative | Recursive |
|--------|-----------|-----------|
| Time | O(n) | O(n) |
| Space | O(1) | O(n) stack |
| Risk | Low | Stack overflow for large n |

<!-- back -->
