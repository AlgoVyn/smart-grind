## Fast-Slow Pointers: Tactics & Techniques

What tactical patterns should you recognize for fast-slow pointer problems?

<!-- front -->

---

### Tactic 1: Detecting Cycle with Length

```python
def cycle_info(head):
    """
    Returns (has_cycle, cycle_start, cycle_length)
    """
    # Phase 1: Detect cycle
    slow = fast = head
    has_cycle = False
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            has_cycle = True
            break
    
    if not has_cycle:
        return (False, None, 0)
    
    # Phase 2: Find start
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    start = slow
    
    # Phase 3: Measure cycle length
    length = 1
    fast = slow.next
    while fast != slow:
        fast = fast.next
        length += 1
    
    return (True, start, length)
```

---

### Tactic 2: Happy Number Detection

```python
def is_happy(n):
    """
    Happy number: sum of squared digits eventually reaches 1
    Unhappy: enters cycle, never reaches 1
    """
    def get_next(num):
        total = 0
        while num > 0:
            digit = num % 10
            total += digit * digit
            num //= 10
        return total
    
    slow = n
    fast = get_next(n)
    
    while fast != 1 and slow != fast:
        slow = get_next(slow)
        fast = get_next(get_next(fast))
    
    return fast == 1
```

**Pattern:** Sequence generation + cycle detection.

---

### Tactic 3: Intersection of Two Lists

```python
def get_intersection(headA, headB):
    """
    Find intersection node of two linked lists
    """
    if not headA or not headB:
        return None
    
    ptrA, ptrB = headA, headB
    
    while ptrA != ptrB:
        # Switch to other list's head at end
        ptrA = headB if not ptrA else ptrA.next
        ptrB = headA if not ptrB else ptrB.next
    
    return ptrA
```

**Math:** `a + b = b + a` where a, b are path lengths.

---

### Tactic 4: Split List at Middle

```python
def split_list(head):
    """
    Split list into two halves
    Returns (first_half, second_half)
    """
    if not head or not head.next:
        return (head, None)
    
    # Use dummy to handle edge cases
    dummy = ListNode(0)
    dummy.next = head
    slow, fast = dummy, head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    # Split
    second = slow.next
    slow.next = None
    
    return (head, second)
```

---

### Tactic 5: Checking List Structure

```python
def check_structure(head):
    """
    Analyze linked list structure
    """
    if not head:
        return "empty"
    
    # Check for cycle first
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return "cyclic"
    
    # Count length
    length = 0
    curr = head
    while curr:
        length += 1
        curr = curr.next
    
    return f"linear (length {length})"

# Extended with cycle length
def analyze_cyclic_list(head):
    has_cycle, start, length = cycle_info(head)
    
    if not has_cycle:
        return "no cycle"
    
    # Count nodes before cycle
    count = 0
    curr = head
    while curr != start:
        count += 1
        curr = curr.next
    
    return f"tail: {count}, cycle: {length}, total: {count + length}"
```

<!-- back -->
