## Two Pointers - In-Place Array Modification: Core Concepts

What are the fundamental principles for modifying arrays in-place using two pointers?

<!-- front -->

---

### Core Concept

Use **two pointers to partition or modify arrays without extra space**, moving elements within the same array.

**Key insight**: One pointer iterates through the array, while another tracks the "valid" position for placement.

---

### The Pattern

```
Remove all instances of val=3: [3, 2, 3, 1, 4, 3, 5]

         read
          ↓
[3, 2, 3, 1, 4, 3, 5]
 ↑
write

Step 1: read=3, write=0, val=3 → skip (read++)
Step 2: read=2, write=0, val≠3 → arr[write]=2, write++, read++
        [2, 2, 3, 1, 4, 3, 5]
         ↑  ↑
        w   r
Step 3: read=3 → skip
Step 4: read=1 → arr[write]=1, w++, r++
        [2, 1, 3, 1, 4, 3, 5]
            ↑        ↑
            w        r
Result: [2, 1, 4, 5, _, _, _], new length = write = 4
```

---

### Common Applications

| Problem Type | Action | Example |
|--------------|--------|---------|
| Remove Element | Overwrite unwanted | Remove Element |
| Move Zeros | Move to end | Move Zeroes |
| Sort Colors | Partition by value | Sort Colors |
| Replace Spaces | In-place replacement | URLify |
| Remove Duplicates | Keep unique | Remove Duplicates |

---

### Complexity

| Aspect | Complexity | Notes |
|--------|-----------|-------|
| Time | O(n) | Single pass |
| Space | O(1) | In-place modification |

<!-- back -->
