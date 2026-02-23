# Detect Cycle

## Category
Linked List

## Description
Use Floyd's cycle detection algorithm to find if a linked list has a cycle.

---

## When to Use
Use this algorithm when you need to solve problems involving:
- linked list related operations
- Efficient traversal or search operations
- Optimization problems where this pattern applies

---

## Algorithm Explanation
Floyd's Tortoise and Hare algorithm (also known as cycle detection) is an efficient algorithm to detect if a linked list has a cycle. It's named after the two pointers that move at different speeds - like the fabled race between a tortoise and a hare.

### How It Works:
The algorithm uses two pointers moving at different speeds:
- **Tortoise (slow pointer)**: Moves 1 step at a time
- **Hare (fast pointer)**: Moves 2 steps at a time

If there's a cycle:
- The two pointers will eventually meet inside the cycle
- The fast pointer "laps" the slow pointer

If there's no cycle:
- The fast pointer will reach the end (null)

### Why It Works:
1. In a cycle of length C, after the slow pointer enters, the fast pointer is at most C-1 steps behind
2. Since fast moves 1 extra step per iteration, they must meet within C steps
3. This mathematical guarantee ensures detection if cycle exists

### Key Properties:
- **Time Complexity**: O(n) - linear time
- **Space Complexity**: O(1) - constant space
- **No modifications needed**: Doesn't modify the original list
- **Optimal**: Proven that O(1) space solution must use this approach

### Finding Cycle Start:
Once cycle is detected, we can find the cycle start by:
1. Reset one pointer to head
2. Move both one step at a time
3. They meet at the cycle start node

---

## Algorithm Steps
1. Initialize slow pointer (tortoise) at head
2. Initialize fast pointer (hare) at head
3. While fast and fast.next are not None:
   - Move slow by 1: slow = slow.next
   - Move fast by 2: fast = fast.next.next
   - If slow == fast: cycle detected
4. Return False (no cycle) if loop exits

---

## Implementation

```python
from typing import Optional


class ListNode:
    """Node class for linked list."""
    def __init__(self, val: int = 0, next: Optional['ListNode'] = None):
        self.val = val
        self.next = next


def has_cycle(head: Optional[ListNode]) -> bool:
    """
    Detect if a linked list has a cycle using Floyd's algorithm.
    
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
        slow = slow.next        # Move 1 step
        fast = fast.next.next   # Move 2 steps
        
        if slow == fast:
            return True
    
    return False


def detect_cycle_start(head: Optional[ListNode]) -> Optional[ListNode]:
    """
    Find the starting node of the cycle if it exists.
    
    Args:
        head: Head of the linked list
    
    Returns:
        Node where cycle starts, or None if no cycle
    
    Time: O(n)
    Space: O(1)
    """
    if not head or not head.next:
        return None
    
    # Phase 1: Find intersection point
    slow = head
    fast = head
    
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        
        if slow == fast:
            break
    
    # No cycle found
    if not fast or not fast.next:
        return None
    
    # Phase 2: Find cycle start
    # Move both pointers one step at a time
    # They will meet at the cycle start
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow


def create_linked_list_with_cycle(values: list, cycle_pos: int) -> Optional[ListNode]:
    """
    Create a linked list with an optional cycle for testing.
    
    Args:
        values: List of values to create nodes from
        cycle_pos: Index where cycle should point to (-1 for no cycle)
    
    Returns:
        Head of the linked list
    """
    if not values:
        return None
    
    # Create nodes
    nodes = [ListNode(val) for val in values]
    
    # Connect nodes
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i + 1]
    
    # Create cycle if specified
    if cycle_pos >= 0 and cycle_pos < len(nodes):
        nodes[-1].next = nodes[cycle_pos]
    
    return nodes[0]


def list_to_array(head: Optional[ListNode], max_len: int = 20) -> list:
    """Convert linked list to array for display."""
    result = []
    current = head
    count = 0
    
    while current and count < max_len:
        result.append(current.val)
        current = current.next
        count += 1
    
    if current:
        result.append("...")
    
    return result


# Example usage
if __name__ == "__main__":
    print("Floyd's Cycle Detection Algorithm")
    print("=" * 40)
    
    # Test case 1: Linked list with cycle
    # 3 -> 2 -> 0 -> -4 -> (back to 2)
    values1 = [3, 2, 0, -4]
    head1 = create_linked_list_with_cycle(values1, cycle_pos=1)
    
    print("\nTest 1: List with cycle [3,2,0,-4] -> cycle at index 1")
    print(f"  Has cycle: {has_cycle(head1)}")
    
    cycle_node = detect_cycle_start(head1)
    if cycle_node:
        print(f"  Cycle starts at node with value: {cycle_node.val}")
    
    # Test case 2: Linked list without cycle
    values2 = [1, 2, 3, 4, 5]
    head2 = create_linked_list_with_cycle(values2, cycle_pos=-1)
    
    print("\nTest 2: List without cycle [1,2,3,4,5]")
    print(f"  Has cycle: {has_cycle(head2)}")
    
    # Test case 3: Single node with self-loop
    head3 = ListNode(1)
    head3.next = head3  # Self-loop
    
    print("\nTest 3: Single node with self-loop")
    print(f"  Has cycle: {has_cycle(head3)}")
    
    # Test case 4: Single node without cycle
    head4 = ListNode(1)
    
    print("\nTest 4: Single node without cycle")
    print(f"  Has cycle: {has_cycle(head4)}")

```javascript
function detectCycle() {
    // Detect Cycle implementation
    // Time: O(n)
    // Space: O(1)
}
```

---

## Example

**Input:**
```
Test 1: List: 3 -> 2 -> 0 -> -4 -> (points back to 2)
Test 2: List: 1 -> 2 -> 3 -> 4 -> 5 -> None
Test 3: Single node with self-loop: 1 -> (points to itself)
```

**Output:**
```
Test 1: List with cycle [3,2,0,-4] -> cycle at index 1
  Has cycle: True
  Cycle starts at node with value: 2

Test 2: List without cycle [1,2,3,4,5]
  Has cycle: False

Test 3: Single node with self-loop
  Has cycle: True

Test 4: Single node without cycle
  Has cycle: False

Explanation:
- Test 1: Fast pointer laps slow pointer inside the cycle
- Test 2: Fast pointer reaches None (end of list)
- Test 3: Single node pointing to itself is a cycle
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
