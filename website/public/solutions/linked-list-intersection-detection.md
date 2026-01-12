# Linked List - Intersection Detection

## Overview

The intersection detection pattern is used to identify if a linked list contains a cycle (where a node points back to a previous node, creating a loop). This pattern is crucial for validating linked list integrity and preventing infinite loops during traversal. It's commonly applied in scenarios involving graph representations or data structures that might have circular references. The key benefit is detecting cycles in O(n) time and O(1) space using the Floyd's cycle detection algorithm with two pointers.

## Key Concepts

- **Fast and slow pointers**: Use two pointers moving at different speeds to detect cycles.
- **Cycle detection logic**: If there's a cycle, the fast pointer will eventually catch up to the slow pointer.
- **Meeting point**: The point where pointers meet indicates a cycle exists.
- **Edge cases**: Handle empty lists, single nodes, and lists without cycles.

## Template

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def has_cycle(head: ListNode) -> bool:
    if not head or not head.next:
        return False
    
    # Initialize slow and fast pointers
    slow = head
    fast = head.next
    
    # Move pointers: slow by 1, fast by 2
    while fast and fast.next:
        if slow == fast:
            return True  # Cycle detected
        slow = slow.next
        fast = fast.next.next
    
    return False  # No cycle
```

## Example Problems

1. **Linked List Cycle** (LeetCode 141): Determine if a linked list has a cycle.
2. **Linked List Cycle II** (LeetCode 142): Find the node where the cycle begins.
3. **Intersection of Two Linked Lists** (LeetCode 160): Find the intersection node of two linked lists, which may involve cycle-like structures.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the number of nodes, as in the worst case, we traverse the entire list.
- **Space Complexity**: O(1), using only two pointers regardless of list size.

## Common Pitfalls

- **Null checks**: Ensure head and head.next are not None to avoid errors.
- **Pointer movement**: Fast pointer moves two steps, so check both fast and fast.next before advancing.
- **Early termination**: Stop if fast reaches None, indicating no cycle.
- **Modifying the list**: Avoid changing node pointers; this pattern is read-only.