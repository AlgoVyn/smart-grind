# Reverse Linked List

## Problem Description

Given the head of a singly linked list, reverse the list, and return the reversed list.

### Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `head = [1,2,3,4,5]` | `[5,4,3,2,1]` |

**Example 2:**

| Input | Output |
|-------|--------|
| `head = [1,2]` | `[2,1]` |

**Example 3:**

| Input | Output |
|-------|--------|
| `head = []` | `[]` |

### Constraints

- The number of nodes in the list is in the range `[0, 5000]`.
- `-5000 <= Node.val <= 5000`

**Follow-up:** A linked list can be reversed either iteratively or recursively. Could you implement both?

---

## Solution

```python
def reverseList(head):
    prev = None
    curr = head
    while curr:
        next_temp = curr.next
        curr.next = prev
        prev = curr
        curr = next_temp
    return prev
```

---

## Explanation

This problem reverses a singly linked list iteratively by changing the next pointers.

### Approach

1. **Initialize Pointers:** Set `prev = None` and `curr = head`.

2. **Traverse and Reverse:** While `curr` is not None:
   - Save `next_temp = curr.next`.
   - Set `curr.next = prev`.
   - Move `prev = curr` and `curr = next_temp`.

3. **Return New Head:** When `curr` is None, `prev` is the new head.

### Iterative Time Complexity

- O(n), where n is the number of nodes.

### Iterative Space Complexity

- O(1), using constant extra space.

### Recursive Approach

```python
def reverseListRecursive(head):
    if not head or not head.next:
        return head
    new_head = reverseListRecursive(head.next)
    head.next.next = head
    head.next = None
    return new_head
```

### Recursive Space Complexity

- O(n), due to the call stack.
