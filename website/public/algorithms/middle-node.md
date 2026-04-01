# Middle Node

## Category
Linked List

## Description

Finding the middle node of a linked list is a fundamental operation in linked list manipulation. The **fast and slow pointer** technique (also known as "tortoise and hare") provides an elegant O(n) time and O(1) space solution. This technique is widely used in competitive programming and technical interviews for its simplicity and efficiency.

The key insight is that by moving two pointers at different speeds through the list, we can find the middle node in a single pass without knowing the list's length in advance. This same technique also forms the basis for cycle detection and other linked list algorithms.

---

## Concepts

The Fast & Slow Pointers technique for finding the middle is built on several mathematical and algorithmic principles.

### 1. Relative Speed Principle

When two pointers move at different speeds, their relative positions reveal structural information about the list:

| Pointer | Speed | Steps per Iteration | Position After n Iterations |
|---------|-------|---------------------|------------------------------|
| **Slow** | 1x | 1 | n steps from start |
| **Fast** | 2x | 2 | 2n steps from start |

When fast reaches the end (at position ~n), slow is at position n/2 - the middle.

### 2. Even vs Odd Length Handling

The algorithm naturally handles both cases:

```
Odd length (5 nodes):
1 → 2 → 3 → 4 → 5
        ↑
      Middle (3)

Even length (4 nodes):
1 → 2 → 3 → 4
        ↑
   Second middle (3)
   
Variation for first middle:
1 → 2 → 3 → 4
    ↑
  First middle (2)
```

### 3. Termination Conditions

| List Length | Fast Pointer State | Slow Position | Middle Returned |
|-------------|-------------------|---------------|-----------------|
| **Odd** | fast is None | Exact middle | Middle node |
| **Even (standard)** | fast.next is None | Second of two | Second middle |
| **Even (first)** | fast.next.next is None | First of two | First middle |

### 4. Mathematical Foundation

```
Let n = total number of nodes

For odd n (n = 2k + 1):
- Fast makes k iterations, reaches node 2k+1 (last)
- Fast.next is None, loop terminates
- Slow has moved k steps, at node k+1 (middle)

For even n (n = 2k):
- Fast makes k iterations, reaches node 2k (last)
- Fast.next is None, loop terminates  
- Slow has moved k steps, at node k+1 (second middle)
```

---

## Frameworks

Structured approaches for solving middle-finding problems.

### Framework 1: Standard Middle Finding Template

```
┌─────────────────────────────────────────────────────────┐
│  STANDARD MIDDLE FINDING FRAMEWORK                        │
├─────────────────────────────────────────────────────────┤
│  Returns second middle for even-length lists            │
│                                                           │
│  1. Initialize:                                           │
│     - slow = head                                        │
│     - fast = head                                        │
│                                                           │
│  2. While fast is not None AND fast.next is not None:   │
│     a. slow = slow.next        (move 1 step)            │
│     b. fast = fast.next.next   (move 2 steps)           │
│                                                           │
│  3. Return slow                                           │
│     - For odd: exact middle                              │
│     - For even: second of two middle nodes               │
└─────────────────────────────────────────────────────────┘
```

**When to use**: Standard middle finding (LeetCode 876 default behavior).

### Framework 2: First Middle Finding Template

```
┌─────────────────────────────────────────────────────────┐
│  FIRST MIDDLE FINDING FRAMEWORK                           │
├─────────────────────────────────────────────────────────┤
│  Returns first middle for even-length lists              │
│                                                           │
│  1. Initialize:                                           │
│     - slow = head                                        │
│     - fast = head                                        │
│                                                           │
│  2. While fast.next is not None AND                      │
│           fast.next.next is not None:                   │
│     a. slow = slow.next        (move 1 step)            │
│     b. fast = fast.next.next   (move 2 steps)           │
│                                                           │
│  3. Return slow                                           │
│     - For odd: exact middle                              │
│     - For even: first of two middle nodes                │
└─────────────────────────────────────────────────────────┘
```

**When to use**: When you need the first of two middle nodes for even-length lists.

### Framework 3: Nth Node from End Template

```
┌─────────────────────────────────────────────────────────┐
│  NTH NODE FROM END FRAMEWORK                              │
├─────────────────────────────────────────────────────────┤
│  Uses pointer separation to find kth from end            │
│                                                           │
│  1. Initialize:                                           │
│     - slow = head                                        │
│     - fast = head                                        │
│                                                           │
│  2. Move fast k steps ahead:                             │
│     - For i from 0 to k-1:                               │
│       → If fast is None, return None (list too short)    │
│       → fast = fast.next                                 │
│                                                           │
│  3. While fast is not None:                              │
│     - slow = slow.next                                   │
│     - fast = fast.next                                   │
│                                                           │
│  4. Return slow (now k nodes from end)                   │
└─────────────────────────────────────────────────────────┘
```

**When to use**: Finding the nth node from the end of a linked list.

---

## Forms

Different manifestations of the middle-finding pattern.

### Form 1: Simple Middle Finding

Standard application - find the middle of a linked list.

| List | Length | Middle (standard) | Middle (first) |
|------|--------|-------------------|----------------|
| [1] | 1 | 1 | 1 |
| [1,2] | 2 | 2 | 1 |
| [1,2,3] | 3 | 2 | 2 |
| [1,2,3,4] | 4 | 3 | 2 |
| [1,2,3,4,5] | 5 | 3 | 3 |

### Form 2: Middle for Palindrome Check

Combined with reversal to check palindrome:

```
Steps:
1. Find middle using fast/slow
2. Reverse second half (starting from middle.next)
3. Compare first half with reversed second half
4. (Optional) Restore the list

Example: 1 → 2 → 3 → 2 → 1
Middle: 3
Reverse second: 1 → 2 → 3 → 1 → 2
Compare: 1,2 with 1,2 → Palindrome!
```

### Form 3: Middle for Merge Sort

Finding middle to split list for merge sort:

```
Merge Sort Steps:
1. Find middle using fast/slow
2. Split list at middle
3. Recursively sort both halves
4. Merge sorted halves

Split: [1,2,3,4,5] → [1,2] and [3,4,5]
              ↑
            Middle
```

### Form 4: Delete Middle Node

Find and delete the middle node:

```
Modification:
1. Use fast/slow to find middle
2. Keep 'prev' pointer one step behind slow
3. When slow is at middle, do: prev.next = slow.next
4. Handle edge cases: 1 or 2 nodes
```

### Form 5: Reorder List

Reorder list using middle as split point:

```
Original: 1 → 2 → 3 → 4 → 5 → 6
Middle: 3 (second middle for even)
Split: [1,2,3] and [4,5,6]
Reverse second: [1,2,3] and [6,5,4]
Merge alternately: 1 → 6 → 2 → 5 → 3 → 4
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: First Middle vs Second Middle

Control which middle to return for even-length lists:

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

### Tactic 2: Delete Middle Node

```python
def delete_middle(head: ListNode) -> ListNode:
    """
    Delete the middle node of a linked list.
    Returns head of modified list.
    """
    if not head or not head.next:
        return None  # 0 or 1 node, nothing to delete
    
    # Use dummy to handle edge cases
    dummy = ListNode(0)
    dummy.next = head
    
    prev, slow, fast = dummy, head, head
    
    while fast and fast.next:
        prev = slow
        slow = slow.next
        fast = fast.next.next
    
    # Delete middle node
    prev.next = slow.next
    
    return dummy.next
```

### Tactic 3: Nth Node from End

```python
def nth_from_end(head: ListNode, n: int) -> ListNode:
    """
    Find nth node from end using two pointers.
    Time: O(n), Space: O(1)
    """
    if not head or n <= 0:
        return None
    
    slow, fast = head, head
    
    # Move fast n steps ahead
    for _ in range(n):
        if not fast:
            return None  # List shorter than n
        fast = fast.next
    
    # Move both until fast reaches end
    while fast:
        slow = slow.next
        fast = fast.next
    
    return slow
```

### Tactic 4: Reorder List (Merge Alternate)

```python
def reorder_list(head: ListNode) -> None:
    """
    Reorder list: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → ...
    """
    if not head or not head.next:
        return
    
    # Find middle
    slow, fast = head, head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    # Reverse second half
    second_half = reverse_list(slow.next)
    slow.next = None  # Split list
    
    # Merge alternately
    first, second = head, second_half
    while second:
        # Save next pointers
        first_next = first.next
        second_next = second.next
        
        # Insert second node after first
        first.next = second
        second.next = first_next
        
        # Advance
        first = first_next
        second = second_next

def reverse_list(head: ListNode) -> ListNode:
    """Helper: reverse linked list."""
    prev, current = None, head
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    return prev
```

### Tactic 5: Two-Pass Alternative (When Length Known)

```python
def find_middle_two_pass(head: ListNode) -> ListNode:
    """
    Alternative: Count nodes first, then traverse to middle.
    Time: O(n), Space: O(1)
    Less efficient but sometimes simpler.
    """
    # First pass: count
    count = 0
    current = head
    while current:
        count += 1
        current = current.next
    
    # Second pass: go to middle
    middle_idx = count // 2
    current = head
    for _ in range(middle_idx):
        current = current.next
    
    return current
```

### Tactic 6: Middle for BST to Sorted List

```python
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def bst_to_sorted_doubly_list(root: TreeNode) -> TreeNode:
    """
    Convert BST to sorted circular doubly-linked list.
    Uses in-order traversal with prev pointer (similar concept).
    """
    if not root:
        return None
    
    # Helper to perform in-order traversal
    def inorder(node):
        nonlocal prev, head
        if not node:
            return
        
        # Left subtree
        inorder(node.left)
        
        # Process current node
        if prev:
            prev.right = node
            node.left = prev
        else:
            head = node  # First node
        prev = node
        
        # Right subtree
        inorder(node.right)
    
    prev, head = None, None
    inorder(root)
    
    # Make circular
    if head and prev:
        head.left = prev
        prev.right = head
    
    return head
```

---

## Python Templates

### Template 1: Standard Middle Finding (Second Middle)

```python
from typing import Optional

class ListNode:
    def __init__(self, val: int = 0, next: Optional['ListNode'] = None):
        self.val = val
        self.next = next

def middle_node(head: Optional[ListNode]) -> Optional[ListNode]:
    """
    Template: Find middle of linked list (second middle for even).
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

### Template 2: First Middle Finding

```python
def middle_node_first(head: Optional[ListNode]) -> Optional[ListNode]:
    """
    Template: Find middle of linked list (first middle for even).
    Time: O(n), Space: O(1)
    """
    if not head:
        return None
    
    slow, fast = head, head
    
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow
```

### Template 3: Nth Node from End

```python
def nth_from_end(head: Optional[ListNode], n: int) -> Optional[ListNode]:
    """
    Template: Find nth node from end.
    Time: O(n), Space: O(1)
    """
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

### Template 4: Delete Middle Node

```python
def delete_middle(head: Optional[ListNode]) -> Optional[ListNode]:
    """
    Template: Delete the middle node of a linked list.
    Time: O(n), Space: O(1)
    """
    if not head or not head.next:
        return None
    
    dummy = ListNode(0)
    dummy.next = head
    
    prev, slow, fast = dummy, head, head
    
    while fast and fast.next:
        prev = slow
        slow = slow.next
        fast = fast.next.next
    
    # Delete slow (middle)
    prev.next = slow.next
    
    return dummy.next
```

### Template 5: Reorder List (Advanced)

```python
def reorder_list(head: Optional[ListNode]) -> None:
    """
    Template: Reorder list: L0 → Ln → L1 → Ln-1 → ...
    Modifies list in-place. Time: O(n), Space: O(1)
    """
    if not head or not head.next:
        return
    
    # Find middle
    slow, fast = head, head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    # Reverse second half
    second = reverse_list(slow.next)
    slow.next = None  # Split
    
    # Merge alternately
    first = head
    while second:
        tmp1, tmp2 = first.next, second.next
        first.next = second
        second.next = tmp1
        first, second = tmp1, tmp2

def reverse_list(head: Optional[ListNode]) -> Optional[ListNode]:
    """Helper: Reverse linked list."""
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev, curr = curr, nxt
    return prev
```

### Template 6: Palindrome Linked List

```python
def is_palindrome(head: Optional[ListNode]) -> bool:
    """
    Template: Check if linked list is palindrome.
    Uses middle finding + reversal.
    Time: O(n), Space: O(1)
    """
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

def reverse_list(head: Optional[ListNode]) -> Optional[ListNode]:
    """Helper: Reverse linked list."""
    prev, curr = None, head
    while curr:
        nxt = curr.next
        curr.next = prev
        prev, curr = curr, nxt
    return prev
```

---

## When to Use

Use the fast and slow pointer technique when you need to solve problems involving:

- **Finding the middle of a linked list** - The primary use case
- **Detecting cycles in a linked list** - Floyd's cycle detection algorithm
- **Finding the nth node from the end** - Two-pointer approach
- **Palindrome linked list verification** - Combining with reversal
- **Linked list reordering problems** - Like reorganizing a list in specific ways

### Comparison with Alternatives

| Method | Time | Space | Notes |
|--------|------|-------|-------|
| **Fast & Slow Pointer** | O(n) | O(1) | Single pass, optimal |
| **Count then traverse** | O(n) | O(1) | Two passes, simpler |
| **Array storage** | O(n) | O(n) | Random access possible |
| **Recursive** | O(n) | O(n) | Stack space |

### When to Choose Fast & Slow Pointer

- ✅ You need O(1) space complexity
- ✅ You want a single-pass solution
- ✅ You're dealing with cycle detection
- ✅ The list length is unknown

### When NOT to Use

- ❌ When you need random access (use array instead)
- ❌ When you need to preserve the original list structure
- ❌ When a two-pass approach is clearer and space isn't critical

---

## Algorithm Explanation

### Core Concept

The fast and slow pointer technique leverages relative speed to find the middle of a linked list. When two pointers traverse a list where one moves twice as fast as the other, the slower pointer will be exactly at the middle when the faster pointer reaches the end.

### How It Works

1. **Initialize two pointers** at the head of the linked list:
   - **Slow pointer**: moves 1 step at a time
   - **Fast pointer**: moves 2 steps at a time

2. **Traverse the list** by moving both pointers simultaneously:
   - In each iteration, slow advances by 1 node
   - In each iteration, fast advances by 2 nodes

3. **Stop when** the fast pointer reaches the end:
   - Either `fast` is `None` (null)
   - Or `fast.next` is `None`

4. **The slow pointer** will now be at the middle node

### Visual Representation

```
List: 1 → 2 → 3 → 4 → 5 → None

Step 0: slow=1, fast=1
Step 1: slow=2, fast=3   (fast moves 2, slow moves 1)
Step 2: slow=3, fast=5   (fast moves 2, slow moves 1)
        fast.next = None → STOP
        Return slow (node 3)
```

For even-length lists (e.g., 4 nodes):
```
List: 1 → 2 → 3 → 4 → None

Step 0: slow=1, fast=1
Step 1: slow=2, fast=3   (fast moves 2, slow moves 1)
Step 2: slow=3, fast=None → fast.next is None, STOP
        Return slow (node 3) - the SECOND middle node
```

### Why This Finds the Middle

When the fast pointer reaches the end, it has traveled exactly twice the distance of the slow pointer. If the list has `n` nodes:
- Fast pointer travels `n` nodes (or `n-1` for even lists)
- Slow pointer travels `n/2` nodes (or `n/2` for even lists)

This means the slow pointer is precisely at position `n/2`, which is the middle.

### Limitations

- **Only works for sequential access**: Requires linked list traversal
- **Even-length ambiguity**: Must choose first or second middle
- **Cannot be parallelized**: Sequential by nature
- **No random access**: Must traverse to find position

---

## Practice Problems

### Problem 1: Middle of the Linked List

**Problem:** [LeetCode 876 - Middle of the Linked List](https://leetcode.com/problems/middle-of-the-linked-list/)

**Description:** Given the head of a singly linked list, return the middle node. If there are two middle nodes, return the second middle node.

**How to Apply:**
- Use the fast and slow pointer approach directly
- This is the canonical problem for this technique
- Time: O(n), Space: O(1)

---

### Problem 2: Delete the Middle Node

**Problem:** [LeetCode 2095 - Delete the Middle Node of a Linked List](https://leetcode.com/problems/delete-the-middle-node-of-a-linked-list/)

**Description:** You are given the head of a linked list. Delete the middle node, and return the head of the modified linked list.

**How to Apply:**
- Use fast and slow to find the middle
- Keep a "previous" pointer one step behind slow
- When slow is at middle, use prev.next = slow.next to delete
- Handle edge cases: 1 or 2 nodes

---

### Problem 3: Palindrome Linked List

**Problem:** [LeetCode 234 - Palindrome Linked List](https://leetcode.com/problems/palindrome-linked-list/)

**Description:** Given the head of a singly linked list, return true if it is a palindrome or false otherwise.

**How to Apply:**
- Find middle using fast/slow pointers
- Reverse second half
- Compare first half with reversed second half
- Optionally restore the list

---

### Problem 4: Linked List Cycle

**Problem:** [LeetCode 141 - Linked List Cycle](https://leetcode.com/problems/linked-list-cycle/)

**Description:** Given head of a linked list, determine if it has a cycle.

**How to Apply:**
- Same fast/slow technique, different stopping condition
- If they meet before fast reaches end → cycle exists
- Related to middle finding but detects cycles instead

---

### Problem 5: Remove Nth Node From End

**Problem:** [LeetCode 19 - Remove Nth Node From End of List](https://leetcode.com/problems/remove-nth-node-from-end-of-list/)

**Description:** Given the head of a linked list, remove the nth node from the end and return its head.

**How to Apply:**
- Move fast n steps ahead of slow
- Then move both together
- When fast reaches end, slow is at node to delete
- Variation of the same two-pointer principle

---

### Problem 6: Reorder List

**Problem:** [LeetCode 143 - Reorder List](https://leetcode.com/problems/reorder-list/)

**Description:** Reorder list to: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → ...

**How to Apply:**
- Find middle using fast/slow
- Split list at middle
- Reverse second half
- Merge two halves alternately
- Combines multiple linked list techniques

---

## Video Tutorial Links

### Fundamentals

- [Middle of Linked List - Fast and Slow Pointer (Take U Forward)](https://www.youtube.com/watch?v=o4bPC1o63M4) - Comprehensive explanation
- [Linked List Middle Element (WilliamFiset)](https://www.youtube.com/watch?v=2L1R3cMyG8k) - Detailed walkthrough
- [Fast and Slow Pointer Technique (NeetCode)](https://www.youtube.com/watch?v=o4bPC1o63M4) - Multiple applications

### Related Problems

- [Delete Middle of Linked List](https://www.youtube.com/watch?v=e9YqxXK3J8s) - Practical variation
- [Palindrome Linked List](https://www.youtube.com/watch?v=yOzX4dR7zWQ) - Using middle + reversal
- [Reorder List](https://www.youtube.com/watch?v=x45G7U62FTg) - Advanced application

---

## Follow-up Questions

### Q1: How do you find the kth node from the end using fast and slow pointers?

**Answer:** 
1. Move the fast pointer k steps ahead of the slow pointer
2. Then move both pointers together until fast reaches the end
3. Slow will be k nodes from the end
4. Time: O(n), Space: O(1)

---

### Q2: What happens if the fast pointer moves 3 steps instead of 2?

**Answer:**
- For finding the middle: You would overshoot and get incorrect results
- For cycle detection: It still works but may take longer
- The key is that fast must move at least 2x faster than slow to guarantee termination
- Other multiples (3, 4, etc.) work for cycle detection but have different characteristics

---

### Q3: Can this technique be applied to arrays or only linked lists?

**Answer:**
- Primarily designed for linked lists due to sequential access
- For arrays, you can simply use indices to simulate pointers
- The concept works but is less useful for arrays since random access is O(1)
- For arrays, you can just use `arr[n/2]` to get the middle

---

### Q4: How do you handle finding the middle in a circular linked list?

**Answer:**
- The algorithm works the same way
- But you need a stopping condition based on cycle detection
- You must detect when you've looped back to the starting point
- Use Floyd's cycle detection combined with middle finding

---

### Q5: What's the difference between returning the first vs second middle for even-length lists?

**Answer:**
- **Standard (second middle)**: Loop condition `while fast and fast.next`
- **First middle**: Loop condition `while fast.next and fast.next.next`
- For list [1,2,3,4]:
  - Second middle returns node 3
  - First middle returns node 2
- The choice depends on problem requirements (LeetCode 876 wants second)

---

## Summary

The fast and slow pointer technique is an elegant solution for finding the middle of a linked list. Key takeaways:

- **Single pass**: O(n) time complexity with just one traversal
- **Constant space**: O(1) space - only two pointers needed
- **Versatile**: Can be adapted for cycle detection, kth-from-end, and more
- **Simple implementation**: Clean and easy to understand

When to use:
- ✅ Finding middle of linked list
- ✅ Detecting cycles (Floyd's algorithm)
- ✅ Finding kth node from end
- ✅ Palindrome verification
- ✅ Reorder list problems

When NOT to use:
- ❌ When you need random access (use array instead)
- ❌ When you need first middle for even lists (modify condition)
- ❌ When a simpler two-pass approach is acceptable

This technique is essential for linked list problems and frequently appears in technical interviews and competitive programming.
