# Detect Cycle (Floyd's Tortoise and Hare)

## Category
Linked List

## Description

Floyd's Tortoise and Hare algorithm (also known as cycle detection) is an efficient algorithm to detect if a linked list has a cycle. It's named after the two pointers that move at different speeds - like the fabled race between a tortoise and a hare. This algorithm is a fundamental technique in computer science for detecting cycles in linked lists and other data structures with **O(n) time** and **O(1) space** complexity.

The algorithm is particularly valuable because it achieves optimal space complexity without modifying the original data structure, making it ideal for memory-constrained environments and immutable data scenarios.

---

## Concepts

The Floyd's algorithm is built on several fundamental concepts that make it powerful for cycle detection.

### 1. Relative Motion Principle

When two pointers move at different speeds through a sequence:

| Pointer | Speed | Steps per Iteration | Role |
|---------|-------|---------------------|------|
| **Tortoise (Slow)** | 1x | 1 step | Baseline traversal |
| **Hare (Fast)** | 2x | 2 steps | Cycle detection |

The key insight: In a cyclic sequence, the faster pointer will eventually catch up to the slower pointer from behind.

### 2. Cycle Detection Mechanics

```
Mathematical Foundation:
- Let C = cycle length
- Let μ = distance from start to cycle entrance
- Let d = distance from entrance to meeting point
- 
- Slow travels: μ + d steps to reach meeting point
- Fast travels: 2(μ + d) steps = μ + d + kC (k extra laps)
- Therefore: μ + d = kC
- From meeting point, moving μ steps reaches cycle start
```

### 3. Two-Phase Algorithm Structure

| Phase | Purpose | Operation | Result |
|-------|---------|-----------|--------|
| **Phase 1** | Detect cycle | Move fast 2x, slow 1x | Meeting point or null |
| **Phase 2** | Find start | Move both 1x from meeting | Cycle entrance node |

### 4. Invariants

Properties that remain true throughout execution:

- **Non-cycle path**: If fast reaches null, no cycle exists
- **Cycle exists**: Fast and slow must meet within cycle length iterations
- **Meeting point**: Always within the cycle, never on the pre-cycle path

---

## Frameworks

Structured approaches for solving cycle detection problems.

### Framework 1: Basic Cycle Detection Template

```
┌─────────────────────────────────────────────────────────┐
│  BASIC CYCLE DETECTION FRAMEWORK                          │
├─────────────────────────────────────────────────────────┤
│  1. Edge case: If head is None or head.next is None      │
│     → Return False (no cycle possible)                   │
│                                                           │
│  2. Initialize: tortoise = head, hare = head             │
│                                                           │
│  3. While hare and hare.next exist:                      │
│     a. tortoise = tortoise.next (move 1 step)            │
│     b. hare = hare.next.next (move 2 steps)              │
│     c. If tortoise == hare: return True (cycle found)    │
│                                                           │
│  4. Loop ended → hare reached null                       │
│     → Return False (no cycle)                            │
└─────────────────────────────────────────────────────────┘
```

**When to use**: Simple cycle detection without needing the start position.

### Framework 2: Complete Cycle Analysis Template

```
┌─────────────────────────────────────────────────────────┐
│  COMPLETE CYCLE ANALYSIS FRAMEWORK                        │
├─────────────────────────────────────────────────────────┤
│  Phase 1: Detect if cycle exists                        │
│  1. Find meeting point using basic detection             │
│  2. If no meeting point, return (no cycle, no start)    │
│                                                           │
│  Phase 2: Find cycle start                              │
│  1. Reset tortoise to head                              │
│  2. Keep hare at meeting point                          │
│  3. Move both one step at a time                        │
│  4. When they meet again → that's cycle start           │
│                                                           │
│  Phase 3: Calculate cycle length (optional)             │
│  1. From cycle start, count nodes until return          │
│  2. Store count as cycle length                         │
└─────────────────────────────────────────────────────────┘
```

**When to use**: When you need both cycle detection and the exact entry point.

### Framework 3: Alternative Data Structures Template

```
┌─────────────────────────────────────────────────────────┐
│  ALTERNATIVE STRUCTURES FRAMEWORK                         │
├─────────────────────────────────────────────────────────┤
│  For Arrays (Find Duplicate):                           │
│  1. Treat array as linked list: index → array[index]    │
│  2. Apply standard Floyd's algorithm                    │
│  3. Cycle start = duplicate value                       │
│                                                           │
│  For Number Sequences (Happy Number):                   │
│  1. Define next(num) = sum of squared digits             │
│  2. Apply standard Floyd's algorithm                    │
│  3. If cycle includes 1 → happy number                  │
│                                                           │
│  For Circular Arrays:                                   │
│  1. next(i) = (i + array[i]) % n                        │
│  2. Apply standard Floyd's algorithm                    │
└─────────────────────────────────────────────────────────┘
```

**When to use**: When applying cycle detection to non-linked-list structures.

---

## Forms

Different manifestations of the cycle detection pattern.

### Form 1: Linked List Cycle Detection

The classic application - detecting cycles in singly linked lists.

| Scenario | Detection Method | Time | Space |
|----------|------------------|------|-------|
| **Simple cycle** | Tortoise & Hare | O(n) | O(1) |
| **Self-loop** | Single node.next == node | O(1) | O(1) |
| **Multiple cycles** | Standard algorithm finds first | O(n) | O(1) |
| **No cycle** | Fast reaches null | O(n) | O(1) |

### Form 2: Array as Linked List

Treat array indices as pointers to create an implicit linked list.

```
Array: [1, 3, 4, 2, 2]
       ↓  ↓  ↓  ↓  ↓
Next:  1  3  4  2  2

Path: 0 → 1 → 3 → 2 → 4 → 2 (cycle at index 2, value 4)
Duplicate = value at cycle start = 2
```

**Applications**: Finding duplicate, finding missing number, circular array problems.

### Form 3: Number Transformation Sequences

Use a mathematical transformation as the "next" operation.

```
Happy Number Example:
19 → 82 → 68 → 100 → 1 (happy, terminates)
2 → 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4 (cycle, not happy)

The sequence either:
1. Reaches 1 (terminates)
2. Enters a cycle (not happy)
```

**Applications**: Happy numbers, digit manipulation problems.

### Form 4: Circular Array Loop

Detect valid cycles in circular arrays with direction constraints.

```
Conditions for valid loop:
1. All elements in cycle same direction (all + or all -)
2. Cycle length > 1
3. Not stuck at single index

Example: [2, -1, 1, 2, 2]
- Forward path: 0 → 2 → 3 → 0 (valid cycle)
```

**Applications**: Circular array loop detection (LeetCode 457).

### Form 5: Graph Edge Cases

Special considerations for different graph types.

| Graph Type | Cycle Detection | Notes |
|------------|-----------------|-------|
| **Undirected** | Union-Find or DFS preferred | Floyd's not directly applicable |
| **Directed (linked list)** | Floyd's optimal | Natural fit |
| **Directed (general)** | DFS with state tracking | Floyd's limited |
| **Multigraph** | Standard Floyd's works | Multiple edges between nodes |

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Hash Set Alternative

When O(n) space is acceptable and you need simplicity:

```python
def has_cycle_hash_set(head: ListNode) -> bool:
    """
    Alternative using hash set - O(n) space.
    Simpler but uses more memory.
    """
    seen = set()
    current = head
    
    while current:
        if current in seen:
            return True
        seen.add(current)
        current = current.next
    
    return False
```

### Tactic 2: Cycle Length Calculation

Once cycle start is found:

```python
def cycle_length(head: ListNode) -> int:
    """
    Calculate the length of the cycle.
    Must find cycle start first.
    """
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

### Tactic 3: Remove Cycle

Break a detected cycle:

```python
def remove_cycle(head: ListNode) -> ListNode:
    """
    Remove cycle by breaking the last node's link.
    """
    start = find_cycle_start(head)
    if not start:
        return head
    
    # Find the last node in the cycle
    current = start
    while current.next != start:
        current = current.next
    
    # Break the cycle
    current.next = None
    return head
```

### Tactic 4: First Node in Cycle

Variant that finds the first node (for problems requiring it):

```python
def first_node_in_cycle(head: ListNode) -> ListNode:
    """
    Find the first node that is part of a cycle.
    Alternative interpretation of cycle start.
    """
    if not head or not head.next:
        return None
    
    tortoise, hare = head, head
    
    # Phase 1: Find meeting point
    while hare and hare.next:
        tortoise = tortoise.next
        hare = hare.next.next
        if tortoise == hare:
            break
    
    if not hare or not hare.next:
        return None
    
    # Phase 2: Find entry point
    tortoise = head
    while tortoise != hare:
        tortoise = tortoise.next
        hare = hare.next
    
    return tortoise
```

### Tactic 5: Count Nodes Before Cycle

Calculate the distance from head to cycle start:

```python
def nodes_before_cycle(head: ListNode) -> int:
    """
    Count nodes before the cycle starts.
    """
    if not head:
        return 0
    
    cycle_start = find_cycle_start(head)
    if not cycle_start:
        return count_nodes(head)  # No cycle, all nodes are "before"
    
    count = 0
    current = head
    while current != cycle_start:
        count += 1
        current = current.next
    
    return count

def count_nodes(head: ListNode) -> int:
    """Helper to count nodes in a non-cyclic list."""
    count = 0
    current = head
    while current:
        count += 1
        current = current.next
    return count
```

### Tactic 6: Early Termination Optimization

Optimization for known constraints:

```python
def has_cycle_optimized(head: ListNode, max_iterations: int = 10000) -> bool:
    """
    Cycle detection with early termination.
    Useful when list length is bounded.
    """
    if not head or not head.next:
        return False
    
    tortoise, hare = head, head
    iterations = 0
    
    while hare and hare.next and iterations < max_iterations:
        tortoise = tortoise.next
        hare = hare.next.next
        iterations += 1
        
        if tortoise == hare:
            return True
    
    return False
```

---

## Python Templates

### Template 1: Basic Cycle Detection

```python
from typing import Optional

class ListNode:
    def __init__(self, val: int = 0, next: Optional['ListNode'] = None):
        self.val = val
        self.next = next

def has_cycle(head: Optional[ListNode]) -> bool:
    """
    Template: Detect if a linked list has a cycle.
    Time: O(n), Space: O(1)
    """
    if not head or not head.next:
        return False
    
    tortoise, hare = head, head
    
    while hare and hare.next:
        tortoise = tortoise.next        # Move 1 step
        hare = hare.next.next           # Move 2 steps
        
        if tortoise == hare:            # They met - cycle exists!
            return True
    
    return False  # No cycle found
```

### Template 2: Find Cycle Start

```python
def detect_cycle_start(head: Optional[ListNode]) -> Optional[ListNode]:
    """
    Template: Find the starting node of the cycle.
    Uses two-phase Floyd's algorithm.
    Time: O(n), Space: O(1)
    """
    if not head or not head.next:
        return None
    
    # Phase 1: Find intersection point
    tortoise, hare = head, head
    
    while hare and hare.next:
        tortoise = tortoise.next
        hare = hare.next.next
        
        if tortoise == hare:
            break
    
    # No cycle found
    if not hare or not hare.next:
        return None
    
    # Phase 2: Find cycle start
    # Move both pointers one step at a time
    # They will meet at the cycle start
    tortoise = head
    while tortoise != hare:
        tortoise = tortoise.next
        hare = hare.next
    
    return tortoise
```

### Template 3: Find Duplicate in Array (Cycle Detection)

```python
def find_duplicate(nums: list[int]) -> int:
    """
    Template: Find duplicate in array [1..n] using cycle detection.
    Treats array as linked list: index i points to nums[i].
    Time: O(n), Space: O(1)
    """
    # Phase 1: Find intersection
    tortoise, hare = nums[0], nums[0]
    
    while True:
        tortoise = nums[tortoise]           # Move 1 step
        hare = nums[nums[hare]]             # Move 2 steps
        if tortoise == hare:
            break
    
    # Phase 2: Find cycle start (the duplicate)
    tortoise = nums[0]
    while tortoise != hare:
        tortoise = nums[tortoise]           # Move 1 step
        hare = nums[hare]                   # Move 1 step
    
    return tortoise
```

### Template 4: Happy Number

```python
def is_happy(n: int) -> bool:
    """
    Template: Determine if a number is happy using cycle detection.
    Time: O(log n), Space: O(1)
    """
    def get_next(num: int) -> int:
        """Calculate sum of squares of digits."""
        total = 0
        while num > 0:
            digit = num % 10
            total += digit * digit
            num //= 10
        return total
    
    if n <= 0:
        return False
    
    tortoise, hare = n, get_next(n)
    
    while hare != 1 and tortoise != hare:
        tortoise = get_next(tortoise)       # Move 1 step
        hare = get_next(get_next(hare))     # Move 2 steps
    
    return hare == 1
```

### Template 5: Circular Array Loop

```python
def circular_array_loop(nums: list[int]) -> bool:
    """
    Template: Detect circular array loop with direction constraint.
    Time: O(n), Space: O(1)
    """
    n = len(nums)
    if n < 2:
        return False
    
    def next_idx(i: int) -> int:
        """Calculate next index with wrap-around."""
        return ((i + nums[i]) % n + n) % n
    
    def is_same_direction(i: int, j: int) -> bool:
        """Check if both indices move in same direction."""
        return nums[i] * nums[j] > 0
    
    for i in range(n):
        if nums[i] == 0:
            continue
        
        tortoise, hare = i, next_idx(i)
        
        # Move while maintaining same direction
        while is_same_direction(tortoise, hare) and \
              is_same_direction(tortoise, next_idx(hare)):
            if tortoise == hare:
                # Check if it's a single element loop
                if tortoise == next_idx(tortoise):
                    break
                return True
            
            tortoise = next_idx(tortoise)
            hare = next_idx(next_idx(hare))
        
        # Mark visited by setting to 0
        j = i
        while nums[j] * nums[next_idx(j)] > 0:
            temp = j
            j = next_idx(j)
            nums[temp] = 0
    
    return False
```

### Template 6: Cycle Length Calculation

```python
def get_cycle_length(head: Optional[ListNode]) -> int:
    """
    Template: Calculate the length of a cycle.
    Returns 0 if no cycle exists.
    Time: O(n), Space: O(1)
    """
    if not head or not head.next:
        return 0
    
    # Find cycle start
    start = detect_cycle_start(head)
    if not start:
        return 0
    
    # Count nodes in cycle
    length = 1
    current = start.next
    
    while current != start:
        length += 1
        current = current.next
    
    return length
```

---

## When to Use

Use Floyd's Cycle Detection algorithm when you need to solve problems involving:

- **Linked List Cycle Detection**: Determining if a linked list contains a cycle
- **Finding Cycle Start**: Locating where a cycle begins
- **Finding Duplicate Numbers**: In arrays with specific constraints
- **Happy Number Problems**: Detecting cycles in number transformations
- **Circular Array Problems**: Valid loop detection with constraints

### Comparison with Alternatives

| Algorithm | Time | Space | Can Find Start | Best For |
|-----------|------|-------|----------------|----------|
| **Floyd's (Tortoise & Hare)** | O(n) | O(1) | ✅ Yes | Linked lists, O(1) space |
| **Hash Set** | O(n) | O(n) | ❌ No | Simplicity, path tracking |
| **Mark Visited** | O(n) | O(1) | ❌ No | When modification allowed |
| **Brute Force** | O(n²) | O(1) | ❌ No | Never (education only) |

### When to Choose Floyd's Algorithm

- ✅ You need O(1) space complexity
- ✅ You cannot modify the linked list
- ✅ You need to find where the cycle starts
- ✅ Memory is constrained
- ✅ Working with implicit linked structures (arrays, number sequences)

### When NOT to Use

- ❌ You need to track the actual path taken (use Hash Set)
- ❌ Space is not a concern and simplicity is preferred
- ❌ Modifying the list is acceptable (use marking approach)

---

## Algorithm Explanation

### Core Concept

The key insight is that if there is a cycle, a faster-moving pointer will eventually "lap" a slower-moving pointer. This is analogous to two runners on a circular track - the faster runner will eventually catch up to the slower runner.

### How It Works

#### Phase 1: Detect if Cycle Exists

1. Initialize both pointers at the head of the list
2. Move tortoise (slow) by 1 step
3. Move hare (fast) by 2 steps
4. If they ever meet, a cycle exists
5. If hare reaches null, there is no cycle

#### Phase 2: Find Cycle Start (Optional)

Once a cycle is detected:
1. Reset tortoise to the head
2. Keep hare at the meeting point
3. Move both pointers one step at a time
4. Where they meet is the start of the cycle

### Mathematical Proof

**Why do they meet in Phase 1?**

In a cycle of length C:
1. After tortoise enters the cycle, hare is at most C-1 steps behind
2. Since hare moves 1 extra step per iteration, they close the gap by 1 each step
3. They must meet within C iterations

**Why does Phase 2 find the cycle start?**

Let:
- a = distance from head to cycle start
- b = distance from cycle start to meeting point
- C = cycle length

From Phase 1:
- Tortoise traveled: a + b steps
- Hare traveled: a + b + kC steps (k extra laps)
- Since hare moves 2x speed: 2(a + b) = a + b + kC
- Simplifying: a + b = kC, therefore a = kC - b

In Phase 2:
- Tortoise starts at head, travels a steps to cycle start
- Hare starts at meeting point, travels a steps = kC - b steps
- From meeting point, kC - b steps = (k-1)C + (C - b) steps
- This brings hare back to cycle start
- Both meet at cycle start

### Visual Representation

```
List: 3 → 2 → 0 → -4
            ↑         |
            |_________|

Step 0: Tortoise=3, Hare=3
Step 1: Tortoise=2, Hare=0
Step 2: Tortoise=0, Hare=2 (they met!)
Step 3: Reset Tortoise to 3, keep Hare at 2
Step 4: Tortoise=2, Hare=2 (meeting point = cycle start!)
```

### Key Properties

- **Time Complexity**: O(n) - linear time
- **Space Complexity**: O(1) - constant space
- **No modifications needed**: Doesn't modify the original list
- **Optimal**: Proven that O(1) space solution must use this approach

### Limitations

- **Only works for linear traversal**: Cannot detect cycles in general graphs
- **Single cycle assumption**: Finds the first cycle encountered
- **Requires "next" pointer**: Needs ability to traverse sequentially
- **Cannot identify all cycle nodes**: Only detects existence and start

---

## Practice Problems

### Problem 1: Linked List Cycle

**Problem:** [LeetCode 141 - Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)

**Description:** Given a linked list, determine if it has a cycle in it.

**How to Apply:**
- Use tortoise and hare starting from head
- Move slow by 1, fast by 2
- If they meet → cycle exists
- This is the classic application of Floyd's algorithm

---

### Problem 2: Linked List Cycle II

**Problem:** [LeetCode 142 - Linked List Cycle II](https://leetcode.com/problems/linked-list-cycle-ii/)

**Description:** Given a linked list, return the node where the cycle begins. If there is no cycle, return null.

**How to Apply:**
- Phase 1: Detect cycle using standard Floyd's algorithm
- Phase 2: Reset slow to head, keep fast at meeting point
- Move both one step at a time
- Meeting point = cycle start (proven by: a + b = C)

---

### Problem 3: Happy Number

**Problem:** [LeetCode 202 - Happy Number](https://leetcode.com/problems/happy-number/)

**Description:** Write an algorithm to determine if a number n is happy. A happy number is a number where repeatedly summing squares of digits eventually reaches 1.

**How to Apply:**
- Create a function that transforms a number by summing squares of its digits
- This creates a sequence that either reaches 1 or enters a cycle
- Use Floyd's algorithm to detect if the sequence enters a cycle
- If cycle reaches 1, it's happy; otherwise, it's not

---

### Problem 4: Find the Duplicate Number

**Problem:** [LeetCode 287 - Find the Duplicate Number](https://leetcode.com/problems/find-the-duplicate-number/)

**Description:** Given an array of integers nums containing n + 1 integers where each integer is in the range [1, n], find the duplicate number.

**How to Apply:**
- Treat array as linked list: index i points to nums[i]
- Duplicate creates a cycle (multiple indices point to same value)
- Use Floyd's algorithm to find the cycle entrance
- Cycle entrance = duplicate number

---

### Problem 5: Circular Array Loop

**Problem:** [LeetCode 457 - Circular Array Loop](https://leetcode.com/problems/circular-array-loop/)

**Description:** You are given a circular array nums of positive integers. Determine if there is a cycle that meets certain conditions (same direction, length > 1).

**How to Apply:**
- Treat each index as a node
- Next node = (i + nums[i]) % n
- Use Floyd's to detect if there's a valid cycle
- Check additional conditions: all forward or all backward

---

### Problem 6: First Missing Positive

**Problem:** [LeetCode 41 - First Missing Positive](https://leetcode.com/problems/first-missing-positive/)

**Description:** Given an unsorted integer array nums, return the smallest missing positive integer.

**How to Apply:**
- Related concept: array indices as implicit pointers
- Place each number at its correct index (cycle detection variant)
- First index with wrong number = answer

---

## Video Tutorial Links

### Fundamentals

- [Floyd's Cycle Detection Algorithm (Take U Forward)](https://www.youtube.com/watch?v=zbozWoMgKW0) - Comprehensive introduction
- [Linked List Cycle Detection (NeetCode)](https://www.youtube.com/watch?v=oO0M3cJeaQo) - Practical implementation
- [Detect Cycle in Linked List (WilliamFiset)](https://www.youtube.com/watch?v=xz0E7iS8KfE) - Visual explanation

### Advanced Topics

- [Finding Cycle Start (Take U Forward)](https://www.youtube.com/watch?v=iZJ4jT2SGaA) - Mathematical proof explained
- [Floyd's Algorithm for Happy Numbers](https://www.youtube.com/watch?v=ckQq1Za75I0) - Application variations
- [Cycle Detection in Arrays](https://www.youtube.com/watch?v=6U3T4dXv1Ng) - Array as linked list concept

---

## Follow-up Questions

### Q1: Why does Floyd's algorithm work mathematically?

**Answer:** In a cycle of length C, after the slow pointer enters, the fast pointer is at most C-1 steps behind. Since fast moves 1 extra step per iteration relative to slow, they must meet within C iterations.

Let:
- a = distance from head to cycle start
- b = distance from cycle start to meeting point
- Slow travels: a + b steps
- Fast travels: a + b + kC steps (k extra laps)
- Since fast = 2 × slow: a + b + kC = 2(a + b)
- Therefore: a + b = kC, meaning a = kC - b
- From meeting point, traveling a more steps returns to cycle start

---

### Q2: Can Floyd's algorithm be used for doubly linked lists?

**Answer:** Yes, but it's often unnecessary for simple cycle detection since you can traverse backwards. However, Floyd's algorithm is still useful when:
- You need O(1) space
- You cannot modify the list
- You need to find the exact cycle start position
- Backward traversal is expensive or disallowed

---

### Q3: What happens if the fast pointer moves more than 2 steps?

**Answer:** The algorithm still works as long as fast moves faster than slow:
- Moving more than 2 steps may detect the cycle faster in some cases
- The mathematical guarantee still holds (they'll meet eventually)
- However, finding the cycle start becomes more complex with different speed ratios
- Speed 2 is optimal for balanced performance and simplicity

---

### Q4: Can this algorithm detect multiple cycles?

**Answer:** No, Floyd's algorithm detects if there is *any* cycle, not how many. Once the first cycle is detected, it returns. Finding all cycles would require:
- Different approaches like DFS or Union-Find
- Marking visited nodes
- Graph traversal algorithms

---

### Q5: How does this compare to using a hash set?

**Answer:**

| Aspect | Floyd's Algorithm | Hash Set |
|--------|-------------------|----------|
| Time | O(n) | O(n) |
| Space | O(1) | O(n) |
| Implementation | Slightly complex | Simple |
| Path tracking | No | Yes |
| Finding start | Yes | No |

**Choose Hash Set** when:
- Space is not a concern
- You need to track the actual path
- Simplicity is preferred

**Choose Floyd's** when:
- Space is constrained
- You need O(1) space
- You need to find cycle start

---

## Summary

Floyd's Tortoise and Hare algorithm is a classic technique for cycle detection in linked lists and sequences. Key takeaways:

- **Optimal Space**: Achieves O(1) space - the theoretical minimum
- **Two Phases**: First detect cycle, then find its starting point
- **Mathematical Guarantee**: Proven to work within n iterations
- **Non-destructive**: Doesn't modify the original list
- **Versatile**: Applies to linked lists, arrays, number sequences

When to use:
- ✅ Need O(1) space complexity
- ✅ Cannot modify the linked list
- ✅ Need to find cycle start location
- ✅ Working with implicit linked structures

When NOT to use:
- ❌ Need to track the actual path taken (use Hash Set)
- ❌ For doubly linked lists with simple traversal needs
- ❌ When simplicity outweighs space optimization

This algorithm is essential for technical interviews and competitive programming, forming the foundation for understanding cycle detection in various data structures.
