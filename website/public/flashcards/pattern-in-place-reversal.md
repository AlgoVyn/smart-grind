## In-Place Reversal of Linked List

**Question:** How do you reverse a linked list in-place?

<!-- front -->

---

## Answer: Three-Pointer Technique

### Solution
```python
def reverseList(head):
    prev = None
    current = head
    
    while current:
        next_node = current.next  # Save next
        current.next = prev       # Reverse link
        prev = current            # Move prev
        current = next_node       # Move current
    
    return prev
```

### Visual
```
Before: 1 → 2 → 3 → None
        ↑
      current

Step 1: 1 ← 2 → 3 → None
Step 2: 1 ← 2 ← 3 → None
Step 3: 1 ← 2 ← 3 ← None

Result: 3 → 2 → 1 → None
```

### Variations

#### Reverse k-group
```python
def reverseKGroup(head, k):
    # Find length, then reverse in groups
    dummy = ListNode(0, head)
    groupPrev = dummy
    
    while True:
        kth = get_kth(groupPrev, k)
        if not kth:
            break
        groupNext = kth.next
        
        # Reverse group
        prev, curr = kth.next, groupPrev.next
        for _ in range(k):
            next_node = curr.next
            curr.next = prev
            prev = curr
            curr = next_node
        
        # Connect
        first = groupPrev.next
        groupPrev.next = kth
        groupPrev = first
        groupPrev.next = groupNext
    
    return dummy.next
```

### Complexity
- **Time:** O(n)
- **Space:** O(1)

### Key Points
- Save next before reversing
- Never lose the rest of list

<!-- back -->
