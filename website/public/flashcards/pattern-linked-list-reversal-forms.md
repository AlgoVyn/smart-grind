## Linked List - In-Place Reversal: Forms

What are the different variations of linked list reversal?

<!-- front -->

---

### Form 1: Full Reversal

```python
def reverse_list(head):
    """Reverse entire list."""
    prev = None
    curr = head
    
    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    
    return prev
```

---

### Form 2: Reverse First K

```python
def reverse_k(head, k):
    """Reverse first k nodes."""
    prev = None
    curr = head
    count = 0
    
    while curr and count < k:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
        count += 1
    
    head.next = curr
    return prev
```

---

### Form 3: Reverse Between

```python
def reverse_between(head, left, right):
    """Reverse nodes from left to right."""
    dummy = ListNode(0, head)
    prev = dummy
    
    for _ in range(left - 1):
        prev = prev.next
    
    curr = prev.next
    for _ in range(right - left):
        temp = curr.next
        curr.next = temp.next
        temp.next = prev.next
        prev.next = temp
    
    return dummy.next
```

---

### Form 4: Recursive

```python
def reverse_recursive(head):
    """Recursive reversal."""
    if not head or not head.next:
        return head
    
    new_head = reverse_recursive(head.next)
    head.next.next = head
    head.next = None
    return new_head
```

---

### Form Comparison

| Form | Scope | Space | Use Case |
|------|-------|-------|----------|
| Full | Entire list | O(1) | Standard |
| First K | Beginning | O(1) | Partial |
| Between | Sublist | O(1) | Range |
| Recursive | Any | O(n) | Educational |

<!-- back -->
