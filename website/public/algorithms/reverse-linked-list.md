# Reverse Linked List

## Category
Linked List

## Description

Reversing a linked list is a fundamental operation in computer science that involves changing the direction of the `next` pointers to make the list point in the opposite direction. This operation is essential for many algorithmic problems, including palindrome checking, reversing sublists, and implementing certain data structures like stacks.

The key insight is that we can reverse a linked list by iterating through it once and flipping each pointer. This can be done iteratively with O(1) space complexity, or recursively using the call stack. Understanding this pattern is crucial for solving a wide variety of linked list manipulation problems.

---

## Concepts

The Linked List Reversal technique is built on several fundamental concepts.

### 1. Pointer Manipulation

Reversing a linked list involves three key pointers:

| Pointer | Purpose | Initial Value | Final Value |
|---------|---------|---------------|-------------|
| **Previous** | Points to already reversed portion | None | New tail (old head) |
| **Current** | Node being processed | Head | None |
| **Next** | Preserves access to unprocessed list | current.next | None |

### 2. Link Reversal Process

For each node, we perform three operations:

```
Step 1: Save next = current.next  (Preserve remaining list)
Step 2: current.next = prev      (Reverse the link)
Step 3: Advance pointers         (Move to next node)
        prev = current
        current = next
```

### 3. Reversal Variants

| Variant | Description | Time | Space |
|---------|-------------|------|-------|
| **Full Reversal** | Reverse entire list | O(n) | O(1) iterative / O(n) recursive |
| **Partial Reversal** | Reverse from position m to n | O(n) | O(1) |
| **K-Group Reversal** | Reverse in groups of k | O(n) | O(1) |
| **Alternate K** | Reverse k, skip k, repeat | O(n) | O(1) |

### 4. Dummy Node Pattern

The dummy node technique simplifies edge case handling:

- Eliminates special cases for empty lists or head manipulation
- Provides a stable attachment point
- Returns `dummy.next` as the actual result

---

## Frameworks

Structured approaches for solving linked list reversal problems.

### Framework 1: Iterative Full Reversal Template

```
┌─────────────────────────────────────────────────────────┐
│  ITERATIVE FULL REVERSAL FRAMEWORK                        │
├─────────────────────────────────────────────────────────┤
│  1. Initialize pointers:                                  │
│     - prev = None                                        │
│     - current = head                                     │
│                                                           │
│  2. While current is not None:                           │
│     a. next_node = current.next   (Save next)           │
│     b. current.next = prev        (Reverse link)        │
│     c. prev = current             (Move prev forward)   │
│     d. current = next_node        (Move current forward)│
│                                                           │
│  3. Return prev (new head of reversed list)             │
└─────────────────────────────────────────────────────────┘
```

**When to use**: Reversing an entire linked list iteratively.

### Framework 2: Recursive Reversal Template

```
┌─────────────────────────────────────────────────────────┐
│  RECURSIVE REVERSAL FRAMEWORK                             │
├─────────────────────────────────────────────────────────┤
│  1. Base case:                                          │
│     - If head is None or head.next is None:             │
│       → Return head (list of 0 or 1 node is reversed)   │
│                                                           │
│  2. Recursive case:                                    │
│     a. new_head = reverse(head.next)   (Reverse rest)   │
│     b. head.next.next = head           (Reverse link)   │
│     c. head.next = None                (Clean up)       │
│     d. Return new_head                  (Return new head)│
│                                                           │
│  Key insight: Recursion reaches end first, then reverses │
│  links on the way back up the call stack                 │
└─────────────────────────────────────────────────────────┘
```

**When to use**: When recursion is natural and stack space isn't a concern.

### Framework 3: Partial Reversal Template

```
┌─────────────────────────────────────────────────────────┐
│  PARTIAL REVERSAL FRAMEWORK (Reverse from m to n)        │
├─────────────────────────────────────────────────────────┤
│  1. Create dummy node before head                        │
│     dummy.next = head                                    │
│                                                           │
│  2. Traverse to position m-1:                           │
│     - prev = dummy                                       │
│     - For i from 1 to m-1: prev = prev.next             │
│                                                           │
│  3. Reverse n-m+1 nodes:                                 │
│     - current = prev.next                               │
│     - For i from 0 to n-m:                              │
│       → next_node = current.next                        │
│       → current.next = next_node.next                   │
│       → next_node.next = prev.next                      │
│       → prev.next = next_node                           │
│                                                           │
│  4. Return dummy.next                                   │
└─────────────────────────────────────────────────────────┘
```

**When to use**: Reversing a portion of a linked list (positions m to n).

---

## Forms

Different manifestations of the linked list reversal pattern.

### Form 1: Full List Reversal

Reverse the entire linked list from head to tail.

```
Before: 1 → 2 → 3 → 4 → 5 → None
After:  5 → 4 → 3 → 2 → 1 → None
```

| Approach | Time | Space | Best For |
|----------|------|-------|----------|
| Iterative | O(n) | O(1) | Production code, large lists |
| Recursive | O(n) | O(n) | Educational, small lists |

### Form 2: Partial Reversal

Reverse only a portion of the list.

```
Before: 1 → 2 → 3 → 4 → 5 → None
         [reverse 2-4]
After:  1 → 4 → 3 → 2 → 5 → None
```

**Common patterns**:
- Reverse first k nodes
- Reverse last k nodes
- Reverse between positions m and n

### Form 3: K-Group Reversal

Reverse nodes in groups of k.

```
List: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8, k = 3

Step 1: [3 → 2 → 1] → 4 → 5 → 6 → 7 → 8
Step 2: 3 → 2 → 1 → [6 → 5 → 4] → 7 → 8
Step 3: 3 → 2 → 1 → 6 → 5 → 4 → [8 → 7] (remain, < k nodes)
```

**Algorithm**:
1. Check if k nodes available
2. Reverse k nodes
3. Connect with previous and next groups
4. Repeat until end

### Form 4: Alternating Reversal

Reverse every k nodes, then skip k nodes.

```
List: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8, reverse k=2

Step 1: [2 → 1] → 3 → 4 → 5 → 6 → 7 → 8
Step 2: 2 → 1 → [skip 3,4] → [6 → 5] → 7 → 8
Step 3: 2 → 1 → 3 → 4 → 6 → 5 → [skip 7,8]
```

### Form 5: Palindrome Reversal Pattern

Use reversal to check if a linked list is a palindrome.

```
Steps:
1. Find middle using fast/slow pointers
2. Reverse second half
3. Compare first half with reversed second half
4. (Optional) Restore the original list

List: 1 → 2 → 3 → 2 → 1
Middle: 3
Reverse second half: 1 → 2 → 3 → 1 → 2
Compare: 1,2 == 1,2 → Palindrome!
```

---

## Tactics

Specific techniques and optimizations.

### Tactic 1: Save Next Before Reversing

Always preserve access to the remaining list:

```python
def reverse_list_safe(head: ListNode) -> ListNode:
    """
    Safe reversal - always save next before overwriting.
    """
    prev = None
    current = head
    
    while current:
        # MUST save next before we overwrite current.next
        next_node = current.next
        
        # Now safe to reverse
        current.next = prev
        
        # Advance
        prev = current
        current = next_node
    
    return prev
```

### Tactic 2: Dummy Node for Edge Cases

Use dummy node to handle all edge cases uniformly:

```python
def reverse_between_with_dummy(head: ListNode, left: int, right: int) -> ListNode:
    """
    Partial reversal with dummy node for clean edge case handling.
    """
    dummy = ListNode(0)
    dummy.next = head
    
    # Find node before reversal section
    prev = dummy
    for _ in range(left - 1):
        prev = prev.next
    
    # Reverse the section
    current = prev.next
    for _ in range(right - left):
        next_node = current.next
        current.next = next_node.next
        next_node.next = prev.next
        prev.next = next_node
    
    return dummy.next
```

### Tactic 3: Recursive with Proper Base Case

```python
def reverse_recursive_proper(head: ListNode) -> ListNode:
    """
    Proper recursive reversal with correct base case handling.
    """
    # Base case: empty list or single node
    if not head or not head.next:
        return head
    
    # Reverse the rest of the list
    new_head = reverse_recursive_proper(head.next)
    
    # Now head.next is the last node of reversed sublist
    # Make it point back to head
    head.next.next = head
    
    # Prevent cycle - head should be the last node now
    head.next = None
    
    return new_head
```

### Tactic 4: Stack-Based Reversal (Alternative)

When you need to process in reverse order without modifying:

```python
def reverse_using_stack(head: ListNode) -> ListNode:
    """
    Alternative: Use stack to reverse (not in-place).
    Time: O(n), Space: O(n)
    """
    if not head:
        return None
    
    # Push all nodes to stack
    stack = []
    current = head
    while current:
        stack.append(current)
        current = current.next
    
    # Pop to create reversed list
    new_head = stack.pop()
    current = new_head
    
    while stack:
        current.next = stack.pop()
        current = current.next
    
    current.next = None
    return new_head
```

### Tactic 5: In-Place K-Group Reversal

```python
def reverse_k_group(head: ListNode, k: int) -> ListNode:
    """
    Reverse nodes in groups of k (in-place).
    Time: O(n), Space: O(1)
    """
    dummy = ListNode(0)
    dummy.next = head
    prev_group = dummy
    
    while True:
        # Check if we have k nodes
        kth = prev_group
        for _ in range(k):
            if not kth.next:
                return dummy.next
            kth = kth.next
        
        next_group = kth.next
        
        # Reverse current group
        prev, curr = prev_group.next, prev_group.next.next
        for _ in range(k - 1):
            next_temp = curr.next
            curr.next = prev
            prev = curr
            curr = next_temp
        
        # Connect with previous and next groups
        first_of_group = prev_group.next
        prev_group.next = kth
        first_of_group.next = next_group
        prev_group = first_of_group
```

### Tactic 6: Add Two Numbers (Reversal Application)

```python
def add_two_numbers(l1: ListNode, l2: ListNode) -> ListNode:
    """
    Add two numbers represented by linked lists.
    Numbers stored in reverse order (ones digit first).
    """
    dummy = ListNode(0)
    current = dummy
    carry = 0
    
    while l1 or l2 or carry:
        val1 = l1.val if l1 else 0
        val2 = l2.val if l2 else 0
        
        total = val1 + val2 + carry
        carry = total // 10
        current.next = ListNode(total % 10)
        
        current = current.next
        if l1: l1 = l1.next
        if l2: l2 = l2.next
    
    return dummy.next
```

---

## Python Templates

### Template 1: Iterative Full Reversal

```python
from typing import Optional

class ListNode:
    def __init__(self, val: int = 0, next: Optional['ListNode'] = None):
        self.val = val
        self.next = next

def reverse_list(head: Optional[ListNode]) -> Optional[ListNode]:
    """
    Template: Reverse a singly linked list iteratively.
    Time: O(n), Space: O(1)
    """
    prev = None
    current = head
    
    while current:
        # Save next before we overwrite
        next_node = current.next
        
        # Reverse the link
        current.next = prev
        
        # Advance pointers
        prev = current
        current = next_node
    
    return prev  # New head
```

### Template 2: Recursive Full Reversal

```python
def reverse_list_recursive(head: Optional[ListNode]) -> Optional[ListNode]:
    """
    Template: Reverse a singly linked list recursively.
    Time: O(n), Space: O(n) for call stack
    """
    # Base case
    if not head or not head.next:
        return head
    
    # Reverse the rest of the list
    new_head = reverse_list_recursive(head.next)
    
    # Reverse the current connection
    head.next.next = head
    head.next = None  # Prevent cycle
    
    return new_head
```

### Template 3: Partial Reversal (Reverse Between)

```python
def reverse_between(head: Optional[ListNode], left: int, right: int) -> Optional[ListNode]:
    """
    Template: Reverse nodes from position left to right (1-indexed).
    Time: O(n), Space: O(1)
    """
    if not head or left == right:
        return head
    
    # Dummy node for clean edge case handling
    dummy = ListNode(0)
    dummy.next = head
    
    # Find node before the section to reverse
    prev = dummy
    for _ in range(left - 1):
        prev = prev.next
    
    # Reverse the section
    current = prev.next
    for _ in range(right - left):
        next_node = current.next
        
        # Move next_node to after prev
        current.next = next_node.next
        next_node.next = prev.next
        prev.next = next_node
    
    return dummy.next
```

### Template 4: K-Group Reversal

```python
def reverse_k_group(head: Optional[ListNode], k: int) -> Optional[ListNode]:
    """
    Template: Reverse nodes in groups of k.
    Time: O(n), Space: O(1)
    """
    dummy = ListNode(0)
    dummy.next = head
    prev_group = dummy
    
    while True:
        # Check if we have k nodes remaining
        kth = prev_group
        for _ in range(k):
            if not kth.next:
                return dummy.next
            kth = kth.next
        
        # Save the start of next group
        next_group = kth.next
        
        # Reverse current group
        prev = prev_group.next
        curr = prev.next
        
        for _ in range(k - 1):
            next_temp = curr.next
            curr.next = prev
            prev = curr
            curr = next_temp
        
        # Connect reversed group with previous and next
        first_of_group = prev_group.next
        prev_group.next = kth
        first_of_group.next = next_group
        
        prev_group = first_of_group
```

### Template 5: Palindrome Linked List

```python
def is_palindrome(head: Optional[ListNode]) -> bool:
    """
    Template: Check if linked list is palindrome using reversal.
    Time: O(n), Space: O(1)
    """
    if not head or not head.next:
        return True
    
    # Find middle using fast/slow
    slow, fast = head, head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    # Reverse second half
    second_half = reverse_list(slow.next)
    
    # Compare halves
    first, second = head, second_half
    result = True
    while second:
        if first.val != second.val:
            result = False
            break
        first = first.next
        second = second.next
    
    # Restore the list (optional)
    slow.next = reverse_list(second_half)
    
    return result

# Helper: reverse_list from Template 1
def reverse_list(head: Optional[ListNode]) -> Optional[ListNode]:
    prev, current = None, head
    while current:
        next_node = current.next
        current.next = prev
        prev = current
        current = next_node
    return prev
```

### Template 6: Swap Nodes in Pairs

```python
def swap_pairs(head: Optional[ListNode]) -> Optional[ListNode]:
    """
    Template: Swap every two adjacent nodes.
    Time: O(n), Space: O(1)
    """
    dummy = ListNode(0)
    dummy.next = head
    prev = dummy
    
    while prev.next and prev.next.next:
        # Nodes to swap
        first = prev.next
        second = prev.next.next
        
        # Swap
        first.next = second.next
        second.next = first
        prev.next = second
        
        # Move to next pair
        prev = first
    
    return dummy.next
```

---

## When to Use

Use the Reverse Linked List algorithm when you need to solve problems involving:

- **Complete List Reversal**: When you need to reverse an entire linked list
- **Partial List Reversal**: When you need to reverse a portion (positions m to n)
- **Palindrome Detection**: When checking if a linked list is a palindrome
- **K-Group Manipulation**: When reversing in groups or alternating patterns
- **Stack Implementation**: When you need LIFO behavior using a linked list

### Comparison with Alternatives

| Approach | Time | Space | Best Use Case |
|----------|------|-------|---------------|
| **Iterative (3-Pointer)** | O(n) | O(1) | General reversal, production code |
| **Recursive** | O(n) | O(n) | Educational, small lists |
| **Stack-Based** | O(n) | O(n) | When you can't modify pointers |
| **Copy & Reverse** | O(n) | O(n) | When original must be preserved |

### When to Choose Each Approach

- **Choose Iterative** when:
  - Working with large lists where space matters
  - Memory is constrained
  - You need maximum efficiency
  - Writing production code

- **Choose Recursive** when:
  - The list is small
  - Code readability is prioritized
  - You're already in a recursive context
  - Educational purposes

- **Choose Partial Reversal** when:
  - Only a portion of the list needs reversing
  - Working with sublists
  - Implementing algorithms like reverse groups

---

## Algorithm Explanation

### Core Concept

The key insight is that we process one node at a time, flipping its `next` pointer to point to the previous node instead of the current next node. By saving `next` before reversing, we never lose access to the rest of the list.

### How It Works

#### Iterative Approach:

1. **Initialize**: Set `prev = None`, `current = head`, `next = None`
2. **Iterate**: While `current` is not None:
   - Save `next = current.next` (preserve the rest of the list)
   - Reverse the link: `current.next = prev`
   - Move forward: `prev = current`, `current = next`
3. **Complete**: When `current` reaches None, `prev` points to the new head

#### Recursive Approach:

1. **Base Case**: If `head` is None or `head.next` is None, return `head`
2. **Recurse**: Call recursively on `head.next` to reverse the rest
3. **Reverse**: After recursion returns, set `head.next.next = head` and `head.next = None`
4. **Return**: Return the new head from the deepest recursion

### Visual Representation

For list `1 → 2 → 3 → 4 → 5`:

```
Initial:    prev=None, curr=1
            1 → 2 → 3 → 4 → 5 → None

Step 1:     next=2
            1 ← prev, curr=2
            1 → None, 2 → 3 → 4 → 5 → None

Step 2:     next=3
            2 → 1 → None, curr=3
            2 → 1 → None, 3 → 4 → 5 → None

Step 3:     next=4
            3 → 2 → 1 → None, curr=4
            
Step 4:     next=5
            4 → 3 → 2 → 1 → None, curr=5

Step 5:     next=None
            5 → 4 → 3 → 2 → 1 → None (prev = new head)
```

### Why It Works

- We process one node at a time, never losing access to the rest of the list
- By saving `next` before reversing, we preserve the remaining list
- Each node's pointer is flipped exactly once
- The process is deterministic and completes in exactly n iterations

### Limitations

- **Destructive operation**: Modifies the original list structure
- **Single traversal**: Cannot be easily parallelized
- **Pointer manipulation**: Requires careful handling to avoid losing nodes
- **Not applicable to immutable lists**: Some functional languages discourage this pattern

---

## Practice Problems

### Problem 1: Reverse Linked List

**Problem:** [LeetCode 206 - Reverse Linked List](https://leetcode.com/problems/reverse-linked-list/)

**Description:** Given the head of a singly linked list, reverse the list, and return the reversed list.

**How to Apply:**
- Use the iterative 3-pointer technique
- Handle edge cases: empty list, single node
- Return the new head pointer

---

### Problem 2: Reverse Linked List II

**Problem:** [LeetCode 92 - Reverse Linked List II](https://leetcode.com/problems/reverse-linked-list-ii/)

**Description:** Given the head of a singly linked list and two integers left and right, reverse the nodes of the list from position left to position right, and return the reversed list.

**How to Apply:**
- Use dummy node for edge cases
- Locate the node before reversal point
- Reverse exactly (right - left + 1) nodes
- Reconnect the reversed section

---

### Problem 3: Palindrome Linked List

**Problem:** [LeetCode 234 - Palindrome Linked List](https://leetcode.com/problems/palindrome-linked-list/)

**Description:** Given the head of a singly linked list, return true if it is a palindrome or false otherwise.

**How to Apply:**
- Find middle using slow/fast pointers
- Reverse the second half
- Compare first half with reversed second half
- Optionally restore the list

---

### Problem 4: Reverse Nodes in k-Group

**Problem:** [LeetCode 25 - Reverse Nodes in k-Group](https://leetcode.com/problems/reverse-nodes-in-k-group/)

**Description:** Given the head of a linked list, reverse each group of k nodes, and return the modified list. If the number of nodes is not a multiple of k, the last group should remain as-is.

**How to Apply:**
- For each group: check if k nodes available
- Reverse k nodes in place
- Connect reversed group with previous and next groups
- Move to next group

---

### Problem 5: Swap Nodes in Pairs

**Problem:** [LeetCode 24 - Swap Nodes in Pairs](https://leetcode.com/problems/swap-nodes-in-pairs/)

**Description:** Given a linked list, swap every two adjacent nodes and return its head.

**How to Apply:**
- Use a variation of in-place reversal
- Process two nodes at a time
- Update pointers to maintain list structure
- Use dummy node for clean edge cases

---

### Problem 6: Add Two Numbers

**Problem:** [LeetCode 2 - Add Two Numbers](https://leetcode.com/problems/add-two-numbers/)

**Description:** You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order. Add the two numbers and return the sum as a linked list.

**How to Apply:**
- Traverse both lists simultaneously
- Handle carry propagation
- Create new nodes for result
- Similar pointer manipulation patterns

---

## Video Tutorial Links

### Fundamentals

- [Reverse Linked List - Iterative (Take U Forward)](https://www.youtube.com/watch?v=G0_I-ZF0S20) - Complete iterative solution
- [Reverse Linked List - Recursive (Take U Forward)](https://www.youtube.com/watch?v=KYH83T7eqT4) - Recursive approach explained
- [Reverse Linked List (NeetCode)](https://www.youtube.com/watch?v=1L88h1oPB8I) - Clear explanation

### Advanced Topics

- [Reverse Linked List II (NeetCode)](https://www.youtube.com/watch?v=oIRm4yT4lX0) - Partial reversal
- [Reverse Nodes in k-Group](https://www.youtube.com/watch?v=1L88h1oPB8I) - K-group reversal
- [Palindrome Linked List](https://www.youtube.com/watch?v=yOzX4dR7zWQ) - Using reversal for palindrome check

---

## Follow-up Questions

### Q1: How do you reverse a linked list in place without using extra space?

**Answer:** Use the iterative 3-pointer approach:
- Maintain `prev`, `current`, and save `next` temporarily
- For each node, reverse its `next` pointer to point to `prev`
- Move all pointers forward by one position
- This achieves O(1) space complexity

---

### Q2: What are the differences between iterative and recursive approaches?

**Answer:**

| Aspect | Iterative | Recursive |
|--------|-----------|-----------|
| Space | O(1) | O(n) |
| Speed | Faster (no function call overhead) | Slightly slower |
| Readability | More explicit | More elegant |
| Stack Risk | None | Possible stack overflow for large lists |
| Tail Recursion | N/A | Possible optimization in some languages |

---

### Q3: How do you handle edge cases in linked list reversal?

**Answer:**
- **Empty list (head = null)**: Return null immediately
- **Single node**: Return head as-is (reversing doesn't change anything)
- **Two nodes**: Works with standard algorithm
- **Circular lists**: Not applicable - check for cycle first
- **Partial reversal boundaries**: Use dummy node for clean handling

---

### Q4: Can you reverse a linked list using only two pointers?

**Answer:** Yes, but with a modified approach:
- Use only `prev` and `current` pointers
- For each iteration, save `current.next` before overwriting
- This is essentially the same as the 3-pointer approach with temporary storage
- The "3-pointer" name comes from the conceptual model, not actual variable count

---

### Q5: How do you reverse a portion of a linked list between positions m and n?

**Answer:**
1. Create a dummy node before head
2. Traverse to the node at position m-1 (the node before reversal starts)
3. Reverse n-m+1 nodes starting from position m
4. Reconnect the reversed portion with the rest of the list
5. Return dummy.next as the new head

The dummy node eliminates special cases for reversing from the head position.

---

## Summary

Reversing a linked list is a fundamental operation with numerous applications in algorithm problems. Key takeaways:

- **Core technique**: Process one node at a time, flipping the `next` pointer to the previous node
- **Iterative approach**: O(n) time, O(1) space - preferred for most cases
- **Recursive approach**: O(n) time, O(n) space - elegant but uses more memory
- **Partial reversal**: Useful for sublist manipulation problems
- **Key insight**: Always save `next` before reversing to preserve the rest of the list

When to use:
- ✅ Complete list reversal
- ✅ Partial list reversal (sublist problems)
- ✅ Palindrome checking
- ✅ K-group manipulation
- ✅ Stack-like behavior implementation

When NOT to use:
- ❌ When you need O(1) space AND have severe recursion limits (use iterative)
- ❌ When the original list must be preserved (create a copy first)

This algorithm is essential for technical interviews and competitive programming, forming the foundation for many more complex linked list operations.
