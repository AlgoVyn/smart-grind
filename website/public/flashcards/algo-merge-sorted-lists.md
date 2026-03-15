## Merge Two Sorted Lists - Recursive vs Iterative

**Question:** Compare the recursive and iterative approaches for merging two sorted linked lists.

<!-- front -->

---

## Merge Two Sorted Lists

### Recursive Approach
```python
def merge_two_lists(l1, l2):
    # Base cases
    if not l1: return l2
    if not l2: return l1
    
    # Choose smaller head and recurse
    if l1.val <= l2.val:
        l1.next = merge_two_lists(l1.next, l2)
        return l1
    else:
        l2.next = merge_two_lists(l1, l2.next)
        return l2
```

### Iterative Approach
```python
def merge_two_lists_iter(l1, l2):
    dummy = ListNode(0)
    tail = dummy
    
    while l1 and l2:
        if l1.val <= l2.val:
            tail.next = l1
            l1 = l1.next
        else:
            tail.next = l2
            l2 = l2.next
        tail = tail.next
    
    tail.next = l1 or l2
    return dummy.next
```

### Comparison
| Aspect | Recursive | Iterative |
|--------|-----------|-----------|
| Time | O(n + m) | O(n + m) |
| Space | O(n + m) | O(1) |
| Stack Depth | O(n + m) | N/A |

### 💡 When to Use
- **Recursive:** Cleaner code, acceptable stack
- **Iterative:** Better space efficiency, avoids stack overflow

<!-- back -->
