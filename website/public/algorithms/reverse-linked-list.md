# Reverse Linked List

## Category
Linked List

## Description
Reverse a singly linked list iteratively or recursively.

## Algorithm Explanation
Reversing a linked list is a fundamental operation that involves changing the direction of the `next` pointers. There are two main approaches: iterative (more space-efficient) and recursive.

**Iterative Approach (3-Pointer Technique):**
1. Maintain three pointers: `prev`, `current`, and `next`
2. Start with `prev = None`, `current = head`
3. For each node:
   - Save `next = current.next`
   - Reverse the pointer: `current.next = prev`
   - Move `prev` and `current` forward
4. Continue until `current` becomes None
5. Return `prev` (new head)

**Why it works:**
- We reverse one link at a time
- `prev` tracks the reversed portion (becomes new head)
- `current` processes remaining nodes
- `next` saves the rest of the list

**Recursive Approach:**
- Base case: if head is None or head.next is None, return head
- Recursively reverse the rest of the list
- After recursion returns, reverse the current node's pointer
- Handle edge cases for head and tail

**Time Complexity:** O(n) for both approaches
**Space Complexity:** O(1) for iterative, O(n) for recursive (call stack)

---

## When to Use
Use this algorithm when you need to solve problems involving:
- linked list related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Steps
1. Understand the problem constraints and requirements
2. Identify the input and expected output
3. Apply the core algorithm logic
4. Handle edge cases appropriately
5. Optimize for the given constraints

---

## Implementation

```python
class ListNode:
    """Definition for singly-linked list node."""
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def reverse_list(head):
    """
    Reverse a singly linked list iteratively.
    
    Args:
        head: Head of the linked list
    
    Returns:
        New head of the reversed list
    
    Time: O(n)
    Space: O(1)
    """
    prev = None
    current = head
    
    while current:
        next_node = current.next  # Save next
        current.next = prev       # Reverse link
        prev = current            # Move prev forward
        current = next_node       # Move current forward
    
    return prev


def reverse_list_recursive(head):
    """
    Reverse a singly linked list recursively.
    
    Time: O(n)
    Space: O(n) for call stack
    """
    # Base case: empty list or single node
    if not head or not head.next:
        return head
    
    # Reverse the rest of the list
    new_head = reverse_list_recursive(head.next)
    
    # Reverse the current node's pointer
    head.next.next = head
    head.next = None
    
    return new_head


def reverse_list_range(head, left, right):
    """
    Reverse a portion of the linked list from position left to right.
    1-indexed positions.
    """
    if not head or left == right:
        return head
    
    # Create dummy node to handle edge case of reversing from head
    dummy = ListNode(0)
    dummy.next = head
    
    # Find node before the reversal portion
    prev = dummy
    for _ in range(left - 1):
        prev = prev.next
    
    # Reverse the portion
    current = prev.next
    for _ in range(right - left):
        next_node = current.next
        current.next = next_node.next
        next_node.next = prev.next
        prev.next = next_node
    
    return dummy.next


def reverse_between(head, left, right):
    """Alternative implementation with more detailed steps."""
    if left == right:
        return head
    
    dummy = ListNode(0, head)
    prev = dummy
    
    # Move prev to node before left
    for _ in range(left - 1):
        prev = prev.next
    
    # Start reversing
    current = prev.next
    for _ in range(right - left):
        temp = current.next
        current.next = temp.next
        temp.next = prev.next
        prev.next = temp
    
    return dummy.next
```

```javascript
function reverseList(head) {
    let prev = null;
    let current = head;
    
    while (current) {
        const next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    
    return prev;
}

function reverseListRecursive(head) {
    if (!head || !head.next) return head;
    
    const newHead = reverseListRecursive(head.next);
    head.next.next = head;
    head.next = null;
    
    return newHead;
}
```

---

## Example

**Input:**
```
List: 1 -> 2 -> 3 -> 4 -> 5
```

**Output:**
```
List: 5 -> 4 -> 3 -> 2 -> 1
```

**Step-by-step (iterative):**
- Initial: prev=None, curr=1
- After step 1: prev=1, curr=2, list: 1->None
- After step 2: prev=2, curr=3, list: 2->1->None
- After step 3: prev=3, curr=4, list: 3->2->1->None
- After step 4: prev=4, curr=5, list: 4->3->2->1->None
- After step 5: prev=5, curr=None, list: 5->4->3->2->1->None

**Input - Single node:**
```
List: 1
```

**Output:**
```
List: 1
```

**Input - Empty list:**
```
List: None
```

**Output:**
```
None
```

**Input - Reverse range:**
```
List: 1 -> 2 -> 3 -> 4 -> 5
left = 2, right = 4
```

**Output:**
```
List: 1 -> 4 -> 3 -> 2 -> 5
```

**Explanation:** Reversed nodes 2-4 (positions 2,3,4)

---

## Time Complexity
**O(n)**

---

## Space Complexity
**O(1) iterative, O(n) recursive**

---

## Common Variations
- Iterative vs Recursive implementation
- Space-optimized versions
- Modified versions for specific constraints

---

## Related Problems
- Practice problems that use this algorithm pattern
- Similar algorithms in the same category

---

## Tips
- Always consider edge cases
- Think about time vs space trade-offs
- Look for opportunities to optimize
