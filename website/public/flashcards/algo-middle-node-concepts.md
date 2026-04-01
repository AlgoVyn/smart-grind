## Middle Node: Core Concepts

What are the fundamental principles for finding the middle of a linked list?

<!-- front -->

---

### Core Concept: Slow & Fast Pointers

Use two pointers moving at different speeds. When fast reaches the end, slow is at middle.

```
Slow moves 1 step per iteration
Fast moves 2 steps per iteration

Initial:  S
          1 -> 2 -> 3 -> 4 -> 5 -> None
          F

Step 1:       S
          1 -> 2 -> 3 -> 4 -> 5 -> None
               F

Step 2:            S
          1 -> 2 -> 3 -> 4 -> 5 -> None
                    F

Step 3:                 S
          1 -> 2 -> 3 -> 4 -> 5 -> None
                         F (end)

Result: Slow is at node 3 (middle)
```

---

### Mathematical Foundation

| Pointers | Slow Position | Fast Position | When Fast Ends |
|----------|---------------|---------------|----------------|
| Start both at head | 0 | 0 | Slow at n/2 |
| Fast starts ahead | i | 2i+1 | Various effects |

For n nodes:
- Odd n: middle is unique (position n//2)
- Even n: can return first or second middle

---

### Variations for Even Length

| Pattern | Return | Code Modification |
|---------|--------|-------------------|
| First middle | Lower middle | `while fast and fast.next:` |
| Second middle | Upper middle | `while fast.next and fast.next.next:` |

---

### Why Two Pointers Work

| Pointer | Speed | Position after k steps |
|---------|-------|--------------------------|
| Slow | 1x | k |
| Fast | 2x | 2k |

When fast reaches end (position n), slow is at n/2.

**Single pass**: O(n) time, O(1) space - beats counting then traversing (2 passes).

<!-- back -->
