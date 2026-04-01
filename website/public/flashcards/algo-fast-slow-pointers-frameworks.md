## Fast-Slow Pointers: Frameworks

What are the standard frameworks for fast-slow pointer problems?

<!-- front -->

---

### Framework 1: Cycle Detection

```python
def has_cycle(head):
    """
    Detect if linked list has cycle
    Returns True/False
    """
    if not head or not head.next:
        return False
    
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next          # 1 step
        fast = fast.next.next     # 2 steps
        
        if slow == fast:
            return True           # Cycle detected
    
    return False                  # Fast reached end
```

**Invariant:** If no cycle, fast reaches null. If cycle exists, fast laps slow.

---

### Framework 2: Find Cycle Start

```python
def find_cycle_start(head):
    """
    Find the node where cycle begins
    Returns node or None
    """
    # Phase 1: Find meeting point
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            break                 # Found meeting point
    else:
        return None               # No cycle
    
    # Phase 2: Find cycle start
    slow = head                   # Reset to head
    
    while slow != fast:
        slow = slow.next          # Both move 1 step
        fast = fast.next
    
    return slow                   # Cycle start
```

**Why it works:** Distance from head to cycle start = distance from meeting point to cycle start.

---

### Framework 3: Find Middle Element

```python
def find_middle(head):
    """
    Returns middle node (2nd middle if even length)
    """
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow

# For first middle in even length:
def find_middle_first(head):
    slow = fast = head
    
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow
```

---

### Framework 4: kth Node from End

```python
def kth_from_end(head, k):
    """
    Find kth node from end (1-indexed)
    """
    fast = slow = head
    
    # Move fast k steps ahead
    for _ in range(k):
        if not fast:
            return None           # k > length
        fast = fast.next
    
    # Move both until fast reaches end
    while fast:
        slow = slow.next
        fast = fast.next
    
    return slow                   # kth from end
```

**Key:** Distance between pointers always = k.

---

### Framework 5: Reorder List Pattern

```python
def reorder_list(head):
    """
    Reorder: L0→Ln→L1→Ln-1→L2→Ln-2→...
    """
    # 1. Find middle
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    # 2. Reverse second half
    prev, curr = None, slow
    while curr:
        curr.next, prev, curr = prev, curr, curr.next
    
    # 3. Merge alternately
    first, second = head, prev
    while second.next:
        first.next, first = second, first.next
        second.next, second = first, second.next
```

<!-- back -->
