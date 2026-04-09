## Linked List - In-place Reversal: Framework

What is the complete code template for in-place linked list reversal?

<!-- front -->

---

### Framework: In-place Reversal Template

```
┌─────────────────────────────────────────────────────────────┐
│  IN-PLACE LINKED LIST REVERSAL - TEMPLATE                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Key Insight: Flip next pointers to point backward          │
│                                                             │
│  1. Initialize pointers:                                      │
│     - prev = null (new tail / previous node)                │
│     - current = head (node being processed)                 │
│                                                             │
│  2. Iterate while current != null:                          │
│     - next_node = current.next  (SAVE before overwrite!)    │
│     - current.next = prev       (FLIP the pointer)          │
│     - prev = current            (advance prev)            │
│     - current = next_node       (advance current)           │
│                                                             │
│  3. Return prev as new head:                                │
│     - prev now points to last node processed (new head)   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  CRITICAL: Save next before overwriting!            │    │
│  │  next_node = current.next  ← MUST do this FIRST     │    │
│  │  current.next = prev       ← THEN flip pointer    │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  4. Sublist reversal (positions left to right):             │
│     - Use dummy node before head                            │
│     - Find node before left (prev_left)                     │
│     - current = prev_left.next                              │
│     - Move nodes one by one: for _ in range(right-left)     │
│       next_node = current.next                              │
│       current.next = next_node.next                         │
│       next_node.next = prev_left.next                       │
│       prev_left.next = next_node                            │
└─────────────────────────────────────────────────────────────┘
```

---

### Implementation: Full List Reversal

```python
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head: ListNode) -> ListNode:
    """
    Reverse entire linked list iteratively.
    Time: O(n), Space: O(1)
    """
    prev = None
    current = head
    
    while current:
        next_node = current.next    # SAVE: store forward link
        current.next = prev         # FLIP: reverse the pointer
        prev = current              # ADVANCE: move prev forward
        current = next_node         # ADVANCE: move current forward
    
    return prev                     # prev is now the new head


def reverse_list_recursive(head: ListNode) -> ListNode:
    """
    Reverse using recursion (O(n) space for stack).
    Time: O(n), Space: O(n)
    """
    if not head or not head.next:
        return head
    
    new_head = reverse_list_recursive(head.next)
    head.next.next = head           # Rewire: next node points back
    head.next = None                # Disconnect old forward link
    
    return new_head
```

---

### Implementation: Sublist Reversal (Reverse Between)

```python
def reverse_between(head: ListNode, left: int, right: int) -> ListNode:
    """
    Reverse nodes from position left to right (1-indexed).
    Time: O(n), Space: O(1)
    """
    if not head or left == right:
        return head
    
    dummy = ListNode(0)
    dummy.next = head
    
    # Find node just before position left
    prev_left = dummy
    for _ in range(left - 1):
        prev_left = prev_left.next
    
    # current is at position left (start of reversal)
    current = prev_left.next
    
    # Move nodes one by one to after prev_left
    for _ in range(right - left):
        next_node = current.next
        current.next = next_node.next
        next_node.next = prev_left.next
        prev_left.next = next_node
    
    return dummy.next
```

---

### Pointer State Visualization

```
Initial:  1 → 2 → 3 → 4 → 5 → null
           ↑
          head

Step 1:    null ← 1    2 → 3 → 4 → 5 → null
                     ↑
              prev  curr  next_node

Step 2:    null ← 1 ← 2    3 → 4 → 5 → null
                            ↑
                   prev   curr  next_node

Step 3:    null ← 1 ← 2 ← 3    4 → 5 → null
                                   ↑
                        prev   curr  next_node

Final:     null ← 1 ← 2 ← 3 ← 4 ← 5
                              ↑
                             prev (return this!)
```

---

### Key Framework Elements

| Element | Purpose | Initial Value |
|---------|---------|---------------|
| `prev` | Points to already-reversed portion | `null` |
| `current` | Node currently being processed | `head` |
| `next_node` | Saves forward link before overwrite | `current.next` |
| `dummy` | Handles edge cases (head changes) | `ListNode(0)` before head |
| Return value | New head after reversal | `prev` |

<!-- back -->
