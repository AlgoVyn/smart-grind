# Linked List - In-place Reversal

## Overview

The in-place reversal pattern is used to reverse the order of nodes in a singly linked list without using any additional data structures or extra space beyond a few variables. This pattern is particularly useful when you need to change the direction of traversal in a linked list efficiently, such as in problems requiring reversing sublists, entire lists, or implementing stack-like behavior. The key benefit is its O(1) space complexity, making it ideal for memory-constrained environments, while maintaining O(n) time complexity for traversing the list.

## Key Concepts

- **Three-pointer technique**: Use three pointers - `prev`, `current`, and `next` - to iteratively reverse the links between nodes.
- **Link reversal**: For each node, update its `next` pointer to point to the previous node instead of the next one.
- **Iteration**: Start from the head and move through the list, updating pointers until the end is reached.
- **Edge cases**: Handle empty lists, single-node lists, and ensure the new head is correctly set.

## Template

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_linked_list(head: ListNode) -> ListNode:
    # Initialize pointers: prev is None, current is head
    prev = None
    current = head
    
    # Iterate through the list
    while current is not None:
        # Store the next node to avoid losing it
        next_node = current.next
        
        # Reverse the link: point current's next to prev
        current.next = prev
        
        # Move prev and current forward
        prev = current
        current = next_node
    
    # prev is now the new head of the reversed list
    return prev
```

## Example Problems

1. **Reverse Linked List** (LeetCode 206): Reverse the entire linked list and return the new head.
2. **Reverse Nodes in k-Group** (LeetCode 25): Reverse every k nodes in the list, leaving remaining nodes unchanged.
3. **Palindrome Linked List** (LeetCode 234): Check if the list is a palindrome by reversing half the list and comparing.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the number of nodes, as we traverse the entire list once.
- **Space Complexity**: O(1), since we only use a constant amount of extra space for the pointers, regardless of list size.

## Common Pitfalls

- **Null pointer dereference**: Always check if `head` is None before starting to avoid errors.
- **Losing the next pointer**: Store `current.next` in a temporary variable before overwriting it.
- **Incorrect head return**: The reversed list's head is the original tail, so return `prev` after the loop.
- **Infinite loops**: Ensure the loop condition checks `current is not None` to prevent cycling if the list has cycles (though this pattern assumes no cycles).