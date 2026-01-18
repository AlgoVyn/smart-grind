# Linked List - Addition of Numbers

## Overview

The addition of numbers pattern is used to add two numbers represented as linked lists, where each node contains a single digit. This pattern is crucial for problems involving arbitrary-precision arithmetic, such as adding very large numbers that exceed standard integer types. It's commonly applied in scenarios requiring digit-by-digit operations with carry propagation. The benefit is handling numbers of any size without overflow issues, with time complexity linear to the length of the longer list.

## Key Concepts

- **Digit-by-digit addition**: Traverse both lists simultaneously, adding corresponding digits plus any carry from the previous addition.
- **Carry handling**: Maintain a carry variable (0 or 1) that propagates to the next digit if the sum exceeds 9.
- **Dummy node**: Use a dummy head to build the result list easily.
- **Length differences**: Handle lists of unequal lengths by treating missing digits as 0.

## Template

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def add_two_numbers(l1: ListNode, l2: ListNode) -> ListNode:
    # Dummy node for the result list
    dummy = ListNode()
    current = dummy
    carry = 0
    
    # Traverse both lists
    while l1 or l2 or carry:
        # Get values, default to 0 if node is None
        val1 = l1.val if l1 else 0
        val2 = l2.val if l2 else 0
        
        # Calculate sum and new carry
        total = val1 + val2 + carry
        carry = total // 10
        digit = total % 10
        
        # Create new node and move pointers
        current.next = ListNode(digit)
        current = current.next
        
        # Move to next nodes if available
        if l1:
            l1 = l1.next
        if l2:
            l2 = l2.next
    
    # Return the result list starting from dummy's next
    return dummy.next
```

## Example Problems

1. **Add Two Numbers** (LeetCode 2): Add two numbers represented by linked lists and return the sum as a linked list.
2. **Add Two Numbers II** (LeetCode 445): Add two numbers where the digits are stored in reverse order (MSB first).
3. **Plus One Linked List** (LeetCode 369): Increment a number represented as a linked list by one.

## Time and Space Complexity

- **Time Complexity**: O(max(n, m)), where n and m are the lengths of the two lists, as we traverse the longer list.
- **Space Complexity**: O(max(n, m)), for the new linked list storing the result.

## Common Pitfalls

- **Carry propagation**: Always update and use the carry in each iteration, even after both lists are exhausted.
- **Null node handling**: Use conditional checks to access node values, treating None as 0.
- **Result list construction**: Start building from a dummy node to avoid edge cases with the head.
- **Leading zeros**: The pattern assumes no leading zeros, but handle them if present by skipping in some variations.