## Linked List Reordering/Partitioning: Tactics

What are specific techniques and strategies for solving linked list reordering problems?

<!-- front -->

---

### Tactic 1: Always Null-Terminate the Last Partition

**The #1 bug in partitioning problems**

```python
# WRONG - Creates cycle!
odd_tail.next = even_dummy.next
even_tail.next = even_tail.next  # Cycle!

# CORRECT
odd_tail.next = even_dummy.next
even_tail.next = None  # Break potential cycle
```

**Why**: The original `next` pointers are never explicitly cleared. If the last node of the even partition originally pointed to something, that creates a cycle when we connect chains.

---

### Tactic 2: Use Boolean Toggle for Position-Based Partitioning

```python
def partition_by_position(head):
    is_odd = True  # Toggle approach
    
    while current:
        if is_odd:
            # Add to odd partition
        else:
            # Add to even partition
        
        is_odd = not is_odd  # Toggle
        current = current.next
```

**Alternative: Counter approach**
```python
pos = 1
while current:
    if pos % 2 == 1:  # Odd position
        # Add to odd partition
    else:
        # Add to even partition
    pos += 1
```

Toggle is cleaner and faster (no modulo operation).

---

### Tactic 3: Handle Edge Cases First

```python
def odd_even_list(head):
    # Handle empty or single node immediately
    if not head or not head.next:
        return head
    
    # Now we know head and head.next exist
    # Simplifies rest of logic
```

| Case | Return |
|------|--------|
| `head is None` | `None` |
| `head.next is None` | `head` (already partitioned) |
| Only 2 nodes | Swap if needed |

---

### Tactic 4: Three-Way Partition Extension

For problems requiring separation into < x, = x, > x:

```python
def three_way_partition(head, x):
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
    
    # Chain all three partitions
    less_tail.next = equal_dummy.next
    equal_tail.next = greater_dummy.next
    greater_tail.next = None
    
    return less_dummy.next
```

---

### Tactic 5: Preserve Original Relative Order

```python
# This pattern NATURALLY preserves relative order
# because we always append to tail (not prepend)

# Order in partition matches original order:
# Original: [1, 3, 5, 2, 4, 6]
# Odd:      [1, 3, 5]  (maintained order)
# Even:     [2, 4, 6]  (maintained order)
```

**To reverse order within partition**: Use in-place reversal while building.

---

### Tactic 6: Multi-Partition Merging

When you have k separate lists to merge sequentially:

```python
def merge_partitions(partitions: List[ListNode]) -> ListNode:
    """
    Merge k partitions into one list.
    Each partition is already a linked list.
    """
    dummy = ListNode()
    tail = dummy
    
    for partition_head in partitions:
        if partition_head:
            # Find end of current partition
            current = partition_head
            while current.next:
                current = current.next
            
            # Link to main chain
            tail.next = partition_head
            tail = current  # Move to end
    
    tail.next = None
    return dummy.next
```

---

### Quick Reference: Common Pitfalls

| Pitfall | Fix |
|---------|-----|
| Cycle in result | Always set `last_tail.next = None` |
| Lost nodes | Ensure `current = current.next` before reassigning `next` |
| Wrong return | Return `dummy.next`, not `dummy` |
| Missing nodes | Check all dummies are properly connected |
| Modifying input | This is expected - in-place is the goal |

<!-- back -->
