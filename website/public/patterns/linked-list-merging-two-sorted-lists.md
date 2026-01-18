# Linked List - Merging Two Sorted Lists

## Overview

The merging two sorted lists pattern is used to combine two singly linked lists that are already sorted into a single sorted linked list. This pattern is essential when dealing with problems that require integrating multiple ordered sequences, such as in merge sort algorithms or combining results from different sources. The primary benefit is maintaining sorted order efficiently with O(n + m) time complexity, where n and m are the lengths of the lists, and it can be done in O(1) auxiliary space by reusing nodes.

## Key Concepts

- **Dummy node**: Use a dummy head node to simplify handling the start of the merged list.
- **Comparison and merging**: Iterate through both lists, comparing node values and appending the smaller one to the merged list.
- **Pointer advancement**: Move pointers in the lists as nodes are merged, ensuring all nodes are included.
- **Edge cases**: Handle when one list is exhausted before the other, or when one or both lists are empty.

## Template

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_two_lists(list1: ListNode, list2: ListNode) -> ListNode:
    # Create a dummy node to act as the start of the merged list
    dummy = ListNode()
    current = dummy
    
    # Iterate while both lists have nodes
    while list1 is not None and list2 is not None:
        if list1.val <= list2.val:
            current.next = list1
            list1 = list1.next
        else:
            current.next = list2
            list2 = list2.next
        current = current.next
    
    # Append the remaining nodes from the non-empty list
    if list1 is not None:
        current.next = list1
    elif list2 is not None:
        current.next = list2
    
    # Return the merged list starting from dummy's next
    return dummy.next
```

## Example Problems

1. **Merge Two Sorted Lists** (LeetCode 21): Merge two sorted linked lists and return the merged sorted list.
2. **Merge k Sorted Lists** (LeetCode 23): Extend the pattern to merge k sorted lists using a divide-and-conquer approach.
3. **Sort List** (LeetCode 148): Use merging as part of a merge sort algorithm to sort a linked list.

## Time and Space Complexity

- **Time Complexity**: O(n + m), where n and m are the lengths of the two lists, as each node is visited once.
- **Space Complexity**: O(1), excluding the space for the output list, since we reuse existing nodes without additional data structures.

## Common Pitfalls

- **Null list handling**: Check if either list is None at the start to avoid null pointer exceptions.
- **Remaining nodes**: Always append the remaining part of the longer list after the loop.
- **Dummy node usage**: Remember to return `dummy.next`, not `dummy`, to skip the dummy head.
- **Value comparison**: Use `<=` for stable sorting if order of equal elements matters.