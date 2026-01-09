# Intersection of Two Linked Lists

## Problem Description

Given the heads of two singly linked-lists `headA` and `headB`, return the node at which the two lists intersect. If the two linked lists have no intersection at all, return `null`.

The test cases are generated such that there are **no cycles** anywhere in the entire linked structure. Note that the linked lists must retain their original structure after the function returns.

---

## Custom Judge

The judge provides the following inputs:
- `intersectVal` - The value of the node where intersection occurs (0 if no intersection)
- `listA` - The first linked list
- `listB` - The second linked list
- `skipA` - Number of nodes to skip in listA to reach the intersected node
- `skipB` - Number of nodes to skip in listB to reach the intersected node

---

## Examples

**Example 1:**

| Input | Output |
|-------|--------|
| `intersectVal = 8`, `listA = [4,1,8,4,5]`, `listB = [5,6,1,8,4,5]`, `skipA = 2`, `skipB = 3` | `Intersected at '8'` |

**Explanation:** The intersected node's value is 8. From head of A: `[4,1,8,4,5]` (2 nodes before intersection). From head of B: `[5,6,1,8,4,5]` (3 nodes before intersection).

> **Note:** Nodes with value 1 in A and B are different references. Only the node with value 8 points to the same memory location.

**Example 2:**

| Input | Output |
|-------|--------|
| `intersectVal = 2`, `listA = [1,9,1,2,4]`, `listB = [3,2,4]`, `skipA = 3`, `skipB = 1` | `Intersected at '2'` |

**Example 3:**

| Input | Output |
|-------|--------|
| `intersectVal = 0`, `listA = [2,6,4]`, `listB = [1,5]` | `No intersection` |

---

## Constraints

- The number of nodes of listA is in the range `[1, 10⁴]`
- The number of nodes of listB is in the range `[1, 10⁴]`
- `1 <= Node.val <= 10⁵`
- `0 <= skipA <= m` (where m is length of listA)
- `0 <= skipB <= n` (where n is length of listB)
- `intersectVal == listA[skipA] == listB[skipB]` if lists intersect

**Follow up:** Could you write a solution that runs in O(m + n) time and uses only O(1) memory?

---

## Solution

```python
from typing import Optional

class ListNode:
    def __init__(self, x):
        self.val = x
        self.next = None

class Solution:
    def getIntersectionNode(self, headA: ListNode, headB: ListNode) -> Optional[ListNode]:
        if not headA or not headB:
            return None
        
        a, b = headA, headB
        
        while a != b:
            a = a.next if a else headB
            b = b.next if b else headA
        
        return a  # or b (they are equal)
```

---

## Explanation

This problem finds the intersection node of two linked lists using an O(1) space approach.

### Key Insight

If we traverse both lists with two pointers:
1. When pointer A reaches the end of listA, redirect it to the head of listB.
2. When pointer B reaches the end of listB, redirect it to the head of listA.

Both pointers will travel the same total distance:
- `len(A) + len(B - intersection)` for pointer A
- `len(B) + len(A - intersection)` for pointer B

When they meet, either:
- At the intersection node (if lists intersect)
- At null (if lists don't intersect)

### Algorithm

1. Initialize two pointers at the heads of both lists.
2. Traverse both lists simultaneously.
3. When a pointer reaches the end of its list, redirect it to the other list's head.
4. When the two pointers meet, return that node (or null if no intersection).

---

## Complexity Analysis

| Complexity | Description |
|------------|-------------|
| **Time** | O(m + n) where m and n are the lengths of the two lists |
| **Space** | O(1) - only two pointers used |

This solution meets the follow-up requirement of O(1) additional space.
