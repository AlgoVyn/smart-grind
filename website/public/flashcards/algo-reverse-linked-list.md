## Reverse Linked List: Iterative vs Recursive

**Question:** How do you reverse a linked list and what are the common pointer manipulation errors?

<!-- front -->

---

## Answer: Master the Three-Pointer Technique

### Iterative Approach (Preferred)
```python
def reverseList(head):
    prev = None
    curr = head
    
    while curr:
        next_temp = curr.next  # Save next!
        curr.next = prev       # Reverse link
        prev = curr            # Move prev forward
        curr = next_temp       # Move curr forward
    
    return prev
```

### Recursive Approach
```python
def reverseList(head):
    if not head or not head.next:
        return head
    
    new_head = reverseList(head.next)
    head.next.next = head
    head.next = None
    
    return new_head
```

### Visual: Pointer Movement
```
Original: 1 -> 2 -> 3 -> None

Step 1: prev=None, curr=1
        next_temp = 2
        1.next = None
        prev = 1, curr = 2

Step 2: prev=1, curr=2
        next_temp = 3
        2.next = 1
        prev = 2, curr = 3

Step 3: prev=2, curr=3
        next_temp = None
        3.next = 2
        prev = 3, curr = None

Result: 3 -> 2 -> 1 -> None
```

### ⚠️ Tricky Parts

#### 1. Forgetting to Save Next
```python
# WRONG - lose the rest of list!
curr.next = prev
prev = curr
curr = curr.next  # WRONG - curr.next is now prev!

# CORRECT - save next first
next_temp = curr.next
curr.next = prev
prev = curr
curr = next_temp
```

#### 2. Not Setting Head to None
```python
# Without this, you get a cycle!
head.next = None  # Don't forget!
```

#### 3. Recursive Stack Overflow
```python
# For long lists, use iterative!
# Recursion depth limited to ~1000 in Python
```

### Common Variations

| Variation | Key Change |
|----------|-----------|
| Reverse from m to n | Stop at m, track positions |
| Reverse in groups of k | Process k nodes at a time |
| Reverse alternate k | Skip k, reverse next k |

### When to Use Each

| Approach | Pros | Cons |
|----------|------|------|
| Iterative | O(1) space, fast | More code |
| Recursive | Clean, elegant | O(n) stack space |

<!-- back -->
