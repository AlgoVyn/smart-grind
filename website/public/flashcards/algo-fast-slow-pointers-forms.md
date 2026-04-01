## Fast-Slow Pointers: Forms & Variations

What are different forms and variations of fast-slow pointer patterns?

<!-- front -->

---

### Standard Speed Ratio (1:2)

```python
# Classic tortoise-hare
slow = slow.next          # 1 step
fast = fast.next.next     # 2 steps
```

**Result:**
- Middle detection: slow at middle when fast at end
- Cycle detection: guaranteed meeting if cycle exists

---

### Custom Speed Ratios

| Ratio | Use Case | Result |
|-------|----------|--------|
| **1:3** | Find 1/3 point | Slow at n/3 |
| **1:k** | Find 1/k point | Slow at n/k |
| **2:3** | Specific positioning | Slow at 2n/3 |

```python
def find_third(head):
    """Find node at 1/3 of list"""
    slow = fast = head
    
    while fast and fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next.next  # 3 steps
    
    return slow
```

---

### Multiple Pointers Pattern

```python
def remove_nth_from_end(head, n):
    """
    Remove nth node from end using gap pattern
    """
    dummy = ListNode(0)
    dummy.next = head
    
    # Fast leads by n+1 (to stop at node before target)
    slow = fast = dummy
    
    for _ in range(n + 1):
        fast = fast.next
    
    while fast:
        slow = slow.next
        fast = fast.next
    
    # slow is at node before target
    slow.next = slow.next.next
    return dummy.next
```

---

### Array-as-Linked-List (Duplicate Detection)

For arrays where `arr[i]` points to next index:

```python
def find_duplicate(nums):
    """
    Find duplicate in array [1..n] with values in range
    Treat as linked list: nums[i] is next pointer
    """
    # Phase 1: Find meeting point (cycle detection)
    slow = nums[0]
    fast = nums[nums[0]]
    
    while slow != fast:
        slow = nums[slow]
        fast = nums[nums[fast]]
    
    # Phase 2: Find cycle start (duplicate number)
    slow = 0
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    
    return slow
```

**Applies to:** Find Duplicate Number (LeetCode 287)

---

### Palindrome Check Pattern

```python
def is_palindrome(head):
    """
    Check if linked list is palindrome
    """
    # 1. Find middle
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    # 2. Reverse second half
    prev = None
    while slow:
        slow.next, prev, slow = prev, slow, slow.next
    
    # 3. Compare halves
    left, right = head, prev
    result = True
    while right:  # right is shorter or equal
        if left.val != right.val:
            result = False
            break
        left = left.next
        right = right.next
    
    return result
```

<!-- back -->
