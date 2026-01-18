# Two Pointers - Fast & Slow

## Overview

The Two Pointers - Fast & Slow pattern, also known as Floyd's Cycle Detection Algorithm, is ideal for detecting cycles in linked lists or sequences. It uses two pointers: a slow pointer that moves one step at a time and a fast pointer that moves two steps at a time. If there's a cycle, the fast pointer will eventually catch up to the slow pointer. This pattern is efficient for cycle detection without extra space and is commonly applied to linked lists and arrays representing sequences.

## Key Concepts

- **Pointer Speeds**: Slow pointer advances by 1 node/step, fast pointer by 2.
- **Cycle Detection**: If pointers meet, a cycle exists; if fast reaches end, no cycle.
- **Meeting Point**: When they meet, the slow pointer has traveled the cycle length minus some offset.
- **Phase Shift**: Can be used to find cycle start by resetting one pointer.

## Template

```python
def has_cycle(head):
    """
    Template for Two Pointers - Fast & Slow pattern.
    Detects cycle in a linked list.
    """
    if not head or not head.next:
        return False
    
    slow = head  # Slow pointer starts at head
    fast = head.next  # Fast pointer starts one ahead
    
    while fast and fast.next:
        if slow == fast:
            return True  # Cycle detected
        
        slow = slow.next  # Move slow by 1
        fast = fast.next.next  # Move fast by 2
    
    return False  # No cycle
```

## Example Problems

1. **Linked List Cycle**: Determine if a linked list has a cycle.
2. **Happy Number**: Determine if a number is happy by repeatedly summing squares of digits until it equals 1 or loops.
3. **Find the Duplicate Number**: Find the duplicate in an array where numbers are from 1 to n, using cycle detection.

## Time and Space Complexity

- **Time Complexity**: O(n), where n is the number of nodes/elements, as each pointer traverses at most n steps.
- **Space Complexity**: O(1), using only two pointers regardless of input size.

## Common Pitfalls

- **Null Checks**: Always check for None to avoid attribute errors.
- **Fast Pointer Bounds**: Ensure fast.next exists before accessing fast.next.next.
- **Single Node**: Handle cases with one or zero nodes.
- **Cycle Start**: If finding cycle start, remember to reset slow to head after meeting and move both by 1 until they meet again.