## Title: Two Pointers - Frameworks

What are the structured approaches for solving two-pointer problems?

<!-- front -->

---

### Framework 1: Opposite Ends (Meet in the Middle)

```
┌─────────────────────────────────────────────────────┐
│  OPPOSITE ENDS TWO-POINTER FRAMEWORK                │
├─────────────────────────────────────────────────────┤
│  1. Sort array (if not already sorted)             │
│  2. Initialize: left = 0, right = n - 1            │
│  3. While left < right:                            │
│     a. Calculate current = arr[left] + arr[right]   │
│     b. If current == target: return result         │
│     c. If current < target: left++ (need larger)     │
│     d. If current > target: right-- (need smaller) │
│  4. Return result (or not found indicator)          │
└─────────────────────────────────────────────────────┘
```

**When to use:** Sorted arrays, finding pairs that satisfy a condition, palindrome checking.

---

### Framework 2: Fast and Slow Pointers

```
┌─────────────────────────────────────────────────────┐
│  FAST AND SLOW POINTER FRAMEWORK                    │
├─────────────────────────────────────────────────────┤
│  1. Initialize: slow = head, fast = head             │
│  2. While fast and fast.next exist:                  │
│     a. Move slow one step: slow = slow.next         │
│     b. Move fast two steps: fast = fast.next.next   │
│     c. If slow == fast: cycle detected              │
│  3. Return appropriate result (cycle found,         │
│     middle node, etc.)                               │
└─────────────────────────────────────────────────────┘
```

**When to use:** Linked Lists - cycle detection, finding middle, length determination.

---

### Framework 3: Same Direction (Reader/Writer)

```
┌─────────────────────────────────────────────────────┐
│  SAME DIRECTION TWO-POINTER FRAMEWORK               │
├─────────────────────────────────────────────────────┤
│  1. Initialize: writer = 0                           │
│  2. For reader in range(n):                          │
│     a. Check if arr[reader] meets criteria          │
│     b. If yes: arr[writer] = arr[reader]            │
│                 writer += 1                         │
│  3. Return writer (new length) or modified array      │
└─────────────────────────────────────────────────────┘
```

**When to use:** In-place array modification, filtering elements, removing duplicates.

<!-- back -->
