## Two Pointers - Fixed Separation: Forms

What are the different variations of the Fixed Separation pattern?

<!-- front -->

---

### Form 1: Basic Nth from End

```python
def nth_from_end_basic(head, n):
    slow = fast = head
    
    # Gap of n nodes
    for _ in range(n):
        if not fast:
            return None
        fast = fast.next
    
    while fast:
        slow = slow.next
        fast = fast.next
    
    return slow
```

---

### Form 2: Remove Nth Node

```python
def remove_nth(head, n):
    dummy = ListNode(0, head)
    slow = fast = dummy
    
    # Gap of n+1 (to land on node before target)
    for _ in range(n + 1):
        fast = fast.next
    
    while fast:
        slow = slow.next
        fast = fast.next
    
    slow.next = slow.next.next
    return dummy.next
```

---

### Form 3: Rotate List by K

```python
def rotate_right(head, k):
    if not head or not head.next:
        return head
    
    # Find length and last node
    length = 1
    last = head
    while last.next:
        last = last.next
        length += 1
    
    k = k % length
    if k == 0:
        return head
    
    # Find new tail (length - k - 1 from start)
    new_tail = head
    for _ in range(length - k - 1):
        new_tail = new_tail.next
    
    new_head = new_tail.next
    new_tail.next = None
    last.next = head
    
    return new_head
```

---

### Form 4: Swapping Nodes

```python
def swap_nodes(head, k):
    """Swap kth from start with kth from end."""
    # Find kth from start
    first = head
    for _ in range(k - 1):
        first = first.next
    
    # Find kth from end using fixed separation
    second = head
    temp = first
    while temp.next:
        second = second.next
        temp = temp.next
    
    # Swap values
    first.val, second.val = second.val, first.val
    return head
```

---

### Form Comparison

| Form | Gap Size | Special Handling |
|------|----------|------------------|
| Nth from End | n | Return node |
| Remove Nth | n+1 | Use dummy node |
| Rotate List | n - k | Connect last to first |
| Swap Nodes | n - k | Two-pass approach |

<!-- back -->
