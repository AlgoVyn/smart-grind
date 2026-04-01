## Reverse Linked List: Tactics & Techniques

What are the tactical patterns for linked list reversal?

<!-- front -->

---

### Tactic 1: Dummy Head Pattern

Use dummy node to eliminate edge cases:

```python
def reverse_with_dummy(head):
    """
    Dummy node simplifies handling of head changes.
    """
    dummy = ListNode(0, head)
    prev = None
    curr = dummy.next
    
    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    
    dummy.next = prev  # New head
    return dummy.next
```

---

### Tactic 2: Stack-Based Reversal

When O(n) space is acceptable:

```python
def reverse_with_stack(head):
    """
    Push all nodes to stack, then rebuild.
    Useful when need original list intact.
    """
    if not head:
        return None
    
    stack = []
    curr = head
    while curr:
        stack.append(curr)
        curr = curr.next
    
    # Pop and rebuild
    new_head = stack.pop()
    curr = new_head
    
    while stack:
        curr.next = stack.pop()
        curr = curr.next
    
    curr.next = None
    return new_head
```

---

### Tactic 3: Recursion Base Cases

```python
def reverse_recursive_clean(head):
    """
    Handle base cases explicitly for clarity.
    """
    # Empty or single node
    if not head or not head.next:
        return head
    
    # Two nodes
    if not head.next.next:
        new_head = head.next
        new_head.next = head
        head.next = None
        return new_head
    
    # General case
    new_head = reverse_recursive_clean(head.next)
    head.next.next = head
    head.next = None
    return new_head
```

---

### Tactic 4: Reverse Sublist Preserving Context

```python
def reverse_sublist(head, start, end):
    """
    Reverse portion from start to end (inclusive).
    Preserve connections to rest of list.
    """
    if not head or start == end:
        return head
    
    dummy = ListNode(0, head)
    prev = dummy
    
    # Move to node before start
    for _ in range(start - 1):
        prev = prev.next
    
    # Reverse the sublist
    curr = prev.next
    for _ in range(end - start):
        temp = curr.next
        curr.next = temp.next
        temp.next = prev.next
        prev.next = temp
    
    return dummy.next
```

---

### Tactic 5: Reorder List Pattern

```python
def reorder_list(head):
    """
    Reorder: L0→Ln→L1→Ln-1→L2→Ln-2→...
    Uses slow/fast to find middle, reverse second half, then merge.
    """
    if not head or not head.next:
        return
    
    # 1. Find middle
    slow, fast = head, head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    # 2. Reverse second half
    second = reverse_list(slow.next)
    slow.next = None  # Split
    
    # 3. Merge
    first = head
    while second:
        tmp1, tmp2 = first.next, second.next
        first.next = second
        second.next = tmp1
        first, second = tmp1, tmp2
```

<!-- back -->
