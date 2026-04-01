## Middle Node: Forms & Variations

What are the different forms and variations of middle node problems?

<!-- front -->

---

### Form 1: Return Middle Node Value

```python
def get_middle_value(head):
    """Simple: return value at middle"""
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow.val  # Just the value
```

---

### Form 2: Split List at Middle

```python
def split_at_middle(head):
    """Split list into two halves, return both heads"""
    if not head:
        return None, None
    
    slow = fast = head
    prev = None
    
    while fast and fast.next:
        prev = slow
        slow = slow.next
        fast = fast.next.next
    
    # Cut the list
    if prev:
        prev.next = None
    
    return head, slow  # First half, Second half

# Use case: Merge sort on linked list
```

---

### Form 3: Reorder List (Shuffle)

```python
def reorder_list(head):
    """L0→Ln→L1→Ln-1→L2→Ln-2→..."""
    if not head or not head.next:
        return
    
    # 1. Find middle
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    # 2. Reverse second half
    second = reverse(slow.next)
    slow.next = None  # Split
    
    # 3. Merge alternately
    first = head
    while second:
        tmp1, tmp2 = first.next, second.next
        first.next = second
        second.next = tmp1
        first, second = tmp1, tmp2
```

---

### Form 4: Palindrome Check

```python
def is_palindrome(head):
    """Check if linked list is palindrome"""
    if not head or not head.next:
        return True
    
    # Find middle
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    # Reverse second half
    second = reverse(slow)
    
    # Compare
    first = head
    while second:
        if first.val != second.val:
            return False
        first = first.next
        second = second.next
    
    return True
```

---

### Form 5: Delete Nth from End

```python
def remove_nth_from_end(head, n):
    """Remove nth node from end in one pass"""
    dummy = ListNode(0)
    dummy.next = head
    
    fast = slow = dummy
    
    # Fast moves n+1 steps ahead
    for _ in range(n + 1):
        fast = fast.next
    
    # Move both until fast is None
    while fast:
        slow = slow.next
        fast = fast.next
    
    # Delete slow.next
    slow.next = slow.next.next
    
    return dummy.next
```

<!-- back -->
