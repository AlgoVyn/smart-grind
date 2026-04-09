## Linked List Reordering/Partitioning: Forms

What are the different variations of linked list reordering/partitioning?

<!-- front -->

---

### Form 1: Odd-Even Position Partitioning

Group nodes by position parity (1st, 3rd, 5th... then 2nd, 4th, 6th...).

```python
def odd_even_list(head: ListNode) -> ListNode:
    """
    LeetCode 328: Odd Even Linked List
    Group odd-positioned nodes followed by even-positioned.
    """
    if not head or not head.next:
        return head
    
    odd_dummy = ListNode()
    even_dummy = ListNode()
    odd_tail = odd_dummy
    even_tail = even_dummy
    
    current = head
    is_odd = True
    
    while current:
        if is_odd:
            odd_tail.next = current
            odd_tail = odd_tail.next
        else:
            even_tail.next = current
            even_tail = even_tail.next
        
        is_odd = not is_odd
        current = current.next
    
    odd_tail.next = even_dummy.next
    even_tail.next = None
    
    return odd_dummy.next
```

---

### Form 2: Value-Based Partitioning

Separate nodes by value comparison with pivot x.

```python
def partition(head: ListNode, x: int) -> ListNode:
    """
    LeetCode 86: Partition List
    Nodes < x come before nodes >= x.
    """
    before_dummy = ListNode()
    after_dummy = ListNode()
    before_tail = before_dummy
    after_tail = after_dummy
    
    current = head
    while current:
        if current.val < x:
            before_tail.next = current
            before_tail = before_tail.next
        else:
            after_tail.next = current
            after_tail = after_tail.next
        current = current.next
    
    before_tail.next = after_dummy.next
    after_tail.next = None
    
    return before_dummy.next
```

---

### Form 3: Three-Way Partitioning

Separate into three groups: < x, = x, > x.

```python
def three_way_partition(head: ListNode, x: int) -> ListNode:
    """
    Partition into < x, = x, > x groups.
    """
    less_dummy = ListNode()
    equal_dummy = ListNode()
    greater_dummy = ListNode()
    
    less_tail = less_dummy
    equal_tail = equal_dummy
    greater_tail = greater_dummy
    
    current = head
    while current:
        if current.val < x:
            less_tail.next = current
            less_tail = less_tail.next
        elif current.val == x:
            equal_tail.next = current
            equal_tail = equal_tail.next
        else:
            greater_tail.next = current
            greater_tail = greater_tail.next
        current = current.next
    
    # Chain: less -> equal -> greater
    less_tail.next = equal_dummy.next
    equal_tail.next = greater_dummy.next
    greater_tail.next = None
    
    return less_dummy.next
```

---

### Form 4: Reorder List (L0→Ln→L1→Ln-1)

Special reordering pattern requiring multiple steps.

```python
def reorder_list(head: ListNode) -> None:
    """
    LeetCode 143: Reorder List
    Reorder to: L0→Ln→L1→Ln-1→L2→Ln-2→...
    """
    if not head or not head.next:
        return
    
    # Step 1: Find middle using slow/fast pointers
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    # Step 2: Reverse second half
    second = slow.next
    slow.next = None  # Split into two lists
    
    prev = None
    while second:
        temp = second.next
        second.next = prev
        prev = second
        second = temp
    
    # Step 3: Merge two lists
    first = head
    second = prev
    
    while second:
        tmp1 = first.next
        tmp2 = second.next
        
        first.next = second
        second.next = tmp1
        
        first = tmp1
        second = tmp2
```

---

### Form 5: Swap Nodes in Pairs

Partition and swap adjacent node pairs.

```python
def swap_pairs(head: ListNode) -> ListNode:
    """
    LeetCode 24: Swap Nodes in Pairs
    Swap every two adjacent nodes.
    """
    dummy = ListNode(0, head)
    prev = dummy
    
    while prev.next and prev.next.next:
        first = prev.next
        second = prev.next.next
        
        # Swap
        prev.next = second
        first.next = second.next
        second.next = first
        
        # Move to next pair
        prev = first
    
    return dummy.next
```

---

### Form Comparison

| Form | Partitions | Special Steps | Use When |
|------|------------|---------------|----------|
| Odd-Even | 2 (position) | Boolean toggle | Position-based grouping |
| Value-Based | 2 (value) | Value comparison | Pivot-based separation |
| Three-Way | 3 (value) | 3 dummies | Multiple value ranges |
| Reorder | 2 (halves) | Find middle + reverse + merge | Alternating merge pattern |
| Swap Pairs | 2 (pairs) | Iterative swapping | Adjacent swaps |

<!-- back -->
