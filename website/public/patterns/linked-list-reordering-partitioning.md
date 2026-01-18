# Linked List - Reordering / Partitioning

## Overview

The reordering/partitioning pattern is used to rearrange nodes in a linked list based on specific criteria, such as separating nodes by value, position (odd/even), or other properties, while maintaining relative order within partitions. This pattern is ideal for problems requiring in-place reorganization of linked lists without using additional data structures. The benefit is achieving O(n) time complexity with O(1) space by manipulating pointers directly.

## Key Concepts

- **Dummy nodes**: Use separate dummy heads for different partitions to build sublists.
- **Pointer manipulation**: Traverse the list and append nodes to appropriate partitions based on criteria.
- **Merging partitions**: Connect the partitioned sublists at the end.
- **Order preservation**: Ensure nodes within each partition maintain their original relative order.

## Template

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def odd_even_list(head: ListNode) -> ListNode:
    if not head or not head.next:
        return head
    
    # Dummy nodes for odd and even partitions
    odd_dummy = ListNode()
    even_dummy = ListNode()
    odd = odd_dummy
    even = even_dummy
    
    current = head
    is_odd = True
    
    # Partition nodes into odd and even positions
    while current:
        if is_odd:
            odd.next = current
            odd = odd.next
        else:
            even.next = current
            even = even.next
        is_odd = not is_odd
        current = current.next
    
    # Connect even partition to the end of odd partition
    odd.next = even_dummy.next
    # Set the end of even partition to None
    even.next = None
    
    return odd_dummy.next
```

## Example Problems

1. **Odd Even Linked List** (LeetCode 328): Group all nodes with odd indices together followed by nodes with even indices.
2. **Partition List** (LeetCode 86): Partition the list so that all nodes less than a given value come before nodes greater than or equal to it.
3. **Reorder List** (LeetCode 143): Reorder the list to be in the form L0→Ln→L1→Ln-1→L2→Ln-2→…

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the number of nodes, as we traverse the list once.
- **Space Complexity**: O(1), using only a constant number of dummy nodes and pointers.

## Common Pitfalls

- **Partition connections**: Properly link the end of one partition to the start of the next.
- **Null termination**: Set the next of the last node in each partition to None to avoid cycles.
- **Order maintenance**: Append nodes in the order they are encountered to preserve relative positions.
- **Edge cases**: Handle lists with fewer than two nodes by returning early.