# Middle Node

## Category
Linked List

## Description
Find the middle node of a linked list using fast and slow pointers.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- linked list related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Explanation

The **fast and slow pointer** (also known as the "tortoise and hare") technique is an elegant solution for finding the middle of a linked list. Here's how it works:

### How Two Pointers Work

1. **Initialize two pointers** at the head of the linked list:
   - **Slow pointer** (or "tortoise"): moves 1 step at a time
   - **Fast pointer** (or "hare"): moves 2 steps at a time

2. **Traverse the list** by moving both pointers simultaneously:
   - In each iteration, slow advances by 1 node
   - In each iteration, fast advances by 2 nodes

3. **Stop when** the fast pointer reaches the end of the list (either `fast` is `None` or `fast.next` is `None`)

4. **The slow pointer** will now be at the middle node

### Why This Finds the Middle

When the fast pointer reaches the end, it has traveled exactly twice the distance of the slow pointer. If the list has `n` nodes:
- Fast pointer travels `n` nodes
- Slow pointer travels `n/2` nodes

This means the slow pointer is precisely at position `n/2`, which is the middle.

### Edge Cases

1. **Empty List** (`head = None`): Return `None` - the function handles this naturally since the while loop never executes

2. **Single Node** (`head.next = None`): Return the head node - slow and fast both start at head, loop doesn't execute, returns head

3. **Even Number of Nodes** (e.g., 4 nodes): Returns the **second middle** node (node at index 2, 0-indexed). For [1,2,3,4], returns node 3

4. **Odd Number of Nodes** (e.g., 5 nodes): Returns the exact middle node. For [1,2,3,4,5], returns node 3

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
    """
    Definition for singly-linked list node.
    
    Attributes:
        val: The value stored in the node.
        next: Pointer to the next node in the linked list.
    """
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def middle_node(head: ListNode) -> ListNode:
    """
    Find the middle node of a singly linked list.
    
    Uses the fast and slow pointer technique where:
    - Slow pointer moves 1 step at a time
    - Fast pointer moves 2 steps at a time
    
    When fast reaches the end, slow will be at the middle.
    
    Args:
        head: The head of the linked list.
        
    Returns:
        The middle node of the linked list.
        - For odd length: returns the exact middle node
        - For even length: returns the second middle node
        - For empty list: returns None
        - For single node: returns that node
        
    Time: O(n)
    Space: O(1)
    
    Examples:
        >>> head = ListNode(1, ListNode(2, ListNode(3, ListNode(4, ListNode(5)))))
        >>> middle_node(head).val
        3
        
        >>> head = ListNode(1, ListNode(2, ListNode(3, ListNode(4))))
        >>> middle_node(head).val
        3
    """
    if not head:
        return None
    
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    return slow
```

```javascript
function middleNode(head) {
    // Middle Node implementation
    // Time: O(n)
    // Space: O(1)
    let slow = head;
    let fast = head;
    
    while (fast && fast.next) {
        slow = slow.next;
        fast = fast.next.next;
    }
    
    return slow;
}
```

---

## Example

**Input:**
```
Linked List: 1 -> 2 -> 3 -> 4 -> 5

Structure:
1 -> 2 -> 3 -> 4 -> 5 -> None
^    ^    ^    ^    ^
0    1    2    3    4  (indices)
```

**Output:**
```
Node with value 3

Explanation:
- Initial: slow=1, fast=1
- Step 1: slow=2, fast=3 (fast moves 2, slow moves 1)
- Step 2: slow=3, fast=5 (fast moves 2, slow moves 1)
- Fast is at end (5.next = None), stop
- Slow is at node 3, return it
```

**Another Example:**

**Input:**
```
Linked List: 1 -> 2 -> 3 -> 4
```

**Output:**
```
Node with value 3

Explanation:
For even-length lists, returns the second middle node (node at index n/2)
```

---

## Time Complexity
**O(n)** - We traverse the entire list once, with the fast pointer moving at 2x speed

---

## Space Complexity
**O(1)** - Only two pointers are used regardless of input size

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
