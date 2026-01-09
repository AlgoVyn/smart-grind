# Add Two Numbers

## Problem Description

You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.
You may assume the two numbers do not contain any leading zero, except the number 0 itself.

## Examples

**Example 1:**

**Input:**
```python
l1 = [2,4,3], l2 = [5,6,4]
```

**Output:**
```
[7,0,8]
```

**Explanation:** 342 + 465 = 807.

**Example 2:**

**Input:**
```python
l1 = [0], l2 = [0]
```

**Output:**
```
[0]
```

**Example 3:**

**Input:**
```python
l1 = [9,9,9,9,9,9,7], l2 = [9,9,9,9]
```

**Output:**
```
[8,9,9,9,0,0,0,1]
```

## Constraints

- The number of nodes in each linked list is in the range `[1, 100]`.
- `0 <= Node.val <= 9`
- It is guaranteed that the list represents a number that does not have leading zeros.

## Solution

```python
from typing import Optional

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

class Solution:
    def addTwoNumbers(self, l1: Optional[ListNode], l2: Optional[ListNode]) -> Optional[ListNode]:
        dummy = ListNode()
        curr = dummy
        carry = 0
        while l1 or l2 or carry:
            val1 = l1.val if l1 else 0
            val2 = l2.val if l2 else 0
            total = val1 + val2 + carry
            carry = total // 10
            curr.next = ListNode(total % 10)
            curr = curr.next
            if l1:
                l1 = l1.next
            if l2:
                l2 = l2.next
        return dummy.next
```

## Explanation

To add two numbers represented as linked lists, we simulate the addition process digit by digit, starting from the least significant digit.

We use a dummy node to build the result list. For each position, we add the values from `l1` and `l2` (if available) plus the carry from the previous addition.

The sum modulo 10 becomes the new node's value, and the quotient becomes the new carry.

We continue until both lists are exhausted and there is no carry left.

This handles numbers of different lengths and potential carry propagation.

## Time Complexity
**O(max(m, n))**, where m and n are the lengths of the two linked lists.

## Space Complexity
**O(max(m, n))**, for the result linked list.
