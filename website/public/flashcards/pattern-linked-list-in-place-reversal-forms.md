## Linked List - In-place Reversal: Forms & Variations

What are the different forms and variations of linked list reversal problems?

<!-- front -->

---

### Form 1: Full List Reversal

**Classic:** Reverse entire linked list (LeetCode 206).

```python
def reverse_list(head: ListNode) -> ListNode:
    """
    Standard 3-pointer reversal.
    Pattern: save → flip → advance
    """
    prev = None
    current = head
    
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    
    return prev


# Variation: Reverse and return both new head and tail
def reverse_list_with_tail(head: ListNode) -> tuple:
    """
    Returns (new_head, new_tail).
    Useful when connecting reversed segments.
    """
    prev = None
    current = head
    original_head = head  # Will become tail
    
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    
    return prev, original_head  # (new_head, new_tail)
```

---

### Form 2: Sublist Reversal (Reverse Between)

**Problem:** Reverse nodes from position `left` to `right` (LeetCode 92).

```python
def reverse_between(head: ListNode, left: int, right: int) -> ListNode:
    """
    Reverse sublist from position left to right (1-indexed).
    Pattern: Dummy + move-to-front
    """
    if not head or left == right:
        return head
    
    dummy = ListNode(0, head)
    prev_left = dummy
    
    # Move to node before left
    for _ in range(left - 1):
        prev_left = prev_left.next
    
    current = prev_left.next
    
    # Move nodes one by one to front
    for _ in range(right - left):
        next_node = current.next
        current.next = next_node.next
        next_node.next = prev_left.next
        prev_left.next = next_node
    
    return dummy.next
```

**Key insight:** Each iteration extracts `next_node` and inserts it after `prev_left`.

---

### Form 3: k-Group Reversal

**Problem:** Reverse every k nodes, keep remaining as-is if < k (LeetCode 25).

```python
def reverse_k_group(head: ListNode, k: int) -> ListNode:
    """
    Reverse every k nodes.
    Pattern: Reverse groups, connect segments.
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
        prev = group_next  # Will become new tail's next
        current = group_prev.next
        
        while current != group_next:
            next_node = current.next
            current.next = prev
            prev = current
            current = next_node
        
        # Update for next group
        temp = group_prev.next  # Old head, now tail
        group_prev.next = kth    # New head
        group_prev = temp
```

---

### Form 4: Palindrome Check (Reverse Second Half)

**Problem:** Check if linked list is palindrome (LeetCode 234).

```python
def is_palindrome(head: ListNode) -> bool:
    """
    Find middle, reverse second half, compare, restore.
    Pattern: Fast/slow pointer + partial reversal.
    """
    if not head or not head.next:
        return True
    
    # Find middle
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    # Reverse second half
    second_half = reverse_list(slow.next)
    
    # Compare
    first = head
    second = second_half
    is_pal = True
    
    while is_pal and second:
        if first.val != second.val:
            is_pal = False
        first = first.next
        second = second.next
    
    # Restore (optional)
    slow.next = reverse_list(second_half)
    
    return is_pal
```

---

### Form 5: Reorder List (Reverse + Interleave)

**Problem:** L0→Ln→L1→Ln-1→L2→Ln-2→... (LeetCode 143).

```python
def reorder_list(head: ListNode) -> None:
    """
    Reorder: split, reverse second half, merge.
    Pattern: Middle find + reverse + merge.
    """
    if not head or not head.next:
        return
    
    # Find middle
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    # Split and reverse second half
    second = reverse_list(slow.next)
    slow.next = None
    
    # Merge
    first = head
    while second:
        f_next, s_next = first.next, second.next
        first.next = second
        second.next = f_next
        first, second = f_next, s_next
```

---

### Form 6: Swap Nodes in Pairs

**Problem:** Swap every two adjacent nodes (LeetCode 24).

```python
def swap_pairs(head: ListNode) -> ListNode:
    """
    Swap adjacent pairs: dummy + iterative exchange.
    Pattern: Pairwise pointer manipulation.
    """
    dummy = ListNode(0, head)
    prev = dummy
    
    while prev.next and prev.next.next:
        first = prev.next
        second = prev.next.next
        
        # Swap
        first.next = second.next
        second.next = first
        prev.next = second
        
        # Advance
        prev = first
    
    return dummy.next
```

---

### Form 7: Reverse Even Length Groups

**Problem:** Reverse nodes in groups of sizes 1, 2, 3, ..., but only if group has even length.

```python
def reverse_even_length_groups(head: ListNode) -> ListNode:
    """
    Pattern: Track group size, reverse when count is even.
    """
    dummy = ListNode(0, head)
    prev_group = dummy
    group_size = 1
    
    while prev_group.next:
        # Count nodes in this group (up to group_size)
        count = 0
        node = prev_group
        while node.next and count < group_size:
            node = node.next
            count += 1
        
        next_group = node.next
        
        if count % 2 == 0:  # Even length - reverse
            # Reverse count nodes starting at prev_group.next
            prev = next_group
            current = prev_group.next
            
            for _ in range(count):
                next_node = current.next
                current.next = prev
                prev = current
                current = next_node
            
            # Update pointers
            temp = prev_group.next
            prev_group.next = node
            prev_group = temp
        else:
            prev_group = node
        
        group_size += 1
    
    return dummy.next
```

---

### Form 8: Add Two Numbers (Reversed Order)

**Problem:** Add two numbers represented by linked lists, digits in reverse order (LeetCode 2).

```python
def add_two_numbers(l1: ListNode, l2: ListNode) -> ListNode:
    """
    Add reversed digit lists.
    Pattern: Simultaneous traversal with carry.
    """
    dummy = ListNode(0)
    current = dummy
    carry = 0
    
    while l1 or l2 or carry:
        val1 = l1.val if l1 else 0
        val2 = l2.val if l2 else 0
        
        total = val1 + val2 + carry
        carry = total // 10
        digit = total % 10
        
        current.next = ListNode(digit)
        current = current.next
        
        if l1: l1 = l1.next
        if l2: l2 = l2.next
    
    return dummy.next
```

**Note:** The digits are already reversed, so no reversal needed — just traverse simultaneously.

---

### Form 9: Reverse Doubly Linked List

**Problem:** Reverse a doubly linked list (swap both pointers).

```python
class DoublyListNode:
    def __init__(self, val=0, prev=None, next=None):
        self.val = val
        self.prev = prev
        self.next = next

def reverse_doubly(head: DoublyListNode) -> DoublyListNode:
    """
    Reverse by swapping prev and next at each node.
    Pattern: Swap both pointers, advance using original next.
    """
    current = head
    new_head = None
    
    while current:
        # Swap prev and next
        current.prev, current.next = current.next, current.prev
        
        # Move to next (which is original prev due to swap)
        new_head = current
        current = current.prev  # This was original next
    
    return new_head
```

---

### Form 10: Reverse Nodes in Even Positions

**Problem:** Reverse nodes at even positions (2nd, 4th, 6th, ...).

```python
def reverse_even_positions(head: ListNode) -> ListNode:
    """
    Reverse nodes at positions 2, 4, 6, ...
    Pattern: Separate odd and even, reverse even list, merge.
    """
    if not head or not head.next:
        return head
    
    # Separate odd and even positioned nodes
    odd = head
    even_head = head.next
    even = even_head
    
    while even and even.next:
        odd.next = even.next
        odd = odd.next
        even.next = odd.next
        even = even.next
    
    odd.next = None
    
    # Reverse even list
    even_head = reverse_list(even_head)
    
    # Merge: odd positions from first list, even from reversed
    dummy = ListNode(0)
    current = dummy
    odd = head
    even = even_head
    is_odd_turn = True
    
    while odd or even:
        if is_odd_turn and odd:
            current.next = odd
            odd = odd.next
        elif even:
            current.next = even
            even = even.next
        current = current.next
        is_odd_turn = not is_odd_turn
    
    return dummy.next
```

<!-- back -->
