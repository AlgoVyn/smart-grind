# Two Pointers - Fixed Separation

## Overview

The Two Pointers - Fixed Separation pattern is used when you need to maintain a constant distance between two pointers while traversing a data structure, such as finding the nth node from the end in a linked list. One pointer (fast) moves ahead by a fixed number of steps, creating a gap, and then both pointers move together. This allows efficient access to elements at specific offsets without additional space.

## Key Concepts

- **Gap Creation**: Advance the fast pointer by n steps to establish separation.
- **Simultaneous Movement**: Once separated, move both pointers one step at a time.
- **Offset Access**: The slow pointer reaches the desired position when fast pointer hits the end.
- **Dynamic Separation**: The separation can be adjusted based on problem requirements.

## Template

```python
def find_nth_from_end(head, n):
    """
    Template for Two Pointers - Fixed Separation pattern.
    Finds the nth node from the end of a linked list.
    """
    if not head:
        return None
    
    fast = head
    slow = head
    
    # Move fast pointer n steps ahead
    for _ in range(n):
        if not fast:
            return None  # n is larger than list length
        fast = fast.next
    
    # Move both pointers until fast reaches end
    while fast:
        fast = fast.next
        slow = slow.next
    
    return slow  # slow is now at nth from end
```

## Example Problems

1. **Remove Nth Node From End of List**: Remove the nth node from the end of a linked list.
2. **Middle of the Linked List**: Find the middle node of a linked list.
3. **Delete the Middle Node of a Linked List**: Remove the middle node, using separation to find it.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the length of the list, as pointers traverse the list once.
- **Space Complexity**: O(1), using only two pointers.

## Common Pitfalls

- **n Greater Than Length**: Check if fast pointer becomes None during initial advancement.
- **Empty List**: Handle null head gracefully.
- **Off-by-One Errors**: Ensure correct counting for 1-based indexing.
- **Single Node Cases**: Consider when n equals the list length.