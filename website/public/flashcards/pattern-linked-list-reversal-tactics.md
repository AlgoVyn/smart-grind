## Linked List - In-Place Reversal: Tactics

What are the advanced techniques for linked list reversal?

<!-- front -->

---

### Tactic 1: Reverse K Group

```python
def reverse_k_group(head, k):
    """Reverse nodes in groups of k."""
    dummy = ListNode(0, head)
    group_prev = dummy
    
    while True:
        # Check if k nodes exist
        kth = group_prev
        for _ in range(k):
            kth = kth.next
            if not kth:
                return dummy.next
        
        group_next = kth.next
        
        # Reverse k nodes
        prev = kth.next
        curr = group_prev.next
        
        while curr != group_next:
            next_temp = curr.next
            curr.next = prev
            prev = curr
            curr = next_temp
        
        # Move group_prev
        temp = group_prev.next
        group_prev.next = kth
        group_prev = temp
```

---

### Tactic 2: Palindrome Check

```python
def is_palindrome(head):
    """Check if list is palindrome."""
    # Find middle with fast/slow
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    # Reverse second half
    prev = None
    while slow:
        next_temp = slow.next
        slow.next = prev
        prev = slow
        slow = next_temp
    
    # Compare
    left, right = head, prev
    while right:
        if left.val != right.val:
            return False
        left = left.next
        right = right.next
    
    return True
```

---

### Tactic 3: Common Pitfalls

| Pitfall | Issue | Fix |
|---------|-------|----- |
| Losing next reference | Can't continue | Store before modifying |
| Not returning prev | Wrong head | Return prev, not current |
| Off-by-one in sublist | Wrong range | Count carefully |
| Circular reference | Infinite loop | Set to None at end |

---

### Tactic 4: Recursive Reversal

```python
def reverse_recursive(head):
    """Reverse using recursion."""
    if not head or not head.next:
        return head
    
    new_head = reverse_recursive(head.next)
    head.next.next = head
    head.next = None
    
    return new_head
```

<!-- back -->
