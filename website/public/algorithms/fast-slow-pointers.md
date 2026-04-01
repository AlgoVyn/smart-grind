# Fast & Slow Pointers

## Category
Linked List

## Description

The Fast & Slow Pointers technique (also known as Floyd's Cycle Detection Algorithm) uses two pointers moving at different speeds to solve problems involving linked structures and iterative patterns. This elegant approach enables detecting cycles, finding middle elements, and solving various pattern recognition problems in **O(n) time** with **O(1) space** complexity.

By moving one pointer at twice the speed of the other, we can exploit mathematical properties of relative motion to solve problems that would otherwise require additional memory. This technique is fundamental in competitive programming and technical interviews.

---

## Concepts

The Fast & Slow Pointers technique is built on several mathematical and algorithmic principles.

### 1. Relative Speed and Meeting

When two pointers move at different speeds (typically 1:2 ratio), the faster pointer will eventually catch up to the slower one if they are both within a cycle.

| Speed Ratio | Fast Steps | Slow Steps | Meeting Guarantee |
|-------------|------------|------------|-------------------|
| **1:2** (Standard) | 2 per iteration | 1 per iteration | Guaranteed in cycle |
| **1:3** | 3 per iteration | 1 per iteration | Still works, less optimal |
| **1:n** | n per iteration | 1 per iteration | Works for any n > 1 |

### 2. Cycle Detection Mechanics

The key insight for cycle detection:

```
In a cycle of length λ:
- Let μ = distance from head to cycle start
- Let d = distance from cycle start to meeting point
- Slow travels: μ + d steps
- Fast travels: μ + d + kλ steps (for some k ≥ 1)
- Since fast = 2 × slow: μ + d + kλ = 2(μ + d)
- Therefore: μ = kλ - d (distance relationship)
```

### 3. Middle Finding Principle

When finding the middle of a linked list:
- Fast pointer reaches the end in ~n/2 iterations
- Slow pointer has moved exactly n/2 steps
- Result: Slow pointer is at the middle node

### 4. Phase-Based Algorithm Structure

| Phase | Purpose | Pointer Movement | Outcome |
|-------|---------|------------------|---------|
| **Phase 1** | Detect cycle | Fast: 2 steps, Slow: 1 step | Meeting point or null |
| **Phase 2** | Find cycle start | Both: 1 step | Cycle entrance node |
| **Phase 3** | Calculate length | Traverse cycle | Cycle length λ |

---

## Frameworks

Structured approaches for solving fast & slow pointers problems.

### Framework 1: Cycle Detection Template

```
┌─────────────────────────────────────────────────────────┐
│  CYCLE DETECTION FRAMEWORK (Floyd's Algorithm)            │
├─────────────────────────────────────────────────────────┤
│  1. Initialize: slow = head, fast = head                  │
│  2. While fast and fast.next exist:                      │
│     a. Move slow: slow = slow.next (1 step)             │
│     b. Move fast: fast = fast.next.next (2 steps)       │
│     c. If slow == fast: return True (cycle found)       │
│  3. If loop exits: return False (no cycle)              │
└─────────────────────────────────────────────────────────┘
```

**When to use**: Detecting if a linked list, sequence, or structure has a cycle.

### Framework 2: Finding Cycle Start Template

```
┌─────────────────────────────────────────────────────────┐
│  FIND CYCLE START FRAMEWORK                               │
├─────────────────────────────────────────────────────────┤
│  Phase 1: Find Meeting Point                              │
│  1. Use Cycle Detection to find meeting point            │
│  2. If no meeting point, return None                     │
│                                                           │
│  Phase 2: Find Cycle Start                                │
│  1. Reset slow to head                                   │
│  2. Move both slow and fast one step at a time           │
│  3. Where they meet is the cycle start node             │
│                                                           │
│  Mathematical guarantee: distance(head→start) =            │
│                         distance(meeting→start)          │
└─────────────────────────────────────────────────────────┘
```

**When to use**: Finding where a cycle begins in a linked list.

### Framework 3: Middle Node Finding Template

```
┌─────────────────────────────────────────────────────────┐
│  MIDDLE NODE FINDING FRAMEWORK                            │
├─────────────────────────────────────────────────────────┤
│  1. Initialize: slow = head, fast = head                   │
│  2. While fast and fast.next exist:                      │
│     a. Move slow: slow = slow.next (1 step)              │
│     b. Move fast: fast = fast.next.next (2 steps)        │
│  3. Return slow (at middle when fast reaches end)         │
│                                                           │
│  Note: For even-length lists, returns second middle      │
│  Variation: Use fast.next and fast.next.next for first   │
└─────────────────────────────────────────────────────────┘
```

**When to use**: Finding the middle element of a linked list in one pass.

---

## Forms

Different manifestations of the fast & slow pointers pattern.

### Form 1: Linked List Cycle Detection

The classic application - detecting cycles in linked lists.

| Problem | Detection | Finding Start | Finding Length |
|-----------|-------------|---------------|----------------|
| **Basic Cycle** | O(n) time, O(1) space | Use 2-phase | Traverse from start |
| **Self-loop** | Single node points to itself | Node itself | Length = 1 |
| **Large Cycle** | Same algorithm works | Distance μ + d | Count nodes |

### Form 2: Array as Linked List

Treat array indices as "next" pointers.

```
Array: [1, 3, 4, 2, 2]
Index:  0  1  2  3  4
       ↓  ↓  ↓  ↓  ↓
Value: 1  3  4  2  2

Traverse: index → array[index]
Cycle exists at duplicate values
```

**Example**: Finding duplicate in array of 1..n

### Form 3: Number Sequence (Happy Number)

Use a transformation function as the "next" operation.

```
Happy Number Transformation:
19 → 1² + 9² = 82
82 → 8² + 2² = 68
68 → 6² + 8² = 100
100 → 1² + 0² + 0² = 1 (Happy!)

Non-happy number enters a cycle without reaching 1
```

### Form 4: Nth Node from End

Modify the pointer separation to find specific positions.

```
To find nth node from end:
1. Move fast n steps ahead of slow
2. Move both together until fast reaches end
3. Slow is now at nth node from end
```

### Form 5: Palindrome Detection

Combine middle finding with list reversal.

```
Steps:
1. Find middle using fast/slow
2. Reverse second half
3. Compare first half with reversed second half
4. (Optional) Restore the list
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Cycle Length Calculation

Once cycle start is found, count nodes in the cycle:

```python
def cycle_length(head: ListNode) -> int:
    """Find the length of the cycle."""
    start = find_cycle_start(head)
    if not start:
        return 0
    
    current = start.next
    length = 1
    while current != start:
        length += 1
        current = current.next
    return length
```

### Tactic 2: Remove Cycle from Linked List

```python
def remove_cycle(head: ListNode) -> ListNode:
    """Remove cycle from linked list."""
    if not head:
        return head
    
    start = find_cycle_start(head)
    if not start:
        return head
    
    # Find the last node in cycle
    current = start
    while current.next != start:
        current = current.next
    
    # Break the cycle
    current.next = None
    return head
```

### Tactic 3: First vs Second Middle

For even-length lists, control which middle to return:

```python
def find_middle_second(head: ListNode) -> ListNode:
    """Return second middle for even-length lists (standard)."""
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow

def find_middle_first(head: ListNode) -> ListNode:
    """Return first middle for even-length lists."""
    slow, fast = head, head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    return slow
```

### Tactic 4: Nth Node from End

```python
def nth_from_end(head: ListNode, n: int) -> ListNode:
    """Find nth node from end in one pass."""
    if not head or n <= 0:
        return None
    
    slow, fast = head, head
    
    # Move fast n steps ahead
    for _ in range(n):
        if not fast:
            return None
        fast = fast.next
    
    # Move both until fast reaches end
    while fast:
        slow = slow.next
        fast = fast.next
    
    return slow
```

### Tactic 5: Palindrome Linked List

```python
def is_palindrome(head: ListNode) -> bool:
    """Check if linked list is palindrome using reversal."""
    if not head or not head.next:
        return True
    
    # Find middle
    slow, fast = head, head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    # Reverse second half
    second_half = reverse_list(slow.next)
    
    # Compare
    first, second = head, second_half
    result = True
    while second:
        if first.val != second.val:
            result = False
            break
        first = first.next
        second = second.next
    
    # Restore (optional)
    slow.next = reverse_list(second_half)
    return result
```

### Tactic 6: Array as Linked List (Find Duplicate)

```python
def find_duplicate(nums: list[int]) -> int:
    """
    Find duplicate in array of 1..n using cycle detection.
    Treat array as linked list where index i points to nums[i].
    """
    # Phase 1: Find intersection
    slow, fast = nums[0], nums[0]
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    
    # Phase 2: Find cycle start (the duplicate)
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    
    return slow
```

### Tactic 7: Happy Number Detection

```python
def is_happy_number(n: int) -> bool:
    """
    Determine if a number is happy using Floyd's algorithm.
    A happy number eventually reaches 1; otherwise enters a cycle.
    """
    def get_next(num: int) -> int:
        total = 0
        while num > 0:
            digit = num % 10
            total += digit * digit
            num //= 10
        return total
    
    if n <= 0:
        return False
    
    slow, fast = n, get_next(n)
    while fast != 1 and slow != fast:
        slow = get_next(slow)
        fast = get_next(get_next(fast))
    
    return fast == 1
```

---

## Python Templates

### Template 1: Basic Cycle Detection

```python
from typing import Optional

class ListNode:
    """Definition for singly-linked list node."""
    def __init__(self, val: int = 0, next: Optional['ListNode'] = None):
        self.val = val
        self.next = next

def has_cycle(head: Optional[ListNode]) -> bool:
    """
    Template for detecting if a linked list has a cycle.
    Time: O(n), Space: O(1)
    """
    if not head or not head.next:
        return False
    
    slow, fast = head, head
    
    while fast and fast.next:
        slow = slow.next        # Move slow by 1
        fast = fast.next.next   # Move fast by 2
        
        if slow == fast:        # They met - cycle exists!
            return True
    
    return False
```

### Template 2: Find Cycle Start

```python
def find_cycle_start(head: Optional[ListNode]) -> Optional[ListNode]:
    """
    Template for finding the starting node of a cycle.
    Uses two-phase approach.
    Time: O(n), Space: O(1)
    """
    if not head or not head.next:
        return None
    
    # Phase 1: Find meeting point
    slow, fast = head, head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    
    # No cycle found
    if not fast or not fast.next:
        return None
    
    # Phase 2: Find cycle start
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow
```

### Template 3: Find Middle Node

```python
def find_middle(head: Optional[ListNode]) -> Optional[ListNode]:
    """
    Template for finding the middle of a linked list.
    Returns second middle for even-length lists.
    Time: O(n), Space: O(1)
    """
    if not head:
        return None
    
    slow, fast = head, head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow
```

### Template 4: Happy Number

```python
def is_happy(n: int) -> bool:
    """
    Template for happy number detection.
    Uses Floyd's cycle detection on digit transformation.
    Time: O(log n), Space: O(1)
    """
    def get_next(num: int) -> int:
        total = 0
        while num > 0:
            digit = num % 10
            total += digit * digit
            num //= 10
        return total
    
    if n <= 0:
        return False
    
    slow, fast = n, get_next(n)
    while fast != 1 and slow != fast:
        slow = get_next(slow)
        fast = get_next(get_next(fast))
    
    return fast == 1
```

### Template 5: Find Duplicate in Array

```python
def find_duplicate(nums: list[int]) -> int:
    """
    Template for finding duplicate in array of 1..n.
    Treats array as linked list where index points to value.
    Time: O(n), Space: O(1)
    """
    # Phase 1: Find intersection
    slow, fast = nums[0], nums[0]
    while True:
        slow = nums[slow]
        fast = nums[nums[fast]]
        if slow == fast:
            break
    
    # Phase 2: Find cycle start (duplicate)
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    
    return slow
```

### Template 6: Remove Nth Node from End

```python
def remove_nth_from_end(head: ListNode, n: int) -> Optional[ListNode]:
    """
    Template for removing the nth node from end.
    Uses fast/slow pointer separation.
    Time: O(n), Space: O(1)
    """
    dummy = ListNode(0)
    dummy.next = head
    
    slow, fast = dummy, dummy
    
    # Move fast n+1 steps ahead
    for _ in range(n + 1):
        fast = fast.next
    
    # Move both until fast reaches end
    while fast:
        slow = slow.next
        fast = fast.next
    
    # Remove the node
    slow.next = slow.next.next
    return dummy.next
```

---

## When to Use

Use the Fast & Slow Pointers algorithm when you need to solve problems involving:

- **Cycle Detection**: Detecting whether a linked list or sequence has a cycle
- **Finding Middle Element**: Locating the middle of a linked list in one pass
- **Happy Number Detection**: Determining if a number eventually reaches 1
- **Circular Array Problems**: Finding duplicates in circular arrays
- **Linked List Manipulation**: Removing cycles, finding cycle start points

### Comparison with Alternatives

| Technique | Time | Space | Best For |
|-----------|------|-------|----------|
| **Fast & Slow Pointers** | O(n) | O(1) | Cycle detection, middle finding |
| **Hash Set** | O(n) | O(n) | When you need path tracking |
| **Brute Force** | O(n²) | O(1) | Not recommended |
| **Two-pass** | O(n) | O(1) | When length is known |

### When to Choose Fast & Slow Pointers

- ✅ You need O(1) space complexity
- ✅ You're detecting cycle existence
- ✅ Finding the middle element
- ✅ Working with implicit linked structures

### When NOT to Use

- ❌ You need to track the actual path taken
- ❌ You're working with tree/graph structures without "next" pointers
- ❌ The problem requires identifying all nodes in a cycle

---

## Algorithm Explanation

### Core Concept

The fundamental insight is based on relative speed and modular arithmetic. When two pointers move at different speeds through a cycle, the faster pointer will eventually "lap" the slower pointer because the difference in their positions decreases by one in each iteration.

### How It Works

#### Phase 1: Detect Cycle
1. Initialize both pointers at the start
2. Slow pointer moves one step at a time
3. Fast pointer moves two steps at a time
4. If fast pointer catches up to slow pointer → **cycle exists**
5. If fast pointer reaches end (null) → **no cycle**

#### Phase 2: Find Cycle Start (Optional)
Once a cycle is detected:
1. Reset one pointer to the head
2. Move both pointers one step at a time
3. Where they meet is the cycle start node
4. **Mathematical proof**: Distance from head to cycle start equals distance from meeting point to cycle start

### Visual Representation

```
Linked List with Cycle:  1 → 2 → 3 → 4 → 5
                              ↑         ↓
                              ←←←←←←←←←←

Iteration 0:  Slow=1, Fast=1
Iteration 1:  Slow=2, Fast=3
Iteration 2:  Slow=3, Fast=5
Iteration 3:  Slow=4, Fast=2 (enters cycle)
Iteration 4:  Slow=5, Fast=4
Iteration 5:  Slow=1, Fast=3
Iteration 6:  Slow=2, Fast=5
Iteration 7:  Slow=3, Fast=2 ← THEY MEET! Cycle detected!
```

### Why It Works - Mathematical Proof

In a cyclic list with cycle length λ:
- Let μ = distance from head to cycle start
- Let d = distance from cycle start to meeting point
- After μ iterations, slow enters the cycle at position 0
- Fast is already in the cycle at position (μ mod λ)
- Relative distance between them: λ - (μ mod λ)
- Each iteration reduces this by 1
- They must meet within at most λ iterations

For finding cycle start:
- Slow traveled: μ + d steps to meeting point
- Fast traveled: μ + d + kλ steps (k extra laps)
- Since fast = 2 × slow: μ + d + kλ = 2(μ + d)
- Simplifying: μ = kλ - d
- Therefore, from meeting point, traveling μ more steps reaches cycle start

### Limitations

- **Only works for linear traversal**: Cannot detect cycles in graphs with branching
- **Single cycle assumption**: May not work cleanly with multiple cycles
- **Requires pointer access**: Needs ability to traverse via "next" pointers
- **Cannot identify all cycle nodes**: Only detects existence and start point

---

## Practice Problems

### Problem 1: Linked List Cycle

**Problem:** [LeetCode 141 - Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)

**Description:** Given the head of a linked list, determine if the linked list has a cycle in it.

**How to Apply:**
- Initialize both pointers at head
- Move slow by 1, fast by 2
- If they meet → cycle exists
- If fast reaches null → no cycle

---

### Problem 2: Linked List Cycle II

**Problem:** [LeetCode 142 - Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/)

**Description:** Given the head of a linked list, return the node where the cycle begins. If there is no cycle, return null.

**How to Apply:**
- Phase 1: Detect cycle using standard algorithm
- Phase 2: Reset slow to head, keep fast at meeting point
- Move both by 1 until they meet again
- Meeting point = cycle start

---

### Problem 3: Happy Number

**Problem:** [LeetCode 202 - Happy Number](https://leetcode.com/problems/happy-number/)

**Description:** Write an algorithm to determine if a number n is happy. A happy number is a number where repeatedly summing squares of digits eventually reaches 1.

**How to Apply:**
- Treat the digit transformation as "next pointer"
- Use Floyd's algorithm to detect cycle
- If ends at 1 → happy
- If enters cycle without 1 → not happy

---

### Problem 4: Find the Duplicate Number

**Problem:** [LeetCode 287 - Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/)

**Description:** Given an array of integers nums containing (n + 1) integers where each integer is in the range [1, n] inclusive, find the duplicate number.

**How to Apply:**
- Treat array as linked list: index i → nums[i]
- Duplicate creates a cycle
- Use cycle detection to find duplicate
- Value range ensures valid indices

---

### Problem 5: Middle of the Linked List

**Problem:** [LeetCode 876 - Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list/)

**Description:** Given the head of a singly linked list, return the middle node. If there are two middle nodes, return the second middle node.

**How to Apply:**
- Standard 1:2 speed ratio
- When fast reaches end, slow is at middle
- Returns second middle for even-length lists

---

### Problem 6: Remove Nth Node From End of List

**Problem:** [LeetCode 19 - Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)

**Description:** Given the head of a linked list, remove the nth node from the end and return its head.

**How to Apply:**
- Move fast n steps ahead of slow
- Then move both together
- When fast reaches end, slow is at node to delete

---

## Video Tutorial Links

### Fundamentals

- [Floyd's Cycle Detection Algorithm (Take U Forward)](https://www.youtube.com/watch?v=czB7n7omKSM) - Comprehensive introduction
- [Linked List Cycle Detection (NeetCode)](https://www.youtube.com/watch?v=6OrZ4NCAp0U) - Practical implementation
- [Fast & Slow Pointers Pattern (Back to Back SWE)](https://www.youtube.com/watch?v=6GwzqWd6Lss) - Pattern explanation

### Advanced Applications

- [Finding Cycle Start (WilliamFiset)](https://www.youtube.com/watch?v=zbozWoMgKW0) - Mathematical proof
- [Happy Number Problem](https://www.youtube.com/watch?v=pkHsk1L-p8Q) - Application to number theory
- [Find Duplicate Number (Cycle Detection)](https://www.youtube.com/watch?v=wjYnzkAhcNk) - Array as linked list

---

## Follow-up Questions

### Q1: Can Fast & Slow Pointers be used for arrays instead of linked lists?

**Answer:** Yes! The technique works on any data structure where you can define a "next" relationship:
- **Arrays**: Treat index i as pointing to nums[i]
- **Strings**: Use transformation functions (like happy number)
- **Numbers**: Use digit manipulation as "next" pointer

This is exactly how the "Find Duplicate Number" problem works - treating the array indices as pointers.

---

### Q2: What if the fast pointer moves more than 2 steps?

**Answer:** It can, but there are tradeoffs:
- **Speed 3**: Still O(n) but may meet faster
- **General case**: Works for any speed difference
- **Speed 2 is optimal**: Minimal iterations while guaranteeing meeting if cycle exists

---

### Q3: How do you find the length of the cycle?

**Answer:** Two approaches:
1. **From meeting point**: Count nodes until you return to start
2. **Mathematical**: λ = 2d - d = d (distance traveled by slow equals cycle length)
3. **Simple**: After finding cycle start, traverse until you return to start, counting nodes

---

### Q4: Can this technique detect multiple cycles?

**Answer:** The standard algorithm assumes a single cycle. For multiple cycles:
- Would need additional tracking
- Not a common interview problem
- Consider graph algorithms for complex cycle detection

---

### Q5: Why does the two-pointer technique find the cycle start?

**Answer:** Mathematical proof:
- Let μ = distance from head to cycle start
- Let λ = cycle length
- Let d = distance from cycle start to meeting point
- Slow travels: μ + d steps
- Fast travels: μ + d + kλ (for some k)
- Since fast = 2 × slow: μ + d + kλ = 2(μ + d)
- Therefore: μ = kλ - d
- Distance from head to cycle start equals distance from meeting to cycle start

---

## Summary

The Fast & Slow Pointers technique (Floyd's Cycle Detection Algorithm) is an elegant **O(n) time, O(1) space** solution for detecting cycles and finding middle elements. Key takeaways:

- **Elegant cycle detection**: No extra memory needed
- **Two-phase approach**: First detect cycle, then find start
- **Versatile applications**: Works beyond linked lists
- **Mathematical foundation**: Proven correctness
- **Interview favorite**: Frequently asked in technical interviews

When to use:
- ✅ Cycle detection in linked lists
- ✅ Finding middle element in one pass
- ✅ Happy number problems
- ✅ Finding duplicates in arrays with constraints
- ✅ Palindrome linked list problems

This technique is essential for solving linked list problems efficiently and is a fundamental pattern in competitive programming and technical interviews.
