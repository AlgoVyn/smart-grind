## Two Pointers - Fixed Separation: Tactics

What are the advanced techniques for fixed separation two-pointer problems?

<!-- front -->

---

### Tactic 1: Dummy Node Pattern

**Problem**: Removing the first element requires special handling

**Solution**: Use dummy node as universal solution

```python
def remove_nth_with_dummy(head, n):
    dummy = ListNode(0)
    dummy.next = head
    slow = fast = dummy
    
    # Move fast n+1 steps
    for _ in range(n + 1):
        fast = fast.next
    
    # Move together
    while fast:
        slow = slow.next
        fast = fast.next
    
    # Remove node after slow
    slow.next = slow.next.next
    return dummy.next
```

**Benefit**: Handles removing first, middle, or last uniformly

---

### Tactic 2: Edge Cases

| Case | Handling |
|------|----------|
| n > length | Return None or original list |
| Empty list | Return None |
| Single node | Return None if n=1 |
| n = length | Remove first node |

```python
def safe_nth_from_end(head, n):
    # Check length first
    length = 0
    curr = head
    while curr:
        length += 1
        curr = curr.next
    
    if n > length:
        return None
    
    # Normal algorithm...
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|-----|
| Off-by-one gap | Wrong node removed | Check if gap should be n or n+1 |
| Not using dummy | Can't remove first | Always use dummy for removal |
| Not checking bounds | Null pointer | Verify n <= length |
| Forgetting return | Lost reference | Save head before modifying |

---

### Tactic 4: Multiple Pass Optimization

**Problem**: Finding length requires extra pass

**Trade-off**:
- Two-pass: Count then navigate (O(2n) = O(n))
- One-pass: Fixed separation (O(n))

**Recommendation**: Fixed separation is cleaner, same complexity class

---

### Tactic 5: Finding Intersection

```python
def get_intersection(head_a, head_b):
    """Find intersection using length difference."""
    # Get lengths
    len_a, len_b = 0, 0
    curr_a, curr_b = head_a, head_b
    
    while curr_a:
        len_a += 1
        curr_a = curr_a.next
    while curr_b:
        len_b += 1
        curr_b = curr_b.next
    
    # Advance longer list by difference
    curr_a, curr_b = head_a, head_b
    if len_a > len_b:
        for _ in range(len_a - len_b):
            curr_a = curr_a.next
    else:
        for _ in range(len_b - len_a):
            curr_b = curr_b.next
    
    # Move together until intersection
    while curr_a != curr_b:
        curr_a = curr_a.next
        curr_b = curr_b.next
    
    return curr_a
```

<!-- back -->
