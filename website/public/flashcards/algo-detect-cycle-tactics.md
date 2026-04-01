## Detect Cycle: Tactics & Tricks

What are the essential tactics for cycle detection problems?

<!-- front -->

---

### Tactic 1: Phase 1 & Phase 2 Separation

```python
def floyd_two_phase(head):
    """
    Phase 1: Detect if cycle exists (meeting point)
    Phase 2: Find entry point
    """
    # Phase 1
    slow = fast = head
    has_cycle = False
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            has_cycle = True
            break
    
    if not has_cycle:
        return None
    
    # Phase 2 - always works if cycle exists
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow
```

---

### Tactic 2: Handle Edge Cases

```python
def robust_cycle_detection(head):
    """
    Handle all edge cases
    """
    # Empty list
    if not head:
        return None
    
    # Single node
    if not head.next:
        return None
    
    # Self-loop
    if head.next == head:
        return head
    
    # Run Floyd's
    slow, fast = head, head.next
    
    while fast and fast.next:
        if slow == fast:
            # Found cycle, find entry
            slow = head
            while slow != fast:
                slow = slow.next
                fast = fast.next
            return slow
        slow = slow.next
        fast = fast.next.next
    
    return None
```

---

### Tactic 3: Array Index Modulo

```python
def array_next_with_wrap(arr, i):
    """
    Safe array "next" with wrapping
    """
    n = len(arr)
    # Handle both positive and negative steps
    next_i = (i + arr[i]) % n
    # Python modulo handles negative, but ensure positive
    return next_i if next_i >= 0 else next_i + n

# Alternative one-liner
def array_next(arr, i):
    return ((i + arr[i]) % len(arr) + len(arr)) % len(arr)
```

---

### Tactic 4: When Floyd's vs Hash Set

```python
def choose_detection_method(constraints):
    """
    Decision framework
    """
    if constraints.read_only:
        # Can't modify, use Floyd's for linked list
        # Use value range analysis for arrays
        return "floyd_or_math"
    
    if constraints.space_critical:
        # O(1) space required
        return "floyd"
    
    if constraints.need_all_cycle_nodes:
        # Need to collect cycle elements
        return "hash_set"  # Track visited
    
    if constraints.simple_check_only:
        # Just need yes/no
        return "floyd"  # Simpler to implement
    
    return "hash_set"  # Default, easier to understand
```

---

### Tactic 5: Cycle Length and μ Calculation

```python
def full_cycle_analysis(head):
    """
    Return: (has_cycle, entry, mu, lambda)
    mu = distance from head to cycle entry
    lambda = cycle length
    """
    # Find meeting point
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return False, None, 0, 0
    
    # Find entry and calculate mu
    mu = 0
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
        mu += 1
    
    entry = slow
    
    # Calculate lambda (cycle length)
    lam = 1
    fast = slow.next
    while fast != slow:
        fast = fast.next
        lam += 1
    
    return True, entry, mu, lam
```

<!-- back -->
