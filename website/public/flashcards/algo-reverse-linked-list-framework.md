## Reverse Linked List: Framework

What are the complete implementations for reversing linked lists?

<!-- front -->

---

### Iterative Reversal

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head):
    """
    Reverse singly linked list iteratively.
    Time: O(n), Space: O(1)
    """
    prev = None
    curr = head
    
    while curr:
        next_temp = curr.next  # Save next
        curr.next = prev       # Reverse link
        prev = curr            # Move prev forward
        curr = next_temp       # Move curr forward
    
    return prev  # New head
```

---

### Recursive Reversal

```python
def reverse_list_recursive(head):
    """
    Reverse using recursion.
    Time: O(n), Space: O(n)
    """
    # Base case
    if not head or not head.next:
        return head
    
    # Reverse rest of list
    new_head = reverse_list_recursive(head.next)
    
    # Reverse current connection
    head.next.next = head  # Next node points back to current
    head.next = None       # Current is now tail
    
    return new_head
```

---

### Reverse Between Positions

```python
def reverse_between(head, left, right):
    """
    Reverse nodes from position left to right (1-indexed).
    """
    if not head or left == right:
        return head
    
    dummy = ListNode(0, head)
    prev = dummy
    
    # Move to position before left
    for _ in range(left - 1):
        prev = prev.next
    
    # Start of section to reverse
    current = prev.next
    
    # Reverse 'right - left' nodes
    for _ in range(right - left):
        temp = current.next
        current.next = temp.next
        temp.next = prev.next
        prev.next = temp
    
    return dummy.next
```

---

### Reverse in K-Groups

```python
def reverse_k_group(head, k):
    """
    Reverse nodes in groups of k.
    """
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
        
        # Reverse current group
        prev = kth.next
        curr = group_prev.next
        
        while curr != group_next:
            temp = curr.next
            curr.next = prev
            prev = curr
            curr = temp
        
        # Update pointers
        temp = group_prev.next  # Old head, now tail
        group_prev.next = kth   # New head
        group_prev = temp
```

---

### Reverse Doubly Linked List

```python
class DListNode:
    def __init__(self, val=0, prev=None, next=None):
        self.val = val
        self.prev = prev
        self.next = next

def reverse_doubly_linked_list(head):
    """
    Reverse doubly linked list.
    Just swap prev and next for each node.
    """
    curr = head
    new_head = None
    
    while curr:
        # Swap prev and next
        curr.prev, curr.next = curr.next, curr.prev
        
        # Move to next (which was prev)
        new_head = curr
        curr = curr.prev  # This was originally next
    
    return new_head
```

<!-- back -->
