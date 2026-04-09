## Two Pointers - Fast & Slow: Tactics

What are the advanced techniques, optimizations, and edge cases for Fast & Slow pointers?

<!-- front -->

---

### Tactic 1: Different Speed Ratios

**Standard**: Slow=1, Fast=2

**Alternative Ratios**:

| Slow | Fast | Use Case | Meeting Guarantee |
|------|------|----------|-------------------|
| 1 | 2 | General purpose | Always meets in cycle |
| 1 | 3 | Faster detection | Always meets |
| 2 | 3 | Specific problems | Always meets |

**When to use different speeds**:
- Finding kth node from end: use 1:k+1 ratio
- Specific cycle length detection

---

### Tactic 2: Finding kth Node from End

**Approach**: Move fast k steps ahead, then move both until fast reaches end

```python
def find_kth_from_end(head, k):
    slow = fast = head
    
    # Move fast k steps ahead
    for _ in range(k):
        if not fast:
            return None  # List shorter than k
        fast = fast.next
    
    # Move both until fast is null
    while fast:
        slow = slow.next
        fast = fast.next
    
    return slow  # kth from end
```

**Key insight**: Distance between slow and fast is always k

---

### Tactic 3: Reordering Linked List

**Pattern**: Find middle, reverse second half, then merge

```python
def reorder_list(head):
    # 1. Find middle
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    # 2. Reverse second half
    second = reverse(slow.next)
    slow.next = None  # Split into two lists
    
    # 3. Merge alternately
    first = head
    while second:
        temp1, temp2 = first.next, second.next
        first.next = second
        second.next = temp1
        first, second = temp1, temp2
```

---

### Tactic 4: Common Pitfalls

| Pitfall | Problem | Solution |
|---------|---------|----------|
| **Null check order** | `fast.next.next` when `fast.next` is null | Check `fast and fast.next` |
| **Single node** | Empty list or one node | Early return check |
| **Cycle at head** | Tail connects to first node | Algorithm handles this |
| **Not moving fast first** | Skipping initial check | Both start at head, move simultaneously |
| **Infinite loop in Phase 2** | Slow never equals fast | Ensure there's actually a cycle first |

---

### Tactic 5: Mathematical Proof of Cycle Entrance

**Why Phase 2 works:**

Let:
- F = distance from head to cycle entrance
- C = cycle length
- M = distance from entrance to meeting point

At meeting:
- Slow traveled: F + M
- Fast traveled: F + M + kC (some full cycles)
- Fast = 2×Slow: F + M + kC = 2(F + M)
- Solving: F = kC - M

**This means**: Distance from head to entrance (F) equals distance from meeting point around cycle to entrance (kC - M)

---

### Tactic 6: Happy Number Optimization

**Standard approach uses Floyd's cycle detection on the sequence:**

```python
def is_happy(n):
    def get_next(x):
        total = 0
        while x > 0:
            x, digit = divmod(x, 10)
            total += digit ** 2
        return total
    
    slow, fast = n, get_next(n)
    while fast != 1 and slow != fast:
        slow = get_next(slow)
        fast = get_next(get_next(fast))
    
    return fast == 1
```

**Time Complexity**: O(log n) - number of digits squared sum quickly reduces

---

### Tactic 7: Array-based Cycle Detection

**When array values point to indices (1 to n range):**

```python
def find_duplicate(nums):
    # Phase 1: Find meeting point
    slow, fast = nums[0], nums[nums[0]]
    while slow != fast:
        slow = nums[slow]
        fast = nums[nums[fast]]
    
    # Phase 2: Find entrance (duplicate)
    slow = 0
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    
    return slow
```

**Key insight**: Array values act as "next" pointers creating a linked list structure

<!-- back -->
