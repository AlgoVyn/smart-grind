## Fast & Slow Pointers (Cycle Detection): Tactics

What are specific techniques and tactical variations for fast-slow pointer problems?

<!-- front -->

---

### Tactic 1: Array as Linked List (Duplicate Detection)

Treat array indices as next pointers where `nums[i]` points to next index.

```python
def find_duplicate(nums):
    """
    Find duplicate in array [1..n] with n+1 elements.
    Values in range [1, n] guarantee at least one duplicate (pigeonhole principle).
    Treat as linked list: index -> value is the "next" pointer.
    """
    # Phase 1: Find meeting point inside cycle
    slow = nums[0]           # Start at first value
    fast = nums[nums[0]]     # Move 2 steps ahead
    
    while slow != fast:
        slow = nums[slow]         # Move 1: follow value as index
        fast = nums[nums[fast]]    # Move 2: follow twice
    
    # Phase 2: Find entrance (the duplicate number)
    slow = 0                 # Reset to "virtual" start (index 0)
    while slow != fast:
        slow = nums[slow]    # Move 1 from index side
        fast = nums[fast]    # Move 1 from cycle side
    
    return slow  # The duplicate number
```

**Key insight**: Array values are constrained to [1, n], so they always point to valid indices, creating a linked structure with guaranteed cycle.

---

### Tactic 2: Happy Number Detection

Use fast-slow on number transformation (sum of squared digits).

```python
def is_happy(n):
    """
    Happy number: eventually reaches 1.
    Unhappy number: enters cycle (4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4)
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
        slow = get_next(slow)            # Move 1 step
        fast = get_next(get_next(fast))  # Move 2 steps
    
    return fast == 1
```

**Tactical note**: Initialize fast one step ahead to ensure we enter the loop correctly. Check for `fast == 1` separately to detect happiness.

---

### Tactic 3: Custom Speed Ratios

Different speed ratios find different positions in linked list.

```python
def find_node_at_fraction(head, k):
    """
    Find node at 1/k of the list length.
    Speed ratio 1:k achieves this.
    """
    slow = head
    fast = head
    
    # Move fast k steps for every 1 step of slow
    while fast and fast.next:
        slow = slow.next
        # Move fast k steps
        for _ in range(k):
            if not fast:
                break
            fast = fast.next
    
    return slow  # At position n/k


def find_third_from_end(head):
    """Find node 1/3 through the list."""
    slow = fast = head
    
    while fast and fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next.next  # 3 steps
    
    return slow  # At 1/3 point
```

---

### Tactic 4: Palindrome Linked List

Combine fast-slow middle finding with reversal.

```python
def is_palindrome(head):
    """
    Check if linked list is palindrome in O(1) space.
    Steps: 1) Find middle, 2) Reverse second half, 3) Compare
    """
    # Step 1: Find middle (fast-slow)
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    # Step 2: Reverse second half
    prev = None
    while slow:
        nxt = slow.next
        slow.next = prev
        prev = slow
        slow = nxt
    
    # Step 3: Compare first and second halves
    left, right = head, prev
    while right:  # Right is shorter or equal
        if left.val != right.val:
            return False
        left = left.next
        right = right.next
    
    return True
```

---

### Tactic 5: Remove Nth Node from End

Use gap pattern - fast leads by n+1 steps.

```python
def remove_nth_from_end(head, n):
    """
    Remove nth node from end in single pass.
    Fast pointer leads by n+1 to stop at node before target.
    """
    dummy = ListNode(0)
    dummy.next = head
    
    slow = fast = dummy
    
    # Fast leads by n+1
    for _ in range(n + 1):
        fast = fast.next
    
    # Move together - when fast hits end, slow is at node before target
    while fast:
        slow = slow.next
        fast = fast.next
    
    # Remove target
    slow.next = slow.next.next
    return dummy.next
```

---

### Tactic Comparison Table

| Tactic | Problem Type | Key Variation | Complexity |
|--------|-------------|---------------|------------|
| **Array-as-List** | Find duplicate | `nums[i]` as next pointer | O(n) time, O(1) space |
| **Happy Number** | Sequence cycle | `get_next()` function as "next" | O(log n) amortized, O(1) space |
| **Custom Ratio** | Position finding | Speed ratio 1:k | O(n) time, O(1) space |
| **Palindrome** | List property | Middle + reverse + compare | O(n) time, O(1) space |
| **Gap Pattern** | Relative positioning | Fixed gap n+1 | O(n) time, O(1) space |

<!-- back -->
