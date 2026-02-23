# Fast & Slow Pointers

## Category
Linked List

## Description
Use two pointers moving at different speeds to detect cycles or find middle elements.

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

## Algorithm Explanation

The Fast and Slow pointers technique (also known as Floyd's Cycle Detection Algorithm) uses two pointers moving at different speeds to detect cycles or find the middle of a linked list.

**How it works:**
1. **Slow pointer** moves one step at a time
2. **Fast pointer** moves two steps at a time
3. If there's a cycle, fast pointer will eventually "lap" the slow pointer and they will meet

**Why it works:**
In a cyclic list, imagine the fast pointer is k steps ahead. Each iteration, the distance between them decreases by 1. Eventually, they must meet within at most the cycle length.

**Applications:**
1. **Cycle Detection**: Detect if a linked list has a cycle
2. **Find Middle**: Find the middle of a linked list (fast reaches end, slow is at middle)
3. **Happy Number Detection**: Detect if a number is happy
4. **Find Duplicate in Circular Array**: Find the duplicate in a circular array

**Key Insights:**
- Time to detect cycle: O(μ + λ) where μ is distance to cycle start, λ is cycle length
- If fast reaches null, no cycle exists
- When they meet, slow has traveled d steps, fast has traveled 2d steps

---

## Implementation

```python
class ListNode:
    """Definition for singly-linked list node."""
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next


def has_cycle(head):
    """
    Detect if a cycle exists in linked list using Floyd's algorithm.
    
    Args:
        head: Head of the linked list
        
    Returns:
        True if cycle exists, False otherwise
        
    Time: O(n)
    Space: O(1)
    """
    if not head or not head.next:
        return False
    
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next        # Move slow by 1
        fast = fast.next.next   # Move fast by 2
        
        if slow == fast:        # They met - cycle exists!
            return True
    
    return False


def find_cycle_start(head):
    """
    Find the starting node of the cycle if it exists.
    
    Uses the theorem: Distance from head to cycle start = 
                     Distance from meeting point to cycle start
    """
    if not head or not head.next:
        return None
    
    # Phase 1: Find meeting point
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    
    if not fast or not fast.next:
        return None  # No cycle
    
    # Phase 2: Find cycle start
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow


def find_middle(head):
    """
    Find the middle of the linked list.
    
    When fast reaches end, slow is at middle.
    For even-length lists, returns the second middle node.
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
function fastSlowPointers() {
    // Fast & Slow Pointers implementation
    // Time: O(n)
    // Space: O(1)
}
```

---

## Example

**Input:**
```
Linked List: 1 -> 2 -> 3 -> 4 -> 5
                   |              |
                   <-<-<-<-<-<-<-|
```

**Output:**
```
True (cycle exists at node with value 2)
```

**Explanation:**
- Starting with head = 1
- Slow moves: 1 → 2 → 3 → 4 → 5 → 2 → 3 → ...
- Fast moves: 1 → 3 → 5 → 2 → 4 → 3 → ...
- They meet at node 3 (or some node in cycle)
- Therefore, cycle is detected

**Additional Example - No Cycle:**
```
Input: 1 -> 2 -> 3 -> 4 -> 5 -> None
Output: False

Explanation: Fast pointer reaches None, no cycle exists
```

**Find Middle Example:**
```
Input: 1 -> 2 -> 3 -> 4 -> 5
Output: Node with value 3

Input: 1 -> 2 -> 3 -> 4 -> 5 -> 6
Output: Node with value 4 (second middle for even length)
```

---

## Time Complexity
**O(n)**

---

## Space Complexity
**O(1)**

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
