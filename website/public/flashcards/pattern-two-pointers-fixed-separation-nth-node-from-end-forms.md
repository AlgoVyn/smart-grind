## Two Pointers - Fixed Separation (Nth Node from End): Forms & Variations

What are different forms and variations of the fixed separation pattern?

<!-- front -->

---

### Form 1: Standard Nth from End

Basic pattern for accessing the nth node from end:

```python
def find_nth_from_end(head, n):
    """Return the nth node from the end (1-indexed)."""
    fast = slow = head
    
    # Create n-node gap
    for _ in range(n):
        if not fast:
            return None  # n larger than list
        fast = fast.next
    
    # Move together until fast reaches end
    while fast:
        fast = fast.next
        slow = slow.next
    
    return slow
```

**Result:** `slow` points to nth node from end

---

### Form 2: Remove Nth from End

Variation for deletion with dummy node:

```python
def remove_nth_from_end(head, n):
    """Remove nth node from end and return new head."""
    dummy = ListNode(0, head)
    slow = fast = dummy
    
    # Move fast n+1 steps (to land on node BEFORE target)
    for _ in range(n + 1):
        fast = fast.next
    
    # Move together until fast is null
    while fast:
        fast = fast.next
        slow = slow.next
    
    # Remove: slow is at node before target
    slow.next = slow.next.next
    return dummy.next
```

**Key difference:** Gap is `n + 1` to position `slow` at node before target

---

### Form 3: Swap Nodes (kth from Start and End)

Swap values of kth from start and kth from end:

```python
def swap_kth_nodes(head, k):
    """Swap kth from start with kth from end."""
    dummy = ListNode(0, head)
    
    # Find kth from end using fixed separation
    slow = fast = dummy
    for _ in range(k + 1):
        fast = fast.next
    
    while fast:
        slow = slow.next
        fast = fast.next
    
    # slow.next is kth from end
    kth_from_end = slow.next
    
    # Find kth from start
    kth_from_start = dummy.next
    for _ in range(k - 1):
        kth_from_start = kth_from_start.next
    
    # Swap values
    kth_from_start.val, kth_from_end.val = kth_from_end.val, kth_from_start.val
    return dummy.next
```

---

### Form 4: Rotate List by k

Rotate list to the right by k places:

```python
def rotate_right(head, k):
    """Rotate list right by k positions."""
    if not head or not head.next:
        return head
    
    # Find length and connect tail to head (make circular)
    length = 1
    tail = head
    while tail.next:
        tail = tail.next
        length += 1
    
    # Effective rotation
    k = k % length
    if k == 0:
        return head
    
    # Find new tail (length - k from start = k from end)
    new_tail = head
    for _ in range(length - k - 1):
        new_tail = new_tail.next
    
    new_head = new_tail.next
    new_tail.next = None
    tail.next = head
    
    return new_head
```

**Variation:** Can use fixed separation to find new tail directly

---

### Form 5: Delete Middle Node

Find and delete the middle node:

```python
def delete_middle(head):
    """Delete the middle node (using fixed separation concept)."""
    if not head or not head.next:
        return None
    
    # Count length first
    length = 0
    curr = head
    while curr:
        length += 1
        curr = curr.next
    
    # Middle position from end
    middle_from_end = length // 2 + 1
    
    # Use fixed separation to find node before middle
    dummy = ListNode(0, head)
    slow = fast = dummy
    
    for _ in range(middle_from_end):
        fast = fast.next
    
    while fast:
        fast = fast.next
        slow = slow.next
    
    # Remove middle
    slow.next = slow.next.next
    return dummy.next
```

---

### Form 6: Reorder List (Half-Reverse Merge)

Reorder: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → ...

```python
def reorder_list(head):
    """Reorder list by alternating first and last elements."""
    if not head or not head.next:
        return
    
    # 1. Find middle (fast-slow, not fixed separation)
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    # 2. Reverse second half
    prev = None
    curr = slow
    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    
    # 3. Merge two halves
    first = head
    second = prev
    while second.next:  # second is shorter
        temp1 = first.next
        temp2 = second.next
        first.next = second
        second.next = temp1
        first = temp1
        second = temp2
```

**Uses:** Fast-slow to find middle, then fixed-separation-like merge

---

### Summary of Forms

| Form | Gap Size | Dummy Node | Purpose |
|------|----------|------------|---------|
| Find nth | n | No | Access node |
| Remove nth | n + 1 | Yes | Delete node |
| Swap nodes | k + 1 | Yes | Exchange values |
| Rotate list | k | Optional | Reorder list |
| Delete middle | length/2 + 1 | Yes | Remove center |
| Reorder | Variable | No | Alternate merge |

<!-- back -->
