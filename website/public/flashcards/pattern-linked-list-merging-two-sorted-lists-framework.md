## Linked List - Merging Two Sorted Lists: Framework

What is the complete code template for merging two sorted linked lists?

<!-- front -->

---

### Framework: Merge Two Sorted Linked Lists

```
┌─────────────────────────────────────────────────────────────┐
│  MERGE TWO SORTED LISTS - TEMPLATE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Key Insight: Always pick the smaller element from either   │
│  list front, maintaining sorted order.                      │
│                                                             │
│  1. Create dummy node as result list anchor                 │
│     dummy = ListNode(0)                                     │
│     current = dummy                                         │
│                                                             │
│  2. While both lists have nodes:                            │
│        if l1.val <= l2.val:                                 │
│            current.next = l1  # Link smaller                │
│            l1 = l1.next       # Advance l1                  │
│        else:                                                │
│            current.next = l2  # Link smaller                │
│            l2 = l2.next       # Advance l2                  │
│        current = current.next   # Advance result            │
│                                                             │
│  3. Link remaining nodes: current.next = l1 or l2           │
│                                                             │
│  4. Return dummy.next (real head)                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### Implementation: Iterative (Recommended)

```python
def merge_two_lists(l1: ListNode, l2: ListNode) -> ListNode:
    """
    Merge two sorted linked lists.
    LeetCode 21 - Merge Two Sorted Lists
    Time: O(n + m), Space: O(1)
    """
    dummy = ListNode()
    current = dummy
    
    while l1 and l2:
        if l1.val <= l2.val:
            current.next = l1
            l1 = l1.next
        else:
            current.next = l2
            l2 = l2.next
        current = current.next
    
    # Append remaining nodes from non-empty list
    current.next = l1 if l1 else l2
    
    return dummy.next
```

---

### Implementation: Recursive

```python
def merge_two_lists_recursive(l1: ListNode, l2: ListNode) -> ListNode:
    """
    Recursive merge of two sorted linked lists.
    Time: O(n + m), Space: O(n + m) for recursion stack
    """
    if not l1:
        return l2
    if not l2:
        return l1
    
    if l1.val <= l2.val:
        l1.next = merge_two_lists_recursive(l1.next, l2)
        return l1
    else:
        l2.next = merge_two_lists_recursive(l1, l2.next)
        return l2
```

---

### Implementation: Multi-Language

```cpp
// C++
ListNode* mergeTwoLists(ListNode* l1, ListNode* l2) {
    ListNode dummy;
    ListNode* current = &dummy;
    
    while (l1 && l2) {
        if (l1->val <= l2->val) {
            current->next = l1;
            l1 = l1->next;
        } else {
            current->next = l2;
            l2 = l2->next;
        }
        current = current->next;
    }
    current->next = l1 ? l1 : l2;
    return dummy.next;
}
```

```java
// Java
public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    ListNode dummy = new ListNode();
    ListNode current = dummy;
    
    while (l1 != null && l2 != null) {
        if (l1.val <= l2.val) {
            current.next = l1;
            l1 = l1.next;
        } else {
            current.next = l2;
            l2 = l2.next;
        }
        current = current.next;
    }
    current.next = (l1 != null) ? l1 : l2;
    return dummy.next;
}
```

---

### Key Framework Elements

| Element | Purpose | Complexity |
|---------|---------|------------|
| `dummy` | Anchor for result list | O(1) space |
| `current` | Tracks insertion point | Advances each iteration |
| `l1.val <= l2.val` | Stable comparison | Maintains order of equals |
| `current.next = l1/l2` | Wire pointer | O(1) operation |
| Append remainder | Handle tail | After main loop |

<!-- back -->
