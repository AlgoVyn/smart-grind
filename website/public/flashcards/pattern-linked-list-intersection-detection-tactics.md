## Linked List Intersection Detection: Tactics

What are the advanced techniques and variations for cycle detection and list intersection problems?

<!-- front -->

---

### Tactic 1: Cycle Length Calculation

Once slow and fast meet, count the cycle length:

```python
def find_cycle_length(head: ListNode) -> int:
    """
    Find the length of the cycle if it exists.
    """
    if not head or not head.next:
        return 0
    
    slow = fast = head
    
    # Phase 1: Find meeting point
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return 0  # No cycle
    
    # Phase 2: Count cycle length
    length = 1
    fast = fast.next
    while fast != slow:
        fast = fast.next
        length += 1
    
    return length
```

**Use case**: Problems requiring knowledge of cycle size.

---

### Tactic 2: Array-as-Linked-List (Duplicate Detection)

For arrays where `arr[i]` is the next index (values 1 to n, indices 0 to n-1):

```python
def find_duplicate(nums: list) -> int:
    """
    Find duplicate in array [1..n] with values in range [0..n-1].
    Treat as linked list: nums[i] is next pointer.
    LeetCode 287: Find the Duplicate Number
    """
    # Phase 1: Find meeting point (cycle detection)
    slow = nums[0]
    fast = nums[nums[0]]
    
    while slow != fast:
        slow = nums[slow]           # 1 step
        fast = nums[nums[fast]]     # 2 steps
    
    # Phase 2: Find cycle start (duplicate number)
    slow = 0
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    
    return slow
```

**Key insight**: Duplicate number creates a cycle (two ways to reach same index).

---

### Tactic 3: Happy Number (Cycle in Number Transformation)

Detect cycles in iterative number transformations:

```python
def is_happy(n: int) -> bool:
    """
    Happy Number: Replace n with sum of squares of digits.
    If reaches 1, it's happy. If cycles, it's not.
    """
    def get_next(num):
        total = 0
        while num > 0:
            digit = num % 10
            total += digit * digit
            num //= 10
        return total
    
    slow = n
    fast = get_next(n)
    
    while fast != 1 and slow != fast:
        slow = get_next(slow)           # 1 step
        fast = get_next(get_next(fast)) # 2 steps
    
    return fast == 1
```

**Pattern**: Same Floyd's algorithm, just "next" is computed, not a pointer.

---

### Tactic 4: Fast/Slow with Fixed Gap

For problems requiring specific positioning:

```python
def remove_nth_from_end(head: ListNode, n: int) -> ListNode:
    """
    Remove nth node from end using gap pattern.
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

### Tactic 5: Hash Set Alternative

When simplicity matters more than space:

```python
def has_cycle_hash_set(head: ListNode) -> bool:
    """
    Detect cycle using hash set - O(n) space.
    Simpler code, trade space for clarity.
    """
    visited = set()
    current = head
    
    while current:
        if current in visited:
            return True
        visited.add(current)
        current = current.next
    
    return False


def get_intersection_node_hash(headA: ListNode, headB: ListNode) -> ListNode:
    """
    Find intersection using hash set.
    """
    visited = set()
    
    current = headA
    while current:
        visited.add(current)
        current = current.next
    
    current = headB
    while current:
        if current in visited:
            return current
        current = current.next
    
    return None
```

---

### Tactic 6: Common Pitfalls & Fixes

| Pitfall | Issue | Fix |
|---------|-------|-----|
| **Null check order** | `fast.next.next` on null | Check `fast and fast.next` first |
| **Wrong initialization** | `slow=fast=head` vs `head.next` | Use `head.next` to avoid instant meet |
| **Missing edge case** | Empty or single-node list | Check `head` and `head.next` first |
| **Infinite loop** | Not advancing both pointers | Ensure both move each iteration |
| **Modifying pointers** | Changing `next` during traversal | Don't modify unless specifically needed |
| **Two list null check** | `p1.next when p1 is None` | Use `p1 = p1.next if p1 else headB` |

---

### Tactic 7: Custom Speed Ratios

For finding specific fractional positions:

```python
def find_middle(head):
    """Standard: slow at middle when fast at end"""
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow


def find_third(head):
    """Find node at 1/3 of list"""
    slow = fast = head
    while fast and fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next.next  # 3 steps
    return slow
```

**Rule**: Fast moves k steps, slow ends at n/k position.

<!-- back -->
