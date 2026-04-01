## Middle Node: Framework

What are the complete implementations for finding the middle node?

<!-- front -->

---

### Standard: Second Middle (Even Length)

```python
def middle_node(head):
    """Return second middle for even-length lists"""
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next      # 1 step
        fast = fast.next.next # 2 steps
    
    return slow
```

**Even list [1,2,3,4]**: returns node 3

---

### First Middle (Even Length)

```python
def first_middle_node(head):
    """Return first middle for even-length lists"""
    slow = fast = head
    
    # Stop when fast.next is None (about to go past end)
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow
```

**Even list [1,2,3,4]**: returns node 2

---

### With Length Calculation (Explicit)

```python
def middle_with_length(head):
    """Two-pass: count then traverse"""
    # First pass: get length
    length = 0
    curr = head
    while curr:
        length += 1
        curr = curr.next
    
    # Second pass: go to middle
    curr = head
    for _ in range(length // 2):
        curr = curr.next
    
    return curr
```

| Approach | Time | Space | Passes |
|----------|------|-------|--------|
| Two-pointer | O(n) | O(1) | 1 |
| Length-based | O(n) | O(1) | 2 |

---

### Generic: Get Kth from End

```python
def kth_from_end(head, k):
    """Fast pointer k ahead, then both move"""
    fast = slow = head
    
    # Move fast k steps ahead
    for _ in range(k):
        if not fast:
            return None
        fast = fast.next
    
    # Move both until fast hits end
    while fast:
        slow = slow.next
        fast = fast.next
    
    return slow  # kth from end

# Middle is kth from end where k = n/2
```

---

### Delete Middle Node (LeetCode Style)

```python
def delete_middle(head):
    """Delete middle node, return new head"""
    if not head or not head.next:
        return None
    
    # Need prev pointer to delete
    dummy = ListNode(0)
    dummy.next = head
    
    prev = dummy
    slow = fast = head
    
    while fast and fast.next:
        prev = slow
        slow = slow.next
        fast = fast.next.next
    
    # Delete slow
    prev.next = slow.next
    
    return dummy.next
```

<!-- back -->
