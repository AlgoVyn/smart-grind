## Reverse Linked List: Forms & Variations

What are the different forms and variations of linked list reversal?

<!-- front -->

---

### Form 1: Simple Reverse

```python
# Standard: reverse entire list
# 1->2->3->4->None becomes 4->3->2->1->None

def simple_reverse(head):
    return reverse_list(head)
```

---

### Form 2: Reverse First N Nodes

```python
def reverse_first_n(head, n):
    """
    Reverse only first n nodes, rest remains.
    """
    prev = None
    curr = head
    count = 0
    
    while curr and count < n:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
        count += 1
    
    # head was first node, now last of reversed section
    # Connect to rest
    if head:
        head.next = curr
    
    return prev  # New head

# Example: 1->2->3->4->5, n=3
# Result: 3->2->1->4->5
```

---

### Form 3: Alternating Reverse

```python
def reverse_alternate_k(head, k):
    """
    Reverse every alternate group of k nodes.
    """
    dummy = ListNode(0, head)
    prev_group = dummy
    curr = head
    reverse = True
    
    while curr:
        # Check k nodes exist
        tail = curr
        for _ in range(k - 1):
            tail = tail.next
            if not tail:
                return dummy.next
        
        next_group = tail.next
        
        if reverse:
            # Reverse current group
            prev = next_group
            group_head = curr
            
            while curr != next_group:
                temp = curr.next
                curr.next = prev
                prev = curr
                curr = temp
            
            prev_group.next = tail
            prev_group = group_head
        else:
            # Skip this group
            prev_group = tail
            curr = next_group
        
        reverse = not reverse
    
    return dummy.next
```

---

### Form 4: Reverse and Compare (Palindrome)

```python
def is_palindrome(head):
    """
    Check if linked list is palindrome.
    Reverse second half and compare.
    """
    if not head or not head.next:
        return True
    
    # Find middle
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    # Reverse second half
    second_half = reverse_list(slow)
    
    # Compare
    first = head
    second = second_half
    result = True
    
    while result and second:
        if first.val != second.val:
            result = False
        first = first.next
        second = second.next
    
    # Restore (optional)
    reverse_list(second_half)
    
    return result
```

---

### Form 5: Add Two Numbers (Reversed)

```python
def add_two_numbers(l1, l2):
    """
    Add two numbers represented as reversed linked lists.
    Result also reversed.
    """
    dummy = ListNode(0)
    curr = dummy
    carry = 0
    
    while l1 or l2 or carry:
        val1 = l1.val if l1 else 0
        val2 = l2.val if l2 else 0
        
        total = val1 + val2 + carry
        carry = total // 10
        
        curr.next = ListNode(total % 10)
        curr = curr.next
        
        if l1:
            l1 = l1.next
        if l2:
            l2 = l2.next
    
    return dummy.next

# If inputs not reversed, reverse first, then add, then reverse result
```

<!-- back -->
