## Linked List Addition of Numbers: Framework

What is the complete code template for adding two numbers represented as linked lists?

<!-- front -->

---

### Framework: Linked List Addition

```
┌─────────────────────────────────────────────────────────────┐
│  LINKED LIST ADDITION - TEMPLATE                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Key Insight: Simulate manual addition from LSB to MSB      │
│                                                             │
│  1. Setup:                                                  │
│     - Create dummy node as result head                      │
│     - Initialize current pointer and carry = 0              │
│                                                             │
│  2. Traversal loop (while l1 or l2 or carry):               │
│     - val1 = l1.val if l1 else 0                          │
│     - val2 = l2.val if l2 else 0                          │
│     - total = val1 + val2 + carry                           │
│     - carry = total // 10                                   │
│     - digit = total % 10                                    │
│                                                             │
│  3. Build result:                                           │
│     - current.next = ListNode(digit)                        │
│     - current = current.next                                │
│     - l1 = l1.next if l1 else None                          │
│     - l2 = l2.next if l2 else None                          │
│                                                             │
│  4. Return:                                                 │
│     - return dummy.next                                     │
│                                                             │
│  Time: O(max(n,m))  Space: O(max(n,m))                      │
└─────────────────────────────────────────────────────────────┘
```

---

### Implementation: Iterative with Dummy Node

```python
def add_two_numbers(l1: ListNode, l2: ListNode) -> ListNode:
    """
    Add two numbers represented as linked lists.
    LeetCode 2 - Add Two Numbers
    Time: O(max(n, m)), Space: O(max(n, m))
    """
    dummy = ListNode()
    current = dummy
    carry = 0
    
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
    
    return dummy.next
```

---

### Implementation: Forward Order (Using Stacks)

```python
def add_two_numbers_forward(l1: ListNode, l2: ListNode) -> ListNode:
    """
    Add two numbers stored in forward order using stacks.
    LeetCode 445 - Add Two Numbers II
    Time: O(n + m), Space: O(n + m)
    """
    stack1, stack2 = [], []
    
    # Push all digits onto stacks
    while l1:
        stack1.append(l1.val)
        l1 = l1.next
    while l2:
        stack2.append(l2.val)
        l2 = l2.next
    
    result = None
    carry = 0
    
    # Process from least significant digit
    while stack1 or stack2 or carry:
        val1 = stack1.pop() if stack1 else 0
        val2 = stack2.pop() if stack2 else 0
        
        total = val1 + val2 + carry
        carry = total // 10
        
        # Prepend new node to result
        new_node = ListNode(total % 10)
        new_node.next = result
        result = new_node
    
    return result
```

---

### Framework Elements Reference

| Element | Purpose | Code Pattern |
|---------|---------|--------------|
| `dummy` | Simplifies result construction | `dummy = ListNode()` |
| `current` | Pointer to build result | `current = dummy` |
| `carry` | Propagate overflow | `carry = total // 10` |
| `total % 10` | Extract digit | `digit = total % 10` |
| Loop condition | Handle unequal lengths + final carry | `while l1 or l2 or carry` |

<!-- back -->
