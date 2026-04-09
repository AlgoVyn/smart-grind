## Two Pointers - Fixed Separation (Nth Node from End): Tactics

What are specific techniques and implementation details for fixed separation two-pointer problems?

<!-- front -->

---

### Tactic 1: Off-by-One Handling

**For finding nth node:** Advance `fast` by `n` steps
**For removing nth node:** Advance `fast` by `n + 1` steps (to stop at node before target)

```python
# Finding: advance by n
for _ in range(n):
    fast = fast.next

# Removing: advance by n+1 (to get to node BEFORE target)
for _ in range(n + 1):
    fast = fast.next
# Now slow will be at node before the one to remove
slow.next = slow.next.next
```

---

### Tactic 2: Dummy Node for Edge Cases

Use dummy node to handle head removal without special cases:

```python
def remove_nth_from_end(head, n):
    dummy = ListNode(0)
    dummy.next = head
    slow = fast = dummy
    
    # Move fast n+1 steps
    for _ in range(n + 1):
        fast = fast.next
    
    # Move both until fast is null
    while fast:
        slow = slow.next
        fast = fast.next
    
    # Remove the node
    slow.next = slow.next.next
    return dummy.next  # Works even if head was removed
```

**Without dummy:** Need extra `if` checks for removing head

---

### Tactic 3: Length Validation

Always check if `n` is valid during initial advancement:

```python
# Option 1: Return None/raise error if n > length
for _ in range(n):
    if not fast:
        return None  # or raise ValueError
    fast = fast.next

# Option 2: Assume valid input (common in competitions)
for _ in range(n):
    fast = fast.next  # assumes 1 <= n <= length
```

---

### Tactic 4: Two-Pass Alternative

When single-pass complexity is confusing, use length calculation:

```python
def find_nth_from_end_two_pass(head, n):
    # First pass: count length
    length = 0
    curr = head
    while curr:
        length += 1
        curr = curr.next
    
    # Second pass: go to position (length - n)
    curr = head
    for _ in range(length - n):
        curr = curr.next
    
    return curr
```

**Trade-off:** Same O(L) time but two passes, often easier to understand.

---

### Tactic 5: Memory Management (C++)

Don't forget to delete removed nodes to prevent memory leaks:

```cpp
ListNode* removeNthFromEnd(ListNode* head, int n) {
    ListNode* dummy = new ListNode(0, head);
    ListNode* slow = dummy;
    ListNode* fast = dummy;
    
    for (int i = 0; i <= n; i++) {
        fast = fast->next;
    }
    
    while (fast) {
        slow = slow->next;
        fast = fast->next;
    }
    
    ListNode* toDelete = slow->next;
    slow->next = slow->next->next;
    delete toDelete;  // Free memory
    
    ListNode* result = dummy->next;
    delete dummy;  // Free dummy
    return result;
}
```

---

### Tactic 6: Common Edge Cases Checklist

| Case | Input Example | Handling |
|------|---------------|----------|
| Empty list | `head = null` | Return null immediately |
| Single node | `1 → null`, `n = 1` | Return null (list becomes empty) |
| Remove head | `1 → 2 → 3`, `n = 3` | Use dummy node |
| Remove tail | `1 → 2 → 3`, `n = 1` | Standard flow |
| n equals length | Any list, `n = length` | Same as removing head |

---

### Tactic 7: Extension to Swapping

Swap nodes instead of removing:

```python
def swap_nth_from_end(head, n):
    # Find nth from end using fixed separation
    dummy = ListNode(0, head)
    slow = fast = dummy
    
    for _ in range(n + 1):
        fast = fast.next
    
    while fast:
        slow = slow.next
        fast = fast.next
    
    # slow.next is nth from end
    # Find node to swap with (e.g., nth from start)
    # Swap their values or rewire pointers
```

<!-- back -->
