## Fast & Slow Pointers (Cycle Detection): Problem Forms

What are the common variations and problem forms for fast-slow pointer cycle detection?

<!-- front -->

---

### Form 1: Linked List Cycle Detection (LeetCode 141)

**Problem**: Return true if linked list has a cycle.

```python
# Input: head = [3,2,0,-4], pos = 1 (cycle back to index 1)
# Output: true

def has_cycle(head):
    """
    Basic Floyd's algorithm - Phase 1 only.
    Returns True if cycle exists, False otherwise.
    """
    if not head or not head.next:
        return False
    
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    
    return False
```

**LeetCode**: 141 - Linked List Cycle

---

### Form 2: Linked List Cycle II - Find Entrance (LeetCode 142)

**Problem**: Return node where cycle begins, or null if no cycle.

```python
# Input: head = [3,2,0,-4], pos = 1
# Output: Node at index 1 (value 2)

def detect_cycle(head):
    """
    Complete Floyd's algorithm - both phases.
    Returns cycle start node or None.
    """
    if not head or not head.next:
        return None
    
    # Phase 1: Find meeting point
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return None
    
    # Phase 2: Find entrance
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow
```

**LeetCode**: 142 - Linked List Cycle II

---

### Form 3: Middle of Linked List (LeetCode 876)

**Problem**: Return middle node. If two middle nodes, return second.

```python
# Input: [1,2,3,4,5]
# Output: Node with value 3
# Input: [1,2,3,4,5,6]
# Output: Node with value 4 (second middle)

def middle_node(head):
    """
    Fast-slow variant: when fast reaches end, slow is at middle.
    """
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow
```

**LeetCode**: 876 - Middle of the Linked List

---

### Form 4: Happy Number (LeetCode 202)

**Problem**: Return true if number is happy (eventually reaches 1).

```python
# Input: n = 19
# Output: true
# 1² + 9² = 82 → 8² + 2² = 68 → 6² + 8² = 100 → 1² + 0² + 0² = 1

# Input: n = 2
# Output: false (enters 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4 cycle)

def is_happy(n):
    """
    Detect cycle in number transformation sequence.
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
        slow = get_next(slow)
        fast = get_next(get_next(fast))
    
    return fast == 1
```

**LeetCode**: 202 - Happy Number

---

### Form 5: Find Duplicate Number (LeetCode 287)

**Problem**: Find the duplicate number in array [1..n] with n+1 integers.

```python
# Input: nums = [1,3,4,2,2]
# Output: 2
# Input: nums = [3,1,3,4,2]
# Output: 3

def find_duplicate(nums):
    """
    Treat array as linked list: nums[i] is next pointer.
    Values 1..n guarantee at least one duplicate (pigeonhole principle).
    """
    # Phase 1: Find meeting point
    slow = nums[0]
    fast = nums[nums[0]]
    
    while slow != fast:
        slow = nums[slow]
        fast = nums[nums[fast]]
    
    # Phase 2: Find entrance (duplicate number)
    slow = 0
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    
    return slow
```

**LeetCode**: 287 - Find the Duplicate Number

---

### Form 6: Circular Array Loop (LeetCode 457)

**Problem**: Detect cycle in array where direction must be consistent.

```python
# Input: [2,-1,1,2,2]
# Output: true (cycle: 0 → 2 → 3 → 0, all positive direction)

# Input: [-1,2]
# Output: false (no valid cycle)

def circular_array_loop(nums):
    """
    Detect cycle where all elements have same direction.
    """
    def next_index(i):
        n = len(nums)
        return ((i + nums[i]) % n + n) % n  # Ensure positive
    
    def is_same_direction(i, j):
        return nums[i] * nums[j] > 0
    
    n = len(nums)
    
    for i in range(n):
        if nums[i] == 0:
            continue
        
        slow = i
        fast = next_index(i)
        
        # Move while same direction and not self-loop
        while is_same_direction(slow, fast) and is_same_direction(fast, next_index(fast)):
            if slow == fast:
                if slow == next_index(slow):  # Self-loop not valid
                    break
                return True
            slow = next_index(slow)
            fast = next_index(next_index(fast))
    
    return False
```

**LeetCode**: 457 - Circular Array Loop

---

### Form Variations Summary

| Form | Domain | Key Pattern | LeetCode |
|------|--------|-------------|----------|
| **Cycle Detection** | Linked List | Basic Floyd's Phase 1 | 141 |
| **Find Cycle Start** | Linked List | Both phases | 142 |
| **Middle Element** | Linked List | No cycle check needed | 876 |
| **Happy Number** | Integer sequence | `get_next()` function | 202 |
| **Find Duplicate** | Array-as-list | Values as indices | 287 |
| **Circular Array** | Array with direction | Consistent direction check | 457 |
| **Palindrome Check** | Linked List | Middle + reverse + compare | 234 |
| **Remove Nth from End** | Linked List | Gap pattern | 19 |

<!-- back -->
