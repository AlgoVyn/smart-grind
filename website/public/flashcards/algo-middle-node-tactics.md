## Middle Node: Tactics & Techniques

What are the tactical patterns and problem-solving techniques for middle node problems?

<!-- front -->

---

### Tactic 1: Dummy Head for Deletion

**Why**: Middle deletion requires access to node before middle.

```python
def delete_middle_with_dummy(head):
    if not head or not head.next:
        return None
    
    dummy = ListNode(0, head)  # Dummy before head
    prev = dummy
    slow = fast = head
    
    while fast and fast.next:
        prev = slow      # Track node before slow
        slow = slow.next
        fast = fast.next.next
    
    prev.next = slow.next  # Delete slow
    return dummy.next
```

---

### Tactic 2: Offset Variations

| Offset Pattern | Use Case | Implementation |
|----------------|----------|----------------|
| Fast starts at head | Second middle | `while fast and fast.next:` |
| Fast starts 1 ahead | First middle | `fast = head.next` first |
| Different speeds | Custom ratio | `fast = fast.next.next.next` |

```python
# First middle variation
def first_middle(head):
    slow = head
    fast = head.next  # Start 1 ahead
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow
```

---

### Tactic 3: Multiple Pass Reuse

**Pattern**: Finding middle is often just step 1 of multi-step algorithm.

```python
def complex_list_operation(head):
    # Step 1: Find middle
    mid = find_middle(head)
    
    # Step 2: Reverse second half
    second_half = reverse(mid)
    
    # Step 3: Process both halves
    result = process(head, second_half)
    
    # Step 4: Restore (optional)
    mid.next = reverse(second_half)
    
    return result
```

---

### Tactic 4: Floyd's Cycle Detection (Related)

Same two-pointer technique detects cycles.

```python
def has_cycle(head):
    """Detect if linked list has cycle"""
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True  # Cycle detected
    
    return False
```

**Key insight**: If fast catches slow, there's a cycle.

---

### Tactic 5: Find Cycle Start (Extension)

```python
def find_cycle_start(head):
    """Find node where cycle begins"""
    # Phase 1: Detect if cycle exists
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return None  # No cycle
    
    # Phase 2: Find start
    # Distance from head to cycle start = 
    # Distance from meeting point to cycle start
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow  # Cycle start
```

<!-- back -->
