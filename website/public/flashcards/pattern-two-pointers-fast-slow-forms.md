## Two Pointers - Fast & Slow: Forms

What are the different variations and forms of the Fast & Slow pointer pattern?

<!-- front -->

---

### Form 1: Basic Cycle Detection

**Purpose**: Determine if a cycle exists

```python
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next          # 1 step
        fast = fast.next.next     # 2 steps
        if slow == fast:
            return True           # Cycle found
    return False
```

**When to use**: Just need to know IF there's a cycle

---

### Form 2: Find Cycle Start Node

**Purpose**: Find the exact node where cycle begins

```python
def find_cycle_start(head):
    # Phase 1: Find meeting point
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return None  # No cycle
    
    # Phase 2: Find entrance
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    return slow
```

**Why it works**: Distance from start to entrance = distance from meeting point to entrance

---

### Form 3: Find Middle Element

**Purpose**: Find middle of linked list in one pass

```python
def find_middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next      # 1 step
        fast = fast.next.next # 2 steps
    return slow  # Middle when fast reaches end
```

**Key insight**: When fast reaches end, slow is at middle

---

### Form 4: Happy Number Detection

**Purpose**: Detect if number sequence ends at 1 or loops forever

```python
def is_happy(n):
    def get_next(num):
        return sum(int(d)**2 for d in str(num))
    
    slow, fast = n, get_next(n)
    while fast != 1 and slow != fast:
        slow = get_next(slow)
        fast = get_next(get_next(fast))
    return fast == 1
```

**When to use**: Sequence generation problems with potential cycles

---

### Form 5: Array as Linked List

**Purpose**: Find duplicates using array values as "next" pointers

```python
def find_duplicate(nums):
    # nums[i] is the "next" pointer
    slow, fast = nums[0], nums[nums[0]]
    while slow != fast:
        slow = nums[slow]
        fast = nums[nums[fast]]
    
    # Find entrance (the duplicate)
    slow = 0
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    return slow
```

**When to use**: Array problems where values act as indices (pigeonhole principle)

---

### Form Comparison

| Form | Speed Ratio | Space | Time | Primary Use |
|------|-------------|-------|------|-------------|
| Basic Detection | 1:2 | O(1) | O(n) | Cycle existence |
| Cycle Start | 1:2 | O(1) | O(n) | Find cycle entrance |
| Middle Element | 1:2 | O(1) | O(n) | Find midpoint |
| Happy Number | 1:2 | O(1) | O(log n) | Sequence termination |
| Array Duplicate | 1:2 | O(1) | O(n) | Find duplicates |

<!-- back -->
